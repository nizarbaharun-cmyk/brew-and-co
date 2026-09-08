import { SectionHeading } from "./section-heading";
import { ReservationForm } from "./reservation-form";
import { HOURS_SUMMARY, SHOP } from "@/app/data/site";
import { MAX_PARTY } from "@/app/lib/reservation";

export function ReservationSection() {
  return (
    <section
      id="pesan-meja"
      className="scroll-mt-20 px-(--space-gutter) py-(--space-section)"
    >
      <SectionHeading
        title="Pesan meja"
        description="Buat yang mau pastikan dapat tempat, terutama Jumat malam waktu open mic."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ReservationForm />

        <aside className="rounded-card border border-border bg-surface-sunken p-6">
          <h3 className="text-base font-semibold text-ink">Sebelum memesan</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-secondary">
            <li>Sampai {MAX_PARTY} orang lewat form ini. Lebih dari itu, telepon kami.</li>
            <li>Kami tahan meja 15 menit dari jam yang kamu pilih.</li>
            <li>Datang tanpa pesan juga boleh — meja panjang di belakang jarang penuh.</li>
          </ul>

          <h3 className="mt-6 text-base font-semibold text-ink">Jam buka</h3>
          <dl className="mt-3 space-y-2 text-sm">
            {HOURS_SUMMARY.map((row) => (
              <div key={row.days} className="flex justify-between gap-4">
                <dt className="text-ink-secondary">{row.days}</dt>
                <dd className="numeric text-ink">{row.time}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm text-ink-muted">
            Atau langsung telepon{" "}
            <a href={`tel:${SHOP.phone.replace(/\s/g, "")}`} className="text-ink underline underline-offset-4">
              {SHOP.phone}
            </a>
          </p>
        </aside>
      </div>
    </section>
  );
}
