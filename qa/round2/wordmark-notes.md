# Wordmark: Signature lockup (20 October 2026)

The owner chose option A, Signature: the favicon's garnet tile with its paper c beside "Chip Supply Chain" in Fraunces 540 title case. Design notes and the other options: `../wordmark-options/round-2/lockup/` (IMPLEMENT.md, finals.png), outside the repo.

## Files changed
- `src/template.html`: the masthead link carries the tile SVG, the name span and `aria-label="Chip Supply Chain"`.
- `src/styles.css`: new `.wordmark` rules (tile 29 px, 25 px on phones; name 21 px, 18 px on phones); removed the old small-caps rules and the retired tagline's `.wordmark span` and `.wordmark b` rules (1240, 900 and 480 px blocks).
- `build/assets/chapter-page.css`, `build/modules/social.js` (both masthead templates), `build/modules/summary-brief.js`: the same lockup on the chapter, unfurl and summary pages; a 370 px rule on chapter pages (tile 21 px, name 14.5 px) keeps the two nav links on screen at 320 px.
- `build/cards.py`: every card's head is the lockup (36 px tile, 26 px name), then the tagline on view cards or a hairline tick and "CHAPTER 04 · STAGE 4 OF 15" on chapter cards; new `--port` option.
- `build/assets/home-card/card.html`, `build/home_card.py`: the lockup centered on the home card; new `--port` option.

The tile keeps the favicon's own colors (#7a1f2b, #f7f6f2) in both themes, so it matches the tab icon; it is a logo, not text, so it does not take the theme tokens. The footer is untouched.

## Re-rendered
All 23 cards (17 chapters, intro, chain, chips, suppliers, export-controls, glossary) with `python3 build/cards.py --port 9895`, and home with `python3 build/home_card.py --port 9895`. No overflow, all fonts loaded, every card under 150 KB (home 142 KB). The cards pick up the current content of the manifest.

## Checks
`node --check` on social.js and summary-brief.js; build; check-speak (no matches), check-integrity (only the known Veeco warning), check-sources (2516 citations, all tier A or B). Bar 56 px on desktop, 70.16 px in the app on phones (70.02 before), 52 px on chapter and summary pages on phones; no sideways scroll at 320 px; Chrome's accessibility tree names the link "Chip Supply Chain" on all three page types; Tab shows the garnet focus ring.

Shots: `qa/round2/shots/wordmark/`.
