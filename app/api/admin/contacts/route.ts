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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '15', 10)));
    const offset = (page - 1) * limit;

    const search = (searchParams.get('search') || '').trim();
    const status = (searchParams.get('status') || 'all').trim();
    const category = (searchParams.get('category') || '').trim();

    const db = getDbPool();

    // Base query conditions
    const whereConditions: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (status && status !== 'all') {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    if (category) {
      whereConditions.push('category = ?');
      queryParams.push(category);
    }

    if (search) {
      whereConditions.push(
        '(name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR message LIKE ?)'
      );
      const s = `%${search}%`;
      queryParams.push(s, s, s, s, s);
    }

    const whereClause = whereConditions.join(' AND ');

    // Total count with filters
    const [countRows]: any = await db.query(
      `SELECT count(*) as count FROM contact_submissions WHERE ${whereClause}`,
      queryParams
    );
    const total = countRows[0]?.count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // Get paginated items
    const [items]: any = await db.query(
      `SELECT id, name, email, phone, company, category, subject, message, source_page, status, ip_address, user_agent, notes, created_at, updated_at
       FROM contact_submissions
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Get breakdown counts by status
    const [counts]: any = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as \`read\`,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived
      FROM contact_submissions
    `);

    // Get today's count
    const [todayCount]: any = await db.query(`
      SELECT COUNT(*) as todayCount 
      FROM contact_submissions 
      WHERE DATE(created_at) = CURDATE()
    `);

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      totalPages,
      statusCounts: {
        total: counts[0]?.total || 0,
        unread: counts[0]?.unread || 0,
        read: counts[0]?.read || 0,
        replied: counts[0]?.replied || 0,
        archived: counts[0]?.archived || 0,
        today: todayCount[0]?.todayCount || 0,
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/contacts error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Contact submission ID is required.' }, { status: 400 });
    }

    const db = getDbPool();

    // Verify submission exists
    const [existing]: any = await db.query('SELECT id, name, email, status FROM contact_submissions WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Contact submission not found.' }, { status: 404 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      const validStatuses = ['unread', 'read', 'replied', 'archived'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
      }
      updates.push('status = ?');
      params.push(status);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
    }

    params.push(id);
    await db.query(`UPDATE contact_submissions SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, params);

    await logActivity(
      admin.email,
      'update_contact',
      'contact_submission',
      id,
      { status, hasNotes: notes !== undefined, contactName: existing[0].name }
    );

    return NextResponse.json({
      success: true,
      message: 'Contact inquiry updated successfully.',
    });
  } catch (error: any) {
    console.error('PATCH /api/admin/contacts error:', error);
    return NextResponse.json({ error: 'Failed to update contact inquiry.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contact submission ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [existing]: any = await db.query('SELECT name, email FROM contact_submissions WHERE id = ?', [id]);
    const name = existing[0]?.name || 'Unknown';

    await db.query('DELETE FROM contact_submissions WHERE id = ?', [id]);

    await logActivity(admin.email, 'delete_contact', 'contact_submission', id, { contactName: name });

    return NextResponse.json({
      success: true,
      message: 'Contact submission deleted successfully.',
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/contacts error:', error);
    return NextResponse.json({ error: 'Failed to delete contact inquiry.' }, { status: 500 });
  }
}
