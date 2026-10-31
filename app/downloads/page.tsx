'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { downloadGroups, type DownloadItem } from '@/lib/data/downloads';
import { FileDown, FileText, BookOpen, ShieldCheck, ArrowRight, Eye } from 'lucide-react';
import { CatalogueDownloadModal } from '@/components/ui/CatalogueDownloadModal';

const typeIcon = { Catalog: BookOpen, Brochure: BookOpen, Datasheet: FileText, Certificate: ShieldCheck } as const;

export default function DownloadsPage() {
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url?: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOpenDownload = (item: DownloadItem) => {
    setSelectedDoc({
      title: item.title,
      url: item.file || '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
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
              <a
                key={group.id}
                href={`#${group.id}`}
                className="text-xs font-bold text-[#1A1D20] bg-white border border-[#E6DBC6] hover:border-[#b99750] rounded-full px-4 py-2 transition-colors shadow-2xs"
              >
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
                <div className="space-y-4">
                  {group.items.map((item, idx) => {
                    const Icon = typeIcon[item.type];
                    return (
                      <Reveal key={item.id} type="fade-up" delay={Math.min(idx, 6) * 0.04}>
                        <div
                          id={item.id}
                          className="scroll-mt-28 bg-white p-5 sm:p-6 rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] transition-all flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 shadow-xs hover:shadow-md"
                        >
                          {item.image ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage(item.image!)}
                              className="w-16 h-22 sm:w-20 sm:h-28 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6] overflow-hidden shrink-0 group/thumb relative text-left cursor-pointer"
                              title="Click to view full certificate"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                                <Eye className="w-4 h-4 mr-1" /> View
                              </div>
                            </button>
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0 border border-[#b99750]/30">
                              <Icon className="w-6 h-6" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-sm sm:text-base font-bold text-[#1A1D20]">{item.title}</h3>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b99750] bg-[#FAF8F4] border border-[#E6DBC6] rounded-full px-2.5 py-0.5">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* {item.image && (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(item.image!)}
                                className="inline-flex items-center justify-center gap-1.5 bg-[#FAF8F4] hover:bg-white border border-[#E6DBC6] hover:border-[#b99750] text-[#1A1D20] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                              >
                                <Eye className="w-4 h-4 text-[#b99750]" />
                                <span>Preview</span>
                              </button>
                            )} */}
                            <button
                              type="button"
                              onClick={() => handleOpenDownload(item)}
                              className="inline-flex items-center justify-center gap-2 bg-[#b99750] hover:bg-[#a6843e] text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow"
                            >
                              <FileDown className="w-4 h-4" />
                              <span>Download &amp; Email</span>
                            </button>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-white text-[var(--ace-ink)] p-5 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-md flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[#b99750] uppercase tracking-wider block mb-2">Need a physical sample?</span>
              <h3 className="text-xl font-extrabold mb-2">Sample kits ship with the printed catalog</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Request a sample of the lines you are evaluating, so specifications can be checked in hand.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 shrink-0 bg-[#b99750] hover:bg-[#a6843e] text-white font-bold py-3 px-5 sm:py-3.5 sm:px-7 rounded-xl text-xs uppercase tracking-wide sm:tracking-wider text-center transition-all">
              Request a sample<ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Full Document Download / Email Modal */}
      <CatalogueDownloadModal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        documentTitle={selectedDoc?.title}
        downloadUrl={selectedDoc?.url}
      />

      {/* High-Res Certificate Image Lightbox Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 cursor-default flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b99750]" />
                <span className="text-xs font-bold text-[#1A1D20]">SGS ISO 9001:2015 Official Certificate</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center">
              <img
                src={previewImage}
                alt="ISO 9001:2015 Certificate"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="p-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-[#FAF8F4]">
              <span className="text-[11px] text-gray-500">Certificate IN25/00000652 · Valid through Aug 2028</span>
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedDoc({
                    title: 'ISO 9001:2015 Management System Certificate',
                    url: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#a6843e] cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download &amp; Email Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
