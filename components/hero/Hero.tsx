'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic'; // only needed by the commented-out ProductModel3D below
import Link from 'next/link';
import { Orbitron } from 'next/font/google';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroWaves } from './HeroWaves';

// Three.js/WebGL — client-only, never rendered on the server.
// Commented out for now in favor of the flat product-image treatment (same as
// banner 2) — re-enable by uncommenting this and the productModel field/branch
// below if the 3D viewer is needed again.
// const ProductModel3D = dynamic(() => import('../ui/ProductModel3D').then((m) => m.ProductModel3D), {
//   ssr: false,
// });

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700', '800', '900'] });

const AUTO_ADVANCE_MS = 7500;
const PUSH_DURATION = 0.7;
const PUSH_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// `background` = full-bleed banner background artwork (gradient / graphic).
// `product`    = transparent front-of-banner product cutout, centered over the background.
// `decoration` = optional per-slide background treatment; only 'waves' exists
// today, but the field exists so a future slide can opt out (e.g. 'none')
// without touching the component.
// Drop new asset URLs in here once ready — layout already expects both.
const heroSlides = [
  {
    background: '/images/hero-gold-wave-bg.webp',
    product: '/images/hero-food-containers.webp',
    sideProduct: '/images/hero-fruit-container.webp',
    light: true,
    decoration: 'waves' as const,
    tagline: 'SMART, SUSTAINABLE\nPACKAGING FOR BRANDS',
    title: 'CONTAINERS',
    left: 'Built for cloud kitchens and QSR delivery lines.',
    right: 'SUSTAINABLE PACKAGING SOLUTIONS DESIGNED FOR BRANDS THAT DEMAND PERFORMANCE, IMPACT, AND RESPONSIBILITY.',
    ctaText: 'EXPLORE MORE',
    ctaLink: '/categories'
  },
  {
    background: '/images/banner2.webp',
    product: '/images/product2banner.webp',
    decoration: 'waves' as const,
    tagline: 'YOUR LOGO MOULDED IN,\nNOT STUCK ON',
    title: 'BRANDING',
    left: 'In-mould labelling, bonded into the container wall.',
    right: 'DURABLE BRANDED PACKAGING DESIGNED FOR VISIBILITY, IMPACT, AND STRONG BRAND RECOGNITION ACROSS EVERY DELIVERY.',
    ctaText: 'ORDER TODAY',
    ctaLink: '/categories'
  },
  {
    background: '/images/product3banner.png',
    product: '/images/product3.png',
    // Larger than the shared default (max-h-[30vh]/42vh/46vh) — this
    // product photo reads small next to slides 1/2 at the default size.
    productSizeClass: 'max-h-[38vh] sm:max-h-[52vh] lg:max-h-[58vh]',
    decoration: 'waves' as const,
    tagline: 'PRECISION MOULDED\nFOR EVERY USE CASE',
    title: 'PACKAGING',
    left: 'One factory, every format — QSR to dairy and sweets.',
    right: 'MICROWAVE-SAFE, LEAK-PROOF, BUILT FOR HIGH-VOLUME STACKING AND PREMIUM SHELF PRESENCE.',
    ctaText: 'CUSTOMIZE NOW',
    ctaLink: '/categories'
  },
];

// Motion variants: Opposing parallax effect with smooth 1.0s easeInOut pacing
const SLIDE_DURATION = 1.0;
const SLIDE_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

// 1. Background & Title Layer: Moves slowly to the LEFT side on next slide transition
const bgTitleVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 1,
    scale: 1.03
  }),
  center: {
    x: '0%',
    opacity: 1,
    scale: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 1,
    scale: 0.97
  }),
};

const bgTitleTransition = {
  duration: SLIDE_DURATION,
  ease: SLIDE_EASE
};

// 2. Center Product Image: Moves slowly to the RIGHT side on next slide transition
const centerProductVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 1
  }),
  center: {
    x: '0%',
    opacity: 1,
    scale: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1
  }),
};

const centerProductTransition = {
  duration: SLIDE_DURATION,
  ease: SLIDE_EASE
};

// 3. Left Side Text Column: Bounded child slider inside its own left box
const leftColumnVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0
  }),
};

const leftColumnTransition = {
  duration: SLIDE_DURATION,
  ease: SLIDE_EASE
};

// 4. Right Side Text Column: Bounded child slider inside its own right box
const rightColumnVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0
  }),
};

const rightColumnTransition = {
  duration: SLIDE_DURATION,
  ease: SLIDE_EASE
};

// Ambient particle layer
const HERO_PARTICLES = [
  { top: '18%', left: '12%', size: 6, px: 8, py: -16, duration: 5.2, delay: 0 },
  { top: '28%', left: '82%', size: 10, px: -6, py: 18, duration: 6.4, delay: 0.6 },
  { top: '62%', left: '6%', size: 5, px: 7, py: 14, duration: 4.6, delay: 1.1 },
  { top: '72%', left: '90%', size: 8, px: -9, py: -12, duration: 7.1, delay: 0.3 },
  { top: '14%', left: '48%', size: 4, px: 5, py: 12, duration: 5.8, delay: 1.6 },
  { top: '85%', left: '55%', size: 7, px: -7, py: -18, duration: 6.9, delay: 0.9 },
  { top: '45%', left: '92%', size: 5, px: 6, py: 15, duration: 4.4, delay: 2.1 },
  { top: '52%', left: '4%', size: 12, px: -8, py: 10, duration: 7.8, delay: 1.4 },
  { top: '8%', left: '75%', size: 6, px: 9, py: -14, duration: 5.5, delay: 2.5 },
];

export const Hero: React.FC = () => {
  const [[currentSlide, direction], setSlide] = useState<[number, number]>([0, 1]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number) => {
    setSlide(([prev]) => [idx, idx > prev ? 1 : -1]);
  }, []);

  const goDirection = useCallback((dir: 1 | -1) => {
    setSlide(([prev]) => [(prev + dir + heroSlides.length) % heroSlides.length, dir]);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSlide(([prev]) => [(prev + 1) % heroSlides.length, 1]);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide]);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative min-h-[580px] sm:h-[calc(100vh-85px)] sm:max-h-[920px] sm:min-h-[640px] bg-[#111518] text-white overflow-hidden border-b border-[#E6DBC6]/30">
      {/* LAYER 1 — Background Artwork & Giant Title: Moves slowly to the LEFT side */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={`bg-title-${currentSlide}`}
          custom={direction}
          variants={bgTitleVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={bgTitleTransition}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Background Image */}
          <img
            src={slide.background}
            alt="Hero background"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover ${slide.light ? '' : 'filter brightness-[0.9]'}`}
          />
          <div
            className={
              slide.light
                ? 'absolute inset-0 bg-gradient-to-t from-white/70 via-white/20 to-transparent'
                : 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20'
            }
          />

          {/* Large Backdrop Title */}
          <div className="absolute inset-x-0 top-[18%] sm:top-[16%] flex justify-center items-center pointer-events-none px-4">
            <h1
              className={`${orbitron.className} text-5xl sm:text-6xl lg:text-7xl xl:text-[8rem] font-black uppercase tracking-wider text-center select-none ${slide.light ? 'text-[#1A1D20]/75' : 'text-[#e8cf9e]/95'
                } drop-shadow-2xl transition-colors duration-500`}
            >
              {slide.title}
            </h1>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LAYER 2 — Decorative: wave lines + ambient particles */}
      {slide.decoration === 'waves' && <HeroWaves className="z-[6]" />}
      <div aria-hidden="true" className="absolute inset-0 z-[8] overflow-hidden pointer-events-none">
        {HERO_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#cfa144]/30 hero-particle"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              // @ts-expect-error -- custom properties read by the .hero-particle keyframes
              '--particle-x': `${p.px}px`,
              '--particle-y': `${p.py}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* LAYER 3 — Center Product Display: Moves slowly to the RIGHT side */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={`center-product-${currentSlide}`}
          custom={direction}
          variants={centerProductVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={centerProductTransition}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4 pt-10 sm:pt-14"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Studio Spotlight Glow behind center pedestal */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[860px] h-[46vh] rounded-full blur-3xl will-change-transform"
            style={{
              transform: 'translate3d(-50%, -50%, 0)',
              background: slide.light
                ? 'radial-gradient(closest-side, rgba(184,152,88,0.25), transparent 75%)'
                : 'radial-gradient(closest-side, rgba(232,207,158,0.2), transparent 75%)',
            }}
          />

          {slide.product && (
            <div
              className="relative flex flex-col items-center justify-center translate-y-[10%] sm:translate-y-[25%]"
              style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
            >
              {/* 3D Platform Pedestal Base */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-[240px] sm:w-[380px] lg:w-[460px] h-10 sm:h-16 rounded-[100%] bg-gradient-to-r from-[#cfa144]/20 via-[#e8cf9e]/40 to-[#cfa144]/20 blur-sm border border-[#cfa144]/30 shadow-[0_12px_40px_rgba(184,152,88,0.35)] pointer-events-none"
              />

              {/* Floating Product Image Cutout */}
              <div className="hero-float-product will-change-transform z-10">
                <img
                  src={slide.product}
                  alt={slide.title}
                  className={`${slide.productSizeClass ?? 'max-h-[30vh] sm:max-h-[42vh] lg:max-h-[46vh]'} object-contain [filter:drop-shadow(0_25px_20px_rgba(0,0,0,0.3))_drop-shadow(0_50px_45px_rgba(0,0,0,0.25))]`}
                />
              </div>

              {/* Ground Shadow */}
              <div
                aria-hidden="true"
                className="hero-float-product-shadow w-[65%] h-5 sm:h-8 mt-2 rounded-[100%] bg-black/50 blur-2xl"
              />

              {/* Side product accent */}
              {slide.sideProduct && (
                <div className="hero-float-side absolute -left-6 sm:-left-16 -top-4 sm:-top-10 pointer-events-none will-change-transform z-20">
                  <img
                    src={slide.sideProduct}
                    alt="Product accent"
                    className="w-24 sm:w-36 lg:w-44 object-contain [filter:drop-shadow(0_18px_14px_rgba(0,0,0,0.35))]"
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* LAYER 4 — Left Side Column: BOUNDED Child Slider (slides ONLY inside its 260px area) */}
      <div className="hidden lg:block absolute left-8 lg:left-20 xl:left-28 top-1/2 -translate-y-1/2 z-20 w-[260px] overflow-hidden py-4">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`left-col-${currentSlide}`}
            custom={direction}
            variants={leftColumnVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={leftColumnTransition}
            className="flex flex-col items-start pointer-events-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider leading-relaxed whitespace-pre-line mb-3 ${slide.light ? 'text-[#1A1D20]' : 'text-gray-100'
                }`}
            >
              {slide.tagline}
            </p>

            {/* Zeropack Chevron Arrow Sequence >>>>>>>>>> */}
            <div className="flex items-center text-[#a8812f] font-mono tracking-tighter text-xs my-3 select-none" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <ChevronRight key={i} className="w-3.5 h-3.5 -mx-0.5" strokeWidth={3} />
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-2">
              <Link
                href={slide.ctaLink}
                className={`text-xs font-black px-7 py-3.5 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center gap-3 group border border-[#cfa144]/40 ${slide.light
                  ? 'bg-[#111518] hover:bg-black text-[#e8cf9e]'
                  : 'bg-[#111518] hover:bg-black text-[#e8cf9e]'
                  }`}
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#a8812f] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LAYER 5 — Right Side Column: BOUNDED Child Slider (slides ONLY inside its 280px area) */}
      <div className="hidden lg:block absolute right-8 lg:right-20 xl:right-28 top-1/2 -translate-y-1/2 z-20 w-[280px] overflow-hidden py-4">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`right-col-${currentSlide}`}
            custom={direction}
            variants={rightColumnVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={rightColumnTransition}
            className="flex flex-col items-end"
            style={{ willChange: 'transform, opacity' }}
          >
            <p
              className={`text-xs text-right leading-relaxed font-semibold uppercase tracking-wide ${slide.light ? 'text-[#1A1D20]' : 'text-gray-200'
                }`}
            >
              {slide.right}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Condensed Content Slider */}
      <div className="lg:hidden absolute inset-x-0 bottom-16 z-20 overflow-hidden px-6">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`mobile-col-${currentSlide}`}
            custom={direction}
            variants={leftColumnVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={leftColumnTransition}
            className="flex flex-col items-center text-center gap-3"
            style={{ willChange: 'transform, opacity' }}
          >
            <Link
              href={slide.ctaLink}
              className={`text-xs font-black px-6 py-3 rounded-lg shadow-lg uppercase tracking-widest flex items-center gap-2 border border-[#cfa144]/40 ${slide.light ? 'bg-[#1A1D20] text-[#e8cf9e]' : 'bg-[#111518] text-[#e8cf9e]'
                }`}
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#a8812f]" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Up Next Teaser */}
      <button
        onClick={() => goDirection(1)}
        className="hidden sm:block absolute left-6 lg:left-10 bottom-7 z-30"
        aria-label={`Preview next slide: ${heroSlides[(currentSlide + 1) % heroSlides.length].title}`}
      >
        <span
          className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-colors hover:text-[#a8812f] ${slide.light ? 'text-[#1A1D20]/50' : 'text-white/40'
            }`}
        >
          {heroSlides[(currentSlide + 1) % heroSlides.length].title}
        </span>
      </button>

      {/* Slide Progress Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center px-6">
        <div className="flex items-center justify-center gap-2 w-full max-w-xs">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className="relative h-1.5 flex-1 rounded-full bg-[#cfa144]/20 border border-[#cfa144]/30 overflow-hidden"
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === currentSlide && (
                <motion.span
                  key={`progress-${currentSlide}`}
                  className="absolute inset-y-0 left-0 bg-[#cfa144] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                />
              )}
              {idx < currentSlide && <span className="absolute inset-0 bg-[#cfa144]/70 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Side Navigation Arrow Buttons */}
      <button
        onClick={() => goDirection(-1)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full bg-[#1A1D20]/85 hover:bg-[#1A1D20] backdrop-blur-md border border-[#cfa144]/40 shadow-md transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-[#e8cf9e]" />
      </button>
      <button
        onClick={() => goDirection(1)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full bg-[#1A1D20]/85 hover:bg-[#1A1D20] backdrop-blur-md border border-[#cfa144]/40 shadow-md transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-[#e8cf9e]" />
      </button>
    </section>
  );
};
