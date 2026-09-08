import Image from "next/image";
import { ButtonLink } from "./ui/button";
import { StatRow } from "./stat-row";
import { ArrowUpRightIcon } from "./icons";

const STATS = [
  { value: "8", label: "Tahun buka" },
  { value: "3", label: "Asal biji" },
  { value: "23", label: "Menu" },
] as const;

/**
 * The one place the system spends its boldness, and the only place `type-hero`
 * is allowed.
 *
 * Text sits on a photograph, which is the single spot in this system where a
 * token cannot guarantee contrast. The gradient scrim below is what buys it:
 * dark at the bottom where the type is, transparent at the top so the photo is
 * still a photo. Measured, not assumed — see docs/design/01-style-guide.md.
 */
export function Hero() {
  return (
    <section className="px-(--space-gutter) pt-6 pb-(--space-section)">
      {/* Two layouts, one photo.
          Below `lg` the copy sits on a solid dark panel under the image. Not a
          style preference — measured on the real photograph, the overlay fell to
          1.32:1 at 390px and 2.43:1 at 640px, because the text block is nearly
          as tall as the image and rides up into the part of the scrim that is
          almost clear. A gradient cannot rescue text that tall.
          From `lg` there is room, so the copy overlays the photo on the scrim.
          Measured worst case across 320/390/640/768/1024/1280/1600px:
          heading 6.41:1, lead 6.58:1 — both at 1024px, the tightest width. */}
      <div className="relative isolate overflow-hidden rounded-card bg-roast-950">
        <Image
          src="/img/hero.webp"
          alt="Ruang depan Kedai Kopi pada malam hari, lampu hangat menyala"
          width={1800}
          height={1125}
          preload
          className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-[34rem]"
          sizes="(min-width: 1280px) 1200px, 100vw"
        />

        {/* Gradient, not a flat wash: a flat overlay kills the photograph. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[image:var(--scrim-photo)] lg:block"
        />

        <div className="p-6 sm:p-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-10">
          <h1 className="max-w-(--measure-display) font-display text-display-sm font-semibold text-balance text-white type-hero md:text-display-md lg:text-display-lg">
            Kopi pagi di Jembrana
          </h1>
          <p className="mt-4 max-w-(--measure-prose) text-lg text-pretty text-white/85">
            Biji Kintamani, Gayo, dan Toraja, digiling pas sebelum diseduh. Pastry keluar dari
            oven jam setengah enam. Makan siangnya ringan.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink
              href="#pesan-meja"
              size="lg"
              trailingIcon={<ArrowUpRightIcon className="size-4" />}
            >
              Pesan meja
            </ButtonLink>
            <ButtonLink href="/menu" size="lg" variant="secondary">
              Lihat menu
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mt-(--space-block) border-t border-border pt-(--space-block)">
        <StatRow stats={STATS} />
      </div>
    </section>
  );
}
