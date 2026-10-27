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

The plate's defaults are a typical drawing's, so the page barely moves when the drawing arrives. The GPU baseboard now draws about 545 px wide, and every drawing stands about 340 px tall as it turns.

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
