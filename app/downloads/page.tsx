import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { downloadGroups, type DownloadItem } from '@/lib/data/downloads';
import { getCmsDownloads } from '@/lib/db/content';
import { DownloadsClient, type DownloadsClientGroup } from '@/components/sections/DownloadsClient';

export const metadata: Metadata = {
  title: 'Download Center | Ace Packaging Catalogs & Certificates',
  description:
    'Catalogs, per-line datasheets, the IML branding guide and compliance certificates — everything a buyer or export auditor needs from one place.',
};

export default async function DownloadsPage() {
  const cmsRows = await getCmsDownloads();

  let groups: DownloadsClientGroup[] = downloadGroups as DownloadsClientGroup[];

  if (cmsRows && cmsRows.length > 0) {
    const catMap = new Map<string, DownloadItem[]>();
    for (const r of cmsRows) {
      const cat = r.category || 'General';
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push({
        id: r.id,
        title: r.title,
        type: (['Catalog', 'Brochure', 'Datasheet', 'Certificate'].includes(r.format) ? r.format : 'Catalog') as any,
        description: `${r.format} document (${r.file_size}) · Ready for instant download`,
        file: r.download_url,
        image: r.cover_image || undefined,
      });
    }

    groups = Array.from(catMap.entries()).map(([cat, items], idx) => ({
      id: `section-${idx}-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: cat,
      intro: `Official Ace Packaging technical resources and documentation for ${cat.toLowerCase()}.`,
      items,
    }));
  }

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Download Center"
        subtitle="Catalogs, per-line datasheets, the IML branding guide and compliance certificates — everything a buyer or export auditor needs from one place."
        badge="CATALOGS & DATASHEETS"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Downloads', href: '/downloads' }]}
      />

      <section className="py-10 md:py-12">
        <div className="container-custom">
          <DownloadsClient groups={groups} />
        </div>
      </section>
    </div>
  );
}
