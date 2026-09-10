# Landscape notes

Spec-panel copy for `data/landscape.json`. One section per chip, keyed by `id`. Figures are current to September 2026.

---

## Nvidia B200
`nvidia-b200`

Nvidia fuses two TSMC 4NP dies, 208 billion transistors in total, with a 10 TB/s NV-HBI link and presents them to software as one GPU ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)), the design that made it normal to build a chip larger than one lithography exposure. Eight HBM3E stacks give 192 GB at 8 TB/s, supplied by SK hynix, Micron and Samsung, and the whole assembly sits on a TSMC CoWoS-L interposer, which is why CoWoS-L allocation rather than wafer starts became the constraint on 2024 and 2025 AI capacity. Dense throughput is 2,250 TFLOPS FP16, 4,500 FP8 and 9,000 FP4, derived by halving the sparse figures Nvidia publishes for the eight-GPU HGX B200 baseboard ([source](https://www.nvidia.com/en-us/data-center/hgx/)). The part ships in two configurations: HGX and DGX boards carry 180 GB per GPU at 1,000 W, while the GB200 NVL72 variant runs at higher power and reaches 10,000 dense FP4 TFLOPS ([source](https://www.nvidia.com/en-us/data-center/dgx-b200/)). Nvidia has never published a list price for the module. Foxconn, Quanta, Wistron, Wiwynn and Supermicro build the boards and racks.

## Nvidia B300 (GB300 NVL72)
`nvidia-b300`

Blackwell Ultra is the same two-die 4NP silicon as B200 with a different memory stack and a retuned tensor core. Swapping 8-high HBM3E for 12-high lifts capacity from 192 GB to 288 GB at the same 8 TB/s ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)). Eight 36 GB stacks make up that 288 GB, and 36 GB is what a 12-high cube holds, the configuration Micron, SK hynix and Samsung tooled up for ([source](https://www.micron.com/about/blog/applications/ai/micron-continues-memory-industry-leadership-with-hbm3e-12-high-36gb)). Nvidia's own GB300 NVL72 table gives 1,080.2 PFLOPS of dense NVFP4 across 72 GPUs, which is 15,000 dense FP4 TFLOPS per GPU, half again what B200 delivers, while FP16 is unchanged ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)). The rest of the gain is in attention, the step that decides which earlier words a model looks at: Blackwell Ultra doubles softmax throughput, which matters more for long-context inference than the raw matrix rate. Power went from 1,000 W to 1,400 W per GPU, which made liquid cooling the default rather than an option, and each GPU now carries an 800 Gb/s ConnectX-8 SuperNIC for scale-out.

## Nvidia Rubin (VR200)
`nvidia-vr200`

Two compute dies, each as large as one lithography exposure allows, on TSMC 3 nm carry 336 billion transistors, 224 SMs and 896 sixth-generation tensor cores, joined by NV-HBI and packaged on CoWoS-L ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)). Rubin is the first HBM4 part in volume, and the first Nvidia GPU where memory rather than logic dominates cost. Eight HBM4 stacks give 288 GB at 19.2 TB/s per GPU ([source](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)). Nvidia qualified all three HBM makers for it, so SK hynix, Samsung and Micron all ship into the same socket. Per-GPU dense throughput is 35,000 TFLOPS NVFP4 and 17,500 FP8, derived from the Vera Rubin NVL72 figures of 2,520 and 1,260 dense PFLOPS across 72 GPUs; Nvidia has not published an FP16 number, and it quotes 50 PFLOPS per GPU for NVFP4 inference with sparsity ([source](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)). Racks sell at a reported $7.8M to $8.8M apiece, roughly $110,000 per GPU once the CPUs, NVLink 6 and the chassis are counted.

## Nvidia H200 (China-licensed configuration)
`nvidia-h200-china`

The H200 is the standard 2023 Hopper part, not a China-specific model: a single 814 mm2 die on TSMC 4N with 141 GB of HBM3E at 4.8 TB/s and 700 W ([source](https://www.nvidia.com/en-us/data-center/h200/)). It matters as the only Nvidia data center GPU legally shipping into China in 2026. A final rule from the Bureau of Industry and Security, effective 15 January 2026, moved chips below 21,000 points of total processing performance and 6,500 GB/s of memory bandwidth from presumption of denial to case-by-case review, naming the H200 and the AMD MI325X; the H200's 4,800 GB/s and roughly 15,800 points clear both bars ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)). The rule caps the total performance shipped to China at 50 percent of what goes to US customers, and a presidential proclamation the same week adds a 25 percent tariff. Nvidia arrived here by elimination: Washington blocked the purpose-built B30A, a single die with four memory stacks at roughly half a B300, in November 2025 ([source](https://ifp.org/the-b30a-decision/)), and Beijing rejected the RTX Pro 6000D in September 2025. Reported first deliveries to ByteDance and Tencent came in August 2026, at a small fraction of the legal ceiling.

## AMD Instinct MI355X
`amd-mi355x`

AMD matched Nvidia on memory a year early: the MI355X carries 288 GB of 12-high HBM3E at 8 TB/s against the B200's 192 GB ([source](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html)), and it is AMD's last eight-GPU-box generation. The package holds ten dies: eight accelerator dies on TSMC N3P, bonded copper to copper onto two N6 input-output dies, 185 billion transistors in all, on a CoWoS-S interposer with the eight memory stacks flanking the compute. Dense matrix throughput is 2,516 TFLOPS FP16, 5,033 FP8 and 10,066 FP4 across 256 compute units, with structured sparsity doubling each ([source](https://inferencex.semianalysis.com/chips/mi355x)). Linking them together is the weakness: seven Infinity Fabric links at 153.6 GB/s each and a full mesh across the eight modules in a box, with no rack-scale fabric to answer NVL72 ([source](https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/product-briefs/amd-instinct-mi355x-gpu-brochure.pdf)). AMD publishes no list price; SemiAnalysis puts 2026 rental at about $1.50 per GPU-hour at hyperscale volume and $2.90 retail.

## AMD Instinct MI455X
`amd-mi455x`

AMD names TSMC 2 nm and 3 nm for the silicon and CoWoS-L for the package, with compute dies stacked by hybrid bonding, but publishes no die count and no transistor count ([source](https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html)). The MI455X is its first genuine rack-scale answer to NVL72, and the first accelerator sold on the open market to be built on TSMC N2. Twelve HBM4 stacks give 432 GB at 23.3 TB/s, which is 50 percent more memory per package than Rubin carries, and the capacity gap is what AMD is selling. Peak throughput is 40.27 PFLOPS MXFP4, 20.13 PFLOPS MXFP8 and 5.03 PFLOPS matrix FP16, and AMD's datasheet keeps a separate structured-sparsity column in which FP16, BF16 and INT8 double to 10.07 PFLOPS while the four- and eight-bit formats gain nothing ([source](https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf)). The Helios rack puts 72 of them with 18 EPYC Venice CPUs on UALink over Ethernet rather than NVLink, at 260 TB/s of scale-up bandwidth, 43 TB/s of scale-out and 31 TB of HBM4 ([source](https://rocm.blogs.amd.com/ecosystems-and-partners/cdna5-helios/README.html)), and AMD went to production in July 2026, naming OpenAI, Anthropic, Meta, Microsoft and Oracle as deployers ([source](https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era)). AMD has not disclosed a per-GPU or a rack power figure.

## Google TPU v7 (Ironwood)
`google-tpu-v7-ironwood`

Google's own documentation gives 2,307 TFLOPS BF16 and 4,614 TFLOPS FP8 per chip, 192 GiB of HBM3E at 7,380 GB/s, and confirms the package holds two compute chiplets, each a self-contained device with one TensorCore, two SparseCores and 96 GB of HBM ([source](https://docs.cloud.google.com/tpu/docs/tpu7x)). Ironwood went generally available in November 2025 ([source](https://blog.google/products/google-cloud/ironwood-google-tpu-things-to-know/)) and is the chip that made a non-Nvidia stack credible at frontier scale. The headline is how many chips work as one: 9,216 in a 3D torus at 1,200 GB/s per chip, 1.77 PB of shared HBM and 42.5 exaFLOPS FP8, the largest single coherent domain in production ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/)). Supply-chain detail is thin because Google discloses none of it: the node is reported as TSMC N3P, Broadcom is the design partner, analysts disagree over how the memory orders split between Samsung and SK hynix, and the system builder is variously reported as Celestica or Inventec. Google has never published the memory stack count, die area, transistor count or power draw.

## Google TPU 8i (Zebrafish)
`google-tpu-8i`

With its eighth generation Google split the TPU in two, and the interesting half is the inference chip. TPU 8i is a single larger compute die with 288 GB of HBM at 8,601 GB/s and 10.1 PFLOPS of FP4, paired with 384 MB of on-chip Vmem, three times what the training part carries, to hold the key-value cache that a model builds up as it answers ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). It drops SparseCores and spends the area on a Collectives Acceleration Engine that cuts on-chip collective latency about fivefold. The fabric changed too: a hierarchical Boardfly topology with a seven-hop maximum instead of a 3D torus, in pods of up to 1,024 active chips arranged as 36 groups of 8 boards ([source](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)). The training half, TPU 8t, keeps the 3D torus and scales to 9,600 chips with 216 GB of HBM at 6,528 GB/s and 12.6 PFLOPS of FP4. Google has named no design partner, node, packaging, power figure or availability date for either chip.

## AWS Trainium3
`aws-trainium3`

Trainium3 uses TSMC CoWoS-R, an organic thin-film interposer of six copper wiring layers on polymer, mounted on a 20-layer build-up substrate. That is a deliberate move away from the silicon interposer, and it sidesteps the CoWoS-S and CoWoS-L queue that gates everyone else ([source](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential)). Two compute dies on TSMC N3P carry eight NeuronCore-v4 cores and 256 MiB of SBUF. Four 12-high HBM3E stacks give 144 GB at 4.9 TB/s, at a 9.6 Gbps pin speed that is the fastest HBM3E documented, and SK hynix and Micron supply them after Samsung lost the socket. AWS's Neuron documentation is unusually honest about precision: 671 TFLOPS dense BF16 rising to 2,517 with 4x structured sparsity, 2,517 TFLOPS MXFP8, and 2,517 TFLOPS MXFP4, meaning FP4 buys no throughput at all on this part ([source](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trainium3.html)). Trn3 UltraServers went generally available on 2 December 2025 with 144 chips per scale-up domain, 20.7 TB of HBM3E and 362 PFLOPS FP8, linked by NeuronLink-v4 at 2.56 TB/s per device over 160 PCIe Gen6 lanes ([source](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/)). Alchip took the back-end physical design from Marvell for this generation.

## Microsoft Maia 200
`microsoft-maia-200`

Microsoft puts Maia 200 on TSMC 3 nm with over 140 billion transistors, 216 GB of HBM3E at 7 TB/s, 272 MB of on-die SRAM, over 10 petaFLOPS FP4 and over 5 petaFLOPS FP8, in a 750 W envelope for the whole system on chip ([source](https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/)). All of that sits on one die rather than a chiplet package, which makes it the odd one out among 2026 flagships. Its own architecture deep dive is more precise: 10.1 PetaOPS FP4, with FP4 running at twice the FP8 rate and eight times BF16, which puts FP8 at about 5.05 PFLOPS ([source](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/deep-dive-into-the-maia-200-architecture/4489312)). Networking is all Ethernet with no separate fabric for scale-out: an on-die network interface carries 1.4 TB/s in each direction, four accelerators form a switchless Fully Connected Quad, and a switched second tier reaches 6,144 accelerators. Microsoft has not named the HBM supplier or the number of stacks. It shipped about six months later than Microsoft first planned, into Azure US Central in Iowa, with Marvell as the co-design partner.

## Meta MTIA 400
`meta-mtia-400`

Meta announced four generations of its own accelerator, the MTIA, at once in March 2026, and says it can now ship a new one roughly every six months ([source](https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/)). MTIA 400 is the second of them, and Meta's own account gives only ratios: two compute chiplets, 400 percent more FP8 FLOPS and 51 percent more memory bandwidth than MTIA 300, and 72 accelerators working as one over a switched backplane. The 400, 450 and 500 share a chassis, rack and network, so each generation drops into halls that already exist. Meta showed absolute figures at Hot Chips 2026, but the deck is registration-gated, so this page keeps only the ratios Meta has published openly. For scale, the published MTIA 300 carries 216 GB of HBM3E, 1.2 TB/s of total I/O and two network chiplets holding twelve 800 Gbps RDMA NICs ([source](https://engineering.fb.com/2026/08/24/networking-traffic/mtia-300-meta-training-chip-built-in-nics/)). The supply-chain fact that matters is the Broadcom relationship, confirmed in April 2026: Broadcom supplies the XPU design platform, the advanced packaging and the Ethernet across multiple MTIA generations, with a first phase above one gigawatt ([source](https://about.fb.com/news/meta-partners-with-broadcom/)). That makes Meta the third hyperscaler whose accelerator roadmap runs through a single vendor. Meta has published no node, die area, transistor count or HBM supplier.

## OpenAI Jalapeño
`openai-jalapeno`

OpenAI finished the design of Jalapeño, its first chip, in nine months: an inference part the size of one lithography exposure, built under the 10 gigawatt co-development deal it signed with Broadcom in October 2025 ([source](https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/)). OpenAI refuses to publish peak FLOPS and argues the metric is wrong, quoting delivered throughput instead: on SemiAnalysis's InferenceX benchmark the part returns about 1,400 tokens per second per user on Kimi-K2.5 and GPT-OSS and over 700 on DeepSeek R1 at concurrency 1 ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)). The architecture is memory-sliced, with each core owning a slice of HBM, on the premise that HBM bandwidth is not the bottleneck for inference. The supply chain is entirely Broadcom and its orbit: Broadcom does the design and packaging, Broadcom Tomahawk switches provide the networking, and Celestica does the system-level design. The links run over Ethernet at 4.8 Tb/s per chip inside a 128-accelerator rack, and 1.6 Tb/s on the global link across 2,048 chips in 16 racks ([source](https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia)). At 700 W against the GB300's 1,400 W, and 1.5x to 1.9x the throughput per kilowatt of Nvidia's GB200 and GB300 racks, it is the first customer-designed part with a credible efficiency win over Nvidia ([source](https://openai.com/index/jalapeno-first-results/)). Node, foundry, die area, HBM capacity and bandwidth remain undisclosed.

## Intel Gaudi 3
`intel-gaudi3`

Intel documents eight matrix multiplication engines and 64 tensor processor cores across two compute dies, 1.8 PFLOPS for both FP8 and BF16, 128 GB of HBM2E from eight stacks at 3.7 TB/s, and 24 200-gigabit RDMA NIC ports on the package ([source](https://docs.habana.ai/en/latest/Gaudi_Overview/Gaudi_Architecture.html)). Those ports are why Gaudi 3 is the only AI accelerator sold on the open market that bet entirely on standard Ethernet. Twenty-one further on-package 200 Gb/s RoCE links tie the eight cards on a baseboard together, so a Gaudi cluster needs no proprietary cable plant and no InfiniBand ([source](https://www.intel.com/content/www/us/en/content-details/817486/intel-gaudi-3-ai-accelerator-white-paper.html)). The absence that killed it is FP4: with no four-bit datapath, Gaudi 3 fell out of contention for 2026 inference work just as the market moved to four-bit arithmetic. It is also Intel's last Gaudi part. Intel cancelled Falcon Shores as a commercial product, its 2026 pipeline is Crescent Island, an Xe3P inference GPU with 160 GB of LPDDR5X rather than HBM, and the rack-scale Jaguar Shores is a 2027 part.

## Cerebras WSE-3 Turbo (CS-4)
`cerebras-wse3-turbo`

Cerebras is the only vendor that ignores the reticle limit, the largest rectangle a scanner can print in one shot, rather than working around it. The WSE-3 is one 46,225 mm2 device stitched from 84 such rectangles on TSMC N5, four trillion transistors and 900,000 AI cores, with 44 GB of on-wafer SRAM and no HBM at all ([source](https://www.cerebras.ai/product-chip)). The Turbo revision reaches 250 PFLOPS and doubles memory bandwidth to 43.2 PB/s, and Cerebras names no precision and no dense-or-sparse basis for the compute figure, so it cannot be compared with a vendor FP16 or FP8 rate ([source](https://www.cerebras.ai/cs4)). That design removes two chokepoints at once, advanced packaging and HBM supply, and replaces them with a yield and power problem: the CS-4 packs three wafers per rack, each in a water-cooled compute backpack fed by up to 30 air-cooled AC/DC power-supply modules, at 750 PFLOPS aggregate, 53.5 PB/s of on-wafer fabric bandwidth and about two microseconds wafer to wafer ([source](https://www.cerebras.ai/blog/ultrafast-frontier-inference-cerebras-deep-dive-at-hot-chips-2026)). First CS-4 shipments began in the third quarter of 2026, after Cerebras went public in May ([source](https://www.cerebras.ai/blog/introducing-cerebras-cs-4)). Cerebras has never published a per-wafer power figure.

## Groq LPU
`groq-lpu`

Groq's LPU is the purest on-chip-memory design in production, a deterministic pipeline with no external memory at all: weights, key-value cache and activations live on the die ([source](https://groq.com/lpu)). The first generation was a roughly 725 mm2 die on GlobalFoundries 14 nm with 230 MB of SRAM, made and packaged in the United States, which makes it the only major AI accelerator with no Taiwanese silicon in it. SemiAnalysis put its raw wafer cost below $6,000, against about $16,000 for an H100 wafer ([source](https://newsletter.semianalysis.com/p/groq-inference-tokenomics-speed-but)). The tradeoff is that no single chip holds a useful model, so the unit of deployment is the rack: Groq now quotes 256 LPUs per rack, 128 GB of aggregate SRAM, 40 PB/s of SRAM bandwidth and 315 PFLOPS of FP8, which works out to roughly 500 MB, 156 TB/s and 1,230 TFLOPS per accelerator ([source](https://groq.com/inference)). In 2026 Groq's roadmap product became an Nvidia-branded rack, the NVIDIA Groq 3 LPX, pairing 256 next-generation LPUs with Vera Rubin. Groq publishes no per-chip TDP, FP16 or FP4 figure.

## Huawei Ascend 910C
`huawei-ascend-910c`

The 910C is the industry's clearest case of a domestic chip that is not really domestic. It is nominally an SMIC N+2 part, but SemiAnalysis judges that most 910B and 910C dies were actually made on TSMC N7, reaching Huawei through Sophgo before TSMC cut it off, and that Huawei stockpiled 13 million HBM stacks, enough for 1.6 million 910C packages at roughly eight stacks each ([source](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72)). Chinese teardown scrutiny of those origins is now itself a policy matter: China's Ministry of Commerce added TechInsights to its unreliable entity list, accusing it of assisting foreign governments in suppressing Chinese enterprises, which bars Chinese entities from supplying it ([source](https://english.mofcom.gov.cn/News/SpokesmansRemarks/art/2025/art_ae8ca3f16ddb475cb3a9b51a025887c9.html)). Per-chip performance is weak and poorly documented: Huawei publishes nothing, and the CloudMatrix aggregate implies about 781 TFLOPS dense BF16 per chip. Huawei's answer is brute force: CloudMatrix 384 delivers about 300 PFLOPS dense BF16, roughly twice a GB200 NVL72, while drawing about four times the power and running about 2.5 times worse per FLOP.

## Huawei Ascend 950PR
`huawei-ascend-950pr`

Xu Zhijun laid out Huawei's accelerator roadmap at Huawei Connect in September 2025, and the claim that mattered most was that the 950PR would ship with Huawei's own high-bandwidth memory rather than stockpiled Korean stacks ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). The roadmap promised 950PR in Q1 2026 with HiBL 1.0, at 1 PFLOPS in FP8 and 2 PFLOPS in MXFP4 with 2 TB/s of interconnect, then 950DT in Q4 2026 with 144 GB of HiZQ 2.0 at 4 TB/s, the 960 in 2027 and 970 in 2028, alongside an Atlas 950 SuperPoD of 8,192 chips at 8 exaFLOPS FP8. Huawei sells the part as the Atlas 350 card, which it says doubles vector compute over the previous generation and can run alone or four-way over UnifiedBus ([source](https://www.huawei.com/en/news/2025/9/hc-superpod-innovation)). What Huawei has never published is the card's memory capacity or bandwidth, its power draw, its node, or any package photo, die count or transistor count, so the 950PR is the least verifiable flagship on this page.

## Cambricon Siyuan 590
`cambricon-siyuan-590`

Almost nothing about the Siyuan 590 is public: Cambricon's own site still lists only the MLU270 and MLU370, with no product page for the 590 or the newer 690, and no performance figure for the part survives in an allowed source ([source](https://www.cambricon.com/)). That makes Cambricon the purest read on the SMIC bottleneck, because unlike Huawei it has no smuggled TSMC die bank to fall back on. The constraint is the foundry rather than demand: SMIC shares its capacity with Huawei and other domestic designers, and cannot expand much under equipment controls. Cambricon has been cut off from US-origin technology since 16 December 2022, when the Bureau of Industry and Security added seven Cambricon entities to the Entity List ([source](https://www.federalregister.gov/documents/2022/12/19/2022-27151/additions-and-revisions-to-the-entity-list-and-conforming-removal-from-the-unverified-list)).

## Moore Threads MTT S5000
`moore-threads-mtt-s5000`

Moore Threads builds the MTT S5000 on its PH100 chip in what it calls the Pinghu architecture, and claims full-precision support from FP8 to FP64, at least 4,000 tokens per second of single-GPU prefill, the pass that reads the prompt, and 1,000 per second of decode, the pass that writes the answer, and 95 percent linear scaling at ten-thousand-GPU scale ([source](https://en.mthreads.com/product/S5000)). It publishes no peak FLOPS, no node, no foundry, no memory configuration, no power figure and no price, and no independent benchmark exists, which is what selling a Chinese accelerator on software compatibility rather than on measured silicon looks like. It does document the MUSA stack and its adaptation to PyTorch, Megatron-LM, vLLM and SGLang, which is how Chinese accelerators substitute for CUDA in practice, and the KUAE cluster product that packages the parts up to ten thousand GPUs ([source](https://en.mthreads.com/product/KUAE)).

## H20 (HGX H20, China variant)
`nvidia-h20`

Nvidia’s third attempt at a compliant China part, and the one that showed the limits of designing to a threshold: a chip built to sit inside the rules still needed a licence eighteen months later. Nvidia publishes no datasheet, no die area, no stack count and no NVLink rate for it, so almost everything here comes from Epoch AI’s database rather than from the vendor. The 96 GB of HBM3 implies six 16 GB stacks on a die that carries six stack sites, but Nvidia has not confirmed that. SemiAnalysis reported working samples in November 2023 and mass production within a month, which is where the shipping quarter above comes from.

## H800 (China variant of the H100)
`nvidia-h800`

The China variant that cost Chinese buyers the least in practice. Epoch AI’s calculation is that the H800 was about as good as the H100 on training FLOP per second per dollar, because 400 GB/s of NVLink is still enough to hide communication behind useful work; the loss shows up in long-context inference instead. Its interconnect figure is the one number on this page that two allowed sources contradict each other on: CSIS says 300 GB/s and Epoch AI says 400 GB/s. Both are recorded above rather than averaged. Nvidia has published nothing about the part, and Epoch AI dates it to 21 March 2023.

## A800 (China variant of the A100)
`nvidia-a800`

The clearest case on the site of a product designed against a regulation rather than a workload. Nvidia’s own 8-K of 31 August 2022 had already said the licence would extend to any future chip meeting both peak performance and chip-to-chip thresholds roughly equivalent to the A100, and the A800 answers that by failing only one of the two. Commerce Secretary Gina Raimondo’s reply, quoted by CSIS, was that if a chip is redesigned around a cut line to enable AI, she would control it the next day. Epoch AI dates the A800 variants to August and November 2022.

## H100 (SXM5)
`nvidia-h100`

The chip the 2023 and 2024 build-out ran on, and the one every China variant is measured against. Nvidia states that the full GH100 carries six HBM3 or HBM2e stack sites and that the SXM5 part uses five of them for 80 GB. The H200 that follows it is the same die with 141 GB of HBM3E, which is why the H200 rather than the H100 became the chip Washington eventually let into China. Nvidia’s 8-K of 31 August 2022 still calls the H100 forthcoming, and Epoch AI dates the SXM5 part to September 2022.

## A100 (80 GB SXM)
`nvidia-a100`

The reference point for every threshold since. BIS set the October 2022 line just under the A100 on both axes it used, peak performance and chip-to-chip bandwidth, which is why the A800 exists at all. Nvidia describes five active HBM2 stacks on the 40 GB SXM4 board, so the 80 GB part carries the same five sites at 16 GB each in HBM2e; Nvidia names no memory supplier, no package dimensions and no list price. Epoch AI dates the SXM4 A100 to 14 May 2020 and the 80 GB version to 16 November 2020.

## Instinct MI325X
`amd-mi325x`

The same CDNA 3 silicon as the MI300X with 256 GB of HBM3E at 6 TB/s and a 1,000 W board, and the only AMD part Washington has ever named as licensable for China. Both halves of that licence sit close to the line: 20,919 against a 21,000 ceiling, 6,000 GB/s against a 6,500 GB/s ceiling. AMD publishes no list price, no die areas and no assembler.

## Instinct MI300X
`amd-mi300x`

The first accelerator to put 192 GB on one package, a year before Nvidia matched it, and the first to break a data center GPU into a dozen chiplets: eight N5 accelerator dies bonded onto four N6 I/O dies, 153 billion transistors in all. The stack count is not printed on AMD’s page but follows from it, since the 8,192-bit memory interface is eight 1,024-bit HBM channels, and the CDNA 3 white paper says eight stacks. AMD publishes no list price, no die areas and no assembler.

## TPU v6e (Trillium)
`google-tpu-v6e`

The last TPU before Ironwood, and the one Google scaled hardest for external customers. Bandwidth pins the memory down even though Google will not: 1,638 GB/s across 32 GB works out at two stacks running near HBM3 pin speed. Google publishes compute, memory and fabric numbers for its TPUs and nothing else: no foundry, no process node, no die area, no transistor count, no package type and no HBM stack count. Those fields are empty here rather than filled from unofficial reporting. Epoch AI puts the power draw at about 380 W; that is an estimate, not a Google figure, so the TDP field is empty.

## TPU v5p
`google-tpu-v5p`

The training TPU of the pre-Ironwood era, and the largest coherent domain Google had built at the time: 8,960 chips in a 3D torus. It carries two TensorCores and four SparseCores per chip. Its FP8 rate matching its BF16 rate is the clearest sign that the v5 generation was designed before low precision became the axis of competition. Google publishes compute, memory and fabric numbers for its TPUs and nothing else: no foundry, no process node, no die area, no transistor count, no package type and no HBM stack count. Those fields are empty here rather than filled from unofficial reporting.

## TPU v5e
`google-tpu-v5e`

The cheap TPU, sold on performance per dollar rather than peak: Google quotes it at 0.65 times the cost of ownership of the v4 for the same work. It is also the clearest illustration of why BIS added a density test in October 2023. A chip can sit under the 4,800 line and still be worth controlling, because 256 of them in a pod deliver 50.63 PFLOPs. Google publishes compute, memory and fabric numbers for its TPUs and nothing else: no foundry, no process node, no die area, no transistor count, no package type and no HBM stack count. Those fields are empty here rather than filled from unofficial reporting.

## TPU v4
`google-tpu-v4`

The generation that made TPUs credible outside Google, and the only one on this page with a published power figure: Google reports measured minimum, mean and maximum draw of 90, 170 and 192 W, so the TDP field above carries the measured maximum rather than a rating. Two TensorCores per chip, HBM2 rather than the unnamed HBM of later parts, and a 3D mesh instead of the torus that came later. Google publishes compute, memory and fabric numbers for its TPUs and nothing else: no foundry, no process node, no die area, no transistor count, no package type and no HBM stack count. Those fields are empty here rather than filled from unofficial reporting.

## Trainium2
`aws-trainium2`

The chip that made AWS a credible second source, and the generation Anthropic trained on at scale. It is also a good demonstration of how the export-control arithmetic behaves: FP8 doubles the BF16 rate on most accelerators, but on Trainium2 it falls short of double, so the BF16 figure sets the total processing performance. Epoch AI dates the part to 3 December 2024; AWS’s own documentation carries no date. AWS publishes compute, memory and fabric numbers and nothing about the silicon: no node, no foundry, no die count, no package and no power figure. Epoch AI puts the draw at about 500 W, which is an estimate rather than an AWS number.

## Maia 100
`microsoft-maia-100`

Microsoft’s first accelerator, and the first silicon anywhere to implement the Microscaling data format that later became the MX standard. Microsoft published the cooling design in detail, down to the sidekick heat exchanger that sits beside the rack, and almost nothing about the chip: no memory capacity, no bandwidth, no transistor count and no throughput. The date above is that of the Azure post carrying these figures, 3 April 2024; Epoch AI records the part at August 2024, when Microsoft presented it publicly. The die area and power here come from Epoch AI, not from Microsoft.

## MTIA v2
`meta-mtia-v2`

The one large accelerator on this page with no HBM at all: 128 GB of LPDDR5 at 204.8 GB/s, about a sixteenth of an H100’s memory bandwidth, backed by 256 MB of on-chip SRAM, in a 90 W envelope. That is a deliberate choice for ranking and recommendation work, where the model is small and the traffic is enormous. Meta also publishes what almost nobody else does: the die measures 25.6 by 16.4 mm, 421 mm2, and holds 2.35 billion gates on TSMC 5 nm.

## Gaudi 2
`intel-gaudi2`

The chip that set the Ethernet bet Gaudi 3 inherited: 24 RDMA NICs on the package, so a Gaudi cluster needs no proprietary cable plant and no InfiniBand. It also carries 48 MB of local SRAM and hardware video decoders that let it run its own pre-processing. Intel positioned it against the A100 and, unusually for a vendor, published no peak throughput figure for it, which is why the compute row here rests on Epoch AI rather than a datasheet.

## Ascend 910B
`huawei-ascend-910b`

The domestic answer to the A100, and the evidence that export controls bite. CSET dates the series to 2022; no allowed source gives a first-shipment date, so that field is empty. CSET finds that Huawei needed at least two years to redesign the part for SMIC and cut the number of active AI cores between the first and second generations, most likely because of yield or capacity limits on SMIC’s 7 nm line. The 910B ships in several grades, from a 910B4 at 32 GB and 800 GB/s to a 910B1 at 64 GB and 1.6 TB/s; the figures above are the top of that range. SemiAnalysis places the chip between the A100 and the H100 in performance. Huawei publishes no die area, transistor count, package detail or per-chip datasheet.
