# Correctness review (21 October 2026)

Read-only review of `src/app.js`, `src/modules/*`, `build/build.js`, `build/modules/*` and the build's behaviour. No repo file was changed except this report. Nothing was fetched from the internet.

**Ground rules for the evidence**
- Line numbers are at commit `1e0a4fb`. A builder is rewriting AI Chips in `src/app.js` right now, so lines after `Landscape` will shift.
- Landscape and AI Chips are left out of the ranked findings, as the coordinator asked. One finding that crosses into them is in a short handoff note at the end.
- Browser proofs used headless Chrome against `http://127.0.0.1:8765/` (dist built 13:06Z, identical to a fresh build of `1e0a4fb`). They used a scratch copy of `qa/design/shots/design-chapter/proof/dc_shoot.py` with one flag added, `--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1`. That flag kept Google Fonts and the GoatCounter script from loading. The shared helper should carry it too, or every QA run hits the analytics script.
- Ports: the 99xx range is shared with other agents. One of my early runs on 9994 was taken over by another agent's Chrome. Every result below was re-run on ports 10190 to 10230.
- Build tests ran on `git archive HEAD` copies in my scratchpad, never on the repo.

---

## P1: a reader can hit it

### P1-1. Glossary "Where it appears" passage links land on the chapter's top, never on the passage
- **Evidence.** Repro: `#/glossary`, select any term, click a chapter passage. Script in the appendix (A1). The page goes to the chapter. At 1 s it is 300 px into the chapter, then it is pulled back to the chapter's top. The passage (7,200 px further down) is never on screen. The flash runs off screen. Same result on two ports.
- **Trace.**
  - `src/modules/lookup.js:289-293` sets `location.hash = '#' + p.chapter`, then scrolls to the passage 140 ms later.
  - The route is a new view (`changed`), so `Router.route` calls `settle(chapter)` (`src/app.js:364-366`).
  - `settle` (`app.js:381-391`) puts the chapter back at 30 ms after fonts, at load, at 400 ms and at 1200 ms. It stops only for wheel, touchstart, keydown or mousedown. The click's mousedown came before `settle` was registered.
- **Fix.**
  - Give `settle` a generation counter: `var gen = ++Router.settleGen`, and `again()` returns when `gen !== Router.settleGen`.
  - In lookup.js, after the scroll, call `CP.scrollToEl(p.el, false); CP.Router.settle(p.el)`. That replaces the chapter's settle with the passage's.
- **Effort** S (about 10 lines). **Risk** low. The counter also protects any future scroll the code makes soon after a jump.

### P1-2. Supplier filters toggle and pile up, so the list shows the wrong firms
- **Evidence (A2).**
  - *Ribbon click.* On `#/suppliers?tab=country`, click a Japan ribbon (Japan → Silicon & Wafers). The list shows "3 of 226 suppliers · Silicon & Wafers · Japan". Go back to By country and click another Japan ribbon (Japan → Photomasks). The list shows "10 of 226 suppliers · Photomasks", every country's photomask firms. The Japan filter was silently dropped.
  - *Glossary links (A3).* From the ASML firm card, "In the supplier list →" sets the search box to "ASML" (13 firms). Then from the Japan country card, "Its firms in the supplier list →" shows "3 of 226 suppliers · Japan" instead of Japan's 45. The earlier search is still applied, and the count line does not mention it.
- **Trace.**
  - `setCountry` toggles: `this.country = (c === this.country ? '' : c)` (`app.js:1140`).
  - The ribbon click calls it with the country already set (`app.js:1012`).
  - `lookup.js:285-286` sets one filter and leaves the others (`q`, stage, level) from earlier visits.
  - `render()` (`app.js:1197`) names stage, country and level in the count line, but never the search.
- **Fix.**
  - Ribbon: set the country, don't toggle it (`setCountry(c, false, true)` with a `force` argument). Keep toggling only for the country labels.
  - Add one `Suppliers.show({ q, country, stage })` that clears the other filters, and use it from lookup.js.
  - Add "· matching “asml”" to the count line.
- **Effort** S. **Risk** low.

### P1-3. From 10 November 2026 the export-controls board will still show stays that have already ended
- **Evidence (A4).** The page's clock was faked to 12 Nov 2026 through CDP. The Entity List row still reads "Presumption of denial · Suspended until 9 Nov 2026". Coming up, which uses the reader's real date, has already dropped that deadline. Two more stays end on 10 Nov and 27 Nov.
- **Trace.**
  - The board's "Now" is the date of the last timeline entry: `this.now = tl[tl.length - 1].date` (`app.js:1444`), which is 2026-09-07.
  - `stateAt` marks a stay as suspended while `suspendedUntil >= date` (`app.js:1503`). It is only ever asked about 7 Sept.
- **Fix.** `this.now = max(last entry date, localISO())`. The year range already ends in 2026.
- **Effort** XS. **Risk** low. **Due before 9 Nov.**

### P1-4. "Where it appears" lists chapter furniture as passages
- **Evidence.** 51 of the 1,035 indexed paragraphs are not passages:
  - 17 are `.ch-meta` lines, such as "1,959 words / 9 min Specimen: boule and wafer Updated 21 October 2026", which shows under *wafer*;
  - 34 are cite-line and hidden citation paragraphs. A raw search for "Yashvardhan" finds "17 places".
  - Visible in `shots/r2.png` and `r2m.png` under *scanner*.
- **Trace.** `lookup.js:306` excludes `.chapter-sources, .plate-head, .chain, .brief-head, figure, .chapter-nav, nav`. The head moved into `.ch-meta` and `.ch-cite` in yesterday's P2.5, which the list does not cover. `.brief-head` and `.lead-cn` (`:308`) no longer exist.
- **Fix.** Add `.ch-meta, .ch-cite` and drop the two stale selectors.
- **Effort** XS. **Risk** none.

### P1-5. The glossary popover stays open after "Look it up →", and anchored Glossary routes keep the last view's scroll
- **Evidence (A5).** From a chapter (scrollY 33,559), click a term, then "Look it up →".
  - The Glossary opens, but `#gl-tip` stays open over its top-left corner on desktop (8, 10, 340×273), and as a sheet over the entry on a phone. It survives scrolling.
  - The page lands at scrollY 439, which is the old scroll clamped to the page's height. The entry's head is 135 px above the viewport.
  - Moving between two entries in the Glossary (`#lk-country-jp` to `#gl-hbm`) keeps scrollY at 373. The new entry's title then sits 51 px above the top of the window, behind the masthead.
- **Trace.**
  - The Tip click handler (`app.js:2113-2118`) never hides the tip for a click inside it.
  - Nothing hides Tip or Cite on `hashchange`.
  - `Router.route` skips its scroll reset whenever there is an anchor (`app.js:355`, `!anchor`). Only stack and walk scroll to the anchor themselves.
  - `Lookup.select` calls `li.scrollIntoView({block:'nearest'})` (`lookup.js:97`), which also scrolls the window.
- **Fix.**
  - Add `window.addEventListener('hashchange', function () { Tip.hide(); Cite.hide(); })`.
  - At line 355, reset the scroll for anchors outside stack and walk, then let Lookup place `#lk-entry`.
  - Scroll only `#lk-items`, not the window.
- **Effort** S. **Risk** low.

### P1-6. Glossary mentions from the timeline link to the top of Export Controls, not to the entry
- **Evidence.** The *Entity List* card has 5 Export Controls mentions, all `href="#/controls"`. Each entry has its own address (`#/controls/<id>`), which the search box already uses.
- **Trace.** `lookup.js:340` (`href: '#/controls'`).
- **Fix.** `'#/controls/' + encodeURIComponent(e.id)`.
- **Effort** XS. **Risk** none.

### P1-7. Keyboard paths that dead-end
- **Evidence.** Real CDP Tab key events.
  - **(a)** Tab from a glossary term moves to the next link in the prose, and the popover closes. Its "Look it up →" link, which lives at the end of `<body>`, can never be reached. Six Tabs from "lithography systems" never land in the tip.
  - **(b)** The search dialog has no `aria-modal` and no focus containment. After 14 results, Tab goes to the skip link and the wordmark behind the scrim while the dialog stays open.
  - **(c)** Enter in search leaves focus on `<body>` (`#gl-hbm`, active element BODY). The QA report noted this too.
- **Trace.**
  - (a) Tip `focusin` hides on any focus outside the tip (`app.js:2112`).
  - (b, c) `Tools.open` / `Tools.close(true)` (`app.js:2285-2338`).
- **Fix.**
  - (a) While the tip is open, Tab from its button moves focus to the tip's link, and Escape returns. Or insert the tip after the button in the DOM.
  - (b) Set `inert` on `#app` while the search is open, and add `aria-modal="true"`.
  - (c) Focus the destination heading (`tabindex=-1`).
- **Effort** M. **Risk** low.

### P1-8. The Home tab does nothing while reading the home page
- **Evidence.** At `#/walk/transistors-and-front-end`, scrollY 6000, click "Home": the address and the scroll stay as they were. The wordmark does go to the top. Re-run on port 10211.
- **Trace.**
  - `#/` → walk → walk is not `changed`, so no reset (`app.js:355`).
  - The walk's `activate` sets `pending=null`, then `remember()` (`walk.js:29-37`) writes the step address straight back.
- **Fix.** In the walk's `activate`, when the new hash is home-like and `Router.from === 'walk'`, jump to 0 and set `hold`.
- **Effort** S. **Risk** low.

### P1-9. Search offers a stale "Essay · Who Controls the Chain" that opens Export Controls
- **Evidence.** The index holds three entries for it: `Start here → #/walk/geopolitics`, `Chapter → #geopolitics` and `Essay → #/controls`.
- **Trace.** `app.js:2222`. This is left over from when the essay lived on the controls route.
- **Fix.** Delete the line. The Chapter entry covers it.
- **Effort** XS. **Risk** none.

### Checked and fine
- **Links.** All 1,003 in-page `#` links, all 914 search-index destinations and every glossary-popover link resolve (A6). No duplicate IDs once every view is built.
- **Cold deep links.** Each lands on its target:
  - `#/exposure/<slug>`;
  - `#/suppliers?country=JP` (atlas on Japan);
  - `#/suppliers?tab=country&group=eu`;
  - `#gl-*` and `#lk-*`;
  - `#<chapter>--<section>`;
  - `#/walk/<id>` and `#/walk/flashcards`.
- **Back and Forward.** Back to The Chain restores its place (39,995 px).
- **No duplicated listeners.** Every view that re-activates guards its wiring (`built`, `_wired`, `data-wired`, `bound`). The listeners added on each draw sit on elements that are replaced.
- **Observers** are disconnected on re-render (`Geo.reveal`).

---

## Errors

Every route and the main interactions were toured. Each run was a light pass, then the real toggle, then a dark pass. **Result: 0 page exceptions, 0 `console.error`, 0 unhandled rejections, 0 renderer crashes.**

| Run | Viewport | Steps |
|---|---|---|
| Full tour (walk, deck, canvas, chain, chapter interactions, essay, Suppliers atlas, ladder and ribbons, board, deep links, China panels, Glossary, search, odd routes, resize) | 1440 | 37 |
| Same, plus the phone strip, sheet and popover sheets | 390 phone | 41 |
| Views only | 1024 | 17 |
| Print media, `CP_PRINT.prepare` for the book, a chapter and endnotes | print | 3 |
| Seven static pages, both themes | 1440 and 390 | 14 each |

The only log lines were:
- the blocked external hosts;
- `ERR_CONNECTION_RESET` from the local Python server, right after the theme toggle (see P3-4).

`window.prompt` was called 4 times per run, as the clipboard fallback, because headless Chrome refused clipboard writes. That is the designed fallback, not a bug.

---

## P2: will bite on the next change

### P2-1. The build never fails. Broken data ships, and CI deploys it
- **Evidence.** Each case was built from a HEAD copy. Every one exits `0`.
  - Broken `suppliers.json` → 0 suppliers on the site (index 3.6 MB instead of 4.0 MB).
  - Broken `glossary.json` → no glossary, and no popovers.
  - `build/modules/walk.js` throws → the home view is empty (0 bytes before its footer, 0 `.wk-step`).
  - `summary-a.js` throws → no atlas on Suppliers, and no country role lines.
  - Broken chapter front matter → the chapter ships with no card, no figures and title "lithography".
  - Unknown figure type → the figure is dropped.
  - `.github/workflows/pages.yml` runs `node build/build.js`, and only `check-sources.js` can stop the deploy.
- **Trace.**
  - `readJSON` warns and falls back (`build.js:9`).
  - Module failures warn (`:931-932`).
  - Unfilled placeholders are stripped silently (`:1001`).
  - There is no `process.exit`.
- **Fix.** Split warnings into soft (missing cards or PDFs) and hard: bad JSON, a module throwing, a placeholder left over, a missing figure or an unknown figure type. Exit 1 on any hard one. Today's build has 0 warnings, so this costs nothing now.
- **Effort** S. **Risk** low.

### P2-2. A chapter that loses a field builds without a warning
| Removed from `04-lithography.md` | Result, with no warning |
|---|---|
| `title` | Title becomes "lithography" on the page, the readable page and search |
| `number` | Every footnote renumbers. Card marks go 8, 9, 10 → 34, 36, 39, and the source list reorders. `readingOrderCites` reads `meta.number` (`build.js:435`), but the page uses the fallback number (`:438`). |
| `card` | A stage ships without its chokepoint card |
| `card.concentration` | The card has no band, and the ledger draws band 0 |
| `card.substitutability` | The card falls back to the old "Substitution time" cell |
| `specimen` | Silently becomes `wafer` |
| `plain` | Only this one warns (walk.js) |

- **Fix.**
  - Add a small schema check. Every chapter needs id, number, title, oneLiner, plain and specimen. Stages 1–15 also need `card.concentration`, `card.substitutability.band`, leaders and countries. Make a failure a hard error.
  - Pass the computed number to `readingOrderCites`.
- **Effort** S. **Risk** low.

### P2-3. "Updated" dates move without content changes
Same-day builds are deterministic: two builds of HEAD give byte-identical `dist/` and `page-dates.json`, apart from the build-report timestamp. But the dates move in four cases:
1. **Design-only changes re-date the site.** The home hash covers the whole page, CSS and JS included (`build.js:1003`).
   - One CSS line in `styles.css` → `/` "Updated 25 October 2026".
   - A comment in `app.js` → the same.
   - A class renamed in `figure()` → all 16 chapter pages re-dated: Updated, cite line, `citation_date`, `dateModified` and sitemap. Yesterday's design round did exactly this, so every chapter now says 21 October.
   - `chapter-page.css` alone does not re-date anything, because readable pages hash their article only.
2. **No-change builds re-date the site on content dates.** The hash input is `html.split(builtStr)`, which strips every copy of the build day's date from the hashed text. The page contains "9 November 2026" 8 times. A no-change build on 9 Nov re-dates `/` to 9 Nov, and another on 10 Nov re-dates it to 10 Nov. Tested with a faked clock.
3. **`/summary/` is always dated the build day.** `summary-brief.js:71,121,137` prints `builtStr`, and the sitemap's `lastmod('/summary/')` falls back to today (`build.js:1025`). A no-change build on 25 Oct changed `summary/index.html` and `sitemap.xml`.
4. **CI builds in UTC.** An evening change in New York takes the next day's date on the live site (P3-level).
- **Fix.**
  - Hash the content, not the page: chapters' text, data, glossary and markup with the `<style>` and `<script>` code taken out.
  - Write the day through a placeholder token that is replaced after hashing, not `split(builtStr)`.
  - Give `/summary/` its own `pageDate`.
- **Effort** M. **Risk** low.

### P2-4. Duplicated rules and values, some already disagreeing
- **`styles.css` and `build/assets/chapter-page.css`.**
  - 168 selectors appear in both under the same media, and 37 of them already disagree.
  - Some differences are deliberate layout. These are drift:
    - focus ring `1.5px` (app) vs `2px` (static);
    - `sup.cite a::before` tap target `max(100%, 26px)` vs `24px`;
    - `sup.cite a` weight 500 vs 600;
    - `.stack-legend` 11.5 vs 12 px;
    - `.plate-kpis .v` `--fs-num-s` vs `--fs-d2`;
    - font fallback stacks (static has no "Libre Caslon Display", "Literata" or "IBM Plex Mono").
- **Tokens in `summary-brief.js`.** `--bar-3: #8f8a81` vs the site's `#bfb9af`. `--accent-soft` .08 vs .09 (light) and .12 vs .14 (dark).
- **Constants kept twice.**
  - `COUNTRY` differs across `app.js:12`, `build.js:16` and `build/modules/summary-a.js`:
    - AE is "United Arab Emirates" in the app (Suppliers) but "UAE" in the Glossary list and atlas;
    - DK is missing from `build.js`, so a Danish firm count of 3 could never earn a country card.
  - `Suppliers.SHORT` and `LK_SHORT` are identical copies.
  - The China basis words are one regex chain written twice with different words: `basisShort`, `app.js:2181`, and `basisWord`, `build.js:712`.
  - The peak bar disagrees already. The chart marks the first highest year (`build.js:718`). The table marks every tie (`app.js:2192`), so Hoya shows one garnet 10% in its chart and two in its table.
- **Fix.**
  - Move tokens to one sheet that both pages include.
  - Put COUNTRY, SHORT and the basis words in one shared module that `build.js` requires and passes to the client in `DATA`.
  - Generate the static page's shared component rules, or test that they match.
- **Effort** M–L. **Risk** medium: visual.

---

## P3: tidy-up

### P3-1. Dead CSS, about 22 KB of the 260 KB main sheet
- **Method.**
  - `CSS.startRuleUsageTracking` ran across all the runs above, light and dark, at 1440, 1024 and 390, and in print media. Usage was merged by sheet.
  - Main sheet: 2,112 style rules, 1,640 used.
  - Readable page: 287 rules, 234 used.
  - Summary: 174 rules, 166 used.
  - Each unused rule's class and id tokens were then searched in the built markup, every `src/` and `build/` script, and Paged.js. The DOM was checked with every view built.
- **What is not dead.**
  - Print rules for Paged.js-only states (47).
  - Hover and focus states, dark and phone rules.
  - Content-dependent rules: `.prose blockquote`, `code`, `hr` and `h5`; band 1–2 bars; `[data-k="c7"]`; `.cf-none`; `.lk-revnote`; `.tier-C`/`.tier-D`, which flag a disallowed source.

| Unreachable | Rules | Bytes | Why |
|---|---|---|---|
| `summary-a.css`: `.view[data-view="summary-a"]`, `.sa-h`, `.sa-grid*`, `.sa-marker*`, `.sa-chip*`, `.sa-tile*`, `.sa-stage-*`, `.sa-town*`, `.sa-legend`, `.sa-lg*`, `.sa-nums`, `.sa-num*`, `.sa-cta*`, `.sa-exits`, `.sa-doors` | ~114 | ~11,300 | The map-first prototype is built but never placed: no `{{SUMMARY_A}}` in the template. 0 such elements in the DOM. |
| `styles.css`: `.hero*`, `.claims*`, `.made`, `.thesis*`, `.scroll-hint*`, `.chain-head*`, `.chain-key*`, `.pips*`, `.chip-ch*`, `.brief*`, `.briefing`, `.tier-key`, `.sources-list*`, `[data-view="home"]`, `[data-view="geopolitics"]` | 59 | ~6,100 | Retired home, briefing and sources pages |
| `walk.css`: `.wk-sh*`, `.wk-eyebrow`, `.wk-pips`, `.wk-score[...]` | 21 | ~2,000 | `START_HERE` is built but has no placeholder |
| `suppliers.css`: `.sup-crit`, `.sup-crit-drop`, `.sup-colhi*`, `.sup-ex`, `.sup-china*`, `.sup-pipe-scroll[data-end="0"]` | 11 | ~1,200 | Old pipeline. Since P1.5 the ribbons are drawn to the column width, so `data-end` is always 1. |
| `print.css` and styles: `.mt-*`, `.plate-score*`, `.pips i`, `.pt-chapter .ptc-h/.ptc-cite/.ptc-ck` | 12 | ~1,100 | No markup or script makes them |
| `.ex-panel .val/.grid/.area/.pt/.dot` | 7 | ~480 | Old line-chart panels |
| `.export-bar .count`, `.export-bar--quiet`, `.matrix td .cell[data-hi]`, `.controls-intro` | 6 | ~320 | No full export bar and no `#matrix` exist |
| `.figure svg` (both sheets), `.chapter-sources li .host`, `.review .rv-keep li.miss` | 5 | ~410 | SVG bars are gone. `.host` is never written. `miss` is removed but never added (`app.js:2411`), as the builders noted. `.ptag` is already gone, and `.lead-cn` survives only in lookup.js (P1-4). |

### P3-2. Dead JS and build code
V8 precise coverage across the same runs, then a grep for callers.

| Code | Size | Why |
|---|---|---|
| `Geo.build` matrix block (`app.js:1414-1425`), `addExport('#matrix', …)` (`:2526`), `DATA.matrixNotesHtml` | 1.7 KB | No `#matrix` in the template |
| `addExport`'s full bar branch, `copy()`, the `cp:rows` listener and its dispatch (`app.js:2492, 2517-2523, 1588`) | 1.1 KB | Its only caller is the `#matrix` one |
| Print button handler (`app.js:2642-2653`) and the template's `#print-page` listeners (`template.html:272-273`) | 1.0 KB | There is no `#print-page` (the summary PDF replaced it) |
| `Suppliers.wrapLabel` (`app.js:1044`) | 0.5 KB | No caller |
| `Geo.NUMWORD`/`numWord` (`app.js:1375-1376`), Tools' `if (h.el)` (`:2309`), the empty `else {}` (`:1460`), duplicate key `tipAt: -1` (`:792`, overwritten by the method at `:1064`) | 0.3 KB | No caller, or unreachable |
| `src/modules/summary-a.js`: `selectStage`, the `.sa-tile`/`.sa-marker`/`.sa-chip`/`.sa-town` wiring and branches, `CP.register('summary-a')` (not in `VIEWS`) | ~1 KB | No such elements, no such route |
| `build/modules/summary-a.js:352-462` (`SUMMARY_A` html, except `panels`) | ~8 KB | Built every run, then discarded |
| `build/modules/walk.js:156-164` (`START_HERE`) | 0.9 KB | No placeholder |
| `build.js`: `sourcesHTML`, `briefingHTML` (`:786-803`); `thesisHTML` and `subtitleHTML` (`:664-665`); the fills for `BRIEFING`, `CHAIN`, `CREDITS`, `GLOSSARY_COUNT`, `SUBTITLE`, `THESIS`; `matrixNotes`, `controlsNotes`, `exposureNotes` (read, never used) | ~2.5 KB | No placeholders |
| `build/modules/README.md` | n/a | Names `METHODS`, `START_HERE`, `SUMMARY_B` and `#/summary-a`, none of which exist |

`print.js` is not dead. It runs only under `build/pdf.py` and Paged.js.

### Other P3 items
- **P3-3. The specimen's animation loop never stops.** `Stage.loop` asks for a frame forever, on every view and in background tabs (`app.js:234-237`). Stop asking while `!active || hidden`, and restart in `setVisible` and on `visibilitychange`.
- **P3-4. The theme toggle reloads every animation already loaded, in the other theme.** The `MutationObserver` in `app.js:2587-2596` sets `src` and `preload='auto'` for every video with a source. After scrolling The Chain that is 15 MP4s, about 9.5 MB, which is what reset the local server in the tours. Swap only videos near the screen, and reset the rest to their posters.
- **P3-5. The skip link changes the route.** "Skip to content" sets `#app`. A reload then opens The Chain, because the router has no current view yet (`app.js:302`). Use `tabindex=-1` and `focus()` instead.
- **P3-6. Two slug functions.** `slug` (`build.js:15`) strips apostrophes, but the glossary ids, `lkSlug` and the popover's slug do not. They agree today only because each pairing uses the same one. Use one.

---

## Handoff to the AI Chips builder (left out of the ranking)
- **The stage shows the wrong specimen around AI Chips (A7).**
  - On AI Chips with nothing picked, the stage keeps the last chapter's specimen and tag ("Specimen 04 · Lithography").
  - After picking B200 and pressing Back to `#lithography`, The Chain shows the B200 package with the caption "B200: 2 logic dies and 8 HBM3E stacks on CoWoS-L".
  - Cause: `Sections.currentId` is never reset, so `Sections.update` skips `Stage.show` for the same chapter (`app.js:429-435`).
  - The fix sits outside Landscape: set `Sections.currentId = null` in `Router.route` when the view changes. On arrival, the new page should draw its own default.
- **Dead AI Chips code.** `.spec*` and `.compare*` CSS (about 4 KB) and the count code in `Landscape.syncExport` (`app.js:462-466`) are also dead.

---

## Fix these five first
1. **P1-1.** The generation counter in `Router.settle`, then settle the passage, not the chapter. **S.**
2. **P1-3.** The board's "Now" is the later of the last entry and today. **XS, and it must land before 9 November.**
3. **P1-2.** Supplier filters are set, not toggled, and Glossary links reset the other filters. **S.**
4. **P1-4 and P1-5.** In the Glossary, leave `.ch-meta` and `.ch-cite` out of the corpus, hide the popovers on `hashchange`, and reset the scroll for anchored non-chain routes. **XS + S.**
5. **P2-1 to P2-3.** Make the build exit non-zero on bad data, a failing module or a missing chapter field. Then date pages by a content hash, with the day written after hashing. **M.**

---

## Appendix: repro scripts
Each one runs with `python3 qa/design/shots/design-chapter/proof/dc_shoot.py <url> out.png --width 1440 --port <free port> --wait 4 --eval "<script>"`. Add the host-resolver flag to stay offline.

**A1** (P1-1), url `http://127.0.0.1:8765/`:
```js
(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));location.hash='#/glossary';await sl(600);let a=null;
for(const x of document.querySelectorAll('#lk-items li[data-kind="term"]')){CP.Lookup.select(x.id,true);await sl(30);a=document.querySelector('#lk-mentions a[data-para]');if(a)break;}
const p=CP.Lookup.paras[+a.dataset.para];a.click();const out=[];for(const t of [250,1000,1600,2600]){await sl(t-(out.length?[250,1000,1600,2600][out.length-1]:0));
const r=p.el.getBoundingClientRect();out.push({t,passageTop:Math.round(r.top),chapterTop:Math.round(document.getElementById(p.chapter).getBoundingClientRect().top)});}return out;})()
```
**A2** (P1-2, ribbons), url `…/#/suppliers?tab=country`:
```js
(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms)),c=()=>document.getElementById('sup-count').textContent,o=[];
const r=[...document.querySelectorAll('.sup-rib[data-c="JP"]')];r[0].dispatchEvent(new MouseEvent('click',{bubbles:true}));await sl(500);o.push(c());
document.querySelector('.sup-tabs a[data-tab="country"]').click();await sl(700);const i=r.find(x=>x.dataset.i!==r[0].dataset.i).dataset.i;
document.querySelector('.sup-rib[data-c="JP"][data-i="'+i+'"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));await sl(500);o.push(c());return o;})()
```
**A3** (P1-2, Glossary links), url `…/`: `location.hash='#/glossary'`, then `CP.Lookup.select('lk-firm-asml',true)`. Click `#lk-card a[data-sup]`, return to `#/glossary`, then `CP.Lookup.select('lk-country-jp',true)`. Click `#lk-card a[data-supcc]` and read `#sup-count`.

**A4** (P1-3). It needs a faked clock, which dc_shoot cannot inject. Use CDP `Page.addScriptToEvaluateOnNewDocument` with `Date` shifted to 2026-11-12, load `#/controls`, switch to By subject and read `.cf-row[data-f="entity"] .cf-state` and `#cf-upcoming`. Alternatively, by code trace: `this.now` is `'2026-09-07'` on every date.

**A5** (P1-5), url `…/#lithography`: `scrollIntoView` the first `#lithography .prose button.gl-term` and `click()` it. Then `click()` `#gl-tip a`, wait, and read `#gl-tip`'s `hidden` and rect, `scrollY`, and `#lk-entry`'s top.

**A6** (links): build every view, then resolve each `a[href^="#"]`, each `CP.Tools.buildIndex()` href and each popover slug against the DOM, and count duplicate IDs.

**A7** (handoff): load `#lithography`, go to `#/landscape`, `click()` the first `#picker button[data-id]`, then `history.back()` and read `#stage-tag-text`.
