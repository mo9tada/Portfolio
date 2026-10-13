"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

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

/** Lightweight stand-in shown until WebGL is ready (and kept if WebGL is unavailable). */
function Placeholder({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}
      aria-hidden
    >
      <div
        className="h-[44%] w-[44%] rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #6ee7b7, #059669 45%, #064e3b 80%)",
          boxShadow: "0 0 80px -10px var(--glow-1), inset -20px -30px 60px rgb(0 0 0 / 0.35)",
        }}
      />
    </div>
  );
}

export function HeroVisual() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  const [mountScene, setMountScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // Defer the WebGL bundle until the browser is idle so text paints first.
  useEffect(() => {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return;
    const start = () => setMountScene(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  return (
    <div className="pointer-events-none relative aspect-square w-full max-w-[580px] justify-self-center" aria-hidden>
      <div
        className="absolute inset-[10%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--glow-1), transparent 70%)" }}
      />
      <Placeholder hidden={sceneReady} />
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
