'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { certifications, qualityChecks, complianceStatements } from '@/lib/data/quality';
import {
  ShieldCheck,
  CheckCircle2,
  FileDown,
  ArrowRight,
  ClipboardCheck,
  Eye,
  Award,
  Sparkles,
  Layers,
  FlaskConical,
  Building2,
  X,
  PhoneCall,
} from 'lucide-react';
import { CatalogueDownloadModal } from '@/components/ui/CatalogueDownloadModal';

export const QualityClient: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string }>({
    title: 'ISO 9001:2015 Management System Certificate - Ace Packaging',
    url: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDownloadCertificate = () => {
    setSelectedDoc({
      title: 'ISO 9001:2015 Management System Certificate - Ace Packaging',
      url: '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg',
    });
    setDownloadModalOpen(true);
  };

  const getCertIcon = (id: string) => {
    switch (id) {
      case 'brcgs':
        return <ShieldCheck className="w-5 h-5 text-[#a8812f]" />;
      case 'haccp':
        return <FlaskConical className="w-5 h-5 text-[#a8812f]" />;
      case 'food-grade':
        return <Layers className="w-5 h-5 text-[#a8812f]" />;
      case 'iso-9001':
        return <Award className="w-5 h-5 text-[#a8812f]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#a8812f]" />;
    }
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {/* Page Banner */}
      <PageBanner
        title="Quality & Certification"
        subtitle="Ace Packaging operates advanced cleanroom production facilities adhering to BRCGS, HACCP, and ISO 9001:2015 standards, ensuring 100% food-grade purity, leak-proof reliability, and strict batch traceability."
        badge="QUALITY ASSURANCE & STANDARDS"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Quality & Certification', href: '/quality' }]}
      />

      {/* 4-Card Certification Grid (Layout from reference screenshot) */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mb-12 text-left">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
              International Food Safety Benchmarks
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
              Certified Quality &amp; Compliance Standards
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
              Every container manufactured by Ace Packaging is produced in an audited, hygienic environment using prime virgin polymers, fulfilling stringent domestic and international food-contact packaging regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {certifications.map((cert, idx) => (
              <Reveal key={cert.id} type="fade-up" delay={idx * 0.08}>
                <div className="bg-white rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-11 h-11 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6] group-hover:border-[#b99750]/50 flex items-center justify-center shrink-0 transition-colors">
                        {getCertIcon(cert.id)}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a8812f] bg-[#FAF8F4] border border-[#E6DBC6] px-3 py-1 rounded-full whitespace-nowrap">
                        {cert.badge}
                      </span>
                    </div>

                    {/* Title & Body */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A1D20] mb-2.5 group-hover:text-[#a8812f] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {cert.body}
                    </p>
                  </div>

                  {/* Standards Checklist */}
                  {cert.standards && (
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      {cert.standards.map((std, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#a8812f] shrink-0" />
                          <span>{std}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Official Certificate Showcase (SGS ISO 9001:2015) */}
      <section className="py-12 md:py-16 bg-white border-y border-[#E6DBC6]">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto mb-10 text-center">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
              Official Plant Accreditation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20]">
              Certified at the Material, the Facility, and the Process
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Ace Packaging operates under an externally audited and certified Quality Management System assessed by SGS United Kingdom Ltd with UKAS and IAF international recognition.
            </p>
          </div>

          <Reveal type="fade-up">
            <div className="max-w-md mx-auto flex flex-col items-center">
              {/* Certificate Frame Preview */}
              <div
                onClick={() => setPreviewImage('/images/certifications/ace-packaging-iso-9001-certificate.jpg')}
                className="relative group/cert w-full rounded-3xl bg-[#FAF8F4] p-4 sm:p-5 border-2 border-[#E6DBC6] hover:border-[#b99750] shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
              >
                <div className="aspect-[3/4] w-full bg-white rounded-2xl overflow-hidden relative border border-black/5">
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

                <div className="mt-3.5 flex items-center justify-between px-1 text-[11px] text-gray-600 font-semibold">
                  <span className="text-[#a8812f] font-bold">Certificate IN25/00000652</span>
                  <span>SGS · UKAS · IAF</span>
                </div>
              </div>

              {/* Download Action Button */}
              <div className="mt-6 w-full flex justify-center">
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b99750] hover:bg-[#a6843e] text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#b99750]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Official Certificate</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quality Control & Testing Protocols (Layout from Screenshot 2) */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-2xl mb-10 text-left">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
              Quality Control &amp; Testing Protocols
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20]">
              Built-In Inspection Across Every Production Batch
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
              Quality control is embedded inline across every manufacturing station, ensuring defects are caught and rejected automatically before products reach dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityChecks.map((check, idx) => (
              <Reveal key={check.step} type="fade-up" delay={idx * 0.06}>
                <div className="bg-white p-6 rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] shadow-xs flex flex-col justify-between h-full text-left transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-2xl font-black text-[#a8812f] leading-none">
                        {check.step}
                      </span>
                      {check.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-[#FAF8F4] border border-[#E6DBC6] px-2.5 py-1 rounded-full">
                          {check.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#1A1D20] mb-2 leading-snug">
                      {check.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {check.what}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-[#a8812f]">
                    <span className="flex items-center gap-1.5">
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>{check.standard}</span>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Summary & Audit Documentation Strip */}
      <section className="py-12 md:py-16 bg-[#161A12] text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 text-left">
              <span className="text-[10px] font-bold text-[#d6b05d] uppercase tracking-wider block mb-2">
                Food Safety Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                What Every Ace Packaging Container Delivers
              </h2>
              <ul className="space-y-3">
                {complianceStatements.map((statement, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#d6b05d] shrink-0 mt-0.5" />
                    <span>{statement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md text-left">
              <span className="text-[10px] font-bold text-[#d6b05d] uppercase tracking-wider block mb-2">
                Audit Dossier
              </span>
              <h3 className="text-xl font-extrabold text-white mb-2.5">
                Download Certificates for Your QA File
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Official ISO 9001:2015 certificates, food migration test reports, and raw resin compliance datasheets are available directly for brand procurement audits.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="inline-flex items-center justify-center gap-2 bg-[#d6b05d] hover:bg-[#c49e48] text-[#161A12] font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Get Certificate Emailed</span>
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#d6b05d] hover:text-[#d6b05d] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Speak with QA Desk</span>
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
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[85vh] overflow-y-auto">
              <img
                src={previewImage}
                alt="Ace Packaging Certificate Preview"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
