'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, FileDown, ChevronDown } from 'lucide-react';
import { productCategories } from '@/lib/data/products';
import { buildTextReveals, refreshOnSettle } from './experience-motion';
import './categories.css';

gsap.registerPlugin(ScrollTrigger);

const modelCount = productCategories.reduce((n, c) => n + c.products.length, 0);

const standard = [
  '100% prime virgin polypropylene (PP 05) — no regrind, no recycled content',
  'US FDA 21 CFR 177.1520 certified food-contact material',
  'Rated −20°C deep freeze to +120°C microwave reheating',
  'Zero-leak snap-rim geometry across every lidded format',
  'BPA-free and heavy-metal free',
  'Custom in-mould labelling available on every line',
];

export default function CategoriesExperience() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = Array.from(scope.querySelectorAll<HTMLLIElement>('.xc-row'));
    const cleanups: Array<() => void> = [];

    // --- Row state: hover and focus reveal, the Details button pins -------------
    // Hover is transient (mouseleave clears it back to whatever is pinned), so a
    // touch user who taps Details keeps it open, and a mouse user who clicks
    // Details keeps it open after moving away.
    let pinned: HTMLLIElement | null = null;
    const activate = (row: HTMLLIElement | null) => {
      rows.forEach(r => {
        const on = r === row;
        r.classList.toggle('is-active', on);
        r.querySelector<HTMLButtonElement>('.xc-row-toggle')?.setAttribute('aria-expanded', String(on));
      });
    };
    rows.forEach(row => {
      const onEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') activate(row); };
      const onFocus = () => activate(row);
      row.addEventListener('pointerenter', onEnter);
      row.addEventListener('focusin', onFocus);
      const toggle = row.querySelector<HTMLButtonElement>('.xc-row-toggle');
      const onToggle = () => { pinned = pinned === row ? null : row; activate(pinned); };
      toggle?.addEventListener('click', onToggle);
      cleanups.push(() => {
        row.removeEventListener('pointerenter', onEnter);
        row.removeEventListener('focusin', onFocus);
        toggle?.removeEventListener('click', onToggle);
      });
    });
    const list = scope.querySelector<HTMLElement>('.xc-list');
    const onLeave = () => activate(pinned);
    const onFocusOut = (e: FocusEvent) => { if (!list?.contains(e.relatedTarget as Node)) activate(pinned); };
    list?.addEventListener('mouseleave', onLeave);
    list?.addEventListener('focusout', onFocusOut);
    cleanups.push(() => { list?.removeEventListener('mouseleave', onLeave); list?.removeEventListener('focusout', onFocusOut); });

    // --- Floating photo that trails the cursor -------------------------------------
    // Armed by the first real mouse pointer rather than a mount-time media query,
    // so a tablet with a trackpad gets it the moment a mouse is in use and a
    // finger never triggers it.
    const card = preview.current;
    if (card && list && !reduced) {
      const images = Array.from(card.querySelectorAll<HTMLImageElement>('img'));
      const label = card.querySelector<HTMLElement>('.xc-preview-label');
      const xTo = gsap.quickTo(card, 'x', { duration: 0.55, ease: 'power3' });
      const yTo = gsap.quickTo(card, 'y', { duration: 0.55, ease: 'power3' });
      let shown = false;
      let hovered = -1;
      const place = (e: PointerEvent) => {
        // Sit to the right of the cursor, flipping left near the viewport edge.
        const w = card.offsetWidth, h = card.offsetHeight;
        const x = e.clientX + 28 + w > window.innerWidth ? e.clientX - w - 28 : e.clientX + 28;
        xTo(x); yTo(Math.min(window.innerHeight - h - 16, Math.max(16, e.clientY - h / 2)));
      };
      const show = (index: number) => {
        if (index === hovered) return;
        hovered = index;
        images.forEach((img, k) => img.classList.toggle('is-on', k === index));
        if (label) label.textContent = rows[index]?.dataset.name ?? '';
        if (!shown) { shown = true; gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }); }
      };
      const hide = () => { shown = false; hovered = -1; gsap.to(card, { opacity: 0, scale: 0.92, duration: 0.3, ease: 'power2.in', overwrite: 'auto' }); };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        place(e);
        const row = (e.target as Element).closest<HTMLLIElement>('.xc-row');
        if (row) show(rows.indexOf(row));
      };
      list.addEventListener('pointermove', onMove);
      list.addEventListener('pointerleave', hide);
      cleanups.push(() => { list.removeEventListener('pointermove', onMove); list.removeEventListener('pointerleave', hide); });
    }

    if (reduced) return () => cleanups.forEach(fn => fn());

    // --- Entrance motion ---------------------------------------------------------------
    const text = buildTextReveals(scope);
    const settle = refreshOnSettle(scope);
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.xc-title-mask > span');
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.05)
        .from('.xc-hero .xp-eyebrow', { opacity: 0, y: 12, duration: 0.7 }, 0)
        .from('.xc-hero-lead', { opacity: 0, y: 18, duration: 0.8 }, 0.55)
        .from('.xc-glance div', { opacity: 0, y: 22, duration: 0.7, stagger: 0.08 }, 0.5);
      gsap.to('.xp-scroll-line', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true } });
      gsap.from(rows, { opacity: 0, y: 26, duration: 0.7, ease: 'power2.out', stagger: 0.06, scrollTrigger: { trigger: '.xc-list', start: 'top 85%', once: true } });
      // Cover cards (touch layouts): each photo drifts inside its frame as the
      // card passes, and settles from a slight zoom as it enters.
      gsap.matchMedia().add('(pointer: coarse), (max-width: 767px)', () => {
        gsap.utils.toArray<HTMLElement>('.xc-row-thumb').forEach(img => {
          gsap.fromTo(img, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.04, ease: 'none',
            scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>('.xc-cover-name').forEach(el => {
          gsap.from(el, { y: 18, opacity: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });
      });
      gsap.from('.xc-standard-list li', { opacity: 0, x: -14, duration: 0.55, ease: 'power2.out', stagger: 0.06, scrollTrigger: { trigger: '.xc-standard', start: 'top 80%', once: true } });
    }, scope);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => { cancelAnimationFrame(refresh); ctx.revert(); settle(); text(); cleanups.forEach(fn => fn()); };
  }, []);

  return (
    <div ref={root} className="xc">
      <div className="xp-scroll-line" aria-hidden="true" />

      <section className="xc-hero">
        <div className="xc-wrap xc-hero-grid">
          <div>
            <span className="xp-eyebrow">The catalog · {productCategories.length} lines · {modelCount} models</span>
            <h1 aria-label="Every format food service needs.">
              <span className="xc-title-mask"><span>Every format</span></span>
              <span className="xc-title-mask"><span><em>food service needs.</em></span></span>
            </h1>
            <p className="xc-hero-lead">Eleven container lines, one material standard: 100% prime virgin PP 05, US FDA 21 CFR 177.1520 certified, rated from deep freeze to microwave.</p>
          </div>
          <div className="xc-glance">
            <div><b>{productCategories.length}</b><span>Categories</span></div>
            <div><b>{modelCount}</b><span>Models</span></div>
            <div><b>PP 05</b><span>Virgin resin</span></div>
            <div><b>−20 · +120°C</b><span>Rated range</span></div>
          </div>
        </div>
      </section>

      <section className="xc-index" id="index">
        <div className="xc-wrap">
          <div className="xc-index-head">
            <div>
              <span className="xp-eyebrow">01 / Browse by line</span>
              <h2 data-split>Find your <em>form.</em></h2>
            </div>
            <span className="xc-index-hint">Hover a line to preview · open for every model</span>
          </div>

          <ol className="xc-list">
            {productCategories.map((category, i) => {
              const num = String(i + 1).padStart(2, '0');
              const detailId = `xc-detail-${category.slug}`;
              return (
                <li className="xc-row" key={category.id} data-name={category.name}>
                  <Link href={`/categories/${category.slug}`} className="xc-row-link">
                    {/* On touch screens the photo becomes the card, with the name
                        and number set on it; on desktop it collapses and the row
                        reads as type. */}
                    <span className="xc-row-cover" aria-hidden="true">
                      <img className="xc-row-thumb" src={category.heroImage} alt="" loading="lazy" />
                      <span className="xc-cover-num">{num}</span>
                      <span className="xc-cover-name">{category.name}</span>
                      <span className="xc-cover-arrow"><ArrowUpRight size={17} /></span>
                    </span>
                    <span className="xc-num">{num}</span>
                    <span className="xc-row-main">
                      <h3>{category.name}</h3>
                      <span className="xc-row-sub">{category.subtitleName}</span>
                    </span>
                    <span className="xc-row-meta">
                      <b>{category.products.length} model{category.products.length === 1 ? '' : 's'}</b>
                      <span>{category.products.map(p => p.capacity).join(' · ')}</span>
                    </span>
                    <span className="xc-row-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
                  </Link>
                  <button type="button" className="xc-row-toggle" aria-expanded={false} aria-controls={detailId}>
                    Details <ChevronDown size={14} />
                  </button>
                  <div className="xc-row-detail" id={detailId}>
                    <div>
                      <p>{category.shortDescription}</p>
                      <div className="xc-pills">{category.features.slice(0, 4).map(f => <span key={f}>{f}</span>)}</div>
                      <Link href={`/categories/${category.slug}`} className="xc-detail-link">
                        View {category.products.length === 1 ? 'the model' : `all ${category.products.length} models`} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* One floating frame, all eleven images stacked inside; only the hovered one is lit. */}
        <div ref={preview} className="xc-preview" aria-hidden="true">
          {productCategories.map(category => <img key={category.id} src={category.heroImage} alt="" loading="lazy" />)}
          <span className="xc-preview-label" />
        </div>
      </section>

      <section className="xc-standard">
        <div className="xc-wrap xc-standard-grid">
          <div>
            <span className="xp-eyebrow">02 / One material standard</span>
            <h2 data-split>Every line, <em>the same polymer.</em></h2>
          </div>
          <ul className="xc-standard-list">
            {standard.map(item => <li key={item}><i />{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="xc-closing">
        <div className="xc-wrap">
          <span className="xp-eyebrow">Catalog &amp; sample kit</span>
          <h2 data-split>Specify it <em>in hand.</em></h2>
          <div className="xc-closing-actions">
            <Link href="/contact" className="xp-button">Request wholesale pricing <ArrowRight size={18} /></Link>
            <Link href="/downloads" className="xc-ghost">Download the catalog <FileDown size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
