# Type review (design round two, 23 October 2026)

Lens: typography on screen and in the PDFs, and, after the owner's message, the type system itself. Shots are in `qa/design2/shots/type/`. Directions and their CSS are in `qa/design2/shots/type/directions/`. All paths below are relative to `qa/design2/shots/type/`. Ports used: 10410 to 10419. No repo file was edited except this report and the shots folder.

## 1. Verdict

The ledger is a serious, literate system, and its reading text is well set. Source Serif 4 at 18.5 px on 1.58 leading, at a measure of 75 to 79 characters (measured on Lithography at 1440), with headings in Fraunces, puts the site in the company of good university-press web editions. The type scale from round one holds. Where it falls short of the best book and data typography is the finish, not the voice. Paragraphs end on one word (53 of 456 at 1440, 95 at 390). Numbers come apart from their units at line ends (90 of 910 pairs at 1440, 166 at 390). A comma or period can start a line after a glossary term on a phone. Ranges are set with hyphens. One Fraunces optical size (48) is used for heads from 15 to 62 px, so the small heads are drawn as display type. The footnote marks stand before the punctuation, against book practice. The site also loads five families (310 KB of Latin font files) where three do the work: Jost sets 370 characters (the specimen plate) and IBM Plex Mono sets a few dates. As a system, I would keep the ledger. A serif reading voice is right for a reference that is read and studied. Of the alternatives, a one-family grotesque system (direction C) is the strongest if the owner wants a change. It costs a third of today's font bytes and suits the data pages best. All three alternatives replace all three current faces, or nearly so, and each is shown on the brief's fixed screens.

## 2. The type system: four directions

Each direction is one CSS override file. Apply it by replacing the template's font link with the file's `@import` and appending the rules. The fixed screens for each are `directions/<name>/`: `home-1440.png`, `litho-open-1440.png`, `litho-chart-1440.png`, `suppliers-1440.png`, `home-390.png`, `litho-390.png`, `dark-chart-1440.png`, plus the PDF opener `pdf-opener-p1.png` and `pdf-p2.png` (from `lithography.pdf`, made by `build/pdf.py --chapter lithography` with the CSS injected). The current site on the same screens is `directions/0-current/`. Side-by-side sheets: `directions/sheet-home-1440.png`, `sheet-litho-open-1440.png`, `sheet-litho-chart-1440.png`, `sheet-suppliers-1440.png`, `sheet-dark-chart-1440.png`, `sheet-home-390.png`, `sheet-litho-390.png`, `sheet-pdf-opener.png`. Candidate faces I tried before choosing: `directions/candidates/serif.png`, `sans.png`, `mono.png`.

Download cost is the Latin subset Google Fonts serves for each set of requests, measured in the page (woff2 bytes, all faces the direction requests).

| | Families | Weights and axes | Latin download | Requests (font files) |
|---|---|---|---|---|
| Today | Fraunces, Source Serif 4, Instrument Sans, Jost, IBM Plex Mono | Fraunces opsz 9 to 144, wght 300 to 600; Source Serif opsz 8 to 60, wght 300 to 700, italic 400; Instrument Sans 400 to 700, italic 400; Jost 400; Plex Mono 400, 500 | 310 KB | 8 |
| A. Ledger, refined | Fraunces, Source Serif 4, Instrument Sans | as today, without Instrument Sans italic | 264 KB | 4 |
| B. Monograph | Literata | opsz 7 to 72, wght 300 to 700, italic 400 | 154 KB | 2 |
| C. Newsroom | Archivo | wdth 62 to 125, wght 100 to 900, italic 400 | 103 KB | 2 |
| D. Datasheet | Source Code Pro, Source Serif 4 | Code Pro wght 300 to 600; Source Serif as today | 190 KB | 3 |

A finding that shapes every direction: Google Fonts serves these families without small caps, oldstyle figures or superior figures. I tested `smcp`, `onum` and `sups` on Source Serif 4, Literata and EB Garamond, whose full fonts all have them, and none rendered. True small caps for acronyms such as ASML and EUV, oldstyle figures in prose and real superior note figures would need self-hosted font files. The handoff already lists self-hosting as open.

### A. The ledger, refined (`directions/a-ledger-refined.css`)
- **What changes:** the current voice with the execution fixed. Fraunces follows its own optical size below the page titles, which keep opsz 48. Jost goes, and the plate and caption are set in Instrument Sans. IBM Plex Mono goes: the dates take Instrument Sans tabular figures and the cite block takes the system monospace. `text-wrap: pretty` is on the reading text, and the note marks sit tight.
- **Wordmark:** unchanged.
- **Elsewhere:** the cards (`build/cards.py`) drop Jost from their link and set the plate line in Instrument Sans. `print.js` drops Plex Mono from `PRINT_FONTS` (the PDF's URL lines move to Instrument Sans or the system mono). Charts are unchanged.
- **Ground:** paper, as now.
- **Proof note:** the A PDF was made with the variable faces injected, so its numeral and heads print a little heavier than a real build would. A real build keeps `print.js`'s static instances.

### B. The monograph (`directions/b-monograph-literata.css`)
- **What changes:** one serif does everything, as in a university-press book: titles, text, tabs, labels, tables and numerals. Labels are tracked serif capitals at weight 600. The specimen caption is set in the italic, as a museum label.
- **Why Literata:** it was made for long reading on screens, and it covers Latin, Cyrillic, Greek and Vietnamese, which suits a worldwide readership. It also has a full optical-size axis, so the title at 62 px is its own display drawing.
- **Wordmark:** "Chip Supply Chain" in Literata 650 beside the tile. It loses Fraunces' wedge but stays a serif.
- **Elsewhere:** `print.js` needs static Literata instances, and the cards are re-set. Phone tabs must drop to 12 px to fit 360 px (in the file). A serif label at 10 px is weaker than a sans in the dense data rows (the ledger, Suppliers).
- **Ground:** paper. It is a light-ground direction.

### C. The newsroom (`directions/c-newsroom-archivo.css`)
- **What changes:** one grotesque for everything, as a data desk sets a graphics page. Titles are semi-condensed 700. The text is set at 17 px, normal width, on 1.6 leading. Labels and table heads are semi-condensed capitals. Every figure is tabular and lining. The width axis is the point: long chart labels, table heads and the ledger column fit without a second family.
- **Wordmark:** Archivo 750 at 85 percent width beside the tile. It is the largest identity change of the four.
- **Elsewhere:** `print.js` needs static Archivo instances at two widths. The cards are re-set. The PDF opener holds its 11 pages.
- **Ground:** works on both. It pairs best with a cooler, whiter ground than today's paper if the color critic proposes one (`directions/c-newsroom-archivo/dark-litho-open-1440.png`).
- **What it gives up:** the bookish warmth. It reads as current affairs more than as a book.

### D. The datasheet (`directions/d-datasheet-source.css`)
- **What changes:** the chrome is lettered like an engineering drawing. Titles, labels, numerals, the plate and chart labels are in Source Code Pro. The reading text stays Source Serif 4, from the same Adobe family.
- **Wordmark:** Source Code Pro 600, monospaced.
- **Elsewhere:** monospace runs wide. Chart labels wrap ("EUV, 0.33 / NA" in `litho-chart-1440.png`). The phone home title takes two lines. Phone tabs fit only at 11 px. The PDF grows from 11 to 12 pages.
- **Ground:** this direction works best on the dark ground. With the point-cloud specimens it reads like a CAD viewport (`directions/d-datasheet-source/dark-home-1440.png`, `dark-litho-open-1440.png`). On paper it reads as a developer tool, which policy readers may find cold.

### Recommendation
Keep the ledger and take direction A. The serif reading voice is right for a sourced reference that people study and cite, and the owner chose this identity twice (18 Sept and 20 Oct). Its problems are execution problems, and A fixes them while cutting 46 KB and four font requests. If the owner wants a new system, choose C. It costs a third of today's bytes, has one family to maintain in the site, the PDFs and the cards, and suits the data pages (Suppliers, AI Chips, Export Controls) better than any serif system. Choose B for a book voice at half today's cost. Choose D only together with a dark default from the color critic.

## 3. Proposals

Measurements were taken with `--eval` on the live pages. The scripts force `content-visibility: visible` so every chapter is laid out before counting.

### P1. Broken or confusing

**P1.1 A comma or period starts a line after a glossary term**
- **Type:** Fix.
- **Where:** every chapter, Home and the card. Phones at 320 and 390, light and dark.
- **Wrong:** glossary terms are `<button class="gl-term">`, which lays out as an atomic inline box. The line may break between the button and the punctuation after it, so a line opens with ", a film that changes". At 390, 9 of the 189 terms followed by punctuation wrap their mark to the next line. At 320 it is 7, and at 1440 it is 1.
- **Change:** in `build/build.js` `glossaryWrap()`, keep the term and its trailing punctuation together. Emit `<span class="gl-w"><button class="gl-term" …>photoresist</button>,</span>` for any `[.,;:)]+` that follows a term, and add `.gl-w { white-space: nowrap; }` to `src/styles.css` and `build/assets/chapter-page.css`.
- **Shots:** `p-glpunct-320-before.png`, `p-glpunct-320-after.png`, `p-glpunct-320-pair.png`. Measured after the change: 0 at 320 and at 390.
- **Risk:** none at 320 (the longest term plus a comma is shorter than the column).
- **Touches:** search snippets (they read text, not markup), the static pages and the PDF (same HTML).
- **Size:** S.

**P1.2 Numbers part from their units at line ends**
- **Type:** Fix.
- **Where:** all reading text, the card, the summary PDF. Every width.
- **Wrong:** 90 of the 910 number and unit pairs in The Chain break across lines at 1440 ("3 / nm", "$8 / billion", "95 / percent"), and 166 at 390.
- **Change:** in `build/build.js` `inline()` (and the card and summary fields that skip it), replace the space in `/(\d) (nm|mm|µm|GW|MW|kW|W|GB|TB|TB\/s|GB\/s|percent|billion|million|trillion)\b/g` with U+00A0. Content is unchanged: only the space becomes a no-break space.
- **Proof:** a DOM measurement with the same substitution. Before: 90 at 1440 and 166 at 390 (the counting script is `unitsplit.js`, as described above). After: 0 at both.
- **Risk:** a long figure such as "$2,053,298,171.74 yuan" stays whole. It already does.
- **Touches:** search index (U+00A0 matches as a space in the ranked search), copy and paste (pastes a no-break space).
- **Size:** S.

**P1.3 Number ranges set with a hyphen outside tables**
- **Type:** Fix.
- **Where:** figure titles ("an estimated $350-400M range" on Lithography), card notes, the summary PDF ("55-60%").
- **Wrong:** round one put en dashes in table ranges only. The chapter sources still hold 27 hyphenated ranges ($50-100M, $14-17, $5,700-7,300).
- **Change:** in `inline()`, convert `(\$?\d[\d.,]*)-(\d[\d.,]*)(?=[%MBm]|\b)` to an en dash when both sides are numbers and neither side is a part number (exclude `[A-Z]\d` patterns such as 3A090 and EXE:5200B, and ISO dates). Run the same filter on card fields and `build/modules/summary-brief.js`.
- **Shots:** `p-opsz-fig-before.png`, `p-endash-fig-after.png`, `p-endash-fig-pair.png`.
- **Risk:** low with the exclusions.
- **Touches:** the PDFs and the summary PDF on the next render.
- **Size:** S.

### P2. Clear upgrades

**P2.1 No one-word last lines**
- **Type:** Fix.
- **Where:** all reading text, every width.
- **Wrong:** 53 of 456 chapter paragraphs end on a single word at 1440, and 95 at 390. One example is "chipmaking." alone under the Lithography plain-terms box.
- **Change** (`src/styles.css`, and the same list in `chapter-page.css`):
  ```css
  .prose > p, .prose li, .plain p, .inshort p, .ch-lede, .dek, .plate-status p, .plate-rows dd, .plate-kpis .sub,
  .gl-entry dd p, .fc-why, .anim-cap, .contents-grid .ol, .wk-p, .timeline p, .tl-gist, .stage figcaption { text-wrap: pretty; }
  ```
- **Result:** 53 becomes 4 at 1440, and 95 becomes 7 at 390.
- **Shots:** `p-runt-plain-1440-pair.png` (from `directions/0-current/litho-open-1440.png` and `directions/a-ledger-refined/litho-open-1440.png`).
- **Risk:** none. Browsers without `pretty` wrap as now.
- **Touches:** none.
- **Size:** S.

**P2.2 Fraunces at its own optical size below the page titles**
- **Type:** Fix.
- **Where:** about 900 heads on every route.
- **Wrong:** `--opsz-title` pins opsz 48 on every Fraunces head from 15 px to 62 px, including the 487 Glossary list names (15 px), the 74 board titles (16.5 px) and the figure titles (16.5 px). Opsz 48 is the display drawing: higher contrast, tighter spacing and a smaller eye. At 15 to 21 px it looks pinched beside Source Serif, which already follows its own optical size.
- **Change** (`src/styles.css` `:root`):
  ```css
  --opsz-title: "SOFT" 0, "WONK" 0;
  .ch-title, .view-head h1, .view-head h2, .wk-title, .thesis, .howto h1.howto-title { font-variation-settings: "opsz" 48, "SOFT" 0, "WONK" 0; }
  ```
  With `font-optical-sizing: auto` (already on body), opsz then equals the size in px.
- **Shots:** `p-opsz-fig-pair.png` (the clearest), `p-opsz-glossary-pair.png`, `p-opsz-timeline-pair.png`. Each pair is shot at 2x and 1100 wide.
- **Risk:** none. The 62 px titles keep their look.
- **Touches:** print is unaffected (`print.css` sets `font-variation-settings: normal` and `print.js` loads static opsz 48). A later print pass could add a Fraunces 18 pt instance for the small heads.
- **Size:** S.

**P2.3 Five families down to three**
- **Type:** Decision (the plate's voice changes).
- **Where:** the specimen plate on Home, The Chain and AI Chips. The dates on Export Controls and in the timelines. The cite block.
- **Wrong:** Jost sets 3 elements (370 characters: the plate tag and caption), so a second sans appears beside Instrument Sans in the same view. IBM Plex Mono sets the board's years and the event dates (2,427 characters on Export Controls) and the cite block. Instrument Sans has tabular figures, so the dates align without a monospace. Instrument Sans italic (18 KB) is requested but never shown: every Instrument Sans `em` on screen is set upright (`.cx-plan-name em`, `.sup-detail-h em`).
- **Change:** in `src/template.html`, request only `Fraunces:opsz,wght,SOFT,WONK@9..144,300..600,0,0`, `Source Serif 4:ital,opsz,wght@0,8..60,300..700;1,8..60,400` and `Instrument Sans:wght@400..700`. Set `--font-caption` to Instrument Sans and `.stage .stage-tag` tracking to 0.24em. Set `--font-code` to `ui-monospace, "SF Mono", Menlo, Consolas, monospace`. Add `font-family: var(--font-mono); font-variant-numeric: tabular-nums lining-nums` to `.tl li .d, .timeline .d, .cf-yl, .cf-ys, .cf-yn, .cf-ev-d, .tl-eff`. The full rules are in `directions/a-ledger-refined.css`.
- **Shots:** `p-caption-plate-1440-pair.png`, `p-dates-controls-pair.png`.
- **Saving:** 310 KB becomes 264 KB of Latin fonts, and 8 font files become 4.
- **Risk:** the caption's voice is the owner's. The wording and centering are kept.
- **Touches:** `build/cards.py` (drop Jost, set `.plate-line` in Instrument Sans, re-render the cards), `print.js` `PRINT_FONTS` (drop `IBM+Plex+Mono`), `print.css` `--font-code`.
- **Size:** M (cards and print included).

**P2.4 Note marks after the punctuation, tight to it**
- **Type:** Decision.
- **Where:** every cited sentence on screen and in the PDFs.
- **Wrong:** 1,415 of the 1,514 marks stand before a period or comma ("light¹." in place of "light.¹"). Book and journal practice (Chicago 14.26) puts the mark after the punctuation, where it does not split the word from its stop. The mark also carries 3 px of side room (`margin-left: 1px` plus `padding: 0 1px`), which reads as a space after a figure ("2026 ³").
- **Change:** in `build/build.js` `inline()`, move `([.,;:])` from after a `<sup class="cite">…</sup>` run to before it (dashes and closing quotes stay as they are). Add `sup.cite { margin-left: 0 } sup.cite a { padding: 0 }` to `src/styles.css`. The 24 px target is the `::before` box and stays.
- **Shots:** `p-notemark-1440-before.png`, `p-notemark-1440-after.png`, `p-notemark-pair.png`. The tight spacing alone is also in `p-runt-plain-1440-pair.png`.
- **Risk:** `print.js` writes page footnotes from the same marks and does not depend on their order. Check one chapter PDF.
- **Touches:** the search index (it strips the marks), the card's comma between marks (`sup.cite-sep`).
- **Size:** S.

### P3. Refinements (proved by measurement, or noted for the build)

**P3.1 One house style for magnitudes in short fields**
- **Type:** Decision.
- **Where:** card notes, the Glossary firm card, the summary PDF.
- **Wrong:** the chapter sources spell billions three ways ("$16.7B" 28 times, "$5.8bn" 15, "$175 billion" 175) and millions three ways ("$200M" 20, "$293m" 1, "$75 million" 74). They also mix "percent" (379) and "%" (207). The summary PDF shows them side by side (`pdf/summary-all4.png`, page 3: "$5.8bn", "$293m", "$2.52bn", "$16.7B").
- **Change:** prose spells out "billion", "million" and "percent". Short fields (card notes, chart values, tables) use one short form, "$5.8B", "$293M", "84%". A formatter applies it in the build, and the figures do not change.
- **Proof:** counted, not yet shot.
- **Size:** M.

**P3.2 Self-host the three families**
- **Type:** Decision.
- **What it gives:** real small caps for the acronyms that crowd the prose (ASML, EUV, TSMC, HBM), oldstyle figures if wanted, and superior figures for the note marks. Google Fonts strips all three (tested above).
- **Cost:** about the same bytes, and the fonts move off a third-party host.
- **Size:** L.

**P3.3 Figure titles that run three lines**
- **Type:** Decision.
- **Wrong:** a title such as "What one lithography system costs. The DUV bar is one figure for the whole segment, …" sets a whole note in the 16.5 px display weight (`p-opsz-fig-before.png`).
- **Change:** split at the first sentence. The title stays in Fraunces, and the rest becomes a note line in Source Serif at `--fs-small` in `--ink-2`.
- **Proof:** not shot.
- **Size:** S.

**Also checked:**
- Phone hyphenation (`hyphens: auto` at 640 px and below) changed little. The multi-word glossary buttons cannot break inside, and they are the main cause of the rough phone rag. I would not ship it until P1.1's markup change lands.
- The "How to read a chapter" columns set 17 px type in about 250 px columns, about 28 characters a line (base-chain-1440.png). `--fs-small` would suit them.

**Looked at and left alone:**
- Body measure: 75 to 79 characters at 1440 is the upper end of book practice but right for a reference. The owner widened it on 25 Sept. Phones run about 45.
- Leading and paragraph spacing.
- h3 and h4 (28 and 21 px, balanced), and the 0.1em tracking on the 11 px capitals.
- Tabular lining figures in tables and charts.
- The PDF text setting: Source Serif printed at opsz 12, notes at 7.4 pt, all fonts embedded as TrueType with no Type 3 (`pdffonts`), the stage index and the running heads (`pdf/litho-p001.png`, `pdf/litho-p006.png`, `pdf/book-spread-p35-36.png`).
- The static page (`static-litho-1440.png`, `static-litho-390.png`), which loads only the three families already. Its phone nav wraps "Glossary" to a second row, which is for the layout critic.

## 4. Top five

1. **P1.1** Glossary terms keep their punctuation (9 bad breaks at 390, 0 after). `p-glpunct-320-pair.png`.
2. **P2.1 with P1.2** No one-word last lines (53 to 4 at 1440, 95 to 7 at 390), and no number split from its unit (166 to 0 at 390). `p-runt-plain-1440-pair.png`.
3. **P2.2** Fraunces at its own optical size below the page titles. `p-opsz-fig-pair.png`, `p-opsz-glossary-pair.png`.
4. **P2.3** Five families to three, 310 KB to 264 KB: the plate in Instrument Sans and the dates on tabular figures. `p-caption-plate-1440-pair.png`, `p-dates-controls-pair.png`.
5. **The system:** keep the ledger as direction A, with C as the alternative if the owner wants change. `directions/sheet-litho-open-1440.png`, `directions/sheet-home-1440.png`, `directions/sheet-pdf-opener.png`, and D on dark in `directions/d-datasheet-source/dark-home-1440.png`.
