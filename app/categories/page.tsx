import type { Metadata } from 'next';
import CategoriesExperience from '@/components/experience/CategoriesExperience';

export const metadata: Metadata = {
  title: 'All Product Categories | AcePack Plastic Food Packaging',
  description: 'Explore AcePack\'s 11 plastic food container categories including Hinge Cups, Portion Cups, RO-Series, RE Bento Boxes, Round Containers, Natraj Sweets, and Elite Containers.',
};

export default function CategoryListPage() {
  return <CategoriesExperience />;
}
