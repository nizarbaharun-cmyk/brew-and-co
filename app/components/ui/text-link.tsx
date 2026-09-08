import Link from "next/link";
import { cn } from "@/app/lib/cn";

type Variant = "inline" | "quiet" | "nav";

const VARIANT: Record<Variant, string> = {
  inline: "text-ink underline decoration-border-strong underline-offset-4 hover:decoration-ink",
  quiet: "text-ink-secondary hover:text-ink",
  nav: "text-ink-secondary hover:text-ink",
};

export function TextLink({
  variant = "inline",
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      {...props}
      className={cn(
        "rounded-sm transition-colors duration-(--duration-fast) ease-standard",
        VARIANT[variant],
        className,
      )}
    />
  );
}

/** External links announce that they leave the site. */
export function ExternalLink({
  variant = "quiet",
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & { variant?: Variant }) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "rounded-sm transition-colors duration-(--duration-fast) ease-standard",
        VARIANT[variant],
        className,
      )}
    >
      {children}
      <span className="sr-only"> (buka di tab baru)</span>
    </a>
  );
}
