import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDbPool, initDb, logActivity } from '@/lib/db';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT id, email, password_hash, name, role FROM admins WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const passwordValid = bcrypt.compareSync(password, admin.password_hash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await createAdminToken(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      Boolean(rememberMe)
    );

    // Save session in MySQL
    const days = rememberMe ? 30 : 1;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO sessions (token, admin_id, expires_at, created_at)
       VALUES (?, ?, ?, NOW())`,
      [token, admin.id, expiresAt]
    );

    // Update last login
    await db.query('UPDATE admins SET last_login_at = NOW() WHERE id = ?', [admin.id]);

    // Log Activity
    await logActivity(admin.email, 'LOGIN', 'ADMIN', admin.id, {
      ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || '',
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set HTTP-only Cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: days * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during authentication.' },
      { status: 500 }
    );
  }
}
