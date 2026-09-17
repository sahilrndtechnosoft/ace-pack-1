import React from 'react';
import { getBlogPostBySlug, getAllBlogSlugs, blogPosts } from '@/lib/data/blogs';
import { productCategories } from '@/lib/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { User, Calendar, Clock, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found | AcePack' };

  return {
    title: `${post.title} | AcePack Packaging Insights`,
    description: post.summary,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Blog Details"
        subtitle={post.title}
        badge="PACKAGING INSIGHTS & ARTICLES"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[
          { name: 'Blogs', href: '/blog' },
          { name: post.title.slice(0, 24) + '...', href: `/blog/${post.slug}` }
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#cfa144]/60 bg-slate-900 h-[340px] sm:h-[450px]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#cfa144] text-[#1A1D20] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {post.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1D20] tracking-tight leading-tight">
                {post.title}
              </h1>

              <div className="bg-white p-5 rounded-2xl border border-[#E6DBC6] shadow-xs flex flex-wrap items-center justify-between gap-6">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Authored by</span>
                    <h4 className="text-xs font-bold text-[#1A1D20]">{post.author.name} <span className="text-gray-400 font-normal">({post.author.role})</span></h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Date Released</span>
                    <h4 className="text-xs font-bold text-[#1A1D20]">{post.date}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Reading Time</span>
                    <h4 className="text-xs font-bold text-[#1A1D20]">{post.readTime}</h4>
                  </div>
                </div>

              </div>

              <div className="bg-[#FAF8F4] p-6 rounded-2xl border-l-4 border-[#cfa144] border-y border-r border-[#E6DBC6]">
                <p className="text-xs sm:text-sm text-[#1A1D20] font-semibold leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
                {post.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}

                <hr className="border-[#E6DBC6] my-6" />

                <h3 className="text-base font-bold text-[#1A1D20] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#a8812f]" />
                  <span>Key Packaging Benefits for Food Manufacturers</span>
                </h3>

                <ul className="space-y-2.5 text-xs text-gray-700 pl-2">
                  {post.takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#cfa144] shrink-0 mt-1.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Tags:</span>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-semibold bg-white text-gray-700 px-3.5 py-1.5 rounded-full border border-[#E6DBC6]">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            <div className="lg:col-span-4 flex flex-col gap-8 sticky top-28">
              
              <div className="bg-white p-6 rounded-3xl border border-[#E6DBC6] shadow-sm">
                <h3 className="text-base font-bold text-[#1A1D20] pb-4 mb-4 border-b border-[#E6DBC6] flex items-center justify-between">
                  <span>Related Posts</span>
                  <span className="w-2 h-2 rounded-full bg-[#cfa144]" />
                </h3>

                <div className="space-y-4">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="flex items-center gap-3.5 group hover:bg-[#FAF8F4] p-2 rounded-2xl transition-colors"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-[#E6DBC6]">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#1A1D20] group-hover:text-[#a8812f] transition-colors leading-snug line-clamp-2 mb-1">
                          {rel.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium block">
                          {rel.date}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-[#cfa144]/60 shadow-md">
                <div className="pb-4 mb-4 border-b border-[#E6DBC6]">
                  <h3 className="text-lg font-bold text-[#1A1D20]">Inquiry Form</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Get in touch with us for bulk container samples & quotes</p>
                </div>

                <form className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Smith"
                      required
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="your@company.com"
                      required
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                      Product of Interest
                    </label>
                    <select className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#cfa144]">
                      <option value="">Choose a product line...</option>
                      {productCategories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your container requirements..."
                      required
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl p-3.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Send Enquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 mt-2">
                    <Lock className="w-3 h-3 text-[#a8812f]" /> Your information is secure & confidential
                  </p>
                </form>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
