"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";
import { profile } from "@/lib/data";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="card relative flex flex-col gap-4 overflow-hidden p-6 sm:flex-row sm:items-center">
      <div
        className="absolute inset-0 opacity-80"
        style={{ background: "radial-gradient(80% 100% at 0% 0%, var(--accent-soft), transparent 60%)" }}
        aria-hidden
      />
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Mail className="h-5 w-5" aria-hidden />
      </span>
      <div className="relative min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">Prefer email? Write me at</p>
        <a href={`mailto:${profile.email}`} className="block break-all font-mono text-base font-medium hover:text-accent sm:text-lg">
          {profile.email}
        </a>
      </div>
      <button
        type="button"
        onClick={copy}
        className="relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-sm font-medium transition-colors duration-200 hover:border-accent/50 active:scale-[0.97]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            {copied ? <Check className="h-4 w-4 text-accent" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
        <span className="sr-only" aria-live="polite">
          {copied ? "Email address copied to clipboard" : ""}
        </span>
      </button>
    </div>
  );
}
