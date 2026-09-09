# Suppliers page redesign

New `src/modules/suppliers.css`; the `Suppliers` object in `src/app.js`; the `data-view="suppliers"` block in `src/template.html`. Build clean.

## Built

**Where the suppliers sit.** A dot matrix above the filters: 20 stages in chain order down, US JP CN TW KR DE NL GB and Other across, totals per row and column in mono. Dot area is the count (the largest cell is 15 US accelerator vendors); fill is the most severe level in the cell, so amber marks only stages holding a Critical firm. Hover or focus a cell for the names, six then "+n more". Click sets both filters, rings the cell and scrolls to the list; clicking again clears them. Dots grow from zero row by row, 563 ms end to end. On phones it scrolls sideways in its own container, stage labels sticky at that container's left edge, right edge faded to say there is more; labels 9.5 to 10 px.

**The list.** One line a firm: name, native name and ticker in mono, subcategory as what they make, country and city, founded, level pill, chevron. Each row header is a button with `aria-expanded` and `aria-controls`; click or Enter opens role, customers, share note, founded, ownership, revenue and the source in place (0fr to 1fr, 220 ms). Detail HTML is built on first open, so 220 rows cost nothing until used. Compact / Detailed switches to the old table, unchanged, and the choice is kept in localStorage. Sorting by name, country, founded and level works in both. Filter changes fade rows in with a 10 ms stagger capped at 400 ms. Reduced motion: no animation, instant open.

**Filters.** Search, country, level and Copy as CSV kept; the CSV still copies the filtered rows and reports the count. Under 700 px the chips become a select with counts. The country select gained "Every other country (22)", which makes the Other column clickable.

## Cut

The seven-column table off the default view, and with it the role text, share note and customers for all 220 rows at once. `aiRelevance` is out of the compact detail because it repeats the role; it stays in the table and the CSV.

## Heights at 1440 wide

| | Before | After |
|---|---|---|
| Document | 22,277 px | 11,878 px |
| Suppliers view | 22,181 px | 11,782 px |

`scrollWidth` equals the viewport at 375, 700, 1024 and 1440, top and bottom. Routing, the search palette and its jump into `#sup-search` still work; no console errors on any of the ten routes.

## Still open

Nothing blocking. 48 rows carry the ticker "Private", which reads beside the name as a status. Contested and Important dots sit close in dark mode because `--ink` and `--ink-2` are close there.

Screenshots in `qa/redesign/`: `suppliers-desktop-light`, `-desktop-dark`, `-phone`, `-cell-selected`, `-row-expanded` and `-detailed`.
