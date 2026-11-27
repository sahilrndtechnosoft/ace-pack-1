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
  const { branding } = content;

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
      {branding && !hidden.includes('branding') && branding.items.length > 0 && (
        <section className="py-14 sm:py-16 border-b border-[#E6DBC6]">
          <div className="container-custom">
            <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8812f] sm:text-xs">
              <span className="h-px w-8 bg-[#cfa144]" aria-hidden="true" />
              {branding.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-8">{branding.heading}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {branding.items.map((item, i) => (
                <li key={item.title} className="rounded-2xl border border-[#E6DBC6] bg-white p-6">
                  <span className="text-2xl font-extrabold text-[#cfa144] font-serif">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-base font-bold">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {!hidden.includes('gallery') && (
        <OemProductGallery badge={intro.badge} heading={intro.heading} lead={intro.lead} items={gallery.items} kind={kind} />
      )}
    </div>
  );
}

export default ResourcePage;
