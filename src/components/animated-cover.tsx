"use client";

import { useEffect, useRef } from "react";

// SMIL animations run on the main thread, so they compete with scrolling on phones.
// All covers share one passive scroll listener: everything pauses while the page is
// moving and only on-screen covers resume once scrolling settles.
type Cover = { svg: SVGSVGElement; visible: boolean };
const covers = new Set<Cover>();
let scrolling = false;
let settleTimer: ReturnType<typeof setTimeout> | undefined;

const sync = (c: Cover) => (c.visible && !scrolling ? c.svg.unpauseAnimations() : c.svg.pauseAnimations());

function onScroll() {
  if (!scrolling) {
    scrolling = true;
    covers.forEach(sync);
  }
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    scrolling = false;
    covers.forEach(sync);
  }, 160);
}

/**
 * Hosts an SMIL-animated SVG scene: plays only while mostly on screen and not
 * mid-scroll; reduced-motion users get a frozen "finished" frame instead of frame 0.
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
    const cover: Cover = { svg, visible: false };
    svg.pauseAnimations();
    if (covers.size === 0) window.addEventListener("scroll", onScroll, { passive: true });
    covers.add(cover);

    const io = new IntersectionObserver(
      ([entry]) => {
        cover.visible = entry.isIntersecting;
        sync(cover);
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
    return () => {
      io.disconnect();
      covers.delete(cover);
      if (covers.size === 0) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
