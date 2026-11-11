import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { getPageContent, cmsMetadata } from '@/lib/db/content';
import {
  Layers,
  Box,
  Cpu,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileDown,
  Building2,
  Clock,
  Gauge,
} from 'lucide-react';

const staticMetadata: Metadata = {
  title: 'Manufacturing Process | Sheet Extrusion & Thermoforming | Ace Packaging',
  description:
    "Ace Packaging's 5-step automated manufacturing process: Sheet Extrusion, Thermoforming, Automated Production, Quality Checks, and Packaging & Dispatch.",
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('process', staticMetadata);
}

const STEP_ICONS = [Layers, Box, Cpu, ShieldCheck, Truck];
const FACILITY_ICONS = [Gauge, Building2, Sparkles];

export default async function ProcessPage() {
  const { content, hidden } = await getPageContent('process');
  const show = (key: string) => !hidden.includes(key);
  const { banner, steps, facility, cta } = content;

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {/* Hero Page Banner */}
      {show('banner') && (
        <PageBanner
          title={banner.title}
          subtitle={banner.subtitle}
          badge={banner.badge}
          bgImage={banner.bgImage}
          breadcrumbs={[{ name: 'Manufacturing Process', href: '/process' }]}
        />
      )}

      {/* Process Introduction & Plant Capabilities */}
      {show('steps') && (
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
              {steps.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
              {steps.heading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
              {steps.intro}
            </p>
          </div>

          {/* Stepper Timeline Cards */}
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.steps.map((step, idx) => {
              const IconComponent = STEP_ICONS[idx % STEP_ICONS.length];
              return (
                <div
                  key={`${step.title}-${idx}`}
                  className="bg-white rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] p-6 sm:p-9 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Subtle Accent Glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#b99750]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Left: Step Number & Icon */}
                    <div className="flex md:flex-col items-center md:items-start gap-4 shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6] group-hover:border-[#b99750] flex items-center justify-center text-[#a8812f] transition-colors shadow-2xs">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-[#a8812f] font-mono leading-none">
                        {step.number}
                      </span>
                    </div>

                    {/* Middle: Content & Specs */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a8812f] bg-[#FAF8F4] border border-[#E6DBC6] px-2.5 py-1 rounded-full">
                          {step.tag}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">
                          Step {idx + 1} of {steps.steps.length}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-1">
                        {step.title}
                      </h3>
                      <h4 className="text-xs sm:text-sm font-bold text-[#b99750] mb-3">
                        {step.subtitle}
                      </h4>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                        {step.description}
                      </p>

                      {/* Key Technical Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-gray-100">
                        {step.keySpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-xs font-medium text-gray-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#a8812f] shrink-0 mt-0.5" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Key Highlight Bar */}
                      <div className="mt-5 p-3 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6] flex items-center justify-between text-xs font-bold text-[#1A1D20]">
                        <span className="text-gray-500 font-semibold">{steps.benchmarkLabel}</span>
                        <span className="text-[#a8812f]">{step.highlight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Manufacturing Standards & Facility Summary */}
      {show('facility') && (
      <section className="py-12 md:py-16 bg-white border-y border-[#E6DBC6]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {facility.cards.map((card, idx) => {
              const Icon = FACILITY_ICONS[idx % FACILITY_ICONS.length];
              return (
                <div key={`${card.title}-${idx}`} className="bg-[#FAF8F4] p-6 sm:p-8 rounded-3xl border border-[#E6DBC6] text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6DBC6] flex items-center justify-center text-[#a8812f] mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1D20] mb-2">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Call to Action: Plant Tour & Quality Audit */}
      {show('cta') && (
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="bg-[#161A12] text-white rounded-3xl p-8 sm:p-14 border border-white/10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-left">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold text-[#d6b05d] uppercase tracking-wider block mb-2">
                {cta.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {cta.heading}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2.5 leading-relaxed">
                {cta.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <Link
                href={cta.primaryButton.link}
                className="inline-flex items-center justify-center gap-2 bg-[#d6b05d] hover:bg-[#c49e48] text-[#161A12] font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{cta.primaryButton.text}</span>
              </Link>
              <Link
                href={cta.secondaryButton.link}
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#d6b05d] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>{cta.secondaryButton.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
