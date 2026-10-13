"use client";

import { useEffect, useRef } from "react";

/**
 * Hosts an SMIL-animated SVG scene: runs it only while on screen, and for
 * reduced-motion users freezes it on a "finished" frame instead of frame 0.
 */
export function AnimatedCover({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svg.setCurrentTime(2.5);
      svg.pauseAnimations();
      return;
    }
    svg.pauseAnimations();
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()), {
      rootMargin: "100px",
    });
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
