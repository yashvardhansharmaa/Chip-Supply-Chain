---json
{
  "id": "metrology-and-inspection",
  "number": 8,
  "title": "Metrology and Inspection",
  "oneLiner": "Nobody builds a fab around process control, and every fab fails without it. One American firm holds roughly 64% of the market and about seven times the share of its nearest rival.",
  "plain": "Every chip factory is really a quality-control operation. Machines print and build a pattern a thousand times over, and after many of those steps another machine looks at the wafer: are the lines the right width, did this layer land on the last one, has a speck of dirt killed a circuit. On a die as big as an AI accelerator, halving the number of stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells two-thirds of the machines that do the looking.",
  "specimen": "sem-column",
  "specimenCaption": "Right: a scanning electron microscope column over a wafer. Electron gun at the top, condenser and objective lenses, deflection coils, secondary electron detector, wafer on a precision stage.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "KLA", "country": "US", "share": "64.1% of metrology and inspection, 2025"},
      {"name": "Applied Materials", "country": "US", "share": "under 8% of metrology and inspection, 2024"},
      {"name": "ASML", "country": "NL", "share": "YieldStar overlay metrology and HMI multibeam e-beam inspection"},
      {"name": "Onto Innovation", "country": "US", "share": "$1.01B revenue, 2025"},
      {"name": "Nova", "country": "IL", "share": "4.3% of metrology and inspection, 2025"}
    ],
    "countries": [
      {"code": "US", "note": "KLA (Milpitas), Onto Innovation (Wilmington, MA), Applied Materials"},
      {"code": "NL", "note": "ASML YieldStar and HMI e-beam, Veldhoven and San Jose"},
      {"code": "JP", "note": "Hitachi High-Tech CD-SEM; Lasertec mask inspection; Rigaku X-ray"},
      {"code": "IL", "note": "Nova (Rehovot) and Camtek (Migdal Haemek)"},
      {"code": "CN", "note": "Wuhan Jingce and other domestic entrants; near-zero share in mask and packaging inspection as of 2019"}
    ],
    "chinaStatus": "The weakest Chinese position of any major tool segment. As of 2019 domestic firms held 3.4% of CD measuring, 1.3% of defect inspection and none of mask or packaging inspection; CSET's 2026 survey of China's equipment gains reported none in process control.",
    "usStatus": "KLA is the single largest process-control supplier worldwide. The December 2024 rule swept metrology and inspection tools for patterned 300 mm wafers into the controlled list.",
    "costSignal": "KLA's fiscal 2026 revenue was $13.58B against a wafer equipment market of roughly $120B in calendar 2025, so process control is around a tenth of fab tool spending.",
    "substitution": {"years": "10+", "why": "Sensitivity comes from optics, electron columns and decades of defect libraries. China gained share in etch and deposition between 2019 and 2024 and gained none here."}
  },
  "keyFacts": [
    {"fact": "Die yield is (1 + D0A/a) to the power minus a, with a of 3 to 4 for modern CMOS, so defect density and die area alone set the ceiling", "source": "https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf"},
    {"fact": "KLA's share of metrology and inspection rose from 55.0% in 2020 to 64.1% in 2025", "source": "https://drrobertcastellano.substack.com/p/kla-camtek-and-nova-three-ways-to"},
    {"fact": "KLA's process control share has grown 360 basis points since 2021 and is about 7x the nearest competitor", "source": "https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf"},
    {"fact": "KLA fiscal 2026 revenue was $13.579 billion, up from $12.156 billion in fiscal 2025", "source": "https://data.sec.gov/api/xbrl/companyconcept/CIK0000319201/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json"},
    {"fact": "ASML's HMI eScan 1100 uses 25 electron beams for up to 15x the throughput of single-beam e-beam inspection and finds patterning defects down to 7 nm", "source": "https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100"},
    {"fact": "KLA expects advanced packaging process control revenue of about $1.1 billion in calendar 2026, up more than 70%, from about $635 million in 2025", "source": "https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf"},
    {"fact": "Onto Innovation signed a volume purchase agreement of over $240 million with an HBM maker for Dragonfly 2D inspection and 3D bump metrology through 2027", "source": "https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx"},
    {"fact": "Camtek 2025 revenue was a record $496.1 million, up 16% from $429.2 million", "source": "https://www.sec.gov/Archives/edgar/data/1109138/000117891326000549/zk2634405.htm"}
  ],
  "figures": [
    {
      "id": "pc-share",
      "type": "bars",
      "title": "Metrology and inspection market share, 2020 and 2025",
      "unit": "%",
      "data": [["KLA 2020", 55.0], ["KLA 2025", 64.1], ["Nova 2020", 2.5], ["Nova 2025", 4.3]],
      "source": {"label": "The Information Network data, via Semiconductor Deep Dive", "url": "https://drrobertcastellano.substack.com/p/kla-camtek-and-nova-three-ways-to"}
    },
    {
      "id": "kla-mix",
      "type": "stack",
      "title": "KLA revenue by product line, June 2026 quarter",
      "unit": "%",
      "data": [["Wafer inspection", 49], ["Services", 22], ["Patterning", 20], ["PCB and component inspection", 4], ["Specialty semiconductor process", 4], ["Other", 1]],
      "source": {"label": "KLA letter to shareholders, Q4 FY2026", "url": "https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf"}
    }
  ]
}
---
# Metrology and Inspection

No fab is built around its inspection tools. Every fab fails without them. Process control is the quietest chokepoint in this chain and one of the tightest: on The Information Network's data KLA held 64.1 percent of metrology and inspection in 2025, up from 55.0 percent in 2020 ([source](https://drrobertcastellano.substack.com/p/kla-camtek-and-nova-three-ways-to)), roughly seven times its nearest competitor ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

## How it works

Every chip factory is really a quality-control operation. Machines print and build a pattern a thousand times over, and after many of those steps another machine looks at the wafer: are the lines the right width, did this layer land on the last one, has a speck of dirt killed a circuit. On a die as big as an AI accelerator, halving the number of stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells two-thirds of the machines that do the looking.

A wafer loses value two ways: gross-area defects from mishandling, mask misalignment or over-etching, and spot defects from the process itself, the extra material, missing material and airborne particles that kill one circuit ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

The second kind has a governing equation: die yield is (1 + D0A/a) to the power minus a, where D0 is defects per square centimetre, A is die area and a is a clustering constant of 3 to 4 for modern CMOS. Yield falls faster than area rises. At a defect density of 0.8 a 1 square centimetre die yields 49 percent and a 2 by 2 centimetre die 11 percent, so the bigger die costs about twenty times as much ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

An 8 square centimetre die, the size of a reticle-limited AI accelerator, yields about 49 percent at a defect density of 0.10 and about 69 percent at 0.05. That is what yield learning means: find which of the thousand-odd steps is bleeding, fix it, move on.

## Variants and trade-offs

Five families of tool do the work, and they trade sensitivity against speed.

- **Optical inspection** scans a whole wafer with light and compares each die against its neighbours. Fast and cheap per wafer, so it carries the volume monitoring load, a $3 billion market in 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **E-beam inspection** resolves what light cannot and sees electrical faults that leave no optical signature. ASML's HMI eScan 1100 runs 25 beams for up to 15 times single-beam throughput, finds patterning defects down to 7 nm, and uses voltage contrast to catch opens, shorts and leakage at 3 nm and beyond ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **CD-SEM** measures how wide a printed feature actually came out, a $1.6 billion market in 2019 shared by KLA, Hitachi, ASML, Onto Innovation and Applied Materials ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Overlay and film metrology** measure whether this layer sits on the last one and how thick each film is, without cutting the wafer open, a $0.54 billion market in 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). It is Nova's ground and much of Onto's; in August 2026 Onto paid about $720 million for 27 percent of the Japanese X-ray maker Rigaku ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Completes-Strategic-Investment-in-Rigaku-Holdings-Corporation/default.aspx)).
- **Mask inspection** gets its own tools, because a defect on a reticle repeats on every die: a $0.94 billion market in 2019 supplied by KLA, Lasertec, Zeiss and Applied Materials ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

E-beam is far slower than optical, so fabs run optical for coverage and e-beam for what optical cannot see. How many wafers and sites to sample is a cost decision as much as a physics one.

{{figure:pc-share}}

## Who makes it

KLA is the segment. Fiscal 2026 revenue was $13.579 billion, after $12.156 billion in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000319201/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)), and its share has grown 360 basis points since 2021, gaining in 2025 across mask, optical patterned wafer and e-beam inspection ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

The rest of the field is specialised rather than second.

- **Applied Materials** has slid from a peak near 13 percent of metrology and inspection to under 8 percent in 2024 ([source](https://drrobertcastellano.substack.com/p/klas-market-share-growth-in-process)).
- **Nova** reached 4.3 percent in 2025 on revenue of $880.6 million ([source](https://drrobertcastellano.substack.com/p/kla-camtek-and-nova-three-ways-to)) ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001109345/us-gaap/Revenues.json)).
- **Onto Innovation** turned over $1,005.3 million in 2025 ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)) and **Camtek** $496.1 million ([source](https://www.sec.gov/Archives/edgar/data/1109138/000117891326000549/zk2634405.htm)).

Where the money sits inside KLA says where the difficulty sits in the fab. Patterning, which includes overlay and reticle inspection, grew 61 percent year on year in the June 2026 quarter; Taiwan took 31 percent of that quarter and China 26 percent ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)).

{{figure:kla-mix}}

Against a wafer equipment market of roughly $120 billion in 2025, process control is about a tenth of fab tool spending, and rising ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). KLA credits tighter specifications, less redundancy and more logic content in memory built for high-performance computing ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

The moat is analytics as much as optics. Inspection throws up far more candidate defects than engineers can look at, so the value is in classification, and KLA has spent five years putting AI classification through its whole product line ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

## Packaging, AI and China

The AI packaging build-out is the fastest-growing part of this segment. KLA took the number one position in advanced wafer-level packaging process control in 2025, adding 14 points of share ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)), and expects about $1.1 billion of packaging process control revenue in 2026, more than 70 percent growth ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). Onto signed a volume purchase agreement worth over $240 million with a leading HBM maker for 2D inspection and 3D bump metrology through 2027 ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)). See Advanced packaging.

China has made less progress here than anywhere else in the tool chain. In 2019 Chinese firms held 3.4 percent of CD measurement, 1.3 percent of defect inspection and none of photomask or packaging inspection ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). CSET's 2026 review of Chinese share gains from 2019 to 2024 covers deposition, etch, CMP, test and lithography, and reports nothing here ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). The clearest domestic contender is Wuhan Jingce, which sells front-end inspection alongside back-end test and guided 2025 net profit of RMB 80 million to 90 million ([source](https://www.trendforce.com/news/2026/04/21/news-china-memory-expansion-lifts-domestic-equipment-suppliers-amec-wuhan-jingce-hwatsing-acm-in-focus/)).

Export controls reach these tools. The December 2024 interim final rule extended controls to metrology and inspection for patterned 300 mm wafers and applied a foreign direct product rule to qualifying tools built outside the United States ([source](https://www.cov.com/en/news-and-insights/insights/2024/12/us-department-of-commerce-strengthens-export-controls-on-advanced-computing-and-semiconductor-manufacturing-items)) ([source](https://www.hklaw.com/en/insights/publications/2024/12/us-strengthens-export-controls-on-advanced-computing-items)).

## The chokepoint

Process control is a chokepoint by concentration, not by physics. Several firms can build a good film metrology tool, but one firm sets the standard across nearly the whole flow, and its lead is widening. A sanctioned fab can buy scanners and etchers on the grey market and still fail to ramp, because without sensitive inspection it cannot find out why its yield is low.

## Key evaluation criteria

- **Sensitivity** — the smallest killer defect a tool can find. ASML's multibeam system is specified to 7 nm patterning defects ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Throughput** — wafers per hour, which decides how many lots you can afford to look at; multibeam buys up to 15x over single-beam ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Nuisance rate** — the share of flagged events that are not real defects, which is what AI classification attacks.
- **Sampling plan** — how many wafers and sites per lot, the direct lever on process control cost.
- **Time to result** — how fast a measurement reaches the process engineer, which sets the speed of yield learning.

## Takeaways

Yield is set by defect density and die area, and AI accelerators have the largest dies in production, so process control matters more here than in any other end market. KLA held 64.1 percent of the segment in 2025 ([source](https://drrobertcastellano.substack.com/p/kla-camtek-and-nova-three-ways-to)), about seven times its nearest rival ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)), with Applied Materials, ASML, Onto, Nova and Camtek splitting the rest. Advanced packaging is the growth engine, taking KLA's packaging revenue toward $1.1 billion in 2026 ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). And this is the one tool segment where China has shown no measurable gain, which makes it the quietest and most durable lever in the chain.
