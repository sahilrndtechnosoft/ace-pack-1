import path from 'node:path';
import fs from 'node:fs';
import nodemailer from 'nodemailer';

export type DocumentRequestStatus = 'pending' | 'approved' | 'rejected';

export const DOWNLOAD_LINK_TTL_DAYS = 7;
const PUBLIC_DIR = path.join(process.cwd(), 'public');
// Only files the Download Center serves may be requested; everything else is refused.
const ALLOWED_PREFIXES = ['/downloads/', '/uploads/'];
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp']);

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.acepack.co.in').replace(/\/+$/, '');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Maps a site path like "/downloads/catalog.pdf" to the file on disk, or null when the path is not a
 * downloadable document. Resolving and re-checking the directory blocks "../" escapes.
 */
export function resolveDocumentFile(urlPath: unknown): string | null {
  if (typeof urlPath !== 'string') return null;
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (!ALLOWED_PREFIXES.some((prefix) => clean.startsWith(prefix))) return null;
  if (!ALLOWED_EXTENSIONS.has(path.extname(clean).toLowerCase())) return null;
  const absolute = path.resolve(PUBLIC_DIR, '.' + clean);
  if (!absolute.startsWith(PUBLIC_DIR + path.sep)) return null;
  return fs.existsSync(absolute) && fs.statSync(absolute).isFile() ? absolute : null;
}

export function createMailer() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    }),
    from: process.env.SMTP_FROM || `"Ace Packaging" <${user}>`,
  };
}

export function salesInbox(): string {
  return process.env.ADMIN_EMAIL || 'sales@acepack.co.in';
}
