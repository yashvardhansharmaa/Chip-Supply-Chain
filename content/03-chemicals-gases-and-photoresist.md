---json
{
 "id": "chemicals-gases-and-photoresist",
 "number": 3,
 "title": "Chemicals, Gases and Photoresist",
 "oneLiner": "A few hundred molecules stand between a blank wafer and a working chip. Japan makes about four-fifths of the photoresist, and the two times this layer has been squeezed, no fab stopped, because the countries hit stockpiled and built substitutes instead.",
 "plain": "Photoresist is a coating that changes wherever light hits it. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, and a liquid wash then takes away the parts the light reached. What remains is a pattern, and the next machine cuts that pattern into the wafer beneath, a step called etching. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in every trillion. Each formula is approved for one factory and one product at a time, and a new supplier has to earn that approval from scratch, so a second source takes years rather than weeks. Nine tenths of the world's photoresist comes from Japan, and no factory can swap it out quickly.",
 "bridge": "A bare disc records nothing, so before any light reaches it the wafer is coated in a chemical that reacts where the beam lands.",
 "specimen": "gas-cabinet",
 "specimenCaption": "A specialty gas cabinet with its door off, and a bulk liquid cylinder standing behind it. The cabinet is about 1 m wide and 1.9 m tall and holds three gas cylinders; drawn to scale. The steel-grey panel on the back wall is the valves, regulator and gauges that control the flow.",
 "card": {
 "concentration": "High",
 "chokepointScore": 4,
 "leaders": [
 {"name": "JSR", "country": "JP", "share": "Owner of Inpria's metal-oxide resist for extreme-ultraviolet printing; 84% held by Japan Investment Corporation, a state-backed fund, since April 2024"},
 {"name": "Tokyo Ohka Kogyo", "country": "JP", "share": "Top-five resist maker; ¥139.7bn of sales in the first half of fiscal 2026"},
 {"name": "Air Liquide", "country": "FR", "share": "€2,465m of electronics revenue in 2025, 9.1% of group sales"},
 {"name": "Entegris", "country": "US", "share": "$3.20bn of 2025 revenue in filters, polishing slurries, gas delivery and wafer carriers"},
 {"name": "JX Advanced Metals", "country": "JP", "share": "About 65% of sputtering targets, the metal slugs that supply chip wiring"}
 ],
 "countries": [
 {"code": "JP", "note": "Photoresist, ultra-pure hydrofluoric acid, sputtering targets, polishing slurries"},
 {"code": "US", "note": "Entegris filters and wafer carriers, DuPont polishing slurries, Air Products gases"},
 {"code": "FR", "note": "Air Liquide electronics gases and precursors"},
 {"code": "KR", "note": "SK Materials nitrogen trifluoride, Dongjin resist, on-site gas for memory fabs"},
 {"code": "CN", "note": "Gallium, germanium and antimony refining; growing wet chemicals and polishing slurries"}
 ],
 "chinaStatus": "Cannot make resist for extreme-ultraviolet or leading-edge 193 nm printing, and held under 5% of the photoresist market as of 2021. It refines 99% of the world's primary low-purity gallium and has licensed exports of gallium and germanium since August 2023.",
 "usStatus": "Strong in filters, containers, polishing slurries and gas delivery through Entegris, DuPont and Air Products. Nearly absent from advanced photoresist since JSR bought Inpria.",
 "costSignal": "Wafer fabrication materials were a $45.8bn market in 2025 and packaging materials $27.4bn, $73.2bn between them",
 "substitutability": {"band": "Moderate", "test": "Rated on the hardest input, photoresist: Japan makes about four-fifths of it, and Korea's substitution took five years", "why": "Each resist formula is approved for one layer of one product at one fab, so a second source is joint development rather than a purchase order. When Japan put resist under individual license for Korea in 2019, Korea kept its fabs running and spent five years funding domestic substitutes, which is the clock a well-funded actor should expect: two to five years, and closer to five at the leading node."}
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

A modern fab is a chemical plant with lithography attached. Air Liquide alone supplies more than 200 molecules and roughly 50,000 cylinders a year ([source](https://www.airliquide.com/group/activities/electronics)). None of it costs much by the metric ton, and any one of them missing stops the line.

## How it works

Photoresist is a coating that changes wherever light hits it. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, and a liquid wash then takes away the parts the light reached. What remains is a pattern, and the next machine cuts that pattern into the wafer beneath, a step called etching. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in every trillion. Each formula is approved for one factory and one product at a time, and a new supplier has to earn that approval from scratch, so a second source takes years rather than weeks. Nine tenths of the world's photoresist comes from Japan, and no factory can swap it out quickly.

The resist has to change only where the light lands, and change fast enough that the scanner, the machine that projects the pattern, can expose each patch of the wafer in milliseconds. Since the 1990s the workhorse has been the chemically amplified resist. Each photon that lands frees one acid molecule inside the film, and nothing more happens until the wafer is baked. In the bake, each acid molecule sets off hundreds of reactions around itself that turn the film soluble, so a little light does a lot of chemistry. The wash then takes away the exposed film and leaves the rest. The light comes at 248 nm from a krypton fluoride laser or 193 nm from an argon fluoride laser shining through a layer of water, which sharpens the image.

Extreme ultraviolet upsets that arrangement (see [Lithography](#lithography)). A 13.5 nm photon carries about fourteen times the energy of a 193 nm one, so the same dose of light arrives as far fewer photons. With fewer photons, where each one happens to land matters, and the luck shows up as ragged line edges and missing contact holes, the small wells that join one layer of wiring to the next. Resist makers answered by absorbing more of the light: metal-oxide resists, built on clusters of tin and oxygen, take up extreme ultraviolet far better than carbon films, which is why JSR bought Inpria in 2021 ([source](https://www.jsr.co.jp/jsr_e/news/2021/20210917.html)).

Everything else puts material on the wafer, takes it off, or keeps it clean. Bulk gases arrive by the metric ton, specialty gases in grams. Silane carries silicon into the chamber for deposition. A plasma tears nitrogen trifluoride into charged fragments, which scrub the chamber walls clean between wafers. Hydrofluoric acid cleans the wafer itself. Polishing slurries grind each new layer flat before the next goes on. Sputtering targets are slabs of pure metal; a plasma knocks atoms off them, and the atoms settle on the wafer as the metal for the wiring. Filters and carriers keep contamination out.

## Variants and trade-offs

| Resist class | Wavelength | Where it is used | Limit |
|---|---|---|---|
| i-line novolak | 365 nm | Packaging, mature nodes | Resolution |
| KrF chemically amplified | 248 nm | Implant layers, thick films | Resolution |
| ArF immersion chemically amplified | 193 nm | Most critical layers below 28 nm | Needs several exposures per layer |
| EUV chemically amplified | 13.5 nm | Leading-edge single-exposure layers | Shot noise from too few photons |
| EUV metal-oxide | 13.5 nm | High-NA tools, tightest pitches | Cost, defects, outgassing |

Each resist class is tied to one scanner and one layer ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

## Who makes it

Japan produced about 90 percent of the world's semiconductor photoresist as of 2021, the rest mostly in the United States and South Korea ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). A later survey by Fuji Keizai, relayed in the December 2025 strategy deck of Japan's Ministry of Economy, Trade and Industry, puts Japan at 78 percent in 2023, the United States at 13 and South Korea at 6, with China inside the small remainder ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)).

{{figure:resist-country}}

A vehicle of Japan Investment Corporation, a state-backed fund, took 84.36 percent of JSR's shares at ¥4,350 each in a tender offer that closed on 16 April 2024, then delisted it ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf)).

Tokyo Ohka Kogyo sold ¥139,668 million in the first half of fiscal 2026, up 25.1 percent on AI server demand ([source](https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf)). Fujifilm lifted its polishing-slurry capacity at Kumamoto by 30 percent in January 2025 ([source](https://www.fujifilm.com/jp/en/news/hq/11942)) and opened extreme-ultraviolet resist lines at Shizuoka and Pyeongtaek that October ([source](https://www.fujifilm.com/jp/en/news/hq/11842)).

Wafer fabrication materials sold $45.8 billion in 2025 and packaging materials $27.4 billion ([source](https://www.prnewswire.com/news-releases/global-semiconductor-materials-market-revenue-reaches-record-73-2-billion-in-2025--semi-reports-302768700.html)).

Gases are a Western-led oligopoly: Linde, Air Liquide, Air Products, Nippon Sanso and Messer. Air Liquide's electronics arm alone sold €2,465 million in 2025, 9.1 percent of group revenue ([source](https://www.airliquide.com/group/activities/electronics)). Under them sit single-molecule specialists: SK Materials in nitrogen trifluoride, Kanto Denka in fluorine chemistry, Stella Chemifa and Morita in ultra-high-purity hydrofluoric acid.

As of 2021 five firms held more than 60 percent of wet chemicals, and DuPont and Cabot Microelectronics about 56 percent of a $790 million market in polishing slurries ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). JX Advanced Metals is tighter than any of them, holding about 65 percent of the world sputtering-target market ([source](https://www.jx-nmm.com/english/company/glance/)).

## The chokepoint

This layer has been squeezed twice since 2019, once by a government and once by a war.

In July 2019 Japan put photoresist, hydrogen fluoride and fluorinated polyimide under individual export licenses for South Korea. It had supplied more than 90 percent of Korean imports of two of the three, and hydrogen fluoride exports fell 87.9 percent ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). Korea kept its fabs running and spent five years funding domestic substitutes, which is what materials controls usually produce.

In 2022 Russia invaded Ukraine, which supplied about 70 percent of the world's neon and 90 percent of the semiconductor-grade neon used by US industry ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). Buyers had stockpiled since the 2014 annexation of Crimea, and Korean and Japanese chipmakers reported adequate neon from China instead ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)).

China's lever is the metals rather than the process chemicals. Beijing announced export licenses for gallium and germanium in July 2023, in force from August, then banned both, plus antimony and superhard materials, to the United States in December 2024 ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)). In November 2025 it lifted the gallium ban for one year ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)).

Neither metal goes into a silicon logic chip. Germanium goes into fiber optics, infrared optics, solar cells for satellites and radiation detectors ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)); gallium into the non-silicon wafers behind radio front ends, LEDs and lasers ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)). They move the price instead. Germanium metal averaged $4,100 a kilogram in 2025 against $1,392 in 2023, and US imports of the metal fell 67 percent ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)). The US Geological Survey put the cost to US GDP of a complete ban at about $3.4 billion ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)).

{{figure:germanium-price}}

The slower risk is the European Union's proposed restriction on PFAS, the long-lived fluorinated chemicals. The five member states behind it published a revised text on 20 August 2025, after working through more than 5,600 comments ([source](https://echa.europa.eu/-/echa-supports-pfas-restriction-with-targeted-derogations)). The committees of ECHA, the EU chemicals agency, now back an EU-wide restriction with targeted exemptions rather than a flat ban, and the scientific evaluation is due to finish by the end of 2026 ([source](https://echa.europa.eu/-/echa-supports-pfas-restriction-with-targeted-derogations)). These chemicals are everywhere in a fab: photoacid generators, etch gases, chamber liners, pump seals and filter membranes are all fluorinated. An exemption is likely, but nothing is law yet.

## Key evaluation criteria

- **Purity, in parts per trillion** of metallic contamination, not per million, which is the spec that keeps entrants out.
- **Qualification lock-in**: a resist or slurry is approved for one layer of one product at one fab, so switching costs are counted in tape-outs.
- **Photon efficiency** for EUV resists: how much light the resist absorbs sets the dose, the dose sets how many wafers an hour the scanner prints, and too few photons per dose set the defect rate, which is the case for metal-oxide chemistry.
- **Transportability**: bulk gases are made at the fab fence, and only cylinder-shipped specialty gases can be embargoed.
- **Byproduct exposure**: gallium is recovered mostly from bauxite refining and germanium from zinc concentrates, so supply answers to another industry's economics ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)).

## Takeaways

Photoresist is the sharpest point here: about 90 percent Japanese in 2021 and 78 percent in 2023 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)) ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)), with one of the largest suppliers now 84 percent owned by a Japanese state fund ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf)). Individual molecules are far more concentrated than the industry selling them: neon and nitrogen trifluoride come from a handful of plants. China's gallium, germanium and antimony controls bite on non-silicon chips and optics but not on a silicon GPU, and the gallium suspension runs for one year from November 2025 ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)). The qualification cycle matters more than the spot price, because every disruption so far was absorbed within a year and each one added a second source somewhere.
