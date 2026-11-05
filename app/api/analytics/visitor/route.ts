import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';

function parseUserAgent(ua: string, screenWidth?: number) {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceType = 'Desktop';

  const lowerUA = (ua || '').toLowerCase();

  // OS Detection
  if (lowerUA.includes('windows')) os = 'Windows';
  else if (lowerUA.includes('macintosh') || lowerUA.includes('mac os')) os = 'macOS';
  else if (lowerUA.includes('android')) os = 'Android';
  else if (lowerUA.includes('iphone') || lowerUA.includes('ipad') || lowerUA.includes('ipod')) os = 'iOS';
  else if (lowerUA.includes('linux')) os = 'Linux';
  else if (lowerUA.includes('cros')) os = 'ChromeOS';

  // Browser Detection
  if (lowerUA.includes('edg/')) browser = 'Microsoft Edge';
  else if (lowerUA.includes('opr/') || lowerUA.includes('opera')) browser = 'Opera';
  else if (lowerUA.includes('samsungbrowser')) browser = 'Samsung Internet';
  else if (lowerUA.includes('chrome') && !lowerUA.includes('chromium')) browser = 'Google Chrome';
  else if (lowerUA.includes('safari') && !lowerUA.includes('chrome')) browser = 'Safari';
  else if (lowerUA.includes('firefox')) browser = 'Mozilla Firefox';

  // Device Type Detection
  const isMobileUa = /android|iphone|ipod|blackberry|iemobile|opera mini/i.test(lowerUA);
  const isTabletUa = /ipad|tablet|(android(?!.*mobile))/i.test(lowerUA);

  if (isTabletUa || (screenWidth && screenWidth >= 640 && screenWidth < 1024)) {
    deviceType = 'Tablet';
  } else if (isMobileUa || (screenWidth && screenWidth < 640)) {
    deviceType = 'Mobile';
  } else {
    deviceType = 'Desktop';
  }

  return { browser, os, deviceType };
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json().catch(() => ({}));

    let { visitorId, isNew, pageUrl, pageTitle, referrer, screenWidth } = body;

    // Filter out internal admin routes
    if (pageUrl && (pageUrl.startsWith('/admin') || pageUrl.startsWith('/api'))) {
      return NextResponse.json({ skipped: true, reason: 'admin_path' });
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || 'unknown');
    const userAgent = request.headers.get('user-agent') || '';
    const country = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country') || request.headers.get('x-country') || '';
    const city = request.headers.get('x-vercel-ip-city') || request.headers.get('cf-ipcity') || '';

    // Ignore search crawler bots from unique visitor count
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
    if (isBot) {
      return NextResponse.json({ skipped: true, reason: 'crawler' });
    }

    const { browser, os, deviceType } = parseUserAgent(userAgent, screenWidth);

    if (!visitorId || typeof visitorId !== 'string' || visitorId.length < 8) {
      visitorId = 'vid_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      isNew = true;
    }

    const cleanUrl = typeof pageUrl === 'string' ? pageUrl.substring(0, 500) : '/';
    const cleanTitle = typeof pageTitle === 'string' ? pageTitle.substring(0, 255) : '';
    const cleanReferrer = typeof referrer === 'string' ? referrer.substring(0, 500) : '';

    const db = getDbPool();

    // Check if visitor exists in database
    const [existing]: any = await db.query(
      'SELECT id, visitor_id, visit_count FROM site_visitors WHERE visitor_id = ? LIMIT 1',
      [visitorId]
    );

    const logId = 'vl_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    if (!existing || existing.length === 0) {
      // Truly a NEW visitor
      const visitorRecordId = 'sv_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      await db.query(
        `INSERT INTO site_visitors 
         (id, visitor_id, ip_address, user_agent, device_type, browser, os, initial_landing_page, initial_referrer, country, city, visit_count, first_visit_at, last_visit_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), NOW(), NOW())`,
        [
          visitorRecordId,
          visitorId,
          ipAddress,
          userAgent,
          deviceType,
          browser,
          os,
          cleanUrl,
          cleanReferrer,
          country,
          city,
        ]
      );

      // Log the pageview
      await db.query(
        `INSERT INTO visitor_logs 
         (id, visitor_id, page_url, page_title, referrer, is_new_visitor, ip_address, device_type, browser, os, created_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, NOW())`,
        [logId, visitorId, cleanUrl, cleanTitle, cleanReferrer, ipAddress, deviceType, browser, os]
      );

      return NextResponse.json({
        success: true,
        visitorId,
        isNew: true,
      });
    } else {
      // RETURNING visitor
      await db.query(
        `UPDATE site_visitors 
         SET visit_count = visit_count + 1,
             last_visit_at = NOW(),
             ip_address = ?,
             user_agent = ?,
             device_type = ?,
             browser = ?,
             os = ?,
             country = COALESCE(NULLIF(?, ''), country),
             city = COALESCE(NULLIF(?, ''), city),
             updated_at = NOW()
         WHERE visitor_id = ?`,
        [ipAddress, userAgent, deviceType, browser, os, country, city, visitorId]
      );

      // Log the pageview
      await db.query(
        `INSERT INTO visitor_logs 
         (id, visitor_id, page_url, page_title, referrer, is_new_visitor, ip_address, device_type, browser, os, created_at)
         VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, NOW())`,
        [logId, visitorId, cleanUrl, cleanTitle, cleanReferrer, ipAddress, deviceType, browser, os]
      );

      return NextResponse.json({
        success: true,
        visitorId,
        isNew: false,
      });
    }
  } catch (error: any) {
    console.error('Visitor logging error:', error);
    return NextResponse.json({ error: 'Failed to record visitor.' }, { status: 500 });
  }
}
