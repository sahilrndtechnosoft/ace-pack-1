import React from 'react';
import { Metadata } from 'next';
import { QualityClient } from '@/components/sections/QualityClient';
import { getPageContent, cmsMetadata } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

const staticMetadata: Metadata = {
  title: 'Quality Assurance & Certifications | Ace Packaging',
  description:
    'ISO 9001:2015 facility, 100% prime virgin PP 05, 100% leak testing and ±0.02 mm wall tolerance. Official SGS Certificate IN25/00000652.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('quality', staticMetadata);
}

export default async function QualityPage() {
  const { content, hidden } = await getPageContent('quality');
  return <QualityClient content={content} hidden={hidden} />;
}
