'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Tag, Search, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import type { BlogPost } from '@/lib/data/blogs';

interface BlogCatalogClientProps {
  initialPosts: BlogPost[];
}

export const BlogCatalogClient: React.FC<BlogCatalogClientProps> = ({ initialPosts }) => {
  const categories = ['All', 'Takeaway Trends', 'Food Safety Standards', 'Branding & Design'];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  const handleReset = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div>
      {/* Category Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-12 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6DBC6] shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto" role="group" aria-label="Filter blog posts by category">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#cfa144] text-[#1A1D20] shadow-sm font-bold ring-2 ring-[#cfa144]/30'
                    : 'bg-[#FAF8F4] text-gray-700 hover:bg-[#cfa144]/15 hover:text-[#a8812f] border border-[#E6DBC6]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & topics..."
            className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-full pl-10 pr-9 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144] focus:ring-2 focus:ring-[#cfa144]/20 transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter status */}
      {(selectedCategory !== 'All' || searchQuery) && (
        <div className="mb-6 flex items-center justify-between text-xs text-gray-600 bg-[#FAF8F4] border border-[#E6DBC6] rounded-2xl px-4 py-2.5">
          <span>
            Showing <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
            {selectedCategory !== 'All' && <> in &ldquo;{selectedCategory}&rdquo;</>}
            {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-[#a8812f] hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Empty State when no results found */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#E6DBC6] p-8 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#1A1D20] mb-2">No Articles Found</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
            We couldn&apos;t find any articles matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another search term or reset your filters.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#a8812f] text-white text-xs font-bold py-3 px-6 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <span>Reset Search &amp; Filters</span>
          </button>
        </div>
      ) : (
        <>
          {/* Featured Post (first in filtered set) */}
          {featuredPost && (
            <Reveal type="fade-up">
              <div className="mb-14">
                <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#cfa144]/60 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 group">
                  <div className="lg:col-span-7 relative h-72 lg:h-[400px] overflow-hidden bg-slate-900">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <span className="absolute top-4 left-4 bg-[#cfa144] text-[#1A1D20] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                      LATEST INSIGHT
                    </span>
                  </div>

                  <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="inline-flex items-center gap-1 font-bold text-[#a8812f] uppercase tracking-wider">
                          <Tag className="w-3.5 h-3.5" /> {featuredPost.category}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#a8812f]" /> {featuredPost.date}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredPost.slug}`}>
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1A1D20] group-hover:text-[#a8812f] transition-colors leading-tight mb-4">
                          {featuredPost.title}
                        </h2>
                      </Link>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                        {featuredPost.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E6DBC6] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          loading="lazy"
                          decoding="async"
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#cfa144]"
                        />
                        <div className="text-[11px]">
                          <p className="font-bold text-[#1A1D20] leading-none">{featuredPost.author.name}</p>
                          <p className="text-gray-500">{featuredPost.author.role}</p>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider shadow-sm"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* Grid of Remaining Posts */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post, idx) => (
                <Reveal key={post.id} type="fade-up" delay={idx * 0.08}>
                  <article className="bg-white rounded-3xl overflow-hidden border border-[#E6DBC6] hover:border-[#cfa144] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-full">
                    <div>
                      <div className="relative h-56 overflow-hidden bg-slate-900">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                        />
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#a8812f] text-[11px] font-bold px-3 py-1 rounded-full border border-[#E6DBC6] uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#a8812f]" /> {post.date}
                          </span>
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-lg font-bold text-[#1A1D20] group-hover:text-[#a8812f] transition-colors leading-snug mb-3">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-transparent mt-4">
                      <div className="flex items-center justify-between pt-4 border-t border-[#E6DBC6]/60">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            loading="lazy"
                            decoding="async"
                            className="w-7 h-7 rounded-full object-cover border border-[#cfa144]"
                          />
                          <span className="text-xs font-semibold text-gray-700">{post.author.name}</span>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs font-bold text-[#a8812f] group-hover:text-[#1A1D20] transition-colors flex items-center gap-1"
                        >
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
