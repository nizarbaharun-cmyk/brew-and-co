import { cn } from "@/app/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-primary-ink hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-surface text-ink border border-border-strong hover:bg-surface-sunken active:bg-surface-muted",
  ghost: "text-ink hover:bg-surface-muted active:bg-surface-muted",
  accent: "bg-accent text-accent-ink hover:bg-accent-hover",
  danger: "bg-danger text-white hover:brightness-95",
};

const SIZE: Record<Size, string> = {
  // `sm` is 36px tall, so it carries `touch-target` to reach the 44px hit area.
  // The visual box may be smaller than the target; the target may not.
  sm: "h-9 px-4 text-sm gap-1.5 touch-target",
  md: "h-11 px-5 text-base gap-2",
  lg: "h-13 px-6 text-base gap-2",
};

const SHARED = [
  "inline-flex items-center justify-center rounded-pill font-semibold",
  "transition-[background-color,transform] duration-(--duration-fast) ease-standard",
  "active:scale-[0.98] motion-reduce:active:scale-100",
] as const;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  trailingIcon,
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        ...SHARED,
        "disabled:pointer-events-none disabled:bg-surface-muted disabled:text-ink-disabled",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className="ml-1 grid size-8 place-items-center rounded-pill bg-surface/15"
        >
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}

/**
 * A link that looks like a button. Navigation is an `<a>`, never a `<button>`
 * that calls router.push — see docs/design/03-component-specs.md, Button.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}) {
  return (
    <a {...props} className={cn(...SHARED, VARIANT[variant], SIZE[size], className)}>
      {icon}
      {children}
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className="ml-1 grid size-8 place-items-center rounded-pill bg-surface/15"
        >
          {trailingIcon}
        </span>
      ) : null}
    </a>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path
        d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
