'use client';

import React from 'react';
import Link from 'next/link';
import { blogPosts } from '@/lib/data/blogs';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="relative py-20 bg-[#FAF8F4] text-[#1A1D20] border-b border-[#E6DBC6]/40 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/3 w-[220px] sm:w-[420px] h-[220px] sm:h-[420px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.16)_0%,rgba(184,152,88,0)_70%)]" />
      <Container className="relative z-10">

        {/* Left-Aligned Header */}
        <Reveal type="fade-right">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl text-left">
              <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
                OUR BLOG & INSIGHTS
              </span>
              <SplitHeading>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
                  Latest Food Packaging Insights & News
                </h2>
              </SplitHeading>
            </div>

            <Link
              href="/blog"
              className="text-xs font-bold text-[#a8812f] hover:underline uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post, idx) => (
            <Reveal key={post.id} type="fade-up" delay={idx * 0.15}>
              <Link
                href={`/blog/${post.slug}`}
                className="bg-white rounded-3xl overflow-hidden border border-[#E6DBC6] hover:border-[#cfa144] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#cfa144]/20 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute top-4 left-4 bg-black/85 text-[#a8812f] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#a8812f]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#a8812f]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1A1D20] mb-3 group-hover:text-[#a8812f] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#a8812f]">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

      </Container>
    </section>
  );
};
