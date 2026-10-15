"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { CssOrb } from "./css-orb";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const chips = [
  { label: "Next.js", className: "left-[4%] top-[14%]", depth: 28, delay: 0 },
  { label: "Angular", className: "right-[2%] top-[22%]", depth: -22, delay: -1.6 },
  { label: "Python · RAG", className: "left-[8%] bottom-[16%]", depth: -34, delay: -3.1 },
  { label: "PostgreSQL", className: "right-[6%] bottom-[10%]", depth: 40, delay: -0.8 },
];

function Chip({ label, className, depth, delay, mx, my }: (typeof chips)[number] & { mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.span
      style={{ x, y, animationDelay: `${delay}s` }}
      className={`hero-chip glass absolute rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium text-foreground shadow-lg sm:px-3 sm:py-1.5 sm:text-xs ${className}`}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent" aria-hidden />
      {label}
    </motion.span>
  );
}

/**
 * The WebGL scene (three.js) runs on phones and desktops alike. Only devices that would
 * struggle keep the CSS orb (already painted from the server HTML): data saver, reduced
 * motion, under 4 GB of RAM or 4 cores, or WebGL that falls back to software rendering.
 */
function canRunWebGL() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  // iOS reports at most 2 cores on every device (a WebKit anti-fingerprinting cap), so the
  // core count is only meaningful elsewhere. iPadOS presents itself as a Mac with touch.
  const ios = /iP(hone|od|ad)/.test(nav.userAgent) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  if (!ios && (nav.hardwareConcurrency ?? 8) < 4) return false;
  const canvas = document.createElement("canvas");
  const opts: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
  const gl: WebGLRenderingContext | WebGL2RenderingContext | null =
    canvas.getContext("webgl2", opts) ?? canvas.getContext("webgl", opts);
  if (!gl) return false;
  // Release the probe context now: mobile browsers cap how many can be alive at once.
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
}

/** If the 3D bundle fails to load or WebGL errors out, drop back to the CSS orb. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// The device check runs once per page; the server can't know it, so it renders "unknown"
// (null) and hydration picks up the real answer without a mismatch.
let webglSupport: boolean | undefined;
const getWebGLSupport = () => (webglSupport ??= canRunWebGL());
const getUnknown = () => null;
const subscribeNever = () => () => {};

export function HeroVisual() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  const capable = useSyncExternalStore(subscribeNever, getWebGLSupport, getUnknown);
  const [mountScene, setMountScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [orbGone, setOrbGone] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  // Read by the intro loader (loading-screen.tsx): it holds the reveal while this is
  // "pending", so the 3D is fully rendered by the time the page appears.
  const scene = capable === false || failed ? "off" : sceneReady ? "ready" : "pending";

  // Pause the CSS orb's animations while the hero is scrolled away.
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  // While the intro loader covers the page, start the WebGL scene straight away so it is
  // fully rendered when the loader lifts. Otherwise (client-side navigation back to the
  // home page) wait for idle time so the text paints first.
  useEffect(() => {
    if (!capable) return;
    const start = () => setMountScene(true);
    if (document.documentElement.classList.contains("loading")) {
      start();
      return;
    }
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 600);
    return () => clearTimeout(id);
  }, [capable]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  const fallBack = () => {
    setFailed(true);
    setMountScene(false);
    setSceneReady(false);
    setOrbGone(false);
  };
  const showScene = scene === "ready";

  return (
    <div
      ref={wrap}
      data-scene={scene}
      className="pointer-events-none relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[580px]"
      aria-hidden
    >
      {/* Unmounted once faded out, so its CSS animations stop running behind the canvas. */}
      {!orbGone && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${showScene ? "opacity-0" : "opacity-100"}`}
          onTransitionEnd={() => showScene && setOrbGone(true)}
        >
          <CssOrb paused={offscreen} />
        </div>
      )}
      {mountScene && !failed && (
        <SceneBoundary onError={fallBack}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={showScene ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroScene onReady={() => setSceneReady(true)} />
          </motion.div>
        </SceneBoundary>
      )}
      {chips.map((c) => (
        <Chip key={c.label} {...c} mx={mx} my={my} />
      ))}
    </div>
  );
}
