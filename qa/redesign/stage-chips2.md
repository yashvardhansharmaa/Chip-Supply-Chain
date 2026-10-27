# Redesign: AI Chips, the tick list (design round five, option B)

Branch `redesign-chips2`, from `efac818`. Built to the design the owner chose on 27 October 2026 (`MAIN/qa/design5/ai-chips/a/B-tick-list.html`, its `notes.md` and `shots/B-*`), the review (`MAIN/qa/design5/ai-chips/review/review.md`) and the shared brief (`MAIN/qa/design5/BRIEF.md`).

The first builder made commits `49d99bc` to `5d3455e` and stopped before its final checks. This pass ran every check on the final build, fixed what the checks and the shots found (`01a6787` to `94c15bd`), and wrote this report.

## What was built

### The view, `#/landscape`

1. **The head** is unchanged: the title, the standfirst, and "38 chips · 13 makers · Updated 27 October 2026".
2. **The list beside the chart** ("Tick to compare") holds all 38 chips by maker, each with its country, its year and a box.
   - A ticked box turns wine and shows the chip's number, 1 to 4. The chart's ring and the comparison's row carry the same number.
   - A chip keeps its number while it stays in. Untick chip 2 and tick another, and the new chip becomes chip 2.
   - The head counts the ticks ("2 of 4 ticked"). At four, the other boxes are disabled and the list says why.
   - Find narrows the list. Enter takes the exact name, else the first match.
   - "Clear the ticks" sits at the list's foot.
   - The list stays in view while the page scrolls and scrolls on its own. At 1440 by 900 it shows 15 chips.
   - The live specimen sits at the list's foot (`Stage.host`), with its label, pause button and caption.
3. **The chart** keeps the timeline the owner chose: six measures, rule B, the chips with no figure as pills, the note and the keyboard.
   - "By year" and "Highest first" switch the view. Highest first is one line per chip, each figure with its source mark.
   - A click, a tap, Enter or Space on a dot opens the chip's card. Nothing on the chart ticks a chip.
   - The card gives the figure, the foundry and node, the memory supplier, the package and who assembled it. Each carries its source mark, and an empty field reads "not published". Its one control is a box, "Compare the H100".
   - Each dot owns the part of the chart nearer to it than to any other dot. Two dots on one pixel are set 3 px apart. A tap where dots crowd opens a short list of the chips there.
   - Ticked chips are ringed in wine and labeled with their number. A ticked chip's label keeps clear of every ring and label. Where its four sides are taken, it tries the diagonals, then a spot further out tied to the dot by a hairline (this pass).
4. **The address** holds the ticks, the measure and the view (`#/landscape?pick=nvidia-b300,amd-mi355x&measure=bw&view=rank`). Ticks are written in place, so Back and Forward move between pages and each page keeps its ticks. A reload or a shared link opens on them. The copy line has Link.
5. **The comparison**:
   - Its heading names the chips. The five suggested pairs show before any tick, and Try with shows while one chip is ticked.
   - **Figures** is one table, one row per chip, read down a column: speed at FP16, FP8 and FP4, memory, bandwidth, power, transistors, logic dies and the area of each die. The unit sits in each column head. Rule B holds in each column, and every figure equal to the largest is bold.
   - Each speed figure carries its chip's note letter, a to d, and the lettered notes stand under the table. A figure no ticked chip has is said once, in a sentence.
   - **Makers and parts** is a second table: foundry and node, package and assembler, memory type and stacks, and memory supplier, each supplier with the source that names it.
   - Then come **Packages at one scale**, **In words** (seven attributes, one line per chip), the copy line (Table, JSON, Link) and **Notes and sources**.
6. **On a phone** the specimen stays in the strip. The list opens as a sheet behind "Tick chips to compare". A tray under the masthead shows the ticked chips with Change. Once two are ticked, the sheet's only way out is "Show the comparison".
7. **Search** and the look-up card's "On AI Chips" link open the chip's card on the chart and tick nothing.

### `/chips/`

- The table, the source lists and the per-chip anchors the Glossary links to are kept.
- Every figure prints as published: the A100's bandwidth reads 2.039, where it read 2.04.
- The column is "Memory supplier", with a mark for each supplier that a source names.
- A missing assembler reads "assembler not published", and a missing foundry reads "foundry not published" over the node.
- The page date is 27 October 2026 (`build/page-dates.json`), since its figures changed.

### Where the changes are

- `src/app.js`: `Landscape`, plus search's chip hit (it opens the card) and the removal of the old comparison's export bar.
- `src/template.html`: the `landscape` section only.
- `src/modules/chips.css`: rewritten.
- `src/modules/lookup.js`: the "On AI Chips" link opens the card.
- `build/modules/reference-pages.js`: the chips page.
- `build/page-dates.json` and `dist/`: rebuilt.
- `qa/scripts/smoke.js` waits for the list's 38 boxes and the chart's dots.
- QA scripts in `qa/redesign/`: `interact-chips.js`, `datacheck-chips.js` (with `datacheck-chips.json`), `census-chips.js`, `sweep-chips.js`, `labels-chips.js` and `shots-stage-chips2.sh`, each with its output beside it.
- Not touched: `src/modules/chapter.css`, the chapter parts of `build/build.js` and `src/app.js`, the font faces, `content/` and `data/`.

## Fixed in this pass

1. **Labels on the chart** (`01a6787`, `f5a2c60`). At Bandwidth with four chips, the B300's and Instinct MI355X's labels ran together ("1B3002 Instinct MI355X"). On a phone, a ticked chip's label sat on a neighbor's ring. The causes:
   - a ring was treated as a 7 px dot;
   - a chip's number was measured in the interface face, though it is set in the code face;
   - when the four sides of a dot were taken, the label fell back to its right side whatever it covered.
   Now a ticked chip, an open card or the largest keeps clear of rings at their full size, with a 2 px margin round labels. It tries the diagonals, then spots further out on a hairline leader, and passes over a spot nearer another named dot than its own. A plain label keeps the box it had, so the chart as it opens names the same 27 chips as before, and the census matches.
2. **Search on a phone** (`520e6bd`). From another page, search's chip hit opened the card while the strip was still growing to its full height (89 to 128 px). The card's box, which has focus, sat 45 px under the strip. The card now checks again once the strip settles. `interact-chips.js` gains this task at 390.
3. **`qa/redesign/labels-chips.js`** (`94c15bd`), a new check. The layout sweep compares text with text only, so a label on a ring passed it.
4. **`shots-stage-chips2.sh`** adds the four chips at Bandwidth at 1440 and 390.

## Checks, on the final build

| Check | Result |
| --- | --- |
| `node build/build.js` | Passes, no warnings. |
| `check-speak.js` | No matches. |
| `check-integrity.js` | No problems. One warning, in chapter 06's card text ("a figure with no year"), comes from `content/`, which this branch does not touch. |
| `check-sources.js` | 2,857 citations, all tier A or B. |
| `check-size.js` | 843 files outside `dist/` and `media/`, none over 5 MB. |
| `smoke.js --port 9371` | 36 page loads, no failures. |
| `interact-chips.js` | 58 of 58 checks pass (57 before this pass, plus search on a phone). Click counts are below. |
| `datacheck-chips.js` | 4,976 values, 0 problems: list 76, speed notes 86, figures 1,144, figures said once 90, numbers 38, parts 290, packages 38, words 534, chart 182, card 1,069, highest first 638, `/chips/` 791. |
| `census-chips.js` | No text lost. The output is identical to the committed `census-chips.txt`. The differences are listed below. |
| `sweep-chips.js --tabs 60` | 96 loads, 0 findings: seven states and `/chips/`, at 320, 390, 768, 1024, 1280 and 1440, light and dark. No sideways scroll, no text under 11 px, no clipped or overlapping text, and a focus mark on every Tab stop. The output is identical to the committed `sweep-chips.txt`. |
| `labels-chips.js` | 360 charts. 29 labels touch a mark or a label, 10 of them by more than 2 px: 0 at 1024, 1 at 1440 (0.6 px, with the TPU v7's card open over it), 15 at 390 and 13 at 320. Before the fix, a looser count of the same charts found 1,287. |
| Look | Shots at 1440 light and dark and at 390, compared with the mockup's `B-*` shots (below). |

### Tasks, with clicks (`interact-chips.js`)

| Width | Task | Clicks or taps |
| --- | --- | --- |
| 1440 | Compare the H100 with the H20 by two ticks | 2 |
| 1440 | The same by its suggested pair | 1 |
| 1440 | The same by Find, typing and Enter twice | 1 |
| 1440 | Compare the B300, Instinct MI355X, Rubin and Instinct MI455X | 4 |
| 1440 | Remove Rubin (the others keep 1, 2 and 4) | 1 |
| 1440 | Swap the Instinct MI355X for the H100 (the H100 takes number 2) | 2 |
| 1440 | Open a shared address, reload | 0, 0 |
| 1440 | Back and Forward (a click on Suppliers, then the browser) | 1 |
| 1440 | Find who leads on memory | 1 |
| 1440 | Find who makes the Ascend 910C's HBM and who packages it | 1 |
| 1440 | Explore the chart: 30 hovers, 5 dot clicks, 6 arrow steps with Enter, Escape and Space, every measure, a pill, both views | 15, and 0 ticked |
| 1440 | Search "910C" and land on its card, the ticks kept | 2 |
| 1440 | Every dot at all six measures by a click at its center | 158 dots: 140 open the card at once, 18 through the short list. All 38 chips reached, 0 ticked |
| 390 | The same by a tap | 158 dots: 91 at once, 67 through the short list. All 38 reached, 0 ticked |
| 390 | Compare the H100 with the H20 | 4 |
| 390 | Compare the four chips | 6 |
| 390 | Remove one, swap one | 3, 4 |
| 390 | Search "B300" and land on its card, clear of the strip | 2 |

The list shows 15 chips before it scrolls at 1440 by 900 (the review asked for at least 14).

## Census differences

`census-chips.js` reads the visible text of the redesign before this page changed (8766) and of this build (8772) in four states: nothing ticked, the B200 and Ascend 910C, four chips (B200, Ascend 910C, Instinct MI355X, WSE-3 Turbo) with every fold open, and `/chips/`. Output: `qa/redesign/census-chips.txt`.

| State | Lines before, after | Only before | Only after | Writing-rule hits on added lines |
| --- | --- | --- | --- | --- |
| Nothing ticked | 152, 172 | 82 | 102 | 0 |
| B200 and Ascend 910C | 210, 316 | 85 | 191 | 4 |
| Four chips, folds open | 374, 464 | 156 | 246 | 7 |
| `/chips/` | 682, 706 | 29 | 53 | 3 |

What the old page had and where it went:

- **The slots and their controls**: "Chip 1" to "Chip 4", Change, Remove, ×, "Choose a chip, or a dot above", "Add a third chip (optional)" and "Browse all 38 chips by maker". The list and its boxes replace them all.
- **The full names in the Browse fold**, such as "TPU v7 (Ironwood)" and "H800 (China variant of the H100)". The list shows the short name with the full name as its title. The full name also heads the chip's card, its comparison row and its row on `/chips/`.
- **The empty comparison** ("Not chosen yet", 16 "not chosen yet" bars, the empty rows of figures and words). Nothing is drawn until two chips are ticked, and the row names return then.
- **"area not published" under every chip**, now said once in a sentence. The WSE-3 Turbo's "46225 mm² each" now reads 46,225 in the "Area of each die, square millimeters" column, with its mark.
- **"Read the notes"** is now "Notes" in each row head.
- **"Choose a dot to add its chip to the comparison."** now reads "Select a dot to open its chip's card, or tick chips in the list to compare them."
- **The speed notes**: the same text, now with a letter and the chip's number and short name in place of the full name.
- **`/chips/`**:
  - "Memory suppliers" is now "Memory supplier";
  - figures carry the data's own digits: 2.039, 6.528, 8.601, 1.638, 2.765, 0.819 and 0.2048, where they read 2.04, 6.53, 8.6, 1.64, 2.77, 0.82 and 0.2;
  - each named supplier carries its own mark;
  - "assembler not published" appears 8 times and "foundry not published" 4 times, with the node now shown;
  - "Updated 21 October 2026" now reads 27 October 2026.

The writing-rule hits are all text from `data/landscape.json`, which the old page showed too. The semicolons are in the chip-to-chip links, scale-up and package fields. The self-reference is the word "our" inside Huawei's roadmap quotation in the Ascend 910C's speed note.

## Known issues and what is not done

1. **Four chips' memory suppliers carry no source mark**: the Instinct MI355X, Instinct MI455X, Trainium3 and Ascend 910C. No source in their lists names the suppliers, so the row shows the names from `landscape.json` unmarked. On `/chips/` these four read "[all]" before. `build/audit-data-sources.js` still does not check `memory.suppliers`. Both need a data decision before release, as the design notes said.
2. **Crowded labels on a phone.** At 390 and 320, 28 labels still touch a mark (`labels-chips.txt`). Most cases are under 1 px. The worst are the H20 against two dots at 320 with four chips at FP16 (8 px), and the Ascend 910C's label against the Instinct MI455X dot at 390 at Bandwidth (3.5 px). The four chips at Bandwidth on a phone read clearly now, but they are crowded.
3. **Crowded dots on a phone.** At 390, 67 of 158 dot taps reach their chip through the short list, which is one extra tap.
4. **Two speed notes end without a period** (the Instinct MI355X and Rubin). This comes from `data/landscape.json`, and the old page showed it too.
5. **Full-page shots at 1440** show the sticky list unrolled and blank space under Notes and sources, because the list's height follows the window. At 1440 by 900, scrolled to the end, the page ends cleanly under the notes.
6. **The specimen in the shots** is still and seen from above, because the shots run with reduced motion. With motion on, it turns at the list's foot with its pause button (checked).
7. **The card shots show the box's focus ring**, because the shot opens the card by script, which moves focus into it.

## Shots

`sh qa/redesign/shots-stage-chips2.sh` writes them to `qa/redesign/shots/stage-chips2/`. They stay local, because `qa/**/shots/` is ignored.

- **Arrival:** `arrival-1440-light`, `arrival-1440-dark` (the first screen), `arrival-work-1440-light` and `-dark` (the list and the chart), `arrival-390`, `arrival-chart-390`.
- **Two chips** (B300, Instinct MI355X): `two-1440-light` and `-dark` (the comparison as Show the comparison lands it), `two-full-1440-light` and `-dark`, `two-390`.
- **Four chips** (B300, Instinct MI355X, Rubin, Instinct MI455X): `four-1440-light` and `-dark`, `four-full-1440-light` and `-dark`, `four-390`, `four-390-dark`, `four-parts-390`, `four-bw-1440` and `four-bw-390` (the labels at Bandwidth).
- **A chip's card open** (the H100, two chips ticked): `card-1440-light`, `card-1440-dark`, `card-390`.
- **Other states:** `crowd-390` (a tap on the crowded B300 at Memory), `list-390` (the list as a sheet), `rank-1440` and `rank-390` (highest first at Bandwidth), `ref-chips-1440` and `ref-chips-table-1440` (`/chips/`).

Against the mockup's `B-1440-*`, `B-390-*` and `B-1440-dark-*` shots, the build matches the layout, the type, the list, the table of figures, the card and the phone's sheet. It differs in four ways:

- the specimen is the live point cloud, at about 80 px, where the mockup used a larger still;
- the phone's tray shows the ticked chips with Change, where the mockup's button reads "Tick chips to compare · 4 of 4 ticked";
- the speed notes' heading is shorter;
- ticked chips' labels on a crowded chart may stand off on a leader.
