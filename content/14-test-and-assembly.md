---json
{
  "id": "test-and-assembly",
  "number": 14,
  "title": "Test and Assembly",
  "oneLiner": "The back end decides which dies are allowed into a package that costs more than a car. One Japanese firm now sells two thirds of the world's chip testers.",
  "plain": "Before a chip can be sold, a machine has to interrogate it and check every answer. Needles finer than a hair land on pads on the wafer and drive test patterns into each chip; the ones that answer wrong are marked and never leave. It matters more each year because of arithmetic: a modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests earlier, hotter and longer than it used to, and two companies sell most of the machines that do it.",
  "specimen": "probe-card",
  "specimenCaption": "Right: a probe card over a wafer. A printed circuit board carries the tester's signals to a MEMS probe head whose needles land on pads a few tens of micrometres across, all of them within microns of the same plane.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Advantest", "country": "JP", "share": "65% of the tester market in 2025"},
      {"name": "Teradyne", "country": "US", "share": "Most of the remainder with Advantest, about 80% combined"},
      {"name": "ASE", "country": "TW", "share": "US$20.6bn of 2025 revenue, the largest OSAT"},
      {"name": "Amkor", "country": "US", "share": "US$6.71bn of 2025 revenue"},
      {"name": "Disco", "country": "JP", "share": "Leading share in dicing saws, grinders and blades"}
    ],
    "countries": [
      {"code": "TW", "note": "ASE, Powertech, KYEC and ChipMOS; the largest assembly and test cluster"},
      {"code": "JP", "note": "Advantest testers, Disco dicing and grinding, Micronics Japan probe cards"},
      {"code": "US", "note": "Teradyne, FormFactor, Cohu, Aehr; Amkor's Arizona packaging plant"},
      {"code": "CN", "note": "Four of the top ten OSATs by 2024 revenue are China-headquartered"},
      {"code": "MY", "note": "Penang and Kulim; Malaysia ships about 13% of the world's packaged chips"}
    ],
    "chinaStatus": "The back end is where China is most competitive. CSET counts four of the top ten OSATs by 2024 revenue as China-headquartered, and back-end equipment is far less tightly controlled than lithography or deposition.",
    "usStatus": "Strong in test equipment and probe cards through Teradyne, FormFactor, Cohu and Aehr, weak in assembly capacity. Amkor is building a US$7 billion packaging and test campus in Arizona and has a long-term partnership with TSMC to fill it.",
    "costSignal": "ASE and Amkor alone billed US$27.3 billion in 2025; ASE spent US$4.1 billion on machinery and buildings in the first half of 2026",
    "substitution": {"years": "3-5", "why": "Assembly and test floors can be built in a few years, but changing tester vendor means rebuilding the entire device development, evaluation and production test environment, so customers almost never switch."}
  },
  "keyFacts": [
    {"fact": "Advantest estimates its overall tester market share at about 65% in CY2025, with 66% of SoC test (up about 10 points year on year) and about 60% of memory test", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "The CY2025 tester market was about US$9.0 billion: US$6.9 billion of SoC testers, up about 68% year on year, and US$2.1 billion of memory testers", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "Advantest and Teradyne together hold about 80% of the tester market", "source": "https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf"},
    {"fact": "Teradyne's 2025 revenue was US$3.19 billion, up 13%, with fourth-quarter growth of 44% driven by AI compute and memory test", "source": "https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results"},
    {"fact": "Technoprobe's 2025 revenue was EUR 628.4 million, up 15.7%, with about 38% of revenue from AI applications", "source": "https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf"},
    {"fact": "Aehr received a US$22 million follow-on order for AI processor wafer-level burn-in systems in August 2026", "source": "https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/"},
    {"fact": "ASE's installed tester count rose from 6,797 in the second quarter of 2025 to 8,348 a year later, and it spent US$2.7 billion on machinery and US$1.4 billion on buildings in the first half of 2026", "source": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011353/dp250875_6k.htm"},
    {"fact": "Four of the top ten OSATs by 2024 revenue are China-headquartered", "source": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"},
    {"fact": "Malaysia ships about 13% of the world's packaged chips and is targeting 7% of advanced packaging shipments by 2035", "source": "https://www.mida.gov.my/advanced-packaging-how-malaysia-is-packaging-the-future-of-ai/"}
  ],
  "figures": [
    {
      "id": "ate-share",
      "type": "stack",
      "title": "Automated test equipment: share of the ~US$9.0bn tester market, 2025",
      "unit": "%",
      "data": [["Advantest", 65], ["Teradyne and all others", 35]],
      "source": {"label": "Advantest FY2025 results briefing, April 2026", "url": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"}
    },
    {
      "id": "tester-market",
      "type": "stack",
      "title": "Where the tester money went in calendar 2025",
      "unit": "US$bn",
      "data": [["SoC testers", 6.9], ["Memory testers", 2.1]],
      "source": {"label": "Advantest FY2025 results briefing, April 2026", "url": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"}
    },
    {
      "id": "ase-testers",
      "type": "bars",
      "title": "Testers installed at ASE, the largest OSAT",
      "unit": "testers",
      "data": [["Q2 2025", 6797], ["Q1 2026", 7585], ["Q2 2026", 8348]],
      "source": {"label": "ASE Technology Holding, second quarter 2026 earnings release (SEC Form 6-K)", "url": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm"}
    }
  ]
}
---
# Test and Assembly

Semiconductor manufacturing runs to 400 to 600 steps, and Advantest counts test as the only one that handles electricity ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Everything before this chapter makes dies; the back end decides which of them are allowed into a package.

## How it works

Before a chip can be sold, a machine has to interrogate it and check every answer. Needles finer than a hair land on pads on the wafer and drive test patterns into each chip; the ones that answer wrong are marked and never leave. It matters more each year because of arithmetic: a modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests earlier, hotter and longer than it used to, and two companies sell most of the machines that do it.

Each round of test catches failures the round before it cannot.

- **Wafer sort.** Thousands of needles land on the pads of each die while a tester drives patterns in and checks the answers; failures never leave the wafer.
- **Burn-in.** Run the part hot and at voltage for hours to force early failures out before assembly.
- **Final test.** The packaged part is tested again, because packaging introduces its own failures.
- **System-level test.** The finished part runs in a socket against something close to a real workload, because some failures appear only when everything runs at once.

Known-good die is what changed. Aehr screens early-life and latent failures before dies are cut from the wafer, so a weak processor never reaches high-bandwidth memory and an expensive substrate ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)). Its lead AI customer is moving burn-in from system level entirely onto the wafer, nine 300 mm wafers at a time ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).

## Variants and trade-offs

### Wafer sort and known-good die

Probe cards are the hard part. For HBM the card must contact a stack of eight, twelve or sixteen DRAM dies at speed with signal integrity intact ([source](https://www.sec.gov/Archives/edgar/data/1039399/000103939926000009/form-20251227.htm)). For a reticle-sized logic die every needle must sit in the same plane, survive repeated touchdowns without drifting, and do it at temperature. Cards are custom to the device, so each new part means a new card and a new qualification.

### Final test, burn-in and system-level test

The economics get worse as packages grow. TSMC has told investors its CoWoS roadmap runs beyond 14 times reticle size ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)). Every die in a body that size is another chance to throw the whole assembly away, which is why test insertions multiply instead of consolidating. ASE ran 6,797 testers in the second quarter of 2025 and 8,348 a year later ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm)).

{{figure:ate-share}}

## Who makes it

Advantest puts its own share at about 65% of a US$9.0 billion tester market in 2025: 66% of SoC test, up ten points in a year, and about 60% of memory test ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf)). It and Teradyne hold about 80% between them ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Teradyne grew 13% to US$3.19 billion for 2025, with fourth-quarter revenue up 44% on AI demand ([source](https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results)).

{{figure:tester-market}}

Below the two testers, each segment has its own leader.

- **Probe cards.** FormFactor took US$785.0 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001039399/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)); Technoprobe grew 15.7% to EUR 628.4 million, 38% of it from AI, and plans to double capacity by the end of 2027 ([source](https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf)).
- **Handlers and burn-in.** Cohu took US$453.0 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000021535/us-gaap/RevenueFromContractWithCustomerIncludingAssessedTax.json)); Aehr did US$50.0 million in fiscal 2026 but booked a record US$60.7 million in the fourth quarter alone and guides to US$130 million to US$150 million in fiscal 2027 ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).
- **Dicing and grinding.** Disco leads in wafer grinders and dicing saws ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)), and its newest package saw handles workpieces up to 400 by 400 mm for panel-level work ([source](https://www.disco.co.jp/eg/news/corp/20251215_1.html)).
- **Bonding.** Kulicke and Soffa did US$654.1 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000056978/us-gaap/Revenues.json)), while Besi's second-quarter 2026 revenue rose 68.7% to EUR 249.9 million on hybrid bonding and datacentre demand ([source](https://www.besi.com/investor-relations/press-releases/2025/details-1/be-semiconductor-industries-nv-announces-q2-26-and-h1-26-results/)).

Thermocompression bonders, which stack HBM and place chiplets on substrates, are the tightest niche. ASMPT took a repeat order for fifteen chip-to-substrate bonders in December 2025 and expects that market to pass US$1 billion by 2027, of which it means to hold 35 to 40% ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-secures-additional-orders-for-fifteen-chip-to-substrate-thermo-compression-bonding-tools-driven-by-ai-tailwind/)). See Memory and HBM.

## The back end's geography

Outsourced assembly and test is a Taiwanese business with a large Chinese challenger. ASE, the biggest of them, billed US$20.6 billion in 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001122411/ifrs-full/Revenue.json)); CSET counts four of the top ten OSATs by 2024 revenue as China-headquartered ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Malaysia ships about 13% of the world's packaged chips and wants 7% of advanced packaging shipments by 2035 ([source](https://www.mida.gov.my/advanced-packaging-how-malaysia-is-packaging-the-future-of-ai/)).

ASE spent US$2.7 billion on machinery and US$1.4 billion on buildings and automation in the first half of 2026, and says revenue from leading-edge advanced packaging is running ahead of its US$3.5 billion guidance for the year ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326011353/dp250875_6k.htm)). Powertech is chasing the first panel-level packaging line for AI chips in 2027 ([source](https://asia.nikkei.com/business/tech/semiconductors/powertech-eyes-world-s-first-panel-level-packaging-for-ai-chips-in-2027)).

Amkor took US$6.71 billion of revenue in 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001047127/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)) and US$1.90 billion in the second quarter of 2026, up 26% year on year ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000043/amkr6302026erex-991.htm)). It has expanded its Arizona campus to a US$7 billion investment ([source](https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced)). Under a partnership signed in June 2026 ([source](https://ir.amkor.com/news-releases/news-release-details/tsmc-and-amkor-technology-announce-long-term-partnership)) it will run turnkey packaging and test there for TSMC, whose Phoenix fabs sit next door ([source](https://pr.tsmc.com/english/news/3174)).

{{figure:ase-testers}}

## The chokepoint

Unlike lithography, no tool here has a single supplier. What holds a customer is the cost of leaving: Advantest argues that switching tester vendor means rebuilding a customer's entire device development, evaluation and production test environment, which is why share moves slowly ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)).

The back end is also the part of the chain China is closest to owning, and assembly, dicing, bonding and test tools sit outside the export control lines drawn around lithography and deposition. ASE and Amkor billed US$27.3 billion between them in 2025, against industry sales of US$791.7 billion ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)), a small share of the money for a step every chip has to pass through.

## Key evaluation criteria

- **Test coverage** is what you buy: the share of latent failures caught before they reach a package that cannot be reworked.
- **Test time per part** sets throughput and cost, and large dies, HBM stacks and chiplets all push it up.
- **Probe card planarity and life** decide sort economics. Every needle must stay coplanar over a full die across a long touchdown count.
- **Thermal control** matters more every generation. A kilowatt-class accelerator must be held at temperature in the socket while tested at speed.
- **Capacity and geography** are the practical constraint. Taiwan, China and Malaysia hold most of the floor space, and new capacity takes years.

## Takeaways

Test used to be the cheap step at the end. With a dozen expensive dies in one package, it now insures everything upstream: the SoC tester market grew about 68% in 2025 ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf)) and burn-in has started migrating back onto the wafer ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)). Advantest has turned a duopoly into a two-thirds share of the machines, while the assembly floor beneath it stays fragmented and, in four of the top ten OSATs, Chinese ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).
