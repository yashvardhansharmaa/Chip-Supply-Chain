# Folio

Direction key `folio`, port 8861, DevTools port 9361. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `folio.css`, the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script with WebGL on (`shoot.py`), and the captures (`01` home, `02` the Lithography wall label, `02b` its chokepoint card, `03` Suppliers, `04` home on a phone, `05` home in the dark theme). No site source was touched.

## The direction

A large-format art and science book, the kind a museum press prints: a plate on every spread, isolated on coated white stock, a thin plate number and a caption set small beneath it, and the text set opposite with a wall label at its head. The site already has the bones of such a book, a specimen beside every chapter, and this direction stops treating the specimen as a widget and hangs it as a plate. Chipmaking suits the treatment because its objects are strange and beautiful when drawn plainly (a scanner cut open along its light path, a die floorplan at scale) and because its readers, policy staff and researchers, are used to reading captions. The ground is a clean cool white, not cream. The ink is a soft black. One color only: ultramarine, the lapis pigment rather than a link blue, used for the current tab, the current stage, the Extreme band, a citation number, and the highlighted points of the specimen; a pale wash of it fills the concentration bars on the Suppliers page. Nothing warm appears anywhere in the brand tokens. No shadow, no radius, no filled panel; hairlines only where a table or a spec list needs them, and one recurring motif, a 28 px rule, above every plate number and every "In plain terms" label.

The thing to remember is the chapter opening. The title sits at the very top of the column in light, wide capitals under a hairline, like a gallery wall label, then the accession line (Chapter 04, stage 4 of 15) in small tracked capitals with the number in lapis, then the lede in Literata light at 24 px. Across the gutter the plate: the specimen alone on white, a short rule, "Specimen 04 · Lithography" in tracked capitals, the caption beneath in 12 px sans. The chokepoint card follows the same logic: a wall-label spec list, label at left in tracked capitals, value at right in Jost light, one hairline per row, Extreme and Very hard in lapis, nothing boxed.

Faces. Display is Jost at weights 200 to 400, never bold: light and tracked at 0.34 em for the wordmark and the wall labels, tight at -0.028 em for the big sentence-case titles (home, Suppliers). Body is Literata, a modern serif with a large x-height and an optical size axis, at 18 px / 1.6, with its 300 weight for ledes. Captions, labels, table heads and every figure are Jost at small sizes with tabular figures, replacing the monospace.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#fbfbfc` | `#121317` | ground, a cool white |
| `--bg-3` | `#e9ebef` | `#22252c` | land on the map |
| `--ink` | `#17181c` | `#e8e9ee` | text, 17.2:1 on the ground |
| `--ink-2` | `#3d4048` | `#c2c5cd` | secondary text, 10.0:1 |
| `--muted` | `#5f636c` | `#9498a3` | labels and captions, 5.8:1 (5.0:1 on `--bg-3`) |
| `--line` / `--line-2` | `#e1e3e8` / `#c5c8d0` | `#262931` / `#383c46` | hairlines |
| `--accent` | `#1f3fa6` | `#8fa6f5` | ultramarine, 8.8:1 light and 7.9:1 dark, so it carries small text alone |
| `--accent-ink` | `#172f85` | `#a3b6f7` | the darker pairing for hover |
| `--wash` | `#e8ecf8` | `#222a45` | the pale wash of the pigment, for bar fills |

Country colors `--c1` to `--c8`: lapis, teal, violet, olive, mulberry, oxblood, moss, gray (`#1f3fa6 #2c8c8c #5b4ea8 #8a7a2f #9a4b6f #b23a3a #2f6b3a #8a8f99`), desaturated to sit on the white and lifted for the dark ground. Two of the eight (olive, oxblood) lean warm; eight distinguishable hues cannot all be cool, so these are data colors, not brand colors. The specimen reads `--stage-ink: 23, 24, 28` and `--stage-accent: 31, 63, 166` (dark: `232, 233, 238` and `143, 166, 245`).

Font stacks:

- display: `"Jost", "Futura", "Avenir Next", "Helvetica Neue", Arial, sans-serif`
- body: `"Literata", "Source Serif 4", "Iowan Old Style", Georgia, serif`
- labels and data (the `--font-mono` slot): the display stack, at 10 to 12 px with 0.14 to 0.28 em tracking and tabular figures

Measure: `--measure: 32em` at 18 px Literata, about 72 characters. The text column is `--col: 56%` so the plate gets a little more wall. Masthead 64 px.

## What changed beyond tokens

- Masthead: solid ground, no blur; the wordmark in Jost 300 at 0.34 em tracking with the tagline as a Literata italic running head; tabs are plain words, the current one in lapis with a 1 px lapis underline; the icon buttons are square hairlines.
- The plate: the specimen's tag moves from the top-left corner to sit centered under the canvas with a 28 px rule above it, and the caption moves under that, in Jost 12 px. This is flex `order` on the existing elements; the renderer is untouched.
- Home: title in Jost 300 at 74 px, sentence case, tight; the dek in Literata light at 22 px. "What the site covers" loses its box of five chips and becomes a contents listing, name at left, one line at right, no rules between entries. The spine keeps its hairline but loses its node; the chapter number is a 12 px tracked plate number, lapis when current.
- Chapters: the chapter head is reordered so the wall label comes first and the compact chain strip follows the meta line, reduced to fifteen 4 px marks (lapis for Extreme, gray for the rest, the current one named in lapis). The chapter tile becomes one accession line. "In plain terms" and "In short" lose their tinted box and thick rail for the short-rule motif and a lapis label. The chokepoint card becomes the spec list described above: the KPI grid, the rows and the two status blocks are all restated as `label | value` rows on one hairline grid.
- Data pages: Suppliers and the other page titles are Jost 300 sentence case; the atlas loses its border and fill, the map's ocean is the page, land is `--bg-3`, the route is lapis; pressed country and role buttons fill with lapis; the band mark next to each fact is a word in lapis rather than a pill. Tables, figures, spec sheets, briefing cards, exits, doors and the how-to block lose radius and fill for a top hairline in ink.
- Dark theme: full token set, same layout, accent lifted to a pale lapis that clears 7.9:1.

Checked beyond the captures: the card's head and rows (`02b`), the sticky rail during a chapter scroll, the phone masthead and the bottom specimen strip.

## What would need real work to ship

- The wall-label order relies on `display: contents` on the chapter head's second div and flex `order` on the chapter head, so the DOM order (chain strip, tile, title) no longer matches the visual order; screen readers hear the strip first. A shipped build should reorder the markup in the chapter template.
- The plate's tag and caption are repositioned with flex `order` inside `.stage`; the canvas keeps its height from the flex layout, so on short viewports (under about 760 px tall) the plate is small. The build should give the plate a minimum height and let the caption clamp.
- On phones the plate becomes the base stylesheet's bottom strip, with the tag and caption returned to their original order; the museum plate survives only at desktop widths.
- Google Fonts serves Jost's tabular figures, but its small sizes (9 to 10.5 px on the chain strip and country chips) are at the edge of legibility for a light geometric sans; a shipped version should hold labels at 11 px and use Jost's 500 weight for the two-letter country codes.
- The print stylesheet and the share cards under `cards/` still carry the old tokens and faces.
- The country palette keeps two warm hues (olive, oxblood) for distinguishability; a stricter reading of the direction would replace them with a pattern or a label on the map.
