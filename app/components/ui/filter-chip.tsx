"use client";

import { cn } from "@/app/lib/cn";
import { CheckIcon } from "../icons";

/**
 * Selection changes fill AND weight AND adds a check. Three cues, because fill
 * alone is not a state a colour-blind customer can read.
 *
 * The categories here are mutually exclusive, so this is a radio in a
 * radiogroup rather than an independent switch.
 */
export function FilterChip({
  selected,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { selected: boolean }) {
  return (
    <button
      {...props}
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        "touch-target inline-flex h-9 items-center gap-1.5 rounded-pill px-4 text-sm",
        "transition-colors duration-(--duration-fast) ease-standard",
        selected
          ? "bg-primary font-semibold text-primary-ink"
          : "border border-border-strong bg-surface font-medium text-ink-secondary hover:bg-surface-sunken hover:text-ink",
        className,
      )}
    >
      {selected && <CheckIcon className="size-4" />}
      {children}
    </button>
  );
}
