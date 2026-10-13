import type { Metadata } from "next";
import { Award, Download, GraduationCap, Languages, Mail, MapPin, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { SkillSphere } from "@/components/three/skill-sphere";
import { allSkills, certifications, education, profile, qualities, skillGroups, spokenLanguages } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

export default function BiographyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 sm:px-6 sm:pt-40">
      {/* Intro */}
      <header className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <SectionHeading
          as="h1"
          eyebrow="About me"
          title={<>From analysis to <span className="text-gradient">production</span>.</>}
          description={profile.summary}
        />
        <Reveal immediate delay={0.1} className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-surface/70 px-3 py-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-surface/70 px-3 py-1.5 text-xs text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden /> B.Sc. Computer Science, 2026
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/Resume.pdf" target="_blank" rel="noreferrer" download>
              <Download className="h-4 w-4" aria-hidden />
              Download résumé
            </ButtonLink>
            <ButtonLink href="/Contact" variant="secondary">
              <Mail className="h-4 w-4" aria-hidden />
              Contact
            </ButtonLink>
          </div>
        </Reveal>
      </header>

      {/* Skills */}
      <section className="pt-24 sm:pt-32">
        <SectionHeading
          eyebrow="Toolbox"
          title="Skills & stack"
          description="Full-stack across web, data and mobile — drag the sphere to spin it."
        />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal y={0}>
            <SkillSphere skills={allSkills} />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((g, i) => (
              <RevealItem key={g.label} delay={i * 0.06} className="h-full">
                <TiltCard className="p-5">
                  <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-accent [transform:translateZ(20px)]">
                    {g.label}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2 [transform:translateZ(30px)]">
                    {g.items.map((item) => (
                      <li key={item} className="rounded-full border bg-surface-2 px-2.5 py-1 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </RevealItem>
            ))}
          </ul>
        </div>
      </section>

      {/* Education, languages, certifications */}
      <section className="pt-24 sm:pt-32">
        <SectionHeading eyebrow="Background" title="Education & credentials" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Reveal className="h-full">
            <TiltCard className="flex flex-col p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent [transform:translateZ(40px)]">
                <GraduationCap className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-5 font-mono text-xs text-subtle-foreground">{education.period}</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">{education.degree}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{education.school}</p>
              <p className="text-sm text-subtle-foreground">{education.university}</p>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <TiltCard className="flex flex-col p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent [transform:translateZ(40px)]">
                <Languages className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">Languages</h3>
              <ul className="mt-3 space-y-3">
                {spokenLanguages.map((l) => (
                  <li key={l.name} className="flex items-center justify-between gap-4 text-sm">
                    <span>{l.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="flex gap-1" aria-hidden>
                        {[1, 2, 3].map((n) => (
                          <span key={n} className={`h-1.5 w-5 rounded-full ${n <= l.value ? "bg-accent" : "bg-surface-2"}`} />
                        ))}
                      </span>
                      <span className="w-12 text-right font-mono text-xs text-muted-foreground">{l.level}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.12} className="h-full md:col-span-2 lg:col-span-1">
            <TiltCard className="flex flex-col p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent [transform:translateZ(40px)]">
                <Award className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">Certifications</h3>
              <ul className="mt-3 space-y-3">
                {certifications.map((c) => (
                  <li key={c.name} className="text-sm">
                    <span className="block font-medium">{c.name}</span>
                    <span className="block font-mono text-xs text-subtle-foreground">{c.issuer}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </Reveal>
        </div>

        <Reveal className="mt-6">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-accent" aria-hidden /> Soft skills
            </span>
            <ul className="flex flex-wrap gap-2">
              {qualities.map((q) => (
                <li key={q} className="rounded-full border bg-surface-2 px-3 py-1 text-sm text-muted-foreground">
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
