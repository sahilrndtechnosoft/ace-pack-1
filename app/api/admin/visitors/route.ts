import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';
import { HOT_LEAD_SCORE, SCORED_VISITORS_SQL, WARM_LEAD_SCORE, leadReasons, leadTier } from '@/lib/analytics/leads';

const MAX_BULK_DELETE = 500;

function withLead<T extends Parameters<typeof leadReasons>[0] & { lead_score: number }>(row: T) {
  return { ...row, lead_score: Number(row.lead_score), lead_tier: leadTier(Number(row.lead_score)), lead_reasons: leadReasons(row) };
}

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const specificVisitorId = searchParams.get('visitor_id');
    const db = getDbPool();

    // Detail view: journey, linked inquiries and visitors sharing the network / device.
    if (specificVisitorId) {
      const [visitorRows]: any = await db.query(`SELECT * FROM (${SCORED_VISITORS_SQL}) s WHERE visitor_id = ? LIMIT 1`, [
        specificVisitorId,
      ]);
      if (!visitorRows?.length) {
        return NextResponse.json({ error: 'Visitor not found.' }, { status: 404 });
      }
      const visitor = withLead(visitorRows[0]);

      const [logs]: any = await db.query(
        `SELECT id, page_url, page_title, referrer, is_new_visitor, created_at
         FROM visitor_logs WHERE visitor_id = ? ORDER BY created_at DESC LIMIT 100`,
        [specificVisitorId]
      );
      const [inquiries]: any = await db.query(
        `SELECT id, name, email, phone, company, category, subject, status, source_page, created_at,
                IF(visitor_id = ?, 'visitor', 'network') AS match_type
         FROM contact_submissions
         WHERE visitor_id = ? OR (visitor_id IS NULL AND ip_address = ?)
         ORDER BY created_at DESC LIMIT 20`,
        [specificVisitorId, specificVisitorId, visitor.ip_address]
      );
      const [related]: any = await db.query(
        `SELECT visitor_id, device_type, browser, os, visit_count, last_visit_at, (user_agent <=> ?) AS same_device
         FROM site_visitors
         WHERE ip_address = ? AND visitor_id <> ?
         ORDER BY same_device DESC, last_visit_at DESC LIMIT 25`,
        [visitor.user_agent, visitor.ip_address, specificVisitorId]
      );

      return NextResponse.json({ success: true, visitor, logs, inquiries, related });
    }

    // List view
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const search = (searchParams.get('search') || '').trim();
    const visitorType = searchParams.get('visitor_type') || 'all';
    const deviceType = searchParams.get('device_type') || 'all';
    const dateRange = searchParams.get('date_range') || 'all';
    const lead = searchParams.get('lead') || 'all';
    const ip = (searchParams.get('ip') || '').trim();
    const deviceOf = (searchParams.get('device_of') || '').trim();
    const sort = searchParams.get('sort') === 'score' ? 'score' : 'recent';

    const where: string[] = ['1=1'];
    const params: (string | number)[] = [];
    if (visitorType === 'new') where.push('visit_count = 1');
    else if (visitorType === 'returning') where.push('visit_count > 1');
    if (deviceType !== 'all') {
      where.push('device_type = ?');
      params.push(deviceType);
    }
    if (dateRange === 'today') where.push('DATE(last_visit_at) = CURDATE()');
    else if (dateRange === '7days') where.push('last_visit_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    else if (dateRange === '30days') where.push('last_visit_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
    if (lead === 'hot') where.push(`lead_score >= ${HOT_LEAD_SCORE}`);
    else if (lead === 'warm') where.push(`lead_score >= ${WARM_LEAD_SCORE} AND lead_score < ${HOT_LEAD_SCORE}`);
    else if (lead === 'cold') where.push(`lead_score < ${WARM_LEAD_SCORE}`);
    else if (lead === 'inquired') where.push('(inquiries > 0 OR ip_inquiries > 0)');
    if (ip) {
      where.push('ip_address = ?');
      params.push(ip);
    }
    if (deviceOf) {
      // Same network and the exact same browser/device as the given visitor.
      where.push(
        '(ip_address, user_agent) = (SELECT ip_address, user_agent FROM site_visitors WHERE visitor_id = ? LIMIT 1)'
      );
      params.push(deviceOf);
    }
    if (search) {
      where.push(
        '(visitor_id LIKE ? OR ip_address LIKE ? OR browser LIKE ? OR os LIKE ? OR initial_landing_page LIKE ? OR country LIKE ? OR city LIKE ? OR lead_name LIKE ? OR lead_email LIKE ? OR lead_company LIKE ?)'
      );
      const s = `%${search}%`;
      params.push(s, s, s, s, s, s, s, s, s, s);
    }
    const whereClause = where.join(' AND ');
    const scored = `(${SCORED_VISITORS_SQL}) s`;
    const orderBy = sort === 'score' ? 'lead_score DESC, last_visit_at DESC' : 'last_visit_at DESC';

    const [countRows]: any = await db.query(`SELECT COUNT(*) AS count FROM ${scored} WHERE ${whereClause}`, params);
    const total = Number(countRows[0]?.count || 0);
    const [items]: any = await db.query(
      `SELECT * FROM ${scored} WHERE ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [statsRows]: any = await db.query(`
      SELECT
        COUNT(*) AS totalVisitors,
        SUM(visit_count > 1) AS returningCount,
        SUM(DATE(first_visit_at) = CURDATE()) AS newToday,
        SUM(lead_score >= ${HOT_LEAD_SCORE}) AS hotLeads,
        SUM(lead_score >= ${WARM_LEAD_SCORE} AND lead_score < ${HOT_LEAD_SCORE}) AS warmLeads,
        SUM(inquiries > 0) AS linkedInquiries,
        SUM(device_type = 'Desktop') AS desktopCount,
        SUM(device_type = 'Mobile') AS mobileCount,
        SUM(device_type = 'Tablet') AS tabletCount
      FROM ${scored}
    `);
    const [pageviewStats]: any = await db.query(
      'SELECT COUNT(*) AS totalPageviews, SUM(DATE(created_at) = CURDATE()) AS pageviewsToday FROM visitor_logs'
    );
    const [topPages]: any = await db.query(`
      SELECT page_url AS path, COUNT(*) AS count FROM visitor_logs
      GROUP BY page_url ORDER BY count DESC LIMIT 5
    `);

    const n = (v: unknown) => Number(v || 0);
    return NextResponse.json({
      success: true,
      items: items.map(withLead),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      stats: {
        totalVisitors: n(statsRows[0]?.totalVisitors),
        newVisitorsToday: n(statsRows[0]?.newToday),
        returningVisitors: n(statsRows[0]?.returningCount),
        hotLeads: n(statsRows[0]?.hotLeads),
        warmLeads: n(statsRows[0]?.warmLeads),
        linkedInquiries: n(statsRows[0]?.linkedInquiries),
        totalPageviews: n(pageviewStats[0]?.totalPageviews),
        pageviewsToday: n(pageviewStats[0]?.pageviewsToday),
        desktopCount: n(statsRows[0]?.desktopCount),
        mobileCount: n(statsRows[0]?.mobileCount),
        tabletCount: n(statsRows[0]?.tabletCount),
        topPages: topPages || [],
      },
    });
  } catch (error) {
    console.error('GET /api/admin/visitors error:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor data.' }, { status: 500 });
  }
}

/** Delete one visitor (?visitor_id=) or many ({ visitor_ids: [] }), with their page-view history. */
export async function DELETE(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const single = new URL(request.url).searchParams.get('visitor_id');
    let ids: string[] = single ? [single] : [];
    if (!single) {
      const body = await request.json().catch(() => null);
      ids = Array.isArray(body?.visitor_ids) ? body.visitor_ids.filter((v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= 191) : [];
    }
    ids = [...new Set(ids)];
    if (ids.length === 0) {
      return NextResponse.json({ error: 'Select at least one visitor.' }, { status: 400 });
    }
    if (ids.length > MAX_BULK_DELETE) {
      return NextResponse.json({ error: `You can delete up to ${MAX_BULK_DELETE} visitors at a time.` }, { status: 400 });
    }

    const db = getDbPool();
    const conn = await db.getConnection();
    let deleted = 0;
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM visitor_logs WHERE visitor_id IN (?)', [ids]);
      const [result]: any = await conn.query('DELETE FROM site_visitors WHERE visitor_id IN (?)', [ids]);
      deleted = result.affectedRows;
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    await logActivity(admin.email, 'DELETE_VISITORS', 'site_visitor', ids.length === 1 ? ids[0] : null, { count: deleted });
    return NextResponse.json({ success: true, deleted, message: `${deleted} visitor${deleted === 1 ? '' : 's'} deleted.` });
  } catch (error) {
    console.error('DELETE /api/admin/visitors error:', error);
    return NextResponse.json({ error: 'Failed to delete visitors.' }, { status: 500 });
  }
}
