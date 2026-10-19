---json
{
 "id": "deposition-and-etch",
 "number": 6,
 "title": "Deposition and Etch",
 "oneLiner": "Deposition and etch tools build a chip layer by layer. They are among the chipmaking tools where Chinese toolmakers gained the most share from 2019 to 2024.",
 "plain": "Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. Making one chip takes 1,000 to 1,500 steps, the Semiconductor Industry Association estimated in 2025 ([source](https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1)). Some of the holes the etch cuts are more than 50 times deeper than they are wide, like a finger-wide shaft about a meter deep ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)). The film has to coat them right to the bottom. The etch has to eat one material and leave the one beside it untouched. Applied Materials and Lam Research in America, Tokyo Electron in Japan and ASM International in the Netherlands make most of these machines. Chinese toolmakers have gained share in both kinds of tool since 2019.",
 "bridge": "A printed pattern is not yet a circuit, and the machines that turn it into one run many times on every wafer.",
 "specimen": "process-chamber",
 "specimenCaption": "A plasma etch chamber cut in half. The vessel is 500 mm across inside and holds one 300 mm wafer clamped to a chuck at the bottom. The violet haze above the wafer is the plasma. The gap it fills is drawn about twice its real height of 30 to 40 mm. The rest is to scale.",
 "card": {
 "concentration": "High",
 "chokepointScore": 4,
 "leaders": [
 {"name": "Applied Materials", "country": "US", "share": "$28.4B revenue, fiscal 2025; leader in physical and chemical vapor deposition"},
 {"name": "Lam Research", "country": "US", "share": "$23.2B revenue, fiscal 2026; leader in conductor etch"},
 {"name": "Tokyo Electron", "country": "JP", "share": "23% of dry etch and 38% of tube and low-pressure CVD, 2025"},
 {"name": "ASM International", "country": "NL", "share": "€3.2B revenue, 2025; leader in atomic layer deposition"},
 {"name": "Naura", "country": "CN", "share": "14.7% of PVD, 2025"}
 ],
 "countries": [
 {"code": "US", "note": "Applied Materials, Lam Research"},
 {"code": "JP", "note": "Tokyo Electron, Kokusai Electric"},
 {"code": "NL", "note": "ASM International, atomic layer deposition"},
 {"code": "KR", "note": "Large equipment buyer"},
 {"code": "CN", "note": "Naura, AMEC, Piotech; largest equipment market at $49.3B in 2025"}
 ],
 "chinaStatus": "Chinese toolmakers held 12.4 percent of dry etch in 2025, according to CSET's analysis of TechInsights data. CSET's earlier analysis had them under 1 percent of atomic layer deposition in 2024.",
 "usStatus": "The US government lists some dry etch, atomic layer deposition and deep-hole deposition tools as controlled exports. Its December 2024 foreign direct product rule reaches some tools built outside the United States.",
 "costSignal": "$135.1B world sales of chipmaking equipment in 2025, with wafer processing tools up 12%",
 "substitutability": {"band": "Moderate", "test": "Most deposition and etch steps have three or four established toolmakers.", "why": "Atomic layer deposition lays down a film a fraction of a layer of atoms at a time. At least five makers sell it, led by ASM International with 54.5 percent in 2025."}
 },
 "keyFacts": [
 {"fact": "Producing one chip takes 1,000 to 1,500 steps, depending on how complex it is. A part-finished chip can cross international borders 70 or more times (SIA, 2025, with the border-crossing figure from a 2020 Accenture and Global Semiconductor Alliance study)", "source": "https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1"},
 {"fact": "Global sales of chipmaking equipment reached $135.1B in 2025, up 15% from $117.1B in 2024, with wafer processing equipment up 12% (SEMI)", "source": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"},
 {"fact": "China bought $49.3B of semiconductor equipment in 2025, down 0.5% and still the largest single market. Taiwan's purchases rose 90% to a record $31.5B (SEMI)", "source": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"},
 {"fact": "Tokyo Electron's own fiscal 2026 results presentation puts its world share in calendar 2025 at 23% of dry etch, 38% of tube and low-pressure CVD and 15% of ALD, against 91% of coater/developers", "source": "https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf"},
 {"fact": "China-based suppliers held 9.8% of deposition tools worldwide in 2025 but only 2.6% of ALD tools, according to CSET's analysis of TechInsights data published in July 2026", "source": "https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41"},
 {"fact": "AMEC's 2025 revenue was RMB 12.385 billion, up 36.6%, and its thin-film tool revenue rose 224%. It spent RMB 3.744 billion on R&D, 30.2% of sales", "source": "https://www.amec-inc.com/news/708.html"},
 {"fact": "BIS controls TSV etch tools at aspect ratios of 10:1 or greater with etch rates above 7 microns per minute (ECCN 3B001.c.4)", "source": "https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf"},
 {"fact": "Lam Research's fiscal 2026 revenue was $23.23 billion, up 26% from $18.44 billion", "source": "https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm"}
 ],
 "figures": [
    {"id": "dep-etch-cycle", "type": "animation", "src": "dep-etch", "title": "One round of deposition and etch", "note": "Simplified cross-section. The layers are drawn much thicker than they are."},
 {
 "id": "equipment-billings",
 "type": "bars",
 "title": "What the world spent on chipmaking equipment",
 "unit": "$B",
 "data": [["2024", 117.1], ["2025", 135.1]],
 "source": {"label": "SEMI, Worldwide Semiconductor Equipment Market Statistics", "url": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"}
 },
 {
 "id": "tel-tool-share",
 "type": "bars",
 "title": "Tokyo Electron world market share by tool type, 2025",
 "unit": "%",
 "data": [["Coater/developer", 91], ["Tube and low-pressure CVD", 38], ["Oxidation/diffusion", 31], ["Deposition (furnace, ALD, LPCVD)", 27], ["Dry etch", 23], ["Cleaning", 20], ["ALD", 15]],
 "source": {"label": "Tokyo Electron FY2026 Q4 results presentation", "url": "https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf"}
 },
 {
 "id": "china-tool-share",
 "type": "bars",
 "title": "China-based suppliers' share of global tool segments, 2025",
 "unit": "%",
 "data": [["Dry strip (mostly Mattson)", 31], ["PVD", 14.7], ["Dielectric etch", 13.4], ["Dry etch", 12.4], ["Etch and clean", 10.1], ["Deposition", 9.8], ["CVD", 8.8], ["Lithography (i-line)", 4.2], ["ALD", 2.6]],
 "source": {"label": "CSET analysis of TechInsights data (published July 2026), ETO Chip Explorer", "url": "https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N36"}
 }
 ]
}
---
# Deposition and Etch

Applied Materials and Lam Research are the two largest deposition and etch suppliers. Applied Materials booked $28.4 billion of revenue in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000006951/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)). Lam Research booked $23.2 billion in fiscal 2026 ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).

## How it works

Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. Making one chip takes 1,000 to 1,500 steps, the Semiconductor Industry Association estimated in 2025 ([source](https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1)). Some of the holes the etch cuts are more than 50 times deeper than they are wide, like a finger-wide shaft about a meter deep ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)). The film has to coat them right to the bottom. The etch has to eat one material and leave the one beside it untouched. Applied Materials and Lam Research in America, Tokyo Electron in Japan and ASM International in the Netherlands make most of these machines. Chinese toolmakers have gained share in both kinds of tool since 2019.

{{figure:dep-etch-cycle}}

Most etch steps, and many deposition steps, happen in a vacuum chamber that holds one wafer at a time. A pump empties the chamber of air, and a measured flow of gas comes in. A radio-frequency field, an electric field that reverses millions of times a second, turns the gas into a plasma. The field splits the gas into charged ions and into neutral fragments called radicals, which are more reactive than whole molecules ([source](https://newsroom.lamresearch.com/etch-essentials-semiconductor-manufacturing)). Batch furnaces such as Tokyo Electron's TELINDY PLUS instead heat as many as 125 wafers at once, usually without plasma, for oxidation, low-pressure chemical vapor deposition and some atomic layer deposition ([source](https://www.tel.com/product/telindy.html)).

For deposition, the gas carries the material the film will be made of. The molecules, or the radicals a plasma splits from them, land on the wafer and stick. The film builds from the bottom up, a few atoms at a time.

To coat the floor of a deep hole as thickly as its rim, the machine can work in cycles, a method called atomic layer deposition. First one gas settles in a single layer on every surface, and the pump removes the rest. Then a second gas reacts with that layer and nothing else, and the pump empties the chamber again. Each cycle adds a fraction of a layer of atoms wherever the gas reached, so the film grows as evenly on a hole's walls and floor as on its rim ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).

For etch, the gas attacks one material and leaves the one beside it. Wherever the photoresist pattern covers the wafer, nothing happens. Wherever it does not, the radicals react with the surface and turn it into a gas, which the pump carries away. A second field pulls the ions straight down at the wafer, so the etch cuts vertically and a narrow hole keeps its width as it deepens ([source](https://newsroom.lamresearch.com/etch-essentials-semiconductor-manufacturing)). When the etch reaches the material underneath, which the gas was chosen not to touch, it slows almost to a stop, and the tool ends the step.

Deposition and etch chambers are separate products built from similar vacuum, gas and radio-frequency parts, and the export controls describe each tool by the process it is designed to run ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).

Accenture and the Global Semiconductor Alliance estimated in 2020 that a part-finished chip can cross international borders 70 or more times on its way to the end customer ([source](https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1)). The Semiconductor Industry Association repeated the figure in 2025 ([source](https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1)).

## Variants and trade-offs

### Deposition families

The market sizes and leading shares below are 2025 figures from Georgetown University's Center for Security and Emerging Technology (CSET), based on data from the research firm TechInsights. CSET puts the deposition tool market at $26.2 billion ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N36)). It puts the dry etch market at $21.9 billion ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N103)).

- **Physical vapor deposition** (PVD), which knocks atoms off a solid target and lands them on the wafer, was a $4.9 billion market in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N42)). Applied Materials held 82.4 percent of it and China's Naura 14.7 percent ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N42)).
- **Chemical vapor deposition** (CVD), which reacts gases at the wafer surface to grow a film, was an $11.2 billion market in 2025, led by Applied Materials at 47 percent ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N47)). The plasma-enhanced version (PECVD) runs cooler and made up most of it, $7.5 billion ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N38)).
- **Atomic layer deposition** (ALD) lays down less than one atomic layer at a time, so it coats vertical walls as evenly as horizontal floors. US regulators say that even coating makes it important for building 3D structures, such as 3D DRAM, 3D NAND, and the FinFET and gate-all-around transistors in logic chips ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). ASM International leads it with 54.5 percent of a $4.1 billion market in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41)).
- **Epitaxy** grows layers that line up with the crystal beneath them, using high-temperature CVD tools ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N40)). **Electroplating** deposits the copper used for wiring across the wafer ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

### Etch families

- **Conductor etch**, which cuts gates, metals and silicon, was a $12.2 billion market in 2025, led by Lam at 51.2 percent ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N50)).
- **Dielectric etch**, which cuts the insulating oxides and nitrides between them, was an $8.7 billion market in 2025, led by Tokyo Electron at 55.9 percent ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N51)).
- **High-aspect-ratio etch** cuts the deep, narrow channels that let 3D NAND stack layers of memory cells ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)). Lam says slight departures from a channel's intended shape can hurt yield ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)). Lam runs this etch well below 0 degrees Celsius ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)). It says its Cryo 3.0 technology keeps the deviation in a channel's width from top to bottom under 0.1 percent, in channels up to 10 microns deep ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)).

AI hardware needs sideways cuts, deeper holes and a second stack of metal wiring on the back of the wafer.

- **Gate-all-around** transistors need highly selective isotropic etch, which cuts sideways ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). The US Bureau of Industry and Security (BIS) controls isotropic dry etch tools that remove silicon-germanium at least 100 times faster than silicon, a selectivity of 100:1 or more ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **HBM** (high-bandwidth memory) needs holes etched straight through the silicon, called through-silicon vias (TSVs), so chips can be stacked and wired ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). BIS controls the tools that etch these holes at aspect ratios (depth to width) of 10:1 or more and at rates above 7 microns a minute ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Backside power delivery** moves the wires that carry power to the back of the wafer ([source](https://download.intel.com/newsroom/archive/2025/en-us-2023-06-05-powervia-test-shows-industryleading-performance.pdf)). Applied Materials expects it to add another $1 billion per 100,000 wafer starts a month to the wiring market it serves ([source](https://www.globenewswire.com/news-release/2024/07/08/2909540/0/en/applied-materials-unveils-chip-wiring-innovations-for-more-energy-efficient-computing.html)).

{{figure:tel-tool-share}}

## Who makes it

The industry association SEMI put world sales of chipmaking equipment at $135.1 billion in 2025, up 15 percent from $117.1 billion ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)). Sales of wafer processing equipment, the category that includes deposition and etch tools, rose 12 percent ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)).

No one firm dominates deposition and etch the way ASML dominates lithography. Tokyo Electron's own results presentation gives it 23 percent of dry etch, 27 percent of deposition systems (furnace, ALD and low-pressure CVD tools) and 15 percent of ALD in 2025 ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)). The same presentation gives it 91 percent of coater/developers in 2025 ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)). These machines coat wafers with photoresist and develop the pattern after lithography.

ASM International, the atomic layer deposition specialist, reached a record EUR 3.2 billion of revenue in 2025 as customers built 2 nm gate-all-around capacity ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)). Molybdenum ALD, a new use of its tools that deposits the metal molybdenum, entered volume production that year ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

{{figure:equipment-billings}}

## China and the controls

China is the tool vendors' largest market, and Chinese toolmakers have gained share since 2019 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). It bought $49.3 billion of equipment in 2025, half a percent less than in 2024, and remained the biggest single market ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)). Taiwan's spending rose 90 percent to $31.5 billion ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)). South Korea's rose 26 percent to $25.8 billion ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)). China still takes a large share of every major vendor's sales.

- **Tokyo Electron**: 34.1 percent of sales in the year to March 2026, down from 41.7 percent ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).
- **Lam Research**: 26 percent in the June 2026 quarter, behind Taiwan at 27 percent ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).
- **Applied Materials**: 28 percent in the third fiscal quarter of 2026, down from 35 percent ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).
- **ASM International**: more than 30 percent of 2025 revenue ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

Between 2019 and 2024 China-based suppliers went from 2 to 7 percent of deposition and from under 3 to almost 9 percent of etch and clean ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). In ALD they gained no share and held less than 1 percent in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).

CSET's newer analysis of data that TechInsights published in July 2026 puts them at 9.8 percent of deposition in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N36)). They held 10.1 percent of etch and clean that year ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N55)). In dry etch alone their share was 12.4 percent ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N103)). In ALD they held 2.6 percent in 2025, most of it from Piotech ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41)).

The Chinese toolmaker AMEC alone held 12.4 percent of dielectric etch in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N51)). Its revenue was RMB 12.385 billion that year, up 36.6 percent, and it spent RMB 3.744 billion on research, 30.2 percent of sales ([source](https://www.amec-inc.com/news/708.html)).

The United States tightened its export controls at least five times between 2022 and 2025.

- **October 2022.** The 7 October interim final rule required a license for certain chipmaking equipment, and for some activities by US persons that support the making of certain chips in China ([source](https://www.govinfo.gov/content/pkg/FR-2022-10-13/pdf/2022-21658.pdf)). It also widened foreign-produced item rules for 28 Chinese entities already on the Entity List, the US list of foreign firms that exporters need a license to supply ([source](https://www.govinfo.gov/content/pkg/FR-2022-10-13/pdf/2022-21658.pdf)).
- **October 2023.** The October rule, effective 17 November, rewrote the equipment entries ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). It added sideways (isotropic) and vertical (anisotropic) dry etch (ECCN 3B001.c.1), spatial ALD (3B001.d.9), low-fluorine tungsten ALD and CVD (3B001.d.10) and carbon hard mask PECVD (3B001.d.5) ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **December 2024.** BIS controlled 24 more types of equipment and three types of software, and added 140 entities to the Entity List ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)). The new equipment entries include TSV etch, and deposition into features with aspect ratios above 200:1 ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). BIS also wrote a foreign direct product rule that reaches some tools built outside the United States ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)). The rule largely exempts foreign-made tools exported by firms located in Japan, the Netherlands and the 31 other countries it lists, whose governments can control these tools themselves ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). Japan added advanced chipmaking equipment to its control list on 23 July 2023 ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **September 2025.** BIS removed the Chinese units of Samsung and SK hynix, and Intel Semiconductor (Dalian), from the Validated End-User program, effective 31 December 2025 ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-02/html/2025-16735.htm)). From that date, US tools bound for them need a license ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-02/html/2025-16735.htm)). BIS estimated that the change would add 1,000 license applications a year ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-02/html/2025-16735.htm)).
- **September 2025.** The Affiliates Rule extended Entity List restrictions to any company at least 50 percent owned by a listed entity ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf)). BIS then suspended it until 9 November 2026 ([source](https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf)).

The rules apply to the toolmakers as well as to their customers. Applied Materials took a $253 million charge to settle an export controls compliance matter with BIS ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).

Of the tools in the chart below, China-based suppliers have their largest share in dry stripping, which clears leftover photoresist off the wafer and was a $314.6 million market in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N53)). Kokusai held 35.7 percent of it, Mattson Technology 22.6 percent and Naura 8.3 percent ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N53)). Mattson is a US-based firm that Beijing E-Town bought in 2016 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).

{{figure:china-tool-share}}

## The chokepoint

Deposition and etch tools are a chokepoint, but a weaker one than lithography. Most deposition and etch steps have three or four credible vendors. Atomic layer deposition has at least five ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41)). The December 2024 rule targets advanced atomic layer deposition tools and the extremely deep, narrow holes that HBM and 3D memory need ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).

## Takeaways

American companies held 60.3 percent of the world market for deposition tools in 2025, Japanese companies 14.0 percent and China-based companies 9.8 percent ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N36)). In etch and cleaning tools that year, American companies held 52.6 percent, Japanese companies 32.6 percent and China-based companies 10.1 percent ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N55)).

Atomic layer deposition tools coat a hole's walls and floor as evenly as its rim ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). China-based companies held only 2.6 percent of the world market for them in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41)). The December 2024 US export rule targets advanced atomic layer deposition tools and the extremely deep, narrow holes that high-bandwidth memory and 3D memory need ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
