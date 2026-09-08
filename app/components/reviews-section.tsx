import { SectionHeading } from "./section-heading";
import { Rating } from "./ui/rating";

const REVIEWS = [
  {
    id: "r1",
    name: "Putri A.",
    score: 5,
    body: "Gula arennya kerasa tapi nggak bikin enek. Tiap pagi sebelum ngantor mampir sini.",
    order: "Es kopi susu gula aren",
  },
  {
    id: "r2",
    name: "Bagas W.",
    score: 5,
    body: "Tubruknya beneran tubruk, bukan filter yang diaku-aku. Harganya juga masih dua belas ribu.",
    order: "Kopi tubruk",
  },
  {
    id: "r3",
    name: "Nadia S.",
    score: 4,
    body: "Meja panjang di belakang enak buat kerja, colokan banyak. Siang agak ramai.",
    order: "Es americano",
  },
] as const;

export function ReviewsSection() {
  return (
    <section
      id="ulasan"
      className="scroll-mt-20 bg-surface-sunken px-(--space-gutter) py-(--space-section)"
    >
      <SectionHeading
        title="Kata yang sudah mampir"
        description="Dikumpulkan dari ulasan Google sepanjang tahun ini."
        action={<Rating value={4.8} count={1104} />}
      />

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {REVIEWS.map((review) => (
          // A review is static content, so it gets a border and no shadow.
          <li key={review.id} className="rounded-card border border-border bg-surface p-6">
            <Rating value={review.score} />
            <blockquote className="mt-3 text-base text-pretty text-ink">{review.body}</blockquote>
            <footer className="mt-4 text-sm text-ink-muted">
              <span className="font-medium text-ink-secondary">{review.name}</span>
              <span className="block">memesan {review.order}</span>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
