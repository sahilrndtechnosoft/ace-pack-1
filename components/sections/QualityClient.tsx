'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { qualityChecks, complianceStatements } from '@/lib/data/quality';
import { ShieldCheck, CheckCircle2, FileDown, ArrowRight, ClipboardCheck, Eye, Award, ExternalLink } from 'lucide-react';
import { CatalogueDownloadModal } from '@/components/ui/CatalogueDownloadModal';

export const QualityClient: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string }>({
    title: 'ISO 9001:2015 Management System Certificate',
    url: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDownloadCertificate = () => {
    setSelectedDoc({
      title: 'ISO 9001:2015 Management System Certificate',
      url: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
    });
    setDownloadModalOpen(true);
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Quality Assurance & Certifications"
        subtitle="Every container is moulded from certified virgin PP 05 in an ISO 9001:2015 certified facility, and every unit is leak tested before dispatch."
        badge="QUALITY & COMPLIANCE"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Quality', href: '/quality' }]}
      />

      {/* Featured Official Certificate Showcase */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-2xl mb-10 text-left">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
              Official Plant Accreditation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20]">
              Certified at the material, the facility and the process
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Ace Packaging operates under an externally audited and certified Quality Management System assessed by SGS United Kingdom Ltd with UKAS and IAF international recognition.
            </p>
          </div>

          <Reveal type="fade-up">
            <div className="bg-white rounded-3xl border-2 border-[#E6DBC6] hover:border-[#b99750] shadow-md p-6 sm:p-10 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Certificate Frame Preview */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div
                    onClick={() => setPreviewImage('/images/certifications/ace-packaging-iso-9001-certificate.jpg')}
                    className="relative group/cert w-full max-w-sm rounded-2xl bg-[#FAF8F4] p-3 sm:p-4 border-2 border-[#E6DBC6] shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="aspect-[3/4] w-full bg-white rounded-xl overflow-hidden relative border border-black/5">
                      <img
                        src="/images/certifications/ace-packaging-iso-9001-certificate.jpg"
                        alt="SGS ISO 9001:2015 Certificate - Ace Packaging"
                        className="w-full h-full object-cover object-top group-hover/cert:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5 backdrop-blur-2xs">
                        <Eye className="w-6 h-6 text-[#D6BC83]" />
                        <span>Click to Inspect Full Certificate</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-gray-600 font-semibold">
                      <span className="text-[#a8812f] font-bold">Certificate IN25/00000652</span>
                      <span>SGS · UKAS · IAF</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Metadata & Download Actions */}
                <div className="lg:col-span-7 flex flex-col justify-between text-left">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b99750]/15 text-[#96742e] border border-[#b99750]/30 text-xs font-extrabold uppercase tracking-wider mb-4">
                      <Award className="w-4 h-4 text-[#b99750]" />
                      <span>ISO 9001:2015 Management System Certification</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-3 leading-snug">
                      The Management System of Ace Packaging
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      Assessed and certified as meeting the requirements of <strong>ISO 9001:2015</strong> for the following activities: <em>Manufacturing &amp; Supply of Injection Moulded Food Packaging Articles</em>.
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                          Certificate Number
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#1A1D20] font-mono">
                          IN25/00000652
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                          Auditing &amp; Issuing Body
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#1A1D20]">
                          SGS United Kingdom Ltd (UKAS 0005)
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                          Validity Period
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-700">
                          01 August 2025 – 01 August 2028
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                          Certified Manufacturing Site
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#1A1D20]">
                          Survey No: 142/1, Dabhel, Daman - 396210, India
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleDownloadCertificate}
                      className="inline-flex items-center justify-center gap-2 bg-[#b99750] hover:bg-[#a6843e] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#b99750]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Download Certificate</span>
                    </button>

                    {/* <button
                      type="button"
                      onClick={() => setPreviewImage('/images/certifications/ace-packaging-iso-9001-certificate.jpg')}
                      className="inline-flex items-center justify-center gap-2 bg-[#FAF8F4] hover:bg-white border border-[#E6DBC6] hover:border-[#b99750] text-[#1A1D20] font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#b99750]" />
                      <span>Inspect High-Res View</span>
                    </button> */}

                    {/* <Link
                      href="/downloads#certifications"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#b99750] py-2 px-3 transition-colors"
                    >
                      <span>Download Center</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Inspection & testing */}
      <section className="py-12 md:py-16 bg-white border-y border-[#E6DBC6]">
        <div className="container-custom">
          <div className="max-w-2xl mb-10 text-left">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">Inspection &amp; Testing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20]">Six checks between resin and dispatch</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">Inspection is built into the moulding line rather than added at the end, so a defect is caught at the press that made it.</p>
          </div>
          <div className="max-w-4xl space-y-4">
            {qualityChecks.map((check, idx) => (
              <Reveal key={check.step} type="fade-up" delay={idx * 0.06}>
                <div className="bg-[#FAF8F4] p-6 sm:p-7 rounded-3xl border border-[#E6DBC6] flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 text-left">
                  <span className="text-3xl font-extrabold text-[#a8812f] shrink-0 leading-none">{check.step}</span>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#1A1D20] mb-1.5">{check.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{check.what}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-bold text-[#1A1D20] bg-white border border-[#E6DBC6] rounded-full px-3 py-1.5 whitespace-nowrap">
                    <ClipboardCheck className="w-3.5 h-3.5 text-[#a8812f]" /> {check.standard}
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
            <div className="lg:col-span-7 bg-white p-5 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm text-left">
              <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">Compliance</span>
              <h2 className="text-2xl font-extrabold text-[#1A1D20] mb-5">What every Ace Packaging container is</h2>
              <ul className="space-y-3">
                {complianceStatements.map((statement) => (
                  <li key={statement} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                    <CheckCircle2 className="w-[18px] h-[18px] text-[#a8812f] shrink-0 mt-0.5" />
                    <span>{statement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 bg-[#1A1D20] text-white p-5 sm:p-8 rounded-3xl shadow-lg text-left">
              <span className="text-[10px] font-bold text-[#D6BC83] uppercase tracking-wider block mb-2">Documentation</span>
              <h3 className="text-xl font-extrabold mb-3">Certificates for your audit file</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Official ISO 9001:2015 certificate copy, plant compliance audits, and full technical specifications are available immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="inline-flex items-center justify-center gap-2 bg-[#cfa144] hover:bg-[#b58c38] text-[#1A1D20] font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider text-center transition-all cursor-pointer"
                >
                  <FileDown className="w-4 h-4" /> Get Certificate Emailed
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-[#D6BC83] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider text-center transition-all"
                >
                  Speak with QA Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue & Certificate Download / Email Modal */}
      <CatalogueDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        documentTitle={selectedDoc.title}
        downloadUrl={selectedDoc.url}
      />

      {/* High-Resolution Certificate Lightbox */}
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
                  handleDownloadCertificate();
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
};

