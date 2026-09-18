# Blueprint

**Direction.** The site as an engineering drawing set. A chip is the most drawn object on earth: every stage in this chain begins as a plotted sheet, from the die floorplan to the scanner's optical train to the fab's tool layout. So the reference borrows the conventions of the drawing office rather than the look of a magazine: a pale drafting blue-gray table, near-white sheets laid on it, Prussian ink, hairline rules where the current site has borders, and one drafting red for revision marks and the chosen state. Every chapter head and every chokepoint card is set as a title block, the ruled box in a drawing's corner that names the sheet, its number, its issue and its revision. The stage strip is the drawing set's sheet index: fifteen ruled cells with the number in the corner, solid red for Extreme, solid ink for High, section hatching for the rest, and a red outline on the sheet you are reading. The specimen sits on a graph-paper field to the right of the text, the one place the grid appears. Nothing else asks for attention.

**Tokens.**

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#e6ebef` | the table, pale drafting blue-gray |
| `--bg-2` | `#f2f5f7` | the sheet: cards, title blocks, masthead |
| `--bg-3` | `#d9e1e7` | pressed and secondary surfaces |
| `--ink` | `#10263a` | Prussian ink, 12.9:1 on the table |
| `--ink-2` | `#2f4658` | secondary text, 8.2:1 |
| `--muted` | `#56697a` | labels, 4.7:1 on the table, 5.2:1 on the sheet |
| `--line` / `--line-2` | `#b7c4ce` / `#8ea1b0` | hairlines, light and firm |
| `--accent` / `--accent-ink` | `#b3261e` / `#8c1d15` | drafting red, 5.5:1 and 7.6:1; white on it 6.5:1 |

Country pens: `--c1 #1f5fa8` (JP), `--c2 #c85a12` (NL), `--c3 #2a8a3c` (TW), `--c4 #8a6d00` (DE), `--c5 #0e7c86` (KR), `--c6 #9c1f66` (CN, moved to crimson so it never reads as the accent), `--c8 #6f7d89` (other). US stays ink.

Fonts, all from Google Fonts with fallbacks:
- Display: `"Barlow", "Archivo", "Helvetica Neue", Arial, sans-serif` at 600, 700 for the chapter number.
- Body: `"Source Sans 3", "Source Sans Pro", "Segoe UI", "Helvetica Neue", Arial, sans-serif` at 18px, line-height 1.6.
- Labels: `"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace` at 400 and 500.

Measure: `--measure: 34em` (about 80 characters of Source Sans 3). Column split `--col` unchanged. Specimen: `--stage-ink 16, 38, 58` and `--stage-accent 179, 38, 30`.

Dark theme: Prussian-black table `#101820`, sheets `#16212b`, ink `#e4eaef`, red lifted to `#f07a6a` (6.6:1). Captured in `05-home-dark.png`.

**Beyond tokens.**
- Square corners on every frame, tab, button, chip and tip; the wafer grain is gone and a 28px graph-paper grid sits only under the specimen column (hidden on data pages and phones).
- Masthead: the sheet's top border is an ink rule; the current tab is a red underline, not a filled block.
- Chapter head: the number tile and the title share one ruled title block; the meta line (words, specimen, copy link) becomes a row of ruled cells with an issue cell at the right.
- Chokepoint card: ink outline, ruled cells for the three KPIs, dt/dd rows and status; a small red revision triangle before "Chokepoint card"; Extreme is a red-outlined tag, not a tinted one.
- Stage strip and compact rail: ruled cells, red fill for Extreme, ink for High, section hatching for Moderate and Low, red outline for the current stage.
- Home overview box: a five-cell sheet index with a ruled header ("What the site covers / 5 sheets"); the walk's spine nodes are squares and the current one is red.
- Suppliers: the map is an ink-bordered sheet; the fifteen stop cards are index cells keeping the country pen on top; chosen country, role and mode are red-outlined cells. Pressed states everywhere use the red outline rather than an ink fill.
- The "In plain terms" note is a ruled note cell with a red header rather than a tinted panel.

**What would need real work to ship.**
- The "Issue 2026-09" cell in the chapter title block is CSS-generated text; it should come from the build's updated date, and the plate needs a real drawing-number cell (stage id, card revision) from the data, which an override cannot reach.
- The chapter tile's border and the plate's inner rules are drawn with margins and negative margins over the existing grid; the proper version restructures `.ch-id` and `.plate-head` as a real table-like grid in `src/styles.css`.
- The specimen renderer draws on a transparent canvas, so the graph-paper field is a `body::before` layer clipped to the stage column with `:has()`; it should move into `.stage` itself once the renderer's hidden state is known to CSS.
- Two bands of the stage strip (Low and Moderate) share the light hatch; a fourth tone or a hatch pitch per band would separate them, which needs the `--bar-*` token set extended.
- Headless captures run without WebGL, so the specimen is absent from every screenshot here, as it is for every direction.
