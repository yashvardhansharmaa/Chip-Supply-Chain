# Plate

Direction key `plate`, port 8874, DevTools port 9374. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `plate.css`, a 2 KB script in `plate.js` that sets the plate numbers in Roman numerals (CSS cannot turn "04" into "IV"), the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script with WebGL on (`shoot.py`), and the captures (`01` home, `02` the Lithography head, `02b` its legend key, `03` Suppliers, `04` home on a phone, `05` home in the dark theme). No site source was touched.

## The direction

A natural-history plate book, the kind Haeckel's radiolaria or the Blaschka glass models were published in, done in silicon: the specimen is the whole idea, and the type exists to number and caption it. The ground is a very pale cool grey with a silver cast, the polished face of a wafer, and the plate itself sits a shade lighter, like coated stock tipped in. The ink is graphite. One accent, the copper of an interconnect, appears only as the specimen's own thread (the light path in the scanner, the die-to-die link on the floorplan) and as the chosen state (the current tab's underline, the current plate's edge, a pressed filter, the small square that marks Extreme). It is never a color for words. Chipmaking suits the treatment because its objects are already specimens, cut open and drawn to scale, and because the site's readers, policy staff and researchers, read captions and legends for a living.

The thing to remember is the plate. The specimen column widens to 52 percent and the text narrows to 48. The render sits large and centered on its silver ground, framed by one hairline like an intaglio plate mark, with "Plate IV" in small capitals beneath it and the caption set as a narrow justified block, a plate legend. The chapter's title block is small and quiet (Chapter IV, stage 4 of 15; Lithography at 32 px light; the lede in Literata light) so the object dominates the spread. The stage strip beneath it is fifteen small numbered plates in a row, hairline squares with Roman numerals and the stage's concentration drawn as a short rule along each foot, the current plate edged in copper. The chokepoint card becomes a legend key: "Legend" at the head, label at left in small capitals, value at right in the light serif, ruled in hairlines, with a copper square in place of a colored word. On the home page the die floorplan fills the right half as Plate I, and "What the site covers" is set as a legend key too.

Faces. One text serif does everything: Source Serif 4, a variable font with an optical size axis, at 300 for titles (large, with wide letter-spacing, never bold), 400 for body, and in all-small-caps for labels, plate numbers, table heads, tabs on the data pages and buttons. Literata light carries the ledes and deks. There is no sans and no monospace anywhere.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#eceef1` | `#16191c` | ground, a pale cool grey with a silver cast |
| `--plate-ground` | `#f3f4f6` | `#1b1f23` | the plate itself, a shade lighter than the page |
| `--bg-3` | `#d9dde2` | `#262b30` | land on the map, bar tracks |
| `--ink` | `#1e2226` | `#e6e8ea` | graphite, 14.6:1 on the ground |
| `--ink-2` | `#444a51` | `#bfc5cb` | secondary text, 7.9:1 |
| `--muted` | `#5d646b` | `#8f979f` | labels and captions, 5.1:1 (4.6:1 on `--bg-3`) |
| `--line` / `--line-2` | `#d0d4d9` / `#b7bcc3` | `#2b3136` / `#3c434a` | hairlines |
| `--accent` | `#b5622e` | `#d5804c` | copper, for the thread and the chosen state only |
| `--accent-ink` | `#8b4620` | `#e39463` | the darker copper, 5.9:1, for the few hover states that color a word |

Country colors `--c1` to `--c8` keep their hues (blue, orange, green, yellow, violet, red, dark green, gray) and are retuned to sit on the silver ground; the dark set is brightened. The specimen reads `--stage-ink: 30, 34, 38` and `--stage-accent: 181, 98, 46` (dark: `230, 232, 234` and `213, 128, 76`).

Font stacks:

- display: `"Source Serif 4", "Literata", "Iowan Old Style", "Palatino Linotype", Georgia, serif` at weight 300
- body: the same stack at weight 400
- labels and data (the `--font-mono` slot): the same stack in `font-variant-caps: all-small-caps` at 11 to 13 px with 0.14 em tracking and tabular figures
- ledes (`--font-lede`, a new token): `"Literata", "Source Serif 4", "Iowan Old Style", Georgia, serif` at weight 300

Measure: `--measure: 31em` at 18 px, about 70 characters. The text column is `--col: 48%` (52 percent under 1240 px, 56 under 1100). Masthead 60 px.

## What changed beyond tokens

- Masthead: solid ground, no blur; the wordmark in small capitals at 0.22 em tracking with the tagline as an italic running head; tabs are plain serif words, the current one under a copper hairline; the icon buttons are square hairlines.
- The plate: the canvas takes a margin, the plate ground and a hairline frame; the specimen's tag moves from the top-left corner to sit centered under the frame as "Plate IV · Lithography", and the caption moves under that as a justified, hyphenated block 36 characters wide. This is flex `order` on the existing elements inside a `min-width: 901px` query; the renderer is untouched. `plate.js` rewrites the tag's text on every change (a MutationObserver) and turns "Specimen 00 · the whole chip" into "Frontispiece · the whole chip".
- Home: title in Source Serif 4 at 300, 60 px, wide; the dek in Literata light. "What the site covers" loses its box of five chips and becomes a ruled legend key, name in small capitals at left, one line at right. The chapter numbers on the spine are Roman numerals at 22 px light; the node is gone.
- Chapters: the head is reordered so the title block comes first (tile as one small-caps line, title, lede, meta), then the fifteen small plates, then "In plain terms", "In short" and the legend key. "In plain terms" and "In short" lose their tinted box and thick rail for a rule above and a small-caps label in ink. The card's head reads "Legend" (CSS `::before` on the existing label, whose own text is hidden with `font-size: 0` but still read by assistive technology); the KPI grid, the rows and the two status blocks are restated as `label | value` rows on one hairline grid; Extreme and Very hard are ink with a copper square before them.
- Data pages: page titles are the light serif; every pressed state (country and role buttons on Suppliers, the chip picker, the ladder modes) is a copper hairline edge on the plate ground rather than a fill; the atlas loses its border and fill, the map's ocean is the page, land is `--bg-3`, the route is copper. Tables, figures, spec sheets, briefing cards, exits, doors and the how-to block lose radius and fill for a top hairline in ink. Bar charts fill in graphite rather than the accent, since the accent is not a data color here.
- Suppliers: the band marks beside each country fact ("Extreme", "High") were copper and graphite fills with page-colored text; they are hairline chips now, copper-edged for Extreme, with ink text.
- Dark theme: full token set, the same layout, the plate ground a shade lighter than the page again, copper lifted to clear 4.5:1 for its few hover uses. The dark capture loads `?theme=dark`, which the site applies before first paint, because the renderer reads its colors once at start and an `--eval` theme switch leaves the points in the light-theme ink.

## What would need real work to ship

- The Roman numerals are a script layered over markup that carries Arabic numbers (`plate.js` rewrites `.ch-tile .v`, `.wk-n`, the compact chain cells and the stage tag). The build should emit them, and the `data-number` attributes, aria labels and the print stylesheet still say "04".
- The chapter head's visual order (title, plates, plain terms) differs from the DOM order (chain strip first) through flex `order`, so screen readers hear the strip before the title. The chapter template should be reordered.
- "Legend" on the card is a CSS `::before` over a hidden "Chokepoint card" label. The template should carry the word.
- The plate's tag and caption are repositioned with flex `order` inside `.stage`; on short viewports (under about 760 px tall) the frame gets small. The build should give the plate a minimum height and let the caption clamp. The hairline frame is drawn on the canvas element itself, which the renderer sizes, so it depends on the renderer keeping `width: 100%` semantics.
- Google Fonts serves Source Serif 4's `smcp` feature in its variable subset, but a fallback font synthesizes the small capitals as scaled capitals; shipping wants self-hosted fonts.
- On phones the plate becomes the base stylesheet's bottom strip, restyled only in type; the fifteen small plates are hidden (as in the base); the walk's Roman numerals shrink to 17 px. That is a compromise, not a design.
- The country palette keeps eight saturated hues on a cool ground for distinguishability. A stricter reading of the direction would draw them as graphite tints with pattern.
- The print stylesheet and the share cards under `cards/` still carry the old tokens and faces.
