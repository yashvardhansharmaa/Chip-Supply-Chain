---json
{
  "id": "data-centers-and-power",
  "number": 15,
  "title": "Data Centers and Power",
  "oneLiner": "The chips are no longer the slowest part of a data center buildout. A large transformer takes three years, turbine output does not reach 30 GW a year until 2030, and Texas has fifty times more large loads, mostly data centers, waiting to connect than it has approved to switch on.",
  "plain": "A data center's job is to feed electricity to the machines inside it and carry away the heat they give off. One rack of AI chips, a cabinet the size of a wardrobe, draws 142 kilowatts, and every watt of it comes back out as heat, more than air can carry away, so water is piped through the rack instead. A large training site already holds a hundred thousand chips, and the newest sites are planned in gigawatts. One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029. Getting that much electricity to the door is harder than putting up the building, because the transformers and heavy switches that connect a site to the grid, and the turbines that make the power, come from a few suppliers and take years to arrive.",
  "bridge": "Racks like that have to stand somewhere, and the somewhere has to be built around what they consume.",
  "specimen": "rack",
  "specimenCaption": "A liquid-cooled rack of 72 GPUs, Nvidia's GB200 NVL72. It is 2.24 m tall, 600 mm wide and about 1.36 metric tons: taller than a door, heavier than a small car, and drawing about 120 kW, roughly what a hundred homes use on average. Drawn to scale. The gray steel power shelves and the copper busbar they feed are picked out.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {
        "name": "GE Vernova",
        "country": "US",
        "share": "116 GW of gas equipment backlog and reserved factory slots at mid-2026"
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
        "note": "Hitachi group transformer manufacturing"
      }
    ],
    "chinaStatus": "China has spare generating capacity, a large domestic industry making transformers and switchgear, and can connect new sites quickly. Its AI buildout is limited by the supply of accelerators, and it has power to spare.",
    "usStatus": "The United States has the demand and the money but cannot shorten the wait for equipment. Transformers and turbines both take years to arrive. Most large power transformers are imported, and no restarted nuclear reactor is running yet.",
    "costSignal": "Transformer lead times of 36 months, against under a year before 2020; GE Vernova's gas backlog and reserved slots grew from 100 GW to 116 GW in 2026",
    "substitutability": {
      "band": "Moderate",
      "test": "Several approved vendors sell every piece of power and cooling equipment, but a transformer takes three years to arrive and GE Vernova's gas turbines have orders for about six years ahead.",
      "why": "Nothing in a data center's power and cooling has to be invented. Nine firms sell the power and cooling equipment for Nvidia's gigawatt data center designs, so a buyer can get the equipment and negotiate the price. Money cannot shorten the wait. A large power transformer now takes 36 months to arrive, against under a year before 2020. GE Vernova has close to six years of gas turbine orders waiting. New capacity is therefore two to five years away."
    }
  },
  "keyFacts": [
    {
      "fact": "A GB300 NVL72 rack draws up to 142 kW, fed by eight 33 kW power shelves",
      "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"
    },
    {
      "fact": "NVIDIA's 800-volt DC architecture is drawn for racks from 100 kW to over 1 MW, with megawatt racks from 2027, because the 54-volt distribution in today's racks hits physical limits past about 200 kW",
      "source": "https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/"
    },
    {
      "fact": "Nvidia's Kyber rack will hold 576 Rubin Ultra GPUs in 2027 on an 800-volt DC bus that carries over 150% more power through the same copper",
      "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"
    },
    {
      "fact": "US data centers used 176 TWh in 2023, 4.4% of US electricity, and are projected at 325 to 580 TWh by 2028, or 6.7% to 12%",
      "source": "https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/"
    },
    {
      "fact": "The five largest US data center operators spent $448.3B of capital in 2025; on that trend they reach $770B in 2026",
      "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"
    },
    {
      "fact": "ERCOT was tracking about 474 GW of large loads seeking interconnection in June 2026, about 90% of it data centers",
      "source": "https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf"
    },
    {
      "fact": "Only 9,042 MW of ERCOT large load had received Approval to Energize as of March 2026",
      "source": "https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf"
    },
    {
      "fact": "Large power transformer lead times of 36 months are commonly quoted and reach 60 months; before the pandemic an order took under a year, and 82% of units put into US service in 2019 were imported",
      "source": "https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf"
    },
    {
      "fact": "GE Vernova's gas power equipment backlog and slot reservations grew from 100 GW to 116 GW, with output rising from 20 GW a year in 2026 to 24 GW in 2028 and 30 GW in 2030",
      "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm"
    },
    {
      "fact": "EIA expects US electricity use to grow 1% in 2026 and 3% in 2027, the strongest four-year growth since 2000",
      "source": "https://www.eia.gov/pressroom/releases/press582.php"
    }
  ],
  "figures": [
    {"id": "power-in-heat-out", "type": "animation", "src": "power", "title": "Power in, heat out", "note": "Simplified diagram; sizes are illustrative. 142 kW is the most an Nvidia GB300 NVL72 rack draws; 45 °C is Nvidia's supply-water figure for its Vera Rubin racks; the megawatt racks from 2027 are Nvidia's plan."},
    {
      "id": "hyperscaler-capex",
      "type": "bars",
      "title": "Capital spending by the five largest US data center operators, 2025",
      "unit": "$B",
      "data": [
        [
          "Amazon",
          137.5
        ],
        [
          "Microsoft",
          88.0
        ],
        [
          "Alphabet",
          83.1
        ],
        [
          "Meta",
          72.5
        ],
        [
          "Oracle",
          40.6
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
      "title": "GE Vernova annual gas turbine output, actual and planned",
      "unit": "GW/yr",
      "data": [
        [
          "2026",
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
      "title": "US data center electricity use, actual and 2028 projection range",
      "unit": "TWh",
      "data": [
        [
          "2014",
          58
        ],
        [
          "2023",
          176
        ],
        [
          "2028 low case",
          325
        ],
        [
          "2028 high case",
          580
        ]
      ],
      "source": {
        "label": "Lawrence Berkeley National Laboratory, December 2024",
        "url": "https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/"
      }
    }
  ]
}
---
# Data Centers and Power

For thirty years the semiconductor industry set the pace and everything downstream followed. A wafer clears a leading-edge fab in months; a large power transformer takes three years, and before 2020 the same order took under one ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)).

## How it works

A data center's job is to feed electricity to the machines inside it and carry away the heat they give off. One rack of AI chips, a cabinet the size of a wardrobe, draws 142 kilowatts, and every watt of it comes back out as heat, more than air can carry away, so water is piped through the rack instead. A large training site already holds a hundred thousand chips, and the newest sites are planned in gigawatts. One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029. Getting that much electricity to the door is harder than putting up the building, because the transformers and heavy switches that connect a site to the grid, and the turbines that make the power, come from a few suppliers and take years to arrive.

{{figure:power-in-heat-out}}

A rack is now the unit of AI compute. A GB300 NVL72 draws up to 142 kW through eight 33 kW power shelves, the rack's own power supplies, more than ten times a conventional enterprise rack in the same floor area ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).

Between the grid and the rack, a substation steps the high voltage down with transformers. Switchgear, the building's heavy circuit breakers, can cut any part of the site off in a fault. Battery-backed supplies hold the load for the seconds it takes backup generators to start. Distribution boards split the feed among the rows of racks. At the back of each rack a busbar, a solid copper bar doing a job a cable would melt at, carries the current down to the trays. Every one of those is heavy equipment with its own lead time.

Heat leaves in water. Cold plates on the GPU packages pass it to a building loop that releases it outdoors, and Nvidia's Vera Rubin racks run 45 °C supply water, warm enough that many sites can skip chillers ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Nvidia is also moving rack distribution to 800 volts of direct current. Raising the voltage cuts the current for the same power, and heat in copper comes from current, so the same conductor carries over 150 percent more power and the 200 kg busbars feeding a single rack are no longer needed ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

## Variants and trade-offs

### Cooling

- **Air.** Heat exchangers in the rack door work at moderate densities but cannot carry away the heat of an AI rack.
- **Direct-to-chip liquid.** The default for anything Blackwell-class or later; every new AI hall is now plumbed for it.
- **Immersion.** Higher density still, but hard to service and barely used at scale.

Cooling is not the bottleneck. Nvidia names nine firms supplying data center power and cooling systems for its gigawatt reference designs, among them ABB, Eaton, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Rack power

Nvidia's 800-volt DC architecture is drawn for racks from 100 kW to more than a megawatt, with megawatt racks from 2027, because the 54-volt distribution in today's racks hits physical limits past about 200 kW ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

A megawatt rack changes the busbar, the floor loading, the coolant flow, the leak detection and the stored energy that carries the rack through a dip. Nvidia's Rubin racks hold 20 times more stored energy, to steady the draw as tens of thousands of GPUs enter and leave a training step together ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

- **Grid interconnection.** The slow path, and the one every announced campus is queued in.
- **Behind-the-meter gas**, generation on the site itself. The fast path, which is why campuses are sited next to gas.
- **Nuclear.** Almost entirely prospective. Constellation agreed to sell the output of the 835 MW Crane Clean Energy Center to Microsoft before restart work began ([source](https://www.constellationenergy.com/news/2025/constellation-ahead-of-schedule-for-launch-of-crane-clean-energy-center.html)). The plant shut in 2019 and is restarting on a $1 billion federal loan closed in November 2025, still subject to Nuclear Regulatory Commission approval ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). No restarted reactor is serving data centers yet.

## Who makes it

The largest data center operators pay for the buildout. Alphabet, Amazon, Meta, Microsoft and Oracle spent $448.3 billion of capital in 2025, and on that trend reach $770 billion in 2026 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)).

{{figure:hyperscaler-capex}}

Campuses are now described in gigawatts: OpenAI's Stargate portfolio targets more than 9 GW across US sites by 2029, with Abilene, Texas going from 0.3 GW to 1.2 GW by late 2026 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).

The equipment vendors are the constraint. GE Vernova, Siemens Energy, Hitachi Energy, ABB, Eaton and Schneider Electric supply the turbines, transformers and switchgear. GE Vernova's gas equipment backlog and reserved factory slots went from 100 GW to 116 GW inside 2026, with data center orders past $5 billion by mid-year, more than double the whole of 2025 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).

{{figure:turbine-output}}

## Capacity and demand

US data centers used 176 TWh in 2023, 4.4 percent of national electricity, and Lawrence Berkeley National Laboratory projects 325 to 580 TWh by 2028, between 6.7 percent and 12 percent of the total ([source](https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/)). The Energy Information Administration expects national electricity use to rise 1 percent in 2026 and 3 percent in 2027, the fourth straight annual increase and the strongest four-year run since 2000 ([source](https://www.eia.gov/pressroom/releases/press582.php)).

{{figure:us-dc-electricity}}

Chip efficiency keeps the low case plausible: Google's Ironwood TPU delivers twice the performance per watt of its predecessor ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). The energy per token, where a token is the chunk of text a model reads or writes, falls while total energy rises, because the number of tokens rises faster.

## The chokepoint

Announced capacity and energized capacity are a long way apart. ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large loads seeking a connection in June 2026, roughly 90 percent of it data centers ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). Only 9,042 MW had been approved to switch on ([source](https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf)).

Behind that queue sit the equipment lead times.

- **Large power transformers.** Thirty-six-month lead times are commonly quoted and the worst reach 60, against under a year before the pandemic; 82 percent of the units put into US service in 2019 were imported ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)).
- **Gas turbines.** GE Vernova will build 20 GW of turbines this year and is working toward 30 GW a year in 2030, against a backlog of 116 GW, close to six years of output ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Firm new generation**, the kind that runs whatever the weather. The one reactor restart with a data center buyer behind it, the 835 MW Crane plant, shut in 2019 and is still waiting on its license ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)).

The chip chain moves faster: foundry and memory capacity have repeatedly expanded within a couple of years of the order. Money buys silicon capacity faster than it buys power capacity, and that difference decides how much of the 2026 capital spending turns into working compute.

## Key evaluation criteria

- **Time to power** counts the months from signed lease to energized megawatt, and it is the number developers compete on.
- **Transformer and turbine lead time** covers the two queues that set the schedule, at three years ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)) and six years of booked output ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Rack density supported** decides what an existing hall can take. An air-cooled one cannot host a 142 kW NVL72 without a full mechanical retrofit ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Firmness of supply** separates a signed interconnection agreement from a delivered transformer.
- **Energy per token** is the only efficiency measure that matters commercially. It keeps falling, but the number of tokens rises faster ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

## Takeaways

The rack became the unit of AI compute at 142 kW and is heading for a megawatt by 2027 ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)), which forces liquid cooling and an 800-volt bus on every large operator ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Nine vendors sell the cooling equipment, so buying it is a question of price ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). The power equipment comes with queues: transformers take three years ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)), six years of turbine output is already booked ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)), and Texas has fifty times more large load in the queue than it has approved to switch on ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). When an AI buildout slips, the delay is usually in the substation yard.
