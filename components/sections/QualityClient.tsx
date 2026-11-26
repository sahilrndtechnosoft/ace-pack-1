'use client';

import React, { useState } from 'react';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import {
  ShieldCheck,
  CheckCircle2,
  Eye,
  Award,
  X,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { qualityPage } from '@/lib/cms/pages/quality';
import type { CmsPageContent } from '@/lib/cms/registry';

const QUALITY_DEFAULTS = {
  banner: qualityPage.sections.banner.content,
  certificate: qualityPage.sections.certificate.content,
  faq: qualityPage.sections.faq.content,
};

export const QualityClient: React.FC<{ content?: CmsPageContent<'quality'>; hidden?: string[] }> = ({ content = QUALITY_DEFAULTS, hidden = [] }) => {
  const { banner, certificate: c, faq } = content;
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {/* Page Banner */}
      {!hidden.includes('banner') && <PageBanner
        title={banner.title}
        subtitle={banner.subtitle}
        badge={banner.badge}
        bgImage={banner.bgImage}
        breadcrumbs={[{ name: 'Quality & Certification', href: '/quality' }]}
      />}

      {/* Featured Official ISO 9001:2015 Certificate Showcase */}
      {!hidden.includes('certificate') && <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 text-left">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
              {c.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
              {c.heading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
              {c.description}
            </p>
          </div>

          <Reveal type="fade-up">
            <div className="bg-white rounded-3xl border-2 border-[#E6DBC6] hover:border-[#b99750] shadow-md p-6 sm:p-10 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Certificate Frame Preview */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div
                    onClick={() => setPreviewImage(c.certificateImage)}
                    className="relative group/cert w-full max-w-sm rounded-2xl bg-[#FAF8F4] p-3 sm:p-4 border-2 border-[#E6DBC6] shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="aspect-[3/4] w-full bg-white rounded-xl overflow-hidden relative border border-black/5">
                      <img
                        src={c.certificateImage}
                        alt={c.imageAlt}
                        className="w-full h-full object-cover object-top group-hover/cert:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5 backdrop-blur-2xs">
                        <Eye className="w-6 h-6 text-[#D6BC83]" />
                        <span>Click to Inspect Full Certificate</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-gray-600 font-semibold">
                      <span className="text-[#a8812f] font-bold">{c.imageCaption}</span>
                      <span>{c.imageCaptionRight}</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Metadata & Details */}
                <div className="lg:col-span-7 flex flex-col justify-between text-left">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b99750]/15 text-[#96742e] border border-[#b99750]/30 text-xs font-extrabold uppercase tracking-wider mb-4">
                      <Award className="w-4 h-4 text-[#b99750]" />
                      <span>{c.badge}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-3 leading-snug">
                      {c.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {c.body}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                      {c.details.map((d) => (
                        <div key={d.label} className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">{d.label}</span>
                          <span className="text-xs sm:text-sm font-bold text-[#1A1D20]">{d.value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Standard Verification Points */}
                    <div className="space-y-2 mb-6">
                      {c.points.map((point) => (
                        <div key={point} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#a8812f] shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>}

      {/* Quality FAQ (editable in Admin → Pages → Quality → Quality FAQ) */}
      {!hidden.includes('faq') && faq.faqs.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="container-custom max-w-4xl">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">{faq.eyebrow}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20] tracking-tight mb-8">{faq.heading}</h2>
            <div className="space-y-3">
              {faq.faqs.map((item, idx) => (
                <details
                  key={`${idx}-${item.question}`}
                  open={idx === 0}
                  className="group rounded-2xl border border-[#E6DBC6] bg-white shadow-xs open:border-[#b99750]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 text-sm sm:text-base font-bold text-[#1A1D20] [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-[#b99750] shrink-0 mt-0.5" aria-hidden="true" />
                      {item.question}
                    </span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[3.25rem] sm:pl-14 text-xs sm:text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* High-Resolution Certificate Lightbox */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 cursor-default flex flex-col"
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
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto p-2 flex items-center justify-center">
              <img
                src={previewImage}
                alt="Ace Packaging ISO 9001:2015 Certificate Preview"
                className="max-h-[72vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="p-3 border-t border-gray-100 bg-[#FAF8F4]">
              <span className="text-[11px] text-gray-600 font-semibold">
                {c.validityNote}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
