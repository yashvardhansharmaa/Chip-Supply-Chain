---json
{
 "id": "chemicals-gases-and-photoresist",
 "number": 3,
 "title": "Chemicals, Gases and Photoresist",
 "oneLiner": "A few hundred chemicals separate a blank wafer from a working chip. Japanese companies held 78 percent of world photoresist sales in 2023. Supply has been disrupted twice since 2019, and both times buyers turned to stockpiles, other suppliers or local production.",
 "plain": "Photoresist is a coating that changes wherever light hits it. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, and a liquid wash then takes away the parts the light reached. What remains is a pattern, and the next machine cuts that pattern into the wafer beneath, a step called etching. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in every trillion. Each formula is approved for one factory and one product at a time, and a new supplier has to earn that approval from scratch, so a second source takes years. Japanese companies held 78 percent of world photoresist sales in 2023, and no factory can swap it out quickly.",
 "bridge": "A bare disc records nothing, so before any light reaches it the wafer is coated in a chemical that reacts where the beam lands.",
 "specimen": "gas-cabinet",
 "specimenCaption": "A specialty gas cabinet with its door off, and a bulk liquid cylinder standing behind it. The cabinet is about 1 m wide and 1.9 m tall and holds three gas cylinders; drawn to scale. The steel-gray panel on the back wall is the valves, regulator and gauges that control the flow.",
 "card": {
 "concentration": "High",
 "chokepointScore": 4,
 "leaders": [
 {"name": "JSR", "country": "JP", "share": "Owner of Inpria, a maker of metal-oxide resist for extreme-ultraviolet printing; a Japan Investment Corporation vehicle took 84.36% in an April 2024 tender offer"},
 {"name": "Tokyo Ohka Kogyo", "country": "JP", "share": "Resist maker; ¥139,668m of sales in the first half of fiscal 2026"},
 {"name": "Air Liquide", "country": "FR", "share": "€2,465m of electronics revenue in 2025, 9.1% of group sales"},
 {"name": "Entegris", "country": "US", "share": "$3,196.6m of 2025 net sales; makes filters, polishing slurries, gas delivery systems and wafer carriers"},
 {"name": "JX Advanced Metals", "country": "JP", "share": "About 65% of sputtering targets, the metal plates that chip wiring is made from"}
 ],
 "countries": [
 {"code": "JP", "note": "Photoresist, ultra-pure hydrofluoric acid, sputtering targets, polishing slurries"},
 {"code": "US", "note": "Entegris filters and wafer carriers, DuPont polishing slurries, Air Products gases"},
 {"code": "FR", "note": "Air Liquide electronics gases and precursors"},
 {"code": "KR", "note": "SK Materials nitrogen trifluoride, Dongjin resist, on-site gas for memory fabs"},
 {"code": "CN", "note": "Gallium, germanium and antimony refining; growing wet chemicals and polishing slurries"}
 ],
 "chinaStatus": "As of January 2021, CSET found that China made no photoresist for extreme-ultraviolet printing and was still developing resist for 193 nm printing. It held under 5 percent of the photoresist market. It accounts for 99 percent of world production of primary low-purity gallium. Since August 2023 it has required licenses to export gallium and germanium.",
 "usStatus": "American firms are strong in filters, containers, polishing slurries and gas delivery: Entegris, DuPont and Air Products. In photoresist, American companies ranked a distant second to Japanese companies by sales in 2023, and in 2021 JSR of Japan agreed to buy Inpria, an Oregon maker of resist for extreme ultraviolet.",
 "costSignal": "Wafer fabrication materials were a $45.8bn market in 2025 and packaging materials $27.4bn, $73.2bn in total",
 "substitutability": {"band": "Moderate", "test": "Rated on photoresist, the hardest input in this stage, where Japanese companies held 78 percent of world sales in 2023.", "why": "Photoresist is the light-sensitive coating that holds the printed pattern on the wafer. Each formula is approved for one layer of one product at one fab. A new supplier therefore has to develop its version together with the fab, one layer at a time. Korea shows how buyers respond to a cut. When Japan required individual export licenses for resist and two other chemicals in 2019, Korea imported more from the United States, Taiwan and Belgium, and production of the three chemicals rose inside South Korea. Japanese resist exports to Korea did not fall, possibly in part because Japan allowed three-year bulk licenses for some resist sales in December 2019."}
 },
 "keyFacts": [
 {"fact": "CSET's January 2021 brief gave Japan 90% of the semiconductor photoresist market and found that China could not make EUV resists", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
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
 "title": "Photoresist sales share by company nationality, 2023",
 "unit": "%",
 "data": [["Japanese companies", 78], ["US, South Korean and other companies", 22]],
 "source": {"label": "METI, December 2025, from Fuji Keizai data", "url": "https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf"}
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

A modern fab is a chemical plant with lithography attached. Air Liquide alone supplies more than 200 molecules and roughly 50,000 cylinders a year ([source](https://www.airliquide.com/group/activities/electronics)). A shortage of any one of them can stop a fab.

## How it works

Photoresist is a coating that changes wherever light hits it. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, and a liquid wash then takes away the parts the light reached. What remains is a pattern, and the next machine cuts that pattern into the wafer beneath, a step called etching. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in every trillion. Each formula is approved for one factory and one product at a time, and a new supplier has to earn that approval from scratch, so a second source takes years. Japanese companies held 78 percent of world photoresist sales in 2023, and no factory can swap it out quickly ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)).

The resist has to change only where the light lands, and change fast enough that the scanner, the machine that projects the pattern, can expose each patch of the wafer in milliseconds. Since the 1990s the standard resist has been the chemically amplified resist. Each photon that lands frees one acid molecule inside the film, and nothing more happens until the wafer is baked. In the bake, each acid molecule sets off hundreds of reactions around itself that turn the film soluble, so a little light does a lot of chemistry. The wash then takes away the exposed film and leaves the rest. The light comes at 248 nm from a krypton fluoride laser or 193 nm from an argon fluoride laser shining through a layer of water, which sharpens the image.

That chemistry works less well with extreme ultraviolet (see [Lithography](#lithography)). A 13.5 nm photon carries about fourteen times the energy of a 193 nm one, so the same dose of light arrives as far fewer photons. With fewer photons, where each one happens to land matters, and that randomness shows up as ragged line edges and missing contact holes, the small wells that join one layer of wiring to the next. Resist makers answered with metal-oxide resists, built on clusters with a tin-oxide core, which absorb more of the extreme ultraviolet light than chemically amplified resists ([source](https://www.inpria.com/)). In 2021 JSR agreed to buy Inpria, an Oregon maker of these resists ([source](https://www.jsr.co.jp/jsr_e/news/2021/20210917.html)).

Everything else puts material on the wafer, takes it off, or keeps it clean. Bulk gases arrive by the metric ton, specialty gases in grams. Silane carries silicon into the chamber for deposition. A plasma tears nitrogen trifluoride into charged fragments, which scrub the chamber walls clean between wafers. Hydrofluoric acid cleans the wafer itself. Polishing slurries grind each new layer flat before the next goes on. Sputtering targets are slabs of pure metal; a plasma knocks atoms off them, and the atoms settle on the wafer as the metal for the wiring. Filters and carriers keep contamination out.

## Variants and trade-offs

| Resist class | Wavelength | Where it is used | Limit |
|---|---|---|---|
| i-line novolak | 365 nm | Packaging, mature nodes | Resolution |
| KrF chemically amplified | 248 nm | Implant layers, thick films | Resolution |
| ArF immersion chemically amplified | 193 nm | Most critical layers below 28 nm | Needs several exposures per layer |
| EUV chemically amplified | 13.5 nm | Leading-edge single-exposure layers | Shot noise from too few photons |
| EUV metal-oxide | 13.5 nm | High-NA tools, tightest pitches | Cost, defects, outgassing |

Each resist class is specific to one kind of lithography, such as EUV, ArF immersion, ArF, KrF or i-line ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

## Who makes it

CSET's January 2021 brief gave Japan 90 percent of the semiconductor photoresist market, with the rest largely held by US and South Korean firms ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). A separate Fuji Keizai survey, relayed in the December 2025 strategy deck of Japan's Ministry of Economy, Trade and Industry, measures sales by company nationality and puts Japanese companies at 77 percent in 2021 and 78 percent in 2023, with American and South Korean companies next ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)).

{{figure:resist-country}}

A vehicle of Japan Investment Corporation, a state-backed fund, took 84.36 percent of JSR's shares at ¥4,350 each in a tender offer that closed on 16 April 2024 ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf)). JSR's shares were delisted from the Tokyo Stock Exchange on 25 June 2024 ([source](https://www.jsr.co.jp/jsr_e/news/assets/pdf/20240624_01_e.pdf)).

Tokyo Ohka Kogyo sold ¥139,668 million in the first half of fiscal 2026, up 25.1 percent, as strong demand for AI servers in data centers raised demand for chips ([source](https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf)). Fujifilm planned to raise its polishing-slurry capacity at Kumamoto by about 30 percent from January 2025 ([source](https://www.fujifilm.com/jp/en/news/hq/11942)). It also scheduled new production and quality-evaluation equipment for extreme-ultraviolet resist at Shizuoka and Pyeongtaek to start in October 2025 ([source](https://www.fujifilm.com/jp/en/news/hq/11842)).

Wafer fabrication materials sold $45.8 billion in 2025 and packaging materials $27.4 billion ([source](https://www.prnewswire.com/news-releases/global-semiconductor-materials-market-revenue-reaches-record-73-2-billion-in-2025--semi-reports-302768700.html)).

In electronic gases, CSET named Merck, Air Products and Air Liquide as the market leaders in January 2021 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Air Liquide's electronics arm alone sold €2,465 million in 2025, 9.1 percent of group revenue ([source](https://www.airliquide.com/group/activities/electronics)). Smaller firms specialize in single molecules: SK Materials in nitrogen trifluoride, Kanto Denka in fluorine chemistry, Stella Chemifa and Morita in ultra-high-purity hydrofluoric acid.

As of 2021 five firms held more than 60 percent of wet chemicals, and DuPont and Cabot Microelectronics about 56 percent of a $790 million market in polishing slurries ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). In sputtering targets for semiconductors, JX Advanced Metals puts its own share of the world market at about 65 percent as of fiscal 2026 ([source](https://www.jx-nmm.com/english/company/glance/)).

## The chokepoint

Supply at this stage has been disrupted twice since 2019, once by a government and once by a war.

In July 2019 Japan put photoresist, hydrogen fluoride and fluorinated polyimide under individual export licenses for South Korea. It had supplied more than 90 percent of Korean imports of two of the three, and hydrogen fluoride exports fell 87.9 percent ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). Japanese photoresist exports to Korea did not fall, possibly in part because Japan allowed three-year bulk licenses for some resist sales in December 2019 ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). South Korea bought more hydrogen fluoride from the United States and Taiwan and more photoresist from Belgium, and production of all three chemicals rose inside the country ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)).

In 2022 Russia invaded Ukraine, which supplied about 70 percent of the world's neon and 90 percent of the semiconductor-grade neon used by US industry ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). Many chipmakers had added to their gas stockpiles after Russia annexed Crimea in 2014, and Samsung, SK Hynix, Renesas and Rohm reported adequate neon supplies from China ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)).

China's export controls fall on the metals. Beijing announced export licenses for gallium and germanium on 3 July 2023, in force from 1 August ([source](https://www.mofcom.gov.cn/zcfb/dwmygl/art/2023/art_52b9a321087f402bb3d310d18b07967e.html)). On 3 December 2024 it said it would in principle grant no licenses to export gallium, germanium, antimony or superhard materials to the United States ([source](https://www.mofcom.gov.cn/zwgk/zcfb/art/2024/art_3d5e990b43424e60828030f58a547b60.html)). In November 2025 it lifted the gallium ban for one year ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)).

In the United States, germanium goes mainly into fiber optics, infrared optics, semiconductors and solar cells, and radiation detectors ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)). Of the gallium used in the United States, 73 percent went into integrated circuits built on gallium arsenide or gallium nitride, and 26 percent into optoelectronic devices such as LEDs and laser diodes ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)). Germanium metal averaged $4,100 a kilogram in 2025 against $1,392 in 2023, and US imports of the metal fell 67 percent in 2025 because of China's ban ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)). The US Geological Survey estimated that a total Chinese ban on gallium and germanium exports could cut US GDP by $3.4 billion ([source](https://www.usgs.gov/news/national-news-release/usgs-critical-minerals-study-bans-gallium-and-germanium-exports-could)).

{{figure:germanium-price}}

The slower risk is the European Union's proposed restriction on PFAS, the long-lived fluorinated chemicals. The five national authorities behind it, from Denmark, Germany, the Netherlands, Norway and Sweden, evaluated more than 5,600 comments and updated the proposal, which ECHA, the EU chemicals agency, published on 20 August 2025 ([source](https://echa.europa.eu/-/echa-publishes-updated-pfas-restriction-proposal)). In March 2026 ECHA's two scientific committees backed an EU-wide restriction with targeted derogations, one in a final opinion and one in a draft, and their evaluation is due to finish by the end of 2026 ([source](https://echa.europa.eu/-/echa-supports-pfas-restriction-with-targeted-derogations)). These chemicals are everywhere in a fab: photoacid generators, etch gases, chamber liners, pump seals and filter membranes are all fluorinated. The updated proposal assessed options that would let electronics and semiconductor makers keep using PFAS where the risks can be controlled, and the European Commission will decide in consultation with the member states ([source](https://echa.europa.eu/-/echa-publishes-updated-pfas-restriction-proposal)).

## Key evaluation criteria

- **Purity, in parts per trillion** of metallic contamination, a million times finer than parts per million, which is the spec that keeps entrants out.
- **Qualification lock-in**: a resist or slurry is approved for one layer of one product at one fab, so switching costs are counted in tape-outs.
- **Photon efficiency** for EUV resists: how much light the resist absorbs sets the dose, the dose sets how many wafers an hour the scanner prints, and too few photons per dose set the defect rate, which is the case for metal-oxide chemistry.
- **Transportability**: bulk gases are often made on site at the fab, while specialty gases travel in cylinders and can be embargoed.
- **Byproduct exposure**: gallium is recovered mostly as a byproduct of processing bauxite ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)). Germanium comes from certain zinc ores and coal deposits, so supply of both depends on another industry's economics ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf)).

## Takeaways

Photoresist is the light-sensitive coating that carries a chip's pattern onto the wafer, and Japanese companies held 78 percent of world sales of it in 2023 ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)). When Japan put photoresist and two other chemicals under export licenses for South Korea in 2019, Korea bought more from other countries, and production of the chemicals rose inside South Korea ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). China restricts exports of gallium, a metal used in lasers, LEDs and some specialized chips, and in November 2025 it lifted its ban on sales to the United States for one year ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf)).
