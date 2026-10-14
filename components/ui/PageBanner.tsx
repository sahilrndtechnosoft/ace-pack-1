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
  badge = 'Ace Packaging',
  bgImage = '/50d728a7-e02c-49d9-b530-58a7db8a6ecc.png',
  breadcrumbs = [],
}) => {
  return (
    <div className="relative bg-[#111518] text-white py-14 sm:py-20 md:py-24 overflow-hidden border-b border-[#E6DBC6]/20">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover opacity-25 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90" />
      </div>

      <div className="container-custom relative z-10 text-left">
        {/* Breadcrumb Trail: sleek, compact inline-flex pill that hugs content */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumbs"
            className="inline-flex items-center flex-wrap gap-1.5 sm:gap-2 w-fit bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-medium mb-4 shadow-sm transition-colors"
          >
            <Link
              href="/"
              className="text-gray-300 hover:text-[#cfa144] flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#cfa144]" />
              <span>Home</span>
            </Link>

            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />
                  {isLast ? (
                    <span className="text-[#cfa144] font-semibold" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-300 hover:text-[#cfa144] transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Badge */}
        {badge && (
          <div>
            <span className="inline-block bg-[#cfa144] text-[#1A1D20] text-[11px] sm:text-xs font-extrabold px-3.5 py-1 rounded-full tracking-wider uppercase mb-3 shadow-sm">
              {badge}
            </span>
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
export default PageBanner;
