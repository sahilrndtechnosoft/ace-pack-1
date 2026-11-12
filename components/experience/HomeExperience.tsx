'use client';

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, MotionConfig, useReducedMotion, type MotionProps } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ArrowRight, Plus, Rotate3D, MoveUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products, containerFinishes, initialSceneState, defaultFinish } from './config';
import { buildScrollMotion, buildTextReveals, refreshOnSettle } from './experience-motion';
import './experience.css';
import CountUp from 'react-countup';
import { QualityCertificationsSection } from '@/components/sections/QualityCertificationsSection';
import { ExportMarketingSection } from '@/components/sections/ExportMarketingSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { ProductShowcaseCarousel } from '@/components/products/ProductShowcaseCarousel';
import { PreFooterCTA } from '@/components/sections/PreFooterCTA';
import { ObserverCollectionShowcase } from './ObserverCollectionShowcase';
import { CatalogueHero } from '@/components/hero/CatalogueHero';
import { TrustCardsSection } from './TrustCardsSection';
import { homePage } from '@/lib/cms/pages/home';
import { useSiteText } from '@/components/layout/SiteTextProvider';
import type { CmsPageContent } from '@/lib/cms/registry';

const HOME_DEFAULTS = Object.fromEntries(
  Object.entries(homePage.sections).map(([key, section]) => [key, section.content])
) as CmsPageContent<'home'>;

const PackagingScene = dynamic(() => import('./PackagingScene'), { ssr: false });
// In-page 3D container (phones, tablets, reduced motion) and the full-screen inspector; both
// load only when shown. Until the in-page one is ready, its placeholder is the product photo.
const InlineModelViewer = dynamic(() => import('./InlineModelViewer'), { ssr: false });
const ModelInspector = dynamic(() => import('./ModelInspector'), { ssr: false });
gsap.registerPlugin(ScrollTrigger);
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
function MagneticLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  return <Link ref={ref} href={href} className={`xp-button ${className}`} onPointerMove={e => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect(); gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * .13, y: (e.clientY - r.top - r.height / 2) * .18, duration: .3, overwrite: true });
  }} onPointerLeave={() => { if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: .5, overwrite: true }); }}>{children}<ArrowUpRight size={18} /></Link>;
}
// `initial` must not depend on useReducedMotion(): it is null on the server
// and true on a reduced-motion client, so the two would hydrate differently.
// MotionConfig reducedMotion="user" already snaps the transform for those users.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
function Count({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <span className="xp-counter-number">
      <CountUp end={value} duration={2} separator="," enableScrollSpy scrollSpyOnce />
      <span>{suffix}</span>
    </span>
  );
}
export default function HomeExperience({ content = HOME_DEFAULTS, hidden = [] }: { content?: CmsPageContent<'home'>; hidden?: string[] } = {}) {
  const show = (key: keyof CmsPageContent<'home'>) => !hidden.includes(key);
  const { craft, manufacturing } = content;
  const L = useSiteText().labels;
  const root = useRef<HTMLDivElement>(null), state = useRef(initialSceneState());
  const [mode, setMode] = useState<'pending' | '3d' | 'static'>('pending');
  const [ready, setReady] = useState(false), [progress, setProgress] = useState(0), [loadRange, setLoadRange] = useState(false);
  const [renderActive, setRenderActive] = useState(true), [activeProduct, setActiveProduct] = useState(0);
  const [craftPhase, setCraftPhase] = useState(0), [openLid, setOpenLid] = useState(false), [fallbackReason, setFallbackReason] = useState('');
  const [finish, setFinish] = useState(defaultFinish); const [chapter, setChapter] = useState('main-content'); const dragging = useRef<number | null>(null); const [inspectorOpen, setInspectorOpen] = useState(false); const closeInspector = useCallback(() => setInspectorOpen(false), []);
  // Phones/tablets: the craft section pins while its scroll swaps the facts and turns the in-page model.
  const onCraftProgress = useCallback((p: number) => setCraftPhase(Math.min(2, Math.floor(p * 3))), []); const reduced = useReducedMotion();
  const onReady = useCallback(() => { setReady(true); }, []);
  const onFailure = useCallback(() => { setFallbackReason('renderer-unavailable'); setMode('static'); setReady(true); }, []);
  useEffect(() => {
    if (mode !== '3d' || !root.current) return;
    const scope = root.current;
    const measure = () => {
      const viewport = scope.querySelector('.xp-scene-layer')?.getBoundingClientRect();
      if (!viewport?.width || !viewport.height) return;
      const owners = Array.from(scope.querySelectorAll<HTMLElement>('.xp-hero-copy,.xp-fact,.xp-product-copy,.export-preparation,.xp-closing>div'));
      const copies: DOMRect[] = []; let stacked = false;
      for (const owner of owners) {
        const rect = owner.getBoundingClientRect();
        const panel = owner.closest<HTMLElement>('.xp-fact,.xp-product');
        if (panel?.getAttribute('aria-hidden') === 'true' && Number(getComputedStyle(panel).opacity) < .05) continue;
        if (rect.bottom <= viewport.top || rect.top >= viewport.bottom) continue;
        stacked ||= rect.width > viewport.width * .6 || !!owner.closest('.xp-closing');
        for (const leaf of owner.querySelectorAll('h1,h2,h3,p,dl,.xp-button,.xp-eyebrow,.xp-finishes')) {
          const text = leaf.getBoundingClientRect();
          if (text.height && text.bottom > viewport.top && text.top < viewport.bottom) copies.push(text);
        }
      }
      const headings = Array.from(scope.querySelectorAll('.xp-hero-caption,.xp-section-heading h2,.xp-collection-heading')).map(el => el.getBoundingClientRect()).filter(r => r.height && r.bottom > viewport.top && r.top < viewport.bottom);
      let top = viewport.top + 16, left = viewport.left + 16, bottom = viewport.bottom - 24;
      if (stacked) top = Math.max(top, ...copies.map(r => r.bottom + 16), ...headings.map(r => r.bottom + 16));
      else { left = Math.max(left, ...copies.map(r => r.right + 24)); top = Math.max(top, ...headings.map(r => r.bottom + 16)); }
      for (const selector of ['.xp-inspect', '.xp-hero-bottom', '.xp-closing-note', '#manufacturing', '.xp-trust', 'body>footer']) {
        const el = selector === 'body>footer' ? document.querySelector(selector) : scope.querySelector(selector);
        const rect = el?.getBoundingClientRect();
        if (rect && rect.top > viewport.top && rect.top < viewport.bottom) bottom = Math.min(bottom, rect.top - 16);
      }
      if (stacked) {
        const intervals = [...copies, ...headings].map(r => [Math.max(viewport.top + 16, r.top - 16), Math.min(bottom, r.bottom + 16)]).filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
        let cursor = viewport.top + 16, bestTop = cursor, bestBottom = cursor;
        for (const [start, end] of [...intervals, [bottom, bottom]]) {
          if (start - cursor > bestBottom - bestTop || (start === bottom && start - cursor >= 80)) { bestTop = cursor; bestBottom = start; }
          cursor = Math.max(cursor, end);
        }
        // Not enough room in any gap: never move the model up over the copy. It goes in the
        // band below the lowest text, even if that makes it small or runs past the fold.
        if (bestBottom - bestTop < 80) {
          top = Math.max(viewport.top + 16, ...intervals.map(([, end]) => end));
          bottom = Math.max(bottom, top + 80);
        } else { top = bestTop; bottom = bestBottom; }
      }
      state.current.frame = { left: (left - viewport.left) / viewport.width, top: (top - viewport.top) / viewport.height, right: 1 - 16 / viewport.width, bottom: (bottom - viewport.top) / viewport.height };
    };
    let pending = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const requestMeasure = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          measure();
          pending = false;
        });
      }
    };
    // Re-measure during the scroll (once per frame) as well as after it settles, so the
    // model never sits on stale coordinates while text panels move past it.
    const onScroll = () => {
      requestMeasure();
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(requestMeasure, 60);
    };
    measure();
    window.addEventListener('resize', requestMeasure);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', requestMeasure);
      window.removeEventListener('scroll', onScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
      delete state.current.frame;
    };
  }, [mode]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Below desktop width the 3D container lives inside the page (InlineModelViewer) instead of
    // the fixed full-screen scene, so it always has its own space and never covers the copy.
    const compact = window.matchMedia('(max-width: 1023px)');
    // Phones get the 3D scene too; the old `(max-width:767px)` clause here put
    // every phone on the static stills, which is why mobile had nothing moving.
    //
    // Deliberately no hardware pre-check. deviceMemory/hardwareConcurrency are
    // crude and widely under-reported — Safari omits deviceMemory entirely, it
    // needs a secure context so it is undefined over a LAN IP, and privacy
    // modes pin hardwareConcurrency to 2 — so gating the headline feature on
    // them took 3D away from capable desktops. Capability is instead measured
    // for real: SceneBoundary catches a renderer that throws, the
    // webglcontextlost handler catches one that dies, and the load timeout
    // catches one that never arrives. All three fall back to stills.
    const detect = () => {
      if (media.matches) { setFallbackReason('motion-preference'); setMode('static'); setReady(true); return; }
      if (compact.matches) { setFallbackReason('in-page-model'); setMode('static'); setReady(true); return; }
      setFallbackReason(''); setMode('3d'); setReady(false);
    };
    detect();
    media.addEventListener('change', detect);
    compact.addEventListener('change', detect);
    return () => { media.removeEventListener('change', detect); compact.removeEventListener('change', detect); };
  }, []);
  useEffect(() => {
    if (mode !== '3d' || ready) return;
    const timeout = window.setTimeout(onFailure, 30000); return () => clearTimeout(timeout);
  }, [mode, ready, onFailure]);
  useEffect(() => { const tween = gsap.to(state.current, { inspect: openLid ? 1 : 0, duration: .8, ease: 'power2.inOut' }); return () => { tween.kill(); }; }, [openLid, mode]);
  useEffect(() => { const tween = gsap.to(state.current, { finish, duration: .65, ease: 'power2.inOut' }); return () => { tween.kill(); }; }, [finish, mode]);
  useEffect(() => {
    if (mode !== '3d') return;
    const craft = document.getElementById('craft'); if (!craft) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setLoadRange(true); observer.disconnect(); } }, { rootMargin: '1000px' });
    observer.observe(craft); return () => observer.disconnect();
  }, [mode]);
  // Scroll-driven DOM motion and heading text reveals. Both run in either
  // render mode: phones always fall back to static mode below 768px, and
  // gating this behind the 3D path is what used to leave them motionless.
  useEffect(() => {
    const scope = root.current;
    if (mode === 'pending' || !scope || reduced) return;
    const motion = buildScrollMotion(scope, mode === '3d');
    const text = buildTextReveals(scope);
    const settle = refreshOnSettle(scope);
    // Both effects have committed by the time this frame runs, so one refresh
    // here also re-measures the scene triggers created below.
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(refresh); settle(); text(); motion(); };
  }, [mode, reduced]);
  // Scene-state scrubbing — genuinely 3D-only, since it drives the values the
  // renderer reads and the layer it draws into.
  useEffect(() => {
    if (mode !== '3d' || !root.current) return;
    const ctx = gsap.context(() => {
      const headerOffset = () => document.querySelector('body>header')?.getBoundingClientRect().height ?? 84;
      ['main-content', 'craft', 'collection', 'products-showcase', 'manufacturing', 'closing'].forEach(id => ScrollTrigger.create({ trigger: `#${id}`, start: 'top 55%', end: 'bottom 55%', onToggle: self => { if (self.isActive) setChapter(id); } }));
      gsap.set('.xp-scene-layer', { opacity: 0, pointerEvents: 'none' });
      gsap.fromTo('.xp-scene-layer', { opacity: 0 }, {
        opacity: 1,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: '#craft',
          start: 'top bottom',
          end: 'top center',
          scrub: 0.35,
        }
      });
      gsap.fromTo(state.current, { hero: 0 }, { hero: 1, immediateRender: false, ease: 'none', scrollTrigger: { trigger: '#craft', start: 'top bottom', end: () => `top ${headerOffset()}`, scrub: .35 } });
      gsap.fromTo(state.current, { craft: 0 }, { craft: 1, immediateRender: false, ease: 'none', scrollTrigger: { trigger: '#craft', start: () => `top ${headerOffset()}`, end: 'bottom bottom', scrub: .6, onUpdate: self => { setCraftPhase(Math.min(2, Math.floor(self.progress * 3))); } } });
      gsap.fromTo(state.current, { finale: 0 }, {
        finale: 1, ease: 'none', immediateRender: false,
        onUpdate: () => {
          const progress = state.current.finale;
          const active = progress < .999;
          if (state.current.active !== active) { state.current.active = active; setRenderActive(active); }
          gsap.set('.xp-scene-layer', { opacity: 1 - progress, visibility: active ? 'visible' : 'hidden' });
        },
        scrollTrigger: { trigger: '#craft', start: 'bottom bottom', end: 'bottom 65%', scrub: .35 }
      });
    }, root);
    const pointer = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; state.current.pointerX = e.clientX / window.innerWidth * 2 - 1; state.current.pointerY = 1 - e.clientY / window.innerHeight * 2; };
    window.addEventListener('pointermove', pointer, { passive: true });
    return () => { gsap.killTweensOf('.xp-scene-layer'); ctx.revert(); window.removeEventListener('pointermove', pointer); state.current = initialSceneState(); };
  }, [mode]);
  const live = mode === '3d';
  // Static mode (every phone, plus desktop "still" mode) has no scene driving
  // these panels, so they render stacked and previously appeared with no
  // entrance motion at all — the bulk of the mobile page was motionless.
  // Reveal them on scroll instead. Keyed on `revealMotion` so resolving the
  // mode remounts the element and framer-motion actually applies `initial`;
  // the server-rendered markup stays visible, so content survives without JS.
  const revealMotion = mode !== 'pending' && !live && !reduced;
  const pinnedCraft = mode === 'static' && fallbackReason === 'in-page-model';
  const panelMotion = (visible: boolean, offset: number): MotionProps => revealMotion
    ? { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .15 } }
    : { animate: { opacity: visible ? 1 : 0, y: visible ? 0 : offset } };
  return <MotionConfig reducedMotion="user"><div ref={root} className={`xp-home ${live ? 'xp-live' : 'xp-static'}`} data-render-reason={fallbackReason}>
    <a href="#main-content" className="xp-skip">Skip to content</a>
    {live && <div className="xp-scene-layer" style={{ opacity: 0 }} aria-hidden="true"><SceneBoundary onError={onFailure}><PackagingScene state={state} renderActive={renderActive} loadRange={loadRange} onReady={onReady} onProgress={setProgress} onFailure={onFailure} /></SceneBoundary></div>}
    <nav className="xp-chapters" aria-label="Homepage chapters">{['main-content', 'craft', 'collection', 'products-showcase', 'manufacturing', 'closing'].map((id, i) => [id, L.homeChapters[i] ?? id]).map(([id, label], i) => <a key={id} href={`#${id}`} aria-label={`Jump to ${label}`} aria-current={chapter === id ? 'location' : undefined}><span>{label}</span><b>0{i + 1}</b></a>)}</nav>
    {show('hero_banner') && <CatalogueHero content={content.hero_banner} />}
    {show('craft') && <section id="craft" className={`xp-craft${pinnedCraft ? ' xp-craft--pinned' : ''}`}><div className="xp-craft-stage"><div className="xp-story-top"><span className="xp-eyebrow">{craft.eyebrow}</span><span className="xp-eyebrow">{craft.sideNote}</span></div><div className="xp-section-heading"><h2 data-split>{craft.heading} <em>{craft.headingHighlight}</em></h2></div><div className="xp-craft-facts">{craft.facts.map((fact, i) => <motion.div key={`${fact.title}-${revealMotion}`} className="xp-fact" aria-hidden={(live || pinnedCraft) && craftPhase !== i} {...(pinnedCraft ? { animate: { opacity: craftPhase === i ? 1 : 0, y: craftPhase === i ? 0 : 24 } } : panelMotion(!live || craftPhase === i, 24))} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}><span className="xp-eyebrow">{fact.tag}</span><h3>{fact.title.split('\n').map(line => <span key={line}>{line}</span>)}</h3><p>{fact.body}</p><span className="xp-detail-rule" /></motion.div>)}</div>{!live && <InlineModelViewer className="xp-craft-image" fallbackSrc={craft.image} fallbackAlt={craft.imageAlt} animate={!reduced} pinned={pinnedCraft} onProgress={pinnedCraft ? onCraftProgress : undefined} triggerSelector="#craft" />}{live && <div className="xp-craft-drag" aria-hidden="true" onPointerDown={e => { dragging.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (dragging.current === null) return; state.current.drag += (e.clientX - dragging.current) * .01; dragging.current = e.clientX; }} onPointerUp={() => { dragging.current = null; }} onPointerCancel={() => { dragging.current = null; }} />}<button type="button" className="xp-inspect-3d" onClick={() => setInspectorOpen(true)}><Rotate3D size={16} aria-hidden="true" />Inspect in 3D · drag &amp; zoom</button></div></section>}
    {/* GSAP Observer Dual-Wrapper Counter-Sliding Collection Section */}
    {show('collection') && <ObserverCollectionShowcase content={content.collection} />}

    {/* Immediate Product Offering Prominence: Signature Product Carousel */}
    {show('product_carousel') && <div id="products-showcase">
      <ProductShowcaseCarousel content={content.product_carousel} />
    </div>}

    {show('manufacturing') && <section id="manufacturing" className="xp-manufacturing"><div className="xp-pattern" aria-hidden="true" /><div className="xp-manufacturing-top"><span className="xp-eyebrow">{manufacturing.eyebrow}</span><Plus size={30} /></div><Reveal><h2 data-split>{manufacturing.heading}<br /><em>{manufacturing.headingHighlight}</em></h2></Reveal><div className="xp-manufacturing-copy"><p>{manufacturing.body}</p><Link href={manufacturing.link.link}>{manufacturing.link.text} <ArrowUpRight size={19} /></Link></div><div className="xp-stats">{manufacturing.stats.map(stat => <div key={stat.label}><Count value={Number(stat.value) || 0} suffix={stat.suffix} /><p>{stat.label}</p></div>)}</div><p className="xp-recycling-note">{manufacturing.note}</p></section>}

    {/* Trusted at scale - Interactive Scroll-driven Industry Cards */}
    {show('industries') && <TrustCardsSection content={content.industries} />}

    {/* Homepage Certifications & Quality Credentials */}
    {show('certifications') && <QualityCertificationsSection content={content.certifications} />}

    {/* Dedicated Export Marketing Section ("Every container we ship for export is carefully planned/prepared for delivery") */}
    {show('export') && <ExportMarketingSection content={content.export} />}

    {/* Help & FAQ with Factory Inquiry Form */}
    {show('faq') && <FaqSection content={content.faq} />}

    {/* Pre-Footer Call to Action & Gated Catalogue Download */}
    {show('closing_cta') && <PreFooterCTA content={content.closing_cta} />}

    <div id="footer" aria-hidden="true" />
    {inspectorOpen && <ModelInspector open onClose={closeInspector} title={`${craft.heading} ${craft.headingHighlight}`.trim()} />}
  </div></MotionConfig>;
}
