import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
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
    const mimeType = file.type || 'application/octet-stream';

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
    const [rows]: any = await db.query('SELECT filename, original_name FROM media WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Media file not found.' }, { status: 404 });
    }

    const mediaItem = rows[0];

    // Attempt to remove physical file if exists
    try {
      const diskPath = path.join(process.cwd(), 'public', 'uploads', mediaItem.filename);
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
    } catch (err) {
      console.warn('Could not delete disk file:', err);
    }

    await db.query('DELETE FROM media WHERE id = ?', [id]);
    await logActivity(admin.email, 'DELETE_MEDIA', 'MEDIA', id, { filename: mediaItem.filename });

    return NextResponse.json({ success: true, message: 'Media file deleted successfully.' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Failed to delete media.' }, { status: 500 });
  }
}
