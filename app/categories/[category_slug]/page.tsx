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
  if (!category) return { title: 'Category Not Found | AcePack' };

  return {
    title: `${category.name} (${category.subtitleName}) | AcePack Plastic Food Packaging`,
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
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
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
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E6DBC6]">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1D20] flex items-center gap-2">
                <Box className="w-6 h-6 text-[#a8812f]" />
                <span>{category.name} Available Models ({category.products.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">Certified 100% Virgin Food-Grade Polypropylene PP 05.</p>
            </div>

            <Link href="/categories" className="text-xs font-bold text-[#a8812f] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> All Categories
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {category.products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-2 border-[#cfa144]/70 hover:border-[#cfa144] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 bg-[#050505] p-6 flex items-center justify-center border-b border-[#E6DBC6]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                    />
                    <span className="absolute top-3 right-3 bg-[#cfa144] text-[#1A1D20] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {item.capacity}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1A1D20] mb-4 group-hover:text-[#a8812f] transition-colors">
                      {item.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8F4] p-3.5 rounded-2xl border border-[#E6DBC6] mb-4">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Size/Capacity</span>
                        <span className="font-bold text-[#a8812f]">{item.capacity}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Quality</span>
                        <span className="font-bold text-[#1A1D20]">{item.quality}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Material</span>
                        <span className="font-bold text-[#1A1D20]">{item.material}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Food Grade</span>
                        <span className="font-bold text-emerald-600">Yes (BPA Free)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 bg-[#111518] hover:bg-black text-white text-xs font-bold py-3 rounded-xl text-center uppercase tracking-wider transition-colors"
                  >
                    Inquire Now
                  </Link>

                  <Link
                    href={`/categories/${category.slug}/${item.product_slug}`}
                    className="flex-1 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold py-3 rounded-xl text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {category.faqs && category.faqs.length > 0 && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm mb-16">
              <div className="flex items-center gap-2 text-xs font-bold text-[#a8812f] uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" /> FAQ & Guidance
              </div>
              <h3 className="text-2xl font-extrabold text-[#1A1D20] mb-6">Frequently Asked Questions about {category.name}</h3>

              <div className="space-y-4">
                {category.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E6DBC6]">
                    <h4 className="text-sm font-bold text-[#1A1D20] mb-1">{faq.question}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-[#1A1D20] mb-6">Explore Other Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherCategories.map((other) => (
                <Link
                  key={other.id}
                  href={`/categories/${other.slug}`}
                  className="bg-white border border-[#E6DBC6] hover:border-[#cfa144] rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg group"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#050505] p-2 flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                    <img src={other.heroImage} alt={other.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1D20] group-hover:text-[#a8812f] transition-colors">{other.name}</h4>
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
