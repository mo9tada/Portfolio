import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AmbientBackground from "@/components/ambient-background";
import MotionProvider from "@/components/motion-provider";
import { ScrollProgress } from "@/components/scroll-progress";
import { LoadingScreen } from "@/components/loading-screen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moktadazaidi.me"),
  title: {
    default: "Moktada Zaidi — Full-Stack Developer",
    template: "%s · Moktada Zaidi",
  },
  description:
    "Moktada Zaidi, full-stack developer in Tunis building management software and web applications with Next.js, Angular, Node.js and Python.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

// Runs before paint: applies the stored/system theme without a flash, and turns on
// the loading screen (only when JS runs, so a no-JS visit never sees it).
const themeScript = `(function(){document.documentElement.classList.add('loading');try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <LoadingScreen />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ScrollProgress />
          <AmbientBackground />
          <Navbar />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
