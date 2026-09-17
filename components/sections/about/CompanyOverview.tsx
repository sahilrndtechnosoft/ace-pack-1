import React from 'react';
import { Reveal } from '../../ui/Reveal';
import { SplitHeading } from '../../ui/SplitHeading';
import { ShieldCheck, Factory, Globe2 } from 'lucide-react';

const highlights = [
  { icon: Factory, text: '2 manufacturing units in Daman, U.T.' },
  { icon: ShieldCheck, text: '100% virgin PP 05 food-grade polymer' },
  { icon: Globe2, text: 'Exporting to 25+ countries worldwide' }
];

export const CompanyOverview: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-[#FAF8F4] border-b border-[#E6DBC6]/40">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          <Reveal type="fade-right">
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 h-[340px] sm:h-[420px] w-full">
                <img
                  src="https://ik.imagekit.io/mikbqwyy0/AcePackaging/ChatGPT%20Image%20Aug%2026,%202026,%2012_02_15%20PM.png?tr=w-800,q-78,f-webp"
                  alt="AcePack manufacturing facility"
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white rounded-2xl border border-[#E6DBC6] shadow-lg px-6 py-4">
                <span className="text-2xl font-extrabold text-[#a8812f] block">15+</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Years in Business</span>
              </div>
            </div>
          </Reveal>

          <Reveal type="fade-left" delay={0.1}>
            <div className="lg:col-span-7 text-left">
              <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
                Company Overview
              </span>
              <SplitHeading>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight mb-6 leading-tight">
                  A Packaging Partner Built for High-Volume Food Businesses
                </h2>
              </SplitHeading>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                AcePack Packaging is a high-precision injection-moulding manufacturer specializing in food-grade plastic containers for QSR chains, cloud kitchens, caterers, and retail food brands. From our Daman manufacturing base, we engineer containers that hold up through freezer storage, microwave reheating, and the realities of last-mile delivery.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Every container we produce is manufactured exclusively from 100% prime virgin PP 05 polymer — never regrind, never mixed-grade material — because food safety isn&apos;t a line item we compromise on to hit a price point.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#E6DBC6]">
                    <div className="w-9 h-9 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                      <h.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#1A1D20] leading-snug">{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};
