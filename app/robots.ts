import type { MetadataRoute } from 'next';

// Mirrors www.acepack.co.in/robots.txt: blog and page images live under /admin/images/ and must
// stay crawlable; the admin panel and its API stay blocked.
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.acepack.co.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/admin/images/'],
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
