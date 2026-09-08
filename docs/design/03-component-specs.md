# Component Specs

Specified against Next.js 16 App Router, React 19, Tailwind v4, and the tokens in
[`02-design-tokens.md`](./02-design-tokens.md).

> **Site changed in Sept 2026.** Kedai Kopi moved from a single landing page with a cart to
> three routes (`/`, `/menu`, `/tentang`) with table reservations and no online ordering.
> The cart components (`CartButton`, `CartSheet`, `AddToCart`, `CartProvider`) and
> `QuantityStepper` were deleted; party size is a plain `input[type=number]`, which is more
> accessible than a custom stepper and needs no client state. `MenuCard` lost its
> stock/sold-out logic with the cart. Their specs below are kept only where the pattern is
> still instructive — where a spec describes a component that no longer exists, it is marked
> **REMOVED**.

Each spec gives anatomy, variants, states, the tokens it consumes, its accessibility
contract, and a working implementation. The code is the spec — if a component ships with
behaviour this document does not describe, the document is incomplete and gets fixed in
the same pull request.

## Contents

**Foundations** — [Button](#1-button) · [IconButton](#2-iconbutton) · [TextLink](#3-textlink)
**Navigation** — [SiteHeader](#4-siteheader) · [NavLinks](#5-navlinks) · ~~CartButton~~ · [SiteFooter](#7-sitefooter)
**Layout** — [Tray](#8-tray) · [SectionHeading](#9-sectionheading) · [Hero](#10-hero) · [StatRow](#11-statrow)
**Content** — [Card](#12-card) · [Badge](#13-badge) · [FilterChip](#14-filterchip) · [Rating](#15-rating)
**Forms** — [Field, Input, Textarea, Select](#16-field-input-textarea-select) · [QuantityStepper](#17-quantitystepper)
**Feedback** — [Sheet](#18-sheet) · [Toast](#19-toast) · [Skeleton, EmptyState, ErrorState](#20-skeleton-emptystate-errorstate)

---

## Conventions used throughout

### Server by default

Every component here is a Server Component unless the spec opens with `'use client'`.
That directive is a cost — it ships JavaScript — and each one that appears below is
justified in its spec. `Button` and `Card` are server components; the interactive shells
that use them (`CartButton`, `Sheet`) are not.

### `ref` is a prop

React 19 passes `ref` through as a normal prop. No `forwardRef` anywhere in this codebase.

```tsx
function Input({ ref, ...props }: React.ComponentProps<"input">) {
  return <input ref={ref} {...props} />;
}
```

### The `cn` helper

One utility, in `app/lib/cn.ts`. No `clsx` or `tailwind-merge` dependency — the variant
maps below are exhaustive, so there is nothing to merge.

```ts
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
```

**The one thing this cannot do:** override a component's own utility with a bare one of
the same kind. `Button` sets `inline-flex`; passing `className="hidden"` does *not* hide
it, because both are single-class selectors and the stylesheet's source order decides,
not the order of the class attribute. Responsive and state variants are fine —
`md:hidden` is emitted after the base utilities and wins inside its media query.

So put layout concerns on a wrapper, not on the component:

```tsx
{/* Wrong — `hidden` loses to the button's own `inline-flex` */}
<ButtonLink className="hidden sm:inline-flex">Pesan sekarang</ButtonLink>

{/* Right — display belongs to the layout */}
<span className="hidden sm:block">
  <ButtonLink>Pesan sekarang</ButtonLink>
</span>
```

### Variant props are unions

```tsx
type Variant = "primary" | "secondary" | "ghost" | "accent";
```

Never `variant?: string`. A typo should fail the build, not render an unstyled button.

### Focus

Every interactive element carries `focus-ring` (defined in `app/tokens.css`) or relies on the
global `:focus-visible` rule. `outline-none` without a replacement is a defect.

---

## 1. Button

The primary action affordance. Pill-shaped, matching the reference.

### Anatomy

```
+---------------------------------------+
|  [icon]   Label            ( icon )   |
+---------------------------------------+
   ^        ^                   ^
   |        |                   +-- trailing slot: a circular
   |        |                       counter-coloured well
   |        +-- 600 weight, sans
   +-- leading icon, 20px, aria-hidden
```

The trailing slot is the reference's "Order Now" treatment: a filled circle inset in the
pill holding a single icon. It is a real affordance in a real container, which is why it
is allowed where a bare arrow glyph appended to the label is not.

### Variants

| Variant | Fill | Label | Border | Use |
| --- | --- | --- | --- | --- |
| `primary` | `bg-primary` | `text-primary-ink` | none | The one main action per view |
| `secondary` | `bg-surface` | `text-ink` | `border-border-strong` | Alternatives beside a primary |
| `ghost` | transparent | `text-ink` | none | Toolbar and card actions, cancel |
| `accent` | `bg-accent` | `text-accent-ink` | none | Promotional only. One per viewport |
| `danger` | `bg-danger` | white | none | Destructive: remove item, cancel order |

`accent` and `primary` never appear side by side. If a screen needs both, the accent is
decoration and should be cut.

### Sizes

| Size | Height | Padding | Text | Icon |
| --- | --- | --- | --- | --- |
| `sm` | 36px | `px-4` | `text-sm` | 16px |
| `md` | 44px | `px-5` | `text-base` | 20px |
| `lg` | 52px | `px-6` | `text-base` | 20px |

`md` is the default and is exactly the 44px minimum target. `sm` is 36px tall, so it
carries the `touch-target` utility, which extends the hit area to 44px with a
pseudo-element while leaving the visual box at 36px. That keeps card footers and toolbars
visually light without shrinking the target.

### States

| State | Treatment |
| --- | --- |
| Rest | Variant fill |
| Hover | `bg-*-hover`, 120ms |
| Active | `bg-*-active`, `scale-[0.98]` |
| Focus | 2px `outline-focus`, 2px offset |
| Disabled | `bg-surface-muted`, `text-ink-disabled`, `cursor-not-allowed`, no hover |
| Loading | Spinner replaces the leading icon; label stays; `aria-busy`, `disabled` |

The label never disappears during loading. A button that becomes a bare spinner loses the
only clue about what is happening.

### Implementation

```tsx
// app/components/ui/button.tsx
import { cn } from "@/app/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-primary-ink hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-surface text-ink border border-border-strong hover:bg-surface-sunken active:bg-surface-muted",
  ghost: "text-ink hover:bg-surface-muted active:bg-surface-muted",
  accent: "bg-accent text-accent-ink hover:bg-accent-hover",
  danger: "bg-danger text-white hover:brightness-95",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-base gap-2",
  lg: "h-13 px-6 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  trailingIcon,
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-pill font-semibold",
        "transition-[background-color,transform] duration-(--duration-fast) ease-standard",
        "active:scale-[0.98]",
        "disabled:pointer-events-none disabled:bg-surface-muted disabled:text-ink-disabled",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className="ml-1 grid size-8 place-items-center rounded-pill bg-surface/15"
        >
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
```

### Accessibility

- `<button>` for actions, `<a>` for navigation. A "Pesan sekarang" that changes the URL is
  a link styled as a button, not a button that calls `router.push`.
- Disabled buttons stay in the DOM and stay described. Never remove one on submit.
- Under `prefers-reduced-motion` the spinner stops (`motion-reduce:animate-none`) — the
  `aria-busy` state still tells assistive tech what is happening.

### Copy

`Pesan sekarang`, `Tambah ke keranjang`, `Bayar Rp 42.000`. Never `Kirim`, never
`Lanjut` alone, never an arrow appended to the words.

---

## 2. IconButton

A square button with no visible label. Used for the cart, search, close, and the quantity
stepper.

| Size | Box | Icon | Hit area |
| --- | --- | --- | --- |
| `sm` | 36px | 16px | must be padded to 44px by its container |
| `md` | 44px | 20px | 44px |

```tsx
export function IconButton({
  label,
  size = "md",
  variant = "ghost",
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  label: string;
  size?: "sm" | "md";
  variant?: "ghost" | "secondary";
}) {
  return (
    <button
      {...props}
      aria-label={label}
      className={cn(
        "inline-grid place-items-center rounded-pill",
        "transition-colors duration-(--duration-fast) ease-standard",
        "hover:bg-surface-muted active:bg-surface-muted",
        "disabled:pointer-events-none disabled:text-ink-disabled",
        variant === "secondary" && "border border-border-strong bg-surface",
        size === "sm" ? "size-9" : "size-11",
        className,
      )}
    >
      {children}
    </button>
  );
}
```

`label` is required, not optional. An icon button without an accessible name is
unusable with a screen reader, and making the prop required moves that from a review
comment to a type error.

---

## 3. TextLink

Inline links in body copy, and the nav's underline treatment.

| Variant | Rest | Hover | Current |
| --- | --- | --- | --- |
| `inline` | `text-ink`, `underline underline-offset-4 decoration-border-strong` | `decoration-ink` | — |
| `quiet` | `text-ink-secondary`, no underline | `text-ink` | — |
| `nav` | `text-ink-secondary`, no underline | `text-ink` | `text-ink` plus a 2px `bg-primary` rule below |

The nav's current-page rule is the reference's treatment: a short underline under the
active item only. It marks position, which is information, so it earns its place.

```tsx
import Link from "next/link";

export function TextLink({
  variant = "inline",
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: "inline" | "quiet" | "nav" }) {
  return (
    <Link
      {...props}
      className={cn(
        "rounded-sm transition-colors duration-(--duration-fast) ease-standard",
        variant === "inline" &&
          "text-ink underline decoration-border-strong underline-offset-4 hover:decoration-ink",
        variant === "quiet" && "text-ink-secondary hover:text-ink",
        variant === "nav" && "text-ink-secondary hover:text-ink",
        className,
      )}
    />
  );
}
```

External links get `target="_blank" rel="noopener noreferrer"` and a visually hidden
"(buka di tab baru)" so the behaviour is announced.

---

## 4. SiteHeader

Server Component. Holds the logo, nav, search, cart, and sign-in — the reference's
layout, in that order.

### Anatomy

```
+------------------------------------------------------------------+
| (o) Kedai Kopi    Menu  Biji  Tempat  Ulasan    [Q] [cart] (Masuk)|
+------------------------------------------------------------------+
  ^                 ^                              ^     ^     ^
  |                 |                              |     |     +-- Button, primary, sm
  |                 |                              |     +-- CartButton (client)
  |                 |                              +-- IconButton, search
  |                 +-- NavLinks (client, needs the segment)
  +-- logo, links home
```

At `<md` the nav collapses into a `Sheet` behind a menu IconButton; the cart stays
visible in the bar, because it is the thing people reach for.

### Spec

| Property | Value |
| --- | --- |
| Height | 72px desktop, 64px mobile |
| Background | `bg-surface`, `backdrop-blur` when scrolled |
| Border | `border-b border-border`, appears only when scrolled |
| Position | `sticky top-0`, `z-(--z-header)` |
| Padding | `px-(--space-gutter)` |
| Wordmark | `font-display text-xl type-display-small` |

```tsx
// app/components/site-header.tsx  — Server Component
import Link from "next/link";
import { NavLinks } from "./nav-links";
import { CartButton } from "./cart-button";
import { Button } from "./ui/button";
import { IconButton } from "./ui/icon-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-(--z-header) border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-(--container-tray) items-center gap-6 px-(--space-gutter) md:h-18">
        <Link href="/" className="font-display text-xl font-semibold type-display-small">
          Kedai Kopi
        </Link>

        <NavLinks className="ml-6 hidden md:flex" />

        <div className="ml-auto flex items-center gap-1">
          <IconButton label="Cari menu">
            <SearchIcon />
          </IconButton>
          <CartButton />
          <Button size="sm" className="ml-2 hidden sm:inline-flex">
            Masuk
          </Button>
        </div>
      </div>
    </header>
  );
}
```

### Accessibility

- One `<header>` with `<nav aria-label="Utama">` inside.
- A skip link (`Lompat ke konten`) is the first focusable element on the page,
  visually hidden until focused.
- The sticky header must not cover a focused element: set
  `scroll-margin-top: 5rem` on headings and form fields.

---

## 5. NavLinks

`'use client'` — this is the one part of the header that needs the current route, and
`useSelectedLayoutSegment` is a client hook.

```tsx
"use client";

import { usePathname } from "next/navigation";
import { TextLink } from "./ui/text-link";
import { cn } from "@/app/lib/cn";

const ITEMS = [
  { href: "/menu", label: "Menu" },
  { href: "/biji", label: "Biji" },
  { href: "/tempat", label: "Tempat" },
  { href: "/ulasan", label: "Ulasan" },
] as const;

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Utama" className={cn("items-center gap-6", className)}>
      {ITEMS.map((item) => {
        const current = pathname.startsWith(item.href);
        return (
          <TextLink
            key={item.href}
            href={item.href}
            variant="nav"
            aria-current={current ? "page" : undefined}
            className={cn(
              "relative py-2 text-sm",
              current &&
                "text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-pill after:bg-primary",
            )}
          >
            {item.label}
          </TextLink>
        );
      })}
    </nav>
  );
}
```

`aria-current="page"` is what actually communicates position. The underline is the
visual echo of it, not a replacement.

---

## 6. CartButton — REMOVED

**Removed with the cart.** The count-bubble pattern (badge `aria-hidden` because the count
is already in the button's label, plus a separate `aria-live` region for the change) is worth
keeping in mind for any future counter.

### Anatomy

```
 +-------+
 | [cart]|  (3)   <- count bubble, bg-accent, top-right, min 18px
 +-------+
```

| Property | Value |
| --- | --- |
| Button | `IconButton`, `md` |
| Bubble | `bg-accent text-accent-ink`, `text-2xs numeric`, `rounded-pill`, `min-w-[1.125rem] h-[1.125rem]` |
| Bubble position | `absolute -top-0.5 -right-0.5` |
| Empty | Bubble hidden entirely — not shown as `0` |

```tsx
"use client";

import { IconButton } from "./ui/icon-button";
import { useCart } from "@/app/lib/cart";

export function CartButton() {
  const { count, open } = useCart();

  return (
    <div className="relative">
      <IconButton
        label={count > 0 ? `Keranjang, ${count} item` : "Keranjang, kosong"}
        onClick={open}
      >
        <CartIcon />
      </IconButton>

      {count > 0 && (
        <span
          aria-hidden="true"
          className="numeric absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-pill bg-accent px-1 text-2xs font-semibold text-accent-ink"
        >
          {count}
        </span>
      )}

      <span aria-live="polite" className="sr-only">
        {count > 0 ? `${count} item di keranjang` : ""}
      </span>
    </div>
  );
}
```

The bubble is `aria-hidden` because the count is already in the button's label; the
`aria-live` region announces the change when something is added. Without the live
region, adding to cart is silent for a screen-reader user.

---

## 7. SiteFooter

Server Component. Three columns at `md`, stacked below.

| Column | Content |
| --- | --- |
| Shop | Address, opening hours, a map link |
| Menu | Links to the main categories |
| Kontak | WhatsApp, Instagram, email |

| Property | Value |
| --- | --- |
| Background | `bg-surface-sunken` |
| Top border | `border-t border-border` |
| Padding | `py-(--space-section) px-(--space-gutter)` |
| Headings | `text-sm font-semibold text-ink` — sans, not display, and not all-caps |
| Links | `TextLink variant="quiet"`, `text-sm` |
| Legal | `text-2xs text-ink-muted` |

Opening hours are a `<dl>`, not a list of strings joined by separators. The days are keys
and the times are values, and marking that up correctly is what lets a screen reader read
"Senin sampai Jumat, tujuh pagi sampai sepuluh malam" as one fact.

---

## 8. Tray

The page shell. The system's signature structure: content on a rounded surface inset from
the ground.

| Breakpoint | Inset | Radius | Shadow |
| --- | --- | --- | --- |
| `<sm` | 0 | none | none |
| `sm–lg` | 12px | `rounded-tray` | `shadow-tray` |
| `≥lg` | 24px | `rounded-tray` | `shadow-tray` |

```tsx
export function Tray({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg sm:p-3 lg:p-6">
      <div className="mx-auto max-w-(--container-tray) bg-surface sm:rounded-tray sm:shadow-tray">
        {children}
      </div>
    </div>
  );
}
```

One tray per page. It goes in the root layout, wrapping `{children}`, so no page has to
remember it. Nested trays are not a thing — a card inside the tray is a `Card`, at
`rounded-card`.

---

## 9. SectionHeading

Every section on every page uses this. It is what keeps page rhythm consistent.

### Anatomy

```
Menu hari ini                                    [ Lihat semua ]
Diseduh setiap pagi jam 6. Habis, ya habis.
```

Heading, optional one-line description, optional trailing action. **No eyebrow label
above the heading** — the heading is already the label, and a tracked-out caps line above
it is the single most common tell of a templated page.

| Slot | Type |
| --- | --- |
| Heading | `font-display text-3xl font-semibold type-section text-balance` |
| Description | `text-base text-ink-secondary max-w-(--measure-prose) text-pretty` |
| Action | `Button variant="ghost" size="sm"` |

```tsx
export function SectionHeading({
  title,
  description,
  action,
  as: As = "h2",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <As className="font-display text-3xl font-semibold text-balance type-section">
          {title}
        </As>
        {description && (
          <p className="max-w-(--measure-prose) text-base text-pretty text-ink-secondary">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
```

The `as` prop exists so heading levels stay sequential. A section inside a section uses
`as="h3"`; skipping from `h1` to `h3` is a defect.

---

## 10. Hero

Home page only, above the fold. This is where the system spends its boldness, and the
only place `type-hero` is allowed.

### Anatomy

```
+--------------------------------------------------------------+
|                        |                                     |
|    [ cup photography ] |   Kopi pagi,                        |
|                        |   diseduh                           |
|         (Rp 18.000)    |   sejak jam 6                       |
|          price badge   |                                     |
|                        |   Gayo dan Toraja, digiling pas     |
|                        |   sebelum diseduh. Ambil sendiri    |
|                        |   atau kami antar sekitar sini.     |
|                        |                                     |
|                        |   [ Pesan sekarang  (>) ]           |
|                        |                                     |
|  1K+          3rb+         150+                              |
|  Ulasan       Terjual      Menu                              |
+--------------------------------------------------------------+
```

Image left, type right on desktop; type first, image below on mobile — the headline is
what should land first on a phone.

| Slot | Spec |
| --- | --- |
| Headline | `font-display type-hero`, `text-display-sm` → `md:text-display-lg` → `xl:text-display-xl`, `max-w-(--measure-display)`, `text-balance` |
| Lead | `text-lg text-ink-secondary max-w-(--measure-prose)` |
| Action | `Button size="lg"` with a `trailingIcon` |
| Image | `next/image`, `priority`, explicit dimensions |
| Price badge | `Badge variant="accent" size="lg"`, absolutely positioned on the image |
| Stats | [`StatRow`](#11-statrow) |

### Two layouts, one photo

The hero carries a background photograph, so contrast depends on the image, not the palette.

| Width | Layout | Measured worst case |
| --- | --- | --- |
| `<lg` | Copy on a solid `roast-950` panel below the image | 19.29:1 heading |
| `≥lg` | Copy overlaid on the photo with `--scrim-photo` | 6.41:1 heading, 6.58:1 lead |

The breakpoint is not taste. Overlaid at 390px the heading measured **1.32:1** and at 640px
**2.43:1**, because the text block is nearly as tall as the image and rides up into the part
of the gradient that is almost clear. Any hero photo swap must be re-measured — see
[Text on photography](./01-style-guide.md#text-on-photography).

### Motion

The one orchestrated moment in the product. On first load only:

```tsx
<h1 className="animate-settle font-display ...">…</h1>
<p className="animate-settle [animation-delay:60ms] ...">…</p>
<div className="animate-settle [animation-delay:120ms]">…</div>
```

`--animate-settle` is a 600ms fade and 12px rise on `--ease-cup`, and the global
reduced-motion rule collapses it to nothing. Nothing else on the page animates on scroll.

**Not yet implemented:** the once-per-session gate. A `sessionStorage` check can only run
after hydration, which means either a flash of hidden content or an animation that has
already started, and reading a cookie on the server would opt the whole landing page into
dynamic rendering. Shipping it unconditionally is the lesser cost until the page needs to
be dynamic for another reason.

### Copy

The headline names what the shop actually does at a time of day the customer recognises.
It does not accent one word in a different colour or weight — the type is already doing
the work, and colouring a single word is a tell.

---

## 11. StatRow

The reference's `1K+ / 3k+ / 150+` band. Three or four figures with plain labels.

| Slot | Spec |
| --- | --- |
| Figure | `font-display text-display-sm numeric font-semibold text-ink` |
| Label | `text-sm text-ink-secondary` |
| Layout | `flex gap-8` at `md`, `grid grid-cols-3 gap-4` below |
| Markup | `<dl>` with `<dt>` label and `<dd>` figure |

```tsx
export function StatRow({
  stats,
}: {
  stats: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <dl className="grid grid-cols-3 gap-4 md:flex md:gap-12">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse gap-1">
          <dt className="text-sm text-ink-secondary">{s.label}</dt>
          <dd className="numeric font-display text-display-sm font-semibold text-ink">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

`<dl>` with `flex-col-reverse` puts the figure above the label visually while keeping
label-then-value in the DOM, which is the order a screen reader needs. Do not swap the
elements to fix the visual order.

Figures are rounded and honest: `1rb+`, not `1.043`. A stat nobody can verify does not
belong on the page at all.

---

## 12. Card

The base surface for a menu item, a bean bag, or a review. **The interactive/static split
is the important part of this spec.**

| Kind | Border | Shadow | Hover |
| --- | --- | --- | --- |
| Static (a review, an info panel) | `border border-border` | none | none |
| Interactive (a menu item, a bean) | `border border-border` | `shadow-rest` | `shadow-lift`, `-translate-y-0.5` |

A static card never gets a shadow. This is what stops every page turning into an identical
grid of soft-shadowed rectangles.

### MenuCard anatomy

```
+---------------------------+
|                           |
|      [ 1:1 photo ]        |  rounded-thumb, inside a rounded-card
|                    (Baru) |  Badge, absolute top-right
+---------------------------+
|  Es kopi susu gula aren   |  text-lg font-semibold
|  Espresso, susu segar,    |  text-sm text-ink-secondary, 2 lines max
|  gula aren cair           |
|                           |
|  Rp 18.000   [ Tambah ]   |  numeric price + Button sm
+---------------------------+
```

| Property | Value |
| --- | --- |
| Radius | `rounded-card` |
| Padding | `p-4` |
| Image radius | `rounded-thumb` (smaller than the parent — the radius rule) |
| Image ratio | `aspect-square`, `object-cover` |
| Title | `text-lg font-semibold text-ink`, `line-clamp-1` |
| Description | `text-sm text-ink-secondary`, `line-clamp-2` |
| Price | `text-base font-semibold numeric text-ink` |

```tsx
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/app/lib/format";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="group rounded-card border border-border bg-surface p-4 shadow-rest transition-[box-shadow,transform] duration-(--duration-base) ease-standard hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="relative overflow-hidden rounded-thumb bg-surface-muted">
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={480}
          height={480}
          className="aspect-square w-full object-cover"
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
        />
        {item.isNew && (
          <Badge variant="accent" className="absolute top-2 right-2">
            Baru
          </Badge>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="line-clamp-1 text-lg font-semibold text-ink">
          <Link href={`/menu/${item.slug}`} className="after:absolute after:inset-0">
            {item.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-ink-secondary">{item.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="numeric text-base font-semibold text-ink">
          {formatRupiah(item.price)}
        </span>
        <AddToCart item={item} />
      </div>
    </article>
  );
}
```

### The stretched-link pattern

`after:absolute after:inset-0` on the title link makes the whole card clickable while
keeping exactly one link in the accessibility tree. It requires `relative` on the card
(`group` plus the transition context here) and it means the "Tambah" button must sit
above it — give that button `relative z-(--z-raised)`, or its click lands on the link.

This is the correct pattern. Wrapping the whole card in an `<a>` swallows the button, and
an `onClick` on the `<article>` is not keyboard reachable.

### Sold out

```tsx
<article className="…">                      {/* card stays at full contrast */}
  <Image className="… opacity-45" />         {/* only the photo dims        */}
  <Badge variant="strong">Habis hari ini</Badge>
  …
  <Button size="sm" disabled>Tambah</Button>
</article>
```

Dimmed **and** labelled **and** disabled. Opacity alone is not a state a colour-blind or
low-vision customer can read.

Dim the **image**, never the whole card: fading the card takes the name, price, and the
sold-out label itself below their contrast thresholds, which trades one accessibility
problem for a worse one. The badge switches to `strong` for the same reason — a tinted
fill vanishes against the image behind it.

---

## 13. Badge

Small, non-interactive status and metadata.

| Variant | Fill | Text | Use |
| --- | --- | --- | --- |
| `accent` | `bg-accent` | `text-accent-ink` | Price badges, "Baru", promos |
| `neutral` | `bg-surface-muted` | `text-ink-secondary` | Sizes, weights, quiet metadata |
| `strong` | `bg-surface-inverse` | `text-ink-inverse` | Labels on top of an image, where a tinted fill disappears |
| `success` | `bg-success-surface` | `text-success-ink` | "Siap diambil" |
| `danger` | `bg-danger-surface` | `text-danger-ink` | "Dibatalkan" |
| `info` | `bg-info-surface` | `text-info-ink` | "Sedang diseduh" |

| Size | Height | Padding | Text |
| --- | --- | --- | --- |
| `sm` | 20px | `px-2` | `text-2xs` |
| `md` | 24px | `px-2.5` | `text-xs` |
| `lg` | 64px, circular | — | `text-base` |

`lg` is the reference's circular price medallion — a fixed-size circle, used at most once
per page, on the hero image only.

```tsx
export function Badge({
  variant = "neutral",
  size = "md",
  className,
  children,
}: {
  variant?: "accent" | "neutral" | "success" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  const fill = {
    accent: "bg-accent text-accent-ink",
    neutral: "bg-surface-muted text-ink-secondary",
    success: "bg-success-surface text-success-ink",
    danger: "bg-danger-surface text-danger-ink",
    info: "bg-info-surface text-info-ink",
  }[variant];

  const shape =
    size === "lg"
      ? "size-16 flex-col text-base"
      : size === "sm"
        ? "h-5 px-2 text-2xs"
        : "h-6 px-2.5 text-xs";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-pill font-semibold",
        fill,
        shape,
        className,
      )}
    >
      {children}
    </span>
  );
}
```

Badges are **not** buttons. If it filters, it is a [FilterChip](#14-filterchip). A badge
carrying an `onClick` is a bug.

Badge text is sentence case: `Habis hari ini`, never `HABIS HARI INI`.

---

## 14. FilterChip

The menu category filter. Toggles, so it is a real control.

| State | Fill | Text | Border |
| --- | --- | --- | --- |
| Rest | `bg-surface` | `text-ink-secondary` | `border-border-strong` |
| Hover | `bg-surface-sunken` | `text-ink` | `border-border-strong` |
| Selected | `bg-primary` | `text-primary-ink` | none, plus a check icon |
| Disabled | `bg-surface-muted` | `text-ink-disabled` | `border-border` |

Selection changes fill **and** weight **and** adds a check. Three cues, because fill alone
is not enough.

```tsx
"use client";

export function FilterChip({
  selected,
  children,
  ...props
}: React.ComponentProps<"button"> & { selected: boolean }) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={selected}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-pill px-4 text-sm",
        "transition-colors duration-(--duration-fast) ease-standard",
        selected
          ? "bg-primary font-semibold text-primary-ink"
          : "border border-border-strong bg-surface font-medium text-ink-secondary hover:bg-surface-sunken hover:text-ink",
      )}
    >
      {selected && <CheckIcon className="size-4" aria-hidden="true" />}
      {children}
    </button>
  );
}
```

A chip row is a `<div role="group" aria-label="Filter kategori">`. If filters are mutually
exclusive, use `role="radio"` inside `role="radiogroup"` with arrow-key navigation
instead of independent switches.

---

## 15. Rating

Review scores. Read-only in listings, interactive in the review form.

| Property | Value |
| --- | --- |
| Star size | 16px listing, 28px input |
| Filled | `text-accent` |
| Empty | `text-border-strong` |
| Score text | `text-sm numeric font-semibold text-ink` |
| Count | `text-sm text-ink-muted` |

```tsx
export function Rating({ value, count }: { value: number; count: number }) {
  return (
    <p className="flex items-center gap-1.5 text-sm">
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            className={cn("size-4", i <= Math.round(value) ? "text-accent" : "text-border-strong")}
          />
        ))}
      </span>
      <span className="numeric font-semibold text-ink">{value.toFixed(1)}</span>
      <span className="text-ink-muted">({count} ulasan)</span>
    </p>
  );
}
```

The stars are `aria-hidden` and the score is real text, so the whole thing reads as
"4,8 (128 ulasan)" rather than five separate star images. Amber here is a foreground on
a light surface — allowed because a star is a shape, not text, and the `text-border-strong`
empties keep the filled/empty distinction visible without relying on colour alone.

---

## 16. Field, Input, Textarea, Select

One `Field` wrapper handles the label, helper text, and error for all three controls, so
the accessibility wiring is written once.

### Anatomy

```
Nomor HP                          <- label, always visible
+---------------------------+
| 0812 3456 7890            |     <- control, h-11, rounded-control
+---------------------------+
Untuk konfirmasi pesanan.         <- helper OR error, never both
```

| Property | Value |
| --- | --- |
| Label | `text-sm font-medium text-ink`, always visible |
| Control height | 44px (`h-11`) |
| Control radius | `rounded-control` |
| Border | `border-border-strong` (operable, 3:1) |
| Focus | 2px `outline-focus`, 2px offset |
| Placeholder | `text-ink-muted`. An example, never a label |
| Helper | `text-sm text-ink-muted` |
| Error | `text-sm text-danger-ink`, with an icon |
| Error border | `border-danger` |

```tsx
import { useId } from "react";

export function Field({
  label,
  helper,
  error,
  required,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean | undefined;
  }) => React.ReactNode;
}) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : helper ? helperId : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>

      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger-ink">
          <AlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="text-sm text-ink-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

const CONTROL =
  "w-full rounded-control border border-border-strong bg-surface px-3 text-base text-ink " +
  "placeholder:text-ink-muted transition-colors duration-(--duration-fast) " +
  "aria-invalid:border-danger disabled:bg-surface-muted disabled:text-ink-disabled";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input {...props} className={cn(CONTROL, "h-11", className)} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea {...props} className={cn(CONTROL, "min-h-24 py-3", className)} />;
}
```

Usage:

```tsx
<Field label="Nomor HP" helper="Untuk konfirmasi pesanan." error={state.errors?.phone} required>
  {(a11y) => <Input {...a11y} name="phone" type="tel" inputMode="numeric" autoComplete="tel" />}
</Field>
```

### Forms with Server Actions

React 19's `useActionState` is how forms report errors here. The action is a Server
Action; only the form shell is a client component.

```tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { placeOrder } from "@/app/actions/order";

export function OrderForm() {
  const [state, action] = useActionState(placeOrder, { errors: {} });

  return (
    <form action={action} className="max-w-(--container-form) space-y-4">
      <Field label="Nomor HP" error={state.errors?.phone} required>
        {(a11y) => <Input {...a11y} name="phone" type="tel" autoComplete="tel" />}
      </Field>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" loading={pending} className="w-full">
      Bayar
    </Button>
  );
}
```

`useFormStatus` must be called from a component **inside** the form, not the one that
renders it — that is the whole reason `SubmitButton` is a separate component.

### Accessibility

- Placeholders are not labels. Every control has a visible `<label>`.
- Errors go next to the field and are tied by `aria-describedby`. A summary at the top of
  the form is a useful addition, never a substitute.
- On a failed submit, move focus to the first invalid field.
- `inputMode="numeric"` on phone and quantity fields so phones show the number pad.
- Required is marked in the label with a real `required` attribute on the control. The
  asterisk is `aria-hidden` because `required` already announces it.

---

## 17. QuantityStepper — REMOVED

**Removed with the cart.** Kept here because the labelling rule below still applies to any
repeated control in a list. Party size on the reservation form uses
`<input type="number" min={1} max={8} inputMode="numeric">` instead: native, keyboard- and
screen-reader-friendly out of the box, and no client state.

### Anatomy

```
 +----+  +------+  +----+
 | -  |  |  2   |  | +  |
 +----+  +------+  +----+
   44px    numeric   44px
```

| Property | Value |
| --- | --- |
| Buttons | `IconButton size="md"` — 44px, non-negotiable |
| Value | `text-base font-semibold numeric`, `w-10 text-center` |
| Container | `inline-flex items-center rounded-pill border border-border-strong` |
| Minus at 1 | Becomes a trash icon labelled `Hapus dari keranjang` |
| Max | Disabled at stock limit, with a helper line stating the limit |

```tsx
"use client";

export function QuantityStepper({
  value,
  max,
  itemName,
  onChange,
  onRemove,
}: {
  value: number;
  max: number;
  itemName: string;
  onChange: (next: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-pill border border-border-strong">
      {value === 1 ? (
        <IconButton label={`Hapus ${itemName} dari keranjang`} onClick={onRemove}>
          <TrashIcon className="size-4" />
        </IconButton>
      ) : (
        <IconButton label={`Kurangi ${itemName}`} onClick={() => onChange(value - 1)}>
          <MinusIcon className="size-4" />
        </IconButton>
      )}

      <span className="numeric w-10 text-center text-base font-semibold text-ink">
        {value}
      </span>

      <IconButton
        label={`Tambah ${itemName}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon className="size-4" />
      </IconButton>
    </div>
  );
}
```

Labels name the item (`Tambah es kopi susu`), because a cart with five lines otherwise
gives a screen-reader user five identical "Tambah" buttons.

Quantity changes update the cart total, which is an async result — announce it through the
cart's `aria-live` region.

---

## 18. Sheet

The cart drawer, and the mobile nav. `'use client'`.

| Property | Value |
| --- | --- |
| Position | Right on `≥sm`, bottom on `<sm` |
| Width | `min(26rem, 100vw)` side, full width bottom |
| Height | Full side, `max-h-[85dvh]` bottom |
| Background | `bg-surface` |
| Radius | `rounded-l-card` side, `rounded-t-card` bottom |
| Shadow | `shadow-overlay` |
| Scrim | `bg-scrim`, `z-(--z-overlay)` |
| Layer | `z-(--z-modal)` |
| Enter | `translate-x-full` → `0` (side), `translate-y-full` → `0` (bottom), 320ms `ease-cup` |

### Structure

Header (title plus close), a scrollable body, and a footer that stays pinned — the cart
total and the pay button must never scroll out of reach.

### Implementation

Use the native `<dialog>` element. It gives focus trapping, Escape, `::backdrop`, and
inertness for the rest of the page without a library or a `useEffect`.

```tsx
"use client";

import { useEffect, useRef } from "react";

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={title}
      className={cn(
        "bg-surface text-ink shadow-overlay backdrop:bg-scrim",
        "m-0 ml-auto h-dvh w-[min(26rem,100vw)] max-w-none rounded-l-card",
        "max-sm:mt-auto max-sm:ml-0 max-sm:h-auto max-sm:max-h-[85dvh] max-sm:w-full",
        "max-sm:rounded-l-none max-sm:rounded-t-card",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-xl font-semibold type-display-small">{title}</h2>
          <IconButton label="Tutup" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && <div className="border-t border-border bg-surface p-4">{footer}</div>}
      </div>
    </dialog>
  );
}
```

`showModal()` handles focus trapping, Escape, and making the rest of the page inert.
Reimplementing that with `useEffect` and a keydown listener is how those behaviours end up
subtly wrong.

Two things `<dialog>` does not do for you:

- **Background scroll.** Add `overflow: hidden` on `<body>` while it is open.
- **Exit animation.** `close()` removes it immediately. Either accept an instant close or
  drive it with `@starting-style` and `transition-behavior: allow-discrete`.

Focus returns to the trigger automatically on close.

---

## 19. Toast

Confirmation for actions that do not navigate: added to cart, order placed, item removed.

| Property | Value |
| --- | --- |
| Position | Bottom centre mobile, bottom right `≥sm` |
| Width | `min(24rem, calc(100vw - 2rem))` |
| Background | `bg-surface-inverse` |
| Text | `text-ink-inverse` |
| Radius | `rounded-card` |
| Shadow | `shadow-float` |
| Layer | `z-(--z-toast)` |
| Duration | 4s default, 8s with an action, never auto-dismiss an error |
| Enter | fade plus 12px rise, 200ms `ease-cup` |
| Max visible | 3, oldest dismissed first |

| Variant | Icon | Use |
| --- | --- | --- |
| `success` | Check, `text-success` | `Ditambahkan ke keranjang` |
| `info` | Info, `text-info` | `Pesanan sedang disiapkan` |
| `error` | Alert, `text-danger` | `Pembayaran ditolak bank.` Never auto-dismisses |

An action slot holds one `Button variant="ghost" size="sm"` — `Urungkan` after a removal,
`Lihat pesanan` after checkout.

### Accessibility

- The container is `role="status" aria-live="polite"` for success and info.
- Errors are `role="alert" aria-live="assertive"`, and they do not disappear on a timer —
  something a person needs to act on must not vanish while they are reading it.
- A toast is never the only place important information appears. If the order failed, the
  page says so too.
- Hovering or focusing a toast pauses its timer.

### Copy

The toast echoes the verb from the button that caused it. `Tambah ke keranjang` produces
`Ditambahkan ke keranjang`. Not `Berhasil disimpan`.

---

## 20. Skeleton, EmptyState, ErrorState

The three states every async surface needs. Building only the happy path is the most
common way a screen ends up broken in production.

### Skeleton

Shape-matched to what is loading, never a generic grey box. A menu grid's skeleton is
cards with a square block, two text lines, and a price row — the same sizes as the real
thing, so nothing jumps when data arrives.

```tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-thumb bg-surface-muted bg-[length:180%_100%]",
        "bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-saucer-400)_35%,transparent),transparent)]",
        className,
      )}
    />
  );
}
```

Skeletons are `aria-hidden`; the loading state is announced once by the region's
`aria-busy`, not by twelve pulsing rectangles. Use them with `loading.tsx` and `<Suspense>`
so streaming does the work.

### EmptyState

An invitation, not a dead end.

| Slot | Spec |
| --- | --- |
| Icon | 40px, `text-ink-muted`, optional |
| Title | `text-lg font-semibold text-ink` |
| Body | `text-base text-ink-secondary max-w-(--measure-prose)` |
| Action | `Button variant="secondary"` — required |
| Container | `rounded-card border border-border bg-surface-sunken p-8 text-center` |

The action is required by the spec. An empty state with nothing to do is a bug report
waiting to happen.

| Situation | Title | Body | Action |
| --- | --- | --- | --- |
| Empty cart | `Keranjang masih kosong` | `Es kopi susu paling laris pagi ini.` | `Lihat menu` |
| No search results | `Tidak ada menu yang cocok dengan "affogato"` | `Coba kata lain, atau lihat semua menu.` | `Lihat semua menu` |
| No orders yet | `Belum ada pesanan` | `Pesanan kamu akan muncul di sini.` | `Mulai pesan` |

### ErrorState

Says what happened and what to do next. Uses `error.tsx` in the App Router, which is a
client component and receives a `reset` function.

```tsx
"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-card border border-border bg-surface-sunken p-8 text-center">
      <h2 className="text-lg font-semibold text-ink">Menu gagal dimuat</h2>
      <p className="mx-auto mt-2 max-w-(--measure-prose) text-base text-ink-secondary">
        Koneksi terputus sebelum menu selesai dimuat. Coba muat ulang.
      </p>
      <Button variant="secondary" onClick={reset} className="mt-6">
        Muat ulang
      </Button>
    </div>
  );
}
```

Never `Terjadi kesalahan`. Name the thing that failed, and give the person the button that
retries it.

---

## Component checklist

Before a component is done:

- [ ] Server Component unless interactivity genuinely requires `'use client'`
- [ ] Only tokens — no raw hex, px, or `rgba()`
- [ ] Radius is smaller than its parent's
- [ ] Shadow only if it is interactive or floating; otherwise a border
- [ ] Rest, hover, active, focus, disabled, loading, empty, and error all specified
- [ ] Visible `:focus-visible` ring, 44px minimum hit area
- [ ] Keyboard reachable and operable; Escape closes anything that overlays
- [ ] Works at 320px wide and at 200% zoom
- [ ] Readable in both themes, at the ratios in the style guide
- [ ] Motion respects `prefers-reduced-motion`, and state stays visible without it
- [ ] Copy follows [Voice and copy](./01-style-guide.md#7-voice-and-copy)
- [ ] Its row exists in this document
