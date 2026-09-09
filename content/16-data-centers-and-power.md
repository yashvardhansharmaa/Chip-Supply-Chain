---json
{
  "id": "data-centers-and-power",
  "number": 16,
  "title": "Data Centers and Power",
  "oneLiner": "The chips are no longer the long pole. Transformers take two years, turbine slots are sold out to 2030, and the interconnection queue is fifty times larger than what actually gets energised.",
  "plain": "Picture a domestic hair dryer, about two kilowatts of heat pouring out of a hand-sized nozzle. One rack of AI chips draws seventy of them in a box the size of a wardrobe, and every watt turns into heat that has to be carried away in water rather than air. Feeding and cooling that box is what a modern data center does. The hard part is not the building. It is getting the electricity to the door, because the transformers, switchgear and turbines that connect a site to the grid are ordered years in advance, which is where an AI buildout now actually waits.",
  "specimen": "rack",
  "specimenCaption": "Right: a liquid-cooled 72-GPU rack. Eighteen compute trays above and below nine NVLink switch trays, a vertical busbar at the back, power shelves at the top and bottom, and cold-plate manifolds feeding every tray.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "GE Vernova", "country": "US", "share": "~100 GW of gas turbines under contract; slots effectively sold out to 2030"},
      {"name": "Hitachi Energy", "country": "CH", "share": "Large power transformers and HV switchgear"},
      {"name": "Siemens Energy", "country": "DE", "share": "Grid technologies, transformers, turbines"},
      {"name": "Vertiv", "country": "US", "share": "Leads the data center liquid cooling market (2025)"},
      {"name": "Schneider Electric", "country": "FR", "share": "Top-5 liquid cooling and electrical distribution"}
    ],
    "countries": [
      {"code": "US", "note": "Most new AI capacity; ERCOT and PJM carry the load growth"},
      {"code": "CH", "note": "Hitachi Energy and ABB transformer and switchgear engineering"},
      {"code": "DE", "note": "Siemens Energy grid technologies and turbines"},
      {"code": "TW", "note": "Delta Electronics power shelves, busbars and thermal modules"},
      {"code": "JP", "note": "Hitachi group transformer manufacturing"}
    ],
    "chinaStatus": "Power is not China's binding constraint. It has surplus generation, a large domestic transformer and switchgear industry, and can energise sites quickly. Its AI buildout is limited by accelerator supply, not megawatts.",
    "usStatus": "Holds the demand and the capital but not the equipment lead times. Transformers, switchgear and turbines are all multi-year queues, and no new nuclear capacity is online yet.",
    "costSignal": "About $11.3M per MW of shell and core in 2026, plus up to $25M per MW for an AI fit-out",
    "substitution": {"years": "4-6", "why": "Large power transformers run 75 to 110 weeks, gas turbine slots are booked through 2030, and the first restarted reactor is not due until 2027."}
  },
  "keyFacts": [
    {"fact": "A GB300 NVL72 rack draws up to 142 kW, fed by eight 33 kW power shelves", "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"},
    {"fact": "Rack power runs about 150 kW for GB300, about 225 kW for Vera Rubin VR200 and about 660 kW for Rubin Ultra in 2H27", "source": "https://www.trendforce.com/presscenter/news/20260625-13121.html"},
    {"fact": "Nvidia's Kyber rack will hold 576 Rubin Ultra GPUs in 2027 on an 800 VDC bus that carries over 150% more power through the same copper", "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"},
    {"fact": "US data centers used 176 TWh in 2023, 4.4% of US electricity, and are projected at 325 to 580 TWh by 2028, or 6.7% to 12%", "source": "https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/"},
    {"fact": "The five largest US AI infrastructure spenders plan $660-690B of capex in 2026", "source": "https://futurumgroup.com/insights/ai-capex-2026-the-690b-infrastructure-sprint/"},
    {"fact": "ERCOT had more than 438 GW of proposed large loads in June 2026, about 89% of it data centers, against 5.9 GW actually energised", "source": "https://datacenterfrontier.com/energy/article/55401760/ercot-puts-texas-ai-megawatts-to-the-test"},
    {"fact": "Substation-class power transformers take 75 to 110 weeks in 2026, roughly 2.5 times pre-pandemic lead times, with no relief expected before 2028", "source": "https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026"},
    {"fact": "GE Vernova has about 100 GW of gas turbines under contract, roughly 20% tied to data centers, with only ~10 GW of slots left across 2029 and 2030", "source": "https://www.power-eng.com/gas/turbines/data-centers-drive-record-surge-in-ge-vernova-power-equipment-orders-as-turbine-slots-tighten-through-2030/"},
    {"fact": "Average global data center construction cost rose from $7.7M to $10.7M per MW between 2020 and 2025 and is forecast at $11.3M per MW in 2026, shell and core only; an AI tech fit-out can add up to $25M per MW", "source": "https://www.jll.com/en-us/insights/market-outlook/data-center-outlook"}
  ],
  "figures": [
    {
      "id": "hyperscaler-capex",
      "type": "bars",
      "title": "2026 capital expenditure plans, midpoint of guidance",
      "unit": "$B",
      "data": [["Amazon", 200], ["Alphabet", 180], ["Meta", 125], ["Microsoft", 120], ["Oracle", 50]],
      "source": {"label": "Futurum Group, February 2026, from Q4 2025 earnings", "url": "https://futurumgroup.com/insights/ai-capex-2026-the-690b-infrastructure-sprint/"}
    },
    {
      "id": "rack-power",
      "type": "bars",
      "title": "Power per rack, Nvidia rack-scale generations",
      "unit": "kW",
      "data": [["GB300 NVL72 (2025)", 150], ["Vera Rubin VR200 (2026)", 225], ["Rubin Ultra (2027)", 660]],
      "source": {"label": "TrendForce, June 2026 (approximate rack power by generation)", "url": "https://www.trendforce.com/presscenter/news/20260625-13121.html"}
    },
    {
      "id": "us-dc-electricity",
      "type": "bars",
      "title": "US data center electricity use, actual and 2028 projection range",
      "unit": "TWh",
      "data": [["2014", 58], ["2023", 176], ["2028 low case", 325], ["2028 high case", 580]],
      "source": {"label": "Lawrence Berkeley National Laboratory, December 2024", "url": "https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/"}
    }
  ]
}
---
# Data Centers and Power

For thirty years the semiconductor industry set the pace and everything downstream followed. That has inverted. A wafer clears a leading-edge fab in months; a substation-class power transformer takes 75 to 110 weeks, and there is a queue for it ([source](https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026)).

## How it works

Picture a domestic hair dryer, about two kilowatts of heat pouring out of a hand-sized nozzle. One rack of AI chips draws seventy of them in a box the size of a wardrobe, and every watt turns into heat that has to be carried away in water rather than air. Feeding and cooling that box is what a modern data center does. The hard part is not the building. It is getting the electricity to the door, because the transformers, switchgear and turbines that connect a site to the grid are ordered years in advance, which is where an AI buildout now actually waits.

The unit of AI compute is no longer the server but the rack. A GB300 NVL72 draws up to 142 kW through eight 33 kW power shelves, more than ten times a conventional enterprise rack in the same floor area ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).

Everything else follows from that number. Utility power arrives at transmission voltage and steps down through a substation, switchgear, uninterruptible supplies and distribution units before it reaches the rack busbar, each stage with its own lead time.

Heat leaves the rack in water. Cold plates sit on the GPU packages and a coolant distribution unit passes the heat to the facility loop, which rejects it outdoors. Nvidia's Vera Rubin racks run 45 °C supply water, warm enough that many sites can skip chillers altogether ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Voltage changes next. Nvidia is moving rack distribution to 800 VDC, which pushes more than 150% more power through the same copper and retires the 200 kg busbars feeding a single rack ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

## Variants and trade-offs

### Cooling

- **Air.** Rear-door heat exchangers work at moderate densities but stop being economic well below AI rack loads, because fan power and air volume both scale badly.
- **Direct-to-chip liquid.** The default for anything Blackwell-class or later; it adds 7% to 10% to construction cost but cuts the floor area needed per megawatt by 70% to 85% ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)).
- **Immersion.** Higher density still, but poor serviceability and almost no installed base at hyperscale.

The liquid cooling market is small relative to the compute it enables: about $4.8 billion in 2025, with Vertiv the leader at 11.3% and the top five holding only 35% between them ([source](https://www.gminsights.com/industry-analysis/data-center-liquid-cooling-market)). That fragmentation is why cooling is not the bottleneck.

### Rack power by generation

{{figure:rack-power}}

The GB200 class landed around 120 kW per rack, the Vera Rubin NVL72 exceeds 250 kW on GPUs rated at 1,800 to 2,300 W ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)), and the Kyber rack for Rubin Ultra is designed for about 600 kW ([source](https://introl.com/blog/nvidia-vera-rubin-gpu-600kw-racks-2027)) with 576 GPUs in 2027 ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

A 600 kW rack is not a bigger version of a 120 kW rack. It changes the busbar, the floor loading, the coolant flow, the leak detection and the ride-through storage: Nvidia's Rubin racks carry 20 times more stored energy, to steady the draw as tens of thousands of GPUs enter and leave a training step together ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

- **Grid interconnection.** The slow path, and the one every announced campus is queued in.
- **Behind-the-meter gas.** The fast path, which is why campuses are being sited next to gas rather than next to fibre.
- **Nuclear.** Almost entirely prospective: the 835 MW Crane Clean Energy Center restart under a 20-year Microsoft agreement targets 2027, and no new nuclear capacity is running for data centers yet ([source](https://www.datacenterfrontier.com/energy/article/55394098/nuclear-momentum-meets-the-megawatt-test)).

## Who makes it

The hyperscalers pay for it. The five largest have guided to a combined $660 to $690 billion of capital expenditure in 2026 ([source](https://futurumgroup.com/insights/ai-capex-2026-the-690b-infrastructure-sprint/)), against $448.2 billion spent by the same five in 2025 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)).

{{figure:hyperscaler-capex}}

Campuses are now described in gigawatts. OpenAI's Stargate portfolio targets more than 9 GW across US sites by 2029, with Abilene, Texas going from 0.3 GW today to 1.2 GW by the fourth quarter of 2026 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). Outside the US it is concentrating in the Gulf, in Johor and in the Nordic and Irish sites where interconnection is still available.

The equipment vendors are the constraint: GE Vernova, Siemens Energy, Hitachi Energy, ABB, Eaton and Schneider Electric supply the turbines, transformers and switchgear, and all are sold out well into the second half of the decade.

## Capacity and cost

An air-cooled Tier III facility costs $8 million to $14 million per critical IT megawatt in 2026, a liquid-cooled one $17 million to $25 million. Power infrastructure is 40% to 45% of that hard cost, cooling 15% to 20%, the shell and site only 12% to 15% ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)). The building is the cheap part.

The silicon dwarfs it. In a 20 MW AI hall the GPUs cost $500 million to $1 billion against $200 million to $300 million for the building, and they depreciate over three to five years against 15 to 30 for the facility ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)). Compute is most of the capital and nearly all of the reinvestment risk.

{{figure:us-dc-electricity}}

US data centers consumed 176 TWh in 2023, 4.4% of national electricity and up from 58 TWh in 2014, and Lawrence Berkeley National Laboratory projects 325 to 580 TWh by 2028, between 6.7% and 12% of the total ([source](https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/)). National generation grows 1.7% in 2026, and the new load lands in the ERCOT and PJM footprints ([source](https://www.utilitydive.com/news/energy-short-term-outlook-2026-load-demand-data-centers/807530/)).

Chip efficiency keeps the low case plausible: Google's Ironwood TPU delivers twice the performance per watt of its predecessor and 30 times that of its 2018 part ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). Energy per token falls; total energy still rises, because token volume rises faster.

## The chokepoint

The gap between announced and energised capacity is the whole story. ERCOT had more than 438 GW of proposed large loads in June 2026, about 89% of it data centers, against 5.9 GW energised and 3.2 GW approved but not yet running ([source](https://datacenterfrontier.com/energy/article/55401760/ercot-puts-texas-ai-megawatts-to-the-test)). A queue is not a grid.

Utilities are converting some of it slowly. Southern Company had 17 GW of signed large-load contracts running through the mid-2030s against just over 1.2 GW of operating data center load, and new generation costs about $2 billion per gigawatt and arrives around 2031 ([source](https://datacenterfrontier.com/energy/article/55398810/southerns-17-gw-pipeline-puts-ai-power-demand-into-utility-math)).

Then the equipment, where the lead times bind.

- **Substation-class transformers.** 75 to 110 weeks, roughly 2.5 times pre-pandemic lead times, with no meaningful relief expected before 2028 ([source](https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026)).
- **Switchgear and generators.** Medium-voltage switchgear runs 52 to 80 weeks and large diesel generators 50 to 78 weeks ([source](https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026)).
- **Gas turbines.** GE Vernova holds about 100 GW under contract, roughly 20% of it tied to data centers, with only about 10 GW of delivery slots left across 2029 and 2030 combined ([source](https://www.power-eng.com/gas/turbines/data-centers-drive-record-surge-in-ge-vernova-power-equipment-orders-as-turbine-slots-tighten-through-2030/)).

Set that against the chip chain, where foundry and HBM capacity have repeatedly expanded within a couple of years of the order. Silicon responds to capital in quarters, the power chain in half-decades, and that asymmetry decides how much of the 2026 capex becomes compute.

## Key evaluation criteria

- **Time to power** — months from signed lease to energised megawatt. This is the number developers actually compete on.
- **Cost per critical IT megawatt** — $8-14M air-cooled, $17-25M liquid-cooled in 2026 ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)).
- **Rack density supported** — an air-cooled hall cannot host a 142 kW NVL72 without a full mechanical retrofit ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Firmness of supply** — a signed interconnection agreement and a delivered transformer are different assets.
- **Energy per token** — the only efficiency metric that matters commercially, and it is falling faster than total demand is rising per unit of output ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

## Takeaways

The rack became the unit of AI compute around 120 kW and is heading to 600 kW by 2027 ([source](https://introl.com/blog/nvidia-vera-rubin-gpu-600kw-racks-2027)), which forces liquid cooling and an 800 VDC bus on every serious operator ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Cooling is fragmented and therefore cheap to solve ([source](https://www.gminsights.com/industry-analysis/data-center-liquid-cooling-market)). Power is not: transformers take two years ([source](https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026)), turbine slots are gone to 2030 ([source](https://www.power-eng.com/gas/turbines/data-centers-drive-record-surge-in-ge-vernova-power-equipment-orders-as-turbine-slots-tighten-through-2030/)), and interconnection queues run fifty times larger than what gets energised ([source](https://datacenterfrontier.com/energy/article/55401760/ercot-puts-texas-ai-megawatts-to-the-test)). If an AI buildout slips, look in the substation yard, not the fab.
