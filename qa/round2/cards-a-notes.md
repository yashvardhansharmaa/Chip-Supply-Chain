# cards-a notes (chapters 1 to 5 chokepoint cards), 20 October 2026

Scope: card source fields (SCHEMA section 1), a year on every figure, no semicolons, the "Price or market size" slot, for content/01 to 05.

## Progress log
- Read RULES.md, SCHEMA.md, writing-well SKILL.md, SUMMARY.md items. Read all five chapters.
- Opened every card source (saved under qa/round2/scratch/cards-a/), edited the five cards and added body sentences, validated, built, ran the checks, took screenshots. Done; only the Reuters figures (ch 4) remain unverified.

## Per chapter

### Ch 1 Design and EDA: source checks (done)
Sources saved under qa/round2/scratch/cards-a/<name>/ (raw + text.txt).
- SemiAnalysis EDA Market Primer, dated "May 21, 2026" (eda-primer). Quotes:
  - "Signoff analysis (Synopsys PrimeTime 90%+ share, StarRC, Redhawk) validates timing"
  - "Physical verification (Siemens Calibre, 85%+ share) checks DRC against foundry rules"
  - "Hardware emulation (Cadence Palladium 55-60% share, Synopsys ZeBu 35-40%)". Card said "55%+": the source states a range, so copy "55-60%".
  - Tool shares carry no year ("These shares have been roughly stable for a decade") -> "as of 2026" per SCHEMA rule.
  - "Total Market: $18B (2025)"; "The broader EDA+IP industry totals $18B when including smaller vendors and Chinese EDA companies."
  - "Synopsys generated $8B in CY2025 (including Ansys), Cadence $5.30B, and Siemens EDA an estimated $2.2-2.5B"
  - "Every advanced chip on earth is designed using Electronic Design Automation (EDA) software from three companies."
  - "no startup can replicate an EDA platform by rewriting from zero" (not yet in the body: add a sentence for the card test)
  - "Change your synthesis tool and you must re-run place-and-route, signoff, and physical verification."
  - Foundries "specify which tools their customers must use for tape-out, effectively mandating specific signoff software"
  - "Turnkey ASIC design houses (Broadcom ASIC Group, Marvell Custom Silicon, Alchip, GUC) are among the largest per-customer EDA spenders" (no ranking of design houses anywhere: usStatus "the leading custom-chip design houses" is unsupported)
- Arm newsroom, "May 6, 2026", Q4 FYE26: "Arm's market share of CPU compute now representing about 50% share among top hyperscalers". The share is "now" (May 2026), not a fiscal 2026 figure: card "fiscal 2026" -> "as of May 2026".
- Broadcom 8-K ex. 99.1 (sec.gov): "Q3 AI semiconductor revenue of $16.7 billion grew 221% year-over-year" for "third quarter of fiscal year 2026, ended August 2, 2026"; CEO: "Demand for our custom AI accelerators and networking continues to be very strong."
- Epoch AI, "Will Huawei catch up to Nvidia by 2030?" (2026, updated September 24, 2026): "Its most powerful chip, the Ascend 950, delivers roughly half the performance of Nvidia's H100, which began shipping in 2022"; "The flagship AI chip that Huawei will produce in 2026 is the Ascend 950."
- CSET, The Semiconductor Supply Chain, January 2021 (PDF, 98 pages), PDF page 50: "The remainder of China's EDA tools support only narrow slices of the chip design flow or supplement leading U.S. EDA tools. Even these capabilities largely do not support leading-edge fabrication processes (e.g., ≤14 nm)."
- CSIS, "The Billion-Dollar Chip", "Published September 11, 2026": "The cost of developing a leading-edge 2-nanometer chip has climbed to approximately $725 million"
- CSIS double-edged sword EDA page (October 6, 2025) is only a summary of a PDF report; not used for the card.

### Ch 2 Silicon and wafers: source checks (done)
- Shin-Etsu FY results (PDF 28 pp), p. 6: Electronics Materials net sales "934.3 1,015.7 9%" (billions of yen), fiscal year 25/4 - 26/3; p. 6 also "we increased the sales of semiconductor materials such as silicon wafer, photoresist and photomask blanks". Exact.
- SUMCO 27th AGM notice (PDF 51 pp), p. 24: "for the fiscal year 2025, the Group registered consolidated net sales of 409,670 million yen, operating profit of 1,342 million yen, ordinary loss of 3,886 million yen, and loss attributable to owners of parent of 11,751 million yen." The card's "¥409.7bn" and "¥11.8bn" are roundings (rule: copy as stated). Card -> "¥409,670m of net sales in 2025" (one fact). The body bullet's ¥409.7 billion / ¥11.8 billion / ¥36.9 billion / ¥1.3 billion are roundings too: flagged, not edited (body edits limited to added sentences).
- GlobalWafers, March 3, 2026: "FY2025 consolidated revenue reached NT$60.6 billion with -3.24% YoY". Exact.
- Siltronic press release, March 12, 2026: "In 2025, Siltronic AG generated sales of EUR 1,346.7 million". Exact.
- Siltronic investor presentation April 2026 (PDF 32 pp): p. 6 "SILTRONIC IS WELL POSITIONED AS THE ONLY WESTERN-BASED WAFER MANUFACTURER ... Around 75% of the market is served by the Top 5", names Global Wafers, Sumco, SK Siltron, Shin Etsu (and Siltronic), "Source: Q1 – Q3 2025 Quarterly revenue reports by SEMI reporting companies with Siltronic estimates". p. 12 "NEW 300 mm FAB IN SINGAPORE ... Key prime customer qualifications completed in July 2025". p. 3 timeline: Singapore fab groundbreaking 2021, inauguration 2024. No source says qualification is "the slow part".
- USGS Minerals Yearbook China 2023 (PDF 44 pp), p. 7: polysilicon "1.50 Mt and accounted for approximately 93% of the global production in 2023. Solar-grade polysilicon was estimated to account for 98% of the country's total".
- NIST, December 17, 2024: awards to GlobalWafers America and MEMC "of up to $406 million"; jobs "across Texas and Missouri".
- SEMI via PR Newswire, Feb. 10, 2026: "Worldwide silicon wafer shipments in 2025 increased 5.8% to 12,973 million square inches (MSI) while wafer revenue slipped 1.2% to $11.4 billion".
- Eswin 2026 half-year report (PDF 208 pp), p. 18: "报告期，公司出货量全球市占率约 7.7%，位居 12 英寸硅片领域国内第一、全球第六" (in the period its shipments were about 7.7% of the world market, first in China and sixth in the world in 12-inch wafers). The card's 2019 "under 1 percent" (CSET) is superseded by this 2026 figure, which the body and Takeaways already give.

### Ch 3 Chemicals, gases and photoresist: source checks (done)
- JIC Capital press release, 17 April 2024 (PDF 9 pp), p. 7: ownership "after the tender offer 84.36%".
- TOK results for the six months ended June 30, 2026 (PDF 10 pp), p. 4: "net sales of ¥139,668 million (up 25.1% year-on-year)".
- Air Liquide electronics page: "€2,465 M revenue in 2025", "9.1% of Group revenue in 2025".
- Entegris 8-K ex. 99.1, July 6, 2022: "ENTEGRIS COMPLETES ACQUISITION OF CMC MATERIALS"; CMC's "CMP Slurries, CMP Pads, and Electronic Chemicals businesses".
- JX Advanced Metals at a glance: "Note: As of FY2026 ... Sputtering targets for semiconductors Global market share: approx. 65%".
- Hubei Dinglong 2025 annual report summary (notice 2026-013, cninfo 2026-03-27, PDF 13 pp), p. 2: "目前国内在先进的 KrF、ArF、EUV 光刻胶领域尚未实现大规模量产" (China has not yet reached large-scale production of advanced KrF, ArF and EUV resist).
- MOFCOM/GAC announcement 2023 No. 23, dated 2023-07-03: "本公告自2023年8月1日起正式实施" (in force from 1 August 2023).
- METI December 2025 deck (PDF 111 pp), p. 8 chart (Fuji Keizai data): photoresist 2023 bar is Japan 78%, then a US segment of roughly an eighth, then Korea. Only Japan's share is printed; "a distant second" is read off the chart and matches the body's "with American and South Korean companies next".
- JSR news, September 17, 2021: "JSR Agrees to Acquire EUV Pioneer Inpria Corporation".
- SEMI via PR Newswire, May 12, 2026: "Wafer fabrication materials revenue increased 5.4% to $45.8 billion. Lithography-related materials, including photomask, photoresist and ancillaries, along with wet chemicals, posted strong double-digit growth"; "Packaging materials revenue grew 9.3% to $27.4 billion in 2025." The packaging figure belongs to later stages; the fab figure includes photomasks.
- RIETI column (Makioka and Zhang): "South Korea increased their import of hydrogen fluoride from the US and Taiwan and those of photoresist from Belgium".
- Card why "Each formula is approved for one layer of one product at one fab" and "one layer at a time", and test "the hardest input to replace", had no source in the body (the plain paragraph states the approval claim without a citation). Searched CSET, Qnity 10-K, Dinglong, Fujifilm, RIETI: none states it. New source found: SIA (Semiconductor PFAS Consortium Photolithography Working Group), "PFAS-Containing Photo-Acid Generators Used in Semiconductor Manufacturing", June 8, 2023 (PDF 28 pp). p. 21: "Lithography continues to carry the highest degree of complexity for chemical qualification in the semiconductor industry ... Of these chemicals, PAGs and the associated photoresist qualification require the most intensive and rigorous qualification standards." p. 21-22: "Each substitution needs tuning for the specificity of the layer(s) on which it is used"; p. 22: "These 26 photoresists would need to receive full factory qualification"; "For materials that pass yield qualification on the first attempt, the overall timeline for qualification would be seven to 17 months"; "some of these materials will have to be qualified serially rather than in parallel." SIA (semiconductors.org) is Tier A. It speaks of process and layer, never "one product": card wording follows the source.

### Ch 4 Lithography: source checks (done, except Reuters)
- ASML 2025 annual report, strategic report section (PDF 72 pp), p. 16: "ASML is currently the world's only manufacturer of EUV lithography systems." p. 64: "We compete primarily with Canon and Nikon in respect of DUV systems." p. 68: Zeiss "sole supplier of lenses, mirrors, illuminators, collectors and other critical optical components".
- ASML 2025 annual report on sec.gov (20-F htm): "ASML is currently the world's only manufacturer of EUV lithography systems." and "Carl Zeiss SMT, our sole supplier of lenses, mirrors, illuminators, collectors and other critical optical components". Supports the whole card test.
- Nikon FY2026/3 results deck (PDF 43 pp), p. 8: "Semiconductor Lithography Systems (New/Refurbished, units) Market Scale 625 570 570 (CY24/25) Nikon 18/10 24/5 22/5" (22 new, 5 refurbished in the year to March 2026).
- Canon FY 2025 Results, January 29, 2026 (PDF 22 pp), p. 22: Lithography Equipment (Units), Semiconductor, 2025 FY: KrF 46, i-line 188, total 234.
- CSIS blog, Wentz and Lin, "Published September 24, 2025": "mastery of EUV systems, which remain firmly out of reach despite massive state investment"; "SMEE holds its largest share in i-line equipment ... but even there its presence amounts to only four percent of the global market." No year on the 4 percent: "as of 2025". The source says "only four percent", not "about": card drops "about" (the body's "about four percent" is flagged, not edited).
- Federal Register 2023-23049 (25 October 2023): adds "a 0% de minimis rule for items described in new ECCN 3B001.f.1.b.2.b"; "there is no de minimis level for lithography equipment and 'specially designed' items therefor meeting the parameters in ECCN 3B001.f.1.b.2.b when destined for use in the 'development' or 'production' of 'advanced-node integrated circuits'". The rule does not tie scanners to the Entity List, so the card's single US sentence covering both levers cannot carry one source: split into two.
- Federal Register 2025-19001 (Affiliates Rule), background: "The Entity List (supplement no. 4 to part 744 of the EAR ...) identifies entities for which there is reasonable cause to believe ... that the entities have been involved, are involved, or pose a significant risk of being or becoming involved in activities contrary to the national security or foreign policy interests"; the rule speaks of "license requirements for exports, reexports, and transfers (in-country) to or involving entities". Body states no definition of the list yet: add one sentence.
- "No American firm makes scanners" had no body source. CSET January 2021 brief (PDF 98 pp), p. 4: "The United States dominates R&D and has strong capabilities across all segments. However, it lacks firms in certain key subsectors, especially photolithography tools (the most expensive and complex form of SME)". CSET is not yet cited in ch 4: add one sentence.
- ASML lenses-and-mirrors page: "largest mirrors are 1 meter across and smooth down to tens of picometers". Light-and-lasers page: "this process is repeated 50,000 times every second".
- Reuters explainer (URL slug 2026-07-28): reuters.com returns HTTP 401 to curl (bot check) and WebFetch cannot reach it, so I could not open it. A verbatim syndicated copy of the 28 January 2026 version (Yahoo Finance, "Explainer-The $250 million ASML 'printer' behind Nvidia's chips", Toby Sterling) contains none of the card's figures: it says the machines "cost $250 million each" and "Last year, ASML shipped 44 such systems". So the $200M, $350-400M, $60M and "above 80 percent of DUV" figures can only come from the July 2026 update named in the bibliography ("Explainer: The $400 million ASML 'printers' key for the AI chip boom", 2026-07-28, accessed 2026-10-18). Not verified by me: needs a person with Reuters access. No ASML filing in the chapter gives a unit price or ASP.

### Ch 5 Photomasks and pellicles: source checks (done)
- AGC data book (reference.pdf, 91 pp), p. 8 "Products with Top Market Share": "EUV lithography photomask blanks: No.2 Worldwide*", "*Based on fiscal 2026 estimates by AGC", "As of January 2026".
- HOYA REPORT 2025, Information Technology page: "HOYA holds an exceptionally high market share"; chart "Estimated Market Share (FY2024)" is two unlabeled pies (EUV: HOYA and "Company A"; DUV: HOYA, "Company B", others), no numbers, so the leader stays a dated claim. (Side note: the EUV pie shows two suppliers where AGC says three supply EUV blanks; a third with a tiny share would explain it. Not acted on.)
- Lasertec news, 31 October 2025: "In 2019, Lasertec launched the world's first actinic * EUV patterned mask inspection system, the ACTIS A150."
- ETO Chip Explorer is a script app with no data in its HTML. Verified the same dataset in ETO's open data (github.com/georgetown-cset/eto-supply-chain, data/provision.csv and inputs.csv): N29 "Mask exposure systems - e-beam", "$994 million (2025)"; IMS Nanofabrication 46.6, NuFlare 39.2, JEOL 14.2 (2025); countries AUT 46.6, JPN 53.4; "CSET analysis of TechInsights data (2025)". No Chinese firm or CHN row.
- Photronics FY2025 results (GlobeNewswire, 10 December 2025): "Full Year Fiscal 2025 Results Revenue was $849.3 million"; "Photronics is a leading worldwide manufacturer of integrated circuit (IC) and flat panel display (FPD) photomasks."
- SMIC Mask Service page (undated, "© 2026 SMIC"): "Mask Operation – Zhangjiang ... Shanghai" and "Mask Operation – Lingang ... Shanghai". No date on the page: "as of 2026".
- KLA-Tencor release, September 11, 2017 (the body's KLA source): "The Teron 640e reticle inspection product line ... facilitate development and qualification of EUV and advanced optical reticles at mask shops." Too old to date a 2026 status line, so the card uses KLA's current product page (new source): "Reticle Qualification | KLA" (kla.com/products/reticle-manufacturing, © 2026): Teron 647eS2 ... "Critical pattern and particle defect detection for EUV and optical patterned reticles".
- AGC article "The Japanese glass behind next-generation chips" (HTML date 2024/12/13): "AGC is one of three companies worldwide that supply photomask blanks for EUV lithography"; "AGC invested more than a decade in meeting these exacting requirements"; "Mass production of EUV mask blanks only began in 2017."
- Zeiss mask qualification page: "AIMS® is the only system which qualifies the photomask under scanner equivalent conditions".
- SemiAnalysis primer (21 May 2026): "Proving correctness before committing to a $40M mask set"; SemiAnalysis Dark Side article (Jul 24, 2022): "With 7nm, the cost increases beyond $10M".
- Card why "Inspection is harder." has no source anywhere in the chapter: removed.

## Changes made, chapter by chapter (before -> after)

### Ch 1 (content/01-design-and-eda.md)
- Synopsys share: "90%+ of the timing-signoff market" -> "90%+ of the timing-signoff market as of 2026"; source eda-market-primer.
- Cadence share: "55%+ of the hardware emulator market" -> "55-60% of the hardware emulator market as of 2026"; source eda-market-primer (source states 55-60%).
- Siemens EDA share: "85%+ of physical verification, the final layout check" -> "85%+ of physical verification, the final layout check, as of 2026"; source eda-market-primer.
- Arm share: "About 50% of processor compute at the top cloud firms, fiscal 2026" -> "... at the top cloud firms as of May 2026"; source newsroom.arm.com Q4 FYE26 (the release says "now", 6 May 2026).
- Broadcom share: unchanged; source avgo 8-K ex. 99.1 (sec.gov).
- chinaStatus: "Huawei's best, the Ascend 950" -> "Huawei's most powerful chip in 2026, the Ascend 950" (Epoch: "Its most powerful chip"; "The flagship AI chip that Huawei will produce in 2026"); rest unchanged. chinaSources: epoch.ai huaweis-roadmap-to-2031; CSET brief PDF (p. 50).
- usStatus: "The United States has the two largest design-software vendors and the leading custom-chip design houses." -> "Synopsys and Cadence, the two largest design-software vendors by 2025 revenue, are American." No source ranks "the leading custom-chip design houses" (the primer only lists Broadcom ASIC Group, Marvell, Alchip and GUC as large EDA spenders), so that clause was cut. usSources: eda-market-primer.
- costSignal: "$40M for a leading-edge photomask set, SemiAnalysis's May 2026 figure. In 2022 SemiAnalysis reported that startups had designed and taped out chips on TSMC 7 nm for $50-75M" -> "$18B world market for design software and licensed circuit blocks in 2025. CSIS put the cost of developing a leading-edge 2 nm chip at about $725M in September 2026". costSources: eda-market-primer; csis.org billion-dollar-chip. Both figures were already in the body.
- test, why: text unchanged. testSources: eda-market-primer. whySources: eda-market-primer x2.
- Body sentences added:
  - The EDA flow: "SemiAnalysis wrote in May 2026 that no startup can replicate one by writing it from scratch ([source](https://newsletter.semianalysis.com/p/eda-market-primer))." (supports the test's "a fourth would have to be written from nothing")
  - The EDA flow: "In May 2026 SemiAnalysis put Siemens EDA's Calibre at more than 85 percent of physical verification, the final layout check ([source](...eda-market-primer))." and "It put Cadence's Palladium at 55 to 60 percent of hardware emulation ([source](...eda-market-primer))." (the body stated only Synopsys's share; the other two were only in a figure)
  - Who makes it: "On the same count Cadence is second, at $5.30 billion, and Siemens EDA third, at an estimated $2.2 billion to $2.5 billion ([source](...eda-market-primer))." (supports "two largest")

### Ch 2 (content/02-silicon-and-wafers.md)
- Shin-Etsu Handotai share: unchanged; source Shin-Etsu results PDF (p. 6).
- SUMCO share: "¥409.7bn of 2025 net sales, but an ¥11.8bn loss" -> "¥409,670m of net sales in 2025" (one fact per line; the source states 409,670 million yen, so ¥409.7bn was a rounding); source SUMCO AGM notice PDF (p. 24).
- GlobalWafers share: unchanged; source gwc_news_en_20260303.
- SK Siltron share: "One of the top five wafer makers" -> "One of the top five wafer makers by revenue in the first three quarters of 2025"; source Siltronic investor presentation PDF (p. 6).
- Siltronic share: unchanged; source Siltronic press release (12 March 2026).
- chinaStatus: "China made about 93 percent of the world's polysilicon in 2023. Chinese firms held under 1 percent of the 300 mm wafer market as of 2019." -> "China made about 93 percent of the world's polysilicon in 2023, an estimated 98 percent of it solar-grade. Eswin, mainland China's largest maker of 300 mm wafers, says it had about 7.7 percent of world 300 mm shipments in the first half of 2026." The 2019 figure is superseded by the body's own 2026 figure (also in Takeaways), and without the solar caveat the 93 percent reads as chip silicon. chinaSources: USGS MYB China 2023 PDF (p. 7); Eswin 2026 half-year report PDF (p. 18).
- usStatus: "No major US-headquartered firm makes wafers. GlobalWafers ... up to $406 million for wafer plants in Texas and Missouri." -> "None of the five largest wafer makers in 2025 was American. GlobalWafers of Taiwan won CHIPS awards of up to $406 million in December 2024 for wafer plants in Texas and Missouri." ("major" had no source; the Siltronic slide does.) usSources: Siltronic presentation (p. 6); NIST 17 December 2024.
- costSignal: unchanged. costSources: SEMI via PR Newswire, 10 February 2026.
- test: unchanged; testSources: Siltronic presentation (p. 12).
- why: "The slow part is approval, a step called qualification." -> "Customer approval of a new plant is called qualification." (no source says approval is the slow part). whySources: Siltronic presentation x3 (p. 6, p. 12, p. 12).
- Body sentence added (Who makes it): "It names the five as Shin-Etsu, SUMCO, GlobalWafers, SK Siltron and Siltronic itself ([source](...20260429_Siltronic_InvestorPresentation__.pdf))." Also a paragraph break before "Siltronic's April 2026 investor presentation says..." so the METI paragraph stays at four sentences (style report: no paragraph over five). No sentence text changed.

### Ch 3 (content/03-chemicals-gases-and-photoresist.md)
- Leader texts unchanged. Sources: JSR -> JIC Capital press release PDF (9 pp, no page needed); Tokyo Ohka Kogyo -> TOK H1 results PDF (p. 4); Air Liquide -> airliquide.com electronics page; Entegris -> sec.gov 8-K ex. 99.1 (6 July 2022); JX Advanced Metals -> jx-nmm.com at a glance.
- chinaStatus: unchanged. chinaSources: Hubei Dinglong 2025 summary PDF (p. 2); MOFCOM 2023 No. 23.
- usStatus: unchanged. usSources: METI deck PDF (p. 8); JSR news 17 September 2021.
- costSignal: "$45.8bn market for wafer fabrication materials in 2025, and $27.4bn for packaging materials" -> "$45.8bn market for wafer fabrication materials in 2025, photomasks included". The packaging-materials figure is another stage's market; the fab figure is broader than this stage and SEMI's release says it includes photomasks. costSources: SEMI via PR Newswire, 12 May 2026.
- test: unchanged; testSources: SIA PAG case study #page=21 (new source).
- why: "Each formula is approved for one layer of one product at one fab." -> "Each formula is tuned to the layers it prints and has to pass qualification in the fab." (no source found for "one product"; SIA speaks of process and layer). Other two sentences unchanged. whySources: SIA #page=21, SIA #page=22, RIETI column.
- Body sentences added:
  - Who makes it: "SEMI counts photomasks among wafer fabrication materials, along with photoresist, its ancillary chemicals and wet chemicals ([source](...302768700.html))."
  - The chokepoint, PFAS paragraph: "The Semiconductor Industry Association wrote in 2023 that photoresist needs the most rigorous qualification of any chemical a chipmaker uses, because each resist is tuned to the layers it prints ([source](https://www.semiconductors.org/wp-content/uploads/2023/06/FINAL-PAG-Case-Study.pdf#page=21))." and "The resist maker adjusts its formula over rounds of tests in the fab, and some resists have to be qualified one after another ([source](https://www.semiconductors.org/wp-content/uploads/2023/06/FINAL-PAG-Case-Study.pdf#page=22))."

### Ch 4 (content/04-lithography.md)
- ASML share: "100% of EUV (extreme ultraviolet) and above 80% of DUV (deep ultraviolet)" -> "100% of EUV (extreme ultraviolet) systems sold in 2025" (one fact per line, as in the SCHEMA example; the DUV share stays in the body and Takeaways, sourced to Reuters). Source: ASML 2025 strategic report section PDF (p. 16).
- Nikon, Canon shares: unchanged. Sources: Nikon FY2026/3 deck PDF (p. 8); Canon FY2025 results PDF (p. 22).
- chinaStatus: "...has its largest share in i-line scanners, the coarsest kind, and even there holds about 4 percent of the world market." -> "...had its largest share in i-line scanners, the coarsest kind, and even there held 4 percent of the world market as of 2025." (CSIS gives no year and says "only four percent", not "about"). chinaSources: CSIS breakthroughs-or-boasts x2.
- usStatus: "No American firm makes scanners. But the US government limits who may buy them, through rules on the American-made parts inside each machine and through its entity list of firms that may not be supplied." -> "No American firm makes scanners, CSET found in 2021. But a US rule published in October 2023 covers certain immersion scanners bound for advanced chipmaking if they hold any American-made parts. The US entity list also requires a license to supply the firms it names." (the old second sentence joined two rules from two sources; the first had no source). usSources: CSET brief #page=4 (new to ch 4); Federal Register 2023-23049; Federal Register 2025-19001.
- costSignal: unchanged (could not verify: see flags). costSources: the body's Reuters URL.
- test: unchanged; testSources: ASML 2025 annual report on sec.gov (states both facts).
- why: unchanged; whySources: asml.com lenses-and-mirrors; asml.com light-and-lasers.
- Body sentences added:
  - Who makes it, new paragraph after the Canon paragraph: "In January 2021 CSET, a research center at Georgetown University, found that the United States lacked firms in a few key parts of the chip supply chain, above all lithography tools ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf#page=4))."
  - Controls list, end of the Affiliates Rule bullet: "Exporting goods covered by US export rules to a firm on the entity list needs a US license ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities))."

### Ch 5 (content/05-photomasks-and-pellicles.md)
- AGC share: unchanged; source AGC data book PDF (p. 8).
- Hoya share: "Says its share of mask blanks is exceptionally high" -> "Said in its 2025 report that its share of mask blanks is exceptionally high" (the SCHEMA example); source HOYA REPORT 2025 page.
- Lasertec share: "...at the scanner's own wavelength (2019)" -> "...at the scanner's own wavelength in 2019"; source Lasertec news 31 October 2025.
- IMS Nanofabrication share: unchanged; source chipexplorer.eto.tech N29.
- Photronics share: "Calls itself one of the world's leading photomask makers, with $849.3M of revenue in fiscal 2025" -> "$849.3M of revenue in fiscal 2025" (one fact; the self-description is already the US line); source GlobeNewswire 10 December 2025.
- chinaStatus: "SMIC runs two mask shops of its own in Shanghai." -> "As of 2026 SMIC runs two mask shops of its own in Shanghai." Second sentence unchanged. chinaSources: smics.com mask page; chipexplorer N29.
- usStatus: "Photronics calls itself one of the world's leading photomask makers, and KLA makes mask inspection tools." -> "In December 2025 Photronics called itself a leading worldwide maker of photomasks. As of 2026 KLA sells tools that inspect EUV and optical masks." usSources: GlobeNewswire 10 December 2025; kla.com/products/reticle-manufacturing (new source).
- costSignal: unchanged. costSources: eda-market-primer; the-dark-side-of-the-semiconductor.
- test: "AGC says only three firms supply the blank plates for EUV masks." -> "AGC said in December 2024 that only three firms supply the blank plates for EUV masks."; testSources: AGC article (13 December 2024).
- why: "Inspection is harder." removed (no source); other two sentences unchanged. whySources: AGC article; Zeiss mask-qualification page.
- Body sentence added (Inspection and repair): "As of 2026 its Teron systems for mask shops detect pattern and particle defects on both EUV and optical masks ([source](https://www.kla.com/products/reticle-manufacturing))." Also a paragraph break before "Zeiss makes AIMS EUV" so the KLA paragraph does not run to six sentences. No sentence text changed.

## Errors and flags for the owner
1. Ch 4 cost slot (Reuters) not verified. reuters.com returns 401 to curl and WebFetch cannot reach it; I did not try to get round the block. The 28 January 2026 version of the explainer ("Explainer-The $250 million ASML 'printer' behind Nvidia's chips", read via a verbatim Yahoo Finance copy) has none of the card's figures: it says the machines "cost $250 million each". The $200M / $350-400M / $60M prices and "above 80 percent of DUV" must come from the July 2026 update that the bibliography names ("$400 million ASML 'printers'", 2026-07-28). Someone with Reuters access should confirm the four figures and the title/date (review item "Lithography source 8").
2. Ch 2 body, SUMCO bullet (not edited): ¥409.7 billion, ¥11.8 billion, ¥36.9 billion and ¥1.3 billion are roundings of 409,670, 11,751, 36,924 and 1,342 million yen in the cited PDF (p. 24 and p. 26).
3. Ch 4 body (not edited): "about four percent" for SMEE; CSIS says "only four percent".
4. Ch 3 plain paragraph (not touched, out of scope): "A chipmaker approves each formula for one factory and one product at a time. A new supplier has to earn that approval from scratch, so adding a second supplier takes years." has no citation, and "one product" matches no source found. The SIA case study added to the body (pp. 21-22) could carry a revised version. The PFAS paragraph's first three sentences are also uncited (pre-existing).
5. Ch 1 body (not edited): the CSIS "double-edged sword" EDA citations point at a summary page whose text does not contain the cited claims (they are presumably in the downloadable report PDF). "Synopsys is the largest.", "Marvell, another US firm, also builds custom accelerators." and "Below Broadcom and Marvell are the Taiwanese design-service houses." are uncited.
6. Ch 1 card leaders now show "China X% of revenue" lines from the exposure panel (code agent's work); not changed by me.

## Page numbers for card URLs into long PDFs (for apply-pages.py decisions)
Card URLs copy the body citations exactly (no fragment yet, except my new citations, which carry their page). Where the body cites the same PDF on several pages, apply-pages.py will list the card URL for a decision; these are the pages for each card fact (PDF page index, verified in pdftotext and, for SIA and CSET, pypdf):
- Ch 1: CSET brief (98 pp): chinaSources[1] p. 50.
- Ch 2: Shin-Etsu results (28 pp): Shin-Etsu share p. 6. SUMCO notice (51 pp): SUMCO share p. 24. Siltronic presentation (32 pp): SK Siltron share p. 6; usSources[0] p. 6; testSources[0] p. 12; whySources p. 6, p. 12, p. 12. USGS MYB China 2023 (44 pp): chinaSources[0] p. 7. Eswin H1 2026 (208 pp): chinaSources[1] p. 18.
- Ch 3: METI deck (111 pp): usSources[0] p. 8. Hubei Dinglong summary (13 pp): chinaSources[0] p. 2. TOK H1 results (10 pp): TOK share p. 4. SIA PAG case study (28 pp): already #page=21 / #page=22 in body and card.
- Ch 4: ASML strategic report section (72 pp): ASML share p. 16. Nikon deck (43 pp): Nikon share p. 8. Canon FY2025 results (22 pp): Canon share p. 22. CSET brief: already #page=4 in body and card.
- Ch 5: AGC data book (91 pp): AGC share p. 8.

## New bibliography entries
```json
{
  "https://www.semiconductors.org/wp-content/uploads/2023/06/FINAL-PAG-Case-Study.pdf": {
    "title": "PFAS-Containing Photo-Acid Generators Used in Semiconductor Manufacturing",
    "publisher": "Semiconductor Industry Association (Semiconductor PFAS Consortium Photolithography Working Group)",
    "date": "2023-06-08",
    "type": "report",
    "accessed": "2026-10-20"
  },
  "https://www.kla.com/products/reticle-manufacturing": {
    "title": "Reticle Qualification",
    "publisher": "KLA Corporation",
    "type": "page",
    "accessed": "2026-10-20"
  }
}
```
Both domains are Tier A in data/source-tiers.json (semiconductors.org, kla.com). The CSET brief newly cited in ch 4 is already in the bibliography.

## Check outputs (final run, 20 October 2026)
- Front matter of all five chapters parses as JSON; key order: chinaStatus, chinaSources, usStatus, usSources, costSignal, costSources, substitutability {band, test, testSources, why, whySources}; leaders {name, country, share, source}. plain equals the first "How it works" paragraph in all five. No semicolons in card text. URL count equals sentence count in every field; every card URL is cited verbatim in its chapter's body (own script: qa scratchpad validate.py, "ALL OK").
- node build/build.js: exit 0; no warning for chapters 1-5 (remaining "card has no source fields" warnings are chapters 8-15, other agents).
- node qa/scripts/check-speak.js: "check-speak: no matches" (an earlier run showed 51 rhetorical-question matches under "Questions for discussion", from the discussion-questions data, not these chapters; cleared by the time of the final run).
- node qa/scripts/check-integrity.js: exit 0; no problem or warning for 01-05 (missing-year warnings and "no source fields yet" are chapters 6-15).
- node qa/scripts/check-sources.js: "2379 citations, all tier A or B".
- style-report: no sentence over 32 words and no paragraph over five sentences among the sentences I added (the two remaining long-paragraph flags in ch 3 and ch 4 predate this work).

## Screenshots
qa/round2/shots/cards-a/: <id>-desktop-light.png (1366 px wide, scrolled to the card) and <id>-mobile-dark.png (--mobile) for design-and-eda, silicon-and-wafers, chemicals-gases-and-photoresist, lithography, photomasks-and-pellicles. All ten show the marks rendering on every sourced line.
