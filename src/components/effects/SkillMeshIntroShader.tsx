import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from './SoundFeedback';

interface SkillMeshIntroShaderProps {
  onComplete?: () => void;
  onSkip?: () => void;
  autoCloseDelay?: number; // ms to wait after 2.0s before auto-closing (e.g. 400ms)
}

export const SkillMeshIntroShader: React.FC<SkillMeshIntroShaderProps> = ({
  onComplete,
  onSkip,
  autoCloseDelay = 500
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'emerge' | 'forming' | 'locked' | 'complete'>('emerge');
  const [progress, setProgress] = useState<number>(0);
  const [showWordmark, setShowWordmark] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Trigger subtle high-end ambient sound
    soundEffects.playIntroSound();

    // Setup Three.js Scene
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xffffff, 0);

    // Clear previous children and append
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Circular Particle Texture Generator
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(0, 88, 188, 1)');
      gradient.addColorStop(0.2, 'rgba(74, 71, 210, 0.9)');
      gradient.addColorStop(0.55, 'rgba(0, 88, 188, 0.35)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();

      // Sharp white core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(32, 32, 8, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // 1. Node Generation: Fibonacci Sphere target coordinates + scattered start
    const nodeCount = 380;
    const sphereRadius = 1.55;
    const scatterPositions: THREE.Vector3[] = [];
    const targetPositions: THREE.Vector3[] = [];
    const currentPositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeSizes = new Float32Array(nodeCount);

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const primaryColor = new THREE.Color(0x0058bc); // Apple/Stripe Electric Blue
    const irisColor = new THREE.Color(0x4a47d2);    // Sophisticated Iris Violet
    const cyanColor = new THREE.Color(0x0091ff);    // Cyan Glint
    const pearlColor = new THREE.Color(0x7c8ba1);   // Subtle Frost

    for (let i = 0; i < nodeCount; i++) {
      // Fibonacci sphere target coordinates
      const y = 1 - (i / (nodeCount - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const tx = Math.cos(theta) * radiusAtY * sphereRadius;
      const ty = y * sphereRadius;
      const tz = Math.sin(theta) * radiusAtY * sphereRadius;
      targetPositions.push(new THREE.Vector3(tx, ty, tz));

      // Initial scattered position (wide, floating cloud)
      const spread = 7.5;
      const sx = (Math.random() - 0.5) * spread * 1.6;
      const sy = (Math.random() - 0.5) * spread * 1.1;
      const sz = (Math.random() - 0.5) * spread * 1.2;
      scatterPositions.push(new THREE.Vector3(sx, sy, sz));

      currentPositions[i * 3] = sx;
      currentPositions[i * 3 + 1] = sy;
      currentPositions[i * 3 + 2] = sz;

      // Color distribution
      const colorRatio = i / nodeCount;
      const c = new THREE.Color();
      if (colorRatio < 0.45) {
        c.copy(primaryColor);
      } else if (colorRatio < 0.75) {
        c.copy(irisColor);
      } else if (colorRatio < 0.9) {
        c.copy(cyanColor);
      } else {
        c.copy(pearlColor);
      }

      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;

      // Varied node scale
      nodeSizes[i] = (Math.random() * 0.08 + 0.09) * 26;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
    nodeGeometry.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1));

    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodePoints);

    // 2. Precompute Connection Pairs for the Sphere Lattice
    const connections: [number, number][] = [];
    const maxDistanceSq = 0.45 * 0.45;
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const d2 = targetPositions[i].distanceToSquared(targetPositions[j]);
        if (d2 < maxDistanceSq) {
          connections.push([i, j]);
        }
      }
    }

    const linePositions = new Float32Array(connections.length * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0058bc,
      transparent: true,
      opacity: 0,
      blending: THREE.NormalBlending,
      linewidth: 1
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // 3. Custom Translucent 3D Fresnel Glass Sphere Shader
    const glassGeometry = new THREE.IcosahedronGeometry(sphereRadius * 0.94, 5);
    const glassUniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.2 },
      uFormProgress: { value: 0 },
      uGlowIntensity: { value: 0 },
      uOpacity: { value: 0 },
      uColorBase: { value: new THREE.Color(0xf6f9ff) },
      uColorFresnel: { value: new THREE.Color(0x0058bc) },
      uColorIris: { value: new THREE.Color(0x4a47d2) }
    };

    const glassShaderMaterial = new THREE.ShaderMaterial({
      uniforms: glassUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        uniform float uTime;
        uniform float uDistortion;
        uniform float uFormProgress;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          // Organic liquid ripples on sphere surface during assembly
          vec3 pos = position;
          float wave = sin(pos.x * 3.5 + uTime * 6.0) * cos(pos.y * 3.5 + uTime * 5.0) * sin(pos.z * 3.0 + uTime * 4.0);
          pos += normal * wave * uDistortion;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform float uGlowIntensity;
        uniform vec3 uColorBase;
        uniform vec3 uColorFresnel;
        uniform vec3 uColorIris;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // Fresnel glass equation for light background
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

          vec3 col = mix(uColorBase, uColorFresnel, fresnel * 0.85);
          col = mix(col, uColorIris, clamp(fresnel * fresnel * 1.3, 0.0, 1.0));

          // Translucent pearl sheen
          float alpha = (0.04 + fresnel * 0.65 * uGlowIntensity) * uOpacity;
          gl_FragColor = vec4(col, alpha);
        }
      `
    });

    const glassSphere = new THREE.Mesh(glassGeometry, glassShaderMaterial);
    glassSphere.scale.set(0.01, 0.01, 0.01);
    scene.add(glassSphere);

    // 4. Subtle Radial Shockwave Ring for 1.5s Lock Event
    const ringGeometry = new THREE.RingGeometry(sphereRadius * 0.95, sphereRadius * 1.05, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x0058bc,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const shockwaveRing = new THREE.Mesh(ringGeometry, ringMaterial);
    shockwaveRing.rotation.x = Math.PI / 2.5;
    scene.add(shockwaveRing);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop Variables
    let animationFrameId: number;
    const startTime = performance.now();
    const DURATION = 2.0; // Exact 2.0 seconds specification

    // Easing Functions
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easeInOutQuint = (x: number): number =>
      x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    const easeOutBack = (x: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    let hasTriggeredLock = false;
    let hasCompleted = false;

    const animate = () => {
      const now = performance.now();
      const elapsed = Math.min((now - startTime) / 1000, DURATION);
      const normProgress = elapsed / DURATION;
      setProgress(normProgress);

      glassUniforms.uTime.value = elapsed;

      // Rotate group smoothly
      const rotSpeed = 0.008 + (1.0 - normProgress) * 0.015;
      nodePoints.rotation.y += rotSpeed;
      nodePoints.rotation.x += rotSpeed * 0.35;
      lineSegments.rotation.copy(nodePoints.rotation);
      glassSphere.rotation.copy(nodePoints.rotation);
      shockwaveRing.rotation.z += 0.005;

      // =========================================================================
      // TIMING SPECIFICATION BREAKDOWN
      // =========================================================================

      // Phase 1: 0.0s - 0.7s (particles emerge and connect)
      if (elapsed < 0.7) {
        setPhase('emerge');
        const t = elapsed / 0.7;
        const fade = easeOutCubic(t);

        nodeMaterial.opacity = fade * 0.85;
        lineMaterial.opacity = fade * 0.15;
        glassUniforms.uOpacity.value = 0;

        // Particles float in space with gentle attraction
        const posAttr = nodeGeometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < nodeCount; i++) {
          const s = scatterPositions[i];
          const target = targetPositions[i];
          // Gentle drift towards target
          const driftFactor = t * 0.22;
          const cx = THREE.MathUtils.lerp(s.x, target.x, driftFactor);
          const cy = THREE.MathUtils.lerp(s.y, target.y, driftFactor);
          const cz = THREE.MathUtils.lerp(s.z, target.z, driftFactor);

          posArray[i * 3] = cx;
          posArray[i * 3 + 1] = cy;
          posArray[i * 3 + 2] = cz;
        }
        posAttr.needsUpdate = true;

        // Dynamic Line positions
        const lineAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
        const lineArr = lineAttr.array as Float32Array;
        let lineIdx = 0;

        // Render first 40% connections faintly
        const activeConnections = Math.floor(connections.length * 0.35 * t);
        for (let k = 0; k < activeConnections; k++) {
          const [i1, i2] = connections[k];
          lineArr[lineIdx++] = posArray[i1 * 3];
          lineArr[lineIdx++] = posArray[i1 * 3 + 1];
          lineArr[lineIdx++] = posArray[i1 * 3 + 2];
          lineArr[lineIdx++] = posArray[i2 * 3];
          lineArr[lineIdx++] = posArray[i2 * 3 + 1];
          lineArr[lineIdx++] = posArray[i2 * 3 + 2];
        }
        lineAttr.needsUpdate = true;
      }

      // Phase 2: 0.7s - 1.5s (network rapidly forms the 3D mesh)
      else if (elapsed >= 0.7 && elapsed < 1.5) {
        setPhase('forming');
        const t = (elapsed - 0.7) / 0.8; // 0.0 to 1.0
        const easeConvergence = easeInOutQuint(t);

        nodeMaterial.opacity = 0.85 + t * 0.15;
        lineMaterial.opacity = 0.15 + t * 0.45;

        // Translucent glass sphere expands
        const sphereScale = THREE.MathUtils.lerp(0.1, 1.0, easeConvergence);
        glassSphere.scale.set(sphereScale, sphereScale, sphereScale);
        glassUniforms.uOpacity.value = t * 0.85;
        glassUniforms.uDistortion.value = (1.0 - t) * 0.22 + 0.02; // Liquid ripple settles
        glassUniforms.uGlowIntensity.value = 0.3 + t * 0.5;

        // Pull particles directly onto spherical lattice coordinates
        const posAttr = nodeGeometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < nodeCount; i++) {
          const s = scatterPositions[i];
          const target = targetPositions[i];

          // Rapid pull with subtle spring
          const px = THREE.MathUtils.lerp(s.x * 0.78, target.x, easeConvergence);
          const py = THREE.MathUtils.lerp(s.y * 0.78, target.y, easeConvergence);
          const pz = THREE.MathUtils.lerp(s.z * 0.78, target.z, easeConvergence);

          posArray[i * 3] = px;
          posArray[i * 3 + 1] = py;
          posArray[i * 3 + 2] = pz;
        }
        posAttr.needsUpdate = true;

        // Connecting struts snap into full network
        const lineAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
        const lineArr = lineAttr.array as Float32Array;
        let lineIdx = 0;

        const maxLines = Math.floor(connections.length * Math.min(1.0, 0.4 + t * 0.6));
        for (let k = 0; k < maxLines; k++) {
          const [i1, i2] = connections[k];
          lineArr[lineIdx++] = posArray[i1 * 3];
          lineArr[lineIdx++] = posArray[i1 * 3 + 1];
          lineArr[lineIdx++] = posArray[i1 * 3 + 2];
          lineArr[lineIdx++] = posArray[i2 * 3];
          lineArr[lineIdx++] = posArray[i2 * 3 + 1];
          lineArr[lineIdx++] = posArray[i2 * 3 + 2];
        }
        lineAttr.needsUpdate = true;
      }

      // Phase 3: 1.5s - 2.0s (mesh stabilizes + subtle glow + SKILLMESH reveal)
      else if (elapsed >= 1.5) {
        setPhase('locked');
        if (!hasTriggeredLock) {
          hasTriggeredLock = true;
          setShowWordmark(true);
        }

        const t = (elapsed - 1.5) / 0.5; // 0.0 to 1.0
        const lockDamping = easeOutBack(Math.min(1.0, t * 1.15));

        // Precision sphere lock
        glassSphere.scale.set(1.0, 1.0, 1.0);
        glassUniforms.uOpacity.value = 0.95;
        glassUniforms.uDistortion.value = 0.005; // Settled glassy perfection
        glassUniforms.uGlowIntensity.value = 1.0 + Math.sin(t * Math.PI) * 0.35; // Soft bloom

        nodeMaterial.opacity = 1.0;
        lineMaterial.opacity = 0.62;

        const posAttr = nodeGeometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < nodeCount; i++) {
          const target = targetPositions[i];
          posArray[i * 3] = target.x;
          posArray[i * 3 + 1] = target.y;
          posArray[i * 3 + 2] = target.z;
        }
        posAttr.needsUpdate = true;

        // All lines locked
        const lineAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
        const lineArr = lineAttr.array as Float32Array;
        let lineIdx = 0;
        for (let k = 0; k < connections.length; k++) {
          const [i1, i2] = connections[k];
          lineArr[lineIdx++] = posArray[i1 * 3];
          lineArr[lineIdx++] = posArray[i1 * 3 + 1];
          lineArr[lineIdx++] = posArray[i1 * 3 + 2];
          lineArr[lineIdx++] = posArray[i2 * 3];
          lineArr[lineIdx++] = posArray[i2 * 3 + 1];
          lineArr[lineIdx++] = posArray[i2 * 3 + 2];
        }
        lineAttr.needsUpdate = true;

        // Subtle expanding resonance ring dissipation
        shockwaveRing.scale.set(1.0 + t * 0.55, 1.0 + t * 0.55, 1.0);
        ringMaterial.opacity = Math.max(0, (1.0 - t) * 0.28);
      }

      renderer.render(scene, camera);

      // Check if 2.0s reached
      if (elapsed >= DURATION && !hasCompleted) {
        hasCompleted = true;
        setPhase('complete');
        // Auto-close seamlessly after requested 2.0s lock duration
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete?.();
          }, 450);
        }, autoCloseDelay);
      }

      if (!hasCompleted || elapsed < DURATION + 0.1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      glassGeometry.dispose();
      glassShaderMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoCloseDelay, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="skillmesh-3d-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{
            // Minimal light/white background with Apple/Stripe soft luminous depth
            background:
              'radial-gradient(circle at 50% 45%, #ffffff 0%, #fbfcfe 55%, #f2f5fa 100%)'
          }}
        >
          {/* Subtle Ambient Vignette & Grain */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,88,188,0.03)_100%)]" />

          {/* Three.js 3D WebGL Canvas Container */}
          <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
          />

          {/* Top Brand Bar / Skip Button */}
          <div className="absolute top-6 left-0 right-0 px-8 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0058bc] animate-ping" />
              <span className="text-[10px] font-mono font-extrabold tracking-widest text-[#0058bc] uppercase">
                SYSTEM INITIALIZING
              </span>
            </div>

            <button
              onClick={() => {
                setIsExiting(true);
                setTimeout(() => onSkip ? onSkip() : onComplete?.(), 250);
              }}
              className="px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold text-[#555a64] hover:text-[#1b1b1d] transition-all cursor-pointer backdrop-blur-xs flex items-center gap-1.5"
            >
              <span>Skip</span>
              <kbd className="text-[9px] bg-white/80 px-1 py-0.5 rounded text-[#717786]">ESC</kbd>
            </button>
          </div>

          {/* Exactly 1.5s - 2.0s: SKILLMESH Wordmark Cinematic Reveal */}
          <AnimatePresence>
            {showWordmark && (
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1.0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-16 sm:bottom-20 z-20 flex flex-col items-center text-center px-4"
              >
                {/* Wordmark: Apple x Stripe x Linear Minimal Typography */}
                <div className="overflow-hidden pb-1">
                  <motion.h1
                    initial={{ letterSpacing: '0.32em' }}
                    animate={{ letterSpacing: '0.22em' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#1b1b1d] via-[#0058bc] to-[#4a47d2] tracking-[0.22em] uppercase select-none drop-shadow-xs pl-[0.22em]"
                  >
                    SKILLMESH
                  </motion.h1>
                </div>

                {/* Subtitle Status Tagline */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.38 }}
                  className="mt-3 flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/80 border border-black/5 shadow-xs backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#44474e] uppercase">
                    LIVING CAREER INTELLIGENCE
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0058bc]/10 text-[#0058bc] font-extrabold">
                    2.0s LOCK
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimal 2.0s High-Precision Progress Trace */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0058bc] via-[#4a47d2] to-[#0091ff]"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
