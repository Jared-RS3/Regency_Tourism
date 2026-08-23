#!/usr/bin/env python3
"""
Regency Tourism — concept image watermarker.

Bakes a two-layer watermark into the hero/concept preview images:
  1. a low-opacity diagonal tile that repeats across the whole frame
  2. a centred wordmark + a bottom-right ownership badge

Clean masters are copied to assets/_clean/ on first run and are always used
as the source, so re-running never double-stamps an image.

Usage:  python3 tools/watermark.py [--opacity 1.0]
"""
import argparse
import math
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
CLEAN = ROOT / "_masters"

TARGETS = ["concept-1.jpg", "concept-2.jpg", "concept-3.jpg",
           "concept-4.jpg", "concept-5.jpg", "cover.jpg"]

FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

TILE_TEXT = "REGENCY TOURISM  ·  CONCEPT  ·  © 2026 DAYBREAK  ·  DO NOT COPY"
MARK_TEXT = "REGENCY TOURISM"
MARK_SUB = "CONCEPT PREVIEW  ·  NOT FOR DISTRIBUTION"
SLUG_LEFT = "© 2026 DAYBREAK  ·  REGENCY TOURISM — CONCEPT DESIGN"
SLUG_RIGHT = "PREVIEW ONLY  ·  DO NOT COPY OR DISTRIBUTE"

WARM = (201, 147, 96)
WHITE = (248, 243, 236)


def font(path, size):
    return ImageFont.truetype(path, size)


def tracked(draw, xy, text, fnt, fill, track):
    """Draw letterspaced text; returns total advance width."""
    x, y = xy
    for ch in text:
        if draw is not None:
            draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw_len(fnt, ch) + track
    return x - xy[0] - track


def draw_len(fnt, ch):
    return fnt.getlength(ch)


def tracked_width(fnt, text, track):
    return sum(fnt.getlength(c) for c in text) + track * (len(text) - 1)


def tile_layer(size, scale, alpha):
    """Repeating diagonal text across the frame."""
    w, h = size
    diag = int(math.hypot(w, h)) + 200
    layer = Image.new("RGBA", (diag, diag), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    fnt = font(FONT_BOLD, max(11, int(13 * scale)))
    track = 2.2 * scale
    step_y = int(96 * scale)
    unit = tracked_width(fnt, TILE_TEXT, track) + 120 * scale

    row = 0
    y = 0
    while y < diag:
        x = -unit + (unit / 2 if row % 2 else 0)
        while x < diag:
            # dark ghost first so the mark holds on light photography
            tracked(d, (x + 1, y + 1), TILE_TEXT, fnt, (0, 0, 0, int(alpha * 0.55)), track)
            tracked(d, (x, y), TILE_TEXT, fnt, WHITE + (alpha,), track)
            x += unit
        y += step_y
        row += 1

    layer = layer.rotate(-30, resample=Image.BICUBIC)
    left = (diag - w) // 2
    top = (diag - h) // 2
    return layer.crop((left, top, left + w, top + h))


def mark_layer(size, scale, strength):
    """Centre wordmark and sub-line."""
    w, h = size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    # --- centre wordmark ---
    fnt = font(FONT_BOLD, int(46 * scale))
    track = 14 * scale
    tw = tracked_width(fnt, MARK_TEXT, track)
    x = (w - tw) / 2
    y = h / 2 - 46 * scale
    a = int(46 * strength)
    tracked(d, (x + 2, y + 2), MARK_TEXT, fnt, (0, 0, 0, int(a * 0.6)), track)
    tracked(d, (x, y), MARK_TEXT, fnt, WHITE + (a,), track)

    # rule + sub-line
    sfnt = font(FONT_REG, int(15 * scale))
    strack = 5 * scale
    sw = tracked_width(sfnt, MARK_SUB, strack)
    sy = y + 74 * scale
    tracked(d, (( w - sw) / 2, sy), MARK_SUB, sfnt, WHITE + (int(38 * strength),), strack)

    rule_y = int(y + 62 * scale)
    d.line([( w - tw) / 2, rule_y, (w + tw) / 2, rule_y],
           fill=WHITE + (int(30 * strength),), width=max(1, int(scale)))

    return layer


def slug_bar(im, scale):
    """Append an ownership strip BELOW the frame so no pixel of the design is hidden."""
    bar_h = int(34 * scale)
    fnt = font(FONT_BOLD, int(12 * scale))
    track = 2.6 * scale

    out = Image.new("RGBA", (im.width, im.height + bar_h), (7, 8, 9, 255))
    out.paste(im, (0, 0))
    d = ImageDraw.Draw(out)

    y = im.height + (bar_h - int(12 * scale)) / 2 - 1
    tracked(d, (24 * scale, y), SLUG_LEFT, fnt, WARM + (235,), track)
    rw = tracked_width(fnt, SLUG_RIGHT, track)
    tracked(d, (im.width - 24 * scale - rw, y), SLUG_RIGHT, fnt, WHITE + (150,), track)
    return out


def stamp(path: Path, strength: float):
    clean = CLEAN / path.name
    if not clean.exists():
        CLEAN.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, clean)

    im = Image.open(clean).convert("RGBA")
    scale = im.width / 1400  # tuned against the 1400px concept boards

    im = Image.alpha_composite(im, tile_layer(im.size, scale, int(26 * strength)))
    im = Image.alpha_composite(im, mark_layer(im.size, scale, strength))
    im = slug_bar(im, scale)
    im.convert("RGB").save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  {path.relative_to(ROOT)}  {im.width}×{im.height}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--opacity", type=float, default=1.0,
                    help="watermark strength multiplier (0.5 = half as visible)")
    ap.add_argument("files", nargs="*", default=None)
    args = ap.parse_args()

    names = args.files or TARGETS
    print("Watermarking concept boards…")
    for n in names:
        p = ASSETS / Path(n).name
        if p.exists():
            stamp(p, args.opacity)
        else:
            print(f"  skipped (missing): {n}")
