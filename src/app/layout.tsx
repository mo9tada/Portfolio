import type { Metadata } from "next";
import { Inter, La_Belle_Aurore } from "next/font/google";
import "./globals.css";
import { Sparkles } from "@/components/ui/sparkles";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Navbar from "@/components/navbar";
const inter=Inter();


export const metadata: Metadata = {
  title: "Portfolio Next.js Starter",
  description: "Opinionated Next.js + Tailwind baseline prepared by GPT-5.1-Codex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      > 
        <Navbar/>
        {children}

      </body>
    </html>
  );
}
