'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { Building2 } from 'lucide-react';

// Placeholder trust-strip tiles — swap the `name` values for real client
// wordmarks/logo images once they're supplied by the business.
const partnersRowA = [
  'Cloud Kitchen Co.',
  'Fresh Bites QSR',
  'Urban Eats Group',
  'Spice Route Foods',
  'Coastal Exports Ltd.'
];

const partnersRowB = [
  'Daily Delight Caterers',
  'Green Leaf Retail',
  'Metro Food Court',
  'Harbor Hotel Group',
  'Sunrise Bakery Chain'
];

const MarqueeRow: React.FC<{ items: string[]; reverse?: boolean }> = ({ items, reverse }) => {
  const loop = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex w-max gap-3 sm:gap-4 hover:[animation-play-state:paused] ${
          reverse ? 'animate-[logo-marquee-reverse_26s_linear_infinite]' : 'animate-[logo-marquee_26s_linear_infinite]'
        }`}
      >
        {loop.map((name, idx) => (
          <div
            key={idx}
            className="shrink-0 flex items-center gap-2.5 bg-white/[0.06] border border-white/10 hover:border-[#b89858]/70 hover:bg-white/[0.07] rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 transition-colors duration-300"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#b89858] to-[#8a6f3d] text-white flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wide whitespace-nowrap">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ClientLogos: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-20 bg-[#111518] text-white border-b border-white/10 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.09)_0%,rgba(184,152,88,0)_70%)]" />

      <Container className="relative z-10">
        <Reveal type="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#b89858] uppercase tracking-wider mb-3 px-3.5 py-1.5 rounded-full bg-[#b89858]/10 border border-[#b89858]/25">
              Trusted At Scale
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Trusted by 500+ Businesses Across India
            </h2>
          </div>
        </Reveal>
      </Container>

      {/* Two independently-scrolling rows moving opposite directions —
          a widely used pattern for a livelier, layered trust strip. */}
      <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
        <MarqueeRow items={partnersRowA} />
        <MarqueeRow items={partnersRowB} reverse />
      </div>
    </section>
  );
};
