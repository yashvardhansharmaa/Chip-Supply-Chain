# AI Chips, rebuilt as a comparison (9 September 2026)

The page showed one chip at a time: a picker, a spec sheet, and a 19-row table nobody could read
across. A reader who wanted to know how an MI355X differs from a B200 had to click twice and
remember. It now compares two to four chips in one view, and the page opens on that pair.

Files: the `Landscape` object in `src/app.js`, its `addExport` line in `Tools`, the
`data-view="landscape"` block in `src/template.html`, and a new `src/modules/chips.css`
(classes prefixed `cx-`). Nothing else was touched.

## What was built

**Selection.** The 19 picker buttons became checkbox toggles: a box on the left, `aria-pressed` on
the button, a count line under the picker, and a Clear control. Two to four chips at a time. The
page loads with the B200 and the MI355X already chosen, so it opens in comparison mode. Adding a
fifth is refused with a line in the count ("Four is the limit. Remove one first."), and removing the
last one is refused the same way. Clear keeps the focused chip, which is how the single-chip view
stays reachable: one column, no bars, the same notes.

**The table.** Rows are the specs, columns the chips. Eighteen rows in the order the brief set:
vendor, status, built for, foundry and node, dies, transistors, package, memory type, capacity,
bandwidth, FP16, FP8, FP4, power, chip to chip, scale-up, price, export status. Nulls print
"not published". The eight numeric rows carry a bar in `--bar-4` scaled to the row maximum; the
leader in the rows where more is better is bold, never coloured. Ties both go bold. Die count and
watts get a bar but no leader: neither more dies nor more watts is a win.

**Package plans.** Above the table, one inline SVG per chip drawn from its `layout` at a single
millimetres-per-pixel scale, with a key and a scale bar that names the unit (50 mm, 100 mm, 200 mm,
whichever fits). Substrate and interposer are ground, dies are ink, base dies are ink at 30 per cent,
memory stacks are amber. The Cerebras part draws as the 215 mm square cut from a 300 mm disc, with
its 12 × 7 reticle grid; beside a B200 it is three times the span, which is the point of a shared
scale. Every one of the 19 layouts renders, including the LPU, whose `interposer` is null.

**Focus.** One chip is always focused. Click a plan or a column header and the stage redraws to that
chip through the existing call, the tag reads "AI chips · <name>", its notes open below the table,
and its column takes an amber underline. The picker marks it too, so the selected set and the focused
chip never blur.

## Four decisions worth flagging

**The Notes control is a button, not a link.** The brief asked for a link from each column header to
that chip's notes. A real `href="#cx-note-…"` would hand the router a hash it does not recognise
(`/^#\/([a-z-]+)/` fails, so it falls through to the chain view) and throw the reader off the page.
The header carries a Notes button instead: it focuses the chip, opens its `<details>`, and scrolls
to it, with the hash untouched. Verified: clicking it left `location.hash` at `#/landscape`.

**Amber marks the focused chip, never a winning number.** The brief reserved amber, so the table
encodes leaders in weight alone. The accent appears in three places only: the memory stacks in the
plans, the underline on the focused column, and the border on the focused plan and picker button —
all of them state, matching the amber already in the stage tag.

**Source tooltips say what they can.** `sources` is a list per chip, not a map per field, so each row
carries keywords and takes the first source whose label matches: the datasheet for bandwidth, the
Federal Register for an export status, the architecture page for transistors. When nothing matches,
the tooltip lists the chip's sources rather than claiming one of them is the source for that cell.
Every cell in a two-chip table (36 of 36) has a tooltip.

**Scale follows the column, except on phones.** The widest selected part sets the scale, capped so a
row of four still fits the 640 px column on a desktop. Below 900 px that fitting is skipped, because
shrinking four plans to 45 px to avoid a scrollbar defeats the drawing; the row scrolls instead. The
plans redraw on resize, debounced at 160 ms.

## Export

`addExport('#cx-table-wrap', 'AI chips, selected', Landscape.exportRows, 'before')`. `exportRows` is
an array `Landscape` mutates in place and never replaces, so the existing Copy as CSV and Copy as
JSON buttons read the current selection at click time; the bar's own count is rewritten on every
render. Copying with four chips selected produced four rows in selection order, headed by the full
chip schema.

## Verified

Served build at `http://localhost:8765/#/landscape`, light and dark, 1280 px and 375 px.

- Opens with the B200 and MI355X selected, two plans, three header cells, 18 rows in the right order.
- Selection stops at four: clicking a fifth leaves the four and shows the limit line. Clicking the
  last remaining chip leaves it selected and says so.
- Clear drops to the focused chip: one column, no bars, the export bar reads "1 row".
- All 19 layouts draw (shape counts 2 to 26, no empties). Plans share one scale to three decimals:
  1.558 px/mm for the default pair, 0.653 with the wafer-scale part in the set. All plans sit on one
  baseline.
- Clicking a column header or a plan moves the stage tag ("AI chips · Instinct MI355X"), the amber
  column underline, and the open note together.
- Notes button scrolls to the right note and leaves `location.hash` at `#/landscape`.
- Footnote markers on the FP rows match the numbered list under the table: 3 rows × 2 columns = 6
  markers, 2 footnotes.
- Arrow keys, Home and End move focus across the picker and across the plans; every picker button
  carries `aria-pressed`.
- 375 px: `document.scrollWidth` equals `innerWidth` (375). Nothing outside the plans row and the
  table wrap crosses the viewport edge; both scroll inside themselves (365/339 and 505/337).
- Dark mode: dies invert to `#e7e9ea`, amber holds, bars take `--bar-4` in both themes. Every colour
  in `chips.css` is a token.
- Console clean through the whole exercise, including cycling all 19 chips. All eleven routes still
  resolve and `node build/build.js` reports no warnings.

## Not done

The notes file opens each chip's block with the chip id in backticks, which is keying for
`landscape.json` and not copy for a reader; the renderer strips that leading paragraph rather than
edit `data/landscape-notes.md`. Fix it in the data and the strip becomes a no-op.

Package sizes come from the `substrate` rectangle in `data/landscape-layouts.json`, which is an
estimated envelope for every part except the Cerebras square. The caption under each plan says
"estimated" where the file says so, so the drawing never claims a published dimension.
