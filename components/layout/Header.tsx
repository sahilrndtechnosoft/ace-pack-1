'use client';

import { withDefaults } from '@/lib/cms/merge';
import { headerDefaults } from '@/lib/cms/site-settings';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
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
  Factory,
  Image as ImageIcon,
} from 'lucide-react';
import { productCategories, type ProductCategory } from '@/lib/data/products';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

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

const getResourceIcon = (href: string) => {
  switch (href) {
    case '/gallery':
      return ImageIcon;
    case '/customization':
    case '/oem':
      return Sparkles;
    case '/quality':
      return ShieldCheck;
    case '/process':
      return Factory;
    case '/capabilities':
      return Layers;
    case '/downloads':
      return FileDown;
    default:
      return FileDown;
  }
};

const MEGA_MENU_MODELS_PER_CATEGORY = 3;

// Floating photo that trails the cursor over the Products menu, like the /categories list.
const MEGA_PREVIEW_OFFSET = 28;
const MEGA_PREVIEW_EDGE = 16;

interface MegaPreview {
  image: string;
  title: string;
  href: string;
  // Product photos sit small on a large backdrop, so they get zoomed; category photos don't.
  isProduct: boolean;
}

export interface HeaderProps {
  initialSettings?: any;
  initialCategories?: ProductCategory[];
}

export const Header: React.FC<HeaderProps> = ({ initialSettings, initialCategories }) => {
  const [liveSettings, setLiveSettings] = useState(initialSettings || null);
  const [categories, setCategories] = useState<ProductCategory[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : productCategories
  );

  useEffect(() => {
    if (initialSettings) {
      setLiveSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  useEffect(() => {
    fetch('/api/content/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.settings?.header_settings) {
          setLiveSettings(data.settings.header_settings);
        }
      })
      .catch(() => {});

    fetch('/api/content/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data?.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const site = withDefaults(headerDefaults, liveSettings);
  const topbarPhone = site.topbarPhone;
  const menu = site.menu;
  const resourceLinks = menu.resourceLinks
    .filter((l) => l.label && l.link)
    .map((l) => ({ href: l.link, label: l.label, hint: l.hint }));
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Mega-menu and mobile drawer interactive states
  const [megaPreview, setMegaPreview] = useState<MegaPreview | null>(null);
  // Kept apart from the content so the photo stays put while the card fades out.
  const [isMegaPreviewVisible, setIsMegaPreviewVisible] = useState(false);
  const showMegaPreview = (preview: MegaPreview) => {
    setMegaPreview(preview);
    setIsMegaPreviewVisible(true);
  };
  const hideMegaPreview = () => setIsMegaPreviewVisible(false);
  const [mobileSearch, setMobileSearch] = useState<string>('');
  const [mobileShowAllCats, setMobileShowAllCats] = useState<boolean>(false);
  const megaMenuContainerRef = useRef<HTMLDivElement>(null);
  const resourcesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const megaPreviewRef = useRef<HTMLDivElement>(null);
  const megaPreviewMove = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useEffect(() => {
    const card = megaPreviewRef.current;
    if (!card) return;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.45;
    megaPreviewMove.current = {
      x: gsap.quickTo(card, 'x', { duration, ease: 'power3' }),
      y: gsap.quickTo(card, 'y', { duration, ease: 'power3' }),
    };
  }, []);

  // Same placement as the /categories list: right of the cursor, flipped left near the edge.
  const placeMegaPreview = (e: React.PointerEvent) => {
    const card = megaPreviewRef.current;
    const move = megaPreviewMove.current;
    if (!card || !move || e.pointerType !== 'mouse') return;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const x = e.clientX + MEGA_PREVIEW_OFFSET + w > window.innerWidth ? e.clientX - w - MEGA_PREVIEW_OFFSET : e.clientX + MEGA_PREVIEW_OFFSET;
    move.x(x);
    move.y(Math.min(window.innerHeight - h - MEGA_PREVIEW_EDGE, Math.max(MEGA_PREVIEW_EDGE, e.clientY - h / 2)));
  };

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

  // Close desktop dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (megaMenuContainerRef.current && !megaMenuContainerRef.current.contains(target)) {
        setMegaMenuOpen(false);
      }
      if (resourcesContainerRef.current && !resourcesContainerRef.current.contains(target)) {
        setResourcesOpen(false);
      }
    };
    if (megaMenuOpen || resourcesOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [megaMenuOpen, resourcesOpen]);

  const pathname = usePathname() ?? '/';

  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Which top-level section the current URL belongs to.
  const isActive = (href: string) => {
    const roots =
      href === '/categories' || href === '/plastic-food-containers'
        ? ['/categories', '/products', '/plastic-food-containers']
        : href === '/events'
        ? ['/events', '/exhibitions']
        : href === '/blog' || href === '/blogs'
        ? ['/blog', '/blogs']
        : href === '/resources'
        ? resourceLinks.map((l) => l.href)
        : [href];
    return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
  };

  const navLink = (href: string, extra = '') =>
    `relative py-3 transition-colors hover:text-[var(--ace-orange)] after:absolute after:left-0 after:right-0 after:bottom-1 after:h-[2px] after:rounded-full after:bg-[var(--ace-orange)] after:origin-left after:transition-transform after:duration-300 ${isActive(href) ? 'text-[var(--ace-orange)] after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    } ${extra}`;

  const mobileLink = (href: string) =>
    `py-2.5 px-3 rounded-xl flex items-center justify-between font-bold text-sm transition-colors hover:bg-white hover:text-[var(--ace-orange)] ${isActive(href) ? 'bg-white text-[var(--ace-orange)] font-extrabold shadow-2xs' : 'text-[var(--ace-ink)]'
    }`;

  const totalModels = categories.reduce((sum, c) => sum + c.products.length, 0);

  // Sorted categories for the mobile drawer full A-Z directory
  const sortedAllCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

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
    for (const cat of categories) {
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
    for (const cat of categories) {
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
  }, [mobileSearch, categories]);

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
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex items-center justify-between gap-4 lg:gap-6">
        {/* Brand Logo - Official Ace Packaging Logo */}
        <Link href="/" className="flex shrink-0 items-center group py-0.5">
          <div className="flex items-center justify-center">
            <img
              src={site.logo}
              alt="Ace Packaging"
              width={340}
              height={152}
              decoding="async"
              className="h-10 sm:h-12 lg:h-11 xl:h-12 2xl:h-13.5 w-auto max-w-[125px] sm:max-w-[150px] lg:max-w-[145px] xl:max-w-[160px] 2xl:max-w-[180px] object-contain group-hover:scale-[1.02] transition-transform duration-200"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links (Enabled for lg: >= 1024px) */}
        <nav className="hidden lg:flex items-center justify-center mx-auto px-2 xl:px-4 gap-3 lg:gap-3.5 xl:gap-5 2xl:gap-7 text-[12.5px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap text-[var(--ace-ink)] shrink-0">
          <Link href="/about" className={navLink('/about')} aria-current={isActive('/about') ? 'page' : undefined}>
            {menu.aboutLabel}
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
              <span>{menu.productsLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  megaMenuOpen ? 'rotate-180 text-[var(--ace-orange)]' : 'opacity-60'
                }`}
              />
            </button>

            {/* Category mega menu: categories flow into balanced columns; hovering a model previews its photo */}
            <AnimatePresence>
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[1200px] z-50 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white border border-[#E6DBC6] rounded-2xl shadow-[0_24px_70px_rgba(20,23,26,0.18)] overflow-hidden flex flex-col tracking-normal normal-case whitespace-normal"
                  >
                    <div className="px-6 xl:px-7 py-3.5 border-b border-[var(--ace-line)] flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--brand-gold)]">
                        <Sparkles className="w-3.5 h-3.5" />
                        Product Categories &amp; Model Variants
                      </span>
                      <Link
                        href="/products"
                        onClick={() => setMegaMenuOpen(false)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--ace-ink)] hover:text-[var(--brand-gold)] transition-colors"
                      >
                        View All {totalModels} Products
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                      </Link>
                    </div>

                    <div
                      className="max-h-[calc(100dvh-190px)] overflow-y-auto overscroll-contain px-6 xl:px-7 pt-5 pb-1"
                      data-lenis-prevent
                      onPointerMove={placeMegaPreview}
                      onPointerLeave={hideMegaPreview}
                    >
                        <div className="columns-4 xl:columns-5 gap-6 xl:gap-7">
                          {categories.map((category) => {
                            const extraModels = category.products.length - MEGA_MENU_MODELS_PER_CATEGORY;
                            const categoryHref = `/categories/${category.slug}`;
                            return (
                              <div key={category.id} className="inline-block w-full break-inside-avoid mb-4">
                                <Link
                                  href={categoryHref}
                                  onClick={() => setMegaMenuOpen(false)}
                                  onMouseEnter={() => showMegaPreview({ image: category.heroImage, title: category.name, href: categoryHref, isProduct: false })}
                                  onMouseLeave={hideMegaPreview}
                                  className="flex items-baseline justify-between gap-2 pb-1.5 mb-2 border-b border-[var(--ace-line)] text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--brand-gold)] hover:text-[var(--ace-ink)] transition-colors"
                                >
                                  <span className="truncate">{category.name}</span>
                                  <span className="text-[10px] font-semibold text-[var(--ace-muted)] tracking-normal shrink-0">{category.products.length}</span>
                                </Link>
                                <ul className="space-y-0.5">
                                  {category.products.slice(0, MEGA_MENU_MODELS_PER_CATEGORY).map((product) => {
                                    const href = `${categoryHref}/${product.product_slug}`;
                                    const isPreviewed = isMegaPreviewVisible && megaPreview?.href === href;
                                    const preview: MegaPreview = { image: product.image, title: product.name, href, isProduct: true };
                                    return (
                                      <li key={product.id}>
                                        <Link
                                          href={href}
                                          onClick={() => setMegaMenuOpen(false)}
                                          onMouseEnter={() => showMegaPreview(preview)}
                                          onMouseLeave={hideMegaPreview}
                                          className={`group/item flex items-start gap-1.5 py-[3px] text-[12.5px] font-medium transition-colors ${
                                            isPreviewed ? 'text-[var(--brand-gold)]' : 'text-[var(--ace-ink)] hover:text-[var(--brand-gold)]'
                                          }`}
                                        >
                                          <ChevronRight className="w-3 h-3 mt-[3px] shrink-0 text-[var(--brand-gold)] transition-transform group-hover/item:translate-x-0.5" />
                                          <span className="leading-snug">{product.name}</span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                  {extraModels > 0 && (
                                    <li>
                                      <Link
                                        href={categoryHref}
                                        onClick={() => setMegaMenuOpen(false)}
                                        className="inline-flex items-center gap-1 pl-[18px] py-[3px] text-[12px] font-semibold text-[var(--brand-gold)] hover:text-[var(--ace-ink)] transition-colors"
                                      >
                                        +{extraModels} more models
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                    </div>

                    <div className="px-6 xl:px-7 py-3 border-t border-[var(--ace-line)] bg-[#FAF8F4] flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.04em]">
                      <span className="inline-flex items-center gap-1.5 text-[var(--ace-ink)] min-w-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                        <span className="truncate">All containers are manufactured from 100% virgin PP 05 food grade plastic.</span>
                      </span>
                      <Link
                        href="/contact"
                        onClick={() => setMegaMenuOpen(false)}
                        className="inline-flex items-center gap-1 text-[var(--brand-gold)] hover:text-[var(--ace-ink)] transition-colors shrink-0"
                      >
                        Request Bulk Factory Quote
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/industries" className={navLink('/industries')} aria-current={isActive('/industries') ? 'page' : undefined}>
            {menu.industriesLabel}
          </Link>

          {/* Resources Dropdown */}
          <div
            ref={resourcesContainerRef}
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
            onFocus={() => setResourcesOpen(true)}
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
              className={navLink(
                '/resources',
                `inline-flex items-center gap-1.5 cursor-pointer ${resourcesOpen ? 'text-[var(--ace-orange)]' : ''}`
              )}
            >
              <span>{menu.resourcesLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  resourcesOpen ? 'rotate-180 text-[var(--ace-orange)]' : 'opacity-60'
                }`}
              />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[580px] max-w-[94vw] bg-white border border-[#E6DBC6] rounded-2xl shadow-[0_24px_60px_rgba(20,23,26,0.18)] p-3.5 normal-case tracking-normal origin-top"
                    data-lenis-prevent
                  >
                    <div className="px-2 pb-2.5 mb-2 border-b border-[#E6DBC6]/70 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750]">
                        Technical &amp; Commercial Resources
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500 bg-[#FAF7EE] px-2 py-0.5 rounded-full border border-[#E6DBC6]">
                        Manufacturing · QA · Audits
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {resourceLinks.map((item) => {
                        const Icon = getResourceIcon(item.href);
                        const isCurrent = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setResourcesOpen(false)}
                            aria-current={isCurrent ? 'page' : undefined}
                            className={`group flex items-start gap-2.5 p-2.5 rounded-xl transition-all duration-200 border odd:last:col-span-2 ${
                              isCurrent
                                ? 'bg-[#FAF7EE] border-[#b99750] shadow-xs'
                                : 'bg-[#FAF8F5]/60 hover:bg-[#FAF7EE] border-[#EAE4D7] hover:border-[#b99750] hover:shadow-xs'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                isCurrent
                                  ? 'bg-[#b99750] text-white shadow-xs'
                                  : 'bg-white group-hover:bg-[#b99750] group-hover:text-white text-[#b99750] border border-[#E6DBC6] group-hover:border-[#b99750] shadow-xs'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-[12.5px] font-bold transition-colors truncate ${
                                    isCurrent ? 'text-[#b99750]' : 'text-[var(--ace-ink)] group-hover:text-[#b99750]'
                                  }`}
                                >
                                  {item.label}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#b99750] group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                              </div>
                              <p className="text-[11px] text-gray-500 group-hover:text-gray-700 leading-snug line-clamp-1 mt-0.5">
                                {item.hint}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E6DBC6]/70 flex items-center justify-between px-2 text-[11.5px] text-gray-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>ISO 9001:2015 · 100% Prime Virgin PP 05</span>
                      </div>
                      <Link
                        href="/downloads"
                        onClick={() => setResourcesOpen(false)}
                        className="font-bold text-[#b99750] hover:text-[var(--ace-ink)] hover:underline flex items-center gap-1 transition-colors"
                      >
                        <span>Download Center</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Exhibitions & Events hidden from the menu on request; the /events page still works.
          <Link href="/events" className={navLink('/events')} aria-current={isActive('/events') ? 'page' : undefined}>
            {menu.eventsLabel}
          </Link>
          */}

          <Link href="/blogs" className={navLink('/blogs')} aria-current={isActive('/blogs') ? 'page' : undefined}>
            {menu.blogsLabel}
          </Link>
        </nav>

        {/* Header Right Utilities */}
        <div className="flex items-center gap-2 lg:gap-2.5 xl:gap-3 shrink-0">
          <LanguageSelector />

          {/* Action Button (Desktop) */}
          <div className="hidden lg:flex shrink-0 items-center gap-2 lg:gap-2.5 xl:gap-3">
            <a
              href={`tel:${topbarPhone.replace(/\s+/g, '')}`}
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
              <span>{topbarPhone}</span>
            </a>

            <Link
              href={site.ctaButtonLink}
              className="bg-[var(--ace-orange)] text-white hover:bg-[var(--ace-ink)] hover:text-[var(--ace-paper)] text-[11px] lg:text-[11.5px] xl:text-xs font-bold px-3 lg:px-3.5 xl:px-4 py-2 xl:py-2.5 rounded-full shadow-xs hover:shadow transition-all uppercase tracking-wider whitespace-nowrap"
            >
              {site.ctaButtonText}
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

      {/* Cursor-following product photo for the Products menu (styled like the /categories preview) */}
      <div ref={megaPreviewRef} aria-hidden="true" className="hidden lg:block fixed left-0 top-0 z-[60] pointer-events-none">
        <div
          className={`relative w-[260px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/80 bg-[radial-gradient(circle_at_center,#ffffff_0%,#f4f0e6_100%)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] transition duration-300 ease-out ${
            megaMenuOpen && isMegaPreviewVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.94]'
          }`}
        >
        {megaPreview && (
          <>
            <img
              key={megaPreview.image}
              src={megaPreview.image}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover ${megaPreview.isProduct ? 'scale-[1.9] origin-[50%_70%]' : ''}`}
            />
            <span className="absolute left-3 bottom-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-[rgba(26,29,32,0.85)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
              {megaPreview.title}
            </span>
          </>
        )}
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
                      <span>{menu.productsLabel}</span>
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
                          /* Normal State: direct actions, popular lines and the full A-Z directory */
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
                                    All {categories.length} Series
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
                                    All {totalModels} Models
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

                            {/* Browse all series (A-Z) toggle */}
                            <div className="pt-2 border-t border-[var(--ace-line)]">
                              <button
                                type="button"
                                onClick={() => setMobileShowAllCats((v) => !v)}
                                className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#FAF8F4] hover:bg-white text-left text-xs font-bold text-[var(--ace-ink)] hover:text-[var(--ace-orange)] transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-1.5">
                                  <UtensilsCrossed className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
                                  <span>Browse All {categories.length} Series (A–Z)</span>
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
                  <span>{menu.mobileCatalogLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/about')}
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  <span>{menu.aboutLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  href="/industries"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/industries')}
                  aria-current={isActive('/industries') ? 'page' : undefined}
                >
                  <span>{menu.industriesLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                {/* Exhibitions & Events hidden from the menu on request.
                <Link
                  href="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/events')}
                  aria-current={isActive('/events') ? 'page' : undefined}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--ace-orange)]" />
                    <span>{menu.eventsLabel}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
                */}

                <Link
                  href="/blogs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/blogs')}
                  aria-current={isActive('/blogs') ? 'page' : undefined}
                >
                  <span>{menu.mobileBlogsLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLink('/contact')}
                  aria-current={isActive('/contact') ? 'page' : undefined}
                >
                  <span>{menu.mobileContactLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </nav>

              {/* Resources Strip in Mobile */}
              <div className="pt-3 border-t border-[#E6DBC6]">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750]">
                    Technical &amp; Commercial Resources
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 bg-[#FAF7EE] px-2 py-0.5 rounded-full border border-[#E6DBC6]">
                    {resourceLinks.length} Sections
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resourceLinks.map((item) => {
                    const Icon = getResourceIcon(item.href);
                    const isCurrent = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`p-2.5 rounded-xl bg-white hover:bg-[#FAF7EE] border transition-all flex items-center gap-3 group ${
                          isCurrent
                            ? 'border-[#b99750] bg-[#FAF7EE] shadow-xs text-[#b99750]'
                            : 'border-[#EAE4D7] hover:border-[#b99750]/60 text-[var(--ace-ink)]'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isCurrent
                              ? 'bg-[#b99750] text-white'
                              : 'bg-[#FAF8F5] group-hover:bg-[#b99750] group-hover:text-white border border-[#E6DBC6] text-[#b99750]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold group-hover:text-[#b99750] transition-colors truncate">
                            {item.label}
                          </p>
                          <p className="text-[10.5px] text-gray-500 truncate mt-0.5">
                            {item.hint}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#b99750] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Direct Call & CTA */}
              <div className="pt-3 border-t border-[var(--ace-line)] flex flex-col gap-2.5">
                <a
                  href={`tel:${topbarPhone.replace(/\s+/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white border border-[var(--ace-line)] font-bold text-xs text-[var(--ace-ink)] hover:text-[var(--ace-orange)]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[var(--ace-orange)]" />
                  <span>Call {topbarPhone}</span>
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
