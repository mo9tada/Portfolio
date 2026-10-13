import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Typewriter } from "@/components/ui/typewriter";
import { SectionHeading } from "@/components/ui/section-heading";
import { CountUp } from "@/components/ui/count-up";
import { ProjectCard } from "@/components/project-card";
import { HeroVisual } from "@/components/three/hero-visual";
import { allSkills, experiences, profile, projects, spokenLanguages } from "@/lib/data";

const stats = [
  { value: experiences.filter((e) => !e.proposal).length, suffix: "", label: "Roles & ventures" },
  { value: projects.length, suffix: "", label: "Shipped projects" },
  { value: allSkills.length, suffix: "+", label: "Technologies" },
  { value: spokenLanguages.filter((l) => l.level === "Fluent").length, suffix: "", label: "Fluent languages" },
];

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid min-h-dvh max-w-6xl items-center gap-6 px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="relative z-10 flex flex-col items-start gap-6">
          <Reveal className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="status-dot relative h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              Available for new projects
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {profile.location}
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              <span className="block text-muted-foreground text-2xl font-medium tracking-normal sm:text-3xl">Hi, I&apos;m</span>
              <span className="text-gradient">{profile.name}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1} className="min-h-8 font-mono text-lg text-muted-foreground sm:text-xl">
            <span className="text-accent">&gt;</span> <Typewriter words={profile.roles} />
          </Reveal>

          <Reveal delay={0.15}>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I build management software and web applications — from financial analytics with AI at Vermeg to
              management platforms and production infrastructure. Autonomous from requirements to deployment.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/Projects" arrow>
              View my work
            </ButtonLink>
            <ButtonLink href="/Resume.pdf" target="_blank" rel="noreferrer" variant="secondary">
              <Download className="h-4 w-4" aria-hidden />
              Résumé
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={0} className="-mt-4 w-full lg:mt-0">
          <HeroVisual />
        </Reveal>
      </section>

      {/* Stats */}
      <section aria-label="At a glance" className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-4">
          {stats.map((s, i) => (
            <RevealItem
              key={s.label}
              delay={i * 0.06}
              className="bg-surface px-5 py-6 text-center"
            >
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </RevealItem>
          ))}
        </ul>
      </section>

      {/* Experience preview */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 sm:pt-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Experience"
            title="Where I've been building"
            description="From banking and insurance to agri-food and community platforms — real products, real users."
          />
          <Reveal>
            <ButtonLink href="/Experience" variant="secondary" arrow>
              Full timeline
            </ButtonLink>
          </Reveal>
        </div>
        <ul className="mt-10 divide-y overflow-hidden rounded-2xl border bg-surface/60 backdrop-blur">
          {experiences.slice(0, 4).map((exp, i) => (
            <RevealItem key={exp.company + exp.period} delay={i * 0.05}>
              <Link
                href="/Experience"
                className="group grid gap-1 px-5 py-5 transition-colors duration-200 hover:bg-accent-soft sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-6 sm:px-6"
              >
                <span className="font-mono text-xs text-subtle-foreground">{exp.period}</span>
                <span>
                  <span className="block font-semibold tracking-tight">
                    {exp.role} · <span className="text-accent">{exp.company}</span>
                  </span>
                  <span className="block text-sm text-muted-foreground">{exp.project ?? exp.points[0]}</span>
                </span>
                <ArrowRight
                  className="hidden h-4 w-4 text-subtle-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent sm:block"
                  aria-hidden
                />
              </Link>
            </RevealItem>
          ))}
        </ul>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 sm:pt-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Things I've built"
            description="Financial AI, computer vision and management platforms."
          />
          <Reveal>
            <ButtonLink href="/Projects" variant="secondary" arrow>
              All projects
            </ButtonLink>
          </Reveal>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <RevealItem key={project.name} delay={i * 0.06} className="h-full">
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 sm:pt-32">
        <Reveal>
          <div className="card relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              className="absolute inset-0 opacity-70"
              style={{ background: "radial-gradient(60% 80% at 50% 0%, var(--accent-soft), transparent 70%)" }}
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-5">
              <p className="eyebrow">What&apos;s next</p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Need a web app or management platform? Let&apos;s build it.
              </h2>
              <p className="max-w-lg text-muted-foreground">
                From requirements analysis to production hosting, I can take your project end to end.
              </p>
              <ButtonLink href="/Contact" arrow className="mt-2">
                Get in touch
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
