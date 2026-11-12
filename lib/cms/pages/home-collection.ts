// Home page "collection" showcase: one stacked panel per product series.
import { products } from '@/components/experience/config';

const productVariants: Record<string, { label: string; src: string }[]> = {
  're-series': [
    { label: 'Hero View', src: '/images/products/re-series/re-series-hero.webp' },
    { label: '2-Comp Bento', src: '/images/products/re-series/ap-re-232.webp' },
    { label: 'AP-RE-48', src: '/images/products/re-series/ap-re-48.webp' },
    { label: 'AP-RE-32', src: '/images/products/re-series/ap-re-32.webp' },
    { label: 'AP-RE-24', src: '/images/products/re-series/ap-re-24.webp' },
  ],
  'ro-series': [
    { label: 'Hero View', src: '/images/products/ro-series/ro-series-hero.webp' },
    { label: 'AP-RO-48', src: '/images/products/ro-series/ap-ro-48.webp' },
    { label: 'AP-RO-32', src: '/images/products/ro-series/ap-ro-32.webp' },
    { label: 'AP-RO-24', src: '/images/products/ro-series/ap-ro-24.webp' },
  ],
  'hinge-cups': [
    { label: 'Hero View', src: '/images/products/hinge/hinge-cups-hero.webp' },
    { label: '100ml', src: '/images/products/hinge/hinge-100ml.webp' },
    { label: '50ml', src: '/images/products/hinge/hinge-50ml.webp' },
    { label: '25ml', src: '/images/products/hinge/hinge-25ml.webp' },
  ],
  'deli-series': [
    { label: 'Hero View', src: '/images/products/deli/deli-series-hero.webp' },
    { label: '32oz', src: '/images/products/deli/deli-32oz.webp' },
    { label: '16oz', src: '/images/products/deli/deli-16oz.webp' },
  ],
  'sweet-box': [
    { label: 'Hero View', src: '/images/products/sweet-box/sweet-box-hero.webp' },
    { label: '500g', src: '/images/products/sweet-box/sweetbox-500g.webp' },
    { label: '250g', src: '/images/products/sweet-box/sweetbox-250g.webp' },
  ],
  'flat-containers': [
    { label: 'Hero View', src: '/images/products/flat/flat-containers-hero.webp' },
    { label: '1000ml', src: '/images/products/flat/flat-1000ml.webp' },
    { label: '650ml', src: '/images/products/flat/flat-650ml.webp' },
  ],
};

export const homeCollection = {
  chips: ['−20°C to +120°C Safe', 'Hermetic Snap-Lock Rim', '100% Virgin Food-Grade'],
  pairingLabel: 'Recommended Culinary Pairing',
  samplesButton: { text: 'Request Samples', link: '/contact' },
  formatsLabel: 'Available Formats:',
  series: products.map((p) => ({
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    foodPairing: p.foodPairing,
    capacity: p.capacity,
    buttonText: p.link || 'Explore Collection',
    link: p.href,
    image: p.image,
    foodImage: p.foodImage || '/images/food-pairings/bento-meal.webp',
    variants: (productVariants[p.id] ?? []).map((v) => ({ label: v.label, image: v.src })),
  })),
};
