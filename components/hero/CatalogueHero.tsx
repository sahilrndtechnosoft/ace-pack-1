'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, CheckCircle2, FileDown } from 'lucide-react';
import { CatalogueDownloadModal } from '@/components/ui/CatalogueDownloadModal';

export function CatalogueHero() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  return (
    <>
      <section
        id="main-content"
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#957033] via-[#89632b] via-[38%] via-[#b5904d] via-[48%] via-[#eec983] via-[62%] via-[#e5bd75] via-[75%] via-[#c5a162] via-[92%] to-[#bf9c5a] text-[#14171A] select-none"
      >
        {/* Subtle ambient studio lighting accents for seamless visual depth */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_65%_at_72%_50%,rgba(255,240,200,0.18)_0%,transparent_70%)]"
          aria-hidden="true"
        />

        {/* =========================================================================
            DESKTOP & TABLET LANDSCAPE VIEW (lg+): Full Side-by-Side Showcase Stage
           ========================================================================= */}
        <div className="hidden lg:flex min-h-[92svh] xl:min-h-screen relative flex-col justify-between py-6 px-8 xl:px-14">
          {/* Top Header Clearance & Brand Tagline */}
          <div className="relative z-20 w-full flex items-center justify-between text-xs tracking-wider font-semibold text-[#14171A]">
            <div className="flex items-center gap-2 text-white/95 drop-shadow-sm font-sans">
              <span className="w-2 h-2 rounded-full bg-[#E6DBC6] animate-pulse" />
              <span className="uppercase text-xs tracking-widest font-medium">
                India&apos;s Leading Moulding Plant
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/95 text-xs font-medium drop-shadow-sm font-sans">
              <ShieldCheck size={16} className="text-emerald-300" />
              <span>ISO 9001:2015 Certified</span>
            </div>
          </div>

          {/* Main Hero Copy + Full Image Showcase Container */}
          <div className="relative z-20 w-full max-w-[1680px] mx-auto my-auto py-6">
            <div className="grid grid-cols-12 gap-8 xl:gap-12 items-center">
              {/* Left Column (5 cols): Editorial Headline & Value Propositions */}
              <div className="col-span-5 flex flex-col justify-center pr-2">
                {/* Certified Eyebrow Pill */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#faeac7] text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm font-sans w-fit"
                >
                  <CheckCircle2 size={13} className="text-[#faeac7]" />
                  <span>100% Prime Virgin Polypropylene (PP 05)</span>
                </motion.div>

                {/* Hero Display Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.1 }}
                  className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] leading-[1.08] mb-5 font-sans"
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
                  className="text-base xl:text-lg text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] mb-8 font-sans max-w-lg"
                >
                  From crystal-clear fruit boxes and leak-proof boba cups to round deli bowls and multi-compartment meal trays. Manufactured in Daman for 1,000+ brands across 12 export countries.
                </motion.p>

                {/* Action CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-3.5 mb-10"
                >
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#14171A] hover:bg-black text-white font-semibold text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group font-sans"
                  >
                    <span>Explore Products</span>
                    <ArrowUpRight
                      size={17}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDownloadModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white font-semibold text-sm tracking-wide shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer font-sans"
                  >
                    <FileDown size={17} className="text-[#faeac7]" />
                    <span>Download Catalogue</span>
                  </button>
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

              {/* Right Column (7 cols): Full Image Showcase with Complete Packaging Spread (No Shadow, No Border) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="col-span-7 flex items-center justify-center relative"
              >
                <div className="relative w-full [mask-image:radial-gradient(ellipse_96%_90%_at_50%_50%,black_75%,transparent_100%)]">
                  <picture>
                    <source srcSet="/images/takeaway-spread-transparent.webp" type="image/webp" />
                    <img
                      src="/images/takeaway-spread-transparent.png"
                      alt="Ace Packaging Golden Gourmet Complete Takeaway Spread - Full Range"
                      className="w-full h-auto max-h-[78vh] object-contain block select-none pointer-events-none"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hero Bottom Cue */}
          <div className="relative z-20 w-full flex items-center justify-between text-xs text-white/90 font-medium drop-shadow-sm font-sans pt-2">
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
              <span>100% Recyclable PP 05</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE & TABLET PORTRAIT VIEW (< lg): Full Uncropped Photography Flow
           ========================================================================= */}
        <div className="lg:hidden flex flex-col justify-between min-h-[calc(100svh-64px)] text-white">
          {/* Top Badges & Plant Certification */}
          <div className="px-4 pt-3.5 pb-1 flex items-center justify-between text-[10px] font-semibold text-white/90">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#faeac7] animate-pulse" />
              <span className="uppercase tracking-wider">India&apos;s Leading Moulding Plant</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/90">
              <ShieldCheck size={13} className="text-emerald-300" />
              <span>ISO 9001:2015 Certified</span>
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

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full bg-[#14171A] hover:bg-black text-white font-semibold text-xs tracking-wide shadow-lg active:scale-95 transition-all"
              >
                <span>Explore Products</span>
                <ArrowUpRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white font-semibold text-xs tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <FileDown size={14} className="text-[#faeac7]" />
                <span>Catalogue</span>
              </button>
            </div>
          </div>

          {/* Showcase Photography (Full Image, Seamlessly Merged) */}
          <div className="px-3 sm:px-4 py-2">
            <div className="relative w-full [mask-image:radial-gradient(ellipse_96%_92%_at_50%_50%,black_75%,transparent_100%)]">
              <picture>
                <source srcSet="/images/takeaway-spread-transparent.webp" type="image/webp" />
                <img
                  src="/images/takeaway-spread-transparent.png"
                  alt="Ace Packaging Golden Gourmet Complete Takeaway Spread - Full Range"
                  className="w-full h-auto object-contain block select-none pointer-events-none"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
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

      {/* Catalogue Download Modal */}
      <CatalogueDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        documentTitle="Ace Packaging Full Product Catalog 2026"
        downloadUrl="/downloads/Ace_Packaging_Full_Product_Catalog.pdf"
      />
    </>
  );
}
