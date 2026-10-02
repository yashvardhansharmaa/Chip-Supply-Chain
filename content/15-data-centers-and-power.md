---json
{
  "id": "data-centers-and-power",
  "number": 15,
  "title": "Data Centers and Power",
  "oneLiner": "In 2024 a large transformer commonly took three years to arrive. In June 2026, big power users, mostly data centers, sought about 474 GW of grid connections in Texas.",
  "plain": "A data center feeds electricity to the machines inside it and carries away the heat they give off. One rack of AI chips, a cabinet taller than a door, draws up to 142 kilowatts ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Every watt of it comes back out as heat, and liquid piped through the rack carries the heat away ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). A large training site already holds more than a hundred thousand chips ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)). The newest sites are planned in gigawatts ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). Getting that much electricity to the site is harder than putting up the building. Transformers and heavy switches connect a site to the grid, and turbines make the power. All of them come from a few suppliers and take years to arrive.",
  "bridge": "Racks like that need a building designed around the power they draw and the heat they give off.",
  "specimen": "rack",
  "specimenCaption": "A liquid-cooled rack of 72 GPUs, Nvidia's GB200 NVL72, drawn to scale. It is 2.24 m tall and 600 mm wide, taller than a door. It weighs about 1.36 metric tons, more than a small car, and draws about 120 kW. The gray steel power shelves and the copper busbar they feed are picked out.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {
        "name": "GE Vernova",
        "country": "US",
        "share": "116 GW of gas equipment backlog and reserved factory slots at mid-2026. Also makes transformers and switchgear, including through Prolec GE"
      },
      {
        "name": "Hitachi Energy",
        "country": "CH",
        "share": "Large power transformers and high-voltage switchgear"
      },
      {
        "name": "Siemens Energy",
        "country": "DE",
        "share": "Grid technologies, transformers, turbines"
      },
      {
        "name": "Mitsubishi Power",
        "country": "JP",
        "share": "Power generation equipment, including gas turbines. GE Vernova names it a key competitor, alongside Siemens Energy"
      },
      {
        "name": "Vertiv",
        "country": "US",
        "share": "Data center power and cooling systems. A partner in Nvidia's gigawatt AI factory designs"
      },
      {
        "name": "Schneider Electric",
        "country": "FR",
        "share": "Electrical distribution and cooling. A partner in Nvidia's 800-volt DC designs"
      }
    ],
    "countries": [
      {
        "code": "US",
        "note": "Most new AI capacity. The ERCOT grid in Texas and the PJM grid in the Mid-Atlantic and Midwest carry the growth in demand"
      },
      {
        "code": "CH",
        "note": "Hitachi Energy and ABB transformer and switchgear engineering"
      },
      {
        "code": "DE",
        "note": "Siemens Energy grid technologies and turbines"
      },
      {
        "code": "TW",
        "note": "Delta Electronics power shelves, busbars and thermal modules"
      },
      {
        "code": "JP",
        "note": "Mitsubishi Heavy Industries power equipment, including gas turbines. Hitachi group transformers"
      }
    ],
    "chinaStatus": "China has spare generating capacity and a large domestic industry that makes transformers and switchgear, and it can connect new sites quickly. The supply of accelerators limits its AI buildout.",
    "usStatus": "The United States has the demand and the money but cannot shorten the wait for equipment. Transformers and turbines both take years to arrive. Measured by capacity, US factories supplied 29.2 percent of the large power transformers bought in the US in 2023, and imports supplied the rest. No restarted nuclear reactor is serving data centers yet.",
    "costSignal": "Large power transformer lead times of 36 months were commonly quoted in 2024, against under a year before the pandemic. GE Vernova's gas equipment backlog and reserved factory slots grew from 100 GW to 116 GW in the second quarter of 2026",
    "substitutability": {
      "band": "Moderate",
      "test": "Nvidia names nine data center power system providers for its gigawatt designs. But a large transformer commonly took three years to arrive in 2024, and GE Vernova's gas equipment backlog and reserved factory slots stood at 116 GW in mid-2026.",
      "why": "Nvidia names nine data center power system providers for its gigawatt designs, so a buyer can choose among suppliers. But money cannot shorten the wait. In 2024, large power transformer lead times of 36 months were commonly quoted, and the longest reached 60 months. Before the pandemic, an order took under a year. An International Energy Agency survey published in 2025 found waits of up to four years worldwide. GE Vernova's gas equipment backlog and reserved factory slots reached 116 GW in mid-2026. It expects its gas turbine output to reach 20 GW a year in the third quarter of 2026."
    }
  },
  "keyFacts": [
    {
      "fact": "A GB300 NVL72 rack draws up to 142 kW, fed by eight 33 kW power shelves",
      "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"
    },
    {
      "fact": "Nvidia's 800-volt DC architecture is designed for racks from 100 kW to over 1 MW, with megawatt racks from 2027. Nvidia is making the change because the 54-volt distribution in existing racks begins to hit physical limits once racks exceed 200 kW",
      "source": "https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/"
    },
    {
      "fact": "Nvidia's Kyber rack will hold 576 Rubin Ultra GPUs by 2027 on an 800-volt DC bus that carries over 150% more power through the same copper",
      "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"
    },
    {
      "fact": "US data centers used 192 TWh in 2024, 4.7% of US electricity. Lawrence Berkeley National Laboratory's reference case projects 649 TWh in 2030, or 11.8%, within a range of 521 to 843 TWh",
      "source": "https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update"
    },
    {
      "fact": "Capital spending by Alphabet, Amazon, Meta, Microsoft and Oracle came to $448.2B in 2025. If the trend continues, it will reach $770B in 2026",
      "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
    },
    {
      "fact": "ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads seeking a grid connection in June 2026, about 90% of it data centers. In a preliminary review in July 2026, ERCOT found about 205 GW eligible for Batch Zero, its first study of connection requests as a group",
      "source": "https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf"
    },
    {
      "fact": "On August 3, 2026, Texas Governor Greg Abbott ordered the Public Utility Commission and ERCOT to audit all data centers in ERCOT's interconnection process before any data center project moves forward",
      "source": "https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit"
    },
    {
      "fact": "ERCOT's large load status update of March 13, 2026, counted 9,042 MW approved to energize. Judging by peak monthly use, ERCOT believed 3,883 MW of it was operating",
      "source": "https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf"
    },
    {
      "fact": "In 2024, large power transformer lead times of 36 months were commonly quoted, and the longest reached 60 months. Before the pandemic an order took under a year, and 82% of the units put into US service in 2019 were imported",
      "source": "https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf"
    },
    {
      "fact": "Measured by capacity, US producers supplied 29.2% of the large power transformers of 60 MVA and above bought in the US in 2023, down from 32.5% in 2021. Their lead times averaged three years in 2023, against one and a half years for importers",
      "source": "https://www.usitc.gov/publications/701_731/pub5531.pdf"
    },
    {
      "fact": "GE Vernova's gas power equipment backlog and reserved factory slots grew from 100 GW to 116 GW in the second quarter of 2026. It expects its annual gas turbine output to reach 20 GW in the third quarter of 2026, 24 GW in 2028 and 30 GW in 2030",
      "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm"
    },
    {
      "fact": "In its September 2026 Short-Term Energy Outlook, the Energy Information Administration expects record US electricity sales of 4,135 TWh in 2026 and 4,211 TWh in 2027, driven by data centers and manufacturing. It lowered its 2027 electricity sales forecast for the region that includes Texas by 4.7% from August",
      "source": "https://www.eia.gov/outlooks/steo/archives/sep26.pdf"
    }
  ],
  "figures": [
    {"id": "power-in-heat-out", "type": "animation", "src": "power", "title": "Power in, heat out", "note": "Simplified diagram, with illustrative sizes. An Nvidia GB300 NVL72 rack draws at most 142 kW. Nvidia gives 45 °C as the supply-water temperature for its Vera Rubin racks. The megawatt racks from 2027 are Nvidia's plan."},
    {
      "id": "hyperscaler-capex",
      "type": "bars",
      "title": "Capital spending by five large US data center operators, 2025",
      "unit": "$B",
      "data": [
        [
          "Amazon",
          134.7
        ],
        [
          "Microsoft",
          108.3
        ],
        [
          "Alphabet",
          93.1
        ],
        [
          "Meta",
          72.5
        ],
        [
          "Oracle",
          39.6
        ]
      ],
      "source": {
        "label": "Epoch AI, hyperscaler capex trend, February 2026, from company filings",
        "url": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
      }
    },
    {
      "id": "turbine-output",
      "type": "bars",
      "title": "GE Vernova's planned annual gas turbine output",
      "unit": "GW/yr",
      "data": [
        [
          "Q3 2026",
          20
        ],
        [
          "2028",
          24
        ],
        [
          "2030",
          30
        ]
      ],
      "source": {
        "label": "GE Vernova second-quarter 2026 results, July 2026",
        "url": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm"
      }
    },
    {
      "id": "us-dc-electricity",
      "type": "bars",
      "title": "US data center electricity use, 2024 and 2030 projection range",
      "unit": "TWh",
      "data": [
        [
          "2024",
          192
        ],
        [
          "2030 low case",
          521
        ],
        [
          "2030 reference case",
          649
        ],
        [
          "2030 high case",
          843
        ]
      ],
      "source": {
        "label": "Lawrence Berkeley National Laboratory, June 2026",
        "url": "https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update"
      }
    }
  ]
}
---
# Data Centers and Power

A wafer passes through a leading-edge fab in months, but in 2024 a large power transformer commonly took three years to arrive ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)). Before the pandemic, the same order took under a year ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)).

## How it works

A data center feeds electricity to the machines inside it and carries away the heat they give off. One rack of AI chips, a cabinet taller than a door, draws up to 142 kilowatts ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Every watt of it comes back out as heat, and liquid piped through the rack carries the heat away ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). A large training site already holds more than a hundred thousand chips ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)). The newest sites are planned in gigawatts ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). Getting that much electricity to the site is harder than putting up the building. Transformers and heavy switches connect a site to the grid, and turbines make the power. All of them come from a few suppliers and take years to arrive.

{{figure:power-in-heat-out}}

The rack is the basic unit of AI compute. Nvidia's GB300 NVL72 rack draws up to 142 kW through eight 33 kW power shelves, the rack's own power supplies ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Colossus 1, an AI data center in Memphis, Tennessee, held an estimated 230,000 Nvidia GPUs by July 2025 ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)).

Between the grid and the rack, a substation steps the high voltage down with transformers. Switchgear, the building's heavy circuit breakers, can cut any part of the site off in a fault. Battery-backed supplies keep the racks running for the seconds it takes backup generators to start. Distribution boards split the feed among the rows of racks.

At the back of each rack, a busbar carries the current down to the server trays. It is a solid copper bar, because a cable would melt at that current. Every piece of equipment from the substation to the busbar is heavy and has its own lead time, the wait between order and delivery.

Heat leaves in water. Cold plates, metal blocks with coolant running through them, sit on the GPU packages and pass the heat to the building's water loop, which releases it outdoors ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)). Nvidia's Rubin racks run coolant at up to 45 °C, warm enough that in many climates the loop can release its heat without turning on chillers ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

Nvidia is also moving the power that feeds its racks to 800 volts of direct current. Raising the voltage cuts the current needed for the same power, and the heat in copper comes from current. So the same conductor carries over 150 percent more power, and the 200 kg busbars that feed a single rack are no longer needed ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

## Variants and trade-offs

### Cooling

- **Air.** Heat exchangers in the rack door work when density, the power each rack draws, is moderate, but Nvidia's GB300 NVL72 rack is liquid cooled ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Direct-to-chip liquid.** Nvidia's Rubin platform is 100 percent liquid cooled, and every cloud provider and data center operator building for it is moving to liquid ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).
- **Immersion.** The servers sit in a bath of fluid. It allows higher density still, but the hardware is hard to service.

Nvidia says the cooling supply chain is keeping pace with the move to liquid ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)). Motivair, Schneider Electric's cooling division, has worked alongside Nvidia's product roadmap for nearly a decade ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

### Rack power

Nvidia's 800-volt DC architecture is designed for racks from 100 kW to more than a megawatt, with megawatt racks from 2027 ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)). Nvidia is making the change because the 54-volt distribution in existing racks begins to hit physical limits once racks exceed 200 kW ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

Nvidia names nine data center power system providers for its 800-volt gigawatt designs, among them ABB, Eaton, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

A megawatt rack changes the busbar, the floor loading, the coolant flow, the leak detection and the stored energy that keeps the rack running through a power dip. Nvidia's Vera Rubin NVL72 rack design holds 20 times more energy storage to keep power steady ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

- **Grid interconnection.** The slow path, with long queues to connect ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Behind-the-meter gas**, generation on the site itself. The fast path, which at least three of OpenAI's seven Stargate sites will use to avoid grid queues ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Nuclear.** Existing plants already sell power to data centers ([source](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611pressreleasebusin.htm)). Talen Energy supplies Amazon's data center campus next to the Susquehanna nuclear plant in Pennsylvania under a June 2025 contract expected to reach 1,920 MW no later than 2032 ([source](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611pressreleasebusin.htm)). Restarts and new reactors are still to come. Constellation signed a power purchase agreement with Microsoft to restart Three Mile Island Unit 1 as the 835 MW Crane Clean Energy Center ([source](https://www.constellationenergy.com/news/2025/constellation-ahead-of-schedule-for-launch-of-crane-clean-energy-center.html)). The plant shut in 2019 ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). A $1 billion federal loan that closed in November 2025 partly finances its restart, which is subject to Nuclear Regulatory Commission licensing approvals ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). No restarted reactor is serving data centers yet.

## Who makes it

The largest data center operators pay for the buildout. Capital spending by Alphabet, Amazon, Meta, Microsoft and Oracle came to $448.2 billion in 2025 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). If the trend continues, it will reach $770 billion in 2026 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)).

{{figure:hyperscaler-capex}}

Epoch AI, a research group, projects that OpenAI's seven US Stargate sites will exceed 9 GW by 2029 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). It expects the site in Abilene, Texas, to grow from an estimated 0.3 GW in April to 1.2 GW in the fourth quarter of 2026 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).

Equipment makers limit how fast the buildout can go. GE Vernova builds large gas turbines, and its 2025 annual report names Siemens Energy and Mitsubishi Power among the key competitors of its power generation business ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm)). Hitachi Energy, Siemens Energy, GE Vernova, ABB, Eaton and Schneider Electric supply transformers and switchgear.

GE Vernova bought the remaining half of Prolec GE, a transformer maker, in the first half of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). GE Vernova's gas equipment backlog and reserved factory slots grew from 100 GW to 116 GW in the second quarter of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). In the first half of the year, data center orders for its electrification business, which makes grid equipment, passed $5 billion, more than double its total for 2025 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).

{{figure:turbine-output}}

## Capacity and demand

US data centers used 192 TWh in 2024, 4.7 percent of national electricity, according to a June 2026 estimate by Lawrence Berkeley National Laboratory that leaves out cryptocurrency mining ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update)). The lab's reference case, its main scenario, projects 464 TWh in 2028 and 649 TWh in 2030, which would be 11.8 percent of forecast US electricity use ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update)). Its scenarios for 2030 range from 521 to 843 TWh, or 9.5 percent to 15.3 percent ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update)).

In its September 2026 Short-Term Energy Outlook, the Energy Information Administration expects record US electricity sales of 4,135 TWh in 2026 and 4,211 TWh in 2027 ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf)). Sales would grow by almost 2 percent in each year, driven by data centers and manufacturing ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf)). The same outlook lowers its 2027 electricity sales forecast for the region that includes Texas by 4.7 percent from its August forecast ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf)). It notes that Texas has paused connecting new data centers to the grid while it audits proposed projects ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf)).

{{figure:us-dc-electricity}}

Chip efficiency is still improving. Google's Ironwood TPU, an AI chip, delivers twice the performance per watt of Trillium, the TPU before it ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). A token is the chunk of text a model reads or writes. Energy per token can fall while total energy use still rises, if the number of tokens rises faster.

## The chokepoint

Far more capacity has been announced than is connected and running. ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads (big power users) seeking a connection in June 2026, roughly 90 percent of it data centers ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). ERCOT's large load update of March 13, 2026, counted 9,042 MW approved to energize, but judging by peak monthly use, ERCOT believed only 3,883 MW of it was operating ([source](https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf)). In a preliminary review in July 2026, ERCOT found about 205 GW of the queue eligible for Batch Zero, its first study of connection requests as a group ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). On August 3, 2026, Texas Governor Greg Abbott ordered the state's Public Utility Commission and ERCOT to audit every data center in the interconnection process before any data center project moves forward ([source](https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit)).

Projects in that queue also wait on equipment.

- **Large power transformers.** In 2024, lead times of 36 months were commonly quoted and the longest reached 60 months, against under a year before the pandemic ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)). By a Commerce Department estimate, 82 percent of the units put into US service in 2019 were imported ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)). In an industry survey published in 2025, the International Energy Agency found that large power transformers took up to four years to secure worldwide ([source](https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary)). It also found that their average lead times had almost doubled since 2021 ([source](https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary)). Measured by capacity, US factories supplied 29.2 percent of the transformers of 60 MVA and above bought in the US in 2023, and imports supplied the rest ([source](https://www.usitc.gov/publications/701_731/pub5531.pdf)).
- **Gas turbines.** GE Vernova's gas equipment backlog and reserved factory slots stood at 116 GW in mid-2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). It expects its annual gas turbine output to reach 20 GW in the third quarter of 2026, 24 GW in 2028 and 30 GW in 2030 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Firm new generation**, the kind that runs whatever the weather. The 835 MW Crane plant shut in 2019, and its restart depends on Nuclear Regulatory Commission licensing approvals ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). The NRC has approved a fuel license amendment for the plant, and Constellation expects to restart it in 2027 ([source](https://www.constellationenergy.com/news/2026/08/constellation-reports-second-quarter-2026-results.html)).

Memory chips are also in short supply. Micron's quarterly report for the period ended May 28, 2026, says AI-driven growth in demand for memory and storage is outpacing industry supply ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000015/mu-20260528.htm)). The memory shortage and the wait for power equipment both limit how much of the 2026 capital spending turns into working compute.

## Key evaluation criteria

- **Time to power** counts the months from a signed lease until the power is switched on. Developers compete on this number.
- **Transformer and turbine lead time** covers the two queues that set the schedule. Large power transformer lead times of 36 months were commonly quoted in 2024 ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)). GE Vernova's gas equipment backlog and reserved factory slots stood at 116 GW in mid-2026, against planned output of 20 GW a year from the third quarter ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Rack density supported** sets which racks an existing hall can take. A GB300 NVL72 rack draws up to 142 kW and is liquid cooled ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Firmness of supply** tells whether a site's power is backed by delivered equipment, such as a transformer, or exists only on paper, as a signed interconnection agreement.
- **Energy per token** is the electricity a model uses for each token it reads or writes. Chips with higher performance per watt, such as Google's Ironwood TPU, lower it ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

## Takeaways

Measured by capacity, US factories supplied 29.2 percent of the large power transformers bought in the US in 2023, and imports the rest ([source](https://www.usitc.gov/publications/701_731/pub5531.pdf)). GE Vernova's gas equipment backlog and reserved factory slots stood at 116 GW in mid-2026, against planned output of 20 GW a year from the third quarter ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).

ERCOT, the grid operator for most of Texas, counted 9,042 MW of big power users approved to energize by March 13, 2026 ([source](https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf)). Judging by peak monthly use, it believed 3,883 MW of that was operating ([source](https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf)). On August 3, 2026, Governor Greg Abbott ordered an audit of every data center seeking a connection before any data center project moves forward ([source](https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit)).
