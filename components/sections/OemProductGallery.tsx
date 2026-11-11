'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import {
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

export interface OemGalleryItem {
  id: string | number;
  title: string;
  category: string;
  description: string;
  image: string;
  specs?: string[];
}

interface OemProductGalleryProps {
  badge?: string;
  heading?: string;
  lead?: string;
  items?: OemGalleryItem[];
  kind?: 'oem' | 'customization' | 'oem_customization';
}

const DEFAULT_ITEMS: OemGalleryItem[] = [
  {
    id: 'round-glass-range',
    title: 'Round Glass Multi-Capacity Line',
    category: 'Round Glass Range',
    description:
      'Custom-tooled 90mm round drinkware and dessert cups in 350ml, 500ml, 600ml, and 700ml capacities with hermetic snap-lock rims and ultra-clear PP 05 transparency.',
    image: '/images/oem/DSC04469.webp',
    specs: ['350ml - 700ml Formats', '90mm Standard Rim', '100% Prime Virgin PP 05', 'Optical Clarity'],
  },
  {
    id: 'custom-lids-closures',
    title: 'Bespoke Coloured Tethered Lids & Closures',
    category: 'Tethered Closures',
    description:
      'Vibrant custom Pantone polymer formulation with leak-proof tethered flip caps, sippy spouts, and food-grade silicone plug seals for hot & cold beverage service.',
    image: '/images/oem/DSC04472.webp',
    specs: ['Custom Pantone Colours', 'Tethered Spill-Proof Cap', 'Hot & Cold Rated', 'BPA Free Food-Grade'],
  },
  {
    id: 'iml-branding-suite',
    title: 'Full-Coverage In-Mould Labelling (IML)',
    category: 'IML Branding',
    description:
      'Photorealistic 5-sided IML fused permanently into the polymer walls during moulding — scratch-resistant, water-proof, microwave reheating and -20°C deep-freeze durable.',
    image: '/images/oem/DSC04473.webp',
    specs: ['5-Sided Photorealistic Wrap', 'Zero Peel & Scratch-Proof', 'Microwave & Freezer Safe', 'Tamper-Evident Rim'],
  },
];

export function OemProductGallery({
  badge = 'PRODUCT GALLERY',
  heading = 'Round Glass & Custom Product Showcase',
  lead = 'Photographs of custom Round Glass containers, bespoke colour closures, and precision IML mouldings engineered for leading QSR chains, beverage brands, and foodservice distributors.',
  items = DEFAULT_ITEMS,
  kind = 'oem',
}: OemProductGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const galleryItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const [activeModalIdx, setActiveModalIdx] = useState<number | null>(null);

  // Initial GSAP Smooth Staggered Entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('.oem-gallery-card');
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0.2,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // GSAP Modal entrance animation
  useEffect(() => {
    if (activeModalIdx !== null && modalRef.current && modalContentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalContentRef.current,
        { opacity: 0, scale: 0.95, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power3.out' }
      );
    }
  }, [activeModalIdx]);

  // Keyboard navigation for lightbox modal
  useEffect(() => {
    if (activeModalIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalIdx(null);
      } else if (e.key === 'ArrowRight') {
        setActiveModalIdx((prev) =>
          prev !== null ? (prev + 1) % galleryItems.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveModalIdx((prev) =>
          prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIdx, galleryItems.length]);

  const activeItem = activeModalIdx !== null ? galleryItems[activeModalIdx] : null;

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-[#FAF8F4] text-[#1A1D20]">
      <div className="container-custom">
        {/* Section Heading matching website standard typography */}
        <div className="max-w-3xl mb-10 text-left">
          <span className="text-[10px] sm:text-xs font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
            {heading}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
            {lead}
          </p>
        </div>

        {/* Gallery Cards Grid (Direct 3-column display without cluttering tabs) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {galleryItems.map((item, idx) => (
            <article
              key={item.id}
              className="oem-gallery-card group relative flex flex-col rounded-2xl bg-white border border-[#E6DBC6] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 opacity-100"
            >
              {/* Image Frame with Click to Zoom */}
              <div
                onClick={() => setActiveModalIdx(idx)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F4] cursor-pointer flex items-center justify-center p-3 group"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority={idx === 0}
                />

                {/* Ambient Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#1A1D20] text-xs font-semibold shadow-xs">
                    <Maximize2 size={13} />
                    <span>View High-Res</span>
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#1A1D20] shadow-xs">
                    <ZoomIn size={16} />
                  </span>
                </div>

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#8B6E32] uppercase tracking-wider shadow-xs border border-[#E6DBC6]">
                    {item.category}
                  </span>
                </div>

                {/* Certification pill */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-medium text-emerald-800 border border-emerald-200">
                    <CheckCircle2 size={10} /> ISO 9001
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1D20] leading-snug mb-2 group-hover:text-[#8B6E32] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Technical Spec Badges */}
                {item.specs && item.specs.length > 0 && (
                  <div className="pt-3 border-t border-[#F0EAE1]">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAF8F4] text-gray-700 border border-[#E6DBC6]/70"
                        >
                          <ShieldCheck size={11} className="text-[#a8812f]" />
                          <span>{spec}</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveModalIdx(idx)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#a8812f] hover:text-[#1A1D20] transition-colors cursor-pointer"
                      >
                        <span>Inspect Details</span>
                        <ArrowUpRight size={13} />
                      </button>

                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1D20] hover:text-[#a8812f] transition-colors"
                      >
                        <span>Request Quote</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Global CTA Band matching website standard */}
        <div className="mt-14 sm:mt-20 rounded-[32px] bg-[#111518] text-white px-8 sm:px-14 py-12 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <span className="text-xs font-extrabold text-[#cfa144] uppercase tracking-[0.16em] block mb-3">
              Bespoke Mould Tooling & Private Label
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Ready to mould your proprietary container line?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-2.5">
              Our Daman toolroom manufactures multi-cavity injection moulds, customized Pantone polymer colours, and 5-sided In-Mould Labelling with rapid 14-day sample turnarounds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-6 py-3.5 sm:px-7 sm:py-4 rounded-full uppercase tracking-wide transition-colors shadow-md"
            >
              <span>Discuss Custom Tooling</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 border border-white/25 hover:border-[#cfa144] hover:text-[#a8812f] text-white text-xs font-bold px-6 py-3.5 sm:px-7 sm:py-4 rounded-full uppercase tracking-wide transition-colors"
            >
              <span>Download OEM Specs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveModalIdx(null)}
        >
          <div
            ref={modalContentRef}
            className="relative w-full max-w-5xl rounded-3xl bg-[#1A1D20] text-white overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalIdx(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            >
              <X size={20} />
            </button>

            {/* Previous Image Navigation */}
            {galleryItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveModalIdx((prev) =>
                    prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : 0
                  )
                }
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next Image Navigation */}
            {galleryItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveModalIdx((prev) =>
                    prev !== null ? (prev + 1) % galleryItems.length : 0
                  )
                }
                aria-label="Next image"
                className="absolute right-4 md:right-[380px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Image Preview Area */}
            <div className="relative flex-1 bg-black/50 min-h-[320px] md:min-h-[560px] flex items-center justify-center p-6">
              <div className="relative w-full h-full min-h-[300px]">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Sidebar Details Area */}
            <div className="w-full md:w-[360px] p-6 sm:p-8 flex flex-col justify-between bg-[#14171A] border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#cfa144]/20 text-[#cfa144] border border-[#cfa144]/30 text-xs font-bold uppercase tracking-wider mb-3">
                  {activeItem.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
                  {activeItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  {activeItem.description}
                </p>

                {activeItem.specs && activeItem.specs.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Technical Specifications
                    </p>
                    <ul className="space-y-2">
                      {activeItem.specs.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-200">
                          <ShieldCheck size={14} className="text-[#cfa144] shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-2.5">
                <Link
                  href="/contact"
                  className="w-full text-center py-3 rounded-full bg-[#cfa144] hover:bg-[#b88c32] text-[#14171A] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Request Mould Tooling Quote
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveModalIdx(null)}
                  className="w-full text-center py-2.5 rounded-full border border-white/20 hover:border-white text-gray-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OemProductGallery;
