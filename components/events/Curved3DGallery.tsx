'use client';
import { useSiteText } from '@/components/layout/SiteTextProvider';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { ExhibitionEvent } from '@/lib/data/events';

interface Curved3DGalleryProps {
  events: ExhibitionEvent[];
}

// Custom Vertex Shader:
// 1. Physically bends each panel along the cylindrical curvature (no flat parallax!)
// 2. Liquid velocity inertia wave (The Kerimov Designs Site-of-the-Day effect)
// 3. Subtle hover lift
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  uniform vec2 uDelta;
  uniform float uAmplitude;
  uniform float uCylinderRadius;
  uniform float uHover;
  uniform float uTime;

  #define PI 3.141592653589793

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 1. Physically curve the mesh surface itself along a cylinder of radius uCylinderRadius
    if (uCylinderRadius > 0.0) {
      float theta = pos.x / uCylinderRadius;
      pos.z += uCylinderRadius * (cos(theta) - 1.0);
      pos.x = uCylinderRadius * sin(theta);
    }

    // 2. Liquid velocity inertia wave (Organic flex during scroll / drag)
    pos.x += sin(uv.y * PI) * uDelta.x * uAmplitude;
    pos.y += sin(uv.x * PI) * uDelta.y * uAmplitude;

    float speed = length(uDelta);
    pos.z += sin(uv.x * PI) * sin(uv.y * PI) * speed * uAmplitude * 0.18;

    // 3. Subtle hover elevation
    pos.z += uHover * 0.14;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Custom Fragment Shader:
// Anti-aliased rounded corners via SDF, edge vignette, Fresnel gold rim light, and gloss
const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uHover;
  uniform float uTime;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    // Precise rounded corners via signed distance field
    vec2 p = (vUv - 0.5) * 2.0;
    float dist = roundedBoxSDF(p, vec2(1.0), 0.08);
    float alpha = 1.0 - smoothstep(-0.012, 0.006, dist);
    if (alpha <= 0.001) discard;

    vec4 tex = texture2D(uTexture, vUv);

    // Subtle edge vignette
    vec2 vigUv = vUv * (1.0 - vUv.yx);
    float vig = vigUv.x * vigUv.y * 15.0;
    vig = clamp(pow(vig, 0.2), 0.0, 1.0);

    // Fresnel rim lighting for ultra-premium glass/metallic edge
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.8);
    
    // Subtle Ace Packaging champagne-gold accent (#d6b05d)
    vec3 rimColor = vec3(0.85, 0.70, 0.38) * fresnel * (0.35 + uHover * 0.45);

    // Subtle glossy highlight on hover
    float gloss = pow(max(dot(reflect(-viewDir, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 16.0) * uHover * 0.15;

    // Final color compositing
    vec3 baseColor = tex.rgb * (0.88 + 0.12 * vig);
    vec3 finalColor = baseColor + rimColor + vec3(gloss);
    finalColor += vec3(uHover * 0.04);

    gl_FragColor = vec4(finalColor, alpha * uOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const Curved3DGallery: React.FC<Curved3DGalleryProps> = ({ events }) => {
  const L = useSiteText().labels;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Smooth virtual scroll and inertia physics
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastProgressRef = useRef(0);
  const smoothedVelocityRef = useRef(0);

  // Drag interaction refs
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const dragLastXRef = useRef(0);
  const dragLastTimeRef = useRef(0);
  const dragVelocityRef = useRef(0);

  // Mouse tilt refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Jump smoothly to a specific card index
  const scrollToCard = useCallback((targetIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(events.length - 1, targetIndex));
    const target = events.length > 1 ? clampedIndex / (events.length - 1) : 0;
    targetProgressRef.current = target;
  }, [events.length]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#161A12');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const updateCameraDistance = (w: number) => {
      if (w < 640) {
        camera.position.set(0, 0, 9.6);
      } else if (w < 1024) {
        camera.position.set(0, 0, 8.5);
      } else {
        camera.position.set(0, 0, 7.5);
      }
    };
    updateCameraDistance(width);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Atmospheric subtle golden ambient micro-particles
    const particleCount = 130;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#d6b05d'),
      size: 0.045,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Panel Geometry & World Scale (4:5.5 Portrait Exhibition Posters)
    const panelW = 2.4;
    const panelH = 3.3;
    // Subdivided mesh (36x28) so the vertex shader can physically bend the surface along the cylinder
    const geometry = new THREE.PlaneGeometry(panelW, panelH, 36, 28);

    // Cylinder parameters in Three.js world space
    const R = width < 640 ? 6.8 : width < 1024 ? 7.8 : 8.8;
    const gap = 0.52;
    const stepAngle = (panelW + gap) / R;
    const totalAngle = (events.length - 1) * stepAngle;

    // 1x1 placeholder texture to avoid blank frames
    const createPlaceholderTexture = () => {
      const c = document.createElement('canvas');
      c.width = 2;
      c.height = 2;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#1e241b';
      ctx.fillRect(0, 0, 2, 2);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const placeholderTex = createPlaceholderTexture();

    // Create shader material and mesh for each exhibition event
    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy
      ? Math.min(8, renderer.capabilities.getMaxAnisotropy())
      : 1;

    events.forEach((event, idx) => {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: placeholderTex },
          uDelta: { value: new THREE.Vector2(0, 0) },
          uAmplitude: { value: 0.045 },
          uCylinderRadius: { value: R },
          uHover: { value: 0.0 },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });

      // Load high-res texture asynchronously with anisotropic filtering
      textureLoader.load(
        event.image,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = maxAnisotropy;
          material.uniforms.uTexture.value = tex;
          material.needsUpdate = true;
        },
        undefined,
        (err) => {
          console.warn('Exhibition texture loading warning:', event.image, err);
        }
      );

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { index: idx, event };
      scene.add(mesh);
      meshes.push(mesh);
    });

    // Raycaster for interactive hover and click
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(-100, -100);
    let hoveredMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;

    // Corner projection vector for HTML badge pill placement
    const cornerLocal = new THREE.Vector3(panelW * 0.48, -panelH * 0.48, 0.04);
    const cornerWorld = new THREE.Vector3();

    // Animation & Render Loop
    let isRunning = true;
    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      if (!isRunning) return;
      const elapsedTime = clock.getElapsedTime();

      // 1. Damped virtual progress lerp
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.088;

      // 2. Compute smooth scroll velocity for liquid wave deform
      const instantVelocity = (currentProgressRef.current - lastProgressRef.current) * 60;
      smoothedVelocityRef.current += (instantVelocity - smoothedVelocityRef.current) * 0.14;
      lastProgressRef.current = currentProgressRef.current;

      const progress = currentProgressRef.current;
      const currentRotationAngle = progress * totalAngle;

      // Update active index
      const estIndex = Math.min(
        events.length - 1,
        Math.max(0, Math.round(progress * (events.length - 1)))
      );
      setActiveIndex(estIndex);

      // Update progress bar width
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(0.06, progress)})`;
      }

      // 3. Smooth mouse tilt interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      camera.position.x = mouseRef.current.x * 0.32;
      camera.position.y = mouseRef.current.y * 0.22;
      camera.lookAt(0, 0, 0);

      // Rotate ambient particles gently
      particles.rotation.y = elapsedTime * 0.02;

      // 4. Update each panel along the 3D cylindrical arc
      meshes.forEach((mesh, i) => {
        const theta = i * stepAngle - currentRotationAngle;

        // Position on 3D cylindrical arc
        mesh.position.x = R * Math.sin(theta);
        mesh.position.z = R * (Math.cos(theta) - 1.0);
        mesh.position.y = 0;
        mesh.rotation.y = -theta;

        const absTheta = Math.abs(theta);

        // Distance attenuation
        const scale = Math.max(0.72, 1.0 - absTheta * 0.1);
        mesh.scale.set(scale, scale, scale);

        const opacity = Math.max(0.18, 1.0 - Math.pow(absTheta, 1.5) * 0.36);
        mesh.material.uniforms.uOpacity.value = opacity;
        mesh.material.uniforms.uTime.value = elapsedTime;

        // Feed velocity into shader uniforms for liquid wave effect
        mesh.material.uniforms.uDelta.value.x = -smoothedVelocityRef.current * 16.0;
        mesh.material.uniforms.uDelta.value.y = smoothedVelocityRef.current * 4.0;

        // Smooth hover transition
        const targetHover = mesh === hoveredMesh ? 1.0 : 0.0;
        const currentHover = mesh.material.uniforms.uHover.value;
        mesh.material.uniforms.uHover.value += (targetHover - currentHover) * 0.12;

        // 5. Project bottom-right corner to screen space for HTML badge pill
        mesh.updateMatrixWorld();
        cornerWorld.copy(cornerLocal).applyMatrix4(mesh.matrixWorld);
        cornerWorld.project(camera);

        const isFront = cornerWorld.z < 1.0 && cornerWorld.x > -1.25 && cornerWorld.x < 1.25;
        const screenX = (cornerWorld.x * 0.5 + 0.5) * width;
        const screenY = (-cornerWorld.y * 0.5 + 0.5) * height;

        const badgeEl = badgeRefs.current[i];
        if (badgeEl) {
          if (isFront) {
            badgeEl.style.display = 'block';
            badgeEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-35%, -35%)`;
            const badgeOpacity = Math.max(0.1, 1.0 - Math.abs(mesh.position.x) * 0.18);
            badgeEl.style.opacity = `${badgeOpacity}`;
          } else {
            badgeEl.style.display = 'none';
          }
        }
      });

      // 6. Raycast hover detection
      raycaster.setFromCamera(mouseNorm, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0 && !isDraggingRef.current) {
        hoveredMesh = intersects[0].object as THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
        canvas.style.cursor = 'pointer';
      } else {
        hoveredMesh = null;
        canvas.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Trackpad / Mouse Wheel gesture handling (super smooth inertial scroll)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const factor = e.deltaMode === 1 ? 25 : e.deltaMode === 2 ? 400 : 1;
      const normalizedDelta = delta * factor;

      // Sensitivity tuned for silky smooth responsiveness
      const sensitivity = 0.00034;
      const nextTarget = targetProgressRef.current + normalizedDelta * sensitivity;
      targetProgressRef.current = Math.max(0, Math.min(1, nextTarget));
    };

    // Pointer Drag & Touch Swiping
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      dragStartXRef.current = e.clientX;
      dragLastXRef.current = e.clientX;
      dragStartProgressRef.current = targetProgressRef.current;
      dragLastTimeRef.current = performance.now();
      dragVelocityRef.current = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Update normalized coordinates for raycasting and mouse tilt
      const rect = container.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      mouseNorm.x = (localX / rect.width) * 2 - 1;
      mouseNorm.y = -(localY / rect.height) * 2 + 1;

      mouseRef.current.targetX = mouseNorm.x;
      mouseRef.current.targetY = mouseNorm.y;

      if (!isDraggingRef.current) return;

      const now = performance.now();
      const dt = Math.max(1, now - dragLastTimeRef.current);
      const deltaX = e.clientX - dragStartXRef.current;
      const moveStep = e.clientX - dragLastXRef.current;

      if (Math.abs(deltaX) > 6) {
        hasDraggedRef.current = true;
      }

      dragVelocityRef.current = moveStep / dt;
      dragLastXRef.current = e.clientX;
      dragLastTimeRef.current = now;

      const travelWidth = width * 1.35;
      const progressDelta = -deltaX / travelWidth;
      targetProgressRef.current = Math.max(0, Math.min(1, dragStartProgressRef.current + progressDelta));
    };

    const handlePointerUp = (e: PointerEvent) => {
      // If clicking without dragging, check if an exhibition card was clicked
      if (!hasDraggedRef.current && hoveredMesh) {
        const clickedEvent = hoveredMesh.userData.event as ExhibitionEvent;
        if (clickedEvent?.slug) {
          router.push(`/events/${clickedEvent.slug}`);
        }
      }

      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      // Apply flick inertia
      if (Math.abs(dragVelocityRef.current) > 0.12) {
        const inertiaDelta = -dragVelocityRef.current * 0.16;
        targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + inertiaDelta));
      }

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 120);
    };

    // Keyboard navigation (Arrow keys)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(events.length - 1, Math.round(targetProgressRef.current * (events.length - 1)) + 1);
        scrollToCard(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(0, Math.round(targetProgressRef.current * (events.length - 1)) - 1);
        scrollToCard(prev);
      }
    };

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;
      updateCameraDistance(width);
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);

      // Clean up Three.js resources
      geometry.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      placeholderTex.dispose();
      meshes.forEach((m) => {
        const tex = m.material.uniforms.uTexture.value;
        if (tex && tex !== placeholderTex) tex.dispose();
        m.material.dispose();
      });
      renderer.dispose();
    };
  }, [events, router, scrollToCard]);

  const activeEvent = events[activeIndex] || events[0];

  return (
    <section
      ref={containerRef}
      data-lenis-prevent
      className="relative w-full h-[calc(100dvh-68px)] min-h-[580px] max-h-[1100px] bg-[#161A12] text-white flex flex-col justify-between overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Deep Atmospheric Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[70vh] bg-radial from-white/[0.04] via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#161A12] via-transparent to-[#161A12] opacity-80" />
      </div>

      {/* Top Minimal HUD Header (Kerimov Designs style) */}
      <div className="relative z-30 pt-6 sm:pt-8 md:pt-10 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
        <div className="min-w-0 pr-4">
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#d6b05d] block">
            Exhibitions &amp; Events
          </span>
          <h2 className="text-sm sm:text-base font-bold text-gray-200 tracking-wide mt-0.5 truncate max-w-md sm:max-w-xl">
            {activeEvent.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="text-xs font-mono text-gray-400 font-bold tracking-widest">
            {String(activeIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex - 1)}
              disabled={activeIndex <= 0}
              aria-label="Previous exhibition"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex + 1)}
              disabled={activeIndex >= events.length - 1}
              aria-label="Next exhibition"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Three.js Hardware-Accelerated Curved WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full block touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Projected Screen-Space Pill Badges (Direct screenshot match) */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {events.map((event, idx) => (
          <div
            key={event.id}
            ref={(el) => {
              badgeRefs.current[idx] = el;
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ display: 'none' }}
          >
            <Link
              href={`/events/${event.slug}`}
              onClick={(e) => {
                if (hasDraggedRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="pointer-events-auto block px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#343b31]/95 hover:bg-[#434b3e] border border-white/20 hover:border-[#d6b05d]/70 text-[#ece5d8] hover:text-white text-[10.5px] sm:text-[12px] font-black uppercase tracking-[0.16em] shadow-[0_12px_28px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer group"
            >
              <span>{event.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom Minimal HUD: Progress Bar & Interaction Hint */}
      <div className="relative z-30 pb-6 sm:pb-8 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">
            {L.eventsGalleryDragHint}
          </span>
          <div className="relative h-1 w-32 sm:w-44 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 w-full bg-[#d6b05d] origin-left rounded-full transition-transform duration-75"
              style={{ transform: 'scaleX(0.06)' }}
            />
          </div>
        </div>

        <div className="text-[11px] text-gray-400">
          {L.eventsGalleryClickHint}
        </div>
      </div>
    </section>
  );
};
