"""Generate every web-sized image the site serves.

READS   originals/            ← the only place you put source images
  avatar.jpg                     your portrait
  photos/food/*.jpg              gallery photos
  photos/travel/*.jpg
  figures/*.png|jpg              paper and project figures

WRITES  public/images/        ← 100% generated; never edit by hand
  avatar-360.webp                sidebar portrait
  <gallery>/thumbs/*.webp        640px short side — what the photo grid loads
  <gallery>/large/*.webp        2000px long side — loaded when a photo is opened
  cards/<name>.webp              520px — the thumbnail on a paper/project card
  figures/<name>.webp           1400px — the full figure inside the paper dialog

Everything is WebP. A JPEG twin for pre-2020 browsers cost 29 MB and doubled the
file count for under 3% of visitors; set JPEG_FALLBACK = True to bring it back.

Usage:  npm run images
Needs:  pip install pillow
"""
from PIL import Image, ImageOps
import os, glob, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
SRC = os.path.join(ROOT, 'originals')
OUT = os.path.join(ROOT, 'public', 'images')
GALLERIES = ('food', 'travel')
JPEG_FALLBACK = False

THUMB_SHORT_SIDE = 640
LARGE_LONG_SIDE = 2000
CARD_LONG_SIDE = 520
FIGURE_LONG_SIDE = 1400
AVATAR_SIZE = 360


def load(path):
    """Open, honour EXIF rotation, flatten transparency onto white."""
    im = ImageOps.exif_transpose(Image.open(path))
    if im.mode in ('RGBA', 'P', 'LA'):
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1] if im.mode in ('RGBA', 'LA') else None)
        return bg
    return im.convert('RGB') if im.mode != 'RGB' else im


def save(im, path_noext, quality=88):
    os.makedirs(os.path.dirname(path_noext), exist_ok=True)
    im.save(path_noext + '.webp', 'WEBP', quality=quality, method=6)
    if JPEG_FALLBACK:
        im.save(path_noext + '.jpg', 'JPEG', quality=min(95, quality + 4),
                optimize=True, progressive=True, subsampling=0)
    return os.path.getsize(path_noext + '.webp')


def fit_short(im, target):
    w, h = im.size
    s = target / min(w, h)
    return im.copy() if s >= 1 else im.resize((round(w * s), round(h * s)), Image.LANCZOS)


def fit_long(im, target):
    w, h = im.size
    s = target / max(w, h)
    return im.copy() if s >= 1 else im.resize((round(w * s), round(h * s)), Image.LANCZOS)


def main():
    if not os.path.isdir(SRC):
        sys.exit(f'No source images at {SRC}/')

    # ---- portrait ----
    avatar = os.path.join(SRC, 'avatar.jpg')
    if os.path.exists(avatar):
        im = ImageOps.fit(load(avatar), (AVATAR_SIZE, AVATAR_SIZE),
                          Image.LANCZOS, centering=(0.5, 0.30))
        kb = save(im, os.path.join(OUT, 'avatar-360'), quality=90) / 1024
        print(f'avatar-360.webp   {kb:5.0f} KB')

    # ---- paper / project figures ----
    figures = sorted(glob.glob(os.path.join(SRC, 'figures', '*')))
    if figures:
        card_b = fig_b = 0
        for f in figures:
            stem = os.path.splitext(os.path.basename(f))[0]
            im = load(f)
            card_b += save(fit_long(im, CARD_LONG_SIDE), os.path.join(OUT, 'cards', stem), 90)
            fig_b += save(fit_long(im, FIGURE_LONG_SIDE), os.path.join(OUT, 'figures', stem), 88)
        print(f'figures           {len(figures)} → cards {card_b/1024:.0f} KB, '
              f'full {fig_b/1024:.0f} KB')

    # ---- gallery photos ----
    total_src = total_thumb = total_large = count = 0
    for gallery in GALLERIES:
        src_dir = os.path.join(SRC, 'photos', gallery)
        out_dir = os.path.join(OUT, gallery)
        for f in sorted(glob.glob(os.path.join(src_dir, '*.jpg'))
                        + glob.glob(os.path.join(src_dir, '*.jpeg'))
                        + glob.glob(os.path.join(src_dir, '*.png'))):
            stem = os.path.splitext(os.path.basename(f))[0]
            im = load(f)
            total_thumb += save(fit_short(im, THUMB_SHORT_SIDE),
                                os.path.join(out_dir, 'thumbs', stem), 88)
            total_large += save(fit_long(im, LARGE_LONG_SIDE),
                                os.path.join(out_dir, 'large', stem), 85)
            total_src += os.path.getsize(f)
            count += 1

    print(f'photos            {count}')
    print(f'  originals (never deployed): {total_src / 1e6:6.1f} MB')
    print(f'  thumbs (grid):              {total_thumb / 1e6:6.2f} MB')
    print(f'  large  (on click):          {total_large / 1e6:6.2f} MB')
    print('\nNew photos: add the filenames to src/content/galleries.json.')


if __name__ == '__main__':
    main()
