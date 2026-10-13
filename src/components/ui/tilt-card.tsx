"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
};

/**
 * Card that tilts in 3D toward the pointer, with a moving glare and accent spotlight.
 * Children can pop forward with `style={{ transform: "translateZ(40px)" }}`.
 * Mouse-only: touch devices get a flat card.
 */
export function TiltCard({ children, className, max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  // Accent spotlight + white glare in one overlay. (Not a ::before with isolation —
  // isolation/overflow would flatten preserve-3d and kill the translateZ depth.)
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, var(--accent-soft), transparent 45%), radial-gradient(300px circle at ${gx} ${gy}, rgb(255 255 255 / 0.08), transparent 40%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="h-full [perspective:1100px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("card group relative h-full transition-[border-color] duration-300 hover:border-accent/30", className)}
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}
