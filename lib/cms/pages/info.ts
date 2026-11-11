// FAQ (/faq), Gallery (/gallery) and Capabilities (/capabilities) pages.
import { bannerSection, DEFAULT_BANNER_IMAGE } from './shared';
import { homeFaq } from './home';

export const faqPage = {
  title: 'FAQ',
  path: '/faq',
  sections: {
    banner: bannerSection({
      badge: 'HELP & FAQ',
      title: 'Frequently Asked Questions',
      subtitle: 'Clear answers about our plastic food containers, polymer safety certifications, custom printing, and shipping logistics.',
      bgImage: DEFAULT_BANNER_IMAGE,
    }),
    questions: {
      label: 'Questions & Answers',
      content: {
        faqs: [
          ...homeFaq.faqs,
          { question: 'What information should I share when enquiring?', answer: 'Share your food application, preferred format and capacity, expected quantities, destination, and any colour or IML artwork requirements. Our team can help you prepare the product specification.' },
          { question: 'Where is your manufacturing facility located?', answer: 'Our modern automated injection moulding facility is located in Daman (U.T.), India, with 2 plant units capable of producing over 1.5 million container units daily.' },
        ],
      },
    },
    cta: {
      label: 'Contact Box',
      content: {
        heading: 'Have Additional Questions?',
        description: 'Our sales & packaging engineers are standing by to assist your food brand.',
        button: { text: 'Contact Our Technical Team', link: '/contact' },
      },
    },
  },
};

export const galleryPage = {
  title: 'Gallery',
  path: '/gallery',
  sections: {
    banner: bannerSection({
      badge: 'PRODUCT & PLANT GALLERY',
      title: 'Visual Product & Plant Gallery',
      subtitle: 'High-resolution imagery of our injection-moulded plastic containers, cleanroom production environment, and custom IML branded products.',
      bgImage: '/images/gallery/bento-meal.webp',
    }),
    gallery: {
      label: 'Photo Gallery',
      description: 'Scrolling photo strip. Use 4:3 images for an even look.',
      content: {
        kicker: 'The Range, Up Close',
        title: 'Seven frames from the studio and the line',
        intro: 'Product photography of the containers we mould every day — hinge cups, bento boxes, gravy tubs and sweet boxes. Keep scrolling to move through the strip.',
        items: [
          { title: 'RE Bento Meal Delivery Boxes', category: 'Cloud Kitchen Combos', image: '/images/gallery/bento-meal.webp' },
          { title: 'Leak-Proof Containers In Service', category: 'Everyday Use', image: '/images/gallery/kitchen-set.webp' },
          { title: 'RO Series Round Gravy Tubs', category: 'Soup & Curry Tubs', image: '/images/gallery/ro-series.webp' },
          { title: 'One-Piece Hinge Cups', category: 'Fresh & Fruit Packs', image: '/images/gallery/hinge-cups.webp' },
          { title: 'RE Series Meal Trays', category: 'Bento & Meal Prep', image: '/images/gallery/re-series.webp' },
          { title: 'Sweet Box Containers', category: 'Confectionery', image: '/images/gallery/sweet-box.webp' },
          { title: 'The Full Container Range', category: 'Studio Series', image: '/images/gallery/studio-range.webp' },
        ],
      },
    },
    cta: {
      label: 'Closing Call to Action',
      content: {
        eyebrow: 'Samples & Specifications',
        heading: 'Want these in your own branding?',
        description: 'We ship physical samples and full technical spec sheets for every model in the range.',
        primaryButton: { text: 'Request Samples', link: '/contact' },
        secondaryButton: { text: 'All Categories', link: '/categories' },
      },
    },
  },
};

export const capabilitiesPage = {
  title: 'Capabilities',
  path: '/capabilities',
  sections: {
    banner: bannerSection({
      badge: 'ENGINEERING EXCELLENCE',
      title: 'Manufacturing Capabilities',
      subtitle: 'High-speed robotic injection moulding, custom CAD mould engineering, cleanroom hygiene standards, and In-Mould Labelling (IML) technology.',
      bgImage: DEFAULT_BANNER_IMAGE,
    }),
    specs: {
      label: 'Key Specifications',
      content: {
        specs: [
          { title: 'Machine Tonnage Range', value: '180T – 450T High-Speed Presses' },
          { title: 'Cycle Speeds', value: '2.8s Ultra-Fast Cycle Times' },
          { title: 'Wall Thickness Tolerance', value: '±0.02mm High-Precision Geometry' },
          { title: 'Daily Plant Output', value: '1,500,000+ Units / Day' },
        ],
      },
    },
    infrastructure: {
      label: 'Infrastructure Cards',
      content: {
        cards: [
          {
            title: 'Robotic Injection Moulding Line',
            description: 'Our plant houses state-of-the-art European & Taiwanese injection moulding machines equipped with 3-axis high-speed robotic pick-and-place automation, ensuring zero human touch contamination.',
            points: ['Automatic hot-runner multi-cavity moulds', 'Real-time closed-loop temperature control', 'High clarity resin plasticizing screws'],
          },
          {
            title: 'In-House CAD Toolroom & R&D',
            description: 'Our team of toolmakers and CAD designers engineer custom moulds with optimized cooling channels, allowing us to turn around prototype designs into mass production within short lead times.',
            points: ['3D SolidWorks & Moldflow analysis', 'CNC high-speed machining centers', 'Custom branding embossing capabilities'],
          },
        ],
      },
    },
  },
};
