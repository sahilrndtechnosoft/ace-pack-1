'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface FloatingFoodItem {
  id: string;
  name: string;
  tag: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  desktop: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    size: number;
    depthFactor: number;
    initialRotation: number;
    tiltX: number;
    tiltY: number;
    zIndex: number;
    blur?: string;
  };
  mobile: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    size: number;
    initialRotation: number;
    zIndex: number;
    showOnMobile: boolean;
  };
  floatClass: string;
}

const FOOD_ITEMS: FloatingFoodItem[] = [
  {
    id: 'burger',
    name: 'Artisan Cheeseburger',
    tag: 'Takeaway Hero',
    src: '/images/food/burger.webp',
    alt: 'Juicy artisan double cheeseburger with toasted sesame brioche bun and dripping melted cheddar',
    width: 797,
    height: 668,
    desktop: {
      top: '12%',
      right: '6%',
      size: 215,
      depthFactor: 1.25,
      initialRotation: -4,
      tiltX: 6,
      tiltY: -8,
      zIndex: 5,
    },
    mobile: {
      top: '37%',
      left: '3%',
      size: 78,
      initialRotation: -5,
      zIndex: 5,
      showOnMobile: true,
    },
    floatClass: 'float-drift-1',
  },
  {
    id: 'fries',
    name: 'Crispy Golden Fries',
    tag: 'Side Order',
    src: '/images/food/fries.webp',
    alt: 'Crispy hot golden french fries lightly salted with fresh herbs',
    width: 920,
    height: 556,
    desktop: {
      bottom: '15%',
      right: '8%',
      size: 195,
      depthFactor: 0.95,
      initialRotation: 6,
      tiltX: -5,
      tiltY: 10,
      zIndex: 4,
    },
    mobile: {
      top: '39%',
      right: '3%',
      size: 76,
      initialRotation: 6,
      zIndex: 4,
      showOnMobile: true,
    },
    floatClass: 'float-drift-2',
  },
  {
    id: 'salad',
    name: 'Fresh Garden Salad',
    tag: 'Cold Prep',
    src: '/images/food/salad.webp',
    alt: 'Fresh vibrant gourmet garden salad with crisp greens, radish, cucumbers and tomatoes',
    width: 689,
    height: 672,
    desktop: {
      top: '14%',
      left: '46%',
      size: 185,
      depthFactor: 1.15,
      initialRotation: -2,
      tiltX: 8,
      tiltY: 5,
      zIndex: 5,
    },
    mobile: {
      top: '66%',
      right: '4%',
      size: 74,
      initialRotation: 3,
      zIndex: 5,
      showOnMobile: true,
    },
    floatClass: 'float-drift-3',
  },
  {
    id: 'pizza-slice',
    name: 'NY Pepperoni Slice',
    tag: 'Hot Delivery',
    src: '/images/food/pizza-slice.webp',
    alt: 'Freshly baked artisan pepperoni pizza slice with melted bubbly mozzarella and golden crust',
    width: 845,
    height: 696,
    desktop: {
      bottom: '18%',
      left: '48%',
      size: 205,
      depthFactor: 1.5,
      initialRotation: -9,
      tiltX: -8,
      tiltY: -10,
      zIndex: 6,
    },
    mobile: {
      top: '68%',
      left: '4%',
      size: 76,
      initialRotation: -7,
      zIndex: 4,
      showOnMobile: false, // hide on mobile to maintain clean focus on container
    },
    floatClass: 'float-drift-4',
  },
  {
    id: 'sandwich',
    name: 'Grilled Sourdough Panini',
    tag: 'Gourmet Deli',
    src: '/images/food/sandwich.webp',
    alt: 'Gourmet grilled toasted panini sandwich with melted gooey cheese pull and smoked turkey',
    width: 952,
    height: 635,
    desktop: {
      top: '48%',
      right: '1.5%',
      size: 175,
      depthFactor: 0.75,
      initialRotation: 8,
      tiltX: 4,
      tiltY: 8,
      zIndex: 3,
      blur: '0.4px',
    },
    mobile: {
      bottom: '15%',
      left: '6%',
      size: 70,
      initialRotation: 6,
      zIndex: 3,
      showOnMobile: false, // hide on mobile
    },
    floatClass: 'float-drift-5',
  },
];

export function HeroFloatingFood() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollY = window.scrollY;
    let reqId: number;

    const onPointerMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const items = el.querySelectorAll<HTMLElement>('.hero-floating-item');

    const animate = () => {
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const heroHeight = window.innerHeight || 800;
      const scrollProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1.4);

      items.forEach((item) => {
        const depth = parseFloat(item.dataset.depth || '1');
        const moveX = mouseX * 28 * depth;
        const moveY = mouseY * 22 * depth - scrollProgress * 110 * depth;
        const rotOffset = mouseX * 5 * depth;
        const tiltXOffset = -mouseY * 7 * depth;
        const tiltYOffset = mouseX * 7 * depth;

        item.style.setProperty('--px-x', `${moveX.toFixed(2)}px`);
        item.style.setProperty('--px-y', `${moveY.toFixed(2)}px`);
        item.style.setProperty('--px-rot', `${rotOffset.toFixed(2)}deg`);
        item.style.setProperty('--px-tilt-x', `${tiltXOffset.toFixed(2)}deg`);
        item.style.setProperty('--px-tilt-y', `${tiltYOffset.toFixed(2)}deg`);
      });

      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-floating-food-layer"
      aria-hidden="true"
    >
      {FOOD_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`hero-floating-item ${item.floatClass} ${!item.mobile.showOnMobile ? 'mob-hidden' : ''}`}
          data-depth={item.desktop.depthFactor}
          style={{
            '--desk-top': item.desktop.top ?? 'auto',
            '--desk-bottom': item.desktop.bottom ?? 'auto',
            '--desk-left': item.desktop.left ?? 'auto',
            '--desk-right': item.desktop.right ?? 'auto',
            '--desk-size': `${item.desktop.size}px`,
            '--mob-top': item.mobile.top ?? 'auto',
            '--mob-bottom': item.mobile.bottom ?? 'auto',
            '--mob-left': item.mobile.left ?? 'auto',
            '--mob-right': item.mobile.right ?? 'auto',
            '--mob-size': `${item.mobile.size}px`,
            zIndex: item.desktop.zIndex,
            '--base-rot': `${item.desktop.initialRotation}deg`,
            '--base-tilt-x': `${item.desktop.tiltX}deg`,
            '--base-tilt-y': `${item.desktop.tiltY}deg`,
            filter: item.desktop.blur ? `blur(${item.desktop.blur})` : undefined,
          } as React.CSSProperties}
        >
          {/* Subtle warm ambient back-glow */}
          <div className="hero-floating-glow" />

          {/* Floating food image with 3D drop shadow */}
          <div className="hero-floating-img-wrap">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="hero-floating-img"
              priority
            />
          </div>

          {/* Interactive chic label on hover */}
          <div className="hero-floating-label">
            <span className="hero-floating-tag">{item.tag}</span>
            <span className="hero-floating-name">{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HeroFloatingFood;
