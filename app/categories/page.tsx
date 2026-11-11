import type { Metadata } from 'next';
import CategoriesExperience from '@/components/experience/CategoriesExperience';
import { getCmsCategories, getPageContent, cmsMetadata } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

const staticMetadata: Metadata = {
  title: 'All Product Categories | Ace Packaging Plastic Food Packaging',
  description: 'Explore Ace Packaging\'s official plastic food container range: Hinge Cups, Portion Cups, RO-Series, RE-Series Bento Boxes, Round Containers, Natraj Containers, ZEN Series, Glass Series 80/90-Dia, Flat Containers, and Deli Series.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('categories', staticMetadata);
}

export default async function CategoryListPage() {
  const [categories, cmsData] = await Promise.all([
    getCmsCategories(),
    getPageContent('categories'),
  ]);
  return <CategoriesExperience initialCategories={categories} content={cmsData.content}
      hidden={cmsData.hidden} />;
}
