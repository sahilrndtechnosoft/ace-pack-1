// Home page (/) — one entry per visible section, top to bottom. Values are the live fallback content.

export const homeHero = {
  topLabel: "India's Leading Moulding Plant",
  certificationLabel: 'ISO 9001:2015 Certified',
  badge: '100% Prime Virgin Polypropylene (PP 05)',
  heading: 'Pioneers of Precision',
  headingHighlight: 'Food Packaging.',
  description:
    'From crystal-clear fruit boxes and leak-proof boba cups to round deli bowls and multi-compartment meal trays. Manufactured in Daman for 1,000+ brands across 12 export countries.',
  mobileDescription:
    'Crystal-clear fruit boxes, salad bowls, leak-proof boba cups, and living-hinge portion tubs moulded in Daman for 1,000+ global brands.',
  primaryButton: { text: 'Explore Products', link: '/products' },
  catalogueButtonText: 'Download Catalogue',
  image: '/images/Golden-Gourmet-Takeaway-Spread-Photoroom.png',
  imageAlt: 'Ace Packaging Golden Gourmet Complete Takeaway Spread - Full Range',
  stats: [
    { value: '1.5M+', label: 'Moulded Daily' },
    { value: '1,000+', label: 'Global Clients' },
    { value: '12+', label: 'Export Markets' },
  ],
  scrollCue: 'Scroll to unbox the craft',
  footerNotes: ['01 / 06 Formats', '100% Recyclable PP 05'],
};

export const homeCraft = {
  eyebrow: '01 / A closer look',
  sideNote: 'Beauty is in the details.',
  heading: 'Unbox',
  headingHighlight: 'the craft.',
  facts: [
    { tag: '01 / Material integrity', title: '100% virgin\nPP 05.', body: '100% prime virgin food-grade polymer. Completely BPA-free, heavy-metal free and non-toxic.' },
    { tag: '02 / Sealed for the ride', title: 'Zero-leak\nsnap rim.', body: 'A hermetically tight rim seal that stops sauce and liquid escaping on a motorcycle delivery run.' },
    { tag: '03 / Extreme thermal range', title: '−20°C to\n+120°C.', body: 'From deep-freeze storage through to hot curry and microwave reheating, with no warping or crazing.' },
  ],
  image: '/models/acepack/clamshell.webp',
  imageAlt: 'Hinged clamshell with its lid slightly open',
};

export const homeManufacturing = {
  eyebrow: '03 / Made with intent',
  heading: 'Robotic precision.',
  headingHighlight: '1.5 million a day.',
  body: 'Fifteen years of injection moulding across two Daman units — Dori Kadaiya and Dabhel — supplying QSR chains, cloud kitchens and food brands in Australia, the UAE, Europe, Canada and the Middle East. Moulded exclusively from 100% prime virgin PP 05.',
  link: { text: 'Inside our process', link: '/capabilities' },
  stats: [
    { value: 1500000, suffix: '+', label: 'Containers moulded daily' },
    { value: 1000, suffix: '+', label: 'Clients served' },
    { value: 12, suffix: '+', label: 'Export markets worldwide' },
  ],
  note: 'ISO 9001:2015 certified manufacturing facility. PP 05 is widely recyclable — check local collection guidance for each format.',
};

export const homeIndustries = {
  eyebrow: 'Trusted at scale',
  heading: '1,000+ brands served across India and 12 export markets.',
  description: 'Packaging solutions engineered for what your product needs to do — from rapid delivery to shelf-ready retail presentation.',
  cards: [
    { title: 'Foodservice', description: 'Engineered for high-volume takeaway: leak-proof snap seal, microwave-safe, and rigid stacking base.', image: '/images/gallery/bento-meal.webp', link: '/categories/re-series' },
    { title: 'Quick Commerce', description: 'Built for 10-minute delivery: tamper-evident, light, durable and 100% recyclable virgin PP.', image: '/images/food-pairings/salad-bowl.webp', link: '/categories/re-series' },
    { title: 'Personal Care', description: 'Airtight security and portion precision: sterile food-grade packaging for pharma and wellness.', image: '/images/gallery/hinge-cups.webp', link: '/categories/hinge-cups' },
    { title: 'Dairy', description: 'Hermetically sealed round tubs: freezer-to-table integrity for yogurt, curd, paneer and butter.', image: '/images/gallery/kitchen-set.webp', link: '/categories/deli-series' },
    { title: 'Confectionery', description: 'Crystal-clear rigid boxes: aroma-preserving display for traditional mithai, cookies and dry fruits.', image: '/images/gallery/sweet-box.webp', link: '/categories/sweet-box-containers' },
    { title: 'Frozen Foods', description: 'Deep-freeze resistant down to −20°C: crack-proof walls preventing freezer burn and brittleness.', image: '/images/gallery/ro-series.webp', link: '/categories/ro-series' },
    { title: 'Bakery', description: 'Optical clarity presentation: rigid dome containers for pastries, cakes, croissants and fresh prep.', image: '/images/food-pairings/burger-meal.webp', link: '/categories/flat-containers' },
    { title: 'Fashion & FMCG', description: 'High-speed automated filling ready: uniform wall thickness and tamper-resistant retail display.', image: '/images/gallery/studio-range.webp', link: '/categories/deli-series' },
  ],
};

export const homeCertifications = {
  badge: 'Certified & Qualified Manufacturing',
  heading: 'ISO 9001:2015 Certified Manufacturing',
  description:
    'Ace Packaging operates under an externally audited and certified ISO 9001:2015 Quality Management System (Certificate IN25/00000652 by SGS) across Daman Unit 1 and Unit 2.',
  downloadButtonText: 'Download ISO Certificate',
  specsButton: { text: 'View Quality Specs', link: '/quality' },
  cards: [
    { badge: 'ISO 9001:2015 CERTIFIED', title: 'ISO 9001:2015 Plant Certification', description: 'Certified Quality Management System covering precision injection moulding, tooling calibration, and rigorous quality control protocols.', standard: 'SGS Certificate IN25/00000652' },
    { badge: 'ISO CERTIFIED FACILITY', title: 'Cleanroom Production Standards', description: 'Standardized cleanroom manufacturing, automated optical defect inspection, and complete batch traceability across Daman Unit 1 & Unit 2.', standard: 'Zero-Defect Quality Protocol' },
    { badge: 'PRECISION TOLERANCE', title: 'Optical Inspection (±0.02mm)', description: 'Every mould and lid undergoes continuous optical inspection and zero-leak pressure testing under ISO quality management guidelines.', standard: 'Continuous Line Auditing' },
    { badge: 'VIRGIN POLYMER ASSURANCE', title: '100% Prime Virgin PP 05', description: 'Exclusively virgin polypropylene polymer sourced directly from prime petrochemical refiners. Completely BPA-free, odorless, and non-toxic.', standard: 'Zero Contaminant Purity' },
  ],
  certificateThumbnail: '/images/certifications/ace-packaging-iso-9001-certificate.jpg',
  certificateFile: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
  certificateTitle: 'ISO 9001:2015 Management System Certificate',
  bannerHeading: 'Export & Institutional Audit Reports Available',
  bannerText:
    'Download formal SGS ISO 9001 certificate copies or request batch-specific migration test laboratory reports for institutional vendor clearance.',
  bannerButtonText: 'Get Certificate Emailed',
  bannerLink: { text: 'Full Quality Page', link: '/quality' },
};

export const homeExport = {
  badge: 'International Logistics & Export Infrastructure',
  heading: 'Every container we ship for export is carefully planned and prepared for delivery.',
  description:
    'From our Daman manufacturing hub to international distribution centers across 12+ countries, Ace Packaging implements rigorous pallet engineering, sea-freight protection, and regulatory clearances so products arrive pristine, sterile, and ready for immediate service.',
  steps: [
    { number: '01', title: 'Specification & Pallet Planning', description: 'Alignment of exact product dimensions, master carton configuration, and cubic volume calculations to maximize 20ft / 40ft High Cube container payloads.' },
    { number: '02', title: 'Heavy-Duty Export Packaging', description: 'Interlocking carton stacking with heavy-gauge corrugated outer boxes, corner board edge protectors, and moisture-barrier shrink wrap for ocean transit.' },
    { number: '03', title: 'Regulatory & Customs Clearance', description: 'Preparation of international certificates of origin, ISO 9001:2015 plant quality documentation, food-contact test reports, and customs export filings.' },
    { number: '04', title: 'Port Dispatch via JNPT Mumbai', description: 'Strategic proximity to Nhava Sheva (JNPT) container port allows rapid container stuffing and reliable direct sailing schedules to global trade hubs.' },
  ],
  routesLabel: 'Direct Global Shipping Routes',
  routesHeading: 'Serving 12+ Export Markets Worldwide',
  routesText:
    'Regular FCL and LCL container consignments to the UAE, Saudi Arabia, Oman, UK, Germany, France, Australia, Canada, and the United States.',
  regions: ['Middle East (GCC)', 'United Kingdom & EU', 'Australia & NZ', 'North America'],
  button: { text: 'Plan Your Export Shipment', link: '/contact' },
};

export const homeFaq = {
  eyebrow: 'HELP & FAQ',
  heading: 'Everything You Need to Know About Food Packaging',
  faqs: [
    { question: 'What material resins are used in Ace Packaging containers?', answer: 'All Ace Packaging containers are manufactured using 100% prime virgin Polypropylene (PP 05) in our ISO 9001:2015 certified facilities. They are 100% BPA-free, heavy metal free, and food-contact safe.' },
    { question: 'Are your plastic containers microwave and freezer safe?', answer: 'Yes, our PP 05 material has a operating thermal range spanning -20°C (deep freeze) up to +120°C (hot gravy filling and microwave reheating).' },
    { question: 'How do Hinge Cups prevent sauce leakage during delivery?', answer: 'Our Hinge Cups feature a built-in snap-tight lid rim geometry that creates an airtight hermetic seal, preventing liquid spillage even during rough motorcycle transit.' },
  ],
  phoneLine: '+91 99250 15906 / +91 99251 55799',
  salesEmail: 'sales@acepack.co.in',
  formEyebrow: 'Get in touch with Ace Packaging',
  formHeading: 'Send Factory Inquiry',
  formDescription: 'Tell us about your application and request product specifications or a custom sample kit.',
};

export const homeClosingCta = {
  badge: 'Complimentary Factory Samples',
  heading: 'Ready to Upgrade Your Food Delivery Packaging?',
  description:
    'Test our zero-leak snap seals and extreme thermal durability in your own kitchen or packaging line. We dispatch curated sample kits across India and global ports within 24 hours.',
  primaryButton: { text: 'Request Free Sample Kit', link: '/contact' },
  catalogueButtonText: 'Download Product Catalogue',
  highlights: ['Zero Commitment Evaluation', 'Dispatch Within 24 Hours', 'ISO 9001:2015 Certified Facility'],
  footerLine: 'Daman, India · sales@acepack.co.in · +91 99250 15906',
};

export const homePage = {
  title: 'Home',
  path: '/',
  sections: {
    hero_banner: { label: 'Hero Banner', description: 'First screen: headline, buttons, main image and quick stats.', content: homeHero },
    craft: { label: 'Unbox the Craft', description: 'Three key product facts shown with the 3D container.', content: homeCraft },
    manufacturing: { label: 'Manufacturing Highlight', description: 'Dark band with production numbers.', content: homeManufacturing },
    industries: { label: 'Industries We Serve', description: 'Scrolling industry cards ("Trusted at scale").', content: homeIndustries },
    certifications: { label: 'Certifications & Quality', description: 'ISO certificate cards and download banner.', content: homeCertifications },
    export: { label: 'Export & Shipping', description: 'Four export steps and global shipping routes.', content: homeExport },
    faq: { label: 'FAQ & Inquiry Form', description: 'Common questions next to the inquiry form.', content: homeFaq },
    closing_cta: { label: 'Closing Call to Action', description: 'Free sample kit band above the footer.', content: homeClosingCta },
  },
};
