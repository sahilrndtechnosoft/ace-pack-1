'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { FlipCarousel } from '../ui/FlipCarousel';
import { Star, Quote } from 'lucide-react';

// Placeholder testimonials pending real client quotes — swap `quote`,
// `name`, and `role` for verified customer feedback before this section
// goes live.
interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: 'Zero leakage complaints since we switched to AcePack\'s hinge cups — the rim seal genuinely holds up through our entire delivery radius.',
    name: 'Operations Head',
    role: 'Cloud Kitchen Chain, Mumbai'
  },
  {
    id: 't2',
    quote: 'Consistent wall thickness across every batch, and their team never misses a production timeline even during our festive-season order spikes.',
    name: 'Procurement Manager',
    role: 'QSR Franchise Group, Delhi NCR'
  },
  {
    id: 't3',
    quote: 'The custom IML branding came out sharper than our previous supplier, and the containers survive freezer-to-microwave without a single crack.',
    name: 'Brand & Packaging Lead',
    role: 'Retail Food Brand, Bengaluru'
  },
  {
    id: 't4',
    quote: 'Bulk catering orders used to be our biggest packaging headache — AcePack\'s portion containers now go out stacked and leak-free every single time.',
    name: 'Catering Director',
    role: 'Event Catering Co., Pune'
  },
  {
    id: 't5',
    quote: 'Their export-grade containers cleared every food-safety audit on the first pass. Documentation and consistency were spot on.',
    name: 'Supply Chain Head',
    role: 'Export Partner, Ahmedabad'
  },
  {
    id: 't6',
    quote: 'We switched three outlets over in a single month — reorder turnaround has been faster than any vendor we worked with before.',
    name: 'Franchise Owner',
    role: 'Retail Food Brand, Chennai'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 bg-[#FAF8F4] text-[#1A1D20] border-b border-[#E6DBC6]/40 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-10 -right-16 w-[240px] sm:w-[440px] h-[240px] sm:h-[440px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.16)_0%,rgba(184,152,88,0)_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-10 w-[200px] sm:w-[360px] h-[200px] sm:h-[360px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.13)_0%,rgba(184,152,88,0)_70%)]" />

      <Container className="relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#a8812f] uppercase tracking-wider mb-3 px-3.5 py-1.5 rounded-full bg-[#cfa144]/10 border border-[#cfa144]/20">
            What Our Clients Say
          </span>
          <SplitHeading>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1D20] tracking-tight leading-tight">
              Trusted by Food Brands Across India
            </h2>
          </SplitHeading>
        </div>

        <Reveal type="fade-up">
          <FlipCarousel
            items={testimonials}
            keyField="id"
            visibleCount={{ base: 1, sm: 2, lg: 3 }}
            gap={24}
            renderItem={(t) => (
              <div className="group relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#E6DBC6] hover:border-transparent shadow-[0_1px_2px_rgba(26,29,32,0.04)] hover:shadow-[0_24px_48px_-20px_rgba(184,152,88,0.4)] transition-all duration-300 flex flex-col overflow-hidden">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#cfa144] via-[#e0c081] to-[#cfa144] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                />

                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#cfa144]/15 to-[#cfa144]/5 text-[#a8812f] flex items-center justify-center mb-4 border border-[#cfa144]/20">
                  <Quote className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#cfa144] text-[#a8812f]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-6 flex-1">
                  &quot;{t.quote}&quot;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E6DBC6]">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 p-[2px] bg-gradient-to-br from-[#cfa144] to-[#e0c081]">
                    <div className="w-full h-full rounded-full bg-white text-[#a8812f] flex items-center justify-center font-extrabold text-sm">
                      {t.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1A1D20]">{t.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            )}
          />
        </Reveal>

      </Container>
    </section>
  );
};
