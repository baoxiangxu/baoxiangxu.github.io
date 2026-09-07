from PIL import Image, ImageDraw, ImageFilter
import numpy as np, sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fonts import load as load_font, report as report_fonts

OUT = sys.argv[1]
S = 2                      # supersample factor
W, H = 1200 * S, 630 * S

BG      = (23, 28, 40)     # #171c28 — same as the site background
TEAL    = (0, 191, 191)    # #00bfbf — site primary
WHITE   = (250, 250, 250)
MUTED   = (150, 162, 180)
DIM     = (105, 118, 138)

serif       = lambda s: load_font('serif', s)
sans        = lambda s: load_font('sans', s)
sans_medium = lambda s: load_font('sans_medium', s)
mono        = lambda s: load_font('mono', s)

report_fonts()

# ---------- background: soft teal "sphere" glow on the right ----------
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
canvas = np.zeros((H, W, 3), np.float32)
canvas[:] = BG

def glow(cx, cy, radius, colour, strength):
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / radius
    a = np.clip(1.0 - d, 0, 1) ** 2.2 * strength
    for c in range(3):
        canvas[:, :, c] = canvas[:, :, c] * (1 - a) + colour[c] * a

glow(W * 0.86, H * 0.34, W * 0.46, (0, 150, 155), 0.85)
glow(W * 0.95, H * 0.20, W * 0.26, (90, 226, 220), 0.55)
glow(W * 0.74, H * 0.82, W * 0.30, (30, 70, 110), 0.55)
glow(W * 0.10, H * 1.05, W * 0.34, (28, 40, 62), 0.60)

img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).filter(
    ImageFilter.GaussianBlur(6 * S)
)

# subtle grain so the gradient doesn't band on flat displays
noise = (np.random.default_rng(7).normal(0, 2.0, (H, W, 1))).repeat(3, axis=2)
img = Image.fromarray(
    np.clip(np.asarray(img, np.float32) + noise, 0, 255).astype(np.uint8)
)

d = ImageDraw.Draw(img)
M = 96 * S     # left margin


def spaced(draw, xy, text, font, fill, extra):
    """Draw letter-spaced text (PIL has no tracking control)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + extra


# ---------- eyebrow ----------
spaced(d, (M, 148 * S), 'PERSONAL WEBSITE', sans_medium(16 * S), DIM, 3.2 * S)

# ---------- name ----------
d.text((M, 196 * S), 'Baoxiang Xu', font=serif(84 * S), fill=WHITE)

# ---------- teal rule ----------
d.rectangle([M, 320 * S, M + 84 * S, 324 * S], fill=TEAL)

# ---------- role ----------
d.text((M, 356 * S), "Master's Student in Economics",
       font=sans(33 * S), fill=(214, 222, 234))
d.text((M, 406 * S), 'Arizona State University',
       font=sans(28 * S), fill=MUTED)

# ---------- research keywords ----------
d.text((M, 480 * S),
       'Microeconomic Theory  ·  Information Economics  ·  Market Design',
       font=sans(20 * S), fill=DIM)

# ---------- url ----------
d.text((M, 540 * S), 'baoxiangxu.github.io', font=mono(21 * S), fill=TEAL)

img = img.resize((1200, 630), Image.LANCZOS)
img.save(OUT, 'PNG', optimize=True)
print(f'{OUT}: {img.size}, {os.path.getsize(OUT)/1e3:.0f} KB')
