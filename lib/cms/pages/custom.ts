// Pages an admin creates from "Website Pages → Create New Page". They render at /<slug>
// through app/[slug]/page.tsx using this simple template: a banner plus content blocks.
import { bannerSection, DEFAULT_BANNER_IMAGE } from './shared';

// URL paths already owned by the website's code; custom pages can never use (or delete) these.
export const BUILT_IN_SLUGS = [
  'home', 'admin', 'api', 'uploads', 'about', 'aboutus', 'blog', 'blogs', 'capabilities', 'categories',
  'contact', 'contactus', 'customization', 'downloads', 'events', 'exhibitions', 'faq', 'gallery',
  'industries', 'oem', 'plastic-food-containers', 'privacy', 'process', 'products', 'quality', 'terms',
  'tools', 'robots.txt', 'sitemap.xml', 'favicon.ico',
];

export function isBuiltInSlug(slug: string): boolean {
  return BUILT_IN_SLUGS.includes(slug);
}

export function customPageDef(title: string) {
  return {
    title,
    path: '',
    sections: {
      banner: bannerSection({ badge: 'Ace Packaging', title, subtitle: '', bgImage: DEFAULT_BANNER_IMAGE }),
      content: {
        label: 'Page Content',
        description: 'Blocks of text with optional image, shown top to bottom.',
        content: {
          blocks: [{ heading: '', text: '', image: '', imageAlt: '' }],
          button: { text: '', link: '' },
        },
      },
    },
  };
}

export type CustomPageContent = {
  banner: ReturnType<typeof customPageDef>['sections']['banner']['content'];
  content: ReturnType<typeof customPageDef>['sections']['content']['content'];
};
