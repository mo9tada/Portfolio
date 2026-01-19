import { ExploreButton } from "@/components/ui/explore-button";
import Image from "next/image";
import Link from "next/link";

type Language = {
  image: string;
  name: string;
  stack: string;
  years: string;
  blurb: string;
};

type Highlight = {
  label: string;
  value: string;
  detail: string;
};

const languages: Language[] = [
  { image: "/images/typescript.svg", name: "TypeScript", stack: "Next.js · React", years: "1+ years", blurb: "Ship modern web apps with App Router + server actions." },
  { image: "/images/python.svg", name: "Python", stack: "FastAPI · Data", years: "3 years", blurb: "Automation scripts, APIs, and ML prototypes." },
  { image: "/images/java.svg", name: "Java", stack: "Spring", years: "1+ years", blurb: "Tooling and interactive experiences." },
  { image: "/images/cpp.svg", name: "C++", stack: "Algorithms", years: "3 years", blurb: "Competitive programming and performance-critical apps." },
];

const highlights: Highlight[] = [
  { label: "Based in", value: "Tunis, TN", detail: "UTC+1" },
  { label: "Current Focus", value: "Web Engineering", detail: "Next.js · React 19" },
  { label: "Collabs", value: "Available", detail: "Product + Full Explanation " },
];

export default function BiographyPage() {
  return (
    <div className="relative min-h-screen w-full bg-black px-4 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.4),_transparent_45%)]" aria-hidden />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <h1 className="p-4 sm:text-5xl font-bold uppercase tracking-[0.5em] text-emerald-300">Zaidi Moktada</h1>
          <p className="text-base text-white/80 sm:text-lg">
            Tunisian software engineering student passionate about crafting expressive user experiences and resilient
            systems. I explore the intersection of interaction design, AI-assisted tooling, and robust cloud-native
            platforms.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <ExploreButton className="w-full sm:w-auto">Download Résumé</ExploreButton>
            <Link
              href="/Contact"
              className="rounded-full border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-white/10"
            >
              Contact
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              <p className="text-sm text-white/70">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-emerald-300">Toolbox</p>
            <h2 className="text-2xl font-semibold">Languages I build with</h2>
            <p className="text-sm text-white/70">
              From data-heavy backends to pixel-perfect frontends, these stacks form the backbone of my prototyping and
              production work.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {languages.map((lang) => (
              <article
                key={lang.name}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <Image
                    src={lang.image}
                    alt={`${lang.name} badge`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.4em] text-emerald-300">{lang.years}</p>
                <h3 className="mt-1 text-xl font-semibold">{lang.name}</h3>
                <p className="text-sm text-white/70">{lang.stack}</p>
                <p className="mt-3 text-sm text-white/60">{lang.blurb}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}