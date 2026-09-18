# Grid

Direction key `grid`, port 8872, DevTools port 9372. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `grid.css`, the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script with WebGL on (`shoot.py`), and the captures (`01` home, `02` the Lithography head, `02b` its chokepoint card, `03` Suppliers, `04` home on a phone, `05` home in the dark theme, `06` the Lithography prose with its sideheads). No site source was touched.

## The direction

The Swiss school of Müller-Brockmann and Vignelli, with its discipline and none of its loudness. A reference on chipmaking is a book of counted things, and the grid is how a designer counts: every element sits on an explicit twelve-column grid, and the reader feels the order without seeing a single rule drawn for decoration. The ground is plain white, the ink near black, one family of type at every size, and one accent, a dark green, used for three things only: where you are (the current chapter number, the current stage in the chain), what is Extreme (the band values on the card, a Critical firm on the Suppliers page), and a citation number. The specimen is treated as an object placed in its columns, flush left with its own tag and caption, not centered in a panel.

The thing to remember is the asymmetry. The page splits eight columns to four: the reading column takes columns 1 to 8, the specimen columns 9 to 12, and the canvas fills those four columns exactly, from the gutter to the page margin. Inside the reading column, the first two columns are a label column and the other six carry the text. The title spans all eight at 92 px, flush left, tight leading. Under it the chapter number sits alone in the first two columns while the lede hangs in a narrower measure to its right; on the home page the same slot carries the word count. The chokepoint card is a true table on that grid: one heavy 3 px rule above, then rows of label and value with no borders between them, only alignment and space. The prose runs in the six text columns and its section heads float out into the label column as sideheads, so a chapter reads like a Unigrid brochure: the margin says what the paragraph is about. On Suppliers the same grid places the country list, the caption line and the route under one heavy rule. The masthead sits on it too: the wordmark small and precise at column 1, the tabs starting at column 8.

Faces. One grotesk, Hanken Grotesk, at 400 for reading, 500 for labels and numbers, 600 for titles; it has the optical quality of a text face at 17.5 px and enough weight at 92 px without turning into a poster. DM Mono appears only where columns of figures must align: the compare and matrix tables, the country shares on the Suppliers panel, the spec sheet values. No serif anywhere. No uppercase display type; labels keep their small tracked capitals.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#111213` | ground |
| `--bg-3` | `#e9e9e9` | `#232527` | land on the map, pressed surfaces |
| `--ink` | `#111111` | `#f1f1ef` | text, 18.9:1 on the ground |
| `--ink-2` | `#3a3a3a` | `#c7c7c4` | secondary text, 11.4:1 |
| `--muted` | `#666666` | `#949491` | labels and captions, 5.7:1 (4.8:1 on `--bg-3`) |
| `--line` / `--line-2` | `#e3e3e3` / `#c6c6c6` | `#2a2c2e` / `#3d4043` | hairlines, and the light bars of the chain strip |
| `--accent` | `#1a5c3c` | `#7fcd9f` | dark green, 8.0:1 light and 9.9:1 dark, so it carries small text alone |
| `--accent-ink` | `#144a30` | `#9adbb4` | the darker pairing, 10.2:1 |

Country colors `--c1` to `--c8` keep eight distinguishable hues (blue, orange, teal, yellow, violet, red, brown, gray: `#2b63c4 #e06a1f #1f9a8a #c9a10c #5a48b8 #c3302b #7a4f1f #8a9099`) and are lifted for the dark ground; they are data colors, not brand colors. The specimen reads `--stage-ink: 17, 17, 17` and `--stage-accent: 26, 92, 60` (dark: `241, 241, 239` and `127, 205, 159`).

Font stacks:

- display and body: `"Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif`
- labels (the `--font-mono` slot): the same stack, at 11 px, weight 500, 0.08 em tracking
- data (`--font-data`, new): `"DM Mono", ui-monospace, SFMono-Regular, Menlo, monospace`, only on aligned figures

The grid: page margin `--m: 48px`, gutter `--g: 24px`, column `--cw: (100vw - 2m - 11g) / 12` (90 px at 1440). Measure `--measure` is six columns, 660 px at 1440, about 74 characters of Hanken Grotesk at 17.5 px. The reading column `--col` is the margin plus eight columns plus one gutter (960 px at 1440); the specimen gets the other four columns plus the margin.

## What changed beyond tokens

- Masthead: solid ground, no blur; the wordmark in 13.5 px weight 600 with the tagline in muted at the same size; the tabs are plain words with a 1.5 px underline on the current page; the wordmark is capped at seven columns so the tabs begin at column 8; the search and theme buttons go square and sit flush right.
- The specimen: the stage is padded by the page margin on the right and its tag and caption are set flush left, so the canvas occupies columns 9 to 12 exactly.
- Home: the head becomes an eight-column grid, title across all eight, the three counts stacked in columns 1 and 2, the dek in columns 3 to 7. "What the site covers" loses its box of chips and becomes a table under a hairline: label in the first two columns, name over two, line over four (CSS subgrid). Each chapter's number is drawn at 40 px in the first two columns; the spine and its node are gone, the number alone marks the step, green when current.
- Chapters: the chapter head is reordered (title first, then the chain strip) with flex order; the tile becomes the bare number under the word Chapter; the lede hangs in five columns; the chain strip moves under the meta line in the text columns and is lightened (ink only for Extreme, hairline gray otherwise, current stage in green). "In plain terms" and "In short" become label-and-text rows on the same grid. The prose is indented to the text columns and its h3 heads float into the label column as sideheads. The chokepoint card is a grid with a 3 px rule above and no other border: head, three KPIs, three rows and two status blocks are all restated as label | value rows through `display: contents` and subgrid; country codes lose their boxes and become a column of two-letter codes.
- Data pages: the page head is the same eight-column head. The atlas loses its border and fill for one heavy rule; the country buttons become plain words with an underline when pressed; the panel is unfilled and its Extreme marks are green words rather than pills; the map's ocean is the page. Tables, figures, spec sheets, briefing cards, exits and doors lose radius and fill for a hairline in ink; numbers in tables are set in DM Mono.
- Dark theme: full token set, same layout, the green lifted to clear 9.9:1.

Checked beyond the deliverable captures: the prose sideheads (`06`), the fixed progress rail on scroll, the phone masthead and bottom strip, and the card's rows on a phone (they stack, label above value).

## What would need real work to ship

- The grid is computed from `100vw`, which includes the scrollbar on Windows and Linux; there the right margin would be up to 17 px short. A shipped build should derive the column from the container (`cqw`) or set the grid on `body` with `scrollbar-gutter: stable`.
- Four columns for the specimen (432 px at 1440, about 320 px at 1100) is narrower than the current 42 percent. The point clouds fit, but between 900 and 1200 px the stage is tight and the tabs can overflow their slot; a real build would step the split to 7 and 5 columns under 1200 px.
- The sideheads are floated `h3` elements pulled into the label column with a negative margin. They work because line boxes ignore a float whose margin box lies outside the content area, but a very long heading over a very short section can overlap the next figure or table (those clear the float, so they drop instead). A shipped build should place the heads with grid, not floats, and screen readers should be checked for reading order.
- The card, the home table and the chapter head rely on `display: contents` and CSS subgrid (Chrome 117, Safari 16, Firefox 71). Older browsers get the base layout with the new tokens.
- The chapter head is reordered with flex order, so the chain strip's DOM position (first) no longer matches its visual position (after the meta line); the chapter template should be reordered.
- On phones the grid collapses to a single column and every label stacks above its value; the label column survives nowhere under 900 px. That is a compromise, not a design.
- The print stylesheet and the share cards under `cards/` still carry the old tokens and faces.
