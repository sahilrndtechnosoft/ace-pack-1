import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getDbPool, initDb } from '../db';

const COOKIE_NAME = 'ace_admin_token';
// Signs admin session tokens. A secret baked into the code would let anyone who has seen the
// source forge an admin login, so it must come from the environment.
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be set in the environment (at least 32 characters, see .env.example).');
}
const JWT_SECRET = new TextEncoder().encode(jwtSecret);

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createAdminToken(admin: AdminPayload, rememberMe = false): Promise<string> {
  const expiresIn = rememberMe ? '30d' : '24h';
  return await new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id || !payload.email) return null;
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name || ''),
      role: String(payload.role || 'super_admin'),
    };
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin(): Promise<AdminPayload | null> {
  try {
    await initDb();
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyAdminToken(token);
    if (!payload) return null;

    // Verify session still valid in MySQL
    const db = getDbPool();
    const [rows]: any = await db.query(
      `SELECT a.id, a.email, a.name, a.role
       FROM sessions s
       JOIN admins a ON s.admin_id = a.id
       WHERE s.token = ? AND s.expires_at > NOW()
       LIMIT 1`,
      [token]
    );

    if (!rows || rows.length === 0) return null;
    return rows[0];
  } catch (err) {
    console.error('getAuthenticatedAdmin error:', err);
    return null;
  }
}

export { COOKIE_NAME };
