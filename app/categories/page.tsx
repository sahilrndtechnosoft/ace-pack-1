import type { Metadata } from 'next';
import CategoriesExperience from '@/components/experience/CategoriesExperience';

export const metadata: Metadata = {
  title: 'All Product Categories | Ace Packaging Plastic Food Packaging',
  description: 'Explore Ace Packaging\'s official plastic food container range: Hinge Cups, Portion Cups, RO-Series, RE-Series Bento Boxes, Round Containers, Natraj Containers, ZEN Series, Glass Series 80/90-Dia, Flat Containers, and Deli Series.',
};

export default function CategoryListPage() {
  return <CategoriesExperience />;
}
