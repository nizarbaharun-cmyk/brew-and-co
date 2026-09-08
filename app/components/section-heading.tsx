/**
 * No eyebrow label above the heading — the heading is already the label. The
 * `as` prop exists so heading levels stay sequential; a section inside a
 * section uses as="h3".
 */
export function SectionHeading({
  title,
  description,
  action,
  as: As = "h2",
  id,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  as?: "h2" | "h3";
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <As id={id} className="font-display text-3xl font-semibold text-balance type-section">
          {title}
        </As>
        {description && (
          <p className="max-w-(--measure-prose) text-base text-pretty text-ink-secondary">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
