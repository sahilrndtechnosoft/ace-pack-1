'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ArrowUpRight, ArrowRight, ArrowDownUp, FileDown } from 'lucide-react';
import { productCategories } from '@/lib/data/products';
import { buildTextReveals, refreshOnSettle } from './experience-motion';
import LinesCarousel from './LinesCarousel';
import './products.css';

gsap.registerPlugin(ScrollTrigger, Flip);

type Sort = 'line' | 'capacity';

// Flatten once at module scope; the list never changes at runtime.
const models = productCategories.flatMap((category, c) =>
  category.products.map((product, p) => ({
    ...product,
    line: category.name,
    lineSlug: category.slug,
    href: `/categories/${category.slug}/${product.product_slug}`,
    // Stable catalog order: by line, then by the order models are listed.
    index: c * 100 + p,
  }))
);

// "30ml (1 oz)" -> 30, "500g" -> 500, "Custom Capacity" -> last.
const capacityValue = (capacity: string) => {
  const m = capacity.match(/(\d+(?:\.\d+)?)\s*(ml|g)/i);
  return m ? parseFloat(m[1]) : Number.POSITIVE_INFINITY;
};
const numeric = models.map(m => capacityValue(m.capacity)).filter(Number.isFinite);
const capacityRange = `${Math.min(...numeric)}–${Math.max(...numeric)} ml`;

export default function ProductsExperience() {
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  // Page-load entrance triggers. Retired on the first filter/sort: if one fired
  // while Flip was moving a card, gsap.from captured the in-flight transform as
  // its destination and parked the card off-screen.
  const entrance = useRef<ScrollTrigger[]>([]);
  const [line, setLine] = useState<string>('all');
  const [sort, setSort] = useState<Sort>('line');
  const [count, setCount] = useState(models.length);

  const lines = useMemo(() => [
    { slug: 'all', name: 'All lines', count: models.length },
    ...productCategories.map(c => ({ slug: c.slug, name: c.name, count: c.products.length })),
  ], []);

  // Glide the indicator under the active pill and keep that pill in view on a
  // scrolling rail. Runs on every change and once on mount.
  const placeIndicator = useCallback((animate = true) => {
    const bar = rail.current, pill = indicator.current;
    if (!bar || !pill) return;
    const active = bar.querySelector<HTMLButtonElement>('.xpr-filter[aria-pressed="true"]');
    if (!active) return;
    const x = active.offsetLeft, w = active.offsetWidth;
    if (animate) gsap.to(pill, { x, width: w, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    else gsap.set(pill, { x, width: w });
    active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: animate ? 'smooth' : 'auto' });
  }, []);

  // Show / hide / reorder the cards in place and let Flip animate the reflow.
  // The DOM is mutated directly so React never re-renders 17 cards for a filter.
  const applyView = useCallback((nextLine: string, nextSort: Sort, animate = true) => {
    const list = grid.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLLIElement>('.xpr-card'));
    if (entrance.current.length) {
      entrance.current.forEach(trigger => trigger.kill());
      entrance.current = [];
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: 'transform,opacity' });
    }
    const state = animate ? Flip.getState(cards) : null;
    const ordered = [...cards].sort((a, b) =>
      nextSort === 'capacity'
        ? Number(a.dataset.cap) - Number(b.dataset.cap) || Number(a.dataset.index) - Number(b.dataset.index)
        : Number(a.dataset.index) - Number(b.dataset.index));
    ordered.forEach(el => list.appendChild(el));
    let visible = 0;
    cards.forEach(el => {
      const show = nextLine === 'all' || el.dataset.line === nextLine;
      el.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    setCount(visible);
    root.current?.querySelector('.xpr-empty')?.classList.toggle('is-on', visible === 0);
    if (state) {
      Flip.from(state, {
        duration: 0.65, ease: 'power3.inOut', stagger: 0.015, absolute: true, scale: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in' }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  }, []);

  const lineCards = useMemo(() => productCategories.map(c => ({
    slug: c.slug, name: c.name, subtitle: c.subtitleName, image: c.heroImage, count: c.products.length,
  })), []);

  // From the carousel: filter to that line and bring the catalog up under the bar.
  const selectFromCarousel = (slug: string) => {
    chooseLine(slug);
    const target = root.current?.querySelector<HTMLElement>('#catalog');
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 140;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const chooseLine = (slug: string) => {
    setLine(slug);
    applyView(slug, sort);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('line'); else url.searchParams.set('line', slug);
    window.history.replaceState(null, '', url.toString());
  };
  const toggleSort = () => {
    const next: Sort = sort === 'line' ? 'capacity' : 'line';
    setSort(next);
    applyView(line, next);
  };

  useEffect(() => { placeIndicator(); }, [line, placeIndicator]);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    // Deep link: /products?line=hinge-cups opens on that line.
    const wanted = new URLSearchParams(window.location.search).get('line');
    if (wanted && productCategories.some(c => c.slug === wanted)) {
      setLine(wanted);
      applyView(wanted, 'line', false);
    }
    placeIndicator(false);
    const onResize = () => placeIndicator(false);
    window.addEventListener('resize', onResize);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => window.removeEventListener('resize', onResize);
    }

    const text = buildTextReveals(scope);
    const settle = refreshOnSettle(scope);
    const ctx = gsap.context(() => {
      const heroLines = gsap.utils.toArray<HTMLElement>('.xpr-title-mask > span');
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(heroLines, { yPercent: 112 }, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.05)
        .from('.xpr-hero .xp-eyebrow', { opacity: 0, y: 12, duration: 0.7 }, 0)
        .from('.xpr-hero-lead', { opacity: 0, y: 18, duration: 0.8 }, 0.55)
        .from('.xpr-glance div', { opacity: 0, y: 22, duration: 0.7, stagger: 0.08 }, 0.5);
      gsap.to('.xp-scroll-line', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true } });
      // Cards enter in viewport batches — one trigger per batch, not per card.
      // fromTo with explicit end values and clearProps, so nothing is left on
      // the element for a later Flip to inherit.
      entrance.current = ScrollTrigger.batch('.xpr-card:not(.is-hidden)', {
        start: 'top 92%', once: true,
        onEnter: batch => gsap.fromTo(batch, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.07, clearProps: 'transform', overwrite: 'auto' }),
      });
    }, scope);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => { cancelAnimationFrame(refresh); ctx.revert(); settle(); text(); window.removeEventListener('resize', onResize); };
  }, [applyView, placeIndicator]);

  return (
    <div ref={root} className="xpr">
      <div className="xp-scroll-line" aria-hidden="true" />

      <section className="xpr-hero">
        <div className="xpr-wrap xpr-hero-grid">
          <div>
            <span className="xp-eyebrow">The catalog · {models.length} models · {productCategories.length} lines</span>
            <h1 aria-label="Seventeen models. Specified in hand.">
              <span className="xpr-title-mask"><span>Seventeen models.</span></span>
              <span className="xpr-title-mask"><span><em>Specified in hand.</em></span></span>
            </h1>
            <p className="xpr-hero-lead">Every model below is moulded from 100% prime virgin PP 05, US FDA 21 CFR 177.1520 certified and rated from deep freeze to microwave. Filter by line, sort by capacity, open any model for its full specification.</p>
          </div>
          <div className="xpr-glance">
            <div><b>{models.length}</b><span>Models</span></div>
            <div><b>{productCategories.length}</b><span>Lines</span></div>
            <div><b>{capacityRange}</b><span>Capacity range</span></div>
            <div><b>PP 05</b><span>Virgin resin</span></div>
          </div>
        </div>
        <div className="xpr-wrap">
          <LinesCarousel cards={lineCards} onSelect={selectFromCarousel} />
        </div>
      </section>

      {/* Sticky filter rail */}
      <div className="xpr-bar">
        <div className="xpr-wrap xpr-bar-inner">
          <div ref={rail} className="xpr-filters" role="group" aria-label="Filter by product line">
            <span ref={indicator} className="xpr-indicator" aria-hidden="true" />
            {lines.map(item => (
              <button key={item.slug} type="button" className="xpr-filter" aria-pressed={line === item.slug} onClick={() => chooseLine(item.slug)}>
                {item.name} <small>{item.count}</small>
              </button>
            ))}
          </div>
          <div className="xpr-tools">
            <span className="xpr-count" aria-live="polite"><b>{count}</b> of {models.length}</span>
            <button type="button" className="xpr-sort" data-sort={sort} onClick={toggleSort} aria-label={sort === 'line' ? 'Sort by capacity' : 'Sort by line'}>
              <ArrowDownUp size={13} /> <span className="xpr-sort-label">{sort === 'line' ? 'By line' : 'By capacity'}</span>
            </button>
          </div>
        </div>
      </div>

      <section className="xpr-catalog" id="catalog">
        <div className="xpr-wrap">
          <div className="xpr-catalog-head">
            <div>
              <span className="xp-eyebrow">01 / Every model</span>
              <h2 data-split>Pick the <em>format.</em></h2>
            </div>
          </div>

          <ul ref={grid} className="xpr-grid">
            {models.map((m, i) => (
              <li className="xpr-card" key={m.id} data-line={m.lineSlug} data-index={m.index} data-cap={capacityValue(m.capacity)}>
                <Link href={m.href} className="xpr-card-media" aria-label={`${m.name}, ${m.capacity}`}>
                  <img src={m.image} alt="" loading="lazy" width="800" height="600" />
                  <span className="xpr-card-line">{m.line}</span>
                  <span className="xpr-card-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xpr-card-cap"><small>Capacity</small>{m.capacity}</span>
                </Link>
                <div className="xpr-card-body">
                  <h3><Link href={m.href}>{m.name}</Link></h3>
                  <dl className="xpr-specs">
                    <div><dt>Material</dt><dd>{m.material}</dd></div>
                    <div><dt>Grade</dt><dd>{m.quality}</dd></div>
                    {m.dimensions && <div><dt>Top × height</dt><dd>{m.dimensions.top} × {m.dimensions.height}</dd></div>}
                    {m.packaging && <div><dt>Packing</dt><dd>{m.packaging}</dd></div>}
                  </dl>
                  <div className="xpr-card-actions">
                    <Link href={m.href} className="xpr-details">Specifications <ArrowRight size={13} /></Link>
                    <Link href="/contact" className="xpr-inquire" aria-label={`Inquire about ${m.name}`}><ArrowUpRight size={16} /></Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="xpr-empty">No models in this line yet.</p>
        </div>
      </section>

      <section className="xpr-closing">
        <div className="xpr-wrap">
          <span className="xp-eyebrow">Wholesale pricing &amp; sample kit</span>
          <h2 data-split>See it <em>before you order.</em></h2>
          <div className="xpr-closing-actions">
            <Link href="/contact" className="xp-button">Request wholesale pricing <ArrowRight size={18} /></Link>
            <Link href="/downloads" className="xpr-ghost">Download datasheets <FileDown size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
