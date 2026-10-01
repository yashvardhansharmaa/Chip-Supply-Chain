---json
{
 "id": "deposition-and-etch",
 "number": 6,
 "title": "Deposition and Etch",
 "oneLiner": "Lithography prints the pattern; deposition and etch lay down and carve away the layers, and they are among the tools where Chinese makers gained the most share between 2019 and 2024.",
 "plain": "Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. Making a chip often takes more than a thousand steps. Some of the holes the etch cuts are hundreds of times deeper than they are wide, the shape of a finger-wide shaft dropping through several floors, and the film has to coat them right to the bottom. The etch has to eat one material and leave the one beside it untouched. Four firms in America, Japan and the Netherlands make most of these machines, and Chinese makers have gained share in both kinds of tool since 2019.",
 "bridge": "A printed pattern is not yet a circuit, and the machines that turn it into one run many times on every wafer.",
 "specimen": "process-chamber",
 "specimenCaption": "A plasma etch chamber cut in half. The vessel is 500 mm across inside and holds one 300 mm wafer on the chuck at the bottom. The violet haze above the wafer is the plasma. The gap it fills is drawn about twice its true 30 to 40 mm; the rest is to scale.",
 "card": {
 "concentration": "High",
 "chokepointScore": 4,
 "leaders": [
 {"name": "Applied Materials", "country": "US", "share": "$28.4B revenue, fiscal 2025; leader in physical and chemical vapor deposition and in epitaxy"},
 {"name": "Lam Research", "country": "US", "share": "$23.2B revenue, fiscal 2026; leader in dry etch and in metal atomic layer deposition"},
 {"name": "Tokyo Electron", "country": "JP", "share": "23% of dry etch and 38% of tube and low-pressure CVD, 2025"},
 {"name": "ASM International", "country": "NL", "share": "€3.2B revenue, 2025; leader in atomic layer deposition"},
 {"name": "Naura", "country": "CN", "share": "5th largest equipment vendor worldwide, 2025 estimate"}
 ],
 "countries": [
 {"code": "US", "note": "Applied Materials (Santa Clara), Lam Research (Fremont)"},
 {"code": "JP", "note": "Tokyo Electron, Kokusai Electric, Hitachi High-Tech"},
 {"code": "NL", "note": "ASM International, Almere; ALD and epitaxy"},
 {"code": "KR", "note": "Large buyer; Semes and local suppliers in wet processing"},
 {"code": "CN", "note": "Naura, AMEC, Piotech; largest equipment market at $49.3B in 2025"}
 ],
 "chinaStatus": "Deposition and etch are among the tools where Chinese makers gained the most share between 2019 and 2024. Chinese suppliers held almost 11 percent of dry etch and 7 percent of deposition in 2024, but under 1 percent of atomic layer deposition.",
 "usStatus": "Two of the three largest deposition and etch tool makers are American. The US government lists some dry etch, atomic layer deposition and deep-hole deposition tools as controlled exports, and one rule also covers tools built outside the United States with American technology.",
 "costSignal": "Tool makers publish no list prices. World sales of chipmaking equipment were $135.1B in 2025, with wafer processing tools up 12%.",
 "substitutability": {"band": "Moderate", "test": "Most deposition and etch steps have three or four established tool makers; in atomic layer deposition, Chinese makers held less than 1 percent in 2024.", "why": "For most of the deposition and etch steps inside a fab, the tool can already be bought from three or four makers: Applied Materials, Lam, Tokyo Electron and ASM International. Switching from one maker to another means testing the new tool on the fab's own line until it matches. Atomic layer deposition, the most advanced kind of deposition, lays down a film a fraction of a layer of atoms at a time. Chinese tool makers gained share in etch between 2019 and 2024 but gained none in atomic layer deposition, where they held less than 1 percent in 2024."}
 },
 "keyFacts": [
 {"fact": "Producing one chip often takes more than 1,000 steps and 70 or more border crossings (CSET, 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
 {"fact": "Global sales of chipmaking equipment reached $135.1B in 2025, up 15% from $117.1B in 2024, with wafer processing equipment up 12% (SEMI)", "source": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"},
 {"fact": "China bought $49.3B of semiconductor equipment in 2025, still the largest single market but down 0.5%, while Taiwan rose 90% to a record $31.5B (SEMI)", "source": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"},
 {"fact": "Tokyo Electron held 23% of dry etch, 38% of tube and low-pressure CVD and 15% of ALD worldwide in CY2025, against 91% of coater/developer, on the share chart in its own FY2026 results presentation", "source": "https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf"},
 {"fact": "China-based suppliers reached 7% of deposition and almost 9% of etch and clean in 2024, from 2% and under 3% in 2019, and almost 11% of dry etch", "source": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"},
 {"fact": "AMEC 2025 revenue was RMB 12.385 billion, up 36.6%, with R&D at RMB 3.744 billion or 30.2% of sales and thin-film tool revenue up 224%", "source": "https://www.amec-inc.com/news/708.html"},
 {"fact": "BIS controls TSV etch tools at aspect ratios of 10:1 or greater with etch rates above 7 microns per minute (ECCN 3B001.c.4)", "source": "https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf"},
 {"fact": "Lam Research fiscal 2026 revenue was $23.23 billion, up 26% from $18.44 billion", "source": "https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm"}
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
 "title": "China-based suppliers' share of global tool segments, 2024",
 "unit": "%",
 "data": [["Dry stripping", 35], ["Dry etch", 11], ["PVD", 10], ["Etch and clean", 9], ["Deposition", 7], ["CVD", 7], ["Lithography (i-line)", 4]],
 "source": {"label": "CSET, Inside Beijing’s Chipmaking Offensive", "url": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"}
 }
 ]
}
---
# Deposition and Etch

Applied Materials and Lam Research, the two largest deposition and etch suppliers, booked $28.4 billion and $23.2 billion of revenue in their latest fiscal years ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000006951/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)) ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).

## How it works

Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. Making a chip often takes more than a thousand steps. Some of the holes the etch cuts are hundreds of times deeper than they are wide, the shape of a finger-wide shaft dropping through several floors, and the film has to coat them right to the bottom. The etch has to eat one material and leave the one beside it untouched. Four firms in America, Japan and the Netherlands make most of these machines, and Chinese makers have gained share in both kinds of tool since 2019.

{{figure:dep-etch-cycle}}

Both steps happen in a vacuum chamber that holds one wafer at a time. A pump empties the chamber of air, a measured flow of gas comes in, and an electric field that reverses millions of times a second, a radio-frequency field, strips electrons off the gas molecules. The gas is now a plasma, charged fragments that react far more readily than whole molecules do.

For deposition the gas carries the material wanted. The fragments land on the wafer and stick, and the film builds from the bottom up, a few atoms at a time. To coat the floor of a deep hole as thickly as its rim, the machine can work in cycles: let one gas settle in a single layer on every surface, pump it out, admit a second gas that reacts with that layer and nothing else, pump again. Each cycle adds a fraction of a layer of atoms wherever the gas reached, so the film builds up as evenly on the walls and floor of a hole as on its rim ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).

For etch the gas attacks one material and leaves the one beside it. Wherever the photoresist pattern covers the wafer, nothing happens. Wherever it does not, the fragments react with the surface and turn it into a gas, which the pump carries away. A second field pulls the charged fragments straight down at the wafer, so the etch cuts vertically and a narrow hole keeps its width as it deepens. When the etch reaches the material underneath, which the gas was chosen not to touch, it slows almost to a stop, and the tool ends the step.

Change the gas, the pressure, the power and the temperature, and the same hardware either adds material or takes it away, which is why the export controls on these tools are written as process specifications.

CSET says a single chip often takes more than 1,000 steps, with the part-finished product crossing international borders 70 or more times ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

## Variants and trade-offs

### Deposition families

The market sizes and leading shares below are CSET's for 2025, which it builds from TechInsights data, on a $26.2 billion deposition tool market ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N36)) and a $21.9 billion dry etch market ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N103)).

- **Physical vapor deposition** knocks atoms off a solid target and lands them on the wafer, $4.9 billion in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N42)).
- **Chemical vapor deposition** reacts gases at the wafer surface to grow a film; the plasma-enhanced version runs cooler and is most of the $11.2 billion CVD market, $7.5 billion in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N47)) ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N38)).
- **Atomic layer deposition** lays down less than one atomic layer at a time, so it coats vertical walls as evenly as horizontal floors. US regulators call it a 3D scaling enabler in 3D DRAM, 3D NAND, and FinFET and gate-all-around logic ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)); ASM International leads it with 54.5 percent of a $4.1 billion market in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41)).
- **Epitaxy** grows layers that line up with the crystal beneath them, using high-temperature CVD tools ([source](https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N40)). **Electroplating** deposits the copper used for wiring across the wafer ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

### Etch families

- **Conductor etch** cuts gates, metals and silicon, $12.2 billion in 2025, led by Lam at 51.2 percent ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N50)).
- **Dielectric etch** cuts the insulating oxides and nitrides between them, $8.7 billion in 2025, led by Tokyo Electron at 55.9 percent ([source](https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N51)).
- **High-aspect-ratio etch** cuts the deep, narrow channels that let 3D NAND stack layers of memory cells, and Lam says slight deviations from the target profile can hurt yield ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)). Lam runs the etch well below 0 degrees Celsius and says Cryo 3.0 holds critical-dimension deviation under 0.1 percent down channels up to 10 microns deep ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)).

AI hardware asks for sideways cuts, deeper holes and a second metal stack on the wafer's back.

- **Gate-all-around** needs highly selective isotropic etch, which cuts sideways, and BIS controls isotropic dry etch tools with a silicon-germanium-to-silicon selectivity of 100:1 or more ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **HBM** needs holes etched straight through the silicon so chips can be stacked and wired, which BIS controls at 10:1 or deeper above 7 microns a minute ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Backside power delivery** moves power routing to the back of the wafer ([source](https://download.intel.com/newsroom/archive/2025/en-us-2023-06-05-powervia-test-shows-industryleading-performance.pdf)). Applied Materials expects it to add another $1 billion per 100,000 wafer starts a month to the wiring market it serves ([source](https://www.globenewswire.com/news-release/2024/07/08/2909540/0/en/applied-materials-unveils-chip-wiring-innovations-for-more-energy-efficient-computing.html)).

{{figure:tel-tool-share}}

## Who makes it

SEMI put global equipment billings at $135.1 billion in 2025, up 15 percent from $117.1 billion, with wafer processing equipment up 12 percent ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)).

Within deposition and etch no one firm dominates as ASML does in lithography. The share chart in Tokyo Electron's own results presentation puts it at 23 percent of dry etch, 27 percent of deposition systems (furnace, ALD and low-pressure CVD tools) and 15 percent of ALD in 2025, against 91 percent of coater/developer ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).

ASM International, the atomic layer deposition specialist, reached a record EUR 3.2 billion of revenue in 2025 as customers built 2 nm gate-all-around capacity, with molybdenum ALD entering volume production ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

{{figure:equipment-billings}}

## China and the controls

China is the tool vendors' largest market, and Chinese toolmakers have gained share since 2019 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). It bought $49.3 billion of equipment in 2025, still the biggest single market, though its spending fell half a percent while Taiwan's rose 90 percent to $31.5 billion ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)). China still takes a large share of every major vendor's sales.

- **Tokyo Electron**: 34.1 percent of sales in the year to March 2026, down from 41.7 percent ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).
- **Lam Research**: 26 percent in the June 2026 quarter, behind Taiwan at 27 percent ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).
- **Applied Materials**: 28 percent in the third fiscal quarter of 2026, down from 35 percent ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).
- **ASM International**: more than 30 percent of 2025 revenue ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

Between 2019 and 2024 China-based suppliers went from 2 to 7 percent of deposition and from under 3 to almost 9 percent of etch and clean, 11 percent in dry etch alone ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). In ALD they gained no share and held less than 1 percent in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). AMEC turned over RMB 12.385 billion in 2025, up 36.6 percent, and spent RMB 3.744 billion on research, 30.2 percent of sales ([source](https://www.amec-inc.com/news/708.html)).

Washington tightened these rules at least four times between 2022 and 2025.

- **October 2022.** The 7 October interim final rule put certain chipmaking equipment and some US person support under license and widened foreign-produced item rules for 28 listed Chinese entities ([source](https://www.govinfo.gov/content/pkg/FR-2022-10-13/pdf/2022-21658.pdf)).
- **October 2023.** The rule effective 17 November rewrote the equipment entries, adding isotropic and anisotropic dry etch (ECCN 3B001.c.1), spatial ALD (3B001.d.9), low-fluorine tungsten ALD and CVD (3B001.d.10) and carbon hard mask PECVD (3B001.d.5) ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **December 2024.** BIS controlled 24 more types of equipment and three types of software, added 140 entities and wrote a foreign direct product rule that reaches tools built outside the United States ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)). The new entries take in TSV etch and deposition into features with aspect ratios above 200:1 ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **September 2025.** The Affiliates Rule extended Entity List restrictions to any company at least 50 percent owned by a listed entity ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf)); BIS then stayed it to 9 November 2026 ([source](https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf)).

Applied Materials took a $253 million charge to settle an export controls compliance matter with BIS, so the rules reach the vendors as well as their customers ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).

{{figure:china-tool-share}}

## The chokepoint

The chokepoint is real but weaker than lithography's. Three or four credible vendors exist for most of the deposition and etch steps inside a fab. The exceptions are ALD, where Chinese makers held less than 1 percent in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)), and the extremely deep, narrow holes that HBM and 3D memory need. The December 2024 rule targets those ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).

## Key evaluation criteria

- **Selectivity.** How hard the process attacks one material and spares another. BIS controls wet processing at a silicon-germanium-to-silicon ratio of 100:1 ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **Conformality and aspect ratio.** Whether a film reaches the bottom of a hole, and how deep that hole is against its width. Controls start at 10:1 for TSV etch and 200:1 for 3D DRAM deposition ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Uniformity.** Variation across a 300 mm wafer, with the TSV etch control set at within-wafer etch depth nonuniformity of 2 percent or less ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Throughput.** Wafers per hour, which sets cost per layer and decides how many lots a fab can run.
- **Particles and chamber matching.** How large a share of the defects a fab can tolerate comes from these tools, and whether one chamber behaves like the next, which metrology and inspection measure (see [Metrology and inspection](#metrology-and-inspection)).

## Takeaways

Deposition tools lay thin films on a wafer and etch tools carve patterns into them, and American and Japanese companies lead in making both ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Chinese toolmakers have gained ground in these tools, reaching almost 9 percent of the world market for etch and cleaning tools in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). They gained no share in atomic layer deposition, the most advanced deposition tool, and held less than 1 percent of that market in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). US export rules call this tool a critical enabler of today's most advanced chips ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
