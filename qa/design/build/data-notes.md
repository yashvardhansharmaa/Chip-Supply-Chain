# Data pages build notes (data builder, 21 October 2026)

Every item in `qa/design/design-data-review.md` is built. Shots are in `qa/design/build/data/`, named `<ID>-<what>-before|after-<width>[-dark].png`. The before set (72) was shot from `dist/` before any edit; the after set (79) from the rebuilt `dist/`. Port 9943 throughout. Checks: `check-speak` no matches, `check-integrity` only the known Veeco warning, `check-sources` all tier A or B, and `document.documentElement.scrollWidth` is 320 at 320 on Suppliers (both tabs, the EU view, an open drawer), Export Controls (board), China revenue share, AI Chips, the Index list, a country card and a firm card.

## Done

| ID | What | Files and functions | Shots (before → after) |
|---|---|---|---|
| P1.1 | Each pairing is two ribbons: its Critical firms (garnet, as wide as their count) on top of the rest (ink at 0.13). A country takes its color only when lit, hovered or filtered. Hover lights both halves. Legend "Critical firms" as a thread; aria-label now "garnet for the Critical firms" | `src/app.js` `Suppliers.drawPipe` (ribbon loop, mouseover), `legend`; `src/modules/suppliers.css` ribbon block | `P1.1-ribbons-unlit-*-1440`, `-1024`, `-1440-dark`; `P1.1-ribbons-lit-TW-*-1440` (+dark); `P1.1-ribbons-hover-*`; `P1.1-ribbons-filter-JP-*` |
| P1.2 | US category in ink: labels, history labels, chip dots; the pressed chip's dot turns paper | `src/styles.css` `.timeline .cat`; `controls.css` `.cf-hist .cat`, `.tl-chip::before` | `P1.2-categories-*-1440` (+dark), `P1.2-history-*-1440-dark` |
| P1.3 | Numeral is the stage's number of firms; meta line is one garnet square per Critical firm (the count is said to screen readers); heading "Stages by number of firms, fewest first" and the key; names say ", Critical" or ", Diversified" to screen readers | `app.js` `buildLadder`, new `rungCount`, `applyFilter`, `sync` (key hides with the ladder); `src/template.html` heading and `#sup-key`; `suppliers.css` | `P1.3-ladder-*-1440` (+dark), `-1024`, `-390`, `-320` |
| P1.4 | Context bars mid gray, no gridlines, solid rule hairlines, hover darkens, peak label 600 | `build/build.js` `exposureViz` (gridline loop removed); `styles.css` `.ex-panel`, `.ex-legend` | `P1.4-exposure-*-1440` (+dark), `-390`, `P1.4-exposure-hover-*` (focused bar) |
| P1.5 | Ribbons drawn to the column width; under 600 px codes on the left in the mono, taller field | `app.js` `drawPipe` (W, H, x0, x1, font sizes, `coLab`), `fitPipe` floor 280; `suppliers.css` | `P1.5-ribbons-*-390` (+dark), `-320`, `P1.5-ribbons-lit-TW-*-390` |
| P1.6 | China revenue table shaded in ink; each firm's highest year garnet with a rule | `styles.css` `#exposure-table`; `app.js` `Controls.build` (`is-peak`) | `P1.6-extable-*-1440` (+dark) |
| P1.7 | Quiet export lines "Copy the board · Table · JSON": board under its key, timeline on the filter row, AI Chips under the table, China revenue under its table. "Show full summaries" set as a quiet text switch | `app.js` `addExport` (quiet variant, `place`) and its four calls; `styles.css` `.export-bar.xq`; `controls.css` `.tl-all` | `P1.7-exports-*-390`, `-subject-*-390`, `-*-1440`, `-legend-*-1440`; `P1.7-chips-export-*-1440`, `-390`; `P1.7-extable-export-*-390` |
| P2.1 | Board as a chart: five-step scale per row, dot slides on date change (none under reduced motion), scale ends named once, closed rows one line, year bars on the scrubber | `app.js` `Geo.renderBoard`, new `RAMP`/`rampAt`/`rampClass`, `paintBoard` (updates `--i` in place), `renderScrub`; `template.html` `.cf-scale`; `controls.css` | `P2.1-board-*-1440`, `-tall-*`, `-2022-*`, `-1440-dark`, `-1024`, `-390`, `-320`, `-date-*`; extra after: `P2.1-board-slide-midframe-after-1440` (dot caught mid-slide), `P2.1-board-2022-reduced-motion-after-1440` (transition 0 s) |
| P2.2 | China panels packed: groups span their panel count, dense flow. Grid at 1440 is 1,315 px tall (was about 2,700) | `build.js` `exposureViz` (`.ex-group`, `--n`); `styles.css` | `P2.2-exposure-full-*-1440`, `-1024`, `-390`, `P2.2-exposure-*-320`; extra after: `-full-after-1440-dark`, `P2.2-exposure-fallback-no-subgrid-after-1440` |
| P2.3 | Picker as a three-column checklist; family name in the title. 669 px tall at 1440 | `chips.css`; `app.js` `Landscape.buildUI` | `P2.3-picker-*-1440` (+dark), `-1024`, `-390`, `-320`, `-picked-*` |
| P2.4 | Index labels on one line, sentence case, short stage names | `build.js` Glossary list (`LK_SHORT`, `lkStage`); `lookup.css` | `P2.4-index-list-*-1440` (+dark), `-1024`, `-390` |
| P2.5 | Country card shares as bars beside the value | `lookup.css` | `P2.5-country-JP-*-1440` (+dark), `-390`, `-320` |
| P2.6 | EU-27 in the Netherlands' orange (`--c2`) | `suppliers.css` | `P2.6-eu-*-1440` (+dark); extra after `-390` |
| P3.1 | Countdowns garnet only within 30 days; link "Entry →" in quiet sentence case | `app.js` `renderUpcoming` | `P3.1-upcoming-*-1440` (+dark), `-390` |
| P3.2 | Search box fits its prompt (700 px and up); hairline chevron selects; focus ring | `suppliers.css`; `styles.css` `.filters` | `P3.2-filters-*-1440` (+dark), `-390` |
| P3.3 | Drawer facts read Revenue, then From China; the firm's mini chart sits under the From China line; badge spaced from the name | `app.js` new `Suppliers.exMini`, `detail`; `suppliers.css` | `P3.3-drawer-*-1440` (+dark), `-TEL-*-1024`, `-390`, `-320` |
| Noted | `.sup-hit:focus-visible` garnet stroke | `suppliers.css` | DOM test below; `focus-sup-hit-after-1440` (+dark) |

**Focus test.** The test presses Tab and ArrowDown with real CDP key events. After Tab, the focused element is `rect.sup-hit` (Design & EDA), `:focus-visible` is true, and the stroke is `rgb(122, 31, 43)` at 1.5px in light and `rgb(226, 92, 87)` in dark. ArrowDown moves focus to IP & Architecture with the same ring. Headless Chrome did paint the ring (see the shot).

## Changed from the report, and why
- **The scale's note had a semicolon.** It now reads "The state on the date above. The full key is under the board." (house rule).
- **`--ex-bar` is set on `.ex-legend, .ex-panel`, not `:root`.** Frame owns `:root`. The value is the same.
- **Hover on the peak bar** goes to `--accent-ink`, not ink, so the hovered peak still reads as the peak.
- **Packed panels have a fallback.** They sit inside `@supports (grid-template-columns: subgrid)`. Without subgrid, `.ex-group` is `display: contents`, which gives today's layout, one category a row. The fallback shot forces that state; the grid is 2,793 px tall, as before.
- **Policy row.** It gets the bare track only while its state is Policy. Before its first move it is No license, and its dot sits there to match the pill.
- **Index labels.** The term labels are now "Term" and "Export control". Stage names that have no short name get sentence case except for acronyms ("Optics & photonics", "Substrates & PCBs"). "Design & EDA" stays.
- **P3.3 on the Index too.** The Index firm card gets the same mini chart, since its "Where" line names it (`src/modules/lookup.js`).
- **AI Chips export.** It never showed before: its live array is empty at boot, so `addExport` returned early. The quiet line is now built empty, and the page's empty state hides it.
- **Extra keyboard fix.** Chrome made the ribbon SVG itself a tab stop before the stages, because its content overflows it. `tabindex="-1"` on the SVG removes that stop.
- **Coming up link.** Its accessible name is "Entry in the timeline", and it has a 24 px hit height.

## Follow-up from the coordinator
- **Glossary "Try" chip names.** Fragments such as "(HiSilicon) Ascend 950PR" and "with Broadcom Jalapeño" came from `Lookup.suggest` in `src/modules/lookup.js`. A chip's list name is its maker plus its name (`${c.vendor} ${c.name}` in `build/build.js`). `suggest` cut only the maker's first word with a fixed list (Huawei, OpenAI, …), so multi-word makers ("Huawei (HiSilicon)", "OpenAI with Broadcom", "Amazon (Annapurna Labs)") left the rest behind. The fix: a chip suggestion now takes the chip's own name from `DATA.landscape`, found through its `data-key` (the chip id). The trailing-aside rule ("(Ironwood)") still applies to every kind, as before.
  - Check: 400 redraws showed all 38 chips, none with a stray fragment ("Ascend 950PR", "Jalapeño", "Trainium3", "TPU v7").
  - A Try button still opens its entry.
  - Search still works ("Ascend" finds the four Ascend chips and HiSilicon; "photonics" finds the Optics firms through the full category in `data-text`).
  - Shot: `glossary-try-chip-after-1440.png`.
- **Glossary list labels.** The sentence-case rewrite (`lkStage`) changed firm labels only. The term labels changed too, from "term" and "export control" to "Term" and "Export control". The new CSS drops the uppercase transform for every label, so the lower-case words would have shown as written. Chip ("AI chip") and country ("Country") labels were already capitalized and are unchanged.

## Not done
- **Real browsers.** No check in Safari 17 or Firefox for `span min()` and subgrid. Only Chrome was available. The `@supports` fallback covers browsers without subgrid.
- **One edit by script.** One `src/app.js` edit (the ribbon labels, the aria-label, the hover handler and the legend word) was a scripted read and write, not the Edit tool. It took milliseconds, and `node --check` passed. Every other shared-file change used the Edit tool.
