import type { MetadataRoute } from 'next';
import { blogPosts, combineBlogs } from '@/lib/data/blogs';
import { getCmsBlogs } from '@/lib/db/content';
import { getAllLiveCategorySlugs, getAllLiveProductPaths } from '@/lib/data/live-routing';

// Dynamic so new, edited and deleted blog posts are reflected without a rebuild.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = combineBlogs(blogPosts, await getCmsBlogs());
  const baseUrl = 'https://www.acepack.co.in';

  // 1. Static main pages
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/aboutus',
    '/contactus',
    '/capabilities',
    '/blogs',
    '/plastic-food-containers',
    '/oem',
    '/customization',
    '/process',
    '/tools',
    '/quality',
    '/downloads',
    '/gallery',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Categories
  const categoryRoutes: MetadataRoute.Sitemap = getAllLiveCategorySlugs().map((slug) => ({
    url: `${baseUrl}/plastic-food-containers/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // 3. Products (all 68 live routes)
  const productRoutes: MetadataRoute.Sitemap = getAllLiveProductPaths().map((p) => ({
    url: `${baseUrl}/plastic-food-containers/${p.category_slug}/${p.product_slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Blogs (from the database)
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    let date = new Date();
    if (post.date) {
      const parsed = Date.parse(post.date);
      if (!isNaN(parsed)) {
        date = new Date(parsed);
      }
    }
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
