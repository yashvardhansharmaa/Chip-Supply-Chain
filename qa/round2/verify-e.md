# verify-e: fact-check of the expert edits to chapters 9, 14 and 15 (20 October 2026)

Every row in the three expert tables was checked against its source: the expert's copy, or a live or Wayback copy when the expert's copy was missing or doubtful. Downloads are in `qa/round2/scratch/verify-e/` and notes in `qa/round2/verify-e-notes.md`. Only the three chapter files were edited, all with the Edit tool.

## Counts

| Chapter | Expert changes | Confirmed | Fixed | Unverifiable |
|---|---|---|---|---|
| 9 Foundries and Fabs | 11 | 10 | 1 | 0 |
| 14 Systems and Networking | 20 | 18 | 2 | 0 |
| 15 Data Centers and Power | 18 | 17 | 1 | 0 |

Outside the expert tables, three more fixes were made: the ch 14 card `testSources[0]`, a ch 15 keyFact, and an attribution in ch 9.

## Fixes

### Ch 9, expert row 1 (World Fab Forecast edition): the expert's change was wrong and is reverted
- Before: "In the second-quarter 2026 update of its World Fab Forecast, SEMI projected…"
- After: "In the third-quarter 2026 update of its World Fab Forecast, SEMI projected…"
- Source: Wayback capture of 17 October 2026 (`web.archive.org/web/20261017080436id_/https://www.semi.org/en/products-services/market-data/world-fab-forecast`; the expert's CDX check stopped at 7 October). It reads: "World Fab Forecast Report (2025 to 2027) 3Q26 Update" and "China is projected to maintain the world's largest installed capacity in both 2026 and 2027." Copy: `scratch/verify-e/semi-wff-20261017.txt`.
- Knock-on: the expert's flashcard proposal 3 (card 4, "third-quarter" → "second-quarter") should be dropped. `data/flashcards.json` already says third-quarter, so it is correct as it stands.

### Ch 14, expert row 13 (Foxconn)
- Before: "…up 18 percent, and in the fourth quarter cloud and networking became its largest product category for the first time"
- After: "…up 18 percent, and cloud and networking was its largest product category in the fourth quarter"
- Why: the 16 March 2026 release says cloud and networking surpassed consumer electronics "for the first time even during the traditional peak season for ICT products". Hon Hai's 3Q25 call transcript (image.honhai.com, 12 Nov 2025, p. 2) shows the segment at 41 percent in 2Q25 and 42 percent in 3Q25, with "This remains our largest revenue contributor". So the fourth quarter was not the first time it was the largest.

### Ch 14, expert row 17 (circuit boards)
- Before: "TTM Technologies … says its competitors are mostly based in China and Taiwan"
- After: "…says its circuit board competitors are mostly based in China and Taiwan"
- Source: TTM 10-K FY2025: "For PCBs, our competitors are mostly based in China and Taiwan. For engineered products … largely based in the U.S. and Europe." The new wording matches ch 12. The Nittobo sentence is confirmed: p. 7 has "NE-glass is used in switches and routers in supercomputers and data centers", p. 3 says the glass has low dielectric loss, and p. 17 says it goes into motherboards for servers and switches.

### Ch 14 card, `substitutability.testSources[0]` (not an expert change)
- Before: the NVLink Fusion release. After: the Nvidia 10-K FY2026 (`nvda-20260125.htm`).
- Why: the card fact "NVLink and its NVSwitch chips, which Nvidia controls" is cited in the body to the 10-K ("Our networking offerings include NVLink interconnects and switches"). The Fusion release never mentions NVSwitch.

### Ch 15, expert row 4 (800 volts)
- Before: "Nvidia says that at 800 volts the same copper carries over 150 percent more power than in a traditional 415- or 480-volt alternating current system ([OCP blog])."
- After: "Nvidia said in October 2025 that at 800 volts the same wire can carry 157 percent more power than at 415 volts of alternating current ([source](https://developer.nvidia.com/blog/building-the-800-vdc-ecosystem-for-efficient-scalable-ai-factories/))."
- Why: in the OCP blog, the "Over 150% more power is transmitted through the same copper" sentence follows the 54 VDC sentence, not the 415/480 VAC one. That blog never states the comparison. The companion blog (13 Oct 2025, live 200) does: "With 800 VDC, the same wire gauge can carry 157% more power than 415 VAC." The second half of the row is confirmed live from the 800 VDC blog: "Today's NVIDIA GB200 NVL72 or NVIDIA GB300 NVL72 … 54 VDC" and "a single 1 MW rack requires up to 200 kg of copper busbar". This is a new source, and its bibliography entry is in the notes file.

### Ch 15 keyFact 5 (not an expert change)
- Added ", the sum of Epoch AI's quarterly figures" after $448.2B, to match the expert's body disclosure. The CSV re-adds to 448,232 $M.

### Ch 9, Epoch sentence (inherited-numbers check)
- Before: "In 2025 the four largest AI chip designers used around 90 percent…" After: "Epoch AI estimated that in 2025 the four largest AI chip designers used around 90 percent…"
- Why: this is Epoch's model output. Its CoWoS denominator comes from "SemiWiki and TrendForce" benchmarks, and `chokepoint-matrix.json` calls it relayed. Ch 11 names Epoch for the same figure.

## Confirmed, with notes
- Ch 9: the SIA step count is on PDF p. 2 of 11 ("between 1,000 and 1,500 steps … depending on the complexity of the chip"). TSMC's deposits are in the 20-F, note 22c ($291,101.8 and $189,858.2, NT$ millions). The Intel 2018 cleanroom quote was found verbatim on live intc.com. The TSMC plans in Phoenix, the Poland site being assembly and test, the FOUP spelling-out and the card line all check out.
- Ch 14: Coherent's release is dated 16 June 2026 and says the ceremony was "to be held later today", and Nvidia's post of 1 July says Coherent "broke ground this month", so June stands. The 9x figure is in SemiAnalysis, 1 Jan 2026, verbatim. Every card URL is cited in the body, and the build gives no ch 14 card warning.
- Ch 15: the Stargate wording, the LBNL pages 10 and 11 (PDF downloaded, 36 pp), the Epoch CSV, the GE Vernova release (22 Jul 2026), and Hitachi Energy and ABB all check out.

## Inherited numbers
None of the three chapters has a figure that a Tier A document attributes to a market-research firm. The one borderline case is the Epoch estimate above. DOE's figures on transformer lead times come from interviews with producers, and USITC's 29.2 percent comes from its own questionnaires.

## Checks
`node build/build.js`: ok (09: 35 sources, 14: 42, 15: 32). check-speak: no matches. check-integrity: only the known Veeco warning. check-sources: 2516 citations, all tier A or B.
