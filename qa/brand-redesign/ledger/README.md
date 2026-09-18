# Ledger

Direction key `ledger`, port 8851. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `ledger.css`, the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script (`shoot.py`, same as `build/shoot.py` but on DevTools port 9351, because the shared port 9333 attached to another designer's Chrome), and the five captures. No site source was touched.

## The direction

The site set like a serious printed reference: a financial ledger, a well-kept annual report, the kind of document where every figure has a place and a rule under it. Chipmaking is an industry of counted things (48 EUV scanners a year, 220 suppliers, 15 stages) and its readers audit claims for a living, so the page borrows the ledger's habits. A very pale warm white ground, not cream. Near-black ink with a hint of blue. Hairline rules instead of boxes, corners square, no shadows, no grain. A strong left margin. One accent, the oxide red of a copper interconnect, used the way a bookkeeper used red ink: only where a figure needs to be seen (Extreme, Critical, the current stage, a citation number). The one thing to remember is the left edge of the page: it is a ruled ledger column. On the home page the chapter numbers sit in it, large and light, beside a hairline that fills with red as you read. On every chapter page the same column carries the chapter number and, under it, the fifteen stages of the chain as fifteen short ruled lines with their concentration bars, the current stage ticked in red. The stage strip that used to run across the top of each chapter now runs down the margin, where an account number would.

Faces. Display is Fraunces, and I chose it over Instrument Serif and Libre Caslon Display because it is a variable font with weight and optical size axes: one file gives the light hairline numerals (weight 300 at the top of the optical range, where the contrast is highest), the plain titles (weight 400 at a middle optical size, where it reads as a sober transitional rather than a display face), and the wordmark. The SOFT and WONK axes are pinned to zero everywhere, so none of its playful forms appear. Body is Source Serif 4, a workhorse text serif with an optical size axis and good screen hinting at 18 px. Labels, tabs, table heads and buttons are Instrument Sans, a quiet grotesk that replaces the monospace; the site's labels keep their tracking and capitals, they just stop looking like a terminal.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#f7f6f2` | `#14171c` | ground, a pale warm white |
| `--bg-3` | `#e8e5df` | `#23282f` | land on the map, pressed surfaces |
| `--ink` | `#14181f` | `#ece9e2` | text, 16.5:1 on the ground |
| `--ink-2` | `#3b424c` | `#c3c7cd` | secondary text, 9.4:1 |
| `--muted` | `#5c636d` | `#8f969f` | labels and captions, 5.6:1 (4.8:1 on `--bg-3`) |
| `--line` / `--line-2` | `#d8d4cc` / `#bfb9af` | `#2c3138` / `#3d434b` | hairlines |
| `--accent` | `#8f3a1f` | `#e57a52` | oxide red, 7.0:1 light and 6.2:1 dark, so it carries small text on its own |
| `--accent-ink` | `#7d3418` | `#ec8f6b` | the darker pairing for hover states |

Country colors `--c1` to `--c8` keep their hues (blue, orange, green, yellow, violet, red, dark green, gray) and are retuned to sit on the paler ground; the dark set is brightened. The specimen reads `--stage-ink: 20, 24, 31` and `--stage-accent: 143, 58, 31` (dark: `236, 233, 226` and `229, 122, 82`).

Font stacks:

- display: `"Fraunces", "Libre Caslon Display", "Iowan Old Style", Georgia, serif`
- body: `"Source Serif 4", "Literata", "Iowan Old Style", Georgia, serif`
- labels (the `--font-mono` slot): `"Instrument Sans", "Public Sans", "Helvetica Neue", Arial, sans-serif`

Measure: `--measure: 34em` at 18.5 px body, about 78 characters of Source Serif. The text column is `--col: 60%` (was 58%) to pay for the ledger column.

## What changed beyond tokens

- Masthead: solid ground, no blur; the wordmark in Fraunces small caps with a serif italic tagline; the tabs lose their filled pill and take a hairline underline for the current page; the two icon buttons go square.
- Home: the title is set in Fraunces at 60 px, sentence case, and the head is indented by the width of the ledger column so the margin reads from the first line. "What the site covers" stops being a box of five chips and becomes a ruled table, name on the left, one line on the right, arrow after the name. Each chapter's number is drawn at 54 px, weight 300, in the margin; the node on the spine is gone because the number is the mark.
- Chapters: the chapter tile loses its border and becomes the top of the ledger column (Chapter / 04 / stage 4 of 15); the compact chain strip is repositioned into the same column as fifteen ruled rows of number plus bar, the current one ticked in red, with the "Lithography, stage 4 of 15 / Next" line under it. "In plain terms" and "In short" lose their tinted box and thick rail for a rule above and below with a red label. The chokepoint card loses its shadow, fill and corners and becomes a ruled statement: a 2 px rule above, hairline dividers, the KPI values in Fraunces, Extreme and Very hard in red.
- Data pages: the page titles are Fraunces sentence case; the atlas, tables, figures, spec sheets, how-to block, previous/next and every chip, tag and button lose their radius and tinted fills for hairlines. The atlas stop cards and country facts are set in the body serif at weight 500 rather than Fraunces, because Fraunces's ampersand is too decorative at that size.
- Dark theme: full token set, the same layout, accent lifted to a copper orange that clears 4.5:1 on the dark ground.

Checked beyond the five captures: The Chain page top (how-to block and contents), AI Chips (picker and spec sheet). Nothing broke; the US and CN picker tints from the base stylesheet remain.

## What would need real work to ship

- The ledger column on chapter pages is absolutely positioned at fixed offsets (tile at 66 px, chain at 214 px). It holds because every chapter head is taller than the column, but a real build should put the column in a grid track of the chapter, so it can never overlap a short head and so the chain strip is not a repositioned horizontal component.
- Google Fonts strips OpenType features from its subsets, so the wordmark's small caps are synthesized by the browser (scaled capitals). Shipping wants self-hosted Fraunces with `smcp`, or a drawn wordmark.
- Between 900 and 1100 px the text column is tight (about 560 px after the margin); the override narrows the gutter only under 900 px. A shipped version would step the gutter down at 1100 px too.
- On phones the chain strip is hidden (as in the base) and the chapter number returns to a plain block above the title; the ledger column survives only on the home page, at 34 px. That is a compromise, not a design.
- The print stylesheet and the share cards under `cards/` still carry the old tokens.
- The picker on AI Chips keeps the base stylesheet's light-blue and light-red tints for US and CN makers; they read slightly out of tune with the paper ground and should be redrawn as hairline chips with a country code.
