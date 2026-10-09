import React from 'react';
import { getProductBySlugs, getAllProductPaths } from '@/lib/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ProductDetailInteractive } from '@/components/products/ProductDetailInteractive';
import { ArrowLeft, ArrowRight, Layers, Box } from 'lucide-react';

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
  const result = getProductBySlugs(category_slug, product_slug);
  if (!result) return { title: 'Product Not Found | Ace Packaging' };

  return {
    title: `${result.product.name} - ${result.category.name} | Ace Packaging`,
    description: `${result.product.name} (${result.product.capacity}) moulded from 100% virgin food-grade PP 05 polymer. Leak-proof seal, microwave and freezer safe.`,
  };
}

export default async function SpecificProductPage({ params }: SpecificProductPageProps) {
  const { category_slug, product_slug } = await params;
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

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container-custom">
          {/* Back to category button */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b99750] hover:text-[var(--ace-ink)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {category.name} Collection</span>
            </Link>

            <span className="text-xs text-gray-500 font-medium">
              US FDA 21 CFR 177.1520 &amp; ISO 9001:2015 Certified
            </span>
          </div>

          {/* Interactive 4-View Showcase (Blank, Specs, Food Locking, Video) */}
          <ProductDetailInteractive category={category} product={product} />

          {/* Related Models in this category */}
          {relatedCategoryProducts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-[#E6DBC6]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--ace-ink)]">
                    Other Models in {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Explore different sizes and configurations within this collection.
                  </p>
                </div>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-xs font-bold text-[#b99750] hover:underline flex items-center gap-1"
                >
                  <span>View All {category.products.length}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCategoryProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/categories/${category.slug}/${rel.product_slug}`}
                    className="bg-white border border-[#E6DBC6] hover:border-[#b99750] rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg group text-left"
                  >
                    <div className="w-20 h-20 rounded-xl bg-[#FAF8F4] p-2 flex items-center justify-center shrink-0 border border-[#E6DBC6]">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-[#b99750] uppercase block">
                        {rel.capacity}
                      </span>
                      <h4 className="text-sm font-bold text-[var(--ace-ink)] group-hover:text-[#b99750] transition-colors leading-snug">
                        {rel.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {rel.packaging ? rel.packaging.split(' ')[0] + ' Pcs / Box' : '100% Virgin PP 05'}
                      </p>
                    </div>
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
