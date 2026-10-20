# verify-b: fact-check of the expert edits to chapters 4, 5 and 6 (20 October 2026)

Files edited: `content/04-lithography.md`, `content/05-photomasks-and-pellicles.md`, `content/06-deposition-and-etch.md`. Downloads: `qa/round2/scratch/verify-b/`. Notes: `qa/round2/verify-b-notes.md`.

Method: every row of each expert table was checked against the source (the expert's copy, and the live page or a Wayback copy where I fetched one myself: Hoya IR 2026, TSMC 3338, ASML 30 June 2023 and 6 September 2024 statements, TEL FY2026 consolidated statements). PDF page numbers were confirmed with `pdftotext -f N -l N` on the PDF itself. Writing rules checked by `check-speak.js` and by reading. Cross-chapter facts checked by grep over `content/` and `data/`.

## Summary

| Chapter | Confirmed | Fixed | Unverifiable |
|---|---|---|---|
| 4 Lithography (13 rows) | 12 | 1 | 0 |
| 5 Photomasks (17 rows) | 17 | 0 | 0 |
| 6 Deposition and etch (17 rows) | 15 | 2 | 0 |

## Fixes to expert changes

1. **Ch 4, row 6, Deep ultraviolet.** Before: "Dutch export licensing covers the most advanced of these scanners, ASML's NXT:2000i and later models." After: "From 1 September 2023, Dutch export licensing covered the most advanced of these scanners, ASML's NXT:2000i and later models." Why: the present tense was out of date. Since 7 September 2024 the Dutch license also covers the NXT:1970i and 1980i (ASML, 6 September 2024, via Wayback: "export licenses with the Dutch government rather than the US government for shipments of its TWINSCAN NXT:1970i and 1980i"; `data/export-controls-timeline.json` agrees). Source for the new wording, ASML 30 June 2023 (Wayback): "The new Dutch export control regulations will come into effect on September 1, 2023", "(TWINSCAN NXT:2000i and subsequent immersion systems)". The chapter's next section already records the 2024 widening.
2. **Ch 6, rows 13 and 17, AMEC.** Before: "up 36.62 percent" (body), "up 36.62% … rose 224.23%" (keyFact). After: "up about 36.62 percent", "up about 36.62% … rose about 224.23%". Source, AMEC 1 April 2026: "同比又增长约36.62%" and "营收同比大幅增长约224.23%" (约 = about). The other figures (RMB 12.385 billion, RMB 3.744 billion, 30.2 percent) match.

## Confirmed, with notes for the owner

- **Ch 6, row 3/17, Lam revenue.** Applied's $28.368 billion is exact (XBRL 28368000000). Lam's "$23.233 billion" and "$18.436 billion" round the filed $23,232,690 and $18,435,591 thousand to the nearest million, the same form as the published `data/suppliers.json` (23.233) and ch 7's KLA figure. Left as is. A zero-rounding form would be "$23,232.69 million".
- **Ch 6, row 2.** FR 2024-28270 p. 17 gives ">50:1, characteristic of advanced DRAM" in a deposition entry. It supports the sentence and the next one ("The film has to coat them right to the bottom").
- **Ch 6, row 11, Tokyo Electron "of sales".** Confirmed. All seven regional shares on deck p. 27 for FY2026 match total net sales by region in TEL's FY2026 consolidated statements p. 53 (China ¥832,555m of ¥2,443,533m; FY2025 ¥1,015,060m of ¥2,431,568m), and p. 5 says "proportion of sales in China was 34.1%". So footnote 2 on p. 27 ("new equipment sales") does not describe the chart. Ch 17 now reads "China's share of sales fell from 44.4 percent … to 34.1 percent", citing the same p. 27. The two chapters agree (44.43 and 34.07 appear only as arithmetic in the ch 17 expert's notes). No "new equipment sales" wording is left in `content/` or `data/`.
- **Ch 6, row 15.** The $253 million (Applied's recorded charge) and ch 17's "about $252 million" (the BIS penalty) are both as their sources state them. They do not contradict each other.

## Inherited numbers (Tier A document relaying a market-research firm)

- **Ch 4:** none. Nikon's 570-unit market (deck p. 8) carries no third-party attribution.
- **Ch 5:** ETO N29 shares ("CSET analysis of TechInsights data"). TechInsights was added to the IMS card leader ("…at 46.6%, using TechInsights data"), the body IMS sentence ("…in 2025, using TechInsights data"), the NuFlare/JEOL sentence ("…, in the same CSET analysis of TechInsights data") and the Takeaways ("On CSET's count from TechInsights data, …"). AGC's No.2 rank is AGC's own estimate.
- **Ch 6, Gartner** (TEL deck p. 28, "Gartner®, Market Share: Semiconductor Wafer Fab Equipment, Worldwide, 2025"): added "citing Gartner" to both body sentences and keyFacts[3]. The `tel-tool-share` source label now reads "Gartner, as reported in Tokyo Electron's FY2026 Q4 results presentation".
- **Ch 6, TechInsights** (ETO, and CSET's July 2025 article: "CSET's analysis of TechInsights' Chip Market Research Services Equipment Database"): added "by CSET's count from TechInsights data" (or "of TechInsights data") to the five card leaders, costSignal sentence 1, the substitutability test, chinaStatus sentence 2, the conductor and dielectric etch bullets, the dry etch sentence in Who makes it, the 2019 to 2024 sentence, AMEC's 12.4 percent, the dry strip market size, and both Takeaways paragraphs.
- **How I read the rule:** a sentence counts as attributed when it names both firms, or when an earlier sentence in the same paragraph, or the line that introduces its list, names both. That covers the deposition bullets under "The market sizes and leading shares below are … CSET, based on data from the research firm TechInsights", the follow-on sentences in the China paragraph, Kokusai's share and Takeaways sentence 2. The SIA border-crossing figure is covered too, because two adjacent sentences name Accenture/GSA and SIA. The site's published chapters (for example ch 7) follow the same convention. If the owner wants the attribution in every sentence, 13 more sentences in ch 6 would need it: the $21.9 billion dry etch market, five in the deposition bullets, four China follow-ons, Kokusai, Takeaways sentence 2 and costSignal sentence 2.

## Checks (after all edits)

- `node build/build.js`: exit 0. 04: 2224 words, 45 sources, D 0, ? 0. 05: 1989 words, 32 sources. 06: 2083 words, 43 sources. No warnings for these chapters.
- `check-speak.js`: "check-speak: no matches".
- `check-integrity.js`: only the known "exposure row for Veeco Instruments has no supplier entry".
- `check-sources.js`: "2516 citations, all tier A or B".
- Own validator: front matter parses, `plain` equals the first How it works paragraph, card URL counts equal sentence counts, and every card URL appears in the body (all three chapters).
- `style-report.js`: two sentences now run over 32 words because of the added attribution: ch 6 keyFacts[3] (36 words, not published) and the dry strip sentence (37 words).
