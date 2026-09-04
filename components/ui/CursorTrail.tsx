'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const FLAIR_COUNT = 8;
const GAP = 80; // px of mouse travel between spawning the next shape

// Adapted from the classic GSAP "image trail" cursor demo: a pool of shapes
// is cycled round-robin, each one popping in with an elastic scale, spinning
// to a random angle, and falling away — reused rather than re-created so
// there's no DOM churn while the mouse moves.
export const CursorTrail: React.FC = () => {
  const flairRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const flair = flairRefs.current.filter((el): el is HTMLDivElement => !!el);
    const wrap = gsap.utils.wrap(0, flair.length);
    let index = 0;

    const mousePos = { x: 0, y: 0 };
    let lastMousePos = { ...mousePos };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const playAnimation = (shape: Element) => {
      const tl = gsap.timeline();
      tl.from(shape, {
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
      })
        .to(
          shape,
          {
            rotation: gsap.utils.random(-360, 360),
            duration: 1,
          },
          '<'
        )
        .to(
          shape,
          {
            y: '120vh',
            ease: 'back.in(0.4)',
            duration: 1,
          },
          0
        );
    };

    const animateShape = () => {
      const img = flair[wrap(index)];
      gsap.killTweensOf(img);
      // NOT clearProps: 'all' — that strips the *entire* inline style
      // attribute, including the width/height/background/border React set
      // on this same element, leaving it rendering at 0x0 (invisible).
      // Only clear the transform-related props GSAP itself left behind.
      gsap.set(img, { clearProps: 'transform,translate,rotate,scale,top,left,opacity' });
      gsap.set(img, {
        opacity: 1,
        left: mousePos.x,
        top: mousePos.y,
        xPercent: -50,
        yPercent: -50,
      });
      playAnimation(img);
      index++;
    };

    const tick = () => {
      const travelDistance = Math.hypot(lastMousePos.x - mousePos.x, lastMousePos.y - mousePos.y);
      if (travelDistance > GAP) {
        animateShape();
        lastMousePos = { ...mousePos };
      }
    };
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tick);
      flair.forEach((el) => gsap.killTweensOf(el));
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: FLAIR_COUNT }).map((_, i) => {
        const isRing = i % 3 === 0;
        const size = 14 + ((i * 7) % 18);
        return (
          <div
            key={i}
            ref={(el) => {
              flairRefs.current[i] = el;
            }}
            className="absolute opacity-0 will-change-transform"
            style={{
              width: size,
              height: size,
              borderRadius: '9999px',
              background: isRing ? 'transparent' : 'rgba(184, 152, 88, 0.85)',
              border: isRing ? '2px solid rgba(184, 152, 88, 0.85)' : 'none',
              // No box-shadow: a blurred shadow has to be re-rastered on every
              // frame of the shape's fall, and there are several falling at
              // once whenever the mouse is moving.
            }}
          />
        );
      })}
    </div>
  );
};
