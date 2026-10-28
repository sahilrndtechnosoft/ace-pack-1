import React from 'react';
import { getCategoryBySlug, getAllCategorySlugs, productCategories } from '@/lib/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowLeft, ArrowRight, HelpCircle, Box, ShieldCheck, Ruler, Layers } from 'lucide-react';
import { CategoryProductGrid } from '@/components/categories/CategoryProductGrid';

interface CategoryDetailPageProps {
  params: Promise<{
    category_slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((category_slug) => ({ category_slug }));
}

export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  const { category_slug } = await params;
  const category = getCategoryBySlug(category_slug);
  if (!category) return { title: 'Category Not Found | Ace Packaging' };

  return {
    title: `${category.name} (${category.subtitleName}) | Ace Packaging Food Packaging`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { category_slug } = await params;
  const category = getCategoryBySlug(category_slug);

  if (!category) {
    notFound();
  }

  const otherCategories = productCategories.filter((c) => c.slug !== category_slug).slice(0, 3);

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[var(--ace-ink)] pb-24">
      <PageBanner
        title={category.name}
        subtitle={category.description}
        badge={`COLLECTION: ${category.subtitleName.toUpperCase()}`}
        bgImage={category.heroImage}
        breadcrumbs={[
          { name: 'Categories', href: '/categories' },
          { name: category.name, href: `/categories/${category.slug}` },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E6DBC6]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ace-ink)] flex items-center gap-2.5">
                <Box className="w-6 h-6 text-[#b99750]" />
                <span>Available Models in {category.name} ({category.products.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Precision-engineered from 100% prime virgin PP 05. Food-safe, microwaveable and deep-freeze ready.
              </p>
            </div>

            <Link
              href="/categories"
              className="text-xs font-bold text-[#b99750] hover:text-[var(--ace-ink)] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Collections</span>
            </Link>
          </div>

          {/* Streamlined Product Listing with Interactive Variety Selection */}
          <CategoryProductGrid products={category.products} categorySlug={category.slug} />

          {/* Category FAQ Section */}
          {category.faqs && category.faqs.length > 0 && (
            <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm mb-16">
              <div className="flex items-center gap-2 text-xs font-bold text-[#b99750] uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" /> FAQ &amp; Guidance
              </div>
              <h3 className="text-2xl font-extrabold text-[var(--ace-ink)] mb-6">
                Frequently Asked Questions about {category.name}
              </h3>

              <div className="space-y-4">
                {category.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E6DBC6]">
                    <h4 className="text-sm font-bold text-[var(--ace-ink)] mb-1">{faq.question}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Categories Strip */}
          <div>
            <h3 className="text-xl font-bold text-[var(--ace-ink)] mb-6">Explore Other Collections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherCategories.map((other, idx) => (
                <Reveal key={other.id} type="fade-up" delay={idx * 0.08}>
                  <Link
                    href={`/categories/${other.slug}`}
                    className="bg-white border border-[#E6DBC6] hover:border-[#b99750] rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg group text-left h-full"
                  >
                    <div className="w-16 h-16 rounded-xl bg-[#FAF8F4] p-2 flex items-center justify-center shrink-0 border border-[#E6DBC6]">
                      <img src={other.heroImage} alt={other.name} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--ace-ink)] group-hover:text-[#b99750] transition-colors leading-snug">
                        {other.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{other.products.length} Models available</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
