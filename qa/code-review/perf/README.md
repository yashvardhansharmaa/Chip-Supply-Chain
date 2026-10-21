# Phone performance harness

The scripts behind `qa/code-review/performance.md`. They drive headless Chrome over the DevTools protocol against the local server only (`http://127.0.0.1:8765/`, serving `dist/`). Inside Chrome every other host is unresolvable (`--host-resolver-rules` in `cdp.py`). The Google Fonts stylesheet and the GoatCounter script are answered or failed locally, so no request leaves the machine and none carries personal data.

Needs: Google Chrome at `/Applications/Google Chrome.app`, Python 3 with `websocket-client`, and the local server running (`python3 -m http.server 8765 --directory dist`). Outputs go to `out/`, which git ignores.

## Rerun the phone measurement

```
node build/build.js                        # the build to measure
qa/code-review/perf/run_phone.sh before    # or: after
```

This runs four pages (`#/`, `#/chain`, `#/suppliers`, `/lithography/`) with five cold loads each, one page after another, then prints the median and the [min–max] of each metric (`agg.py`). Run it once before a fix and once after, on an otherwise quiet machine, and compare the two `out/<label>/summary.txt` files. One page by hand:

```
python3 qa/code-review/perf/measure.py 9980 "http://127.0.0.1:8765/#/chain" out.json --runs 5 --wait 10
python3 qa/code-review/perf/agg.py out.json
```

## The profile

| | |
|---|---|
| Device | 412 × 823 CSS px at 1.75×, mobile, touch, Android UA (Lighthouse's mid-range phone) |
| CPU | `Emulation.setCPUThrottlingRate` 4 |
| Network | Slow 4G: 150 ms RTT, 1.6 Mbps down, 750 kbps up, cache disabled, through `Network.emulateNetworkConditionsByRule` |
| Compression | The local server sends no gzip and GitHub Pages does, so each HTML document gets 1.6 Mbps × its raw-to-gzip ratio: its bytes arrive when the gzipped file would. Everything else gets 1.6 Mbps. |
| Fonts | The font stylesheet is held 600 ms (about four round trips on a new origin) and answered empty; no font file loads |
| Runs | A warm-up navigation, then five cold loads; median and range reported |
| Recorded | FCP, LCP and its element, total blocking time (long tasks after FCP, minus 50 ms each), longest task, CLS (session windows), the first WebGL draw, every specimen build, requests and bytes |

Read the numbers with the caveats in the report: localhost skips about 0.45 s of DNS, TCP and TLS. An M3 at ×4 is faster than a real mid-range phone. SwiftShader sometimes presents frames late with the main thread idle, so compare medians and look at the ranges.

## Other scripts

| Script | What it does |
|---|---|
| `measure.py … --trace t.trace --runs 1` then `phases.py t.trace t.json` | Main-thread self time by activity (parse, style, layout, script, paint) and by phase (download, boot, after load). `tracesum.py t.trace` lists the top trace events. |
| `measure.py … --profile p.json --runs 1` then `profsum.py p.json` | JavaScript self and total time per function |
| `probe.py <port> <url>` | In a loaded page at ×4: the fonts the first screen uses, the cost of a `:has()` state flip, `Sections.update()`, the first search, and route changes into each view |
| `probe2.py <port>` | DOM-build cost of each part of `dist/index.html`, `CP_DATA` parse, and the layout cost of revealing The Chain as shipped, with `content-visibility`, and with two chapters |
| `breakdown.py dist/index.html` | Raw, gzip and brotli size of each part of the page (brotli needs the `brotli` module) |
| `variants.py [outdir]` | What-if copies of the page (no `:has()`, only the routed view, slim cite marks) for `measure.py --variant` or `probe.py --variant`. These runs are CPU-only and noisy; the report relies on `probe.py` and `probe2.py` instead. |

Each script uses its own DevTools port (9980 upward); give different ports to scripts that run at the same time.
