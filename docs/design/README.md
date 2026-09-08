# Kedai Kopi — Design System

The single source of truth for how Kedai Kopi looks, sounds, and behaves on the web.

## What this is

| File | What it covers | Who reads it |
| --- | --- | --- |
| [`01-style-guide.md`](./01-style-guide.md) | Brand foundation, colour usage, typography, layout, motion, voice, accessibility floor | Everyone |
| [`02-design-tokens.md`](./02-design-tokens.md) | Every token, its value, and its Tailwind v4 utility | Engineers, designers |
| [`03-component-specs.md`](./03-component-specs.md) | Anatomy, variants, states, and implementation for 17 components | Engineers |
| [`app/tokens.css`](../../app/tokens.css) | The implementation: the Tailwind v4 `@theme` block. Lives in the app, since the build depends on it | Engineers |
| [`references/`](./references) | Visual references the system was derived from | Everyone |

## The product

Kedai Kopi is a neighbourhood Indonesian coffee shop. The site does three jobs, in
priority order:

1. **Order the daily cup.** A regular buying an es kopi susu on the way to work should
   go from landing to paid in under 30 seconds, on a phone, one-handed.
2. **Show the menu honestly.** Prices in rupiah, sizes in ml, origins named.
3. **Make the beans worth exploring.** Gayo, Toraja, Kintamani — single-origin retail
   bags for people who already like the drinks.

Audience: urban Indonesians 18–35, mobile-first, price-aware, ordering for pickup or
short-radius delivery. Design for a bright phone screen held outdoors before it is
designed for a desktop browser.

## Tech stack this system targets

| Layer | Version | Consequence for design |
| --- | --- | --- |
| Next.js | 16.3.4, App Router | Components are Server Components by default; `'use client'` is a deliberate cost |
| React | 19.2.8 | `ref` is a plain prop — no `forwardRef`; `useActionState` / `useFormStatus` for forms |
| Tailwind CSS | 4.3.3 | CSS-first config. Tokens live in `@theme`, not `tailwind.config.js` (there is no config file) |
| TypeScript | 5.x, strict | Variant props are unions, not loose strings |
| Fonts | `next/font/google` | Self-hosted, zero layout shift, variable axes available |
| Images | `next/image` | Every product photo needs intrinsic dimensions and real alt text |

## Where the system lives in the app

The tokens are real CSS that the build depends on, so they live in the app rather than in
`docs/`. There is exactly one copy.

| Path | What it is |
| --- | --- |
| `app/tokens.css` | The token implementation. The file this documentation describes |
| `app/globals.css` | Imports Tailwind, then the tokens. Nothing else belongs here |
| `app/layout.tsx` | Loads Fraunces and Plus Jakarta Sans, sets `lang="id"`, wraps pages in `Tray` |
| `app/lib/cn.ts` | The class-joining helper every component uses |
| `app/lib/format.ts` | `formatRupiah` — the only place currency is formatted |
| `app/components/ui/` | The primitives from [`03-component-specs.md`](./03-component-specs.md) |
| `app/components/` | Composed pieces: header, hero, cards, footer |

```css
/* app/globals.css */
@import "tailwindcss";
@import "./tokens.css";
```

Fonts are wired in `app/layout.tsx` — see [Typography](./01-style-guide.md#3-typography)
for the loader call and why the CSS variables are named `--ff-*`.

## Rules of engagement

- **Tokens or nothing.** No raw hex, px, or `rgba()` in component code. If a value is
  missing from the system, add it here first, then use it.
- **Semantic over literal.** Reach for `bg-surface` and `text-ink`, not `bg-saucer-25`
  and `text-roast-800`. Ramp steps exist so semantic tokens have something to point at.
- **The spec is the contract.** If a component ships with states the spec does not
  describe, the spec is incomplete — fix it in the same pull request.

## Changing the system

Additive changes (a new token, a new variant) go in with the feature that needs them.
Changes to a semantic token's value, the type scale, the radius hierarchy, or the
palette are breaking: they change every screen at once and need a review that looks at
the screens, not just the diff.
