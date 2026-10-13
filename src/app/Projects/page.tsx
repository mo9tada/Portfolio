import type { Metadata } from "next";
import { Github } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectGrid } from "@/components/project-grid";
import { profile } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 sm:px-6 sm:pt-40">
      <SectionHeading
        as="h1"
        eyebrow="Portfolio"
        title={<>My <span className="text-gradient">projects</span></>}
        description="Financial AI, computer vision, management platforms and e-commerce. Filter by category to explore."
      />
      <ProjectGrid />
      <Reveal className="mt-14 flex flex-col items-center gap-4 text-center">
        <p className="text-muted-foreground">More experiments and source code live on GitHub.</p>
        <ButtonLink href={profile.github} target="_blank" rel="noreferrer" variant="secondary">
          <Github className="h-4 w-4" aria-hidden />
          github.com/mo9tada
        </ButtonLink>
      </Reveal>
    </div>
  );
}
