export interface ProductVariety {
  name: string;
  slug: string;
  colorHex: string;
  borderHex?: string;
  image: string;
  description?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  capacity: string;
  product_slug: string;
  material: string;
  quality: string;
  features: string[];
  dimensions?: {
    top: string;
    height: string;
    bottom?: string;
  };
  packaging?: string;
  image: string;
  blankImage?: string;
  lockingFoodImage?: string;
  description?: string;
  applications?: string[];
  specs?: { label: string; value: string }[];
  varieties?: ProductVariety[];
  defaultVariety?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  subtitleName: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  features: string[];
  products: ProductItem[];
  faqs?: { question: string; answer: string }[];
  gallery?: string[];
}

export const productCategories: ProductCategory[] = [
  {
    id: 'hinge-cups',
    name: 'Hinge Cups',
    slug: 'hinge-cups',
    subtitleName: 'One-Piece Attached Snap Lids',
    shortDescription: 'Leak-proof one-piece hinged lids for chutneys, dips, dressings, and condiments. Attached lid eliminates lost cap inventory in busy kitchens.',
    description: 'Ace Packaging Hinge Cups feature a built-in snap-tight hinged lid engineered from 100% virgin polypropylene (PP 05). Designed for high-speed QSR assembly, zero-leak motorcycle delivery, and crystal-clear product presentation.',
    heroImage: '/images/products/hinge/hinge-cups-hero.webp',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Attached Hinged Snap-Lid', '100% Virgin PP 05'],
    gallery: [
      '/images/products/hinge/hinge-cups-hero.webp',
      '/images/products/hinge/hinge-100ml.webp',
      '/images/products/hinge/hinge-50ml.webp',
      '/images/products/hinge/hinge-25ml.webp',
      '/images/products/hinge/hinge-2oz.webp'
    ],
    faqs: [
      { question: 'Does the hinged lid detach during transport?', answer: 'No, our hinges are engineered with flexible virgin PP polymer tested for over 50 open-close cycles without tearing.' },
      { question: 'What sizes are available in Hinge Cups?', answer: 'Available in 25ml, 50ml, 2 Oz, and 100ml capacities, supplied in 2,000 PCS master packaging.' }
    ],
    products: [
      {
        id: 'hc-25',
        name: '25ml Hinge Cup',
        capacity: '25ml',
        product_slug: '25ml-hinge-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Attached Snap Lid'],
        dimensions: { top: '40 mm', bottom: '29 mm', height: '33 mm' },
        packaging: '2,000 PCS per Master Pack',
        image: '/images/products/hinge/hinge-25ml.webp',
        applications: ['Sauces', 'Chutneys', 'Dips', 'Ketchup', 'Salad Dressings'],
        specs: [
          { label: 'Top Diameter', value: '40 mm' },
          { label: 'Bottom Diameter', value: '29 mm' },
          { label: 'Height', value: '33 mm' },
          { label: 'Pack Size', value: '2,000 PCS' }
        ]
      },
      {
        id: 'hc-50',
        name: '50ml Hinge Cup',
        capacity: '50ml',
        product_slug: '50ml-hinge-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Microwave Reheatable'],
        dimensions: { top: '61 mm', bottom: '52 mm', height: '25 mm' },
        packaging: '2,000 PCS per Master Pack',
        image: '/images/products/hinge/hinge-50ml.webp',
        applications: ['Gravies', 'Mayonnaise', 'Raita', 'Soy Sauce', 'Butter Ghee'],
        specs: [
          { label: 'Top Diameter', value: '61 mm' },
          { label: 'Bottom Diameter', value: '52 mm' },
          { label: 'Height', value: '25 mm' },
          { label: 'Pack Size', value: '2,000 PCS' }
        ]
      },
      // {
      //   id: 'hc-2oz',
      //   name: '2 Oz Hinge Cup',
      //   capacity: '60ml (2 Oz)',
      //   product_slug: '2oz-hinge-cup',
      //   material: 'Virgin PP 05 Food Grade',
      //   quality: 'Export Grade Food Safe',
      //   features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Attached Living Hinge'],
      //   dimensions: { top: '65 mm', bottom: '52 mm', height: '30 mm' },
      //   packaging: '2,000 PCS per Master Pack',
      //   image: '/images/products/hinge/hinge-2oz.webp',
      //   applications: ['Dipping Sauces', 'Salad Dressings', 'Tartar Sauce', 'Garlic Dip'],
      //   specs: [
      //     { label: 'Top Diameter', value: '65 mm' },
      //     { label: 'Bottom Diameter', value: '52 mm' },
      //     { label: 'Height', value: '30 mm' },
      //     { label: 'Pack Size', value: '2,000 PCS' }
      //   ]
      // },
      {
        id: 'hc-100',
        name: '100ml Hinge Cup',
        capacity: '100ml',
        product_slug: '100ml-hinge-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Attached Snap Lid'],
        dimensions: { top: '70 mm', bottom: '57 mm', height: '36 mm' },
        packaging: '2,000 PCS per Master Pack',
        image: '/images/products/hinge/hinge-100ml.webp',
        applications: ['Desserts', 'Gulab Jamun', 'Dahi Raita', 'Sambar', 'Side Portions'],
        specs: [
          { label: 'Top Diameter', value: '70 mm' },
          { label: 'Bottom Diameter', value: '57 mm' },
          { label: 'Height', value: '36 mm' },
          { label: 'Pack Size', value: '2,000 PCS' }
        ]
      }
    ]
  },
  {
    id: 'portion-cups',
    name: 'Portion Cups',
    slug: 'portion-cups',
    subtitleName: 'Separate Snap Lid Portion Containers',
    shortDescription: 'Crystal-clarity round portion containers with precision matching snap-lids for dips, sauces, dressings, and condiments.',
    description: 'Ace Packaging Portion Cups are manufactured from 100% virgin polypropylene (PP 05). Designed with leak-proof rim locking, high optical clarity, and rigid structural ribs. Ideal for QSR dips, catering sides, chutneys, and food sampling.',
    heroImage: '/images/products/portion/portion-cups-hero.webp',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Matching Snap Lids', '100% Virgin PP 05'],
    gallery: [
      '/images/products/portion/portion-cups-hero.webp',
      '/images/products/portion/portion-250ml.webp',
      '/images/products/portion/portion-150ml.webp',
      '/images/products/portion/portion-125ml.webp',
      '/images/products/portion/portion-100ml.webp',
      '/images/products/portion/portion-50ml.webp',
      '/images/products/portion/portion-150ml.webp'
    ],
    faqs: [
      { question: 'Do Portion Cups include matching snap-on lids?', answer: 'Yes, all Portion Cups come packed with matching tight-sealing snap lids in standard carton quantities of 1,500 Pcs/set.' },
      { question: 'Can these portion cups be heat sealed?', answer: 'Yes, the precision rolled rim accommodates heat-sealable films as well as snap-on lids.' }
    ],
    products: [
      {
        id: 'pc-50',
        name: '50ml Portion Cup',
        capacity: '50ml',
        product_slug: '50ml-portion-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '62 mm', bottom: '43 mm', height: '30 mm' },
        packaging: '1,500 Pcs/set',
        image: '/images/products/portion/portion-50ml.webp',
        applications: ['Sauces', 'Chutneys', 'Pickles', 'Butter & Ghee', 'Salad Dressing'],
        specs: [
          { label: 'Top Diameter', value: '62 mm' },
          { label: 'Bottom Diameter', value: '43 mm' },
          { label: 'Height', value: '30 mm' },
          { label: 'Pack Size', value: '1,500 Pcs/set' }
        ]
      },
      {
        id: 'pc-100',
        name: '100ml Portion Cup',
        capacity: '100ml',
        product_slug: '100ml-portion-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '80 mm', bottom: '57 mm', height: '37 mm' },
        packaging: '1,500 Pcs/set',
        image: '/images/products/portion/portion-100ml.webp',
        applications: ['Mayonnaise', 'Raita', 'Dipping Sauces', 'Gravy Samples', 'Condiments'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '57 mm' },
          { label: 'Height', value: '37 mm' },
          { label: 'Pack Size', value: '1,500 Pcs/set' }
        ]
      },
      {
        id: 'pc-125',
        name: '125ml Portion Cup',
        capacity: '125ml',
        product_slug: '125ml-portion-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '80 mm', bottom: '59 mm', height: '43 mm' },
        packaging: '1,500 Pcs/set',
        image: '/images/products/portion/portion-125ml.webp',
        applications: ['Pudding', 'Dips', 'Dessert Samples', 'Coleslaw', 'Side Gravy'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '59 mm' },
          { label: 'Height', value: '43 mm' },
          { label: 'Pack Size', value: '1,500 Pcs/set' }
        ]
      },
      // {
      //   id: 'pc-150',
      //   name: '150ml Portion Cup',
      //   capacity: '150ml',
      //   product_slug: '150ml-portion-cup',
      //   material: 'Virgin PP 05 Food Grade',
      //   quality: 'Export Grade Food Safe',
      //   features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
      //   dimensions: { top: '90 mm', bottom: '78 mm', height: '43 mm' },
      //   packaging: '1,500 Pcs/set',
      //   image: '/images/products/portion/portion-150ml.webp',
      //   applications: ['Side Dishes', 'Raita', 'Curd', 'Fruit Custard', 'Sambar'],
      //   specs: [
      //     { label: 'Top Diameter', value: '90 mm' },
      //     { label: 'Bottom Diameter', value: '78 mm' },
      //     { label: 'Height', value: '43 mm' },
      //     { label: 'Pack Size', value: '1,500 Pcs/set' }
      //   ]
      // },
      // {
      //   id: 'pc-250',
      //   name: '250ml Portion Cup',
      //   capacity: '250ml',
      //   product_slug: '250ml-portion-cup',
      //   material: 'Virgin PP 05 Food Grade',
      //   quality: 'Export Grade Food Safe',
      //   features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
      //   dimensions: { top: '98 mm', bottom: '73 mm', height: '51 mm' },
      //   packaging: '1,500 Pcs/set',
      //   image: '/images/products/portion/portion-250ml.webp',
      //   applications: ['Single-Serve Soups', 'Desserts', 'Curries', 'Dal', 'Ice Cream'],
      //   specs: [
      //     { label: 'Top Diameter', value: '98 mm' },
      //     { label: 'Bottom Diameter', value: '73 mm' },
      //     { label: 'Height', value: '51 mm' },
      //     { label: 'Pack Size', value: '1,500 Pcs/set' }
      //   ]
      // },
      // {
      //   id: 'pc-1oz',
      //   name: '1 oz Portion Container',
      //   capacity: '30ml (1 oz)',
      //   product_slug: '1oz-portion-container',
      //   material: 'Virgin PP 05',
      //   quality: 'Heavy Duty',
      //   features: ['Stackable', 'Leak Proof', 'Airtight Snap Lid'],
      //   dimensions: { top: '45 mm', height: '30 mm' },
      //   packaging: '1,500 Pcs/set',
      //   image: '/images/products/portion/portion-cups-hero.webp',
      //   applications: ['Sauces', 'Pickles', 'Sampling']
      // },
      // {
      //   id: 'pc-2oz',
      //   name: '2 oz Portion Container',
      //   capacity: '60ml (2 oz)',
      //   product_slug: '2oz-portion-container',
      //   material: 'Virgin PP 05',
      //   quality: 'Heavy Duty',
      //   features: ['Microwave Safe', 'High Stacking Strength'],
      //   dimensions: { top: '62 mm', height: '30 mm' },
      //   packaging: '1,500 Pcs/set',
      //   image: '/images/products/portion/portion-cups-hero.webp',
      //   applications: ['Hummus', 'Gravies', 'Dips']
      // },
      // {
      //   id: 'pc-4oz',
      //   name: '4 oz Portion Container',
      //   capacity: '120ml (4 oz)',
      //   product_slug: '4oz-portion-container',
      //   material: 'Virgin PP 05',
      //   quality: 'Heavy Duty',
      //   features: ['Airtight Fit', 'Crystal Clarity'],
      //   dimensions: { top: '75 mm', height: '43 mm' },
      //   packaging: '1,500 Pcs/set',
      //   image: '/images/products/portion/portion-cups-hero.webp',
      //   applications: ['Coleslaw', 'Side Gravy', 'Desserts']
      // }
    ]
  },
  {
    id: 'ro-series',
    name: 'RO-Series Containers',
    slug: 'ro-series',
    subtitleName: 'Round Food Bowls & Containers',
    shortDescription: 'Heavy-duty injection-moulded round food containers engineered for hot soups, biryani, curries, and QSR takeaway delivery.',
    description: 'Ace Packaging RO-Series Containers feature heavy-duty round geometry with airtight rim locking that withstands hot oil and boiling soup filling up to 120°C. Engineered from 100% virgin food-grade polypropylene (PP 05), completely microwave and deep-freeze safe.',
    heroImage: '/images/products/ro-series/ro-series-hero.webp',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Microwave & Freezer Safe', 'Leak-Proof Snap Lid'],
    gallery: [
      '/images/products/ro-series/ro-series-hero.webp',
      '/images/products/ro-series/ap-ro-48.webp',
      '/images/products/ro-series/ap-ro-40.webp',
      '/images/products/ro-series/ap-ro-32.webp',
      '/images/products/ro-series/ap-ro-24.webp',
      '/images/products/ro-series/ap-ro-16.webp',
      '/images/products/ro-series/ap-ro-12.webp',
      '/images/products/ro-series/ap-ro-10.webp',
      '/images/products/ro-series/ro-series-hero.webp',
      '/images/products/ro-series/ap-ro-16.webp',
      '/images/products/ro-series/ap-ro-24.webp'
    ],
    faqs: [
      { question: 'Can RO-Series containers withstand boiling curries and microwave reheating?', answer: 'Yes, made of high heat-resistant virgin PP 05 withstanding temperatures up to 120°C without warping or softening.' },
      { question: 'What sizes are available in RO-Series?', answer: 'Available in 7 catalogue models: AP-RO-10 through AP-RO-48, plus classic black and white delivery bowls.' }
    ],
    products: [
      {
        id: 'ap-ro-10',
        name: 'AP-RO-10 Round Container',
        capacity: 'AP-RO-10 (250ml / 10oz)',
        product_slug: 'ap-ro-10',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '125 mm', bottom: '90 mm', height: '55 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/ro-series/ap-ro-10.webp',
        applications: ['Soups', 'Gravy Portions', 'Sweets', 'Dal', 'Side Dishes'],
        specs: [
          { label: 'Top Diameter', value: '125 mm' },
          { label: 'Bottom Diameter', value: '90 mm' },
          { label: 'Height', value: '55 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ]
      },
      {
        id: 'ap-ro-12',
        name: 'AP-RO-12 Round Container',
        capacity: 'AP-RO-12 (350ml / 12oz)',
        product_slug: 'ap-ro-12',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '125 mm', bottom: '87 mm', height: '64 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/ro-series/ap-ro-12.webp',
        applications: ['Hot Soups', 'Curries', 'Raita', 'Rice Bowls', 'Desserts'],
        specs: [
          { label: 'Top Diameter', value: '125 mm' },
          { label: 'Bottom Diameter', value: '87 mm' },
          { label: 'Height', value: '64 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ]
      },
      {
        id: 'ap-ro-16',
        name: 'AP-RO-16 Round Container',
        capacity: 'AP-RO-16 (500ml / 16oz)',
        product_slug: 'ap-ro-16',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '160 mm', bottom: '117 mm', height: '52 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/ro-series/ap-ro-16.webp',
        applications: ['Noodle Bowls', 'Biryani', 'Curries', 'Pasta', 'Gravies'],
        specs: [
          { label: 'Top Diameter', value: '160 mm' },
          { label: 'Bottom Diameter', value: '117 mm' },
          { label: 'Height', value: '52 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-ro-24',
        name: 'AP-RO-24 Round Container',
        capacity: 'AP-RO-24 (750ml / 24oz)',
        product_slug: 'ap-ro-24',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '185 mm', bottom: '142 mm', height: '52 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/ro-series/ap-ro-24.webp',
        applications: ['Main Course Rice', 'Biryani Portions', 'Large Curries', 'Noodles'],
        specs: [
          { label: 'Top Diameter', value: '185 mm' },
          { label: 'Bottom Diameter', value: '142 mm' },
          { label: 'Height', value: '52 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-ro-32',
        name: 'AP-RO-32 Round Container',
        capacity: 'AP-RO-32 (1000ml / 32oz)',
        product_slug: 'ap-ro-32',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '185 mm', bottom: '136 mm', height: '67 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/ro-series/ap-ro-32.webp',
        applications: ['Family Curries', 'Combo Meals', 'Fried Rice', 'Salad Bowls'],
        specs: [
          { label: 'Top Diameter', value: '185 mm' },
          { label: 'Bottom Diameter', value: '136 mm' },
          { label: 'Height', value: '67 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-ro-40',
        name: 'AP-RO-40 Round Container',
        capacity: 'AP-RO-40 (1200ml / 40oz)',
        product_slug: 'ap-ro-40',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '185 mm', bottom: '136 mm', height: '78 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/ro-series/ap-ro-40.webp',
        applications: ['Bulk Takeaway', 'Family Meals', 'Cloud Kitchen Curries', 'Party Packs'],
        specs: [
          { label: 'Top Diameter', value: '185 mm' },
          { label: 'Bottom Diameter', value: '136 mm' },
          { label: 'Height', value: '78 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-ro-48',
        name: 'AP-RO-48 Round Container',
        capacity: 'AP-RO-48 (1500ml / 48oz)',
        product_slug: 'ap-ro-48',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '233 mm', bottom: '180 mm', height: '61 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/ro-series/ap-ro-48.webp',
        applications: ['Jumbo Biryani Portions', 'Catering Takeaway', 'Family Packs', 'Bulk Food Storage'],
        specs: [
          { label: 'Top Diameter', value: '233 mm' },
          { label: 'Bottom Diameter', value: '180 mm' },
          { label: 'Height', value: '61 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },

    ]
  },
  {
    id: 're-series',
    name: 'RE-Series Containers',
    slug: 're-series',
    subtitleName: 'Rectangular Food & Bento Meal Boxes',
    shortDescription: 'Rectangular takeaway and bento multi-compartment containers designed for cloud kitchens, meal deliveries, and restaurant takeaway.',
    description: 'Ace Packaging RE-Series Containers feature reinforced rectangular geometry, stackable locking lids, and optional compartment partitions preventing cross-contamination during transit. Built for QSR delivery, thali packaging, and executive lunch combos.',
    heroImage: '/images/products/re-series/re-series-hero.webp',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Stackable Rigid Flange', '100% Virgin PP 05'],
    gallery: [
      '/images/products/re-series/re-series-hero.webp',
      '/images/products/re-series/ap-re-232.webp',
      '/images/products/re-series/ap-re-58.webp',
      '/images/products/re-series/ap-re-48.webp',
      '/images/products/re-series/ap-re-38.webp',
      '/images/products/re-series/ap-re-32.webp',
      '/images/products/re-series/ap-re-28.webp',
      '/images/products/re-series/ap-re-24.webp',
      '/images/products/re-series/ap-re-16.webp',
      '/images/products/re-series/ap-re-12.webp',
      '/images/products/re-series/ap-re-08.webp',
      '/images/products/re-series/re-series-hero.webp'
    ],
    faqs: [
      { question: 'Are RE-Series containers stackable during courier motorcycle transit?', answer: 'Yes, each lid has an engineered indentation nesting securely into the container base below to prevent slipping.' },
      { question: 'What models are included in RE-Series?', answer: 'From AP-RE-08 (250ml) up to AP-RE-58 (1800ml), plus 2, 3, and 4-compartment thali meal boxes.' }
    ],
    products: [
      {
        id: 'ap-re-08',
        name: 'AP-RE-08 Rectangular Container',
        capacity: 'AP-RE-08 (250ml / 8oz)',
        product_slug: 'ap-re-08',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '90 × 135 mm', height: '40 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-08.webp',
        applications: ['Appetizers', 'Starters', 'Snacks', 'Desserts', 'Sauce Portions'],
        specs: [
          { label: 'Top Dimensions', value: '90 × 135 mm' },
          { label: 'Height', value: '40 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-12',
        name: 'AP-RE-12 Rectangular Container',
        capacity: 'AP-RE-12 (350ml / 12oz)',
        product_slug: 'ap-re-12',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '140 × 115 mm', height: '47 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-12.webp',
        applications: ['Side Dishes', 'Salads', 'Rice Dishes', 'Starters'],
        specs: [
          { label: 'Top Dimensions', value: '140 × 115 mm' },
          { label: 'Height', value: '47 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-16',
        name: 'AP-RE-16 Rectangular Container',
        capacity: 'AP-RE-16 (500ml / 16oz)',
        product_slug: 'ap-re-16',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '185 × 126 mm', height: '43 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-16.webp',
        applications: ['Meals', 'Curries', 'Noodles', 'Pasta', 'Rice Dishes'],
        specs: [
          { label: 'Top Dimensions', value: '185 × 126 mm' },
          { label: 'Height', value: '43 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-24',
        name: 'AP-RE-24 Rectangular Container',
        capacity: 'AP-RE-24 (750ml / 24oz)',
        product_slug: 'ap-re-24',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '185 × 126 mm', height: '59 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-24.webp',
        applications: ['Executive Lunch', 'Curry & Rice Combos', 'Biryani', 'Noodles'],
        specs: [
          { label: 'Top Dimensions', value: '185 × 126 mm' },
          { label: 'Height', value: '59 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-28',
        name: 'AP-RE-28 Rectangular Container',
        capacity: 'AP-RE-28 (850ml / 28oz)',
        product_slug: 'ap-re-28',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '223 × 126 mm', height: '47 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-28.webp',
        applications: ['Platters', 'Rolls', 'Grilled Items', 'Asian Combos'],
        specs: [
          { label: 'Top Dimensions', value: '223 × 126 mm' },
          { label: 'Height', value: '47 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-32',
        name: 'AP-RE-32 Rectangular Container',
        capacity: 'AP-RE-32 (1000ml / 32oz)',
        product_slug: 'ap-re-32',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '223 × 152 mm', height: '57 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-32.webp',
        applications: ['Standard Takeaway Meal', 'Rice Combos', 'Pasta', 'Chinese Takeaway'],
        specs: [
          { label: 'Top Dimensions', value: '223 × 152 mm' },
          { label: 'Height', value: '57 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-38',
        name: 'AP-RE-38 Rectangular Container',
        capacity: 'AP-RE-38 (1200ml / 38oz)',
        product_slug: 'ap-re-38',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '223 × 152 mm', height: '63 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-38.webp',
        applications: ['High Capacity Meals', 'Curry + Naan', 'Biryani Combos', 'Family Meals'],
        specs: [
          { label: 'Top Dimensions', value: '223 × 152 mm' },
          { label: 'Height', value: '63 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-48',
        name: 'AP-RE-48 Rectangular Container',
        capacity: 'AP-RE-48 (1500ml / 48oz)',
        product_slug: 'ap-re-48',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '220 × 220 mm', height: '59 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-48.webp',
        applications: ['Square Platter', 'Sharing Meals', 'Bulk Curries', 'Appetizer Assortment'],
        specs: [
          { label: 'Top Dimensions', value: '220 × 220 mm' },
          { label: 'Height', value: '59 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-58',
        name: 'AP-RE-58 Rectangular Container',
        capacity: 'AP-RE-58 (1800ml / 58oz)',
        product_slug: 'ap-re-58',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '290 × 200 mm', height: '56 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-58.webp',
        applications: ['Large Feast Boxes', 'Catering Packs', 'Corporate Buffets', 'Party Trays'],
        specs: [
          { label: 'Top Dimensions', value: '290 × 200 mm' },
          { label: 'Height', value: '56 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ap-re-232',
        name: 'AP-RE-232 2-Compartment Meal Box',
        capacity: 'AP-RE-232 (2-Compartment Bento)',
        product_slug: 'ap-re-232',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '2-Compartment Partition'],
        dimensions: { top: '220 × 150 mm', height: '41 mm' },
        packaging: '150 Pcs/set',
        image: '/images/products/re-series/ap-re-232.webp',
        applications: ['2-Compartment Bento', 'Curry & Rice Combos', 'Noodles & Gravy', 'Executive Thali'],
        specs: [
          { label: 'Top Dimensions', value: '220 × 150 mm' },
          { label: 'Height', value: '41 mm' },
          { label: 'Compartments', value: '2 Chambers' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },

    ]
  },
  {
    id: 'round-containers',
    name: 'Round Containers',
    slug: 'round-containers',
    subtitleName: 'Round Food Tubs & Containers (3 Color Varieties)',
    shortDescription: 'Precision injection-moulded round food tubs with leak-proof snap lids in 3 varieties: Clear Transparent, Deep Black, and Crisp White.',
    description: 'Ace Packaging Round Containers deliver high durability and optical clarity for restaurant takeaway, cloud kitchen orders, dairy items, and sweets packaging. Available across 6 standard capacities in 3 distinct varieties: Clear Transparent, Deep Black, and Crisp White, all precision-moulded with leak-tight snap lids.',
    heroImage: '/images/products/round/round-containers-hero.webp',
    features: ['3 Color Varieties (Transparent, Black, White)', '01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '100% Virgin PP 05', 'Microwave Reheatable'],
    gallery: [
      '/images/products/round/round-containers-hero.webp',
      '/images/products/round/round-500ml-transparent.webp',
      '/images/products/round/round-500ml-black.webp',
      '/images/products/round/round-500ml-white.webp',
      '/images/products/round/round-1000ml-transparent.webp',
      '/images/products/round/round-1000ml-black.webp',
      '/images/products/round/round-1000ml-white.webp',
      '/images/products/round/round-250ml-transparent.webp',
    ],
    faqs: [
      { question: 'What color varieties are available for Round Containers?', answer: 'All Round Container models are manufactured in three standard varieties: Clear Transparent (for maximum food visibility), Deep Black (for upscale restaurant and cloud kitchen delivery), and Crisp White (for dairy, sweets, and bakery packaging).' },
      { question: 'What is the pack size for Round Containers?', answer: 'All Round Container models (250ml to 1000ml) are packed in standard 500 Pcs/set cartons with matching snap-seal lids.' },
      { question: 'Are all 3 varieties food-grade and microwave-safe?', answer: 'Yes, all three varieties (Transparent, Black, White) are moulded from 100% prime virgin PP 05 polymer, certified food-safe with a thermal resistance rating of -20°C to +120°C.' }
    ],
    products: [
      {
        id: 'rc-250',
        name: '250ml Round Container',
        capacity: '250ml',
        product_slug: '250ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '3 Color Varieties'],
        dimensions: { top: '120 mm', bottom: '97 mm', height: '38 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/round/round-250ml-transparent.webp',
        blankImage: '/images/products/round/round-250ml-transparent.webp',
        lockingFoodImage: '/images/products/round/round-containers-hero.webp',
        applications: ['Soups', 'Gravy Portions', 'Sweets', 'Dairy', 'Dahi', 'Condiments'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '97 mm' },
          { label: 'Height', value: '38 mm' },
          { label: 'Varieties', value: 'Transparent, Black, White' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/round/round-250ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/round/round-250ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          },
          {
            name: 'Crisp White',
            slug: 'white',
            colorHex: '#ffffff',
            borderHex: '#e2e8f0',
            image: '/images/products/round/round-250ml-white.webp',
            description: 'Crisp opaque pure white body ideal for dairy, sweets, dips, and cleanroom presentation.'
          }
        ]
      },
      {
        id: 'rc-300',
        name: '300ml Round Container',
        capacity: '300ml',
        product_slug: '300ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '3 Color Varieties'],
        dimensions: { top: '120 mm', bottom: '41 mm', height: '102 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/round/round-300ml-transparent.webp',
        blankImage: '/images/products/round/round-300ml-transparent.webp',
        lockingFoodImage: '/images/products/round/round-containers-hero.webp',
        applications: ['Dal', 'Curries', 'Raita', 'Rice Portions', 'Desserts'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '41 mm' },
          { label: 'Height', value: '102 mm' },
          { label: 'Varieties', value: 'Transparent, Black, White' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/round/round-300ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/round/round-300ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          },
          {
            name: 'Crisp White',
            slug: 'white',
            colorHex: '#ffffff',
            borderHex: '#e2e8f0',
            image: '/images/products/round/round-300ml-white.webp',
            description: 'Crisp opaque pure white body ideal for dairy, sweets, dips, and cleanroom presentation.'
          }
        ]
      },
      {
        id: 'rc-450',
        name: '450ml Round Container',
        capacity: '450ml',
        product_slug: '450ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '3 Color Varieties'],
        dimensions: { top: '120 mm', bottom: '60 mm', height: '98 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/round/round-450ml-transparent.webp',
        blankImage: '/images/products/round/round-450ml-transparent.webp',
        lockingFoodImage: '/images/products/round/round-containers-hero.webp',
        applications: ['Hot Soups', 'Tall Dessert Tubs', 'Curries', 'Noodles'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '60 mm' },
          { label: 'Height', value: '98 mm' },
          { label: 'Varieties', value: 'Transparent, Black, White' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/round/round-450ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/round/round-450ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          },
          {
            name: 'Crisp White',
            slug: 'white',
            colorHex: '#ffffff',
            borderHex: '#e2e8f0',
            image: '/images/products/round/round-450ml-white.webp',
            description: 'Crisp opaque pure white body ideal for dairy, sweets, dips, and cleanroom presentation.'
          }
        ]
      },
      {
        id: 'rc-500',
        name: '500ml Round Container',
        capacity: '500ml',
        product_slug: '500ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '3 Color Varieties'],
        dimensions: { top: '120 mm', bottom: '67 mm', height: '97 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/round/round-500ml-transparent.webp',
        blankImage: '/images/products/round/round-500ml-transparent.webp',
        lockingFoodImage: '/images/products/round/round-containers-hero.webp',
        applications: ['Biryani Portions', 'Gravies', 'Takeaway Curries', 'Pasta'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '67 mm' },
          { label: 'Height', value: '97 mm' },
          { label: 'Varieties', value: 'Transparent, Black, White' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/round/round-500ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/round/round-500ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          },
          {
            name: 'Crisp White',
            slug: 'white',
            colorHex: '#ffffff',
            borderHex: '#e2e8f0',
            image: '/images/products/round/round-500ml-white.webp',
            description: 'Crisp opaque pure white body ideal for dairy, sweets, dips, and cleanroom presentation.'
          }
        ]
      },
      {
        id: 'rc-750',
        name: '750ml Round Container',
        capacity: '750ml',
        product_slug: '750ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '3 Color Varieties'],
        dimensions: { top: '120 mm', bottom: '78 mm', height: '110 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/round/round-750ml-transparent.webp',
        blankImage: '/images/products/round/round-750ml-transparent.webp',
        lockingFoodImage: '/images/products/round/round-containers-hero.webp',
        applications: ['Curries & Rice Combos', 'Hot Soups', 'Noodle Bowls', 'Meal Bowls'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '78 mm' },
          { label: 'Height', value: '110 mm' },
          { label: 'Varieties', value: 'Transparent, Black, White' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/round/round-750ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/round/round-750ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          },
          {
            name: 'Crisp White',
            slug: 'white',
            colorHex: '#ffffff',
            borderHex: '#e2e8f0',
            image: '/images/products/round/round-750ml-white.webp',
            description: 'Crisp opaque pure white body ideal for dairy, sweets, dips, and cleanroom presentation.'
          }
        ]
      },
      {
        id: 'rc-1000',
        name: '1000ml Round Container',
        capacity: '1000ml',
        product_slug: '1000ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '3 Color Varieties'],
        dimensions: { top: '120 mm', bottom: '87 mm', height: '125 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/round/round-1000ml-transparent.webp',
        blankImage: '/images/products/round/round-1000ml-transparent.webp',
        lockingFoodImage: '/images/products/round/round-containers-hero.webp',
        applications: ['Family Curries', 'Bulk Gravies', 'Food Storage', 'Dairy Tubs'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '87 mm' },
          { label: 'Height', value: '125 mm' },
          { label: 'Varieties', value: 'Transparent, Black, White' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/round/round-1000ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/round/round-1000ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          },
          {
            name: 'Crisp White',
            slug: 'white',
            colorHex: '#ffffff',
            borderHex: '#e2e8f0',
            image: '/images/products/round/round-1000ml-white.webp',
            description: 'Crisp opaque pure white body ideal for dairy, sweets, dips, and cleanroom presentation.'
          }
        ]
      }
    ]
  },
  {
    id: 'natraj-containers',
    name: 'Natraj Containers',
    slug: 'natraj-containers',
    subtitleName: 'Confectionery & Sweets Round Packaging',
    shortDescription: 'Rigid round containers custom designed for Indian sweets, confectionery, dry fruits, and mithai packaging.',
    description: 'Ace Packaging Natraj Containers are crafted from pure virgin polypropylene, completely odor-free and chemically inert to preserve the delicate aroma and freshness of traditional ghee sweets, mithai, peda, laddoo, and premium dry fruits.',
    heroImage: '/images/products/natraj/natraj-containers-hero.webp',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Odor-Free Virgin Polymer', 'Airtight Freshness'],
    gallery: [
      '/images/products/natraj/natraj-containers-hero.webp',
      '/images/products/natraj/natraj-750ml.webp',
      '/images/products/natraj/natraj-500ml.webp',
      '/images/products/natraj/natraj-450ml.webp',
      '/images/products/natraj/natraj-250ml.webp'
    ],
    faqs: [
      { question: 'Why are Natraj containers preferred for Indian sweets?', answer: 'Because of their 100% odorless virgin food grade formulation that prevents plastic taint on sensitive ghee and dairy based sweets.' },
      { question: 'What is the standard pack quantity?', answer: 'Supplied in 500 Pcs/set master packs with matching snap-seal lids.' }
    ],
    products: [
      {
        id: 'nc-250',
        name: '250ml Natraj Container',
        capacity: '250ml',
        product_slug: '250ml-natraj-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Confectionery Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Odor Free'],
        dimensions: { top: '115 mm', bottom: '88 mm', height: '40 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/natraj/natraj-250ml.webp',
        blankImage: '/images/products/natraj/natraj-250ml.webp',
        lockingFoodImage: '/images/products/natraj/natraj-containers-hero.webp',
        applications: ['Kaju Katli', 'Peda', 'Laddoo', 'Dry Fruits', 'Mithai'],
        specs: [
          { label: 'Top Diameter', value: '115 mm' },
          { label: 'Bottom Diameter', value: '88 mm' },
          { label: 'Height', value: '40 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'nc-450',
        name: '450ml Natraj Container',
        capacity: '450ml',
        product_slug: '450ml-natraj-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Confectionery Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Odor Free'],
        dimensions: { top: '115 mm', bottom: '88 mm', height: '63 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/natraj/natraj-450ml.webp',
        blankImage: '/images/products/natraj/natraj-450ml.webp',
        lockingFoodImage: '/images/products/natraj/natraj-containers-hero.webp',
        applications: ['Gulab Jamun', 'Rasgulla', 'Halwa', 'Barfi Boxes'],
        specs: [
          { label: 'Top Diameter', value: '115 mm' },
          { label: 'Bottom Diameter', value: '88 mm' },
          { label: 'Height', value: '63 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'nc-500',
        name: '500ml Natraj Container',
        capacity: '500ml',
        product_slug: '500ml-natraj-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Confectionery Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Odor Free'],
        dimensions: { top: '115 mm', bottom: '87 mm', height: '75 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/natraj/natraj-500ml.webp',
        blankImage: '/images/products/natraj/natraj-500ml.webp',
        lockingFoodImage: '/images/products/natraj/natraj-containers-hero.webp',
        applications: ['Assorted Mithai', 'Confectionery', 'Dry Fruits', 'Namkeen'],
        specs: [
          { label: 'Top Diameter', value: '115 mm' },
          { label: 'Bottom Diameter', value: '87 mm' },
          { label: 'Height', value: '75 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'nc-750',
        name: '750ml Natraj Container',
        capacity: '750ml',
        product_slug: '750ml-natraj-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Confectionery Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Odor Free'],
        dimensions: { top: '115 mm', bottom: '82 mm', height: '118 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/natraj/natraj-750ml.webp',
        blankImage: '/images/products/natraj/natraj-750ml.webp',
        lockingFoodImage: '/images/products/natraj/natraj-containers-hero.webp',
        applications: ['Bulk Sweets', 'Syrup Desserts', 'Festive Gift Boxes', 'Dry Fruit Packs'],
        specs: [
          { label: 'Top Diameter', value: '115 mm' },
          { label: 'Bottom Diameter', value: '82 mm' },
          { label: 'Height', value: '118 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'nc-250g-box',
        name: '250g Natraj Sweet Box',
        capacity: '250g',
        product_slug: '250g-natraj-sweet-box',
        material: 'Food Grade Polypropylene',
        quality: 'Confectionery Grade',
        features: ['Odor Free', 'Airtight Freshness'],
        dimensions: { top: '115 mm', bottom: '88 mm', height: '40 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/natraj/natraj-250ml.webp',
        blankImage: '/images/products/natraj/natraj-250ml.webp',
        lockingFoodImage: '/images/products/natraj/natraj-containers-hero.webp',
        applications: ['Kaju Katli', 'Laddoo', 'Peda', 'Dry Fruits']
      },
      {
        id: 'nc-500g-box',
        name: '500g Natraj Sweet Box',
        capacity: '500g',
        product_slug: '500g-natraj-sweet-box',
        material: 'Food Grade Polypropylene',
        quality: 'Luxury Gift Grade',
        features: ['High Transparency', 'Festive Packaging'],
        dimensions: { top: '115 mm', bottom: '87 mm', height: '75 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/natraj/natraj-500ml.webp',
        blankImage: '/images/products/natraj/natraj-500ml.webp',
        lockingFoodImage: '/images/products/natraj/natraj-containers-hero.webp',
        applications: ['Indian Sweets', 'Baklava', 'Chocolates']
      }
    ]
  },
  {
    id: 'zen-series',
    name: 'ZEN Series Containers',
    slug: 'zen-series',
    subtitleName: 'Deep Rectangular Takeaway Containers (Transparent & Black)',
    shortDescription: 'High-capacity rectangular takeaway containers with universal 117×170mm rim in 2 varieties: Clear Transparent and Deep Black.',
    description: 'Ace Packaging ZEN Series Containers feature a uniform 117×170mm top profile across all depths, allowing kitchens to use a single universal lid for multiple capacities (500ml, 650ml, 750ml, 1000ml). Available in both Clear Transparent and Deep Black varieties for high-end food delivery.',
    heroImage: '/images/products/zen/zen-series-hero.webp',
    features: ['2 Color Varieties (Transparent & Black)', '01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Single Universal Lid', 'Microwave Reheatable'],
    gallery: [
      '/images/products/zen/zen-series-hero.webp',
      '/images/products/zen/zen-1000ml.webp',
      '/images/products/zen/zen-black-1000ml.webp',
      '/images/products/zen/zen-750ml.webp',
      '/images/products/zen/zen-black-750ml.webp',
      '/images/products/zen/zen-650ml.webp',
      '/images/products/zen/zen-black-650ml.webp',
      '/images/products/zen/zen-500ml.webp',
      '/images/products/zen/zen-black-500ml.webp'
    ],
    faqs: [
      { question: 'What color varieties are available in ZEN Series?', answer: 'The ZEN Series is available in two professional finishes: Clear Transparent (for maximum food appetite appeal) and Deep Black (for premium takeaway, oriental dishes, and luxury meal combos).' },
      { question: 'Do all ZEN Series capacities share the same lid?', answer: 'Yes, all 500ml, 650ml, 750ml, and 1000ml ZEN containers share the identical 117×170mm rim profile, requiring only one lid size in stock.' },
      { question: 'What is the master carton pack quantity?', answer: '500 Pcs/set per carton with matching lids.' }
    ],
    products: [
      {
        id: 'zen-500',
        name: '500ml ZEN Series Container',
        capacity: '500ml',
        product_slug: '500ml-zen-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '117 × 170 mm', bottom: '146 × 96 mm', height: '39 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/zen/zen-500ml.webp',
        blankImage: '/images/products/zen/zen-500ml.webp',
        lockingFoodImage: '/images/products/zen/zen-series-hero.webp',
        applications: ['Curry & Rice', 'Noodles', 'Pasta', 'Starters', 'Salads'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '146 × 96 mm' },
          { label: 'Height', value: '39 mm' },
          { label: 'Varieties', value: 'Transparent, Black' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/zen/zen-500ml.webp',
            description: 'Optically clear virgin polymer showcasing dish colors and appetizing layering.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/zen/zen-black-500ml.webp',
            description: 'Executive jet-black satin body creating an elegant fine-dining takeaway aesthetic.'
          }
        ]
      },
      {
        id: 'zen-650',
        name: '650ml ZEN Series Container',
        capacity: '650ml',
        product_slug: '650ml-zen-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '117 × 170 mm', bottom: '142 × 90 mm', height: '50 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/zen/zen-650ml.webp',
        blankImage: '/images/products/zen/zen-650ml.webp',
        lockingFoodImage: '/images/products/zen/zen-series-hero.webp',
        applications: ['Biryani Portions', 'Chinese Takeaway', 'Fried Rice', 'Pasta Combos'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '142 × 90 mm' },
          { label: 'Height', value: '50 mm' },
          { label: 'Varieties', value: 'Transparent, Black' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/zen/zen-650ml.webp',
            description: 'Optically clear virgin polymer showcasing dish colors and appetizing layering.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/zen/zen-black-650ml.webp',
            description: 'Executive jet-black satin body creating an elegant fine-dining takeaway aesthetic.'
          }
        ]
      },
      {
        id: 'zen-750',
        name: '750ml ZEN Series Container',
        capacity: '750ml',
        product_slug: '750ml-zen-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '117 × 170 mm', bottom: '140 × 87 mm', height: '57 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/zen/zen-750ml.webp',
        blankImage: '/images/products/zen/zen-750ml.webp',
        lockingFoodImage: '/images/products/zen/zen-series-hero.webp',
        applications: ['Full Meals', 'Gravies', 'Combo Platters', 'Cloud Kitchen Orders'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '140 × 87 mm' },
          { label: 'Height', value: '57 mm' },
          { label: 'Varieties', value: 'Transparent, Black' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/zen/zen-750ml.webp',
            description: 'Optically clear virgin polymer showcasing dish colors and appetizing layering.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/zen/zen-black-750ml.webp',
            description: 'Executive jet-black satin body creating an elegant fine-dining takeaway aesthetic.'
          }
        ]
      },
      {
        id: 'zen-1000',
        name: '1000ml ZEN Series Container',
        capacity: '1000ml',
        product_slug: '1000ml-zen-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '117 × 170 mm', bottom: '132 × 88 mm', height: '75 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/zen/zen-1000ml.webp',
        blankImage: '/images/products/zen/zen-1000ml.webp',
        lockingFoodImage: '/images/products/zen/zen-series-hero.webp',
        applications: ['Family Portions', 'Bulk Curries', 'Large Biryani', 'Party Orders'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '132 × 88 mm' },
          { label: 'Height', value: '75 mm' },
          { label: 'Varieties', value: 'Transparent, Black' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/zen/zen-1000ml.webp',
            description: 'Optically clear virgin polymer showcasing dish colors and appetizing layering.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/zen/zen-black-1000ml.webp',
            description: 'Executive jet-black satin body creating an elegant fine-dining takeaway aesthetic.'
          }
        ]
      }
    ]
  },
  {
    id: 'glass-series-80-dia',
    name: 'Glass Series 80-Dia',
    slug: 'glass-series-80-dia',
    subtitleName: '80mm Rim Diameter Beverage Cups',
    shortDescription: 'Crystal-clarity disposable beverage and dessert cups with standard 80mm rim diameter for juices, teas, and desserts.',
    description: 'Ace Packaging Glass Series 80-Dia cups are manufactured from optically clear virgin food-grade PP polymer. Standard 80mm rim diameter ensures compatibility with universal 80mm flat and dome lids, as well as automatic cup sealing films.',
    heroImage: '/images/products/glass-80/glass-80-hero.webp',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '80mm Universal Rim', 'Heat Seal Ready'],
    gallery: [
      '/images/products/glass-80/glass-80-hero.webp',
      '/images/products/glass-80/glass-80-500ml.webp',
      '/images/products/glass-80/glass-80-350ml.webp',
      '/images/products/glass-80/glass-80-300ml.webp',
      '/images/products/glass-80/glass-80-250ml.webp',
      '/images/products/glass-80/glass-80-200ml.webp'
    ],
    faqs: [
      { question: 'Are these cups compatible with automatic sealing machines?', answer: 'Yes, the precision flat 80mm rim creates a hermetic seal with standard cup sealing films.' },
      { question: 'What lid options are available?', answer: 'Compatible with standard 80mm flat straw-slot lids and dome lids.' }
    ],
    products: [
      {
        id: 'gs80-200',
        name: '200ml Glass Series (80-Dia)',
        capacity: '200ml',
        product_slug: '200ml-glass-80-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Food Service Grade',
        features: ['Ultra Clear', 'Crack Resistant Rim', '01. Premium Quality', '02. Secure Seal'],
        dimensions: { top: '80 mm', bottom: '48 mm', height: '85 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-80/glass-80-200ml.webp',
        blankImage: '/images/products/glass-80/glass-80-200ml.webp',
        lockingFoodImage: '/images/products/glass-80/glass-80-hero.webp',
        applications: ['Juices', 'Cold Brew', 'Chai', 'Desserts', 'Portion Desserts'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '48 mm' },
          { label: 'Height', value: '85 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      },
      {
        id: 'gs80-250',
        name: '250ml Glass Series (80-Dia)',
        capacity: '250ml',
        product_slug: '250ml-glass-80-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Food Service Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '80mm Rim'],
        dimensions: { top: '80 mm', bottom: '48 mm', height: '95 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-80/glass-80-250ml.webp',
        blankImage: '/images/products/glass-80/glass-80-250ml.webp',
        lockingFoodImage: '/images/products/glass-80/glass-80-hero.webp',
        applications: ['Cold Beverages', 'Fresh Juices', 'Chai', 'Iced Drinks', 'Desserts'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '48 mm' },
          { label: 'Height', value: '95 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      },
      {
        id: 'gs80-300',
        name: '300ml Glass Series (80-Dia)',
        capacity: '300ml',
        product_slug: '300ml-glass-80-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Food Service Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '80mm Rim'],
        dimensions: { top: '80 mm', bottom: '49 mm', height: '111 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-80/glass-80-300ml.webp',
        blankImage: '/images/products/glass-80/glass-80-300ml.webp',
        lockingFoodImage: '/images/products/glass-80/glass-80-hero.webp',
        applications: ['Smoothies', 'Cold Brew', 'Soft Drinks', 'Lassi', 'Milkshakes'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '49 mm' },
          { label: 'Height', value: '111 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      },
      {
        id: 'gs80-350',
        name: '350ml Glass Series (80-Dia)',
        capacity: '350ml',
        product_slug: '350ml-glass-80-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Food Service Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '80mm Rim'],
        dimensions: { top: '80 mm', bottom: '51 mm', height: '128 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-80/glass-80-350ml.webp',
        blankImage: '/images/products/glass-80/glass-80-350ml.webp',
        lockingFoodImage: '/images/products/glass-80/glass-80-hero.webp',
        applications: ['Bubble Tea', 'Shakes', 'Iced Coffee', 'Fruit Slush', 'Dessert Parfait'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '51 mm' },
          { label: 'Height', value: '128 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      },
      {
        id: 'gs80-500',
        name: '500ml Glass Series (80-Dia)',
        capacity: '500ml',
        product_slug: '500ml-glass-80-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Food Service Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '80mm Rim'],
        dimensions: { top: '80 mm', bottom: '54 mm', height: '165 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-80/glass-80-500ml.webp',
        blankImage: '/images/products/glass-80/glass-80-500ml.webp',
        lockingFoodImage: '/images/products/glass-80/glass-80-hero.webp',
        applications: ['Large Juices', 'Mega Shakes', 'Iced Teas', 'Summer Coolers'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '54 mm' },
          { label: 'Height', value: '165 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      }
    ]
  },
  {
    id: 'glass-series-90-dia',
    name: 'Glass Series 90-Dia',
    slug: 'glass-series-90-dia',
    subtitleName: '90mm Wide-Mouth Beverage Cups (Plain & Frost)',
    shortDescription: 'Wide-mouth 90mm diameter beverage cups for boba tea, smoothies, shakes, and cold drinks in 2 varieties: Clear Plain and Frosted Matte.',
    description: 'Ace Packaging Glass Series 90-Dia cups feature a 90mm wide opening ideal for chunky boba, whipped cream toppings, and thick smoothies. Available in both Clear Plain (gloss transparency) and Frosted Matte (velvety diffused finish), both compatible with 90mm sealing films and matching snap lids.',
    heroImage: '/images/products/glass-90/glass-90-hero.webp',
    features: ['2 Surface Varieties (Plain & Frost)', '01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '90mm Wide Opening', 'Film Sealing Compatible'],
    gallery: [
      '/images/products/glass-90/glass-90-hero.webp',
      '/images/products/glass-90/glass-90-700ml-plain.webp',
      '/images/products/glass-90/glass-90-700ml-frost.webp',
      '/images/products/glass-90/glass-90-600ml-plain.webp',
      '/images/products/glass-90/glass-90-600ml-frost.webp',
      '/images/products/glass-90/glass-90-500ml-plain.webp',
      '/images/products/glass-90/glass-90-500ml-frost.webp',
      '/images/products/glass-90/glass-90-350ml-plain.webp',
      '/images/products/glass-90/glass-90-350ml-frost.webp'
    ],
    faqs: [
      { question: 'What finish varieties are available in 90-Dia cups?', answer: 'Available in two distinct finishes: Clear Plain (ultra-gloss transparent PP for vibrant beverage presentation) and Frosted Matte (diffused textured exterior for an upscale, tactile craft feel).' },
      { question: 'Can these 90mm cups be sealed with Boba film sealing machines?', answer: 'Yes, standard 90mm sealing film rolls fit perfectly with clean edges across both Plain and Frosted finishes.' },
      { question: 'What sizes are included in 90-Dia?', answer: 'Available in 350ml, 500ml, 600ml, and 700ml capacities, supplied in 1,000 PCS master packaging.' }
    ],
    products: [
      {
        id: 'gs90-350',
        name: '350ml Glass Series (90-Dia)',
        capacity: '350ml',
        product_slug: '350ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim', '2 Surface Varieties'],
        dimensions: { top: '90 mm', bottom: '54 mm', height: '108 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-90/glass-90-350ml-plain.webp',
        blankImage: '/images/products/glass-90/glass-90-350ml-plain.webp',
        lockingFoodImage: '/images/products/glass-90/glass-90-hero.webp',
        applications: ['Boba Tea', 'Iced Latte', 'Cold Brew', 'Thick Shakes', 'Juices'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '54 mm' },
          { label: 'Height', value: '108 mm' },
          { label: 'Varieties', value: 'Clear Plain, Frosted Matte' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ],
        varieties: [
          {
            name: 'Clear Plain',
            slug: 'plain',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/glass-90/glass-90-350ml-plain.webp',
            description: 'Optically clear high-gloss virgin polypropylene with brilliant transparency.'
          },
          {
            name: 'Frosted Matte',
            slug: 'frost',
            colorHex: '#e2e8f0',
            borderHex: '#b99750',
            image: '/images/products/glass-90/glass-90-350ml-frost.webp',
            description: 'Velvety translucent frosted exterior providing premium grip and diffused light aesthetic.'
          }
        ]
      },
      {
        id: 'gs90-500',
        name: '500ml Glass Series (90-Dia)',
        capacity: '500ml',
        product_slug: '500ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim', '2 Surface Varieties'],
        dimensions: { top: '90 mm', bottom: '58 mm', height: '130 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-90/glass-90-500ml-plain.webp',
        blankImage: '/images/products/glass-90/glass-90-500ml-plain.webp',
        lockingFoodImage: '/images/products/glass-90/glass-90-hero.webp',
        applications: ['Bubble Tea', 'Frappuccinos', 'Milkshakes', 'Cold Beverages', 'Smoothies'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '58 mm' },
          { label: 'Height', value: '130 mm' },
          { label: 'Varieties', value: 'Clear Plain, Frosted Matte' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ],
        varieties: [
          {
            name: 'Clear Plain',
            slug: 'plain',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/glass-90/glass-90-500ml-plain.webp',
            description: 'Optically clear high-gloss virgin polypropylene with brilliant transparency.'
          },
          {
            name: 'Frosted Matte',
            slug: 'frost',
            colorHex: '#e2e8f0',
            borderHex: '#b99750',
            image: '/images/products/glass-90/glass-90-500ml-frost.webp',
            description: 'Velvety translucent frosted exterior providing premium grip and diffused light aesthetic.'
          }
        ]
      },
      {
        id: 'gs90-600',
        name: '600ml Glass Series (90-Dia)',
        capacity: '600ml',
        product_slug: '600ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim', '2 Surface Varieties'],
        dimensions: { top: '90 mm', bottom: '55 mm', height: '166 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-90/glass-90-600ml-plain.webp',
        blankImage: '/images/products/glass-90/glass-90-600ml-plain.webp',
        lockingFoodImage: '/images/products/glass-90/glass-90-hero.webp',
        applications: ['Large Boba', 'Fruit Teas', 'Slushes', 'Iced Coffee', 'Lemonades'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '55 mm' },
          { label: 'Height', value: '166 mm' },
          { label: 'Varieties', value: 'Clear Plain, Frosted Matte' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ],
        varieties: [
          {
            name: 'Clear Plain',
            slug: 'plain',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/glass-90/glass-90-600ml-plain.webp',
            description: 'Optically clear high-gloss virgin polypropylene with brilliant transparency.'
          },
          {
            name: 'Frosted Matte',
            slug: 'frost',
            colorHex: '#e2e8f0',
            borderHex: '#b99750',
            image: '/images/products/glass-90/glass-90-600ml-frost.webp',
            description: 'Velvety translucent frosted exterior providing premium grip and diffused light aesthetic.'
          }
        ]
      },
      {
        id: 'gs90-700',
        name: '700ml Glass Series (90-Dia)',
        capacity: '700ml',
        product_slug: '700ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim', '2 Surface Varieties'],
        dimensions: { top: '90 mm', bottom: '55 mm', height: '187 mm' },
        packaging: '1,000 PCS',
        image: '/images/products/glass-90/glass-90-700ml-plain.webp',
        blankImage: '/images/products/glass-90/glass-90-700ml-plain.webp',
        lockingFoodImage: '/images/products/glass-90/glass-90-hero.webp',
        applications: ['Jumbo Drinks', 'Super-Size Boba', 'Mega Shakes', 'Iced Beverage Takeaway'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '55 mm' },
          { label: 'Height', value: '187 mm' },
          { label: 'Varieties', value: 'Clear Plain, Frosted Matte' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ],
        varieties: [
          {
            name: 'Clear Plain',
            slug: 'plain',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/glass-90/glass-90-700ml-plain.webp',
            description: 'Optically clear high-gloss virgin polypropylene with brilliant transparency.'
          },
          {
            name: 'Frosted Matte',
            slug: 'frost',
            colorHex: '#e2e8f0',
            borderHex: '#b99750',
            image: '/images/products/glass-90/glass-90-700ml-frost.webp',
            description: 'Velvety translucent frosted exterior providing premium grip and diffused light aesthetic.'
          }
        ]
      }
    ]
  },
  {
    id: 'flat-containers',
    name: 'Flat Containers',
    slug: 'flat-containers',
    subtitleName: 'Shallow & Wide Food Prep Containers (Transparent & Black)',
    shortDescription: 'Wide presentation surface containers with snap-fit lids in 2 varieties: Clear Transparent and Deep Black for salads, sushi, platters, and bulk meals.',
    description: 'Ace Packaging Flat Containers offer maximum horizontal presentation surface and rigid stacking strength. Available with 148mm and 169mm top profiles in both Clear Transparent and Deep Black varieties, with tight leak-proof snap lids.',
    heroImage: '/images/products/flat/flat-containers-hero.webp',
    features: ['2 Color Varieties (Transparent & Black)', '01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Wide Display Profile', 'Crush-Resistant Stacking'],
    gallery: [
      '/images/products/flat/flat-containers-hero.webp',
      '/images/products/flat/flat-1500ml-transparent.webp',
      '/images/products/flat/flat-1500ml-black.webp',
      '/images/products/flat/flat-1200ml-transparent.webp',
      '/images/products/flat/flat-1200ml-black.webp',
      '/images/products/flat/flat-1000ml-transparent.webp',
      '/images/products/flat/flat-1000ml-black.webp',
      '/images/products/flat/flat-750ml-transparent.webp',
      '/images/products/flat/flat-750ml-black.webp',
      '/images/products/flat/flat-650ml-transparent.webp',
      '/images/products/flat/flat-650ml-black.webp',
      '/images/products/flat/flat-600ml-transparent.webp',
      '/images/products/flat/flat-600ml-black.webp'
    ],
    faqs: [
      { question: 'What finish varieties are available in Flat Containers?', answer: 'Flat Containers from 600ml to 1500ml are manufactured in two standard varieties: Clear Transparent (for maximum salad and sushi display) and Deep Black (for executive bento and gourmet platters).' },
      { question: 'What rim diameters are available in Flat Containers?', answer: '600ml to 1500ml models feature a 148mm top diameter. 2000ml and 2500ml models feature a 169mm diameter.' },
      { question: 'What is the carton pack size?', answer: '300 Pcs/set for sizes up to 1500ml; 100 Pcs/set for 2000ml and 2500ml.' }
    ],
    products: [
      {
        id: 'fc-600',
        name: '600ml Flat Container',
        capacity: '600ml',
        product_slug: '600ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '148 mm', bottom: '125 mm', height: '46 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/flat/flat-600ml-transparent.webp',
        blankImage: '/images/products/flat/flat-600ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Salads', 'Sandwiches', 'Starters', 'Pastries', 'Cut Fruits'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '125 mm' },
          { label: 'Height', value: '46 mm' },
          { label: 'Varieties', value: 'Clear Transparent, Deep Black' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/flat/flat-600ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/flat/flat-600ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          }
        ]
      },
      {
        id: 'fc-650',
        name: '650ml Flat Container',
        capacity: '650ml',
        product_slug: '650ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '148 mm', bottom: '74 mm', height: '62 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/flat/flat-650ml-transparent.webp',
        blankImage: '/images/products/flat/flat-650ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Gourmet Salads', 'Asian Bowls', 'Charcuterie', 'Pasta'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '74 mm' },
          { label: 'Height', value: '62 mm' },
          { label: 'Varieties', value: 'Clear Transparent, Deep Black' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/flat/flat-650ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/flat/flat-650ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          }
        ]
      },
      {
        id: 'fc-750',
        name: '750ml Flat Container',
        capacity: '750ml',
        product_slug: '750ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '148 mm', bottom: '125 mm', height: '55 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/flat/flat-750ml-transparent.webp',
        blankImage: '/images/products/flat/flat-750ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Meals', 'Rice Combos', 'Curries', 'Fresh Cut Fruit Platters'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '125 mm' },
          { label: 'Height', value: '55 mm' },
          { label: 'Varieties', value: 'Clear Transparent, Deep Black' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/flat/flat-750ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/flat/flat-750ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          }
        ]
      },
      {
        id: 'fc-1000',
        name: '1000ml Flat Container',
        capacity: '1000ml',
        product_slug: '1000ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '148 mm', bottom: '116 mm', height: '91 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/flat/flat-1000ml-transparent.webp',
        blankImage: '/images/products/flat/flat-1000ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Family Salads', 'Bulk Rice', 'Curry Tubs', 'Meal Prep'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '116 mm' },
          { label: 'Height', value: '91 mm' },
          { label: 'Varieties', value: 'Clear Transparent, Deep Black' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/flat/flat-1000ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/flat/flat-1000ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          }
        ]
      },
      {
        id: 'fc-1200',
        name: '1200ml Flat Container',
        capacity: '1200ml',
        product_slug: '1200ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '148 mm', bottom: '116 mm', height: '98 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/flat/flat-1200ml-transparent.webp',
        blankImage: '/images/products/flat/flat-1200ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Deep Food Storage', 'Bulk Curries', 'Biryani', 'Commercial Prep'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '116 mm' },
          { label: 'Height', value: '98 mm' },
          { label: 'Varieties', value: 'Clear Transparent, Deep Black' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/flat/flat-1200ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/flat/flat-1200ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          }
        ]
      },
      {
        id: 'fc-1500',
        name: '1500ml Flat Container',
        capacity: '1500ml',
        product_slug: '1500ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '2 Color Varieties'],
        dimensions: { top: '148 mm', bottom: '113 mm', height: '126 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/flat/flat-1500ml-transparent.webp',
        blankImage: '/images/products/flat/flat-1500ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Family Feast Meals', 'Catering Prep', 'Commercial Food Storage'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '113 mm' },
          { label: 'Height', value: '126 mm' },
          { label: 'Varieties', value: 'Clear Transparent, Deep Black' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ],
        varieties: [
          {
            name: 'Clear Transparent',
            slug: 'transparent',
            colorHex: '#cbd5e1',
            borderHex: '#94a3b8',
            image: '/images/products/flat/flat-1500ml-transparent.webp',
            description: 'Ultra-clear virgin polypropylene offering high food visibility for retail and takeaway.'
          },
          {
            name: 'Deep Black',
            slug: 'black',
            colorHex: '#18181b',
            borderHex: '#27272a',
            image: '/images/products/flat/flat-1500ml-black.webp',
            description: 'Sleek luxury deep-black finish engineered for premium dining and cloud kitchen presentation.'
          }
        ]
      },
      {
        id: 'fc-2000',
        name: '2000ml Flat Container',
        capacity: '2000ml',
        product_slug: '2000ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '169 mm', bottom: '139 mm', height: '120 mm' },
        packaging: '100 Pcs/set',
        image: '/images/products/flat/flat-1500ml-transparent.webp',
        blankImage: '/images/products/flat/flat-1500ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Jumbo Bulk Tub', 'Restaurant Batch Storage', 'Bakery Prep', 'Catering'],
        specs: [
          { label: 'Top Diameter', value: '169 mm' },
          { label: 'Bottom Diameter', value: '139 mm' },
          { label: 'Height', value: '120 mm' },
          { label: 'Pack Size', value: '100 Pcs/set' }
        ]
      },
      {
        id: 'fc-2500',
        name: '2500ml Flat Container',
        capacity: '2500ml',
        product_slug: '2500ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '169 mm', bottom: '133 mm', height: '154 mm' },
        packaging: '100 Pcs/set',
        image: '/images/products/flat/flat-1500ml-transparent.webp',
        blankImage: '/images/products/flat/flat-1500ml-transparent.webp',
        lockingFoodImage: '/images/products/flat/flat-containers-hero.webp',
        applications: ['Extra-Large Storage', 'Bulk Batter / Gravies', 'Commercial Catering'],
        specs: [
          { label: 'Top Diameter', value: '169 mm' },
          { label: 'Bottom Diameter', value: '133 mm' },
          { label: 'Height', value: '154 mm' },
          { label: 'Pack Size', value: '100 Pcs/set' }
        ]
      }
    ]
  },
  {
    id: 'deli-series',
    name: 'Deli Series Containers',
    slug: 'deli-series',
    subtitleName: 'Heavy-Duty Round Deli Tubs',
    shortDescription: 'Heavy-duty thick-wall containers with universal 120mm rim diameter for soups, gravies, dairy, and cold salads.',
    description: 'Ace Packaging Deli Series Containers feature uniform 120mm rim diameter across all volumes (8oz to 32oz), allowing high efficiency in kitchen lid inventory. Thick impact-resistant walls provide superior thermal insulation for boiling hot curries or deep freeze storage.',
    heroImage: '/images/products/deli/deli-series-hero.webp',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '120mm Universal Rim', 'Microwave & Freezer Safe'],
    gallery: [
      '/images/products/deli/deli-series-hero.webp',
      '/images/products/deli/deli-8oz.webp',
      '/images/products/deli/deli-12oz.webp',
      '/images/products/deli/deli-16oz.webp',
      '/images/products/deli/deli-24oz.webp',
      '/images/products/deli/deli-32oz.webp'
    ],
    faqs: [
      { question: 'Do all Deli Series sizes use the same lid?', answer: 'Yes! All 5 sizes (8oz, 12oz, 16oz, 24oz, and 32oz) share the same 120mm diameter lid, greatly reducing packaging inventory.' },
      { question: 'What is the standard carton packaging?', answer: 'Packed in 240 Pcs/set master cartons with matching leak-proof lids.' }
    ],
    products: [
      {
        id: 'ds-8oz',
        name: '8 Oz Deli Container',
        capacity: '8 Oz (240ml)',
        product_slug: '8oz-deli-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Commercial Deli Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '120mm Rim'],
        dimensions: { top: '120 mm', bottom: '98 mm', height: '42 mm' },
        packaging: '240 Pcs/set',
        image: '/images/products/deli/deli-8oz.webp',
        blankImage: '/images/products/deli/deli-8oz.webp',
        lockingFoodImage: '/images/products/deli/deli-series-hero.webp',
        applications: ['Dips', 'Coleslaw', 'Side Gravy', 'Hummus', 'Pickles'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '98 mm' },
          { label: 'Height', value: '42 mm' },
          { label: 'Pack Size', value: '240 Pcs/set' }
        ]
      },
      {
        id: 'ds-12oz',
        name: '12 Oz Deli Container',
        capacity: '12 Oz (350ml)',
        product_slug: '12oz-deli-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Commercial Deli Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '120mm Rim'],
        dimensions: { top: '120 mm', bottom: '91 mm', height: '63 mm' },
        packaging: '240 Pcs/set',
        image: '/images/products/deli/deli-12oz.webp',
        blankImage: '/images/products/deli/deli-12oz.webp',
        lockingFoodImage: '/images/products/deli/deli-series-hero.webp',
        applications: ['Hot Soups', 'Side Curries', 'Raita', 'Pasta Salad', 'Desserts'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '91 mm' },
          { label: 'Height', value: '63 mm' },
          { label: 'Pack Size', value: '240 Pcs/set' }
        ]
      },
      {
        id: 'ds-16oz',
        name: '16 Oz Deli Container',
        capacity: '16 Oz (500ml)',
        product_slug: '16oz-deli-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Commercial Deli Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '120mm Rim'],
        dimensions: { top: '120 mm', bottom: '87 mm', height: '79 mm' },
        packaging: '240 Pcs/set',
        image: '/images/products/deli/deli-16oz.webp',
        blankImage: '/images/products/deli/deli-16oz.webp',
        lockingFoodImage: '/images/products/deli/deli-series-hero.webp',
        applications: ['Dal', 'Curries', 'Biryani Portions', 'Yogurt', 'Gravies'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '87 mm' },
          { label: 'Height', value: '79 mm' },
          { label: 'Pack Size', value: '240 Pcs/set' }
        ]
      },
      {
        id: 'ds-24oz',
        name: '24 Oz Deli Container',
        capacity: '24 Oz (750ml)',
        product_slug: '24oz-deli-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Commercial Deli Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '120mm Rim'],
        dimensions: { top: '120 mm', bottom: '86 mm', height: '108 mm' },
        packaging: '240 Pcs/set',
        image: '/images/products/deli/deli-24oz.webp',
        blankImage: '/images/products/deli/deli-24oz.webp',
        lockingFoodImage: '/images/products/deli/deli-series-hero.webp',
        applications: ['Full Curries', 'Soup Takeaway', 'Salads', 'Rice Dishes', 'Noodles'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '86 mm' },
          { label: 'Height', value: '108 mm' },
          { label: 'Pack Size', value: '240 Pcs/set' }
        ]
      },
      {
        id: 'ds-32oz',
        name: '32 Oz Deli Container',
        capacity: '32 Oz (1000ml)',
        product_slug: '32oz-deli-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Commercial Deli Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '120mm Rim'],
        dimensions: { top: '120 mm', bottom: '86 mm', height: '139 mm' },
        packaging: '240 Pcs/set',
        image: '/images/products/deli/deli-32oz.webp',
        blankImage: '/images/products/deli/deli-32oz.webp',
        lockingFoodImage: '/images/products/deli/deli-series-hero.webp',
        applications: ['Family Curries', 'Bulk Soup', 'Food Storage', 'Dairy Tubs', 'Meal Prep'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '86 mm' },
          { label: 'Height', value: '139 mm' },
          { label: 'Pack Size', value: '240 Pcs/set' }
        ]
      }
    ]
  },
  {
    id: 'sweet-box-containers',
    name: 'Sweet Box Containers',
    slug: 'sweet-box-containers',
    subtitleName: 'Confectionery & Mithai Gift Boxes',
    shortDescription: 'Luxury high-clarity square & rectangular containers crafted for Indian sweets, mithai, chocolates, and dry fruit gift packaging.',
    description: 'Ace Packaging Sweet Box Containers feature crystal-clear transparency, airtight closure, and food-safe odorless virgin polypropylene formulation to keep traditional sweets, baklava, and festive dry fruits fresh and appealing.',
    heroImage: '/images/products/sweet-box/sweet-box-hero.webp',
    features: ['Crystal-Clear Clarity', 'Odor-Free Food Safe', 'Airtight Freshness', 'Festive Presentation'],
    gallery: [
      '/images/products/sweet-box/sweet-box-hero.webp',
      '/images/products/sweet-box/sweetbox-500g.webp',
      '/images/products/sweet-box/sweetbox-250g.webp',
      '/images/products/sweet-box/sweetbox-1000g.webp'
    ],
    faqs: [
      { question: 'What sizes are available in Sweet Box Containers?', answer: 'Available in 250gm, 500gms, and 1000gms capacities with matching crystal-clear lids.' },
      { question: 'Is the material safe for ghee and dairy sweets?', answer: 'Yes, manufactured from 100% prime virgin PP 05 with zero plastic odor transfer.' }
    ],
    products: [
      {
        id: 'sb-250g',
        name: 'Sweet Box Container 250gm',
        capacity: '250gm',
        product_slug: '250gm-sweet-box',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Confectionery Luxury Grade',
        features: ['High Transparency', 'Airtight Snap Lid', 'Odor Free'],
        dimensions: { top: '115 × 115 mm', height: '35 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/sweet-box/sweetbox-250g.webp',
        applications: ['Kaju Katli', 'Peda', 'Laddoo', 'Dry Fruits', 'Chocolates']
      },
      {
        id: 'sb-500g',
        name: 'Sweet Box Container 500gms',
        capacity: '500gms',
        product_slug: '500gms-sweet-box',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Confectionery Luxury Grade',
        features: ['High Clarity Optical Lid', 'Rigid Wall', 'Airtight Seal'],
        dimensions: { top: '150 × 150 mm', height: '45 mm' },
        packaging: '500 Pcs/set',
        image: '/images/products/sweet-box/sweetbox-500g.webp',
        applications: ['Assorted Mithai', 'Baklava', 'Dry Fruit Gift Packs', 'Festive Boxes']
      },
      {
        id: 'sb-1000g',
        name: 'Sweet Box Container 1000gms',
        capacity: '1000gms',
        product_slug: '1000gms-sweet-box',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Confectionery Luxury Grade',
        features: ['Heavyweight Base', 'Stackable Ribs', 'Crystal Clear Display'],
        dimensions: { top: '190 × 190 mm', height: '55 mm' },
        packaging: '300 Pcs/set',
        image: '/images/products/sweet-box/sweetbox-1000g.webp',
        applications: ['1kg Sweet Assortments', 'Dry Fruits', 'Celebration Gift Trays']
      }
    ]
  },

];

export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
  if (slug === 'natraj-sweets') {
    return productCategories.find((cat) => cat.slug === 'natraj-containers');
  }
  if (slug === 'sweet-box') {
    return productCategories.find((cat) => cat.slug === 'sweet-box-containers');
  }
  if (slug === 'glass-series') {
    return productCategories.find((cat) => cat.slug === 'glass-series-80-dia');
  }
  return productCategories.find((cat) => cat.slug === slug);
};

export const getAllCategorySlugs = (): string[] => {
  return productCategories.map((cat) => cat.slug);
};

export const getProductBySlugs = (
  categorySlug: string,
  productSlug: string
): { category: ProductCategory; product: ProductItem } | undefined => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  const product = category.products.find(
    (p) =>
      p.product_slug === productSlug ||
      p.id === productSlug ||
      p.product_slug.replace(/-container$/, '') === productSlug ||
      p.product_slug.replace(/-tub$/, '') === productSlug ||
      p.product_slug.replace(/-box$/, '') === productSlug
  );
  if (!product) return undefined;
  return { category, product };
};

export const getAllProductPaths = (): { category_slug: string; product_slug: string }[] => {
  const paths: { category_slug: string; product_slug: string }[] = [];
  productCategories.forEach((cat) => {
    cat.products.forEach((prod) => {
      paths.push({
        category_slug: cat.slug,
        product_slug: prod.product_slug
      });
    });
  });
  return paths;
};
