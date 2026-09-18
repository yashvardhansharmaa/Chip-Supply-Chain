# Journal

Direction key `journal`, port 8873, DevTools port 9373. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `journal.css`, the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script with WebGL on (`shoot.py`), and the captures (`01` home, `02` the Lithography head, `02b` its chokepoint card as Table 4, `03` Suppliers, `04` home on a phone, `05` home in the dark theme). No site source was touched.

## The direction

The site set like the best review article a scientific journal ever printed: the register of a Nature review or an Annual Reviews chapter, with the design ambition those rarely get. Chipmaking is the most cited industry on earth, and the site's readers, policy staff, researchers and students, already read this way: they trust a page that numbers its figures, rules its tables and footnotes every claim. So the page borrows the journal's apparatus and treats it as the design. The ground is white, not cream. The ink is a deep gray-black. One color, a bottle green, is reserved for the four things a journal sets in color: figure and table numbers, links and citation marks, the chosen state (the current tab, the current stage, a pressed country) and the Extreme band. No shadow, no radius, no colored rail. Fills appear only where a journal would tint a box.

The thing to remember is that every object on the site has a number and a caption. The specimen beside every chapter is Figure N: the object alone on white, a rule the width of the caption, then a caption block with "Figure 04 · Lithography" in bold sans and the description under it. Every chokepoint card is Table N, set with a journal table's rules only: a heavy rule above, a light rule under the header row, hairlines between rows, a heavy rule below, nothing vertical. "In plain terms" is Box N, a pale panel under a heavy rule. Every chapter opens like an article: a category line (Chapter 04, stage 4 of 15) in green sans, the title in heavy Newsreader, the lede as an abstract at 21.5 px, then the article-information line, then the fifteen stages as a numbered strip. Section heads inside a chapter are numbered (1 How it works), the citation superscripts are bold green tabular figures, and the sources list at the foot of each chapter is a references section with green numerals and a heavy rule. Each chapter carries a running head, its own title in tracked capitals over a rule, drawn from the article's `data-title`; the fixed rail that follows the reader becomes the volume's running head, "The Chain" and fifteen numbers with the current one in green.

Faces. Display is Newsreader at 700 with the optical size axis pinned to 72 for titles, so the contrast is high and the serifs crisp; at 24 to 48 it sets the section heads, chapter list and table values. Body is Source Serif 4 at 18 px, a text serif with an optical size axis and figures that sit well in running prose. Labels, tabs, captions, table heads, the running heads and every figure number are Source Sans 3 at 11 to 13 px with tabular figures, at weight 500 for text and 600 for labels, replacing the monospace.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#141617` | ground, white |
| `--bg-2` | `#f5f6f5` | `#1b1e1f` | the tint of a box, row hover |
| `--bg-3` | `#e9ebea` | `#242829` | land on the map |
| `--ink` | `#1a1c1e` | `#e6e8e9` | text, 17.1:1 on the ground |
| `--ink-2` | `#3d4246` | `#bfc4c8` | secondary text, 10.2:1 |
| `--muted` | `#5d6368` | `#8e969c` | labels and captions, 6.1:1 (5.2:1 on `--bg-3`) |
| `--line` / `--line-2` | `#dfe2e1` / `#c4c8c7` | `#2a2f31` / `#3b4143` | hairlines |
| `--accent` | `#155a40` | `#7fd0a8` | bottle green, 8.2:1 light and 9.9:1 dark, so it carries small text alone |
| `--accent-ink` | `#0d4c35` | `#9adcbb` | the darker pairing for hover |

Country colors `--c1` to `--c8` keep their hues (blue, orange, teal, yellow, violet, red, olive, gray: `#2f6db5 #c9652f #1f8f8a #b8951d #6b56b8 #c23f3a #7a7a2a #8b949c`), desaturated a step to sit on white and none of them within reach of the bottle green; the dark set is brightened. The specimen reads `--stage-ink: 26, 28, 30` and `--stage-accent: 21, 90, 64` (dark: `230, 232, 233` and `127, 208, 168`).

Font stacks:

- display: `"Newsreader", "Source Serif 4", "Iowan Old Style", "Times New Roman", serif`
- body: `"Source Serif 4", "Newsreader", "Iowan Old Style", Georgia, serif`
- labels and data (the `--font-mono` slot): `"Source Sans 3", "Public Sans", "Helvetica Neue", Arial, sans-serif`, with tabular figures

Measure: `--measure: 33em` at 18 px Source Serif, about 74 characters. The text column stays at `--col: 58%`. Masthead 58 px. The heavy rule is `--rule: 1.5px`.

## What changed beyond tokens

- Masthead: solid white, no blur, a 1 px ink rule under it; the wordmark in Newsreader 700 sentence case with the tagline as a serif italic; tabs in Source Sans with a 2 px underline for the current page in green; the icon buttons square.
- The figure: the specimen's tag moves from the top-left corner to sit under the canvas as the caption's first line, left-aligned, bold, with a rule above it; the caption follows in 12.5 px sans. This is flex `order` on the existing elements; the renderer is untouched. The tag reads "Figure 04 · Lithography" rather than "Specimen 04": that is the one text change in the copy, three occurrences of the string `Specimen <b>` (one in the markup, two in the script that writes the tag), made by `inject.py` and not by CSS. The "Specimen: EUV scanner" label in each chapter's meta line is untouched.
- Home: the title in Newsreader 700 at 66 px, the dek in Source Serif at 21.5 px; "What the site covers" is Table 1, a ruled table with the name in Newsreader and one line in the body serif; the chapter numbers on the walk are Newsreader 700 at 26 px in the margin, the current one green; the spine keeps its hairline and loses its node; the two facts under each chapter are set under a hairline with a dash.
- Chapters: the head is reordered so the category line, title, abstract and article information come first (`display: contents` on the head's second div plus flex `order`, as Folio did); the running head is `.chapter::before` reading `attr(data-title)`; the compact chain strip becomes fifteen tabular numbers with 3 px marks; "In plain terms" becomes Box N with a `counter()`; "In short" takes a rule and a plain label; section heads are numbered with a per-chapter counter; the chokepoint card becomes Table N with the rules described above and the KPI values in Newsreader, Extreme and Very hard in green; the sources block becomes a references section.
- Data pages: page titles in Newsreader 700; the atlas on Suppliers is Figure 1 with a heavy rule above, the pressed country filled green, the land `--bg-3`, the route green, the country panel's facts under a heavy rule with a pale green wash for the bars; tables everywhere (compare, suppliers, matrix, prose tables) take the journal rules and lose their vertical borders and corners; the picker, chips, filters, spec sheets, briefing cards, timeline, exits and the glossary lookup lose radius and fill for rules.
- Dark theme: full token set, the same layout, the green lifted to a mint that clears 9.9:1 on the dark ground.

Checked beyond the six captures: a chapter body (numbered section heads, citation marks, prose links), the open references list, the top of The Chain (the how-to box and the contents), AI Chips (the picker), Export Controls (the timeline and the board), Glossary (the lookup), the Lithography head on a phone, and the Lithography head in the dark theme. Nothing broke.

## What would need real work to ship

- Table N, Box N and the section numbers come from CSS counters that count `.chapter` articles in DOM order; that matches the chapter numbering today (01 to 17, with a card on 01 to 15) but a shipped build should print the number from `data-number` in the template, and the Figure label should be a template string rather than the `inject.py` substitution.
- The chapter head reorder uses `display: contents` and flex `order`, so the DOM order (chain strip, tile, title) differs from the visual order; screen readers hear the strip first. The template should be reordered.
- The running head is a pseudo-element, so it is not in the accessibility tree; fine for a decoration that repeats the title, but a shipped build should use a real element and could add the stage to it.
- The figure caption is two blocks (tag, then caption) rather than a true run-in ("Figure 4 | An extreme..."), because they are separate elements in the markup. The build should render one caption paragraph with a bold run-in.
- On phones the figure becomes the base stylesheet's bottom strip; the caption block survives there in reduced form (bold first line, two clamped lines), which reads well but is not the journal figure.
- Google Fonts serves Newsreader's optical axis, but its variable file is large; a shipped version should subset it to the weights used (700 and 400) and self-host.
- The print stylesheet and the share cards under `cards/` still carry the old tokens and faces; the print stylesheet in particular should inherit this direction, since it is already a journal on paper.
