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

RESULTS

## Census differences

CENSUS

## Known issues and open questions

ISSUES

## Shot list

SHOTS
