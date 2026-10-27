'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function CatalogueHero() {
  return (
    <section
      id="main-content"
      className="relative w-full overflow-hidden bg-[#cfb27d] text-[#14171A] select-none"
    >
      {/* =========================================================================
          DESKTOP & TABLET LANDSCAPE VIEW (lg+): Full-screen editorial side-by-side
         ========================================================================= */}
      <div className="hidden lg:flex min-h-[92svh] xl:min-h-screen relative flex-col justify-between">
        {/* Background Image Layer (Authentic 2026 Catalogue Master Photography) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/hero-catalogue-widescreen.webp" />
            <img
              src="/images/hero-catalogue-portrait.webp"
              alt="Ace Packaging Original Food Storage Containers and Drinkware"
              className="w-full h-full object-cover object-center transform scale-[1.02] transition-transform duration-700 ease-out"
              fetchPriority="high"
            />
          </picture>

          {/* Soft luxury champagne scrim on left for typographic contrast while keeping the right side food/boxes vibrant */}
          <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#b3955b]/85 via-[#b3955b]/55 via-65% to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#9a7e48]/60 to-transparent" />
        </div>

        {/* Top Header Clearance & Brand Tagline */}
        <div className="relative z-20 w-full px-12 pt-10 flex items-center justify-between text-xs tracking-wider font-semibold text-[#14171A]">
          <div className="flex items-center gap-2 text-white/95 drop-shadow-sm font-sans">
            <span className="w-2 h-2 rounded-full bg-[#E6DBC6] animate-pulse" />
            <span className="uppercase text-xs tracking-widest font-medium">
              India&apos;s Leading Moulding Plant
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/95 text-xs font-medium drop-shadow-sm font-sans">
            <ShieldCheck size={16} className="text-emerald-300" />
            <span>US FDA 21 CFR 177.1520 &amp; ISO 9001:2015</span>
          </div>
        </div>

        {/* Main Hero Copy Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-12 py-16 my-auto">
          <div className="max-w-xl">
            {/* Certified Eyebrow Pill */}
            {/* <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#E6DBC6] text-[#785d26] text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm font-sans"
            >
              <CheckCircle2 size={13} className="text-[#9e7f3b]" />
              <span>100% Prime Virgin Polypropylene (PP 05)</span>
            </motion.div> */}

            {/* Hero Display Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="text-5xl xl:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] leading-[1.08] mb-5 font-sans"
            >
              Pioneers of Precision{' '}
              <span className="font-serif italic font-normal text-[#faeac7] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Food Packaging.
              </span>
            </motion.h1>

            {/* Descriptive Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] mb-8 max-w-lg font-sans"
            >
              From crystal-clear fruit and salad containers to leak-proof boba cups, soup bowls, and living-hinge condiment tubs. Manufactured in Daman for 1,000+ brands across 12 export countries.
            </motion.p>

            {/* Action CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-center gap-3.5 mb-10"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#14171A] hover:bg-black text-white font-semibold text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group font-sans"
              >
                <span>Explore Products</span>
                <ArrowUpRight
                  size={17}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
            </motion.div>

            {/* Quick Metrics Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-white/25 max-w-md font-sans"
            >
              <div>
                <p className="text-2xl font-extrabold text-white drop-shadow-sm tracking-tight">1.5M+</p>
                <p className="text-xs text-white/85 font-medium tracking-wide">Moulded Daily</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white drop-shadow-sm tracking-tight">1,000+</p>
                <p className="text-xs text-white/85 font-medium tracking-wide">Global Clients</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white drop-shadow-sm tracking-tight">12+</p>
                <p className="text-xs text-white/85 font-medium tracking-wide">Export Markets</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Bottom Cue */}
        <div className="relative z-20 w-full px-12 pb-7 flex items-center justify-between text-xs text-white/90 font-medium drop-shadow-sm font-sans">
          <a
            href="#craft"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <span className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-[10px]">
              ↓
            </span>
            <span>Scroll to unbox the craft</span>
          </a>
          <div className="flex items-center gap-4 text-xs font-medium tracking-wide">
            <span>01 / 06 Formats</span>
            <span className="text-white/40">·</span>
            <span>Daman Plant 01 &amp; 02</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET PORTRAIT VIEW (< lg): Art-directed clean vertical flow
         ========================================================================= */}
      <div className="lg:hidden flex flex-col justify-between min-h-[calc(100svh-64px)] bg-gradient-to-b from-[#b3955b] via-[#bf9f62] to-[#99793f] text-white">
        {/* Top Badges & Plant Certification */}
        <div className="px-4 pt-3.5 pb-1 flex items-center justify-between text-[10px] font-semibold text-white/90">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#faeac7] animate-pulse" />
            <span className="uppercase tracking-wider">India&apos;s Leading Moulding Plant</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/90">
            <ShieldCheck size={13} className="text-emerald-300" />
            <span>ISO 9001:2015</span>
          </div>
        </div>

        {/* Brand Headline & Narrative */}
        <div className="px-4 pt-2 pb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-[#faeac7] text-[10px] font-semibold uppercase tracking-wider mb-2">
            <CheckCircle2 size={11} className="text-[#faeac7]" />
            <span>100% Prime Virgin PP 05</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-[1.12] mb-2 font-sans">
            Pioneers of Precision{' '}
            <span className="font-serif italic font-normal text-[#faeac7]">
              Food Packaging.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed mb-3.5 max-w-sm">
            Crystal-clear fruit boxes, salad bowls, leak-proof boba cups, and living-hinge portion tubs moulded in Daman for 1,000+ global brands.
          </p>

          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14171A] hover:bg-black text-white font-semibold text-xs tracking-wide shadow-lg active:scale-95 transition-all"
            >
              <span>Explore Products</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Showcase Photography Card (Complete, sharp, authentic, 100% visible) */}
        <div className="px-3 sm:px-4 py-1">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/25 bg-[#99793f]">
            <img
              src="/images/hero-catalogue-mobile.webp"
              alt="Ace Packaging Original Food Storage Containers and Drinkware"
              className="w-full h-auto max-h-[46vh] object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
            {/* Subtle caption strip */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between px-3 pb-1.5 text-[10px] text-white/95 font-medium">
              <span>Authentic 2026 Assortment</span>
              <span className="text-[#faeac7] font-semibold">01 / 06 Formats</span>
            </div>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-3 gap-1 px-4 py-3 border-t border-white/20 bg-black/15 text-center">
          <div>
            <p className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">1.5M+</p>
            <p className="text-[9px] sm:text-[10px] text-white/80 font-medium">Moulded Daily</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">1,000+</p>
            <p className="text-[9px] sm:text-[10px] text-white/80 font-medium">Global Clients</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">12+</p>
            <p className="text-[9px] sm:text-[10px] text-white/80 font-medium">Export Markets</p>
          </div>
        </div>
      </div>
    </section>
  );
}
