'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111518] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container-custom">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Info Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block mb-6">
                <div className="bg-white px-4 py-2 rounded-2xl border border-[#b89858]/40 shadow-md inline-flex items-center">
                  <img
                    src="/images/ace-logo.webp"
                    alt="AcePack Container Solutions"
                    width={320}
                    height={165}
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-auto max-w-[70px] object-contain"
                  />
                </div>
              </Link>

              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-6">
                Pioneering high-performance injection-moulded plastic containers, portion cups, and custom packaging systems for restaurants, cloud kitchens, and dairy brands nationwide.
              </p>

              <div className="inline-flex items-center gap-2 bg-[#161b1f] px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-[#D6BC83]">
                <ShieldCheck className="w-4 h-4 text-[#b89858]" /> ISO 9001:2015 & FDA Food-Grade Certified
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#b89858] shrink-0" />
                <span>Unit 1: Survey No. 111, Dori Kadaiya, Daman-396210</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#b89858] shrink-0" />
                <span>+91 99250 15906 / +91 99251 55799</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#b89858] shrink-0" />
                <span>sales@acepack.co.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-[#D6BC83] transition-colors">Home</Link></li>
              <li><Link href="/categories" className="hover:text-[#D6BC83] transition-colors">Our Products</Link></li>
              <li><Link href="/products" className="hover:text-[#D6BC83] transition-colors">All Product Catalog</Link></li>
              <li><Link href="/about" className="hover:text-[#D6BC83] transition-colors">About Us</Link></li>
              <li><Link href="/capabilities" className="hover:text-[#D6BC83] transition-colors">Capabilities</Link></li>
              <li><Link href="/industries" className="hover:text-[#D6BC83] transition-colors">Industries We Serve</Link></li>
              <li><Link href="/quality" className="hover:text-[#D6BC83] transition-colors">Quality &amp; Certifications</Link></li>
              <li><Link href="/downloads" className="hover:text-[#D6BC83] transition-colors">Download Center</Link></li>
              <li><Link href="/gallery" className="hover:text-[#D6BC83] transition-colors">Visual Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-[#D6BC83] transition-colors">Blog & Articles</Link></li>
              <li><Link href="/contact" className="hover:text-[#D6BC83] transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          {/* Product Lines Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">All 11 Product Categories</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {productCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-[#D6BC83] transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b89858]" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Catalog & Updates</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Subscribe to receive our latest product catalog, new CAD specifications, and factory wholesale rates.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5">
              <input
                type="email"
                placeholder="Enter your business email"
                className="bg-[#161b1f] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b89858]"
              />
              <button
                type="submit"
                className="bg-[#b89858] hover:bg-[#9e8042] text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <span>Subscribe Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} AcePack Packaging Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
