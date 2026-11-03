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
    const [pages]: any = await db.query(`
      SELECT p.*, COUNT(s.id) as section_count
      FROM pages p
      LEFT JOIN sections s ON p.slug = s.page_slug
      GROUP BY p.id
      ORDER BY p.title ASC
    `);

    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    console.error('Get pages error:', error);
    return NextResponse.json({ error: 'Failed to fetch pages.' }, { status: 500 });
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
    const { title, slug, seo_title, seo_description, og_image, canonical_url, robots_index, is_published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Page title and slug are required.' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const id = 'page_' + cleanSlug;

    const db = getDbPool();
    await db.query(
      `INSERT INTO pages (id, slug, title, seo_title, seo_description, og_image, canonical_url, robots_index, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        cleanSlug,
        title.trim(),
        seo_title || title.trim(),
        seo_description || '',
        og_image || '/images/hero-bg-image.jpg',
        canonical_url || `https://acepack.co.in/${cleanSlug}`,
        robots_index !== undefined ? (robots_index ? 1 : 0) : 1,
        is_published !== undefined ? (is_published ? 1 : 0) : 1,
      ]
    );

    await logActivity(admin.email, 'CREATE_PAGE', 'PAGE', id, { title, slug: cleanSlug });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/${cleanSlug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Page created successfully.', pageId: id });
  } catch (error: any) {
    console.error('Create page error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A page with this URL slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create page.' }, { status: 500 });
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
    const { id, title, slug, seo_title, seo_description, og_image, canonical_url, robots_index, is_published } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'Page ID and title are required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [existing]: any = await db.query('SELECT slug FROM pages WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    }

    const oldSlug = existing[0].slug;
    let newSlug = oldSlug;
    if (slug && oldSlug !== 'home') {
      newSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    }

    await db.query(
      `UPDATE pages
       SET title = ?,
           slug = ?,
           seo_title = ?,
           seo_description = ?,
           og_image = ?,
           canonical_url = ?,
           robots_index = ?,
           is_published = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        title.trim(),
        newSlug,
        seo_title || null,
        seo_description || null,
        og_image || null,
        canonical_url || null,
        robots_index !== undefined ? (robots_index ? 1 : 0) : 1,
        is_published !== undefined ? (is_published ? 1 : 0) : 1,
        id,
      ]
    );

    if (newSlug !== oldSlug) {
      await db.query('UPDATE sections SET page_slug = ? WHERE page_slug = ?', [newSlug, oldSlug]);
    }

    await logActivity(admin.email, 'UPDATE_PAGE', 'PAGE', id, { title, oldSlug, newSlug });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(oldSlug === 'home' ? '/' : `/${oldSlug}`);
      if (newSlug !== oldSlug) {
        revalidatePath(`/${newSlug}`);
      }
    } catch {}

    return NextResponse.json({ success: true, message: 'Page updated successfully.' });
  } catch (error: any) {
    console.error('Update page error:', error);
    return NextResponse.json({ error: 'Failed to update page.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Page ID is required.' }, { status: 400 });
    }

    if (id === 'page_home') {
      return NextResponse.json({ error: 'Cannot delete the core Homepage.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT slug, title FROM pages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    }

    const page = rows[0];
    // Delete sections of this page
    await db.query('DELETE FROM sections WHERE page_slug = ?', [page.slug]);
    // Delete the page
    await db.query('DELETE FROM pages WHERE id = ?', [id]);

    await logActivity(admin.email, 'DELETE_PAGE', 'PAGE', id, { title: page.title, slug: page.slug });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(page.slug === 'home' ? '/' : `/${page.slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Page and its sections deleted successfully.' });
  } catch (error: any) {
    console.error('Delete page error:', error);
    return NextResponse.json({ error: 'Failed to delete page.' }, { status: 500 });
  }
}
