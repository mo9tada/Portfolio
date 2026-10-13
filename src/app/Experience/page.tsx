import type { Metadata } from "next";
import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { experiences } from "@/lib/data";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 sm:px-6 sm:pt-40">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          as="h1"
          eyebrow="Career"
          title={<>Professional <span className="text-gradient">experience</span></>}
          description="Internships, freelance missions, ventures and proposals."
        />
        <Reveal immediate delay={0.1}>
          <ButtonLink href="/Resume.pdf" target="_blank" rel="noreferrer" variant="secondary">
            <Download className="h-4 w-4" aria-hidden />
            Résumé (PDF)
          </ButtonLink>
        </Reveal>
      </div>
      <ExperienceTimeline items={experiences} />
    </div>
  );
}
