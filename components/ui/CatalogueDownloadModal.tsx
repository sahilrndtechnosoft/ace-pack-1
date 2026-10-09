'use client';

import React, { useState } from 'react';
import { X, FileDown, CheckCircle2, ShieldCheck, Building2, User, Mail, Phone, Globe2 } from 'lucide-react';

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
  downloadUrl = '/b9d572a7-af59-4e63-92e8-2971440edffe.png',
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate immediate lead submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      // Trigger actual download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${documentTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E6DBC6] shadow-2xl p-6 sm:p-8 text-[var(--ace-ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#b99750]/15 text-[#b99750] flex items-center justify-center">
                <FileDown className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#b99750]">
                Official Document Download
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--ace-ink)] mb-2">
              Download Product Catalogue
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              Please enter your business details to download <strong className="text-[var(--ace-ink)]">{documentTitle}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full py-3.5 px-6 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <span>Preparing Download...</span>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Verify &amp; Download PDF</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1 mt-3">
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
              Download Started!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto mb-6 leading-relaxed">
              Your copy of <strong className="text-[var(--ace-ink)]">{documentTitle}</strong> is now downloading. Our packaging team will also send a digital copy to {formData.email}.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#b99750] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#a6843e] transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
