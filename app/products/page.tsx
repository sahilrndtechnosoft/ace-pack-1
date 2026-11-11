import type { Metadata } from 'next';
import ProductsExperience from '@/components/experience/ProductsExperience';
import { getCmsCategories, getPageContent, cmsMetadata } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

const staticMetadata: Metadata = {
  title: 'All Products Catalog | Ace Packaging Plastic Food Packaging',
  description: 'Explore Ace Packaging\'s complete catalog of plastic food containers, portion cups, hinged cups, round tubs, bento boxes, and confectionery packaging.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('products', staticMetadata);
}

export default async function ProductsPage() {
  const [categories, cmsData] = await Promise.all([
    getCmsCategories(),
    getPageContent('products'),
  ]);
  return <ProductsExperience initialCategories={categories} content={cmsData.content}
      hidden={cmsData.hidden} />;
}
