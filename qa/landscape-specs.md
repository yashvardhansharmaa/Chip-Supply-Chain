# AI Chips: missing technical specs

27 September 2026. Scope: every empty spec field in `data/landscape.json` (38 chips) other than price and bill of materials, worked in the requested order: power, memory, compute, interconnect, die/process/package. No repo file other than this report and `qa/landscape-specs-proposed.json` was edited. The JSON holds every proposed value with its quote and URL.

## Summary

- **45 proposed updates across 20 chips.** 41 fill empty fields. 4 are corrections to fields that say a figure is unpublished when a vendor source now publishes it. By tier: 24 Tier A and 21 Tier B (all SemiAnalysis).
- **Most useful fills:**
  - Rubin TDP: 2,300 W, the Max-P profile (Max-Q is 1,800 W). Tier B.
  - Rubin node 3NP, Ironwood N3E. Tier B. These replace the press-report wording the audit flagged.
  - Maia 100: memory (64 GB HBM2E, 1.8 TB/s, 4 stacks) and CoWoS-S packaging. Microsoft's "Inside Maia 100" post, which the row says is dead, resolves again.
  - TPU v4: node, transistors, stacks, die count and ICI links, from Google's ISCA 2023 paper.
  - Trainium2: node, stacks, HBM generation, die count and package. Tier B.
  - Jalapeño: TSMC N3P, 13.4 PFLOPS MXFP4, HBM4 at 15.4 TB/s, CoWoS. Tier B.
  - Ascend 950DT: FP16 of 547 TFLOPS, from Huawei's new processor spec table.
  - MTIA 300: scale-up domain, and FP4 settled as *not supported*.
- **New Tier A sources found:**
  - hiascend.com spec tables for the 950DT, the Atlas 800T A2 (910B), the Atlas 900 A3 SuperPoD (910C), the Atlas 950 SuperPoD and the Atlas 650E. These pages render client-side: a plain fetch returns only the first tab, so they were read in a browser.
  - The Moore Threads STAR Market prospectus on static.sse.com.cn. Stock-exchange filings are Tier A under the site policy, but the domain is not in `data/source-tiers.json`, so add `sse.com.cn` / `static.sse.com.cn`.
  - Hot Chips 2023-2025 decks on hc202x.hotchips.org are public. **Hot Chips 2026 decks** (Rubin, MI400, MTIA 400, Maia 200, TPU 8, Jalapeño, Cerebras) **return 401 "Attendees Only"**.
- **8 conflicts with current values** (listed below). The largest: Huawei's own tables disagree with the 950DT roadmap figures, the Atlas 950 SuperPoD size, and the 910B and 910C FP16 rates.

## Fills by chip

Quotes are shortened; the full text is in the JSON.

### Nvidia Rubin (nvidia-vr200)
| Field | Value | Quote | URL | Tier |
|---|---|---|---|---|
| tdpW | 2300 | "Rubin’s chip level TDP increases up to 2,300W ... NVIDIA’s 2300W configuration represents the Max-P configuration, while the efficiency optimized Max-Q configuration runs at 1800W." | https://newsletter.semianalysis.com/p/vera-rubin-extreme-co-design-an-evolution | B |
| process.node | 3NP | "NVIDIA transitions from 4NP with Blackwell to 3NP with Rubin." (also "N3P-based Rubin generation") | https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage | B |

The 2,300 W value matches the NVL72 configuration of this row: "The VR NVL72 system has a TDP up to 220kW for the 2300W Rubin TDP SKU". Record the 1,800 W Max-Q profile in notes.

### Google TPU v7 Ironwood, TPU 8t, TPU 8i, v6e, v5p, v4
| Chip | Field | Value | Quote | URL | Tier |
|---|---|---|---|---|---|
| Ironwood | process.node | N3E | "Google’s TPU roadmap shifts fully to N3E starting with TPU v7" | .../the-great-ai-silicon-shortage | B |
| TPU 8t, 8i | process.node | N3 | "next generation TPUv8 variants ... will also remain on the N3 node" | same | B |
| v6e | process.node | N5 | "TPU v6 Trillium is manufactured on the same N5 node as TPU v5p" | https://newsletter.semianalysis.com/p/tpuv7-google-takes-a-swing-at-the | B |
| v6e | memory.stacks / type | 2 / HBM3 | "only 2 stacks of HBM3 vs 5 and 6 stacks of HBM3 and HBM3E respectively" | same | B |
| v5p | process.node | N5 | same sentence as v6e | same | B |
| v4 | process.node | 7 nm | "Tech. node, Die size 7 nm, <600 mm2" | https://arxiv.org/abs/2304.01433 | A |
| v4 | die.transistorsB | 22 | "Transistor count 22 billion" | same | A |
| v4 | memory.stacks, die.count | 4, 1 | "The TPU v4 package (ASIC in center plus 4 HBM stacks)" | same | A |
| v4 | interconnect.chipToChip (correction) | 6 links at 50 GB/s | "Inter Chip Interconnect 6 links @ 50 GB/s" | same | A |

The TPU 8t and 8i value applies to "TPUv8 variants" as a group, not to each chip by name. For TPU 8t, also set foundry to TSMC with it (the article's subject is TSMC's N3 family). For v6e and v5p, the foundry is not named, so it stays empty.

### AWS Trainium2
| Field | Value | Quote | URL | Tier |
|---|---|---|---|---|
| memory.stacks | 4 | "Despite maintaining 4 stacks of HBM3E ... 5.7Gbps for Trn2 to 9.6Gbps for Trn3" | https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential | B |
| memory.type | HBM3E (24 GB per stack, 5.7 Gbps) | "still classified as HBM3E because it uses 24Gb dies to provide 24GB per stack" | same | B |
| process.node | N5 | "moves to the N3P node from the N5 node that is used for Trn2" | same | B |
| package.type | CoWoS-R, two assemblies | "the package shot above is just Trn2 ... composed of two CoWoS-R assemblies" | same | B |
| die.count | 2 | "The two compute dies interface with each other through the substrate." | same | B |

### Microsoft Maia 100
| Field | Value | Quote | URL | Tier |
|---|---|---|---|---|
| memory.capacityGB / bandwidthTBs / stacks | 64 / 1.8 / 4 | "four HBM2E die, provide a total of 1.8 terabytes per second of bandwidth and 64 gigabytes of capacity" | https://techcommunity.microsoft.com/blog/azureinfrastructureblog/inside-maia-100-revolutionizing-ai-workloads-with-microsofts-custom-ai-accelerat/4229118 | A |
| memory.type | HBM2E | "HBM BW/Cap 1.8TB/s @64GB HBM2E" | https://hc2024.hotchips.org/assets/program/conference/day2/81_HC2024.Microsoft.Xu.Ramakrishnan.final.v2.pdf | A |
| package.type (correction) | TSMC CoWoS-S | "utilizes TSMC’s N5 process with COWOS-S interposer technology" | techcommunity post | A |

### Meta MTIA 300 and MTIA v2
| Chip | Field | Value | Quote | URL | Tier |
|---|---|---|---|---|---|
| MTIA 300 | interconnect.scaleUp | 16-accelerator rack domain, 800 GB/s (up to 1 TB/s) | "We use a scale-up domain of 16 nodes (one rack)"; "800 GB/s (up to 1000 GB/s)" | https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf | A |
| MTIA 300 | compute.support.fp4 | no | "specialized scaling that is not natively supported, forcing a fallback to RISC-V execution ... we introduced native support for MX4 in MTIA 400" | same | A |
| MTIA v2 | interconnect.scaleOut | None (N/A) | Table I, MTIA-2i column: "Scale-out network N/A" | same | A |

### OpenAI Jalapeño
| Field | Value | Quote | URL | Tier |
|---|---|---|---|---|
| process.foundry / node | TSMC / N3P compute die, N3E I/O chiplet | "a single reticle-sized compute die that is manufactured on TSMC’s N3P ... an N3E I/O chiplet" | https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia | B |
| compute.fp4TFLOPS, support.fp4 | 13400, yes | "the B0 stepping delivers 13.4 PFLOPs of MXFP4" | same | B |
| memory.type / bandwidthTBs | HBM4 / 15.4 | "Jalapeño will ship with HBM4"; "15.4TB/s of memory bandwidth per package" | same | B |
| package.type | CoWoS | "a tape out of the CoWoS design" | same | B |

SemiAnalysis does not say whether 13.4 PFLOPS is dense or sparse. OpenAI's own pages give only the 700 W rating and benchmark results.

### Groq, Intel Gaudi 2, Gaudi 3, Nvidia H100
| Chip | Field | Value | Quote | URL | Tier |
|---|---|---|---|---|---|
| Groq LPU | die.transistorsB | 26.8 | "820 TeraOps/sec from 26.8B transistors on-chip" | https://groq.com/groq-isca-paper-2020/ | A |
| Gaudi 2 | memory.stacks | 6 | "HBM 6 x HBM2E 8 x HBM2E" (Gaudi 2 / Gaudi 3 columns) | https://cdrdv2-public.intel.com/817486/gaudi-3-ai-accelerator-white-paper.pdf | A |
| Gaudi 3 | process.node wording (correction) | TSMC 5 nm | "manufactured in TSMC 5nm process" | same | A |
| H100 | memory.suppliers | SK hynix | "HBM3 to be combined with NVIDIA H100 Tensor Core GPU" | https://news.skhynix.com/sk-hynix-to-supply-industrys-first-hbm3-dram-to-nvidia/ | A |

The Groq figure is for the first-generation 14 nm GroqChip, the same part as the row's 725 mm² die area.

### Huawei Ascend 950DT, 910B, 910C
| Chip | Field | Value | Quote | URL | Tier |
|---|---|---|---|---|---|
| 950DT | compute.fp16TFLOPS | 547 | "BF16/FP16（TFLOPS） 547/486/425"; "Memory容量（GB） 144/96" | https://www.hiascend.com/hardware/processor?tag=950dt | A |
| 950DT | interconnect.scaleOut | UBoE 2 x 400 Gb/s | "UBoE 2*Port，2*400Gbps (与UB共用2个端口)" | same | A |
| 910B | interconnect.scaleUp | Atlas 800T A2, 8-NPU full mesh | "8卡Fullmesh互联"; "NPU 8 * 昇腾910" | https://www.hiascend.com/hardware/ai-server?tag=900A2 | A |
| 910B | interconnect.scaleOut | RoCE, 200GE per NPU | "8 * 200GE QSFP接口直出，RoCE协议" | same | A |
| 910C | interconnect.chipToChip (addition) | 784 GB/s bidirectional per NPU | "D2D双向带宽理论784GB/s" | https://www.hiascend.com/hardware/cluster?tag=900a3 | A |

- **950DT.** 547 is the top of three bins, the one that goes with the row's 144 GB at 4 TB/s. The table sums Cube and Vector compute, the same basis as the 950PR row's Atlas 350 figures.
- **910B.** Huawei's server page names the NPU "昇腾910", not 910B. Accept these values only if the site keeps treating the A2 generation as 910B.

### Moore Threads MTT S5000
| Field | Value | Quote | URL | Tier |
|---|---|---|---|---|
| memory.capacityGB | 80 | Architecture table, 平湖 (Pinghu) column: "最大显存容量 80 GB"; "显存带宽 不披露" | https://static.sse.com.cn/stock/disclosure/announcement/c/202509/002098_20250919_IP6Z.pdf (p. 1-1-102) | A (filing; domain to add) |
| interconnect.chipToChip | 800 GB/s | "片间互连带宽 800 GB/s" | same | A |

These are Pinghu (PH100) architecture maxima. The prospectus lists the S5000 as the Pinghu card. It gives bandwidth as not disclosed and gives only FP32 (32 TFLOPS) for compute. Treat the capacity as a maximum and say so in `notes`.

## Conflicts with current values

Neither value in each pair is proposed in the JSON; each needs a choice.

1. **Ascend 950DT FP8 and FP4.** The row carries the 2025 keynote figures of 1,000 FP8 and 2,000 MXFP4. Huawei's processor table gives 1,034 and 2,007 for the top bin. The Atlas 650E server gives 6.43 PFLOPS FP8, 3.40 PFLOPS FP16 and 12.48 PFLOPS MXFP4 across 8 x 950DT, which is 804, 425 and 1,560 per chip, with "8 × 96GB HBM". Those server figures match the bottom bin. Suggested: move to the processor table's top bin (1,034 / 2,007 / 547), which keeps 144 GB and 4 TB/s.
2. **Atlas 950 SuperPoD size.** The 950PR and 950DT `scaleUp` fields carry the keynote's "up to 8,192 chips, 1,152 TB". Huawei's current spec page says "最大支持1024 * 昇腾950DT", "最大支持1024 * 96GB 片上内存", "256TB全局内存" and "1 EFLOPS mxFP8" (https://www.hiascend.com/hardware/cluster). The 950DT status ("Announced ... Q4 2026") may also be stale: hiascend now publishes shipping-style spec tables for the Atlas 650E and Atlas 950 SuperPoD built on it.
3. **Ascend 910C FP16.** The row has 781, derived from SemiAnalysis (300 PFLOPS BF16 / 384). The Atlas 900 A3 page says "最大支持307.2/288.7/240.3 PFLOPS@FP16" for 384 NPUs, which is 800, 752 and 626 TFLOPS per chip. Huawei's top SKU matches Epoch's 800.
4. **Ascend 910B FP16.** The row has 400, from CSET. The Atlas 800T A2 gives "3.0 PFLOPS FP16 ... 或 2.5 PFLOPS FP16" for 8 NPUs, which is 375 or 312.5 per chip. Memory matches the row (8 x 64 GB, 1.6 TB/s).
5. **TPU v4 power.** The row has 192 W `tdpW`. Google's paper says "TDP N.A." and gives measured "min/mean/max 121/170/192 W", so 192 W is measured maximum power, not a TDP rating. Google's Hot Chips 2023 deck says "Typical power ~200W".
6. **Jalapeño die count.** The row has 1. SemiAnalysis describes "a single reticle-sized compute die" plus "an N3E I/O chiplet", which is at least 2 dies.
7. **MTIA v2 scale-up.** The row says "Up to 72 accelerators per rack". Meta's ISCA 2026 table lists the MTIA-2i "Scale-up network N/A". The 72 describes rack packaging (PCIe-attached boards), not a scale-up fabric; reword the field.
8. **Maia 100 power and FP16 basis.** The row's 500 W is Microsoft's provisioned figure; the design TDP is 700 W ("Designed to support up to 700W TDP but provisioned at 500W"). The 800 TFLOPS FP16 is now vendor-backed and dense ("Peak Dense Tensor POPS ... BF16: 0.8"), so change the precision note away from "Epoch, basis unknown". FP8 and FP4 stay *not published*: the tensor unit runs "9bit compute/6bit compute" (MX9/MX6), which are not FP8 or FP4 formats.

Smaller points:

- Gaudi 3's 900 W is the air-cooled OAM; Intel's Hot Chips 2024 deck gives "900W (Air) / 1200W (Liquid)".
- SemiAnalysis confirms "TPUv7 does not have native FP4 computation", consistent with the row.
- Meta's HCCL paper labels MTIA 300's memory "HBM3 @8.0Gbps 24/36GB" in a figure, against the ISCA paper's "6 stacks HBM3E". Keep the ISCA value.

## Checked and not filled

- **Power:**
  - MI455X: not on AMD's product page or brochure; SemiAnalysis found nothing either.
  - Ironwood, TPU v5e, v5p, v6e, 8t and 8i: none from Google, and the Ironwood Hot Chips 2025 deck gives none.
  - Trainium2 and Trainium3: none from AWS or in SemiAnalysis's free text.
  - MTIA 400: the Hot Chips 2026 deck is attendee-only, and Meta's blog gives ratios only.
  - Cerebras WSE-3 Turbo: none per wafer on the product, CS-4 or Hot Chips 2026 blog pages.
  - 950DT: only the 14.5 kW Atlas 650E server input power, which includes the CPUs, so it is not usable per chip.
  - Cambricon and Moore Threads: none.
- **MTIA 400, all fields:** Meta's blog (https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/) gives ratios only. The Hot Chips 2026 deck (HC2026.Meta.LokeChenSingh.V06.pdf) returns 401. The widely quoted absolute figures come from ServeTheHome and The Register, which are barred.
- **Maia 200 stacks and package, TPU 8t/8i FP8 and FP16, Rubin and MI400 details, Jalapeño capacity:** the Hot Chips 2026 decks would likely settle these but are gated. Re-check hc2026.hotchips.org when the decks go public; Hot Chips 2025 decks are public now.
- **H20 FP8, stacks, transistors and NVLink:** the SemiAnalysis H20 specs are paywalled, and Nvidia publishes no datasheet.
- **Die area, every chip still empty; package size, every chip:** no vendor or allowed source found. TPU v4 has only "<600 mm²". Gaudi 3, MI300X/MI355X and Blackwell decks give transistors, not areas.
- **Cambricon Siyuan 590:** cambricon.com's 2022 WAIC post names the part and gives no figures. Every numeric source found was Chinese media or wiki.
- **Moore Threads FP16/FP8, bandwidth, node, package:** not in the product pages or the prospectus. The circulating 1,000 TFLOPS FP8, 80 GB and 1.6 TB/s figures trace to Chinese media (cls.cn and others).
- **Memory suppliers (A100, A800, H800, H20, MI300X, MI325X, Gaudi, TPUs, Maia, MTIA):** no vendor naming found. The one fill is H100 (SK hynix).
- **Gaudi 2 die count; Groq FP4 and package; Cerebras FP8/FP4:** no statement found.
- **Ironwood transistors and die area:** the Hot Chips 2025 deck, the tpu7x docs and the Ironwood blog give none.
- **Rubin, MI455X, Trainium3 die area; Trainium3 transistors:** none.
