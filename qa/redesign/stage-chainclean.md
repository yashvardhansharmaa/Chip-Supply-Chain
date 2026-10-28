# The Chain's contents page, option 3 "clean", built (28 October 2026)

Branch `redesign-chainclean`, cut from `redesign` at 6f7c8c2. Built from `qa/design8/BUILD-CHAIN.md` and the mockup `qa/design8/b/b1-clean.html` (main checkout), with single band marks and no tint behind the drawings. Shots and side-by-side images are in `qa/redesign/shots/stage-chainclean/` (ignored by git, as all shots are).

## What changed

**The head (`src/template.html`, `src/modules/contents.css`)**
- The title sits on the left with the three downloads under it. The sentence that is also the key sits on the right: "7 of the 14 stages are rated ▮ Extreme, meaning three or fewer firms could supply each today, or one firm holds more than half, and the other 7 ▯ High, meaning four to six could."
- `build/build.js` (`chainStandfirst`) writes the sentence. Both counts come from the chapters' cards. The Extreme clause comes from the card's own note, as the home page builds it (`build/modules/walk.js`). "four to six could" comes from the High note. "the other" is used only when Extreme and High cover every stage. The two marks in the sentence are the page's only key.
- Today's standfirst stays in the page as `.howto-lede.print-only`, so the book keeps its own lede, which `print.js` still words for paper. On screen it is hidden.

**The rows (`build/build.js` CONTENTS, `src/modules/contents.css`)**
- The route, the bracket, the separate key and the second list are gone. Each chapter is one `li.item` holding four parts:
  - its drawing, in a fixed 112 x 84 box at 1440 on the page's ground, with no tint;
  - its number with one band mark, a solid wine bar for Extreme or a hollow ink mark for High;
  - its title, a link to `#<id>` that covers the whole row;
  - its one line in the muted ink, read from the chapter's front matter. Chapter 14's shortened line is the one used.
- The stages run in two columns from 1300 px, 01 to 07 on the left. From 1000 to 1299 px they run in one column, each title with its one line beside it. From 760 to 999 px they run in one column as at 1440. Under 760 px each row sets its drawing, number and title on one line, with the one line under them, and the sentence moves to the foot under a hairline. These breakpoints are the mockup's.
- Chapters 15 and 16 are the same rows, with no mark, under a small "Across the chain" label.
- The rows are the list the book reads: `.contents-grid .item`, `.n` and `.t[href="#<id>"]`. The book's own heads (print only) are kept.
- `src/app.js` is unchanged. The rows carry `data-ch`, so pointing at or focusing a row marks its number and title in wine (`.is-hot`), and Tab reaches each row's link in order.

**The drawings (`build/line-stills.py`, `build/assets/line/`)**
- `line-stills.py` now records each drawing's share of the row's box (`wt`, the mockup's `fit()`: 60 percent of a 94 x 66 box). It no longer records the old line's `w1` to `w3`. The fourteen stage stills come out byte for byte as before.
- It also makes chapters 15 and 16's day-side stills, as `day_still` in `build_clean.py` does. They are written to `build/assets/line/component-costs.webp` and `geopolitics.webp`, and `build.js` copies all sixteen to `dist/media/line-<id>.webp`. Its stale-still warning now covers these two too.

**Checks updated**
- `qa/scripts/smoke.js` no longer looks for the line. It now requires:
  - a row for every chapter, in order, shown with its drawing and its `#<id>` link;
  - every drawing fetched and decoded (the check switches the lazy images to eager so that all sixteen load);
  - the stages and the chapters across the chain in their own groups;
  - one mark per stage, matching its card, Extreme in wine, and none on 15 and 16;
  - the drawing's box on the page's ground;
  - two columns from 1300 px and one below;
  - the label;
  - the standfirst holding both counts and both marks;
  - the downloads, and no How to read a chapter.
- `qa/redesign/stage-chapters.js` check 10 now:
  - checks the groups and the label;
  - clicks every row by its title and by its drawing at 1440, 1024 and 390;
  - checks that the sixteen drawings are served as webp;
  - checks the downloads as before.
  The old check fetched the line's static `<id>/` links, which the rows no longer have.

`src/styles.css`, `print.css` and `print.js` are untouched.

## Departures from the mockup

1. **Type follows the site's text scale.** Sizes are the mockup's px times `--text-scale` (18 / 18.5), as the rest of the site sets them, so the type is about 3 percent smaller. The sentence at 1440 therefore breaks after "supply" where the mockup breaks after "could", and a few one lines wrap one word differently.
2. **Short one lines.** Each row's grid gives any spare height to the one line's row, not the title's. In the mockup, a drawing taller than a two-line one line pushed the title down by about 4 px (07 Metrology at 1440).
3. **The label is an `h3`** (a `span` in the mockup), so it heads the two rows for screen readers.
4. **The foot.** The site's footer follows the rows: 24 px of padding under the contents, then the footer's own 72 px margin. The mockup had 96 px of empty page. On a phone the sentence keeps 24 px above the footer.
5. **Links.** Each row links to `#<id>` (the list's link, which the book's page numbers need). The line's links to the static `<id>/` pages are gone from the contents. The home page's HTML still links every chapter page, and `check-seo` passes.
6. The mockup's 1024 and 390 shots were taken before the tint was removed, so their boxes are gray in the side-by-side images. The built page has no tint, as the brief asks.

At 1440 x 900 the first screen shows 01 to 05 and 08 to 12 in full, with titles and one lines (10 of 14, all seven Extreme stages among them), as in the mockup. The page is 1,772 px tall at 1440 with its footer.

## The book PDF

Printed with `python3 build/pdf.py "http://127.0.0.1:8776/?theme=light#/chain" dist/pdf/how-ai-chips-are-made.pdf --wait 8 --port 9341`.

**186 pages**, the same as the committed PDF. 1,046 notes, no overflow or stray notes, and no stranded heading after pdf.py's own second layout.

Pages 1 and 2 against `qa/design9/cover/today-cover.png` and `today-contents.png`, at the same 60 dpi:
- **The contents page (2)** is pixel-identical to `today-contents.png`. At 150 dpi it is also pixel-identical to the committed PDF's page 2. It keeps the same layout, the single marks, the page numbers (01 on 3 to 16 on 171) and its own print-only standfirst ("This edition covers…").
- **The cover (1)** differs only in the byline, which reads "Yashvardhan Sharma" without " with Claude" (6f7c8c2, committed before this branch). Every other pixel matches `today-cover.png`.
- Side by side: `shots/stage-chainclean/compare-pdf.png`.

Other pages whose text differs from the committed PDF (86, 151, 157 to 161, 186) come from chapter changes committed on `redesign` after that PDF was printed. Examples are the Foundries "How it works" page break and chapter 14's text. None comes from this branch. The fresh PDF is committed in `dist/pdf/`.

## Checks (on the final build)

| Check | Result |
|---|---|
| `node build/build.js` | builds, no warnings |
| `check-speak.js` | no matches |
| `check-integrity.js` | no problems (the existing warn on chapter 06's card, unchanged) |
| `check-sources.js` | 2,817 citations, all tier A or B |
| `check-size.js` | no file over 5 MB |
| `check-seo.js` | 16 chapter pages, 22 sitemap entries, no problems |
| `smoke.js --port 8781` | 36 page loads, no failures (`smoke-chainclean.txt`) |
| `stage-chapters.js --base http://127.0.0.1:8776` | 10 of 10 pass (`stage-chapters-chainclean.txt`) |
| `interact-chapter.js http://127.0.0.1:8776` | 85 ok, all passed (`interact-chapter-chainclean.txt`) |
| `check-cites.js` (reads the dist the preview serves) | 3,300 marks, 0 problems (`check-cites-chainclean.txt`) |
| `sweep-full.js` on `#/chain` at 390, 1024, 1440, light and dark | 6 loads, 0 with findings (`sweep-chainclean.txt`) |
| `sweep-full.js` at 320, 759, 760, 999, 1000, 1199, 1299, 1300, 1366 | 9 loads, 0 with findings |

## Shots (`qa/redesign/shots/stage-chainclean/`)

- `chain-1440.png`, `chain-1440-dark.png`, `chain-1024.png`, `chain-390.png`, `chain-1440-full.png`
- Side by side with the mockup's shot: `compare-1440.png`, `compare-1440-dark.png`, `compare-1024.png`, `compare-390.png`, `compare-1440-full.png`
- The book's first two pages beside today's: `compare-pdf.png`

## For the merge

- The edits stay in the brief's files: `build/build.js` (the CONTENTS block and one `fill`), `src/template.html` (the `.howto` block), `src/modules/contents.css`, plus `build/line-stills.py` and its assets, and the two checks.
- The display face goes through `var(--font-display)`, and the labels through `--font-kicker`, `--fs-label`, `--tr-label` and `--tt-label`. The type agent's changes reach the page through those variables.
- `dist/pdf/how-ai-chips-are-made.pdf` is a binary file. If the other branch also reprints it, take either one and print again after the merge.
