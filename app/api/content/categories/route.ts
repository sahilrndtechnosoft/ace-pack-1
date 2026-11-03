import { NextRequest, NextResponse } from 'next/server';
import { getCmsCategories } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const categories = await getCmsCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Public content categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}
