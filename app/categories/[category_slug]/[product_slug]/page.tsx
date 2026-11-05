import React from 'react';
import { getProductBySlugs, getAllProductPaths } from '@/lib/data/products';
import { getCmsProductBySlugs } from '@/lib/db/content';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ProductDetailInteractive } from '@/components/products/ProductDetailInteractive';
import { ProductCard } from '@/components/products/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface SpecificProductPageProps {
  params: Promise<{
    category_slug: string;
    product_slug: string;
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
  const result = (await getCmsProductBySlugs(category_slug, product_slug)) || getProductBySlugs(category_slug, product_slug);
  if (!result) return { title: 'Product Not Found | Ace Packaging' };

  return {
    title: `${result.product.name} - ${result.category.name} | Ace Packaging`,
    description: `${result.product.name} (${result.product.capacity}) moulded from 100% virgin food-grade PP 05 polymer. Leak-proof seal, microwave and freezer safe.`,
  };
}

export default async function SpecificProductPage({ params }: SpecificProductPageProps) {
  const { category_slug, product_slug } = await params;
  const result = (await getCmsProductBySlugs(category_slug, product_slug)) || getProductBySlugs(category_slug, product_slug);

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
          <ProductDetailInteractive category={category} product={product} />

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

              {/* Grid matching exact width, height, and layout of cards in other pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
                {relatedCategoryProducts.map((rel, idx) => (
                  <ProductCard
                    key={rel.id}
                    product={rel}
                    categorySlug={category.slug}
                    delay={Math.min(idx % 3, 2) * 0.08}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
