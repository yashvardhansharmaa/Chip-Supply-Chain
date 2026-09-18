# Monograph

## The direction

A university press monograph on an industrial subject: paper, ink, and one color of rule. The world it draws on is the printed technical treatise, where a chapter opens on a tall page with the number set large and light, the title beneath it, and a plate facing the text. That is the site's own structure already: seventeen chapters, a specimen beside every one, a card per stage. Chipmaking is a subject that gets written up in glossy dashboards and neon renderings; setting it like a scholarly book says the opposite, that this is a reference to be read slowly and cited. Everything is serif. Fraunces carries the display sizes with its light weights and old-style figures, Source Serif 4 carries the reading and, as small capitals, every label and table head that was mono before. Color is nearly absent. A deep teal appears in the chosen state (the current tab, the current chapter on the spine, a pressed country), in the Extreme concentration band, and in the link underline on hover. The specimen renderer takes the same teal for its highlighted points, so the point cloud reads as an engraving with one colored line. Nothing has a corner radius, a shadow, or a filled background; hairlines and space do the separating.

The memorable choice is the chapter opening. The chapter number is set at 216 px in Fraunces at weight 200 with old-style figures, so the 0 sits at x-height and the 4 descends, the way a printer would set a folio. Title, italic lede, and the specimen plate at right share one tall composition. The masthead is reduced to the wordmark in Fraunces with the tagline as an italic running head, and the sections as plain words with one teal underline.

## Tokens

| Name | Hex | Used for |
|---|---|---|
| Paper | `#fafaf8` | ground |
| Paper 2 | `#f2f2ef` | table row hover, search results hover |
| Ink | `#161616` | text, rules that carry weight, pressed buttons |
| Ink 2 | `#3d3d3a` | secondary text, the High band bar |
| Muted | `#6b6b66` | labels, captions, sources (5.1:1 on Paper) |
| Hairline | `#e3e3df` | the quiet rule |
| Rule | `#c6c6c0` | the rule that separates, the Moderate band bar |
| Teal | `#0f5f5a` | the accent (7.1:1 on Paper); `#0b4a46` as the ink variant for small text (9.6:1) |

Country colors, kept distinguishable but desaturated to sit on paper: JP slate `#3a5a8f`, NL rust `#9c4a1f`, TW moss `#4a6a2a`, DE ochre `#8a6a14`, KR plum `#5f3a72`, CN oxblood `#8c2b2b`, Other grey `#8f8f8a`, US stays Ink. Dark theme: ground `#141414`, ink `#ebe9e3`, teal lifted to `#7cc4bd` (`#9fd6d0` for small text), countries lifted the same way.

Font stacks:

- Display: `"Fraunces", "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif` at weights 200 to 400, optical size 144 for the big settings
- Body: `"Source Serif 4", "Iowan Old Style", "Palatino Linotype", Georgia, "Times New Roman", serif` at 19 px / 1.62
- Labels and data (the former mono slot): the body stack as small capitals with 0.09 em tracking; chapter and table numbers in Fraunces with old-style tabular figures

Measure: 31 em (about 74 characters of Source Serif 4). Text column 57 percent of the viewport, gutters 5.4 vw up to 84 px, masthead 64 px.

## What changed beyond tokens

- Masthead: no blur, no boxes; wordmark and italic running head, section names as words, the current one underlined in teal; the search and theme buttons lose their borders.
- Home: the title in Fraunces light at 92 px, the dek in italic, the overview box replaced by a rule above and a hairline below with five headwords in Fraunces and no button chrome; the numbered spine keeps its line and node, the number moves to Fraunces old-style figures.
- Chapter opening: the tile becomes the folio described above; "Chapter · stage 4 of 15" in small capitals; the lede in italic; "In plain terms" set between two rules instead of in a tinted box; "In short" in Fraunces light at 26 px.
- Chokepoint card: the card loses its border, background and shadow; a 1.5 px ink rule above and a hairline below; the two tags become words separated by a middle dot; the three KPIs in Fraunces light at 34 px; Extreme in teal.
- Every mono label across the site (tables, KPIs, tags, legends, footers, tooltips, the contents sheet) becomes serif small capitals or plain serif at 13.5 px. The chain bars and the sticky rail are thinner and the Extreme band is teal at 85 percent.
- Suppliers: the atlas becomes a plate with an ink rule above; country buttons are words with a teal underline on the chosen one; the panel loses its box; band tags become small capitals; the map keeps its country rings.
- Buttons, chips, pickers, filters, popovers and the search panel: square, hairline borders, serif text; pressed states are ink.

## What would need real work to ship

- The masthead still carries the tagline, so it is a wordmark and eleven words, not five. Moving "Every stage, and who controls it" into the home page as a printed subtitle needs a markup change.
- The chapter number sits above the title inside the text column; a true facing-page composition, where the number, title and specimen are one grid and the specimen's "Specimen 04" tag aligns with the "Chapter" line, needs `.ch-id` and `.stage` to share a grid, which an override cannot do because the stage is a fixed figure outside the column.
- Old-style figures and small capitals rely on the Google Fonts builds keeping the `onum`, `tnum` and `smcp` features. Fraunces and Source Serif 4 do; the fallback faces synthesize small caps, which look heavier.
- The specimen captions still mention "the amber strip", which is now teal; that is copy, not CSS.
- Sizes on the chips comparison table and the export-controls matrix were only touched through tokens and the label rule; they read fine but have not been tuned line by line.
- Captures: `01` home, `02` the Lithography opening, `02b` the same chapter scrolled to its chokepoint card, `03` Suppliers, `04` the phone, `05` dark. The point cloud does not render under the repo's `build/shoot.py` because of `--disable-gpu`; the captures here were taken with a private copy (`shoot.py` in this folder) that enables SwiftShader WebGL and uses its own debug port. Nothing in the site changed for that.
