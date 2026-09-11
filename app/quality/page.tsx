import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { certifications, qualityChecks, complianceStatements } from '@/lib/data/quality';
import { ShieldCheck, CheckCircle2, FileDown, ArrowRight, ClipboardCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quality Assurance & Certifications | AcePack Packaging',
  description: 'ISO 9001:2015 facility, US FDA 21 CFR 177.1520 certified virgin PP 05, 100% leak testing and ±0.02 mm wall tolerance. How every AcePack container is inspected before dispatch.',
};

export default function QualityPage() {
  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Quality Assurance & Certifications"
        subtitle="Every container is moulded from certified virgin PP 05 in an ISO 9001:2015 facility, and every one of them is leak tested — not sampled — before it leaves Daman."
        badge="QUALITY & COMPLIANCE"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Quality', href: '/quality' }]}
      />

      {/* Standards & certifications */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <span className="text-[10px] font-bold text-[#b89858] uppercase tracking-wider block mb-2">Quality Standards</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20]">Certified at the material, the facility and the process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <Reveal key={cert.id} type="fade-up" delay={idx * 0.08}>
                <div className="group bg-white p-6 rounded-3xl border border-[#E6DBC6] hover:border-[#b89858] hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-[#b89858]/15 text-[#b89858] flex items-center justify-center border border-[#b89858]/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-[#b89858] uppercase tracking-wider mb-1">{cert.scope}</span>
                  <h3 className="text-base font-bold text-[#1A1D20] mb-2">{cert.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{cert.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Inspection & testing */}
      <section className="py-12 md:py-16 bg-white border-y border-[#E6DBC6]">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <span className="text-[10px] font-bold text-[#b89858] uppercase tracking-wider block mb-2">Inspection &amp; Testing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20]">Six checks between resin and dispatch</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">Inspection is built into the moulding line rather than added at the end, so a defect is caught at the press that made it.</p>
          </div>
          <div className="max-w-4xl space-y-4">
            {qualityChecks.map((check, idx) => (
              <Reveal key={check.step} type="fade-up" delay={idx * 0.06}>
                <div className="bg-[#FAF8F4] p-6 sm:p-7 rounded-3xl border border-[#E6DBC6] flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <span className="text-3xl font-extrabold text-[#b89858] shrink-0 leading-none">{check.step}</span>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#1A1D20] mb-1.5">{check.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{check.what}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-bold text-[#1A1D20] bg-white border border-[#E6DBC6] rounded-full px-3 py-1.5 whitespace-nowrap">
                    <ClipboardCheck className="w-3.5 h-3.5 text-[#b89858]" /> {check.standard}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance summary + certificate downloads */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm">
              <span className="text-[10px] font-bold text-[#b89858] uppercase tracking-wider block mb-2">Compliance</span>
              <h2 className="text-2xl font-extrabold text-[#1A1D20] mb-5">What every AcePack container is</h2>
              <ul className="space-y-3">
                {complianceStatements.map((statement) => (
                  <li key={statement} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                    <CheckCircle2 className="w-[18px] h-[18px] text-[#b89858] shrink-0 mt-0.5" />
                    <span>{statement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5 bg-[#1A1D20] text-white p-8 rounded-3xl shadow-lg">
              <span className="text-[10px] font-bold text-[#D6BC83] uppercase tracking-wider block mb-2">Documentation</span>
              <h3 className="text-xl font-extrabold mb-3">Certificates for your audit file</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">ISO 9001:2015 and FDA compliance documents, plus per-line datasheets, are available through the download centre for buyer and export audits.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/downloads#certifications" className="inline-flex items-center justify-center gap-2 bg-[#b89858] hover:bg-[#9e8042] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all">
                  <FileDown className="w-4 h-4" /> Download centre
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-[#D6BC83] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all">
                  Request a sample kit <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
