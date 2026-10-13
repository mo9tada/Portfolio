"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { CssOrb } from "./css-orb";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const chips = [
  { label: "Next.js", className: "left-[4%] top-[14%]", depth: 28 },
  { label: "Angular", className: "right-[2%] top-[22%]", depth: -22 },
  { label: "Python · RAG", className: "left-[8%] bottom-[16%]", depth: -34 },
  { label: "PostgreSQL", className: "right-[6%] bottom-[10%]", depth: 40 },
];

function Chip({ label, className, depth, mx, my }: (typeof chips)[number] & { mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.span
      style={{ x, y }}
      className={`glass absolute hidden rounded-full border px-3 py-1.5 font-mono text-xs font-medium text-foreground shadow-lg sm:block ${className}`}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent" aria-hidden />
      {label}
    </motion.span>
  );
}

/**
 * The WebGL scene (~three.js) only loads on devices that can run it smoothly:
 * large screen with a mouse, ≥4 cores, ≥4 GB RAM, no data saver, no reduced motion.
 * Everyone else keeps the CSS orb, which is already painted from the server HTML.
 */
function canRunWebGL() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) return false;
  const canvas = document.createElement("canvas");
  return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

export function HeroVisual() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  const [mountScene, setMountScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [orbGone, setOrbGone] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // Pause the CSS orb's animations while the hero is scrolled away.
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  // Defer the WebGL bundle until the browser is idle so text paints first.
  useEffect(() => {
    if (!canRunWebGL()) return;
    const start = () => setMountScene(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 600);
    return () => clearTimeout(id);
  }, []);

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

  return (
    <div ref={wrap} className="pointer-events-none relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[580px]" aria-hidden>
      {/* Unmounted once faded out, so its CSS animations stop running behind the canvas. */}
      {!orbGone && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${sceneReady ? "opacity-0" : "opacity-100"}`}
          onTransitionEnd={() => sceneReady && setOrbGone(true)}
        >
          <CssOrb paused={offscreen} />
        </div>
      )}
      {mountScene && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={sceneReady ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroScene onReady={() => setSceneReady(true)} />
        </motion.div>
      )}
      {chips.map((c) => (
        <Chip key={c.label} {...c} mx={mx} my={my} />
      ))}
    </div>
  );
}
