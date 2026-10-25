# Redesign, stage 1: foundation and home

Branch `redesign` in the build checkout. Built to `qa/redesign/BRIEF.md` (in the main checkout) and the hybrid mockup's home, `qa/design3/directions/hybrid/home.html`, with the type of review image `r8-body-2.png` ("Home, with the plain caption").

## What was built

**Tokens** (`src/styles.css` `:root`, repeated in `build/assets/chapter-page.css` for the static pages and in the summary page's screen sheet):
- Light: white ground `#ffffff`; ink `#171716` with `#45443f` and `#56554f` as secondary inks; paper `#f4f4f2` as a tint only (flashcards, the search dialog's first result, table hovers); hairlines `#e1e0db` and `#c4c3bd`; a stronger rule `#8c8a84` for field edges and the footer.
- Accent: red wine `#7a1f2b` (10.2:1 on white). It now marks links, the current menu item, the reader's selection (the pressed stage mark, the current walk step) and the logo tile. Labels that were wine ("In plain terms", "In short", the flashcard answer, "Things to remember") and data values that were wine (Extreme on the chokepoint card, the band pips) are ink now. Chart marks are left for stage 2 (see Known issues).
- Dark: ground `#121211` (the hybrid's night), ink `#e8e7e3`, secondary inks `#c6c4be` and `#a9a7a1` (7.7:1), wine `#d98a95` for text on dark (7.2:1). The site still opens light for everyone; `?theme=dark` and the toggle work as before.
- `--night` tokens from the hybrid, for chapters 16 and 17 in stage 2.
- Bands as marks: Extreme ink, High mid gray (`#8c8a84`), lower bands a tint. The chain strip and the ledger read these, so Extreme is no longer wine anywhere in the chain.

**The four faces** (one Google Fonts link): Fraunces (`"opsz" 48`, SOFT and WONK 0; 350 at display sizes, 500 for small headings; the name in the masthead 540 at opsz 28), Literata (text, standfirsts, the specimen caption, flashcard questions and answers), Hanken Grotesk (menu, buttons, fields, interface labels), Fragment Mono (kickers such as "Chapter 04", the specimen label, dates in meta lines, the stage numbers). Source Serif 4, Instrument Sans, Jost and IBM Plex Mono are gone from every screen page and from the static pages' links; only the print path (`src/modules/print.js`, `build/summary_pdf.py`, `build/cards.py`, the summary's print sheet) still names them, which is stage 4's.

**Labels**: every label is sentence case now. CSS no longer sets capitals or wide tracking anywhere on screen (about 120 rules in `src/styles.css`, the module sheets, the static page sheets and the summary). `.label` is a Fragment Mono kicker at 12 px.

**No text under 11 px**: the scale's smallest step is 11 px, every hard-coded 9 to 10.5 px size went to 11 px, citation marks are `max(11px, 0.62em)`, and the Suppliers ribbon labels on a phone draw at 11 px.

**Masthead**: 64 px, a hairline under it; the tile and "Chip Supply Chain" in Fraunces; the menu in Hanken 15 px with the current item marked by a 2 px wine rule on the masthead's own hairline; search and the theme toggle as two round buttons. The phone keeps its two rows (wordmark and buttons, then the scrolling menu); `--masthead` matches its measured height (81 px, 76 px at 480 and below), so nothing shifts at load.

**Footer**: same words and markup (`credits` and `footerKey` untouched): the credit line in Hanken 15 px ink, "Updated" in Fragment Mono, the source key in Hanken 13 px, over a `#8c8a84` rule.

**Links and buttons**: links keep a hairline underline that turns wine; `.link` (Hanken over an ink rule) for ways on; `.btn` is a pill, solid ink or a ghost edge; flashcard buttons, the phone strip's buttons and Back to top are pills too. Focus is a 2 px wine ring everywhere, including the Glossary field.

**The specimen caption** (every view with the stage): plain and flush left under the drawing, a Fragment Mono label "Specimen 04 · Lithography" and the chapter's own `specimenCaption`, verbatim, in Literata. No centered rule, no box, no gray block. The phone strip keeps its thumbnail, label, three-line caption, Top, Contents and Expand.

**The home page** (`build/modules/walk.js`, `src/modules/walk.css`, `src/modules/walk.js`):
- The hero block is the title and subtitle only, unchanged.
- The evidence figure follows: "8 of the 15 stages are rated Extreme", the definition of Extreme built from the chapter card's own band note ("Extreme means three or fewer firms could supply the stage today, or one firm holds more than half of it."), "Each bar is a stage, in the order a chip is made.", then 15 marks in chapter order, solid for Extreme and an outline for High, a legend ("Extreme, 8", "High, 7") and "Shown: 04 Lithography". All counts are computed.
- Each mark is a button that puts its stage's specimen on the stage beside the hero, with that chapter's caption. Lithography shows first. One mark is in the Tab order; the arrow keys, Home and End move along them. The pressed mark is the one wine mark. (Mechanism: the hero carries `data-specimen`, and Sections in `src/app.js` now redraws when the specimen an item names changes, not only when the item does.)
- The search field reads "Search 226 firms, 38 chips, 208 terms", counted at build time from `data/suppliers.json`, `data/landscape.json` and the glossary (passed to build modules as `ctx.glossary`). Typing, Enter or a click opens the site's search dialog with the words already in it.
- The two ways in: "Introduction" goes to the walk's first step (`#/walk/design-and-eda`) with the walk's counts under it ("17 paragraphs, 2,456 words, about 11 min", the three labels that used to sit under the subtitle); "Each stage, in detail" opens The Chain ("The Chain, 17 chapters").
- Then every section the home had, restyled: The chain at a glance (Fraunces heading, numbers in Fragment Mono, the band as the hero draws it, no wine on Extreme), the walk (ledger numbers in Fraunces, step titles, plain paragraphs, sourced facts, Who leads, the Concentration tag with its band mark, "Read the chapter" as a link), the flashcards (paper cards, Literata question, pill buttons), and Other pages.
- The phone shows the hero as one column; the specimen is the strip at the foot of the screen, as before (the owner's phone decision of 9 Sept).

**Every other page** keeps its layout and takes the new type and colors through the tokens: The Chain, AI Chips, Suppliers, Export Controls, China revenue share, Glossary, the 17 static chapter pages, the four reference pages, the summary page and the three forwarding pages.

## QA gates

| Gate | Result |
| --- | --- |
| 1. `node build/build.js` | Passes with no warnings (none in MAIN's report either). |
| 2. `check-speak`, `check-integrity`, `check-sources`, `check-size` | All four pass: no matches; no integrity problems; 2,725 citations, all tier A or B; no file over 5 MB. |
| 3. `node qa/scripts/smoke.js --port 9502` | Passes: 33 page loads, no failures. `LIGHT_GROUND` is now `rgb(255, 255, 255)`; with the device set to dark, the main page, a chapter page and the summary keep the white ground, and `?theme=dark` turns them to `rgb(18, 18, 17)`. |
| 4. Text census (`qa/redesign/census.js`, output `qa/redesign/census.txt`) | No text lost. Every view and every static page has the same lines as MAIN apart from letter case, except the home page, whose differences are all the hero the brief asks for (listed below). |
| 5. Layout sweep (`qa/redesign/sweep.js`, output `qa/redesign/sweep.txt`) | 180 loads: 15 pages (the 8 views, the Lithography and Geopolitics chapter pages, the summary and the 4 reference pages) × 6 widths × light and dark. No sideways scroll anywhere, no text under 11 px (SVG labels measured at their size on screen), no clipped text, and every control reached drew a focus mark (the first 30 Tab stops of each load, 5,370 in all). One finding remains, pre-existing: the Suppliers route map's stops 10 and 12 overlap at 1024 and 1280 px (8 loads), the same in MAIN. Found and fixed on the way: citation marks at 8 to 10.5 px, the Suppliers ribbon labels at 10.5 px on phones, the phone strip's caption over its buttons, the Glossary field's focus shown only as a darker edge. Screenshots then confirmed the home at every width. |
| 6. Look | Every page shot at 1440 and 390, the home also at 1024, 768 and 320 and in dark (shot list below), and compared with `hybrid/home.html`, `r7-pair-C2.png` and `r8-body-2.png`. Fixed after review: a dot that opened a wrapped line under "Introduction", the search button with no edge, the phone strip's caption running into its buttons, the search hint cut off at 320 px, square flashcard and sheet buttons, the summary's phone menu breaking onto two lines, the walk's counts splitting "about / 11 min". |
| 7. This report | Committed. |

Also run: `qa/redesign/interact.js` drives the home's new controls at 1440 and 390 (a mark picks the specimen and its caption, the arrow keys move along the marks with one Tab stop, typing opens the search with the words, Escape closes it, Introduction lands on the first step, Each stage opens The Chain). All pass.

## Census differences

Only the home page (`#/`) differs beyond letter case. Each difference is one the decisions require:

1. The glance list's sentence "8 of the 15 stages are rated Extreme, meaning three or fewer firms could supply each today, or one firm holds more than half." is now the evidence figure that follows the hero: "8 of the 15", "stages are rated Extreme", "Extreme means three or fewer firms could supply the stage today, or one firm holds more than half of it. Each bar is a stage, in the order a chip is made." Only the word "meaning" goes; both versions are built from the chapter card's own band note.
2. The three labels under the subtitle, "17 paragraphs", "2,456 words", "about 11 min", move under "Introduction" as one line, "17 paragraphs, 2,456 words, about 11 min", so the hero block is the title and subtitle only.
3. Added with the figure and the field: the marks' numbers 01 to 15, "Extreme, 8", "High, 7", "Shown: 04 Lithography", "Search the site" (the field's hidden label; its visible hint "Search 226 firms, 38 chips, 208 terms" is a placeholder), "/" (the key that opens search), "Introduction →", "Each stage, in detail →", "The Chain, 17 chapters".
4. The specimen on first view is Lithography's ("Specimen 04 · Lithography" and its caption) where it was Chip Design's ("Specimen 01 · Chip Design, EDA and IP"), because the evidence figure picks the specimen and Lithography shows first, as in the mockup. Chip Design's caption still shows when the reader reaches step 01 or presses mark 01.

Letter case: 3,203 lines across the 33 pages differ only in case, all labels that CSS used to set in capitals ("THE CHAIN AT A GLANCE", "WHO LEADS", "CHAPTER 01", "SOURCE", "CITE THIS CHAPTER") and now shows as written. No word changes with them.

The summary page's "Updated 21 October 2026" is unchanged: its content key includes link addresses, so the new font link moved its date to 25 October; `build/page-dates.json` keeps the new hash with the old day.

## Known issues and open questions

- **Charts still put wine on data.** The bar charts (`.hb.top`), the stacked bars' largest share, the China revenue panels' peak year and table, and the Export Controls board's state pills keep their old colors, and the summary page keeps wine on Extreme and its PDF button. Rule B and the accent rule reach them with stage 2's figure grammar and stage 3's views; stage 1 changed the shared tokens and the chain's band marks only.
- **Drag to turn.** The live stage still turns under a mouse drag and the arrow keys (`Stage.pointer` in `src/app.js`), as before. The brief says the specimens stay "as they are, with no drag-to-rotate and no zoom". I left it as it is rather than remove a working control without a decision; the lead should say whether it goes.
- **The home's specimen lives in the stage.** It is the site's one live WebGL renderer: the right-hand column at 901 px and up, the strip at the foot of a phone (the owner's 9 Sept phone rule). The mockup draws the phone's specimen inline under the field; that would need a second renderer.
- **Not added from the mockup:** the wall of 15 specimen stills, the night "Across the chain" section and the room-by-room walk are not sections of today's home, so the glance list and the walk keep today's structure, restyled. The `--night` tokens are in place for chapters 16 and 17 in stage 2.
- **Pre-existing, unchanged:** on Suppliers at 1024 and 1280 px the route map's numbered stops 10 and 12 overlap over Korea and Japan (the same in MAIN); at 320 px the phone menu scrolls in its strip (308 px of items in 288 px, MAIN 324 in 292).
- **Labels.** The sentence-case sweep removed capitals from the old labels everywhere at once, so some old-layout labels now read in lower case where their text was typed that way ("stage 4 of 15" under a chapter number). Stages 2 and 3 rebuild those blocks.
- **Print** (`src/modules/print.css`, `print.js`, `build/summary_pdf.py`, `build/cards.py`) still loads Source Serif 4, Instrument Sans and IBM Plex Mono; that is stage 4's. The PDFs were not regenerated.

## Shot list

In `qa/redesign/shots/stage-1/` (not committed, about 7 MB; remake with `sh qa/redesign/shots-stage-1.sh`), all from 127.0.0.1:8766 with the faces loaded and 1.5 s after any scroll:

- `home-1440`, `home-390`, `home-1024`, `home-768`, `home-320`, `home-1440-dark`, `home-390-dark`: the hero, the evidence figure, the field and the two ways in, the specimen on the stage or in the phone strip.
- `home-glance-1440`, `home-glance-390`: The chain at a glance.
- `home-walk-1440`, `home-walk-390`: a step of the walk (Lithography).
- `home-deck-1440`, `home-deck-390`: the flashcards and Other pages.
- `chain-1440`, `chain-390`, `chain-1440-dark`: The Chain at Lithography, old layout in the new type.
- `ai-chips-*`, `suppliers-*`, `export-controls-*`, `china-revenue-*`, `glossary-*`: the other views at 1440 and 390.
- `page-lithography-*` (and `-1440-dark`), `page-summary-*`, `page-chips-*`, `page-suppliers-*`, `page-export-controls-*`, `page-glossary-*`: the static pages at 1440 and 390.
