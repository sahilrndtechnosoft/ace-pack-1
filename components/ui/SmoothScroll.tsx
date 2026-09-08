'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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

// Fixed header height, so in-page anchors don't land underneath it.
const headerOffset = () =>
  document.querySelector('body>header')?.getBoundingClientRect().height ?? 88;

// Site-wide smooth scroll, and the single owner of the page's Lenis instance —
// the home page included. `/` used to opt out here and run a second, separate
// Lenis of its own (the former ExperienceScroll component, now removed), which
// is why the home page had no smooth scrolling: that component installed a
// ScrollTrigger.scrollerProxy on document.documentElement, and because
// documentElement counts as a viewport, GSAP registered it for window, body
// and documentElement at once — taking over the scroll accessors for every
// trigger on the page. Worse, its teardown called scrollerProxy(el) with no
// vars, which only clears GSAP's _scrollers cache and never removes the entry
// from _proxies, so the proxy leaked past the home page still holding a
// destroyed Lenis.
//
// There is deliberately no scrollerProxy here. Lenis scrolls the real window
// (it is not a transform-based scroller like Locomotive), so ScrollTrigger's
// defaults already read the correct position. Ticking Lenis from GSAP's own
// rAF loop and pushing each Lenis scroll event into ScrollTrigger.update is
// the entire integration, and it keeps ScrollTrigger-driven reveals in
// lockstep with the smoothed position instead of a frame behind.
export const SmoothScroll: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Mobile browsers fire resize on every URL-bar show/hide. Without this,
    // ScrollTrigger re-measures mid-gesture and scroll-driven animations
    // visibly stall or snap on phones.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Someone who asked the OS for less motion gets the browser's own
    // scrolling. So do touch devices: Lenis leaves touch to the OS anyway
    // (syncTouch is off, since smoothed touch fights the platform's fling
    // physics), so an instance there is a rAF loop running for nothing.
    const nativeScroll =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    let resize: (() => void) | undefined;

    if (!nativeScroll) {
      const instance = new Lenis({
        // `lerp` rather than `duration`: duration tweens every wheel gesture
        // over a fixed 1.1s, so the page keeps coasting after the wheel has
        // stopped — which is exactly what reads as "laggy" even at a solid
        // 60fps. A lerp chases the real scroll position each frame instead, so
        // it stays smooth but arrives with the gesture.
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis = instance;
      window.__lenis = instance;

      instance.on('scroll', ScrollTrigger.update);

      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Page height changes (images, fonts, the home page's 3D scene mounting)
      // arrive as a ScrollTrigger.refresh; Lenis has to re-measure at the same
      // moment or it keeps clamping scroll to a stale document height.
      resize = () => instance.resize();
      ScrollTrigger.addEventListener('refresh', resize);
    }

    // In-page anchors (#craft, #product-*, the skip link) — routed through
    // Lenis where it runs and through native smooth scroll where it doesn't,
    // so the header offset and focus handoff behave the same either way.
    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      const settle = () => {
        history.replaceState(null, '', hash);
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      };

      if (lenis) {
        lenis.scrollTo(target, { offset: -headerOffset(), onComplete: settle });
      } else {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerOffset(),
          behavior: 'smooth',
        });
        settle();
      }
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      if (tick) gsap.ticker.remove(tick);
      if (resize) ScrollTrigger.removeEventListener('refresh', resize);
      if (lenis) {
        lenis.destroy();
        delete window.__lenis;
      }
    };
  }, [pathname]);

  return null;
};
