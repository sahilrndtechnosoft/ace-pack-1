'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  X,
  PhoneCall,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Search,
  Box,
  ShieldCheck,
  FileDown,
  UtensilsCrossed,
  Layers,
} from 'lucide-react';
import { productCategories, type ProductCategory } from '@/lib/data/products';
import { resourceLinks } from '@/lib/data/resources';
import { PackagingIllustration } from '@/components/products/PackagingIllustration';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export interface CategoryGroup {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  categorySlugs: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'all',
    label: 'All Lines',
    shortLabel: 'All',
    icon: '✨',
    categorySlugs: productCategories.map((c) => c.slug),
  },
  {
    id: 'meal-bento',
    label: 'Meal & Bento Boxes',
    shortLabel: 'Bento & Meals',
    icon: '🍱',
    categorySlugs: ['re-series', 'zen-series', 'meal-boxes', 'elite-containers'],
  },
  {
    id: 'round-deli',
    label: 'Round Bowls & Deli',
    shortLabel: 'Round Bowls',
    icon: '🥣',
    categorySlugs: ['ro-series', 'round-containers', 'deli-series'],
  },
  {
    id: 'cups-portion',
    label: 'Cups & Portion Containers',
    shortLabel: 'Cups & Dips',
    icon: '🥄',
    categorySlugs: ['hinge-cups', 'portion-cups', 'glass-series-80-dia', 'glass-series-90-dia'],
  },
  {
    id: 'sweets-special',
    label: 'Confectionery & Speciality',
    shortLabel: 'Sweets & Special',
    icon: '🍬',
    categorySlugs: ['sweet-box-containers', 'natraj-containers', 'flat-containers', 'tamper-evident', 'ice-cream-tubs', 'custom-iml'],
  },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Mega-menu and mobile drawer interactive states
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('re-series');
  const [desktopSegment, setDesktopSegment] = useState<string>('all');
  const [desktopSearch, setDesktopSearch] = useState<string>('');
  const [mobileSegment, setMobileSegment] = useState<string>('all');
  const [mobileSearch, setMobileSearch] = useState<string>('');
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const pathname = usePathname() ?? '/';

  // Which top-level section the current URL belongs to.
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
    `py-2.5 px-3 rounded-xl flex items-center justify-between font-bold text-sm transition-colors hover:bg-white hover:text-[var(--ace-orange)] ${
      isActive(href) ? 'bg-white text-[var(--ace-orange)] font-extrabold shadow-2xs' : 'text-[var(--ace-ink)]'
    }`;

  // Filtered categories for desktop mega menu
  const desktopFilteredCategories = useMemo(() => {
    let list = productCategories;
    if (desktopSegment !== 'all') {
      const grp = CATEGORY_GROUPS.find((g) => g.id === desktopSegment);
      if (grp) {
        list = list.filter((c) => grp.categorySlugs.includes(c.slug));
      }
    }
    if (desktopSearch.trim()) {
      const q = desktopSearch.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitleName.toLowerCase().includes(q) ||
          c.products.some((p) => p.name.toLowerCase().includes(q) || p.capacity.toLowerCase().includes(q))
      );
    }
    return list;
  }, [desktopSegment, desktopSearch]);

  // Ensure activeCategorySlug is valid when filters change
  const activeCategory: ProductCategory = useMemo(() => {
    const found = desktopFilteredCategories.find((c) => c.slug === activeCategorySlug);
    if (found) return found;
    return desktopFilteredCategories[0] || productCategories[0];
  }, [desktopFilteredCategories, activeCategorySlug]);

  // Filtered categories for mobile drawer
  const mobileFilteredCategories = useMemo(() => {
    let list = productCategories;
    if (mobileSegment !== 'all') {
      const grp = CATEGORY_GROUPS.find((g) => g.id === mobileSegment);
      if (grp) {
        list = list.filter((c) => grp.categorySlugs.includes(c.slug));
      }
    }
    if (mobileSearch.trim()) {
      const q = mobileSearch.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitleName.toLowerCase().includes(q) ||
          c.products.some((p) => p.name.toLowerCase().includes(q) || p.capacity.toLowerCase().includes(q))
      );
    }
    return list;
  }, [mobileSegment, mobileSearch]);

  useEffect(() => {
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[var(--ace-paper)] border-b border-[var(--ace-line)] text-[var(--ace-ink)] ${
        isScrolled ? 'shadow-md py-1.5' : 'py-2.5'
      }`}
    >
      <div className="container-custom max-w-[1600px] flex items-center justify-between gap-3">
        {/* Brand Logo - Official Ace Packaging Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3 group">
          <div className="flex items-center justify-center">
            <img
              src="/images/ACE_Pack_Logo-01.png"
              alt="Ace Packaging"
              width={320}
              height={165}
              decoding="async"
              className="h-12 sm:h-16 lg:h-18 w-auto max-w-[110px] sm:max-w-[160px] object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links (Enabled for lg: >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-4 text-[13px] font-semibold whitespace-nowrap text-[var(--ace-ink)] xl:gap-6">
          <Link href="/about" className={navLink('/about')} aria-current={isActive('/about') ? 'page' : undefined}>
            About Us
          </Link>

          {/* "Our Products" Interactive Master-Detail Mega Menu Trigger */}
          <div
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
            onFocus={() => setMegaMenuOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setMegaMenuOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setMegaMenuOpen(false);
                e.stopPropagation();
              }
            }}
          >
            <Link
              href="/categories"
              className={navLink(
                '/categories',
                `inline-flex items-center gap-1.5 ${megaMenuOpen ? 'text-[var(--ace-orange)]' : ''}`
              )}
              aria-current={isActive('/categories') ? 'page' : undefined}
            >
              <span>Our Products</span>
              <ChevronRight
                className={`w-3.5 h-3.5 rotate-90 transition-transform ${
                  megaMenuOpen ? 'text-[var(--ace-orange)] -scale-y-100' : 'opacity-60'
                }`}
              />
            </Link>

            {/* Premium Master-Detail Mega Menu */}
            <AnimatePresence>
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[96vw] max-w-[1240px] z-50 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/95 backdrop-blur-xl border border-[var(--ace-line)] rounded-[24px] shadow-[0_24px_70px_rgba(22,39,39,0.18)] overflow-hidden flex flex-col h-[540px] max-h-[calc(100vh-100px)] tracking-normal normal-case whitespace-normal origin-top"
                  >
                    {/* Mega-Menu Top Navigation Bar */}
                    <div className="px-5 py-3.5 border-b border-[var(--ace-line)] bg-[#FAF8F4]/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
                      {/* Segment Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        <span className="text-xs font-bold text-gray-500 mr-1 hidden sm:inline">Category:</span>
                        {CATEGORY_GROUPS.map((grp) => (
                          <button
                            key={grp.id}
                            type="button"
                            onClick={() => setDesktopSegment(grp.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                              desktopSegment === grp.id
                                ? 'bg-[var(--ace-orange)] text-white shadow-xs'
                                : 'bg-white text-gray-600 hover:text-[var(--ace-ink)] border border-[var(--ace-line)] hover:border-gray-300'
                            }`}
                          >
                            <span>{grp.icon}</span>
                            <span>{grp.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Right Header Utilities: Instant Search + Catalog Link */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-44 xl:w-56">
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={desktopSearch}
                            onChange={(e) => setDesktopSearch(e.target.value)}
                            placeholder="Search containers..."
                            className="w-full pl-8 pr-6 py-1.5 text-xs bg-white border border-[var(--ace-line)] rounded-full text-[var(--ace-ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--ace-orange)] transition-colors"
                          />
                          {desktopSearch && (
                            <button
                              type="button"
                              onClick={() => setDesktopSearch('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <Link
                          href="/products"
                          onClick={() => setMegaMenuOpen(false)}
                          className="text-xs font-bold text-gray-700 hover:text-[var(--ace-orange)] flex items-center gap-1 transition-colors shrink-0"
                        >
                          <span>Full Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
                        </Link>
                      </div>
                    </div>

                    {/* Master-Detail Split Workspace */}
                    <div className="flex-1 flex overflow-hidden min-h-0">
                      {/* Left Sidebar: Categories Navigation Rail */}
                      <div
                        className="w-72 xl:w-80 shrink-0 border-r border-[var(--ace-line)] bg-[#FAF8F4]/60 overflow-y-auto p-2.5 space-y-1"
                        data-lenis-prevent
                      >
                        {desktopFilteredCategories.length === 0 ? (
                          <div className="p-6 text-center text-xs text-gray-500">
                            No matching category found for &quot;{desktopSearch}&quot;
                          </div>
                        ) : (
                          desktopFilteredCategories.map((category, idx) => {
                            const isSelected = activeCategory.slug === category.slug;
                            return (
                              <button
                                key={category.id}
                                type="button"
                                onMouseEnter={() => setActiveCategorySlug(category.slug)}
                                onClick={() => setActiveCategorySlug(category.slug)}
                                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 group cursor-pointer ${
                                  isSelected
                                    ? 'bg-white text-[var(--ace-orange)] shadow-xs font-bold border border-[var(--ace-orange)]/40 ring-1 ring-[var(--ace-orange)]/20'
                                    : 'text-[var(--ace-ink)] hover:bg-white/80 hover:text-[var(--ace-orange)] border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                                      isSelected
                                        ? 'bg-[var(--ace-orange)] text-white border-transparent'
                                        : 'bg-white text-[#968152] border-[var(--ace-line)]'
                                    }`}
                                  >
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <PackagingIllustration
                                    slug={category.slug}
                                    className={`w-5 h-5 shrink-0 transition-colors ${
                                      isSelected ? 'text-[var(--ace-orange)]' : 'text-gray-500 group-hover:text-[var(--ace-orange)]'
                                    }`}
                                  />
                                  <span className="text-[12.5px] truncate leading-tight">{category.name}</span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] font-semibold text-gray-500 bg-black/5 px-1.5 py-0.5 rounded">
                                    {category.products.length}
                                  </span>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform ${
                                      isSelected ? 'text-[var(--ace-orange)] translate-x-0.5' : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                                  />
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Right Panel: Interactive Model Explorer */}
                      <div
                        className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between bg-white"
                        data-lenis-prevent
                      >
                        <div>
                          {/* Active Category Header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--ace-line)]">
                            <div>
                              <div className="flex items-center gap-2">
                                <PackagingIllustration slug={activeCategory.slug} className="w-5 h-5 text-[var(--ace-orange)]" />
                                <h3 className="text-base font-extrabold text-[var(--ace-ink)] leading-snug">
                                  {activeCategory.name}
                                </h3>
                                <span className="text-[11px] font-bold text-[#968152] bg-[#FAF8F4] px-2 py-0.5 rounded-full border border-[var(--ace-line)]">
                                  {activeCategory.products.length} Models
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-1">
                                {activeCategory.subtitleName} — 100% Prime Virgin PP 05 Food Grade Polymer
                              </p>
                            </div>

                            <Link
                              href={`/categories/${activeCategory.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ace-orange)] hover:underline shrink-0 bg-[#FAF8F4] px-3 py-1.5 rounded-lg border border-[var(--ace-line)] hover:border-[var(--ace-orange)] transition-colors"
                            >
                              <span>Explore All {activeCategory.products.length} Models</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* Model Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                            {activeCategory.products.map((product) => (
                              <Link
                                key={product.id}
                                href={`/categories/${activeCategory.slug}/${product.product_slug}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="group relative flex flex-col justify-between rounded-xl border border-[var(--ace-line)] bg-white p-2.5 hover:border-[var(--ace-orange)] hover:shadow-md transition-all text-left"
                              >
                                <div className="relative h-20 w-full flex items-center justify-center bg-[#FAF8F4]/70 rounded-lg p-1.5 mb-2 overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                  <span className="absolute top-1 right-1 bg-white/95 text-[#968152] text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border border-[var(--ace-line)] shadow-2xs">
                                    {product.capacity}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <h4 className="text-[12px] font-bold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] transition-colors truncate leading-tight">
                                    {product.name}
                                  </h4>
                                  {product.dimensions && (
                                    <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                      {product.dimensions.top} × {product.dimensions.height}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Category Quality Guarantee Strip */}
                        <div className="mt-4 pt-3 border-t border-[var(--ace-line)] flex items-center justify-between text-[11px] text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>US FDA 21 CFR 177.1520 Food Contact Safe · Deep Freeze (−20°C) to Microwave (+120°C)</span>
                          </div>
                          <Link
                            href="/downloads"
                            onClick={() => setMegaMenuOpen(false)}
                            className="font-bold text-[var(--ace-orange)] hover:underline flex items-center gap-1"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Export Brochure PDF</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="px-5 py-2.5 border-t border-[var(--ace-line)] bg-[#FAF8F4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[var(--ace-muted)] shrink-0">
                      <span className="font-semibold text-gray-700">
                        💡 All containers are manufactured from 100% Virgin PP 05 Food Grade Plastic with hermetic zero-leak seals.
                      </span>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/categories"
                          onClick={() => setMegaMenuOpen(false)}
                          className="font-bold text-gray-700 hover:text-[var(--ace-orange)] transition-colors"
                        >
                          View All 17 Categories
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          href="/contact"
                          onClick={() => setMegaMenuOpen(false)}
                          className="font-bold text-[var(--ace-orange)] hover:underline uppercase tracking-wider whitespace-nowrap"
                        >
                          Discuss Your Requirements →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/industries" className={navLink('/industries')} aria-current={isActive('/industries') ? 'page' : undefined}>
            Industries
          </Link>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setResourcesOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setResourcesOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setResourcesOpen((v) => !v)}
              aria-expanded={resourcesOpen}
              className={navLink('/resources', `inline-flex items-center gap-1 ${resourcesOpen ? 'text-[var(--ace-orange)]' : ''}`)}
            >
              <span>Resources</span>
              <ChevronRight
                className={`w-3.5 h-3.5 rotate-90 transition-transform ${
                  resourcesOpen ? 'text-[var(--ace-orange)] -scale-y-100' : 'opacity-60'
                }`}
              />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[300px] bg-white border border-[var(--ace-line)] rounded-2xl shadow-2xl p-2 normal-case tracking-normal max-h-[70vh] overflow-y-auto"
                    data-lenis-prevent
                  >
                    {resourceLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setResourcesOpen(false)}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`block rounded-xl px-4 py-2.5 transition-colors hover:bg-[var(--ace-paper)] ${
                          isActive(item.href) ? 'bg-[var(--ace-paper)]' : ''
                        }`}
                      >
                        <span className={`block text-[15px] font-bold ${isActive(item.href) ? 'text-[var(--ace-orange)]' : 'text-[var(--ace-ink)]'}`}>
                          {item.label}
                        </span>
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

        {/* Header Right Utilities */}
        <div className="flex items-center gap-3">
          <LanguageSelector />

          {/* Action Button (Desktop) */}
          <div className="hidden lg:flex shrink-0 items-center gap-3">
            <a
              href="tel:+919925015906"
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
              <span>+91 99250 15906</span>
            </a>

            <Link
              href="/contact"
              className="bg-[var(--ace-orange)] text-white hover:bg-[var(--ace-ink)] hover:text-[var(--ace-paper)] text-xs font-bold px-4 py-2.5 rounded-full shadow-xs hover:shadow transition-all uppercase tracking-wider"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Hamburger Button (Mobile & Tablet: < 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-[var(--ace-line)] bg-white text-[var(--ace-ink)] hover:bg-[var(--ace-paper)] transition-colors"
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
                  <X className="w-5 h-5" />
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
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer (< 1024px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.22 } }}
            className="lg:hidden overflow-hidden bg-[var(--ace-paper)] border-b border-[var(--ace-line)] text-[var(--ace-ink)]"
          >
            <div className="px-4 py-5 sm:px-6 space-y-4 max-h-[calc(100dvh-80px)] overflow-y-auto" data-lenis-prevent>
              <nav className="flex flex-col gap-2">
                {/* Interactive Product Lines Accordion in Mobile */}
                <div className="rounded-2xl border border-[var(--ace-line)] bg-white p-3 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    className="w-full flex items-center justify-between font-extrabold text-sm uppercase tracking-wide text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors py-1"
                    aria-expanded={mobileProductsOpen}
                  >
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-[var(--ace-orange)]" />
                      <span>Product Lines ({productCategories.length})</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--ace-orange)] transition-transform duration-300 ${
                        mobileProductsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileProductsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                        className="overflow-hidden pt-3 border-t border-[var(--ace-line)] mt-2"
                      >
                        {/* Instant Search Bar */}
                        <div className="relative mb-2.5">
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={mobileSearch}
                            onChange={(e) => setMobileSearch(e.target.value)}
                            placeholder="Search 89 containers (e.g. 500ml, bento)..."
                            className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF8F4] border border-[var(--ace-line)] rounded-xl text-[var(--ace-ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--ace-orange)]"
                          />
                        </div>

                        {/* Segment Filter Pills */}
                        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar text-[11px] font-bold">
                          {CATEGORY_GROUPS.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setMobileSegment(g.id)}
                              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
                                mobileSegment === g.id
                                  ? 'bg-[var(--ace-orange)] text-white shadow-2xs'
                                  : 'bg-[#FAF8F4] text-gray-600 hover:text-[var(--ace-ink)] border border-[var(--ace-line)]'
                              }`}
                            >
                              <span>{g.icon} {g.shortLabel}</span>
                            </button>
                          ))}
                        </div>

                        {/* Category List with Sub-Model Expanders */}
                        <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1" data-lenis-prevent>
                          {mobileFilteredCategories.map((category, index) => {
                            const isExpanded = mobileExpandedCat === category.slug;
                            return (
                              <div
                                key={category.id}
                                className="rounded-xl border border-[var(--ace-line)] bg-[#FAF8F4]/60 overflow-hidden"
                              >
                                <div className="flex items-center justify-between p-2 hover:bg-white transition-colors">
                                  <Link
                                    href={`/categories/${category.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 min-w-0 flex-1"
                                  >
                                    <span className="text-[10px] font-bold text-[#968152] bg-white px-1.5 py-0.5 rounded border border-[var(--ace-line)] shrink-0">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <PackagingIllustration slug={category.slug} className="w-5 h-5 shrink-0 text-[var(--ace-orange)]" />
                                    <span className="text-xs font-bold text-[var(--ace-ink)] truncate">
                                      {category.name}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-semibold bg-white px-1.5 py-0.2 rounded border border-[var(--ace-line)] shrink-0">
                                      {category.products.length}
                                    </span>
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => setMobileExpandedCat(isExpanded ? null : category.slug)}
                                    className="p-1.5 text-gray-500 hover:text-[var(--ace-orange)]"
                                    aria-label="Toggle models"
                                  >
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180 text-[var(--ace-orange)]' : ''
                                      }`}
                                    />
                                  </button>
                                </div>

                                {/* Expanded Models Grid inside Category */}
                                {isExpanded && (
                                  <div className="p-2 pt-1 border-t border-[var(--ace-line)] bg-white space-y-1.5">
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {category.products.map((prod) => (
                                        <Link
                                          key={prod.id}
                                          href={`/categories/${category.slug}/${prod.product_slug}`}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="p-1.5 rounded-lg bg-[#FAF8F4] hover:bg-[var(--ace-orange)]/10 text-left flex items-center gap-1.5 transition-colors border border-[var(--ace-line)]"
                                        >
                                          <img src={prod.image} alt="" className="w-6 h-6 object-contain shrink-0" />
                                          <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold text-[var(--ace-ink)] truncate leading-tight">{prod.name}</p>
                                            <p className="text-[9px] text-[#968152] font-semibold">{prod.capacity}</p>
                                          </div>
                                        </Link>
                                      ))}
                                    </div>
                                    <Link
                                      href={`/categories/${category.slug}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block text-center text-[11px] font-bold text-[var(--ace-orange)] hover:underline pt-1"
                                    >
                                      View All {category.name} ({category.products.length} models) →
                                    </Link>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Quick Footers inside Products Drawer */}
                        <div className="pt-2.5 mt-2 border-t border-[var(--ace-line)] flex items-center justify-between text-xs">
                          <Link
                            href="/categories"
                            onClick={() => setMobileMenuOpen(false)}
                            className="font-bold text-[var(--ace-ink)] hover:text-[var(--ace-orange)]"
                          >
                            All 17 Categories →
                          </Link>
                          <Link
                            href="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="font-extrabold text-[var(--ace-orange)] hover:underline flex items-center gap-1"
                          >
                            <span>Full 89-Model Catalog</span>
                            <ArrowRight className="w-3 h-3" />
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
                  <span>All Products Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/about')}
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  <span>About Us</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  href="/industries"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/industries')}
                  aria-current={isActive('/industries') ? 'page' : undefined}
                >
                  <span>Industries</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/blog')}
                  aria-current={isActive('/blog') ? 'page' : undefined}
                >
                  <span>Blogs & Insights</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/contact')}
                  aria-current={isActive('/contact') ? 'page' : undefined}
                >
                  <span>Contact Us</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </nav>

              {/* Resources Strip in Mobile */}
              <div className="pt-3 border-t border-[var(--ace-line)]">
                <span className="block text-xs font-extrabold uppercase tracking-widest text-[var(--ace-orange)] mb-2 px-1">
                  Resources & Downloads
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[var(--ace-ink)]">
                  {resourceLinks.slice(0, 6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2 rounded-xl bg-white border border-[var(--ace-line)] transition-colors hover:text-[var(--ace-orange)] flex flex-col justify-between ${
                        isActive(item.href) ? 'text-[var(--ace-orange)] border-[var(--ace-orange)]/60' : ''
                      }`}
                    >
                      <span className="font-bold truncate">{item.label}</span>
                      <span className="text-[10px] text-gray-500 font-normal truncate">{item.hint}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct Call & CTA */}
              <div className="pt-3 border-t border-[var(--ace-line)] flex flex-col gap-2.5">
                <a
                  href="tel:+919925015906"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white border border-[var(--ace-line)] font-bold text-xs text-[var(--ace-ink)] hover:text-[var(--ace-orange)]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
                  <span>Call +91 99250 15906</span>
                </a>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[var(--ace-orange)] hover:bg-[var(--ace-ink)] hover:text-[var(--ace-paper)] text-white text-xs font-bold py-3 rounded-full text-center uppercase tracking-wider shadow-xs"
                >
                  Request Bulk Quotation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
