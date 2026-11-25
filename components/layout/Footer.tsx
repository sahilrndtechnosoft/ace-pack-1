'use client';

import { withDefaults } from '@/lib/cms/merge';
import { footerDefaults } from '@/lib/cms/site-settings';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, PhoneCall, Mail, MapPin, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { productCategories } from '@/lib/data/products';
import { FooterDeliveryArt } from './FooterDeliveryArt';

export interface FooterProps {
  initialSettings?: any;
  initialCategories?: any[];
}

export const Footer: React.FC<FooterProps> = ({ initialSettings, initialCategories }) => {
  const [liveSettings, setLiveSettings] = useState(initialSettings || null);
  const categories = initialCategories && initialCategories.length > 0 ? initialCategories : productCategories;

  useEffect(() => {
    if (initialSettings) {
      setLiveSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    fetch('/api/content/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.settings?.footer_settings) {
          setLiveSettings(data.settings.footer_settings);
        }
      })
      .catch(() => {});
  }, []);

  const site = withDefaults(footerDefaults, liveSettings);
  const { phoneNumbers, domesticEmail, exportEmail } = site;

  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hide footer in admin dashboard or on immersive exhibitions 3D gallery
  if (pathname?.startsWith('/admin') || pathname === '/events' || pathname === '/exhibitions') {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid business email address.');
      return;
    }

    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      setEmail('');
    }, 600);
  };
  return (
    <footer className="relative z-30 isolate bg-[#FAF8F4] text-[var(--ace-ink)] pb-10 border-t border-[#E6DBC6] overflow-hidden">
      <FooterDeliveryArt />
      <div className="container-custom max-w-[1600px] pt-10 sm:pt-12">

        {/* Newsletter band */}
        <div className="mb-12 rounded-3xl border border-[#E6DBC6] bg-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 shadow-xs">
          <div className="lg:flex-1">
            <h4 className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider mb-2">{site.newsletterHeading}</h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">{site.newsletterText}</p>
          </div>

          <div className="lg:w-[460px] shrink-0">
            {subscribed ? (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4" role="status">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#1A1D20]">Subscribed successfully!</p>
                  <p className="text-[11px] text-gray-600">Our latest product catalog and technical datasheets will be delivered to your inbox.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubscribed(false)}
                  className="text-[11px] font-bold text-[#b99750] hover:underline cursor-pointer shrink-0"
                >
                  Add another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <label htmlFor="footer-newsletter-email" className="sr-only">Business email</label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email"
                    required
                    className="flex-1 min-w-0 bg-[#FAF8F4] border border-[#E6DBC6] rounded-full px-5 py-3 text-sm text-[var(--ace-ink)] placeholder-gray-400 focus:outline-none focus:border-[#b99750] focus:ring-2 focus:ring-[#b99750]/20"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="bg-[#b99750] hover:bg-[#a6843e] text-white text-sm font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70 shrink-0"
                  >
                    {subscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe Catalog</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <p className="flex items-center gap-1.5 text-[11px] text-red-700" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Brand + two link columns of equal weight (each list splits into two columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-12 pb-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#b99750]/40 shadow-xs inline-flex items-center group-hover:border-[#b99750] transition-colors">
                <img
                  src={site.logo}
                  alt="Ace Packaging"
                  width={400}
                  height={178}
                  loading="lazy"
                  decoding="async"
                  className="h-10 sm:h-12 w-auto max-w-[150px] sm:max-w-[180px] object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mb-6">{site.description}</p>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#b99750]/40 text-xs font-semibold text-[#8c6f2a] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#b99750] shrink-0" />
              <span>{site.badge}</span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider mb-5">{site.quickLinksHeading}</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] font-semibold text-gray-600">
              {site.quickLinks.map((item) => (
                <li key={`${item.label}-${item.link}`}><Link href={item.link} className="hover:text-[#b99750] transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider mb-5">
              All {categories.length} Product Collections
            </h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] font-semibold text-gray-600">
              {categories.map((cat) => (
                <li key={cat.id || cat.slug}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-[#b99750] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b99750] shrink-0" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact strip */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-4 py-8 border-t border-b border-[#E6DBC6] text-xs text-gray-700">
          <li className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#b99750] shrink-0 mt-0.5" />
            <span>Unit 1: {site.unit1Address}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#b99750] shrink-0 mt-0.5" />
            <span>Unit 2: {site.unit2Address}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#b99750] shrink-0 mt-0.5" />
            <span>{phoneNumbers}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-[#b99750] shrink-0 mt-0.5" />
            <span>
              Domestic: {domesticEmail}
              <br />
              Export: {exportEmail}
            </span>
          </li>
        </ul>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col xl:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center xl:text-left">
          <p>{site.copyrightText || `© ${new Date().getFullYear()} Ace Packaging Solutions. All rights reserved.`}</p>
          <p className="text-gray-500">
            Designed and Developed by{' '}
            <a
              href="https://rndtechnosoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#8c6f2a] hover:text-[#1A1D20] transition-colors underline decoration-[#cfa144]/60 underline-offset-2"
            >
              RnD Technosoft
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {site.socialLinks.filter((social) => social.label && /^https?:\/\//.test(social.link)).map((social) => (
              <a key={social.link} href={social.link} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ace-ink)] transition-colors">{social.label}</a>
            ))}
            <Link href="/privacy" className="hover:text-[var(--ace-ink)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--ace-ink)] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
