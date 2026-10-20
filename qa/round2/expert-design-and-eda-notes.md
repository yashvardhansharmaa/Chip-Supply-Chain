# expert-design-and-eda: progress notes (20 October 2026)

Working notes; the report is qa/round2/expert-design-and-eda.md.

## Progress log
- Read EXPERT-BRIEF, RULES, SCHEMA, writing-well. Read chapter, flashcards, glossary (12 terms), media/chip-design.json, links.json (24 URLs, all ok), other agents' notes (cards-a, content-fix-a/c, pages-a, discussion).
- Next: fetch all 24 sources into qa/round2/scratch/expert-design-and-eda/<name>/.
- Fetched all 24 sources into qa/round2/scratch/expert-design-and-eda/<name>/ (raw + text.txt). NOTE: the session scratchpad is shared; my scripts live in scratchpad/expert-design-and-eda-bin/ (dfetch.sh, dtotext.py). One download had landed in expert-geopolitics/src/arm-f1 through their fetch.sh; moved it to my folder (arm-f1).

## Findings so far (source checks)
- Cadence 8-K 3 Jul 2025: BIS letter 23 May 2025, ECCNs 3D991/3E991, "a party to the transaction is located in China or is a Chinese 'military end user'"; 2 Jul "rescinded effective immediately"; "restoring access ... for its affected customers". Body calls the letter "the rule" -> should be "requirement".
- Synopsys 8-K: letter 29 May, rescission 2 Jul. OK.
- Synopsys FY25 release: $7.054B, Ansys $756.6M, FY ended 31 Oct 2025. "bought that July" is not in the release (primer: "completed July 2025").
- Cadence R115: total revenue 5,296,759 (thousands). Body "$5.297 billion" is a rounding of the cited table -> check Cadence's own release wording.
- SemiAnalysis primer (21 May 2026), free part, tables (images in qa/round2/scratch/expert-design-and-eda/primer-img/):
  - t3 "Tool-Level Market Share (Advanced Nodes)", text heading "(Advanced Nodes, 7nm and Below)": Design Compiler 84-85%, PrimeTime 90%+, Calibre 85%+, Palladium 55-60%. Body/card/figure/glossary state these as whole-market shares -> add "at advanced nodes".
  - t1 "EDA TAM: $18B (2025)": EDA tools $11.5B + IP $3.0B = $14.5B, + Simulation/Analysis (post-Ansys) $3.5B = $18B.
  - t2 "CY25 EDA Vendor Market Share: The Big-3 Control ~87%", column "CY2025 EDA+IP+Simulation Revenue": Synopsys $8B 44%, Cadence $5.3B 30%, Siemens ~$2.2-2.5B 13%, All Others ~13%; "*Synopsys includes partial Ansys Revenue for CY25". Figure eda-share computes Cadence 29 -> use stated 30, drop "calculated" label.
  - Primer does not say "three complete flows"; CSIS PDF p. 13 does.
  - "TSMC specifies 'Calibre-clean' DRC/LVS for tape-out".
- Dark Side (24 Jul 2022): masks >$1M 28 nm, >$10M 7 nm, "$40M range" 3 nm; startups $50-75M on TSMC 7 nm; respins "at least some new masks"; "a few months". OK.
- CSIS Billion-Dollar Chip (11 Sep 2026): $725M 2 nm, $48M 28 nm late 2000s. Its Figure 1 (datawrapper lYtAp v4) source line: "Arm IPO Prospectus, and Quartr". Arm F-1 (21 Aug 2023): "According to the International Business Strategy, Inc. ('IBS'), IC design costs were approximately $249 million for a 7nm chip and approximately $725 million for a 2nm chip" ... "Source: IBS July 2022." -> a 2022 market-research estimate relayed by a company filing and a think tank, dated in the chapter as CSIS September 2026.
- Arm Q4 FYE26 (6 May 2026): $4.92B, royalties $2.61B, "about 50% share among top hyperscalers", AGI CPU "first production silicon product", systems from ASRock, Lenovo, Quanta, Supermicro. OK.
- Ironwood (9 Apr 2025): 192 GB, 6x Trillium, perf/watt 2x. OK. RISC-V blog (19 Jun 2026): Nvidia "RISC-V microcontrollers in all of its GPUs". OK.
- XDSiP deck (5 Dec 2024): ">6000mm2 of Si and 12 HBMs"; "Planar growth is limited by silicon reticle". UCIe 3.0: "48 GT/s and 64 GT/s". OK (GT/s unexplained).
- CSIS Reinsch PDF: p7 Siemens EDA subsidiary; p13 40 steps; p33 "far from replacing". OK.
- Broadcom Q3 FY26 8-K (2 Sep 2026; quarter ended 2 Aug 2026): $16.7B, 221%. OK. (Cited URL with CIK 0001730168 redirects to 1730168; works.)
- Broadcom/OpenAI (13 Oct 2025) OK. Broadcom/Meta (14 Apr 2026): "Meta is partnering with Broadcom to rollout industry's first 2nm AI compute accelerator"; "initial commitment exceeds 1GW ... multi-gigawatt rollout"; MTIA "Meta's Custom Silicon" -> body states "the first 2 nm AI accelerator" as fact and as a separate item.
- Alchip financials: "Year 2025 Revenue USD $992M". OK.
- PIB 25 Jul 2025: "India is home to nearly 20% of the world's chip design engineers". Body undated, unattributed.
- FR 2022-17125: 3D006 effective 14 Oct 2022; GAAFET "key to scaling to 3 nanometer and below"; license "for NS and AT reasons"; Wassenaar December 2021. OK.

## Technical issues (expert)
- Tape-out bullet: says the design team's software does OPC and mask data preparation and then hands files to the mask shop ("Handing those files to the mask shop is called tape-out"). In the foundry model, tape-out is the hand-off of the finished layout (GDSII/OASIS) to the foundry; OPC and fracturing (MDP) are post-tape-out steps run by the foundry/mask shop. Fix wording.

## Edits done (see qa/round2/expert-design-and-eda.md for the full table)
- 20 changes applied to content/01-design-and-eda.md; front matter valid, plain == twin, all card URLs cited in body.
- Proposals for flashcards (card 3), glossary (signoff, PDK), media/chip-design.json step 5 written in the report.
- Next: build + checks once, then hand back.
