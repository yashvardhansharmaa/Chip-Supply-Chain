# Export Controls redesign

## What I built

**Timeline (`#/controls`).** A minimap strip (`#tl-strip`, SVG built in JS from the visible rows): five lanes
by category in the `.timeline .cat` colours, one dot per event on a month scale from January 2018, year
ticks, dashed rules at the three US rule dates. Hover, focus or tap a dot for a date-and-title tooltip;
click jumps to the entry, opens it and marks it in amber. Dots share a roving tabindex, so the strip is one
tab stop with arrow keys. On desktop it sticks at `top: var(--masthead)` and rings the dot at the
reading line, brightening its year label. On phones it is static and 107 px tall.

Entries are date, actor, category, title and `gist`; the summary and source sit behind a per-entry More
button and a "Show full summaries" toggle. Year groups gained "n moves".

**Thresholds (`#/thresholds`).** A card board grouped by `kind`, with a mono jump-nav above it. Each card:
a display headline from `paramShort` + operator glyph + value + `unitShort` (`TPP ≥ 4,800`,
`Training compute > 10²⁶ operations`, `China share of shipments ≤ 50%`), the instrument in mono, scope
clamped to two lines, a status pill, `from <date>`, the chapter chip. Details reveals regime, destinations,
licence policy, alternative, unit, amendments, note and source. The table stays behind
`<details class="table-view">`; exports anchor on `#th-board`.

Motion: dots stagger 0–420 ms, baselines draw at 430–690 ms, entries rise 8 px, cards 6 px at 20 ms
stagger; all `backwards`-filled, so nothing is parked invisible. Reduced motion turns it off.

## What I cut

Three intro paragraphs (191, 179 and 313 characters) to one sentence each: 14, 15 and 19 words.

## Heights at 1440

| | before | after |
|---|---|---|
| Timeline | 10,530 px | 6,300 px (14,071 with every summary open) |
| Thresholds | ~9,900 px (table 9,288) | 4,660 px (board 4,006) |

`node build/build.js` is clean. At 375 px `scrollWidth` is 375 on all three sub-tabs. The export count
follows the filter (43 → 7 → 43; 40 → 32). Shots in `qa/redesign/`.

## Left for others

- `Tools.buildIndex` sends "Export rule" hits to `#/controls` and timeline events to `#geopolitics`; they
  belong on `#/thresholds` and `#/controls`.
- The view-head dek repeats the sub-tab names (`build/build.js`).
- Three headlines double a word: "Transistor count ≥ 30 billion transistors", "Duration of the stay until
  12 months", "Server or rack contains 4,800 TPP chip".
