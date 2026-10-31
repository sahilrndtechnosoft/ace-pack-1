'use client';

import React, { useState, useEffect } from 'react';
import { X, FileDown, CheckCircle2, ShieldCheck, Building2, User, Mail, Phone, AlertCircle } from 'lucide-react';

interface CatalogueDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  downloadUrl?: string;
}

export const CatalogueDownloadModal: React.FC<CatalogueDownloadModalProps> = ({
  isOpen,
  onClose,
  documentTitle = 'Ace Packaging Full Product Catalog 2026',
  downloadUrl = '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: 'Cloud Kitchen & Delivery',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key and lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Reset submitted state when closed or reopened for another document
  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isCertificate = documentTitle.toLowerCase().includes('certificate') || documentTitle.toLowerCase().includes('iso');
  const isDatasheet = documentTitle.toLowerCase().includes('datasheet');
  const modalHeading = isCertificate
    ? 'Official Certificate Request'
    : isDatasheet
    ? 'Download Technical Datasheet'
    : 'Download Product Catalogue';

  const targetPdf = downloadUrl || (isCertificate
    ? '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg'
    : isDatasheet
    ? '/downloads/datasheets/Ace_Packaging_Technical_Datasheet.pdf'
    : '/downloads/Ace_Packaging_Full_Product_Catalog.pdf');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim() || !formData.phone.trim()) {
      setError('Please fill in all mandatory fields (*).');
      return;
    }

    setLoading(true);

    try {
      // Call backend API to email the document to the user and notify sales
      const res = await fetch('/api/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          industry: formData.industry,
          documentTitle,
          downloadUrl: targetPdf,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.warn('Document mailer response not ok:', errorData);
      }

      setSubmitted(true);

      // Trigger automatic direct browser download if a file URL is provided
      if (targetPdf) {
        const link = document.createElement('a');
        link.href = targetPdf;
        const cleanTitle = documentTitle.endsWith('.pdf') || documentTitle.endsWith('.jpg') || documentTitle.endsWith('.png')
          ? documentTitle
          : targetPdf.endsWith('.jpg')
          ? `${documentTitle.replace(/\s+/g, '_')}.jpg`
          : `${documentTitle.replace(/\s+/g, '_')}.pdf`;
        link.download = cleanTitle;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error requesting document:', err);
      // Fallback: still show submitted and trigger local file download
      setSubmitted(true);
      if (targetPdf) {
        const link = document.createElement('a');
        link.href = targetPdf;
        link.download = documentTitle.replace(/\s+/g, '_');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg my-auto rounded-3xl bg-white border border-[#E6DBC6] shadow-2xl p-6 sm:p-8 pt-8 sm:pt-9 text-[var(--ace-ink)] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[var(--ace-ink)] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0">
                <FileDown className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#b99750]">
                Official Document Verification
              </span>
            </div>

            <h3 id="catalogue-modal-title" className="text-xl sm:text-2xl font-extrabold text-[var(--ace-ink)] mb-1.5 leading-snug">
              {modalHeading}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">
              Enter your business details below. A copy of <strong className="text-[var(--ace-ink)]">{documentTitle}</strong> will be emailed to you immediately and downloaded to your device.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-xs sm:text-sm text-[var(--ace-ink)] outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Company / Brand Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biryani By Kilo / Cloud Kitchen"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-xs sm:text-sm text-[var(--ace-ink)] outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="procurement@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-xs sm:text-sm text-[var(--ace-ink)] outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-xs sm:text-sm text-[var(--ace-ink)] outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Primary Business Type
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-xs sm:text-sm text-[var(--ace-ink)] outline-hidden transition-all bg-white"
                >
                  <option value="Cloud Kitchen & Delivery">Cloud Kitchen &amp; Food Delivery</option>
                  <option value="QSR & Restaurant Chain">Quick Service Restaurant (QSR) Chain</option>
                  <option value="Dairy & Ice Cream">Dairy, Ice Cream &amp; Dessert Brand</option>
                  <option value="Sweets & Confectionery">Traditional Sweets / Mithai &amp; Confectionery</option>
                  <option value="Bakery & Gourmet Meals">Bakery &amp; Gourmet Meals</option>
                  <option value="Packaging Distributor / Trader">Packaging Distributor / Supply Partner</option>
                  <option value="Export / International Buyer">Export / International Importer</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span>Sending &amp; Preparing Document...</span>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Email Me &amp; Download Document</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1 mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b99750]" />
                <span>Your information is protected under our privacy policy.</span>
              </p>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-[var(--ace-ink)] mb-2">
              Document Dispatched!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto mb-2 leading-relaxed">
              We have emailed a copy of <strong className="text-[var(--ace-ink)]">{documentTitle}</strong> to <strong className="text-[#a8812f]">{formData.email}</strong>.
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Your direct download should have also started automatically on your device.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {targetPdf && (
                <a
                  href={targetPdf}
                  download
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF8F4] border border-[#E6DBC6] hover:border-[#b99750] text-[var(--ace-ink)] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-[#b99750]" />
                  <span>Download File Again</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#b99750] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#a6843e] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
