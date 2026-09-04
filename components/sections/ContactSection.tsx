'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { MapPin, Phone, Mail, ArrowRight, Lock } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

const inputClasses =
  'w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#b89858] focus:ring-4 focus:ring-[#b89858]/10 transition-all duration-200';

const contactCards = [
  {
    icon: MapPin,
    label: 'Factory Location',
    title: 'Daman Plant Unit',
    detail: 'Plot No. 42/1, Government Industrial Estate, Masat, Daman - 396210, U.T., India.'
  },
  {
    icon: Phone,
    label: 'Direct Sales Hotline',
    title: '+91 98000 00000 / +91 98251 00000',
    detail: 'Available Monday through Saturday, 9:00 AM – 7:00 PM IST.'
  },
  {
    icon: Mail,
    label: 'Official Inquiry Email',
    title: 'info@acepack.co.in',
    detail: 'Guaranteed response within 4 business hours.'
  }
];

export const ContactSection: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 bg-[#FAF8F4] overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 w-[260px] sm:w-[460px] h-[260px] sm:h-[460px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.16)_0%,rgba(184,152,88,0)_70%)]" />

      <Container className="relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#b89858] uppercase tracking-wider mb-3 px-3.5 py-1.5 rounded-full bg-[#b89858]/10 border border-[#b89858]/20">
            Get In Touch With AcePack
          </span>
          <SplitHeading>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1D20] tracking-tight leading-tight">
              Contact Our Factory & Sales Team
            </h2>
          </SplitHeading>
          <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed">
            Request wholesale pricing, inquire about custom IML branding, or speak with our polymer packaging engineers in Daman.
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
                    className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E6DBC6] hover:border-[#b89858]/60 shadow-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#b89858] to-[#8a6f3d] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#b89858]/25">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#b89858] uppercase tracking-wider block mb-1">{item.label}</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#1A1D20] mb-1 break-words">{item.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>

          <Reveal type="fade-left" delay={0.15}>
            <div className="lg:col-span-7 bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-[#b89858]/70 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-2">Send Factory Inquiry</h3>
              <p className="text-xs text-gray-500 mb-6 sm:mb-8">Fill in your requirements below to receive a wholesale catalog & sample kit.</p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Full Name *</label>
                    <input type="text" placeholder="John Doe" required className={inputClasses} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Company / Brand *</label>
                    <input type="text" placeholder="Ace Cloud Kitchens" required className={inputClasses} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Email Address *</label>
                    <input type="email" placeholder="john@company.com" required className={inputClasses} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Phone / WhatsApp *</label>
                    <input type="tel" placeholder="+91 98000 00000" required className={inputClasses} />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Container Category of Interest</label>
                  <select className={`${inputClasses} text-gray-700`}>
                    <option value="">Select a container line...</option>
                    {productCategories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Detailed Message / Order Quantity *</label>
                  <textarea rows={4} placeholder="Please specify container size, monthly volume requirement, and shipping location..." required className={`${inputClasses} resize-none`}></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-gradient-to-r from-[#b89858] to-[#9e8042] hover:from-[#9e8042] hover:to-[#b89858] text-white font-bold py-3.5 sm:py-4 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#b89858]/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Submit Wholesale Quotation Request</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 mt-2">
                  <Lock className="w-3 h-3 text-[#b89858]" /> Your information is 100% confidential & protected
                </p>
              </form>
            </div>
          </Reveal>

        </div>

      </Container>
    </section>
  );
};
