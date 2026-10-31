'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, CheckCircle2, PackageCheck, ChevronLeft, ChevronRight } from 'lucide-react';

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
    image: '/images/products/re-series/re-series-hero.webp',
    gallery: [
      '/images/products/re-series/re-series-hero.webp',
      '/images/products/re-series/ap-re-38.webp',
      '/images/products/re-series/ap-re-32.webp',
      '/images/products/re-series/ap-re-24.webp',
    ],
    capacities: '250ml to 1800ml (10 Models)',
    bestFor: 'Cloud Kitchens, Biryanis, Rice Combos & Bento Meals',
    tag: 'Best Seller',
    highlights: ['Zero-leak snap fit', 'Microwave safe up to 120°C', 'Interlocking stacking base'],
  },
  {
    id: 'round-containers',
    name: 'Round Food Containers (3 Color Varieties)',
    series: 'Transparent · Black · White',
    categorySlug: 'round-containers',
    image: '/images/products/round/round-containers-hero.webp',
    gallery: [
      '/images/products/round/round-containers-hero.webp',
      '/images/products/round/round-500ml-transparent.webp',
      '/images/products/round/round-500ml-black.webp',
      '/images/products/round/round-500ml-white.webp',
    ],
    capacities: '250ml · 300ml · 450ml · 500ml · 750ml · 1000ml',
    bestFor: 'Curries, Soups, Cloud Kitchens, Sweets & Dairy',
    tag: '3 Varieties',
    highlights: ['Available in Clear, Deep Black & White', '100% Virgin PP 05 food-grade', 'Microwave & freezer ready'],
  },
  {
    id: 'ro-series',
    name: 'RO Series Round Food Bowls & Containers',
    series: 'Soup & Curry Bowls',
    categorySlug: 'ro-series',
    image: '/images/products/ro-series/ro-series-hero.webp',
    gallery: [
      '/images/products/ro-series/ro-series-hero.webp',
      '/images/products/ro-series/ap-ro-48.webp',
      '/images/products/ro-series/ap-ro-32.webp',
      '/images/products/ro-series/ap-ro-24.webp',
    ],
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
    image: '/images/products/zen/zen-series-hero.webp',
    gallery: [
      '/images/products/zen/zen-series-hero.webp',
      '/images/products/zen/zen-1000ml.webp',
      '/images/products/zen/zen-black-1000ml.webp',
      '/images/products/zen/zen-750ml.webp',
    ],
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
    image: '/images/products/deli/deli-series-hero.webp',
    gallery: [
      '/images/products/deli/deli-series-hero.webp',
      '/images/products/deli/deli-32oz.webp',
      '/images/products/deli/deli-24oz.webp',
      '/images/products/deli/deli-16oz.webp',
    ],
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
    image: '/images/products/hinge/hinge-cups-hero.webp',
    gallery: [
      '/images/products/hinge/hinge-cups-hero.webp',
      '/images/products/hinge/hinge-100ml.webp',
      '/images/products/hinge/hinge-50ml.webp',
      '/images/products/hinge/hinge-25ml.webp',
    ],
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
    image: '/images/products/natraj/natraj-containers-hero.webp',
    gallery: [
      '/images/products/natraj/natraj-containers-hero.webp',
      '/images/products/natraj/natraj-750ml.webp',
      '/images/products/natraj/natraj-500ml.webp',
      '/images/products/natraj/natraj-250ml.webp',
    ],
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
    image: '/images/products/portion/portion-cups-hero.webp',
    gallery: [
      '/images/products/portion/portion-cups-hero.webp',
      '/images/products/portion/portion-250ml.webp',
      '/images/products/portion/portion-150ml.webp',
      '/images/products/portion/portion-100ml.webp',
    ],
    capacities: '50ml · 100ml · 125ml · 150ml · 250ml',
    bestFor: 'Mayonnaise, Raita, Wasabi, Dips & Side Sauces',
    tag: 'Compact Utility',
    highlights: ['Matching leak-proof lids', 'Heat-seal film compatible', '1,500 Pcs/set packaging'],
  },
  {
    id: 'flat-containers',
    name: 'Flat Food Containers (Transparent & Black)',
    series: 'Clear Transparent · Deep Black',
    categorySlug: 'flat-containers',
    image: '/images/products/flat/flat-containers-hero.webp',
    gallery: [
      '/images/products/flat/flat-containers-hero.webp',
      '/images/products/flat/flat-1000ml-transparent.webp',
      '/images/products/flat/flat-1000ml-black.webp',
      '/images/products/flat/flat-1500ml-transparent.webp',
      '/images/products/flat/flat-1500ml-black.webp',
    ],
    capacities: '600ml · 650ml · 750ml · 1000ml · 1200ml · 1500ml',
    bestFor: 'Gourmet Salads, Sandwiches, Cold Prep, Curries & Cloud Kitchens',
    tag: '2 Varieties',
    highlights: ['Available in Clear Transparent and Deep Black', 'Wide horizontal display surface', 'Anti-fog optical lid & microwave ready'],
  },
  {
    id: 'glass-series-90-dia',
    name: 'Glass Series 90 Dia (Plain & Frost)',
    series: 'Clear Gloss · Frosted Matte',
    categorySlug: 'glass-series-90-dia',
    image: '/images/products/glass-90/glass-90-hero.webp',
    gallery: [
      '/images/products/glass-90/glass-90-hero.webp',
      '/images/products/glass-90/glass-90-500ml-plain.webp',
      '/images/products/glass-90/glass-90-500ml-frost.webp',
      '/images/products/glass-90/glass-90-700ml-plain.webp',
      '/images/products/glass-90/glass-90-700ml-frost.webp',
    ],
    capacities: '350ml · 500ml · 600ml · 700ml',
    bestFor: 'Iced Coffees, Boba Teas, Mocktails, Smoothies & Frappes',
    tag: '2 Finishes',
    highlights: ['Dual finishes: Ultra-clear gloss and frosted matte', '90mm universal cup rim', 'Crack-resistant virgin PP'],
  },
  {
    id: 'glass-series-80-dia',
    name: 'Glass Series 80 Dia Cold Beverage Cups',
    series: '80mm Sleek Beverage',
    categorySlug: 'glass-series-80-dia',
    image: '/images/products/glass-80/glass-80-hero.webp',
    gallery: [
      '/images/products/glass-80/glass-80-hero.webp',
      '/images/products/glass-80/glass-80-500ml.webp',
      '/images/products/glass-80/glass-80-350ml.webp',
      '/images/products/glass-80/glass-80-250ml.webp',
    ],
    capacities: '200ml · 250ml · 300ml · 350ml · 500ml',
    bestFor: 'Espresso Tonic, Cold Brews, Juices, Slushies & Shakes',
    tag: '80mm Rim',
    highlights: ['Slim ergonomic handheld grip', 'Flawless clarity & rigidity', 'Spill-resistant sipper & dome lids'],
  },
  {
    id: 'elite-containers',
    name: 'Elite Series Premium Food Containers',
    series: 'Heavy-Duty Meal Service',
    categorySlug: 'elite-containers',
    image: '/images/products/re-series/ap-re-32.webp',
    gallery: [
      '/images/products/re-series/ap-re-32.webp',
      '/images/products/re-series/ap-re-28.webp',
      '/images/products/re-series/ap-re-24.webp',
    ],
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
    image: '/images/products/sweet-box/sweet-box-hero.webp',
    gallery: [
      '/images/products/sweet-box/sweet-box-hero.webp',
      '/images/products/sweet-box/sweetbox-1000g.webp',
      '/images/products/sweet-box/sweetbox-500g.webp',
      '/images/products/sweet-box/sweetbox-250g.webp',
    ],
    capacities: '250gm · 500gms · 1000gms',
    bestFor: 'Artisan Sweets, Dry Fruits, Chocolates & Bakery Gifts',
    tag: 'Crystal Clear',
    highlights: ['High optical clarity', 'Odor-free 100% virgin PP 05', 'Snap-tight confectionery lid'],
  },
];

export const ProductShowcaseCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const thumbScrollRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = CAROUSEL_PRODUCTS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const scrollThumbnails = useCallback((direction: 'left' | 'right') => {
    if (thumbScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      thumbScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Center the active thumbnail item in the carousel rail
  useEffect(() => {
    const activeEl = thumbRefs.current[currentIndex];
    if (activeEl && thumbScrollRef.current) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

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
  const isPhoto = displayImage.startsWith('/DSC') || displayImage.endsWith('.JPG') || displayImage.startsWith('/images/products/');

  return (
    <section className="relative py-12 sm:py-20 bg-[#FAF8F4] text-[var(--ace-ink)] border-t border-b border-[#E6DBC6] overflow-hidden w-full max-w-full">
      {/* Background radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[650px] h-[450px] rounded-full [background:radial-gradient(ellipse,rgba(185,151,80,0.12)_0%,transparent_70%)]"
      />

      <div className="container-custom relative z-10 max-w-[1400px] w-full">
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
                    <span className="font-semibold text-[var(--ace-ink)]">100% Prime Virgin PP 05 (ISO 9001:2015 Certified)</span>
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
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#b99750] text-white hover:bg-[#a6843e] text-xs font-bold uppercase tracking-wide sm:tracking-wider shadow-md shadow-[#b99750]/20 transition-all duration-300 text-center"
                >
                  <span>Explore catalogue</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border-2 border-[var(--ace-ink)] hover:bg-[var(--ace-ink)] hover:text-white text-[var(--ace-ink)] text-xs font-bold uppercase tracking-wide sm:tracking-wider transition-colors duration-300 text-center"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Request Sample </span>
                </Link>
              </div>
            </div>

            {/* Right: High-Res Product Image Frame (Shows prominently on desktop and mobile) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 w-full max-w-full">
              <div className="relative w-full max-w-[380px] sm:max-w-[480px] aspect-[16/11] sm:aspect-4/3 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#F7F4EC] border border-[#E6DBC6] flex items-center justify-center shadow-sm group">
                <img
                  src={displayImage}
                  alt={activeProduct.name}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full ${isPhoto ? 'object-cover' : 'object-contain'} group-hover:scale-105 transition-transform duration-700 ease-out`}
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
              {/* {activeProduct.gallery && activeProduct.gallery.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 p-1 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6]">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider px-1.5">
                    Angles:
                  </span>
                  {activeProduct.gallery.map((imgSrc, gIdx) => {
                    const isSelected = displayImage === imgSrc;
                    const isGalPhoto = imgSrc.startsWith('/DSC') || imgSrc.endsWith('.JPG') || imgSrc.startsWith('/images/products/');
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
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full ${isGalPhoto ? 'object-cover' : 'object-contain'}`}
                          />
                        </div>
                        <span className="text-[9px] font-semibold">
                          {imgSrc.includes('black') ? 'Black' : imgSrc.includes('hero') ? 'Hero' : imgSrc.includes('48') || imgSrc.includes('1000') || imgSrc.includes('32') ? 'Deep' : `Angle ${gIdx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Product Selection Carousel Strip (Full Horizontal Carousel on Desktop & Mobile) */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E6DBC6]">
          {/* Carousel Header with Navigation Arrows */}
          <div className="flex items-center justify-between mb-3.5 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b99750] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--ace-ink)]">
                Browse All 13 Product Formats
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs text-gray-500 font-medium mr-1">
                Format <span className="text-[#b99750] font-bold">{String(currentIndex + 1).padStart(2, '0')}</span> of {String(total).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => scrollThumbnails('left')}
                aria-label="Scroll formats left"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E6DBC6] bg-white hover:border-[#b99750] hover:bg-[#b99750] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollThumbnails('right')}
                aria-label="Scroll formats right"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E6DBC6] bg-white hover:border-[#b99750] hover:bg-[#b99750] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Full Width Horizontal Scrolling Carousel Track (Never wraps to multi-row on desktop) */}
          <div className="relative group/rail w-full max-w-full overflow-hidden">
            <div
              ref={thumbScrollRef}
              className="flex flex-nowrap overflow-x-auto pb-4 pt-1 px-1 gap-2.5 sm:gap-3.5 snap-x snap-mandatory scroll-smooth w-full max-w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CAROUSEL_PRODUCTS.map((item, idx) => {
                const isActive = idx === currentIndex;
                const itemIsPhoto = item.image.startsWith('/DSC') || item.image.endsWith('.JPG') || item.image.startsWith('/images/products/');
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      thumbRefs.current[idx] = el;
                    }}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Select ${item.name}`}
                    className={`shrink-0 w-[155px] sm:w-[190px] lg:w-[210px] snap-start relative rounded-2xl p-2.5 sm:p-3 text-left transition-all duration-300 flex flex-col justify-between border cursor-pointer ${isActive
                      ? 'border-[#b99750] bg-white shadow-xl shadow-[#b99750]/20 scale-[1.02] ring-2 ring-[#b99750]'
                      : 'border-[#E6DBC6] bg-white/90 hover:bg-white hover:border-[#b99750]/60 opacity-90 hover:opacity-100 hover:shadow-md'
                      }`}
                  >
                    <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden mb-2 bg-gradient-to-b from-white to-[#F7F4EC] rounded-xl border border-[#E6DBC6]/60 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b99750] ring-3 ring-white" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block truncate ${isActive ? 'text-[#b99750]' : 'text-gray-500'}`}>
                          {item.series}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h4 className="text-[11px] sm:text-xs font-bold text-[var(--ace-ink)] line-clamp-1">
                        {item.name.replace(' Series Rectangular Meal Containers', '').replace(' Series Containers', '').replace(' Series Round Bowls & Tubs', ' Round Bowls')}
                      </h4>
                      <span className="text-[10px] text-gray-500 line-clamp-1 block">
                        {item.capacities.split('(')[0].trim()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Carousel Position Progress Bar */}
            <div className="w-full h-1 bg-[#E6DBC6]/50 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#b99750] rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
