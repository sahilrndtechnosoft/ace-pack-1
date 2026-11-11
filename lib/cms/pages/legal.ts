// Privacy Policy (/privacy) and Terms & Conditions (/terms).
import { bannerSection } from './shared';

// PageBanner's own default background, used by both legal pages.
const LEGAL_BANNER_IMAGE = '/50d728a7-e02c-49d9-b530-58a7db8a6ecc.png';

export const privacyPage = {
  title: 'Privacy Policy',
  path: '/privacy',
  sections: {
    banner: bannerSection({
      badge: 'LEGAL & COMPLIANCE',
      title: 'Privacy Policy',
      subtitle: 'Our commitment to safeguarding your business inquiries, procurement requirements, and commercial confidentiality.',
      bgImage: LEGAL_BANNER_IMAGE,
    }),
    document: { label: 'Policy Text', description: 'Intro, numbered clauses and the contact box.', content: {
  "updatedLabel": "Last Updated: October 2026",
  "heading": "Ace Packaging Privacy Standards",
  "intro": "Ace Packaging Solutions (“Ace Packaging”, “we”, “our”, or “us”) operates manufacturing facilities in Daman, India, supplying precision injection-moulded food containers globally. This policy outlines how we handle commercial inquiries, technical documentation requests, and personal contact details submitted through our digital platform.",
  "clauses": [
    {
      "title": "1. Information We Collect",
      "text": "We collect business information when you:",
      "bullets": [
        "Submit factory quotation and product inquiry forms.",
        "Request physical sample kits for cloud kitchens, QSRs, or food brands.",
        "Download technical datasheets, CAD specifications, or product catalogues.",
        "Subscribe to catalog updates and export announcements."
      ],
      "closing": "Collected fields typically include full name, brand/company name, business email address, phone/WhatsApp number, container category of interest, and volume requirements."
    },
    {
      "title": "2. Commercial Confidentiality & Custom Mould Tooling",
      "text": "We understand that container geometry, IML artwork, brand positioning, and proprietary recipes require strict confidentiality. Ace Packaging adheres to non-disclosure obligations (NDAs) for all custom OEM mould tooling, branded in-mould labelling designs, and private label client engagements.",
      "bullets": [],
      "closing": ""
    },
    {
      "title": "3. How We Use Collected Information",
      "text": "The information you provide is used strictly for:",
      "bullets": [
        "Fulfilling sample kit shipments and providing factory freight estimates.",
        "Responding to container volume requests, MOQ pricing, and export container loadings.",
        "Sending requested PDF technical datasheets and regulatory compliance certificates.",
        "Technical follow-up by our Daman engineering and dispatch teams."
      ],
      "closing": "We never sell, rent, or trade your contact information or commercial order history to third-party marketing brokers."
    },
    {
      "title": "4. Data Security & Retention",
      "text": "We implement industry-standard encryption, SSL/TLS protocols, and secure server safeguards to protect data transmission across our website. Commercial inquiries are retained for record-keeping and audit compliance.",
      "bullets": [],
      "closing": ""
    }
  ],
  "contactHeading": "Questions or Data Inquiries?",
  "contactText": "Contact our administrative and compliance desk in Daman.",
  "contactEmail": "acepack2011@gmail.com",
  "contactLink": {
    "text": "Contact Page",
    "link": "/contact"
  }
} },
  },
};

export const termsPage = {
  title: 'Terms & Conditions',
  path: '/terms',
  sections: {
    banner: bannerSection({
      badge: 'LEGAL & COMPLIANCE',
      title: 'Terms & Conditions',
      subtitle: 'Commercial terms, production tolerances, export standards, and food safety compliance governing our container supply.',
      bgImage: LEGAL_BANNER_IMAGE,
    }),
    document: { label: 'Terms Text', description: 'Intro, numbered clauses and the contact box.', content: {
  "updatedLabel": "Effective Date: October 2026",
  "heading": "Standard Commercial & Supply Terms",
  "intro": "These terms govern all quotations, sample dispatches, bulk production orders, and export container shipments supplied by Ace Packaging Solutions from our manufacturing units in Daman, India.",
  "clauses": [
    {
      "title": "1. Material Authenticity & Prime Virgin PP 05",
      "text": "All Ace Packaging plastic food storage containers (including Hinge Cups, Portion Cups, RO-Series, RE-Series Bento Boxes, ZEN Series, Natraj Containers, and Deli Tubs) are manufactured exclusively from 100% prime virgin Polypropylene (PP 05). We do not blend regrind or post-consumer plastic into direct food-contact surfaces. All manufacturing and resins comply with certified ISO 9001:2015 standards.",
      "bullets": [],
      "closing": ""
    },
    {
      "title": "2. Sample Evaluations & Kitchen Testing",
      "text": "Ace Packaging provides physical sample kits to verified corporate buyers, cloud kitchens, and brand owners to evaluate thermal performance (-20°C deep freeze to +120°C microwave), lid snap tolerances, stackability, and zero-leak integrity under transit. Sample evaluation carries no binding wholesale obligation.",
      "bullets": [],
      "closing": ""
    },
    {
      "title": "3. Dispatch, Packaging & Freight Tolerances",
      "text": "Containers are hygienically sleeved in dust-free poly bags and packed in export-grade heavy-duty corrugated cartons to prevent rim deformation during transit:",
      "bullets": [
        "Domestic Dispatch (India): Ex-factory Daman or delivered via trusted freight partners.",
        "Global Exports (UAE, Middle East, Europe, Australia, Americas): Standard FCL/LCL ocean freight from Nhava Sheva (JNPT) / Hazira Port under Incoterms (FOB, CIF, CFR).",
        "Carton Quantities: Standard packing counts (e.g. 240, 250, 500, or 1,000 pcs per carton) are specified per model datasheet."
      ],
      "closing": ""
    },
    {
      "title": "4. Custom Moulds & In-Mould Labelling (IML)",
      "text": "Toolroom lead times for proprietary custom injection moulds and high-definition IML artwork approval are confirmed upon technical drawing sign-off. Proprietary tool ownership and exclusivity terms remain protected under signed client agreements.",
      "bullets": [],
      "closing": ""
    },
    {
      "title": "5. Quality Claims & Inspection",
      "text": "Our automated robotic production utilizes optical defect inspection. In the event of transit damage or manufacturing discrepancy, claims must be reported within 15 business days of consignment receipt along with carton batch identifiers for QA verification.",
      "bullets": [],
      "closing": ""
    }
  ],
  "contactHeading": "Need Commercial Clarifications?",
  "contactText": "Our export documentation and sales managers are available.",
  "contactEmail": "sales@acepack.co.in",
  "contactLink": {
    "text": "Contact Factory",
    "link": "/contact"
  }
} },
  },
};

export type LegalDocumentContent = typeof privacyPage.sections.document.content;
