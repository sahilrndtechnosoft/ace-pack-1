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

  // Derive visuals
  const blankImage =
    product.blankImage ||
    (category.slug === 'hinge-cups' || category.slug === 'portion-cups'
      ? '/models/acepack/hinge-cup.webp'
      : category.slug === 'ro-series' || category.slug === 'round-containers'
      ? '/models/acepack/shallow-bowl.webp'
      : category.slug === 'deli-series'
      ? '/models/acepack/deli.webp'
      : category.slug === 'sweet-box' || category.slug === 'natraj-sweets'
      ? '/models/acepack/carton.webp'
      : '/models/acepack/clamshell.webp');

  const lockingFoodImage =
    product.lockingFoodImage ||
    (category.slug === 'hinge-cups' || category.slug === 'portion-cups'
      ? '/AcePackaging/ChatGPT Image Aug 26, 2026, 12_05_36 PM.png'
      : category.slug === 'ro-series' || category.slug === 'round-containers' || category.slug === 'deli-series'
      ? '/AcePackaging/ChatGPT Image Aug 26, 2026, 12_02_11 PM.png'
      : category.slug === 'sweet-box' || category.slug === 'natraj-sweets'
      ? '/images/gallery/sweet-box.webp'
      : '/AcePackaging/ChatGPT Image Aug 26, 2026, 12_02_15 PM.png');

  const foodApplications = product.applications && product.applications.length > 0
    ? product.applications
    : ['Cloud Kitchen Combos', 'Hot Gravy & Curry Delivery', 'Salads & Cold Meals', 'Microwave Reheating'];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 4-View Visual Studio */}
        <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          
          {/* View Selector Tabs (User requirement: Blank, Specs/Dimensions, Locking+Food, Video) */}
          <div className="bg-[#FAF8F4] p-1.5 rounded-2xl border border-[#E6DBC6] grid grid-cols-4 gap-1 text-[11px] font-bold">
            <button
              onClick={() => setActiveView('blank')}
              className={`py-2 px-1 rounded-xl transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                activeView === 'blank'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold'
                  : 'text-gray-600 hover:text-[var(--ace-ink)]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span className="truncate">1. Blank Container</span>
            </button>

            <button
              onClick={() => setActiveView('specs')}
              className={`py-2 px-1 rounded-xl transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                activeView === 'specs'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold'
                  : 'text-gray-600 hover:text-[var(--ace-ink)]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="truncate">2. Dimensions</span>
            </button>

            <button
              onClick={() => setActiveView('locking')}
              className={`py-2 px-1 rounded-xl transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                activeView === 'locking'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold'
                  : 'text-gray-600 hover:text-[var(--ace-ink)]'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span className="truncate">3. Food Locking</span>
            </button>

            <button
              onClick={() => setActiveView('video')}
              className={`py-2 px-1 rounded-xl transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                activeView === 'video'
                  ? 'bg-white text-[#b99750] shadow-sm border border-[#E6DBC6] font-extrabold'
                  : 'text-gray-600 hover:text-[var(--ace-ink)]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span className="truncate">4. Process Video</span>
            </button>
          </div>

          {/* Main Stage Display Area */}
          <div className="relative rounded-3xl border-2 border-[#E6DBC6] bg-white p-6 sm:p-8 flex items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-lg overflow-hidden group">
            
            {/* View 1: Blank / Empty Container (Clear view of shape and structure) */}
            {activeView === 'blank' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-full max-w-[380px] aspect-4/3 flex items-center justify-center">
                  <img
                    src={blankImage}
                    alt={`${product.name} Blank Empty Container Structure`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 px-4 py-2 rounded-full bg-[#FAF8F4] border border-[#E6DBC6] text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#b99750]" />
                  <span>Blank container view for inspecting geometry, ribs &amp; wall structure</span>
                </div>
              </div>
            )}

            {/* View 2: Dimensions & Specifications Blueprint */}
            {activeView === 'specs' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative">
                <div className="relative w-full max-w-[360px] aspect-4/3 flex items-center justify-center bg-[#FAF8F4] rounded-2xl border border-dashed border-[#b99750]/50 p-6">
                  <img
                    src={product.image}
                    alt={`${product.name} Dimensions`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md opacity-90"
                  />

                  {/* Dimension Overlay Callouts */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 border border-[#b99750] px-3 py-1 rounded-full text-[11px] font-bold text-[#b99750] shadow-xs">
                    Top: {product.dimensions?.top || '172mm Ø'}
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 border border-[#b99750] px-3 py-1 rounded-full text-[11px] font-bold text-[#b99750] shadow-xs">
                    Height: {product.dimensions?.height || '54mm'}
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 border border-[#b99750] px-3 py-1 rounded-full text-[11px] font-bold text-[#b99750] shadow-xs">
                    Wall: 0.68mm Precision Injection
                  </div>
                </div>

                <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">Volume</span>
                    <strong className="text-[var(--ace-ink)]">{product.capacity}</strong>
                  </div>
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">Material</span>
                    <strong className="text-[var(--ace-ink)]">PP 05 Virgin</strong>
                  </div>
                  <div className="bg-[#FAF8F4] border border-[#E6DBC6] p-2 rounded-xl">
                    <span className="text-gray-500 block text-[10px]">Carton Pack</span>
                    <strong className="text-[var(--ace-ink)]">{product.packaging ? product.packaging.split(' ')[0] : '500 Pcs'}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Locking System & Food Application Visual */}
            {activeView === 'locking' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-full max-w-[420px] aspect-4/3 rounded-2xl overflow-hidden shadow-sm border border-[#E6DBC6]">
                  <img
                    src={lockingFoodImage}
                    alt={`${product.name} Locking System with Food Application`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white text-left">
                      <span className="bg-[#b99750] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                        Zero-Leak Snap Rim
                      </span>
                      <p className="text-xs text-white/90 font-medium">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40">
                    <div className="w-14 h-14 rounded-full bg-[#b99750] text-white flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                    <h4 className="text-sm font-bold mb-1">Cleanroom Robotic Moulding</h4>
                    <p className="text-[11px] text-gray-200 max-w-xs">
                      High-speed 2.8s cycle time, zero-defect optical camera inspection, and dust-free conveyor handling in Daman.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quality badge in top right */}
            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-[#b99750] border border-[#E6DBC6] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              {product.capacity}
            </span>
          </div>

          {/* Quick thumbnail strip to toggle */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveView('blank')}
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-16 transition-all ${
                activeView === 'blank' ? 'border-[#b99750] ring-2 ring-[#b99750]/30' : 'border-[#E6DBC6]'
              }`}
            >
              <img src={blankImage} alt="Thumb blank" className="max-h-full max-w-full object-contain" />
            </button>
            <button
              onClick={() => setActiveView('specs')}
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-16 transition-all ${
                activeView === 'specs' ? 'border-[#b99750] ring-2 ring-[#b99750]/30' : 'border-[#E6DBC6]'
              }`}
            >
              <img src={product.image} alt="Thumb specs" className="max-h-full max-w-full object-contain" />
            </button>
            <button
              onClick={() => setActiveView('locking')}
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-16 transition-all overflow-hidden ${
                activeView === 'locking' ? 'border-[#b99750] ring-2 ring-[#b99750]/30' : 'border-[#E6DBC6]'
              }`}
            >
              <img src={lockingFoodImage} alt="Thumb food" className="w-full h-full object-cover" />
            </button>
            <button
              onClick={() => setActiveView('video')}
              className={`p-1.5 rounded-xl border bg-white flex items-center justify-center h-16 transition-all ${
                activeView === 'video' ? 'border-[#b99750] ring-2 ring-[#b99750]/30' : 'border-[#E6DBC6]'
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
                        <td className="p-3 font-bold text-gray-600">Dimensions (Top x Height)</td>
                        <td className="p-3 font-bold text-[var(--ace-ink)]">
                          {product.dimensions.top} (Top) × {product.dimensions.height} (Height)
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#b99750]/50 shadow-md">
            <h3 className="text-xl font-bold text-[var(--ace-ink)] mb-1">
              Request Samples for {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Fill in your business details to receive physical samples for kitchen and delivery testing.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Company / Brand *</label>
                  <input
                    type="text"
                    placeholder="Ace Cloud Kitchens"
                    required
                    className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    required
                    className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    required
                    className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl px-4 py-3 text-xs text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">Requirement Notes</label>
                <textarea
                  rows={3}
                  placeholder={`Please specify requirements or delivery destination for ${product.name} (${product.capacity})...`}
                  required
                  className="w-full bg-[#FAF8F4] border border-[#E6DBC6] rounded-xl p-4 text-xs text-[var(--ace-ink)] focus:outline-none focus:border-[#b99750]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#b99750] hover:bg-[#a6843e] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#b99750]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Sample Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-[#b99750]" /> Confidential factory-direct dispatch
              </p>
            </form>
          </div>

        </div>
      </div>

      <CatalogueDownloadModal
        isOpen={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
      />
    </>
  );
};
