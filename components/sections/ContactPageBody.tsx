import React from 'react';
import { PageBanner } from '@/components/ui/PageBanner';
import { Reveal } from '@/components/ui/Reveal';
import { MapPin, Phone, Mail, ShieldCheck, MessageCircle, ExternalLink, Navigation } from 'lucide-react';
import { FactoryInquiryForm } from '@/components/sections/FactoryInquiryForm';
import { getCmsSettings, getPageContent } from '@/lib/db/content';

export async function ContactPageBody({ breadcrumb }: { breadcrumb: { name: string; href: string } }) {
  const [settings, { content, hidden }] = await Promise.all([getCmsSettings(), getPageContent('contact')]);
  const show = (key: string) => !hidden.includes(key);
  const { banner, details: d, form, map } = content;
  // Only digits, dot, comma and minus reach the Google Maps URLs.
  const coords = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(map.coordinates.replace(/\s/g, '')) ? map.coordinates.replace(/\s/g, '') : '20.4519,72.8590';
  const phone = settings.contact_phone || settings.contact_phone_domestic || settings.header_settings?.topbarPhone || '+91 98251 20023 / +91 98251 47525';
  const email = settings.contact_email || settings.contact_email_domestic || settings.footer_settings?.domesticEmail || 'acepack2011@gmail.com';
  const whatsapp = settings.contact_whatsapp || settings.whatsapp_number || settings.header_settings?.topbarPhone || '+91 99250 15906';
  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {show('banner') && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[breadcrumb]} />
      )}

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Info Cards */}
            {show('details') && <div className="lg:col-span-5">
              <Reveal type="fade-right">
                <div className="flex flex-col gap-6">
                  <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">{d.addressLabel}</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-1">{d.addressTitle}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>Unit 1:</strong> {d.unit1Address}<br />
                        <strong>Unit 2:</strong> {d.unit2Address}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">{d.phoneLabel}</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-1">{phone}</h3>
                      <p className="text-xs text-gray-600">{d.phoneHours}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">{d.emailLabel}</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-1">{email}</h3>
                      <p className="text-xs text-gray-600">Domestic: {email} | Export: {d.exportEmail}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center shrink-0 border border-[#25D366]/30">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">{d.whatsappLabel}</span>
                      <h3 className="text-base font-bold text-[#1A1D20] mb-2">{whatsapp}</h3>
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(d.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1ebe5b] rounded-xl px-4 py-2.5 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> {d.whatsappButtonText}
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#E6DBC6] shadow-sm text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-[#a8812f]" /> {d.trustNote}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>}

            {/* Inquiry Form */}
            {show('form') && <div className="lg:col-span-7">
              <Reveal type="fade-left">
                <div className="bg-white p-5 sm:p-10 rounded-3xl border-2 border-[#cfa144]/70 shadow-lg h-full">
                  <h2 className="text-2xl font-extrabold text-[#1A1D20] mb-2">{form.heading}</h2>
                  <p className="text-xs text-gray-500 mb-8">{form.description}</p>

                  <FactoryInquiryForm />
                </div>
              </Reveal>
            </div>}

          </div>

          {show('map') && <Reveal type="fade-up">
            <div className="mt-12 md:mt-16">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                <div>
                  <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">{map.eyebrow}</span>
                  <h2 className="text-2xl font-extrabold text-[#1A1D20]">{map.heading}</h2>
                  <p className="text-xs text-gray-500 mt-1">{map.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${coords}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#cfa144] hover:bg-[#a8812f] rounded-xl px-4 py-2.5 transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" /> {map.directionsButtonText}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${coords}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1A1D20] bg-white border border-[#E6DBC6] rounded-xl px-4 py-2.5 hover:border-[#cfa144] transition-colors"
                  >
                    {map.openMapButtonText} <ExternalLink className="w-3.5 h-3.5 text-[#a8812f]" />
                  </a>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-[#E6DBC6] shadow-sm bg-white relative">
                <iframe
                  title="Ace Packaging Daman Manufacturing Unit 1 & 2 Location Pin"
                  src={`https://maps.google.com/maps?q=${coords}+(Ace+Packaging+Manufacturing+Unit+1)&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
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
                    <span><strong>Unit 1 Pinned:</strong> {map.unit1Note}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                    <span><strong>Unit 2:</strong> {map.unit2Note}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>}

        </div>
      </section>
    </div>
  );
}
