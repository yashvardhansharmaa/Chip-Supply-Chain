# Chips added to the AI Chips page

Sixteen earlier and China-specific parts, taking `data/landscape.json` from 19 to 35. Each has a matching entry in `data/landscape-layouts.json`, inserted beside its vendor so the picker's country grouping still produces two headings. `node build/build.js` runs clean apart from one warning, below.

| Chip | Announced | TPP | Headline number, and who published it |
| --- | --- | --- | --- |
| Nvidia A100 80 GB SXM | 2020-05 | 4,992 | 312 TFLOPS dense FP16, Nvidia spec table |
| Nvidia H100 SXM5 | 2022-03 | 15,832 | 1,979 TFLOPS dense FP8, Nvidia spec table |
| Nvidia A800 | 2022-11 | 4,992 | Same arithmetic as the A100; CSIS and Epoch AI |
| Nvidia H800 | 2023-03 | 15,832 | Same arithmetic as the H100; Epoch AI |
| Nvidia H20 | 2023-11 | 2,368 | 148 TFLOPS dense FP16, Epoch AI |
| Google TPU v6e Trillium | 2024-05 | 14,688 | 918 TFLOPs bf16, Google Cloud docs |
| Google TPU v5p | 2023-12 | 7,344 | 459 TFLOPs BF16, Google Cloud docs |
| Google TPU v5e | 2023-08 | 3,152 | 197 TFLOPs bf16, Google Cloud docs |
| Google TPU v4 | 2021-05 | 4,400 | 275 teraflops bf16 or int8, Google Cloud docs |
| AMD Instinct MI300X | 2023-12 | 20,919 | 2,614.9 TFLOPS dense FP8, AMD footnote MI300-17 |
| AMD Instinct MI325X | 2024-10 | 20,919 | 2,614.9 TFLOPS dense FP8, AMD footnote MI325-002 |
| Amazon Trainium2 | 2024-12 | 10,672 | 667 TFLOPS dense BF16, AWS Neuron docs |
| Intel Gaudi 2 | 2022-05 | 7,200 | 450 TFLOPS BF16, Epoch AI |
| Huawei Ascend 910B | 2022 | 6,400 | 400 TFLOPS FP16, CSET |
| Microsoft Maia 100 | 2024-04 | 12,800 | 800 TFLOPS BF16, Epoch AI |
| Meta MTIA v2 | 2024-04 | 2,832 | 177 TFLOPS dense FP16, Meta blog |

## What is empty, and why

Nvidia publishes no datasheet for the A800, H800 or H20; Intel publishes no Gaudi 2 throughput; Huawei and Google publish almost nothing. So: die area, transistor count, package and stack count are null across the TPUs, Trainium2, Gaudi 2 and the Ascend; the TPUs also carry no foundry or node, because Google names neither. Maia 100 has no memory capacity or bandwidth at all. Every empty field is explained in that chip's `notes`.

## Four things worth knowing

**Reuters is unreachable from here**, so nothing cites it. The interconnect cuts come from CSIS and Epoch AI instead, and they disagree: CSIS puts the H800 at 300 GB/s, Epoch AI at 400 GB/s. Both figures sit in the H800 entry rather than an average.

**federalregister.gov blocks automated fetching.** The 2022, 2023 and 2026 rules are cited from the identical govinfo.gov PDFs, so the Sources page will show two hosts for documents the existing entries cite from federalregister.gov.

**The build warns** that `data/landscape-notes.md` has no section for the 16 new ids. That file was not mine to edit. The page falls back to each entry's `notes`, so the panel still reads and the sources still link.

**Ids follow your list** (`a100`, `h100`, `mi300x`), not the existing vendor-prefixed convention (`nvidia-b200`, `amd-mi355x`). Renaming is a search and replace across the two data files.

## Three findings

The MI300X and MI325X both land on 20,919 TPP, 81 points under the 21,000 ceiling BIS chose in January 2026. MTIA v2 is the inverse case: 2,832 TPP is under the headline threshold, but 6.7 performance density on its published 421 mm2 die is over the 5.92 limb. And on Trainium2, Gaudi 2 and TPU v5p the eight-bit rate does not double the sixteen-bit rate, so BF16 sets the TPP.
