# Speed fixes: notes (21 to 23 October 2026)

PLAN.md items 1 and 2 (performance P1-1, P1-3, P2-4, P2-6 and the static-page half of P2-8). Proof is in `qa/code-review/fixes/speed/`.

## The phone measurement

`qa/code-review/perf/run_phone.sh`: the harness's mid-range phone (412 px at 1.75×, CPU ×4, Slow 4G with each page at its gzip rate), five cold loads per page, median [min–max]. Before: the build of 21 Oct 11:29, which had none of the fixes, run that day at a load average of about 3. After: the build of 23 Oct 01:16 (every builder's work), run at a load average of about 3. Chrome updated itself from 155 to 156 in between. The other builders' work added 56 KB to the page, so it now finishes arriving at 4.68 s, against 4.60 s before. Files: `speed/perf-before/`, `speed/perf-after/`.

| | Home `#/` | The Chain `#/chain` | Suppliers `#/suppliers` | `/lithography/` |
|---|---|---|---|---|
| **Largest contentful paint** | 5.01 s [5.00–5.12] → **0.96 s** [0.94–1.94] | 5.42 s [5.37–5.54] → **0.89 s** [0.89–1.30] | 5.02 s [4.92–5.04] → **0.93 s** [0.92–2.24] | 0.93 s → 0.91 s |
| LCP element | the walk's "chain at a glance" paragraph (same) | the how-to lede (same) | the atlas panel lede (same) | the chapter lede (same) |
| **Total blocking time** | 243 ms [224–318] → **111** [92–163] | 797 ms [758–833] → **96** [93–135] | 254 ms [213–271] → **131** [126–136] | 0 → 0 |
| Longest task | 226 → 161 ms | 530 → 146 ms | 219 → 181 ms | none → none |
| **Layout shift** | 0 → 0 | 0 → 0 | 0.0176 → **0** | 0 → 0 |
| **First specimen drawn** | 4.89 s → 4.92 s | 5.18 s → **4.90 s** | never → never | none |
| Specimens built after load | 17 in 564 ms → **3 in 95 ms** | 17 in 572 ms → **3 in 96 ms** | 17 in 580 ms → **0** | 0 |
| JS heap | 16 MB → 12 | 46 → 11 | 12 → 4 | 1.3 → 1.3 |
| Bytes fetched (first run) | 4,051 → 4,105 KB | 4,540 → **4,105 KB** (no cover art) | 4,051 → 4,105 KB | 390 → **264 KB** (no print still), `load` 1.68 → 1.02 s |

What the numbers mean:
- The view a reader asked for now paints when its own markup and the font stylesheet have arrived, about 0.9 s here. A real first visit adds about 0.45 s of connection setup.
- The first specimen still waits for `boot()`, which waits for the end of the file (4.68 s). The Chain's draws 0.28 s sooner because its boot task is cheap now. Moving the scripts and data out of the first download is PLAN item 15.
- Each page's one remaining long task (146 to 181 ms) is `boot()` itself, down from 530 ms on The Chain.

## What changed

| ID | Fix | Where |
|---|---|---|
| P1-1 | The route is read in `<head>`, before any of the body has arrived, by the router's own rules. `<html data-route>` (and `data-sub`, `data-pick`) then lets CSS show only that view while the file streams in. The views lose their `hidden` attribute, and from boot the router's `hidden` attributes take over (`html.booted`). | new `src/preroute.js`, inlined as `{{PREROUTE}}`, `src/template.html` head style |
| P1-1 | The views are in the order a first visit needs them: Home first, then AI Chips, Suppliers and Export Controls (small), The Chain, the Glossary. | `src/template.html` |
| P1-1 | The phone strip starts hidden on a view without a specimen, so Suppliers no longer shrinks it at boot (CLS 0.0176 → 0). The China revenue tab and the Suppliers ribbons tab show before boot when the address names them. | inline scripts after the stage and the controls tabs, head style |
| P1-1 | Views whose bodies boot() builds (the Export Controls board, the Glossary, AI Chips, and the Suppliers atlas when the address picks a country) show only their heads before boot, so nothing painted early moves. | head style |
| P1-1 | A deep link into The Chain or the walk lands before boot. Every chapter above the anchor is laid out first (`.cv-open`), so no chapter above the reader ever changes height under them. | `src/preroute.js` `look` |
| P1-1 | A reader who scrolls or taps before boot keeps their place: the first route neither returns them to the top nor jumps to the anchor. | `Router.route` (`kept`), `src/modules/walk.js` `activate` |
| P1-1 | The build checks every id on the page against the pre-route rules and warns when an address would show the wrong view while loading. It warns on nothing today. | `build/build.js`, after the placeholders are filled |
| P1-3 | `content-visibility: auto` on chapters, on screen only, with an estimate per width (the median real chapter: 9,400 px wide, 11,500 at 1,100 px or less, 13,500 on a phone, 16,000 at 360 px or less). | `src/styles.css` |
| P1-3 | `Sizes` lays out each chapter below the window once while the browser is idle, so heights and anchors settle on real values (Safari, which has no idle callback, gets a timer). A glide first lays out the chapters it passes. A chapter on screen is never toggled (it would blink for a frame). `.ch-ledger` is kept out of scroll anchoring, because Chrome anchored to the sticky ledger and let the text move. | new `Sizes` in `src/app.js`, `scrollToEl`, `Router.route` |
| P1-3 | `setMast` writes `--masthead` only when the masthead is taller than the stylesheet's value, and on resize only when the width changed. The old unconditional remove and re-add on `load` cost a full relayout of The Chain. | `boot()` |
| P1-3 | `narrow()` reads a media query, not `window.innerWidth`, which forced the first layout in boot. | top of `src/app.js` |
| P2-4 | Specimens are built only while the stage shows. A wide screen queues every chapter's specimen at idle. A phone builds only the next two ahead of the reader. Suppliers, Export Controls and the Glossary build none (17 → 0). | `Stage.soon`, `Stage.idle`, `setVisible`, `Sections.update`, `boot()` |
| P2-4 | Clouds are sized to their canvas. The phone strip's 116 px thumbnail takes 0.4 of a full stage's density, and Expand rebuilds the specimen for the bigger canvas (59,425 → 91,714 points for die-floorplan). Many parts have fixed point counts, so a thumbnail has 20 to 58% fewer points (euv-scanner 88,035 → 70,513, wafer 63,366 → 26,415), not 60%. The thumbnails look the same (`speed/specimen/strip-density-light.png`: today's density, then 0.5, 0.4 and 0.3). | `Stage.level`, `density`, `build`, `resize` |
| P2-6 | The idle fetch of `print-title.png` (501 KB) after The Chain loads is gone. The art still loads on print intent, `beforeprint`, and `CP_PRINT.prepare` for `build/pdf.py`. | `Router.route`, the comment in `src/template.html` |
| P2-8 (static pages) | The print-only still (`.anim-still`, 130 KB) is `loading="lazy"`. A `beforeprint` handler makes it eager for browsers that do not fetch lazy images for print. | `build/modules/social.js` `staticAnimations`, the page's video script |
| (extra) | The phone strip's Top button keeps its place while hidden (`visibility`), so Contents and Expand never move when it appears. | `src/styles.css` `.stage-top` |

## Proof

Everything is in `qa/code-review/fixes/speed/`. The scripts drive headless Chrome over the DevTools protocol (`qa/code-review/perf/cdp.py`), against the local server only, on ports 10300 to 10319.

- **What paints before boot** (`preboot.py`, `preboot-phone.json`, `preboot-desktop.json`). This loads 18 addresses cold over Slow 4G, polls every 100 ms, and records which views are displayed, plus layout shifts with their sources. The addresses: home, The Chain, four chapter and section anchors, `#main`, Suppliers (plain, `?country=JP`, `?tab=country`), Export Controls (the board, `#/exposure/asml`, an event), the Glossary and `#gl-euv`, AI Chips, and a walk step. Before boot, only the routed view ever displays. LCP is 0.85 to 2.9 s on every address except an event entry, which boot builds (5.4 s, as before). Layout shift on the phone is 0 on all 18 addresses. On desktop it is 0.0011 to 0.0063, and all of it comes from the two older shifts below. `trace_load.py` gives a frame-by-frame trace of one load, it found the causes fixed on the way: the fragment not scrolled while streaming, chapters above an anchor taking their real heights, and Chrome anchoring to the sticky ledger.
- **Tour** (`tour.py`, `tour/tour.json`, 91 screenshots). This makes 88 cold loads: 15 addresses at 1440, 1024, 390 and 320, plus 7 of them in dark. All 88 pass. Each loads the right view only, with no console errors and no horizontal scroll (320 included). Every anchor lands within 0 px of `CP.landAt`. The stage shows its specimen on Home, The Chain and AI Chips, and stays hidden elsewhere. At each width, a Contents link and a previous-chapter link glide and land exactly (87/87 px on a phone, 68/68 on desktop). On phones, Expand rebuilds the specimen at full size (59,425 → 91,714 points) and Collapse restores the thumbnail, the Top button keeps its place, and the Contents sheet opens, closes and lands. The cover art is never fetched.
- **content-visibility changes nothing on screen** (`cv_diff.py`, `cv-diff/cv-diff-*.json`). It covers every window of all 17 chapters, compared with containment on and off: 205 screens at 1440, 254 at 1024, 408 at 390 and 484 at 320. None differ. So paint containment clips nothing, the ledger's tick included.
- **Real chapter heights** against the estimates, with the coordinator's note on the 390 px spread (12,196 to 18,022 px): one estimate per width is enough. A chapter's real height replaces it once the chapter has been laid out (`contain-intrinsic-height: auto`). Before a deep link lands, every chapter above it is laid out. The idle pass lays out every chapter below the window within a few seconds of load. The estimate only shapes the scrollbar for chapters below the reader, in those first seconds. The tour's anchors all land within 0 px.
- **Specimen thumbnails** (`specimen/strip_density.py`, `strip-density-light.png`): eight specimens at today's density and at 0.5, 0.4 and 0.3 of it.
- **Static pages** (`static-page/`). On screen, `/lithography/` and `/memory-and-hbm/` fetch only the poster. Printed, they fetch the still, and it is in the PDF (`lithography-print-still.png`, page 5 of 14). All 15 pages with an animation have the lazy still.
- **Print is unchanged** (`print-before/`, `print-after/`). `python3 build/chapter_pdfs.py lithography --edition 2026-10-21 --logs <dir> --port 10301`: 11 pages before and after, with identical layout reports (76 notes, no short, stranded, overlap or lost pages, card-lithography floats by one, gap 0.29). The book's first pages (`build/pdf.py … --only 4 --port 10302`): 44 pages before and after, with identical reports (250 notes, gap 2.6), and the cover art is on page 1. Rendered at 50 dpi, every page of both PDFs is pixel-identical. `dist/pdf/lithography.pdf` was put back as it was before the run.
- **Checks**: `check-speak` no matches, `check-integrity` no problems, `check-sources` all tier A or B, `qa/scripts/smoke.js --port 10314` 33 page loads, no failures. `node build/build.js` reports no warnings, including the new pre-route check.

## Not done, and why

- Two small shifts at boot on desktop predate this work: the search button that `Tools.init` inserts into the masthead tabs (0.0011), and the stage tag moving up when the first caption fills (up to 0.005). Both sit outside the views and were painted before boot in the old build too. Fixing the first means shipping the button in the template and changing `Tools.init`, which the accessibility builder owns.
- Interactivity still waits for the end of the file and `boot()` (about 4.6 s on Slow 4G). Moving `CP_DATA`, the Glossary and the print code out of the first download is PLAN item 15 (Tier 3).
- An address the build cannot map (no such id) shows The Chain before boot, as the router then does. Content above an anchor in the same chapter can still move as web fonts swap in. `Router.settle` puts the anchor back, as before.
