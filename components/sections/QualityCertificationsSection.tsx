'use client';

import { homeCertifications } from '@/lib/cms/pages/home';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, FileCheck2, ArrowRight, CheckCircle2, FlaskConical, Sparkles, FileDown, Eye } from 'lucide-react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { CatalogueDownloadModal } from '../ui/CatalogueDownloadModal';

const CARD_ICONS = [Award, ShieldCheck, FlaskConical, FileCheck2];

export const QualityCertificationsSection: React.FC<{ content?: typeof homeCertifications }> = ({ content: c = homeCertifications }) => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);


  return (
    <section id="certifications-quality" className="relative py-20 bg-gradient-to-b from-[#FAF8F4] to-[#f4f1e8] text-[var(--ace-ink)] border-b border-[#E6DBC6]/50 overflow-hidden">
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
                <span>{c.badge}</span>
              </div>
              <SplitHeading>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--ace-ink)] tracking-tight leading-snug sm:leading-tight">
                  {c.heading}
                </h2>
              </SplitHeading>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-wider text-center shadow-lg shadow-[#b99750]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{c.downloadButtonText}</span>
              </button>

              <Link
                href={c.specsButton.link}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 sm:py-3.5 rounded-full border border-[#E6DBC6] hover:border-[#b99750] bg-white text-[var(--ace-ink)] text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors"
              >
                <span>{c.specsButton.text}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {c.cards.map((item, idx) => {
            const Icon = CARD_ICONS[idx % CARD_ICONS.length];
            return (
              <Reveal key={idx} type="fade-up" delay={idx * 0.08}>
                <div className="h-full bg-white rounded-3xl border-2 border-[#E6DBC6] hover:border-[#b99750] p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left">
                  <div>
                    {/* Top Row: Icon & Serial Number */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center border border-[#b99750]/30 group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#b99750]/70 bg-[#FAF8F4] px-2.5 py-1 rounded-full border border-[#E6DBC6]">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Dedicated Credential Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#96742e] bg-[#FAF8F4] border border-[#E6DBC6] shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b99750]" />
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[var(--ace-ink)] mb-2 group-hover:text-[#b99750] transition-colors leading-snug min-h-[3rem] flex items-center">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {idx === 0 && c.certificateThumbnail && (
                      <div
                        onClick={() => setDownloadModalOpen(true)}
                        className="mb-4 p-2 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6] hover:border-[#b99750] transition-colors flex items-center gap-3 cursor-pointer group/thumb"
                      >
                        <div className="w-10 h-14 rounded-md bg-white border border-gray-200 overflow-hidden shrink-0">
                          <img
                            src={c.certificateThumbnail}
                            alt="SGS ISO 9001 Certificate"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-[#a8812f] uppercase block">Official SGS Certificate</span>
                          <span className="text-[11px] font-semibold text-[var(--ace-ink)] block truncate">Click to Download &amp; Email</span>
                        </div>
                        <FileDown className="w-4 h-4 text-[#b99750] group-hover/thumb:translate-y-0.5 transition-transform" />
                      </div>
                    )}
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
                {c.bannerHeading}
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                {c.bannerText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              <span>{c.bannerButtonText}</span>
            </button>
            <Link
              href={c.bannerLink.link}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[#b99750] hover:bg-[#b99750] hover:text-white text-[#b99750] text-xs font-bold uppercase tracking-wide sm:tracking-wider text-center transition-colors"
            >
              <span>{c.bannerLink.text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </Container>

      {/* Catalogue & Certificate Download / Email Modal */}
      <CatalogueDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        documentTitle={c.certificateTitle}
        downloadUrl={c.certificateFile}
      />
    </section>
  );
};
