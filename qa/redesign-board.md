# Export Controls: the board

Changed: `src/template.html` (controls section), `Geo` and `Controls` in `src/app.js`, `src/modules/controls.css`. Screenshots: `qa/redesign/board-*.png`.

## What is on the page

Two modes behind a switch, remembered in `localStorage` as `cp-cf-mode`.

**By subject** (default) is `#cf-board`: nine rows, one per flow, in `order`. Each header is a button carrying the name, the route in mono, the what-line, the state on the scrubber's date (pill, label, the date it was set) and a moves count. Clicking opens that flow's history in place, built on first open: its moves in date order, a pill beside each one that changed the state, a gist, and More for the summary and source.

Above it, `#cf-scrub` runs 2018 to 2026 as equal segments with that year's move count under each, an amber playhead and a Now button. Arrow keys move the playhead from a focused year. Pills cross-fade; rows that moved inside the chosen year glow for 600 ms.

**By date** keeps the chronology, the filter chips and Show full summaries. On desktop the compact board sits sticky in the right column at 38 percent, and the entry at the reading line sets the date, so it flips with the scroll. Phones drop it for a state line under each year label. The dot strip is gone; exports still follow the filter.

The ruler `#th-ruler` renders only with `ruler=1` in the query string: 30 chips, log scale, five label lanes, no collisions.

## How the as-of date works

One value, `Geo.asOf`. A flow's state on it is the last state dated on or before it, else `initial` (open). Now is the last event date, 7 September 2026. The scrubber sets the date from a year's end, the scroll spy from the entry at the reading line. Nothing else holds state.

## Heights at 1440

By subject 1,320 px (the old timeline was 6,293). By date 6,180. Thresholds 4,587, or 4,860 with the ruler.

## One deviation

Chrome will not interpolate `grid-template-rows` between two unresolved `fr` values. The drawer still rests on `0fr` and `1fr`, so its content sizes it, but `app.js` plays the run between the rests on the height: same motion, 230 ms, none under reduced motion. Nothing else is unfinished.

## Wording still needed

- `control-flows.json` has no `short` field, so the phone's year line spells out full names and runs to three lines.
- The h3 above the switch still reads "Every move since 2018", which describes By date, not the board.
- The third ruler label is 79 characters, the widest thing on the page.
