'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, FileCheck2, ArrowRight, CheckCircle2, FlaskConical, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';

export const QualityCertificationsSection: React.FC = () => {
  const credentials = [
    {
      badge: 'US FDA COMPLIANT',
      title: 'US FDA 21 CFR 177.1520',
      description: 'Approved for direct contact with all food categories including hot oils, gravies, dairy, and acidic foods. 100% BPA-free and non-toxic.',
      standard: 'Federal Food Drug & Cosmetic Act',
      icon: ShieldCheck,
    },
    {
      badge: 'ISO CERTIFIED FACILITY',
      title: 'ISO 9001:2015 Manufacturing',
      description: 'Standardized cleanroom manufacturing, automated optical defect inspection, and batch traceability across Daman Unit 1 & Unit 2.',
      standard: 'Cleanroom Production Standards',
      icon: Award,
    },
    {
      badge: 'THIRD-PARTY VERIFIED',
      title: 'Migration Testing (SGS & Intertek)',
      description: 'Tested against global overall migration limits (OML) and specific migration limits (SML) under extreme microwave and freezing cycles.',
      standard: 'Zero Chemical Migration',
      icon: FlaskConical,
    },
    {
      badge: 'VIRGIN POLYMER ASSURANCE',
      title: '100% Prime Virgin PP 05',
      description: 'Exclusively virgin polypropylene polymer sourced directly from prime petrochemical refiners. Zero regrind, zero recycled filler.',
      standard: 'Zero Contaminant Purity',
      icon: FileCheck2,
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#FAF8F4] to-[#f4f1e8] text-[var(--ace-ink)] border-b border-[#E6DBC6]/50 overflow-hidden">
      {/* Background radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.12)_0%,transparent_70%)]"
      />

      <Container className="relative z-10">
        <Reveal type="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b99750]/15 border border-[#b99750]/30 text-[#b99750] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Certified &amp; Qualified Manufacturing</span>
              </div>
              <SplitHeading>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ace-ink)] tracking-tight">
                  Qualified &amp; Certified for Global Food Safety
                </h2>
              </SplitHeading>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                ACE Packaging adheres to stringent international food contact clearances, laboratory migration audits, and cleanroom quality management protocols.
              </p>
            </div>

            <Link
              href="/quality"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0 self-start md:self-auto"
            >
              <span>Quality &amp; Certificates Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {credentials.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={idx} type="fade-up" delay={idx * 0.08}>
                <div className="h-full bg-white rounded-3xl border-2 border-[#E6DBC6] hover:border-[#b99750] p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center border border-[#b99750]/30 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b99750] bg-[#FAF8F4] border border-[#E6DBC6] px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--ace-ink)] mb-2 group-hover:text-[#b99750] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#b99750] shrink-0" />
                    <span>{item.standard}</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Audit Confidence Banner */}
        <div className="rounded-2xl bg-white border border-[#E6DBC6] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 border border-green-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[var(--ace-ink)]">
                Export &amp; Institutional Audit Reports Available
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Download formal certificate copies or request batch-specific migration test laboratory reports for institutional vendor clearance.
              </p>
            </div>
          </div>

          <Link
            href="/quality"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#b99750] hover:bg-[#b99750] hover:text-white text-[#b99750] text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            <span>Review Full Documentation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </Container>
    </section>
  );
};
