// Industry segments AcePack serves. Plain, serialisable data: icons are named
// rather than imported so a server page can hand this straight to the client
// component, which owns the name -> icon mapping.

export type IndustryIcon =
  | 'UtensilsCrossed' | 'ChefHat' | 'PartyPopper' | 'Hotel' | 'ShoppingCart' | 'Ship'
  | 'Milk' | 'Candy' | 'Snowflake' | 'Croissant' | 'Pill' | 'Package';

export interface Industry {
  icon: IndustryIcon;
  title: string;
  description: string;
  // Category the card lands on. Defaults to the full category index.
  href?: string;
}

// The six segments the original home section carries.
export const defaultIndustries: Industry[] = [
  { icon: 'UtensilsCrossed', title: 'QSR & Delivery Chains', description: 'Leak-proof, stackable containers built for high-volume takeaway and last-mile delivery.', href: '/categories/meal-boxes' },
  { icon: 'ChefHat', title: 'Cloud Kitchens', description: 'Freezer-to-microwave safe packaging that holds up through multi-brand, multi-order kitchens.', href: '/categories/re-series' },
  { icon: 'PartyPopper', title: 'Catering & Events', description: 'Bulk-ready portion containers and platters for large-scale event and catering service.', href: '/categories/portion-cups' },
  { icon: 'Hotel', title: 'Hotels & Restaurants', description: 'Premium finish IML-branded packaging for in-house dining, banquets, and room service.', href: '/categories/custom-iml' },
  { icon: 'ShoppingCart', title: 'Retail & Supermarkets', description: 'Shelf-ready packaging for fresh produce, ready-to-eat meals, and bakery counters.', href: '/categories/tamper-evident' },
  { icon: 'Ship', title: 'Export Partners', description: 'Container lines built to international food-safety standards for global export orders.', href: '/categories' },
];

// Plus the segments the company site (acepack.co.in) lists that the product
// site left out, each landing on the category line that actually serves it.
export const allIndustries: Industry[] = [
  ...defaultIndustries,
  { icon: 'Milk', title: 'Dairy', description: 'Food-grade round tubs and freezer-safe containers for curd, paneer, butter and dairy processors.', href: '/categories/round-containers' },
  { icon: 'Candy', title: 'Confectionery & Sweets', description: 'Crystal-clear rigid containers designed for Indian mithai, dry fruits and festive gift packs.', href: '/categories/natraj-sweets' },
  { icon: 'Snowflake', title: 'Frozen Foods', description: 'Freezer-grade containers resistant to low-temperature embrittlement down to −30°C.', href: '/categories/ice-cream-tubs' },
  { icon: 'Croissant', title: 'Bakery', description: 'Versatile round tubs and clear-lid containers for bakery counters and fresh-baked retail.', href: '/categories/round-containers' },
  { icon: 'Pill', title: 'Pharma', description: 'Tamper-evident security-lock containers that assure the end consumer of untouched contents.', href: '/categories/tamper-evident' },
  { icon: 'Package', title: 'FMCG', description: 'In-mould labelled containers with full-colour branding fused into the wall for shelf presence.', href: '/categories/custom-iml' },
];
