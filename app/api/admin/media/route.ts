import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';

// Uploaded files are served from this site's own domain, so only inert types are accepted
// (no HTML/SVG/JS that a browser could execute).
const ALLOWED_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function checkFile(file: File): string | null {
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_TYPES[ext]) return 'Only JPG, PNG, GIF, WEBP, AVIF, PDF, MP4 or WEBM files can be uploaded.';
  if (file.size > MAX_UPLOAD_BYTES) return 'File is larger than 25 MB.';
  if (file.size === 0) return 'The file is empty.';
  return null;
}

// Every stored place a file URL can appear, so a file in use is never deleted.
const USAGE_QUERIES: Array<{ where: string; sql: string }> = [
  { where: 'Page content', sql: "SELECT CONCAT(COALESCE(p.title, s.page_slug), ' → ', s.title) AS label FROM sections s LEFT JOIN pages p ON p.slug = s.page_slug WHERE s.draft_content LIKE ? OR s.published_content LIKE ?" },
  { where: 'Site-wide settings', sql: 'SELECT setting_key AS label FROM site_settings WHERE setting_value LIKE ? OR setting_value LIKE ?' },
  { where: 'Page SEO', sql: 'SELECT title AS label FROM pages WHERE og_image LIKE ? OR og_image LIKE ?' },
  { where: 'Blog', sql: 'SELECT title AS label FROM blogs WHERE image LIKE ? OR author_avatar LIKE ? OR content_html LIKE ?' },
  { where: 'Event', sql: 'SELECT title AS label FROM events WHERE image LIKE ? OR gallery LIKE ?' },
  { where: 'Download', sql: 'SELECT title AS label FROM downloads WHERE download_url LIKE ? OR cover_image LIKE ?' },
  { where: 'Category', sql: 'SELECT name AS label FROM categories WHERE hero_image LIKE ? OR gallery LIKE ?' },
  { where: 'Product', sql: 'SELECT name AS label FROM products WHERE image LIKE ? OR blank_image LIKE ? OR locking_food_image LIKE ? OR varieties LIKE ?' },
];

async function findUsage(url: string): Promise<string[]> {
  const db = getDbPool();
  const pattern = `%${url.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const found: string[] = [];
  for (const { where, sql } of USAGE_QUERIES) {
    const placeholders = (sql.match(/\?/g) || []).length;
    const [rows]: any = await db.query(sql, Array(placeholders).fill(pattern));
    for (const r of rows) found.push(`${where}: ${r.label}`);
  }
  return found;
}

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const db = getDbPool();
    let query = 'SELECT * FROM media WHERE 1=1 ';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ? ';
      params.push(category);
    }

    if (search) {
      query += ' AND (original_name LIKE ? OR filename LIKE ? OR alt_text LIKE ?) ';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC ';

    const [media]: any = await db.query(query, params);

    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    console.error('Get media error:', error);
    return NextResponse.json({ error: 'Failed to fetch media library.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const categoryInput = (formData.get('category') as string) || 'general';
    const altText = (formData.get('alt_text') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file was provided.' }, { status: 400 });
    }
    const fileError = checkFile(file);
    if (fileError) {
      return NextResponse.json({ error: fileError }, { status: 400 });
    }

    // Prepare upload directory in public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = file.name;
    const extension = path.extname(originalName) || '.bin';
    const cleanBaseName = path.basename(originalName, extension).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = crypto.randomBytes(6).toString('hex');
    const safeFilename = `${cleanBaseName}-${uniqueSuffix}${extension}`;
    const filePath = path.join(uploadDir, safeFilename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(bytes));

    const publicUrl = `/uploads/${safeFilename}`;
    const size = file.size;
    const mimeType = ALLOWED_TYPES[extension.toLowerCase()];

    // Auto classify category
    let category = categoryInput;
    if (category === 'general') {
      if (mimeType.startsWith('image/')) category = 'images';
      else if (mimeType.startsWith('video/')) category = 'videos';
      else if (mimeType.includes('pdf') || mimeType.includes('document')) category = 'documents';
    }

    const id = 'med_' + crypto.randomBytes(8).toString('hex');

    const db = getDbPool();
    await db.query(
      `INSERT INTO media (id, filename, original_name, mime_type, size, url, alt_text, category, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, safeFilename, originalName, mimeType, size, publicUrl, altText || originalName, category]
    );

    await logActivity(admin.email, 'UPLOAD_MEDIA', 'MEDIA', id, {
      originalName,
      safeFilename,
      size,
      mimeType,
      url: publicUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully.',
      media: {
        id,
        filename: safeFilename,
        original_name: originalName,
        mime_type: mimeType,
        size,
        url: publicUrl,
        alt_text: altText || originalName,
        category,
      },
    });
  } catch (error: any) {
    console.error('Upload media error:', error);
    return NextResponse.json({ error: 'Failed to upload media file.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Media ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT filename, original_name, url FROM media WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Media file not found.' }, { status: 404 });
    }

    const mediaItem = rows[0];

    const usedIn = await findUsage(mediaItem.url);
    if (usedIn.length > 0) {
      return NextResponse.json(
        { error: `This file is still used in ${usedIn.length} place${usedIn.length > 1 ? 's' : ''}. Replace it there first.`, usedIn },
        { status: 409 }
      );
    }

    // Only files uploaded through the CMS live in /uploads; built-in /images files are never removed from disk.
    if (typeof mediaItem.url === 'string' && mediaItem.url.startsWith('/uploads/')) {
      try {
        const diskPath = path.join(UPLOAD_DIR, path.basename(mediaItem.filename));
        if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
      } catch (err) {
        console.warn('Could not delete disk file:', err);
      }
    }

    await db.query('DELETE FROM media WHERE id = ?', [id]);
    await logActivity(admin.email, 'DELETE_MEDIA', 'MEDIA', id, { filename: mediaItem.filename });

    return NextResponse.json({ success: true, message: 'Media file deleted successfully.' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Failed to delete media.' }, { status: 500 });
  }
}

/** Update a file's alt text (description used for accessibility and SEO). */
export async function PATCH(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const body = await request.json().catch(() => null);
    const id = typeof body?.id === 'string' ? body.id : '';
    const altText = typeof body?.alt_text === 'string' ? body.alt_text.trim().slice(0, 255) : null;
    if (!id || altText === null) return NextResponse.json({ error: 'Media ID and alt text are required.' }, { status: 400 });

    const [result]: any = await getDbPool().query('UPDATE media SET alt_text = ? WHERE id = ?', [altText, id]);
    if (!result.affectedRows) return NextResponse.json({ error: 'Media file not found.' }, { status: 404 });
    await logActivity(admin.email, 'UPDATE_MEDIA_ALT', 'MEDIA', id, { alt_text: altText });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update media alt text error:', error);
    return NextResponse.json({ error: 'Failed to update alt text.' }, { status: 500 });
  }
}

/**
 * Replace an uploaded file's contents while keeping its URL, so every page using it updates.
 * Only CMS uploads can be replaced, and the new file must be the same type (same extension).
 */
export async function PUT(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const formData = await request.formData();
    const id = formData.get('id');
    const file = formData.get('file');
    if (typeof id !== 'string' || !(file instanceof File)) {
      return NextResponse.json({ error: 'Media ID and file are required.' }, { status: 400 });
    }
    const fileError = checkFile(file);
    if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT filename, url FROM media WHERE id = ?', [id]);
    if (!rows?.length) return NextResponse.json({ error: 'Media file not found.' }, { status: 404 });
    const item = rows[0];
    if (!String(item.url).startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Built-in website images can’t be replaced here. Upload a new image and choose it on the page instead.' }, { status: 400 });
    }
    const currentExt = path.extname(item.filename).toLowerCase();
    const newExt = path.extname(file.name).toLowerCase();
    const sameType = currentExt === newExt || (['.jpg', '.jpeg'].includes(currentExt) && ['.jpg', '.jpeg'].includes(newExt));
    if (!sameType) {
      return NextResponse.json({ error: `Please choose a ${currentExt.replace('.', '').toUpperCase()} file so the link keeps working.` }, { status: 400 });
    }

    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, path.basename(item.filename)), Buffer.from(await file.arrayBuffer()));
    await db.query('UPDATE media SET size = ?, original_name = ?, mime_type = ? WHERE id = ?', [file.size, file.name, ALLOWED_TYPES[newExt], id]);
    await logActivity(admin.email, 'REPLACE_MEDIA', 'MEDIA', id, { filename: item.filename, newName: file.name });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Replace media error:', error);
    return NextResponse.json({ error: 'Failed to replace file.' }, { status: 500 });
  }
}
