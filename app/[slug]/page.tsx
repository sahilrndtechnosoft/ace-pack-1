import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { cmsMetadata, getCustomPage } from '@/lib/db/content';

// Renders pages created in the admin (Website Pages → Create New Page). Built-in routes such as
// /about are separate folders and always take precedence over this catch-all.
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) return {};
  return cmsMetadata(slug, { title: `${page.seo.title} | Ace Packaging` });
}

export default async function CustomCmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) notFound();

  const { banner, content } = page.content;
  const show = (key: string) => !page.hidden.includes(key);
  const blocks = content.blocks.filter((b) => b.heading || b.text || b.image);

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {show('banner') && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[{ name: page.seo.title, href: `/${slug}` }]} />
      )}
      {show('content') && (
        <section className="py-12 md:py-16">
          <div className="container-custom max-w-4xl mx-auto space-y-12">
            {blocks.map((block, i) => (
              <article key={i} className="grid gap-6 md:grid-cols-2 md:items-center">
                <div className={block.image ? '' : 'md:col-span-2'}>
                  {block.heading && <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">{block.heading}</h2>}
                  {block.text.split(/\n{2,}/).map((para, j) => (
                    <p key={j} className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 whitespace-pre-line">{para}</p>
                  ))}
                </div>
                {block.image && (
                  <img src={block.image} alt={block.imageAlt || block.heading || ''} className="w-full rounded-3xl border border-[#E6DBC6] object-cover" loading="lazy" />
                )}
              </article>
            ))}
            {content.button.text && content.button.link && (
              <Link href={content.button.link} className="inline-flex items-center gap-2 bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold px-6 py-3.5 rounded-full uppercase tracking-wider">
                {content.button.text} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
