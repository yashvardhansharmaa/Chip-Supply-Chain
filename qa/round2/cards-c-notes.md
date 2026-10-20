# cards-c notes (chapters 11 to 15, card source fields)

20 October 2026. Scope: card source fields (SCHEMA §1), a year on every card figure, no semicolons, the "Price or market size" slot. Files edited: content/11 to 15 only (card object, plus nine added body sentences). bibliography.json not touched.

## Progress
- [x] ch 11 advanced-packaging (card + 3 body sentences)
- [x] ch 12 substrates-and-pcbs (card + 2 body sentences)
- [x] ch 13 test-and-assembly (card + 2 body sentences)
- [x] ch 14 systems-and-networking (card + 2 body sentences)
- [x] ch 15 data-centers-and-power (card + 1 body sentence)
- [x] build + checks + screenshots

## Policy used
- Every card sentence carries one URL, and that URL is cited in the same chapter's body for the same fact. Where a card sentence had no sourceable fact (site reasoning, opinion, an "unsourced estimate"), it was replaced by a sourced fact or removed, as listed below.
- Years: every share, revenue, count or price names the period from its source. Firms' own claims carry the date they made them. Plain product descriptions with no figure and no position claim (ch 15 leaders) carry a source but no year.
- Card source URLs are the bare URLs the body cites today. Pages for long PDFs are listed at the end for the apply-pages step.

## Chapter 11, Advanced Packaging
Card changes (before -> after):
- TSMC share: "CoWoS packaging used by Nvidia, Google, AMD and Amazon" -> "... in 2025". Source epoch.ai/data-insights/ai-chip-supply-chain-constraints: "NVIDIA, Google, AMD, and Amazon — collectively consumed over 90% of global CoWoS packaging capacity ... in 2025".
- Intel share: "Foveros 3D packaging in volume at Rio Rancho, New Mexico; EMIB 2.5D bridges" -> "Foveros 3D packaging in volume at Rio Rancho, New Mexico, since January 2024" (semicolon, two facts; EMIB stays in the why). Source intel.com Fab 9 release, 24 Jan 2024: "Opening marks a milestone for high-volume manufacturing of 3D advanced packaging technologies".
- ASE Technology, Amkor, JCET: text unchanged, sources attached (prnewswire 4Q25 release, ATM "Total net revenues 389,228" NT$m 2025; Amkor ex99.1 "Net sales $6.71 billion"; JCET 9 Apr 2026 "record full-year revenue of RMB 38.87 billion in 2025").
- ASMPT share: "$532.1M advanced packaging revenue, 2025; thermocompression bonders" -> "Thermocompression bonders, with $532.1M of advanced packaging revenue in 2025". Source ASMPT 2025 results: "revenue of US$532.1 million for its advanced packaging business ... with a significant contribution from its TCB solutions".
- chinaStatus: unchanged; 2 x CSET "Inside Beijing's chipmaking offensive": "China gained market share in advanced packaging tools (+4 pp) and test tools (+5 pp), while it lost market share in the other (conventional) assembly and packaging tool segments".
- usStatus s2: "Amkor is building a $7B packaging and test plant in Peoria..." -> "Amkor broke ground in October 2025 on a $7B packaging and test campus in Peoria, Arizona, and expects production to start in early 2028." Sources: Intel Fab 9 release; Amkor 6 Oct 2025 "Breaks Ground ... Expands Investment to $7 Billion ... production beginning in early 2028".
- costSignal (was CoWoS capacity) -> "About $1,100 for the CoWoS-L packaging of one Nvidia B200, against about $900 for its two logic dies, by Epoch AI's December 2025 estimate". Source epoch.ai/data-insights/b200-cost-breakdown (10 Dec 2025): table "Advanced packaging $1,100 ... CoWoS-L packaging process at TSMC"; "Logic die fabrication $900 ... Two compute chiplets".
- test: "Intel's EMIB can do the same job as TSMC's CoWoS, but the shortage is in making enough working packages at the volume Nvidia orders." -> "Rated on CoWoS capacity, which TSMC said in July 2026 was so tight that it limited its customers' growth." Source TSMC 2Q26 transcript p.10: "our packaging capacity is so tight that now it limits my customers' growth". ("working packages at the volume Nvidia orders" had no source; EMIB moved to the why only.)
- why: s1 "None of the packaging steps is unusual." (only stated uncited in the body) -> "CoWoS packaging has been outsourced to assembly firms such as ASE and Amkor before." Source SemiAnalysis 12 Mar 2026: "CoWoS can and has previously been outsourced to OSATs like ASE/SPIL and Amkor". s2 unchanged (same article: "Intel's flagship EMIB 2.5D advanced packaging solution is also another option ... with Trainium and TPU adopting it to different degrees"). s3 "a newcomer has to buy enough bonding machines and run enough practice lots" (no source) -> "But a newcomer would have to match TSMC, which said in April 2026 that it was producing CoWoS at 5.5 times the area a scanner prints in one shot." Source pr.tsmc.com/english/news/3302 (23 Apr 2026): "The Company is now producing 5.5-reticle size CoWoS and planning for even larger versions."
Body sentences added:
1. How it works, after "...two large, expensive logic dies.": "Epoch AI estimated in December 2025 that CoWoS-L packaging added about $1,100 to the cost of building one Nvidia B200, more than the $900 of its two logic dies ([source](https://epoch.ai/data-insights/b200-cost-breakdown))."
2. Capacity, end of the March 2026 SemiAnalysis paragraph: "It also noted that CoWoS packaging can be, and has been, outsourced to assembly firms such as ASE and Amkor ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage))."
3. The chokepoint, before "Each generation on TSMC's roadmap...": "TSMC said in April 2026 that it was producing CoWoS at 5.5 times the size of a reticle field and planning larger versions ([source](https://pr.tsmc.com/english/news/3302))."
Not used: TSMC 3Q25 transcript p.16 "our advanced packaging revenue is slightly over (corrected by company after the call) 10%" (a share of TSMC revenue with no year, no dollar size).

## Chapter 12, Substrates and PCBs
- Ajinomoto: "Told investors that..." -> "Told investors in June 2026 that its build-up film has held over 95% of its market since launch". Source Ajinomoto 30 Jun 2026 presentation p.3: "maintaining a share of over 95%".
- Nitto Boseki: "Claims an overwhelming advantage in low thermal expansion glass" -> "Claimed ... in its 2025 integrated report". Source Integrated Report 2025 p.4: "we have an overwhelming competitive advantage in both quality and production capacity for low thermal expansion glass".
- Ibiden: "Says it typically takes..." -> "Said in May 2026 that it typically takes close to 100% of each new generation of interposer-type substrates at launch". Source Ibiden Q&A, 12 May 2026: "we typically secure a market share close to 100%".
- Unimicron, Samsung Electro-Mechanics: unchanged, sources attached (Unimicron 2Q26 deck, 9 pp: ABF 52% of NT$42,890m; SEMCO 30 Jul 2026: "Package Solution Unit recorded Q2 sales of KRW 771.6 billion, up 37% year-on-year").
- chinaStatus: "says" -> "said in its annual report for 2025" (TTM 10-K FY2025: "For PCBs, our competitors are mostly based in China and Taiwan.") and "said in its 2025 integrated report" (Nitto Boseki p.4: "Chinese and Taiwanese companies are aggressively catching up with us in the Special Glass sector").
- usStatus s2: "The Commerce Department has made a final award of up to $75 million to Absolics, a subsidiary of Korea's SKC..." -> "In December 2024 the Commerce Department finalized an award of up to $75 million to Absolics, an affiliate of Korea's SKC, for a glass substrate plant in Covington, Georgia." The NIST project page gives no award date. Source NIST news, 5 Dec 2024: "the U.S. Department of Commerce has finalized two separate awards ... awarded Absolics, an affiliate of the Korea-based SKC, up to $75 million". s1 source: White House 100-day review p.43: "Suppliers for substrates are based in Asia. Key substrate companies include: Ibiden (Japan), Nanya (Taiwan)...".
- costSignal (was Ibiden's capital spending) -> "$7.5 billion market for FC-BGA substrates in 2025, up 18 percent, in a Prismark estimate cited by AT&S". Source AT&S Annual Report 2025/26 p.33: "the total value of the FC-BGA substrate market has been assessed at US$ 7.5 billion for 2025, 18% up from the previous year" (footnote: Prismark Partners, Application Forecast, January 2026). The figure comes from Prismark, a research firm; it is cited through AT&S's own report, as the brief allows. Flag for the owner.
- test: unchanged; source MGC Oct 2024 deck p.12 (diagram "Approval of materials", from semiconductor and device makers back to MGC).
- why: removed s2 "A newcomer can build a line to make a rival film." (no source found); s3 lightly reworded ("But ... the new film" -> "Chipmakers and device makers approve substrate materials such as laminate, so a rival film would need their approval too."). Sources: Ajinomoto p.9 ("ABF, is an insulating film used between layers of package substrates for logic ICs"); MGC p.12.
Body sentences added:
1. Absolics bullet: "The department finalized the award in December 2024 ([source](https://www.nist.gov/news-events/news/2024/12/biden-harris-administration-announces-chips-incentives-awards-absolics-and))."
2. AT&S bullet: "Citing the research firm Prismark, its annual report for 2025/26 valued the market for flip-chip ball grid array (FC-BGA) substrates at $7.5 billion in 2025, up 18 percent from 2024 ([source](https://ats.net/en/download/annual-report-2025-26/?wpdmdl=61788))."

## Chapter 13, Test and Assembly
- Advantest, Amkor, Disco: unchanged, sources attached (Advantest FY2025 note p.13: "overall market share estimate increased to approximately 65%"; Amkor ex99.1; ETO N71, CSET/TechInsights: Disco 87.0, market "$1.9 billion (2025)").
- Teradyne: dropped "Second in testers, with" (not in the cited 10-K) -> "$2.52bn of semiconductor test revenue in 2025, service included". 10-K: Semiconductor Test revenue $2,523.7m (2025).
- ASE: "Largest assembly and test contractor; $20.6bn of 2025 revenue, about 59 percent from packaging and test" -> "Ran 8,348 testers in Q2 2026, up from 6,797 a year earlier". Source ASE 2Q26 6-K: "Number of Testers 8,348 / 7,585 / 6,797" (2Q26, 1Q26, 2Q25). The old line had a semicolon, three facts, and a summed figure (see errors).
- chinaStatus s1: "gained share in test tools and 4 percentage points" -> "gained 5 percentage points of share in test tools and 4 points" (the 5 had dropped out; CSET: test tools +5 pp).
- usStatus: s1 "American firms such as Teradyne and FormFactor are strong in test machines and probe cards." (no single source; vague) -> "American firms held 23.5 percent of the market for test tools in 2025 and Japanese firms 63.0 percent, by CSET's analysis of TechInsights data." s2 -> "Amkor raised its planned investment in an Arizona packaging and test campus to $7 billion in October 2025." s3 -> "In June 2026 it announced a long-term partnership with TSMC, which will buy packaging and test services from it in Arizona." Sources: ETO N120 (CSET dataset: USA 23.5, JPN 63.0, TechInsights data published 3 Jul 2026); Amkor 6 Oct 2025; TSMC-Amkor 16 Jun 2026: "a 10-year agreement ... for TSMC to procure from Amkor advanced packaging and testing services".
- costSignal (was ASE's revenue; Amkor; semicolon) -> "About $9.0 billion market for chip testers in 2025, by Advantest's estimate". Source Advantest FY2025 note p.13: "tester market size in CY2025 ... totaling around 9.0 billion USD".
- test: "No test or assembly tool has only one maker, but switching testers means rebuilding the customer's whole test setup." (first half uncited in the body) -> "Rated on test tools, where Advantest held 62.7 percent of the market in 2025 and Teradyne 21.8 percent, by CSET's analysis of TechInsights data." Source ETO N120.
- why: three sentences (s1 "customers have approved machines from both" and s2 "several makers" had no source; s3 restated the site's band definition) -> "Customers already buy testers from both firms. The barrier is the cost of switching, which Advantest says means rebuilding a customer's whole test setup." Sources ETO N120; Advantest Investors Guide Apr 2025 p.14: "Changing tester selection is synonymous with customers having to reconstruct their entire environment".
Body sentences added (Who makes it, new paragraph after Teradyne):
"CSET's analysis of TechInsights data gives Advantest 62.7 percent of the $9.1 billion market for test tools in 2025 and Teradyne 21.8 percent ([source](https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N120)). Japanese firms held 63.0 percent of that market and American firms 23.5 percent ([source](https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N120))."
Checked: the URL opens the Testing panel with Test tools selected (headless shot qa/round2/scratch/cards-c/eto-n120-detail.png); numbers from CSET's dataset (github.com/georgetown-cset/eto-supply-chain, provision.csv and inputs.csv, node N120).

## Chapter 14, Systems and Networking
- Nvidia: "NVLink and NVSwitch for links inside a rack; InfiniBand and Spectrum-X Ethernet between racks" -> "NVLink, InfiniBand and Spectrum-X Ethernet, which it credited for data center growth in the quarter to April 2026". Source 10-Q to 26 Apr 2026: "demand for our InfiniBand, Spectrum-X Ethernet, and NVLink solutions".
- Broadcom: "Tomahawk switch chips sold to any buyer, and custom AI accelerators" (two facts, neither cited in the body) -> "$16.7B of AI semiconductor revenue in the quarter to August 2026, up 221%". Source 8-K ex99 (2 Sep 2026, quarter ended 2 Aug 2026): "Q3 AI semiconductor revenue of $16.7 billion grew 221% year-over-year".
- Foxconn: "...by its own account; building a factory in Houston" -> "World's largest AI server provider, its chairman said in March 2026". Source Hon Hai, 16 Mar 2026: "Foxconn, as the world's largest AI server provider". (Houston stays in usStatus.)
- InnoLight: "High-speed optical modules; sites in Suzhou, Taiwan and Thailand" -> "High-speed optical modules from sites in Suzhou, Taiwan and, since 2019, Thailand". Source innolight.com/about: "InnoLight established the Thailand high volume manufacturing plant in 2019".
- Coherent: "Indium phosphide lasers and data center transceivers" (no body source) -> "Lasers and optical networking products, with a $2B Nvidia investment agreed in March 2026". Source Nvidia/Coherent, 2 Mar 2026: "NVIDIA to Invest $2 Billion in Coherent" ... "advanced laser and optical networking products".
- chinaStatus: s1 adds "since 2019" (InnoLight about); s2 split in two (two sources): "In February 2025 China put indium under new export restrictions." (USGS MCS 2026: "In February 2025, China's Ministry of Commerce subjected several critical minerals, including indium, to new export restrictions.") "The same month it began requiring export permits for indium phosphide substrates, the wafers the lasers are grown on." (AXT 10-Q to Jun 2026: "On February 4, 2025, China added indium phosphide substrates to its export control list ... all require permits").
- usStatus s1 "American firms make the switch chips, the links that join accelerators inside a rack, and the lasers." (no single source) -> "Nvidia said in August 2026 that Coherent had broken ground in Sherman, Texas, on an expanded factory for lasers and optical components." s2 -> "It also said that Wistron's new plant ... and that Foxconn was building a factory in Houston." Source for both: Nvidia blog 5 Aug 2026 ("In Sherman, Texas, Coherent ... broke ground this month on its expanded facility"; "Coherent's new Texas-based factory will produce the lasers, optical components and compound semiconductors"; Wistron "already producing the NVIDIA GB300 Grace Blackwell Ultra Superchip"; "In Houston, Texas, Foxconn is building a state-of-the-art factory").
- costSignal (was Nvidia's investment in two suppliers) -> "$3.1 million for one GB200 NVL72 rack bought by a typical hyperscaler, or about $3.9 million with networking, storage and other items, by SemiAnalysis's August 2025 estimate". Source SemiAnalysis, 20 Aug 2025: "the GB200 NVL72, the rack scale server alone costs $3.1M for a typical hyperscaler. Including networking, storage and other items, all in cost comes up to about $3.9M per rack."
- test: one sentence with a colon and two facts, "few firms make the lasers" unsourced -> "Rated on NVLink and its NVSwitch chips, which Nvidia controls and which join the accelerators in a rack. The other concentrated part is the lasers for the optical links, for which Nvidia bought future capacity rights from Lumentum in March 2026." Sources: NVLink Fusion release, 18 May 2025 ("lets industries build semi-custom AI infrastructure with ... NVIDIA NVLink"); Nvidia/Lumentum 2 Mar 2026 ("future capacity access rights for advanced laser components").
- why: removed s1 "Rack assembly can be moved, though the move would likely take several quarters, an unsourced estimate."; split s2 into two sentences (UALink blog: "UALink is an open standard designed to enable effective accelerator communications and expansion within a pod"; AMD 23 Jul 2026: "AMD Helios combines UALink over Ethernet (UALoE) for high-performance scale-up"); s3 unchanged (NVLink Fusion).
Body sentences added:
1. How it works, rack paragraph: "SemiAnalysis estimated in August 2025 that a GB200 NVL72 rack cost a typical hyperscaler $3.1 million, or about $3.9 million with networking, storage and other items ([source](https://newsletter.semianalysis.com/p/h100-vs-gb200-nvl72-training-benchmarks))."
2. Who makes it, after the Lumentum sentence: "Coherent, another of them, broke ground in Sherman, Texas, in August 2026 on an expanded factory for lasers and optical components, Nvidia said ([source](https://blogs.nvidia.com/blog/nvidia-and-partners-build-in-america-for-america/))."
No allowed source found for "few firms make the lasers" (also in the oneLiner, plain and an uncited body sentence). Searched SemiAnalysis, Nikkei and company sites; only vendor blogs citing LightCounting turned up.

## Chapter 15, Data Centers and Power
- GE Vernova, Hitachi Energy, Siemens Energy, Mitsubishi Power: text unchanged; source GE Vernova 2025 10-K ("Key Power segment competitors include Siemens Energy, Mitsubishi Power..."; "Key Electrification segment competitors include Hitachi Energy, Siemens Energy, Siemens, Schneider Electric, Mitsubishi Electric, and ABB"; Electrification offerings include "power transformers, switchgear"; "Prolec GE ... producing transformers").
- Vertiv: unchanged; source Nvidia blog 13 Oct 2025 ("Data center power system providers: ABB, Eaton, GE Vernova, Heron Power, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv").
- Schneider Electric: "Electrical distribution and cooling" (two facts, two sources) -> "Cooling, through its Motivair division". Source Nvidia blog 21 Jun 2026: "Motivair, the advanced cooling division of Schneider Electric, has worked alongside NVIDIA's product roadmap for nearly a decade".
- chinaStatus: unchanged; IEA Energy and AI ES ("followed by China (25%)"), IEA Electricity 2025 ES (data centres "around 3%" of China's 2022-2024 demand growth).
- usStatus: "The United States has the demand and the money but cannot shorten the wait for equipment. Constellation expects to restart the Crane nuclear plant for Microsoft in 2027." (s1 opinion; s2 two sources) -> "US factories supplied 29.2 percent of the large power transformers bought in the United States in 2023, measured by capacity. Constellation said in August 2026 that it expects to restart the Crane nuclear plant in 2027. Microsoft has agreed to buy its power." Sources: USITC pub 5531 p.31 ("The domestic industry's share of apparent U.S. consumption decreased ... to 29.2 percent in 2023", apparent consumption in MVA); Constellation 6 Aug 2026 ("moving us closer to restarting operations in 2027"); Constellation 19 Feb 2025 ("power purchase agreement with Microsoft to restart Three Mile Island Unit 1").
- costSignal (was a transformer lead time; the oneLiner, body and why keep it) -> "$580 billion of data center investment expected worldwide in 2025, in the International Energy Agency's November 2025 outlook". Source IEA World Energy Outlook 2025 ES (12 Nov 2025): "Investment in data centres is expected to reach USD 580 billion in 2025."
- test: "Nvidia names nine ... for its gigawatt designs." -> "Nvidia named nine data center power system providers for its 800-volt gigawatt designs in October 2025." (count dated).
- why: s1 "A buyer can choose among suppliers, but money cannot shorten the wait." (opinion) -> "Buyers of grid equipment can choose among suppliers, and GE Vernova's 2025 annual report names Hitachi Energy, Siemens Energy, Schneider Electric and ABB among its key competitors."; s2 "In 2024, the longest..." -> "But in 2024 the longest large power transformer lead times reached 60 months." (DOE LPT report p.8: "36-month lead times being commonly quoted and maximum lead times reaching as much as 60 months"); s3 unchanged (IEA grid ES: "up to four years to secure large power transformers").
Body sentence added (Who makes it, after the Epoch capex sentences): "The International Energy Agency expected worldwide investment in data centers to reach $580 billion in 2025 ([source](https://www.iea.org/reports/world-energy-outlook-2025/executive-summary))."
The oneLiner was not touched.

## Errors found outside the card fields (not fixed: body and countries are outside this brief)
- ch 13 body, "The chokepoint": "ASE's packaging and test business took about $12.1 billion from outside customers in 2025" is a sum. The 20-F segment note gives revenue from external customers of US$9,829,219 thousand (packaging) and US$2,292,006 thousand (testing), and no combined figure.
- ch 13 body, "The back end's geography": "About 59 percent of that came from packaging and test" is a sum. The 6-K says "packaging operations, testing operations, EMS operations and others represented approximately 48%, 11%, 40% and 1%".
- ch 13 body: "ASE, the biggest, billed $20.6 billion in 2025" rounds the XBRL value of US$20,573,405,000, and the cited source does not say "the biggest". "Unlike lithography, no test or assembly tool has a single supplier." has no citation.
- ch 14 body, uncited claims: "Broadcom sells the Ethernet switch chips that other firms build their switches around, along with custom AI accelerators."; "NVLink and its switch chip, NVSwitch, are Nvidia's own designs."; "The lasers inside those modules come from far fewer firms."; and the "several quarters" estimate, which the body itself calls unsourced.
- ch 11 body: "Each of those packaging steps is ordinary on its own." has no citation.
- Semicolons remain in the countries notes (ch 13 TW; ch 14 TW and CN). Countries were outside this brief.

## New bibliography entries

```json
{
  "https://newsletter.semianalysis.com/p/h100-vs-gb200-nvl72-training-benchmarks": {"title": "H100 vs GB200 NVL72 Training Benchmarks - Power, TCO, and Reliability Analysis, Software Improvement Over Time", "publisher": "SemiAnalysis", "date": "2025-08-20", "type": "article", "accessed": "2026-10-20"},
  "https://www.nist.gov/news-events/news/2024/12/biden-harris-administration-announces-chips-incentives-awards-absolics-and": {"title": "Biden-Harris Administration Announces CHIPS Incentives Awards with Absolics and Entegris to Support Development of Advanced Packaging Technology and Onshore Material for Leading-Edge Chip Production", "publisher": "NIST", "date": "2024-12-05", "type": "press release", "accessed": "2026-10-20"},
  "https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N120": {"title": "Supply Chain Explorer: Advanced Chips", "publisher": "Emerging Technology Observatory (ETO)", "type": "page", "accessed": "2026-10-20"},
  "https://www.iea.org/reports/world-energy-outlook-2025/executive-summary": {"title": "Executive summary – World Energy Outlook 2025", "publisher": "International Energy Agency", "date": "2025-11-12", "type": "report", "accessed": "2026-10-20"}
}
```

## Pages for card URLs into PDFs of 10 or more pages (for apply-pages; file page index)
apply-pages copies a page onto the card only when the chapter's body cites that PDF at one page. Where the body cites it at several pages, use these:
- ch 11 testSources[0], TSMC 2Q26 transcript (22 pp): #page=10
- ch 12 Ajinomoto leader, 20260630_presentation_E.pdf (35 pp): #page=3. ch 12 whySources[0], same PDF: #page=9
- ch 12 Nitto Boseki leader and chinaSources[1], Integrated Report 2025 (35 pp): #page=4
- ch 12 testSources[0] and whySources[1], MGC 2410022e.pdf (28 pp): #page=12
- ch 12 usSources[0], 100-day review (250 pp): #page=43
- ch 12 costSources[0], AT&S Annual Report 2025/26 (271 pp): #page=33
- ch 13 Advantest leader and costSources[0], JE_BIZ_260427_note.pdf (17 pp): #page=13
- ch 13 whySources[1], Investors_Guide_2504E.pdf (16 pp): #page=14
- ch 15 usSources[0], USITC pub 5531 (282 pp): #page=31
- ch 15 whySources[1], DOE LPT report (53 pp): #page=8
Under 10 pages, no fragment: Unimicron 2Q26 (9), Ibiden Q&A (4), USGS indium (2).

## Access notes
- pr.tsmc.com, investor.tsmc.com, semi.org and iea.org return a Cloudflare challenge to curl. TSMC transcripts were read from WebFetch's saved copy with pdftotext. pr.tsmc.com/english/news/3302 was read through WebFetch. IEA pages were checked against Internet Archive copies (web.archive.org/web/2026id_/ and 2025id_/<url>), and the citations stay on iea.org. No CAPTCHA was attempted.
- Raw downloads are in qa/round2/scratch/cards-c/ (raw/ and .txt renderings).

## Checks (after the last edit)
- node build/build.js: exit 0, no warnings; "source tiers: A 501 · B 28 · disallowed 0 · unclassified 0".
- node qa/scripts/check-speak.js: "check-speak: no matches".
- node qa/scripts/check-integrity.js: only the known "exposure row for Veeco Instruments has no supplier entry". An earlier run warned "a figure with no year" on two-sentence cost slots in ch 11 and ch 14; each became one dated sentence.
- node qa/scripts/check-sources.js: "2416 citations, all tier A or B".
- Own check (front matter JSON, URL in body, sentence count = URL count, key order, no semicolons, plain = first How it works paragraph): 0 problems in all five chapters.

## Screenshots (qa/round2/shots/cards-c/)
advanced-packaging-desktop.png, advanced-packaging-mobile.png, substrates-and-pcbs-desktop.png, substrates-and-pcbs-mobile.png, test-and-assembly-desktop.png, test-and-assembly-mobile.png, systems-and-networking-desktop.png, systems-and-networking-mobile.png, data-centers-and-power-desktop.png, data-centers-and-power-mobile.png. Each shot is scrolled to the card on the static page.
