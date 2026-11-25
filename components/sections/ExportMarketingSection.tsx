'use client';

import { homeExport } from '@/lib/cms/pages/home';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe2, ArrowRight, Anchor } from 'lucide-react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';

// /images/home/world-dots.svg was drawn from Natural Earth 110m land in an equirectangular
// projection cropped to 76°N–56°S; pins must use the same bounds to line up.
const MAP_LAT_MAX = 76;
const MAP_LAT_MIN = -56;
const MAP_WIDTH = 1000;
const MAP_HEIGHT = (MAP_WIDTH * (MAP_LAT_MAX - MAP_LAT_MIN)) / 360;

type LabelSide = 'left' | 'right' | 'top' | 'bottom';

const LABEL_POSITION: Record<LabelSide, string> = {
  left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  top: 'bottom-full mb-1.5 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-1.5 left-1/2 -translate-x-1/2',
};

interface MapPoint {
  name: string;
  lat: number;
  lon: number;
  // Which side of the pin the label sits on, so neighbouring labels don't collide.
  labelSide: LabelSide;
}

const ORIGIN = { name: 'Daman, India', lat: 20.4, lon: 72.83 };

// Markets named in the export copy (routes text + regions). Edit here to add or move a pin.
const EXPORT_MARKETS: MapPoint[] = [
  { name: 'United States', lat: 40.7, lon: -74.0, labelSide: 'bottom' },
  { name: 'Canada', lat: 43.7, lon: -79.4, labelSide: 'top' },
  { name: 'United Kingdom', lat: 51.5, lon: -0.1, labelSide: 'top' },
  { name: 'France', lat: 48.9, lon: 2.35, labelSide: 'left' },
  { name: 'Germany', lat: 52.5, lon: 13.4, labelSide: 'right' },
  { name: 'Saudi Arabia', lat: 24.7, lon: 46.7, labelSide: 'left' },
  { name: 'UAE', lat: 25.2, lon: 55.3, labelSide: 'top' },
  { name: 'Oman', lat: 23.6, lon: 58.4, labelSide: 'bottom' },
  { name: 'Australia', lat: -33.9, lon: 151.2, labelSide: 'left' },
  { name: 'New Zealand', lat: -36.8, lon: 174.8, labelSide: 'bottom' },
];

// Rounded so the server and every browser engine print identical SVG paths (no hydration mismatch).
const round1 = (n: number) => Math.round(n * 10) / 10;

const project = ({ lat, lon }: Pick<MapPoint, 'lat' | 'lon'>) => ({
  x: round1(((lon + 180) / 360) * MAP_WIDTH),
  y: round1(((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * MAP_HEIGHT),
});

// A shipping arc from the plant to a market, bowed upward in proportion to its length.
const arcPath = (to: MapPoint) => {
  const a = project(ORIGIN);
  const b = project(to);
  const lift = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) * 0.32;
  return `M${a.x} ${a.y} Q${round1((a.x + b.x) / 2)} ${round1(Math.min(a.y, b.y) - lift)} ${b.x} ${b.y}`;
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

export const ExportMarketingSection: React.FC<{ content?: typeof homeExport }> = ({ content: c = homeExport }) => {
  const origin = project(ORIGIN);

  return (
    <section id="export-shipping" className="relative py-20 bg-white text-[var(--ace-ink)] border-b border-[#E6DBC6]/50 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 w-[450px] h-[450px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.1)_0%,transparent_70%)]"
      />

      <Container className="relative z-10">
        <Reveal type="fade-up">
          <div className="max-w-3xl text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b99750]/15 border border-[#b99750]/30 text-[#b99750] text-xs font-bold uppercase tracking-wider mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{c.badge}</span>
            </div>
            <SplitHeading>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[var(--ace-ink)] tracking-tight leading-snug sm:leading-tight">
                {c.heading}
              </h2>
            </SplitHeading>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">{c.description}</p>
          </div>
        </Reveal>

        {/* Global export map */}
        <Reveal type="fade-up">
          <div className="relative rounded-[28px] overflow-hidden bg-[#14171A] text-white shadow-[0_40px_80px_-30px_rgba(20,23,26,0.55)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_65%_40%,rgba(201,167,95,0.18)_0%,transparent_60%)]" />

            <div className="relative grid xl:grid-cols-12">
              <div className="xl:col-span-4 p-6 sm:p-10 xl:pr-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D6BC83] uppercase tracking-wider mb-3">
                  <Anchor className="w-4 h-4" />
                  <span>{c.routesLabel}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">{c.routesHeading}</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-6">{c.routesText}</p>
                <ul className="flex flex-wrap gap-2 mb-8">
                  {c.regions.map((region) => (
                    <li key={region} className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs font-semibold text-white/85">
                      {region}
                    </li>
                  ))}
                </ul>
                <Link
                  href={c.button.link}
                  className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b99750] hover:bg-[#a6843e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#b99750]/25 transition-colors"
                >
                  <span>{c.button.text}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="xl:col-span-8 px-3 pb-6 sm:px-10 xl:px-6 xl:py-10 xl:pr-8">
                <figure className="relative w-full" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
                  <img src="/images/home/world-dots.svg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full opacity-40" />

                  <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
                    {EXPORT_MARKETS.map((market, i) => (
                      <motion.path
                        key={market.name}
                        d={arcPath(market)}
                        fill="none"
                        stroke="#D6BC83"
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.85 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1.4, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ))}
                  </svg>

                  {/* Pins are HTML so labels stay crisp at any size. */}
                  {EXPORT_MARKETS.map((market, i) => {
                    const p = project(market);
                    return (
                      <motion.div
                        key={market.name}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: pct(p.x, MAP_WIDTH), top: pct(p.y, MAP_HEIGHT) }}
                        initial={{ opacity: 0, scale: 0.4 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: 1 + i * 0.08 }}
                      >
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#D6BC83] ring-4 ring-[#D6BC83]/25" />
                        <span className={`hidden sm:block absolute whitespace-nowrap text-[10px] lg:text-[11px] font-semibold text-white/85 ${LABEL_POSITION[market.labelSide]}`}>
                          {market.name}
                        </span>
                      </motion.div>
                    );
                  })}

                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: pct(origin.x, MAP_WIDTH), top: pct(origin.y, MAP_HEIGHT) }}
                  >
                    <span className="absolute inset-0 rounded-full bg-[#b99750] animate-ping opacity-60" />
                    <span className="relative block w-4 h-4 rounded-full bg-[#b99750] border-2 border-white shadow-[0_0_0_6px_rgba(185,151,80,0.25)]" />
                    {/* Below the pin on phones, where a right-hand label would run off the card. */}
                    <span className={`absolute max-sm:top-full max-sm:mt-2.5 max-sm:left-1/2 max-sm:-translate-x-1/2 sm:left-full sm:ml-2.5 sm:top-1/2 sm:-translate-y-1/2 whitespace-nowrap rounded-full bg-white text-[#14171A] px-2.5 py-1 text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wider shadow`}>
                      {ORIGIN.name}
                    </span>
                  </div>

                  <figcaption className="sr-only">
                    Export map: shipments from {ORIGIN.name} to {EXPORT_MARKETS.map((m) => m.name).join(', ')}.
                  </figcaption>
                </figure>

                {/* Phones: labels are hidden on the map, so list the markets instead. */}
                <ul className="sm:hidden mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
                  {EXPORT_MARKETS.map((market) => (
                    <li key={market.name} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/80">
                      {market.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Export process steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {c.steps.map((step, idx) => (
            <Reveal key={step.number} type="fade-up" delay={idx * 0.08}>
              <div className="h-full bg-[#FAF8F4] rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 group text-left">
                <span className="text-3xl font-extrabold text-[#b99750] font-serif block mb-3">{step.number}</span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--ace-ink)] mb-2.5 group-hover:text-[#b99750] transition-colors leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
