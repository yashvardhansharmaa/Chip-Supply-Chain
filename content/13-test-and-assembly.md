---json
{
  "id": "test-and-assembly",
  "number": 13,
  "title": "Test and Assembly",
  "oneLiner": "Assembly and test decide which dies are allowed into a package that costs more than a car. One Japanese firm now sells two thirds of the world's chip testers.",
  "plain": "Before a chip can be sold, a machine has to put questions to it and check every answer. While the chips are still on the wafer, thousands of needles press onto pads on each one, send in signals and read what comes back; the tester marks any chip that answers wrong, and that chip goes no further. A modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests sooner, at higher temperatures and for longer than it used to, and two firms, one Japanese and one American, sell most of the machines that do it.",
  "bridge": "Nothing yet proves that any of it works, and a package this far along is worth too much to guess about.",
  "specimen": "probe-card",
  "specimenCaption": "A probe card over a wafer. A printed circuit board carries the tester's signals to a micro-machined probe head whose needles land on pads a few tens of micrometers across, all of them within microns of the same plane.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Advantest", "country": "JP", "share": "65% of the tester market in 2025"},
      {"name": "Teradyne", "country": "US", "share": "Second in testers; about 80% of the market with Advantest"},
      {"name": "ASE", "country": "TW", "share": "$20.6bn of 2025 revenue, the largest assembly and test contractor"},
      {"name": "Amkor", "country": "US", "share": "$6.71bn of 2025 revenue"},
      {"name": "Disco", "country": "JP", "share": "Leading share in dicing saws, grinders and blades"}
    ],
    "countries": [
      {"code": "TW", "note": "ASE, Powertech, KYEC and ChipMOS; the largest assembly and test cluster"},
      {"code": "JP", "note": "Advantest testers, Disco dicing and grinding, Micronics Japan probe cards"},
      {"code": "US", "note": "Teradyne, FormFactor, Cohu, Aehr; Amkor's Arizona packaging plant"},
      {"code": "CN", "note": "Four of the top ten assembly and test firms by 2024 revenue are China-headquartered"},
      {"code": "MY", "note": "Penang and Kulim; Malaysia ships about 13% of the world's packaged chips"}
    ],
    "chinaStatus": "Assembly and test is where China is most competitive. Georgetown's CSET counts four of the top ten assembly and test firms by 2024 revenue as China-headquartered, and their equipment is far less tightly controlled than lithography or deposition.",
    "usStatus": "Strong in test equipment and probe cards through Teradyne, FormFactor, Cohu and Aehr, weak in assembly capacity. Amkor is building a $7 billion packaging and test campus in Arizona and has a long-term partnership with TSMC to fill it.",
    "costSignal": "ASE and Amkor alone billed $27.3 billion in 2025; ASE spent $4.1 billion on machinery and buildings in the first half of 2026",
    "substitutability": {"band": "Moderate", "test": "No tool here has a single supplier; the lock is the cost of rebuilding a test environment, not a missing tool", "why": "Advantest and Teradyne take about 80 percent between them, but both ship qualified testers and the niches under them have several suppliers each. A customer stays because changing tester vendor means rebuilding the whole development, evaluation and production test environment, which is Advantest's own pitch to investors. A well-funded actor pays that cost once and is through it in two to five years, which is also why four of the top ten assembly and test firms are already Chinese."}
  },
  "keyFacts": [
    {"fact": "Advantest estimates its overall tester market share at about 65% in CY2025, with 66% of logic chip test (up about 10 points year on year) and about 60% of memory test", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "The CY2025 tester market was about $9.0 billion: $6.9 billion of logic chip testers, up about 68% year on year, and $2.1 billion of memory testers", "source": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"},
    {"fact": "Advantest and Teradyne together hold about 80% of the tester market", "source": "https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf"},
    {"fact": "Teradyne's 2025 revenue was $3.19 billion, up 13%, with fourth-quarter growth of 44% driven by AI compute and memory test", "source": "https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results"},
    {"fact": "Technoprobe's 2025 revenue was EUR 628.4 million, up 15.7%, with about 38% of revenue from AI applications", "source": "https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf"},
    {"fact": "Aehr received a $22 million follow-on order for AI processor wafer-level burn-in systems in August 2026", "source": "https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/"},
    {"fact": "ASE's installed tester count rose from 6,797 in the second quarter of 2025 to 8,348 a year later, and it spent $2.7 billion on machinery and $1.4 billion on buildings in the first half of 2026", "source": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011353/dp250875_6k.htm"},
    {"fact": "Four of the top ten outsourced assembly and test firms by 2024 revenue are China-headquartered", "source": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"},
    {"fact": "Malaysia ships about 13% of the world's packaged chips and is targeting 7% of advanced packaging shipments by 2035", "source": "https://www.mida.gov.my/advanced-packaging-how-malaysia-is-packaging-the-future-of-ai/"}
  ],
  "figures": [
    {
      "id": "ate-share",
      "type": "stack",
      "title": "Automated test equipment: share of the ~$9.0bn tester market, 2025",
      "unit": "%",
      "data": [["Advantest", 65], ["Teradyne and all others", 35]],
      "source": {"label": "Advantest FY2025 results briefing, April 2026", "url": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"}
    },
    {
      "id": "tester-market",
      "type": "stack",
      "title": "Where the tester money went in calendar 2025",
      "unit": "$bn",
      "data": [["SoC testers", 6.9], ["Memory testers", 2.1]],
      "source": {"label": "Advantest FY2025 results briefing, April 2026", "url": "https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf"}
    },
    {
      "id": "ase-testers",
      "type": "bars",
      "title": "Testers installed at ASE, the largest assembly and test contractor",
      "unit": "testers",
      "data": [["Q2 2025", 6797], ["Q1 2026", 7585], ["Q2 2026", 8348]],
      "source": {"label": "ASE Technology Holding, second quarter 2026 earnings release (SEC Form 6-K)", "url": "https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm"}
    }
  ]
}
---
# Test and Assembly

Semiconductor manufacturing runs to 400 to 600 steps, and Advantest counts test as the only one that puts electricity through the chip ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Every stage so far makes dies; the back end of the industry, assembly and test, decides which of them are allowed into a package.

## How it works

Before a chip can be sold, a machine has to put questions to it and check every answer. While the chips are still on the wafer, thousands of needles press onto pads on each one, send in signals and read what comes back; the tester marks any chip that answers wrong, and that chip goes no further. A modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests sooner, at higher temperatures and for longer than it used to, and two firms, one Japanese and one American, sell most of the machines that do it.

Each round of test catches failures the round before it cannot see.

- **Wafer sort.** Thousands of needles land on each die while it is still on the wafer, a tester drives patterns in and checks the answers, and the failures go no further.
- **Burn-in.** Run the part hot and under power for hours, so anything that would fail early fails now, before assembly.
- **Final test.** The tester runs the packaged part again, because packaging adds failures of its own.
- **System-level test.** The finished part sits in a socket and runs something close to a real workload, because some failures appear only when everything runs at once.

Proving a die good before it is packaged is now worth far more. Aehr screens for early and hidden failures before dies are cut from the wafer, so a weak processor never reaches high-bandwidth memory and an expensive substrate ([source](https://www.aehr.com/2026/08/aehr-receives-22-million-follow-on-order-for-ai-processor-wafer-level-burn-in-systems/)). Its lead AI customer is moving burn-in off the finished system and onto the wafer, nine 300 mm wafers at a time ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).

## Variants and trade-offs

### Wafer sort and known-good die

The probe card that holds those needles is the hard part. For a high-bandwidth memory stack it must contact eight, twelve or sixteen dies at speed without degrading the signals ([source](https://www.sec.gov/Archives/edgar/data/1039399/000103939926000009/form-20251227.htm)). For a large logic die every needle must sit in the same plane, survive repeated touchdowns without drifting, and do it hot. Cards are custom to the device, so each new part means a new card and a new qualification.

### Final test, burn-in and system-level test

The economics get worse as packages grow. TSMC has told investors that its CoWoS packaging roadmap runs beyond 14 times the area a lithography machine can print in one shot ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)). Every added die is another chance to lose the whole assembly, which is why the number of test steps keeps rising. ASE ran 6,797 testers in the second quarter of 2025 and 8,348 a year later ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326011351/dp250868_6k.htm)).

{{figure:ate-share}}

## Who makes it

Advantest puts its own share at about 65 percent of a $9.0 billion tester market in 2025: 66 percent of test for logic chips, up ten points in a year, and about 60 percent of memory test ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf)). It and Teradyne hold about 80 percent between them ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)). Teradyne grew 13 percent to $3.19 billion for 2025, with fourth-quarter revenue up 44 percent on AI demand ([source](https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results)).

{{figure:tester-market}}

Below the two tester makers, the floor breaks into niches with their own suppliers.

- **Probe cards.** FormFactor took $785.0 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001039399/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)); Technoprobe grew 15.7 percent to EUR 628.4 million, 38 percent of it from AI, and plans to double capacity by the end of 2027 ([source](https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf)).
- **Handlers and burn-in**, the machines that feed parts into a tester and cook them. Cohu took $453.0 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000021535/us-gaap/RevenueFromContractWithCustomerIncludingAssessedTax.json)); Aehr did $50.0 million in fiscal 2026 but booked a record $60.7 million in the fourth quarter alone and guides to $130 million to $150 million in fiscal 2027 ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)).
- **Dicing and grinding.** Disco leads in wafer grinders and the saws that cut wafers into dies ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)), and its newest saw handles pieces up to 400 by 400 mm, for packaging on rectangular panels rather than round wafers ([source](https://www.disco.co.jp/eg/news/corp/20251215_1.html)).
- **Bonding.** Kulicke and Soffa did $654.1 million in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000056978/us-gaap/Revenues.json)), while Besi's second-quarter 2026 revenue rose 68.7 percent to EUR 249.9 million on hybrid bonding and data center demand ([source](https://www.besi.com/investor-relations/press-releases/2025/details-1/be-semiconductor-industries-nv-announces-q2-26-and-h1-26-results/)).

Thermocompression bonders, which press memory dies into a stack and place chiplets on substrates, are the tightest niche. ASMPT took a repeat order for fifteen chip-to-substrate bonders in December 2025 ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-secures-additional-orders-for-fifteen-chip-to-substrate-thermo-compression-bonding-tools-driven-by-ai-tailwind/)) and, in its 2025 results, put that market at $1.6 billion by 2028, of which it means to hold 35 to 40 percent ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)). See [Memory and HBM](#memory-and-hbm).

## The back end's geography

Outsourced assembly and test, the OSAT business, is Taiwanese with a large Chinese challenger. ASE, the biggest, billed $20.6 billion in 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001122411/ifrs-full/Revenue.json)); Georgetown's CSET counts four of the top ten OSATs by 2024 revenue as China-headquartered ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Malaysia ships about 13 percent of the world's packaged chips and wants 7 percent of advanced packaging shipments by 2035 ([source](https://www.mida.gov.my/advanced-packaging-how-malaysia-is-packaging-the-future-of-ai/)).

ASE spent $2.7 billion on machinery and $1.4 billion on buildings in the first half of 2026, and says revenue from leading-edge advanced packaging is running ahead of its $3.5 billion guidance for the year ([source](https://www.sec.gov/Archives/edgar/data/1122411/000095010326011353/dp250875_6k.htm)). Powertech is chasing the first panel-level packaging line for AI chips in 2027 ([source](https://asia.nikkei.com/business/tech/semiconductors/powertech-eyes-world-s-first-panel-level-packaging-for-ai-chips-in-2027)).

Amkor took $6.71 billion of revenue in 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001047127/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)), and $1.90 billion in the second quarter of 2026 alone, up 26 percent year on year ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000043/amkr6302026erex-991.htm)). It has expanded its Arizona campus to a $7 billion investment ([source](https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced)). Under a partnership signed in June 2026 ([source](https://ir.amkor.com/news-releases/news-release-details/tsmc-and-amkor-technology-announce-long-term-partnership)) it will run packaging and test there for TSMC, whose Phoenix fabs sit next door ([source](https://pr.tsmc.com/english/news/3174)).

{{figure:ase-testers}}

## The chokepoint

Unlike lithography, no tool here has a single supplier. Advantest argues that switching tester vendor means rebuilding the whole development, evaluation and production test environment, which is why share moves slowly ([source](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2504E.pdf)).

Assembly and test is also the part of the chain China is closest to owning, because assembly, dicing, bonding and test tools sit outside the export control lines drawn around lithography and deposition. ASE and Amkor billed $27.3 billion between them in 2025, against industry sales of $791.7 billion ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)), a small share of the money for a step every chip has to pass through.

## Key evaluation criteria

- **Test coverage** is the share of hidden failures caught before they reach a package that cannot be taken apart.
- **Test time per part** sets throughput and cost, and large dies, memory stacks and chiplets all push it up.
- **Probe card flatness and life** decide what wafer sort costs. Every needle must stay in the same plane across a full die and hold that over a long life.
- **Thermal control** matters more every generation. A kilowatt-class accelerator has to be held at temperature in the socket while it is tested at speed.
- **Capacity and geography** are the practical constraint. Taiwan, China and Malaysia hold most of the floor space, and new capacity takes years.

## Takeaways

Test used to be the cheap step at the end. With a dozen expensive dies in one package, it now insures everything upstream: the market for logic chip testers grew about 68 percent in 2025 ([source](https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf)) and burn-in has started moving back onto the wafer ([source](https://www.aehr.com/2026/07/aehr-test-systems-reports-fiscal-2026-fourth-quarter-and-full-year-financial-results-with-record-quarterly-bookings-and-100-million-effective-backlog/)). Advantest has turned a duopoly into a two-thirds share of the machines. The assembly floor beneath it stays fragmented, and four of the top ten assembly and test firms are Chinese ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)), which is why export policy has little grip here.
