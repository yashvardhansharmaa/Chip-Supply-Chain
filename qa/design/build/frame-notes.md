# Frame build notes (design-front), 21 October 2026

Builder: frame. Shots: `qa/design/build/frame/`, each `<name>-before.png` / `<name>-after.png` at the same viewport (before taken from the untouched 20 Oct `dist/`, after from the rebuilt one, so the afters also show the other builders' work). Screenshot port 9941, WebGL on. `node build/build.js` ran clean twice.

## Done

| ID | What | Files and functions | Shot pairs |
|---|---|---|---|
| P1-1 | Theme button shows the sun in dark mode | `src/app.js` `Theme.sync`: `toggleAttribute('hidden', …)` on the two SVG icons | `p1-theme-toggle-dark-1440`, `p1-theme-toggle-light-1440`; real button click checked: `p1-theme-toggle-after-button-1440-after` (moon shown, then sun shown, label flips) |
| P1-2 | `--scrim` token; the search ground darkens in dark mode | `src/styles.css` `:root` and dark block (`--scrim`), `#cp-search` | `p1-search-scrim-dark-1440`, `p1-search-scrim-light-1440` |
| P1-3 | Dark `--bar-4: #636a73`; light figure on the dark `.sa-sc` badge | `src/styles.css` dark block; `src/modules/summary-a.css` (`:root[data-theme="dark"] .sa-sc`) | `p1-dark-bars-phone-glance`, `p1-dark-bars-chapter-1440`, `p1-dark-bars-chain-1440`, `p1-dark-bars-chips-1440`, `p1-dark-badge-suppliers-1440` (+ `-zoom`); light unchanged `p1-light-badge-suppliers-1440` |
| P1-4 | Search snippets without footnote numbers | `src/app.js` `Tools.buildIndex` (section loop clones each block and drops `sup.cite`; space before punctuation closed) | `p1-search-hbm-1440`, `p1-search-hbm-dark-1440` ("…per pin." and "…with twelve.") |
| P2-1 | Laptop front door: the chain at a glance at every width; Other pages replaces the three boxed links at the walk's end | `build/modules/walk.js` (`OTHER` partial moved into `.wk-end`, `.wk-end-links` dropped, comments updated); `src/modules/walk.css` (base `display:none` gone, 701 px and 901 px blocks added, `.wk-end` and dead `.wk-end-links`/`.wk-end-t`/`.wk-end-p` rules removed, comment rewritten) | `p2-front-door-1440`, `-1024`, `-800` (light and dark), `-1440-full`; `p2-walk-end-1440`, `-dark-1440`, `-1024`, `-390`, `-320`. Phone: `p2-front-door-390` is pixel-identical below the masthead (image diff: none); `-390-full2` differs only where the dotted glossary rule (P2.6) starts |
| P2-2 | Current tab on the masthead rule; unboxed icon buttons with a short upright rule | `src/styles.css` masthead: `.theme-toggle`, `.search-btn`, new `:hover` rule, `@media (min-width: 901px)` block, 1240/1060 px padding, 900 px `.tabs`/`.tabs a` | `p2-masthead-chain-1440`, `-dark-1440`, `-1024`, `-960`, `-901`, `-800`, `p2-masthead-home-1440`, `p2-masthead-glossary-1440`; focus ring `p2-masthead-focus-1440-after` |
| P2-3 | Phones at 480 px and below drop the Home tab | `src/styles.css` 480 and 380 px rules | `p2-phone-tabs-{chain,home}-{480,390,360,320}`, `p2-phone-tabs-glossary-390`, `p2-phone-tabs-dark-390` |
| P2-4 | Phone search; the marked Enter target; the magnifier in the box (dark stroke `#939aa3`) | `src/styles.css` search section | `p2-search-phone-390`, `-dark-390`, `-320`; `p1-search-hbm-1440`; with a "Nothing matches" note `p2-search-nomatch-1440-after`; focus moves the mark `p2-search-focus-third-1440-after` |
| P2-6 | Footer on the ledger grid with the inline tile | `build/build.js`: only the `fill('FOOTER'…)`/`fill('FOOTER_KEY'…)` line (the tile is prefixed there, taken from the template's own `svg.wm-tile`; `credits`, `footer`, `footerKey` untouched); `src/styles.css` footer section | `p2-footer-walk-1440`, `-1024`, `-390`, `-320`; `p2-footer-chain-1440`, `-dark-1440`, `-390`; other views unchanged `p2-footer-glossary-1440` |
| P2-7 (pass 1) | Named type and spacing tokens in `:root` | `src/styles.css` `:root` | none (no selector uses them yet) |
| P3-1 | Empty search suggests six things to try | `src/app.js` `Tools.open` (Try row, hides on typing), new `Tools.tryNames`; `src/styles.css` `.cp-search-try` | `p3-search-empty-1440`, `-dark-1440`, `-390`; tap fills and searches `p3-search-try-click-1440-after` |
| P3-3 | One visible h1 per view | `src/template.html` (four `.view-head` titles, `.howto-title`); `build/modules/walk.js` (`wk-title`); `src/styles.css` (`.view-head h1`, `.howto h1.howto-title`) | no visual change; DOM check: stack, landscape, suppliers, controls, walk, glossary each have one visible h1 |
| chapter P2.6 | `.gl-term` dotted rule, solid garnet on hover and when open | `src/styles.css` `.gl-term` | `p2-gl-prose-1440`, `-dark-1440`, `-390`, `p2-gl-walk-1440`, `-dark-1440`, `p2-gl-open-1440` |

Checks: `check-speak` no matches; `check-integrity` only the known Veeco warning; `check-sources` all A or B; `scrollWidth` 320 at 320 px on all seven routes and with search open. Masthead height unchanged (56 px laptop, 70 px phone at every phone width).

## Changed from the report, and why
- **P2-1:** the walk's own headings move up a level (glance heading and step titles `h3` to `h2`) so the outline under the new `h1` does not skip a level. No visual change.
- **P2-3:** at 380 px and below the tab's bottom padding is 10 px, not 9. The 11 px type is 0.8 px shorter, and without it the page sat 1 px higher than at 390.
- **P2-2:** desktop tabs draw their focus ring inside the tab (`outline-offset: -4px`), since a full-height tab put the ring's top edge off screen.
- **P2-4:** the Enter glyph uses `content: "…" / ""` so screen readers do not read it as part of the link; the mark also finds the first link when a "Nothing matches" note heads the list; the hover rule survives while another row is focused.
- **P3-1:** the row is hidden by `hidden` from JS, not `:has()`. The six are drawn per visit the way the Glossary's Try row draws them (two short terms, two Critical or Important firms, one chip, one country, from `#lk-items`), not a fixed list, because the Glossary's own list is drawn the same way. A chip is shown by its model ("Ascend 950PR").
- **P2-6:** The Chain on phones keeps a flush footer (its chapters drop the ledger column below 901 px, so an indented footer misaligned). The grid is screen-only, so the PDF footer is untouched.

## Not done
- P2-5 (chapter builder) and P3-2 (owner keeps light as default), per BUILD.md.
- P2-7 remap pass: waits for the main session.
- Views other than the walk still go from `h1` to `h3` (their body headings belong to the data and chapter builders).

## For other builders
- **print:** `src/modules/print.css` styles `.howto h2` and `.howto h2.howto-title` (about line 252). The title is now `h1`, so add `.howto h1.howto-title` or the PDF title takes the screen size. The footer tile is hidden in print.
- **print:** `build/modules/summary-brief.js` dark tokens still set `--bar-4: #c3c7cd` (twice).
- **data:** `src/modules/lookup.js` `suggest` shows "(HiSilicon) Ascend 950PR" and "with Broadcom Jalapeño" when it draws those chips. Its vendor regex lacks Amazon and leaves a bracketed design house.

## P2-7 remap (second pass, 21 October 2026)

Every screen type declaration in `src/styles.css`, `src/modules/{walk,summary-a,suppliers,controls,chips,lookup}.css` and `build/assets/chapter-page.css` now uses the named scale. Nothing under `@media print`, and nothing in `print.css` or `print.js`, was touched. The full table (file, selector, media, face, old size to token, tracking, and the reason for anything kept) is in `qa/design/build/frame/p27/remap-table.txt`.

**Method.** I parsed the sheets with tinycss2. Each rule's face (label, serif or display) and case came from its own `font-family` and `text-transform`, or else from the computed style of a matching element in the live page. For a rule inside a media query, that element was read at a width where the query applies (1440, 1024, 800, 390 or 360), and each view was opened in the states that render its JS-built parts. The report's mapping rules then applied, with a limit of 1.5 px per move. Values were replaced in place, so no file was reformatted.

- **Pass 1, labels and capitals:** 200 sizes and 124 tracking values. Capitals take 10 px with `--tr-cap-s` or 11 px with `--tr-cap`. A 10.5 px capital goes to 11 px where it heads something or is a control, and to 10 px inside a dense row. Country codes, tier letters and stage numbers take 10 px. Sentence case at 11–12.5 px takes 12 px, and at 13–14.5 px takes 13.5 px.
- **Pass 2, serif and display:** 176 sizes and 2 tracking values. Page titles take `--fs-d1`, so the walk's title is now 62 px like every other page title.
- **The ledger exception:** `--fs-cap-xs` is gone. `.ch-tile .of` ("Stage 4 of 15") is now 10 px and does not wrap at 1440, 1280, 1101, 1100, 1024 or 901, and no ledger label wraps.
- **Tokens for the static pages:** `chapter-page.css` `:root` now carries the tokens.

**Kept off the scale, on purpose:**
- The masthead, tabs, wordmark, body sizes and inputs (16 px stops iOS zoom).
- Chart, board and map labels fitted to their geometry: HTML bars, China panel ticks and values, board 10–10.5 px sentence case, map stops. The China panel titles (`.ex-panel figcaption b`) stay 15 px, because 16.5 px wrapped the peak line in the small multiples.
- Em-sized footnote marks.
- Sizes more than 1.5 px from a step, such as phone title sizes and small Fraunces popover lines (12.5–14.5 px).
- Code and caption faces.
- Unused legacy selectors.

**The PDFs are unchanged.** I compared the computed print-media size, tracking and leading of all 9,371 text elements in The Chain, old sheet against new: 0 differ. Eight rules that print.css inherits without setting a size of its own keep their old values on purpose: `.src-meta`, `.fc-q`, `.fc-why` and `.prevnext .pn .t` (size), and `.tier`, `.fc-more`, `.ledger-key` and `.howto-alt` (tracking). The print builder can render without rechecking type.

**Result (computed-style sweep of every view plus search, `p27/sweep-*.json`):**

| | 1440 before | 1440 after | 390 before | 390 after |
|---|---|---|---|---|
| Distinct type styles | 120 | 93 | 114 | 88 |
| Label (Instrument Sans) styles | 61 | 46 | 59 | 45 |
| Uppercase variants | 20 | 12 | 19 | 12 |
| Serif (Source Serif) styles | 25 | 16 | 23 | 14 |
| Display (Fraunces) styles | 25 | 22 | 25 | 22 |
| Tracking values | 19 | 16 | 19 | 15 |

Pass 1 alone took 1440 to 107 styles.

**Checks:**
- The masthead is still 56 px on a laptop, 72 px at 800 and 70 px on phones, and `--masthead` is unchanged.
- `scrollWidth` is 320 on all seven routes, and the static chapter page is 320 too.
- `check-speak` finds no matches, `check-integrity` gives only the Veeco warning, and `check-sources` reports all sources A or B.

**Shots.** The before/after pairs are in `qa/design/build/frame/p27/`, at 1440, 1024 and 390 plus a 1440 dark set. They cover the walk (top, a step and the end), The Chain (chapter head, the chokepoint card, a figure and the contents), Suppliers (map and list), Export Controls (the board and the timeline), the China panels, AI Chips (picker and table), and the Glossary (list and an entry). The card, figure, list, board, panels and walk-end befores were taken by loading the pre-remap sheet into the live page, so the scroll position matches exactly. Visible change is a half to one pixel on labels and reading text. The deks grow from 20 px to 21 px, and the Export Controls sub-tabs now fit one line each on a phone.
