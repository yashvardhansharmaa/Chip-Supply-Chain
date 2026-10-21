# Design review: the front door and the frame (design-front)

Reviewer slug `design-front`. Shots in `qa/design/shots/design-front/` (paths below are relative to that folder). Port 9921. Every shot was taken with WebGL on (SwiftShader) so the specimen renders as readers see it. The stock `build/shoot.py` passes `--disable-gpu`, so its shots show an empty right column. My copy of the script, with `--gl`, an eval printout and a `--dark` media flag, lives in my scratchpad; no repo file was edited.

**A note on the brief.** `#/` is not the world map. Since 11 September `#/`, `#/home` and `#/intro` all open the walk ("How AI chips are made"), and the map with its country panels sits at the top of Suppliers as the atlas (`.sa--atlas`, design-data's surface). So "the home page" and "the Start here walk" below are one view. I reviewed `summary-a.css` only where it meets the dark theme (P1-3).

## Verdict

The frame is close to the standard the brief asks for. The wordmark lockup is crisp at both sizes, the masthead reads as a running head, the walk's ledger column (light Fraunces numerals beside a hairline that fills in garnet) is the most memorable thing on the site, and the phone's first screen is excellent: title, dek, then "The chain at a glance", fifteen ruled rows that state the site's thesis in one look. The weaknesses are in three places. First, the laptop front door is weaker than the phone's: above the fold it shows a directory of five other pages, which the masthead already lists, and hides the glance the phone leads with. Second, the dark theme has real faults: the theme button shows the moon in dark mode, the search scrim lightens the page, the light-grey "High" bars outshine the wine "Extreme" bars, and the dark "Extreme" badge fails AA. Third, the type system has drifted. I count 111 distinct type styles across the six views, 16 label sizes from 8.4 to 14.5 px, 20 variants of uppercase label, 25 tracking values and 47 spacing values. None is ugly alone, but four designers cannot work inside a scale that does not exist. Fix the dark faults, give the laptop the phone's front door, put the active tab on the masthead rule, and adopt a named scale before the merge.

## P1: broken, ugly or confusing

### P1-1. The theme button shows the moon in dark mode
- **Where:** masthead, every route, dark theme, all widths.
- **Wrong:** `Theme.sync` in `src/app.js` sets `$('.ic-moon', b).hidden = dark`. SVG elements have no `hidden` property, so this only adds an expando. The moon never hides and the sun never shows, while the aria-label correctly says "Switch to light mode". Sighted readers see a control that contradicts its label.
- **Change** (`src/app.js`, `Theme.sync`):
  ```js
  $('.ic-moon', b).toggleAttribute('hidden', dark);
  $('.ic-sun', b).toggleAttribute('hidden', !dark);
  ```
- **Shots:** `p1-theme-toggle-dark-1440-before-zoom.png` / `p1-theme-toggle-dark-1440-after-zoom.png` (full frames: `p1-theme-toggle-dark-1440-before.png` / `-after.png`).
- **Risk:** none. **Touches:** nothing else.

### P1-2. The search scrim lightens the page in dark mode
- **Where:** search open, dark theme, all widths.
- **Wrong:** `#cp-search { background: color-mix(in srgb, var(--ink) 40%, transparent) }`. In dark mode `--ink` is cream, so the scrim washes the page grey and the panel sinks into it.
- **Change** (`src/styles.css`):
  ```css
  :root { --scrim: rgba(20, 24, 31, 0.30); }
  :root[data-theme="dark"] { --scrim: rgba(6, 8, 11, 0.72); }
  #cp-search { background: var(--scrim); }
  ```
- **Shots:** dark `p1-search-scrim-dark-1440-before.png` / `-after.png`; light (slightly less muddy at 0.30 than 0.40) `p1-search-scrim-light-1440-before.png` / `-after.png`.
- **Risk:** none. **Touches:** any later modal can reuse `--scrim`.

### P1-3. Dark theme: "High" outshines "Extreme", and the Extreme badge fails AA
- **Where:** every bar in dark mode: the phone's glance meters, the chapter ledger and rail, the walk's pips, the summary-a tiles, the AI Chips meters (`.cx-meter`); and the score badge `.sa-sc` in the Suppliers country panel.
- **Wrong:** dark `--bar-4` is `#c3c7cd` (10.6:1 on the ground) while the wine `--accent-fill` is `#a8414b` (3.0:1). Lightness is salience on a dark ground, so the seven High stages are the loudest marks on the page and the eight Extreme stages recede. Light mode gets this right: `#3b424c` and garnet have the same luminance (0.053), and hue alone singles out Extreme. Separately, `.sa-sc` sets dark ground text on the wine: 3.0:1 at 10.5 px, an AA failure.
- **Change** (keeps the owner's 27 Sept wine and text red):
  ```css
  /* src/styles.css, :root[data-theme="dark"] */
  --bar-4: #636a73;   /* luminance 0.142, matched to the wine's 0.126; 3.28:1 on --bg, 3.03:1 on --bg-2 */
  /* src/modules/summary-a.css */
  :root[data-theme="dark"] .sa-sc { color: var(--ink); }  /* 4.92:1 on the wine, 4.51:1 on the new --bar-4 */
  ```
- **Shots:** `p1-dark-bars-phone-glance-zoom.png` (before left, after right), `p1-dark-bars-chapter-1440-zoom.png`, `p1-dark-badge-suppliers-1440-zoom.png`; full frames `p1-dark-bars-*-before.png` / `-after.png`, `p1-dark-badge-suppliers-1440-before.png` / `-after.png`.
- **Risk:** low. Print is unaffected (`print.css` sets its own bars). **Touches:** design-chapter (ledger, rail), design-data (AI Chips meters, Suppliers badges).

### P1-4. Search snippets print footnote numbers as text
- **Where:** search results for chapter sections, all widths. Typing "hbm" shows "8 Gb/s per pin 9. SK…" and "36 GB with twelve 10.".
- **Wrong:** `Tools.buildIndex` reads `p.textContent`, which includes each `sup.cite` number.
- **Change** (`src/app.js`, `Tools.buildIndex`, the section loop):
  ```js
  var c = p.cloneNode(true); $$('sup.cite, sup.cite-sep', c).forEach(function (s) { s.remove(); }); t += ' ' + c.textContent;
  // and when storing: text: t.replace(/\s+/g, ' ').replace(/\s+([.,;:)])/g, '$1').trim().slice(0, 900)
  ```
- **Shots:** `p2-search-1440-before.png` (second and third results) / `p2-search-1440-after.png`.
- **Risk:** none. **Touches:** nothing else.

## P2: clear upgrades

### P2-1. The laptop front door: lead with the chain at a glance, end with Other pages
- **Where:** `#/` at 701 px and up.
- **Wrong:** above the fold the laptop reader gets the title, then a 372 px table of five other pages that repeats the masthead tabs. The phone, under the same title, shows "The chain at a glance": a ruled ledger of the fifteen stages with a four-step meter and the plain word, garnet at Extreme. That one block is the site's argument, and the laptop never sees it. The walk's end, meanwhile, closes on three boxed uppercase links of unequal width, a weak last word.
- **Change:** show the glance at every width; move the Other pages table to the walk's end in place of the three links. From 901 px the stage numbers hang in the ledger column, so the names start on the title's edge and the list previews the walk's own structure. The phone is pixel-identical (checked by image diff above the specimen strip).
  - Markup (`build/modules/walk.js`): emit `nav.wk-tabs` inside `.wk-end` and drop `.wk-end-links`.
  - CSS (`src/modules/walk.css`): keep the existing `@media (max-width: 700px)` block; add:
  ```css
  .wk-head .wk-tabs { display: none; }
  .wk-end { border-top: 0; padding-top: 0; }
  .wk-end .wk-tabs { margin: 0; }
  @media (min-width: 701px) {
    .wk-gl { display: block; margin: 34px 0 0; border-top: 1px solid var(--ink); }
    .wk-gl-h { display: block; margin: 0; padding: 11px 0 0; }
    .wk-gl-p { margin: 6px 0 14px; font-size: 16.5px; line-height: 1.45; color: var(--ink-2); max-width: 36em; }
    .wk-gl-p b { color: var(--accent); font-weight: 600; }
    .wk-gl-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line-2); border-bottom: 1px solid var(--line-2); }
    .wk-gl-list li + li { border-top: 1px solid var(--line); }
    .wk-gl-list a { display: grid; grid-template-columns: var(--gutter) minmax(0, 1fr) auto; column-gap: var(--gutter-gap); align-items: baseline; min-height: 30px; padding: 5px 0 4px; color: var(--ink); text-decoration: none; }
    .wk-gl-n { padding-right: 8px; text-align: right; font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
    .wk-gl-t { font-size: 16px; line-height: 1.3; }
    .wk-gl-c { display: inline-flex; align-items: baseline; gap: 8px; font-family: var(--font-mono); font-size: 12.5px; color: var(--ink-2); }
    .wk-gl-m { display: inline-flex; align-self: center; align-items: flex-end; gap: 2px; height: 14px; }
    .wk-gl-m i { display: block; width: 6px; background: var(--line); }
    .wk-gl-m i:nth-child(1) { height: 5px; } .wk-gl-m i:nth-child(2) { height: 8px; } .wk-gl-m i:nth-child(3) { height: 11px; } .wk-gl-m i:nth-child(4) { height: 14px; }
    .wk-gl-list li .wk-gl-m i.on { background: var(--muted); }
    .wk-gl-list li[data-level="3"] .wk-gl-m i.on { background: var(--bar-4); }
    .wk-gl-list li[data-level="4"] .wk-gl-m i.on { background: var(--accent-fill); }
    .wk-gl-w { min-width: 4.4em; }
    .wk-gl-list li[data-level="4"] .wk-gl-w, .wk-gl-list li[data-level="4"] .wk-gl-n { color: var(--accent); }
    .wk-gl-list li[data-level="4"] .wk-gl-w { font-weight: 600; }
    .wk-gl-list a:hover { background: var(--bg-2); }
    .wk-gl-list a:hover .wk-gl-t, .wk-gl-list a:focus-visible .wk-gl-t { color: var(--accent); }
  }
  @media (min-width: 901px) {
    .wk-gl { border-top: 0; }
    .wk-gl-h { border-top: 1px solid var(--ink); }
    .wk-gl-list a { position: relative; grid-template-columns: minmax(0, 1fr) auto; column-gap: 16px; }
    .wk-gl-n { position: absolute; top: 9px; left: calc(-1 * (var(--gutter) + var(--gutter-gap))); width: var(--gutter); padding-right: 14px; }
    .wk-gl-t { font-family: var(--font-display); font-weight: 500; font-variation-settings: var(--opsz-title); font-size: 17px; line-height: 1.25; }
  }
  ```
  Also update the comment above `.wk-gl` in `walk.css`, which says wider screens keep Other pages under the hero.
- **Shots:** `p2-front-door-1440-before.png` / `p2-front-door-A-1440-after.png`; `p2-front-door-1024-before.png` / `p2-front-door-A-1024-after.png`; `p2-front-door-A-800-before.png` / `-after.png`; phone unchanged `p2-front-door-A-phone-before.png` / `-after.png`; the end `p2-walk-end-1440-before.png` / `-after.png`, `p2-walk-end-phone-before.png` / `-after.png`; everything together `all-front-1440-light-*`, `all-front-1440-dark-*`.
- **Option B, tested and not recommended:** the fifteen stages as a vertical bar strip (the rail's `chain-track` with its short names). It is striking at 1440 (`p2-front-door-B-strip-1440-after.png`), but the names collide at 1024 (`p2-front-door-B-strip-1024-after.png`) because a 479 px column gives each stage 28 px. A (the ledger) works at every width and is the component the phone already ships.
- **Risk:** chapter 01's title moves from y 741 to y 958 at 1440, so it drops below a 900 px fold. The owner may want Other pages kept high; if so, keep it under the glance rather than drop the glance. **Touches:** none outside the walk. This is the owner's call; the comment in `walk.css` suggests the current split was intended.

### P2-2. Masthead: the current tab marks the rule; the icon buttons lose their boxes
- **Where:** masthead, all routes and widths.
- **Wrong:** the garnet rule under the current tab floats 10 px above the masthead hairline, and the search and theme buttons are the only boxes in a bar of hairlines, so they read as form controls.
- **Change** (`src/styles.css`, masthead section):
  ```css
  .search-btn, .theme-toggle { border-color: transparent; color: var(--ink-2); transition: border-color .15s, color .15s; }
  .search-btn:hover, .theme-toggle:hover { border-color: var(--line-2); color: var(--ink); }
  @media (min-width: 901px) {
    .masthead { align-items: stretch; }
    .wordmark { align-self: center; }
    .tabs { align-self: stretch; align-items: stretch; overflow: visible; }
    .tabs a { display: flex; align-items: center; padding: 0 10px; border-bottom: 2px solid transparent; margin-bottom: -1px; }
    .tabs a:hover { border-bottom-color: var(--line-2); }
    .tabs .search-btn, .tabs .theme-toggle { align-self: center; }
    .tabs .search-btn { position: relative; margin-left: 21px; }
    .tabs .search-btn::before { content: ""; position: absolute; left: -12px; top: 7px; bottom: 7px; width: 1px; background: var(--line-2); }
    .tabs .theme-toggle { margin-left: 2px; }
  }
  @media (max-width: 1240px) and (min-width: 901px) { .tabs a { padding: 0 7px; } }
  @media (max-width: 1060px) and (min-width: 901px) { .tabs a { padding: 0 5px; } }
  @media (max-width: 900px) {
    .tabs { margin-bottom: -1px; padding-bottom: 0; }
    .tabs a { padding: 6px 8px 9px; border-bottom-width: 2px; }
  }
  @media (max-width: 480px) { .tabs a { padding: 6px 6px 9px; } }
  ```
  These replace the existing `.tabs a` padding rules at 1240, 1060, 900 and 480 px. Measured: the strip still fits at 901, 960 and 1060 px (513 px wide, first tab clear of the wordmark), and the masthead height is unchanged, so `--masthead` and the rails do not move.
- **Shots:** `p2-masthead-1440-zoom.png`, `p2-masthead-1024-zoom.png`, `p2-masthead-phone-zoom.png` (before above, after below); full frames `p2-masthead-*-before.png` / `-after.png`.
- **Risk:** low. The icon targets stay 34 px (32 px on phones); focus keeps the global garnet outline. **Touches:** every page's chrome.

### P2-3. Phone tab strip: all five sections visible on a normal phone
- **Where:** masthead at 360 to 480 px.
- **Wrong:** at 390 px the strip is 402 px of tabs in a 362 px box, so Glossary hides under a fade and a chevron. At 360 px, Export Controls is cut as well.
- **Change** (`src/styles.css`): on phones the wordmark is the way home (as it was when the Start here tab went), so drop the Home tab there.
  ```css
  @media (max-width: 480px) { .tabs a[data-view="walk"] { display: none; } .tabs { gap: 0; } .tabs a { padding-left: 6px; padding-right: 6px; } }
  @media (max-width: 380px) { .tabs a { padding-left: 5px; padding-right: 5px; font-size: 11px; } }
  ```
  Measured with P2-2 applied: 362/362 px at 390 and 332/332 px at 360, so the chevron no longer shows. At 320 px the strip still scrolls under the chevron, as now.
- **Shots:** `p2-phone-tabs-390-zoom.png`, `p2-phone-tabs-360-zoom.png` (before above, after below).
- **Risk:** on the home page no tab is marked current on a phone. That is normal for an editorial masthead, but it is a navigation change, so it is the owner's call. **Touches:** none.

### P2-4. Search on a phone, and the Enter target
- **Where:** search, phone; the first result at all widths.
- **Wrong:** on a 390 px phone the 110 px kind column squeezes each snippet into a 200 px column, so three and a half results fit. The panel starts 12vh down, which wastes the top of the screen while the keyboard covers the bottom. On a laptop the hint says "Enter opens the first result", but nothing marks that result.
- **Change** (`src/styles.css`, search section):
  ```css
  .cp-search-panel input { padding-left: 44px; background: var(--bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235c636d' stroke-width='1.5'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M20 20l-3.5-3.5'/%3E%3C/svg%3E") no-repeat 16px 50% / 18px 18px; }
  .cp-search-results li:first-child a { background: var(--bg-2); box-shadow: inset 2px 0 0 var(--accent); }
  .cp-search-results:has(a:focus) li:first-child a:not(:focus) { background: none; box-shadow: none; }
  @media (hover: hover) { .cp-search-results:not(:has(a:focus)) li:first-child a b::after { content: "  \21B5"; font-family: var(--font-mono); font-size: 12px; color: var(--muted); } }
  @media (max-width: 640px) {
    #cp-search { padding: 8px 8px 0; }
    .cp-search-panel input { font-size: 16px; }   /* 16 px stops iOS zooming on focus */
    .cp-search-results { max-height: calc(100vh - 96px); }
    .cp-search-results li a { grid-template-columns: 1fr; gap: 3px; padding: 11px 14px 12px; }
    .cp-search-results .k { grid-row: auto; padding-top: 0; font-size: 10px; }
    .cp-search-results .t { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  }
  ```
  For dark mode, the search-icon data URI should take the dark `--muted` stroke (`%23939aa3`) under `:root[data-theme="dark"]`.
- **Shots:** `p2-search-phone-before.png` / `-after.png` (seven results visible, not three and a half); `p2-search-1440-before.png` / `-after.png`.
- **Risk:** low. **Touches:** nothing else.

### P2-5. Footnote marks sit after a space and wrap alone to a new line
- **Where:** all prose with citations (chapters, the walk's facts, cards).
- **Wrong:** 1,302 of the 1,500 `sup.cite` marks in `dist/index.html` follow a literal space. With the mark's 2 px margin and 3 px padding, the gap is wide, and the line can break before the mark: in Lithography the line ends "(EUV)" and the next begins "¹⁵ . Nobody". A typesetter never lets a reference mark start a line.
- **Change:** in `build/build.js`, where the chapter HTML is finalized, `html = html.replace(/\s+(<sup class="cite)/g, '$1')`. In `src/styles.css`, `sup.cite { margin-left: 1px; }`. Leave the anchor's padding alone; it carries the 24 px target.
- **Shots:** `p2-footnote-space-1440-zoom.png` (before above, after below); full frames `p2-footnote-space-1440-before.png` / `-after.png`.
- **Risk:** none to content; the marks keep their order. **Touches:** design-chapter (all prose), design-print (check the PDF build reads the same HTML).

### P2-6. The footer as the last ledger row
- **Where:** footer of the walk and The Chain, all widths.
- **Wrong:** the footer starts at the page edge (x 43) while everything above it on these two pages starts at the text edge (x 159), so it reads as an afterthought hung off the left.
- **Change:** the footer takes the ledger grid. The favicon tile signs off in the ledger column, and the text aligns with the column above.
  - Markup (build, the `{{FOOTER}}` and `{{FOOTER_KEY}}` partials): add a first child `<span class="ft-mark" aria-hidden="true">` holding the masthead's tile SVG (`svg.wm-tile`).
  - CSS (`src/styles.css`, footer section):
  ```css
  .view[data-view="walk"] .site-footer, .view[data-view="stack"] .site-footer { display: grid; grid-template-columns: var(--gutter) minmax(0, 1fr); column-gap: var(--gutter-gap); align-items: start; }
  .view[data-view="walk"] .site-footer > *, .view[data-view="stack"] .site-footer > * { grid-column: 2; min-width: 0; }
  .site-footer .ft-mark { display: none; }
  .view[data-view="walk"] .ft-mark, .view[data-view="stack"] .ft-mark { display: block; grid-column: 1; grid-row: 1 / span 3; justify-self: end; margin: 1px 14px 0 0; }
  .ft-mark .wm-tile { display: block; width: 22px; height: 22px; } .ft-mark rect { fill: #7a1f2b; } .ft-mark path { fill: #f7f6f2; }
  .site-footer .credits { margin: 0 0 2px; color: var(--ink-2); }
  @media (max-width: 900px) { .ft-mark .wm-tile { width: 18px; height: 18px; } .view[data-view="walk"] .ft-mark, .view[data-view="stack"] .ft-mark { margin-right: 8px; } }
  ```
  (The proof used `favicon.svg` as a background image; the inline tile is safer because the share pages under `/<chapter>/` resolve relative URLs differently.)
- **Shots:** `p2-footer-1440-before.png` / `-after.png`; `p2-footer-phone-zoom.png` (before left, after right).
- **Risk:** none. Print hides nothing new. **Touches:** The Chain's footer (design-chapter's page), and only the layout.

### P2-7. One type scale and one spacing scale before the merge
- **Where:** the whole site; this is the system the other three designers work inside.
- **Wrong:** a sweep of computed styles across the six views finds 111 distinct type styles. The label face alone uses 16 sizes (8.4 to 14.5 px); uppercase labels come in 20 variants of size, weight and tracking (9 to 13 px, 0.05 to 0.12em); Fraunces uses 21 sizes, Source Serif 14. The CSS holds 47 spacing values and 25 letter-spacing values. The page titles differ too: the walk's is 60 px at 1440, every other page title 62 px.
- **Change** (`src/styles.css`, `:root`): name the scale, then map each selector to it as it is touched.
  ```css
  /* labels: Instrument Sans */
  --fs-cap-xs: 9.5px;  /* the chapter ledger's foot only: a 74 px slot */
  --fs-cap-s: 10px;  --tr-cap-s: 0.08em;   /* dense capitals: stage numbers and tiles, country codes, card keys */
  --fs-cap: 11px;    --tr-cap: 0.1em;      /* the label: kickers, meta lines, buttons, sub-tabs, summaries */
  --fs-ui-s: 12px;   /* sentence case: footer, sources, hints, counts */
  --fs-ui: 13.5px;   /* tabs, named chips, Read the chapter */
  /* reading: Source Serif 4 */
  --fs-note: 13.5px; --fs-small: 15.5px; --fs-plain: 17px; --fs-body: 18.5px; --fs-lede: 21px;
  /* display: Fraunces */
  --fs-d6: 16.5px; --fs-d5: 19px; --fs-d4: 21px; --fs-d3: 24px; --fs-d2: 28px;
  --fs-d1s: clamp(26px, 2.3vw, 32px);  /* walk step titles */
  --fs-d1: clamp(40px, 4.4vw, 62px);   /* every page title, the walk's included */
  --fs-num-s: 30px; --fs-num-m: 54px; --fs-num-l: 72px;
  /* block rhythm */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 72px;
  ```
  Mapping rules: 9 and 9.5 px capitals go to `--fs-cap-s` (the ledger foot is the one exception, kept at 9.5 px with 0.05em, because 10 px breaks "Stage 4 of 15"); 10.5 px capitals go to `--fs-cap` where they head something and to `--fs-cap-s` inside a dense row; 11.5 to 12.5 px sentence case goes to `--fs-ui-s`; 13 to 14.5 px to `--fs-ui`; serif 13 to 14.5 px to note or small by role; 16 and 16.5 px to small or plain; 17.5 to plain; 20 and 20.5 to lede; the Fraunces popover titles (14 to 15 px) to `--fs-d6`. Capitals track at 0.1em (0.08em at 10 px); sentence case at 0.01em; Fraunces at -0.015em for d1 and 0 below. The specimen tag's 0.28em stays as the one plate-caption voice. Spacing tokens are for block rhythm (gaps between sections: 24, 32, 48, 72); inner paddings can stay.
- **Shots:** `p2-type-ledger-1440-zoom.png` (before left, after right): snapping the 9.5 px labels in the chapter head, rail and tiles to 10 px with no breakage. My first attempt also moved the ledger foot to 10 px and broke "Stage 4 of / 15", which is why that slot is the documented exception.
- **Risk:** broad, so do it in two passes: tokens and labels first (largest win, least visible), serif and display sizes second. **Touches:** every designer's surface. The main session should hand this scale to all four before merging.

## P3: refinements

### P3-1. An empty search suggests what to type
- **Where:** search, just opened.
- **Change:** under the input, a "Try" row like the Glossary's (HBM, EUV, TSMC, Entity List, CoWoS, Gallium) that fills the input on tap and hides once results show. Markup from `Tools.open` in `src/app.js`: `<p class="cp-search-try"><span class="label">Try</span><button type="button">HBM</button>…</p>` before the results list. CSS:
  ```css
  .cp-search-try { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; margin: 0; padding: 12px 16px 13px; border-bottom: 1px solid var(--line); }
  .cp-search-try button { font-family: var(--font-body); font-size: 15px; color: var(--ink); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; padding: 3px 0; }
  .cp-search-try button:hover { text-decoration-color: var(--accent); color: var(--accent); }
  #cp-search:has(.cp-search-results li) .cp-search-try { display: none; }
  ```
- **Shots:** `p3-search-empty-1440-zoom.png` (before above, after below).
- **Risk:** the six terms are editorial; pick them from the Glossary's own "Try" list. **Touches:** none.

### P3-2. Follow the reader's system dark setting on a first visit (owner's call)
- **Where:** first paint, all routes.
- **Wrong:** a reader whose phone is in dark mode gets paper until they find the toggle. `Theme.current` says this is deliberate ("light unless the reader chose dark").
- **Change:** in the pre-paint script in `src/template.html`: `var t = q ? q[1] : (localStorage.getItem('cp-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : null));`. A saved choice still wins. Doing it before first paint lets the specimen initialize in dark colors; my proof set the theme after load, so its thumbnail kept light colors.
- **Shots:** `p3-os-dark-phone-pair.png` (system set to dark: before left, after right).
- **Risk:** paper is the identity; the owner may prefer it as the default. **Touches:** all pages.

### P3-3. One visible h1 per page
- **Where:** every view. The walk's title is `h2.wk-title`, the view titles are `h2`, and the only `h1` is the print title, which is `aria-hidden` and hidden on screen. There is no visual change and so no shot; DOM check: `document.querySelectorAll('h1')` returns one element, hidden.
- **Change:** make `wk-title`, `.view-head` titles and The Chain's `howto-title` `h1` elements, and add `h1` beside `h2` in the selectors that style them (`.view-head h2`, `.howto h2.howto-title`).
- **Risk:** low; check `qa/scripts` axe sweep after. **Touches:** every view's head.

## Checked and left alone
Back to top on laptops sits in the empty top corner where the specimen holds the foot, and phones use the strip's Top button: both work. The wordmark lockup is crisp at 29 and 25 px in both themes. No horizontal scroll at 320 px (document width 320). The skip link is present. Every page with a title sets it at y 119. The walk's 37em measure (about 85 characters at 18.5 px) is at the upper limit for a 1.58 leading, but the owner set it on 27 September, so I left it.

## Top five
1. **P2-1, the laptop front door:** the chain at a glance under the title, Other pages at the walk's end. `p2-front-door-1440-before.png` / `p2-front-door-A-1440-after.png`; `p2-walk-end-1440-before.png` / `-after.png`.
2. **P1-3, dark hierarchy and badge contrast:** dark `--bar-4: #636a73`; light text on the wine badge. `p1-dark-bars-phone-glance-zoom.png`, `p1-dark-bars-chapter-1440-zoom.png`, `p1-dark-badge-suppliers-1440-zoom.png`.
3. **P1-1 and P1-2, dark chrome bugs:** the sun icon in dark mode and a scrim that darkens. `p1-theme-toggle-dark-1440-before-zoom.png` / `-after-zoom.png`; `p1-search-scrim-dark-1440-before.png` / `-after.png`.
4. **P2-2 and P2-3, the masthead:** the active tab on the hairline, unboxed icons, all five sections visible on a 360 to 480 px phone. `p2-masthead-1440-zoom.png`, `p2-masthead-phone-zoom.png`, `p2-phone-tabs-390-zoom.png`.
5. **P2-7, one type and spacing scale** handed to all four designers before the merge. `p2-type-ledger-1440-zoom.png`.
