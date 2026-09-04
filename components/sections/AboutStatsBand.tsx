'use client';

import React from 'react';
import CountUp from 'react-countup';
import { Reveal } from '../ui/Reveal';

const STATS = [
  { end: 15, suffix: '+', label: 'Years Legacy' },
  { end: 10000, suffix: '+', separator: ',', label: 'Metric Tons / Year' },
  { end: 25, suffix: '+', label: 'Countries Exported' },
  { end: 99.8, suffix: '%', decimals: 1, label: 'On-Time Dispatch' },
];

export const AboutStatsBand: React.FC = () => {
  return (
    <section className="relative py-14 bg-[#111518] text-white overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-[220px] sm:w-[380px] h-[220px] sm:h-[380px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.13)_0%,rgba(184,152,88,0)_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 w-[220px] sm:w-[400px] h-[220px] sm:h-[400px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.13)_0%,rgba(184,152,88,0)_70%)]" />
      <div className="container-custom relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((stat, idx) => (
          <Reveal key={stat.label} type="fade-up" delay={idx * 0.1}>
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-[#e8cf9e]">
                <CountUp
                  end={stat.end}
                  decimals={stat.decimals ?? 0}
                  separator={stat.separator}
                  duration={2.5}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {stat.suffix}
              </span>
              <p className="text-[11px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
