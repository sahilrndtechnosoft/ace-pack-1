'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    icon: '',
    categorySlugs: productCategories.map((c) => c.slug),
  },
  {
    id: 'meal-bento',
    label: 'Meal & Bento Boxes',
    shortLabel: 'Bento & Meals',
    icon: '',
    categorySlugs: ['re-series', 'zen-series', 'meal-boxes', 'elite-containers'],
  },
  {
    id: 'round-deli',
    label: 'Round Bowls & Deli',
    shortLabel: 'Round Bowls',
    icon: '',
    categorySlugs: ['ro-series', 'round-containers', 'deli-series'],
  },
  {
    id: 'cups-portion',
    label: 'Cups & Portions',
    shortLabel: 'Cups & Dips',
    icon: '',
    categorySlugs: ['hinge-cups', 'portion-cups', 'glass-series-80-dia', 'glass-series-90-dia'],
  },
  {
    id: 'sweets-special',
    label: 'Sweets & Specialty',
    shortLabel: 'Sweets & Special',
    icon: '',
    categorySlugs: ['sweet-box-containers', 'natraj-containers', 'flat-containers', 'tamper-evident', 'ice-cream-tubs', 'custom-iml'],
  },
];

const FEATURED_MOBILE_CATEGORIES = [
  {
    slug: 're-series',
    shortTitle: 'Bento & Compartment',
    sub: 'RE Series',
    image: '/images/products/re-series/re-series-hero.webp',
    modelCount: 13,
  },
  {
    slug: 'ro-series',
    shortTitle: 'Round Bowls & Biryani',
    sub: 'RO Series',
    image: '/images/products/ro-series/ro-series-hero.webp',
    modelCount: 11,
  },
  {
    slug: 'zen-series',
    shortTitle: 'Square Meal Boxes',
    sub: 'ZEN Series',
    image: '/images/products/zen/zen-series-hero.webp',
    modelCount: 4,
  },
  {
    slug: 'hinge-cups',
    shortTitle: 'Sauce & Hinge Cups',
    sub: 'Attached Lids',
    image: '/images/products/hinge/hinge-cups-hero.webp',
    modelCount: 4,
  },
  {
    slug: 'deli-series',
    shortTitle: 'Clear Deli Tubs',
    sub: 'Deli Series',
    image: '/images/products/deli/deli-series-hero.webp',
    modelCount: 7,
  },
  {
    slug: 'sweet-box-containers',
    shortTitle: 'Sweet & Gift Boxes',
    sub: 'Mithai Boxes',
    image: '/images/products/sweet-box/sweet-box-hero.webp',
    modelCount: 3,
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
  const [mobileSearch, setMobileSearch] = useState<string>('');
  const [mobileShowAllCats, setMobileShowAllCats] = useState<boolean>(false);
  const megaMenuContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Publish the live header height so sticky/pinned sections sit flush under it
  // (it varies by breakpoint and shrinks once the page scrolls).
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty('--site-header', `${el.offsetHeight}px`));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close desktop mega menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (megaMenuContainerRef.current && !megaMenuContainerRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    if (megaMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [megaMenuOpen]);

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
    `relative py-3 transition-colors hover:text-[var(--ace-orange)] after:absolute after:left-0 after:right-0 after:bottom-1 after:h-[2px] after:rounded-full after:bg-[var(--ace-orange)] after:origin-left after:transition-transform after:duration-300 ${isActive(href) ? 'text-[var(--ace-orange)] after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    } ${extra}`;

  const mobileLink = (href: string) =>
    `py-2.5 px-3 rounded-xl flex items-center justify-between font-bold text-sm transition-colors hover:bg-white hover:text-[var(--ace-orange)] ${isActive(href) ? 'bg-white text-[var(--ace-orange)] font-extrabold shadow-2xs' : 'text-[var(--ace-ink)]'
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

  // Sorted categories for the mobile drawer full A-Z directory
  const sortedAllCategories = useMemo(() => {
    return [...productCategories].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Instant smart search results for mobile menu
  const mobileSearchResults = useMemo(() => {
    const q = mobileSearch.trim().toLowerCase();
    if (!q) return [];

    const results: {
      type: 'category' | 'product';
      title: string;
      subtitle: string;
      href: string;
      image?: string;
    }[] = [];

    // Match categories first
    for (const cat of productCategories) {
      if (
        cat.name.toLowerCase().includes(q) ||
        cat.subtitleName.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'category',
          title: cat.name,
          subtitle: `${cat.products.length} models • Series`,
          href: `/categories/${cat.slug}`,
          image: cat.heroImage,
        });
      }
    }

    // Match individual products
    for (const cat of productCategories) {
      for (const prod of cat.products) {
        if (
          prod.name.toLowerCase().includes(q) ||
          prod.capacity.toLowerCase().includes(q) ||
          prod.material.toLowerCase().includes(q) ||
          prod.product_slug.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'product',
            title: prod.name,
            subtitle: `${prod.capacity} • ${cat.name}`,
            href: `/categories/${cat.slug}/${prod.product_slug}`,
            image: prod.image,
          });
        }
        if (results.length >= 8) break;
      }
      if (results.length >= 8) break;
    }

    return results.slice(0, 6);
  }, [mobileSearch]);

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
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[var(--ace-paper)] border-b border-[var(--ace-line)] text-[var(--ace-ink)] ${isScrolled ? 'shadow-md py-1.5' : 'py-2.5'
        }`}
    >
      <div className="container-custom max-w-[1600px] flex items-center justify-between gap-3">
        {/* Brand Logo - Official Ace Packaging Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3 group">
          <div className="flex items-center justify-center">
            <img
              src="/images/Ace_New_Update_Logo-01.png"
              alt="Ace Packaging"
              width={340}
              height={152}
              decoding="async"
              className="h-11 sm:h-14 lg:h-16 w-auto max-w-[130px] sm:max-w-[170px] lg:max-w-[190px] object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links (Enabled for lg: >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-5 text-[15px] font-semibold whitespace-nowrap text-[var(--ace-ink)] xl:gap-7">
          <Link href="/about" className={navLink('/about')} aria-current={isActive('/about') ? 'page' : undefined}>
            About Us
          </Link>

          {/* "Our Products" Interactive Master-Detail Mega Menu Trigger */}
          <div
            ref={megaMenuContainerRef}
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
            <button
              type="button"
              onClick={() => setMegaMenuOpen((v) => !v)}
              className={navLink(
                '/categories',
                `inline-flex items-center gap-1.5 cursor-pointer ${megaMenuOpen ? 'text-[var(--ace-orange)]' : ''}`
              )}
              aria-expanded={megaMenuOpen}
              aria-haspopup="true"
              aria-label="Our Products Menu"
              aria-current={isActive('/categories') ? 'page' : undefined}
            >
              <span>Our Products</span>
              <ChevronRight
                className={`w-3.5 h-3.5 rotate-90 transition-transform duration-200 ${megaMenuOpen ? 'text-[var(--ace-orange)] -scale-y-100' : 'opacity-60'
                  }`}
              />
            </button>

            {/* Premium Master-Detail Mega Menu */}
            <AnimatePresence>
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[95vw] max-w-[1160px] z-50 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/98 backdrop-blur-xl border border-[var(--ace-line)] rounded-2xl shadow-[0_24px_70px_rgba(20,23,26,0.14)] overflow-hidden flex flex-col tracking-normal normal-case whitespace-normal origin-top"
                  >
                    {/* Mega-Menu Top Navigation Bar */}
                    <div className="px-6 py-3.5 border-b border-[var(--ace-line)] bg-[#FAF8F4] flex items-center justify-between gap-4 shrink-0">
                      {/* Segment Filter Tabs */}
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                        {CATEGORY_GROUPS.map((grp) => (
                          <button
                            key={grp.id}
                            type="button"
                            onClick={() => setDesktopSegment(grp.id)}
                            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all shrink-0 cursor-pointer ${desktopSegment === grp.id
                                ? 'bg-[var(--ace-orange)] text-white shadow-xs'
                                : 'bg-white/90 text-gray-700 hover:text-[var(--ace-ink)] border border-[var(--ace-line)] hover:border-gray-300'
                              }`}
                          >
                            <span>{grp.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Right Header Utilities: Instant Search + Catalog Link */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="relative w-48 xl:w-56">
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={desktopSearch}
                            onChange={(e) => setDesktopSearch(e.target.value)}
                            placeholder="Search container lines..."
                            className="w-full pl-8 pr-6 py-1.5 text-xs bg-white border border-[var(--ace-line)] rounded-full text-[var(--ace-ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--ace-orange)] transition-colors"
                          />
                          {desktopSearch && (
                            <button
                              type="button"
                              onClick={() => setDesktopSearch('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <Link
                          href="/products"
                          onClick={() => setMegaMenuOpen(false)}
                          className="text-xs font-bold text-gray-800 hover:text-[var(--ace-orange)] flex items-center gap-1 transition-colors shrink-0"
                        >
                          <span>Full Catalog (100+)</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
                        </Link>
                      </div>
                    </div>

                    {/* Master-Detail Split Workspace */}
                    <div className="flex overflow-hidden min-h-[380px] max-h-[460px]">
                      {/* Left Sidebar: Categories Navigation Rail */}
                      <div
                        className="w-72 xl:w-80 shrink-0 border-r border-[var(--ace-line)] bg-[#FAF8F4]/70 overflow-y-auto p-3 space-y-1"
                        data-lenis-prevent
                      >
                        {desktopFilteredCategories.length === 0 ? (
                          <div className="p-6 text-center text-xs text-gray-500">
                            No matching category found for &quot;{desktopSearch}&quot;
                          </div>
                        ) : (
                          desktopFilteredCategories.map((category) => {
                            const isSelected = activeCategory.slug === category.slug;
                            return (
                              <button
                                key={category.id}
                                type="button"
                                onMouseEnter={() => setActiveCategorySlug(category.slug)}
                                onClick={() => setActiveCategorySlug(category.slug)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between gap-3 group cursor-pointer ${isSelected
                                    ? 'bg-white text-[var(--ace-orange)] shadow-xs font-bold border border-[var(--ace-orange)]/40 ring-1 ring-[var(--ace-orange)]/15'
                                    : 'text-[var(--ace-ink)] hover:bg-white/80 hover:text-[var(--ace-orange)] border border-transparent'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <PackagingIllustration
                                    slug={category.slug}
                                    className={`w-5 h-5 shrink-0 transition-colors ${isSelected ? 'text-[var(--ace-orange)]' : 'text-gray-500 group-hover:text-[var(--ace-orange)]'
                                      }`}
                                  />
                                  <span className="text-[13.5px] truncate font-medium">{category.name}</span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] font-semibold text-gray-500 bg-black/5 px-2 py-0.5 rounded-full">
                                    {category.products.length}
                                  </span>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[var(--ace-orange)] translate-x-0.5' : 'text-gray-400 group-hover:text-gray-600'
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
                        className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between bg-white"
                        data-lenis-prevent
                      >
                        <div>
                          {/* Active Category Header */}
                          <div className="flex items-center justify-between gap-4 pb-3.5 mb-4 border-b border-[var(--ace-line)]">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <PackagingIllustration slug={activeCategory.slug} className="w-5 h-5 text-[var(--brand-gold)]" />
                                <h3 className="text-lg font-bold text-[var(--ace-ink)] leading-snug">
                                  {activeCategory.name}
                                </h3>
                                <span className="text-[11px] font-semibold text-[var(--brand-gold)] bg-[#FAF8F4] px-2.5 py-0.5 rounded-full border border-[var(--ace-line)]">
                                  {activeCategory.products.length} Models
                                </span>
                              </div>
                              <p className="text-xs text-[var(--ace-muted)] mt-1">
                                {activeCategory.subtitleName} · 100% Prime Virgin PP 05 Food Grade Polymer
                              </p>
                            </div>

                            <Link
                              href={`/categories/${activeCategory.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-gold)] hover:underline shrink-0 bg-[#FAF8F4] px-3.5 py-2 rounded-xl border border-[var(--ace-line)] hover:border-[var(--brand-gold)] transition-colors"
                            >
                              <span>Explore All {activeCategory.products.length} Sizes</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* Model Grid - Clean 4-card showcase */}
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                            {activeCategory.products.slice(0, 4).map((product) => (
                              <Link
                                key={product.id}
                                href={`/categories/${activeCategory.slug}/${product.product_slug}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="group relative flex flex-col justify-between rounded-xl border border-[var(--ace-line)] bg-white p-3 hover:border-[var(--brand-gold)] hover:shadow-md transition-all text-left"
                              >
                                <div className="relative h-24 w-full flex items-center justify-center bg-[#FAF8F4] rounded-lg mb-2 overflow-hidden group-hover:bg-[#f6f2e8] transition-colors">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                  <span className="absolute top-1.5 right-1.5 bg-white/95 text-[var(--brand-gold)] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[var(--ace-line)] shadow-2xs">
                                    {product.capacity}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <h4 className="text-[13px] font-bold text-[var(--ace-ink)] group-hover:text-[var(--brand-gold)] transition-colors truncate leading-tight">
                                    {product.name}
                                  </h4>
                                  {product.dimensions && (
                                    <p className="text-[11px] text-[var(--ace-muted)] truncate mt-0.5">
                                      {product.dimensions.top} × {product.dimensions.height}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Minimal Quality Guarantee & PDF Link Strip */}
                        <div className="mt-4 pt-3 border-t border-[var(--ace-line)] flex items-center justify-between text-xs text-[var(--ace-muted)]">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>ISO 9001:2015 Certified · Deep Freeze (−20°C) to Microwave (+120°C) Safe</span>
                          </div>
                          <Link
                            href="/downloads"
                            onClick={() => setMegaMenuOpen(false)}
                            className="font-bold text-[var(--brand-gold)] hover:underline flex items-center gap-1 shrink-0"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Download Catalog (PDF)</span>
                          </Link>
                        </div>
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
                className={`w-3.5 h-3.5 rotate-90 transition-transform ${resourcesOpen ? 'text-[var(--ace-orange)] -scale-y-100' : 'opacity-60'
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
                        className={`block rounded-xl px-4 py-2.5 transition-colors hover:bg-[var(--ace-paper)] ${isActive(item.href) ? 'bg-[var(--ace-paper)]' : ''
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
                {/* Compact, High-Impact Product Collections Drawer for Mobile */}
                <div className="rounded-2xl border border-[var(--ace-line)] bg-white p-3.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    className="w-full flex items-center justify-between font-extrabold text-sm uppercase tracking-wide text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors py-1 cursor-pointer"
                    aria-expanded={mobileProductsOpen}
                  >
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-[var(--ace-orange)]" />
                      <span>Product </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--ace-orange)] transition-transform duration-300 ${mobileProductsOpen ? 'rotate-180' : ''
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
                        className="overflow-hidden pt-3 border-t border-[var(--ace-line)] mt-2.5 space-y-3"
                      >
                        {/* Instant Search Bar */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={mobileSearch}
                            onChange={(e) => setMobileSearch(e.target.value)}
                            placeholder="Search models or sizes (e.g. 500ml, bento)..."
                            className="w-full pl-8 pr-7 py-2 text-xs bg-[#FAF8F4] border border-[var(--ace-line)] rounded-xl text-[var(--ace-ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--ace-orange)] focus:bg-white transition-all"
                          />
                          {mobileSearch && (
                            <button
                              type="button"
                              onClick={() => setMobileSearch('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1 cursor-pointer"
                              aria-label="Clear search"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Live Search Results (When user types) */}
                        {mobileSearch.trim() ? (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px] px-1 text-gray-500">
                              <span className="font-semibold">Matching packaging ({mobileSearchResults.length})</span>
                              <button
                                type="button"
                                onClick={() => setMobileSearch('')}
                                className="text-[var(--ace-orange)] hover:underline font-bold"
                              >
                                Clear
                              </button>
                            </div>

                            {mobileSearchResults.length === 0 ? (
                              <div className="text-center py-6 px-4 bg-[#FAF8F4] rounded-xl border border-[var(--ace-line)]">
                                <p className="text-xs font-bold text-[var(--ace-ink)]">No packaging matches found</p>
                                <p className="text-[11px] text-gray-500 mt-1">Try searching for &quot;bento&quot;, &quot;500ml&quot;, or &quot;round&quot;.</p>
                              </div>
                            ) : (
                              <div className="space-y-1.5 max-h-[48vh] overflow-y-auto pr-0.5" data-lenis-prevent>
                                {mobileSearchResults.map((res, idx) => (
                                  <Link
                                    key={`${res.href}-${idx}`}
                                    href={res.href}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      setMobileSearch('');
                                    }}
                                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F4] hover:bg-white border border-[var(--ace-line)] hover:border-[var(--ace-orange)]/60 transition-colors group"
                                  >
                                    {res.image ? (
                                      <div className="w-9 h-9 rounded-lg bg-white border border-[var(--ace-line)] flex items-center justify-center shrink-0 overflow-hidden">
                                        <img src={res.image} alt="" className="w-full h-full object-cover" />
                                      </div>
                                    ) : (
                                      <div className="w-9 h-9 rounded-lg bg-white border border-[var(--ace-line)] flex items-center justify-center shrink-0">
                                        <Box className="w-4 h-4 text-[var(--ace-orange)]" />
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] transition-colors truncate">
                                        {res.title}
                                      </p>
                                      <p className="text-[10px] text-[#968152] font-medium truncate">
                                        {res.subtitle}
                                      </p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--ace-orange)] group-hover:translate-x-0.5 transition-all shrink-0" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Normal State: Dual Direct Actions + 6 Popular Lines + Full 17 A-Z Directory */
                          <div className="space-y-3">
                            {/* Quick Direct Catalog Shortcuts */}
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href="/categories"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-[#FAF8F4] to-[#F5EFE6] border border-[var(--ace-line)] hover:border-[var(--ace-orange)] text-left transition-colors group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-2xs shrink-0 text-[var(--ace-orange)]">
                                  <Layers className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-[11px] font-extrabold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] block leading-tight truncate">
                                    All 17 Series
                                  </span>
                                  <span className="text-[9.5px] text-gray-500 font-medium block truncate">
                                    Browse Categories
                                  </span>
                                </div>
                              </Link>

                              <Link
                                href="/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-[#FAF8F4] to-[#F5EFE6] border border-[var(--ace-line)] hover:border-[var(--ace-orange)] text-left transition-colors group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-2xs shrink-0 text-[var(--ace-orange)]">
                                  <Box className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-[11px] font-extrabold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] block leading-tight truncate">
                                    Full 89 Catalog
                                  </span>
                                  <span className="text-[9.5px] text-gray-500 font-medium block truncate">
                                    Filter by Capacity
                                  </span>
                                </div>
                              </Link>
                            </div>

                            {/* Popular Packaging Series (6 Curated Commercial Lines) */}
                            <div>
                              <div className="flex items-center justify-between mb-2 px-0.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#968152]">
                                  Popular Packaging Series
                                </span>
                                <span className="text-[10px] font-semibold text-gray-500">
                                  Top Commercial Lines
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                {FEATURED_MOBILE_CATEGORIES.map((item) => (
                                  <Link
                                    key={item.slug}
                                    href={`/categories/${item.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-xl bg-[#FAF8F4] hover:bg-white border border-[var(--ace-line)] hover:border-[var(--ace-orange)]/60 text-left transition-all group flex items-center gap-2"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-white border border-black/5 overflow-hidden shrink-0 flex items-center justify-center">
                                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[11px] font-bold text-[var(--ace-ink)] group-hover:text-[var(--ace-orange)] transition-colors leading-snug truncate">
                                        {item.shortTitle}
                                      </p>
                                      <span className="text-[9.5px] font-semibold text-[#968152] block">
                                        {item.modelCount} models
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Browse All 17 Series (A-Z) Flat Toggle */}
                            <div className="pt-2 border-t border-[var(--ace-line)]">
                              <button
                                type="button"
                                onClick={() => setMobileShowAllCats((v) => !v)}
                                className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#FAF8F4] hover:bg-white text-left text-xs font-bold text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-1.5">
                                  <UtensilsCrossed className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
                                  <span>Browse All 17 Series (A–Z)</span>
                                </div>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${mobileShowAllCats ? 'rotate-180' : ''
                                    }`}
                                />
                              </button>

                              {mobileShowAllCats && (
                                <div className="grid grid-cols-2 gap-1.5 pt-2 max-h-[36vh] overflow-y-auto pr-0.5 animate-fade-in" data-lenis-prevent>
                                  {sortedAllCategories.map((cat) => (
                                    <Link
                                      key={cat.id}
                                      href={`/categories/${cat.slug}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="py-1.5 px-2 rounded-lg bg-white hover:bg-[#FAF8F4] border border-[var(--ace-line)] text-left flex items-center justify-between text-[11px] font-semibold text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors group"
                                    >
                                      <span className="truncate flex-1 pr-1">{cat.name.replace(' Containers', '')}</span>
                                      <span className="text-[9.5px] text-gray-500 font-medium shrink-0">
                                        {cat.products.length}m
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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
                      className={`p-2 rounded-xl bg-white border border-[var(--ace-line)] transition-colors hover:text-[var(--ace-orange)] flex flex-col justify-between ${isActive(item.href) ? 'text-[var(--ace-orange)] border-[var(--ace-orange)]/60' : ''
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
