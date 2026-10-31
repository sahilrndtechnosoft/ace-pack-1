import { certifications } from './quality';

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  type: 'Catalog' | 'Brochure' | 'Datasheet' | 'Certificate';
  file?: string;
  image?: string;
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
    intro: 'The full range across our container lines, with capacities, materials and carton packing.',
    items: [
      {
        id: 'product-catalog',
        title: 'Ace Packaging Product Catalog 2026',
        description: 'Comprehensive product catalog — hinge cups to custom IML containers — with complete volume capacities, dimensions and carton quantities.',
        type: 'Catalog',
        file: '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
      },
      {
        id: 'company-brochure',
        title: 'Ace Packaging Corporate & Plant Brochure',
        description: 'Daman manufacturing units, robotic moulding line, cleanroom production, in-house toolroom and export reach at a glance.',
        type: 'Brochure',
        file: '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
      },
      {
        id: 'iml-guide',
        title: 'Custom In-Mould Labelling (IML) Branding Guide',
        description: 'Artwork specifications, die-lines, label placement and 5-sided full-color graphics guidance for in-mould labelled containers.',
        type: 'Brochure',
        file: '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
      },
    ],
  },
  {
    id: 'certifications',
    title: 'Certifications & Compliance',
    intro: 'Official accreditation certificates and compliance documents for buyer, retailer and international export audits.',
    items: [
      {
        id: 'iso-9001-certificate',
        title: 'ISO 9001:2015 Management System Certificate',
        description: 'Official SGS Certificate (Certificate IN25/00000652) assessing and certifying Ace Packaging for Manufacturing & Supply of Injection Moulded Food Packaging Articles under ISO 9001:2015. Valid from August 2025 until August 2028.',
        type: 'Certificate',
        file: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
        image: '/images/certifications/ace-packaging-iso-9001-certificate.jpg',
      },
      ...certifications
        .filter((c) => c.id !== 'iso-9001')
        .map((cert) => ({
          id: cert.id,
          title: cert.title,
          description: cert.body,
          type: 'Certificate' as const,
        })),
    ],
  },
];

export const requestEmail = 'sales@acepack.co.in';
