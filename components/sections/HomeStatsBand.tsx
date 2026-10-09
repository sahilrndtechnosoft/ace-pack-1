'use client';

import React from 'react';
import CountUp from 'react-countup';
import { Factory, Globe2, Award, Box } from 'lucide-react';
import { Container } from '../ui/Container';

export const HomeStatsBand: React.FC = () => {
  const stats = [
    {
      value: 1500000,
      suffix: '+',
      title: 'Containers Daily',
      subtitle: 'Moulded across dual Daman plants',
      icon: Box,
    },
    {
      value: 1000,
      suffix: '+',
      title: 'Brands Served',
      subtitle: 'QSR chains & cloud kitchens',
      icon: Award,
    },
    {
      value: 12,
      suffix: '+',
      title: 'Export Countries',
      subtitle: 'Middle East, Europe & Americas',
      icon: Globe2,
    },
    {
      value: 15,
      suffix: '+',
      title: 'Years in Moulding',
      subtitle: 'Polymer engineering leadership',
      icon: Factory,
    },
  ];

  return (
    <section className="relative py-12 bg-[#FAF8F4] text-[var(--ace-ink)] border-b border-[#E6DBC6] overflow-hidden">
      <Container className="relative z-10 max-w-[1500px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-5 rounded-2xl bg-white border border-[#E6DBC6] hover:border-[#b99750] shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0 border border-[#b99750]/30">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#b99750] tracking-tight">
                    <CountUp end={stat.value} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                    <span>{stat.suffix}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--ace-ink)] leading-tight">{stat.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 hidden sm:block">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
