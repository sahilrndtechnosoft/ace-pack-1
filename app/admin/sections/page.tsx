import { redirect } from 'next/navigation';

// Old "Sections" screen now lives under each page; keep bookmarks working.
export default async function LegacySectionsRedirect({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  redirect(`/admin/pages/${encodeURIComponent(page || 'home')}`);
}
