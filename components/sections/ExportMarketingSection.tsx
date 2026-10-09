'use client';

import React from 'react';
import Link from 'next/link';
import { Ship, Globe2, ShieldCheck, ArrowRight, PackageCheck, Anchor, MapPin, CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';

export const ExportMarketingSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Specification & Pallet Planning',
      description: 'Alignment of exact product dimensions, master carton configuration, and cubic volume calculations to maximize 20ft / 40ft High Cube container payloads.',
    },
    {
      num: '02',
      title: 'Heavy-Duty Export Packaging',
      description: 'Interlocking carton stacking with heavy-gauge corrugated outer boxes, corner board edge protectors, and moisture-barrier shrink wrap for ocean transit.',
    },
    {
      num: '03',
      title: 'Regulatory & Customs Clearance',
      description: 'Preparation of international certificates of origin, US FDA compliance documentation, food-contact migration test reports, and customs export filings.',
    },
    {
      num: '04',
      title: 'Port Dispatch via JNPT Mumbai',
      description: 'Strategic proximity to Nhava Sheva (JNPT) container port allows rapid container stuffing and reliable direct sailing schedules to global trade hubs.',
    },
  ];

  return (
    <section className="relative py-20 bg-white text-[var(--ace-ink)] border-b border-[#E6DBC6]/50 overflow-hidden">
      {/* Background radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 w-[450px] h-[450px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.1)_0%,transparent_70%)]"
      />

      <Container className="relative z-10">
        <Reveal type="fade-up">
          <div className="max-w-3xl text-left mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b99750]/15 border border-[#b99750]/30 text-[#b99750] text-xs font-bold uppercase tracking-wider mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              <span>International Logistics &amp; Export Infrastructure</span>
            </div>

            <SplitHeading>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ace-ink)] tracking-tight leading-tight">
                Every container we ship for export is carefully planned and prepared for delivery.
              </h2>
            </SplitHeading>

            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              From our Daman manufacturing hub to international distribution centers across 12+ countries, ACE Packaging implements rigorous pallet engineering, sea-freight protection, and regulatory clearances so products arrive pristine, sterile, and ready for immediate service.
            </p>
          </div>
        </Reveal>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step, idx) => (
            <Reveal key={idx} type="fade-up" delay={idx * 0.08}>
              <div className="h-full bg-[#FAF8F4] rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group text-left">
                <div>
                  <span className="text-3xl font-extrabold text-[#b99750] font-serif block mb-3">
                    {step.num}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--ace-ink)] mb-2.5 group-hover:text-[#b99750] transition-colors leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Global Export Hubs & Action Bar */}
        <div className="rounded-3xl bg-[#FAF8F4] border-2 border-[#b99750]/30 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b99750] uppercase tracking-wider mb-2">
              <Anchor className="w-4 h-4" />
              <span>Direct Global Shipping Routes</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--ace-ink)] mb-2">
              Serving 12+ Export Markets Worldwide
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              Regular FCL and LCL container consignments to the UAE, Saudi Arabia, Oman, UK, Germany, France, Australia, Canada, and the United States.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-700">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E6DBC6]">Middle East (GCC)</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E6DBC6]">United Kingdom &amp; EU</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E6DBC6]">Australia &amp; NZ</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E6DBC6]">North America</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Plan Your Export Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
