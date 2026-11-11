import React from 'react';
import { getBlogPostBySlug, getAllBlogSlugs, blogPosts, combineBlogs } from '@/lib/data/blogs';
import { getCmsBlogBySlug, getCmsBlogs, getSiteText } from '@/lib/db/content';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { User, Calendar, Clock, Eye, CheckCircle2 } from 'lucide-react';
import { BlogInquiryForm } from '@/components/sections/BlogInquiryForm';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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
  const staticPost = getBlogPostBySlug(slug);
  const cmsPost = await getCmsBlogBySlug(slug);
  const post = cmsPost ? { ...staticPost, ...cmsPost } : staticPost;
  if (!post) return { title: 'Article Not Found | Ace Packaging' };

  const title = post.meta_title || `${post.title} | Ace Packaging`;
  const description = post.meta_description || post.summary;
  const canonicalUrl = post.canonical || `https://www.acepack.co.in/blog/${post.slug}`;
  const ogImage = post.og_image || post.image;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.og_title || title,
      description: post.og_description || description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.date,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.og_title || title,
      description: post.og_description || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const L = (await getSiteText()).labels;
  const { slug } = await params;
  const staticPost = getBlogPostBySlug(slug);
  const cmsPost = await getCmsBlogBySlug(slug);
  const post = cmsPost
    ? {
        ...staticPost,
        ...cmsPost,
        content_html: cmsPost.content_html || staticPost?.content_html,
        meta_title: cmsPost.meta_title || staticPost?.meta_title,
        meta_description: cmsPost.meta_description || staticPost?.meta_description,
        canonical: cmsPost.canonical || staticPost?.canonical,
        views: cmsPost.views || staticPost?.views,
      }
    : staticPost;

  if (!post) {
    notFound();
  }

  const allBlogs = await getCmsBlogs();
  const pool = combineBlogs(blogPosts, allBlogs);
  const relatedPosts = pool.filter((p) => p.slug !== slug).slice(0, 4);

  const canonicalUrl = post.canonical || `https://www.acepack.co.in/blog/${post.slug}`;
  const imageUrl = post.image.startsWith('http')
    ? post.image
    : `https://www.acepack.co.in${post.image}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.summary,
    image: imageUrl,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Ace Packaging',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ace Packaging',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.acepack.co.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageBanner
        title="Blog Details"
        subtitle={post.title}
        badge="PACKAGING INSIGHTS & ARTICLES"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[
          { name: 'Blogs', href: '/blogs' },
          { name: post.title.slice(0, 24) + '...', href: `/blog/${post.slug}` },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Featured Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#cfa144]/60 bg-slate-900 h-[340px] sm:h-[450px]">
                <img
                  src={post.image}
                  alt={post.image_alt || post.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#cfa144] text-[#1A1D20] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1D20] tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Metadata Bar */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DBC6] shadow-xs flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                      {L.blogAuthoredBy}
                    </span>
                    <h4 className="text-xs font-bold text-[#1A1D20]">
                      {post.author.name}{' '}
                      <span className="text-gray-400 font-normal">({post.author.role})</span>
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                      {L.blogDateReleased}
                    </span>
                    <h4 className="text-xs font-bold text-[#1A1D20]">{post.date}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                      {L.blogReadingTime}
                    </span>
                    <h4 className="text-xs font-bold text-[#1A1D20]">{post.readTime}</h4>
                  </div>
                </div>

                {post.views && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                        Views
                      </span>
                      <h4 className="text-xs font-bold text-[#1A1D20]">{post.views}</h4>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Lead */}
              {post.summary && (
                <div className="bg-[#FAF8F4] p-6 rounded-2xl border-l-4 border-[#cfa144] border-y border-r border-[#E6DBC6]">
                  <p className="text-xs sm:text-sm text-[#1A1D20] font-semibold leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              )}

              {/* Post Body (Raw HTML from Acepack preserving original formatting) */}
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm text-sm sm:text-base text-gray-700 leading-relaxed">
                {post.content_html ? (
                  <div
                    className="space-y-4 [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#1A1D20] [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#1A1D20] [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5 [&>ul]:my-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1.5 [&>ol]:my-4 [&>a]:text-[#a8812f] [&>a]:font-semibold hover:[&>a]:underline [&>strong]:font-bold [&>strong]:text-[#1A1D20] [&>table]:w-full [&>table]:border [&>table]:border-[#E6DBC6] [&>table_th]:bg-[#FAF8F4] [&>table_th]:p-2.5 [&>table_td]:p-2.5 [&>table_td]:border-t [&>table_td]:border-[#E6DBC6]"
                    dangerouslySetInnerHTML={{ __html: post.content_html }}
                  />
                ) : (
                  <div className="space-y-6 text-xs sm:text-sm">
                    {post.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {/* Key takeaways if present */}
                {post.takeaways && post.takeaways.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-[#E6DBC6]">
                    <h3 className="text-base font-bold text-[#1A1D20] flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-[#a8812f]" />
                      <span>{L.blogBenefitsHeading}</span>
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
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
                    Tags:
                  </span>
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-white text-gray-700 px-3.5 py-1.5 rounded-full border border-[#E6DBC6]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8 sticky top-28">
              <div className="bg-white p-6 rounded-3xl border border-[#E6DBC6] shadow-sm">
                <h3 className="text-base font-bold text-[#1A1D20] pb-4 mb-4 border-b border-[#E6DBC6] flex items-center justify-between">
                  <span>{L.blogRelatedPosts}</span>
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
                  <h3 className="text-lg font-bold text-[#1A1D20]">{L.blogInquiryHeading}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {L.blogInquiryText}
                  </p>
                </div>

                <BlogInquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
