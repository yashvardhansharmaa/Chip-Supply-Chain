# CHOKEPOINTS — fact-check and consistency report

Pass run September 2026 over `content/01` to `content/17`. Chapter 18 (Geopolitics) appeared mid-pass as a
self-labelled empty draft skeleton and was left untouched; see "Unresolved".

35 edits across 11 files. Front matter for every edited file re-validated with
`node -e "JSON.parse(require('fs').readFileSync(0,'utf8'))"`. `node build/build.js` runs clean: warnings fell
from 17 to 10, all of them the expected `specimen ... is not built yet` class, none new.

---

## (a) Conflicts found and resolved

| # | Topic | Chapters | Conflicting values | Resolution |
|---|---|---|---|---|
| 1 | Hyperscaler capex, 2025, five firms | 01 vs 16 | $448.2B (Epoch AI) vs "about $380B" (Futurum) | **Epoch wins.** Its page carries quarterly capex per firm; the four quarters sum to exactly $448,232M for Alphabet, Amazon, Meta, Microsoft, Oracle. 2022/2023/2024 sum to $162.3B/$161.3B/$260.4B, matching ch01's figure to the decimal. Ch16's comparator was replaced with $448.2B and cited to Epoch; the unsupported "$380B" was removed from its keyFact. |
| 2 | Hyperscaler capex, scope | 01, 16 vs 17 | $770B 2026 trend / $660-690B 2026 guidance vs $492B 2025 and $1.009T 2026 | **Not a numeric conflict, a definition conflict.** The 24/7 Wall St figures are UBS's, and UBS's "hyperscaler" set includes neoclouds, SpaceX and CoreWeave. Ch17 now says so explicitly, in the keyFact, the body and the figure label, and cross-references the five-firm $448.2B. |
| 3 | Amkor Arizona plant | 12 vs 14 | $2B vs $7B | **$7B wins.** Amkor's original plan was $2B on 56 acres; the October 2025 groundbreaking followed a relocation to Peoria Innovation Core, 104 acres, with a further $5B. Ch12 was $2B paired with the post-relocation 104-acre figure. Fixed in ch12's card and body, with the relocation stated and the TrendForce groundbreaking piece cited alongside the existing source. |
| 4 | Low-NA EUV tool price | 05 vs 10 | ~$250M vs ~$200M | **$250M wins.** Ch10's source was `semiconductorx.com`, an aggregator outside the brief's source hierarchy. ASML's own Q4 2025 investor deck reports EUR 11.6bn of EUV system sales on 48 systems, an average of EUR 242M, which corroborates ~$250M and not ~$200M. Ch10 now carries $250M with the Reuters citation ch05 already relies on plus the ASML deck; `semiconductorx.com` still carries the claims it does support (scanner count per fab, High-NA above $350M, $15-25B per line). |
| 5 | Vera Rubin NVL72 rack power | 16 vs 17 | 120-130 kW vs "more than 250 kW" | **>250 kW wins.** Ch16's source (Introl, Sept 2025) predates disclosure; 72 packages at the 1,800-2,300 W per-GPU TDP in ch17's source exceed 130 kW before CPUs, switches and supply losses. Ch16's figure datum and body corrected to 250 kW with the Rubin architecture source; Introl retained for the GB200 and Kyber points, which it does support. |
| 6 | WiseRoad share / China OSAT total | 12 vs 14 | 3.8 (ch12, via "others" residual) vs 3.7 (ch14 figure) | **3.8 wins**, per TrendForce. Ch14's `osat-firms` datum corrected, `osat-region` China 28.5 → 28.6, and the three prose/card mentions updated. The stack now sums to exactly 100.0. |
| 7 | SMIC's leading node | 01 vs 09 | "SMIC 7 nm" vs a shipping N+3 measured at 113.4 MTr/mm2 | Ch09 is the authority and its teardown source checks out exactly. Ch01's card now reads "SMIC's 7 and 5 nm-class nodes". Ch17's reference to N+2 is correct as written (N+2 is the 7 nm-class node whose yields it discusses) and was left alone. |
| 8 | China's domestic immersion DUV | 05 vs 09 | "began mass producing" (Reuters, 28 Jul 2026) vs "SMIC is testing a 28 nm-class prototype" (aifutures forecast) | Both are faithful to their sources at different dates. Ch09 said "as of mid-2026 the verified state", which reads as contradicting ch05. Ch09 now also carries the Shanghai state firm's single-digit-volume production, cited to the same Reuters piece ch05 uses. |
| 9 | 2025 semiconductor revenue | 14 vs 17 | $791.7B (SIA) vs $809B (Gartner) | Different measurers, both legitimate. Ch17 already cited WSTS's earlier forecast; it now also carries SIA's $791.7B actual, with a line telling the reader to treat the spread as the error bar. |
| 10 | Transformer lead times | 16 (internal) | "roughly 16 to 20 weeks before 2020" | **Not supported by the cited source**, which says only that current delays are "roughly 2.5x pre-pandemic lead times" — that implies 30-44 weeks, not 16-20. Replaced with the source's own framing in both the keyFact and the body. |

Checked and found **consistent**, no edit needed: ASML EUV shipments per year; TSMC pure-foundry share; OSAT
top-10 shares between ch12 and ch14; HBM vendor shares and HBM4 timing between ch11, ch15 and ch17; CoWoS
capacity by year; DRAM oligopoly shares; Nvidia B200/B300/Rubin names, nodes and HBM configurations across
ch09, ch11, ch15, ch16 and ch17; NVLink generations; export-control dates and thresholds across ch02, ch04,
ch05, ch07, ch08 and ch11 (Affiliates Rule 29 Sep 2025 and its stay to 9 Nov 2026; ECCN 3A090.c at 2 GB/s per
mm2; EDA letters 29 May to 2 Jul 2025; gallium/germanium 3 Dec 2024 ban and 9 Nov 2025 suspension).

---

## (b) Edits made, per file

**01-introduction-and-goals.md** — 1
- `card.chinaStatus`: "SMIC 7 nm" → "SMIC's 7 and 5 nm-class nodes" (conflict 7).

**02-design-and-eda.md** — 1
- Takeaways: citations added for the 85% headline share and the design-cost claim.

**03-silicon-and-wafers.md** — 2
- "How it works": deleted the unsourced "about 98 to 99 percent pure" for metallurgical-grade silicon. The
  cited SUMCO page does not state it and no in-chapter source does.
- "How it works": pv-magazine citation added to the nine-nines / eleven-nines sentence (the chapter's own
  evaluation-criteria bullet already attributed the claim there).

**05-lithography.md** — 1
- Takeaways: citations added for 48 EUV systems recognized, ten High-NA in the field, and China 41% → guided 20%.

**06-photomasks-and-pellicles.md** — 2
- "The chokepoint": citation added for the $259M blank market.
- Takeaways: citations added for $259M, sole-vendor actinic inspection, pellicles, and $10-40M mask sets.

**09-transistors-and-front-end.md** — 3
- "The chokepoint": added the Shanghai state firm's 2026 domestic immersion DUV production at single-digit
  volumes, cited to Reuters, reconciling with ch05 (conflict 8).
- Evaluation criteria: citation added for the 10-17 nm interconnect crossover.
- Takeaways: citation added for the yield-and-cost claim.

**10-foundries-and-fabs.md** — 3
- "How it works": Low-NA EUV $200M → $250M, recited (conflict 4).
- Evaluation criteria: citations added for 77%, $15-25B per line, and 93.5% utilisation.
- Takeaways: citations added for the 73% share, $60-64B capex, the Intel stake and the 5-20% premium.

**12-advanced-packaging.md** — 2
- `card.usStatus`: Amkor $2B → $7B (conflict 3).
- "Who makes it": the $2B → $7B budget change and the October 2025 groundbreaking stated and cited.

**13-substrates-and-pcbs.md** — 1
- Takeaways: citations added for TSMC's bottleneck statement and the 95% / 90% material shares.

**14-test-and-assembly.md** — 4
- `osat-firms` figure: WiseRoad 3.7 → 3.8 (conflict 6).
- `osat-region` figure: China 28.5 → 28.6; the stack now sums to exactly 100.0.
- Card `countries` note, `chinaStatus` and the body: 28.5% → 28.6%.
- Takeaways: citations added for the ~50% tester-market growth and wafer-level burn-in.

**16-data-centers-and-power.md** — 7
- keyFact: unsupported "$380B in 2025" comparator removed (conflict 1).
- keyFact: transformer baseline corrected to "roughly 2.5 times pre-pandemic lead times" (conflict 10).
- `rack-power` figure: Vera Rubin NVL72 130 → 250 kW; source relabelled to attribute each datum (conflict 5).
- Body: Vera Rubin rack power corrected, with the 1,800-2,300 W per-GPU TDP that makes it arithmetically necessary.
- Body: 2025 capex comparator now $448.2B, cited to Epoch.
- Body: transformer lead-time framing corrected.
- Takeaways: five citations added.

**17-component-costs.md** — 8
- keyFact, body and `market-2025` figure label: UBS capex now labelled as the broader neocloud-inclusive
  definition, with the narrower five-firm $448.2B cross-referenced (conflict 2).
- "Who captures the value": SIA's $791.7B actual added next to Gartner and WSTS, with an error-bar line (conflict 9).
- "How it works": yield-model citation added to the Poisson/Murphy comparison.
- "Who captures the value": citation added for Micron's 39.8 → 72.6 margin move.
- "The chokepoint": citation line added after the three-classes table (the only table on the site without one).
- Evaluation criteria: citation added for the 250 kW per rack threshold.
- Takeaways: citations added for the B200 cost split and Nvidia's gross margin.

---

## (c) Spot-check results

Three or more load-bearing keyFacts per chapter, checked against the cited URL.

**Verified exact, no change needed**

| Chapter | Checked | Result |
|---|---|---|
| 01 | Hyperscaler capex 2022/2025; Epoch chip-components explorer (80-85% CoWoS, ~11% logic, $22B→$52B, four designers); Nvidia FY2026 DC revenue $193.7B +68% | all exact |
| 02 | EDA market $18B and top-3 >85%, segment shares 90%+/85%+/84-85%/55-60%, Synopsys China 16%→12%; Arm $4.92B and $2.61B royalty, ~50% of hyperscaler CPU compute | all exact |
| 03 | SEMI 12,973 MSI +5.8%, $11.4B -1.2%; Mordor 85% of 300 mm and 73.81% of wafer area; Bernreuter 93.5%, nine of ten Chinese, Tongwei 910kt, Wacker 8th at 80kt; CSET 99.7% at ≤45 nm and China <5% / <1% of 300 mm; SUMCO process (ppb, 1420 °C, 1200 °C epi) | all exact |
| 04 | CSET Japan 90% of photoresist, China <5% and "no EUV resists"; GMI $12.1B and 18.8/16.5/8.4/6.1/4.1 with 53.9% top five; CSET CMP slurry $790M and DuPont+Cabot ~56%, pads $1.7B and DuPont 78% (2014), wet chemicals >60% held by five named firms | all exact |
| 05 | ASML AR 2025: 327 systems, 48 EUV (4 EXE + 44 NXE), 44 in 2024, DUV 374→279 units, EUR 32.7bn, 52.8% GM, EUR 9.6bn NI, EUR 38.8bn backlog; TrendForce 10 High-NA at 4 customers, 3 shipping, 135 wph and the 160/175/180 roadmap; Q4 deck EUV EUR 11.6bn and DUV 47% immersion (= 131 units) | all exact |
| 06 | EUV mask blanks $259.25M and 93.70% top two | exact |
| 07 | SEMI $135.1B / $117.1B +15%, China $49.3B (-0.5%, "essentially flat"), 79% CN+TW+KR, wafer processing +12% and packaging +21%; CSET 1,000+ steps and 70+ border crossings, PVD $2.4B, plasma CVD $3.5B, ALD $1.6B, ECD $0.29B, conductor etch $6.5B, dielectric etch $4.3B | all exact |
| 08 | KLA 55.0% (2020) → 64.1% (2025), Nova 2.5% → 4.3%; CSET CD measuring $1.6B / China 3.4%, defect inspection $3B / China 1.3%, photomask inspection $0.94B and WLP inspection both 0% for China, film measuring $0.54B | all exact |
| 09 | SemiAnalysis SMIC N+3: 57 nm CGP, 32.5 nm MMP, 113.4 MTr/mm2, vs TSMC N6 107.7 and Intel 18A's 36 nm MMP, SAQP on M0 and SADP on M1/M2; aifutures 28 nm-class prototype, mid-2030s DUV, late-2030s EUV | all exact |
| 10 | Counterpoint 2Q26 73/7/5/4/3; TSMC 2Q26 $40.20B, 67.7% GM, 2nm 3% / 3nm 30% / 5nm 33% / 7nm 11% / ≤7nm 77%; Intel 433.3M shares at $20.47 for $8.9B, 9.9%, $5.7B CHIPS + $3.2B Secure Enclave, five-year warrant at $20 with the 51% foundry clause | all exact |
| 11 | Counterpoint HBM 2Q26 50/33/18 and 4Q25 57/22/21 | exact |
| 12 | XenoSpectrum CoWoS 13-16k / 35-40k / ~75k / 120-140k wpm and Nvidia ~60% at 595,000 wafers (flagged in-text as a single Morgan Stanley estimate); TrendForce top-10 OSAT $41.56B with ASE 44.6% / $18.54B, Amkor 15.2%, JCET 12.0% | all exact |
| 13 | Ajinomoto >95% of ABF and JPY 25bn for +50% by 2030; Nittobo ~90% T-glass, 60-70% NER-glass, no relief before mid-2027 | all exact |
| 14 | Advantest 65% (2025) from 58%, SoC 66% from 56%, memory 61%, market ~$9.0B with SoC $6.9B/$4.1B and memory $2.1B/$1.9B, FY25 sales JPY 1,128.6bn +44.7%; ASE capex US$7B → US$8.5B with Powertech and KYEC each at NT$50B for NT$370B combined; KYEC +30-50% capacity | all exact |
| 15 | NVLink 900 / 1,800 / 3,600 GB/s per GPU and 130 / 260 TB/s per NVL72 rack | all exact |
| 16 | LBNL 58 TWh (2014), 176 TWh and 4.4% (2023), 325-580 TWh and 6.7-12% (2028); ERCOT 438 GW, ~89% data centers, 5.9 GW energised, 3.2 GW approved, 474 GW by August; switchgear 52-80 weeks and generators 50-78 weeks, no relief before 2028 | all exact |
| 17 | N2 ~$30,000 and N3 $25-27k; B200 ~$6,750 with HBM ~$3,250 / 48%, logic ~$850 / 13%, H100 at 41%, price ~$40,000; Vera Rubin NVL72 $7,803,148 with $2,001,600 memory vs $373,939 on GB300, 26% vs ~9%, GPUs ~$4M, boards $116,730 vs $35,100; Gartner $809B and $1.6T with memory $837B; Nvidia Q2 FY2027 GAAP GM 75.0% | all exact |

**Spot-check failures**

1. **Ch16, transformer lead times.** "versus roughly 16 to 20 weeks before 2020" is not in the cited source,
   and contradicts the source's own "roughly 2.5x pre-pandemic" (which implies 30-44 weeks). Fixed in the
   keyFact and the body.
2. **Ch16, hyperscaler capex 2025.** "about $380B in 2025" is in the cited source but is contradicted by Epoch's
   filing-level tally of $448.2B for the same five firms. Removed from the keyFact, corrected in the body.
3. **Ch03, metallurgical-grade silicon purity.** "about 98 to 99 percent pure" is supported by neither the cited
   SUMCO page nor any other source in the chapter. Number removed.
4. **Ch12, Amkor plant cost.** "$2 billion" is what the cited article says, but it is the superseded figure;
   the same project was $7B by the October 2025 groundbreaking. Corrected with both sources shown.
5. **Ch14, WiseRoad share.** 3.7% where TrendForce reports 3.8%. Corrected, along with the derived China total.

**Sources I could not open**

`reuters.com` is blocked by the fetch tool; `semiconductors.org` (SIA), `jedec.org` and
`semiengineering.com/mask-economics-shape-high-na-euv-adoption` returned 403. The WebSearch budget for the
session was exhausted, so I could not search around them. Where a claim rested only on one of these:

- The Reuters $250M EUV price is corroborated independently by ASML's own Q4 2025 deck (EUR 11.6bn on 48 systems).
- The Reuters China-DUV claim is carried in ch05 already; ch09 now points at the same source rather than a new one.
- SIA's $791.7B is asserted in the URL slug of SIA's own press release and is consistent with WSTS's $772B forecast.
- JEDEC's HBM4 numbers are consistent with the Siemens EDA source cited in the same chapter.

The CSET issue brief and both ASML PDFs would not parse through the fetch tool and were extracted locally
with pypdf; every claim drawn from them is verified above against the extracted text.

---

## (d) Unresolved — for a human

1. **Chapter 18 (Geopolitics) was not fact-checked.** It appeared during this pass as a skeleton whose body
   reads "DRAFT IN PROGRESS", with empty `keyFacts`, `figures`, `leaders` and `countries`. Its front matter
   parses and it introduces no numbers, so there was nothing to check and editing it would have collided with
   whoever is writing it. It needs its own pass once drafted, including the `card` fields, which currently fail
   the brief's 2-to-5 leaders and countries rules.

2. **Reticle/die counts on TSMC's 2028 CoWoS package disagree between ch12 and ch14.** Ch12 (Tom's Hardware)
   says a 14-reticle interposer carries "20 3D-stacked compute chiplets and 20 HBM5 modules"; ch14 (TrendForce)
   says "roughly ten large compute dies and twenty HBM stacks", and builds a rhetorical "thirty dies in one
   body" on it. These reconcile if the 20 chiplets are 10 SoIC stacks of two, but I could not confirm that from
   either source. Someone should read the Tom's Hardware piece directly and align the two.

3. **Chapter 12 warns that per-unit CoWoS cost estimates are untraceable; chapter 17 uses them anyway.** Ch12
   says "none of the widely circulated per-unit figures traces to a primary source, so treat them with
   suspicion". Ch17 then builds a bill of materials on $750 CoWoS-S and $1,000-1,500 CoWoS-L. Both are
   internally defensible and the numbers are consistent with each other, but the editorial stance is not. This
   is a judgement call for an editor, not a number to fix.

4. **Chapters 01 and 17 do not use the brief's six standard `##` sections.** Ch01 runs "Why AI chips? / The chain
   in one paragraph / Why does the supply chain matter? / How to read this site / What we are not doing /
   Takeaways"; ch17 renames three of the six ("How it works (the cost model)", "Who captures the value", "The
   chokepoint (what is structurally expensive)"). Both read deliberately. Restructuring them is a rewrite, not a
   fact-check, so I left them; confirm the exception or send them back.

5. **Chapter 04's opening physics paragraph carries uncited numbers** — "a few tens of nanometres" of resist
   thickness, and 248 nm / 193 nm for KrF and ArF. These are definitional constants and the site treats them
   that way elsewhere (ch05 states the same wavelengths inside a differently-cited paragraph). Left as-is for
   consistency, but flagging it since a strict reading of the brief wants a citation.

6. **Chapter 17's `b200-bom` stack is a normalised derivation, not the source's own split.** The cited model
   gives packaging 17% and test/assembly/other 24%; the figure splits packaging into CoWoS-L 10% and ABF
   substrate 6% and shows test/assembly at 23%, to make the stack total exactly 100. The method is disclosed in
   the figure's source label. Worth an editor's eye on whether that disclosure is prominent enough.

7. **Two stacks do not total exactly 100** and are left that way because each faithfully reproduces its source:
   `foundry-share` in ch10 sums to 99.0 (Counterpoint's 73/7/5/4/3 plus a 7% residual) and `hbm-share` in ch11
   sums to 101.0 (Counterpoint's rounded 50/33/18). Both are within the brief's "roughly 100".

8. **Content changed underneath this pass.** Several chapters were edited by other agents while I worked
   (ch06's chokepoint paragraph, ch13, ch14's opening paragraph and figure labels, and the arrival of ch18 and
   of eight specimen files). My edits applied cleanly on top, and the final build was run against the current
   tree, but anything rewritten after this timestamp has not been checked.
