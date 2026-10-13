"use client";

import { useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!String(data.get("name") ?? "").trim()) errors.name = "Please tell me your name.";
  const email = String(data.get("email") ?? "").trim();
  if (!email) errors.email = "Please enter your email so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That email doesn't look right — check for typos.";
  if (String(data.get("message") ?? "").trim().length < 10) errors.message = "Add a few more words (at least 10 characters).";
  return errors;
}

/** No backend: on submit, opens the visitor's mail client with the message pre-filled. */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const subject = `Portfolio inquiry from ${data.get("name")}`;
    const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  // Re-validate a single field on blur, but only once it has an error showing.
  const onBlur = (field: keyof Errors) => {
    if (!errors[field] || !formRef.current) return;
    const next = validate(new FormData(formRef.current));
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  const fieldClass = (err?: string) =>
    cn(
      "w-full rounded-xl border bg-surface-2/60 px-4 py-3 text-base text-foreground placeholder:text-subtle-foreground transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
      err && "border-red-500/70 focus:border-red-500 focus:ring-red-500/20",
    );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 p-6 sm:p-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Send a message</h2>
        <p className="mt-1 text-sm text-muted-foreground">This opens your email app with everything filled in.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" className={fieldClass(errors.name)} onBlur={() => onBlur("name")}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" className={fieldClass(errors.email)} onBlur={() => onBlur("email")}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        </Field>
      </div>

      <Field id="message" label="Message" error={errors.message}>
        <textarea id="message" name="message" rows={5} className={cn(fieldClass(errors.message), "resize-y")} onBlur={() => onBlur("message")}
          placeholder="Tell me about your project or idea…"
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
      </Field>

      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {sent ? "Your email app should open now. Thanks for reaching out!" : ""}
        </p>
        <button
          type="submit"
          className="group inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-[0_8px_30px_-8px_var(--accent)] transition-all duration-200 hover:brightness-110 active:scale-[0.97] sm:w-auto"
        >
          Send message
          <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} <span className="text-red-500" aria-hidden>*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
