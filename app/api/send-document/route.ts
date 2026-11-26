import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';
import { isCertificateDownload } from '@/lib/data/downloads';
import { createMailer, escapeHtml, resolveDocumentFile, salesInbox, siteUrl } from '@/lib/documents/requests';

const DEFAULT_DOCUMENT_URL = '/downloads/Ace_Packaging_Full_Product_Catalog.pdf';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

/**
 * Website document requests (catalogue, datasheets). Nothing is sent to the visitor here: the request
 * waits in the CMS (Admin → Download Requests) and approval emails a private download link.
 */
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json().catch(() => ({}));

    const name = text(body.name, 255);
    const email = text(body.email, 255);
    const phone = text(body.phone, 100);
    const company = text(body.company, 255);
    const industry = text(body.industry, 150);
    const documentTitle = text(body.documentTitle, 255) || 'Ace Packaging Product Catalog';
    const documentUrl = text(body.downloadUrl, 500) || DEFAULT_DOCUMENT_URL;

    if (!name) return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    if (!EMAIL_PATTERN.test(email)) return NextResponse.json({ error: 'A valid business email address is required.' }, { status: 400 });
    if (phone.replace(/\D/g, '').length < 6) return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 });
    if (isCertificateDownload({ file: documentUrl })) {
      return NextResponse.json({ error: 'Certificates are not available for download.' }, { status: 403 });
    }
    if (!resolveDocumentFile(documentUrl)) {
      return NextResponse.json({ error: 'This document is not available. Please contact our sales team.' }, { status: 404 });
    }

    const id = 'doc_' + crypto.randomUUID();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const sourcePage = text(request.headers.get('referer'), 255) || null;

    await getDbPool().query(
      `INSERT INTO document_requests
       (id, name, company, email, phone, industry, document_title, document_url, source_page, status, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
      [id, name, company || null, email, phone, industry || null, documentTitle, documentUrl, sourcePage, ip]
    );

    // Best effort: the request is already saved, so a mail failure must not fail the visitor.
    const mailer = createMailer();
    if (mailer) {
      const rows = [
        ['Document', documentTitle],
        ['Name', name],
        ['Company', company || '—'],
        ['Email', email],
        ['Phone', phone],
        ['Business type', industry || '—'],
      ]
        .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#666">${label}</td><td style="padding:6px 12px;font-weight:600">${escapeHtml(value)}</td></tr>`)
        .join('');
      await mailer.transporter
        .sendMail({
          from: mailer.from,
          to: salesInbox(),
          subject: `[Approval needed] Document request: ${documentTitle} – ${name}`,
          html: `<p>A visitor requested a document. Approve or reject it in the CMS:</p>
            <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>
            <p><a href="${siteUrl()}/admin/download-requests">Open Download Requests</a></p>`,
        })
        .catch((err: unknown) => console.error('Document request notice email failed:', err));
    }

    return NextResponse.json({ success: true, status: 'pending' });
  } catch (error) {
    console.error('Document request error:', error);
    return NextResponse.json({ error: 'Could not submit your request. Please try again.' }, { status: 500 });
  }
}
