import React from 'react';
import { Metadata } from 'next';
import { CheckCircle2, FileText, Lock, ShieldCheck } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { LegalDocument } from '@/components/sections/LegalDocument';
import { getPageContent, cmsMetadata } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'Privacy Policy | Ace Packaging Solutions',
  description: 'Learn about Ace Packaging Solutions’ commitment to protecting client privacy, business inquiries, and food container procurement data.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('privacy', staticMetadata);
}

const CLAUSE_ICONS = [FileText, ShieldCheck, Lock, CheckCircle2];

export default async function PrivacyPolicyPage() {
  const { content, hidden } = await getPageContent('privacy');
  const { banner, document } = content;

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {!hidden.includes('banner') && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[{ name: 'Privacy Policy', href: '/privacy' }]} />
      )}
      {!hidden.includes('document') && <LegalDocument doc={document} icons={CLAUSE_ICONS} />}
    </div>
  );
}
