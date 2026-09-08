#!/usr/bin/env python3
"""Fetch (or read) an image, size it for the web, and write it as WebP under public/.

Deliberately dependency-light: Pillow only. sharp is present in this repo but only
as an *optional* dependency of Next.js, so `npm ci --omit=optional` would remove it
and silently break this script. Pillow does not depend on node_modules at all.

Run --help for usage.
"""

from __future__ import annotations

import argparse
import csv
import io
import os
import sys
import tempfile
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

USER_AGENT = "kedaikopi-web-image/1.0 (+local build tool)"
MAX_DOWNLOAD_BYTES = 40 * 1024 * 1024  # a web photo far above this is a mistake
ASPECTS = {"1:1": 1.0, "4:3": 4 / 3, "3:2": 1.5, "16:10": 1.6, "16:9": 16 / 9}


class Fail(Exception):
    """An expected failure with a message a human can act on."""


# --------------------------------------------------------------------------- setup


def preflight() -> None:
    try:
        from PIL import Image, features  # noqa: F401
    except ImportError as exc:
        raise Fail(
            "Pillow tidak terpasang. Pasang dengan:\n"
            "    python -m pip install --upgrade Pillow"
        ) from exc

    from PIL import features

    if not features.check("webp"):
        raise Fail(
            "Pillow terpasang tapi tanpa dukungan WebP.\n"
            "    python -m pip install --upgrade --force-reinstall Pillow"
        )


def project_root() -> Path:
    """Nearest ancestor holding package.json, else the current directory."""
    here = Path.cwd().resolve()
    for candidate in [here, *here.parents]:
        if (candidate / "package.json").exists():
            return candidate
    return here


def safe_output_path(out: str, root: Path) -> Path:
    """Resolve `out` and refuse anything that escapes public/."""
    path = (root / out).resolve() if not Path(out).is_absolute() else Path(out).resolve()
    public = (root / "public").resolve()
    try:
        path.relative_to(public)
    except ValueError:
        raise Fail(
            f"Keluaran harus di dalam public/ supaya bisa dilayani.\n"
            f"  diminta : {path}\n"
            f"  public/ : {public}"
        ) from None
    if path.suffix.lower() != ".webp":
        raise Fail(f"Nama keluaran harus berakhiran .webp, bukan '{path.suffix}'.")
    return path


# --------------------------------------------------------------------------- input


def read_source(url: str | None, from_file: str | None, root: Path) -> tuple[bytes, str]:
    """Returns (raw bytes, human-readable origin)."""
    if url:
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                content_type = (response.headers.get("Content-Type") or "").split(";")[0].strip()
                # A 200 alone proves nothing: error pages and hotlink blocks are
                # served as 200 text/html every day.
                if not content_type.startswith("image/"):
                    raise Fail(
                        f"URL menjawab 200 tapi Content-Type '{content_type or 'kosong'}', "
                        f"bukan image/*. Kemungkinan halaman HTML, bukan gambar.\n  {url}"
                    )
                raw = response.read(MAX_DOWNLOAD_BYTES + 1)
        except urllib.error.HTTPError as exc:
            raise Fail(f"HTTP {exc.code} saat mengunduh:\n  {url}") from None
        except urllib.error.URLError as exc:
            raise Fail(f"Gagal menghubungi server: {exc.reason}\n  {url}") from None

        if len(raw) > MAX_DOWNLOAD_BYTES:
            raise Fail(f"Berkas lebih besar dari {MAX_DOWNLOAD_BYTES // 1024 // 1024} MB; dibatalkan.")
        return raw, url

    assert from_file is not None
    source = (root / from_file) if not Path(from_file).is_absolute() else Path(from_file)
    if not source.exists():
        raise Fail(f"Berkas sumber tidak ada: {source}")
    return source.read_bytes(), str(source.relative_to(root) if source.is_relative_to(root) else source)


# ------------------------------------------------------------------------ process


def process(raw: bytes, width: int, aspect: str | None, quality: int, focus: float):
    from PIL import Image, ImageOps

    try:
        image = Image.open(io.BytesIO(raw))
        image.load()
    except Exception as exc:  # Pillow raises a zoo of types here
        raise Fail(f"Bukan gambar yang bisa dibaca: {exc}") from None

    # Must come first. Stock photos routinely carry EXIF orientation, and Pillow
    # — unlike sharp — does not apply it automatically. Skip this and portrait
    # shots come out lying on their side.
    image = ImageOps.exif_transpose(image)

    source_size = image.size
    image = image.convert("RGB")

    if aspect:
        target = ASPECTS[aspect]
        w, h = image.size
        current = w / h
        if current > target:  # too wide, trim the sides
            new_w = round(h * target)
            left = (w - new_w) // 2
            image = image.crop((left, 0, left + new_w, h))
        elif current < target:  # too tall, trim top and bottom
            new_h = round(w / target)
            top = round((h - new_h) * focus)
            image = image.crop((0, top, w, top + new_h))

    upscaled = False
    if image.width > width:
        new_h = round(image.height * width / image.width)
        image = image.resize((width, new_h), Image.LANCZOS)
    elif image.width < width:
        # Never enlarge silently. Upscaling invents detail and looks soft; the
        # caller should fetch a larger source instead.
        upscaled = True

    buffer = io.BytesIO()
    image.save(buffer, "WEBP", quality=quality, method=6)
    return buffer.getvalue(), source_size, image.size, upscaled


def write_atomic(path: Path, payload: bytes) -> None:
    """Write via a temp file in the same directory, so a crash leaves no half file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=path.parent, suffix=".webp.tmp")
    try:
        with os.fdopen(fd, "wb") as handle:
            handle.write(payload)
        os.replace(tmp, path)
    except BaseException:
        Path(tmp).unlink(missing_ok=True)
        raise


# ------------------------------------------------------------------------- credits


def record_credit(root: Path, credits_file: str, rel_out: str, origin: str, source_size) -> None:
    path = root / credits_file
    row = f"| `{rel_out}` | {source_size[0]}x{source_size[1]} | {date.today().isoformat()} | {origin} |"
    header = [
        "",
        "## Berkas yang dihasilkan `web-image`",
        "",
        "Berkas asli tidak disimpan. Kolom sumber adalah satu-satunya jalan untuk",
        "mengunduh ulang dan memotong ulang.",
        "",
        "| Berkas | Dimensi asli | Diambil | Sumber |",
        "| --- | --- | --- | --- |",
    ]
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = path.read_text(encoding="utf8") if path.exists() else ""
    if "## Berkas yang dihasilkan `web-image`" not in existing:
        existing = existing.rstrip("\n") + "\n" + "\n".join(header) + "\n"
    # Replace the row for this file if it is already recorded.
    lines = [ln for ln in existing.split("\n") if not ln.startswith(f"| `{rel_out}` |")]
    out_lines: list[str] = []
    inserted = False
    for line in lines:
        out_lines.append(line)
        if not inserted and line.startswith("| --- | --- | --- | --- |"):
            out_lines.append(row)
            inserted = True
    if not inserted:
        out_lines.append(row)
    path.write_text("\n".join(out_lines).rstrip("\n") + "\n", encoding="utf8")


# ---------------------------------------------------------------------------- run


def convert_one(args, root: Path, url, from_file, out, width, aspect, quality, focus) -> dict:
    dest = safe_output_path(out, root)
    raw, origin = read_source(url, from_file, root)
    payload, source_size, out_size, upscaled = process(raw, width, aspect, quality, focus)

    rel = dest.relative_to(root).as_posix()
    if args.dry_run:
        print(f"[dry-run] {rel}  {source_size[0]}x{source_size[1]} -> {out_size[0]}x{out_size[1]}  "
              f"{len(raw) / 1024:.0f} KB -> {len(payload) / 1024:.0f} KB")
    else:
        write_atomic(dest, payload)
        if url and args.credits:
            record_credit(root, args.credits, rel, origin, source_size)

    saved = (1 - len(payload) / len(raw)) * 100 if raw else 0
    note = "  (sumber lebih kecil dari --width, tidak diperbesar)" if upscaled else ""
    print(
        f"{rel}\n"
        f"  sumber : {source_size[0]}x{source_size[1]}  {len(raw) / 1024:.0f} KB\n"
        f"  keluar : {out_size[0]}x{out_size[1]}  {len(payload) / 1024:.0f} KB  "
        f"({saved:+.0f}%){note}"
    )
    return {"in": len(raw), "out": len(payload), "upscaled": upscaled}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Unduh atau baca gambar, ubah ukurannya untuk web, simpan sebagai WebP di public/.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Contoh:\n"
            "  fetch_image.py --url https://images.pexels.com/photos/930402/pexels-photo-930402.jpeg"
            " --out public/img/hero.webp --width 1800 --aspect 16:10\n"
            "  fetch_image.py --from public/img/menu/espresso.jpg --out public/img/menu/espresso.webp --width 800\n"
            "  fetch_image.py --manifest docs/photo-manifest.tsv\n"
        ),
    )
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--url", help="URL gambar sumber")
    source.add_argument("--from", dest="from_file", help="berkas lokal sumber")
    source.add_argument(
        "--manifest",
        help="TSV: out<TAB>width<TAB>aspect<TAB>url_atau_path (baris '#' diabaikan)",
    )
    parser.add_argument("--out", help="tujuan .webp di dalam public/")
    parser.add_argument("--width", type=int, default=1600, help="lebar maksimum (default 1600)")
    parser.add_argument("--aspect", choices=sorted(ASPECTS), help="potong ke rasio ini")
    parser.add_argument("--quality", type=int, default=80, help="kualitas WebP 1-100 (default 80)")
    parser.add_argument(
        "--focus",
        type=float,
        default=0.4,
        help="titik potong vertikal 0=atas 1=bawah (default 0.4, sedikit ke atas)",
    )
    parser.add_argument("--credits", default="docs/photo-credits.md", help="berkas catatan sumber")
    parser.add_argument("--no-credits", action="store_true", help="jangan catat sumber")
    parser.add_argument("--dry-run", action="store_true", help="hitung saja, jangan tulis")
    args = parser.parse_args()

    if args.no_credits:
        args.credits = None
    if not 1 <= args.quality <= 100:
        print("error: --quality harus 1-100", file=sys.stderr)
        return 2
    if not args.manifest and not args.out:
        print("error: --out wajib kecuali memakai --manifest", file=sys.stderr)
        return 2

    try:
        preflight()
        root = project_root()

        if args.manifest:
            manifest = (root / args.manifest) if not Path(args.manifest).is_absolute() else Path(args.manifest)
            if not manifest.exists():
                raise Fail(f"Manifest tidak ada: {manifest}")
            jobs = []
            with manifest.open(encoding="utf8", newline="") as handle:
                for line_no, row in enumerate(csv.reader(handle, delimiter="\t"), start=1):
                    if not row or row[0].startswith("#"):
                        continue
                    if len(row) < 4:
                        raise Fail(
                            f"{args.manifest} baris {line_no}: butuh 4 kolom "
                            f"(out, width, aspect, url/path), dapat {len(row)}"
                        )
                    out, width, aspect, src = (c.strip() for c in row[:4])
                    jobs.append((out, int(width), aspect or None, src))

            total_in = total_out = 0
            failures: list[str] = []
            for out, width, aspect, src in jobs:
                is_url = src.startswith("http://") or src.startswith("https://")
                try:
                    stats = convert_one(
                        args, root,
                        src if is_url else None,
                        None if is_url else src,
                        out, width, aspect, args.quality, args.focus,
                    )
                    total_in += stats["in"]
                    total_out += stats["out"]
                except Fail as exc:
                    failures.append(f"{out}: {exc}")
                    print(f"{out}\n  GAGAL: {exc}", file=sys.stderr)

            done = len(jobs) - len(failures)
            print(f"\n{done}/{len(jobs)} berkas.")
            if total_in:
                print(
                    f"Total {total_in / 1024 / 1024:.2f} MB -> {total_out / 1024 / 1024:.2f} MB "
                    f"({(1 - total_out / total_in) * 100:.0f}% lebih kecil)"
                )
            if failures:
                print(f"\n{len(failures)} gagal:", file=sys.stderr)
                for failure in failures:
                    print(f"  - {failure}", file=sys.stderr)
                return 1
            return 0

        convert_one(
            args, root, args.url, args.from_file, args.out,
            args.width, args.aspect, args.quality, args.focus,
        )
        return 0

    except Fail as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    sys.exit(main())
