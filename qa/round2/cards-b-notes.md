# cards-b notes: chokepoint cards, chapters 6 to 10 (20 October 2026)

Status: done. Files edited: `content/06-deposition-and-etch.md`, `07-metrology-and-inspection.md`, `08-transistors-and-front-end.md`, `09-foundries-and-fabs.md`, `10-memory-and-hbm.md` (Edit tool only). Downloads in `qa/round2/scratch/cards-b/`. Card URLs are copied exactly as the body cites them today (no `#page=`); see "Page numbers" below for the merge.

How the CSET figures were checked: the ETO Chip Explorer is a script-only page, so the share tables were read from its own data bundle (`chipexplorer.eto.tech/2553-289d57a657ba3e308190.js`, site build 15 September 2026, "Data used for analysis were published by TechInsights on July 3, 2026"). Every ETO figure below matches that bundle exactly.

## Chapter 6, Deposition and Etch

| Field | Before | After | Source (body-cited) |
|---|---|---|---|
| Applied Materials | $28.4B revenue, fiscal 2025; leader in physical and chemical vapor deposition | 82.4% of physical vapor deposition tools in 2025 | ETO N42: PVD "$4.9 billion (2025)", Applied Materials 82.4 |
| Lam Research | $23.2B revenue, fiscal 2026; leader in conductor etch | 51.2% of conductor etch tools in 2025 | ETO N50: $12.2B (2025), Lam 51.2 |
| Tokyo Electron | 23% of dry etch and 38% of tube and low-pressure CVD, 2025 | 55.9% of dielectric etch tools in 2025 | ETO N51 ("Insulator etching tools"): $8.7B, TEL 55.9 |
| ASM International | €3.2B revenue, 2025; leader in atomic layer deposition | 54.5% of atomic layer deposition tools in 2025 | ETO N41: $4.1B, ASM 54.5 |
| Naura | 14.7% of PVD, 2025 | 14.7% of physical vapor deposition tools in 2025 | ETO N42: Naura 14.7 |
| costSignal | $135.1B world sales of chipmaking equipment in 2025, with wafer processing tools up 12% | $26.2B deposition tool market in 2025. Dry etch tools were a $21.9B market in 2025 | ETO N36 "$26.2 billion (2025)"; N103 "$21.9 billion (2025)" |
| chinaStatus | unchanged | unchanged | N103: China (mainland) 12.4; CSET "Inside Beijing's Chipmaking Offensive" (14 July 2025): "held less than 1% of the market in 2024" |
| usStatus | The US government lists some dry etch, ALD and deep-hole deposition tools as controlled exports. Its December 2024 foreign direct product rule reaches some tools built outside the United States. | A December 2024 US rule lists some dry etch, atomic layer deposition and deep-hole deposition tools as controlled exports. Its foreign direct product rule reaches some tools built outside the United States. | FR 2024-28270 restates ECCN 3B001: c.1 dry etch and d.6 ALD (PDF p.32), d.19 "aspect ratio greater than 200:1" (p.33). bis.gov, 2 Dec 2024: "SME FDP: Extends jurisdiction over specified foreign-produced SME" |
| test | Most deposition and etch steps have three or four established toolmakers. | In 2025 Lam Research held 41.1 percent of dry etch tools, Tokyo Electron 23.4 percent and Applied Materials 17.4 percent. | N103: Lam 41.1, TEL 23.4, AMAT 17.4 |
| why | Atomic layer deposition lays down a film a fraction of a layer of atoms at a time. At least five makers sell it, led by ASM International with 54.5 percent in 2025. | Atomic layer deposition lays down a film a fraction of a layer of atoms at a time. At least five makers sell it. | FR 2023-23049 p.16: "build up material directly, a fraction of a monolayer at a time"; N41 lists nine named makers above 1 percent |

Why: leader lines joined two facts with semicolons. Each now gives the segment the firm leads, all from one 2025 CSET dataset, so they compare. The 38 percent tube CVD figure was not stated in the body. The old test ("three or four established toolmakers") is stated in the body without a citation, and no source says it; it now gives the figures that show it. The why repeated ASM's 54.5 percent, now on ASM's leader line. The old cost slot was all chipmaking equipment; CSET gives the stage's own market sizes, already in the body.

Body sentence added ("Who makes it"): "In dry etch, CSET's count for 2025 puts Lam Research at 41.1 percent, Tokyo Electron at 23.4 percent and Applied Materials at 17.4 percent ([source](…N103))."

## Chapter 7, Metrology and Inspection

| Field | Before | After | Source |
|---|---|---|---|
| KLA | 56.8% of process control tools in 2025 by CSET's count, about 5 times Applied Materials | 56.8% of process control tools in 2025 by CSET's count | ETO N60: $15.7B (2025), KLA 56.8 |
| Applied Materials, Nova, Onto | unchanged text | unchanged text | N60: 11.2, 4.3, 2.6 |
| Lasertec | 6.4% …, almost all of it mask inspection | 6.4% of process control tools in 2025 | N60: 6.4 (its only other node is N62, mask inspection, 42) |
| Hitachi High-Tech | 6.2% …, most of it CD-SEM line-width measurement | 6.2% of process control tools in 2025 | N60: 6.2 |
| ASML | 5.9% …: YieldStar layer alignment and HMI electron-beam metrology | 5.9% of process control tools in 2025 | N60: 5.9 |
| costSignal | $15.7B process control tool market in 2025; KLA puts the 2025 wafer equipment market at about $120B | $15.7B process control tool market in 2025. KLA puts the 2025 wafer equipment market at about $120B | N60; KLA letter Q4 FY26 (reported 28 July 2026) PDF p.7: "the wafer equipment market, including advanced packaging … above the approximate $120 billion level in calendar 2025" |
| chinaStatus | Chinese makers are still small …, but one of them is growing fast. Skyverse … 2.05 billion yuan of revenue in 2025, about $285 million and up 48.75 percent on 2024. | Chinese firms held 0.7 percent of the world market for these tools in 2025, by CSET's count. Skyverse, a Shenzhen maker of inspection and metrology tools, reported 2.05 billion yuan of revenue in 2025, up 48.75 percent on 2024. | N60: China (mainland) 0.7. Skyverse 2025 annual report summary (cninfo, 16 pp.) p.12: 营业收入 2,053,298,171.74 (2025), 1,380,378,763.53 (2024), 48.75 |
| usStatus | KLA is the largest maker of metrology and inspection tools in the world. Citing Gartner, … | In 2025 the American firm KLA was the world's largest maker of metrology and inspection tools. Citing Gartner, KLA puts its 2024 share at 56.5 percent, or 6.5 times its nearest rival. | N60; KLA Investor Day (March 2026) p.35: "56.5% KLA Share in 2024 … 6.5x nearest competitor", Source: Gartner April 2025 |
| test | KLA is the largest maker …, but every kind has a second maker, so losing KLA would slow a fab without stopping it. | Every kind of measuring and inspecting tool had a second maker in 2025. | N60 subtree: every leaf (film, CD, defect inspection, overlay, e-beam metrology, defect review, mask, process monitoring) has 2+ makers |
| why | KLA is the biggest maker, but eight other firms each hold more than 1 percent of the market. A fab that loses KLA … keeps running. But it finds fewer flaws and fixes them more slowly. | Eight firms besides KLA each held more than 1 percent of the market in 2025. But KLA alone held 85.9 percent of defect inspection, the largest kind, that year. | N60 names eight firms above 1 percent; N67: defect inspection $6.7B, KLA 85.9 |

Why: "about 5 times" is a ratio the site computed; one fact per line removed the segment notes (the countries row keeps them); "about $285 million" is a conversion the site computed (the report has no dollar figure); the two inference sentences in the why had no source.

Body changes: "Who makes it" gains "Eight of them each held more than 1 percent of the market that year ([source](…N60))." The Lasertec, Hitachi and ASML sentences gain their N60 citation (they had none). The Nova and Onto sentences, whose single citation supported only the revenue, are each split so the share carries N60: "**Nova** holds 4.3 percent, through film metrology ([source](N60)). It took $880.6 million of revenue in 2025 ([source](XBRL))." and "**Onto Innovation** holds 2.6 percent ([source](N60)). It took $1,005.3 million of revenue in 2025 ([source](Onto))." "The chokepoint" gains "Every kind of process control tool also had a second maker that year, by CSET's count ([source](…N60))."

## Chapter 8, Transistors and the Front End

| Field | Before | After | Source |
|---|---|---|---|
| TSMC | unchanged | unchanged | tsmc.com l_2nm: "has started volume production in 4Q25 as planned"; "first-generation nanosheet transistor technology" |
| Intel | 18A in high-volume manufacturing | 18A in high-volume production in the United States, as of 2026 | intel.com 18A page: "In high-volume production in the United States." Page undated; its footnotes cite June 2026 papers, so "as of 2026" |
| Samsung Foundry | First into production with gate-all-around nanosheets, starting initial 3 nm output in June 2022 | Started initial production of its 3 nm gate-all-around process in June 2022 | Samsung, 30 June 2022: "has started initial production of its 3-nanometer (nm) process node applying Gate-All-Around (GAA)" |
| SMIC | N+3, printed in several passes on older deep-ultraviolet tools, no EUV | N+3, a 7 nm-class process made without EUV, SemiAnalysis found in June 2026 | SemiAnalysis, 14 June 2026: "Without EUV, SMIC is leaning harder on DUV multi-patterning" |
| Rapidus | State-backed 2 nm entrant targeting mass production in 2027 | Said in July 2025 it would begin 2 nm mass production in 2027 | Rapidus, 18 July 2025: "Rapidus will begin mass-production in 2027." |
| costSignal | TSMC rates N2P at 1.2 times the logic density of N3E and 1.15 times its chip density | $17,000 per 300 mm wafer on TSMC's 4NP process, Epoch AI's December 2025 estimate | Epoch AI, 10 Dec 2025: "We estimate that a 12-inch wafer at the 4NP process node costs $17,000." |
| chinaStatus | SMIC ships a process it calls N+3, measured at 113.4 million … | SMIC ships a process it calls N+3, which SemiAnalysis measured in June 2026 at 113.4 million transistors per square millimeter. (second sentence unchanged) | SemiAnalysis: "SMIC N+3 has a transistor density of 113.4 MTr/mm²" |
| usStatus | Intel runs the only American-owned line that makes the newest transistors. Its 18A process brought … to market together. | In August 2025 Intel called itself the only chipmaker that both develops and manufactures leading-edge logic chips in the United States. It says its 18A process brought gate-all-around transistors and backside power to market together in 2025. | Intel, 22 Aug 2025: "As the only semiconductor company that does leading-edge logic R&D and manufacturing in the U.S."; Intel, 16 June 2026: "brought gate-all-around (GAA) transistors and backside power delivery (BSPD) to market last year with Intel 18A" |
| test | Three firms make gate-all-around transistors, the newest kind, in volume, and none sells its process flow. | TSMC, Intel and Samsung all make chips with gate-all-around transistors, the newest kind. | SemiAnalysis Panther Lake teardown, 26 Sept 2026 (new): Panther Lake on 18A "shipped silicon"; "SF2, used in the Exynos 2600, and TSMC's GAAFET N2, used in Apple's A20 Pro" |
| why | A newcomer has to work out its own process flow … Rapidus is building its flow on IBM's 2 nm technology. Three firms run a gate-all-around flow in volume. China cannot buy extreme-ultraviolet scanners. | Rapidus, a newcomer, is building on IBM's 2 nm technology under a December 2022 agreement. Since September 2024 the United States has required a license to share the know-how for building these transistors, except with countries that impose matching controls. | Rapidus/IBM, 13 Dec 2022: "further develop IBM's breakthrough 2 nanometer (nm) node technology for implementation by Rapidus"; FR 2024-19633: 900-series items incl. 3E905 GAAFET technology "have worldwide license requirements", License Exception IEC for countries with equivalent controls |

Why: the cost slot gave a density (reviewer flag). No allowed source states an N2 wafer price (searched SemiAnalysis, Epoch, Nikkei, CSET, CSIS); Epoch's 4NP price is stated directly, dated, and the body already names 4NP as Blackwell's process. "None sells its process flow", "a newcomer has to work out its own flow" and "only American-owned line" had no source in the body. The why's "three firms" sentence repeated the test and its EUV sentence repeats the China line. Intel's 10-Q says it "released our first products manufactured on Intel 18A" at the start of 2026, so the 2025 market date is attributed to Intel.

Body sentences added ("Who makes it", new paragraph after the SMIC sentence): "SemiAnalysis reported in September 2026 that Intel's Panther Lake, Samsung's Exynos 2600 and Apple's A20 Pro, made on TSMC's N2, all use gate-all-around transistors ([source](…intel-panther-lake-teardown))." and "In August 2025 Intel called itself the only semiconductor company that both develops and manufactures leading-edge logic chips in the United States ([source](…1748…))." After the Blackwell sentence: "Epoch AI estimated in December 2025 that a 300 mm wafer on that process costs $17,000 ([source](https://epoch.ai/data-insights/b200-cost-breakdown))."

## Chapter 9, Foundries and Fabs

| Field | Before | After | Source |
|---|---|---|---|
| TSMC | unchanged | unchanged | TSMC 6-K 2Q26: "7-nanometer and more advanced technologies, accounted for 77% of total wafer revenue" |
| Intel Foundry | $5.8bn segment revenue, only $293m of it from outside customers, 2Q26 | $5.8bn segment revenue in 2Q26, only $293m of it from outside customers | Intel 10-Q Q2 2026: "Revenue was $5.8 billion in Q2 2026 … External revenue was $293 million in Q2 2026" |
| Samsung Foundry | unchanged | unchanged | NIST, 20 Dec 2024: "Samsung's investment of over $37 billion in the coming years" |
| SMIC | $9.327bn revenue in 2025 at 93.5% utilization | $9.327bn revenue in 2025 | SMIC, 26 Mar 2026: "Revenue increased by 16.2% from US$8,030 million in 2024 to US$9,327 million in 2025" (93.5% also confirmed) |
| Rapidus | State-backed 2 nm entrant, Chitose | Raised 267.6 billion yen in February 2026 to reach 2 nm mass production by 2027 | Rapidus, 27 Feb 2026: "a funding round totaling 267.6 billion yen … from the Japan government and private sector companies"; "mass production of 2nm logic semiconductors by 2027" |
| costSignal | unchanged | unchanged | BCG, 28 Sept 2023: "a fab completed in 2026 would carry a ten-year TCO of $35 billion to $43 billion" |
| chinaStatus | unchanged | unchanged | CSET, 17 June 2024: "believed to be fabricated on SMIC's 7nm (N+2) process"; SemiAnalysis, 16 Apr 2025: "the vast majority of Ascend 910B and 910C are made with TSMC's 7nm" |
| usStatus | Intel says it is the only chipmaker that develops and manufactures … The US government bought a passive 9.9 percent stake in Intel in August 2025, and Intel Foundry lost $2.089 billion in the second quarter of 2026. | The US government agreed in August 2025 to buy a passive 9.9 percent stake in Intel. Announcing the deal, Intel called itself the only chipmaker that both develops and manufactures leading-edge logic chips in the United States. Intel Foundry lost $2.089 billion in the second quarter of 2026. | Intel, 22 Aug 2025: "agrees to purchase 433.3 million primary shares … equivalent to a 9.9 percent stake"; "passive ownership". Intel, 23 July 2026, segment table: Intel Foundry operating income (loss) (2,089) |
| test | Intel and Samsung also run lines for the newest chips, but TSMC has not built one of its largest fabs outside Taiwan. | TSMC has not built one of its six largest fabs outside Taiwan. | tsmc.com fab_capacity: "six 12-inch wafer GIGAFAB® fabs, four 8-inch wafer fabs, and one 6-inch wafer fab – all in Taiwan" |
| why | A newcomer with enough money can pay for the building. In March 2026 SIA put … Finding the highly skilled engineers … | In March 2026 SIA put the cost to build and equip a leading-edge fab at as much as $20 to $25 billion. SemiAnalysis judged in December 2025 that finding the highly skilled engineers a foundry needs remained a major challenge for TSMC in Arizona. | SIA to Senate EPW, 4 Mar 2026, p.3: "as much as $20-25 billion for a leading-edge fab"; SemiAnalysis, 1 Dec 2025: "a foundry needs highly skilled engineers"; "labor availability … remain major challenges" |

Why: the US line joined two facts in one sentence (two sources); the source says the government "agrees to purchase", so "bought" became "agreed to buy". The Intel/Samsung clause of the test had no single source in this chapter's body; the why's first sentence was unsourced reasoning. No body change needed.

## Chapter 10, Memory and HBM

| Field | Before | After | Source |
|---|---|---|---|
| SK hynix, Samsung, Micron | unchanged | unchanged | SK hynix 424B4 (10 July 2026), chart "Global HBM Market Shares by Revenue" (image g32785g29b29.jpg, printed p.92; IDC, "A" = actual): 2025A 63.2 / 19.3 / 17.4 |
| costSignal | An HBM3E stack moves data over a path 16 times wider than a DDR5 memory module's | $33B of HBM revenue in 2025, a Gartner figure cited in SK hynix's July 2026 prospectus | 424B4 p.89: "According to Gartner … HBM revenues are forecast to increase from US$33 billion in 2025 to US$86 billion in 2027"; chart g32785g85b30.jpg marks 2025A HBM = 33 |
| chinaStatus | unchanged | unchanged | IFP, 25 Oct 2025: "virtually no production in 2025"; Huawei, 18 Sept 2025: "two proprietary HBMs for the Ascend 950 chips: HiBL 1.0 and HiZQ 2.0" (no maker named) |
| usStatus | Micron is the only American HBM maker. License Exception HBM lets exporters headquartered in the US or a Country Group A:5 ally ship HBM below 3.3 GB … without a license. | Micron is the only American HBM maker. As of October 2026, exporters headquartered in the United States or a Country Group A:5 ally can ship HBM below 3.3 GB per second per square millimeter under License Exception HBM. | 424B4 chart (three makers); eCFR 740.25, "up to date as of 10/16/2026": (b) "headquartered in the United States or … Country Group A:5"; (c) "memory bandwidth density less than 3.3 GB/s/mm^2" |
| test | Three firms ship nearly all HBM, and no fourth firm has both the newest DRAM and a line that stacks it. | Three firms took nearly all HBM revenue in 2025. | 424B4 chart (2025A shares sum to 99.9) |
| why | A fourth maker would find it hard to break in. It would need the newest DRAM, a line that drills through and thins wafers, and a way to stack … Its stack would then have to pass a customer's qualification tests. | SK hynix says only a few firms have the expertise and resources to design, make and package memory chips. It says HBM also needs advanced processes such as TSV packaging and must pass customers' rigorous testing and approval. | 424B4 p.93: production "requires highly integrated and multifaceted capabilities across … design, fabrication and packaging processes … expertise and resources that only few players in the market possess"; p.98: "requires implementation of advanced production processes such as TSV packaging technology and compliance with rigorous testing and approval processes required by our customers" |

Why: the cost slot gave bandwidth (reviewer flag); the prospectus states an actual 2025 market size. "No fourth firm has both …" is stated in the body without a citation and no source says it; the why's first two sentences were reasoning. The eCFR page has no date of its own, so the US line uses its currency date ("as of").

Body sentences added ("Who makes it"): "SK hynix says only a few firms have the expertise and resources to design, make and package memory chips ([source](…d32785d424b4.htm))." and, before the Bank of America sentence, "SK hynix's US prospectus, citing the research firm Gartner, puts HBM revenue at $33 billion in 2025 ([source](…d32785d424b4.htm))."

## Errors and questions outside my edit scope (body, plain, oneLiner, countries)
1. Ch 7 body: "reported 2.05 billion yuan of revenue in 2025, about $285 million" and "Skyverse's revenue alone is about 1.8 percent of CSET's market, more than twice CSET's figure for all Chinese firms" are computed (the report gives yuan only). Fix needs a body editor.
2. Ch 7 lead, plain and oneLiner: "about five times" Applied Materials is a ratio the site computed (56.8/11.2). The lead's "ranges from about 5 to about 7 times" also compares a computed ratio with KLA's claims.
3. Ch 7 "The chokepoint": "KLA leads most kinds of process control tool" (uncited). In CSET's 2025 data KLA leads 4 of 8 kinds (film, defect inspection, mask, overlay) but most of the market by value. "Most of the market" would be accurate.
4. Ch 7 body: the Camtek sentence still pairs a CSET share with an SEC revenue citation (same problem fixed for Nova and Onto; Camtek is not on the card).
5. Ch 9 body: "In August 2025 the government bought 433.3 million newly issued Intel shares"; Intel's release says it "agrees to purchase".
6. Ch 10 body and figure `hbm-revenue`: Bank of America's $54.6B is bank research quoted by SK hynix, a category RULES excludes. The card no longer uses it.
7. Ch 10 Takeaways: IFP says "the United States is projected to make 70 times as much HBM as China"; the body says "the United States and its partners". Worth checking.
8. Card `countries` notes with semicolons (not mine to touch): ch 6 CN "Naura, AMEC, Piotech; largest equipment market…", ch 7 JP "Hitachi High-Tech CD-SEM; Lasertec mask inspection; Rigaku X-ray" and CN "…other domestic makers; 0.7% of the market…", ch 9 TW "TSMC's six gigafabs and UMC; TSMC's N2 and N3 lines".
9. Resolved review item: SK hynix's 56.4 percent in both 2024 and 1Q26 is correct (prospectus chart).

## Page numbers for card PDF URLs (for `apply-pages.py` decisions)
The card fields hold bare URLs. Where a chapter cites the PDF at several pages the script will ask; the page that supports each card sentence:
- ch 6 usSources FR-2024-12-05/2024-28270.pdf → p.32 (c.1 dry etch, d.6 ALD; d.19 is on p.33). whySources FR-2023-10-25/2023-23049.pdf → p.16.
- ch 7 usSources KLA Investor Day PDF → p.35. costSources KLA Q4 FY26 letter → p.7. chinaSources cninfo 1225182755.PDF → p.12.
- ch 9 whySources SIA EPW testimony → p.3 (cited once in the body, so the script carries it).

## New bibliography entries
```json
{
  "https://newsletter.semianalysis.com/p/intel-panther-lake-teardown": {
    "title": "Intel Panther Lake Teardown",
    "publisher": "SemiAnalysis",
    "date": "2026-09-26",
    "type": "article",
    "accessed": "2026-10-20"
  }
}
```
All other card URLs were already in `data/bibliography.json`.

## Check outputs (final run)
- JSON: all five front matters parse; formatting kept (1-space indent ch 6 to 9, 2-space ch 10); new keys right after their text keys; `plain` still equals the first "How it works" paragraph in all five.
- My card checker (SCHEMA §1 sentence split): 0 problems in all five; every card URL is cited in the same chapter's body.
- `node build/build.js`: exit 0; its card warnings name only chapters 11 to 15.
- `check-speak.js`: no matches. `check-integrity.js`: exit 0, no lines for chapters 6 to 10 (remaining: Veeco exposure row, chapters 11 to 15 without source fields). `check-sources.js`: 2402 citations, all tier A or B.
- `style-report.js`: nothing in the edited card text; it flags only the countries semicolons above.

## Screenshots
`qa/round2/shots/cards-b/<chapter>-desktop.png` (1366x1500) and `<chapter>-mobile.png` (390 wide, 2,000 tall), scrolled to the card, for deposition-and-etch, metrology-and-inspection, transistors-and-front-end, foundries-and-fabs, memory-and-hbm. All show numbered source marks on every card line.
