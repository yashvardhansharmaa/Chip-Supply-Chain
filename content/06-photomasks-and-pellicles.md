---json
{
  "id": "photomasks-and-pellicles",
  "number": 6,
  "title": "Photomasks and Pellicles",
  "oneLiner": "A $259 million market gates every leading-edge chip. Two Japanese firms make almost all EUV mask blanks, one Japanese firm inspects them, and EUV pellicles still cost 20% of scanner throughput.",
  "plain": "A photomask is the printing plate for one layer of a chip. The machine shrinks its picture four times onto the wafer, so one plate stamps the same layer millions of times. For the shortest light now in use no glass is transparent, so the plate is not a window but a mirror built from about forty pairs of ultrathin layers, and any speck of dust on it repeats on every chip. Two Japanese firms make almost all of those mirrors, which is why a market worth a few hundred million dollars sits under every leading-edge chip.",
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
    "chinaStatus": "No EUV mask capability. SMIC runs two captive mask shops in Shanghai for g-line, i-line, KrF and ArF tools. There is no Chinese EUV blank, no Chinese actinic inspection tool and no Chinese multi-beam writer.",
    "usStatus": "Photronics is the largest merchant mask maker and KLA supplies inspection, but the US has no EUV blank or actinic inspection supplier.",
    "costSignal": "A leading-edge mask set runs from roughly $10M to $40M depending on node and source",
    "substitution": {"years": "5-10", "why": "EUV blank defect levels took AGC and Hoya two decades to reach, and Lasertec's actinic inspection tools have no alternative at all."}
  },
  "keyFacts": [
    {"fact": "The top two EUV mask blank makers held about 93.7% of revenue in 2024, in a market worth $259.25 million (QY Research estimate)", "source": "https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html"},
    {"fact": "An EUV mask reflector is about 40 Mo/Si bilayers of 7 nm period, capped with 3 nm of ruthenium, under a 58 nm TaBN plus 2 nm TaBO absorber", "source": "https://arxiv.org/pdf/1912.09075"},
    {"fact": "A 90% transmission EUV pellicle costs about 20% of throughput because the light passes through it twice", "source": "https://semiengineering.com/mask-complexity-cost-and-change/"},
    {"fact": "Mitsui Chemicals' carbon nanotube pellicles target 92% or higher EUV transmittance and sources above 1,000 W", "source": "https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm"},
    {"fact": "Mask sets cost beyond $1M at 28 nm, beyond $10M at 7 nm and approach $40M at 3 nm (2022 estimate)", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
    {"fact": "IMS Nanofabrication was valued at about $4.3 billion when TSMC bought roughly 10% in September 2023", "source": "https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication"},
    {"fact": "Lasertec reported JPY 230.5 billion of net sales and JPY 237.5 billion of orders in the year to June 2026", "source": "https://www.lasertec.co.jp/en/ir/plan/message.html"},
    {"fact": "Photronics, the largest merchant mask maker, had $849.3 million of revenue in fiscal 2025, of which $615.1 million was IC masks", "source": "https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html"}
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

A scanner can only print what is on the mask. Every EUV layer on an AI accelerator needs a defect-free reticle, built on a blank two Japanese firms supply and cleared by a tool one Japanese firm makes. QY Research puts the whole EUV mask blank market at $259.25 million in 2024 ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)).

## How it works

A photomask is the printing plate for one layer of a chip. The machine shrinks its picture four times onto the wafer, so one plate stamps the same layer millions of times. For the shortest light now in use no glass is transparent, so the plate is not a window but a mirror built from about forty pairs of ultrathin layers, and any speck of dust on it repeats on every chip. Two Japanese firms make almost all of those mirrors, which is why a market worth a few hundred million dollars sits under every leading-edge chip.

A DUV mask is transmissive: quartz carrying a light-shielding film such as molybdenum silicide ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)). An EUV mask is a mirror: roughly 40 molybdenum and silicon bilayers of 7 nm period on low-thermal-expansion glass, capped with 3 nm of ruthenium, under a tantalum absorber of 58 nm TaBN plus 2 nm TaBO ([source](https://arxiv.org/pdf/1912.09075)).

Three consequences follow.

- **Mask 3D effects.** Light strikes at an angle and reflects off a stack with depth, so software has to pre-compensate the distortion.
- **Write precision.** The absorber must be cut with single-digit nanometre placement accuracy.
- **Particles.** Anything landing on the reflector prints on every wafer until someone finds it.

High-NA halves the printable field, so a large die must be stitched from two masks ([source](https://marklapedus.substack.com/p/tsmc-samsung-back-high-na-euv-and)). On 8 September 2026 ASML and TSMC announced a move from 6-inch to 12-inch masks to remove that constraint, with a pilot line in 2031 ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).

## Variants and trade-offs

### Blanks

The blank is the hard part. Depositing forty bilayers with sub-angstrom uniformity across a six-inch plate, with essentially no buried particles, took two decades to learn. On QY Research's numbers AGC and Hoya together held about 93.7% of EUV blank revenue in 2024 ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)). Hoya expects EUV competition to intensify over the medium term, which tells you how little it has met so far ([source](https://www.hoya.com/ir/2024/en/review/it.html)). Shin-Etsu Chemical supplies the DUV blanks ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)).

### Writers

An electron-beam writer cuts the pattern into resist on the blank. Multi-beam writers fire beamlets in parallel, which is what lets a dense EUV mask finish in a usable time. Intel calls IMS Nanofabrication of Vienna the established industry leader in multi-beam writers, and sold roughly 10% of it to TSMC in September 2023 at a valuation near $4.3 billion ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)). Japan's NuFlare is the other supplier.

The writer is not the wall. High-NA assist features may need to be 15 nm at mask scale, and D2S told Semiconductor Engineering the constraint at that size is resist speed ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)).

### Inspection and repair

A mask defect is a systematic yield killer, so masks are inspected as blanks, after patterning and in production. Actinic inspection looks at 13.5 nm, the wavelength the mask itself sees. Lasertec is the only supplier, on JPY 230.5 billion of net sales in the year to June 2026 ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)). Its tools work on nothing but EUV masks, cost a fortune and serve few of them, so cost per use is high ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). KLA sells optical reticle inspection; Zeiss sells e-beam repair.

### Pellicles

A pellicle is a thin membrane on a frame above the mask. Particles land on it instead of the pattern, far enough out of focus that they do not print. At 193 nm immersion this is settled technology ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

EUV breaks it. The light crosses the membrane twice, so a 90% transmission pellicle costs about 20% of throughput, and today's polysilicon pellicles also reflect deep ultraviolet from the source, needing a filter that costs roughly another 20%. Micron skips EUV pellicles and cleans masks more often instead, holding duplicates so scanners keep running during inspection ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

Carbon nanotube membranes are the intended fix, and they are not ready: current versions survive fewer than 10,000 wafer exposures, can shatter inside the scanner, and have no known production use ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). Mitsui Chemicals, which licenses the business from ASML, is building capacity at Iwakuni-Ohtake for membranes above 92% transmittance and sources above 1,000 W ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)).

The choice splits by product. One killer defect wipes out an 800 mm2 logic die, so logic wants a pellicle. Memory ships with redundancy, so running bare and repairing defects can pay better ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).

{{figure:blank-share}}

## Cost and design economics

Estimates vary; read them as a range. SemiAnalysis put mask sets beyond $1 million at 28 nm, beyond $10 million at 7 nm and approaching $40 million at 3 nm, as of 2022 ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). We would call the leading edge $10 million to $40 million.

That number decides who gets to use a node. A new AI chip startup proves its design out on a 193 nm immersion node first, D2S says, because it lacks the volume to amortise an EUV mask set ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)).

For AI accelerators the cost is real but not decisive. A GPU spread over hundreds of thousands of units absorbs a $40 million mask set easily ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). The same set kills an inference ASIC shipping in the thousands. That is the quiet reason so much AI silicon converges on a handful of designs.

{{figure:mask-set-cost}}

## Who makes it

The stage is Japanese almost end to end: an AGC and Hoya blank duopoly, a Lasertec inspection monopoly, and Mitsui Chemicals pellicles under a Dutch licence. Writers are Austrian and Japanese; repair is German.

Mask making splits into captive and merchant. TSMC, Samsung and Intel run their own leading-edge mask shops, because turnaround time is a competitive weapon. Photronics is the largest merchant supplier, on $849.3 million of fiscal 2025 revenue, of which $615.1 million was IC masks ([source](https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html)). Toppan, Dai Nippon Printing and Hoya take most of the rest.

China has mask capability at trailing nodes and nothing at the leading edge. SMIC runs two captive mask shops in Shanghai for g-line, i-line, KrF and ArF tools ([source](https://www.smics.com/en/site/mask)). There is no Chinese EUV blank, no Chinese actinic inspection tool and no Chinese multi-beam writer.

## The chokepoint

This stage scores a 5 for the reason lithography does, on a fraction of the money. Two firms supply the blanks, one firm certifies them, and neither business is big enough to attract a funded entrant. Nobody builds a $259 million blank business from scratch to serve four customers with a two-decade defect-learning curve ahead ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)).

Pellicles are the open sore. A decade on, no membrane is transparent, tough and long-lived at once, and running EUV bare pushes the cost into mask spend and scanner downtime. We think carbon nanotube pellicles reaching production would move EUV cost per wafer more than any incremental scanner improvement.

## Key evaluation criteria

- **Blank defectivity** — buried particles in the multilayer cannot be repaired, so blank yield sets mask yield.
- **Write time and placement** — multi-beam writers are what make dense curvilinear EUV patterns affordable, and resist speed at 15 nm assist features is the next wall ([source](https://semiengineering.com/mask-economics-shape-high-na-euv-adoption/)).
- **Actinic inspectability** — only a 13.5 nm inspection sees what the scanner sees, and only Lasertec sells one ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)).
- **Pellicle transmission and lifetime** — transmission counts twice, and current carbon nanotube membranes last fewer than 10,000 wafer exposures ([source](https://semiengineering.com/mask-complexity-cost-and-change/)).
- **Mask-set cost per node** — $10M to $40M at the leading edge, which decides which designs can use it ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

## Takeaways

Photomasks are the cheapest critical chokepoint in the AI chip supply chain, and that is what makes them dangerous. A $259 million blank market with two suppliers ([source](https://www.dri.co.jp/auto/report/qyr/250206-euv-mask-blanks-global-market-share-and.html)) and a single-vendor actinic inspection tool ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)) sit under every EUV layer of every leading-edge accelerator. Pellicles remain unsolved, so fabs trade throughput against defect risk product by product ([source](https://semiengineering.com/mask-complexity-cost-and-change/)). And mask-set costs of $10 million to $40 million quietly decide which AI chips get designed at all ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).
