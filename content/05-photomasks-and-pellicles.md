---json
{
 "id": "photomasks-and-pellicles",
 "number": 5,
 "title": "Photomasks and Pellicles",
 "oneLiner": "Only three firms in the world make the blank plates for the masks used to print the finest layers of leading-edge chips. Japan's AGC and Hoya are two of them.",
 "plain": "A photomask is the stencil that lithography prints from, one for each layer of a chip. The same mask prints its layer on wafer after wafer, so one mask shapes millions of chips. The most complicated layers are printed with extreme ultraviolet (EUV) light, and the rest can often be printed with deep ultraviolet light shone through a quartz plate. No glass lets EUV light through, so the mask for those layers is a mirror. The mirror is built up from about forty pairs of thin layers, and the light bounces off it. A dark pattern drawn on top of the mirror soaks up the light wherever no line should print. Any speck of dust on the mask repeats on every wafer it prints. Japan's AGC and Hoya are two of the three firms that make those mirrors.",
 "bridge": "Look next at the stencil itself, because everything the machine prints is decided by what is written on that one plate.",
 "specimen": "photomask",
 "specimenCaption": "An EUV photomask, or reticle, with its pellicle dust cover. The mask, drawn to scale, is a 152 mm square of glass 6.35 mm thick, about the size of a small floor tile. The dark blue band around the top edge is the mirror coating. The real coating is 280 nm thick, far thinner than drawn.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "AGC", "country": "JP", "share": "Ranks itself No.2 worldwide in EUV mask blanks on its own fiscal 2026 estimates"},
 {"name": "Hoya", "country": "JP", "share": "Says its share of mask blanks is exceptionally high"},
 {"name": "Lasertec", "country": "JP", "share": "Launched the world's first tool that inspects patterned EUV masks at the scanner's own wavelength (2019)"},
 {"name": "IMS Nanofabrication", "country": "AT", "share": "CSET puts its 2025 share of the market for all electron-beam mask writers at 46.6%"},
 {"name": "Photronics", "country": "US", "share": "Calls itself one of the world's leading photomask makers, with $849.3M of revenue in fiscal 2025"}
 ],
 "countries": [
 {"code": "JP", "note": "Mask blanks (AGC, Hoya), DUV blanks (Shin-Etsu), inspection (Lasertec), writers (NuFlare), pellicles (Mitsui Chemicals)"},
 {"code": "AT", "note": "IMS Nanofabrication multi-beam mask writers"},
 {"code": "DE", "note": "Zeiss mask checking in EUV light (AIMS EUV) and mask repair"},
 {"code": "US", "note": "Photronics merchant mask shops, KLA inspection"},
 {"code": "TW", "note": "TSMC, which held 10% of IMS at the end of 2024"}
 ],
 "chinaStatus": "SMIC runs two mask shops of its own in Shanghai. No Chinese firm appears in CSET's 2025 market shares for electron-beam mask writers, the machines that draw the pattern onto a mask.",
 "usStatus": "Photronics calls itself one of the world's leading photomask makers, and KLA makes mask inspection tools.",
 "costSignal": "$40M for a leading-edge mask set, SemiAnalysis's May 2026 figure. In July 2022 it put a 7 nm set above $10M",
 "substitutability": {"band": "Hard", "test": "AGC says only three firms supply the blank plates for EUV masks.", "why": "AGC says it spent more than a decade meeting the blank's requirements, and mass production began only in 2017. Inspection is harder. Germany's Zeiss calls its AIMS the only system that tests how a mask will print under conditions equivalent to the scanner's."}
 },
 "keyFacts": [
 {"fact": "AGC calls itself the world's only maker of EUV mask blanks that handles every step from glass material to coating. In April 2023 it said its capacity would grow by about 30% in 2025 under a supply-chain program of METI, Japan's industry ministry", "source": "https://www.agc.com/en/news/detail/1203819_2814.html"},
 {"fact": "Hoya says it holds an exceptionally high share of the mask blank market, and that customers may gradually start buying EUV blanks from more than one supplier", "source": "https://www.hoya.com/ir/2025/en/review/it.html"},
 {"fact": "AGC says it is one of three companies worldwide that supply photomask blanks for EUV lithography, and the only one that handles every material and process itself. In December 2024 it said its EUV blank sales grew 50% in 2023", "source": "https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html"},
 {"fact": "AGC said in June 2026 that its EUV blank sales reached ¥40bn in 2024, declined in 2025 and were recovering in 2026", "source": "https://www.agc.com/en/ir/library/bizbriefing/pdf/2026_0602esemiconductor_transcript.pdf"},
 {"fact": "In its August 2026 company overview, AGC sets out capacity expansions of 20-50% across EUV mask blanks, polishing slurry and lens materials for lithography tools, with no separate figure for the blanks. Mass production on the added capacity is to begin in 2028", "source": "https://www.agc.com/en/ir/library/outline/pdf/c_overview.pdf"},
 {"fact": "AGC's own data book ranks the company No.2 worldwide in EUV lithography photomask blanks, on AGC's fiscal 2026 estimates", "source": "https://www.agc.com/en/ir/library/outline/pdf/reference.pdf"},
 {"fact": "An EUV mask's mirror is about 40 molybdenum and silicon layer pairs, 7 nm to a pair, capped with 3 nm of ruthenium. The absorber on top is 58 nm of TaBN plus 2 nm of TaBO", "source": "https://arxiv.org/pdf/1912.09075"},
 {"fact": "ASML's EUV pellicle is a membrane 13 nm thick that can withstand up to 500°C in a high vacuum. Every photon it absorbs costs the customer output", "source": "https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic"},
 {"fact": "Imec exposed carbon nanotube pellicles in an NXE:3300 scanner and measured up to 97% EUV transmission in a single pass, with a low and correctable effect on imaging", "source": "https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner"},
 {"fact": "Mitsui Chemicals' carbon nanotube pellicles are designed to pass 92% or more of EUV light and to withstand light sources above 1,000 W", "source": "https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm"},
 {"fact": "In July 2022 SemiAnalysis put mask sets above $1M at 28 nm and above $10M at 7 nm, and expected 3 nm sets to approach $40M", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
 {"fact": "In May 2026 SemiAnalysis put a leading-edge photomask set at $40M, and a single respin, remaking a chip after a design flaw, at $50-100M at leading-edge nodes", "source": "https://newsletter.semianalysis.com/p/eda-market-primer"},
 {"fact": "Intel agreed in September 2023 to sell roughly 10% of IMS Nanofabrication to TSMC at a valuation of about $4.3 billion", "source": "https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication"},
 {"fact": "TSMC's 2024 financial statements show its subsidiary TSMC Development holding 10% of IMS Nanofabrication at 31 December 2024, at a fair value of US$432.8 million", "source": "https://www.sec.gov/Archives/edgar/data/1046179/000104617925000019/tsmc2024q4consolidatedfina.htm"},
 {"fact": "Lasertec reported JPY 230,485 million of net sales and JPY 237,504 million of orders in the year to June 2026", "source": "https://www.lasertec.co.jp/en/ir/plan/message.html"},
 {"fact": "Photronics calls itself a leading worldwide maker of photomasks for chips and flat panel displays. It had $849.3 million of revenue in fiscal 2025, $615.1 million of it from chip masks", "source": "https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html"}
 ],
 "figures": [
 {"id": "mask-mirror", "type": "animation", "src": "mask", "title": "How a photomask prints its pattern", "note": "Simplified. The mask is drawn face down, as it sits in the scanner. The mirror layers and the dark pattern are drawn far thicker than they are, and the light's path through the scanner's mirrors is cut to one bounce."},
 {
 "id": "mask-set-cost",
 "type": "bars",
 "title": "What one mask set costs, by node, 2022 ($M). The 28 nm and 7 nm figures are minimums and 3 nm was a projection",
 "unit": "$M",
 "data": [["28 nm", 1], ["7 nm", 10], ["3 nm", 40]],
 "source": {"label": "SemiAnalysis, The Dark Side of the Semiconductor Design Renaissance, July 2022. SemiAnalysis's May 2026 EDA Market Primer puts a leading-edge mask set at $40M", "url": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"}
 }
 ]
}
---
# Photomasks and Pellicles

Each EUV layer of an AI accelerator is printed from a mask built on a blank plate. Only three companies worldwide supply those plates, and two of them are Japan's AGC and Hoya ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). AGC says it is the only company in the world that takes an EUV blank all the way from the glass to the finished coating ([source](https://www.agc.com/en/news/detail/1203819_2814.html)).

## How it works

A photomask is the stencil that lithography prints from, one for each layer of a chip. The same mask prints its layer on wafer after wafer, so one mask shapes millions of chips. The most complicated layers are printed with extreme ultraviolet (EUV) light, and the rest can often be printed with deep ultraviolet light shone through a quartz plate. No glass lets EUV light through, so the mask for those layers is a mirror. The mirror is built up from about forty pairs of thin layers, and the light bounces off it. A dark pattern drawn on top of the mirror soaks up the light wherever no line should print. Any speck of dust on the mask repeats on every wafer it prints. Japan's AGC and Hoya are two of the three firms that make those mirrors.

{{figure:mask-mirror}}

ASML says a chip's most complicated layers are made on EUV machines, while the rest can often be printed on older deep ultraviolet machines ([source](https://www.asml.com/en/products/duv-lithography-systems)). A mask starts as a blank, a polished plate with nothing on it yet. For deep ultraviolet the blank is a window of quartz carrying a light-blocking film such as molybdenum silicide, and Shin-Etsu supplies those blanks ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)). For EUV the blank is a mirror of about 40 molybdenum and silicon layer pairs, 7 nm to a pair, laid on glass ([source](https://arxiv.org/pdf/1912.09075)). A dark tantalum film on top, called the absorber, will carry the pattern ([source](https://arxiv.org/pdf/1912.09075)).

The mask shop coats the blank with a sensitive film called resist. A mask writer then draws the design into the resist with electrons. A single-beam writer flashes one shape at a time, while NuFlare's multi-beam writer for the most advanced masks controls 260,000 beams at once ([source](https://www.nuflare.co.jp/english/products/beam/)).

A wash removes the drawn resist. An etch then removes the blocking film or absorber wherever the resist is gone, and the rest of the resist is stripped. The plate now passes light, or reflects it, in the exact shape of one layer of the chip. On standard scanners the pattern is drawn four times larger than it will print. An inspection tool compares the plate to the design, and a repair tool fixes the stray defects it finds.

Making the plate a mirror creates its own problems:

- **Mask 3D effects.** Light strikes the mirror at a slant, and the absorber has height, so its edges cast small shadows that distort the printed shape. Software has to correct for the shadows in advance.
- **Write precision.** Every edge of the absorber has to sit within a few nanometers of where the design says.
- **Particles.** Anything on the mirror prints on every wafer until someone finds it.

High-NA scanners, the newest EUV machines, print finer lines with larger mirrors. To keep masks at their usual size, their mirrors shrink the pattern four times in one direction and eight times in the other ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). So each exposure covers half the area of a standard exposure, and a wafer takes twice as many exposures ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)).

On 8 September 2026 ASML and TSMC announced a plan to move from the current 6-inch masks to 12-inch masks ([source](https://pr.tsmc.com/english/news/3338)). They expect the change to raise fab productivity, lower chipmaking costs and remove stitching constraints, the design limits that come from printing a large chip in two halves ([source](https://pr.tsmc.com/english/news/3338)). They aim to set up a 12-inch mask pilot line by 2031, so that High-NA scanners using 12-inch masks can enter advanced chip production by 2033 ([source](https://pr.tsmc.com/english/news/3338)).

## Variants and trade-offs

### Blanks

AGC says it spent more than a decade meeting the blank's requirements, which include near-zero thermal expansion, perfectly smooth and flat surfaces and no particle contamination ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). It says mass production began only in 2017 ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)).

AGC publishes no market share figure for EUV blanks. In its data book, AGC ranks itself No.2 worldwide in EUV lithography photomask blanks, based on its own fiscal 2026 estimates ([source](https://www.agc.com/en/ir/library/outline/pdf/reference.pdf)). Hoya says its share of the mask blank market is exceptionally high, and that customers may gradually start buying EUV blanks from more than one supplier ([source](https://www.hoya.com/ir/2025/en/review/it.html)).

In April 2023 AGC said its EUV blank capacity would grow by about 30 percent in 2025 ([source](https://www.agc.com/en/news/detail/1203819_2814.html)). The growth would come from a line in Fukushima, a project that METI, Japan's industry ministry, selected under a program to strengthen supply chains ([source](https://www.agc.com/en/news/detail/1203819_2814.html)). AGC also said it was aiming for more than ¥40 billion of sales in the business by 2025 ([source](https://www.agc.com/en/news/detail/1203819_2814.html)). Its EUV blank sales grew 50 percent in 2023, AGC said in December 2024 ([source](https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html)). In February 2025 AGC reported that the sales reached ¥40 billion in 2024, a year ahead of the 2025 target ([source](https://www.agc.com/en/ir/library/briefing/pdf/2025_0207e_1.pdf)).

The sales then declined in 2025 and were recovering in 2026, AGC said in June 2026 ([source](https://www.agc.com/en/ir/library/bizbriefing/pdf/2026_0602esemiconductor_transcript.pdf)). In August 2026 AGC set out capacity expansions of 20 to 50 percent across EUV blanks, polishing slurry and lens materials for lithography tools ([source](https://www.agc.com/en/ir/library/outline/pdf/c_overview.pdf)). It gave no separate figure for the blanks, and mass production on the added capacity is to begin in 2028 ([source](https://www.agc.com/en/ir/library/outline/pdf/c_overview.pdf)).

### Writers

An electron-beam writer draws the pattern into the resist on the blank. Multi-beam writers fire many beams at once, and Japan's NuFlare sells them for the 3 nm node ([source](https://www.nuflare.co.jp/english/products/beam/)).

In September 2023 Intel called Austria's IMS Nanofabrication the established industry leader in the multi-beam mask writing tools that advanced EUV requires ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)). Counting all electron-beam mask writers, CSET, a research center at Georgetown University, put IMS's share of a $994 million world market at 46.6 percent in 2025 ([source](https://chipexplorer.eto.tech/?parentNode=N25&selectedNode=N29)). NuFlare had 39.2 percent and JEOL 14.2 percent ([source](https://chipexplorer.eto.tech/?parentNode=N25&selectedNode=N29)).

Intel agreed in September 2023 to sell roughly 10 percent of IMS to TSMC at a valuation of about $4.3 billion ([source](https://www.intc.com/news-events/press-releases/detail/1645/intel-to-sell-minority-stake-in-ims-nanofabrication)). TSMC's subsidiary TSMC Development held that 10 percent at the end of 2024, at a fair value of $432.8 million in TSMC's accounts ([source](https://www.sec.gov/Archives/edgar/data/1046179/000104617925000019/tsmc2024q4consolidatedfina.htm)). Intel sold a combined 32 percent of IMS in 2023 and still held the other 68 percent on 27 December 2025 ([source](https://www.sec.gov/Archives/edgar/data/50863/000005086326000011/intc-20251227.htm)).

### Inspection and repair

A mask defect cuts the number of good chips on every wafer that mask prints, so fabs check masks three times: as blanks, after patterning and again in production. Actinic inspection uses 13.5 nm light, the wavelength of EUV lithography ([source](https://www.lasertec.co.jp/en/news/2025/20251031_3912.html)). In 2019 Lasertec launched the world's first actinic inspection system for patterned EUV masks, the ACTIS A150 ([source](https://www.lasertec.co.jp/en/news/2025/20251031_3912.html)). In October 2025 it launched the ACTIS A200HiT series, which it says triples the A150's inspection speed ([source](https://www.lasertec.co.jp/en/news/2025/20251031_3912.html)). Lasertec reported net sales of JPY 230,485 million in the year to June 2026 ([source](https://www.lasertec.co.jp/en/ir/plan/message.html)).

KLA sells optical inspection tools for both EUV masks and optical masks ([source](https://ir.kla.com/news-events/press-releases/detail/95/kla-tencor-introduces-five-patterning-control-systems-for)). Zeiss makes AIMS EUV, which checks a mask in EUV light under the scanner's own imaging conditions to judge how a defect will affect printing ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/products/photomask-solutions/mask-qualification.html)). Zeiss calls AIMS the only system that qualifies a mask under conditions equivalent to the scanner's ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/products/photomask-solutions/mask-qualification.html)). Zeiss says the tool can be extended to ASML's High-NA scanner, the EXE:5000 ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/products/photomask-solutions/mask-qualification.html)). Zeiss also sells electron-beam repair tools that work on EUV masks ([source](https://www.zeiss.com/semiconductor-manufacturing-technology/products/photomask-solutions/mask-repair.html)).

### Pellicles

A pellicle is a thin membrane on a frame above the mask. Particles land on it, too far out of focus to print, and the pattern below stays clean.

ASML's EUV pellicle is a membrane 13 nanometers thick that has to hold together at 500 degrees Celsius in vacuum ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). Every photon it absorbs is light that never reaches the wafer ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). The light crosses it twice, on the way in and on the way back off the mirror, so absorption counts double. ASML released its first EUV pellicles in 2016 and calls the pellicle one of the breakthroughs that brought EUV lithography to high-volume manufacturing ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)).

Carbon nanotube membranes are the next step, aimed at next-generation High-NA, high-output EUV scanners ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)). In 2020 imec, a Belgian chip research center, mounted them on masks and exposed them in an ASML NXE:3300 scanner ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)). The membranes passed up to 97 percent of the light in a single crossing, and imec found their effect on imaging low and correctable ([source](https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner)).

Mitsui Chemicals began commercial production of silicon-based EUV pellicles under an ASML license in 2021 ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)). In 2024 it said it would build a carbon nanotube membrane plant at Iwakuni-Ohtake, tentatively due to finish in December 2025 ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)). The membranes are designed to pass 92 percent or more of the light and to withstand exposure power above 1 kW ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)).

## Cost and design economics

In July 2022 SemiAnalysis put mask sets above $1 million at 28 nm and above $10 million at 7 nm ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). It expected 3 nm mask sets to reach the $40 million range ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). Its May 2026 primer still puts a leading-edge mask set at $40 million ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). The same primer puts a single respin, remaking a chip after a design flaw, at $50 million to $100 million at leading-edge nodes ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

Mask costs restrict which firms can use a node. SemiAnalysis wrote that at 5 nm and 3 nm, only firms with large wafer volume see the cost per transistor fall ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). It wrote that more companies will lack the volume to spread the fixed cost of mask sets ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). It expected failed chip designs to show up first among AI chip startups, which work on much tighter budgets ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

{{figure:mask-set-cost}}

## Who makes it

Mask making splits between chipmakers that make masks for their own use and independent merchant firms that sell to them and others ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)). Photronics says that chipmakers' own shops once supplied most of the market, and that production has more recently tended to move toward the independents ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)).

Photronics calls itself a leading worldwide maker of masks for chips and flat panel displays ([source](https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html)). It had $849.3 million of revenue in fiscal 2025, $615.1 million of it from chip masks ([source](https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html)). The competitors it names in chip and display masks include Dai Nippon Printing, Hoya, Tekscend Photomask and two Chinese firms, Shenzhen Newway Photomask and Shenzhen Qingyi Photomask ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)). It also competes with chipmakers' own mask shops ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)).

SMIC, a Chinese foundry, runs two in-house mask shops in Shanghai, for g-line, i-line, DUV and ArF steppers and scanners ([source](https://www.smics.com/en/site/mask)). Photronics began operating two mask plants in China, in Hefei and Xiamen, in 2019 ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)). Its chip mask business in Xiamen is a joint venture in which Dai Nippon Printing holds 49.99 percent ([source](https://www.sec.gov/Archives/edgar/data/810136/000114036125045801/ef20057458_10k.htm)). No Chinese firm appears in CSET's 2025 market shares for electron-beam mask writers ([source](https://chipexplorer.eto.tech/?parentNode=N25&selectedNode=N29)).

## The chokepoint

Mask blanks are a small, highly concentrated business. In 2019 Lasertec launched the first tool that inspects patterned EUV masks in EUV light ([source](https://www.lasertec.co.jp/en/news/2025/20251031_3912.html)).

Pellicles already work in high-volume EUV manufacturing ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). But ASML says no material is completely transparent to EUV light, so any pellicle in the light's path costs customers productivity ([source](https://www.asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic)). In 2024 Mitsui Chemicals said it would set up production of carbon nanotube membranes for next-generation High-NA, high-output EUV scanners ([source](https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm)).

## Takeaways

On CSET's count, Austria's IMS Nanofabrication held 46.6 percent of the 2025 world market for electron-beam mask writers, which draw the pattern onto a mask ([source](https://chipexplorer.eto.tech/?parentNode=N25&selectedNode=N29)). Hoya says its share of the mask blank market is exceptionally high ([source](https://www.hoya.com/ir/2025/en/review/it.html)).

SemiAnalysis put a full set of masks for a leading-edge chip at $40 million in May 2026 ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). In July 2022 it wrote that more companies will lack the volume to spread the fixed cost of mask sets ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). On 8 September 2026 ASML and TSMC announced a plan to move from 6-inch to 12-inch masks ([source](https://pr.tsmc.com/english/news/3338)). They expect the change to raise fab productivity and lower chipmaking costs ([source](https://pr.tsmc.com/english/news/3338)).
