---json
{
  "id": "introduction-and-goals",
  "number": 1,
  "title": "Introduction and Goals",
  "oneLiner": "A component-level map of the hardware that makes AI chips, from sand to a rack. Eighteen stages, and the handful of firms that own each one.",
  "plain": "Building an AI chip, the kind that trains and runs an artificial intelligence model, is like building a car in which the engine, the gearbox and the wheels each come from a single factory somewhere in the world, with no second factory able to make them. About a dozen separately manufactured objects, each from a different country, are stacked into one finished package. Most of those objects have one or two credible suppliers, and replacing any of them takes years rather than months. That is why a rule written in one capital city can slow computing everywhere.",
  "specimen": "wafer",
  "specimenCaption": "Right: a polished 300 mm wafer, its 57 whole exposure fields ruled by scribe streets, the orientation notch drawn six times life size and one field in amber. Every chapter explains one step this disc passes through on its way to a rack.",
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

An AI accelerator is a stack of roughly a dozen separately made parts, and only one company in the world can assemble them at volume.

This site takes that package apart, one chapter per stage, from the sand that becomes a wafer to the liquid-cooled rack it ends up in. Every chapter covers how the stage works, where the trade-offs sit, and which firms control it and how hard they would be to replace.

## How to read this site

Every chapter opens with a chokepoint card, and three fields on it matter most.

- **Concentration.** How many firms credibly supply this stage: Extreme, High, Moderate or Low.
- **Chokepoint score.** A 1 means many substitutes. A 5 means a single point of failure, where losing one supplier stops leading-edge production worldwide.
- **Substitution time.** Our estimate of how long a well-funded state or firm would need to stand up an alternative. It is the most opinionated number on the card.

The card also gives China's position and the United States', and the chapters run in process order.

## Why AI chips?

Compute used to train frontier AI models has grown 4 to 5 times a year since 2010 ([source](https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year)). No other part of the semiconductor industry has faced demand rising that fast for that long.

The money followed. Capex at the five largest hyperscalers went from $162.3 billion in 2022 to $448.2 billion in 2025 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). Nvidia's data center revenue rose from $15.01 billion in fiscal 2023 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2023)) to $193.7 billion in fiscal 2026 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026)).

{{figure:ai-capex}}

{{figure:compute-growth}}

The money buys racks. One Nvidia GB300 NVL72 holds 72 GPUs and 36 CPUs, 20 TB of GPU memory and 576 TB/s of memory bandwidth ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)), and a different supplier sets every one of those numbers.

## The chain in one paragraph

Building an AI chip, the kind that trains and runs an artificial intelligence model, is like building a car in which the engine, the gearbox and the wheels each come from a single factory somewhere in the world, with no second factory able to make them. About a dozen separately manufactured objects, each from a different country, are stacked into one finished package. Most of those objects have one or two credible suppliers, and replacing any of them takes years rather than months. That is why a rule written in one capital city can slow computing everywhere.

A crystal grower pulls polysilicon into a single-crystal ingot and slices it into 300 mm wafers. A design house turns an architecture into a layout with EDA software and licensed IP, then hands a mask set to a foundry.

The foundry prints that layout hundreds of times per wafer, alternating lithography with deposition, etch, cleaning and metrology, on photoresists and specialty gases from a handful of Japanese and Korean suppliers. Test and assembly lines then probe, thin and dice the wafers. Meanwhile a memory maker stacks bare DRAM dies with through-silicon vias into an HBM cube.

A packaging line sets the logic dies and the HBM stacks side by side on a silicon interposer, attaches that to an ABF substrate, and ships a part the size of a coaster. Systems integrators solder several onto a baseboard, add switch silicon and optics, rack the chassis with cold plates and busbars, and plug it into a substation.

## Why does the supply chain matter?

The case for hardware as the binding constraint is empirical. In 2025 the four largest AI chip designers took 80 to 85 percent of TSMC's CoWoS advanced packaging output and nearly all available HBM, while using only about 11 percent of leading-edge logic capacity ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). Transistors were plentiful; what ran short was the ability to stack memory beside them.

All three HBM suppliers were effectively sold out, and component spending by those four designers rose from $22 billion in 2024 to $52 billion in 2025 ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). Sixty to 95 percent of measured performance gains in language models trace to scaling compute and data rather than to algorithms ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)).

The counter-case is just as empirical. DeepSeek-V3 trained on 14.8 trillion tokens for 2.788 million H800 GPU-hours, an order of magnitude below what comparable Western models were thought to cost ([source](https://arxiv.org/abs/2412.19437)). The compute needed to reach a fixed performance level halves roughly every eight months, with a 95 percent confidence interval of 5 to 14 months ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)).

Neither finding cancels the other. Cheaper inference has raised total compute consumption, and the supply chain still sets how much AI exists and which governments can switch it off.

## Takeaways

AI compute demand has grown 4 to 5 times a year for over a decade, and the chain that serves it was not built for that ([source](https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year)). The scarce inputs in 2025 were high-bandwidth memory and advanced packaging, not transistors ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). Algorithmic efficiency halves the compute a given result needs about every eight months, but that has raised total hardware demand rather than cut it ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)). The rest of this site is about who owns each link, and what it would take to replace them.
