import { PageContentEditor } from '@/components/admin/PageContentEditor';

export default async function AdminPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PageContentEditor key={slug} pageSlug={slug} />;
}
