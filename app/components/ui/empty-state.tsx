import { cn } from "@/app/lib/cn";

/**
 * An invitation, not a dead end. `action` is required by the spec: an empty
 * state with nothing to do is a bug report waiting to happen.
 */
export function EmptyState({
  title,
  body,
  action,
  icon,
  className,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface-sunken p-8 text-center",
        className,
      )}
    >
      {icon && <div className="mb-3 flex justify-center text-ink-muted">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-(--measure-prose) text-base text-ink-secondary">{body}</p>
      <div className="mt-6 flex justify-center">{action}</div>
    </div>
  );
}
