// Elite Containers exist only on www.acepack.co.in; this line is built from the crawled live pages
// (scripts/crawl_acepack_catalog.py) so /plastic-food-containers/elite-containers shows real Elite data.
import liveCatalog from './acepack-live-catalog.json';
import type { ProductCategory, ProductItem } from './products';

type LivePage = { h1: string; specs?: { label: string; value: string }[]; images?: string[] };
const pages = liveCatalog as Record<string, LivePage>;
const BASE = '/plastic-food-containers/elite-containers/';

const spec = (page: LivePage, label: string) => page.specs?.find((s) => s.label === label)?.value ?? '';

const products: ProductItem[] = Object.entries(pages)
  .filter(([path]) => path.startsWith(BASE))
  .map(([path, page]) => {
    const slug = path.slice(BASE.length);
    const capacity = spec(page, 'Size/Capacity').replace(/ML$/i, 'ml');
    const images = page.images ?? [];
    return {
      id: slug,
      name: page.h1 || `Elite Containers ${capacity}`,
      capacity,
      product_slug: slug,
      material: 'Virgin PP 05 Food Grade',
      quality: spec(page, 'Quality') || 'High',
      features: ['Leak-resistant snap lid', 'Stackable', 'Microwave & freezer safe', 'BPA-free food grade PP 05'],
      dimensions: { top: spec(page, 'Top Diameter'), bottom: spec(page, 'Bottom Diameter'), height: spec(page, 'Height') },
      packaging: spec(page, 'Box Packaging'),
      image: images[0] ?? '',
      blankImage: images[1] ?? images[0],
      applications: ['Ready-to-eat meals', 'Curries & rice', 'Snacks', 'Desserts', 'Takeaway'],
      specs: page.specs ?? [],
    };
  })
  .sort((a, b) => parseInt(a.capacity, 10) - parseInt(b.capacity, 10));

export const eliteContainers: ProductCategory = {
  id: 'elite-containers',
  name: 'Elite Containers',
  slug: 'elite-containers',
  subtitleName: 'Stylish Rectangular Food Storage',
  shortDescription: 'Durable, BPA-free Elite Containers with leak-proof lids and stackable designs.',
  description:
    'Discover durable, BPA-free Elite Containers designed to keep meals fresh and organized. Ideal for meal prep, leftovers, and on-the-go snacks, our containers offer leak-proof lids and stackable designs for easy storage. Perfect for home, office, or travel, these food-safe containers are microwave, freezer, and dishwasher safe, making them a convenient and eco-friendly choice for busy lifestyles. Keep food fresher, longer with our high-quality plastic food storage solutions.',
  heroImage: products[0]?.image ?? '',
  features: ['Leak-proof lids', 'Stackable design', 'Microwave, freezer & dishwasher safe', 'BPA-free food grade'],
  gallery: products.map((p) => p.image).filter(Boolean),
  faqs: [
    {
      "question": "What are Elite Plastic Containers used for?",
      "answer": "Elite Plastic Containers are ideal for packaging ready-to-eat meals, curries, rice, snacks, desserts, and takeaway food while maintaining freshness and presentation."
    },
    {
      "question": "Are Elite Plastic Containers made from food-grade plastic?",
      "answer": "Yes, our Elite Plastic Containers are manufactured using premium food-grade plastic that is safe for direct food contact."
    },
    {
      "question": "Are Elite Plastic Containers leak-resistant?",
      "answer": "Yes, they feature secure-fitting lids that help prevent leaks during storage, transportation, and food delivery."
    },
    {
      "question": "Do Elite Plastic Containers come in different sizes?",
      "answer": "Yes, Elite Plastic Containers are available in multiple sizes and capacities to suit a wide range of food packaging requirements."
    },
    {
      "question": "Can I order Elite Plastic Containers in bulk?",
      "answer": "Yes, we supply Elite Plastic Containers in bulk for restaurants, caterers, wholesalers, retailers, and food packaging businesses."
    }
  ],
  products,
};
