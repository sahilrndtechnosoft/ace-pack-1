import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { Cpu, ShieldCheck, CheckCircle2, RefreshCw, Box } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manufacturing Process | AcePack Precision Moulding',
  description: 'AcePack\'s 7-step precision injection moulding workflow, from virgin PP 05 procurement through robotic moulding, quality testing and dispatch.',
};

export default function ProcessPage() {
  const steps = [
    { num: '01', title: 'Raw Material Procurement', description: '100% prime virgin polypropylene (PP 05) resin, food-contact certified to US FDA 21 CFR 177.1520. No regrind, no recycled content enters the line.' },
    { num: '02', title: 'Polymer Resin Drying & Plastifying', description: 'Virgin PP 05 resins are dehumidified and melted under digital temperature control.' },
    { num: '03', title: 'High-Speed Multi-Cavity Injection', description: 'Injection under 180T–450T hydraulic clamp force with 2.8s cycle speed.' },
    { num: '04', title: 'In-Mould Labelling (IML) Fusion', description: 'Robotic label insertion fuses vibrant full-color artwork directly into container walls.' },
    { num: '05', title: 'Automated Robotic Pick & Place', description: '3-axis robotic arms remove finished containers onto cleanroom conveyors without human touch.' },
    { num: '06', title: 'Quality Testing & Export Packaging', description: '100% leak testing, rim dimension verification, and automatic carton stacking.' },
    { num: '07', title: 'Dispatch', description: 'Palletised cartons leave the Daman plant by road across India and by sea to export partners in Australia, the UAE, Europe, Canada and the Middle East.' }
  ];

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Our Manufacturing Process"
        subtitle="Step-by-step automated injection moulding workflow ensuring 100% hygiene, zero leakage, and structural perfection."
        badge="PRODUCTION WORKFLOW"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Process', href: '/process' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="max-w-4xl mx-auto space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-6">
                <span className="text-3xl font-extrabold text-[#b89858] shrink-0">{step.num}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1D20] mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
