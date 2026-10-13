import type { CSSProperties, HTMLAttributes, LiHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type RevealOptions = {
  /** Stagger. Seconds for `immediate`; otherwise shifts the scroll range slightly. */
  delay?: number;
  /** Starting offset in px. */
  y?: number;
  /** Animate on first paint (above-the-fold) instead of on scroll. */
  immediate?: boolean;
};

// CSS-only (see .enter / .reveal in globals.css): server-rendered, visible without
// JavaScript, and no IntersectionObservers — keeps first load and scrolling light.
function revealProps({ delay = 0, y = 20, immediate = false }: RevealOptions, className?: string, style?: CSSProperties) {
  const vars: Record<`--${string}`, string | number> = immediate
    ? { "--enter-y": `${y}px`, "--enter-delay": `${delay}s` }
    : { "--enter-y": `${y}px`, "--reveal-delay": delay };
  return {
    className: cn(immediate ? "enter" : "reveal", className),
    style: { ...vars, ...style } as CSSProperties,
  };
}

export function Reveal({ delay, y, immediate, className, style, children, ...props }: HTMLAttributes<HTMLDivElement> & RevealOptions) {
  return (
    <div {...props} {...revealProps({ delay, y, immediate }, className, style)}>
      {children}
    </div>
  );
}

/** List-item variant of Reveal, for use directly inside <ul>/<ol>. */
export function RevealItem({ delay, y, immediate, className, style, children, ...props }: LiHTMLAttributes<HTMLLIElement> & RevealOptions) {
  return (
    <li {...props} {...revealProps({ delay, y, immediate }, className, style)}>
      {children}
    </li>
  );
}
