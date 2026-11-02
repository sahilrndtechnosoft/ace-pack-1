import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
    const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);
    const action = searchParams.get('action');

    const db = getDbPool();
    let query = 'SELECT * FROM activity_logs WHERE 1=1 ';
    const params: any[] = [];

    if (action) {
      query += ' AND action = ? ';
      params.push(action);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ? ';
    params.push(limit, offset);

    const [logs]: any = await db.query(query, params);
    const [countRows]: any = await db.query('SELECT count(*) as total FROM activity_logs');

    return NextResponse.json({
      success: true,
      logs,
      total: countRows[0]?.total || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Get activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs.' }, { status: 500 });
  }
}
