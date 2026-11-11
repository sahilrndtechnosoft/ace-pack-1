import React from 'react';
import { PageBanner } from '@/components/ui/PageBanner';
import { OemProductGallery, type OemGalleryItem } from './OemProductGallery';
import { getCmsPage } from '@/lib/db/content';
import { resourcePages } from '@/lib/data/resources';
import './resource-pages.css';

interface ResourcePageProps {
  kind: 'oem' | 'customization' | 'oem_customization';
}

export async function ResourcePage({ kind }: ResourcePageProps) {
  const slug = kind === 'customization' ? 'customization' : 'oem';
  const defaultPage = resourcePages[kind] || resourcePages.oem_customization;

  // 1. Fetch live CMS page and sections from the backend database
  const { page: cmsPage, sections } = await getCmsPage(slug);

  const heroSection = sections?.hero;
  const gallerySection = sections?.gallery;

  const bannerTitle =
    kind === 'customization'
      ? (heroSection?.title || 'Custom Packaging & IML Branding')
      : (heroSection?.title || 'OEM Mould Tooling & Custom Solutions');

  const bannerSubtitle =
    heroSection?.intro ||
    heroSection?.subtitle ||
    defaultPage.intro ||
    'From custom mould tooling and proprietary container geometry to 5-sided In-Mould Labelling (IML) and bespoke colour formulations, build your custom packaging programme under one roof at our ISO 9001:2015 Daman facility.';

  const bannerBadge =
    kind === 'customization'
      ? 'CUSTOMIZATION & PRIVATE LABEL'
      : 'OEM & CUSTOM TOOLING';

  const galleryItems: OemGalleryItem[] = gallerySection?.items || [];

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20]">
      {/* 1. Signature Website PageBanner matching /gallery, /quality, /downloads, /process */}
      <PageBanner
        title={bannerTitle}
        subtitle={bannerSubtitle}
        badge={bannerBadge}
        bgImage="/images/oem/DSC04469.webp"
        breadcrumbs={[
          {
            name: kind === 'customization' ? 'Customization' : 'OEM Tooling',
            href: kind === 'customization' ? '/customization' : '/oem',
          },
        ]}
      />

      {/* 2. Interactive Product Gallery Showcase using standard website design tokens */}
      <OemProductGallery
        items={galleryItems}
        kind={kind}
      />
    </div>
  );
}

export default ResourcePage;
