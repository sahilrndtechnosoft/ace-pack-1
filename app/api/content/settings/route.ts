import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query('SELECT setting_key, setting_value, setting_type FROM site_settings');

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
    console.error('Public content settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings.' }, { status: 500 });
  }
}
