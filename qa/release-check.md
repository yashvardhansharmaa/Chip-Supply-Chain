# Release check, 10 September 2026

What was checked before the site went to outside researchers, how, and what was found. Re-run the scripts before any later release.

## Build and data

- `node build/build.js`: no errors, no warnings; every chapter's `plain` field identical to its first paragraph; source tiers A 320 · B 22 · disallowed 0 · unclassified 0.
- `node build/audit-data-sources.js`: 0 disallowed URLs in the data files.
- `node qa/scripts/check-integrity.js`: every internal `href="#…"` resolves to an element or a known route; every board state cites a timeline event that exists; every flow and glossary entry points at a chapter that exists; every popover term has an entry; supplier country codes valid; exposure shares equal the filed absolutes within 0.15 points; matrix shares sum to 100 ± 1.5 and carry `basis` and `sources`; chip TPP equals the formula; no duplicate ids; no unfilled placeholders; no "undefined", "NaN" or "[object Object]" in the page text. One finding left as is: five firms in `exposure.json` (Cadence, Micron, Nova, Samsung Electronics, Veeco Instruments) are named differently from `suppliers.json`, so nothing joins them.

## Links

- `node qa/scripts/check-links.js` then `recheck-links.js`: 755 external URLs in the page and the data files.
- 593 answered 2xx or 3xx at once; 94 more after a second pass with a contactable user agent.
- 42 still answer 401 or 403 to scripts but open in a browser: sec.gov (which requires a declared user agent and rate limit), pr.tsmc.com and tsmc.com, intel.com, reuters.com (paywall), jedec.org, semi.org, commerce.gov, congress.gov, pib.gov.in, echa.europa.eu, a few investor-relations hosts behind Akamai.
- 1 true 404: `technoprobe.com/…/PR-FY-2025` (the citation had lost its `_.pdf` tail to a markdown bug, now fixed; the real document answers).
- 6 unreachable from this network even with curl (TLS chain or timeout): unimicron.com, nsig.com, semitronix.com, dongjin.com, hpe.com, eaton.com. All are company home pages cited for what the firm does; check once from another network.

## Accessibility (axe-core 4.10, WCAG 2.1 A and AA, per view at 1440 px)

Found and fixed: the home strip's stop list held anchors without list items; the map stop numbers sat on coloured fills at 2.9:1 (now ink badges with a coloured ring); the "estimated here" label, the Suppliers ladder ranks and the board's year numbers were under 4.5:1; the China-revenue table cells, the ranking chart and 21 sparklines had links with no accessible name and charts marked `role="img"` around interactive points (now `role="group"` and each link labelled with firm, year and share). After the fixes every view reports zero violations.

## Layout and behaviour

- No horizontal overflow at 375, 768 or 1440 px on any view (`document.documentElement.scrollWidth === innerWidth`).
- No console errors on any view; the Index's 346 entries all open (about 1 s for the whole set).
- Dark and light themes checked on the home page, the Index, the board and a chapter.

## Prose

- Four editors, disjoint files, reports in `qa/prose-final-{a,b,c,d}.md`: 23 + 57 sentences in the chapters, 12 glossary fields, 19 interface strings, 61 data strings.
- Style now uniform: no em dashes in prose, "percent" in running text (tables and cards keep %), "$" not "US$", "data centre".
- Spelling sweep of the built text against the system dictionary: no typos; the only unknown words were domain terms and proper nouns.

## Left for the author

- Chapter 7 states "49 percent" for two different dies two sentences apart (both correct).
- ASMPT's bonder market: $1.6bn by 2028 in chapter 11, $1bn by 2027 in chapter 13 (different vendor statements).
- The Dutch equipment tightening is dated 7 September 2024 in the timeline (Staatscourant) and 9 September in the eCFR footnote.
- Start here is titled "How a GPU is made" while the hero says "How AI chips are made".
- 25 of the 50 board summaries run over 90 words; every overrun is cited fact.
- TPU v6e FP8 support could not be settled from Google's pages.
- "License Exception" keeps the EAR's American spelling in four glossary term names.
