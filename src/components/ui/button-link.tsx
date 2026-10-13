import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
  arrow?: boolean;
};

export function ButtonLink({ variant = "primary", arrow = false, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-200 active:scale-[0.97]",
        variant === "primary"
          ? "bg-accent text-accent-foreground shadow-[0_8px_30px_-8px_var(--accent)] hover:brightness-110"
          : "border border-border-strong bg-surface/80 text-foreground hover:border-accent/50 hover:bg-accent-soft",
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />}
    </Link>
  );
}
