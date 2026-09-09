---json
{
  "id": "photomasks-and-pellicles",
  "number": 6,
  "title": "Photomasks and Pellicles",
  "oneLiner": "A business worth tens of billions of yen gates every leading-edge chip. Two Japanese firms make almost all EUV mask blanks, one Japanese firm inspects them, and the membrane meant to keep dust off them is still not in production.",
  "plain": "A photomask is the printing plate for one layer of a chip. The machine shrinks its picture four times onto the wafer, so one plate stamps that layer millions of times. No glass is transparent to the short light now in use, so the plate is not a window but a mirror of about forty pairs of ultrathin layers, and any speck of dust on it repeats on every chip. Two Japanese firms make almost all of those mirrors, which is why a small and obscure business sits under every leading-edge chip.",
  "specimen": "photomask",
  "specimenCaption": "Right: a six-inch reticle with its pellicle frame. Low-thermal-expansion glass at the base, a molybdenum and silicon multilayer mirror above it, a tantalum absorber carrying the pattern, and a thin membrane held off the surface to keep particles out of focus.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "AGC", "country": "JP", "share": "Says it is the world's only EUV mask blank maker covering everything from glass to coating; targeted over ¥40bn of blank sales by 2025"},
      {"name": "Hoya", "country": "JP", "share": "Says it holds an exceptionally high share of mask blanks and aims to keep its lead as customers move to multi-sourcing"},
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
    {"fact": "AGC calls itself the world's only maker of EUV mask blanks handling every step from glass material to coating, and expanded capacity by about 30% in 2025 under a METI supply-chain programme", "source": "https://www.agc.com/en/news/detail/1203819_2814.html"},
    {"fact": "Hoya says it holds an exceptionally high share of the mask blank market and expects customers to move gradually toward multi-sourcing EUV blanks", "source": "https://www.hoya.com/ir/2025/en/review/it.html"},
    {"fact": "An EUV mask reflector is about 40 Mo/Si bilayers of 7 nm period, capped with 3 nm of ruthenium, under a 58 nm TaBN plus 2 nm TaBO absorber", "source": "https://arxiv.org/pdf/1912.09075"},
    {"fact": "ASML's EUV pellicle is a membrane 13 nm thick that must survive 500C in vacuum, and every photon it absorbs costs customer productivity", "source": "https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic"},
    {"fact": "Imec exposed carbon nanotube pellicles with up to 97% single-pass EUV transmission on an NXE:3300 scanner, with low and correctable imaging impact", "source": "https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner"},
    {"fact": "Mitsui Chemicals' carbon nanotube pellicles target 92% or higher EUV transmittance and sources above 1,000 W", "source": "https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm"},
    {"fact": "Mask sets cost beyond $1M at 28 nm, beyond $10M at 7 nm and approach $40M at 3 nm (2022 estimate)", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
    {"fact": "IMS Nanofabrication was valued at about $4.3 billion when TSMC bought roughly 10% in September 2023", "source": "https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication"},
    {"fact": "Lasertec reported JPY 230.5 billion of net sales and JPY 237.5 billion of orders in the year to June 2026", "source": "https://www.lasertec.co.jp/en/ir/plan/message.html"},
    {"fact": "Photronics, the largest merchant mask maker, had $849.3 million of revenue in fiscal 2025, of which $615.1 million was IC masks", "source": "https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html"}
  ],
  "figures": [
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

A scanner can only print what is on the mask. Every EUV layer on an AI accelerator needs a defect-free reticle, built on a blank two Japanese firms supply and cleared by a tool one Japanese firm makes. AGC, one of the two, says it is the only company in the world that takes an EUV blank all the way from glass material to coating ([source](https://www.agc.com/en/news/detail/1203819_2814.html)).

## How it works

A photomask is the printing plate for one layer of a chip. The machine shrinks its picture four times onto the wafer, so one plate stamps that layer millions of times. No glass is transparent to the short light now in use, so the plate is not a window but a mirror of about forty pairs of ultrathin layers, and any speck of dust on it repeats on every chip. Two Japanese firms make almost all of those mirrors, which is why a small and obscure business sits under every leading-edge chip.

A DUV mask is transmissive: quartz carrying a light-shielding film such as molybdenum silicide ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)). An EUV mask is a mirror, about 40 molybdenum and silicon bilayers of 7 nm period on low-expansion glass under a tantalum absorber ([source](https://arxiv.org/pdf/1912.09075)).

Three consequences follow.

- **Mask 3D effects.** Light strikes the stack at an angle, so software must pre-compensate the distortion.
- **Write precision.** The absorber has to be cut to single-digit nanometre placement.
- **Particles.** Anything on the reflector prints on every wafer until someone finds it.

High-NA halves the printable field and doubles the exposures needed to cover a wafer, so a large die must be stitched from two masks ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). On 8 September 2026 ASML and TSMC announced a move to 12-inch masks to remove that, with a pilot line in 2031 ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).

## Variants and trade-offs

### Blanks

The blank is the hard part. Depositing forty bilayers with sub-angstrom uniformity across a six-inch plate, with no buried particles, took two decades to learn. Hoya says it holds an exceptionally high share of the mask blank market and expects customers to move gradually toward multi-sourcing EUV blanks, a lead it intends to defend at advanced nodes ([source](https://www.hoya.com/ir/2025/en/review/it.html)). AGC raised its EUV blank capacity by about 30 percent in 2025, on a line in Fukushima funded under a METI supply-chain programme, and was aiming for more than ¥40 billion of sales in the business ([source](https://www.agc.com/en/news/detail/1203819_2814.html)). Shin-Etsu supplies the DUV blanks ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)).

### Writers

An electron-beam writer cuts the pattern into resist on the blank. Multi-beam writers fire beamlets in parallel, which is what lets a dense EUV mask finish in a usable time. Intel calls IMS Nanofabrication of Vienna the established leader in multi-beam writers, and sold roughly 10% of it to TSMC in September 2023 at a valuation near $4.3 billion ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)). Japan's NuFlare is the other supplier.

### Inspection and repair

A mask defect kills yield systematically, so masks are checked as blanks, after patterning and in production. Actinic inspection looks at 13.5 nm, the wavelength the mask itself sees, and Lasertec is the only supplier, on JPY 230.5 billion of net sales in the year to June 2026 ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)). KLA sells optical reticle inspection; Zeiss sells e-beam repair.

### Pellicles

A pellicle is a thin membrane on a frame above the mask. Particles land on it rather than the pattern, too far out of focus to print.

EUV makes that hard. ASML's membrane is 13 nanometres thick, has to hold together at 500C in vacuum, and every photon it absorbs is productivity the customer loses ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). The light crosses it twice, on the way in and on the way back off the mirror, so absorption counts double.

Carbon nanotube membranes are the intended fix. Imec has mounted them on reticles and exposed them in an NXE:3300 scanner, measuring single-pass transmission up to 97 percent and finding the effect on imaging low and correctable ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)). Mitsui Chemicals, licensed by ASML, is building capacity at Iwakuni-Ohtake for membranes above 92 percent transmittance that can stand sources above 1,000 W ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)). Neither is yet a production part in a leading-edge fab.

## Cost and design economics

SemiAnalysis put mask sets beyond $1 million at 28 nm, beyond $10 million at 7 nm and near $40 million at 3 nm, as of 2022 ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). Call the leading edge $10 million to $40 million.

That number decides who gets to use a node. A GPU spread over hundreds of thousands of units absorbs a $40 million mask set easily ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). The same set kills an inference ASIC shipping in the thousands. That is the quiet reason so much AI silicon converges on a handful of designs.

{{figure:mask-set-cost}}

## Who makes it

Mask making splits into captive and merchant. TSMC, Samsung and Intel run their own leading-edge mask shops, because turnaround time is a competitive weapon. Photronics is the largest merchant supplier, on $849.3 million of fiscal 2025 revenue, of which $615.1 million was IC masks ([source](https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html)). Toppan, Dai Nippon Printing and Hoya take most of the rest.

China has mask capability at trailing nodes and nothing at the leading edge. SMIC runs two captive mask shops in Shanghai for g-line, i-line, KrF and ArF tools ([source](https://www.smics.com/en/site/mask)). There is no Chinese EUV blank, no Chinese actinic inspection tool and no Chinese multi-beam writer.

## The chokepoint

This stage scores a 5 for the reason lithography does, on a fraction of the money. Two firms supply the blanks, one certifies them, and neither business is big enough to attract a funded entrant. AGC's whole EUV blank business was aiming at ¥40 billion of annual sales, and it took a METI supply-chain subsidy to add 30 percent of capacity ([source](https://www.agc.com/en/news/detail/1203819_2814.html)). Nobody starts from scratch at that size, to serve four customers, with a two-decade defect-learning curve ahead.

Pellicles are the open sore. A decade on, no membrane is transparent, tough and long-lived at once, so fabs trade throughput against defect risk. We think a production carbon nanotube pellicle would move EUV cost per wafer more than any scanner improvement.

## Key evaluation criteria

- **Blank defectivity** — buried particles in the multilayer cannot be repaired, so blank yield sets mask yield.
- **Write time and placement** — multi-beam writers make dense curvilinear EUV patterns affordable; resist speed on the mask is the next wall ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)).
- **Actinic inspectability** — only a 13.5 nm inspection sees what the scanner sees, and only Lasertec sells one ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)).
- **Pellicle transmission and lifetime** — transmission counts twice, and the best demonstrated carbon nanotube membranes pass 97% in a single crossing ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)).
- **Mask-set cost per node** — $10M to $40M at the leading edge, which decides which designs can use it ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

## Takeaways

Photomasks are the cheapest critical chokepoint in this chain, and that is what makes them dangerous. Two blank suppliers, one of them describing its own share as exceptionally high ([source](https://www.hoya.com/ir/2025/en/review/it.html)), and a single-vendor actinic inspection tool ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)) sit under every EUV layer of every leading-edge accelerator. Pellicles remain unproven in production, so fabs trade throughput against defect risk product by product ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). And mask-set costs of $10 million to $40 million quietly decide which AI chips get designed at all ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).
