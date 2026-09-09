---json
{
  "id": "data-centers-and-power",
  "number": 16,
  "title": "Data Centers and Power",
  "oneLiner": "The chips are no longer the long pole. Transformers take two years, turbine slots are sold out to 2030, and the interconnection queue is fifty times larger than what actually gets energised.",
  "specimen": "rack",
  "specimenCaption": "Right: a liquid-cooled 72-GPU rack. Eighteen compute trays above and below nine NVLink switch trays, a vertical busbar at the back, power shelves at the top and bottom, and cold-plate manifolds feeding every tray.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "GE Vernova", "country": "US", "share": "~100 GW of gas turbines under contract; slots effectively sold out to 2030"},
      {"name": "Hitachi Energy", "country": "CH", "share": "Large power transformers and HV switchgear"},
      {"name": "Siemens Energy", "country": "DE", "share": "Grid technologies, transformers, turbines"},
      {"name": "Vertiv", "country": "US", "share": "11.3% of data center liquid cooling (2025)"},
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
    "costSignal": "$8-14M per critical IT MW air-cooled, $17-25M per MW liquid-cooled (2026)",
    "substitution": {"years": "4-6", "why": "Large power transformers run 75 to 110 weeks, gas turbine slots are booked through 2030, and the first restarted reactor is not due until 2027."}
  },
  "keyFacts": [
    {"fact": "A GB300 NVL72 rack draws up to 142 kW, fed by eight 33 kW power shelves", "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"},
    {"fact": "Nvidia's Kyber rack will hold 576 Rubin Ultra GPUs in 2027 on an 800 VDC bus that carries over 150% more power through the same copper", "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"},
    {"fact": "US data centers used 176 TWh in 2023, 4.4% of US electricity, and are projected at 325 to 580 TWh by 2028, or 6.7% to 12%", "source": "https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/"},
    {"fact": "The five largest US AI infrastructure spenders plan $660-690B of capex in 2026, up from about $380B in 2025", "source": "https://futurumgroup.com/insights/ai-capex-2026-the-690b-infrastructure-sprint/"},
    {"fact": "ERCOT had more than 438 GW of proposed large loads in June 2026, about 89% of it data centers, against 5.9 GW actually energised", "source": "https://datacenterfrontier.com/energy/article/55401760/ercot-puts-texas-ai-megawatts-to-the-test"},
    {"fact": "Large power transformers take 75 to 110 weeks in 2026 versus roughly 16 to 20 weeks before 2020, with no relief expected before 2028", "source": "https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026"},
    {"fact": "GE Vernova has about 100 GW of gas turbines under contract, roughly 20% tied to data centers, with only ~10 GW of slots left across 2029 and 2030", "source": "https://www.power-eng.com/gas/turbines/data-centers-drive-record-surge-in-ge-vernova-power-equipment-orders-as-turbine-slots-tighten-through-2030/"},
    {"fact": "In a 20 MW AI hall the GPUs cost $500M to $1B while the building costs $200M to $300M", "source": "https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs"}
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
      "data": [["GB200 NVL72 (2024)", 120], ["Vera Rubin NVL72 (2026)", 130], ["Rubin Ultra Kyber NVL576 (2027)", 600]],
      "source": {"label": "Introl, September 2025", "url": "https://introl.com/blog/nvidia-vera-rubin-gpu-600kw-racks-2027"}
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

For thirty years the semiconductor industry set the pace and everything downstream followed. That has inverted. A wafer clears a leading-edge fab in a matter of months. A substation-class power transformer now takes 75 to 110 weeks, and there is a queue for it ([source](https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026)). This chapter is about the layer that now decides how fast AI capacity actually arrives.

## How it works

The unit of AI compute is no longer the server. It is the rack. A GB300 NVL72 is a single 72-GPU machine that draws up to 142 kW through eight 33 kW power shelves, each holding six 5.5 kW supplies ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). That is more than an order of magnitude above a conventional enterprise rack, in the same floor area.

Everything else in the building follows from that number. Utility power arrives at transmission voltage, drops through a substation and medium-voltage switchgear, passes uninterruptible power supplies and power distribution units, then reaches the rack busbar. Each conversion loses a few percent and needs its own equipment with its own lead time.

Heat leaves the rack in water, not air. Cold plates sit directly on the GPU and CPU packages, a manifold gathers the flow, and a coolant distribution unit exchanges heat between that closed technical loop and the facility water loop, which finally rejects heat through chillers, dry coolers or evaporative towers. Nvidia's Vera Rubin racks are fully liquid-cooled and run 45 °C supply water, warm enough that many sites can reject heat without mechanical chillers ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Voltage is the next thing to change. Nvidia is moving rack distribution to 800 VDC, which pushes more than 150% more power through the same copper and removes the need for 200 kg busbars feeding a single rack ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

## Variants and trade-offs

### Cooling

Air cooling with rear-door heat exchangers still works at moderate densities, but it stops being economic well below AI rack loads because fan power and air volume both scale badly. Direct-to-chip liquid cooling handles today's densities and is the default for anything Blackwell-class or later. Immersion goes further but has poor serviceability and almost no installed base at hyperscale.

The liquid cooling market is still small relative to the compute it enables: about $4.8 billion in 2025 growing to roughly $6 billion in 2026, with Vertiv the leader at 11.3% share and the top five suppliers, Schneider Electric, Vertiv, Rittal, Stulz and Boyd, holding only 35% between them ([source](https://www.gminsights.com/industry-analysis/data-center-liquid-cooling-market)). Motivair, CoolIT, Asetek and Delta Electronics fill out the coolant distribution unit and cold plate supply. This is a fragmented business, which is why it is not the bottleneck.

Liquid cooling adds 7% to 10% to construction cost but cuts the floor area needed per megawatt by 70% to 85% ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)). For an AI site where land and shell are cheap relative to power, that trade is easy.

### Rack power by generation

{{figure:rack-power}}

The GB200 class landed around 120 kW per rack, Vera Rubin sits at roughly 120 to 130 kW, and the Kyber rack for Rubin Ultra is designed for about 600 kW ([source](https://introl.com/blog/nvidia-vera-rubin-gpu-600kw-racks-2027)). Nvidia has confirmed Kyber will carry 576 Rubin Ultra GPUs across up to 18 compute blades per chassis in 2027 ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Facilities being designed today are already being specified for GPU racks above 250 kW ([source](https://datacenterfrontier.com/sponsored/article/55400568/installing-cooling-that-scales)).

A 600 kW rack is not a bigger version of a 120 kW rack. It changes the busbar, the floor loading, the coolant flow rate, the leak detection strategy and the ride-through energy storage. Nvidia's Rubin racks carry 20 times more energy storage than their predecessors precisely to keep the draw steady as tens of thousands of GPUs enter and leave a synchronous training step together ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

Grid interconnection is the slow path. Behind-the-meter gas is the fast one, which is why campuses are being sited next to gas rather than next to fibre. Nuclear is the reputationally attractive one and is almost entirely prospective: the Crane Clean Energy Center restart of 835 MW under a 20-year Microsoft agreement targets 2027, Google's Kairos Hermes 2 deal through TVA is up to 50 MW by 2030 on a pathway to 500 MW by 2035, and no new nuclear capacity is operating for data centers yet ([source](https://www.datacenterfrontier.com/energy/article/55394098/nuclear-momentum-meets-the-megawatt-test)).

## Who makes it

The hyperscalers pay for it. Amazon has guided to about $200 billion of capex in 2026, Alphabet $175 to $185 billion, Meta $115 to $135 billion, Microsoft $120 billion or more and Oracle around $50 billion, for a combined $660 to $690 billion against roughly $380 billion in 2025 ([source](https://futurumgroup.com/insights/ai-capex-2026-the-690b-infrastructure-sprint/)).

{{figure:hyperscaler-capex}}

The campuses are getting large enough to be described in gigawatts rather than megawatts. OpenAI's Stargate portfolio targets more than 9 GW across US sites by 2029, with Abilene, Texas going from 0.3 GW today to 1.2 GW by the fourth quarter of 2026 and Doña Ana County, New Mexico planned at 2.2 GW ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). Meta's Hyperion in Louisiana, xAI's Colossus in Memphis and Microsoft's Fairwater sites are on similar trajectories. Outside the US, the buildout is concentrating in the UAE and Saudi Arabia, in Johor across the strait from Singapore, and in a handful of Nordic and Irish sites where interconnection is still available.

The equipment vendors are the constraint. GE Vernova, Siemens Energy, Hitachi Energy, ABB, Eaton and Schneider Electric supply the turbines, transformers and switchgear, and all of them are sold out well into the second half of the decade.

## Capacity and cost

An air-cooled Tier III facility costs $8 million to $14 million per critical IT megawatt in 2026; a liquid-cooled one costs $17 million to $25 million ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)). Within that hard construction cost, power infrastructure is 40% to 45%, cooling 15% to 20%, and the shell and site only 12% to 15% ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)). The building is the cheap part.

The silicon dwarfs both. In a 20 MW AI hall the GPUs cost $500 million to $1 billion while the building costs $200 million to $300 million, and the equipment depreciates over three to five years against a facility amortised over 15 to 30 ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)). On those figures the compute is roughly two thirds to three quarters of the capital and nearly all of the reinvestment risk.

{{figure:us-dc-electricity}}

US data centers consumed 176 TWh in 2023, or 4.4% of national electricity, up from 58 TWh in 2014, and Lawrence Berkeley National Laboratory projects 325 to 580 TWh by 2028, between 6.7% and 12% of the total ([source](https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/)). The EIA's December 2025 outlook put 2026 US generation at 4,327 billion kWh, growth of 1.7%, concentrated in the ERCOT and PJM footprints where the data centers cluster ([source](https://www.utilitydive.com/news/energy-short-term-outlook-2026-load-demand-data-centers/807530/)).

Efficiency is improving fast at the chip level, which is what keeps the low case plausible. Google's Ironwood TPU delivers twice the performance per watt of its predecessor and about 30 times that of its 2018 part ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). Energy per token falls with every generation. Total energy still rises, because token volume rises faster.

## The chokepoint

The gap between announced and energised capacity is the whole story. ERCOT had more than 438 GW of proposed large loads in June 2026, about 89% of it data centers, against 5.9 GW of large load actually energised and 3.2 GW approved but not yet running ([source](https://datacenterfrontier.com/energy/article/55401760/ercot-puts-texas-ai-megawatts-to-the-test)). By August 2026 the figure cited by the Texas governor had reached roughly 474 GW ([source](https://datacenterfrontier.com/energy/article/55401760/ercot-puts-texas-ai-megawatts-to-the-test)). A queue is not a grid.

Utilities are converting some of it. Southern Company had 17 GW of large-load contracts signed through the mid-2030s, another 8 GW in late-stage development and a prospective pipeline above 75 GW, against just over 1.2 GW of operating data center load, with data center consumption up 55% year over year ([source](https://datacenterfrontier.com/energy/article/55398810/southerns-17-gw-pipeline-puts-ai-power-demand-into-utility-math)). New generation runs about $2 billion per gigawatt and would enter service around 2031 or 2032 ([source](https://datacenterfrontier.com/energy/article/55398810/southerns-17-gw-pipeline-puts-ai-power-demand-into-utility-math)).

Then the equipment. Substation-class power transformers run 75 to 110 weeks against a pre-2020 norm near 16 to 20 weeks, medium-voltage switchgear 52 to 80 weeks, and large diesel generators 50 to 78 weeks, with no meaningful relief expected before 2028 ([source](https://terrapincg.com/news/switchgear-transformer-generator-lead-times-2026)). GE Vernova has roughly 100 GW of gas turbines under contract, about 20% of it tied to data centers, and only about 10 GW of delivery slots left across 2029 and 2030 combined against annualised output near 20 GW ([source](https://www.power-eng.com/gas/turbines/data-centers-drive-record-surge-in-ge-vernova-power-equipment-orders-as-turbine-slots-tighten-through-2030/)).

Set that against the chip chain, where foundry and HBM capacity have repeatedly been expanded within a couple of years of the order being placed. Silicon responds to capital in quarters. The power chain responds in half-decades. That asymmetry, not wafer supply, is what will decide how much of the 2026 capex actually becomes running compute.

## Key evaluation criteria

- **Time to power** — months from signed lease to energised megawatt. This is the number developers actually compete on.
- **Cost per critical IT megawatt** — $8-14M air-cooled, $17-25M liquid-cooled in 2026 ([source](https://www.globaldatacenterhub.com/p/what-a-data-center-actually-costs)).
- **Rack density supported** — an air-cooled hall cannot host a 142 kW NVL72 without a full mechanical retrofit ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Firmness of supply** — a signed interconnection agreement and a delivered transformer are different assets.
- **Energy per token** — the only efficiency metric that matters commercially, and it is falling faster than total demand is rising per unit of output ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

## Takeaways

The rack became the unit of AI compute somewhere around 120 kW, and it is heading to 600 kW by 2027, which forces liquid cooling and an 800 VDC bus on every serious operator. Cooling is fragmented and therefore cheap to solve. Power is not: transformers take two years, turbine slots are gone to 2030, and interconnection queues run fifty times larger than what gets energised. If an AI buildout slips, look for the delay in the substation yard, not the fab.
