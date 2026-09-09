---json
{
  "id": "chemicals-gases-and-photoresist",
  "number": 4,
  "title": "Chemicals, Gases and Photoresist",
  "oneLiner": "A few hundred molecules stand between a blank wafer and a working chip. Japan makes about 90% of the photoresist, and the only two times this layer has been weaponised, it worked.",
  "plain": "Photoresist is photographic film for chips. A wafer is coated with a plastic film thinner than a soap bubble, light is shone through a stencil, and the exposed parts dissolve away, leaving a pattern the next machine can etch. Around it flow a few hundred other gases and liquids that deposit, strip and clean. All of it has to be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why about nine tenths of the world's photoresist comes from Japan, and why a second source takes years rather than weeks.",
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

A modern fab is a chemical plant with lithography attached. Air Liquide alone supplies more than 200 different molecules and delivers roughly 50,000 cylinders a year ([source](https://www.airliquide.com/group/activities/electronics)). Almost none of it is expensive by the tonne, and all of it stops the line when it is missing.

## How it works

Photoresist is photographic film for chips. A wafer is coated with a plastic film thinner than a soap bubble, light is shone through a stencil, and the exposed parts dissolve away, leaving a pattern the next machine can etch. Around it flow a few hundred other gases and liquids that deposit, strip and clean. All of it has to be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why about nine tenths of the world's photoresist comes from Japan, and why a second source takes years rather than weeks.

Since the 1990s the workhorse has been the chemically amplified resist: one photon releases one acid molecule, which then catalyses hundreds of reactions during a post-exposure bake. Amplification is what lets a wafer be exposed in milliseconds, at 248 nm for KrF and 193 nm for ArF immersion.

Extreme ultraviolet breaks that bargain (see Lithography). Each 13.5 nm photon carries about fourteen times the energy of a 193 nm photon, so a given dose contains far fewer of them, and the statistics of where they land show up as line-edge roughness and missing contacts. The answer is to absorb more: metal-oxide resists built on tin-oxo clusters absorb EUV far more strongly than carbon films, which is why JSR bought Inpria for roughly $514 million in 2021 ([source](https://en.tmt-blog.jp/articles/company-jsr-en)).

Everything else here puts material on the wafer, takes it off, or keeps it clean. Bulk gases arrive by the tonne; specialty gases are dosed in grams, from silane for deposition to nitrogen trifluoride, cracked in a plasma to strip deposits off chamber walls between wafers ([source](https://www.factmr.com/report/nitrogen-trifluoride-market)). Hydrofluoric acid does the cleaning and the oxide strips, slurries and pads flatten each layer, sputtering targets supply the interconnect metal, and filters and wafer carriers keep parts-per-trillion contamination out.

## Variants and trade-offs

| Resist class | Wavelength | Where it is used | Limit |
|---|---|---|---|
| i-line novolak | 365 nm | Packaging, mature nodes | Resolution |
| KrF chemically amplified | 248 nm | Implant layers, thick films | Resolution |
| ArF immersion CAR | 193 nm | Most critical layers below 28 nm | Needs multipatterning |
| EUV chemically amplified | 13.5 nm | Leading-edge single-exposure layers | Photon shot noise |
| EUV metal-oxide | 13.5 nm | High-NA and tight-pitch layers | Cost, defectivity, outgassing |

Resist classes are not substitutes; each is tied to a scanner and a layer ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

The same split runs through the gases. Bulk gases are made at the fab fence and travel badly; specialty gases come from a handful of plants and ship in cylinders, which is what makes them interruptible. Neon is the extreme case: present in air at one part in 65,000, it is recovered from oxygen plants at steel mills, so its supply is set by the steel industry ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

## Who makes it

Japan produces about 90 percent of the world's semiconductor photoresist, the rest mostly in the United States and South Korea (as of 2021) ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

{{figure:resist-country}}

JSR is the largest single supplier at about 27 percent of the photoresist market, and it is no longer a normal public company: Japan Investment Corporation, a state-backed fund, took more than 84 percent of its shares in 2024 for roughly ¥900 billion, and JSR was delisted ([source](https://evertiq.com/news/55596)). A government now owns the world's biggest photoresist maker.

The rest of the field is expanding fast on AI demand.

- **Tokyo Ohka Kogyo.** Net sales of ¥139,668 million in the first half of fiscal 2026, up 25.1 percent, on demand for AI server chips ([source](https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf)).
- **Fujifilm.** A Kumamoto expansion completed in June 2025 raised its EUV resist capacity by 30 percent, beside TSMC's Japanese fab ([source](https://www.gminsights.com/industry-analysis/photoresist-chemicals-for-advanced-lithography-market)).
- **Shin-Etsu Chemical.** A photoresist-focused plant at Isesaki opens in April 2026 ([source](https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260127_con_E.pdf)).

Advanced-lithography resist was a $6.1 billion market in 2025, with the top five holding about half ([source](https://www.gminsights.com/industry-analysis/photoresist-chemicals-for-advanced-lithography-market)).

Gases are a Western-led oligopoly. In 2025 Linde held 18.8 percent of high-purity specialty gases, Air Liquide 16.5, Air Products 8.4, Taiyo Nippon Sanso 6.1 and Messer 4.1, with the top five at 53.9 percent of a $12.1 billion market ([source](https://www.gminsights.com/industry-analysis/high-purity-specialty-gases-market)).

{{figure:gas-share}}

Underneath them sit single-molecule specialists: SK Materials in nitrogen trifluoride, Kanto Denka in fluorine chemistry, Stella Chemifa and Morita in ultra-high-purity hydrofluoric acid ([source](https://www.businessresearchinsights.com/market-reports/ultra-high-purity-hydrofluoric-acid-market-107517)).

The consumables are tighter still. As of 2021, five firms held more than 60 percent of wet chemicals, DuPont and Cabot Microelectronics about 56 percent of a $790 million CMP slurry market, and DuPont 78 percent of CMP pads as of 2014 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Entegris spans the unglamorous middle, from slurries to filtration and wafer carriers, on $3,196.6 million of 2025 revenue ([source](https://investor.entegris.com/news/news-details/2026/Entegris-Reports-Results-for-Fourth-Quarter-of-2025/default.aspx)). The most concentrated item here is a metal: JX Advanced Metals reports about 65 percent of the global market for semiconductor sputtering targets ([source](https://www.jx-nmm.com/english/company/glance/)).

## The chokepoint

This layer has been tested twice, and both tests confirmed the theory.

In July 2019 Japan moved photoresist, hydrogen fluoride and fluorinated polyimide from bulk to individual export licences for South Korea, having supplied more than 90 percent of Korean imports of two of them. Hydrogen fluoride exports to Korea fell 87.9 percent ([source](https://www.rieti.go.jp/en/columns/v01_0201.html)). No fab stopped, but Korea spent five years funding domestic substitutes, which is what materials controls usually produce.

In 2022 Russia invaded Ukraine, where more than half of world neon purification capacity sat, removing up to 54 percent of global semiconductor-grade supply ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)). Again no fab stopped, because excimer lasers had been re-engineered to use less neon after a 2014 price shock ([source](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). The structural consequence is that China now runs more than 40 percent of global air separation capacity ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

China's own lever is metals, not molecules. Beijing put gallium and germanium under export licence on 3 July 2023, then banned gallium, germanium, antimony and superhard materials to the United States outright on 3 December 2024 ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)). On 9 November 2025 it suspended that ban until 27 November 2026, keeping the prohibition on dual-use exports to US military end users ([source](https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html)).

Be precise about what that touches, because it is not silicon logic. Gallium goes into gallium nitride and gallium arsenide for radar, RF front ends and power conversion; germanium into high-speed analogue, infrared optics and fibre; antimony is a dopant. None of them gates an AI accelerator directly. What they gate is price and lead time on the equipment around it: germanium traded at $8,597.50 per kilogram in September 2026, against $4,120.80 at the start of 2025 ([source](https://strategicmetalsinvest.com/germanium-prices/)). USGS put the GDP cost of a complete ban at about $3.4 billion ([source](https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/)).

The slower risk is regulatory. The EU's PFAS restriction dossier was revised on 20 August 2025 to add a risk-based option judged proportionate for electronics, with a Commission decision likely in 2027 and effect from late 2028 or 2029 ([source](https://www.kirkland.com/publications/kirkland-alert/2025/10/pfas-update-scrapping-prior-broader-proposal-eu-publishes-updated-narrower-proposal-to-restrict-the)). Photoacid generators, etch gases, chamber liners, pump seals and filter membranes are all fluorinated. A carve-out is likely. It is not yet law.

## Key evaluation criteria

- **Purity, in parts per trillion** of metallic contamination, not parts per million. This is the specification that keeps entrants out.
- **Qualification lock-in**, because a resist or slurry is approved per layer per device per fab, so switching costs are counted in tape-outs, not purchase orders.
- **Photon efficiency** for EUV resists, where absorption sets the dose, dose sets throughput and shot noise sets defectivity, which is the whole case for metal-oxide chemistry ([source](https://en.tmt-blog.jp/articles/company-jsr-en)).
- **Transportability**, since bulk gases are made at the fab fence and specialty gases ship in cylinders, and only the second can be embargoed.
- **Byproduct exposure**, where neon depends on steel oxygen plants and gallium and germanium on aluminium and zinc refining, so supply answers to another industry ([source](https://www.sfa-oxford.com/rare-earths-and-minor-metals/gaseous-elements-and-noble-gases/electronic-gases/neon-10-ne/)).

## Takeaways

Photoresist is the sharpest single point in this chapter: about 90 percent Japanese, with the largest supplier now owned by a Japanese state fund ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)) ([source](https://evertiq.com/news/55596)). Gases look diversified and are not: individual molecules like neon and nitrogen trifluoride are far more concentrated than the 53.9 percent aggregate ([source](https://www.gminsights.com/industry-analysis/high-purity-specialty-gases-market)). China's gallium, germanium and antimony controls are real leverage over compound semiconductors and optics but do not reach a silicon GPU, and the suspension runs only to 27 November 2026 ([source](https://www.pillsburylaw.com/en/news-and-insights/china-suspends-export-controls-certain-critical-minerals-related-items.html)). Watch the qualification cycle, not the spot price: every disruption so far has been absorbed within a year, and each one permanently added a second source somewhere.
