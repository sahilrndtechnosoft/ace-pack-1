import type { CSSProperties } from 'react';
import fitData from './product-image-fit.json';

interface ImageFit {
  s: number;
  ox: number;
  oy: number;
}

const FITS: Record<string, ImageFit> = fitData;

/** Classes that apply the zoom from productImageFit(); the hover step stays inside the measured margin. */
export const PRODUCT_IMAGE_ZOOM_CLASS =
  'object-cover [transform:scale(var(--fit-scale,1))] group-hover:[transform:scale(calc(var(--fit-scale,1)*1.04))] transition-transform duration-500';

/**
 * Per-photo framing measured by scripts/generate-product-image-fit.mjs: centres the product and
 * zooms it as far as it can go in a 4:3 (or 16:11) box without cutting it off. Photos it has not
 * measured, such as new CMS uploads, are shown unzoomed.
 */
export function productImageFit(src: string | undefined): CSSProperties {
  const fit = src ? FITS[src.split('?')[0]] : undefined;
  if (!fit) return {};
  const position = `${fit.ox}% ${fit.oy}%`;
  return { objectPosition: position, transformOrigin: position, ['--fit-scale' as string]: fit.s };
}
