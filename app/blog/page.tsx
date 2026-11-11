import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { blogPosts, combineBlogs } from '@/lib/data/blogs';
import { BlogCatalogClient } from '@/components/sections/BlogCatalogClient';
import { getCmsBlogs, getPageContent, cmsMetadata } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

const staticMetadata: Metadata = {
  title: 'Packaging Industry Insights & Blogs | Ace Packaging',
  description: 'Stay updated with the latest food packaging trends, polymer material innovations, PP 05 safety guidelines, and cloud kitchen packaging solutions from Ace Packaging.',
  alternates: {
    canonical: 'https://www.acepack.co.in/blogs',
  },
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('blog-old', staticMetadata);
}

export default async function BlogGridPage() {
  const page = await getPageContent('blog');
  const banner = { ...page.content.banner, hidden: page.hidden.includes('banner') };
  const cmsBlogs = await getCmsBlogs();
  const posts = combineBlogs(blogPosts, cmsBlogs);

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {!banner.hidden && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[{ name: 'Blogs', href: '/blogs' }]} />
      )}

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <BlogCatalogClient initialPosts={posts} />
        </div>
      </section>
    </div>
  );
}
