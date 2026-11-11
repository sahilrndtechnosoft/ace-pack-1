import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { blogPosts, combineBlogs } from '@/lib/data/blogs';
import { BlogCatalogClient } from '@/components/sections/BlogCatalogClient';
import { getCmsBlogs } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Packaging Industry Insights & Blogs | Ace Packaging',
  description: 'Stay updated with the latest food packaging trends, polymer material innovations, PP 05 safety guidelines, and cloud kitchen packaging solutions from Ace Packaging.',
  alternates: {
    canonical: 'https://www.acepack.co.in/blogs',
  },
};

export default async function BlogGridPage() {
  const cmsBlogs = await getCmsBlogs();
  const posts = combineBlogs(blogPosts, cmsBlogs);

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Our Blogs & Insights"
        subtitle="Explore expert perspectives on plastic food container engineering, zero-leak lid designs, microwave safety, and sustainable packaging trends."
        badge="PACKAGING KNOWLEDGE & ARTICLES"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Blogs', href: '/blogs' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <BlogCatalogClient initialPosts={posts} />
        </div>
      </section>
    </div>
  );
}
