---json
{
  "id": "introduction-and-goals",
  "number": 1,
  "title": "Introduction and Goals",
  "oneLiner": "A component-level map of the hardware that makes AI chips, from sand to a rack. Eighteen stages, and the handful of firms that own each one.",
  "specimen": "package",
  "specimenCaption": "Right: an AI accelerator package. Two logic dies in the centre, eight HBM stacks flanking them, all sitting on a silicon interposer that sits on an organic substrate. Every chapter of this site explains one layer of this object or one machine that made it.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "Fabricates and packages nearly all leading-edge AI accelerators"},
      {"name": "ASML", "country": "NL", "share": "Sole supplier of EUV lithography"},
      {"name": "SK hynix", "country": "KR", "share": "Leading HBM supplier; all three HBM makers effectively sold out in 2025"},
      {"name": "Nvidia", "country": "US", "share": "~70% of the AI chip market, 2026 estimate"}
    ],
    "countries": [
      {"code": "TW", "note": "Leading-edge logic, CoWoS packaging, substrates, ASIC design services"},
      {"code": "US", "note": "Accelerator architecture, EDA, deposition and etch tools, systems"},
      {"code": "KR", "note": "HBM. SK hynix and Samsung"},
      {"code": "NL", "note": "ASML lithography"},
      {"code": "JP", "note": "Photoresist, wafers, specialty chemicals, substrates, test"}
    ],
    "chinaStatus": "Can design competitive accelerators and can fabricate at SMIC's 7 and 5 nm-class nodes with imported DUV. Cannot buy EUV, cannot make HBM at volume, and cannot yet run a full leading-edge EDA flow on domestic tools.",
    "usStatus": "Owns the architecture, the design software and much of the equipment, but almost none of the physical manufacturing of leading-edge logic, HBM or advanced packaging.",
    "costSignal": "Hyperscaler capex reached $448.2B in 2025 across five firms",
    "substitution": {"years": "10+", "why": "No country has ever rebuilt the whole chain. The narrowest stages, EUV optics and HBM stacking, each took two decades and tens of billions of dollars of accumulated process knowledge."}
  },
  "keyFacts": [
    {"fact": "Training compute for frontier AI models has grown 4-5x per year since 2010", "source": "https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year"},
    {"fact": "Hyperscaler capex was $448.2B in 2025, up from $162.3B in 2022", "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"},
    {"fact": "Nvidia data center revenue was $193.7B in fiscal 2026, up 68%", "source": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026"},
    {"fact": "Four AI chip designers took 80-85% of TSMC CoWoS capacity but only ~11% of leading-edge logic capacity in 2024-2025", "source": "https://epoch.ai/blog/introducing-the-ai-chip-components-explorer"},
    {"fact": "Component spending by those four designers rose from $22B in 2024 to $52B in 2025", "source": "https://epoch.ai/blog/introducing-the-ai-chip-components-explorer"},
    {"fact": "A GB300 NVL72 rack holds 72 GPUs, 20 TB of GPU memory and 576 TB/s of memory bandwidth", "source": "https://www.nvidia.com/en-us/data-center/gb300-nvl72/"},
    {"fact": "DeepSeek-V3 used 2.788M H800 GPU-hours for its full training run on 14.8T tokens", "source": "https://arxiv.org/abs/2412.19437"},
    {"fact": "Compute needed to reach a fixed language model performance level halves roughly every 8 months", "source": "https://epoch.ai/blog/algorithmic-progress-in-language-models"}
  ],
  "figures": [
    {
      "id": "ai-capex",
      "type": "bars",
      "title": "Hyperscaler capex: Alphabet, Amazon, Meta, Microsoft, Oracle ($B). 2026 is a trend extrapolation, not guidance",
      "unit": "$B",
      "data": [["2022", 162.3], ["2023", 161.3], ["2024", 260.4], ["2025", 448.2], ["2026 (trend)", 770]],
      "source": {"label": "Epoch AI, from company financial filings, updated February 2026", "url": "https://epoch.ai/data-insights/hyperscaler-capex-trend"}
    },
    {
      "id": "compute-growth",
      "type": "bars",
      "title": "Nvidia data center revenue by fiscal year ($B), a proxy for AI compute delivered",
      "unit": "$B",
      "data": [["FY2023", 15.0], ["FY2024", 47.5], ["FY2025", 115.2], ["FY2026", 193.7]],
      "source": {"label": "Nvidia fiscal-year results releases", "url": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026"}
    }
  ]
}
---
# Introduction and Goals

An AI accelerator is not a chip. It is a stack of about a dozen separately manufactured objects, each made by a different set of firms in a different country, assembled into one package that only one company in the world can currently assemble at volume.

This site takes that package apart. Eighteen chapters, one per stage, from the sand that becomes a silicon wafer to the liquid-cooled rack on a data center floor. Each chapter answers the same three questions: how does this stage work, where do the trade-offs and bottlenecks sit, and who controls it and how hard would it be to replace them.

## Why AI chips?

Because the demand curve is unlike anything else in electronics. The compute used to train frontier AI models has grown 4 to 5 times per year since 2010 ([source](https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year)). Across the broader set of notable models the figure is 4.7x per year, a doubling roughly every six months ([source](https://epoch.ai/data-insights/compute-trend-post-2010)). Nothing in the semiconductor industry has ever had to absorb a demand signal that steep for that long.

The money followed. Capex at the five largest hyperscalers went from $162.3 billion in 2022 to $448.2 billion in 2025 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). Nvidia's data center revenue went from $15.01 billion in fiscal 2023 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2023)) to $47.5 billion in fiscal 2024 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2024)) to $115.2 billion in fiscal 2025 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2025)) to $193.7 billion in fiscal 2026 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026)). In the quarter ending 26 July 2026 alone it booked $89.0 billion of data center revenue ([source](https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000073/q2fy27cfocommentary.htm)).

{{figure:ai-capex}}

{{figure:compute-growth}}

What that money buys is a system, not a die. A modern accelerator is one or more logic dies built on a 3 nm-class process, a set of HBM stacks that supply memory bandwidth, a silicon interposer that wires the two together, an organic substrate underneath, a board, and a rack. Google's TPU v7 Ironwood is a dual-chiplet part on TSMC N3P with 192 GB of HBM3E at 7.37 TB/s ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). An Nvidia GB300 NVL72 rack integrates 72 GPUs and 36 CPUs into 20 TB of GPU memory, 576 TB/s of memory bandwidth and 130 TB/s of NVLink bandwidth ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)). Every one of those numbers is set by a different supplier.

## The chain in one paragraph

Polysilicon is pulled into a single-crystal ingot and sliced into 300 mm wafers. A design house turns an architecture into a layout using EDA software and licensed IP, then hands a mask set to a foundry. The foundry prints that layout hundreds of times per wafer, layer by layer, alternating lithography with deposition, etch, cleaning and metrology, using photoresists and specialty gases from a handful of Japanese and Korean suppliers. Finished wafers are tested, thinned and diced. Separately, a memory maker stacks bare DRAM dies with through-silicon vias to build an HBM cube. An advanced packaging line then places the logic dies and the HBM stacks side by side on a silicon interposer, attaches that to an ABF substrate, and ships a part the size of a coaster. Systems integrators solder several of those onto a baseboard, put the baseboard in a chassis with switch silicon and optics, put the chassis in a rack with cold plates and busbars, and plug the rack into a substation. Every chapter here is one link in that sentence.

## Why does the supply chain matter?

The case for treating hardware as the binding constraint on AI is empirical. In 2025 the four largest AI chip designers consumed 80 to 85 percent of TSMC's CoWoS advanced packaging output and nearly all available HBM, while taking only about 11 percent of global leading-edge logic capacity ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). The scarce thing was never transistors. It was the ability to stack memory next to them. All three HBM suppliers were effectively sold out, and component spending by those four designers rose from $22 billion in 2024 to $52 billion in 2025 ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). When a decomposition of language model progress is run, 60 to 95 percent of measured performance gains trace to scaling compute and data rather than to algorithms ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)).

The counter-case is equally empirical. DeepSeek-V3 was trained on 14.8 trillion tokens using 2.788 million H800 GPU-hours, an order of magnitude below what comparable Western models were understood to cost ([source](https://arxiv.org/abs/2412.19437)). The compute required to reach a fixed language model performance level halves roughly every eight months, with a 95 percent confidence interval of 5 to 14 months ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)). Inference prices fall faster still: the price of GPT-4-level performance on a set of PhD-level science questions dropped 40x per year, and across benchmarks the decline ranges from 9x to 900x per year ([source](https://epoch.ai/data-insights/llm-inference-price-trends)). And the workload mix is shifting toward inference, which Deloitte projected would account for two-thirds of all AI compute in 2026 ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).

Both things are true, and they do not cancel. Efficiency gains have so far raised total compute consumption rather than lowering it, because cheaper inference unlocks more of it. The supply chain does not determine what AI can do. It determines how much of it exists, who can afford it, and which governments can switch it off.

## How to read this site

Every chapter opens with a chokepoint card. It has three numbers you should read first.

**Concentration** is a qualitative rating of how many firms credibly supply this stage: Extreme, High, Moderate or Low.

**Chokepoint score** runs from 1 to 5. A 1 means many substitutes and a switch that costs a quarter. A 5 means a single point of failure, where losing one supplier stops leading-edge production worldwide.

**Substitution time** is our estimate of how long a determined, well-funded state or firm would need to stand up a working alternative, with a one-line reason. It is the most opinionated number on the card and the one to argue with.

The card also lists the leading firms with their shares, the countries where value is captured or where the physical work happens, China's current position, the United States' position, and a cost signal for the key tool or material.

The chapters run in process order. Design and EDA, then silicon and wafers, chemicals and photoresist, lithography, photomasks, deposition and etch, metrology, transistors, foundries. Then the pieces that matter most for AI specifically: memory and HBM, advanced packaging, substrates and PCBs, test and assembly, systems and networking, data centers and power. Two synthesis chapters close it out, on component costs and on geopolitics.

## What we are not doing

We are not forecasting share prices, and nothing here is investment advice. We are not writing a policy brief; the geopolitics chapter describes export controls and their effects rather than recommending them. We are not attempting a fab construction manual, and where process detail would run past what a non-specialist can use, we stop.

We also do not write numbers we cannot source. Every figure on this site carries a link to the document it came from, with the year attached. Where good sources disagree, we give the range and cite both.

## Takeaways

AI compute demand has grown 4 to 5 times a year for over a decade, and the hardware chain that serves it was not built for that. The scarce inputs in 2025 were high-bandwidth memory and advanced packaging, not leading-edge transistors. Algorithmic efficiency is improving fast enough to matter, roughly a halving of required compute every eight months, but so far it has increased total hardware demand rather than reducing it. The rest of this site is about who owns each link, and what it would take to replace them.
