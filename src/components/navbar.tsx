import Link from "next/link";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/Biography", label: "Biography" },
    { href: "/Projects", label: "Projects" },
    { href: "/Contact", label: "Contact" },
];

export default function Navbar() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-3">
            <nav
                aria-label="Primary"
                className="flex w-full max-w-4xl items-center justify-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200 backdrop-blur"
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full px-4 py-2 transition hover:bg-white/10"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    );
}