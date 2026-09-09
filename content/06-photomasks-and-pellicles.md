---json
{
  "id": "photomasks-and-pellicles",
  "number": 6,
  "title": "Photomasks and Pellicles",
  "oneLiner": "A $259 million market gates every leading-edge chip. Two Japanese firms make almost all EUV mask blanks, one Japanese firm inspects them, and EUV pellicles still cost 20% of scanner throughput.",
  "specimen": "photomask",
  "specimenCaption": "Right: a six-inch reticle with its pellicle frame. Low-thermal-expansion glass at the base, a molybdenum and silicon multilayer mirror above it, a tantalum absorber carrying the pattern, and a thin membrane held off the surface to keep particles out of focus.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "AGC", "country": "JP", "share": "One of two firms holding about 94% of EUV mask blank revenue in 2024"},
      {"name": "Hoya", "country": "JP", "share": "The other; says it has held an exceptionally large share of mask blanks for many years"},
      {"name": "Lasertec", "country": "JP", "share": "Sole supplier of actinic EUV mask inspection; JPY 230.5bn revenue in FY to June 2026"},
      {"name": "IMS Nanofabrication", "country": "AT", "share": "Intel calls it the established industry leader in multi-beam mask writers"},
      {"name": "Photronics", "country": "US", "share": "Largest merchant mask maker; $849.3M revenue in FY2025"}
    ],
    "countries": [
      {"code": "JP", "note": "Mask blanks (AGC, Hoya), DUV blanks (Shin-Etsu), inspection (Lasertec), writers (NuFlare), pellicles (Mitsui Chemicals)"},
      {"code": "AT", "note": "IMS Nanofabrication multi-beam mask writers, Vienna"},
      {"code": "DE", "note": "Zeiss mask repair and metrology"},
      {"code": "US", "note": "Photronics merchant mask shops, KLA inspection"},
      {"code": "TW", "note": "TSMC captive mask shop, and a 10% stake in IMS"}
    ],
    "chinaStatus": "No EUV mask capability. SMIC runs captive mask shops in Shanghai for g-line, i-line, KrF and ArF. Newway mass-produces 180 nm masks, has 150/130 nm in small-volume production, and started 40 nm trial production in the second half of 2025.",
    "usStatus": "Photronics is the largest merchant mask maker and KLA supplies inspection, but the US has no EUV blank or actinic inspection supplier.",
    "costSignal": "A leading-edge mask set runs from roughly $10M to $40M depending on node and source",
    "substitution": {"years": "5-10", "why": "EUV blank defect levels took AGC and Hoya two decades to reach, and Lasertec's actinic inspection tools have no alternative at all."}
  },
  "keyFacts": [
    {"fact": "The top two EUV mask blank makers held about 93.7% of revenue in 2024, in a market worth $259.25 million", "source": "https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html"},
    {"fact": "An EUV mask reflector is about 40 Mo/Si bilayers of 7 nm period, capped with 3 nm of ruthenium, under a 58 nm TaBN plus 2 nm TaBO absorber", "source": "https://arxiv.org/pdf/1912.09075"},
    {"fact": "A 90% transmission EUV pellicle costs about 20% of throughput because the light passes through it twice", "source": "https://semiengineering.com/mask-complexity-cost-and-change/"},
    {"fact": "Mitsui Chemicals' carbon nanotube pellicles target 92% or higher EUV transmittance and sources above 1,000 W", "source": "https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm"},
    {"fact": "Mask sets cost beyond $1M at 28 nm, beyond $10M at 7 nm and approach $40M at 3 nm (2022 estimate)", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
    {"fact": "IMS Nanofabrication was valued at about $4.3 billion when TSMC bought roughly 10% in September 2023", "source": "https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication"},
    {"fact": "Lasertec reported JPY 230.5 billion of net sales and JPY 237.5 billion of orders in the year to June 2026", "source": "https://www.lasertec.co.jp/en/ir/plan/message.html"},
    {"fact": "Photronics, the largest merchant mask maker, had $849.3 million of revenue in fiscal 2025, of which $615.1 million was IC masks", "source": "https://www.nasdaq.com/press-release/photronics-reports-full-year-and-fourth-quarter-fiscal-2025-results-2025-12-10"}
  ],
  "figures": [
    {
      "id": "blank-share",
      "type": "stack",
      "title": "EUV mask blank revenue share, 2024",
      "unit": "%",
      "data": [["AGC and Hoya combined", 94], ["Others (S&S Tech, Applied Materials, Photronics)", 6]],
      "source": {"label": "QY Research via DRI", "url": "https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html"}
    },
    {
      "id": "mask-set-cost",
      "type": "bars",
      "title": "Mask-set cost by node, 2022 estimates",
      "unit": "$M",
      "data": [["28 nm", 1], ["7 nm", 10], ["3 nm", 40]],
      "source": {"label": "SemiAnalysis", "url": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"}
    }
  ]
}
---
# Photomasks and Pellicles

A scanner can only print what is on the mask. Every EUV layer on an AI accelerator depends on a defect-free reticle made from a blank that two Japanese companies supply, inspected on a tool that one Japanese company makes. The whole EUV mask blank market was worth $259.25 million in 2024 ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)). That is the leverage: a rounding error in revenue sitting under every leading-edge chip.

## How it works

A photomask, or reticle, is the master template for one layer of a chip. The scanner illuminates it and projects a four-times-demagnified image onto the wafer, so a 20 nm feature on silicon is an 80 nm feature on the mask. A DUV mask is transmissive: a synthetic quartz plate carrying a light-shielding film such as molybdenum silicide or chrome, sometimes with a half-tone phase-shifting layer to sharpen edges ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)).

An EUV mask cannot work that way, because 13.5 nm light is absorbed by every material including quartz. So an EUV mask is a mirror. On a low-thermal-expansion glass substrate sits a Bragg reflector of roughly 40 molybdenum and silicon bilayers with a period near 7 nm, capped with about 3 nm of ruthenium to protect it. The pattern is a tantalum-based absorber on top, measured at 58 nm of TaBN plus a 2 nm TaBO anti-reflective layer on a state-of-the-art blank ([source](https://arxiv.org/pdf/1912.09075)).

Three consequences follow. The light arrives at an angle and bounces off a stack with real depth, producing mask 3D effects that must be modelled and pre-compensated. The absorber pattern must be written into a film tens of nanometres thick with single-digit nanometre placement accuracy. And any particle landing on the reflector prints on every wafer until someone finds it.

High-NA makes the geometry harder. Its optics are anamorphic, demagnifying four times in one direction and eight times in the other, which halves the printable field and forces a large die to be stitched from two masks ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)). On 8 September 2026 ASML and TSMC announced an industry initiative to move from today's 6-inch masks to 12-inch masks, targeting a pilot mask line in 2031 and production systems in 2033, explicitly to remove that stitching constraint ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).

## Variants and trade-offs

### Blanks

The blank is the hard part. Depositing forty bilayers with sub-angstrom uniformity across a six-inch plate, with essentially no buried particles, took two decades to learn. AGC and Hoya together held about 93.7% of EUV mask blank revenue in 2024, with S&S Tech, Applied Materials and Photronics splitting the remainder ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)). Hoya's own language is that it has kept "an exceptionally large share of the market for mask blanks for many years" and expects EUV competition to intensify over the medium term ([source](https://www.hoya.com/ir/2024/en/review/it.html)). For DUV, Shin-Etsu Chemical is the other major blank supplier, selling opaque MoSi-on-glass and half-tone phase-shift blanks on synthetic quartz ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)).

### Writers

The pattern is written into resist on the blank by an electron-beam writer. Multi-beam writers fire beamlets in parallel, which is what lets an EUV mask, dense with assist features, finish writing in a usable time. Intel describes IMS Nanofabrication of Vienna as "the established industry leader in multi-beam mask writing tools", and sold roughly 10% of it to TSMC in September 2023 at a valuation near $4.3 billion, after selling about 20% to Bain Capital in July 2023 at the same valuation ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)) ([source](https://www.intc.com/news-events/press-releases/detail/1637/intel-to-sell-minority-stake-in-ims-nanofabrication-business)). Japan's NuFlare Technology is the other e-beam mask writer supplier.

Two things follow for design. Multi-beam writing makes curvilinear masks nearly as cheap as rectilinear ones, and inverse lithography can cut the number of masks by turning a multi-patterned layer into a single-patterned one ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)). The looming limit is not the writer. Sub-resolution assist features for High-NA may need to be as small as 15 nm at mask scale, and D2S's CEO argues the constraint will be how fast a resist can be while still holding 15 nm reliably ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)).

### Inspection and repair

A mask defect is a systematic yield killer, so masks are inspected as blanks, after patterning, and in production. Actinic inspection means inspecting at 13.5 nm, the wavelength the mask actually sees, and Lasertec is the only supplier. Its fiscal year to June 2026 brought JPY 230.5 billion of net sales and JPY 105.3 billion of operating profit, with orders recovering to JPY 237.5 billion; it launched the ACTIS A200HiT for patterned EUV mask inspection at three times the previous inspection speed, plus the MAGICS M9750 and M9751 for blanks ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)). Photronics' CTO makes the economic point plainly: actinic tools work only on EUV masks, they are very expensive, and because relatively few EUV masks run, cost per use is high and it drives up EUV mask cost ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). KLA supplies optical reticle inspection, and Zeiss supplies e-beam mask repair.

### Pellicles

A pellicle is a thin membrane stretched on a frame above the mask surface. Particles land on the membrane instead of the pattern, far enough out of focus that they do not print. At 193 nm immersion this is settled technology, universally used and long-lived ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

EUV breaks it. The light passes through the membrane on the way in and again on the way out, so a 90% transmission pellicle costs about 20% of the light and therefore of throughput. Today's polysilicon pellicles also reflect deep ultraviolet light from the source, requiring an extra filter membrane that costs roughly another 20%. Micron skips EUV pellicles entirely because of the throughput hit, which means cleaning masks more often and holding duplicates so scanners keep running during inspection ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

Carbon nanotube membranes are the intended fix: higher transmission and less DUV reflection, so no filter membrane. They are not ready. Current CNT pellicles survive fewer than 10,000 wafer exposures and can shatter inside the scanner, and Micron reports no known high-volume production use ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). Mitsui Chemicals, which runs its EUV pellicle business under an ASML licence and began commercial production in 2021, is building CNT pellicle capacity at its Iwakuni-Ohtake Works targeting 92% or higher EUV transmittance and exposure sources above 1,000 W, with construction completion set tentatively for December 2025 ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)) ([source](https://us.mitsuichemicals.com/mci/mci-news/2021/2021_0526/index.htm)).

The trade-off splits by product. For a large logic die of around 800 mm2, a killer defect wipes out the whole die, so you want a pellicle. For memory with built-in redundancy, skipping the pellicle and repairing defects can be the better economics ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

{{figure:blank-share}}

## Cost and design economics

Mask counts exploded before EUV. Some designs ran over 100 masks around the 7 nm era, and EUV pulled the number back by doing in one exposure what 193 nm immersion needed two or three exposures to do ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)).

Cost estimates vary and should be read as ranges. SemiAnalysis put mask sets beyond $1 million at 28 nm, beyond $10 million at 7 nm and approaching $40 million at 3 nm (as of 2022) ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). A 2026 survey is lower and adds layer counts: $1 million to $2 million over 30 to 40 layers at 28 nm, $5 million to $8 million over 60 to 80 layers at 7 nm, and $10 million to $20 million over 70 to 100 layers at 3 to 5 nm ([source](https://semiconductorinsight.com/blog/from-design-to-silicon-photomask-connection/)). Call the leading edge $10 million to $40 million over 70 to 100 layers.

That number decides who gets to use a node. Lam Research's patterning lead says mask economics have already pushed designers to optimise pitches and layouts to maximise mask reuse and minimise total mask sets ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)). D2S's CEO is blunter: a new AI chip startup will prove its design out on a 193 nm immersion node first, because it does not have the volume to amortise an EUV mask set ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)).

For the accelerators this site is about, mask cost is real but not decisive. A reticle-limited GPU die spread over hundreds of thousands of units absorbs a $40 million mask set easily. The same mask set kills a specialised inference ASIC shipping in the thousands, which is the quiet reason so much AI silicon converges on a handful of designs. EUV mask lifetime makes it worse: EUV reticles do not last as long as immersion reticles, so fabs buy duplicates and re-buy more often ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

{{figure:mask-set-cost}}

## Who makes it

Blanks are a Japanese duopoly. Writers are Austrian and Japanese. Actinic inspection is a Japanese monopoly. Pellicles are Japanese under a Dutch licence. Repair is German.

Mask making splits into captive and merchant. TSMC, Samsung and Intel run their own leading-edge mask shops, because turnaround time is a competitive weapon and leading-edge masks are inseparable from process development. The merchant tier serves everyone else. Photronics is the largest, with $849.3 million of fiscal 2025 revenue to 31 October 2025, of which $615.1 million was IC masks and $234.2 million flat panel display, across 11 plants ([source](https://www.nasdaq.com/press-release/photronics-reports-full-year-and-fourth-quarter-fiscal-2025-results-2025-12-10)). Toppan Photomasks, Dai Nippon Printing and Hoya make up most of the rest.

China has mask capability at trailing nodes and nothing at the leading edge. SMIC runs two captive mask facilities in Shanghai, at Zhangjiang and Lingang, producing binary and phase-shift masks with optical proximity correction for g-line, i-line, KrF and ArF tools ([source](https://www.smics.com/en/site/mask)). Newway, the Shenzhen merchant mask maker, has 180 nm masks in mass production, 150 nm and 130 nm validated and in small-volume production, and began 40 nm trial production in the second half of 2025 through its Luxin Semiconductor investment, with 28 nm as the stated goal ([source](https://www.newwaymask.com/en/competitive/semiconductor.html)). There is no Chinese EUV blank, no Chinese actinic inspection tool and no Chinese multi-beam writer.

## The chokepoint

This stage scores a 5 for the same reason lithography does, but for far less money. Two firms supply the blanks, one firm supplies the tool that certifies them, and none of these businesses is big enough to attract a well-funded entrant. Nobody builds a $259 million blank business from scratch to serve four customers with a two-decade defect-learning curve ahead ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)).

Pellicles are the open sore. A decade on, no membrane is transparent, tough and long-lived enough, and the workaround of running EUV bare and cleaning more often pushes cost straight into mask spend and scanner downtime. Whether CNT pellicles reach production moves EUV cost per wafer more than any incremental scanner improvement.

## Key evaluation criteria

- **Blank defectivity** — buried particles in the multilayer cannot be repaired, so blank yield sets mask yield.
- **Write time and placement** — multi-beam writers are what make dense curvilinear EUV patterns affordable, and resist speed at 15 nm assist features is the next wall ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)).
- **Actinic inspectability** — only a 13.5 nm inspection sees what the scanner sees, and only Lasertec sells one ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)).
- **Pellicle transmission and lifetime** — transmission counts twice, and current CNT membranes last fewer than 10,000 wafer exposures ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).
- **Mask-set cost per node** — $10M to $40M at the leading edge, which decides which designs can use it ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

## Takeaways

Photomasks are the cheapest critical chokepoint in the AI chip supply chain, and that is exactly what makes them dangerous. A $259 million blank market with two suppliers ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)), and a single-vendor actinic inspection tool ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)), sit under every EUV layer of every leading-edge accelerator. EUV pellicles remain unsolved, so fabs trade throughput against defect risk product by product ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). And mask-set costs of $10 million to $40 million at the leading edge quietly determine which AI chips get designed at all ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).
