import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';

// Event highlights (list of text) and featured products (name, category URL name, description).
function toHighlightsJson(value: unknown): string | null {
  if (value === undefined) return null;
  if (!Array.isArray(value)) return '[]';
  return JSON.stringify(value.filter((v) => typeof v === 'string').map((v: string) => v.trim()).filter(Boolean).slice(0, 20));
}
function toFocusProductsJson(value: unknown): string | null {
  if (value === undefined) return null;
  if (!Array.isArray(value)) return '[]';
  const items = value
    .filter((v): v is Record<string, unknown> => !!v && typeof v === 'object')
    .map((v) => ({
      name: String(v.name ?? '').trim(),
      slug: String(v.slug ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      desc: String(v.desc ?? '').trim(),
    }))
    .filter((v) => v.name)
    .slice(0, 20);
  return JSON.stringify(items);
}

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const db = getDbPool();
    let query = 'SELECT * FROM events WHERE 1=1 ';
    const params: any[] = [];

    if (search) {
      query += ' AND (title LIKE ? OR location LIKE ? OR short_desc LIKE ?) ';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC ';

    const [events]: any = await db.query(query, params);

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('Get events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events.' }, { status: 500 });
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
    const { title, slug, short_desc, full_desc, date, location, booth, image, gallery, category, is_featured, is_published, highlights, focus_products } = body;

    if (!title || !date || !location) {
      return NextResponse.json({ error: 'Title, date, and location are required.' }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const id = 'event_' + cleanSlug;
    const galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : '[]';

    const db = getDbPool();
    await db.query(
      `INSERT INTO events (id, slug, title, short_desc, full_desc, date, location, booth, image, gallery, category, is_featured, is_published, highlights, focus_products, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        cleanSlug,
        title.trim(),
        short_desc || title.trim(),
        full_desc || '',
        date,
        location,
        booth || '',
        image || '/images/hero-bg-image.jpg',
        galleryStr,
        category || 'Trade Exhibition',
        is_featured ? 1 : 0,
        is_published !== undefined ? (is_published ? 1 : 0) : 1,
        toHighlightsJson(highlights),
        toFocusProductsJson(focus_products),
      ]
    );

    await logActivity(admin.email, 'CREATE_EVENT', 'EVENT', id, { title, slug: cleanSlug });

    try {
      revalidatePath('/events');
      revalidatePath(`/events/${cleanSlug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Event created successfully.', eventId: id });
  } catch (error: any) {
    console.error('Create event error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'An event with this URL slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create event.' }, { status: 500 });
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
    const { id, title, slug, short_desc, full_desc, date, location, booth, image, gallery, category, is_featured, is_published, highlights, focus_products } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'Event ID and title are required.' }, { status: 400 });
    }

    const galleryStr = gallery !== undefined ? (Array.isArray(gallery) ? JSON.stringify(gallery) : gallery) : null;

    const db = getDbPool();
    await db.query(
      `UPDATE events
       SET title = ?,
           slug = COALESCE(?, slug),
           short_desc = COALESCE(?, short_desc),
           full_desc = COALESCE(?, full_desc),
           date = COALESCE(?, date),
           location = COALESCE(?, location),
           booth = COALESCE(?, booth),
           image = COALESCE(?, image),
           gallery = COALESCE(?, gallery),
           category = COALESCE(?, category),
           is_featured = COALESCE(?, is_featured),
           is_published = COALESCE(?, is_published),
           highlights = COALESCE(?, highlights),
           focus_products = COALESCE(?, focus_products),
           updated_at = NOW()
       WHERE id = ?`,
      [
        title.trim(),
        slug ? slug.toLowerCase().trim() : null,
        short_desc || null,
        full_desc || null,
        date || null,
        location || null,
        booth !== undefined ? booth : null,
        image || null,
        galleryStr,
        category || null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        toHighlightsJson(highlights),
        toFocusProductsJson(focus_products),
        id,
      ]
    );

    await logActivity(admin.email, 'UPDATE_EVENT', 'EVENT', id, { title, slug });

    try {
      revalidatePath('/events');
      if (slug) revalidatePath(`/events/${slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Event updated successfully.' });
  } catch (error: any) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT title, slug FROM events WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const event = rows[0];
    await db.query('DELETE FROM events WHERE id = ?', [id]);

    await logActivity(admin.email, 'DELETE_EVENT', 'EVENT', id, { title: event.title, slug: event.slug });

    try {
      revalidatePath('/events');
      revalidatePath(`/events/${event.slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error: any) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event.' }, { status: 500 });
  }
}
