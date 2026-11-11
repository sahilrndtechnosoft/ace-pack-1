import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { getAuthenticatedAdmin } from '@/lib/auth';

// Turns on Next.js draft mode for a logged-in admin so pages render saved drafts instead of published content.
// ?exit=1 turns it off again.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawPath = searchParams.get('path') || '/';
  // Only same-site paths: blocks open redirects such as //evil.com or https://evil.com.
  const path = rawPath.startsWith('/') && !rawPath.startsWith('//') && !rawPath.includes('\\') ? rawPath : '/';

  const draft = await draftMode();
  if (searchParams.get('exit')) {
    draft.disable();
    return NextResponse.redirect(new URL(path, request.url));
  }

  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  draft.enable();
  return NextResponse.redirect(new URL(path, request.url));
}
