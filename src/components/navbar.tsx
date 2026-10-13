"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "@/lib/data";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close the mobile menu on Escape (link clicks close it directly).
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:pt-4">
            <nav
                aria-label="Primary"
                className={cn(
                    "glass mx-auto flex max-w-5xl items-center justify-between rounded-full border px-2 py-1.5 transition-shadow duration-300 sm:px-3",
                    scrolled ? "border-border-strong shadow-lg shadow-black/5" : "border-border",
                )}
            >
                <Link
                    href="/"
                    className="flex min-h-11 items-center gap-2 rounded-full px-3 font-mono text-sm font-semibold tracking-tight"
                    aria-label={`${profile.name}, home`}
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                        MZ
                    </span>
                    <span className="hidden sm:inline">moktadazaidi.me</span>
                </Link>

                <ul className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "relative flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-200",
                                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 -z-10 rounded-full bg-accent-soft ring-1 ring-accent/25"
                                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Link
                        href="/Contact"
                        className="hidden min-h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:brightness-110 active:scale-[0.97] md:inline-flex"
                    >
                        Let&apos;s talk
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-foreground transition hover:bg-accent-soft active:scale-95 md:hidden"
                    >
                        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="fixed inset-0 -z-10 bg-slate-950/40 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            onClick={() => setOpen(false)}
                            aria-hidden
                        />
                        <motion.div
                            id="mobile-menu"
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border bg-surface p-2 shadow-xl md:hidden"
                        >
                            <ul className="flex flex-col">
                                {navLinks.map((link, i) => {
                                    const active = isActive(link.href);
                                    return (
                                        <motion.li
                                            key={link.href}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.04 * i + 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                aria-current={active ? "page" : undefined}
                                                className={cn(
                                                    "flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-medium",
                                                    active ? "bg-accent-soft text-foreground" : "text-muted-foreground active:bg-surface-2",
                                                )}
                                            >
                                                {link.label}
                                                {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
                                            </Link>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
