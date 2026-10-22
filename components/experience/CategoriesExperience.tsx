'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, FileDown, ChevronDown } from 'lucide-react';
import { productCategories, type ProductCategory } from '@/lib/data/products';
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

interface CategoryMeta {
  countLabel: string;
  range: string;
  pills: string[];
  remainingCount: number;
}

function getCategoryMeta(category: ProductCategory): CategoryMeta {
  const count = category.products.length;
  const countLabel = count === 1 ? '1 model' : `${count} models`;

  const cleaned = category.products.map(p => {
    const cap = p.capacity?.trim() || '';
    const parenMatch = cap.match(/\(([\d\s]+(?:ml|oz|g|gm|gms)[^)]*)\)/i);
    if (parenMatch) {
      const inside = parenMatch[1];
      const ml = inside.match(/\d+\s*ml/i);
      if (ml) return ml[0].replace(/\s+/, '').toLowerCase();
      return inside.split('/')[0].trim();
    }
    const directMatch = cap.match(/\d+\s*(?:ml|oz|g|gm|gms)/i);
    if (directMatch) return directMatch[0].replace(/\s+/, '').toLowerCase();
    return cap;
  });

  const unique = Array.from(new Set(cleaned.filter(Boolean)));

  const mlValues = unique
    .map(u => {
      const m = u.match(/^(\d+)ml$/);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter((v): v is number => v !== null)
    .sort((a, b) => a - b);

  const gValues = unique
    .map(u => {
      const m = u.match(/^(\d+)(?:g|gm|gms)$/i);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter((v): v is number => v !== null)
    .sort((a, b) => a - b);

  let range = '';
  if (mlValues.length >= 2) {
    range = `${mlValues[0]}ml – ${mlValues[mlValues.length - 1]}ml`;
  } else if (gValues.length >= 2) {
    range = `${gValues[0]}g – ${gValues[gValues.length - 1]}g`;
  } else if (unique.length > 0) {
    range = unique[0];
  }

  const displayPills = unique.slice(0, 5);
  const remainingCount = unique.length > 5 ? unique.length - 5 : 0;

  return {
    countLabel,
    range,
    pills: displayPills,
    remainingCount,
  };
}

export default function CategoriesExperience() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = Array.from(scope.querySelectorAll<HTMLLIElement>('.xc-row'));
    const cleanups: Array<() => void> = [];

    // --- Row interactivity: hover highlight & intentional specs toggle ---------
    rows.forEach(row => {
      const toggle = row.querySelector<HTMLButtonElement>('.xc-row-toggle');
      const onToggle = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const willExpand = !row.classList.contains('is-expanded');
        row.classList.toggle('is-expanded', willExpand);
        toggle?.setAttribute('aria-expanded', String(willExpand));
      };
      toggle?.addEventListener('click', onToggle);

      const onEnter = (e: PointerEvent) => {
        if (e.pointerType === 'mouse') {
          rows.forEach(r => r.classList.remove('is-hovered'));
          row.classList.add('is-hovered');
        }
      };
      const onLeave = (e: PointerEvent) => {
        if (e.pointerType === 'mouse') {
          row.classList.remove('is-hovered');
        }
      };
      row.addEventListener('pointerenter', onEnter);
      row.addEventListener('pointerleave', onLeave);

      cleanups.push(() => {
        toggle?.removeEventListener('click', onToggle);
        row.removeEventListener('pointerenter', onEnter);
        row.removeEventListener('pointerleave', onLeave);
      });
    });

    const list = scope.querySelector<HTMLElement>('.xc-list');
    const onListLeave = () => {
      rows.forEach(r => r.classList.remove('is-hovered'));
    };
    list?.addEventListener('mouseleave', onListLeave);
    cleanups.push(() => {
      list?.removeEventListener('mouseleave', onListLeave);
    });

    // --- Floating photo that trails the cursor on desktop -----------------------
    const card = preview.current;
    if (card && list && !reduced) {
      const images = Array.from(card.querySelectorAll<HTMLImageElement>('img'));
      const label = card.querySelector<HTMLElement>('.xc-preview-label');
      const xTo = gsap.quickTo(card, 'x', { duration: 0.45, ease: 'power3' });
      const yTo = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3' });
      let shown = false;
      let hovered = -1;

      const place = (e: PointerEvent) => {
        const w = card.offsetWidth;
        const h = card.offsetHeight;
        const x = e.clientX + 28 + w > window.innerWidth ? e.clientX - w - 28 : e.clientX + 28;
        xTo(x);
        yTo(Math.min(window.innerHeight - h - 16, Math.max(16, e.clientY - h / 2)));
      };

      const show = (index: number) => {
        if (index === hovered || index < 0 || index >= rows.length) return;
        hovered = index;
        images.forEach((img, k) => img.classList.toggle('is-on', k === index));
        if (label) label.textContent = rows[index]?.dataset.name ?? '';
        if (!shown) {
          shown = true;
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
        }
      };

      const hide = () => {
        shown = false;
        hovered = -1;
        gsap.to(card, { opacity: 0, scale: 0.94, duration: 0.25, ease: 'power2.in', overwrite: 'auto' });
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        place(e);
        const row = (e.target as Element).closest<HTMLLIElement>('.xc-row');
        if (row) {
          show(rows.indexOf(row));
        } else {
          hide();
        }
      };

      list.addEventListener('pointermove', onMove);
      list.addEventListener('pointerleave', hide);
      cleanups.push(() => {
        list.removeEventListener('pointermove', onMove);
        list.removeEventListener('pointerleave', hide);
      });
    }

    if (reduced) return () => cleanups.forEach(fn => fn());

    // --- Entrance motion --------------------------------------------------------
    const text = buildTextReveals(scope);
    const settle = refreshOnSettle(scope);
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.xc-title-mask > span');
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.05)
        .from('.xc-hero .xp-eyebrow', { opacity: 0, y: 12, duration: 0.7 }, 0)
        .from('.xc-hero-lead', { opacity: 0, y: 18, duration: 0.8 }, 0.55)
        .from('.xc-glance div', { opacity: 0, y: 22, duration: 0.7, stagger: 0.08 }, 0.5);

      gsap.to('.xp-scroll-line', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true },
      });

      gsap.from(rows, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.04,
        scrollTrigger: { trigger: '.xc-list', start: 'top 85%', once: true },
      });

      gsap.from('.xc-standard-list li', {
        opacity: 0,
        x: -14,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '.xc-standard', start: 'top 80%', once: true },
      });
    }, scope);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      ctx.revert();
      settle();
      text();
      cleanups.forEach(fn => fn());
    };
  }, []);

  return (
    <div ref={root} className="xc">
      <div className="xp-scroll-line" aria-hidden="true" />

      {/* Hero */}
      <section className="xc-hero">
        <div className="xc-wrap xc-hero-grid">
          <div>
            <span className="xp-eyebrow">The catalog · {productCategories.length} product lines · {modelCount} models</span>
            <h1 aria-label="Every format food service needs.">
              <span className="xc-title-mask"><span>Every format</span></span>
              <span className="xc-title-mask"><span><em>food service needs.</em></span></span>
            </h1>
            <p className="xc-hero-lead">
              {productCategories.length} commercial container lines, one material standard: 100% prime virgin PP 05, US FDA 21 CFR 177.1520 certified, rated from deep freeze to microwave reheating.
            </p>
          </div>
          <div className="xc-glance">
            <div><b>{productCategories.length}</b><span>Categories</span></div>
            <div><b>{modelCount}</b><span>Models</span></div>
            <div><b>PP 05</b><span>Virgin Resin</span></div>
            <div><b>−20 · +120°C</b><span>Rated Range</span></div>
          </div>
        </div>
      </section>

      {/* Directory Index */}
      <section className="xc-index" id="index">
        <div className="xc-wrap">
          <div className="xc-index-head">
            <div>
              <span className="xp-eyebrow">01 / Commercial Packaging Lines</span>
              <h2 data-split>Find your <em>form.</em></h2>
            </div>
            <span className="xc-index-hint">
              {productCategories.length} certified series · Select a category to inspect full specs
            </span>
          </div>

          <ol className="xc-list">
            {productCategories.map((category, i) => {
              const num = String(i + 1).padStart(2, '0');
              const detailId = `xc-detail-${category.slug}`;
              const meta = getCategoryMeta(category);

              return (
                <li className="xc-row" key={category.id} data-name={category.name}>
                  <div className="xc-row-inner">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="xc-row-link"
                      aria-label={`View ${category.name} category`}
                    >
                      {/* Visual: Number & Thumbnail */}
                      <div className="xc-row-visual">
                        <span className="xc-num">{num}</span>
                        <div className="xc-row-thumb-box">
                          <img
                            className="xc-row-thumb"
                            src={category.heroImage}
                            alt=""
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Identity: Title & Subtitle */}
                      <div className="xc-row-main">
                        <h3>{category.name}</h3>
                        <span className="xc-row-sub">{category.subtitleName}</span>
                      </div>

                      {/* Specs & Capacities */}
                      <div className="xc-row-meta">
                        <div className="xc-meta-top">
                          <span className="xc-badge-count">{meta.countLabel}</span>
                          {meta.range && <span className="xc-meta-range">{meta.range}</span>}
                        </div>
                        {meta.pills.length > 0 && (
                          <div className="xc-meta-pills">
                            {meta.pills.map((pill, pi) => (
                              <span key={pi} className="xc-pill-tag">{pill}</span>
                            ))}
                            {meta.remainingCount > 0 && (
                              <span className="xc-pill-tag xc-pill-more">+{meta.remainingCount} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Arrow */}
                      <div className="xc-row-arrow" aria-hidden="true">
                        <ArrowUpRight size={18} />
                      </div>
                    </Link>

                    {/* Quick Specs Accordion Toggle */}
                    <div className="xc-row-ctrls">
                      <button
                        type="button"
                        className="xc-row-toggle"
                        aria-expanded={false}
                        aria-controls={detailId}
                        aria-label={`Toggle specifications for ${category.name}`}
                      >
                        <span>Quick Specs</span>
                        <ChevronDown size={14} className="xc-toggle-icon" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Drawer */}
                  <div className="xc-row-detail" id={detailId}>
                    <div className="xc-detail-inner">
                      <p>{category.shortDescription}</p>
                      <div className="xc-pills">
                        {category.features.slice(0, 4).map(f => (
                          <span key={f}>{f}</span>
                        ))}
                      </div>
                      <Link href={`/categories/${category.slug}`} className="xc-detail-link">
                        Explore {category.products.length === 1 ? 'the model' : `all ${category.products.length} models`} in {category.name} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Floating cursor preview card for desktop fine-pointers */}
        <div ref={preview} className="xc-preview" aria-hidden="true">
          {productCategories.map(category => (
            <img key={category.id} src={category.heroImage} alt="" loading="lazy" />
          ))}
          <span className="xc-preview-label" />
        </div>
      </section>

      {/* Polymer Standard Strip */}
      <section className="xc-standard">
        <div className="xc-wrap xc-standard-grid">
          <div>
            <span className="xp-eyebrow">02 / Polymer Specification</span>
            <h2 data-split>Every line, <em>the same polymer.</em></h2>
          </div>
          <ul className="xc-standard-list">
            {standard.map(item => (
              <li key={item}><i />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="xc-closing">
        <div className="xc-wrap">
          <span className="xp-eyebrow">Catalog &amp; Sample Kit</span>
          <h2 data-split>Specify it <em>in hand.</em></h2>
          <div className="xc-closing-actions">
            <Link href="/contact" className="xp-button">
              Discuss your requirements <ArrowRight size={18} />
            </Link>
            <Link href="/downloads" className="xp-button xp-button--ghost">
              Download the catalog <FileDown size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
