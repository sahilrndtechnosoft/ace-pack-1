'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ArrowRight,
  Box,
  CheckCircle2,
  ShieldCheck,
  Utensils,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { products } from './config';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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
  const [activeIdx, setActiveIdx] = useState(0);
  const [variantImages, setVariantImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Small delay to allow images and DOM layout to stabilize before measuring heights
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>('.showcase-panel');
        if (panels.length <= 1) return;

        // Leave the last panel unpinned so it smoothly leads into subsequent page content
        const animatedPanels = panels.slice(0, panels.length - 1);

        animatedPanels.forEach((panel) => {
          // Get the element holding the content inside the panel
          const innerpanel = panel.querySelector<HTMLElement>('.section-inner');
          if (!innerpanel) return;

          // Get the height of the content inside the panel
          const panelHeight = innerpanel.offsetHeight;
          const windowHeight = window.innerHeight;
          const difference = panelHeight - windowHeight;

          // ratio representing the portion of animation for fake-scrolling taller content
          const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

          // if we need to fake scroll, add bottom margin so next element enters at the proper time
          if (fakeScrollRatio) {
            panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: 'bottom bottom',
              end: () => (fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : 'bottom top'),
              pinSpacing: false,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          // fake scroll inner content if taller than window
          if (fakeScrollRatio) {
            tl.to(innerpanel, {
              yPercent: -100,
              y: window.innerHeight,
              duration: 1 / (1 - fakeScrollRatio) - 1,
              ease: 'none',
            });
          }

          // Scale down to 0.7, fade to 0.5 then 0 as next panel slides over
          tl.fromTo(
            panel,
            { scale: 1, opacity: 1 },
            { scale: 0.7, opacity: 0.5, duration: 0.9, ease: 'none', transformOrigin: 'center center' }
          ).to(panel, { opacity: 0, duration: 0.1, ease: 'none' });
        });

        // Track active index for pagination dots
        panels.forEach((panel, i) => {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveIdx(i),
            onEnterBack: () => setActiveIdx(i),
          });
        });

        ScrollTrigger.refresh();
      }, root);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSlide = (index: number) => {
    const panels = gsap.utils.toArray<HTMLElement>('.showcase-panel');
    if (panels[index]) {
      panels[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="collection" ref={containerRef} className="slides-wrapper relative w-full bg-[#111315]">
      {products.map((p, idx) => {
        const cardImage = variantImages[p.id] || p.image;

        return (
          <div
            key={p.id}
            className="section showcase-panel w-full h-screen min-h-[640px] relative flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 box-border"
            style={{ zIndex: 10 + idx }}
          >
            {/* Inner Card Container */}
            <div className="section-content relative w-full h-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/20 shadow-2xl bg-black">
              {/* Background Food Image Layer (100% full quality gourmet food photo) */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={p.foodImage || '/images/food-pairings/bento-meal.webp'}
                  alt={`${p.title} culinary pairing`}
                  fill
                  sizes="100vw"
                  className="object-cover object-center scale-102"
                  priority={idx === 0}
                />
                {/* Multi-layered dark atmospheric scrim ensuring 100% readable text & buttons */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/55 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full [background:radial-gradient(circle,rgba(207,161,68,0.22)_0%,transparent_70%)]"
                />
              </div>

              {/* Scrollable / Scalable Content Container */}
              <div className="section-inner showcase-inner relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 text-white">
                {/* 1. Header Bar: Series Tag, ISO Badge, and Slide Counter */}
                <div className="w-full flex items-center justify-between pb-3 sm:pb-4 border-b border-white/15">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b99750]/25 border border-[#b99750]/50 text-[#faeac7] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
                      <Sparkles size={12} className="text-[#e5c074]" />
                      <span>{p.seriesKicker}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 size={11} /> {p.material}
                    </span>
                    {p.badge && (
                      <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-right font-mono">
                    <span className="text-sm sm:text-base font-extrabold text-[#faeac7] tracking-wider">
                      0{idx + 1}
                    </span>
                    <span className="text-xs text-white/50">/ 0{products.length}</span>
                  </div>
                </div>

                {/* 2. Main Body Grid: Left Editorial Specs + Right Elevated Hardware Stage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto py-3 sm:py-4">
                  {/* Left Column: Title, Editorial Story, Specs, and Actions */}
                  <div className="lg:col-span-7 flex flex-col justify-center text-left">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md">
                      {p.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg font-serif italic text-[#faeac7] mb-3 leading-snug drop-shadow-sm">
                      {p.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-xl mb-4 sm:mb-6 drop-shadow-xs">
                      {p.description}
                    </p>

                    {/* Technical Specifications Pills */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white text-[11px] font-medium backdrop-blur-md">
                        <ShieldCheck size={13} className="text-[#e5c074]" />
                        <span>−20°C to +120°C Safe</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white text-[11px] font-medium backdrop-blur-md">
                        <Box size={13} className="text-[#e5c074]" />
                        <span>Hermetic Snap-Lock Rim</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white text-[11px] font-medium backdrop-blur-md">
                        <Sparkles size={13} className="text-[#e5c074]" />
                        <span>100% Virgin Food-Grade</span>
                      </div>
                    </div>

                    {/* Culinary Application Highlight Bar */}
                    <div className="inline-flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 max-w-lg shadow-inner">
                      <Utensils size={15} className="text-[#faeac7] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-[#faeac7] uppercase tracking-wider block">
                          Recommended Culinary Pairing
                        </span>
                        <span className="text-xs text-white font-medium leading-snug">
                          {p.foodPairing}
                        </span>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <Link
                        href={p.href}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <span>{p.link || 'Explore Collection'}</span>
                        <ArrowUpRight size={15} />
                      </Link>

                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors backdrop-blur-md cursor-pointer"
                      >
                        <span>Request Samples</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Elevated Container Pedestal with Interactive Variant Pills */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/25 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-between group">
                      {/* Card Header */}
                      <div className="w-full flex items-center justify-between text-xs font-semibold pb-2.5 border-b border-white/15">
                        <span className="flex items-center gap-1.5 text-[#faeac7] uppercase tracking-wider text-[10px] font-bold">
                          <Box size={13} className="text-[#e5c074]" /> Container Architecture
                        </span>
                        <span className="flex items-center gap-1 text-emerald-300 text-[10px] font-semibold bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 size={11} /> ISO 9001:2015
                        </span>
                      </div>

                      {/* Product Container Image Stage */}
                      <div className="relative w-full aspect-[4/3] my-3 rounded-2xl overflow-hidden bg-gradient-to-b from-white/15 to-white/5 border border-white/15 flex items-center justify-center p-3">
                        <Image
                          src={cardImage}
                          alt={`${p.title} structure`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 420px"
                          className="object-contain drop-shadow-2xl group-hover:scale-106 transition-transform duration-500 ease-out"
                          priority={idx === 0}
                        />
                      </div>

                      {/* Variant Size Switcher Pills */}
                      {productVariants[p.id] && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 my-2">
                          {productVariants[p.id].map((v) => (
                            <button
                              key={v.src}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVariantImages((prev) => ({ ...prev, [p.id]: v.src }));
                              }}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                                cardImage === v.src
                                  ? 'bg-[#b99750] text-white shadow-md scale-105'
                                  : 'bg-white/15 text-white/90 hover:bg-white/25 border border-white/20'
                              }`}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Available Capacities Footer */}
                      <div className="text-[10px] sm:text-[11px] text-gray-300 font-medium text-center pt-2 border-t border-white/15 w-full">
                        Available Formats: <span className="font-bold text-white">{p.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Strip: Interactive Pagination Jump Dots & Stacking Cue */}
                <div className="w-full flex items-center justify-between text-xs text-gray-300 bg-black/40 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 border border-white/15 shadow-inner">
                  {/* Jump Dots */}
                  <div className="flex items-center gap-2">
                    {products.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => scrollToSlide(dotIdx)}
                        aria-label={`Jump to ${products[dotIdx].title}`}
                        className={`transition-all duration-300 cursor-pointer ${
                          dotIdx === activeIdx
                            ? 'w-5 sm:w-7 h-1.5 bg-[#e5c074] rounded-full shadow-xs'
                            : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60 rounded-full'
                        }`}
                      />
                    ))}
                    <span className="hidden sm:inline-block ml-2 text-[10px] text-gray-400 font-medium">
                      Series {activeIdx + 1} of {products.length}
                    </span>
                  </div>

                  {/* Scroll Stacking Indicator */}
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#faeac7] font-semibold">
                    <span>Scroll to stack next series</span>
                    <ChevronDown size={14} className="animate-bounce text-[#e5c074]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
