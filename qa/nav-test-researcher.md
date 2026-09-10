# Nav test — research analyst, compute-governance think tank

Laptop, one hour, memo on HBM and the tools that make it. Second visit, weeks apart.

## Verdict

Better sourced than most things I pay for. Every figure carries a numbered marker, and the markers resolve to Federal Register, SEC EDGAR and JEDEC rather than to press coverage. The China-revenue table is the best artefact here: each cell links to the exact EDGAR exhibit and carries the absolute figures, the currency and the counting basis. I would cite that tomorrow. What stops me citing the rest is plumbing — the scoring rubric exists and is unreachable, and there is no licence, no version, no bibliography export, no permalink for a glossary term. A reference not yet fitted for citation.

## Questions per page, and whether they were answered

**Home.** Who dominates HBM? Answered: clicked KR, got 82.5%, 2025. From what source? Not answered — no source on any panel figure. What is a "SITE ESTIMATE"? Never defined; an `em.sa-est` with no title or aria-label. Which town is that pin? The 170 `span.sa-town` pins carry no title, label or link. Decorative.

**Chapter 10.** Who, where, how concentrated, what the rules say? All answered well: ECCN 3A090.c, >2 GB/s per mm², BIS 5 Dec 2024, FDPR, with the Federal Register link. Who sells the stacking tools? **Not answered.** The chapter names no equipment vendor and never links to Suppliers. Disco, Hanmi, Besi, ASMPT and EV Group are all in the dataset — under Advanced Packaging & OSAT, where I would not have looked.

**Export Controls.** Does the as-of-date hold? Yes: HBM reads OPEN at 31 Dec 2023, LICENCE from 2 Dec 2024. Cite the board as of a date? No — the hash stays `#/controls`.

**Sources.** 336 links, 17 chapters, an explicit A/B policy with four named B exceptions. Export them? No buttons on the page at all.

## Paths and dead ends

1. **Home → HBM: two clicks.** KR marker → "HBM 82.5%" → `#memory-and-hbm`. I spent the first minutes not finding the search: an unlabelled magnifier (Ctrl+K or `/`). Once open it is excellent — federated over chapters, subsections, glossary, events, suppliers, chips.
2. **ASML.** Export Controls → China revenue share → table. FY2025 = **29.1%**, counted where it ships, linked to EDGAR accession 0001628280-26-011378 (R71). Hover carries China revenue, total, currency and basis. The table never names the form type or filing date.
3. **Photoresist — the one real trap.** Search "photoresist" → 10 firms → Copy as CSV. The canonical category holds **11**. Those 10 include three firms from other categories (Shin-Etsu, Tokyo Electron, SUSS MicroTec) and miss four true members (Soulbrain, Adeka, Fujimi, JX Advanced Metals). Clicking the "Photoresist & Materials" rung did **not** constrain the export — it copied all 220 rows. A memo built on that CSV would be wrong and would look sourced.
4. **Glossary link — dead end.** Two ids on the page: the search input and the whole `<dl>`. No per-term anchor.

## What I could not find

The scoring rubric — it sits in `dist/data/methods.md`, complete and persuasive, with **zero** references in `index.html`. Also: a licence or reuse terms; a version (`changelog.json` ships, no route reaches it); a bibliography export; an export of the control timeline; Towa, Shinkawa, Tokyo Seimitsu.

## Ten changes, ranked

| # | Change | Effort |
|---|---|---|
| 1 | Link `methods.md` from the nav and every score badge | S |
| 2 | Per-term glossary ids and permalinks | S |
| 3 | Bibliography export — BibTeX/RIS/CSV on Sources | M |
| 4 | Put state in the URL: supplier query, board as-of date, country | M |
| 5 | Make "Copy as CSV" respect the active filter; add a category facet | S |
| 6 | Version, last-updated and a licence in the cite block | S |
| 7 | Bridge chapters to suppliers (HBM → its tool vendors) | M |
| 8 | Deep-link supplier and event search hits to the record | M |
| 9 | Label the search control; show the "/" hint | XS |
| 10 | Chapters 16–17 in the rail; define "site estimate" inline | XS |

## The home map as a research entry point

Each country reads as *how many of the 17 chokepoint cards name it* — marker area, chip count, heavier ring for a 5/5 stage. Legible and honestly labelled. But it counts mentions, not leverage: the US shows 16 and the Netherlands 6, making ASML look peripheral when it is the hardest single point in the chain. The panel says so in words; the map contradicts it in ink.

Missing: any source on the panel figures, identity on the town pins, a way in by *stage* rather than country, and any comparison of two countries at once. Fastest fixes: label the pins, cite the shares in place, and encode depth as well as breadth so the Netherlands reads heavy rather than small.

Screenshots: `qa/nav/res-home-map.png`, `res-controls-china-revenue.png`, `res-search-hbm.png`
