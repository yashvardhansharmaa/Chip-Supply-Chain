# Summary B — chain-first

Prototype at `#/summary-b`. Files: `build/modules/summary-b.js` (markup, at build time), `src/modules/summary-b.js` (selection behaviour), `src/modules/summary-b.css`.

The concept: the summary is the walk down the chain, not a wall of cards. A reader with eight minutes gets the shape of the whole chain, opens one or two stages, sees what binds it, who holds it and what changed, and leaves with a link into the eighteen chapters. The chain stays the deep tab; this page is the way in.

## What the page does

**Lead, then the flow.** One sentence gives the count that matters — fifteen stages, seven at five out of five — and the site's own definition of a five: one supplier failing would stop leading-edge production worldwide. Under it, the fifteen stages run left to right from quartz sand to a finished rack, each a node with its chapter number, a bar whose height is its chokepoint score, and a short name. The bar tokens are the site's: amber `--bar-5` at five, `--bar-4` at four, `--bar-3` below.

**The flow is an ARIA tablist and the panels are pre-rendered.** All fifteen panels are written at build time and only shown or hidden in the browser, so the page still reads with JavaScript off (lithography, the default, is the one not marked `hidden`). Selection works by click, tap, arrow keys, Home and End, with roving tabindex; the selected node scrolls itself back into view in the strip on phones, and honours `prefers-reduced-motion`. A pick is written into the URL as `#/summary-b/<stage-id>` with `replaceState`, so one stage can be linked without adding history entries. The default selection is never written to the URL, only an explicit pick.

**The panel** carries the chapter's `plain` paragraph, its leaders as country chips, a three-cell block of chokepoint score, concentration and years to replace, the substitution note, where China stands, one small bar chart, and a link into the chapter.

**What binds** is the seven stages scoring five, computed from the scores rather than listed, each with its `oneLiner`.

**Who holds it** is the country matrix, one row per segment, shaded in the site's single amber hue, with the three rows that have no published split saying so instead of showing a blank. Each row opens its chapter.

**What changed** is eight rules from the export-control record, and **the way on** is the whole chain plus AI Chips, Export Controls and Sources.

## Where the numbers come from

Everything on the page is computed at build time from `ctx.data` or the chapter front matter. Nothing is typed in.

| On the page | Source |
|---|---|
| Stage order, numbers, titles | `ctx.stages` (chapters 02–16) |
| Bar height, score, concentration, years to replace, why | `meta.card.chokepointScore`, `.concentration`, `.substitution` |
| Panel paragraph | `meta.plain` |
| Leaders and their countries | `meta.card.leaders[]` |
| Where China stands | `meta.card.chinaStatus` |
| Panel chart | the chapter's first `meta.figures[]` entry of type `bars`, with its own `source` |
| What binds | stages where `chokepointScore` is 5, with `meta.oneLiner` |
| Who holds it | `ctx.data.matrix` |
| What changed | `ctx.data.timeline` |
| Chapter and source counts in the closing block | `ctx.all` and its citation lists |

Three judgements are worth flagging, because they are mine and not the data's:

1. **Which eight events.** The timeline has no significance or type field, so the selection is stated on the page rather than asserted: the rules written by the three governments that write them (`US (BIS)`, `Japan (METI)`, the Dutch ministries), from October 2022, sampled at eight even points in time. That yields October 7 2022, Japan's July 2023 controls, the October 2023 update, the Dutch September 2024 extension, the December 2024 package, the rescinding of the AI Diffusion Rule, H200 case-by-case, and UAE to A:5 — all three jurisdictions, the whole arc, not just the newest rules. It re-derives itself as the dataset grows.
2. **Segment to chapter.** The matrix rows carry no chapter key, so the routing table lives at the top of `build/modules/summary-b.js` and is checked against the built chapters; an unmapped segment or a missing chapter raises a build warning. It belongs in `chokepoint-matrix.json` as a `chapter` field, and should move there.
3. **Silicon and wafers has no `bars` figure**, so its panel shows no chart and the build says so. Every other stage has one.

## Colour

Amber does one job on this page: severity. It is the score-5 bar in the flow, the rule above a "what binds" card, the score in the panel when it is a five, and the single hue of the matrix shading, which is the site's established treatment on Geopolitics. So the panel charts use the neutral `--bar-4` for magnitude rather than the amber the chapter figures use — two amber meanings in one screen would be one too many. Text in the charts is `--ink-2` and `--ink`; there is one series, so there is no legend.

Two small corrections to the matrix as the site draws it today, made here first: cells at 70 percent or more take the page ground as their ink in dark mode, where a heavy amber wash is too light for `--ink`; and a share the source lists below half a point reads `<1%` rather than rounding to `0%`, which reads as absent. Both are worth taking back to the Geopolitics matrix.

## Verified

Built with `node build/build.js` (one warning, the expected missing silicon chart) and checked at `http://localhost:8765/#/summary-b`.

- 375 px: no horizontal overflow (`documentElement.scrollWidth` equals `clientWidth`); the flow scrolls inside its own strip and the matrix inside its own wrapper; nothing else crosses the edge. Nodes are 56 x 75 px.
- 640, 768, 1280 px: the flow becomes a fifteen-column grid from 760 px with no clipped labels; the panel splits into two columns at 900 px; the cards go one, two, three columns; the matrix stops scrolling at desktop width.
- Selection: click and arrow keys change the panel, the roving tabindex follows, Home and End work, arrows wrap, and the hash updates. A cold load of `#/summary-b/memory-and-hbm` opens that stage.
- Console clean on load and after interaction, on this page and on Briefing and Geopolitics, which the module does not touch.
- Light and dark both resolve through tokens; nothing is hard-coded.

Screenshots were not possible — the browser pane refuses them while hidden, as the handoff notes — so all of the above is DOM measurement.

## With more time

- **Show the specimen.** The page registers with `stage: false`. Wiring the selected stage to `Stage.show(meta.specimen)` would put the object next to the words and make this the strongest page on the site. It needs a layout pass first: the summary view is a centred 1180 px column and the stage is not.
- **Prev and next inside the panel**, so the page can be walked end to end without going back up to the strip. Reading the chain in fifteen taps is the promise of the concept and it is one control away.
- **A leader's share on the chip.** `leaders[].share` is a full sentence per firm and it is the most quotable line in the front matter. It needs a disclosure rather than a tooltip, since tooltips do not exist on touch.
- **Two charts per panel where the chapter has them**, or a small chooser. Right now the first `bars` figure wins and the `stack` figures never appear; several stages have a better second chart.
- **Let the matrix sort.** Clicking a country column to rank the segments by that country's share would answer "what does China actually hold" in one gesture.
- **Cheapest fix of all:** move the segment-to-chapter mapping into the dataset, and add a `significance` field to the timeline so "what changed" is an editorial judgement recorded once rather than a sampling rule.
