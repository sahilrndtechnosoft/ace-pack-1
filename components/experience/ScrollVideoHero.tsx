'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { homeCraft, homeHero } from '@/lib/cms/pages/home';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = '/videos/home-scroll.mp4';
const VIDEO_SRC_MOBILE = '/videos/home-scroll-mobile.mp4';
const POSTER_SRC = '/images/home/home-scroll-poster.webp';
// Seconds the video lags behind the scroll position; smooths out wheel steps.
const SCRUB_SMOOTHING = 0.35;

interface ScrollVideoHeroProps {
  hero: typeof homeHero;
  facts: (typeof homeCraft)['facts'];
}

/**
 * Home hero: a product film that plays as you scroll. The stage stays pinned (CSS sticky)
 * while the section scrolls past; scroll progress drives the video time, a tilted card that
 * straightens into full screen, and the captions (CMS hero copy, then the craft facts). The
 * shading fades at the end so the closing product spread is shown clean.
 */
export function ScrollVideoHero({ hero, facts }: ScrollVideoHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsStatic(true);
      return;
    }

    // iOS Safari only paints seeked frames after the video has played once.
    const unlock = () => {
      video.play().then(() => video.pause()).catch(() => undefined);
    };
    window.addEventListener('touchstart', unlock, { once: true, passive: true });

    const playhead = { time: 0 };
    const seek = () => {
      if (!video.duration) return;
      const target = Math.min(playhead.time, video.duration - 0.05);
      if (Math.abs(video.currentTime - target) > 0.01) video.currentTime = target;
    };

    const ctx = gsap.context(() => {
      const headerOffset = () => document.querySelector('body>header')?.getBoundingClientRect().height ?? 80;
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: () => `top ${headerOffset()}`,
          end: 'bottom bottom',
          scrub: SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.to(playhead, {
              time: self.progress * (video.duration || 0),
              duration: SCRUB_SMOOTHING,
              ease: 'power1.out',
              overwrite: true,
              onUpdate: seek,
            });
          },
        },
      });

      // 0 → .22: the tilted card straightens and fills the screen; the intro copy leaves.
      timeline
        .fromTo('.svh-frame', { scale: 0.84, rotateX: 14, borderRadius: 32 }, { scale: 1, rotateX: 0, borderRadius: 0, duration: 0.22 }, 0)
        .fromTo('.svh-video', { scale: 1.18 }, { scale: 1, duration: 0.6 }, 0)
        .to('.svh-intro', { autoAlpha: 0, y: -40, duration: 0.1 }, 0.14)
        .to('.svh-cue', { autoAlpha: 0, duration: 0.05 }, 0.02);

      // .24 → .80: one craft fact at a time.
      const factSpan = 0.56 / Math.max(facts.length, 1);
      gsap.utils.toArray<HTMLElement>('.svh-fact').forEach((fact, i) => {
        const start = 0.24 + i * factSpan;
        timeline
          .fromTo(fact, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: factSpan * 0.3 }, start)
          .to(fact, { autoAlpha: 0, y: -40, duration: factSpan * 0.25 }, start + factSpan * 0.72);
      });

      // .84 → 1: shading lifts so the final product spread reads clean.
      timeline.to('.svh-shade', { autoAlpha: 0, duration: 0.1 }, 0.84);
      // Pad to exactly 1 so the positions above are fractions of the whole scroll.
      timeline.set({}, {}, 1);
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    video.addEventListener('loadedmetadata', refresh);

    return () => {
      window.removeEventListener('touchstart', unlock);
      video.removeEventListener('loadedmetadata', refresh);
      ctx.revert();
    };
  }, [facts.length]);

  return (
    <section
      id="main-content"
      ref={sectionRef}
      aria-label={`${hero.heading} ${hero.headingHighlight}`}
      className={`relative bg-[var(--ace-paper)] ${isStatic ? '' : 'h-[420vh] max-lg:h-[340vh]'}`}
    >
      <div className="sticky top-[var(--site-header,80px)] h-[calc(100dvh-var(--site-header,80px))] overflow-hidden [perspective:1400px]">
        <div className="svh-frame relative h-full w-full overflow-hidden bg-[#efe9dd] origin-[50%_60%] will-change-transform">
          <video
            ref={videoRef}
            className="svh-video absolute inset-0 h-full w-full object-cover will-change-transform"
            poster={POSTER_SRC}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={VIDEO_SRC_MOBILE} type="video/mp4" media="(max-width: 767px)" />
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
          {/* Keeps white copy readable over the bright studio footage. */}
          <div className="svh-shade absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent max-md:bg-gradient-to-t max-md:from-black/75 max-md:via-black/35" />

          {/* Captions share one grid cell so they stack; GSAP moves them with y only. */}
          <div className="relative z-10 h-full w-full max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pb-[14%] md:pb-0 grid items-end md:items-center text-white">
            <div className="svh-intro [grid-area:1/1] max-w-2xl">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#E8CF96]">{hero.topLabel}</p>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.02] tracking-tight">
                {hero.heading} <em className="font-serif font-normal text-[#E8CF96]">{hero.headingHighlight}</em>
              </h1>
              <p className="mt-4 max-w-xl text-sm sm:text-base text-white/85 leading-relaxed">
                <span className="hidden sm:inline">{hero.description}</span>
                <span className="sm:hidden">{hero.mobileDescription}</span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={hero.primaryButton.link} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-gold)] hover:bg-[#a6843e] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-colors">
                  {hero.primaryButton.text} <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/60 hover:bg-white hover:text-[var(--ace-ink)] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors">
                  Request a Quote
                </Link>
              </div>
            </div>

            {!isStatic && facts.map((fact) => (
              <div key={fact.tag} className="svh-fact invisible opacity-0 [grid-area:1/1] max-w-lg">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#E8CF96]">{fact.tag}</p>
                <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.04] tracking-tight">
                  {fact.title.split('\n').map((line) => <span key={line} className="block">{line}</span>)}
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed">{fact.body}</p>
              </div>
            ))}

            {!isStatic && (
              <div className="svh-cue absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 max-md:hidden">
                <span>{hero.scrollCue}</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
