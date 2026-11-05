import type { Metadata } from 'next';
import ProductsExperience from '@/components/experience/ProductsExperience';
import { getCmsCategories, getCmsPage } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Products Catalog | Ace Packaging Plastic Food Packaging',
  description: 'Explore Ace Packaging\'s complete catalog of plastic food containers, portion cups, hinged cups, round tubs, bento boxes, and confectionery packaging.',
};

export default async function ProductsPage() {
  const [categories, cmsData] = await Promise.all([
    getCmsCategories(),
    getCmsPage('products'),
  ]);
  return <ProductsExperience initialCategories={categories} cmsSections={cmsData?.sections} />;
}
