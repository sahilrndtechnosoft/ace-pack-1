import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { HorizontalGallery, GalleryItem } from '@/components/gallery/HorizontalGallery';

export const metadata: Metadata = {
  title: 'Container Visual Gallery | AcePack Food Packaging',
  description: 'Explore AcePack\'s high-precision plastic food container product gallery, cleanroom manufacturing facility, and custom IML branded products.',
};

// Every frame is served from /images/gallery as a webp pre-cropped to one
// shared 4:3 ratio: the originals were up to 3MB PNGs at half a dozen
// different aspect ratios, which is what made the old grid look uneven and
// made a swipe stutter while a phone decoded them.
const galleryItems: GalleryItem[] = [
  { id: 1, title: 'RE Bento Meal Delivery Boxes', category: 'Cloud Kitchen Combos', image: '/images/gallery/bento-meal.webp' },
  { id: 2, title: 'Leak-Proof Containers In Service', category: 'Everyday Use', image: '/images/gallery/kitchen-set.webp' },
  { id: 3, title: 'RO Series Round Gravy Tubs', category: 'Soup & Curry Tubs', image: '/images/gallery/ro-series.webp' },
  { id: 4, title: 'One-Piece Hinge Cups', category: 'Fresh & Fruit Packs', image: '/images/gallery/hinge-cups.webp' },
  { id: 5, title: 'RE Series Meal Trays', category: 'Bento & Meal Prep', image: '/images/gallery/re-series.webp' },
  { id: 6, title: 'Sweet Box Containers', category: 'Confectionery', image: '/images/gallery/sweet-box.webp' },
  { id: 7, title: 'The Full Container Range', category: 'Studio Series', image: '/images/gallery/studio-range.webp' },
];

export default function GalleryPage() {
  return (
    <div className="bg-[#FAF8F4] text-[#1A1D20]">
      <PageBanner
        title="Visual Product & Plant Gallery"
        subtitle="High-resolution imagery of our injection-moulded plastic containers, cleanroom production environment, and custom IML branded products."
        badge="PRODUCT & PLANT GALLERY"
        bgImage="/images/gallery/bento-meal.webp"
        breadcrumbs={[{ name: 'Gallery', href: '/gallery' }]}
      />

      {/* Pinned horizontal strip — vertical scroll drives the travel, and the
          section carries its own heading so it reads as one full screen. */}
      <HorizontalGallery
        items={galleryItems}
        kicker="The Range, Up Close"
        title="Seven frames from the studio and the line"
        intro="Product photography of the containers we mould every day — hinge cups, bento boxes, gravy tubs and sweet boxes. Keep scrolling to move through the strip."
      />

      {/* Closing band, so the page resolves instead of ending on the pin. */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="rounded-[32px] bg-[#111518] text-white px-8 sm:px-14 py-12 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-extrabold text-[#cfa144] uppercase tracking-[0.16em] block mb-3">
                Samples & Specifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Want these in your own branding?
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mt-3">
                We ship physical samples and full technical spec sheets for every model in the range.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-7 py-4 rounded-full uppercase tracking-[0.14em] transition-colors"
              >
                <span>Request Samples</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 border border-white/25 hover:border-[#cfa144] hover:text-[#a8812f] text-white text-xs font-bold px-7 py-4 rounded-full uppercase tracking-[0.14em] transition-colors"
              >
                <span>All Categories</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
