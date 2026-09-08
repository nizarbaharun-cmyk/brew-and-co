"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/cn";

const ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/tentang", label: "Tentang" },
] as const;

/**
 * Client-side only because it needs the current route. `aria-current="page"` is
 * what actually communicates position; the underline is its visual echo, not a
 * replacement for it.
 */
export function NavLinks({
  className,
  onNavigate,
  label = "Utama",
}: {
  className?: string;
  onNavigate?: () => void;
  /** Two navs must not share a name — the mobile sheet passes its own. */
  label?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={cn("items-center gap-6", className)}>
      {ITEMS.map((item) => {
        const isCurrent = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "relative flex min-h-11 items-center rounded-sm text-sm",
              "transition-colors duration-(--duration-fast) ease-standard",
              isCurrent
                ? "font-semibold text-ink after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:rounded-pill after:bg-primary"
                : "text-ink-secondary hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
