---json
{
  "id": "test-and-assembly",
  "number": 14,
  "title": "Test and Assembly",
  "oneLiner": "The back end decides which dies are allowed into a package that costs more than a car. One Japanese firm now sells two thirds of the world's chip testers.",
  "plain": "Before a chip can be sold, a machine has to interrogate it and check every answer. Needles finer than a hair land on pads on the wafer and drive test patterns into each chip; the ones that answer wrong are marked and never leave. Why this matters more each year is arithmetic: a modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests earlier, hotter and longer than it used to, and two companies sell most of the machines that do it.",
  "specimen": "probe-card",
  "specimenCaption": "Right: a probe card over a wafer. A printed circuit board carries the tester's signals to a MEMS probe head whose needles land on pads a few tens of micrometres across, all of them within microns of the same plane.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Advantest", "country": "JP", "share": "65% of the tester market in 2025"},
      {"name": "Teradyne", "country": "US", "share": "Most of the remainder with Advantest, about 80% combined"},
      {"name": "ASE", "country": "TW", "share": "44.6% of top-10 OSAT revenue, 2024"},
      {"name": "Amkor", "country": "US", "share": "15.2% of top-10 OSAT revenue, 2024"},
      {"name": "Disco", "country": "JP", "share": "Leading share in dicing saws, grinders and blades"}
    ],
    "countries": [
      {"code": "TW", "note": "ASE, Powertech, KYEC and ChipMOS; the largest assembly and test cluster"},
      {"code": "JP", "note": "Advantest testers, Disco dicing and grinding, Micronics Japan probe cards"},
      {"code": "US", "note": "Teradyne, FormFactor, Cohu, Aehr; Amkor's Arizona packaging plant"},
      {"code": "CN", "note": "Four of the top ten OSATs by revenue, about 28.6% of top-10 revenue in 2024"},
      {"code": "MY", "note": "Penang and Kulim; about 13% of global assembly, test and packaging"}
    ],
    "chinaStatus": "The back end is where China is most competitive. JCET, Tongfu, Huatian and WiseRoad together took about 28.6% of top-10 OSAT revenue in 2024, and back-end equipment is far less tightly controlled than lithography or deposition.",
    "usStatus": "Strong in test equipment and probe cards through Teradyne, FormFactor, Cohu and Aehr, weak in assembly capacity. Amkor is building a US$7 billion packaging and test plant in Arizona with a ten-year TSMC commitment.",
    "costSignal": "The ten largest OSATs billed US$41.56 billion in 2024; ASE, Powertech and KYEC alone plan about NT$370 billion of capital spending in 2026",
    "substitution": {"years": "3-5", "why": "Assembly and test floors can be built in a few years, but changing tester vendor means rebuilding the entire device development, evaluation and production test environment, so customers almost never switch."}
  },
  "keyFacts": [
    {"fact": "Advantest estimates its overall tester market share at about 65% in CY2025, with 66% of SoC test (up about 10 points year on year) and about 60% of memory test", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "The CY2025 tester market was about US$9.0 billion: US$6.9 billion of SoC testers, up about 68% year on year, and US$2.1 billion of memory testers", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "Advantest and Teradyne together hold about 80% of the tester market", "source": "https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf"},
    {"fact": "Teradyne's 2025 revenue was US$3.19 billion, up 13%, with fourth-quarter growth of 44% driven by AI compute and memory test", "source": "https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results"},
    {"fact": "Technoprobe's 2025 revenue was EUR 628.4 million, up 15.7%, with about 38% of revenue from AI applications", "source": "https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf"},
    {"fact": "Aehr received a US$22 million follow-on order for AI processor wafer-level burn-in systems in August 2026", "source": "https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/"},
    {"fact": "The top ten OSATs billed US$41.56 billion in 2024, with ASE at 44.6% and Amkor at 15.2%", "source": "https://www.trendforce.com/presscenter/news/20250513-12577.html"},
    {"fact": "Malaysia accounts for about 13% of the global assembly, test and packaging market and the Philippines about 10%", "source": "https://www.z2data.com/insights/which-countries-does-the-world-rely-on-for-chip-assembly-packaging"}
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
      "id": "osat-firms",
      "type": "bars",
      "title": "Top 10 OSAT revenue share, 2024",
      "unit": "%",
      "data": [["ASE", 44.6], ["Amkor", 15.2], ["JCET", 12], ["Tongfu", 8], ["Powertech", 5.5], ["Huatian (HT-Tech)", 4.8], ["WiseRoad", 3.8], ["Hana Micron", 2.2], ["KYEC", 2.2], ["ChipMOS", 1.7]],
      "source": {"label": "TrendForce", "url": "https://www.trendforce.com/presscenter/news/20250513-12577.html"}
    },
    {
      "id": "osat-region",
      "type": "stack",
      "title": "Top 10 OSAT revenue by company home country, 2024",
      "unit": "%",
      "data": [["Taiwan", 54.0], ["China", 28.6], ["United States", 15.2], ["South Korea", 2.2]],
      "source": {"label": "TrendForce company shares, summed by headquarters country", "url": "https://www.trendforce.com/presscenter/news/20250513-12577.html"}
    }
  ]
}
---
# Test and Assembly

Everything before this chapter makes dies. The back end decides which are allowed into a package. Among the 400 to 600 steps in semiconductor manufacturing, Advantest notes, test is the only one that handles electricity ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)).

## How it works

Before a chip can be sold, a machine has to interrogate it and check every answer. Needles finer than a hair land on pads on the wafer and drive test patterns into each chip; the ones that answer wrong are marked and never leave. Why this matters more each year is arithmetic: a modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests earlier, hotter and longer than it used to, and two companies sell most of the machines that do it.

Test happens at least three times and increasingly four.

- **Wafer sort.** Thousands of needles land on the pads of each die while a tester drives patterns in and checks the answers; failures never leave the wafer.
- **Burn-in.** Run the part hot and at voltage for hours to force early failures out before assembly.
- **Final test.** The packaged part is tested again, because packaging introduces its own failures.
- **System-level test.** The finished part runs in a socket against something close to a real workload, because some failures appear only when everything runs at once.

The known-good-die problem is what changed. Aehr screens early-life and latent failures before dies are singulated, so a weak processor never reaches high-bandwidth memory and an expensive substrate ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)).

## Variants and trade-offs

### Wafer sort and known-good die

Probe cards are the hard part. For HBM the card must contact a stack of eight, twelve or sixteen DRAM dies at speed with signal integrity intact ([source](https://www.sec.gov/Archives/edgar/data/1039399/000103939926000009/form-20251227.htm)). For a reticle-sized logic die every needle must sit in the same plane across the whole die, survive repeated touchdowns without drifting, and do it at temperature. Cards are custom to the device, so each new part means a new card and a new qualification.

Wafer-level burn-in is the newer answer. Aehr's lead AI customer is moving burn-in from system level entirely onto the wafer, and each FOX-XP system processes nine 300 mm wafers at once ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).

### Final test, burn-in and system-level test

The economics get worse as packages grow. TSMC plans a 14-reticle package by 2028 holding twenty HBM stacks and, we think, ten to twenty compute chiplets ([source](https://www.trendforce.com/news/2026/08/11/news-tsmcs-5-5-reticle-cowos-reportedly-tops-99-yield-flags-memory-abf-as-ai-bottlenecks/)). Every die in that body is another chance to throw the whole assembly away, which is why test insertions multiply instead of consolidating. KYEC is expanding capacity 30% to 50% in 2026, weighted to high-power burn-in and advanced packaging test for AI GPUs and ASICs ([source](https://www.trendforce.com/news/2026/05/05/news-ase-powertech-kyec-capex-may-hit-nt370b-this-year-as-ai-drives-record-osat-investment/)).

{{figure:ate-share}}

## Who makes it

Automated test equipment is a duopoly that has stopped being symmetric. Advantest puts its own share at about 65% of a US$9.0 billion tester market in 2025, including 66% of SoC test, up ten points in a year, and about 60% of memory test ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf)). It and Teradyne hold about 80% between them ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Teradyne grew 13% to US$3.19 billion for 2025, with fourth-quarter revenue up 44% on AI demand ([source](https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results)).

The rest of the floor is more fragmented.

- **Probe cards.** A three-way race with a long tail: FormFactor took US$785.0 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001039399/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)), and Technoprobe grew 15.7% to EUR 628.4 million, 38% of it from AI, and plans to double capacity by the end of 2027 ([source](https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf)).
- **Handlers and burn-in.** Cohu took US$453.0 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000021535/us-gaap/RevenueFromContractWithCustomerIncludingAssessedTax.json)); Aehr did US$50.0 million in fiscal 2026 but booked a record US$60.7 million in the fourth quarter alone and guides to US$130 million to US$150 million in fiscal 2027 ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).
- **Dicing and grinding.** Disco leads in wafer grinders, dicing saws and laser saws ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)), and its newest package dicing saw handles workpieces up to 400 by 400 mm for panel-level work ([source](https://www.disco.co.jp/eg/news/corp/20251215_1.html)).
- **Bonding.** Kulicke and Soffa did US$654.1 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000056978/us-gaap/Revenues.json)), while Besi's second-quarter 2026 revenue rose 68.7% to EUR 249.9 million on hybrid bonding and datacentre demand ([source](https://www.besi.com/investor-relations/press-releases/2025/details-1/be-semiconductor-industries-nv-announces-q2-26-and-h1-26-results/)).

Thermocompression bonders for HBM are a two-and-a-half-horse race. SK hynix runs about 50 TC bonder sets for HBM4, roughly half from ASMPT, and ordered seven more at about KRW 4 billion each in late 2025 ([source](https://www.trendforce.com/news/2025/12/12/news-sk-hynix-reportedly-places-hbm4-tc-bonder-order-with-asmpt-as-hanmi-hanwha-patent-clash-heats-up/)); Hanmi took a KRW 44.2 billion order for about 15 TC Bonder 4 systems in June 2026 ([source](https://www.trendforce.com/news/2026/06/09/news-sk-hynix-reportedly-places-44-2bn-won-tc-bonder-order-with-hanmi-accelerating-hbm4-ramp-up/)). See Memory and HBM.

## The back end's geography

Outsourced assembly and test is a Taiwanese business with a large Chinese challenger. The top ten OSATs billed US$41.56 billion in 2024, led by ASE at 44.6%, and four of the ten are Chinese ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)). Malaysia holds about 13% of global assembly, test and packaging, the Philippines about 10% ([source](https://www.z2data.com/insights/which-countries-does-the-world-rely-on-for-chip-assembly-packaging)).

The money is moving fast. ASE, Powertech and KYEC together plan roughly NT$370 billion of capital spending in 2026, with ASE raising its budget from US$7 billion to US$8.5 billion ([source](https://www.trendforce.com/news/2026/05/05/news-ase-powertech-kyec-capex-may-hit-nt370b-this-year-as-ai-drives-record-osat-investment/)). Powertech is putting NT$70 billion into fan-out panel-level packaging on 510 by 515 mm panels, scaling from 1,000 panels a month to 5,000 by 2028, with 2027 capacity already booked by AMD and Broadcom ([source](https://www.trendforce.com/news/2026/08/31/news-powertech-plans-nt70b-push-for-worlds-first-panel-level-ai-chip-packaging-in-2027-potentially-ahead-of-tsmc/)).

Amkor took US$6.71 billion of revenue in 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001047127/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)) and broke ground on a US$7 billion Arizona packaging plant, now under a ten-year partnership with TSMC ([source](https://www.trendforce.com/news/2026/06/17/news-tsmc-amkor-forge-10-year-arizona-advanced-packaging-partnership-to-complete-the-u-s-chip-supply-chain/)).

{{figure:osat-firms}}

{{figure:osat-region}}

## The chokepoint

This is not lithography. No single tool has a single supplier. What there is instead is stickiness: Advantest argues that switching tester vendor means rebuilding a customer's entire device development, evaluation and production test environment, which is why share moves slowly and in one direction ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Probe cards work the same way one level down.

The back end is also the part of the chain China is closest to owning. Chinese OSATs took about 28.6% of top-10 revenue in 2024, and assembly, dicing, bonding and test tools sit largely outside the export control lines drawn around lithography and deposition. Set that US$41.56 billion against industry sales of US$791.7 billion in 2025 ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)): a small share of the revenue sitting on the critical path of all of it.

## Key evaluation criteria

- **Test coverage** is what you actually buy. Higher coverage catches more latent failures before they reach an irreplaceable package.
- **Test time per part** sets throughput and cost. Large dies, HBM stacks and chiplets all push it up, which is why tester revenue grew faster than unit volumes in 2025.
- **Probe card planarity and life** decide sort economics. Every needle has to stay coplanar over a full die and hold that alignment across a long touchdown count.
- **Thermal control** matters more every generation. A kilowatt-class accelerator must be held at temperature in the socket while it is tested at speed.
- **Capacity and geography** are the practical constraint. Taiwan, China, Malaysia and the Philippines hold most of the floor space, and new capacity takes years.

## Takeaways

Test used to be the cheap step at the end. With a dozen expensive dies in one package, it is now the insurance policy for everything upstream: the SoC tester market grew about 68% in 2025 ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf)) and burn-in has started migrating back onto the wafer ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)). Advantest has quietly turned a duopoly into a two-thirds share. And the back end remains the one segment where Chinese firms are genuinely competitive, which makes it the least likely part of this chain to be controlled by export policy and the most likely to be reshaped by it.
