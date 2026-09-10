# AI Chips: what an empty cell means

Every chip now carries `compute.support`: `fp16`, `fp8` and `fp4`, each yes, no or unknown. A null cell says *not supported* where support is no and *not published* otherwise, keeping `cx-nil` and adding `cx-nil--no` for the unsupported case. TPP is untouched; the picker, single-chip and comparison views all render (`qa/tier1/chips-precision-*.png`). The page has no INT8 row, so `support` carries three keys; the column below is for the record.

## Changed from "not published" to "not supported"

Twenty-seven cells across twenty chips. Ampere has no eight- or four-bit float, so the A100 and A800 lose both; Hopper has no four-bit, so the H100, H200, H800 and H20 lose FP4; CDNA 3 has none either, nor Gaudi 2, nor Gaudi 3. Google's spec tables give TPU v4 "275 teraflops (bf16 or int8)" and v5e bf16 and Int8 alone, so those two lose FP8 as well as FP4, while v5p, v6e and Ironwood lose FP4 only. Google dates the format itself: "TPU 8t introduces native 4-bit floating point (FP4)". Trainium2 predates MXFP4. MTIA v2 runs INT8 and FP16/BF16 and nothing smaller. Huawei settles its own two, promising FP8 and MXFP4 in the 950 series "compared with the Ascend 910B and Ascend 910C". Moore Threads claims "full-precision compute support from FP8 to FP64", which stops above four bits.

## Figures corrected

Gaudi 2's FP16 read 450 TFLOPS, Epoch AI's number. Intel publishes its own: the comparison table in the Gaudi 3 white paper gives the older part 432 TFLOPS BF16 MME and 865 TFLOPS FP8 MME. The row now reads 432. That moves its total processing performance from 7,200 (16 x 450) to 6,920 (8 x 865), so the export-control line and both notes changed with it. It stays above the 4,800 threshold. The B300 note now also records the HGX B300 board at 108 PFLOPS dense FP4 across eight GPUs, 13,500 each, against the 15,000 the NVL72 table implies for the rack part this row describes.

The rest held: B200 and B300 halve Nvidia's sparse HGX rows correctly, MI355X and MI455X match their datasheets' dense columns, MI300X and MI325X the CDNA 3 table, MTIA v2's 177 TFLOPS is the dense half of Meta's pair, and both Trainium rows match the Neuron docs.

## Not settled

Fifteen cells stay *not published* for want of a document. TPU v6e FP8 is the sharp one: the v6e page lists bf16 and Int8, while the tpu7x table prints an FP8 row of 918 TFLOPs for v6e, the bf16 figure repeated. The others are TPU 8i FP16 and FP8; Maia 100 FP8 and FP4, where Microsoft names MX without saying which types; MTIA 400 FP16, where Meta names only MX8 and MX4; WSE-3 Turbo FP8 and FP4, where the Cerebras data-formats page predates the CS-4; Groq FP4; and all three formats on Jalapeño and the Siyuan 590.

One citation is new: the Cerebras data-formats page, tier A by domain but with no `data/bibliography.json` entry; that file is outside this pass.

| Chip | FP16 | FP8 | FP4 | INT8 | The document |
|---|---|---|---|---|---|
| B200 | yes | yes | yes | yes | Nvidia HGX spec table |
| B300 (GB300 NVL72) | yes | yes | yes | yes | Nvidia GB300 NVL72 and HGX tables |
| Rubin (VR200) | yes | yes | yes | unknown | Nvidia Vera Rubin NVL72 table; Rubin architecture post |
| H200 (China-licensed) | yes | yes | no | yes | Nvidia Hopper architecture post |
| H20 | yes | yes | no | yes | Nvidia Hopper architecture post; Epoch AI |
| H800 | yes | yes | no | yes | Nvidia Hopper architecture post |
| A800 | yes | no | no | yes | Nvidia Ampere architecture post |
| H100 (SXM5) | yes | yes | no | yes | Nvidia H100 table; Hopper architecture post |
| A100 (80 GB SXM) | yes | no | no | yes | Nvidia A100 table; Ampere architecture post |
| Instinct MI355X | yes | yes | yes | yes | AMD MI355X datasheet |
| Instinct MI455X | yes | yes | yes | yes | AMD MI455X datasheet |
| Instinct MI325X | yes | yes | no | yes | AMD CDNA 3 white paper |
| Instinct MI300X | yes | yes | no | yes | AMD CDNA 3 white paper |
| TPU v7 (Ironwood) | yes | yes | no | unknown | Google tpu7x docs; TPU 8t/8i deep dive |
| TPU 8i (Zebrafish) | unknown | unknown | yes | unknown | Google TPU 8t/8i deep dive |
| TPU v6e (Trillium) | yes | unknown | no | yes | Google v6e docs against the tpu7x table |
| TPU v5p | yes | yes | no | unknown | Google v5p docs |
| TPU v5e | yes | no | no | yes | Google v5e docs |
| TPU v4 | yes | no | no | yes | Google v4 docs |
| Trainium3 | yes | yes | yes | unknown | AWS Neuron Trainium3 architecture |
| Trainium2 | yes | yes | no | unknown | AWS Neuron Trainium2 architecture |
| Maia 200 | yes | yes | yes | unknown | Microsoft Maia 200 architecture deep dive |
| Maia 100 | yes | unknown | unknown | unknown | Microsoft Azure Maia post; Epoch AI |
| MTIA 400 | unknown | yes | yes | unknown | Meta MTIA blog, March 2026 |
| MTIA v2 | yes | no | no | yes | Meta MTIA v2 specification table |
| Jalapeño | unknown | unknown | unknown | unknown | none: OpenAI publishes no formats |
| Gaudi 3 | yes | yes | no | yes | Intel Gaudi 3 white paper |
| Gaudi 2 | yes | yes | no | unknown | Intel Gaudi documentation; Gaudi 3 white paper |
| WSE-3 Turbo (CS-4) | yes | unknown | unknown | unknown | Cerebras developer documentation, data formats |
| LPU | yes | yes | unknown | yes | Groq rack page; Epoch AI |
| Ascend 910B | yes | no | no | unknown | Huawei Connect 2025 keynote; CSET |
| Ascend 910C | yes | no | no | yes | Huawei Connect 2025 keynote; Epoch AI |
| Ascend 950PR | yes | yes | yes | unknown | Huawei Connect 2025 keynote |
| Siyuan 590 | unknown | unknown | unknown | unknown | none: Cambricon publishes nothing |
| MTT S5000 | yes | yes | no | unknown | Moore Threads S5000 product page |
