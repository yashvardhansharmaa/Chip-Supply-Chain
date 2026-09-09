---json
{
  "id": "introduction-and-goals",
  "number": 1,
  "title": "Introduction and Goals",
  "oneLiner": "A part-by-part map of the hardware that makes AI chips, from sand to a finished server rack: fifteen stages, and the handful of firms that own each one.",
  "plain": "An AI chip, the kind that trains and runs artificial intelligence models, is assembled rather than made in one place. A packaging line stacks about a dozen separately manufactured objects, each from a different country, into one finished package. It is like building a car whose engine, gearbox and wheels each come from a single factory, with no second factory anywhere able to make them. Most of those objects have one or two credible suppliers, and replacing any of them takes years rather than months. That is why a rule written in one capital city can slow computing everywhere.",
  "specimen": "wafer",
  "specimenCaption": "Right: a polished 300 mm wafer. Its 57 whole exposure fields, each a complete print of one chip pattern, are separated by the scribe streets where the saw will cut; the notch that fixes the wafer's orientation is drawn six times life size, and one field is amber. Every chapter explains one step this disc passes through on its way to a rack.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "Fabricates and packages nearly all leading-edge AI accelerators"},
      {"name": "ASML", "country": "NL", "share": "Sole maker of the extreme-ultraviolet machines that print the finest chip features"},
      {"name": "SK hynix", "country": "KR", "share": "Leading maker of high-bandwidth memory; all three makers effectively sold out in 2025"},
      {"name": "Nvidia", "country": "US", "share": "About 70% of the AI chip market, 2026 estimate"}
    ],
    "countries": [
      {"code": "TW", "note": "Leading-edge logic, CoWoS advanced packaging, substrates, custom chip design"},
      {"code": "US", "note": "Accelerator architecture, chip design software, deposition and etch tools, systems"},
      {"code": "KR", "note": "High-bandwidth memory: SK hynix and Samsung"},
      {"code": "NL", "note": "ASML lithography"},
      {"code": "JP", "note": "Photoresist, wafers, specialty chemicals, substrates, test"}
    ],
    "chinaStatus": "Designs competitive accelerators and fabricates at SMIC's 7 and 5 nm-class nodes on imported deep-ultraviolet scanners. It cannot buy extreme-ultraviolet machines, cannot make high-bandwidth memory at volume, and cannot yet run a full leading-edge design-software flow on domestic tools.",
    "usStatus": "Owns the architecture, the design software and much of the equipment, but almost none of the manufacturing of leading-edge logic, high-bandwidth memory or advanced packaging.",
    "costSignal": "$448.2B of capital spending by the five biggest cloud firms in 2025",
    "substitution": {"years": "10+", "why": "No country has ever rebuilt the whole chain. The narrowest stages, extreme-ultraviolet optics and memory stacking, each took two decades of accumulated process knowledge and tens of billions of dollars."}
  },
  "keyFacts": [
    {"fact": "Computing power used to train frontier AI models has grown 4-5x a year since 2010", "source": "https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year"},
    {"fact": "Capital spending by the five biggest cloud firms was $448.2B in 2025, up from $162.3B in 2022", "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"},
    {"fact": "Nvidia data center revenue was $193.7B in fiscal 2026, up 68%", "source": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026"},
    {"fact": "Four AI chip designers took 80-85% of TSMC's CoWoS advanced-packaging capacity but only ~11% of leading-edge logic capacity in 2024-2025", "source": "https://epoch.ai/blog/introducing-the-ai-chip-components-explorer"},
    {"fact": "Component spending by those four designers rose from $22B in 2024 to $52B in 2025", "source": "https://epoch.ai/blog/introducing-the-ai-chip-components-explorer"},
    {"fact": "A GB300 NVL72 rack holds 72 GPUs, 20 TB of GPU memory and 576 TB/s of memory bandwidth", "source": "https://www.nvidia.com/en-us/data-center/gb300-nvl72/"},
    {"fact": "DeepSeek-V3 used 2.788M Nvidia H800 GPU-hours to train on 14.8 trillion tokens", "source": "https://arxiv.org/abs/2412.19437"},
    {"fact": "The computing power needed to reach a fixed language model performance level halves roughly every 8 months", "source": "https://epoch.ai/blog/algorithmic-progress-in-language-models"}
  ],
  "figures": [
    {
      "id": "ai-capex",
      "type": "bars",
      "title": "Capital spending by five cloud firms: Alphabet, Amazon, Meta, Microsoft, Oracle ($B). The 2026 bar extrapolates the trend and is not company guidance",
      "unit": "$B",
      "data": [["2022", 162.3], ["2023", 161.3], ["2024", 260.4], ["2025", 448.2], ["2026 (trend)", 770]],
      "source": {"label": "Epoch AI, from company financial filings, updated February 2026", "url": "https://epoch.ai/data-insights/hyperscaler-capex-trend"}
    },
    {
      "id": "compute-growth",
      "type": "bars",
      "title": "Nvidia data center revenue by fiscal year ($B), a rough proxy for how much AI computing power was delivered",
      "unit": "$B",
      "data": [["FY2023", 15.0], ["FY2024", 47.5], ["FY2025", 115.2], ["FY2026", 193.7]],
      "source": {"label": "Nvidia fiscal-year results releases", "url": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026"}
    }
  ]
}
---
# Introduction and Goals

An AI accelerator, the chip that trains and runs AI models, is a stack of roughly a dozen separately made parts, and only one company, TSMC, can assemble them at volume.

This site takes that package apart, one chapter per stage, from the sand that becomes a wafer to the liquid-cooled rack it ends up in. Every chapter explains how the stage works, the trade-offs it forces, which firms control it, and how hard they would be to replace.

## How to read this site

Every chapter opens with a chokepoint card, and three fields on it matter most.

- **Concentration.** How many firms credibly supply this stage: Extreme, High, Moderate or Low.
- **Chokepoint score.** A 1 means many substitutes. A 5 means one supplier failing would stop leading-edge production worldwide.
- **Substitution time.** Our estimate of how long a well-funded state or firm would need to build an alternative. It is the most opinionated number on the card.

The card also gives China's position and America's. The chapters then follow the chip in the order it is built.

## Why AI chips?

The computing power used to train frontier AI models has grown 4 to 5 times a year since 2010 ([source](https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year)). No other part of the semiconductor industry has faced demand rising that fast for that long.

The money followed. Capital spending by the five biggest cloud firms went from $162.3 billion in 2022 to $448.2 billion in 2025 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). Nvidia's data center revenue rose from $15.01 billion in fiscal 2023 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2023)) to $193.7 billion in fiscal 2026 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026)).

{{figure:ai-capex}}

{{figure:compute-growth}}

The money buys racks. One Nvidia GB300 NVL72 holds 72 GPUs and 36 CPUs, 20 terabytes of GPU memory and 576 terabytes a second of memory bandwidth ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)), and a different supplier sets every one of those numbers.

## The chain in one paragraph

An AI chip, the kind that trains and runs artificial intelligence models, is assembled rather than made in one place. A packaging line stacks about a dozen separately manufactured objects, each from a different country, into one finished package. It is like building a car whose engine, gearbox and wheels each come from a single factory, with no second factory anywhere able to make them. Most of those objects have one or two credible suppliers, and replacing any of them takes years rather than months. That is why a rule written in one capital city can slow computing everywhere.

A crystal grower pulls purified silicon into a single crystal ingot, then slices it into the 300 mm discs, called wafers, that everything else is built on. A design house turns an architecture into a layout using design-automation software and licensed circuit blocks, then sends the mask set, the stencils that carry the pattern, to a foundry that makes chips for other firms.

The foundry prints that layout hundreds of times per wafer, alternating lithography, which projects the pattern in light, with deposition, etch, cleaning and measurement, on photoresists and specialty gases from a handful of Japanese and Korean suppliers. Test and assembly lines then probe the wafers, thin them and cut them into separate chips. Meanwhile a memory maker stacks bare memory dies, wired vertically through the silicon, into a cube of high-bandwidth memory.

A packaging line sets the logic dies and the memory cubes side by side on a silicon interposer, a slab of silicon that wires them together, mounts that on an ABF substrate, the stiff resin card underneath, and ships a part the size of a coaster. Systems integrators solder several of those packages onto a baseboard, add networking chips and optics, rack the chassis with liquid cold plates and power busbars, and plug it into a substation.

## Why does the supply chain matter?

The case that hardware sets the limit rests on numbers. In 2025 the four largest AI chip designers took 80 to 85 percent of TSMC's CoWoS advanced packaging output and nearly all available high-bandwidth memory, while using only about 11 percent of leading-edge logic capacity ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). Transistors were plentiful; what ran short was the ability to stack memory beside them.

All three memory suppliers were effectively sold out, and component spending by those four designers rose from $22 billion in 2024 to $52 billion in 2025 ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). Sixty to 95 percent of measured performance gains in language models trace to running more computing power over more data rather than to better algorithms ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)).

The counter-case rests on numbers too. DeepSeek-V3 trained on 14.8 trillion tokens of text for 2.788 million hours of Nvidia H800 chips, an order of magnitude below what comparable Western models were thought to cost ([source](https://arxiv.org/abs/2412.19437)). The computing power needed to reach a fixed performance level halves roughly every eight months, with a 95 percent confidence interval of 5 to 14 months ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)).

Neither finding cancels the other. Cheaper inference, the cost of running a trained model, has raised the total amount of computing bought, and the supply chain still sets how much AI exists and which governments can switch it off.

## Takeaways

Demand for AI computing has grown 4 to 5 times a year for over a decade, and the chain that serves it was not built for that ([source](https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year)). The scarce inputs in 2025 were high-bandwidth memory and advanced packaging, not transistors ([source](https://epoch.ai/blog/introducing-the-ai-chip-components-explorer)). Better algorithms halve the computing a given result needs about every eight months, and that has raised total hardware demand rather than cut it ([source](https://epoch.ai/blog/algorithmic-progress-in-language-models)). The rest of this site is about who owns each link, and what it would take to replace them.
