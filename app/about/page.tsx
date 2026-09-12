import type { Metadata } from 'next';
import AboutExperience from '@/components/experience/AboutExperience';

export const metadata: Metadata = {
  title: 'About Us | AcePack Plastic Food Packaging Manufacturer',
  description: 'Fifteen years of precision injection moulding in Daman. AcePack manufactures food-grade PP 05 containers for QSR chains, cloud kitchens and food brands across India and export markets — ISO 9001:2015 and US FDA 21 CFR 177.1520 certified.',
};

export default function AboutPage() {
  return <AboutExperience />;
}
