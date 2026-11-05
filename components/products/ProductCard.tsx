'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { type ProductItem } from '@/lib/data/products';
import { Reveal } from '@/components/ui/Reveal';

export interface ProductCardProps {
  product: ProductItem;
  categorySlug: string;
  activeVarietySlug?: string;
  onVarietySelect?: (productId: string, varietySlug: string) => void;
  delay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categorySlug,
  activeVarietySlug,
  onVarietySelect,
  delay = 0,
}) => {
  const [localVarietySlug, setLocalVarietySlug] = useState<string>(
    product.varieties?.[0]?.slug || ''
  );

  const currentVarietySlug =
    activeVarietySlug !== undefined ? activeVarietySlug : localVarietySlug;
  const activeVarietyObj = product.varieties?.find((v) => v.slug === currentVarietySlug);
  const activeImage = activeVarietyObj?.image || product.image;

  const handleCardVarietySelect = (varietySlug: string) => {
    setLocalVarietySlug(varietySlug);
    if (onVarietySelect) {
      onVarietySelect(product.id, varietySlug);
    }
  };

  return (
    <Reveal type="fade-up" delay={delay}>
      <div className="bg-white rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full">
        <div>
          {/* Clean Light Image Surface */}
          <div className="relative h-56 sm:h-64 bg-gradient-to-b from-white to-[#F7F4EC] overflow-hidden flex items-center justify-center border-b border-[#E6DBC6]/60">
            <img
              key={activeImage}
              src={activeImage}
              alt={`${product.name} ${activeVarietyObj ? `- ${activeVarietyObj.name}` : ''}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Capacity badge */}
            <span className="absolute top-3 right-3 bg-[#b99750] text-white text-[11px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              {product.capacity}
            </span>

            {/* Material or active variety badge */}
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[var(--ace-ink)] border border-[#E6DBC6] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
              {activeVarietyObj ? activeVarietyObj.name : (product.material || 'Virgin PP 05')}
            </span>

            {/* Interactive Variety Swatches Floating in Bottom Left of image */}
            {product.varieties && product.varieties.length > 0 && (
              <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md border border-[#E6DBC6] rounded-full px-2 py-1 flex items-center gap-1.5 shadow-xs z-10">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mr-0.5 hidden xs:inline">
                  Finish:
                </span>
                {product.varieties.map((v) => {
                  const isSelected = (currentVarietySlug || product.varieties![0].slug) === v.slug;
                  return (
                    <button
                      key={v.slug}
                      type="button"
                      title={`${v.name} Finish`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCardVarietySelect(v.slug);
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
                {product.name}
              </h3>
            </div>

            {/* Compact Specs Grid */}
            <div className="bg-[#FAF8F4] rounded-2xl border border-[#E6DBC6] p-3.5 sm:p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Capacity:</span>
                <span className="font-bold text-[#b99750]">{product.capacity}</span>
              </div>

              {product.dimensions && (
                <div className="flex items-start justify-between border-t border-[#E6DBC6]/60 pt-2 gap-2">
                  <span className="text-gray-500 font-medium shrink-0">Dimensions:</span>
                  <span className="font-semibold text-[var(--ace-ink)] text-right break-words text-[11px] sm:text-xs">
                    {product.dimensions.bottom
                      ? `${product.dimensions.top} × ${product.dimensions.bottom} × ${product.dimensions.height}`
                      : `${product.dimensions.top} × ${product.dimensions.height}`}
                  </span>
                </div>
              )}

              {product.varieties && product.varieties.length > 0 && (
                <div className="flex items-center justify-between border-t border-[#E6DBC6]/60 pt-2">
                  <span className="text-gray-500 font-medium">Varieties:</span>
                  <span className="font-semibold text-[var(--ace-ink)] text-[11px]">
                    {product.varieties.map((v) => v.name.replace(/^(Clear|Deep|Crisp)\s+/, '')).join(' · ')}
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
                  {product.packaging || '500 Pcs/set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Single Clear Action Button */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1">
          <Link
            href={`/categories/${categorySlug}/${product.product_slug}${
              currentVarietySlug ? `?variety=${currentVarietySlug}` : ''
            }`}
            className="w-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs font-bold px-3 py-3 sm:py-3.5 rounded-xl text-center uppercase tracking-wide sm:tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-[#b99750]/20"
          >
            <span>View Specifications &amp; 4-View Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
};
