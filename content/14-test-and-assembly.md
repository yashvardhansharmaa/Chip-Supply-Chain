---json
{
  "id": "test-and-assembly",
  "number": 14,
  "title": "Test and Assembly",
  "oneLiner": "The back end decides which dies are allowed into a package that costs more than a car. One Japanese firm now sells two thirds of the world's chip testers.",
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
      {"code": "CN", "note": "Four of the top ten OSATs by revenue, about 28.5% of top-10 revenue in 2024"},
      {"code": "MY", "note": "Penang and Kulim; about 13% of global assembly, test and packaging"}
    ],
    "chinaStatus": "The back end is where China is most competitive. JCET, Tongfu, Huatian and WiseRoad together took about 28.5% of top-10 OSAT revenue in 2024, and back-end equipment is far less tightly controlled than lithography or deposition.",
    "usStatus": "Strong in test equipment and probe cards through Teradyne, FormFactor, Cohu and Aehr, weak in assembly capacity. Amkor is building a US$7 billion packaging and test plant in Arizona with a ten-year TSMC commitment.",
    "costSignal": "The ten largest OSATs billed US$41.56 billion in 2024; ASE, Powertech and KYEC alone plan about NT$370 billion of capital spending in 2026",
    "substitution": {"years": "3-5", "why": "Assembly and test floors can be built in a few years, but changing tester vendor means rebuilding the entire device development, evaluation and production test environment, so customers almost never switch."}
  },
  "keyFacts": [
    {"fact": "Advantest's share of the tester market rose to 65% in 2025 from 58% in 2024, with 66% of SoC test and 61% of memory test", "source": "https://www.investing.com/news/company-news/advantest-fy25-slides-record-margins-as-ai-testing-demand-surges-93CH-4639589"},
    {"fact": "The global tester market grew about 50% in 2025 to roughly US$9.0 billion, of which SoC testers were US$6.9 billion", "source": "https://www.investing.com/news/company-news/advantest-fy25-slides-record-margins-as-ai-testing-demand-surges-93CH-4639589"},
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
      "source": {"label": "Advantest FY2025 results presentation, via Investing.com", "url": "https://www.investing.com/news/company-news/advantest-fy25-slides-record-margins-as-ai-testing-demand-surges-93CH-4639589"}
    },
    {
      "id": "osat-firms",
      "type": "bars",
      "title": "Top 10 OSAT revenue share, 2024",
      "unit": "%",
      "data": [["ASE", 44.6], ["Amkor", 15.2], ["JCET", 12], ["Tongfu", 8], ["Powertech", 5.5], ["Huatian", 4.8], ["WiseRoad", 3.7], ["Hana Micron", 2.2], ["KYEC", 2.2], ["ChipMOS", 1.7]],
      "source": {"label": "TrendForce", "url": "https://www.trendforce.com/presscenter/news/20250513-12577.html"}
    },
    {
      "id": "osat-region",
      "type": "stack",
      "title": "Top 10 OSAT revenue by company home country, 2024",
      "unit": "%",
      "data": [["Taiwan", 54.0], ["China", 28.5], ["United States", 15.2], ["South Korea", 2.2]],
      "source": {"label": "TrendForce company shares, summed by headquarters country", "url": "https://www.trendforce.com/presscenter/news/20250513-12577.html"}
    }
  ]
}
---
# Test and Assembly

Everything before this chapter makes dies. The back end decides which of them are allowed into a package, and by 2026 that judgement is worth more than the packaging. A finished AI accelerator carries two reticle-sized logic dies and eight or more HBM stacks that were each expensive before assembly, and one bad die condemns all of them. Advantest makes the point plainly: among the 400 to 600 steps in semiconductor manufacturing, test is the only one that handles electricity ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)).

## How it works

Test happens at least three times and increasingly four.

Wafer sort comes first. A probe card, a circuit board carrying thousands of tiny needles, lands on the pads of each die while a tester drives patterns into it and compares what comes back against expected data. Dies that fail get inked or logged and never leave the wafer.

Then comes the known-good-die problem. In a monolithic chip you can afford a loose sort test because the only thing you lose is one die. In a stacked or chiplet package you cannot, because a marginal die is assembled into something far more valuable. Aehr's pitch is exactly this: screen early-life and latent reliability failures before dies are singulated and put into advanced packages, so that a weak processor never gets bonded to high-bandwidth memory and an expensive substrate ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)).

Burn-in is the blunt instrument for that: run the part hot and at voltage for hours to force infant mortality out early. Final test follows packaging. System-level test follows final test and runs the packaged part in a socket against something closer to a real workload, because at this level of integration the failures that matter are the ones that only appear when the whole thing runs at once.

## Variants and trade-offs

### Wafer sort and known-good die

Probe cards are the hard part. For HBM the card has to contact a stack of eight, twelve or even sixteen DRAM dies assembled with advanced packaging, at speed and with signal integrity intact ([source](https://www.sec.gov/Archives/edgar/data/1039399/000103939926000009/form-20251227.htm)). For a reticle-sized logic die the card must hold thousands of needles within microns of a single plane across an area the size of a postage stamp, survive hundreds of thousands of touchdowns, and do it at temperature. Cards are custom to the device, so each new part means a new card and a new qualification.

Wafer-level burn-in is the newer answer. Aehr's lead AI production customer is shifting burn-in from system level to entirely wafer level for accelerators used in training and inference, and each FOX-XP system processes nine 300 mm wafers at once ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)) ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)).

### Final test, burn-in and system-level test

The economics get worse as packages grow. TSMC's 5.5-reticle CoWoS yields above 98% and up to 99%, and it plans a 14-reticle package by 2028 holding roughly ten large compute dies and twenty HBM stacks ([source](https://www.trendforce.com/news/2026/08/11/news-tsmcs-5-5-reticle-cowos-reportedly-tops-99-yield-flags-memory-abf-as-ai-bottlenecks/)). Thirty dies in one body means thirty chances to throw away the whole assembly, which is why test insertions keep multiplying instead of consolidating. KYEC is expanding capacity 30% to 50% in 2026 with an emphasis on high-power burn-in and advanced packaging test for AI GPUs and ASICs ([source](https://www.trendforce.com/news/2026/05/05/news-ase-powertech-kyec-capex-may-hit-nt370b-this-year-as-ai-drives-record-osat-investment/)).

{{figure:ate-share}}

## Who makes it

Automated test equipment is a duopoly that has stopped being symmetric. Advantest's share of the whole tester market rose to 65% in 2025 from 58% in 2024, with 66% of SoC test, up from 56%, and 61% of memory test; the SoC tester market grew to US$6.9 billion from US$4.1 billion and memory testers to US$2.1 billion from US$1.9 billion, taking the total to roughly US$9.0 billion, about 50% growth in a year ([source](https://www.investing.com/news/company-news/advantest-fy25-slides-record-margins-as-ai-testing-demand-surges-93CH-4639589)). Advantest and Teradyne together hold about 80% of the market ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Advantest's own fiscal 2025 sales were JPY 1,128.6 billion, up 44.7%, with SoC test systems up 74.3% ([source](https://www.investing.com/news/company-news/advantest-fy25-slides-record-margins-as-ai-testing-demand-surges-93CH-4639589)). Teradyne grew 13% to US$3.19 billion for 2025, with fourth-quarter revenue up 44% on AI demand in compute, networking and memory ([source](https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results)).

Probe cards are a three-way race with a long tail. FormFactor took US$785.0 million of revenue in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001039399/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)) and names Micronics Japan, Japan Electronic Materials, MPI, Korea Instrument, TSE and Technoprobe as its competitors ([source](https://www.sec.gov/Archives/edgar/data/1039399/000103939926000009/form-20251227.htm)). Technoprobe grew 15.7% to EUR 628.4 million in 2025, said about 38% of revenue now comes from AI applications, and plans to double manufacturing capacity by the end of 2027 ([source](https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf)).

The rest of the floor is more fragmented. Cohu, the main handler supplier, took US$453.0 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000021535/us-gaap/RevenueFromContractWithCustomerIncludingAssessedTax.json)). Aehr, the wafer-level burn-in specialist, did US$50.0 million in fiscal 2026 but booked a record US$60.7 million in the fourth quarter alone and guides to US$130 million to US$150 million in fiscal 2027 ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).

Dicing and grinding belong to Disco, which holds leading share in wafer grinders, grinding wheels, dicing saws and laser saws ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)). It has shipped more than 4,000 laser saws ([source](https://www.disco.co.jp/eg/news/corp/20260302.html)) and its newest package dicing saw handles workpieces up to 400 by 400 mm for panel-level work ([source](https://www.disco.co.jp/eg/news/corp/20251215_1.html)).

Bonding is where the money is moving. Kulicke and Soffa did US$654.1 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000056978/us-gaap/Revenues.json)), while Besi's second-quarter 2026 revenue rose 68.7% to EUR 249.9 million and orders rose 128.8% to EUR 292.9 million on hybrid bonding, photonics and datacentre demand ([source](https://www.besi.com/investor-relations/press-releases/2025/details-1/be-semiconductor-industries-nv-announces-q2-26-and-h1-26-results/)). Thermocompression bonders for HBM are a two-and-a-half-horse race: SK hynix runs about 50 TC bonder sets for HBM4, roughly half of them from ASMPT, ordered seven more at about KRW 4 billion each in late 2025, and was expected to place around 100 units in March 2026 ([source](https://www.trendforce.com/news/2025/12/12/news-sk-hynix-reportedly-places-hbm4-tc-bonder-order-with-asmpt-as-hanmi-hanwha-patent-clash-heats-up/)). Hanmi, the historical incumbent, took a KRW 44.2 billion order for about 15 TC Bonder 4 systems in June 2026 ([source](https://www.trendforce.com/news/2026/06/09/news-sk-hynix-reportedly-places-44-2bn-won-tc-bonder-order-with-hanmi-accelerating-hbm4-ramp-up/)). See Memory and HBM for what those tools are stacking.

## The back end's geography

Outsourced assembly and test is a Taiwanese business with a large Chinese challenger. The top ten OSATs billed US$41.56 billion in 2024, up 3%, led by ASE at 44.6% and US$18.54 billion, Amkor at 15.2%, JCET at 12%, Tongfu at 8% and Powertech at 5.5% ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)). Four of the ten are Chinese. Beyond the named firms, Malaysia handles about 13% of global assembly, test and packaging and the Philippines about 10% ([source](https://www.z2data.com/insights/which-countries-does-the-world-rely-on-for-chip-assembly-packaging)).

The money is moving fast. ASE, Powertech and KYEC together plan roughly NT$370 billion of capital spending in 2026, with ASE raising its budget from US$7 billion to US$8.5 billion and Powertech and KYEC each lifting theirs to NT$50 billion ([source](https://www.trendforce.com/news/2026/05/05/news-ase-powertech-kyec-capex-may-hit-nt370b-this-year-as-ai-drives-record-osat-investment/)). Powertech is putting NT$70 billion into fan-out panel-level packaging on 510 by 515 mm panels, yielding 45 to 90 units per panel and scaling from 1,000 panels a month to 5,000 by 2028, with 2027 capacity already booked by AMD and Broadcom ([source](https://www.trendforce.com/news/2026/08/31/news-powertech-plans-nt70b-push-for-worlds-first-panel-level-ai-chip-packaging-in-2027-potentially-ahead-of-tsmc/)). Amkor, at US$6.71 billion of revenue in 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001047127/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)), broke ground on a US$7 billion Arizona packaging plant in October 2025 ([source](https://www.trendforce.com/news/2025/10/14/news-amkor-breaks-ground-on-usd-7-billion-advanced-semiconductor-packaging-facility-in-arizona/)) and signed a ten-year Arizona partnership with TSMC in June 2026 ([source](https://www.trendforce.com/news/2026/06/17/news-tsmc-amkor-forge-10-year-arizona-advanced-packaging-partnership-to-complete-the-u-s-chip-supply-chain/)).

{{figure:osat-firms}}

{{figure:osat-region}}

## The chokepoint

This is not lithography. There is no single tool with a single supplier. What there is instead is stickiness: Advantest argues that switching tester vendor means rebuilding a customer's entire device development, evaluation and volume production environment, which is why share moves slowly and only in one direction ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Probe cards have the same property one level down, since every card is designed for one device.

The back end is also the part of the chain China is closest to owning. Chinese OSATs took about 28.5% of top-10 revenue in 2024, and assembly, dicing, bonding and test tools sit largely outside the export control lines drawn around lithography and advanced deposition. For scale, the ten largest OSATs billed US$41.56 billion in 2024 while the whole industry sold US$791.7 billion in 2025 ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)) ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)). Assembly and test is a small share of the industry's revenue sitting on the critical path of all of it.

## Key evaluation criteria

- **Test coverage** is what you actually buy. Higher coverage catches more latent failures before they reach an irreplaceable package.
- **Test time per part** sets throughput and cost. Large dies, HBM stacks and chiplets all push it up, which is why tester revenue grew faster than unit volumes in 2025.
- **Probe card planarity and life** decide sort economics. Thousands of needles must stay coplanar within microns across hundreds of thousands of touchdowns.
- **Thermal control** matters more every generation. A kilowatt-class accelerator has to be held at temperature in the socket while it is tested at speed.
- **Capacity and geography** are the practical constraint. Taiwan, China, Malaysia and the Philippines hold most of the floor space, and new capacity takes years.

## Takeaways

Test used to be the cheap step at the end. With thirty dies in a package and a finished assembly worth tens of thousands of dollars, it is now the insurance policy for everything upstream, and spending has moved accordingly: the tester market grew about 50% in 2025 and burn-in has started migrating back onto the wafer. Advantest has quietly turned a duopoly into a two-thirds share. And the back end remains the one segment where Chinese firms are genuinely competitive, which makes it the least likely part of this chain to be controlled by export policy and the most likely to be reshaped by it.
