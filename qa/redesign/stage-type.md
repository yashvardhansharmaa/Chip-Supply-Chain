# Source Serif 4: type stage report

27 October 2026, branch `redesign-type` (from `6c3ffd2`, the redesign with the column opener). The owner chose Source Serif 4 in design round five (`qa/design5/fonts/notes.md` in the main checkout, "Source Serif 4"). The switch was committed as `e6f3fe5`. The app restarted before its builder ran the checks, so this pass ran them, fixed what they found and wrote this report.

## What changed

**In `e6f3fe5`** (the earlier builder):
- **Faces.** Source Serif 4 for both display and text, in place of Fraunces and Literata. Hanken Grotesk and Fragment Mono are unchanged. One Google Fonts request (`Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,400`) replaces two, in `src/template.html`, the readable pages, the summary and the share-card sources.
- **Text scale.** `--text-scale: calc(20 / 18.5)` in `src/styles.css` (and in `build/assets/chapter-page.css` and the summary's sheet). Every size set in the text face is its Literata size times the scale: chapter text 18.5 → 20 px at line height 1.55 (was 1.62), phone text 17.5 → 18.9 px, and the standfirsts, In plain terms, In short, the card, captions, the Glossary, Suppliers and Export Controls with them. Display sizes are unchanged.
- **Measure.** `--measure: calc(36em / var(--text-scale))`, 33.3 em, so the chapter text stays 666 px, the width of the figures.
- **Weights.** Titles and section heads 400 (Fraunces ran 330 and 350); light numbers 360; small heads 500; the masthead name 540. The optical-size tokens are `normal`, so the optical size follows the size (`font-optical-sizing: auto`).
- **Print.** `src/modules/print.js` and `build/summary_pdf.py` load named instances only (Source Serif 4 at optical size 11 for the chapter PDFs and 9 for the summary, at 400, 500, 600 and italic 400), so no Type 3 shapes. Fraunces's separate wordmark instance is gone; the wordmark prints at 500.
- **Elsewhere.** The figure PNG export (`build/build.js`), the share-card sources (`build/cards.py`, `build/assets/home-card/card.html`, with the card's line 8 percent larger) and the readable pages' fonts name the new face. `qa/redesign/type-census.js` checks every element's face and size against the redesign as it stood.

**In this pass:**
- `f14b84d`: the 24 share cards drawn again with `build/cards.py` and `build/home_card.py`. The committed cards were still Fraunces and Literata. Each card's version is bumped, so the pages ask for the new image.
- `8125dea`: In plain terms and In short now keep to the 666 px measure, as the title, the specimen plate, the card and the text do. They were six grid columns wide: 644 px at 1440, so their ink rule stopped 22 px short of the card's tint below, and 695 px at 1024, wider than the text. This was there before the switch; the larger type made it plainer. Under 1200 px they span the grid and keep 666 px. The comments that still named Fraunces as today's face (`src/modules/chapter.css`, `build/icons.py`) now record it as history; the logo's drawn c is unchanged.
- `10eb527`: the Export Controls scrubber's year (`.cf-asof b`) is a light number at 360, like the year labels. It was still Fraunces's 350.
- `42297d4`: the size census rerun against the right baseline (below), a note in `type-census.js` on which baseline to use and what it should report, and the earlier builder's shot list (`shots-stage-type.sh`) with the extra shots of this pass.
- New: `qa/redesign/sweep-full.js` (the full-page layout check below), `qa/redesign/sweep-type.txt` (every sweep's output) and `qa/redesign/census-type.txt` (the text census).

## Checks

Every check ran in the foreground on this branch's build (127.0.0.1:8773), after the last change unless noted.

**1. The build and the standing checks.** `node build/build.js` builds clean. `check-speak`, `check-integrity` (no problems; the two standing notes on chapter 6's card and Veeco), `check-sources` (2,857 citations, all tier A or B) and `check-size` (none over 5 MB) all pass. Smoke on port 9381: 36 page loads, no failures, including the light-ground check with the device set to dark. `stage-chapters.js --base http://127.0.0.1:8773`: 9 of 9 pass. On the first run, check 3 failed once: chapter 17's door landed on `#geopolitics` instead of the contents. It passed on two reruns here and on 8766, so it is a timing flake in the check's 1.5 s wait, not a change in the door. `interact-chapter.js http://127.0.0.1:8773`: 60 checks, all passed.

**2. The censuses.**
- **Baseline.** 8766 is no longer the redesign as it stood. It has taken new chapter 8 and 9 text (`d0a325c` to `29c4963`) since this branch left it at `6c3ffd2`. Against 8766, the type census pairs the wrong elements, since 12 text elements differ, and the text census shows that new text. So both censuses also ran against `git archive 6c3ffd2 dist`, the redesign at this branch's base.
- **Text census** (`census.js`, every view and static page plus the three forwarding pages). Against `6c3ffd2`: every page's lines are identical, with no word lost or added (`qa/redesign/census-type.txt`). Against 8766: the only differences are the redesign's new chapter 8 and 9 text and what quotes it (the walk, The Chain, the summary, the Intro and the Glossary's place counts).
- **Size census** (`type-census.js`, 31 pages at 1440 and 390, 331,886 text elements, against `6c3ffd2` served on port 9383 for the run). 23 kinds differ, all expected (`qa/redesign/type-census.txt`):
  - 10 are AI Chips' text sizes in `src/modules/chips.css`, left for the lead (item 8).
  - 6 are the citation marks. They are 0.62 em of the text they sit in, so they grow with it: 11.5 → 12.4 px in chapter text at 1440, and the 11 px floor holds.
  - 7 are elements hidden at that width that inherit the body's size: the walk's phone-only previous and next titles and the phone sheet's head at 1440, and the print-only stage tile. Print sets its own size for the tile.
  - Every element Literata set is now Source Serif 4 at its size times 20 / 18.5, every Fraunces element is Source Serif 4 at its old size, and Hanken Grotesk and Fragment Mono are unchanged.
- **Weights,** read at 1440: masthead name 540; chapter, view and section titles 400; h4, figure titles and small heads 500; light numbers (`.fc-big`, `.sup-facts-row dd`, `.wk-n`, the year labels and now the scrubber's year) 360. Optical sizing is auto everywhere, with no `opsz`, `SOFT` or `WONK` settings left. The loaded faces are Source Serif 4 300–700, Hanken Grotesk 400–700 and Fragment Mono 400.

**3. The layout sweep.** No sideways scroll, no text under 11 px, no clipped or overlapping text anywhere: 1,362 page loads, 0 with findings (`qa/redesign/sweep-type.txt`).
- `sweep.js` ran at 320, 390, 768, 1024, 1280 and 1440, light and dark, on the views and pages (180 loads), the Glossary set with a term and a country open (48), the doors (408) and every chapter in The Chain and on its readable page (408).
- `sweep.js` only looks for overlaps in the first three screens. So `sweep-full.js` checked every text box on the whole page, at the same six widths (light only), on the 8 views, 5 reference pages, 17 chapters in The Chain and 17 readable chapter pages (282 loads, 0 with findings).
- Of the places the brief named: the card is clean at every width on all 17 chapters. The home hero and evidence strip, Suppliers (by stage and by country), Export Controls and China revenue, the Glossary, and the contents page with every chapter's Next door are all clean. On the phone's slim bar, a long chapter and section ("Chemicals, Gases and Photo… · How it w…" at 320) end in an ellipsis, as before. The specimen strip's caption, now 13 px, clamps at three lines, as before, clear of its buttons.

**4. The chapter PDF.** `python3 build/chapter_pdfs.py lithography --base http://127.0.0.1:8773/ --port 9382` printed 15 pages (14 before) in 36 s. The committed `dist/pdf/lithography.pdf` was copied aside first and put back, so no PDF changed in the repository. `pdffonts` lists only CID TrueType faces: SourceSerif411pt Regular, Medium, SemiBold and Italic, and Hanken Grotesk and Fragment Mono. There is no Type 3, no Fraunces and no Literata (the old file has Fraunces48pt, Fraunces28pt and Literata12pt). Pages 1 to 4 look right: the title block and rail, In plain terms, the card whole on page 2 with its notes at the foot, and the text with notes. The layout report shows no short pages, stranded heads or lost notes.

**5. The share cards.** All 24 drawn again (sizes in the commit; all under the 150 KB limit, the largest 132 KB). On the home card and the Lithography and Foundries cards, set beside the old ones, the title and the line are now Source Serif 4. The line is 27 px (25 before), and the wordmark is the same. The Data Centers card keeps two of its three sentences, as before.

**6. `grep -rn "Fraunces\|Literata" src build`.** 18 lines remain, all comments that record history ("before design round five", "the Literata sizes were…") or explain the scale. The one exception is `build/icons.py`, whose drawn c is Fraunces's by design and stays.

**7. Shots and the art director's review.** The shots are against the finalist sheet (`MAIN/qa/design5/fonts/shots/finalist-1-source-serif.png`) and the redesign before the switch.
- **Matches the sheet.** The text size, the line height, the 666 px column (about 70 characters a line), the title at 400, dark mode and the phone text all match. The sheet shows the opener before the column; this branch has the column.
- **The text.** The type is calmer and narrower than Fraunces. The 400 titles hold in dark mode. The light numbers read clearly at 360.
- **Fixed.** The In plain terms and In short width, which left two right edges in the opener (above), and the scrubber's year weight.
- **Judged and left:**
  - At 1440 the standfirst breaks "…of a chip. It / sold 48 of them in 2025." It broke the same way before; fixing it is a wording matter.
  - Flashcards and Sources run 778 px wide, past the 666 px column, as they did before. That belongs to the opener stage, not to type.
  - The card's price column runs one line longer at 1440 (8 lines against 7), the cost the notes predicted.

**8. AI Chips sizes for the lead** (`src/modules/chips.css` as it stands on this branch; not edited here). Each is set in the text face, so after the merge it becomes `calc(<size> * var(--text-scale))`:

| Line | Selector | Now | Scaled |
|---|---|---|---|
| 36 | `.aic-sub` | 15.5px | 16.76 px |
| 80 | `.aic-spec-cap > p:not(.label)` | 14px | 15.14 px |
| 166 | `.aic-cmp .aic-lede` (its `.aic-tflops` inherits) | 15.5px | 16.76 px |
| 171 | `.aic-pk .cx-sub` | 14px | 15.14 px |
| 244 | `.cx-table td` | 15px | 16.22 px |
| 246 | `.cx-table td.cx-long` | 14px | 15.14 px |
| 264 | `.cx-fns` | 14px | 15.14 px |
| 277 | `.cx-note-body` | 16.5px | 17.84 px |
| 353 | `.cx-table td`, under 760 px | 14.5px | 15.68 px |
| 362 | `.cx-note-body`, under 760 px | 16px | 17.30 px |

Three related points:
- `.aic-cmp-t` (line 165) is a title at weight 350, so it should be 400.
- The em widths on the scaled elements (`.aic-sub` 46em, `.aic-cmp .aic-lede` 38em, `.aic-pk .cx-sub` 46em, `.cx-fns` 60em, `.cx-note-body` 40em) grow 8 percent with the text unless they are divided by `var(--text-scale)`, as `--measure` is.
- `.cxs-x` (line 298), the 16 px "×" in the chip bar, inherits the serif. It is an icon, so it needs no scale, but `font-family: var(--font-ui)` would make it independent of the text face.

## Measured

Each chapter at its address, 1440 wide (`stage-chapters.js` check 8):

| | Before (`6c3ffd2`) | After | Change |
|---|---|---|---|
| Lithography | 15,540 px | 16,233 px | +4.5% |
| Shortest chapter (Component Costs) | 11,949 px | 12,444 px | +4.1% |
| Longest chapter (Who Controls the Chain) | 17,320 px | 18,014 px | +4.0% |
| The whole chain as one page | 227,429 px | 236,834 px | +4.1% |

The notes predicted +3.9%. The Lithography PDF runs 15 pages (14 before).

## Known issues and what was not done

- **The PDFs in `dist/` are still in Fraunces and Literata:** the 17 chapter PDFs, the whole-chain PDF and the summary PDF. Only the Lithography test print was made, and it was not committed. After the merge, run `build/chapter_pdfs.py` for all 17, `build/pdf.py` for the chain and `build/summary_pdf.py`, then build.
- **AI Chips** keeps its Literata sizes until the lead applies item 8 after the merge.
- **8766 has moved on** (new chapter 8 and 9 text). Merging brings that text in; the type change has no part in it. `type-census.js` must then be run against a build of the merge's base, as its note now says.
- **Not checked:**
  - The full-page overlap check ran in light only. The theme changes no sizes, and `sweep.js` ran both themes.
  - Bold italic in the text face is not loaded (italic only at 400), as before with Literata. Whether any text sets bold italic was not checked.
- **Timing flake:** `stage-chapters.js` check 3 (chapter 17's door) failed once in three runs.

## Shots

In `qa/redesign/shots/stage-type/` (gitignored). Remake them with `sh qa/redesign/shots-stage-type.sh` (8773), or with a second argument for another preview:
- 1440: `home-1440`, `lithography-opener-1440`, `lithography-body-1440`, `lithography-card-1440`, `lithography-plain-1440`, `lithography-flashcards-1440`, `lithography-door-1440`, `suppliers-1440`, `export-controls-1440`, `glossary-1440`, `contents-1440`, `page-lithography-1440`
- dark: `lithography-opener-1440-dark`
- phone: `lithography-390`, `lithography-body-390`, `lithography-card-390`, `lithography-door-390`, `home-390`, `home-320`, `chemicals-body-320`, `chemicals-card-320`

Before (8766, Lithography unchanged there), in `qa/redesign/shots/stage-type-before/`: `home-1440`, `lithography-opener-1440`, `lithography-body-1440`, `lithography-card-1440`, `lithography-plain-1440`, `lithography-door-1440` and `lithography-card-390`.
