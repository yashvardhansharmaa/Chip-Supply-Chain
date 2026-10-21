# Design review: the PDFs and the share cards (design-print)

Reviewer: book designer and typographer. Surfaces: the Chain PDF (`dist/chip-supply-chain-the-chain.pdf`, 175 pages), the 17 chapter PDFs (`dist/pdf/<id>.pdf`), the four-page summary (`dist/chip-supply-chain-summary.pdf`), and the 24 share cards (`build/assets/cards/*.png`). Stage one: review only. No repo file outside `qa/design/` was edited.

## Verdict

The print system is far better engineered than most reports of its kind. Real page-foot notes, numbered in reading order and sorted on each page, a source list with full addresses, a layout loop that re-sets cards and moves figures, and (since the font fix tonight) copyable TrueType text. The body type is right: Source Serif 4 at its 12 pt optical size, 10 pt on 14.5 pt, with garnet calls and hung note numbers. The cover is a genuine cover. What lets it down is the place every reader looks first. Each chapter opens with the running head jammed above the title, the title at the top margin, the two summary boxes indented 5 mm off the title's edge by padding left over from an older design, and a hole of about a sixth of the page under In short because the card cannot fit. The contents page has a ragged title column, letterspaced lowercase and folios that float above their lines. The colophon looks like a web footer. Three share cards and three charts have outright faults: the "Moderately hard to substitute" tag runs out of its column into the specimen on 8 cards, and three stacked bars give two categories the same color. The ledger's own signature, the fifteen-stage column at the left edge, never reaches paper. None of this needs a new idea, only the press's discipline applied to what is there. The book then has a true chapter opening, and the PDFs match the site's identity.

Method: every "before" below was rendered from the current source with `build/pdf.py` (after the font agent's changes; page counts and text match the files now in `dist/`, re-read at 23:53), and every "after" from the same command with the proposal injected through `pdf.py --eval` (prototype in my scratchpad: one CSS block plus thin wrappers round `CP_PRINT.prepare()` and `finish()`). The summary was printed through `build/summary_pdf.py` with one extra script; the cards through `build/cards.py` into a scratch folder. Shots: `qa/design/shots/design-print/`.

Whole-book effect of P1-4 plus P2 (all chapters, `--edition 2026-10-20`): 175 pages to 173; layout gap (white left on pages, as print.js measures it) 14.9 pages to 13.3; short pages flagged by finish() 2 to 0; the largest blank band on a chapter opener averages 16 percent of the page before and 8 percent after, sink included.

---

## P1: broken, ugly or confusing

### P1-1. Share cards: the substitutability tag runs into the specimen
- **Where:** `build/assets/cards/` for every stage rated Moderate: silicon-and-wafers, chemicals-gases-and-photoresist, deposition-and-etch, metrology-and-inspection, advanced-packaging, test-and-assembly, systems-and-networking, data-centers-and-power.
- **Wrong:** "MODERATELY HARD TO SUBSTITUTE" at 15 px tracked capitals is about 330 px. With the first tag the row is about 550 px in a 500 px column, and the tags are `white-space: nowrap` in a flex row that cannot wrap, so the second tag ends near x = 622, past the art box's left edge (x = 564). On test-and-assembly, advanced-packaging and systems-and-networking the specimen's points run through the tag. FIT_JS never sees it: it checks the title's width and the column's height, not the tags.
- **Change** (`build/cards.py`, TEMPLATE): set the tags in sentence case, untracked, so both fit on one row in the column.
  ```css
  .tags { display: flex; flex: none; flex-wrap: wrap; gap: 8px 10px; margin: 30px 0 0; padding: 0; list-style: none; }
  .tags li { font-family: var(--label); font-weight: 500; font-size: 16.5px; letter-spacing: 0; text-transform: none; line-height: 1.2;
             padding: 6px 10px 7px; border: 1px solid var(--accent); color: var(--accent); white-space: nowrap; }
  ```
  And in FIT_JS add a guard so a future tag cannot cross the column: `const tagsWide = () => { const u = document.querySelector('.tags'); return !!u && [...u.children].some((li) => li.getBoundingClientRect().right > u.getBoundingClientRect().right + 1); };` reported as `over`.
- **Shots:** `card-test-and-assembly-before.png` / `-after.png`, `card-advanced-packaging-*`, `card-systems-and-networking-*`, `card-data-centers-and-power-*`. Titles keep their size: the fit script reports 102 px (data centers 86 px) before and after, and a before-render through the same runner is pixel-identical to the committed cards.
- **Risk:** none for layout; re-run `python3 build/cards.py` on its own. Touches social unfurls only.

### P1-2. Stacked bars give two categories one color
- **Where:** ch 4 "ASML net system sales by the region tools shipped to, 2025" (United States and Rest of Asia both `--c1` blue); ch 2 `wafer-concentration` (Europe and Other both `--c8`); ch 7 `pc-share` (ten firms on eight colors: KLA and Rigaku `--c1`, Applied Materials and All others `--c2`). Screen and paper alike.
- **Wrong:** `colorOf` in `build/build.js` (line 118) gives countries their fixed color from COUNTRY_COLOR, then numbers every other name from `--c1` upward, so a non-country name lands on a color a country already holds. On paper, with no hover, a reader cannot tell which blue is which.
- **Change** (`build/build.js`, stack branch of the figure builder): color per figure. First the fixed country colors; then the remainder names ("Rest of …", "Other", "Others", "All others", "EMEA", "Rest of world") in neutrals, darkest first (`#8a9099`, `#b4b9be`, `#d3d6d9`); then other names on the hues this figure has not used; past eight, fold the tail into "All others". Proved with the two neutrals on ch 4.
- **Shots:** `chapter-lithography-stack-colors-before.png` / `-after.png`.
- **Risk:** low. Touches every surface that shows these three figures; the charts reviewer may own the general palette (I note under P3 that bright categorical hues compete with garnet on paper).

### P1-3. The contents page
- **Where:** Chain PDF, page 2.
- **Wrong:** four left edges on one page (running head rule and Contents at 20 mm, "The Chain" and the definitions box indented by the box's 4 mm padding and the list's 18 px screen indent, titles at 4 mm after a number of varying width, so "Chip Design" and "Advanced Packaging" do not start on one line). Serif lowercase letterspaced 0.03 em. Folios in 7.6 pt sans sit above the title's baseline. The lede says "This page covers…" and promises a 3D model, animations and flashcards, none of which the PDF carries.
- **Change** (`src/modules/print.css`, contents block):
  ```css
  .howto { padding: 3.4mm 0 1mm; }
  .howto ul { padding-left: 0; }
  .contents-grid .item { gap: 0; }
  .contents-grid .n { flex: none; width: 9mm; font-variant-numeric: tabular-nums lining-nums; letter-spacing: 0.04em; }
  .contents-grid .t { align-items: baseline; letter-spacing: 0; }
  .contents-grid .t::after { font-family: var(--font-body); font-size: 9.5pt; font-variant-numeric: tabular-nums lining-nums; color: var(--ink-2); }
  ```
  And a print lede (`src/modules/print.js`, prepare(), book mode only, on `.howto .howto-lede`): "This edition covers each of the fifteen stages of making an AI chip in detail, one chapter per stage, in the order a chip is made, from design software to the data center. Two more chapters at the end look across all the stages, at what a chip costs and who controls the chain. On the site, each chapter also has a 3D model, most have an animation, and every one has flashcards." Same length as the screen sentence, so the page still holds.
- **Shots:** `book-p02-contents-before.png` / `-after.png`.
- **Risk:** the contents fills its page to within a line; a trial with 1.15 mm rows and a longer lede pushed its last two lines onto page 3. Keep the row padding at 0.9 mm.

### P1-4. The chapter opener
- **Where:** first page of every chapter in the Chain PDF; first page of every chapter PDF (all but the running-head part).
- **Wrong:** (a) the running head prints above the chapter title, 5 mm from it; a book never heads its opening page. (b) The title starts at the top margin, so the opening reads as a continuation. (c) In plain terms and In short are indented 5 mm from the title and the prose by `.plain { padding: 3mm 5mm }` and `.inshort { padding-left: 5mm }`, print rules that set a left border's width the screen no longer draws. (d) The card (about 186 mm tall before its notes) never fits under In short, so it moves whole to page 2 and leaves an average blank band of 16 percent at the foot of the opener (34 and 37 percent on ch 12 and 13).
- **Change:**
  - `print.css`:
    ```css
    article.chapter { padding-top: 20mm; }                 /* the sink */
    article.chapter[data-split-from] { padding-top: 0; }
    .cp-alone article.chapter { padding-top: 0; }           /* a chapter PDF opens under its title block */
    .plain { padding: 3mm 0 3.4mm; }
    .inshort { padding-left: 0; }
    .cp-tight .plain { padding: 2.4mm 0 2.8mm; }
    .cp-opener .pagedjs_margin-top-left, .cp-opener .pagedjs_margin-top-right,
    .cp-colophon .pagedjs_margin-top-left, .cp-colophon .pagedjs_margin-top-right { visibility: hidden; }
    .chapter-head .cp-lead { margin-top: 5mm; }
    ```
  - `print.js` finish(), after the loop (marks pages only; no reflow):
    ```js
    each('.pagedjs_page', document, function (pg) {
      if (pg.querySelector('.pagedjs_page_content article.chapter:not([data-split-from])')) pg.classList.add('cp-opener');
      if (!alone && pg.querySelector('.pagedjs_page_content .site-footer:not([data-split-from])')) pg.classList.add('cp-colophon');
    });
    ```
    and prepare() adds `cp-alone` to `<html>` when `opts.chapter` is set.
  - The card as a plate: let the chapter's opening paragraph fill the opener and the card head page 2. Proved by moving the first `.prose > p` into a `div.prose.cp-lead` before `.plate`. Build it measured, not blind: in one trial, ch 3's paragraph did not fit and left page 23 at 16 percent until the "closer" pass fixed it. The clean form reuses floats(): in prepare() move `.plate` to be the first child of `.prose` with an id (`card-<chapter>`), scope the prose list rules away from it (`.prose .plate ul, .prose .plate li { margin: 0; padding: 0; list-style: none; }`), and add `.plate[id]` to the selector floats() looks for at the head of a page. It then moves the card past only the paragraphs that fit the gap, never past a heading, which is the rule it already keeps for figures.
- **Shots:** `book-p03-opener-ch01-before.png` / `-after.png`, `book-p33-opener-ch04-before.png` / `-after.png`, `book-p04-card-page-before.png` / `-after.png`, `chapter-design-and-eda-p1-before.png` / `-after.png`.
- **Risk:** medium; it changes the layout loop. Run the whole book and all chapter PDFs and compare finish() reports; mine came out 173 pages, no short pages, no lost text, the systems-and-networking card still breaks between its parts as today. Touches the Chain PDF and the chapter PDFs. The browser's own print gets the sink and the single edge, not the head suppression or the float (those need Paged.js).

### P1-5. A source list that spills two entries onto a page of their own
- **Where:** Chain PDF page 160 (ch 16's sources 31 and 32 alone, 7 lines); page 101 (ch 10's last four entries) is the same pattern.
- **Wrong:** a near-empty page in the middle of the book; it reads as a printing fault.
- **Change:** in finish(), report a chapter whose last page carries only `.cp-sources li` and is under 20 percent full; pdf.py's loop then lays it out again with that chapter's list set closer (`print.css`):
  ```css
  .cp-sources-tight .cp-sources li { margin-top: 0.55mm; }
  .cp-sources-tight .cp-sources ol { line-height: 1.24; }
  .cp-sources-tight .cp-sources .src-url { line-height: 1.25; }
  ```
  (print.js adds `cp-sources-tight` to the chapter, as it adds `cp-tight` today.)
- **Shots:** `book-ch16-sources-p159-before.png` + `book-ch16-sources-p160-widow-before.png` / `book-ch16-sources-p159-after.png` (both entries back on page 159).
- **Risk:** low; one more pass of the existing loop.

---

## P2: clear upgrades

### P2-1. The stage index in the ledger column
- **Where:** each stage chapter's opener, book and chapter PDFs.
- **Wrong:** the design system's "one thing to remember", the ruled column carrying the chapter number and the fifteen stages turned vertical, stops at the screen. print.js drops `.chain--compact` and paper keeps only the number.
- **Change:** print the fifteen stages under the number: short name, number, the current stage in ink at weight 600 with a 1.2 pt garnet tick at the right. Proved with a list built in prepare() from `.chain-track` before `GONE` removes it (`ol.cp-index` in `.ch-ledger`, one `li` per stage, `.is-here` on `aria-current`). CSS (`print.css`):
  ```css
  .ch-ledger .cp-index { list-style: none; margin: 7mm 0 0; padding: 0; border-top: 0.6pt solid var(--ink); border-bottom: 0.3pt solid var(--line); }
  .cp-index li { display: flex; justify-content: flex-end; align-items: baseline; gap: 1.5mm; margin: 0; padding: 0.85mm 1.6mm 0.85mm 0;
    border-top: 0.3pt solid var(--line); border-right: 1.2pt solid transparent; font-family: var(--font-mono); font-weight: 500;
    font-size: 6pt; line-height: 1.1; letter-spacing: 0.03em; color: var(--muted); white-space: nowrap; }
  .cp-index li.cp-top { border-top: 0; }
  .cp-index .n { width: 3.4mm; text-align: right; font-variant-numeric: tabular-nums lining-nums; color: #8b9198; }
  .cp-index li.is-here { color: var(--ink); font-weight: 600; border-right-color: var(--accent); }
  .cp-index li.is-here .n { color: var(--accent); }
  ```
  Chapters 16 and 17 have no track and print none, which is right: they are not stages. It sits in the 28 mm ledger margin, so it moves no text. (`#8b9198` on white is 3.2:1; these are reference numerals beside the readable name, but `var(--muted)` is the safe choice if the merge wants AA everywhere.)
- **Shots:** `book-p33-opener-ch04-after.png`, `book-p33-stage-index-zoom-after.png`, `chapter-lithography-p1-after.png`.
- **Risk:** none for layout. Touches book and chapter PDFs.

### P2-2. Running heads that say where you are
- **Where:** every text page.
- **Wrong:** the right head repeats "Chip Supply Chain", which the foot already says ("chipsupplychain.org · Edition of …"). A student flipping a printed chapter for "Who makes it" has no help.
- **Change** (`print.css`): `@page { @top-right { content: string(section); } }` and
  ```css
  .prose h3, .plate-head .label, .cp-sources .cp-sources-h, .review .rv-keep h4.label { string-set: section content(text); }
  .review .rv-title { string-set: none; }   /* the hidden "Flashcards" heading otherwise names the page */
  ```
  The left head stays "Chapter 4: Lithography". Pages then read "Chokepoint card", "How it works", "Who makes it", "Sources (30)". The contents page has no section yet and prints no right head, which is conventional.
- **Shots:** `book-p04-card-page-after.png` (Chokepoint card), `chapter-design-and-eda-p3-still-after.png` (How it works), `chapter-design-and-eda-p10-sources-after.png` (Sources (30)); befores alongside.
- **Risk:** low. Chrome's fallback path has no string() and prints an empty right box; pdf.py's fallback header carries the title anyway.

### P2-3. The cover: the wordmark, and the title in the site's weight
- **Where:** Chain PDF page 1.
- **Wrong:** the owner's wordmark (garnet tile beside the name, chosen 20 October) is on every web page and card but not on the cover, which uses tracked capitals instead. With the static fonts the title now prints from Fraunces 96 pt Bold: a fat face, heavier than anything else in the system (whose display rule is "never bold") and unlike the cards, which set titles at 400.
- **Change:** `src/template.html`, `.pt-k` becomes the lockup: `<p class="pt-k pt-wm">` + the masthead's tile SVG + `<span class="wm-name">Chip Supply Chain</span>`. `print.css`:
  ```css
  .print-title .pt-k.pt-wm { display: flex; align-items: center; gap: 3mm; letter-spacing: 0; text-transform: none; color: var(--ink); margin: 13mm 0 6mm; }
  .print-title .pt-wm .wm-tile { width: 7mm; height: 7mm; flex: none; }
  .print-title .pt-wm .wm-tile rect { fill: #7a1f2b; }
  .print-title .pt-wm .wm-tile path { fill: #fff; }
  .print-title .pt-wm .wm-name { font-family: var(--font-display); font-weight: 500; font-size: 14pt; letter-spacing: -0.005em; line-height: 1; }
  .print-title .pt-h { font-weight: 400; font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0; letter-spacing: -0.02em; }
  ```
  Coordinate with the font agent: printFonts loads '700 68pt Fraunces' for the cover; it needs a 400 instance at the high optical size instead (my proof fell back to the 72 pt Regular instance) and 500 for the wordmark (540 resolved to SemiBold).
- **Shots:** `book-p01-cover-before.png` / `-after.png`.
- **Risk:** the cover fills its box to within 2 mm. The margins above (13/6 mm, 7 mm tile) keep it on one page; a 74 pt title or a 8 mm tile pushed the edition line to page 2 in trials.

### P2-4. The chapter PDF's first lines
- **Where:** page 1 of each chapter PDF.
- **Wrong:** "CHIP SUPPLY CHAIN · CHAPTER 4" in tracked capitals, then "CHAPTER 04" again in the ledger 15 mm below. This is the page people share, and it carries no wordmark.
- **Change:** `print.js` titleBlock(): the first span becomes the lockup (tile cloned from the masthead before `GONE` removes it, plus "Chip Supply Chain"); drop " · Chapter N" (the ledger says it). `print.css`:
  ```css
  .pt-chapter .ptc-k { align-items: center; }
  .pt-chapter .ptc-wm { display: inline-flex; align-items: center; gap: 2.4mm; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .pt-chapter .ptc-wm .wm-tile { width: 5.4mm; height: 5.4mm; flex: none; }
  .pt-chapter .ptc-wm .wm-tile rect { fill: #7a1f2b; }
  .pt-chapter .ptc-wm .wm-tile path { fill: #fff; }
  .pt-chapter .ptc-wm .wm-name { font-family: var(--font-display); font-weight: 500; font-size: 11pt; line-height: 1; }
  .pt-chapter .ptc-url { margin-top: 1.6mm; }
  ```
- **Shots:** `chapter-lithography-p1-before.png` / `-after.png`, `chapter-design-and-eda-p1-before.png` / `-after.png`.
- **Risk:** none.

### P2-5. The chokepoint card on paper
- **Where:** the card, book and chapter PDFs.
- **Wrong:** the head carries two boxed tags ("EXTREME CONCENTRATION", "HARD TO SUBSTITUTE") that repeat the two figure cells directly beneath them; on screen they open glossary popovers, on paper they are only repetition. Country codes sit in 0.75 pt boxes, ten to a card, that read as form fields.
- **Change** (`print.css`):
  ```css
  .plate-head .plate-tags { display: none; }
  .plate .chip { border: 0; width: 5.4mm; text-align: left; padding: 0; margin-right: 1.2mm; font-weight: 600; color: var(--muted); letter-spacing: 0.04em; }
  ```
- **Shots:** `book-p04-card-page-before.png` / `-after.png`, `book-p33…` page 34 in the same run.
- **Risk:** none. Card height unchanged.

### P2-6. The source list as a bibliography
- **Where:** end of each chapter.
- **Wrong:** every entry opens with a boxed "A" or "B"; thirty identical boxes down a page are noise. The title's second line and the address hang under the box, not under the title, so each entry has two left edges.
- **Change** (`print.css`): the tier as a quiet letter in a hanging column, everything else on one edge, entries 0.4 mm closer.
  ```css
  .cp-sources ol { padding-left: 6.5mm; }
  .cp-sources li { padding-left: 3.8mm; margin: 1.1mm 0 0; }
  .cp-sources .tier { display: inline-block; border: 0 !important; background: none !important; width: 3.8mm; height: auto; padding: 0;
    margin: 0 0 0 -3.8mm; text-align: left; font-weight: 600; font-size: 6pt; line-height: 1; vertical-align: baseline; color: var(--muted) !important; }
  .site-footer .sources-key .tier { border: 0 !important; width: auto; font-weight: 600; padding: 0; margin: 0 1mm 0 0; }
  ```
  (An absolutely placed tier collided with the list marker in a first trial; the negative margin keeps it on the baseline and clear.)
- **Shots:** `chapter-design-and-eda-p10-sources-before.png` / `-after.png`.
- **Risk:** none; saves about 12 mm a chapter.

### P2-7. Animation stills on white
- **Where:** the 15 animation figures in print.
- **Wrong:** the still is the screen frame, on the site's paper (246, 247, 241), so on the white PDF page each one is a pale grey panel inset in its figure: a pasted screenshot.
- **Change:** `build/animate.py` (line 73) writes a third still, `media/<name>-print-end.jpg`, from `end.png` with the ground taken to white per channel (`v × 255 / ground`, ground 246, 247, 241); `build/build.js` (line 132) points `img.anim-print` at it. The screen's `-light-end.jpg` (reduced-motion poster) is untouched; the print still loads only when printing, as now.
- **Shots:** `chapter-design-and-eda-p3-still-before.png` / `-after.png` (proved with the levelled JPEG as a data URL).
- **Risk:** none for layout; about 1.5 MB more in `dist/media`, never fetched on screen.

### P2-8. The colophon set as type
- **Where:** the last page of the Chain PDF and the end of each chapter PDF.
- **Wrong:** the citation and BibTeX print in the screen's grey filled code boxes; "UPDATED 20 OCTOBER 2026" repeats the edition the page foot already gives; the book's colophon page carries the running head "Chapter 17: Who Controls the Chain".
- **Change** (`print.css`; the footer's words are not touched):
  ```css
  .site-footer .updated { display: none; }
  .site-footer .cite--edition summary { font-family: var(--font-mono); font-weight: 500; font-size: 7pt; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 6mm 0 2mm; }
  .site-footer .cite--edition pre { background: none; border: 0; border-left: 0.6pt solid var(--line-2); padding: 0.4mm 0 0.4mm 3.5mm; margin: 2.4mm 0 0; }
  .site-footer .cite--edition .cp-cite-text { font-family: var(--font-body); font-size: 9pt; line-height: 1.45; border-left-color: var(--accent); white-space: normal; }
  .site-footer .cite--edition pre:not(.cp-cite-text) { font-size: 7pt; line-height: 1.45; color: var(--ink-2); }
  ```
  print.js citeBox() marks the first block `cp-cite-text` (better: make it a `<p>` and call `citation(…, true)` so the work's title prints in italic, as a citation should). The head is suppressed by the `cp-colophon` page class in P1-4.
- **Shots:** `book-colophon-before.png` / `-after.png`.
- **Risk:** none.

### P2-9. The summary PDF
- **Where:** `dist/chip-supply-chain-summary.pdf`, pages 1 and 2 to 4.
- **Wrong:** no wordmark (a garnet tracked kicker instead); the stage tags say "Moderate to substitute" where the site, the cards and the chapter cards say "Moderately hard to substitute"; 12 mm margins on all sides are tight for a page meant to be printed and written on.
- **Change:** `build/modules/summary-brief.js`: the kicker becomes the lockup (tile, "Chip Supply Chain" in Fraunces 500 12 pt, then "Summary" as a 7.4 pt label after a hairline); the `.tags` line uses the same SUBWORD map as `build.js` and `social.js` (`Moderate` → "Moderately hard to substitute"); `@page { margin: 14mm 15mm 14mm; }` and add `td.t { padding-right: 4mm; }` (not yet tried) so "Chemicals, Gases and Photoresist" does not touch "JSR" at the narrower width.
- **Shots:** `summary-p1-before.png` / `-after.png`, `summary-p2-before.png` / `-after.png`.
- **Risk:** the summary is fragile: stage blocks do not break, so the two columns rebalance. 15/16 mm margins tipped it to 6 pages (refused by summary_pdf.py); 14/15 mm keeps 4. Test after any content change.

### P2-10. Share cards name the specimen, not the title again
- **Where:** chapter cards' plate line.
- **Wrong:** "SPECIMEN 13 · TEST AND ASSEMBLY" repeats the 100 px title beside it and does not say what the picture is.
- **Change** (`build/cards.py`, plate_html): `text = LABEL.get(name, p['title'] if p['kind'] == 'chapter' else name)`, so it reads "Specimen 13 · Probe card over a wafer", "Specimen 11 · CoWoS package, exploded". LABEL already holds all 19 names.
- **Shots:** the four `card-*-after.png` files above.
- **Risk:** none.

---

## P3: refinements

### P3-1. A deeper sink where the opener still falls short
After P1-4, four openers keep a blank band of 12 to 22 percent (ch 9, 12, 13, 14): the opening paragraph is followed by How it works and an animation, which cannot float. Let the layout loop take that white to the top instead: finish() reports the opener's shortfall and the next pass deepens that chapter's sink by it, up to 65 mm. A title a quarter of the way down reads as a designed opening; a gap above the notes reads as a fault.
- **Shots:** `book-ch12-opener-before.png`, `book-ch12-opener-after-fixed-sink.png`, `book-ch12-opener-after-deep-sink.png` (64 mm).
- **Risk:** chapter titles then sit at two or three heights across the book. Keep the base sink fixed and use this only past a threshold.

### P3-2. Print the flashcard questions above the takeaways
On paper the deck is gone and only "Four things to remember" prints, which states the answers. Printing the four questions first, each with its "Reread" section as "see How it works", turns the chapter's last page into something a student can test themselves on, then check against the takeaways below. About five lines a chapter. Built in prepare() from `.fc-card .fc-q` and `.fc-why`; label "Questions to answer from memory" (or the site's "Flashcards").
- **Shots:** `chapter-lithography-p9-review-before.png` / `-after.png`.
- **Risk:** the owner dropped discussion questions as overkill; these are the existing flashcards, not new prompts, but ask before building.

### Noted, not proved (no shot yet)
- Folios: "40" in the Chain PDF, not "40 / 175"; keep "3 / 11" in chapter PDFs, where the count tells a reader the printout is complete.
- Tables: tabular figures and right-aligned numeric columns (`Share` in ch 17's chokepoint table), and `white-space: nowrap` for short country cells so "United States" stops breaking while the Basis column has room.
- Chart hues on paper: China's `--c6` (#c3302b) is close enough to garnet to read as the accent beside garnet note calls, and the bright categorical set is the loudest thing on most pages. For the charts reviewer.
- In the chapter PDFs the colophon lands alone on the last page in 9 of 17 files (its cite box cannot break). Setting it as type (P2-8) shortens it; a designed back page (colophon at the foot, wordmark) would make the case that remains look intended.

---

## Top five
1. **P1-4 The chapter opener:** sink, no head on the opening page, one left edge, the card as a plate heading page 2. `book-p33-opener-ch04-before/after.png`, `book-p03-opener-ch01-before/after.png`, `chapter-design-and-eda-p1-before/after.png`.
2. **P1-1 Share-card tags** out of the specimen on 8 cards (and P2-10, the plate line names the object). `card-test-and-assembly-before/after.png`, `card-advanced-packaging-before/after.png`.
3. **P1-3 The contents page:** one title column, baseline folios, a print lede. `book-p02-contents-before/after.png`.
4. **P2-1 The stage index** printed in the ledger column, with P2-2 running heads that name the section. `book-p33-stage-index-zoom-after.png`, `book-p04-card-page-before/after.png`.
5. **P2-3 The cover** with the wordmark and the title at 400, the cards' voice. `book-p01-cover-before/after.png`.

Close behind: P1-2 (chart colors, `chapter-lithography-stack-colors-*`), P1-5 (widow page), P2-7 (stills on white).

## Reproducing the proofs
The prototype is in `qa/design/shots/design-print/proto/`. `python3 mkeval.py ev.js '{"auto":1,"skip":["chemicals-gases-and-photoresist"]}'` writes one script (print-proto.css plus the prepare()/finish() wrappers in print-proto.js; `--css quiz.css` or `--css cover-light.css` adds a block); then `python3 build/pdf.py "http://127.0.0.1:8765/?theme=light#/chain" out.pdf --edition 2026-10-20 --port 9935 --eval "$(cat ev.js)"` (add `--chapter <id>` or `--only N`). `quiz.js`, `chart.js` and `widow.js` are prepended to the same `--eval`. Cards: `python3 run_cards.py "$PWD/build/cards.py" <out-dir> after --only <slugs> --port 9924`. Summary: `python3 run_summary.py "$PWD/build/summary_pdf.py" summary-proto.js http://127.0.0.1:8765/summary/ out.pdf --port 9924 --edition 2026-10-20`.
