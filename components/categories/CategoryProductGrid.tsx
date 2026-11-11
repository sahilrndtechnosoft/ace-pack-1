'use client';
import { useSiteText } from '@/components/layout/SiteTextProvider';

import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { type ProductItem } from '@/lib/data/products';
import { ProductCard } from '@/components/products/ProductCard';

interface CategoryProductGridProps {
  products: ProductItem[];
  categorySlug: string;
  basePath?: string;
  productSlugMap?: Record<string, string>;
}

export const CategoryProductGrid: React.FC<CategoryProductGridProps> = ({
  products,
  categorySlug,
  basePath,
  productSlugMap,
}) => {
  const L = useSiteText().labels;
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
                {L.finishesHint}
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
              <span>{L.finishesAll}</span>
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
          const currentVarietySlug =
            cardVarieties[item.id] ||
            (activeGlobalVariety !== 'all' ? activeGlobalVariety : undefined);

          return (
            <ProductCard
              key={item.id}
              product={item}
              categorySlug={categorySlug}
              basePath={basePath}
              productSlug={productSlugMap ? productSlugMap[item.id] : undefined}
              activeVarietySlug={currentVarietySlug}
              onVarietySelect={handleCardVarietySelect}
              delay={Math.min(idx % 3, 2) * 0.08}
            />
          );
        })}
      </div>
    </div>
  );
};
