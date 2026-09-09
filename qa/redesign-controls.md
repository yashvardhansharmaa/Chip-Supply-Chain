# Export Controls redesign

## What I built

**Timeline (`#/controls`).** A minimap strip (`#tl-strip`, SVG built in JS from the visible rows) sits above
the list: five lanes by category in the `.timeline .cat` colours, one dot per event on a month scale from
January 2018, year ticks, and dashed rules at 2022-10-07, 2023-10-17 and 2024-12-02. Hover, focus or tap a
dot for a date-and-title tooltip; click jumps to the entry, opens it and marks it in amber. Dots carry a
roving tabindex, so the strip is one tab stop with arrow-key navigation. On desktop the strip sticks at
`top: var(--masthead)` and the dot of the entry at the reading line is ringed, its year label brightening.
On phones it is static and compressed (107 px, short lane labels, 9 px hit radius).

Entries are now date, actor, category, title and `gist`, with the full summary and source behind a
per-entry More button and one "Show full summaries" toggle. Year groups gained "n moves".

**Thresholds (`#/thresholds`).** A card board grouped by `kind`, with a mono jump-nav above it. Each card:
a display-font headline from `paramShort` + operator glyph + formatted value + `unitShort`
(`TPP ≥ 4,800`, `Training compute > 10²⁶ operations`, `China share of shipments ≤ 50%`), the instrument in
mono, scope clamped to two lines, a status pill, `from <date>` and the chapter chip. Details reveals regime,
destinations, licence policy, alternative, unit, amendments, note and source. The table stays inside
`<details class="table-view">`; exports now anchor on `#th-board`.

Motion: dots stagger 0–420 ms, baselines draw at 430–690 ms, entries rise 8 px on entry, cards 6 px at 20 ms
stagger. All `backwards`-filled, so nothing is parked invisible; reduced motion turns everything off.

## What I cut

Three intro paragraphs (191, 179 and 313 characters) to one sentence each of 14, 15 and 19 words. The full
summaries and the seven-column table are still there, one click away.

## Heights at 1440

| | before | after |
|---|---|---|
| Timeline | 10,530 px | 6,300 px (14,071 with all summaries open) |
| Thresholds | ~9,900 px (table 9,288) | 4,660 px (board 4,006) |

`node build/build.js` is clean. At 375 px `scrollWidth` is 375 on all three sub-tabs. Filter → export count
works (43 → 7 → 43; 40 → 32). Shots in `qa/redesign/`.

## Left for others

- `Tools.buildIndex` sends "Export rule" search hits to `#/controls` and timeline events to `#geopolitics`;
  they should go to `#/thresholds` and `#/controls`. Not my file.
- The view-head dek repeats the three sub-tab names. Built in `build/build.js`.
- A few headlines double a word: "Transistor count ≥ 30 billion transistors", "Duration of the stay until
  12 months", "Server or rack contains 4,800 TPP chip".
