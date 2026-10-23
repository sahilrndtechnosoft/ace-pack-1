'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, CheckCircle2, PackageCheck } from 'lucide-react';

export interface ProductCarouselItem {
  id: string;
  name: string;
  series: string;
  categorySlug: string;
  image: string;
  gallery?: string[];
  capacities: string;
  bestFor: string;
  tag: string;
  highlights: string[];
}

export const CAROUSEL_PRODUCTS: ProductCarouselItem[] = [
  {
    id: 're-series',
    name: 'RE Series Rectangular Meal Containers',
    series: 'Bento & Meal Delivery',
    categorySlug: 're-series',
    image: '/AcePackaging/RE Series Containers.png',
    capacities: '250ml to 1800ml (10 Models)',
    bestFor: 'Cloud Kitchens, Biryanis, Rice Combos & Bento Meals',
    tag: 'Best Seller',
    highlights: ['Zero-leak snap fit', 'Microwave safe up to 120°C', 'Interlocking stacking base'],
  },
  {
    id: 'ro-series',
    name: 'RO Series Round Food Bowls & Containers',
    series: 'Soup & Curry Bowls',
    categorySlug: 'ro-series',
    image: '/AcePackaging/RO-Series Containers.png',
    gallery: ['/AcePackaging/RO-Series Containers.png', '/AcePackaging/AP-RO-48.png', '/AcePackaging/RO-Series-Lifestyle.png'],
    capacities: 'AP-RO-10 to AP-RO-48 (250ml - 1500ml)',
    bestFor: 'Hot Soups, Biryanis, Dal Makhani & Noodle Bowls',
    tag: 'Heavy Duty',
    highlights: ['Reinforced sealing rim', 'Boiling hot soup safe', 'Freezer resistant to -20°C'],
  },
  {
    id: 'zen-series',
    name: 'ZEN Series Deep Rectangular Containers',
    series: 'Universal Lid Efficiency',
    categorySlug: 'zen-series',
    image: '/AcePackaging/ZEN Series Containers.png',
    capacities: '500ml · 650ml · 750ml · 1000ml',
    bestFor: 'Noodles, Fried Rice, Curries & Executive Combos',
    tag: 'Universal Lid',
    highlights: ['Single 117×170mm lid fits all 4 sizes', 'Anti-fog optical clarity', 'Spill-proof locking bead'],
  },
  {
    id: 'deli-series',
    name: 'Deli Series Heavy-Duty Round Containers',
    series: '120mm Universal Rim',
    categorySlug: 'deli-series',
    image: '/AcePackaging/Deli Series Container.png',
    gallery: ['/AcePackaging/Deli Series Container.png', '/AcePackaging/Deli-Series-Lifestyle.png'],
    capacities: '8oz · 12oz · 16oz · 24oz · 32oz',
    bestFor: 'Dairy, Yogurts, Wet Curries, Salads & Food Storage',
    tag: 'Airtight Lock',
    highlights: ['Universal 120mm lid fits all 5 sizes', 'High-impact thick wall', '100% Prime virgin PP 05'],
  },
  {
    id: 'hinge-cups',
    name: 'One-Piece Attached Hinge Cups',
    series: 'Condiment & Sauce',
    categorySlug: 'hinge-cups',
    image: '/AcePackaging/Hinge Cups.png',
    capacities: '25ml · 50ml · 100ml',
    bestFor: 'Chutneys, Salsas, Dips, Dressings & Sauces',
    tag: 'Never-Lost Lid',
    highlights: ['Integral living hinge', 'Tested for 50+ flex cycles', '2,000 PCS master export pack'],
  },
  {
    id: 'natraj-containers',
    name: 'Natraj Confectionery & Sweet Containers',
    series: 'Mithai & Bakery',
    categorySlug: 'natraj-containers',
    image: '/AcePackaging/Natraj Containers.png',
    capacities: '250ml · 450ml · 500ml · 750ml',
    bestFor: 'Traditional Mithai, Kaju Katli, Gulab Jamun & Dry Fruits',
    tag: 'Export Grade',
    highlights: ['100% Odor-free virgin polymer', 'Airtight freshness seal', 'Rigid confectionery design'],
  },
  {
    id: 'portion-cups',
    name: 'Portion Cups with Separate Snap Lids',
    series: 'Precision Dips & Sides',
    categorySlug: 'portion-cups',
    image: '/AcePackaging/Portion Cups.png',
    capacities: '50ml · 100ml · 125ml · 150ml · 250ml',
    bestFor: 'Mayonnaise, Raita, Wasabi, Dips & Side Sauces',
    tag: 'Compact Utility',
    highlights: ['Matching leak-proof lids', 'Heat-seal film compatible', '1,500 Pcs/set packaging'],
  },
  {
    id: 'flat-containers',
    name: 'Flat Cold Prep & Salad Containers',
    series: 'Gourmet Wide Showcase',
    categorySlug: 'flat-containers',
    image: '/AcePackaging/Flat Containers.png',
    capacities: '600ml to 2500ml (8 Models)',
    bestFor: 'Gourmet Salads, Sandwiches, Cold Prep & Batch Storage',
    tag: 'Fresh Display',
    highlights: ['Wide horizontal display surface', 'Anti-fog optical lid', '148mm and 169mm profiles'],
  },
  {
    id: 'elite-containers',
    name: 'Elite Series Premium Food Containers',
    series: 'Heavy-Duty Meal Service',
    categorySlug: 'elite-containers',
    image: '/AcePackaging/Elite Containers.png',
    gallery: ['/AcePackaging/Elite Containers.png', '/AcePackaging/Elite-500ml.png', '/AcePackaging/Elite-750ml.png'],
    capacities: '500ml · 650ml · 750ml · 1000ml',
    bestFor: 'Hot Curries, Rice Bowls, Takeout Meals & Freezer Prep',
    tag: 'Heavy Duty',
    highlights: ['Reinforced base and rim', 'Microwave & freezer resistant (-20°C to +120°C)', 'Airtight snap lid'],
  },
  {
    id: 'sweet-box-containers',
    name: 'Sweet Box Confectionery Containers',
    series: 'Mithai & Bakery Display',
    categorySlug: 'sweet-box-containers',
    image: '/AcePackaging/Sweet Box Containers.png',
    gallery: ['/AcePackaging/Sweet Box Containers.png', '/AcePackaging/SweetBox-500g.png', '/AcePackaging/SweetBox-1000g.png'],
    capacities: '250gm · 500gms · 1000gms',
    bestFor: 'Artisan Sweets, Dry Fruits, Chocolates & Bakery Gifts',
    tag: 'Crystal Clear',
    highlights: ['High optical clarity', 'Odor-free 100% virgin PP 05', 'Snap-tight confectionery lid'],
  },
];

export const ProductShowcaseCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
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
    autoPlayRef.current = setInterval(nextSlide, 4500);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.1) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // Reset selected gallery photo when switching slide
  useEffect(() => {
    setSelectedGalleryImg(null);
  }, [currentIndex]);

  const activeProduct = CAROUSEL_PRODUCTS[currentIndex];
  const displayImage = selectedGalleryImg || activeProduct.image;
  const isPhoto = displayImage.startsWith('/DSC') || displayImage.endsWith('.JPG');

  return (
    <section className="relative py-12 sm:py-20 bg-[#FAF8F4] text-[var(--ace-ink)] border-t border-b border-[#E6DBC6] overflow-hidden">
      {/* Background radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full [background:radial-gradient(ellipse,rgba(185,151,80,0.12)_0%,transparent_70%)]"
      />

      <div className="container-custom relative z-10 max-w-[1400px]">
        {/* Header Title with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#b99750]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#b99750]">
                Signature Product Showcase
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--ace-ink)] tracking-tight leading-snug">
              Containers Engineered for <span className="text-[#b99750] italic font-serif font-normal">Every Format</span>
            </h2>
            <p className="mt-2 text-xs sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              Explore our precision injection-moulded packaging portfolio. Available in standard black, crisp white, and clear translucent finishes with custom IML brand labelling.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <span className="text-xs font-bold text-gray-500 tracking-widest">
              <span className="text-[#b99750] text-sm sm:text-base">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous product"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#E6DBC6] bg-white hover:border-[#b99750] hover:bg-[#b99750] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next product"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#E6DBC6] bg-white hover:border-[#b99750] hover:bg-[#b99750] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Showcase Slide Grid */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl border border-[#E6DBC6] sm:border-2 bg-white p-4 sm:p-8 lg:p-12 shadow-lg sm:shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left: Product Information & Specifications */}
            <div className="lg:col-span-6 flex flex-col justify-between order-2 lg:order-1 text-left">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-[#b99750] text-white">
                    {activeProduct.tag}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#FAF8F4] border border-[#E6DBC6] text-gray-700">
                    {activeProduct.series}
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--ace-ink)] mb-3 leading-snug">
                  {activeProduct.name}
                </h3>

                <p className="text-xs sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  <strong className="text-[var(--ace-ink)]">Ideal Applications:</strong> {activeProduct.bestFor}
                </p>

                {/* Key specs badge box */}
                <div className="bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-4 sm:mb-6 space-y-2.5 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm border-b border-[#E6DBC6]/80 pb-2">
                    <span className="text-gray-500">Available Capacities:</span>
                    <span className="font-bold text-[#b99750] sm:text-right">{activeProduct.capacities}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm border-b border-[#E6DBC6]/80 pb-2">
                    <span className="text-gray-500">Polymer Grade:</span>
                    <span className="font-semibold text-[var(--ace-ink)]">100% Prime Virgin PP 05 (US FDA Compliant)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm">
                    <span className="text-gray-500">Thermal Resistance:</span>
                    <span className="font-semibold text-[var(--ace-ink)]">-20°C (Deep Freeze) to +120°C (Microwave)</span>
                  </div>
                </div>

                {/* Bullet Highlights */}
                <ul className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
                  {activeProduct.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#b99750] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/categories/${activeProduct.categorySlug}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#b99750] text-white hover:bg-[#a6843e] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#b99750]/20 transition-all duration-300 text-center"
                >
                  <span>Explore Series Catalog</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border-2 border-[var(--ace-ink)] hover:bg-[var(--ace-ink)] hover:text-white text-[var(--ace-ink)] text-xs font-bold uppercase tracking-wider transition-colors duration-300 text-center"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Request Free Sample Box</span>
                </Link>
              </div>
            </div>

            {/* Right: High-Res Product Image Frame */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 w-full">
              <div className={`relative w-full max-w-[480px] aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#F7F4EC] border border-[#E6DBC6] ${isPhoto ? 'p-0' : 'p-4 sm:p-8'} flex items-center justify-center shadow-xs group`}>
                <img
                  src={displayImage}
                  alt={activeProduct.name}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full ${isPhoto ? 'object-cover' : 'object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]'} group-hover:scale-105 transition-transform duration-700 ease-out`}
                />
                {isPhoto && (
                  <span className="absolute top-2.5 left-2.5 bg-[#b99750]/90 backdrop-blur-xs text-[9px] font-extrabold uppercase tracking-wider text-white px-2 py-0.5 rounded-full shadow-xs">
                    Studio Photo
                  </span>
                )}
                <span className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[10px] font-semibold text-gray-700 px-2.5 py-0.5 rounded-full border border-[#E6DBC6] shadow-xs">
                  Moulded in Daman, India
                </span>
              </div>

              {/* Multi-angle / Finish Photo Switcher if available */}
              {activeProduct.gallery && activeProduct.gallery.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 p-1 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6]">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider px-1.5">
                    Angles:
                  </span>
                  {activeProduct.gallery.map((imgSrc, gIdx) => {
                    const isSelected = displayImage === imgSrc;
                    const isGalPhoto = imgSrc.startsWith('/DSC') || imgSrc.endsWith('.JPG');
                    return (
                      <button
                        key={imgSrc}
                        onClick={() => setSelectedGalleryImg(imgSrc)}
                        className={`h-8 sm:h-9 px-2 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#b99750] bg-white text-[#b99750] shadow-xs font-bold ring-1 ring-[#b99750]'
                            : 'border-[#E6DBC6] bg-white/70 text-gray-600 hover:bg-white hover:border-gray-400'
                        }`}
                        aria-label={`View photo angle ${gIdx + 1}`}
                      >
                        <div className="w-5 h-5 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={imgSrc}
                            alt=""
                            className={`w-full h-full ${isGalPhoto ? 'object-cover' : 'object-contain'}`}
                          />
                        </div>
                        <span className="text-[9px] font-semibold">
                          {imgSrc.includes('04062') ? 'Black' : imgSrc.includes('03993') ? 'White' : imgSrc.includes('04053') ? 'Tub' : 'Standard'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Preview Strip: Smooth horizontal scrollable rail on mobile, responsive grid on desktop */}
        <div className="mt-6 sm:mt-8 flex sm:grid overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 gap-2 sm:gap-2.5 snap-x scrollbar-thin sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10">
          {CAROUSEL_PRODUCTS.map((item, idx) => {
            const isActive = idx === currentIndex;
            const itemIsPhoto = item.image.startsWith('/DSC') || item.image.endsWith('.JPG');
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View ${item.name}`}
                className={`shrink-0 w-[125px] sm:w-auto snap-start relative rounded-xl p-2 sm:p-2.5 text-left transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                  isActive
                    ? 'border-[#b99750] bg-white shadow-md shadow-[#b99750]/15 scale-102 ring-2 ring-[#b99750]'
                    : 'border-[#E6DBC6] bg-white/90 hover:border-gray-400 opacity-90 hover:opacity-100'
                }`}
              >
                <div className="h-14 sm:h-16 w-full flex items-center justify-center overflow-hidden mb-1.5 p-1 bg-[#FAF8F4]/60 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`max-h-full max-w-full ${itemIsPhoto ? 'object-cover rounded-md w-full h-full' : 'object-contain filter drop-shadow-xs'}`}
                  />
                </div>
                <div>
                  <span className={`text-[9px] sm:text-[10px] font-bold block truncate ${isActive ? 'text-[#b99750]' : 'text-gray-500'}`}>
                    {item.series}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--ace-ink)] block truncate">
                    {item.name.replace(' Series Rectangular Meal Containers', '').replace(' Series Containers', '').replace(' Series Round Bowls & Tubs', ' Round Bowls')}
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
