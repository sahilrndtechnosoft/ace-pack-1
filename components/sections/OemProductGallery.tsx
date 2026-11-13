'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { X, ChevronLeft, ChevronRight, ShieldCheck, ArrowUpRight, Maximize2 } from 'lucide-react';
import { OEM_GALLERY_ITEMS } from '@/lib/cms/pages/oem';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, Flip);

export interface OemGalleryItem {
  id: string | number;
  title: string;
  category: string;
  description: string;
  image: string;
  specs?: string[];
}

interface OemProductGalleryProps {
  badge?: string;
  heading?: string;
  lead?: string;
  items?: OemGalleryItem[];
  kind?: 'oem' | 'customization' | 'oem_customization';
}


export function OemProductGallery({
  badge = 'PRODUCT GALLERY',
  heading = 'Round Glass & Custom Product Showcase',
  lead = 'Photographs of custom Round Glass containers, bespoke colour closures, and precision IML mouldings engineered for leading QSR chains, beverage brands, and foodservice distributors.',
  items = OEM_GALLERY_ITEMS,
  kind = 'oem',
}: OemProductGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const swipeStart = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const galleryItems = items && items.length > 0 ? items : OEM_GALLERY_ITEMS;
  const total = galleryItems.length;
  const [activeModalIdx, setActiveModalIdx] = useState<number | null>(null);
  const [start, setStart] = useState(0);
  const [perView, setPerView] = useState(3);
  // The card that just left the row stays mounted (hidden) so Flip can shrink it away.
  const [leaving, setLeaving] = useState<{ slot: number; forward: boolean } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // `start` counts steps without wrapping, so every card position (slot) has its own Flip id. Like the
  // original caterpillar, the product that leaves one end can re-enter at the other.
  const itemAt = (slot: number) => ((slot % total) + total) % total;
  const visible = Math.max(1, Math.min(perView, total));
  const slots = Array.from({ length: visible }, (_, i) => start + i);
  const current = itemAt(start);

  useEffect(() => {
    const queries = [window.matchMedia('(min-width: 1024px)'), window.matchMedia('(min-width: 640px)')];
    const update = () => setPerView(queries[0].matches ? 3 : queries[1].matches ? 2 : 1);
    update();
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);

  // Intro: heading words rise, cards and CTA fade up when the section scrolls into view.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const intro = { trigger: root, start: 'top 75%' };
        gsap.from('[data-word]', { yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.05, scrollTrigger: intro });
        gsap.from('[data-fade]', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: intro });
        gsap.from('[data-flip-id]', { y: 80, opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: intro, clearProps: 'transform,opacity' });
        gsap.from('.oem-cta', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.oem-cta', start: 'top 85%' } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const step = useCallback(
    (forward: boolean) => {
      if (isAnimating || total < 2 || !rowRef.current) return;
      setIsAnimating(true);
      flipState.current = Flip.getState(rowRef.current.querySelectorAll('[data-flip-id]'));
      setLeaving({ slot: forward ? start : start + visible - 1, forward });
      setStart((s) => (forward ? s + 1 : s - 1));
    },
    [isAnimating, total, start, visible]
  );

  // After React re-renders the row: animate from the recorded layout (the "caterpillar" step).
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !leaving || !rowRef.current) return;
    flipState.current = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { forward } = leaving;
    Flip.from(state, {
      targets: rowRef.current.querySelectorAll('[data-flip-id]'),
      duration: reduce ? 0 : 0.7,
      ease: 'power3.inOut',
      absoluteOnLeave: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: reduce ? 0 : 0.7, ease: 'power3.out', transformOrigin: forward ? 'bottom right' : 'bottom left' }),
      onLeave: (els) =>
        gsap.to(els, {
          opacity: 0,
          scale: 0,
          duration: reduce ? 0 : 0.6,
          ease: 'power3.in',
          transformOrigin: forward ? 'bottom left' : 'bottom right',
        }),
      onComplete: () => {
        setLeaving(null);
        setIsAnimating(false);
      },
    });
  }, [start, leaving]);

  // GSAP Modal entrance animation
  useEffect(() => {
    if (activeModalIdx !== null && modalRef.current && modalContentRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(
        modalContentRef.current,
        { opacity: 0, scale: 0.95, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power3.out' }
      );
    }
  }, [activeModalIdx]);

  // Lightbox: pause page scrolling while it is open.
  const isModalOpen = activeModalIdx !== null;
  useEffect(() => {
    if (!isModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
  }, [isModalOpen]);

  // Keyboard navigation for lightbox modal
  useEffect(() => {
    if (activeModalIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalIdx(null);
      else if (e.key === 'ArrowRight') setActiveModalIdx((prev) => (prev !== null ? (prev + 1) % total : 0));
      else if (e.key === 'ArrowLeft') setActiveModalIdx((prev) => (prev !== null ? (prev - 1 + total) % total : 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIdx, total]);

  const activeItem = activeModalIdx !== null ? galleryItems[activeModalIdx] : null;
  const pad = (n: number) => String(n).padStart(2, '0');
  const navButton =
    'flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-[#cfa144] hover:bg-[#cfa144] hover:text-[#111518] disabled:opacity-40 cursor-pointer';

  const card = (slot: number, hidden = false) => {
    const idx = itemAt(slot);
    const item = galleryItems[idx];
    return (
      <article
        key={`slot-${slot}`}
        data-flip-id={`oem-${slot}`}
        aria-hidden={hidden || undefined}
        className={`oem-card group ${hidden ? 'oem-card--leaving' : ''}`}
      >
        <button
          type="button"
          onClick={() => !didSwipe.current && setActiveModalIdx(idx)}
          aria-label={`View ${item.title}`}
          tabIndex={hidden ? -1 : undefined}
          className="absolute inset-0 z-10 cursor-zoom-in"
        />
        {/* Phones/tablets: photo on top, text below it. Desktop: photo fills the card, text overlays it. */}
        <div className="oem-card-media">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 400px"
            className="object-contain lg:object-cover transition-transform duration-[1.2s] ease-out lg:group-hover:scale-110"
          />
          <div aria-hidden="true" className="oem-card-scrim absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
          <span aria-hidden="true" className="oem-card-index">{pad(idx + 1)}</span>
        </div>
        <div className="oem-card-body pointer-events-none relative z-[11] p-5 sm:p-6 lg:mt-auto lg:p-7">
          <span className="inline-block rounded-full border border-[#cfa144]/40 bg-[#cfa144]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e9cf93] backdrop-blur-sm">
            {item.category}
          </span>
          <h3 className="mt-3 text-xl font-extrabold leading-tight text-white sm:text-2xl">{item.title}</h3>
          <div className="oem-card-more">
            <div className="min-h-0">
              <p className="pt-3 text-sm leading-relaxed text-white/75 line-clamp-3">{item.description}</p>
              {item.specs && item.specs.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                      <ShieldCheck size={11} className="text-[#cfa144]" aria-hidden="true" />
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#cfa144]">
            <Maximize2 size={13} aria-hidden="true" /> View details
          </span>
        </div>
      </article>
    );
  };

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#FAF8F4] text-[#1A1D20]">
      <div className="relative bg-[#111518] py-16 text-white sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(207,161,68,0.16),transparent_65%)] blur-3xl" />

        <div className="container-custom relative">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span data-fade className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#cfa144] sm:text-xs">
                <span className="h-px w-8 bg-[#cfa144]" aria-hidden="true" />
                {badge}
              </span>
              <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl" aria-label={heading}>
                {heading.split(' ').map((word, i) => (
                  <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <span data-word className="inline-block">{word}&nbsp;</span>
                  </span>
                ))}
              </h2>
              <p data-fade className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                {lead}
              </p>
            </div>

            {total > 1 && (
              <div data-fade className="flex shrink-0 items-center gap-4">
                <p className="text-sm font-semibold tabular-nums text-white/50" aria-live="polite">
                  <span className="text-2xl font-black text-white">{pad(current + 1)}</span> / {pad(total)}
                </p>
                <button type="button" onClick={() => step(false)} disabled={isAnimating} aria-label="Previous product" className={navButton}>
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => step(true)} disabled={isAnimating} aria-label="Next product" className={navButton}>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div
            ref={rowRef}
            className="oem-row"
            style={{ ['--per-view' as string]: visible }}
            onPointerDown={(e) => (swipeStart.current = e.pointerType === 'mouse' ? null : e.clientX)}
            onPointerUp={(e) => {
              const from = swipeStart.current;
              swipeStart.current = null;
              didSwipe.current = from !== null && Math.abs(e.clientX - from) > 40;
              if (from !== null && didSwipe.current) step(e.clientX < from);
            }}
          >
            {leaving?.forward && card(leaving.slot, true)}
            {slots.map((slot) => card(slot))}
            {leaving && !leaving.forward && card(leaving.slot, true)}
          </div>

          {total > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
              {galleryItems.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-[#cfa144]' : 'w-2 bg-white/25'}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container-custom pb-16 sm:pb-20">
        {/* Global CTA Band matching website standard */}
        <div className="oem-cta relative overflow-hidden mt-14 sm:mt-20 rounded-[32px] bg-[#111518] text-white px-8 sm:px-14 py-12 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <span className="text-xs font-extrabold text-[#cfa144] uppercase tracking-[0.16em] block mb-3">
              Bespoke Mould Tooling & Private Label
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Ready to mould your proprietary container line?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-2.5">
              Our Daman toolroom manufactures multi-cavity injection moulds, customized Pantone polymer colours, and 5-sided In-Mould Labelling with rapid 14-day sample turnarounds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-6 py-3.5 sm:px-7 sm:py-4 rounded-full uppercase tracking-wide transition-colors shadow-md"
            >
              <span>Discuss Custom Tooling</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 border border-white/25 hover:border-[#cfa144] hover:text-[#a8812f] text-white text-xs font-bold px-6 py-3.5 sm:px-7 sm:py-4 rounded-full uppercase tracking-wide transition-colors"
            >
              <span>Download OEM Specs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && typeof document !== 'undefined' && createPortal(
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          data-lenis-prevent
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveModalIdx(null)}
        >
          <div
            ref={modalContentRef}
            className="relative w-full max-w-5xl rounded-3xl bg-[#1A1D20] text-white overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalIdx(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            >
              <X size={20} />
            </button>

            {/* Previous Image Navigation */}
            {galleryItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveModalIdx((prev) =>
                    prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : 0
                  )
                }
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next Image Navigation */}
            {galleryItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveModalIdx((prev) =>
                    prev !== null ? (prev + 1) % galleryItems.length : 0
                  )
                }
                aria-label="Next image"
                className="absolute right-4 md:right-[380px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Image Preview Area */}
            <div className="relative flex-1 bg-black/50 min-h-[320px] md:min-h-[560px] flex items-center justify-center p-6">
              <div className="relative w-full h-full min-h-[300px]">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Sidebar Details Area */}
            <div className="w-full md:w-[360px] p-6 sm:p-8 flex flex-col justify-between bg-[#14171A] border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#cfa144]/20 text-[#cfa144] border border-[#cfa144]/30 text-xs font-bold uppercase tracking-wider mb-3">
                  {activeItem.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
                  {activeItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  {activeItem.description}
                </p>

                {activeItem.specs && activeItem.specs.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Technical Specifications
                    </p>
                    <ul className="space-y-2">
                      {activeItem.specs.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-200">
                          <ShieldCheck size={14} className="text-[#cfa144] shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-2.5">
                <Link
                  href="/contact"
                  className="w-full text-center py-3 rounded-full bg-[#cfa144] hover:bg-[#b88c32] text-[#14171A] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Request Mould Tooling Quote
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveModalIdx(null)}
                  className="w-full text-center py-2.5 rounded-full border border-white/20 hover:border-white text-gray-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

export default OemProductGallery;
