'use client';

import React, { useState } from 'react';
import { ArrowRight, Lock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

export const BlogInquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in required fields (*).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setError(null);
    setFormData({ name: '', email: '', phone: '', category: '', message: '' });
  };

  if (submitted) {
    return (
      <div className="py-6 text-center animate-fade-in bg-[#FAF8F4] rounded-2xl p-4 border border-[#E6DBC6]">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5 inline-block mb-1.5">
          Inquiry Submitted
        </span>
        <h4 className="text-base font-bold text-[#1A1D20] mb-1">
          Thank You, {formData.name || 'Valued Reader'}!
        </h4>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Your inquiry has been received. Our technical team will reach out with packaging specs and samples within 24 hours.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-bold text-[#a8812f] hover:text-[#1A1D20] underline transition-colors cursor-pointer"
        >
          Send another question
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. John Smith"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144] focus:ring-2 focus:ring-[#cfa144]/15 transition-all"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="your@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144] focus:ring-2 focus:ring-[#cfa144]/15 transition-all"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="10-digit mobile number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144] focus:ring-2 focus:ring-[#cfa144]/15 transition-all"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
          Product of Interest
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#cfa144] focus:ring-2 focus:ring-[#cfa144]/15 transition-all"
        >
          <option value="">Choose a product line...</option>
          {productCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          required
          placeholder="Describe your container requirements..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl p-3.5 text-xs text-[#1A1D20] focus:outline-none focus:border-[#cfa144] focus:ring-2 focus:ring-[#cfa144]/15 transition-all resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <span>Submit Inquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 mt-1">
        <Lock className="w-3 h-3 text-[#a8812f]" /> 100% confidential &amp; protected
      </p>
    </form>
  );
};
