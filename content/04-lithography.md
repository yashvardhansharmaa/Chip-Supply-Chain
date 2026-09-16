---json
{
 "id": "lithography",
 "number": 4,
 "title": "Lithography",
 "oneLiner": "The most concentrated stage in the chain. One firm in the Netherlands builds every extreme ultraviolet scanner in the world, the machine that prints the finest circuit layers. It shipped 48 of them in 2025, at around $200 million each.",
 "plain": "Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a lamp and projects the image, four times smaller, onto the silicon. The finer the lines, the shorter the wavelength of light needed to print them. The shortest light now in use will not pass through air, so the machine has to print in a vacuum. Only one company has ever built a machine that prints with it, and it is Dutch. Export controls, the government rules on who a company may sell to, reach advanced chipmaking mainly by reaching that one firm.",
 "bridge": "Coated and still blank, the wafer goes to the machine that decides how small the circuit can be.",
 "specimen": "euv-scanner",
 "specimenCaption": "An extreme ultraviolet scanner cut open along its light path. The machine is the size of a bus, weighs about 180 metric tons and ships in 40 containers. The amber thread is the 13.5 nm light, bouncing mirror to mirror from the tin plasma at bottom left to the wafer; both ends are drawn about twice their true size.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "ASML", "country": "NL", "share": "100% of EUV (extreme ultraviolet) and above 80% of DUV (deep ultraviolet); EUV was 48% of its own 2025 system revenue and immersion DUV 42%"},
 {"name": "Nikon", "country": "JP", "share": "22 new chipmaking scanners in the year to March 2026, in a market Nikon sizes at 570 units"},
 {"name": "Canon", "country": "JP", "share": "i-line and krypton fluoride steppers for older, coarser layers, plus the only commercial nanoimprint tool"}
 ],
 "countries": [
 {"code": "NL", "note": "ASML design and final assembly, Veldhoven"},
 {"code": "DE", "note": "Zeiss SMT optics, Oberkochen; Trumpf carbon dioxide lasers that drive the light source, Ditzingen"},
 {"code": "US", "note": "ASML light-source research and manufacturing, San Diego"},
 {"code": "JP", "note": "Nikon and Canon deep ultraviolet scanners and steppers"}
 ],
 "chinaStatus": "No EUV scanner has ever been sold to a customer in China, and CSIS judges the technology firmly out of reach despite state investment. Shanghai Aishengna Electronic Technology Group, a state-owned firm registered in 2023, is reported to have started producing domestic immersion DUV scanners in 2026. SMEE, the older domestic supplier, holds about 4% of the global i-line market, the coarsest tier, and nothing above it.",
 "usStatus": "No domestic scanner maker. Washington controls access through Dutch licensing, US-origin subsystems and entity-list rules.",
 "costSignal": "About $200M for a standard EUV scanner, $350-400M for the newer High-NA version and about $60M for a DUV tool, on Reuters' reporting; ASML does not publish per-system prices",
 "substitutability": {"band": "Very hard", "test": "No second EUV source; only Zeiss can polish the mirrors, and a funded Chinese team has light but no printed chip", "why": "A well-funded state starting today would have to reproduce meter-wide mirrors polished to within tens of picometers and a source that hits tin droplets 50,000 times a second, not merely assemble a scanner. The best-funded attempt so far has made extreme-ultraviolet light and no chip, CSIS reads working systems as out of reach, and no announced program changes this before 2030."}
 },
 "keyFacts": [
 {"fact": "ASML booked 48 EUV systems as revenue in 2025, versus 44 in 2024 and 53 in 2023", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
 {"fact": "ASML total net sales were EUR 32.7 billion in 2025 at a 52.8% gross margin", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
 {"fact": "In July 2026 ASML raised its 2026 guidance to EUR 43 to 45 billion of net sales at a 54 to 56% gross margin", "source": "https://ourbrand.asml.com/asset/c8dbf3fc-4c5e-4406-83f6-27694b138245/Press-Release-Financial-Results-Q2-2026.pdf"},
 {"fact": "EUV was 48% of ASML net system sales in 2025; China was 33% of net system sales, down from 41% in 2024", "source": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"},
 {"fact": "The TWINSCAN NXE:3800E reaches its full 220 wafers-per-hour specification, a 37% improvement on the NXE:3600D", "source": "https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf"},
 {"fact": "An EUV source drops molten tin 50,000 times a second and hits each droplet with a low-intensity pulse and then a vaporizing one", "source": "https://www.asml.com/en/technology/lithography-principles/light-and-lasers"},
 {"fact": "ASML demonstrated the first 1,000-watt EUV light source in April 2025, and customers had run more than 400,000 wafers on High NA systems by the end of that year", "source": "https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf"},
 {"fact": "ASML booked four EXE (High NA) and 44 NXE systems as revenue in 2025, against two EXE and 42 NXE in 2024", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
 {"fact": "ASML lists 5,100 suppliers in its 2025 annual report", "source": "https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm"},
 {"fact": "Reuters puts a DUV scanner at roughly $60 million, a standard EUV tool at around $200 million and a High-NA system at $350 million to $400 million, and ASML's DUV share above 80%", "source": "https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/"}
 ],
 "figures": [
 {
 "id": "euv-shipments",
 "type": "bars",
 "title": "EUV systems ASML booked as revenue each year",
 "unit": "tools",
 "data": [["2023", 53], ["2024", 44], ["2025", 48]],
 "source": {"label": "ASML annual reports 2024 and 2025", "url": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"}
 },
 {
 "id": "tool-price",
 "type": "bars",
 "title": "What one lithography system costs. The High-NA figure is quoted as a $350-400M range; the bar shows the low end",
 "unit": "$M",
 "data": [["DUV scanner", 60], ["EUV, 0.33 NA", 200], ["High-NA EUV", 350]],
 "source": {"label": "Reuters, The $400 million ASML 'printers', July 2026", "url": "https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/"}
 },
 {
 "id": "litho-mix",
 "type": "stack",
 "title": "ASML net system sales by technology, 2025",
 "unit": "%",
 "data": [["EUV", 48], ["ArF immersion", 42], ["KrF", 4], ["Metrology and inspection", 3], ["ArF dry", 2], ["i-line", 1]],
 "source": {"label": "ASML Q4 2025 investor presentation", "url": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"}
 },
 {
 "id": "asml-region",
 "type": "stack",
 "title": "ASML net system sales by the region tools shipped to, 2025",
 "unit": "%",
 "data": [["China", 33], ["South Korea", 25], ["Taiwan", 22], ["United States", 12], ["Japan", 5], ["Rest of Asia", 2], ["EMEA", 1]],
 "source": {"label": "ASML Q4 2025 investor presentation", "url": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"}
 }
 ]
}
---
# Lithography

Every transistor in an AI accelerator gets its shape from a machine one company builds. ASML sold 327 lithography systems in 2025, 48 of them extreme ultraviolet, and nobody else sells EUV ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)).

## How it works

Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a lamp and projects the image, four times smaller, onto the silicon. The finer the lines, the shorter the wavelength of light needed to print them. The shortest light now in use will not pass through air, so the machine has to print in a vacuum. Only one company has ever built a machine that prints with it, and it is Dutch. Export controls, the government rules on who a company may sell to, reach advanced chipmaking mainly by reaching that one firm.

The stencil is a photomask, the film is photoresist and the machine is a scanner (see [Photomasks and pellicles](#photomasks-and-pellicles)). The steps run in the same order for every layer of every chip.

First the wafer is coated with photoresist, a film that changes chemically wherever light reaches it. Then the photomask, a glass plate carrying one layer's pattern as clear and opaque regions drawn four times larger than the final circuit, goes into the machine. Light from the source passes through the mask (or bounces off it, for EUV masks, which are mirrors), and a lens or set of mirrors shrinks the image four times and focuses it onto the resist. Where the pattern let light through, the resist is exposed; where the mask blocked it, the resist is untouched. A chemical wash then dissolves the exposed resist, leaving the pattern standing on the wafer as a stencil for the next machine, which etches it into the layer below or fills it with metal. The resist is stripped, and the wafer comes back with the next mask for the next layer. A modern chip takes dozens of masks in sequence.

The machine does not expose the whole wafer at once. One mask image covers a field of about 26 by 33 mm, so the wafer sits on a stage that steps from field to field, close to a hundred times per wafer, and within each field a narrow slit of light sweeps across while the mask and the wafer move in opposite directions in step, which is why the machine is called a scanner. Each new layer has to land on the layers already printed to within a few nanometers, so before every exposure the machine finds alignment marks printed on the wafer in earlier layers and corrects the stage's position and the lens's focus against them.

How fine a line the machine can print depends on two things: the wavelength of the light and how wide a cone of light the optics gather, called the numerical aperture. Shorter light and a wider cone both print finer. Water gathers a wider cone than air, so ASML's deep ultraviolet systems flood the gap between the lens and the wafer with ultrapure water and reach an aperture of 1.35 ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)). Extreme ultraviolet light, at 13.5 nm, is about fourteen times shorter than deep ultraviolet, but no lens and no air will pass it, so an EUV scanner works in a vacuum with mirrors in place of lenses.

When one exposure cannot resolve a pattern, the fab prints the layer with two, three or four masks in sequence, each carrying part of the design. Each pass costs another mask, more time on the tool and another chance to misalign, so moving a layer to a single EUV exposure usually saves money.

## Variants and trade-offs

### Deep ultraviolet

Deep ultraviolet (DUV) light comes from gas lasers: 248 nanometers from krypton fluoride (KrF), 193 from argon fluoride (ArF), shone through air or water. These tools still dominate by volume: of ASML's 327 systems in 2025, 131 were ArF immersion, 78 KrF, 54 the older, coarser i-line and 16 ArF dry ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)). A DUV scanner costs roughly $60 million. DUV is the one tier with named competitors, Nikon and Canon, and ASML still holds above 80 percent of it ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)).

Immersion is the contested tier, because without EUV a fab needs NXT:2000i-class scanners and several passes per layer to reach leading-edge logic, and that is where Dutch export licensing draws its line.

### Extreme ultraviolet

The 13.5 nm light comes from dropping molten tin into a vacuum vessel 50,000 times a second and hitting each droplet twice, with a low-intensity pulse to flatten it and then one that vaporizes it into plasma ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)). Zeiss mirrors carry it to the wafer, and the largest are a meter across, polished flat to within tens of picometers, thousandths of a nanometer ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)).

Brighter light means more wafers an hour, and ASML ran the first 1,000-watt EUV source in April 2025 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)). Its TWINSCAN NXE:3800E now ships at its full 220 wafers an hour, 37 percent better than the NXE:3600D ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).

### High-NA EUV

High numerical aperture (High-NA) raises the aperture from 0.33 to 0.55 and cuts the smallest printable feature from 13 nm to 8 nm ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). Its optics shrink the mask image four times in one direction and eight in the other, halving the patch of wafer one exposure covers and doubling the exposures per wafer ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). The second-generation TWINSCAN EXE:5200B runs at 175 wafers an hour, 60 percent above the EXE:5000 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).

Reuters puts a standard EUV tool at around $200 million and a High-NA machine at $350 to $400 million, prices ASML does not publish ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)).

{{figure:tool-price}}

Intel and TSMC have split on High-NA:

- **Intel Foundry** ships the first high-volume logic product made with High-NA, on Intel 18A, and installed the first EXE:5200B ([source](https://www.asml.com/en/news/press-releases/2026/high-na-euv-reaches-new-readiness-milestone)), after more than a million High-NA wafers ([source](https://www.intel.com/content/www/us/en/newsroom/news/intel-foundry/intel-foundry-asml-accelerate-industry-readiness-for-high-na-euv.html)).
- **TSMC** held off, and now says it will use High-NA in high-volume manufacturing from 2030 ([source](https://pr.tsmc.com/english/news/3338)).

ASML booked four EXE systems as revenue in 2025 against two in 2024 ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)), and expects the platform to carry high-volume manufacturing from 2027 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)). On 8 September 2026 it announced with TSMC a move to 12-inch photomasks to lift the field-size limit, with a pilot mask line in 2031 and production systems by 2033 ([source](https://pr.tsmc.com/english/news/3338)).

{{figure:euv-shipments}}

## Who makes it

ASML took EUR 32.7 billion in net sales in 2025 at a 52.8 percent gross margin ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)), and in July 2026 raised its 2026 forecast to EUR 43 to 45 billion at 54 to 56 percent ([source](https://ourbrand.asml.com/asset/c8dbf3fc-4c5e-4406-83f6-27694b138245/Press-Release-Financial-Results-Q2-2026.pdf)). It assembles more than it makes, listing 5,100 suppliers ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)). Four carry the EUV machine:

- **Zeiss SMT**, Oberkochen, makes the illumination system and the six-mirror projection optics ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html)).
- **Trumpf**, Ditzingen, makes the carbon dioxide drive laser, which amplifies a few watts to 40 kilowatts ([source](https://www.trumpf.com/en_US/products/lasers/euv-drive-laser/)).
- **ASML San Diego**, the former Cymer, designs the source where the laser turns tin into plasma, and builds the droplet generator ([source](https://www.asml.com/en/company/about-asml/locations/san-diego)).
- **VDL ETG** builds the frames that suspend and position the mirrors ([source](https://www.vdlgroep.com/en/vdl-groep/innovation-projects/vdl-etg-builds-complex-frames-for-zeiss)).

Zeiss mirror polishing and coating, not final assembly in Veldhoven, caps EUV output.

Nikon and Canon are specialists now. Nikon sold 22 new scanners in the year to March 2026, into a market it sizes at 570 units, and lost money on Precision Equipment ([source](https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf)). Canon's bet is nanoimprint, where the FPA-1200NZ2C stamps the pattern instead of projecting it, down to a 14 nm linewidth ([source](https://global.canon/en/news/2024/20240926.html)). No leading-edge logic customer has taken it up.

{{figure:litho-mix}}

## Controls and China's answer

Export controls bar EUV from Chinese foundries, and CSIS judges the technology out of reach there despite state spending ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). Below EUV, the restrictions arrived in this order:

- **Dutch national licensing** of advanced DUV took effect on 1 September 2023, and The Hague widened it on 6 September 2024 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)).
- **A partial license revocation** disclosed on 1 January 2024 stopped NXT:2050i and NXT:2100i shipments to a few Chinese customers ([source](https://www.asml.com/en/news/press-releases/2023/statement-regarding-partial-revocation-export-license)).
- **The BIS Affiliates Rule** extended entity-list controls to 50 percent-owned subsidiaries from 29 September 2025 ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)), then BIS suspended it to 9 November 2026 ([source](https://www.federalregister.gov/documents/2025/11/12/2025-19846/one-year-suspension-of-expansion-of-end-user-controls-for-affiliates-of-certain-listed-entities)).

China fell from 41 percent of ASML's net system sales in 2024 to 33 percent in 2025 ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)).

On DUV, Reuters reported in July 2026, on one unnamed source, that Shanghai Aishengna Electronic Technology Group has started producing home-grown immersion DUV tools. The firm was registered in August 2023 with 7 billion yuan of capital and two state shareholders, Shanghai Electric Holding and a Shanghai International Trust subsidiary. It has no website, and has taken in teams from SMEE and the startup Yuliangsheng ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). SMEE, the incumbent, is strongest in i-line and even there holds about four percent of the world market ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

On EUV the record is thinner, and claims of Huawei mass production in 2026 remain unverified. Reuters reported in December 2025 that a Shenzhen team of former ASML engineers had built a prototype that makes extreme ultraviolet light but no chip ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). Between that light and a printed chip sit the mirrors, and only Zeiss can polish them.

{{figure:asml-region}}

## The chokepoint

If ASML stops shipping, nothing at the leading edge gets printed, and even ASML could not rebuild itself quickly, since Zeiss makes its optics and Trumpf its drive laser.

For AI accelerators, EUV is the point of control. It prints the finest layers, the ones that set how densely transistors and wires pack, and TSMC expects the number of layers needing High-NA to rise as AI designs grow more complex ([source](https://pr.tsmc.com/english/news/3338)). Every added layer is more time on a tool nobody else builds.

## Key evaluation criteria

- **Resolution.** Set by wavelength divided by numerical aperture. 13 nm at 0.33 NA, 8 nm at 0.55 NA ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)).
- **Throughput.** Wafers an hour at a stated dose. 220 on the NXE:3800E, 175 on the EXE:5200B ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).
- **Overlay.** How precisely one layer lands on the one below; ASML credits the EXE:5200B's gain to new Zeiss optics ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).
- **Field size.** The patch of wafer one exposure covers. High-NA halves it, so big AI dies must be stitched until 12-inch masks arrive ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)).
- **Source power.** Brighter light, more wafers an hour, which is why the 1,000-watt demonstration matters ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).

## Takeaways

ASML, in Veldhoven, using Zeiss mirrors from Oberkochen, sets the resolution of every leading-edge AI chip. ASML booked 48 EUV systems in 2025, four of them High-NA ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)). Export controls cut China's share of ASML system sales from 41 percent in 2024 to 33 percent in 2025 ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)), and China's answer is domestic immersion DUV plus an EUV prototype that has not yet made a chip. No announced program changes this bottleneck before 2030.
