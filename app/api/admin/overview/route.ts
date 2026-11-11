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

    const db = getDbPool();

    // Query statistics
    const [pageRows]: any = await db.query('SELECT count(*) as count FROM pages');
    const [sectionRows]: any = await db.query('SELECT count(*) as count FROM sections');
    const [enabledSections]: any = await db.query('SELECT count(*) as count FROM sections WHERE is_enabled = 1');
    const [categoryRows]: any = await db.query('SELECT count(*) as count FROM categories');
    const [productRows]: any = await db.query('SELECT count(*) as count FROM products');
    const [blogRows]: any = await db.query('SELECT count(*) as count, COALESCE(SUM(is_published = 1), 0) as published FROM blogs');
    const [eventRows]: any = await db.query('SELECT count(*) as count FROM events');
    const [downloadRows]: any = await db.query('SELECT count(*) as count FROM downloads');
    const [mediaRows]: any = await db.query('SELECT count(*) as count FROM media');
    const [contactRows]: any = await db.query('SELECT count(*) as count FROM contact_submissions');
    const [unreadContacts]: any = await db.query("SELECT count(*) as count FROM contact_submissions WHERE status = 'unread'");
    const [visitorRows]: any = await db.query('SELECT count(*) as count FROM site_visitors');
    const [newVisitorsToday]: any = await db.query('SELECT count(*) as count FROM site_visitors WHERE DATE(first_visit_at) = CURDATE()');

    // Recent contact submissions
    const [recentContacts]: any = await db.query(
      `SELECT id, name, email, phone, company, category, status, created_at
       FROM contact_submissions
       ORDER BY created_at DESC
       LIMIT 5`
    );

    // Recent activity logs
    const [logs]: any = await db.query(
      `SELECT id, admin_email, action, entity_type, entity_id, details, created_at
       FROM activity_logs
       ORDER BY created_at DESC
       LIMIT 10`
    );

    // Recently modified sections
    const [recentSections]: any = await db.query(
      `SELECT s.id, s.page_slug, s.section_key, s.title, s.updated_at, p.title as page_title
       FROM sections s
       LEFT JOIN pages p ON s.page_slug = p.slug
       ORDER BY s.updated_at DESC
       LIMIT 12`
    );

    // Pages with saved drafts that are not published yet
    const [draftPages]: any = await db.query(
      `SELECT s.page_slug, COALESCE(p.title, s.page_slug) AS page_title, COUNT(*) AS count
       FROM sections s
       LEFT JOIN pages p ON s.page_slug = p.slug
       WHERE s.draft_content <> s.published_content
       GROUP BY s.page_slug, p.title
       ORDER BY count DESC`
    );

    // Site settings status
    const [settingsRows]: any = await db.query(
      "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('maintenance_mode', 'site_name', 'logo_url')"
    );
    const settingsMap: Record<string, string> = {};
    for (const r of settingsRows) {
      settingsMap[r.setting_key] = r.setting_value;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalPages: pageRows[0]?.count || 0,
        totalSections: sectionRows[0]?.count || 0,
        activeSections: enabledSections[0]?.count || 0,
        totalCategories: categoryRows[0]?.count || 0,
        totalProducts: productRows[0]?.count || 0,
        totalBlogs: blogRows[0]?.count || 0,
        publishedBlogs: Number(blogRows[0]?.published || 0),
        draftBlogs: (blogRows[0]?.count || 0) - Number(blogRows[0]?.published || 0),
        totalEvents: eventRows[0]?.count || 0,
        totalDownloads: downloadRows[0]?.count || 0,
        totalMedia: mediaRows[0]?.count || 0,
        totalContacts: contactRows[0]?.count || 0,
        unreadContacts: unreadContacts[0]?.count || 0,
        totalVisitors: visitorRows[0]?.count || 0,
        newVisitorsToday: newVisitorsToday[0]?.count || 0,
        maintenanceMode: settingsMap['maintenance_mode'] === 'true',
        siteName: settingsMap['site_name'] || 'Ace Packaging',
        logoUrl: settingsMap['logo_url'] || '/images/Ace_New_Update_Logo-01.png',
      },
      recentLogs: logs,
      recentSections,
      draftPages: draftPages || [],
      recentContacts: recentContacts || [],
    });
  } catch (error: any) {
    console.error('Overview API error:', error);
    return NextResponse.json({ error: 'Failed to fetch overview data.' }, { status: 500 });
  }
}
