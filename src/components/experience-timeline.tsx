"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Briefcase, Lightbulb } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import type { Experience } from "@/lib/data";
import { cn } from "@/lib/utils";

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <TiltCard max={5} className="p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2 [transform:translateZ(24px)]">
        <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium text-accent">{exp.period}</span>
        {exp.current && (
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            <span className="status-dot relative h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Current
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight [transform:translateZ(30px)]">
        {exp.role} <span className="text-muted-foreground">·</span> <span className="text-accent">{exp.company}</span>
      </h3>
      <p className="mt-1 text-sm text-subtle-foreground">
        {[exp.sector, exp.type].filter(Boolean).join(" · ")}
      </p>
      {exp.project && <p className="mt-4 text-sm font-medium italic text-foreground/90">{exp.project}</p>}
      <ul className="mt-3 space-y-2">
        {exp.points.map((pt) => (
          <li key={pt} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {pt}
          </li>
        ))}
      </ul>
      {exp.stack && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Stack">
          {exp.stack.map((s) => (
            <li key={s} className="rounded-full border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              {s}
            </li>
          ))}
        </ul>
      )}
    </TiltCard>
  );
}

/** Vertical timeline; the rail fills as you scroll and cards swing in from a 3D angle. */
export function ExperienceTimeline({ items }: { items: Experience[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative mt-12">
      {/* rail */}
      <div className="absolute bottom-0 left-[19px] top-0 w-px bg-border-strong md:left-1/2" aria-hidden>
        <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top bg-gradient-to-b from-accent to-cyan-400" />
      </div>

      {items.map((exp, i) => {
        const right = i % 2 === 1;
        return (
          <li key={exp.company + exp.period} className="relative grid pb-10 pl-14 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0">
            {/* node */}
            <div className="absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-background text-accent shadow-[0_0_0_6px_var(--background)] md:left-1/2 md:-translate-x-1/2">
              {exp.proposal ? <Lightbulb className="h-4 w-4" aria-hidden /> : <Briefcase className="h-4 w-4" aria-hidden />}
            </div>
            <motion.div
              className={cn("[perspective:1200px]", right ? "md:col-start-2" : "md:col-start-1")}
              initial={{ opacity: 0, rotateY: right ? -28 : 28, rotateX: 10, x: right ? 40 : -40 }}
              whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <ExperienceCard exp={exp} />
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
