# Redesign, stage 3: the other views

Branch `redesign` in the build checkout. Built to `qa/redesign/BRIEF.md` (main checkout), the lead's stage 3 list, the hybrid mockup's `suppliers.html`, review image `r6-critical-only.png`, and the stage 2 review (`qa/redesign/review-stage-2.md`, main checkout). AI Chips and Glossary are not started: they wait for the lead to name the owner's choice among the options in `qa/design4/`.

## What was built

### Suppliers (`src/template.html`, `src/app.js` Suppliers, `src/modules/suppliers.css`, `build/modules/summary-a.js`, `src/modules/summary-a.css` and `.js`)

The page now reads top to bottom: the title, the route of one chip, the ribbons, then every firm.

- **The head.** "Suppliers" in Fraunces 350 at display size over its standfirst, with four counts beside it over an ink rule, all computed from `data/suppliers.json` at build time: 226 firms, 18 countries, 20 segments, 28 Critical (the last with its red wine mark). The head is a shared component (`.view-head.vh`) that Export Controls also uses.
- **The route of one chip** comes first. It has a Fraunces heading over an ink rule and a mono line, "The 15 stages of the chain, each pinned where a leading firm is based". The country buttons are pills, and a pressed one fills black. The map sits on white with the land in a light tint, and the stale marker leader lines are gone. Each stop is a numbered disc: solid ink for a stage rated Extreme, an ink ring for High, as the key beside the map says ("Stage rated Extreme", "Stage rated High"). A chosen country keeps its stops and names their towns, and the other stops shrink to small gray dots, so no town name sits beside another country's numbered stop. The panel beside the map now carries the country's meta and role line ("leads four stages, two of them extreme", "Wafers, photoresist, masks and etch tools, which every fab needs"), which used to sit in a caption bar above the map. With nothing chosen, the panel heading is "All countries". The panel's share bars are a gray tint, not wine, and a stage's band is a mark and a word, no longer a black box. The strip of fifteen stops runs under the map, each with its band's mark.
- **Stops 10 and 12 no longer overlap.** The build pushes the stops apart (`summary-a.js`) until no two stop boxes meet on the narrowest map that numbers them (690 px wide, a 768 px window). Each moved stop keeps a line back to its town. Under 761 px the stops are dots, as before. The town labels are re-solved for the new stop size, with no warnings. `interact-suppliers.js` measures no overlap at 768, 1024, 1200, 1280 or 1440.
- **The ribbons, open on the page** ("Which countries supply which segments"):
  - The firms rated Critical are red wine, and every other ribbon is gray. Country nodes are ink, with no hue for any country, so the country color key is gone.
  - Buttons beside the drawing follow a country's ribbons (Choose a country to follow its ribbons). A pressed button fills black, the country's other ribbons turn dark gray, its Critical ribbons stay wine, and the rest fade, as in r6. Pressing it again lets go. A country chosen on the route presses the same button.
  - The EU-27 switch (Each country, EU-27 together) is a pill switch. EU-27 draws one column, lights it and puts `group=eu` in the address.
  - Beside the drawing: the key ("Firms on the list, by headquarters", "Of them, firms rated Critical") and the mockup's line that the list is a selection.
  - Under the drawing: today's full ribbon note, word for word (Siemens EDA under the US and its EDA share under Germany, Linde under the UK, the Emerging Technology Observatory comparison).
  - The hover tips and the keyboard walk over the segments work as before.
- **Every firm**, under three tabs:
  - **By segment** is today's ladder, thinnest segment first, laid out as in the mockup: number, name with its Critical marks, then the names.
  - **By country** is new. It lists the 18 countries, most firms first, each firm with its segment beside it, and each name opens its panel as on the ladder.
  - **Table** is today's detailed table, sortable, with the column renamed Segment.
  - Search, the country filter, the chokepoint level filter, Copy table and "All segments" (it clears a segment picked on the ribbons) work on every tab.
  - The address follows the tab without adding history: `#/suppliers`, `?tab=country`, `?tab=table`. A saved Table choice is kept.
- **Segments.** The list's twenty categories are "segments" everywhere on the page and on `/suppliers/`: "Segments by number of firms, fewest first", "All segments", "Which countries supply which segments", the tips, the table head, the reference page's facts, its interactive-page note and its dataset description. The route's numbered stops stay "stages".
- **Addresses.** The Glossary's EU-27 link now reads `#/suppliers?group=eu`. The old `#/suppliers?tab=country&group=eu` still draws the EU as one and lands on the ribbons. `#/suppliers?country=JP` still chooses Japan on the route.

### Export Controls and China revenue share (`src/modules/controls.css`, `src/styles.css`, `src/app.js` renderUpcoming)

Today's deadline-first layout, restyled:

- the title and standfirst as Suppliers', then the two sub-tabs in Hanken, the current one on a wine rule;
- "Coming up" as its own section under a Fraunces heading, in classes in place of inline styles: the date and days to go in Fragment Mono (ink within a month, gray after), the event in Literata, and Entry as a link;
- the timeline's filters as pill chips;
- the year label in Fraunces 350.

No data value takes the accent:

- the board's states rise from a hairline (No license) through a light dash (Restricted) and an ink dash (Case by case) to a solid ink outline (Presumption of denial) and an ink fill (Prohibited);
- the board's scale, the closed rows' line and dot, the year shown, its count bar and the playhead are ink;
- the five kinds of move are words, never hues, so China is no longer red.

On China revenue share, each firm's peak year is ink and the other years are the light tint (rule B), the peak's label is bold, the key matches, and the table's tint is gray.

### The Chain's top (`src/modules/chapter.css`, `build/build.js` contents)

- "The Chain" sits on the chapter grid in Fraunces 350, with its standfirst to column 8.
- How to read a chapter is a section under an ink rule, with the three scales side by side as headed columns.
- The download buttons are pills, with "Read the summary online" as a link.
- The contents run three to a row. Each entry has its number with the stage's band as a mark (a key, Extreme and High, sits beside the group label), its title in Fraunces and its one line in Literata.

### The walk, the summary page and the reference pages

- **The walk** (Start here) already carried the new type and marks from stage 1, and it shares the chapter's kicker and band mark, so it is unchanged here.
- **The summary page** (`build/modules/summary-brief.js`, screen layout only; the print layout and the PDF are stage 4's):
  - the head as the views' and pill buttons in ink, with "Download the PDF" in ink, not wine;
  - each section under a Fraunces heading over an ink rule;
  - no accent on a data value: "8 of 15" in bold ink, Extreme's meter and word in ink, and a card's top rule ink for Extreme and gray for High;
  - "Extreme concentration" as a solid ink outline;
  - stage numbers in mono gray.
- **The four reference pages** (`build/assets/reference-page.css`):
  - the title in Fraunces 350 at display size;
  - each section heading over an ink rule;
  - Presumption of denial as a solid ink outline, not wine;
  - a firm's peak China share in bold ink with an ink underline.

### Shared chart rules (rule B)

The site-wide bar rules (`.hb`, in `src/styles.css` and `build/assets/chapter-page.css`) now draw the largest value in ink with a bold label and the rest in `--ctx`. A stacked bar's largest share is ink. The chapter figures already did this from stage 2.

### Two decisions from stage 2

- **Citation marks in reading order.** The card now opens the chapter, so `readingOrderCites` in `build/build.js` numbers the card's sources first, then In plain terms, In short and the text. Each mark still takes its number from its own address, so every mark links to its source, and each chapter's source list follows the new order. Lithography's card now reads 1, 2, 3, ... `qa/redesign/check-cites.js` checks every chapter in The Chain and on its readable page: 3,372 marks, each first seen in order and each pointing at the source with its number, with no problems. The chapter PDFs still carry the old numbers until the lead makes them again.
- **The readable pages' rail marks the section in view** with a small script (`RAIL_JS` in `build/modules/social.js`). It uses the app's rule: the last section whose top has passed 30 percent of the window takes `aria-current`, drawn as the wine rule.

### The stage 2 review's fixes (`qa/redesign/review-stage-2.md`)

1. **Every stage at every width.**
   - Under 1200 px a readable page keeps The chain as a row of numbered cells with each band's mark: 15 stages, then 16 and 17, the current one ringed in wine, and each chapter's name in its link's label.
   - `/lithography/` now links all 17 chapters on screen at 390, 1024 and 1440.
2. **Numbers on the phone's drawing.** Expanded, the phone's strip draws Lithography's four balloons as numbers alone, over the live drawing (`Stage.stripBalloons`). The list under the caption names them, and collapsed, the strip shows none.
3. **The phone's card.** In The Chain each chapter keeps its paint inside its box, so the card no longer bleeds there. It stays in the column with 18 px of padding inside its tint. The readable page keeps its bleed.
4. **Cite no longer squeezes the actions.** Cite, Table, CSV and PNG keep their place at the right of the strip's first line, and an opened citation runs the full width under them, in the app as on the readable page.
5. **The lesser items:**
   - the strip's actions sit beside the source and the address instead of wrapping under them;
   - the still's balloon names are set to 14 px on screen by the readable page's script, as the app sets them (without scripts they keep the drawn size);
   - section kickers read "05 · The chokepoint" (the heading's own words, carried as `data-k`);
   - see the next item for `/geopolitics/`.
6. **Every readable page opens on a drawing.** `qa/redesign/stills.js` shot each chapter's live specimen from the app, at the angle it opens on and at twice the pixels, then trimmed and saved it to `build/assets/specimens/<id>.webp` (16 files, 1.5 MB in all, 28 to 153 KB each). The readable pages show the still in the drawing's columns, with the caption flush left beside it and no rule. Chapters 16 and 17 keep their night plate. In dark mode the light stills turn light-on-dark, as Lithography's annotated still does.

`qa/redesign/interact-review2.js` drives all of these (16 checks, all pass).

## QA gates

| Gate | Result |
| --- | --- |
| 1. `node build/build.js` | Passes with no warnings (none in MAIN's build either). The new stop solver and label solver warn if two stops touch or two town labels overlap; neither fires. |
| 2. `check-speak`, `check-integrity`, `check-sources`, `check-size` | All four pass. check-speak finds no matches. check-integrity finds no problems (17 chapters; the deposition card's year note is the same in MAIN). check-sources: 2,851 citations, all tier A or B. check-size: no file over 5 MB. |
| 3. `node qa/scripts/smoke.js --port 9581` | Passes: 33 page loads, no failures. `LIGHT_GROUND` stays white from stage 1. SMOKE_NOTE |
| 4. Text census (`qa/redesign/census.js --nocites`) | No text lost beyond what the decisions require. The comparison is MAIN's build on 8765 (main at a3e52b0, the same content as this branch) against 8766, output `qa/redesign/census-stage-3.txt`. `--nocites` reads the citation marks out of both sides, since they are renumbered; `check-cites.js` checks them. Stage 3's own changes are isolated by comparing stage 2's committed build (c9f95cb) with this one, output `qa/redesign/census-stage-3-vs-2.txt`. The stage 1 and 2 differences stand as listed in their reports. Stage 3's are listed below. |
| 5. Layout sweep (`qa/redesign/sweep.js`) | The stage 1 set, output `qa/redesign/sweep-stage-3.txt`: 180 loads (the 8 views, 2 chapter pages, the summary and the 4 reference pages, at 320, 390, 768, 1024, 1280 and 1440 px, light and dark). No findings: no sideways scroll, no text under 11 px, no clipped or overlapping text, and a focus mark on each of 7,175 Tab stops. The Suppliers route's 10 and 12 overlap, a finding in stages 1 and 2, is gone. CHAPTER_SWEEP Screenshots then confirmed the pages at every width (shot list below). |
| 6. Look | All 83 shots listed below were compared with `hybrid/suppliers.html` and its shots, `r6-critical-only.png` and the stage 2 review's shots. Fixed after review: town names beside another country's stop, now dots; a stray leader line turning wine beside Japan; the full ribbon note making the side column twice the drawing's height, now under the drawing; the route key below a tall gap, now above the panel; "Export Controls" breaking over two lines at 1440; "Santa Clara" leaving "· US" alone on a line; the phone's country buttons wrapping inside their pills; "Other 27" cut off at the phone ribbons' left edge; a figure's source strip clipped at its edges on a phone in The Chain, as the card was. |
| 7. This report | Committed. |

Also run, all passing:

- `qa/redesign/interact-suppliers.js`, 65 checks. They cover:
  - no stop overlap at 768, 1024, 1200, 1280 and 1440;
  - the order of the page and the four counts;
  - the ribbons' wine, gray and dark gray, and the button that fills black;
  - the route's country pressing the same button;
  - EU-27 and back, with the address;
  - all three tabs and their addresses, the By country panel, the filters on every tab, and a segment picked on the ribbons;
  - the old EU-27 address and `?country=JP`.
- `qa/redesign/interact-review2.js`, 16 checks: the stage 2 review's fixes and the readable pages' rail.
- `qa/redesign/check-cites.js`: 3,372 marks, all in reading order, none pointing at the wrong source.
- Stage 2's `interact-chapter.js` (46 checks) and stage 1's `interact.js` still pass.

## Census differences

Only these views and pages differ from stage 2's build. The rest match it line for line.

1. **Suppliers (`#/suppliers`).**
   - Lost, each for a reason the decisions give:
     - "What each country makes", the route's hidden heading. The visible heading "The route of one chip" names the section now.
     - "All countries Choose one to light its stops on the route", the caption bar over the map. Its role line and meta moved into each country's panel. With no country chosen, the panel says "All countries", and its own sentence already says "Choose a country to see what it makes and which stages it leads".
     - "No country chosen", now "All countries", as in the mockup.
     - "By stage", now "By segment".
     - "Ladder", the layout switch. The ladder is the By segment tab and the table is the Table tab.
     - "Stages by number of firms, fewest first", now "Segments by number of firms, fewest first".
     - The key's "·" separators.
   - Added:
     - the four counts (226 firms, 18 countries, 20 segments, 28 Critical);
     - the route's line "The 15 stages of the chain, each pinned where a leading firm is based";
     - its key "Stage rated Extreme" and "Stage rated High", with sample stop numbers 1 and 2;
     - the whole ribbons section, which was on the By country tab and is now open on the page: its heading "Which countries supply which segments", the switch, the 28 node labels, the key ("Firms on the list, by headquarters", "Of them, firms rated Critical"), "Choose a country to follow its ribbons" with its eight buttons, the mockup's sentence "The list is a selection of the main suppliers in each segment, so a ribbon's width counts firms on this list and says nothing about market share", and today's full note, word for word;
     - the tabs "By segment", "By country" and "Table".
2. **Suppliers, By country (`#/suppliers?tab=country`).**
   - This address now opens the new By country list: 18 countries, most firms first, every firm with its segment. The ribbons above it are the same as on `#/suppliers`.
   - Lost: the lines in item 1, plus "Which countries supply which stages" (now "segments") and the old legend's last item, "Critical firmsRibbon width is the number of firms a country has at a stage." The new key's "Of them, firms rated Critical" and the selection sentence replace it.
   - The old legend's country names still show as the drawing's labels and its buttons, so the census finds them all.
3. **The Chain (`#/chain`).**
   - How to read a chapter sets each scale's name on its own line ("Concentration." over "How many firms could supply the stage today..."), with no word changed.
   - The contents add the key "Extreme" and "High".
4. **`/suppliers/`.**
   - "20 stages" is now "20 segments".
   - The note about the interactive page now says "which countries supply which segments".
   - The jump list's label is now "Segments by number of firms, fewest first".
5. **Readable chapter pages.**
   - No line changes at 1440.
   - The new stills carry alt text only ("EUV scanner, the chapter's specimen").
   - Under 1200 px The chain shows its cells, whose numbers are the visible text, with each chapter's name in the link's label.
6. **No differences** beyond stage 1's letter case: Export Controls, China revenue share, the summary page, `/export-controls/`, `/chips/`, `/glossary/`, the home, AI Chips and the Glossary. The countdown's words and the board's key are unchanged.

The citation marks are renumbered in reading order: every chapter's numbers and its source list's order change, and no source is added or lost (`check-cites.js`).

## Known issues and open questions

- **AI Chips and Glossary are not started.** They wait for the lead to name the owner's choice among `MAIN/qa/design4/ai-chips/` and `MAIN/qa/design4/glossary/`. Both pages are as stage 2 left them.
- **The PDFs.**
  - The chapter PDFs and the whole-chain book still number the citations in the old order, and the summary PDF keeps the old design.
  - They were not regenerated (stage 4, then the lead).
- **Choices the brief left open:**
  - **The ladder's order.** The mockup lists segments in the list's own order. I kept today's thinnest-first order, which is the ladder's point ("Segments by number of firms, fewest first"). It is one constant if the owner wants the list's order.
  - **By country is new**, since the mockup draws only By segment. It lists countries with the most firms first, and each firm's segment follows its name, as each firm's country code does on By segment.
  - **The country buttons.** They fill black on the route as well as over the ribbons, so one control looks the same twice on the page. The mockup filled the route's buttons with the accent.
  - **A chosen country's stops** keep their solid or ring style. The others become small gray dots, not gray numbered discs as in the mockup, because the discs left town names beside the wrong stops in East Asia.
  - **The ribbons' old legend line** ("Ribbon width is the number of firms a country has at a stage.") gave way to the mockup's selection sentence. Today's full note is kept word for word under the drawing.
  - **The mockup's "Reference · Updated" kicker** over the Suppliers title was not added.
- **The stills** are shot from the app at the angle each specimen opens on (SwiftShader in headless Chrome) and trimmed automatically. If a specimen's drawing changes, run `node qa/redesign/stills.js` again (and `--only <id>` for one). Lithography keeps the hybrid's annotated still.
- **The walk (Start here)** needed nothing new beyond stage 1. It already shares the chapter's kicker, band mark and type.
- **Page dates.** Every Updated day is put back with `qa/redesign/keep-dates.js c9f95cb` before each commit, since `content/` and `data/` did not change. Only `/suppliers/` had moved, for the segments wording.

## Shot list

In `qa/redesign/shots/stage-3/` (not committed; remake with `sh qa/redesign/shots-stage-3.sh`), from 127.0.0.1:8766 with the faces loaded and 1.5 s after any scroll or press, each at 1440 and 390 unless named:

- **Suppliers:**
  - `sup-top`, `sup-route`, and `sup-route-jp` (Japan chosen);
  - `sup-flow`, `sup-flow-jp` (Japan's button pressed) and `sup-flow-eu`;
  - `sup-segment`, `sup-country` and `sup-table`;
  - also `sup-route-1024`, `sup-route-1280`, `sup-flow-768`, `sup-route-1440-dark` (Taiwan chosen) and `sup-flow-1440-dark` (Japan pressed).
- **Export Controls:** `ec-top` (the countdown), `ec-board` (By date), `ec-subject`, `exposure` and `exposure-panels`; also `ec-board-1440-dark` and `exposure-1440-dark`.
- **The Chain's top:** `chain-top` and `chain-contents`, plus `chain-top-1440-dark`.
- **The walk:** `walk` (step 04).
- **Summary:** `summary`, `summary-glance` and `summary-cards`, plus `summary-1440-dark`.
- **Reference pages:** `ref-suppliers`, `ref-export-controls`, `ref-chips` and `ref-glossary`.
- **The stage 2 review's fixes:**
  - `chain-litho-fig-cite` (Cite open);
  - `page-litho-spec` (the names at 14 px) and `page-geo-spec` (the globe on its night plate);
  - `page-<chapter>-spec-1440` for the 15 other chapters' stills, plus `page-mem-spec-1440-dark`;
  - `page-litho-rail-1024` and `page-litho-rail-390` (The chain's cells);
  - `chain-litho-card-390` (the card's padding);
  - `chain-litho-strip-390` (the strip's numbered balloons).
