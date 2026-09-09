---json
{
  "id": "metrology-and-inspection",
  "number": 8,
  "title": "Metrology and Inspection",
  "oneLiner": "Nobody builds a fab around process control, and every fab fails without it. One American firm holds about 57% of the market, roughly seven times its nearest rival, and is still pulling away.",
  "plain": "Every chip factory is really a quality-control operation. Machines print and build a pattern a thousand times over, and after many of those steps another machine looks at the wafer: are the lines the right width, did this layer land on the last one, has a speck of dirt killed a circuit. On a die as big as an AI accelerator, halving the number of stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells about seven times as many of those machines as its nearest rival.",
  "specimen": "sem-column",
  "specimenCaption": "Right: a scanning electron microscope column over a wafer. Electron gun at the top, condenser and objective lenses, deflection coils, secondary electron detector, wafer on a precision stage.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "KLA", "country": "US", "share": "56.5% of process control in 2024 on its own investor-day count, 6.5x its nearest rival; $13.58B revenue, FY2026"},
      {"name": "Applied Materials", "country": "US", "share": "10.5% of process control tools in 2024: e-beam review, CD-SEM and film metrology"},
      {"name": "Lasertec", "country": "JP", "share": "7.7% of process control tools in 2024, almost all of it mask inspection"},
      {"name": "ASML", "country": "NL", "share": "5.2% of process control tools in 2024: YieldStar overlay and HMI multibeam e-beam inspection"},
      {"name": "Nova", "country": "IL", "share": "3.7% of process control tools in 2024; $880.6M revenue, 2025"},
      {"name": "Onto Innovation", "country": "US", "share": "3.0% of process control tools in 2024; $1.01B revenue, 2025"}
    ],
    "countries": [
      {"code": "US", "note": "KLA (Milpitas), Onto Innovation (Wilmington, MA), Applied Materials"},
      {"code": "NL", "note": "ASML YieldStar and HMI e-beam, Veldhoven and San Jose"},
      {"code": "JP", "note": "Hitachi High-Tech CD-SEM; Lasertec mask inspection; Rigaku X-ray"},
      {"code": "IL", "note": "Nova (Rehovot) and Camtek (Migdal Haemek)"},
      {"code": "CN", "note": "Domestic entrants only; 3.4% of CD measuring and none of mask or packaging inspection as of 2019"}
    ],
    "chinaStatus": "The weakest Chinese position of any major tool segment. As of 2019 domestic firms held 3.4% of CD measuring, 1.3% of defect inspection and none of mask or packaging inspection. CSET's 2026 survey of Chinese share gains runs through deposition, etch, CMP, lithography, packaging and test, and does not cover process control at all.",
    "usStatus": "KLA is the largest process-control supplier worldwide. It puts its own 2024 share at 56.5% and 6.5x its nearest rival; CSET's Supply Chain Explorer puts it at 57.2% of the same year's market. US firms take 72% of the segment and Japanese firms 15%. The December 2024 rule swept metrology and inspection tools for patterned 300 mm wafers into the controlled list at a 21 nm defect threshold.",
    "costSignal": "A $13.4B process control tool market in 2024, of which KLA took about 57%. KLA's fiscal 2026 revenue was $13.58B against a wafer equipment market of roughly $120B in calendar 2025, so process control is around a tenth of fab tool spending.",
    "substitution": {"years": "10+", "why": "Sensitivity comes from optics, electron columns and decades of defect libraries. China gained real share in etch and deposition between 2019 and 2024; in process control it held almost nothing in 2019 and nobody has published a gain since."}
  },
  "keyFacts": [
    {"fact": "Die yield is (1 + D0A/a) to the power minus a, with a of 3 to 4 for modern CMOS, so defect density and die area alone set the ceiling", "source": "https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf"},
    {"fact": "KLA took the number one position in advanced wafer-level packaging process control in calendar 2025, adding 14 percentage points of share and growing that revenue about 70%", "source": "https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf"},
    {"fact": "KLA's process control share has grown 360 basis points since 2021 and is about 7x the nearest competitor", "source": "https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf"},
    {"fact": "KLA's March 2026 investor day puts its process control market share at 56.5% in 2024, up 2 points from 2021 and 6.5 times its nearest competitor", "source": "https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf"},
    {"fact": "CSET's Supply Chain Explorer puts KLA at 57.2% of a $13.4 billion process control tool market in 2024, ahead of Applied Materials at 10.5% and Lasertec at 7.7%", "source": "https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60"},
    {"fact": "KLA fiscal 2026 revenue was $13.579 billion, up from $12.156 billion in fiscal 2025", "source": "https://data.sec.gov/api/xbrl/companyconcept/CIK0000319201/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json"},
    {"fact": "ASML's HMI eScan 1100 uses 25 electron beams for up to 15x the throughput of single-beam e-beam inspection and finds patterning defects down to 7 nm", "source": "https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100"},
    {"fact": "KLA expects advanced packaging process control systems revenue of about $1.1 billion in calendar 2026, up more than 70% year-over-year and almost twice the growth rate of the advanced packaging market", "source": "https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf"},
    {"fact": "Onto Innovation signed a volume purchase agreement of over $240 million with an HBM maker for Dragonfly 2D inspection and 3D bump metrology through 2027", "source": "https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx"},
    {"fact": "Camtek 2025 revenue was a record $496.1 million, up 16% from $429.2 million", "source": "https://www.sec.gov/Archives/edgar/data/1109138/000117891326000549/zk2634405.htm"}
  ],
  "figures": [
    {
      "id": "pc-segments",
      "type": "bars",
      "title": "Process control market by tool family, 2024",
      "unit": "$M",
      "data": [["Defect inspection", 5900], ["Film and shape metrology", 2300], ["Mask inspection and repair", 2100], ["Overlay metrology", 906.6], ["CD metrology", 869.9], ["E-beam metrology", 769.5], ["Defect review", 618.1]],
      "source": {"label": "ETO Supply Chain Explorer, CSET", "url": "https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60"}
    },
    {
      "id": "pc-share",
      "type": "stack",
      "title": "Process control tool revenue share, 2024",
      "unit": "%",
      "data": [["KLA", 57.2], ["Applied Materials", 10.5], ["Lasertec", 7.7], ["Hitachi High-Tech", 5.6], ["ASML", 5.2], ["Nova", 3.7], ["Onto Innovation", 3.0], ["Camtek", 1.5], ["Rigaku", 1.2], ["All others", 4.4]],
      "source": {"label": "ETO Supply Chain Explorer, CSET", "url": "https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60"}
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

No fab is built around its inspection tools. Every fab fails without them. Process control is the quietest chokepoint in this chain and one of the tightest: KLA put its own share of the market at 56.5% in 2024, six and a half times its nearest competitor, at its March 2026 investor day ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)). CSET's supply chain data, counting the same year independently, gets 57.2% ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)).

## How it works

Every chip factory is really a quality-control operation. Machines print and build a pattern a thousand times over, and after many of those steps another machine looks at the wafer: are the lines the right width, did this layer land on the last one, has a speck of dirt killed a circuit. On a die as big as an AI accelerator, halving the number of stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells about seven times as many of those machines as its nearest rival.

A wafer loses value two ways: gross-area defects from mishandling, misalignment or over-etching, and spot defects from the process itself, the stray material and airborne particles that kill one circuit ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

The second kind has a governing equation: die yield is (1 + D0A/a) to the power minus a, where D0 is defects per square centimetre, A is die area and a is a clustering constant of 3 to 4. Yield falls faster than area rises: at a defect density of 0.8 a 1 square centimetre die yields 49 percent and a 2 by 2 centimetre die 11 percent, so the bigger die costs about twenty times as much ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

An 8 square centimetre die, the size of a reticle-limited AI accelerator, yields about 49 percent at a defect density of 0.10 and about 69 percent at 0.05. That is yield learning: find which of the thousand-odd steps is bleeding, fix it, move on.

## Variants and trade-offs

Six families of tool do the work, trading sensitivity against speed. All the market sizes and shares below are CSET's, for 2024 ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)).

- **Defect inspection** scans a whole wafer with light or electrons and compares each die against its neighbours. It is the largest family by a distance, $5.9 billion, and the one KLA owns outright at 84.6 percent. ASML's HMI eScan 1100 runs 25 beams for up to 15 times single-beam throughput and finds patterning defects down to 7 nm ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Film and shape metrology** measures how thick each film is and how flat the wafer sits, without cutting it open: $2.3 billion, with KLA at 47 percent, Nova at 20.6 and Onto Innovation at 13.6. Onto paid about $720 million in August 2026 for 27 percent of Japan's X-ray maker Rigaku ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Completes-Strategic-Investment-in-Rigaku-Holdings-Corporation/default.aspx)).
- **Mask inspection and repair** gets its own tools, because a defect on a reticle repeats on every die: $2.1 billion, and the one family KLA does not lead, behind Lasertec at 45.6 percent against KLA's 40.7 and Zeiss's 11.
- **Overlay metrology** measures whether this layer sits on the one below: $907 million, split almost evenly between KLA at 54.2 percent and ASML at 45.1.
- **Critical dimension metrology** measures how wide a printed feature actually came out: $870 million, and the one family Japan leads, with Hitachi at 69 percent and Applied Materials at 30.
- **E-beam metrology** resolves what light cannot: $770 million, led by Applied Materials at 49.5 percent with ASML at 37.6 and KLA at 11.9.

Optical carries the volume; e-beam catches what optical cannot see. How many wafers and sites to sample is a cost decision as much as a physics one.

{{figure:pc-segments}}

## Who makes it

KLA is the segment. It took 57.2 percent of a $13.4 billion process control tool market in 2024 ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)) — 56.5 percent on its own count, up two points since 2021 ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)). Fiscal 2026 revenue was $13.579 billion, after $12.156 billion in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000319201/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)), and it says it gained share again in 2025 across mask, optical wafer and e-beam inspection ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

{{figure:pc-share}}

The rest is specialised, not second. Nobody else reaches 11 percent.

- **Applied Materials** is the largest of them at 10.5 percent, selling e-beam review, CD-SEM and film metrology next to the deposition and etch tools that create the defects.
- **Lasertec** holds 7.7 percent, almost all of it mask inspection; **Hitachi High-Tech** 5.6 percent, almost all of it CD-SEM; **ASML** 5.2 percent through YieldStar overlay and HMI e-beam inspection.
- **Nova** holds 3.7 percent and took $880.6 million in 2025 on optical film and dimensional metrology ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001109345/us-gaap/Revenues.json)).
- **Onto Innovation** holds 3.0 percent on $1,005.3 million of 2025 revenue ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)) and **Camtek** 1.5 percent on $496.1 million ([source](https://www.sec.gov/Archives/edgar/data/1109138/000117891326000549/zk2634405.htm)).

Patterning, which includes overlay and reticle inspection, grew 61 percent year on year in the June 2026 quarter, when Taiwan took 31 percent of revenue and China 26 percent ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)).

{{figure:kla-mix}}

Against a wafer equipment market of roughly $120 billion in 2025, process control is about a tenth of fab tool spending, and rising ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). KLA credits tighter specifications, less redundancy and more logic content in memory built for high-performance computing ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

The moat is analytics as much as optics: inspection throws up far more candidate defects than engineers can look at, and KLA has spent five years putting AI classification through its whole line ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

## Packaging, AI and China

The AI packaging build-out is the fastest-growing part of this segment. KLA took the number one position in advanced wafer-level packaging process control in 2025, adding 14 points ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)), and expects about $1.1 billion of packaging process control revenue in 2026, more than 70 percent growth ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). Onto signed a volume purchase agreement worth over $240 million with an HBM maker for 2D inspection and 3D bump metrology through 2027 ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)).

China has made less progress here than anywhere else in the tool chain. In 2019 Chinese firms held 3.4 percent of CD measurement, 1.3 percent of defect inspection and none of photomask or packaging inspection ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). CSET's 2026 audit of where China gained runs through deposition, etch, CMP, lithography, packaging and test, and never reaches process control ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). That is an absence of evidence rather than evidence of absence. But nobody has published a Chinese gain here.

The December 2024 rule wrote process control into the export lists. It controls patterned-wafer defect inspection and metrology for 300 mm wafers that can find defects of 21 nm or smaller using light below 400 nm, or an electron beam resolving 1.65 nm, or a cold field emission source, or two or more beams ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). A foreign direct product rule carries the same reach to tools built outside the United States ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)).

## The chokepoint

Process control is a chokepoint by concentration, not by physics. Several firms can build a good film metrology tool, but one firm sets the standard across nearly the whole flow, and its lead is widening. A sanctioned fab can buy scanners and etchers on the grey market and still fail to ramp: without sensitive inspection it cannot find out why its yield is low.

## Key evaluation criteria

- **Sensitivity** — the smallest killer defect a tool can find. ASML's multibeam system is specified to 7 nm patterning defects ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Throughput** — wafers per hour, which decides how many lots you can afford to look at; multibeam buys up to 15x over single-beam ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Nuisance rate** — the share of flagged events that are not real defects, which is what AI classification attacks.
- **Sampling plan** — how many wafers and sites per lot, the direct lever on process control cost.
- **Time to result** — how fast a measurement reaches the process engineer, which sets the speed of yield learning.

## Takeaways

Yield is set by defect density and die area, and AI accelerators have the largest dies in production, so process control matters more here than anywhere else. KLA runs at roughly seven times the share of its nearest rival and is still gaining ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)), with Applied Materials, ASML, Onto, Nova and Camtek splitting the rest. Advanced packaging is the growth engine, taking KLA's packaging revenue toward $1.1 billion ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). And this is the one tool segment where nobody has recorded a Chinese gain, which makes it the most durable lever in the chain.
