'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Layers, Box, Cpu, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Sheet Extrusion',
      subtitle: 'Precision Gauge Polymer Sheet',
      icon: Layers,
      description:
        'Prime virgin PP 05 and PET resins are melted and continuously extruded through automated dies, ensuring uniform wall thickness across the entire sheet.',
      benchmark: '±0.02 mm gauge precision',
    },
    {
      num: '02',
      title: 'Thermoforming',
      subtitle: 'Plug-Assist Cavity Moulding',
      icon: Box,
      description:
        'Continuous radiant heating and vacuum-assisted plug-forming shape containers with calibrated perimeter snap rims that guarantee zero transit leakage.',
      benchmark: 'Hermetic perimeter snap-seal',
    },
    {
      num: '03',
      title: 'Automated Production',
      subtitle: 'High-Speed Inline Robotic Handling',
      icon: Cpu,
      description:
        'Automated in-mould trimming with sub-3.0 second cycle speeds. Robotic arms transfer containers onto cleanroom conveyors with zero manual handling.',
      benchmark: 'Zero-touch cleanroom speed',
    },
    {
      num: '04',
      title: 'Quality Checks',
      subtitle: '100% Inline Optical Vision Testing',
      icon: ShieldCheck,
      description:
        'High-speed camera vision defect detection, 100% rim seal leak verification, and −20°C to +120°C thermal endurance stress testing on every production batch.',
      benchmark: '100% leak & thermal tested',
    },
    {
      num: '05',
      title: 'Packaging and Dispatch',
      subtitle: 'Protective Sleeving & Export Logistics',
      icon: Truck,
      description:
        'Automatic nesting into dust-proof polybag sleeves, 5-ply corrugated export cartoning, and palletized stretch-wrapping for domestic and international dispatch.',
      benchmark: 'Palletized global export ready',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E6DBC6]/40">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
            PRODUCTION WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
            5-Step Automated Manufacturing Process
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
            From raw virgin polymer sheet extrusion to high-speed thermoforming, automated production, quality checks, and protective dispatch.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#FAF8F4] hover:bg-white p-5 sm:p-7 rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 group"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6DBC6] group-hover:border-[#b99750] flex items-center justify-center text-[#a8812f] shrink-0 transition-colors shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-[#a8812f] font-mono leading-none sm:hidden">
                    {step.num}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-block text-2xl font-black text-[#a8812f] font-mono leading-none mr-1">
                        {step.num}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#1A1D20] group-hover:text-[#a8812f] transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Step {idx + 1} of 5
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                    {step.description}
                  </p>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#a8812f] bg-white border border-[#E6DBC6] px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{step.benchmark}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/process"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a8812f] hover:text-[#1A1D20] transition-colors group"
          >
            <span>Explore full technical process &amp; facility specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>
    </section>
  );
};
