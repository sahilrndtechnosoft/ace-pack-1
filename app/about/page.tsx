import type { Metadata } from 'next';
import AboutExperience from '@/components/experience/AboutExperience';
import { getCmsPage } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us | Ace Packaging Plastic Food Packaging Manufacturer',
  description:
    'Fifteen years of precision injection moulding in Daman. Ace Packaging manufactures food-grade PP 05 containers for QSR chains, cloud kitchens and food brands across India and export markets — ISO 9001:2015 certified.',
  alternates: {
    canonical: 'https://www.acepack.co.in/aboutus',
  },
};

export default async function AboutPage() {
  const { sections } = await getCmsPage('about');
  return <AboutExperience cmsSections={sections} />;
}
