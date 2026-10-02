---json
{
  "id": "data-centers-and-power",
  "number": 15,
  "title": "Data Centers and Power",
  "oneLiner": "Chips are no longer the only slow part of a data center buildout. A large transformer commonly took three years to arrive in 2024, GE Vernova is working toward 30 GW of gas turbine output a year in 2030, and Texas had about 474 GW of large loads, mostly data centers, seeking a grid connection in June 2026. In August 2026 the governor of Texas ordered every data center in that queue audited before any of them moves forward.",
  "plain": "A data center's job is to feed electricity to the machines inside it and carry away the heat they give off. One rack of AI chips, a cabinet the size of a wardrobe, draws up to 142 kilowatts, and every watt of it comes back out as heat, so the rack is cooled by liquid piped through it. A large training site already holds more than a hundred thousand chips, and the newest sites are planned in gigawatts. One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029. Getting that much electricity to the door is harder than putting up the building, because the transformers and heavy switches that connect a site to the grid, and the turbines that make the power, come from a few suppliers and take years to arrive.",
  "bridge": "Racks like that have to stand somewhere, and the somewhere has to be built around what they consume.",
  "specimen": "rack",
  "specimenCaption": "A liquid-cooled rack of 72 GPUs, Nvidia's GB200 NVL72. It is 2.24 m tall, 600 mm wide and about 1.36 metric tons: taller than a door, heavier than a small car, and drawing about 120 kW. Drawn to scale. The gray steel power shelves and the copper busbar they feed are picked out.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {
        "name": "GE Vernova",
        "country": "US",
        "share": "116 GW of gas equipment backlog and reserved factory slots at mid-2026; also makes transformers and switchgear, including through Prolec GE"
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
        "share": "Power generation equipment, including gas turbines; named by GE Vernova as a key competitor alongside Siemens Energy"
      },
      {
        "name": "Vertiv",
        "country": "US",
        "share": "Data center power and cooling systems; NVIDIA gigawatt AI factory partner"
      },
      {
        "name": "Schneider Electric",
        "country": "FR",
        "share": "Electrical distribution and cooling; partner in NVIDIA's 800-volt DC designs"
      }
    ],
    "countries": [
      {
        "code": "US",
        "note": "Most new AI capacity; ERCOT and PJM carry the load growth"
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
        "note": "Mitsubishi Heavy Industries power equipment, including gas turbines; Hitachi group transformers"
      }
    ],
    "chinaStatus": "China has spare generating capacity, a large domestic industry making transformers and switchgear, and can connect new sites quickly. Its AI buildout is limited by the supply of accelerators, and it has power to spare.",
    "usStatus": "The United States has the demand and the money but cannot shorten the wait for equipment. Transformers and turbines both take years to arrive. Most large power transformers are imported, and US factories supplied 29.2 percent of those bought in the US in 2023, measured by capacity. No restarted nuclear reactor is serving data centers yet.",
    "costSignal": "Large power transformer lead times of 36 months commonly quoted in 2024, against under a year before the pandemic; GE Vernova's gas backlog and reserved slots grew from 100 GW to 116 GW in the second quarter of 2026",
    "substitutability": {
      "band": "Moderate",
      "test": "Nvidia names nine data center power system providers for its gigawatt designs, but a large transformer commonly took three years to arrive in 2024 and GE Vernova's gas backlog and reserved slots stood at 116 GW in mid-2026.",
      "why": "Nvidia names nine data center power system providers for its gigawatt designs, so a buyer can choose among suppliers. Money cannot shorten the wait. In 2024, large power transformer lead times of 36 months were commonly quoted, against under a year before the pandemic, and the longest reached 60 months. An IEA survey published in 2025 found waits of up to four years worldwide. GE Vernova's gas equipment backlog and slot reservations reached 116 GW in mid-2026, and it expects to reach 20 GW of annual gas turbine output in the third quarter of 2026."
    }
  },
  "keyFacts": [
    {
      "fact": "A GB300 NVL72 rack draws up to 142 kW, fed by eight 33 kW power shelves",
      "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"
    },
    {
      "fact": "NVIDIA's 800-volt DC architecture is drawn for racks from 100 kW to over 1 MW, with megawatt racks from 2027, because the 54-volt distribution in today's racks begins to hit physical limits once racks exceed 200 kW",
      "source": "https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/"
    },
    {
      "fact": "Nvidia's Kyber rack will hold 576 Rubin Ultra GPUs by 2027 on an 800-volt DC bus that carries over 150% more power through the same copper",
      "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"
    },
    {
      "fact": "US data centers used 192 TWh in 2024, 4.7% of US electricity, and Lawrence Berkeley National Laboratory's reference case projects 649 TWh in 2030, or 11.8%, within a range of 521 to 843 TWh",
      "source": "https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update"
    },
    {
      "fact": "Alphabet, Amazon, Meta, Microsoft and Oracle spent $448.2B of capital in 2025; if that trend continues they will spend $770B in 2026",
      "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
    },
    {
      "fact": "ERCOT was tracking about 474 GW of large loads seeking interconnection in June 2026, about 90% of it data centers; in a preliminary July 2026 review, about 205 GW was eligible for Batch Zero, its first study of connection requests as a group",
      "source": "https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf"
    },
    {
      "fact": "On August 3, 2026, Texas Governor Greg Abbott ordered the Public Utility Commission and ERCOT to audit all data centers in ERCOT's interconnection process before any data center project moves forward",
      "source": "https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit"
    },
    {
      "fact": "ERCOT's large load status update of March 13, 2026, counted 9,042 MW approved to energize, of which ERCOT believed 3,883 MW was operating, judging by peak monthly use",
      "source": "https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf"
    },
    {
      "fact": "In 2024, large power transformer lead times of 36 months were commonly quoted and reached 60 months; before the pandemic an order took under a year, and 82% of units put into US service in 2019 were imported",
      "source": "https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf"
    },
    {
      "fact": "US producers supplied 29.2% of US consumption of large power transformers of 60 MVA and above in 2023, measured by capacity, down from 32.5% in 2021; their lead times averaged three years in 2023, against one and a half years for importers",
      "source": "https://www.usitc.gov/publications/701_731/pub5531.pdf"
    },
    {
      "fact": "GE Vernova's gas power equipment backlog and slot reservations grew from 100 GW to 116 GW in the second quarter of 2026, and it expects annual gas turbine output of 20 GW in the third quarter of 2026, 24 GW in 2028 and 30 GW in 2030",
      "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm"
    },
    {
      "fact": "In its September 2026 Short-Term Energy Outlook, EIA expects record US electricity sales of 4,135 TWh in 2026 and 4,211 TWh in 2027, driven by data centers and manufacturing, and it lowered its 2027 electricity sales forecast for the region that includes Texas by 4.7% from August",
      "source": "https://www.eia.gov/outlooks/steo/archives/sep26.pdf"
    }
  ],
  "figures": [
    {"id": "power-in-heat-out", "type": "animation", "src": "power", "title": "Power in, heat out", "note": "Simplified diagram; sizes are illustrative. 142 kW is the most an Nvidia GB300 NVL72 rack draws; 45 °C is Nvidia's supply-water figure for its Vera Rubin racks; the megawatt racks from 2027 are Nvidia's plan."},
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
      "title": "GE Vernova annual gas turbine output, planned",
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

For thirty years the semiconductor industry set the pace and everything downstream followed. A wafer clears a leading-edge fab in months; in 2024 a large power transformer commonly took three years, and before the pandemic the same order took under one ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)).

## How it works

A data center's job is to feed electricity to the machines inside it and carry away the heat they give off. One rack of AI chips, a cabinet the size of a wardrobe, draws up to 142 kilowatts, and every watt of it comes back out as heat, so the rack is cooled by liquid piped through it ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). A large training site already holds more than a hundred thousand chips ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)). The newest sites are planned in gigawatts ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029. Getting that much electricity to the door is harder than putting up the building, because the transformers and heavy switches that connect a site to the grid, and the turbines that make the power, come from a few suppliers and take years to arrive.

{{figure:power-in-heat-out}}

A rack is now the unit of AI compute. A GB300 NVL72 draws up to 142 kW through eight 33 kW power shelves, the rack's own power supplies ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Colossus 1, an AI data center in Memphis, Tennessee, held an estimated 230,000 Nvidia GPUs by July 2025 ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)).

Between the grid and the rack, a substation steps the high voltage down with transformers. Switchgear, the building's heavy circuit breakers, can cut any part of the site off in a fault. Battery-backed supplies hold the load for the seconds it takes backup generators to start. Distribution boards split the feed among the rows of racks. At the back of each rack a busbar, a solid copper bar doing a job a cable would melt at, carries the current down to the trays. Every one of those is heavy equipment with its own lead time.

Heat leaves in water. Cold plates on the GPU packages pass it to a building loop that releases it outdoors, and Nvidia's Rubin racks run coolant at up to 45 °C, warm enough that in many climates the loop can reject heat without turning on chillers ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

Nvidia is also moving rack distribution to 800 volts of direct current. Raising the voltage cuts the current for the same power, and heat in copper comes from current, so the same conductor carries over 150 percent more power and the 200 kg busbars feeding a single rack are no longer needed ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

## Variants and trade-offs

### Cooling

- **Air.** Heat exchangers in the rack door work at moderate densities, but Nvidia's GB300 NVL72 rack is liquid cooled ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Direct-to-chip liquid.** Nvidia's Rubin platform is 100 percent liquid cooled, and every cloud provider and data center operator building for it is moving to liquid ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).
- **Immersion.** Higher density still, but hard to service.

Nvidia says the cooling supply chain is keeping pace with the move to liquid, and Schneider Electric's cooling division, Motivair, has worked alongside Nvidia's product roadmap for nearly a decade ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

### Rack power

Nvidia's 800-volt DC architecture is drawn for racks from 100 kW to more than a megawatt, with megawatt racks from 2027, because the 54-volt distribution in today's racks begins to hit physical limits once racks exceed 200 kW ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

Nvidia names nine data center power system providers for its 800-volt gigawatt designs, among them ABB, Eaton, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

A megawatt rack changes the busbar, the floor loading, the coolant flow, the leak detection and the stored energy that carries the rack through a dip. Nvidia's Vera Rubin NVL72 rack design holds 20 times more energy storage to keep power steady ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

- **Grid interconnection.** The slow path, with lengthy queues to connect ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Behind-the-meter gas**, generation on the site itself. The fast path, which at least three of the seven Stargate sites will use to sidestep grid queues ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Nuclear.** Existing plants already sell power to data centers, and Talen supplies Amazon's data center campus next to the Susquehanna nuclear plant in Pennsylvania under a June 2025 contract expected to reach 1,920 MW no later than 2032 ([source](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611pressreleasebusin.htm)). Restarts and new reactors are still prospective. Constellation signed a power purchase agreement with Microsoft to restart Three Mile Island Unit 1 as the 835 MW Crane Clean Energy Center ([source](https://www.constellationenergy.com/news/2025/constellation-ahead-of-schedule-for-launch-of-crane-clean-energy-center.html)). The plant shut in 2019, and a $1 billion federal loan closed in November 2025 partly finances its restart, subject to Nuclear Regulatory Commission licensing approvals ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). No restarted reactor is serving data centers yet.

## Who makes it

The largest data center operators pay for the buildout. Alphabet, Amazon, Meta, Microsoft and Oracle spent $448.2 billion of capital in 2025, and if that trend continues they will spend $770 billion in 2026 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)).

{{figure:hyperscaler-capex}}

Campuses are now described in gigawatts. Epoch AI projects OpenAI's seven US Stargate sites to exceed 9 GW by 2029, with Abilene, Texas, growing from an estimated 0.3 GW in April to 1.2 GW in the fourth quarter of 2026 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).

The equipment vendors are the constraint. GE Vernova builds large gas turbines, and its 2025 annual report names Siemens Energy and Mitsubishi Power among the key competitors of its power generation business ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm)). Hitachi Energy, Siemens Energy, GE Vernova, ABB, Eaton and Schneider Electric supply transformers and switchgear. GE Vernova bought the remaining half of Prolec GE, a transformer maker, in the first half of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). GE Vernova's gas equipment backlog and reserved factory slots went from 100 GW to 116 GW in the second quarter of 2026, and its electrification orders from data centers passed $5 billion in the first half, more than double its 2025 total ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).

{{figure:turbine-output}}

## Capacity and demand

US data centers used 192 TWh in 2024, 4.7 percent of national electricity, according to a June 2026 estimate by Lawrence Berkeley National Laboratory that leaves out cryptocurrency mining ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update)). The lab's reference case projects 464 TWh in 2028 and 649 TWh in 2030, 11.8 percent of forecast US electricity use, and its scenarios for 2030 range from 521 to 843 TWh, or 9.5 percent to 15.3 percent ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update)). In its September 2026 Short-Term Energy Outlook, the Energy Information Administration expects record US electricity sales of 4,135 TWh in 2026 and 4,211 TWh in 2027, growth of almost 2 percent in each year, driven by data centers and manufacturing ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf)). The same outlook lowers its 2027 electricity sales forecast for the region that includes Texas by 4.7 percent from its August forecast, and it notes that Texas has paused connecting new data centers to the grid while it audits proposed projects ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf)).

{{figure:us-dc-electricity}}

Chip efficiency is still improving. Google's Ironwood TPU delivers twice the performance per watt of Trillium, its previous generation ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). Energy per token, where a token is the chunk of text a model reads or writes, can fall while total energy use still rises, if the number of tokens rises faster.

## The chokepoint

Announced capacity and energized capacity are a long way apart. ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads seeking a connection in June 2026, roughly 90 percent of it data centers ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). ERCOT's large load update of March 13, 2026, counted 9,042 MW approved to energize, but judging by peak monthly use, ERCOT believed only 3,883 MW of it was operating ([source](https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf)). In a preliminary review in July 2026, ERCOT found about 205 GW of the queue eligible for Batch Zero, its first study of connection requests as a group ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). On August 3, 2026, Texas Governor Greg Abbott ordered the state's Public Utility Commission and ERCOT to audit every data center in the interconnection process before any data center project moves forward ([source](https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit)).

Behind that queue sit the equipment lead times.

- **Large power transformers.** In 2024, 36-month lead times were commonly quoted and the worst reached 60, against under a year before the pandemic; by a Commerce Department estimate, 82 percent of the units put into US service in 2019 were imported ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)). A survey of the industry published by the IEA in 2025 found that large power transformers took up to four years to secure worldwide, and that average lead times had almost doubled since 2021 ([source](https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary)). Measured by capacity, US factories supplied 29.2 percent of the transformers of 60 MVA and above bought in the US in 2023, and imports supplied the rest ([source](https://www.usitc.gov/publications/701_731/pub5531.pdf)).
- **Gas turbines.** GE Vernova expects to reach 20 GW of annual gas turbine output in the third quarter of 2026, 24 GW in 2028 and 30 GW in 2030, while its gas equipment backlog and slot reservations stood at 116 GW at mid-year ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Firm new generation**, the kind that runs whatever the weather. The 835 MW Crane plant shut in 2019, and its restart depends on Nuclear Regulatory Commission licensing approvals ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). The NRC has approved a fuel license amendment for the plant, and Constellation expects to restart it in 2027 ([source](https://www.constellationenergy.com/news/2026/08/constellation-reports-second-quarter-2026-results.html)).

Memory is short too, and Micron's quarterly report for the period ended May 28, 2026, says AI-driven memory and storage growth is outpacing industry supply ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000015/mu-20260528.htm)). Power equipment takes years to arrive, and both limit how much of the 2026 capital spending turns into working compute.

## Key evaluation criteria

- **Time to power** counts the months from signed lease to energized megawatt, and it is the number developers compete on.
- **Transformer and turbine lead time** covers the two queues that set the schedule. Large power transformer lead times of 36 months were commonly quoted in 2024 ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)). GE Vernova's gas backlog and slot reservations stood at 116 GW in mid-2026, against a planned 20 GW a year of output from the third quarter ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Rack density supported** decides what an existing hall can take. A GB300 NVL72 rack draws up to 142 kW and is liquid cooled ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Firmness of supply** separates a signed interconnection agreement from a delivered transformer.
- **Energy per token** tracks how much electricity a model uses for each token it reads or writes, and chips with higher performance per watt, such as Google's Ironwood TPU, lower it ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

## Takeaways

Large power transformers, a core part of the electric grid, commonly took 36 months to deliver in 2024, against less than a year before the pandemic ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)). GE Vernova says data center orders for its electrification business, which makes grid equipment such as transformers and switchgear, passed $5 billion in the first half of 2026, more than double its total for 2025 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). In Texas, about 474 GW of large loads, mostly data centers, were seeking a grid connection in June 2026 ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). In August 2026 the governor of Texas ordered every data center in that queue audited before any of them moves forward ([source](https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit)).
