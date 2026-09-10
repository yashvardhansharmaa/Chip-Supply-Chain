# AI Chips page: gap audit

Inventory taken 10 September 2026 across all 35 chips in `data/landscape.json`, then worked worst first. "Was" and "Now" count empty, hedged or contradicted fields out of the 28 audited per chip. Total fell from 419 to 385, and eleven wrong or unsupported statements came out.

| Chip | Was | Now | Fields empty, hedged or contradicted at the start |
|---|---|---|---|
| moore-threads-mtt-s5000 | 23 | 22 | foundry, node, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, memType, stacks, memGB, memBW, memSup, fp16, fp8, fp4, c2c, scaleUp, tdp, price, bom, integrators |
| cambricon-siyuan-590 | 21 | 20 | dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, memType (hedged), stacks, memGB, memBW, memSup, fp16, fp8, fp4, c2c, scaleUp, scaleOut, tdp, price, bom |
| meta-mtia-400 | 19 | 18 | ship, node, dies, dieArea, xtors, reticle, pkg (hedged), assembler, pkgSize, stacks, memGB, memBW, memSup, fp16, fp8, fp4, tdp, price, bom; **c2c and scaleOut carried MTIA 300 figures** |
| google-tpu-v6e | 18 | 18 | ship, foundry, node, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, stacks, memSup, fp8, fp4, tdp, price, bom, integrators |
| google-tpu-v5e | 18 | 17 | ship, foundry, node, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, stacks, memSup, fp8, fp4, tdp, price, bom, integrators |
| google-tpu-8i | 17 | 17 | ship, node, dieArea, xtors, reticle, pkg, assembler, pkgSize, memType (hedged), stacks, memSup, fp16, fp8, tdp, price, bom, integrators |
| google-tpu-v5p | 17 | 17 | ship, foundry, node, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, stacks, memSup, fp4, tdp, price, bom, integrators |
| google-tpu-v4 | 17 | 17 | ship, foundry, node, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, stacks, memSup, fp8, fp4, price, bom, integrators |
| openai-jalapeno | 17 | 16 | ship, foundry, node, dieArea, xtors, pkg, assembler, pkgSize, stacks, memGB, memBW, memSup, fp16, fp8, fp4, price, bom; **die count contradicted the layout** |
| huawei-ascend-910b | 17 | 17 | ship, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, stacks, memSup, fp8, fp4, scaleUp, scaleOut, price, bom, integrators |
| aws-trainium2 | 16 | 16 | foundry, node, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, stacks, memSup, fp4, tdp, price, bom, integrators |
| huawei-ascend-950pr | 15 | 15 | node, dies, dieArea, xtors, reticle, pkg, assembler, pkgSize, stacks, memGB, memBW, fp16, tdp, price, bom |
| nvidia-h20 | 14 | 11 | dieArea, xtors, reticle, pkgSize, stacks, memSup, fp8, fp4, c2c (hedged), scaleOut (hedged), price, bom, integrators |
| microsoft-maia-100 | 14 | 13 | ship, xtors, reticle, pkgSize, stacks, memGB, memBW, memSup, fp8, fp4, price, bom, integrators |
| intel-gaudi2 | 13 | 12 | foundry, dies, dieArea, xtors, reticle, assembler, pkgSize, stacks, memSup, fp4, price, bom, integrators |
| meta-mtia-v2 | 12 | 11 | ship, xtors, pkg, assembler, pkgSize, memSup, fp8, fp4, scaleOut, price, bom, integrators |
| google-tpu-v7-ironwood | 11 | 8 | dieArea, xtors, reticle, pkg (hedged), assembler, pkgSize, **stacks**, fp4, tdp, price, bom; **die count contradicted the layout** |
| microsoft-maia-200 | 11 | 10 | dieArea, reticle, pkg, assembler, pkgSize, stacks, memSup, **fp16**, price, bom, integrators; **notes gave a die area that belongs to Maia 100** |
| groq-lpu | 11 | 9 | xtors, pkg, assembler, pkgSize, **memGB**, memSup, fp16, fp4, **tdp**, price, integrators |
| cerebras-wse3-turbo | 10 | 8 | assembler, pkgSize, memSup, fp16, fp8, fp4, tdp, price, bom, integrators |
| huawei-ascend-910c | 10 | 8 | dieArea, xtors, reticle, assembler, pkgSize, **memGB**, fp8, fp4, **tdp**, bom |
| amd-mi455x | 9 | 6 | node (hedged), dies, dieArea, **xtors**, assembler, pkgSize, tdp, bom, integrators |
| aws-trainium3 | 9 | 9 | dieArea, xtors, reticle, assembler, pkgSize, tdp, price, bom, integrators |
| intel-gaudi3 | 9 | 8 | dieArea, xtors, reticle, assembler, pkgSize, memSup, fp4, price, bom |
| nvidia-a800 | 8 | 7 | assembler, pkgSize, memSup, fp8, fp4, price, bom, integrators |
| nvidia-a100 | 8 | 7 | assembler, pkgSize, memSup, fp8, fp4, price, bom, integrators |
| amd-mi325x | 8 | 8 | dieArea, assembler, pkgSize, memSup, fp4, price, bom, integrators |
| amd-mi300x | 8 | 8 | dieArea, assembler, pkgSize, memSup, fp4, price, bom, integrators |
| nvidia-h800 | 7 | 6 | assembler, pkgSize, memSup, fp4, price, bom, integrators |
| nvidia-h100 | 7 | 6 | assembler, pkgSize, memSup, fp4, price, bom, integrators |
| nvidia-vr200 | 6 | 5 | dieArea, assembler, pkgSize, fp16, tdp, bom; **bandwidth and NVLink contradicted between two Nvidia pages** |
| nvidia-b200 | 5 | 4 | dieArea, assembler, pkgSize, price, bom |
| nvidia-b300 | 5 | 4 | dieArea, assembler, pkgSize, price, bom |
| nvidia-h200-china | 5 | 4 | assembler, pkgSize, fp4, price, bom |
| amd-mi355x | 4 | 3 | dieArea, assembler, pkgSize, bom |

## Filled, with the source for each

- **Ironwood** now carries eight HBM3E stacks and two chiplets, both stated by Google: the Cloud TPU documentation says the chip "is composed of two distinct chiplets, each with its own dedicated memory space", one TensorCore, two SparseCores and 96 GB apiece, and the architecture post names the eight stacks at a peak 7.4 TB/s.
- **Maia 200** gains 1,263 TFLOPS BF16, derived from Microsoft's own deep dive, which states 10.1 PetaOPS FP4 and that FP4 runs at twice FP8 and eight times BF16. Epoch AI reaches 1,268 by the same arithmetic.
- **MI455X** gains 320 billion transistors from AMD's specification list, which also gives 256 work group processors, 192 MB of L2, an EAM form factor and a 23 July 2026 launch. AMD's own wording on the node, "TSMC 2nm | 3nm FinFET", replaces the hedge.
- **Ascend 910C** gains 128 GB and 700 W from Epoch AI. **Groq** gains 215 W and 230 MB of SRAM, Epoch's record of a Groq product brief whose URL now 404s. **TPU v5e** gains the 325 mm² die Epoch gives, which the export-control paragraph already relied on. **Gaudi 2** gains TSMC as the foundry, which Intel never names.

## Staying null

Price and bill of materials are empty on 33 of 35 chips because no allowed source publishes either; the two exceptions are rack prices, not chip prices. Memory suppliers are empty wherever no vendor names one, which is every chip except the ones where Nvidia, AMD, AWS or Google says so. System integrators are empty for internal silicon and for the Hopper and Ampere parts, because Nvidia's product pages point to a qualified-system catalogue instead of naming partners. FP4 is empty on every pre-Blackwell architecture, which has no four-bit datapath, and FP8 on Ampere for the same reason. Google publishes no node, foundry, die area, transistor count or package for any TPU; Huawei, Cambricon and Moore Threads publish almost nothing at all. Moore Threads gives no memory figures on its own product page, so its memory row stays entirely empty.

## Corrections

MTIA 400 carried MTIA 300's interconnect: Meta gives 1.2 TB/s of total I/O and 200 GB/s of scale-out for the 300 and no figure of any kind for the 400, so both fields now say so, and the unsourced Quanta entry came out. The Maia 200 note gave the die as "about 820 mm²", which is Epoch's Maia 100 figure; no allowed source publishes a Maia 200 die area. Rubin's memory bandwidth splits between two Nvidia pages, 19.2 TB/s on the NVL72 table and 22 TB/s in the architecture post, and NVLink splits 3 against 3.6 TB/s; both are recorded and the table figure is kept. Three layout notes claimed vendor figures that do not exist: Moore Threads "80 GB at 1.6 TB/s", the 950PR's "stated capacity and bandwidth" and MTIA 400's "9.4 TB/s". All three are now marked estimated. Gaudi 3's 1,835 TFLOPS is the OAM module; Epoch's 1,678 is the PCIe card, and both are noted.

## Layouts

All 35 chips have a layout and every die and stack count now matches. Three did not. Ironwood is redrawn as the two chiplets Google names with four stacks each, dropping three small interconnect dies visible in package photographs. Jalapeño is redrawn as the single reticle-sized die OpenAI describes, since Broadcom's 3.5D platform was the only basis for the second die and stacked base dies. TPU 8i keeps one core die and one chiplet die, and its die-count field is now empty, because Google's phrasing gives no number.

## What the client should know

Epoch AI is doing heavy lifting on this page, and its own citations sometimes run back to outlets the policy bars: TechPowerUp for the H800 and A800 die sizes, TrendForce for the 910C, a Substack and a LinkedIn post for the Siyuan 590. Where the underlying citation is disallowed I left the field empty and said so in `notes`. That leaves an inconsistency worth a ruling: Maia 100's die area and power come from Epoch, while TPU v6e's Epoch power figure is refused as an estimate. One rule should govern both.

Three sources resisted reading. openai.com returns 403 to automated fetching, so Jalapeño's figures rest on pages I could not open. SemiAnalysis paywalls everything past the preamble, which is where the 910C, Trainium3 and Jalapeño package detail lives. Meta's Hot Chips 2026 deck is registration-gated.

Two chips are now stale. Meta has announced MTIA 450 and MTIA 500, and Google's TPU 8t is described in the same post as 8i but has no row of its own.
