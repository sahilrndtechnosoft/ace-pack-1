import { withLiveSeo } from '@/lib/data/live-routing';
import type { Metadata } from 'next';
import AboutExperience from '@/components/experience/AboutExperience';
import { getPageContent, cmsMetadata } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

const staticMetadata: Metadata = {
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

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('aboutus', withLiveSeo('/aboutus', staticMetadata));
}

export default async function AboutUsPage() {
  const { content, hidden } = await getPageContent('about');
  return <AboutExperience content={content} hidden={hidden} />;
}
