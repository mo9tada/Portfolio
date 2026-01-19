import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ExploreButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ExploreButton({ className, children = "Start Exploring", ...props }: ExploreButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-10 py-4 text-xs font-semibold uppercase tracking-[0.4em] text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100" />
      <span className="absolute inset-0 rounded-full border border-white/20 opacity-60 group-hover:opacity-100" />
      <span className="relative flex items-center gap-3">
        {children}
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </span>
      <span className="absolute inset-0 rounded-full blur-3xl bg-emerald-400/25" aria-hidden />
    </button>
  );
}
