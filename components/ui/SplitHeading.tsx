'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface SplitHeadingProps {
  // A single heading element (h1/h2/h3...) whose text content gets split.
  children: React.ReactElement;
  delay?: number;
  start?: string;
}

// Wraps a heading with a word-by-word "reveal from behind a mask" animation:
// each line is clipped with overflow-hidden and its words slide up from
// below into place. Rebuilds on resize/orientation change so mobile line
// wrapping (which differs from desktop) always gets a correctly-masked
// split instead of the stale desktop layout.
export const SplitHeading: React.FC<SplitHeadingProps> = ({
  children,
  delay = 0,
  start = 'top 90%',
}) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let split: SplitText | undefined;
    let tween: gsap.core.Tween | undefined;

    const build = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
      split = undefined;
      if (document.documentElement.dataset.siteLanguage && document.documentElement.dataset.siteLanguage !== 'en') return;

      split = new SplitText(el, {
        type: 'lines,words',
        linesClass: 'split-line overflow-hidden',
      });

      tween = gsap.fromTo(
        split.words,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          delay,
          ease: 'power3.out',
          stagger: 0.035,
          force3D: true,
          onStart: () => gsap.set(split!.words, { willChange: 'transform, opacity' }),
          onComplete: () => gsap.set(split!.words, { willChange: 'auto' }),
          scrollTrigger: {
            trigger: el,
            start,
            end: 'bottom top',
            toggleActions: 'play none none reverse',
          },
        }
      );
    };

    // SplitText's line/word split forces a synchronous layout read per
    // heading — cheap alone, but with ~8 SplitHeading instances across the
    // homepage all mounting at once, doing every split immediately on load
    // adds up into one multi-hundred-ms main-thread block before the page
    // is even interactive. An IntersectionObserver defers each heading's
    // split until it's actually getting close to view, spreading that cost
    // out across scroll time instead of paying it all upfront — a heading
    // already near the top of the viewport (e.g. right below the hero)
    // still splits immediately since it's already within the margin.
    let built = false;
    const runBuildOnce = () => {
      if (built) return;
      built = true;
      build();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runBuildOnce();
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(el);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      if (!built) return;
      clearTimeout(resizeTimer);
      // Debounced: mobile browsers fire resize repeatedly while the address
      // bar shows/hides during scroll, so rebuilding on every tick would
      // itself cause jank — only re-split once things settle.
      resizeTimer = setTimeout(build, 300);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('ace-language-change', build);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('ace-language-change', build);
      clearTimeout(resizeTimer);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [delay, start]);

  return React.cloneElement(children, { ref } as Partial<unknown>);
};
