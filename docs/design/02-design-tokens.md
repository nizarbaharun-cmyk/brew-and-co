# Design Tokens

Every value in the system, its Tailwind utility, and the rule for using it. The
implementation is [`app/tokens.css`](../../app/tokens.css) — this document explains it. If
the two disagree, `app/tokens.css` is right and this file needs fixing.

## How the file is layered

Tailwind v4 has no `tailwind.config.js`. Configuration is CSS, in four layers:

1. **Primitives** (`@theme`) — raw ramps and scales. Static, identical in both themes.
   `bg-roast-600` is a primitive utility.
2. **Semantic aliases** (`:root` and `.dark`) — role tokens like `--primary`, `--ink`.
   These flip between themes.
3. **Semantic bridge** (`@theme inline`) — publishes the role tokens as utilities.
   `bg-primary` is a semantic utility.
4. **Non-theme tokens** (plain `:root` vars) — z-index, durations, section rhythm.
   Tailwind has no namespace for these, so they are consumed with the arbitrary-value
   shorthand: `z-(--z-header)`.

`@theme inline` is load-bearing. It makes `bg-primary` emit `background-color:
var(--primary)` rather than `background-color: var(--color-primary)`, so the utility
picks up whichever scope it renders in. Drop `inline` and dark mode stops working.

**Reach for semantic tokens.** `bg-surface` and `text-ink`, not `bg-saucer-0` and
`text-roast-800`. Primitives exist so semantic tokens have something to point at; use
them directly only when building an illustration, a chart, or a brand asset that is
genuinely outside the UI's role vocabulary.

---

## Colour primitives

### `roast` — the brand brown

Sampled from the reference's button fill and headline ink.

| Token | Hex | Utility | Used by |
| --- | --- | --- | --- |
| `--color-roast-50` | `#FBF6F2` | `bg-roast-50` | — |
| `--color-roast-100` | `#F3E7DC` | `bg-roast-100` | `--primary-subtle`, dark `--primary` |
| `--color-roast-200` | `#E4CBB6` | `bg-roast-200` | dark `--primary-hover` |
| `--color-roast-300` | `#CDA687` | `bg-roast-300` | dark `--primary-active` |
| `--color-roast-400` | `#A97A50` | `bg-roast-400` | — |
| `--color-roast-500` | `#8A5A32` | `bg-roast-500` | — |
| `--color-roast-600` | `#6A3810` | `bg-roast-600` | `--primary` |
| `--color-roast-700` | `#552B0A` | `bg-roast-700` | `--primary-hover` |
| `--color-roast-800` | `#471D00` | `bg-roast-800` | `--ink`, `--focus`, `--accent-ink` |
| `--color-roast-900` | `#2E1206` | `bg-roast-900` | `--surface-inverse`, dark `--surface` |
| `--color-roast-950` | `#1A0A03` | `bg-roast-950` | dark `--bg` |

### `aren` — palm sugar amber

The single bright note. **One per viewport, at most.** Never a text colour below
step 700.

| Token | Hex | Utility | Notes |
| --- | --- | --- | --- |
| `--color-aren-50` | `#FFF9EE` | `bg-aren-50` | — |
| `--color-aren-100` | `#FEF0D6` | `bg-aren-100` | `--accent-subtle` |
| `--color-aren-200` | `#FDE0AC` | `bg-aren-200` | dark `--accent-hover` |
| `--color-aren-300` | `#FDCB79` | `bg-aren-300` | dark `--accent`, dark `--focus` |
| `--color-aren-400` | `#FDB64A` | `bg-aren-400` | `--accent`. 1.92:1 on ground — fills only |
| `--color-aren-500` | `#EE9E22` | `bg-aren-500` | `--accent-hover` |
| `--color-aren-600` | `#C87C11` | `bg-aren-600` | Icon strokes on light |
| `--color-aren-700` | `#8A5209` | `text-aren-700` | Lowest step legible as text on light, 5.56:1 |
| `--color-aren-800` | `#6B3D06` | `text-aren-800` | Text on `aren-100`, 8.13:1 |

### `saucer` — cool mauve neutrals

Grounds, borders, dividers, disabled fills. **Never a text colour.**

| Token | Hex | Utility | Used by |
| --- | --- | --- | --- |
| `--color-saucer-0` | `#FFFFFF` | `bg-saucer-0` | `--surface`, `--primary-ink` |
| `--color-saucer-25` | `#FAFAFA` | `bg-saucer-25` | — |
| `--color-saucer-50` | `#F3EEF0` | `bg-saucer-50` | `--bg`, `--surface-sunken`, `--ink-inverse` |
| `--color-saucer-100` | `#E9E2E5` | `bg-saucer-100` | `--surface-muted` |
| `--color-saucer-200` | `#D8CFD3` | `border-saucer-200` | `--border` |
| `--color-saucer-300` | `#C3B8BD` | `bg-saucer-300` | Disabled fills |
| `--color-saucer-400` | `#A79BA1` | `bg-saucer-400` | Skeleton shimmer highlight |
| `--color-saucer-500` | `#8E8288` | `border-saucer-500` | `--border-strong`, 3.21:1 |
| `--color-saucer-600` | `#6E646A` | `bg-saucer-600` | — |

### `silt` — warm text greys

Everything below primary ink.

| Token | Hex | Utility | Used by |
| --- | --- | --- | --- |
| `--color-silt-100` | `#D7CDC0` | `text-silt-100` | — |
| `--color-silt-200` | `#B5A897` | `text-silt-200` | dark `--ink-secondary`, 8.28:1 |
| `--color-silt-300` | `#8A7C6C` | `text-silt-300` | `--ink-disabled`, dark `--ink-muted` |
| `--color-silt-400` | `#756751` | `text-silt-400` | `--ink-muted`, 4.80:1 |
| `--color-silt-500` | `#685643` | `text-silt-500` | `--ink-secondary`, 6.10:1 |
| `--color-silt-600` | `#4F4234` | `text-silt-600` | — |

### Status hues

Status never carries meaning alone — always pair with an icon and a word.

| Ramp | 100 | 300 | 600 | 700 | 900 |
| --- | --- | --- | --- | --- | --- |
| `pandan` (success) | `#DFF1E7` | `#7FC79B` | `#2F7A4F` | `#24603E` | `#1E3A2A` |
| `cabai` (danger) | `#FBE7E5` | `#F2A099` | `#B3261E` | `#8F1D17` | `#3A1F1C` |
| `langit` (info) | `#DFF0F5` | `#7FC3D8` | `#1F6F8B` | `#17566B` | `#1A333D` |

Step 100 is the light-theme surface, 600 the light-theme foreground, 700 the text on
step 100, 300 the dark-theme foreground, and 900 the dark-theme surface.

---

## Semantic colour tokens

These are what component code uses. Light and dark values shown together.

### Surfaces

| Utility | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg-bg` | `saucer-50` | `roast-950` | The page ground behind the tray |
| `bg-surface` | `#FFFFFF` | `roast-900` | The tray, cards, sheets, popovers |
| `bg-surface-sunken` | `saucer-50` | `roast-950` | Alternating section bands, inset wells, empty states |
| `bg-surface-muted` | `saucer-100` | `#3D2413` | Disabled fills, skeleton base, table stripes |
| `bg-surface-inverse` | `roast-900` | `saucer-50` | Tooltips, the sticky mobile order bar |

### Ink

| Utility | Light | Dark | Use |
| --- | --- | --- | --- |
| `text-ink` | `roast-800` | `saucer-50` | Headings and body. The default |
| `text-ink-secondary` | `silt-500` | `silt-200` | Supporting paragraphs, descriptions |
| `text-ink-muted` | `silt-400` | `silt-300` | Captions, helper text, placeholders |
| `text-ink-disabled` | `silt-300` | `#6A5B4C` | Disabled control labels only |
| `text-ink-inverse` | `saucer-50` | `roast-900` | Text on `bg-surface-inverse` |

`text-ink-disabled` falls below 4.5:1 on purpose. WCAG 1.4.3 exempts disabled controls,
and a disabled control that reads as active is the worse failure. Never use it for
anything that is not disabled.

### Lines

| Utility | Light | Dark | Use |
| --- | --- | --- | --- |
| `border-border` | `saucer-200` | `#3D2413` | Card edges, dividers, table rules |
| `border-border-strong` | `saucer-500` | `#8A6647` | Anything operable: inputs, checkboxes, segmented controls |

The split exists because WCAG 1.4.11 requires 3:1 for the boundary of a control but
nothing at all for decoration. Using one border colour for both either makes dividers
too loud or makes inputs inaccessible.

### Primary action

| Utility | Light | Dark |
| --- | --- | --- |
| `bg-primary` | `roast-600` | `roast-100` |
| `bg-primary-hover` | `roast-700` | `roast-200` |
| `bg-primary-active` | `roast-800` | `roast-300` |
| `text-primary-ink` | `#FFFFFF` | `roast-900` |
| `bg-primary-subtle` | `roast-100` | `#3D2413` |

In dark mode the primary fill inverts to a warm near-white rather than becoming amber.
Amber stays the accent in both themes, so the two never trade roles and a person who
switches theme mid-session does not have to relearn which button is which.

### Accent

| Utility | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg-accent` | `aren-400` | `aren-300` | Price badges, promo pills, selected chips |
| `bg-accent-hover` | `aren-500` | `aren-200` | Hover on an accent fill |
| `text-accent-ink` | `roast-800` | `roast-950` | Text sitting on `bg-accent` |
| `bg-accent-subtle` | `aren-100` | `#4A3208` | Highlight rows, "hari ini" banners |
| `text-accent-text` | `aren-700` | `aren-300` | The only amber that may be text |

### Focus and scrim

| Utility | Light | Dark |
| --- | --- | --- |
| `outline-focus` | `roast-800` (12.68:1) | `aren-300` (11.61:1) |
| `bg-scrim` | `rgb(26 10 3 / 0.55)` | `rgb(0 0 0 / 0.66)` |

### Status

| Utility | Light | Dark |
| --- | --- | --- |
| `text-success` / `bg-success` | `pandan-600` | `pandan-300` |
| `bg-success-surface` | `pandan-100` | `pandan-900` |
| `text-success-ink` | `pandan-700` | `pandan-300` |
| `text-danger` / `bg-danger` | `cabai-600` | `cabai-300` |
| `bg-danger-surface` | `cabai-100` | `cabai-900` |
| `text-danger-ink` | `cabai-700` | `cabai-300` |
| `text-info` / `bg-info` | `langit-600` | `langit-300` |
| `bg-info-surface` | `langit-100` | `langit-900` |
| `text-info-ink` | `langit-700` | `langit-300` |

---

## Typography tokens

### Families

| Token | Value | Utility |
| --- | --- | --- |
| `--font-sans` | `var(--ff-sans)`, Segoe UI, system-ui, sans-serif | `font-sans` |
| `--font-display` | `var(--ff-display)`, Georgia, Times New Roman, serif | `font-display` |

`--ff-sans` and `--ff-display` are produced by `next/font` in `app/layout.tsx` and set on
`<html>`. Naming them separately from the Tailwind theme tokens avoids a self-referential
`--font-sans: var(--font-sans)`.

The fallback stacks are real, not decorative. Georgia is a genuine old-style serif, so a
hero rendered before Fraunces arrives has roughly the right colour and width.

### Scale

| Utility | Size | Line height | Tracking |
| --- | --- | --- | --- |
| `text-2xs` | 0.6875rem | 1rem | 0.01em |
| `text-xs` | 0.75rem | 1.125rem | 0.005em |
| `text-sm` | 0.875rem | 1.375rem | — |
| `text-base` | 1rem | 1.625rem | — |
| `text-lg` | 1.125rem | 1.8125rem | — |
| `text-xl` | 1.25rem | 1.875rem | −0.005em |
| `text-2xl` | 1.5rem | 2rem | −0.01em |
| `text-3xl` | 1.875rem | 2.375rem | −0.015em |
| `text-display-sm` | 2.25rem | 2.625rem | −0.02em |
| `text-display-md` | 3rem | 3.25rem | −0.022em |
| `text-display-lg` | 4rem | 4.125rem | −0.025em |
| `text-display-xl` | 5rem | 5rem | −0.03em |

Line height and tracking travel with the size. `text-2xl` alone gives the right leading;
adding `leading-8` on top is a smell, not a fix.

### Fraunces axis presets

| Utility | Axes | Use |
| --- | --- | --- |
| `type-hero` | `SOFT 40, WONK 1, opsz 96` | The one hero headline per page |
| `type-section` | `SOFT 20, WONK 0, opsz 36` | Section headings. The `h1`/`h2` default |
| `type-display-small` | `SOFT 0, WONK 0, opsz 24` | Display type at 24–30px |

### Other type utilities

| Utility | Effect |
| --- | --- |
| `numeric` | `tabular-nums` plus `tnum`. Every price, weight, quantity, rating, countdown |
| `touch-target` | Extends a short control's hit area to 44px with a pseudo-element, leaving its visual box alone |
| `focus-ring` | The system's one focus treatment, for elements that opt out of the global rule |
| `max-w-(--measure-prose)` | 62ch. Body copy measure |
| `max-w-(--measure-display)` | 14ch. Hero headline measure |

---

## Spacing

Base is `--spacing: 0.25rem`, so Tailwind's numeric steps are 4px multiples: `p-1` = 4px,
`p-3` = 12px, `p-6` = 24px, `gap-8` = 32px.

Component-internal spacing uses 1, 2, 3, 4, 6, 8. Between-section rhythm uses these
tokens instead, so page-level spacing stays consistent across features built months
apart:

| Token | Mobile | ≥48rem | ≥64rem | Utility |
| --- | --- | --- | --- | --- |
| `--space-section` | 4rem | 4rem | 6rem | `py-(--space-section)` |
| `--space-section-lg` | 6rem | 6rem | 9rem | `py-(--space-section-lg)` |
| `--space-block` | 2rem | 2rem | 2.5rem | `gap-(--space-block)` |
| `--space-gutter` | 1.25rem | 2rem | 3rem | `px-(--space-gutter)` |

They are already responsive at the token level, so `py-(--space-section)` needs no
breakpoint variants.

---

## Radius

| Token | Value | Utility | Applies to |
| --- | --- | --- | --- |
| `--radius-thumb` | 0.5rem | `rounded-thumb` | Thumbnails, tags, list avatars |
| `--radius-control` | 0.75rem | `rounded-control` | Inputs, selects, textareas, small buttons |
| `--radius-card` | 1rem | `rounded-card` | Cards, modals, sheets |
| `--radius-tray` | 2rem | `rounded-tray` | The page tray. Nothing else |
| `--radius-pill` | 9999px | `rounded-pill` | Buttons, chips, badges, the cart bubble |

**A child's radius is always smaller than its parent's.** This is how the system says
"this is inside that". A card inside the tray is `rounded-card`; an input inside that card
is `rounded-control`; a thumbnail inside the input row is `rounded-thumb`. Uniform radius
across a page destroys the cue.

---

## Elevation

Brown-tinted (`rgb(71 29 0 / …)`), because a neutral grey shadow on a warm surface reads
as dirt rather than shade.

| Token | Value | Utility | Meaning |
| --- | --- | --- | --- |
| `--shadow-rest` | `0 1px 2px rgb(71 29 0 / .06)` | `shadow-rest` | Interactive surface, currently flat |
| `--shadow-lift` | `0 4px 12px / 0 1px 2px` | `shadow-lift` | Hover and focus on an interactive card |
| `--shadow-float` | `0 12px 32px / 0 2px 6px` | `shadow-float` | Dropdowns, popovers, sticky order bar |
| `--shadow-overlay` | `0 24px 48px rgb(26 10 3 / .24)` | `shadow-overlay` | Modals, drawers, sheets |
| `--shadow-tray` | `0 24px 64px rgb(71 29 0 / .10)` | `shadow-tray` | The tray only |

**Static content gets a border, not a shadow.** Elevation means "this can be picked up or
sits above the page". If every card carries the same shadow, the shadow has stopped
carrying information.

---

## Motion

| Token | Value | Utility |
| --- | --- | --- |
| `--duration-fast` | 120ms | `duration-(--duration-fast)` |
| `--duration-base` | 200ms | `duration-(--duration-base)` |
| `--duration-slow` | 320ms | `duration-(--duration-slow)` |
| `--duration-entrance` | 600ms | `duration-(--duration-entrance)` |
| `--ease-cup` | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-cup` |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease-standard` |
| `--animate-shimmer` | `shimmer 1.4s linear infinite` | `animate-shimmer` |
| `--animate-settle` | `settle 600ms var(--ease-cup) both` | `animate-settle` |

`ease-cup` decelerates hard — things arrive and settle. Use it for entrances and
anything that should feel like it was set down. `ease-standard` is for everyday state
changes where the motion should not be noticed at all.

`prefers-reduced-motion: reduce` is handled globally in `app/tokens.css` and needs no
per-component handling.

---

## Layout tokens

### Containers

| Token | Value | Utility |
| --- | --- | --- |
| `--container-tray` | 75rem / 1200px | `max-w-(--container-tray)` |
| `--container-prose` | 42rem / 672px | `max-w-(--container-prose)` |
| `--container-form` | 28rem / 448px | `max-w-(--container-form)` |

### Breakpoints

Tailwind v4 defaults, unchanged. Listed so nobody has to look them up.

| Prefix | Min width |
| --- | --- |
| `sm:` | 40rem / 640px |
| `md:` | 48rem / 768px |
| `lg:` | 64rem / 1024px |
| `xl:` | 80rem / 1280px |
| `2xl:` | 96rem / 1536px |

Design mobile-first. The `sm:` breakpoint is where the tray gains its inset and radius.

### Z-index

| Token | Value | Utility | Layer |
| --- | --- | --- | --- |
| `--z-base` | 0 | `z-(--z-base)` | Page content |
| `--z-raised` | 10 | `z-(--z-raised)` | Sticky column headers, hover cards |
| `--z-header` | 100 | `z-(--z-header)` | Sticky site header |
| `--z-dropdown` | 200 | `z-(--z-dropdown)` | Menus, popovers, comboboxes |
| `--z-overlay` | 900 | `z-(--z-overlay)` | Scrims |
| `--z-modal` | 1000 | `z-(--z-modal)` | Dialogs, drawers |
| `--z-toast` | 1100 | `z-(--z-toast)` | Toasts |

`z-50` and `z-[9999]` do not appear in this codebase. A stacking bug that needs a new
layer needs a new token and a comment explaining the ordering.

---

## Adding a token

1. Does an existing token already mean this? Reuse it. Two tokens with the same value and
   different names is how systems rot.
2. Is it a role or a raw value? Roles go in `:root` **and** `.dark` **and** the
   `prefers-color-scheme` block, then get bridged in `@theme inline`. Raw values go in
   `@theme`.
3. If it is a colour, measure its contrast against every surface it will sit on and record
   the ratio in the comment beside it. Unmeasured colour tokens are how the palette drifts
   out of compliance.
4. Add the row to this document in the same pull request.

Changing an existing token's **value** is a breaking change: it repaints every screen at
once. That review looks at screenshots, not just the diff.
