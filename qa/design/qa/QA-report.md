# Design round QA report (21 October 2026)

Final read-only QA of the four builds (frame, chapter, data, print) against `qa/design/PLAN.md` and the builders' notes. The site was served from `dist/` at `http://127.0.0.1:8765/` (build stamp 2026-10-21T07:28Z). Nothing in the repo was edited and nothing was rebuilt. Screenshots are in `qa/design/qa/`, taken with headless Chrome (WebGL on) on port 9960/9961/9962, with a fresh browser context for each load, so no theme was saved.

Coverage: 10 routes × 1440, 1024, 390 (phone) and 320 (phone) × light and dark (`sweep-*.png`, 80 loads), plus targeted interaction runs (`t1`–`t22`).

**No P1 issues found.** No console errors, `window.onerror` or unhandled rejections came up on any route or interaction, and `scrollWidth` equals the viewport width at every size on every route.

---

## P2: should fix

### P2-1. The B200 cost table cuts off its Range column at 320 px (a regression from P2.4)
- **Where:** The Chain, ch 16 (`?only=component-costs#/chain`) and `/component-costs/`, at 320 phone, in both themes.
- **What:** Figure cells are now `white-space: nowrap`, so the three-column B200 table is 354 px wide inside a 284 px wrapper (372 px in a 288 px wrapper on the static page). The Range header is off screen, and the visible cells read "$2,", "$1,", "$". The wrapper scrolls sideways, but nothing on screen says so. If the figure cells could wrap, the table would fit at 284 px. Before this round it fit, because the ranges wrapped after the hyphen. At 390 px the ch 16 gross-margin table also overflows its wrapper (406 in 354). That table would still overflow (366) if the cells wrapped, so most of that is not new. Page-level `scrollWidth` is fine.
- **Shots:** `t20-b200-table-320-app.png`, `t20-b200-table-320-static.png`; `cmp-table-costs-390.png` (chapter builder's before/after at 390, for comparison).
- **Owner and fix:** chapter. Change `.prose td.n` / `th.n` in `src/styles.css` and `build/assets/chapter-page.css`. Either let range cells wrap below about 480 px, or put a `<wbr>` after the en dash in the `markdown()` table branch (`TABLE_FIGURE`) in `build/build.js`.

### P2-2. Glossary list cuts the "Equipment subsystems" label to "Equipment subsyste…"
- **Where:** `#/glossary`, at 1440, 1280 and 1024, in light and dark. It affects 14 firm rows (Advanced Energy Industries and others). The phone layout is fine.
- **What:** `.lk-lab` is `max-width: 48%`, `nowrap`, with an ellipsis (126.7 px), and the label needs 131 px. P2.4 promised whole labels on one line, but `LK_SHORT` has no short form for this stage.
- **Shot:** `t14-glossary-lab-cut-1440.png` (also in `sweep-glossary-1440-*.png`).
- **Owner and fix:** data. Add a short name, for example "Subsystems" or "Equipment parts", to `LK_SHORT` in `build/build.js` (Glossary list labels), or allow a little more `max-width` on `.lk-lab` in `src/modules/lookup.css`.

### P2-3. Readers never land on the approved "garnet only for Critical" ribbon view
- **Where:** `#/suppliers?tab=country`, at every width, in both themes.
- **What:** On a fresh load, the atlas above opens on the country the build marks (Taiwan) and calls `Suppliers.light('TW')`. So the ribbons open lit: Taiwan's 10 ribbons in green at 0.8 opacity, and every other Critical ribbon dimmed to 0.35. The unlit view in the approval proof (`build/data/P1.1-ribbons-unlit-after-1440.png`, where Critical is garnet and the rest is ink) only appears after the reader clears the atlas choice. Taiwan was also lit by default before this round, so this is not new behavior. It does mean the headline P1.1 change is mostly not what a first-time reader sees.
- **Shots:** `t6-ribbons-1440-light.png`, `t6-ribbons-390-light.png` (fresh loads, no interaction); compare with `build/data/P1.1-ribbons-unlit-after-1440.png`.
- **Owner and fix:** data, with the owner's call. In `Suppliers.light` (`src/app.js`), or where `src/modules/summary-a.js` calls `selectCountry` on start, light the ribbons only from the reader's own choice, not from the atlas's initial country.

---

## P3: polish

1. **On phones, the icon buttons keep their box after a tap.** `.search-btn:hover, .theme-toggle:hover` hovers stay "stuck" on touch screens, so the boxed button that P2-2 removed comes back after each tap. Owner: frame, `src/styles.css` around line 151. Wrap the rule in `@media (hover: hover)`. Shot: `t1-toggle-dark-390.png`.
2. **The search "Try" row can offer "OpenAI with Broadcom Jalapeño".** Frame's `Tools.tryNames` maker regex (`src/app.js`) has no "OpenAI with Broadcom", so this chip keeps its maker while every other chip shows only its model. The Glossary's Try row (data's `lookup.js`) was already fixed. Owner: frame. Either reuse the chip-name lookup from `lookup.js`, or add `OpenAI with Broadcom` to the regex.
3. **The PDF contents lede is slightly inaccurate.** `LEDE_END` in `src/modules/print.js` says "Each chapter ends with questions to answer from memory." In the PDF the questions print above "Four things to remember", and the sources follow, so a chapter does not end on its questions. Suggested wording: "Each chapter closes with questions to answer from memory." Otherwise the wording follows the house rules (no em dash, semicolon, we/you or "this site"). Owner: print.
4. **Footnote marks sit a little further from their word on the static chapter pages.** The gap is 3 px on `/lithography/`, against 2 px in the app. `build/assets/chapter-page.css` line 178 still has `sup.cite a { padding: 1px 2px }`, where P1.2 set `0 1px` in `src/styles.css`. Owner: chapter. Shot: `t11-static-litho-card-390-light.png` ("mirrors ⁴.").
5. **The focus ring on a date-mode board row overlaps the row's first letters.** The ring is `outline-offset: -2px` and the name starts at the button's edge ("AI chips…", "US → China"). Owner: data, `src/modules/controls.css` (`.cf-btn:focus-visible`). Shot: `t8-focus-boardrow-date-1440-dark.png`.
6. **A ribbon's tooltip covers the "Each country / EU-27 together" toggle while it has keyboard focus.** Owner: data (`Suppliers.showTip` placement). Shot: `t8-focus-ribbon-1440-light.png`.
7. **These were already there before this round. Noted only:**
   - The ribbon tooltip renders "Arm Holdings (United Kingdom) , Alphawave Semi" with a space before each comma, because the bold name sits on its own line (`t6-ribbons-hover-1440-dark.png`; also in `build/data/P1.1-ribbons-hover-before-1440.png`).
   - The AI Chips stage shows no specimen at 1440 or 1024, only the caption "Specimen 00 · the whole chip". This is the same as the 20 Oct build (`t9-chips-specimen-1440-light.png`).
   - Hoya's China panel prints two "10%" bars with one in garnet.
   - Chapter 15's contents one-liner runs 7 lines against 3–4 for the others.
   - "3 nm" breaks across a line in the ch 01 prose, and "6,000 mm2" appears in a ch 01 passage (both content).
   - After Enter in search, focus is left on `body`.

---

## Checked and fine

- **Theme:** with no saved choice and the device emulated as dark (`Emulation.setEmulatedMedia`), `#/`, `/lithography/`, `/summary/` and `/component-costs/` all open light (`data-theme` unset, background #f7f6f2). There is no `prefers-color-scheme` anywhere in `dist/` HTML outside print blocks. The real toggle button flips the theme, the label and the sun/moon icons, the choice persists, and toggling back works. The specimen is visible after toggling on desktop and on phone (`t1-*.png`).
- **Front door:** the laptop home leads with "The chain at a glance". "Other pages" (five rows) sits at the walk's end in both themes and at 390 (`sweep-walk-*`, `t5-walk-end-*`).
- **Phone masthead:** no Home tab at 390 or 320, and all five sections fit at 390. At 320 the strip scrolls with its chevron.
- **Chapters:**
  - No fixed rail on desktop; the only fixed or sticky parts are the masthead, Back to top, the stage and the ledger. The ledger key ("Extreme / High") shows at 1440 and 1024 and is hidden at 900 and below.
  - Bars: ink, with garnet on the largest (ties included), and the top value in accent ink, in both themes, in the app and on the static pages. No bar label is cut at 320, 390, 700, 1024 or 1440.
  - Stacks: garnet lead, then #2b63c4 / #1f9a6d / #c9a10c / #5a48b8 / #e06a1f (and the dark set), a light tail (Onto, Camtek, Rigaku), and hatched remainders ("All others", "Everyone else", "Teradyne and all others").
  - The three country stacks keep country colors: Europe takes the EU orange, and Other, Rest of Asia and EMEA are neutral.
  - The chokepoint card shows each band once, as a glossary button whose popover opens. There is no `.lead-cn` and no "x% of revenue" line on any card.
  - Figure columns are right-aligned with en-dash ranges (ch 03, 16, 17). The contents show one-liners, including "Across the chain".
- **Data pages:**
  - Ladder: the numerals are firm counts, with the heading "Stages by number of firms, fewest first", the key, and garnet squares per Critical firm.
  - Ribbons: hover lights both halves and shows the tooltip, and a click filters By stage ("3 of 226 suppliers · IP & Architecture · Other countries").
  - Drawer (ASML): reads Customers, Share, Founded, Ownership, Revenue, then From China with the mini chart. It opens and closes at every width and leaves no duplicate IDs.
  - Board: in By subject it has five-step scales. The dots move from 7 Sept 2026 to 31 Dec 2022 by arrow keys, at all four widths (`t7c-subject-2026-*`, `t7c-subject-31Dec2022-*`), with a 0.24 s slide. By date's compact board follows the scroll, as designed.
  - The China panels are packed. The exposure table is readable with garnet peaks. The AI Chips picker is a checklist.
  - Quiet export lines: board, timeline, comparison (after picking chips) and figures (inside the table view).
  - "Coming up" is garnet only within 30 days.
- **Glossary:** term, firm (with mini chart), chip and country cards (with share bars) render at 1440, 390 and 320, in light and dark.
- **Interactions:**
  - Search: "hbm" gives 14 results with no footnote digits, Enter opens HBM, the Try row shows, and `/`, Ctrl+K and Esc work. In dark, the scrim is `rgba(6,8,11,.72)`.
  - Glossary popovers open by click and by Enter, and footnote cards open on hover and on focus.
  - Flashcards turn at 1440 and 320, with no overflow.
  - Phone Contents opens and closes.
  - Tab focus is visible on the masthead tabs (garnet, 1px), the ribbons (garnet stroke 1.5px) and the board rows (2px).
- **Layout shift:** CLS on load is at most 0.0075 on every route (font swap), and 0 on phones.
- **Print-media spot check:** the ledger key and contents one-liners are hidden, stack tokens are pinned to their light values, and the footer "Updated" line is hidden.
- **Words:** the ladder heading and key, board scale labels, export lines, Coming up, search Try and hint, and the Other pages copy contain no em dashes, semicolons, we, you, "this site" or "rather than". The rendered footer reads exactly "Made by Yashvardhan Sharma with Claude. Corrections and questions: contact@chipsupplychain.org." on every view and on the static pages.
- **Scripts:**
  - `check-speak`: no matches.
  - `check-integrity`: only the known Veeco warning.
  - `check-sources`: 2,721 citations, all tier A or B.
  - `qa/scripts` has no axe or accessibility sweep, so none was run.
