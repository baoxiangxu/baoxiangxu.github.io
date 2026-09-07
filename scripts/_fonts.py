"""Locate fonts on Windows, macOS or Linux.

The icon and social-card generators need a bold sans, a serif and a monospace
face. Hard-coding Linux paths (as an earlier version did) made both scripts
crash everywhere else, so resolve by trying known names on each platform and
fall back to Pillow's built-in face with a clear warning.
"""
from PIL import ImageFont
import glob
import os
import sys

_SEARCH_DIRS = [
    # Windows
    os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts'),
    os.path.expandvars(r'%LOCALAPPDATA%\Microsoft\Windows\Fonts'),
    # macOS
    '/System/Library/Fonts',
    '/System/Library/Fonts/Supplemental',
    '/Library/Fonts',
    os.path.expanduser('~/Library/Fonts'),
    # Linux
    '/usr/share/fonts',
    '/usr/local/share/fonts',
    os.path.expanduser('~/.fonts'),
    os.path.expanduser('~/.local/share/fonts'),
]

# Preference order per role: the design intent first, then a solid stand-in
# that exists out of the box on each platform.
FAMILIES = {
    'serif': ['Lora-Variable.ttf', 'Lora-Regular.ttf', 'Georgia.ttf', 'georgia.ttf',
              'TimesNewRoman.ttf', 'times.ttf', 'Times New Roman.ttf',
              'LinLibertine_R.otf', 'DejaVuSerif.ttf'],
    'sans': ['Poppins-Regular.ttf', 'Inter-Regular.otf', 'Inter-Regular.ttf',
             'Helvetica.ttc', 'HelveticaNeue.ttc', 'Arial.ttf', 'arial.ttf',
             'DejaVuSans.ttf'],
    'sans_bold': ['Poppins-Bold.ttf', 'Inter-Bold.otf', 'Inter-Bold.ttf',
                  'Arial Bold.ttf', 'arialbd.ttf', 'Helvetica.ttc',
                  'DejaVuSans-Bold.ttf'],
    'sans_medium': ['Poppins-Medium.ttf', 'Inter-Medium.otf', 'Arial.ttf',
                    'arial.ttf', 'Helvetica.ttc', 'DejaVuSans.ttf'],
    'mono': ['DejaVuSansMono.ttf', 'Consolas.ttf', 'consola.ttf', 'Menlo.ttc',
             'CourierNew.ttf', 'cour.ttf', 'Courier New.ttf'],
}

_cache = {}


def _find(filename):
    """Full path of `filename` under any known font directory, or None."""
    for root in _SEARCH_DIRS:
        if not root or not os.path.isdir(root):
            continue
        direct = os.path.join(root, filename)
        if os.path.isfile(direct):
            return direct
        hits = glob.glob(os.path.join(root, '**', filename), recursive=True)
        if hits:
            return hits[0]
    return None


def font_path(role):
    """Resolve a role ('serif', 'sans', 'sans_bold', 'sans_medium', 'mono')."""
    if role in _cache:
        return _cache[role]
    for candidate in FAMILIES[role]:
        found = _find(candidate)
        if found:
            _cache[role] = found
            return found
    _cache[role] = None
    return None


def load(role, size):
    """An ImageFont for the role, falling back to Pillow's default face."""
    path = font_path(role)
    if path:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    print(f'  ! no font found for "{role}" — falling back to a basic face. '
          f'Install the Google fonts Poppins/Lora for the intended look.',
          file=sys.stderr)
    return ImageFont.load_default()


def report():
    print('Fonts in use:')
    for role in FAMILIES:
        p = font_path(role)
        print(f'  {role:12s} {os.path.basename(p) if p else "(fallback)"}')
