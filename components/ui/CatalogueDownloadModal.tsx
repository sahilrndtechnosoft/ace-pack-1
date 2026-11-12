'use client';
import { useSiteText } from '@/components/layout/SiteTextProvider';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileDown,
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface CatalogueDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  downloadUrl?: string;
}

const INITIAL_FORM_STATE = {
  name: '',
  company: '',
  email: '',
  phone: '',
  industry: 'Cloud Kitchen & Delivery',
};

export const CatalogueDownloadModal: React.FC<CatalogueDownloadModalProps> = ({
  isOpen,
  onClose,
  documentTitle = 'Ace Packaging Full Product Catalog 2026',
  downloadUrl = '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
}) => {
  const t = useSiteText().downloadPopup;
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean full reset of form and feedback states
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setSubmittedEmail('');
    setSubmitted(false);
    setError(null);
    setLoading(false);
  }, []);

  // Handle closing modal cleanly
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Close on Escape key and lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Lenis drives page scroll itself, so overflow:hidden alone doesn't stop the page moving behind the modal.
    window.__lenis?.stop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      window.__lenis?.start();
    };
  }, [isOpen, handleClose]);

  // Always reset form state when modal closes or is reopened for another document
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen || typeof document === 'undefined') return null;

  const isCertificate =
    documentTitle.toLowerCase().includes('certificate') ||
    documentTitle.toLowerCase().includes('iso') ||
    documentTitle.toLowerCase().includes('sgs');
  const isDatasheet = documentTitle.toLowerCase().includes('datasheet');

  const modalHeading = isCertificate ? t.certificateHeading : isDatasheet ? t.datasheetHeading : t.catalogueHeading;

  const targetPdf =
    downloadUrl ||
    (isCertificate
      ? '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg'
      : isDatasheet
      ? '/downloads/datasheets/Ace_Packaging_Technical_Datasheet.pdf'
      : '/downloads/Ace_Packaging_Full_Product_Catalog.pdf');

  // Direct browser download helper
  const triggerBrowserDownload = (url: string, title: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      const cleanTitle =
        title.endsWith('.pdf') || title.endsWith('.jpg') || title.endsWith('.png')
          ? title
          : url.endsWith('.jpg')
          ? `${title.replace(/\s+/g, '_')}.jpg`
          : `${title.replace(/\s+/g, '_')}.pdf`;
      link.download = cleanTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.warn('Direct download trigger fallback:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameTrimmed = formData.name.trim();
    const companyTrimmed = formData.company.trim();
    const emailTrimmed = formData.email.trim();
    const phoneTrimmed = formData.phone.trim();

    if (!nameTrimmed || !emailTrimmed || !companyTrimmed || !phoneTrimmed) {
      setError('Please fill in all required fields (*).');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setError('Please enter a valid business email address.');
      return;
    }

    if (phoneTrimmed.replace(/\D/g, '').length < 6) {
      setError('Please enter a valid phone number (min. 6 digits).');
      return;
    }

    setLoading(true);

    try {
      // Call backend API to email the document to the user and notify sales
      const res = await fetch('/api/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameTrimmed,
          company: companyTrimmed,
          email: emailTrimmed,
          phone: phoneTrimmed,
          industry: formData.industry,
          documentTitle,
          downloadUrl: targetPdf,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch document. Please try again.');
      }

      // Preserve sent email for confirmation view, then CLEAR form state
      setSubmittedEmail(emailTrimmed);
      setFormData(INITIAL_FORM_STATE);
      setSubmitted(true);

      // Trigger automatic direct browser download
      if (targetPdf) {
        triggerBrowserDownload(targetPdf, documentTitle);
      }
    } catch (err: unknown) {
      console.error('Error requesting document:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Could not complete document request. Please check your network connection.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Portalled to <body>: page wrappers (transition transforms, isolated stacking contexts) would
  // otherwise turn `fixed` into page-relative, letting sections scroll over the modal.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-modal-title"
      data-lenis-prevent
      className="fixed inset-0 z-[1000] overflow-y-auto overscroll-contain bg-black/70 backdrop-blur-xs p-3 sm:p-5 md:p-6 transition-all duration-200"
      onClick={handleClose}
    >
      {/* Outer flex container ensuring proper centering without vertical clipping */}
      <div className="flex min-h-full items-center justify-center py-4 sm:py-8">
        <div
          className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white border border-[#E6DBC6] shadow-2xl p-5 sm:p-7 md:p-8 text-[var(--ace-ink)] cursor-default my-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - 44px touch target on mobile */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              {/* Header Title with Right Padding so it never overlaps the Close Button */}
              <div className="pr-10 sm:pr-12 mb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#9a7628] bg-[#b99750]/15 border border-[#b99750]/25">
                    <FileDown className="w-3 h-3" />
                    {t.eyebrow}
                  </span>
                </div>
                <h3
                  id="catalogue-modal-title"
                  className="text-lg sm:text-2xl font-extrabold text-[var(--ace-ink)] leading-snug"
                >
                  {modalHeading}
                </h3>
              </div>

              {/* Selected Document Preview Card */}
              <div className="mb-4 p-3 sm:p-3.5 bg-[#FAF8F4] rounded-2xl border border-[#E6DBC6] flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E6DBC6] text-[#b99750] flex items-center justify-center shrink-0 shadow-2xs">
                  {isCertificate ? (
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#b99750]" />
                  ) : (
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#b99750]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {t.fileLabel}
                  </div>
                  <div
                    className="text-xs sm:text-sm font-bold text-[var(--ace-ink)] truncate"
                    title={documentTitle}
                  >
                    {documentTitle}
                  </div>
                </div>
                <div className="hidden xs:flex sm:flex shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {t.fileBadge}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                {t.intro}
              </p>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                  {targetPdf && (
                    <a
                      href={targetPdf}
                      download
                      className="shrink-0 underline font-bold text-red-800 hover:text-red-900"
                    >
                      {t.directDownloadText}
                    </a>
                  )}
                </div>
              )}

              {/* Responsive Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                {/* Responsive 2-column Grid on tablet/desktop, stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      {t.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-[15px] sm:text-sm text-[var(--ace-ink)] placeholder-gray-400 outline-hidden transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      {t.companyLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoComplete="organization"
                        placeholder="e.g. Cloud Kitchen Brand"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-[15px] sm:text-sm text-[var(--ace-ink)] placeholder-gray-400 outline-hidden transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      {t.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="procurement@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-[15px] sm:text-sm text-[var(--ace-ink)] placeholder-gray-400 outline-hidden transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      {t.phoneLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-[15px] sm:text-sm text-[var(--ace-ink)] placeholder-gray-400 outline-hidden transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Business Type */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    {t.businessTypeLabel}
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20 text-[15px] sm:text-sm text-[var(--ace-ink)] outline-hidden transition-all bg-white cursor-pointer"
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

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl sm:rounded-full bg-[#b99750] hover:bg-[#a6843e] active:scale-[0.99] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/25 hover:shadow-xl hover:shadow-[#b99750]/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.sendingText}</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        <span>{t.submitText}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#b99750] shrink-0" />
                  <span>{t.privacyNote}</span>
                </p>
              </form>
            </div>
          ) : (
            /* Success confirmation screen - Notice formData is cleared, submittedEmail is shown */
            <div className="py-4 sm:py-6 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 border border-emerald-200 shadow-sm animate-in zoom-in-75 duration-200">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
                {t.successBadge}
              </span>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--ace-ink)] mb-2">
                {t.successHeading}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto mb-2 leading-relaxed">
                We have emailed a verified copy of <strong className="text-[var(--ace-ink)]">{documentTitle}</strong> to{' '}
                <strong className="text-[#a8812f] break-all">{submittedEmail}</strong>.
              </p>

              <p className="text-[11px] sm:text-xs text-gray-500 mb-6 max-w-sm mx-auto">
                {t.successNote}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                {targetPdf && (
                  <a
                    href={targetPdf}
                    download
                    className="w-full sm:w-auto px-5 py-3 rounded-xl sm:rounded-full bg-[#FAF8F4] border border-[#E6DBC6] hover:border-[#b99750] hover:bg-white text-[var(--ace-ink)] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-[#b99750]" />
                    <span>{t.downloadAgainText}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#b99750]/20 cursor-pointer"
                >
                  {t.closeText}
                </button>
              </div>

              {/* Reset action to submit another request cleanly */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-gray-500 hover:text-[#b99750] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.anotherDocumentText}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
