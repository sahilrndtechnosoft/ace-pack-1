import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ArrowLeft, Box } from 'lucide-react';
import { CategoryProductGrid } from '@/components/categories/CategoryProductGrid';
import {
  getAllLiveCategorySlugs,
  resolveLiveCategory,
  getLiveSeo,
  getLiveProductSlug,
  LIVE_CATEGORIES,
} from '@/lib/data/live-routing';
import { getCmsCategoryBySlug, getSiteText } from '@/lib/db/content';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface LiveCategoryPageProps {
  params: Promise<{
    category_slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllLiveCategorySlugs();
  return slugs.map((category_slug) => ({ category_slug }));
}

export async function generateMetadata({ params }: LiveCategoryPageProps): Promise<Metadata> {
  const { category_slug } = await params;
  const res = resolveLiveCategory(category_slug);
  const cmsCategory = !res ? await getCmsCategoryBySlug(category_slug) : null;
  const cat = res?.category || cmsCategory;

  if (!cat) {
    return { title: 'Category Not Found | Ace Packaging' };
  }

  const live = getLiveSeo(`/plastic-food-containers/${category_slug}`);
  const title = live?.title || `${cat.name} | Food Storage Packaging | Ace Packaging`;
  const description =
    live?.description ||
    res?.meta.description ||
    cat.description ||
    `Shop ${cat.name} for meal prep, takeaway, and food packaging. High-clarity, microwave-safe, virgin food-grade PP 05.`;
  const canonicalUrl = `https://www.acepack.co.in/plastic-food-containers/${category_slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: cat.heroImage ? [cat.heroImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LiveCategoryPage({ params }: LiveCategoryPageProps) {
  const L = (await getSiteText()).labels;
  const { category_slug } = await params;
  const res = resolveLiveCategory(category_slug);
  const cmsCategory = !res ? await getCmsCategoryBySlug(category_slug) : null;
  const category = res?.category || cmsCategory;

  if (!category) {
    notFound();
  }

  const otherCategories = LIVE_CATEGORIES.filter((c) => c.slug !== category_slug).slice(0, 4);

  const liveH1 = getLiveSeo(`/plastic-food-containers/${category_slug}`)?.h1;
  const productSlugMap: Record<string, string> = {};
  for (const p of category.products) {
    productSlugMap[p.id] = getLiveProductSlug(category.slug, p.product_slug);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: res?.meta.description || category.description,
    url: `https://www.acepack.co.in/plastic-food-containers/${category_slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.products.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.name,
        url: `https://www.acepack.co.in/plastic-food-containers/${category_slug}/${getLiveProductSlug(
          category.slug,
          p.product_slug
        )}`,
      })),
    },
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[var(--ace-ink)] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <PageBanner
        titleTag="p"
        title={category.name}
        subtitle={res?.meta.description || category.description}
        badge={`COLLECTION: ${(category.subtitleName || category.name).toUpperCase()}`}
        bgImage={category.heroImage || '/b9d572a7-af59-4e63-92e8-2971440edffe.png'}
        breadcrumbs={[
          { name: 'Plastic Food Containers', href: '/plastic-food-containers' },
          { name: category.name, href: `/plastic-food-containers/${category_slug}` },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E6DBC6]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ace-ink)] flex items-center gap-2.5">
                <Box className="w-6 h-6 text-[#b99750]" />
                <span>{liveH1 || `${category.name} (${category.products.length} Models)`}</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                Precision-engineered from 100% prime virgin PP 05. Food-safe, microwaveable, deep-freeze ready, and 100% recyclable.
              </p>
            </div>

            <Link
              href="/plastic-food-containers"
              className="text-xs font-bold text-[#b99750] hover:text-[var(--ace-ink)] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{L.seriesAllContainers}</span>
            </Link>
          </div>

          {/* Product Grid with live URLs */}
          <CategoryProductGrid
            products={category.products}
            categorySlug={category_slug}
            basePath="/plastic-food-containers"
            productSlugMap={productSlugMap}
          />

          {/* Quick Browse Other Collections */}
          {otherCategories.length > 0 && (
            <div className="mt-16 pt-10 border-t border-[#E6DBC6]">
              <h3 className="text-lg font-bold text-[var(--ace-ink)] mb-4">
                {L.seriesOtherSeries}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {otherCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/plastic-food-containers/${c.slug}`}
                    className="p-4 rounded-2xl bg-white border border-[#E6DBC6] hover:border-[#b99750] hover:shadow-md transition-all group"
                  >
                    <h4 className="text-xs font-bold text-[var(--ace-ink)] group-hover:text-[#b99750] transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
                      {c.subtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
