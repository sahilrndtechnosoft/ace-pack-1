import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';
import { DOWNLOAD_LINK_TTL_DAYS, createMailer, escapeHtml, siteUrl } from '@/lib/documents/requests';

const STATUSES = ['pending', 'approved', 'rejected'] as const;
const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const filterByStatus = (STATUSES as readonly string[]).includes(status);

    const db = getDbPool();
    const where = filterByStatus ? 'WHERE status = ?' : '';
    const params = filterByStatus ? [status] : [];
    const [countRows]: any = await db.query(`SELECT COUNT(*) AS count FROM document_requests ${where}`, params);
    const [items]: any = await db.query(
      `SELECT id, name, company, email, phone, industry, document_title, document_url, source_page, status, decided_by, decided_at, created_at
       FROM document_requests ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, PAGE_SIZE, (page - 1) * PAGE_SIZE]
    );
    const [pendingRows]: any = await db.query(`SELECT COUNT(*) AS count FROM document_requests WHERE status = 'pending'`);

    const total = countRows[0]?.count || 0;
    return NextResponse.json({
      success: true,
      items,
      pendingCount: pendingRows[0]?.count || 0,
      pagination: { page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total },
    });
  } catch (error) {
    console.error('GET /api/admin/download-requests error:', error);
    return NextResponse.json({ error: 'Failed to load download requests.' }, { status: 500 });
  }
}

/** Approve (emails a private download link) or reject a pending request. */
export async function PATCH(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const id = typeof body.id === 'string' ? body.id : '';
    const action = body.action === 'approve' || body.action === 'reject' ? body.action : null;
    if (!id || !action) return NextResponse.json({ error: 'Request id and action are required.' }, { status: 400 });

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT * FROM document_requests WHERE id = ?', [id]);
    const req = rows[0];
    if (!req) return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    if (req.status !== 'pending') return NextResponse.json({ error: `This request was already ${req.status}.` }, { status: 409 });

    if (action === 'reject') {
      await db.query(`UPDATE document_requests SET status = 'rejected', decided_by = ?, decided_at = NOW() WHERE id = ?`, [admin.email, id]);
      await logActivity(admin.email, 'reject_document_request', 'document_request', id, { email: req.email, document: req.document_title });
      return NextResponse.json({ success: true, message: 'Request rejected.' });
    }

    const mailer = createMailer();
    if (!mailer) {
      return NextResponse.json({ error: 'Email is not configured on the server (SMTP settings missing), so the document cannot be sent.' }, { status: 503 });
    }

    const token = randomBytes(32).toString('hex');
    const link = `${siteUrl()}/api/documents/download?token=${token}`;
    // Send first: if the email fails the request stays pending and can be approved again.
    await mailer.transporter.sendMail({
      from: mailer.from,
      to: req.email,
      subject: `Your requested document: ${req.document_title} | Ace Packaging`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1A1D20;line-height:1.6">
        <p>Dear ${escapeHtml(req.name)},</p>
        <p>Thank you for your interest in Ace Packaging. Your request for <strong>${escapeHtml(req.document_title)}</strong> has been approved.</p>
        <p><a href="${link}" style="display:inline-block;padding:12px 22px;background:#b99750;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Download document</a></p>
        <p style="font-size:13px;color:#666">This private link is valid for ${DOWNLOAD_LINK_TTL_DAYS} days. For samples or pricing, reply to this email or write to sales@acepack.co.in.</p>
        <p>Regards,<br/>Ace Packaging Team</p>
      </div>`,
    });

    await db.query(
      `UPDATE document_requests
       SET status = 'approved', download_token = ?, token_expires_at = DATE_ADD(NOW(), INTERVAL ? DAY), decided_by = ?, decided_at = NOW()
       WHERE id = ? AND status = 'pending'`,
      [token, DOWNLOAD_LINK_TTL_DAYS, admin.email, id]
    );
    await logActivity(admin.email, 'approve_document_request', 'document_request', id, { email: req.email, document: req.document_title });
    return NextResponse.json({ success: true, message: `Approved. Download link emailed to ${req.email}.` });
  } catch (error) {
    console.error('PATCH /api/admin/download-requests error:', error);
    return NextResponse.json({ error: 'Could not update the request. If approving, check the email settings and try again.' }, { status: 500 });
  }
}
