'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, PhoneCall, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  useEffect(() => {
    // Passive + rAF-coalesced: a non-passive scroll handler blocks the
    // compositor on every wheel event, and this one only ever needs to answer
    // one question ("past 20px?") once per frame.
    let queued = false;
    const handleScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        setIsScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[#f3f3f3] border-b border-[#E6DBC6] text-[#1A1D20] ${isScrolled ? 'shadow-md py-1.5' : 'py-2.5'
        }`}
    >
      <div className="container-custom flex items-center justify-between">

        {/* Brand Logo - Official AcePack Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center">
            <img
              src="/images/ace-logo.webp"
              alt="AcePack Container Solutions"
              width={320}
              height={165}
              decoding="async"
              className="h-10 sm:h-16 w-auto max-w-[78px] sm:max-w-[124px] object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#1A1D20]">
          <Link href="/about" className="hover:text-[#b89858] transition-colors">
            About Us
          </Link>

          {/* "Our Products" Mega Menu Trigger — intentionally not `relative`
              so the dropdown below anchors to the full-width <header> (which
              is `sticky`, i.e. a positioning context) instead of this small
              trigger, keeping it centered in the viewport at any breakpoint
              regardless of where this link happens to sit in the nav. */}
          <div
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <Link
              href="/categories"
              className={`hover:text-[#b89858] transition-colors inline-flex items-center gap-1 py-3 ${megaMenuOpen ? 'text-[#b89858]' : ''
                }`}
            >
              <span>Our Products</span>
              <ChevronRight className={`w-3.5 h-3.5 rotate-90 transition-transform ${megaMenuOpen ? 'text-[#b89858]' : 'opacity-60'}`} />
            </Link>

            {/* Brand Theme (#b89858) Category-Wise Product Variant Mega Menu.
                Positioning (centering) lives on this plain, non-animated
                wrapper — NOT on the motion.div below. Framer Motion writes
                its own inline `transform` for the opacity/y/scale animation,
                which would silently overwrite a class-based `-translate-x-1/2`
                on the same element (inline style always wins over a utility
                class), so the two responsibilities have to be split. */}
            <AnimatePresence>
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-[960px] z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white border-2 border-[#b89858]/80 rounded-3xl shadow-2xl p-5 sm:p-8 tracking-normal uppercase-none origin-top">

                    {/* Header Title Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E6DBC6]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#b89858]" />
                        <span className="text-xs font-extrabold text-[#b89858] uppercase tracking-wider">
                          Product Categories & Model Variants
                        </span>
                      </div>
                      <Link
                        href="/products"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs font-bold text-gray-700 hover:text-[#b89858] flex items-center gap-1 transition-colors"
                      >
                        <span>View All Products Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#b89858]" />
                      </Link>
                    </div>

                    {/* Multi-Column Category-Wise Variant Grid styled with AcePack Brand Gold Theme (#b89858) */}
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-6 sm:gap-y-8 max-h-[60vh] xl:max-h-[460px] overflow-y-auto pr-2">
                      {productCategories.map((category) => (
                        <div key={category.id} className="flex flex-col">

                          {/* Category Heading in Brand Gold (#b89858) */}
                          <Link
                            href={`/categories/${category.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="group inline-block pb-2 mb-3 border-b-2 border-[#b89858]/40 hover:border-[#b89858] transition-colors"
                          >
                            <h3 className="text-sm font-extrabold text-[#b89858] group-hover:text-[#9e8042] transition-colors leading-tight">
                              {category.name}
                            </h3>
                          </Link>

                          {/* Variant List with Brand Gold Chevrons (›) */}
                          <div className="space-y-2">
                            {category.products.map((product) => (
                              <Link
                                key={product.id}
                                href={`/categories/${category.slug}/${product.product_slug}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-[#b89858] transition-colors group"
                              >
                                <span className="text-[#b89858] font-bold text-sm leading-none group-hover:translate-x-0.5 transition-transform">
                                  ›
                                </span>
                                <span className="leading-snug">{product.name}</span>
                              </Link>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Bottom Footer Bar inside Mega Menu */}
                    <div className="mt-6 pt-4 border-t border-[#E6DBC6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF8F4] -mx-5 sm:-mx-8 -mb-5 sm:-mb-8 p-4 rounded-b-3xl text-xs text-gray-600">
                      <span className="font-semibold text-gray-700">
                        💡 All containers are manufactured from 100% Virgin PP 05 Food Grade Plastic.
                      </span>
                      <Link
                        href="/contact"
                        onClick={() => setMegaMenuOpen(false)}
                        className="font-bold text-[#b89858] hover:underline uppercase tracking-wider whitespace-nowrap"
                      >
                        Request Bulk Factory Quote →
                      </Link>
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* <Link href="/capabilities" className="hover:text-[#b89858] transition-colors">
            Capabilities
          </Link> */}

          <Link href="/industries" className="hover:text-[#b89858] transition-colors">
            Industries
          </Link>

          <Link href="/gallery" className="hover:text-[#b89858] transition-colors">
            Gallery
          </Link>

          <Link href="/blog" className="hover:text-[#b89858] transition-colors">
            Blogs
          </Link>

          <Link href="/contact" className="hover:text-[#b89858] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="tel:+919820000000"
            className="flex items-center gap-2 text-xs font-bold text-[#1A1D20] hover:text-[#b89858] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#b89858]" />
            <span>+91 98200 00000</span>
          </a>

          <Link
            href="/contact"
            className="bg-[#b89858] hover:bg-[#9e8042] text-white text-xs font-bold px-5 py-3 rounded-full shadow-sm hover:shadow transition-all uppercase tracking-wider"
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#E6DBC6]/50 text-[#1A1D20] hover:bg-[#E6DBC6] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <AnimatePresence initial={false} mode="wait">
            {mobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu className="w-6 h-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }}
            className="lg:hidden overflow-hidden bg-[#f3f3f3] border-b border-[#E6DBC6] text-[#1A1D20]"
          >
            <div className="px-6 py-6 space-y-4">
              <nav className="flex flex-col gap-3 text-sm font-bold uppercase text-[#1A1D20]">
                {/* <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Home
                </Link> */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    className="w-full py-2 flex items-center justify-between hover:text-[#b89858]"
                    aria-expanded={mobileProductsOpen}
                  >
                    <span>Products</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${mobileProductsOpen ? 'rotate-90' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileProductsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                        className="overflow-hidden"
                      >
                        <div className="pl-3 py-1 flex flex-col gap-1 border-l-2 border-[#E6DBC6] normal-case font-semibold text-xs text-gray-700">
                          {productCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="py-1.5 flex items-center gap-1.5 hover:text-[#b89858]"
                            >
                              <span className="text-[#b89858]">›</span>
                              {category.name}
                            </Link>
                          ))}
                          <Link
                            href="/categories"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 mt-1 font-extrabold text-[#b89858] hover:underline"
                          >
                            View All Categories →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  All Products Catalog
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  About Us
                </Link>
                <Link
                  href="/capabilities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Capabilities
                </Link>
                <Link
                  href="/industries"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Industries
                </Link>
                <Link
                  href="/quality"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Quality &amp; Certifications
                </Link>
                <Link
                  href="/downloads"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Downloads
                </Link>
                <Link
                  href="/gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Gallery
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Blogs & Insights
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-[#b89858]"
                >
                  Contact Us
                </Link>
              </nav>

              <div className="pt-4 border-t border-[#E6DBC6] flex flex-col gap-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#b89858] hover:bg-[#9e8042] text-white text-xs font-bold py-3 rounded-full text-center uppercase tracking-wider"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
