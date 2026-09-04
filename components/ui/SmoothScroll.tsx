'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Site-wide smooth scroll. Ticked from GSAP's own rAF loop and reports back
// into ScrollTrigger on every frame so the two stay in lockstep — without
// this, ScrollTrigger-driven reveals (Reveal.tsx, SplitHeading.tsx) lag a
// frame behind the smoothed scroll position and visibly judder.
export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    // Someone who has asked the OS for less motion gets the browser's own
    // scrolling, which is also the cheapest path on a slow machine.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      // `lerp` rather than `duration`: duration tweens every wheel gesture over
      // a fixed 1.1s, so the page keeps coasting after the wheel has stopped —
      // which is exactly what reads as "laggy" even at a solid 60fps. A lerp
      // chases the real scroll position each frame instead, so it stays smooth
      // but arrives with the gesture.
      lerp: 0.12,
      smoothWheel: true,
      // Phones keep native scrolling: smoothed touch fights the OS's own
      // fling physics and is where Lenis feels worst.
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    window.__lenis = lenis;

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
};
