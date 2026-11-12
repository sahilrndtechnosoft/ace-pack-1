'use client';
import { useSiteText } from '@/components/layout/SiteTextProvider';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Flame,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  Box,
  Ruler,
  UtensilsCrossed,
  Video,
  FileDown,
  Sparkles,
  Maximize2,
  Palette
} from 'lucide-react';
import { type ProductCategory, type ProductItem } from '@/lib/data/products';
import { CatalogueDownloadModal } from '../ui/CatalogueDownloadModal';

interface ProductDetailInteractiveProps {
  category: ProductCategory;
  product: ProductItem;
  initialVariety?: string;
  /** Page H1; defaults to the product name (live URLs pass the live site's H1). */
  heading?: string;
}

export const ProductDetailInteractive: React.FC<ProductDetailInteractiveProps> = ({
  category,
  product,
  initialVariety,
  heading,
}) => {
  const t = useSiteText().productPage;
  const [activeView, setActiveView] = useState<'blank' | 'specs' | 'locking' | 'video'>('blank');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [sampleSubmitted, setSampleSubmitted] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [sampleData, setSampleData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [selectedVarietySlug, setSelectedVarietySlug] = useState<string>(() => {
    if (initialVariety && product.varieties?.some((v) => v.slug === initialVariety)) {
      return initialVariety;
    }
    return product.varieties?.[0]?.slug || '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlVariety = new URLSearchParams(window.location.search).get('variety');
      if (urlVariety && product.varieties?.some((v) => v.slug === urlVariety)) {
        setSelectedVarietySlug(urlVariety);
      }
    }
  }, [product.varieties]);

  const activeVariety = product.varieties?.find((v) => v.slug === selectedVarietySlug) || product.varieties?.[0];

  // Derive visuals - always prioritize authentic original product images with variety awareness
  const blankImage = activeVariety?.image || product.blankImage || product.image || category.heroImage;
  const currentProductImage = activeVariety?.image || product.image;

  const lockingFoodImage =
    product.lockingFoodImage ||
    (category.gallery?.find((g) => g.toLowerCase().includes('lifestyle')) ||
     category.gallery?.[category.gallery.length - 1] ||
     category.heroImage ||
     product.image);

  const foodApplications = product.applications && product.applications.length > 0
    ? product.applications
    : ['Cloud Kitchen Combos', 'Hot Gravy & Curry Delivery', 'Salads & Cold Meals', 'Microwave Reheating'];

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSampleLoading(true);
    setTimeout(() => {
      setSampleLoading(false);
      setSampleSubmitted(true);
    }, 600);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 4-View Visual Studio */}
        <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          
          {/* Color Variety Selector Panel (if product has multiple varieties) */}
          {product.varieties && product.varieties.length > 0 && (
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E6DBC6] shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FAF8F4] border border-[#E6DBC6] flex items-center justify-center text-[#b99750] shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{t.colorFinishLabel}</span>
                  <span className="text-xs font-extrabold text-[var(--ace-ink)]">
                    {activeVariety?.name || 'Selected Finish'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#b99750] bg-[#FAF8F4] px-2.5 py-0.5 rounded-full border border-[#E6DBC6]">
                  {product.varieties.length} Options
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {product.varieties.map((v) => {
                  const isSelected = (activeVariety?.slug || product.varieties![0].slug) === v.slug;
                  return (
                    <button
                      key={v.slug}
                      type="button"
                      onClick={() => {
                        setSelectedVarietySlug(v.slug);
                        if (activeView === 'video') setActiveView('blank');
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--ace-ink)] text-white shadow-xs ring-2 ring-[#b99750]'
                          : 'bg-[#FAF8F4] text-gray-700 hover:bg-[#F3EFE6] border border-[#E6DBC6]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border inline-block shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: v.colorHex,
                          borderColor: v.borderHex || '#cbd5e1',
                        }}
                      />
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>

              {activeVariety?.description && (
                <p className="text-[11px] text-gray-500 italic mt-0.5">
                  {activeVariety.description}
                </p>
              )}
            </div>
          )}

          {/* View selector: 2×2 where the column is narrow, one row where it has room. */}
          <div
            role="tablist"
            aria-label="Product display views"
            className="grid grid-cols-2 gap-1.5 rounded-2xl border border-[#E6DBC6] bg-[#FAF8F4] p-1.5 sm:grid-cols-4 lg:grid-cols-2 2xl:grid-cols-4"
          >
            {([
              { view: 'blank', label: t.tabProductView, Icon: Box },
              { view: 'specs', label: t.tabDimensions, Icon: Ruler },
              { view: 'locking', label: t.tabFoodLocking, Icon: UtensilsCrossed },
              { view: 'video', label: t.tabProcessVideo, Icon: Video },
            ] as const).map(({ view, label, Icon }) => {
              const isActive = activeView === view;
              return (
                <button
                  key={view}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveView(view)}
                  className={`flex min-h-[44px] min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold transition-colors duration-200 ${
                    isActive
                      ? 'border-[#b99750] bg-white text-[#8b6e32] shadow-sm'
                      : 'border-transparent text-gray-600 hover:bg-white hover:text-[var(--ace-ink)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Stage Display Area */}
          <div className="relative rounded-3xl border-2 border-[#E6DBC6] bg-white p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] shadow-lg overflow-hidden group">
            
            {/* View 1: Blank / Empty Container (Clear view of shape and structure) */}
            {activeView === 'blank' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-4/3 rounded-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src={blankImage}
                    alt={`${product.name} Blank Empty Container Structure`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FAF8F4] border border-[#E6DBC6] text-[11px] sm:text-xs font-semibold text-gray-700 flex items-center gap-2 text-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#b99750] shrink-0" />
                  <span>{t.productViewCaption}</span>
                </div>
              </div>
            )}

            {/* View 2: Dimensions & Specifications Blueprint */}
            {activeView === 'specs' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative">
                <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-4/3 flex items-center justify-center bg-[#FAF8F4] rounded-2xl overflow-hidden border border-dashed border-[#b99750]/50">
                  <img
                    src={currentProductImage}
                    alt={`${product.name} Dimensions`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-90"
                  />

                  {/* Dimension Overlay Callouts */}
                  <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-[#b99750] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#b99750] shadow-xs whitespace-nowrap z-10">
                    Top: {product.dimensions?.top || '172mm Ø'}
                  </div>
                  <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs border border-[#b99750] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#b99750] shadow-xs whitespace-nowrap z-10">
                    Height: {product.dimensions?.height || '54mm'}
                  </div>
                  <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-[#b99750] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#b99750] shadow-xs whitespace-nowrap z-10">
                    {product.dimensions?.bottom ? `Bottom: ${product.dimensions.bottom}` : 'Wall: 0.68mm Precision Injection'}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 w-full grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">{t.volumeLabel}</span>
                    <strong className="text-[var(--ace-ink)] text-xs sm:text-sm font-bold truncate block">{product.capacity}</strong>
                  </div>
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">{t.materialLabel}</span>
                    <strong className="text-[var(--ace-ink)] text-xs sm:text-sm font-bold truncate block">{t.materialValue}</strong>
                  </div>
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">{t.cartonLabel}</span>
                    <strong className="text-[var(--ace-ink)] text-xs sm:text-sm font-bold truncate block">{product.packaging ? product.packaging.split(' ')[0] : '500 Pcs'}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Locking System & Food Application Visual */}
            {activeView === 'locking' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-full max-w-[420px] aspect-4/3 rounded-2xl overflow-hidden shadow-sm border border-[#E6DBC6] bg-[#FAF8F4] flex items-center justify-center">
                  <img
                    src={lockingFoodImage}
                    alt={`${product.name} Locking System with Food Application`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                    <div className="text-white text-left">
                      <span className="bg-[#b99750] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                        {t.lockingTitle}
                      </span>
                      <p className="text-[11px] sm:text-xs text-white/90 font-medium leading-relaxed">
                        {t.lockingText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Category/Product Related Manufacturing Video */}
            {activeView === 'video' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in p-1">
                <div className="relative w-full max-w-[480px] aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  {isVideoPlaying ? (
                    <div className="relative w-full h-full">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/dqwNPJ1ZWeU?autoplay=1&rel=0&modestbranding=1"
                        title={`${product.name} Cleanroom Injection Moulding Process Video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0 rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={() => setIsVideoPlaying(false)}
                        aria-label="Stop video and return to preview"
                        className="absolute top-2 right-2 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 transition-colors cursor-pointer shadow-sm border border-white/20"
                      >
                        {t.stopVideoText}
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop"
                        alt="Precision Injection Moulding Line"
                        className="w-full h-full object-cover filter brightness-75"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white bg-black/40">
                        <button
                          type="button"
                          onClick={() => setIsVideoPlaying(true)}
                          aria-label="Play moulding process video"
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white flex items-center justify-center shadow-lg mb-2 sm:mb-3 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white/20"
                        >
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-white" />
                        </button>
                        <h4 className="text-xs sm:text-sm font-bold mb-1">{t.videoTitle}</h4>
                        <p className="text-[10px] sm:text-[11px] text-gray-200 max-w-xs leading-relaxed">
                          {t.videoText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quality badge in top right */}
            <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/95 backdrop-blur-xs text-[#b99750] border border-[#E6DBC6] text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs">
              {product.capacity}
            </span>
          </div>

          {/* 4-View Visual Studio Cards (Consistent Aspect Ratio & Sizing) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 mt-3">
            {/* Card 1: Product View */}
            <button
              type="button"
              onClick={() => setActiveView('blank')}
              aria-label="View Product Structure"
              className={`w-full aspect-[4/3] rounded-2xl border p-1.5 sm:p-2 bg-white flex items-center justify-center transition-all cursor-pointer relative overflow-hidden group ${
                activeView === 'blank'
                  ? 'border-[#b99750] ring-2 ring-[#b99750] shadow-md scale-[1.02]'
                  : 'border-[#E6DBC6] hover:border-[#b99750]/60 opacity-90 hover:opacity-100 hover:shadow-xs'
              }`}
            >
              <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#F7F4EC] overflow-hidden flex items-center justify-center relative border border-[#E6DBC6]/50">
                <img
                  src={blankImage}
                  alt={`${product.name} Structure`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {activeView === 'blank' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b99750] ring-2 ring-white" />
              )}
            </button>

            {/* Card 2: Dimensions & Blueprint */}
            <button
              type="button"
              onClick={() => setActiveView('specs')}
              aria-label="View Dimensions Blueprint"
              className={`w-full aspect-[4/3] rounded-2xl border p-1.5 sm:p-2 bg-white flex items-center justify-center transition-all cursor-pointer relative overflow-hidden group ${
                activeView === 'specs'
                  ? 'border-[#b99750] ring-2 ring-[#b99750] shadow-md scale-[1.02]'
                  : 'border-[#E6DBC6] hover:border-[#b99750]/60 opacity-90 hover:opacity-100 hover:shadow-xs'
              }`}
            >
              <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#F7F4EC] overflow-hidden flex items-center justify-center relative border border-[#E6DBC6]/50">
                <img
                  src={currentProductImage}
                  alt={`${product.name} Dimensions`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {activeView === 'specs' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b99750] ring-2 ring-white" />
              )}
            </button>

            {/* Card 3: Food Locking Seal */}
            <button
              type="button"
              onClick={() => setActiveView('locking')}
              aria-label="View Food Locking Seal"
              className={`w-full aspect-[4/3] rounded-2xl border p-1.5 sm:p-2 bg-white flex items-center justify-center transition-all cursor-pointer relative overflow-hidden group ${
                activeView === 'locking'
                  ? 'border-[#b99750] ring-2 ring-[#b99750] shadow-md scale-[1.02]'
                  : 'border-[#E6DBC6] hover:border-[#b99750]/60 opacity-90 hover:opacity-100 hover:shadow-xs'
              }`}
            >
              <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#F7F4EC] overflow-hidden flex items-center justify-center relative border border-[#E6DBC6]/50">
                <img
                  src={lockingFoodImage}
                  alt={`${product.name} Food Locking`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {activeView === 'locking' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b99750] ring-2 ring-white" />
              )}
            </button>

            {/* Card 4: Manufacturing Video */}
            <button
              type="button"
              onClick={() => setActiveView('video')}
              aria-label="View Manufacturing Video"
              className={`w-full aspect-[4/3] rounded-2xl border p-1.5 sm:p-2 bg-white flex items-center justify-center transition-all cursor-pointer relative overflow-hidden group ${
                activeView === 'video'
                  ? 'border-[#b99750] ring-2 ring-[#b99750] shadow-md scale-[1.02]'
                  : 'border-[#E6DBC6] hover:border-[#b99750]/60 opacity-90 hover:opacity-100 hover:shadow-xs'
              }`}
            >
              <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#F7F4EC] overflow-hidden flex flex-col items-center justify-center relative border border-[#E6DBC6]/50">
                <img
                  src="https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop"
                  alt="Process Video Poster"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-1">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#b99750] text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide drop-shadow-xs">
                    {t.videoBadge}
                  </span>
                </div>
              </div>
              {activeView === 'video' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b99750] ring-2 ring-white z-10" />
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Specifications, Food Applications, and Inquiry Form */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          
          {/* Main Info Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm">
            <span className="text-xs font-extrabold text-[#b99750] uppercase tracking-wider block mb-1">
              CATEGORY: {category.name} ({category.subtitleName})
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--ace-ink)] mb-3">
              {heading || product.name}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Precision injection-moulded packaging engineered from 100% prime virgin PP 05. Features zero-leak rim closure, high stacking rigidity, and microwave &amp; deep-freeze thermal tolerance.
            </p>

            {/* Core Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-[#FAF8F4] p-3 rounded-2xl border border-[#E6DBC6] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#b99750] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">{t.materialLabel}</span>
                  <span className="text-xs font-bold text-[var(--ace-ink)]">{product.material}</span>
                </div>
              </div>

              <div className="bg-[#FAF8F4] p-3 rounded-2xl border border-[#E6DBC6] flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-[#b99750] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">{t.thermalLabel}</span>
                  <span className="text-xs font-bold text-[var(--ace-ink)]">-20°C to +120°C</span>
                </div>
              </div>

              <div className="bg-[#FAF8F4] p-3 rounded-2xl border border-[#E6DBC6] flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <Layers className="w-5 h-5 text-[#b99750] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">{t.foodContactLabel}</span>
                  <span className="text-xs font-bold text-emerald-600">{t.foodContactValue}</span>
                </div>
              </div>
            </div>

            {/* Essential Technical Specifications Table */}
            <div className="mb-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ace-ink)] mb-3">
                {t.specsHeading}
              </h3>
              <div className="border border-[#E6DBC6] rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-[#E6DBC6] bg-[#FAF8F4]">
                      <td className="p-3 font-bold text-gray-600 w-1/3">{t.specCapacity}</td>
                      <td className="p-3 font-bold text-[#b99750]">{product.capacity}</td>
                    </tr>
                    <tr className="border-b border-[#E6DBC6]">
                      <td className="p-3 font-bold text-gray-600">{t.specResin}</td>
                      <td className="p-3 font-bold text-[var(--ace-ink)]">{t.specResinValue}</td>
                    </tr>
                    {product.dimensions && (
                      <tr className="border-b border-[#E6DBC6] bg-[#FAF8F4]">
                        <td className="p-3 font-bold text-gray-600">{t.specDimensions}</td>
                        <td className="p-3 font-bold text-[var(--ace-ink)]">
                          {product.dimensions.top} (Top)
                          {product.dimensions.bottom ? ` × ${product.dimensions.bottom} (Bottom)` : ''}
                          {` × ${product.dimensions.height} (Height)`}
                        </td>
                      </tr>
                    )}
                    {product.varieties && product.varieties.length > 0 && (
                      <tr className="border-b border-[#E6DBC6]">
                        <td className="p-3 font-bold text-gray-600">{t.specVarieties}</td>
                        <td className="p-3 font-bold text-[var(--ace-ink)]">
                          {product.varieties.map((v) => v.name).join(' · ')}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-[#E6DBC6]">
                      <td className="p-3 font-bold text-gray-600">{t.specLid}</td>
                      <td className="p-3 font-bold text-[var(--ace-ink)]">{t.specLidValue}</td>
                    </tr>
                    <tr className="border-b border-[#E6DBC6] bg-[#FAF8F4]">
                      <td className="p-3 font-bold text-gray-600">{t.specThermal}</td>
                      <td className="p-3 text-gray-700">{t.specThermalValue}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-600">{t.specMasterBox}</td>
                      <td className="p-3 text-gray-700">{product.packaging || 'Standard Export Carton'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Food Applications Section (User Requirement 6: Food visuals inside containers) */}
            <div className="mb-6 pt-4 border-t border-[#E6DBC6]/60">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ace-ink)] mb-3 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#b99750]" />
                <span>{t.applicationsHeading}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {foodApplications.map((app, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FAF8F4] text-gray-800 px-3 py-1.5 rounded-full border border-[#E6DBC6]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#b99750]" />
                    <span>{app}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Brochure Download Action */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCatalogueOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[var(--ace-ink)] bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-2.5 hover:border-[#b99750] transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-[#b99750]" />
                <span>{t.datasheetButtonText}</span>
              </button>
              <span className="text-[11px] text-gray-500">
                {t.datasheetNote}
              </span>
            </div>
          </div>

          {/* Factory Sample / Product Inquiry Card (Compliant: zero pricing or wholesale references) */}
          <div className="bg-white p-5 sm:p-7 lg:p-8 rounded-3xl border-2 border-[#b99750]/50 shadow-md">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--ace-ink)] mb-1">
              {t.sampleHeading} {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              {t.sampleIntro}
            </p>

            {sampleSubmitted ? (
              <div className="text-center py-6 animate-fade-in bg-[#FAF8F4] rounded-2xl border border-[#E6DBC6] p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[var(--ace-ink)] mb-1">{t.sampleSuccessHeading}</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto mb-4 leading-relaxed">
                  Thank you, <strong>{sampleData.name || 'Valued Partner'}</strong> — <strong>{product.name} ({product.capacity})</strong>. {t.sampleSuccessText}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSampleSubmitted(false);
                    setSampleData({ name: '', company: '', email: '', phone: '', notes: '' });
                  }}
                  className="text-xs font-bold text-[#b99750] hover:underline cursor-pointer"
                >
                  {t.sampleAgainText}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSampleSubmit} className="space-y-3.5 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">{t.sampleNameLabel}</label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      required
                      value={sampleData.name}
                      onChange={(e) => setSampleData({ ...sampleData, name: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">{t.sampleCompanyLabel}</label>
                    <input
                      type="text"
                      placeholder="Ace Cloud Kitchens"
                      required
                      value={sampleData.company}
                      onChange={(e) => setSampleData({ ...sampleData, company: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">{t.sampleEmailLabel}</label>
                    <input
                      type="email"
                      placeholder="rahul@company.com"
                      required
                      value={sampleData.email}
                      onChange={(e) => setSampleData({ ...sampleData, email: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">{t.samplePhoneLabel}</label>
                    <input
                      type="tel"
                      placeholder="+91 98251 20023"
                      required
                      value={sampleData.phone}
                      onChange={(e) => setSampleData({ ...sampleData, phone: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">{t.sampleNotesLabel}</label>
                  <textarea
                    rows={3}
                    placeholder={`Please specify requirements or delivery destination for ${product.name} (${product.capacity})...`}
                    value={sampleData.notes}
                    onChange={(e) => setSampleData({ ...sampleData, notes: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750] transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={sampleLoading}
                  className="w-full bg-[#b99750] hover:bg-[#a6843e] active:scale-[0.99] text-white font-bold py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#b99750]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {sampleLoading ? (
                    <span>{t.sampleSendingText}</span>
                  ) : (
                    <>
                      <span>{t.sampleSubmitText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-[#b99750]" /> Confidential factory-direct dispatch
                </p>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Visual Food Applications Showcase with Real Food Visuals */}
      <div className="mt-10 sm:mt-14 bg-white rounded-3xl border border-[#E6DBC6] p-5 sm:p-8 lg:p-10 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#E6DBC6]/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed className="w-4 h-4 text-[#b99750]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#b99750]">
                {t.visualsHeading}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--ace-ink)] tracking-tight">
              Real-World Food Usage for {product.name}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Tested across commercial QSR kitchens, cloud kitchens, catering setups, and motorcycle delivery routes.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FAF8F4] border border-[#E6DBC6] text-gray-700 shrink-0 self-start sm:self-auto">
            100% Food-Contact Safe (PP 05)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {foodApplications.map((app, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-[#E6DBC6] bg-[#FAF8F4] flex flex-col justify-between hover:border-[#b99750] hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    idx === 0
                      ? lockingFoodImage
                      : idx === 1
                      ? '/images/gallery/bento-meal.webp'
                      : idx === 2
                      ? '/images/gallery/kitchen-set.webp'
                      : '/images/gallery/studio-range.webp'
                  }
                  alt={app}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs font-bold leading-tight drop-shadow-xs">
                  {app}
                </span>
              </div>
              <div className="p-3 text-[11px] text-gray-600 flex items-center justify-between">
                <span>{product.capacity}</span>
                <span className="text-[#b99750] font-semibold">{t.snapSealBadge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CatalogueDownloadModal
        isOpen={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
        documentTitle={`${product.name} — Technical Datasheet`}
        downloadUrl="/downloads/datasheets/Ace_Packaging_Technical_Datasheet.pdf"
      />
    </>
  );
};
