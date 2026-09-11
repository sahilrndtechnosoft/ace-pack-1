import { productCategories } from './products';
import { certifications } from './quality';

// Download centre inventory. `file` is a path under /public — when it is set
// the entry renders as a direct download; while it is absent the entry offers
// a request-by-email link instead, so the page is honest about what exists.
// Drop PDFs into public/downloads/ and fill in `file` to make them live.

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  type: 'Catalog' | 'Brochure' | 'Datasheet' | 'Certificate';
  file?: string;
}

export interface DownloadGroup {
  id: 'catalogs' | 'datasheets' | 'certifications';
  title: string;
  intro: string;
  items: DownloadItem[];
}

export const downloadGroups: DownloadGroup[] = [
  {
    id: 'catalogs',
    title: 'Catalogs & Brochures',
    intro: 'The full range across all 11 container lines, with capacities, materials and carton packing.',
    items: [
      { id: 'product-catalog', title: 'AcePack Product Catalog', description: 'All 11 categories — hinge cups to custom IML — with capacities, dimensions and carton quantities.', type: 'Catalog' },
      { id: 'company-brochure', title: 'Company Brochure', description: 'Daman plant, robotic moulding line, in-house toolroom and export reach at a glance.', type: 'Brochure' },
      { id: 'iml-guide', title: 'Custom IML Branding Guide', description: 'Artwork specifications and colour guidance for in-mould labelled containers.', type: 'Brochure' },
    ],
  },
  {
    id: 'datasheets',
    title: 'Product Datasheets',
    intro: 'Per-line technical sheets: model sizes, dimensions, material grade, thermal rating and packaging.',
    // Generated from the category data so a new line appears here automatically.
    items: productCategories.map((category) => ({
      id: category.slug,
      title: `${category.name} — Datasheet`,
      description: `${category.subtitleName}. ${category.products.length} model${category.products.length === 1 ? '' : 's'}: ${category.products.map((p) => p.capacity).join(', ')}.`,
      type: 'Datasheet' as const,
    })),
  },
  {
    id: 'certifications',
    title: 'Certifications & Compliance',
    intro: 'Documents for buyer, retailer and export audits.',
    items: certifications.map((cert) => ({
      id: cert.id,
      title: cert.title,
      description: cert.body,
      type: 'Certificate' as const,
    })),
  },
];

export const requestEmail = 'sales@acepack.co.in';
