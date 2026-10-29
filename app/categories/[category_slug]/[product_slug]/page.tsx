import React from 'react';
import { getProductBySlugs, getAllProductPaths } from '@/lib/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ProductDetailInteractive } from '@/components/products/ProductDetailInteractive';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowLeft, ArrowRight, Layers, Box } from 'lucide-react';

interface SpecificProductPageProps {
  params: Promise<{
    category_slug: string;
    product_slug: string;
  }>;
  searchParams?: Promise<{
    variety?: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllProductPaths();
  return paths.map((item) => ({
    category_slug: item.category_slug,
    product_slug: item.product_slug,
  }));
}

export async function generateMetadata({ params }: SpecificProductPageProps): Promise<Metadata> {
  const { category_slug, product_slug } = await params;
  const result = getProductBySlugs(category_slug, product_slug);
  if (!result) return { title: 'Product Not Found | Ace Packaging' };

  return {
    title: `${result.product.name} - ${result.category.name} | Ace Packaging`,
    description: `${result.product.name} (${result.product.capacity}) moulded from 100% virgin food-grade PP 05 polymer. Leak-proof seal, microwave and freezer safe.`,
  };
}

export default async function SpecificProductPage({ params, searchParams }: SpecificProductPageProps) {
  const { category_slug, product_slug } = await params;
  const { variety } = (await searchParams) || {};
  const result = getProductBySlugs(category_slug, product_slug);

  if (!result) {
    notFound();
  }

  const { category, product } = result;
  const relatedCategoryProducts = category.products.filter((p) => p.product_slug !== product_slug);

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[var(--ace-ink)] pb-24">
      <PageBanner
        title={product.name}
        subtitle={`${category.name} — ${product.capacity} volume, 100% virgin food-grade polymer PP 05, zero-leak snap rim.`}
        badge={`MODEL: ${product.capacity}`}
        bgImage={product.image}
        breadcrumbs={[
          { name: 'Categories', href: '/categories' },
          { name: category.name, href: `/categories/${category.slug}` },
          { name: product.name, href: `/categories/${category.slug}/${product.product_slug}` },
        ]}
      />

      <section className="py-6 sm:py-10 md:py-16">
        <div className="container-custom">
          {/* Back to category button & Certification status */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b99750] hover:text-[var(--ace-ink)] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to {category.name} Collection</span>
            </Link>

            <span className="text-[11px] sm:text-xs text-gray-500 font-medium bg-white/70 px-3 py-1 rounded-full border border-[#E6DBC6]/70">
              ISO 9001:2015 Certified
            </span>
          </div>

          {/* Interactive 4-View Showcase (Blank, Specs, Food Locking, Video) */}
          <ProductDetailInteractive category={category} product={product} initialVariety={variety} />

          {/* Related Models in this category */}
          {relatedCategoryProducts.length > 0 && (
            <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-[#E6DBC6]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--ace-ink)]">
                    Other Models in {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Explore different sizes and configurations within this collection.
                  </p>
                </div>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-xs font-bold text-[#b99750] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View All {category.products.length} Models</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {relatedCategoryProducts.map((rel, idx) => (
                  <Reveal key={rel.id} type="fade-up" delay={idx * 0.08}>
                    <Link
                      href={`/categories/${category.slug}/${rel.product_slug}`}
                      className="bg-white border border-[#E6DBC6] hover:border-[#b99750] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 transition-all hover:shadow-lg group text-left h-full"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-b from-white to-[#F7F4EC] overflow-hidden flex items-center justify-center shrink-0 border border-[#E6DBC6]">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] sm:text-[11px] font-extrabold text-[#b99750] uppercase block">
                          {rel.capacity}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[var(--ace-ink)] group-hover:text-[#b99750] transition-colors leading-snug truncate">
                          {rel.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 truncate">
                          {rel.packaging ? rel.packaging.split(' ')[0] + ' Pcs / Box' : '100% Virgin PP 05'}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
