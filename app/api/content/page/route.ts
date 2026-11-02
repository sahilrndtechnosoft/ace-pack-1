import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'home';

    const db = getDbPool();

    // 1. Fetch page metadata
    const [pageRows]: any = await db.query(
      'SELECT id, slug, title, seo_title, seo_description, og_image, canonical_url, is_published FROM pages WHERE slug = ? LIMIT 1',
      [slug]
    );

    // 2. Fetch enabled, published sections
    const [sectionRows]: any = await db.query(
      `SELECT section_key, title, subtitle, published_content, sort_order
       FROM sections
       WHERE page_slug = ? AND is_enabled = 1
       ORDER BY sort_order ASC`,
      [slug]
    );

    const sectionsMap: Record<string, any> = {};
    for (const sec of sectionRows) {
      try {
        sectionsMap[sec.section_key] = {
          title: sec.title,
          subtitle: sec.subtitle,
          ...JSON.parse(sec.published_content),
        };
      } catch {
        sectionsMap[sec.section_key] = {
          title: sec.title,
          subtitle: sec.subtitle,
          content: sec.published_content,
        };
      }
    }

    return NextResponse.json({
      success: true,
      page: pageRows[0] || null,
      sections: sectionsMap,
    });
  } catch (error: any) {
    console.error('Public content page error:', error);
    return NextResponse.json({ error: 'Failed to fetch page content.' }, { status: 500 });
  }
}
