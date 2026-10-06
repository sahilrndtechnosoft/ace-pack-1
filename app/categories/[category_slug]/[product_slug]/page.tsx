import React from 'react';
import { getProductBySlugs, getAllProductPaths } from '@/lib/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ShieldCheck, Flame, ArrowRight, CheckCircle2, Lock, FileDown } from 'lucide-react';

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
    description: `${result.product.name} (${result.product.capacity}) made from 100% virgin food-grade PP 05 plastic. Microwave and freezer safe container for takeaway and packaging.`,
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
    <div className="bg-[var(--ace-paper)] min-h-screen text-[var(--ace-ink)] pb-24">
      <PageBanner
        title={product.name}
        subtitle={`${category.name} — ${product.capacity} capacity, ${product.material} material grade, 100% food safe.`}
        badge={`MODEL: ${product.capacity}`}
        bgImage={product.image}
        breadcrumbs={[
          { name: 'Categories', href: '/categories' },
          { name: category.name, href: `/categories/${category.slug}` },
          { name: product.name, href: `/categories/${category.slug}/${product.product_slug}` }
        ]}
      />

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container-custom">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-start">

            <div className="md:col-span-6 flex flex-col gap-4 sm:gap-6 md:sticky md:top-24 self-start z-10">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[var(--ace-orange)]/80 bg-[#050505] p-5 sm:p-8 md:p-12 flex items-center justify-center min-h-[260px] sm:min-h-[380px] md:min-h-[460px] shadow-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[240px] sm:max-h-[380px] max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[var(--ace-orange)] text-[var(--ace-ink)] text-[15px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full uppercase tracking-wider shadow">
                  {product.capacity}
                </span>
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md text-[var(--ace-ink)] text-[15px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[var(--ace-line)]">
                  ISO 9001 Tested
                </span>
              </div>

              {category.gallery && category.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {category.gallery.map((img, idx) => (
                    <div key={idx} className="border border-[var(--ace-line)] rounded-xl sm:rounded-2xl overflow-hidden bg-[#050505] p-2 sm:p-3 h-16 sm:h-24 flex items-center justify-center">
                      <img src={img} alt={`${product.name} view ${idx}`} className="max-h-full max-w-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-6 flex flex-col gap-5 sm:gap-8">

              <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[var(--ace-line)] shadow-sm">
                <span className="text-xs font-extrabold text-[var(--ace-orange)] uppercase tracking-wider block mb-1">
                  CATEGORY: {category.name}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ace-ink)] mb-4">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                  High-performance food container engineered from 100% virgin polypropylene (PP 05). Designed for leak-proof lid sealing, high stacking durability, and food freshness preservation.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[var(--ace-paper)] p-3.5 rounded-2xl border border-[var(--ace-line)] flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[var(--ace-orange)] shrink-0" />
                    <div>
                      <p className="text-[15px] text-gray-500 uppercase font-semibold">Material Grade</p>
                      <p className="text-xs font-bold text-[var(--ace-ink)]">{product.material}</p>
                    </div>
                  </div>

                  <div className="bg-[var(--ace-paper)] p-3.5 rounded-2xl border border-[var(--ace-line)] flex items-center gap-3">
                    <Flame className="w-5 h-5 text-[var(--ace-orange)] shrink-0" />
                    <div>
                      <p className="text-[15px] text-gray-500 uppercase font-semibold">Thermal Rating</p>
                      <p className="text-xs font-bold text-[var(--ace-ink)]">-20°C to +120°C</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ace-ink)] mb-3">Technical Specifications Table</h3>
                  <div className="border border-[var(--ace-line)] rounded-2xl overflow-x-auto text-xs">
                    <table className="w-full min-w-[420px] text-left border-collapse">
                      <tbody>
                        <tr className="border-b border-[var(--ace-line)] bg-[var(--ace-paper)]">
                          <td className="p-3 font-bold text-gray-600 w-1/3">Size / Capacity</td>
                          <td className="p-3 font-bold text-[var(--ace-orange)]">{product.capacity}</td>
                        </tr>
                        <tr className="border-b border-[var(--ace-line)]">
                          <td className="p-3 font-bold text-gray-600">Quality Grade</td>
                          <td className="p-3 font-bold text-[var(--ace-ink)]">{product.quality}</td>
                        </tr>
                        <tr className="border-b border-[var(--ace-line)] bg-[var(--ace-paper)]">
                          <td className="p-3 font-bold text-gray-600">Material Resin</td>
                          <td className="p-3 font-bold text-[var(--ace-ink)]">{product.material}</td>
                        </tr>
                        <tr className="border-b border-[var(--ace-line)]">
                          <td className="p-3 font-bold text-gray-600">Food Safe Grade</td>
                          <td className="p-3 font-bold text-emerald-600">Yes (100% BPA Free)</td>
                        </tr>
                        {product.dimensions && (
                          <tr className="border-b border-[var(--ace-line)] bg-[var(--ace-paper)]">
                            <td className="p-3 font-bold text-gray-600">Dimensions (L x W x H)</td>
                            <td className="p-3 font-bold text-[var(--ace-ink)]">
                              {product.dimensions.top} (Top) x {product.dimensions.height} (H)
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="p-3 font-bold text-gray-600">Carton Packaging</td>
                          <td className="p-3 text-gray-700">{product.packaging || 'Standard Export Carton'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ace-ink)] mb-3">Key Features & Benefits</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-2xl px-3.5 py-3 text-xs text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-[var(--ace-orange)] shrink-0 mt-0.5" />
                          <span className="font-semibold">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.applications && (
                  <div className="mb-6">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ace-ink)] mb-2">Ideal Applications</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[var(--ace-paper)] text-gray-700 px-3 py-1 rounded-full border border-[var(--ace-line)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ace-orange)]" /> {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/downloads#${category.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-[var(--ace-ink)] bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-xl px-4 py-2.5 hover:border-[var(--ace-orange)] transition-colors">
                    <FileDown className="w-4 h-4 text-[var(--ace-orange)]" /> Datasheet &amp; brochure
                  </Link>
                  <span className="text-[15px] text-gray-500">Specifications, CAD drawings and certifications for the {category.name} line.</span>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-[var(--ace-orange)]/70 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--ace-ink)] mb-1">Inquire Factory Pricing for {product.name}</h3>
                <p className="text-xs text-gray-500 mb-6">Fill in your requirements below to receive a wholesale quote & free sample kit.</p>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[15px] font-bold text-[var(--ace-ink)] uppercase block mb-1">Full Name *</label>
                      <input type="text" placeholder="John Doe" required className="w-full bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[var(--ace-orange)]" />
                    </div>
                    <div>
                      <label className="text-[15px] font-bold text-[var(--ace-ink)] uppercase block mb-1">Work Email *</label>
                      <input type="email" placeholder="john@company.com" required className="w-full bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[var(--ace-orange)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[15px] font-bold text-[var(--ace-ink)] uppercase block mb-1">Phone Number</label>
                      <input type="tel" placeholder="+91 98000 00000" className="w-full bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[var(--ace-orange)]" />
                    </div>
                    <div>
                      <label className="text-[15px] font-bold text-[var(--ace-ink)] uppercase block mb-1">Estimated Quantity</label>
                      <input type="text" placeholder="e.g. 5,000 Pcs" className="w-full bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[var(--ace-orange)]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[15px] font-bold text-[var(--ace-ink)] uppercase block mb-1">Inquiry Message *</label>
                    <textarea rows={3} placeholder={`Inquiry for ${product.name} (${product.capacity})...`} required className="w-full bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-xl p-4 text-xs focus:outline-none focus:border-[var(--ace-orange)]"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-[var(--ace-orange)] hover:bg-[var(--ace-ink)] hover:text-[var(--ace-paper)] text-[var(--ace-ink)] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2">
                    <span>Submit Wholesale Quote Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

          </div>

          {relatedCategoryProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-[var(--ace-ink)] mb-6">Other Models in {category.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedCategoryProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/categories/${category.slug}/${rel.product_slug}`}
                    className="bg-white border border-[var(--ace-line)] hover:border-[var(--ace-orange)] rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-[#050505] p-2 flex items-center justify-center shrink-0 border border-[var(--ace-orange)]/30">
                      <img src={rel.image} alt={rel.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[15px] font-bold text-[var(--ace-orange)] uppercase block">{rel.capacity}</span>
                      <h4 className="text-sm font-bold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] transition-colors">{rel.name}</h4>
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
