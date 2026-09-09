---json
{
  "id": "systems-and-networking",
  "number": 15,
  "title": "Systems and Networking",
  "oneLiner": "A finished package is useless until it is bolted to a baseboard, fed a thousand amps and wired to seventy-one siblings. Assembly is diversified. The lasers are not.",
  "plain": "Think of a rowing eight. The crew only goes fast if every oar moves together, so the boat is built to keep them in step. This stage does the same for chips: it bolts each finished package onto a board, feeds it more than a thousand amps, and wires it to seventy-one neighbours so that a training run sees one machine instead of seventy-two. Copper carries a signal a few metres at most, so the longer links have to become light, and light needs lasers. That is why the tightest supply in this layer is a laser material, not a chip.",
  "specimen": "gpu-baseboard",
  "specimenCaption": "Right: an eight-GPU baseboard. Four accelerator modules per side, switch chips down the centre, voltage regulator banks along the long edges, and the high-density connectors that carry scale-out traffic off the board.",
  "card": {
    "concentration": "High",
    "chokepointScore": 3,
    "leaders": [
      {"name": "Nvidia", "country": "US", "share": "NVLink and NVSwitch scale-up; InfiniBand and Spectrum-X Ethernet"},
      {"name": "Broadcom", "country": "US", "share": "Merchant switch silicon (Tomahawk, Jericho) and most custom AI accelerators"},
      {"name": "Foxconn", "country": "TW", "share": "Largest AI rack assembler; builds in Taiwan, Mexico, Texas"},
      {"name": "InnoLight", "country": "CN", "share": "Largest optical module supplier; with Eoptolink >60% of 800G+ modules (2025)"},
      {"name": "Coherent", "country": "US", "share": "Indium phosphide lasers and datacom transceivers"}
    ],
    "countries": [
      {"code": "US", "note": "Switch and accelerator silicon, InP lasers, system design"},
      {"code": "TW", "note": "ODM design and rack integration; high-layer-count PCBs"},
      {"code": "CN", "note": "Optical module assembly and test"},
      {"code": "TH", "note": "Chinese module makers' offshore transceiver plants"},
      {"code": "MX", "note": "Rack integration for the North American market"}
    ],
    "chinaStatus": "Dominant in optical modules. Chinese firms hold seven of the top ten supplier slots and supply more than half the world's high-speed optical interconnects, which is why US regulators drafted import restrictions in 2026.",
    "usStatus": "Owns the switch silicon, the scale-up protocols and the laser materials, but almost none of the rack assembly. Nvidia and partners began US rack production in Houston and Dallas in 2025.",
    "costSignal": "Nvidia put $2B each into Coherent and Lumentum in March 2026 to buy indium phosphide laser capacity",
    "substitution": {"years": "2-3", "why": "Rack assembly and switch boxes have many credible builders, but indium phosphide laser fabs take 18 to 24 months to ramp and there are only a handful of them."}
  },
  "keyFacts": [
    {"fact": "NVLink 6 carries 3,600 GB/s per GPU, double NVLink 5's 1,800 GB/s and four times NVLink 4's 900 GB/s", "source": "https://www.nvidia.com/en-us/data-center/nvlink/"},
    {"fact": "A GB300 NVL72 rack holds 18 compute trays and 9 NVLink switch trays with 18 NVSwitch ASICs, drawing up to 142 kW", "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"},
    {"fact": "Ethernet took more than two-thirds of data center switch sales in AI back-end networks in 2025, up from a market InfiniBand once led", "source": "https://www.delloro.com/news/ethernet-more-than-doubles-size-of-infiniband-as-the-leading-fabric-for-ai-scale-out-networks-in-2025/"},
    {"fact": "Broadcom's Tomahawk 6 switches 102.4 Tbps on a single chip", "source": "https://www.broadcom.com/company/news/product-releases/64031"},
    {"fact": "Tomahawk 6 Davisson uses 16 co-packaged 6.4 Tbps optical engines and cuts optical interconnect power roughly 3.5x versus pluggable modules", "source": "https://www.globenewswire.com/news-release/2025/10/08/3163429/19933/en/Broadcom-Announces-Tomahawk-6-Davisson-the-Industry-s-First-102-4-Tbps-Ethernet-Switch-with-Co-Packaged-Optics.html"},
    {"fact": "InnoLight and Eoptolink together supply more than 60% of 800G-and-above optical modules", "source": "https://www.caixinglobal.com/2026-08-05/us-drafts-ban-on-chinese-optical-modules-exposing-mutual-supply-chain-risks-102471268.html"},
    {"fact": "Transceiver demand exceeded supply by roughly a factor of two in early 2026 because of indium phosphide constraints", "source": "https://futurumgroup.com/insights/nvidias-4b-optics-bet-signals-photonics-as-ais-next-bottleneck/"},
    {"fact": "Broadcom's AI semiconductor revenue was $16.7B in Q3 fiscal 2026, up 221% year over year, with custom XPUs 73% of it", "source": "https://finance.yahoo.com/technology/ai/articles/broadcom-q3-earnings-call-highlights-230318650.html"}
  ],
  "figures": [
    {
      "id": "nvlink-bandwidth",
      "type": "bars",
      "title": "NVLink bandwidth per GPU by generation",
      "unit": "GB/s",
      "data": [["NVLink 4 (Hopper)", 900], ["NVLink 5 (Blackwell)", 1800], ["NVLink 6 (Rubin)", 3600]],
      "source": {"label": "NVIDIA NVLink product page, 2026", "url": "https://www.nvidia.com/en-us/data-center/nvlink/"}
    },
    {
      "id": "ai-fabric-share",
      "type": "stack",
      "title": "Data center switch sales in AI back-end networks, 2025",
      "unit": "%",
      "data": [["Ethernet", 67], ["InfiniBand", 33]],
      "source": {"label": "Dell'Oro Group, March 2026", "url": "https://www.delloro.com/news/ethernet-more-than-doubles-size-of-infiniband-as-the-leading-fabric-for-ai-scale-out-networks-in-2025/"}
    },
    {
      "id": "optics-800g-share",
      "type": "stack",
      "title": "Supply of 800G-and-above optical modules, 2025",
      "unit": "%",
      "data": [["InnoLight and Eoptolink", 60], ["All other suppliers", 40]],
      "source": {"label": "Caixin, citing LightCounting, August 2026", "url": "https://www.caixinglobal.com/2026-08-05/us-drafts-ban-on-chinese-optical-modules-exposing-mutual-supply-chain-risks-102471268.html"}
    }
  ]
}
---
# Systems and Networking

A package computes nothing until it is wired into a machine. This is the layer where the chip supply chain meets the electrical and optical one, and where the binding constraint has moved from silicon to lasers.

## How it works

Think of a rowing eight. The crew only goes fast if every oar moves together, so the boat is built to keep them in step. This stage does the same for chips: it bolts each finished package onto a board, feeds it more than a thousand amps, and wires it to seventy-one neighbours so that a training run sees one machine instead of seventy-two. Copper carries a signal a few metres at most, so the longer links have to become light, and light needs lasers. That is why the tightest supply in this layer is a laser material, not a chip.

An accelerator ships as a module, not a bare chip: SXM in Nvidia's world, the OCP Accelerator Module in the open one. Eight modules bolt onto a baseboard, Nvidia's HGX or the open Universal Baseboard, which carries the power for all eight and the switch chips that let them reach each other at full speed. Because the logic runs well under one volt, the voltage regulators must sit within centimetres of the package.

Rack-scale systems dissolve the baseboard entirely. An Nvidia GB300 NVL72 holds 18 compute trays of four Blackwell Ultra GPUs each, plus nine NVLink switch trays with two NVSwitch ASICs apiece, and draws up to 142 kW through eight 33 kW power shelves ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Rubin keeps the same 72-GPU rack shape ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Two networks run through every AI cluster and they are not interchangeable. The scale-up fabric joins a few dozen accelerators into one memory-coherent domain at terabytes per second; the scale-out fabric joins thousands of those domains at hundreds of gigabits per second. Model parallelism lives on scale-up, so its bandwidth sets how large a model you can shard.

## Variants and trade-offs

### Scale-up: NVLink, UALink and Google's torus

Three architectures matter, and they differ in how many accelerators can share one coherent domain.

- **NVLink and NVSwitch.** Nvidia's per-GPU bandwidth went from 900 GB/s in NVLink 4 to 1,800 GB/s in NVLink 5 and 3,600 GB/s in NVLink 6, and the rack fabric moves 130 TB/s on Blackwell and 260 TB/s on Rubin ([source](https://www.nvidia.com/en-us/data-center/nvlink/)).
- **UALink.** The open answer, ratified at version 1.0 in April 2025, runs 200 Gbps per lane and addresses up to 1,024 accelerators in a pod, backed by AMD, Intel, Meta, AWS, Google, Microsoft and Cisco among others ([source](https://www.sdxcentral.com/news/ualink-consortium-releases-200g-10-specification-for-ai-accelerator-interconnects/)).
- **Google's 3D torus.** Ironwood, the seventh-generation TPU, wires 64 chips per rack over Google's own interconnect and uses optical circuit switches to stitch cubes into superpods of 9,216 chips, which costs latency but lets Google reroute around a failed rack in software ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

{{figure:nvlink-bandwidth}}

AMD's Helios rack is the first large deployment of the open approach: 72 MI450-series GPUs and 260 TB/s of scale-up bandwidth carried as UALink over Ethernet, with Oracle committed to 50,000 sockets from the third quarter of 2026 ([source](https://www.nextplatform.com/2025/10/14/oracle-first-in-line-for-amd-altair-mi450-gpus-helios-racks/)).

### Scale-out: InfiniBand versus Ethernet

InfiniBand owned this layer when AI clusters were small and homogeneous. It has lost. Ethernet took more than two-thirds of data center switch revenue in AI back-end networks across 2025 ([source](https://www.delloro.com/news/ethernet-more-than-doubles-size-of-infiniband-as-the-leading-fabric-for-ai-scale-out-networks-in-2025/)), and extended that lead in the first quarter of 2026 even as InfiniBand rebounded ([source](https://www.delloro.com/news/ethernet-extends-lead-in-ai-scale-out-networks-despite-strong-infiniband-rebound/)).

{{figure:ai-fabric-share}}

Two things caused the flip. Broadcom's Tomahawk 6 put 102.4 Tbps of switching on one chip, double the previous generation ([source](https://www.broadcom.com/company/news/product-releases/64031)). And the Ultra Ethernet Consortium standardised the lossless, congestion-aware behaviour InfiniBand had by birth. The vendor table is now unusually flat: Celestica led AI back-end Ethernet switching in the first quarter of 2026, ahead of Nvidia, Arista and Cisco ([source](https://www.delloro.com/news/ethernet-extends-lead-in-ai-scale-out-networks-despite-strong-infiniband-rebound/)). Whitebox builders on merchant silicon outsell the networking brands.

### Optics: pluggable, then co-packaged

Every scale-out link longer than a few metres is optical, and a cluster needs several transceivers per accelerator. Their power cost is why both switch vendors are moving the optics onto the switch package.

- **Tomahawk 6 Davisson.** Broadcom integrates sixteen 6.4 Tbps optical engines at 200 Gbps per channel and cuts optical interconnect power by about 70%, roughly 3.5 times better than pluggables ([source](https://www.globenewswire.com/news-release/2025/10/08/3163429/19933/en/Broadcom-Announces-Tomahawk-6-Davisson-the-Industry-s-First-102-4-Tbps-Ethernet-Switch-with-Co-Packaged-Optics.html)).
- **Quantum-X Photonics.** Nvidia's co-packaged InfiniBand switch offers 144 ports of 800G and shipped from late 2025 ([source](https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories)).
- **Spectrum-X Photonics.** The Ethernet version reaches 512 ports of 800G during 2026, with 3.5 times better power efficiency and, more important for supply, four times fewer lasers ([source](https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories)).

## Who makes it

Optical modules are the most concentrated part of this layer, and they are Chinese. Chinese firms hold seven of the top ten supplier slots, and InnoLight and Eoptolink alone account for more than 60% of 800G-and-above modules, which is why US officials were drafting import restrictions on Chinese-made modules as of August 2026 ([source](https://www.caixinglobal.com/2026-08-05/us-drafts-ban-on-chinese-optical-modules-exposing-mutual-supply-chain-risks-102471268.html)).

{{figure:optics-800g-share}}

The lasers inside those modules are a separate and much narrower business. Indium phosphide is the only practical material for the high-speed lasers in 800G and 1.6T optics, and epitaxy capacity is small. Demand exceeded supply by roughly two to one in early 2026, and Nvidia responded by investing $2 billion each in Coherent and Lumentum in March 2026; whether those fabs ramp inside 18 to 24 months determines whether optics keeps pace with Rubin ([source](https://futurumgroup.com/insights/nvidias-4b-optics-bet-signals-photonics-as-ais-next-bottleneck/)).

Switch and accelerator silicon is a US duopoly. Broadcom sells merchant Ethernet switching and designs most of the custom accelerators in the market, including Google's TPUs and Meta's MTIA; its AI semiconductor revenue hit $16.7 billion in the third quarter of fiscal 2026, with custom parts 73% of that ([source](https://finance.yahoo.com/technology/ai/articles/broadcom-q3-earnings-call-highlights-230318650.html)). Marvell holds the other side of the custom business, with AWS and Microsoft.

Physical assembly belongs to Taiwan. Foxconn, Quanta, Wistron and Inventec build most AI racks, and the first three each cleared NT$1 trillion, about US$32 billion, of revenue in 2025 on AI server demand ([source](https://www.digitimes.com/news/a20260109PD249/revenue-ai-server-foxconn-wistron-quanta.html)). Final integration is migrating toward the customer: Nvidia and its partners commissioned more than a million square feet of US manufacturing space in 2025, including a Foxconn plant in Houston and a Wistron plant in Dallas ([source](https://blogs.nvidia.com/blog/nvidia-manufacture-american-made-ai-supercomputers-us/)).

## The chokepoint

Most of this layer is not a chokepoint. At least five capable ODMs on three continents screw racks together, and power shelves, busbars, cables and connectors have many suppliers. If Foxconn stopped tomorrow, Quanta and Wiwynn would absorb the volume within a couple of quarters.

Three things are genuinely narrow.

- **Indium phosphide laser capacity.** This is a materials problem, not a design problem, and a cheque cannot buy epitaxy tools faster than they can be installed ([source](https://futurumgroup.com/insights/nvidias-4b-optics-bet-signals-photonics-as-ais-next-bottleneck/)).
- **NVSwitch.** No one else sells a merchant scale-up switch with NVLink's bandwidth, which is precisely what UALink exists to change ([source](https://www.sdxcentral.com/news/ualink-consortium-releases-200g-10-specification-for-ai-accelerator-interconnects/)).
- **High-layer-count PCBs.** The boards and the low-loss copper-clad laminate under them are concentrated in Taiwan and Japan; see Substrates and PCBs.

Optical module assembly is a fourth case of a different kind. It is concentrated but not technically hard: InnoLight moved assembly to Thailand in 2019 and Eoptolink in 2020, soon after the tariffs began ([source](https://www.caixinglobal.com/2026-08-05/us-drafts-ban-on-chinese-optical-modules-exposing-mutual-supply-chain-risks-102471268.html)). Geography here is a policy artefact, not a physical one.

## Key evaluation criteria

- **Scale-up domain size** — how many accelerators share one coherent fabric. Up to 1,024 in the UALink spec ([source](https://www.sdxcentral.com/news/ualink-consortium-releases-200g-10-specification-for-ai-accelerator-interconnects/)) and 9,216 for an Ironwood superpod ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).
- **Bandwidth per accelerator** — the number that limits tensor parallelism. NVLink 6 is 3,600 GB/s ([source](https://www.nvidia.com/en-us/data-center/nvlink/)).
- **Picojoules per bit** — optics dominate network power at 800G and above; co-packaging is worth roughly 3.5x ([source](https://www.globenewswire.com/news-release/2025/10/08/3163429/19933/en/Broadcom-Announces-Tomahawk-6-Davisson-the-Industry-s-First-102-4-Tbps-Ethernet-Switch-with-Co-Packaged-Optics.html)).
- **Serviceability** — co-packaged optics trade field-replaceable modules for a switch you must return whole when a channel fails.
- **Supply concentration** — count the suppliers of the laser, not the module.

## Takeaways

The system layer is where AI hardware stops being a chip business and becomes an electrical and optical one. Assembly is competitive and can move countries in a year, so leverage does not live there. It lives in NVLink-class scale-up switching, which one firm still owns, and in indium phosphide lasers, where demand ran at twice supply in early 2026 and no amount of capital shortens an epitaxy ramp below about two years.
