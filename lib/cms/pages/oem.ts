// OEM (/oem) and Customization (/customization) pages — same layout, separate content.
import { bannerSection } from './shared';

export const OEM_GALLERY_ITEMS = [
  {
    id: 'round-glass-range',
    title: 'Round Glass Multi-Capacity Line',
    category: 'Round Glass Range',
    description:
      'Custom-tooled 90mm round drinkware and dessert cups in 350ml, 500ml, 600ml, and 700ml capacities with hermetic snap-lock rims and ultra-clear PP 05 transparency.',
    image: '/images/oem/DSC04469.webp',
    specs: ['350ml - 700ml Formats', '90mm Standard Rim', '100% Prime Virgin PP 05', 'Optical Clarity'],
  },
  {
    id: 'custom-lids-closures',
    title: 'Bespoke Coloured Tethered Lids & Closures',
    category: 'Tethered Closures',
    description:
      'Vibrant custom Pantone polymer formulation with leak-proof tethered flip caps, sippy spouts, and food-grade silicone plug seals for hot & cold beverage service.',
    image: '/images/oem/DSC04472.webp',
    specs: ['Custom Pantone Colours', 'Tethered Spill-Proof Cap', 'Hot & Cold Rated', 'BPA Free Food-Grade'],
  },
  {
    id: 'iml-branding-suite',
    title: 'Full-Coverage In-Mould Labelling (IML)',
    category: 'IML Branding',
    description:
      'Photorealistic 5-sided IML fused permanently into the polymer walls during moulding — scratch-resistant, water-proof and microwave-safe.',
    image: '/images/oem/DSC04473.webp',
    specs: ['5-Sided Photorealistic Wrap', 'Zero Peel & Scratch-Proof', 'Microwave & Freezer Safe', 'Tamper-Evident Rim'],
  },
];

function resourcePage(title: string, path: string, bannerBadge: string) {
  return {
    title,
    path,
    sections: {
      hero: bannerSection({
        badge: bannerBadge,
        title: 'OEM & Custom Packaging Solutions.',
        subtitle:
          'Your brand, our precision manufacturing. From custom mould tooling and proprietary container geometry to 5-sided In-Mould Labelling (IML) and bespoke colour formulations, build your custom packaging programme under one roof at our ISO 9001:2015 Daman facility.',
        bgImage: '/images/oem/oem-food-banner.webp',
      }),
      gallery_heading: {
        label: 'Gallery Heading',
        content: {
          badge: 'PRODUCT GALLERY',
          heading: 'Round Glass & Custom Product Showcase',
          lead: 'Photographs of custom Round Glass containers, bespoke colour closures, and precision IML mouldings engineered for leading QSR chains, beverage brands, and foodservice distributors.',
        },
      },
      gallery: {
        label: 'Product Gallery',
        description: 'Product photos with title, category, description and specs.',
        content: { items: OEM_GALLERY_ITEMS },
      },
    },
  };
}

const oemBase = resourcePage('OEM Tooling', '/oem', 'OEM & CUSTOM TOOLING');

// Branding / printing options shown under the banner (OEM and Customization).
export const oemBranding = {
  badge: 'BRANDING & PRINTING',
  heading: 'Print your brand on every container',
  items: [
    { title: 'Screen Printing', description: 'Crisp, durable prints directly on the container surface.' },
    { title: 'Dry Offset Printing', description: 'High-speed printing for large production runs with consistent results.' },
    { title: 'Single to 6-Colour Options', description: 'Anything from a single-colour logo to full 6-colour artwork.' },
    { title: 'White Labelling', description: 'Our containers, supplied under your brand name.' },
  ],
};

const withBranding = (page: ReturnType<typeof resourcePage>) => ({
  ...page,
  sections: {
    hero: page.sections.hero,
    branding: { label: 'Branding & Printing Options', description: 'Printing options shown under the banner.', content: oemBranding },
    gallery_heading: page.sections.gallery_heading,
    gallery: page.sections.gallery,
  },
});

export const oemPage = withBranding(oemBase);
// /customization shows the OEM page's content (edited under OEM); this entry keeps only its own SEO settings.
export const customizationPage = { title: 'Customization', path: '/customization', sections: {} };
