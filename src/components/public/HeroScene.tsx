'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const HERO_ORB_POSITION: [number, number, number] = [3.2, 1.5, -1.0];

/* ══════════════════════════════════════════════════════
   STAR SPRITE — soft Gaussian glow circle (distant, dim)
══════════════════════════════════════════════════════ */
function makeStarSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;
  const g = ctx.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0.0, 'rgba(255,255,255,1.0)');
  g.addColorStop(0.2, 'rgba(200,220,255,0.7)');
  g.addColorStop(0.55, 'rgba(140,180,255,0.15)');
  g.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(canvas);
  t.needsUpdate = true;
  return t;
}

/* ══════════════════════════════════════════════════════
   DYNAMIC STARFIELD — dense, active, drifting hyperspace dust
══════════════════════════════════════════════════════ */
function DynamicStarfield() {
  const ref = useRef<THREE.Points>(null!);
  const tex = useMemo(() => makeStarSprite(), []);

  const count = 2500;
  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Wide cylindrical distribution around the viewport
      const r = 4 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      pos[i3] = r * Math.sin(theta);
      pos[i3 + 1] = (Math.random() - 0.5) * 20; // Y
      pos[i3 + 2] = r * Math.cos(theta) - 6;    // Z

      const bright = 0.25 + Math.random() * 0.75;
      // High-end Midnight Protocol colors: Cyan & Deep Violet
      const isCyan = Math.random() > 0.4;
      col[i3] = bright * (isCyan ? 0.0 : 0.6); // Red 
      col[i3 + 1] = bright * (isCyan ? 0.9 : 0.3); // Green
      col[i3 + 2] = bright; // Blue (max out to 1.0)

      spd[i] = 0.005 + Math.random() * 0.02; // Individual drift speed
    }
    return { positions: pos, colors: col, speeds: spd };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const geom = ref.current.geometry;
    const pos = geom.attributes.position.array as Float32Array;
    
    // Smooth macroscopic rotation
    ref.current.rotation.y = clock.elapsedTime * 0.02;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.05) * 0.05;

    // Microscopic individual floating activity
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1; // target the Y coordinate
      pos[idx] += speeds[i];
      // Reset smoothly when they drift beyond the viewport ceiling
      if (pos[idx] > 10) {
        pos[idx] = -10;
      }
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.065}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════
   WIREFRAME SPHERE — the signature centerpiece
   Elegant, slowly rotating, placed right-of-center
══════════════════════════════════════════════════════ */
function SignatureSphere() {
  const groupRef = useRef<THREE.Group>(null!);

  const glassRef = useRef<THREE.Mesh>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  const { particlePositions } = useMemo(() => {
    // Smooth elegant dust cloud
    const count = 300;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute strictly inside the glass sphere volume smoothly
      const r = 0.3 + Math.random() * 0.9;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return { particlePositions: pos };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;

    // Extremely fluid, smooth group motion
    if (groupRef.current) {
      groupRef.current.position.y = HERO_ORB_POSITION[1] + Math.sin(t * 0.8) * 0.08;
      // Parallax smooth delay
      groupRef.current.rotation.x += (pointer.y * 0.2 - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (pointer.x * 0.2 - groupRef.current.rotation.y) * 0.02;
    }

    // Inside core slowly undulates
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.15;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      // Smooth breathing
      const s = 1 + Math.sin(t * 1.5) * 0.04;
      coreRef.current.scale.setScalar(s);
    }

    // Glass shell slow majestic rotation
    if (glassRef.current) {
      glassRef.current.rotation.y = -t * 0.05;
      glassRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
    }

    // Majestic metallic rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.1;
      ring1Ref.current.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.2) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI * 0.2 + Math.cos(t * 0.2) * 0.15;
      ring2Ref.current.rotation.y = -t * 0.08;
    }

    // Swirling dust inside the fluid
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.08;
      particlesRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }

    // Halo pulse
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.03;
      haloRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef} position={HERO_ORB_POSITION}>
      {/* Subtle interior lighting */}
      <pointLight color="#00f5ff" intensity={1.5} distance={6} decay={2} />

      {/* DARK, GHOSTLY REFRACTIVE GLASS SHELL */}
      <mesh ref={glassRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#050510" // Dark tint to blend with theme
          transmission={0.95}
          opacity={0.4} // Allow background to heavily bleed through
          transparent={true}
          roughness={0.02}
          metalness={0.2}
          ior={1.15} // Softer refraction for ghost-like appearance
          thickness={1.0}
          clearcoat={0.5} // Still slightly shiny, but not overpowering
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* GHOSTLY FLUID CORE */}
      <mesh ref={coreRef}>
        <torusKnotGeometry args={[0.5, 0.15, 128, 64]} />
        <meshPhysicalMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1.0} // Soften the glow a lot
          transparent={true}
          opacity={0.5} // Allow it to be slightly see-through
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* ULTRA SOFT AMBIENT GLOW */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhysicalMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.4}
          transparent opacity={0.04} // barely visible inner haze
          roughness={0.8}
        />
      </mesh>

      {/* FAINT OUTER HALO */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.02} // Almost invisible, just a tiny bleed
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* SUBTLE METAL RINGS */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.9} roughness={0.3} transparent opacity={0.6} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.6, 0.008, 16, 100]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.9} roughness={0.4} emissive="#bf00ff" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>

      {/* SOFT DUST PARTICLES */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#00f5ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
      </points>
    </group>
  );
}

function OrbitingParticles() {
  const groupRef = useRef<THREE.Group>(null!);

  const { positions, colors } = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.2 + Math.random() * 1.1;
      const height = (Math.random() - 0.5) * 1.8;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius * 0.7;

      const mix = Math.random();
      colors[i3] = 0.45 + mix * 0.35;
      colors[i3 + 1] = 0.7 + (1 - mix) * 0.25;
      colors[i3 + 2] = 1;
    }

    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.12;
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={HERO_ORB_POSITION}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ══════════════════════════════════════════════════════
   NEURAL NODES — sparse floating dots with connection lines
   Gives depth without cluttering text space
══════════════════════════════════════════════════════ */
function NeuralNodes() {
  const groupRef = useRef<THREE.Group>(null!);

  const { nodePositions, linePositions } = useMemo(() => {
    // Place nodes along edges — avoid center text area (roughly -2..2 x, -1.5..1.5 y near front)
    const nodes: THREE.Vector3[] = [
      new THREE.Vector3(6.5, 2.2, -2.0),
      new THREE.Vector3(5.8, -1.8, -1.5),
      new THREE.Vector3(7.0, 0.3, -3.0),
      new THREE.Vector3(3.5, 3.5, -2.5),
      new THREE.Vector3(2.0, 4.0, -3.5),
      new THREE.Vector3(-4.5, 2.8, -4.0),
      new THREE.Vector3(-5.0, -1.2, -3.5),
      new THREE.Vector3(-3.0, 4.0, -3.0),
      new THREE.Vector3(1.0, -3.5, -2.5),
      new THREE.Vector3(4.0, -3.0, -3.0),
      new THREE.Vector3(6.0, 4.0, -4.0),
      new THREE.Vector3(-6.0, 1.8, -4.5),
      new THREE.Vector3(-2.5, -3.8, -3.5),
      new THREE.Vector3(0.0, 5.0, -4.0),
    ];

    // Connect nearby nodes
    const lineVerts: number[] = [];
    const maxDist = 4.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].distanceTo(nodes[j]);
        if (d < maxDist) {
          lineVerts.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z,
          );
        }
      }
    }

    const nodePositions = new Float32Array(nodes.flatMap(n => [n.x, n.y, n.z]));
    const linePositions = new Float32Array(lineVerts);
    return { nodePositions, linePositions };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Very subtle drift
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.04) * 0.06;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.03) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Node dots */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#00f5ff"
          size={0.08}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ══════════════════════════════════════════════════════
   AURORA PLANE — large, very faint volumetric color band
   Creates a sense of atmospheric depth behind content
══════════════════════════════════════════════════════ */
function AuroraPlane() {
  const ref = useRef<THREE.Mesh>(null!);

  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size * 3;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    // Horizontal aurora gradient
    const g = ctx.createLinearGradient(0, 0, size * 3, 0);
    g.addColorStop(0.0, 'rgba(0,0,0,0)');
    g.addColorStop(0.2, 'rgba(0,245,255,0.10)');
    g.addColorStop(0.45, 'rgba(191,0,255,0.14)');
    g.addColorStop(0.7, 'rgba(0,245,255,0.08)');
    g.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size * 3, size);
    // Vertical fade (top and bottom fade to transparent)
    const gv = ctx.createLinearGradient(0, 0, 0, size);
    gv.addColorStop(0, 'rgba(0,0,0,0.95)');
    gv.addColorStop(0.3, 'rgba(0,0,0,0)');
    gv.addColorStop(0.7, 'rgba(0,0,0,0)');
    gv.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.fillStyle = gv;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, size * 3, size);
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    return t;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Slowly drift the plane
      ref.current.position.y = -0.5 + Math.sin(clock.elapsedTime * 0.18) * 0.3;
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.55 + Math.sin(clock.elapsedTime * 0.22) * 0.10;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -4]} rotation={[0, 0, 0]}>
      <planeGeometry args={[28, 5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════
   SCENE LIGHTING — controlled and elegant
══════════════════════════════════════════════════════ */
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.04} color="#000810" />
      {/* Key light — above and slightly right, illuminating the sphere */}
      <pointLight position={[7, 4, 2]} intensity={9} color="#00f5ff" distance={16} decay={2} />
      {/* Fill with purple from left */}
      <pointLight position={[-4, 1, 0]} intensity={3.0} color="#bf00ff" distance={12} decay={2} />
      {/* Rim from below */}
      <pointLight position={[6, -5, 1]} intensity={3} color="#00f5ff" distance={12} decay={2.5} />
      <pointLight position={[4, 1.5, 4]} intensity={2.2} color="#ffd700" distance={10} decay={2} />
    </>
  );
}

/* ══════════════════════════════════════════════════════
   MOUSE PARALLAX CAMERA — subtle, premium feel
══════════════════════════════════════════════════════ */
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5);
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(() => {
    // Very smooth, very subtle — premium feel
    target.current.x += (mouse.current.x * 0.5 - target.current.x) * 0.03;
    target.current.y += (mouse.current.y * 0.3 - target.current.y) * 0.03;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y + 0.2;
    camera.lookAt(1.7, -0.2, 0); // look toward sphere, slightly down
  });

  return null;
}

/* ══════════════════════════════════════════════════════
   FALLBACK (no WebGL)
══════════════════════════════════════════════════════ */
function HeroFallback() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0,245,255,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 40% 60% at 20% 60%, rgba(191,0,255,0.05) 0%, transparent 70%)
      `,
    }} />
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function HeroScene() {
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.')
      ) {
        return;
      }
      originalWarn(...args);
    };

    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  if (!webglOk) return <HeroFallback />;

  return (
    <Canvas
      camera={{ position: [0, 0.2, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          setWebglOk(false);
        });
      }}
      aria-label="Interactive 3D holographic hero scene"
      style={{ position: 'absolute', inset: 0 }}
    >
      <SceneLighting />
      <CameraController />
      <AuroraPlane />
      <DynamicStarfield />
      <NeuralNodes />
      <OrbitingParticles />
      <SignatureSphere />
    </Canvas>
  );
}
