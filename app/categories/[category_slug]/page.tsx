import React from 'react';
import { getCategoryBySlug, getAllCategorySlugs, productCategories } from '@/lib/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ArrowLeft, ArrowRight, HelpCircle, Box } from 'lucide-react';

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
    title: `${category.name} (${category.subtitleName}) | Ace Packaging Plastic Food Packaging`,
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
    <div className="bg-[var(--ace-paper)] min-h-screen text-[var(--ace-ink)] pb-24">
      <PageBanner
        title={category.name}
        subtitle={category.description}
        badge={`CATEGORY: ${category.subtitleName.toUpperCase()}`}
        bgImage={category.heroImage}
        breadcrumbs={[
          { name: 'Categories', href: '/categories' },
          { name: category.name, href: `/categories/${category.slug}` }
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--ace-line)]">
            <div>
              <h2 className="text-2xl font-bold text-[var(--ace-ink)] flex items-center gap-2">
                <Box className="w-6 h-6 text-[var(--ace-orange)]" />
                <span>{category.name} Available Models ({category.products.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">Certified 100% Virgin Food-Grade Polypropylene PP 05.</p>
            </div>

            <Link href="/categories" className="text-xs font-bold text-[var(--ace-orange)] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> All Categories
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {category.products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-2 border-[var(--ace-orange)]/70 hover:border-[var(--ace-orange)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 bg-[#050505] p-6 flex items-center justify-center border-b border-[var(--ace-line)]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                    />
                    <span className="absolute top-3 right-3 bg-[var(--ace-orange)] text-[var(--ace-ink)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {item.capacity}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--ace-ink)] mb-4 group-hover:text-[var(--ace-orange)] transition-colors">
                      {item.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-[var(--ace-paper)] p-3.5 rounded-2xl border border-[var(--ace-line)] mb-4">
                      <div>
                        <span className="text-[15px] text-gray-500 uppercase font-semibold block">Size/Capacity</span>
                        <span className="font-bold text-[var(--ace-orange)]">{item.capacity}</span>
                      </div>
                      <div>
                        <span className="text-[15px] text-gray-500 uppercase font-semibold block">Quality</span>
                        <span className="font-bold text-[var(--ace-ink)]">{item.quality}</span>
                      </div>
                      <div>
                        <span className="text-[15px] text-gray-500 uppercase font-semibold block">Material</span>
                        <span className="font-bold text-[var(--ace-ink)]">{item.material}</span>
                      </div>
                      <div>
                        <span className="text-[15px] text-gray-500 uppercase font-semibold block">Food Grade</span>
                        <span className="font-bold text-emerald-600">Yes (BPA Free)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 bg-[var(--ace-ink)] hover:bg-black text-white text-xs font-bold py-3 rounded-xl text-center uppercase tracking-wider transition-colors"
                  >
                    Inquire Now
                  </Link>

                  <Link
                    href={`/categories/${category.slug}/${item.product_slug}`}
                    className="flex-1 bg-[var(--ace-orange)] hover:bg-[var(--ace-ink)] hover:text-[var(--ace-paper)] text-[var(--ace-ink)] text-xs font-bold py-3 rounded-xl text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {category.faqs && category.faqs.length > 0 && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[var(--ace-line)] shadow-sm mb-16">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--ace-orange)] uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" /> FAQ & Guidance
              </div>
              <h3 className="text-2xl font-extrabold text-[var(--ace-ink)] mb-6">Frequently Asked Questions about {category.name}</h3>

              <div className="space-y-4">
                {category.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-[var(--ace-paper)] p-5 rounded-2xl border border-[var(--ace-line)]">
                    <h4 className="text-sm font-bold text-[var(--ace-ink)] mb-1">{faq.question}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-[var(--ace-ink)] mb-6">Explore Other Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherCategories.map((other) => (
                <Link
                  key={other.id}
                  href={`/categories/${other.slug}`}
                  className="bg-white border border-[var(--ace-line)] hover:border-[var(--ace-orange)] rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg group"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#050505] p-2 flex items-center justify-center shrink-0 border border-[var(--ace-orange)]/30">
                    <img src={other.heroImage} alt={other.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] transition-colors">{other.name}</h4>
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
