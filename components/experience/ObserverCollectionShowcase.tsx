'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Box, ShieldCheck, Sparkles, Utensils } from 'lucide-react';
import { homeCollection } from '@/lib/cms/pages/home-collection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CHIP_ICONS = [ShieldCheck, Box, Sparkles];

export function ObserverCollectionShowcase({ content = homeCollection }: { content?: typeof homeCollection }) {
  const c = content;
  const products = c.series;
  const containerRef = useRef<HTMLElement>(null);
  const [variantImages, setVariantImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let ctx: gsap.Context | null = null;
    // Let images and layout settle before measuring panel heights.
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>('.showcase-panel');
        const mm = gsap.matchMedia();

        // Every screen size: copy and product photo rise in as a panel arrives.
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          panels.forEach((panel) => {
            gsap.from(panel.querySelectorAll('[data-reveal]'), {
              y: 36,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.08,
              scrollTrigger: { trigger: panel, start: 'top 72%', toggleActions: 'play none none reverse' },
            });
            gsap.from(panel.querySelector('[data-product]'), {
              scale: 0.86,
              opacity: 0,
              rotate: -4,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: { trigger: panel, start: 'top 70%', toggleActions: 'play none none reverse' },
            });
          });
        });

        // Every screen: each panel pins and the next series slides over it while it steps back.
        // A panel taller than the screen (phones) pins only once its bottom reaches the bottom of
        // the screen, so all of its text has been scrolled past before the next panel covers it.
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          panels.slice(0, -1).forEach((panel) => {
            const isTall = () => panel.offsetHeight > window.innerHeight;
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: panel,
                  start: () => (isTall() ? 'bottom bottom' : 'top top'),
                  end: () => `+=${window.innerHeight}`,
                  pin: true,
                  pinSpacing: false,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              .to(panel.querySelector('.section-content'), {
                scale: 0.9,
                opacity: 0.35,
                ease: 'none',
                transformOrigin: 'center bottom',
              });
          });
        });

        // Phones/tablets: the product photo also drifts gently with the scroll.
        mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
          panels.forEach((panel) => {
            gsap.fromTo(
              panel.querySelector('[data-product-img]'),
              { yPercent: -6 },
              { yPercent: 6, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } }
            );
          });
        });

        ScrollTrigger.refresh();
      }, root);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, []);

  return (
    <section id="collection" ref={containerRef} className="relative w-full bg-[#0c0e10]">
      {products.map((p, idx) => {
        const id = `series-${idx}`;
        const cardImage = variantImages[id] || p.image;

        return (
          <div
            key={id}
            className="showcase-panel relative w-full"
            style={{ zIndex: 10 + idx }}
          >
            {/* Full-bleed panel: background spans the screen, content keeps the site content width. */}
            {/* Grows with its content (never clipped); at least one screen tall on desktop. */}
            <article className="section-content relative w-full overflow-hidden border-t border-white/5 bg-[#111417] lg:flex lg:min-h-screen lg:items-center">
              {/* Food photo: a soft backdrop, strongest behind the product, faded out behind the text. */}
              <div className="absolute inset-0" aria-hidden="true">
                <Image
                  src={p.foodImage || '/images/food-pairings/bento-meal.webp'}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover opacity-40 lg:opacity-55"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#111417]/30 via-[#111417]/85 to-[#111417] lg:bg-gradient-to-r lg:from-[#111417] lg:via-[#111417]/90 lg:to-[#111417]/40" />
              </div>

              <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-5 py-12 sm:gap-8 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20">
                {/* Product stage (first on phones, right on desktop) */}
                <div className="order-first flex flex-col items-center lg:order-last">
                  <div data-product className="relative aspect-[4/3] w-full max-w-[520px]">
                    <div
                      className="absolute inset-[8%] rounded-full [background:radial-gradient(circle,rgba(229,192,116,0.32)_0%,rgba(229,192,116,0.08)_45%,transparent_70%)] blur-2xl"
                      aria-hidden="true"
                    />
                    {/* Rounded frame clips the photo; the shadow sits on the frame since clipping would cut a drop-shadow. */}
                    <div data-product-img className="absolute inset-0 overflow-hidden rounded-[24px] shadow-[0_28px_60px_-20px_rgba(0,0,0,0.65)] lg:rounded-[32px]">
                      <Image
                        src={cardImage}
                        alt={`${p.title} container`}
                        fill
                        sizes="(max-width: 1024px) 90vw, 520px"
                        className="object-contain transition-transform duration-500 ease-out hover:scale-[1.04]"
                        priority={idx === 0}
                      />
                    </div>
                  </div>

                  {p.variants.length > 0 && (
                    <div
                      className="mt-3 flex w-full max-w-[520px] gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-wrap lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden"
                      role="group"
                      aria-label={`${p.title} sizes`}
                    >
                      {p.variants.map((v) => {
                        const active = cardImage === v.image;
                        return (
                          <button
                            key={v.image}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setVariantImages((prev) => ({ ...prev, [id]: v.image }))}
                            className={`min-h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-xs font-semibold transition-colors ${
                              active
                                ? 'bg-[#b99750] text-white'
                                : 'border border-white/15 bg-white/[0.06] text-white/80 hover:bg-white/15 hover:text-white'
                            }`}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-2 text-center text-[11px] text-white/55">
                    {c.formatsLabel} <span className="font-semibold text-white/85">{p.capacity}</span>
                  </p>
                </div>

                {/* Copy */}
                <div className="flex flex-col text-left">
                  <h2 data-reveal className="text-[28px] font-black leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                    {p.title}
                  </h2>
                  <p data-reveal className="mt-2 font-serif text-base italic text-[#e9d3a0] sm:text-lg lg:text-xl">
                    {p.tagline}
                  </p>
                  <p data-reveal className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-[15px] lg:text-base">
                    {p.description}
                  </p>

                  <ul
                    data-reveal
                    className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
                  >
                    {c.chips.map((chip, i) => {
                      const Icon = CHIP_ICONS[i % CHIP_ICONS.length];
                      return (
                        <li key={chip} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/85">
                          <Icon size={13} className="text-[#e5c074]" aria-hidden="true" />
                          {chip}
                        </li>
                      );
                    })}
                  </ul>

                  <p data-reveal className="mt-5 flex items-start gap-2.5 border-l-2 border-[#b99750]/70 pl-3 text-sm text-white/80">
                    <Utensils size={15} className="mt-0.5 shrink-0 text-[#e5c074]" aria-hidden="true" />
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#e5c074]">{c.pairingLabel}</span>
                      {p.foodPairing}
                    </span>
                  </p>

                  <div data-reveal className="mt-7 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                    <Link
                      href={p.link}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#b99750] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#b99750]/25 transition-colors hover:bg-[#a6843e] sm:px-6 sm:text-sm"
                    >
                      <span className="truncate">{p.buttonText}</span>
                      <ArrowUpRight size={15} aria-hidden="true" className="shrink-0" />
                    </Link>
                    <Link
                      href={c.samplesButton.link}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/15 sm:px-6 sm:text-sm"
                    >
                      <span className="truncate">{c.samplesButton.text}</span>
                      <ArrowRight size={14} aria-hidden="true" className="shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </section>
  );
}
