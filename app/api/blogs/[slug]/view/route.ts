import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';

const SLUG = /^[a-z0-9][a-z0-9-]{0,190}$/;
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|curl|wget|python|httpclient/i;
const SEEN_COOKIE = 'ace_blog_seen';
const SEEN_MAX = 120; // posts remembered per browser; the oldest drop off first
const YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Short, fixed-length token so the cookie stays small whatever the slug length. */
const token = (slug: string) => createHash('sha1').update(slug).digest('hex').slice(0, 8);

function isCrossSite(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host !== request.headers.get('host');
  } catch {
    return true; // malformed Origin header
  }
}

/**
 * Counts one read of a published blog post: once per browser per post, never for bots or
 * cross-site requests. The count lives in blogs.views as "N Views" (the format imported from
 * the old site) and is incremented in SQL, so concurrent reads are never lost.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUG.test(slug)) return NextResponse.json({ counted: false }, { status: 400 });
  if (isCrossSite(request)) return NextResponse.json({ counted: false }, { status: 403 });
  if (BOT.test(request.headers.get('user-agent') ?? '')) return NextResponse.json({ counted: false });

  const seen = (request.cookies.get(SEEN_COOKIE)?.value ?? '').split('.').filter((t) => /^[0-9a-f]{8}$/.test(t));
  const mine = token(slug);
  if (seen.includes(mine)) return NextResponse.json({ counted: false });

  try {
    await initDb();
    const [result] = await getDbPool().query(
      `UPDATE blogs
          SET views = CONCAT(COALESCE(CAST(REGEXP_SUBSTR(REPLACE(views, ',', ''), '[0-9]+') AS UNSIGNED), 0) + 1, ' Views')
        WHERE slug = ? AND is_published = 1`,
      [slug]
    );
    const counted = (result as { affectedRows?: number }).affectedRows === 1;
    const response = NextResponse.json({ counted });
    if (counted) {
      response.cookies.set(SEEN_COOKIE, [...seen, mine].slice(-SEEN_MAX).join('.'), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: YEAR_SECONDS,
      });
    }
    return response;
  } catch (err) {
    console.error(`Blog view count failed for "${slug}":`, err);
    return NextResponse.json({ counted: false }, { status: 500 });
  }
}
