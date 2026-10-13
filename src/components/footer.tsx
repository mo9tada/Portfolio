import Link from "next/link";
import { navLinks, profile, socials } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-sm font-semibold">moktadazaidi.me</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Built with Next.js &amp; Tailwind · © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="py-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <ul className="flex gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border text-muted-foreground transition-colors duration-200 hover:border-accent/40 hover:text-accent"
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
