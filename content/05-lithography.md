---json
{
  "id": "lithography",
  "number": 5,
  "title": "Lithography",
  "oneLiner": "The most concentrated stage in the chain. One firm in the Netherlands builds every EUV scanner on Earth, and it shipped 48 of them in 2025.",
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

Every transistor in an AI accelerator gets its shape from a machine built by one company. ASML sold 327 lithography systems in 2025, 48 of them extreme ultraviolet, and nobody else sells EUV at all ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)). No other stage in this chain has a single point of failure this sharp.

## How it works

A scanner prints a circuit pattern by illuminating a patterned mask and projecting a shrunken image of it onto a wafer coated in photoresist. The optics shrink, the resist records where the light landed, and later deposition and etch steps build structures wherever the resist opened up. See Photomasks and pellicles, and Chemicals, gases and photoresist.

Feature size follows the Rayleigh criterion. In words: the smallest printable half-pitch equals a process factor, k1, times the wavelength of the light, divided by the numerical aperture of the projection optics. Shorter wavelength and larger aperture both buy resolution. Everything else, from illumination shape to resist chemistry to mask correction, hides in k1, and physics floors single-exposure k1 at roughly 0.25.

Numerical aperture is the sine of the half-angle of light the final lens can collect, times the refractive index of whatever fills the gap above the wafer. Flooding that gap with ultrapure water instead of air is what lets ASML's deep ultraviolet systems reach an NA of 1.35 ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)). That is immersion lithography, and it kept 193 nm light alive for four nodes past its expected retirement.

When one exposure cannot resolve a pitch, the layer gets split across two, three or four masks exposed and etched in sequence. Each extra pass adds a mask, a process module, cycle time and overlay error. Moving a layer from quadruple-patterned DUV to single-exposure EUV is usually a cost saving, which is the whole commercial case for EUV.

## Variants and trade-offs

### Deep ultraviolet

DUV means excimer laser light: 248 nm from krypton fluoride, 193 nm from argon fluoride either dry or through water. These tools still dominate by volume. Of ASML's 327 lithography systems sold in 2025, 131 were ArF immersion, 78 KrF, 54 i-line and 16 ArF dry ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)).

Immersion is the contested tier. NXT:2000i-class scanners and their successors are what a fab needs to reach 7 nm-class logic through multipatterning, which is exactly why Dutch export licensing draws its line there. ArF immersion still generated 42% of ASML's 2025 system revenue, against 4% for KrF and 2% for ArF dry ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)).

### Extreme ultraviolet

At 13.5 nm, EUV is absorbed by air, by glass, by everything. So the whole optical path runs in vacuum and every element is a mirror. The light itself is made by dropping molten tin into a vacuum vessel at 50,000 droplets per second and hitting each droplet with two CO2 laser pulses, 100,000 pulses per second in total, producing a plasma hotter than the surface of the sun that radiates at 13.5 nm ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)). Reuters puts the plasma temperature at about 200,000 degrees Celsius ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)).

A collector mirror gathers that light and hands it to the illuminator and then to six-mirror projection optics from Zeiss, ASML's optics partner since the late 1980s. Each mirror carries more than 100 engineered layers, and the surfaces are polished smoother than one atom: ASML's own comparison is that a mirror scaled to the size of Germany would have a tallest mountain one millimetre high. The largest EUV mirrors are a metre across and smooth to tens of picometres ([source](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors)).

Current source power is about 600 W, which supports the TWINSCAN NXE:3800E at more than 220 wafers per hour at a 30 mJ/cm2 dose with 0.9 nm machine-matched overlay, against 160 wafers per hour and 1.1 nm on the previous NXE:3600D ([source](https://bits-chips.com/article/asmls-high-na-euv-technology-is-seeping-into-low-na-tools/)). In February 2026 ASML said it had reached 1,000 W in research at its San Diego light-source site and is aiming at 100,000 droplets per second, 300,000 laser pulses per second, and 330 wafers per hour by 2030 ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)). A Low-NA EUV machine costs around $250 million ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)).

Rated throughput is optimistic. Micron reports that good patterning needs higher doses than nominal, and wafers per hour falls linearly as dose rises ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

### High-NA EUV and what comes after

High-NA raises numerical aperture from 0.33 to 0.55. The TWINSCAN EXE:5200B resolves 8 nm features, claims 40% more imaging contrast than NXE systems, and is pitched at sub-2 nm logic and leading-edge DRAM ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-exe-5200b)). The optics are anamorphic, demagnifying 4x in one direction and 8x in the other, which halves the printable field and forces large dies to be stitched from two exposures ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)).

Ten High-NA systems were running at four customers as of September 2026, with three more shipping. The EXE:5200B demonstrated 135 wafers per hour in acceptance testing, with a roadmap through 160, 175 and 180 wafers per hour on later variants ([source](https://www.trendforce.com/news/2026/09/01/news-asml-advances-high-na-euv-toward-high-volume-manufacturing-as-10-systems-reportedly-go-live-at-4-customers)). Price estimates cluster between $350 million and $400 million per tool ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)) ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)).

Adoption is split. Intel Foundry has processed more than one million wafers on High-NA across certification, R&D and volume production, and is the first foundry to use it in high-volume manufacturing starting with Intel 18A ([source](https://www.trendforce.com/news/2026/09/08/news-asml-expands-high-na-euv-push-with-tsmc-samsung-and-intel-12-inch-photomask-pilot-line-set-for-2031/)). TSMC held off, and now says it will use High-NA in high-volume manufacturing from 2030; Samsung targets 2028 for DRAM ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)). On 8 September 2026 ASML and TSMC announced an industry push to 12-inch photomasks to remove the stitching constraint, with a pilot mask line targeted for 2031 and production systems for 2033 ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)). Beyond that sits Hyper-NA at 0.75 NA, which ASML sketched for around 2030 and describes as feasibility studies, not a product ([source](https://www.eetimes.com/asml-aims-for-hyper-na-euv-shrinking-chip-limits/)).

{{figure:euv-shipments}}

## Who makes it

ASML took EUR 32.7 billion in net sales in 2025, EUR 24.5 billion of it systems, at a 52.8% gross margin and EUR 9.6 billion of net income. It guides to EUR 34 to 39 billion in 2026, with EUV revenue significantly higher and non-EUV flat ([source](https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf)). Backlog stood at EUR 38.8 billion at the end of 2025 ([source](https://www.asml.com/en/news/press-releases/2026/q4-2025-financial-results)).

ASML is an integrator. Its 2025 annual report counts 5,100 suppliers ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm)). Zeiss SMT in Oberkochen makes the mirrors and illumination optics, Trumpf makes the CO2 drive lasers, ASML's own San Diego operation makes the light sources, and Dutch firms including VDL supply frames and modules ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)). Zeiss mirror polishing and coating, the scarcest of those, sets the ceiling on EUV output growth.

The Japanese incumbents are now specialists. Nikon's Precision Equipment business took JPY 167.2 billion in the year to March 2026 and an operating loss of JPY 4.5 billion, selling 22 new semiconductor scanners plus 5 refurbished into a market it sizes at 570 units for calendar 2025 ([source](https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf)). Canon's whole Industrial unit, lithography plus OLED and other equipment, took JPY 361.1 billion in 2025 ([source](https://global.canon/en/ir/results/2025/rslt2025-s.pdf)). Canon's bet is nanoimprint: the FPA-1200NZ2C stamps rather than projects and reaches a 14 nm minimum linewidth ([source](https://global.canon/en/news/2024/20240926.html)). It is a real technology with no leading-edge logic customer.

{{figure:litho-mix}}

## Controls and China's answer

The United States began pressing the Netherlands in 2018 to stop EUV sales to China, and ASML says no EUV system has ever been sold to a customer there ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). Dutch national licensing of advanced DUV took effect on 1 September 2023, and was widened by a further measure announced on 6 September 2024 and effective the next day ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)). On 1 January 2024 ASML disclosed that a licence for NXT:2050i and NXT:2100i shipments had been partially revoked, affecting a small number of Chinese customers ([source](https://www.asml.com/en/news/press-releases/2023/statement-regarding-partial-revocation-export-license)). The most recent US turn was the BIS Affiliates Rule extending entity-list controls to 50%-owned subsidiaries, effective 29 September 2025 ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)) and then suspended from 10 November 2025 to 9 November 2026 under a US-China trade deal ([source](https://www.internationaltradeinsights.com/2025/11/bis-suspends-affiliates-rule-for-one-year-following-u-s-agreement-with-china/)).

The effect shows up in ASML's mix. China was 41% of net system sales in 2024 and 33% in 2025 ([source](https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf)), fell to roughly 16% of net sales in the first half of 2026 ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)), and ASML expects about 20% for the full year ([source](https://www.caixinglobal.com/2026-01-29/asml-expects-china-revenue-drop-following-backlog-fueled-surge-102409285.html)).

China's domestic answer has two tracks, and they should not be confused. On DUV, this is now verified: Reuters reported on 28 July 2026 that Shanghai Aishengna, a state-owned firm registered in August 2023 with capital of 7 billion yuan, has begun mass producing immersion DUV scanners after absorbing teams from SMEE and the startup Yuliangsheng, an affiliate of Huawei-backed SiCarrier, with roughly five machines planned this year and about 20 in 2027 ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). That is a real tool at trivial volume, and JP Morgan's caution in the same report is the right frame: a handful of tools is not a high-volume manufacturing capability.

On EUV, the record is thinner and rests on unnamed sources. Reuters reported in December 2025 that a Shenzhen team of former ASML engineers completed a prototype in early 2025 that fills a factory floor and does generate extreme ultraviolet light, but has not produced a working chip; Beijing targets working chips by 2028 and people close to the project say 2030 is more realistic ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). Treat later claims of Huawei EUV mass production in 2026 as unverified. The binding constraint is optics: the same report says the prototype lags mainly because the team cannot obtain Zeiss-class mirrors.

{{figure:asml-region}}

## The chokepoint

Lithography scores a 5 because the failure mode is total and substitution takes decades. ASML built its first EUV prototype in 2001 and needed nearly twenty years and billions of euros before chips made with it reached the market in 2019 ([source](https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/)). Even ASML could not rebuild itself quickly, because the hardest parts sit at Zeiss and Trumpf, not in Veldhoven.

For AI accelerators specifically, EUV is where the leverage is. EUV is used on the tightest-pitch layers, the ones that set transistor density and lower-level metal pitch, and TSMC expects the number of High-NA layers to rise as transistor architectures get more complex for AI workloads ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)). As of mid-2025 every EUV node in high-volume production, logic and memory alike, still used single-patterning EUV, with multipatterning EUV in development everywhere ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). When that changes, EUV tool demand per wafer rises again.

## Key evaluation criteria

- **Resolution** — set by wavelength divided by numerical aperture. 13 nm at 0.33 NA, 8 nm at 0.55 NA ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)).
- **Throughput** — wafers per hour at a stated dose. Above 220 wph at 30 mJ/cm2 on NXE:3800E, 135 wph in acceptance testing on EXE:5200B ([source](https://www.trendforce.com/news/2026/09/01/news-asml-advances-high-na-euv-toward-high-volume-manufacturing-as-10-systems-reportedly-go-live-at-4-customers)).
- **Overlay** — how precisely one layer lands on the one below. 0.9 nm machine-matched on NXE:3800E ([source](https://bits-chips.com/article/asmls-high-na-euv-technology-is-seeping-into-low-na-tools/)).
- **Field size** — High-NA's anamorphic optics halve the field, so big AI dies must be stitched until 12-inch masks arrive ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).
- **Source power and availability** — power sets throughput, and unscheduled downtime on a $250M asset dominates cost per exposure ([source](https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html)).

## Takeaways

One firm, in one Dutch town, using mirrors from one German optics house, gates the resolution of every leading-edge AI chip. The tool count is small enough to track by hand: 48 EUV systems recognized in 2025, and ten High-NA systems in the field worldwide. Export controls have cut China's share of ASML system sales from 41% in 2024 toward a guided 20% in 2026, and China has answered with real but low-volume domestic immersion DUV and an EUV prototype that has not yet made a chip. Nothing on the horizon changes the shape of this bottleneck before 2030.
