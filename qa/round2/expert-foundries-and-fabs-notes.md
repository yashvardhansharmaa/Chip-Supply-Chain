# expert-foundries-and-fabs progress notes (20 October 2026)

Working file only; the report is qa/round2/expert-foundries-and-fabs.md.

## Read
- EXPERT-BRIEF, RULES, SCHEMA, writing-well; chapter 9; flashcards; 11 glossary entries; fab-loop json, both anim notes; contact sheet (scratch/expert-foundries-and-fabs/sheet-light.png).
- Notes from content-fix-a, content-fix-c, cards-b, pages-b, INTEGRATION.

## Suspects to check (expert reading, before opening sources)
1. Panther Lake HVM "using ASML's High-NA EUV scanners" (Intel 18A uses 0.33 NA EUV; High-NA is for 14A). Check Intel 2Q26 release.
2. "hundreds of steps" (body) vs "1,000 to 1,500 steps" (animation), same SIA testimony.
3. Card TSMC share "77% of wafer revenue from 7 nm and below" reads as a market share.
4. bridge "rent time"; body "rent out capacity" (customers buy wafers).
5. Intel "fab plans ... Germany and Poland" (Poland was assembly and test).
6. plain: "A foundry is a chip factory" (a foundry is a company); "No chip company sells enough of one product to fill such a factory" (memory makers, Intel fill their own).
7. Tool job list omits polishing (CMP) and implant; colon list reads as exhaustive.
8. FOUP caption dimensions unsourced.
9. TSMC 3Q26 results (likely 16 Oct 2026) may supersede 2Q26 figures: list only.
10. phoenix.gov vs TSMC primary release for July 2026 $100B.
11. SEMI World Fab Forecast product page as a source for the 3Q26 projection.

## Findings
- Intel 2Q26 release (23 Jul 2026): Foundry rev $5,765M, op loss (2,089); "entered high-volume manufacturing for a subset of ... Panther Lake, using ASML's EXE High NA EUV technology" -> suspect 1 is SUPPORTED; "Intel 18A-P entered risk production". OK.
- Intel 10-Q 2Q26: external $293M ("primarily due to Altera's transition to an external customer"); "substantially all of our Intel Foundry business supports internal manufacturing for Intel Products". OK.
- Intel deal release 22 Aug 2025: all terms OK. 10-K 2025: closing 27 Aug 2025; "one of our largest stockholders"; "discontinued planned expansions in Germany (fab) and Poland (assembly and test)" -> fix "fab plans".
- TSMC 2Q26 (16 Jul 2026) OK: $40.20B, 67.7%, 3/30/33/11, 77%. 3Q26 (15 Oct 2026, 6-K 0001046179-26-000726, a3q26e_withguidancexfinal.htm): $46.72B, GM 66.4%, 2nm 8, 3nm 33, 5nm 28, 7nm 10, advanced 79%. List only.
- TSMC 20-F 2025 note 22c: temporary receipts NT$291,101.8M (2024) -> NT$189,858.2M (2025); chapter rounds to 189.9/291.1 billion -> rule break, fix.
- tsmc.com gigafab (Wayback 2 Oct 2026): six GIGAFABs Fab 12/14/15/18/20/22; >13M 12-inch eq in 2025; table Giga >100K monthly 300mm. fab_capacity (12 Oct 2026): >17M; 6 giga + four 8-inch + one 6-inch all in Taiwan; Nanjing, Arizona 12-inch; JASM; Washington, China 8-inch. OK. profile: 1987, pioneered pure-play. OK.
- pr 3210 (4 Mar 2025): "intention to expand ... by an additional $100 billion" (plan) -> body "added" overstates. phoenix.gov (16 Jul 2026): "announcing plans to invest an additional $100 billion to build four more 2-nanometer or more advanced fabs ... total investment in Arizona to $265 billion — representing 12 facilities". TSMC own release unreachable (Cloudflare; not in Wayback; CDX offline).
- SIA Senate Finance 14 May 2025 p1-2: "hundreds of steps to produce a single wafer ... and ultimately between 1,000 and 1,500 steps to turn the silicon into the final packaged semiconductor, depending on the complexity of the chip" (the 1,000-1,500 is on PDF p2).
- SIA blog 26 Feb 2021: "up to 1,400 process steps ... of just the semiconductor wafers alone"; "takes about 12 weeks on average but can take up to 14-20 weeks for advanced processes". -> "hundreds of steps" per wafer is technically misleading for leading edge.
- SMIC 26 Mar 2026 OK (9,327; 16.2%; 21.0%/21%; 93.5%; >1M std logic 8-inch eq). Rapidus 27 Feb 2026 OK (267.6bn yen; 167.6bn from 32 companies; by 2027). NIST 20 Dec 2024 OK. Samsung Taylor page OK ($17B min; $6B + $11B; 2022 groundbreaking). BCG 2023 OK ("$35 billion to $43 billion—33% to 66% higher than today's costs"; 2nm to sub-2nm). Epoch OK (around 90%, 12%; NVIDIA, Google, AMD, Amazon; advanced = 3-5nm).
- CSET 17 Jun 2024 OK ("believed to be fabricated on SMIC's 7nm (N+2) process"; "forcing Huawei to decide between ... smartphone chips ... or its AI chips").
- SemiAnalysis 16 Apr 2025 OK ("vast majority of Ascend 910B and 910C are made with TSMC's 7nm"; "purchasing ~$500 million of 7nm wafers through another company, Sophgo"). 14 Jun 2026 SMIC N+3 OK ("Without EUV, SMIC is leaning harder on DUV multi-patterning"; N+2, N+3 7 nm-class). 1 Dec 2025 OK ("over 90% of global advanced-node capacity"; "a foundry needs highly skilled engineers"; "labor availability ... remain major challenges").
- Entegris A300 datasheet (3 pp., 2021): 25-capacity; shell "Ultrapure polycarbonate (PC)"; colors include clear; Width 426, Depth 355, Height 338 mm (drawing: 426.0 across handles, 355.5, 339.2/338.2). Caption's 388x342x332 is foup.js shell w/o handles (420 with), unsourced.
- SIA/BCG May 2024: p4 "$2.3 trillion ... 2024–2032"; p13 "almost 100% distributed between South Korea and Taiwan in 2022"; "did not produce any advanced logic chips"; p14 Exhibit 6 TW 69, KR 31, US 0; 2032F US 28; p30 China logic at or older than 28 nm. OK.
- SEMI 18 Jun 2024 (Wayback 20240621): 33.7M wpm 8-inch eq 2025; China 10.1, TW 5.8, KR 5.4, JP 4.7, Americas 3.2, Europe & Mideast 2.7, SE Asia 1.8; "Fueled largely by Intel's establishment of its foundry business and China's capacity expansion". OK.
- SEMI 7 Jan 2025 (Wayback 20250906): foundry 11.3 -> record 12.6M wpm, "**200mm equivalent". Also 7nm and below 2.2M wpm of 33.6M total in 2025.
- SEMI WFF page (Wayback 20260807, latest real capture; Oct 2026 captures are 301s back to it): "World Fab Forecast Report (2025 to 2027) 2Q26 Update"; "China is projected to maintain the largest installed capacity volume in both 2026 and 2027." Web search: current edition Q2 2026, no 3Q26. -> chapter "third-quarter 2026 update" WRONG -> second-quarter. Flashcard too.
- SIA EPW 4 Mar 2026 p3 OK. TSMC pr 3204 (10 Feb 2025) OK: 6.4 quake 21 Jan; "A certain number of wafers in process were impacted and had to be scrapped".
