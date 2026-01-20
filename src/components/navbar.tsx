import Link from "next/link";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/Biography", label: "Biography" },
    { href: "/Projects", label: "Projects" },
    { href: "/Contact", label: "Contact" },
];

export default function Navbar() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 py-4 sm:py-5">
            <nav
                aria-label="Primary"
                className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-emerald-200 backdrop-blur-lg sm:gap-3 sm:px-4 sm:text-xs"
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full px-3 py-2 transition hover:bg-white/10 sm:px-4"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    );
}