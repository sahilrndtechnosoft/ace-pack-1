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
    subtitleName: 'One-Piece Hinged Sauce Containers',
    shortDescription: 'Leak-proof one-piece hinged lids for chutneys, dips, dressings, and condiments. Attached lid eliminates lost cap inventory in busy kitchens.',
    description: 'Ace Packaging Hinge Cups feature a built-in snap-tight hinged lid engineered from 100% virgin polypropylene (PP 05). Designed for high-speed QSR assembly, zero-leak motorcycle delivery, and clear product presentation.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
    features: ['Attached Hinged Snap-Lid', '100% Leak-Proof Rim', 'Virgin Food-Grade PP 05', 'Microwave Safe up to 120°C'],
    gallery: [
      'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
      'https://plus.unsplash.com/premium_photo-1701213306476-132f16a0a01e?w=800&auto=format&fit=crop'
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
        image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
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
        image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
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
        image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
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
    heroImage: 'https://plus.unsplash.com/premium_photo-1701213306476-132f16a0a01e?w=800&auto=format&fit=crop',
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
        image: 'https://plus.unsplash.com/premium_photo-1701213306476-132f16a0a01e?w=800&auto=format&fit=crop',
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
        image: 'https://plus.unsplash.com/premium_photo-1701213306476-132f16a0a01e?w=800&auto=format&fit=crop',
        applications: ['Hummus', 'Gravies']
      }
    ]
  },
  {
    id: 'ro-series',
    name: 'RO Series Round Containers',
    slug: 'ro-series',
    subtitleName: 'Round Injection Moulded Containers',
    shortDescription: 'Industry-standard round tubs for hot soups, curries, biryani, and food delivery packaging.',
    description: 'The RO Series offers heavy-duty round container geometry with tight rim locking, withstands hot oil and boiling soup filling up to 120°C.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
    features: ['High Heat Tolerance', 'Microwave Reheatable', 'Zero Leakage'],
    products: [
      {
        id: 'ro-250',
        name: 'RO-250 Round Container',
        capacity: '250ml',
        product_slug: 'ro-250ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Premium Food Grade',
        features: ['Microwave Reheatable', 'Leak Proof Snap Rim'],
        image: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
        applications: ['Soups', 'Gravies', 'Sweets']
      },
      {
        id: 'ro-500',
        name: 'RO-500 Round Container',
        capacity: '500ml',
        product_slug: 'ro-500ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Premium Food Grade',
        features: ['Heavy Duty Wall', 'Freezer Safe down to -20°C'],
        image: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
        applications: ['Biryani', 'Curries', 'Ice Cream']
      },
      {
        id: 'ro-750',
        name: 'RO-750 Round Container',
        capacity: '750ml',
        product_slug: 'ro-750ml-round-container',
        material: 'Virgin PP 05',
        quality: 'Premium Food Grade',
        features: ['High Stacking Strength', 'Hermetic Seal'],
        image: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
        applications: ['Family Meals', 'Curries', 'Bulk Food']
      }
    ]
  },
  {
    id: 're-series',
    name: 'RE Series Bento Boxes',
    slug: 're-series',
    subtitleName: 'Rectangular Compartment Containers',
    shortDescription: 'Multi-compartment bento meal boxes designed for cloud kitchen thali and combo meal delivery.',
    description: 'Engineered with separated compartments preventing meal mixing during transit. Ideal for Indian thali meals, Chinese combos, and executive lunches.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1701213306583-082f9bfd88b4?w=800&auto=format&fit=crop',
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
        image: 'https://plus.unsplash.com/premium_photo-1701213306583-082f9bfd88b4?w=800&auto=format&fit=crop',
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
        image: 'https://plus.unsplash.com/premium_photo-1701213306583-082f9bfd88b4?w=800&auto=format&fit=crop',
        applications: ['Indian Combo Thali', 'Salad Meal']
      }
    ]
  },
  {
    id: 'round-containers',
    name: 'Round Containers',
    slug: 'round-containers',
    subtitleName: 'Standard Round Food Tubs',
    shortDescription: 'Versatile food-grade round tubs for bakeries, food processors, and catering.',
    description: 'High durability round tubs ideal for food storage, prep, and delivery.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
    features: ['Durable Wall Geometry', 'High Clarity', 'Food Contact Safe'],
    products: [
      {
        id: 'rc-1000',
        name: '1000ml Round Tub',
        capacity: '1000ml',
        product_slug: '1000ml-round-tub',
        material: 'Virgin PP 05',
        quality: 'Standard Grade',
        features: ['Airtight Lid', 'Microwave Safe'],
        image: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
        applications: ['Soup', 'Curry', 'Gravy']
      }
    ]
  },
  {
    id: 'natraj-sweets',
    name: 'Natraj Sweets Containers',
    slug: 'natraj-sweets',
    subtitleName: 'Confectionery & Mithai Boxes',
    shortDescription: 'Crystal-clear rigid containers custom designed for Indian sweets, dry fruits, and mithai gifts.',
    description: 'Ultra-clear gift boxes for Indian mithai, dry fruits, chocolates, and festive hampers.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
    features: ['Crystal-Like Presentation', 'Sturdy Impact Resistance', 'Food Grade'],
    products: [
      {
        id: 'ns-500g',
        name: '500g Mithai Box',
        capacity: '500g',
        product_slug: '500g-mithai-box',
        material: 'Food Grade Polypropylene',
        quality: 'Luxury Gift Grade',
        features: ['High Transparency', 'Festive Packaging'],
        image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
        applications: ['Indian Sweets', 'Kaju Katli', 'Dry Fruits']
      }
    ]
  },
  {
    id: 'elite-containers',
    name: 'Elite Containers',
    slug: 'elite-containers',
    subtitleName: 'Premium Thick-Wall Containers',
    shortDescription: 'Heavyweight thick-wall containers providing luxury touch and extra insulation.',
    description: 'Premium container range offering reinforced rim strength and tactile quality.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
    features: ['Extra Heavy Wall', 'Superior Thermal Insulation'],
    products: [
      {
        id: 'ec-750',
        name: '750ml Elite Container',
        capacity: '750ml',
        product_slug: '750ml-elite-container',
        material: 'Virgin PP 05',
        quality: 'Luxury Heavyweight',
        features: ['Reinforced Rim', 'Microwave Safe'],
        image: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
        applications: ['Gourmet Meal Packaging']
      }
    ]
  },
  {
    id: 'tamper-evident',
    name: 'Tamper Evident Containers',
    slug: 'tamper-evident',
    subtitleName: 'Security Lock Containers',
    shortDescription: 'Security tab lock containers assuring end consumers of untouched food integrity.',
    description: 'Containers with breakable security tabs guaranteeing food freshness and anti-tamper security.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
    features: ['Breakable Security Tab', '100% Leak Proof'],
    products: [
      {
        id: 'te-500',
        name: '500ml Tamper Evident Tub',
        capacity: '500ml',
        product_slug: '500ml-tamper-evident-tub',
        material: 'Virgin PP 05',
        quality: 'Security Certified',
        features: ['Lock Tab', 'Hermetic Seal'],
        image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
        applications: ['Dairy Products', 'Yogurt', 'Gravies']
      }
    ]
  },
  {
    id: 'meal-boxes',
    name: 'Meal Boxes',
    slug: 'meal-boxes',
    subtitleName: 'Executive Combo Meal Packaging',
    shortDescription: 'Sleek meal packaging boxes tailored for airlines, corporate catering, and train meals.',
    description: 'Compact stackable combo boxes optimized for volume meal distribution.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1701213306583-082f9bfd88b4?w=800&auto=format&fit=crop',
    features: ['Compact Geometry', 'Stackable Base'],
    products: [
      {
        id: 'mb-exec',
        name: 'Executive Combo Meal Box',
        capacity: '850ml',
        product_slug: 'executive-combo-meal-box',
        material: 'Virgin PP 05',
        quality: 'Commercial Airline Grade',
        features: ['Zero Flavor Leak', 'Space Saving'],
        image: 'https://plus.unsplash.com/premium_photo-1701213306583-082f9bfd88b4?w=800&auto=format&fit=crop',
        applications: ['Corporate Lunches', 'Airline Meals']
      }
    ]
  },
  {
    id: 'ice-cream-tubs',
    name: 'Ice Cream Tubs',
    slug: 'ice-cream-tubs',
    subtitleName: 'Deep-Freeze Ice Cream & Dairy Packaging',
    shortDescription: 'Freezer-grade plastic containers resistant to low-temperature embrittlement down to -30°C.',
    description: 'Designed specifically for ice cream manufacturers, frozen yogurts, and gelato packaging.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1701213306476-132f16a0a01e?w=800&auto=format&fit=crop',
    features: ['Deep Freeze Safe down to -30°C', 'High Moisture Barrier'],
    products: [
      {
        id: 'ict-500',
        name: '500ml Ice Cream Tub',
        capacity: '500ml',
        product_slug: '500ml-ice-cream-tub',
        material: 'Impact Modified PP',
        quality: 'Dairy Grade',
        features: ['Crack Resistant', 'IML Printable'],
        image: 'https://plus.unsplash.com/premium_photo-1701213306476-132f16a0a01e?w=800&auto=format&fit=crop',
        applications: ['Ice Cream', 'Frozen Yogurt']
      }
    ]
  },
  {
    id: 'custom-iml',
    name: 'Custom IML Packaging',
    slug: 'custom-iml',
    subtitleName: 'In-Mould Labelling Branded Packaging',
    shortDescription: 'Full-color high definition IML printed containers for high brand recall.',
    description: 'In-Mould Labelling fuses vibrant artwork directly into container walls during moulding.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
    features: ['Waterproof Printing', 'Scratch Resistance', 'Full Cover Artwork'],
    products: [
      {
        id: 'iml-custom',
        name: 'Custom Printed IML Tub',
        capacity: 'Custom Capacity',
        product_slug: 'custom-printed-iml-tub',
        material: 'Virgin PP 05 + IML Film',
        quality: 'Custom Branded',
        features: ['Full HD Graphics', '100% Recyclable'],
        image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
        applications: ['Brand Retail Packaging', 'Butter', 'Cheese']
      }
    ]
  }
];

export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
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
