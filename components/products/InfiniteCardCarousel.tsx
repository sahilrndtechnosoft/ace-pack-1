'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ChevronLeft, ChevronRight, Package, Soup, IceCreamBowl, Utensils, Box, Layers } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, InertiaPlugin);
}

export interface CarouselCard {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
}

interface InfiniteCardCarouselProps {
  cards: CarouselCard[];
}

const ICONS = [Package, Soup, IceCreamBowl, Utensils, Box, Layers];
const VISIBLE_RANGE = 3;
const SPACING = 190;


export const InfiniteCardCarousel: React.FC<InfiniteCardCarouselProps> = ({ cards }) => {
  const total = cards.length;
  const stateRef = useRef({ progress: 0 });
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const baseProgressRef = useRef(0);
  const router = useRouter();

  const wrapDistance = useCallback(
    (index: number, progress: number) => {
      let d = index - progress;
      d = ((d % total) + total) % total;
      if (d > total / 2) d -= total;
      return d;
    },
    [total]
  );

  const render = useCallback(() => {
    const progress = stateRef.current.progress;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = wrapDistance(i, progress);
      const abs = Math.abs(d);
      const visible = abs <= VISIBLE_RANGE;
      const x = d * SPACING;
      const scale = Math.max(0.55, 1 - abs * 0.16);
      const opacity = Math.max(0, 1 - abs * 0.32);
      const rotateY = d * -10;
      el.style.transform = `translate(-50%, -50%) translateX(${x}px) scale(${scale}) rotateY(${rotateY}deg)`;
      el.style.opacity = visible ? String(opacity) : '0';
      el.style.zIndex = String(Math.round(100 - abs * 10));
      el.style.pointerEvents = abs < 0.5 ? 'auto' : 'none';
      el.dataset.active = abs < 0.5 ? 'true' : 'false';
    });
  }, [wrapDistance]);

  useEffect(() => {
    render();
  }, [render]);


  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const [draggable] = Draggable.create(overlay, {
      type: 'x',
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() {
        tweenRef.current?.kill();
        baseProgressRef.current = stateRef.current.progress;
      },
      onDrag() {
        stateRef.current.progress = baseProgressRef.current - this.x / SPACING;
        render();
      },
      onDragEnd() {
        gsap.set(overlay, { x: 0 });
        const target = Math.round(stateRef.current.progress);
        baseProgressRef.current = target;
        tweenRef.current = gsap.to(stateRef.current, {
          progress: target,
          duration: 0.5,
          ease: 'power3.out',
          onUpdate: render,
        });
      },
      onClick() {
        const activeIndex = cardRefs.current.findIndex((el) => el?.dataset.active === 'true');
        if (activeIndex >= 0) router.push(`/categories/${cards[activeIndex].slug}`);
      },
    });

    return () => {
      draggable.kill();
    };
  }, [render, cards, router]);

  const go = (dir: 1 | -1) => {
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(stateRef.current, {
      progress: stateRef.current.progress + dir,
      duration: 0.75,
      ease: 'power3.inOut',
      onUpdate: render,
    });
  };

  return (
    <div className="relative">
      <div className="relative h-[380px] sm:h-[440px]" style={{ perspective: '1400px' }}>
        <div ref={overlayRef} className="absolute inset-0 z-[200] touch-none" aria-hidden="true" />
        {cards.map((card, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Link
              key={card.id}
              href={`/categories/${card.slug}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 w-[190px] sm:w-[230px] h-[300px] sm:h-[360px] rounded-3xl border-2 border-white/10 bg-[#111518] flex flex-col items-center justify-center text-center p-5 sm:p-6 overflow-hidden transition-colors duration-300 data-[active=true]:border-[#b89858] data-[active=true]:shadow-[0_0_50px_rgba(184,152,88,0.35)]"
            >
              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl font-black text-white/[0.06] select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#b89858]/15 flex items-center justify-center mb-4 text-[#b89858]">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-white font-extrabold text-base sm:text-lg mb-2 leading-snug">{card.title}</h3>
              <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed line-clamp-3">{card.subtitle}</p>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => go(-1)}
          aria-label="Previous category"
          className="w-11 h-11 rounded-full border border-[#b89858]/40 flex items-center justify-center text-white hover:bg-[#b89858] hover:text-[#1A1D20] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next category"
          className="w-11 h-11 rounded-full border border-[#b89858]/40 flex items-center justify-center text-white hover:bg-[#b89858] hover:text-[#1A1D20] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
