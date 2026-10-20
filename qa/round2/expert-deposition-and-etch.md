# Expert review: chapter 6, Deposition and Etch (20 October 2026)

Reviewer: process engineer (deposition and etch). Scope: `content/06-deposition-and-etch.md` (edited), flashcards, glossary terms owned by the chapter, `dep-etch` animation (proposals only). Downloads: `qa/round2/scratch/expert-deposition-and-etch/`. Progress notes: `qa/round2/expert-deposition-and-etch-notes.md`. Screenshots: `qa/round2/shots/expert-deposition-and-etch/`.

Counts: 14 errors fixed, 3 sentences simplified, 2 sources replaced, 0 links fixed (none broken). No `oneLiner` change, so no share card to re-render.

## How the figures were checked
- **CSET/ETO.** All 17 ETO figures in the chapter (card, body, both CSET figures) match ETO's open data (github.com/georgetown-cset/eto-supply-chain, `provision.csv`, `inputs.csv`: "Data used for analysis were published by TechInsights on July 3, 2026").
- **Every other cited source** was opened. These were the SIA testimony p. 2, Lam's Cryo 3.0 release and Etch Essentials page, the TELINDY page, FR 2022-21658 p. 1, FR 2023-23049 pp. 1, 15, 16 and 28, FR 2024-28270 pp. 5-6, 15-17, 21, 28, 32 and 33, the VEU rule, the Affiliates rule p. 1 and its suspension, the BIS release of 2 Dec 2024, CSET's "Inside Beijing's Chipmaking Offensive", the CSET brief p. 39, Intel PowerVia, Applied's July 2024 wiring release, Applied's Q3 FY2026 release, Applied's XBRL, Lam's Q4 FY2026 8-K, the SEMI release (Wayback), TEL's FY2026 Q4 deck pp. 5, 27 and 28, ASM p. 2 and AMEC 708.
- **Other checks.** The Federal Register API shows no 2026 change to 3B001 or 3B993, and none to the Affiliates Rule suspension. That suspension still ends 9 November 2026.

## Changes made (content/06-deposition-and-etch.md)

| # | Where | Before | After | Why | Source, quote, page |
|---|---|---|---|---|---|
| 1 | `plain` + twin, sentence 2 | Deposition lays down a film a few atoms thick. | Deposition lays down a thin film, sometimes only a few atoms thick. | Technically wrong as a general statement. Most deposited films are tens to thousands of atoms thick. Only ALD and gate films are a few atoms. | FR 2024-28270 p. 32, 3B001.d.5: "carbon hard masks more than 2 um thick". FR 2023-23049 p. 16 (ALD): "a fraction of a monolayer at a time" |
| 2 | `plain` + twin, sentence 6 | Some of the holes the etch cuts are more than 50 times deeper than they are wide, … ([Lam Cryo 3.0 release]) | Some of the holes the etch cuts in memory chips are more than 50 times deeper than they are wide, … ([FR 2024-28270#page=17]) | **Source policy.** The only "50 times" line in Lam's release is a quote from Neil Shah of **Counterpoint Research**, which is on the never-cite list. BIS states the figure itself. | FR 2024-28270 p. 17: "very high aspect ratio features (greater than 50:1, characteristic of advanced DRAM)". Same page: "etching a high-aspect ratio feature into a dielectric material" |
| 3 | Lead | $28.4 billion … $23.2 billion | $28.368 billion … $23.233 billion | Rounded. Changed to the filed figure, to the million, as ch 7 does for KLA ($13.579B from 13,579,476,000). | XBRL FY2025 (to 26 Oct 2025): 28368000000. Lam 8-K table: "$ 23,232,690" (thousands) |
| 4 | How it works, deposition paragraph | For deposition, the gas carries the material … The film builds from the bottom up, a few atoms at a time. | In most deposition steps, the gas carries the material … The film builds up a few atoms at a time. | PVD sputters a solid target and electroplating works from a liquid. "Bottom-up" names a special selective fill. An ordinary film grows on every exposed surface. | FR 2024-28270 p. 32, 3B001.d.2.b: "Selective bottom-up chemical vapor deposition of tungsten". ETO N42 (PVD): "vaporize a solid or liquid material" |
| 5 | How it works, etch paragraph | Wherever the photoresist pattern covers the wafer, nothing happens. | Wherever the photoresist covers the wafer, it shields the film beneath. | The resist is etched too, only more slowly. The chapter's own animation thins it during the etch step. | Lam Etch Essentials: Flex offers "high mask selectivity". `animations/dep-etch.html`: `erode = 1 - 0.3*ease(pEtch)` |
| 6 | Variants, ALD bullet | … lays down less than one atomic layer at a time, so it coats vertical walls as evenly as horizontal floors. | … lays down less than one atomic layer at a time. Each step stops once every surface is covered, so it coats vertical walls as evenly as horizontal floors. | Wrong cause. The even coat comes from the self-limiting steps, not from how thin each cycle is. | FR 2023-23049 p. 16: "The self-limiting nature of the processes and the related capacity for conformal deposition" |
| 7 | Variants, high-aspect-ratio etch | It says its Cryo 3.0 technology keeps the deviation in a channel's width from top to bottom under 0.1 percent, in channels up to 10 microns deep | It says its Cryo 3.0 technology can etch channels up to 10 microns deep whose width varies from top to bottom by less than 0.1 percent of their depth | **Technically wrong.** Lam measures the 0.1% against depth: 0.1% of 10 microns is 10 nm. Read as a share of the width, it overstates the precision about a hundredfold, since the channels are of order 100 nm wide (my estimate). | Lam release footnote: "Profile deviation calculated by maximum critical dimension minus minimum critical dimension divided by memory channel depth." |
| 8 | Variants, HBM bullet | BIS controls the tools that etch these holes at aspect ratios … of 10:1 or more and at rates above 7 microns a minute. | (same sentence) + "The control covers only tools that also keep the holes' depth even to within 2 percent across the wafer." (same citation) | The control has three conditions, and all must apply. The chapter gave two, so it described a wider control than BIS wrote. | FR 2024-28270 p. 32: "c.4. … TSV etch having all of the following: c.4.a. Silicon etch rate greater than 7 microns per minute; c.4.b. Within wafer (WIW) etch depth nonuniformity of less than or equal 2 percent; and c.4.c. … aspect ratio greater than or equal to 10:1" |
| 9 | Variants, backside power | Applied Materials expects it to add another $1 billion per 100,000 wafer starts a month to the wiring market it serves | In July 2024 Applied Materials said it expected backside power to add $1 billion to the market for its wiring tools, for every 100,000 wafers a month of new fab capacity | Simpler wording, now dated. "Greenfield" became "new fab capacity". "Another" was dropped because its first increment is not in the chapter. | Applied, 8 July 2024: "backside power delivery is expected to increase Applied's wiring opportunity by another $1 billion per 100K WSPM". Also: "per 100,000 wafer starts per month (100K WSPM) of greenfield capacity" |
| 10 | China and the controls, lead | China is the tool vendors' largest market, and Chinese toolmakers have gained share since 2019 ([CSET]). It bought $49.3 billion … and remained the biggest single market ([SEMI]). | China is the tool vendors' largest market, buying $49.3 billion of equipment in 2025, half a percent less than in 2024 ([SEMI]). | **The source does not say it.** CSET's article never calls China the largest market. The gains since 2019 stay two paragraphs down, with the same CSET citation. | CSET: "the dataset does not identify the location of each sale, so it cannot be used to assess regional markets". SEMI: "spending in China remained near record levels at $49.3 billion, down just 0.5%". Taiwan $31.5B, Korea $25.8B, other regions lower |
| 11 | TEL bullet | 34.1 percent of new equipment sales in the year to March 2026 | 34.1 percent of sales in the year to March 2026 | **Reverses this round's content-fix-a change.** The p. 27 footnote ("composition ratio of new equipment sales") does not fit the chart. Its bars are total net sales (¥2,443.5B, ¥2,431.5B). TEL's filed net sales by destination give the same 34.1 and 41.7. | TEL deck p. 5: "On the full-year basis in the fiscal year ended March 2026, proportion of sales in China was 34.1%." `data/exposure.json`: ¥832,555m of ¥2,443,533m (FY2026), ¥1,015,060m of ¥2,431,568m (FY2025) |
| 12 | Applied bullet | down from 35 percent | down from 35 percent a year earlier | States the comparison period. | Q3 FY2026 table: China "% of Total 28 % 35 %" (Q3 FY2026, Q3 FY2025) |
| 13 | AMEC | up 36.6 percent … on research | up 36.62 percent … on research and development | Figure as stated. 研发投入 is R&D. | AMEC, 1 Apr 2026: "营业收入达到123.85亿元，同比又增长约36.62%"; "研发投入37.44亿元，占年销售的30.2%" |
| 14 | Oct 2022 bullet | It also widened foreign-produced item rules for 28 Chinese entities already on the Entity List, … | It also extended US license rules to more foreign-made items bound for 28 Chinese entities on the Entity List, … | Plainer. "Foreign-produced item rules" is jargon. | FR 2022-21658 p. 1: "expands the scope of foreign-produced items subject to license requirements for twenty-eight existing entities on the Entity List that are located in China" |
| 15 | $253 million charge | Applied Materials took a $253 million charge … | In fiscal 2026 Applied Materials took a $253 million charge … | The figure had no date. | Q3 FY2026 release: "Legal settlement — — 253 —" (nine months to 26 July 2026). Note: "Charge of $253 million for settlement with the U.S. Commerce Department Bureau of Industry and Security to resolve a previously disclosed export controls compliance matter." |
| 16 | The chokepoint + Takeaways (same sentence twice) | … targets advanced atomic layer deposition tools and the extremely deep, narrow holes that HBM (high-bandwidth memory) and 3D memory need | … targets tools for advanced atomic layer deposition and for coating holes more than 200 times deeper than they are wide | The cited p. 33 says nothing about HBM. HBM's TSVs are controlled at 10:1 (p. 32), which is not "extremely deep" next to 200:1. | FR 2024-28270 p. 33: "d.18. … Atomic Layer Deposition (ALD) of molybdenum (Mo), ruthenium (Ru)"; "d.19. … deposit a conformal dielectric film … in features with aspect ratio greater than 200:1" |
| 17 | keyFacts (only the first two are published, in the walk) | AMEC "up 36.6% … rose 224%". TSV "at aspect ratios of 10:1 or greater with etch rates above 7 microns per minute". Lam "$23.23 billion, up 26% from $18.44 billion" | AMEC "up 36.62% … rose 224.23%". TSV adds "keep depth within 2% across the wafer". Lam "$23.233 billion, up from $18.436 billion in fiscal 2025" | Figures as stated. The 26% is not in the cited 8-K (the 10-K has "increased 26.0%"). | AMEC: "营收同比大幅增长约224.23%". 8-K table: $23,232,690 and $18,435,591 (thousands) |

Error count (14): items 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 15, 16 and 17. Simplified (3): items 9, 12 and 14. Sources replaced (2): items 2 and 10.

## Proposals for shared files (exact before → after)

**`data/glossary.json`**
1. **ALD** `plain`.
   - Before: "A way of coating a chip roughly one atomic layer at a time."
   - After: "A way of coating a chip a fraction of an atomic layer at a time."
   - Reason: growth per cycle is below one layer. FR 2023-23049 p. 16: "a fraction of a monolayer at a time". This also matches ch 6.
2. **deposition** `plain`.
   - Before: "Machines either knock atoms off a solid target so they land on the surface, or react gases at the surface so a film grows there."
   - After: "Machines knock atoms off a solid target so they land on the surface, react gases at the surface so a film grows there, or plate metal out of a liquid."
   - Reason: chip copper wiring is electroplated (ch 6 cites the CSET brief p. 39). ETO N45: "Electrochemical plating (ECP) tools use electrolysis to deposit materials."
3. **plasma** `why`.
   - Before: "Deposition and etch chambers are separate products built from similar vacuum, gas and radio-frequency parts. Export controls describe each tool by the process it is designed to run. An extreme ultraviolet source …"
   - After: "Export controls describe each tool by the process it is designed to run. An extreme ultraviolet source …" (rest unchanged).
   - Reason: content-fix-a cut the first sentence from ch 6 this round because no source states it. The claim is true in my experience, but no allowed source was found.
4. **coater/developer** `why`, only if the TEL replacement below is adopted.
   - Before: "Tokyo Electron's own results put its share of the market at 91 percent in 2025."
   - After: "Tokyo Electron held 92.6 percent of the market for these tools in 2025, by CSET's count."
   - Source: ETO N32.

**`dep-etch` animation** (`animations/dep-etch.html` STEPS[1].cap, and `media/dep-etch.json` step "Deposit"; animate.py writes the JSON from the HTML)
- Before: "A film a few atoms thick is laid over the whole wafer."
- After: "A thin film is laid over the whole wafer."
- Reason: same fix as change 1.
- All other steps match the revised chapter. The resist thins during "Etch", which fits change 5. The readout "Steps to make one chip / 1,000 to 1,500 / SIA estimate, 2025" matches SIA p. 2 and the `plain` paragraph.

**`data/bibliography.json`**
- Intel PowerVia PDF. Before: `"date": "2025-01-31"`. After: `"date": "2023-06-05"`.
- Reason: the document is dated "June 5, 2023", and 2025 is only its archive folder. The source list now shows "Intel · 31 January 2025".

**`data/flashcards.json`**: no change. All four cards and the takeaways match the chapter and its sources.

**Elsewhere (not mine).** Ch 17 carries the same "share of new equipment sales" wording for TEL's p. 27 (see change 11).

## Open owner decision: TEL market shares (Gartner)
I checked content-fix-a item 4 against the ETO data. **Every number in its table is correct**: N32 92.6, N103 23.4, N51 55.9, N41 15.5, N39 34.0, N44 50.8, N36 9.7, N49 19.1, N10 25.6 and N83 19.9.

**Does it say the same thing?** For five of the figure's seven bars, yes:

| Bar | TEL deck (Gartner) | CSET |
|---|---|---|
| Coater/developer | 91 | 92.6 |
| Dry etch | 23 | 23.4 |
| ALD | 15 | 15.5 |
| Cleaning | 20 | 19.1 (wet etch and cleaning) |
| Tube and low-pressure CVD | 38 | 34.0 (low-pressure CVD) |

Two bars do not map:
- **Oxidation/diffusion.** Gartner's 31 covers oxidation and diffusion furnaces only. CSET's 50.8 covers tube diffusion *and* deposition, so the two numbers are not comparable.
- **"Deposition (furnace, ALD, LPCVD)".** Gartner's 27 has no CSET equivalent. CSET's all-deposition 9.7 must not stand in for it, because it says something different: TEL is fourth in deposition overall.

**My view: adopt the CSET version.** It ends the reliance on Gartner, uses the dataset behind the rest of the chapter, and removes two dry-etch figures (23.4 and 23) in consecutive sentences. Drop the 27% bundle. Label the furnace bar "Tube furnaces (diffusion and deposition)". Add dielectric etch at 55.9, TEL's leading etch share, which is already on the card. Ready text:
- **Body**, replacing the two p. 28 sentences: "By the same count, Tokyo Electron held 15.5 percent of atomic layer deposition tools ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41)). It held 50.8 percent of tube furnaces, which diffuse dopants into wafers or coat them in batches ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N44)). It also held 92.6 percent of resist processing tools, or coater/developers ([source](https://chipexplorer.eto.tech/?parentNode=N25&selectedNode=N32))." Keep the next sentence, "These machines coat wafers …".
- **Figure** `tel-tool-share` data: `[["Resist processing (coater/developer)", 92.6], ["Dielectric etch", 55.9], ["Tube furnaces (diffusion and deposition)", 50.8], ["Low-pressure CVD", 34.0], ["Dry etch", 23.4], ["Wet etch and cleaning", 19.1], ["ALD", 15.5]]`. Source: `{"label": "CSET analysis of TechInsights data (published July 2026), ETO Chip Explorer", "url": "https://chipexplorer.eto.tech/?parentNode=N25&selectedNode=N32"}`.
- **keyFacts[3]**: "By CSET's count, Tokyo Electron held 92.6% of resist processing tools (coater/developers) in 2025", source N32.
- **Glossary**: proposal 4 above.

## New bibliography entries (only if the TEL replacement is adopted)
```json
{
  "https://chipexplorer.eto.tech/?parentNode=N25&selectedNode=N32": {"title": "Supply Chain Explorer: Advanced Chips", "publisher": "Emerging Technology Observatory (ETO)", "type": "page", "accessed": "2026-10-20"},
  "https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N44": {"title": "Supply Chain Explorer: Advanced Chips", "publisher": "Emerging Technology Observatory (ETO)", "type": "page", "accessed": "2026-10-20"}
}
```
None is needed for the changes made: FR 2024-28270 is already listed, and the new citation only adds `#page=17`.

## Newer figures (listed only; text unchanged because the chapter's figures are the latest full-year ones)
- **TEL, quarter to June 2026** (FY2027 Q1 deck, 30 July 2026, p. 6): China ¥222.9B of ¥732.3B net sales, shown as 30.4%.
- **Lam FY2026 10-K** (filed 7 Aug 2026): China "approximately 34%, 34%, and 42% of our total revenue for fiscal years 2026, 2025, and 2024". The chapter's bullet gives the June 2026 quarter, 26%.
- **Lam 10-K**: "Fiscal year 2026 revenue increased 26.0%".
- **TEL TELINDY page**: now also lists EVAROS at "up to 200 wafers (300 mm) per batch". The chapter's 125 is still right for TELINDY PLUS.
- **Not yet published** (as of 20 Oct, checked on EDGAR): Lam's September 2026 quarter, Applied's Q4 FY2026 and ASM's Q3 2026.

## Links
- **Broken or error**: none in ch 6.
- **AMEC 708** returns 200 again. It is AMEC's 1 April 2026 results briefing and states every figure cited (change 13).
- **SEMI** is still blocked (403). The Wayback copy is the 7 April 2026 release, and every SEMI figure matches.
- **GlobeNewswire (both) and sec.gov** read fine with the generic User-Agent.
- **ETO** URLs are all "ok" and the figures match the open data.

## Questions for the owner
1. **TEL Gartner figures.** Adopt the CSET replacement above? I recommend yes.
2. **Dry strip leader.** CSET has Kokusai at 35.7%, Mattson 22.6% and PSK 2.2% (ETO N53). PSK's own site says its SUPRA dry strip line has "the greatest market share worldwide". That also fits my experience: PSK leads dry strip, and Kokusai is not known for it. The China point (Mattson plus Naura) does not need the Kokusai number. Options: cut "Kokusai held 35.7 percent of it," and keep Mattson and Naura, or keep the sentence as is. The 31% China bar may share the same data problem. I left the text unchanged.
3. **Lam China share.** The bullet uses one quarter (26%) while TEL and ASM use full years. Switch to Lam's fiscal 2026 figure ("approximately 34%", 10-K)? That would need a new citation.
4. **Border-crossing paragraph.** The "70 or more times" paragraph in How it works is not about deposition or etch. Keep it or move it?
5. **Ch 17.** It needs the same correction as change 11.

## Checks (final run, after the last edit)
- Build: `node build/build.js` exit 0 ("06 deposition-and-etch: 2032 words, 44 sources (D 0, ? 0), 4 figures").
- `check-speak`: no matches.
- `check-integrity`: only the known "exposure row for Veeco Instruments has no supplier entry".
- `check-sources`: "2472 citations, all tier A or B".
- Own validator: front matter parses, and `plain` equals its twin.
- Screenshots: `before-interactive-tel-light.png` and `after-static-plain-mobile-light.png`.
