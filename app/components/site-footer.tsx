import Link from "next/link";
import { ExternalLink } from "./ui/text-link";
import { SHOP } from "@/app/data/site";

const MENU_LINKS = [
  { href: "/menu", label: "Menu lengkap" },
  { href: "/tentang", label: "Tentang kami" },
  { href: "/#acara", label: "Open mic & tasting" },
  { href: "/#pesan-meja", label: "Pesan meja" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-sunken px-(--space-gutter) py-(--space-section)">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink type-display-small">
            Kedai Kopi
          </h2>
          <p className="mt-3 max-w-xs text-sm text-ink-secondary">
            {SHOP.street}, {SHOP.area}, {SHOP.region}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Jelajahi</h3>
          <ul className="mt-3 space-y-3">
            {MENU_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm text-sm text-ink-secondary transition-colors duration-(--duration-fast) hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Kontak</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <ExternalLink href={`https://wa.me/${SHOP.whatsapp}`}>WhatsApp pesanan</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://instagram.com">Instagram</ExternalLink>
            </li>
            <li>
              <a
                href={`mailto:${SHOP.email}`}
                className="rounded-sm text-ink-secondary transition-colors duration-(--duration-fast) hover:text-ink"
              >
                {SHOP.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-10 text-2xs text-ink-muted">
        Harga sudah termasuk pajak. Menu bisa berubah kalau bijinya habis. Foto dari Pexels —
        rinciannya di docs/photo-credits.md.
      </p>
    </footer>
  );
}
