'use client';

import { homeClosingCta } from '@/lib/cms/pages/home';
import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { PackageCheck, FileDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { CatalogueDownloadModal } from '../ui/CatalogueDownloadModal';

export const PreFooterCTA: React.FC<{ content?: typeof homeClosingCta }> = ({ content: c = homeClosingCta }) => {
  const [catalogueOpen, setCatalogueOpen] = useState(false);

  return (
    <>
      <section id="closing" className="relative py-16 sm:py-20 bg-gradient-to-b from-[var(--ace-paper)] via-[var(--ace-aqua-soft)] to-[var(--ace-image-surface)] text-[var(--ace-ink)] border-b border-[#E6DBC6]/60 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.12)_0%,transparent_70%)]"
        />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-[#E6DBC6] p-6 sm:p-12 shadow-xl text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b99750]/15 border border-[#b99750]/30 text-[#b99750] text-xs font-extrabold uppercase tracking-wider mb-4">
              <PackageCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{c.badge}</span>
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-[var(--ace-ink)] tracking-tight leading-snug sm:leading-tight mb-4">
              {c.heading}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              {c.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link
                href={c.primaryButton.link}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-wider text-center shadow-lg shadow-[#b99750]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>{c.primaryButton.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setCatalogueOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-[var(--ace-ink)] hover:bg-[var(--ace-ink)] hover:text-white text-[var(--ace-ink)] text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-wider text-center transition-all duration-300 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{c.catalogueButtonText}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E6DBC6]/60 text-xs text-gray-600">
              {c.highlights.map((item) => (
                <div key={item} className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#b99750] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center text-xs sm:text-sm text-gray-500 font-medium tracking-wide">
            {c.footerLine}
          </div>
        </Container>
      </section>

      <CatalogueDownloadModal
        isOpen={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
      />
    </>
  );
};
