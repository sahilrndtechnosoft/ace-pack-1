'use client';

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ExhibitionEvent } from '@/lib/data/events';

interface EventBookingFormProps {
  event: ExhibitionEvent;
}

export const EventBookingForm: React.FC<EventBookingFormProps> = ({ event }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    attendees: '1-2 people',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all mandatory fields (*).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          industry: `Stand Meeting at ${event.shortTitle}`,
          documentTitle: `Booth Consultation Request: ${event.title} (${formData.attendees})`,
          downloadUrl: '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit appointment request.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register appointment. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6DBC6] shadow-sm">
      {!submitted ? (
        <div>
          <div className="mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b99750] block">
              1-on-1 Consultation
            </span>
            <h3 className="text-lg font-black text-[#1A1D20] mt-0.5">
              Book a Meeting at Our Stand
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Connect with our Managing Director, Head of Mould Tooling, or Export Team at {event.booth || 'our pavilion'}.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Singhania"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#1A1D20] outline-none focus:border-[#b99750] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Company / Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gourmet Cloud Kitchen"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#1A1D20] outline-none focus:border-[#b99750] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="procurement@brand.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#1A1D20] outline-none focus:border-[#b99750] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#1A1D20] outline-none focus:border-[#b99750] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Delegation Size
              </label>
              <select
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#1A1D20] bg-white outline-none focus:border-[#b99750] transition-colors cursor-pointer"
              >
                <option value="1-2 people">1 – 2 Delegates</option>
                <option value="3-5 people">3 – 5 Delegates (Procurement &amp; QA Team)</option>
                <option value="5+ people">Enterprise Delegation (5+ Delegates)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Specific Packaging Requirements (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Inquiring about custom IML 500ml tubs, MOQ, and export freight rates..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#1A1D20] outline-none focus:border-[#b99750] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Appointment...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm Stand Meeting &amp; Request VIP Pass</span>
                </>
              )}
            </button>

            <p className="text-[10.5px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Complimentary VIP visitor passes and sample kits issued upon registration.</span>
            </p>
          </form>
        </div>
      ) : (
        <div className="py-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-xl font-black text-[#1A1D20]">
            Stand Appointment Confirmed!
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Thank you, <strong className="text-[#1A1D20]">{formData.name}</strong>. Our events director has registered your meeting for <strong className="text-[#b99750]">{event.shortTitle}</strong> ({event.booth || 'Official Pavilion'}).
          </p>
          <p className="text-xs text-gray-500">
            A confirmation guide and digital pass has been sent to <strong>{formData.email}</strong>.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#FAF8F4] border border-[#E6DBC6] hover:border-[#b99750] text-[#1A1D20] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      )}
    </div>
  );
};
