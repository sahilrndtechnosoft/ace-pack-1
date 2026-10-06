import type { Metadata } from 'next';
import ProductsExperience from '@/components/experience/ProductsExperience';

export const metadata: Metadata = {
  title: 'All Products Catalog | Ace Packaging Plastic Food Packaging',
  description: 'Explore Ace Packaging\'s complete catalog of plastic food containers, portion cups, hinged cups, round tubs, bento boxes, and confectionery packaging.',
};

export default function ProductsPage() {
  return <ProductsExperience />;
}
