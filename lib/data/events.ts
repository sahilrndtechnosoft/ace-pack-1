export interface ExhibitionEvent {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  label: string; // The sleek overlapping badge label seen in the reference screenshot
  category: 'expo' | 'summit' | 'experience' | 'showcase';
  status: 'upcoming' | 'featured' | 'past';
  date: string;
  year: string;
  location: string;
  venue: string;
  city: string;
  country: string;
  booth?: string;
  image: string;
  description: string;
  fullStory?: string[];
  highlights: string[];
  badge?: string;
  focusProducts: { name: string; slug: string; desc: string }[];
}

export const exhibitionEvents: ExhibitionEvent[] = [
  {
    id: 'packplus-2026',
    slug: 'packplus-international-2026',
    title: 'PackPlus International Packaging Conclave 2026',
    shortTitle: 'PackPlus 2026',
    label: 'PACKPLUS CONCLAVE',
    category: 'expo',
    status: 'upcoming',
    date: 'August 21–23, 2026',
    year: '2026',
    location: 'Pragati Maidan, New Delhi, India',
    venue: 'Pragati Maidan Exhibition Complex',
    city: 'New Delhi',
    country: 'India',
    booth: 'Hall 11 · Stall D-18',
    image: '/images/media_1787711507848.png',
    badge: 'Featured Showcase',
    description:
      'India’s flagship trade show for packaging machinery, food delivery materials, and container supply chains. Ace Packaging will unveil our next-generation 5-sided In-Mould Labelling (IML) containers and ultra-clear tamper-evident ice cream tubs.',
    fullStory: [
      'PackPlus is India’s most comprehensive business-to-business exhibition dedicated to the packaging, supply chain, and food processing industries. Held at the prestigious Pragati Maidan Exhibition Complex, the conclave brings together over 40,000 visitors, corporate packaging heads, and QSR brand procurement directors from across South Asia.',
      'At this edition, Ace Packaging will occupy a premier 120-sqm pavilion in Hall 11, presenting live interactive demonstrations of high-speed injection moulding, 5-sided photorealistic In-Mould Labelling (IML), and automated robotic parts handling.',
      'Visitors to our booth can inspect over 60 commercial container designs, conduct hands-on drop tests for hot curry containers, review our SGS ISO 9001:2015 audit reports, and discuss bespoke mould tooling lead times with our chief engineering directors.',
    ],
    highlights: [
      'Live demonstration of 5-sided photorealistic IML container branding with zero label peel',
      'Leak-proof snap fit trials for high-heat soup and biryani deliveries under transport vibration',
      'Rapid order scheduling for custom brand mould tooling (±0.02mm tolerance CAD)',
      'Free physical sample kit distribution with technical specification datasheets',
    ],
    focusProducts: [
      { name: 'IML Custom Branded Containers', slug: 'custom-iml', desc: 'Photorealistic in-mould labelling fused directly into virgin PP 05 polymer.' },
      { name: 'RE Series Bento Compartments', slug: 're-series', desc: 'Perimeter snap seal preventing curry migration between sections.' },
      { name: 'Tamper-Evident Deli Tubs', slug: 'deli-series', desc: 'Ultra-clear tear-strip containers for dips, gravies, and desserts.' },
    ],
  },
  {
    id: 'plastindia-2026',
    slug: 'plastindia-2026-new-delhi',
    title: 'Plastindia 2026 · 12th International Plastics Exhibition',
    shortTitle: 'Plastindia 2026',
    label: 'PLASTINDIA EXPO',
    category: 'expo',
    status: 'upcoming',
    date: 'February 05–10, 2026',
    year: '2026',
    location: 'Bharat Mandapam, New Delhi, India',
    venue: 'Bharat Mandapam Convention Centre',
    city: 'New Delhi',
    country: 'India',
    booth: 'Hall 5 · Stand H5-A08',
    image: '/images/media_1787712717089.png',
    badge: 'Mega Polymer Expo',
    description:
      'The global crossroads of high-precision plastics innovation. Ace Packaging demonstrates our automated robotic injection moulding lines, prime virgin PP 05 processing standards, and ISO 9001:2015 certified export quality.',
    fullStory: [
      'Plastindia is acknowledged as one of the top global plastics exhibitions in the world, bringing together polymer producers, mould makers, machinery giants, and converters from over 45 countries.',
      'Ace Packaging will showcase the advanced engineering capabilities of our two manufacturing units in Daman. From 180-tonne to 450-tonne robotic injection presses with 2.8-second cycle times to automated cleanroom conveyor packing, our pavilion highlights why global brands trust Ace Packaging for high-volume supply.',
      'Our senior polymer chemists and quality assurance directors will be present to walk international buyers through migration test certificates, REACH compliance, and BPA-free virgin polypropylene documentation.',
    ],
    highlights: [
      'Robotic take-out automation and 2.8s high-speed cycle times on display',
      '100% Prime Virgin PP 05 food-grade compliance documentation audits',
      'Global logistics consultations for shipping to UK, UAE, EU, and Australia',
      'High-cavity mould design reviews for custom enterprise geometries',
    ],
    focusProducts: [
      { name: 'RO Series Round Bowls', slug: 'ro-series', desc: 'Airtight leak-proof round containers for soups, biryanis, and curries.' },
      { name: 'ZEN Series Square Boxes', slug: 'zen-series', desc: 'Modern square geometry optimized for stacking and delivery bags.' },
      { name: 'Glass Series 90-Dia Cups', slug: 'glass-series-90-dia', desc: 'Premium high-clarity drinkware and shake containers.' },
    ],
  },
  {
    id: 'gulfood-manufacturing-2026',
    slug: 'gulfood-manufacturing-dubai-2026',
    title: 'Gulfood Manufacturing Dubai 2026',
    shortTitle: 'Gulfood Mfg Dubai',
    label: 'GULFOOD DUBAI',
    category: 'summit',
    status: 'upcoming',
    date: 'November 03–05, 2026',
    year: '2026',
    location: 'Dubai World Trade Centre, Dubai, UAE',
    venue: 'Dubai World Trade Centre (DWTC)',
    city: 'Dubai',
    country: 'UAE',
    booth: 'Sheikh Saeed Hall · Stand S3-B14',
    image: '/images/gallery/bento-meal.webp',
    badge: 'Middle East Export Hub',
    description:
      'The definitive food service manufacturing expo for the Middle East, Africa, and South Asia. Meet our international export desk to negotiate palletized containerload logistics and custom Arabic/English IML artwork.',
    fullStory: [
      'Gulfood Manufacturing represents the industrial heart of the Middle East food and beverage trade. As Ace Packaging expands its footprint across the GCC—including regular commercial shipments to the UAE, Saudi Arabia, Oman, and Qatar—our Dubai presence is central to our export operations.',
      'Our stand will feature specialized temperature-resilient containers formulated to withstand desert logistics conditions, from −20°C deep freezing to microwave reheating up to +120°C without warping or chemical leaching.',
      'Direct freight schedules, containerload (FCL) pallet arrangements, and multi-currency billing terms will be finalized directly with regional distributors and cloud kitchen aggregators during the summit.',
    ],
    highlights: [
      'Deep freeze (−20°C) to microwave (+120°C) endurance verified containers',
      'High-volume container contracts for GCC restaurant and cloud kitchen chains',
      'Direct factory dispatch from Daman Port to Jebel Ali and regional hubs',
      'Dual-language Arabic & English IML photorealistic packaging branding',
    ],
    focusProducts: [
      { name: 'Bento Meal Trays', slug: 're-series', desc: 'Heavy-duty multi-compartment containers with hermetic snap-tight lids.' },
      { name: 'Clear Deli Tubs', slug: 'deli-series', desc: 'Crystal-clear polypropylene tubs for cold dips, olives, and mezze.' },
      { name: 'Sweet Box Containers', slug: 'sweet-box-containers', desc: 'Royal luxury packaging for baklava, dates, and traditional confectionery.' },
    ],
  },
  {
    id: 'aahar-delhi-2026',
    slug: 'aahar-international-hospitality-fair-2026',
    title: 'AAHAR · The International Food & Hospitality Fair',
    shortTitle: 'AAHAR Delhi',
    label: 'AAHAR HOSPITALITY',
    category: 'expo',
    status: 'past',
    date: 'March 03–07, 2026',
    year: '2026',
    location: 'Pragati Maidan, New Delhi, India',
    venue: 'Pragati Maidan Convention Centre',
    city: 'New Delhi',
    country: 'India',
    booth: 'Hall 14 · Stall F-22',
    image: '/images/gallery/kitchen-set.webp',
    badge: 'Culinary Hospitality',
    description:
      'India’s flagship food and hospitality convention. Over 1,800 hospitality procurement directors and cloud kitchen operators visited the Ace Packaging pavilion to experience our airtight gravy tubs and multi-cavity bento trays.',
    fullStory: [
      'Organized by the India Trade Promotion Organisation (ITPO), AAHAR is the epicenter of India’s culinary, catering, and institutional hospitality sector.',
      'Ace Packaging showcased the complete 100+ model product line, with live food service simulations demonstrating how our containers maintain food presentation during heavy-duty bike courier transit.',
      'The showcase resulted in over 45 long-term corporate supply partnerships across leading QSR franchises, cloud kitchen networks, and sweets manufacturers in North and West India.',
    ],
    highlights: [
      'Over 1,200 physical sample kits delivered to restaurant chains and QSRs',
      'In-person rim seal drop testing demonstrating zero leakage during transit',
      'Signed supply commitments across 40+ premier QSR dining brands',
      'Showcased one-piece hinge sauce cups with attached leak-proof lids',
    ],
    focusProducts: [
      { name: 'One-Piece Hinge Cups', slug: 'hinge-cups', desc: 'Hinged attached lid eliminates lost lids during rapid kitchen meal assembly.' },
      { name: 'Portion Cups', slug: 'portion-cups', desc: '25ml to 100ml clear dip containers with tight spill-resistant closures.' },
      { name: 'RO Series Gravy Tubs', slug: 'ro-series', desc: 'Microwavable tubs designed for piping-hot dals, curries, and soups.' },
    ],
  },
  {
    id: 'interpack-germany-2026',
    slug: 'interpack-dusseldorf-germany-2026',
    title: 'Interpack Düsseldorf 2026 · Global Packaging Fair',
    shortTitle: 'Interpack Germany',
    label: 'INTERPACK DÜSSELDORF',
    category: 'expo',
    status: 'upcoming',
    date: 'May 07–13, 2026',
    year: '2026',
    location: 'Messe Düsseldorf, Düsseldorf, Germany',
    venue: 'Messe Düsseldorf Fairgrounds',
    city: 'Düsseldorf',
    country: 'Germany',
    booth: 'Hall 9 · Stand C12',
    image: '/images/gallery/studio-range.webp',
    badge: 'European Conclave',
    description:
      'The world’s premier processing and packaging exhibition. Ace Packaging presents our export catalogue to European food packers, institutional distributors, and international supermarket retail lines.',
    fullStory: [
      'Interpack Düsseldorf is the world’s undisputed leading trade fair for the packaging industry and all related process technologies. With over 2,800 exhibitors from across the globe, it sets the benchmarks for sustainability, circularity, and precision manufacturing.',
      'Ace Packaging’s pavilion in Hall 9 spotlights our recyclable mono-material PP solutions. Because our containers and lids are moulded exclusively from pure polypropylene (PP 05), they can be 100% recycled without separation issues.',
      'Our European sales desk will meet with packaging importers, private label brand managers, and supermarket chains looking for reliable, high-volume injection-moulded packaging manufactured under strict ISO 9001:2015 quality assurance.',
    ],
    highlights: [
      'EU Food Contact Framework Regulation (EC 1935/2004) compliance verified',
      'Recyclable mono-material PP solutions designed for modern circular economy',
      'High-clarity dessert tubs and glass-replacement polypropylene cups',
      'Direct sea freight export logistics to Rotterdam, Hamburg, and Felixstowe',
    ],
    focusProducts: [
      { name: 'Glass Series 80-Dia', slug: 'glass-series-80-dia', desc: 'Glass-clear lightweight containers for parfaits, salads, and cold brew.' },
      { name: 'Flat Containers', slug: 'flat-containers', desc: 'Low-profile trays for sliced cheeses, charcuterie, and gourmet meal kits.' },
      { name: 'Elite Series Containers', slug: 'elite-containers', desc: 'Heavy-gauge containers for premium meal prep and catering.' },
    ],
  },
  {
    id: 'cloud-kitchen-summit-2025',
    slug: 'national-cloud-kitchen-packaging-summit-mumbai',
    title: 'National Cloud Kitchen & QSR Packaging Summit',
    shortTitle: 'QSR Delivery Expo',
    label: 'QSR DELIVERY SUMMIT',
    category: 'summit',
    status: 'past',
    date: 'October 18–19, 2025',
    year: '2025',
    location: 'Jio World Convention Centre, Mumbai, India',
    venue: 'Jio World Convention Centre, BKC',
    city: 'Mumbai',
    country: 'India',
    booth: 'Pavilion A · Booth 32',
    image: '/images/gallery/re-series.webp',
    badge: 'QSR Delivery Focus',
    description:
      'An intensive conference focused on solving delivery packaging pain points for high-volume dark kitchens. We unveiled our RE Series 2, 3, and 4-compartment boxes engineered with hermetic perimeter snap sealing.',
    fullStory: [
      'The National Cloud Kitchen & QSR Packaging Summit gathered over 500 delivery-first founders, operations heads from Swiggy and Zomato, and packaging technologists in Mumbai.',
      'The summit focused on resolving common customer complaints in online food ordering: cracked containers, messy liquid spills, and food arriving lukewarm.',
      'Ace Packaging presented the engineering science behind our rim snap tolerances (±0.02mm), showing that precision tooling and virgin resin elasticity prevent lid popping even under extreme courier bag jostling.',
    ],
    highlights: [
      'Zero liquid migration between wet curries and dry rice compartments',
      'Tested across 15km bike delivery vibration profiles without lid separation',
      'Keynote session on high-speed manual sealing ergonomics for kitchen packers',
      'Custom colour branding in corporate brand pantones (e.g., deep black and yellow)',
    ],
    focusProducts: [
      { name: 'RE Bento Compartments', slug: 're-series', desc: 'Proven partition walls preventing curry and rice mixing during transit.' },
      { name: 'Round Biryani Bowls', slug: 'ro-series', desc: 'Deep round containers preserving steam, aroma, and presentation.' },
      { name: 'Portion Cups', slug: 'portion-cups', desc: 'Airtight packaging for raitas, chutneys, and sauces.' },
    ],
  },
  {
    id: 'daman-plant-open-house',
    slug: 'daman-manufacturing-unit-innovation-tour',
    title: 'Daman Plant Innovation Day & Delegation Tour',
    shortTitle: 'Daman Plant Tour',
    label: 'DAMAN PLANT TOUR',
    category: 'experience',
    status: 'featured',
    date: 'Scheduled Monthly · Private Delegations',
    year: '2026',
    location: 'Ace Packaging Unit 1 & 2, Dabhel, Daman, India',
    venue: 'Ace Packaging Manufacturing Campus',
    city: 'Daman',
    country: 'India',
    booth: 'Factory Cleanroom & Toolroom Delegation',
    image: '/images/media_1787717762050.jpg',
    badge: 'VIP Plant Tour',
    description:
      'Exclusive on-site manufacturing audits for enterprise procurement teams, QA heads, and international buyers. Tour our 180T–450T robotic injection moulding presses, in-house CAD tooling center, and cleanroom quality laboratory.',
    fullStory: [
      'For clients commissioning custom container moulds, large-scale annual contracts, or international export shipments, nothing replaces seeing the production line in person.',
      'Our Daman Plant Tour provides an unhindered look into how 1,500,000+ food containers are moulded, inspected, and packed every single day.',
      'Delegates walk through our raw material silo receiving zones, inspect the automated robotic pick-and-place arms, review CAD toolroom CNC machining centers, and observe real-time optical micrometer quality testing in our cleanroom.',
    ],
    highlights: [
      'Witness live mould cycle trials and optical micrometer wall thickness tests',
      'Direct technical consultation with our chief mould engineers and polymer chemists',
      'Review raw prime virgin polymer supply certifications and SGS ISO 9001 audits',
      'Observe robotic packaging, automated box taping, and pallet wrapping',
    ],
    focusProducts: [
      { name: 'Robotic Injection Presses', slug: 'capabilities', desc: '180T to 450T presses operating at 2.8s cycle times.' },
      { name: 'In-House CAD Toolroom', slug: 'customization', desc: 'CNC mould machining and rapid prototyping for brand-specific containers.' },
      { name: 'Cleanroom Packaging Conveyors', slug: 'quality', desc: 'Hygienic dust-free packaging for institutional food contact compliance.' },
    ],
  },
  {
    id: 'fha-singapore-2026',
    slug: 'food-hotel-asia-singapore-2026',
    title: 'Food & Hotel Asia (FHA) Singapore 2026',
    shortTitle: 'FHA Singapore',
    label: 'FHA SINGAPORE',
    category: 'expo',
    status: 'upcoming',
    date: 'April 28–May 01, 2026',
    year: '2026',
    location: 'Singapore Expo, Singapore',
    venue: 'Singapore Expo Convention Exhibition Centre',
    city: 'Singapore',
    country: 'Singapore',
    booth: 'Hall 4 · Stand 4H-18',
    image: '/images/gallery/ro-series.webp',
    badge: 'Asia-Pacific Summit',
    description:
      'Southeast Asia’s largest international food and hospitality gathering. Ace Packaging introduces our Asian export portfolio, specifically tailored for takeaway ramen bowls, gourmet bento, and traditional confectionery packaging.',
    fullStory: [
      'Food & Hotel Asia (FHA) in Singapore is the premier gateway to the rapidly expanding food service markets of Southeast Asia, East Asia, and Australasia.',
      'Ace Packaging will exhibit container designs engineered specifically for Asian culinary formats: deep bowls with steam-venting options for hot noodle broths, multi-compartment bento boxes, and luxury sweet containers for festive gift packing.',
      'Our export logistics team will offer turnkey CIF shipping rates to Singapore, Port Klang, Jakarta, Sydney, Melbourne, and Auckland.',
    ],
    highlights: [
      'Expanding supply chain network across Singapore, Malaysia, Australia, and New Zealand',
      'Hot broth spill-proof performance demonstrated up to 100°C soup transport',
      'Custom IML artwork printing in multi-language Asian and Western typography',
      'Containerload consolidation with mixed pallet product assortments',
    ],
    focusProducts: [
      { name: 'RO Series 450ml–1000ml', slug: 'ro-series', desc: 'Heavy-duty bowls for ramen, soups, gravies, and noodle bowls.' },
      { name: 'Sweet Box Containers', slug: 'sweet-box-containers', desc: 'Premium luxury containers for festive confectionery, mithai, and dates.' },
      { name: 'Portion Cups with Snap Lids', slug: 'portion-cups', desc: 'Compact sauce and condiments packaging with zero drip.' },
    ],
  },
];
