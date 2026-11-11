// Single map of every CMS-managed website page and the sections it shows, in display order.
// The admin "Website Pages" screen and the public pages both read from here, so a section key
// always means the same thing on both sides. Content values are the live fallback content.
import { customPageDef, isBuiltInSlug } from './pages/custom';
import { homePage } from './pages/home';
import { aboutPage } from './pages/about';
import { productsPage, categoriesPage } from './pages/catalogue';
import { qualityPage } from './pages/quality';
import { processPage } from './pages/process';
import { faqPage, galleryPage, capabilitiesPage } from './pages/info';
import { privacyPage, termsPage } from './pages/legal';
import { contactPage, downloadsPage, blogPage } from './pages/contact-downloads-blog';
import { oemPage, customizationPage } from './pages/oem';
import { industriesPage } from './pages/industries';
import { toolsPage } from './pages/tools';

export interface CmsSectionDef {
  label: string;
  description?: string;
  content: Record<string, unknown>;
}

export interface CmsPageDef {
  title: string;
  path: string;
  sections: Record<string, CmsSectionDef>;
}

/**
 * Second URLs that show another page's content but keep their own Google title/description
 * (kept from the previous website for SEO). They get their own "SEO & Settings" entry.
 */
export const SEO_ONLY_PAGES: Record<string, { title: string; path: string; contentSlug: string }> = {
  aboutus: { title: 'About Us (/aboutus)', path: '/aboutus', contentSlug: 'about' },
  contactus: { title: 'Contact Us (/contactus)', path: '/contactus', contentSlug: 'contact' },
  'plastic-food-containers': { title: 'Plastic Food Containers (/plastic-food-containers)', path: '/plastic-food-containers', contentSlug: 'categories' },
  'blog-old': { title: 'Blog (/blog)', path: '/blog', contentSlug: 'blog' },
};

/** Lists shown on a page but edited in their own admin module, so the page editor can point there. */
export const MANAGED_ELSEWHERE: Record<string, { text: string; href: string; linkText: string }> = {
  products: { text: 'The products shown on this page are managed in Product Catalogue.', href: '/admin/products', linkText: 'Open Products' },
  categories: { text: 'The product lines shown on this page are managed in Product Catalogue.', href: '/admin/categories', linkText: 'Open Categories' },
  downloads: { text: 'The catalogues and files on this page are managed in Download Center.', href: '/admin/downloads', linkText: 'Open Download Center' },
  blog: { text: 'The articles on this page are managed in Blog Management.', href: '/admin/blogs', linkText: 'Open Blog Management' },
  events: { text: 'This page shows your exhibitions and events, which are managed in Events & Expos.', href: '/admin/events', linkText: 'Open Events & Expos' },
};

export const CMS_PAGES = {
  home: homePage,
  about: aboutPage,
  products: productsPage,
  categories: categoriesPage,
  quality: qualityPage,
  process: processPage,
  faq: faqPage,
  gallery: galleryPage,
  capabilities: capabilitiesPage,
  contact: contactPage,
  downloads: downloadsPage,
  blog: blogPage,
  industries: industriesPage,
  oem: oemPage,
  customization: customizationPage,
  tools: toolsPage,
  privacy: privacyPage,
  terms: termsPage,
} satisfies Record<string, CmsPageDef>;

export type CmsPageSlug = keyof typeof CMS_PAGES;

type SectionsOf<S extends CmsPageSlug> = (typeof CMS_PAGES)[S]['sections'];

export type CmsPageContent<S extends CmsPageSlug> = {
  [K in keyof SectionsOf<S>]: SectionsOf<S>[K] extends { content: infer C } ? C : never;
};

/** Built-in pages come from the registry; any other slug is an admin-created custom page. */
export function getCmsPageDef(slug: string, title = slug): CmsPageDef | undefined {
  const builtIn = (CMS_PAGES as Record<string, CmsPageDef>)[slug];
  if (builtIn) return builtIn;
  return isBuiltInSlug(slug) ? undefined : { ...customPageDef(title), path: `/${slug}` };
}
