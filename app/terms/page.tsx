import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ShieldCheck, FileCheck, CheckCircle2, Factory, Truck, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Ace Packaging Solutions',
  description: 'Commercial terms, quality tolerances, dispatch guidelines, and regulatory compliance standards for Ace Packaging Solutions food containers.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Terms &amp; Conditions"
        subtitle="Commercial terms, production tolerances, export standards, and food safety compliance governing our container supply."
        badge="LEGAL &amp; COMPLIANCE"
        breadcrumbs={[{ name: 'Terms & Conditions', href: '/terms' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom max-w-4xl">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E6DBC6] shadow-sm space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
            
            <div className="border-b border-[#E6DBC6] pb-6">
              <span className="text-[10px] font-bold text-[#b99750] uppercase tracking-wider block mb-1">Effective Date: October 2026</span>
              <h2 className="text-2xl font-extrabold text-[#1A1D20]">Standard Commercial &amp; Supply Terms</h2>
              <p className="mt-2 text-gray-600">
                These terms govern all quotations, sample dispatches, bulk production orders, and export container shipments supplied by Ace Packaging Solutions from our manufacturing units in Daman, India.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <Factory className="w-4 h-4 text-[#b99750]" /> 1. Material Authenticity &amp; Prime Virgin PP 05
              </h3>
              <p>
                All Ace Packaging plastic food storage containers (including Hinge Cups, Portion Cups, RO-Series, RE-Series Bento Boxes, ZEN Series, Natraj Containers, and Deli Tubs) are manufactured exclusively from 100% prime virgin Polypropylene (PP 05). We do not blend regrind or post-consumer plastic into direct food-contact surfaces. All manufacturing and resins comply with certified ISO 9001:2015 standards.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#b99750]" /> 2. Sample Evaluations &amp; Kitchen Testing
              </h3>
              <p>
                Ace Packaging provides physical sample kits to verified corporate buyers, cloud kitchens, and brand owners to evaluate thermal performance (-20°C deep freeze to +120°C microwave), lid snap tolerances, stackability, and zero-leak integrity under transit. Sample evaluation carries no binding wholesale obligation.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#b99750]" /> 3. Dispatch, Packaging &amp; Freight Tolerances
              </h3>
              <p className="mb-2">
                Containers are hygienically sleeved in dust-free poly bags and packed in export-grade heavy-duty corrugated cartons to prevent rim deformation during transit:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li><strong>Domestic Dispatch (India):</strong> Ex-factory Daman or delivered via trusted freight partners.</li>
                <li><strong>Global Exports (UAE, Middle East, Europe, Australia, Americas):</strong> Standard FCL/LCL ocean freight from Nhava Sheva (JNPT) / Hazira Port under Incoterms (FOB, CIF, CFR).</li>
                <li><strong>Carton Quantities:</strong> Standard packing counts (e.g. 240, 250, 500, or 1,000 pcs per carton) are specified per model datasheet.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b99750]" /> 4. Custom Moulds &amp; In-Mould Labelling (IML)
              </h3>
              <p>
                Toolroom lead times for proprietary custom injection moulds and high-definition IML artwork approval are confirmed upon technical drawing sign-off. Proprietary tool ownership and exclusivity terms remain protected under signed client agreements.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#b99750]" /> 5. Quality Claims &amp; Inspection
              </h3>
              <p>
                Our automated robotic production utilizes optical defect inspection. In the event of transit damage or manufacturing discrepancy, claims must be reported within 15 business days of consignment receipt along with carton batch identifiers for QA verification.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E6DBC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#1A1D20]">Need Commercial Clarifications?</h4>
                <p className="text-xs text-gray-500">Our export documentation and sales managers are available.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <a href="mailto:sales@acepack.co.in" className="text-[#8c6f2a] hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> sales@acepack.co.in
                </a>
                <span className="text-gray-300">•</span>
                <Link href="/contact" className="text-[#1A1D20] hover:text-[#8c6f2a] underline">
                  Contact Factory
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
