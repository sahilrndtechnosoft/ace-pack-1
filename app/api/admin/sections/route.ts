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

    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('page');

    const db = getDbPool();
    let query = `
      SELECT s.*, p.title as page_title
      FROM sections s
      LEFT JOIN pages p ON s.page_slug = p.slug
    `;
    const params: any[] = [];

    if (pageSlug) {
      query += ' WHERE s.page_slug = ? ';
      params.push(pageSlug);
    }

    query += ' ORDER BY s.page_slug ASC, s.sort_order ASC ';

    const [sections]: any = await db.query(query, params);

    return NextResponse.json({ success: true, sections });
  } catch (error: any) {
    console.error('Get sections error:', error);
    return NextResponse.json({ error: 'Failed to fetch sections.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { page_slug, section_key, title, subtitle, content, is_enabled } = body;

    if (!page_slug || !section_key) {
      return NextResponse.json({ error: 'Page slug and section key are required.' }, { status: 400 });
    }

    const cleanKey = section_key.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    const id = `sec_${page_slug}_${cleanKey}`;
    const contentStr = typeof content === 'object' ? JSON.stringify(content) : content || '{}';

    const db = getDbPool();

    // Get max sort_order
    const [maxOrder]: any = await db.query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM sections WHERE page_slug = ?',
      [page_slug]
    );
    const nextOrder = maxOrder[0]?.next_order || 1;

    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
      [
        id,
        page_slug,
        cleanKey,
        title || cleanKey,
        subtitle || '',
        contentStr,
        contentStr, // Initially published upon creation
        is_enabled !== undefined ? (is_enabled ? 1 : 0) : 1,
        nextOrder,
      ]
    );

    await logActivity(admin.email, 'CREATE_SECTION', 'SECTION', id, { page_slug, section_key: cleanKey });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(page_slug === 'home' ? '/' : `/${page_slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Section created successfully.', sectionId: id });
  } catch (error: any) {
    console.error('Create section error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A section with this key already exists on this page.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create section.' }, { status: 500 });
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
    const { id, title, subtitle, draft_content, is_enabled, sort_order, publish } = body;

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required.' }, { status: 400 });
    }

    const db = getDbPool();

    // Check if section exists
    const [existing]: any = await db.query('SELECT * FROM sections WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
    }

    const current = existing[0];
    const draftStr = draft_content !== undefined
      ? (typeof draft_content === 'object' ? JSON.stringify(draft_content) : draft_content)
      : current.draft_content;

    // If publishing, promote draft to published
    const publishedStr = publish ? draftStr : current.published_content;

    await db.query(
      `UPDATE sections
       SET title = COALESCE(?, title),
           subtitle = COALESCE(?, subtitle),
           draft_content = ?,
           published_content = ?,
           is_enabled = COALESCE(?, is_enabled),
           sort_order = COALESCE(?, sort_order),
           is_published = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        title !== undefined ? title : null,
        subtitle !== undefined ? subtitle : null,
        draftStr,
        publishedStr,
        is_enabled !== undefined ? (is_enabled ? 1 : 0) : null,
        sort_order !== undefined ? Number(sort_order) : null,
        publish ? 1 : current.is_published,
        id,
      ]
    );

    await logActivity(
      admin.email,
      publish ? 'PUBLISH_SECTION' : 'UPDATE_SECTION_DRAFT',
      'SECTION',
      id,
      {
        page_slug: current.page_slug,
        section_key: current.section_key,
        published: Boolean(publish),
      }
    );

    try {
      revalidatePath('/', 'layout');
      revalidatePath(current.page_slug === 'home' ? '/' : `/${current.page_slug}`);
    } catch {}

    return NextResponse.json({
      success: true,
      message: publish ? 'Section changes published live!' : 'Section draft saved.',
    });
  } catch (error: any) {
    console.error('Update section error:', error);
    return NextResponse.json({ error: 'Failed to update section.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Section ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT page_slug, section_key, title FROM sections WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
    }

    const section = rows[0];
    await db.query('DELETE FROM sections WHERE id = ?', [id]);

    await logActivity(admin.email, 'DELETE_SECTION', 'SECTION', id, {
      page_slug: section.page_slug,
      section_key: section.section_key,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(section.page_slug === 'home' ? '/' : `/${section.page_slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Section deleted successfully.' });
  } catch (error: any) {
    console.error('Delete section error:', error);
    return NextResponse.json({ error: 'Failed to delete section.' }, { status: 500 });
  }
}
