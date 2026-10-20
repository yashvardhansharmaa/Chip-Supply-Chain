#!/usr/bin/env python3
"""Draw the site's icons into build/assets/icons/: favicon.svg, favicon.ico (16, 32 and 48 px) and apple-touch-icon.png.

usage: python3 build/icons.py

The mark is a lowercase c in Fraunces, the face of the wordmark and the chapter titles, in the site's paper (#f7f6f2) on a
garnet (#7a1f2b) tile. C_PATH below is Fraunces's "c" at weight 800, optical size 36, SOFT 0 and WONK 0, taken once with
fontTools (font units, 2,000 to the em, y pointing up), so the build needs no font file.

A curve drawn at 16 px blurs wherever an edge falls between pixels. So at each size the c is moved by fractions of a pixel,
and scaled by at most 4 percent, to the place where its strokes blur least: a crude form of hinting. The SVG takes the 16 px
fit, because browsers draw it at 16 px in a tab. The browser icons have rounded corners; the Apple icon fills its square,
since iOS rounds the corners itself. build/build.js copies the three files to the root of dist/.
"""
import io, os, re, struct
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'assets', 'icons')
GARNET, PAPER = (0x7a, 0x1f, 0x2b), (0xf7, 0xf6, 0xf2)
RADIUS = 3.2  # the tile's corner radius on the 16-unit grid

C_PATH = ('M1011 683 Q1011 612 960 564 Q909 515 823 515 Q739 515 696 561 Q653 607 653 680 L653 720 Q653 786 623 823 '
          'Q594 861 544 861 Q502 861 468 831 Q433 801 412 741 Q391 682 391 594 Q391 474 431 393 Q470 312 540 270 '
          'Q609 229 697 229 Q769 229 825 251 Q880 273 924 326 Q946 348 959 356 Q971 363 983 363 Q1000 363 1007 347 '
          'Q1015 330 1015 307 Q1012 216 954 140 Q896 64 796 19 Q695 -26 563 -26 Q417 -26 301 33 Q185 91 118 198 '
          'Q51 305 51 450 Q51 602 118 721 Q184 840 305 909 Q425 978 588 978 Q720 978 815 938 Q909 898 960 832 '
          'Q1011 765 1011 683 Z')
X0, Y0, X1, Y1 = 51, -26, 1015, 978  # the outline's bounds, in font units
# the design, as a share of the tile: the c's height, and its center (a touch right of the middle, which reads as centered
# because the c is open on the right)
HEIGHT, CX, CY = 0.6, 8.1 / 16, 8.0 / 16


def contours():
    """The outline as lists of on-curve and quadratic control points: [[('M', (x, y)), ('Q', (cx, cy), (x, y)), ...], ...]."""
    out, cur, tok = [], [], re.findall(r'[MLQZ]|-?\d+', C_PATH)
    i = 0
    while i < len(tok):
        t = tok[i]
        if t == 'M': cur = [('M', (int(tok[i + 1]), int(tok[i + 2])))]; i += 3
        elif t == 'L': cur.append(('L', (int(tok[i + 1]), int(tok[i + 2])))); i += 3
        elif t == 'Q': cur.append(('Q', (int(tok[i + 1]), int(tok[i + 2])), (int(tok[i + 3]), int(tok[i + 4])))); i += 5
        else: out.append(cur); i += 1
    return out


def place(size, f=1.0, dx=0.0, dy=0.0):
    """Font units -> pixels at `size`: the design placement, scaled by f and moved by (dx, dy) pixels."""
    k = HEIGHT * size * f / (Y1 - Y0)
    w, h = (X1 - X0) * k, (Y1 - Y0) * k
    left, top = CX * size - w / 2 + dx, CY * size - h / 2 + dy
    return lambda p: (left + (p[0] - X0) * k, top + (Y1 - p[1]) * k), (k, left - X0 * k, top + Y1 * k)


def polygon(fn, steps=24):
    pts = []
    for c in contours():
        pen = None
        for seg in c:
            if seg[0] in 'ML': pen = fn(seg[1]); pts.append(pen)
            else:
                (cx, cy), (x, y) = fn(seg[1]), fn(seg[2])
                for n in range(1, steps + 1):
                    t = n / steps
                    pts.append(((1 - t) ** 2 * pen[0] + 2 * (1 - t) * t * cx + t * t * x, (1 - t) ** 2 * pen[1] + 2 * (1 - t) * t * cy + t * t * y))
                pen = (x, y)
    return pts


def coverage(size, f, dx, dy, ss):
    """The c's coverage of each pixel at `size`, drawn ss times larger and reduced (0 to 255)."""
    fn, _ = place(size * ss, f, dx * ss, dy * ss)
    m = Image.new('L', (size * ss, size * ss), 0)
    ImageDraw.Draw(m).polygon(polygon(fn), fill=255)
    return m.resize((size, size), Image.BOX)


def fit(size):
    """The scale and shift with the least blur: the sum over pixels of how far each is from fully in or fully out,
    per unit of scale (a larger c has more edge, so the raw sum would always prefer a smaller one)."""
    ss = 16 if size <= 32 else 8
    best = None
    for fi in range(-4, 5):
        f = 1 + fi / 100
        for ix in range(-8, 9):
            for iy in range(-8, 9):
                dx, dy = ix / 16, iy / 16
                a = coverage(size, f, dx, dy, ss).getdata()
                blur = sum(min(v, 255 - v) for v in a) / f
                key = (round(blur, 1), abs(fi) + abs(ix) + abs(iy))  # ties go to the smallest change
                if best is None or key < best[0]: best = (key, f, dx, dy)
    return best[1], best[2], best[3]


def raster(size, rounded=True, fitted=True):
    f, dx, dy = fit(size) if fitted else (1.0, 0.0, 0.0)
    ss = 4
    tile = Image.new('L', (size * ss, size * ss), 0)
    d = ImageDraw.Draw(tile)
    if rounded: d.rounded_rectangle([0, 0, size * ss - 1, size * ss - 1], radius=RADIUS * size * ss / 16, fill=255)
    else: d.rectangle([0, 0, size * ss - 1, size * ss - 1], fill=255)
    tile = tile.resize((size, size), Image.BOX)
    glyph = coverage(size, f, dx, dy, 16 if size <= 48 else 4)
    im = Image.composite(Image.new('RGB', (size, size), PAPER), Image.new('RGB', (size, size), GARNET), glyph)
    im.putalpha(tile)
    return im, (f, dx, dy)


def svg(f, dx, dy):
    _, (k, tx, ty) = place(16, f, dx, dy)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
            f'<rect width="16" height="16" rx="{RADIUS}" fill="#7a1f2b"/>'
            f'<path fill="#f7f6f2" transform="translate({tx:.4f} {ty:.4f}) scale({k:.6f} {-k:.6f})" d="{C_PATH}"/></svg>\n')


def ico(images):
    """A Windows icon holding one PNG per size (supported by every current browser)."""
    blobs = []
    for im in images:
        b = io.BytesIO(); im.save(b, 'PNG'); blobs.append(b.getvalue())
    head = struct.pack('<HHH', 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries = b''
    for im, blob in zip(images, blobs):
        w, h = im.size
        entries += struct.pack('<BBBBHHII', w % 256, h % 256, 0, 0, 1, 32, len(blob), offset)
        offset += len(blob)
    return head + entries + b''.join(blobs)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    sizes = {}
    for s in (16, 32, 48):
        sizes[s] = raster(s)
        print(f'{s:3d} px: scale {sizes[s][1][0]:.2f}, shift {sizes[s][1][1]:+.3f} {sizes[s][1][2]:+.3f} px')
    open(os.path.join(OUT, 'favicon.svg'), 'w').write(svg(*sizes[16][1]))
    open(os.path.join(OUT, 'favicon.ico'), 'wb').write(ico([sizes[s][0] for s in (16, 32, 48)]))
    raster(180, rounded=False, fitted=False)[0].convert('RGB').save(os.path.join(OUT, 'apple-touch-icon.png'), optimize=True)
    for name in ('favicon.svg', 'favicon.ico', 'apple-touch-icon.png'):
        print(f'{name:24s} {os.path.getsize(os.path.join(OUT, name)):6d} bytes')
