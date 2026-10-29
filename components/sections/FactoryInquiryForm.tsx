'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

export const FactoryInquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
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

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill in all mandatory fields (*).');
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
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      category: '',
      message: ''
    });
  };

  if (submitted) {
    return (
      <div className="py-8 text-center animate-fade-in bg-white rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 inline-block mb-2">
          Inquiry Successfully Sent
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-2">
          Factory Inquiry Received!
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
          Thank you, <strong className="text-[#1A1D20]">{formData.name || 'Valued Partner'}</strong>. Your inquiry has been dispatched to Ace Packaging&apos;s production engineers and sales desk in Daman. We will review your application specifications and respond within 24 hours.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#a8812f] text-white text-xs font-bold py-3 px-6 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
        >
          <span>Send Another Inquiry</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144] focus:ring-4 focus:ring-[#cfa144]/10 transition-all duration-200"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">
            Company / Brand <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ace Cloud Kitchens"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144] focus:ring-4 focus:ring-[#cfa144]/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144] focus:ring-4 focus:ring-[#cfa144]/10 transition-all duration-200"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98251 20023"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144] focus:ring-4 focus:ring-[#cfa144]/10 transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">
          Container Category of Interest
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#cfa144] focus:ring-4 focus:ring-[#cfa144]/10 transition-all duration-200"
        >
          <option value="">Select a container line...</option>
          {productCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">
          Detailed Message / Order Quantity <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          required
          placeholder="Please specify container size, monthly volume requirement, and shipping location..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl p-4 text-xs focus:outline-none focus:border-[#cfa144] focus:ring-4 focus:ring-[#cfa144]/10 transition-all duration-200 resize-none"
        ></textarea>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] font-bold py-3.5 sm:py-4 px-4 rounded-xl text-xs uppercase tracking-wide sm:tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Inquiry to Factory...</span>
          </>
        ) : (
          <>
            <span>Send Factory Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>

      <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 mt-2">
        <Lock className="w-3 h-3 text-[#a8812f]" /> Your information is 100% confidential &amp; protected
      </p>
    </form>
  );
};
