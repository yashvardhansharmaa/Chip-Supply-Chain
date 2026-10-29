# Redesign: the three approved data figures and the Suppliers ribbons by share (29 October 2026)

Branch `redesign-figs`, from `25d8080`, built to `MAIN/qa/excellence/BUILD-BRIEF-2.md` ("figures") and the mockups in `WT/dist/mock/figures/` with their notes (`MAIN/qa/excellence/mocks/figures/notes.md`, sections 2, 5 and 7). Commits `7c69dc7` to the last one on the branch. Nothing is pushed or merged.

## What was built

### Figure 16.2, China's memory in Ascend packages (chapter 16, China's response)

- Placed straight after the paragraph "SemiAnalysis judged that memory would limit…", as in the mockup.
- Three bars on one scale, in Ascend packages: about 805,000 expected 2025 shipments; 1.6 million from the 13 million stacks China procured; 250,000 to 300,000 from CXMT's 2026 stacks, drawn as a range and marked wine (the value the finding names).
- **Row 04 is gone**, with its step and its sentence. Nothing on the page mentions SMIC's logic wafers in packages.
- Three steps (Shipped in 2025, Memory in stock, CXMT in 2026), each with the chapter's own sentence under the bars. The figure plays once when most of it is on screen, and a step button stops the play and goes to its step.
- Every number is the chapter's and its source's [48], SemiAnalysis, 8 September 2025. "1.6 million" is printed as the source words it, with 1,600,000 as the bar's length and the CSV's value.
- One change from the mockup's words: the last step's sentence opens "SemiAnalysis expected CXMT…" where it read "It expected…". It is now the sentence the figure shows at rest, so "It" had nothing to refer to.

### Figure 13.2, scale-up against scale-out (chapter 13, end of How it works)

- Placed after "Scale-up bandwidth limits how efficiently a large model trains…". **Today's 13.2 (NVLink by generation) and 13.3 (Tomahawk switching) leave the chapter.** Their numbers stay in the text, which cites the same sources.
- The NVL72 racks drawn as in the mockup (as explainer 13.1 draws them), with one GPU's two links to scale: scale-up 9 units, scale-out 1 unit, the dots nine times as dense on the scale-up link. Four steps; step 4 sets a block of layers over each rack. Two racks on a phone, three on a wide screen, with no count.
- The bars give 7,200 Gb/s (900 GB/s each way) and 800 Gb/s from SemiAnalysis, January 2026 [20]. The source line also names the NVL72 hardware page [17] and the NeMo parallelisms guide [21]. The note says the links are to scale and the racks are not.
- One change from the mockup's words: step 3's sentence ends "SemiAnalysis calculated in January 2026", as the chapter's sentence does, so the ratio is dated on the figure.

### Chips built just under the line (Export Controls, first section)

- First in "What the rules did", above Coming up. Coming up now has a fixed place after it in the template, so it no longer needs the mockup's watcher to stay second.
- 17 chips whose records state a TPP, a month ruler from October 2022 to October 2026, and five rule buttons. The vertical scale is chip-to-chip bandwidth under the 2022 rule (and after its deletion), and memory bandwidth from December 2024, as in the mockup. Hover, focus or tap a dot for its record beside the chart (under it below 1,100 px). "Its record on AI Chips" opens that chip.
- **No chip that is left off is named**, and there is no line about missing chips. The mockup's "Left off" note was chrome and is not built.
- The density test keeps its one short sentence in the October 2023 rule's caption: "The density test divides TPP by die area, so it has no line here."
- Every printed value is checked at build time: each TPP, chip-to-chip rate and note must appear in the chip's record in `data/landscape.json`, and each line's value in `data/control-thresholds.json`. A record that no longer says what the chart prints stops the build, naming the chip and the words.
- Added beyond the mockup, as the brief asks of every figure: Cite (the figure's title, the page's address and its data) and PNG. The mockup had only Table and CSV.

### Where the code is

- `build/figsteps.js` (new): a bars figure's `steps`, `draw`, `shown` and extra `sources`, for figure().
- `build/build.js`: six lines in figure() call it (the bars branch, the source line and the figure's class). `tableFallback` is untouched, since `redesign-quickwins` changes that line.
- `src/modules/figsteps.js` and `.css` (new): the stepping, the rack drawing, reduced motion and the rest state for print.
- `build/modules/under-line.js` (new): the controls section, its data, Table, CSV, citation and the build-time checks.
- `src/modules/underline.js` and `.css` (new): the chart, the ruler, the chosen chip, Table and PNG.
- `src/template.html`: the `{{UNDER_LINE}}` placeholder and Coming up's host, in the controls view only.
- `build/retired-chapters.js`: the retired 13.2 and 13.3 anchors, and their citation anchors, forward to the new 13.2 (checked: all three old addresses land on it).
- `content/13-systems-and-networking.md`, `content/16-geopolitics.md`: the figures and their markers.
- `qa/redesign/check-figs.js`: see Checks.

## Renumbering and references

| Chapter | Before | After |
|---|---|---|
| 16 | 16.1 control timeline, 16.2 China tool revenue, 16.3 CHIPS awards | 16.1 control timeline, **16.2 Ascend memory (new)**, 16.3 China tool revenue, 16.4 CHIPS awards |
| 13 | 13.1 racks explainer, 13.2 NVLink bandwidth, 13.3 Tomahawk switching | 13.1 racks explainer, **13.2 scale-up against scale-out** |

- Numbers, rail entries, cite boxes, CSV and PNG names all come from figure(), so they renumbered with the build. The rail shows 16.1 to 16.4 and 13.1 to 13.2.
- No text refers to a figure in chapter 13 or 16 by number: a search of `content/`, `data/`, `build/`, `src/` and the QA scripts found none. So no link needed rewriting.
- Figure ids are unchanged for every kept figure, so links to them still work.

## Checks (final build)

Run on the build at `83b03f6`, preview http://127.0.0.1:8788/. Every check passes.

| Check | Result |
|---|---|
| `node build/build.js` | builds, no warnings |
| `check-speak` | no matches |
| `check-integrity` | no problems (18 pages, 1,812 ids, 16 chapters) |
| `check-sources` | 2,849 citations, all tier A or B |
| `check-size` | 1,010 files, none over 5 MB |
| `check-seo` | 16 chapter pages, 22 sitemap entries, no problems (its one standing note on `/supply-chain/`'s title length) |
| `check-links --local http://127.0.0.1:8788` | 28 pages, 1,224 addresses, no broken links |
| `smoke.js --port 8794` | 47 page loads, no failures |
| `check-perchapter.js` | 337 of 337 |
| `interact-chapter.js` | all pass. An earlier run under load failed one phone check, the strip's reading rule on Lithography. The untouched base preview at 8766 failed the same check in the same run, so the failure came from timing under load. |
| `stage-chapters.js --base` | 10 of 10 |
| `check-cites.js` | 3,324 marks, 0 problems |
| `check-figs.js` | 112 of 112 (see below) |
| `interact-chips.js --base` | 93 of 93 |
| `datacheck-chips.js --base` | 1,384 values at 1440 and 390, 0 mismatches |
| `interact-glossary.js` | 90 of 90 |
| `interact-suppliers.js` | 65 of 65 |
| `interact-masthead.js` | all pass |

**`check-figs.js`, changed:** its figure list replaces `nvlink-bandwidth` and `switch-bandwidth`, which left the site, with `scale-up-out` (13.2) and `ascend-memory` (16.2). It still checks 14 figures with 8 checks each, so the expected total stays 112. It now reads a row the source words (16.2's "1.6 million") in those words beside its bar and in the Table, and by its number in the CSV.

**Checks of my own, run on the same build** (scripts in the scratch folder; not added to `qa/`):
- **Phone at 390 and 320, light and dark, all three figures:** no sideways scroll, and no visible text under 11.5 px, SVG text measured at its drawn size. At 320 the chips chart's gutter key ran past the edge, so it now wraps to two lines below 380 px.
- **Motion:**
  - Under reduced motion, both stepped figures stay at rest on their last step, with no moving dots.
  - With motion, they rest until seen, play from step 1 when on screen and move to step 2 after the step's time.
  - A step button stops the play on its step.
  - `beforeprint`, and the `cp-print` mark that `pdf.py` sets, return a playing figure to rest.
- **Table, CSV, PNG and Cite on all three:**
  - Table hides the steps, the sentence and the drawing.
  - The CSV carries the figure, title, source, date and address.
  - Each PNG is 1,600 px wide. The chips chart's PNG is drawn in the light theme even from dark mode.
  - Cite gives the figure's number and title, the page's day, its address and its data.
- **Dark mode:** shots of all three read correctly.
- **Old addresses:** `/systems-and-networking/#fig-systems-and-networking-nvlink-bandwidth`, `/#fig-systems-and-networking-switch-bandwidth` and a retired citation anchor all land on the new 13.2.

**PDFs, printed on DevTools port 9368 to a scratch folder:**
- `systems-and-networking`: 12 pages. Figure 13.2 prints on page 5 as a still: its number, title, the drawing at its last step, the bars, the last sentence, the source line with [20], [17] and [21], and the note. There is no step row.
- `geopolitics`: 16 pages. Figure 16.2 prints on page 9 as a still: its number, title, all three bars, the sentence, and the source with [48]. 16.3 follows on the same page.
- Fonts in both: Fraunces, Source Serif 4, Hanken Grotesk and Fragment Mono, all embedded.
- Export Controls has no PDF. The view was printed through Chrome's own print. The chart prints as it stands, with its date line, the rule's sentence and its source. The buttons, ruler and actions are left off.

## The Suppliers ribbons by share (added on the coordinator's request, 29 October)

The owner approved the third round of mockup 6 after the three figures were done. It replaces the Suppliers ribbons in place, on the same branch, built to `MAIN/qa/excellence/mocks/figures/notes.md` section 6, `critique-suppliers.md` and the mockup's code in `WT/dist/mock/figures/suppliers-share.*`. Commits `9fa29b9` and `9533ab6`.

### What it does, as the mockup does
- **The drawing.** Each ribbon narrows to a point at its country. The countries are evenly spaced, in the order with the fewest crossings, each crossing weighted by the two shares (the mockup's exact search). A ribbon's width is the country's share where it meets one of the matrix's 20 segments.
- **Slices and firms.** Each segment's slices are stacked largest first, with Other EU and Other last.
  - Up to three firms sit under each segment, in their country's share order.
  - Ties are broken by a share the supplier list states for the firm, then Critical first, then the list's own order.
  - Lam Research comes before Tokyo Electron in etch.
- **Year and measure.** A mark follows the name only where a row is not 2025 revenue, such as "· 2023" or "· capacity, 2022". The key has one line: "Shares are of 2025 revenue unless marked".
- **Shares on the drawing.**
  - Following a country prints its share in wine at every segment it reaches, turns its firms to ink and bolds its shares in the Table.
  - Hovering or focusing a segment prints each country's share beside its point.
- **Keyboard and screen readers.**
  - The follow buttons come before the 20 segment stops.
  - Each segment's label gives every share, its first three firms, its year, measure and source.
  - Left and Right step through a segment's countries, each with its tip. Up and Down move between segments.
  - Escape, or a tap elsewhere, closes a tip.
- **Segments with no split** (advanced packaging, IC substrates, server assembly) show their name and firms only, with no hatching and no note.
- **Below 600 px:** one share strip per segment, each slice labeled inside where the label fits, the rest on the line under it, then the firms. **"UK" replaces "GB"** on the strips, as asked.
- **Table, CSV and Cite** sit at the end of the source line. The mockup had Table only.
  - The CSV has one row per segment and one column per country, each share as the matrix writes it.
  - Then come the measure, year, basis, source, its address and the first three firms.
- **Dark mode** uses the site's ribbon tokens.
- **Print** shows the drawing as it stands, scaled to the page, with no tip and no actions.
- **The route's chosen country** follows its column, where it has one (Japan does, France does not), as the old ribbons did.

### The EU-27 toggle: removed
An EU-27 column would have to draw sums of the members' shares (the Netherlands, Germany and Other EU), so the toggle is gone, as the mockup's notes already said.

The Glossary's EU-27 cards link to `#/suppliers?group=eu`. That address now filters the firm list to the EU-27 members and lands on it, so "See them together on the Suppliers page" still holds.

### How it is built
- **`build/modules/supplier-shares.js` (new)** writes the section and its data from `data/chokepoint-matrix.json`, `data/suppliers.json`, `data/bibliography.json` and the chapters. It ports `build-data.py`'s rules and the firm table from notes.md section 6.
  - Every share is read a second time as text, so 6.0 stays 6.0.
  - The build stops if a share's text differs from its number, if a firm's basis phrase is not in the text it cites, or if a stated firm share is not in its entry.
  - Its data matches the mockup's `suppliers-share-data.js` row for row, every share, order, firm and column included.
- **`src/modules/supshares.js` and `.css` (new)** draw it. They are the mockup's code with the site's names, plus Cite, CSV and the route link.
- **`src/app.js`:** the old drawing leaves the Suppliers object (about 290 lines): the count ribbons, their tips, the EU-27 grouping, and the segment link that filtered the firm list. Nothing outside the Suppliers object changed.
- **`src/template.html`:** the old section becomes `{{SUPPLIER_SHARES}}`.
- **`src/modules/suppliers.css`:** the old ribbons' dead rules leave it, and the tip's measure line goes from 11 to 11.5 px.
- **`src/modules/lookup.js`:** one comment.

### Checks for the port
- **`qa/redesign/check-shares.js` (new, ported from the mockup's).**
  - It reads the matrix as raw text and opens `#/suppliers` at 1440 and at 390.
  - It reads back every share printed in eight places: the Table, the aria-labels, the left-hand shares on hover, every ribbon's tip, the shares for each followed country, the phone strips (UK for GB), the line under each strip and the phone's reader line.
  - It fails if any printed share differs from the matrix as written, or if a place that should carry every share misses one.
  - **Result: 83 shares in 17 segments, 452 printed values, every one matches.**
- **`interact-suppliers.js`: updated where it tested the old count-based ribbons, now 55 checks (was 65).**
  - "Critical ribbons are red wine" and "every other ribbon is gray" are now one check: at rest every ribbon is gray. On a phone it reads the strip slices.
  - The ribbon note on headquarters is now the new note on where a firm counts.
  - Following Japan used to turn its ribbons dark gray with Critical in wine. Now its ribbons turn wine, the others fade, and its share is printed at each of its segments. On a phone its slices turn wine and the others stay gray.
  - The four EU-27 switch checks are now one: there is no switch.
  - "A segment filters the list" and "All segments" are now: a segment opens its tip, with year and source, and Escape closes it. On a phone, EUV lithography's row names it and ASML.
  - The Glossary's EU-27 address now lists the EU-27 members' firms and lands on them. It drew the EU as one column before.
  - The ribbon count is now exact: 83 ribbons wide, 17 strips under 20 names on a phone.
- **My own probe:**
  - Tab order, keyboard steps and Escape.
  - Following the Netherlands prints its five shares, inks ASML and ASM International, and bolds only its shares in the Table.
  - Table, Cite and CSV.
  - The route's Japan follows Japan, and France follows nothing.
  - No sideways scroll and no text under 11.5 px at 320, 390, 768 and 1440, light and dark.
  - Shots of the drawing, dark mode with a country followed and a segment hovered, and the phone strips all match the mockup's third-round shots.
  - Chrome's print of the view shows the drawing as a still.

### The full check list again, after the port (build at `9533ab6`)
All 19 checks pass:
- the build;
- the five static checks;
- `check-links --local`, with no broken links;
- smoke, 47 loads;
- `check-perchapter`, 337 of 337;
- `interact-chapter`, all;
- `stage-chapters`, 10 of 10;
- `check-cites`, 3,324 marks;
- `check-figs`, 112 of 112;
- `interact-chips`, 93 of 93;
- `datacheck-chips`, 1,384 values;
- `interact-glossary`, 90 of 90;
- `interact-suppliers`, 55 of 55;
- `interact-masthead`, all;
- `check-shares`, 452 values.

`check-integrity` counts 1,809 ids, where it counted 1,812 before. The old ribbon section's ids left, and the new section's took their place.

## What I did not do

- **The PDFs in `dist/pdf/` are not reprinted.** Chapters 13 and 16 were printed on DevTools port 9368 to a scratch folder to check them, and the book was not. `geopolitics.pdf` and `systems-and-networking.pdf` (and the book) still show the old figures until they are reprinted after the merge. Chapter 13 grows from 11 to 12 pages, and chapter 16 stays at 16.
- **The PNG of 13.2** draws its bars, title and source, without the racks, as the mockup's did through the site's runtime. Drawing the racks into the PNG would mean changing `FIG_JS` in `build/build.js`.
- **`/export-controls/`**, the static reference page, does not carry the new chart. The brief placed it on the interactive page only.
- The Export Controls chart has no figure number, since that page numbers none.
- **Suppliers:** the ribbons by share have no PDF, since the Suppliers page has none. Its static page `/suppliers/` does not carry the shares, which the brief did not ask for.
