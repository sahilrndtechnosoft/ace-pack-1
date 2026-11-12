'use client';

import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type * as THREE from 'three';
import { ContainerModel } from './ContainerModel';
import { defaultFinish } from './config';
import { craftTurn } from './scene-pose';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/** Renders the photo instead if the device can't run WebGL or the model fails to load. */
class ViewerBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Drag = { yaw: number; pitch: number };

function Turntable({ progress, drag, pinned, onReady }: { progress: React.RefObject<number>; drag: React.RefObject<Drag>; pinned: boolean; onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  // Runs once the GLB has finished loading (this component sits inside Suspense).
  useEffect(onReady, [onReady]);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;
    // Pinned (phones/tablets): same turn-and-hold as the desktop scene, one hold per fact.
    // Otherwise a gentle continuous turn. Drag is added on top, unlimited sideways (360°).
    const scrollYaw = pinned ? craftTurn(p) : p * Math.PI * 1.4;
    const targetYaw = -0.58 + scrollYaw + (drag.current?.yaw ?? 0);
    const targetPitch = 0.22 + (drag.current?.pitch ?? 0);
    const damping = 1 - Math.exp(-8 * Math.min(delta, 0.05));
    g.rotation.y += (targetYaw - g.rotation.y) * damping;
    g.rotation.x += (targetPitch - g.rotation.x) * damping;
  });
  return (
    <group ref={group} rotation={[0.22, -0.6, 0]}>
      <ContainerModel finish={defaultFinish} lid={0} />
    </group>
  );
}

/**
 * The 3D container inside the page flow (phones, tablets and reduced-motion visitors), so it
 * always has its own space and never sits over text. Horizontal drag rotates it; vertical swipes
 * still scroll the page. With `animate`, scrolling through `triggerSelector` turns it too.
 */
export default function InlineModelViewer({
  fallbackSrc,
  fallbackAlt,
  animate,
  pinned = false,
  triggerSelector,
  onProgress,
  className = '',
}: {
  fallbackSrc: string;
  fallbackAlt: string;
  animate: boolean;
  /** The section is pinned while scrolling through it: progress runs from its top to its bottom. */
  pinned?: boolean;
  triggerSelector: string;
  onProgress?: (progress: number) => void;
  className?: string;
}) {
  const progress = useRef(0);
  const drag = useRef<Drag>({ yaw: 0, pitch: 0 });
  const pointer = useRef<{ id: number; x: number; y: number; mouse: boolean } | null>(null);
  const reportProgress = useRef(onProgress);
  reportProgress.current = onProgress;
  const [loaded, setLoaded] = useState(false);
  const markLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (!animate) return;
    const trigger = ScrollTrigger.create({
      trigger: triggerSelector,
      start: pinned ? 'top top' : 'top bottom',
      end: pinned ? 'bottom bottom' : 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress;
        reportProgress.current?.(self.progress);
      },
    });
    return () => trigger.kill();
  }, [animate, pinned, triggerSelector]);

  const fallback = <img src={fallbackSrc} alt={fallbackAlt} className="h-full w-full object-contain" loading="lazy" />;

  return (
    <div
      className={`xp-craft-model relative ${className}`}
      style={{ touchAction: 'pan-y' }}
      onPointerDown={(e) => {
        pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, mouse: e.pointerType === 'mouse' };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const start = pointer.current;
        if (start?.id !== e.pointerId) return;
        drag.current.yaw += (e.clientX - start.x) * 0.012;
        // Touch keeps vertical swipes for page scrolling; a mouse can also tilt the container.
        if (start.mouse) drag.current.pitch = Math.max(-1.2, Math.min(1.2, drag.current.pitch + (e.clientY - start.y) * 0.01));
        start.x = e.clientX;
        start.y = e.clientY;
      }}
      onPointerUp={() => (pointer.current = null)}
      onPointerCancel={() => (pointer.current = null)}
      role="img"
      aria-label={`${fallbackAlt}. Drag to rotate 360°.`}
    >
      {!loaded && <div className="absolute inset-0">{fallback}</div>}
      <ViewerBoundary fallback={fallback}>
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.1, 4.2], fov: 32 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[-3, 6, 5]} intensity={2.4} color="#fff5dd" />
          <directionalLight position={[4, 3, -4]} intensity={3} />
          <Environment resolution={64} frames={1}>
            <Lightformer form="rect" intensity={4} position={[0, 5, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
            <Lightformer form="rect" color="#d4b477" intensity={2} position={[4, 1, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 6, 1]} />
          </Environment>
          <Suspense fallback={null}>
            <Turntable progress={progress} drag={drag} pinned={pinned} onReady={markLoaded} />
          </Suspense>
          <ContactShadows position={[0, -0.75, 0]} opacity={0.35} scale={6} blur={2.4} far={2} />
        </Canvas>
      </ViewerBoundary>
      <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white">
        ⟲ Drag to rotate 360°
      </span>
    </div>
  );
}
