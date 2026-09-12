'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Cleanup = () => void;

/**
 * Scroll and entrance motion for the About page. Heading word-reveals come
 * from buildTextReveals in experience-motion.ts (any [data-split] element);
 * this handles everything else. Amplitudes are scaled down on narrow screens
 * rather than switched off, and the timeline is only pinned from tablet up —
 * the phone stylesheet lays it out as a list.
 */
export function buildAboutMotion(scope: HTMLElement): Cleanup {
  const mm = gsap.matchMedia(scope);

  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, self => {
    const mobile = !!self.conditions?.mobile;
    const depth = mobile ? 0.55 : 1;
    const enter = (trigger: gsap.DOMTarget, start = 'top 86%') =>
      ({ trigger, start, once: true, fastScrollEnd: true });

    // --- Hero: masked title lines rise on load, lead and media follow --------
    const lines = gsap.utils.toArray<HTMLElement>('.xa-title-mask > span');
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.05)
      .from('.xa-hero .xp-eyebrow', { opacity: 0, y: 12, duration: 0.7 }, 0)
      .from('.xa-hero-lead', { opacity: 0, y: 18, duration: 0.8 }, 0.55)
      .from('.xa-hero-media', { opacity: 0, y: 40 * depth, scale: 0.98, duration: 1.1 }, 0.35)
      .from('.xa-hero-chip', { opacity: 0, y: 16, duration: 0.6 }, 0.95)
      .from('.xa-hero-bottom', { opacity: 0, duration: 0.6 }, 1.0);

    // Photo drifts inside its frame while the hero scrolls off.
    gsap.to('.xa-hero-media img', {
      yPercent: 9 * depth, ease: 'none',
      scrollTrigger: { trigger: '.xa-hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.xa-hero-grid', {
      y: -60 * depth, opacity: 0.35, ease: 'none',
      scrollTrigger: { trigger: '.xa-hero', start: 'top top', end: 'bottom 30%', scrub: true },
    });

    // --- Page-long progress rail ----------------------------------------------
    gsap.to('.xp-scroll-line', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true },
    });

    // --- Stats -------------------------------------------------------------------
    const stats = gsap.utils.toArray<HTMLElement>('.xa-stat');
    if (stats.length) {
      gsap.from(stats, {
        y: 34 * depth, opacity: 0, duration: 0.75, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: enter('.xa-stats'),
      });
    }

    // --- Overview ----------------------------------------------------------------
    gsap.fromTo('.xa-overview-media img',
      { yPercent: -7 * depth },
      { yPercent: 7 * depth, ease: 'none',
        scrollTrigger: { trigger: '.xa-overview-media', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.xa-overview-media', {
      opacity: 0, y: 40 * depth, duration: 0.9, ease: 'power2.out', scrollTrigger: enter('.xa-overview-media'),
    });
    const checks = gsap.utils.toArray<HTMLElement>('.xa-checks li');
    if (checks.length) {
      gsap.from(checks, {
        opacity: 0, x: -14, duration: 0.55, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: enter('.xa-checks', 'top 90%'),
      });
    }

    // --- Journey: horizontal track ------------------------------------------------
    const viewport = scope.querySelector<HTMLElement>('.xa-track-viewport');
    const track = scope.querySelector<HTMLElement>('.xa-track');
    const nodes = gsap.utils.toArray<HTMLElement>('.xa-node');
    const yearButtons = gsap.utils.toArray<HTMLButtonElement>('.xa-year-btn');
    const fill = scope.querySelector<HTMLElement>('.xa-track-line > span');
    const count = scope.querySelector<HTMLElement>('.xa-journey-count > b');
    const cleanups: Array<() => void> = [];

    if (viewport && track && nodes.length) {
      const dots = nodes.map(node => node.querySelector<HTMLElement>('.xa-node-dot'));
      const line = scope.querySelector<HTMLElement>('.xa-track-line');
      // Gold fill runs from the line's left edge to a point interpolated
      // between the two dots the traveller is currently between.
      const drawFill = (position: number) => {
        if (!fill || !line) return;
        const rect = line.getBoundingClientRect();
        const dotX = (k: number) => { const r = dots[k]?.getBoundingClientRect(); return r ? r.left + r.width / 2 - rect.left : 0; };
        const i = Math.min(nodes.length - 2, Math.max(0, Math.floor(position)));
        const t = Math.min(1, Math.max(0, position - i));
        const x = nodes.length > 1 ? dotX(i) + (dotX(i + 1) - dotX(i)) * t : dotX(0);
        gsap.set(fill, { scaleX: Math.max(0, Math.min(1, x / rect.width)) });
      };
      let active = 0;
      requestAnimationFrame(() => drawFill(0));
      const setActive = (index: number) => {
        if (index === active) return;
        active = index;
        nodes.forEach((el, k) => el.classList.toggle('is-active', k === index));
        yearButtons.forEach((el, k) => el.setAttribute('aria-pressed', String(k === index)));
        if (count) count.textContent = String(index + 1).padStart(2, '0');
      };

      if (!mobile) {
        // Anchored travel: node i sits with its dot on a fixed anchor point
        // (36% across the viewport) exactly when progress = i/(n-1). That keeps
        // "active" and "in view" the same thing — with edge-to-edge travel the
        // first node had scrolled half off-screen while still marked active —
        // and it means a year button lands every node in the identical spot.
        // Read lazily so a resize re-measures on ScrollTrigger's refresh.
        const anchor = () => viewport.clientWidth * 0.36;
        const step = () => (nodes[1] ? nodes[1].offsetLeft - nodes[0].offsetLeft : nodes[0].offsetWidth);
        const xAt = (position: number) => anchor() - (nodes[0].offsetLeft + position * step());
        const journey = gsap.fromTo(track, { x: () => xAt(0) }, {
          x: () => xAt(nodes.length - 1), ease: 'none', immediateRender: true,
          scrollTrigger: {
            trigger: '.xa-journey', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
            onUpdate: trigger => {
              const position = trigger.progress * (nodes.length - 1);
              setActive(Math.round(position));
              drawFill(position);
            },
          },
        });
        // Year buttons scroll the page to the point in the pinned range where
        // that node is centred, so the track visibly travels there.
        const jump = (event: Event) => {
          const index = Number((event.currentTarget as HTMLElement).dataset.index);
          const trigger = journey.scrollTrigger;
          if (!trigger || Number.isNaN(index)) return;
          const y = trigger.start + (trigger.end - trigger.start) * (index / (nodes.length - 1));
          const lenis = window.__lenis;
          if (lenis) lenis.scrollTo(y, { duration: 1.1 });
          else window.scrollTo({ top: y, behavior: 'smooth' });
        };
        yearButtons.forEach(button => button.addEventListener('click', jump));
        cleanups.push(() => yearButtons.forEach(button => button.removeEventListener('click', jump)));
      } else {
        // Native horizontal scroll: track whichever node is nearest the centre.
        let frame = 0;
        const sync = () => {
          frame = 0;
          const centre = viewport.scrollLeft + viewport.clientWidth / 2;
          let nearest = 0, best = Infinity;
          nodes.forEach((el, k) => {
            const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre);
            if (d < best) { best = d; nearest = k; }
          });
          setActive(nearest);
          drawFill(nearest);
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(sync); };
        viewport.addEventListener('scroll', onScroll, { passive: true });
        const jump = (event: Event) => {
          const index = Number((event.currentTarget as HTMLElement).dataset.index);
          nodes[index]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        };
        yearButtons.forEach(button => button.addEventListener('click', jump));
        cleanups.push(() => {
          viewport.removeEventListener('scroll', onScroll);
          if (frame) cancelAnimationFrame(frame);
          yearButtons.forEach(button => button.removeEventListener('click', jump));
        });
      }
    }

    // --- MD's desk ------------------------------------------------------------------
    gsap.from('.xa-desk blockquote', {
      opacity: 0, y: 28 * depth, duration: 1, ease: 'power2.out', scrollTrigger: enter('.xa-desk blockquote', 'top 82%'),
    });
    gsap.from('.xa-desk-sign', {
      opacity: 0, y: 14, duration: 0.7, ease: 'power2.out', delay: 0.25, scrollTrigger: enter('.xa-desk-sign', 'top 92%'),
    });

    // --- Plant backdrop -----------------------------------------------------------------
    gsap.to('.xa-pattern', {
      yPercent: 20 * depth, rotation: 15 * depth, ease: 'none',
      scrollTrigger: { trigger: '.xa-plant', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // --- Staggered groups ------------------------------------------------------------------
    for (const [container, item] of [
      ['.xa-values-grid', '.xa-value'],
      ['.xa-plant-grid', '.xa-plant-stat'],
      ['.xa-lead-grid', '.xa-lead'],
      ['.xa-certs-grid', '.xa-cert'],
    ] as const) {
      const items = gsap.utils.toArray<HTMLElement>(item);
      if (!items.length) continue;
      gsap.from(items, {
        y: 36 * depth, opacity: 0, duration: 0.75, ease: 'power2.out', stagger: 0.09,
        scrollTrigger: enter(container),
      });
    }
    gsap.from('.xa-plant-copy', { opacity: 0, y: 24 * depth, duration: 0.75, ease: 'power2.out', scrollTrigger: enter('.xa-plant-copy') });
    gsap.from('.xa-closing-note', { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out', scrollTrigger: enter('.xa-closing-note', 'top 95%') });

    return () => cleanups.forEach(fn => fn());
  });

  return () => mm.revert();
}
