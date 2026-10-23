# Design round two: layout, grid, spacing and composition (slug `layout`)

Shots are in `qa/design2/shots/layout/`. Paths below are relative to that folder. Each proposal's CSS is saved as one override file in `css/`, the same CSS the after shots were made with. Survey shots are in `survey/`. Every number was measured in headless Chrome with `getBoundingClientRect` and computed styles (WebGL on, ports 10430 to 10439), at 320, 360, 390, 1024, 1440, 1920 and 2560 px. No repo file outside this report and the shots folder was edited.

## 1. Verdict

At 1024 to 1440 px the ledger works. The walk and the chapters share one strict grid: ledger column 88 px, gap 28 px, text edge at 159.2 px at 1440 and 114.7 px at 1024. Every page title sits at y 119. Rules in the text column stop at one measure, 684.5 px. The chokepoint card, figures, tables, flashcards, sources and previous/next all end at that measure. A typographer would sign off on that. The faults come where the grid stops being applied. The masthead and the page never share an edge. At 1440 the tile sits at 40 px and the text at 43.2, and on data pages the icons end at 1400 px while the content ends at 1384. On phones the masthead is at 14 px, the app's text at 18 and the static pages at 16. The Chain page has two left edges: its head and Contents sit at 43 px and its seventeen chapters at 159 px. The spacing scale exists only in name: no rule in any of the nine CSS files reads one of the eight `--sp-*` tokens, and the screen CSS uses 55 different pixel values for margins, paddings and gaps. Past 1440 px the page does not compose. It stretches. At 2560 px the text stays at the left edge with a 768 px void before the specimen, and Export Controls runs its rows 2460 px wide. On a phone, the static chapter pages wrap "Glossary" onto a second masthead row by itself. **On the system itself:** the ledger is the right structure for this subject, because the chain is an ordered list of fifteen numbered stages and the left column carries that order. Keep it, apply it wherever the site numbers the chain (The Chain's Contents does not use it yet), and do not force it onto the data pages, where wide visuals need the full width. The structural change I recommend is a **frame**. Past 1440 px the text column keeps its width, the specimen takes the extra width, and past 1920 px the whole composition centers. It is the one structure missing for the large monitors that policy staff and engineers often read on.

## 2. Proposals

### P1: broken, ugly or confusing

#### P1-1. Static chapter pages on a phone: "Glossary" wraps alone onto a second masthead row
- **Type:** Fix.
- **Where:** every static page (`/lithography/` and the rest, `/summary/`), at 390, 360 and 320 px, both themes.
- **Wrong:** at 390 px the masthead is **127 px** tall, while the app's is 70.2 px. Its five links need 364 px and the row has 363, so the last link drops to a row of its own (The Chain @11, Export Controls ends at 312, Glossary @11 on row two, y 88). At 360 and 320 px the same happens with 12 px type. The comment in `chapter-page.css` says the second line should appear only at 320 px. A reader arriving from search sees this on the first screen of the page.
- **Change** (`build/assets/chapter-page.css`, after the 640 px block; `css/static-masthead.css`). This gives the static strip the app's own phone sizes (styles.css 480 and 380 px rules):
  ```css
  @media (max-width: 640px) {
    .masthead { padding-top: 6px; padding-bottom: 0; }
    .wordmark { min-height: 27px; }
    .masthead nav { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; gap: 0; margin: 2px 0 0 -6px; width: calc(100% + 6px); }
    .masthead nav::-webkit-scrollbar { display: none; }
    .masthead nav a { flex: 0 0 auto; font-size: 11.5px; padding: 6px 6px 9px; border-bottom-width: 2px; }
  }
  @media (max-width: 380px) { .masthead nav a { font-size: 11px; padding: 6px 5px 10px; } }
  @media (max-width: 340px) { .masthead nav { -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent); mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent); } }
  ```
  Measured after: the masthead is 79.4 px at 390, and the strip fits at 390 (364/364) and at 360. At 320 the strip scrolls, as the app's does, and the mask fades its edge.
- **Shots:** `p1-static-masthead-zoom.png` (pairs at 390, 360, 320, before left), and full frames `p1-static-masthead-{390,360,320}-before.png` / `-after.png`.
- **Risk:** low. The current tab's 2 px rule now lies on the hairline, as in the app. Print hides the nav already. **Touches:** all 38 static pages. **Size:** S.

### P2: clear upgrades

#### P2-1. The frame: compose wide screens (structural)
- **Type:** Decision. This changes the composition above 1440 px. Nothing changes at or below 1440.
- **Where:** every route, at 1441 px and wider, both themes.
- **Wrong:** `--col: 63%` keeps scaling. The text is held to its measure, so the extra width becomes empty paper between the text and the specimen. At 1920 the chapter text ends at 844 px and the stage begins at 1210, a 366 px void. At 2560 the text runs from 160 to 845, the stage starts at 1613 and the model is drawn around x 2090. On the home page at 1920, the chain at a glance stretches to 1154 px, so each rating sits 700 px from its name. Data pages go full bleed: at 2560 the Export Controls "Coming up" rows are 2460 px wide and their text ends near 1600.
- **Change** (`src/styles.css`, after the page grid; `css/s1-frame.css`):
  ```css
  @media (min-width: 1441px) { :root { --col: 907px; } }  /* the column keeps its 1440 width; the specimen takes the rest */
  @media (min-width: 1921px) {                               /* past 1920 the page is a centered 1920 px frame */
    #main { display: block; max-width: 1920px; margin: 0 auto; }
    .masthead { padding-left: calc((100% - 1920px) / 2 + 40px); padding-right: calc((100% - 1920px) / 2 + 40px); }
    .stage { right: calc((100% - 1920px) / 2); width: calc(1920px - var(--col)); }
    .wk-rail, .cxs { left: calc((100% - 1920px) / 2); }
    body:has(.stage[data-hidden="0"]) .to-top { right: calc((100% - 1920px) / 2 + 24px); }
  }
  ```
  After, at 1920: the stage runs from 907 to 1920 and the model sits beside the text. At 2560: the wordmark, the text and the specimen sit in one centered frame (320 px of paper on each side), and the masthead keeps the frame's edges. Data pages cap at 1832 px of content.
- **Shots:** `s1-frame-litho-1920-before.png` / `-after.png`, `s1-frame-litho-2560-before.png` / `-after.png`, `s1-frame-home-1920-before.png` / `-after.png`, `s1-frame-home-2560-before.png` / `-after.png`, `s1-frame-controls-2560-before.png` / `-after.png`.
- **Risk:** at 1920 the specimen canvas grows from 710 to 1013 px wide, about 43 percent more pixels to draw. If the speed builder objects, add `.stage { width: min(calc(100% - var(--col)), 860px); }` in the 1441 px block, which keeps a smaller canvas beside the text. The masthead hairline still spans the window. **Touches:** the specimen (speed builder), the walk rail, the AI Chips bar, Back to top. Print is unaffected because print sets `.column` to 100% and hides the stage. **Size:** M (CSS only, plus a pass at 1600, 1920, 2560 and 3440).

#### P2-2. One page edge for the masthead, the page and the static pages
- **Type:** Fix.
- **Where:** all routes, all widths, both themes.
- **Wrong:** the masthead uses `clamp(16px, 3vw, 40px)` and the column uses `clamp(16px, 3vw, 44px)` on the left and `clamp(16px, 4vw, 56px)` on the right. The tile and the title therefore miss by 3.2 px at 1440 (40 / 43.2) and by 4 px at 1920 (40 / 44). On data pages the theme icon ends at 1400 and the page rule ends at 1384, a 16 px step under the bar's right end. On phones the tile sits at 14, the app's text at 18 and the static pages' text at 16. The edges agree only at 1024.
- **Change** (`src/styles.css`; `css/edge.css`):
  ```css
  :root { --edge: clamp(16px, 3vw, 40px); }
  .masthead { padding: 0 var(--edge); }
  .column { padding: 0 var(--edge); }
  .wk-rail, .cxs { padding-left: var(--edge); padding-right: var(--edge); }
  @media (max-width: 900px) {
    :root { --edge: 16px; }
    .masthead { padding: 6px var(--edge) 0; }
    .masthead .theme-toggle { right: var(--edge); }
    .masthead .search-btn { right: calc(var(--edge) + 38px); }
    .column, .cxs { padding: 0 var(--edge); }
  }
  ```
  Measured after: the tile, the title and the rules start at 40 px at 1440, and the page rule ends at 1400 under the icon. On phones the tile and the title both sit at 16 px at 390, 360 and 320, which matches the static pages. The tab strip still fits (358/358 at 390, 328/328 at 360), at 320 it scrolls as before (324/288), and the masthead height is unchanged (70.16 and 70.38 px). No page scrolls sideways.
- **Shots:** `p2-edge-suppliers-1440-zoom.png` (left and right corners, before above), full frames `p2-edge-suppliers-1440-before.png` / `-after.png`, phone `p2-edge-controls-390-before.png` / `-after.png`.
- **Risk:** low. The reading column's box gains 16 px on the right at 1440. The text is held to its measure, so only The Chain's three How-to columns and the Contents grid widen. **Touches:** every page's chrome, and every phone text column (4 px wider). **Size:** S.

#### P2-3. The Chain's head and Contents take the ledger
- **Type:** Decision (structure of one page).
- **Where:** `#/chain`, 901 px and wider.
- **Wrong:** The Chain is the one page that holds both grids. Its title, lede, How to read and Contents start at 43.2 px (30.7 at 1024), and its seventeen chapters start their text at 159.2 (114.7), 116 px (84 px) further in. The reader scrolls from one left edge to the other. Contents is also a third design for the same kind of list. The home page's chain at a glance hangs its numbers in the ledger, Other pages is a 172 px | 1fr ruled table, and Contents is a two-column card grid with the numbers beside the titles.
- **Change** (`src/styles.css`, contents and howto; `css/chain-ledger.css`):
  ```css
  @media (min-width: 901px) {
    .view[data-view="stack"] .howto, .view[data-view="stack"] .contents { margin-left: calc(var(--gutter) + var(--gutter-gap)); }
    .view[data-view="stack"] .contents { border-top: 0; margin-top: 32px; padding-top: 0; }
    .view[data-view="stack"] .contents h2 { padding-top: 14px; border-top: 1px solid var(--ink); }
    .view[data-view="stack"] .contents-grid { display: block; border-bottom: 1px solid var(--line-2); }
    .view[data-view="stack"] .contents-grid .item { position: relative; grid-template-columns: 12.5em minmax(0, 1fr); column-gap: 24px; align-items: baseline; padding: 11px 0 12px; }
    .view[data-view="stack"] .contents-grid .n { position: absolute; top: 15px; left: calc(-1 * (var(--gutter) + var(--gutter-gap))); width: var(--gutter); padding: 0 14px 0 0; text-align: right; }
    .view[data-view="stack"] .contents-grid .t { grid-column: 1; margin: 0; }
    .view[data-view="stack"] .contents-grid .ol { grid-column: 2; }
  }
  @media (min-width: 901px) and (max-width: 1100px) {
    .view[data-view="stack"] .contents-grid .item { grid-template-columns: minmax(0, 1fr); }
    .view[data-view="stack"] .contents-grid .ol { grid-column: 1; margin-top: 3px; }
  }
  ```
  After: the title, the head and every chapter share one text edge at 159.2 px. Each chapter number hangs right-aligned at 117, the edge the chapter numerals below use. Contents becomes one ruled list in the walk's form: title, then its one-liner.
- **Shots:** `p2-chain-ledger-1440-before.png` / `-after.png`, `p2-chain-ledger-1024-before.png` / `-after.png`.
- **Risk:** Contents becomes one column, about 300 px taller at 1440. The How to read columns narrow from 808 to 692 px, so Concentration's paragraph wraps to seven lines. Phones are unchanged. **Touches:** The Chain only. **Size:** S.

#### P2-4. Put the spacing scale to work
- **Type:** Fix (makes round one's P2-7 real; the type half was applied, the spacing half was not).
- **Where:** every chapter, all widths (screen only).
- **Wrong:** `--sp-1` to `--sp-8` are defined, and `grep var(--sp-` finds 0 uses in `src/styles.css`, the seven module files and `chapter-page.css`. The screen CSS uses 55 distinct pixel values for spacing, plus 18 em values. In the chapter head, the three sibling blocks are spaced 26 px (plain terms to In short), 30 px (In short to the card) and 46 px (the card to the text). Figures take 29.6 / 37 px, tables 24 / 29.6, and the end matter 59.2 (flashcards), 51.8 (sources) and 40.7 (previous/next). The eye reads each difference as meaning, but none of them means anything.
- **Change** (`src/styles.css`; `css/rhythm.css`):
  ```css
  @media screen {
    .plain { margin: var(--sp-6) 0; }
    .inshort { margin: 0 0 var(--sp-6); }
    .plate { margin-bottom: var(--sp-7); }
    .chapter-head { margin-bottom: 0; }
    .figure, .table-wrap { margin: var(--sp-6) 0; }
    .review { margin-top: var(--sp-7); }
    .chapter-sources { margin-top: var(--sp-7); }
    .chapter-sources + .prevnext { margin-top: var(--sp-5); }
  }
  ```
  After: 32 px between the head's blocks, 48 px before the text and before the end matter, and 32 px around every figure and table. The rule from now on: block gaps take a token, and inner paddings stay their own.
- **Shots:** `p2-rhythm-litho-1440-pair.png` (before left), full frames `p2-rhythm-litho-1440-before.png` / `-after.png`.
- **Risk:** none to content. Chapters change height by a few pixels, which the `contain-intrinsic-height` estimates absorb. `@media screen` keeps the PDFs as they are (print.css sets its own millimetre margins). **Touches:** every chapter. The walk and the data pages can follow in a second pass. **Size:** S.

### P3: refinements

#### P3-1. The chain at a glance keeps the walk's measure
- **Type:** Fix.
- **Where:** home, 701 px and wider.
- **Wrong:** the glance list runs to the column edge and the walk's text to the measure. At 1440 they end at 851.2 and 843.7 px, a 7.5 px step between two ruled blocks. At 1920 they end at 1153.6 and 844.5, which puts each rating 700 px from its name.
- **Change** (`src/modules/walk.css`; `css/glance-measure.css`): `@media (min-width: 701px) { .wk-gl { max-width: var(--measure); } }`
- **Shots:** `p3-glance-1920-before.png` / `-after.png`.
- **Risk:** none. With P2-1 adopted, only the 7.5 px case remains, and this fixes it. **Size:** S.

#### P3-2. The atlas keeps the page edge, and the fifteen stops fill rows of five
- **Type:** Fix.
- **Where:** Suppliers, the route of one chip, all widths.
- **Wrong:** in one block, the label, the country chips and the map start at 43 px, the "All countries" caption at 57 and the stop cards at 55 (1440). On a phone they start at 18 and 30. The stops wrap 9 + 6 at 1440, which leaves the second row two thirds full.
- **Change** (`src/modules/summary-a.css`; `css/atlas-edge.css`):
  ```css
  .atlas-caption { padding-left: 0; }
  .atlas .sa-strip-stops { padding-left: 0; }
  @media (min-width: 901px) { .atlas .sa-strip-stops { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
  @media (min-width: 1800px) { .atlas .sa-strip-stops { grid-template-columns: repeat(15, minmax(0, 1fr)); } }
  @media (max-width: 900px) { .atlas-bar { padding-left: 0; } .atlas-caption { padding-left: 0; padding-right: 0; } .atlas .sa-strip-stops { padding-left: 0; padding-right: 0; } }
  ```
- **Shots:** `p3-atlas-1440-before.png` / `-after.png`, `p3-atlas-390-before.png` / `-after.png`.
- **Risk:** the strip grows by one row at 901 to 1799 px. Names such as "Chemicals, Gases & Photoresist" now take one or two lines in place of three. **Size:** S.

### Tested and not recommended
- **AI Chips: each chip's package plan under its own slot.** The same chip sits at three x positions on one page: slots at 43 / 248 / 453, plans at 45 / 283 / 483, and table columns at 163 / 393 / 622 (1440, three chips). Putting the plans on the slots' grid (`css/chips-plans-grid.css`) aligns them at 1440 (43 / 248 / 453). It also makes plans overlap, because they are drawn at one physical scale: the B200 plan is 218 px wide in a 193 px column, and at 1024 the plans overlap further. One scale matters more than the alignment, so leave the slots as the owner approved them. Shots: `p3-plans-1440-before.png` / `-after.png`, `p3-plans-1024-before.png` / `-after.png`.

### Noted, not proved (no before and after yet)
- **Phone first screens:** the home title sits at y 101 at 390, and every other page title at y 134. `.view-head` and `.howto` take `clamp(36px, 7vh, 72px)` = 59 px of top padding against the walk's 26. Matching the walk under 900 px would give each data page 33 px more of its first screen. On laptops all titles already share y 119.
- **Static chapter pages beside the app:** at 1440 they center a 574 px column (text at 433 to 1007), set the title at y 159.6 in 60 px (the app uses y 119 and 62 px) and show no ledger. A reader who taps "Open the interactive chapter" lands on a different grid. A second structural option is to give the static pages the app's ledger grid (the number and the stage strip in the left column). I did not prove it.
- **Glossary at 1440:** a 280 px list, a 760 px pane (357 to 1117) and 267 px unused on the right. The dashed "Try" box is the only dashed frame in a resting state outside AI Chips' optional slot.

## 3. Top five
1. **P2-1, the frame:** compose wide screens; past 1920 the page centers. `s1-frame-litho-2560-before.png` / `-after.png`, `s1-frame-litho-1920-before.png` / `-after.png`, `s1-frame-home-2560-*`, `s1-frame-controls-2560-*`.
2. **P1-1, the static masthead on phones:** 127 to 79 px tall, one row. `p1-static-masthead-zoom.png`, `p1-static-masthead-390-before.png` / `-after.png`.
3. **P2-2, one page edge:** the tile, the title and the rules on one line at every width, 16 px on phones everywhere. `p2-edge-suppliers-1440-zoom.png`, `p2-edge-controls-390-before.png` / `-after.png`.
4. **P2-3, The Chain on the ledger:** one text edge on the page, chapter numbers in the ledger column. `p2-chain-ledger-1440-before.png` / `-after.png`, `p2-chain-ledger-1024-before.png` / `-after.png`.
5. **P2-4, the spacing tokens in use:** 32 / 48 / 32 in place of eleven different gaps. `p2-rhythm-litho-1440-pair.png`.
