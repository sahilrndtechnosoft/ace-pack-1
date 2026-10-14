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
  return null;
}

export default HeroFloatingFood;
