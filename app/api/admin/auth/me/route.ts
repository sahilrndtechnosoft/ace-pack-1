import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }
    return NextResponse.json({ success: true, admin });
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
