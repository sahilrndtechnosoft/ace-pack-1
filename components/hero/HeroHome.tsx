'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Flame, Layers, PackageCheck, Sparkles, Utensils } from 'lucide-react';
import { Hero3DStudio } from './Hero3DStudio';

export const HeroHome: React.FC = () => {
  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden bg-gradient-to-b from-[#fafbf7] via-[#f8f9f5] to-[#f4f5f0] text-[var(--ace-ink)] border-b border-[#E6DBC6]/60">
      {/* Subtle warm gold ambient gradients matching the brand logo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.12)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.08)_0%,transparent_70%)]"
      />

      <div className="container-custom max-w-[1600px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b99750]/15 border border-[#b99750]/30 text-[#b99750] text-xs font-extrabold uppercase tracking-wider mb-5 w-fit">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>US FDA 21 CFR 177.1520 · ISO 9001:2015 · 1.5M+ DAILY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--ace-ink)] leading-[1.08] mb-6">
              Beyond the Box.{' '}
              <span className="block font-serif italic font-normal text-[#b99750]">
                Engineered for Zero-Leak Delivery.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mb-8">
              Precision injection-moulded food containers crafted exclusively from 100% prime virgin PP 05 polymer. Manufactured across our Daman facilities for premier cloud kitchens, QSR chains, and export markets across 12 countries.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>Explore All 11 Collections</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-[var(--ace-ink)] hover:bg-[var(--ace-ink)] hover:text-white text-[var(--ace-ink)] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Request Free Sample Kit</span>
              </Link>
            </div>

            {/* 3 Engineering Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-[#E6DBC6]">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--ace-ink)]">Zero-Leak Snap Rim</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">Motorcycle delivery tested</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--ace-ink)]">-20°C to +120°C</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">Freezer &amp; microwave safe</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--ace-ink)]">100% Virgin PP 05</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">BPA-free &amp; recyclable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Container Studio with Food Falling Animation */}
          <div className="lg:col-span-6 w-full">
            <Hero3DStudio />
          </div>

        </div>
      </div>
    </section>
  );
};
