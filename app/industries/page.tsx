import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { IndustriesServed } from '@/components/sections/IndustriesServed';
import { allIndustries } from '@/lib/data/industries';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industries We Serve | AcePack Food Packaging',
  description: 'AcePack supplies injection-moulded PP 05 containers to QSR chains, cloud kitchens, caterers, hotels, retail, dairy, confectionery, frozen food, bakery, pharma and FMCG brands across India and 12 export markets.',
};

export default function IndustriesPage() {
  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Industries We Serve"
        subtitle="From the corner QSR to global export partners — packaging engineered for the exact demands of each segment, moulded from 100% virgin PP 05."
        badge="WHO WE SERVE"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Industries', href: '/industries' }]}
      />

      <IndustriesServed
        industries={allIndustries}
        eyebrow="Twelve segments, one material standard"
        heading="Built for the way each industry serves"
        intro="Every line below is moulded from US FDA 21 CFR 177.1520 certified virgin polypropylene, rated from −20°C deep freeze to +120°C microwave reheating."
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#b89858]/70 shadow-md text-center">
            <span className="text-[10px] font-bold text-[#b89858] uppercase tracking-wider block mb-2">Don&apos;t see your segment?</span>
            <h2 className="text-2xl font-extrabold text-[#1A1D20] mb-3">Custom formats and IML branding for any food application</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-2xl mx-auto">Our in-house CAD toolroom develops new container geometries and multi-cavity moulds to specification. Tell us the product, the volume and the shipping route.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#b89858] hover:bg-[#9e8042] text-white font-bold py-3.5 px-7 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all">
              Discuss your requirement <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
