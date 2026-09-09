---json
{
  "id": "systems-and-networking",
  "number": 15,
  "title": "Systems and Networking",
  "oneLiner": "A finished package is useless until it is bolted to a baseboard, fed a thousand amps and wired to seventy-one siblings. Assembly is diversified. The lasers are not.",
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

Everything before this chapter produced a package. A package computes nothing on its own. It has to be bolted to a board, fed more than a thousand amps, cooled, and wired to seventy-one siblings so that a training job sees one machine rather than seventy-two. This is the layer where the chip supply chain meets the electrical and optical one, and where the bottleneck has quietly moved from silicon to lasers.

## How it works

An accelerator ships as a module, not a chip. The package is soldered onto a small carrier board carrying power planes, decoupling capacitors and a dense edge connector. Nvidia's format is SXM. The open equivalent, defined by the Open Compute Project, is the OCP Accelerator Module, or OAM.

Eight modules then bolt onto a baseboard. Nvidia's is the HGX board; the OCP version is the Universal Baseboard, or UBB. The baseboard carries the switch chips that let the eight accelerators reach each other at full speed, the power distribution for all of them, and the links out to the host CPUs and the network cards.

Power delivery drives the mechanical design. A kilowatt-class accelerator runs its logic at well under one volt, so it pulls more than a thousand amps. That current cannot travel far without losses, so voltage regulator modules that step the 48 V board rail down to core voltage sit within centimetres of the package, and the board needs many thick copper layers underneath them.

Rack-scale systems dissolve the baseboard entirely. An Nvidia GB300 NVL72 holds 18 compute trays, each with four Blackwell Ultra GPUs, two Grace CPUs and four ConnectX-8 adapters, plus nine NVLink switch trays with two NVSwitch ASICs apiece ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). The whole rack draws up to 142 kW through eight 33 kW power shelves ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Rubin swaps the Grace CPU for Vera and keeps the same 72-GPU rack shape ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Two networks run through every AI cluster and they are not interchangeable. The scale-up fabric joins a few dozen accelerators into one memory-coherent domain at terabytes per second. The scale-out fabric joins thousands of those domains at hundreds of gigabits per second. Scale-up is where model parallelism lives, so its bandwidth sets how large a model you can shard without choking.

## Variants and trade-offs

### Scale-up: NVLink, UALink, and Google's torus

Nvidia's NVLink is the reference point. Per-GPU bandwidth went from 900 GB/s in NVLink 4 to 1,800 GB/s in NVLink 5 and 3,600 GB/s in NVLink 6 ([source](https://www.nvidia.com/en-us/data-center/nvlink/)). Aggregated across a 72-GPU rack, the NVSwitch fabric moves 130 TB/s on Blackwell and 260 TB/s on Rubin ([source](https://www.nvidia.com/en-us/data-center/nvlink/)).

{{figure:nvlink-bandwidth}}

The open answer is UALink. Version 1.0, ratified in April 2025, runs 200 Gbps per lane and addresses up to 1,024 accelerators in a pod, backed by AMD, Intel, Meta, AWS, Google, Microsoft, Cisco, HPE, Apple and Synopsys ([source](https://www.sdxcentral.com/news/ualink-consortium-releases-200g-10-specification-for-ai-accelerator-interconnects/)).

AMD's Helios rack is the first big deployment of that philosophy. It puts 72 MI450-series GPUs and 31 TB of HBM4 in one rack, with 260 TB/s of aggregate scale-up bandwidth carried as UALink over Ethernet and 43 TB/s of scale-out ([source](https://www.nextplatform.com/2025/10/14/oracle-first-in-line-for-amd-altair-mi450-gpus-helios-racks/)). Oracle committed to 50,000 sockets from the third quarter of 2026, about 200 MW of load ([source](https://www.nextplatform.com/2025/10/14/oracle-first-in-line-for-amd-altair-mi450-gpus-helios-racks/)).

Google took a different road years earlier. Ironwood, its seventh-generation TPU, wires 64 chips per rack in a 3D torus over its own inter-chip interconnect, then uses optical circuit switches to stitch cubes into superpods of 9,216 chips holding 1.77 PB of HBM ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). Optical switching costs latency but lets Google reconfigure topology in software and route around failed racks, which matters when a pod is 42.5 exaflops of FP8 ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

### Scale-out: InfiniBand versus Ethernet

InfiniBand owned this layer when AI clusters were small and homogeneous. It has lost. Ethernet took more than two-thirds of data center switch revenue in AI back-end networks across 2025, with sales more than tripling ([source](https://www.delloro.com/news/ethernet-more-than-doubles-size-of-infiniband-as-the-leading-fabric-for-ai-scale-out-networks-in-2025/)). The pattern held into the first quarter of 2026 even as InfiniBand itself rebounded ([source](https://www.delloro.com/news/ethernet-extends-lead-in-ai-scale-out-networks-despite-strong-infiniband-rebound/)).

{{figure:ai-fabric-share}}

Two things caused the flip. Broadcom's Tomahawk 6 put 102.4 Tbps of switching on one chip, doubling the previous generation ([source](https://www.broadcom.com/company/news/product-releases/64031)). And the Ultra Ethernet Consortium gave the industry a standard way to add the lossless, congestion-aware behaviour that InfiniBand had as a birthright.

The vendor table is unusually flat. In the first quarter of 2026 Celestica led AI back-end Ethernet switching, Nvidia was second, Arista third and Cisco fourth with the largest share gain ([source](https://www.delloro.com/news/ethernet-extends-lead-in-ai-scale-out-networks-despite-strong-infiniband-rebound/)). Whitebox builders on merchant silicon now outsell the traditional networking brands.

### Optics: pluggable, then co-packaged

Every scale-out link longer than a few metres is optical. At 800G a cluster needs several transceivers per accelerator, and at 1.6T the module count does not fall. The power cost is brutal, which is why both switch vendors are moving the optics onto the switch package.

Broadcom's Tomahawk 6 Davisson integrates sixteen 6.4 Tbps optical engines at 200 Gbps per channel and cuts optical interconnect power by about 70%, roughly 3.5 times better than pluggables ([source](https://www.globenewswire.com/news-release/2025/10/08/3163429/19933/en/Broadcom-Announces-Tomahawk-6-Davisson-the-Industry-s-First-102-4-Tbps-Ethernet-Switch-with-Co-Packaged-Optics.html)). Nvidia's Quantum-X Photonics InfiniBand switch offers 144 ports of 800G and shipped from late 2025; Spectrum-X Photonics Ethernet reaches 512 ports of 800G for 400 Tb/s and arrives in 2026 ([source](https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories)). Nvidia claims 3.5 times better power efficiency and, more importantly for supply, four times fewer lasers ([source](https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories)).

## Who makes it

Optical modules are the most concentrated part of this layer, and they are Chinese. Chinese firms hold seven of the top ten supplier slots and supply more than half the world's high-speed optical interconnects, with InnoLight and Eoptolink alone accounting for more than 60% of 800G-and-above modules ([source](https://www.caixinglobal.com/2026-08-05/us-drafts-ban-on-chinese-optical-modules-exposing-mutual-supply-chain-risks-102471268.html)). InnoLight booked RMB 23.86 billion of revenue in 2024 and RMB 14.79 billion in the first half of 2025 alone; Eoptolink grew 283% year over year in that same half ([source](https://photoncap.net/p/chinese-optical-modules-own-7-of)).

{{figure:optics-800g-share}}

Both firms have been moving assembly offshore for years. InnoLight started in Thailand in 2019, Eoptolink in 2020 and Suzhou TFC in 2023, and US officials were drafting import restrictions on Chinese-made optical modules as of August 2026 ([source](https://www.caixinglobal.com/2026-08-05/us-drafts-ban-on-chinese-optical-modules-exposing-mutual-supply-chain-risks-102471268.html)).

The lasers inside those modules are a separate and much narrower business. Indium phosphide is the only practical material for the high-speed lasers in 800G and 1.6T optics, and epitaxy capacity is small. Demand exceeded supply by roughly two to one in early 2026, and Nvidia responded by investing $2 billion each in Coherent and Lumentum in March 2026 alongside multi-year purchase commitments ([source](https://futurumgroup.com/insights/nvidias-4b-optics-bet-signals-photonics-as-ais-next-bottleneck/)). Whether those fabs ramp inside 18 to 24 months determines whether optics keeps pace with Rubin ([source](https://futurumgroup.com/insights/nvidias-4b-optics-bet-signals-photonics-as-ais-next-bottleneck/)).

Switch and accelerator silicon is a US duopoly with a long tail. Broadcom supplies merchant Ethernet switching and designs most of the custom accelerators in the market. Its AI semiconductor revenue hit $16.7 billion in the third quarter of fiscal 2026, up 221% year over year, of which custom XPUs were 73% and AI networking grew more than 2.5 times ([source](https://finance.yahoo.com/technology/ai/articles/broadcom-q3-earnings-call-highlights-230318650.html)). Its named programmes now include Google's TPUs, Anthropic capacity, OpenAI's first in-house part and Meta's MTIA ([source](https://finance.yahoo.com/technology/ai/articles/broadcom-q3-earnings-call-highlights-230318650.html)). Marvell holds the other side of that business with AWS and Microsoft. Astera Labs, Broadcom and Marvell supply the PCIe retimers and fabric switches that keep signals alive across a tray.

Physical assembly belongs to Taiwan. Foxconn, Quanta, Wistron and its Wiwynn subsidiary, and Inventec build most AI racks, with Supermicro, Dell and HPE selling branded systems on top. Foxconn, Wistron and Quanta each cleared NT$1 trillion, about US$32 billion, of revenue in 2025 on AI server demand ([source](https://www.digitimes.com/news/a20260109PD249/revenue-ai-server-foxconn-wistron-quanta.html)). Final integration has been migrating toward the customer: Nvidia and its partners commissioned more than a million square feet of US manufacturing space in 2025, including a Foxconn plant in Houston and a Wistron plant in Dallas, alongside TSMC, Amkor and SPIL in Arizona ([source](https://blogs.nvidia.com/blog/nvidia-manufacture-american-made-ai-supercomputers-us/)).

## The chokepoint

Most of this layer is not a chokepoint. Racks are screwed together by at least five capable ODMs on three continents. Power shelves, busbars, cables and connectors have many suppliers. If Foxconn stopped tomorrow, Quanta and Wiwynn would absorb the volume within a couple of quarters at a worse price.

Three things are genuinely narrow. The first is indium phosphide laser capacity, which is a materials problem, not a design problem, and cannot be fixed by writing a cheque faster than epitaxy tools can be installed ([source](https://futurumgroup.com/insights/nvidias-4b-optics-bet-signals-photonics-as-ais-next-bottleneck/)). The second is NVSwitch: no one else sells a merchant scale-up switch with NVLink's bandwidth, which is precisely what UALink exists to change ([source](https://www.sdxcentral.com/news/ualink-consortium-releases-200g-10-specification-for-ai-accelerator-interconnects/)). The third is high-layer-count PCBs and the low-loss copper-clad laminate underneath them, concentrated in Taiwan and Japan; see Substrates and PCBs.

Optical module assembly is a fourth case, and a different kind. It is concentrated but not technically hard, which is why capacity moved to Thailand within a few years of the tariffs starting ([source](https://www.caixinglobal.com/2026-08-05/us-drafts-ban-on-chinese-optical-modules-exposing-mutual-supply-chain-risks-102471268.html)). Geography here is a policy artefact, not a physical one.

## Key evaluation criteria

- **Scale-up domain size** — how many accelerators share one coherent fabric. Up to 1,024 in the UALink spec ([source](https://www.sdxcentral.com/news/ualink-consortium-releases-200g-10-specification-for-ai-accelerator-interconnects/)) and 9,216 for an Ironwood superpod ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).
- **Bandwidth per accelerator** — the number that limits tensor parallelism. NVLink 6 is 3,600 GB/s ([source](https://www.nvidia.com/en-us/data-center/nvlink/)).
- **Picojoules per bit** — optics dominate network power at 800G and above; co-packaging is worth roughly 3.5x ([source](https://www.globenewswire.com/news-release/2025/10/08/3163429/19933/en/Broadcom-Announces-Tomahawk-6-Davisson-the-Industry-s-First-102-4-Tbps-Ethernet-Switch-with-Co-Packaged-Optics.html)).
- **Serviceability** — co-packaged optics trade field-replaceable modules for a switch you must return whole when a channel fails.
- **Supply concentration** — count the suppliers of the laser, not the module.

## Takeaways

The system layer is where AI hardware stops being a chip business and becomes an electrical and optical one. Assembly is genuinely competitive and can move countries in a year, so it is not where leverage lives. Leverage lives in NVLink-class scale-up switching, which one firm still owns, and in indium phosphide lasers, where demand ran at twice supply in early 2026 and no amount of capital shortens epitaxy ramp times below about two years.
