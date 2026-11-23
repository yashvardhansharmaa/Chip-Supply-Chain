---json
{
  "id": "data-centers-and-power",
  "number": 14,
  "title": "Data Centers and Power",
  "oneLiner": "Amazon, Google, Meta, Microsoft and Oracle owned an estimated 71 percent of the world's AI computing power at the end of 2025. New sites wait years for power.",
  "plain": "A data center is a building full of computers, and an AI data center holds racks of AI chips. Five companies own most of the world's AI computing power, and four of them rent part of it to other firms ([source](https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer)). One rack, a cabinet taller than a door, can draw 142 kilowatts ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Every watt of it comes back out as heat, and liquid piped through the rack carries the heat away ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). The newest sites are planned in gigawatts ([source](https://openai.com/index/five-new-stargate-sites/)). One gigawatt is the whole output of a large power station. Getting that much electricity to a site is harder than putting up the building.",
  "bridge": "Racks like that need a building designed around the power they draw and the heat they give off.",
  "specimen": "rack",
  "specimenCaption": "A liquid-cooled rack of 72 GPUs, Nvidia's GB200 NVL72, drawn to scale from Supermicro's February 2025 datasheet: 2,236 mm tall and 600 mm wide. Eight 33 kW power shelves feed the trays through a copper busbar at the back.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {
        "name": "Google",
        "country": "US",
        "share": "24.8 percent of the world's AI computing power at the end of 2025, Epoch AI estimates",
        "source": "https://epoch.ai/data-insights/hyperscalers-control-most-compute"
      },
      {
        "name": "Microsoft",
        "country": "US",
        "share": "16.8 percent of the world's AI computing power at the end of 2025, Epoch AI estimates",
        "source": "https://epoch.ai/data-insights/hyperscalers-control-most-compute"
      },
      {
        "name": "Amazon",
        "country": "US",
        "share": "12.1 percent of the world's AI computing power at the end of 2025, Epoch AI estimates",
        "source": "https://epoch.ai/data-insights/hyperscalers-control-most-compute"
      },
      {
        "name": "Meta",
        "country": "US",
        "share": "11.3 percent of the world's AI computing power at the end of 2025, Epoch AI estimates",
        "source": "https://epoch.ai/data-insights/hyperscalers-control-most-compute"
      },
      {
        "name": "Oracle",
        "country": "US",
        "share": "5.6 percent of the world's AI computing power at the end of 2025, Epoch AI estimates",
        "source": "https://epoch.ai/data-insights/hyperscalers-control-most-compute"
      },
      {
        "name": "CoreWeave",
        "country": "US",
        "share": "$132.5 billion of revenue backlog, contracted revenue still to come, at the end of September 2026",
        "source": "https://s205.q4cdn.com/133937190/files/content_files/CoreWeave-3Q-2026-Infographic.pdf#page=1"
      }
    ],
    "countries": [
      {
        "code": "US",
        "note": "The five hyperscalers and CoreWeave, and GE Vernova turbines and grid equipment"
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
    "chinaStatus": "Chinese companies together owned just over 5 percent of the world's AI computing power at the end of 2025, by Epoch AI's estimate, which leaves out chips smuggled past US export controls. China used 25 percent of the world's data center electricity in 2024, second to the United States, by the International Energy Agency's estimate.",
    "chinaSources": [
      "https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer",
      "https://www.iea.org/reports/energy-and-ai/executive-summary"
    ],
    "usStatus": "The five US hyperscalers owned 71 percent of the world's AI computing power at the end of 2025, by Epoch AI's estimate. US factories supplied 29.2 percent of the large power transformers, those rated 60 MVA and above, bought in the United States in 2023, measured by capacity.",
    "usSources": [
      "https://epoch.ai/data-insights/hyperscalers-control-most-compute",
      "https://www.usitc.gov/publications/701_731/pub5531.pdf#page=90"
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
        "https://www.gevernova.com/sites/default/files/gevernova_2025_form10-k.pdf#page=5",
        "https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=8",
        "https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary"
      ]
    }
  },
  "keyFacts": [
    {
      "fact": "Amazon, Google, Meta, Microsoft and Oracle owned 71 percent of the world's AI computing power at the end of 2025, up from 63 percent in the first quarter of 2024, by Epoch AI's estimate",
      "source": "https://epoch.ai/data-insights/hyperscalers-control-most-compute"
    },
    {
      "fact": "OpenAI and Anthropic do not own most of the computing power they use. Cloud companies provide it, mainly Microsoft, Oracle and CoreWeave for OpenAI and Amazon and Google for Anthropic, Epoch AI found",
      "source": "https://epoch.ai/data/ai-chip-owners"
    },
    {
      "fact": "Microsoft supplied about 67 percent of CoreWeave's revenue in 2025",
      "source": "https://s205.q4cdn.com/133937190/files/doc_financials/2025/ar/2025-Annual-Report.pdf#page=26"
    },
    {
      "fact": "In 2024, large power transformer lead times of 36 months were commonly quoted, and the longest reached 60 months. Before the pandemic an order took under a year, and 82 percent of the units put into US service in 2019 were imported",
      "source": "https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf"
    },
    {
      "fact": "Measured by capacity, US producers supplied 29.2 percent of the large power transformers of 60 MVA and above bought in the US in 2023, down from 32.5 percent in 2021. Their lead times averaged three years in 2023, against one and a half years for importers",
      "source": "https://www.usitc.gov/publications/701_731/pub5531.pdf"
    },
    {
      "fact": "A GB300 NVL72 rack draws up to 142 kW, fed by eight 33 kW power shelves",
      "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"
    },
    {
      "fact": "Nvidia's 800-volt DC architecture is designed for racks from 100 kW to over 1 MW, with megawatt racks from 2027. Nvidia is making the change because the 54-volt distribution in existing racks begins to hit physical limits once racks exceed 200 kW",
      "source": "https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/"
    },
    {
      "fact": "Nvidia's Kyber rack will hold 576 Rubin Ultra GPUs by 2027 on an 800-volt DC bus that carries over 150 percent more power through the same copper",
      "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"
    },
    {
      "fact": "US data centers used 192 TWh in 2024, 4.7 percent of US electricity. Lawrence Berkeley National Laboratory's reference case projects 649 TWh in 2030, or 11.8 percent, within a range of 521 to 843 TWh",
      "source": "https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update"
    },
    {
      "fact": "Capital spending by Alphabet, Amazon, Meta, Microsoft and Oracle came to $140,648 million in the fourth quarter of 2025, by Epoch AI's count",
      "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
    },
    {
      "fact": "ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads seeking a grid connection in June 2026, about 90 percent of it data centers. In July 2026, ERCOT found that only about 205 GW of those requests had the engineering study needed to enter Batch Zero, the first batch of requests it studies together",
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
      "fact": "GE Vernova's gas power equipment backlog and reserved factory slots grew from 100 GW to 116 GW in the second quarter of 2026. It expects annual gas turbine output of 20 GW in the third quarter of 2026 and 24 GW in 2028, and is taking steps to reach 30 GW in 2030",
      "source": "https://www.gevernova.com/news/press-releases/ge-vernova-reports-second-quarter-2026-financial-results-raises-2026-financial"
    },
    {
      "fact": "In its October 2026 Short-Term Energy Outlook, the US Energy Information Administration expects US electricity sales of 4,152.0 TWh in 2026 and 4,216.6 TWh in 2027. It expects electricity demand from the commercial sector, which includes data centers, to grow 2.8 percent in 2027",
      "source": "https://www.eia.gov/outlooks/steo/archives/oct26.pdf"
    }
  ],
  "figures": [
    {"id": "power-in-heat-out", "type": "animation", "src": "power", "title": "Power in, heat out", "note": "Simplified diagram, with illustrative sizes. An Nvidia GB300 NVL72 rack draws at most 142 kW. Nvidia gives 45 °C as the supply-water temperature for its Vera Rubin racks. The megawatt racks from 2027 are Nvidia's plan."},
    {"id": "who-owns-what", "type": "animation", "src": "owners", "title": "Who owns what in an AI data center", "note": "Simplified diagram of the arrangement CoreWeave describes in its 2025 annual report, with illustrative sizes. One firm can hold more than one layer, and in some of Oracle's large AI contracts the customer prepays for the chips or supplies them."},
    {
      "id": "hyperscaler-capex",
      "type": "bars",
      "title": "Capital spending by the five US hyperscalers, fourth quarter of 2025",
      "finding": "Amazon spent the most of the five hyperscalers, $40,465 million in the fourth quarter of 2025",
      "unit": "$M",
      "data": [
        [
          "Amazon",
          40465
        ],
        [
          "Microsoft",
          36206
        ],
        [
          "Alphabet",
          28468
        ],
        [
          "Meta",
          22463
        ],
        [
          "Oracle",
          13046
        ]
      ],
      "source": {
        "label": "Epoch AI, hyperscaler capex trend, February 2026, table of capital spending by quarter, fourth quarter of 2025",
        "url": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
      },
      "note": "Epoch AI's figures, from company filings, add cash spent on property and equipment to new finance leases, leases recorded much like purchases paid for over time. The companies' own figures count capital spending in different ways. Alphabet is Google's parent company. Microsoft's fiscal year ends in June, but its quarters match calendar quarters. Oracle's ends in May, and Epoch AI counts Oracle's quarter from September to November 2025 as the fourth quarter of 2025."
    },
    {
      "id": "turbine-output",
      "type": "columns",
      "title": "GE Vernova's planned annual gas turbine output",
      "finding": "GE Vernova is taking steps to reach 30 GW of annual gas turbine output in 2030",
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
        "url": "https://www.gevernova.com/news/press-releases/ge-vernova-reports-second-quarter-2026-financial-results-raises-2026-financial"
      }
    },
    {
      "id": "us-dc-electricity",
      "type": "columns",
      "mark": "2030, projected",
      "range": {"label": "2030, projected", "low": "2030 low case", "high": "2030 high case", "ref": "2030 reference case", "refLabel": "reference case"},
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

OpenAI and Anthropic, two leading AI labs, rented almost all of the computing power they used, the research group Epoch AI found in April 2026 ([source](https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer)). OpenAI's came mainly from Microsoft, Oracle and CoreWeave, and Anthropic's mainly from Amazon and Google ([source](https://epoch.ai/data/ai-chip-owners)).

## How it works

A data center is a building full of computers, and an AI data center holds racks of AI chips. Five companies own most of the world's AI computing power, and four of them rent part of it to other firms ([source](https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer)). One rack, a cabinet taller than a door, can draw 142 kilowatts ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Every watt of it comes back out as heat, and liquid piped through the rack carries the heat away ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). The newest sites are planned in gigawatts ([source](https://openai.com/index/five-new-stargate-sites/)). One gigawatt is the whole output of a large power station. Getting that much electricity to a site is harder than putting up the building.

{{figure:power-in-heat-out}}

The rack is the basic unit of AI compute. Nvidia's GB300 NVL72 rack draws up to 142 kW through eight 33 kW power shelves, the rack's own power supplies ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Supermicro's datasheet of February 2025 gives the GB200 NVL72, the rack before it, as 2,236 mm tall and 600 mm wide ([source](https://www.supermicro.com/datasheet/datasheet_SuperCluster_GB200_NVL72.pdf)). Large sites hold many such racks. Colossus 1, an AI data center in Memphis, Tennessee, held an estimated 230,000 Nvidia GPUs by July 2025 ([source](https://epoch.ai/data/ai-data-centers/directory/colossus-1)).

Power reaches the rack through a chain of heavy equipment, and each piece has its own lead time, the wait between order and delivery. Between the grid and the rack, a substation steps the high voltage down with transformers. Switchgear, the building's heavy circuit breakers, can cut any part of the site off in a fault. Battery-backed supplies keep the racks running for the seconds it takes backup generators to start. Distribution boards split the feed among the rows of racks.

At the back of each rack, a busbar carries the current down to the server trays. It is a solid copper bar, because an ordinary cable would overheat at that current.

Heat leaves in water. Cold plates, metal blocks with coolant running through them, sit on the GPU packages and pass the heat to the building's water loop, which releases it outdoors ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)). Nvidia's Rubin racks run coolant at up to 45 °C, warm enough that in many climates the loop can release its heat without turning on chillers, the refrigeration machines that cool water ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

Nvidia is also moving the power that feeds its racks to 800 volts of direct current. Raising the voltage cuts the current needed for the same power, and the heat in copper comes from current. Inside racks such as the GB300 NVL72, power runs at 54 volts, and at that voltage a one-megawatt rack would need up to 200 kg of copper busbar ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

## Who owns the compute

One firm can build a data center, a second can own the chips inside it, and a third can use the chips' computing time. Abilene, Texas, is the flagship site of OpenAI's Stargate data center program ([source](https://openai.com/index/five-new-stargate-sites/)). The developer Crusoe designed and built the campus ([source](https://www.crusoe.ai/resources/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts)). Oracle owns the AI chips there, and OpenAI uses them, Epoch AI found ([source](https://epoch.ai/data/ai-data-centers/directory/openai-stargate-abilene)).

{{figure:who-owns-what}}

The largest owners of AI chips are the hyperscalers, the companies that run data centers on the largest scale ([source](https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer)). Amazon, Google, Meta, Microsoft and Oracle held 71 percent of the world's AI computing power at the end of 2025, Epoch AI estimates ([source](https://epoch.ai/data-insights/hyperscalers-control-most-compute)). The estimate adds up the rated speed of the AI chips each firm had bought in recent years ([source](https://epoch.ai/data-insights/hyperscalers-control-most-compute)). Google held the most, 24.8 percent ([source](https://epoch.ai/data-insights/hyperscalers-control-most-compute)).

All the hyperscalers except Meta are cloud companies, which rent part of their computing power to other firms ([source](https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer)). Meta has no cloud business and uses its chips for its own AI models and for the systems that choose the posts and ads its apps show ([source](https://epoch.ai/data/ai-chip-owners)).

Oracle rents out its AI chips through its cloud, and in September 2026 it said it had delivered more than 300,000 GPUs to its AI cloud customers since the end of May ([source](https://www.oracle.com/news/announcement/q1fy27-earnings-release-2026-09-10/)). In July 2025 OpenAI agreed with Oracle to develop up to 4.5 GW of further Stargate capacity, a partnership OpenAI said would exceed $300 billion over five years ([source](https://openai.com/index/five-new-stargate-sites/)). Oracle's remaining performance obligations, revenue under contract that it has yet to earn, reached $664 billion at the end of August 2026 ([source](https://www.oracle.com/news/announcement/q1fy27-earnings-release-2026-09-10/)). Oracle said most of the rise in those obligations in the six months to May 2026 came from large AI contracts in which the customer prepaid for the chips or bought and supplied them itself ([source](https://www.oracle.com/news/announcement/q4fy26-earnings-release-2026-06-10/)). Those terms reduce the capital Oracle must raise to build its AI data centers, the company said ([source](https://www.oracle.com/news/announcement/q4fy26-earnings-release-2026-06-10/)).

Epoch AI judges that neoclouds, smaller and newer cloud companies that generally focus on AI, are probably the most important owners of AI chips after the hyperscalers ([source](https://epoch.ai/data/ai-chip-owners)). SemiAnalysis, a research firm, tracked 209 cloud companies renting out AI chips in November 2025 and counted CoreWeave among the neoclouds ([source](https://newsletter.semianalysis.com/p/clustermax-20-the-industry-standard)). CoreWeave ran 52 data centers with more than 1.7 GW of active power at the end of September 2026 ([source](https://s205.q4cdn.com/133937190/files/content_files/CoreWeave-3Q-2026-Infographic.pdf#page=1)).

CoreWeave's 2025 annual report says it leases all of its data centers ([source](https://s205.q4cdn.com/133937190/files/doc_financials/2025/ar/2025-Annual-Report.pdf#page=59)). It pays for its buildout mostly with debt backed by customer contracts ([source](https://s205.q4cdn.com/133937190/files/doc_financials/2025/ar/2025-Annual-Report.pdf#page=12)). Those contracts usually run one to six years, and customers pay for all the capacity even if they use less, often paying part in advance ([source](https://s205.q4cdn.com/133937190/files/doc_financials/2025/ar/2025-Annual-Report.pdf#page=107)).

Two hyperscalers, Microsoft and Meta, rent from neoclouds too. Microsoft supplied about 67 percent of CoreWeave's revenue in 2025 ([source](https://s205.q4cdn.com/133937190/files/doc_financials/2025/ar/2025-Annual-Report.pdf#page=26)). Microsoft buys some computing power from neoclouds and rents it out again to its own customers, Epoch AI found ([source](https://epoch.ai/data/ai-chip-owners)). Nebius, a neocloud headquartered in Amsterdam, agreed in March 2026 to supply Meta with capacity worth up to about $27 billion over five years ([source](https://nebius.com/newsroom/nebius-signs-new-ai-infrastructure-agreement-with-meta)).

AI labs sign large contracts for computing power. In October 2025 OpenAI contracted to buy a further $250 billion of Azure cloud services from Microsoft ([source](https://openai.com/index/next-chapter-of-microsoft-openai-partnership/)). Its Stargate program with Oracle and the investment company SoftBank had more than 8 GW of planned capacity in the United States by October 2025, OpenAI said ([source](https://openai.com/index/expanding-stargate-to-michigan/)). Epoch AI projects that the program's seven US sites will exceed 9 GW by 2029 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).

SpaceX bought xAI in February 2026 ([source](https://x.ai/news/xai-joins-spacex)). Until then, xAI was the only major stand-alone AI lab that owned most of the computing power it used, Epoch AI found ([source](https://epoch.ai/data/ai-chip-owners)). In May 2026 Anthropic agreed to use all of the computing capacity of SpaceX's Colossus 1 data center ([source](https://www.anthropic.com/news/higher-limits-spacex)).

Firms outside the United States are building too. In May 2025 Abu Dhabi's media office said that G42, an Emirati AI company, would build a 1 GW cluster there called Stargate UAE, which OpenAI and Oracle would operate ([source](https://www.mediaoffice.abudhabi/en/technology/global-tech-alliance-launches-stargate-uae/)). Alibaba said in February 2025 that it would invest at least RMB 380 billion ($53 billion) in cloud computing and AI infrastructure over three years ([source](https://www.alibabagroup.com/en-US/document-1830678592242057216)). Chinese companies together owned just over 5 percent of the world's AI computing power at the end of 2025, by Epoch AI's estimate, which leaves out chips smuggled past US export controls ([source](https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer)).

The hyperscalers' capital spending grew an average of 72 percent a year from the second quarter of 2023 to the end of 2025, driven by investment in AI infrastructure, Epoch AI found ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). The five firms' spending came to $140,648 million in the fourth quarter of 2025, by Epoch AI's count ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)).

{{figure:hyperscaler-capex}}

## Variants and trade-offs

### Cooling

- **Air.** Heat exchangers in the rack door work when density, the power each rack draws, is moderate, but Nvidia's GB300 NVL72 rack is liquid cooled ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Direct-to-chip liquid.** Nvidia's Rubin platform is 100 percent liquid cooled, and Nvidia says every cloud provider and data center operator building for it is moving to liquid ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).
- **Immersion.** The servers sit in a bath of fluid, which makes them hard to service.

Motivair, Schneider Electric's cooling division, follows Nvidia's product roadmap and has worked with Nvidia for nearly a decade ([source](https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/)).

### Rack power

Nvidia's 800-volt DC architecture is designed for racks from 100 kW to more than a megawatt, with megawatt racks from 2027 ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)). Nvidia is making the change because the 54-volt distribution in existing racks begins to hit physical limits once racks exceed 200 kW ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

Nvidia names nine data center power system providers for its 800-volt designs for gigawatt-scale data centers, among them ABB, Eaton, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

A megawatt rack changes the busbar, the floor loading, the coolant flow, the leak detection and the energy stored in the rack. Nvidia's Vera Rubin NVL72 rack design adds energy storage to keep power steady ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

- **Grid interconnection.** The slow path in the United States, where the queues to connect are long ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Behind-the-meter gas**, generation on the site itself. The fast path, which at least three of OpenAI's seven US Stargate sites will use to avoid grid queues ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).
- **Nuclear.** Existing plants already sell power to data centers ([source](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611pressreleasebusin.htm)). Talen Energy supplies Amazon's data center campus next to the Susquehanna nuclear plant in Pennsylvania under a June 2025 contract expected to reach 1,920 MW no later than 2032 ([source](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611pressreleasebusin.htm)). Constellation signed a power purchase agreement with Microsoft to restart Three Mile Island Unit 1 as the 835 MW Crane Clean Energy Center ([source](https://www.constellationenergy.com/news/2025/constellation-ahead-of-schedule-for-launch-of-crane-clean-energy-center.html)). In August 2026 Constellation said it expects to restart the plant in 2027 ([source](https://www.constellationenergy.com/news/2026/08/constellation-reports-second-quarter-2026-results.html)).

## Capacity and demand

US data center electricity use is projected to rise steeply by 2030. US data centers used 192 TWh in 2024, 4.7 percent of national electricity, according to a June 2026 estimate by Lawrence Berkeley National Laboratory that leaves out cryptocurrency mining ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update#page=10)). The lab's reference case, its main scenario, projects 464 TWh in 2028 and 649 TWh in 2030, which would be 11.8 percent of forecast US electricity use ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update#page=10)). Its scenarios for 2030 range from 521 to 843 TWh, or 9.5 percent to 15.3 percent ([source](https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update#page=11)).

The US Energy Information Administration expects electricity demand to keep rising, but its September 2026 outlook cut the 2027 electricity sales forecast for the region that includes Texas by 4.7 percent from August ([source](https://www.eia.gov/outlooks/steo/archives/sep26.pdf#page=4)).

{{figure:us-dc-electricity}}

By the International Energy Agency's estimate, China accounted for 25 percent of the world's data center electricity use in 2024, second to the United States at 45 percent ([source](https://www.iea.org/reports/energy-and-ai/executive-summary)). Data centers made up around 3 percent of the growth in China's electricity demand from 2022 to 2024, the agency found ([source](https://www.iea.org/reports/electricity-2025/executive-summary)).

The International Energy Agency expected worldwide investment in data centers to reach $580 billion in 2025 ([source](https://www.iea.org/reports/world-energy-outlook-2025/executive-summary)). SemiAnalysis forecast in October 2026 that 50 GW of data center capacity would be added in 2027 ([source](https://newsletter.semianalysis.com/p/datacenters-2027-the-year-of-acceleration)). It said that was about as much as the world's data center market had built in total through 2024 ([source](https://newsletter.semianalysis.com/p/datacenters-2027-the-year-of-acceleration)). Just 40 campuses in an advanced stage of construction held more than 24 GW, most of it to be delivered in 2027, it found ([source](https://newsletter.semianalysis.com/p/datacenters-2027-the-year-of-acceleration)).

## The narrowest step

Electricity grids are under strain in many places. In April 2025 the International Energy Agency estimated that around 20 percent of planned data center projects could be at risk of delay unless that strain is addressed ([source](https://www.iea.org/reports/energy-and-ai/executive-summary)). The agency also found that a new transmission line can take four to eight years to build in advanced economies ([source](https://www.iea.org/reports/energy-and-ai/executive-summary)).

On the Texas grid, big power users have asked for far more electricity than is connected and running. ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads seeking a connection in June 2026, roughly 90 percent of it data centers ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf#page=6)). In its operational overview for September 2026, ERCOT counted 9,456 MW of large loads approved to energize, that is, cleared to switch on ([source](https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf#page=9)). Judging by peak monthly use in September, it believed only 4,132 MW of it was operating ([source](https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf#page=9)).

Texas has paused new connections for large data centers while it audits them. On 3 August 2026 Texas Governor Greg Abbott ordered the state's Public Utility Commission and ERCOT to audit every data center waiting to connect to the grid before any data center project moves forward ([source](https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit)). ERCOT then paused approvals to energize data centers and crypto mining sites of 75 MW or more until the audit and a review of their impact on local communities are complete ([source](https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf)).

Data center projects also wait on power equipment from makers such as GE Vernova. GE Vernova builds large gas turbines, and its 2025 annual report names Siemens Energy and Mitsubishi Power among the key competitors of its power generation business ([source](https://www.gevernova.com/sites/default/files/gevernova_2025_form10-k.pdf#page=5)). Its electrification business makes power transformers and switchgear, and the report names Hitachi Energy, Siemens Energy, Schneider Electric and ABB among that business's key competitors ([source](https://www.gevernova.com/sites/default/files/gevernova_2025_form10-k.pdf#page=5)).

- **Large power transformers.** In the United States in 2024, lead times of 36 months were commonly quoted and the longest reached 60 months ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=8)). Before the pandemic, a large transformer could be ordered with a lead time of under a year ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=18)). In an industry survey published in 2025, the International Energy Agency found that large power transformers took up to four years to secure worldwide ([source](https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary)). It also found that their average lead times had almost doubled since 2021 ([source](https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary)). By a US Commerce Department estimate, 82 percent of the units put into US service in 2019 were imported ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=20)). A transformer's size is given as a power rating in megavolt-amperes (MVA), a measure of how much power it can handle ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf#page=8)). Measured by capacity, US factories supplied 29.2 percent of the transformers rated 60 MVA and above bought in the US in 2023, and imports supplied the rest ([source](https://www.usitc.gov/publications/701_731/pub5531.pdf#page=90)).
- **Gas turbines.** GE Vernova's gas equipment backlog and reserved factory slots grew from 100 GW to 116 GW in the second quarter of 2026 ([source](https://www.gevernova.com/news/press-releases/ge-vernova-reports-second-quarter-2026-financial-results-raises-2026-financial)). In July 2026 it expected yearly gas turbine output of 20 GW in the third quarter of 2026 and 24 GW in 2028, and it was taking steps to reach 30 GW in 2030 ([source](https://www.gevernova.com/news/press-releases/ge-vernova-reports-second-quarter-2026-financial-results-raises-2026-financial)).
- **Grid equipment for data centers.** In the first half of 2026, data center orders for GE Vernova's electrification business passed $5 billion, more than double that business's data center orders for all of 2025 ([source](https://www.gevernova.com/news/press-releases/ge-vernova-reports-second-quarter-2026-financial-results-raises-2026-financial)).

{{figure:turbine-output}}

Memory chips are also in short supply. Micron's quarterly report for the period ended 28 May 2026 says AI-driven growth in demand for memory and storage is outpacing industry supply ([source](https://s25.q4cdn.com/621799436/files/doc_financials/2026/q3/0000723125-26-000015.pdf#page=27)).

## Takeaways

The research group Epoch AI judges that neoclouds, smaller and newer cloud companies that generally focus on AI, are probably the most important owners of AI chips after the hyperscalers ([source](https://epoch.ai/data/ai-chip-owners)). Cloud companies also rent from one another, and Microsoft supplied about 67 percent of the revenue of the cloud company CoreWeave in 2025 ([source](https://s205.q4cdn.com/133937190/files/doc_financials/2025/ar/2025-Annual-Report.pdf#page=26)). Oracle booked more than $30 billion of new AI cloud contracts in the three months to August 2026, which raised the revenue under contract that it had yet to earn to $664 billion ([source](https://www.oracle.com/news/announcement/q1fy27-earnings-release-2026-09-10/)).

ERCOT, the grid operator for most of Texas, was tracking about 474 GW of demand from big power users seeking a grid connection in June 2026, roughly 90 percent of it from data centers ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf#page=6)). In September 2026 ERCOT said it had paused approvals to energize data centers of 75 MW or more until a state audit and a review of their impact on local communities are complete ([source](https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf)). The gas turbine maker GE Vernova had a gas equipment backlog and reserved factory slots of 116 GW in mid-2026, against planned output of 20 GW a year from the third quarter ([source](https://www.gevernova.com/news/press-releases/ge-vernova-reports-second-quarter-2026-financial-results-raises-2026-financial)).
