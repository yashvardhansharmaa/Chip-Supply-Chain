---json
{
  "id": "chemicals-gases-and-photoresist",
  "number": 4,
  "title": "Chemicals, Gases and Photoresist",
  "oneLiner": "A few hundred molecules stand between a blank wafer and a working chip. Japan makes about 90% of the photoresist, and the only two times this layer has been weaponised, it worked.",
  "specimen": "gas-cabinet",
  "specimenCaption": "Right: a specialty gas cabinet and cylinder bundle. Purge and process lines, a double-block-and-bleed panel, excess-flow and pressure sensors, and the point-of-use filter that sits between the cylinder and the process chamber.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "JSR", "country": "JP", "share": "~27% of photoresist; owner of Inpria's metal-oxide EUV resist"},
      {"name": "Tokyo Ohka Kogyo", "country": "JP", "share": "Top-five resist maker; ¥139.7bn sales in H1 FY2026"},
      {"name": "Air Liquide", "country": "FR", "share": "16.5% of high-purity specialty gases in 2025; €2,465m electronics revenue"},
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
    "costSignal": "Advanced-lithography photoresist chemicals were a $6.1bn market in 2025; high-purity specialty gases were $12.1bn",
    "substitution": {"years": "3-7", "why": "Formulations are qualified per process per fab and metals impurities are measured in parts per trillion, so a second source takes years of joint development rather than a purchase order."}
  },
  "keyFacts": [
    {"fact": "Japan holds about 90% of world semiconductor photoresist production, and China could not make EUV resists (as of 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
    {"fact": "JSR holds roughly 27% of the photoresist market and was taken private by Japan Investment Corporation for about ¥900 billion in 2024", "source": "https://evertiq.com/news/55596"},
    {"fact": "Linde 18.8%, Air Liquide 16.5%, Air Products 8.4%, Taiyo Nippon Sanso 6.1% and Messer 4.1% of high-purity specialty gases in 2025", "source": "https://www.gminsights.com/industry-analysis/high-purity-specialty-gases-market"},
    {"fact": "Photolithography accounts for roughly 70% of neon demand, and the 2022 Ukraine disruption removed up to 54% of global semiconductor-grade neon supply", "source": "https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/"},
    {"fact": "Japan's 2019 export licensing cut hydrogen fluoride exports to South Korea by 87.9%", "source": "https://www.rieti.go.jp/en/columns/v01_0201.html"},
    {"fact": "JX Advanced Metals holds about 65% of the global market for semiconductor sputtering targets", "source": "https://www.jx-nmm.com/english/company/glance/"},
    {"fact": "China banned gallium, germanium and antimony exports to the US on 3 December 2024 and suspended that ban on 9 November 2025 until 27 November 2026", "source": "https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html"},
    {"fact": "Germanium traded at $8,597.50 per kilogram in September 2026, up from $4,120.80 at the start of 2025", "source": "https://strategicmetalsinvest.com/germanium-prices/"}
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
      "id": "gas-share",
      "type": "stack",
      "title": "High-purity specialty gas revenue share, 2025",
      "unit": "%",
      "data": [["Linde", 18.8], ["Air Liquide", 16.5], ["Air Products", 8.4], ["Taiyo Nippon Sanso", 6.1], ["Messer", 4.1], ["All others", 46.1]],
      "source": {"label": "Global Market Insights, high-purity specialty gases", "url": "https://www.gminsights.com/industry-analysis/high-purity-specialty-gases-market"}
    }
  ]
}
---
# Chemicals, Gases and Photoresist

A modern fab is a chemical plant with lithography attached. Air Liquide alone supplies the industry with more than 200 different molecules and delivers roughly 50,000 cylinders of specialty materials a year ([source](https://www.airliquide.com/group/activities/electronics)). Almost none of it is expensive by the tonne. All of it stops the line when it is missing, which is exactly why this layer has been used as a weapon twice in seven years.

## How it works

Photoresist is a polymer film, spun onto the wafer a few tens of nanometres thick, that changes solubility where light hits it. Since the 1990s the workhorse chemistry has been the chemically amplified resist. A photoacid generator absorbs a photon and releases an acid, and that single acid molecule then catalyses hundreds of deprotection reactions in the surrounding polymer during a post-exposure bake. Amplification is what makes a resist sensitive enough to expose a wafer in milliseconds rather than seconds, at 248 nm for KrF and 193 nm for ArF and ArF immersion.

Extreme ultraviolet breaks the bargain (see Lithography). At 13.5 nm each photon carries about fourteen times the energy of a 193 nm photon, so a given dose has far fewer photons, and the statistics of where they land show up as line-edge roughness and random missing contacts. The industry's answer has been to raise the resist's absorption. Metal-oxide resists, built on tin-oxo clusters rather than organic polymers, absorb EUV far more strongly than carbon-based films and are the reason JSR bought Inpria for roughly $514 million in 2021 ([source](https://en.tmt-blog.jp/articles/company-jsr-en)).

Everything else here exists to put material on the wafer, take it off, or keep it clean. Bulk gases such as nitrogen, argon, hydrogen and helium are piped in by the tonne. Specialty gases are dosed in grams: silane and tungsten hexafluoride for deposition, fluorocarbons for etch, and nitrogen trifluoride, cracked in a plasma to release fluorine atoms that strip silicon, oxide, nitride and tungsten deposits off chamber walls between wafers ([source](https://www.factmr.com/report/nitrogen-trifluoride-market)). Wet chemicals do the cleaning and the oxide strips, with high-purity hydrofluoric acid at the centre. Chemical mechanical planarisation flattens each layer with an abrasive slurry against a polyurethane pad. Sputtering targets are the metal source for the interconnect. Filters, valves and wafer carriers keep parts-per-trillion contamination out of all of it.

## Variants and trade-offs

| Resist class | Wavelength | Where it is used | Limit |
|---|---|---|---|
| i-line novolak | 365 nm | Packaging, mature nodes | Resolution |
| KrF chemically amplified | 248 nm | Implant layers, thick films | Resolution |
| ArF immersion CAR | 193 nm | Most critical layers below 28 nm | Needs multipatterning |
| EUV chemically amplified | 13.5 nm | Leading-edge single-exposure layers | Photon shot noise |
| EUV metal-oxide | 13.5 nm | High-NA and tight-pitch layers | Cost, defectivity, outgassing |

Resist classes are not substitutes for one another; each is tied to a scanner and a layer ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

The same split runs through the gases. Bulk gases are made on site next to the fab and travel badly. Specialty gases are made in a handful of plants and shipped worldwide in cylinders, which is what makes them interruptible. Neon sits at the extreme: it is present in air at roughly one part in 65,000 and is recovered as a by-product of large-scale oxygen production at steel mills, so its supply is set by the steel industry, not by semiconductors ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

## Who makes it

Japan dominates production of semiconductor photoresists with 90 percent market share, with the remainder largely held by US and South Korean firms (as of 2021) ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

{{figure:resist-country}}

JSR is the largest single supplier at about 27 percent of the photoresist market, and it is no longer a normal public company ([source](https://evertiq.com/news/55596)). Japan Investment Corporation, a state-backed fund, acquired more than 84 percent of JSR's shares between 19 March and 16 April 2024 in a deal worth roughly ¥900 billion, and JSR was delisted ([source](https://evertiq.com/news/55596)). A government now owns the world's biggest photoresist maker outright.

The rest of the field is expanding fast on AI demand. Tokyo Ohka Kogyo reported net sales of ¥139,668 million in the first half of fiscal 2026, up 25.1 percent, with operating income up 45.4 percent, and attributed the increase to demand for semiconductors used in AI servers ([source](https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf)). Its Electronic Functional Materials line, which contains the resists, grew 27.5 percent to ¥74,155 million ([source](https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf)). Shin-Etsu Chemical, which sells resist alongside wafers and mask blanks, is opening a new photoresist-focused plant at Isesaki in April 2026 ([source](https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260127_con_E.pdf)). Fujifilm completed a Kumamoto expansion in June 2025 that raised its EUV resist capacity by 30 percent, next door to TSMC's Japanese fab ([source](https://www.gminsights.com/industry-analysis/photoresist-chemicals-for-advanced-lithography-market)). The advanced-lithography resist market was $6.1 billion in 2025, with JSR above 22 percent and the top five, JSR, TOK, Fujifilm, Shin-Etsu and Dongjin Semichem, holding about half ([source](https://www.gminsights.com/industry-analysis/photoresist-chemicals-for-advanced-lithography-market)).

Gases are a Western-led oligopoly. In 2025 Linde held 18.8 percent of high-purity specialty gases, Air Liquide 16.5 percent, Air Products 8.4 percent, Taiyo Nippon Sanso 6.1 percent and Messer 4.1 percent, with the top five at 53.9 percent of a $12.1 billion market ([source](https://www.gminsights.com/industry-analysis/high-purity-specialty-gases-market)).

{{figure:gas-share}}

Air Liquide's electronics business alone booked €2,465 million of revenue in 2025, 9.1 percent of the group ([source](https://www.airliquide.com/group/activities/electronics)). Korean and Japanese specialists sit underneath them in single molecules: SK Materials in nitrogen trifluoride, Kanto Denka in fluorine chemistry, and Taiyo Nippon Sanso across the Japanese fab base. The NF3 market is forecast at $3.11 billion in 2026 ([source](https://www.factmr.com/report/nitrogen-trifluoride-market)).

The consumables underneath are more concentrated than the gases. As of 2021, more than 60 percent of the wet chemicals market was held by five firms, and the CMP slurry market was $790 million, with DuPont and Cabot Microelectronics together at about 56 percent ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). CMP pads were an even tighter $1.7 billion market where DuPont held 78 percent as of 2014 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Ultra-high-purity hydrofluoric acid is a roughly $1.15 billion market in 2026 whose key producers include Stella Chemifa and Morita of Japan, Honeywell, and Solvay's Chinese joint venture ([source](https://www.businessresearchinsights.com/market-reports/ultra-high-purity-hydrofluoric-acid-market-107517)).

Entegris spans the unglamorous middle: CMP slurries and pads, deposition precursors and specialty gas delivery in one segment, and liquid filtration, gas purification, fluid handling and 300 mm FOUPs in the other ([source](https://www.sec.gov/Archives/edgar/data/1101302/000110130226000012/entg-20251231.htm)). It turned over $3,196.6 million in 2025, split $1,406.7 million in Materials Solutions and $1,799.1 million in Advanced Purity Solutions, and spent 10.3 percent of sales on R&D ([source](https://investor.entegris.com/news/news-details/2026/Entegris-Reports-Results-for-Fourth-Quarter-of-2025/default.aspx)) ([source](https://www.sec.gov/Archives/edgar/data/1101302/000110130226000012/entg-20251231.htm)). Sputtering targets are the most concentrated item in the whole chapter: JX Advanced Metals reports about 65 percent of the global market for semiconductor sputtering targets, plus about 80 percent of rolled copper foil for flexible circuits and about 50 percent of high-purity tantalum powder ([source](https://www.jx-nmm.com/english/company/glance/)). It listed on the Tokyo Stock Exchange on 19 March 2025 ([source](https://asia.nikkei.com/business/markets/ipo/fresh-from-ipo-japan-s-jx-advanced-metals-aims-for-new-start-as-chip-sector-stock)).

## The chokepoint

This layer has been tested twice, and both tests confirmed the theory.

In July 2019 Japan moved photoresist, hydrogen fluoride and fluorinated polyimide from bulk to individual export licences for South Korea ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). Japanese firms supplied more than 90 percent of Korean imports of two of the three ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). Hydrogen fluoride exports to Korea fell 87.9 percent ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). No fab stopped, but Korea spent the following five years funding domestic substitutes, which is the outcome export controls on materials usually produce.

Then in 2022 Russia invaded Ukraine, where more than half of world neon purification capacity sat, removing up to 54 percent of global semiconductor-grade supply ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)). Ukraine had been supplying about 70 percent of the world's neon and 90 percent of the semiconductor-grade neon used by US industry, and Chinese neon went from roughly $63 per cubic metre in October 2021 to about $252 in February 2022 ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). Again no fab stopped, because excimer lasers had been re-engineered to use less neon after a smaller 2014 shock in which prices rose 600 percent ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). The structural consequence is that China now operates more than 40 percent of global air separation capacity and is scaling purification aggressively ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

China's own lever is metals, not molecules. Beijing put gallium and germanium exports under licence on 3 July 2023, then banned exports of gallium, germanium, antimony and superhard materials to the United States outright on 3 December 2024 under Announcement No. 46 ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)) ([source](https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html)). On 9 November 2025 it suspended that ban until 27 November 2026, while keeping the prohibition on dual-use exports to US military end users in force ([source](https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html)).

Be precise about what this touches, because it is not silicon logic. Gallium goes into gallium nitride and gallium arsenide, which matter for RF front ends, radar and power conversion, not into a GPU die. Germanium goes into silicon-germanium for high-speed analogue, into infrared optics and fibre, and into space solar cells. Antimony is an n-type dopant for silicon and a flame-retardant feedstock. None of them gates an AI accelerator directly. What they gate is price and lead time on the equipment around it. Germanium traded at $8,597.50 per kilogram in September 2026, against $4,120.80 at the start of 2025 ([source](https://strategicmetalsinvest.com/germanium-prices/)). Even under the ban, the US still received about 26 percent of its germanium imports and 8 percent of its gallium imports from China in 2024, and USGS put the GDP cost of a complete ban at about $3.4 billion ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)).

The slower risk is regulatory. The EU's PFAS restriction dossier, filed in January 2023 by five member states, was revised on 20 August 2025 to add a risk-based option judged proportionate for electronics and semiconductors, along with new derogations for fluoropolymer manufacture and use ([source](https://www.kirkland.com/publications/kirkland-alert/2025/10/pfas-update-scrapping-prior-broader-proposal-eu-publishes-updated-narrower-proposal-to-restrict-the)). A Commission decision is likely in 2027 with effect from late 2028 or 2029 ([source](https://www.kirkland.com/publications/kirkland-alert/2025/10/pfas-update-scrapping-prior-broader-proposal-eu-publishes-updated-narrower-proposal-to-restrict-the)). Photoacid generators, etch gases, chamber liners, pump seals and filter membranes are all fluorinated. A carve-out is likely. It is not yet law.

## Key evaluation criteria

- **Purity, in parts per trillion** of metallic contamination, not parts per million. This is the specification that keeps entrants out, and it is why a second source is a multi-year joint development.
- **Qualification lock-in**, because a resist or slurry is approved per layer per device per fab, so switching costs are measured in tape-outs rather than purchase orders.
- **Photon efficiency** for EUV resists, where absorption sets the dose, dose sets scanner throughput, and shot noise sets defectivity, which is the whole case for metal-oxide chemistry ([source](https://en.tmt-blog.jp/articles/company-jsr-en)).
- **Transportability**, since bulk gases are made at the fab fence and specialty gases ship in cylinders, and only the second kind can be embargoed.
- **Byproduct exposure**, where neon depends on steel oxygen plants and gallium and germanium on aluminium and zinc refining, so supply responds to another industry's economics ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

## Takeaways

Photoresist is the sharpest single point in this chapter: about 90 percent Japanese, with the largest supplier now owned by a Japanese state fund ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)) ([source](https://evertiq.com/news/55596)). Gases look diversified at the top and are not, because the top five hold 53.9 percent and individual molecules like neon and NF3 are far more concentrated than the aggregate ([source](https://www.gminsights.com/industry-analysis/high-purity-specialty-gases-market)). China's gallium, germanium and antimony controls are real leverage over compound semiconductors and optics but do not reach a silicon GPU, and the suspension runs only to 27 November 2026 ([source](https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html)). Watch the qualification cycle, not the spot price: every disruption so far has been absorbed within a year, and every one of them has permanently added a second source somewhere.
