# Landscape notes

Spec-panel copy for `data/landscape.json`. One section per chip, keyed by `id`. Figures are current to September 2026.

---

## Supported formats

Not spec-panel copy: the build matches each `##` heading to a chip and ignores this one. It records what sits behind `compute.support` in `data/landscape.json`, which the AI Chips table reads to decide what an empty cell says.

Every chip carries `support` for the three formats the table shows, `fp16`, `fp8` and `fp4`, and each is in one of three states.

- **yes**, the hardware runs the format. Where the vendor publishes a rate the cell carries the number; where it does not, the cell reads *not published*.
- **no**, the hardware has no datapath for it. The cell reads *not supported*, and the chip's `precisionNote` quotes the document that lists what the part does run.
- **unknown**, nothing allowed settles it. The cell reads *not published*, and the note says what is missing.

A **no** needs a document that enumerates the chip's data types: a datasheet table, an architecture post, an ISA or compiler page, a white paper, or a vendor statement. A missing figure is never enough on its own. Twenty-eight cells across twenty-one chips read *not supported*; sixteen more read *not published*, because no allowed document settles them.

### Marked unsupported, and the document behind each

| Chip | Format | The line that settles it |
|---|---|---|
| A100, A800 | FP8, FP4 | Nvidia, inside the Ampere architecture: "Third-generation Tensor Cores add support for TF32, BF16, FP64, INT8, INT4, and binary data types" |
| H100, H200, H800, H20 | FP4 | Nvidia, inside the Hopper architecture: "The FP8, FP16, BF16, TF32, FP64, and INT8 MMA data types are supported" |
| MI300X, MI325X | FP4 | AMD CDNA 3 white paper, the matrix table: Matrix FP64, FP32, TF32, FP16, BF16, FP8 and INT8, and the string FP4 nowhere in the document |
| TPU v4 | FP8, FP4 | Google Cloud TPU v4 documentation: "Peak compute per chip 275 teraflops (bf16 or int8)" |
| TPU v5e | FP8, FP4 | Google Cloud TPU v5e documentation: "Peak compute per chip (bf16) 197 TFLOPs", "Peak compute per chip (Int8) 393 TOPs", and no other row |
| TPU v5p | FP4 | Google Cloud TPU v5p documentation: BF16 and FP8 rows and nothing four-bit |
| TPU v6e | FP4 | Google Cloud TPU v6e documentation: bf16 and Int8 rows only |
| TPU v7 (Ironwood) | FP4 | Google Cloud tpu7x documentation: BF16 and FP8 rows only, and the eighth-generation deep dive dating the format, "TPU 8t introduces native 4-bit floating point (FP4)" |
| Trainium2 | FP4 | AWS Neuron Trainium2 architecture: FP8, BF16, FP16, TF32 and FP32, with MXFP4 arriving on Trainium3 |
| MTIA v2 | FP8, FP4 | Meta's MTIA v2 table: "354 TFLOPS/s (INT8)" and "177 TFLOPS/s (FP16/BF16)", dense, with the sparse pair above them and no float smaller than 16-bit |
| Gaudi 3 | FP4 | Intel Gaudi 3 white paper: "The Intel Gaudi 3 AI accelerator MME supports all the key AI compute datatypes: FP8 (both E4M3 and E5M2), BF16, FP16, TF32 and FP32" |
| Gaudi 2 | FP4 | Intel Gaudi documentation: "Gaudi 2 supports all popular data types required for deep learning: FP32, TF32, BF16, FP16 & FP8 (both E4M3 and E5M2)" |
| Ascend 910B, 910C | FP8, FP4 | Huawei Connect 2025 keynote: "Compared with the Ascend 910B and Ascend 910C, our newer chips – starting with the Ascend 950 chips – … will support more data formats, including FP32, HF32, FP16, BF16, FP8, MXFP8, HiF8, MXFP4, and HiF4" |
| MTIA 300 | FP4 | Meta's ISCA 2026 paper: four-bit formats such as MX4 and NVFP4 fall back to software on MTIA 300 |
| MTT S5000 | FP4 | Moore Threads product page: "full-precision compute support from FP8 to FP64" |

### Left unknown, and why

TPU v6e FP8, because two Google pages disagree: the v6e page lists bf16 and Int8 and no FP8, while the tpu7x comparison table prints an FP8 row of 918 TFLOPs for v6e, which is the bf16 figure repeated. TPU 8t and 8i FP16 and FP8, because Google names FP4 for the eighth generation and no other format. Maia 100 FP8 and FP4, because its tensor unit runs Microsoft's own 9-bit and 6-bit MX formats, which are neither. MTIA 400 FP16, because Meta names MX8 and MX4 for that generation and no 16-bit type. WSE-3 Turbo FP8 and FP4, because Cerebras's data-formats page lists FP32, FP16, cbfloat16 and bfloat16 for the CS platform but predates the CS-4 and is software documentation, with no datasheet behind it. Groq FP4, because Groq publishes no data-type list at all. Jalapeño FP16 and FP8, because OpenAI publishes no format list and SemiAnalysis reports only MXFP4, and the Siyuan 590, because Cambricon publishes nothing.

The three-state rule cuts the other way too. Moore Threads claims FP8 through FP64 and publishes no FLOPS at all, and Groq's own first-generation brief carried an FP16 number that Epoch AI still records. Both read *not published*.

---

## Nvidia B200
`nvidia-b200`

Nvidia fuses two TSMC 4NP dies, 208 billion transistors in total, with a 10 TB/s NV-HBI link and presents them to software as one GPU ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Nvidia gives the Blackwell GPU up to 192 GB of HBM3E at 8 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)). Epoch AI's cost model puts the package on TSMC's CoWoS-L process ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Dense throughput is 2,250 TFLOPS FP16, 4,500 FP8 and 9,000 FP4, derived by halving the sparse figures Nvidia publishes for the eight-GPU HGX B200 baseboard ([source](https://www.nvidia.com/en-us/data-center/hgx/)). On the DGX B200 each GPU carries 180 GB, 1,440 GB across eight ([source](https://www.nvidia.com/en-us/data-center/dgx-b200/)). Nvidia's Blackwell Ultra post gives the Blackwell GPU 10 petaFLOPS of dense NVFP4 at up to 1,200 W ([source](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)). Epoch AI records the B200 at 1,000 W ([source](https://epoch.ai/data/machine-learning-hardware)). Nvidia has never published a list price for the module. Foxconn, Quanta, Wistron, Wiwynn and Supermicro build the boards and racks.

## Nvidia B300 (GB300 NVL72)
`nvidia-b300`

The B300, which Nvidia calls Blackwell Ultra, is the same two-die 4NP silicon as the B200 with a different memory stack and a retuned tensor core. Moving to eight 12-high HBM3E stacks raises capacity from 192 GB to 288 GB at the same 8 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)). Eight 36 GB stacks make up that 288 GB, and Micron's 12-high HBM3E stack holds 36 GB ([source](https://www.micron.com/about/blog/applications/ai/micron-continues-memory-industry-leadership-with-hbm3e-12-high-36gb)). Micron said in March 2025 that this 12-high HBM3E is designed into the HGX B300 NVL16 and GB300 NVL72 platforms ([source](https://investors.micron.com/news-releases/news-release-details/micron-innovates-data-center-edge-nvidia)). SK hynix said in October 2025 that its 36 GB HBM3E is used in the GB300 ([source](https://news.skhynix.com/en/sk-hynix-showcases-full-stack-ai-memory-portfolio-at-2025-ocp-global-summit/)).

Nvidia's own GB300 NVL72 table gives 1,080 PFLOPS of dense NVFP4 across 72 GPUs, which is 15,000 dense FP4 TFLOPS per GPU ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)). On the HGX boards FP16 is unchanged from B200, at 36 PFLOPS with sparsity across eight GPUs ([source](https://www.nvidia.com/en-us/data-center/hgx/)). The rest of the gain is in attention, the step that decides which earlier words a model looks at ([source](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)). Nvidia says Blackwell Ultra makes attention-layer compute up to twice as fast ([source](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)). Nvidia gives maximum power as up to 1,400 W per GPU, against up to 1,200 W for Blackwell ([source](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)). ConnectX-8 SuperNICs provide 800 Gb/s for scale-out ([source](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)).

## Nvidia Rubin (VR200)
`nvidia-vr200`

Two compute dies, each as large as one lithography exposure allows, carry 336 billion transistors, 224 SMs and 896 sixth-generation tensor cores, joined by Nvidia's NV-HBI die-to-die link ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)). Rubin is Nvidia's first HBM4 GPU, and SemiAnalysis reports that its CoWoS design taped out, meaning the finished design was sent to the factory, in October 2025 ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)). Eight HBM4 stacks give 288 GB at 19.2 TB/s per GPU ([source](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)). SemiAnalysis reported in March 2026 that SK hynix and Samsung were closer than Micron to the roughly 11 Gb/s HBM4 pin speed Nvidia targets ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)). SemiAnalysis had written in February 2026 that Micron was effectively out of the picture for Rubin HBM4 ([source](https://newsletter.semianalysis.com/p/vera-rubin-extreme-co-design-an-evolution)).

Per-GPU dense throughput is 35,000 TFLOPS NVFP4 and 17,500 FP8, derived from the Vera Rubin NVL72 figures of 2,520 and 1,260 dense PFLOPS across 72 GPUs. The same table gives 4,000 TFLOPS of dense FP16 per GPU, well under half the FP8 rate ([source](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)). Nvidia quotes 50 PFLOPS per GPU for NVFP4 inference with sparsity ([source](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)). Nvidia publishes no price. SemiAnalysis puts the rack's capital cost to a hyperscaler, one of the largest cloud operators, at $3.28 per GPU-hour over four years, about 45 percent more per GPU than GB300 ([source](https://newsletter.semianalysis.com/p/vera-rubin-extreme-co-design-an-evolution)).

## Nvidia H200 (China-licensed configuration)
`nvidia-h200-china`

The H200 is the standard 2023 Hopper part, sold worldwide: a single 814 mm2 die on TSMC 4N with 141 GB of HBM3E at 4.8 TB/s and 700 W ([source](https://www.nvidia.com/en-us/data-center/h200/)). Micron said in February 2024 that its 24 GB 8-high HBM3E would be part of the H200 ([source](https://investors.micron.com/news/press-release/2024/Micron-Commences-Volume-Production-of-Industry-Leading-HBM3E-Solution-to-Accelerate-the-Growth-of-AI-02-26-2024/default.aspx)). In a final rule effective 15 January 2026, the Bureau of Industry and Security changed how it reviews export licenses for chips below 21,000 points of total processing performance and 6,500 GB/s of memory bandwidth ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)). It moved them from a presumption of denial, under which applications are normally refused, to case-by-case review ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)). The rule names the H200 and the AMD MI325X ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)). The H200's 4,800 GB/s and roughly 15,800 points fall below both limits ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)). The rule caps the total performance shipped to China at 50 percent of what goes to US customers ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)). A presidential proclamation the same week adds a 25 percent tariff on chips such as the H200 ([source](https://www.whitehouse.gov/fact-sheets/2026/01/fact-sheet-president-donald-j-trump-takes-action-on-certain-advanced-computing-chips-to-protect-americas-economic-and-national-security/)).

Before the rule, the Institute for Progress (IFP) reported in October 2025 that Washington was weighing the B30A, a chip purpose-built for China with one die and four memory stacks, at about half a B300's performance ([source](https://ifp.org/the-b30a-decision/)). IFP also reported that Chinese regulators had banned purchases of the H20 and the RTX Pro 6000D ([source](https://ifp.org/the-b30a-decision/)). Nvidia's filing for the quarter ended 26 July 2026 says the US government granted licenses to ship small amounts of H200s to specific Chinese customers, but China's government restricted those sales ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)). Nvidia says its H200 shipments under the licenses came to less than 1 percent of that quarter's data center revenue ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)).

## AMD Instinct MI355X
`amd-mi355x`

The MI355X, launched on 12 June 2025, carries 288 GB of HBM3E at 8 TB/s against the B200's 192 GB ([source](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html)). The package holds ten dies, eight accelerator dies and two input-output dies ([source](https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/product-briefs/amd-instinct-mi355x-gpu-brochure.pdf)). AMD gives TSMC 3 nm and 6 nm for the silicon and 185 billion transistors in all ([source](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html)). Dense matrix throughput is 2,516 TFLOPS FP16, 5,033 FP8 and 10,066 FP4 across 256 compute units ([source](https://inferencex.semianalysis.com/chips/mi355x)). AMD's datasheet gives double rates for FP16, BF16, OCP-FP8 and INT8 with structured sparsity, and no sparse rate for the MX formats, FP4 included.

The weakness is how the chips connect. Each MI355X has seven Infinity Fabric links, each at 153.6 GB/s, which join the eight modules in a box in a full mesh ([source](https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/product-briefs/amd-instinct-mi355x-gpu-brochure.pdf)). The MI355X has no rack-scale fabric to match Nvidia's 72-GPU NVL72 rack ([source](https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/product-briefs/amd-instinct-mi355x-gpu-brochure.pdf)). AMD publishes no list price. SemiAnalysis's cloud cost model rates the chip at about $1.50 per GPU-hour owned at large hyperscaler volume and $2.90 at the retail tier ([source](https://inferencex.semianalysis.com/chips/mi355x)).

## AMD Instinct MI455X
`amd-mi455x`

AMD names TSMC 2 nm and 3 nm for the silicon and gives 320 billion transistors, 256 work group processors, a 2,400 MHz peak clock and 192 MB of L2, but no die areas ([source](https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html)). The MI455X is AMD's first rack-scale rival to Nvidia's NVL72, and SemiAnalysis puts its compute dies on TSMC N2 ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)). Twelve HBM4 stacks give 432 GB at 23.3 TB/s, 50 percent more memory per package than Rubin carries. AMD sells the chip on that capacity gap. Peak throughput is 40.27 PFLOPS MXFP4, 20.13 PFLOPS MXFP8 and 5.03 PFLOPS matrix FP16. In a separate structured-sparsity column of AMD's datasheet, FP16, BF16 and INT8 double to 10.07 PFLOPS, and the MX and FP8 formats have no sparse rate. The same datasheet counts ten dies, eight for compute and two for input and output ([source](https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf)).

The Helios rack puts 72 MI455X chips with 18 EPYC Venice CPUs on UALink over Ethernet, at 260 TB/s of scale-up bandwidth, 43 TB/s of scale-out and 31 TB of HBM4 ([source](https://rocm.blogs.amd.com/ecosystems-and-partners/cdna5-helios/README.html)). AMD went to production in July 2026, naming OpenAI, Anthropic, Meta, Microsoft and Oracle as deployers ([source](https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era)). AMD has not disclosed a per-GPU or a rack power figure.

## Google TPU v7 (Ironwood)
`google-tpu-v7-ironwood`

Google's documentation gives 2,307 TFLOPS BF16 and 4,614 TFLOPS FP8 per chip and 192 GiB of HBM at 7,380 GB/s ([source](https://docs.cloud.google.com/tpu/docs/tpu7x)). It says the package holds two compute chiplets, each a self-contained device with one TensorCore, two SparseCores and 96 GB of HBM ([source](https://docs.cloud.google.com/tpu/docs/tpu7x)). Ironwood became available to Google Cloud customers in November 2025 ([source](https://blog.google/products/google-cloud/ironwood-google-tpu-things-to-know/)). Google links 9,216 Ironwood chips to work as one, in a 3D torus at 1,200 GB/s per chip, with 1.77 PB of shared HBM and 42.5 exaFLOPS ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/)). Google's architecture post adds the stack count, eight HBM3E stacks per chip at a peak 7.4 TB/s, which puts four with each chiplet ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

Google discloses little about the supply chain. Epoch AI describes Broadcom as the partner that handles physical design and places the manufacturing orders with TSMC ([source](https://epoch.ai/data/ai-chip-sales-documentation/methodology)). Google has never published the die area, transistor count or power draw. SemiAnalysis gives the node as N3E ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).

## Google TPU 8t
`google-tpu-8t`

TPU 8t is the training half of Google's eighth generation, announced in April 2026 with the inference chip TPU 8i. Google gives it 216 GB of HBM at 6,528 GB/s, 128 MB of on-chip memory and 12.6 PFLOPS of FP4, and it is the first TPU with native FP4 ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). A superpod joins 9,600 chips with two petabytes of shared HBM and twice the chip-to-chip bandwidth of Ironwood ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/eighth-generation-tpu-agentic-era/)). Google publishes no FP8 or FP16 rate, node, design partner, package, stack count or power, and says only that the chip will be generally available later in 2026. SemiAnalysis puts the eighth generation on TSMC N3 ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).

## Google TPU 8i (Zebrafish)
`google-tpu-8i`

TPU 8i is the inference chip of Google's eighth generation, which split the TPU into separate training and inference parts. It pairs core dies with a chiplet die, in Google's phrasing two Tensor Cores on core dies and one Collectives Acceleration Engine on the chiplet die ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). It carries 288 GB of HBM at 8,601 GB/s and 10.1 PFLOPS of FP4 ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). Its 384 MB of on-chip Vmem, three times what the training part carries, is there to hold the key-value cache that a model builds up as it answers ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). It drops SparseCores and spends the area on the Collectives Acceleration Engine. That engine handles collectives, the steps in which cores and chips exchange and combine partial results, and cuts their on-chip delay about fivefold.

TPU 8i's fabric replaces the 3D torus with a hierarchical Boardfly topology, in which any chip reaches any other in at most seven hops ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). A pod holds up to 1,024 active chips, arranged as 36 groups of 8 boards ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). The training half, TPU 8t, keeps the 3D torus and scales to 9,600 chips with 216 GB of HBM at 6,528 GB/s and 12.6 PFLOPS of FP4. Google has named no design partner, node, packaging, HBM generation, stack count, power figure, availability date or die count for either chip. SemiAnalysis puts the eighth generation on TSMC N3 ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).

## AWS Trainium3
`aws-trainium3`

Trainium3 uses TSMC CoWoS-R, in which the dies sit on an interposer, a thin wiring layer that links them. Here the interposer is an organic thin film of six copper wiring layers on polymer, mounted on a 20-layer build-up substrate. SemiAnalysis describes it as cheaper and more mechanically compliant than a silicon interposer ([source](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential)). Trainium2 used the same approach ([source](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential)). Two compute dies on TSMC N3P carry eight NeuronCore-v4 cores and 256 MiB of on-chip SRAM, which AWS calls SBUF. Four 12-high HBM3E stacks give 144 GB at 4.9 TB/s, at a 9.6 Gbps pin speed that SemiAnalysis calls the highest HBM3E pin speed it has seen ([source](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential)). For this generation AWS moved from Samsung to SK hynix and Micron ([source](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential)).

AWS's Neuron documentation publishes a rate for every precision: 671 TFLOPS dense BF16, rising to 2,517 with 4x structured sparsity, and 2,517 TFLOPS for both MXFP8 and MXFP4, so FP4 adds no throughput on this part ([source](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trainium3.html)). Trn3 UltraServers became generally available on 2 December 2025, with 144 chips per scale-up domain, 20.7 TB of HBM3E and 362 PFLOPS FP8 ([source](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/)). NeuronLink-v4 links the chips at 2.56 TB/s per device over 160 PCIe Gen6 lanes ([source](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/)). Alchip took the back-end physical design from Marvell for this generation.

## Microsoft Maia 200
`microsoft-maia-200`

Microsoft puts Maia 200 on TSMC 3 nm with over 140 billion transistors, 216 GB of HBM3E at 7 TB/s and 272 MB of on-die SRAM ([source](https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/)). Microsoft rates it at over 10 petaFLOPS FP4 and over 5 petaFLOPS FP8, at 750 W for the whole system on chip ([source](https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/)). Microsoft's architecture deep dive gives a more precise 10.1 PetaOPS FP4 ([source](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/deep-dive-into-the-maia-200-architecture/4489312)). FP4 runs at twice the FP8 rate and eight times the BF16 rate, which puts FP8 at about 5.05 PFLOPS and BF16 at about 1,263 TFLOPS ([source](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/deep-dive-into-the-maia-200-architecture/4489312)). The deep dive names no packaging technology, die count or die area, so the package is the least documented part of the chip ([source](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/deep-dive-into-the-maia-200-architecture/4489312)).

Networking is all Ethernet, with no separate fabric for scale-out. An on-die network interface carries 1.4 TB/s in each direction. Four accelerators form a switchless Fully Connected Quad, and a switched second tier reaches 6,144 accelerators. Microsoft has not named the HBM supplier or the number of stacks. Microsoft deployed it first in its US Central region near Des Moines, Iowa ([source](https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/)).

## Meta MTIA 300
`meta-mtia-300`

MTIA 300 is Meta's first training chip, built to train its ranking and recommendation models. It is also the one MTIA generation Meta has documented in full. Meta's ISCA 2026 paper gives 1,120 TFLOPS FP8 and 560 TFLOPS FP16, 216 GB of HBM3E in six twelve-high stacks at 6.1 TB/s, and 912 W at peak, 667 W typical ([source](https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf)). The package is CoWoS, with one compute chiplet of 25.6 by 31.4 mm ([source](https://engineering.fb.com/2026/08/24/networking-traffic/mtia-300-meta-training-chip-built-in-nics/)). That is a full reticle, the largest area a scanner can print in one exposure, and the chiplet carries a spare row of processing elements so that more of the chips come out usable ([source](https://engineering.fb.com/2026/08/24/networking-traffic/mtia-300-meta-training-chip-built-in-nics/)). Two network chiplets carry twelve 800 Gbps network interfaces, 1.2 TB/s in all, so data reaches the network without a PCIe hop to a separate network card ([source](https://engineering.fb.com/2026/08/24/networking-traffic/mtia-300-meta-training-chip-built-in-nics/)). Meta names no foundry or node. Epoch AI's row for the chip (1,200 TFLOPS FP8, 800 W) does not match Meta's paper, so the figures above come from the paper.

## Meta MTIA 400
`meta-mtia-400`

In March 2026 Meta described four successive generations of its own accelerator, the MTIA, and said it can now ship a new one roughly every six months ([source](https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/)). MTIA 400 is the second of them. Meta's own account gives only ratios for its performance: 400 percent more FP8 FLOPS and 51 percent more memory bandwidth than MTIA 300. It has two compute chiplets, and 72 accelerators work as one over a switched backplane. The 400, 450 and 500 share a chassis, rack and network, so each generation fits into halls that already exist. Meta showed absolute figures at the Hot Chips 2026 conference, but the slides are available only on registration, so the spec table carries only the ratios Meta has published openly.

For comparison, MTIA 300, which Meta has documented, carries 216 GB of HBM3E, 1.2 TB/s of total I/O and two network chiplets holding twelve 800 Gbps RDMA network interfaces ([source](https://engineering.fb.com/2026/08/24/networking-traffic/mtia-300-meta-training-chip-built-in-nics/)). In April 2026 Meta confirmed that Broadcom supplies the XPU design platform, the advanced packaging and the Ethernet across multiple MTIA generations, with a first phase above one gigawatt ([source](https://about.fb.com/news/meta-partners-with-broadcom/)). Meta has published no node, die area, transistor count or HBM supplier.

## OpenAI Jalapeño
`openai-jalapeno`

Jalapeño is OpenAI's first inference chip, built under the 10 gigawatt deal OpenAI signed with Broadcom in October 2025 ([source](https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/)). Under that deal OpenAI designs the accelerators and systems and develops and deploys them in partnership with Broadcom ([source](https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/)). OpenAI says AI helped the team go from initial design to tapeout in nine months ([source](https://openai.com/index/jalapeno-first-results/)). OpenAI publishes no peak FLOPS and makes its case on performance per watt instead ([source](https://openai.com/index/jalapeno-first-results/)). Its results on InferenceX, SemiAnalysis's inference benchmark, show peak interactivity of 1,459 tokens per second per user on GPT-OSS 120B, 700 on DeepSeek R1 and 694 on Kimi K2.5 ([source](https://openai.com/index/jalapeno-first-results/)).

The architecture is memory-sliced, with each core slice holding a local view of its own slice of HBM ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)). SemiAnalysis names getting the most out of HBM bandwidth as a key design principle ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)). SemiAnalysis reports Broadcom Tomahawk 6 switches in the in-rack scale-up network and Celestica as the partner on system-level design ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)). The links run over Ethernet at 4.8 Tb/s per chip inside a 128-accelerator rack, and 1.6 Tb/s on the global link across 2,048 chips in 16 racks ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)).

OpenAI rates the chip at 700 W, against 1,400 W for the GB300 ([source](https://openai.com/index/jalapeno-first-results/)). It reports 1.5 to 1.9 times the peak throughput per watt of the GB200 and GB300 systems it compared ([source](https://openai.com/index/jalapeno-first-results/)). OpenAI discloses no node, foundry, die area or memory. SemiAnalysis reports a compute die on TSMC N3P with an N3E I/O chiplet on CoWoS, HBM4 at 15.4 TB/s, and 13.4 PFLOPS of MXFP4 ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)).

## Intel Gaudi 3
`intel-gaudi3`

Intel documents eight matrix multiplication engines and 64 tensor processor cores across two compute dies, and 1.8 PFLOPS for both FP8 and BF16 ([source](https://docs.habana.ai/en/latest/Gaudi_Overview/Gaudi_Architecture.html)). The package carries 128 GB of HBM2E from eight stacks at 3.7 TB/s and 24 RDMA NIC ports of 200 gigabits each ([source](https://docs.habana.ai/en/latest/Gaudi_Overview/Gaudi_Architecture.html)). Intel's white paper tables give 1,678 TFLOPS for both FP8 and BF16, the figure shown above ([source](https://cdrdv2-public.intel.com/817486/gaudi-3-ai-accelerator-white-paper.pdf)).

On each card, 21 of the 24 ports link the eight cards on a baseboard, and the other three go to scale-out ([source](https://cdrdv2-public.intel.com/817486/gaudi-3-ai-accelerator-white-paper.pdf)). So a Gaudi cluster needs no proprietary cable plant and no InfiniBand ([source](https://cdrdv2-public.intel.com/817486/gaudi-3-ai-accelerator-white-paper.pdf)). The white paper lists FP8, BF16, FP16, TF32 and FP32 for the matrix engines and no four-bit format ([source](https://cdrdv2-public.intel.com/817486/gaudi-3-ai-accelerator-white-paper.pdf)). Intel's next announced inference part is Crescent Island, an Xe3P data center GPU with 160 GB of LPDDR5X, and Intel expects customer sampling in the second half of 2026 ([source](https://www.intel.com/content/www/us/en/newsroom/news/artificial-intelligence/intel-to-expand-ai-accelerator-portfolio-with-new-gpu.html)).

## Cerebras WSE-3 Turbo (CS-4)
`cerebras-wse3-turbo`

Cerebras is the only vendor that builds a single die larger than the reticle limit, the largest rectangle a scanner can print in one shot. The WSE-3 is one 46,225 mm2 device stitched from 84 such rectangles on TSMC N5 ([source](https://www.cerebras.ai/product-chip)). It carries four trillion transistors, 900,000 AI cores and 44 GB of on-wafer SRAM, with no HBM ([source](https://www.cerebras.ai/product-chip)). The Turbo revision reaches 250 PFLOPS with 43.2 PB/s of memory bandwidth ([source](https://www.cerebras.ai/cs4)). Cerebras names no precision and no dense-or-sparse basis for the compute figure, so it cannot be compared with a vendor FP16 or FP8 rate ([source](https://www.cerebras.ai/cs4)).

The wafer-scale design avoids two chokepoints, advanced packaging and HBM supply, but a chip that large is harder to make without defects and harder to power. The CS-4 packs three wafers per rack, each in a water-cooled compute backpack fed by up to 30 air-cooled AC/DC power-supply modules ([source](https://www.cerebras.ai/blog/ultrafast-frontier-inference-cerebras-deep-dive-at-hot-chips-2026)). The rack reaches 750 PFLOPS in aggregate ([source](https://www.cerebras.ai/blog/ultrafast-frontier-inference-cerebras-deep-dive-at-hot-chips-2026)). Each wafer has 53.5 PB/s of on-wafer fabric bandwidth, and the latency from wafer to wafer is about two microseconds ([source](https://www.cerebras.ai/blog/ultrafast-frontier-inference-cerebras-deep-dive-at-hot-chips-2026)). Cerebras said in August 2026 that the first CS-4 shipments would begin that quarter ([source](https://www.cerebras.ai/blog/introducing-cerebras-cs-4)). Cerebras has never published a per-wafer power figure.

## Groq LPU
`groq-lpu`

Groq's LPU has no external memory at all, and it runs as a deterministic pipeline, in which the compiler schedules every step in advance ([source](https://groq.com/lpu)). Weights, key-value cache and activations all live on the die ([source](https://groq.com/lpu)). The first generation was a roughly 725 mm2 die on GlobalFoundries 14 nm with 230 MB of SRAM, fabricated and packaged in the United States, according to SemiAnalysis ([source](https://newsletter.semianalysis.com/p/groq-inference-tokenomics-speed-but)). In February 2024 SemiAnalysis put its raw wafer cost below $6,000, against about $16,000 for an H100 wafer on TSMC 4N ([source](https://newsletter.semianalysis.com/p/groq-inference-tokenomics-speed-but)). Epoch AI's December 2025 cost model gives a newer figure for a different node, about $17,000 for a 12-inch wafer on TSMC 4NP, the process behind Nvidia's B200 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Because all the memory is on the die, no single chip holds a useful model, so the rack is the unit of deployment. Groq quotes 256 LPUs per rack, with 128 GB of aggregate SRAM, 40 PB/s of SRAM bandwidth and 315 PFLOPS of FP8, or roughly 500 MB, 156 TB/s and 1,230 TFLOPS per accelerator ([source](https://groq.com/inference)). In 2026 Groq's roadmap product became an Nvidia-branded rack, the NVIDIA Groq 3 LPX, pairing 256 next-generation LPUs with Vera Rubin. Groq publishes no per-chip power rating (TDP), FP16 or FP4 figure. The 215 W and the 230 MB of SRAM above come from Epoch AI's record of a Groq product brief whose URL no longer resolves ([source](https://epoch.ai/data/machine-learning-hardware)). Groq's own LPU page puts on-chip SRAM bandwidth at upwards of 80 TB/s, about half what the rack figures imply, so the two Groq pages disagree and both are recorded.

## Huawei Ascend 910C
`huawei-ascend-910c`

On paper the 910C is made on SMIC's N+2 process, a 7 nm-class node ([source](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72)). But SemiAnalysis judges that most 910B and 910C dies were made by TSMC on its N7 process and reached Huawei through Sophgo, a Chinese chip designer, before TSMC stopped supplying Sophgo ([source](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72)). SemiAnalysis also judges that Huawei stockpiled 13 million HBM stacks, enough for 1.6 million 910C packages at roughly eight stacks each ([source](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72)). Teardowns that trace those origins have become a policy matter in China. China's Ministry of Commerce added TechInsights, a chip-teardown firm, to its unreliable entity list, accusing it of assisting foreign governments in suppressing Chinese enterprises ([source](https://english.mofcom.gov.cn/News/SpokesmansRemarks/art/2025/art_ae8ca3f16ddb475cb3a9b51a025887c9.html)).

Per-chip performance is weak and poorly documented. Huawei publishes no per-chip figures. Dividing the total for CloudMatrix 384, Huawei's 384-chip system, gives about 781 TFLOPS dense BF16 per chip. The 128 GB of HBM2E, the 3.2 TB/s and the 700 W come from Epoch AI, whose citations for the row mix the Huawei keynote and SemiAnalysis with a market-research outlet ([source](https://epoch.ai/data/machine-learning-hardware)). Huawei compensates with scale. CloudMatrix 384 delivers about 300 PFLOPS dense BF16, roughly twice a GB200 NVL72, while drawing about four times the power and running about 2.5 times worse per FLOP.

## Huawei Ascend 950PR
`huawei-ascend-950pr`

Huawei executive Xu Zhijun laid out the company's accelerator roadmap at Huawei Connect in September 2025 ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). He said the 950PR would ship with HiBL 1.0, Huawei's own high-bandwidth memory ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). That memory would take the place of stockpiled Korean stacks. The roadmap promised the 950PR in Q1 2026, with 1 PFLOPS in FP8, 2 PFLOPS in MXFP4 and 2 TB/s of interconnect ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). The 950DT would follow in Q4 2026 with 144 GB of HiZQ 2.0 at 4 TB/s, then the 960 in 2027 and the 970 in 2028 ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). The roadmap also promised an Atlas 950 SuperPoD of 8,192 chips at 8 exaFLOPS FP8 ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). Huawei's spec page now lists that system at up to 1,024 chips ([source](https://www.hiascend.com/hardware/cluster)).

Huawei sells the part as the Atlas 350 card, which it says doubles vector compute over the previous generation and can run alone or four-way over UnifiedBus ([source](https://www.huawei.com/en/news/2025/9/hc-superpod-innovation)). Huawei's own spec table for the card comes in below the roadmap: 112 GB at 1.4 TB/s, 425 TFLOPS FP16, 804 TFLOPS mxFP8 and 1,561 TFLOPS mxFP4, at up to 600 W ([source](https://www.hiascend.com/hardware/accelerator-card)). Its processor page gives the chip's maximum as 128 GB at 1.6 TB/s ([source](https://www.hiascend.com/hardware/processor?tag=950pr)). Huawei still publishes no node, package photo, die count or transistor count.

## Huawei Ascend 950DT
`huawei-ascend-950dt`

The 950DT uses the same Ascend 950 die as the 950PR but is built for training and for the decode stage of inference, the pass that writes the answer ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). It pairs the die with Huawei's faster HiZQ 2.0 memory, 144 GB at 4 TB/s, and has 2 TB/s of chip-to-chip bandwidth ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). Huawei dated it to the fourth quarter of 2026 and builds its Atlas 950 SuperPoD on it ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). The roadmap said 8,192 chips for that system, and Huawei's spec page now lists up to 1,024 ([source](https://www.hiascend.com/hardware/cluster)). Huawei's spec table gives 547 TFLOPS FP16, 1,034 TFLOPS mxFP8 and 2,007 TFLOPS mxFP4 for the top speed grade ([source](https://www.hiascend.com/hardware/processor?tag=950dt)). Huawei publishes no node, package or power figure.

## Cambricon Siyuan 590
`cambricon-siyuan-590`

Almost nothing about the Siyuan 590 is public. Cambricon's site still lists only the MLU270 and MLU370, has no product page for the 590 or the newer 690, and gives no performance figure for the part ([source](https://www.cambricon.com/)). Epoch AI reports that SMIC makes the chip on its N+2 process, broadly equivalent to TSMC's 7 nm, with 80 GB of HBM ([source](https://epoch.ai/data/ai-chip-sales-documentation/methodology)). Cambricon has been barred from US-origin technology since 16 December 2022, when the Bureau of Industry and Security added seven Cambricon entities to the Entity List ([source](https://www.federalregister.gov/documents/2022/12/19/2022-27151/additions-and-revisions-to-the-entity-list-and-conforming-removal-from-the-unverified-list)).

## Moore Threads MTT S5000
`moore-threads-mtt-s5000`

Moore Threads builds the MTT S5000 on its PH100 chip, in what it calls the Pinghu architecture, and claims full-precision support from FP8 to FP64 ([source](https://en.mthreads.com/product/S5000)). It claims at least 4,000 tokens per second of single-GPU prefill, the pass that reads the prompt, and 1,000 per second of decode, the pass that writes the answer ([source](https://en.mthreads.com/product/S5000)). It also claims 95 percent linear scaling at ten-thousand-GPU scale, meaning each GPU in a cluster that size keeps 95 percent of the speed it has on its own ([source](https://en.mthreads.com/product/S5000)).

Moore Threads publishes no peak FLOPS, node, foundry, memory bandwidth, power figure or price, and no independent benchmark exists. Its stock-exchange prospectus gives only the architecture's maximums, 80 GB of memory and 800 GB/s between chips. The company sells the chip on software compatibility instead. It documents its MUSA software stack and MUSA's adaptation to PyTorch, Megatron-LM, vLLM and SGLang, which is how Chinese accelerators substitute in practice for CUDA, Nvidia's software platform ([source](https://en.mthreads.com/product/KUAE)). It also documents the KUAE cluster product, which packages the parts in clusters of up to ten thousand GPUs ([source](https://en.mthreads.com/product/KUAE)).

## H20 (HGX H20, China variant)
`nvidia-h20`

The H20 was Nvidia’s third attempt at a China part built to comply with US export rules, but by April 2025 it needed a license all the same. Nvidia publishes no datasheet, no die area, no stack count and no NVLink rate for it, so almost everything here comes from Epoch AI’s database. The 96 GB of HBM3 implies six 16 GB stacks on a die that carries six stack sites, but Nvidia has not confirmed that. SemiAnalysis reported product samples in November 2023 and mass production within the next month. Epoch AI dates first shipments to February 2024.

## H800 (China variant of the H100)
`nvidia-h800`

Of Nvidia's China variants, the H800 cost Chinese buyers the least in practice. Epoch AI calculates that it was about as good as the H100 on training FLOP per second per dollar, because 400 GB/s of NVLink, Nvidia's chip-to-chip link, is still fast enough to move data while the chips compute. The loss appears in short-context inference instead. CSIS puts its interconnect at 300 GB/s and Epoch AI at 400 GB/s. Both figures are recorded above as they stand. Nvidia has published nothing about the part, and Epoch AI dates it to 21 March 2023.

## A800 (China variant of the A100)
`nvidia-a800`

The A800 is the clearest case of a product designed around a regulation. Nvidia’s 8-K filing of 31 August 2022 had already said the new US license requirement would extend to any future chip meeting both peak performance and chip-to-chip thresholds roughly equivalent to the A100. The A800 was built to meet only one of the two, so the license requirement did not cover it. Commerce Secretary Gina Raimondo’s reply, quoted by CSIS, was that if a chip is redesigned around a cut line to enable AI, she would control it the next day. Epoch AI dates the A800 variants to August and November 2022.

## H100 (SXM5)
`nvidia-h100`

The H100 is the chip the 2023 and 2024 AI build-out ran on, and every China variant is measured against it. Nvidia states that the full GH100 die carries six HBM3 or HBM2e stack sites and that the SXM5 part uses five of them for 80 GB. The H200 that follows it is the same die with 141 GB of HBM3E, which is why the H200 became the chip Washington eventually allowed into China. Nvidia’s 8-K of 31 August 2022 still calls the H100 forthcoming, and Epoch AI dates the SXM5 part to September 2022.

## A100 (80 GB SXM)
`nvidia-a100`

The A100 is the reference point for every export-control threshold since. The Bureau of Industry and Security set the October 2022 line just under the A100 on both axes it used, peak performance and chip-to-chip bandwidth, which is why the A800 exists. Nvidia describes five active HBM2 stacks on the 40 GB SXM4 board, so the 80 GB part carries the same five sites at 16 GB each in HBM2e. Nvidia names no memory supplier, package dimensions or list price. Epoch AI dates the SXM4 A100 to 14 May 2020 and the 80 GB version to 16 November 2020.

## Instinct MI325X
`amd-mi325x`

The MI325X is the same CDNA 3 silicon as the MI300X, with 256 GB of HBM3E at 6 TB/s and a 1,000 W board. It is the only AMD part Washington has ever named as licensable for China. It sits close to both limits, at 20,919 points of total processing performance against a 21,000 ceiling and 6,000 GB/s against a 6,500 GB/s ceiling. AMD publishes no list price, no die areas and no assembler.

## Instinct MI300X
`amd-mi300x`

At its December 2023 launch the MI300X put 192 GB on one package. The package holds a dozen chiplets, eight N5 accelerator dies bonded onto four N6 I/O dies, with 153 billion transistors in all. AMD’s page prints no stack count, but the chip’s 8,192-bit memory interface splits into eight 1,024-bit HBM channels, one per stack. The CDNA 3 white paper confirms eight stacks. AMD publishes no list price, no die areas and no assembler.

## TPU v6e (Trillium)
`google-tpu-v6e`

TPU v6e was the last TPU before Ironwood. Google publishes compute, memory and fabric numbers for its TPUs and nothing else, and it does not name the memory. SemiAnalysis supplies the N5 node and two stacks of HBM3, which is consistent with 32 GB of memory at 1,638 GB/s ([source](https://newsletter.semianalysis.com/p/tpuv7-google-takes-a-swing-at-the)). The other silicon fields stay empty for lack of an allowed source. Epoch AI estimates the power draw at about 380 W, but Google publishes no figure, so the TDP field is empty.

## TPU v5p
`google-tpu-v5p`

TPU v5p was the training TPU of the pre-Ironwood era. A v5p pod of 8,960 chips in a 3D torus was the largest group of chips Google had linked to work as one at the time. It carries two TensorCores and four SparseCores per chip. Its FP8 rate equals its BF16 rate, the clearest sign that the v5 generation was designed before chipmakers started competing on low-precision speed. Google publishes compute, memory and fabric numbers for its TPUs and nothing else. SemiAnalysis gives the node as N5 ([source](https://newsletter.semianalysis.com/p/tpuv7-google-takes-a-swing-at-the)). The other silicon fields stay empty for lack of an allowed source.

## TPU v5e
`google-tpu-v5e`

Google describes Cloud TPU v5e as a combined training and inference product ([source](https://docs.cloud.google.com/tpu/docs/v5e)). Its specification table lists an expected performance per total cost of ownership of 0.65x ([source](https://docs.cloud.google.com/tpu/docs/v5e)). The v6e table lists 1 for the same measure ([source](https://docs.cloud.google.com/tpu/docs/v6e)). A single v5e sits under the 4,800-point export-control threshold, yet 256 of them in a pod deliver 50.63 PFLOPs ([source](https://docs.cloud.google.com/tpu/docs/v5e)). Google publishes compute, memory and fabric numbers for its TPUs and nothing else: no foundry, no process node, no die area, no transistor count, no package type and no HBM stack count. Those fields stay empty here for lack of an allowed source.

## TPU v4
`google-tpu-v4`

TPU v4 is the generation that made TPUs credible outside Google. It is also the only TPU here with a published power figure. Google reports measured minimum, mean and maximum draw of 90, 170 and 192 W, so the TDP field above carries the 192 W maximum. Each chip has two TensorCores and HBM2, and as of October 2026 Google's Cloud TPU documentation names the memory generation for this part and for no later TPU ([source](https://docs.cloud.google.com/tpu/docs/v4)). Google's ISCA 2023 paper adds what its product pages leave out: 7 nm, 22 billion transistors, one die with four HBM stacks, and six chip-to-chip links at 50 GB/s ([source](https://arxiv.org/abs/2304.01433)).

## Trainium2
`aws-trainium2`

Trainium2 is the chip that made AWS a credible second source. Amazon says Anthropic is using Project Rainier, Amazon's Trainium2 cluster, to build and deploy Claude ([source](https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster)). Export controls rate chips by total processing performance, which multiplies the chip's rate in each format by that format's bit length and takes the highest result. On most accelerators FP8 runs at twice the BF16 rate, so the two formats give the same score. On Trainium2 FP8 falls short of double, so the BF16 figure sets the score.

Epoch AI dates the part to 3 December 2024. AWS’s documentation carries no date. AWS publishes compute, memory and fabric numbers and nothing about the silicon. SemiAnalysis supplies the rest shown here: N5, two compute dies on CoWoS-R, and four HBM3E stacks of 24 GB ([source](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential)). No published power figure exists, but Epoch AI estimates the draw at about 500 W.

## Maia 100
`microsoft-maia-100`

Maia 100 is Microsoft’s first accelerator and the first silicon anywhere to implement the Microscaling data format that later became the MX standard. Microsoft published the cooling design in detail, down to the sidekick heat exchanger that sits beside the rack ([source](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/inside-maia-100-revolutionizing-ai-workloads-with-microsofts-custom-ai-accelerat/4229118)). It later described the chip itself in its Inside Maia 100 post and at the Hot Chips 2024 conference: an 820 mm2 die on TSMC N5 with four HBM2E stacks, 64 GB at 1.8 TB/s, on CoWoS-S ([source](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/inside-maia-100-revolutionizing-ai-workloads-with-microsofts-custom-ai-accelerat/4229118)). Microsoft's Azure post of 3 April 2024 dates the announcement to November 2023, the date above ([source](https://azure.microsoft.com/en-us/blog/azure-maia-for-the-era-of-ai-from-silicon-to-software-to-systems/)). Epoch AI records the part at August 2024, when Microsoft presented it at Hot Chips. Microsoft designed it for up to 700 W and provisions it at 500 W, the figure shown ([source](https://hc2024.hotchips.org/assets/program/conference/day2/81_HC2024.Microsoft.Xu.Ramakrishnan.final.v2.pdf)).

## MTIA v2
`meta-mtia-v2`

MTIA v2 has no HBM at all. It carries 128 GB of LPDDR5, the low-power memory used in phones and laptops, backed by 256 MB of on-chip SRAM ([source](https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf)). The LPDDR5 runs at 204.8 GB/s, about a sixteenth of an H100’s memory bandwidth ([source](https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf)). Its power is 90 W by Meta's 2024 figure or 85 W by its 2026 paper ([source](https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf)). Meta chose this design for ranking and recommendation work, where the model is small and the traffic is enormous. The die measures 25.6 by 16.4 mm, 421 mm2, and holds 2.35 billion gates on TSMC 5 nm, details almost no other vendor publishes.

## Gaudi 2
`intel-gaudi2`

With Gaudi 2, Intel made the Ethernet choice that Gaudi 3 inherited. Gaudi 2 puts 24 RDMA network interfaces on the package, so a Gaudi cluster needs no proprietary cable plant and no InfiniBand. It also carries 48 MB of local SRAM and hardware video decoders that let it run its own pre-processing.

Intel positioned Gaudi 2 against the A100 and never gave it a datasheet. But the comparison table in Intel’s Gaudi 3 white paper records it at 432 TFLOPS BF16 and 865 TFLOPS FP8 on the matrix engines, and those are the figures above. They replace Epoch AI's 450 TFLOPS BF16, which the spec table carried until 10 September 2026. Epoch AI also supplies the foundry, TSMC, which Intel does not name. Epoch AI's 826 mm2 die figure is left out, because it is exactly the A100 figure and its citation is an archived page with no primary document behind it.

## Ascend 910B
`huawei-ascend-910b`

The Ascend 910B is Huawei's domestic answer to the A100, and the evidence that export controls have an effect. CSET dates the series to 2022. No allowed source gives a first-shipment date, so that field is empty. CSET finds that Huawei needed at least two years to redesign the part for SMIC. CSET also finds that Huawei cut the number of active AI cores between the first and second generations, most likely because of yield or capacity limits on SMIC’s 7 nm line.

The 910B ships in several grades, from a 910B4 at 32 GB and 800 GB/s to a 910B1 at 64 GB and 1.6 TB/s. The figures above are the top of that range. SemiAnalysis places the chip between the A100 and the H100 in performance. Huawei publishes no die area, transistor count, package detail or per-chip datasheet.
