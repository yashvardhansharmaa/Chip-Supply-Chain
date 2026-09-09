---json
{
  "id": "chemicals-gases-and-photoresist",
  "number": 4,
  "title": "Chemicals, Gases and Photoresist",
  "oneLiner": "A few hundred molecules stand between a blank wafer and a working chip. Japan makes about 90% of the photoresist, and the only two times this layer has been weaponised, it worked.",
  "plain": "Photoresist is photographic film for chips. A wafer is coated with a film thinner than a soap bubble, light is shone through a stencil, and the exposed parts dissolve away, leaving a pattern the next machine can etch. Around it flow a few hundred other gases and liquids that deposit, strip and clean. All of it must be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why nine tenths of the world's photoresist comes from Japan, and why a second source takes years, not weeks.",
  "specimen": "gas-cabinet",
  "specimenCaption": "Right: a specialty gas cabinet and cylinder bundle. Purge and process lines, a double-block-and-bleed panel, excess-flow and pressure sensors, and the point-of-use filter that sits between the cylinder and the process chamber.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "JSR", "country": "JP", "share": "~27% of photoresist; owner of Inpria's metal-oxide EUV resist"},
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
    "chinaStatus": "Cannot make EUV or leading-edge ArF resist and held under 5% of the photoresist market as of 2021. It refines most of the world's gallium and germanium and has used export licensing on both since July 2023.",
    "usStatus": "Strong in filtration, containers, CMP and delivery systems through Entegris, DuPont and Air Products. Nearly absent from advanced photoresist since Inpria was bought by JSR.",
    "costSignal": "Wafer fabrication materials were a $45.8bn market in 2025 and packaging materials $27.4bn, $73.2bn between them",
    "substitution": {"years": "3-7", "why": "Formulations are qualified per process per fab and metals impurities are measured in parts per trillion, so a second source takes years of joint development rather than a purchase order."}
  },
  "keyFacts": [
    {"fact": "Japan holds about 90% of world semiconductor photoresist production, and China could not make EUV resists (as of 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
    {"fact": "JSR holds roughly 27% of the photoresist market and was taken private by Japan Investment Corporation for about ¥900 billion in 2024", "source": "https://evertiq.com/news/55596"},
    {"fact": "The global semiconductor materials market reached $73.2bn in 2025: $45.8bn of wafer fabrication materials and $27.4bn of packaging materials", "source": "https://www.prnewswire.com/news-releases/global-semiconductor-materials-market-revenue-reaches-record-73-2-billion-in-2025--semi-reports-302768700.html"},
    {"fact": "Photolithography accounts for roughly 70% of neon demand, and the 2022 Ukraine disruption removed up to 54% of global semiconductor-grade neon supply", "source": "https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/"},
    {"fact": "Japan's 2019 export licensing cut hydrogen fluoride exports to South Korea by 87.9%", "source": "https://www.rieti.go.jp/en/columns/v01_0201.html"},
    {"fact": "JX Advanced Metals holds about 65% of the global market for semiconductor sputtering targets", "source": "https://www.jx-nmm.com/english/company/glance/"},
    {"fact": "China banned gallium, germanium and antimony exports to the US on 3 December 2024 and suspended that ban on 9 November 2025 until 27 November 2026", "source": "https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html"},
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

A modern fab is a chemical plant with lithography attached. Air Liquide alone supplies more than 200 molecules and delivers roughly 50,000 cylinders a year ([source](https://www.airliquide.com/group/activities/electronics)). Almost none of it is expensive by the tonne, and all of it stops the line when it is missing.

## How it works

Photoresist is photographic film for chips. A wafer is coated with a film thinner than a soap bubble, light is shone through a stencil, and the exposed parts dissolve away, leaving a pattern the next machine can etch. Around it flow a few hundred other gases and liquids that deposit, strip and clean. All of it must be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why nine tenths of the world's photoresist comes from Japan, and why a second source takes years, not weeks.

Since the 1990s the workhorse has been the chemically amplified resist: one photon releases one acid molecule, which catalyses hundreds of reactions during a post-exposure bake. Amplification lets a wafer be exposed in milliseconds, at 248 nm for KrF and 193 nm for ArF immersion.

Extreme ultraviolet breaks that bargain (see Lithography). A 13.5 nm photon carries about fourteen times the energy of a 193 nm one, so a given dose has far fewer of them, and where they land shows up as line-edge roughness and missing contacts. The answer is to absorb more: metal-oxide resists built on tin-oxo clusters absorb EUV far better than carbon films, which is why JSR bought Inpria, their pioneer, in 2021 ([source](https://www.jsr.co.jp/jsr_e/news/2021/20210917.html)).

Everything else puts material on the wafer, takes it off, or keeps it clean. Bulk gases arrive by the tonne; specialty gases are dosed in grams, from silane for deposition to nitrogen trifluoride, cracked in a plasma to strip chamber walls between wafers. Hydrofluoric acid cleans, slurries flatten each layer, sputtering targets supply the interconnect metal, and filters and carriers keep contamination out.

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

Japan produces about 90 percent of the world's semiconductor photoresist, the rest mostly in the United States and South Korea (as of 2021) ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

{{figure:resist-country}}

JSR is the largest single supplier, at about 27 percent of the market on trade-press estimates, and no longer a normal public company: Japan Investment Corporation, a state-backed fund, took more than 84 percent of its shares in 2024 for roughly ¥900 billion and delisted it ([source](https://evertiq.com/news/55596)). A government owns the world's biggest photoresist maker.

The rest of the field is expanding on AI demand.

- **Tokyo Ohka Kogyo.** Net sales of ¥139,668 million in the first half of fiscal 2026, up 25.1 percent, on demand for AI server chips ([source](https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf)).
- **Fujifilm.** Added 30 percent of CMP slurry capacity at Kumamoto in January 2025 ([source](https://www.fujifilm.com/jp/en/news/hq/11942)) and EUV resist lines at Shizuoka and Pyeongtaek in October 2025 ([source](https://www.fujifilm.com/jp/en/news/hq/11842)).
- **Shin-Etsu Chemical.** A photoresist plant at Isesaki opens in April 2026 ([source](https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260127_con_E.pdf)).

The layer is bigger than it looks: wafer fabrication materials sold $45.8 billion in 2025, packaging materials $27.4 billion ([source](https://www.prnewswire.com/news-releases/global-semiconductor-materials-market-revenue-reaches-record-73-2-billion-in-2025--semi-reports-302768700.html)).

Gases are a Western-led oligopoly: Linde, Air Liquide, Air Products, Nippon Sanso and Messer. Air Liquide's electronics arm alone sold €2,465 million in 2025, 9.1 percent of group revenue ([source](https://www.airliquide.com/group/activities/electronics)). Under them sit single-molecule specialists: SK Materials in nitrogen trifluoride, Kanto Denka in fluorine chemistry, Stella Chemifa and Morita in ultra-high-purity hydrofluoric acid.

The consumables are tighter still. As of 2021, five firms held more than 60 percent of wet chemicals, and DuPont and Cabot Microelectronics about 56 percent of a $790 million CMP slurry market ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The most concentrated item is a metal: JX Advanced Metals holds about 65 percent of the world market for sputtering targets ([source](https://www.jx-nmm.com/english/company/glance/)).

## The chokepoint

This layer has been tested twice, and both tests confirmed the theory.

In July 2019 Japan moved photoresist, hydrogen fluoride and fluorinated polyimide from bulk to individual export licences for South Korea, after supplying more than 90 percent of Korean imports of two of them. Hydrogen fluoride exports fell 87.9 percent ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). No fab stopped, but Korea spent five years funding domestic substitutes, which is what materials controls usually produce.

In 2022 Russia invaded Ukraine, which supplied about 70 percent of the world's neon and 90 percent of the semiconductor-grade neon used by US industry ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). Again no fab stopped. The lasting consequence is that China now runs more than 40 percent of global air separation capacity, on one specialist analyst's count ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

China's own lever is metals, not molecules. Beijing licensed gallium and germanium exports from 3 July 2023, then banned gallium, germanium, antimony and superhard materials to the United States outright on 3 December 2024 ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)). On 9 November 2025 it suspended that ban until 27 November 2026, keeping it for US military end users ([source](https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html)).

Be precise about what that touches: not silicon logic. Gallium goes into gallium nitride and arsenide for radar, RF front ends and power conversion; germanium into infrared optics, fibre and high-speed analogue; antimony is a dopant. None gates an AI accelerator directly. They gate price instead: germanium metal averaged $4,100 a kilogram in 2025 against $1,392 in 2023, and US imports fell 67 percent ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)). USGS put the GDP cost of a complete ban at about $3.4 billion ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)).

{{figure:germanium-price}}

The slower risk is regulatory. The EU's PFAS dossier was revised on 20 August 2025 to add a risk-based option judged proportionate for electronics, with a decision likely in 2027 and effect from late 2028 ([source](https://www.kirkland.com/publications/kirkland-alert/2025/10/pfas-update-scrapping-prior-broader-proposal-eu-publishes-updated-narrower-proposal-to-restrict-the)). Photoacid generators, etch gases, chamber liners, pump seals and filter membranes are all fluorinated. A carve-out is likely, but it is not law yet.

## Key evaluation criteria

- **Purity, in parts per trillion** of metallic contamination, not parts per million. This is the specification that keeps entrants out.
- **Qualification lock-in**, because a resist or slurry is approved per layer per device per fab, so switching costs are counted in tape-outs.
- **Photon efficiency** for EUV resists, where absorption sets dose, dose sets throughput and shot noise sets defectivity. That is the case for metal-oxide chemistry.
- **Transportability**, since bulk gases are made at the fab fence and only cylinder-shipped specialty gases can be embargoed.
- **Byproduct exposure**, where neon depends on steel oxygen plants and gallium and germanium on aluminium and zinc refining, so supply answers to another industry ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

## Takeaways

Photoresist is the sharpest point here: about 90 percent Japanese, with the largest supplier owned by a Japanese state fund ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)) ([source](https://evertiq.com/news/55596)). Individual molecules are far more concentrated than the industry that sells them; neon and nitrogen trifluoride come from a handful of plants. China's gallium, germanium and antimony controls are real leverage over compound semiconductors and optics but do not reach a silicon GPU, and the suspension runs only to 27 November 2026 ([source](https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html)). Watch the qualification cycle, not the spot price: every disruption so far was absorbed within a year, and each one permanently added a second source somewhere.
