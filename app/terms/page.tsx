import React from 'react';
import { Metadata } from 'next';
import { CheckCircle2, Factory, FileCheck, ShieldCheck, Truck } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { LegalDocument } from '@/components/sections/LegalDocument';
import { getPageContent, cmsMetadata } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'Terms & Conditions | Ace Packaging Solutions',
  description: 'Commercial terms, quality tolerances, dispatch guidelines, and regulatory compliance standards for Ace Packaging Solutions food containers.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('terms', staticMetadata);
}

const CLAUSE_ICONS = [Factory, FileCheck, Truck, ShieldCheck, CheckCircle2];

export default async function TermsAndConditionsPage() {
  const { content, hidden } = await getPageContent('terms');
  const { banner, document } = content;

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {!hidden.includes('banner') && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[{ name: 'Terms & Conditions', href: '/terms' }]} />
      )}
      {!hidden.includes('document') && <LegalDocument doc={document} icons={CLAUSE_ICONS} />}
    </div>
  );
}
