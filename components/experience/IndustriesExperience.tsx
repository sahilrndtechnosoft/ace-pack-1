'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { industriesPage } from '@/lib/cms/pages/industries';
import type { CmsPageContent } from '@/lib/cms/registry';

const INDUSTRIES_DEFAULTS = Object.fromEntries(
  Object.entries(industriesPage.sections).map(([key, section]) => [key, section.content])
) as CmsPageContent<'industries'>;
import { productCategories } from '@/lib/data/products';
import { buildTextReveals, refreshOnSettle } from './experience-motion';
import './industries.css';

gsap.registerPlugin(ScrollTrigger);

const lineName = (slug: string) => productCategories.find(c => c.slug === slug)?.name ?? slug;


export default function IndustriesExperience({ content = INDUSTRIES_DEFAULTS, hidden = [] }: { content?: CmsPageContent<'industries'>; hidden?: string[] } = {}) {
  const show = (key: keyof CmsPageContent<'industries'>) => !hidden.includes(key);
  const { hero, segments, standard, closing } = content;
  const allIndustries = segments.items.map((item, i) => ({ ...item, slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `segment-${i + 1}` }));
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  // Set while the user is swiping the strip themselves, so the page-scroll
  // driven sync does not yank it out from under their thumb.
  const swiping = useRef<number>(0);
  const [active, setActive] = useState(0);
  const current = allIndustries[active] ?? allIndustries[0];

  // Touch layouts: keep the active card centred in the strip as the page scrolls.
  useEffect(() => {
    const bar = strip.current;
    if (!bar || bar.offsetParent === null) return;
    if (performance.now() < swiping.current) return;
    const card = bar.querySelectorAll<HTMLElement>('.xin-strip-card')[active];
    if (!card) return;
    bar.scrollTo({ left: card.offsetLeft - bar.clientWidth / 2 + card.offsetWidth / 2, behavior: 'smooth' });
  }, [active]);

  // Tap a strip card: scroll the page so that row sits under the strip.
  const jumpTo = (index: number) => {
    const row = root.current?.querySelectorAll<HTMLElement>('.xin-row')[index];
    const bar = strip.current;
    if (!row) return;
    const offset = (parseFloat(getComputedStyle(root.current!).getPropertyValue('--xp-header')) || 84) + (bar?.offsetHeight ?? 0) + 12;
    const y = row.getBoundingClientRect().top + window.scrollY - offset;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 0.9 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = Array.from(scope.querySelectorAll<HTMLLIElement>('.xin-row'));

    // Which row is passing the middle of the screen owns the panel. One
    // trigger per row; whichever is active last wins, so scrolling either way
    // hands off cleanly.
    const triggers = rows.map((row, i) => ScrollTrigger.create({
      trigger: row, start: 'top 55%', end: 'bottom 55%',
      onToggle: self => { if (self.isActive) setActive(i); },
    }));

    const bar = strip.current;
    const onStripTouch = () => { swiping.current = performance.now() + 1500; };
    bar?.addEventListener('pointerdown', onStripTouch, { passive: true });
    bar?.addEventListener('wheel', onStripTouch, { passive: true });

    if (reduced) return () => { triggers.forEach(t => t.kill()); bar?.removeEventListener('pointerdown', onStripTouch); bar?.removeEventListener('wheel', onStripTouch); };

    const text = buildTextReveals(scope);
    const settle = refreshOnSettle(scope);
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.xin-title-mask > span');
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.05)
        .from('.xin-hero .xp-eyebrow', { opacity: 0, y: 12, duration: 0.7 }, 0)
        .from('.xin-hero-lead', { opacity: 0, y: 18, duration: 0.8 }, 0.55)
        .from('.xin-glance div', { opacity: 0, y: 22, duration: 0.7, stagger: 0.08 }, 0.5);
      gsap.from('.xin-panel', { opacity: 0, y: 40, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: '.xin-index-grid', start: 'top 80%', once: true } });
      gsap.from('.xin-standard-list li', { opacity: 0, x: -14, duration: 0.55, ease: 'power2.out', stagger: 0.06, scrollTrigger: { trigger: '.xin-standard', start: 'top 80%', once: true } });
      // Touch layouts: each row's cover drifts inside its frame as it passes.
      gsap.matchMedia().add('(max-width: 900px)', () => {
        gsap.utils.toArray<HTMLElement>('.xin-row-cover img').forEach(img => {
          gsap.fromTo(img, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.04, ease: 'none',
            scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      });
    }, scope);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh); ctx.revert(); settle(); text(); triggers.forEach(t => t.kill());
      bar?.removeEventListener('pointerdown', onStripTouch); bar?.removeEventListener('wheel', onStripTouch);
    };
  }, []);

  // Panel number flips with a short rise whenever the active row changes.
  const numRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = numRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(el, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
  }, [active]);

  return (
    <div ref={root} className="xin">
      {show('hero') && (
      <section className="xin-hero" id="industries-hero">
        <div className="xin-wrap xin-hero-grid">
          <div>
            <span className="xp-eyebrow">{hero.eyebrow} · {allIndustries.length} segments</span>
            <h1 aria-label={`${hero.heading} ${hero.headingHighlight}`}>
              <span className="xin-title-mask"><span>{hero.heading}</span></span>
              <span className="xin-title-mask"><span><em>{hero.headingHighlight}</em></span></span>
            </h1>
            <p className="xin-hero-lead">{hero.lead}</p>
          </div>
          <div className="xin-glance">
            <div><b>{allIndustries.length}</b><span>Segments</span></div>
            <div><b>{productCategories.length}</b><span>Container lines</span></div>
            {hero.stats.map(stat => <div key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>)}
          </div>
        </div>
      </section>
      )}

      {show('segments') && (
      <section className="xin-index" id="segments">
        <div className="xin-wrap">
          <div className="xin-index-head">
            <span className="xp-eyebrow">{segments.eyebrow}</span>
            <h2 data-split>{segments.heading} <em>{segments.headingHighlight}</em></h2>
          </div>

          {/* Touch layouts only (hidden by CSS above 900px): the pinned panel's
              job — where am I, and let me jump — as a sticky swipeable strip
              that tracks the scroll and scrolls the page when tapped. */}
          <div ref={strip} className="xin-strip" role="tablist" aria-label="Jump to a segment">
            {allIndustries.map((industry, i) => (
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`xin-strip-card${i === active ? ' is-active' : ''}`}
                key={industry.slug}
                onClick={() => jumpTo(i)}
              >
                <img src={industry.image} alt="" loading="lazy" draggable={false} />
                <span className="xin-strip-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="xin-strip-name">{industry.title}</span>
              </button>
            ))}
          </div>

          <div className="xin-index-grid">
            <ol className="xin-rows">
              {allIndustries.map((industry, i) => (
                <li className={`xin-row${i === active ? ' is-active' : ''}`} key={industry.slug} id={industry.slug}>
                  <Link href={industry.link || '/categories'} className="xin-row-cover" aria-label={`${industry.title}: open the line`}>
                    <img src={industry.image} alt="" loading="lazy" />
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <b>{segments.buttonText} <ArrowUpRight size={13} /></b>
                  </Link>
                  <div className="xin-row-head">
                    <span className="xin-num">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{industry.title}</h3>
                  </div>
                  <p>{industry.description}</p>
                  {industry.needs.length > 0 && <ul className="xin-needs">{industry.needs.map(n => <li key={n}>{n}</li>)}</ul>}
                  {industry.lines.length > 0 && (
                    <div className="xin-lines">
                      <span>Served by</span>
                      {industry.lines.map(slug => <Link key={slug} href={`/categories/${slug}`}>{lineName(slug)} <ArrowUpRight size={12} /></Link>)}
                    </div>
                  )}
                </li>
              ))}
            </ol>

            {/* Pinned panel: all twelve photographs stacked, only the active one lit. */}
            <aside className="xin-panel" aria-hidden="true">
              <div className="xin-panel-media">
                {allIndustries.map((industry, i) => (
                  <img key={industry.slug} src={industry.image} alt="" className={i === active ? 'is-on' : ''} loading={i < 2 ? 'eager' : 'lazy'} />
                ))}
                <span ref={numRef} className="xin-panel-num">{String(active + 1).padStart(2, '0')}</span>
              </div>
              <div className="xin-panel-body">
                <span className="xp-eyebrow">Now viewing</span>
                <h3>{current?.title}</h3>
                {current?.needs.length > 0 && <ul className="xin-panel-needs">{current.needs.map(n => <li key={n}>{n}</li>)}</ul>}
                {current?.link && <Link href={current.link} className="xin-panel-cta" tabIndex={-1}>{segments.buttonText} <ArrowUpRight size={14} /></Link>}
              </div>
            </aside>
          </div>
        </div>
      </section>
      )}

      {show('standard') && (
      <section className="xin-standard" id="standard">
        <div className="xin-wrap xin-standard-grid">
          <div>
            <span className="xp-eyebrow">{standard.eyebrow}</span>
            <h2 data-split>{standard.heading} <em>{standard.headingHighlight}</em></h2>
          </div>
          <ul className="xin-standard-list">
            {standard.bullets.map(item => <li key={item}><i />{item}</li>)}
          </ul>
        </div>
      </section>
      )}

      {show('closing') && (
      <section className="xin-closing" id="closing">
        <div className="xin-wrap">
          <span className="xp-eyebrow">{closing.eyebrow}</span>
          <h2 data-split>{closing.heading} <em>{closing.headingHighlight}</em></h2>
          <p>{closing.description}</p>
          <Link href={closing.button.link} className="xp-button">{closing.button.text} <ArrowRight size={18} /></Link>
        </div>
      </section>
      )}
    </div>
  );
}
