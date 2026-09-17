import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { HelpCircle, ShieldCheck, Flame, Lock, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | AcePack Packaging',
  description: 'Find answers regarding virgin PP 05 food safety, microwave reheating, leak testing, MOQ guidelines, and shipping logistics.',
};

export default function FaqPage() {
  const faqs = [
    {
      question: 'What material resins are used in AcePack containers?',
      answer: 'All AcePack containers are manufactured using 100% prime virgin Polypropylene (PP 05) certified under US FDA 21 CFR 177.1520 regulations. They are 100% BPA-free, heavy metal free, and food-contact safe.'
    },
    {
      question: 'Are your plastic containers microwave and freezer safe?',
      answer: 'Yes, our PP 05 material has a operating thermal range spanning -20°C (deep freeze) up to +120°C (hot gravy filling and microwave reheating).'
    },
    {
      question: 'How do Hinge Cups prevent sauce leakage during delivery?',
      answer: 'Our Hinge Cups feature a built-in snap-tight lid rim geometry that creates an airtight hermetic seal, preventing liquid spillage even during rough motorcycle transit.'
    },
    {
      question: 'What is the minimum order quantity (MOQ) for factory direct orders?',
      answer: 'Standard stock containers have a minimum order quantity of 1 master carton (typically 1,000–2,000 Pcs). Custom color or IML printed runs start from 25,000 Pcs.'
    },
    {
      question: 'Where is your manufacturing facility located?',
      answer: 'Our modern automated injection moulding facility is located in Daman (U.T.), India, with 2 plant units capable of producing over 1.5 million container units daily.'
    }
  ];

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Clear answers about our plastic food containers, polymer safety certifications, custom printing, and shipping logistics."
        badge="HELP & FAQ"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'FAQ', href: '/faq' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="max-w-4xl mx-auto space-y-6 mb-16">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm">
                <h3 className="text-lg font-bold text-[#1A1D20] mb-3 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#a8812f] shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#cfa144]/60 shadow-md text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-[#1A1D20] mb-2">Have Additional Questions?</h3>
            <p className="text-xs text-gray-500 mb-6">Our sales & packaging engineers are standing by to assist your food brand.</p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider shadow-sm transition-colors"
            >
              <span>Contact Our Technical Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
