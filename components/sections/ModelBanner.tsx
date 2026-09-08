'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
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

type ActId = 'emergence' | 'meal' | 'engineering' | 'branding' | 'service' | 'dissolve';
type Act = {
  id: ActId;
  label: string;
  range: readonly [number, number];
  copy: { eyebrow: string; title: string; detail: string };
  camera: { elev: number; horiz: number; fov: number; exposure: number };
};

// One timing table keeps the narrative tunable without scattering magic
// progress windows across the render loop. DOM target positions still decide
// where the service leg lands; acts decide what that travel communicates.
const ACTS: readonly Act[] = [
  {
    id: 'emergence',
    label: 'Emergence',
    range: [0, 0.08],
    copy: {
      eyebrow: 'PRECISION PACKAGING',
      title: 'Engineered to arrive intact.',
      detail: 'A food container designed around the moment it reaches the customer.',
    },
    camera: { elev: 0.7, horiz: 0.92, fov: 32, exposure: 0.86 },
  },
  {
    id: 'meal',
    label: 'The meal',
    range: [0.08, 0.2],
    copy: {
      eyebrow: 'DESIGNED AROUND FOOD',
      title: 'Made to hold the good part.',
      detail: 'Room for real food, a clean seal, and a better unboxing moment.',
    },
    camera: { elev: 0.56, horiz: 0.8, fov: 28, exposure: 0.98 },
  },
  {
    id: 'engineering',
    label: 'Engineering',
    range: [0.2, 0.42],
    copy: {
      eyebrow: 'ENGINEERED PROTECTION',
      title: 'Every layer earns its place.',
      detail: 'Snap-rim geometry, food-grade PP 05, and a label that stays put.',
    },
    camera: { elev: 0.62, horiz: 0.86, fov: 25, exposure: 1.08 },
  },
  {
    id: 'branding',
    label: 'Branding',
    range: [0.42, 0.58],
    copy: {
      eyebrow: 'YOUR BRAND, BUILT IN',
      title: 'Packaging that carries the name.',
      detail: 'In-mould branding stays sharp through chillers, microwaves, and delivery.',
    },
    camera: { elev: 0.3, horiz: 1, fov: 19, exposure: 1.15 },
  },
  {
    id: 'service',
    label: 'In service',
    range: [0.58, 0.85],
    copy: {
      eyebrow: 'READY FOR SERVICE',
      title: 'From production line to last mile.',
      detail: 'A dependable format for QSRs, cloud kitchens, caterers, and food brands.',
    },
    camera: { elev: 0.28, horiz: 0.96, fov: 20, exposure: 1.02 },
  },
  {
    id: 'dissolve',
    label: 'Dissolve',
    range: [0.85, 1],
    copy: {
      eyebrow: 'ACEPACK PACKAGING',
      title: 'Protection you can build a business on.',
      detail: 'Precision-moulded containers made for food that needs to travel well.',
    },
    camera: { elev: 0.82, horiz: 0.58, fov: 28, exposure: 0.94 },
  },
];

const actAt = (progress: number) => {
  const safeProgress = clamp01(progress);
  return ACTS.findIndex((act) => safeProgress <= act.range[1]) === -1
    ? ACTS.length - 1
    : ACTS.findIndex((act) => safeProgress <= act.range[1]);
};

const actLocalProgress = (progress: number, actIndex: number) => {
  const [start, end] = ACTS[actIndex].range;
  return clamp01((progress - start) / Math.max(end - start, 0.001));
};

// Stop short of a fully flipped lid so the open panel stays inside the camera
// frame and reads clearly as a hinged part of the pack.
// Negative, and the hinge below sits on the lid's BACK edge (min.z), because
// the camera looks in from +Z. Hinged on the front edge with a positive angle
// the lid swung up between the viewer and the meal, which is what made the
// opening look backwards — it covered the very thing it was uncovering. Hinged
// at the back it lifts its front edge up and away, clamshell-style, and leaves
// the food facing the camera.
const LID_OPEN_ANGLE = -Math.PI * 0.24;

// The camera fit is measured from the CLOSED pack, but an open lid is a 3.46
// unit panel swung up off the back edge: at the old 57.6 degrees its top edge
// reached y=3.2 against a closed model only 1.28 tall, so the lid simply left
// the canvas and got cut off. Rather than pull the camera back far enough to
// hold the worst case at all times — which would shrink the container for the
// whole page — the framing follows the silhouette: it rises and widens only
// while the lid is actually open, and returns as it closes.
const LID_FRAME_EXPAND = 0.25;
const LID_FRAME_RISE = 0.66;

// Clearance kept between the top of the canvas and the top of the viewport,
// covering the sticky header.
const HEADER_CLEARANCE = 96;
const FOOD_REVEAL_START = 0.12;

// Where each portion sits, as a fraction of the MEASURED interior: x/z run
// -1..1 across the pocket, footprint is a share of the interior width. The tray
// is a single open cavity with no moulded dividers, so the separation between
// portions has to come from the layout — these slots are packed by hand not to
// overlap, against the raycast-measured pocket of 3.838 x 2.817.
const FOOD_SLOTS = [
  // rough/coat/sheen give each item its own surface behaviour. The source
  // models all share one flat palette texture, so without this every portion
  // returns light identically and the whole meal reads as one moulded object.
  // A cut tomato is wet and near-specular; broccoli florets are dry and matte;
  // leaves have a sheen at grazing angles.
  { src: '/models/food/salad.glb',        x:  0.01, z: -0.49, footprint: 0.3,   yaw:  0.35, start: 0.1,  rough: 0.68, coat: 0.08, sheen: 0.4 },
  { src: '/models/food/broccoli.glb',     x: -0.03, z:  0.52, footprint: 0.235, yaw: -0.6,  start: 0.26, rough: 0.88, coat: 0.0,  sheen: 0.28 },
  { src: '/models/food/maki-salmon.glb',  x:  0.55, z: -0.64, footprint: 0.185, yaw:  1.1,  start: 0.38, rough: 0.55, coat: 0.12, sheen: 0.12 },
  { src: '/models/food/rice-ball.glb',    x:  0.68, z: -0.02, footprint: 0.175, yaw: -0.25, start: 0.5,  rough: 0.7,  coat: 0.05, sheen: 0.22 },
  { src: '/models/food/tomato-slice.glb', x:  0.5,  z:  0.62, footprint: 0.185, yaw:  0.8,  start: 0.62, rough: 0.38, coat: 0.3,  sheen: 0.05 },
] as const;

// Rice bed: the left third of the pocket, clear of the salad slot beside it.
const RICE_SLOT = { x: -0.62, z: 0.01, footprintX: 0.352, footprintZ: 0.834 };
// 260 grains covered only ~38% of the bed's footprint, so it scattered like
// popcorn instead of reading as a served portion. Instanced, so the extra
// grains are the same single draw call.
const RICE_GRAINS = 720;

// The camera fits to the model's bounding SPHERE, whose radius on this tray is
// 2.97 — but the widest extent it ever presents on screen is 2.33, because a
// wide flat box is nowhere near its own diagonal from a top-down 3/4 angle.
// Fitting to the sphere left roughly a quarter of the frame as dead margin all
// round, which on the small square mobile canvas read as "the container is tiny
// and there is a gap above it". Pulled in to just outside the true extent;
// below ~0.80 the tray starts clipping its own corners at the hero angle.
const FIT_TIGHTNESS_FINE = 0.86;
const FIT_TIGHTNESS_COARSE = 0.8;
// The model now fills far more of its canvas, so a landing sized to the whole
// target image would overhang the frame. Trims the landing box by the same
// order the model grew.
const STOP_FIT_MARGIN = 0.86;

// Phones centre the container in the section while the hero copy is anchored to
// the section's bottom edge, so every pixel of slack collects in one band
// between the header and the box. Lifting the resting stop moves that slack
// below the container, where the copy has a use for it. A fraction of the
// canvas rather than a pixel count, so it tracks the box's own size.
const HERO_LIFT_COARSE = 0.145;
const ROTATION_TILT = Math.PI * 0.055;
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

// Roughly how long the box takes to arrive at the scroll's position, in
// seconds. This drives a critically damped spring rather than the exponential
// filter that PROGRESS_DAMPING gives (which is still used for the fade).
//
// The difference matters: an exponential filter's output velocity is
// proportional to its remaining distance, so every time the scroll target
// jumps — which is every wheel event — the box's speed changes instantly.
// Dozens of those a second is exactly the texture that reads as "not smooth".
// A critically damped spring carries velocity across frames, so it accelerates
// into a scroll and coasts out of one, and reversing direction curves through
// zero instead of hinging at it. Higher = more glide, more lag behind the
// finger; below ~0.12 it stops being distinguishable from the old filter.
const PROGRESS_SMOOTH_TIME = 0.18;

// Critically damped spring (the standard Game Programming Gems / SmoothDamp
// form). Frame-rate independent: the `expo` term is a Pade approximation of
// e^-x, so 60Hz and 120Hz settle over the same wall-clock time rather than the
// same number of frames.
const smoothDamp = (
  current: number,
  target: number,
  velocity: number,
  smoothTime: number,
  dt: number
): [number, number] => {
  const omega = 2 / Math.max(smoothTime, 0.0001);
  const x = omega * dt;
  const expo = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (velocity + omega * change) * dt;
  return [target + (change + temp) * expo, (velocity - omega * temp) * expo];
};

// Fraction of the way to the first image that the box holds at the hero
// before setting off, as a share of that first leg.
// Fraction of the engineering act spent separating before it reassembles.
const ENGINEERING_PEAK = 0.62;
// Raised from 0.35: the lid opening and the whole plating sequence used to be
// crammed into the first third of leg one, so the reveal was over in a couple of
// hundred pixels of scroll and read as a snap rather than a motion.
const HERO_HOLD = 0.45;
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
// Opens back up and climbs for the finale so the spilled meal remains visible.
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
// inside that square (drag-to-orbit, lid hinge, food release, and material states).
export const ModelBanner: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const annotationRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!section || !wrapper || !container) return;

    let disposed = false;
    let model: THREE.Object3D | null = null;
    let lidPivot: THREE.Group | null = null;
    let labelSurface: THREE.Group | null = null;
    let labelLayers: THREE.Mesh[] = [];
    let contactShadow: THREE.Mesh | null = null;
    let modelSize = new THREE.Vector3();
    let bodyMesh: THREE.Object3D | null = null;
    let bodyBasePosition = new THREE.Vector3();
    let lidBasePosition = new THREE.Vector3();
    let steamSprites: THREE.Sprite[] = [];
    let steamBasePositions: THREE.Vector3[] = [];
    let steamTexture: THREE.Texture | null = null;
    let scrollModelRotationY = 0;
    let currentWrapper = { x: 0, y: 0, scale: 1 };
    let smoothedPointer = { x: 0, y: 0 };
    let targetPointer = { x: 0, y: 0 };
    let microPhase = 0;
    let modelReady = false;
    let completedAssets = 0;
    const totalAssets = 6;
    let qualityReduced = false;
    let qualitySampleFrames = 0;
    let qualitySampleTime = 0;
    // `entry` is where a portion starts the plating move and `rest` is where it
    // ends: raised slightly above its slot, settling DOWN onto the tray floor.
    // It used to be the reverse — rest -> release, with release outside the
    // container — which is what left the meal hanging in mid-air once the
    // reveal finished.
    type FoodPiece = {
      mesh: THREE.Object3D;
      rest: THREE.Vector3;
      entry: THREE.Vector3;
      restRotation: THREE.Euler;
      entryRotation: THREE.Euler;
      restScale: number;
      start: number;
    };
    const foodPieces: FoodPiece[] = [];
    let modelRadius = 0;
    let modelSizeY = 0;

    // Touch devices: a fixed canvas parked mid-screen that swallows touch
    // events would eat the page scroll every time a swipe starts on top of it,
    // so the box becomes non-interactive there and drag stays desktop-only.
    const isCoarsePointer =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Where the scroll says we are, and where the box has smoothly caught up
    // to. The gap between them is the glide that `scrub` used to provide.
    let targetProgress = 0;
    let smoothedProgress = 0;
    let progressVelocity = 0;
    // 0 = sealed, 1 = fully open. Single source of truth for the lid: the
    // rotation, and the camera framing that has to accommodate it, are both
    // derived from this rather than being written independently.
    let lidOpenAmount = 0;
    let targetOpacity = 1;
    let currentOpacity = 1;
    let driveFrame: ((dt: number) => void) | null = null;
    let cleanupLayoutWatch: (() => void) | null = null;
    let cleanupInteraction: (() => void) | null = null;

    // The loop below is dirty-flag driven rather than unconditional: `needsApply`
    // forces one transform/camera write after something outside the scroll
    // changed (model loaded, layout re-measured), and `needsRender` says the
    // frame actually differs from the one already on screen. With the page
    // still, both stay false and the whole WebGL draw is skipped.
    let needsRender = true;
    let needsApply = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);

    // A 628px canvas at devicePixelRatio 2 is ~1.6M fragments every frame, on
    // top of Lenis, ScrollTrigger and the reveal animations already competing
    // for the same frame budget — the single biggest cost on this page. 1.5
    // (1 on phones) roughly halves that with no visible difference at this
    // size, and MSAA is only worth paying for when the buffer isn't already
    // being supersampled.
    const pixelRatio = Math.min(window.devicePixelRatio, isCoarsePointer ? 1 : 1.5);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: pixelRatio < 1.5,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    // Real shadow casting. Food sitting in a tray with nothing under it is the
    // single most "pasted on" thing in the frame — a contact shadow is what
    // tells the eye a thing has weight and is actually resting on a surface.
    // One extra depth pass per render, and the dirty-flag loop means that is
    // only paid on frames that actually change.
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // A single PMREM-filtered room gives the plastic a stable studio highlight
    // without adding an HDR download or a second render pass every frame.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    // Blur sigma, not the default 0. RoomEnvironment is built from boxes with
    // emissive rectangular light panels, and at zero blur those panels reflect
    // in the glossy lid as hard-edged white rectangles that read as debris
    // floating over the food. Prefiltering keeps all of the lighting benefit
    // and leaves soft highlights instead of visible geometry.
    const environmentTarget = pmrem.fromScene(room, 0.14);
    scene.environment = environmentTarget.texture;
    room.dispose();
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    // Half resolution on phones: the shadow is a soft contact blob at this
    // canvas size, so the extra texels buy nothing there.
    keyLight.shadow.mapSize.set(isCoarsePointer ? 512 : 1024, isCoarsePointer ? 512 : 1024);
    // normalBias rather than a large depth bias: the tray floor is a broad
    // surface almost parallel to the light, which is exactly the case where a
    // plain bias either acne-stripes or detaches the shadow from the food.
    keyLight.shadow.bias = -0.0009;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xd9b978, 0.35);
    rimLight.position.set(-3, 4, -5);
    scene.add(rimLight);

    const generatedTextures: THREE.Texture[] = [];

    // Procedural micro-detail, generated rather than downloaded so it costs no
    // request and tiles seamlessly (power-of-two, wrap-addressed).
    //
    // A perfectly uniform roughness is the strongest "this is CG" tell on a
    // moulded surface: real polypropylene carries mould texture, flow lines and
    // handling scuffs, so its highlight breaks up across a panel instead of
    // sliding across it as one clean shape. Same for food — a flat colour with
    // flat roughness reads as plastic fruit.
    const makeDetailMaps = () => {
      const size = 256;
      const height = document.createElement('canvas');
      height.width = size;
      height.height = size;
      const hctx = height.getContext('2d');
      if (!hctx) return null;

      // Seeded, so the surface is identical on every load.
      let seed = 0x1a2b3c4d;
      const rnd = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      const noise = hctx.createImageData(size, size);
      for (let i = 0; i < size * size; i += 1) {
        // Deliberately narrow band around mid-grey. Full-range noise reads as
        // dirt or speckle; this is meant to be felt, not seen.
        const v = 128 + (rnd() - 0.5) * 88;
        noise.data[i * 4] = v;
        noise.data[i * 4 + 1] = v;
        noise.data[i * 4 + 2] = v;
        noise.data[i * 4 + 3] = 255;
      }
      hctx.putImageData(noise, 0, 0);
      // One blur pass turns per-pixel hash into a surface with a grain size.
      const blurred = document.createElement('canvas');
      blurred.width = size;
      blurred.height = size;
      const bctx = blurred.getContext('2d');
      if (!bctx) return null;
      bctx.filter = 'blur(1.5px)';
      bctx.drawImage(height, 0, 0);
      bctx.filter = 'none';

      // Height -> tangent-space normal by central difference. Sampling wraps
      // with a bitmask, so the derived normal map tiles as seamlessly as the
      // height it came from.
      const src = bctx.getImageData(0, 0, size, size).data;
      const normal = document.createElement('canvas');
      normal.width = size;
      normal.height = size;
      const nctx = normal.getContext('2d');
      if (!nctx) return null;
      const out = nctx.createImageData(size, size);
      const mask = size - 1;
      const at = (x: number, y: number) => src[(((y & mask) * size) + (x & mask)) * 4] / 255;
      const strength = 2.4;
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
          const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
          const len = Math.hypot(dx, dy, 1);
          const i = ((y * size) + x) * 4;
          out.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
          out.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
          out.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
          out.data[i + 3] = 255;
        }
      }
      nctx.putImageData(out, 0, 0);

      const build = (canvas: HTMLCanvasElement, repeat: number) => {
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeat, repeat);
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
        // Left in linear space on purpose: these are data, not colour.
        generatedTextures.push(texture);
        return texture;
      };
      return {
        shellRough: build(blurred, 5),
        shellNormal: build(normal, 5),
        foodRough: build(blurred, 14),
        foodNormal: build(normal, 14),
      };
    };
    const detail = makeDetailMaps();
    const makeBrandTexture = (name: string, accent: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#171a1c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = accent;
      ctx.fillRect(28, 28, 456, 10);
      ctx.font = '700 38px Arial';
      ctx.fillText(name, 30, 130);
      ctx.font = '700 16px Arial';
      ctx.fillStyle = '#fdfcf9';
      ctx.fillText('FOOD PACKAGING SYSTEMS', 30, 174);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      generatedTextures.push(texture);
      return texture;
    };

    const markAssetComplete = () => {
      if (disposed) return;
      completedAssets += 1;
      setLoadProgress(Math.min(Math.round((completedAssets / totalAssets) * 100), 100));
      if (completedAssets >= totalAssets) {
        modelReady = true;
        setAssetsReady(true);
      }
    };

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
    controls.enabled = !isCoarsePointer && !prefersReducedMotion;
    if (prefersReducedMotion) {
      wrapper.style.position = 'absolute';
    }
    const onPointerDown = () => {
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onPointerUp = () => {
      renderer.domElement.style.cursor = 'grab';
      needsApply = true;
    };
    if (isCoarsePointer) {
      wrapper.style.pointerEvents = 'none';
    } else {
      renderer.domElement.style.cursor = 'grab';
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointerup', onPointerUp);
    }

    const onPointerMove = (event: PointerEvent) => {
      if (isCoarsePointer || prefersReducedMotion) return;
      targetPointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    new GLTFLoader().load(
      '/box.glb',
      (gltf) => {
        if (disposed) return;
        const loadedModel = gltf.scene;
        model = loadedModel;
        bodyMesh = loadedModel.getObjectByName('Cube') ?? null;
        if (bodyMesh) bodyBasePosition.copy(bodyMesh.position);
        loadedModel.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (!(material instanceof THREE.MeshPhysicalMaterial)) return;
            material.envMapIntensity = 1.25;
            material.clearcoat = 0.6;
            material.clearcoatRoughness = 0.15;
            material.roughness = Math.min(material.roughness, 0.3);
          });
        });

        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // box.glb ships as two loose meshes, no rig — build a hinge pivot by
        // hand from the lid's own bounding box (its bottom-back edge) so it can
        // swing open on scroll. Done *before* recentering below, while the
        // lid's bounds are still in the model's own local space (matches what
        // pivot.position/lid.position are interpreted in once reparented).
        //
        // Located by MATERIAL, not by name. The GLB's node is authored as
        // "Cube.001", but GLTFLoader runs every name through
        // PropertyBinding.sanitizeNodeName, which strips dots — by the time it
        // reaches here the node is called "Cube001", so the old
        // getObjectByName('Cube.001') returned undefined and silently disabled
        // this whole block. With no lidPivot the lid never opened, and the meal
        // animated out through a shut lid and hung in the air. Matching on "the
        // mesh with the transmissive material" also survives a re-export.
        let lid: THREE.Object3D | null = null;
        loadedModel.traverse((child) => {
          if (lid || !(child instanceof THREE.Mesh)) return;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          if (materials.some((m) => m instanceof THREE.MeshPhysicalMaterial && (m.transmission > 0 || m.transparent))) {
            lid = child;
          }
        });

        // The base ships as metalness 0.48 over a near-black (0.0024 linear)
        // albedo. That is a dark *metal*, and it is most of why the container
        // never read as a moulded food container: no diffuse shading to
        // describe its form, just a dim specular. Plastics are dielectric, so
        // metalness goes to zero and the moulded sheen comes from a clearcoat.
        if (bodyMesh) {
          const shell = new THREE.MeshPhysicalMaterial({
            color: 0x1c2024,
            metalness: 0,
            // roughnessMap MULTIPLIES this, and the noise averages ~0.5, so the
            // base is set high to land around 0.43 with variation either side
            // rather than one flat value across the whole shell.
            roughness: detail ? 0.86 : 0.42,
            roughnessMap: detail ? detail.shellRough : null,
            normalMap: detail ? detail.shellNormal : null,
            normalScale: new THREE.Vector2(0.16, 0.16),
            clearcoat: 0.6,
            clearcoatRoughness: 0.24,
            envMapIntensity: 1.0,
          });
          bodyMesh.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            const previous = Array.isArray(child.material) ? child.material : [child.material];
            child.material = shell;
            previous.forEach((m) => m.dispose());
            // box.glb is authored flat-shaded — 2025 distinct normals across
            // 2515 vertices — so every fillet and corner radius rendered as a
            // visible facet, which is most of the "cartoon" read on the
            // container. A 35 degree crease smooths the mouldings while keeping
            // the rim and the wall edges genuinely sharp.
            const smoothed = toCreasedNormals(child.geometry, Math.PI / 5.15);
            child.geometry.dispose();
            child.geometry = smoothed;
            child.castShadow = true;
            child.receiveShadow = true;
          });
        }

        if (lid) {
          // Clear polypropylene rather than the gold tint this used to force —
          // a gold-tinted lid over food reads as stained, not premium.
          // Transmission costs a second scene pass per frame, so touch devices
          // fall back to plain alpha; at that canvas size the refraction is not
          // resolvable anyway.
          (lid as THREE.Object3D).traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (!(material instanceof THREE.MeshPhysicalMaterial)) return;
              material.color.set(0xeef2f2);
              material.metalness = 0;
              // Just rough enough to break up a mirror reflection of the
              // environment; below ~0.12 the room's panels stay legible.
              material.roughness = 0.13;
              material.clearcoat = 0.55;
              material.clearcoatRoughness = 0.06;
              material.ior = 1.46;
              material.envMapIntensity = 0.95;
              material.transparent = true;
              if (isCoarsePointer) {
                material.transmission = 0;
                material.opacity = 0.34;
              } else {
                material.transmission = 0.94;
                material.thickness = 0.16;
                material.opacity = 1;
              }
              material.needsUpdate = true;
            });
          });
          (lid as THREE.Object3D).traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            const smoothed = toCreasedNormals(child.geometry, Math.PI / 5.15);
            child.geometry.dispose();
            child.geometry = smoothed;
            // Deliberately casts nothing. Shadow maps are opaque, so a clear
            // lid would drop a solid black slab over the meal it is supposed
            // to be showing off.
            child.castShadow = false;
            child.receiveShadow = false;
          });
          const lidObject = lid as THREE.Object3D;
          const lidBox = new THREE.Box3().setFromObject(lidObject);
          const hinge = new THREE.Vector3(0, lidBox.min.y, lidBox.min.z);
          lidPivot = new THREE.Group();
          lidPivot.position.copy(hinge);
          lidObject.position.sub(hinge);
          lidPivot.add(lidObject);
          lidBasePosition.copy(lidPivot.position);
        }
        if (lidPivot) loadedModel.add(lidPivot);

        // --- Interior geometry: measured off the mesh, not guessed --------
        // The meal used to be placed at `box.min.y + size.y * 0.56`, which on
        // this model is 0.295 units ABOVE the real tray floor — a quarter of
        // the cavity depth — so every portion hovered before the reveal even
        // touched it. Raycasting the body finds the true floor and the usable
        // footprint, and re-derives both if box.glb is ever re-exported.
        loadedModel.updateMatrixWorld(true);
        const bodyBox = bodyMesh ? new THREE.Box3().setFromObject(bodyMesh) : box;
        const rayDown = new THREE.Raycaster();
        const DOWN_AXIS = new THREE.Vector3(0, -1, 0);
        const probeFrom = new THREE.Vector3();
        // Straight down from above the rim: inside the cavity the first hit is
        // the interior floor, over a wall it is the rim top. That difference is
        // what maps the pocket.
        const floorAt = (x: number, z: number): number => {
          if (!bodyMesh) return NaN;
          probeFrom.set(x, bodyBox.max.y + size.y, z);
          rayDown.set(probeFrom, DOWN_AXIS);
          const hit = rayDown.intersectObject(bodyMesh, true);
          return hit.length ? hit[0].point.y : NaN;
        };
        const centreFloor = floorAt(0, 0);
        const interiorFloor = Number.isNaN(centreFloor) ? bodyBox.min.y + size.y * 0.1 : centreFloor;

        // Walk each axis and keep the run sitting at floor level. 48 samples is
        // ~100 rays against a 4.9k-triangle mesh, once, at load.
        const spanOf = (axis: 'x' | 'z'): [number, number] => {
          const lo = axis === 'x' ? bodyBox.min.x : bodyBox.min.z;
          const hi = axis === 'x' ? bodyBox.max.x : bodyBox.max.z;
          const tolerance = size.y * 0.05;
          let first = NaN;
          let last = NaN;
          for (let i = 0; i <= 48; i += 1) {
            const t = lo + ((hi - lo) * i) / 48;
            const y = axis === 'x' ? floorAt(t, 0) : floorAt(0, t);
            if (Number.isNaN(y) || Math.abs(y - interiorFloor) > tolerance) continue;
            if (Number.isNaN(first)) first = t;
            last = t;
          }
          return Number.isNaN(first) ? [lo * 0.82, hi * 0.82] : [first, last];
        };
        const [ixMin, ixMax] = spanOf('x');
        const [izMin, izMax] = spanOf('z');
        const interior = {
          cx: (ixMin + ixMax) / 2,
          cz: (izMin + izMax) / 2,
          halfX: Math.max((ixMax - ixMin) / 2, 0.001),
          halfZ: Math.max((izMax - izMin) / 2, 0.001),
          width: Math.max(ixMax - ixMin, 0.001),
          depthZ: Math.max(izMax - izMin, 0.001),
          floor: interiorFloor,
          height: Math.max(bodyBox.max.y - interiorFloor, 0.001),
        };

        const meal = new THREE.Group();
        // Kept for the steam sprites below, now anchored to the real floor so
        // the vapour rises off the food instead of out of thin air.
        const mealCenterY = interior.floor;
        const mealCenterZ = interior.cz;
        const foodScale = Math.max(Math.min(size.x, size.z), 0.1);

        const addPiece = (
          mesh: THREE.Object3D,
          rest: THREE.Vector3,
          restScale: number,
          start: number
        ) => {
          // Each portion drops into its slot from just above it and settles.
          // The lift is a fraction of the cavity, so nothing ever begins or
          // ends outside the container.
          const entry = rest.clone();
          entry.y += interior.height * 0.85;
          mesh.position.copy(entry);
          const restRotation = mesh.rotation.clone();
          meal.add(mesh);
          foodPieces.push({
            mesh,
            rest: rest.clone(),
            entry,
            restRotation,
            entryRotation: new THREE.Euler(
              restRotation.x - 0.22,
              restRotation.y - 0.55,
              restRotation.z + 0.18
            ),
            restScale,
            start,
          });
        };

        // Rice bed. A squashed sphere was the least convincing thing in frame;
        // 260 instanced grains cost one draw call and actually read as rice.
        // Seeded, so every reload plates the bed identically.
        let riceSeed = 0x9e3779b9;
        const rnd = () => {
          riceSeed = (riceSeed * 1664525 + 1013904223) >>> 0;
          return riceSeed / 4294967296;
        };
        const riceHalfX = (interior.width * RICE_SLOT.footprintX) / 2;
        const riceHalfZ = (interior.depthZ * RICE_SLOT.footprintZ) / 2;
        const grainRadius = Math.min(riceHalfX, riceHalfZ) * 0.045;
        const bedHeight = Math.min(interior.height * 0.3, riceHalfZ * 0.34);
        const riceMaterial = new THREE.MeshStandardMaterial({
          color: 0xf4ead2,
          roughness: 0.58,
          metalness: 0,
        });
        const grains = new THREE.InstancedMesh(
          new THREE.CapsuleGeometry(grainRadius, grainRadius * 2.1, 2, 6),
          riceMaterial,
          RICE_GRAINS
        );
        const grainMatrix = new THREE.Matrix4();
        const grainQuat = new THREE.Quaternion();
        const grainEuler = new THREE.Euler();
        const grainPos = new THREE.Vector3();
        const grainScale = new THREE.Vector3(1, 1, 1);
        for (let i = 0; i < RICE_GRAINS; i += 1) {
          const angle = rnd() * Math.PI * 2;
          // sqrt keeps the scatter even by area rather than clustering at the
          // centre, which is what makes a bed read as poured instead of piled.
          const radius = Math.sqrt(rnd());
          const mound = bedHeight * (0.3 + 0.7 * (1 - radius * radius));
          grainPos.set(
            Math.cos(angle) * radius * riceHalfX,
            grainRadius + rnd() * mound,
            Math.sin(angle) * radius * riceHalfZ
          );
          // Capsule geometry is Y-long, so a quarter turn of roll lays each
          // grain flat in the bed.
          grainEuler.set((rnd() - 0.5) * 0.8, rnd() * Math.PI * 2, Math.PI / 2 + (rnd() - 0.5) * 0.6);
          grainQuat.setFromEuler(grainEuler);
          grainMatrix.compose(grainPos, grainQuat, grainScale);
          grains.setMatrixAt(i, grainMatrix);
        }
        grains.instanceMatrix.needsUpdate = true;
        grains.castShadow = true;
        grains.receiveShadow = true;
        const riceBed = new THREE.Group();
        riceBed.add(grains);
        addPiece(
          riceBed,
          new THREE.Vector3(
            interior.cx + RICE_SLOT.x * interior.halfX,
            interior.floor,
            interior.cz + RICE_SLOT.z * interior.halfZ
          ),
          1,
          0
        );

        // Steam is intentionally sprite-based: it reads as warm food at a
        // glance, costs almost nothing compared with another GLB, and can
        // fade in/out with the meal act without adding a post-process pass.
        const steamCanvas = document.createElement('canvas');
        steamCanvas.width = 96;
        steamCanvas.height = 160;
        const steamContext = steamCanvas.getContext('2d');
        if (steamContext) {
          // Radius 48, not 60: the canvas is only 96 wide, so a 60px radius ran
          // past the left and right edges and cut the falloff off mid-gradient
          // — the sprite rendered with hard vertical sides and read as a white
          // rectangle instead of vapour.
          const steamGradient = steamContext.createRadialGradient(48, 80, 3, 48, 80, 48);
          steamGradient.addColorStop(0, 'rgba(255, 248, 224, 0.5)');
          steamGradient.addColorStop(1, 'rgba(255, 248, 224, 0)');
          steamContext.fillStyle = steamGradient;
          steamContext.fillRect(0, 0, steamCanvas.width, steamCanvas.height);
          steamTexture = new THREE.CanvasTexture(steamCanvas);
          generatedTextures.push(steamTexture);
          [-0.24, 0, 0.24].forEach((offset, index) => {
            const steam = new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: steamTexture,
                color: 0xfff8e0,
                transparent: true,
                depthWrite: false,
                opacity: 0,
              })
            );
            steam.position.set(offset * foodScale, mealCenterY + foodScale * (0.42 + index * 0.04), mealCenterZ);
            steam.scale.set(foodScale * 0.18, foodScale * 0.35, 1);
            meal.add(steam);
            steamSprites.push(steam);
            steamBasePositions.push(steam.position.clone());
          });
        }

        // A runtime label layer gives the engineering/branding acts a real
        // surface to separate and cross-fade without changing the source GLB.
        const labelGroup = new THREE.Group();
        const labelPosition = new THREE.Vector3(
          center.x,
          box.min.y + size.y * 0.38,
          box.max.z + 0.012
        );
        const brandSpecs = [
          ['ACEPACK', '#d9b978'],
          ['FRESH BITES', '#77a88f'],
          ['URBAN EATS', '#d4794d'],
        ] as const;
        brandSpecs.forEach(([name, accent], index) => {
          const texture = makeBrandTexture(name, accent);
          if (!texture) return;
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: index === 0 ? 0.62 : 0,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
          const label = new THREE.Mesh(
            new THREE.PlaneGeometry(size.x * 0.48, size.y * 0.17),
            material
          );
          label.position.copy(labelPosition);
          label.position.z += index * 0.004;
          labelGroup.add(label);
          labelLayers.push(label);
        });
        labelSurface = labelGroup;
        loadedModel.add(labelGroup);

        // Soft alpha texture on a real Three.js plane keeps the object grounded
        // while the wrapper travels, unlike a DOM blob that cannot respond to
        // the package's lift and exploded states.
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = 128;
        shadowCanvas.height = 128;
        const shadowContext = shadowCanvas.getContext('2d');
        if (shadowContext) {
          const gradient = shadowContext.createRadialGradient(64, 64, 8, 64, 64, 62);
          gradient.addColorStop(0, 'rgba(20, 24, 26, 0.42)');
          gradient.addColorStop(1, 'rgba(20, 24, 26, 0)');
          shadowContext.fillStyle = gradient;
          shadowContext.fillRect(0, 0, 128, 128);
          const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
          generatedTextures.push(shadowTexture);
          const shadowMaterial = new THREE.MeshBasicMaterial({
            map: shadowTexture,
            transparent: true,
            depthWrite: false,
          });
          contactShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(size.x * 1.25, size.z * 0.9),
            shadowMaterial
          );
          contactShadow.rotation.x = -Math.PI / 2;
          contactShadow.position.set(center.x, box.min.y + 0.006, center.z);
          loadedModel.add(contactShadow);
        }

        const foodLoader = new GLTFLoader();
        FOOD_SLOTS.forEach((slot) => {
          foodLoader.load(
            slot.src,
            (foodGltf) => {
              if (disposed) return;
              const food = foodGltf.scene;
              // Yaw plus a couple of degrees of tilt, nothing more. The old
              // table applied up to 2 radians of pitch and roll, which tipped
              // every portion onto its side; plated food sits upright.
              food.rotation.set(0, slot.yaw, (rnd() - 0.5) * 0.08);
              food.updateMatrixWorld(true);

              const foodBox = new THREE.Box3().setFromObject(food);
              const foodSize = new THREE.Vector3();
              const foodCentre = new THREE.Vector3();
              foodBox.getSize(foodSize);
              foodBox.getCenter(foodCentre);
              // Origin at the piece's own centre, so the holder scales about
              // the food rather than about the GLB's authored origin.
              food.position.sub(foodCentre);

              food.traverse((child) => {
                if (!(child instanceof THREE.Mesh)) return;

                // These are 56-220 triangle models, so they arrive heavily
                // faceted. 45 degrees rounds the organic curvature without
                // welding the whole shape into one smooth lump — at 80 degrees
                // the broccoli lost its florets and read as a green toy, which
                // is worse than the faceting it replaced.
                const smoothed = toCreasedNormals(child.geometry, Math.PI / 4);
                child.geometry.dispose();
                child.geometry = smoothed;
                child.castShadow = true;
                child.receiveShadow = true;

                // Upgraded from MeshStandardMaterial so each portion can carry
                // a clearcoat and a sheen. They ship at the glTF default
                // roughness of 1 — fully matte, nothing catches the
                // environment, so every item returned light identically.
                const previous = Array.isArray(child.material) ? child.material : [child.material];
                const source = previous[0];
                const upgraded = new THREE.MeshPhysicalMaterial({
                  map: source instanceof THREE.MeshStandardMaterial ? source.map : null,
                  color: source instanceof THREE.MeshStandardMaterial ? source.color.clone() : new THREE.Color(0xffffff),
                  metalness: 0,
                  roughness: slot.rough,
                  clearcoat: slot.coat,
                  clearcoatRoughness: 0.32,
                  sheen: slot.sheen,
                  sheenRoughness: 0.55,
                  sheenColor: new THREE.Color(0xffffff),
                  // Normal detail only — no roughnessMap here, because it
                  // multiplies and would drag every per-item roughness above
                  // back towards a single value.
                  normalMap: detail ? detail.foodNormal : null,
                  normalScale: new THREE.Vector2(0.22, 0.22),
                  envMapIntensity: 1.0,
                });

                // The five food models share ONE 512x512 palette atlas of 254
                // flat colour swatches, and their UVs point at a swatch centre
                // — so each portion is a single uniform colour with no albedo
                // variation anywhere on it. That flatness, more than the
                // polycount, is what makes them read as toys: real food varies
                // tonally across its own surface.
                //
                // There is no texture detail to sample, so it is generated in
                // the shader from world position at two frequencies. Triplanar
                // by nature (position-based, not UV-based), so it cannot be
                // defeated by the atlas UVs.
                upgraded.onBeforeCompile = (shader) => {
                  shader.vertexShader = shader.vertexShader
                    .replace('#include <common>', '#include <common>\nvarying vec3 vGrainPos;')
                    .replace(
                      '#include <begin_vertex>',
                      '#include <begin_vertex>\n vGrainPos = (modelMatrix * vec4(position, 1.0)).xyz;'
                    );
                  shader.fragmentShader = shader.fragmentShader
                    .replace(
                      '#include <common>',
                      `#include <common>
                      varying vec3 vGrainPos;
                      float grainHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
                      float grainNoise(vec3 x){
                        vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
                        return mix(mix(mix(grainHash(i), grainHash(i + vec3(1,0,0)), f.x),
                                       mix(grainHash(i + vec3(0,1,0)), grainHash(i + vec3(1,1,0)), f.x), f.y),
                                   mix(mix(grainHash(i + vec3(0,0,1)), grainHash(i + vec3(1,0,1)), f.x),
                                       mix(grainHash(i + vec3(0,1,1)), grainHash(i + vec3(1,1,1)), f.x), f.y), f.z);
                      }`
                    )
                    .replace(
                      '#include <map_fragment>',
                      `#include <map_fragment>
                      float grain = grainNoise(vGrainPos * 22.0) * 0.6 + grainNoise(vGrainPos * 63.0) * 0.4;
                      diffuseColor.rgb *= 0.84 + 0.32 * grain;`
                    );
                };
                // All food materials share this identical injection, so they
                // are allowed to share a compiled program.
                upgraded.customProgramCacheKey = () => 'acepack-food-grain';
                child.material = upgraded;
                previous.forEach((m) => {
                  if (m !== source) m.dispose();
                });
              });

              // Scaled to a target FOOTPRINT rather than to its largest
              // dimension: sizing by the largest dimension made tall items
              // (broccoli is taller than it is wide) come out small and flat
              // ones oversized, so no two portions were on a common scale.
              const footprint = Math.max(foodSize.x, foodSize.z, 0.0001);
              const byFootprint = (interior.width * slot.footprint) / footprint;
              // ...and never taller than the pocket, so nothing pushes up
              // through the lid when it closes.
              const byHeight = (interior.height * 0.78) / Math.max(foodSize.y, 0.0001);
              const scale = Math.min(byFootprint, byHeight);

              const holder = new THREE.Group();
              holder.add(food);
              holder.scale.setScalar(scale);

              addPiece(
                holder,
                new THREE.Vector3(
                  interior.cx + slot.x * interior.halfX,
                  // Bottom ON the floor. The holder's origin is the piece's
                  // centre, so it lifts by half the scaled height — this is the
                  // line that stops the meal floating.
                  interior.floor + (foodSize.y * scale) / 2,
                  interior.cz + slot.z * interior.halfZ
                ),
                scale,
                slot.start
              );
              needsRender = true;
              markAssetComplete();
            },
            undefined,
            (err) => {
              console.error(`Food model load failed: ${slot.src}`, err);
              markAssetComplete();
            }
          );
        });

        loadedModel.add(meal);

        loadedModel.position.sub(center);
        scene.add(loadedModel);

        needsApply = true;
        needsRender = true;

        // Tightened, and the direction below is normalised. Between them the
        // container gains about a third of its on-screen size at the hero,
        // most of which lands on mobile where the canvas is smallest.
        modelRadius =
          (size.length() / 2) * (isCoarsePointer ? FIT_TIGHTNESS_COARSE : FIT_TIGHTNESS_FINE);

        // The shadow camera is orthographic and has to be fitted to the model
        // by hand — the default 5-unit frustum is smaller than this tray, so
        // the shadow would be cropped straight through the middle of the meal.
        // The light is pushed out along its own direction for the same reason.
        const shadowExtent = size.length() * 0.62;
        keyLight.position.normalize().multiplyScalar(size.length() * 1.9);
        keyLight.target.position.set(0, 0, 0);
        scene.add(keyLight.target);
        const shadowCamera = keyLight.shadow.camera;
        shadowCamera.left = -shadowExtent;
        shadowCamera.right = shadowExtent;
        shadowCamera.top = shadowExtent;
        shadowCamera.bottom = -shadowExtent;
        shadowCamera.near = size.length() * 0.2;
        shadowCamera.far = size.length() * 4.5;
        shadowCamera.updateProjectionMatrix();
        modelSize.copy(size);
        modelSizeY = size.y;
        const fitDistance = modelRadius / Math.sin((Math.PI * CAM_HERO.fov) / 360);
        // Top-down 3/4 "product shot" angle (~35° above horizon) — a low,
        // near eye-level camera made this wide flat tray read as a thin
        // edge-on sliver instead of showing its front/lid.
        camera.fov = CAM_HERO.fov;
        const heroLength = Math.hypot(CAM_HERO.elev, CAM_HERO.horiz) || 1;
        camera.position.set(
          0,
          (fitDistance * CAM_HERO.elev) / heroLength,
          (fitDistance * CAM_HERO.horiz) / heroLength
        );
        // Generous near/far: the fov lerp changes the camera's distance, so
        // planes fitted tightly to the hero distance would clip at other stops.
        camera.near = fitDistance / 100;
        camera.far = fitDistance * 100;
        controls.target.set(0, size.y * 0.05, 0);
        camera.lookAt(controls.target);
        camera.updateProjectionMatrix();
        controls.update();
        markAssetComplete();
      },
      undefined,
      (err) => {
        console.error('GLTF load failed:', err);
        if (!disposed) {
          setLoadProgress(100);
          setAssetsReady(true);
        }
      }
    );

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      needsRender = true;
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

      // OrbitControls reports whether it actually moved the camera (a drag in
      // progress, or damping still bleeding off), which is the other thing
      // that can make this frame differ from the last one.
      if (controls.update()) needsRender = true;
      // Nothing to draw once it has faded out past the last stop, and nothing
      // to draw when the frame is identical to the one already on screen —
      // both skip the GPU work entirely.
      if (needsRender && currentOpacity > 0.01) renderer.render(scene, camera);
      needsRender = false;
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
        if (isCoarsePointer) hero.cy -= naturalWidth * HERO_LIFT_COARSE;
        // Landings are trimmed by STOP_FIT_MARGIN: the tighter camera fit above
        // means the container now occupies far more of its square canvas, so a
        // landing sized to the full target image would push the box out past
        // the frame it is supposed to settle into.
        const landing = (el: HTMLElement): Stop => {
          const stop = measure(el);
          stop.fit *= STOP_FIT_MARGIN;
          return stop;
        };
        img1 = landing(target1);
        img2 = landing(target2);
        img3 = landing(target3);
        computeBoundaries();
        needsApply = true;
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
        if (prefersReducedMotion) {
          currentWrapper = { x: 0, y: 0, scale: 1 };
          wrapper.style.transform = 'translate(-50%, -50%) scale(1)';
          return;
        }
        const x = cx - frameScrollX - window.innerWidth / 2;
        const y = cy - frameScrollY - window.innerHeight / 2;
        currentWrapper = { x, y, scale };
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
        // Widen the fit and raise the aim while the lid is up. Raising the aim
        // does most of the work: centring the taller silhouette costs far less
        // distance than framing it from the closed model's centre would, so the
        // container stays large instead of shrinking away on every reveal.
        const framedRadius = modelRadius * (1 + lidOpenAmount * LID_FRAME_EXPAND);
        const framedTargetY = targetY + lidOpenAmount * modelSizeY * LID_FRAME_RISE;
        const dist = framedRadius / Math.sin((Math.PI * fov) / 360);
        if (camera.fov !== fov) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }
        // elev/horiz are a DIRECTION, so they have to be normalised before
        // scaling by the fit distance. Used raw, the hero pose (0.68, 0.92) has
        // length 1.144 and parked the camera 14% further out than the fit
        // called for — the box was that much smaller than intended, at exactly
        // the stop where it is meant to be largest.
        const poseLength = Math.hypot(elevFrac, horizFrac) || 1;
        camera.position.set(0, (dist * elevFrac) / poseLength, (dist * horizFrac) / poseLength);
        // Pointer parallax is deliberately tiny; it adds depth to a still
        // product shot without fighting the scroll-authored camera pose.
        camera.position.x += smoothedPointer.x * dist * 0.004;
        camera.position.y += smoothedPointer.y * dist * -0.003;
        camera.position.x += Math.sin(microPhase) * dist * 0.0015;
        camera.position.y += Math.cos(microPhase * 0.9) * dist * 0.0012;
        controls.target.set(0, framedTargetY, 0);
        camera.lookAt(controls.target);
      };

      const updateCopy = (progress: number) => {
        const copyRoot = copyRef.current;
        if (!copyRoot) return;
        const index = actAt(progress);
        copyRoot.querySelectorAll<HTMLElement>('[data-act-copy]').forEach((item, itemIndex) => {
          const active = itemIndex === index;
          item.style.opacity = active ? '1' : '0';
          item.style.transform = active ? 'translateY(0)' : 'translateY(10px)';
          item.setAttribute('aria-hidden', active ? 'false' : 'true');
        });
      };

      const updateRail = (progress: number) => {
        const rail = railRef.current;
        if (!rail) return;
        const index = actAt(progress);
        rail.querySelectorAll<HTMLButtonElement>('[data-act-rail]').forEach((button, buttonIndex) => {
          const active = buttonIndex === index;
          button.style.backgroundColor = active ? '#b89858' : 'rgba(26, 29, 32, 0.18)';
          button.style.transform = active ? 'scale(1.35)' : 'scale(1)';
          button.setAttribute('aria-current', active ? 'step' : 'false');
        });
      };

      const updateAnnotations = (progress: number) => {
        const root = annotationRef.current;
        const activeModel = model;
        if (!root || !activeModel || !modelReady) return;
        const engineeringT = actLocalProgress(progress, 2);
        const fade = actAt(progress) === 2
          ? Math.sin(Math.PI * engineeringT)
          : actAt(progress) === 3
            ? 1 - actLocalProgress(progress, 3)
            : 0;
        root.style.opacity = String(Math.max(fade, 0));
        if (fade <= 0.01) return;

        const anchors: Record<string, THREE.Vector3> = {
          rim: new THREE.Vector3(0, modelSize.y * 0.25, modelSize.z * 0.52),
          label: new THREE.Vector3(modelSize.x * 0.18, modelSize.y * 0.05, modelSize.z * 0.52),
          material: new THREE.Vector3(-modelSize.x * 0.22, -modelSize.y * 0.2, modelSize.z * 0.42),
        };
        const offsets: Record<string, [number, number]> = {
          rim: [54, -34],
          label: [58, 6],
          material: [54, 42],
        };
        const width = container.clientWidth || naturalWidth;
        const height = container.clientHeight || naturalWidth;
        const left = window.innerWidth / 2 + currentWrapper.x - (naturalWidth * currentWrapper.scale) / 2;
        const top = window.innerHeight / 2 + currentWrapper.y - (naturalWidth * currentWrapper.scale) / 2;
        Object.entries(anchors).forEach(([key, anchor]) => {
          const point = activeModel.localToWorld(anchor.clone()).project(camera);
          const x = left + (point.x * 0.5 + 0.5) * width * currentWrapper.scale + offsets[key][0];
          const y = top + (-point.y * 0.5 + 0.5) * height * currentWrapper.scale + offsets[key][1];
          const item = root.querySelector<HTMLElement>(`[data-annotation="${key}"]`);
          if (!item) return;
          item.style.left = `${x}px`;
          item.style.top = `${y}px`;
        });
      };

      const updateNarrative = (progress: number) => {
        const index = actAt(progress);
        const local = actLocalProgress(progress, index);
        const next = ACTS[Math.min(index + 1, ACTS.length - 1)];
        const currentAct = ACTS[index];
        const mealRange = ACTS[1].range;
        const engineeringRange = ACTS[2].range;
        const brandingRange = ACTS[3].range;
        renderer.toneMappingExposure = lerp(
          currentAct.camera.exposure,
          next.camera.exposure,
          easeInOutCubic(local)
        );
        rimLight.intensity = lerp(0.3, index >= 2 ? 0.95 : 0.35, easeInOutCubic(local));

        // Out and back INSIDE the act. The previous form reassembled over the
        // window between engineeringRange[1] and brandingRange[0] — but those
        // are the same number (0.42), so the divisor fell back to 0.001 and the
        // value dropped from 1 to 0 in a single frame: the exploded view
        // collapsed with a visible pop. A triangular envelope eased at both
        // ends keeps it continuous, so nothing snaps at the act boundary.
        const engineeringRaw = clamp01(actLocalProgress(progress, 2));
        const engineeringT =
          engineeringRaw < ENGINEERING_PEAK
            ? easeInOutCubic(engineeringRaw / ENGINEERING_PEAK)
            : 1 - easeInOutCubic((engineeringRaw - ENGINEERING_PEAK) / (1 - ENGINEERING_PEAK));
        if (lidPivot) {
          lidPivot.position.lerpVectors(
            lidBasePosition,
            lidBasePosition.clone().add(new THREE.Vector3(0, modelSize.y * 0.62, -modelSize.z * 0.14)),
            engineeringT
          );
          // One writer, one schedule — the three separate branches that used to
          // set this each owned a different stretch of the page and disagreed
          // at every boundary.
          lidPivot.rotation.x = lidOpenAmount * LID_OPEN_ANGLE;
        }
        if (bodyMesh) {
          bodyMesh.position.lerpVectors(
            bodyBasePosition,
            bodyBasePosition.clone().add(new THREE.Vector3(-modelSize.x * 0.08, -modelSize.y * 0.08, 0)),
            engineeringT
          );
        }
        if (labelSurface && bodyMesh) {
          // Glued to the shell it is printed on. This used to fly the label out
          // sideways as its own exploded layer, which does not read as an
          // exploded diagram at all — it reads as the branding peeling off and
          // falling away from the box, which is the opposite of the claim the
          // section is making about in-mould labelling. It now tracks whatever
          // the body itself is doing, including the exploded offset.
          labelSurface.position.subVectors(bodyMesh.position, bodyBasePosition);
        }
        if (labelLayers.length) {
          const brandProgress = clamp01(
            (progress - brandingRange[0]) / Math.max(brandingRange[1] - brandingRange[0], 0.001)
          );
          const brandPosition = brandProgress * 2;
          labelLayers.forEach((layer, layerIndex) => {
            const material = layer.material as THREE.MeshBasicMaterial;
            const distance = Math.abs(layerIndex - brandPosition);
            material.opacity = Math.max(0, 0.68 - distance * 0.68);
          });
        }
        if (contactShadow) {
          const material = contactShadow.material as THREE.MeshBasicMaterial;
          material.opacity = lerp(0.42, 0.16, engineeringT);
          contactShadow.scale.set(1 + engineeringT * 0.24, 1 + engineeringT * 0.12, 1);
        }
        const mealT = clamp01((progress - mealRange[0]) / Math.max(mealRange[1] - mealRange[0], 0.001));
        // Gated on mealT, not on `progress < mealRange[0]`. That test is false
        // when both sides are 0, so at the very top of the page the steam sat
        // at full 0.72 opacity — three pale quads hanging over a sealed
        // container. Multiplying by mealT ramps it in with the act it belongs
        // to and leaves it at zero before then.
        const steamOpacity = mealT * (1 - clamp01((progress - mealRange[1]) / 0.22)) * 0.72;
        steamSprites.forEach((steam, steamIndex) => {
          const material = steam.material as THREE.SpriteMaterial;
          material.opacity = steamOpacity * (0.72 + Math.sin(microPhase * 1.4 + steamIndex) * 0.12);
          const basePosition = steamBasePositions[steamIndex];
          if (basePosition) {
            steam.position.x = basePosition.x + Math.sin(microPhase * 0.7 + steamIndex) * modelSize.x * 0.012 * mealT;
            steam.position.y = basePosition.y + Math.sin(microPhase * 0.9 + steamIndex) * modelSize.y * 0.018 * mealT;
          }
        });
        if (model) {
          const brandingTurn = progress >= brandingRange[0]
            ? clamp01((progress - brandingRange[0]) / Math.max(brandingRange[1] - brandingRange[0], 0.001))
            : 0;
          // Eased: a linear ramp gives the full turn constant angular velocity,
          // so it started and stopped instantly at the act edges.
          model.rotation.y = scrollModelRotationY + easeInOutCubic(brandingTurn) * Math.PI * 2;
        }
        updateCopy(progress);
        updateRail(progress);
        updateAnnotations(progress);
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
          scrollModelRotationY =
            lerp(fromRot, toRot, easeOutCubic(turn)) + Math.sin(Math.PI * move) * ROTATION_SWING;
          model.rotation.y = scrollModelRotationY;
          // A small pitch/roll combination makes the package feel carried
          // through the page instead of sliding on a single axis. Both return
          // to zero at each landing, so the stop remains clean and readable.
          model.rotation.x = Math.sin(Math.PI * move) * ROTATION_TILT * 0.7;
          model.rotation.z = Math.sin(Math.PI * move) * ROTATION_TILT;
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

      const applyFood = (foodT: number) => {
        foodPieces.forEach((piece) => {
          const localT = easeOutCubic(
            clamp01((foodT - piece.start * 0.36) / (1 - piece.start * 0.36))
          );
          // entry -> rest: the portion descends into its slot and stops on
          // the tray floor. This used to run rest -> release with `release`
          // outside the container, which is what left the meal in mid-air.
          piece.mesh.position.lerpVectors(piece.entry, piece.rest, localT);
          piece.mesh.rotation.set(
            lerp(piece.entryRotation.x, piece.restRotation.x, localT),
            lerp(piece.entryRotation.y, piece.restRotation.y, localT),
            lerp(piece.entryRotation.z, piece.restRotation.z, localT)
          );
          // A little scale-in, so a portion reads as being placed rather than
          // popping into existence.
          piece.mesh.scale.setScalar(piece.restScale * lerp(0.86, 1, localT));
          piece.mesh.visible = true;
        });
      };

      // The lid's whole life in one function, so nothing can disagree about
      // where it is. It opens across the hero beat, holds open while the meal
      // is on show, then closes across the engineering act — where it also
      // lifts clear of the body — and stays sealed for the rest of the journey.
      // It used to be left wide open from the reveal all the way to the end of
      // the page, so the pack never read as closing back up.
      const lidOpennessAt = (progress: number): number => {
        if (progress <= pHeroEnd) {
          return easeInOutCubic(clamp01(progress / span(0, pHeroEnd)));
        }
        if (progress < ACTS[2].range[0]) return 1;
        // Monotonic, unlike the separation envelope below: the lid comes down
        // and stays down.
        return 1 - easeInOutCubic(actLocalProgress(progress, 2));
      };

      // The resting stop is a DOCUMENT position, so while the box holds at the
      // hero it scrolls upward with the page — by the time the hold ends it has
      // walked most of the way off the top of the screen, taking the opening
      // lid with it. That is what was cutting the model off on desktop, and
      // lengthening the hero hold to smooth the reveal made it worse.
      //
      // Clamped rather than pinned: max() of two continuous values, so the box
      // sits where the layout puts it until the viewport catches up with it,
      // then rides just below the header. No branch, so nothing snaps at the
      // moment the clamp engages.
      const restingHero = (): Stop => {
        const floorCy = frameScrollY + HEADER_CLEARANCE + naturalWidth * 0.5;
        return { cx: hero.cx, cy: Math.max(hero.cy, floorCy), fit: hero.fit };
      };

      const setReveal = (reveal: number) => {
        // easeInOutCubic, not easeOutCubic: an ease-out is at maximum velocity
        // on its first frame, so the lid cracked open with a jolt. In-out
        // leaves it with zero velocity at both ends — it eases off its seal and
        // settles into the open position.
        const lidT = easeInOutCubic(clamp01(reveal));
        // Rotation is applied from lidOpenAmount in updateNarrative, which runs
        // at the end of every applyProgress — setReveal only drives the meal.
        // Hold the meal in the tray for the first beat of the lid motion,
        // then release each piece with its own staggered forward arc.
        applyFood(clamp01((lidT - FOOD_REVEAL_START) / (1 - FOOD_REVEAL_START)));
      };

      const applyProgress = (p: number) => {
        const progress = prefersReducedMotion ? 0 : p;
        // Resolved before anything reads it: setCamera below needs this frame's
        // value, not the previous frame's, or the framing trails the lid by a
        // frame on every reveal.
        lidOpenAmount = lidOpennessAt(progress);
        if (progress <= pHeroEnd) {
          const resting = restingHero();
          setWrapper(resting.cx, resting.cy, 1);
          // The first scroll is an intentional product moment: keep the pack
          // over the hero while it opens and the meal spills out. The next
          // scroll phase only begins once this reveal is complete.
          const intro = clamp01(progress / span(0, pHeroEnd));
          setReveal(intro);
          if (model) {
            scrollModelRotationY = ROTATION_HERO + Math.sin(Math.PI * intro) * ROTATION_SWING * 0.6;
            model.rotation.y = scrollModelRotationY;
            model.rotation.x = Math.sin(Math.PI * intro) * ROTATION_TILT * 0.45;
            model.rotation.z = Math.sin(Math.PI * intro) * ROTATION_TILT * 0.7;
          }
          setCamera(CAM_HERO.elev, CAM_HERO.horiz, modelSizeY * 0.05, CAM_HERO.fov);
        } else if (progress <= pImg1) {
          setReveal(1);
          // Same clamped origin the rest phase ended on, so leg one starts
          // exactly where the box was left rather than jumping back down to the
          // section's centre.
          flyBetween(restingHero(), img1, ROTATION_HERO, ROTATION_IMAGE_1, CAM_HERO, CAM_IMAGE_1,
            (progress - pHeroEnd) / span(pHeroEnd, pImg1));
        } else if (progress <= pImg2) {
          setReveal(1);
          flyBetween(img1, img2, ROTATION_IMAGE_1, ROTATION_IMAGE_2, CAM_IMAGE_1, CAM_IMAGE_2,
            (progress - pImg1) / span(pImg1, pImg2));
        } else {
          const raw = clamp01((progress - pImg2) / span(pImg2, 1));
          setReveal(1);
          flyBetween(img2, img3, ROTATION_IMAGE_2, ROTATION_IMAGE_3, CAM_IMAGE_2, CAM_IMAGE_3, raw);

          // Once the food reveal is complete, the camera gradually rises into
          // a product-shot angle while the open package continues its journey.
          const move = clamp01(raw / LEG_MOTION);
          setCamera(
            lerp(CAM_IMAGE_2.elev, CAM_IMAGE_3.elev, easeInOutCubic(move)),
            lerp(CAM_IMAGE_2.horiz, CAM_IMAGE_3.horiz, easeInOutCubic(move)),
            lerp(modelSizeY * 0.05, modelSizeY * 0.35, easeInOutCubic(move)),
            lerp(CAM_IMAGE_2.fov, CAM_IMAGE_3.fov, easeInOutCubic(move))
          );
        }
        updateNarrative(progress);
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
          progressVelocity = 0;
          readScroll();
          applyProgress(smoothedProgress);
          needsApply = true;
          needsRender = true;
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

      const rail = railRef.current;
      const onRailClick = (event: MouseEvent) => {
        const button = (event.target as Element).closest<HTMLButtonElement>('[data-act-rail]');
        if (!button || !mainTrigger) return;
        const actIndex = Number(button.dataset.actIndex);
        const act = ACTS[actIndex];
        if (!act) return;
        const destination = mainTrigger.start + (act.range[0] + (act.range[1] - act.range[0]) * 0.35) *
          (mainTrigger.end - mainTrigger.start);
        if (window.__lenis) {
          window.__lenis.scrollTo(destination, { duration: 0.9 });
        } else {
          window.scrollTo({ top: destination, behavior: 'smooth' });
        }
      };
      rail?.addEventListener('click', onRailClick);
      cleanupInteraction = () => rail?.removeEventListener('click', onRailClick);

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
        const prevScrollX = frameScrollX;
        const prevScrollY = frameScrollY;
        readScroll();
        // The wrapper is position:fixed but its stops are document-space, so a
        // scroll always means a new transform even when the journey progress
        // itself is clamped (before the first stop, after the last).
        const scrollMoved = frameScrollX !== prevScrollX || frameScrollY !== prevScrollY;

        if (!isCoarsePointer && !prefersReducedMotion) {
          const pointerK = 1 - Math.exp(-dt * 5);
          const pointerMoved =
            Math.abs(targetPointer.x - smoothedPointer.x) > 0.0005 ||
            Math.abs(targetPointer.y - smoothedPointer.y) > 0.0005;
          smoothedPointer.x += (targetPointer.x - smoothedPointer.x) * pointerK;
          smoothedPointer.y += (targetPointer.y - smoothedPointer.y) * pointerK;
          if (pointerMoved) needsApply = true;
        }

        if (modelReady && !prefersReducedMotion && currentOpacity > 0.01 && smoothedProgress < 0.92) {
          microPhase += dt * 0.8;
          needsApply = true;
        }

        qualitySampleFrames += 1;
        qualitySampleTime += dt;
        if (modelReady && !qualityReduced && qualitySampleTime > 1.2) {
          const averageFrame = qualitySampleTime / Math.max(qualitySampleFrames, 1);
          if (averageFrame > 0.022) {
            qualityReduced = true;
            renderer.setPixelRatio(1);
            if (contactShadow) contactShadow.visible = false;
            needsRender = true;
          }
          qualitySampleFrames = 0;
          qualitySampleTime = 0;
        }

        // Faded out past the last stop: no transform worth writing and nothing
        // to draw for the whole rest of the page.
        if (currentOpacity <= 0.01 && targetOpacity <= 0.01) {
          if (currentOpacity !== 0) {
            currentOpacity = 0;
            wrapper.style.opacity = '0';
          }
          return;
        }

        // Frame-rate independent, so the glide is the same at 60, 90 or 120Hz
        // where a fixed per-frame factor would be faster on high-refresh
        // screens. The journey runs on a critically damped spring; the fade
        // keeps the cheaper exponential filter, since a fade has no direction
        // to reverse.
        const k = 1 - Math.exp(-dt * PROGRESS_DAMPING);
        const progressGap = Math.abs(targetProgress - smoothedProgress);
        const opacityGap = Math.abs(targetOpacity - currentOpacity);
        [smoothedProgress, progressVelocity] = smoothDamp(
          smoothedProgress,
          targetProgress,
          progressVelocity,
          PROGRESS_SMOOTH_TIME,
          dt
        );
        // Settle only when the spring has run out of BOTH distance and speed —
        // a spring passes through zero distance at full speed, and snapping
        // there would clip the tail off every move.
        if (progressGap < 0.00002 && Math.abs(progressVelocity) < 0.0002) {
          smoothedProgress = targetProgress;
          progressVelocity = 0;
        }
        currentOpacity += (targetOpacity - currentOpacity) * k;
        if (opacityGap < 0.001) currentOpacity = targetOpacity;

        // Nothing moved: the page is still, the box has caught up and the fade
        // has settled. Skip the style writes and let the tick skip the draw,
        // instead of re-rendering an identical frame 60+ times a second while
        // the user reads the page.
        if (
          !scrollMoved &&
          !needsApply &&
          progressGap < 0.00002 &&
          Math.abs(progressVelocity) < 0.0002 &&
          opacityGap < 0.001
        ) {
          return;
        }
        needsApply = false;

        applyProgress(smoothedProgress);
        wrapper.style.opacity = modelReady ? String(currentOpacity) : '0';
        needsRender = true;
      };
    });

    return () => {
      disposed = true;
      driveFrame = null;
      cleanupLayoutWatch?.();
      cleanupInteraction?.();
      window.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      gsap.ticker.remove(tick);
      ctx.revert();
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      environmentTarget.dispose();
      generatedTextures.forEach((texture) => texture.dispose());
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((mat) => mat.dispose());
        }
        if (obj instanceof THREE.Sprite) obj.material.dispose();
      });
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] sm:h-[calc(100vh-85px)] sm:max-h-[920px] sm:min-h-[520px] bg-[#FDFCF9] border-b border-[#E6DBC6]"
    >
      {/* Gold-wave backdrop. A plain background layer rather than an <img>:
          nothing needs to read its intrinsic size, and the near-white centre
          is what makes the dark container read clearly on top of it. The
          cream base colour behind it covers any letterboxing on tall/narrow
          viewports, where a 2.4:1 image cropped to cover can't reach. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-gold-wave-bg.webp')" }}
      />
      <div
        className={`absolute inset-0 z-50 flex items-end justify-center bg-[#FDFCF9]/92 px-5 pb-10 transition-opacity duration-700 sm:items-center sm:pb-0 ${
          assetsReady ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-hidden={assetsReady}
      >
        <div className="w-full max-w-[340px] text-[#1A1D20]">
          <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6E6250]">
            <span>Loading product film</span>
            <span>{loadProgress}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[#E6DBC6]">
            <div
              className="h-full bg-[#B89858] transition-[width] duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      </div>
      <div
        ref={copyRef}
        className="pointer-events-none absolute bottom-8 left-5 z-20 w-[90%] max-w-[420px] sm:bottom-12 sm:left-10"
      >
        {ACTS.map((act, index) => (
          <div
            key={act.id}
            data-act-copy
            aria-hidden={index !== 0}
            className="absolute bottom-0 left-0 w-full transition-[opacity,transform] duration-500 ease-out"
            style={{ opacity: index === 0 ? 1 : 0, transform: index === 0 ? 'translateY(0)' : 'translateY(10px)' }}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A6336]">
              {act.copy.eyebrow}
            </p>
            <h1 className="max-w-[390px] text-[clamp(2rem,4vw,3.9rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-[#1A1D20]">
              {act.copy.title}
            </h1>
            <p className="mt-4 max-w-[330px] text-sm leading-6 text-[#5F5A52] sm:text-base">
              {act.copy.detail}
            </p>
          </div>
        ))}
      </div>
      <div
        ref={annotationRef}
        className="pointer-events-none fixed inset-0 z-40 hidden opacity-0 transition-opacity duration-300 md:block"
        aria-label="Product construction annotations"
      >
        <div data-annotation="rim" className="absolute w-40 text-[10px] uppercase tracking-[0.16em] text-[#1A1D20]">
          <span className="mb-2 block h-px w-12 bg-[#B89858]" />
          <span className="font-semibold">Snap-fit rim</span>
          <span className="mt-1 block normal-case tracking-normal text-[#6E6250]">A clean seal, every service.</span>
        </div>
        <div data-annotation="label" className="absolute w-44 text-[10px] uppercase tracking-[0.16em] text-[#1A1D20]">
          <span className="mb-2 block h-px w-12 bg-[#B89858]" />
          <span className="font-semibold">In-mould label</span>
          <span className="mt-1 block normal-case tracking-normal text-[#6E6250]">Brand detail stays crisp.</span>
        </div>
        <div data-annotation="material" className="absolute w-44 text-[10px] uppercase tracking-[0.16em] text-[#1A1D20]">
          <span className="mb-2 block h-px w-12 bg-[#B89858]" />
          <span className="font-semibold">PP 05 material</span>
          <span className="mt-1 block normal-case tracking-normal text-[#6E6250]">Made for food contact.</span>
        </div>
      </div>
      <nav
        ref={railRef}
        aria-label="Product story acts"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
      >
        {ACTS.map((act, index) => (
          <button
            key={act.id}
            type="button"
            data-act-rail
            data-act-index={index}
            aria-label={`Go to ${act.label}`}
            aria-current={index === 0 ? 'step' : 'false'}
            className="h-2 w-2 rounded-full bg-[rgba(26,29,32,0.18)] p-0 transition-transform duration-300"
          />
        ))}
      </nav>
      {/* Sized ~12% larger than before. No translate utilities here: the
          effect writes one complete transform string (offset + centring +
          scale), and a class-declared translate would be a second, competing
          source for the same property. The inline transform below is only the
          pre-JS resting state so it is centred on first paint.
          The vw figure only bites on small screens (max-w caps desktop at
          628): 60vw was 234px on a 390px phone, clamped up to the 260px
          minimum, which is why the container looked undersized there. */}
      <div
        ref={wrapperRef}
        className="fixed top-1/2 left-1/2 w-[82vw] h-[82vw] min-w-[300px] min-h-[300px] max-w-[628px] max-h-[628px] z-30"
        style={{ willChange: 'transform, opacity', transform: 'translate(-50%, -50%)' }}
      >
        {/* Grounding shadow — painted before the canvas so it shows through
            the canvas's transparent margin around the rendered box, and
            inherits the same GSAP transform (position/scale/opacity) since
            it's a sibling inside the same moved/scaled wrapper. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 bottom-[16%] -translate-x-1/2 w-[68%] h-[10%] rounded-full blur-md bg-[#1A1D20]/18 pointer-events-none"
        />
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </section>
  );
};
