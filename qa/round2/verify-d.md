# Verification of the expert edits to chapters 11, 12 and 13 (verify-d, 20 October 2026)

I opened every source myself and did not rely on the experts' copies. My downloads are in `qa/round2/scratch/verify-d/` and my notes are in `qa/round2/verify-d-notes.md`. TSMC transcripts came from raw Wayback captures: 2Q24 `20241010202549id_` (19 pp.), 3Q25 `20260215031105id_` (18 pp.) and 2Q26 `2026id_` (22 pp.). The JEDEC release came from `20260720165553id_` and the Nikkei articles from `20260114035447id_` and `20260701041751id_`. SEC filings were fetched with the research User-Agent, five seconds apart. I edited only the three chapter files.

| Chapter | Expert changes | Confirmed | Fixed | Unverifiable |
|---|---|---|---|---|
| 11 Advanced Packaging | 12 | 11 | 1 | 0 |
| 12 Substrates and PCBs | 9 | 8 | 1 | 0 |
| 13 Test and Assembly | 20 | 20 | 0 | 0 |

I also made 4 consistency edits in chapter 13 so that its top-ten ranking agrees with chapter 11. The inherited-numbers sweep added 7 attributions (3 in chapter 11, 4 in chapter 13).

## Chapter 11

- **1, 11 (removals).** Confirmed. They remove a wrong step ("thin") and a computed area.
- **2 (36 microns).** The figure is confirmed: Intel brief p. 3 has "Foveros (S/R) 2.5D: Side-by-side die placement with 36 µm microbump interconnects". **Fixed** the scale comparison: "about a third of a hair's width" became "less than half a hair's width". Chapter 12 cites Ajinomoto for "a human hair is about 80 micrometers in diameter", and 36 is close to half of 80.
- **3.** Confirmed. Epoch B200 page: "When packaging fails, the logic die and HBM stacks for that package cannot be recovered."
- **4.** Confirmed. Intel brief p. 3: "EMIB 2.5D: The industry's first 2.5D interconnect solution using bridges embedded in the substrate."
- **5.** Confirmed (a wording change to an uncited sentence).
- **6.** Confirmed. JEDEC, 13 July 2026: "the same aggregate data throughput as HBM4 using fewer pins by operating at a higher frequency ... 512 data signals with 4:1 serialization to achieve the same bandwidth."
- **7 (Wei, July 2024).** Confirmed. All three quotes are on PDF p. 6: "it's out of my mind", "I also tried to reach the supply and demand balance, but I cannot today", and "this year, I doubled, right? More than double ... Next year, it's more than double." Page 13 restates the doubling. The 60 percent figure is also on p. 6, in the IR director's summary.
- **8.** Confirmed. 3Q25 p. 7: "all I can say is ... The real number, we probably update you".
- **9.** Confirmed. 2Q26 p. 10: "our packaging capacity is so tight that now it limits my customers' growth". 2Q26 p. 17: "since our capacity in the backend is still in shortage mode".
- **10 (TrendForce).** Confirmed. CSET's footnote 14 is LaPedus's newsletter of 13 May 2025, which gives the 2024 ranking "according to TrendForce". The four Chinese firms in it are JCET, Tongfu, HT-Tech and WiseRoad.
- **12.** Confirmed. CSET: "(+10 pp) ... (+3 pp) ... (-2 pp) ... (-2 pp)".

## Chapter 12

- **1, 2.** Confirmed. Nittobo p. 17: "thermal expansion and warping". Nittobo p. 5: "approximately JPY 80 billion in capital expenditures over four years". Nittobo p. 4: "about two to three times".
- **3.** Confirmed. Nikkei Asia's article is dated 14 January 2026 (JST), with the headline "Apple and Qualcomm fret over strained supplies of Japan's glass cloth".
- **4.** **Fixed.** The date is right (1 July 2026, 04:44 JST), but the article body credits the figure to SEMI: "The global chip material market in 2025 was $73.2 billion, up 7% from the previous year, according to chip industry association SEMI." The sentence now reads "...competing with Japanese rivals for a market that the industry association SEMI put at $73.2 billion in 2025". Chapter 3 cites SEMI's own release for the same $73.2 billion.
- **5, 9.** Confirmed. 100-day review p. 43: "Suppliers for substrates are based in Asia". Ibiden Q&A of May 2026: "constraints such as human resources and lead time".
- **6.** Confirmed. AT&S p. 67: "a globally leading manufacturer of high-end IC substrates". AT&S p. 53 names Chongqing I and III, gives Kulim's first line, and says of Leoben: "Series production commenced in the financial year 2025/26".
- **7.** Confirmed. Shinko: "the flip-chip type package, is an advanced package substrate".
- **8.** Confirmed. TTM 10-K: "approximately $2.9 billion in net sales". It also gives "Data Center Computing 24 20 14".

## Chapter 13

All 20 changes are confirmed.

- **Advantest guide, July 2026, p. 12** (changes 1 and 3): "Changing a tester platform is essentially equivalent to rebuilding the entire environment for device development, evaluation, and mass production, resulting in significant additional costs for the customer."
- **Dropped line** (changes 1 and 3): the April 2025 guide (p. 14) says "unlikely to fluctuate significantly". The July 2026 guide does not contain that line.
- **Advantest shares:** on the FY2025 note's p. 13 they are Advantest's own estimates (the Japanese reads 試算, "we estimate"). The share charts in both guides are labeled "Source: Advantest", so no research firm is involved.
- **ASE 20-F** (changes 2, 4 and 8): "We generally seek to purchase testers from different suppliers with similar functionality ... primarily Teradyne, Inc., Tokyo Electron Limited, and Advantest Corporation". It also says "Handlers attach to testers and transport individual packaged semiconductors".
- **Aehr, July 2026** (change 5): "shifting their burn-in from system-level to all wafer-level".
- **Aehr, August 2026** (change 6): "reducing the risk of committing high-value HBM, substrates, interposers ...".
- **CSET prober shares** (change 7): I checked them in ETO's data file `provision.csv`, where node N83 "Handlers and probers" is "$2.9 billion (2025)", with Tokyo Electron at 19.9 and Accretech at 17.1. Accretech p. 6 says "(based on our research)".
- **Disco** (change 9): "workpieces up to 400 x 400 mm".
- **FormFactor** (change 10): 637,898 of 784,993 ($ thousands), and "record annual revenue of $785.0 million".
- **MIDA, 1 July 2026** (changes 11 and 12): "five local champions" and "To enable the nation to capture 7%".
- **Amkor** (changes 13 and 14): "planned investment ... $7 billion across two phases".
- **Page numbers** (changes 16 and 19): the SIA testimony (11 pp.) has the step count on p. 2, and Technoprobe's release (11 pp.) has its figures on p. 1.
- **Cohu and K&S** (changes 17 and 18): $453.0 million and $654.1 million.
- **ETO N120 and N71** (change 20): $9.1 billion with 62.7, 21.8, 63.0 and 23.5. $1.9 billion with 87.0 and 8.1.

Consistency edits. Chapter 13 now credits the ranking to TrendForce, as chapter 11 does:

- The card's CN note now ends "..., in a TrendForce ranking cited by CSET".
- keyFact 10 now ends "..., in a TrendForce ranking cited by CSET".
- Geography: "CSET counts four of the top ten OSATs by 2024 revenue as headquartered in China" became "In a TrendForce ranking that CSET cites, four of the top ten OSATs by 2024 revenue are headquartered in China".
- Takeaways now open "In a TrendForce ranking cited by CSET, four of the ten largest...".

## Inherited numbers (sweep across all three chapters)

CSET's article says its share figures are "CSET's analysis of TechInsights' Chip Market Research Services Equipment Database". These sentences did not say so, and I added the attribution:

- **Chapter 11, card `chinaStatus`, first sentence:** added ", by CSET's analysis of TechInsights data".
- **Chapter 11, The chokepoint, sentence on the 5 and 4 points:** added the same.
- **Chapter 11, Takeaways, sentence on the 7 and 65 percent:** added the same.
- **Chapter 13, card `chinaStatus`:** now opens "Georgetown's CSET, analyzing TechInsights data, finds that...". I used "Georgetown's CSET" in place of "CSET at Georgetown" to keep the sentence at 32 words.
- **Chapter 13, The chokepoint:** "CSET finds" became "CSET, analyzing TechInsights data, finds".
- **Chapter 13, Takeaways:** "Georgetown's CSET finds" became "Georgetown's CSET, analyzing TechInsights data, finds".
- **Chapter 13, card leader Disco:** "on CSET's analysis" became "on CSET's analysis of TechInsights data". This matches `data/suppliers.json`.

These already named both firms:

- ETO and TechInsights: Disco in chapter 11; chapter 13 lines 116, 123 and 125, plus `usStatus` and `test`.
- SemiWiki and TrendForce via Epoch AI, in the chapter 11 body and keyFact.
- Prismark via AT&S, in the chapter 12 body and `costSignal`.
- TrendForce via CSET, everywhere in chapter 11.

The later figure sentences in chapter 11's chokepoint paragraph (10, 3 and 2 points, and 7, 65 and 15 percent) rely on the paragraph's opening attribution, as chapters 6 and 7 do.

These are the firms' own figures: Advantest, ASMPT (its own TAM), MGC ("MGC estimate"), Ajinomoto, Ibiden, Accretech, and Epoch's CoWoS shares.

## For the owner (not edited)

1. The SIA/BCG exhibits mix in IHS data. Exhibit 11 (chapter 12's substrate vendor counts) lists "SEMI; IHS; BCG analysis". Exhibit 13 (chapter 13's Malaysia 7 percent, body and keyFact) lists "US Department of State; The White House; SEMI; IHS; BCG analysis". These are BCG's own analysis, so I left them. "drawing partly on IHS data" could be added.
2. These files are outside my scope but should match:
   - `data/glossary.json`, microbump: "about a third of a hair's width" should become "less than half a hair's width".
   - `data/glossary.json` lines 482 and 846, and `data/flashcards.json` lines 433 and 441, carry the top-ten ranking with no TrendForce note.
   - The label of chapter 11's `china-backend-tools` figure could read "CSET analysis of TechInsights data", as chapter 6's labels do.
3. `data/chokepoint-matrix-notes.md` says the matrix dropped this same top-ten ranking because it was a market-research count. Both experts asked whether to drop it from the chapters as well.
4. This tension was already in chapter 11 before this round and is uncited: "3D designs often put cache memory underneath". The same chapter says SoIC (2022) stacks SRAM on logic.

## Checks (after the last edit)
- `node build/build.js`: exit 0. "source tiers: A 610 · B 30 · disallowed 0 · unclassified 0". It reports no warnings for chapters 11 to 13.
- `check-speak`: "no matches".
- `check-integrity`: only the known Veeco line.
- `check-sources`: "2516 citations, all tier A or B".
- My own checks pass for all three files: `plain` equals the first How it works paragraph, every card URL is cited in the body, no sentence carries two citations, and there are no semicolons or em dashes in the body.
