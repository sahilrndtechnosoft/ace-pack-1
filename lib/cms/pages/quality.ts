// Quality & Certifications page (/quality).
import { bannerSection, DEFAULT_BANNER_IMAGE } from './shared';

export const qualityCertificate = {
  eyebrow: 'Official Plant Accreditation',
  heading: 'ISO 9001:2015 Quality Management System',
  description:
    'Ace Packaging operates under an externally audited and certified Quality Management System assessed by SGS United Kingdom Ltd with UKAS and IAF international recognition.',
  certificateImage: '/images/certifications/ace-packaging-iso-9001-certificate.jpg',
  imageAlt: 'SGS ISO 9001:2015 Certificate - Ace Packaging',
  imageCaption: 'Certificate IN25/00000652',
  imageCaptionRight: 'SGS · UKAS · IAF',
  badge: 'Official SGS UKAS Accreditation',
  title: 'The Management System of Ace Packaging',
  body: 'Assessed and certified as meeting the requirements of ISO 9001:2015 for the following activities: Manufacturing & Supply of Injection Moulded Food Packaging Articles across our Daman Unit 1 and Unit 2 manufacturing facilities.',
  details: [
    { label: 'Certificate Number', value: 'IN25/00000652' },
    { label: 'Auditing & Issuing Body', value: 'SGS United Kingdom Ltd (UKAS 0005)' },
    { label: 'Validity Period', value: '01 August 2025 – 01 August 2028' },
    { label: 'Certified Manufacturing Site', value: 'Survey No: 142/1, Dabhel, Daman - 396210, India' },
  ],
  points: [
    'Externally audited Quality Management System for precision injection moulding',
    '100% prime virgin polypropylene (PP 05) with zero chemical migration',
    'Full batch serialization and raw material traceability from resin intake to dispatch',
  ],
  downloadButtonText: 'Download',
  certificateFile: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
  certificateTitle: 'ISO 9001:2015 Management System Certificate - Ace Packaging',
  validityNote: 'Certificate IN25/00000652 · Valid through August 2028',
};

export const qualityFaq = {
  eyebrow: 'Quality FAQ',
  heading: 'Questions about our quality & certifications',
  faqs: [
    {
      question: 'Is Ace Packaging ISO 9001:2015 certified?',
      answer: 'Yes. Our Daman manufacturing facility is certified to ISO 9001:2015 by SGS (Certificate IN25/00000652), valid through August 2028.',
    },
    {
      question: 'What material are your containers made from?',
      answer: 'All containers are moulded from 100% prime virgin polypropylene (PP 05) — no regrind or fillers — and are BPA-free and safe for food contact.',
    },
    {
      question: 'How do you make sure containers do not leak?',
      answer: 'Every sealing rim is calibrated for a snap-tight lid fit and checked during production, so containers stay leak-proof during delivery.',
    },
    {
      question: 'How consistent is the wall thickness?',
      answer: 'Continuous laser and micrometer monitoring keeps wall and base thickness within ±0.02 mm, so there are no thin spots or weak corners.',
    },
    {
      question: 'Can you trace a batch if there is a quality concern?',
      answer: 'Yes. Every pack carries a serialized batch code logging the resin lot, moulding press and production time, from resin intake to dispatch.',
    },
  ],
};

export const qualityPage = {
  title: 'Quality & Certifications',
  path: '/quality',
  sections: {
    banner: bannerSection({
      badge: 'QUALITY ASSURANCE & STANDARDS',
      title: 'Quality Assurance & Certifications',
      subtitle:
        'Every container is moulded from certified virgin PP 05 in our ISO 9001:2015 certified facility in Daman, with 100% leak testing and ±0.02 mm precision tolerance across every production batch.',
      bgImage: DEFAULT_BANNER_IMAGE,
    }),
    certificate: { label: 'ISO Certificate', description: 'Certificate image and details.', content: qualityCertificate },
    faq: { label: 'Quality FAQ', description: 'Questions & answers shown below the certificate. Add, edit, remove or reorder questions.', content: qualityFaq },
  },
};
