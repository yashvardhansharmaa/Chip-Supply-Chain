# Redesign, stage 3: AI Chips (option C, "The timeline")

Branch `redesign-chips`, made from `redesign`. Built to `qa/redesign/BRIEF.md` (main checkout), the option the owner chose (`MAIN/qa/design4/ai-chips/C-timeline.html`, its `notes.md` and shots) and the lead's instructions for this page. The Glossary is being built in another checkout at the same time, so every change stays in the AI Chips view's own code (listed at the end of the next section).

## What was built

### The view, `#/landscape`

1. **The head.** "AI Chips" in Fraunces 350 on the left. On the right, the standfirst, verbatim, and a mono line under it: "38 chips · 13 makers · Updated 21 October 2026". The counts come from the data at build time (`{{AIC_FACTS}}`, filled by `build/modules/reference-pages.js`). The day is `/chips/`'s own page date (`{{CITE_DAY:chips}}`).
2. **The chart.** Every chip sits at the month it was announced, against the measure the reader picks: Speed at FP16, FP8 or FP4, Memory, Bandwidth or Power (pills, one pressed, in black).
   - Over it: the count of chips with a figure ("30 of 38 chips have a published figure"), a Fraunces heading ("Speed at FP16, by the year each chip was announced") and the finding, computed from the data ("The Instinct MI455X is the highest, at 5,033 TFLOPS. Choose a dot to add its chip to the comparison.").
   - Rule B: the largest value is the one solid ink dot, with a bold label. Every other dot takes the light tint `--ctx`. A chip dated only to a year sits mid-year, on a line across it.
   - When one chip is more than four times the next (the WSE-3 Turbo's bandwidth), the scale follows the others. That dot sits over the top with an ink arrow, and the finding says so.
   - The reader's picks are ringed in red wine and labelled with their number. That is the only wine on the chart.
   - Labels are placed by their measured width, clear of every dot and label. Under 560 px of chart, only the picks and the largest are named.
   - Under the chart: the chips with no figure for the measure, split into "Not published at FP16" and "Not supported at FP16", as pills that pick them. Then the note on how to read it.
   - Keyboard: the dots hold one Tab stop. The arrow keys walk them by date, Home and End jump to the ends, and Enter or Space adds or removes the chip. A dot's card (name; maker, country and year; the figure; what a press does) shows on hover and on focus.
3. **The specimen beside the chart.** The site's live point cloud is hosted in the aside (`.aic-spec-draw`) with `Stage.host`, as The Chain hosts it in a chapter's slot. Its label ("AI chips · B200"), the pause button and the caption stand under it, on the drawing's foot (`--slack`).
   - The stage beside the page stands down on this view, and leaving the view hands the canvas back. Drag and the arrow keys still turn it.
   - It shows the last chip chosen, or the generic package when none is.
   - Under 900 px the drawing stays in the phone's strip, with Top, Contents and Expand.
   - The caption reads "on two silicon interposers" where it read "on Two silicon interposers".
4. **The picks.**
   - The guidance line in Fraunces ("Choose two chips to compare. Add up to four.", read out on each change) and Clear.
   - A row of two to four picks. A filled pick shows its number and "Chip 1", the chip's name (a button that puts it on the stage, underlined in wine while it is there), maker · country · year, Change and Remove. An empty pick is one button, "Choose a chip, or a dot above" or "Add a third chip (optional)". The pick waiting for a chip is drawn in wine, the reader's place.
   - Under it: the five pairs before any pick, then Try with while one chip waits for a second.
   - "Browse all 38 chips by maker" folds the list: the countries as plain mono labels (China last, as today), one row per maker, each chip a pill. A fifth chip is refused in words.
   - The picker is unchanged: the combobox with its filter, arrow keys, Enter and Escape, "In chip 1", and a sheet on the phone.
5. **The comparison.** "B200 and Ascend 910C, side by side" in Fraunces 350 ("Two chips, side by side" until two are in), then the note on TFLOPS, which now ends "Each figure carries the number of its source in the chip's list under Notes and sources."
   - **Packages at one scale.** The key and the scale bar sit on the section's rule, then today's sentence on dies, stacks, interposer and substrate. Each package is drawn at one scale over a hairline, all drawings standing on one line, with its number, name and maker, its size, and "On the stage" in wine under the one on the stage. Memory stacks are gray now. They were wine, against the accent rule.
   - **Figures.** Each of the eight figures (speed at FP16, FP8 and FP4, memory, bandwidth, power, transistors, logic dies) is its own row of bars, in two columns on a wide screen. Rule B holds in each row: the largest is solid ink with its value bold, the rest take the tint. "Not published" and "not supported" stay apart, and the speed rows carry their notes' marks. Until two chips are in, hatched rows wait for each one missing.
   - **In words.** The eleven descriptive rows form a table with one column per chip. Each head carries the number, name and maker, ×, Change and Read the notes. The column on the stage has a wine rule under its head and the paper tint. On a phone the table stacks the chips two to a line, so nothing scrolls sideways.
   - **A source on every figure.** Each value and each cell carries the number of its source in the chip's list, as the site's citation mark: hover or focus shows the source card, and a click opens the source. Where the chip's list names no source for that row, the mark reads "all" and goes to the chip's notes. Sources are picked as `/chips/` picks them, by the row's words against the source labels.
   - Then the speed notes ("How the speed figures are measured"), "Copy the comparison · Table · JSON", and **Notes and sources**: each chip's notes in a fold (the chip on the stage open), with its sources numbered as the marks cite them.
6. **The bar that follows the reader** once the picks scroll away: each chip with ×, + Add and Clear, full width under the masthead.

### `/chips/`

- The table and the source lists are as before, with the per-chip anchors the Glossary links to (`#nvidia-b200`, `#nvidia-b200-sources`, `#nvidia-b200-s1`).
- Above them stands the view's FP16 chart: its heading, "30 of 38 chips have a published figure", the finding, the dots (the highest solid ink, the rest the tint), the chips with no figure, and the same note. Each dot and each name with no figure links to its chip's row.
- The chart's marks are HTML set by percent over a grid drawn to fit, so the labels keep their size at every width. An SVG scaled to a phone would have shrunk them under 11 px. The build places the labels clear of one another at the narrowest width of each band (wide and medium), and a phone names only the highest.
- Its styles travel with the page (`CHIPS_CSS` in the chips part of `reference-pages.js`), so `build/assets/reference-page.css` is untouched.
- The page keeps 21 October 2026 as its day, since the chart draws the same figures. `build/page-dates.json` keeps the new content hash with the old day, as stage 1 did for the summary.

### Where the changes are

- `src/template.html`: the `landscape` section only.
- `src/app.js`: `Landscape` only. The picker's placement now measures the pick it opens from.
- `src/modules/chips.css`: rewritten.
- `build/modules/reference-pages.js`: the chips page (its chart and its CSS); the TFLOPS note, now read from the new markup; a page's own CSS slot in `page()`; and `{{AIC_FACTS}}` for the view.
- `build/page-dates.json` and `dist/`: rebuilt.
- Not touched: `src/styles.css`, `src/preroute.js` (the view's new ids start with `cx-`, which it already routes to AI Chips), `src/kit.js`, `build/build.js`, `content/`, `data/`.
- New QA scripts: `qa/redesign/interact-chips.js`, `census-chips.js`, `sweep-chips.js` and `shots-stage-3-chips.sh`.

## QA gates

RESULTS

## Census differences

`qa/redesign/census-chips.js` reads the visible text of the view and of `/chips/` on MAIN's build (8765, the live design) and on this checkout's (8768), in four states: nothing picked; B200 and Ascend 910C; four chips (B200, Ascend 910C, Instinct MI355X, WSE-3 Turbo) with every fold open; and `/chips/`. The same script call picks the chips on both sides. The source numbers this redesign puts on each figure are read out of its side, since MAIN kept those sources in hover titles. The notes keep their marks on both sides. Output: `qa/redesign/census-chips.txt`.

**No text is lost.** Every line only in MAIN is one of these:

1. **"Choose a chip"** (an empty pick) now reads "Choose a chip, or a dot above", as in the mockup.
2. **"Specs side by side"** becomes the comparison's title, "Two chips, side by side" or "B200 and Ascend 910C, side by side", with "Figures" and "In words" as its sections.
3. **The figure rows of the table** ("Logic dies", "Transistors, billion", "Memory, gigabytes", "Bandwidth, terabytes/s", "Speed at FP16, TFLOPS" and so on) are now each a row of bars headed by the short name and its unit: "Speed at FP16 TFLOPS", "Memory gigabytes", "Bandwidth terabytes a second", "Power watts", "Transistors billion", "Logic dies count". The only word that changes is "terabytes/s", now "terabytes a second". The table's lines that ran a row's label and its values together ("SPEED AT FP16, TFLOPS 2,2501", "not supported 5,0333") now read one chip to a line, with the same values.
4. **"Change" and "×" on the package cards.** C draws the packages without them. Change, × and Read the notes stay on every column head of the table of words, Change and Remove on every pick, and × on the bar that follows the reader. The bare name lines ("B200", "Ascend 910C") count as changed because the package cards and the table heads now carry the chip's number ("1 B200").
5. **The note on TFLOPS** is now one paragraph with "Each figure carries the number of its source in the chip's list under Notes and sources."
6. **The notes' sources** were one run-together line of links. They are now a numbered list, one source a line. The census's "lost words" such as "pagenvidia" are those run-together joins.
7. **Letter case:** MAIN set its labels in capitals with CSS. The redesign shows them as written, from stage 1 on. 23, 42 and 65 lines in the three states differ only in case.

`/chips/`: no line is lost. "38 chips · 13 makers · Updated 21 October 2026" and the table head differ only in case. Added: the chart's section.

**Added in the view:** the meta line ("38 chips", "13 makers", "Updated 21 October 2026"); the chart's count, heading, finding, axes, labels, measures, "Not published at FP16" and "Not supported at FP16", and its note; the specimen's label and caption beside the chart (they were in the stage beside the page); "Choose a chip, or a dot above"; "Figures", "In each row, the largest figure has the solid bar", "In words"; the units "count" and "terabytes a second"; the chips' numbers; the source numbers on each figure ("1", "2", "all"); and the sentence on sources. Every added line passes the writing rules of `check-speak.js`, checked line by line by the census: no hits.

## Known issues and decisions for the lead

- **Change and × on the package cards** are gone, as in C (census item 4). Change, × and Read the notes stay on the table's column heads, a little lower on the page. Say if the package cards should carry them again.
- **The head follows C**: a 66 px title beside the standfirst, so the chart reaches the first screen. Suppliers and Export Controls open with the larger head (`.view-head.vh`, up to 120 px, counts beside it). If the lead wants one head across the views, AI Chips can take `.vh`, with its counts in the count column.
- **The specimen** is the live drawing seen from above (`plan: true`, as today). The mockup showed a still turned 2.2 s from its opening tilt. The live one turns, and drag and the arrow keys turn it.
- **Between 900 and about 1,000 px** the chart beside the specimen is under 560 px wide, so it names only the picks and the largest, as a phone does. Every dot keeps its card on hover and focus.
- **"all" marks:** a chip's sources are not tagged by field, so a cell whose row has no matching source label points to the chip's whole list. This is how `/chips/` cites them, and how today's hover titles read ("Sources for the B200: ...").
- **The folded list** keeps today's order, with China last. Countries are plain mono labels and nothing on the page colors a country.
- **Shared code touched:** `page()` in `build/modules/reference-pages.js` gained a CSS slot for one page (`o.css`). Nothing else outside the view's own code changed.
- **On merge with the Glossary branch:** `dist/` and `build/page-dates.json` (the home page's hash) will conflict. Rebuild after merging. `src/template.html`, `src/app.js` and `reference-pages.js` change in separate places.

## Shot list

In `qa/redesign/shots/stage-3-chips/` (not committed; remake with `sh qa/redesign/shots-stage-3-chips.sh`), from 127.0.0.1:8768 with the faces loaded and 1.5 s after any scroll or press. Each is at 1440 and 390:

- `chips-empty`: the page as it opens.
- `chips-pair`, `chips-pair-full`: B200 and Ascend 910C, the first screen and the whole page.
- `chips-chart`: the chart with the two picks ringed.
- `chips-bandwidth`: the bandwidth chart, with the wafer-scale chip over the scale.
- `chips-picks`, `chips-picker`: the picks, and the picker open on chip 3.
- `chips-packages`, `chips-figures`, `chips-words`, `chips-notes`: the comparison's parts.
- `chips-four-words`: four chips in the table of words.
- `ref-chips`, `ref-chips-chart`: `/chips/` and its chart.

Also `chips-pair-1440-dark`, `chips-figures-1440-dark`, `chips-pair-390-dark`, `ref-chips-chart-1440-dark`, `chips-pair-1024`, `chips-pair-768`, `chips-pair-320`, `ref-chips-chart-768` and `ref-chips-chart-320`.

Compared with the mockup's shots (`MAIN/qa/design4/ai-chips/shots/C-timeline-*.png`), the page matches C's order, type and marks at 1440 and 390. The differences:

- the live specimen in place of the still;
- the dies sentence kept under "Packages at one scale";
- the key's labels in sentence case, as stage 2 set them;
- source marks in the site's citation style.
