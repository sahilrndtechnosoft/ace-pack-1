'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { UtensilsCrossed, ChefHat, PartyPopper, Hotel, ShoppingCart, Ship, ArrowUpRight } from 'lucide-react';

const industries = [
  {
    icon: UtensilsCrossed,
    title: 'QSR & Delivery Chains',
    description: 'Leak-proof, stackable containers built for high-volume takeaway and last-mile delivery.'
  },
  {
    icon: ChefHat,
    title: 'Cloud Kitchens',
    description: 'Freezer-to-microwave safe packaging that holds up through multi-brand, multi-order kitchens.'
  },
  {
    icon: PartyPopper,
    title: 'Catering & Events',
    description: 'Bulk-ready portion containers and platters for large-scale event and catering service.'
  },
  {
    icon: Hotel,
    title: 'Hotels & Restaurants',
    description: 'Premium finish IML-branded packaging for in-house dining, banquets, and room service.'
  },
  {
    icon: ShoppingCart,
    title: 'Retail & Supermarkets',
    description: 'Shelf-ready packaging for fresh produce, ready-to-eat meals, and bakery counters.'
  },
  {
    icon: Ship,
    title: 'Export Partners',
    description: 'Container lines built to international food-safety standards for global export orders.'
  }
];

export const IndustriesServed: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 bg-[#FAF8F4] text-[#1A1D20] border-b border-[#E6DBC6]/40 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[560px] h-[280px] sm:h-[560px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.11)_0%,rgba(184,152,88,0)_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1A1D2008_1px,transparent_1px),linear-gradient(to_bottom,#1A1D2008_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

      <Container className="relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#b89858] uppercase tracking-wider mb-3 px-3.5 py-1.5 rounded-full bg-[#b89858]/10 border border-[#b89858]/20">
            Who We Serve
          </span>
          <SplitHeading>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1D20] tracking-tight leading-tight">
              Industries We Serve
            </h2>
          </SplitHeading>
          <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed">
            From cloud kitchens to global export partners, AcePack packaging is engineered for the exact demands of your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {industries.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Reveal key={idx} type="fade-up" delay={idx * 0.07}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full"
                >
                <Link
                  href="/categories"
                  className="relative flex flex-col h-full p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/85 border border-[#E6DBC6] hover:border-[#b89858] shadow-[0_1px_2px_rgba(26,29,32,0.04)] hover:shadow-[0_20px_40px_-16px_rgba(184,152,88,0.35)] transition-all duration-300 group text-left overflow-hidden"
                >
                  <span className="absolute top-4 right-5 text-4xl sm:text-5xl font-extrabold text-[#1A1D20]/[0.04] group-hover:text-[#b89858]/[0.08] transition-colors duration-300 select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#b89858] to-[#8a6f3d] text-white flex items-center justify-center mb-4 sm:mb-5 shadow-md shadow-[#b89858]/25 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#1A1D20] mb-2 group-hover:text-[#b89858] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#b89858] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Explore range <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

      </Container>
    </section>
  );
};
