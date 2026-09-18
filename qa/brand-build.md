# Brand build: Ledger in garnet, in the source (18 Sept 2026)

The accepted mock (`qa/brand-redesign/DECISION.md`: Ledger, garnet accent, Folio's specimen caption) is now the site's own stylesheet. Nothing was appended as an override; the tokens, the type, the ledger column, the ruled card and every data page are set in `src/styles.css` and `src/modules/*.css`, and the chapter head markup in `build/build.js` carries the ledger column as a real element. Captures are in `qa/brand-build/`.

## What changed, file by file

**`src/template.html`**
- Google Fonts link: Fraunces (`ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0,0`, so SOFT and WONK are pinned to zero and the whole optical range is served), Source Serif 4 (opsz 8 to 60, weights 300 to 700, one italic), Instrument Sans (400 to 700, one italic), Jost 400 for the specimen caption, and IBM Plex Mono 400 and 500 for the few places that still need aligned digits. Plex Sans Condensed and Newsreader are gone.
- The geopolitics essay's head now uses the same structure as the built chapters: an `<aside class="ch-ledger">` holding the chapter tile, then `<header class="chapter-head">` with the title block, then `.prose`.

**`build/build.js`** (chapter head only)
- `chapterHTML` writes `<aside class="ch-ledger" aria-label="Chapter N, stage i of 15">` containing the tile (`.ch-tile`) and the compact chain (`chainTrack` plus `.chain-foot`), before `<header class="chapter-head">`. The chain data is the same `chainTrack(stages, ch.id)` call as before; nothing is duplicated, the strip is only placed in the column instead of above the title. `.ch-id` no longer holds the tile.
- The head's copy button reads "Link to chapter". The label the script restores after "Copied" lives in `src/app.js` line 1976 (`b.textContent = 'Copy link'`), which this build does not own; see "Left for others".

**`src/styles.css`** (rewritten around the new tokens; every selector the scripts use is kept, see the grep note at the end)
- Tokens: the sheet below. `--font-mono` keeps its name but is now Instrument Sans, so every module that used the mono slot for labels reads the new face without edits. A new `--font-code` (IBM Plex Mono) is used only where digits must align: `.prose code`, the copy-as-CSV block (`.cite pre`), the timeline dates (`.timeline .d`, `.tl li .d`), the board's dates and years (`.cf-ev-d`, `.cf-yl`, `.cf-ys`, `.cf-yn`). `--font-caption` is Jost. `--opsz-title` and `--opsz-numeral` hold the two Fraunces settings (opsz 48 for titles, 144 for the light numerals, SOFT and WONK 0 in both).
- Body 18.5 px / 1.58, no grain (`body::before` removed), 1 px underlines with a 0.18 em offset, focus ring 1.5 px garnet, square.
- Labels: Instrument Sans 11 px, weight 500, 0.1 em tracking.
- Display type: one shared rule sets Fraunces 500 at opsz 48 for titles and headings; page titles and chapter titles are weight 400; numerals (`.wk-n`, `.ch-tile .v`, `.year-label`, `.sup-rank`, `.sa-num b`) are weight 300 at opsz 144 with lining tabular figures.
- Masthead: solid ground, hairline below in `--line-2`, no blur. Wordmark in Fraunces small caps (`font-variant-caps: small-caps` at opsz 36; Google Fonts strips the `smcp` feature from its subsets, so the browser synthesizes them from scaled capitals, which is what the mock showed too; a self-hosted Fraunces or a drawn wordmark would replace this without a markup change). Tagline in Source Serif italic. Tabs in Instrument Sans with a garnet underline for the current page, no filled pill. Search and theme buttons square, 1.4 px strokes.
- The reading column: `--col: 60%`, left padding `clamp(16px, 3vw, 44px)`.
- Specimen: the canvas first, then the tracked plate line ("SPECIMEN 04 · LITHOGRAPHY", Jost 10.5 px, 0.28 em, the number in garnet) under a centered 28 px rule, then the caption centered in Jost 12.5 px at 40ch. Under 900 px the bottom strip keeps its grid and the rule is dropped.
- Chapter: `.chapter` is a two-track grid, `var(--gutter) minmax(0, 1fr)` with `--gutter-gap` between. `.ch-ledger` sits in the first track, spans the head and the prose, and is sticky at `masthead + 84px` so the chapter number and the index stay with the reader. The tile has no box: "Chapter" / the number at 72 px weight 300 / "stage 4 of 15", right-aligned. Under it the chain: `.chain-track` becomes a block of fifteen 15 px rows, number then bar, each ruled with `--line`; bar widths 16, 38, 66 and 100 percent by band; Extreme in garnet (`--bar-5`), High in ink (`--bar-4`), the rest in `--line-2`; the current row ticked with a 2 px garnet mark in the margin and its number in garnet; the `.chain-foot` under the rows names the stage and the next one. The rail at the top of the column (the same compact chain, fixed) is unchanged in role and restyled. "In plain terms" and "In short" lose their tinted box and thick rail for a rule above and below with a garnet label.
- Chokepoint card: the mock's ruled statement. 2 px rule above, 1 px rule below, hairline dividers, no fill, no shadow, no radius; KPI values in Fraunces 400 at opsz 72; Extreme and Very hard in garnet; the tags outlined, the Extreme tag in garnet; the KPI notes in the body serif.
- Data pages: page titles Fraunces 400 sentence case at up to 62 px. Tables, figures, spec sheet, the how-to block, previous/next, the search panel, chips, tags, buttons, inputs, tiers and chips all square, with hairlines (a 1 px ink rule above, `--line-2` below) instead of boxes. The AI Chips picker is redrawn as hairline chips: no tint, Instrument Sans name, the maker's country code (`attr(data-cc)`) set small at the right edge of the chip, the chosen chip filled in ink with the box turned into a tick.
- Dark theme: a full token set (below).
- Phone (under 900 px): `--gutter` 34 px. The chapter grid collapses to one column, the ledger becomes a plain block above the title (number at 54 px), the chain rows and foot are hidden as in the base. The masthead's tab strip keeps the garnet underline. The bottom specimen strip keeps its grid.
- Between 900 and 1100 px `--gutter` steps to 64 px and `--col` to 62 percent so the text column is not squeezed.

**`src/modules/walk.css`**
- The head is indented by `--gutter + --gutter-gap` so the margin reads from the first line; title 60 px Fraunces 400, dek 20 px, meta labels separated by 1 px ticks.
- "What the site covers" is a ruled table: rule in ink above, `--line-2` below, one hairline row per page, the name in Fraunces 500 at 19 px with an arrow, the line beside it at 15.5 px; hover turns the name garnet.
- The spine is the ledger column: `.wk-step` is `var(--gutter) minmax(0, 1fr)`; the hairline sits at the column's right edge; the node is gone because the number is the mark: `.wk-n` in Fraunces 300 at 54 px, opsz 144, muted, ink-2 once read, garnet while current. The fill that `walk.js` drives (`--wk-fill`) is unchanged and now paints garnet.
- Facts block with a 1 px left rule; "source" links in garnet; pips square; "Read the chapter" in Instrument Sans; the end links outlined and square; the progress rail solid, no blur.

**`src/modules/chips.css`**: the picker tick, plan tiles without fill, the table with an ink rule above and hairline below (sticky head on the ground color), values in Fraunces 400 with tabular figures, footnote leads in the body bold.

**`src/modules/controls.css`**: the board's pills are square outlines (open: muted; case by case: dashed ink; presumption of denial: garnet outline and text, no fill; prohibited: solid ink; policy: ink-2 outline); the suspended tag dashed with no fill; the year buttons outlined, the chosen one in garnet with no fill; "Board as of" as a label with the date in Fraunces; dates and years in the monospace; rows hover by turning the name garnet, no fill; the open row's rule turns ink.

**`src/modules/lookup.css`**: the list is a ruled column (ink rule above, hairline below, no box), entries in Fraunces 500 at 15 px, the selected one filled in ink; the search field square; the selected entry and the firm, chip and country cards are ruled statements (2 px rule above, hairline below, no fill, no shadow); the "look it up" link in garnet Instrument Sans; bands and chokepoint tags as outlines, Extreme and Critical in garnet.

**`src/modules/suppliers.css`**: the ladder's rank numerals in Fraunces 300 at opsz 144, garnet when lit; firm names in the body serif at 500 (Critical in garnet 600); the lit rung marked by a 2 px garnet rule, no fill; the mode switch and tooltips square; the tooltip on the ground color with the popover shadow.

**`src/modules/summary-a.css`** (the atlas on Suppliers): the plate has an ink rule above and a hairline below, no fill; country chips outlined in Instrument Sans, the chosen one filled in ink; the map on `--bg-2` with land in `--bg-3`; the route in garnet; the country panel ruled; its title Fraunces sentence case; the fact rows in the body serif at 500 (Fraunces's ampersand was too decorative at that size, as the Ledger README noted); the stop cards with a 1 px rule, the chosen country's in 2 px garnet; the stop tooltips and the four numbers restyled; the four numbers in Fraunces 300.

**`src/modules/print.css`**: the accent tokens switch to garnet, and the chapter prints with the ledger column as a 22 mm grid track beside the head (the tile is no longer inside `.ch-id`).

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#f7f6f2` | `#14171c` | ground |
| `--bg-2` | `#f1efea` | `#1b1f25` | hover rows, the map |
| `--bg-3` | `#e8e5df` | `#23282f` | land, pressed surfaces |
| `--ink` | `#14181f` | `#ece9e2` | text |
| `--ink-2` | `#3b424c` | `#c3c7cd` | secondary text, the High bar |
| `--muted` | `#5c636d` | `#939aa3` | labels and captions |
| `--line` / `--line-2` | `#d8d4cc` / `#bfb9af` | `#2c3138` / `#3d434b` | hairlines |
| `--accent` | `#7a1f2b` | `#d4667b` | garnet: the current tab and stage, chapter numbers in the margin, Extreme, Very hard, Critical, citation numbers, links |
| `--accent-ink` | `#611722` | `#de7f92` | the hover pairing |
| `--accent-soft` | `rgba(122,31,43,0.09)` | `rgba(212,102,123,0.14)` | the one soft fill (citation hover, the share bars in the country panel) |
| `--bar-5` / `--bar-4` / `--bar-3` | accent / `#3b424c` / `#bfb9af` | accent / `#c3c7cd` / `#4a515a` | Extreme, High, the rest |
| `--c1` to `--c8` | `#2b63c4 #e06a1f #1f9a6d #c9a10c #5a48b8 #c3302b #2e7d1e #8a9099` | `#5b8ee6 #ef8140 #34b585 #d9b21e #8676d8 #e0504a #4f9c3a #8a9099` | country colors |
| `--stage-ink` | `20, 24, 31` | `236, 233, 226` | the specimen's ink, read by `src/app.js` |
| `--stage-accent` | `122, 31, 43` | `212, 102, 123` | garnet, overridden per specimen by the specimen engineer |
| `--font-display` | `"Fraunces", "Libre Caslon Display", "Iowan Old Style", Georgia, serif` | | titles, numerals, the wordmark |
| `--font-body` | `"Source Serif 4", "Literata", "Iowan Old Style", Georgia, serif` | | reading text |
| `--font-mono` | `"Instrument Sans", "Public Sans", "Helvetica Neue", Arial, sans-serif` | | labels, tabs, table heads, buttons (the old mono slot) |
| `--font-code` | `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace` | | code, the CSV block, the board's dates and years |
| `--font-caption` | `"Jost", "Instrument Sans", ...` | | the specimen caption |
| `--opsz-title` / `--opsz-numeral` | `"opsz" 48` / `"opsz" 144`, both with `"SOFT" 0, "WONK" 0` | | the two Fraunces settings |
| `--measure` | `34em` | | about 78 characters of Source Serif at 18.5 px |
| `--col` | `60%` (62% under 1100 px, 100% under 900 px) | | the text column |
| `--gutter` / `--gutter-gap` | `88px` / `28px` (64 / 20 under 1100 px, 34 / 12 under 900 px) | | the ledger column |

The dark accent is lifted from the decision's `#c9536a`, which measures 4.26:1 on the dark ground; `#d4667b` clears 4.5:1 for small text (5.12:1).

## Contrast (WCAG ratio, computed)

| Text | Light on `#f7f6f2` | Light on `--bg-3` | Dark on `#14171c` | Dark on `--bg-3` |
| --- | --- | --- | --- | --- |
| `--ink` | 16.45 | 14.15 | 14.82 | 12.23 |
| `--ink-2` | 9.38 | 8.07 | 10.58 | 8.74 |
| `--muted` | 5.61 | 4.83 | 6.32 | 5.22 |
| `--accent` | 9.43 | 8.12 | 5.12 | 4.23 |
| `--accent-ink` | 11.74 | 10.10 | 6.46 | 5.34 |
| ground on `--accent` (filled controls) | 9.43 | | 5.12 | |
| ground on `--ink` (filled controls) | 16.45 | | 14.82 | |

Every text color clears 4.5:1 on the ground in both themes. The only pairing under 4.5:1 is dark garnet on dark `--bg-3` (4.23), and no garnet text sits on `--bg-3` in the dark theme: the pressed surfaces that use `--bg-3` (land on the map, the matrix cells' base) carry no accent text.

## Checks

- `node build/build.js`: no warnings (2,705 KB, 16 chapters plus the essay).
- `node qa/scripts/check-integrity.js`: clean apart from the known "has no supplier entry" lines.
- Console: every view (`#/`, `#/chain`, `#/landscape`, `#/suppliers`, `#/suppliers?tab=country`, `#/controls`, `#/exposure`, `#/glossary`, `#/geopolitics`) loaded at 390, 768 and 1440 in both themes over DevTools: no exceptions and no script errors. What remains in the log is the GoatCounter "not counting because of: localhost" notice, swiftshader's "GPU stall due to ReadPixels" performance warnings on the specimen canvas, and one 404 for `favicon.ico` on the first page load (the site ships no favicon; not new).
- Horizontal overflow: `document.documentElement.scrollWidth === innerWidth` and `body.scrollWidth <= innerWidth` on every one of those 54 loads.
- Fonts: the Google Fonts URL answers 200 with all five families; Fraunces is served with the opsz axis 9 to 144 and SOFT and WONK pinned at 0.
- Beyond the twelve captures, these were shot and checked in the scratchpad: The Chain top (how-to block and contents), the essay head (chapter 17 with the ledger column and no chain), the Suppliers ladder, the by-country ribbons, the exposure charts, a Glossary entry (ASML) with its mentions, a two-chip comparison on AI Chips, the Lithography head in dark, Suppliers and Export Controls in dark, the chapter at 1024 and 768, and Suppliers, Export Controls, AI Chips and the card on the phone. Three faults found there were fixed: the essay's "In short" heading was being sized by `.prose h3`; the phone picker had a 112 px gap under each maker's name (a flex-basis turned into a height in the column layout, older than this build); the how-to block and the contents drew two rules 40 px apart.
- Selectors the scripts rely on were grepped in `src/app.js` and `src/modules/*.js` before any rename; none were renamed. `.ch-id`, `.ch-tile`, `.chain--compact`, `.chain-foot`, `.stage-cell`, `.rail`, every `wk-` class, `.plate*`, `.ptag`, `.gl-term`, `.gl-tip` and `.stage*` keep their names and attributes; the only new class is `.ch-ledger`, and the only markup moves are the tile and the compact chain into it (and the essay's head in the template).

## Captures (`qa/brand-build/`)

01 home · 02 Lithography head · 03 Lithography card · 05 Suppliers · 06 AI Chips · 07 Export Controls · 08 Glossary · 09 phone home · 10 phone chapter · 11 dark home · 12 a chapter with a glossary popover open (the "transistor" term in Lithography).

## Left for others, and what remains

- `src/app.js` line 1976 restores the head's copy button to `'Copy link'` after "Copied"; it should read `'Link to chapter'`. (Line 1983 sets the section permalinks' title to "Copy link"; that is the `#` permalink on headings, not the chapter button, and can stay.)
- `--stage-accent` is defined as garnet in both themes for the specimen engineer to override per specimen.
- Small caps in the wordmark are synthesized (see `src/styles.css`, the wordmark comment). Shipping true small caps means self-hosting Fraunces with `smcp` or drawing the wordmark.
- The share cards under `build/cards.py` and the PDF (`build/pdf.py`, `build/cover-art.py`) still render with the old amber and Plex Sans Condensed; both are outside this build's files. The print stylesheet's tokens are switched, so a rerun of `build/pdf.py` would pick up garnet, but the cover and the cards need their own pass.
- During this build the working tree was briefly reverted and restored by another process (every edited file was re-touched at 00:13:21 with its content intact, and three captures shot in that window showed the old build). The captures were retaken; the report is written from the restored tree. Whoever ran a stash or checkout in the parallel session should know it reaches `dist/` too.
