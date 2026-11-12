import { withLiveSeo } from '@/lib/data/live-routing';
import HomeExperience from '@/components/experience/HomeExperience';
import type { Metadata } from 'next';
import { cmsMetadata, getPageContent } from '@/lib/db/content';

// Home inherits the site-wide title/description from app/layout.tsx unless SEO is set in the CMS.
export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('home', withLiveSeo('/', {}));
}

export default async function Home() {
  const { content, hidden } = await getPageContent('home');
  return <HomeExperience content={content} hidden={hidden} />;
}
