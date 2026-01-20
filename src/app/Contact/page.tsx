import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Mail } from "lucide-react";

type SocialLink = {
    label: string;
    handle: string;
    href: string;
    icon: typeof Facebook;
    accent: string;
};

const socials: SocialLink[] = [
    {
        label: "Facebook",
        handle: "Moktada Zaidi",
        href: "https://www.facebook.com/moktada.zaidi/",
        icon: Facebook,
        accent: "from-blue-500/50 to-blue-300/30",
    },
    {
        label: "LinkedIn",
        handle: "in/moktada_zaidi",
        href: "https://www.linkedin.com/in/moktada-zaidi-677b94313/",
        icon: Linkedin,
        accent: "from-sky-500/50 to-cyan-300/30",
    },
    {
        label: "GitHub",
        handle: "github.com/mo9tada",
        href: "https://github.com/mo9tada",
        icon: Github,
        accent: "from-slate-700/70 to-slate-500/40",
    },
    {
        label: "Email",
        handle: "moktadazaidi@gmail.com",
        href: "mailto:moktadazaidi@gmail.com",
        icon: Mail,
        accent: "from-emerald-500/50 to-lime-300/30",
    },
];

export default function ContactPage() {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-black px-4 pb-16 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_45%)]" aria-hidden />
            <div className="relative flex w-full max-w-4xl flex-col items-center gap-8 pt-32 text-center sm:pt-40">
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.6em] text-emerald-300">Reach Out</p>
                    <p className="text-4xl font-bold uppercase tracking-[0.3em] sm:text-5xl">Get in Touch</p>
                    <p className="text-base font-normal text-white/80 sm:text-lg">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                        Drop a note on any platform below and let's build together.
                    </p>
                </div>

                <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    {socials.map((social) => {
                        const Icon = social.icon;
                        return (
                            <Link
                                key={social.label}
                                href={social.href}
                                target={social.href.startsWith("http") ? "_blank" : undefined}
                                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur transition hover:border-white/40"
                            >
                                <div
                                    className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${social.accent}`}
                                >
                                    <Icon className="h-6 w-6 text-white" aria-hidden />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">{social.label}</p>
                                    <p className="text-lg font-semibold">{social.handle}</p>
                                    <p className="text-xs text-white/60 group-hover:text-white/80">Tap to open</p>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </div>
    );
}