import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, logActivity } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    const db = getDbPool();

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password.' },
          { status: 400 }
        );
      }

      const [rows]: any = await db.query('SELECT password_hash FROM admins WHERE id = ?', [admin.id]);
      if (!rows || rows.length === 0 || !bcrypt.compareSync(currentPassword, rows[0].password_hash)) {
        return NextResponse.json({ error: 'Current password does not match.' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }

      const newHash = bcrypt.hashSync(newPassword, 10);
      await db.query('UPDATE admins SET password_hash = ? WHERE id = ?', [newHash, admin.id]);
    }

    if (name || email) {
      await db.query('UPDATE admins SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?', [
        name || null,
        email ? email.toLowerCase().trim() : null,
        admin.id,
      ]);
    }

    await logActivity(admin.email, 'UPDATE_PROFILE', 'ADMIN', admin.id, {
      updatedName: Boolean(name),
      updatedEmail: Boolean(email),
      updatedPassword: Boolean(newPassword),
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      admin: {
        id: admin.id,
        email: email || admin.email,
        name: name || admin.name,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
