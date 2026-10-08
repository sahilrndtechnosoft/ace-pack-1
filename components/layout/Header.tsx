'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, PhoneCall, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { productCategories } from '@/lib/data/products';

import { resourceLinks } from '@/lib/data/resources';
import { PackagingIllustration } from '@/components/products/PackagingIllustration';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const pathname = usePathname() ?? '/';

  // Which top-level section the current URL belongs to. "Our Products" owns
  // both the category index and the product catalogue/detail routes, so the
  // nav keeps a single lit item while someone browses the range.
  const isActive = (href: string) => {
    const roots =
      href === '/categories' ? ['/categories', '/products']
      : href === '/resources' ? resourceLinks.map((l) => l.href)
      : [href];
    return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
  };
  const navLink = (href: string, extra = '') =>
    `relative py-3 transition-colors hover:text-[var(--ace-orange)] after:absolute after:left-0 after:right-0 after:bottom-1 after:h-[2px] after:rounded-full after:bg-[var(--ace-orange)] after:origin-left after:transition-transform after:duration-300 ${
      isActive(href) ? 'text-[var(--ace-orange)] after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    } ${extra}`;
  const mobileLink = (href: string) =>
    `py-2 flex items-center gap-3 transition-colors hover:text-[var(--ace-orange)] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:transition-colors ${
      isActive(href) ? 'text-[var(--ace-orange)] before:bg-[var(--ace-orange)]' : 'before:bg-transparent'
    }`;

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
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[var(--ace-paper)] border-b border-[var(--ace-line)] text-[var(--ace-ink)] ${isScrolled ? 'shadow-md py-1.5' : 'py-2.5'
        }`}
    >
      <div className="container-custom max-w-[1600px] flex items-center justify-between gap-3">

        {/* Brand Logo - Official Ace Packaging Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3 group">
          <div className="flex items-center justify-center">
            <img
              src="/images/ace-logo.webp"
              alt="Ace Packaging"
              width={320}
              height={165}
              decoding="async"
              className="h-14 sm:h-20 w-auto max-w-[110px] sm:max-w-[160px] object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-4 text-[13px] font-semibold whitespace-nowrap text-[var(--ace-ink)] 2xl:gap-6">
          <Link href="/about" className={navLink('/about')} aria-current={isActive('/about') ? 'page' : undefined}>
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
            onFocus={() => setMegaMenuOpen(true)}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setMegaMenuOpen(false); }}
            onKeyDown={e => { if (e.key === 'Escape') { setMegaMenuOpen(false); e.stopPropagation(); } }}
          >
            <Link
              href="/categories"
              className={navLink('/categories', `inline-flex items-center gap-1 ${megaMenuOpen ? 'text-[var(--ace-orange)]' : ''}`)}
              aria-current={isActive('/categories') ? 'page' : undefined}
            >
              <span>Our Products</span>
              <ChevronRight className={`w-3.5 h-3.5 rotate-90 transition-transform ${megaMenuOpen ? 'text-[var(--ace-orange)] -scale-y-100' : 'opacity-60'}`} />
            </Link>

            {/* Brand Theme (var(--ace-orange)) Category-Wise Product Variant Mega Menu.
                Positioning (centering) lives on this plain, non-animated
                wrapper — NOT on the motion.div below. Framer Motion writes
                its own inline `transform` for the opacity/y/scale animation,
                which would silently overwrite a class-based `-translate-x-1/2`
                on the same element (inline style always wins over a utility
                class), so the two responsibilities have to be split. */}
            <AnimatePresence>
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[94vw] max-w-[1120px] z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[var(--ace-paper)] border border-[var(--ace-line)] rounded-[28px] shadow-[0_24px_70px_rgba(22,39,39,0.16)] p-4 sm:p-6 tracking-normal normal-case whitespace-normal origin-top max-h-[calc(100dvh-130px)] overflow-y-auto" data-lenis-prevent>

                    {/* Header Title Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--ace-line)]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--ace-orange)]" />
                        <span className="text-sm font-bold text-[var(--ace-ink)]">
                          Browse product lines
                        </span>
                      </div>
                      <Link
                        href="/products"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs font-bold text-gray-700 hover:text-[var(--ace-orange)] flex items-center gap-1 transition-colors"
                      >
                        <span>View All Products Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
                      </Link>
                    </div>

                    {/* Multi-Column Category-Wise Variant Grid styled with Ace Packaging Brand Gold Theme (var(--ace-orange)) */}
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                      {productCategories.map((category) => (
                        <div key={category.id} className="min-w-0 rounded-2xl border border-[var(--ace-line)] bg-white p-3 sm:p-3.5">

                          {/* Category Heading in Brand Gold (var(--ace-orange)) */}
                          <Link
                            href={`/categories/${category.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="group flex min-h-10 items-center gap-2 border-b border-[var(--ace-line)] pb-2 hover:text-[var(--ace-orange)] transition-colors"
                          >
                            <PackagingIllustration slug={category.slug} className="w-8 h-8 shrink-0 text-[var(--ace-orange)]" />
                            <h3 className="text-[13px] font-bold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] transition-colors leading-snug normal-case">
                              {category.name}
                            </h3>
                          </Link>

                          {/* Variant List with Brand Gold Chevrons (›) */}
                          <div className="pt-1.5">
                            {category.products.map((product) => (
                              <Link
                                key={product.id}
                                href={`/categories/${category.slug}/${product.product_slug}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="flex min-h-9 items-center gap-2 rounded-lg px-1 text-[13px] font-medium normal-case text-[var(--ace-ink)] hover:bg-[var(--ace-paper)] hover:text-[var(--ace-orange)] transition-colors group"
                              >
                                <PackagingIllustration slug={category.slug} productId={product.id} className="w-6 h-6 shrink-0 text-[var(--ace-orange)]" />
                                <span className="leading-snug">{product.name}</span>
                              </Link>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Bottom Footer Bar inside Mega Menu */}
                    <div className="mt-4 pt-4 border-t border-[var(--ace-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 rounded-b-[28px] text-xs text-[var(--ace-muted)]">
                      <span className="font-semibold text-gray-700">
                        💡 All containers are manufactured from 100% Virgin PP 05 Food Grade Plastic.
                      </span>
                      <Link
                        href="/contact"
                        onClick={() => setMegaMenuOpen(false)}
                        className="font-bold text-[var(--ace-orange)] hover:underline uppercase tracking-wider whitespace-nowrap"
                      >
                        Discuss Your Requirements →
                      </Link>
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* <Link href="/capabilities" className={navLink('/capabilities')} aria-current={isActive('/capabilities') ? 'page' : undefined}>
            Capabilities
          </Link> */}

          <Link href="/industries" className={navLink('/industries')} aria-current={isActive('/industries') ? 'page' : undefined}>
            Industries
          </Link>

          <div
            className="relative"
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setResourcesOpen(false); }}
            onKeyDown={e => { if (e.key === 'Escape') setResourcesOpen(false); }}
          >
            <button
              type="button"
              onClick={() => setResourcesOpen((v) => !v)}
              aria-expanded={resourcesOpen}
              className={navLink('/resources', `inline-flex items-center gap-1 ${resourcesOpen ? 'text-[var(--ace-orange)]' : ''}`)}
            >
              <span>Resources</span>
              <ChevronRight className={`w-3.5 h-3.5 rotate-90 transition-transform ${resourcesOpen ? 'text-[var(--ace-orange)] -scale-y-100' : 'opacity-60'}`} />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[300px] bg-white border border-[var(--ace-line)] rounded-2xl shadow-2xl p-2 normal-case tracking-normal max-h-[70vh] overflow-y-auto" data-lenis-prevent
                  >
                    {resourceLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setResourcesOpen(false)}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`block rounded-xl px-4 py-2.5 transition-colors hover:bg-[var(--ace-paper)] ${isActive(item.href) ? 'bg-[var(--ace-paper)]' : ''}`}
                      >
                        <span className={`block text-[15px] font-bold ${isActive(item.href) ? 'text-[var(--ace-orange)]' : 'text-[var(--ace-ink)]'}`}>{item.label}</span>
                        <span className="block text-xs font-medium text-gray-500">{item.hint}</span>
                      </Link>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>



          <Link href="/blog" className={navLink('/blog')} aria-current={isActive('/blog') ? 'page' : undefined}>
            Blogs
          </Link>

        </nav>

        <LanguageSelector />

        {/* Action Button */}
        <div className="hidden lg:flex shrink-0 items-center gap-4">
          <a
            href="tel:+919925015906"
            className="hidden 2xl:flex items-center gap-2 text-xs font-bold text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
            <span>+91 99250 15906</span>
          </a>

          <Link
            href="/contact"
            className="bg-[var(--ace-orange)] text-white hover:bg-[var(--ace-ink)] hover:text-[var(--ace-paper)] text-xs font-bold px-5 py-3 rounded-full shadow-sm hover:shadow transition-all uppercase tracking-wider"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden relative w-11 h-11 shrink-0 flex items-center justify-center rounded-full border border-[var(--ace-line)] bg-white text-[var(--ace-ink)] hover:bg-[var(--ace-aqua-soft)] transition-colors"
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
            className="xl:hidden overflow-hidden bg-[var(--ace-paper)] border-b border-[var(--ace-line)] text-[var(--ace-ink)]"
          >
            <div className="px-6 py-6 space-y-4 max-h-[calc(100dvh-100px)] overflow-y-auto" data-lenis-prevent>
              <nav className="flex flex-col gap-3 text-sm font-bold uppercase text-[var(--ace-ink)]">
                {/* <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/')}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Home
                </Link> */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    className={`w-full py-2 flex items-center gap-3 uppercase transition-colors hover:text-[var(--ace-orange)] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full ${
                      isActive('/categories') ? 'text-[var(--ace-orange)] before:bg-[var(--ace-orange)]' : 'before:bg-transparent'
                    }`}
                    aria-expanded={mobileProductsOpen}
                  >
                    <span className="flex-1 text-left">Products</span>
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
                        <div className="pl-3 py-1 flex flex-col gap-1 border-l-2 border-[var(--ace-line)] normal-case font-semibold text-xs text-gray-700">
                          {productCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="py-1.5 min-h-11 flex items-center gap-1.5 hover:text-[var(--ace-orange)]"
                            >
                              <PackagingIllustration slug={category.slug} className="w-9 h-9 shrink-0 text-[var(--ace-orange)]" />
                              {category.name}
                            </Link>
                          ))}
                          <Link
                            href="/categories"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 mt-1 font-extrabold text-[var(--ace-orange)] hover:underline"
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
                  className={mobileLink('/products')}
                  aria-current={isActive('/products') ? 'page' : undefined}
                >
                  All Products Catalog
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/about')}
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  About Us
                </Link>
                <Link
                  href="/industries"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/industries')}
                  aria-current={isActive('/industries') ? 'page' : undefined}
                >
                  Industries
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/blog')}
                  aria-current={isActive('/blog') ? 'page' : undefined}
                >
                  Blogs & Insights
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/contact')}
                  aria-current={isActive('/contact') ? 'page' : undefined}
                >
                  Contact Us
                </Link>
              </nav>

              <div className="pt-4 border-t border-[var(--ace-line)]">
                <span className="block text-[15px] font-bold uppercase tracking-[0.16em] text-[var(--ace-orange)] mb-2">Resources</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[15px] font-semibold text-[var(--ace-ink)]">
                  {resourceLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`py-1.5 min-h-11 flex items-center transition-colors hover:text-[var(--ace-orange)] ${isActive(item.href) ? 'text-[var(--ace-orange)]' : ''}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--ace-line)] flex flex-col gap-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[var(--ace-orange)] hover:bg-[var(--ace-ink)] hover:text-[var(--ace-paper)] text-white text-xs font-bold py-3 rounded-full text-center uppercase tracking-wider"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
