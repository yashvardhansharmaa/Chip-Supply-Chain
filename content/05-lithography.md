---json
{
  "id": "lithography",
  "number": 5,
  "title": "Lithography",
  "oneLiner": "The most concentrated stage in the chain. One firm in the Netherlands builds every EUV scanner on Earth, and it shipped 48 of them in 2025.",
  "plain": "Lithography is photographic printing, shrunk. A stencil of one layer of the circuit is held up to a lamp, and the machine projects that image onto a silicon wafer coated in a light-sensitive film, four times smaller than the stencil. Finer circuits need shorter-wavelength light, and the shortest light now in use is absorbed by air and by glass, so the whole machine runs in a vacuum and every lens has to be a mirror. Only one company has ever built such a machine, which is why a single Dutch firm is a chokepoint.",
  "specimen": "euv-scanner",
  "specimenCaption": "Right: an EUV scanner in cross-section. Tin plasma source at the bottom left, collector mirror, reticle stage at the top, six-mirror projection optics, wafer stage at the bottom right.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "ASML", "country": "NL", "share": "100% of EUV; 48% of its own 2025 system revenue was EUV, 42% ArF immersion"},
      {"name": "Nikon", "country": "JP", "share": "22 new semiconductor scanners in FY ended March 2026, against a market Nikon sizes at 570 units"},
      {"name": "Canon", "country": "JP", "share": "i-line and KrF steppers, plus the only commercial nanoimprint tool"}
    ],
    "countries": [
      {"code": "NL", "note": "ASML design and final assembly, Veldhoven"},
      {"code": "DE", "note": "Zeiss SMT optics, Oberkochen; Trumpf CO2 drive lasers, Ditzingen"},
      {"code": "US", "note": "ASML light-source research and manufacturing, San Diego"},
      {"code": "JP", "note": "Nikon and Canon DUV scanners and steppers"}
    ],
    "chinaStatus": "No EUV has ever been sold to a customer in China. A Shenzhen prototype built by former ASML engineers generated EUV light in early 2025 but has not made a working chip. A Shanghai state firm, Aishengna, began building domestic immersion DUV in 2026 at single-digit annual volumes.",
    "usStatus": "No domestic scanner maker. Washington controls access through Dutch licensing, US-origin subsystems and entity-list rules.",
    "costSignal": "About $250M for a Low-NA EUV system; $350M to $400M for High-NA EXE:5200B",
    "substitution": {"years": "10+", "why": "ASML built its first EUV prototype in 2001 and needed nearly two decades and billions of euros before commercial chips shipped in 2019, and it still depends on Zeiss optics that no one else can make."}
  },
  "keyFacts": [
    {"fact": "ASML recognized 48 EUV systems in revenue in 2025, versus 44 in 2024 and 53 in 2023", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
    {"fact": "ASML total net sales were EUR 32.7 billion in 2025 at a 52.8% gross margin, with 2026 guidance of EUR 34 to 39 billion", "source": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"},
    {"fact": "EUV was 48% of ASML net system sales in 2025; China was 33% of net system sales, down from 41% in 2024", "source": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"},
    {"fact": "The TWINSCAN NXE:3800E runs above 220 wafers per hour at a 30 mJ/cm2 dose with 0.9 nm overlay", "source": "https://bits-chips.com/article/asmls-high-na-euv-technology-is-seeping-into-low-na-tools/"},
    {"fact": "An EUV source fires 50,000 tin droplets per second and runs at about 600 W today; ASML demonstrated 1,000 W in research in February 2026", "source": "https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html"},
    {"fact": "Ten High-NA EUV systems were operating at four customers as of September 2026, with three more shipping", "source": "https://www.trendforce.com/news/2026/09/01/news-asml-advances-high-na-euv-toward-high-volume-manufacturing-as-10-systems-reportedly-go-live-at-4-customers"},
    {"fact": "ASML lists 5,100 suppliers in its 2025 annual report", "source": "https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm"},
    {"fact": "China accounted for roughly 16% of ASML net sales in the first half of 2026", "source": "https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/"}
  ],
  "figures": [
    {
      "id": "euv-shipments",
      "type": "bars",
      "title": "EUV systems recognized in revenue per year",
      "unit": "tools",
      "data": [["2023", 53], ["2024", 44], ["2025", 48]],
      "source": {"label": "ASML annual reports 2024 and 2025", "url": "https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf"}
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
      "title": "ASML net system sales by ship-to region, 2025",
      "unit": "%",
      "data": [["China", 33], ["South Korea", 25], ["Taiwan", 22], ["United States", 12], ["Japan", 5], ["Rest of Asia", 2], ["EMEA", 1]],
      "source": {"label": "ASML Q4 2025 investor presentation", "url": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"}
    }
  ]
}
---
# Lithography

Every transistor in an AI accelerator gets its shape from a machine built by one company. ASML sold 327 lithography systems in 2025, 48 of them extreme ultraviolet, and nobody else sells EUV ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)). No other stage in this chain has a single point of failure this sharp.

## How it works

Lithography is photographic printing, shrunk. A stencil of one layer of the circuit is held up to a lamp, and the machine projects that image onto a silicon wafer coated in a light-sensitive film, four times smaller than the stencil. Finer circuits need shorter-wavelength light, and the shortest light now in use is absorbed by air and by glass, so the whole machine runs in a vacuum and every lens has to be a mirror. Only one company has ever built such a machine, which is why a single Dutch firm is a chokepoint.

The stencil is a photomask, the film is photoresist, and the machine is a scanner. See Photomasks and pellicles, and Deposition and etch.

Resolution follows one relation: the smallest printable half-pitch is a process factor times the wavelength, divided by the numerical aperture of the optics. Shorter wavelength and wider aperture both buy resolution. Aperture depends on the refractive index above the wafer, so flooding that gap with ultrapure water lifts ASML's deep ultraviolet systems to 1.35 ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)).

When one exposure cannot resolve a pitch, the fab splits the layer across two, three or four masks in sequence. Each pass adds a mask, cycle time and overlay error, so moving a layer to single-exposure EUV usually saves money. That is the commercial case for the machine.

## Variants and trade-offs

### Deep ultraviolet

DUV means excimer laser light: 248 nm from krypton fluoride, 193 nm from argon fluoride, dry or through water. These tools still dominate by volume. Of ASML's 327 systems in 2025, 131 were ArF immersion, 78 KrF, 54 i-line and 16 ArF dry ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)).

Immersion is the contested tier. A fab needs NXT:2000i-class scanners to reach leading-edge logic through multipatterning, and that is where Dutch export licensing draws its line.

### Extreme ultraviolet

The 13.5 nm light comes from dropping molten tin into a vacuum vessel 50,000 times a second and hitting each droplet with two carbon dioxide laser pulses ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)). A collector mirror hands the result to six-mirror optics from Zeiss, ASML's optics partner since the late 1980s. The largest are a metre across and polished smooth to tens of picometres ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)).

Source power is about 600 W, which runs the TWINSCAN NXE:3800E above 220 wafers per hour ([source](https://bits-chips.com/article/asmls-high-na-euv-technology-is-seeping-into-low-na-tools/)). ASML reached 1,000 W in research in February 2026 and targets 330 wafers per hour by 2030 ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)). A Low-NA machine costs around $250 million ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)).

### High-NA EUV

High-NA raises numerical aperture from 0.33 to 0.55. The TWINSCAN EXE:5200B resolves 8 nm features, for sub-2 nm logic and leading-edge DRAM ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-exe-5200b)). Its optics are anamorphic, demagnifying 4x in one direction and 8x in the other. That halves the printable field, so the fab must stitch a large die from two exposures ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)).

Ten systems were running at four customers in September 2026, and the tool hit 135 wafers per hour in acceptance testing ([source](https://www.trendforce.com/news/2026/09/01/news-asml-advances-high-na-euv-toward-high-volume-manufacturing-as-10-systems-reportedly-go-live-at-4-customers)). Estimates put the price at $350 million to $400 million ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)) ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)). Adoption splits three ways.

- **Intel Foundry** has processed more than a million High-NA wafers and is the first foundry to run the tool in high-volume manufacturing, on Intel 18A ([source](https://www.trendforce.com/news/2026/09/08/news-asml-expands-high-na-euv-push-with-tsmc-samsung-and-intel-12-inch-photomask-pilot-line-set-for-2031/)).
- **TSMC** held off and now says it will use High-NA in high-volume manufacturing from 2030 ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)).
- **Samsung** targets 2028, for DRAM rather than logic ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)).

ASML and TSMC announced a move to 12-inch photomasks on 8 September 2026 to lift the field-size limit, with a pilot mask line targeted for 2031 ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).

{{figure:euv-shipments}}

## Who makes it

ASML took EUR 32.7 billion in net sales in 2025 at a 52.8% gross margin, and guides to EUR 34 to 39 billion for 2026 ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)). It is an integrator with 5,100 suppliers ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)). Four carry the EUV machine.

- **Zeiss SMT**, Oberkochen, makes the mirrors and illumination optics ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)).
- **Trumpf**, Ditzingen, makes the carbon dioxide drive lasers ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)).
- **ASML San Diego** makes the light sources ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)).
- **VDL** and other Dutch firms supply frames and modules ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)).

We think Zeiss mirror polishing and coating, not final assembly in Veldhoven, sets the ceiling on how fast EUV output can grow.

The Japanese incumbents are specialists now. Nikon sold 22 new semiconductor scanners in the year to March 2026, into a market it sizes at 570 units, and its Precision Equipment business ran at a loss ([source](https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf)). Canon's bet is nanoimprint: the FPA-1200NZ2C stamps rather than projects, at a 14 nm minimum linewidth ([source](https://global.canon/en/news/2024/20240926.html)). It is a real technology with no leading-edge logic customer.

{{figure:litho-mix}}

## Controls and China's answer

No EUV system has ever been sold to a customer in China ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). Below EUV, the restrictions came in three moves.

- **Dutch national licensing** of advanced DUV took effect on 1 September 2023, and The Hague widened it on 6 September 2024 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)).
- **A partial licence revocation** disclosed on 1 January 2024 stopped NXT:2050i and NXT:2100i shipments to a few Chinese customers ([source](https://www.asml.com/en/news/press-releases/2023/statement-regarding-partial-revocation-export-license)).
- **The BIS Affiliates Rule** extended entity-list controls to 50%-owned subsidiaries from 29 September 2025 ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)). A US-China trade deal suspended it for a year from 10 November 2025 ([source](https://www.internationaltradeinsights.com/2025/11/bis-suspends-affiliates-rule-for-one-year-following-u-s-agreement-with-china/)).

The effect shows in ASML's mix. China was 41% of net system sales in 2024, 33% in 2025 ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)) and roughly 16% in the first half of 2026 ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). ASML expects about 20% for the full year ([source](https://www.caixinglobal.com/2026-01-29/asml-expects-china-revenue-drop-following-backlog-fueled-surge-102409285.html)).

China's answer has two tracks. On DUV it is verified. Reuters reported in July 2026 that the state-owned Shanghai Aishengna, capitalised at 7 billion yuan, has begun mass producing immersion DUV scanners after absorbing teams from SMEE and the SiCarrier affiliate Yuliangsheng. It plans about five machines this year and 20 in 2027 ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). That is a real tool at trivial volume.

On EUV the record is thinner and rests on unnamed sources. Reuters reported in December 2025 that a Shenzhen team of former ASML engineers built a prototype that makes extreme ultraviolet light but no working chip, because it cannot get Zeiss-class mirrors. Beijing targets working chips by 2028; people close to the project say 2030 ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). Treat claims of Huawei EUV mass production in 2026 as unverified.

{{figure:asml-region}}

## The chokepoint

Lithography scores a 5 because the failure mode is total and substitution takes decades. Even ASML could not rebuild itself quickly: the hardest parts sit at Zeiss and Trumpf, not in Veldhoven.

For AI accelerators the leverage is in EUV. It prints the tightest-pitch layers, the ones that set transistor density and metal pitch, and TSMC expects High-NA layer counts to rise as AI architectures grow more complex ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)). As of mid-2025 every EUV node in high-volume production still used single patterning ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). When that changes, tool demand per wafer rises again.

## Key evaluation criteria

- **Resolution** — set by wavelength divided by numerical aperture. 13 nm at 0.33 NA, 8 nm at 0.55 NA ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)).
- **Throughput** — wafers per hour at a stated dose. Above 220 wph at 30 mJ/cm2 on NXE:3800E, 135 wph in acceptance testing on EXE:5200B ([source](https://www.trendforce.com/news/2026/09/01/news-asml-advances-high-na-euv-toward-high-volume-manufacturing-as-10-systems-reportedly-go-live-at-4-customers)).
- **Overlay** — how precisely one layer lands on the one below. 0.9 nm machine-matched on NXE:3800E ([source](https://bits-chips.com/article/asmls-high-na-euv-technology-is-seeping-into-low-na-tools/)).
- **Field size** — High-NA's anamorphic optics halve the field, so big AI dies must be stitched until 12-inch masks arrive ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).
- **Source power and availability** — power sets throughput, and unscheduled downtime on a $250M asset dominates cost per exposure ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)).

## Takeaways

One firm, in one Dutch town, using mirrors from one German optics house, gates the resolution of every leading-edge AI chip. The tool count is small enough to track by hand: 48 EUV systems in 2025 ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)) and ten High-NA systems in the field ([source](https://www.trendforce.com/news/2026/09/01/news-asml-advances-high-na-euv-toward-high-volume-manufacturing-as-10-systems-reportedly-go-live-at-4-customers)). Export controls have cut China's share of ASML system sales from 41% in 2024 toward a guided 20% in 2026 ([source](https://www.cnbc.com/2026/01/28/asml-q4-2025-earnings-report.html)), and China's answer is low-volume immersion DUV plus an EUV prototype that has not yet made a chip. Nothing on the horizon changes the shape of this bottleneck before 2030.
