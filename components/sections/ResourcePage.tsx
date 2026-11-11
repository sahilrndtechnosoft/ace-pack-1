import React from 'react';
import { PageBanner } from '@/components/ui/PageBanner';
import { OemProductGallery } from './OemProductGallery';
import { getPageContent } from '@/lib/db/content';
import './resource-pages.css';

interface ResourcePageProps {
  kind: 'oem' | 'customization';
}

export async function ResourcePage({ kind }: ResourcePageProps) {
  const { content, hidden } = await getPageContent(kind);
  const { hero, gallery_heading: intro, gallery } = content;

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20]">
      {!hidden.includes('hero') && (
        <PageBanner
          title={hero.title}
          subtitle={hero.subtitle}
          badge={hero.badge}
          bgImage={hero.bgImage}
          breadcrumbs={[{ name: kind === 'customization' ? 'Customization' : 'OEM Tooling', href: `/${kind}` }]}
        />
      )}
      {!hidden.includes('gallery') && (
        <OemProductGallery badge={intro.badge} heading={intro.heading} lead={intro.lead} items={gallery.items} kind={kind} />
      )}
    </div>
  );
}

export default ResourcePage;
