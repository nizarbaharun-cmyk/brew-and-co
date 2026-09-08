import Image from "next/image";
import { formatRupiah } from "@/app/lib/format";
import { Badge } from "./ui/badge";
import { CATEGORIES, byCategory, type MenuItem } from "@/app/data/menu";

const BADGE_LABEL: Record<NonNullable<MenuItem["badge"]>, string> = {
  populer: "Paling laris",
  favorit: "Andalan kami",
  baru: "Baru",
};

/**
 * The list form, used on /menu. A grid of cards reads like a shop; a menu reads
 * as named sections with a price column, so the rupiah figures line up into a
 * clean edge — that is what `numeric` (tabular figures) is for.
 */
export function MenuList() {
  return (
    <div className="space-y-(--space-section)">
      {CATEGORIES.map((category) => {
        const items = byCategory(category.id);
        if (items.length === 0) return null;

        return (
          <section key={category.id} id={category.id.replace(/\s+/g, "-")} className="scroll-mt-24">
            <div className="border-b border-border pb-4">
              <h2 className="font-display text-3xl font-semibold text-ink type-section">
                {category.label}
              </h2>
              <p className="mt-1 text-base text-ink-secondary">{category.blurb}</p>
            </div>

            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-4 py-5">
                  <Image
                    src={item.image}
                    // Decorative: the item name is the adjacent heading.
                    alt=""
                    width={800}
                    height={800}
                    className="size-20 shrink-0 rounded-thumb bg-surface-muted object-cover sm:size-24"
                    sizes="96px"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                      {item.badge && (
                        <Badge variant="accent" size="sm">
                          {BADGE_LABEL[item.badge]}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 max-w-(--measure-prose) text-sm text-pretty text-ink-secondary">
                      {item.description}
                    </p>
                  </div>

                  <p className="numeric shrink-0 pt-0.5 text-base font-semibold text-ink tabular-nums">
                    {formatRupiah(item.price)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
