# AI Chips data audit

27 September 2026. Scope: all 35 entries in `data/landscape.json`, read with `data/landscape-notes.md`, the landscape section of `build/build.js` and the `Landscape` module in `src/app.js`. No repo data file was edited. The machine-readable proposal is `qa/landscape-proposed.json`.

## Summary

- **386 empty fields** across the 35 chips. That count covers null, empty, "unknown" and "not published" values, including `compute.support` flags. It excludes FP8 and FP4 cells correctly marked *not supported*, and it excludes notes. Price (31 chips) and bill of materials (34 chips) account for 65 of them. No allowed source publishes either figure, so they stay empty.
- **6 gaps can be filled now** from Tier A sources: Rubin FP16, MI455X die count, and the Ascend 950PR's memory capacity, bandwidth, FP16 rate and power.
- **7 existing values are stale or inconsistent** and should change: Rubin scale-out, B300 FP16, Ascend 950PR FP8, FP4 and chip-to-chip, the MI355X precision note, and the MTIA v2 package size.
- **6 missing chips are worth adding**, each with vendor-published specs: Meta MTIA 300, Google TPU 8t, Huawei Ascend 950DT, Tenstorrent Blackhole, FuriosaAI RNGD and SambaNova SN40L. Nvidia Rubin CPX, AMD MI430X and SambaNova SN50 are close but still too thin.
- **Spot check of 8 headline figures:** 7 match their sources. The Ascend 950PR does not: the row carries Huawei's 2025 roadmap figures, and Huawei's spec table for the shipping Atlas 350 card is lower. Outside the sample, the audit found 6 more mismatches or unsupported statements, listed under Mismatches.

How empty values render: numeric cells show *not supported* when `compute.support` says `no` and *not published* otherwise (`Landscape.nil`). Text rows show *not published* when the value is null or empty. `package.sizeMm` is used only when the layout has no substrate; the fallback text is "size not published". `memory.suppliers`, `systemIntegrators`, `interconnect.scaleOut`, `bomEstimate` and `die.reticleLimited` never appear in the table, so gaps there matter only for the notes and the data export.

## Gaps filled

| Chip | Field | Value | Quote | URL | Tier |
|---|---|---|---|---|---|
| nvidia-vr200 | compute.fp16TFLOPS | 4000 | "FP16/BF16³ \| 288 PFLOPS \| 8 PFLOPS \| 4 PFLOPS" (NVL72, superchip, Rubin GPU columns); "³Dense specification" | https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/ | A |
| amd-mi455x | die.count | 10 | "ACCELERATED COMPUTE DIES (XCD) 8 ... I/O DIES (IOD) 2" | https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf | A |
| huawei-ascend-950pr | memory.capacityGB | 112 | "内存规格 \| 112 GB HBM，带宽1.4TB/s 支持ECC" (Atlas 350 card) | https://www.hiascend.com/hardware/accelerator-card | A |
| huawei-ascend-950pr | memory.bandwidthTBs | 1.4 | same row | same | A |
| huawei-ascend-950pr | compute.fp16TFLOPS | 425 | "425 TFLOPS FP16/BF16" | same | A |
| huawei-ascend-950pr | tdpW | 600 | "最大功耗 \| ≤600W" | same | A |

Notes on these:

- **Rubin FP16.** The same 4 PFLOPS dense figure appears in the HGX Rubin NVL8 per-GPU table on nvidia.com/en-us/data-center/hgx/. The row's `notes` says Epoch AI's 4,000 TFLOPS belongs to "the Vera Rubin superchip". Epoch's row carries that label, but the value is Nvidia's per-GPU figure; the two-GPU superchip is 8 PFLOPS. The claim that FP16 is unpublished should come out of `precisionNote` and `notes`.
- **Ascend 950PR memory.** Two Huawei pages give two configurations. The Atlas 350 card table gives 112 GB at 1.4 TB/s. The 950PR processor page (https://www.hiascend.com/hardware/processor?tag=950pr) gives the chip's maximum: "最大配备128GB、1.6TB/s高速片上内存" (up to 128 GB at 1.6 TB/s) and "最大支持1784TFLOPS" (format not stated). The proposal uses the card for the whole row, because the card table is the only one that ties memory, compute and power together. Pick one configuration and say which in `notes`.
- **hiascend.com** is Huawei's own Ascend site but is missing from `data/source-tiers.json`. Add it as Tier A.

Also proposed, though they are not gap fills:

- Add Nvidia's Blackwell Ultra technical blog to the B300 sources. It is the only Nvidia page found that prints the 1,400 W: "Max power (TGP) ... Up to 1,400W".
- Add a TPU 8i note quoting Google that "Both chips will be generally available later this year". The Cloud TPU release notes have no GA entry, so the status stays *Announced*.

## Gaps that cannot be filled from allowed sources

Checked and still empty:

- **Price and bill of materials, every chip.** No allowed source publishes either. Tenstorrent is the one exception, and only in the proposed new entry.
- **Die area.** Nvidia (B200, B300, Rubin), AMD (MI300X, MI325X, MI355X, MI455X), Google (every TPU), AWS, Microsoft (Maia 200) and Intel (Gaudi 3) publish none. AMD's MI455X datasheet gives die counts but not areas.
- **Power.** Rubin TDP: the Vera Rubin NVL72 page, the HGX page and Nvidia's June 2026 Vera Rubin datasheet give no TDP. The datasheet does assume "Vera Rubin NVL4 = 1800 W/GPU" in a benchmark footnote. That is a test condition, not a rating, so do not use it as `tdpW`. MI455X: no board power on the datasheet or the product page. Ironwood: none from Google. Epoch AI's 960 W is its own estimate, derived from a TPUv2 perf-per-watt ratio (Epoch's notes say so), so it is barred as an estimate. Trainium3 and Trainium2: none from AWS, and Epoch's 700 W and 500 W have no AWS page behind them. TPU v5e, v5p, v6e and 8i: none. MTIA 400: none. Cerebras WSE-3 Turbo: none per wafer.
- **MTIA 400 absolute figures.** Meta's blog gives only ratios: "400% higher FP8 FLOPS and 51% higher HBM bandwidth" than MTIA 300. The Hot Chips 2026 numbers circulating (12 PFLOPS MX4, 6 PFLOPS FP8, 3 PFLOPS BF16, 288 GB from eight 36 GB stacks, about 9.2 TB/s) come from ServeTheHome and The Register, which are barred. The deck on hotchips.org is registration-gated. The fields stay empty until Meta or hotchips.org publishes them openly. Do not derive them from MTIA 300 times the ratios.
- **Process node where only press reports exist.** Rubin ("N3P per press reports"), TPU v7 ("N3P (reported)") and Trainium3 ("N3P") carry node values sourced to press reports, not to an allowed source. Nvidia's Rubin architecture post names no node. See Mismatches.
- **TPU v4, v5e, v5p, v6e:** foundry, node, die, package and stacks. Google publishes none. Unchanged.
- **H20, H800, A800:** Nvidia publishes no datasheet. Unchanged.
- **Jalapeño:** openai.com blocks automated fetching, so nothing new could be checked.
- **Cambricon Siyuan 590 and Moore Threads MTT S5000:** a research pass for Cambricon filings and the Moore Threads STAR Market prospectus did not finish (API limit). Nothing new was verified, and both rows stay as they are. The Moore Threads prospectus on sse.com.cn is the most promising lead. Stock-exchange filings count as Tier A under the site policy, but sse.com.cn is not in `source-tiers.json` (szse.cn is).
- **Memory suppliers and system integrators:** no new vendor naming found.

## Missing chips

Six are worth adding. Full entries, with `_evidence` quotes for each field, are in `newChips` in the JSON. `layout` is null in each, so a layout must be added to `data/landscape-layouts.json` before the package plan can draw. Strip `_evidence` and `_flags` before merging.

**Meta MTIA 300.** Tier A: Meta's ISCA 2026 paper (https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf, linked from engineering.fb.com; add the domain to Tier A).

| Field | Value |
|---|---|
| FP8 / FP16 | 1,120 / 560 TFLOPS ("1120 TFLOPS/s (FP8)", "560 TFLOPS/s (FP16/BF16)") |
| Memory | 216 GB, 6 stacks of 12-high HBM3E, 6.1 TB/s |
| TDP | 912 W (667 W typical) |
| Dies / package | 1 reticle-limited compute chiplet (25.6 x 31.4 mm) plus 2 network chiplets; CoWoS; 77.5 x 77.5 mm package |
| I/O | 12 x 800 Gbps RDMA NICs on package, 1.2 TB/s; 200 GB/s scale-out |
| Not published | foundry, node, transistors, FP4 |

Epoch AI's MTIA 300 row (600 TFLOPS BF16, 1,200 FP8, 800 W) disagrees with Meta's own paper. Use the paper.

**Google TPU 8t.** Tier A: Google Cloud deep dive and Google blog. Coverage is thin, but it matches TPU 8i, which is already on the page.

| Field | Value |
|---|---|
| FP4 | 12,600 TFLOPS ("Peak FP4 PFLOPs 12.6") |
| Memory | 216 GB HBM at 6,528 GB/s; 128 MB on-chip Vmem |
| Scale-up | 9,600-chip superpod, 3D torus, 2 PB shared HBM, 121 exaFLOPS |
| Status | Announced; GA "later this year" |
| Not published | FP16, FP8, node, dies, package, power |

**Huawei Ascend 950DT.** Tier A: Huawei Connect 2025 keynote.

| Field | Value |
|---|---|
| Memory | 144 GB HiZQ 2.0 at 4 TB/s |
| Interconnect | 2 TB/s |
| Compute | same Ascend 950 die as the 950PR: 1 PFLOPS FP8, 2 PFLOPS MXFP4 (roadmap) |
| Status | announced; Huawei dated it to Q4 2026 |
| Not published | node, die, package, power |

The compute figures are roadmap numbers. The shipping 950PR card on the same die is rated lower (see Mismatches).

**Tenstorrent Blackhole (p150a).** Tier A: tenstorrent.com and docs.tenstorrent.com (re-fetched and confirmed), plus Hot Chips 2024 slides.

| Field | Value |
|---|---|
| Compute | 664 TFLOPS BlockFP8 on the 120-core card; 745 on the full 140-core die |
| Memory | 32 GB GDDR6, 512 GB/s; 180 MB SRAM |
| Power | 300 W total board power |
| Node | 6 nm (foundry not named) |
| Interconnect | 4 x 800 Gbps QSFP-DD |
| Price | $1,399 list |
| Not published | foundry, die area, transistors |

**FuriosaAI RNGD.** Tier A: furiosa.ai spec page (re-fetched and confirmed).

| Field | Value |
|---|---|
| Process | TSMC 5 nm |
| Compute | BF16 256 TFLOPS, FP8 512 TFLOPS, INT4 1,024 TOPS; no FP4 |
| Memory | 2 x HBM3 on CoWoS-S, 48 GB, 1.5 TB/s |
| TDP | 180 W |
| Interface | PCIe Gen5 x16 |
| Not published | die area, transistors, price |

**SambaNova SN40L.** Tier A: Hot Chips 2024 slides, SambaNova's arXiv paper 2405.07518 and sambanova.ai (product page re-checked).

| Field | Value |
|---|---|
| Process / package | TSMC 5FF; 2 dies under 650 mm2 each on CoWoS |
| Transistors | 102 billion |
| Compute | BF16 638 TFLOPS; no FP8 or FP4 datapath |
| Memory | 64 GB HBM2E at 1.8 TB/s; 520 MB SRAM; up to 1.5 TB DDR |
| Not published | TDP, announcement date |

The slide quotes came from a research pass and were not re-fetched; this is flagged in the entry.

Near misses, not proposed yet:

- **Nvidia Rubin CPX.** Nvidia gives "up to 30 petaflops of compute with NVFP4 precision", "128GB of cost-efficient GDDR7 memory", a monolithic die and "expected to be available at the end of 2026" (nvidianews.nvidia.com). It has no bandwidth, TDP, FP8 or FP16 figure, so it falls short of "most fields".
- **AMD MI430X.** AMD's product page gives 432 GB HBM4, 23.3 TB/s and 288 TFLOPS FP64. No FP16, FP8 or FP4 rate was found on AMD pages.
- **SambaNova SN50.** BF16 1,600 and FP8 3,200 TFLOPS on TSMC 5 nm with 64 GB HBM2E, shipping in the second half of 2026. It has no bandwidth or TDP. Revisit it when the SN50 datasheet is readable.
- **Not researched to completion (API limit):** Biren, MetaX, Rebellions, Etched, d-Matrix, Hygon, Cambricon 690, AWS Trainium4, Intel Crescent Island, Qualcomm AI200 and AI250.

## Mismatches

Spot check of 8 headline figures against their cited sources:

| Chip | Figures checked | Result |
|---|---|---|
| B300 | FP8 5,000; FP4 15,000; 288 GB; 8 TB/s; 1,400 W | Match. FP16 is inconsistent (see below). The 1,400 W appears only on Nvidia's Blackwell Ultra blog, which is not among the row's sources. |
| Rubin (VR200) | FP8 17,500; FP4 35,000; 288 GB; 19.2 TB/s | Match on the live NVL72 table. TDP is unpublished. |
| MI355X | FP16 2,516; FP8 5,033; FP4 10,066; 288 GB; 8 TB/s; 1,400 W | Match. The precision note's sparsity claim is wrong (see below). |
| TPU v7 (Ironwood) | BF16 2,307; FP8 4,614; 192 GiB; 7,380 GB/s | Match |
| Trainium3 | BF16 671; MXFP8 and MXFP4 2,517; 144 GiB; 4.9 TB/s | Match. AWS states GiB; the field is labeled GB. |
| Ascend 950PR | FP8 1,000; FP4 2,000 | **Mismatch.** These are the 2025 keynote's roadmap figures for the die. Huawei's spec table for the shipping Atlas 350 card gives 804 TFLOPS mxFP8 and 1,561 TFLOPS mxFP4. |
| Maia 200 | FP4 10,100; 216 GB; 7 TB/s; 750 W | Match. FP8 5,050 and BF16 1,263 are computed from Microsoft's stated ratios, not printed figures. |
| MTIA 400 | "400% higher FP8 FLOPS and 51% higher HBM bandwidth" | Match. No absolute figures exist. |

Found outside the sample:

1. **B300 FP16 mixes two configurations.** The row takes FP8 and FP4 from the GB300 NVL72 table and FP16 (2,250) from the HGX B300 board. The NVL72 table's "FP16/BF16 Tensor Core 360 PFLOPS" (sparse) works out to 2,500 per GPU by the row's own method, and Epoch AI's GB300 row also carries 2,500. Proposed: 2,500, or keep 2,250 and label it as the HGX figure.
2. **Rubin scale-out is stale.** The row says 28.8 TB/s per rack, which matches Nvidia's June 2026 datasheet. The live NVL72 table now reads "Networking Bandwidth (Scale-Out)⁴ | 32.4 TB/s | 0.9 TB/s | 0.45 TB/s", bidirectional.
3. **MI355X sparsity.** The precision note and `landscape-notes.md` say sparsity doubles FP4 to 20,133 TFLOPS. AMD's datasheet gives N/A in the sparsity column for MXFP8, MXFP6 and MXFP4, and doubles only FP16, BF16, OCP-FP8 and INT8.
4. **Rubin node.** `landscape-notes.md` says the dies are "on TSMC 3 nm" and cites Nvidia's Rubin architecture post, which names no node or foundry process. `process.node` credits "press reports", which are not an allowed source. The same pattern applies to TPU v7 ("N3P (reported)") and Trainium3 ("N3P"). Either find a Tier A/B source or change these to "not disclosed" and drop the claim from the notes.
5. **MTIA v2 package size and power.** `package.sizeMm` holds "25.6 x 16.4 die", which is the die. Meta's ISCA 2026 paper gives the package for the same part (listed as MTIA-2i) as "50mm x 40mm". The paper also gives "85W (65W typical)" against the 90 W on the row, which came from Meta's 2024 blog. That is two Meta figures for one chip; record both in the notes.
6. **B200 power.** The row says 1,000 W. Nvidia's Blackwell Ultra blog table gives the Blackwell column as "Up to 1,200W", and in the same table 10 PFLOPS dense FP4 and 5 PFLOPS dense FP8, which are the GB200-class figures. This is not an error, because the row is the HGX part, but no current B200 source prints the 1,000 W. Add a source that does or note the basis.
