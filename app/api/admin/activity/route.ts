import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';

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

const MAX_BULK_DELETE = 500;

/** Delete selected activity log entries ({ ids: [] }). The deletion itself is logged afterwards. */
export async function DELETE(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const body = await request.json().catch(() => null);
    const ids: string[] = Array.isArray(body?.ids)
      ? [...new Set<string>(body.ids.filter((v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= 191))]
      : [];
    if (ids.length === 0) {
      return NextResponse.json({ error: 'Select at least one log entry.' }, { status: 400 });
    }
    if (ids.length > MAX_BULK_DELETE) {
      return NextResponse.json({ error: `You can delete up to ${MAX_BULK_DELETE} entries at a time.` }, { status: 400 });
    }
    const [result]: any = await getDbPool().query('DELETE FROM activity_logs WHERE id IN (?)', [ids]);
    // Keep an audit trail of who removed audit entries.
    await logActivity(admin.email, 'DELETE_ACTIVITY_LOGS', 'activity_log', null, { count: result.affectedRows });
    return NextResponse.json({ success: true, deleted: result.affectedRows });
  } catch (error) {
    console.error('Delete activity error:', error);
    return NextResponse.json({ error: 'Failed to delete activity logs.' }, { status: 500 });
  }
}
