// Industry segments AcePack serves. Plain, serialisable data: icons are named
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
  { slug: 'qsr', icon: 'UtensilsCrossed', title: 'QSR & Delivery Chains', description: 'Leak-proof, stackable containers built for high-volume takeaway and last-mile delivery.', href: '/categories/meal-boxes', image: '/images/gallery/bento-meal.webp', needs: ['Leak-proof', 'Stackable', 'Last-mile ready'], lines: ['meal-boxes', 'hinge-cups', 'portion-cups'] },
  { slug: 'cloud-kitchens', icon: 'ChefHat', title: 'Cloud Kitchens', description: 'Freezer-to-microwave safe packaging that holds up through multi-brand, multi-order kitchens.', href: '/categories/re-series', image: '/images/gallery/kitchen-set.webp', needs: ['Freezer to microwave', 'Multi-order', 'Fast assembly'], lines: ['re-series', 'ro-series', 'hinge-cups'] },
  { slug: 'catering', icon: 'PartyPopper', title: 'Catering & Events', description: 'Bulk-ready portion containers and platters for large-scale event and catering service.', href: '/categories/portion-cups', image: '/images/gallery/studio-range.webp', needs: ['Bulk-ready', 'Portion control', 'Transport-safe'], lines: ['portion-cups', 'round-containers', 'elite-containers'] },
  { slug: 'hotels', icon: 'Hotel', title: 'Hotels & Restaurants', description: 'Premium finish IML-branded packaging for in-house dining, banquets, and room service.', href: '/categories/custom-iml', image: '/images/gallery/re-series.webp', needs: ['IML branded', 'Premium finish', 'Room service'], lines: ['custom-iml', 'elite-containers', 'meal-boxes'] },
  { slug: 'retail', icon: 'ShoppingCart', title: 'Retail & Supermarkets', description: 'Shelf-ready packaging for fresh produce, ready-to-eat meals, and bakery counters.', href: '/categories/tamper-evident', image: '/images/gallery/ro-series.webp', needs: ['Shelf-ready', 'Tamper-evident', 'Clear view'], lines: ['tamper-evident', 'round-containers', 'natraj-sweets'] },
  { slug: 'export', icon: 'Ship', title: 'Export Partners', description: 'Container lines built to international food-safety standards for global export orders.', href: '/categories', image: '/images/gallery/studio-range.webp', needs: ['US FDA 21 CFR', 'Palletised', '12+ markets'], lines: ['meal-boxes', 'ro-series', 'custom-iml'] },
];

// Plus the segments the company site (acepack.co.in) lists that the product
// site left out, each landing on the category line that actually serves it.
export const allIndustries: Industry[] = [
  ...defaultIndustries,
  { slug: 'dairy', icon: 'Milk', title: 'Dairy', description: 'Food-grade round tubs and freezer-safe containers for curd, paneer, butter and dairy processors.', href: '/categories/round-containers', image: '/images/gallery/kitchen-set.webp', needs: ['Food-grade', 'Freezer-safe', 'Snap seal'], lines: ['round-containers', 'ice-cream-tubs', 'ro-series'] },
  { slug: 'confectionery', icon: 'Candy', title: 'Confectionery & Sweets', description: 'Crystal-clear rigid containers designed for Indian mithai, dry fruits and festive gift packs.', href: '/categories/natraj-sweets', image: '/images/gallery/sweet-box.webp', needs: ['Crystal clear', 'Gift-ready', 'Rigid'], lines: ['natraj-sweets', 'tamper-evident'] },
  { slug: 'frozen', icon: 'Snowflake', title: 'Frozen Foods', description: 'Freezer-grade containers resistant to low-temperature embrittlement down to −30°C.', href: '/categories/ice-cream-tubs', image: '/images/gallery/ro-series.webp', needs: ['−30°C rated', 'No embrittlement', 'Deep-freeze lid'], lines: ['ice-cream-tubs', 'round-containers'] },
  { slug: 'bakery', icon: 'Croissant', title: 'Bakery', description: 'Versatile round tubs and clear-lid containers for bakery counters and fresh-baked retail.', href: '/categories/round-containers', image: '/images/gallery/sweet-box.webp', needs: ['Clear lid', 'Counter display', 'Stackable'], lines: ['round-containers', 'natraj-sweets', 'elite-containers'] },
  { slug: 'pharma', icon: 'Pill', title: 'Pharma', description: 'Tamper-evident security-lock containers that assure the end consumer of untouched contents.', href: '/categories/tamper-evident', image: '/images/gallery/hinge-cups.webp', needs: ['Security lock', 'Untouched contents', 'Traceable'], lines: ['tamper-evident', 'portion-cups'] },
  { slug: 'fmcg', icon: 'Package', title: 'FMCG', description: 'In-mould labelled containers with full-colour branding fused into the wall for shelf presence.', href: '/categories/custom-iml', image: '/images/gallery/studio-range.webp', needs: ['Full-colour IML', 'Shelf presence', 'No labels to peel'], lines: ['custom-iml', 'tamper-evident'] },
];
