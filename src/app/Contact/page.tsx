import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { RevealItem, Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { socials } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 pt-32 sm:px-6 sm:pt-40">
            <SectionHeading
                as="h1"
                eyebrow="Reach out"
                title={<>Let&apos;s <span className="text-gradient">build together</span></>}
                description="Based in Tunis and open to full-stack roles, freelance missions and new projects. Drop a note below or reach me on any platform."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                <div className="flex flex-col gap-4">
                    <Reveal immediate delay={0.1}>
                        <CopyEmail />
                    </Reveal>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {socials
                            .filter((s) => s.label !== "Email")
                            .map(({ label, handle, href, icon: Icon }, i) => (
                                <RevealItem key={label} delay={0.05 * (i + 1)}>
                                    <a
                                        href={href}
                                        target={href.startsWith("http") ? "_blank" : undefined}
                                        rel={href.startsWith("http") ? "noreferrer" : undefined}
                                        className="card group flex min-h-20 items-center gap-4 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40"
                                    >
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform duration-200 group-hover:scale-105">
                                            <Icon className="h-5 w-5" aria-hidden />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold">{label}</span>
                                            <span className="block truncate font-mono text-xs text-muted-foreground">{handle}</span>
                                        </span>
                                        <ArrowUpRight
                                            className="h-4 w-4 shrink-0 text-subtle-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                                            aria-hidden
                                        />
                                        {href.startsWith("http") && <span className="sr-only">(opens in a new tab)</span>}
                                    </a>
                                </RevealItem>
                            ))}
                    </ul>
                </div>

                <Reveal immediate delay={0.15}>
                    <ContactForm />
                </Reveal>
            </div>
        </div>
    );
}
