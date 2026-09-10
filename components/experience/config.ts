// The three containers the scroll experience puts on stage, mapped to real
// AcePack categories in lib/data/products.ts. Copy and specs come from that
// data and from the marketing sections, so the home page and the category
// pages describe the same products.
export const products = [
  { id: 'meal-boxes', number: '01', name: 'Every meal.\nSealed right.', title: 'Meal Boxes', material: '100% virgin PP 05', capacity: 'Executive combo formats', use: 'Airlines · corporate catering · rail', description: 'Sleek meal packaging boxes tailored for airlines, corporate catering, and train meals. One clear snap lid, no lost caps.', href: '/categories/meal-boxes', link: 'View meal boxes', image: '/models/acepack/clamshell.webp' },
  { id: 'ro-series', number: '02', name: 'Fresh food.\nIn full view.', title: 'Round Bowls', material: '100% virgin PP 05', capacity: 'Shallow bowl · raised clear lid', use: 'Salads · sides · takeaway meals', description: 'A wide black bowl with a raised, clear snap lid. A gently tapered base and a continuous sealing rim keep the presentation clean.', href: '/categories/ro-series', link: 'View round bowls', image: '/models/acepack/shallow-bowl.webp' },
  { id: 'round-containers', number: '03', name: 'More room.\nA clear finish.', title: 'Round Tubs', material: '100% virgin PP 05', capacity: 'Deep tub · flat clear lid', use: 'Soups · curries · food storage', description: 'A deeper black container with smooth tapered walls and a low-profile clear lid. Designed for generous portions and everyday food service.', href: '/categories/round-containers', link: 'View round tubs', image: '/models/acepack/round-tub.webp' },
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
export type SceneState = { finish:number; hero: number; inspect: number; drag: number; craft: number; range: number; finale: number; pointerX: number; pointerY: number; active: boolean };
export const initialSceneState = (): SceneState => ({ finish:defaultFinish, hero:0, inspect:0, drag:0, craft: 0, range: 0, finale: 0, pointerX: 0, pointerY: 0, active: true });
