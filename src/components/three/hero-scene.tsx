"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial, PerformanceMonitor } from "@react-three/drei";
import { AdditiveBlending, BackSide, Color, MathUtils, type Group, type Mesh, type ShaderMaterial } from "three";

type Palette = { core: string; accent: string; glow: string; particle: string };

const palettes: Record<"dark" | "light", Palette> = {
  dark: { core: "#0ea271", accent: "#34d399", glow: "#22d3ee", particle: "#a7f3d0" },
  light: { core: "#059669", accent: "#047857", glow: "#0891b2", particle: "#0f766e" },
};

/** Tracks the html.dark class so the scene recolors with the theme toggle. */
function usePalette() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setDark(el.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return { palette: dark ? palettes.dark : palettes.light, dark };
}

// ---------------------------------------------------------------------------
// Shaders (tiny, single-pass — cheaper than postprocessing bloom)
// ---------------------------------------------------------------------------

const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Rendered on the back faces of a larger shell: brightest just outside
    // the core's silhouette, fading smoothly to nothing at the shell edge.
    float f = pow(abs(dot(vNormal, vView)), 3.0);
    gl_FragColor = vec4(uColor * f * uIntensity, f);
  }
`;

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aScale;
  attribute float aPhase;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vTwinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const particleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vTwinkle * uOpacity);
  }
`;

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

/** Glossy morphing core. Distortion swells as the pointer approaches the centre. */
function Core({ palette, still }: { palette: Palette; still: boolean }) {
  // MeshDistortMaterial exposes `distort` as a setter on its impl.
  const mat = useRef<{ distort: number } | null>(null);
  useFrame((state, delta) => {
    if (!mat.current || still) return;
    const near = 1 - Math.min(1, Math.hypot(state.pointer.x, state.pointer.y));
    mat.current.distort = MathUtils.damp(mat.current.distort, 0.28 + near * 0.22, 2.5, delta);
  });
  return (
    <mesh>
      <icosahedronGeometry args={[1.2, 20]} />
      <MeshDistortMaterial
        ref={mat as never}
        color={palette.core}
        distort={0.3}
        speed={still ? 0 : 1.6}
        roughness={0.08}
        metalness={0.25}
        clearcoat={1}
        clearcoatRoughness={0.1}
        iridescence={0.6}
        iridescenceIOR={1.3}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

/** Soft additive halo (a larger back-faced shell) around a body. */
function Atmosphere({ color, scale, intensity }: { color: string; scale: number; intensity: number }) {
  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uColor: { value: new Color() }, uIntensity: { value: 1 } }), []);
  useEffect(() => {
    if (!mat.current) return;
    mat.current.uniforms.uColor.value.set(color);
    mat.current.uniforms.uIntensity.value = intensity;
  }, [color, intensity]);
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1.2, 48, 48]} />
      <shaderMaterial
        ref={mat}
        vertexShader={fresnelVertex}
        fragmentShader={fresnelFragment}
        uniforms={uniforms}
        side={BackSide}
        blending={AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/** Wireframe lattice counter-rotating around the core. */
function Lattice({ color, still }: { color: string; still: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current || still) return;
    ref.current.rotation.y -= delta * 0.08;
    ref.current.rotation.x += delta * 0.03;
  });
  return (
    <mesh ref={ref} scale={1.7}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.14} depthWrite={false} />
    </mesh>
  );
}

/** Small deterministic PRNG (mulberry32) so the galaxy is pure and identical each mount. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Two loose spiral arms in a flat disc, plus a sparse spherical halo. */
function buildGalaxy(count: number) {
  const rand = seeded(27);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const inDisc = i < count * 0.78;
    if (inDisc) {
      const r = 1.9 + Math.pow(rand(), 1.6) * 1.9;
      const a = (i % 2) * Math.PI + r * 1.35 + (rand() - 0.5) * 0.9;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (rand() - 0.5) * 0.18 * (4 - r);
      positions[i * 3 + 2] = Math.sin(a) * r;
    } else {
      const u = rand() * 2 - 1;
      const t = rand() * Math.PI * 2;
      const r = 2.6 + rand() * 1.6;
      const s = Math.sqrt(1 - u * u);
      positions[i * 3] = Math.cos(t) * s * r;
      positions[i * 3 + 1] = u * r;
      positions[i * 3 + 2] = Math.sin(t) * s * r;
    }
    scales[i] = 0.4 + rand() * (inDisc ? 1 : 0.6);
    phases[i] = rand() * Math.PI * 2;
  }
  return { positions, scales, phases };
}

/** Tilted particle disc + sparse halo, drawn in one point cloud. */
function Galaxy({ color, count, still }: { color: string; count: number; still: boolean }) {
  const ref = useRef<Group>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const { positions, scales, phases } = useMemo(() => buildGalaxy(count), [count]);

  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 38 },
      uColor: { value: new Color() },
      uOpacity: { value: 0.9 },
    }),
    [],
  );
  useEffect(() => {
    if (!mat.current) return;
    mat.current.uniforms.uColor.value.set(color);
    mat.current.uniforms.uPixelRatio.value = dpr;
  }, [color, dpr]);

  useFrame((state, delta) => {
    if (still || !mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <group rotation={[0.42, 0, -0.18]}>
      <group ref={ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
            <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={mat}
            vertexShader={particleVertex}
            fragmentShader={particleFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

function Orbit({ radius, speed, tilt, color, still, halo }: { radius: number; speed: number; tilt: [number, number]; color: string; still: boolean; halo: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !still) ref.current.rotation.z += delta * speed;
  });
  return (
    <group rotation={[tilt[0], tilt[1], 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 6, 192]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <group position={[radius, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
          {halo && <Atmosphere color={color} scale={0.2} intensity={1.6} />}
        </group>
      </group>
    </group>
  );
}

/** Eases the composition toward the pointer and drifts it with page scroll. */
function Rig({ children, still }: { children: React.ReactNode; still: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    const tx = still ? 0 : state.pointer.y * 0.3 + scroll * 0.5;
    const ty = still ? 0 : state.pointer.x * 0.45 + scroll * 0.8;
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, tx, 3, delta);
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, ty, 3, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, scroll * 0.6, 3, delta);
  });
  return <group ref={group}>{children}</group>;
}

function Scene({ still, particles }: { still: boolean; particles: number }) {
  const { palette, dark } = usePalette();
  return (
    <>
      <ambientLight intensity={dark ? 0.35 : 0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-4, -2, -1]} color={palette.glow} intensity={35} />
      <pointLight position={[3, -3, 2]} color={palette.accent} intensity={14} />

      {/* Procedural studio reflections: rendered once, no HDR download. */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="ring" intensity={3} color="#ffffff" position={[0, 3, -4]} scale={4} />
        <Lightformer form="rect" intensity={2} color="#67e8f9" position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#6ee7b7" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="circle" intensity={2} color="#ffffff" position={[0, -4, 2]} scale={2} />
      </Environment>

      <Rig still={still}>
        <Float speed={still ? 0 : 1.4} rotationIntensity={still ? 0 : 0.4} floatIntensity={still ? 0 : 0.8}>
          <Core palette={palette} still={still} />
          {/* Additive glow only reads on dark backgrounds; on light ones it composites as a dark disc. */}
          {dark && <Atmosphere color={palette.glow} scale={1.6} intensity={0.9} />}
          <Lattice color={palette.accent} still={still} />
        </Float>
        <Galaxy color={palette.particle} count={particles} still={still} />
        <Orbit radius={2.15} speed={0.55} tilt={[0.55, 0.3]} color={palette.particle} still={still} halo={dark} />
        <Orbit radius={2.6} speed={-0.35} tilt={[-0.75, 0.2]} color={palette.accent} still={still} halo={dark} />
      </Rig>
    </>
  );
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [still, setStill] = useState(false);
  const [dpr, setDpr] = useState(1.5);
  // Fewer particles on small / low-core devices.
  const [particles] = useState(() =>
    window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4 ? 900 : 2400,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    // Stop rendering frames while the hero is scrolled out of view.
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 8.2], fov: 42 }}
        frameloop={visible && !still ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
        eventSource={document.body}
        eventPrefix="client"
        // Wait one frame after setup so shaders are compiled before fading in.
        onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))}
      >
        {/* Drops resolution when frames slow down, raises it when there's headroom. */}
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.75))}
          onDecline={() => setDpr(1)}
          flipflops={3}
          onFallback={() => setDpr(1)}
        />
        <Scene still={still} particles={particles} />
      </Canvas>
    </div>
  );
}
