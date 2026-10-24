'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { MapPin, Phone, Mail, ArrowRight, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

const inputClasses =
  'w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144] focus:ring-4 focus:ring-[#cfa144]/10 transition-all duration-200';

const contactCards = [
  {
    icon: MapPin,
    label: 'Manufacturing Facilities',
    title: 'Unit 1 & Unit 2, Daman',
    detail: 'Unit 1: Survey No. 42/1, Dori Kadaiya Road, Kadaiya, Nani Daman - 396 210 | Unit 2: Survey No. 191/1, Somnath Road, Dabhel, Daman - 396 210'
  },
  {
    icon: Phone,
    label: 'Direct Sales & WhatsApp',
    title: '+91 98251 20023 / +91 98251 47525',
    detail: 'WhatsApp: +91 99250 15906 | Mon – Sat, 9:00 AM – 7:00 PM IST'
  },
  {
    icon: Mail,
    label: 'Official Inquiries',
    title: 'acepack2011@gmail.com',
    detail: 'Domestic: acepack2011@gmail.com | Export: sales@acepack.co.in'
  }
];

export const ContactSection: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };
  return (
    <section className="relative py-16 sm:py-24 bg-[#FAF8F4] overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 w-[260px] sm:w-[460px] h-[260px] sm:h-[460px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.16)_0%,rgba(184,152,88,0)_70%)]" />

      <Container className="relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#a8812f] tracking-wide mb-3 px-3.5 py-1.5 rounded-full bg-[#cfa144]/10 border border-[#cfa144]/20">
            Get In Touch With Ace Packaging
          </span>
          <SplitHeading>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1D20] tracking-tight leading-tight">
              Contact Our Factory & Sales Team
            </h2>
          </SplitHeading>
          <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed">
            Discuss your requirements, inquire about custom IML branding, or speak with our polymer packaging engineers in Daman.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {contactCards.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <Reveal key={idx} type="fade-right" delay={idx * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E6DBC6] hover:border-[#cfa144]/60 shadow-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#cfa144] to-[#8a6f3d] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#cfa144]/25">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">{item.label}</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#1A1D20] mb-1 break-words">{item.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>

          <Reveal type="fade-left" delay={0.15}>
            <div className="lg:col-span-7 bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-[#cfa144]/70 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-2">Send Factory Inquiry</h3>
              <p className="text-xs text-gray-500 mb-6 sm:mb-8">Tell us about your application and request product information or a sample kit.</p>

              {submitted ? (
                <div className="py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 inline-block mb-2">
                    Inquiry Transmitted
                  </span>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-2">
                    Inquiry Submitted Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, <strong className="text-[#1A1D20]">{formData.name || 'Valued Partner'}</strong>. Your inquiry has been received by our technical sales and dispatch team. We will review your volume specifications and respond within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', company: '', email: '', phone: '', category: '', message: '' });
                    }}
                    className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#a8812f] text-white text-xs font-bold py-3 px-6 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Full Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Company / Brand *</label>
                      <input
                        type="text"
                        placeholder="Ace Cloud Kitchens"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="+91 98251 20023"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Container Category of Interest</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`${inputClasses} text-gray-700`}
                    >
                      <option value="">Select a container line...</option>
                      {productCategories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Detailed Message / Order Quantity *</label>
                    <textarea
                      rows={4}
                      placeholder="Please specify container size, monthly volume requirement, and shipping location..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`${inputClasses} resize-none`}
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full bg-gradient-to-r from-[#cfa144] to-[#a8812f] hover:from-[#a8812f] hover:to-[#cfa144] text-white font-bold py-3.5 sm:py-4 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#cfa144]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Requirements...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Your Requirements</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 mt-2">
                    <Lock className="w-3 h-3 text-[#a8812f]" /> Your information is 100% confidential & protected
                  </p>
                </form>
              )}
            </div>
          </Reveal>

        </div>

      </Container>
    </section>
  );
};
