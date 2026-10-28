# Page revisions 2, 4, 5, 7, 10 and 11, built (28 October 2026)

Branch `redesign-pages`, cut from `redesign` at 5428ddb. Built from `MAIN/qa/design9/BUILD-PAGES.md` and design round nine's page review, `MAIN/qa/design9/site-b/review.md`.
- Revisions 2, 4 and 5 were in the brief.
- The coordinator then added 7, 10 and 11.
- The coordinator then withdrew 9: the chapter addresses are being rebuilt as the full interactive chapter by another agent. Nothing of 9 was built or committed.
- 1, 3, 6 and 8 are not built.

Shots are in `qa/redesign/shots/stage-pages/` (not tracked, as the earlier stages' are). Each before (8766) and after (8778) pair is joined side by side by `qa/redesign/pair-stage-pages.py` as `pair-*.png`.

## What changed

### 2. The phone's strip gives the page back
Files: `src/styles.css`, `src/app.js`, `src/template.html`, `build/build.js`.
- **The collapsed strip** is 64 px. It holds:
  - a 52 px live thumbnail at the left
  - two lines in Hanken Grotesk 13 px: "Specimen 04 · EUV scanner" in ink at 500, over "Tap for the drawing and its parts" in ink-2
  - a Contents pill at the right.
- **What left the strip:** the caption, Top and Expand.
- **A tap anywhere on the strip opens it.** Expand is now a clear button over the whole strip except Contents. Its name is "Open the drawing", so a keyboard reaches it too. Opened, the strip is the sheet it was: the drawing, the caption, the parts list, Contents and Collapse.
- **The wine rule.** A 3 px wine rule on the strip's top edge fills with the share of the chapter read. On home, it fills with the share of the page read.
- **The specimen's name.** The runtime gets the names from `CP_DATA.specimenNames` (`SPECIMEN_NAME` in `build.js`). The laptop's label still names the chapter.
- **Pages with no specimen** have no strip on a phone: Suppliers, Export Controls, Glossary and AI Chips (`data-route="none"` from `Stage.setVisible`). The empty 128 px band is gone.
- **Back to top** shows on phones. It stands 12 px over the strip, or at the foot of a page with no strip. The strip's Top button is removed from the template.
- **The result.** On a chapter at 390, the masthead (76 px), the chapter bar (40 px) and the strip (64 px) keep 180 of 844 px fixed. On a tool page, 76 px.

### 4. The wine bar marks what the title says, and a range is drawn as a range
Files: `build/build.js` (`figure()`, `figMarks`, `spanText`, CSV, table, PNG), `src/modules/chapter.css`, `src/modules/print.css`, `content/04`, `09`, `14`.
- **The chart rule, as the owner amended it.** It is recorded in the comment above `STACK_REST`, where `figure()` applies it. Wine marks:
  - the largest value, by default
  - the value the title names, where it names one (a figure's new `mark` key)
  - the largest change, on a change chart.
- **A row with its own range,** `["High-NA EUV", 350, 400]`, is drawn solid wine to 350, then a hatched wine span to 400 inside a 1.5 px wine outline. It is labeled "$350–400M".
- **A figure's `range` joins rows into one mark.** For 14.4 these are the 2030 low, reference and high cases. The solid part is drawn in the tint and the span in wine, since the title names the span. The reference value is a 2 px ink tick labeled "reference case 649". The rows stay as they are in the Table and the CSV.
- **The marks set:**
  - 04.3 on 2025
  - 09.2 on "HBM4, 2,048-bit"
  - 14.4 on "2030, projected".

### 5. Change is drawn as change
- **The new `columns` type.** Columns run in the data's order, years left to right, on an ink baseline. Each is at most 150 px wide (96 px on a phone), 18 px apart and 190 px at the tallest (150 px on a phone). The value sits over each column in Hanken Grotesk 13.5 px and the label under it. The marked column is wine, with its value bold in wine and its label in ink at 600.
- **The new `change` type.** It reads the data's rows in pairs. Each row has:
  - the firm's name and years ("FY2024 to FY2026")
  - an open circle at the earlier value and an arrow to the later one, on one axis (20 to 50 percent) with hairline ticks through every row
  - "peak" and "latest" named once, on the first row (the figure's `ends`)
  - the change written at the right ("44.4 to 34.1%").

  Wine goes on the largest fall: Tokyo Electron, 10.3 points.
- **The Table and screen-reader table are unchanged.** So is the CSV, apart from 04.2's new third column (below).
- **The PNG export draws all three new forms:** range bars, columns (with the range column and its tick) and change rows.
- **Print** has a rule for each form in `print.css`, with the chart rule on paper: `--accent-fill` for the mark, tint for the rest, hatch and outline for a range.

### 7. `/summary/`: China and the United States at full card width
File: `build/modules/summary-brief.js` (screen CSS only).
- `.sides` is one column. Each note is 15/22.5 px at the card's full width, 14 px apart.
- The boxed tags are now the site's marks:
  - Extreme is a 4 by 13 px wine bar before its word
  - High is a 6 px hollow ink square
  - substitutability is plain ink-2 text in Hanken Grotesk 13 px, with no border.

### 10. Glossary letter heads step below the page title
- `.gl-L` is 40/44 px with -0.01em tracking, where it was 88 px under a 66 px title. On a phone it is 30/34 px, under the 35 px title.
- This is set in `src/modules/lookup.css` (the app) and in `build/assets/reference-page.css` (`/glossary/`), so the two pages match.

### 11. Lines that narrate a visual are cut
These lines were changed exactly as the review's table lists, and no other words:

| Where | Before | After |
|---|---|---|
| Specimen 01 caption (`content/01`) | "The 144 compute tiles fill the center in eight clusters." | cut |
| Specimen 02 caption (`content/02`) | "The wafer standing on its rim is shown in silver." | cut |
| Specimen 04 caption (`content/04`) | "The blue-violet thread is the 13.5 nm light, bouncing mirror to mirror from the violet-white tin plasma at bottom left to the wafer." | "The blue-violet thread is the 13.5 nm light." |
| Specimen 04 caption | "The mask at the top and the wafer at bottom right are drawn about twice their true size." | "The mask and the wafer are drawn about twice their true size." |
| Suppliers, beside the map (`build/modules/summary-a.js`) | "Each numbered stop is one stage of the chain, pinned where a leading firm is based." | cut |
| Export Controls, board header (`src/template.html`) | "The state on the date above. The full key is under the board." | cut |

### Figure note cut (revision 4)
04.2's title (its line under the finding) loses only the clause that explained the bar: "and the High-NA bar shows the low end of an estimated $350-400M range". It now reads "What one lithography system costs. The DUV bar is one figure for the whole segment." The 400 moves from that clause into the data, as the range's high end. No other chapter text changed.

## Every figure touched

None of these figures' numbers, sources or dates changed.

| Figure | Id | Before | After | Wine |
|---|---|---|---|---|
| 03.3 | germanium-price | bars | columns | 2025 (largest, latest) |
| 04.2 | tool-price | bars | bars, High-NA a range $350–400M (the 400 moved from the title into the data) | High-NA EUV |
| 04.3 | euv-shipments | bars, wine on 2023 | columns, `mark` 2025 | 2025 |
| 06.3 | equipment-billings | bars | columns | 2025 |
| 09.2 | hbm-bandwidth | bars, wine on "advanced configurations" | bars, `mark` | HBM4, 2,048-bit |
| 09.4 | hbm-revenue | bars | columns | 2028 |
| 10.3 | cowos-reticles | bars | columns | 2028 |
| 11.2 | abf-layers | bars | columns | AI package, 2026 |
| 12.4 | ase-testers | bars | columns | Q2 2026 |
| 13.2 | nvlink-bandwidth | bars | columns | NVLink 6 (Rubin) |
| 13.3 | switch-bandwidth | bars | columns | Tomahawk 6 |
| 14.3 | turbine-output | bars | columns | 2030 |
| 14.4 | us-dc-electricity | four bars, wine on the high case | columns: 2024, and one "2030, projected" range column, tint to 521, hatched to 843, tick at 649 | the 521 to 843 span |
| 16.2 | china-tool-revenue | eight bars, wine on TEL FY2024 | change rows, circle to arrow | Tokyo Electron's fall, 44.4 to 34.1% |

## Checks

All pass, on the final build (`node build/build.js`, exit 0, no warnings). The outputs are in `qa/redesign/*-pages.txt`, `sweep-pages*.txt` and `check-figs.txt`.

| Check | Result |
|---|---|
| `build/validate.js` | no problems (it now knows `columns` and `change`, and checks `mark`, `range` and pairs) |
| `check-speak` | no matches |
| `check-integrity` | no problems (its China-share check now covers `change` figures too, so 16.2 is still checked against `data/exposure.json`) |
| `check-sources` | 2,817 citations, all tier A or B |
| `check-size` | none over 5.0 MB |
| `check-seo` | 16 chapter pages, 22 sitemap entries, no problems |
| `smoke.js --port 8786` | 36 page loads, no failures |
| `interact-chapter.js` | 90 ok, all passed |
| `stage-chapters.js` | 10 of 10 pass |
| `check-cites.js` | 3,300 marks, 0 problems |
| `interact-suppliers.js` | 65 checks, 0 failed |
| `interact-glossary.js` | 90 checks pass |
| `sweep-full.js`, the ten chapters with a changed figure, 390 and 1440, light and dark | 40 loads, 0 findings |
| `sweep-full.js`, Suppliers, Export Controls, Glossary and home at 390, and the three tool pages in dark | 7 loads, 0 findings |
| `sweep-full.js`, `/summary/` (light and dark), Glossary at 1440, `/glossary/`, chapters 01 and 02, at 390 and 1440 | 12 loads, 0 findings |
| `check-figs.js` (new): every changed figure's marks read back from the page against `content/*.md` | 112 of 112, 0 mismatches |
| `chapter_pdfs.py lithography --port 9344` | 13 pages. 04.2's range and 04.3's columns print, with wine on 48 tools |

**`check-figs.js`** checks the 14 figures. For each one it checks:
- the form drawn
- one mark per data row, or per joined range
- each value, high end and reference against the data
- where the change circle and arrow sit on the axis
- the value text
- that wine is on the expected mark only, by computed colour
- the Table rows and CSV rows against the data
- a PNG export at 1,600 px (saved as `shots/stage-pages/png-*.png`)
- no page errors.

**Tests changed to the new design:**
- `interact-chapter.js`, the phone strip: it now checks 64 px at the foot, the 52 px thumbnail, the two lines in Hanken 13 px, no caption and no Top, Contents in reach, a tap on the words opening the strip, Collapse closing it and the wine rule filling as the page scrolls.
- `interact-chapter.js`, the chart rule: "wine on the largest bar only" became "wine on the marked bar, column or change only", reading a range's wine from its gradient.
- `stage-chapters.js` presses Back to top where it pressed the strip's Top.

**PDFs.** The chapter PDFs whose figures or captions changed were printed again into `dist/pdf/`: 01, 02, 03, 04, 06, 09, 10, 11, 12, 13, 14 and 16. They are on paper with the new forms. The book PDF (`how-ai-chips-are-made.pdf`) and the summary PDF were not printed again. The book still shows the old bars and captions. The summary PDF does not change, since revision 7 is screen only.

## Departures and notes

1. **04.3 and 14.4 are in both revision 4 and revision 5.** Revision 4's proof draws them as rows, and revision 5 lists them as series. Both revisions are built:
   - 04.3 is columns with wine on 2025.
   - 14.4 is columns, with the 2030 range as a column: tint to 521, hatched wine to 843, the ink tick at 649 labeled "reference case 649" beside it.
2. **Column values keep their units** ("$4,100/kg", "48 tools"), as decision 11 has every short unit travel with its value. Revision 5's proof showed "$4,100" without "/kg".
3. **Columns are at most 150 px wide and set from the left,** so a two- or three-column chart does not stretch across the figure. This leaves room for 14.4's reference label. The PNG spaces its columns evenly across the picture.
4. **The 64 px strip applies under 900 px,** the range where the site has a strip at all. The review said under 768 px. Between 768 and 900 px a tablet would otherwise keep the old 128 px strip and the empty band on the tool pages.
5. **The strip's second line.** Only Lithography has numbered parts. Every other drawing's strip reads "Tap for the full drawing", where "and its parts" would be untrue.
6. **The pause button.** The turn's pause (WCAG 2.2.2) shows in the opened strip only, one tap away. The 64 px strip has no room for it beside the thumbnail. The choice is still kept on the device.
7. **04.2's line keeps its own words.** Only the clause about the range was cut. The proof also reworded the rest ("The DUV figure covers the whole segment"). That wording was not taken, since the brief allows only the range note to change.
8. **01.3 is not changed.** Its title says "at least 55 percent" and wine sits on 90. The review said it "deserves a look". It is outside the four charts the brief names, so it is left for the owner.
9. **The glossary letter heads on a phone** are 30/34 px, under the phone's 35 px title. The review gave only the 40/44 px desktop size. The same sizes are set on `/glossary/`, which loads `reference-page.css`, so it matches the app.
10. **A print fix revision 11 needed.** The shorter Specimen 04 caption moved Lithography's first footnote call to the foot of page 1. Paged.js then dropped seven lines of In plain terms, and `chapter_pdfs.py` refused the file. Setting the lines closer (the existing remedy) did not help. `build/pdf.py` now tries once more with that chapter's lines a little looser (`nudge` 2, `print.js` `.cp-loose`, `print.css`, line-height 1.55 where `.cp-nudge` is 1.45). Lithography then prints with no lost lines.
11. **Revision 9** was withdrawn before any of it was built. Nothing of it is in this branch.
12. **The "before" server.** It serves `chokepoints-redesign` at 5428ddb, which has uncommitted local edits (its tab reads "Supply Chain"). The before shots show those edits. The after shots are this branch.
13. **No figure's numbers, sources or dates changed.** 04.2's 400 moved from the title's clause into the data as the range's high end. The CSV gains a "High end of range ($M)" column for that row.
