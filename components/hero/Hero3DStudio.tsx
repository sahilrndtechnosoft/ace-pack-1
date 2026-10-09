'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Rotate3D, Eye, EyeOff, Sparkles, Check, RefreshCw, ShieldCheck, Flame, Layers, UtensilsCrossed, Package } from 'lucide-react';

interface ContainerFormat {
  id: string;
  name: string;
  category: string;
  file: string;
  capacity: string;
  useCase: string;
  lidType: 'lift' | 'hinge';
  specs: {
    wall: string;
    temp: string;
    cert: string;
    pack: string;
  };
}

const CONTAINER_FORMATS: ContainerFormat[] = [
  {
    id: 'takeaway',
    name: 'Executive Meal Box',
    category: 'RE Series Bento',
    file: '/models/acepack/takeaway.glb',
    capacity: '750ml / 1000ml',
    useCase: 'QSR Meal Combos & Cloud Kitchens',
    lidType: 'lift',
    specs: {
      wall: '0.68mm precision wall',
      temp: '-20°C to +120°C',
      cert: 'US FDA 21 CFR 177.1520',
      pack: '500 Pcs / Master Box',
    },
  },
  {
    id: 'shallow-bowl',
    name: 'Round Bowl with Lid',
    category: 'RO Series Bowl',
    file: '/models/acepack/shallow-bowl.glb',
    capacity: '500ml / 750ml',
    useCase: 'Salads, Curries, Biryanis & Gravies',
    lidType: 'lift',
    specs: {
      wall: '0.65mm reinforced rim',
      temp: '-20°C to +120°C',
      cert: 'ISO 9001:2015 Cleanroom',
      pack: '600 Pcs / Master Box',
    },
  },
  {
    id: 'round-tub',
    name: 'Deep Soup & Deli Tub',
    category: 'Deli Series',
    file: '/models/acepack/round-tub.glb',
    capacity: '750ml / 1200ml',
    useCase: 'Hot Soups, Desserts & Dairy Packaging',
    lidType: 'lift',
    specs: {
      wall: '0.72mm high-impact wall',
      temp: '-20°C to +120°C',
      cert: '100% Virgin PP 05',
      pack: '400 Pcs / Master Box',
    },
  },
  {
    id: 'hinge-cup',
    name: 'Attached Hinge Cup',
    category: 'Hinge Series',
    file: '/models/acepack/hinge-cup.glb',
    capacity: '25ml / 50ml / 100ml',
    useCase: 'Dips, Chutneys, Dressings & Sauces',
    lidType: 'hinge',
    specs: {
      wall: '0.50mm flexible hinge',
      temp: '-20°C to +120°C',
      cert: 'Zero-Spill Motorcycle Tested',
      pack: '2,000 Pcs / Master Box',
    },
  },
  {
    id: 'clamshell',
    name: 'Hinged Clamshell Pack',
    category: 'Bento Clamshell',
    file: '/models/acepack/clamshell.glb',
    capacity: '850ml Compartment',
    useCase: 'Burgers, Wraps, Rolls & Hot Snacks',
    lidType: 'hinge',
    specs: {
      wall: '0.62mm structural ribs',
      temp: '-20°C to +120°C',
      cert: 'BPA & Heavy-Metal Free',
      pack: '500 Pcs / Master Box',
    },
  },
];

interface FinishColor {
  id: string;
  name: string;
  hex: string;
  metallic: boolean;
  roughness: number;
  metalness: number;
  transparent?: boolean;
  opacity?: number;
}

const FINISHES: FinishColor[] = [
  { id: 'gold', name: 'Ace Gold', hex: '#b99750', metallic: true, roughness: 0.35, metalness: 0.28 },
  { id: 'black', name: 'Jet Black', hex: '#161719', metallic: false, roughness: 0.28, metalness: 0.08 },
  { id: 'translucent', name: 'Virgin PP Natural', hex: '#e3e8e5', metallic: false, roughness: 0.42, metalness: 0.02, transparent: true, opacity: 0.88 },
  { id: 'white', name: 'Clean White', hex: '#ffffff', metallic: false, roughness: 0.3, metalness: 0.04 },
  { id: 'amber', name: 'Kraft Amber', hex: '#a67b48', metallic: false, roughness: 0.38, metalness: 0.05 },
];

const FOOD_ITEMS = [
  { src: '/models/food/salad.glb', x: 0.02, z: -0.42, targetY: 0.18, scale: 0.72 },
  { src: '/models/food/broccoli.glb', x: -0.42, z: 0.36, targetY: 0.16, scale: 0.68 },
  { src: '/models/food/maki-salmon.glb', x: 0.42, z: -0.38, targetY: 0.15, scale: 0.65 },
  { src: '/models/food/rice-ball.glb', x: 0.48, z: 0.18, targetY: 0.15, scale: 0.65 },
  { src: '/models/food/tomato-slice.glb', x: 0.16, z: 0.44, targetY: 0.16, scale: 0.7 },
];

export const Hero3DStudio: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<ContainerFormat>(CONTAINER_FORMATS[0]);
  const [selectedFinish, setSelectedFinish] = useState<FinishColor>(FINISHES[0]);
  const [openLid, setOpenLid] = useState(true);
  const [hasFood, setHasFood] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d' | 'specs'>('3d');

  // Internal Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const foodGroupRef = useRef<THREE.Group | null>(null);
  const lidPivotRef = useRef<THREE.Object3D | null>(null);
  const bodyMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const initialLidPosRef = useRef<number>(0);
  const initialLidRotRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const modelHeightRef = useRef<number>(1);
  const foodLoadedRef = useRef<boolean>(false);

  // Apply finish color to current bodies
  const applyFinish = useCallback((finish: FinishColor) => {
    const col = new THREE.Color(finish.hex);
    bodyMaterialsRef.current.forEach((mat) => {
      mat.color.copy(col);
      mat.roughness = finish.roughness;
      mat.metalness = finish.metalness;
      if (finish.transparent) {
        mat.transparent = true;
        mat.opacity = finish.opacity ?? 0.88;
      } else {
        mat.transparent = false;
        mat.opacity = 1;
      }
      mat.needsUpdate = true;
    });
  }, []);

  // Load food into container cavity
  const loadFoodModels = useCallback((parentGroup: THREE.Group) => {
    const loader = new GLTFLoader();
    const foodGroup = new THREE.Group();
    foodGroupRef.current = foodGroup;
    foodLoadedRef.current = false;

    let loadedCount = 0;
    FOOD_ITEMS.forEach((item) => {
      loader.load(
        item.src,
        (gltf) => {
          const itemMesh = gltf.scene;
          itemMesh.scale.setScalar(item.scale);
          itemMesh.position.set(item.x, 2.5, item.z); // starts high in the air
          itemMesh.userData = {
            targetX: item.x,
            targetZ: item.z,
            targetY: item.targetY,
            currentY: 2.5,
          };
          itemMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          foodGroup.add(itemMesh);
          loadedCount++;
          if (loadedCount === FOOD_ITEMS.length) {
            foodLoadedRef.current = true;
          }
        },
        undefined,
        (err) => console.warn('Could not load food item:', err)
      );
    });

    parentGroup.add(foodGroup);
  }, []);

  // Load a 3D model safely
  const loadModel = useCallback((format: ContainerFormat, currentFinish: FinishColor) => {
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;
    setLoading(true);
    setError(false);

    // Dispose old model
    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      modelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      modelGroupRef.current = null;
    }
    bodyMaterialsRef.current = [];
    lidPivotRef.current = null;
    foodGroupRef.current = null;

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      format.file,
      (gltf) => {
        const root = gltf.scene;
        const group = new THREE.Group();
        group.add(root);

        // Find LidPivot
        const lidPivot = root.getObjectByName('LidPivot');
        if (lidPivot) {
          lidPivotRef.current = lidPivot;
          initialLidPosRef.current = lidPivot.position.y;
          initialLidRotRef.current = lidPivot.rotation.x;
        }

        // Measure bounding box to compute scale
        const box = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        modelHeightRef.current = Math.max(size.y, 0.4);

        // Center on base
        root.position.x = -center.x;
        root.position.z = -center.z;
        root.position.y = -box.min.y;

        // Auto-scale to normalized dimension
        const maxDim = Math.max(size.x, size.z);
        const normScale = 2.45 / (maxDim || 1);
        group.scale.setScalar(normScale);

        // Collect body materials and customize lid materials
        const bodies: THREE.MeshStandardMaterial[] = [];
        root.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
            const originalMat = obj.material as THREE.MeshPhysicalMaterial;

            // Check if this is the lid mesh
            const isLid = obj.name.toLowerCase().includes('lid') ||
                          Boolean(lidPivot && (obj === lidPivot || lidPivot.children.includes(obj)));

            if (isLid && originalMat && (originalMat.transmission > 0 || originalMat.transparent)) {
              // High clarity transparent lid
              const lidMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#dce6e5'),
                roughness: 0.12,
                transmission: 0.85,
                thickness: 0.35,
                ior: 1.49,
                transparent: true,
                opacity: 0.52,
                envMapIntensity: 1.5,
              });
              obj.material = lidMat;
            } else {
              // Container body material
              const bodyMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(currentFinish.hex),
                roughness: currentFinish.roughness,
                metalness: currentFinish.metalness,
                envMapIntensity: 1.2,
              });
              obj.material = bodyMat;
              bodies.push(bodyMat);
            }
          }
        });

        bodyMaterialsRef.current = bodies;
        applyFinish(currentFinish);

        // Load food items into container if applicable
        loadFoodModels(root);

        sceneRef.current?.add(group);
        modelGroupRef.current = group;

        // Adjust camera target
        if (controlsRef.current) {
          controlsRef.current.target.set(0, (size.y * normScale) * 0.42, 0);
          controlsRef.current.update();
        }

        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn('Could not load 3D container model:', err);
        setError(true);
        setLoading(false);
      }
    );
  }, [applyFinish, loadFoodModels]);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(0, 1.85, 4.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Light Theme Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7e6, 3.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f2f4, 1.8);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.2);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Subtle reflective ground circle shadow
    const shadowGeo = new THREE.PlaneGeometry(3.8, 3.8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.58;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;
    controlsRef.current = controls;

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', () => {
      renderer.domElement.style.cursor = 'grabbing';
    });
    renderer.domElement.addEventListener('pointerup', () => {
      renderer.domElement.style.cursor = 'grab';
    });

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Initial model load
    loadModel(selectedFormat, selectedFinish);

    // Animation Loop
    let currentLidY = 0;
    let currentLidRotX = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      controls.update();

      // Smooth lid animation
      const lid = lidPivotRef.current;
      if (lid) {
        if (selectedFormat.lidType === 'lift') {
          const targetY = openLid
            ? initialLidPosRef.current + modelHeightRef.current * 0.46
            : initialLidPosRef.current;
          currentLidY = THREE.MathUtils.lerp(currentLidY, targetY, 0.08);
          lid.position.y = currentLidY;
        } else {
          const targetRotX = openLid ? -1.65 : initialLidRotRef.current;
          currentLidRotX = THREE.MathUtils.lerp(currentLidRotX, targetRotX, 0.08);
          lid.rotation.x = currentLidRotX;
        }
      }

      // Smooth food falling from the top into the container animation
      const foodGroup = foodGroupRef.current;
      if (foodGroup) {
        foodGroup.children.forEach((child) => {
          const userData = child.userData;
          if (userData) {
            const destY = hasFood ? userData.targetY : 2.5;
            userData.currentY = THREE.MathUtils.lerp(userData.currentY, destY, 0.07);
            child.position.y = userData.currentY;
            child.visible = userData.currentY < 2.3;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Handle format change
  const handleFormatChange = (format: ContainerFormat) => {
    setSelectedFormat(format);
    loadModel(format, selectedFinish);
  };

  // Handle finish change
  const handleFinishChange = (finish: FinishColor) => {
    setSelectedFinish(finish);
    applyFinish(finish);
  };

  // Toggle auto-rotate
  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !autoRotate;
    }
    setAutoRotate(!autoRotate);
  };

  // Reset view
  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 1.85, 4.4);
      controlsRef.current.reset();
      controlsRef.current.autoRotate = autoRotate;
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#E6DBC6] bg-gradient-to-b from-[#ffffff] via-[#fcfdfa] to-[#f5f7f2] shadow-xl text-[var(--ace-ink)]">
      {/* Light Theme Header Bar */}
      <div className="px-5 py-3.5 border-b border-[#E6DBC6]/80 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#b99750] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#b99750]">
            3D Packaging Studio
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF8F4] border border-[#E6DBC6] text-gray-700">
            {selectedFormat.category}
          </span>
        </div>

        {/* View / Specs Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeTab === '3d'
                ? 'bg-[#b99750] text-white shadow-xs'
                : 'text-gray-600 hover:text-[var(--ace-ink)]'
            }`}
          >
            3D View
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'specs'
                ? 'bg-[#b99750] text-white shadow-xs'
                : 'text-gray-600 hover:text-[var(--ace-ink)]'
            }`}
          >
            Specifications
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px]">
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full" style={{ touchAction: 'none' }} />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs z-20">
            <div className="w-10 h-10 border-3 border-[#b99750]/30 border-t-[#b99750] rounded-full animate-spin mb-3" />
            <span className="text-xs font-semibold text-gray-700">Rendering container model...</span>
          </div>
        )}

        {/* Fallback Error Message */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 p-6 text-center z-20">
            <p className="text-sm text-gray-700 mb-3">Model preview unavailable in this environment.</p>
            <button
              onClick={() => loadModel(selectedFormat, selectedFinish)}
              className="px-4 py-2 rounded-full bg-[#b99750] text-white text-xs font-bold uppercase"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Floating Hotspots (3D Mode) */}
        {activeTab === '3d' && !loading && (
          <>
            {/* Hotspot 1: Zero-Leak Rim */}
            <div className="absolute top-5 left-5 pointer-events-none hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6DBC6] shadow-md text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b99750] shrink-0" />
              <span className="font-semibold text-gray-700">Zero-Leak Hermetic Snap Rim</span>
            </div>

            {/* Hotspot 2: Thermal Range */}
            <div className="absolute bottom-24 right-5 pointer-events-none hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6DBC6] shadow-md text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#b99750] shrink-0" />
              <span className="font-semibold text-gray-700">-20°C Deep Freeze to +120°C Microwave</span>
            </div>

            {/* Hotspot 3: 100% Virgin PP 05 */}
            <div className="absolute bottom-24 left-5 pointer-events-none hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6DBC6] shadow-md text-[11px]">
              <Layers className="w-3.5 h-3.5 text-[#b99750] shrink-0" />
              <span className="font-semibold text-gray-700">100% Prime Virgin Food-Grade PP 05</span>
            </div>

            {/* Orbit Interaction Cue */}
            <div className="absolute top-5 right-5 pointer-events-none flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-gray-600 border border-[#E6DBC6] shadow-xs">
              <Rotate3D className="w-3 h-3 text-[#b99750]" />
              <span>Drag to rotate 360°</span>
            </div>
          </>
        )}

        {/* Specs Overlay Tab */}
        {activeTab === 'specs' && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <span className="text-xs font-bold text-[#b99750] uppercase tracking-wider block mb-1">
                Engineering Blueprint &amp; Data
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--ace-ink)] mb-2">{selectedFormat.name}</h3>
              <p className="text-sm text-gray-600 mb-6">{selectedFormat.useCase}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E6DBC6]">
                  <span className="text-[11px] text-gray-500 block mb-0.5">Capacity Volume</span>
                  <p className="text-sm font-bold text-[var(--ace-ink)]">{selectedFormat.capacity}</p>
                </div>
                <div className="bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E6DBC6]">
                  <span className="text-[11px] text-gray-500 block mb-0.5">Polymer Material</span>
                  <p className="text-sm font-bold text-[var(--ace-ink)]">100% Prime Virgin PP 05</p>
                </div>
                <div className="bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E6DBC6]">
                  <span className="text-[11px] text-gray-500 block mb-0.5">Wall Thickness Spec</span>
                  <p className="text-sm font-bold text-[var(--ace-ink)]">{selectedFormat.specs.wall}</p>
                </div>
                <div className="bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E6DBC6]">
                  <span className="text-[11px] text-gray-500 block mb-0.5">Thermal Endurance</span>
                  <p className="text-sm font-bold text-[var(--ace-ink)]">{selectedFormat.specs.temp}</p>
                </div>
                <div className="bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E6DBC6]">
                  <span className="text-[11px] text-gray-500 block mb-0.5">Food Compliance</span>
                  <p className="text-sm font-bold text-[var(--ace-ink)]">{selectedFormat.specs.cert}</p>
                </div>
                <div className="bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E6DBC6]">
                  <span className="text-[11px] text-gray-500 block mb-0.5">Standard Packaging</span>
                  <p className="text-sm font-bold text-[var(--ace-ink)]">{selectedFormat.specs.pack}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Manufactured in Daman, India</span>
              <button
                onClick={() => setActiveTab('3d')}
                className="px-4 py-2 rounded-full bg-[#b99750] text-white text-xs font-bold uppercase hover:bg-[#a6843e] transition-colors"
              >
                Back to 3D View
              </button>
            </div>
          </div>
        )}

        {/* On-Canvas Floating Action Bar */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2.5 z-10 pointer-events-auto">
          {/* Action Toggles: Lid & Food */}
          <div className="flex items-center gap-2">
            {/* Lid Open/Close Toggle */}
            <button
              onClick={() => setOpenLid(!openLid)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-md backdrop-blur-md ${
                openLid
                  ? 'bg-[#b99750] text-white shadow-[#b99750]/20'
                  : 'bg-white text-[var(--ace-ink)] hover:bg-gray-50 border border-[#E6DBC6]'
              }`}
            >
              {openLid ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#b99750]" />}
              <span>{openLid ? 'Close Lid' : 'Open Lid to Inspect'}</span>
            </button>

            {/* Food Packing Drop Toggle */}
            <button
              onClick={() => {
                setHasFood(!hasFood);
                if (!openLid) setOpenLid(true); // opening lid to pack food
              }}
              title="Animation of food entering the packaging"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-md backdrop-blur-md ${
                hasFood
                  ? 'bg-[#10181a] text-white'
                  : 'bg-white text-[var(--ace-ink)] hover:bg-gray-50 border border-[#E6DBC6]'
              }`}
            >
              {hasFood ? (
                <>
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#b99750]" />
                  <span>Meal Packed</span>
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5 text-gray-500" />
                  <span>Blank Container</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoRotate}
              title={autoRotate ? 'Pause 360 rotation' : 'Start 360 rotation'}
              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                autoRotate
                  ? 'bg-[#b99750]/15 border-[#b99750] text-[#b99750]'
                  : 'bg-white border-[#E6DBC6] text-gray-500 hover:text-[var(--ace-ink)]'
              }`}
            >
              <Rotate3D className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              title="Reset angle"
              className="p-2 rounded-full bg-white border border-[#E6DBC6] text-gray-500 hover:text-[var(--ace-ink)] transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar: Format Switcher & Color Picker in Light Theme */}
      <div className="p-4 sm:p-5 border-t border-[#E6DBC6]/80 bg-white space-y-3.5">
        {/* Format Selector Pills */}
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Select Container Geometry:
          </span>
          <div className="flex flex-wrap gap-2">
            {CONTAINER_FORMATS.map((format) => {
              const active = selectedFormat.id === format.id;
              return (
                <button
                  key={format.id}
                  onClick={() => handleFormatChange(format)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#b99750] text-white shadow-md shadow-[#b99750]/20 scale-[1.02]'
                      : 'bg-[#FAF8F4] text-gray-700 hover:bg-gray-100 border border-[#E6DBC6]'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                  <span>{format.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color / Finish Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Container Finish:
            </span>
            <span className="text-xs font-semibold text-[#b99750]">{selectedFinish.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {FINISHES.map((finish) => {
              const active = selectedFinish.id === finish.id;
              return (
                <button
                  key={finish.id}
                  onClick={() => handleFinishChange(finish)}
                  aria-label={`Select ${finish.name} finish`}
                  className={`w-6 h-6 rounded-full transition-transform relative flex items-center justify-center border border-gray-300 shadow-xs ${
                    active ? 'ring-2 ring-[#b99750] ring-offset-2 ring-offset-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: finish.hex }}
                >
                  {active && (
                    <span className={`w-1.5 h-1.5 rounded-full ${finish.id === 'white' ? 'bg-black' : 'bg-white'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
