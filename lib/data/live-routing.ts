import liveRoutingData from './live-routing.json';
import type { Metadata } from 'next';
import liveCatalog from './acepack-live-catalog.json';

export interface LiveSeo {
  title: string;
  description: string;
  canonical: string;
  h1: string;
}

/** Title, meta description, canonical and H1 of a www.acepack.co.in page, as crawled. */
export function getLiveSeo(path: string): LiveSeo | undefined {
  return (liveCatalog as Record<string, LiveSeo>)[path];
}

/** Every live category and product URL, exactly as the live sitemaps list them. */
export function getLiveCatalogPaths(): string[] {
  return Object.keys(liveCatalog).filter((p) => p.startsWith('/plastic-food-containers/'));
}
import {
  productCategories,
  getCategoryBySlug,
  getProductBySlugs,
  type ProductCategory,
  type ProductItem,
} from './products';

export interface LiveCategoryMeta {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  local_category: string;
  /** Live categories that combine several local lines (Glass Series = 80-Dia + 90-Dia). */
  extra_local_categories?: string[];
}

export const LIVE_CATEGORIES: LiveCategoryMeta[] = liveRoutingData.categories;

export const LIVE_PRODUCTS_MAP: Record<string, { local_category: string; local_product: string }> =
  liveRoutingData.products;

export function getAllLiveCategorySlugs(): string[] {
  return LIVE_CATEGORIES.map((c) => c.slug);
}

export function getAllLiveProductPaths(): { category_slug: string; product_slug: string }[] {
  const paths: { category_slug: string; product_slug: string }[] = [];
  for (const [prodSlug, mapping] of Object.entries(LIVE_PRODUCTS_MAP)) {
    // determine matching live category
    const cat = LIVE_CATEGORIES.find((c) => c.local_category === mapping.local_category);
    const catSlug = cat ? cat.slug : mapping.local_category;
    paths.push({
      category_slug: catSlug,
      product_slug: prodSlug,
    });
  }
  return paths;
}

export function resolveLiveCategory(
  categorySlug: string
): { meta: LiveCategoryMeta; category: ProductCategory } | undefined {
  const meta = LIVE_CATEGORIES.find((c) => c.slug === categorySlug);
  const localSlug = meta ? meta.local_category : categorySlug;
  const base = getCategoryBySlug(localSlug);
  if (!base) return undefined;
  const extra = (meta?.extra_local_categories ?? []).flatMap((slug) => getCategoryBySlug(slug)?.products ?? []);
  const category = extra.length ? { ...base, products: [...base.products, ...extra] } : base;
  return {
    meta: meta || {
      slug: categorySlug,
      name: category.name,
      subtitle: category.subtitleName,
      description: category.description,
      local_category: category.slug,
    },
    category,
  };
}

export function resolveLiveProduct(
  categorySlug: string,
  productSlug: string
): { category: ProductCategory; product: ProductItem; liveMeta?: LiveCategoryMeta } | undefined {
  const mapping = LIVE_PRODUCTS_MAP[productSlug];
  if (mapping) {
    const res = getProductBySlugs(mapping.local_category, mapping.local_product);
    if (res) {
      const liveMeta = LIVE_CATEGORIES.find((c) => c.slug === categorySlug);
      return { ...res, liveMeta };
    }
  }

  // fallback to direct local category/product resolution
  const catRes = resolveLiveCategory(categorySlug);
  if (catRes) {
    const res = getProductBySlugs(catRes.category.slug, productSlug);
    if (res) return { ...res, liveMeta: catRes.meta };
  }
  return undefined;
}

export function getLiveProductSlug(localCategory: string, localProductSlug: string): string {
  // Products of a merged line (e.g. Glass 90-Dia inside Glass Series) are matched by product slug alone.
  for (const [liveSlug, mapping] of Object.entries(LIVE_PRODUCTS_MAP)) {
    if (mapping.local_product === localProductSlug && (mapping.local_category === localCategory || LIVE_CATEGORIES.some((c) => c.local_category === localCategory && c.extra_local_categories?.includes(mapping.local_category)))) {
      return liveSlug;
    }
  }
  return localProductSlug;
}

const SITE = 'https://www.acepack.co.in';

/** Canonical URL for a local category: its live /plastic-food-containers/... page when one exists. */
export function canonicalCategoryUrl(localCategory: string): string {
  const live = LIVE_CATEGORIES.find((c) => c.local_category === localCategory || c.extra_local_categories?.includes(localCategory));
  return live ? `${SITE}/plastic-food-containers/${live.slug}` : `${SITE}/categories/${localCategory}`;
}

/** Canonical URL for a local product: its live product page when one exists. */
export function canonicalProductUrl(localCategory: string, localProduct: string): string {
  const liveSlug = getLiveProductSlug(localCategory, localProduct);
  const live = LIVE_CATEGORIES.find((c) => c.local_category === localCategory || c.extra_local_categories?.includes(localCategory));
  // Live and local slugs can be identical (Elite), so check the mapping rather than comparing slugs.
  return live && LIVE_PRODUCTS_MAP[liveSlug]
    ? `${SITE}/plastic-food-containers/${live.slug}/${liveSlug}`
    : `${SITE}/categories/${localCategory}/${localProduct}`;
}

/** Use the live page's title, description and canonical (SEO continuity); anything else stays. */
export function withLiveSeo(path: string, meta: Metadata): Metadata {
  const live = getLiveSeo(path);
  if (!live) return meta;
  return {
    ...meta,
    title: live.title || meta.title,
    description: live.description || meta.description,
    alternates: { ...meta.alternates, canonical: live.canonical || `${SITE}${path === '/' ? '/' : path}` },
  };
}
