import type { Metadata } from 'next';
import IndustriesExperience from '@/components/experience/IndustriesExperience';

export const metadata: Metadata = {
  title: 'Industries We Serve | AcePack Food Packaging',
  description: 'AcePack supplies injection-moulded PP 05 containers to QSR chains, cloud kitchens, caterers, hotels, retail, dairy, confectionery, frozen food, bakery, pharma and FMCG brands across India and 12 export markets.',
};

export default function IndustriesPage() {
  return <IndustriesExperience />;
}
