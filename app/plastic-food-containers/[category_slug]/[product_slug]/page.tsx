import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ProductDetailInteractive } from '@/components/products/ProductDetailInteractive';
import { ProductCard } from '@/components/products/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  getAllLiveProductPaths,
  resolveLiveProduct,
  getLiveProductSlug, getLiveSeo } from '@/lib/data/live-routing';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface LiveProductPageProps {
  params: Promise<{
    category_slug: string;
    product_slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllLiveProductPaths();
  return paths.map((item) => ({
    category_slug: item.category_slug,
    product_slug: item.product_slug,
  }));
}

export async function generateMetadata({ params }: LiveProductPageProps): Promise<Metadata> {
  const { category_slug, product_slug } = await params;
  const result = resolveLiveProduct(category_slug, product_slug);

  if (!result) {
    return { title: 'Product Not Found | Ace Packaging' };
  }

  const { category, product } = result;
  const canonicalUrl = `https://www.acepack.co.in/plastic-food-containers/${category_slug}/${product_slug}`;
  const live = getLiveSeo(`/plastic-food-containers/${category_slug}/${product_slug}`);
  const title = live?.title || `${product.name} | ${category.name} | Ace Packaging`;
  const description =
    live?.description ||
    `${product.name} (${product.capacity}) moulded from 100% virgin food-grade PP 05 polymer. Leak-proof seal, microwave and freezer safe. Available at Ace Packaging!`;

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
      images: [product.image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function LiveProductPage({ params }: LiveProductPageProps) {
  const { category_slug, product_slug } = await params;
  const result = resolveLiveProduct(category_slug, product_slug);

  if (!result) {
    notFound();
  }

  const { category, product } = result;
  const relatedCategoryProducts = category.products
    .filter((p) => p.id !== product.id && p.product_slug !== product.product_slug)
    .slice(0, 3);

  const canonicalUrl = `https://www.acepack.co.in/plastic-food-containers/${category_slug}/${product_slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image.startsWith('http') ? product.image : `https://www.acepack.co.in${product.image}`,
    description: `${product.name} (${product.capacity}) moulded from 100% virgin food-grade PP 05 polymer. Leak-proof seal, microwave safe, deep-freeze ready.`,
    brand: {
      '@type': 'Brand',
      name: 'Ace Packaging',
    },
    category: category.name,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Ace Packaging',
      },
    },
    url: canonicalUrl,
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[var(--ace-ink)] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <PageBanner
        titleTag="p"
        title={product.name}
        subtitle={`${category.name} — ${product.capacity} volume, 100% virgin food-grade polymer PP 05, zero-leak snap rim.`}
        badge={`MODEL: ${product.capacity}`}
        bgImage={product.image}
        breadcrumbs={[
          { name: 'Plastic Food Containers', href: '/plastic-food-containers' },
          { name: category.name, href: `/plastic-food-containers/${category_slug}` },
          { name: product.name, href: `/plastic-food-containers/${category_slug}/${product_slug}` },
        ]}
      />

      <section className="py-6 sm:py-10 md:py-16">
        <div className="container-custom">
          {/* Back to category button & Certification status */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
            <Link
              href={`/plastic-food-containers/${category_slug}`}
              className="text-xs font-bold text-[#b99750] hover:text-[var(--ace-ink)] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {category.name} Collection</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Virgin PP 05 · Microwave Safe · 100% Recyclable</span>
            </div>
          </div>

          {/* Interactive Specification & Studio View Component */}
          <ProductDetailInteractive
            category={category}
            product={product}
            heading={getLiveSeo(`/plastic-food-containers/${category_slug}/${product_slug}`)?.h1}
          />

          {/* Related Models in this Category */}
          {relatedCategoryProducts.length > 0 && (
            <div className="mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-[#E6DBC6]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--ace-ink)]">
                    Other Models in {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Compare volume capacities and dimensions across the collection
                  </p>
                </div>
                <Link
                  href={`/plastic-food-containers/${category_slug}`}
                  className="text-xs font-bold text-[#b99750] hover:text-[var(--ace-ink)] flex items-center gap-1 group transition-colors"
                >
                  <span>View All {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedCategoryProducts.map((relProduct, idx) => (
                  <ProductCard
                    key={relProduct.id}
                    product={relProduct}
                    categorySlug={category_slug}
                    basePath="/plastic-food-containers"
                    productSlug={getLiveProductSlug(category.slug, relProduct.product_slug)}
                    delay={idx * 0.1}
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
