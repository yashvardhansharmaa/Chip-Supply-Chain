# refresh-a notes (20 October 2026)

Task: bring TSMC 3Q26 and ASML Q3 2026 figures current across chapters; add tsia.org.tw to Tier A; update ch 17 foundry share to TSIA 2026.

## Sources verified (copies in qa/round2/scratch/refresh-a/)
- TSMC 3Q26, 6-K EX-99.1, accession 0001046179-26-000726, filed 2026-10-15, period 2026-09-30. URL used: https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm (file tsmc-3q26-6k.htm). Quotes: "third quarter revenue was $46.72 billion"; "Gross margin for the quarter was 66.4%"; "2-nanometer accounted for 8% of total wafer revenue; 3-nanometer accounted for 33%; 5-nanometer accounted for 28%; and 7-nanometer accounted for 10%. Advanced technologies, defined as 7-nanometer and more advanced technologies, accounted for 79% of total wafer revenue." Basis: "TIFRS on a consolidated basis". Remainder 10 nm and above = 100 - 79 = 21 (labelled chart remainder, as before).
- ASML Q3 2026, 6-K EX-99.1, accession 0001628280-26-065813, filed 2026-10-14, period 2026-09-27. URL: https://www.sec.gov/Archives/edgar/data/937966/000162828026065813/pressreleasefinancialresul.htm (file asml-q3-2026-6k.htm/.txt). Quotes: "Q3 total net sales of €11.7 billion, gross margin of 57.5%"; "Full-year 2026 total net sales expected to be between €44 billion and €45 billion, with a gross margin around 56%"; "we now expect that our supply as currently planned for both 2027 and 2028 will not fully meet the demand of our customers". Table: "Gross margin (%) 54.0 57.5" (Q2, Q3).
- TSIA, Overview on Taiwan Semiconductor Industry (2026 Edition), posted 2026/08/07 on https://www.tsia.org.tw/EN/PublOverview?nodeID=60; PDF at https://www.tsia.org.tw/api/DownloadOverview?ID=36 (38 pages; file tsia/overview-2026.pdf). PDF page 9 (folio 9): "Market share of Taiwan foundry was 81.9% in 2025, ranking number one in the world." Table 5 same page: "WW Market Share (Foundry) 77.6% 75.2% 78.1% 81.9% 82.5%" (2022-2026e). p. 3: data from ITIS, research by ISTI/ITRI.
- Stimson (expert's Wayback copy, scratch/expert-geopolitics/src/54): "The most advanced chips, currently TSMC's 2 nm, are produced only in Taiwan at present".

## Data files: no copies of the old quarterly TSMC/ASML figures or of TSIA's 78 percent found in data/*.json or media/*.json (searched flashcards, glossary, suppliers, landscape, chokepoint-matrix, exposure; exposure has annual TSMC/ASML rows only).

## Progress
- [x] Download TSMC 3Q26 6-K (sec.gov) and ASML Q3 2026 6-K (sec.gov)
- [x] Download TSIA 2026 report
- [x] ch 9 edits: card TSMC leader + source; keyFacts[0]; foundry-share title/data/source; Pure-play paragraph (3 sentences). oneLiner and plain carry no TSMC quarterly figure, unchanged.
- [x] ch 4 edits: Who makes it guidance sentence; keyFacts[2] (expert's ready swap). keyFacts[3] and the July 2026 capacity sentence stay (dated, repeated in the Q3 footnote).
- [x] ch 16 edits: gross-margins chart TSMC 67.7 -> 66.4, ASML 54.0 -> 57.5, chart url -> TSMC 3Q26 6-K; table rows TSMC and ASML "June 2026" -> "September 2026" with new sources. Title "quarters ended June to September 2026" still true (TSMC 30 Sep, ASML 27 Sep). Order and the 50.3-75.0 range unchanged.
- [x] other chapters (grep): no other TSMC/ASML quarterly figure presented as current. Chs 11, 12, 13 quote the July 2026 earnings call (dated statements, not figures): left.
- [x] source-tiers.json
- [x] ch 17 edits
- [x] data-file proposals (none needed)
- [x] checks

## Chapter 17 and source tiers (done)
- data/source-tiers.json: appended "tsia.org.tw" as the last entry of the A list (after "csis-website-prod.s3.amazonaws.com"); file validates.
- ch 17 Taiwan para. Before: "Taiwan's foundries hold 78 percent of the world's contract chipmaking, according to the Taiwan Semiconductor Industry Association's July 2025 report, and TSMC makes its 2 nm chips only in Taiwan ([source](stimson))." After: "Taiwan's foundries held 81.9 percent of the world's contract chipmaking market in 2025, according to the Taiwan Semiconductor Industry Association's August 2026 report ([source](https://www.tsia.org.tw/api/DownloadOverview?ID=36#page=9)). TSMC makes its 2 nm chips only in Taiwan ([source](stimson))."
- ch 17 table row. Before: "| Foundry, all nodes | Taiwan | 78% | market share, 2024 |". After: "| Foundry, all nodes | Taiwan | 81.9% | market share, 2025 |".
- No ch 17 keyFact, card or takeaway repeats the foundry share. No data file repeats it.

## Notes for the main session
- oneLiner unchanged in ch 4, 9, 16 and 17: no share card to re-render.
- ch 9 foundry-share chart: "10 nm and above, 21" is the labelled remainder (100 minus 79), as before (was 23 = 100 minus 77).
- Now uncited anywhere (bibliography entries can stay or go): https://pr.tsmc.com/english/news/3326, https://www.asml.com/en/news/press-releases/2026/q2-2026-financial-results, https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm. The ASML Q2 PDF is still cited (ch 4 keyFacts[3] and the July 2026 capacity sentence).
- Not done, by the brief's scope: ASML's Q3 line that planned 2027 and 2028 supply "will not fully meet the demand of our customers" could follow ch 4's July 2026 capacity sentence if the owner wants it.
- Data files: nothing to change (see above).

## New bibliography entries
```json
{
  "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm": {"title": "TSMC Reports Third Quarter EPS of NT$29.43", "publisher": "U.S. Securities and Exchange Commission (filing by TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD)", "date": "2026-10-15", "type": "filing", "accessed": "2026-10-20"},
  "https://www.sec.gov/Archives/edgar/data/937966/000162828026065813/pressreleasefinancialresul.htm": {"title": "ASML reports €11.7 billion total net sales and €5.0 billion net income in Q3 2026", "publisher": "U.S. Securities and Exchange Commission (filing by ASML HOLDING NV)", "date": "2026-10-14", "type": "filing", "accessed": "2026-10-20"},
  "https://www.tsia.org.tw/api/DownloadOverview?ID=36": {"title": "Overview on Taiwan Semiconductor Industry (2026 Edition)", "publisher": "Taiwan Semiconductor Industry Association", "date": "2026-08-07", "type": "report", "accessed": "2026-10-20"}
}
```

## Checks (20 Oct 2026, after all edits)
- node build/build.js: exit 0 (04 lithography 2223 words, 46 sources; 09 foundries-and-fabs 1884 words, 35 sources; 16 component-costs 1879 words, 32 sources; 17 geopolitics 2909 words, 66 sources; D 0, ? 0 in each)
- check-speak: no matches
- check-integrity: only the known "exposure row for Veeco Instruments has no supplier entry"
- check-sources: 2517 citations, all tier A or B
