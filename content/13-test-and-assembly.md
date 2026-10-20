---json
{
  "id": "test-and-assembly",
  "number": 13,
  "title": "Test and Assembly",
  "oneLiner": "Testing finds bad chips before they go into an expensive package. Japan's Advantest took about 65 percent of 2025 spending on chip testers, by its own estimate.",
  "plain": "Before a chip can be sold, a machine called a tester has to check that it works. While the chips are still on the wafer, thousands of needles press onto small metal pads on each one. The tester sends signals through the needles and reads what comes back, and any chip that fails goes no further. A modern AI accelerator is a dozen expensive pieces bonded into one package, and if one piece is bad, all of them are thrown away. So the industry now tests chips earlier, at higher temperatures and for longer, to make weak ones fail during testing before they reach a finished product. Two firms, Advantest in Japan and Teradyne in the United States, sell most of the testers.",
  "bridge": "Nothing yet proves that any of it works, and a package this far along is worth too much to guess about.",
  "specimen": "probe-card",
  "specimenCaption": "A vertical probe card over a wafer. The card is round, about 305 mm across, a little wider than the 300 mm wafer beneath it. Thousands of needles under it land on four dies at once, picked out in blue-violet. The gap between card and wafer is exaggerated. The real gap is a millimeter or two.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Advantest", "country": "JP", "share": "About 65% of the tester market in 2025, by its own estimate", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf#page=13"},
      {"name": "Teradyne", "country": "US", "share": "$2.52bn of semiconductor test revenue in 2025, service included", "source": "https://www.sec.gov/Archives/edgar/data/97210/000119312526059002/ter-20251231.htm"},
      {"name": "ASE", "country": "TW", "share": "Ran 8,348 testers in Q2 2026, up from 6,797 a year earlier", "source": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm"},
      {"name": "Amkor", "country": "US", "share": "$6.71bn of 2025 revenue", "source": "https://www.sec.gov/Archives/edgar/data/1047127/000104712726000007/amkr123125erex-991.htm"},
      {"name": "Disco", "country": "JP", "share": "87% of the $1.9bn market for dicing saws and grinders in 2025, on CSET's analysis of TechInsights data", "source": "https://chipexplorer.eto.tech/?parentNode=N69&selectedNode=N71"}
    ],
    "countries": [
      {"code": "TW", "note": "Taiwanese firms such as ASE and Powertech lead outsourced assembly and test"},
      {"code": "JP", "note": "Advantest testers, Accretech and Tokyo Electron probers, Disco and Accretech dicing and grinding"},
      {"code": "US", "note": "Test equipment from Teradyne, FormFactor, Cohu and Aehr, and Amkor's planned Arizona packaging plant"},
      {"code": "CN", "note": "Four of the top ten assembly and test firms by 2024 revenue, in a TrendForce ranking cited by CSET"},
      {"code": "MY", "note": "Malaysia said in July 2026 that it ships 13% of the world's packaged chips"}
    ],
    "chinaStatus": "Georgetown's CSET, analyzing TechInsights data, finds that between 2019 and 2024 Chinese toolmakers gained 5 percentage points of share in test tools and 4 points in fabrication tools built for advanced packaging. But they lost share in bonding and other conventional assembly and packaging tools.",
    "chinaSources": ["https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/", "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"],
    "usStatus": "American firms held 23.5 percent of the market for test tools in 2025 and Japanese firms 63.0 percent, by CSET's analysis of TechInsights data. Amkor raised its planned investment in an Arizona packaging and test campus to $7 billion in October 2025. In June 2026 it announced a long-term partnership with TSMC, which will buy packaging and test services from it in Arizona.",
    "usSources": ["https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N120", "https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced", "https://ir.amkor.com/news-releases/news-release-details/tsmc-and-amkor-technology-announce-long-term-partnership"],
    "costSignal": "About $9.0 billion market for chip testers in 2025, by Advantest's estimate",
    "costSources": ["https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf#page=13"],
    "substitutability": {"band": "Moderate", "test": "Rated on test tools, where Advantest held 62.7 percent of the market in 2025 and Teradyne 21.8 percent, by CSET's analysis of TechInsights data.", "testSources": ["https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N120"], "why": "Customers such as ASE already buy testers from both firms. The barrier is the cost of switching, which Advantest says means rebuilding a customer's whole test setup.", "whySources": ["https://www.sec.gov/Archives/edgar/data/1122411/000119312526135585/d50802d20f.htm", "https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2607E.pdf#page=12"]}
  },
  "keyFacts": [
    {"fact": "Advantest estimates that it held about 65% of the tester market by value in calendar 2025. It puts its share of system-on-chip (SoC) testers at 66%, up about 10 points in a year, and of memory test at about 60%", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "The tester market was about $9.0 billion in calendar 2025: $6.9 billion of SoC testers, up about 68% year on year, and $2.1 billion of memory testers", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "Advantest's April 2025 investor guide said Advantest and Teradyne together held about 80% of the tester market, and put Advantest's own 2024 share at 58%", "source": "https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf"},
    {"fact": "Teradyne's semiconductor test revenue was $2.52 billion in 2025, including system-level testers and service", "source": "https://www.sec.gov/Archives/edgar/data/97210/000119312526059002/ter-20251231.htm"},
    {"fact": "Teradyne's 2025 revenue was $3.19 billion, up 13%, with fourth-quarter growth of 44% driven by AI compute and memory test", "source": "https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results"},
    {"fact": "Technoprobe's 2025 revenue was EUR 628.4 million, up 15.7%, with about 38% of revenue from AI applications", "source": "https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf"},
    {"fact": "Aehr received a further $22 million order for AI processor wafer-level burn-in systems in August 2026", "source": "https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/"},
    {"fact": "ASE's installed tester count rose from 6,797 in the second quarter of 2025 to 8,348 a year later", "source": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm"},
    {"fact": "ASE spent $2.7 billion on machinery and $1.4 billion on buildings, facilities and automation in the first half of 2026", "source": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011353/dp250875_6k.htm"},
    {"fact": "Four of the top ten outsourced assembly and test firms by 2024 revenue are headquartered in China, in a TrendForce ranking cited by CSET", "source": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"},
    {"fact": "Malaysia's investment agency said in July 2026 that the country ships 13% of the world's packaged chips. It said a consortium of five Malaysian firms aims to help the country capture 7% of world advanced packaging shipments by 2035", "source": "https://www.mida.gov.my/advanced-packaging-how-malaysia-is-packaging-the-future-of-ai/"},
    {"fact": "Malaysia held 7% of global assembly, test and packaging capacity in 2022, the largest share in Southeast Asia, which held about 20% in all. Capacity is measured as factory floor space at contractors and chipmakers' own plants", "source": "https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf"}
  ],
  "figures": [
    {"id": "wafer-probe", "type": "animation", "src": "wafer-test", "title": "How a chip is tested", "note": "Simplified. Nine needles stand for thousands. In a real prober the card stays still and the wafer is raised to meet the needles. The failed chips are placed for illustration and do not reflect a real yield. The package follows chapter 11: two logic chips and eight memory stacks on an interposer and a package base."},
    {
      "id": "ate-share",
      "type": "stack",
      "title": "Automated test equipment: share of the ~$9.0bn tester market, 2025",
      "unit": "%",
      "data": [["Advantest", 65], ["Teradyne and all others", 35]],
      "source": {"label": "Advantest FY2025 results briefing, April 2026", "url": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf#page=13"}
    },
    {
      "id": "tester-market",
      "type": "stack",
      "title": "Where the tester money went in calendar 2025",
      "unit": "$bn",
      "data": [["SoC testers", 6.9], ["Memory testers", 2.1]],
      "source": {"label": "Advantest FY2025 results briefing, April 2026", "url": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf#page=13"}
    },
    {
      "id": "ase-testers",
      "type": "bars",
      "title": "Testers installed at ASE, a Taiwanese assembly and test contractor",
      "unit": "testers",
      "data": [["Q2 2025", 6797], ["Q1 2026", 7585], ["Q2 2026", 8348]],
      "source": {"label": "ASE Technology Holding, second quarter 2026 earnings release (SEC Form 6-K)", "url": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm"}
    }
  ]
}
---
# Test and Assembly

Turning silicon into a finished, packaged chip takes 1,000 to 1,500 steps, depending on how complex the chip is, the Semiconductor Industry Association estimated in 2025 ([source](https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1#page=2)). Advantest's investor guide of July 2026 says test is the only step that puts electrical signals through the chip ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2607E.pdf#page=10)). The earlier stages of chipmaking make dies, the individual chips on a wafer. The back end of the industry, assembly and test, checks which of them work and puts the good ones into packages.

## How it works

Before a chip can be sold, a machine called a tester has to check that it works. While the chips are still on the wafer, thousands of needles press onto small metal pads on each one. The tester sends signals through the needles and reads what comes back, and any chip that fails goes no further. A modern AI accelerator is a dozen expensive pieces bonded into one package, and if one piece is bad, all of them are thrown away. So the industry now tests chips earlier, at higher temperatures and for longer, to make weak ones fail during testing before they reach a finished product. Two firms, Advantest in Japan and Teradyne in the United States, sell most of the testers.

{{figure:wafer-probe}}

Each round of test catches failures the round before it cannot see.

- **Wafer sort.** Thousands of needles land on each die while it is still on the wafer. A tester sends in test patterns and checks the answers, and dies that fail go no further.
- **Burn-in.** The part runs hot and at raised voltage for minutes to days, on the wafer or in the package, so that early-life failures happen in the factory, before the part ships ([source](https://www.sec.gov/Archives/edgar/data/1040470/000165495426006919/aehr_10k.htm)).
- **Final test.** The tester checks the packaged part again, because packaging adds failures of its own.
- **System-level test.** The finished part sits in a socket and runs something close to a real workload, because some failures appear only when everything runs at once.

As the parts in a package grow more valuable, finding a bad die before packaging matters more ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)). Aehr's wafer-level burn-in systems look for early-life and hidden failures before dies are cut from the wafer ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)). Catching those failures early lowers the risk of packaging high-bandwidth memory and an expensive substrate with a processor that may later fail ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)). Aehr says its lead AI customer is moving all burn-in for its AI accelerators from the system level to the wafer ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)). The FOX-XP systems that customer ordered from Aehr in August 2026 each burn in nine 300 mm wafers at a time ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)).

## Variants and trade-offs

### Wafer sort and known-good die

The hard part of wafer sort is the probe card, the circuit board that holds the needles. FormFactor says the high-frequency capability of its probe cards lets it compete favorably in testing high-bandwidth memory, a stack of eight, twelve or sixteen memory dies ([source](https://www.sec.gov/Archives/edgar/data/1039399/000103939926000009/form-20251227.htm)). For a large logic die every needle must sit in the same plane, survive repeated touchdowns without drifting, and do it hot. Each card is built for one chip design, so every new design needs a new card and a new qualification.

### Final test, burn-in and system-level test

The bigger the package, the more one bad die can cost. TSMC has told investors that its CoWoS packaging roadmap runs beyond 14 times the area a lithography machine can print in one shot ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf#page=16)). A die that fails after assembly wastes the memory and substrate joined to it ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)). ASE, a Taiwanese assembly and test contractor, ran 6,797 testers in the second quarter of 2025 and 8,348 a year later ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm)).

{{figure:ate-share}}

## Who makes it

Advantest puts its own share at about 65 percent of an estimated $9.0 billion tester market in 2025 ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf#page=13)). Its share of system-on-chip (SoC) testers, the machines that test processors and other non-memory chips, rose about ten points in a year to 66 percent ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf#page=13)). It held about 60 percent of memory test ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf#page=13)).

Teradyne, Advantest's main rival, took $2.52 billion of semiconductor test revenue in 2025, service included ([source](https://www.sec.gov/Archives/edgar/data/97210/000119312526059002/ter-20251231.htm)). Of that, $1.89 billion came from SoC testers and $505 million from memory testers ([source](https://www.sec.gov/Archives/edgar/data/97210/000119312526059002/ter-20251231.htm)). Teradyne's total revenue grew 13 percent to $3.19 billion in 2025, with fourth-quarter revenue up 44 percent on AI demand ([source](https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results)).

Georgetown University's CSET, analyzing TechInsights data, gives Advantest 62.7 percent of the $9.1 billion market for test tools in 2025 and Teradyne 21.8 percent ([source](https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N120)). Japanese firms held 63.0 percent of that market and American firms 23.5 percent ([source](https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N120)).

{{figure:tester-market}}

The rest of the test and assembly equipment market splits into niches, each with its own suppliers.

- **Probe cards.** FormFactor took $785.0 million of revenue in fiscal 2025, most of it from probe cards ([source](https://www.sec.gov/Archives/edgar/data/1039399/000103939926000009/form-20251227.htm)). Technoprobe's revenue grew 15.7 percent to EUR 628.4 million in 2025, about 38 percent of it from AI ([source](https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf#page=1)). It aims to double its manufacturing capacity by the end of 2027 ([source](https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf#page=1)).
- **Probers**, the machines that move each wafer under the probe card and keep it at a set temperature. Tokyo Seimitsu, which sells under the Accretech name, says its own research gives it the largest global share in probers ([source](https://www.accretech.com/en/ir/index/main/00/teaserItems1/00/linkList/02/link/IntegratedReport2025_E.pdf#page=6)). Tokyo Electron makes probers too ([source](https://www.tel.com/product/precio.html)). CSET's analysis of TechInsights data gives Tokyo Electron 19.9 percent and Accretech 17.1 percent of the $2.9 billion market for handlers and probers in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N78&selectedNode=N83)).
- **Handlers and burn-in**, the machines that feed packaged parts into a tester and hold them at a set temperature, and the systems that run burn-in. Cohu took $453.0 million of revenue in fiscal 2025 ([source](https://www.sec.gov/Archives/edgar/data/21535/000143774926004339/cohu20251227_10k.htm)). Aehr's revenue was $50.0 million in fiscal 2026, but it booked a record $60.7 million of orders in the fourth quarter alone ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)). It expects revenue of $130 million to $150 million in fiscal 2027 ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).
- **Dicing and grinding.** Dicing saws cut wafers into dies, and grinders thin them. CSET's analysis of TechInsights data found that in 2025 Disco held 87 percent and Accretech 8.1 percent of the $1.9 billion market for these machines ([source](https://chipexplorer.eto.tech/?parentNode=N69&selectedNode=N71)). In December 2025 Disco announced a saw that cuts panels as large as 400 by 400 mm into individual packages ([source](https://www.disco.co.jp/eg/news/corp/20251215_1.html)).
- **Bonding.** Kulicke and Soffa took $654.1 million of revenue in fiscal 2025 ([source](https://www.sec.gov/Archives/edgar/data/56978/000005697825000078/ex991liveq42025.htm)). Besi's second-quarter 2026 revenue rose 68.7 percent to EUR 249.9 million on hybrid bonding and data center demand ([source](https://www.besi.com/investor-relations/press-releases/2025/details-1/be-semiconductor-industries-nv-announces-q2-26-and-h1-26-results/)).

Thermocompression bonders use heat and force to press memory dies into a stack and to attach chiplets to substrates. ASMPT says it remained the leader in that market in 2025 and aims for a 35 to 40 percent share ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)). In its 2025 results it said it expects the market to reach $1.6 billion by 2028 ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)). In July 2026 ASMPT announced new bulk orders for more than 50 of its chip-to-substrate bonders for AI chips, from outsourced assembly and test firms ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-secures-significant-wins/)). Hanmi Semiconductor in Korea also sells thermocompression bonders, including dual bonders for high-bandwidth memory ([source](https://www.hanmisemi.com/en/product/index.html)). See [Memory and HBM](#memory-and-hbm).

## The back end's geography

Taiwanese firms lead outsourced assembly and test, the OSAT business, and Chinese firms are large challengers. ASE billed $20,573.4 million in 2025 ([source](https://www.sec.gov/Archives/edgar/data/1122411/000119312526135585/d50802d20f.htm)). Packaging made up about 48 percent of that, testing about 11 percent and its electronics manufacturing arm about 40 percent ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326001661/dp241159_6k.htm)). In a TrendForce ranking that CSET cites, four of the top ten OSATs by 2024 revenue are headquartered in China ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).

Malaysia's investment agency said in July 2026 that the country ships 13 percent of the world's packaged chips ([source](https://www.mida.gov.my/advanced-packaging-how-malaysia-is-packaging-the-future-of-ai/)). It said a consortium of five Malaysian firms aims to help the country capture 7 percent of world advanced packaging shipments by 2035 ([source](https://www.mida.gov.my/advanced-packaging-how-malaysia-is-packaging-the-future-of-ai/)). A 2024 study by the Semiconductor Industry Association and Boston Consulting Group gave Malaysia 7 percent of global assembly, test and packaging capacity in 2022, the largest share in Southeast Asia ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=21)). The study measured capacity by factory floor space at contractors and chipmakers' own plants ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=35)).

ASE spent $2.7 billion on machinery and $1.4 billion on buildings, facilities and automation in the first half of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326011353/dp250875_6k.htm)). It says revenue from leading-edge advanced packaging is running ahead of its $3.5 billion forecast for the year ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326011353/dp250875_6k.htm)). Powertech, another Taiwanese assembly and test firm, aims to run the first panel-level packaging line for AI chips in 2027 ([source](https://asia.nikkei.com/business/tech/semiconductors/powertech-eyes-world-s-first-panel-level-packaging-for-ai-chips-in-2027)).

Amkor, an American assembly and test contractor, took $6.71 billion of revenue in 2025 ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000007/amkr123125erex-991.htm)). Its revenue in the second quarter of 2026 alone was $1.90 billion, up 26 percent year on year ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000043/amkr6302026erex-991.htm)). It has raised the planned investment in its Arizona campus to $7 billion ([source](https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced)).

In October 2024 TSMC and Amkor signed a memorandum of understanding for TSMC to buy packaging and test services from Amkor's planned plant in Peoria, Arizona ([source](https://pr.tsmc.com/english/news/3174)). TSMC would use those services for its customers, especially those using its Phoenix fabs ([source](https://pr.tsmc.com/english/news/3174)). The two announced a long-term partnership in June 2026 ([source](https://ir.amkor.com/news-releases/news-release-details/tsmc-and-amkor-technology-announce-long-term-partnership)).

{{figure:ase-testers}}

## The chokepoint

Advantest says that switching to another tester maker means rebuilding the whole test setup used for development, evaluation and mass production, at significant extra cost to the customer ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2607E.pdf#page=12)). Still, ASE says it buys testers with similar functions from different makers, including Teradyne and Advantest ([source](https://www.sec.gov/Archives/edgar/data/1122411/000119312526135585/d50802d20f.htm)).

CSET, analyzing TechInsights data, finds that between 2019 and 2024 Chinese toolmakers gained 5 percentage points of share in test tools and 4 points in fabrication tools built for advanced packaging ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). But they lost share in bonding and other conventional assembly and packaging tools ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). They still lag significantly behind foreign suppliers ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).

ASE's packaging business took $9,829.2 million from outside customers in 2025, and its testing business $2,292.0 million ([source](https://www.sec.gov/Archives/edgar/data/1122411/000119312526135585/d50802d20f.htm)). Amkor took $6.71 billion ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000007/amkr123125erex-991.htm)). Global semiconductor sales that year were $791.7 billion ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)).

## Takeaways

In a TrendForce ranking cited by CSET, four of the ten largest chip assembly and test contractors by 2024 revenue are headquartered in China ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Georgetown's CSET, analyzing TechInsights data, finds that between 2019 and 2024 Chinese toolmakers gained 5 percentage points of share in test tools ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Across assembly, test and packaging tools, they still lag significantly behind foreign suppliers ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Advantest says that switching to another tester maker means rebuilding a customer's whole test setup, at significant extra cost ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2607E.pdf#page=12)).
