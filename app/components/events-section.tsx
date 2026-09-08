import Image from "next/image";
import { SectionHeading } from "./section-heading";
import { EVENTS } from "@/app/data/site";

/**
 * The events recur weekly, so they are shown as a standing schedule rather than
 * dated entries. Fixed dates would be stale within a week, and computing them
 * per request would drag the page out of static prerendering for no gain.
 */
export function EventsSection() {
  return (
    <section
      id="acara"
      className="scroll-mt-20 bg-surface-sunken px-(--space-gutter) py-(--space-section)"
    >
      <SectionHeading
        title="Yang rutin di sini"
        description="Dua acara tetap tiap minggu. Tidak perlu daftar, tinggal datang."
      />

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {EVENTS.map((event) => (
          <li
            key={event.id}
            className="flex flex-col overflow-hidden rounded-card border border-border bg-surface"
          >
            <Image
              src={event.image}
              alt={event.imageAlt}
              width={1200}
              height={800}
              className="aspect-[3/2] w-full object-cover"
              sizes="(min-width: 768px) 560px, 90vw"
            />
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl font-semibold text-ink type-display-small">
                {event.name}
              </h3>
              <p className="numeric mt-1 text-sm font-semibold text-accent-text">{event.when}</p>
              <p className="mt-3 text-base text-pretty text-ink-secondary">{event.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
