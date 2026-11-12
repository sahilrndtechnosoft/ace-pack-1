import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
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
    const [downloads]: any = await db.query('SELECT * FROM downloads ORDER BY sort_order ASC, created_at DESC');

    return NextResponse.json({ success: true, downloads });
  } catch (error: any) {
    console.error('Get downloads error:', error);
    return NextResponse.json({ error: 'Failed to fetch downloads.' }, { status: 500 });
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
    const { title, description, category, format, file_size, download_url, cover_image, is_published } = body;

    if (!title || !download_url) {
      return NextResponse.json({ error: 'Title and download URL are required.' }, { status: 400 });
    }

    const id = 'doc_' + crypto.randomBytes(6).toString('hex');
    const db = getDbPool();

    const [maxOrder]: any = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM downloads');
    const nextOrder = maxOrder[0]?.next_order || 1;

    await db.query(
      `INSERT INTO downloads (id, title, description, category, format, file_size, download_url, cover_image, sort_order, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        title.trim(),
        description ? description.trim() : null,
        category || 'Catalogs & Brochures',
        format || 'PDF',
        file_size || '3.5 MB',
        download_url,
        cover_image || '/images/hero-bg-image.jpg',
        nextOrder,
        is_published !== undefined ? (is_published ? 1 : 0) : 1,
      ]
    );

    await logActivity(admin.email, 'CREATE_DOWNLOAD', 'DOWNLOAD', id, { title });

    try {
      revalidatePath('/downloads');
    } catch {}

    return NextResponse.json({ success: true, message: 'Document added to downloads library.', downloadId: id });
  } catch (error: any) {
    console.error('Create download error:', error);
    return NextResponse.json({ error: 'Failed to create download entry.' }, { status: 500 });
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
    const { id, title, description, category, format, file_size, download_url, cover_image, sort_order, is_published } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'Download ID and title are required.' }, { status: 400 });
    }

    const db = getDbPool();
    await db.query(
      `UPDATE downloads
       SET title = ?,
           description = COALESCE(?, description),
           category = COALESCE(?, category),
           format = COALESCE(?, format),
           file_size = COALESCE(?, file_size),
           download_url = COALESCE(?, download_url),
           cover_image = COALESCE(?, cover_image),
           sort_order = COALESCE(?, sort_order),
           is_published = COALESCE(?, is_published),
           updated_at = NOW()
       WHERE id = ?`,
      [
        title.trim(),
        description !== undefined ? description : null,
        category || null,
        format || null,
        file_size || null,
        download_url || null,
        cover_image || null,
        sort_order !== undefined ? Number(sort_order) : null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        id,
      ]
    );

    await logActivity(admin.email, 'UPDATE_DOWNLOAD', 'DOWNLOAD', id, { title });

    try {
      revalidatePath('/downloads');
    } catch {}

    return NextResponse.json({ success: true, message: 'Download updated successfully.' });
  } catch (error: any) {
    console.error('Update download error:', error);
    return NextResponse.json({ error: 'Failed to update download.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Download ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT title FROM downloads WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Download not found.' }, { status: 404 });
    }

    const doc = rows[0];
    await db.query('DELETE FROM downloads WHERE id = ?', [id]);

    await logActivity(admin.email, 'DELETE_DOWNLOAD', 'DOWNLOAD', id, { title: doc.title });

    try {
      revalidatePath('/downloads');
    } catch {}

    return NextResponse.json({ success: true, message: 'Download deleted successfully.' });
  } catch (error: any) {
    console.error('Delete download error:', error);
    return NextResponse.json({ error: 'Failed to delete download.' }, { status: 500 });
  }
}
