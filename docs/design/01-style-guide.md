# Style Guide

## 1. Design direction

### The idea: a warm cup on a cool saucer

The reference in `references/1.png` does something more interesting than the usual coffee
page, and it is worth naming because everything else follows from it: the ground behind
the content is **cool** — a faintly mauve grey (`#F3EEF0`) — while every element placed on
it is **warm**, from the roast browns to the palm-sugar amber. The browns read warmer than
they are because of what sits behind them. A cream background would have flattened that
contrast into a single beige note.

So: **cool ground, warm content, one bright amber.** That relationship is the system's
whole colour logic, and it is not negotiable per-screen.

The second device from the reference is structural. Content does not run edge to edge — it
sits on a large rounded surface inset from the ground, like a cup set down on a saucer. We
call that surface **the tray**, and it is the only place a 32px radius is allowed.
Everything nested inside it gets a smaller radius. Radius encodes depth, not taste.

### Where boldness is spent

One place: **the display type**. Fraunces set large, soft, and slightly wonky, doing the
work a hand-painted shop sign does. Everything around it — the nav, the cards, the buttons,
the menu rows — stays quiet, tight, and conventional so the headline has room to be the
thing you remember.

Corollary: if a screen has no display type on it, it should look almost plain. That is
correct, not unfinished.

### Things this system deliberately does not do

These are common, they are not wrong in general, and they are wrong here because they would
dilute the one idea above.

| Not this | Because |
| --- | --- |
| Cream or beige page backgrounds | Kills the warm/cool tension the palette is built on |
| Terracotta or clay accents | Sits between the brown and the amber and muddies both |
| Uniform border radius across all elements | Radius is our depth cue; flattening it removes information |
| A grey `rgba(0,0,0,.1)` shadow | Shadows are brown-tinted; a neutral shadow reads as dirt on a warm surface |
| Tracked-out ALL-CAPS eyebrow labels above headings | The heading is already the label |
| A monospace face for prices, weights, or metadata | Plus Jakarta Sans has tabular figures; a second face is not needed |
| An arrow glyph appended to button and link text | The word says what happens; the arrow is redundant unless it is a real icon in a real slot |
| Meta strings joined with middle dots | Use a definition list or a table; dots hide structure |
| `01 / 02 / 03` markers on non-sequential content | Numbers promise an order. Only the brew guide has one |
| Fade-and-slide-up on every section as you scroll | Motion is reserved; see [Motion](#5-motion) |

---

## 2. Colour

Four ramps and three status hues. Full values and utilities are in
[`02-design-tokens.md`](./02-design-tokens.md); this section is about **when** to use them.

### The ramps

**`roast`** — the brand brown, from cinnamon to burnt espresso. Sampled from the
reference's buttons (`#6A3810`) and headline ink (`#471D00`). Carries the brand: primary
buttons, headings, body ink, dark-mode surfaces.

**`aren`** — palm sugar amber, `#FDB64A` at its centre, sampled from the reference's price
badge. This is the shop's single bright note. It appears **once per viewport, at most**: a
price badge, a promo pill, or a selected state — never two at the same time, never as body
text.

**`saucer`** — the cool mauve-grey neutrals. Page ground, borders, dividers, disabled
fills. Never used for text.

**`silt`** — warm-grey text tones for anything below primary ink: body copy (`#685643`,
sampled from the reference), captions, helper text, placeholders.

**Status** — `pandan` (green, success), `cabai` (red, destructive and errors), `langit`
(blue, informational and order tracking). Status colour never carries meaning alone: always
pair with an icon and a word.

### Assignment rules

- **Text ink is `roast-800`** (`#471D00`), not black. Pure black on a warm palette reads as
  a hole in the page.
- **Amber is a surface, never a foreground.** `aren-400` on the ground gives 1.92:1 — far
  below any text threshold. When you need amber-coloured text, use `aren-700` (`#8A5209`,
  5.56:1), and only for a short label.
- **Ink on amber is fine**: `roast-800` on `aren-400` is 8.29:1. That is why the price
  badge in the reference works.
- **Borders come in two strengths.** `--color-border` is decorative (card edges, dividers)
  and may be low-contrast. `--color-border-strong` is for anything a person operates — input
  outlines, checkbox boxes, segmented control edges — and holds at least 3:1 against its
  background, as WCAG 1.4.11 requires.
- **Never encode state in fill alone.** A selected chip changes fill *and* weight *and*
  gains a check. An out-of-stock item is dimmed *and* labelled.

### Text on photography

The one place in this system where a token cannot guarantee contrast. Photographs vary; a
palette does not.

- Use `--scrim-photo`, a **gradient** — dark where the type sits, near-clear at the top. A
  flat overlay meets the contrast number and kills the photograph doing it.
- **Measure the result against the image actually used**, at the darkest and the lightest
  patch behind the text. An assumed ratio is not a ratio.
- Text over photography is always white or `saucer-50`, never `ink` — a warm dark brown on a
  photograph reads as a smudge.
- Keep the text block in the lower half, where the scrim is strongest. Type floating over the
  middle of an image is the treatment that most often fails on a photo swap.
- If a photo cannot carry text at 4.5:1 even with the scrim, the photo is wrong for a hero.
  Crop it, replace it, or move the text out of the image.

### Dark mode

Dark mode is the shop after closing: ground `roast-950`, surfaces `roast-900`, ink
`saucer-50`. Amber steps up to `aren-300` (`#FDCB79`) because `aren-400` is too heavy
against near-black.

Implemented as a class-based variant, not `prefers-color-scheme` alone, so a person can
override the OS. Tailwind v4 needs this declared explicitly — see `app/tokens.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Set the class on `<html>` and mirror it in `<meta name="color-scheme">` so form controls and
scrollbars follow.

### Verified contrast

Measured, not estimated. All values are WCAG 2.1 contrast ratios.

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `ink` `#471D00` on ground `#F3EEF0` | 12.68:1 | AAA |
| `ink` on white | 14.55:1 | AAA |
| `ink-secondary` `#685643` on ground | 6.10:1 | AAA (normal text) |
| `ink-muted` `#756751` on ground | 4.80:1 | AA (normal text) |
| White on `primary` `#6A3810` | 9.61:1 | AAA |
| `ink` on `aren-400` `#FDB64A` | 8.29:1 | AAA |
| `aren-700` `#8A5209` on ground | 5.56:1 | AA |
| `pandan-600` `#2F7A4F` on ground | 4.55:1 | AA |
| `cabai-600` `#B3261E` on ground | 5.70:1 | AA |
| `langit-600` `#1F6F8B` on ground | 4.94:1 | AA |
| `border-strong` `#8E8288` on ground | 3.21:1 | AA (non-text, 1.4.11) |
| Dark: `saucer-50` on `roast-950` | 16.81:1 | AAA |
| Dark: `silt-200` `#B5A897` on `roast-950` | 8.28:1 | AAA |
| Dark: `aren-300` on `roast-950` | 12.86:1 | AAA |
| Dark: `border-strong` `#8A6647` on `roast-900` | 3.38:1 | AA (non-text) |
| Hero heading, white on `hero.jpg` + `--scrim-photo` | 6.41:1 | AA (measured on the image, worst of 7 widths) |
| Hero lead, white/85% on the same | 6.58:1 | AA (alpha composited, not assumed) |

Two values fall below threshold. They are kept on purpose and fenced:

| Pair | Ratio | Allowed for |
| --- | --- | --- |
| `aren-400` on ground | 1.92:1 | Fills, badges, illustration only — never text |
| `border` `#D8CFD3` on ground | 1.33:1 | Decorative dividers only — never an operable control |

---

## 3. Typography

### The pairing

**Fraunces** for display. A variable old-style serif with `SOFT` and `WONK` axes that let it
go from sober to hand-lettered. Set large it has the warmth of a painted shop sign; that is
the whole reason it is here. It is a **display face only** — never below 24px, never for body
copy, never for UI labels.

**Plus Jakarta Sans** for everything else. It is an Indonesian typeface — commissioned for
Jakarta's city identity — which gives it a provenance a neutral grotesque does not have, and
it is simply excellent at 14–18px, where most of this product lives. Its tabular figures
handle every price and weight in the app, which is why there is no third face.

A correction worth keeping visible: this face was originally chosen here on the argument that
it *is* Jakarta's city typeface, back when the shop was written as a Jakarta kedai. The shop
is in Jembrana, Bali, so that argument no longer holds. The face stays on its own merits —
Indonesian provenance and quality at UI sizes — not on a civic association that does not
apply. A rationale that has quietly stopped being true is worse than no rationale.

Two families, clearly distinct. No mono.

### Loading them

`app/layout.tsx`:

```tsx
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const display = Fraunces({
  variable: "--ff-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  variable: "--ff-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
```

Notes that matter:

- `--ff-*`, not `--font-*`. The Tailwind theme tokens `--font-sans` and `--font-display`
  point *at* these, so reusing the names would make them self-referential.
- `weight` is omitted, so `next/font` fetches the **variable** font. Do not pass a weight
  array — that downloads static instances and loses the axes.
- `axes` may not include `wght`; `next/font` always includes it. Listing it throws.
- `lang="id"` — the interface is Indonesian. This drives hyphenation and screen-reader
  pronunciation, and it is wrong in the current scaffold.
- Fonts are declared once, in the root layout. Never call a font loader inside a component;
  each call is a separate download.

### Scale

A major third (1.25) through the UI sizes, opening up for display. Sizes are rem; px
equivalents shown at a 16px root.

| Token | Size | Line height | Tracking | Use |
| --- | --- | --- | --- | --- |
| `text-2xs` | 0.6875rem / 11px | 1rem | 0.01em | Legal, footnotes. Nothing operable |
| `text-xs` | 0.75rem / 12px | 1.125rem | 0.005em | Badge text, table meta |
| `text-sm` | 0.875rem / 14px | 1.375rem | 0 | Helper text, captions, dense UI |
| `text-base` | 1rem / 16px | 1.625rem | 0 | Body default. Minimum for anything read |
| `text-lg` | 1.125rem / 18px | 1.8125rem | 0 | Lead paragraphs, menu item names |
| `text-xl` | 1.25rem / 20px | 1.875rem | −0.005em | Card titles |
| `text-2xl` | 1.5rem / 24px | 2rem | −0.01em | Sub-section headings |
| `text-3xl` | 1.875rem / 30px | 2.375rem | −0.015em | Section headings |
| `text-display-sm` | 2.25rem / 36px | 2.625rem | −0.02em | Page titles |
| `text-display-md` | 3rem / 48px | 3.25rem | −0.022em | Secondary hero |
| `text-display-lg` | 4rem / 64px | 4.125rem | −0.025em | Hero, tablet and up |
| `text-display-xl` | 5rem / 80px | 5rem | −0.03em | Hero, wide desktop only |

Display sizes get negative tracking because Fraunces opens up as it grows; without it the
hero looks loose. Body sizes get none — Plus Jakarta Sans is already correctly fitted.

### Weights

| Role | Family | Weight |
| --- | --- | --- |
| Hero and page titles | Fraunces | 600 |
| Section headings | Fraunces | 600 |
| Card titles, menu names | Plus Jakarta Sans | 600 |
| Body | Plus Jakarta Sans | 400 |
| Emphasis in body | Plus Jakarta Sans | 600 |
| Buttons and controls | Plus Jakarta Sans | 600 |
| Helper and caption | Plus Jakarta Sans | 400 |
| Prices | Plus Jakarta Sans | 600, `tabular-nums` |

Weights below 400 are not in the system. Thin type on a warm palette goes muddy.

### Fraunces variation axes

Fraunces is only interesting if the axes are actually driven. Three presets, shipped as
Tailwind utilities in `app/tokens.css`:

```css
/* Hero — the one loud moment. Soft, wonky, alive. */
@utility type-hero {
  font-variation-settings: "SOFT" 40, "WONK" 1, "opsz" 96;
}
/* Section headings — softened, sober. */
@utility type-section {
  font-variation-settings: "SOFT" 20, "WONK" 0, "opsz" 36;
}
/* Small display, 24–30px. Defaults; below 24px Fraunces breaks down. */
@utility type-display-small {
  font-variation-settings: "SOFT" 0, "WONK" 0, "opsz" 24;
}
```

`opsz` should roughly track the rendered size. It is what keeps the hero from looking like a
scaled-up body serif.

### Measure and rhythm

- Body copy: **60–72 characters** per line. `max-w-prose` in this system is set to `62ch`,
  not Tailwind's default `65ch`, because Plus Jakarta Sans runs slightly wide.
- Display copy: **20–30 characters** per line. The reference's hero breaks after two or
  three words per line and that is the intent — set a `max-w` on hero text and let it wrap
  where the box says, rather than inserting `<br>`.
- Never centre a paragraph longer than two lines. Headings may centre; body copy is
  left-aligned as the default across the whole product.
- Use `text-balance` on headings of two to three lines and `text-pretty` on paragraphs.

### Numbers

Every price, weight, quantity, rating, and countdown uses `tabular-nums`. In a menu list,
prices are right-aligned in their own column so the rupiah figures form a clean edge.
Format: `Rp 18.000` — space after `Rp`, full stop as the thousands separator, no decimals.
Format with `Intl.NumberFormat("id-ID")`, never by hand.

---

## 4. Layout

### The tray

The signature structure. A page's main content sits on a surface inset from the ground:

```
+--------------------------------------------------+  <- ground (saucer-50)
|  +--------------------------------------------+  |
|  |                                            |  |  <- tray (surface)
|  |   header . hero . sections                 |  |     radius-tray, shadow-tray
|  |                                            |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

- The tray is inset **24px on desktop, 12px on tablet, and 0 on mobile** — below 640px it
  goes full-bleed and drops its radius. Screen real estate beats the device on a phone.
- One tray per page. Nested trays are not a thing.
- The tray is the only 32px radius in the system.

### Grid and containers

| Token | Value | Use |
| --- | --- | --- |
| `--container-tray` | 75rem / 1200px | Max width of tray content |
| `--container-prose` | 42rem / 672px | Long-form: about, brew guides, policies |
| `--container-form` | 28rem / 448px | Sign in, checkout steps |

Twelve columns at `lg` and up, six at `md`, one below. Gutters: 20px mobile, 32px tablet,
48px desktop.

### Spacing

4px base. Use the scale; do not invent values between steps.

Component-internal spacing lives on the 4/8/12/16/24 steps. Between-section rhythm uses
dedicated tokens so vertical spacing is consistent across pages built months apart:

| Token | Mobile | Desktop |
| --- | --- | --- |
| `--space-section` | 64px | 96px |
| `--space-section-lg` | 96px | 144px |
| `--space-block` | 32px | 40px |
| `--space-gutter` | 20px | 48px |

Vertical rhythm is set on the **parent** with `space-y-*` or `gap-*`, never with margins on
children. Sibling margins collide and are the single most common source of layout drift in a
Tailwind codebase.

### Radius hierarchy

Non-negotiable, because it is how depth is communicated.

| Token | Value | Applies to |
| --- | --- | --- |
| `--radius-tray` | 32px | The page tray, hero surfaces, full-bleed feature panels |
| `--radius-card` | 16px | Product cards, menu cards, modals, sheets |
| `--radius-control` | 12px | Inputs, selects, textareas, small buttons |
| `--radius-thumb` | 8px | Image thumbnails, avatars in lists, tags |
| `--radius-pill` | 9999px | Buttons, chips, nav pills, badges, the cart bubble |

Rule: a child's radius is always **smaller** than its parent's. A card inside the tray is
16px; an input inside that card is 12px; a thumbnail inside the input row is 8px.

### Elevation

Shadows are brown-tinted (`rgba(71, 29, 0, …)`) so they read as shade on a warm surface
rather than grey grime.

| Token | Meaning |
| --- | --- |
| `--shadow-rest` | A surface that can be picked up but is currently flat |
| `--shadow-lift` | Hover and focus on an interactive card |
| `--shadow-float` | Dropdowns, popovers, the sticky mobile order bar |
| `--shadow-overlay` | Modals, drawers, sheets |
| `--shadow-tray` | The tray only |

**Static content does not get a shadow.** A card that is not clickable gets a border. If
every card on a page carries the same shadow, the shadow has stopped carrying information —
that is the SaaS-card look, and the border/shadow split above is what prevents it.

### Z-index

| Token | Value | Layer |
| --- | --- | --- |
| `--z-base` | 0 | Page content |
| `--z-raised` | 10 | Sticky column headers, hover cards |
| `--z-header` | 100 | Sticky site header |
| `--z-dropdown` | 200 | Menus, popovers, comboboxes |
| `--z-overlay` | 900 | Scrims |
| `--z-modal` | 1000 | Dialogs, drawers |
| `--z-toast` | 1100 | Toasts — always on top |

No arbitrary z-index in component code. If a stacking bug needs a new layer, it needs a new
token and a note about why.

---

## 5. Motion

### The single orchestrated moment

One, on the home page, on first load: the hero cups settle in from a slight offset while the
display headline resolves. Roughly 600ms, staggered by 60ms, using `--ease-cup`. It happens
once per session — store a flag; a regular ordering their morning coffee should not watch an
animation every day.

Everything else in the product responds to input. Nothing animates because you scrolled past
it.

### Reactive motion

| Interaction | Duration | Easing | Property |
| --- | --- | --- | --- |
| Button or chip press | `--duration-fast` 120ms | `--ease-standard` | `background-color`, `transform` |
| Hover on interactive card | `--duration-base` 200ms | `--ease-standard` | `box-shadow`, `transform` |
| Sheet or drawer open | `--duration-slow` 320ms | `--ease-cup` | `transform` |
| Toast enter and exit | `--duration-base` 200ms | `--ease-cup` | `opacity`, `transform` |
| Accordion, disclosure | `--duration-base` 200ms | `--ease-standard` | `grid-template-rows` |
| Skeleton shimmer | 1.4s loop | `linear` | `background-position` |

- Animate `transform` and `opacity`. Animating `width`, `height`, `top`, or `left` costs
  layout on every frame and will be visible on the mid-range Android phones most of this
  audience uses.
- Transform distances stay small: 4–8px for hover, 12px for entrances. Anything larger reads
  as a bounce.

### Reduced motion

Non-negotiable, and it belongs in the global stylesheet so no component can forget it. It
ships in `app/tokens.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

State changes must remain **visible** without motion. A sheet that only communicates "open"
through a slide is broken under reduced motion; it also needs the scrim and the focus move.

---

## 6. Iconography and imagery

### Icons

24px on a 24px grid, 1.5px stroke, round caps and joins, `currentColor` — never a hard-coded
fill. At 16px use a 1.25px stroke so the shape does not clog.

Icons that carry meaning alone (icon-only buttons) need an `aria-label`. Icons beside a label
are decoration: `aria-hidden="true"` so screen readers do not read them twice.

### Photography

The product is drinks, and drinks photograph well, so photography does the heavy lifting
rather than illustration.

- Square (1:1) for menu and product cards; 3:2 landscape for editorial and hero.
- Shot on or composited onto the cool ground so cut-outs sit naturally on the page.
- Warm key light, single source, soft shadow — matching `--shadow-float`'s direction.
- Every image through `next/image` with explicit `width`/`height` (or `fill` in a sized
  parent) so there is no layout shift.
- `alt` describes what the customer would need to know if the image failed to load:
  `alt="Es kopi susu gula aren, gelas 16 oz"`. Decorative images get `alt=""`.
- `priority` on the hero image only. Everywhere else lazy loading is correct.

---

## 7. Voice and copy

Indonesian, sentence case, plain. The tone is a barista who knows your order — friendly,
brief, never chatty and never salesy.

### Rules

- **Say what the button does.** `Pesan sekarang`, `Tambah ke keranjang`, `Bayar` — not
  `Kirim`, not `Lanjut` on its own, not `Submit`.
- **Keep a verb's name across the whole flow.** The button says `Tambah ke keranjang`, so the
  toast says `Ditambahkan ke keranjang`. Not `Berhasil disimpan`.
- **Errors say what happened and what to do next**, in the interface's voice. Not `Terjadi
  kesalahan`, but `Pembayaran ditolak bank. Coba kartu lain atau bayar dengan QRIS.`
- **Empty states are invitations.** Not `Keranjang kosong`, but `Keranjang masih kosong.
  Lihat menu hari ini` with a link that goes to the menu.
- **Never apologise in an error.** Fix the person's problem instead.
- **Name things the way a customer would.** `Es kopi susu`, not `Iced milk coffee (variant
  A)`. Menu language belongs to the shop, not the database.
- **No exclamation marks** outside a genuine celebration, such as a first order completing.
  One per screen at most, and usually zero.
- **Numbers are specific.** `Siap dalam 8 menit`, not `Siap sebentar lagi`.

### Micro-copy reference

| Situation | Write | Not |
| --- | --- | --- |
| Primary CTA, hero | `Pesan sekarang` | `Mulai` / `Klik di sini` |
| Add to cart | `Tambah ke keranjang` | `+ Keranjang` |
| Cart empty | `Keranjang masih kosong. Lihat menu hari ini.` | `Tidak ada item.` |
| Sold out | `Habis hari ini` | `Tidak tersedia` |
| Loading a menu | `Memuat menu…` | `Mohon tunggu…` |
| Payment failed | `Pembayaran ditolak bank. Coba kartu lain atau bayar dengan QRIS.` | `Gagal! Silakan coba lagi.` |
| Search, no results | `Tidak ada menu yang cocok dengan "affogato". Coba kata lain.` | `0 hasil ditemukan` |
| Order confirmed | `Pesanan diterima. Siap diambil dalam 8 menit.` | `Sukses!` |
| Required field | `Nomor HP diperlukan untuk konfirmasi pesanan.` | `Field ini wajib diisi` |

---

## 8. Accessibility floor

Not a phase at the end. These are build-time requirements, and a component that misses one is
unfinished.

- **Contrast**: 4.5:1 for text under 24px, 3:1 for text at 24px and above and for the
  boundaries of anything operable. Verified values are in the
  [colour section](#verified-contrast).
- **Focus is always visible.** A 2px ring in `--color-focus` with a 2px offset, on
  `:focus-visible`. `outline: none` without a replacement ring is a defect. The ring is
  `roast-800` on light surfaces (12.68:1) and `aren-300` on dark (11.61:1).
- **Target size.** Two floors, because one number for everything is either unachievable or
  makes the design worse:
  - **44×44px** for anything a thumb operates — buttons, chips, icon buttons, the quantity
    stepper, the cart, every close button, nav items. Visual size may be smaller; the hit
    area may not. Short controls carry the `touch-target` utility, which extends the hit
    area to 44px with a pseudo-element without changing how the control looks.
  - **24×24px with clear separation** (WCAG 2.2 SC 2.5.8, AA) for text links in a list or
    a paragraph — footer links, "Buka di peta", inline links in body copy. Making these
    44px tall would space a footer list out to no purpose. Links inline in a sentence are
    exempt from the SC entirely; list links still need the 24px box or 24px of spacing.

  If a control is ambiguous, it gets 44.
- **Everything works from the keyboard**: tab order follows reading order, Escape closes
  overlays, Enter and Space activate, arrow keys move within tabs and menus.
- **Modals and drawers trap focus**, move focus in on open, return it to the trigger on close,
  and mark the rest of the page `inert`.
- **Live regions for async results.** Cart count changes, toasts, and form errors go through
  `aria-live="polite"`; only a payment failure justifies `assertive`.
- **Real semantics.** One `<h1>` per page, no skipped heading levels, `<button>` for actions,
  `<a>` for navigation, `<ul>` for lists. A `<div>` with an `onClick` is a bug.
- **Forms**: every input has a visible `<label>` (placeholders are not labels), errors are tied
  by `aria-describedby`, invalid fields carry `aria-invalid`, and the error text sits next to
  the field, not only in a summary.
- **`lang="id"`** on `<html>`, and `lang="en"` on any English fragment inside.
- Test at **200% zoom** and at **320px width** with no horizontal scroll.
