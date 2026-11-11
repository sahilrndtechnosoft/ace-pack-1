import type { Metadata } from 'next';
import CategoriesExperience from '@/components/experience/CategoriesExperience';
import { getCmsCategories, getCmsPage } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Plastic Food Containers | Food Packaging | Ace Packaging',
  description:
    'Explore food-grade plastic containers for takeaway, delivery, catering and retail packaging. Find the right size and style for your needs.',
  alternates: {
    canonical: 'https://www.acepack.co.in/plastic-food-containers',
  },
  openGraph: {
    title: 'Plastic Food Containers | Food Packaging | Ace Packaging',
    description:
      'Explore food-grade plastic containers for takeaway, delivery, catering and retail packaging. Find the right size and style for your needs.',
    url: 'https://www.acepack.co.in/plastic-food-containers',
  },
};

export default async function PlasticFoodContainersIndexPage() {
  const [categories, cmsData] = await Promise.all([
    getCmsCategories(),
    getCmsPage('categories'),
  ]);
  return (
    <CategoriesExperience
      initialCategories={categories}
      cmsSections={cmsData?.sections}
      basePath="/plastic-food-containers"
    />
  );
}
