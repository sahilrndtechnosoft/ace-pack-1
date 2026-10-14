'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronDown, ChevronUp, Sparkles, Box, Utensils, CheckCircle2 } from 'lucide-react';
import { products } from './config';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer, SplitText, ScrollTrigger);
}

export function ObserverCollectionShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTriggerRef = useRef<ScrollTrigger | null>(null);
  const gotoSectionRef = useRef<((index: number, direction: number) => void) | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

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
    const next = Math.min(activeIdx + 1, products.length - 1);
    goToSlide(next);
  }, [activeIdx, goToSlide]);

  const handlePrev = useCallback(() => {
    const prev = Math.max(activeIdx - 1, 0);
    goToSlide(prev);
  }, [activeIdx, goToSlide]);

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
          .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0, duration: 0.65, ease: 'power2.out' }, 0)
          .fromTo(
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

        currentIndex = index;
        setActiveIdx(index);
      }

      gotoSectionRef.current = gotoSection;

      // PINNING: Pin the section smoothly to viewport with ScrollTrigger
      const pinDistance = window.innerHeight * (products.length - 1) * 0.85;

      pinTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
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
      className="obs-carousel-wrapper relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0C0D0E] text-white select-none touch-pan-y"
    >
      {/* Pinned Global Overlay Header */}
      <div className="absolute top-0 inset-x-0 z-40 px-6 sm:px-12 pt-16 sm:pt-20 pb-3 sm:pb-5 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div>
          <span className="text-[9px] sm:text-[11px] font-bold text-[#b99750] uppercase tracking-[0.2em] block mb-0.5 sm:mb-1">
            02 / Plastic Food Containers
          </span>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            High-Quality Plastic Food Containers <span className="text-[#b99750] font-serif italic text-base sm:text-xl font-normal">/ Ace Packaging</span>
          </h2>
        </div>

        {/* Dynamic Category Progress Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold tracking-widest text-white/80 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            0{activeIdx + 1} <span className="text-[#b99750]">/ 0{products.length}</span>
          </span>
        </div>
      </div>

      {/* The 6 GSAP Observer Sliding Panels */}
      {products.map((p, idx) => (
        <div
          key={p.id}
          className={`obs-section obs-panel-${idx} absolute inset-0 w-full h-full overflow-hidden`}
        >
          <div className="obs-outer w-full h-full overflow-hidden">
            <div className="obs-inner w-full h-full overflow-hidden">
              <div
                className="obs-bg absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(12, 13, 14, 0.85) 0%, rgba(12, 13, 14, 0.5) 45%, rgba(12, 13, 14, 0.95) 100%), url(${p.foodImage})`,
                }}
              >
                <div className="container-custom w-full max-w-7xl h-full flex flex-col justify-between pt-26 sm:pt-32 pb-8 sm:pb-12 relative z-20">
                  {/* Category Badge & Topline */}
                  <div className="flex items-center justify-between w-full mb-1 sm:mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black/60 text-[#b99750] border border-[#b99750]/40 backdrop-blur-md">
                      <Sparkles size={11} className="text-[#b99750]" />
                      {p.badge}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-300">
                      Format: {p.capacity}
                    </span>
                  </div>

                  {/* Main Content Area: Responsive 2-Column on Desktop, Flow Stack on Mobile */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-14 items-center my-auto w-full">
                    {/* Left: Headline & Story */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                      <div className="overflow-hidden mb-2 sm:mb-3">
                        <h2 className="obs-section-heading text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.08]">
                          {p.name}
                        </h2>
                      </div>

                      {/* On mobile: Compact Pedestal Card inserted right under heading */}
                      <div className="flex lg:hidden flex-col items-center justify-center my-2 w-full">
                        <div className="relative w-full max-w-[340px] sm:max-w-[420px] rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 backdrop-blur-xl p-3 sm:p-4 flex flex-col items-center justify-between shadow-2xl shadow-black/80">
                          <div className="w-full flex items-center justify-between text-[10px] font-semibold text-gray-300 mb-1">
                            <span className="flex items-center gap-1 text-[#b99750]">
                              <Box size={12} /> Structure
                            </span>
                            <span className="flex items-center gap-1 text-[#4ade80]">
                              <CheckCircle2 size={11} /> US FDA 21 CFR
                            </span>
                          </div>

                          <div className="relative w-full h-[120px] sm:h-[150px] my-1">
                            <Image
                              src={p.image}
                              alt={`${p.title} structure`}
                              fill
                              sizes="(max-width: 640px) 300px, 420px"
                              className="object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.7)]"
                              priority={idx === 0}
                            />
                          </div>

                          <div className="w-full bg-black/50 rounded-xl px-2.5 py-1.5 border border-white/10 flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#b99750]/20 flex items-center justify-center shrink-0">
                              <Utensils size={11} className="text-[#b99750]" />
                            </div>
                            <div className="text-left text-[10px] leading-tight">
                              <span className="text-gray-400 block text-[8px] uppercase tracking-wider">Culinary Pairing</span>
                              <span className="text-white font-semibold line-clamp-1">{p.foodPairing}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-base text-gray-300 max-w-xl leading-relaxed mb-3 sm:mb-5 font-normal line-clamp-2 sm:line-clamp-none">
                        {p.description}
                      </p>

                      {/* Technical Credentials Matrix */}
                      <div className="grid grid-cols-3 gap-2 py-2 sm:py-3.5 border-y border-white/15 max-w-xl text-[10px] sm:text-xs mb-3 sm:mb-6">
                        <div>
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#b99750] block font-bold mb-0.5">
                            Polymer
                          </span>
                          <span className="font-semibold text-white">100% Virgin PP 05</span>
                        </div>
                        <div>
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#b99750] block font-bold mb-0.5">
                            Thermal
                          </span>
                          <span className="font-semibold text-white">−20°C to +120°C</span>
                        </div>
                        <div>
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#b99750] block font-bold mb-0.5">
                            Rim Seal
                          </span>
                          <span className="font-semibold text-white">Zero-Leak Snap</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={p.href}
                          className="inline-flex items-center gap-2 bg-[#b99750] hover:bg-white text-black font-bold px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#b99750]/20 hover:scale-105"
                        >
                          <span>{p.link}</span>
                          <ArrowUpRight size={14} />
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-300 hover:text-white border-b border-gray-600 pb-0.5 transition-colors"
                        >
                          Request Factory Samples
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

                        {/* Packaging Container Image with Hover Specular Glow */}
                        <div className="relative w-full h-[220px] my-auto">
                          <Image
                            src={p.image}
                            alt={`${p.title} structure`}
                            fill
                            sizes="400px"
                            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-700 ease-out"
                            priority={idx === 0}
                          />
                        </div>

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

                  {/* Bottom Strip: Navigation Cue & Counter */}
                  <div className="w-full flex items-center justify-between text-xs text-gray-400 border-t border-white/15 pt-3">
                    <span className="hidden sm:inline-block">
                      Scroll to move through collection
                    </span>
                    <span className="sm:hidden text-gray-400">Swipe to explore</span>

                    <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-widest">
                      0{idx + 1} <span className="text-[#b99750]">/ 0{products.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Floating Vertical Next/Prev Chevrons for Mouse/Touch Clicking */}
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
      <div className="absolute bottom-0 inset-x-0 h-[4px] bg-white/15 z-40">
        <div
          className="h-full bg-[#b99750] transition-all duration-700 ease-out"
          style={{ width: `${((activeIdx + 1) / products.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
export default ObserverCollectionShowcase;
