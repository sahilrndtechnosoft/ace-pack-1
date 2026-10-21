// The core packaging categories mapped to real AcePack categories in
// lib/data/products.ts. Each entry pairs the packaging product photography
// with real food imagery demonstrating intended usage in restaurants and cloud kitchens.

export const products = [
  {
    id: 're-series',
    number: '01',
    name: 'RE Series Containers.\nMulti-Compartment Bento.',
    title: 'RE Series Containers',
    material: '100% virgin PP 05',
    capacity: '500ml · 650ml · 750ml · 1000ml',
    use: 'Executive thalis · curry & rice · combo meals · Chinese combos',
    description: 'Pioneering rectangular multi-compartment containers engineered with isolated chambers preventing flavour mixing during transit. Microwaveable and freezer safe.',
    href: '/categories/re-series',
    link: 'Explore RE Series',
    image: '/AcePackaging/RE Series Containers.png',
    foodImage: '/images/food-pairings/bento-meal.webp',
    foodPairing: 'Indian thali combos, biryanis & executive meal delivery',
    badge: 'Zero Gravy Cross-Mixing',
  },
  {
    id: 'ro-series',
    number: '02',
    name: 'RO-Series Containers.\nRound Soup & Bowl Solutions.',
    title: 'RO-Series Containers',
    material: '100% virgin PP 05',
    capacity: '250ml · 500ml · 750ml · 1000ml',
    use: 'Hot soups · noodle bowls · gravies · biryani · salads',
    description: 'Industry-standard injection moulded round containers with tight rim locking. Engineered to withstand boiling soup filling up to 120°C and deep-freeze storage down to −20°C.',
    href: '/categories/ro-series',
    link: 'Explore RO-Series',
    image: '/AcePackaging/RO-Series Containers.png',
    foodImage: '/images/food-pairings/salad-bowl.webp',
    foodPairing: 'Soups, noodle bowls, biryani & curries',
    badge: 'Ultra-Clear Visibility',
  },
  {
    id: 'hinge-cups',
    number: '03',
    name: 'Hinge Cups.\nOne-Piece Attached Snap Lids.',
    title: 'Hinge Cups',
    material: '100% virgin PP 05',
    capacity: '15ml · 25ml · 50ml · 80ml · 100ml',
    use: 'Chutneys · dips · sauces · dressings · condiments',
    description: 'One-piece hinged cups with built-in leak-proof lids engineered from flexible virgin PP. Tested for over 50 open-close cycles without tearing, preventing lost caps in busy kitchens.',
    href: '/categories/hinge-cups',
    link: 'Explore Hinge Cups',
    image: '/AcePackaging/Hinge Cups.png',
    foodImage: '/images/food-pairings/sauces-dips.webp',
    foodPairing: 'Mint chutney, garlic dips, dressings & condiments',
    badge: 'Attached Snap-Lid',
  },
  {
    id: 'deli-series',
    number: '04',
    name: 'Deli Series Container.\nHeavy-Duty Airtight Storage.',
    title: 'Deli Series Container',
    material: '100% virgin PP 05',
    capacity: '350ml · 500ml · 750ml · 1500ml',
    use: 'Dairy · yogurts · hummus · ice creams · bulk gravies',
    description: 'Heavyweight thick-wall containers providing superior thermal insulation and impact resistance. Airtight snap rim designed for dairy and takeaway security.',
    href: '/categories/deli-series',
    link: 'Explore Deli Series',
    image: '/AcePackaging/Deli Series Container.png',
    foodImage: '/images/food-pairings/curry-biryani.webp',
    foodPairing: 'Hummus, yogurt, dairy & bulk gravies',
    badge: 'Airtight Lock',
  },
  {
    id: 'sweet-box',
    number: '05',
    name: 'Sweet Box Containers.\nMithai & Confectionery Packaging.',
    title: 'Sweet Box Containers',
    material: '100% virgin PP 05',
    capacity: '250g · 500g · 1000g Boxes',
    use: 'Traditional mithai · dry fruits · baklava · bakery gifts',
    description: 'Speciality crystal-clear confectionery boxes designed for Indian sweets, cookies, and dry fruits. Odor-free virgin food-grade polymer keeps confectionery fresh.',
    href: '/categories/sweet-box-containers',
    link: 'Explore Sweet Boxes',
    image: '/AcePackaging/Sweet Box Containers.png',
    foodImage: '/images/food-pairings/sweets-pastry.webp',
    foodPairing: 'Artisan mithai, baklava, pastries & dry fruits',
    badge: 'Flavor Preserving',
  },
  {
    id: 'flat-containers',
    number: '06',
    name: 'Flat Containers.\nCold Prep & Fresh Food Showcase.',
    title: 'Flat Containers',
    material: '100% virgin PP 05',
    capacity: '450ml · 650ml · 900ml',
    use: 'Gourmet salads · sandwiches · sushi · sliced fresh fruits',
    description: 'Wide presentation surface containers with anti-fog optical clarity lids. Rigid corner architecture prevents crushing in delivery tote bags.',
    href: '/categories/flat-containers',
    link: 'Explore Flat Containers',
    image: '/AcePackaging/Flat Containers.png',
    foodImage: '/images/food-pairings/burger-meal.webp',
    foodPairing: 'Gourmet salads, artisan sandwiches & fresh sides',
    badge: 'Fresh Display',
  },
] as const;

export const containerFinishes = [
  { name: 'Ivory', color: '#a8aaa2' },
  { name: 'Graphite', color: '#303b31' },
  { name: 'Black', color: '#0b0c0e' },
] as const;

// The containers are moulded in black as stock, and that is what the product
// photography shows, so the scene opens on it. Looked up by name rather than
// index so reordering the picker cannot silently change the default.
export const defaultFinish = Math.max(0, containerFinishes.findIndex(finish => finish.name === 'Black'));

export type SceneState = {
  finish: number;
  hero: number;
  inspect: number;
  drag: number;
  craft: number;
  range: number;
  finale: number;
  pointerX: number;
  pointerY: number;
  active: boolean;
  frame?: import('./scene-framing').SceneFrame;
};

export const initialSceneState = (): SceneState => ({
  finish: defaultFinish,
  hero: 0,
  inspect: 0,
  drag: 0,
  craft: 0,
  range: 0,
  finale: 0,
  pointerX: 0,
  pointerY: 0,
  active: true,
});
