# Suppliers page: the atlas

Shipped 11 September 2026 from Mock A in `qa/suppliers-redesign/README.md`.

## What changed

One bordered plate under the page title. Its bar carries the label "The route of one chip" and the country chips (the former role list, restyled; the meta and role lines are hidden by CSS). A caption line beneath gives the chosen country's name, its meta ("leads four stages, three of them extreme") and its one-line role. The map sits at left with the country panel at right on the same ground; choosing a country rings its stops in amber, labels its towns (a `data-place` attribute on each stop carries the town alone, and a per-country label-side rule keeps neighbouring towns apart), dims the other stops and arcs, and bars its stops in the strip. The strip of fifteen stops is the plate's footer, in two rows. Beneath the plate two tabs: "By stage" (the ladder with search, filters, toolbar and CSV, unchanged) and "By country" (the ribbons, drawn at the visible width when the tab opens, at `#/suppliers?tab=country`). The Index links `#/suppliers?country=JP` still open the plate with that country chosen. The section's accessible name is "What each country makes"; the word "leverage" is gone from the page.

## Files

`build/modules/summary-a.js` (atlas markup, `data-place`, label sides), `src/modules/summary-a.js` (chips, caption, map state, tab switch), `src/modules/summary-a.css`, `src/modules/suppliers.css`, `src/app.js` (Suppliers: tab handling, `fitPipe` on tab open), `src/template.html` (Suppliers section).

## Measurements

Full page at 1440 wide: 3,243 px, from 4,866 px before. Build clean; `qa/scripts/check-integrity.js` clean apart from the pre-existing "has no supplier entry" lines; no console errors on `#/suppliers`, `#/suppliers?country=JP` and `#/suppliers?tab=country`. Captures: `qa/suppliers-redesign/final-*.png` (light, dark, full, phone, Japan, United States, the country tab).

## Left open

The longest panels (United States, Japan) scroll inside the panel on desktop. The build agent that made this was interrupted before writing its own notes; this file was written from its captures and the diff.
