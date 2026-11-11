import type { Metadata } from 'next';
import AboutExperience from '@/components/experience/AboutExperience';
import { getPageContent } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Ace Packaging | Food Packaging Manufacturer',
  description:
    'Ace Packaging makes quality injection moulded thinwall food packaging containers with modern technology. We shape the future of packaging in India.',
  alternates: {
    canonical: 'https://www.acepack.co.in/aboutus',
  },
  openGraph: {
    title: 'About Ace Packaging | Food Packaging Manufacturer',
    description:
      'Ace Packaging makes quality injection moulded thinwall food packaging containers with modern technology. We shape the future of packaging in India.',
    url: 'https://www.acepack.co.in/aboutus',
  },
};

export default async function AboutUsPage() {
  const { content, hidden } = await getPageContent('about');
  return <AboutExperience content={content} hidden={hidden} />;
}
