'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type Cleanup = () => void;

/**
 * Word-by-word mask reveal for every `[data-split]` heading inside `scope`.
 *
 * Line splitting depends on where text actually wraps, so the split is rebuilt
 * on resize: these headings wrap very differently at 380px than at 1440px, and
 * a split measured at one width leaves words masked out of view at the other.
 */
export function buildTextReveals(scope: HTMLElement): Cleanup {
  const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-split]'));
  if (!targets.length) return () => {};

  let splits: SplitText[] = [];
  let tweens: gsap.core.Tween[] = [];

  const teardown = () => {
    tweens.forEach(tween => { tween.scrollTrigger?.kill(); tween.kill(); });
    splits.forEach(split => split.revert());
    tweens = [];
    splits = [];
  };

  const build = () => {
    teardown();
    for (const el of targets) {
      const split = new SplitText(el, { type: 'lines,words', linesClass: 'xp-split-line' });
      splits.push(split);
      tweens.push(
        gsap.fromTo(
          split.words,
          { yPercent: 118, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.042,
            force3D: true,
            onStart: () => gsap.set(split.words, { willChange: 'transform' }),
            onComplete: () => gsap.set(split.words, { willChange: 'auto' }),
            scrollTrigger: { trigger: el, start: 'top 88%', once: true, fastScrollEnd: true },
          }
        )
      );
    }
  };

  // Splitting before webfonts settle measures the fallback font's line boxes,
  // so lines mask against the wrong height and words can stay clipped.
  let cancelled = false;
  const fonts = typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();
  fonts.then(() => { if (!cancelled) build(); });

  let timer: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(timer);
    // Mobile browsers fire resize on every address-bar show/hide during a
    // scroll; re-splitting on each one would be its own source of jank.
    timer = setTimeout(build, 280);
  };
  window.addEventListener('resize', onResize);

  return () => {
    cancelled = true;
    window.removeEventListener('resize', onResize);
    clearTimeout(timer);
    teardown();
  };
}

/**
 * Scroll-driven motion for the home experience.
 *
 * Everything here targets plain DOM that exists in both the 3D and the static
 * render path, so it runs on phones too — phones always fall back to static
 * mode below 768px, and gating this behind the 3D path is what used to leave
 * them with a completely motionless page. Amplitudes are scaled down on small
 * screens rather than switched off.
 *
 * `.xp-orbit` and `.xp-marquee-track` are deliberately left alone: both carry a
 * CSS transform/animation of their own that a GSAP transform would clobber.
 */
export function buildScrollMotion(scope: HTMLElement, live: boolean): Cleanup {
  const mm = gsap.matchMedia(scope);

  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, self => {
    const mobile = !!self.conditions?.mobile;
    // Narrow screens have far less room, so the same travel distances read as
    // content lurching around rather than as depth.
    const depth = mobile ? 0.55 : 1;
    const enter = (trigger: gsap.DOMTarget, start = 'top 86%') =>
      ({ trigger, start, once: true, fastScrollEnd: true });

    // --- Hero -------------------------------------------------------------
    gsap.to('.xp-hero-copy', {
      y: -95 * depth, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '#main-content', start: 'top top', end: 'bottom 25%', scrub: true },
    });
    gsap.to('.xp-hero-wordmark', {
      xPercent: -12 * depth, ease: 'none',
      scrollTrigger: { trigger: '#main-content', start: 'top top', end: 'bottom top', scrub: true },
    });

    // --- Page-long progress rail -----------------------------------------
    gsap.to('.xp-scroll-line', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true },
    });

    // --- Section entrances ------------------------------------------------
    const fadeUp = (selector: string, vars: gsap.TweenVars = {}) => {
      gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
        gsap.from(el, {
          y: 34 * depth, opacity: 0, duration: 0.75, ease: 'power2.out',
          force3D: true, scrollTrigger: enter(el), ...vars,
        });
      });
    };
    fadeUp('.xp-collection-heading > a');
    fadeUp('.xp-manufacturing-copy');
    fadeUp('.xp-recycling-note', { y: 20 * depth, duration: 0.6 });
    fadeUp('.xp-trust-heading');
    fadeUp('.xp-closing-note', { y: 18 * depth });

    const stats = gsap.utils.toArray<HTMLElement>('.xp-stats > div');
    if (stats.length) {
      gsap.from(stats, {
        y: 40 * depth, opacity: 0, duration: 0.7, ease: 'power2.out',
        stagger: 0.12, force3D: true, scrollTrigger: enter('.xp-stats'),
      });
    }

    // --- Manufacturing backdrop ------------------------------------------
    gsap.to('.xp-pattern', {
      yPercent: 20 * depth, rotation: 15 * depth, ease: 'none',
      scrollTrigger: { trigger: '#manufacturing', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // --- Static-path imagery ----------------------------------------------
    // In static mode these stills carry the page — on a phone they are the
    // page — so they get the parallax the 3D scene provides everywhere else.
    if (!live) {
      const parallax = (selector: string, distance: number) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
          gsap.fromTo(el,
            { yPercent: distance * depth },
            {
              yPercent: -distance * depth, ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });
      };
      parallax('.xp-hero-still img', 6);
      parallax('.xp-craft-image', 8);
      parallax('.xp-product > img', 7);

      const lineup = gsap.utils.toArray<HTMLElement>('.xp-lineup img');
      if (lineup.length) {
        gsap.from(lineup, {
          y: 46 * depth, opacity: 0, duration: 0.8, ease: 'power2.out',
          stagger: 0.1, force3D: true, scrollTrigger: enter('.xp-lineup', 'top 92%'),
        });
      }
    }
  });

  return () => mm.revert();
}

/**
 * Keeps ScrollTrigger's cached start/end positions honest.
 *
 * ScrollTrigger measures every trigger once, at creation. This page then grows
 * substantially as lazy images decode and webfonts swap in — worst on a phone,
 * where the static path renders six large stills over a slower connection.
 * Triggers measured against the short early layout end up with start positions
 * far below anywhere the user can actually scroll, so they never fire, which
 * looks exactly like "the scroll animations don't work".
 *
 * A ResizeObserver on the scope catches every one of those shifts. Comparing
 * scrollHeight keeps mobile address-bar resizes — which change the viewport but
 * not the content — from causing a refresh storm mid-scroll.
 */
export function refreshOnSettle(scope: HTMLElement): Cleanup {
  let timer: ReturnType<typeof setTimeout>;
  let lastHeight = scope.scrollHeight;
  let cancelled = false;

  const refresh = () => {
    if (cancelled) return;
    lastHeight = scope.scrollHeight;
    ScrollTrigger.refresh();
  };
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(refresh, 200);
  };

  const observer = new ResizeObserver(() => {
    if (Math.abs(scope.scrollHeight - lastHeight) > 4) schedule();
  });
  observer.observe(scope);

  window.addEventListener('load', schedule);
  if (typeof document !== 'undefined' && document.fonts) document.fonts.ready.then(schedule);

  return () => {
    cancelled = true;
    observer.disconnect();
    window.removeEventListener('load', schedule);
    clearTimeout(timer);
  };
}
