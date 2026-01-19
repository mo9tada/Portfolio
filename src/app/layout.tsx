import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sparkles } from "@/components/ui/sparkles";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Navbar from "@/components/navbar";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });


export const metadata: Metadata = {
  title: "Portfolio Next.js Starter",
  description: "A portfolio template built with Next.js, Tailwind CSS, and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Navbar />
        <main className="pt-24 sm:pt-28">{children}</main>
      </body>
    </html>
  );
}
