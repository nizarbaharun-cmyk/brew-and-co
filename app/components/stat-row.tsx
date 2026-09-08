/**
 * <dl> with flex-col-reverse puts the figure above the label visually while
 * keeping label-then-value in the DOM, which is the order a screen reader
 * needs. Do not swap the elements to fix the visual order.
 */
export function StatRow({
  stats,
}: {
  stats: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <dl className="grid grid-cols-3 gap-4 md:flex md:gap-12">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse gap-1">
          <dt className="text-sm text-ink-secondary">{stat.label}</dt>
          <dd className="numeric font-display text-display-sm font-semibold text-ink type-section">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
