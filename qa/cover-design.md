# The cover

## Two candidates

**A, the aligned plate** (`cover-a.png`). The die floorplan, seen from directly
above, fills a wafer-grey plate that begins on the left type margin and bleeds
off the top and right of the sheet. Type below.

**B, masthead and band** (`cover-b.png`). A mono masthead and hairline, an
edge-to-edge band holding the whole die, then the title.

A wins. In B the die's own border stops short of the sheet, so the band reads as
a picture in a grey box — the fault we were fixing. In A the crop does the work:
the tile field runs off the page, and the plate's left edge, the amber chiplet
link, the title and the foot rule hang on one line 20 mm in.

## Type

Eyebrow, Plex Mono 500, 8.5 pt, 0.14 em, caps. Title, Plex Sans Condensed 700,
68 pt on 0.88, −0.018 em, two lines. Subtitle, Newsreader 14.5 pt on 1.3, 118 mm
measure. Byline, Plex Sans Condensed 600, 11 pt, with "The Chain: seventeen
chapters." in Plex Mono 8 pt at the other end of that row. Print line, Plex Mono
7.6 pt. One 0.5 pt hairline, above the colophon. The caption is gone.

## Art

`print-title.png`, re-rendered by `qa/cover/render.py`: orthographic plan view
(rx π/2, rz π/2), zoom 1.06, 1800 × 1497 px for a 190 × 158 mm plate, about
240 dpi. Dots 0.95–1.8 px, alpha 85–220, ink `#12161a`, amber `#c98a12`,
transparent over `#edeff0`. 483 KB.

## Checks

PDF page 1 carries the cover's seven lines and nothing else. Ink runs 0–274.3 mm
down, 19.9–209.9 mm across: plate to the trim, type inside the margins. No
running head or folio on page 1; both return on page 2. In greyscale the amber
column holds at L 205 against the die's 185. The build is clean; every rule sits
inside `@media print`.
