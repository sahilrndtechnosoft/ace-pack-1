import React from 'react';
import { getCategoryBySlug, getAllCategorySlugs, productCategories } from '@/lib/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ArrowLeft, ArrowRight, HelpCircle, Box, ShieldCheck, Ruler, Layers } from 'lucide-react';

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

          {/* Streamlined Product Listing (User Requirement 7: important required details only, avoid crowded clutter) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {category.products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Clean Light Image Surface */}
                  <div className="relative h-60 bg-[#FAF8F4] p-6 flex items-center justify-center border-b border-[#E6DBC6]/60">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                    />
                    <span className="absolute top-3 right-3 bg-[#b99750] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {item.capacity}
                    </span>
                    <span className="absolute top-3 left-3 bg-white text-[var(--ace-ink)] border border-[#E6DBC6] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Virgin PP 05
                    </span>
                  </div>

                  {/* Content: Only Important & Required Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--ace-ink)] mb-4 group-hover:text-[#b99750] transition-colors leading-snug">
                      {item.name}
                    </h3>

                    {/* Compact Specs Grid */}
                    <div className="bg-[#FAF8F4] rounded-2xl border border-[#E6DBC6] p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Capacity:</span>
                        <span className="font-bold text-[#b99750]">{item.capacity}</span>
                      </div>
                      {item.dimensions && (
                        <div className="flex items-center justify-between border-t border-[#E6DBC6]/60 pt-2">
                          <span className="text-gray-500 font-medium">Dimensions:</span>
                          <span className="font-semibold text-[var(--ace-ink)]">
                            {item.dimensions.top} × {item.dimensions.height}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-[#E6DBC6]/60 pt-2">
                        <span className="text-gray-500 font-medium">Thermal Range:</span>
                        <span className="font-semibold text-emerald-600">-20°C to +120°C</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#E6DBC6]/60 pt-2">
                        <span className="text-gray-500 font-medium">Case Pack:</span>
                        <span className="font-semibold text-[var(--ace-ink)]">
                          {item.packaging ? item.packaging.split(' ')[0] + ' Pcs / Box' : 'Standard Carton'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Clear Action Button */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/categories/${category.slug}/${item.product_slug}`}
                    className="w-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold py-3.5 rounded-xl text-center uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-[#b99750]/20"
                  >
                    <span>View Specifications &amp; 4-View Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Category FAQ Section */}
          {category.faqs && category.faqs.length > 0 && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm mb-16">
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
              {otherCategories.map((other) => (
                <Link
                  key={other.id}
                  href={`/categories/${other.slug}`}
                  className="bg-white border border-[#E6DBC6] hover:border-[#b99750] rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg group text-left"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#FAF8F4] p-2 flex items-center justify-center shrink-0 border border-[#E6DBC6]">
                    <img src={other.heroImage} alt={other.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--ace-ink)] group-hover:text-[#b99750] transition-colors leading-snug">
                      {other.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{other.products.length} Models available</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
