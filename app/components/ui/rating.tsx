import { cn } from "@/app/lib/cn";
import { StarIcon } from "../icons";

/**
 * The stars are aria-hidden and the score is real text, so this reads as
 * "4,8 (128 ulasan)" rather than five separate star images.
 */
export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center gap-1.5 text-sm", className)}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            className={cn("size-4", i <= Math.round(value) ? "text-accent" : "text-border-strong")}
          />
        ))}
      </span>
      <span className="numeric font-semibold text-ink">
        {value.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </span>
      {count !== undefined && (
        <span className="numeric text-ink-muted">
          ({count.toLocaleString("id-ID")} ulasan)
        </span>
      )}
    </p>
  );
}
