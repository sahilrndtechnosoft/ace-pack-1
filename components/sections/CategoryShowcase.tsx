'use client';

import React from 'react';
import Link from 'next/link';
import { productCategories } from '@/lib/data/products';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { FlipCarousel } from '../ui/FlipCarousel';
import { ArrowRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#FAF8F4] text-[#1A1D20] border-b border-[#E6DBC6]/40 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 right-1/4 w-[220px] sm:w-[400px] h-[220px] sm:h-[400px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.16)_0%,rgba(184,152,88,0)_70%)]" />
      <Container className="relative z-10">

        {/* Left-Aligned Header matching user instruction */}
        <Reveal type="fade-right">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl text-left">
              <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
                OUR PRODUCT CATEGORIES
              </span>
              <SplitHeading>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1D20] tracking-tight">
                  Premium Packaging Crafted for Every Food
                </h2>
              </SplitHeading>
            </div>

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider shadow hover:shadow-lg hover:shadow-[#cfa144]/30 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 self-start md:self-auto"
            >
              <span>View All {productCategories.length} Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* Caterpillar carousel through every product category */}
        <Reveal type="fade-up">
          <FlipCarousel
            items={productCategories}
            keyField="id"
            visibleCount={{ base: 1, sm: 2, lg: 3 }}
            gap={32}
            renderItem={(category) => (
              <Link
                href={`/categories/${category.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-[#E6DBC6] hover:border-[#cfa144] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#cfa144]/20 flex flex-col justify-between group text-left min-h-[460px] h-full"
              >
                <div>
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                    <img
                      src={category.heroImage}
                      alt={category.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute top-4 left-4 bg-black/80 text-[#a8812f] text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                      {category.subtitleName}
                    </span>
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-extrabold text-[#1A1D20] mb-2 group-hover:text-[#a8812f] transition-colors leading-snug">
                      {category.name}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {category.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-[#a8812f]">
                  <span>{category.products.length} Models Available</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}
          />
        </Reveal>

      </Container>
    </section>
  );
};
