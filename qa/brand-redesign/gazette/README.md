# Gazette

Direction key `gazette`, port 8863, DevTools port 9363. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `gazette.css`, the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script with WebGL on (`shoot.py`), and the captures: `01-home-1440.png`, `02-lithography-1440.png` (the chapter head as the brief asks), `02b-lithography-card-1440.png` (the chokepoint card in full, since the head runs past 1100 px), `03-suppliers-1440.png`, `04-home-phone-390.png`, `05-home-dark-1440.png`, and `06-controls-1440.png` (the export-controls board, one of the two choices this direction is built on). No site source was touched.

## The direction

A serious weekly of record, in the register of a print gazette or the Economist's paper edition, but composed for the screen. Chipmaking is an industry that governments now regulate line by line, and the people who read this site (policy staff, researchers) read gazettes: the Federal Register, BIS rules, annual reports. So the page adopts the form those documents trust. True white, ink black, hairlines and heavy rules, and one second color used the way a printer uses a second ink: a Prussian blue on the double rule under the masthead, on every chapter numeral, and on the chosen state (the current tab, the current stage, a pressed filter, the selected year). Nothing else is colored. Extreme and Critical are set in black, bold, because in a document of record the weight of the type carries the warning.

The masthead is a wordmark centered over the tabs with a thick rule over a thin one between them. On the home page the walk is set like a broadsheet: every stage is an entry under a rule, its numeral in the margin, its paragraph running in two columns with a hairline between. Chapters stay in a single column beside the specimen, opened by a 3 px rule and the chapter number at 74 px. The two things to remember: the chokepoint card set as a gazette notice, a double-ruled box with a bold headline row, the tags as plain words, and ruled entries; and the export-controls board as a table of record, where each state is a word with a printer's mark before it (empty square for open, dashed for case by case, half-filled for presumption of denial, solid for prohibited, struck through when suspended) instead of a colored pill.

Faces. One family does the display and the text: Merriweather, which is now a variable font on Google Fonts with weight, optical size and width axes. Headlines are Merriweather at 800 with the width axis at 90, a slightly condensed cut with real authority; the wordmark and the numerals go to 900 at width 87, the narrowest the family allows. Body is the same family at 400, width 100, optical size on auto, at 16.5 px, where its large x-height reads like an 18 px face. Labels, tabs, tags, table heads and buttons are Archivo Narrow, a tight grotesk, at 600 in tracked capitals: the small-caps voice of a gazette without synthesized small caps.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#121416` | ground, true white |
| `--bg-3` | `#e8e8e5` | `#24282c` | land on the map, pressed surfaces |
| `--ink` | `#111111` | `#ecebe6` | text, 18.9:1 on the ground |
| `--ink-2` | `#363636` | `#c6c6c0` | secondary text, 12.1:1 |
| `--muted` | `#5e5e5e` | `#9c9c96` | labels and captions, 6.5:1 (5.3:1 on `--bg-3`) |
| `--line` / `--line-2` | `#d6d6d2` / `#b1b1ab` | `#2e3236` / `#474c51` | hairlines |
| `--accent` | `#1b3a63` | `#9dbde6` | Prussian blue, 11.5:1 light and 9.5:1 dark; white text on it clears 11.5:1 |
| `--accent-ink` | `#122a4a` | `#b9d1ee` | hover on the blue |

Country colors `--c1` to `--c8` keep their hues (blue, orange, green, ochre, violet, red, dark green, gray); the blue for Japan is pushed toward cyan (`#2f6fd0`) so it never reads as the accent. Severity bars: `--bar-5` is the ink, `--bar-4` is `#6b6b6b`, `--bar-3` is `#c9c9c5`. The specimen reads `--stage-ink: 17, 17, 17` and `--stage-accent: 27, 58, 99` (dark: `236, 235, 230` and `157, 189, 230`).

Font stacks:

- display: `"Merriweather", "Domine", "Iowan Old Style", Georgia, serif` at 800, `font-variation-settings: "wdth" 90, "opsz" 144` (wordmark and numerals at 900, `"wdth" 87`)
- body: `"Merriweather", "Source Serif 4", "Iowan Old Style", Georgia, serif`
- labels (the `--font-mono` slot): `"Archivo Narrow", "Roboto Condensed", "Arial Narrow", "Helvetica Neue", Arial, sans-serif`

Measure: `--measure: 36em` at 16.5 px body, about 78 characters of Merriweather. `--col` stays at 58%. The masthead is 118 px tall.

## What changed beyond tokens

- Masthead: a column, not a toolbar. The wordmark is centered in Merriweather 900 condensed capitals with the tagline in tracked capitals under it; a 3 px accent rule over a 1 px one separates it from the tab row; the tabs are tracked capitals with a 2 px accent underline on the current page; the search and theme buttons are square and pinned to the right of the tab row; a hairline closes the masthead. No blur.
- Home: the title is Merriweather 800 condensed at 68 px. "What the site covers" becomes an index under a 2 px rule: five ruled rows with run-in heads. Each walk entry opens with a 1 px rule, its numeral at 44 px in the accent, no spine and no node, and its paragraph in two columns with a hairline column rule and hyphenation. The two facts become a ruled list with square bullets.
- Chapters: a 3 px rule opens each chapter; the chain strip sits under it with the current stage in the accent; the chapter tile loses its box and becomes the numeral at 74 px in the accent with "Chapter" above and "stage 4 of 15" under it; "In plain terms" is a ruled paragraph, "In short" loses its thick rail. The fixed rail (the progress strip that rides the scroll) becomes a 7 px ribbon of fifteen ticks so it no longer duplicates the chapter's own strip.
- The chokepoint card: a 1 px ink border with a second 1 px rule 3 px outside it (a double-ruled notice), the headline row in Merriweather 800 capitals over a double rule, the two tags as words separated by a middle dot, the KPI values at 30 px in ink, ruled entries, square country chips.
- Export Controls: the board takes a 2 px rule above and 1 px below; the states are words with printer's marks (see above) instead of pills; the year scrubber is a ruled row with the chosen year underlined in the accent; the mode buttons are square, the chosen one filled in the accent.
- Suppliers: the atlas becomes a boxed plate with a 1 px ink border, the country buttons in tracked capitals with the chosen one filled in the accent, the ocean white and the land a light gray, the chosen country's stops filled in the accent; the panel title is sentence case; Extreme badges are black.
- Everywhere: corners square, tinted fills replaced by rules, tables with a 2 px rule above and 1 px below and black-ruled heads, figures with a rule above, buttons in the label face, every pressed control filled in the accent, citations in black.
- Dark theme: full token set on a near-black ground with the blue lifted to `#9dbde6`; the same layout.

Checked beyond the captures: the chokepoint card in full (`02b`), the Export Controls board and timeline (`06`).

## What would need real work to ship

- The two-column walk is `columns: 2` on each entry's single paragraph. That is honest broadsheet setting, but a paragraph that is short splits into two stubs; a shipped version should set the columns on the whole entry (paragraph plus facts) and let the build decide per entry whether it earns two columns. It collapses to one column under 900 px.
- The 118 px masthead is fixed, so it costs a good deal of the viewport on a 900 px screen. A shipped version should let the wordmark scroll away and keep only the tab row pinned, which needs a change in how the site measures `--masthead` for the stage and the rail.
- Google Fonts serves Merriweather's width axis, but the fallback (Domine, Georgia) has no width axis, so without the webfont the headlines set wider and the wordmark runs long. Self-hosting the variable font, or a drawn wordmark, removes that risk.
- The state marks on the export-controls board are drawn with `::before` on the pill; the legend inherits them correctly, but the compact board that rides the scroll in "By date" mode was tuned only at 1440 px.
- On phones the masthead keeps the centered wordmark with the two buttons pinned at the top right, which leaves the wordmark 17 px; the chapter numeral drops to 44 px inline with "Chapter". The print stylesheet and the share cards under `cards/` still carry the old tokens.
- The picker on AI Chips loses the base stylesheet's US and CN tints (they are overridden to plain hairline chips), so the country of a maker now reads only from its code.
