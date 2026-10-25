# Redesign, stage 4: share images and print

Branch `redesign-s4` (made from `redesign` at stage 2, c9f95cb). Built to `qa/redesign/BRIEF.md` (main checkout), the lead's stage 4 notes, and the approved card in `qa/design3/cards/chain/` (main checkout): `card.html`, `build.py`, `notes.md` and the chapter sketch `lithography-serif.png`.

## What was built

### 1. The share images

All 23 cards besides the home card are in the "whole chain" style. Each keeps its file name and path (`build/assets/cards/<slug>.png`, copied to `dist/cards/`), so every page's `og:image` is the same address. The build bumped each of the 23 versions in `versions.json` by one, so the addresses gain a new `?v=`. The home card is untouched.

- **The 17 chapter cards** follow the Lithography sketch. The wordmark (the wine tile and "Chip Supply Chain" in Fraunces) is top left. Under it come the chapter's title in Fraunces and its one-line summary (`oneLiner`) in Literata. The chapter's drawing stands large at the right. The 15 stage drawings run small along a shelf at the foot. They are pale except the chapter's own stage, which is in ink with an ink rule under it on the shelf.
  - Chapters 16 and 17 are not stages. Each covers the whole chain, so all 15 drawings are in ink and no stage is marked.
  - A one-line title is set at 104 px, as in the sketch. A title that takes two lines is set at 88 px, so the summary keeps its room. "Chemicals, Gases and Photoresist" is set at 80 px, the size at which it fits its column.
  - Every summary is whole except Data Centers and Power. Its three sentences run to 331 characters, so the card keeps the first two at 23 px.
  - A number and its unit never break apart: "474 GW" stays on one line.
- **The 6 view cards** follow the home card. The wordmark, the view's own short title and one line are centered over the home card's own row of drawings. That row is copied from `build/assets/home-card/card.html`, so it matches the home card to the pixel. The titles are "Start here", "The Chain", "AI Chips", "Suppliers", "Export Controls" (two lines) and "Glossary". Start here's page title is the hero, which the home card already carries, so its card takes the page's name.
- **The stale tagline is gone.** No card carries "Every stage, and who controls it" any more. Suppliers and Export Controls take their line from their page's own description (`build/page-titles.json`):
  - Suppliers: "What each of the 226 firms makes, where it is based and how hard it would be to replace." The count is read from `data/suppliers.json`.
  - Export Controls: "A timeline of the main chip export rules since 2018 and what can still be sold to China."
  - The other four views keep the line `social.js` gives them.
- **Limits, all met.** The cards run from 56 KB to 132 KB. Each has a white ground, a Fraunces title and the wine tile as its only color. The smallest text on any card is 23 px. The fit script reports that both faces loaded and that nothing overflows.
- **How the cards are made:**
  - `build/cards.py` is rewritten. It reads the same `manifest()` and runs the same one Chrome. It draws the drawings with the approved card's own functions: equal area, crisp lines, the haze dropped, the weights evened out, and the large drawing kept as stipple. A title or summary that would run into the row is shrunk, as described above.
  - The drawings are in `build/assets/cards-art/<chapter-id>.png` (17 files, 4.2 MB). Each is the chapter's specimen as 8-bit ink coverage, cropped to its ink. `qa/redesign/card-art.py` makes them from the redesign's specimen renders (`qa/design3/directions/hybrid/assets/spec-*.png`), the same files the home card's row came from. Chapters 16 and 17 come from the light renders in `qa/design3/kit/specimens/`, put through the hybrid's own `darken.py` step. `qa/design3` is only in the main checkout, so the script takes `--src`.
  - `build/cards-art.js` dumped point clouds for the old cards and nothing uses it now, so it is removed.
- **Contact sheet:** `qa/redesign/cards-sheet.png`, all 24 cards at half size, made by `qa/redesign/cards-sheet.py`.

### 2. Print

**The chapter PDFs and the whole-chain book** (`src/modules/print.css`, `src/modules/print.js`, `build/pdf.py`):

- **Why print.css was rewritten.** Its rules were written for the chapter before stage 2. Against stage 2's 12-column grid, they printed Lithography as 5 pages with most of the text lost. Every chapter rule now carries the screen's selector weight (`.chapter …`) and comes after `chapter.css`, so it wins.
- **Type and color:**
  - Fraunces for titles, section heads, the card's ratings and the cover.
  - Literata for text, standfirsts, captions, notes and the source list.
  - Hanken Grotesk for labels, running heads and the parts list.
  - Fragment Mono for kickers ("Chapter 04", "Figure 04.2", "Specimen 04 · Lithography"), section numbers, codes, dates and addresses.
  - Ink on white throughout. The wine is only on links (the citation marks, the parts list's links, the chapter's address and the citation's link) and on the logo tile.
  - The labels that were wine are now ink: In plain terms, the questions' head, the note numbers, the stage index's tick and the source numbers.
  - Labels are in sentence case, with no capitals or wide tracking.
- **The layout:**
  - **The opener.** The kicker sits over a 34 pt title (27 pt for a long one), with the standfirst under it and an ink rule below.
  - **The specimen caption.** Plain and flush left, with the parts list under it. Lithography prints its annotated drawing with the four balloons above the caption.
  - **The body.** In plain terms and each numbered section open on an ink rule. The card is ruled and has no tint, with its ratings large in Fraunces and the band's mark beside them.
  - **The figures.** Each figure has its number, the finding as its title, the original title under it, the chart, and a source line. The bars follow rule B: the largest value is solid ink with a bold label, and the rest take the light tint.
  - **The end of a chapter.** The questions and takeaways, then the source list under a Fraunces head, then the colophon.
- **The stage index shows full names, and they fit.** The chain is in a 31 mm margin column. Each stage has its number in mono, its whole name and its band's mark (solid for Extreme, an outline for High), with the chapter's own stage in bold. Chapters 16 and 17 follow under a hairline. Long names take two balanced lines ("Chemicals, Gases / and Photoresist").
  - To make room, the text column is now 134 mm (it was 142 mm) and the measure is 128 mm (it was 132 mm).
  - The rail is moved to the head of the chapter at print time, so it floats beside the opener.
- **Lithography's annotated drawing.** `print.js` takes the drawing from the chapter's readable page (the `svg.ch-still--wide` that `social.js` draws, with the image path fixed). The PDF and the readable page therefore show the same picture and balloons. It prints 122 mm wide, with balloon names at about 7.5 pt. `fontsReady()` waits for it.
- **The fonts are now the four new faces.** `print.js` loads static instances of them. Fraunces is at opsz 48 with SOFT and WONK at 0. Literata is at its text size. `font-synthesis: none` stops the browser from making up bold or italic faces.
  - `pdffonts` on the Lithography PDF lists only Fraunces, Literata, Hanken Grotesk and Fragment Mono, every one embedded as TrueType.
  - **The weights change on paper.** The screen's Fraunces 350 prints as 400, and the wordmark's 540 as 500. A weight between the named ones came back as Type 3 shapes, which do not copy or search.
- **Two layout bugs, fixed:**
  - **Every folio printed as "n / 0".** Paged.js gathers every `counter-reset` in the page's sheets into one rule on its pages. The screen's section counter (`counter-reset: sec`, and `counter-increment: none` on the readable page) put a counter named "none" in that rule, which voided it. On paper `print.js` writes each section number on its heading (`data-cp-n`) and removes those two declarations before Paged.js reads the sheets. Folios now read "1 / 14".
  - **Paged.js lost lines.** It sometimes cut a page at the wrong line when a footnote's call fell at the page's foot. Lithography's opener lost about three lines of In plain terms this way. Paragraphs on paper now wrap the plain way (`text-wrap: wrap`) and section heads are kept whole. `finish()` names each chapter that lost lines (`lostIn`), and `pdf.py` lays it out again set closer, so its lines fall elsewhere. `chapter_pdfs.py` still refuses any file whose log says "TEXT OFF THE PAGE".
- **The book's front:**
  - **The cover.** The wafer is drawn in ink. The picked field is denser ink with its heavier seal ring, where it used to be blue. `build/cover-art.py` now draws in the ink unless a colour is named, and `build/assets/print-title.png` is regenerated from it. The wordmark is Fraunces at opsz 28, the title Fraunces at 64 pt, the subtitle Literata.
  - **How to read and Contents.** Both are restyled and set closer, so all 17 contents lines share page 2 with How to read.
- **The colophon.** The citation for the edition is set in Literata on an ink rule, and the BibTeX in Fragment Mono.

**The four-page summary.** Two files changed:
- `build/modules/summary-brief.js`, in its `PRINT_CSS` constant only. The sheet is rewritten in the new type: Fraunces heads, Literata text, Hanken Grotesk labels and table heads, and Fragment Mono for numbers, codes and the edition. A band is a mark and a word, as on the site. The wine is gone from "Extreme" and from the labels, and stays on the logo and the source links. It still prints on 4 pages.
- `build/summary_pdf.py` loads static instances of the four faces and sets the foot of each page in Hanken Grotesk, with the folio in Fragment Mono. `pdffonts` lists only those faces, all TrueType.

**The readable chapter pages' own print** (`build/assets/chapter-page.css`, the `@media print` token block). These pages now print with the site's light tokens: ink #171716 and the new inks and rules. The old blue-black ink and gray rules are gone.

**Dropped faces.** Nothing in `src/` or `build/` loads Source Serif 4, Instrument Sans, Jost or IBM Plex Mono any more. One comment in `src/modules/controls.css` (stage 3's file) still names Instrument Sans, and I left it alone.

## QA gates

| Gate | Result |
| --- | --- |
| `node build/build.js` | Passes, with no warnings. The 23 card versions were bumped by the build. |
| `check-speak`, `check-integrity`, `check-sources`, `check-size` | All four pass. check-speak finds no matches, check-integrity no problems (17 chapters), check-sources 2,851 citations, all tier A or B, and check-size no file over 5 MB. |
| `node qa/scripts/smoke.js --port 9616` | Passes: 33 page loads, no failures. With the device set to dark, the main page, a chapter page and the summary keep the white ground, and `?theme=dark` turns them to rgb(18, 18, 17). |
| Screen text | No visible text changed on any built page. All 25 changed HTML files in `dist/` have the same text, with scripts and styles stripped, as at c9f95cb. Every change is inside `@media print`, the print scripts, or the `og:image` addresses' `?v=`. |
| Cards | 23 rendered, 56 KB to 132 KB, with fonts loaded, no overflow and the smallest text at 23 px. See `qa/redesign/cards-sheet.png`. |
| Chapter PDFs | ALL17_RESULT |
| Summary PDF | 4 pages, 0.21 MB, with only the four new faces embedded, all TrueType. |

## Sample PDFs and their page images

The PDFs were printed with `build/pdf.py` and `build/summary_pdf.py` from a copy of this checkout's `dist/` served on 127.0.0.1:9610 and 9614 for the job, to my scratch space. They have been deleted. Nothing in `dist/pdf/` or the book PDF was touched or committed.

- `qa/redesign/print-lithography.png`: all 14 pages of the Lithography chapter PDF.
- `qa/redesign/print-lithography-detail.png`: page 1 (the opener, the chain in the margin, the annotated drawing, the parts list, In plain terms), page 3 (the card and a section opening) and page 7 (two bar figures under rule B, with their findings and source lines).
- `qa/redesign/print-book-front.png`: the whole-chain book's cover, How to read and Contents, and chapter 01's opener and card. It was printed with `--only 1`, so the contents' page numbers past chapter 01 read 0.
- `qa/redesign/print-summary.png`: the four-page summary.

## Changes outside stage 4's own files (for the merge)

- `build/modules/summary-brief.js`: only the `PRINT_CSS` template string (the summary's print sheet). The screen sheet and the markup are untouched.
- `build/assets/chapter-page.css`: only the `@media print` token block at its foot, plus one line that sets plain wrapping on paper.
- `build/cover-art.py` and `build/assets/print-title.png`: the cover art in ink.
- Not touched: `src/styles.css`, `src/app.js`, the view modules, `src/modules/chapter.css`, `src/template.html`, `build/build.js` and `build/modules/social.js`. The print path undoes the screen's chapter grid and counters from `print.css` and `print.js`, so `chapter.css` needed no change.

## Known issues and open questions

- **og:image:alt still describes the old cards.** `social.js` builds it from the manifest's eyebrow, title and line, so a chapter's alt names its two ratings ("Extreme concentration · Very hard to substitute"). The new card shows the one-line summary. Suppliers' alt still says "where it sits", and Start here's alt names the hero title. I left `social.js` alone because stage 3 is changing `build/modules/`. Suggested fix: build the alt from the card's title and line. For example, `cards.py` could write them to a `cards.json` that `social.js` reads.
- **The card drawings come from files only the main checkout has.** `build/assets/cards-art/` is committed, so `cards.py` runs anywhere. Remaking those drawings needs `qa/redesign/card-art.py --src <main checkout>`, as the home card's `card.html` needs the main checkout's `qa/design3/cards/chain/build.py`.
- **Fraunces prints at 400 where the screen sets 350.** See the fonts note above. If the lead prefers lighter titles on paper, 300 is the other named weight that embeds as TrueType.
- **Paged.js and footnotes.** The relayout catches lost lines, and every chapter in the full run came out with none (see the gates). The bug itself is in Paged.js 0.4.3 and the note handler, so the lead's run should still watch `chapter_pdfs.py` for refusals.
- **Short pages.** As before the redesign, a card is kept whole and may leave the page before it short. Lithography's page 2 is 59 percent full. The existing float and set-closer passes handle the rest.
- **PDFs not regenerated.** `dist/pdf/*.pdf`, `dist/chip-supply-chain-the-chain.pdf` and `dist/chip-supply-chain-summary.pdf` are still the old design until the lead regenerates them.
