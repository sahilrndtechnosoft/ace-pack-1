import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

interface Breadcrumb {
  name: string;
  href: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  bgImage?: string;
  breadcrumbs?: Breadcrumb[];
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  badge = 'ACEPACK PACKAGING',
  bgImage = '/50d728a7-e02c-49d9-b530-58a7db8a6ecc.png',
  breadcrumbs = [],
}) => {
  return (
    <div className="relative bg-[#111518] text-white py-16 md:py-24 overflow-hidden border-b border-[#E6DBC6]/30">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover opacity-35 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
      </div>

      <div className="container-custom relative z-10 text-left">
        {/* Badge */}
        {badge && (
          <span className="inline-block bg-[#cfa144] text-[#1A1D20] text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider mb-4 shadow">
            {badge}
          </span>
        )}

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mb-6 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Formal Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 sm:gap-2 max-w-full bg-black/60 backdrop-blur-md px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl sm:rounded-full border border-white/20 text-[11px] sm:text-xs font-semibold">
          <Link href="/" className="text-gray-300 hover:text-[#cfa144] flex items-center gap-1 transition-colors shrink-0">
            <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#cfa144]" />
            <span>Home</span>
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 shrink-0" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-[#cfa144] font-bold truncate max-w-[140px] sm:max-w-[200px]">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="text-gray-300 hover:text-[#cfa144] transition-colors truncate max-w-[100px] sm:max-w-none shrink-0">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};
