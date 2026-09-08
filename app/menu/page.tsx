import type { Metadata } from "next";
import { MenuList } from "../components/menu-list";
import { ButtonLink } from "../components/ui/button";
import { CATEGORIES, MENU } from "../data/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Menu lengkap Kedai Kopi Jembrana: espresso, seduh manual, minuman dingin, pastry, makan siang, dan biji untuk di rumah.",
};

export default function MenuPage() {
  return (
    <div className="px-(--space-gutter) py-(--space-section)">
      <header className="max-w-(--measure-prose)">
        <h1 className="font-display text-display-sm font-semibold text-balance text-ink type-section">
          Menu
        </h1>
        <p className="mt-4 text-lg text-pretty text-ink-secondary">
          {MENU.length} item, diperbarui tiap kali biji baru masuk. Harga sudah termasuk pajak.
        </p>
      </header>

      {/* Jump links, not filters: on a menu you scan the whole thing, and a
          filter that hides categories makes it harder, not easier. */}
      <nav aria-label="Kategori menu" className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            href={`#${category.id.replace(/\s+/g, "-")}`}
            className="inline-flex min-h-11 items-center rounded-pill border border-border-strong bg-surface px-4 text-sm font-medium text-ink-secondary transition-colors duration-(--duration-fast) hover:bg-surface-sunken hover:text-ink"
          >
            {category.label}
          </a>
        ))}
      </nav>

      <div className="mt-(--space-section)">
        <MenuList />
      </div>

      <div className="mt-(--space-section) rounded-card border border-border bg-surface-sunken p-8 text-center">
        <h2 className="text-lg font-semibold text-ink">Mau pastikan dapat meja?</h2>
        <p className="mx-auto mt-2 max-w-(--measure-prose) text-base text-ink-secondary">
          Jumat malam dan Sabtu pagi biasanya penuh.
        </p>
        <ButtonLink href="/#pesan-meja" className="mt-6">
          Pesan meja
        </ButtonLink>
      </div>
    </div>
  );
}
