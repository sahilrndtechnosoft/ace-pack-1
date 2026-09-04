'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { ChevronDown, HelpCircle, ArrowRight, Lock, PhoneCall, Mail } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What material resins are used in AcePack containers?',
      answer: 'All AcePack containers are manufactured using 100% prime virgin Polypropylene (PP 05) certified under US FDA 21 CFR 177.1520 regulations. They are 100% BPA-free, heavy metal free, and food-contact safe.'
    },
    {
      question: 'Are your plastic containers microwave and freezer safe?',
      answer: 'Yes, our PP 05 material has a operating thermal range spanning -20°C (deep freeze) up to +120°C (hot gravy filling and microwave reheating).'
    },
    {
      question: 'How do Hinge Cups prevent sauce leakage during delivery?',
      answer: 'Our Hinge Cups feature a built-in snap-tight lid rim geometry that creates an airtight hermetic seal, preventing liquid spillage even during rough motorcycle transit.'
    }
  ];

  return (
    <section className="relative py-20 bg-[#111518] text-white border-b border-white/10 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 left-0 w-[200px] sm:w-[380px] h-[200px] sm:h-[380px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.11)_0%,rgba(184,152,88,0)_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 w-[220px] sm:w-[420px] h-[220px] sm:h-[420px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.11)_0%,rgba(184,152,88,0)_70%)]" />
      <Container className="relative z-10">

        {/* Merged Layout: Left Side FAQ, Right Side Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: FAQ Accordion (lg:col-span-6) */}
          <Reveal type="fade-right" duration={0.8}>
          <div className="lg:col-span-6 flex flex-col text-left">

            <span className="text-xs font-extrabold text-[#b89858] uppercase tracking-wider block mb-3">
              HELP & FAQ
            </span>

            <SplitHeading>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-8">
                Everything You Need to Know About Food Packaging
              </h2>
            </SplitHeading>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-[#050505] rounded-2xl border overflow-hidden transition-colors duration-300 ${
                      isOpen ? 'border-[#b89858]/70' : 'border-white/15'
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-[#b89858] transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-[#b89858] shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[#b89858] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-2 text-sm sm:text-base text-gray-300 leading-relaxed border-t border-white/10 font-normal">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Direct Phone & Email Bar */}
            <div className="mt-8 p-5 bg-[#050505] rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <PhoneCall className="w-4 h-4 text-[#b89858]" />
                <span>Hotline: <strong>+91 98000 00000</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-[#b89858]" />
                <span>Email: <strong>info@acepack.co.in</strong></span>
              </div>
            </div>

          </div>
          </Reveal>

          {/* Right Column: Contact Inquiry Form (lg:col-span-6) */}
          <Reveal type="fade-left" duration={0.8}>
          <div className="lg:col-span-6 bg-[#050505] p-8 sm:p-10 rounded-3xl border-2 border-[#b89858]/60 shadow-2xl text-left">

            <span className="text-xs font-extrabold text-[#b89858] uppercase tracking-wider block mb-2">
              GET IN TOUCH WITH ACEPACK
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Send Factory Inquiry</h3>
            <p className="text-xs text-gray-400 mb-8">Fill in your requirements below to receive a wholesale catalog & sample kit.</p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Full Name *</label>
                  <input type="text" placeholder="John Doe" required className="w-full bg-[#111518] border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#b89858] transition-colors duration-200" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Company / Brand *</label>
                  <input type="text" placeholder="Ace Cloud Kitchens" required className="w-full bg-[#111518] border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#b89858] transition-colors duration-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Email Address *</label>
                  <input type="email" placeholder="john@company.com" required className="w-full bg-[#111518] border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#b89858] transition-colors duration-200" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Phone / WhatsApp *</label>
                  <input type="tel" placeholder="+91 98000 00000" required className="w-full bg-[#111518] border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#b89858] transition-colors duration-200" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Container Category of Interest</label>
                <select className="w-full bg-[#111518] border border-white/20 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none focus:border-[#b89858] transition-colors duration-200">
                  <option value="">Select a container line...</option>
                  {productCategories.map((cat) => (
                    <option key={cat.id} value={cat.slug} className="bg-[#111518] text-white">{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Detailed Message / Order Quantity *</label>
                <textarea rows={4} placeholder="Please specify container size, monthly volume requirement, and shipping location..." required className="w-full bg-[#111518] border border-white/20 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#b89858] transition-colors duration-200"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#b89858] hover:bg-[#9e8042] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#b89858]/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                <span>Submit Wholesale Quotation Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>

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
