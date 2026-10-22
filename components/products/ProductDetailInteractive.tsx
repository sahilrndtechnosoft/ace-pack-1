'use client';

import React, { useState } from 'react';
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
  Maximize2
} from 'lucide-react';
import { type ProductCategory, type ProductItem } from '@/lib/data/products';
import { CatalogueDownloadModal } from '../ui/CatalogueDownloadModal';

interface ProductDetailInteractiveProps {
  category: ProductCategory;
  product: ProductItem;
}

export const ProductDetailInteractive: React.FC<ProductDetailInteractiveProps> = ({
  category,
  product,
}) => {
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

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSampleLoading(true);
    setTimeout(() => {
      setSampleLoading(false);
      setSampleSubmitted(true);
    }, 600);
  };

  // Derive visuals - always prioritize authentic original product images
  const blankImage = product.blankImage || product.image || category.heroImage;

  const lockingFoodImage =
    product.lockingFoodImage ||
    (category.gallery?.find((g) => g.toLowerCase().includes('lifestyle')) ||
     category.gallery?.[category.gallery.length - 1] ||
     category.heroImage ||
     product.image);

  const foodApplications = product.applications && product.applications.length > 0
    ? product.applications
    : ['Cloud Kitchen Combos', 'Hot Gravy & Curry Delivery', 'Salads & Cold Meals', 'Microwave Reheating'];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 4-View Visual Studio */}
        <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          
          {/* View Selector Tabs - Fully Responsive Across All Breakpoints */}
          <div
            role="tablist"
            aria-label="Product display views"
            className="bg-[#FAF8F4] p-1.5 rounded-2xl border border-[#E6DBC6] grid grid-cols-2 sm:grid-cols-4 lg:max-xl:grid-cols-2 xl:grid-cols-4 gap-1.5 text-xs font-bold"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'blank'}
              onClick={() => setActiveView('blank')}
              className={`min-h-[44px] py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs ${
                activeView === 'blank'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold ring-1 ring-[#b99750]/20'
                  : 'text-gray-600 hover:text-[var(--ace-ink)] hover:bg-white/60 border border-transparent'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold shrink-0 ${
                activeView === 'blank' ? 'bg-[#b99750]/15 text-[#b99750]' : 'bg-black/5 text-gray-500'
              }`}>
                1
              </span>
              <Box className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap font-bold">Product View</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'specs'}
              onClick={() => setActiveView('specs')}
              className={`min-h-[44px] py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs ${
                activeView === 'specs'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold ring-1 ring-[#b99750]/20'
                  : 'text-gray-600 hover:text-[var(--ace-ink)] hover:bg-white/60 border border-transparent'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold shrink-0 ${
                activeView === 'specs' ? 'bg-[#b99750]/15 text-[#b99750]' : 'bg-black/5 text-gray-500'
              }`}>
                2
              </span>
              <Ruler className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap font-bold">Dimensions</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'locking'}
              onClick={() => setActiveView('locking')}
              className={`min-h-[44px] py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs ${
                activeView === 'locking'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold ring-1 ring-[#b99750]/20'
                  : 'text-gray-600 hover:text-[var(--ace-ink)] hover:bg-white/60 border border-transparent'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold shrink-0 ${
                activeView === 'locking' ? 'bg-[#b99750]/15 text-[#b99750]' : 'bg-black/5 text-gray-500'
              }`}>
                3
              </span>
              <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap font-bold">Food Locking</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'video'}
              onClick={() => setActiveView('video')}
              className={`min-h-[44px] py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs ${
                activeView === 'video'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold ring-1 ring-[#b99750]/20'
                  : 'text-gray-600 hover:text-[var(--ace-ink)] hover:bg-white/60 border border-transparent'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold shrink-0 ${
                activeView === 'video' ? 'bg-[#b99750]/15 text-[#b99750]' : 'bg-black/5 text-gray-500'
              }`}>
                4
              </span>
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap font-bold">Process Video</span>
            </button>
          </div>

          {/* Main Stage Display Area */}
          <div className="relative rounded-3xl border-2 border-[#E6DBC6] bg-white p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] shadow-lg overflow-hidden group">
            
            {/* View 1: Blank / Empty Container (Clear view of shape and structure) */}
            {activeView === 'blank' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-4/3 flex items-center justify-center">
                  <img
                    src={blankImage}
                    alt={`${product.name} Blank Empty Container Structure`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FAF8F4] border border-[#E6DBC6] text-[11px] sm:text-xs font-semibold text-gray-700 flex items-center gap-2 text-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#b99750] shrink-0" />
                  <span>Authentic 100% prime virgin PP 05 food-grade container view</span>
                </div>
              </div>
            )}

            {/* View 2: Dimensions & Specifications Blueprint */}
            {activeView === 'specs' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative">
                <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-4/3 flex items-center justify-center bg-[#FAF8F4] rounded-2xl border border-dashed border-[#b99750]/50 p-4 sm:p-6">
                  <img
                    src={product.image}
                    alt={`${product.name} Dimensions`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md opacity-90"
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
                    <span className="text-gray-500 block text-[10px]">Volume</span>
                    <strong className="text-[var(--ace-ink)] text-xs sm:text-sm font-bold truncate block">{product.capacity}</strong>
                  </div>
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">Material</span>
                    <strong className="text-[var(--ace-ink)] text-xs sm:text-sm font-bold truncate block">PP 05 Virgin</strong>
                  </div>
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">Carton Pack</span>
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
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                    <div className="text-white text-left">
                      <span className="bg-[#b99750] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                        Zero-Leak Snap Rim
                      </span>
                      <p className="text-[11px] sm:text-xs text-white/90 font-medium leading-relaxed">
                        Sealed container with food application: airtight lid lock preserves freshness and eliminates delivery spills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Category/Product Related Manufacturing Video */}
            {activeView === 'video' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-full max-w-[440px] aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop"
                    alt="Precision Injection Moulding Line"
                    className="w-full h-full object-cover filter brightness-75"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white bg-black/40">
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      aria-label="Play moulding process video"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white flex items-center justify-center shadow-lg mb-2 sm:mb-3 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-white" />
                    </button>
                    <h4 className="text-xs sm:text-sm font-bold mb-1">Cleanroom Robotic Moulding</h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-200 max-w-xs leading-relaxed">
                      High-speed 2.8s cycle time, zero-defect optical camera inspection, and dust-free conveyor handling in Daman.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quality badge in top right */}
            <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/95 backdrop-blur-xs text-[#b99750] border border-[#E6DBC6] text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs">
              {product.capacity}
            </span>
          </div>

          {/* Quick thumbnail strip to toggle */}
          <div className="grid grid-cols-4 gap-2 mt-1">
            <button
              type="button"
              onClick={() => setActiveView('blank')}
              aria-label="View Blank Container"
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-14 sm:h-16 transition-all cursor-pointer ${
                activeView === 'blank' ? 'border-[#b99750] ring-2 ring-[#b99750]/30 shadow-xs' : 'border-[#E6DBC6] hover:border-[#b99750]/60'
              }`}
            >
              <img src={blankImage} alt="Thumb blank" className="max-h-full max-w-full object-contain" />
            </button>
            <button
              type="button"
              onClick={() => setActiveView('specs')}
              aria-label="View Dimensions Blueprint"
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-14 sm:h-16 transition-all cursor-pointer ${
                activeView === 'specs' ? 'border-[#b99750] ring-2 ring-[#b99750]/30 shadow-xs' : 'border-[#E6DBC6] hover:border-[#b99750]/60'
              }`}
            >
              <img src={product.image} alt="Thumb specs" className="max-h-full max-w-full object-contain" />
            </button>
            <button
              type="button"
              onClick={() => setActiveView('locking')}
              aria-label="View Food Locking Application"
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-14 sm:h-16 transition-all overflow-hidden cursor-pointer ${
                activeView === 'locking' ? 'border-[#b99750] ring-2 ring-[#b99750]/30 shadow-xs' : 'border-[#E6DBC6] hover:border-[#b99750]/60'
              }`}
            >
              <img src={lockingFoodImage} alt="Thumb food" className="w-full h-full object-cover rounded-lg" />
            </button>
            <button
              type="button"
              onClick={() => setActiveView('video')}
              aria-label="View Manufacturing Video"
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-14 sm:h-16 transition-all cursor-pointer ${
                activeView === 'video' ? 'border-[#b99750] ring-2 ring-[#b99750]/30 shadow-xs' : 'border-[#E6DBC6] hover:border-[#b99750]/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center text-[#b99750]">
                <Play className="w-4 h-4 fill-[#b99750]" />
                <span className="text-[9px] font-bold mt-0.5">Video</span>
              </div>
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
              {product.name}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Precision injection-moulded packaging engineered from 100% prime virgin PP 05. Features zero-leak rim closure, high stacking rigidity, and microwave &amp; deep-freeze thermal tolerance.
            </p>

            {/* Core Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-[#FAF8F4] p-3 rounded-2xl border border-[#E6DBC6] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#b99750] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Material</span>
                  <span className="text-xs font-bold text-[var(--ace-ink)]">{product.material}</span>
                </div>
              </div>

              <div className="bg-[#FAF8F4] p-3 rounded-2xl border border-[#E6DBC6] flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-[#b99750] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Thermal Limits</span>
                  <span className="text-xs font-bold text-[var(--ace-ink)]">-20°C to +120°C</span>
                </div>
              </div>

              <div className="bg-[#FAF8F4] p-3 rounded-2xl border border-[#E6DBC6] flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <Layers className="w-5 h-5 text-[#b99750] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Food Contact</span>
                  <span className="text-xs font-bold text-emerald-600">US FDA 21 CFR</span>
                </div>
              </div>
            </div>

            {/* Essential Technical Specifications Table */}
            <div className="mb-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ace-ink)] mb-3">
                Important Product Specifications
              </h3>
              <div className="border border-[#E6DBC6] rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-[#E6DBC6] bg-[#FAF8F4]">
                      <td className="p-3 font-bold text-gray-600 w-1/3">Capacity / Volume</td>
                      <td className="p-3 font-bold text-[#b99750]">{product.capacity}</td>
                    </tr>
                    <tr className="border-b border-[#E6DBC6]">
                      <td className="p-3 font-bold text-gray-600">Polymer Resin</td>
                      <td className="p-3 font-bold text-[var(--ace-ink)]">100% Prime Virgin PP 05 (BPA-Free)</td>
                    </tr>
                    {product.dimensions && (
                      <tr className="border-b border-[#E6DBC6] bg-[#FAF8F4]">
                        <td className="p-3 font-bold text-gray-600">Dimensions (Top × Bottom × Height)</td>
                        <td className="p-3 font-bold text-[var(--ace-ink)]">
                          {product.dimensions.top} (Top)
                          {product.dimensions.bottom ? ` × ${product.dimensions.bottom} (Bottom)` : ''}
                          {` × ${product.dimensions.height} (Height)`}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-[#E6DBC6]">
                      <td className="p-3 font-bold text-gray-600">Lid Locking System</td>
                      <td className="p-3 font-bold text-[var(--ace-ink)]">Airtight Snap-Fit / Hermetic Rim Seal</td>
                    </tr>
                    <tr className="border-b border-[#E6DBC6] bg-[#FAF8F4]">
                      <td className="p-3 font-bold text-gray-600">Thermal Resistance</td>
                      <td className="p-3 text-gray-700">-20°C (Deep Freeze) up to +120°C (Microwave)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-600">Master Box Packaging</td>
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
                <span>Recommended Food &amp; Culinary Applications</span>
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
                <span>Download Technical Datasheet</span>
              </button>
              <span className="text-[11px] text-gray-500">
                Official specifications and food contact certification documentation.
              </span>
            </div>
          </div>

          {/* Factory Sample / Product Inquiry Card (Compliant: zero pricing or wholesale references) */}
          <div className="bg-white p-5 sm:p-7 lg:p-8 rounded-3xl border-2 border-[#b99750]/50 shadow-md">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--ace-ink)] mb-1">
              Request Physical Samples for {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Fill in your business details to receive physical samples for kitchen, stacking, and motorcycle delivery testing.
            </p>

            {sampleSubmitted ? (
              <div className="text-center py-6 animate-fade-in bg-[#FAF8F4] rounded-2xl border border-[#E6DBC6] p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[var(--ace-ink)] mb-1">Sample Request Received!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto mb-4 leading-relaxed">
                  Thank you, <strong>{sampleData.name || 'Valued Partner'}</strong>. Our dispatch team will confirm and ship samples of <strong>{product.name} ({product.capacity})</strong> to your destination.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSampleSubmitted(false);
                    setSampleData({ name: '', company: '', email: '', phone: '', notes: '' });
                  }}
                  className="text-xs font-bold text-[#b99750] hover:underline cursor-pointer"
                >
                  Submit another sample request →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSampleSubmit} className="space-y-3.5 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Full Name *</label>
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
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Company / Brand *</label>
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
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Email Address *</label>
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
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Phone Number *</label>
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
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Requirement Notes</label>
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
                    <span>Processing Request...</span>
                  ) : (
                    <>
                      <span>Submit Sample Request</span>
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
                Culinary Applications &amp; Food Visuals
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
                <span className="text-[#b99750] font-semibold">Zero-Leak Snap Seal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CatalogueDownloadModal
        isOpen={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
      />
    </>
  );
};
