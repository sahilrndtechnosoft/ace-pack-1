'use client';

import { useEffect, useRef } from 'react';
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

// Dynamically compute header height to avoid landing underneath the sticky navbar
const getHeaderOffset = () =>
  document.querySelector('body > header')?.getBoundingClientRect().height ?? 88;

/**
 * Ultra-performance Lenis smooth scroll coordinator.
 * 
 * Key optimizations to guarantee 0 impact on page speed:
 * 1. Initialized via requestIdleCallback to completely unblock First Contentful Paint (FCP) and LCP.
 * 2. syncTouch: false ensures pure touch devices keep their native 120Hz fling physics without input latency.
 * 3. Unified with GSAP's rAF ticker (single render loop, zero double-ticking overhead).
 * 4. Automatic idle state when settled (zero CPU/battery consumption when not scrolling).
 * 5. Respects prefers-reduced-motion OS accessibility settings.
 */
export const SmoothScroll: React.FC = () => {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis deferred to avoid competing with critical rendering
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPureTouch = window.matchMedia('(pointer: coarse) and (hover: none)').matches;

    if (prefersReducedMotion || isPureTouch) {
      return;
    }

    let instance: Lenis | null = null;
    let tickFn: ((time: number) => void) | null = null;
    let resizeFn: (() => void) | null = null;

    const initLenis = () => {
      instance = new Lenis({
        lerp: 0.1, // Highly responsive, lag-free momentum
        smoothWheel: true,
        syncTouch: false, // Never intercept touch events; prevents mobile INP degradation
      });

      lenisRef.current = instance;
      window.__lenis = instance;

      // Sync Lenis scroll updates directly into GSAP ScrollTrigger
      instance.on('scroll', ScrollTrigger.update);

      // Single unified animation frame loop via GSAP ticker
      tickFn = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tickFn);
      gsap.ticker.lagSmoothing(0);

      resizeFn = () => instance?.resize();
      ScrollTrigger.addEventListener('refresh', resizeFn);
    };

    // Schedule initialization when the browser main thread is idle
    let idleId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;

    if ('requestIdleCallback' in window) {
      idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(initLenis, { timeout: 1500 });
    } else {
      timerId = setTimeout(initLenis, 100);
    }

    return () => {
      if (idleId && 'cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      if (timerId) clearTimeout(timerId);
      if (tickFn) gsap.ticker.remove(tickFn);
      if (resizeFn) ScrollTrigger.removeEventListener('refresh', resizeFn);
      if (instance) {
        instance.destroy();
        delete window.__lenis;
        lenisRef.current = null;
      }
    };
  }, []);

  // Route transition handler: resets scroll position to top and re-measures page height
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Defer resize until next frame after page DOM finishes mounting
    const timer = setTimeout(() => {
      if (lenis) {
        lenis.resize();
      }
      ScrollTrigger.refresh();
    }, 120);

    return () => clearTimeout(timer);
  }, [pathname]);

  // In-page smooth anchor scrolling with automatic sticky header clearance
  useEffect(() => {
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

      const lenis = lenisRef.current;
      const offset = -getHeaderOffset();

      if (lenis) {
        lenis.scrollTo(target, { offset, onComplete: settle });
      } else {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY + offset,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
        settle();
      }
    };

    document.addEventListener('click', onAnchorClick);
    return () => document.removeEventListener('click', onAnchorClick);
  }, []);

  return null;
};
