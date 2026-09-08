"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import styles from './CursorTrail.module.css';

/** One lightweight follower shared by every route through the root layout. */
export function CursorTrail() {
  const ring = useRef<HTMLDivElement>(null);
  const hide = useRef<() => void>(() => {});
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = ring.current;
    if (!enabled || !el) return;
    const x = gsap.quickTo(el, 'x', { duration: .16, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: .16, ease: 'power3.out' });
    let visible = false;

    const leave = () => {
      el.style.opacity = '0';
      el.dataset.pressed = 'false';
      visible = false;
    };
    hide.current = leave;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') { leave(); return; }
      if (!visible) {
        x.tween.pause();
        y.tween.pause();
        gsap.set(el, { x: event.clientX, y: event.clientY });
        el.style.opacity = '1';
        visible = true;
      }
      x(event.clientX);
      y(event.clientY);
      const target = event.target instanceof Element ? event.target : null;
      el.dataset.kind = target?.closest('[data-cursor="drag"]') ? 'drag'
        : target?.closest('a,button,[role="button"],input,select,textarea') ? 'link' : 'idle';
    };
    const press = () => { el.dataset.pressed = 'true'; };
    const release = () => { el.dataset.pressed = 'false'; };
    const key = (event: KeyboardEvent) => { if (event.key === 'Tab') leave(); };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', leave);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', leave);
      window.removeEventListener('keydown', key);
      x.tween.kill();
      y.tween.kill();
      hide.current = () => {};
    };
  }, [enabled]);

  useEffect(() => { hide.current(); }, [pathname]);

  return enabled ? <div ref={ring} className={styles.cursor} data-site-cursor aria-hidden="true"><span>Drag</span></div> : null;
}
