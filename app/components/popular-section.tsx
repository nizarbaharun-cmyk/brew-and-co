import { SectionHeading } from "./section-heading";
import { MenuCard } from "./menu-card";
import { ButtonLink } from "./ui/button";
import { POPULAR } from "@/app/data/menu";

/** Driven by the `badge` column in the CSV, so there is no second list to keep in sync. */
export function PopularSection() {
  return (
    <section className="px-(--space-gutter) py-(--space-section)">
      <SectionHeading
        title="Yang paling sering dipesan"
        description="Kalau bingung mau apa, mulai dari sini."
        action={
          <ButtonLink href="/menu" variant="secondary" size="sm">
            Lihat menu lengkap
          </ButtonLink>
        }
      />

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR.map((item) => (
          <li key={item.id} className="flex">
            <MenuCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
