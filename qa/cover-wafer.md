# The wafer cover

The author chose cover 4 of `qa/cover-redesign/` (the wafer) on 11 September, and it is
now the real PDF cover. This note records what changed, the measurements from the
built PDF, and the greyscale check the redesign README asked for.

## What changed

**Art.** `build/assets/print-title.png` is now the site's 300 mm wafer specimen from
directly above: orthographic (rx pi/2, ry 0, rz 0, no perspective), notch at the foot,
57 whole reticle fields inside the edge-exclusion ring, one of them amber. It is
rendered by `build/cover-art.py`, which first dumps the point cloud with
`node build/cover-export.js wafer <bin>` (the same route as the mock builders) and
then draws it with numpy and PIL. Defaults: 164 mm printed width at 240 dpi (1558 x
1558 px, 164.9 mm including the crop padding, so 241 dpi as placed), dots 0.9 to
1.6 px, alpha 85 to 220, ink `#12161a`, amber `#c98a12` with alpha gain 1.25,
drawn at 2x and downsampled, then quantised to a 256-entry palette (489 KB against
3.4 MB for the full RGBA file; the two inks and the alpha ramp fit). Transparent
ground. Rerun with `python3 build/cover-art.py`; every parameter is a flag.

**The second cue.** The README warned that the amber field alone is a twenty-level
margin in greyscale and would mostly vanish on a mono printer. The renderer now draws
a heavier seal ring on that field: solid ink, 0.35 mm wide, inset 10 % like every
other field's ring, but a line rather than a row of dots. It is placed from the
bounding box of the amber points, so it follows the specimen if the accent cell moves.
`--no-ring` turns it off.

**Layout** (`src/template.html`, print title block only; `src/modules/print.css`,
inside `@media print`). The `.pt-plate` image became `.pt-art`: 164 mm wide, height
auto, margin `-3mm 0 0 3mm` against the 17 mm top and 20 mm side page margins, no
background, no bleed. The eyebrow's top margin went from 12 mm to 16 mm so the type
starts at 194 mm from the head as in the mock, and its tracking from 0.14 em to the
mock's 0.18 em. The foot's padding-top went from 10 mm to 4 mm: with the taller art
the first build pushed the print line onto page 2, and 4 mm brings the whole cover
to within 2 mm of the 264 mm content box. Everything else in the type block is as
`qa/cover-design.md` records it (68 pt title on 0.88, 14.5 pt subtitle on a 118 mm
measure, 11 pt byline, 8 pt "The Chain: seventeen chapters.", 7.6 pt print line, one
0.5 pt hairline above the colophon). `@page :first` still empties the margin boxes.

## Measurements

From `dist/chip-supply-chain-the-chain.pdf` (116 pages), read back with PyMuPDF and
a 200 dpi raster of page 1.

- Wafer: 23.0 to 187.1 mm across, 14.0 to 178.1 mm down; 164.0 x 164.0 mm, centred
  with 23 mm either side, 14 mm from the head, notch at the foot.
- Amber field: 112.1 to 126.3 mm across, 87.0 to 105.0 mm down; 14.2 x 18.0 mm
  (26 by 33 mm at the wafer's scale). The README's "9 by 12 mm" was an underestimate.
- Eyebrow, title: 194.0 to 252.4 mm. Subtitle: 255.3 to 260.4 mm.
- Hairline: 265.1 mm, 20.1 to 190.0 mm across.
- Byline row: 268.8 to 273.8 mm. Print line: 276.9 to 280.4 mm.
- Ink on page 1: 20.1 to 189.9 mm across, 14.1 to 280.1 mm down. Nothing touches the
  trim; the type sits inside the 20 mm margins.
- Page 1 carries the seven lines and nothing else; no running head, no folio.
  Page 2 opens with "How to read a chapter" and carries "Chip Supply Chain" top
  right and the URL and "2 / 116" at the foot.

## Greyscale check

Page 1 rasterised, converted to L, the interior of each field measured (the middle
72 % of its area, so the rings are excluded).

| Region | L (0 black, 255 white) |
| --- | --- |
| Amber field | 169 |
| Field to the left | 215 |
| Field to the right | 219 |
| Field above | 216 |
| Field below | 217 |
| Heavy seal ring on the amber field | 27 |
| An ordinary seal ring | 160 |

The field is 46 to 50 levels darker than its neighbours (the mock's was 20 lighter),
and the ring is 133 levels darker than any other ring. On a mono printer the accent
survives twice over: a darker field, and the one solid frame on a wafer of dotted ones.

## Screen check

`python3 build/shoot.py "http://localhost:8841/#/chain" out.png --width 1440 --height 900 --wait 5`
after the build shows The Chain page as before: masthead, the "How to read a chapter"
box, the Contents. `.print-only` stays `display: none` in `src/styles.css`; every new
rule is inside `@media print` and scoped to `.print-title`.

## Files

- `build/cover-art.py`, `build/cover-export.js`: the renderer and its cloud dump.
- `build/assets/print-title.png`: the art (copied to `dist/` by the build).
- `src/template.html` (print title block), `src/modules/print.css` (cover rules).
- `qa/cover-redesign/`: the five mocks and the README that chose this one.
