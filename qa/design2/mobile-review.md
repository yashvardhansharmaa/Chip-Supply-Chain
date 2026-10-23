# Design round two: phones, tablets and touch (slug `mobile`, 23 October 2026)

Shots: `qa/design2/shots/mobile/`. Proof CSS, one file per proposal, ready to paste: `qa/design2/shots/mobile/css/`.
Method: headless Chrome on `http://127.0.0.1:8765/`, phone emulation (2x, touch, iPhone user agent) at 390 x 844, 360 x 780 and 320 x 568, tablets at 768 x 1024 and 1024 x 1366, a phone on its side at 844 x 390, and the iPhone home indicator emulated with `Emulation.setSafeAreaInsetsOverride` (bottom 34 px). Every number below was read from the page with an eval. Light theme throughout (the default). Items in flight (speed and accessibility, `qa/code-review/PLAN.md` 1 to 14) are left out.

## 1. Verdict

On a 390 phone in portrait the site already reads like a book: 17 px Source Serif at a 1.58 leading, no sideways scroll on any route at 320, a 16 px Glossary field, a site search that rises over the page, and an AI Chips picker that behaves like a real bottom sheet (86 percent tall, scrim, 44 px close, 16 px field, 53 px rows). Where it breaks is wherever the phone stops being a 390 portrait screen or the page stops being prose. The two fixed bars cost 198 px of every screen (23 percent at 390, 25 at 360, 35 at 320) and 51 percent of a phone held sideways, which leaves 190 px, six lines of text. The AI Chips table, the one tool built for comparing, never shows two chips at once on a phone: the row names take 172 of 354 px, so even a two-chip comparison puts the second chip off screen. The Contents sheet is a full-screen takeover that does not say which chapter the reader is in and offers no way into a chapter's sections, while each chapter runs 14.5 to 21.4 phone screens (281 for The Chain) and opens with 3,100 to 3,700 px of head, plain terms, In short and card before the first body paragraph. The strip's buttons sit inside the iPhone's home indicator zone, and the Suppliers search and selects are 13 px, so iOS zooms the page when a reader taps them. The ledger identity itself holds up on glass: hairlines, square corners and the paper ground suit a phone better than cards and shadows would. What does not carry over is the desktop's structure, a fixed specimen beside the text, which on a phone became a permanent 128 px bar. The best reference apps (the Economist's, the FT's, the Guardian's) keep one slim bar or let the chrome step aside while the reader reads, and give the reader a map of where they are. That is the main structural choice below (P2.2), with two proven options.

## Measurements

**Fixed bars** (masthead + bottom strip, chapter or tool page with a specimen. Data pages carry a 48 px strip instead of 128)

| Viewport | Masthead | Strip | Fixed share | Reading height |
|---|---|---|---|---|
| 390 x 844 | 70 | 128 | 23% | 646 px |
| 360 x 780 | 70 | 128 | 25% | 582 px |
| 320 x 568 | 70 | 128 | 35% | 370 px |
| 844 x 390 (on its side) | 72 | 128 | 51% | 190 px |
| 768 x 1024 | 72 | 128 | 20% | 824 px |
| 1024 x 1366 | 56 | side stage | 4% | laptop layout |

**Chapter length on a phone** (chapters forced to render, so these are true heights, not `contain-intrinsic-size` estimates)

| Width | Shortest | Longest | The Chain in all | First body paragraph, from the chapter top |
|---|---|---|---|---|
| 390 | 12,196 px, 14.5 screens (Test and Assembly) | 18,022 px, 21.4 screens (Who Controls the Chain) | 241,668 px, 281 screens | 3,145 to 3,695 px (3.7 to 4.4 screens) |
| 360 | 12,983 px, 16.6 screens | 19,533 px, 25.0 screens | 258,609 px, 325 screens | 3,314 to 3,903 px |
| 320 | 14,364 px, 25.3 screens | 21,582 px, 38.0 screens | 287,828 px, 497 screens | 3,703 to 4,328 px |

A stage chapter at 390 is the head (312 px), In plain terms (about 660), In short (420 to 690), the chokepoint card (1,420 to 1,830), the body (8,960 to 11,940), flashcards (470 to 650), then sources and Previous and Next. Inside the body there are five to seven sections, two to five figures and up to five tables. Nothing on a phone lets a reader see those sections or jump between them. Other long pages: Export Controls by date 20,237 px (24 screens), Suppliers 6,900 px, Home 22,536 px, the static `/suppliers/` page 118,309 px (140 screens, but it has a stage index at the top).

**Tap targets at 390** (controls only. Inline links and glossary terms inside running text are exempt under WCAG 2.5.8)
- Under 24 px: on Home and The Chain, only glossary terms in running text (22 px tall, exempt). Export Controls: 61 citation links at 16 px tall (`a.cf-ev-cite`), each on its own line and more than 24 px from the next target, so they pass by spacing. Suppliers: the 15 atlas stops are 9 x 9 px but `pointer-events: none` on a phone by design. Firm names in the ladder are 22 px tall in a 26 px line, which passes by spacing but is tight for a thumb.
- 24 to 43 px: the tabs (35 px tall), search and theme (32 x 32), the strip's Top, Contents and Expand (35 px), the pause (28 x 28), the Contents sheet's close (36 x 36), the board's More and Link (26 px).
- Reach: every route puts the main navigation in the top 70 px, the hardest band for a thumb. The strip's buttons sit in the easy band at the foot. The Contents sheet's only close is its top right corner, at y 14.

**Form fields** (computed size. iOS zooms on focus under 16 px): `#sup-search`, `#sup-country`, `#sup-chk` 13 px. `#gl-search`, the site search field and the AI Chips picker field 16 px.

**Safe areas:** the viewport meta is `width=device-width, initial-scale=1`, with no `viewport-fit=cover`, and no rule on the site uses `env(safe-area-inset-*)` except the AI Chips sheet (`chips.css:119`), which reads 0 until the meta changes. With a 34 px home indicator, the strip's buttons span y 801 to 836 and the indicator zone is 810 to 844.

## 2. Proposals

### P1: broken or confusing on a phone

#### P1.1 The Suppliers search and selects zoom the page on iPhone
- **Type:** Fix
- **Where:** `#/suppliers`, every phone width, both themes.
- **What is wrong:** the search box and the two selects compute to 13 px (`src/styles.css` `.filters input, .filters select { font-size: 13px }`, with no phone override in `suppliers.css`). iOS Safari zooms the page to fit any focused field under 16 px and leaves it zoomed after the reader is done, so the ladder sits off to the side until they pinch back. The Glossary field (16 px) and the AI Chips picker (16 px, with a comment saying why) already avoid this.
- **Change:** `src/modules/suppliers.css`, inside the existing `@media (max-width: 699px)` block:
  ```css
  .view[data-view="suppliers"] .filters input, .view[data-view="suppliers"] .filters select { font-size: 16px; padding-top: 10px; padding-bottom: 10px; }
  ```
  Fields grow from 39 to 47 px tall, an easier target as well.
- **Shots:** `qa/design2/shots/mobile/p1-1-inputs-before.png`, `p1-1-inputs-after.png` (CSS `css/p1-inputs.css`).
- **Risk:** none. **Touches:** nothing else. **Size:** S.

#### P1.2 A phone on its side shows six lines of text
- **Type:** Fix
- **Where:** any phone held sideways (844 x 390 measured, the same on every iPhone and most Android phones), every route with a specimen.
- **What is wrong:** both bars keep their portrait shape. The masthead stays two rows (72 px) and the strip stays 128 px with a three-line caption, so 51 percent of the screen is chrome and the reading area is 190 px. The masthead's second row also restores the Home tab, since the 480 px rule that drops it does not apply at 844.
- **Change:** `src/styles.css`, a new block after the 900 px rules. One 44 px masthead row (the wordmark, then the tabs filling the full bar height as on a laptop, then search and theme) and one 48 px strip row (a 40 px thumbnail, the plate line with the pause at its end, the three buttons). The caption is read in Expand.
  ```css
  @media (max-width: 900px) and (max-height: 500px) {
    :root { --masthead: 44px; }
    .masthead { flex-wrap: nowrap; height: 44px; min-height: 0; padding: 0 max(12px, env(safe-area-inset-right)) 0 max(12px, env(safe-area-inset-left)); gap: 0 16px; }
    .wordmark { flex: 0 0 auto; padding-right: 0; min-height: 44px; }
    .tabs { order: 0; flex: 1 1 auto; width: auto; min-width: 0; margin: 0; justify-content: flex-end; align-self: stretch; align-items: stretch; }
    .tabs a { display: flex; align-items: center; padding: 0 8px; margin-bottom: -1px; }
    .masthead .search-btn, .masthead .theme-toggle { position: static; align-self: center; }
    .masthead:has(.tabs[data-end="0"])::after { display: none; }
    .stage { height: 48px; grid-template-columns: 40px minmax(0, 1fr) auto; grid-template-rows: 1fr; align-items: center; padding: 4px max(12px, env(safe-area-inset-right)) 4px max(8px, env(safe-area-inset-left)); }
    .stage canvas { grid-row: 1; width: 40px; height: 40px; }
    .stage .stage-tag { grid-column: 2; grid-row: 1; padding: 0; display: flex; align-items: center; gap: 10px; }
    .stage .stage-pause { position: static; width: 28px; height: 28px; margin: 0; flex: none; }
    .stage figcaption { display: none; }
    .stage .stage-actions { grid-column: 3; grid-row: 1; align-self: center; }
    .stage .stage-actions button { padding: 7px 10px; }
    body { padding-bottom: 64px; }
  }
  ```
  Measured after: masthead 44, strip 48, reading height 298 px (from 190, +57 percent), fixed share 24 percent. Tabs become 44 px tall targets.
- **Shots:** `p1-2-landscape-before.png`, `p1-2-landscape-after.png` (CSS `css/p1-landscape.css`).
- **Risk:** the masthead's measured height drives `--masthead` in `app.js`, so it must read 44 here (it measures at runtime, so it should). The expanded specimen in landscape keeps its `min(58vh, 480px)` and still covers most of the screen, worth a look when built. **Touches:** the accessibility builder's `scroll-padding` under the bars (it reads `--masthead`, so it follows). **Size:** S.

#### P1.3 AI Chips on a phone never shows two chips side by side
- **Type:** Fix (a refinement of the Slots build, which stays)
- **Where:** `#/landscape`, every phone width, the Specs side by side table.
- **What is wrong:** the row names are a sticky column 172 px wide (`.cx-rowhead`, `white-space: nowrap`, 112 px minimum, widened by "Foundry, process node"), and each chip column has a 138 px minimum. In a 354 px box, two chips make a 517 px table and four make 861 px. With two chips the second one is already off screen. With four, one chip shows at a time. A comparison that can only be read by swiping back and forth, one value at a time, is a lookup, not a comparison. On top of that the Comparing bar wraps to two rows with four chips, so the fixed chrome is 70 + 79 + 128 px. The `@container` rules that share the width equally only start at 520 and 640 px.
- **Change:** `src/modules/chips.css`, after the two `@container` rules. Below 520 px each row's name becomes a caption line above its values, and the values sit in as many equal columns as there are chips. The Comparing bar on a phone becomes one row whose names sit in the same columns, so it works as the table's sticky header.
  ```css
  @container (max-width: 519px) {
    .cx-table, .cx-table thead, .cx-table tbody { display: block; }
    .cx-table tr { display: grid; grid-template-columns: repeat(var(--cx-n, 2), minmax(0, 1fr)); column-gap: 12px; padding: 10px 0 12px; border-bottom: 1px solid var(--line); }
    .cx-table[data-n="3"] tr { --cx-n: 3; } .cx-table[data-n="4"] tr { --cx-n: 4; column-gap: 8px; }
    .cx-table th, .cx-table td { padding: 0; border: 0; min-width: 0; overflow-wrap: anywhere; }
    .cx-table .cx-rowhead { grid-column: 1 / -1; position: static; border-right: 0; white-space: normal; min-width: 0; padding: 0 0 5px; background: none; }
    .cx-table thead .cx-rowhead { display: none; }
    .cx-table .cx-col, .cx-table .cx-long { min-width: 0; max-width: none; }
    .cx-colhead { padding-right: 0; } .cx-colhead b { font-size: var(--fs-d6); }
    .cx-table th.cx-col .cx-x { display: none; }
    .cx-colacts { gap: 2px 10px; } .cx-jump { text-align: left; }
  }
  @media (max-width: 900px) {
    .cxs-list { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 8px; }
    .cxs-chip { min-width: 0; }
    .cxs-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-left: 7px; }
    .cxs-x { width: 24px; flex: none; }
    .cxs-clear, .cxs-add { display: none; }
  }
  ```
  `app.js` should stop setting `data-more` and showing "Scroll sideways to see every chip" when the table no longer overflows (the proof hides both by CSS). Measured after: the table is exactly 354 px wide (no sideways scroll), the Comparing bar is 46 px (from 79). The price is height: four chips make the table 4,841 px (from 2,580) because long values wrap in 85 px columns. Two chips: 2,589 px (from 2,231).
- **Shots:** two chips `p1-3-chips-2-before.png`, `p1-3-chips-2-after.png`. Four chips `p1-3-chips-4-before.png`, `p1-3-chips-4-after.png`. The sideways scroll today `tool-390-chips-table-scrolled.png` (CSS `css/p1-chips-table.css`).
- **Risk:** the bar's Add and Clear leave the bar on a phone (both remain in the slots above, and Remove stays on each name in the bar). The column-focus tint (`.is-focus`) still works per cell. Changing `display` on table parts has dropped table semantics in some Safari versions, so add `role="table"`, `row`, `rowheader`, `columnheader` and `cell` in the markup, or test VoiceOver once built. **Touches:** the "Packages at one scale" plans above are untouched. **Size:** M.

### P2: clear upgrades

#### P2.1 The Contents sheet: a real sheet that knows where the reader is
- **Type:** Fix (the sheet's behavior), with one Decision inside (listing sections)
- **Where:** the strip's Contents button, every phone width and the 768 tablet, every route.
- **What is wrong:** the sheet is `inset: 0`, a full-screen page with no scrim, no edge to tap away and its only close button 36 x 36 at the very top right (y 14). It does not mark the chapter the reader is in (no `aria-current` anywhere in it), so on a 281-screen page the reader has to remember a number. It lists 17 chapters and six page links that repeat the masthead's tabs, and nothing inside the chapter: a reader 9 screens into Lithography cannot jump to "Who makes it" or to the flashcards. The AI Chips picker on the same site is already the right pattern.
- **Change:**
  1. `src/styles.css`, the contents-sheet rules in the 900 px block: the sheet rises to 86 percent over the site's scrim, with a sticky head, a square grab bar, a 44 px close, the current chapter marked with the garnet edge and its sections under it, and the page links moved to the foot.
     ```css
     .sheet { inset: auto 0 0 0; max-height: 86vh; max-height: 86dvh; padding: 0 16px calc(20px + env(safe-area-inset-bottom)); border-top: 2px solid var(--ink); overscroll-behavior: contain; }
     body:has(.sheet:not([hidden]))::after { content: ""; position: fixed; inset: 0; z-index: 59; background: var(--scrim); }
     .sheet-head { position: sticky; top: 0; z-index: 1; background: var(--bg); margin: 0; padding: 16px 0 10px; border-bottom: 1px solid var(--ink); }
     .sheet-head::before { content: ""; position: absolute; top: 6px; left: 50%; width: 36px; height: 3px; margin-left: -18px; background: var(--line-2); }
     .sheet-close { width: 44px; height: 44px; margin-right: -6px; }
     .sheet-chapters { border-top: 0; }
     .sheet-chapters a[aria-current] { box-shadow: inset 2px 0 0 var(--accent); padding-left: 10px; margin-left: -10px; border-bottom-color: transparent; }
     .sheet-chapters a[aria-current] .n { color: var(--accent); }
     .sheet-secs { list-style: none; margin: -4px 0 0; padding: 0 0 10px 44px; border-bottom: 1px solid var(--line); }
     .sheet-chapters li:not(:has(> a[aria-current])) .sheet-secs { display: none; }
     .sheet-secs a { display: block; padding: 9px 0; border: 0; font-family: var(--font-body); font-size: var(--fs-small); line-height: 1.35; color: var(--ink-2); text-decoration: none; }
     .sheet-secs a[aria-current] { color: var(--ink); box-shadow: inset 2px 0 0 var(--ink); padding-left: 10px; margin-left: -12px; }
     .sheet-pages { margin: 22px 0 0; padding-top: 16px; border-top: 1px solid var(--line); }
     ```
  2. `src/template.html` line 78: move `<nav class="sheet-pages">` after the `<ol>`. `build/build.js`, where `SHEET_CHAPTERS` is built: under each chapter's `<li>`, a `<ul class="sheet-secs">` of its `h3[id]` links (the ids already exist, for example `lithography--who-makes-it`), plus "Flashcards and sources" pointing at the chapter's review block.
  3. `src/app.js` `Band.init`, in `open(true)`: set `aria-current="location"` on the current chapter's link and on the section in view (the router already knows both, since the strip shows "Specimen 04"), and scroll the sheet so that chapter sits under the head. A tap on the scrim closes the sheet the same way the close button does.
  Measured after: the sheet is 726 px tall from y 118, the close is 44 x 44, section rows are 39 px.
- **Shots:** `p2-1-sheet-before.png`, `p2-1-sheet-after.png` (CSS `css/p2-sheet.css`. The section list was injected for the proof).
- **Risk:** the accessibility builder owns the sheet's focus handling (inert page, focus to close and back). This change keeps their `open()` and adds to it, so the two should land together. **Touches:** `build/build.js` sheet markup, the 768 tablet (it shares the 900 px rules). **Decision inside:** listing sections only for the current chapter keeps the sheet short. Listing them for all 17 would make it about 2,800 px long. **Size:** M.

#### P2.2 The bars while reading: two structures for the owner to choose from
- **Type:** Decision
- **Where:** every route with a specimen, phones in portrait (390 shown).
- **What is wrong:** the strip is a desktop idea folded into a phone. It holds a 116 px turning thumbnail, a caption cut off mid-sentence after three lines ("...the blue-violet..."), and three buttons, and it stays for the whole of a 14 to 21 screen chapter. With the masthead it takes 198 px of every screen. The caption fragment is the weakest moment in the phone design: a sentence that cannot be finished in a reference work. The turning model is also the one moving thing in the reader's side vision while they read, though the pause exists.
- **Option A, the slim strip (same structure, smaller).** 72 px: the thumbnail spans two rows (60 px), the plate line with the pause at its end on the first row, Top, Contents and Expand on the second. The caption shows when expanded.
  ```css
  @media (max-width: 900px) {
    .stage { height: 72px; grid-template-columns: 60px minmax(0, 1fr); grid-template-rows: 22px 1fr; column-gap: 12px; row-gap: 2px; padding: 6px 10px 6px 6px; }
    .stage canvas { grid-row: 1 / -1; width: 60px; height: 60px; }
    .stage .stage-tag { grid-column: 2; grid-row: 1; padding: 3px 0 0; overflow: visible; }
    .stage figcaption { display: none; }
    .stage .stage-actions { grid-column: 2; grid-row: 2; align-self: end; }
    .stage .stage-actions button { padding: 6px 10px; }
    .stage[data-collapsed="1"] .stage-pause { position: static; width: 24px; height: 24px; margin: -6px 0 -6px 10px; }
    .stage[data-collapsed="0"] figcaption { display: -webkit-box; }
    body { padding-bottom: 84px; }
    html.kb { scroll-padding-bottom: 84px; }
  }
  ```
  Reading height 702 px (from 646, +9 percent). About two fewer screens per chapter at 390.
  Shot: `p2-2-strip-optionA-slim.png`.
- **Option B, the bars step aside (different structure).** Scrolling down slides the masthead up and the strip down. Any scroll up, a tap at the top edge, opening a glossary term, or reaching a chapter's end brings both back. A 2 px garnet rule at the top shows how far through the chapter the reader is, the one mark left on screen. Reading height while reading: 844 px, the whole screen.
  ```css
  @media (max-width: 900px) {
    .masthead, .stage { transition: transform 0.28s var(--ease); }
    html.cp-away .masthead { transform: translateY(calc(-100% - 1px)); }
    html.cp-away .stage[data-collapsed="1"] { transform: translateY(calc(100% + 1px)); }
    html.cp-away body::before { content: ""; position: fixed; top: 0; left: 0; z-index: 41; height: 2px; width: var(--cp-read, 0%); background: var(--accent-fill); }
  }
  @media (prefers-reduced-motion: reduce) { .masthead, .stage { transition: none; } }
  ```
  Plus about 20 lines in `src/app.js` `Band`: on scroll, add `cp-away` after 24 px of downward travel past the chapter head, remove it on any upward travel or when focus moves by keyboard (`html.kb`), and set `--cp-read` from the current chapter's progress.
  Shot (the reading state): `p2-2-strip-optionB-away.png`. Before, for both: `p2-2-strip-before.png`.
- **What each costs:** A changes only the strip and touches decision 8 (the caption's wording is unchanged, but on a phone it moves from the collapsed strip to the expanded one). B keeps the strip as it is when shown, so the caption is untouched, but it is new behavior: the reader has to learn that a small upward flick brings the bars back, and the accessibility builder's `scroll-padding` and the focus-under-bars fix must remove `cp-away` whenever focus moves. Transforms on fixed bars cause no layout shift. **Recommendation:** B. It is the pattern the best reading apps use, it gives the reader the whole screen for 14 to 21 screens of prose, and it leaves the caption as the owner set it. A is the safe minimum if the owner prefers the bars always present. **Size:** A is S, B is M.

#### P2.3 The chapter opener on a phone: the card's three ratings in one row, the rest folded
- **Type:** Decision
- **Where:** every stage chapter on a phone (390 shown), and the same card on the static chapter pages.
- **What is wrong:** the first body paragraph starts 3,145 to 3,695 px below the chapter's top at 390, four screens of head, In plain terms, In short and the chokepoint card. The card alone is 1,564 px in Lithography: its three ratings stack as three 145 px blocks, each repeating the definition its glossary button already opens, then Who leads, Where it is made, Why substitution is slow, Where China stands and Where the US stands. Over 15 chapters that is about 20,000 px of card before reading starts.
- **Change:** on phones under 640 px, the three ratings sit side by side and drop the repeated definition (the value is the glossary button, so a tap still gives it). The rest of the card folds under one ruled line, "The whole card". `build/build.js` (the card template around line 425) wraps `.plate-rows` and `.plate-status` in `<details class="plate-fold"><summary>The whole card</summary>…</details>`, open by default from 641 px and in print, so laptops and the PDF are unchanged.
  ```css
  @media (max-width: 640px) {
    .plate-kpis { grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: 12px; }
    .plate-kpis > div, .plate-kpis > div + div { border-bottom: 0; padding: 10px 0 8px; }
    .plate-kpis > div + div { border-left: 1px solid var(--line); padding-left: 10px; }
    .plate-kpis .v { font-size: var(--fs-d4); line-height: 1.15; }
    .plate-kpis .sub { display: none; }
    .plate-fold > summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; min-height: 44px; border-top: 1px solid var(--line); font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-cap); letter-spacing: var(--tr-cap); text-transform: uppercase; color: var(--ink); }
    .plate-fold > summary::-webkit-details-marker { display: none; }
    .plate-fold > summary::after { content: "+"; font-size: 16px; color: var(--muted); }
    .plate-fold[open] > summary::after { content: "\2212"; }
  }
  ```
  Measured after (Lithography, 390): the card is 196 px (from 1,564), the first body paragraph starts at 1,946 px (from 3,314), 1.6 screens sooner.
- **Shots:** `p2-3-opener-before.png`, `p2-3-opener-after.png` (CSS `css/p2-opener.css`. The details element was injected for the proof).
- **Risk:** the card is the site's signature, and folding its lower half hides Who leads and Where China stands behind a tap. A lighter version keeps everything open and only puts the three ratings in a row: that alone saves about 330 px per chapter. `print.css` must force the details open. **Touches:** the static chapter pages use the same card (`build/assets/chapter-page.css` 640 px block), the PDF (unchanged if forced open). **Size:** M.

#### P2.4 The strip's buttons sit under the iPhone's home indicator
- **Type:** Fix
- **Where:** every route, every iPhone without a home button (all since the X), portrait and landscape.
- **What is wrong:** without `viewport-fit=cover`, `env(safe-area-inset-bottom)` is 0, and nothing on the site uses it anyway (the AI Chips sheet's rule at `chips.css:119` is dead until the meta changes). With the toolbar collapsed, the strip's Top, Contents and Expand span y 801 to 836 while the home indicator's gesture zone is 810 to 844, so with Safari's toolbar collapsed, the first tap there brings the toolbar back instead of pressing the button, and a drag that starts there is read as the swipe home. On its side, the notch then sits over the masthead's left edge once `cover` is set, so left and right insets are needed too.
- **Change:** `src/template.html` line 5 and the three static-page generators (`build/modules/reference-pages.js`, `summary-brief.js`, `social.js`): `content="width=device-width, initial-scale=1, viewport-fit=cover"`. Then in `src/styles.css`, 900 px block:
  ```css
  .stage { height: calc(128px + env(safe-area-inset-bottom)); padding-bottom: calc(8px + env(safe-area-inset-bottom)); }
  .stage[data-hidden="1"] { height: calc(48px + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom); }
  .stage[data-collapsed="1"] .stage-pause { bottom: calc(9px + env(safe-area-inset-bottom)); }
  body { padding-bottom: calc(140px + env(safe-area-inset-bottom)); }
  .sheet { padding-bottom: calc(90px + env(safe-area-inset-bottom)); }
  .masthead { padding-left: max(14px, env(safe-area-inset-left)); padding-right: max(14px, env(safe-area-inset-right)); }
  .column { padding-left: max(18px, env(safe-area-inset-left)); padding-right: max(18px, env(safe-area-inset-right)); }
  ```
  Measured with a 34 px inset: buttons move to y 767 to 802, clear of the zone. On devices without an inset nothing changes.
- **Shots:** `p2-4-safe-area-before.png`, `p2-4-safe-area-after.png` (the hatched band and the bar drawn in both shots mark the home indicator zone, 34 px. CSS `css/p2-safe-area.css`).
- **Risk:** low. Whichever of P2.2 A or B is chosen should add the inset to its own height. **Touches:** the static pages (no fixed bars there, so only the meta), the AI Chips sheet (its existing rule starts working). **Size:** S.

### P3: refinements

#### P3.1 At 320 px the Glossary tab hides behind the fade
- **Type:** Fix
- **Where:** every route at 320 (iPhone SE first generation, small Android phones, and any phone with large display zoom).
- **What is wrong:** the five tabs need 324 px in a 292 px row, so "Glossary" sits under the fade and chevron. The 480 px rule says the five should fit "a 360 px screen without scrolling", and they do at 360, but not at 320.
- **Change:** `src/styles.css`, after the 380 px rule:
  ```css
  @media (max-width: 340px) { .tabs a { padding-left: 3px; padding-right: 3px; font-size: 10.5px; letter-spacing: 0; } }
  ```
  Measured after: 292 of 292 px, every tab at least 47 x 35 px.
- **Shots:** `p3-1-tabs320-before.png`, `p3-1-tabs320-after.png` (CSS `css/p3-tabs320.css`).
- **Risk:** 10.5 px is small. The alternative is the label "Controls" at 340 px and under, which keeps 11 px. **Size:** S.

#### P3.2 The static pages' links break onto a third row on a phone
- **Type:** Fix
- **Where:** `/lithography/` and every static page, 390 and 360.
- **What is wrong:** the five links need 364 px in a 358 px row, so "Glossary" wraps onto a row of its own and the header is 127 px tall before the page begins. The comment in `chapter-page.css` expects the wrap only at 320.
- **Change:** `build/assets/chapter-page.css`:
  ```css
  @media (max-width: 800px) { .masthead nav { flex-wrap: nowrap; gap: 0; overflow-x: auto; scrollbar-width: none; } .masthead nav::-webkit-scrollbar { display: none; } }
  @media (max-width: 640px) { .masthead nav a { padding: 8px 4px 7px; } }
  ```
  Measured after: one row at 390, header 99 px (from 127). At 320 the row scrolls, as the app's tabs do.
- **Shots:** `p3-2-static-nav-before.png`, `p3-2-static-nav-after.png` (CSS `css/p3-static-nav.css`).
- **Risk:** none. **Size:** S.

## The system, through this lens
The ledger is right for phones. Hairlines, square corners and one red ink read cleanly on a small bright screen, and the type scale holds: 17 px body, 21 px ledes, 38 px titles. Two parts of the system do not survive the trip. The ledger column, the identity's "one thing to remember", shrinks to a 34 px gutter on Home and disappears from chapters, so a phone reader never meets it. The phone chapter head (the large numeral beside its two labels on one rule) is the only trace. The fixed specimen beside the text became a permanent bar, which is the structural cost this report keeps returning to. The 10 px tracked capitals (`--fs-cap-s`: stage numbers, country codes, card keys) are at the floor of what reads at arm's length. They pass, but nothing on a phone should go smaller. The structural alternatives worth the owner's time are P2.2 (how the chrome behaves) and P2.3 (how a chapter opens). P2.1 gives a phone reader the map that the laptop's rail used to give.

## Seen, not proposed (no proof pair yet)
- Export Controls "By date" is 20,237 px (24 screens) on a phone with no way to jump to a year. A one-row strip of years under the filter chips would do it.
- The 768 x 1024 tablet gets the phone layout stretched: a 629 px measure with 120 px empty at the right, the two-row masthead and the 128 px strip (20 percent fixed). The laptop's side specimen could start at 768 in portrait (a 476 px text column).
- The Chain's contents: each title is a 23 px link inside a 60 to 70 px row, and the one-liner under it is not a link. The whole row could take the tap.
- Expanded, the specimen covers 480 of 844 px with no scrim, and its pause takes a row of its own.
- `#/summary` opens Home. The Summary lives at the static `/summary/` page and the PDF, so the brief's route list is out of date, not the site.
- Data for the speed builder, not a proposal: true chapter heights at 390 are 12,196 to 18,022 px against the 13,500 px `contain-intrinsic-size` estimate, and 14,364 to 21,582 px at 320 against 16,000. While proving these proposals, scrolls to anchors landed off target until the chapters above had rendered.

## 3. Top five
1. **P1.3 AI Chips table on a phone.** Two to four chips side by side, no sideways scroll, the Comparing bar as the sticky header. `p1-3-chips-2-before.png` / `p1-3-chips-2-after.png`, `p1-3-chips-4-before.png` / `p1-3-chips-4-after.png`.
2. **P1.2 A phone on its side.** Reading height 190 to 298 px, chrome 51 to 24 percent. `p1-2-landscape-before.png` / `p1-2-landscape-after.png`.
3. **P2.1 The Contents sheet as a sheet that knows where the reader is,** with the current chapter's sections. `p2-1-sheet-before.png` / `p2-1-sheet-after.png`.
4. **P2.4 Clear the home indicator** (`viewport-fit=cover` and the insets). `p2-4-safe-area-before.png` / `p2-4-safe-area-after.png`.
5. **P2.2 The bars while reading, a Decision:** B, the bars step aside (recommended), or A, the slim strip. `p2-2-strip-before.png`, `p2-2-strip-optionB-away.png`, `p2-2-strip-optionA-slim.png`.

P1.1 (the 13 px Suppliers fields) is a one-line fix and should simply be done: `p1-1-inputs-before.png` / `p1-1-inputs-after.png`.
