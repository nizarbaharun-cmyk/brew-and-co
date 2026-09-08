import { cn } from "@/app/lib/cn";

const SHARED = [
  "inline-grid shrink-0 place-items-center rounded-pill text-ink",
  "transition-colors duration-(--duration-fast) ease-standard",
  "hover:bg-surface-muted active:bg-surface-muted",
] as const;

const BOX = { sm: "size-9", md: "size-11" } as const;

/**
 * `label` is required, not optional. An icon button without an accessible name
 * is unusable with a screen reader, and a required prop turns that from a
 * review comment into a type error.
 */
export function IconButton({
  label,
  size = "md",
  variant = "ghost",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "aria-label"> & {
  label: string;
  size?: "sm" | "md";
  variant?: "ghost" | "secondary";
}) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      aria-label={label}
      className={cn(
        ...SHARED,
        "disabled:pointer-events-none disabled:text-ink-disabled",
        variant === "secondary" && "border border-border-strong bg-surface",
        BOX[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

/** The same shape, for navigation. An icon that goes somewhere is a link. */
export function IconLink({
  label,
  size = "md",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"a">, "aria-label"> & {
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <a {...props} aria-label={label} className={cn(...SHARED, BOX[size], className)}>
      {children}
    </a>
  );
}
