#!/usr/bin/env python3
"""Draw the site's icons into build/assets/icons/: favicon.svg, favicon.ico (16, 32 and 48 px) and apple-touch-icon.png.

usage: python3 build/icons.py

The mark is a chip seen from above: a garnet (#7a1f2b) body with two pins a side, on a tile of the site's warm paper
(#f7f6f2). It is drawn on a 16-unit grid so every edge lands on a whole pixel at 16, 32 and 48 px, which keeps the tab
icon sharp. The browser tab and bookmark sizes have rounded corners; the Apple icon fills its square, since iOS rounds
the corners itself. build/build.js copies the three files to the root of dist/.
"""
import io, os, struct
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'assets', 'icons')
GARNET, PAPER = '#7a1f2b', '#f7f6f2'

# the chip on the 16-unit grid, as rectangles (x, y, w, h): the body, then a pin pair on each side
BODY = (4, 4, 8, 8)
PINS = [(5, 2, 1, 2), (10, 2, 1, 2), (5, 12, 1, 2), (10, 12, 1, 2), (2, 5, 2, 1), (2, 10, 2, 1), (12, 5, 2, 1), (12, 10, 2, 1)]
RADIUS = 3  # the tile's corner radius, in grid units


def svg():
    rects = ''.join(f'M{x} {y}h{w}v{h}h-{w}z' for x, y, w, h in [BODY] + PINS)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
            f'<rect width="16" height="16" rx="{RADIUS}" fill="{PAPER}"/>'
            f'<path fill="{GARNET}" shape-rendering="crispEdges" d="{rects}"/></svg>\n')


def raster(size, rounded=True, inset=0.0):
    """The mark at `size` px. `inset` shrinks the mark inside a full tile (the Apple icon wants a margin)."""
    ss = 4  # draw large, then reduce, so the rounded corners are smooth while the grid edges stay on whole pixels
    big = size * ss
    im = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if rounded: d.rounded_rectangle([0, 0, big - 1, big - 1], radius=RADIUS * big / 16, fill=PAPER)
    else: d.rectangle([0, 0, big - 1, big - 1], fill=PAPER)
    unit = big * (1 - 2 * inset) / 16
    off = big * inset
    for x, y, w, h in [BODY] + PINS:
        d.rectangle([round(off + x * unit), round(off + y * unit), round(off + (x + w) * unit) - 1, round(off + (y + h) * unit) - 1], fill=GARNET)
    return im.resize((size, size), Image.BOX)


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
    open(os.path.join(OUT, 'favicon.svg'), 'w').write(svg())
    open(os.path.join(OUT, 'favicon.ico'), 'wb').write(ico([raster(s) for s in (16, 32, 48)]))
    # the Apple icon: 9 px a grid unit inside an 18 px margin, so its edges stay sharp too
    raster(180, rounded=False, inset=0.1).convert('RGB').save(os.path.join(OUT, 'apple-touch-icon.png'), optimize=True)
    for f in ('favicon.svg', 'favicon.ico', 'apple-touch-icon.png'):
        print(f'{f:24s} {os.path.getsize(os.path.join(OUT, f)):6d} bytes')
