---json
{
 "id": "photomasks-and-pellicles",
 "number": 5,
 "title": "Photomasks and Pellicles",
 "oneLiner": "A business worth tens of billions of yen sits under every leading-edge chip. Two Japanese firms make almost all the blank plates that EUV masks are built on, one Japanese firm inspects them, and the dust cover meant to protect them is still not in production.",
 "plain": "A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so the plate cannot be a window. Instead it is a mirror, built up from about forty pairs of ultrathin layers, and the light bounces off it. Any speck of dust on the plate repeats on every wafer it prints. Two Japanese firms make almost all of those mirrors. A business almost nobody has heard of can hold up every advanced chip in the world.",
 "bridge": "Look next at the stencil itself, because everything the machine prints is decided by what is written on that one plate.",
 "specimen": "photomask",
 "specimenCaption": "A six-inch EUV mask, or reticle, with its pellicle dust cover. Low-thermal-expansion glass at the base, the molybdenum and silicon multilayer mirror in copper round the top edge, a tantalum absorber carrying the pattern, and the membrane held 2.5 mm off the surface on four glued pads, far enough that a particle landing on it prints out of focus.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "AGC", "country": "JP", "share": "Ranks itself No.1 worldwide in EUV mask blanks and counts three suppliers in all; targeted over ¥40bn of blank sales by 2025"},
 {"name": "Hoya", "country": "JP", "share": "Says its share of mask blanks is exceptionally high, and expects to keep its lead as customers add second sources"},
 {"name": "Lasertec", "country": "JP", "share": "The only supplier of EUV mask inspection at the wavelength the scanner itself uses; JPY 230.5bn revenue in the year to June 2026"},
 {"name": "IMS Nanofabrication", "country": "AT", "share": "Intel calls it the established industry leader in multi-beam mask writers, the machines that cut the pattern"},
 {"name": "Photronics", "country": "US", "share": "Largest mask maker selling to outside customers; $849.3M revenue in fiscal 2025"}
 ],
 "countries": [
 {"code": "JP", "note": "Mask blanks (AGC, Hoya), DUV blanks (Shin-Etsu), inspection (Lasertec), writers (NuFlare), pellicles (Mitsui Chemicals)"},
 {"code": "AT", "note": "IMS Nanofabrication multi-beam mask writers, Vienna"},
 {"code": "DE", "note": "Zeiss mask repair and metrology"},
 {"code": "US", "note": "Photronics merchant mask shops, KLA inspection"},
 {"code": "TW", "note": "TSMC's in-house mask shop, and a 10% stake in IMS"}
 ],
 "chinaStatus": "SMIC runs two in-house mask shops in Shanghai, but only for the older g-line, i-line, KrF and ArF tools. There is no Chinese EUV blank, no Chinese tool that inspects a mask at EUV wavelength and no Chinese multi-beam writer.",
 "usStatus": "Photronics is the largest mask maker selling to outside customers and KLA supplies inspection tools, but no US firm makes an EUV blank or an EUV-wavelength inspection tool.",
 "costSignal": "A leading-edge mask set runs roughly $10M to $40M, depending on the node and on the estimate",
 "substitutability": {"band": "Hard", "test": "Three firms make EUV blanks and one sells the actinic inspection tool; three have already walked the path", "why": "AGC and Hoya took two decades to learn the forty-layer blank, but that is the inventor's clock, not the buyer's. Three firms have now done it and the structure of the plate is published, so a well-funded entrant is copying rather than inventing: five to ten years to a qualified blank, and the harder half is Lasertec's actinic inspection, the only tool that sees a mask at the wavelength the scanner uses. Entrants stayed out because the business was too small to fund, which is the one barrier money removes."}
 },
 "keyFacts": [
 {"fact": "AGC calls itself the world's only maker of EUV mask blanks handling every step from glass material to coating, and expanded capacity by about 30% in 2025 under a METI supply-chain program", "source": "https://www.agc.com/en/news/detail/1203819_2814.html"},
 {"fact": "Hoya says it holds an exceptionally high share of the mask blank market and expects customers to move gradually toward multi-sourcing EUV blanks", "source": "https://www.hoya.com/ir/2025/en/review/it.html"},
 {"fact": "AGC says it is one of three companies worldwide that supply photomask blanks for EUV lithography, and the only one that handles every material and process itself", "source": "https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html"},
 {"fact": "AGC's own data book lists EUV lithography photomask blanks as a No.1 worldwide position, on AGC's fiscal 2026 estimates", "source": "https://www.agc.com/en/ir/library/outline/pdf/reference.pdf"},
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
 "title": "Cost of one mask set by node, 2022 estimates",
 "unit": "$M",
 "data": [["28 nm", 1], ["7 nm", 10], ["3 nm", 40]],
 "source": {"label": "SemiAnalysis", "url": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"}
 }
 ]
}
---
# Photomasks and Pellicles

Every EUV layer on an AI accelerator needs a flawless mask, built on a blank plate that two Japanese firms supply and passed by an inspection tool that one Japanese firm makes. AGC, one of the two, says it is the only company in the world that takes an EUV blank all the way from the glass to the finished coating ([source](https://www.agc.com/en/news/detail/1203819_2814.html)).

## How it works

A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so the plate cannot be a window. Instead it is a mirror, built up from about forty pairs of ultrathin layers, and the light bounces off it. Any speck of dust on the plate repeats on every wafer it prints. Two Japanese firms make almost all of those mirrors. A business almost nobody has heard of can hold up every advanced chip in the world.

A deep ultraviolet mask lets light through: quartz carrying a light-blocking film such as molybdenum silicide, and Shin-Etsu supplies those blanks ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)). An EUV mask reflects instead, about 40 molybdenum and silicon layer pairs, 7 nm to a pair, laid on low-expansion glass under a tantalum absorber that carries the pattern ([source](https://arxiv.org/pdf/1912.09075)). Making the plate a mirror creates its own problems:

- **Mask 3D effects.** Light strikes the mirror at an angle rather than head-on, which distorts the printed shape, so software has to correct for it in advance.
- **Write precision.** Every edge of the absorber has to sit within a few nanometers of where the design says.
- **Particles.** Anything on the reflector prints on every wafer until someone finds it.

High-NA scanners halve the patch of wafer one exposure covers and double the exposures needed, so a large die has to be stitched from two masks ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). On 8 September 2026 ASML and TSMC announced a move to 12-inch masks to remove that limit, with a pilot line in 2031 ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).

## Variants and trade-offs

### Blanks

The blank is where two decades of learning sit: laying down forty layer pairs across a six-inch plate, flat to within less than an angstrom, a tenth of a nanometer, with no particle buried anywhere underneath. Nobody publishes a market share for the business, but AGC counts the suppliers. It says it is one of three companies worldwide that supply EUV blanks, and the only one that handles every material and process itself ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). Its own data book lists EUV photomask blanks among the products where AGC holds the No.1 position worldwide ([source](https://www.agc.com/en/ir/library/outline/pdf/reference.pdf)).

Hoya says its share of the mask blank market is exceptionally high, and expects customers to move gradually toward multi-sourcing EUV blanks ([source](https://www.hoya.com/ir/2025/en/review/it.html)). AGC raised its EUV blank capacity by about 30 percent in 2025, on a line in Fukushima funded under a METI supply-chain program, and was aiming for more than ¥40 billion of sales in the business ([source](https://www.agc.com/en/news/detail/1203819_2814.html)).

### Writers

An electron-beam writer cuts the pattern into a sensitive coating on the blank. Multi-beam writers fire many beams at once, which is what lets a dense EUV mask finish in a usable time, and two firms make them: IMS Nanofabrication of Vienna and Japan's NuFlare. Intel calls IMS the established leader, and sold roughly 10 percent of it to TSMC in September 2023 at a valuation near $4.3 billion ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)).

### Inspection and repair

A mask defect costs yield on every wafer that mask prints, so fabs check masks three times: as blanks, after patterning and again in production. Actinic inspection looks at 13.5 nm, the wavelength the mask itself sees, and Lasertec is the only supplier, on JPY 230.5 billion of net sales in the year to June 2026 ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)). KLA sells optical reticle inspection; Zeiss sells e-beam repair.

### Pellicles

A pellicle is a thin membrane on a frame above the mask. Particles land on it rather than on the pattern, too far out of focus to print.

ASML's EUV membrane is 13 nanometers thick, has to hold together at 500 degrees Celsius in vacuum, and every photon it absorbs is light that never reaches the wafer ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). The light crosses it twice, on the way in and on the way back off the mirror, so absorption counts double.

Carbon nanotube membranes are the intended fix, still short of production in a leading-edge fab. Imec has mounted them on reticles and exposed them in an NXE:3300 scanner, measuring single-pass transmission up to 97 percent and finding the effect on imaging low and correctable ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)). Mitsui Chemicals, licensed by ASML, is building capacity at Iwakuni-Ohtake for membranes above 92 percent transmittance that can stand sources above 1,000 W ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)).

## Cost and design economics

SemiAnalysis put mask sets beyond $1 million at 28 nm, beyond $10 million at 7 nm and near $40 million at 3 nm, as of 2022 ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

That cost decides who can use a node at all. A GPU spread over hundreds of thousands of units absorbs a $40 million mask set easily; the same set kills a custom inference chip shipping in the thousands ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). That is why so much AI silicon converges on a handful of designs.

{{figure:mask-set-cost}}

## Who makes it

Mask making splits between fabs that make their own and firms that sell to everyone. TSMC, Samsung and Intel run their own leading-edge mask shops, because they want to control turnaround time. Photronics is the largest outside supplier, on $849.3 million of fiscal 2025 revenue, of which $615.1 million was IC masks ([source](https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html)). Toppan, Dai Nippon Printing and Hoya take most of the rest.

SMIC runs two in-house mask shops in Shanghai, for g-line, i-line, KrF and ArF tools ([source](https://www.smics.com/en/site/mask)). There is no Chinese EUV blank, no Chinese actinic inspection tool and no Chinese multi-beam writer.

## The chokepoint

Mask blanks are as concentrated as lithography, on a fraction of the money. Three firms supply EUV blanks worldwide, AGC says ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)), one firm certifies them, and neither business is big enough to attract a funded entrant. Nobody starts from scratch at ¥40 billion of annual sales, to serve a handful of customers, with twenty years of defect learning ahead ([source](https://www.agc.com/en/news/detail/1203819_2814.html)). What has kept the count at three is money rather than physics.

A decade on, no pellicle membrane is transparent, tough and long-lived at once, so fabs trade throughput against defect risk. A production carbon nanotube pellicle would move EUV cost per wafer more than any scanner improvement.

## Key evaluation criteria

- **Blank defectivity.** Particles buried in the multilayer cannot be repaired, so blank yield sets mask yield.
- **Write time and placement.** Multi-beam writers make dense, curved EUV patterns affordable, and Intel calls IMS the established industry leader in them ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)).
- **Actinic inspectability.** Only a 13.5 nm inspection sees what the scanner sees, and only Lasertec sells one ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)).
- **Pellicle transmission and lifetime.** Transmission counts twice, and the best demonstrated carbon nanotube membranes pass 97 percent in a single crossing ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)).
- **Mask-set cost per node.** $10M to $40M at the leading edge, which decides which designs can use it ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

## Takeaways

Photomasks are the cheapest chokepoint in this chain, which is why nobody has funded an entrant. Three blank suppliers in the world on AGC's count ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)), one of them describing its own share as exceptionally high ([source](https://www.hoya.com/ir/2025/en/review/it.html)), and a single-vendor actinic inspection tool ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)) sit under every EUV layer of every leading-edge accelerator. Pellicles remain unproven in production, so fabs trade throughput against defect risk product by product ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). And mask-set costs of $10 million to $40 million decide which AI chips get designed ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).
