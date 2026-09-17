import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck, Lock, MessageCircle, ExternalLink } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Contact Us | AcePack Plastic Food Packaging Manufacturer',
  description: 'Get in touch with AcePack sales team for factory wholesale quotes, custom mould R&D, and free sample requests for plastic food containers.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Contact Our Factory & Sales Team"
        subtitle="Request wholesale pricing, inquire about custom IML branding, or speak with our polymer packaging engineers in Daman."
        badge="GET IN TOUCH WITH ACEPACK"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Contact', href: '/contact' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Factory Location</span>
                  <h3 className="text-base font-bold text-[#1A1D20] mb-1">Daman Plant Unit</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Plot No. 42/1, Government Industrial Estate, Masat, Daman - 396210, U.T., India.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Direct Sales Hotline</span>
                  <h3 className="text-base font-bold text-[#1A1D20] mb-1">+91 98000 00000 / +91 98251 00000</h3>
                  <p className="text-xs text-gray-600">Available Monday through Saturday, 9:00 AM – 7:00 PM IST.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center shrink-0 border border-[#cfa144]/30">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Official Inquiry Email</span>
                  <h3 className="text-base font-bold text-[#1A1D20] mb-1">info@acepack.co.in</h3>
                  <p className="text-xs text-gray-600">Guaranteed response within 4 business hours.</p>
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
                    href="https://wa.me/919925015906?text=Hello%20AcePack%2C%20I%27d%20like%20a%20wholesale%20quote%20for%20food%20containers."
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
                  <ShieldCheck className="w-4 h-4 text-[#a8812f]" /> 100% Direct Factory Wholesale Rates & Sample Kits
                </div>
              </div>

            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#cfa144]/70 shadow-lg">
              <h2 className="text-2xl font-extrabold text-[#1A1D20] mb-2">Send Factory Inquiry</h2>
              <p className="text-xs text-gray-500 mb-8">Fill in your requirements below to receive a wholesale catalog & sample kit.</p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Full Name *</label>
                    <input type="text" placeholder="John Doe" required className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Company / Brand *</label>
                    <input type="text" placeholder="Ace Cloud Kitchens" required className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Email Address *</label>
                    <input type="email" placeholder="john@company.com" required className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Phone / WhatsApp *</label>
                    <input type="tel" placeholder="+91 98000 00000" required className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#cfa144]" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Container Category of Interest</label>
                  <select className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#cfa144]">
                    <option value="">Select a container line...</option>
                    {productCategories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A1D20] uppercase block mb-1">Detailed Message / Order Quantity *</label>
                  <textarea rows={4} placeholder="Please specify container size, monthly volume requirement, and shipping location..." required className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl p-4 text-xs focus:outline-none focus:border-[#cfa144]"></textarea>
                </div>

                <button type="submit" className="w-full bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] font-bold py-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2">
                  <span>Submit Wholesale Quotation Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 mt-2">
                  <Lock className="w-3 h-3 text-[#a8812f]" /> Your information is 100% confidential & protected
                </p>
              </form>
            </div>

          </div>

          <div className="mt-12 md:mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div>
                <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-1">Find Us</span>
                <h2 className="text-2xl font-extrabold text-[#1A1D20]">Daman Plant, Government Industrial Estate</h2>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Plot+No.+42%2F1%2C+Government+Industrial+Estate%2C+Masat%2C+Daman+396210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1A1D20] bg-white border border-[#E6DBC6] rounded-xl px-4 py-2.5 hover:border-[#cfa144] transition-colors"
              >
                Open in Google Maps <ExternalLink className="w-3.5 h-3.5 text-[#a8812f]" />
              </a>
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#E6DBC6] shadow-sm bg-white">
              <iframe
                title="AcePack Daman plant location"
                src="https://www.google.com/maps?q=Plot+No.+42%2F1%2C+Government+Industrial+Estate%2C+Masat%2C+Daman+396210&output=embed"
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block w-full h-[320px] sm:h-[420px]"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
