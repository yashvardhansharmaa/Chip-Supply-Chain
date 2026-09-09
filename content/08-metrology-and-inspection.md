---json
{
  "id": "metrology-and-inspection",
  "number": 8,
  "title": "Metrology and Inspection",
  "oneLiner": "Nobody builds a fab around process control, and no fab works without it. One American firm holds about 57% of the market, roughly seven times its nearest rival, and is still pulling away.",
  "plain": "This stage is the factory's quality control. Machines build a chip in a thousand steps, and after many of them another machine inspects the wafer: are the lines the right width, did this layer land on the last one, has a speck of dirt killed a circuit. On a die as big as an AI accelerator, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a fab cut off from it can buy every other tool and still not learn why its chips fail.",
  "bridge": "Every one of those layers can land wrong, so between them the wafer goes to a machine that measures it and hunts for specks.",
  "specimen": "sem-column",
  "specimenCaption": "Right: a scanning electron microscope column over a wafer, cut in half, with the electron beam in copper. The electron gun sits at the top under its high-voltage insulator, the condenser and objective lenses are magnets drawn as iron yokes round their coils, then the scan coils, a ring-shaped detector, and the wafer on a precision stage.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "KLA", "country": "US", "share": "56.5% of process control in 2024 on its own investor-day count, 6.5 times its nearest rival; $13.58B revenue, fiscal 2026"},
      {"name": "Applied Materials", "country": "US", "share": "10.5% of process control tools in 2024: electron-beam defect review, line-width measurement and film metrology"},
      {"name": "Lasertec", "country": "JP", "share": "7.7% of process control tools in 2024, almost all of it mask inspection"},
      {"name": "ASML", "country": "NL", "share": "5.2% of process control tools in 2024: YieldStar layer alignment and HMI multibeam electron inspection"},
      {"name": "Nova", "country": "IL", "share": "3.7% of process control tools in 2024; $880.6M revenue, 2025"},
      {"name": "Onto Innovation", "country": "US", "share": "3.0% of process control tools in 2024; $1.01B revenue, 2025"}
    ],
    "countries": [
      {"code": "US", "note": "KLA (Milpitas), Onto Innovation (Wilmington, MA), Applied Materials"},
      {"code": "NL", "note": "ASML YieldStar and HMI e-beam, Veldhoven and San Jose"},
      {"code": "JP", "note": "Hitachi High-Tech CD-SEM; Lasertec mask inspection; Rigaku X-ray"},
      {"code": "IL", "note": "Nova (Rehovot) and Camtek (Migdal Haemek)"},
      {"code": "CN", "note": "Domestic entrants only; 0.8% of the process control tool market in 2024"}
    ],
    "chinaStatus": "The weakest Chinese position of any major tool segment. In 2019 domestic firms held 3.4% of line-width measurement, 1.3% of defect inspection and none of mask or packaging inspection; in 2024 they were still at 0.8% of the whole process control tool market. CSET's 2026 survey of Chinese share gains runs through deposition, etch, polishing, lithography, packaging and test, and never reaches process control.",
    "usStatus": "KLA is the largest process-control supplier in the world. It puts its own 2024 share at 56.5%, or 6.5 times its nearest rival; CSET's Supply Chain Explorer puts it at 57.2% of the same year's market. US firms take 72% of the segment, Japanese firms 15%. The December 2024 rule pulled inspection and measurement tools for patterned 300 mm wafers onto the controlled list, at a threshold of 21 nm defects.",
    "costSignal": "A $13.4B process control tool market in 2024, about 57% of it KLA's. KLA's fiscal 2026 revenue was $13.58B against a wafer equipment market of roughly $120B in 2025, so process control is around a tenth of what a fab spends on tools.",
    "substitution": {"years": "10+", "why": "Sensitivity comes from optics, electron columns and decades of catalogued defects. China gained real share in etch and deposition between 2019 and 2024; in process control it was still at 0.8% in 2024."}
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

Process control is about a tenth of what a fab spends on tools, out of a wafer equipment market of roughly $120 billion in 2025 ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). KLA takes more than half of that tenth. At its March 2026 investor day it put its own 2024 share at 56.5%, six and a half times its nearest competitor ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)); CSET, counting the same year independently, gets 57.2% ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)).

## How it works

This stage is the factory's quality control. Machines build a chip in a thousand steps, and after many of them another machine inspects the wafer: are the lines the right width, did this layer land on the last one, has a speck of dirt killed a circuit. On a die as big as an AI accelerator, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a fab cut off from it can buy every other tool and still not learn why its chips fail.

A wafer loses value two ways: whole regions ruined by mishandling, misalignment or over-etching, and single circuits killed by stray material or an airborne particle ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

The second kind follows an equation: die yield is (1 + D0A/a) to the power minus a, where D0 is defects per square centimetre, A is die area and a is a clustering constant of 3 to 4. Yield falls faster than area rises: at a defect density of 0.8 a 1 square centimetre die yields 49 percent and a 2 by 2 centimetre die 11 percent, so the bigger die costs about twenty times as much ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

Run that equation with a clustering constant of 3 for an 8 square centimetre die, about as much as one exposure can print, and it yields about 49 percent at a defect density of 0.10 and about 69 percent at 0.05 ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)). Getting from one to the other is yield learning: find which of the thousand-odd steps is losing dies, fix it, move on.

## Variants and trade-offs

The tools trade sensitivity against speed. All the market sizes and shares below are CSET's, for 2024 ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)).

- **Defect inspection** scans a whole wafer with light or electrons and compares each die against its neighbours. It is the largest family by a distance, $5.9 billion, and the one KLA owns outright at 84.6 percent. ASML's HMI eScan 1100 runs 25 electron beams at once, up to 15 times the speed of a single beam, and finds patterning defects down to 7 nm ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Film and shape metrology** measures how thick each film is and how flat the wafer sits, without cutting it open: $2.3 billion, with KLA at 47 percent, Nova at 20.6 and Onto Innovation at 13.6. Onto paid about $720 million in August 2026 for 27 percent of Japan's X-ray maker Rigaku ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Completes-Strategic-Investment-in-Rigaku-Holdings-Corporation/default.aspx)).
- **Mask inspection and repair** gets its own tools, because a defect on a mask repeats on every die: $2.1 billion, and the one family KLA does not lead, behind Lasertec at 45.6 percent against KLA's 40.7 and Zeiss's 11.
- **Overlay metrology** measures whether this layer sits on the one below: $907 million, split almost evenly between KLA at 54.2 percent and ASML at 45.1.
- **Critical dimension metrology** measures how wide a printed feature actually came out: $870 million, and the one family Japan leads, with Hitachi at 69 percent and Applied Materials at 30.
- **Electron-beam metrology** resolves detail too fine for light: $770 million, led by Applied Materials at 49.5 percent with ASML at 37.6 and KLA at 11.9.

{{figure:pc-segments}}

## Who makes it

KLA is most of the segment: 57.2 percent of a $13.4 billion market in 2024 ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)), up two points on its own count since 2021 ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)). Its fiscal 2026 revenue was $13.579 billion, after $12.156 billion in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000319201/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)), and it says it gained share again in 2025 across mask, optical wafer and e-beam inspection ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

{{figure:pc-share}}

The rest are specialists, and nobody else reaches 11 percent.

- **Applied Materials** is the largest of them at 10.5 percent, selling e-beam defect review, CD-SEM line-width tools and film metrology next to the deposition and etch tools that create the defects.
- **Lasertec** holds 7.7 percent, almost all of it mask inspection; **Hitachi High-Tech** 5.6 percent, almost all of it CD-SEM; **ASML** 5.2 percent through YieldStar overlay and HMI e-beam inspection.
- **Nova** holds 3.7 percent and took $880.6 million in 2025 on optical film and dimensional metrology ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001109345/us-gaap/Revenues.json)).
- **Onto Innovation** holds 3.0 percent on $1,005.3 million of 2025 revenue ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)) and **Camtek** 1.5 percent on $496.1 million ([source](https://www.sec.gov/Archives/edgar/data/1109138/000117891326000549/zk2634405.htm)).

Patterning, which covers overlay and mask inspection, grew 61 percent year on year in the June 2026 quarter, when Taiwan took 31 percent of revenue and China 26 percent ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)).

{{figure:kla-mix}}

Process control's share of fab spending is still rising, and KLA credits tighter specifications, less built-in redundancy and more logic inside memory built for high-performance computing ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

The advantage is analytics as much as optics: inspection throws up far more candidate defects than engineers can look at, and KLA has spent five years putting AI classification through its whole line ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

## Packaging, AI and China

The AI packaging build-out is where this segment is growing fastest. KLA took the number one position in advanced wafer-level packaging process control in 2025, adding 14 points ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)), and expects about $1.1 billion of packaging process control revenue in 2026, more than 70 percent growth ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). Onto signed a volume purchase agreement worth over $240 million with an HBM maker for 2D inspection and 3D bump metrology through 2027 ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)).

China has made less progress here than anywhere else in the tool chain. In 2019 Chinese firms held 3.4 percent of line-width measurement, 1.3 percent of defect inspection and none of photomask or packaging inspection ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Five years later they were at 0.8 percent of the whole process control tool market ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)). CSET's 2026 audit of where China gained runs through deposition, etch, polishing, lithography, packaging and test, and never reaches process control ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Nobody has published a Chinese gain here, which is not the same as there being none.

The December 2024 rule wrote process control into the export lists. It controls defect inspection and measurement of patterned 300 mm wafers where the tool can find defects of 21 nm or smaller using light below 400 nm, or an electron beam resolving 1.65 nm, or a cold field emission source, or two or more beams ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). A foreign direct product rule carries the same reach to tools built outside the United States ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)).

## The chokepoint

Process control is a chokepoint of concentration rather than of physics. Several firms can build a good film metrology tool, but one firm sets the standard across nearly the whole flow, and its lead is widening. A sanctioned fab can buy scanners and etchers on the grey market and still fail to get production going: without sensitive inspection it cannot find out why its yield is low.

## Key evaluation criteria

- **Sensitivity** — the smallest killer defect a tool can find. ASML's multibeam system is specified to 7 nm patterning defects ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Throughput** — wafers per hour, which decides how many lots you can afford to look at; multibeam buys up to 15x over single-beam ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Nuisance rate** — the share of flagged events that turn out not to be real defects, which is what AI classification attacks.
- **Sampling plan** — how many wafers and sites per lot, a cost decision as much as a physics one, and what sets the price of process control.
- **Time to result** — how fast a measurement reaches the process engineer, which sets the speed of yield learning.

## Takeaways

Yield is set by defect density and die area, and AI accelerators have the largest dies in production. KLA holds about 57 percent of the market, six to seven times its nearest rival, and is still gaining ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)), with Applied Materials, Lasertec, Hitachi High-Tech, ASML, Nova, Onto and Camtek splitting the rest ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)). KLA's packaging process control revenue is heading toward $1.1 billion in 2026 ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). And this is the one tool segment where nobody has recorded a Chinese gain, which is why the controls on it are the hardest for China to work around.
