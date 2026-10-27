# The column: chapter opener, stage report

27 October 2026, branch `redesign-opener` (from `9a3e308`). The owner chose "the column" from design round five (`qa/design5/opener/b/` in the main checkout: `notes.md`, the mockups `option-b-*.html` and the review in `qa/design5/opener/review/review.md`). This branch builds it into the app's chapter page, the readable pages `dist/<chapter>/` and the chapter PDFs.

## What was built

**One column from the first line.** The contents rail (On this page, Figures, The chain) starts beside the kicker, at y 120 at 1440, and stays sticky down the whole chapter. Before, it started under the card, at y 2,025. The opener sits in the text column from column 4: the kicker, the title, the standfirst, the facts line and the cite line (Link to chapter, Cite this chapter, Chapter PDF), all at the text's measure (666 px). The ink rule under the opener is gone, and In plain terms' own rule divides.

**The verdict is in the kicker**, in the words the card's look-up heads use: "Chapter 04 · Stage 4 of 15 · ▌Extreme concentration · Very hard to substitute". The mark is the band's, as before (a bar for Extreme, an outline for High). Chapters 16 and 17 keep "The economics" and "The contest". On the narrowest phones (under 360 px) the second rating takes a line of its own and the dot goes.

**The specimen is the chapter's first plate**, at the measure on the open ground, with no box. The live 3D drawing moves into its slot as before (`Stage.host`), turned by a drag or the arrow keys, with its pause at the end of the caption's label. Lithography's four balloons ride on it. The caption and the parts list sit side by side under the drawing: the label and caption on the left, "Parts, as numbered on the drawing" and the list in a 252 px column on the right. Without parts, the caption runs alone. On a phone they stack, as before.

**Each plate is fitted to its drawing.** The live drawing turns inside the sphere that holds it, so a flat board and a tall rack left different empty bands; a stock 400 px slot put 129 px of white over the GPU baseboard. `Stage.fit` (`src/app.js`) now measures the drawing as it turns and sets three values on the plate:
- `--draw-h`, the canvas's height (380 to 640 px), at which the drawing stands about 340 px tall;
- `--lift`, the empty band over the drawing, which the slot drops: the canvas rides up under the opener, which stands over it;
- `--slack`, the band under it, which the caption rises into (as the caption already stood on the drawing's foot).

The plate's defaults are a typical drawing's, so the page barely moves when the drawing arrives. Twelve of the fifteen stages' drawings, and both night drawings, now stand about 340 px tall as they turn. The three flattest (substrate layers, the probe card and the GPU baseboard) reach the 640 px canvas first: the baseboard stands 247 px tall and about 545 px wide, against 155 by 340 px in a stock 400 px slot.

**Chapters 16 and 17 keep their night ground**, now on the drawing's slot only, 28 px round the drawing, at the measure. The caption sits under it on the page's ground. They have no card and no "Chokepoint card" line in On this page.

**The card is the chapter's first table**, in the text after In short and the lead paragraph, before "01 · How it works", at the measure on the paper tint: the three ratings in a row (40 px), then each field as a row with its label in a 186 px column (so "Why substitution is slow" fits one line). On a phone each label stands over its answer. It has its own address, `#<chapter>--card`, and On this page lists it as "Chokepoint card" after In plain terms. It lands clear of the masthead, and of the phone's slim bar.

**The sources are numbered in the new reading order**: In plain terms, In short, the lead, then the card, then the body (`readingOrderCites` in `build/build.js`). The card's footnotes, the marks in the text, the source lists and the printed notes all follow it. Lithography's card now reads 5, 4, 3, 10, 11, 1, 12, as the mockup's does.

**Under 1200 px** the opener runs from the left margin, the rail is the line of links between the opener and the specimen, and the plate and the card keep 666 px. **On the phone** nothing stands between the opener and the text: the specimen is the strip at the foot of the screen, with the slim bar, as before. A readable page shows its still after the opener.

**The readable pages** (`build/modules/social.js`) get the same: the verdict in the kicker, the still as the plate at the measure (Lithography's with its named balloons), the caption beside the parts, the card after the lead and On this page's "Chokepoint card".

**Print and the PDFs** keep the card after the lead (`src/modules/print.js`). The layout passes in `build/pdf.py` move a card only past paragraphs and never past a heading, so it keeps its place. A card is reported as a failed move only if a pass moved it. The new card rules are kept off paper. Paged.js lifts any rule with an "a + b" selector out of its media query and applies it on paper, so the new rules use none.

**Smaller changes:**
- The rail is set a little closer (14 px between its parts, 3 px link padding, 16 px from the masthead), so that with "Chokepoint card" it still fits a 900 px window (801 px, under its 808 px limit). Without the change it ran to 820 px and scrolled inside itself.
- A pre-existing overflow, found by the sweep: since `9a3e308` a glossary term and the comma after it never part, and "National Integrated Circuit Industry Investment Fund," then ran 453 px wide on one line, so chapter 17 scrolled sideways on a phone. The term may now wrap inside its own box (`.nw > .gl-term` in `src/styles.css`); a short term behaves as before.
- `qa/redesign/interact-chapter.js` checks the column (below) and reaches chapters 16 and 17 by their addresses. Since one chapter per address, its old scroll to chapter 16 could not reach it, and it failed two checks on 8766.
- New: `qa/redesign/census-opener.js` (the census below) and `qa/redesign/shots-stage-opener.sh` (the shots).

Files: `build/build.js`, `build/modules/social.js`, `build/modules/reference-pages.js` (the static Glossary reads the prose with the card in it), `src/app.js`, `src/styles.css`, `src/modules/chapter.css`, `src/modules/print.js`, `src/modules/print.css`, `qa/redesign/check-cites.js` (its note), `qa/redesign/interact-chapter.js`, the new QA files, `build/page-dates.json` and `dist/`. The page dates were put back with `qa/redesign/keep-dates.js 9a3e308` (no chapter's text changed).

## Measured

Before is the redesign preview (127.0.0.1:8766), after is this branch (127.0.0.1:8771), each chapter at its address, 900 px tall (844 on the phone). The mockup's figures are in its `notes.md`.

| | Width | First paragraph of In plain terms, before → after | Top of the rail | Top of the card | Drawing box |
|---|---|---|---|---|---|
| 04 Lithography | 1440 | 2,124 → **1,205** (mockup 1,236) | 2,025 → 120 | 1,047 → 2,330 | 867 × 576 → 666 × 408 |
| 04 Lithography | 1280 | 2,165 → **1,189** | 2,071 → 120 | 1,056 → 2,409 | 769 × 576 → 666 × 408 |
| 04 Lithography | 1024 | 2,536 → **1,285** | 2,325 → 464 | 1,119 → 2,377 | 536 × 576 → 666 × 408 |
| 04 Lithography | 390 | 3,127 → **801** (mockup 803) | 2,835 → 514 | 531 → 2,363 | the strip |
| 10 Memory and HBM | 1440 | 2,221 → **1,240** (mockup 1,250) | 2,123 → 120 | 1,147 → 2,358 | 867 × 576 → 666 × 413 |
| 10 Memory and HBM | 390 | 2,805 → **859** (mockup 861) | 2,513 → 571 | 588 → 2,447 | the strip |
| 17 Who Controls the Chain | 1440 | 1,283 → **1,230** | 1,184 → 120 | no card | 819 × 576 → 666 × 397 |
| 17 Who Controls the Chain | 390 | 1,021 → **976** | 565 → 524 | no card | the strip |

- Both ratings stand in the kicker at y 120 at 1440 (y 132 on the phone). Before, Substitutability first showed on the card, about 1,170 px down at 1440.
- Figures keep 666 px at 1440, 1280 and 1024 (355 px on the phone), as before.
- Lithography at 1440 is 14,521 px tall, against 14,658 before: the opener is shorter, the card at the measure taller.

## Checks

Against 127.0.0.1:8771 on the final build (`13b4361`) unless marked.

| Check | Result |
|---|---|
| `node build/build.js` | no warnings |
| `check-speak`, `check-integrity`, `check-sources`, `check-size` | all pass, exit 0 (integrity: no problems; sources: 2,852 citations, all tier A or B) |
| `node qa/redesign/check-cites.js` | 3,374 marks, 0 problems: every mark names its own source, and each number first appears in order (In plain terms, In short, the lead, the card, the body), in The Chain and on every readable page |
| `node qa/scripts/smoke.js --port 9361` | 36 page loads, no failures |
| `node qa/redesign/interact-chapter.js http://127.0.0.1:8771` | 60 checks, all pass (on 8766 the old script failed 2, chapter 16 by scroll) |
| `node qa/redesign/interact-glossary.js http://127.0.0.1:8771` | 90 checks, all pass |
| `node qa/redesign/stage-chapters.js --base http://127.0.0.1:8771` | 9 of 9 on `c413ff0`. On the final build, run while the sweep loaded the machine, 8 of 9: check 3's last step (chapter 17's door to the contents) did not navigate. Run alone, check 3 passes on 8771 and on 8766, and the same click replayed by hand lands on `#/chain` |
| Test PDF, `python3 build/chapter_pdfs.py lithography --base http://127.0.0.1:8771/ --port 9362` | accepted: 14 pages (as before), 1.1 MB, title and edition found, no text off a page, no overflow, no stray notes, no stranded head. The card follows the lead and breaks between its rows across pages 2 and 3 (the layout pass's `cp-split`); before, it stood whole at the head of page 3. `dist/pdf/lithography.pdf` was restored and no PDF is committed |
| Text census, `node qa/redesign/census-opener.js` (8766 against 8771) | see below |
| Layout sweep, `qa/redesign/sweep.js --set chapters --widths 390,768,1024,1280,1440`, light and dark | 340 loads (17 chapters in The Chain and 17 readable pages), 0 findings: no sideways scroll, no text under 11 px, no clipped text, no overlap in the first three screens, a focus mark on every stop (`sweep-opener.txt`, on `dcb7d85`). The rerun on the final build was stopped unfinished |
| Phone width, every chapter and readable page at 390 and 320 | after the fix every page keeps the device's width; on 8766 chapter 17 widens to 470 px. The sweep cannot see this: on an emulated phone the layout viewport widens with the page, so its scroll width equals its window |

## Census

`qa/redesign/census-opener.txt` (8766 against 8771) and `census-opener-base.txt` (this branch's base, `9a3e308`, against 8771). Both were taken before the last commit, which changes no text.

Against the base, the only words that differ are the change's own: in the kicker of each of the 15 stages, "Extreme" or "High" became "Extreme concentration" or "High concentration", a dot and the substitutability phrase ("Very hard", "Hard" or "Moderately hard to substitute"), and On this page gained "Chokepoint card". All other differing lines differ only in their citation marks, renumbered. With the marks out and the card's lines set aside, every page's text runs in the same order, line for line. Each card has the same words, now after the lead ("ASML sold 327 lithography systems in 2025…") and before "How it works". Each source list holds the same sources, in the new order. Chapters 16 and 17 do not differ at all.

Against 8766 the same holds for 16 of 17 chapters. Lithography also differs by `f773802`, a commit on `redesign` after this branch's base: on 8766 its card's China and US lines and a paragraph cite the Center for Technology & Statecraft's September 2026 report, it has 51 sources and 2,519 words, and it is updated 27 October. That text is not lost here; this branch does not have it yet.

## Known issues and what is uncertain

- **Merge.** `redesign` has two commits this branch lacks: `f773802` (Lithography's text) and `efac818` (AI Chips). The code does not overlap, but `dist/`, `build/page-dates.json` and `dist/build-report.txt` will conflict: rebuild after the merge.
- **The PDFs in `dist/pdf/` are from before this change**, with the card at the head of the text and the old numbers. Regenerate all 17 chapter PDFs and the book after the merge.
- **The page settles once as the drawing arrives**: the plate's defaults fit a typical drawing, so the text under the flattest drawings (the GPU baseboard, the probe card, the substrate layers) moves up by up to about 95 px about a second after the page opens.
- **During a drag** the drawing can show under the cite line (the canvas rides under the opener) or meet the night plate's edge. The idle turn never does.
- **In dark mode** the night plate of chapters 16 and 17 has the page's own ground, so it has no edge, as in the mockup.
- **The long-term fix** leaves the comma at the right edge of the term's box on phones under about 520 px ("National Integrated Circuit Industry / Investment Fund", then the comma at the line's end), the one term long enough. The alternative, the comma opening a line, is what `9a3e308` removed.
- On the readable page at 1440 the still's balloon numbers render at 12 px (14 before): the still is drawn at the measure now. Its names are kept at 14 px.

## Shots

`sh qa/redesign/shots-stage-opener.sh` writes them to `qa/redesign/shots/stage-opener/` (ignored by git):
- `lithography-1440`, `lithography-390`, `memory-and-hbm-1440`, `memory-and-hbm-390`, `geopolitics-1440`, `geopolitics-390`;
- their plates: `lithography-1440-plate`, `memory-and-hbm-1440-plate`, `geopolitics-1440-plate`, and `lithography-1440-plate-motion` (with motion on, the pause at the caption's label);
- `lithography-1440-dark`, `geopolitics-1440-dark-plate`, `lithography-1024`;
- the card: `card-1440`, `card-390`;
- the readable pages: `page-lithography-1440`, `page-lithography-1440-plate`, `page-lithography-390-plate`, `page-geopolitics-1440-plate`;
- `geopolitics-390-long-term`, the long glossary term on a phone.

Against the mockup shots (`qa/design5/opener/b/shots/b-*`): the opener, the verdict, the rail, the card and the phone match. The live drawing stands where the mockup's still does, its first paragraph within 31 px of the mockup's at 1440 and 2 px on the phone.

