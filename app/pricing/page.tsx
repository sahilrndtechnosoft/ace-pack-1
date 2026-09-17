import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ShieldCheck, CheckCircle2, ArrowRight, Package, Truck, Layers } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wholesale Pricing & MOQ Tiers | AcePack Packaging',
  description: 'Factory-direct volume pricing tiers, bulk carton rates, custom IML branding quotes, and wholesale sample kits for plastic food containers.',
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'Starter / QSR Trial',
      moq: '5,000 – 25,000 Pcs',
      description: 'Ideal for single-location restaurants, cloud kitchens, and initial product launches.',
      features: ['Standard Export Carton Packaging', 'Full 11 Categories Access', '100% Virgin PP 05 Certification', 'Dispatch in 48 Hours'],
      highlight: false
    },
    {
      name: 'Commercial Wholesale',
      moq: '25,000 – 100,000 Pcs',
      description: 'Designed for regional QSR chains, dairy processors, and food delivery brands.',
      features: ['Discounted Factory Volume Rate', 'Custom Embossed Brand Lids', 'Dedicated Account Manager', 'Priority Production Allocation'],
      highlight: true
    },
    {
      name: 'Enterprise / Distributor',
      moq: '100,000+ Pcs / Month',
      description: 'Custom container mould engineering, full IML printed labels, and global container distribution.',
      features: ['Maximum Factory Direct Margin', 'Custom IML Graphic Printing', 'Dedicated Tooling R&D', 'Flexible Payment Terms'],
      highlight: false
    }
  ];

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Wholesale Pricing & Volume Tiers"
        subtitle="Direct manufacturer pricing tiers for food packaging distributors, cloud kitchen chains, and commercial food processors."
        badge="FACTORY DIRECT VOLUME PRICING"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Pricing', href: '/pricing' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-8 border-2 ${
                  tier.highlight ? 'border-[#cfa144] shadow-xl relative' : 'border-[#E6DBC6] shadow-sm'
                } flex flex-col justify-between`}
              >
                <div>
                  {tier.highlight && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#cfa144] text-[#1A1D20] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      MOST POPULAR VOLUME TIER
                    </span>
                  )}

                  <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-1">
                    {tier.moq}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#1A1D20] mb-3">{tier.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">{tier.description}</p>

                  <div className="space-y-3 mb-8">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#a8812f] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact"
                  className={`w-full font-bold py-3.5 rounded-xl text-center text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    tier.highlight
                      ? 'bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] shadow-md'
                      : 'bg-[#111518] hover:bg-black text-white'
                  }`}
                >
                  <span>Request Tier Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
