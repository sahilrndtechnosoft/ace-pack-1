import type { Metadata } from 'next';
import IndustriesExperience from '@/components/experience/IndustriesExperience';
import { cmsMetadata, getPageContent } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'Industries We Serve | Ace Packaging Food Packaging',
  description: 'Ace Packaging supplies injection-moulded PP 05 containers to QSR chains, cloud kitchens, caterers, hotels, retail, dairy, confectionery, frozen food, bakery, pharma and FMCG brands across India and 12 export markets.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('industries', staticMetadata);
}

export default async function IndustriesPage() {
  const { content, hidden } = await getPageContent('industries');
  return <IndustriesExperience content={content} hidden={hidden} />;
}
