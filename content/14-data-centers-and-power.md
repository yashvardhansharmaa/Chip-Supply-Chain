---json
{
  "id": "data-centers-and-power",
  "number": 14,
  "title": "Data Centers and Power",
  "oneLiner": "SemiAnalysis forecast in October 2026 that 50 GW of data center capacity would be added in 2027, about as much as the world had built through 2024. The large transformers that connect such sites to the grid commonly took three years to arrive in 2024.",
  "plain": "A data center feeds electricity to the machines inside it and carries away the heat they give off. One rack of AI chips, a cabinet taller than a door, can draw 142 kilowatts ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Every watt of it comes back out as heat, and liquid piped through the rack carries the heat away ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). A large training site already holds more than a hundred thousand chips ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)). The newest sites are planned in gigawatts ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). One gigawatt is the whole output of a large power station, and Epoch AI projects that OpenAI's seven Stargate sites in the United States will add up to more than nine of them by 2029 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). Getting that much electricity to the site is harder than putting up the building. Transformers and heavy switches connect a site to the grid, and turbines make the power. All of them come from a few suppliers and take years to arrive.",
  "bridge": "Racks like that need a building designed around the power they draw and the heat they give off.",
  "specimen": "rack",
  "specimenCaption": "A liquid-cooled rack of 72 GPUs, Nvidia's GB200 NVL72, drawn to scale. It is 2.24 m tall and 600 mm wide, taller than a door. It weighs about 1.36 metric tons, more than a small car, and draws about 120 kW. The newer GB300 NVL72 draws up to 142 kW. The gray steel power shelves and the copper busbar they feed are picked out.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {
        "name": "GE Vernova",
        "country": "US",
        "share": "Gas equipment, transformers and switchgear, including through Prolec GE",
        "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm"
      },
      {
        "name": "Hitachi Energy",
        "country": "CH",
        "share": "Power transformers and switchgear",
        "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm"
      },
      {
        "name": "Siemens Energy",
        "country": "DE",
        "share": "Grid technologies, transformers, turbines",
        "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm"
      },
      {
        "name": "Mitsubishi Power",
        "country": "JP",
        "share": "Power generation equipment, including gas turbines",
        "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm"
      },
      {
        "name": "Vertiv",
        "country": "US",
        "share": "Data center power systems",
        "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"
      },
      {
        "name": "Schneider Electric",
        "country": "FR",
        "share": "Cooling, through its Motivair division",
        "source": "https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/"
      }
    ],
    "countries": [
      {
        "code": "US",
        "note": "The largest data center operators, and GE Vernova turbines and grid equipment"
      },
      {
        "code": "CH",
        "note": "Hitachi Energy transformers and switchgear, and ABB switchgear"
      },
      {
        "code": "DE",
        "note": "Siemens Energy grid technologies and turbines"
      },
      {
        "code": "JP",
        "note": "Mitsubishi Power equipment, including gas turbines"
      }
    ],
    "chinaStatus": "China used 25 percent of the world's data center electricity in 2024, second to the United States, by the International Energy Agency's estimate. Data centers made up around 3 percent of the growth in China's electricity demand from 2022 to 2024.",
    "chinaSources": [
      "https://www.iea.org/reports/energy-and-ai/executive-summary",
      "https://www.iea.org/reports/electricity-2025/executive-summary"
    ],
    "usStatus": "US factories supplied 29.2 percent of the large power transformers bought in the United States in 2023, measured by capacity. Constellation said in August 2026 that it expects to restart the Crane nuclear plant in 2027. Microsoft has agreed to buy the plant's power.",
    "usSources": [
      "https://www.usitc.gov/publications/701_731/pub5531.pdf#page=90",
      "https://www.constellationenergy.com/news/2026/08/constellation-reports-second-quarter-2026-results.html",
      "https://www.constellationenergy.com/news/2025/constellation-ahead-of-schedule-for-launch-of-crane-clean-energy-center.html"
    ],
    "costSignal": "$580 billion of data center investment expected worldwide in 2025, in the International Energy Agency's November 2025 outlook",
    "costSources": [
      "https://www.iea.org/reports/world-energy-outlook-2025/executive-summary"
    ],
    "substitutability": {
      "band": "Moderate",
      "test": "Nvidia named nine data center power system providers in October 2025 for its 800-volt designs for gigawatt-scale data centers.",
      "testSources": [
        "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"
      ],
      "why": "Buyers of grid equipment can choose among suppliers, and GE Vernova's 2025 annual report names Hitachi Energy, Siemens Energy, Schneider Electric and ABB among its key competitors. But in the United States in 2024 the longest large power transformer lead times reached 60 months. An International Energy Agency survey published in 2025 found waits of up to four years worldwide.",
      "whySources": [
        "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm",
        "https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=8",
        "https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary"
      ]
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
      "fact": "Capital spending by Alphabet, Amazon, Meta, Microsoft and Oracle came to $448.2B in 2025, the sum of Epoch AI's quarterly figures. If the trend continues, it will reach $770B in 2026",
      "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
    },
    {
      "fact": "ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads seeking a grid connection in June 2026, about 90% of it data centers. In July 2026, ERCOT found that only about 205 GW of those requests had the engineering study needed to enter Batch Zero, the first batch of requests it studies together",
      "source": "https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf"
    },
    {
      "fact": "On 3 August 2026 Texas Governor Greg Abbott ordered the Public Utility Commission and ERCOT to audit all data centers in ERCOT's interconnection process before any data center project moves forward",
      "source": "https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit"
    },
    {
      "fact": "ERCOT's operational overview for September 2026, published on 16 October 2026, counted 9,456 MW approved to energize. Judging by peak monthly use in September, ERCOT believed 4,132 MW of it was operating",
      "source": "https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf"
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
      "fact": "In its October 2026 Short-Term Energy Outlook, the US Energy Information Administration expects US electricity sales of 4,152.0 TWh in 2026 and 4,216.6 TWh in 2027. It expects electricity demand from the commercial sector, which includes data centers, to grow 2.8% in 2027",
      "source": "https://www.eia.gov/outlooks/steo/archives/oct26.pdf"
    }
  ],
  "figures": [
    {"id": "power-in-heat-out", "type": "animation", "src": "power", "title": "Power in, heat out", "note": "Simplified diagram, with illustrative sizes. An Nvidia GB300 NVL72 rack draws at most 142 kW. Nvidia gives 45 °C as the supply-water temperature for its Vera Rubin racks. The megawatt racks from 2027 are Nvidia's plan."},
    {
      "id": "hyperscaler-capex",
      "type": "bars",
      "title": "Capital spending by five large US data center operators, 2025",
      "finding": "Amazon spent the most of five large operators, $134.7 billion in 2025",
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
        "label": "Epoch AI, hyperscaler capex trend, February 2026, quarterly figures from company filings summed for 2025",
        "url": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
      }
    },
    {
      "id": "turbine-output",
      "type": "bars",
      "title": "GE Vernova's planned annual gas turbine output",
      "finding": "GE Vernova plans 30 GW of annual gas turbine output in 2030",
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
      "finding": "US data centers' projected 2030 use ranges from 521 to 843 TWh",
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
        "url": "https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update#page=11"
      }
    }
  ]
}
---
# Data Centers and Power

A wafer passes through a leading-edge fab in months, but in 2024 a large power transformer commonly took three years to arrive ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=8)). Before the pandemic, the same order took under a year ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=18)).

## How it works

A data center feeds electricity to the machines inside it and carries away the heat they give off. One rack of AI chips, a cabinet taller than a door, can draw 142 kilowatts ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Every watt of it comes back out as heat, and liquid piped through the rack carries the heat away ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). A large training site already holds more than a hundred thousand chips ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)). The newest sites are planned in gigawatts ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). One gigawatt is the whole output of a large power station, and Epoch AI projects that OpenAI's seven Stargate sites in the United States will add up to more than nine of them by 2029 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). Getting that much electricity to the site is harder than putting up the building. Transformers and heavy switches connect a site to the grid, and turbines make the power. All of them come from a few suppliers and take years to arrive.

{{figure:power-in-heat-out}}

The rack is the basic unit of AI compute. Nvidia's GB300 NVL72 rack draws up to 142 kW through eight 33 kW power shelves, the rack's own power supplies ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Large sites hold many such racks. Colossus 1, an AI data center in Memphis, Tennessee, held an estimated 230,000 Nvidia GPUs by July 2025 ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)).

Power reaches the rack through a chain of heavy equipment, and each piece has its own lead time, the wait between order and delivery. Between the grid and the rack, a substation steps the high voltage down with transformers. Switchgear, the building's heavy circuit breakers, can cut any part of the site off in a fault. Battery-backed supplies keep the racks running for the seconds it takes backup generators to start. Distribution boards split the feed among the rows of racks.

At the back of each rack, a busbar carries the current down to the server trays. It is a solid copper bar, because an ordinary cable would overheat at that current.

Heat leaves in water. Cold plates, metal blocks with coolant running through them, sit on the GPU packages and pass the heat to the building's water loop, which releases it outdoors ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)). Nvidia's Rubin racks run coolant at up to 45 °C, warm enough that in many climates the loop can release its heat without turning on chillers, the refrigeration machines that cool water ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

Nvidia is also moving the power that feeds its racks to 800 volts of direct current. Raising the voltage cuts the current needed for the same power, and the heat in copper comes from current. Nvidia said in October 2025 that at 800 volts the same wire can carry 157 percent more power than at 415 volts of alternating current ([source](https://developer.nvidia.com/blog/building-the-800-vdc-ecosystem-for-efficient-scalable-ai-factories/)). Inside racks such as the GB300 NVL72, power runs at 54 volts, and at that voltage a one-megawatt rack would need up to 200 kg of copper busbar ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

## Variants and trade-offs

### Cooling

- **Air.** Heat exchangers in the rack door work when density, the power each rack draws, is moderate, but Nvidia's GB300 NVL72 rack is liquid cooled ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Direct-to-chip liquid.** Nvidia's Rubin platform is 100 percent liquid cooled, and Nvidia says every cloud provider and data center operator building for it is moving to liquid ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).
- **Immersion.** The servers sit in a bath of fluid, which makes them hard to service.

Nvidia says the cooling supply chain is keeping pace with the move to liquid ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)). Motivair, Schneider Electric's cooling division, has worked with Nvidia for nearly a decade, following Nvidia's product roadmap ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

### Rack power

Nvidia's 800-volt DC architecture is designed for racks from 100 kW to more than a megawatt, with megawatt racks from 2027 ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)). Nvidia is making the change because the 54-volt distribution in existing racks begins to hit physical limits once racks exceed 200 kW ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

Nvidia names nine data center power system providers for its 800-volt designs for gigawatt-scale data centers, among them ABB, Eaton, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

A megawatt rack changes the busbar, the floor loading, the coolant flow, the leak detection and the energy stored in the rack. Nvidia's Vera Rubin NVL72 rack design adds energy storage to keep power steady ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

- **Grid interconnection.** The slow path in the United States, where the queues to connect are long ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Behind-the-meter gas**, generation on the site itself. The fast path, which at least three of OpenAI's seven US Stargate sites will use to avoid grid queues ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Nuclear.** Existing plants already sell power to data centers ([source](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611pressreleasebusin.htm)). Talen Energy supplies Amazon's data center campus next to the Susquehanna nuclear plant in Pennsylvania under a June 2025 contract expected to reach 1,920 MW no later than 2032 ([source](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611pressreleasebusin.htm)). Restarts and new reactors are still to come. Constellation signed a power purchase agreement with Microsoft to restart Three Mile Island Unit 1 as the 835 MW Crane Clean Energy Center ([source](https://www.constellationenergy.com/news/2025/constellation-ahead-of-schedule-for-launch-of-crane-clean-energy-center.html)). The plant shut in 2019 ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). A $1 billion federal loan that closed in November 2025 partly finances its restart, which is subject to licensing approvals from the US Nuclear Regulatory Commission ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)).

## Who makes it

The largest data center operators pay for the buildout. Capital spending by Alphabet, Amazon, Meta, Microsoft and Oracle came to $448.2 billion in 2025, the sum of quarterly figures compiled by Epoch AI, a research group ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). If the trend continues, it will reach $770 billion in 2026 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). The International Energy Agency expected worldwide investment in data centers to reach $580 billion in 2025 ([source](https://www.iea.org/reports/world-energy-outlook-2025/executive-summary)).

{{figure:hyperscaler-capex}}

Epoch AI also projects that OpenAI's seven US Stargate sites will exceed 9 GW by 2029 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). It expects the site in Abilene, Texas, to grow from an estimated 0.3 GW in April 2026 to 1.2 GW in the fourth quarter of 2026 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).

A few large firms make the turbines, transformers and switchgear. GE Vernova builds large gas turbines, and its 2025 annual report names Siemens Energy and Mitsubishi Power among the key competitors of its power generation business ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm)). Its electrification business makes power transformers and switchgear, and the report names Hitachi Energy, Siemens Energy, Schneider Electric and ABB among that business's key competitors ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000015/gev-20251231.htm)).

Equipment makers limit how fast the buildout can go. GE Vernova's gas equipment backlog and reserved factory slots grew from 100 GW to 116 GW in the second quarter of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). In the first half of 2026, data center orders for its electrification business, which makes grid equipment, passed $5 billion, more than double that business's data center orders for all of 2025 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). GE Vernova bought the remaining half of Prolec GE, a transformer maker, in the first half of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).

{{figure:turbine-output}}

## Capacity and demand

US data center electricity use is projected to rise steeply by 2030. US data centers used 192 TWh in 2024, 4.7 percent of national electricity, according to a June 2026 estimate by Lawrence Berkeley National Laboratory that leaves out cryptocurrency mining ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update#page=10)). The lab's reference case, its main scenario, projects 464 TWh in 2028 and 649 TWh in 2030, which would be 11.8 percent of forecast US electricity use ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update#page=10)). Its scenarios for 2030 range from 521 to 843 TWh, or 9.5 percent to 15.3 percent ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update#page=11)).

The US Energy Information Administration expects electricity demand to keep rising, but in September 2026 it cut its 2027 forecast for the region that includes Texas. In its October 2026 Short-Term Energy Outlook, it expects US electricity sales of 4,152.0 TWh in 2026 and 4,216.6 TWh in 2027 ([source](https://www.eia.gov/outlooks/steo/archives/oct26.pdf#page=46)). It expects electricity demand from the commercial sector, which includes data centers, to grow 2.8 percent in 2027 and demand from industry to grow 2.7 percent ([source](https://www.eia.gov/outlooks/steo/archives/oct26.pdf#page=12)). Its September outlook had lowered the 2027 electricity sales forecast for the region that includes Texas by 4.7 percent from August ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf#page=4)). That outlook noted that Texas had paused connecting new data centers to the grid while the state audits proposed projects ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf#page=10)). The pause, set by the grid operator for most of Texas, covers data centers and crypto mining sites of 75 MW or more ([source](https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf)).

{{figure:us-dc-electricity}}

By the International Energy Agency's estimate, China accounted for 25 percent of the world's data center electricity use in 2024, second to the United States at 45 percent ([source](https://www.iea.org/reports/energy-and-ai/executive-summary)). Data centers made up around 3 percent of the growth in China's electricity demand from 2022 to 2024, the agency found ([source](https://www.iea.org/reports/electricity-2025/executive-summary)).

SemiAnalysis, a research firm, forecast in October 2026 that 50 GW of data center capacity would be added in 2027, which it said was about as much as the world's data center market had built in total through 2024 ([source](https://newsletter.semianalysis.com/p/datacenters-2027-the-year-of-acceleration)). Just 40 campuses in an advanced stage of construction held more than 24 GW, most of it to be delivered in 2027, it found ([source](https://newsletter.semianalysis.com/p/datacenters-2027-the-year-of-acceleration)).

Better chips do not by themselves cut total energy use. Google says its Ironwood TPU, an AI chip, delivers twice the performance per watt of Trillium, the TPU before it ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). A token is the chunk of text a model reads or writes. Energy per token can fall while total energy use still rises, if the number of tokens rises faster.

## The chokepoint

On the Texas grid, big power users have asked for far more electricity than is connected and running. ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads (big power users) seeking a connection in June 2026, roughly 90 percent of it data centers ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf#page=6)). In its operational overview for September 2026, ERCOT counted 9,456 MW of large loads approved to energize, that is, cleared to switch on ([source](https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf#page=9)). Judging by peak monthly use in September, it believed only 4,132 MW of it was operating ([source](https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf#page=9)).

Before a big user can connect, engineers must study whether the nearby grid can carry its load. In a preliminary review in July 2026, ERCOT found that about 205 GW of the requests already had such a study, which made them eligible for Batch Zero, the first batch of requests it studies together ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf#page=10)). In September 2026 ERCOT conditionally classed 66.4 GW of Batch Zero projects as base load and 127.9 GW as studied load, pending final decisions in December ([source](https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf)). Under ERCOT's Batch Zero rules, base load is demand from projects already running or far enough along to be counted without further study ([source](https://www.ercot.com/mktrules/issues/PGRR145)). Studied load is demand that ERCOT will study before giving each project a share of the grid's capacity ([source](https://www.ercot.com/mktrules/issues/PGRR145)).

Texas has paused new connections for large data centers while it audits them. On 3 August 2026 Texas Governor Greg Abbott ordered the state's Public Utility Commission and ERCOT to audit every data center waiting to connect to the grid before any data center project moves forward ([source](https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit)). ERCOT then paused approvals to energize data centers and crypto mining sites of 75 MW or more until the audit and a review of their impact on local communities are complete ([source](https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf)). It will report on the audit and the community review to the Public Utility Commission by 10 December 2026 ([source](https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf)).

Projects in that queue also wait on equipment.

- **Large power transformers.** In the United States in 2024, lead times of 36 months were commonly quoted and the longest reached 60 months, against under a year before the pandemic ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=8)). By a US Commerce Department estimate, 82 percent of the units put into US service in 2019 were imported ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=20)). In an industry survey published in 2025, the International Energy Agency found that large power transformers took up to four years to secure worldwide ([source](https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary)). It also found that their average lead times had almost doubled since 2021 ([source](https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary)). A transformer's size is given as a power rating in megavolt-amperes (MVA) ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=8)). Measured by capacity, US factories supplied 29.2 percent of the transformers rated 60 MVA and above bought in the US in 2023, and imports supplied the rest ([source](https://www.usitc.gov/publications/701_731/pub5531.pdf#page=90)).
- **Gas turbines.** GE Vernova's gas equipment backlog and reserved factory slots stood at 116 GW in mid-2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). In July 2026 it expected to build gas turbines at a yearly rate of 20 GW in the third quarter of 2026, 24 GW in 2028 and 30 GW in 2030 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Firm generation**, the kind that runs whatever the weather. The Nuclear Regulatory Commission has approved a fuel license amendment for the Crane plant ([source](https://www.constellationenergy.com/news/2026/08/constellation-reports-second-quarter-2026-results.html)). Constellation called the approval a major milestone toward restarting the plant in 2027 ([source](https://www.constellationenergy.com/news/2026/08/constellation-reports-second-quarter-2026-results.html)).

Memory chips are also in short supply. Micron's quarterly report for the period ended 28 May 2026 says AI-driven growth in demand for memory and storage is outpacing industry supply ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000015/mu-20260528.htm)). The memory shortage and the wait for power equipment both limit how much of the 2026 capital spending turns into working compute.

## Takeaways

Measured by capacity, US factories supplied 29.2 percent of the large power transformers bought in the US in 2023, and imports the rest ([source](https://www.usitc.gov/publications/701_731/pub5531.pdf#page=90)). GE Vernova's gas equipment backlog and reserved factory slots stood at 116 GW in mid-2026, against planned output of 20 GW a year from the third quarter ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).

ERCOT, the grid operator for most of Texas, counted 9,456 MW of big power users approved to energize in its overview for September 2026 ([source](https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf#page=9)). Judging by peak monthly use in September, it believed 4,132 MW of that was operating ([source](https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf#page=9)). On 3 August 2026 Governor Greg Abbott ordered an audit of every data center seeking a connection before any data center project moves forward ([source](https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit)). In September 2026 ERCOT said it had paused approvals to energize data centers of 75 MW or more until the audit and a review of their impact on local communities are complete ([source](https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf)).
