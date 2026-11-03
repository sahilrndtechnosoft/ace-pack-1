import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query(
      "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('header_settings', 'footer_settings')"
    );

    let headerSettings = null;
    let footerSettings = null;

    for (const r of rows) {
      try {
        if (r.setting_key === 'header_settings') headerSettings = JSON.parse(r.setting_value);
        if (r.setting_key === 'footer_settings') footerSettings = JSON.parse(r.setting_value);
      } catch (err) {
        console.error('JSON parse error for', r.setting_key, err);
      }
    }

    return NextResponse.json({ success: true, headerSettings, footerSettings });
  } catch (error: any) {
    console.error('Get header-footer error:', error);
    return NextResponse.json({ error: 'Failed to fetch header and footer settings.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { headerSettings, footerSettings } = body;

    const db = getDbPool();

    if (headerSettings) {
      const headerStr = typeof headerSettings === 'object' ? JSON.stringify(headerSettings) : headerSettings;
      await db.query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
         VALUES ('header_settings', ?, 'json', NOW())
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
        [headerStr]
      );
    }

    if (footerSettings) {
      const footerStr = typeof footerSettings === 'object' ? JSON.stringify(footerSettings) : footerSettings;
      await db.query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
         VALUES ('footer_settings', ?, 'json', NOW())
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
        [footerStr]
      );
    }

    await logActivity(admin.email, 'UPDATE_HEADER_FOOTER', 'SITE_SETTINGS', 'header_footer', {
      updatedHeader: Boolean(headerSettings),
      updatedFooter: Boolean(footerSettings),
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, message: 'Header and footer settings updated successfully.' });
  } catch (error: any) {
    console.error('Update header-footer error:', error);
    return NextResponse.json({ error: 'Failed to update header and footer settings.' }, { status: 500 });
  }
}
