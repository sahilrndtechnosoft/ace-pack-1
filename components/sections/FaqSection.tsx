'use client';

import { homeFaq } from '@/lib/cms/pages/home';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { ChevronDown, HelpCircle, ArrowRight, Lock, PhoneCall, Mail } from 'lucide-react';
import { productCategories } from '@/lib/data/products';
import { FactoryInquiryForm } from './FactoryInquiryForm';

export const FaqSection: React.FC<{ content?: typeof homeFaq }> = ({ content: c = homeFaq }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);


  return (
    <section id="faq-section" className="relative py-20 bg-[#FAF8F4] text-[#1A1D20] border-b border-[#E6DBC6]/40 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 left-0 w-[200px] sm:w-[380px] h-[200px] sm:h-[380px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.11)_0%,transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 w-[220px] sm:w-[420px] h-[220px] sm:h-[420px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.11)_0%,transparent_70%)]" />
      <Container className="relative z-10">

        {/* Merged Layout: Left Side FAQ, Right Side Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: FAQ Accordion (lg:col-span-6) */}
          <Reveal type="fade-right" duration={0.8}>
          <div className="lg:col-span-6 flex flex-col text-left">

            <span className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider block mb-3">
              {c.eyebrow}
            </span>

            <SplitHeading>
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1A1D20] tracking-tight leading-snug mb-6">
                {c.heading}
              </h2>
            </SplitHeading>

            <div className="space-y-4">
              {c.faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm ${
                      isOpen ? 'border-[#b99750] ring-1 ring-[#b99750]/20' : 'border-[#E6DBC6]'
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#1A1D20] hover:text-[#b99750] transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-[#b99750] shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[#b99750] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
                          <div className="px-5 pb-5 pt-2 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-[#E6DBC6]/40 font-normal">
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
            <div className="mt-8 p-5 bg-white rounded-2xl border border-[#E6DBC6] flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <PhoneCall className="w-4 h-4 text-[#b99750]" />
                <span>Factory Hotline: <strong>{c.phoneLine}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-[#b99750]" />
                <span>Sales Email: <strong>{c.salesEmail}</strong></span>
              </div>
            </div>

          </div>
          </Reveal>

          {/* Right Column: Contact Inquiry Form (lg:col-span-6) */}
          <Reveal type="fade-left" duration={0.8}>
          <div className="lg:col-span-6 bg-white p-5 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-xl text-left">

            <span className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider block mb-2">
              {c.formEyebrow}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D20] mb-2">{c.formHeading}</h3>
            <p className="text-xs text-gray-500 mb-8">{c.formDescription}</p>

            <FactoryInquiryForm />
          </div>
          </Reveal>

        </div>

      </Container>
    </section>
  );
};
