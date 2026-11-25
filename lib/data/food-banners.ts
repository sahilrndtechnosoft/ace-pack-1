import { DEFAULT_BANNER_IMAGE } from '@/lib/cms/pages/shared';

// Page banners show containers filled with food, never bare product shots.
export const FOOD_BANNER_IMAGES = [
  DEFAULT_BANNER_IMAGE,
  '/50d728a7-e02c-49d9-b530-58a7db8a6ecc.png',
  '/images/gallery/studio-range.webp',
  '/images/gallery/kitchen-set.webp',
  '/images/oem/oem-food-banner.webp',
  '/images/banners/food-containers-3-4.webp',
  '/images/banners/food-containers-5-0.webp',
  '/images/banners/food-containers-6-7.webp',
] as const;

/** A food banner that stays the same for a given key (e.g. a category slug) across visits. */
export function foodBannerFor(key: string): string {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return FOOD_BANNER_IMAGES[hash % FOOD_BANNER_IMAGES.length];
}
