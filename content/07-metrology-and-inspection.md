---json
{
 "id": "metrology-and-inspection",
 "number": 7,
 "title": "Metrology and Inspection",
 "oneLiner": "No fab is planned around measuring and inspecting wafers, and no fab works without it. One American firm holds about 57% of the market for those tools, roughly seven times its nearest rival, and its share is still growing.",
 "plain": "Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over. It checks whether the lines are the right width, whether this layer landed squarely on the last one, and whether a speck of dirt has killed a circuit. An AI accelerator is the part built to run AI, and its main chip, the one that does the calculating, is one of the largest cut from a wafer. A bigger chip is a bigger target for a speck. On a chip that size, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a chip factory, or fab, cut off from it can buy every other tool and still not learn why its chips fail.",
 "bridge": "Every one of those films can be laid down wrong, and the fault is invisible until a tool looks for it.",
 "specimen": "sem-column",
 "specimenCaption": "An electron-beam inspection column standing over a 300 mm wafer, cut in half down its axis. The column is about a meter tall, drawn to scale. The green line is the electron beam, running from the emitter at the top through the lenses to the spot where it lands on the wafer.",
 "card": {
 "concentration": "High",
 "chokepointScore": 4,
 "leaders": [
 {"name": "KLA", "country": "US", "share": "56.5% of process control in 2024 on its own investor-day count, 6.5 times its nearest rival; $13.58B revenue, fiscal 2026"},
 {"name": "Applied Materials", "country": "US", "share": "11.2% of process control tools in 2025: electron-beam defect review, line-width measurement and film metrology"},
 {"name": "Lasertec", "country": "JP", "share": "6.4% of process control tools in 2025, almost all of it mask inspection"},
 {"name": "ASML", "country": "NL", "share": "5.9% of process control tools in 2025: YieldStar layer alignment and HMI multibeam electron inspection"},
 {"name": "Nova", "country": "IL", "share": "4.3% of process control tools in 2025; $880.6M revenue, 2025"},
 {"name": "Onto Innovation", "country": "US", "share": "2.6% of process control tools in 2025; $1.01B revenue, 2025"}
 ],
 "countries": [
 {"code": "US", "note": "KLA (Milpitas), Onto Innovation (Wilmington, MA), Applied Materials"},
 {"code": "NL", "note": "ASML YieldStar and HMI e-beam, Veldhoven and San Jose"},
 {"code": "JP", "note": "Hitachi High-Tech CD-SEM; Lasertec mask inspection; Rigaku X-ray"},
 {"code": "IL", "note": "Nova (Rehovot) and Camtek (Migdal Haemek)"},
 {"code": "CN", "note": "Domestic entrants only; 0.7% of the process control tool market in 2025"}
 ],
 "chinaStatus": "Of all major kinds of chipmaking tool, metrology and inspection is where Chinese makers are weakest. In 2019 Chinese firms held 3.4 percent of line-width measurement, 1.3 percent of defect inspection and none of mask or packaging inspection. In 2025 they still held 0.7 percent of the whole market for these tools. CSET's 2026 survey of Chinese share gains covers deposition, etch, polishing, lithography, packaging and test, and does not cover measurement and inspection.",
 "usStatus": "KLA is the largest maker of metrology and inspection tools in the world. It puts its own 2024 share at 56.5 percent, or 6.5 times its nearest rival. CSET's Supply Chain Explorer puts it at 56.8 percent of the 2025 market. American firms hold 72 percent of this market and Japanese firms 14 percent. A December 2024 US rule added inspection and measurement tools for patterned 300 mm wafers to the controlled list, for tools that can find defects 21 nm across or smaller.",
 "costSignal": "A $15.7B process control tool market in 2025, about 57% of it KLA's. KLA's fiscal 2026 revenue was $13.58B against a wafer equipment market of roughly $120B in 2025, so process control is around a tenth of what a fab spends on tools.",
 "substitutability": {"band": "Moderate", "test": "KLA is the largest maker of measuring and inspecting tools, but every kind has a second maker, so losing KLA would slow a fab without stopping it.", "why": "Metrology and inspection tools measure and inspect wafers so a fab can find and fix faults in its process. KLA is the biggest maker, but seven other firms ship approved tools, and three of them are the leader in one kind of tool. A fab that loses KLA and buys from the others keeps running. It finds fewer flaws and fixes them more slowly, and it needs two to five years to return to its old performance. A country that is not allowed to buy from any of them would take far longer: Chinese firms held 0.7 percent of the market for these tools in 2025."}
 },
 "keyFacts": [
 {"fact": "Die yield is (1 + D0A/a) to the power minus a, with a of 3 to 4 for modern CMOS, so defect density and die area alone set the ceiling", "source": "https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf"},
 {"fact": "KLA became the largest supplier of process control tools for advanced wafer-level packaging in calendar 2025, adding 14 percentage points of share and growing that revenue about 70%", "source": "https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf"},
 {"fact": "KLA's process control share has grown 3.6 percentage points since 2021 and is about 7x the nearest competitor", "source": "https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf"},
 {"fact": "KLA's March 2026 investor day puts its process control market share at 56.5% in 2024, up 2 points from 2021 and 6.5 times its nearest competitor", "source": "https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf"},
 {"fact": "CSET's Supply Chain Explorer puts KLA at 56.8% of a $15.7 billion process control tool market in 2025, ahead of Applied Materials at 11.2% and Lasertec at 6.4%", "source": "https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60"},
 {"fact": "KLA fiscal 2026 revenue was $13.579 billion, up from $12.156 billion in fiscal 2025", "source": "https://data.sec.gov/api/xbrl/companyconcept/CIK0000319201/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json"},
 {"fact": "ASML's HMI eScan 1100 uses 25 electron beams for up to 15x the throughput of single-beam e-beam inspection and finds patterning defects down to 7 nm", "source": "https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100"},
 {"fact": "KLA expects advanced packaging process control systems revenue of about $1.1 billion in calendar 2026, up more than 70% year-over-year and almost twice the growth rate of the advanced packaging market", "source": "https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf"},
 {"fact": "Onto Innovation signed a volume purchase agreement of over $240 million with an HBM maker for Dragonfly 2D inspection and 3D bump metrology through 2027", "source": "https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx"},
 {"fact": "Camtek 2025 revenue was a record $496.1 million, up 16% from $429.2 million", "source": "https://www.sec.gov/Archives/edgar/data/1109138/000117891326000549/zk2634405.htm"}
 ],
 "figures": [
    {"id": "defect-yield", "type": "animation", "src": "defects", "title": "Why big chips lose more to defects", "note": "Simulated 300 mm wafer: 68 specks, 0.10 per square centimeter, placed at random in loose clusters. The share of working chips follows the formula above with a clustering constant of 3."},
 {
 "id": "pc-segments",
 "type": "bars",
 "title": "Process control market by tool family, 2025",
 "unit": "$M",
 "data": [["Defect inspection", 6700], ["Film and shape metrology", 2600], ["Mask inspection and repair", 2200], ["E-beam metrology", 1300], ["CD metrology", 1200], ["Overlay metrology", 991.4], ["Defect review", 729.1]],
 "source": {"label": "ETO Supply Chain Explorer, CSET", "url": "https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60"}
 },
 {
 "id": "pc-share",
 "type": "stack",
 "title": "Process control tool revenue share, 2025",
 "unit": "%",
 "data": [["KLA", 56.8], ["Applied Materials", 11.2], ["Lasertec", 6.4], ["Hitachi High-Tech", 6.2], ["ASML", 5.9], ["Nova", 4.3], ["Onto Innovation", 2.6], ["Camtek", 1.6], ["Rigaku", 1.2], ["All others", 3.8]],
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

Process control is about a tenth of what a fab spends on tools, out of a wafer equipment market of roughly $120 billion in 2025 ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). At its March 2026 investor day KLA put its own 2024 share at 56.5 percent, six and a half times its nearest competitor ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)); CSET's own count for 2025 is 56.8 percent ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)).

## How it works

Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over. It checks whether the lines are the right width, whether this layer landed squarely on the last one, and whether a speck of dirt has killed a circuit. An AI accelerator is the part built to run AI, and its main chip, the one that does the calculating, is one of the largest cut from a wafer. A bigger chip is a bigger target for a speck. On a chip that size, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a chip factory, or fab, cut off from it can buy every other tool and still not learn why its chips fail.

An inspection tool sweeps a beam of light across the wafer, photographs it, and compares the image of each chip with the image of its neighbors. The chips on a wafer are meant to be identical, so anything that shows in one and not the others is a defect, and the tool records where it is. For faults too small for light to show, a second tool scans a beam of electrons across a small patch and builds a picture from the electrons that bounce back.

A metrology tool measures known shapes. It shines light on a test pattern printed beside the circuits and works out from the scatter how wide the lines are and how thick the film is, and it reads marks printed in this layer and the last to measure how far the two are out of line, which is overlay.

The fab pays for all this to protect yield, the share of chips on a wafer that work. A wafer loses value two ways: whole regions ruined by mishandling, misalignment or over-etching, and single circuits killed by stray material or an airborne particle ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

A bigger chip is a bigger target for the second kind, and the loss grows faster than the area. In the standard formula, die yield is (1 + D0A/a) to the power minus a, where D0 is defects per square centimeter, A is die area and a is a clustering constant of 3 to 4, which says how much defects bunch together. At a defect density of 0.8 a 1 square centimeter die yields 49 percent and a 2 by 2 centimeter die 11 percent, so the bigger die costs about twenty times as much ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

Run that equation with a clustering constant of 3 for an 8 square centimeter die, about as much as one exposure can print, and it yields about 49 percent at a defect density of 0.10 and about 69 percent at 0.05 ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)). Getting from one to the other is yield learning: find which of the thousand-odd steps is losing dies, fix it, move on.

{{figure:defect-yield}}

## Variants and trade-offs

The tools trade sensitivity against speed. All the market sizes and shares below are CSET's, for 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)).

- **Defect inspection** scans a whole wafer with light or electrons and compares each die against its neighbors. It is by far the largest family, $6.7 billion, and the one KLA dominates, at 85.9 percent. ASML's HMI eScan 1100 runs 25 electron beams at once, up to 15 times the speed of a single beam, and finds patterning defects down to 7 nm ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Film and shape metrology** measures how thick each film is and how flat the wafer sits, without cutting it open: $2.6 billion, with KLA at 45.6 percent, Nova at 24.6 and Onto Innovation at 10.9. Onto paid about $720 million in August 2026 for 27 percent of Japan's X-ray maker Rigaku ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Completes-Strategic-Investment-in-Rigaku-Holdings-Corporation/default.aspx)).
- **Mask inspection and repair** gets its own tools, because a defect on a mask repeats on every die: $2.2 billion, and the one family where KLA has a close rival, 45.9 percent against Lasertec's 42 and Zeiss's 10.1.
- **Overlay metrology** measures whether this layer sits on the one below: $991 million, split almost evenly between KLA at 51.5 percent and ASML at 47.9.
- **Critical dimension metrology** measures how wide a printed feature actually came out: $1.2 billion, and the one family Japan leads, with Hitachi at 71.9 percent and Applied Materials at 27.5.
- **Electron-beam metrology** resolves detail too fine for light: $1.3 billion, led by Applied Materials at 45.1 percent with ASML at 35.6 and KLA at 18.8.

{{figure:pc-segments}}

## Who makes it

KLA is most of the segment: 56.8 percent of a $15.7 billion market in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)), up two points since 2021 by its own figures ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)). Its fiscal 2026 revenue was $13.579 billion, after $12.156 billion in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000319201/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)), and it says it gained share again in 2025 across mask, optical wafer and e-beam inspection ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

{{figure:pc-share}}

The rest are specialists, and nobody else reaches 11 percent.

- **Applied Materials** is the largest of them at 10.5 percent, selling e-beam defect review, CD-SEM line-width tools and film metrology next to the deposition and etch tools that create the defects.
- **Lasertec** holds 7.7 percent, almost all of it mask inspection; **Hitachi High-Tech** 5.6 percent, almost all of it CD-SEM; **ASML** 5.2 percent through YieldStar overlay and HMI e-beam inspection.
- **Nova** holds 3.7 percent and took $880.6 million in 2025 on optical film and dimensional metrology ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001109345/us-gaap/Revenues.json)).
- **Onto Innovation** holds 3.0 percent on $1,005.3 million of 2025 revenue ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)) and **Camtek** 1.5 percent on $496.1 million ([source](https://www.sec.gov/Archives/edgar/data/1109138/000117891326000549/zk2634405.htm)).

Patterning, which covers overlay and mask inspection, grew 61 percent year on year in the June 2026 quarter, when Taiwan took 31 percent of revenue and China 26 percent ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)).

{{figure:kla-mix}}

Process control's share of fab spending is still rising, and KLA credits tighter specifications, less built-in redundancy and more logic inside memory built for high-performance computing ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

The advantage is analytics as much as optics: inspection produces far more candidate defects than engineers can look at, and KLA has spent five years putting AI classification through its whole line ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)).

## Packaging, AI and China

The AI packaging build-out is where this segment is growing fastest. KLA took the number one position in advanced wafer-level packaging process control in 2025, adding 14 points ([source](https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf)), and expects about $1.1 billion of packaging process control revenue in 2026, more than 70 percent growth ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). Onto signed a volume purchase agreement worth over $240 million with an HBM maker for 2D inspection and 3D bump metrology through 2027 ([source](https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx)).

China has made less progress in process control than anywhere else in the tool chain. In 2019 Chinese firms held 3.4 percent of line-width measurement, 1.3 percent of defect inspection and none of photomask or packaging inspection ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Six years later they were at 0.7 percent of the whole process control tool market ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)). CSET's 2026 audit of where China gained runs through deposition, etch, polishing, lithography, packaging and test, and never reaches process control ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).

The December 2024 rule wrote process control into the export lists. It controls defect inspection and measurement of patterned 300 mm wafers where the tool can find defects of 21 nm or smaller using light below 400 nm, or an electron beam resolving 1.65 nm, or a cold field emission source, or two or more beams ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). A foreign direct product rule carries the same reach to tools built outside the United States ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)).

## The chokepoint

Process control is a chokepoint of concentration. Several firms can build a good film metrology tool, but one firm sets the standard across nearly the whole flow, and its lead is widening. A sanctioned fab can buy scanners and etchers on the gray market and still fail to get production going, because without sensitive inspection it cannot find out why its yield is low.

## Key evaluation criteria

- **Sensitivity.** The smallest killer defect a tool can find. ASML's multibeam system is specified to 7 nm patterning defects ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Throughput.** Wafers per hour, which decides how many lots a fab can afford to look at; multibeam buys up to 15x over single-beam ([source](https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-escan-1100)).
- **Nuisance rate.** The share of flagged events that turn out not to be real defects, which is what AI classification is meant to reduce.
- **Sampling plan.** How many wafers and sites per lot, a cost decision as much as a physics one, which sets what process control costs the fab.
- **Time to result.** How fast a measurement reaches the process engineer, which sets the speed of yield learning.

## Takeaways

Yield is set by defect density and die area, and AI accelerators have the largest dies in production. KLA holds about 57 percent of the market, six to seven times its nearest rival, and is still gaining ([source](https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf)), with Applied Materials, Lasertec, Hitachi High-Tech, ASML, Nova, Onto and Camtek splitting the rest ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)). KLA's packaging process control revenue is heading toward $1.1 billion in 2026 ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). No one has recorded a Chinese gain in process control, which is why the controls on it are the ones China can least easily answer with domestic tools.
