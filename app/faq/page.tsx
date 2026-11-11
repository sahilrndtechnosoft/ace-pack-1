import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { HelpCircle, ShieldCheck, Flame, Lock, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getPageContent, cmsMetadata } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Ace Packaging',
  description: 'Find answers regarding virgin PP 05 food safety, microwave reheating, leak testing, product enquiries, and shipping logistics.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('faq', staticMetadata);
}

export default async function FaqPage() {
  const { content, hidden } = await getPageContent('faq');
  const show = (key: string) => !hidden.includes(key);
  const { banner, questions, cta } = content;

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {show('banner') && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[{ name: 'FAQ', href: '/faq' }]} />
      )}

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          {show('questions') && <div className="max-w-4xl mx-auto space-y-6 mb-16">
            {questions.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm">
                <h3 className="text-lg font-bold text-[#1A1D20] mb-3 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#a8812f] shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>}

          {show('cta') && <div className="bg-white p-5 sm:p-10 rounded-3xl border-2 border-[#cfa144]/60 shadow-md text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-[#1A1D20] mb-2">{cta.heading}</h3>
            <p className="text-xs text-gray-500 mb-6">{cta.description}</p>

            <Link
              href={cta.button.link}
              className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-5 py-3 sm:px-8 sm:py-3.5 rounded-full uppercase tracking-wide sm:tracking-wider text-center shadow-sm transition-colors"
            >
              <span>{cta.button.text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>}
        </div>
      </section>
    </div>
  );
}
