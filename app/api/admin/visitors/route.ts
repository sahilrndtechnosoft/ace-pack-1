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
    const specificVisitorId = searchParams.get('visitor_id');

    const db = getDbPool();

    // If specific visitor requested for detail modal
    if (specificVisitorId) {
      const [visitorRows]: any = await db.query(
        'SELECT * FROM site_visitors WHERE visitor_id = ? LIMIT 1',
        [specificVisitorId]
      );

      if (!visitorRows || visitorRows.length === 0) {
        return NextResponse.json({ error: 'Visitor not found.' }, { status: 404 });
      }

      const [logs]: any = await db.query(
        `SELECT id, page_url, page_title, referrer, is_new_visitor, ip_address, device_type, browser, os, created_at
         FROM visitor_logs
         WHERE visitor_id = ?
         ORDER BY created_at DESC
         LIMIT 50`,
        [specificVisitorId]
      );

      return NextResponse.json({
        success: true,
        visitor: visitorRows[0],
        logs,
      });
    }

    // List view with pagination and filters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const search = (searchParams.get('search') || '').trim();
    const visitorType = (searchParams.get('visitor_type') || 'all').trim(); // 'all', 'new', 'returning'
    const deviceType = (searchParams.get('device_type') || 'all').trim();
    const dateRange = (searchParams.get('date_range') || 'all').trim(); // 'today', '7days', '30days', 'all'

    const whereConditions: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (visitorType === 'new') {
      whereConditions.push('visit_count = 1');
    } else if (visitorType === 'returning') {
      whereConditions.push('visit_count > 1');
    }

    if (deviceType && deviceType !== 'all') {
      whereConditions.push('device_type = ?');
      queryParams.push(deviceType);
    }

    if (dateRange === 'today') {
      whereConditions.push('DATE(last_visit_at) = CURDATE()');
    } else if (dateRange === '7days') {
      whereConditions.push('last_visit_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    } else if (dateRange === '30days') {
      whereConditions.push('last_visit_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
    }

    if (search) {
      whereConditions.push(
        '(visitor_id LIKE ? OR ip_address LIKE ? OR browser LIKE ? OR os LIKE ? OR initial_landing_page LIKE ? OR country LIKE ? OR city LIKE ?)'
      );
      const s = `%${search}%`;
      queryParams.push(s, s, s, s, s, s, s);
    }

    const whereClause = whereConditions.join(' AND ');

    // Total count for pagination
    const [countRows]: any = await db.query(
      `SELECT count(*) as count FROM site_visitors WHERE ${whereClause}`,
      queryParams
    );
    const total = countRows[0]?.count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch paginated visitors
    const [items]: any = await db.query(
      `SELECT id, visitor_id, ip_address, device_type, browser, os, initial_landing_page, initial_referrer, country, city, visit_count, first_visit_at, last_visit_at, created_at
       FROM site_visitors
       WHERE ${whereClause}
       ORDER BY last_visit_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // High-Level Analytics Metrics
    const [statsRows]: any = await db.query(`
      SELECT 
        COUNT(*) as totalVisitors,
        SUM(CASE WHEN visit_count = 1 THEN 1 ELSE 0 END) as singleVisitCount,
        SUM(CASE WHEN visit_count > 1 THEN 1 ELSE 0 END) as returningCount,
        SUM(CASE WHEN DATE(first_visit_at) = CURDATE() THEN 1 ELSE 0 END) as newToday,
        SUM(CASE WHEN first_visit_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as newThisWeek,
        SUM(CASE WHEN device_type = 'Desktop' THEN 1 ELSE 0 END) as desktopCount,
        SUM(CASE WHEN device_type = 'Mobile' THEN 1 ELSE 0 END) as mobileCount,
        SUM(CASE WHEN device_type = 'Tablet' THEN 1 ELSE 0 END) as tabletCount
      FROM site_visitors
    `);

    const [pageviewStats]: any = await db.query(`
      SELECT 
        COUNT(*) as totalPageviews,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as pageviewsToday
      FROM visitor_logs
    `);

    // Top 5 landing pages
    const [topPages]: any = await db.query(`
      SELECT initial_landing_page as path, COUNT(*) as count 
      FROM site_visitors 
      WHERE initial_landing_page IS NOT NULL AND initial_landing_page != ''
      GROUP BY initial_landing_page 
      ORDER BY count DESC 
      LIMIT 5
    `);

    // Top browsers
    const [topBrowsers]: any = await db.query(`
      SELECT browser, COUNT(*) as count 
      FROM site_visitors 
      WHERE browser IS NOT NULL AND browser != ''
      GROUP BY browser 
      ORDER BY count DESC 
      LIMIT 5
    `);

    const stats = {
      totalVisitors: statsRows[0]?.totalVisitors || 0,
      newVisitorsToday: statsRows[0]?.newToday || 0,
      newVisitorsThisWeek: statsRows[0]?.newThisWeek || 0,
      returningVisitors: statsRows[0]?.returningCount || 0,
      totalPageviews: pageviewStats[0]?.totalPageviews || 0,
      pageviewsToday: pageviewStats[0]?.pageviewsToday || 0,
      desktopCount: statsRows[0]?.desktopCount || 0,
      mobileCount: statsRows[0]?.mobileCount || 0,
      tabletCount: statsRows[0]?.tabletCount || 0,
      topPages: topPages || [],
      topBrowsers: topBrowsers || [],
    };

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      totalPages,
      stats,
    });
  } catch (error: any) {
    console.error('GET /api/admin/visitors error:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor data.' }, { status: 500 });
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
    const visitorId = searchParams.get('visitor_id');

    if (!visitorId) {
      return NextResponse.json({ error: 'Visitor ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    await db.query('DELETE FROM visitor_logs WHERE visitor_id = ?', [visitorId]);
    await db.query('DELETE FROM site_visitors WHERE visitor_id = ?', [visitorId]);

    await logActivity(admin.email, 'delete_visitor', 'site_visitor', visitorId);

    return NextResponse.json({
      success: true,
      message: 'Visitor record and associated logs deleted.',
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/visitors error:', error);
    return NextResponse.json({ error: 'Failed to delete visitor.' }, { status: 500 });
  }
}
