# Reliability and bug audit — 9 September 2026

Front-end audit of the built site (`node build/build.js` → `dist/index.html`, served at
`http://localhost:8765/`). Routes, the stage, the phone layout, the widgets, resize behaviour,
robustness, and a read of `src/app.js` for latent faults.

Eleven defects found. Nine fixed, two left as recommendations. No wording, content, data or build
file was touched: the changes are confined to `src/app.js`, `src/styles.css`, `src/modules/walk.js`
and `src/template.html`.

Baseline for every diff below: commit `de567ea` (16:09, "Introduction chapter retired … chapters
renumbered 01 to 17"). Note that a second writer was active in the same tree during this audit and
landed the Intro's cited-facts blocks (`.wk-facts`, `src/modules/walk.css`) and `.sa-est`
(`src/modules/summary-a.css`); those two files are in the same commit range but are not my changes.
The last build in this session includes them and the site tests clean with them.

---

## Fixed

### 1. With no WebGL the stage showed an empty frame labelled "Specimen 00"

**Where** `src/app.js`, `Stage.setVisible`.

**Reproduce** Load the page with `HTMLCanvasElement.prototype.getContext` returning `null` for
`webgl`/`webgl2` (I served a copy of `dist/index.html` with that stub injected before `<body>`'s
scripts). Go to `#/chain`.

**Before** `Stage.init` correctly set `data-hidden="1"` on the figure and left `Stage.ok` false, but
`setVisible` ignored `ok` and set `data-hidden="0"` again on every route into The Chain, the Intro
and AI Chips. Measured: a 427 × 128 px empty stage carrying the template's boot text
`Specimen 00 · the whole chip` and an empty caption. `Stage.show` returns early when `!ok`, so the
tag could never be corrected — the "00" stayed for the whole session.

**Fix** `setVisible` now computes `show = v && this.ok` and hides the figure whenever there is
nothing to draw. `Stage.init` also returns early if the canvas or the figure is missing, and
`Stage.build` returns `null` when there is no context (previously the idle warm-up generated all 17
point clouds at full cost before throwing at `gl.createBuffer`).

**After** `display: none` on `#/chain`, `#/intro`, `#/landscape` and chapter anchors; console clean;
chapter navigation still scrolls correctly.

### 2. Every bare in-page anchor forced the view to The Chain

**Where** `src/app.js`, `Router.route`.

**Reproduce (a)** On any page, press Tab then Enter on "Skip to content". **(b)** Open `#/methods`
and click any heading permalink (`#methods--concentration`).

**Before** The router treated any hash that was not `#/…` as a chapter anchor:
`var v = (bare === '' || bare === '/') ? 'home' : 'stack';`. So the skip link's `#app` switched the
reader from Home or Suppliers to The Chain, and all 44 in-page anchors that point into the Methods
view did the same, then called `scrollIntoView` on an element inside a now-hidden section, so the
reader landed at the top of The Chain instead. Verified against a rebuilt copy of the pre-fix
router: clicking a Methods permalink gave `view = stack`, `title = "… · The Chain"`, `y = 0`.

**Fix** A bare anchor now resolves to the view that contains it
(`document.getElementById(anchor).closest('.view[data-view]')`). An id that exists but sits outside
every view — `#app` is the only one in the page — leaves the current view alone. An id that does not
exist keeps the old fallback (The Chain).

**After** A sweep of all 207 distinct bare anchors in the built page: 162 resolve to `stack`, 44 to
`methods`, 1 (`#app`) leaves the view untouched, none is a dead target. The skip link now stays on
Home and on Suppliers; Methods permalinks stay on Methods and scroll to the heading.

### 3. Going to `#/` from a scrolled page landed at the foot of the home page

**Where** `src/app.js`, `Router.route`.

**Reproduce** Read to the end of the Intro, then click "Where it is made: the map" (`href="#/"`).
Or scroll deep into The Chain and click the wordmark.

**Before** `anchor` was computed as `!m && h.length > 1 ? decodeURIComponent(h.slice(1)) : null`, so
the hash `#/` produced the anchor `"/"`. That made the scroll reset `changed && m && !anchor` false
in both of its terms, so nothing reset the scroll position. Measured on the old build: home shown at
`y = 492` with a maximum scroll of 491 — the reader lands on the footer. The wordmark's own smooth
scroll to the top was cancelled when the view swap collapsed the document height.

**Fix** `#/` no longer produces an anchor, and the reset condition is now `changed && !anchor`.

**After** `y = 0` by all three routes (hash, wordmark, the Intro's end link). Anchored navigation
still keeps its scroll target (`#lithography` → 29,322; `#/walk/lithography` → 2,409).

### 4. Escape did not close the search dialog, and closing it lost the reader's place

**Where** `src/app.js`, `Tools.open` / `Tools.close`.

**Reproduce** Press Ctrl+K, type a query, Tab to a result, press Escape. Then press `/`.

**Before** Escape was bound to the input only, so it did nothing once focus moved to a result.
Closing the dialog left focus on the now-hidden input, so the reader's place in the page was gone
and the `/` shortcut stopped working (its guard sees an `INPUT` as the active element).

**Fix** Escape is handled on the dialog element, so it works from any control inside it. `open()`
records the previously focused element and `close()` restores it with `focus({preventScroll: true})`;
`close(true)` from a result link skips the restore so the destination keeps focus. The `/` handler
now also tolerates a null `activeElement` and no longer fires inside a `<select>` or a
contenteditable, where it was stealing the browser's own type-ahead.

**After** Escape closes from a result and from the input; focus returns to the control the reader
came from with no scroll jump; the backdrop click restores focus too; following a result leaves
focus alone and navigates; `/` reopens immediately after a close.

### 5. Back or Forward left the phone Contents sheet open over the new page, scroll-locked

**Where** `src/app.js`, `Band.init`.

**Reproduce** At phone width, open Contents from the bottom strip, then press the browser's Back
button.

**Before** The sheet closed only on a link tap, its own close button, Escape, or a resize above
900 px. After a history navigation it stayed on screen over the new view with
`document.documentElement.style.overflow = 'hidden'` still set. Measured: `sheetHidden: false`,
`lock: "hidden"`, view already switched to Glossary underneath.

**Fix** A `hashchange` listener closes the sheet and restores the scroll lock. `Band.init` runs
before `Router.init`, so the sheet closes before the view swaps.

**After** Back and Forward both leave `sheetHidden: true` and the lock cleared; link taps and Escape
behave as before.

### 6. The glossary overflowed the page at 320 px

**Where** `src/styles.css`, `.glossary`.

**Reproduce** Open `#/glossary` at a 320 px viewport.

**Before** `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))` forces a 340 px column
inside a 284 px content box, so every `.gl-entry` overhung the page by 38 px and the whole document
picked up a horizontal scrollbar. It was the only route that overflowed at 320 px.

**Fix** `minmax(min(340px, 100%), 1fr)`.

**After** One 284 px column at 320 px with no overflow; still six columns at 2560 px.

### 7. Geopolitics was numbered 18 in two places and 17 everywhere else

**Where** `src/template.html`, the hard-coded geopolitics article.

**Reproduce** Open `#geopolitics` and read the stage tag; or listen to the chapter heading with a
screen reader.

**Before** The chapter renumbering at 16:09 left two stale literals in the template:
`data-number="18"` (so the stage read "Specimen **18** · Geopolitics") and
`<span class="sr-only">Chapter 18: </span>`. The visible tile on the same card already read 17, the
contents grid reads 17, `DATA.chapters` has `17: geopolitics`, the walk step carries
`data-number="17"` and the build report says "16 + geopolitics".

**Fix** Both literals changed to 17.

**After** A scroll through all 17 chapters gives "Specimen 01 … Specimen 17", each with the caption
from its own `data-caption`.

### 8. A malformed hash threw a URIError and aborted the router

**Where** `src/app.js`, `Router.route`; `src/modules/walk.js`, `jump`.

**Reproduce** Open `#/glossary`, then set the hash to `#%` (or `#%E0%A4%A`, or `#/walk/%`).

**Before** `decodeURIComponent('%')` throws. The exception escaped `route()` before any view work,
so the Glossary stayed on screen while the hash said otherwise, the title, tabs, stage visibility
and module activation were all skipped, and the console carried
`Uncaught URIError: URI malformed`. The same call in `walk.js`'s deep-link jump threw from a
`setTimeout`, where the router's `try/catch` cannot catch it. This one predates the audit.

**Fix** A `dec()` helper in `app.js` and a local `try/catch` in `walk.js` fall back to the raw string.

**After** `#%`, `#%E0%A4%A` and `#a%20b` fall back to The Chain like any other unknown anchor;
`#/walk/%` stays on the Intro; console clean.

### 9. `#/summary-a` and `#/summary-b` never reached the page their alias named

**Where** `src/app.js`, `VIEWS`.

**Before** `ALIAS` mapped both to `home` and the title map had entries for them, but neither name was
in `VIEWS`, so the alias was unreachable and both URLs fell through to The Chain. Nothing in the
built page links to them, so this only affects a bookmarked or shared legacy URL.

**Fix** Both names added to `VIEWS`.

**After** Both land on Home with the map bound and the correct title.

---

## Left, with a recommended fix

### A. AI Chips "Clear" leaves the stage showing the chip you just removed

**Reproduce** Open `#/landscape`, click Clear.

The page collapses to its designed empty state — `data-empty="1"` hides the plans, the table, the
notes, the key, the export bar and the section headings, and the count reads "No chip selected" —
but the stage keeps drawing the last focused chip and keeps its tag and caption
("AI chips · Rubin (VR200)", "Rubin (VR200): 2 logic dies and 8 HBM4 …"). It survives leaving the
view and coming back, because `Landscape.activate` only calls `showStage` when `this.sel` is set.

Left alone because every fix picks new behaviour or new copy, which is the owner's call. The three
options: hide the figure while the selection is empty; fall back to the generic package the section
already declares (`<section data-view="landscape" data-specimen="package">`, an attribute nothing
currently reads) under the template's own boot tag; or write a short empty-state tag. If the second
is wanted, it is one line in `Landscape.clear`:

```js
Stage.show('package', { plan: true }, '', 'Specimen <b>00</b> · the whole chip');
```

### B. The cite block only appears in the home page footer

`Tools.init` ends with `var foot = $('.site-footer')`, which takes the first of the two footers in
the page. "Cite this site" therefore appears under the home map and not under The Chain, where a
reader who has just finished 22,000 words is most likely to want it. Changing `$` to `$$` and
looping would put it in both, but that adds a visible block to a page the owner has designed, so it
is a decision rather than a defect.

### Smaller notes, in rough order of value

1. **Contents sheet focus.** The sheet is a `role="dialog"` with no focus trap, and closing it
   (Escape or ×) drops focus to `<body>` instead of returning it to the Contents button. Same class
   of problem as the search dialog, now fixed there; phone-only, so lower value.
2. **Search dialog** has no `aria-modal="true"` and no focus trap; Tab can leave it for the page
   behind.
3. **Boot is brittle to a template change.** `Theme.init`, `Sections.init`, `Suppliers.build`,
   `Geo.build` and `Landscape.buildUI` dereference `$('.theme-toggle')`, `$('.to-top')`,
   `$('#sup-chips')`, `$('#tl-filters')`, `$('#picker')` and others with no null check. Any one of
   them going missing from `template.html` throws inside `boot()` and takes the whole runtime with
   it — no router, no views. The Stage path is now guarded; the rest would be five `if (!x) return;`
   lines.
4. **`src/modules/summary-a.js` registers the view name `summary-a`**, which the router never
   activates (the home view is `home`). The home map works only because the module also calls
   `bind()` at load. `CP.register('home', …)` would make the registration real.
5. **Phone pages reserve 140 px for a strip that is not there.** `body { padding-bottom: 140px }`
   applies at every width below 900 px, but the strip is hidden on Home and all five data pages,
   leaving 181 px of blank at the foot of, for example, Suppliers. `body:has(.stage[data-hidden="1"])
   { padding-bottom: 24px }` would cover it.
6. **`.sa-town` markers on the home map are `<span>`s** with a click handler, so they select a
   country by mouse but cannot be reached or fired from the keyboard. Countries are all reachable
   through the `.sa-chip` and `.sa-marker` buttons, so nothing is lost, but the towns are an
   inconsistent target. Fixing it means changing `build/modules/summary-a.js`, outside this audit's
   remit.
7. **The country-share matrix has no export button.** `Tools.init` still calls
   `addExport('#matrix', 'country-share matrix', DATA.matrix)`, and `#matrix` no longer exists, so
   the call is a no-op and those 20 rows are the only dataset with no copy button.
8. **Copy buttons have no fallback beyond a message.** Where the Clipboard API is unavailable or
   blocked, both `Suppliers.copy` and `Tools`' export bars show "Copy failed" and stop. `dist/data/`
   is served, so a download link would be a working second route.
9. **The exposure tooltip is placed in document coordinates** and can be clipped above the page for
   a point near the document top, and it does not follow the point on scroll (the glossary popover
   does). Neither is reachable with the current chart position.
10. **Suppliers sort puts empty values last in both directions** (`if (va == null) return 1`), which
    looks deliberate but means "sort by founded, descending" is not the reverse of ascending. Only
    the active column carries `aria-sort`.
11. **With no WebGL, the desktop text column stays at 58 %** of the window, leaving the right 42 %
    blank now that the stage hides cleanly. Widening `--col` when the stage is unavailable would fix
    it; it is a layout decision.
12. **`.briefing` carries the same `minmax(340px, 1fr)` pattern** that overflowed the glossary. It is
    not rendered in the current build, so it is only a trap for whoever brings it back.

---

## Checks that passed

**Routes.** Cold load and in-page navigation for `#/`, `#/intro`, `#/walk`, `#/briefing`, `#/chain`,
every one of the 17 chapter anchors, `#geopolitics`, `#/geopolitics`, `#/landscape`, `#/suppliers`,
`#/controls`, `#/thresholds`, `#/exposure`, `#/glossary`, `#/sources`, `#/methods`, `#/nonsense`,
`#does-not-exist`, `#/walk/lithography`, `#/summary-a`, `#/summary-b`, `#contents`, `#app`, a
chapter sub-heading and a Methods sub-heading. Correct view, correct sub-tab, correct
`document.title`, correct `aria-current` on the masthead tab, correct stage visibility, no
horizontal overflow, and Back and Forward retrace the sequence. Console clean throughout, on cold
load and on navigation.

**The stage.** Scrolling all 17 chapters of The Chain and all 17 steps of the Intro gives the right
specimen number, chapter title and caption at every stop, and the rail marks the right stage and
greys the ones behind it. The cross-fade logic (`prev` at `1 - k`, `cur` at `k`, `transDur` 1 ms
under reduced motion) reads correctly; the animation itself could not be observed, see the caveats.
The figure is hidden on Home and on all five data pages and shown on The Chain, the Intro and AI
Chips. The WebGL-unavailable path is covered above.

**Phone (375 × 812).** Strip expands to 471 px and collapses to 128 px with the label and
`aria-expanded` following; the Contents sheet opens with focus on its close button and the page
locked, and closes on ×, Escape, a link tap and now on Back or Forward, restoring the lock every
time; no horizontal overflow on any of the twelve routes at 375 px, nor at 320 px after fix 6; the
masthead tab row scrolls (439 px of tabs in 347 px); the suppliers table (1139 px), the thresholds
table (1322 px), the exposure table (553 px) and the chips table all scroll inside their own
containers; the glossary popover becomes a bottom sheet that clears the strip.

**Widgets.** Search opens on Ctrl+K, on `/` and from the masthead button, ranks results sensibly
(14 hits for "euv", glossary entries first), Enter opens the first result, results are Tab-navigable,
and Escape and the backdrop close it. Glossary popovers open on hover, on focus and on tap, close on
mouse-out, on Escape (returning focus to the term), on a second tap and on an outside click, and are
clamped inside the viewport. The chips picker enforces the limit of four with a message, Clear
empties the page, the selection survives leaving the view and coming back, and arrow keys, Home and
End walk both the picker and the package row. Controls' three sub-tabs switch and set the hash and
`aria-current`; the timeline filter chips (51 → 32 items) and the threshold regime chips
(40 → 32 rows) filter and unfilter. The exposure tooltip shows filed figures on hover and on focus
and hides on mouse-out and blur. Export buttons build correct CSV and JSON, and where the clipboard
is blocked they show "Copy failed" and restore their label after 2 s. The cite block renders in the
home footer. The theme toggle flips the attribute, the label, the icons and the WebGL ink and
persists to `localStorage`; `?theme=dark` and a system dark preference both work. Previous/Next
links, chapter cross-links, heading permalinks and the skip link all resolve.

**Resize.** Crossing 1240 px (wordmark subtitle) and 900 px (single column, phone masthead, bottom
strip, rail hidden) in both directions updates `--col`, `--masthead`, the stage mode and the canvas
backing store, with no overflow at any step and no ratchet on `--masthead` (it returns to 56 px
after a visit to the two-row phone masthead).

**Robustness.** 320 px and 2560 px viewports and a 640 px proxy for 200 % zoom: no overflow on any
route. Dark mode by query and by system preference. Print rules applied by hand (chrome, stage, rail,
search, tooltips, export bars and permalinks hidden; white ground, black text, full-width column,
details forced open, one chapter per page). Keyboard traversal of the home map (chips, markers, town
selection, panel switching) and of the chips picker. No duplicate element ids among 306, one `<h1>`,
no image without `alt`, no button without an accessible name, no `target="_blank"` without
`rel="noopener"`.

**Code read.** `localStorage` is wrapped in `try/catch` in both places it is used, including the
pre-paint theme script. `Stage.cache` is bounded by the specimen and chip counts. `Tip`'s hide timer
and the AI Chips resize debounce are cleared; the copy-label timers are harmless. Every listener that
could be attached twice is behind a `built`/`bound` flag or attached once at boot. `requestIdleCallback`
has a `setTimeout` fallback. Every `closest` on an event target is either guarded or reached only
from element targets. Module activation is wrapped in `try/catch`, and the build wraps each module
file in its own `try/catch`. The remaining fragility is the unguarded `querySelector` dereferences in
the init paths, noted above.

---

## Caveats — what this environment could not show

The Browser pane was hidden for the whole audit, and a hidden pane delivers no frames. That means:

- CSS transitions never advance. The phone strip appeared stuck at 128 px until I set
  `transition: none` and measured again (471 px expanded). Any transition-based check here is
  unreliable.
- Smooth scrolling never animates. "Back to top" looked broken until I spied on `window.scrollTo`
  and confirmed it is called with `{top: 0, behavior: 'smooth'}`; a plain instant scroll to the same
  target works. Same for any `scrollIntoView` with `behavior: 'smooth'`.
- Scroll events are frame-aligned, so they are not delivered either. Scroll tracking was tested by
  calling `Sections.update()` after each scroll and, for the Intro rail, by routing
  `requestAnimationFrame` through `setTimeout`.
- Real focus events do not fire on `.focus()`, though `activeElement` does move. Focus paths were
  exercised with synthetic `focusin`/`focus` events.
- `prefers-reduced-motion` cannot be emulated by the available tools. It was reviewed in code
  (`transDur` 1 ms, no idle spin, no scroll rotation, `behavior: 'auto'` on every programmatic
  scroll) and in CSS (`html { scroll-behavior: auto }`, stage transition off, walk and map blocks).
- `python3 -m http.server` sends no cache headers, and Chrome served a stale `index.html` after one
  rebuild, which briefly made a verified fix look broken. Every navigation after that used a unique
  `?cb=N` query string. Worth knowing for the other testers on this port.
