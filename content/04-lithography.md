---json
{
 "id": "lithography",
 "number": 4,
 "title": "Lithography",
 "oneLiner": "ASML, a Dutch firm, is the only maker of extreme ultraviolet scanners, the machines that print the finest layers of a chip. It sold 48 of them in 2025.",
 "plain": "Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a light source and projects the image, four times smaller, onto the silicon. The shorter the wavelength of the light, the finer the lines a machine can print. Even so, a machine can print lines narrower than its light's wavelength. Immersion scanners, for example, shine the light through a layer of water between lens and wafer, which lets them print smaller features with the same light ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)). ASML rates its NXT:2150i immersion scanner at features of 38 nanometers or less with 193-nanometer argon fluoride laser light ([source](https://www.asml.com/en/products/duv-lithography-systems/twinscan-nxt-2150i)). Air soaks up extreme ultraviolet light, the shortest in use, so machines that print with it work in a vacuum. Only ASML, a Dutch company, makes them. Export controls are government rules on who a company may sell to. Every advanced chip passes through ASML's machines, so export controls on ASML affect all advanced chipmaking.",
 "bridge": "Coated and still blank, the wafer goes to the machine that sets how small the circuit can be.",
 "specimen": "euv-scanner",
 "specimenCaption": "An extreme ultraviolet scanner cut open along its light path. The machine is the size of a bus and weighs about 180 metric tons. The blue-violet thread is the 13.5 nm light, bouncing mirror to mirror from the violet-white tin plasma at bottom left to the wafer. The mask at the top and the wafer at bottom right are drawn about twice their true size.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "ASML", "country": "NL", "share": "100% of EUV (extreme ultraviolet) systems sold in 2025", "source": "https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=16"},
 {"name": "Nikon", "country": "JP", "share": "22 new chip lithography systems in the year to March 2026", "source": "https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf#page=8"},
 {"name": "Canon", "country": "JP", "share": "234 chip lithography systems in 2025, 188 of them i-line and 46 KrF", "source": "https://global.canon/en/ir/conference/pdf/conf2025e.pdf#page=22"}
 ],
 "countries": [
 {"code": "NL", "note": "ASML, the Dutch maker of every EUV scanner"},
 {"code": "DE", "note": "Zeiss SMT optics, Oberkochen, and Trumpf carbon dioxide drive lasers, Ditzingen"},
 {"code": "US", "note": "ASML light-source research and manufacturing, San Diego"},
 {"code": "JP", "note": "Nikon and Canon lithography scanners and steppers"}
 ],
 "chinaStatus": "In September 2025 CSIS judged that EUV remained firmly out of reach for China despite massive state investment. SMEE, a Chinese scanner maker, had its largest share in i-line tools, the coarsest kind, and even there held 4 percent of the world market as of 2025.",
 "chinaSources": ["https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography", "https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography"],
 "usStatus": "No American firm makes scanners, CSET found in 2021. But a US rule published in October 2023 covers immersion scanners with an alignment error between 1.5 nm and 2.4 nm bound for advanced chipmaking if they hold any American-made parts. The US entity list also requires a license to supply the firms it names.",
 "usSources": ["https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf#page=4", "https://www.federalregister.gov/documents/2023/10/25/2023-23049/export-controls-on-semiconductor-manufacturing-items", "https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities"],
 "costSignal": "About $200M for a standard EUV scanner, an estimated $350-400M for the newer High-NA version and roughly $60M for a tool in the DUV segment, according to Reuters in July 2026",
 "costSources": ["https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/"],
 "substitutability": {"band": "Very hard", "test": "ASML is the only maker of EUV scanners, and Zeiss is its sole supplier of their mirrors.", "testSources": ["https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm"], "why": "A newcomer would first have to make mirrors a meter wide, polished smooth to within tens of picometers, a picometer being a trillionth of a meter. It would also need a light source that hits tin droplets with a laser 50,000 times a second.", "whySources": ["https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors", "https://www.asml.com/en/technology/lithography-principles/light-and-lasers"]}
 },
 "keyFacts": [
 {"fact": "ASML sold 48 EUV systems in 2025, versus 44 in 2024", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
 {"fact": "ASML's total net sales were EUR 32.7 billion in 2025 at a 52.8% gross margin", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
 {"fact": "In October 2026 ASML expected 2026 net sales of EUR 44 to 45 billion at a gross margin of around 56%", "source": "https://www.sec.gov/Archives/edgar/data/937966/000162828026065813/pressreleasefinancialresul.htm"},
 {"fact": "In July 2026 ASML put its 2026 capacity at around 65 standard (low-NA) EUV systems and said it plans to add 30% for 2027", "source": "https://ourbrand.asml.com/asset/c8dbf3fc-4c5e-4406-83f6-27694b138245/Press-Release-Financial-Results-Q2-2026.pdf"},
 {"fact": "EUV was 48% of ASML's net system sales in 2025. China was 33% of net system sales, down from 41% in 2024", "source": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"},
 {"fact": "The TWINSCAN NXE:3800E reaches its full 220 wafers-per-hour specification, a 37% improvement on the NXE:3600D", "source": "https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf"},
 {"fact": "An EUV source hits each molten tin droplet with a low-intensity laser pulse and then a more powerful one that vaporizes it, a process repeated 50,000 times a second", "source": "https://www.asml.com/en/technology/lithography-principles/light-and-lasers"},
 {"fact": "ASML demonstrated the first 1,000-watt EUV light source in April 2025, and customers had run more than 400,000 wafers on High NA systems by the end of that year", "source": "https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf"},
 {"fact": "ASML sold four EXE (High NA) and 44 NXE systems in 2025, against two EXE and 42 NXE in 2024", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
 {"fact": "ASML lists 5,100 suppliers in its 2025 annual report", "source": "https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm"},
 {"fact": "Reuters puts tools in the DUV segment at roughly $60 million each, a standard EUV tool at around $200 million and a High-NA system at an estimated $350 million to $400 million. It puts ASML's share of DUV above 80%", "source": "https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/"}
 ],
 "figures": [
    {"id": "litho-print", "type": "animation", "src": "litho", "title": "How lithography prints a chip", "note": "Simplified. The newest machines, which use extreme ultraviolet light, carry the image with mirrors in place of a lens."},
 {
 "id": "euv-shipments",
 "type": "bars",
 "title": "EUV systems ASML sold each year",
 "finding": "ASML sold 48 EUV systems in 2025, up from 44 in 2024",
 "unit": "tools",
 "data": [["2023", 53], ["2024", 44], ["2025", 48]],
 "source": {"label": "ASML 2025 annual report (2024 and 2025); 2023 from ASML's Q4 2023 investor presentation", "url": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf#page=5"}
 },
 {
 "id": "tool-price",
 "type": "bars",
 "title": "What one lithography system costs. The DUV bar is one figure for the whole segment, and the High-NA bar shows the low end of an estimated $350-400M range",
 "finding": "High-NA EUV scanners cost an estimated $350 million to $400 million in 2026",
 "unit": "$M",
 "data": [["DUV tool", 60], ["EUV, 0.33 NA", 200], ["High-NA EUV", 350]],
 "source": {"label": "Reuters explainer on ASML's lithography machines, first published 28 January 2026 and updated 28 July 2026", "url": "https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/"}
 },
 {
 "id": "litho-mix",
 "type": "stack",
 "title": "ASML net system sales by technology, 2025",
 "finding": "EUV made up 48 percent of ASML's 2025 system sales",
 "unit": "%",
 "data": [["EUV", 48], ["ArF immersion", 42], ["KrF", 4], ["Metrology and inspection", 3], ["ArF dry", 2], ["i-line", 1]],
 "source": {"label": "ASML Q4 2025 investor presentation", "url": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf#page=9"}
 },
 {
 "id": "asml-region",
 "type": "stack",
 "title": "ASML net system sales by the region tools shipped to, 2025",
 "finding": "China took 33 percent of ASML's 2025 system sales, the largest share",
 "unit": "%",
 "data": [["China", 33], ["South Korea", 25], ["Taiwan", 22], ["United States", 12], ["Japan", 5], ["Rest of Asia", 2], ["EMEA", 1]],
 "source": {"label": "ASML Q4 2025 investor presentation", "url": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf#page=9"}
 }
 ]
}
---
# Lithography

ASML sold 327 lithography systems in 2025, 48 of them extreme ultraviolet (EUV) ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf#page=5)). Nobody else makes EUV systems ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=16)).

## How it works

Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a light source and projects the image, four times smaller, onto the silicon. The shorter the wavelength of the light, the finer the lines a machine can print. Even so, a machine can print lines narrower than its light's wavelength. Immersion scanners, for example, shine the light through a layer of water between lens and wafer, which lets them print smaller features with the same light ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)). ASML rates its NXT:2150i immersion scanner at features of 38 nanometers or less with 193-nanometer argon fluoride laser light ([source](https://www.asml.com/en/products/duv-lithography-systems/twinscan-nxt-2150i)). Air soaks up extreme ultraviolet light, the shortest in use, so machines that print with it work in a vacuum. Only ASML, a Dutch company, makes them. Export controls are government rules on who a company may sell to. Every advanced chip passes through ASML's machines, so export controls on ASML affect all advanced chipmaking.

The stencil is called a photomask, and the machine a scanner (see [Photomasks and pellicles](#photomasks-and-pellicles)).

The wafer is coated with photoresist, a film that changes wherever light touches it. The mask holds one layer of the circuit as a pattern of clear and dark areas, drawn at four times its size on the chip. The machine shines light through the mask, shrinks the image four times with a lens, and lands it on the film.

A wash then removes the film where the light hit, or, with some films, where it did not, leaving the pattern standing on the wafer ([source](https://www.asml.com/en/news/stories/2021/semiconductor-manufacturing-process-steps)). The film then serves as a stencil for the next step, which either etches the pattern into the layer beneath or fires ions into the open areas to change how the silicon conducts ([source](https://www.asml.com/en/news/stories/2021/semiconductor-manufacturing-process-steps)). Then the film is stripped and the next mask goes in. Chips are made up of dozens of layers, ASML says ([source](https://www.asml.com/en/news/stories/2021/semiconductor-manufacturing-process-steps)). Photronics, a US mask maker, says masks are typically sold in sets, with each layer's pattern on a different mask ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)).

{{figure:litho-print}}

The image from one mask covers a patch of up to 26 by 33 mm ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400b)). The wafer moves under the optics one patch at a time, close to a hundred patches per wafer. ASML's own wafers-per-hour rating for an EUV scanner assumes 96 of them ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400b)). Before the wafer is exposed, the machine measures alignment marks printed in earlier layers so the new layer lines up with them ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400b)). For its NXE:3400B EUV scanner, ASML rates the matched-machine overlay, a measure of that alignment, at 2 nm ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400b)). That model first shipped in 2017 ([source](https://www.sec.gov/Archives/edgar/data/937966/000093796617000010/pressreleasequarterlyresul.htm)).

Finer lines need shorter light. Glass and air both absorb the shortest light in use, at 13.5 nm ([source](https://www.asml.com/en/products/euv-lithography-systems)). So an EUV scanner works in a vacuum and uses mirrors instead of lenses, and its masks are mirrors too ([source](https://www.asml.com/en/products/euv-lithography-systems)). Deep ultraviolet (DUV) machines use light with a wavelength more than fourteen times longer ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)). ASML calls its immersion DUV scanners the workhorses of the industry, used in high-volume manufacturing of the most advanced logic and memory chips ([source](https://www.asml.com/en/products/duv-lithography-systems)).

When one exposure cannot draw a pattern finely enough, chipmakers use multipatterning. In the litho-etch kind, the pattern is split between two or more masks printed in turn ([source](https://www.imec-int.com/en/imec-magazine/imec-magazine-june-2019/euv-lithography-weighing-the-options-for-future-logic-and-memory-applications)). Each added mask brings more process steps, more cost and a risk that the parts of the pattern misalign ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-innovative-pattern-shaping-technology-reduces)). Self-aligned double and quadruple patterning (SADP and SAQP) print the lines with one exposure and then multiply them with deposition and etch steps ([source](https://www.imec-int.com/en/imec-magazine/imec-magazine-june-2019/euv-lithography-weighing-the-options-for-future-logic-and-memory-applications)). In SAQP each printed line ends up as four ([source](https://www.imec-int.com/en/imec-magazine/imec-magazine-june-2019/euv-lithography-weighing-the-options-for-future-logic-and-memory-applications)). Because one exposure places all those lines, they cannot misalign with each other ([source](https://www.imec-int.com/en/imec-magazine/imec-magazine-june-2019/euv-lithography-weighing-the-options-for-future-logic-and-memory-applications)). A later exposure still prints blocks that break them where the circuit needs gaps ([source](https://www.imec-int.com/en/imec-magazine/imec-magazine-june-2019/euv-lithography-weighing-the-options-for-future-logic-and-memory-applications)). ASML says one EUV exposure per layer cuts masks and process steps and lowers cost ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=16)).

## Variants and trade-offs

### Deep ultraviolet

Deep ultraviolet (DUV) light comes from gas lasers called excimer lasers: 248 nanometers from krypton fluoride (KrF), 193 from argon fluoride (ArF), shone through air or water ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)). Cymer, an independently run ASML business in San Diego, makes these excimer lasers, which generate the light that scanners use to print patterns on wafers ([source](https://www.asml.com/en/company/about-asml/locations/san-diego)). Gigaphoton, a Komatsu company in Japan, also makes excimer lasers for lithography tools ([source](https://www.gigaphoton.com/company)).

Of the systems ASML sold in 2025, 131 were ArF immersion, 78 KrF and 16 ArF dry, all deep ultraviolet, and another 54 were older i-line tools ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf#page=9)). The i-line tools use 365 nm light from a mercury lamp, and ASML says they print features as small as 220 nm ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)).

Reuters gives one price for the whole DUV segment, with tools costing roughly $60 million each ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)). ASML's own figures split its DUV sales by tool type. In 2025 the 131 ArF immersion tools it sold made up 42 percent of its system sales, and the 78 KrF tools only 4 percent ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf#page=9)). In DUV, ASML competes with Nikon and Canon, and it still holds above 80 percent of that market ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)).

Chipmakers without EUV build their finest layers on immersion DUV scanners, in several passes per layer ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=16)). From 1 September 2023, Dutch export licensing covered the most advanced of these scanners, ASML's NXT:2000i and later models ([source](https://www.asml.com/en/news/press-releases/2023/statement-regarding-export-control-regulations-dutch-government)).

### Extreme ultraviolet

The 13.5 nm light comes from molten tin droplets shot from a generator ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)). A laser hits each droplet twice, first with a low-intensity pulse that flattens it and then with a more powerful one that vaporizes it into plasma ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)). The process repeats 50,000 times a second ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)). Mirrors made by Zeiss, a German optics company, carry the light to the wafer ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)). The largest are a meter across and smooth to within tens of picometers, a picometer being a thousandth of a nanometer ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)).

Brighter light means more wafers an hour, and ASML demonstrated the first 1,000-watt EUV source in April 2025 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=30)). Its TWINSCAN NXE:3800E ships at its full 220 wafers an hour, 37 percent more than the NXE:3600D ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=17)).

### High-NA EUV

High-NA scanners raise the numerical aperture (NA), a measure of how well the optics collect and focus light, from 0.33 to 0.55 ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). That cuts the smallest printable feature from 13 nm to 8 nm ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). Their optics shrink the mask image four times in one direction and eight in the other, halving the patch of wafer one exposure covers and doubling the exposures per wafer ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). The second-generation TWINSCAN EXE:5200B runs at 175 wafers an hour, 60 percent above the EXE:5000 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=16)).

Reuters puts a standard EUV tool at around $200 million and a High-NA machine at an estimated $350 to $400 million ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)).

{{figure:tool-price}}

ASML sold four High-NA (EXE) systems in 2025, against two in 2024 ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf#page=7)). In its 2025 annual report, filed in February 2026, ASML said it expected High-NA to start supporting high-volume manufacturing in 2027 ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)).

Intel and TSMC have chosen differently on High-NA:

- **Intel Foundry** says it uses High-NA in volume production for select layers of some Intel 18A products ([source](https://www.intel.com/content/www/us/en/newsroom/news/intel-foundry/intel-foundry-asml-accelerate-industry-readiness-for-high-na-euv.html)). It installed the first EXE:5200B ([source](https://www.asml.com/en/news/press-releases/2026/high-na-euv-reaches-new-readiness-milestone)). By September 2026 it had run more than one million wafers on High-NA tools, a count that includes tool testing and research as well as volume production ([source](https://www.intel.com/content/www/us/en/newsroom/news/intel-foundry/intel-foundry-asml-accelerate-industry-readiness-for-high-na-euv.html)).
- **TSMC** waited, and in September 2026 said it will use High-NA in high-volume manufacturing from 2030 ([source](https://pr.tsmc.com/english/news/3338)).

On 8 September 2026 ASML and TSMC announced a move from 6-inch photomasks to 12-inch ones, to remove stitching constraints ([source](https://pr.tsmc.com/english/news/3338)). Stitching constraints are the design limits that come from printing a large chip in two halves. ASML and TSMC aim for a pilot line for the new masks by 2031 and for High-NA systems that use them to enter production by 2033 ([source](https://pr.tsmc.com/english/news/3338)).

{{figure:euv-shipments}}

## Who makes it

ASML's net sales were EUR 32.7 billion in 2025, at a 52.8 percent gross margin ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf#page=5)). In October 2026 it expected 2026 net sales of EUR 44 to 45 billion, at a gross margin of around 56 percent ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026065813/pressreleasefinancialresul.htm)). Its 2025 annual report lists 5,100 suppliers ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)). Three of them and ASML's own San Diego site make the main parts of the EUV machine:

- **Zeiss SMT**, Oberkochen, Germany, makes the illumination system and the six-mirror projection optics ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html)).
- **Trumpf**, Ditzingen, Germany, makes the carbon dioxide drive laser that hits the tin droplets ([source](https://www.trumpf.com/en_US/products/lasers/euv-drive-laser/)). It amplifies a few watts to 40 kilowatts ([source](https://www.trumpf.com/en_US/products/lasers/euv-drive-laser/)).
- **ASML San Diego**, which includes the light-source maker Cymer that ASML bought in 2013, designs the source where the laser turns tin into plasma, and builds the droplet generator ([source](https://www.asml.com/en/company/about-asml/locations/san-diego)).
- **VDL ETG** builds the frames that suspend and position the mirrors ([source](https://web.archive.org/web/20240726075938/https://www.vdlgroep.com/en/news/vdl-etg-builds-complex-frames-for-zeiss)).

ASML says the production capacity of Zeiss, its sole supplier of optics, limits how many lithography systems it can build ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)).

In Japan, Nikon and Canon also make lithography tools. Nikon sold 22 new chip lithography systems in the year to March 2026, in a market it sizes at 570 units for 2025 ([source](https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf#page=8)). Its Precision Equipment business made an operating loss in the year to March 2026 ([source](https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf#page=6)). Canon sold 234 chip lithography systems in 2025, 188 of them i-line and 46 KrF ([source](https://global.canon/en/ir/conference/pdf/conf2025e.pdf#page=22)). Its range runs from KrF scanners to i-line steppers, including some built for advanced packaging ([source](https://global.canon/en/product/indtech/semicon/)). Canon also makes a nanoimprint system, the FPA-1200NZ2C, which stamps the pattern instead of projecting it and can print lines down to 14 nm wide ([source](https://global.canon/en/news/2024/20240926.html)). Canon delivered one in 2024 to the Texas Institute for Electronics, to be used for research and prototypes ([source](https://global.canon/en/news/2024/20240926.html)).

In January 2021 CSET, a research center at Georgetown University, found that the United States lacked firms in a few key parts of the chip supply chain, above all lithography tools ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf#page=4)).

{{figure:litho-mix}}

## Controls and China's answer

Export controls set up by the United States with allies including the Netherlands block ASML from shipping EUV scanners to Chinese foundries ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). In September 2025 CSIS judged that EUV remained "firmly out of reach" for China despite massive state investment ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). For DUV scanners and other tools, the restrictions came in this order:

- **Dutch national licensing** of advanced DUV took effect on 1 September 2023 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)).
- **A US rule** published on 25 October 2023 covered immersion scanners that print features of 45 nm or smaller with an alignment error between 1.5 nm and 2.4 nm ([source](https://www.federalregister.gov/documents/2023/10/25/2023-23049/export-controls-on-semiconductor-manufacturing-items)). If such a scanner was bound for advanced chipmaking, the rule put it under US export rules when it held any American content at all ([source](https://www.federalregister.gov/documents/2023/10/25/2023-23049/export-controls-on-semiconductor-manufacturing-items)). The rule did not apply to scanners first exported from a country that lists them on its own export control list ([source](https://www.federalregister.gov/documents/2023/10/25/2023-23049/export-controls-on-semiconductor-manufacturing-items)).
- **A partial license revocation** by the Dutch government, disclosed by ASML on 1 January 2024, stopped shipments of NXT:2050i and NXT:2100i immersion scanners to a few Chinese customers ([source](https://www.asml.com/en/news/press-releases/2023/statement-regarding-partial-revocation-export-license)).
- **The Netherlands widened its licensing** to more types of deep ultraviolet lithography equipment from 7 September 2024 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)). On 15 January 2025 it announced that from 1 April 2025 the license requirement would also cover a very limited number of further goods, among them specific measuring and inspection equipment ([source](https://www.government.nl/latest/news/2025/01/15/klever-export-controls-on-advanced-semiconductor-manufacturing-equipment-to-be-tightened)).
- **The BIS Affiliates Rule**, issued by the US Bureau of Industry and Security, extended entity-list controls to affiliates owned 50 percent or more by listed entities from 29 September 2025 ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)). BIS then suspended it until 9 November 2026 ([source](https://www.federalregister.gov/documents/2025/11/12/2025-19846/one-year-suspension-of-expansion-of-end-user-controls-for-affiliates-of-certain-listed-entities)). Exporting goods covered by US export rules to a firm on the entity list needs a US license ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)).
- **The EU** added certain Dutch controls to the EU Control List in November 2025 ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)). ASML says this changed nothing for its immersion tools, because they already needed a Dutch license ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)).

China's share of ASML's net system sales fell from 41 percent in 2024 to 33 percent in 2025 ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf#page=9)).

On DUV, Reuters reported in July 2026, citing one unnamed source, that Shanghai Aishengna Electronic Technology Group has started producing home-grown immersion DUV tools ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). The firm was registered in August 2023 with 7 billion yuan of capital and two state shareholders, Shanghai Electric Holding and a Shanghai International Trust subsidiary ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). It has no website and has taken in teams from SMEE, China's older scanner maker, and the startup Yuliangsheng ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). SMEE is strongest in i-line, the coarsest kind of lithography tool, and even there holds only four percent of the world market ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

There is less evidence of Chinese progress on EUV. Reuters reported in December 2025 that a Shenzhen team of former ASML engineers had built a prototype that made extreme ultraviolet light but had printed no chip ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). To print a chip, a machine also needs mirrors that carry that light to the wafer, and ASML's sole supplier of those mirrors is Zeiss ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)).

{{figure:asml-region}}

## The chokepoint

If ASML stopped shipping, no fab anywhere could add EUV capacity, because no other company makes EUV scanners ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=16)). The scanners already in fabs would keep printing only as long as they were serviced. ASML has around 10,000 customer support employees who maintain and upgrade those machines around the clock ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=40)). Serviced this way, ASML's machines stay in use for a long time. In its 2025 annual report ASML said about 95 percent of the systems it had sold in the previous 30 years were still in use ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)). The same report warned that export controls may limit the service ASML can provide for machines already installed ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=65)).

ASML has a chokepoint of its own. Zeiss SMT is its only supplier of lenses, mirrors and other critical optics ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=68)). ASML says that if Zeiss could not supply them for a long period, ASML would effectively be unable to run its business ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=68)).

ASML's capacity caps how many EUV scanners fabs anywhere can add each year. In July 2026 ASML put its 2026 capacity at around 65 standard (low-NA) EUV scanners and said it plans to add 30 percent for 2027 ([source](https://ourbrand.asml.com/asset/c8dbf3fc-4c5e-4406-83f6-27694b138245/Press-Release-Financial-Results-Q2-2026.pdf)).

Leading-edge AI accelerators are made with EUV, which prints their finest layers, the ones that set how densely transistors and wires pack ([source](https://www.asml.com/en/products/euv-lithography-systems)). TSMC expects the number of layers needing High-NA to rise, driven mainly by the more complex transistors that AI chips need ([source](https://pr.tsmc.com/english/news/3338)).

## Takeaways

ASML is the only company that makes extreme ultraviolet (EUV) scanners ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf#page=16)). It also holds above 80 percent of the market for deep ultraviolet (DUV) lithography, which uses light of longer wavelength than EUV ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)). ASML says the production capacity of Zeiss, its sole supplier of optics, limits how many lithography systems it can build ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)).

Export controls set up by the United States with allies including the Netherlands block EUV scanners from Chinese chip foundries ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). In December 2025 Reuters reported a Chinese prototype that had made EUV light but had printed no chip ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). In July 2026 Reuters reported, citing one unnamed source, that a Shanghai firm with two state shareholders has started producing immersion DUV tools, which shine their light through water ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)).
