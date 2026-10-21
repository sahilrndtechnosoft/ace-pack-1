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
    heroImage: '/AcePackaging/Hinge Cups.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Attached Hinged Snap-Lid', '100% Virgin PP 05'],
    gallery: [
      '/AcePackaging/Hinge Cups.png',
      '/AcePackaging/Hinge-Cup-100ml.png',
      '/AcePackaging/Hinge-Cup-50ml.png',
      '/AcePackaging/Hinge-Cup-25ml.png',
      '/AcePackaging/Hinge-Cups-Lifestyle.png'
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
        image: '/AcePackaging/Hinge-Cup-25ml.png',
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
        image: '/AcePackaging/Hinge-Cup-50ml.png',
        applications: ['Gravies', 'Mayonnaise', 'Raita', 'Soy Sauce', 'Butter Ghee'],
        specs: [
          { label: 'Top Diameter', value: '61 mm' },
          { label: 'Bottom Diameter', value: '52 mm' },
          { label: 'Height', value: '25 mm' },
          { label: 'Pack Size', value: '2,000 PCS' }
        ]
      },
      {
        id: 'hc-2oz',
        name: '2 Oz Hinge Cup',
        capacity: '60ml (2 Oz)',
        product_slug: '2oz-hinge-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', 'Attached Living Hinge'],
        dimensions: { top: '65 mm', bottom: '52 mm', height: '30 mm' },
        packaging: '2,000 PCS per Master Pack',
        image: '/AcePackaging/Hinge-Cup-2oz.png',
        applications: ['Dipping Sauces', 'Salad Dressings', 'Tartar Sauce', 'Garlic Dip'],
        specs: [
          { label: 'Top Diameter', value: '65 mm' },
          { label: 'Bottom Diameter', value: '52 mm' },
          { label: 'Height', value: '30 mm' },
          { label: 'Pack Size', value: '2,000 PCS' }
        ]
      },
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
        image: '/AcePackaging/Hinge-Cup-100ml.png',
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
    heroImage: '/AcePackaging/Portion Cups.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Matching Snap Lids', '100% Virgin PP 05'],
    gallery: [
      '/AcePackaging/Portion Cups.png',
      '/AcePackaging/Portion-Cup-250ml.png',
      '/AcePackaging/Portion-Cup-150ml.png',
      '/AcePackaging/Portion-Cup-125ml.png',
      '/AcePackaging/Portion-Cup-100ml.png',
      '/AcePackaging/Portion-Cup-50ml.png',
      '/AcePackaging/Portion-Cups-Lifestyle.png'
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
        image: '/AcePackaging/Portion-Cup-50ml.png',
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
        image: '/AcePackaging/Portion-Cup-100ml.png',
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
        image: '/AcePackaging/Portion-Cup-125ml.png',
        applications: ['Pudding', 'Dips', 'Dessert Samples', 'Coleslaw', 'Side Gravy'],
        specs: [
          { label: 'Top Diameter', value: '80 mm' },
          { label: 'Bottom Diameter', value: '59 mm' },
          { label: 'Height', value: '43 mm' },
          { label: 'Pack Size', value: '1,500 Pcs/set' }
        ]
      },
      {
        id: 'pc-150',
        name: '150ml Portion Cup',
        capacity: '150ml',
        product_slug: '150ml-portion-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '90 mm', bottom: '78 mm', height: '43 mm' },
        packaging: '1,500 Pcs/set',
        image: '/AcePackaging/Portion-Cup-150ml.png',
        applications: ['Side Dishes', 'Raita', 'Curd', 'Fruit Custard', 'Sambar'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '78 mm' },
          { label: 'Height', value: '43 mm' },
          { label: 'Pack Size', value: '1,500 Pcs/set' }
        ]
      },
      {
        id: 'pc-250',
        name: '250ml Portion Cup',
        capacity: '250ml',
        product_slug: '250ml-portion-cup',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '98 mm', bottom: '73 mm', height: '51 mm' },
        packaging: '1,500 Pcs/set',
        image: '/AcePackaging/Portion-Cup-250ml.png',
        applications: ['Single-Serve Soups', 'Desserts', 'Curries', 'Dal', 'Ice Cream'],
        specs: [
          { label: 'Top Diameter', value: '98 mm' },
          { label: 'Bottom Diameter', value: '73 mm' },
          { label: 'Height', value: '51 mm' },
          { label: 'Pack Size', value: '1,500 Pcs/set' }
        ]
      },
      {
        id: 'pc-1oz',
        name: '1 oz Portion Container',
        capacity: '30ml (1 oz)',
        product_slug: '1oz-portion-container',
        material: 'Virgin PP 05',
        quality: 'Heavy Duty',
        features: ['Stackable', 'Leak Proof', 'Airtight Snap Lid'],
        dimensions: { top: '45 mm', height: '30 mm' },
        packaging: '1,500 Pcs/set',
        image: '/AcePackaging/Portion Cups.png',
        applications: ['Sauces', 'Pickles', 'Sampling']
      },
      {
        id: 'pc-2oz',
        name: '2 oz Portion Container',
        capacity: '60ml (2 oz)',
        product_slug: '2oz-portion-container',
        material: 'Virgin PP 05',
        quality: 'Heavy Duty',
        features: ['Microwave Safe', 'High Stacking Strength'],
        dimensions: { top: '62 mm', height: '30 mm' },
        packaging: '1,500 Pcs/set',
        image: '/AcePackaging/Portion Cups.png',
        applications: ['Hummus', 'Gravies', 'Dips']
      },
      {
        id: 'pc-4oz',
        name: '4 oz Portion Container',
        capacity: '120ml (4 oz)',
        product_slug: '4oz-portion-container',
        material: 'Virgin PP 05',
        quality: 'Heavy Duty',
        features: ['Airtight Fit', 'Crystal Clarity'],
        dimensions: { top: '75 mm', height: '43 mm' },
        packaging: '1,500 Pcs/set',
        image: '/AcePackaging/Portion Cups.png',
        applications: ['Coleslaw', 'Side Gravy', 'Desserts']
      }
    ]
  },
  {
    id: 'ro-series',
    name: 'RO-Series Containers',
    slug: 'ro-series',
    subtitleName: 'Round Food Bowls & Containers',
    shortDescription: 'Heavy-duty injection-moulded round food containers engineered for hot soups, biryani, curries, and QSR takeaway delivery.',
    description: 'Ace Packaging RO-Series Containers feature heavy-duty round geometry with airtight rim locking that withstands hot oil and boiling soup filling up to 120°C. Engineered from 100% virgin food-grade polypropylene (PP 05), completely microwave and deep-freeze safe.',
    heroImage: '/AcePackaging/RO-Series Containers.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Microwave & Freezer Safe', 'Leak-Proof Snap Lid'],
    gallery: [
      '/AcePackaging/RO-Series Containers.png',
      '/AcePackaging/AP-RO-48.png',
      '/AcePackaging/AP-RO-40.png',
      '/AcePackaging/AP-RO-32.png',
      '/AcePackaging/AP-RO-24.png',
      '/AcePackaging/AP-RO-16.png',
      '/AcePackaging/AP-RO-12.png',
      '/AcePackaging/AP-RO-10.png',
      '/AcePackaging/RO-Series-Lifestyle.png',
      '/DSC04062.JPG',
      '/DSC03993.JPG'
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
        image: '/AcePackaging/AP-RO-10.png',
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
        image: '/AcePackaging/AP-RO-12.png',
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
        image: '/AcePackaging/AP-RO-16.png',
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
        image: '/AcePackaging/AP-RO-24.png',
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
        image: '/AcePackaging/AP-RO-32.png',
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
        image: '/AcePackaging/AP-RO-40.png',
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
        image: '/AcePackaging/AP-RO-48.png',
        applications: ['Jumbo Biryani Portions', 'Catering Takeaway', 'Family Packs', 'Bulk Food Storage'],
        specs: [
          { label: 'Top Diameter', value: '233 mm' },
          { label: 'Bottom Diameter', value: '180 mm' },
          { label: 'Height', value: '61 mm' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 'ro-250',
        name: 'RO-250 Round Container',
        capacity: '250ml',
        product_slug: 'ro-250ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Premium Food Grade',
        features: ['Microwave Reheatable', 'Leak Proof Snap Rim'],
        image: '/AcePackaging/AP-RO-10.png',
        applications: ['Soups', 'Gravies', 'Sweets']
      },
      {
        id: 'ro-500',
        name: 'RO-500 Round Container (Black)',
        capacity: '500ml',
        product_slug: 'ro-500ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Premium Food Grade',
        features: ['Heavy Duty Wall', 'Freezer Safe down to -20°C', 'Standard Black Finish'],
        image: '/DSC04062.JPG',
        applications: ['Biryani', 'Curries', 'Noodles', 'Cloud Kitchens']
      },
      {
        id: 'ro-750',
        name: 'RO-750 Round Container (White)',
        capacity: '750ml',
        product_slug: 'ro-750ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Premium Food Grade',
        features: ['High Stacking Strength', 'Hermetic Seal', 'Crisp White Finish'],
        image: '/DSC03993.JPG',
        applications: ['Family Meals', 'Curries', 'Bulk Food', 'Rice Combos']
      },
      {
        id: 'ro-1000',
        name: 'RO-1000 Round Container',
        capacity: '1000ml',
        product_slug: 'ro-1000ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Export Grade Food Safe',
        features: ['Extra Rigid Flange', 'Full Rim Seal', 'Microwave Reheatable'],
        image: '/AcePackaging/AP-RO-32.png',
        applications: ['Curries', 'Gravies', 'Noodle Bowls', 'Meal Boxes']
      }
    ]
  },
  {
    id: 're-series',
    name: 'RE-Series Containers',
    slug: 're-series',
    subtitleName: 'Rectangular Food & Bento Meal Boxes',
    shortDescription: 'Rectangular takeaway and bento multi-compartment containers designed for cloud kitchens, meal deliveries, and restaurant takeaway.',
    description: 'Ace Packaging RE-Series Containers feature reinforced rectangular geometry, stackable locking lids, and optional compartment partitions preventing cross-contamination during transit. Built for QSR delivery, thali packaging, and executive lunch combos.',
    heroImage: '/AcePackaging/RE Series Containers.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Stackable Rigid Flange', '100% Virgin PP 05'],
    gallery: [
      '/AcePackaging/RE Series Containers.png',
      '/AcePackaging/AP-RE-232.png',
      '/AcePackaging/AP-RE-58.png',
      '/AcePackaging/AP-RE-48.png',
      '/AcePackaging/AP-RE-38.png',
      '/AcePackaging/AP-RE-32.png',
      '/AcePackaging/AP-RE-28.png',
      '/AcePackaging/AP-RE-24.png',
      '/AcePackaging/AP-RE-16.png',
      '/AcePackaging/AP-RE-12.png',
      '/AcePackaging/AP-RE-08.png',
      '/AcePackaging/RE-Series-Lifestyle.png'
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
        image: '/AcePackaging/AP-RE-08.png',
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
        image: '/AcePackaging/AP-RE-12.png',
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
        image: '/AcePackaging/AP-RE-16.png',
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
        image: '/AcePackaging/AP-RE-24.png',
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
        image: '/AcePackaging/AP-RE-28.png',
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
        image: '/AcePackaging/AP-RE-32.png',
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
        image: '/AcePackaging/AP-RE-38.png',
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
        image: '/AcePackaging/AP-RE-48.png',
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
        image: '/AcePackaging/AP-RE-58.png',
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
        image: '/AcePackaging/AP-RE-232.png',
        applications: ['2-Compartment Bento', 'Curry & Rice Combos', 'Noodles & Gravy', 'Executive Thali'],
        specs: [
          { label: 'Top Dimensions', value: '220 × 150 mm' },
          { label: 'Height', value: '41 mm' },
          { label: 'Compartments', value: '2 Chambers' },
          { label: 'Pack Size', value: '150 Pcs/set' }
        ]
      },
      {
        id: 're-2comp',
        name: '2-Compartment Bento Box',
        capacity: '650ml',
        product_slug: '2-compartment-bento-box',
        material: 'Virgin PP 05',
        quality: 'Export Grade',
        features: ['No Flavor Transfer', 'Microwave Safe'],
        dimensions: { top: '220 × 150 mm', height: '41 mm' },
        packaging: '150 Pcs/set',
        image: '/AcePackaging/AP-RE-232.png',
        applications: ['Curry & Rice', 'Noodles & Manchurian']
      },
      {
        id: 're-3comp',
        name: '3-Compartment Thali Box',
        capacity: '1000ml',
        product_slug: '3-compartment-thali-box',
        material: 'Virgin PP 05',
        quality: 'Export Grade',
        features: ['3 Flavor Separation', 'Ultra Clear Lid'],
        dimensions: { top: '240 × 180 mm', height: '48 mm' },
        packaging: '150 Pcs/set',
        image: '/AcePackaging/RE Series Containers.png',
        applications: ['Indian Combo Thali', 'Salad Meal']
      },
      {
        id: 're-4comp',
        name: '4-Compartment Executive Box',
        capacity: '1200ml',
        product_slug: '4-compartment-executive-box',
        material: 'Virgin PP 05',
        quality: 'Export Grade',
        features: ['Isolated Chambers', 'Zero Leak Between Chambers', 'Anti-Fog Lid'],
        dimensions: { top: '260 × 210 mm', height: '50 mm' },
        packaging: '150 Pcs/set',
        image: '/AcePackaging/RE Series Containers.png',
        applications: ['Executive Lunch', 'Premium Thali', 'Corporate Meals']
      }
    ]
  },
  {
    id: 'round-containers',
    name: 'Round Containers',
    slug: 'round-containers',
    subtitleName: 'Deep Round Food Tubs & Containers',
    shortDescription: 'Standard injection-moulded round food tubs with tight snap-fit lids for curries, soups, dairy, and confectionery.',
    description: 'Ace Packaging Round Containers deliver high durability and optical clarity for restaurant takeaway, cloud kitchen orders, dairy items, and food packaging. Engineered with precision snap-fit lids that prevent accidental openings.',
    heroImage: '/AcePackaging/Round Containers.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '100% Virgin PP 05', 'Microwave Reheatable'],
    gallery: [
      '/AcePackaging/Round Containers.png',
      '/AcePackaging/Round-1000ml.png',
      '/AcePackaging/Round-500ml.png',
      '/AcePackaging/Round-450ml.png',
      '/AcePackaging/Round-300ml.png',
      '/AcePackaging/Round-250ml.png',
      '/AcePackaging/Round-225ml.png',
      '/AcePackaging/Round-Containers-Lifestyle.png',
      '/DSC04053.JPG'
    ],
    faqs: [
      { question: 'What is the pack size for Round Containers?', answer: 'All Round Container models (225ml to 1000ml) are packed in standard 500 Pcs/set with matching lids.' },
      { question: 'Are these containers safe for microwave reheating and freezing?', answer: 'Yes, manufactured from 100% virgin PP 05 with a temperature range of -20°C to +120°C.' }
    ],
    products: [
      {
        id: 'rc-225',
        name: '225ml Round Container',
        capacity: '225ml',
        product_slug: '225ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '120 mm', bottom: '98 mm', height: '31 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Round-225ml.png',
        applications: ['Chutneys', 'Curries', 'Dips', 'Ice Cream', 'Snacks'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '98 mm' },
          { label: 'Height', value: '31 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'rc-250',
        name: '250ml Round Container',
        capacity: '250ml',
        product_slug: '250ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '120 mm', bottom: '97 mm', height: '38 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Round-250ml.png',
        applications: ['Soups', 'Gravy Portions', 'Sweets', 'Dairy', 'Dahi'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '97 mm' },
          { label: 'Height', value: '38 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'rc-300',
        name: '300ml Round Container',
        capacity: '300ml',
        product_slug: '300ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '120 mm', bottom: '41 mm', height: '102 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Round-300ml.png',
        applications: ['Dal', 'Curries', 'Raita', 'Rice Portions', 'Desserts'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '41 mm' },
          { label: 'Height', value: '102 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'rc-450',
        name: '450ml Round Container',
        capacity: '450ml',
        product_slug: '450ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '120 mm', bottom: '60 mm', height: '98 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Round-450ml.png',
        applications: ['Hot Soups', 'Tall Dessert Tubs', 'Curries', 'Noodles'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '60 mm' },
          { label: 'Height', value: '98 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'rc-500',
        name: '500ml Round Container',
        capacity: '500ml',
        product_slug: '500ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '120 mm', bottom: '67 mm', height: '97 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Round-500ml.png',
        applications: ['Biryani Portions', 'Gravies', 'Takeaway Curries', 'Pasta'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '67 mm' },
          { label: 'Height', value: '97 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'rc-1000',
        name: '1000ml Round Container',
        capacity: '1000ml',
        product_slug: '1000ml-round-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '120 mm', bottom: '87 mm', height: '125 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Round-1000ml.png',
        applications: ['Family Curries', 'Bulk Gravies', 'Food Storage', 'Dairy Tubs'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '87 mm' },
          { label: 'Height', value: '125 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'rc-1000-tub',
        name: '1000ml Round Tub (Clear Translucent)',
        capacity: '1000ml',
        product_slug: '1000ml-round-tub',
        material: 'Virgin PP 05',
        quality: 'Standard Grade',
        features: ['Airtight Lid', 'Microwave Safe', 'High Stacking Strength'],
        dimensions: { top: '120 mm', bottom: '87 mm', height: '125 mm' },
        packaging: '500 Pcs/set',
        image: '/DSC04053.JPG',
        applications: ['Soup', 'Curry', 'Gravy', 'Food Storage']
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
    heroImage: '/AcePackaging/Natraj Containers.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Odor-Free Virgin Polymer', 'Airtight Freshness'],
    gallery: [
      '/AcePackaging/Natraj Containers.png',
      '/AcePackaging/Natraj-750ml.png',
      '/AcePackaging/Natraj-500ml.png',
      '/AcePackaging/Natraj-450ml.png',
      '/AcePackaging/Natraj-250ml.png',
      '/AcePackaging/Sweet Box Containers.png'
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
        image: '/AcePackaging/Natraj-250ml.png',
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
        image: '/AcePackaging/Natraj-450ml.png',
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
        image: '/AcePackaging/Natraj-500ml.png',
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
        image: '/AcePackaging/Natraj-750ml.png',
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
        image: '/AcePackaging/Natraj Containers.png',
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
        image: '/AcePackaging/Sweet Box Containers.png',
        applications: ['Indian Sweets', 'Baklava', 'Chocolates']
      }
    ]
  },
  {
    id: 'zen-series',
    name: 'ZEN Series Containers',
    slug: 'zen-series',
    subtitleName: 'Deep Rectangular Takeaway Containers',
    shortDescription: 'High-capacity rectangular takeaway containers with universal 117×170mm rim and leak-proof snap lids.',
    description: 'Ace Packaging ZEN Series Containers feature a uniform 117×170mm top profile across all depths, allowing kitchens to use a single universal lid for multiple capacities (500ml, 650ml, 750ml, 1000ml). Optimizes inventory while delivering zero-leak transit.',
    heroImage: '/AcePackaging/ZEN Series Containers.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Single Universal Lid', 'Microwave Reheatable'],
    gallery: [
      '/AcePackaging/ZEN Series Containers.png',
      '/AcePackaging/ZEN-1000ml.png',
      '/AcePackaging/ZEN-750ml.png',
      '/AcePackaging/ZEN-650ml.png',
      '/AcePackaging/ZEN-500ml.png'
    ],
    faqs: [
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
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '117 × 170 mm', bottom: '146 × 96 mm', height: '39 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/ZEN-500ml.png',
        applications: ['Curry & Rice', 'Noodles', 'Pasta', 'Starters', 'Salads'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '146 × 96 mm' },
          { label: 'Height', value: '39 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'zen-650',
        name: '650ml ZEN Series Container',
        capacity: '650ml',
        product_slug: '650ml-zen-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '117 × 170 mm', bottom: '142 × 90 mm', height: '50 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/ZEN-650ml.png',
        applications: ['Biryani Portions', 'Chinese Takeaway', 'Fried Rice', 'Pasta Combos'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '142 × 90 mm' },
          { label: 'Height', value: '50 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'zen-750',
        name: '750ml ZEN Series Container',
        capacity: '750ml',
        product_slug: '750ml-zen-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '117 × 170 mm', bottom: '140 × 87 mm', height: '57 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/ZEN-750ml.png',
        applications: ['Full Meals', 'Gravies', 'Combo Platters', 'Cloud Kitchen Orders'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '140 × 87 mm' },
          { label: 'Height', value: '57 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
        ]
      },
      {
        id: 'zen-1000',
        name: '1000ml ZEN Series Container',
        capacity: '1000ml',
        product_slug: '1000ml-zen-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '117 × 170 mm', bottom: '132 × 88 mm', height: '75 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/ZEN-1000ml.png',
        applications: ['Family Portions', 'Bulk Curries', 'Large Biryani', 'Party Orders'],
        specs: [
          { label: 'Top Dimensions', value: '117 × 170 mm' },
          { label: 'Bottom Dimensions', value: '132 × 88 mm' },
          { label: 'Height', value: '75 mm' },
          { label: 'Pack Size', value: '500 Pcs/set' }
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
    heroImage: '/AcePackaging/Glass Series 80-Dia.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '80mm Universal Rim', 'Heat Seal Ready'],
    gallery: [
      '/AcePackaging/Glass Series 80-Dia.png',
      '/AcePackaging/Glass-80-500ml.png',
      '/AcePackaging/Glass-80-350ml.png',
      '/AcePackaging/Glass-80-300ml.png',
      '/AcePackaging/Glass-80-250ml.png'
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
        material: 'Virgin PP 05',
        quality: 'Food Service Grade',
        features: ['Ultra Clear', 'Crack Resistant Rim'],
        dimensions: { top: '80 mm', bottom: '48 mm', height: '85 mm' },
        packaging: '1,000 PCS',
        image: '/AcePackaging/Glass Series 80-Dia.png',
        applications: ['Juices', 'Cold Brew', 'Chai', 'Desserts']
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
        image: '/AcePackaging/Glass-80-250ml.png',
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
        image: '/AcePackaging/Glass-80-300ml.png',
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
        image: '/AcePackaging/Glass-80-350ml.png',
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
        image: '/AcePackaging/Glass-80-500ml.png',
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
    subtitleName: '90mm Wide-Mouth Beverage Cups',
    shortDescription: 'Wide-mouth 90mm diameter transparent cups for boba tea, smoothies, shakes, frappes, and iced coffee.',
    description: 'Ace Packaging Glass Series 90-Dia cups feature a 90mm wide opening ideal for chunky boba, whipped cream toppings, and thick smoothies. Precision rolled rim provides drinking comfort and hermetic film sealing compatibility.',
    heroImage: '/AcePackaging/Glass Series 90-Dia.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '90mm Wide Opening', 'Film Sealing Compatible'],
    gallery: [
      '/AcePackaging/Glass Series 90-Dia.png',
      '/AcePackaging/Glass-90-700ml.png',
      '/AcePackaging/Glass-90-600ml.png',
      '/AcePackaging/Glass-90-500ml.png',
      '/AcePackaging/Glass-90-350ml.png'
    ],
    faqs: [
      { question: 'Can these 90mm cups be sealed with Boba film sealing machines?', answer: 'Yes, standard 90mm sealing film rolls fit perfectly with clean edges.' },
      { question: 'What sizes are included in 90-Dia?', answer: 'Available in 350ml, 500ml, 600ml, and 700ml capacities.' }
    ],
    products: [
      {
        id: 'gs90-350',
        name: '350ml Glass Series (90-Dia)',
        capacity: '350ml',
        product_slug: '350ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim'],
        dimensions: { top: '90 mm', bottom: '54 mm', height: '108 mm' },
        packaging: '1,000 PCS',
        image: '/AcePackaging/Glass-90-350ml.png',
        applications: ['Boba Tea', 'Iced Latte', 'Cold Brew', 'Thick Shakes', 'Juices'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '54 mm' },
          { label: 'Height', value: '108 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      },
      {
        id: 'gs90-500',
        name: '500ml Glass Series (90-Dia)',
        capacity: '500ml',
        product_slug: '500ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim'],
        dimensions: { top: '90 mm', bottom: '58 mm', height: '130 mm' },
        packaging: '1,000 PCS',
        image: '/AcePackaging/Glass-90-500ml.png',
        applications: ['Bubble Tea', 'Frappuccinos', 'Milkshakes', 'Cold Beverages', 'Smoothies'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '58 mm' },
          { label: 'Height', value: '130 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      },
      {
        id: 'gs90-600',
        name: '600ml Glass Series (90-Dia)',
        capacity: '600ml',
        product_slug: '600ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim'],
        dimensions: { top: '90 mm', bottom: '55 mm', height: '166 mm' },
        packaging: '1,000 PCS',
        image: '/AcePackaging/Glass-90-600ml.png',
        applications: ['Large Boba', 'Fruit Teas', 'Slushes', 'Iced Coffee', 'Lemonades'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '55 mm' },
          { label: 'Height', value: '166 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      },
      {
        id: 'gs90-700',
        name: '700ml Glass Series (90-Dia)',
        capacity: '700ml',
        product_slug: '700ml-glass-90-dia',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Café Commercial Grade',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '90mm Wide Rim'],
        dimensions: { top: '90 mm', bottom: '55 mm', height: '187 mm' },
        packaging: '1,000 PCS',
        image: '/AcePackaging/Glass-90-700ml.png',
        applications: ['Jumbo Drinks', 'Super-Size Boba', 'Mega Shakes', 'Iced Beverage Takeaway'],
        specs: [
          { label: 'Top Diameter', value: '90 mm' },
          { label: 'Bottom Diameter', value: '55 mm' },
          { label: 'Height', value: '187 mm' },
          { label: 'Pack Size', value: '1,000 PCS' }
        ]
      }
    ]
  },
  {
    id: 'flat-containers',
    name: 'Flat Containers',
    slug: 'flat-containers',
    subtitleName: 'Shallow & Wide Food Prep Containers',
    shortDescription: 'Wide presentation surface containers with snap-fit lids for salads, gourmet preparations, sushi, and bulk food packaging.',
    description: 'Ace Packaging Flat Containers offer maximum horizontal presentation surface and rigid stacking strength. Available with 148mm and 169mm top profiles with tight leak-proof snap lids.',
    heroImage: '/AcePackaging/Flat Containers.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', 'Wide Display Profile', 'Crush-Resistant Stacking'],
    gallery: [
      '/AcePackaging/Flat Containers.png',
      '/AcePackaging/Flat-2500ml.png',
      '/AcePackaging/Flat-2000ml.png',
      '/AcePackaging/Flat-1500ml.png',
      '/AcePackaging/Flat-1200ml.png',
      '/AcePackaging/Flat-1000ml.png',
      '/AcePackaging/Flat-750ml.png',
      '/AcePackaging/Flat-650ml.png',
      '/AcePackaging/Flat-600ml.png'
    ],
    faqs: [
      { question: 'What rim diameters are available in Flat Containers?', answer: '600ml to 1500ml models feature a 148mm top diameter. 2000ml and 2500ml models feature a 169mm diameter.' },
      { question: 'What is the carton pack size?', answer: '300 Pcs/set for sizes up to 1500ml; 100 Pcs/set for 2000ml and 2500ml.' }
    ],
    products: [
      {
        id: 'fc-450',
        name: '450ml Flat Container',
        capacity: '450ml',
        product_slug: '450ml-flat-container',
        material: 'Virgin PP 05',
        quality: 'Gourmet Food Grade',
        features: ['Wide Surface Area', 'Fresh Display Optical Lid'],
        dimensions: { top: '148 mm', bottom: '125 mm', height: '35 mm' },
        packaging: '300 Pcs/set',
        image: '/AcePackaging/Flat-600ml.png',
        applications: ['Burgers', 'Sandwiches', 'Fresh Cut Fruits', 'Sushi']
      },
      {
        id: 'fc-600',
        name: '600ml Flat Container',
        capacity: '600ml',
        product_slug: '600ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '148 mm', bottom: '125 mm', height: '46 mm' },
        packaging: '300 Pcs/set',
        image: '/AcePackaging/Flat-600ml.png',
        applications: ['Salads', 'Sandwiches', 'Starters', 'Pastries', 'Cut Fruits'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '125 mm' },
          { label: 'Height', value: '46 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ]
      },
      {
        id: 'fc-650',
        name: '650ml Flat Container',
        capacity: '650ml',
        product_slug: '650ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '148 mm', bottom: '74 mm', height: '62 mm' },
        packaging: '300 Pcs/set',
        image: '/AcePackaging/Flat-650ml.png',
        applications: ['Gourmet Salads', 'Asian Bowls', 'Charcuterie', 'Pasta'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '74 mm' },
          { label: 'Height', value: '62 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ]
      },
      {
        id: 'fc-750',
        name: '750ml Flat Container',
        capacity: '750ml',
        product_slug: '750ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '148 mm', bottom: '125 mm', height: '55 mm' },
        packaging: '300 Pcs/set',
        image: '/AcePackaging/Flat-750ml.png',
        applications: ['Meals', 'Rice Combos', 'Curries', 'Fresh Cut Fruit Platters'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '125 mm' },
          { label: 'Height', value: '55 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ]
      },
      {
        id: 'fc-1000',
        name: '1000ml Flat Container',
        capacity: '1000ml',
        product_slug: '1000ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '148 mm', bottom: '116 mm', height: '91 mm' },
        packaging: '300 Pcs/set',
        image: '/AcePackaging/Flat-1000ml.png',
        applications: ['Family Salads', 'Bulk Rice', 'Curry Tubs', 'Meal Prep'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '116 mm' },
          { label: 'Height', value: '91 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ]
      },
      {
        id: 'fc-1200',
        name: '1200ml Flat Container',
        capacity: '1200ml',
        product_slug: '1200ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '148 mm', bottom: '116 mm', height: '98 mm' },
        packaging: '300 Pcs/set',
        image: '/AcePackaging/Flat-1200ml.png',
        applications: ['Deep Food Storage', 'Bulk Curries', 'Biryani', 'Commercial Prep'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '116 mm' },
          { label: 'Height', value: '98 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
        ]
      },
      {
        id: 'fc-1500',
        name: '1500ml Flat Container',
        capacity: '1500ml',
        product_slug: '1500ml-flat-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Export Grade Food Safe',
        features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use'],
        dimensions: { top: '148 mm', bottom: '113 mm', height: '126 mm' },
        packaging: '300 Pcs/set',
        image: '/AcePackaging/Flat-1500ml.png',
        applications: ['Family Feast Meals', 'Catering Prep', 'Commercial Food Storage'],
        specs: [
          { label: 'Top Diameter', value: '148 mm' },
          { label: 'Bottom Diameter', value: '113 mm' },
          { label: 'Height', value: '126 mm' },
          { label: 'Pack Size', value: '300 Pcs/set' }
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
        image: '/AcePackaging/Flat-2000ml.png',
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
        image: '/AcePackaging/Flat-2500ml.png',
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
    heroImage: '/AcePackaging/Deli Series Container.png',
    features: ['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom', '04. Versatile Use', '120mm Universal Rim', 'Microwave & Freezer Safe'],
    gallery: [
      '/AcePackaging/Deli Series Container.png',
      '/AcePackaging/Deli-32oz.png',
      '/AcePackaging/Deli-24oz.png',
      '/AcePackaging/Deli-16oz.png',
      '/AcePackaging/Deli-12oz.png',
      '/AcePackaging/Deli-8oz.png',
      '/AcePackaging/Deli-Series-Lifestyle.png'
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
        image: '/AcePackaging/Deli-8oz.png',
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
        image: '/AcePackaging/Deli-12oz.png',
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
        image: '/AcePackaging/Deli-16oz.png',
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
        image: '/AcePackaging/Deli-24oz.png',
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
        image: '/AcePackaging/Deli-32oz.png',
        applications: ['Family Curries', 'Bulk Soup', 'Food Storage', 'Dairy Tubs', 'Meal Prep'],
        specs: [
          { label: 'Top Diameter', value: '120 mm' },
          { label: 'Bottom Diameter', value: '86 mm' },
          { label: 'Height', value: '139 mm' },
          { label: 'Pack Size', value: '240 Pcs/set' }
        ]
      },
      {
        id: 'ds-500',
        name: '500ml Deli Container',
        capacity: '500ml',
        product_slug: '500ml-deli-container',
        material: 'Virgin PP 05',
        quality: 'Commercial Deli Grade',
        features: ['Airtight Snap Rim', 'Microwave Reheatable', 'Heavy Gauge'],
        dimensions: { top: '120 mm', bottom: '87 mm', height: '79 mm' },
        packaging: '240 Pcs/set',
        image: '/AcePackaging/Deli-16oz.png',
        applications: ['Hummus', 'Yogurt', 'Gravies', 'Pickles', 'Salads']
      },
      {
        id: 'ds-750',
        name: '750ml Deli Container',
        capacity: '750ml',
        product_slug: '750ml-deli-container',
        material: 'Virgin PP 05',
        quality: 'Commercial Deli Grade',
        features: ['Hermetic Seal', 'Freezer Safe to -20°C', 'High Impact Wall'],
        dimensions: { top: '120 mm', bottom: '86 mm', height: '108 mm' },
        packaging: '240 Pcs/set',
        image: '/AcePackaging/Deli-24oz.png',
        applications: ['Dairy Products', 'Bulk Curries', 'Food Processing']
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
    heroImage: '/AcePackaging/Sweet Box Containers.png',
    features: ['Crystal-Clear Clarity', 'Odor-Free Food Safe', 'Airtight Freshness', 'Festive Presentation'],
    gallery: [
      '/AcePackaging/Sweet Box Containers.png',
      '/AcePackaging/SweetBox-500g.png',
      '/AcePackaging/SweetBox-250g.png',
      '/AcePackaging/SweetBox-1000g.png'
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
        image: '/AcePackaging/SweetBox-250g.png',
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
        image: '/AcePackaging/SweetBox-500g.png',
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
        image: '/AcePackaging/SweetBox-1000g.png',
        applications: ['1kg Sweet Assortments', 'Dry Fruits', 'Celebration Gift Trays']
      }
    ]
  },
  {
    id: 'elite-containers',
    name: 'Elite Containers',
    slug: 'elite-containers',
    subtitleName: 'Modern Sleek Food Delivery Boxes',
    shortDescription: 'Modern rectangular food delivery containers with reinforced snap-locking rim and sleek contemporary aesthetic.',
    description: 'Ace Packaging Elite Containers combine contemporary aesthetic design with heavy-duty structural rigidity. Ideal for modern cloud kitchens, executive bento delivery, and premium meal takeaway.',
    heroImage: '/AcePackaging/Elite Containers.png',
    features: ['Sleek Modern Profile', 'Reinforced Locking Rim', 'Microwave & Freezer Safe', 'Stackable Base'],
    gallery: [
      '/AcePackaging/Elite Containers.png',
      '/AcePackaging/Elite-1000ml.png',
      '/AcePackaging/Elite-750ml.png',
      '/AcePackaging/Elite-650ml.png',
      '/AcePackaging/Elite-500ml.png'
    ],
    faqs: [
      { question: 'What makes Elite Containers different?', answer: 'Elite containers feature a reinforced low-profile rim and high-rigidity side ribs that offer exceptional crush-resistance during motorcycle courier transit.' },
      { question: 'What capacities are available?', answer: 'Available in 500ml, 650ml, 750ml, and 1000ml.' }
    ],
    products: [
      {
        id: 'ec-500',
        name: 'Elite Container 500ml',
        capacity: '500ml',
        product_slug: '500ml-elite-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Premium Commercial Grade',
        features: ['Reinforced Snap Rim', 'Microwave Reheatable', 'Zero Leakage'],
        dimensions: { top: '172 × 120 mm', height: '38 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Elite-500ml.png',
        applications: ['Curry & Rice', 'Noodles', 'Appetizers', 'Starters']
      },
      {
        id: 'ec-650',
        name: 'Elite Container 650ml',
        capacity: '650ml',
        product_slug: '650ml-elite-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Premium Commercial Grade',
        features: ['Modern Low Profile', 'Stackable Ribs', 'Airtight Closure'],
        dimensions: { top: '172 × 120 mm', height: '48 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Elite-650ml.png',
        applications: ['Biryani Portions', 'Fried Rice', 'Pasta Combos', 'Main Courses']
      },
      {
        id: 'ec-750',
        name: 'Elite Container 750ml',
        capacity: '750ml',
        product_slug: '750ml-elite-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Premium Commercial Grade',
        features: ['Extra Rigid Flange', 'Thermal Safe -20°C to +120°C'],
        dimensions: { top: '172 × 120 mm', height: '55 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Elite-750ml.png',
        applications: ['Full Meals', 'Gravies', 'Combo Platters', 'Cloud Kitchen Orders']
      },
      {
        id: 'ec-1000',
        name: 'Elite Container 1000ml',
        capacity: '1000ml',
        product_slug: '1000ml-elite-container',
        material: 'Virgin PP 05 Food Grade',
        quality: 'Premium Commercial Grade',
        features: ['Maximum Volume', 'Heavy Impact Resistance', 'Optical Clear Lid'],
        dimensions: { top: '172 × 120 mm', height: '68 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Elite-1000ml.png',
        applications: ['Family Portions', 'Bulk Curries', 'Party Meals']
      }
    ]
  },
  {
    id: 'tamper-evident',
    name: 'Tamper Evident Containers',
    slug: 'tamper-evident',
    subtitleName: 'Security Lock Food Containers',
    shortDescription: 'Security tab lock containers assuring end consumers of untouched food integrity and zero tampering.',
    description: 'Containers with breakable security tabs guaranteeing food freshness and anti-tamper security for dairy, delivery, and food retail.',
    heroImage: '/AcePackaging/Deli Series Container.png',
    features: ['Breakable Security Tab', '100% Leak Proof', 'Tamper Evident Seal'],
    products: [
      {
        id: 'te-500',
        name: '500ml Tamper Evident Tub',
        capacity: '500ml',
        product_slug: '500ml-tamper-evident-tub',
        material: 'Virgin PP 05',
        quality: 'Security Certified',
        features: ['Lock Tab', 'Hermetic Seal'],
        dimensions: { top: '120 mm', height: '79 mm' },
        packaging: '240 Pcs/set',
        image: '/AcePackaging/Deli-16oz.png',
        applications: ['Dairy Products', 'Yogurt', 'Gravies', 'Pickles']
      }
    ]
  },
  {
    id: 'meal-boxes',
    name: 'Meal Boxes',
    slug: 'meal-boxes',
    subtitleName: 'Executive Combo Meal Packaging',
    shortDescription: 'Sleek meal packaging boxes tailored for airlines, corporate catering, and train meals.',
    description: 'Compact stackable combo boxes optimized for volume meal distribution and multi-item executive lunches.',
    heroImage: '/AcePackaging/RE Series Containers.png',
    features: ['Compact Geometry', 'Stackable Base', 'Multi-Chamber Options'],
    products: [
      {
        id: 'mb-exec',
        name: 'Executive Combo Meal Box',
        capacity: '850ml',
        product_slug: 'executive-combo-meal-box',
        material: 'Virgin PP 05',
        quality: 'Commercial Airline Grade',
        features: ['Zero Flavor Leak', 'Space Saving'],
        dimensions: { top: '223 × 126 mm', height: '47 mm' },
        packaging: '150 Pcs/set',
        image: '/AcePackaging/AP-RE-28.png',
        applications: ['Corporate Lunches', 'Airline Meals', 'Catering Combos']
      }
    ]
  },
  {
    id: 'ice-cream-tubs',
    name: 'Ice Cream Tubs',
    slug: 'ice-cream-tubs',
    subtitleName: 'Deep-Freeze Ice Cream & Dairy Packaging',
    shortDescription: 'Freezer-grade plastic containers resistant to low-temperature embrittlement down to -30°C.',
    description: 'Designed specifically for ice cream manufacturers, frozen yogurts, and gelato packaging with leak-proof lids.',
    heroImage: '/AcePackaging/Round Containers.png',
    features: ['Deep Freeze Safe down to -30°C', 'High Moisture Barrier', 'Crack Resistant'],
    products: [
      {
        id: 'ict-500',
        name: '500ml Ice Cream Tub',
        capacity: '500ml',
        product_slug: '500ml-ice-cream-tub',
        material: 'Impact Modified PP',
        quality: 'Dairy Grade',
        features: ['Crack Resistant', 'IML Printable', 'Deep Freeze Safe'],
        dimensions: { top: '120 mm', bottom: '67 mm', height: '97 mm' },
        packaging: '500 Pcs/set',
        image: '/AcePackaging/Round-500ml.png',
        applications: ['Ice Cream', 'Frozen Yogurt', 'Gelato', 'Kulfi']
      }
    ]
  },
  {
    id: 'custom-iml',
    name: 'Custom IML Packaging',
    slug: 'custom-iml',
    subtitleName: 'In-Mould Labelling Branded Packaging',
    shortDescription: 'Full-color high definition IML printed containers for high brand recall.',
    description: 'In-Mould Labelling fuses vibrant artwork directly into container walls during moulding for permanent scratch-resistant branding.',
    heroImage: '/AcePackaging/ZEN Series Containers.png',
    features: ['Waterproof Printing', 'Scratch Resistance', 'Full Cover Artwork', 'High Definition'],
    products: [
      {
        id: 'iml-custom',
        name: 'Custom Printed IML Tub',
        capacity: 'Custom Capacity',
        product_slug: 'custom-printed-iml-tub',
        material: 'Virgin PP 05 + IML Film',
        quality: 'Custom Branded',
        features: ['Full HD Graphics', '100% Recyclable'],
        dimensions: { top: 'Custom', height: 'Custom' },
        packaging: 'Per Client Specification',
        image: '/AcePackaging/ZEN Series Containers.png',
        applications: ['Brand Retail Packaging', 'Butter', 'Cheese', 'Ice Cream']
      }
    ]
  }
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
