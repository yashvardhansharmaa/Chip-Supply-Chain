# The hybrid type, the four-bar meters and the site-wide revisions, built (28 October 2026)

Branch `redesign-system`, cut from `redesign` at 6f7c8c2. Built from `MAIN/qa/design9/BUILD-SYSTEM.md`, the mockups `MAIN/qa/design9/hybrid-mockup.js` and `meter-mockup.js`, and design round nine's review `MAIN/qa/design9/site-a/review.md` (revisions 1, 2, 4, 5 and 6; revision 3 was rejected, so the chapter's Link, Cite and PDF links and the phone's "On this page" tabs are untouched). Shots are in `qa/redesign/shots/stage-system/`, the pairs in its `pairs/`.

## What changed

**1. Hybrid type: Fraunces for display, Source Serif 4 for text**
- `--font-display` is `"Fraunces", "Iowan Old Style", Georgia, serif`. `--opsz-title` and `--opsz-numeral` are `"opsz" 48, "SOFT" 0, "WONK" 0`, and `--opsz-name` is `"opsz" 28, "SOFT" 0, "WONK" 0`, as before 27 October. `--font-body` stays Source Serif 4.
- Fraunces is loaded wherever commit e6f3fe5 removed it:
  - `src/template.html`;
  - the readable chapter pages and reference pages (`build/modules/social.js` FONTS; `build/assets/chapter-page.css` and `reference-page.css` tokens and the wordmark's optical size);
  - `/summary/` (`build/modules/summary-brief.js`, screen and print);
  - print (`src/modules/print.js`: static Fraunces instances at opsz 48 in 400, 500 and 600, and "Fraunces Mark", 500 at opsz 28, for the wordmark; `print.css` points `--font-display` at Fraunces and the two wordmarks at Fraunces Mark);
  - the summary PDF (`build/summary_pdf.py`, the same instances);
  - the figure PNG (`build/build.js`: the title in Fraunces, the subtitle in Source Serif 4);
  - the share cards (`build/cards.py`, `build/assets/home-card/card.html`): all 23 drawn again, titles and wordmark in Fraunces, the line in Source Serif 4, every card under 150 KB and versions bumped.
- Text in Source Serif 4 never inherits Fraunces's optical size: the glossary's part of speech and a supplier's native name reset it.
- `qa/redesign/type-hybrid.js` checks every text element on 12 pages at 1440 and 390, light and dark: each face is one of the four and is loaded at its weight, and no Source Serif 4 text carries opsz 48.

**2. The four-bar meter**
- One component, `.meter` in `src/modules/chapter.css`, which the app and the readable chapter pages both load. It is the home's meter: four `<b>` bars at 36, 57, 79 and 100 percent of its height. Extreme lights four in `--bar-5`, High three in `--bar-4`, and Moderate and Low theirs in `--bar-3`. Unlit bars take `--line`. Dark mode uses the dark bar tokens. Each place sets `--mh`, `--mw` and `--mg`. The meter is `aria-hidden`.
- `build/build.js meterHTML` (and the same helper in `social.js`) draws it:
  - the chapter sidebar's chain: 10 px tall, 3 px bars, 1.5 px gaps, right-aligned (the grid column is now 17 px);
  - the card's concentration: 20 px, 6 px bars, on the word's baseline;
  - the line above the title: 11 px, 4 px bars, 1.5 px gaps;
  - the readable page's compact chain under 1200 px, in each numbered cell.
- The home list (`build/modules/walk.js`) now uses the same component (14 px, 5 px bars); `walk.css` only sizes it. `/summary/`'s meter bars are `<b>` too.
- Print: `print.js stageIndex` copies each stage's meter into the margin chain (2.2 mm tall, 0.6 mm bars). The card's meter is 0.72 em with 1.5 mm bars, the kicker's 2.6 mm with 0.9 mm bars.
- The Chain contents page and the book's contents page keep the single mark (not touched).

**3. The site-wide revisions**
- **1, the type scale.** `src/styles.css :root` defines seven serif steps: `--t-title`, `--t-section`, `--t-block`, `--t-lead`, `--t-text`, `--t-small` and `--t-note`, with the review's values. `--text-scale` stays the one knob: `--tk` is 1 at today's 18 / 18.5, and the four text steps are multiplied by it. Every `calc(Npx * var(--text-scale))` in `styles.css`, `chapter.css`, `lookup.css`, `suppliers.css`, `controls.css`, `walk.css`, `summary-a.css`, `template.html`, `chapter-page.css`, `reference-page.css` and `summary-brief.js` now names a step. So do the fixed display sizes near a step (h4 22, the card's values 24 and 22, Previous 17, figure titles 21, the view and reference titles). Fraunces sets the display steps (title, section, block) and the small heads at the lead step. Source Serif 4 sets lead, text, small and note. The readable pages and `/summary/` carry the same tokens. The Hanken steps are `--ui` (15), `--ui-s` (13), `--fs-label` (11.5) and `--fs-cap-s` (11).
- **2, footnote numbers.** `sup.cite a` is the label gray, wine with its tint on hover and focus (app and readable pages). The glossary's chapter links (`.gl-refs a`, app and `/glossary/`) and the home's "Source" links (`.wk-src`) are the secondary ink over a gray rule, wine on hover.
- **4, the section kicker.** `h3::before` (and the readable page's `h2::before`) prints the section number alone.
- **5, the gray steps.** `--muted` is #6b6a64 (5.3:1 on the ground, 4.9:1 on paper), and #8f8d87 in dark mode (5.7:1 and 5.1:1). It is set on the site, the readable pages and `/summary/`.
- **6, one masthead.** `build/masthead.js` writes the app's bar into every readable page (chapters, Start here, the four reference pages) and `/summary/`, and `build/assets/masthead.css` styles it to the app's measures. The bar has:
  - the wordmark at `--margin`;
  - Home first, then the five sections by their real paths;
  - `aria-current` on the page's section (The Chain on chapter pages), drawn as the wine rule;
  - search and the theme as 34 px round buttons.

  Search is a link to `../?search=1`, and `src/app.js` opens its dialog and drops the flag from the address. The theme button flips the page and stores `cp-theme` for the whole site. On a phone the bar is the app's two rows, with Home hidden under 480 px. The old static masthead rules are gone from `chapter-page.css` and `summary-brief.js`.

## Departures and choices
- **Hanken.** Its four steps are defined and used in the chapter's rail, the card's head, In short's head, the figure strip and the kicker's verdict. Elsewhere Hanken keeps its sizes, since the charts, the board and the tabs are fitted to their geometry. The steps are named `--fs-label` and `--fs-cap-s`, the existing names for 11.5 and 11 px, in place of the review's `--label` and `--mark`, because `/summary/` already uses `--label` for a font.
- **Sizes kept off the seven steps:**
  - the home's one-line title, 66 px, which the review keeps;
  - a long chapter title ("Chemicals, Gases and Photoresist"), at its two-line size;
  - the large numbers and the Glossary's letters (revision 11 was not approved);
  - AI Chips (`chips.css`) and The Chain's contents page (`contents.css`, the other branch's), until their rounds close. The legacy `--fs-*` tokens remain for them.
- **Phone titles.** All page titles share the chapters' phone size, `min(68px, 15vw)`, through `--t-title`. Suppliers, Export Controls and Glossary were `min(76px, 19vw)`; the readable pages and `/summary/` were 48 px. `/summary/`'s title is long, so on a phone it takes the long-title size (`min(46px, 11vw)`), two lines in place of three.
- **What the steps change on screen.**
  - On a phone the body is 18 px (was 17) and the chapter's lede 21 px (was 19.5). Lithography's lede at 390 takes five lines (four before).
  - The card's rows are 15.5 px (were 14.1), and its price is 26 px like its ratings (was 22).
- **Print** keeps its own point ramp and `--muted` #56554f, so the cover changes only in its face. The footnote marks on paper stay wine, since paper has no hover.
- **`/summary/`** belongs to no tab, so its bar marks no current item.
- **The theme button is a `<button>`** on the static pages. The build's two "button from the app" warnings and `interact-glossary`'s static check now leave it out.

## Checks
1. `node build/build.js`, then:
   - `check-speak`: no matches;
   - `check-integrity`: no problems (the usual Deposition and Etch year warning and the Veeco allowance);
   - `check-sources`: 2,817 citations, all tier A or B;
   - `check-size`: none over 5 MB;
   - `check-seo`: 16 chapter pages, 22 sitemap entries, no problems.
2. `smoke.js --port 8785`: 36 page loads, no failures, the theme rules included.
3. Against `http://127.0.0.1:8777`:
   - `interact-chapter.js`: all pass. Updated: the old check of the single mark now checks the meter: four wine bars for Extreme in the kicker, the card and the rail, and three gray bars and one hairline for High.
   - `interact-glossary.js`: all 90 pass. Updated: a chapter link in a glossary entry is the secondary ink in dark mode (revision 2), and `/glossary/`'s "no button from the app" leaves out the masthead's theme button.
   - `interact-suppliers.js`: 65 checks, 0 failed.
   - `interact-chips.js --base`: all 93 pass.
   - `datacheck-chips.js`: 1,322 values, 0 mismatches.
   - `stage-chapters.js`: 10 of 10 pass.
   - `check-cites.js`: 3,300 marks, 0 problems.
   - New: `interact-masthead.js` (`interact-masthead.txt`), 14 checks pass. On a chapter page, a reference page and `/summary/` the bar matches the app's margin, height and face, with Home first, the current tab on the wine rule and 34 px buttons. The theme button turns the page dark and back and keeps the choice. At 390, Home gives way and nothing scrolls sideways. Search opens the app's dialog and drops the flag.
   - New: `type-hybrid.js` (`type-hybrid.txt`): 0 problems.
4. `sweep-full.js` on home, Lithography, Suppliers, Export Controls, Glossary, AI Chips and `/summary/` at 390, 1024 and 1440, light and dark: 42 loads, 0 findings (`sweep-system.txt`). On four readable pages: 12 loads, 0 findings (`sweep-system-static.txt`).
5. PDFs:
   - `chapter_pdfs.py lithography`: 13 pages, every face embedded as TrueType (Fraunces 48pt Regular and Medium, Fraunces 28pt Medium for the wordmark, Source Serif 4 11pt Regular, SemiBold and Italic, Hanken Grotesk, Fragment Mono). It has meters in the margin chain, the kicker and the card.
   - The book (`pdf.py ... --wait 8 --port 9343`): **186 pages**, the same count as before. It has 1,045 notes, with 0 stray, 0 overflow and 0 lost. Its fonts are all TrueType: the 11 faces above and Noto Serif SC, as before. The book's contents page keeps the single mark.
   - The cover's page 1, compared with `MAIN/qa/design9/cover/today-cover.png`, keeps its layout, wafer, subtitle, rule and colophon. Only the byline ("Yashvardhan Sharma", as committed) and the heading face differ: the title, the wordmark and the byline are in Fraunces.

## Known issues
- The other 15 chapter PDFs and the summary PDF were not printed again: the brief asked for one chapter and the book. `print.js` and `summary_pdf.py` load Fraunces, so the next print run takes it. The summary PDF's table still draws the single band mark (`summary-brief.js` print CSS).
- The Chain contents page will take the steps, the meter's tokens and the new gray once the other branch merges. It already reads `--muted`, so the new gray reaches it on merge.
