# refresh-b notes (20 October 2026)

Scope: bring newer figures into ch 15, 6, 13, 14 (content files only). Downloads: qa/round2/scratch/refresh-b/.

## Progress log
- Read RULES, SCHEMA, writing-well, the four expert reports.
- Fetched and checked (copies in scratch/refresh-b/): ERCOT Sep 2026 ops overview (31 pp, p. 9: "Of the 9,456 MW that have received Approval to Energize, ERCOT has observed a non-simultaneous monthly peak consumption of 4,132 MW in September 2026"; "This value represents how much approved load ERCOT believes is now operational"); ERCOT Batch Zero update (8 pp; p. 1: "204 projects (66.4 GW) ... base load; 158 projects (127.9 GW) ... studied load"; p. 3 pause of approvals to energize data centers and crypto sites "75 MW or greater"; p. 4 pause "until the completion of the verification and audit and community impact review", both reports "by December 10, 2026", final classification "provided in December"; note p. 6 chart legend says studied 125.4 GW, p. 1 says 127.9 GW; used p. 1); EIA Oct 2026 STEO (60 pp; Table 7b p. 46: all sectors 4,152.0 and 4,216.6 BkWh for 2026 and 2027; p. 12: commercial sector "which includes data centers" +2.8% in 2027, industrial +2.7%; October text has no "record", no "almost 2%", no Texas pause, and its forecast-changes table (p. 5) has no electricity row); Nvidia NVL72 components page ("Full rack requiring up to 142 kW").
- TEL FY2027 Q1 transcript (25 pp, p. 6): "Proportion of sales in China was 30.4%"; tanshin: three months ended June 30, 2026. URL https://www.tel.com/ir/library/report/i242su0000000goz-att/fy27q1transcript-e.pdf
- ASMPT 29 Jul 2026: "new bulk orders for more than 50 of its Chip-to-Substrate (C2S) Thermo-Compression Bonding (TCB) tools for cutting-edge AI computing chips from OSAT customers".
- Nvidia Q2 FY2027 release (newsroom URL, already in bibliography, dated August 26, 2026): "NVIDIA Spectrum-6 switch systems — supporting both pluggable and co-packaged optics as part of the NVIDIA Vera Rubin platform — are arriving across the world's gigascale AI factories." Rubin release (5 Jan 2026): "Built on the Spectrum-6 architecture, Spectrum-X Ethernet Photonics co-packaged optical switch systems".
- Lam 10-K: sec.gov 403 and Wayback 503 at first try; retrying.
- Lam 10-K: sec.gov kept answering 403 and Wayback 503 to me. Checked the sentence in Lam's own 2026 annual report (https://investor.lamresearch.com/download/488965_P56391_LAM+RESEARCH+2026+COMBO_PROOF_REV5_RC_LM_WEB+ONLY.pdf, which reproduces the Form 10-K) and in the same-day sec.gov copy at scratch/expert-deposition-and-etch/lam-10k/10k.htm: "Revenue in China, which includes global customers and domestic Chinese customers with manufacturing facilities in China, represented approximately 34%, 34%, and 42% of our total revenue for fiscal years 2026, 2025, and 2024, respectively." Cited the sec.gov 10-K URL.

## Changes made
### ch 15 content/15-data-centers-and-power.md
1. `plain` + twin: "draws up to 142 kilowatts" -> "can draw 142 kilowatts". Nvidia components page: "Full rack requiring up to 142 kW". The named-rack sentences (body ¶3, keyFact 1, figure note) keep "up to"/"at most".
2. keyFacts[7]: March TAC 9,042/3,883 -> "ERCOT's operational overview for September 2026, published on 16 October 2026, counted 9,456 MW approved to energize. Judging by peak monthly use in September, ERCOT believed 4,132 MW of it was operating" (source ERCOT Sep overview).
3. keyFacts[11]: Sep STEO -> October STEO, 4,152.0 and 4,216.6 TWh, commercial +2.8% in 2027 (Sep 4.7% Texas-region revision dropped from the keyFact; it stays in the body tied to September).
4. Capacity and demand, EIA paragraph: S1 -> Oct (#page=46, Table 7b); S2 "Sales would grow by almost 2 percent..." (Sep p. 10) -> "It expects electricity demand from the commercial sector, which includes data centers, to grow 2.8 percent in 2027 and demand from industry to grow 2.7 percent" (Oct #page=12); S3/S4 kept on the September outlook, reworded to past tense ("Its September outlook had lowered...", "That outlook noted that Texas had paused..."). "record" dropped: the October outlook does not say it.
5. The chokepoint: March sentence -> Sep overview (#page=9); paragraph split in two; added three Batch Zero update sentences (pause of approvals to energize >=75 MW data centers and crypto sites until audit and community impact review are complete; 66.4 GW base load and 127.9 GW studied load, conditional, final decisions in December; both reports to the PUC by 10 December 2026).
6. Takeaways ¶2: March figures -> Sep overview; added the pause sentence.
- oneLiner unchanged (474 GW / 205 GW are tied to mid-2026 on purpose).
### ch 6 content/06-deposition-and-etch.md
7. TEL bullet: added "It was 30.4 percent in the quarter to June 2026" (fy27q1transcript-e.pdf#page=6).
8. Lam bullet: "26 percent in the June 2026 quarter, behind Taiwan at 27 percent" (8-K) -> "about 34 percent of revenue in the year to June 2026, the same as a year earlier" (10-K). Taiwan comparison dropped: the 10-K gives only regional amounts for the year.
### ch 13 content/13-test-and-assembly.md
9. "ASMPT took a repeat order for fifteen chip-to-substrate bonders in December 2025" -> "In July 2026 ASMPT announced new bulk orders for more than 50 of its chip-to-substrate bonders for AI chips, from outsourced assembly and test firms" (ASMPT 29 Jul 2026).
### ch 14 content/14-systems-and-networking.md
10. "Nvidia's Spectrum-X Photonics switches, due in 2026, ..." -> "..., announced in March 2025, ..." + "Nvidia builds them on its Spectrum-6 switch design" (Rubin release, Jan 2026) + "In August 2026 Nvidia said its Spectrum-6 switch systems, with pluggable or co-packaged optics, were arriving at AI data centers around the world" (Q2 FY2027 release, newsroom URL already in bibliography).

## Proposals for data files and other shared copies (main session)
- data/flashcards.json, "data-centers-and-power" cards[0].a. Before: "One rack draws up to 142 kilowatts, and that much heat is more than air can carry away." After: "One rack can draw 142 kilowatts, and that much heat is more than air can carry away."
- data/flashcards.json, "data-centers-and-power" takeaways[0]. Before: "One AI rack draws up to 142 kilowatts, too much heat for air, so racks are cooled with liquid." After: "One AI rack can draw 142 kilowatts, too much heat for air, so racks are cooled with liquid."
- media/power.json steps "Power in" cap and animations/power.html STEPS[0].cap. Before: "... One rack of AI chips draws up to 142 kilowatts." After: "... One rack of AI chips can draw 142 kilowatts."
- Glossary entries NVL72, rack, power shelf, kilowatt name the GB300 NVL72, so "draws up to 142 kilowatts" is right there; no change.
- No copies of 9,042 / 3,883 / 4,135 / 4,211, Lam's 26 percent, ASMPT's fifteen or "due in 2026" exist in flashcards, glossary or suppliers.
- FYI, not a copy: the ch 17 flashcard "How has China's share of allied toolmakers' sales changed?" gives TEL's 26.8 percent for the quarter to March 2026 (tied to its period). TEL's quarter to June 2026 was 30.4 percent.

## Pages files
- qa/round2/pages/15-data-centers-and-power.json lists the old March TAC sentences (x2) and the Sep STEO sentences ("Sales would grow...", "The same outlook lowers...", "It notes that Texas..."); apply-pages.py will report them not found. The new sentences already carry #page (Oct p. 46 and p. 12; ERCOT overview p. 9; Sep p. 4 and p. 10). The Batch Zero deck is 8 pages, so no #page.

## New bibliography entries
```json
{
  "https://www.tel.com/ir/library/report/i242su0000000goz-att/fy27q1transcript-e.pdf": {"title": "Q1 FY2027 (April-June 2026) Financial Announcement, transcript", "publisher": "Tokyo Electron", "date": "2026-07-30", "type": "transcript", "accessed": "2026-10-20"},
  "https://www.sec.gov/Archives/edgar/data/707549/000070754926000037/lrcx-20260628.htm": {"title": "LAM RESEARCH CORP, Form 10-K annual report for the period ended 2026-06-28 (10-K)", "publisher": "U.S. Securities and Exchange Commission (filing by LAM RESEARCH CORP)", "date": "2026-08-07", "type": "filing", "accessed": "2026-10-20"},
  "https://www.asmpt.com/en/investor-relations/news-events/asmpt-secures-significant-wins/": {"title": "ASMPT Secures Significant Wins for More than 50 Chip-to-Substrate Thermo-Compression Bonding Tools", "publisher": "ASMPT", "date": "2026-07-29", "type": "page", "accessed": "2026-10-20"}
}
```
ERCOT Sep overview, ERCOT Batch Zero update, EIA Oct STEO, Nvidia Q2 FY2027 release and Nvidia Rubin release already have entries.

## Checks (after the last edit)
- build exit 0, no warnings for ch 6, 13, 14, 15; "source tiers: A 624 · B 31 · disallowed 0 · unclassified 0".
- check-speak: no matches. check-integrity: only the known Veeco warning. check-sources: 2535 citations, all tier A or B.
- Front matter parses and `plain` equals its twin in all four chapters. The rebuilt static ch 15 page shows the new ERCOT sentences.
Status: done.
