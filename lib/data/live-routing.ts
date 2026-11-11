import liveRoutingData from './live-routing.json';
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
  const category = getCategoryBySlug(localSlug);
  if (!category) return undefined;
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
  for (const [liveSlug, mapping] of Object.entries(LIVE_PRODUCTS_MAP)) {
    if (mapping.local_category === localCategory && mapping.local_product === localProductSlug) {
      return liveSlug;
    }
  }
  return localProductSlug;
}
