'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { downloadGroups, requestEmail, type DownloadItem } from '@/lib/data/downloads';
import { FileDown, Mail, FileText, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { CatalogueDownloadModal } from '@/components/ui/CatalogueDownloadModal';

const typeIcon = { Catalog: BookOpen, Brochure: BookOpen, Datasheet: FileText, Certificate: ShieldCheck } as const;

function requestHref(item: DownloadItem) {
  const subject = encodeURIComponent(`Document request: ${item.title}`);
  const body = encodeURIComponent(`Hello Ace Packaging,\n\nPlease send the following document:\n${item.title}\n\nCompany:\nContact number:\n`);
  return `mailto:${requestEmail}?subject=${subject}&body=${body}`;
}

export default function DownloadsPage() {
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string } | null>(null);

  const handleOpenDownload = (item: DownloadItem) => {
    setSelectedDoc({
      title: item.title,
      url: item.file || '/b9d572a7-af59-4e63-92e8-2971440edffe.png',
    });
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Download Center"
        subtitle="Catalogs, per-line datasheets, the IML branding guide and compliance certificates — everything a buyer or export auditor needs from one place."
        badge="CATALOGS & DATASHEETS"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Downloads', href: '/downloads' }]}
      />

      <section className="py-10 md:py-12">
        <div className="container-custom">
          <nav aria-label="Download sections" className="flex flex-wrap gap-2 mb-10">
            {downloadGroups.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="text-xs font-bold text-[#1A1D20] bg-white border border-[#E6DBC6] hover:border-[#b99750] rounded-full px-4 py-2 transition-colors">
                {group.title}
              </a>
            ))}
          </nav>

          <div className="space-y-14">
            {downloadGroups.map((group) => (
              <div key={group.id} id={group.id} className="scroll-mt-28">
                <div className="max-w-2xl mb-6">
                  <h2 className="text-2xl font-extrabold text-[#1A1D20] mb-2">{group.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{group.intro}</p>
                </div>
                <div className="space-y-3">
                  {group.items.map((item, idx) => {
                    const Icon = typeIcon[item.type];
                    const live = Boolean(item.file);
                    return (
                      <Reveal key={item.id} type="fade-up" delay={Math.min(idx, 6) * 0.04}>
                        <div id={item.id} className="scroll-mt-28 bg-white p-5 sm:p-6 rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] transition-colors flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          <div className="w-11 h-11 rounded-2xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0 border border-[#b99750]/30">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-sm sm:text-base font-bold text-[#1A1D20]">{item.title}</h3>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b99750] bg-[#FAF8F4] border border-[#E6DBC6] rounded-full px-2 py-0.5">{item.type}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                          </div>
                          {live ? (
                            <button
                              onClick={() => handleOpenDownload(item)}
                              className="inline-flex items-center justify-center gap-2 shrink-0 bg-[#b99750] hover:bg-[#a6843e] text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                            >
                              <FileDown className="w-4 h-4" /> Download PDF
                            </button>
                          ) : (
                            <a href={requestHref(item)} className="inline-flex items-center justify-center gap-2 shrink-0 bg-[#FAF8F4] hover:bg-white border border-[#E6DBC6] hover:border-[#b99750] text-[#1A1D20] font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all">
                              <Mail className="w-4 h-4 text-[#b99750]" /> Request by email
                            </a>
                          )}
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-white text-[var(--ace-ink)] p-8 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-md flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[#b99750] uppercase tracking-wider block mb-2">Need a physical sample?</span>
              <h3 className="text-xl font-extrabold mb-2">Sample kits ship with the printed catalog</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Request a sample kit of the lines you are evaluating, so specifications can be checked in hand.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 shrink-0 bg-[#b99750] hover:bg-[#a6843e] text-white font-bold py-3.5 px-7 rounded-xl text-xs uppercase tracking-wider transition-all">
              Request a sample kit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Catalogue Download Requirement Form Modal */}
      <CatalogueDownloadModal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        documentTitle={selectedDoc?.title}
        downloadUrl={selectedDoc?.url}
      />
    </div>
  );
}
