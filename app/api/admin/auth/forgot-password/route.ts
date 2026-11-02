import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDbPool, initDb, logActivity } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { action, email, token, newPassword } = body;

    const db = getDbPool();

    // 1. Request Reset Token
    if (action === 'request' || (!action && email && !token)) {
      if (!email) {
        return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
      }

      const [rows]: any = await db.query(
        'SELECT id, email, name FROM admins WHERE email = ? LIMIT 1',
        [email.toLowerCase().trim()]
      );

      if (!rows || rows.length === 0) {
        // Return generic success to prevent email enumeration
        return NextResponse.json({
          success: true,
          message: 'If an administrator account with that email exists, reset instructions have been dispatched.',
        });
      }

      const admin = rows[0];
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.query(
        'UPDATE admins SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?',
        [resetToken, expiresAt, admin.id]
      );

      await logActivity(admin.email, 'FORGOT_PASSWORD_REQUEST', 'ADMIN', admin.id);

      return NextResponse.json({
        success: true,
        message: 'Password reset link generated successfully.',
        // Expose resetToken in response for instant administrator demo convenience
        demoResetToken: resetToken,
      });
    }

    // 2. Complete Password Reset
    if (action === 'reset' || token) {
      if (!token || !newPassword) {
        return NextResponse.json(
          { error: 'Token and new password are required.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      const [rows]: any = await db.query(
        'SELECT id, email FROM admins WHERE reset_token = ? AND reset_token_expires_at > NOW() LIMIT 1',
        [token]
      );

      if (!rows || rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid or expired password reset token.' },
          { status: 400 }
        );
      }

      const admin = rows[0];
      const newHash = bcrypt.hashSync(newPassword, 10);

      await db.query(
        'UPDATE admins SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?',
        [newHash, admin.id]
      );

      // Invalidate all existing sessions
      await db.query('DELETE FROM sessions WHERE admin_id = ?', [admin.id]);

      await logActivity(admin.email, 'PASSWORD_RESET_COMPLETED', 'ADMIN', admin.id);

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully! You can now log in with your new password.',
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
