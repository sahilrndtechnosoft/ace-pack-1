'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// AboutSection's two product images and FeatureShowcase's production-line
// image are tagged with these ids so this component can find where to fly
// the box to, without prop-drilling refs between unrelated sections.
const IMAGE_1_ID = 'about-model-target-1';
const IMAGE_2_ID = 'about-model-target-2';
const IMAGE_3_ID = 'feature-model-target';

const LID_OPEN_ANGLE = Math.PI * 0.62;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

// Each leg finishes its motion at 80% of its scroll range, leaving a short
// dwell before the next one starts — without it the box is in constant
// motion the whole page and every landing reads as drift rather than arrival.
const LEG_MOTION = 0.8;
// Rotation deliberately runs longer than position (follow-through): the box
// settles into place and *then* finishes its turn.
const LEG_ROTATION = 0.95;

// How hard the box chases the scroll position, per second. Replaces GSAP's
// `scrub` weight; higher is tighter to the scroll, lower glides more.
const PROGRESS_DAMPING = 9;

// Fraction of the way to the first image that the box holds at the hero
// before setting off, as a share of that first leg.
const HERO_HOLD = 0.35;
// Where in the final leg the lid starts opening (0-1 of that leg).
const LID_START = 0.55;

// Y-axis turn (radians) presenting the box's front at each stop of the
// journey — a fixed elevation angle alone left it viewed near edge-on
// (a flat wide tray looks like a thin bar from eye level), so the camera
// sits in a top-down 3/4 "product shot" position and the model itself
// turns a little at each landing spot instead of spinning freely.
// Every stop lands at 0 — square to the camera, sitting flat.
const ROTATION_HERO = 0;
const ROTATION_IMAGE_1 = 0;
const ROTATION_IMAGE_2 = 0;
const ROTATION_IMAGE_3 = 0;

// Life comes from a turn *during* the flight instead: peaks mid-leg, back to
// square by the time it arrives.
const ROTATION_SWING = -Math.PI * 0.1;

// Camera per stop: elev/horiz are fractions of the fit distance, fov is the
// lens. Narrowing the fov while pulling back the same amount keeps the box the
// same size on screen but flattens perspective towards orthographic — that is
// what removes the "tilted" look at a landing. A wide lens on a flat tray
// splays its edges into a trapezoid no matter how square the model's rotation
// is, which is why zeroing rotation alone didn't make it read straight.
const CAM_HERO = { elev: 0.68, horiz: 0.92, fov: 32 };
// Coming into the second section the lens starts compressing and the camera
// drops out of its steep look-down.
const CAM_IMAGE_1 = { elev: 0.3, horiz: 0.95, fov: 20 };
// The straight beat: longest lens, lowest camera — edges near parallel, no
// perspective skew, container reads completely level.
const CAM_IMAGE_2 = { elev: 0.18, horiz: 1.0, fov: 16 };
// Opens back up and climbs for the finale so the lid-open reveal is peered into.
const CAM_IMAGE_3 = { elev: 0.82, horiz: 0.58, fov: 28 };

// x and y use different curves so the flight path bows into an arc instead of
// sliding down a straight diagonal.
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeInOutQuart = (x: number) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

// Plain three.js, no @react-three/fiber — see components/ui/ProductModel3D.tsx
// for why. The canvas itself is a small fixed-position square that GSAP
// ScrollTrigger drags/scales across the page (hero -> AboutSection's two
// product images) as the user scrolls; three.js only owns what happens
// inside that square (drag-to-orbit, idle spin, lid hinge).
export const ModelBanner: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!section || !wrapper || !container) return;

    let disposed = false;
    let model: THREE.Object3D | null = null;
    let lidPivot: THREE.Group | null = null;
    let modelRadius = 0;
    let modelSizeY = 0;

    // Touch devices: a fixed canvas parked mid-screen that swallows touch
    // events would eat the page scroll every time a swipe starts on top of it,
    // so the box becomes non-interactive there and drag stays desktop-only.
    const isCoarsePointer =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

    // Where the scroll says we are, and where the box has smoothly caught up
    // to. The gap between them is the glide that `scrub` used to provide.
    let targetProgress = 0;
    let smoothedProgress = 0;
    let targetOpacity = 1;
    let currentOpacity = 1;
    let driveFrame: ((dt: number) => void) | null = null;
    let cleanupLayoutWatch: (() => void) | null = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCoarsePointer ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    // No autoRotate — the scroll journey below drives a deliberate turn at
    // each landing spot, and a free-spinning idle rotation would fight it
    // and just as often leave the box facing away when it settles. Drag
    // still works via the controls below.
    controls.autoRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enabled = !isCoarsePointer;
    if (isCoarsePointer) {
      wrapper.style.pointerEvents = 'none';
    } else {
      renderer.domElement.style.cursor = 'grab';
      renderer.domElement.addEventListener('pointerdown', () => {
        renderer.domElement.style.cursor = 'grabbing';
      });
      renderer.domElement.addEventListener('pointerup', () => {
        renderer.domElement.style.cursor = 'grab';
      });
    }

    new GLTFLoader().load(
      '/box.glb',
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // box.glb ships as two loose meshes (body "Cube", lid "Cube.001"),
        // no rig — build a hinge pivot by hand from the lid's own bounding
        // box (its bottom-back edge) so it can swing open on scroll. Done
        // *before* recentering below, while the lid's bounds are still in
        // the model's own local space (matches what pivot.position/lid.position
        // are interpreted in once reparented).
        const lid = model.getObjectByName('Cube.001');
        if (lid) {
          const lidBox = new THREE.Box3().setFromObject(lid);
          const hinge = new THREE.Vector3(0, lidBox.min.y, lidBox.max.z);
          lidPivot = new THREE.Group();
          lidPivot.position.copy(hinge);
          lid.position.sub(hinge);
          lidPivot.add(lid);
        }
        if (lidPivot) model.add(lidPivot);

        model.position.sub(center);
        scene.add(model);

        modelRadius = size.length() / 2;
        modelSizeY = size.y;
        const fitDistance = modelRadius / Math.sin((Math.PI * CAM_HERO.fov) / 360);
        // Top-down 3/4 "product shot" angle (~35° above horizon) — a low,
        // near eye-level camera made this wide flat tray read as a thin
        // edge-on sliver instead of showing its front/lid.
        camera.fov = CAM_HERO.fov;
        camera.position.set(0, fitDistance * CAM_HERO.elev, fitDistance * CAM_HERO.horiz);
        // Generous near/far: the fov lerp changes the camera's distance, so
        // planes fitted tightly to the hero distance would clip at other stops.
        camera.near = fitDistance / 100;
        camera.far = fitDistance * 100;
        controls.target.set(0, size.y * 0.05, 0);
        camera.lookAt(controls.target);
        camera.updateProjectionMatrix();
        controls.update();
      },
      undefined,
      (err) => console.error('GLTF load failed:', err)
    );

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // ponytail: renders continuously while mounted (there's one instance on
    // the homepage) instead of gating on IntersectionObserver like
    // ProductModel3D does — the canvas is `position: fixed`, so its
    // geometric bounds stay "in viewport" for the whole page, which makes
    // visibility-based start/stop pointless without extra state. Add a
    // progress-based stop once the fade-out (below) finishes if this ever
    // needs to matter for perf.
    // Driven by GSAP's ticker, NOT a private requestAnimationFrame. Lenis is
    // ticked from that same ticker (see SmoothScroll.tsx), and ticker callbacks
    // run in registration order — SmoothScroll mounts ahead of this component,
    // so by the time this runs Lenis has already applied the frame's scroll and
    // ScrollTrigger has already updated. On a private rAF the order against
    // Lenis was undefined, so some frames were computed from the previous
    // frame's scroll position: a one-frame desync that reads as shake.
    const tick = (_time: number, deltaMs: number) => {
      // Clamped: a backgrounded tab returns a huge delta that would snap the
      // box across the page in one frame on return.
      const dt = Math.min(deltaMs / 1000, 0.1);

      // Scroll read, transform write, then draw — once each, in that order.
      driveFrame?.(dt);

      controls.update();
      // Nothing to draw once it has faded out past the last stop — skips the
      // GPU work for the rest of the page, which matters most on phones.
      if (currentOpacity > 0.01) renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    // --- Scroll journey ---------------------------------------------------
    // Rest  (0 → .22):    box sits over the hero slot.
    // Leg 1 (.22 → .44):  flies down-left to AboutSection's main image.
    // Leg 2 (.44 → .66):  flies on to the small overlapping product card,
    //   landing front-face.
    // Leg 3 (.66 → 1):    flies on to FeatureShowcase's production image;
    //   the lid hinges open over the final stretch.
    // Stop geometry is measured in *document* space and cached, so a scroll
    // frame costs pure arithmetic instead of four forced layout reflows —
    // with Lenis, several other ScrollTriggers and a WebGL loop already on
    // the main thread, per-frame getBoundingClientRect() is what made this
    // feel like it was dragging behind the scroll.
    const ctx = gsap.context(() => {
      const target1 = document.getElementById(IMAGE_1_ID);
      const target2 = document.getElementById(IMAGE_2_ID);
      const target3 = document.getElementById(IMAGE_3_ID);
      // Without every stop there is no journey to drive — hide rather than
      // leave a fixed box marooned in the middle of the viewport for the
      // whole page (e.g. if a target section is removed or renamed later).
      if (!target1 || !target2 || !target3) {
        wrapper.style.display = 'none';
        return;
      }

      let naturalWidth = 628;
      // `fit` is the square canvas's edge length at this stop: the wrapper is
      // square, so matching a stop's *width* alone made it overhang a target
      // that is wider than it is tall (the small 176x132 card had the box
      // sticking 22px out top and bottom). Fitting to the smaller side keeps
      // the whole box inside the frame at every stop.
      type Stop = { cx: number; cy: number; fit: number };
      let hero: Stop, img1: Stop, img2: Stop, img3: Stop;

      // Layout geometry via the offsetParent chain, NOT getBoundingClientRect.
      // Every stop is wrapped in <Reveal>, which parks its child on a starting
      // transform until the entrance animation plays (fade-right = x:-36,
      // fade-left = x:+36, zoom-in = scale:.85). A rect measured before those
      // animations run bakes that displacement into the cached stop, and the
      // box then lands 36px off the image — outside its border. offsetLeft /
      // offsetTop / offsetWidth are layout values that transforms cannot move,
      // so the stop is the image's resting place no matter when we measure.
      const measure = (el: HTMLElement): Stop => {
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = el;
        while (node) {
          x += node.offsetLeft;
          y += node.offsetTop;
          const parent = node.offsetParent as HTMLElement | null;
          // offsetLeft/Top are measured from the offsetParent's *padding* edge,
          // so each ancestor's border thickness is missing from the running sum
          // (these sections use border-4 wrappers). clientLeft/clientTop are
          // exactly those border widths.
          if (parent) {
            x += parent.clientLeft;
            y += parent.clientTop;
          }
          node = parent;
        }
        return {
          cx: x + el.offsetWidth / 2,
          cy: y + el.offsetHeight / 2,
          fit: Math.min(el.offsetWidth, el.offsetHeight),
        };
      };

      // Leg boundaries as journey progress. These are DERIVED from where the
      // stops actually sit, never hardcoded: with fixed fractions the legs only
      // lined up with the targets on the desktop layout by coincidence, and on
      // mobile — where the grid stacks and the images spread far apart
      // vertically — the box was still "hero resting" long after the first
      // image had scrolled past, so it never travelled at all.
      let pHeroEnd = 0.22;
      let pImg1 = 0.44;
      let pImg2 = 0.66;
      let mainTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;

      const computeBoundaries = () => {
        if (!mainTrigger) return;
        const span = mainTrigger.end - mainTrigger.start;
        if (span <= 0) return;
        // Progress at which a stop is centred in the viewport.
        const at = (s: Stop) =>
          clamp01((s.cy - window.innerHeight / 2 - mainTrigger!.start) / span);
        pImg1 = at(img1);
        pImg2 = at(img2);
        // Keep the legs strictly increasing and non-degenerate — a layout can
        // put two stops at nearly the same scroll position (the small card
        // overlaps the main image), which would divide by ~0 inside a leg.
        pImg1 = Math.max(pImg1, 0.05);
        pImg2 = Math.max(pImg2, pImg1 + 0.05);
        pImg2 = Math.min(pImg2, 0.9);
        pHeroEnd = pImg1 * HERO_HOLD;
      };

      const remeasure = () => {
        // offsetWidth, not getBoundingClientRect: the wrapper carries our own
        // scale transform, and a rect would report the *scaled* width — every
        // refresh would then divide by a wrong natural width and the landing
        // sizes would drift further out each time.
        naturalWidth = wrapper.offsetWidth || 628;
        // The hero stop takes the section's centre but the wrapper's own
        // width. Leg 1 lerps scale from `hero.w / naturalWidth`, so measuring
        // the section's full width here (1280 desktop / 400 mobile) made scale
        // jump from the resting 1 straight to ~2.0 the instant the leg began,
        // then shrink back down — the box ballooning out past the image frame
        // before settling. Using the wrapper's width makes that start scale
        // exactly 1, continuous with the rest phase.
        hero = { ...measure(section), fit: naturalWidth };
        img1 = measure(target1);
        img2 = measure(target2);
        img3 = measure(target3);
        computeBoundaries();
      };
      remeasure();

      // Scroll offset for the frame, read ONCE per frame in the rAF below and
      // reused by every calculation, so nothing in a frame can disagree about
      // where the page is. Lenis's own value is preferred over window.scrollY:
      // it is the exact number Lenis used to position the document this frame,
      // so the box stays locked to the content instead of shimmering against it.
      let frameScrollX = 0;
      let frameScrollY = 0;
      const readScroll = () => {
        // window.scrollY, not lenis.scroll: Lenis has already applied this
        // frame's position by the time this ticker callback runs, and
        // window.scrollY is the value the browser will actually paint with.
        // Lenis's own float is unrounded, so using it meant the box was placed
        // against a slightly different origin than the page was drawn at —
        // up to a pixel of shimmer that never settles.
        frameScrollY = window.scrollY;
        frameScrollX = window.scrollX;
      };

      // Single writer for the wrapper's transform. Previously GSAP owned
      // x/y/scale/xPercent while Tailwind classes also declared a translate —
      // one inline transform string removes any chance of the two disagreeing,
      // and keeps the -50% centring in the same declaration as the offset.
      const setWrapper = (cx: number, cy: number, scale: number) => {
        const x = cx - frameScrollX - window.innerWidth / 2;
        const y = cy - frameScrollY - window.innerHeight / 2;
        wrapper.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      };

      const setCamera = (
        elevFrac: number,
        horizFrac: number,
        targetY: number,
        fov: number
      ) => {
        if (!modelRadius) return;
        // Distance is derived from the current fov so the box holds its
        // on-screen size while the lens compresses — a dolly-zoom, rather than
        // the box appearing to grow every time the fov narrows.
        const dist = modelRadius / Math.sin((Math.PI * fov) / 360);
        if (camera.fov !== fov) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }
        camera.position.set(0, dist * elevFrac, dist * horizFrac);
        controls.target.set(0, targetY, 0);
        camera.lookAt(controls.target);
      };

      type Cam = { elev: number; horiz: number; fov: number };

      const flyBetween = (
        from: Stop,
        to: Stop,
        fromRot: number,
        toRot: number,
        fromCam: Cam,
        toCam: Cam,
        raw: number
      ) => {
        const move = clamp01(raw / LEG_MOTION);
        const turn = clamp01(raw / LEG_ROTATION);
        setWrapper(
          lerp(from.cx, to.cx, easeInOutCubic(move)),
          lerp(from.cy, to.cy, easeInOutQuart(move)),
          // Plain ease, no back-overshoot: easeOutBack pushed the scale past
          // its target and pulled it back on every landing, which reads as the
          // box wobbling in size rather than settling.
          lerp(from.fit / naturalWidth, to.fit / naturalWidth, easeInOutCubic(move))
        );
        // sin() is 0 at both ends, so the swing washes out exactly on arrival.
        if (model) {
          model.rotation.y =
            lerp(fromRot, toRot, easeOutCubic(turn)) + Math.sin(Math.PI * move) * ROTATION_SWING;
        }
        setCamera(
          lerp(fromCam.elev, toCam.elev, easeInOutCubic(move)),
          lerp(fromCam.horiz, toCam.horiz, easeInOutCubic(move)),
          modelSizeY * 0.05,
          lerp(fromCam.fov, toCam.fov, easeInOutCubic(move))
        );
      };

      // Guards every leg division: boundaries come from live layout, so two
      // stops landing on top of each other must not produce Infinity.
      const span = (a: number, b: number) => Math.max(b - a, 0.001);

      const applyProgress = (p: number) => {
        if (p <= pHeroEnd) {
          setWrapper(hero.cx, hero.cy, 1);
          if (model) model.rotation.y = ROTATION_HERO;
          if (lidPivot) lidPivot.rotation.x = 0;
          setCamera(CAM_HERO.elev, CAM_HERO.horiz, modelSizeY * 0.05, CAM_HERO.fov);
        } else if (p <= pImg1) {
          flyBetween(hero, img1, ROTATION_HERO, ROTATION_IMAGE_1, CAM_HERO, CAM_IMAGE_1,
            (p - pHeroEnd) / span(pHeroEnd, pImg1));
        } else if (p <= pImg2) {
          flyBetween(img1, img2, ROTATION_IMAGE_1, ROTATION_IMAGE_2, CAM_IMAGE_1, CAM_IMAGE_2,
            (p - pImg1) / span(pImg1, pImg2));
        } else {
          const raw = clamp01((p - pImg2) / span(pImg2, 1));
          flyBetween(img2, img3, ROTATION_IMAGE_2, ROTATION_IMAGE_3, CAM_IMAGE_2, CAM_IMAGE_3, raw);

          // Lid timing is a share of this leg rather than an absolute progress
          // window, so it opens at the same point of the approach on any layout.
          const lidT = easeOutCubic(clamp01((raw - LID_START) / (1 - LID_START)));
          if (lidPivot) lidPivot.rotation.x = lidT * LID_OPEN_ANGLE;
          // Camera rises to peer into the box as the lid lifts, instead of
          // staying level with it.
          const move = clamp01(raw / LEG_MOTION);
          setCamera(
            lerp(CAM_IMAGE_2.elev, CAM_IMAGE_3.elev, easeInOutCubic(move)),
            lerp(CAM_IMAGE_2.horiz, CAM_IMAGE_3.horiz, easeInOutCubic(move)),
            lerp(modelSizeY * 0.05, modelSizeY * 0.35, lidT),
            lerp(CAM_IMAGE_2.fov, CAM_IMAGE_3.fov, easeInOutCubic(move))
          );
        }
      };

      // No `scrub`. Scrub tweens progress on GSAP's clock, which put a lagged
      // progress and an instantaneous scroll read into the same transform —
      // the mismatch is what shook. The triggers now only record where the
      // scroll is; the smoothing that scrub used to provide is done per frame
      // in the render loop, so a frame's transform is internally consistent.
      mainTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        endTrigger: target3,
        end: 'center center',
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
        onRefresh: (self) => {
          mainTrigger = self;
          remeasure();
          targetProgress = self.progress;
          // Snap rather than glide after a resize/refresh, so the box doesn't
          // visibly slide across the page to its recalculated position.
          smoothedProgress = self.progress;
          readScroll();
          applyProgress(smoothedProgress);
        },
      });

      ScrollTrigger.create({
        trigger: target3,
        start: 'center center',
        end: '+=250',
        onUpdate: (self) => {
          targetOpacity = 1 - self.progress;
        },
      });

      // Stop geometry is cached, so anything that shifts the page after the
      // last measurement leaves the box landing at a stale position — fonts
      // swapping, lazy images, the CountUp digits widening all move these
      // sections by a few pixels well after ScrollTrigger's refresh. Watching
      // the document's own box catches those and re-measures.
      // Debounced rather than immediate. On phones the address bar
      // showing/hiding resizes the viewport repeatedly while scrolling, and
      // re-measuring on each of those would recompute the leg boundaries
      // (they depend on innerHeight) mid-flight and jump the box. Coalescing
      // to one measurement after things settle keeps the correction — which is
      // what pulls out the last few pixels of drift — without the jumping.
      let settleTimer: ReturnType<typeof setTimeout> | undefined;
      const remeasureSoon = () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(remeasure, 200);
      };
      const layoutObserver = new ResizeObserver(remeasureSoon);
      layoutObserver.observe(document.documentElement);
      window.addEventListener('load', remeasureSoon);

      // The wrapper's own width is refreshed immediately on resize, not just on
      // the debounced pass. Every landing scale is `stop.fit / naturalWidth`,
      // so a stale naturalWidth scales the box by the wrong ratio outright —
      // going from a narrow viewport (where it is 260) to a wide one (628)
      // and scrolling before the debounce lands would size it ~2.4x, filling
      // the screen. One cheap read on a rare event closes that window.
      const syncNaturalWidth = () => {
        naturalWidth = wrapper.offsetWidth || naturalWidth;
        hero.fit = naturalWidth;
        remeasureSoon();
      };
      window.addEventListener('resize', syncNaturalWidth);
      window.addEventListener('orientationchange', syncNaturalWidth);

      cleanupLayoutWatch = () => {
        clearTimeout(settleTimer);
        layoutObserver.disconnect();
        window.removeEventListener('load', remeasureSoon);
        window.removeEventListener('resize', syncNaturalWidth);
        window.removeEventListener('orientationchange', syncNaturalWidth);
      };

      // Hand the frame loop everything it needs to drive the wrapper itself.
      driveFrame = (dt: number) => {
        readScroll();

        // Frame-rate independent exponential damping — the same glide at 60,
        // 90 or 120Hz, where a fixed per-frame factor would be faster on
        // high-refresh screens.
        const k = 1 - Math.exp(-dt * PROGRESS_DAMPING);
        smoothedProgress += (targetProgress - smoothedProgress) * k;
        if (Math.abs(targetProgress - smoothedProgress) < 0.00002) {
          smoothedProgress = targetProgress;
        }
        currentOpacity += (targetOpacity - currentOpacity) * k;

        applyProgress(smoothedProgress);
        wrapper.style.opacity = String(currentOpacity);
      };
    });

    return () => {
      disposed = true;
      driveFrame = null;
      cleanupLayoutWatch?.();
      gsap.ticker.remove(tick);
      ctx.revert();
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((mat) => mat.dispose());
        }
      });
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] sm:h-[calc(100vh-85px)] sm:max-h-[920px] sm:min-h-[520px] bg-[#111518] border-b border-[#E6DBC6]/30"
    >
      {/* Sized ~12% larger than before. No translate utilities here: the
          effect writes one complete transform string (offset + centring +
          scale), and a class-declared translate would be a second, competing
          source for the same property. The inline transform below is only the
          pre-JS resting state so it is centred on first paint.
          min-w keeps it from collapsing to a thumbnail on narrow phones. */}
      <div
        ref={wrapperRef}
        className="fixed top-1/2 left-1/2 w-[60vw] h-[60vw] min-w-[260px] min-h-[260px] max-w-[628px] max-h-[628px] z-30"
        style={{ willChange: 'transform, opacity', transform: 'translate(-50%, -50%)' }}
      >
        {/* Grounding shadow — painted before the canvas so it shows through
            the canvas's transparent margin around the rendered box, and
            inherits the same GSAP transform (position/scale/opacity) since
            it's a sibling inside the same moved/scaled wrapper. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 bottom-[16%] -translate-x-1/2 w-[68%] h-[10%] rounded-full blur-md bg-black/40 pointer-events-none"
        />
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </section>
  );
};
