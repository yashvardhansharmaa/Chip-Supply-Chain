---json
{
  "id": "lithography",
  "number": 5,
  "title": "Lithography",
  "oneLiner": "The most concentrated stage in the chain. One firm in the Netherlands builds every extreme ultraviolet scanner in the world, the machine that prints the finest circuit layers. It shipped 48 of them in 2025, at around $200 million each.",
  "plain": "Lithography prints the pattern of a circuit onto the chip. It is photography, shrunk: the machine holds a stencil of one layer up to a lamp and projects that image, four times smaller, onto a silicon wafer coated in a light-sensitive film. Finer circuits need shorter-wavelength light, and the shortest light now in use is absorbed by air and by glass, so the whole machine runs in a vacuum and every lens has to be a mirror. Only one company has ever built such a machine, and it is Dutch, which is why export controls on advanced chipmaking run through a single firm.",
  "specimen": "euv-scanner",
  "specimenCaption": "Right: an extreme ultraviolet scanner in cross-section. Tin plasma source at the bottom left, collector and three illuminator mirrors, the mask, or reticle, held pattern-down at the top, six projection mirrors, the wafer stage at the bottom right, and in copper the 13.5 nm light itself.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "ASML", "country": "NL", "share": "All EUV (extreme ultraviolet) scanners and above 80% of DUV (deep ultraviolet); EUV was 48% of its own 2025 system revenue and immersion DUV 42%"},
      {"name": "Nikon", "country": "JP", "share": "22 new chipmaking scanners in the year to March 2026, in a market Nikon sizes at 570 units"},
      {"name": "Canon", "country": "JP", "share": "i-line and krypton fluoride steppers for older, coarser layers, plus the only commercial nanoimprint tool"}
    ],
    "countries": [
      {"code": "NL", "note": "ASML design and final assembly, Veldhoven"},
      {"code": "DE", "note": "Zeiss SMT optics, Oberkochen; Trumpf carbon dioxide lasers that drive the light source, Ditzingen"},
      {"code": "US", "note": "ASML light-source research and manufacturing, San Diego"},
      {"code": "JP", "note": "Nikon and Canon deep ultraviolet scanners and steppers"}
    ],
    "chinaStatus": "No EUV scanner has ever been sold to a customer in China, and CSIS judges the technology firmly out of reach despite state investment. A Shanghai firm, Aishengna, started building domestic immersion DUV scanners in 2026. SMEE, the older domestic supplier, holds about 4% of the global i-line market, the coarsest tier, and nothing above it.",
    "usStatus": "No domestic scanner maker. Washington controls access through Dutch licensing, US-origin subsystems and entity-list rules.",
    "costSignal": "About $200M for a standard EUV scanner, $350-400M for the newer High-NA version and about $60M for a DUV tool, on Reuters' reporting; ASML does not publish per-system prices",
    "substitution": {"years": "10+", "why": "ASML built its first EUV prototype in 2001 and needed nearly two decades and billions of euros before commercial chips shipped in 2019. It still depends on Zeiss mirrors that no one else can make."}
  },
  "keyFacts": [
    {"fact": "ASML recognized 48 EUV systems in revenue in 2025, versus 44 in 2024 and 53 in 2023", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
    {"fact": "ASML total net sales were EUR 32.7 billion in 2025 at a 52.8% gross margin", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
    {"fact": "In July 2026 ASML raised its 2026 guidance to EUR 43 to 45 billion of net sales at a 54 to 56% gross margin", "source": "https://ourbrand.asml.com/asset/c8dbf3fc-4c5e-4406-83f6-27694b138245/Press-Release-Financial-Results-Q2-2026.pdf"},
    {"fact": "EUV was 48% of ASML net system sales in 2025; China was 33% of net system sales, down from 41% in 2024", "source": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"},
    {"fact": "The TWINSCAN NXE:3800E reaches its full 220 wafers-per-hour specification, a 37% improvement on the NXE:3600D", "source": "https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf"},
    {"fact": "An EUV source drops molten tin 50,000 times a second and hits each droplet with a low-intensity pulse and then a vaporising one", "source": "https://www.asml.com/en/technology/lithography-principles/light-and-lasers"},
    {"fact": "ASML demonstrated the first 1,000-watt EUV light source in April 2025, and customers had run more than 400,000 wafers on High NA systems by the end of that year", "source": "https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf"},
    {"fact": "ASML recognized four EXE (High NA) and 44 NXE systems in 2025, against two EXE and 42 NXE in 2024", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
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

Lithography prints the pattern of a circuit onto the chip. It is photography, shrunk: the machine holds a stencil of one layer up to a lamp and projects that image, four times smaller, onto a silicon wafer coated in a light-sensitive film. Finer circuits need shorter-wavelength light, and the shortest light now in use is absorbed by air and by glass, so the whole machine runs in a vacuum and every lens has to be a mirror. Only one company has ever built such a machine, and it is Dutch, which is why export controls on advanced chipmaking run through a single firm.

The stencil is a photomask, the film is photoresist, and the machine is a scanner (see Photomasks and pellicles, and Deposition and etch).

Resolution follows one relation: the smallest feature a scanner can print is a process factor times the wavelength of its light, divided by the numerical aperture, which measures how wide a cone of light the optics gather. Shorter light and a wider cone both print finer. The cone widens in a denser medium, so ASML floods the gap above the wafer with ultrapure water and reaches an aperture of 1.35 on its deep ultraviolet systems ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)).

When one exposure cannot resolve a pattern that fine, the fab splits the layer across two, three or four masks printed in sequence. Each extra pass costs another mask, more time on the tool and another chance to misalign the layers, so moving a layer to a single EUV exposure usually saves money.

## Variants and trade-offs

### Deep ultraviolet

Deep ultraviolet, or DUV, light comes out of gas lasers: 248 nanometres from krypton fluoride, 193 from argon fluoride, shone through air or through water. These tools still dominate by volume. Of ASML's 327 systems in 2025, 131 were argon fluoride immersion, 78 krypton fluoride, 54 the older and coarser i-line type and 16 argon fluoride dry ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)). A DUV scanner costs roughly $60 million, and this is the one tier with named competitors, Nikon and Canon, where ASML still holds above 80% ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)).

Immersion is the contested tier. A fab without EUV needs NXT:2000i-class immersion scanners to reach leading-edge logic by printing each layer in several passes, and that is where Dutch export licensing draws its line.

### Extreme ultraviolet

The 13.5 nm light comes from dropping molten tin into a vacuum vessel 50,000 times a second and hitting each droplet twice, with a low-intensity pulse to flatten it and then one that vaporises it into plasma ([source](https://www.asml.com/en/technology/lithography-principles/light-and-lasers)). A collector mirror hands the light to a six-mirror projection system from Zeiss ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html)). The largest mirrors are a metre across, polished flat to within tens of picometres, thousandths of a nanometre ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)).

Brighter light means more wafers an hour, and ASML ran the first 1,000-watt EUV source in April 2025 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)). Its TWINSCAN NXE:3800E now ships at its full 220 wafers an hour, 37 percent better than the NXE:3600D, on a stronger source, a new wafer handler and faster stages ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).

### High-NA EUV

High numerical aperture, or High-NA, raises the aperture from 0.33 to 0.55 and cuts the smallest printable feature from 13 nm to 8 nm ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). To do it the optics shrink the mask image four times in one direction and eight in the other, which halves the patch of wafer one exposure covers and doubles the exposures per wafer ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). The second-generation TWINSCAN EXE:5200B runs at 175 wafers an hour, 60 percent above the EXE:5000 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).

ASML does not publish per-system prices. Reuters puts a 0.33 NA EUV tool at around $200 million and a High-NA machine at $350 million to $400 million ([source](https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/)).

{{figure:tool-price}}

Intel and TSMC have split on High-NA:

- **Intel Foundry** is first to ship a high-volume logic product made with High-NA, on Intel 18A, and first to install and accept an EXE:5200B ([source](https://www.asml.com/en/news/press-releases/2026/high-na-euv-reaches-new-readiness-milestone)), having run more than a million High-NA wafers ([source](https://www.intel.com/content/www/us/en/newsroom/news/intel-foundry/intel-foundry-asml-accelerate-industry-readiness-for-high-na-euv.html)).
- **TSMC** held off and now says it will use High-NA in high-volume manufacturing from 2030 ([source](https://pr.tsmc.com/english/news/3338)).

ASML booked four EXE systems as revenue in 2025, against two in 2024 ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)), and expects the platform to carry high-volume manufacturing from 2027 ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)). On 8 September 2026 it announced with TSMC a move to 12-inch photomasks to lift that field-size limit, aiming at a pilot mask line in 2031 and 12-inch High-NA systems in production by 2033 ([source](https://pr.tsmc.com/english/news/3338)).

{{figure:euv-shipments}}

## Who makes it

ASML took EUR 32.7 billion in net sales in 2025 at a 52.8% gross margin ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)), and in July 2026 raised its forecast for the year to EUR 43 to 45 billion at 54 to 56% ([source](https://ourbrand.asml.com/asset/c8dbf3fc-4c5e-4406-83f6-27694b138245/Press-Release-Financial-Results-Q2-2026.pdf)). It assembles more than it makes, and lists 5,100 suppliers ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)). Four of them carry the EUV machine:

- **Zeiss SMT**, Oberkochen, makes the illumination system and the six-mirror projection optics ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html)).
- **Trumpf**, Ditzingen, makes the carbon dioxide drive laser, which amplifies a few watts to as much as 40 kilowatts and fires 50,000 pulses a second ([source](https://www.trumpf.com/en_US/products/lasers/euv-drive-laser/)).
- **ASML San Diego**, the former Cymer, designs the source where the laser turns tin into plasma, and builds the droplet generator ([source](https://www.asml.com/en/company/about-asml/locations/san-diego)).
- **VDL ETG** builds the frames that suspend and position the mirrors ([source](https://www.vdlgroep.com/en/vdl-groep/innovation-projects/vdl-etg-builds-complex-frames-for-zeiss)).

We think the ceiling on EUV output is Zeiss mirror polishing and coating rather than final assembly in Veldhoven.

Nikon and Canon are specialists now. Nikon sold 22 new semiconductor scanners in the year to March 2026, into a market it sizes at 570 units, and its Precision Equipment business ran at a loss ([source](https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf)). Canon's bet is nanoimprint: the FPA-1200NZ2C stamps the pattern rather than projecting it, at a 14 nm minimum linewidth ([source](https://global.canon/en/news/2024/20240926.html)), and no leading-edge logic customer has adopted it.

{{figure:litho-mix}}

## Controls and China's answer

Export controls keep ASML from shipping EUV to Chinese foundries, and CSIS judges the technology out of reach there despite state spending ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). Below EUV, the restrictions arrived in this order:

- **Dutch national licensing** of advanced DUV took effect on 1 September 2023, and The Hague widened it on 6 September 2024 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)).
- **A partial licence revocation** disclosed on 1 January 2024 stopped NXT:2050i and NXT:2100i shipments to a few Chinese customers ([source](https://www.asml.com/en/news/press-releases/2023/statement-regarding-partial-revocation-export-license)).
- **The BIS Affiliates Rule** extended entity-list controls to 50%-owned subsidiaries from 29 September 2025 ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)). BIS then suspended it for a year, from 10 November 2025 to 9 November 2026 ([source](https://www.federalregister.gov/documents/2025/11/12/2025-19846/one-year-suspension-of-expansion-of-end-user-controls-for-affiliates-of-certain-listed-entities)).

The effect shows in ASML's mix: China was 41% of net system sales in 2024 and 33% in 2025 ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)).

On DUV, China's answer is real. Reuters reported in July 2026 that the Shanghai state firm Aishengna has started producing home-grown immersion DUV tools ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). Set that against the incumbent: SMEE is strongest in i-line, the coarsest tier, and even there holds about four percent of the world market ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

On EUV the record is thinner, and claims of Huawei EUV mass production in 2026 remain unverified. Reuters reported in December 2025 that a Shenzhen team of former ASML engineers had built a prototype that makes extreme ultraviolet light but no working chip ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). Between the light and a printed chip sit the mirrors, and only Zeiss can polish them to that shape.

{{figure:asml-region}}

## The chokepoint

Lithography scores a 5 because the failure mode is total: if ASML stops shipping, nothing at the leading edge gets printed. Substitution takes decades, and even ASML could not rebuild itself quickly, since its optics come from Zeiss and its drive laser from Trumpf.

For AI accelerators, EUV is the point of control. It prints the finest layers, the ones that set how densely transistors and wires can be packed, and TSMC expects the number of layers needing High-NA to rise as AI designs grow more complex ([source](https://pr.tsmc.com/english/news/3338)). Every added layer is more time on a tool nobody else builds.

## Key evaluation criteria

- **Resolution** — set by wavelength divided by numerical aperture. 13 nm at 0.33 NA, 8 nm at 0.55 NA ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)).
- **Throughput** — wafers per hour at a stated dose. 220 wph on the NXE:3800E, 175 wph on the EXE:5200B ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).
- **Overlay** — how precisely one layer lands on the one below; ASML credits the EXE:5200B's gain to new Zeiss projection optics ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).
- **Field size** — the patch of wafer one exposure covers. High-NA halves it, so big AI dies must be stitched together until 12-inch masks arrive ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)).
- **Source power** — brighter light means more wafers an hour, which is why the 1,000-watt demonstration matters ([source](https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf)).

## Takeaways

ASML, in Veldhoven, using Zeiss mirrors from Oberkochen, gates the resolution of every leading-edge AI chip. The tool count is small enough to track by hand: 48 EUV systems booked in 2025, four of them High-NA ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)). Export controls cut China's share of ASML system sales from 41% in 2024 to 33% in 2025 ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)), and China's answer is domestic immersion DUV plus an EUV prototype that has not yet made a chip. No announced programme changes this bottleneck before 2030.
