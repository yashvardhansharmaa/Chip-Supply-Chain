# Graphics desk review — Compute Chokepoints

Read-only, 1440 and 375, light and dark. Screenshots: `qa/crit/gfx-*.png`.

## Verdict

The data discipline beats most newsroom work: every share stack sums to 100 with a named residual, the exposure page states its scale and records how each firm defines "China revenue", the board carries an as-of date and exports itself. The charting has not kept up. Three chart types serve 44 figures, none has a value axis, and the site's two central quantities — how concentrated each stage is, and when each gate closed — are never drawn, though both sit in the repo as data. The largest graphic, the Suppliers ribbons, ranks stages by firm count, putting IP & Architecture above Lithography and contradicting the site's own argument. Fix the measure, draw the two missing charts, put a dateline and a download on every figure, and this becomes citable. Four of the five charts below need no new research.

## The visuals

| Visual | Page | Verdict | Fix |
|---|---|---|---|
| Route map | Home | Decorative; arcs encode sequence, read as trade flows | Drop arcs; key, source, date |
| Leverage list | Home | No encoding; metric switches from "leads" to "named" mid-list | Split in two; add a bar |
| Country panels | Home | **Strong.** Bars true to 100, each with year and estimate tag | Keep — the model |
| Chain strip | Chapters | The chokepoint score (3 tints, 38/66/100%), no legend, 26px | Promote to a chart (#2) |
| 3D specimens | Intro, Chain | Beautiful, unlabelled; captions name six parts the reader must find | Leader lines; still fallback |
| Bar figures (27) | Chapters | No value axis; track max = series max, so the top bar always fills | Add ticks; label the track |
| Stack figures (15) | Chapters | Honest sums; two colour collisions | Fix `colorOf` (#7) |
| Timelines (2) | Chapters | Lists; no time geometry | Fold into #1 |
| Chokepoint cards | Chapters | Clear; own numbers uncited | Cite them |
| Package drawings | AI Chips | **Best graphic here.** One true scale, 50 mm bar, legend | Add download |
| Comparison table | AI Chips | Excellent: footnoted TFLOPS, "how measured", CSV/JSON | Add dateline |
| Ribbons | Suppliers | Hairball; width = firm count; amber = Germany *and* Critical; stage labels clipped at 375 | Re-measure; split amber; fix mobile |
| Ladder | Suppliers | Dense, legible, but "thinnest first" ranks by count | Rank by top-firm share |
| Board + scrubber | Controls | **Strong**, but a list where a chart belongs; no severity ramp | #1; add ordinal ramp |
| Dumbbell | Exposure | Peak tick falls *outside* the line on most rows; reads as error bar | Span min–max, peak on it |
| Small multiples | Exposure | **Best analysis here.** Shared scale stated, rule dates marked | Add a source line |
| Glossary | Glossary | Clean; its numbers uncited | Cite them |

## Five charts to commission

1. **The nine flows as a state chart.** Nine rows, 2018–2026 on x, fill = state, a tick per move. Makes the board's best row one screenshot. *`control-flows.json`: 9 flows, 41 state changes, each citing an event id. Needs nothing.*
2. **Concentration along the chain.** Top-country share per stage in chain order — the site's thesis, drawn today only as a navigation strip. *`chokepoint-matrix.json`: 20 rows, 17 with shares, each with year, note, source. Show the 3 policy-nulled rows as labelled gaps. Needs nothing.*
3. **China revenue at risk, in dollars.** Absolute China revenue beside the share, so 49% at a small firm stops outranking 9% at Nvidia. *`exposure.json` carries `chinaRevenue`, `totalRevenue`, `basis`, `source` per firm-year. Needs nothing.*
4. **Real chips against the licence lines.** TPP of the 35 chips against the 1,600 / 4,800 / 21,000 thresholds. *`landscape.json` FP4/FP8/FP16 plus `control-thresholds.json`, both still in the repo. Built, then removed with the thresholds tab; HANDOFF puts it at commit 072c754. Restore, don't research.*
5. **Capacity by country and node over time.** The only one needing new sourcing: the site holds one year (`capacity-by-region`, 2025) and TSMC by node (2Q26). *Needs SEMI World Fab Forecast and the SIA factbook for back-years — both Tier A.*

The brief's "China's share against the rule dates" exists already as the small multiples; it needs a source line.

## Ten changes, ranked by effect

| # | Change | Effort |
|---|---|---|
| 1 | Draw #1 and #2 — the two claims the site makes but never charts | 2–3 days |
| 2 | Re-measure Suppliers by share, not firm count; rank the ladder the same way | 1 day |
| 3 | Rewrite 44 figure titles as claims ("What one system costs" → "High-NA costs six times a DUV tool") | 1 day, writing |
| 4 | ~14 of 44 figures draw a time or generation axis as unordered category bars (`euv-shipments` stacks 2023/24/25 vertically). Add a column type | Half day |
| 5 | PNG/SVG download, source and date burned into the image; no chart has either | 1–2 days |
| 6 | Dumbbell: span min–max, put the peak marker on the line | 2 hours |
| 7 | One country→colour map site-wide (Japan is amber in chapters, blue in ribbons); fix two `colorOf` collisions (`asml-region` gives the US and Rest of Asia one blue, `pc-share` repeats two); split Germany's amber from the Critical overlay | Half day |
| 8 | Figure labels render ~9px at 1440 and ~6px at 375 (11.5px type in a 600-unit viewBox scaled to ~470/~307px), under the site's own 9.5px floor; light-mode bars sit at 2.37:1 on the panel, under 3:1 — and light is what prints | Half day |
| 9 | `og:image`, `twitter:card`, canonical URL; the site pastes into Slack as a bare link | Half day |
| 10 | Specimen still fallback: WebGL off collapses the canvas to 0×0 and empties the right half of Start here and The Chain — common on locked-down government machines | Half day |

An hour more buys one numeric style: `$B`, `US$bn` and `$` all appear, two figures ship no unit, two units are whole sentences set in a mono chip.

## What would make it quotable

A newsroom or a committee quotes a chart when the image alone answers three questions: what is claimed, on what evidence, as of when. A Chokepoints figure pasted into a memo today carries a descriptive title, a source line that survives only a generous crop, and no date — and the two charts a briefer actually wants, concentration by stage and the closing of the nine gates, do not exist to be cropped. The repair is not a redesign. It is a claim in every title, a source and a dateline burned into every chart image, a download button, and the two charts the data already supports. The reporting has earned an audience that would cite it; the graphics have not yet given them anything to paste.
