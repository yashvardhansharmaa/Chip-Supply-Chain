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

## Filled, with the source

- **Ironwood**: eight HBM3E stacks and two chiplets, both Google's own. The Cloud TPU documentation states two chiplets, each with one TensorCore, two SparseCores and 96 GB, and the architecture post names eight stacks at 7.4 TB/s.
- **Maia 200**: 1,263 TFLOPS BF16, from Microsoft's deep dive: 10.1 PetaOPS FP4, with FP4 at twice FP8 and eight times BF16. Epoch AI reaches 1,268 the same way.
- **MI455X**: 320 billion transistors from AMD's specification list, whose "TSMC 2nm | 3nm FinFET" replaces the hedged node.
- **Ascend 910C** 128 GB and 700 W, **Groq** 215 W and 230 MB of SRAM, **TPU v5e** a 325 mm2 die, **Gaudi 2** TSMC as its foundry: all from Epoch AI.

## Staying null

No allowed source publishes a chip price or a bill of materials, so both stay empty on 33 of 35. Memory suppliers stay empty wherever no vendor names one; system integrators too, since Nvidia points to a catalogue instead of partners. FP4 stays empty on every pre-Blackwell architecture, which has no four-bit datapath. Google publishes no node, foundry, die area, transistor count or package for any TPU, and Moore Threads no memory figures at all.

## Corrections and layouts

MTIA 400 carried MTIA 300's interconnect: Meta gives 1.2 TB/s of I/O and 200 GB/s of scale-out for the 300 and nothing for the 400, so both now say so; an unsourced Quanta entry came out too. The Maia 200 note gave a die of about 820 mm2, which is Epoch's Maia 100 figure. Rubin's bandwidth splits between two Nvidia pages, 19.2 TB/s on the NVL72 table against 22 in the architecture post, NVLink 3 against 3.6; both recorded, the table kept. Three layout notes claimed figures no vendor gives: Moore Threads "80 GB at 1.6 TB/s", the 950PR's "stated capacity and bandwidth", MTIA 400's "9.4 TB/s". Gaudi 3's 1,835 TFLOPS is the OAM module, Epoch's 1,678 the PCIe card.

All 35 layouts now match their die and stack counts; three did not. Ironwood is redrawn as the two chiplets Google names, four stacks each, dropping three small dies seen in photographs. Jalapeno becomes the single reticle-sized die OpenAI describes. TPU 8i keeps one core die and one chiplet die, and its die count is now empty, because Google gives no number.

## What the client should know

Epoch AI does heavy lifting, and its citations sometimes run back to barred outlets: TechPowerUp for the H800 and A800 die sizes, TrendForce for the 910C, a Substack for the Siyuan 590. Where they do, the field stays empty and `notes` says why. One inconsistency needs a ruling: Maia 100's die area and power come from Epoch, while TPU v6e's Epoch power figure is refused as an estimate.

openai.com returns 403 to automated fetching, so Jalapeno rests on pages I could not open; SemiAnalysis paywalls everything past its preamble. Meta has since announced MTIA 450 and 500, and Google's TPU 8t has no row of its own.
