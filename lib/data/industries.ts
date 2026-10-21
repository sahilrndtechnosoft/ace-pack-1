// Industry segments Ace Packaging serves. Plain, serialisable data: icons are named
// rather than imported so a server page can hand this straight to the client
// component, which owns the name -> icon mapping.

export type IndustryIcon =
  | 'UtensilsCrossed' | 'ChefHat' | 'PartyPopper' | 'Hotel' | 'ShoppingCart' | 'Ship'
  | 'Milk' | 'Candy' | 'Snowflake' | 'Croissant' | 'Pill' | 'Package';

export interface Industry {
  slug: string;
  icon: IndustryIcon;
  title: string;
  description: string;
  // Category the card lands on. Defaults to the full category index.
  href?: string;
  // Photograph from public/images/gallery for the index panel.
  image?: string;
  // What the segment asks of its packaging, as short chips.
  needs?: string[];
  // Category slugs (lib/data/products.ts) that serve this segment.
  lines?: string[];
}

// The six segments the original home section carries.
export const defaultIndustries: Industry[] = [
  { slug: 'qsr', icon: 'UtensilsCrossed', title: 'QSR & Delivery Chains', description: 'Leak-proof, stackable containers built for high-volume takeaway and last-mile delivery.', href: '/categories/re-series', image: '/images/gallery/bento-meal.webp', needs: ['Leak-proof', 'Stackable', 'Last-mile ready'], lines: ['re-series', 'ro-series', 'hinge-cups', 'portion-cups'] },
  { slug: 'cloud-kitchens', icon: 'ChefHat', title: 'Cloud Kitchens', description: 'Freezer-to-microwave safe packaging that holds up through multi-brand, multi-order kitchens.', href: '/categories/re-series', image: '/images/gallery/kitchen-set.webp', needs: ['Freezer to microwave', 'Multi-order', 'Fast assembly'], lines: ['re-series', 'ro-series', 'zen-series', 'hinge-cups'] },
  { slug: 'catering', icon: 'PartyPopper', title: 'Catering & Events', description: 'Bulk-ready portion containers and platters for large-scale event and catering service.', href: '/categories/portion-cups', image: '/images/gallery/studio-range.webp', needs: ['Bulk-ready', 'Portion control', 'Transport-safe'], lines: ['portion-cups', 'round-containers', 'deli-series', 'flat-containers'] },
  { slug: 'hotels', icon: 'Hotel', title: 'Hotels & Restaurants', description: 'Premium finish food containers for in-house dining, banquets, and room service.', href: '/categories/zen-series', image: '/images/gallery/re-series.webp', needs: ['Deep rectangular', 'Premium finish', 'Room service'], lines: ['zen-series', 're-series', 'flat-containers'] },
  { slug: 'retail', icon: 'ShoppingCart', title: 'Retail & Supermarkets', description: 'Shelf-ready packaging for fresh produce, ready-to-eat meals, and bakery counters.', href: '/categories/deli-series', image: '/images/gallery/ro-series.webp', needs: ['Shelf-ready', 'Airtight seal', 'Clear view'], lines: ['deli-series', 'round-containers', 'natraj-containers', 'flat-containers'] },
  { slug: 'export', icon: 'Ship', title: 'Export Partners', description: 'Container lines built to international food-safety standards for global export orders.', href: '/categories', image: '/images/gallery/studio-range.webp', needs: ['US FDA 21 CFR', 'Palletised', '12+ markets'], lines: ['re-series', 'ro-series', 'deli-series', 'zen-series'] },
];

// Plus the segments the company site (acepack.co.in) lists that the product
// site left out, each landing on the category line that actually serves it.
export const allIndustries: Industry[] = [
  ...defaultIndustries,
  { slug: 'dairy', icon: 'Milk', title: 'Dairy', description: 'Food-grade round tubs and freezer-safe containers for curd, paneer, butter and dairy processors.', href: '/categories/deli-series', image: '/images/gallery/kitchen-set.webp', needs: ['Food-grade', 'Freezer-safe', 'Snap seal'], lines: ['deli-series', 'round-containers', 'ro-series'] },
  { slug: 'confectionery', icon: 'Candy', title: 'Confectionery & Sweets', description: 'Crystal-clear rigid containers designed for Indian mithai, dry fruits and festive gift packs.', href: '/categories/natraj-containers', image: '/images/gallery/sweet-box.webp', needs: ['Crystal clear', 'Gift-ready', 'Rigid'], lines: ['natraj-containers', 'round-containers'] },
  { slug: 'frozen', icon: 'Snowflake', title: 'Frozen Foods', description: 'Freezer-grade containers resistant to low-temperature embrittlement down to −30°C.', href: '/categories/deli-series', image: '/images/gallery/ro-series.webp', needs: ['−20°C rated', 'No embrittlement', 'Deep-freeze lid'], lines: ['deli-series', 'round-containers', 'ro-series'] },
  { slug: 'bakery', icon: 'Croissant', title: 'Bakery', description: 'Versatile round tubs and clear-lid containers for bakery counters and fresh-baked retail.', href: '/categories/flat-containers', image: '/images/gallery/sweet-box.webp', needs: ['Clear lid', 'Counter display', 'Stackable'], lines: ['flat-containers', 'round-containers', 'natraj-containers'] },
  { slug: 'pharma', icon: 'Pill', title: 'Pharma', description: 'Airtight security containers that assure the end consumer of untouched contents.', href: '/categories/portion-cups', image: '/images/gallery/hinge-cups.webp', needs: ['Airtight rim', 'Untouched contents', 'Traceable'], lines: ['portion-cups', 'hinge-cups', 'deli-series'] },
  { slug: 'fmcg', icon: 'Package', title: 'FMCG', description: 'Durable containers with precision snap lids for retail distribution and high shelf presence.', href: '/categories/deli-series', image: '/images/gallery/studio-range.webp', needs: ['High volume', 'Shelf presence', '100% Virgin PP'], lines: ['deli-series', 'round-containers', 'ro-series', 'glass-series-90-dia'] },
];
