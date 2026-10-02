---json
{
  "id": "systems-and-networking",
  "number": 14,
  "title": "Systems and Networking",
  "oneLiner": "AI chips are wired together 72 to a rack and run as one computer. Many firms can assemble the racks, but few can make the lasers for the optical links between them.",
  "plain": "One AI chip is not enough to train a model. So seventy-two of them are wired together in a rack, a cabinet the size of a wardrobe, and run as one computer. Each chip sits on its own board and draws more than a thousand amps, several times the current a whole house is wired to carry. The chips have to swap results with each other all the time. A copper wire can carry those signals only a few meters before they fade, so the longer links send them as light down glass fiber. Many companies can build the rack, but only a few can make the lasers that send the light.",
  "bridge": "A tested package is still a single chip. Training a model takes a room full of them working as one machine.",
  "specimen": "gpu-baseboard",
  "specimenCaption": "An eight-GPU baseboard, the board that carries eight accelerator modules and the switch chips joining them. It is about 510 by 400 mm and drawn to scale, with the module frames standing about 30 mm above the board. The two nickel-gray squares in the middle are the NVLink switch chips.",
  "card": {
    "concentration": "High",
    "chokepointScore": 3,
    "leaders": [
      {"name": "Nvidia", "country": "US", "share": "NVLink and NVSwitch for links inside a rack; InfiniBand and Spectrum-X Ethernet between racks"},
      {"name": "Broadcom", "country": "US", "share": "Switch chips sold to any buyer (Tomahawk, Jericho) and custom AI accelerators"},
      {"name": "Foxconn", "country": "TW", "share": "World's largest AI server provider, by its own account; builds in Taiwan, Mexico, Texas"},
      {"name": "InnoLight", "country": "CN", "share": "High-speed optical modules; sites in Suzhou, Taiwan and Thailand"},
      {"name": "Coherent", "country": "US", "share": "Indium phosphide lasers and data center transceivers"}
    ],
    "countries": [
      {"code": "US", "note": "Switch and accelerator silicon, system design, indium phosphide lasers (Coherent's Sherman, Texas fab)"},
      {"code": "TW", "note": "Contract design and rack assembly; high-layer-count circuit boards"},
      {"code": "JP", "note": "Laser maker Lumentum's wafer fab in Sagamihara; low-loss board laminate"},
      {"code": "CN", "note": "Optical module assembly and test; most of the world's indium; export permits on indium phosphide substrates"},
      {"code": "TH", "note": "Chinese module makers' offshore transceiver plants"},
      {"code": "MX", "note": "Rack integration for the North American market"}
    ],
    "chinaStatus": "China is strong in two parts of the optical link, the modules and the indium their lasers need. Chinese firms such as InnoLight assemble high-speed optical modules in volume, at sites including Suzhou and Thailand. In 2025 China produced about 70 percent of the world's indium, the raw material for the lasers inside those modules. In February 2025 it put indium under new export restrictions and began requiring export permits for indium phosphide substrates, the wafers the lasers are grown on.",
    "usStatus": "American firms make the switch chips, the links that join accelerators inside a rack, and the lasers. Some of their wafer fabs are abroad, including Lumentum's in Japan. Nvidia said in August 2026 that Wistron's new plant in Fort Worth, Texas, was producing its GB300 superchips and that Foxconn was building a factory in Houston for its AI systems. In July 2026 the Federal Communications Commission barred new authorizations for devices containing logic-bearing components made by firms on its Covered List.",
    "costSignal": "Nvidia agreed in March 2026 to invest $2B each in Coherent and Lumentum, alongside multibillion-dollar purchase commitments for their laser products",
    "substitutability": {"band": "Moderate", "test": "Rated on the two most concentrated parts: Nvidia controls NVLink and its NVSwitch chips, which join the accelerators in a rack, and few firms make the lasers for the optical links.", "why": "Rack assembly can be moved, though the move would likely take several quarters, an unsourced estimate. The two concentrated parts are inside the rack, and each has an open alternative or new investment. UALink is a published open specification for the same job as NVLink. It runs 200 Gb/s per lane and addresses up to 1,024 endpoints. AMD's Helios rack, launched in July 2026, runs it over Ethernet. Since May 2025 Nvidia's NVLink Fusion program has let other firms' custom chips use NVLink, including CPUs from Fujitsu and Qualcomm that connect to Nvidia GPUs. That brings more chips onto Nvidia's link, so the dependence on Nvidia stays. For the lasers, Nvidia agreed in March 2026 to invest $2 billion each in Coherent and Lumentum, alongside multibillion-dollar purchase commitments and rights to future capacity."}
  },
  "keyFacts": [
    {"fact": "NVLink 6 carries 3,600 GB/s per GPU and a Vera Rubin NVL72 rack moves 260 TB/s, by Nvidia's Rubin launch release of January 2026", "source": "https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer"},
    {"fact": "A GB300 NVL72 rack holds 18 compute trays and 9 NVLink switch trays with 18 NVSwitch chips, and draws up to 142 kW", "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"},
    {"fact": "UALink 200G 1.0 runs 200 Gb/s per lane, four lanes to a station, and addresses up to 1,024 endpoints in a pod", "source": "https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/"},
    {"fact": "Broadcom's Tomahawk 6 switches 102.4 Tbps on a single chip, double the bandwidth of any Ethernet switch on the market when it shipped in June 2025", "source": "https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-6-worlds-first-1024-tbps-switch"},
    {"fact": "Tomahawk 6 Davisson cuts optical interconnect power by 70%, more than 3.5x lower than traditional pluggable optics", "source": "https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-tomahawkr-6-davisson-industrys-first-1024"},
    {"fact": "In 2025 China produced about 70% of the world's indium, the raw material for indium phosphide lasers, and it put indium under new export restrictions in February 2025", "source": "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf"},
    {"fact": "In March 2026 Nvidia agreed to invest $2 billion in Lumentum, alongside a multibillion purchase commitment and future capacity access rights for advanced laser components", "source": "https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology"},
    {"fact": "Broadcom's AI semiconductor revenue was $16.7B in Q3 fiscal 2026, up 221% year over year and 54% quarter over quarter", "source": "https://www.sec.gov/Archives/edgar/data/1730168/000173016826000076/avgo-08022026x8kxex99.htm"}
  ],
  "figures": [
    {"id": "racks-wired", "type": "animation", "src": "racks", "title": "How AI chips are wired together", "note": "Simplified. The trays follow the layout of an Nvidia NVL72 rack. Racks and fibers are not drawn to scale."},
    {
      "id": "nvlink-bandwidth",
      "type": "bars",
      "title": "NVLink bandwidth per GPU by generation",
      "unit": "GB/s",
      "data": [["NVLink 4 (Hopper)", 900], ["NVLink 5 (Blackwell)", 1800], ["NVLink 6 (Rubin)", 3600]],
      "source": {"label": "NVIDIA NVLink product page (NVLink 4 and 5); NVIDIA Rubin launch release, January 2026 (NVLink 6)", "url": "https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer"}
    },
    {
      "id": "switch-bandwidth",
      "type": "bars",
      "title": "Broadcom Tomahawk switching capacity on one chip",
      "unit": "Tbps",
      "data": [["Tomahawk 4", 25.6], ["Tomahawk 5", 51.2], ["Tomahawk 6", 102.4]],
      "source": {"label": "Broadcom product releases for Tomahawk 4, 5 and 6", "url": "https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-6-worlds-first-1024-tbps-switch"}
    }
  ]
}
---
# Systems and Networking

Before a chip package can compute, it has to be built into a machine. Building that machine is a separate industry from making the package.

## How it works

One AI chip is not enough to train a model. So seventy-two of them are wired together in a rack, a cabinet the size of a wardrobe, and run as one computer. Each chip sits on its own board and draws more than a thousand amps, several times the current a whole house is wired to carry. The chips have to swap results with each other all the time. A copper wire can carry those signals only a few meters before they fade, so the longer links send them as light down glass fiber. Many companies can build the rack, but only a few can make the lasers that send the light.

{{figure:racks-wired}}

An accelerator (the AI chip) ships as a module, the chip on a small board with its power supply and memory stacks. Nvidia calls its version SXM, and the open-standards equivalent is the Open Compute Project's accelerator module. Eight modules bolt onto a baseboard that carries their power and the switch chips, which pass data between any two modules at full speed.

Rack-scale systems drop the baseboard and put the chips on trays stacked in the rack. An Nvidia GB300 NVL72 holds 18 compute trays plus nine switch trays, 72 GPUs in all, and draws up to 142 kW ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). The newer Vera Rubin NVL72 uses the same rack footprint ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Inside the rack the trays reach each other over copper. Between neighboring racks, the signal can travel up to 7 meters over active electrical cables, a type of copper cable sold by firms such as Credo ([source](https://www.sec.gov/Archives/edgar/data/1807794/000162828026043303/crdo-20260502.htm)). Longer links run on glass fiber, with an optical transceiver at each end. A laser in the sending transceiver turns the electrical signal into pulses of light, and a detector in the receiving one turns the pulses back into current.

Every AI cluster runs two networks that are not interchangeable. Scale-up connects anywhere from a few dozen accelerators (72 in an Nvidia NVL72 rack) to thousands (9,216 in a Google Ironwood superpod) closely enough that they can read each other's memory. It runs at terabytes per second. Scale-out joins those groups to one another at hundreds of gigabits per second. A byte is eight bits, so scale-up is tens of times faster than scale-out.

A model too big for one accelerator is split across many. The parts that exchange data constantly stay inside the scale-up group, while whole blocks of layers can sit on different groups across the slower scale-out network ([source](https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/features/parallelisms.html)). So scale-up bandwidth sets how efficiently a large model trains.

## Variants and trade-offs

### Scale-up: NVLink, UALink and Google's torus

The designs differ in how many accelerators can share one pool of memory.

- **NVLink and NVSwitch.** Nvidia's per-GPU bandwidth went from 900 GB/s in NVLink 4 to 1,800 in NVLink 5, and the rack's own network moves 130 TB/s on Blackwell ([source](https://www.nvidia.com/en-us/data-center/nvlink/)). Nvidia's Rubin launch release of January 2026 gives NVLink 6 as 3,600 GB/s per GPU and 260 TB/s for a Vera Rubin NVL72 rack ([source](https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer)). As of October 2026, Nvidia's NVLink product page still lists preliminary figures of 3,000 GB/s and 216 TB/s ([source](https://www.nvidia.com/en-us/data-center/nvlink/)).
- **UALink.** The open specification runs 200 Gb/s per lane, four lanes to a station for 800 Gb/s, and can address up to 1,024 endpoints in one group ([source](https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/)). AMD's Helios rack, launched in July 2026, joins 72 GPUs and runs UALink over Ethernet for its scale-up network ([source](https://newsroom.amd.com/news/aai-2026-helios-update/)).
- **Google's 3D torus.** Google wires 64 of its Ironwood TPU accelerators into each rack, called a cube ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). Inside the cube each chip links directly to six others, in a three-dimensional grid that Google calls a 3D torus ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). Optical circuit switches join cubes into superpods of 9,216 chips that can bypass a failed cube or link ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

{{figure:nvlink-bandwidth}}

### Scale-out: InfiniBand versus Ethernet

InfiniBand, the specialized network built for supercomputers, was the main scale-out network when AI clusters were small and uniform. Ethernet switch capacity grew quickly. Broadcom, which sells its switch chips to any buyer, doubled their bandwidth in each generation, from 25.6 Tbps on one chip in Tomahawk 4 ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-4-industrys-highest-bandwidth-ethernet)) to 51.2 in Tomahawk 5 ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-5-industrys-highest-bandwidth-switch)) and 102.4 in Tomahawk 6 ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-6-worlds-first-1024-tbps-switch)). In June 2025 the Ultra Ethernet Consortium published its 1.0 specification, a set of Ethernet-based communication protocols for AI and supercomputing that covers transport, congestion control and direct memory access ([source](https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/)).

{{figure:switch-bandwidth}}

Nvidia sells both networks. Its data center revenue reached $89.0 billion in the quarter to July 2026, up 117 percent from a year earlier ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)). In the quarter before, it credited its data center growth to Blackwell 300 products and to demand for its "InfiniBand, Spectrum-X Ethernet, and NVLink" solutions ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000052/nvda-20260426.htm)).

### Optics: pluggable, then co-packaged

Almost every link longer than 7 meters is optical. A cluster needs several transceivers, the modules that turn electricity into light and back, for each accelerator. Their power cost is one reason Broadcom and Nvidia are moving the optics out of pluggable modules and into the switch chip's own package, a design called co-packaged optics. Broadcom's Tomahawk 6 Davisson cuts optical interconnect power by 70 percent, more than 3.5 times lower than traditional pluggable modules ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-tomahawkr-6-davisson-industrys-first-1024)). Nvidia's Spectrum-X Photonics switches, due in 2026, reach 512 ports of 800 gigabits and use four times fewer lasers than traditional designs ([source](https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories)).

## Who makes it

Optical modules are assembled where labor and land are cheap, and the Chinese makers went offshore early. InnoLight has run a plant in Thailand since 2019, alongside its sites in Suzhou and Taiwan ([source](https://www.innolight.com/about)). The Thai subsidiary of Eoptolink, another Chinese module maker, lists sites in Chonburi and Rayong ([source](https://www.eoptolink.com/about-us/contacts)).

The Federal Communications Commission publishes a Covered List of equipment and services judged to pose an unacceptable risk to US national security or to the security and safety of US persons ([source](https://docs.fcc.gov/public/attachments/FCC-26-50A1.pdf)). Its July 2026 order bars new authorizations for devices that contain logic-bearing hardware components produced by firms on that list ([source](https://docs.fcc.gov/public/attachments/FCC-26-50A1.pdf)). Commenters in the record named optical transceivers as one such component ([source](https://docs.fcc.gov/public/attachments/FCC-26-50A1.pdf)). The same order notes that the key players in the optical transceiver market, Coherent and InnoLight among them, do not appear on the Covered List ([source](https://docs.fcc.gov/public/attachments/FCC-26-50A1.pdf)).

The lasers inside those modules come from far fewer firms. In March 2026 Nvidia agreed to invest $2 billion in one of them, Lumentum, alongside a multibillion-dollar purchase commitment and future capacity access rights for advanced laser components ([source](https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology)). It made the same $2 billion investment in Coherent, another laser maker, with a multibillion-dollar purchase commitment for advanced laser and optical networking products ([source](https://nvidianews.nvidia.com/news/nvidia-and-coherent-announce-strategic-partnership-to-develop-optics-technology-to-scale-next-generation-data-center-architecture)).

Indium phosphide is used in the high-speed laser diodes and photodetectors for optical communications ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)). China accounted for 70 percent of world indium production in 2025 ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)). In February 2025 China's Ministry of Commerce placed indium under new export restrictions ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)).

Two US firms, Broadcom and Marvell, design both custom accelerators and switch chips. Broadcom sells the Ethernet switch chips that other firms build their switches around, along with custom AI accelerators. Its AI semiconductor revenue reached $16.7 billion in the third quarter of fiscal 2026, up 221 percent from a year earlier ([source](https://www.sec.gov/Archives/edgar/data/1730168/000173016826000076/avgo-08022026x8kxex99.htm)). Marvell's five-year agreement with Amazon Web Services, announced in December 2024, covers custom AI chips alongside the optical and networking parts that go with them ([source](https://www.sec.gov/Archives/edgar/data/1835632/000183563224000193/final2024_12x02xmarvell-.htm)).

Taiwanese firms do much of the physical assembly. Foxconn booked NT$8.1 trillion of revenue in 2025, up 18 percent, with cloud and networking among the drivers ([source](https://www.honhai.com/en-us/press-center/press-releases/latest-news/1978)).

Some assembly is moving to the United States. In April 2025 Nvidia said it was building supercomputer manufacturing plants in Texas, with Foxconn in Houston and Wistron in Dallas ([source](https://blogs.nvidia.com/blog/nvidia-manufacture-american-made-ai-supercomputers-us/)). It expected mass production to ramp up in the following 12 to 15 months ([source](https://blogs.nvidia.com/blog/nvidia-manufacture-american-made-ai-supercomputers-us/)). In August 2026 Nvidia said Wistron's new plant in Fort Worth, Texas, near Dallas, was producing its GB300 superchips and Foxconn was building its factory in Houston ([source](https://blogs.nvidia.com/blog/nvidia-and-partners-build-in-america-for-america/)).

## The chokepoint

Several contract manufacturers on three continents assemble racks. The power shelves, copper busbars, cables and connectors have many suppliers. In its filing for the quarter to April 2026, Nvidia said the complexity of rack-scale systems had caused production delays ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000052/nvda-20260426.htm)). Moving Foxconn's share of rack assembly to other assemblers such as Quanta and Wistron would likely take several quarters, though no source puts a figure on it.

Four components that go into the rack take longer to replace.

- **Indium phosphide laser capacity.** In March 2026 Nvidia agreed to invest $2 billion in Coherent, alongside a multibillion-dollar purchase commitment and future access and capacity rights for Coherent's advanced laser and optical networking products ([source](https://nvidianews.nvidia.com/news/nvidia-and-coherent-announce-strategic-partnership-to-develop-optics-technology-to-scale-next-generation-data-center-architecture)). In 2025 China produced 70 percent of the world's indium, which those lasers need ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)). It put indium under new export restrictions in February 2025 ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)).
- **Indium phosphide substrates.** China added indium phosphide substrates, the wafers the lasers are grown on, to its export control list on 4 February 2025 ([source](https://www.sec.gov/Archives/edgar/data/1051627/000143774926027677/axti20260630_10q.htm)). AXT, a US-listed maker of these wafers, does all its manufacturing in China ([source](https://www.sec.gov/Archives/edgar/data/1051627/000143774926027677/axti20260630_10q.htm)). In its filing for the quarter to June 2026, AXT called the export permits the most significant challenge it faces ([source](https://www.sec.gov/Archives/edgar/data/1051627/000143774926027677/axti20260630_10q.htm)). It said it could not estimate when it would resume shipping the wafers to the United States ([source](https://www.sec.gov/Archives/edgar/data/1051627/000143774926027677/axti20260630_10q.htm)).
- **NVSwitch.** NVLink and its switch chip, NVSwitch, are Nvidia's own designs. UALink is an open standard designed for accelerator communications within one scale-up group ([source](https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/)). Since May 2025 Nvidia's NVLink Fusion program has let other firms' custom chips use NVLink, including CPUs from Fujitsu and Qualcomm that connect to Nvidia GPUs ([source](https://nvidianews.nvidia.com/news/nvidia-nvlink-fusion-semi-custom-ai-infrastructure-partner-ecosystem)).
- **High-layer-count circuit boards.** The boards, and the low-loss laminate they are built from, are concentrated in Taiwan and Japan. See [Substrates and PCBs](#substrates-and-pcbs).

Optical module assembly is concentrated, but firms choose where to do it based on cost and policy. It has moved before, as the Chinese makers' Thai plants show ([source](https://www.innolight.com/about)).

## Key evaluation criteria

- **Scale-up domain size** is how many accelerators share one pool of memory. The UALink spec allows up to 1,024 endpoints ([source](https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/)). An Ironwood superpod has 9,216 chips ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).
- **Bandwidth per accelerator** limits how efficiently one model can be split across chips. NVLink 6 carries 3,600 GB/s per GPU ([source](https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer)).
- **Picojoules per bit** is the energy it takes to move one bit of data. Broadcom says traditional pluggable optics consume more power as AI traffic grows, and its co-packaged switch cuts optical interconnect power by 70 percent ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-tomahawkr-6-davisson-industrys-first-1024)).
- **Serviceability** is how easily a failed part can be swapped. It changes with co-packaged optics, which move the optics off pluggable modules and onto the switch package. Broadcom's Davisson switch keeps its lasers in field-replaceable modules ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-tomahawkr-6-davisson-industrys-first-1024)).
- **Supply concentration** is in the components. Many firms assemble the modules, but far fewer can make the lasers inside them.

## Takeaways

In March 2026 Nvidia agreed to invest $2 billion in the laser maker Lumentum, alongside a multibillion-dollar purchase commitment and rights to future capacity for advanced laser components ([source](https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology)). Indium phosphide is used in high-speed lasers for optical communications, and China produced 70 percent of the world's indium in 2025 ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf)).

On 4 February 2025 China added indium phosphide substrates, the wafers the lasers are grown on, to its export control list ([source](https://www.sec.gov/Archives/edgar/data/1051627/000143774926027677/axti20260630_10q.htm)). AXT, a US-listed maker of those wafers, does all its manufacturing in China ([source](https://www.sec.gov/Archives/edgar/data/1051627/000143774926027677/axti20260630_10q.htm)). In its filing for the quarter to June 2026, AXT said it could not estimate when it would resume shipping the wafers to the United States ([source](https://www.sec.gov/Archives/edgar/data/1051627/000143774926027677/axti20260630_10q.htm)).
