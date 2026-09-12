'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(Draggable, InertiaPlugin);

export interface LineCard {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  count: number;
}

interface Props {
  cards: LineCard[];
  // Called with the centred card's slug when it is clicked.
  onSelect: (slug: string) => void;
}

const VISIBLE = 3;            // cards rendered on each side of centre
const AUTO_EVERY = 3800;      // ms between auto-advances while idle
const IDLE_AFTER = 6000;      // ms of no interaction before auto-advance resumes

/**
 * Infinite coverflow of the product lines. One number — `progress`, in card
 * units — drives everything: each card's position, scale, tilt and opacity are
 * derived from its wrapped distance to `progress` on every render, so drag,
 * flick, wheel, keys, buttons and auto-advance are all just ways of moving
 * that one value.
 */
export default function LinesCarousel({ cards, onSelect }: Props) {
  const total = cards.length;
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const proxy = useRef<HTMLDivElement>(null);
  // Set once a press has moved far enough to count as a drag, so the click
  // that follows a flick does not also select a card.
  const dragged = useRef(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const state = useRef({ progress: 0, base: 0, spacing: 240, lastInteraction: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);

  const wrapDistance = useCallback((index: number, progress: number) => {
    let d = ((index - progress) % total + total) % total;
    if (d > total / 2) d -= total;
    return d;
  }, [total]);

  const render = useCallback(() => {
    const { progress, spacing } = state.current;
    let centre = 0, best = Infinity;
    refs.current.forEach((el, i) => {
      if (!el) return;
      const d = wrapDistance(i, progress);
      const abs = Math.abs(d);
      if (abs < best) { best = abs; centre = i; }
      const shown = abs <= VISIBLE + 0.5;
      const scale = Math.max(0.6, 1 - abs * 0.14);
      const opacity = shown ? Math.max(0, 1 - abs * 0.26) : 0;
      el.style.transform = `translate(-50%, -50%) translateX(${d * spacing}px) translateZ(${-abs * 80}px) rotateY(${d * -9}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(100 - Math.round(abs * 10));
      el.style.pointerEvents = shown ? 'auto' : 'none';
      el.setAttribute('aria-hidden', String(!shown));
      el.classList.toggle('is-centre', abs < 0.5);
    });
    setActive(centre);
    if (bar.current) {
      const p = ((progress % total) + total) % total;
      bar.current.style.transform = `scaleX(${(p + 1) / total})`;
    }
  }, [wrapDistance]);

  // Animate progress to a target (in card units).
  const goTo = useCallback((target: number, duration = 0.75) => {
    tween.current?.kill();
    state.current.lastInteraction = performance.now();
    tween.current = gsap.to(state.current, { progress: target, duration, ease: 'power3.out', onUpdate: render });
  }, [render]);
  const step = useCallback((dir: 1 | -1) => goTo(Math.round(state.current.progress) + dir), [goTo]);

  useEffect(() => {
    const el = root.current, drag = proxy.current, area = stage.current;
    if (!el || !drag || !area) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measure = () => {
      const card = refs.current[0];
      state.current.spacing = card ? Math.round(card.offsetWidth * 0.78) : 240;
      render();
    };
    measure();
    window.addEventListener('resize', measure);

    // Drag with flick momentum: velocity at release extends the snap target.
    // The stage is the trigger and a hidden proxy is what actually moves, so
    // the card buttons underneath keep receiving their own clicks.
    const [draggable] = Draggable.create(drag, {
      type: 'x', trigger: area, cursor: 'grab', activeCursor: 'grabbing',
      onPress() { tween.current?.kill(); dragged.current = false; state.current.base = state.current.progress; state.current.lastInteraction = performance.now(); },
      onDrag() { if (Math.abs(this.x) > 4) dragged.current = true; state.current.progress = state.current.base - this.x / state.current.spacing; render(); },
      onRelease() {
        const velocity = InertiaPlugin.getVelocity(drag, 'x');
        gsap.set(drag, { x: 0 });
        const throwCards = gsap.utils.clamp(-3, 3, -velocity / state.current.spacing * 0.22);
        goTo(Math.round(state.current.progress + throwCards), 0.9);
      },
    });

    // Horizontal wheel / trackpad.
    let wheelLock = 0;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!delta) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock < 450) return;
      wheelLock = now;
      step(delta > 0 ? 1 : -1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    el.addEventListener('keydown', onKey);

    // Auto-advance while nobody is interacting, and never for reduced motion.
    let hover = false;
    const onEnter = () => { hover = true; }, onLeave = () => { hover = false; };
    el.addEventListener('pointerenter', onEnter); el.addEventListener('pointerleave', onLeave);
    el.addEventListener('focusin', onEnter); el.addEventListener('focusout', onLeave);
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      if (reduced || hover || draggable.isDragging || document.hidden) { last = now; return; }
      if (now - state.current.lastInteraction < IDLE_AFTER) { last = now; return; }
      if (now - last >= AUTO_EVERY) { last = now; tween.current?.kill(); tween.current = gsap.to(state.current, { progress: Math.round(state.current.progress) + 1, duration: 1, ease: 'power2.inOut', onUpdate: render }); }
    };
    gsap.ticker.add(tick);

    return () => {
      draggable.kill(); tween.current?.kill(); gsap.ticker.remove(tick);
      window.removeEventListener('resize', measure);
      el.removeEventListener('wheel', onWheel); el.removeEventListener('keydown', onKey);
      el.removeEventListener('pointerenter', onEnter); el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('focusin', onEnter); el.removeEventListener('focusout', onLeave);
    };
  }, [render, goTo, step]);

  // A click on the centred card selects it; on any other card, centres it first.
  const onCardClick = (index: number) => {
    if (dragged.current) return;
    const d = wrapDistance(index, state.current.progress);
    if (Math.abs(d) < 0.5) onSelect(cards[index].slug);
    else goTo(state.current.progress + d);
  };

  return (
    <div ref={root} className="xpl" tabIndex={0} aria-roledescription="carousel" aria-label="Product lines">
      <div ref={stage} className="xpl-stage">
        {cards.map((card, i) => (
          <button
            type="button"
            key={card.slug}
            ref={el => { refs.current[i] = el; }}
            className="xpl-card"
            onClick={() => onCardClick(i)}
            aria-label={`${card.name}, ${card.count} model${card.count === 1 ? '' : 's'}`}
          >
            <img src={card.image} alt="" loading={i < 4 ? 'eager' : 'lazy'} draggable={false} />
            <span className="xpl-card-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="xpl-card-body">
              <span className="xpl-card-name">{card.name}</span>
              <span className="xpl-card-sub">{card.subtitle}</span>
              <span className="xpl-card-cta">Show {card.count} model{card.count === 1 ? '' : 's'} <ArrowUpRight size={14} /></span>
            </span>
          </button>
        ))}
        <div ref={proxy} className="xpl-proxy" aria-hidden="true" />
      </div>

      <div className="xpl-controls">
        <div className="xpl-progress" aria-hidden="true"><span ref={bar} /></div>
        <div className="xpl-nav">
          <span className="xpl-count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}</span>
          <button type="button" onClick={() => step(-1)} aria-label="Previous line"><ArrowLeft size={16} /></button>
          <button type="button" onClick={() => step(1)} aria-label="Next line"><ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
