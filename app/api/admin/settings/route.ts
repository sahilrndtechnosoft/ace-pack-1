import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';
import { hasUnsafeUrl } from '@/lib/cms/merge';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT setting_key, setting_value, setting_type, updated_at FROM site_settings');

    const settings: Record<string, any> = {};
    for (const r of rows) {
      if (r.setting_type === 'boolean') {
        settings[r.setting_key] = r.setting_value === 'true';
      } else if (r.setting_type === 'json') {
        try {
          settings[r.setting_key] = JSON.parse(r.setting_value);
        } catch {
          settings[r.setting_key] = r.setting_value;
        }
      } else {
        settings[r.setting_key] = r.setting_value;
      }
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings.' }, { status: 500 });
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
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required.' }, { status: 400 });
    }
    // Settings are rendered into links on every page; refuse script URLs.
    if (hasUnsafeUrl(settings)) {
      return NextResponse.json({ error: 'Links cannot start with "javascript:". Use a page path or https:// address.' }, { status: 400 });
    }

    const db = getDbPool();

    for (const [key, rawValue] of Object.entries(settings)) {
      let type = 'string';
      let valueStr = '';

      if (typeof rawValue === 'boolean') {
        type = 'boolean';
        valueStr = rawValue ? 'true' : 'false';
      } else if (typeof rawValue === 'object') {
        type = 'json';
        valueStr = JSON.stringify(rawValue);
      } else {
        valueStr = String(rawValue || '');
      }

      await db.query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_type = VALUES(setting_type), updated_at = NOW()`,
        [key, valueStr, type]
      );
    }

    await logActivity(admin.email, 'UPDATE_SITE_SETTINGS', 'SETTINGS', 'global', {
      updatedKeys: Object.keys(settings),
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
