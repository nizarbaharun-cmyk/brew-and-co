import { cn } from "@/app/lib/cn";

type Variant = "accent" | "neutral" | "strong" | "success" | "danger" | "info";
type Size = "sm" | "md" | "lg";

const FILL: Record<Variant, string> = {
  accent: "bg-accent text-accent-ink",
  neutral: "bg-surface-muted text-ink-secondary",
  // For a label sitting on top of an image, where a tinted fill disappears.
  strong: "bg-surface-inverse text-ink-inverse",
  success: "bg-success-surface text-success-ink",
  danger: "bg-danger-surface text-danger-ink",
  info: "bg-info-surface text-info-ink",
};

const SHAPE: Record<Size, string> = {
  sm: "h-5 px-2 text-2xs",
  md: "h-6 px-2.5 text-xs",
  // The reference's circular price medallion. At most once per page.
  lg: "size-24 flex-col gap-0 px-2 text-center text-base leading-tight",
};

/**
 * Non-interactive status and metadata. A badge never carries an onClick — if it
 * filters, it is a FilterChip.
 */
export function Badge({
  variant = "neutral",
  size = "md",
  className,
  children,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-pill font-semibold",
        FILL[variant],
        SHAPE[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
