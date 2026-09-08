import Image from "next/image";
import { formatRupiah } from "@/app/lib/format";
import { Badge } from "./ui/badge";
import type { MenuItem } from "@/app/data/menu";

const BADGE_LABEL: Record<NonNullable<MenuItem["badge"]>, string> = {
  populer: "Paling laris",
  favorit: "Andalan kami",
  baru: "Baru",
};

/**
 * The card form, used for the handful of items shown on the home page. The
 * full menu at /menu uses the list form instead — a grid of cards does not
 * read like a menu.
 *
 * Static content, so it gets a border and no shadow.
 */
export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="flex w-full flex-col rounded-card border border-border bg-surface p-4">
      <div className="relative overflow-hidden rounded-thumb bg-surface-muted">
        <Image
          src={item.image}
          // Decorative: the name sits directly below in text.
          alt=""
          width={800}
          height={800}
          className="aspect-square w-full object-cover"
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
        />
        {item.badge && (
          <Badge variant="accent" className="absolute top-2 right-2">
            {BADGE_LABEL[item.badge]}
          </Badge>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-ink-secondary">{item.description}</p>
      </div>

      <p className="numeric mt-4 text-base font-semibold text-ink">{formatRupiah(item.price)}</p>
    </article>
  );
}
