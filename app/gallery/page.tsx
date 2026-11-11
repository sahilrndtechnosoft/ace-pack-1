import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { HorizontalGallery } from '@/components/gallery/HorizontalGallery';
import { getPageContent, cmsMetadata } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'Container Visual Gallery | Ace Packaging Food Packaging',
  description: 'Explore Ace Packaging\'s high-precision plastic food container product gallery, cleanroom manufacturing facility, and custom IML branded products.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('gallery', staticMetadata);
}


export default async function GalleryPage() {
  const { content, hidden } = await getPageContent('gallery');
  const show = (key: string) => !hidden.includes(key);
  const { banner, gallery, cta } = content;
  return (
    <div className="bg-[#FAF8F4] text-[#1A1D20]">
      {show('banner') && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[{ name: 'Gallery', href: '/gallery' }]} />
      )}

      {/* Pinned horizontal strip — vertical scroll drives the travel, and the
          section carries its own heading so it reads as one full screen. */}
      {show('gallery') && (
        <HorizontalGallery
          items={gallery.items.map((item, i) => ({ id: i + 1, ...item }))}
          kicker={gallery.kicker}
          title={gallery.title}
          intro={gallery.intro}
        />
      )}

      {/* Closing band, so the page resolves instead of ending on the pin. */}
      {show('cta') && <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="rounded-[32px] bg-[#111518] text-white px-8 sm:px-14 py-12 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-extrabold text-[#cfa144] uppercase tracking-[0.16em] block mb-3">
                {cta.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                {cta.heading}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mt-3">
                {cta.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href={cta.primaryButton.link}
                className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-5 py-3 sm:px-7 sm:py-4 rounded-full uppercase tracking-wide sm:tracking-[0.14em] transition-colors"
              >
                <span>{cta.primaryButton.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={cta.secondaryButton.link}
                className="inline-flex items-center gap-2 border border-white/25 hover:border-[#cfa144] hover:text-[#a8812f] text-white text-xs font-bold px-5 py-3 sm:px-7 sm:py-4 rounded-full uppercase tracking-wide sm:tracking-[0.14em] transition-colors"
              >
                <span>{cta.secondaryButton.text}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>}
    </div>
  );
}
