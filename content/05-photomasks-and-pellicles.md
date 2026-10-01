---json
{
 "id": "photomasks-and-pellicles",
 "number": 5,
 "title": "Photomasks and Pellicles",
 "oneLiner": "Every leading-edge chip depends on a business worth tens of billions of yen. Japan's AGC and Hoya are two of the three firms that make the blank plates EUV masks are built on, Japan's Lasertec built the first tool that inspects finished masks in EUV light, and a membrane 13 nanometers thick catches the dust that would otherwise land on them.",
 "plain": "A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so instead of a window the plate is a mirror, built up from about forty pairs of very thin layers, and the light bounces off it. A dark pattern drawn on top of the mirror soaks up the light wherever no line should print. Any speck of dust on the plate repeats on every wafer it prints. Japan's AGC and Hoya are two of the three firms that make those mirrors. A business almost nobody has heard of can hold up every advanced chip in the world.",
 "bridge": "Look next at the stencil itself, because everything the machine prints is decided by what is written on that one plate.",
 "specimen": "photomask",
 "specimenCaption": "An EUV photomask, or reticle, with its pellicle dust cover. The mask is a 152 mm square of glass, 6.35 mm thick, about the size of a small floor tile, drawn to scale. The dark blue band around the top edge is the mirror coating; the real coating is 280 nm thick, so it is drawn far thicker than it is.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "AGC", "country": "JP", "share": "Ranks itself No.2 worldwide in EUV mask blanks on its own fiscal 2026 estimates and counts three suppliers in all; targeted over ¥40bn of EUV blank sales by 2025"},
 {"name": "Hoya", "country": "JP", "share": "Says its share of mask blanks is exceptionally high, and aims to keep its leading share even if customers gradually move to multi-sourcing EUV blanks"},
 {"name": "Lasertec", "country": "JP", "share": "Launched the world's first patterned EUV mask inspection tool that works at the scanner's own wavelength, in 2019; JPY 230,485 million of net sales in the year to June 2026"},
 {"name": "IMS Nanofabrication", "country": "AT", "share": "Intel calls it the established industry leader in multi-beam mask writers, the machines that draw the pattern onto the mask"},
 {"name": "Photronics", "country": "US", "share": "Calls itself one of the world's leading photomask makers; $849.3M revenue in fiscal 2025"}
 ],
 "countries": [
 {"code": "JP", "note": "Mask blanks (AGC, Hoya), DUV blanks (Shin-Etsu), inspection (Lasertec), writers (NuFlare), pellicles (Mitsui Chemicals)"},
 {"code": "AT", "note": "IMS Nanofabrication multi-beam mask writers, Brunn am Gebirge and Vienna"},
 {"code": "DE", "note": "Zeiss mask repair and metrology"},
 {"code": "US", "note": "Photronics merchant mask shops, KLA inspection"},
 {"code": "TW", "note": "TSMC's in-house mask shop, and a stake of about 10% in IMS"}
 ],
 "chinaStatus": "SMIC runs two mask shops of its own in Shanghai, for g-line, i-line, DUV and ArF steppers and scanners. No Chinese firm makes an EUV mask blank, a tool that checks a mask in EUV light, or a multi-beam writer, the machine that draws the finest patterns onto a mask.",
 "usStatus": "Photronics calls itself one of the world's leading photomask makers, and KLA makes mask inspection tools, but no American firm makes an EUV mask blank or a tool that checks a mask in EUV light.",
 "costSignal": "A mask set for the newest chips costs roughly $10M to $40M, depending on the node, on 2022 SemiAnalysis estimates",
 "substitutability": {"band": "Hard", "test": "AGC says only three firms supply the blank plates for EUV masks, and Lasertec was the first to sell a tool that checks a finished mask in EUV light.", "why": "An EUV mask starts as a blank plate coated with forty pairs of layers. AGC says it invested more than a decade in meeting the blank's requirements, and mass production only began in 2017. Three firms have now done it and the structure of the plate is published, so a newcomer knows what to build. The harder part is inspection, where Lasertec launched the world's first tool that checks a patterned mask in the same EUV light the scanner uses, in 2019."}
 },
 "keyFacts": [
 {"fact": "AGC calls itself the world's only maker of EUV mask blanks handling every step from glass material to coating, and said in 2023 that its capacity would expand by about 30% in 2025 under a METI supply-chain program", "source": "https://www.agc.com/en/news/detail/1203819_2814.html"},
 {"fact": "Hoya says it holds an exceptionally high share of the mask blank market and that customers may gradually move toward multi-sourcing EUV blanks", "source": "https://www.hoya.com/ir/2025/en/review/it.html"},
 {"fact": "AGC says it is one of three companies worldwide that supply photomask blanks for EUV lithography, and the only one that handles every material and process itself", "source": "https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html"},
 {"fact": "AGC's own data book lists EUV lithography photomask blanks as a No.2 worldwide position, on AGC's fiscal 2026 estimates", "source": "https://www.agc.com/en/ir/library/outline/pdf/reference.pdf"},
 {"fact": "An EUV mask reflector is about 40 Mo/Si bilayers of 7 nm period, capped with 3 nm of ruthenium, under a 58 nm TaBN plus 2 nm TaBO absorber", "source": "https://arxiv.org/pdf/1912.09075"},
 {"fact": "ASML's EUV pellicle is a membrane 13 nm thick that can withstand up to 500°C in a high vacuum, and every photon it absorbs costs the customer output", "source": "https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic"},
 {"fact": "Imec exposed carbon nanotube pellicles with up to 97% single-pass EUV transmission on an NXE:3300 scanner, with low and correctable imaging impact", "source": "https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner"},
 {"fact": "Mitsui Chemicals' carbon nanotube pellicles target 92% or higher EUV transmittance and sources above 1,000 W", "source": "https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm"},
 {"fact": "Mask sets cost over $1M at 28 nm, over $10M at 7 nm and about $40M at 3 nm (2022 estimate)", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
 {"fact": "Intel agreed in September 2023 to sell roughly 10% of IMS Nanofabrication to TSMC at a valuation of about $4.3 billion", "source": "https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication"},
 {"fact": "Lasertec reported JPY 230,485 million of net sales and JPY 237,504 million of orders in the year to June 2026", "source": "https://www.lasertec.co.jp/en/ir/plan/message.html"},
 {"fact": "Photronics, a leading worldwide maker of IC and flat panel display photomasks, had $849.3 million of revenue in fiscal 2025, of which $615.1 million was IC masks", "source": "https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html"}
 ],
 "figures": [
 {"id": "mask-mirror", "type": "animation", "src": "mask", "title": "How a photomask prints its pattern", "note": "Simplified. The mask is drawn face down, as it sits in the scanner. The mirror layers and the dark pattern are drawn far thicker than they are, and the light's path through the scanner's mirrors is cut to one bounce."},
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

Every EUV layer on an AI accelerator needs a flawless mask, built on a blank plate from one of only three suppliers worldwide, two of which are Japan's AGC and Hoya ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). AGC says it is the only company in the world that takes an EUV blank all the way from the glass to the finished coating ([source](https://www.agc.com/en/news/detail/1203819_2814.html)).

## How it works

A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so instead of a window the plate is a mirror, built up from about forty pairs of very thin layers, and the light bounces off it. A dark pattern drawn on top of the mirror soaks up the light wherever no line should print. Any speck of dust on the plate repeats on every wafer it prints. Japan's AGC and Hoya are two of the three firms that make those mirrors ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). A business almost nobody has heard of can hold up every advanced chip in the world.

{{figure:mask-mirror}}

A mask starts as a blank, a polished plate with nothing on it yet. For deep ultraviolet the blank is a window of quartz carrying a light-blocking film such as molybdenum silicide, and Shin-Etsu supplies those blanks ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)). For EUV the blank is a mirror of about 40 molybdenum and silicon layer pairs, 7 nm to a pair, laid on glass, with a dark tantalum film on top, the absorber, that will carry the pattern ([source](https://arxiv.org/pdf/1912.09075)).

The mask shop coats the blank with resist, and a mask writer draws the design into the coating with a beam of electrons, one shape at a time, over many hours. A wash removes the drawn resist, an etch removes the blocking film or absorber wherever the resist is gone, and the rest of the resist is stripped. The plate now passes light, or reflects it, in the exact shape of one layer of the chip, four times larger than it will print. An inspection tool compares the plate to the design, and a repair tool fixes the stray defects it finds.

Making the plate a mirror creates its own problems:

- **Mask 3D effects.** Light strikes the mirror at a slant, and the absorber has height, so its edges throw small shadows that distort the printed shape; software has to correct for it in advance.
- **Write precision.** Every edge of the absorber has to sit within a few nanometers of where the design says.
- **Particles.** Anything on the reflector prints on every wafer until someone finds it.

High-NA scanners, the newest EUV machines, print finer lines with larger mirrors, and each exposure then covers half the patch of wafer, so a wafer takes twice as many exposures ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). On 8 September 2026 ASML and TSMC announced an initiative to move from today's 6-inch masks to 12-inch masks, which they expect to raise fab productivity, lower chipmaking costs and remove stitching constraints, and they aim to set up a pilot line by 2031 ([source](https://pr.tsmc.com/english/news/3338)).

## Variants and trade-offs

### Blanks

AGC says it invested more than a decade in meeting the blank's requirements, which include near-zero thermal expansion, perfectly smooth and flat surfaces and no particle contamination, and mass production only began in 2017 ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). AGC publishes no share figure for EUV blanks, but it counts the suppliers. It says it is one of three companies worldwide that supply EUV blanks, and the only one that handles every material and process itself ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). Its own data book ranks AGC No.2 worldwide in EUV lithography photomask blanks, based on AGC's fiscal 2026 estimates ([source](https://www.agc.com/en/ir/library/outline/pdf/reference.pdf)).

Hoya says its share of the mask blank market is exceptionally high, and that customers may gradually move toward multi-sourcing EUV blanks ([source](https://www.hoya.com/ir/2025/en/review/it.html)). In 2023 AGC said its EUV blank capacity would grow by about 30 percent in 2025, on a line in Fukushima selected under a METI supply-chain program, and that it was aiming for more than ¥40 billion of sales in the business by 2025 ([source](https://www.agc.com/en/news/detail/1203819_2814.html)).

### Writers

An electron-beam writer cuts the pattern into a sensitive coating on the blank. Multi-beam writers fire many beams at once, and Japan's NuFlare sells them for 3 nm node design rules ([source](https://www.nuflare.co.jp/english/products/beam/)). Intel calls Austria's IMS Nanofabrication the established industry leader in the multi-beam mask writing tools that advanced EUV requires, and agreed in September 2023 to sell roughly 10 percent of it to TSMC at a valuation of about $4.3 billion ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)).

### Inspection and repair

A mask defect costs yield on every wafer that mask prints, so fabs check masks three times: as blanks, after patterning and again in production. Actinic inspection uses 13.5 nm light, the wavelength of EUV lithography, and Lasertec launched the world's first actinic EUV patterned mask inspection system, the ACTIS A150, in 2019 ([source](https://www.lasertec.co.jp/en/news/2025/20251031_3912.html)). Lasertec reported net sales of JPY 230,485 million in the year to June 2026 ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)). KLA sells optical reticle inspection tools for both EUV and optical masks ([source](https://ir.kla.com/news-events/press-releases/detail/95/kla-tencor-introduces-five-patterning-control-systems-for)). Zeiss sells electron-beam repair tools that work on EUV masks ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/products/photomask-solutions/mask-repair.html)).

### Pellicles

A pellicle is a thin membrane on a frame above the mask. Particles land on it, too far out of focus to print, and the pattern below stays clean.

ASML's EUV membrane is 13 nanometers thick, has to hold together at 500 degrees Celsius in vacuum, and every photon it absorbs is light that never reaches the wafer ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). ASML released its first EUV pellicles in 2016 and calls the pellicle one of the breakthroughs that brought EUV lithography to high-volume manufacturing ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). The light crosses it twice, on the way in and on the way back off the mirror, so absorption counts double.

Carbon nanotube membranes are the next step, aimed at next-generation High-NA, high-output EUV scanners ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)). In 2020 imec mounted them on reticles and exposed them in an NXE:3300 scanner, measuring single-pass transmission up to 97 percent and finding the effect on imaging low and correctable ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)). Mitsui Chemicals, which began commercial production of silicon-based EUV pellicles under an ASML license in 2021, said in 2024 it would build a plant at Iwakuni-Ohtake, tentatively due to finish in December 2025, for carbon nanotube membranes with 92 percent or higher transmittance that withstand exposure power above 1 kW ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)).

## Cost and design economics

SemiAnalysis put mask sets beyond $1 million at 28 nm and beyond $10 million at 7 nm, and in 2022 expected 3 nm mask sets to push into the $40 million range ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

That cost decides who can use a node at all. SemiAnalysis wrote that falling cost per transistor at 5 nm and 3 nm is limited to firms with large wafer volume, and that more companies will lack the volume to spread the fixed cost of mask sets ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). It expected failed chip designs to show up first among AI chip startups, which work on much tighter budgets ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

{{figure:mask-set-cost}}

## Who makes it

Mask making splits between chipmakers that make masks for their own use and independent merchant firms that sell to them and others ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)). Photronics says the market was majority captive-supplied for a period, and that production has more recently tended to move toward the independents ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)). Photronics, a leading worldwide maker of IC and flat panel display masks, had $849.3 million of fiscal 2025 revenue, of which $615.1 million was IC masks ([source](https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html)). Its named competitors include Dai Nippon Printing, Hoya and Tekscend Photomask, and it also competes with chipmakers' own mask shops ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)).

SMIC runs two in-house mask shops in Shanghai, for g-line, i-line, DUV and ArF steppers and scanners ([source](https://www.smics.com/en/site/mask)). There is no Chinese EUV blank, no Chinese actinic inspection tool and no Chinese multi-beam writer.

## The chokepoint

Mask blanks are a small, highly concentrated business. Three firms supply EUV blanks worldwide, AGC says, and AGC spent more than a decade meeting the blank's requirements before mass production began in 2017 ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). AGC's own sales target for the business was more than ¥40 billion by 2025 ([source](https://www.agc.com/en/news/detail/1203819_2814.html)). Lasertec launched the first tool that inspects patterned EUV masks in EUV light, in 2019 ([source](https://www.lasertec.co.jp/en/news/2025/20251031_3912.html)).

Pellicles already work in high-volume EUV manufacturing, but ASML says no material is completely transparent to EUV light, so any pellicle in the light's path costs customers productivity ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). In 2024 Mitsui Chemicals said it would set up production of carbon nanotube membranes for next-generation High-NA, high-output EUV scanners ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)).

## Key evaluation criteria

- **Blank defectivity.** Particles buried in the multilayer cannot be repaired, so blank yield sets mask yield.
- **Write time and placement.** Intel says advanced EUV requires multi-beam mask writing tools, and calls IMS the established industry leader in them ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)).
- **Actinic inspectability.** A 13.5 nm inspection uses the same wavelength as EUV lithography, and Lasertec launched the first one for patterned masks in 2019 ([source](https://www.lasertec.co.jp/en/news/2025/20251031_3912.html)).
- **Pellicle transmission and lifetime.** Transmission counts twice, and imec measured carbon nanotube membranes passing up to 97 percent in a single crossing in 2020 ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)).
- **Mask-set cost per node.** $10M to $40M at the leading edge, which decides which designs can use it ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

## Takeaways

AGC says it is one of only three companies in the world that make the blank glass plates for EUV photomasks, the stencils used to print a chip's finest layers ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). Hoya, another Japanese maker of these blanks, says its share of the market is exceptionally high ([source](https://www.hoya.com/ir/2025/en/review/it.html)). SemiAnalysis expected a full set of masks for a 3 nm chip to cost near $40 million, a fixed cost that only chips sold in large numbers can repay ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).
