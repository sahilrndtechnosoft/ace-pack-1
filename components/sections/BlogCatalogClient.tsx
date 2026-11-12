'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Tag, Search, ArrowRight, ArrowLeft, X, AlertCircle } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import type { BlogPost } from '@/lib/data/blogs';

interface BlogCatalogClientProps {
  initialPosts: BlogPost[];
}

const POSTS_PER_PAGE = 12;

export const BlogCatalogClient: React.FC<BlogCatalogClientProps> = ({ initialPosts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Categories from the posts themselves, biggest first, with how many posts each has.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    initialPosts.forEach((post) => {
      const cat = post.category?.trim();
      if (cat) counts.set(cat, (counts.get(cat) ?? 0) + 1);
    });
    const sorted = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return sorted.length > 1 ? [['All', initialPosts.length] as const, ...sorted] : [];
  }, [initialPosts]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

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
        (post.author?.name && post.author.name.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedGridPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return gridPosts.slice(start, start + POSTS_PER_PAGE);
  }, [gridPosts, currentPage]);

  const handleReset = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Category Filter & Search Bar */}
      {/* Search row on top, topic chips on their own full-width row below, so neither squeezes the other. */}
      <div className="mb-10 rounded-3xl border border-[#E6DBC6] bg-white shadow-sm sm:mb-12">
        <div className="flex flex-col gap-3 border-b border-[#E6DBC6]/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div>
            <p className="text-sm font-bold text-[#1A1D20]">Browse by topic</p>
            <p className="text-xs text-gray-500">{initialPosts.length} articles on food packaging</p>
          </div>
          <div className="relative w-full sm:w-80">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & topics..."
              aria-label="Search articles"
              className="w-full rounded-full border border-[#E6DBC6] bg-[#FAF8F4] py-2.5 pl-10 pr-9 text-sm text-[#1A1D20] transition-all focus:border-[#cfa144] focus:outline-none focus:ring-2 focus:ring-[#cfa144]/20 [&::-webkit-search-cancel-button]:hidden"
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 hover:text-gray-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {categories.length > 0 && (
        <div
          className="flex items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:px-6 sm:py-4 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter blog posts by category"
        >
          {categories.map(([cat, count]) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border py-1.5 pl-4 pr-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#1A1D20] bg-[#1A1D20] text-white'
                    : 'border-[#E6DBC6] bg-[#FAF8F4] text-gray-700 hover:border-[#cfa144] hover:text-[#1A1D20]'
                }`}
              >
                {cat}
                <span
                  className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive ? 'bg-[#cfa144] text-[#1A1D20]' : 'bg-white text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        )}
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

                  <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
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

                    <div className="pt-4 border-t border-[#E6DBC6] flex flex-wrap items-center justify-between gap-3">
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
                        className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider whitespace-nowrap shadow-sm"
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
          {paginatedGridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedGridPosts.map((post, idx) => (
                <Reveal key={post.id} type="fade-up" delay={Math.min(idx % 3, 2) * 0.08}>
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

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="mt-14 pt-8 border-t border-[#E6DBC6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium order-2 sm:order-1">
                Showing {(currentPage - 1) * POSTS_PER_PAGE + 1}–
                {Math.min(currentPage * POSTS_PER_PAGE, gridPosts.length)} of {gridPosts.length} articles
              </span>

              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#E6DBC6] bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F4] flex items-center gap-1 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    totalPages > 7 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - currentPage) > 2
                  ) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <span key={pageNum} className="px-2 text-xs text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#cfa144] text-[#1A1D20] shadow-sm font-extrabold ring-2 ring-[#cfa144]/30'
                          : 'bg-white border border-[#E6DBC6] text-gray-700 hover:bg-[#FAF8F4]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#E6DBC6] bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F4] flex items-center gap-1 transition-all"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
