import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDbPool, initDb, logActivity } from '@/lib/db';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token) {
      const payload = await verifyAdminToken(token);
      if (payload) {
        await logActivity(payload.email, 'LOGOUT', 'ADMIN', payload.id);
      }
      const db = getDbPool();
      await db.query('DELETE FROM sessions WHERE token = ?', [token]);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.delete(COOKIE_NAME);
    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    const response = NextResponse.json({ success: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}
