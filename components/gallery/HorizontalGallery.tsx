'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface GalleryItem {
  id: number | string;
  title: string;
  category: string;
  image: string;
}

interface HorizontalGalleryProps {
  items: GalleryItem[];
  kicker: string;
  title: string;
  intro?: string;
}

// GSAP ScrollTrigger horizontal gallery: the section pins to the viewport and
// the vertical scroll is remapped onto the track's x translation, so the whole
// strip is travelled through with a normal scroll or swipe.
//
// Smoothness comes from three choices in the trigger below:
//  - the tween animates a single transform on one element (the track), so a
//    frame is one composited layer move, never a layout;
//  - `scrub: true` rather than a numeric scrub, because Lenis is already
//    smoothing the scroll position — a second smoothing pass on top of it is
//    what turns "smooth" into "lagging behind my finger";
//  - every distance is a function re-read on refresh (`invalidateOnRefresh`),
//    so a phone's address bar showing/hiding re-measures instead of leaving
//    the track ending in the wrong place.
export const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({ items, kicker, title, intro }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // How far the track has to travel: everything that sticks out past the
      // viewport. Read lazily (and again on every refresh) because card widths
      // are viewport-relative and images can still be settling on first paint.
      const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            // The pin lasts exactly as long as the horizontal travel, so the
            // strip finishes precisely as the section releases.
            end: () => `+=${distance()}`,
            pin: true,
            // Sets the pin up a moment early so a fast flick doesn't catch the
            // section mid-swap — the classic pinned-section jump on mobile.
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Written straight to the node: this runs on every scroll frame,
              // and a React render per frame is exactly what a scroll-driven
              // effect cannot afford.
              const thumb = thumbRef.current;
              if (thumb) thumb.style.transform = `scaleX(${Math.max(self.progress, 0.03)})`;
              setActive(Math.round(self.progress * (items.length - 1)));
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { x: 0 });
        };
      });

      // Reduced motion: no pinning, no scroll hijack — the same cards as a
      // plain swipeable strip.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        track.classList.add('gallery-track-free');
        return () => track.classList.remove('gallery-track-free');
      });
    }, section);

    // Images arriving after the first measurement change the track's width,
    // which changes both the travel and the pin length — refresh once they
    // have landed rather than leaving the last card unreachable.
    const imgs = Array.from(track.querySelectorAll('img'));
    let pending = imgs.filter((img) => !img.complete).length;
    const onImgSettled = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', onImgSettled, { once: true });
      img.addEventListener('error', onImgSettled, { once: true });
    });

    return () => {
      imgs.forEach((img) => {
        img.removeEventListener('load', onImgSettled);
        img.removeEventListener('error', onImgSettled);
      });
      ctx.revert();
    };
  }, [items.length]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#FAF8F4]">
      <div className="h-[100svh] flex flex-col justify-center pt-24 pb-12 sm:pt-28 sm:pb-14">

        {/* Heading rides inside the pin, so it stays with the cards for the
            whole travel and the pinned screen reads as one composition. */}
        <div className="container-custom w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 lg:items-end mb-6 sm:mb-8">
          <div className="lg:col-span-7">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#b89858] uppercase tracking-[0.16em] block mb-2 sm:mb-3">
              {kicker}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.15] text-[#1A1D20]">
              {title}
            </h2>
          </div>

          {intro && (
            <p className="hidden lg:block lg:col-span-5 text-sm text-gray-600 leading-relaxed">
              {intro}
            </p>
          )}
        </div>

        {/* Meta row sits directly on top of the track: a quiet label on the
            left, position on the right. */}
        <div className="container-custom w-full flex items-center justify-between gap-6 mb-4 sm:mb-5">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
            <MoveRight className="w-3.5 h-3.5 text-[#b89858]" />
            Keep scrolling
          </span>

          <span className="text-xs sm:text-sm font-extrabold text-[#1A1D20] tabular-nums tracking-wide">
            {String(active + 1).padStart(2, '0')}
            <span className="text-gray-400"> / {String(items.length).padStart(2, '0')}</span>
          </span>
        </div>

        {/* The moving track. One transform on this element is the entire
            animation — the cards themselves never animate individually. */}
        <div ref={trackRef} className="gallery-track flex gap-4 sm:gap-8 will-change-transform">
          {items.map((item, idx) => (
            <figure
              key={item.id}
              // Phones size the card off the viewport width; from sm up it is sized
              // off the pinned viewport's *height* instead, so the strip fills
              // the screen it has taken over rather than floating in it.
              className="gallery-card group relative shrink-0 aspect-[3/4] w-[86vw] sm:aspect-[4/3] sm:w-auto sm:h-[54svh] sm:max-h-[540px] sm:min-h-[340px] overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#0B0D0F] shadow-[0_30px_60px_-38px_rgba(26,29,32,0.7)]"
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  // The strip can travel fast, so everything in the first
                  // couple of screens is fetched up front — a card sliding in
                  // blank reads as broken. They're ~100KB webp each.
                  loading={idx < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover select-none transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />

                {/* One bottom-weighted scrim: enough for the caption to hold
                    its own on any photo without greying out the image. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 [background:linear-gradient(to_top,rgba(6,7,8,0.9)_0%,rgba(6,7,8,0.45)_32%,rgba(6,7,8,0)_62%)]"
                />

                <span className="absolute top-5 left-5 text-[11px] font-extrabold tabular-nums tracking-[0.18em] text-white/90 bg-black/35 rounded-full px-3 py-1.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Caption is permanent rather than hover-only — there is no
                  hover on the devices most of this is viewed on. */}
              <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <span className="text-[10px] sm:text-[11px] font-extrabold text-[#d9b978] uppercase tracking-[0.16em] block mb-2">
                  {item.category}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {item.title}
                </h3>
              </figcaption>
            </figure>
          ))}

          {/* Trailing gutter: a flex container's padding-right isn't counted in
              scrollWidth, so the last card would otherwise finish flush against
              the viewport edge. */}
          <div aria-hidden="true" className="shrink-0 w-5 sm:w-10" />
        </div>

        {/* Progress rail — scaled on the x axis, so it's a compositor-only
            change on each frame. */}
        <div className="container-custom w-full mt-6 sm:mt-8">
          <div className="h-[3px] w-full rounded-full bg-[#E6DBC6] overflow-hidden">
            <div
              ref={thumbRef}
              className="h-full w-full rounded-full bg-[#b89858] origin-left will-change-transform"
              style={{ transform: 'scaleX(0.03)' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
