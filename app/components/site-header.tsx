import Link from "next/link";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { ButtonLink } from "./ui/button";
import { BeanIcon } from "./icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-(--z-header) border-b border-border bg-surface/90 backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-(--space-gutter) md:h-18 md:gap-6">
        <MobileNav />

        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm font-display text-xl font-semibold text-ink type-display-small"
        >
          <span className="grid size-9 place-items-center rounded-pill bg-primary-subtle text-primary">
            <BeanIcon />
          </span>
          Kedai Kopi
        </Link>

        <NavLinks className="ml-4 hidden md:flex" />

        {/* Wrapped, not `hidden` on the button itself: ButtonLink sets
            `inline-flex`, and a bare `hidden` from the caller is the same
            specificity, so source order decides. Layout belongs on a wrapper. */}
        <span className="ml-auto hidden sm:block">
          <ButtonLink size="sm" href="/#pesan-meja">
            Pesan meja
          </ButtonLink>
        </span>
      </div>
    </header>
  );
}
