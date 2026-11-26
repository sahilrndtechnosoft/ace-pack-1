import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { getDbPool, initDb } from '@/lib/db';
import { resolveDocumentFile } from '@/lib/documents/requests';

const CONTENT_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/** Streams an approved document to the holder of the emailed link (see /api/admin/download-requests). */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: 'Invalid download link.' }, { status: 400 });
  }

  try {
    await initDb();
    const [rows]: any = await getDbPool().query(
      `SELECT document_url, document_title FROM document_requests
       WHERE download_token = ? AND status = 'approved' AND token_expires_at > NOW()`,
      [token]
    );
    const file = rows[0] ? resolveDocumentFile(rows[0].document_url) : null;
    if (!file) {
      return NextResponse.json({ error: 'This download link has expired or is no longer valid. Please request the document again.' }, { status: 410 });
    }

    const ext = path.extname(file).toLowerCase();
    const filename = `${String(rows[0].document_title).replace(/[^\w.-]+/g, '_').slice(0, 120)}${ext}`;
    const stream = Readable.toWeb(fs.createReadStream(file)) as ReadableStream;
    return new Response(stream, {
      headers: {
        'Content-Type': CONTENT_TYPES[ext] || 'application/octet-stream',
        'Content-Length': String(fs.statSync(file).size),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Document download error:', error);
    return NextResponse.json({ error: 'Could not download the document. Please try again later.' }, { status: 500 });
  }
}
