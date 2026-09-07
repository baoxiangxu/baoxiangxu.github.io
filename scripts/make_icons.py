"""Generate the favicon / app-icon set as a BX monogram."""
from PIL import Image, ImageDraw
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fonts import load as load_font, report as report_fonts

PUB = sys.argv[1]
TEAL = (0, 191, 191, 255)
WHITE = (255, 255, 255, 255)


def monogram(size, text='BX'):
    S = 8                     # supersample
    n = size * S
    img = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([0, 0, n - 1, n - 1], fill=TEAL)

    # shrink the text until it fits comfortably inside the disc
    target = n * (0.50 if len(text) > 1 else 0.56)
    fs = int(n * 0.5)
    while fs > 4:
        f = load_font('sans_bold', fs)
        l, t, r, b = d.textbbox((0, 0), text, font=f)
        if (r - l) <= target:
            break
        fs -= max(1, fs // 40)
    f = load_font('sans_bold', fs)
    l, t, r, b = d.textbbox((0, 0), text, font=f)
    d.text((n / 2 - (r + l) / 2, n / 2 - (b + t) / 2), text, font=f, fill=WHITE)
    return img.resize((size, size), Image.LANCZOS)


# Small sizes: a two-letter monogram turns to mush, so use one letter.
specs = [
    ('favicon-16x16.png', 16, 'B'),
    ('favicon-32x32.png', 32, 'B'),
    ('apple-touch-icon.png', 180, 'BX'),
    ('android-chrome-192x192.png', 192, 'BX'),
    ('android-chrome-512x512.png', 512, 'BX'),
]
for name, size, text in specs:
    monogram(size, text).save(os.path.join(PUB, name), 'PNG', optimize=True)
    print('wrote', name)

ico = [monogram(s, 'B' if s <= 32 else 'BX') for s in (16, 32, 48, 64)]
ico[0].save(os.path.join(PUB, 'favicon.ico'), format='ICO',
            sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print('wrote favicon.ico')

# contact sheet so the result can be eyeballed
sheet = Image.new('RGB', (760, 220), (245, 247, 250))
x = 20
for s in (16, 32, 48, 64, 96, 128, 180):
    im = monogram(s, 'B' if s <= 32 else 'BX')
    sheet.paste(im, (x, 110 - s // 2), im)
    x += s + 24
sheet.save('/tmp/icon_sheet.png')
