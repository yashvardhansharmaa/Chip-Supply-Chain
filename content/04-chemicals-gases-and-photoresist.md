---json
{
  "id": "chemicals-gases-and-photoresist",
  "number": 4,
  "title": "Chemicals, Gases and Photoresist",
  "oneLiner": "A few hundred molecules stand between a blank wafer and a working chip. Japan makes about 90% of the photoresist, and the only two times this layer has been weaponised, it worked.",
  "plain": "Photoresist is photographic film for chips. A wafer is coated with a film thinner than a soap bubble, light shines through a stencil, and the exposed parts dissolve away, leaving a pattern the next machine can etch. A few hundred other gases and liquids deposit, strip and clean around it. All of it must be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why nine tenths of the world's photoresist comes from Japan, and a second source takes years, not weeks.",
  "specimen": "gas-cabinet",
  "specimenCaption": "Right: a specialty gas cabinet and cylinder bundle. Purge and process lines, a double-block-and-bleed panel, excess-flow and pressure sensors, and the point-of-use filter that sits between the cylinder and the process chamber.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "JSR", "country": "JP", "share": "Owner of Inpria's metal-oxide EUV resist; 84% held by Japan's state-backed JIC since April 2024"},
      {"name": "Tokyo Ohka Kogyo", "country": "JP", "share": "Top-five resist maker; ¥139.7bn sales in H1 FY2026"},
      {"name": "Air Liquide", "country": "FR", "share": "€2,465m of electronics revenue in 2025, 9.1% of group sales"},
      {"name": "Entegris", "country": "US", "share": "$3.20bn 2025 revenue in filtration, CMP, delivery and carriers"},
      {"name": "JX Advanced Metals", "country": "JP", "share": "~65% of semiconductor sputtering targets"}
    ],
    "countries": [
      {"code": "JP", "note": "Photoresist, high-purity HF, sputtering targets, CMP slurries"},
      {"code": "US", "note": "Entegris filters and FOUPs, DuPont CMP, Air Products gases"},
      {"code": "FR", "note": "Air Liquide electronics gases and precursors"},
      {"code": "KR", "note": "SK Materials NF3, Dongjin resist, on-site gas for memory fabs"},
      {"code": "CN", "note": "Gallium, germanium and antimony refining; growing wet chemicals and CMP"}
    ],
    "chinaStatus": "Cannot make EUV or leading-edge ArF resist and held under 5% of the photoresist market as of 2021. It refines 99% of the world's primary low-purity gallium and has used export licensing on gallium and germanium since August 2023.",
    "usStatus": "Strong in filtration, containers, CMP and delivery systems through Entegris, DuPont and Air Products. Nearly absent from advanced photoresist since Inpria was bought by JSR.",
    "costSignal": "Wafer fabrication materials were a $45.8bn market in 2025 and packaging materials $27.4bn, $73.2bn between them",
    "substitution": {"years": "3-7", "why": "Formulations are qualified per process per fab and metals impurities are measured in parts per trillion, so a second source takes years of joint development rather than a purchase order."}
  },
  "keyFacts": [
    {"fact": "Japan holds about 90% of world semiconductor photoresist production, and China could not make EUV resists (as of 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
    {"fact": "Japan Investment Corporation's vehicle took 84.36% of JSR at ¥4,350 a share in a tender offer that closed on 16 April 2024", "source": "https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf"},
    {"fact": "The global semiconductor materials market reached $73.2bn in 2025: $45.8bn of wafer fabrication materials and $27.4bn of packaging materials", "source": "https://www.prnewswire.com/news-releases/global-semiconductor-materials-market-revenue-reaches-record-73-2-billion-in-2025--semi-reports-302768700.html"},
    {"fact": "Before the 2022 invasion Ukraine supplied about 70% of the world's neon and 90% of the semiconductor-grade neon used by US industry", "source": "https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production"},
    {"fact": "Japan's 2019 export licensing cut hydrogen fluoride exports to South Korea by 87.9%", "source": "https://www.rieti.go.jp/en/columns/v01_0201.html"},
    {"fact": "JX Advanced Metals holds about 65% of the global market for semiconductor sputtering targets", "source": "https://www.jx-nmm.com/english/company/glance/"},
    {"fact": "China controlled gallium exports from August 2023, banned them to the US in December 2024, and lifted that ban for one year in November 2025; it holds 99% of world primary low-purity gallium production", "source": "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf"},
    {"fact": "Germanium metal averaged $4,100 per kilogram in 2025 against $1,392 in 2023, and US imports of the metal fell 67% in 2025", "source": "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf"}
  ],
  "figures": [
    {
      "id": "resist-country",
      "type": "stack",
      "title": "Semiconductor photoresist production share by country, 2021",
      "unit": "%",
      "data": [["Japan", 90], ["United States, South Korea and others", 10]],
      "source": {"label": "CSET, The Semiconductor Supply Chain", "url": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"}
    },
    {
      "id": "germanium-price",
      "type": "bars",
      "title": "Germanium metal, annual average price ($/kg). China licensed exports from August 2023 and banned US shipments in December 2024",
      "unit": "$/kg",
      "data": [["2021", 1187], ["2022", 1294], ["2023", 1392], ["2024", 1991], ["2025", 4100]],
      "source": {"label": "USGS Mineral Commodity Summaries, February 2026 (Argus Media prices)", "url": "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf"}
    }
  ]
}
---
# Chemicals, Gases and Photoresist

A modern fab is a chemical plant with lithography attached. Air Liquide alone supplies more than 200 molecules and roughly 50,000 cylinders a year ([source](https://www.airliquide.com/group/activities/electronics)). None of it is expensive by the tonne, and all of it stops the line when it is missing.

## How it works

Photoresist is photographic film for chips. A wafer is coated with a film thinner than a soap bubble, light shines through a stencil, and the exposed parts dissolve away, leaving a pattern the next machine can etch. A few hundred other gases and liquids deposit, strip and clean around it. All of it must be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why nine tenths of the world's photoresist comes from Japan, and a second source takes years, not weeks.

Since the 1990s the workhorse has been the chemically amplified resist: one photon releases one acid molecule, which catalyses hundreds of reactions in a post-exposure bake. That lets a wafer be exposed in milliseconds, at 248 nm for KrF and 193 nm for ArF immersion.

Extreme ultraviolet breaks that bargain (see Lithography). A 13.5 nm photon carries about fourteen times the energy of a 193 nm one, so a dose has far fewer of them, and where they land shows up as line-edge roughness and missing contacts. The answer is to absorb more: metal-oxide resists on tin-oxo clusters absorb EUV far better than carbon films, which is why JSR bought Inpria in 2021 ([source](https://www.jsr.co.jp/jsr_e/news/2021/20210917.html)).

Everything else puts material on the wafer, takes it off, or keeps it clean. Bulk gases arrive by the tonne; specialty gases in grams, from silane for deposition to nitrogen trifluoride, cracked in a plasma to strip chamber walls. Hydrofluoric acid cleans, slurries flatten, sputtering targets supply the interconnect metal, filters and carriers keep contamination out.

## Variants and trade-offs

| Resist class | Wavelength | Where it is used | Limit |
|---|---|---|---|
| i-line novolak | 365 nm | Packaging, mature nodes | Resolution |
| KrF chemically amplified | 248 nm | Implant layers, thick films | Resolution |
| ArF immersion CAR | 193 nm | Most critical layers below 28 nm | Needs multipatterning |
| EUV chemically amplified | 13.5 nm | Leading-edge single-exposure layers | Photon shot noise |
| EUV metal-oxide | 13.5 nm | High-NA and tight-pitch layers | Cost, defectivity, outgassing |

Resist classes are not substitutes; each is tied to a scanner and a layer ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

## Who makes it

Japan produced about 90 percent of the world's semiconductor photoresist as of 2021, the rest mostly in the United States and South Korea ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

{{figure:resist-country}}

JSR, which calls itself a global leader in cutting-edge semiconductor materials ([source](https://www.jsr.co.jp/jsr_e/products/em/)), is no longer a normal public company. A vehicle of Japan Investment Corporation, a state-backed fund, took 84.36 percent of its shares at ¥4,350 each in a tender offer that closed on 16 April 2024, and then delisted it ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf)). A government now controls the company that owns Inpria.

Others are expanding on AI demand.

- **Tokyo Ohka Kogyo.** Net sales of ¥139,668 million in the first half of fiscal 2026, up 25.1 percent on AI server demand ([source](https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf)).
- **Fujifilm.** Added 30 percent of CMP slurry capacity at Kumamoto in January 2025 ([source](https://www.fujifilm.com/jp/en/news/hq/11942)) and EUV resist lines at Shizuoka and Pyeongtaek that October ([source](https://www.fujifilm.com/jp/en/news/hq/11842)).

The layer is bigger than it looks: wafer fabrication materials sold $45.8 billion in 2025, packaging materials $27.4 billion ([source](https://www.prnewswire.com/news-releases/global-semiconductor-materials-market-revenue-reaches-record-73-2-billion-in-2025--semi-reports-302768700.html)).

Gases are a Western-led oligopoly: Linde, Air Liquide, Air Products, Nippon Sanso and Messer. Air Liquide's electronics arm alone sold €2,465 million in 2025, 9.1 percent of group revenue ([source](https://www.airliquide.com/group/activities/electronics)). Under them sit single-molecule specialists: SK Materials in nitrogen trifluoride, Kanto Denka in fluorine chemistry, Stella Chemifa and Morita in ultra-high-purity hydrofluoric acid.

The consumables are tighter still. As of 2021 five firms held more than 60 percent of wet chemicals, and DuPont and Cabot Microelectronics about 56 percent of a $790 million CMP slurry market ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The most concentrated item is a metal: JX Advanced Metals holds about 65 percent of the world sputtering-target market ([source](https://www.jx-nmm.com/english/company/glance/)).

## The chokepoint

This layer has been tested twice, and both tests confirmed the theory.

In July 2019 Japan put photoresist, hydrogen fluoride and fluorinated polyimide under individual export licences for South Korea, having supplied more than 90 percent of Korean imports of two of them; hydrogen fluoride exports then fell 87.9 percent ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). No fab stopped, but Korea spent five years funding domestic substitutes, which is what materials controls usually produce.

In 2022 Russia invaded Ukraine, which supplied about 70 percent of the world's neon and 90 percent of the semiconductor-grade neon used by US industry ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). Again no fab stopped. Buyers had stockpiled since the 2014 annexation of Crimea, and Korean and Japanese chipmakers reported adequate neon from China instead ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). One supplier country was swapped for another.

China's own lever is metals, not molecules. Beijing licensed gallium and germanium exports from July 2023, then banned both, plus antimony and superhard materials, to the United States in December 2024 ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)). In November 2025 it lifted the gallium ban for one year ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)).

Be precise: none of this is silicon logic. Germanium goes into fibre optics, infrared optics, solar cells for satellites and radiation detectors ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)); gallium into the compound-semiconductor wafers behind RF front ends, LEDs and lasers ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)). What they gate is price. Germanium metal averaged $4,100 a kilogram in 2025 against $1,392 in 2023, and US imports of the metal fell 67 percent ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)). USGS put the GDP cost of a complete ban at about $3.4 billion ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)).

{{figure:germanium-price}}

The slower risk is regulatory. The five member states behind the EU's PFAS restriction published a revised proposal on 20 August 2025, after working through more than 5,600 comments, and ECHA's committees now back an EU-wide restriction with targeted derogations rather than a flat ban, with the scientific evaluation due to finish by the end of 2026 ([source](https://echa.europa.eu/-/echa-supports-pfas-restriction-with-targeted-derogations)). Photoacid generators, etch gases, chamber liners, pump seals and filter membranes are all fluorinated. A carve-out looks likely, but it is not law yet.

## Key evaluation criteria

- **Purity, in parts per trillion** of metallic contamination, not per million. This is the spec that keeps entrants out.
- **Qualification lock-in**: a resist or slurry is approved per layer per device per fab, so switching costs are counted in tape-outs.
- **Photon efficiency** for EUV resists: absorption sets dose, dose sets throughput, shot noise sets defectivity. That is the case for metal-oxide chemistry.
- **Transportability**: bulk gases are made at the fab fence, and only cylinder-shipped specialty gases can be embargoed.
- **Byproduct exposure**: gallium is recovered mostly from bauxite refining and germanium from zinc concentrates, so supply answers to another industry's economics ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)).

## Takeaways

Photoresist is the sharpest point here: about 90 percent Japanese ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)), with one of the largest suppliers now 84 percent owned by a Japanese state fund ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf)). Individual molecules are far more concentrated than the industry selling them: neon and nitrogen trifluoride come from a handful of plants. China's gallium, germanium and antimony controls are real leverage over compound semiconductors and optics, but not over a silicon GPU, and the gallium suspension runs for one year from November 2025 ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)). Watch the qualification cycle, not the spot price: every disruption so far was absorbed within a year, and each added a second source somewhere.
