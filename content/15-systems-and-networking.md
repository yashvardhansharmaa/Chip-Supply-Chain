---json
{
  "id": "systems-and-networking",
  "number": 15,
  "title": "Systems and Networking",
  "oneLiner": "A finished package is useless until it is bolted to a baseboard, fed a thousand amps and wired to seventy-one siblings. Many firms can do the bolting; few can make the lasers.",
  "plain": "A cluster runs only as fast as its slowest link, so this stage is built to keep every accelerator in step. It bolts each finished package onto a board, feeds it more than a thousand amps, and wires it to seventy-one neighbours so that a training run sees one machine instead of seventy-two. Copper carries a signal a few metres at most, so the longer links have to become light, and light needs lasers. That is why the tightest supply in this layer is a laser material.",
  "specimen": "gpu-baseboard",
  "specimenCaption": "Right: an eight-GPU baseboard. Four accelerator modules per side, switch chips down the centre, voltage regulator banks along the long edges, and the high-density connectors that carry scale-out traffic off the board.",
  "card": {
    "concentration": "High",
    "chokepointScore": 3,
    "leaders": [
      {"name": "Nvidia", "country": "US", "share": "NVLink and NVSwitch scale-up; InfiniBand and Spectrum-X Ethernet"},
      {"name": "Broadcom", "country": "US", "share": "Merchant switch silicon (Tomahawk, Jericho) and most custom AI accelerators"},
      {"name": "Foxconn", "country": "TW", "share": "Largest AI rack assembler; builds in Taiwan, Mexico, Texas"},
      {"name": "InnoLight", "country": "CN", "share": "High-speed optical modules; plants in Suzhou, Taiwan and Thailand"},
      {"name": "Coherent", "country": "US", "share": "Indium phosphide lasers and datacom transceivers"}
    ],
    "countries": [
      {"code": "US", "note": "Switch and accelerator silicon, InP lasers, system design"},
      {"code": "TW", "note": "ODM design and rack integration; high-layer-count PCBs"},
      {"code": "CN", "note": "Optical module assembly and test; most of the world's indium"},
      {"code": "TH", "note": "Chinese module makers' offshore transceiver plants"},
      {"code": "MX", "note": "Rack integration for the North American market"}
    ],
    "chinaStatus": "Holds the two ends of the optical link that the United States does not. Chinese firms assemble high-speed modules at scale, mostly from Thai and Suzhou plants, and China accounts for about 70% of world indium production, the feedstock for the lasers inside them.",
    "usStatus": "Owns the switch silicon, the scale-up protocols and the laser fabs, but almost none of the rack assembly. Nvidia's partners began US rack production in Houston and Dallas in 2025, and the FCC moved in July 2026 against imported gear carrying Covered List components.",
    "costSignal": "Nvidia put $2B each into Coherent and Lumentum in March 2026 to buy indium phosphide laser capacity",
    "substitution": {"years": "2-3", "why": "Rack assembly and switch boxes have many credible builders, but indium phosphide laser fabs take 18 to 24 months to ramp and there are only a handful of them."}
  },
  "keyFacts": [
    {"fact": "NVLink 6 carries 3,600 GB/s per GPU, double NVLink 5's 1,800 GB/s and four times NVLink 4's 900 GB/s", "source": "https://www.nvidia.com/en-us/data-center/nvlink/"},
    {"fact": "A GB300 NVL72 rack holds 18 compute trays and 9 NVLink switch trays with 18 NVSwitch ASICs, drawing up to 142 kW", "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"},
    {"fact": "UALink 200G 1.0 runs 200 Gb/s per lane, four lanes to a station, and addresses up to 1,024 endpoints in a pod", "source": "https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/"},
    {"fact": "Broadcom's Tomahawk 6 switches 102.4 Tbps on a single chip, double Tomahawk 5's 51.2 Tbps", "source": "https://www.broadcom.com/company/news/product-releases/64031"},
    {"fact": "Tomahawk 6 Davisson cuts optical interconnect power about 70%, more than 3.5x better than pluggable modules", "source": "https://www.broadcom.com/company/news/product-releases/63626"},
    {"fact": "China accounted for about 70% of world indium production, the feedstock for indium phosphide lasers", "source": "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf"},
    {"fact": "Nvidia invested $2 billion each in Coherent and Lumentum in March 2026 for laser research, capacity and future access rights", "source": "https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology"},
    {"fact": "Broadcom's AI semiconductor revenue was $16.7B in Q3 fiscal 2026, up 221% year over year and 54% quarter over quarter", "source": "https://www.sec.gov/Archives/edgar/data/1730168/000173016826000076/avgo-08022026x8kxex99.htm"}
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
      "id": "switch-bandwidth",
      "type": "bars",
      "title": "Broadcom Tomahawk switching capacity on one chip",
      "unit": "Tbps",
      "data": [["Tomahawk 4", 25.6], ["Tomahawk 5", 51.2], ["Tomahawk 6", 102.4]],
      "source": {"label": "Broadcom product releases for Tomahawk 4, 5 and 6", "url": "https://www.broadcom.com/company/news/product-releases/64031"}
    }
  ]
}
---
# Systems and Networking

A package computes nothing until it is wired into a machine. Bolting it down, powering it and linking it to its neighbours is a separate industry, and the scarcest input in that industry is a laser material.

## How it works

A cluster runs only as fast as its slowest link, so this stage is built to keep every accelerator in step. It bolts each finished package onto a board, feeds it more than a thousand amps, and wires it to seventy-one neighbours so that a training run sees one machine instead of seventy-two. Copper carries a signal a few metres at most, so the longer links have to become light, and light needs lasers. That is why the tightest supply in this layer is a laser material.

An accelerator ships as a module, not a bare chip: SXM in Nvidia's world, the OCP Accelerator Module in the open one. Eight bolt onto a baseboard carrying their power and the switch chips that let them reach each other at full speed.

Rack-scale systems dissolve the baseboard. An Nvidia GB300 NVL72 holds 18 compute trays plus nine NVLink switch trays, 72 GPUs in all, and draws up to 142 kW ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)); Rubin keeps that shape ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Every AI cluster runs two networks that are not interchangeable. Scale-up joins a few dozen accelerators into one memory-coherent domain at terabytes per second; scale-out joins thousands of those domains at hundreds of gigabits per second. Model parallelism lives on scale-up, so its bandwidth sets how large a model you can shard.

## Variants and trade-offs

### Scale-up: NVLink, UALink and Google's torus

The architectures differ in how many accelerators share one coherent domain.

- **NVLink and NVSwitch.** Nvidia's per-GPU bandwidth went from 900 GB/s in NVLink 4 to 1,800 in NVLink 5 and 3,600 in NVLink 6; the rack fabric moves 130 TB/s on Blackwell and 260 TB/s on Rubin ([source](https://www.nvidia.com/en-us/data-center/nvlink/)).
- **UALink.** The open answer runs 200 Gb/s per lane, four lanes to a station for 800 Gb/s, and addresses up to 1,024 endpoints in a pod ([source](https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/)).
- **Google's 3D torus.** Ironwood, the seventh-generation TPU, wires 64 chips per rack and uses optical circuit switches to stitch cubes into superpods of 9,216 chips, trading latency for the ability to route around a failed rack in software ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

{{figure:nvlink-bandwidth}}

### Scale-out: InfiniBand versus Ethernet

InfiniBand owned this layer when AI clusters were small and homogeneous. Ethernet took it back on raw capacity first: Broadcom doubled merchant switch bandwidth every generation, from 25.6 Tbps on one chip in Tomahawk 4 ([source](https://www.broadcom.com/company/news/product-releases/52756)) to 51.2 in Tomahawk 5 ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-5-industrys-highest-bandwidth-switch)) and 102.4 in Tomahawk 6 ([source](https://www.broadcom.com/company/news/product-releases/64031)). Then the Ultra Ethernet Consortium published its 1.0 stack in June 2025, standardising the load balancing, congestion control and lossless behaviour InfiniBand had by birth ([source](https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/)).

{{figure:switch-bandwidth}}

Nvidia sells both sides of the argument, telling investors that a $75.2 billion data center quarter came from Blackwell 300 plus demand for "InfiniBand, Spectrum-X Ethernet, and NVLink" ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000052/nvda-20260426.htm)), because large buyers run both fabrics.

### Optics: pluggable, then co-packaged

Every scale-out link longer than a few metres is optical, and a cluster needs several transceivers per accelerator. Their power cost is why both switch vendors are moving the optics onto the switch package: Broadcom's Tomahawk 6 Davisson cuts optical interconnect power by about 70%, more than 3.5 times better than pluggables ([source](https://www.broadcom.com/company/news/product-releases/63626)), and Nvidia's Spectrum-X Photonics reaches 512 ports of 800G during 2026 using four times fewer lasers ([source](https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories)).

## Who makes it

Optical modules are assembled where labour and land are cheap, and the Chinese makers went offshore early. InnoLight has run a Thai plant since 2019 alongside Suzhou and Taiwan ([source](https://www.innolight.com/about)), and Eoptolink assembles in Rayong and Chonburi ([source](https://www.eoptolink.com/about-us/contacts)). The rules now follow the firm rather than the site: the FCC's July 2026 order bars new authorisations for devices containing logic-bearing components from firms on its Covered List, and the record for that rule names optical transceivers as exactly such a component ([source](https://docs.fcc.gov/public/attachments/FCC-26-50A1.pdf)).

The lasers inside those modules come from far fewer hands. Indium phosphide is the only practical material for the high-speed lasers in 800G and 1.6T optics, and its feedstock is concentrated: China accounts for about 70% of world indium production ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)). Nvidia put $2 billion into Lumentum and $2 billion into Coherent in March 2026, buying research, future capacity and access rights rather than parts ([source](https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology)) ([source](https://nvidianews.nvidia.com/news/nvidia-and-coherent-announce-strategic-partnership-to-develop-optics-technology-to-scale-next-generation-data-center-architecture)).

Switch and accelerator silicon is a US duopoly. Broadcom sells merchant Ethernet switching and designs most of the custom accelerators, including Google's TPUs and Meta's MTIA; its AI semiconductor revenue reached $16.7 billion in the third quarter of fiscal 2026, up 221% ([source](https://www.sec.gov/Archives/edgar/data/1730168/000173016826000076/avgo-08022026x8kxex99.htm)). The other custom-silicon designer is Marvell, whose five-year agreement with AWS, announced in December 2024, covers custom AI products alongside optical DSPs, PCIe retimers and Ethernet switching silicon ([source](https://www.sec.gov/Archives/edgar/data/1835632/000183563224000193/final2024_12x02xmarvell-.htm)).

Physical assembly belongs to Taiwan. Foxconn booked NT$8.1 trillion of revenue in 2025, up 18%, with cloud and networking among the drivers ([source](https://www.honhai.com/en-us/press-center/press-releases/latest-news/1978)). Integration is moving toward the customer: Nvidia's partners commissioned more than a million square feet of US manufacturing space in 2025, Foxconn in Houston and Wistron in Dallas ([source](https://blogs.nvidia.com/blog/nvidia-manufacture-american-made-ai-supercomputers-us/)).

## The chokepoint

Most of this layer is not a chokepoint. Several capable ODMs on three continents screw racks together, and power shelves, busbars, cables and connectors have many suppliers. If Foxconn stopped tomorrow, Quanta and Wistron would absorb the volume in a couple of quarters.

What cannot be replaced that fast sits underneath the assembly.

- **Indium phosphide laser capacity.** The shortage is in material and fab space, and Nvidia's answer was to buy into two laser makers rather than place a bigger order ([source](https://nvidianews.nvidia.com/news/nvidia-and-coherent-announce-strategic-partnership-to-develop-optics-technology-to-scale-next-generation-data-center-architecture)), and the indium under it is 70% Chinese ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)).
- **NVSwitch.** No one else sells a merchant scale-up switch with NVLink's bandwidth, which is what UALink exists to change ([source](https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/)).
- **High-layer-count PCBs.** The boards and the low-loss copper-clad laminate under them are concentrated in Taiwan and Japan; see Substrates and PCBs.

Optical module assembly is a fourth case, concentrated but not technically hard. InnoLight moved volume to Thailand in 2019, years before the current rules ([source](https://www.innolight.com/about)). Where these modules get built follows cost and policy, and it can change in a year or two.

## Key evaluation criteria

- **Scale-up domain size** — how many accelerators share one coherent fabric. Up to 1,024 endpoints in the UALink spec ([source](https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/)) and 9,216 for an Ironwood superpod ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).
- **Bandwidth per accelerator** — the number that limits tensor parallelism. NVLink 6 is 3,600 GB/s ([source](https://www.nvidia.com/en-us/data-center/nvlink/)).
- **Picojoules per bit** — optics dominate network power at 800G and above; co-packaging is worth more than 3.5x ([source](https://www.broadcom.com/company/news/product-releases/63626)).
- **Serviceability** — co-packaged optics trade field-replaceable modules for a switch you return whole when a channel fails.
- **Supply concentration** — many firms assemble the modules; far fewer can make the lasers inside them.

## Takeaways

The system layer is where AI hardware stops being a chip business and becomes an electrical and optical one. Assembly is competitive and can move countries in a year. The control point is NVLink-class scale-up switching, which one firm still owns ([source](https://www.nvidia.com/en-us/data-center/nvlink/)), and in indium phosphide lasers, where Nvidia paid $4 billion for capacity it could not order ([source](https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology)) and 70% of the feedstock is Chinese ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)).
