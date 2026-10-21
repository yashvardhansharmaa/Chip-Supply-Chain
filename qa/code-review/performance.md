# Performance review: chipsupplychain.org

Reviewed 21 October 2026 against the build of 13:06 UTC (`dist/index.html`, 4,112,662 bytes), served at `http://127.0.0.1:8765/`. No repository file was changed except this report. Nothing was fetched from the internet. The September audit (`qa/audit-performance.md`, 2.0 MB page) is the baseline. The page has doubled since.

## The short version

On an emulated mid-range phone over Slow 4G, the home page shows its first useful text at **5.8 s** (median of five), The Chain at **5.9 s**, and Suppliers at **6.8 s**. Nearly all of that is one cause: every view sits `hidden` in one 880 KB (gzipped) file, and nothing can appear until the whole file has arrived (4.6 s) and `boot()` has run. The home view's own markup has arrived by 2.0 s; The Chain's by 0.44 s. They wait anyway.

The second cost is main-thread work on phones. Revealing The Chain takes 278 to 432 ms of style and layout at CPU ×4, and its total blocking time is about 1 s. One CSS rule (`content-visibility: auto` on chapters) cuts that reveal to 12 to 22 ms. After every load, the specimen warm-up builds all 17 point clouds (575 to 690 ms) on every view, including the views that show no specimen.

The static chapter pages are light (26 KB gzipped, 355 ms of main-thread work in total). Their first paint waits on the Google Fonts stylesheet. They also fetch a 130 KB image that is never shown on screen.

---

## How the numbers were taken

| Setting | Value |
|---|---|
| Browser | Chrome 155, `--headless=new`, WebGL on SwiftShader, driven over the DevTools protocol on ports 9980 to 10020 |
| Device | 412 × 823 CSS px at 1.75×, mobile, touch, Android UA (Lighthouse's mid-range phone) |
| CPU | `Emulation.setCPUThrottlingRate` 4 on an Apple M3 Pro |
| Network | Slow 4G: 150 ms RTT, 1.6 Mbps down, 750 kbps up, cache disabled |
| Observers | Installed before navigation (`Page.addScriptToEvaluateOnNewDocument`): paint, LCP, layout shifts, long tasks, long animation frames with script attribution, the first WebGL `drawArrays`, and every `PC.build` call |
| Runs | Five cold loads per page after a warm-up navigation. Medians are reported with the range in brackets. |
| Main-thread breakdown | One traced load per page (`devtools.timeline`), using self time on the renderer main thread |

Four caveats change how to read the numbers.

1. **Compression.** The local server (Python `http.server`) sends no gzip, and GitHub Pages does. So each HTML document got its own throughput rule through `Network.emulateNetworkConditionsByRule`, Chrome 155's per-URL form of `emulateNetworkConditions`. That throughput is 1.6 Mbps × the file's raw-to-gzip ratio (4.67 for `index.html`, 5.1 for `lithography/`), so its bytes arrive when GitHub Pages' gzip would. Everything else ran at 1.6 Mbps. Check: the document finished at 4.57 s, against 4.55 s predicted from its gzip size.
2. **Connection setup.** Localhost has no DNS, TCP or TLS. A real first visit pays about three more round trips, roughly **0.45 s**, before the first byte. Add it to every time below.
3. **CPU.** An M3 Pro at ×4 is still faster than a typical mid-range Android phone. Treat main-thread figures as a lower bound: a real phone takes roughly 1.5 to 2 times as long.
4. **Fonts and rendering.** Offline, the Google Fonts stylesheet was held for 600 ms (about four round trips on a fresh origin) and answered empty, so no font file was downloaded. Font-swap layout shifts were not measured. SwiftShader is a software rasteriser. In some runs it delays when a finished frame appears by 0.3 to 3 s with the main thread idle (long animation frames with `blockingDuration` 0). The ranges below include that noise, and the best runs are closer to a phone with a GPU.

---

# 1. What the 4.1 MB is made of

Each part was gzipped (level 9) and brotli-compressed (level 11) on its own, so the parts sum slightly above the whole.

| Part | Raw | gzip | brotli | Notes |
|---|---:|---:|---:|---|
| **Whole file** | **4,112,662** | **880,244** | **539,888** | |
| Inline CSS (`styles.css` + `src/modules/*.css`) | 260,134 | 55,617 | 44,676 | includes all of `print.css` (37,035 raw, 10,661 gzip) |
| Inline JS: `app.js` + modules | 306,331 | 90,000 | 74,727 | includes `print.js` (47,525 raw, 15,374 gzip) and `lookup.js` (10,339 gzip) |
| Inline JS: `kit.js` | 19,199 | 6,156 | 5,436 | |
| Inline JS: 19 specimens | 214,852 | 60,995 | 50,782 | largest `globe.js` 21.7 KB |
| Inline JSON: `window.CP_DATA` | 874,390 | 202,684 | 149,714 | breakdown below |
| HTML: body markup, all views | 2,429,617 | 464,290 | 249,788 | 21,351 elements |
| Head meta, JSON-LD, font link, small scripts | 7,674 | 3,134 | | |

**Markup by view**

| View | Raw | gzip | Elements | DOM build at ×4 |
|---|---:|---:|---:|---:|
| The Chain (17 chapters) | 1,608,100 | 284,210 | 15,065 | 61.5 ms |
| Glossary | 552,608 | 133,063 | 3,411 | 15.5 ms |
|   `LOOKUP_LIST` (the entry list) | 269,454 | 71,490 | 1,949 | 7.8 ms |
|   `GLOSSARY` (the 208 definitions) | 280,878 | 61,070 | 1,436 | 6.9 ms |
| Export Controls (incl. China revenue panels) | 109,211 | 12,459 | 750 | 5.0 ms |
| Home (the walk) | 90,877 | 20,422 | 1,204 | 4.0 ms |
| Suppliers (atlas shell) | 61,022 | 14,074 | 778 | 2.6 ms |
| AI Chips shell | 2,847 | 1,418 | | |

DOM-build times come from `createContextualFragment` in a quiet page at CPU ×4, median of five. The streaming parser costs several times more, because it works in about 3,600 chunks as the bytes arrive (section 2).

**Inside the 17 chapters** (1,598,067 raw, 280,769 gzip)

| Piece | Count | Raw | gzip |
|---|---:|---:|---:|
| Prose (`div.prose`, cite marks included) | 17 | 1,246,806 | 221,467 |
| **Cite marks `sup.cite`** | 1,514 | **707,454** | 60,430 |
| Source lists (`details.chapter-sources`) | 17 | 242,450 | 39,953 |
| Chokepoint cards (`section.plate`) | 15 | 164,014 | 28,312 |
| Flashcard decks | 17 | 106,255 | 12,808 |
| Figures (59, of which 15 animations) | 59 | 90,659 | 18,331 |
| Glossary popover buttons `.gl-term` | 851 | 75,314 | 6,724 |
| Ledger column with the 15-stage track | 17 | 63,608 | 1,669 |
| In short | 17 | 60,423 | 12,783 |
| In plain terms | 17 | 32,584 | 9,082 |

Each cite mark averages 462 bytes. It repeats the source's title twice (`data-t` and `aria-label`), plus publisher and date, all of which are already in the chapter's own source list. Without those attributes the same marks are 242 KB raw and 21 KB gzipped.

**Inside `CP_DATA`**

| Key | Items | Raw | gzip | Used by |
|---|---:|---:|---:|---|
| `suppliers` | 226 | 301,789 | 65,388 | Suppliers, Glossary cards, search |
| `landscape` | 38 | 168,552 | 39,894 | AI Chips, Glossary cards, search |
| `landscapeNotes` | 38 | 100,361 | 20,861 | AI Chips only |
| `timeline` | 74 | 91,585 | 28,439 | Export Controls, search |
| `exposure` | 126 | 75,383 | 8,627 | China revenue share, search |
| `chapters` | 17 | 60,927 | 19,799 | search, Glossary country cards (repeats prose already in the HTML) |
| `matrix` | 20 | 46,450 | 15,066 | Suppliers panels, Glossary |
| `flows` | 2 | 26,293 | 7,230 | Export Controls |
| `countries`, `exposureLinks` | | 2,902 | 1,135 | Glossary, search |

None of `CP_DATA` is needed to paint the home page or The Chain. `JSON.parse` of all 850 KB takes 6 ms at ×4, so its cost is transfer (203 KB gzip, 1.0 s on Slow 4G), not parsing.

**SVG.** The body holds 36 inline SVGs totalling 117,509 raw and 14,628 gzip. The largest is the Suppliers route map (12 KB raw); the China revenue small multiples are about 4.5 KB each. SVG is not a weight problem.

**Search index.** It is not built at load. `Tools.buildIndex()` runs on the first search (`src/app.js:2207`, called from `:2249`): 914 entries in 60 to 72 ms at ×4. The Glossary's "Where the site uses it" passages are found by scanning the DOM when an entry is selected, so they ship no bytes.

**Where the bytes sit in the file.** This order decides when anything can appear. It is cumulative gzip, converted to arrival time at 1.6 Mbps plus 150 ms:

| Boundary | Raw offset | gzip offset | Arrives |
|---|---:|---:|---:|
| End of `<head>` (CSS done) | 264,913 | 57,116 | 0.44 s |
| The Chain view starts | 269,823 | 58,793 | 0.44 s |
| Home (walk) view starts | 2,051,027 | 368,281 | 1.99 s |
| Glossary view starts | 2,141,910 | 388,392 | 2.09 s |
| Kit and specimen scripts | 2,694,538 | 520,796 | 2.75 s |
| `CP_DATA` | 2,928,937 | 587,258 | 3.09 s |
| `app.js` | 3,803,345 | 789,532 | 4.10 s |
| End of file, then `DOMContentLoaded` and `boot()` | 4,112,662 | 880,070 | 4.55 s |

---

# 2. A first visit on a mid-range phone

Slow 4G, CPU ×4, 412 px phone, five cold loads each; median [min–max]. Add about 0.45 s for real connection setup.

| | Home `#/` | The Chain `#/chain` | Suppliers `#/suppliers` | Static `/lithography/` |
|---|---|---|---|---|
| Document fully arrived | 4.57 s | 4.61 s | 4.59 s | 0.29 s |
| First contentful paint | 0.91 s [0.88–2.15] | 1.11 s [0.86–1.41] | 1.24 s [0.88–3.40] | 2.33 s [0.92–5.54] (see note) |
| **Largest contentful paint** | **5.82 s** [5.39–6.01] | **5.86 s** [5.39–7.84] | **6.76 s** [5.33–11.70] | 2.33 s [0.92–5.54] |
| LCP element | "The chain at a glance" paragraph | How-to lede | Country panel lede | Chapter lede |
| Total blocking time | 239 ms [222–367] | **990 ms** [770–1,278] | **1,075 ms** [259–2,612] | 0 |
| Longest task | 214 ms [210–349] | 769 ms [528–886] | 658 ms [181–1,428] | none over 50 ms |
| Layout shift (CLS) | 0 | 0 | 0.0176 | 0 |
| First specimen drawn | 4.84 s | 5.40 s | never (stage hidden) | no specimen |
| Specimen builds after load | 17, 578 ms | 17, 593 ms | 17, 626 ms | 0 |
| DOM elements | 21,593 | 21,593 | 22,595 | 1,115 |

The main page's FCP is the masthead (the wordmark span). Chrome paints it while the HTML is still streaming, and nothing below it can paint. The static page's HTML arrives at 0.29 s and its main thread is idle by about 1 s. Its slow runs are SwiftShader presenting frames late, not page work: the long animation frames there have `blockingDuration` 0 and 2 ms of render. On a phone with a GPU, its first paint is set by the font stylesheet: about 0.75 s after the HTML, plus connection setup.

Desktop reference (1440 × 900, no throttling, `#/`): LCP 0.97 to 1.04 s, DCL 0.78 to 0.85 s, all 17 specimens built in 190 ms.

## Main-thread time by activity (self time, one traced load each, ms at ×4)

| Phase | Parse HTML | Style | Layout | Script | Paint and composite | Other | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Home**: during download (0–4.57 s) | 409 | 417 | 52 | 87 | 105 | 238 | 1,307 |
| Home: download end to `load` | 30 | 100 | 106 | 141 | 52 | 38 | 467 |
| Home: after `load` | 1 | 31 | 60 | 769 | 266 | 165 | 1,300 |
| **The Chain**: during download | 620 | 49 | 44 | 118 | 19 | 334 | 1,183 |
| The Chain: download end to `load` | 41 | 292 | 343 | 125 | 145 | 62 | 1,010 |
| The Chain: after `load` | 1 | 105 | 125 | 742 | 359 | 213 | 1,549 |
| **Suppliers**: during download | 574 | 99 | 50 | 91 | 25 | 302 | 1,142 |
| Suppliers: download end to `load` | 49 | 115 | 64 | 220 | 49 | 38 | 536 |
| Suppliers: after `load` | 1 | 22 | 33 | 780 | 158 | 124 | 1,123 |
| **Static `/lithography/`**: whole load | 35 | 25 | 120 | 18 | 49 | 109 | 355 |

What this says:

- **Parsing HTML and building the DOM** costs 410 to 660 ms per load on the main page. Script compilation is about 50 ms and the `CP_DATA` parse 6 ms. The JS itself is cheap to load. The markup is not.
- **Style during the home page's download (417 ms)** comes from 96 small recalcs of about 10 elements each. Each one costs 2 to 5 ms and grows as the DOM grows. That is the signature of `body:has(...)` selectors re-checked against a growing subtree (finding 5).
- **Boot on The Chain** is one task of 528 to 886 ms at ×4 (770 ms in one attributed run, 442 ms of it forced style and layout): the first layout of the 226,430 px chain view on a phone.
- **After `load`, 742 to 780 ms of script** is the specimen warm-up building all 17 clouds, and this happens on Suppliers too. The globe alone is a 119 to 147 ms long task.

## When the 3D specimen first draws

Home 4.84 s, The Chain 5.40 s, both about 15 ms after `boot()` starts. On a phone the canvas is the 116 CSS px bottom strip, 203 × 203 device px, which is 41,209 pixels. The first cloud (`die-floorplan`) is built in 34 to 54 ms with 80,473 points, about two points per pixel. After `load` the warm-up builds the other 16 (37,097 to 98,110 points each). In all, 1.17 million points and **17.9 MB of GPU vertex buffers** go to a strip that shows one specimen at a time.

## Route changes after load (×4, phone, from a loaded page)

| To | ms |
|---|---:|
| The Chain | 495–671 |
| Export Controls (first visit) | 239–257 |
| Suppliers (first visit) | 184; 881 when coming from The Chain |
| Glossary (first visit) | 174–177 |
| AI Chips (first visit) | 66–135 |
| Home | 130–146 |

---

# 3. Findings

**P1**: a reader on a phone feels it. **P2**: a clear win. **P3**: polish. Effort is in hours. Savings are on Slow 4G at ×4 unless stated.

## P1-1. No view can paint until the whole file has arrived and `boot()` has run

**Evidence.** Every view is `hidden` in the markup (`src/template.html:83, 124, 147, 186, 229, 231`), and `[hidden] { display: none !important; }` (`src/styles.css:103`) keeps it so until `Router.route()` un-hides one at `DOMContentLoaded` (`src/app.js:328`, `boot()` at `:2630–2674`). The home view's markup has arrived by 1.99 s and The Chain's by 0.44 s. Both wait for the end of the file at 4.55 s, then for boot. Measured LCP: home 5.82 s, The Chain 5.86 s, Suppliers 6.76 s, against FCP of about 1 s for the masthead alone. The home view also sits 2 MB into the file, behind all 17 chapters (`template.html:229`).

**Fix.**
1. Add a tiny inline script in `<head>`, beside the theme script (`template.html:47–50`). It reads `location.hash` with the same mapping as `Router.route()` (`app.js:293–306`) and sets `<html data-route="walk|stack|…">`.
2. Drop the `hidden` attribute from the view sections in the template.
3. Hide the views with CSS keyed off that attribute until boot, for example `html:not(.booted)[data-route="walk"] .view:not([data-view="walk"]) { display: none }`. The router sets `hidden` and the `booted` class from then on.
4. Move the walk section to the top of `<main>`.
5. Set the stage's `data-hidden` from the same attribute, which also removes the Suppliers shift: the 128 px strip shrinks to 48 px at boot, CLS 0.0176.

**Saving.** The routed view paints as soon as its own bytes and the font stylesheet have arrived. That moves LCP from 5.8 s to roughly **1.0 to 1.5 s** for home and The Chain (estimate from the arrival table; add 0.45 s for connection setup on a real visit), a gain of about 4.5 s. Visitors without JavaScript stop seeing a blank page. Interactivity still waits for boot at about 4.6 s; P1-2 fixes that.

**Effort** 4 to 6 h. **Risk.**
- Bare chapter anchors (`#lithography`) and Glossary anchors (`#gl-…`) must map to the right view in the head script.
- The specimen strip and the walk's rail appear at boot, so reserve their space or keep them hidden until then.
- With The Chain visible while it streams, its layout happens during the download. P1-3 makes that cheap.

**Touches** `src/template.html`, `src/styles.css`, the router in `src/app.js`, `src/modules/walk.js` (`owns()`), and `build/pdf.py` (it prints `#/chain`, which is unaffected).

## P1-2. Every first visit downloads the whole site

**Evidence.** 880 KB gzipped, 4.4 s of transfer at 1.6 Mbps, whichever page the reader opened. Home needs its CSS (57 KB), its walk markup (20 KB), the core of `app.js` and one specimen, roughly **160 to 200 KB**. The rest is other views:

- the chapters, 281 KB;
- the Glossary markup, 133 KB;
- `CP_DATA`, 203 KB;
- the other 18 specimens, about 55 KB;
- the print CSS and JS, 26 KB.

The Glossary's `LOOKUP_LIST` (`build/build.js:992`) rebuilds data that is already in `CP_DATA`.

**Fix, in order of return.**
1. Write `CP_DATA` as per-view JSON files (`dist/data/v/*.json` with content-hashed names). Fetch each on first activation of its view, and fetch the search slices at idle or on the first focus of the search box. Saves 185 KB gzip on home and The Chain, 0.9 s.
2. Build the Glossary list from that data in `src/modules/lookup.js` on first visit. Ship the definitions as JSON, which `Tip.def()` (`app.js:2049`) can read instead of the `#glossary` DOM. Saves 133 KB and 3,411 elements, 0.67 s.
3. Load `print.css` as `<link rel="stylesheet" media="print">` and `print.js` on print intent; `build/pdf.py` can inject it. Saves 26 KB, 0.13 s.
4. Emit one script per specimen and load each on first need. Saves about 55 KB.
5. Emit The Chain as its own fragment, fetched when the reader goes there. Find-in-page within The Chain still works, and hidden views are not searchable by find-in-page today anyway.

**Saving.** A home visit drops from 880 KB to about 180 KB: about 3.5 s less transfer. Boot, the specimen and search are then ready at about 1.3 to 1.6 s instead of 4.8 s. A Chain visit drops to about 420 KB.

**Effort** 3 to 5 days in all; steps 1 to 3 alone are about 1.5 days. **Risk.**
- The site stops being one self-contained file that works when saved to disk.
- Every route needs a loading state.
- The search index must cope with slices that arrive late.
- The PDF scripts must wait for the chain fragment.

**Touches** `build/build.js` (the fills at `:916` and `:992–997`), the router and `Tools.buildIndex` in `src/app.js`, `Tip`, `src/modules/lookup.js`, `build/pdf.py`, `build/chapter_pdfs.py`, and `qa/scripts/check-integrity.js`.

## P1-3. Revealing The Chain blocks the main thread for half a second or more

**Evidence.**
- `boot()` on `#/chain` is the longest task, 528 to 886 ms at ×4; in one attributed run it was 770 ms, with 442 ms of forced style and layout. The Chain's TBT median is 990 ms, and a route change into The Chain takes 495 to 671 ms.
- In isolation, un-hiding The Chain and forcing layout on a phone costs **278 to 432 ms** (4 samples, document 226,430 px tall).
- With `article.chapter { content-visibility: auto; contain-intrinsic-size: auto 9000px }` the same reveal costs **12 to 22 ms**. With only two chapters in the DOM it costs 43 to 59 ms.
- On `load`, `setMast` (`app.js:2660–2661`) removes and re-adds `--masthead` unconditionally, which forces a full relayout: 108 ms on The Chain, 19 to 25 ms elsewhere.
- The first read in boot, `narrow()` (`window.innerWidth`, `app.js:8`, called at `:120`), forces the first synchronous layout. In one profile that read alone cost 118 ms at ×4.

**Fix.**
1. Add the `content-visibility` rule for chapters in `src/styles.css`. Do the same for the Glossary definitions list and the Suppliers ladder rows if they grow.
2. In `setMast`, write the variable only when the measured height differs.
3. Use `matchMedia('(max-width: 899px)')` for `narrow()`.

**Saving.** About 400 ms off The Chain's boot task and route change, plus 100 ms off its `load` handler. TBT on The Chain should fall from about 990 ms to about 450 ms (estimate). Scrolling paints less, because off-screen chapters skip rendering.

**Effort** 1 to 2 h plus testing. **Risk.**
- Deep links land on estimated chapter heights until real sizes replace them. `Router.settle()` (`app.js:381`) already re-corrects for 1.2 s; check it with `#lithography` and `#geopolitics`.
- `Sections.update()` reads chapter boxes, which still exist under `content-visibility`.
- Check the print and PDF path (`build/pdf.py`): Chrome renders skipped content for print, but confirm the page count is unchanged.

**Touches** `src/styles.css`, `src/app.js`, and the print check.

## P2-4. The specimen warm-up builds all 17 clouds after every load, on every view

**Evidence.** `idle(warm, 1200)` (`app.js:2667–2672`) builds every specimen named in The Chain. Its `requestIdleCallback` timeout forces each build within 0.75 to 3.6 s, idle or not.

- Measured at ×4: 575 to 690 ms of main thread after `load` on home, The Chain and Suppliers. Suppliers never shows the stage (`stage.hidden = "1"`).
- The globe build is a long task of 119 to 147 ms.
- On a phone the clouds total 1.17 million points and 17.9 MB of GPU buffers for a 203 × 203 px strip.
- A real mid-range phone takes about 1 to 1.4 s, in the seconds when a reader starts to scroll.

**Fix.**
1. Skip the warm-up while the stage is hidden.
2. On narrow screens, build only the next one or two specimens, triggered by an IntersectionObserver with a wide `rootMargin` on the chapters.
3. Set `PC.density` from the canvas's pixel area, not the viewport (`app.js:120`), and rebuild when the strip expands.
4. Later, build in a Web Worker; `kit.js` is already dependency-free and returns a transferable `Float32Array` (September audit, fix 2).

**Saving.** 550 to 700 ms of main thread after load (×4) on views without a stage, about 500 ms on phones elsewhere, and roughly 12 MB of GPU memory on phones.

**Effort** 2 to 3 h, or a day with the worker. **Risk.** A specimen not yet built is built inside the scroll handler (`Sections.update()` → `Stage.show()` → `Stage.build()`, `app.js:433` → `:170`), which costs 15 to 55 ms, and 120 ms for the globe. Building ahead avoids that.

**Touches** `src/app.js` (Stage, boot) and `src/modules/walk.js`.

## P2-5. `body:has(...)` selectors make style recalcs scale with the size of the page

**Evidence.** Five rules use `body:has()` or `.masthead:has()`: `src/styles.css:353, 908, 915, 920` and `src/modules/controls.css:250`. They key off attributes that JavaScript already sets: `.to-top[data-show]`, `.stage[data-hidden]`, `.tabs[data-end]` and `.cf[data-mode]`. Measured in loaded pages at ×4:

| | With `:has()` | Without |
|---|---:|---|
| One flip of `.to-top[data-show]`, The Chain | **36.3 ms** of style | 0.04 ms |
| Same flip, home | 12.8 ms | |
| `Sections.update()`, The Chain | 1.76 ms | 0.08 ms |
| Forced full style and layout, The Chain | 139 ms | 107 ms |

During the home page's download, 96 recalcs of about 10 elements cost 417 ms in total. Setting the same value again costs nothing, so the scroll handler pays only when the state flips: when the reader passes the contents box, and on every route change. At those moments the frame drops.

**Fix.** Set classes or data attributes on `<body>` or `<html>` from the same code that sets the attributes: `Sections.update` (`app.js:411`), `Stage.setVisible` (`:181`), the tab-strip handler (`:2656`) and the controls mode switch. Then write the five rules against those classes. The `.cp-search-results:has(a:focus)` rules (`styles.css:541–544`) are scoped to a small list and can stay.

**Saving.** About 35 ms off the frames where those states flip on The Chain (about 60 ms on a real phone), and up to about 400 ms of style during the home download.

**Effort** 1 to 2 h. **Risk** low. **Touches** `src/styles.css`, `src/modules/controls.css`, `src/app.js`.

## P2-6. The print cover art downloads on every visit to The Chain

**Evidence.** The router fetches `print-title.png` (501,200 bytes, 1558 × 1558, already an 8-bit palette PNG) when the browser goes idle after The Chain is shown (`app.js:331–336`). In all five Chain runs its download started 0.2 to 2.2 s after `load`. That is 2.5 s of Slow 4G bandwidth, often competing with the first animation's poster and video, and a real data cost for readers on metered plans. Few of them print.

**Fix.** Fetch it only on print intent. The hooks are already in place: hover or focus on Print, `beforeprint`, `matchMedia('print')`, and `CP_PRINT.prepare` for `build/pdf.py` (`template.html:262–276`). Remove the idle fetch. A browser Ctrl+P on a slow line may then print without the cover art, which is a fair trade.

**Saving.** 501 KB per Chain visit. **Effort** 0.5 h. **Risk** low. **Touches** `src/app.js`.

## P2-7. Fonts: a third-party, render-blocking stylesheet for five families

**Evidence.** `src/template.html:28` requests Fraunces (roman, opsz and wght axes), Source Serif 4 (roman variable plus italic), Instrument Sans (roman variable plus italic), Jost 400 and IBM Plex Mono 400 and 500. That is one render-blocking CSS request to `fonts.googleapis.com` plus up to eight `latin` woff2 files from `fonts.gstatic.com`. No text uses a `latin-ext` character, so no extra subsets load.

In the rendered pages:

- the home page's first screen uses four faces: Instrument Sans, Fraunces, Source Serif 4 roman and Jost 400 (only for the specimen tag);
- the whole home view adds IBM Plex Mono in two text nodes;
- The Chain uses Plex Mono in 14 text nodes.

The font files could not be weighed offline. By their usual Google Fonts sizes, the four first-screen faces are roughly **170 to 230 KB** and all eight roughly 280 to 370 KB (estimate; check in DevTools on the live site, Network, filter "font"). The static chapter pages load three families (`build/modules/social.js:33`). There the stylesheet, on its own origin, is the critical path to first paint: about four round trips (0.6 s) after the HTML.

**Fix.**
1. Self-host the latin woff2 files under `dist/fonts/` with hashed names and inline the `@font-face` rules.
2. Preload Source Serif 4 roman and Fraunces roman, the faces of the LCP text.
3. Replace Jost with Instrument Sans for the specimen tag, and Plex Mono with `font-variant-numeric: tabular-nums`. This is a design call for the owner.
4. Add metric-matched fallbacks (`size-adjust`, `ascent-override`) so the swap does not shift text.

**Saving.** About 0.45 to 0.6 s off first paint on the static chapter pages, and on the main page once P1-1 lands. Two fewer files, 35 to 55 KB (estimate). One third-party origin gone.

**Effort** 4 to 6 h. **Risk.** The look of the type (check the specimen tag and the aligned figures). All five families are under the OFL, so self-hosting is allowed. Font-swap shifts are unmeasured today and could appear or disappear with this change.

**Touches** `src/template.html`, `src/styles.css`, `build/modules/social.js`, `build/modules/summary-brief.js`, `src/modules/print.js:44` (which fetches the font CSS for print), and `build/cards.py` if it reads the same URL.

## P2-8. Images and video are sized for desktop

**Evidence.**
- The 15 animations are 1520 × 840 H.264 at 24 fps, 0.34 to 0.87 MB each (19 MB of MP4 in `dist/media`). Their posters and stills are also 1520 × 840.
- On a 412 px phone the frame is about 380 CSS px, 665 device pixels.
- Re-encoded at 760 × 420 (CRF 20, a test copy in the scratchpad): the MP4s fell 47 to 56% (litho 379 → 200 KB, racks 873 → 381 KB, power 850 → 430 KB). The end-frame JPEGs fell about 70% (130 → 37 KB).
- A reader who scrolls the whole chain on a phone downloads up to about 9.5 MB of video.

Loading is otherwise well judged. Posters are fetched only within 1.5 screens (`app.js:2602`), and videos only at 45% visible (`:2605`).

The static chapter pages fetch two 1520 × 840 JPEGs eagerly: the poster (130 KB) and the print still `.anim-still` (130 KB). The still is `display: none` on screen (`build/assets/chapter-page.css:247`) but has no `loading="lazy"` (`build/modules/social.js:332`). That is 260 KB of images against a 26 KB page, and half of it is never shown.

**Fix.**
1. Add `loading="lazy"` to `.anim-still`, or set its `src` on `beforeprint`.
2. Use a 760 px poster on the readable pages.
3. Have `build/animate.py` also write `-760` renditions, and let `Anim` (`app.js:2553`) pick them under 700 px.

**Saving.** 130 KB immediately per static chapter page, plus about 95 KB for the smaller poster. About 0.4 MB per animation watched on a phone.

**Effort** 1 h for the static pages; 4 to 6 h plus re-rendering for the video renditions. **Risk.** Check that the labels inside the animations stay legible at 760 px; 665 device px is the display size, so they should. **Touches** `build/modules/social.js`, `build/animate.py`, `src/app.js` (`Anim`), and `build/build.js:953`, which copies the media.

## P2-9. Caching: one file means every deploy costs every returning reader the full 880 KB

**Evidence.** GitHub Pages serves every file with `cache-control: max-age=600`, an ETag, gzip and no brotli. These headers were recorded in `qa/audit-performance.md` §1.11 on 9 September and not re-checked here, because this review ran offline. The site deploys on every push to `main` (`.github/workflows/pages.yml`), so any change, even one comma, changes `index.html`'s ETag, and the returning reader downloads everything again. Brotli would make today's file 540 KB instead of 880 KB (−39%), and the host cannot serve it. Media files keep stable names across re-renders, so a reader can get an old video against new step timings for up to 10 minutes. Cards already carry `?v=N`.

**Fix.** With P1-2, give the CSS, `app.js`, specimens, data slices and chapter fragment content-hashed names. A deploy then re-downloads only what changed; unchanged files cost a 304 revalidation every 10 minutes. On top of that, a small service worker that serves hashed files cache-first makes repeat visits instant and works offline. Moving to Cloudflare Pages or Netlify would add brotli and `immutable` headers. That is a DNS change at Squarespace and the owner's call.

**Saving.** After any deploy, a returning reader downloads only the changed parts. Brotli would save 340 KB today if the host changes.

**Effort** 2 to 3 h for hashing (with P1-2), 4 to 6 h for the service worker. **Risk.** A faulty service worker can pin stale pages; ship it with a kill switch. **Touches** `build/build.js`, `src/template.html`, a new `sw.js`, the workflow.

## P2-10. Nothing is minified, and print-only code ships to every visitor

**Evidence.** The build inlines the sources verbatim (`build/build.js:921, 996–999`). Comments alone are about 42 KB of the CSS and 50 KB of the JS. `print.css` (10.7 KB gzip) and `print.js` (15.4 KB gzip) are inlined into every page view.

**Fix.** Minify the CSS and JS in the build (esbuild and lightningcss, or a careful comment-and-whitespace strip), with a flag for an unminified build. Load the print code on demand (P1-2, step 3).

**Saving.** About 50 to 70 KB gzip for minification (estimate; the September audit measured 25 KB for a conservative strip of a smaller page). Plus 26 KB for print. Together 0.4 to 0.5 s on Slow 4G.

**Effort** 2 to 3 h. **Risk.** A build dependency where there is none today; view-source becomes unreadable unless the unminified build is kept. **Touches** `build/build.js`, `package.json`.

## P3-11. Cite marks carry their source's metadata twice

**Evidence.** The 1,514 marks are 707 KB raw (17% of the file, 44% of the chapter markup) and 60 KB gzip (`build/build.js:91`). Their DOM build costs 20 ms at ×4; slimmed, 10 ms. The popover (`Cite.show`, `app.js:1996`) reads `data-t`, `data-p` and `data-d`, which repeat the chapter's own source list.

**Fix.** Give each mark its source's index (`data-s="12"`). Let the popover read the matching `<li>` of the chapter's source list, and keep a short `aria-label="Source 12"` with `aria-describedby` pointing at that `<li>`.

**Saving.** 465 KB raw, 39 KB gzip, about 10 ms of DOM build at ×4, and less HTML to parse while streaming. **Effort** 2 to 3 h. **Risk.** Screen-reader wording changes; test it with VoiceOver. **Touches** `build/build.js`, `src/app.js` (`Cite`), `build/modules/social.js` (the readable pages reuse the rendered chapters), and `src/modules/print.js` (printed notes read `data-pg`).

## P3-12. Fifteen copies of the same blank poster

**Evidence.** The `-start.jpg` posters are 14 identical light files and 14 identical dark files of 15,309 bytes each (two other animations differ). Each is fetched under its own URL as the reader scrolls: about 230 KB that one file would cover.

**Fix.** Point every animation at one shared start poster per theme, or drop the poster and paint the frame's background colour.

**Saving** about 215 KB per full scroll. **Effort** 0.5 h. **Touches** `build/build.js:173`, `src/app.js:2555`, `build/animate.py`.

## P3-13. Smaller items

- `DATA.chapters` repeats the In plain terms paragraphs and card fields that the HTML already carries: 61 KB raw, 20 KB gzip. Read them from the DOM, or drop them with P1-2.
- The ledger column repeats the 15-stage track in all 17 chapters: 63 KB raw, but only 1.7 KB gzip and about 1,000 elements. Leave it unless the DOM count matters.
- `Sections.update()` runs on every scroll event and reads 17 chapter boxes. It is cheap with layout clean (0.08 ms without `:has()`), but rAF-coalescing it would avoid repeat work on fast flings.
- The first search builds the index in 60 to 72 ms at ×4. That is acceptable. It could be built at idle once the search box is focused.

---

# 4. Checks

**Does anything large load that a first visit never uses?**

- `#/` loads the document, the font stylesheet, the counter script and the favicon. Nothing else.
- `#/chain` also loads `print-title.png` (501 KB, P2-6).
- `#/suppliers` loads nothing extra.
- Inside the document, a first visit to any one view carries the other five views and all of `CP_DATA`. That is 600 to 700 KB of the 880 KB for a home visit (P1-2). It also carries 26 KB of print code and the 18 specimens the visit will not show.

These never load on a first visit, which is right:

- `dist/data/` (1.4 MB, including `bibliography.json`) and the PDFs (9.6 MB for the chain, 8.7 MB for the chapter PDFs) load only when asked for.
- The cards (1.8 MB, 24 PNGs of 34 to 146 KB) are fetched only by link unfurlers.
- The animations' MP4s load only when a figure is on screen.
- The `anim-print` images in the main page are `loading="lazy"` and `display: none`, so they never load.

**Are the static chapter pages light?** Yes, with one exception.

- `/lithography/` is 134,567 bytes raw and 26,345 gzipped, with 1,115 elements.
- It uses no JavaScript apart from the theme line and the counter.
- It has no long task, and 355 ms of main-thread work in total at ×4.
- Its HTML arrives at 0.29 s.

The exception is images. The page fetches 260 KB of them, of which the 130 KB print still is never shown (P2-8). Its first paint waits on the third-party font stylesheet (P2-7). These pages are the ones shared on social media, so they are the most common first landing, and their two fixes are the cheapest in this report.

**Layout shift.** The September audit's masthead shift (0.30 on phones) is gone: CLS was 0 on home, The Chain and the static page in every run. The only shift left is Suppliers at 0.0176, the phone specimen strip shrinking at boot (fixed by P1-1). Font-swap shifts were not measured.

---

# 5. The five fixes to do first

1. **Paint the routed view before the file finishes (P1-1).** Route attribute set in `<head>`, views hidden by CSS until boot, the walk first in `<main>`. LCP on home and The Chain goes from about 5.8 s to about 1.0 to 1.5 s. 4 to 6 h.
2. **`content-visibility: auto` on chapters, and no needless relayouts in boot (P1-3).** The Chain's reveal drops from 278–432 ms to 12–22 ms at ×4; TBT falls about half. 1 to 2 h.
3. **Take `CP_DATA` and the Glossary markup out of the first download (P1-2, steps 1 to 3).** Per-view JSON, the Glossary list built on first visit, print code on demand. Saves about 345 KB gzip, 1.7 s on Slow 4G, on every first visit. About 1.5 days.
4. **Build specimens only where and when they are shown (P2-4).** No warm-up on views without a stage, the next one or two on phones, density from the canvas size. Saves 550 to 700 ms of main thread after load and about 12 MB of GPU memory on phones. 2 to 3 h.
5. **Self-host the fonts and preload the two that set LCP (P2-7).** Removes the third-party render-blocking hop that sets the static chapter pages' first paint (about 0.5 s), and trims five families to three. 4 to 6 h.

Each of these quick wins takes an hour or less and can go alongside: stop the idle fetch of `print-title.png` (P2-6, 501 KB per Chain visit), add `loading="lazy"` to the static pages' hidden still (P2-8, 130 KB per chapter page), and replace the five `body:has()` rules with classes (P2-5).

---

*The harness (DevTools driver, observers, trace and profile summaries, probes, page variants) is in `qa/code-review/perf/`. Its README gives the command to rerun the phone measurement before and after a fix: `qa/code-review/perf/run_phone.sh <label>`, four pages, five cold loads each, medians with ranges. It talks to the local server only.*
