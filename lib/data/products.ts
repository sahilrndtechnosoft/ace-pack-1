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
    description: 'Ace Packaging Hinge Cups feature a built-in snap-tight hinged lid engineered from 100% virgin polypropylene (PP 05). Designed for high-speed QSR assembly, zero-leak motorcycle delivery, and clear product presentation.',
    heroImage: '/AcePackaging/Hinge Cups.png',
    features: ['Attached Hinged Snap-Lid', '100% Leak-Proof Rim', 'Virgin Food-Grade PP 05', 'Microwave Safe up to 120°C'],
    gallery: [
      '/AcePackaging/Hinge Cups.png',
      '/AcePackaging/Portion Cups.png'
    ],
    faqs: [
      { question: 'Does the hinged lid detach during transport?', answer: 'No, our hinges are engineered with flexible virgin PP polymer tested for over 50 open-close cycles without tearing.' },
      { question: 'What sizes are available in Hinge Cups?', answer: 'Available in 15ml, 25ml, 50ml, 80ml, and 100ml capacities.' }
    ],
    products: [
      {
        id: 'hc-25',
        name: '25ml Hinge Sauce Cup',
        capacity: '25ml',
        product_slug: '25ml-hinge-cup',
        material: 'Virgin PP 05',
        quality: 'Export Grade Food Safe',
        features: ['Attached Snap Lid', 'Clear High Transparency', 'Leak Proof'],
        dimensions: { top: '45mm', height: '28mm' },
        packaging: '2,000 Pcs per Master Carton',
        image: '/AcePackaging/Hinge Cups.png',
        applications: ['Chutneys', 'Dips', 'Ketchup', 'Salad Dressings']
      },
      {
        id: 'hc-50',
        name: '50ml Hinge Gravy Cup',
        capacity: '50ml',
        product_slug: '50ml-hinge-cup',
        material: 'Virgin PP 05',
        quality: 'Export Grade Food Safe',
        features: ['Leak-Proof Snap Rim', 'Microwave Reheatable', 'Stackable Base'],
        dimensions: { top: '55mm', height: '35mm' },
        packaging: '1,500 Pcs per Master Carton',
        image: '/AcePackaging/Hinge Cups.png',
        applications: ['Mayonnaise', 'Raita', 'Soy Sauce', 'Butter Ghee']
      },
      {
        id: 'hc-100',
        name: '100ml Hinge Dessert Cup',
        capacity: '100ml',
        product_slug: '100ml-hinge-cup',
        material: 'Virgin PP 05',
        quality: 'Export Grade Food Safe',
        features: ['Deep Rim Airtight Lock', 'High Clarity PP', 'Freezer Safe'],
        dimensions: { top: '70mm', height: '42mm' },
        packaging: '1,000 Pcs per Master Carton',
        image: '/AcePackaging/Hinge Cups.png',
        applications: ['Desserts', 'Gulab Jamun', 'Dahi Raita', 'Sambar']
      }
    ]
  },
  {
    id: 'portion-cups',
    name: 'Portion Cups',
    slug: 'portion-cups',
    subtitleName: 'Separate Lid Condiment Containers',
    shortDescription: 'High-clarity round portion containers with separate matching snap lids for precise side-dish serving.',
    description: 'Precision portion cups engineered for side sauces, dips, and small sides. Compatible with matching flat leak-resistant lids.',
    heroImage: '/AcePackaging/Portion Cups.png',
    features: ['Crystal Clarity', 'BPA Free Virgin Material', 'Matching Snap Lids'],
    products: [
      {
        id: 'pc-1oz',
        name: '1 oz Portion Container',
        capacity: '30ml (1 oz)',
        product_slug: '1oz-portion-container',
        material: 'Virgin PP 05',
        quality: 'Heavy Duty',
        features: ['Stackable', 'Leak Proof'],
        image: '/AcePackaging/Portion Cups.png',
        applications: ['Sauces', 'Pickles']
      },
      {
        id: 'pc-2oz',
        name: '2 oz Portion Container',
        capacity: '60ml (2 oz)',
        product_slug: '2oz-portion-container',
        material: 'Virgin PP 05',
        quality: 'Heavy Duty',
        features: ['Microwave Safe', 'High Stacking Strength'],
        image: '/AcePackaging/Portion Cups.png',
        applications: ['Hummus', 'Gravies']
      },
      {
        id: 'pc-4oz',
        name: '4 oz Portion Container',
        capacity: '120ml (4 oz)',
        product_slug: '4oz-portion-container',
        material: 'Virgin PP 05',
        quality: 'Heavy Duty',
        features: ['Airtight Fit', 'Crystal Clarity'],
        image: '/AcePackaging/Portion Cups.png',
        applications: ['Coleslaw', 'Side Gravy', 'Desserts']
      }
    ]
  },
  {
    id: 'ro-series',
    name: 'RO-Series Containers',
    slug: 'ro-series',
    subtitleName: 'Round Soup & Bowl Solutions',
    shortDescription: 'Industry-standard round tubs for hot soups, curries, biryani, and food delivery packaging.',
    description: 'The RO Series offers heavy-duty round container geometry with tight rim locking, withstands hot oil and boiling soup filling up to 120°C.',
    heroImage: '/AcePackaging/RO-Series Containers.png',
    features: ['High Heat Tolerance', 'Microwave Reheatable', 'Zero Leakage'],
    gallery: [
      '/AcePackaging/RO-Series Containers.png',
      '/DSC04062.JPG',
      '/DSC03993.JPG',
      '/DSC04053.JPG'
    ],
    products: [
      {
        id: 'ro-250',
        name: 'RO-250 Round Container',
        capacity: '250ml',
        product_slug: 'ro-250ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Premium Food Grade',
        features: ['Microwave Reheatable', 'Leak Proof Snap Rim'],
        image: '/AcePackaging/RO-Series Containers.png',
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
        image: '/AcePackaging/RO-Series Containers.png',
        applications: ['Curries', 'Gravies', 'Noodle Bowls', 'Meal Boxes']
      }
    ]
  },
  {
    id: 're-series',
    name: 'RE-Series Containers',
    slug: 're-series',
    subtitleName: 'Bento Multi-Compartment Meal Boxes',
    shortDescription: 'Multi-compartment bento meal boxes designed for cloud kitchen thali and combo meal delivery.',
    description: 'Engineered with separated compartments preventing meal mixing during transit. Ideal for Indian thali meals, Chinese combos, and executive lunches.',
    heroImage: '/AcePackaging/RE Series Containers.png',
    features: ['Compartment Separation', 'Heavy Gauge Construction', 'Airtight Clear Lid'],
    products: [
      {
        id: 're-2comp',
        name: '2-Compartment Meal Box',
        capacity: '650ml',
        product_slug: '2-compartment-bento-box',
        material: 'Virgin PP 05',
        quality: 'Export Grade',
        features: ['No Flavor Transfer', 'Microwave Safe'],
        image: '/AcePackaging/RE Series Containers.png',
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
        image: '/AcePackaging/RE Series Containers.png',
        applications: ['Executive Lunch', 'Premium Thali', 'Corporate Meals']
      }
    ]
  },
  {
    id: 'round-containers',
    name: 'Round Containers',
    slug: 'round-containers',
    subtitleName: 'Injection Moulded Round Food Tubs',
    shortDescription: 'Deep round food containers with tight snap-fit lids for curries, soups, dairy, and food storage.',
    description: 'High durability injection-moulded round containers ideal for restaurant takeaway, cloud kitchen bulk orders, and dairy packaging.',
    heroImage: '/AcePackaging/Round Containers.png',
    features: ['Durable Wall Geometry', 'High Clarity Optical Lid', 'Food Contact Safe'],
    gallery: [
      '/AcePackaging/Round Containers.png',
      '/DSC04053.JPG'
    ],
    products: [
      {
        id: 'rc-500',
        name: '500ml Round Container',
        capacity: '500ml',
        product_slug: '500ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Standard Grade',
        features: ['Tight Snap Rim', 'Microwave Safe', 'Stackable'],
        image: '/AcePackaging/Round Containers.png',
        applications: ['Curries', 'Gravies', 'Rice', 'Desserts']
      },
      {
        id: 'rc-1000',
        name: '1000ml Round Tub',
        capacity: '1000ml',
        product_slug: '1000ml-round-tub',
        material: 'Virgin PP 05',
        quality: 'Standard Grade',
        features: ['Airtight Lid', 'Microwave Safe', 'High Stacking Strength'],
        image: '/DSC04053.JPG',
        applications: ['Soup', 'Curry', 'Gravy', 'Food Storage']
      }
    ]
  },
  {
    id: 'natraj-containers',
    name: 'Natraj Containers',
    slug: 'natraj-containers',
    subtitleName: 'Confectionery & Sweets Packaging',
    shortDescription: 'Rigid round and confectionery containers custom designed for Indian sweets, dry fruits, and mithai.',
    description: 'Odor-free virgin food-grade polymer containers keeping traditional mithai, sweets, dairy products, and dry fruits fresh.',
    heroImage: '/AcePackaging/Natraj Containers.png',
    features: ['Odorless Virgin Resin', 'Crystal-Clear Lid Option', 'Food Contact Safe'],
    gallery: [
      '/AcePackaging/Natraj Containers.png',
      '/AcePackaging/Sweet Box Containers.png',
      '/DSC03993.JPG'
    ],
    products: [
      {
        id: 'nc-250',
        name: '250g Natraj Sweet Box',
        capacity: '250g',
        product_slug: '250g-natraj-sweet-box',
        material: 'Food Grade Polypropylene',
        quality: 'Confectionery Grade',
        features: ['Odor Free', 'Airtight Freshness'],
        image: '/AcePackaging/Natraj Containers.png',
        applications: ['Kaju Katli', 'Laddoo', 'Peda', 'Dry Fruits']
      },
      {
        id: 'nc-500',
        name: '500g Natraj Sweet Box',
        capacity: '500g',
        product_slug: '500g-natraj-sweet-box',
        material: 'Food Grade Polypropylene',
        quality: 'Luxury Gift Grade',
        features: ['High Transparency', 'Festive Packaging'],
        image: '/AcePackaging/Sweet Box Containers.png',
        applications: ['Indian Sweets', 'Baklava', 'Chocolates']
      }
    ]
  },
  {
    id: 'zen-series',
    name: 'ZEN Series Containers',
    slug: 'zen-series',
    subtitleName: 'Deep Rectangular Delivery Containers',
    shortDescription: 'High-capacity deep rectangular takeaway containers with anti-fog optical clarity lids.',
    description: 'The ZEN Series delivers maximum volumetric efficiency for meal deliveries, noodle boxes, combo platters, and bulk curries.',
    heroImage: '/AcePackaging/ZEN Series Containers.png',
    features: ['High Volume Geometry', 'Anti-Fog Crystal Lid', 'Spill-Proof Locking Bead'],
    gallery: [
      '/AcePackaging/ZEN Series Containers.png'
    ],
    products: [
      {
        id: 'zen-650',
        name: '650ml ZEN Series Container',
        capacity: '650ml',
        product_slug: '650ml-zen-container',
        material: 'Virgin PP 05',
        quality: 'Export Grade',
        features: ['Deep Wall Profile', 'Microwave Reheatable', 'Zero Leakage'],
        image: '/AcePackaging/ZEN Series Containers.png',
        applications: ['Pasta', 'Rice Dishes', 'Noodles', 'Gravies']
      },
      {
        id: 'zen-1000',
        name: '1000ml ZEN Series Container',
        capacity: '1000ml',
        product_slug: '1000ml-zen-container',
        material: 'Virgin PP 05',
        quality: 'Export Grade',
        features: ['Heavyweight Construction', 'Airtight Snap Lid', 'Freezer Safe'],
        image: '/AcePackaging/ZEN Series Containers.png',
        applications: ['Family Combos', 'Bulk Takeaway', 'Cloud Kitchen Curries']
      }
    ]
  },
  {
    id: 'glass-series-80-dia',
    name: 'Glass Series 80-Dia',
    slug: 'glass-series-80-dia',
    subtitleName: '80mm Diameter Cups & Dessert Glasses',
    shortDescription: 'Clear disposable drinking and dessert cups with standard 80mm rim diameter. Compatible with flat and dome lids.',
    description: 'Precision thermoformed and injection moulded transparent cups with 80mm rim diameter. Engineered for cold beverages, fresh juices, mousse, and desserts.',
    heroImage: '/AcePackaging/Glass Series 80-Dia.png',
    features: ['80mm Standard Diameter', 'Crystal Clarity', 'Flat & Dome Lid Compatible', 'BPA Free'],
    gallery: [
      '/AcePackaging/Glass Series 80-Dia.png'
    ],
    products: [
      {
        id: 'gs-80-200',
        name: '200ml Glass Series (80-Dia)',
        capacity: '200ml',
        product_slug: '200ml-glass-80-dia',
        material: 'Virgin PP 05',
        quality: 'Food Service Grade',
        features: ['Ultra Clear', 'Crack Resistant Rim'],
        image: '/AcePackaging/Glass Series 80-Dia.png',
        applications: ['Juices', 'Cold Brew', 'Chai', 'Desserts']
      },
      {
        id: 'gs-80-250',
        name: '250ml Glass Series (80-Dia)',
        capacity: '250ml',
        product_slug: '250ml-glass-80-dia',
        material: 'Virgin PP 05',
        quality: 'Food Service Grade',
        features: ['Dome Lid Ready', 'Rolled Rim for Sip Comfort'],
        image: '/AcePackaging/Glass Series 80-Dia.png',
        applications: ['Smoothies', 'Shakes', 'Iced Beverages']
      }
    ]
  },
  {
    id: 'glass-series-90-dia',
    name: 'Glass Series 90-Dia',
    slug: 'glass-series-90-dia',
    subtitleName: '90mm Diameter Cups & Beverage Glasses',
    shortDescription: 'Wide-mouth 90mm diameter beverage cups for bubble tea, iced coffee, shakes, and smoothies.',
    description: 'Heavy-gauge clear beverage cups designed for modern cafés and beverage brands. 90mm diameter ensures universal lid and sealing film compatibility.',
    heroImage: '/AcePackaging/Glass Series 90-Dia.png',
    features: ['90mm Wide Rim Diameter', 'Heat Seal Film Compatible', 'Dome & Flat Lid Options', 'High Clarity'],
    gallery: [
      '/AcePackaging/Glass Series 90-Dia.png'
    ],
    products: [
      {
        id: 'gs-90-350',
        name: '350ml Glass Series (90-Dia)',
        capacity: '350ml',
        product_slug: '350ml-glass-90-dia',
        material: 'Virgin PP 05',
        quality: 'Café Commercial Grade',
        features: ['Wide Mouth 90mm', 'Universal Lid Fit', 'Optically Clear'],
        image: '/AcePackaging/Glass Series 90-Dia.png',
        applications: ['Boba Tea', 'Iced Coffee', 'Frappés', 'Smoothies']
      },
      {
        id: 'gs-90-500',
        name: '500ml Glass Series (90-Dia)',
        capacity: '500ml',
        product_slug: '500ml-glass-90-dia',
        material: 'Virgin PP 05',
        quality: 'Café Commercial Grade',
        features: ['High Volume', 'Heavy Duty Base', 'Film Sealing Ready'],
        image: '/AcePackaging/Glass Series 90-Dia.png',
        applications: ['Large Beverages', 'Milkshakes', 'Cold Drinks']
      }
    ]
  },
  {
    id: 'flat-containers',
    name: 'Flat Containers',
    slug: 'flat-containers',
    subtitleName: 'Shallow Food Prep & Display Containers',
    shortDescription: 'Wide presentation surface containers with anti-fog optical clarity lids for cold prep and salads.',
    description: 'Wide presentation surface containers with anti-fog optical clarity lids. Rigid corner architecture prevents crushing in delivery tote bags.',
    heroImage: '/AcePackaging/Flat Containers.png',
    features: ['Wide Display Surface', 'Anti-Fog Clarity Lid', 'Crush-Resistant Corners'],
    gallery: [
      '/AcePackaging/Flat Containers.png'
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
        image: '/AcePackaging/Flat Containers.png',
        applications: ['Burgers', 'Sandwiches', 'Fresh Cut Fruits', 'Sushi']
      },
      {
        id: 'fc-650',
        name: '650ml Flat Container',
        capacity: '650ml',
        product_slug: '650ml-flat-container',
        material: 'Virgin PP 05',
        quality: 'Gourmet Food Grade',
        features: ['Anti-Fog High Clarity', 'Stackable Ribbed Base'],
        image: '/AcePackaging/Flat Containers.png',
        applications: ['Gourmet Salads', 'Artisan Pastries', 'Charcuterie']
      }
    ]
  },
  {
    id: 'deli-series',
    name: 'Deli Series Containers',
    slug: 'deli-series',
    subtitleName: 'Heavy-Duty Airtight Round Storage',
    shortDescription: 'Heavyweight thick-wall containers providing superior thermal insulation and airtight snap rim.',
    description: 'Heavyweight thick-wall containers providing superior thermal insulation and impact resistance. Airtight snap rim designed for dairy, takeaway security, and bulk gravies.',
    heroImage: '/AcePackaging/Deli Series Container.png',
    features: ['Airtight Lock Rim', 'Thick Wall Impact Resistance', 'Microwave & Freezer Safe'],
    gallery: [
      '/AcePackaging/Deli Series Container.png'
    ],
    products: [
      {
        id: 'ds-500',
        name: '500ml Deli Container',
        capacity: '500ml',
        product_slug: '500ml-deli-container',
        material: 'Virgin PP 05',
        quality: 'Commercial Deli Grade',
        features: ['Airtight Snap Rim', 'Microwave Reheatable', 'Heavy Gauge'],
        image: '/AcePackaging/Deli Series Container.png',
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
        image: '/AcePackaging/Deli Series Container.png',
        applications: ['Dairy Products', 'Bulk Curries', 'Food Processing']
      }
    ]
  }
];

export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
  if (slug === 'natraj-sweets') {
    return productCategories.find((cat) => cat.slug === 'natraj-containers');
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
  const product = category.products.find((p) => p.product_slug === productSlug);
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
