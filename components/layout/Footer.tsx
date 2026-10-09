'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall, Mail, MapPin, ShieldCheck, Award } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF8F4] text-[var(--ace-ink)] pt-16 pb-10 border-t-2 border-[#E6DBC6]">
      <div className="container-custom max-w-[1600px]">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E6DBC6]">
          
          {/* Brand & Info Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block mb-6 group">
                <div className="bg-white px-4 py-2 rounded-2xl border border-[#b99750]/40 shadow-xs inline-flex items-center group-hover:border-[#b99750] transition-colors">
                  <img
                    src="/images/ACE_Pack_Logo-01.png"
                    alt="Ace Packaging"
                    width={400}
                    height={174}
                    loading="lazy"
                    decoding="async"
                    className="h-10 sm:h-12 w-auto max-w-[150px] sm:max-w-[180px] object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm mb-6">
                Pioneering high-precision injection-moulded plastic containers, portion cups, and custom packaging systems for QSR chains, cloud kitchens, and dairy brands nationwide.
              </p>

              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#b99750]/40 text-xs font-semibold text-[#8c6f2a] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#b99750] shrink-0" />
                <span>ISO 9001:2015 &amp; US FDA 21 CFR Food-Grade</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2.5 text-xs text-gray-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#b99750] shrink-0 mt-0.5" />
                <span>Unit 1: Survey No. 111, Dori Kadaiya, Daman - 396210, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#b99750] shrink-0" />
                <span>+91 99250 15906 / +91 99251 55799</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#b99750] shrink-0" />
                <span>sales@acepack.co.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-600">
              <li><Link href="/" className="hover:text-[#b99750] transition-colors">Home</Link></li>
              <li><Link href="/categories" className="hover:text-[#b99750] transition-colors">Our Products</Link></li>
              <li><Link href="/products" className="hover:text-[#b99750] transition-colors">All Product Catalog</Link></li>
              <li><Link href="/about" className="hover:text-[#b99750] transition-colors">About Us</Link></li>
              <li><Link href="/capabilities" className="hover:text-[#b99750] transition-colors">Capabilities</Link></li>
              <li><Link href="/industries" className="hover:text-[#b99750] transition-colors">Industries We Serve</Link></li>
              <li><Link href="/quality" className="hover:text-[#b99750] transition-colors">Quality &amp; Certifications</Link></li>
              <li><Link href="/downloads" className="hover:text-[#b99750] transition-colors">Download Center</Link></li>
              <li><Link href="/oem" className="hover:text-[#b99750] transition-colors">OEM &amp; Custom Tooling</Link></li>
              <li><Link href="/customization" className="hover:text-[#b99750] transition-colors">Customization</Link></li>
              <li><Link href="/tools" className="hover:text-[#b99750] transition-colors">Tools</Link></li>
              <li><Link href="/gallery" className="hover:text-[#b99750] transition-colors">Visual Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-[#b99750] transition-colors">Blog &amp; Articles</Link></li>
              <li><Link href="/contact" className="hover:text-[#b99750] transition-colors">Contact Team</Link></li>
            </ul>
          </div>

          {/* Product Lines Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider mb-5">All 11 Product Categories</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-600">
              {productCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-[#b99750] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b99750]" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider mb-5">Catalog &amp; Updates</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Subscribe to receive our latest product catalog, new CAD specifications, and export packaging updates.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5">
              <input
                type="email"
                placeholder="Enter your business email"
                className="bg-white border border-[#E6DBC6] rounded-full px-4 py-2.5 text-xs text-[var(--ace-ink)] placeholder-gray-400 focus:outline-none focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20"
              />
              <button
                type="submit"
                className="bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold py-2.5 px-4 rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Subscribe Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Ace Packaging Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[var(--ace-ink)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--ace-ink)] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
