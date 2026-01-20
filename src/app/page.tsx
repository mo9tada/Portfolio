import { ExploreButton } from "@/components/ui/explore-button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-black px-4 pb-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_45%)]" aria-hidden />
      <div className="relative flex w-full max-w-2xl flex-col items-center gap-6 pt-32 text-center sm:pt-40">
        <p className="text-2xl font-semibold uppercase tracking-[0.3em] text-emerald-300 sm:text-4xl sm:tracking-[0.5em]">
          Zaidi Moktada
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
          Welcome to my portfolio!
        </h1>
        <p className="text-base font-normal text-white/80 sm:text-lg">
          Dive into my work and projects that showcase my skills and passion for web development.
        </p>
        <Link href="/Biography" className="w-full sm:w-auto">
          <ExploreButton className="w-full sm:w-auto" />
        </Link>
      </div>
    </div>
  );
}