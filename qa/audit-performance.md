# Performance audit

Measured 9 September 2026 against `dist/index.html` (build of 20:07 UTC, 2,039,798 bytes) served at `http://localhost:8765/`, and against the live site at `https://yashvardhansharmaa.github.io/chokepoints/` (build of 20:27 UTC, 2,058,258 bytes). No files in the repository were changed.

## How the numbers were taken

Two rigs, because neither alone is honest.

**Real GPU.** Chrome 152 in the Browser pane on an Apple M3 Pro, 11 cores, devicePixelRatio 2. Good for CPU work, WebGL, layout and memory. The pane was hidden throughout, so this rig produces no paint or `requestAnimationFrame` timings.

**Headless.** `Chrome --headless=new` driven over the DevTools protocol (`qa/`-external harness in the session scratchpad, modelled on `build/shoot.py`), with the cache disabled, a `PerformanceObserver` installed before navigation for paint, LCP, layout-shift and long-task entries, and CPU and network throttling. Good for paint, Core Web Vitals and throttled CPU. Its WebGL runs on SwiftShader, a software rasteriser, which inflates one number by roughly 250x: `Stage.init()` costs 1,557 to 1,853 ms there and **6.5 ms on the real GPU**. Every WebGL initialisation figure below comes from the real GPU.

To separate parse cost from paint cost, eight variants of the built file were generated and measured: scripts removed, fonts removed, chapters removed, inline SVG removed, hidden views deferred, and an instrumented copy carrying `performance.now()` marks at the end of the style block, at `</main>`, after each script block, and around every phase of `boot()`. A renderer warm-up navigation precedes each measured load; without it the harness has a 2.4 s first-paint floor that swamps the page.

---

# 1. Measured numbers

## 1.1 Page weight

| | bytes |
|---|---|
| Raw | 2,039,798 (1,992 KB) |
| gzip, level 9, local | 473,969 |
| **Served by GitHub Pages (gzip)** | **491,076** |
| brotli, level 11, local | 311,778 |
| Served when the client offers only `br` | 2,040,492, uncompressed |

GitHub Pages serves gzip and does not serve brotli. A request carrying `Accept-Encoding: br` alone gets the full 2 MB. Brotli would cut 162 KB, or 34 percent, and the platform cannot deliver it.

### What the bytes are

Each part gzipped on its own, so the column sums slightly above the whole-file figure.

| Part | Raw | gzip alone | Share of raw |
|---|---|---|---|
| HTML markup and text | 1,153,438 | 240,053 | 57% |
| Inline JSON, `window.CP_DATA` | 473,159 | 126,206 | 23% |
| 19 specimen scripts | 210,073 | 70,451 | 10% |
| Inline CSS | 101,425 | 19,761 | 5.0% |
| `app.js` | 84,413 | 24,631 | 4.1% |
| `kit.js` | 16,630 | 5,188 | 0.8% |
| Theme bootstrap script | 237 | | |

Inside the markup:

| Section | Raw | gzip | DOM nodes | Inline SVG |
|---|---|---|---|---|
| The Chain, 17 chapters plus strip | 664,303 | 139,683 | 9,195 | 27 blocks |
| Sources, 336 links | 124,156 | 23,929 | 1,403 | 0 |
| Methods | 88,847 | 26,495 | 948 | 0 |
| Export Controls | 92,158 | 10,890 | 766 | 21 blocks |
| Glossary, 74 terms | 77,212 | 16,895 | 500 | 0 |
| Home, world map | 44,155 | 9,591 | 625 | 1 block |
| Intro | 42,465 | 9,951 | 679 | 0 |
| AI Chips and Suppliers shells | 2,983 | 1,317 | 40 | 0 |

All 52 inline SVG blocks together weigh 132,698 bytes raw and 17,485 gzipped, and carry 1,784 tags. SVG is not a weight problem.

Inside `CP_DATA`:

| Key | Raw | gzip | Items |
|---|---|---|---|
| `suppliers` | 165,280 | 42,306 | 220 |
| `landscape` | 58,065 | 15,786 | 19 |
| `controls` | 55,726 | 15,605 | 40 |
| `exposure` | 49,806 | 5,633 | 103 |
| `chapters` | 45,237 | 15,773 | 17 |
| `timeline` | 39,469 | 14,006 | 43 |
| `landscapeNotes` | 31,709 | 11,165 | 19 |
| `matrix` | 27,746 | 10,320 | 20 |

`DATA.chapters` duplicates prose the build already wrote into the HTML: the `plain` paragraphs (9,356 bytes), `oneLiner` (3,152), and the chokepoint card fields `leaders`, `countries`, `substitution`, `chinaStatus` and `usStatus` (28,933 combined).

The 645-URL bibliography is **not** in the page. It sits in `dist/data/bibliography.json` (171,712 bytes) and is fetched only on request. The whole of `dist/data/` is 860 KB across 16 files and costs a visitor nothing.

The build runs no minifier. A conservative comment-and-indent strip takes the code from 412,541 to 329,457 raw (down 20 percent) and from 120,031 to 94,711 gzipped (down 21 percent, 25 KB). A real minifier with identifier mangling would beat that. The HTML itself already ships without indentation: collapsing whitespace saves 849 bytes.

## 1.2 Fonts

The Google Fonts stylesheet is **render-blocking** (`renderBlockingStatus: "blocking"` on every run). It weighs 1,081 bytes gzipped and took 216 to 550 ms on the live site. `preconnect` to both `fonts.googleapis.com` and `fonts.gstatic.com` is already in place.

The stylesheet declares 41 `@font-face` rules across five unicode subsets. On The Chain, 7 load, all `latin`. Measured woff2 sizes:

| Face | Bytes |
|---|---|
| Newsreader roman, variable, wght 300–700, opsz 6–72 | 131,848 |
| IBM Plex Sans Condensed 500 / 600 / 700 | 43,488 |
| IBM Plex Mono 400 / 500 / 600 | 30,232 |
| **Downloaded on a cold home load** | **205,568** |
| Newsreader italic, variable, wght 300–600 | 147,060 |
| IBM Plex Sans Condensed 400 and italic 400 | 30,220 |
| **All 10 latin faces, worst case** | **382,848** |

Newsreader alone accounts for 64 percent of the fonts that load and 73 percent of the worst case. Both Newsreader files are variable fonts carrying a full optical-size axis and a full weight axis. `src/styles.css:67` sets `font-optical-sizing: auto`, so the optical axis earns its place; the italic almost certainly does not need one, and `--font-body` appears in only 4 declarations against 87 for `--font-mono` and 31 for `--font-display`.

Requesting static instances instead, measured by fetching the alternative stylesheets:

| Request | latin total | Saved |
|---|---|---|
| As shipped | 382,848 | |
| Newsreader as static 400, 600 and italic 400 | 244,652 | 138,196 |
| Also trim Plex Mono to 400/500 and Condensed to 400/600/700 plus italic | 219,824 | 163,024 |

Changing only the italic from variable to static 400 saves 122,652 bytes on its own.

A cold visit to the home page therefore transfers roughly **690 KB**, of which 491 KB is the page and 201 KB is fonts. With italic text on screen it reaches 870 KB.

## 1.3 First paint and time to interactive

Real GPU, localhost, warm connection:

| | ms |
|---|---|
| `responseEnd` | 8 |
| Body parse, `<body>` to `</main>`, all views | 41.7 |
| `domInteractive` | 104 |
| `boot()` | 50.4 |
| `loadEventEnd` | 158 |

Inside `boot()`, everything except the stage costs under 3 ms combined: Theme 0.4, Glossary 0.1, Tip 0.0, Tools 1.6, `setMast` 0.9, Band 0.2, Router 0.6, Sections 0.3. WebGL setup accounts for the rest: context creation 4.0 ms, shader compile and link 2.5 ms.

Live site, cold, cache disabled, headless:

| Scenario | TTFB | `responseEnd` | `domInteractive` | FCP | LCP | CLS |
|---|---|---|---|---|---|---|
| Desktop 1440, no throttle | 108 | 206 | 730 | 2196 | 2196 | 0.0045 |
| Desktop 1440, 4G | 337 | 1228 | 1233 | 2120 | 2120 | 0.0045 |
| Mobile 390, 4x CPU, 4G | 73 | 1036 | 1062 | 2612 median | **2612 median, 2588–3720** | **0.2988 in 4 of 6 runs** |
| Mobile 390, 4x CPU, 3G | 283 | 3803 | 3824 | 3136 | 3136 | 0.2727 |

The LCP element on the home page is `p.sa-sub`, a text paragraph, so LCP tracks FCP. FCP figures carry software-rasteriser overhead of a few hundred milliseconds; the ordering between scenarios is sound, the absolute value is pessimistic.

### Chapter deep link

A bare chapter anchor such as `#lithography` routes to the stack view and scrolls. It costs measurably more than `#/chain`:

| | `domInteractive` | Body parse | CLS |
|---|---|---|---|
| `#/chain` | 199 ms | 46 ms | 0.0285 |
| `#lithography` | 834 ms | 47 ms | 0.0297 |
| `#geopolitics` | 180 ms | 14 ms | 0.0297 |

Parse is identical. The extra 635 ms is Chrome performing fragment navigation into a 141,229 px document during parsing, forcing layout repeatedly as content streams in. The `Router` already handles the first jump correctly by disabling smooth scrolling (`src/app.js:239`), so this cost lands before the router ever runs.

## 1.4 Parsing 17 chapters at once

Measured with the instrumented variants, `<body>` to `</main>`:

| Variant | Body parse, 1x | Body parse, 4x CPU | DOM nodes |
|---|---|---|---|
| Full page | 41.7 ms | 200.2 ms | 14,434 |
| 17 chapters removed | 6.2 ms | 162.3 ms | 5,547 |
| All inline SVG removed | 38.5 ms | 49.8 ms | 13,034 |
| Every hidden view deferred into `<script type="text/html">` | 5.0 ms | 124.1 ms | 911 |

**Parsing the chapters costs about 35 ms on this machine and roughly 160 ms on a CPU four times slower.** Deferring every hidden view saves 37 ms and 13,500 DOM nodes, and saves no bytes at all.

Hidden views cost nothing per frame. A forced full style recalculation and layout with all views present but hidden costs 1.3 ms on home, the same as a page that contains nothing else. `display: none` subtrees never enter the layout tree.

The conclusion is narrow: lazy rendering is a DOM-size and parse fix worth 35 ms, not a weight fix. It is worth doing only if the DOM node count itself becomes a problem, and it would cost the site in-page Ctrl+F across chapters.

## 1.5 WebGL specimens

19 specimens are registered, 18 appear in the DOM (`wafer` is registered but unreferenced). Build times on the real GPU, `PC.density = 0.85`, median of three runs:

| Specimen | Points | Median | Cold | Cloud KB |
|---|---|---|---|---|
| globe | 85,972 | 64.3 | 74.9 | 1,343 |
| euv-scanner | 104,077 | 24.1 | 59.6 | 1,626 |
| probe-card | 113,202 | 22.2 | 26.9 | 1,769 |
| foup | 121,010 | 16.1 | 34.3 | 1,891 |
| gpu-baseboard | 100,404 | 13.9 | 17.1 | 1,569 |
| gaa-transistor | 70,797 | 13.3 | 15.9 | 1,106 |
| process-chamber | 63,767 | 12.9 | 29.4 | 996 |
| rack | 93,308 | 12.9 | 15.7 | 1,458 |
| sem-column | 85,374 | 12.2 | 25.3 | 1,334 |
| die-floorplan | 100,743 | 11.5 | 15.1 | 1,574 |
| hbm-stack | 67,518 | 11.1 | 12.8 | 1,055 |
| photomask | 75,983 | 9.3 | 10.5 | 1,187 |
| wafer-cost | 64,582 | 9.2 | 11.3 | 1,009 |
| cowos-exploded | 68,618 | 8.6 | 14.0 | 1,072 |
| gas-cabinet | 86,779 | 8.5 | 16.2 | 1,356 |
| package | 79,807 | 8.1 | 11.3 | 1,247 |
| boule-and-wafer | 45,386 | 5.2 | 11.9 | 709 |
| substrate-layers | 49,336 | 4.1 | 6.2 | 771 |
| **Total** | **1,476,663** | **268** | **408** | **23,072** |

Under a 4x CPU throttle the same 17 warm builds take **697 ms**, and each one becomes its own long task: globe 132 ms, process-chamber 56, die-floorplan 52, euv-scanner 51, probe-card 47. The long-task log from a throttled load shows five entries over the 50 ms threshold after `boot()` finishes, spread from 2.4 s to 3.6 s.

Everything after the geometry is free. Uploading a 1,343 KB cloud to a VBO takes 0.2 ms. Drawing 121,010 points takes under 0.1 ms median and 0.4 ms at worst. A transition frame that draws two clouds at once is also under 0.1 ms. **The renderer is not the cost. The procedural geometry on the main thread is the whole cost.**

### Does it stall scrolling

Yes, in one specific way. `Sections.update()` runs on every scroll event and calls `Stage.show()` when the current chapter changes, which calls `Stage.build()` synchronously (`src/app.js:280` into `src/app.js:107`). If the reader reaches a chapter before the idle warmer has built it, the scroll handler blocks for the full build time: 4 to 64 ms on this machine, 47 to 132 ms on a CPU four times slower.

The warmer starts at `requestIdleCallback(warm, {timeout: 3600})` and builds one specimen per idle callback. On a throttled load it finishes around 3.6 s after navigation. A reader who starts scrolling before then hits uncached specimens.

The scroll probe itself is cheap and well written. Timed over 300 calls:

| | The Chain | Intro |
|---|---|---|
| `Sections.update()`, layout clean | 0.021 ms | 0.012 ms |
| `Sections.update()`, layout dirtied first | 21 ms | 1.8 ms |

`update()` does not dirty layout itself: calling it after a clean layout leaves layout clean, so the 17 `getBoundingClientRect()` calls read cached geometry. The 21 ms figure applies only when something else invalidates style first, which happens once per chapter boundary when `Stage.show()` rewrites the caption and the rail flips `aria-current`.

## 1.6 Layout cost by view

Forced full style recalculation and layout, median of nine samples on the real GPU:

| View | Desktop 1440 | Visible nodes | Document height | Mobile 375 |
|---|---|---|---|---|
| Home | 1.3 ms | 625 | 1,372 px | 1.5 ms |
| Intro | 1.4 ms | 679 | 10,007 px | 1.6 ms |
| Glossary | 1.3 ms | 500 | 10,666 px | |
| China revenue share | 2.3 ms | 2,277 | 2,616 px | |
| Sources | 3.8 ms | 1,403 | 20,674 px | |
| Suppliers | 7.2 ms | 3,410 | 25,476 px | 4.9 ms |
| **The Chain** | **21.8 ms** | **9,195** | **141,229 px** | **12.2 ms**, 169,692 px |

Adding `content-visibility: auto; contain-intrinsic-size: auto 8000px` to `.chapter` in the live page cut the forced layout from 21.9 to 16.3 ms, a 25 percent improvement. That measurement forces a full layout and so defeats most of the property's benefit; the gain during ordinary scrolling, where off-screen chapters skip paint entirely, will be larger.

Route transitions:

| Route | ms |
|---|---|
| `#/chain` | 122.6 |
| `#/landscape` | 73.9 |
| `#/intro` | 19.7 |
| `#/suppliers` | 12.0 |
| `#/controls` | 11.2 |
| Everything else | 0.8 to 4.4 |

## 1.7 Interaction cost

| Handler | JS | Forced layout | Notes |
|---|---|---|---|
| Suppliers search, one keystroke, 220 rows visible | 3 to 9 ms | **34 to 43 ms** | Re-renders the whole table on every `input` |
| Suppliers search, narrowed to 30 rows | 2.6 ms | 5.4 ms | |
| China revenue share tooltip | 0.1 ms median, 9.8 ms max | | 143 circles, 724 SVG nodes |
| Glossary popover | 1.4 ms median, 6.2 ms max | | 225 `.gl-term` buttons, one shared panel |

The tooltip and popover handlers are delegated on `document` and share a single panel. Both are fine.

The suppliers filter is not. At roughly 50 ms per keystroke on an M3 Pro, a CPU four times slower puts it near 200 ms, which is the INP failure threshold. The first two characters typed are the expensive ones, because they leave most of the 220 rows on screen.

## 1.8 Memory

| | |
|---|---|
| DOM nodes on load | 14,426 |
| DOM nodes after visiting all 11 views | 19,638 |
| JS heap, home | 4 MB |
| JS heap, after all 11 views | **21.4 MB** |
| GPU vertex buffers, 18 specimens | **22.5 MB**, 1,476,663 points |
| Stylesheets / CSS rules | 2 / 774 |

The heap steps from 4 MB to 21.4 MB when the AI Chips view first activates, then stays flat. The geometry `Float32Array`s are released after `gl.bufferData`, so the 23 MB of cloud data lives on the GPU rather than in the heap. Nothing leaks across route changes.

Rows built lazily on first view: suppliers 221, licence thresholds 41, China revenue share 21, timeline 51. That is already the right pattern.

## 1.9 Mobile, emulated 375 x 812 at 2x

| | |
|---|---|
| `PC.density` | 0.55 |
| `boot()` | 101.8 ms |
| Body parse | 20 to 42 ms |
| Collapsed stage canvas | 116 x 116 CSS px, **232 x 232 device px** |
| Points drawn into it | globe 69,348, foup 91,714, probe-card 98,110 |
| The Chain document height | 169,692 px |
| Horizontal overflow | none |

The collapsed specimen strip renders 60,000 to 98,000 points into 53,824 device pixels. There are more points than pixels, by a factor of two on some specimens. The same clouds are built at the same size whether the strip is collapsed to 64 px or expanded to 46vh.

Build times at density 0.55 on an M3 Pro: globe 60.3 ms, wafer 42.1, probe-card 29.2, euv-scanner 24.0, foup 8.6. A mid-range phone runs 5 to 8 times slower than this machine, which puts globe between 300 and 480 ms.

## 1.10 Core Web Vitals

Repeated cold loads against the live site, cache disabled:

| Scenario | n | LCP median | LCP over 2500 ms | CLS |
|---|---|---|---|---|
| Desktop 1440, 4G | 3 | 2252 ms | 0 of 3 | 0.0045, 0.0045, 0.0052 |
| Chapter deep link, desktop, 4G | 6 | 2494 ms | 3 of 6 | 0.0297 every run |
| Mobile 390, 4x CPU, 4G | 6 | 2614 ms | **6 of 6** | 0, 0, 0.2394, 0.2988, 0.2988, 0.2988 |

| Metric | Desktop | Mobile, 4x CPU, 4G | Threshold | Verdict |
|---|---|---|---|---|
| LCP | 2252 ms median, 0 of 3 over | 2614 ms median, 6 of 6 over | 2500 ms | **Fails on mobile** |
| CLS | 0.0045 | 0.2394 to 0.2988 in 4 of 6 loads | 0.100 | **Fails on mobile** |
| INP | not measured | suppliers filter projects to ~200 ms | 200 ms | At risk |

### The mobile CLS has one cause and it is verified

The layout-shift attribution names a single element:

```
t=2719 ms  value=0.2988
  html>body>div#app>main   [y 52, h 792] -> [y 75, h 769]
```

`src/styles.css:595` sets `--masthead: 52px` at the narrow breakpoint. `src/styles.css:117` sets `#app { padding-top: var(--masthead) }`. On a 375 px viewport the masthead wraps to two rows and its real height is **75 px**, which I confirmed by clearing the inline value and reading `offsetHeight`. `setMast()` in `boot()` measures the masthead and writes the true value, and every pixel of page content drops 23 px. On an 812 px viewport that is 0.028 of the viewport across the full width, and the layout-shift score comes out at 0.2988.

`setMast()` also runs again on `window.load`, after the fonts swap, giving a second opportunity for the same shift.

It fires in 4 of 6 cold loads. When the first paint happens to land after `setMast()`, the shift never becomes visible and CLS is 0. That is a race, not a fix.

Desktop CLS is 0.0045 and comes from the same family: `main` gaining its height when the router reveals a view. Chapter deep links measured 0.0297 in four runs and 0.4513 in one outlier, attributed to `article.chapter` and a `ul` moving after fonts settled above the anchor.

## 1.11 GitHub Pages caching

```
cache-control: max-age=600
etag: W/"6aa1c149-1f22ac"
vary: Accept-Encoding
content-encoding: gzip
age: 0, x-cache: MISS, via: 1.1 varnish
```

Ten minutes of freshness, then a conditional request. Revalidation works correctly and returns 304 with an empty body. `dist/data/*.json` carries the same headers.

None of this is configurable. GitHub Pages fixes `max-age=600` for every file and offers no brotli, no `immutable`, and no per-path rules. Because the site is one HTML file with no fingerprinted assets, a repeat visitor after ten minutes pays one round trip for the 304, and pays the full 491 KB whenever the ETag changes, which is on every deploy.

Moving to Cloudflare Pages or Netlify would buy brotli (162 KB) and long-lived caching for fonts and data files. Neither is required for the site to work.

---

# 2. Fixes, ranked

Effort is coded as an hour, a day, or a week.

### 1. Set `--masthead` correctly in CSS. An hour.

The single worst number in the audit and the cheapest to fix. `--masthead: 52px` at the narrow breakpoint is wrong by 23 px; `setMast()` corrects it after `boot()` and shifts the entire page.

Give `.masthead` `height: auto` with a `min-height`, and set `#app`'s top padding from the same source, so the first layout is already right. If the two-row height must stay a variable, set it per breakpoint to the real measured value (75 px at 375 px wide) and let `setMast()` refine rather than correct.

**Gain: CLS 0.2988 to near zero on mobile, in 4 of 6 loads. Turns a Core Web Vitals failure into a pass.**

### 2. Move specimen geometry off the main thread. A day.

Each build is 4 to 64 ms here and 47 to 132 ms on a mid-range CPU, and `Sections.update()` calls `Stage.build()` synchronously inside a scroll handler.

A Web Worker is the right answer and `src/kit.js` is already built for it: it is dependency-free, exports through `module.exports` as well as `window.PC`, and produces a `Float32Array` that transfers to the main thread at zero copy cost. Build in the worker, transfer the buffer, call `gl.bufferData` on the main thread at 0.2 ms.

Precomputed binary clouds are the alternative and cost more than they save. The 19 clouds total 23 MB of `Float32Array`; even quantised to 16 bits per component they would add several megabytes to a page that already transfers 491 KB. The generators are 210 KB and produce all 23 MB. Keep them.

Two cheap mitigations if the worker waits: give `Stage.show()` a one-frame deferral so an uncached build never runs inside the scroll handler, and drop `globe` from the idle warm order so the 132 ms outlier does not land in the middle of a reader's first scroll.

**Gain: removes 5 long tasks of 47 to 132 ms from every throttled load, and removes the worst-case 132 ms scroll stall.**

### 3. Request static Newsreader instead of variable. An hour.

Change the `family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600` fragment in `src/template.html:10`.

Dropping the italic to a static 400 saves **122,652 bytes** on its own and costs nothing visible: one italic weight is all the prose uses. Dropping the roman to statics 400 and 600 saves a further 15,544. Trimming IBM Plex Mono to 400/500 and Condensed to 400/600/700 saves another 24,828.

Keep `font-optical-sizing: auto` and the roman variable font if the optical axis matters to the design; take the italic saving regardless.

**Gain: 123 to 163 KB off a cold load, roughly 20 percent of total transfer. Directly improves mobile LCP.**

### 4. Self-host the fonts and preload the three that matter. A day.

The Google Fonts stylesheet is render-blocking on a third-party origin and took 216 to 550 ms on the live site. `preconnect` already softens the handshake, and the request still sits on the critical path ahead of first paint.

Put the latin woff2 files in `dist/fonts/`, inline the `@font-face` rules into the existing `<style>` block, keep `font-display: swap`, and `<link rel="preload" as="font" type="font/woff2" crossorigin>` the three faces visible above the fold. This removes one render-blocking request, two DNS lookups and two TLS handshakes, and gives you real control over which subsets ship.

It also removes a third-party dependency from a site whose whole premise is a self-contained artefact.

**Gain: 200 to 550 ms off first paint on a cold connection. Combines with fix 3 rather than replacing it.**

### 5. Debounce the suppliers filter. An hour.

`#sup-search` re-renders 220 rows on every `input` event, costing 3 to 9 ms of JavaScript and 34 to 43 ms of layout per keystroke.

Debounce by roughly 120 ms, or defer the render to `requestAnimationFrame` and coalesce. The same handler already narrows to 5 ms once the result set shrinks, so only the first two characters need protection.

**Gain: removes a likely INP failure on mid-range hardware.**

### 6. Minify the CSS and JavaScript in the build. An hour.

`build/build.js` inlines the sources verbatim. A conservative comment-and-indent strip already saves 83 KB raw and 25 KB gzipped; a real minifier with mangling would save more. Keep an unminified build behind a flag so the source stays readable in view-source, which is part of the site's character.

**Gain: 25 to 45 KB gzipped, roughly 5 to 9 percent of transfer.**

### 7. Add `content-visibility: auto` to `.chapter`. An hour.

Measured 21.9 to 16.3 ms on a forced full layout, and worth more during ordinary scrolling because off-screen chapters skip paint. Pair it with `contain-intrinsic-size` so scrollbar geometry stays stable, and test the deep-link path, which regressed slightly in my measurement.

**Gain: 25 percent or better off the 21.8 ms layout on The Chain.**

### 8. Cut the point budget on phones. A day.

The collapsed strip is 232 x 232 device pixels and receives 60,000 to 98,000 points. Scale `PC.density` to the canvas area rather than to a viewport breakpoint: roughly one point per two device pixels would put the collapsed strip near 27,000 points, a two-thirds cut in both build time and GPU memory. Rebuild at higher density when the reader expands the strip.

**Gain: mobile build times down by roughly two thirds, GPU memory from 22.5 MB to under 10 MB.**

### 9. Fix the chapter deep-link cost. A day.

`#lithography` reaches `domInteractive` at 834 ms against 199 ms for `#/chain`, because Chrome performs fragment navigation into a 141,229 px document while parsing. Deep links also carry the site's worst CLS outlier, 0.4513.

Give chapters real per-chapter URLs, which HANDOFF.md already lists as Tier 2, and route them through the router rather than through native fragment navigation. Re-run the anchor scroll after `document.fonts.ready` so a font swap above the anchor does not move the reader's position.

**Gain: 635 ms off a chapter deep link, and removes the largest single layout shift on the site.**

### 10. Fetch the table data instead of inlining it. A week.

`CP_DATA` is 126 KB gzipped, and the tables it feeds belong to views most readers never open: suppliers 42 KB, licence thresholds 15.6, timeline 14, matrix 10.3, exposure 5.6. `dist/data/*.json` already ships those files and already carries correct headers.

Fetch on first route to each view. The obstacle is `Tools`, which builds a ranked search index over `DATA` at boot; it would need to search a smaller index until the data arrives, or fetch eagerly at idle. This trades the site's single-file property for roughly 87 KB, which is why it ranks last.

**Gain: about 87 KB gzipped, 18 percent of transfer, at real architectural cost.**

### Considered and rejected

**Lazy-rendering the hidden views.** Deferring every hidden view into `<script type="text/html">` cuts body parse from 41.7 to 5.0 ms and the DOM from 14,434 to 911 nodes, and saves zero bytes. Hidden views cost nothing per frame, since `display: none` keeps them out of the layout tree entirely. Thirty-seven milliseconds does not justify losing Ctrl+F across the chapters.

**Precomputed binary point clouds.** 23 MB of geometry against 210 KB of generators. The arithmetic settles it.

**Brotli.** Worth 162 KB and GitHub Pages will not serve it. Revisit only if the site moves hosts.

---

# 3. What is already good

**The scroll probe is well built.** `Sections.update()` costs 0.021 ms per call on The Chain when layout is clean, and it does not dirty layout itself, so 17 `getBoundingClientRect()` calls per scroll event read cached geometry. The listener is registered `{ passive: true }`. This is the piece most likely to have been wrong, and it is right.

**The renderer is essentially free.** Drawing 121,010 points takes under 0.1 ms. A two-cloud transition frame takes under 0.1 ms. Uploading 1.3 MB to a VBO takes 0.2 ms. WebGL context creation and shader compilation take 6.5 ms combined. The point-cloud design carries almost no per-frame cost.

**Memory is disciplined.** Geometry buffers are released after upload, so 23 MB of cloud data lives on the GPU and not in the heap. The heap settles at 21.4 MB after all 11 views and stays flat. Nothing leaks across route changes.

**The heavy tables already build lazily.** Suppliers, licence thresholds, China revenue share and the timeline render on first activation, not at boot. The AI Chips and Suppliers view shells ship as 40 nodes between them.

**The bibliography stays out of the page.** 645 URLs and 172 KB sit in `dist/data/bibliography.json` and cost a visitor nothing.

**Delegated event handlers throughout.** One glossary popover panel serves 225 terms. The exposure tooltip delegates over 143 circles. Both measure under 2 ms median.

**Scripts sit at the end of the body and parse fast.** 210 KB of specimen scripts evaluate in 3.5 ms because they only register builder functions. 473 KB of JSON parses in 4.7 ms as an object literal. `app.js` evaluates in 2 ms. Nothing blocks the parser except the font stylesheet in the head.

**The theme is applied before first paint** by a 237-byte inline script, so no flash of the wrong theme.

**`preconnect` is already in place** for both font origins.

**Everything except the stage is negligible at boot.** Theme, Glossary, Tip, Tools, Band, Router and Sections together cost under 3 ms.

**No horizontal overflow at 375 px**, and `PC.density` already drops to 0.55 on narrow viewports. The instinct is right; the threshold is tied to the viewport rather than to the canvas, which is fix 8.

**The build emits HTML without indentation.** Collapsing whitespace across 1.15 MB of markup would save 849 bytes, so there is nothing to gain there.
