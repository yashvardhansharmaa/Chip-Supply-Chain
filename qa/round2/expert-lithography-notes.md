# expert-lithography: progress notes (20 Oct 2026)

STATUS: done. 13 edits in content/04-lithography.md, build and four checks clean (outputs in scratch/expert-lithography/checks/). Full report with every before/after, shared-file proposals and open questions: qa/round2/expert-lithography.md.

Downloads: qa/round2/scratch/expert-lithography/<name>/raw (+ text.txt, p-N.txt for PDFs).
Note: another agent overwrote a shared scratchpad script; seven of my downloads briefly landed in scratch/expert-chemicals-gases-and-photoresist/ and were moved back to my folder (their own folders untouched).

## Verified (source opened, figure found)
- ASML AR 2025 financial section p5: 327 litho units (2024: 418), 48 EUV (44), EUR 32.7bn, 52.8%. p7: "four EXE and 44 NXE systems in sales in 2025 compared to two EXE and 42 NXE systems in 2024"; DUV units 374 -> 279.
- Strategic report p16: only EUV maker; one exposure per layer cuts masks/steps; EXE in HVM 2027; EXE:5200B 175 wph, 60% over EXE:5000. p17: NXE:3800E 220 wph, 37% over NXE:3600D; "ArF immersion lithography maintains a thin layer of water between the lens and the wafer, increasing NA"; ~95% of systems sold in 30 years still in use. p30: "demonstrating the first ever 1,000-watt light source" April 2025.
- Q4 2025 deck p9 (rendered): units EUV 48, ArFi 131, ArF dry 16, KrF 78, i-line 54; tech shares and region shares match both stack figures; China 41% (2024).
- Q2 2026 PR (dateline 15 July 2026; bibliography says 2026-07-14): EUR 43-45bn, 54-56%; low-NA EUV capacity ~65 in 2026, +30% for 2027.
- Q3 2026 PR, 6-K on sec.gov (14 Oct 2026): FY2026 EUR 44-45bn, GM ~56%; supply for 2027 and 2028 will not fully meet demand; investigating 2028 beyond +30%.
- 20-F (sec.gov htm): 5,100 suppliers; Zeiss capacity limit + sole optics supplier; service "until at least the committed date, subject to export control limitations"; EU Control List Nov 2025, no change for ASML; "export licenses for EUV systems, specific DUV immersion systems".
- asml.com pages: mirrors (1 m, tens of pm; immersion NA 1.35); light (14x; 220 nm i-line; 50,000/s; two pulses); NXT:2150i (193 nm, <=38 nm, 1.35 NA, >=310 wph); NXE:3400B (96 shots, 26x33 mm max field, MMO 2 nm, SMASH alignment); EUV page (absorbed by everything even air; mirrors; reflective reticles); DUV page (workhorses); 5 things (NA 0.33 -> 0.55, 13 -> 8 nm, 4x/8x, half field); San Diego (Cymer independently operated, acquired 2013; EUV source design, droplet generator); 6 steps story (positive/negative resist, etch, implant, "dozens of layers").
- SEC 2017 PR: first NXE:3400B shipped late Q1 / early Q2 2017. Photronics 10-K: mask-set sentence verbatim.
- Intel 7 Sep 2026: 18A select layers, Panther Lake, >1 million wafers incl. testing/R&D; "6x12-inch masks". ASML PR 15 Jul 2026 (Wayback): Intel first to install and pass acceptance of EXE:5200B.
- TSMC PR 8 Sep 2026 (Wayback): 6-inch now, 12-inch masks; HVM from 2030; layers rise "driven primarily by the increasingly complex transistor architectures required for AI applications"; pilot line 2031; "12-inch High-NA lithography systems" 2033.
- ASML revocation statement 1 Jan 2024 (Wayback 20240102030803): NXT:2050i, NXT:2100i, "small number of customers in China".
- gov.nl 2024/09/06 and 2025/01/15: dates check out; no model names.
- CSIS 24 Sep 2025: "blocking ASML from shipping EUV systems to Chinese foundries"; "firmly out of reach despite massive state investment"; SMEE "only four percent"; "$43 billion into domestic EUV lithography development" (glossary). Nothing on Huawei 2026 mass production.
- Reuters 17 Dec 2025 (Wayback 20251217170949 = 200): EUV light, no working chips; former ASML engineers; Shenzhen; "size of a school bus, and weigh 180 tons"; optics are the lag.

## Reuters price explainer (owner decision)
All Wayback captures (Jul-Sep 2026) are 401 DataDome pages; searches find only the January version ($250 million). Not verifiable.

## Issues found so far (to fix or report)
- plain + body: "several times narrower than its light's wavelength" false for EUV (13 nm at 13.5 nm).
- "Four of them make the main parts" includes ASML San Diego, which is ASML, not a supplier.
- "12-inch High-NA systems" reads as wafer size.
- "ran the first 1,000-watt EUV source" -> source says demonstrated.
- 26 x 33 mm sentence uncited (NXE:3400B page has it).
- Two DUV-immersion sentences uncited (20-F supports the licensing one).
- "Claims of Huawei mass production in 2026 remain unverified." uncited, published version too.
- Glossary immersion: "the same lens prints finer lines" is wrong physics.
