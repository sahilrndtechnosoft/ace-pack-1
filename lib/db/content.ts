import { draftMode } from 'next/headers';
import { encodeAssetPath } from '@/lib/asset-url';
import { blogAuthorAvatar, blogCategory } from '@/lib/data/blog-display';
import { getDbPool, initDb } from './index';
import type { BlogPost } from '../data/blogs';
import type { ExhibitionEvent } from '../data/events';
import { productCategories, type ProductCategory, type ProductItem } from '../data/products';
import { CMS_PAGES, SEO_ONLY_PAGES, getCmsPageDef, type CmsPageContent, type CmsPageSlug, type CmsSectionDef } from '../cms/registry';
import { parseContent, withDefaults } from '../cms/merge';
import { siteTextDefaults, type SiteText } from '../cms/site-settings';
import { customPageDef, isBuiltInSlug, type CustomPageContent } from '../cms/pages/custom';
import type { Metadata } from 'next';

export interface PageContentResult<S extends CmsPageSlug> {
  content: CmsPageContent<S>;
  /** Section keys the admin switched off ("Hidden on website"). */
  hidden: string[];
}

/**
 * Published CMS content for a registered page. Every field falls back to the live default
 * when the database is empty or unreachable, so pages always render.
 */
async function isPreviewing(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request (build time)
  }
}

async function loadSections(slug: string, sectionDefs: Record<string, CmsSectionDef>) {
  const rows = new Map<string, { published_content: string; is_enabled: number }>();
  try {
    await initDb();
    // Admin preview (draft mode) shows saved drafts; everyone else sees published content.
    const column = (await isPreviewing()) ? 'draft_content' : 'published_content';
    const [result] = await getDbPool().query(
      `SELECT section_key, ${column} AS published_content, is_enabled FROM sections WHERE page_slug = ?`,
      [slug]
    );
    for (const row of result as Array<{ section_key: string; published_content: string; is_enabled: number }>) {
      rows.set(row.section_key, row);
    }
  } catch (err) {
    console.error(`loadSections("${slug}") error, using fallback content:`, err);
  }

  const content: Record<string, unknown> = {};
  const hidden: string[] = [];
  for (const [key, def] of Object.entries(sectionDefs)) {
    const row = rows.get(key);
    content[key] = withDefaults(def.content, parseContent(row?.published_content));
    if (row && !row.is_enabled) hidden.push(key);
  }
  return { content, hidden };
}

/**
 * Published CMS content for a registered page. Every field falls back to the live default
 * when the database is empty or unreachable, so pages always render.
 */
export async function getPageContent<S extends CmsPageSlug>(slug: S): Promise<PageContentResult<S>> {
  const { content, hidden } = await loadSections(slug, CMS_PAGES[slug].sections);
  return { content: content as CmsPageContent<S>, hidden };
}

export interface CmsPageSeo {
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  robots_index: number;
  is_published: number;
}

export async function getPageSeo(slug: string): Promise<CmsPageSeo | null> {
  try {
    await initDb();
    const [rows] = await getDbPool().query(
      'SELECT slug, title, seo_title, seo_description, og_image, canonical_url, robots_index, is_published FROM pages WHERE slug = ? LIMIT 1',
      [slug]
    );
    return (rows as CmsPageSeo[])[0] ?? null;
  } catch (err) {
    console.error(`getPageSeo("${slug}") error:`, err);
    return null;
  }
}

/** Page metadata: SEO fields filled in under Website Pages → SEO win; empty ones keep the built-in values. */
/** Path of a CMS page (built-in, second URL or custom), used for its default canonical. */
function pagePath(slug: string): string {
  return SEO_ONLY_PAGES[slug]?.path ?? getCmsPageDef(slug)?.path ?? (slug === 'home' ? '/' : `/${slug}`);
}

export async function cmsMetadata(slug: string, given: Metadata): Promise<Metadata> {
  // Every page gets a canonical: the page's own URL unless one is set in code or the CMS.
  const fallback: Metadata = given.alternates?.canonical
    ? given
    : { ...given, alternates: { ...given.alternates, canonical: `https://www.acepack.co.in${pagePath(slug)}` } };
  const seo = await getPageSeo(slug);
  if (!seo) return fallback;
  const title = seo.seo_title?.trim() || fallback.title;
  const description = seo.seo_description?.trim() || fallback.description;
  const ogImage = seo.og_image?.trim();
  const canonical = seo.canonical_url?.trim();
  return {
    ...fallback,
    // Only set keys that have a value: an explicit undefined would wipe the layout's defaults.
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { alternates: { ...fallback.alternates, canonical } } : {}),
    ...(ogImage || seo.seo_title || seo.seo_description
      ? { openGraph: { ...fallback.openGraph, ...(ogImage ? { images: [ogImage] } : {}), title: title ?? undefined, description: description ?? undefined } }
      : {}),
    ...(seo.robots_index === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Content of an admin-created page, or null when it does not exist / is unpublished. */
export async function getCustomPage(slug: string) {
  if (isBuiltInSlug(slug)) return null;
  const seo = await getPageSeo(slug);
  if (!seo || (!seo.is_published && !(await isPreviewing()))) return null;
  const { content, hidden } = await loadSections(slug, customPageDef(seo.title).sections);
  return { seo, content: content as CustomPageContent, hidden };
}

export async function getCmsPage(slug: string) {
  try {
    await initDb();
    const db = getDbPool();
    const [pageRows]: any = await db.query(
      'SELECT id, slug, title, seo_title, seo_description, og_image, canonical_url, is_published FROM pages WHERE slug = ? LIMIT 1',
      [slug]
    );

    const [sectionRows]: any = await db.query(
      `SELECT section_key, title, subtitle, published_content, sort_order
       FROM sections
       WHERE page_slug = ? AND is_enabled = 1
       ORDER BY sort_order ASC`,
      [slug]
    );

    const sections: Record<string, any> = {};
    for (const sec of sectionRows) {
      try {
        sections[sec.section_key] = {
          title: sec.title,
          subtitle: sec.subtitle,
          ...JSON.parse(sec.published_content),
        };
      } catch {
        sections[sec.section_key] = {
          title: sec.title,
          subtitle: sec.subtitle,
          content: sec.published_content,
        };
      }
    }

    return {
      page: pageRows[0] || null,
      sections,
    };
  } catch (err) {
    console.error(`getCmsPage("${slug}") error:`, err);
    return { page: null, sections: {} };
  }
}

/** Shared site wording (Site-wide Settings → Forms, Pop-up, 404 & Labels) with live fallbacks. */
export async function getSiteText(): Promise<SiteText> {
  return withDefaults(siteTextDefaults, (await getCmsSettings()).site_text);
}

export async function getCmsSettings(): Promise<Record<string, any>> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query('SELECT setting_key, setting_value, setting_type FROM site_settings');
    const settings: Record<string, any> = {};
    for (const r of rows) {
      if (r.setting_type === 'boolean') {
        settings[r.setting_key] = r.setting_value === 'true';
      } else if (r.setting_type === 'json') {
        try {
          settings[r.setting_key] = JSON.parse(r.setting_value);
        } catch {
          settings[r.setting_key] = r.setting_value;
        }
      } else {
        settings[r.setting_key] = r.setting_value;
      }
    }
    return settings;
  } catch (err) {
    console.error('getCmsSettings error:', err);
    return {};
  }
}

function mapRowToBlogPost(r: any): BlogPost {
  let content: string[] = [];
  try {
    const parsed = JSON.parse(r.content);
    content = Array.isArray(parsed) ? parsed : [r.content];
  } catch {
    content = typeof r.content === 'string' ? r.content.split('\n\n').filter(Boolean) : [String(r.content || '')];
  }

  let takeaways: string[] = [];
  try {
    const parsed = JSON.parse(r.takeaways);
    takeaways = Array.isArray(parsed) ? parsed : [];
  } catch {
    takeaways = [];
  }

  let tags: string[] = [];
  try {
    const parsed = JSON.parse(r.tags);
    tags = Array.isArray(parsed) ? parsed : [];
  } catch {
    tags = [];
  }

  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: blogCategory(r.category, r.title),
    summary: r.summary || '',
    content,
    takeaways,
    tags,
    image: encodeAssetPath(r.image || '/images/hero-bg-image.jpg'),
    author: {
      name: r.author_name || 'Ace Editorial Team',
      role: r.author_role || 'Packaging Technology Specialist',
      avatar: blogAuthorAvatar(r.author_avatar),
    },
    readTime: r.read_time || '5 min read',
    date: r.date || 'October 2026',
    content_html: r.content_html || undefined,
    meta_title: r.meta_title || undefined,
    meta_description: r.meta_description || undefined,
    canonical: r.canonical || undefined,
    views: r.views || undefined,
  };
}

/** Published blogs, newest first. `null` only when the database can't be reached. */
export async function getCmsBlogs(): Promise<BlogPost[] | null> {
  try {
    await initDb();
    const db = getDbPool();
    // `date` is the display label ("06 Apr, 2023"), so sort on its parsed value.
    const [rows]: any = await db.query(
      "SELECT * FROM blogs WHERE is_published = 1 ORDER BY STR_TO_DATE(date, '%d %b, %Y') DESC, created_at DESC"
    );
    return rows.map(mapRowToBlogPost);
  } catch (err) {
    console.error('getCmsBlogs error:', err);
    return null;
  }
}

/** The post, `null` if it doesn't exist / isn't published, `undefined` if the database can't be reached. */
export async function getCmsBlogBySlug(slug: string): Promise<BlogPost | null | undefined> {
  try {
    await initDb();
    const db = getDbPool();
    // Admin preview (draft mode) can open unpublished articles.
    const publishedOnly = (await isPreviewing()) ? '' : ' AND is_published = 1';
    const [rows]: any = await db.query(`SELECT * FROM blogs WHERE slug = ?${publishedOnly} LIMIT 1`, [slug]);
    if (!rows.length) return null;
    return mapRowToBlogPost(rows[0]);
  } catch (err) {
    console.error(`getCmsBlogBySlug("${slug}") error:`, err);
    return undefined;
  }
}

// Shown for events whose highlights/products haven't been filled in under Events & Expos.
export const DEFAULT_EVENT_HIGHLIGHTS = [
  'Live demonstration of high-speed precision injection moulding',
  'Food-grade virgin PP 05 and IML container samples on display',
  'Direct interaction with Ace Packaging technical and mould tooling engineers',
];
export const DEFAULT_EVENT_FOCUS_PRODUCTS = [
  { name: 'IML Custom Branded Containers', slug: 'custom-iml', desc: 'Photorealistic in-mould labelling fused directly into polymer.' },
  { name: 'RE Series Bento Compartments', slug: 're-series', desc: 'Perimeter snap seal preventing curry migration between sections.' },
];

function eventHighlights(r: any): string[] {
  const list = safeParseJson<unknown>(r.highlights, null);
  const clean = Array.isArray(list) ? list.filter((h): h is string => typeof h === 'string' && h.trim() !== '') : [];
  return clean.length ? clean : DEFAULT_EVENT_HIGHLIGHTS;
}

function eventFocusProducts(r: any): ExhibitionEvent['focusProducts'] {
  const list = safeParseJson<unknown>(r.focus_products, null);
  const clean = Array.isArray(list)
    ? list
        .filter((p): p is { name: string; slug?: string; desc?: string } => !!p && typeof p === 'object' && typeof (p as { name?: unknown }).name === 'string' && (p as { name: string }).name.trim() !== '')
        .map((p) => ({ name: p.name, slug: p.slug || '', desc: p.desc || '' }))
    : [];
  return clean.length ? clean : DEFAULT_EVENT_FOCUS_PRODUCTS;
}

function mapRowToExhibitionEvent(r: any): ExhibitionEvent {
  let fullStory: string[] = [];
  if (r.full_desc) {
    try {
      const parsed = JSON.parse(r.full_desc);
      fullStory = Array.isArray(parsed) ? parsed : [r.full_desc];
    } catch {
      fullStory = typeof r.full_desc === 'string' ? r.full_desc.split('\n\n').filter(Boolean) : [];
    }
  }

  let gallery: string[] = [];
  if (r.gallery) {
    try {
      const parsed = JSON.parse(r.gallery);
      gallery = Array.isArray(parsed) ? parsed : [];
    } catch {
      gallery = [];
    }
  }

  const locationParts = (r.location || 'Daman, India').split(',');
  const venue = locationParts[0]?.trim() || r.location;
  const city = locationParts[1]?.trim() || 'Daman';

  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    shortTitle: r.title.length > 24 ? r.title.slice(0, 24) + '...' : r.title,
    label: (r.category || 'EXHIBITION').toUpperCase(),
    category: (['expo', 'summit', 'experience', 'showcase'].includes(r.category)
      ? r.category
      : 'expo') as any,
    status: r.is_featured ? 'featured' : 'upcoming',
    date: r.date || '2026',
    year: r.date?.match(/\d{4}/)?.[0] || '2026',
    location: r.location || 'India',
    venue,
    city,
    country: 'India',
    booth: r.booth || undefined,
    image: r.image || '/images/hero-bg-image.jpg',
    description: r.short_desc || '',
    fullStory: fullStory.length > 0 ? fullStory : undefined,
    highlights: eventHighlights(r),
    focusProducts: eventFocusProducts(r),
  };
}

export async function getCmsEvents(): Promise<ExhibitionEvent[]> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM events WHERE is_published = 1 ORDER BY is_featured DESC, created_at DESC'
    );
    return rows.map(mapRowToExhibitionEvent);
  } catch (err) {
    console.error('getCmsEvents error:', err);
    return [];
  }
}

export async function getCmsEventBySlug(slug: string): Promise<ExhibitionEvent | null> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM events WHERE slug = ? AND is_published = 1 LIMIT 1',
      [slug]
    );
    if (!rows.length) return null;
    return mapRowToExhibitionEvent(rows[0]);
  } catch (err) {
    console.error(`getCmsEventBySlug("${slug}") error:`, err);
    return null;
  }
}

export async function getCmsDownloads() {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM downloads WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC'
    );
    return rows;
  } catch (err) {
    console.error('getCmsDownloads error:', err);
    return [];
  }
}

function safeParseJson<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function mapRowToProduct(r: any): ProductItem {
  return {
    id: r.id,
    name: r.name,
    capacity: r.capacity || '',
    product_slug: r.product_slug,
    material: r.material || 'Virgin PP 05 Food Grade',
    quality: r.quality || 'Export Grade Food Safe',
    packaging: r.packaging || '',
    image: r.image || '',
    blankImage: r.blank_image || undefined,
    lockingFoodImage: r.locking_food_image || undefined,
    description: r.description || undefined,
    features: safeParseJson<string[]>(r.features, []),
    dimensions: safeParseJson<any>(r.dimensions, undefined),
    applications: safeParseJson<string[]>(r.applications, []),
    specs: safeParseJson<any[]>(r.specs, []),
    varieties: safeParseJson<any[] | undefined>(r.varieties, undefined),
    defaultVariety: r.default_variety || undefined,
  };
}

function mapRowToCategory(r: any, products: ProductItem[] = []): ProductCategory {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    subtitleName: r.subtitle_name || '',
    shortDescription: r.short_description || '',
    description: r.description || '',
    heroImage: r.hero_image || '',
    features: safeParseJson<string[]>(r.features, []),
    gallery: safeParseJson<string[]>(r.gallery, []),
    faqs: safeParseJson<any[]>(r.faqs, []),
    products,
  };
}

export async function getCmsCategories(): Promise<ProductCategory[]> {
  try {
    await initDb();
    const db = getDbPool();
    const [catRows]: any = await db.query(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, created_at ASC'
    );

    if (!catRows || catRows.length === 0) {
      return productCategories;
    }

    const [prodRows]: any = await db.query(
      'SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order ASC, created_at ASC'
    );

    const prodsByCat: Record<string, ProductItem[]> = {};
    for (const pr of prodRows) {
      if (!prodsByCat[pr.category_slug]) prodsByCat[pr.category_slug] = [];
      prodsByCat[pr.category_slug].push(mapRowToProduct(pr));
    }

    return catRows.map((cr: any) => mapRowToCategory(cr, prodsByCat[cr.slug] || []));
  } catch (err) {
    console.error('getCmsCategories error:', err);
    return productCategories;
  }
}

export async function getCmsCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  try {
    await initDb();
    const db = getDbPool();
    const [catRows]: any = await db.query(
      'SELECT * FROM categories WHERE slug = ? AND is_active = 1 LIMIT 1',
      [slug]
    );

    if (!catRows || catRows.length === 0) {
      return productCategories.find((c) => c.slug === slug) || null;
    }

    const [prodRows]: any = await db.query(
      'SELECT * FROM products WHERE category_slug = ? AND is_active = 1 ORDER BY sort_order ASC, created_at ASC',
      [slug]
    );

    const products = (prodRows || []).map(mapRowToProduct);
    return mapRowToCategory(catRows[0], products);
  } catch (err) {
    console.error(`getCmsCategoryBySlug("${slug}") error:`, err);
    return productCategories.find((c) => c.slug === slug) || null;
  }
}

export async function getCmsProductBySlugs(
  categorySlug: string,
  productSlug: string
): Promise<{ category: ProductCategory; product: ProductItem } | null> {
  try {
    await initDb();
    const db = getDbPool();

    const [prodRows]: any = await db.query(
      'SELECT * FROM products WHERE category_slug = ? AND product_slug = ? AND is_active = 1 LIMIT 1',
      [categorySlug, productSlug]
    );

    const category = await getCmsCategoryBySlug(categorySlug);
    if (!category) return null;

    if (prodRows && prodRows.length > 0) {
      return {
        category,
        product: mapRowToProduct(prodRows[0]),
      };
    }

    // Static fallback
    const staticProd = category.products.find((p) => p.product_slug === productSlug);
    if (staticProd) {
      return { category, product: staticProd };
    }

    return null;
  } catch (err) {
    console.error(`getCmsProductBySlugs("${categorySlug}", "${productSlug}") error:`, err);
    const cat = productCategories.find((c) => c.slug === categorySlug);
    if (!cat) return null;
    const prod = cat.products.find((p) => p.product_slug === productSlug);
    if (!prod) return null;
    return { category: cat, product: prod };
  }
}

export async function getCmsAllProducts(): Promise<(ProductItem & { category_slug: string; category_name: string })[]> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_slug = c.slug
      WHERE p.is_active = 1
      ORDER BY c.sort_order ASC, p.sort_order ASC
    `);

    if (!rows || rows.length === 0) {
      return productCategories.flatMap((c) =>
        c.products.map((p) => ({
          ...p,
          category_slug: c.slug,
          category_name: c.name,
        }))
      );
    }

    return rows.map((r: any) => ({
      ...mapRowToProduct(r),
      category_slug: r.category_slug,
      category_name: r.category_name || r.category_slug,
    }));
  } catch (err) {
    console.error('getCmsAllProducts error:', err);
    return productCategories.flatMap((c) =>
      c.products.map((p) => ({
        ...p,
        category_slug: c.slug,
        category_name: c.name,
      }))
    );
  }
}
