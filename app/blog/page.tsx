import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { blogPosts } from '@/lib/data/blogs';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Packaging Industry Insights & Blogs | AcePack Packaging Solutions',
  description: 'Stay updated with the latest food packaging trends, polymer material innovations, PP 05 safety guidelines, and cloud kitchen packaging solutions from AcePack.',
};

export default function BlogGridPage() {
  const categories = ['All', 'Takeaway Trends', 'Food Safety Standards', 'Branding & Design'];

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Our Blogs & Insights"
        subtitle="Explore expert perspectives on plastic food container engineering, zero-leak lid designs, microwave safety, and sustainable packaging trends."
        badge="PACKAGING KNOWLEDGE & ARTICLES"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Blogs', href: '/blog' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-4 rounded-3xl border border-[#E6DBC6] shadow-sm">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    idx === 0
                      ? 'bg-[#cfa144] text-[#1A1D20] shadow-sm'
                      : 'bg-[#FAF8F4] text-gray-700 hover:bg-[#cfa144]/15 hover:text-[#a8812f] border border-[#E6DBC6]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search articles & topics..."
                className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {blogPosts[0] && (
            <div className="mb-14">
              <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#cfa144]/60 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 group">
                <div className="lg:col-span-7 relative h-72 lg:h-[400px] overflow-hidden bg-slate-900">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
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
                        <Tag className="w-3.5 h-3.5" /> {blogPosts[0].category}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#a8812f]" /> {blogPosts[0].date}
                      </span>
                    </div>

                    <Link href={`/blog/${blogPosts[0].slug}`}>
                      <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1A1D20] group-hover:text-[#a8812f] transition-colors leading-tight mb-4">
                        {blogPosts[0].title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {blogPosts[0].summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6DBC6] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={blogPosts[0].author.avatar} alt={blogPosts[0].author.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#cfa144]" />
                      <div className="text-[11px]">
                        <p className="font-bold text-[#1A1D20] leading-none">{blogPosts[0].author.name}</p>
                        <p className="text-gray-500">{blogPosts[0].author.role}</p>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${blogPosts[0].slug}`}
                      className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider shadow-sm"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E6DBC6] hover:border-[#cfa144] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#a8812f] text-[11px] font-bold px-3 py-1 rounded-full border border-[#E6DBC6] uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#a8812f]" /> {post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {post.readTime}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold text-[#1A1D20] group-hover:text-[#a8812f] transition-colors leading-snug mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#6B727A] leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-[#E6DBC6]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover border border-[#cfa144]" />
                    <span className="text-[11px] font-bold text-gray-700">{post.author.name}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a8812f] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
