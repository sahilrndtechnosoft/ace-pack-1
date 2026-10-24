import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { MapPin, Phone, Mail, ArrowRight, ShieldCheck, MessageCircle, ExternalLink, Navigation } from 'lucide-react';
import { FactoryInquiryForm } from '@/components/sections/FactoryInquiryForm';

export const metadata: Metadata = {
  title: 'Contact Us | Ace Packaging Plastic Food Packaging Manufacturer',
  description: 'Get in touch with Ace Packaging sales team for product information, custom mould R&D, and free sample requests for plastic food containers.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Contact Our Factory & Sales Team"
        subtitle="Discuss your requirements, inquire about custom IML branding, or speak with our polymer packaging engineers in Daman."
        badge="Get in touch with Ace Packaging"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Contact', href: '/contact' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-5">
              <Reveal type="fade-right">
                <div className="flex flex-col gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Manufacturing Units</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-1">Unit 1 & Unit 2, Daman</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>Unit 1:</strong> Survey No. 42/1, Dori Kadaiya Road, Kadaiya, Nani Daman - 396 210, U.T., India.<br />
                        <strong>Unit 2:</strong> Survey No. 191/1, Somnath Road, Dabhel, Daman - 396 210, U.T., India.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Direct Sales Hotline</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-1">+91 98251 20023 / +91 98251 47525</h3>
                      <p className="text-xs text-gray-600">Available Monday through Saturday, 9:00 AM – 7:00 PM IST.</p>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Official Inquiry Emails</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-1">acepack2011@gmail.com</h3>
                      <p className="text-xs text-gray-600">Domestic: acepack2011@gmail.com | Export: sales@acepack.co.in</p>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center shrink-0 border border-[#25D366]/30">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">WhatsApp Sales</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-2">+91 99250 15906</h3>
                      <a
                        href="https://wa.me/919925015906?text=Hello%20Ace%20Packaging%2C%20I%27d%20like%20a%20product%20information%20for%20food%20containers."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1ebe5b] rounded-xl px-4 py-2.5 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#E6DBC6] shadow-sm text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-[#a8812f]" /> Product Specifications & Sample Kits
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <Reveal type="fade-left">
                <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#cfa144]/70 shadow-lg h-full">
                  <h2 className="text-2xl font-extrabold text-[#1A1D20] mb-2">Send Factory Inquiry</h2>
                  <p className="text-xs text-gray-500 mb-8">Tell us about your application and request product information or a sample kit.</p>

                  <FactoryInquiryForm />
                </div>
              </Reveal>
            </div>

          </div>

          <Reveal type="fade-up">
            <div className="mt-12 md:mt-16">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                <div>
                  <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Find Us & Navigation</span>
                  <h2 className="text-2xl font-extrabold text-[#1A1D20]">Daman Manufacturing Units (Unit 1 &amp; Unit 2)</h2>
                  <p className="text-xs text-gray-500 mt-1">Exact pinned location for factory visits, logistics dispatch, and audits.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=20.4519,72.8590"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#cfa144] hover:bg-[#a8812f] rounded-xl px-4 py-2.5 transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Get Directions (Unit 1)
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=20.4519,72.8590"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1A1D20] bg-white border border-[#E6DBC6] rounded-xl px-4 py-2.5 hover:border-[#cfa144] transition-colors"
                  >
                    Open in Google Maps <ExternalLink className="w-3.5 h-3.5 text-[#a8812f]" />
                  </a>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-[#E6DBC6] shadow-sm bg-white relative">
                <iframe
                  title="Ace Packaging Daman Manufacturing Unit 1 & 2 Location Pin"
                  src="https://maps.google.com/maps?q=20.4519,72.8590+(Ace+Packaging+Manufacturing+Unit+1)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                  width="100%"
                  height="440"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="block w-full h-[340px] sm:h-[440px]"
                />
                <div className="p-4 bg-[#FAF8F4] border-t border-[#E6DBC6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span><strong>Unit 1 Pinned:</strong> Survey No. 42/1, Dori Kadaiya Road, Kadaiya, Nani Daman - 396210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                    <span><strong>Unit 2:</strong> Survey No. 191/1, Somnath Road, Dabhel, Daman - 396210</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </div>
  );
}
