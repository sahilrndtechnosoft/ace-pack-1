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
        (heading) => new SplitText(heading, { type: 'chars,words,lines', linesClass: 'clip-text' })
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

        if (splits[index]?.chars?.length) {
          tl.fromTo(
            splits[index].chars,
            {
              autoAlpha: 0,
              yPercent: 120 * dFactor,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.55,
              ease: 'power2.out',
              stagger: {
                each: 0.015,
                from: 'random',
              },
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
      className="obs-carousel-wrapper relative w-full overflow-hidden bg-[#0C0D0E] text-white select-none touch-pan-y"
    >
      {/* Global Overlay Header (Clean responsive clearance, no overlapping) */}
      <div className="absolute top-0 inset-x-0 z-40 px-3 sm:px-12 pt-2.5 sm:pt-8 pb-1.5 sm:pb-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/95 via-black/80 to-transparent">
        <div className="min-w-0 pr-2">
          {/* <span className="text-[9px] sm:text-xs font-bold text-[#b99750] uppercase tracking-[0.16em] block mb-0.5">
            02 / Plastic Food Containers
          </span> */}
          {/* <h2 className="text-xs sm:text-xl lg:text-2xl font-bold tracking-tight text-white flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span>High-Quality Food Containers</span>
            <span className="text-[#b99750] font-serif italic text-[11px] sm:text-lg font-normal">/ Ace Packaging</span>
          </h2> */}
        </div>

        {/* Dynamic Category Progress Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-white/90 bg-white/10 px-2 sm:px-3.5 py-0.5 sm:py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            0{activeIdx + 1} <span className="text-[#b99750]">/ 0{products.length}</span>
          </span>
        </div>
      </div>

      {/* The 6 Sliding Panels */}
      {products.map((p, idx) => {
        const cardImage = variantImages[p.id] || p.image;
        const isCardPhoto = cardImage.startsWith('/DSC') || cardImage.endsWith('.JPG');
        return (
          <div
            key={p.id}
            className={`obs-section obs-panel-${idx} absolute inset-0 w-full h-full overflow-hidden`}
          >
            <div className="obs-outer w-full h-full overflow-hidden">
              <div className="obs-inner w-full h-full overflow-hidden">
                <div
                  className="obs-bg absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(12, 13, 14, 0.88) 0%, rgba(12, 13, 14, 0.55) 45%, rgba(12, 13, 14, 0.95) 100%), url(${p.foodImage})`,
                  }}
                >
                  <div className="container-custom w-full max-w-7xl h-full flex flex-col justify-between pt-12 sm:pt-24 lg:pt-28 pb-2.5 sm:pb-7 relative z-20">
                    {/* Category Badge & Topline */}
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full mb-1 sm:mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-black/70 text-[#b99750] border border-[#b99750]/40 backdrop-blur-md shrink-0">
                        <Sparkles size={10} className="text-[#b99750]" />
                        {p.badge}
                      </span>
                      <span className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-gray-300 truncate text-right">
                        Format: {p.capacity}
                      </span>
                    </div>

                    {/* Main Content Area: Responsive 2-Column on Desktop, Flow Stack on Mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 sm:gap-4 lg:gap-14 items-center my-auto w-full">
                      {/* Left: Headline & Story */}
                      <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="overflow-hidden mb-1 sm:mb-3">
                          <h2 className="obs-section-heading text-base sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold uppercase tracking-tight text-white leading-[1.12]">
                            {p.name}
                          </h2>
                        </div>

                        {/* On mobile: Compact Pedestal Card inserted right under heading */}
                        <div className="flex lg:hidden flex-col items-center justify-center my-1 sm:my-3 w-full">
                          <div className="relative w-full max-w-[300px] sm:max-w-[420px] rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 backdrop-blur-xl p-2 sm:p-4 flex flex-col items-center justify-between shadow-2xl shadow-black/80">
                            <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-gray-300 mb-0.5 sm:mb-1">
                              <span className="flex items-center gap-1 text-[#b99750]">
                                <Box size={11} /> Structure
                              </span>
                              <span className="flex items-center gap-1 text-[#4ade80]">
                                <CheckCircle2 size={10} /> US FDA 21 CFR
                              </span>
                            </div>

                            <div className="relative w-full h-[85px] sm:h-[135px] my-0.5">
                              <Image
                                src={cardImage}
                                alt={`${p.title} structure`}
                                fill
                                sizes="(max-width: 640px) 280px, 420px"
                                className={`object-contain ${isCardPhoto ? 'rounded-lg' : 'drop-shadow-[0_10px_16px_rgba(0,0,0,0.7)]'}`}
                                priority={idx === 0}
                              />
                            </div>

                            {/* Photos selector for RO and Deli on mobile */}
                            {p.id === 'ro-series' && (
                              <div className="flex flex-wrap items-center justify-center gap-1 my-0.5 sm:my-1 z-30">
                                {[
                                  { label: 'Clear', src: p.image },
                                  { label: 'Black', src: '/DSC04062.JPG' },
                                  { label: 'White', src: '/DSC03993.JPG' },
                                  { label: 'Tub', src: '/DSC04053.JPG' },
                                ].map((v) => (
                                  <button
                                    key={v.src}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVariantImages((prev) => ({ ...prev, [p.id]: v.src }));
                                    }}
                                    className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold transition-all cursor-pointer ${cardImage === v.src
                                      ? 'bg-[#b99750] text-black shadow-xs'
                                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                      }`}
                                  >
                                    {v.label}
                                  </button>
                                ))}
                              </div>
                            )}
                            {p.id === 'deli-series' && (
                              <div className="flex flex-wrap items-center justify-center gap-1 my-0.5 sm:my-1 z-30">
                                {[
                                  { label: 'Graphic', src: p.image },
                                  { label: 'Tub Photo', src: '/DSC04053.JPG' },
                                ].map((v) => (
                                  <button
                                    key={v.src}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVariantImages((prev) => ({ ...prev, [p.id]: v.src }));
                                    }}
                                    className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold transition-all cursor-pointer ${cardImage === v.src
                                      ? 'bg-[#b99750] text-black shadow-xs'
                                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                      }`}
                                  >
                                    {v.label}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="w-full bg-black/50 rounded-lg sm:rounded-xl px-2 py-0.5 sm:py-1 border border-white/10 flex items-center gap-1.5 sm:gap-2">
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#b99750]/20 flex items-center justify-center shrink-0">
                                <Utensils size={9} className="text-[#b99750]" />
                              </div>
                              <div className="text-left text-[8px] sm:text-[10px] leading-tight min-w-0">
                                <span className="text-gray-400 block text-[7px] sm:text-[8px] uppercase tracking-wider">Culinary Pairing</span>
                                <span className="text-white font-semibold truncate block">{p.foodPairing}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-sm text-gray-300 max-w-xl leading-snug mb-1.5 sm:mb-4 font-normal line-clamp-2">
                          {p.description}
                        </p>

                        {/* Technical Credentials Matrix */}
                        <div className="grid grid-cols-3 gap-1 sm:gap-2 py-1 sm:py-2.5 border-y border-white/15 max-w-xl text-[8px] sm:text-xs mb-1.5 sm:mb-5">
                          <div>
                            <span className="text-[7px] sm:text-[10px] uppercase tracking-wider text-[#b99750] block font-bold mb-0.5">
                              Polymer
                            </span>
                            <span className="font-semibold text-white">100% Virgin PP 05</span>
                          </div>
                          <div>
                            <span className="text-[7px] sm:text-[10px] uppercase tracking-wider text-[#b99750] block font-bold mb-0.5">
                              Thermal
                            </span>
                            <span className="font-semibold text-white">−20°C to +120°C</span>
                          </div>
                          <div>
                            <span className="text-[7px] sm:text-[10px] uppercase tracking-wider text-[#b99750] block font-bold mb-0.5">
                              Rim Seal
                            </span>
                            <span className="font-semibold text-white">Zero-Leak Snap</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Link
                            href={p.href}
                            className="inline-flex items-center gap-1.5 bg-[#b99750] hover:bg-white text-black font-bold px-3.5 py-1.5 sm:px-7 sm:py-3.5 rounded-full text-[9px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#b99750]/20 active:scale-95"
                          >
                            <span>{p.link}</span>
                            <ArrowUpRight size={12} />
                          </Link>
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-1 text-[9px] sm:text-xs font-semibold text-gray-300 hover:text-white border-b border-gray-600 pb-0.5 transition-colors"
                          >
                            Request Samples
                          </Link>
                        </div>
                      </div>

                      {/* Right on Desktop: Floating Studio Container Pedestal */}
                      <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
                        <div className="relative w-full max-w-[400px] aspect-square rounded-[32px] bg-gradient-to-b from-white/15 to-white/5 border border-white/20 backdrop-blur-xl p-8 flex flex-col items-center justify-between shadow-2xl shadow-black/80 group">
                          <div className="w-full flex items-center justify-between text-[11px] font-semibold text-gray-300">
                            <span className="flex items-center gap-1.5 text-[#b99750]">
                              <Box size={14} /> Structure
                            </span>
                            <span className="flex items-center gap-1 text-[#4ade80]">
                              <CheckCircle2 size={13} /> US FDA 21 CFR
                            </span>
                          </div>

                          <div className="relative w-full h-[220px] my-3">
                            <Image
                              src={cardImage}
                              alt={`${p.title} structure`}
                              fill
                              sizes="400px"
                              className={`object-contain ${isCardPhoto ? 'rounded-xl' : 'drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]'} group-hover:scale-105 transition-transform duration-500`}
                              priority={idx === 0}
                            />
                          </div>

                          {/* Photos selector for RO and Deli on Desktop */}
                          {p.id === 'ro-series' && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5 my-2 z-30">
                              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mr-1">
                                Real Shots:
                              </span>
                              {[
                                { label: 'Standard', src: p.image },
                                { label: 'Black Finish', src: '/DSC04062.JPG' },
                                { label: 'White Finish', src: '/DSC03993.JPG' },
                                { label: 'Clear Tub', src: '/DSC04053.JPG' },
                              ].map((v) => (
                                <button
                                  key={v.src}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVariantImages((prev) => ({ ...prev, [p.id]: v.src }));
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer ${cardImage === v.src
                                    ? 'bg-[#b99750] text-black shadow-xs font-extrabold'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </div>
                          )}
                          {p.id === 'deli-series' && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5 my-2 z-30">
                              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mr-1">
                                Real Shot:
                              </span>
                              {[
                                { label: 'Standard', src: p.image },
                                { label: 'Clear Deli Tub', src: '/DSC04053.JPG' },
                              ].map((v) => (
                                <button
                                  key={v.src}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVariantImages((prev) => ({ ...prev, [p.id]: v.src }));
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer ${cardImage === v.src
                                    ? 'bg-[#b99750] text-black shadow-xs font-extrabold'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Culinary Pairing Footnote */}
                          <div className="w-full bg-black/40 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#b99750]/20 flex items-center justify-center shrink-0">
                              <Utensils size={14} className="text-[#b99750]" />
                            </div>
                            <div className="text-left text-[11px] leading-tight">
                              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Culinary Pairing</span>
                              <span className="text-white font-semibold line-clamp-1">{p.foodPairing}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Strip: Navigation Cue, Interactive Pagination Dots & Counter */}
                    <div className="w-full flex items-center justify-between text-xs text-gray-400 border-t border-white/15 pt-1.5 sm:pt-3">
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
                              : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60 rounded-full'
                              }`}
                          />
                        ))}
                        <span className="ml-1 text-[9px] sm:text-[10px] text-gray-400">Scroll to explore</span>
                      </div>

                      <span className="text-[10px] sm:text-sm font-mono font-bold text-white tracking-widest">
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
          className="w-7 h-7 rounded-full bg-black/75 hover:bg-[#b99750] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md pointer-events-auto cursor-pointer shadow-lg active:scale-90"
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
          className="w-7 h-7 rounded-full bg-black/75 hover:bg-[#b99750] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md pointer-events-auto cursor-pointer shadow-lg active:scale-90"
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
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#b99750] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer"
        >
          <ChevronUp size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next category"
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#b99750] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Global Bottom Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] sm:h-[4px] bg-white/15 z-40">
        <div
          className="h-full bg-[#b99750] transition-all duration-500 ease-out"
          style={{ width: `${((activeIdx + 1) / products.length) * 100}%` }}
        />
      </div>
    </section>
  );
}

export default ObserverCollectionShowcase;
