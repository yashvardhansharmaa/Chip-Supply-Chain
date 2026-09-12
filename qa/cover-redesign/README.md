# Cover redesign: five directions

Mockups only. Nothing under `src/` or `build/` changed. Each cover is an A4 sheet
at 150 dpi (1240 x 1754 px), set in the site's type and palette: IBM Plex Sans
Condensed 700 for the title, Newsreader for the subtitle, IBM Plex Mono for the
eyebrow and colophon; wafer-grey `#edeff0`, graphite `#12161a` / `#171b1e`, amber
`#c98a12` (`#e6ad2f` on the dark sheet). Every sheet carries the same seven lines
as the current cover: eyebrow, title, subtitle, byline, "The Chain: seventeen
chapters.", and the print line. `sheet.png` shows all five in colour on the top
row and in greyscale on the bottom row.

Files: `cover-1.png` to `cover-5.png`, `sheet.png`. Scripts in `mock/`:
`export.js` dumps a specimen's point cloud from `src/kit.js` in Node (the route
`qa/die-floorplan.bin` took), `render.py` is `qa/cover/render.py` with a `--ymin`
cut for undersides, `make.py` writes the five HTML sheets, `shoot.py` renders them
with headless Chrome (the invocation from `build/shoot.py`).

## Why the current cover is a crop

It was a choice, not an accident. `qa/cover-design.md` records two candidates.
In B the whole die sat in a grey band, and the die's own border stopped short of
the sheet, so the band read as "a picture in a grey box". A was picked to fix
that: the plate starts on the type margin and bleeds off the top and the right,
so the tile field runs off the page and the plate's left edge, the amber chiplet
link, the title and the foot rule hang on one line 20 mm in. The earlier
three-quarter view (`qa/cover/art-a.png`, `views.png`) was dropped for the same
reason: at that angle the die is a thin slab with a lot of empty ground around
it, and it needed a frame.

The cost of the crop is that a reader cannot tell what the object is. The amber
column is the die-to-die interface, but with the rest of the die gone it reads as
a stripe on a texture, and the texture could be a circuit board, a city, or
a carpet. The plan view of the full die (cover 1 here) answers the question the
current cover raises: this is one die, 26 by 33 mm, one reticle field, and here
is the whole of it.

## Does a full render work better at A4?

Yes, on the evidence of these mocks, with one condition. A full plan view of the
die at 112 mm wide is 1321 px across in the art, drawn at about 300 dpi
equivalent, so the 144 compute tiles, the cache band and the memory controllers
all resolve on paper. The die has a border of its own (the scribe-line rectangle
and the sliver of the neighbouring die), so it sits on the white sheet as an
object without needing a plate behind it; that removes the "picture in a box"
fault that drove the crop. The condition is that it stays large: at 90 mm or
less the tiles merge into grey and the die goes back to being a texture.

The three-quarter package render (cover 2) is the exception. The site's
specimens are point clouds with no occlusion; on screen they spin, so the eye
sorts front from back. On paper the far edges of the stiffener ring and the
substrate show through the dies, and the piece reads as a wireframe ghost. The
mock cuts every point below the substrate top (`--ymin -0.02`) and it still
does. A true full-GPU render for print would need the renderer to draw faces,
not points, which is a different tool from the one the site has.

## The five directions

### 1. The whole die, plan view

`cover-1.png`. The die floorplan from directly above, orthographic, 112 mm wide
and 151 mm tall, centred with 49 mm either side, 22 mm from the head. The
die-to-die strip is amber across the top. Title beneath at the current sizes
(Plex Sans Condensed 68 pt, Newsreader 14.5 pt), foot rule and colophon as now.
The sheet is white, not wafer-grey, so the die's own edge is the only frame.
In greyscale the amber strip measures L 233 against the die's L 194, a wider
margin than the 205 against 185 that `cover-design.md` recorded for the current
cover; it survives as a lighter band, and it is still the one block that is not
tiled, so the eye finds it without the colour. On a mono laser the dot field prints as fine stipple;
nothing in it depends on tone below 85 alpha.

### 2. The packaged GPU with its HBM stacks

`cover-2.png`. The site's default package specimen (two logic dies, eight HBM
stacks with amber tops, interposer, stiffener ring, substrate) from a
three-quarter view steeper than the site's (rx 1.15, ry -0.5), 198 mm wide, the
underside points removed. It is the only direction that shows the finished
product rather than one part of it, and the eight amber tops are the most
legible amber on any sheet. The problem is the one above: the cloud is
see-through, so the ring and the substrate edges run behind the dies. In
greyscale the HBM tops go to a pale stipple only a little lighter than the
dies, and the piece reads as a technical drawing of a box with things in it.
Acceptable as a study; not a cover in this form.

### 3. Full-bleed graphite

`cover-3.png`. The same die as cover 1, drawn in light points (`#e7e9ea`) on
graphite `#171b1e`, the amber strip in the dark-theme amber `#e6ad2f`, white
title. It is the strongest sheet on screen and the one that most resembles the
site's dark mode. It is also the worst on a mono printer: a full A4 of solid
dark is a toner flood, the sheet curls, and the light points fill in. In
greyscale the amber strip measures L 48 against a ground of L 53 and a die of
L 75: it is darker than the die and barely lighter than the ground, so it reads
as a gap in the drawing rather than a highlight. Fine for the screen PDF, unwise
for the print one;
if the author wants it, it should be the digital cover and a light sheet the
print cover.

### 4. The wafer

`cover-4.png`. The site's 300 mm wafer specimen from directly above, 164 mm
across, 14 mm from the head, notch at the foot; 57 whole reticle fields inside
the edge-exclusion ring, one of them amber. Title beneath. It is the calmest
sheet and the one that says "supply chain" rather than "chip": the wafer is
where the chain's stages meet. The amber field is small, about 9 by 12 mm, and
in greyscale it measures L 202 against L 222 for its neighbours, a margin of
twenty levels that a mono printer will mostly lose (compare the two rows of
`sheet.png`); on paper the wafer is a plain ruled disc. If this direction is chosen the
field needs a second cue, a heavier seal-ring outline or a hairline from the
field to the title, so the point survives without the colour.

### 5. Typographic

`cover-5.png`. No art. Title at 128 pt across three lines, subtitle at 18 pt,
then a rule divided into fifteen cells, one per stage, numbered in amber with the
stage name in Plex Sans Condensed beneath. The lower third is empty above the
foot. It prints identically on any device, greyscale or not; the amber numbers
go to a mid-grey and the rule carries the structure. It is the most legible and
the least like the site, which is built on the specimens; it would suit a
second edition or a text-only printing better than this one.

## Recommendation

Cover 1. It answers the author's question directly: the whole die, as one
object, on a white sheet, with the amber strip in place and the title beneath.
It keeps everything the current cover got right (the type, the seven lines, the
foot rule, the amber accent) and drops the one thing readers stumble on, which
is not knowing what they are looking at. It prints well in mono and needs no
plate. Cover 3 is the same design for the screen and would make a good pair if
the build ever splits a digital cover from the print one. Cover 4 is the
runner-up on charm but needs its accent rescued for greyscale first. Cover 2
should wait for a face renderer, and cover 5 is a fallback.

To adopt cover 1 the production change is small: re-render `print-title.png`
with `qa/cover/render.py` at `--rx 1.5708 --ry 0 --rz 0 --persp 0`, drop the
`.pt-plate` background fill and its bleed in `src/modules/print.css`, and set the
plate to 112 mm wide, centred, 22 mm from the head.
