import { TiltCard } from "@/components/ui/tilt-card";
import { AnimatedCover } from "@/components/animated-cover";
import { projectVisuals } from "@/components/project-visuals";
import type { Project } from "@/lib/data";

function Cover({ project }: { project: Project }) {
  const Icon = project.icon;
  const Visual = projectVisuals[project.visual];
  return (
    // Outer layer keeps preserve-3d so the icon tile can float; the clipped scene layer sits inside.
    <div className="relative [transform-style:preserve-3d]">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-t-2xl border-b"
        style={{
          color: project.hue,
          background: `radial-gradient(80% 100% at 20% 0%, color-mix(in srgb, ${project.hue} 22%, transparent), transparent 70%), radial-gradient(70% 90% at 100% 100%, color-mix(in srgb, ${project.hue} 14%, transparent), transparent 70%), var(--surface-2)`,
        }}
      >
        <AnimatedCover className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <Visual />
        </AnimatedCover>
      </div>
      <div
        className="absolute bottom-0 left-5 flex h-11 w-11 translate-y-1/2 items-center justify-center rounded-xl border border-white/20 text-white shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateY(50%)_translateZ(50px)]"
        style={{ background: project.hue, boxShadow: `0 10px 30px -8px ${project.hue}` }}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <span className="absolute right-3 top-3 rounded-full bg-slate-950/70 px-2.5 py-1 font-mono text-[11px] font-medium text-white backdrop-blur">
        {project.category}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="flex flex-col">
      <Cover project={project} />
      <div className="flex flex-1 flex-col gap-3 p-5 pt-9 sm:p-6 sm:pt-10 [transform:translateZ(20px)]">
        <div>
          <p className="font-mono text-[11px] text-subtle-foreground">{project.context}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{project.name}</h3>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{project.blurb}</p>
        <ul className="flex flex-wrap gap-2 pt-1" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  );
}
