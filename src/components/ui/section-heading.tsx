import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("flex max-w-2xl flex-col gap-3", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <Tag
        className={cn(
          "font-semibold tracking-tight text-balance",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Tag>
      {description && <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>}
    </Reveal>
  );
}
