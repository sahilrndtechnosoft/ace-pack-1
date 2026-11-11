'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoveRight,
  Sparkles,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import { homeIndustries } from '@/lib/cms/pages/home';

export function TrustCardsSection({ content = homeIndustries }: { content?: typeof homeIndustries }) {
  const SECTOR_CARDS = content.cards;
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Card 1 (Quick Commerce) is active by default matching the screenshot,
  // and dynamically updates on scroll or when user hovers any card.
  const [activeIdx, setActiveIdx] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getHeaderOffset = useCallback(() => {
    const header = document.querySelector('header');
    return header ? Math.round(header.getBoundingClientRect().height) : 70;
  }, []);

  const getDistance = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.parentElement) return 0;
    return Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let pinTrigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        pinTrigger = ScrollTrigger.create({
          trigger: section,
          start: () => `top ${getHeaderOffset()}`,
          end: () => `+=${getDistance() + 250}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const distance = getDistance();
            gsap.set(track, { x: -self.progress * distance });
            const rawIdx = Math.min(
              SECTOR_CARDS.length - 1,
              Math.max(0, Math.round(self.progress * (SECTOR_CARDS.length - 1)))
            );
            setActiveIdx(rawIdx);
          },
        });

        stRef.current = pinTrigger;
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        track.classList.add('overflow-x-auto');
      });
    }, section);

    // Refresh after layout and images settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      pinTrigger?.kill();
      ctx.revert();
    };
  }, [getHeaderOffset, getDistance]);

  const goToSlide = useCallback((index: number) => {
    const st = stRef.current;
    if (!st) return;

    const scrollDistance = st.end - st.start;
    const targetScroll = st.start + (index / (SECTOR_CARDS.length - 1)) * scrollDistance;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  const handleNext = () => {
    const next = Math.min(SECTOR_CARDS.length - 1, activeIdx + 1);
    goToSlide(next);
  };

  const handlePrev = () => {
    const prev = Math.max(0, activeIdx - 1);
    goToSlide(prev);
  };

  // If a card is hovered, that card is shown in the active state; otherwise the scroll-active card is shown.
  const currentHighlightedIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  return (
    <section
      ref={sectionRef}
      className="xp-trust relative w-full h-[calc(100svh-var(--site-header,72px))] min-h-[580px] max-h-[100svh] overflow-hidden bg-[#FAF8F4] text-[#14171A] border-b border-[#E6DBC6]/60 select-none py-4 sm:py-6 flex flex-col justify-between"
    >
      {/* Subtle Ambient Radial Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/4 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(185,151,80,0.08)_0%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(230,219,198,0.40)_0%,transparent_70%)] blur-3xl"
      />

      <div className="w-full flex-1 flex flex-col justify-between max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 min-h-0">
        {/* Header Bar: Heading on Left, Counter and Navigation Controls on Right */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 pt-1 sm:pt-2 mb-2 sm:mb-4 shrink-0">
          <div className="max-w-2xl">
            <span className="xp-eyebrow inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#b99750]/15 border border-[#b99750]/30 text-[#9e7f3b] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-1.5">
              <Sparkles size={11} className="text-[#b99750]" />
              {content.eyebrow}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#14171A] leading-tight">
              {content.heading}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-relaxed max-w-xl">
              {content.description}
            </p>
          </div>

          {/* Right: Counter and Chevron Navigation Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#14171A] tabular-nums tracking-wide bg-white/90 border border-[#E6DBC6] px-3.5 py-1 rounded-full shadow-xs">
              0{currentHighlightedIdx + 1} <span className="text-gray-400">/ 0{SECTOR_CARDS.length}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIdx === 0}
                aria-label="Previous industry sector"
                className="w-9 h-9 rounded-full bg-white border border-[#E6DBC6] hover:border-[#ce1b2f] hover:bg-[#ce1b2f] text-[#14171A] hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIdx === SECTOR_CARDS.length - 1}
                aria-label="Next industry sector"
                className="w-9 h-9 rounded-full bg-white border border-[#E6DBC6] hover:border-[#ce1b2f] hover:bg-[#ce1b2f] text-[#14171A] hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Moving Cards Track (Full-size tall cards matching the screenshot) */}
        <div className="w-full overflow-hidden my-auto flex-1 flex items-center min-h-0 py-2">
          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 will-change-transform items-center"
          >
            {SECTOR_CARDS.map((card, idx) => {
              const isActive = idx === currentHighlightedIdx;

              return (
                <div
                  key={`${card.title}-${idx}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px] h-[450px] sm:h-[480px] md:h-[510px] max-h-[62svh] rounded-[24px] sm:rounded-[28px] overflow-hidden select-none cursor-pointer transition-all duration-500 ease-out ${isActive
                      ? 'shadow-2xl shadow-[#ce1b2f]/25 scale-[1.01]'
                      : 'shadow-md hover:shadow-xl'
                    }`}
                >
                  {/* Layer 1: Lifestyle / Packaging Photo (Inactive State with Top Shadow Scrim) */}
                  <div
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-out ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      loading={idx < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Top gradient scrim ensuring crystal-clear white title legibility, exactly like screenshot */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 via-35% to-transparent pointer-events-none"
                    />
                  </div>

                  {/* Layer 2: Vibrant Red Solid Background (#ce1b2f sampled directly from screenshot) */}
                  <div
                    className={`absolute inset-0 w-full h-full bg-[#A6843E] transition-opacity duration-500 ease-out ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                  />

                  {/* Content Layer (Top-aligned exactly like screenshot) */}
                  <div className="relative z-10 w-full h-full p-7 sm:p-8 flex flex-col justify-start">
                    {/* Bold Title */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {card.title}
                    </h3>

                    {/* Active State View: Narrative Description + White Circular Arrow Button */}
                    <div
                      className={`transition-all duration-500 ease-out ${isActive
                          ? 'opacity-100 translate-y-0 max-h-[280px] mt-4 sm:mt-5'
                          : 'opacity-0 -translate-y-2 max-h-0 pointer-events-none overflow-hidden'
                        }`}
                    >
                      <p className="text-xs sm:text-sm text-white/95 font-normal leading-relaxed mb-6 max-w-[270px]">
                        {card.description}
                      </p>

                      {/* White circular button with right arrow (exact match to screenshot) */}
                      <Link
                        href={card.link}
                        aria-label={`Explore ${card.title} packaging`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#ce1b2f] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 group/btn"
                      >
                        <ArrowRight size={19} strokeWidth={2.4} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Trailing Gutter */}
            <div aria-hidden="true" className="shrink-0 w-6 sm:w-12" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustCardsSection;
