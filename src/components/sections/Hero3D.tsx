import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { FLAVORS } from '../../data/content';
import { FlavorProfile } from '../../types';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

interface Hero3DProps {
  onOpenBrief: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ onOpenBrief }) => {
  const content = useContent();
  const heroData = content.hero || {};
  const mountRef = useRef<HTMLDivElement>(null);
  const activeFlavors: FlavorProfile[] = heroData.flavors && heroData.flavors.length > 0 ? heroData.flavors : FLAVORS;
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorProfile>(activeFlavors[0] || FLAVORS[0]);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // References to update 3D scene smoothly
  const flavorRef = useRef(selectedFlavor);
  flavorRef.current = selectedFlavor;

  const threeSettings = heroData.threeSettings || {
    autoRotateSpeed: 0.35,
    tiltIntensity: 0.6,
    sprinklesCount: 75,
    floatingParticles: 90,
  };
  const settingsRef = useRef(threeSettings);
  settingsRef.current = threeSettings;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Group for the entire Kulfi Pop
    const kulfiGroup = new THREE.Group();
    scene.add(kulfiGroup);

    // --- 1. Kulfi Body Geometry (Tapered conical treat) ---
    // Cone/Cylinder with top rounded cap
    const kulfiBodyGeo = new THREE.CylinderGeometry(0.72, 1.15, 3.4, 32, 16);
    // Move origin so stick attaches at bottom
    kulfiBodyGeo.translate(0, 0.6, 0);

    const kulfiBodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedFlavor.baseColor),
      roughness: selectedFlavor.roughness,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15,
      transmission: 0.08,
      thickness: 1.2,
      specularIntensity: 0.8,
    });
    const kulfiMesh = new THREE.Mesh(kulfiBodyGeo, kulfiBodyMat);
    kulfiGroup.add(kulfiMesh);

    // Rounded top cap
    const capGeo = new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    capGeo.translate(0, 2.3, 0);
    const capMesh = new THREE.Mesh(capGeo, kulfiBodyMat);
    kulfiGroup.add(capMesh);

    // --- 2. Wooden Ice Cream Stick ---
    const stickGeo = new THREE.BoxGeometry(0.32, 2.2, 0.08);
    stickGeo.translate(0, -1.8, 0);
    const stickMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.85,
      metalness: 0.0,
    });
    const stickMesh = new THREE.Mesh(stickGeo, stickMat);
    kulfiGroup.add(stickMesh);

    // --- 3. Pistachio & Saffron Sprinkle chunks on Kulfi body ---
    const sprinklesCount = 75;
    const sprinklesGroup = new THREE.Group();
    kulfiGroup.add(sprinklesGroup);

    const sprinkleBoxes: THREE.Mesh[] = [];
    for (let i = 0; i < sprinklesCount; i++) {
      const isNut = Math.random() > 0.3;
      const sGeo = isNut
        ? new THREE.DodecahedronGeometry(0.045 + Math.random() * 0.035)
        : new THREE.BoxGeometry(0.02, 0.14 + Math.random() * 0.08, 0.02);

      const sMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(isNut ? selectedFlavor.toppingColor : selectedFlavor.accentColor),
        roughness: 0.6,
      });

      const sMesh = new THREE.Mesh(sGeo, sMat);

      // Distribute onto surface of cylinder
      const angle = Math.random() * Math.PI * 2;
      const h = -0.8 + Math.random() * 3.0;
      const radiusAtH = 0.72 + (1.15 - 0.72) * ((2.3 - h) / 3.4);
      const r = radiusAtH + 0.02;

      sMesh.position.set(Math.cos(angle) * r, h + 0.6, Math.sin(angle) * r);
      sMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      sprinklesGroup.add(sMesh);
      sprinkleBoxes.push(sMesh);
    }

    // --- 4. Melting droplets dripping at the bottom ---
    const dropletsGroup = new THREE.Group();
    kulfiGroup.add(dropletsGroup);

    const droplets: { mesh: THREE.Mesh; startY: number; speed: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const dropGeo = new THREE.SphereGeometry(0.09, 16, 16);
      dropGeo.scale(1, 1.4, 1);
      const dropMat = kulfiBodyMat;
      const dropMesh = new THREE.Mesh(dropGeo, dropMat);
      const angle = (i / 4) * Math.PI * 2 + 0.4;
      const startY = -0.95;
      dropMesh.position.set(Math.cos(angle) * 1.08, startY, Math.sin(angle) * 1.08);
      dropletsGroup.add(dropMesh);
      droplets.push({ mesh: dropMesh, startY, speed: 0.004 + Math.random() * 0.003 });
    }

    // --- 5. Floating background ambient sprinkles & sparkles in 3D air ---
    const ambientCount = 90;
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientColors = new Float32Array(ambientCount * 3);

    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 14;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = new THREE.Color(
        i % 3 === 0 ? '#F4A300' : i % 3 === 1 ? '#84C57E' : '#F7A8B8'
      );
      ambientColors[i * 3] = c.r;
      ambientColors[i * 3 + 1] = c.g;
      ambientColors[i * 3 + 2] = c.b;
    }

    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    ambientGeo.setAttribute('color', new THREE.BufferAttribute(ambientColors, 3));

    const ambientMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientPoints);

    // --- 6. Studio Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Cool fill light
    const fillLight = new THREE.DirectionalLight(0xdff4ff, 1.4);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // Rim light to make the kulfi pop from background
    const rimLight = new THREE.DirectionalLight(0xffe8a3, 2.0);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Mouse Tracking for tilt & parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = nx;
      mouseY = ny;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    // Render loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Continuous subtle float & spin
      kulfiGroup.position.y = Math.sin(elapsed * 1.5) * 0.12;

      // Mouse parallax tilt
      targetRotationY = elapsed * 0.35 + mouseX * 0.6;
      targetRotationX = Math.sin(elapsed * 0.8) * 0.08 - mouseY * 0.4;

      kulfiGroup.rotation.y += (targetRotationY - kulfiGroup.rotation.y) * 0.05;
      kulfiGroup.rotation.x += (targetRotationX - kulfiGroup.rotation.x) * 0.05;
      kulfiGroup.rotation.z = Math.sin(elapsed * 0.7) * 0.05;

      // Dripping droplets animation
      droplets.forEach((drop) => {
        drop.mesh.position.y -= drop.speed;
        if (drop.mesh.position.y < drop.startY - 0.7) {
          drop.mesh.position.y = drop.startY;
        }
      });

      // Slowly rotate ambient sprinkles
      ambientPoints.rotation.y = elapsed * 0.04;

      // Smoothly interpolate current material color toward selected flavor
      const targetColor = new THREE.Color(flavorRef.current.baseColor);
      kulfiBodyMat.color.lerp(targetColor, 0.06);

      // Smoothly update sprinkle colors
      const targetTopping = new THREE.Color(flavorRef.current.toppingColor);
      sprinkleBoxes.forEach((s) => {
        const mat = s.material as THREE.MeshStandardMaterial;
        mat.color.lerp(targetTopping, 0.06);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleFlavorSelect = (flv: FlavorProfile) => {
    sound.playPop(580);
    setSelectedFlavor(flv);
  };

  return (
    <section className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Background Liquid Milk Swirl Radial Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute -top-[20%] -right-[10%] w-[65vw] h-[65vw] rounded-full blur-[110px] opacity-25 dark:opacity-15 transition-colors duration-700"
          style={{ backgroundColor: selectedFlavor.baseColor }}
        />
        <div
          className="absolute -bottom-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[100px] opacity-20 dark:opacity-10 transition-colors duration-700"
          style={{ backgroundColor: selectedFlavor.accentColor }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Unboxed Metadata Kicker (Anti-slop zero-pill rule compliant) */}
            <div className="flex items-center gap-2 text-xs font-mono font-medium tracking-wider text-[var(--text-secondary)] mb-6 uppercase">
              <span className="text-[#F4A300] font-semibold">
                {heroData.kicker || 'Artisanal Engineering · Web & Cloud Systems · 99.4% Client Satisfaction'}
              </span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08] mb-6 text-balance">
              {heroData.headline || 'We Serve Software, Cold & Fresh.'}
            </h1>

            {/* Concrete Value Proposition */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-8">
              {heroData.subheadline ||
                'We engineer custom web platforms, mobile applications, cloud architectures, and AI automation systems. Every project is crafted, chilled, and served with sub-400ms speed and zero template bloat.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={() => {
                  sound.playChime();
                  onOpenBrief();
                }}
                type="button"
                data-cursor="Order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] rounded-xl hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors shadow-lg shadow-[#1E1410]/15"
              >
                <span>{heroData.primaryCtaText || 'Order a Project'}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <a
                href="#services"
                data-cursor="Menu"
                onClick={() => sound.playPop()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide text-[var(--text-primary)] rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                <span>{heroData.secondaryCtaText || 'Explore Flavour Menu'}</span>
              </a>
            </div>

            {/* Real-time 3D Flavor Switcher */}
            <div className="w-full pt-4 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#F4A300]" />
                <span>Interact with 3D Kulfi Flavour:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeFlavors.map((flavor) => (
                  <button
                    key={flavor.id}
                    onClick={() => handleFlavorSelect(flavor)}
                    type="button"
                    data-cursor="Taste"
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      selectedFlavor.id === flavor.id
                        ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-sm'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[#F4A300]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: flavor.baseColor }}
                    />
                    <span>{flavor.name}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)] italic">
                {selectedFlavor.subname} — {selectedFlavor.toppingName}
              </p>
            </div>
          </div>

          {/* Right Column: Full Interactive 3D Canvas / Scene */}
          <div className="lg:col-span-5 relative h-[440px] sm:h-[520px] lg:h-[600px] w-full flex items-center justify-center">
            {/* The WebGL Canvas mounts here */}
            {webGlSupported ? (
              <div
                ref={mountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                data-cursor="Rotate 3D"
                title="Drag or move cursor to tilt 3D Kulfi"
              />
            ) : (
              /* Graceful CSS 3D Fallback if WebGL unavailable */
              <div className="relative flex flex-col items-center justify-center h-full">
                <div
                  className="w-40 h-64 rounded-t-full rounded-b-lg shadow-2xl relative flex items-center justify-center transition-colors duration-500"
                  style={{ backgroundColor: selectedFlavor.baseColor }}
                >
                  <div className="absolute -bottom-16 w-6 h-20 bg-[#D4A373] rounded-b-md shadow-md" />
                </div>
              </div>
            )}

            {/* Interactive 3D floating tag */}
            <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-[11px] font-mono text-[var(--text-secondary)] pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#84C57E] animate-ping" />
              <span>Interactive WebGL 3D · Drag to tilt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator shaped like a melting drop */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-6">
        <a
          href="#clients"
          data-cursor="Scroll"
          onClick={() => sound.playPop(420)}
          className="flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[#F4A300] transition-colors"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest">Scroll To Digest</span>
          <div className="w-5 h-8 rounded-full border border-[var(--border-strong)] flex items-start justify-center p-1">
            <div className="w-1.5 h-2 bg-[#F4A300] rounded-full animate-drip" />
          </div>
        </a>
      </div>
    </section>
  );
};
