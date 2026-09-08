---
name: web-image
description: Download an image from a URL (or read a local one), size it for the web, and write it as WebP into public/. Use whenever a photo needs to be added to this site — stock photography from Pexels or similar, or converting an existing image — so the app never requests images from an external service at runtime.
---

# web-image

Turns an image URL into a WebP file this app serves itself.

Photos are the heaviest thing on this site. The measured baseline: the hero photograph was
216 KB as JPEG and **82 KB as WebP at quality 80** — the same picture, 62% smaller. Every
image here goes through this skill so that saving is automatic rather than remembered.

Everything lands in `public/`, so the running site never calls out to Pexels or any other
host. That matters for privacy, for offline development, and because a CDN URL that works
today can 404 next year.

## The script

```bash
python .claude/skills/web-image/scripts/fetch_image.py --help
```

Three input modes, one output path:

```bash
# From a URL
python .claude/skills/web-image/scripts/fetch_image.py \
  --url "https://images.pexels.com/photos/930402/pexels-photo-930402.jpeg?w=2400" \
  --out public/img/hero.webp --width 1800 --aspect 16:10

# From a file already on disk (no network)
python .claude/skills/web-image/scripts/fetch_image.py \
  --from public/img/menu/espresso.jpg --out public/img/menu/espresso.webp --width 800

# Many at once — TSV: out <TAB> width <TAB> aspect <TAB> url-or-path
python .claude/skills/web-image/scripts/fetch_image.py --manifest docs/photo-manifest.tsv
```

Useful flags: `--quality` (default 80), `--aspect` (`1:1`, `4:3`, `3:2`, `16:10`, `16:9`),
`--focus` (vertical crop bias, default 0.4 — slightly above centre, because the subject of a
photograph usually is), `--dry-run`, `--no-credits`.

The script refuses to write outside `public/`, refuses a non-`.webp` filename, checks
`Content-Type` rather than trusting a 200, applies EXIF orientation, never upscales, writes
atomically, and appends the source URL to `docs/photo-credits.md`.

## Look at the image before you use it

**This is the step that actually catches mistakes.** A 200 response and an `image/jpeg`
header prove you received a valid image — not that it shows what you think.

When this site's 29 photos were first sourced, every URL returned 200 `image/jpeg`. Eight of
them turned out not to match the menu item they were attached to, and that was only
discovered by looking. A menu that shows avocado toast next to "Roti bakar srikaya" is worse
than a menu with no photographs.

So after the script writes a file, **open it with the Read tool and look at it**, then record
any that are only approximate in `docs/photo-credits.md` so a future maintainer knows which
to replace first.

For a batch, don't open 29 files one at a time — build one labelled contact sheet and check
it in a single pass:

```python
from PIL import Image, ImageDraw
import os
files = sorted(f for f in os.listdir('public/img/menu') if f.endswith('.webp'))
cols, cell, label = 6, 200, 30
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cell, rows * (cell + label)), 'white')
draw = ImageDraw.Draw(sheet)
for i, name in enumerate(files):
    im = Image.open(f'public/img/menu/{name}').convert('RGB')
    w, h = im.size
    side = min(w, h)
    im = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2)).resize((cell, cell))
    x, y = (i % cols) * cell, (i // cols) * (cell + label)
    sheet.paste(im, (x, y))
    draw.text((x + 4, y + cell + 8), name[:26], fill='black')
sheet.save('contact-sheet.png')
```

Write the sheet to the scratchpad, not the repo.

## Conventions in this project

Files live at `public/img/<section>/<slug>.webp`, and the slug must match the `id` column in
`docs/menu-items.csv` — `app/data/menu.ts` derives the path from the id and **fails the build**
if the file is missing. That is deliberate: a missing photo should stop the build, not render
a broken image in production.

| Where it is used | `--width` | `--aspect` |
| --- | --- | --- |
| `public/img/hero.webp` | 1800 | `16:10` |
| `public/img/menu/<id>.webp` | 800 | `1:1` |
| `public/img/acara/<slug>.webp` | 1200 | `3:2` |
| `public/img/tentang/<slug>.webp` | 1200 | `3:2` |

**One source per image, not a set of widths.** `next/image` generates the responsive srcset
itself from a single file; storing several widths duplicates bytes for nothing. Size the
source to the largest dimension the layout will ever request.

## Rules

- **Never a portrait of a real person for an invented character.** The founders on `/tentang`
  are fictional. Attaching a real, identifiable face from a stock library to a made-up
  biography misrepresents that person. Use interiors, hands, and equipment instead.
- **Check the licence covers the use.** Pexels does not require attribution, but
  `docs/photo-credits.md` is kept anyway — the originals are discarded after conversion, so
  the recorded URL is the only way back to a full-resolution file.
- **Do not raise `--quality` to fix a soft image.** Softness means the source was too small
  and got scaled up; the script will tell you when it did not enlarge. Fetch a bigger source.
- **Do not reach for `convert` or `magick`.** On this machine `convert` resolves to
  Embarcadero's binary, not ImageMagick. The script uses Pillow only.

## Why Pillow and not sharp

`sharp` is present in `node_modules` and produces comparable output, but it is an **optional**
dependency of Next.js — `npm ci --omit=optional` removes it, and the skill would break with no
warning. Pillow does not depend on `node_modules` at all. Measured on the hero photograph at
width 1600, quality 80: Pillow 82 KB, sharp 89 KB.

If Pillow is missing, the script says so and gives the install command.
