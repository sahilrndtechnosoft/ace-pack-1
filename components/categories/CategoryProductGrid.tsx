'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Palette } from 'lucide-react';
import { type ProductItem } from '@/lib/data/products';
import { Reveal } from '@/components/ui/Reveal';

interface CategoryProductGridProps {
  products: ProductItem[];
  categorySlug: string;
}

export const CategoryProductGrid: React.FC<CategoryProductGridProps> = ({
  products,
  categorySlug,
}) => {
  // Collect all unique varieties across products in this category
  const allVarietiesMap = new Map<string, { name: string; slug: string; colorHex: string; borderHex?: string }>();
  products.forEach((p) => {
    p.varieties?.forEach((v) => {
      if (!allVarietiesMap.has(v.slug)) {
        allVarietiesMap.set(v.slug, {
          name: v.name,
          slug: v.slug,
          colorHex: v.colorHex,
          borderHex: v.borderHex,
        });
      }
    });
  });

  const availableVarieties = Array.from(allVarietiesMap.values());
  const hasVarieties = availableVarieties.length > 0;

  // Global variety filter / selector
  const [activeGlobalVariety, setActiveGlobalVariety] = useState<string>('all');
  // Per-card override state: productId -> varietySlug
  const [cardVarieties, setCardVarieties] = useState<Record<string, string>>({});

  const handleGlobalVarietyChange = (slug: string) => {
    setActiveGlobalVariety(slug);
    const updated: Record<string, string> = {};
    if (slug !== 'all') {
      products.forEach((p) => {
        const matching = p.varieties?.find((v) => v.slug === slug);
        if (matching) {
          updated[p.id] = slug;
        }
      });
    }
    setCardVarieties(updated);
  };

  const handleCardVarietySelect = (productId: string, varietySlug: string) => {
    setCardVarieties((prev) => ({
      ...prev,
      [productId]: varietySlug,
    }));
  };

  return (
    <div>
      {/* Variety Filter / Quick Selector bar (if category has color varieties) */}
      {hasVarieties && (
        <div className="mb-8 p-4 sm:p-5 bg-white rounded-2xl border border-[#E6DBC6] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6] flex items-center justify-center text-[#b99750] shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--ace-ink)] block">
                Color &amp; Finish Varieties ({availableVarieties.length})
              </span>
              <span className="text-[11px] text-gray-500">
                Click a color swatch to preview models in that finish
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleGlobalVarietyChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeGlobalVariety === 'all'
                  ? 'bg-[#b99750] text-white shadow-xs'
                  : 'bg-[#FAF8F4] text-gray-700 hover:bg-[#F3EFE6] border border-[#E6DBC6]'
              }`}
            >
              <span>All Finishes</span>
            </button>

            {availableVarieties.map((v) => {
              const isActive = activeGlobalVariety === v.slug;
              return (
                <button
                  key={v.slug}
                  type="button"
                  onClick={() => handleGlobalVarietyChange(v.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[var(--ace-ink)] text-white shadow-xs ring-2 ring-[#b99750]'
                      : 'bg-[#FAF8F4] text-gray-700 hover:bg-[#F3EFE6] border border-[#E6DBC6]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border shrink-0 shadow-2xs"
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
        </div>
      )}

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {products.map((item, idx) => {
          // Determine active variety for this card
          const currentVarietySlug =
            cardVarieties[item.id] ||
            (activeGlobalVariety !== 'all' ? activeGlobalVariety : item.varieties?.[0]?.slug);

          const activeVarietyObj = item.varieties?.find((v) => v.slug === currentVarietySlug);
          const activeImage = activeVarietyObj?.image || item.image;

          return (
            <Reveal key={item.id} type="fade-up" delay={Math.min(idx % 3, 2) * 0.08}>
              <div className="bg-white rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full">
                <div>
                  {/* Clean Light Image Surface */}
                  <div className="relative h-56 sm:h-64 bg-gradient-to-b from-white to-[#F7F4EC] p-4 sm:p-6 flex items-center justify-center border-b border-[#E6DBC6]/60">
                    <img
                      key={activeImage}
                      src={activeImage}
                      alt={`${item.name} ${activeVarietyObj ? `- ${activeVarietyObj.name}` : ''}`}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_8px_18px_rgba(0,0,0,0.1)]"
                    />

                    {/* Capacity badge */}
                    <span className="absolute top-3 right-3 bg-[#b99750] text-white text-[11px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {item.capacity}
                    </span>

                    {/* Material or active variety badge */}
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[var(--ace-ink)] border border-[#E6DBC6] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                      {activeVarietyObj ? activeVarietyObj.name : 'Virgin PP 05'}
                    </span>

                    {/* Interactive Variety Swatches Floating in Bottom Left of image */}
                    {item.varieties && item.varieties.length > 0 && (
                      <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md border border-[#E6DBC6] rounded-full px-2 py-1 flex items-center gap-1.5 shadow-xs z-10">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mr-0.5 hidden xs:inline">
                          Finish:
                        </span>
                        {item.varieties.map((v) => {
                          const isSelected = (currentVarietySlug || item.varieties![0].slug) === v.slug;
                          return (
                            <button
                              key={v.slug}
                              type="button"
                              title={`${v.name} Finish`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCardVarietySelect(item.id, v.slug);
                              }}
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'ring-2 ring-[#b99750] scale-110 shadow-xs'
                                  : 'hover:scale-105 opacity-80 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: v.colorHex,
                                border: `1.5px solid ${v.borderHex || '#cbd5e1'}`,
                              }}
                            >
                              {isSelected && (
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    v.slug === 'black' ? 'bg-white' : 'bg-gray-800'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--ace-ink)] group-hover:text-[#b99750] transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    {/* Compact Specs Grid */}
                    <div className="bg-[#FAF8F4] rounded-2xl border border-[#E6DBC6] p-3.5 sm:p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Capacity:</span>
                        <span className="font-bold text-[#b99750]">{item.capacity}</span>
                      </div>

                      {item.dimensions && (
                        <div className="flex items-start justify-between border-t border-[#E6DBC6]/60 pt-2 gap-2">
                          <span className="text-gray-500 font-medium shrink-0">Dimensions:</span>
                          <span className="font-semibold text-[var(--ace-ink)] text-right break-words text-[11px] sm:text-xs">
                            {item.dimensions.bottom
                              ? `${item.dimensions.top} × ${item.dimensions.bottom} × ${item.dimensions.height}`
                              : `${item.dimensions.top} × ${item.dimensions.height}`}
                          </span>
                        </div>
                      )}

                      {item.varieties && item.varieties.length > 0 && (
                        <div className="flex items-center justify-between border-t border-[#E6DBC6]/60 pt-2">
                          <span className="text-gray-500 font-medium">Varieties:</span>
                          <span className="font-semibold text-[var(--ace-ink)] text-[11px]">
                            {item.varieties.map((v) => v.name.replace(/^(Clear|Deep|Crisp)\s+/, '')).join(' · ')}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-[#E6DBC6]/60 pt-2">
                        <span className="text-gray-500 font-medium">Thermal Range:</span>
                        <span className="font-semibold text-emerald-600">-20°C to +120°C</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#E6DBC6]/60 pt-2">
                        <span className="text-gray-500 font-medium">Case Pack:</span>
                        <span className="font-semibold text-[var(--ace-ink)]">
                          {item.packaging || '500 Pcs/set'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Clear Action Button */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1">
                  <Link
                    href={`/categories/${categorySlug}/${item.product_slug}${
                      currentVarietySlug ? `?variety=${currentVarietySlug}` : ''
                    }`}
                    className="w-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold py-3 sm:py-3.5 rounded-xl text-center uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-[#b99750]/20"
                  >
                    <span>View Specifications &amp; 4-View Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
