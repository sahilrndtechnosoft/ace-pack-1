// Products (/products) and Categories (/categories, /plastic-food-containers) pages.
// The product and category lists themselves are managed under Product Catalogue.

export const productsPage = {
  title: 'Products',
  path: '/products',
  sections: {
    hero: {
      label: 'Hero Banner',
      description: 'Headline above the product catalogue.',
      content: {
        eyebrow: 'The catalog · models · lines',
        title_line_1: 'Models.',
        title_line_2: 'Specified in hand.',
        lead: 'Every model below is moulded from 100% prime virgin PP 05 in an ISO 9001:2015 certified facility and rated from deep freeze to microwave. Filter by line, sort by capacity, open any model for its full specification.',
        stat_resin: 'PP 05',
        stat_resin_label: 'Virgin resin',
      },
    },
    custom_mould_cta: {
      label: 'Closing Call to Action',
      description: 'Band below the catalogue.',
      content: {
        eyebrow: 'Product information & sample kit',
        heading: 'Need a customized shape, volume or IML decoration?',
        lead: 'Our in-house mould tooling engineers in Daman develop bespoke packaging for restaurant chains and food brands.',
        button_text: 'Contact Engineering Team',
        button_link: '/contact',
        secondary_button_text: 'Download datasheets',
        secondary_button_link: '/downloads',
      },
    },
  },
};

export const categoriesPage = {
  title: 'Categories',
  path: '/categories',
  sections: {
    hero: {
      label: 'Hero Banner',
      content: {
        eyebrow: 'The catalog · commercial packaging lines',
        title_line_1: 'Every format',
        title_line_2: 'food service needs.',
        lead: 'Commercial container lines, one material standard: 100% prime virgin PP 05, ISO 9001:2015 certified manufacturing, rated from deep freeze to microwave reheating.',
        stat_resin: 'PP 05',
        stat_resin_label: 'Virgin Resin',
        stat_range: '−20 · +120°C',
        stat_range_label: 'Rated Range',
      },
    },
    index: {
      label: 'Category List Heading',
      description: 'Heading above the list of product lines.',
      content: {
        eyebrow: '01 / Commercial Packaging Lines',
        title: 'Find your form.',
        hint: 'Certified series · Select a category to inspect full specs',
      },
    },
    standard: {
      label: 'Material Standard',
      content: {
        eyebrow: '02 / Material & Engineering Standard',
        title: 'One standard across every format.',
        bullets: [
          '100% prime virgin polypropylene (PP 05) — no regrind, no recycled content',
          'Manufactured in an ISO 9001:2015 certified facility in Daman',
          'Rated −20°C deep freeze to +120°C microwave reheating',
          'Zero-leak snap-rim geometry across every lidded format',
          'BPA-free and heavy-metal free',
          'Custom in-mould labelling available on every line',
        ],
      },
    },
    closing: {
      label: 'Closing Call to Action',
      content: {
        eyebrow: 'Catalog & Sample Kit',
        heading: 'Specify it',
        headingHighlight: 'in hand.',
        primaryButton: { text: 'Discuss your requirements', link: '/contact' },
        secondaryButton: { text: 'Download the catalog', link: '/downloads' },
      },
    },
  },
};
