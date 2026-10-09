'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, CheckCircle2, PackageCheck } from 'lucide-react';
import { Container } from '../ui/Container';

export interface ProductCarouselItem {
  id: string;
  name: string;
  series: string;
  categorySlug: string;
  image: string;
  capacities: string;
  bestFor: string;
  tag: string;
  highlights: string[];
}

export const CAROUSEL_PRODUCTS: ProductCarouselItem[] = [
  {
    id: 're-series',
    name: 'RE Series Rectangular Meal Containers',
    series: 'Bento & Meal Prep',
    categorySlug: 're-series',
    image: '/AcePackaging/RE Series Containers.png',
    capacities: '500ml · 650ml · 750ml · 1000ml · 1200ml',
    bestFor: 'Cloud Kitchens, Biryanis, Rice Combos & Curries',
    tag: 'Best Seller',
    highlights: ['Zero-leak snap fit', 'Microwave safe up to 120°C', 'Interlocking stacking base'],
  },
  {
    id: 'ro-series',
    name: 'RO Series Round Bowls & Tubs',
    series: 'Salad & Gravy Series',
    categorySlug: 'ro-series',
    image: '/AcePackaging/RO-Series Containers.png',
    capacities: '250ml · 500ml · 750ml · 1000ml',
    bestFor: 'Soups, Noodle Bowls, Gravies & Salads',
    tag: 'High Clarity',
    highlights: ['Reinforced sealing rim', 'Crystal-clear dome lids', 'Thermal freeze resistant'],
  },
  {
    id: 'zen-series',
    name: 'ZEN Series Multi-Compartment Bento Boxes',
    series: 'Executive Catering',
    categorySlug: 'zen-series',
    image: '/AcePackaging/ZEN Series Containers.png',
    capacities: '2, 3, 4 & 5 Compartment Trays',
    bestFor: 'Executive Lunch Combos, Thalis & Airlines',
    tag: 'Compartment Isolation',
    highlights: ['Zero gravy cross-mixing', 'Snap-tight single lid', 'Premium black satin finish'],
  },
  {
    id: 'deli-series',
    name: 'Deli Series Airtight Containers',
    series: 'Heavy Duty Storage',
    categorySlug: 'deli-series',
    image: '/AcePackaging/Deli Series Container.png',
    capacities: '350ml · 500ml · 750ml · 1500ml',
    bestFor: 'Dairy, Yogurts, Ice Creams & Wet Curries',
    tag: 'Airtight Lock',
    highlights: ['High-impact wall strength', 'Tamper-resistant seal', '100% Prime virgin PP 05'],
  },
  {
    id: 'hinge-cups',
    name: 'One-Piece Attached Hinge Cups',
    series: 'Condiment & Sauce',
    categorySlug: 'hinge-cups',
    image: '/AcePackaging/Hinge Cups.png',
    capacities: '15ml · 25ml · 50ml · 80ml · 100ml',
    bestFor: 'Chutneys, Salsas, Dips, Dressings & Sauces',
    tag: 'Never-Lost Lid',
    highlights: ['Integral living hinge', 'Tested for 50+ flex cycles', 'Motorcycle delivery tested'],
  },
  {
    id: 'sweet-box',
    name: 'Confectionery & Sweet Box Trays',
    series: 'Mithai & Bakery',
    categorySlug: 'sweet-box',
    image: '/AcePackaging/Sweet Box Containers.png',
    capacities: '250g · 500g · 1000g Boxes',
    bestFor: 'Traditional Mithai, Baklava, Chocolates & Dry Fruits',
    tag: 'Export Grade',
    highlights: ['High transparency display', 'Odor-free food contact', 'Aesthetic embossed trim'],
  },
  {
    id: 'portion-cups',
    name: 'Portion Cups with Separate Lids',
    series: 'Dipping Solutions',
    categorySlug: 'portion-cups',
    image: '/AcePackaging/Portion Cups.png',
    capacities: '1oz · 2oz · 3.25oz · 4oz',
    bestFor: 'Mayonnaise, Raita, Wasabi & Syrups',
    tag: 'Compact Utility',
    highlights: ['Stackable in delivery bags', 'Tight snap fit', 'Export master cartoning'],
  },
  {
    id: 'flat-containers',
    name: 'Flat Cold Prep & Salad Containers',
    series: 'Gourmet Showcase',
    categorySlug: 'flat-containers',
    image: '/AcePackaging/Flat Containers.png',
    capacities: '450ml · 650ml · 900ml',
    bestFor: 'Gourmet Salads, Sandwiches & Sliced Fruits',
    tag: 'Fresh Display',
    highlights: ['Wide presentation surface', 'Anti-fog optical lid', 'Rigid corner architecture'],
  },
];

export const ProductShowcaseCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const total = CAROUSEL_PRODUCTS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(nextSlide, 4200);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const activeProduct = CAROUSEL_PRODUCTS[currentIndex];

  return (
    <section className="relative py-20 bg-[#FAF8F4] text-[var(--ace-ink)] border-t border-b border-[#E6DBC6] overflow-hidden">
      {/* Background radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full [background:radial-gradient(ellipse,rgba(185,151,80,0.12)_0%,transparent_70%)]"
      />

      <div className="container-custom relative z-10 max-w-[1400px]">
        {/* Header Title with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-[#b99750]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#b99750]">
                Signature Product Showcase
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ace-ink)] tracking-tight leading-tight">
              Containers Engineered for <span className="text-[#b99750] italic font-serif font-normal">Every Format</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              Explore our precision injection-moulded packaging portfolio. Available in standard black, crisp white, and clear translucent finishes with custom IML brand labelling.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <span className="text-xs font-bold text-gray-500 mr-2 tracking-widest">
              <span className="text-[#b99750] text-base">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
            </span>
            <button
              onClick={prevSlide}
              aria-label="Previous product"
              className="w-11 h-11 rounded-full border border-[#E6DBC6] bg-white hover:border-[#b99750] hover:bg-[#b99750] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next product"
              className="w-11 h-11 rounded-full border border-[#E6DBC6] bg-white hover:border-[#b99750] hover:bg-[#b99750] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-xs"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Showcase Slide Grid */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-3xl border-2 border-[#E6DBC6] bg-white p-6 sm:p-10 lg:p-12 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Product Information & Specifications */}
            <div className="lg:col-span-6 flex flex-col justify-between order-2 lg:order-1 text-left">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#b99750] text-white">
                    {activeProduct.tag}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F4] border border-[#E6DBC6] text-gray-700">
                    {activeProduct.series}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--ace-ink)] mb-4 leading-snug">
                  {activeProduct.name}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                  <strong className="text-[var(--ace-ink)]">Ideal Applications:</strong> {activeProduct.bestFor}
                </p>

                {/* Key specs badge box */}
                <div className="bg-[#FAF8F4] border border-[#E6DBC6] rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm border-b border-[#E6DBC6]/80 pb-2.5">
                    <span className="text-gray-500">Available Capacities:</span>
                    <span className="font-bold text-[#b99750] text-right">{activeProduct.capacities}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm border-b border-[#E6DBC6]/80 pb-2.5">
                    <span className="text-gray-500">Polymer Grade:</span>
                    <span className="font-semibold text-[var(--ace-ink)]">100% Prime Virgin PP 05 (US FDA Compliant)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Thermal Resistance:</span>
                    <span className="font-semibold text-[var(--ace-ink)]">-20°C (Deep Freeze) to +120°C (Microwave)</span>
                  </div>
                </div>

                {/* Bullet Highlights */}
                <ul className="space-y-2 mb-8">
                  {activeProduct.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#b99750] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/categories/${activeProduct.categorySlug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b99750] text-white hover:bg-[#a6843e] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#b99750]/20 transition-all duration-300"
                >
                  <span>Explore Series Catalog</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--ace-ink)] hover:bg-[var(--ace-ink)] hover:text-white text-[var(--ace-ink)] text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Request Free Sample Box</span>
                </Link>
              </div>
            </div>

            {/* Right: High-Res Product Image Frame */}
            <div className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-[500px] aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF8F4] border border-[#E6DBC6] p-6 sm:p-8 flex items-center justify-center shadow-xs group">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-gray-700 px-3 py-1 rounded-full border border-[#E6DBC6]">
                  Moulded in Daman, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Preview Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CAROUSEL_PRODUCTS.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View ${item.name}`}
                className={`relative rounded-xl p-2.5 text-left transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                  isActive
                    ? 'border-[#b99750] bg-white shadow-md shadow-[#b99750]/15 scale-102 ring-2 ring-[#b99750]'
                    : 'border-[#E6DBC6] bg-white/80 hover:border-gray-400 hover:bg-white opacity-85 hover:opacity-100'
                }`}
              >
                <div className="h-16 w-full flex items-center justify-center overflow-hidden mb-1.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                  />
                </div>
                <div>
                  <span className={`text-[10px] font-bold block truncate ${isActive ? 'text-[#b99750]' : 'text-gray-500'}`}>
                    {item.series}
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--ace-ink)] block truncate">
                    {item.name.replace(' Series Rectangular Meal Containers', '').replace(' Series Containers', '')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
