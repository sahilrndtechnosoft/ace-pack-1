'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Box,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import { products } from './config';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer, SplitText, ScrollTrigger);
}

const productVariants: Record<string, { label: string; src: string }[]> = {
  're-series': [
    { label: 'Hero View', src: '/images/products/re-series/re-series-hero.webp' },
    { label: '2-Comp Bento', src: '/images/products/re-series/ap-re-232.webp' },
    { label: 'AP-RE-48', src: '/images/products/re-series/ap-re-48.webp' },
    { label: 'AP-RE-32', src: '/images/products/re-series/ap-re-32.webp' },
    { label: 'AP-RE-24', src: '/images/products/re-series/ap-re-24.webp' },
  ],
  'ro-series': [
    { label: 'Hero View', src: '/images/products/ro-series/ro-series-hero.webp' },
    { label: 'AP-RO-48', src: '/images/products/ro-series/ap-ro-48.webp' },
    { label: 'AP-RO-32', src: '/images/products/ro-series/ap-ro-32.webp' },
    { label: 'AP-RO-24', src: '/images/products/ro-series/ap-ro-24.webp' },
  ],
  'hinge-cups': [
    { label: 'Hero View', src: '/images/products/hinge/hinge-cups-hero.webp' },
    { label: '100ml', src: '/images/products/hinge/hinge-100ml.webp' },
    { label: '50ml', src: '/images/products/hinge/hinge-50ml.webp' },
    { label: '25ml', src: '/images/products/hinge/hinge-25ml.webp' },
  ],
  'deli-series': [
    { label: 'Hero View', src: '/images/products/deli/deli-series-hero.webp' },
    { label: '32oz', src: '/images/products/deli/deli-32oz.webp' },
    { label: '16oz', src: '/images/products/deli/deli-16oz.webp' },
  ],
  'sweet-box': [
    { label: 'Hero View', src: '/images/products/sweet-box/sweet-box-hero.webp' },
    { label: '500g', src: '/images/products/sweet-box/sweetbox-500g.webp' },
    { label: '250g', src: '/images/products/sweet-box/sweetbox-250g.webp' },
  ],
  'flat-containers': [
    { label: 'Hero View', src: '/images/products/flat/flat-containers-hero.webp' },
    { label: '1000ml', src: '/images/products/flat/flat-1000ml.webp' },
    { label: '650ml', src: '/images/products/flat/flat-650ml.webp' },
  ],
};

export function ObserverCollectionShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTriggerRef = useRef<ScrollTrigger | null>(null);
  const gotoSectionRef = useRef<((index: number, direction: number) => void) | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [variantImages, setVariantImages] = useState<Record<string, string>>({});

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    const st = pinTriggerRef.current;
    if (st) {
      const pinDistance = st.end - st.start;
      const targetScroll = st.start + (index / (products.length - 1)) * pinDistance;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else if (gotoSectionRef.current) {
      const dir = index >= activeIdx ? 1 : -1;
      gotoSectionRef.current(index, dir);
    }
  }, [activeIdx]);

  const handleNext = useCallback(() => {
    const next = (activeIdx + 1) % products.length;
    goToSlide(next);
  }, [activeIdx, goToSlide]);

  const handlePrev = useCallback(() => {
    const prev = (activeIdx - 1 + products.length) % products.length;
    goToSlide(prev);
  }, [activeIdx, goToSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;

    // Detect horizontal swipe if deltaX is clear and dominant over vertical scroll
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let splits: SplitText[] = [];
    let mainTl: gsap.core.Timeline | null = null;
    let pinTrigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      const sections = root.querySelectorAll<HTMLElement>('.obs-section');
      const images = root.querySelectorAll<HTMLElement>('.obs-bg');
      const headings = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.obs-section-heading'));
      const outerWrappers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.obs-outer'));
      const innerWrappers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.obs-inner'));

      if (!sections.length || !images.length || !headings.length) return;

      splits = headings.map(
        (heading) => new SplitText(heading, { type: 'lines,words', linesClass: 'clip-text' })
      );

      let currentIndex = -1;
      let targetIndex = 0;
      const wrap = gsap.utils.wrap(0, sections.length);
      let animating = false;

      gsap.set(outerWrappers, { yPercent: 100 });
      gsap.set(innerWrappers, { yPercent: -100 });
      gsap.set(sections, { autoAlpha: 0, zIndex: 0 });

      function gotoSection(index: number, direction: number) {
        index = wrap(index);
        if (index === currentIndex && currentIndex >= 0) return;

        animating = true;
        const fromTop = direction === -1;
        const dFactor = fromTop ? -1 : 1;

        if (mainTl) mainTl.kill();

        const tl = gsap.timeline({
          defaults: { duration: 0.65, ease: 'power2.out' },
          onComplete: () => {
            animating = false;
            if (targetIndex !== currentIndex) {
              const nextDir = targetIndex > currentIndex ? 1 : -1;
              gotoSection(targetIndex, nextDir);
            }
          },
        });
        mainTl = tl;

        if (currentIndex >= 0 && sections[currentIndex]) {
          gsap.set(sections[currentIndex], { zIndex: 0 });
          tl.to(images[currentIndex], { yPercent: -15 * dFactor, duration: 0.65 }, 0)
            .set(sections[currentIndex], { autoAlpha: 0 });
        }

        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
        tl.fromTo(
          [outerWrappers[index], innerWrappers[index]],
          {
            yPercent: (i: number) => (i ? -100 * dFactor : 100 * dFactor),
          },
          {
            yPercent: 0,
            duration: 0.65,
            ease: 'power2.out',
          },
          0
        )
          .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0, duration: 0.65, ease: 'power2.out' }, 0);

        if (splits[index]?.words?.length) {
          tl.fromTo(
            splits[index].words,
            {
              autoAlpha: 0,
              yPercent: 110 * dFactor,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.55,
              ease: 'power3.out',
              stagger: 0.03,
            },
            0.08
          );
        }

        currentIndex = index;
        targetIndex = index;
        setActiveIdx(index);
      }

      gotoSectionRef.current = gotoSection;

      // Pinning with ScrollTrigger: Active on ALL screens (mobile, tablet, desktop)
      // Multiplier ensures responsive touch sensitivity on mobile and smooth wheel scrubbing on desktop.
      const isMobile = window.innerWidth < 768;
      const multiplier = isMobile ? 0.7 : 0.85;
      const pinDistance = window.innerHeight * (products.length - 1) * multiplier;

      const getHeaderOffset = () => {
        const header = document.querySelector('header');
        return header ? Math.round(header.getBoundingClientRect().height) : (isMobile ? 64 : 84);
      };

      pinTrigger = ScrollTrigger.create({
        trigger: root,
        start: () => `top ${getHeaderOffset()}`,
        end: () => `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (products.length - 1),
          duration: { min: 0.15, max: 0.35 },
          delay: 0.04,
          ease: 'power1.inOut',
        },
        onUpdate: (self) => {
          const rawTarget = Math.min(
            Math.max(0, Math.round(self.progress * (products.length - 1))),
            products.length - 1
          );
          if (rawTarget !== targetIndex) {
            targetIndex = rawTarget;
            if (!animating && targetIndex !== currentIndex) {
              const dir = targetIndex > currentIndex ? 1 : -1;
              gotoSection(targetIndex, dir);
            }
          }
        },
      });

      pinTriggerRef.current = pinTrigger;

      // Initialise the first section
      gotoSection(0, 1);
    }, root);

    // Refresh ScrollTrigger after assets settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      pinTrigger?.kill();
      mainTl?.kill();
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="collection"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="obs-carousel-wrapper relative w-full overflow-hidden bg-[#FAF8F4] text-[#14171A] select-none touch-pan-y"
    >
      {/* Global Overlay Header (Clean responsive clearance, no overlapping) */}
      <div className="absolute top-0 inset-x-0 z-40 px-3 sm:px-12 pt-2.5 sm:pt-8 pb-1.5 sm:pb-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#FAF8F4]/95 via-[#FAF8F4]/80 to-transparent">
        <div className="min-w-0 pr-2">
          {/* <span className="text-[9px] sm:text-xs font-bold text-[#b99750] uppercase tracking-[0.16em] block mb-0.5">
            02 / Plastic Food Containers
          </span> */}
          {/* <h2 className="text-xs sm:text-xl lg:text-2xl font-bold tracking-tight text-[#14171A] flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span>High-Quality Food Containers</span>
            <span className="text-[#b99750] font-serif italic text-[11px] sm:text-lg font-normal">/ Ace Packaging</span>
          </h2> */}
        </div>

        {/* Dynamic Category Progress Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold tracking-wider text-[#14171A] tabular-nums bg-white/90 px-3.5 py-1 rounded-full border border-[#E6DBC6] shadow-xs backdrop-blur-md">
            0{activeIdx + 1} <span className="text-[#b99750]">/ 0{products.length}</span>
          </span>
        </div>
      </div>

      {/* The 6 Sliding Panels */}
      {products.map((p, idx) => {
        const cardImage = variantImages[p.id] || p.image;
        return (
          <div
            key={p.id}
            className={`obs-section obs-panel-${idx} absolute inset-0 w-full h-full overflow-hidden`}
          >
            <div className="obs-outer w-full h-full overflow-hidden">
              <div className="obs-inner w-full h-full overflow-hidden">
                <div
                  className="obs-bg absolute inset-0 w-full h-full flex items-center justify-center bg-[#FAF8F4]"
                  style={{
                    background: 'radial-gradient(ellipse 95% 75% at 50% 25%, #FFFFFF 0%, #FAF8F4 55%, #F4EFE6 100%)',
                  }}
                >
                  {/* Warm champagne & gold luxury ambient lighting */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 right-1/4 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(185,151,80,0.14)_0%,transparent_70%)] blur-3xl"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 left-10 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(230,219,198,0.55)_0%,transparent_70%)] blur-3xl"
                  />
                  <div className="container-custom w-full max-w-7xl h-full flex flex-col justify-between pt-10 sm:pt-20 lg:pt-28 pb-2 sm:pb-6 relative z-20">
                    {/* Category Badge & Topline */}
                    <div className="flex items-center justify-between gap-2 sm:gap-4 w-full mb-1.5 sm:mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold tracking-wide bg-white/90 text-[#9e7f3b] border border-[#E6DBC6] shadow-xs backdrop-blur-md shrink-0">
                          <Sparkles size={11} className="text-[#b99750]" />
                          <span>{p.badge}</span>
                        </span>
                        <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wider uppercase text-gray-400">
                          {p.seriesKicker}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 font-medium truncate text-right">
                        <span className="text-gray-400 uppercase tracking-wider text-[8px] sm:text-[10px] mr-1.5 font-semibold">Formats</span>
                        <span className="text-[#14171A] font-semibold">{p.capacity}</span>
                      </div>
                    </div>

                    {/* Main Content Area: Responsive 2-Column on Desktop, Flow Stack on Mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 sm:gap-4 lg:gap-14 items-center my-auto w-full">
                      {/* Left: Headline & Story */}
                      <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="overflow-hidden mb-1 sm:mb-4">
                          <h2 className="obs-section-heading text-xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#14171A] leading-[1.12]">
                            <span className="block font-sans">{p.title}</span>
                            <span className="block font-serif italic font-normal text-[#b99750] mt-0.5 sm:mt-1.5 tracking-normal">
                              {p.tagline}
                            </span>
                          </h2>
                        </div>

                        {/* On mobile: Compact Pedestal Card inserted right under heading */}
                        <div className="flex lg:hidden flex-col items-center justify-center my-1 sm:my-2 w-full">
                          <div className="relative w-full max-w-[320px] sm:max-w-[420px] rounded-2xl bg-white/95 border border-[#E6DBC6] backdrop-blur-xl p-2 sm:p-4 flex flex-col items-center justify-between shadow-lg shadow-black/5">
                            <div className="w-full flex items-center justify-between text-[9px] sm:text-xs font-semibold text-gray-600 mb-1 pb-1 border-b border-[#E6DBC6]">
                              <span className="flex items-center gap-1 text-[#9e7f3b] uppercase tracking-wider font-semibold text-[9px] sm:text-[10px]">
                                <Box size={11} className="text-[#b99750]" /> Container Architecture
                              </span>
                              <span className="flex items-center gap-1 text-emerald-800 text-[9px] sm:text-[10px] font-medium bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-full">
                                <CheckCircle2 size={10} /> ISO 9001:2015
                              </span>
                            </div>

                            <div className="relative w-full h-[85px] sm:h-[130px] my-1 rounded-xl overflow-hidden border border-[#E6DBC6]/60">
                              <Image
                                src={cardImage}
                                alt={`${p.title} structure`}
                                fill
                                sizes="(max-width: 640px) 300px, 420px"
                                className="object-cover"
                                priority={idx === 0}
                              />
                            </div>

                            {/* Variant selector on mobile */}
                            {productVariants[p.id] && (
                              <div className="flex flex-wrap items-center justify-center gap-1 my-1 z-30">
                                {productVariants[p.id].map((v) => (
                                  <button
                                    key={v.src}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVariantImages((prev) => ({ ...prev, [p.id]: v.src }));
                                    }}
                                    className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold transition-all cursor-pointer ${cardImage === v.src
                                      ? 'bg-[#14171A] text-white shadow-xs font-bold'
                                      : 'bg-white/80 text-gray-700 hover:bg-white border border-[#E6DBC6]'
                                      }`}
                                  >
                                    {v.label}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="w-full bg-[#FAF8F4]/90 rounded-lg sm:rounded-xl px-2 py-1 border border-[#E6DBC6] flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full bg-[#b99750]/20 flex items-center justify-center shrink-0">
                                <Utensils size={9} className="text-[#b99750]" />
                              </div>
                              <div className="text-left text-[8px] sm:text-[11px] leading-tight min-w-0">
                                <span className="text-gray-400 block text-[7px] sm:text-[8px] uppercase tracking-wider font-semibold">Culinary Pairing</span>
                                <span className="text-[#14171A] font-semibold truncate block">{p.foodPairing}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] sm:text-sm lg:text-base text-gray-600 max-w-xl leading-relaxed mb-1.5 sm:mb-4 font-normal line-clamp-2 sm:line-clamp-none">
                          {p.description}
                        </p>

                        {/* Technical Credentials Matrix */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-6 py-1 sm:py-3 border-y border-[#E6DBC6] max-w-xl text-[10px] sm:text-xs mb-2 sm:mb-5">
                          <div>
                            <span className="text-[9px] sm:text-xs uppercase tracking-wider text-[#9e7f3b] block font-semibold mb-0.5">
                              Polymer
                            </span>
                            <span className="font-semibold text-[10px] sm:text-sm text-[#14171A] block">100% Virgin PP 05</span>
                          </div>
                          <div>
                            <span className="text-[9px] sm:text-xs uppercase tracking-wider text-[#9e7f3b] block font-semibold mb-0.5">
                              Thermal
                            </span>
                            <span className="font-semibold text-[10px] sm:text-sm text-[#14171A] block">−20°C to +120°C</span>
                          </div>
                          <div>
                            <span className="text-[9px] sm:text-xs uppercase tracking-wider text-[#9e7f3b] block font-semibold mb-0.5">
                              Rim Seal
                            </span>
                            <span className="font-semibold text-[10px] sm:text-sm text-[#14171A] block">Zero-Leak Snap</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2.5 sm:gap-5">
                          <Link
                            href={p.href}
                            className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#b99750] hover:bg-[#14171A] text-white font-semibold px-3.5 py-1.5 sm:px-7 sm:py-3.5 rounded-full text-[11px] sm:text-sm tracking-wide transition-all duration-300 shadow-md shadow-[#b99750]/20 hover:shadow-lg active:scale-95 group"
                          >
                            <span>{p.link}</span>
                            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-semibold text-[#14171A] hover:text-[#b99750] border-b border-[#14171A]/30 hover:border-[#b99750] pb-0.5 transition-colors group"
                          >
                            <span>Request Samples</span>
                            <ArrowUpRight size={12} className="text-gray-400 group-hover:text-[#b99750] transition-colors" />
                          </Link>
                        </div>
                      </div>

                      {/* Right on Desktop: Floating Studio Container Pedestal */}
                      <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
                        <div className="relative w-full max-w-[440px] rounded-[32px] bg-gradient-to-b from-white/95 via-white/80 to-[#FAF8F4]/90 border border-[#E6DBC6] backdrop-blur-2xl p-7 sm:p-8 flex flex-col items-center justify-between shadow-2xl shadow-[#14171A]/5 group">
                          <div className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 pb-3 border-b border-[#E6DBC6]">
                            <span className="flex items-center gap-1.5 text-[#9e7f3b] uppercase tracking-wider text-[11px] font-semibold">
                              <Box size={14} className="text-[#b99750]" /> Container Architecture
                            </span>
                            <span className="flex items-center gap-1 text-emerald-800 text-[11px] font-medium bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 size={12} /> ISO 9001:2015
                            </span>
                          </div>

                          <div className="relative w-full h-[240px] sm:h-[260px] my-3 rounded-2xl overflow-hidden border border-[#E6DBC6]/60">
                            <Image
                              src={cardImage}
                              alt={`${p.title} structure`}
                              fill
                              sizes="440px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              priority={idx === 0}
                            />
                          </div>

                          {/* Photos selector on Desktop */}
                          {productVariants[p.id] && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5 my-2.5 z-30">
                              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mr-1">
                                Sizes:
                              </span>
                              {productVariants[p.id].map((v) => (
                                <button
                                  key={v.src}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVariantImages((prev) => ({ ...prev, [p.id]: v.src }));
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${cardImage === v.src
                                    ? 'bg-[#14171A] text-white shadow-xs font-semibold scale-105'
                                    : 'bg-white/80 text-gray-700 hover:bg-white hover:text-[#14171A] border border-[#E6DBC6]'
                                    }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Culinary Pairing Footnote */}
                          <div className="w-full bg-[#FAF8F4]/80 rounded-2xl p-3 border border-[#E6DBC6] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#b99750]/15 flex items-center justify-center shrink-0">
                              <Utensils size={14} className="text-[#b99750]" />
                            </div>
                            <div className="text-left text-xs leading-tight">
                              <span className="text-gray-400 block text-[9px] uppercase tracking-wider font-semibold mb-0.5">Culinary Pairing</span>
                              <span className="text-[#14171A] font-medium text-xs sm:text-sm line-clamp-1">{p.foodPairing}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Strip: Navigation Cue, Interactive Pagination Dots & Counter */}
                    <div className="w-full flex items-center justify-between text-xs text-gray-500 border-t border-[#E6DBC6] pt-1.5 sm:pt-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {products.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              goToSlide(dotIdx);
                            }}
                            aria-label={`Jump to ${products[dotIdx].title}`}
                            className={`transition-all duration-300 cursor-pointer ${dotIdx === activeIdx
                              ? 'w-4 sm:w-6 h-1.5 bg-[#b99750] rounded-full'
                              : 'w-1.5 h-1.5 bg-[#E6DBC6] hover:bg-[#b99750]/60 rounded-full'
                              }`}
                          />
                        ))}
                        <span className="ml-1 text-[9px] sm:text-[10px] text-gray-500 font-medium">Scroll to explore</span>
                      </div>

                      <span className="text-xs sm:text-sm font-semibold text-[#14171A] tracking-wider tabular-nums">
                        0{idx + 1} <span className="text-[#b99750]">/ 0{products.length}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Mobile Floating Chevrons for Tap Navigation */}
      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-40 flex sm:hidden items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous product series"
          className="w-7 h-7 rounded-full bg-white/90 hover:bg-[#b99750] text-[#14171A] hover:text-white border border-[#E6DBC6] flex items-center justify-center transition-all duration-200 backdrop-blur-md pointer-events-auto cursor-pointer shadow-md active:scale-90"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next product series"
          className="w-7 h-7 rounded-full bg-white/90 hover:bg-[#b99750] text-[#14171A] hover:text-white border border-[#E6DBC6] flex items-center justify-center transition-all duration-200 backdrop-blur-md pointer-events-auto cursor-pointer shadow-md active:scale-90"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Desktop Floating Vertical Chevrons */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-3">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous category"
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-[#b99750] text-[#14171A] hover:text-white border border-[#E6DBC6] flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer shadow-md"
        >
          <ChevronUp size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next category"
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-[#b99750] text-[#14171A] hover:text-white border border-[#E6DBC6] flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer shadow-md"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Global Bottom Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] sm:h-[4px] bg-[#E6DBC6]/50 z-40">
        <div
          className="h-full bg-[#b99750] transition-all duration-500 ease-out"
          style={{ width: `${((activeIdx + 1) / products.length) * 100}%` }}
        />
      </div>
    </section>
  );
}

export default ObserverCollectionShowcase;
