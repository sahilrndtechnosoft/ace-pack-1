'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { ContainerModel } from './ContainerModel';
import { containerFinishes, defaultFinish } from './config';

const MIN_DISTANCE = 2.2;
const MAX_DISTANCE = 9;
type Controls = { target: THREE.Vector3; update: () => void; reset: () => void };

/** Exposes camera + controls to the HTML zoom buttons outside the canvas. */
function ZoomBridge({ api }: { api: React.MutableRefObject<((factor: number) => void) | null> }) {
  const { camera, controls } = useThree();
  useEffect(() => {
    api.current = (factor) => {
      const c = controls as unknown as Controls | null;
      if (!c) return;
      const offset = camera.position.clone().sub(c.target);
      offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, MIN_DISTANCE, MAX_DISTANCE));
      camera.position.copy(c.target).add(offset);
      c.update();
    };
    return () => {
      api.current = null;
    };
  }, [api, camera, controls]);
  return null;
}

/**
 * Full-screen 3D inspector: drag to orbit, scroll / pinch / buttons to zoom, change the finish
 * and lift the lid. Used from the home "craft" section on every screen size.
 */
export default function ModelInspector({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  const [finish, setFinish] = useState<number>(defaultFinish);
  const [lidOpen, setLidOpen] = useState(false);
  const zoom = useRef<((factor: number) => void) | null>(null);
  const controls = useRef<Controls | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    // Wheel/pinch should zoom the model, not scroll the page behind it.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      window.removeEventListener('keydown', onKey);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const button = 'inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3 text-sm font-semibold text-[#14171a] shadow-sm backdrop-blur hover:bg-white cursor-pointer';

  // Portalled to <body>: the home page wrapper is an isolated stacking context on wide screens
  // (and may carry a page-transition transform), which would trap a fixed overlay underneath the
  // site header. From <body> it always covers the whole viewport.
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex flex-col bg-[radial-gradient(circle_at_50%_40%,#fbf7ee_0%,#efe6d4_70%,#e4d6bb_100%)]"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: 3D inspector`}
      data-lenis-prevent
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b6e32]">3D inspector</p>
          <h2 className="text-lg font-black text-[#14171a] sm:text-xl">{title}</h2>
        </div>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close 3D inspector" className={button}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1" style={{ touchAction: 'none' }}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 1.4, 4.6], fov: 35 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[-3, 6, 5]} intensity={2.4} color="#fff5dd" />
          <directionalLight position={[4, 3, -4]} intensity={3} />
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={4} position={[0, 5, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
            <Lightformer form="rect" intensity={3} position={[-5, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[4, 7, 1]} />
            <Lightformer form="rect" color="#d4b477" intensity={2} position={[4, 1, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 6, 1]} />
          </Environment>
          <Suspense fallback={null}>
            <group rotation={[0.15, -0.6, 0]}>
              <ContainerModel finish={finish} lid={lidOpen ? 1 : 0} />
            </group>
          </Suspense>
          <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={7} blur={2.4} far={2.5} />
          <OrbitControls
            ref={controls as never}
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={MIN_DISTANCE}
            maxDistance={MAX_DISTANCE}
            maxPolarAngle={Math.PI * 0.85}
          />
          <ZoomBridge api={zoom} />
        </Canvas>
        <p className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
          Drag to rotate · Scroll or pinch to zoom
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button type="button" onClick={() => zoom.current?.(0.8)} aria-label="Zoom in" className={button}>
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => zoom.current?.(1.25)} aria-label="Zoom out" className={button}>
          <Minus className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => controls.current?.reset()} className={button}>
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <button type="button" aria-pressed={lidOpen} onClick={() => setLidOpen((v) => !v)} className={button}>
          {lidOpen ? 'Close lid' : 'Lift lid'}
        </button>
        <div className="flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-1" role="group" aria-label="Colour">
          {containerFinishes.map((f, i) => (
            <button
              key={f.name}
              type="button"
              aria-label={f.name}
              aria-pressed={finish === i}
              title={f.name}
              onClick={() => setFinish(i)}
              className={`h-8 w-8 rounded-full border-2 cursor-pointer ${finish === i ? 'border-[#b99750]' : 'border-transparent'}`}
              style={{ background: f.color }}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
