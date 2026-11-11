import type { Metadata } from 'next';
import AboutExperience from '@/components/experience/AboutExperience';
import { getPageContent, cmsMetadata } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

const staticMetadata: Metadata = {
  title: 'About Us | Ace Packaging Plastic Food Packaging Manufacturer',
  description:
    'Fifteen years of precision injection moulding in Daman. Ace Packaging manufactures food-grade PP 05 containers for QSR chains, cloud kitchens and food brands across India and export markets — ISO 9001:2015 certified.',
  alternates: {
    canonical: 'https://www.acepack.co.in/aboutus',
  },
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('about', staticMetadata);
}

export default async function AboutPage() {
  const { content, hidden } = await getPageContent('about');
  return <AboutExperience content={content} hidden={hidden} />;
}
