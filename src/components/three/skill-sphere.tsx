"use client";

import { useEffect, useRef } from "react";

/**
 * Rotating 3D tag cloud. Tags sit on a Fibonacci sphere; drag to spin it.
 * Positions are written straight to the DOM each frame (no React re-renders).
 * Decorative — the same skills are listed as text next to it.
 */
export function SkillSphere({ skills }: { skills: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const n = skills.length;
    const points = skills.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ax = 0.3, ay = 0.4; // current angles
    let vx = 0.0012, vy = 0.0035; // angular velocity per ms
    let dragging = false, lastX = 0, lastY = 0, lastT = 0;
    let raf = 0, prev = performance.now(), visible = true;

    const draw = () => {
      const radius = el.clientWidth / 2 - 48;
      const [sx, cx, sy, cy] = [Math.sin(ax), Math.cos(ax), Math.sin(ay), Math.cos(ay)];
      points.forEach((p, i) => {
        // rotate around Y then X
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const node = tags.current[i];
        if (!node) return;
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${0.6 + depth * 0.55})`;
        node.style.opacity = String(0.25 + depth * 0.75);
        node.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const tick = (t: number) => {
      const dt = Math.min(t - prev, 50);
      prev = t;
      if (!dragging) {
        ax += vx * dt;
        ay += vy * dt;
        // drift back to a gentle idle spin after a fling
        vx += (0.0012 - vx) * 0.02;
        vy += (0.0035 - vy) * 0.02;
      }
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      const dt = Math.max(now - lastT, 1);
      ay += dx * 0.008; ax -= dy * 0.008;
      vy = (dx * 0.008) / dt; vx = (-dy * 0.008) / dt;
      lastX = e.clientX; lastY = e.clientY; lastT = now;
      if (still) draw();
    };
    const onUp = () => { dragging = false; };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !still) { prev = performance.now(); raf = requestAnimationFrame(tick); }
      else cancelAnimationFrame(raf);
    });
    draw();
    if (!still) io.observe(el);
    const ro = new ResizeObserver(draw);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [skills]);

  return (
    <div
      ref={box}
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[460px] cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div
        className="absolute inset-[10%] rounded-full"
        style={{ background: "radial-gradient(circle, var(--glow-1), transparent 70%)" }}
      />
      <div className="absolute inset-[8%] rounded-full border border-dashed border-border-strong opacity-60" />
      {skills.map((s, i) => (
        <span
          key={s}
          ref={(n) => { tags.current[i] = n; }}
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border bg-surface/80 px-3 py-1 font-mono text-xs font-medium text-foreground shadow-sm will-change-transform sm:text-sm"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
