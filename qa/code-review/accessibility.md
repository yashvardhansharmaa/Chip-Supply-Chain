# Accessibility review, WCAG 2.2 AA

21 October 2026. A review only: no site file was changed.

## What was tested

- **The build.** I tested the build that `http://127.0.0.1:8765/` serves, `dist/index.html`, built at 09:06. While I worked, someone else changed `src/app.js`, `src/template.html`, `src/modules/chips.css` and `build/build.js` (09:53 to 09:59). The change rebuilds the AI Chips picker as slots with a combobox dialog, so the AI Chips findings describe the served build and need a recheck after the next build. Fixes below cite functions and selectors, not `app.js` line numbers, because those lines have moved.
- **Tools.** I used headless Chrome over the DevTools protocol, with a harness modelled on `qa/design/shots/design-chapter/proof/dc_shoot.py`, on ports 9995 to 9999. I also used axe-core 4.10.3, a copy already on disk in another project's `node_modules`. I injected it into the page; nothing was downloaded.
- **My own checks.** I wrote scripts for these checks:
  - text contrast against the colour actually painted underneath, found with `elementsFromPoint`, in both themes;
  - target size, with the WCAG spacing and inline exceptions;
  - Tab walks that flag stops that are invisible, off screen or covered;
  - accessibility tree dumps;
  - reflow at 320 px;
  - the WCAG text-spacing override;
  - `prefers-reduced-motion` emulation.
- **Viewports.** I tested at 1440 × 900, on a 390 × 844 phone (2x, touch) and at 320 px wide, each in light and in dark (`?theme=dark`).
- **Not covered.** I did not test with a real screen reader (VoiceOver or NVDA), so screen-reader behaviour is inferred from Chrome's accessibility tree. I did not measure the contrast of the video frames or of the 3D point clouds.

## What already works

- **Language and titles.** Every page has `lang="en"`. Each view has one h1, and `document.title` follows the view.
- **Reflow.** No route scrolls sideways at 320 px.
- **Reduced motion.** It is honoured everywhere. Under reduce, I measured:
  - zero running animations after a year change on the board;
  - specimen spin stopped (0 rad in 2 s, against 0.22 rad normally);
  - no autoplaying videos;
  - smooth scrolling off.
- **Text contrast.** Body text, muted labels (5.6:1 light, 6.3:1 dark), garnet on paper (9.4:1) and dark red text (5.05:1) all pass.
- **Charts.**
  - The bar figures carry hidden data tables.
  - The China revenue bars are links named "ASML FY2021: 15% of revenue from China, opens the filing", and a table sits behind them.
  - The stacked bars have text legends with values.
  - The atlas has text stop cards.
- **Popovers.** Footnote and glossary popovers open on focus, close on Esc and keep focus on their trigger.
- **Flashcards.** They move focus sensibly and make the hidden face inert.
- **ARIA states.**
  - `aria-current="page"` on the masthead tabs is right.
  - The disclosures use `aria-expanded` correctly: firm names, the board rows, More, Cite this chapter, Browse all entries.
  - Toggles use `aria-pressed`: the chip picker, filter chips, country chips and years.
- **Forms.** Every field has an accessible name.
- **Animations.** The video-only animations have a transcript for screen readers and a pause control.

## Findings

Effort: XS is under an hour, S is half a day, M is one to two days.

### P1: blocks a group of readers

**1. In the Glossary, the chosen entry is about 480 Tab presses from the list.**

- **WCAG:** 2.4.3 Focus Order (A), the pattern of failure F85; 2.1.1 in practice.
- **Route:** `#/glossary`
- **Evidence:**
  - All 487 list entries are Tab stops, and the entry card comes after the whole list.
  - I pressed Enter on the 5th entry (ABF). It then took 483 Tab presses to reach the card's first link, "Read it in Substrates and PCBs →".
  - Pressing Enter in the search box selects an entry, then calls `inp.blur()`. Focus drops to the body and nothing is announced.
  - Arrow keys in the box swap the card silently.
  - Keyboard-only readers can see the definition but cannot practically reach the passages and chapter links, which are the point of the page.
- **Fix:** `src/modules/lookup.js`.
  - In `Lookup.select(id, push)`, when the reader made the choice, move focus to the card's heading. Give it `tabindex="-1"` and call `focus({preventScroll: true})` after scrolling.
  - Drop `inp.blur()` from the Enter handler in `init`.
  - Better still, make `#lk-items` a single Tab stop. Either use a listbox driven from the input with `aria-activedescendant`, or a roving tabindex on the buttons. Tab then goes from the list straight to the card.
- **Effort:** S to M.

### P2: AA failures or serious friction

**2. On phones, and on zoomed laptops, the fixed bars hide the focused element.**

- **WCAG:** 2.4.11 Focus Not Obscured (Minimum) (AA).
- **Routes:** every view at 900 px or narrower. That includes a 1440 px laptop zoomed past about 160%.
- **Evidence:**
  - On the phone, with smooth scrolling off, 16 of the first 70 Tab stops on The Chain landed fully under the 128 px specimen strip. One was "Transistors and the Front End" at y 821 in an 844 px window, under the Contents button.
  - Shift+Tab hides stops under the 75 px masthead in the same way.
  - No `scroll-padding` is set anywhere.
- **Fix:** `src/styles.css`.
  - Add `html { scroll-padding-top: calc(var(--masthead) + 12px); }`.
  - In the `@media (max-width: 900px)` block, add `html { scroll-padding-bottom: 140px; }`.
  - Have `Band.set()` raise the bottom padding to the strip's height while it is expanded.
- **Effort:** XS.

**3. The skip link skips nothing, and it rewrites the address.**

- **WCAG:** 2.4.1 Bypass Blocks (A). The landmarks satisfy it, so this is friction for sighted keyboard users. 2.4.3 also applies.
- **Routes:** all views. `summary/` has no skip link at all.
- **Evidence:**
  - `<a class="skip" href="#app">` (src/template.html line 54) points at the wrapper that also holds the masthead.
  - Enter sends focus to the body and changes the hash to `#app`. The next Tab lands on the wordmark.
  - A reload at `#app` opens The Chain, whatever page the reader was on.
  - At 900 px or narrower, the first Tab on any page other than Home skips the skip link, the wordmark and the earlier tabs. On #/chain it starts at "AI Chips"; on #/controls it starts at "Glossary".
  - The cause is `onTab.scrollIntoView(...)` in `Router.route`, which runs only on narrow screens. Chrome moves its Tab starting point to any element passed to `scrollIntoView`; I reproduced that at 1440 px too.
- **Fix:**
  - Give `<main>` the attributes `id="main" tabindex="-1"` and point the skip link at `#main`.
  - Add a click handler that calls `preventDefault()` and `main.focus()`, so the route stays in the address.
  - In `Router.route`, replace `scrollIntoView` with arithmetic on `tabs.scrollLeft`.
  - Add the skip link to the summary page builder (`build/modules/summary-brief.js`).
- **Effort:** S.

**4. The search dialog is not modal.**

- **WCAG:** 2.4.3 (A), 4.1.2 (A).
- **Route:** the search button, Ctrl+K or /, on every view.
- **Evidence:**
  - `#cp-search` has `role="dialog"` but no `aria-modal`, and Tab is not contained.
  - After the 14th result, Tab went to the skip link and the masthead behind the scrim.
  - The Escape listener sits on the dialog box, so with focus outside it, Esc did nothing and the dialog stayed open.
  - Choosing a result leaves focus on the body: the code comment says the destination takes focus, but nothing focuses it.
- **Fix:** `Tools.open` and `Tools.close` in `src/app.js`, in the search block.
  - Set `aria-modal="true"`.
  - Make `#app` inert while the dialog is open, or wrap Tab between the input and the last result.
  - Listen for Escape on `document` while the dialog is open.
  - After following a result, focus the target: the heading, glossary entry or flashcard, with `tabindex="-1"`.
- **Effort:** S.

**5. Changes in search results, counts and the board are not announced.**

- **WCAG:** 4.1.3 Status Messages (AA).
- **Routes:** search, `#/suppliers`, `#/glossary`, `#/controls`.
- **Evidence:** The only live regions are `#cx-count` (AI Chips) and `.sa-panels` (the atlas). These are silent:
  - the number of search results, and "Nothing matches. Nearest terms:";
  - `#sup-count` ("39 of 226 suppliers");
  - `#lk-count` ("35 of 487 entries", "No entry matches.");
  - the board's "Board as of" date (`#cf-asof`, set in `Geo.setAsOf`) when a year is pressed or the arrow keys move;
  - the timeline after a filter chip is pressed.
  - A separate risk: in the current source, `Landscape.renderCount` says the count line went with the new slots. Keep a live region in the new picker.
- **Fix:**
  - In `src/template.html`, add `role="status"` to `#sup-count` and `#lk-count`.
  - In the search panel, add a visually hidden `role="status"` node and fill it on input ("14 results").
  - Put `aria-live="polite"` on `.cf-asof`, or announce "Board as of 31 Dec 2022, 3 rows changed" through one status node in `setAsOf`.
  - Have `renderTimeline` write the number of events shown to a status node.
- **Effort:** S.

**6. On phones, the Contents sheet lets focus escape and does not return it.**

- **WCAG:** 2.4.3 (A), 2.4.11 (AA).
- **Route:** any view at 900 px or narrower, from the Contents button in the strip.
- **Evidence:**
  - `#sheet` has `role="dialog"` but no `aria-modal`.
  - 7 of 30 Tab presses landed on masthead links hidden under the full-screen sheet.
  - Esc, Close and choosing a chapter all close the sheet without returning focus to Contents.
- **Fix:** `open()` in `Band.init` (`src/app.js`).
  - Remember the trigger.
  - Make `#app` inert while the sheet is open.
  - Focus the trigger on close, unless a chapter link was followed; in that case focus the chapter heading.
- **Effort:** S.

**7. Some focus is invisible, or close to it.**

- **WCAG:** 2.4.7 Focus Visible (AA).
- **Routes:**
  - `.to-top`: every desktop view.
  - `.wk-tabs`: the end of Home.
  - `.cf-jump-btn`: `#/controls`.
- **Evidence:**
  - "Back to top" is the 10th Tab stop on every desktop page even while it is hidden: its opacity is 0, but it can still take focus.
  - `.wk-tabs a:focus-visible { outline: none }` (`src/modules/walk.css` line 32) leaves only a colour change in the text, ink to garnet. The two states differ by 1.7:1.
  - `.cf-jump-btn:focus-visible { … outline: none }` (`src/modules/controls.css` line 319) leaves only a change in the underline colour, which a crop could not tell from the resting state.
- **Fix:**
  - Add `.to-top[data-show="0"] { visibility: hidden; transition: opacity .3s, visibility 0s .3s; }` in `src/styles.css` near line 350.
  - Delete both `outline: none` declarations so the site-wide 1.5 px garnet outline applies.
- **Effort:** XS.

**8. Some text fails contrast.**

- **WCAG:** 1.4.3 Contrast (Minimum) (AA).
- **Routes:** `#/chain` and `lithography/`, `#/suppliers`, `#/exposure` (dark), and search.
- **Evidence:** measured against the painted background:
  - **Step numbers of the animations.** These are 75 numbers across 15 figures. `.anim-steps button .n { opacity: 0.7 }` (`src/styles.css` line 1028) gives #8b8f95 on #f7f6f2, 3.0:1, and 3.7:1 in dark. The current step is 4.48:1 in light and 3.06:1 in dark (#a44745).
  - **Numbers on the atlas stops.** In the default state, with no country chosen, `.atlas .sa-stop:not(.is-on) { opacity: 0.42 }` (`src/modules/summary-a.css` line 283) gives the numbers 1.4 to 1.5:1 in light and 1.6 to 1.7:1 in dark. These are live links, not disabled ones.
  - **China revenue table in dark.** `#exposure-table td .cell.is-peak` sets #ee7a73 on its heat cell, 3.0 to 4.3:1, in 13 cells; the worst is 54.8% at 3.02:1. Light passes.
  - **Search dialog placeholder.** It uses the browser default, #757575: 4.25:1 in light, 3.9:1 in dark. It is the dialog's only instruction.
- **Fix:**
  - Remove the opacity on `.anim-steps button .n`, which leaves muted at 5.6:1.
  - Dim the inactive stops without `opacity`. For example, use `background: var(--muted); color: var(--bg)`, which gives 5.6:1.
  - In dark, set `.cell.is-peak` text to `var(--ink)` and keep the garnet underline as the mark.
  - Add `.cp-search-panel input::placeholder { color: var(--muted); }`.
- **Effort:** XS.

**9. Control edges and the checkbox square are below 3:1.**

- **WCAG:** 1.4.11 Non-text Contrast (AA).
- **Routes:** `#/suppliers`, `#/glossary`, `#/landscape`, `#/controls`.
- **Evidence:**
  - These controls draw their edge in `--line-2`, #bfb9af on paper (1.8:1), or #3d434b on the dark ground (1.8:1):
    - the Suppliers search box and both selects;
    - the Glossary search box;
    - ghost buttons;
    - filter chips;
    - country chips.
  - In AI Chips, the square that shows a chip is unpicked has a 1.8:1 edge. That square is the state indicator.
  - The year cells use `--line`, 1.37:1.
- **Fix:**
  - Add a token for control edges: `--control-edge: #857f74` (3.7:1) in light and `#6d747c` (3.8:1) in dark.
  - Use it on `input`, `select`, `.cx-picker button::before` and the chips.
  - Keep the hairlines `--line` and `--line-2` for rules.
- **Effort:** XS to S.

**10. Chart tooltips cannot be dismissed or hovered.**

- **WCAG:** 1.4.13 Content on Hover or Focus (AA).
- **Routes:** `#/suppliers?tab=country`, `#/exposure`, and the atlas on `#/suppliers`.
- **Evidence:**
  - `#sup-tip` (the ribbons), `.ex-tip` (the China revenue bars) and `.sa-stop-tip` (the atlas stops) have `pointer-events: none`.
  - None of them has an Escape handler, and they appear on focus as well as on hover.
- **Fix:**
  - Add one `document` keydown handler that hides all three on Escape.
  - Let the tip take the pointer, and hide it after a short delay, as `Cite.later` does.
- **Effort:** S.

**11. The specimen turns with no way to pause it.**

- **WCAG:** 2.2.2 Pause, Stop, Hide (A).
- **Routes:** `#/`, `#/chain`, `#/landscape`, and the phone strip.
- **Evidence:**
  - The 3D stage turns without end, at about 0.11 rad/s, beside the text.
  - It pauses only while the pointer rests on it or it has focus.
  - Reduced motion stops it, which I verified, but there is no control on the page.
- **Fix:**
  - Add a Pause or Play toggle to `.stage-actions`, using `aria-pressed`, and on the desktop stage.
  - Store the choice in `localStorage` and read it in `Stage.loop`.
- **Effort:** S.

**12. Focus is lost when a view re-renders.**

- **WCAG:** 2.4.3 (A).
- **Routes:** `#/suppliers` (Table mode); `#/landscape` (the served build).
- **Evidence:**
  - Pressing a sort header calls `Suppliers.renderTable`, which rebuilds the table's HTML. Focus drops to the body.
  - On AI Chips, pressing a column head (`.cx-colhead`) does the same.
- **Fix:** after the re-render, focus the new button with the same `data-sort` or `data-id`. Also move `aria-sort` from the `<button>` to its `<th>`.
- **Effort:** XS.

**13. The chapter rail's targets are too small.**

- **WCAG:** 2.5.8 Target Size (Minimum) (AA).
- **Routes:** `#/chain` on desktop; `lithography/` and the other chapter pages on phones.
- **Evidence:**
  - `.ch-ledger .stage-cell a { height: 15px }` (`src/styles.css` line 768) makes each link 74 × 15 px, stacked at a 15 px pitch. That is 225 links across the 15 stage chapters.
  - On the static chapter pages, the rail links are 22.9 px wide on a phone.
  - The atlas stops are 22 px on desktop and 9 px on a phone, but they pass through the exception for an equivalent control, the stop cards. The prose glossary terms pass through the inline exception.
- **Fix:**
  - Give the rail links a minimum height of 24 px, or keep the 15 px bar and pad the link to 24 px with half of it overlapping. The column grows by about 135 px.
  - Set a minimum width of 24 px on the static pages' rail links.
- **Effort:** S.

**14. Changes of view and search picks are not announced.**

- **WCAG:** 4.1.3 and 2.4.3; this is friction, not a strict failure.
- **Routes:** all, through the masthead tabs and search results.
- **Evidence:**
  - After a tab is activated, focus stays on the tab and only `document.title` changes.
  - After a search pick, focus is on the body.
  - A screen-reader user hears nothing about the new page.
- **Fix:** at the end of `Router.route`, when the view changed after load, focus the view's h1 with `tabindex="-1"` and `preventScroll`. Do not do this when an anchor or chapter is the target; focus that instead.
- **Effort:** S.

### P3: best practice

15. **Heading order (1.3.1).**
    - The h1 goes straight to an h3 on:
      - The Chain ("How to read a chapter");
      - AI Chips ("Packages at one scale");
      - Suppliers (the atlas);
      - Export Controls ("Coming up");
      - China revenue share.
    - **Fix:** make those section labels h2 elements. Restyling is not needed, because the `.label` class carries the look.
    - **Effort:** XS.
16. **Landmarks.**
    - 17 navigation landmarks share the label "Previous and next chapter". Add the chapter name to each.
    - The 20 Suppliers rungs are all `<section aria-labelledby>`, so each becomes a region. Use plain `div` elements.
    - `#lk-list` is an `aside` inside `main`.
    - The `.stage` figure sits outside every landmark.
    - **Effort:** XS.
17. **ARIA misuse.**
    - `aria-label` on the `div.chain--compact` rail and `aria-labelledby` on `div#sup-ladder` are ignored because neither element has a role. As a result, the rail's Extreme and High bars exist only in `title`.
    - `aria-current` sits on the Glossary `<li>` and the rail's `<li>`, not on the button or link.
    - The atlas stops and stop cards are `<a href="#chapter">` links that prevent the default and select a country, so the role does not match the action.
    - On phones, the 9 px stops are `pointer-events: none` but still Tab stops.
    - **Effort:** S.
18. **The glossary popover holds a link no one can reach by keyboard.**
    - "Look it up →" sits inside `role="tooltip"` (`Tip.show`). Tab moves to the next term and closes the popover.
    - **Fix:** make the term a disclosure, with `aria-expanded` and the panel placed after the button, or keep the link for touch only.
    - **Effort:** S.
19. **Each board row's heading is read twice.**
    - Each `h4.cf-rowh` holds a button whose `aria-label` repeats the visible spans, so the heading's name doubles.
    - **Fix:** use `aria-labelledby` on the spans.
    - **Effort:** XS.
20. **The specimen canvas, and forced colours.**
    - The canvas has `aria-label` but no role, and its label never names the specimen.
    - **Fix:** add `role="img"` and `aria-describedby="stage-caption"`.
    - The focus on `.sa-stop` and on the canvas is drawn with `box-shadow` only, which disappears in Windows High Contrast. Add `outline: 2px solid transparent`.
    - **Effort:** XS.
21. **Text spacing (1.4.12).** With the WCAG spacing override:
    - the Glossary category labels (`.lk-lab`) are cut off ("Equipment subsyste…");
    - at 320 px, the phone wordmark runs under the search icon;
    - `lithography/` scrolls sideways by 30 px at 390 px because of the chapter rail.
    - **Effort:** S.
22. **Secondary chart marks are under 3:1.** The data is also given as text, so this is not a failure.
    - In light:
      - stack tail #c9c6bf, 1.58:1;
      - the yellow stacked hue #c9a10c, 2.26:1;
      - the hatched remainder's edge #a9a49b, 2.29:1;
      - neutral #b4b9be, 1.83:1;
      - the year bars, 2.29:1.
    - In dark, the tail #4b5159 is 2.24:1.
    - **Fix:** darken the tail and edge to about 3:1, as the dark theme's edge already is (3.8:1).
    - **Effort:** XS.
23. **Language of parts (3.1.2).**
    - Firm names in their own languages are proper names and so exempt.
    - Chinese and Japanese source titles, such as the Empyrean annual report, have no `lang`. Add `lang="zh"` or `lang="ja"` to them.
    - **Effort:** S.
24. **Small points.**
    - Footnote and source links open new tabs without saying so.
    - The "source" links on Home all have the same name.
    - In the Suppliers ladder, Important and Diversified firms differ only by colour, ink against muted (2.9:1).
    - The focus ring on Glossary list items is clipped at left and right by the list's overflow.
    - After "Show answer", focus goes to "Knew it" without the answer being read. Add `aria-describedby` pointing at `.fc-a`.

## The five I would fix first

1. **The Glossary entry focus (P1, #1).** It is the only finding that blocks a task.
2. **`scroll-padding` for the fixed masthead and strip (#2).** It is two lines of CSS and covers every keyboard reader on phones and on zoomed laptops.
3. **Search as a real modal, with live counts (#4, #5).** Use one pass over `Tools.open` and `close`, and add `role="status"` to `#sup-count`, `#lk-count` and `#cf-asof`.
4. **The skip link and the Tab starting point (#3).** Target `#main` without changing the hash, and remove the narrow-screen `scrollIntoView`.
5. **One CSS-only batch (#7, #8, #9).**
   - Hide "Back to top" when it is not shown.
   - Delete the two `outline: none` rules.
   - Drop the opacity on the step numbers and atlas stops.
   - Set the placeholder colour.
   - Add a control-edge token with at least 3:1 contrast.

   Each is under an hour.
