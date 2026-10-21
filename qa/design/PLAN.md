# Design round: the plan (21 October 2026)

Sources: the four reviews in this folder (`design-front-review.md`, `design-chapter-review.md`, `design-data-review.md`, `design-print-review.md`). Review page for the owner: `review.html` (published privately), made by `make-review.py`.

## The owner's decisions (21 Oct)
- Yes: 1 (laptop home leads with the chain at a glance; Other pages move to the walk's end), 2 (phones drop the Home tab), 3 (retire the fixed rail on desktop; the ledger column gets a key), 5 (ribbons: garnet only for Critical firms), 6 (the board as a chart), 7 (PDF chapter opener, stage index in the margin, section running heads), 10 (print the flashcard questions above Four things to remember), 11 (units on values, figure columns right-aligned, en dash for number ranges in tables, drop "($M)" from the two titles), 12 (The Chain contents: one-liners), 13 (drop "China x% of revenue" from the chapter cards; the share stays in the Suppliers drawer, the Glossary card and the Export Controls chart).
- No: 9. Light stays the default for everyone; do not follow the device's dark setting.
- 8: keep the specimen caption centered, and the plate keeps its current wording (no change to the caption at all).
- 4, the owner's middle way (proposed 21 Oct, `shots/decide/decision-4-final.png`, CSS and JS in `shots/decide/middle.css`, `middle.js`): bar charts are one series, so ink with garnet on the largest bar; stacked bars put garnet on the largest segment and the site's hues on the rest in order (light #2b63c4, #1f9a6d, #c9a10c, #5a48b8, #e06a1f; dark #4f86dc, #2a9670, #ad8f14, #7f6fd4, #c96a2a; validated with the dataviz checks, garnet the one band exception), a light tail past five, remainders hatched; the three country stacks keep each country's color with neutral remainders (Europe takes the EU orange). Awaiting the owner's yes.
- The owner's dark-mode worry: the specimen looked invisible in the design-front proof shot because the proof forced the theme without the site's toggle path. Loaded in dark, and switched with the real button, every specimen shows (`shots/decide/dark-specimens-all-chapters.png`, `dark-phone-after-button.png`).

## Part two (fixes and upgrades, approved by default)
Everything listed in part two of the review page, per the reports. Conflicts settled: dark `--bar-4` is `#636a73` (design-front's value); the footnote-space fix is the regex in `inline()` (design-chapter P1.2); the print stack colors follow the owner's call on decision 4.

## Build order (after 4 and 8)
Four builders by file ownership (frame and home; chapters and figures; data pages; print and cards), then QA at 320/390/1024/1440, light and dark, all PDFs and cards re-rendered, then a review page of the result and a push only on approval.
