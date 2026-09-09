---json
{
  "id": "data-centers-and-power",
  "number": 16,
  "title": "Data Centers and Power",
  "oneLiner": "The chips are no longer the long pole. A large transformer takes three years, turbine output does not reach 30 GW a year until 2030, and Texas has fifty times more large load queued than it has approved to switch on.",
  "plain": "Picture a domestic hair dryer, about two kilowatts of heat pouring out of a hand-sized nozzle. One rack of AI chips draws seventy of them in a box the size of a wardrobe, and every watt turns into heat that has to be carried away in water rather than air. Feeding and cooling that box is what a modern data center does. The hard part is not the building. It is getting the electricity to the door, because the transformers, switchgear and turbines that connect a site to the grid are ordered years in advance, which is where an AI buildout now actually waits.",
  "specimen": "rack",
  "specimenCaption": "Right: a liquid-cooled 72-GPU rack. Eighteen compute trays above and below nine NVLink switch trays, a vertical busbar at the back, power shelves at the top and bottom, and cold-plate manifolds feeding every tray.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "GE Vernova", "country": "US", "share": "116 GW of gas power equipment backlog and slot reservations at mid-2026"},
      {"name": "Hitachi Energy", "country": "CH", "share": "Large power transformers and HV switchgear"},
      {"name": "Siemens Energy", "country": "DE", "share": "Grid technologies, transformers, turbines"},
      {"name": "Vertiv", "country": "US", "share": "Data center power and cooling systems; NVIDIA gigawatt AI factory partner"},
      {"name": "Schneider Electric", "country": "FR", "share": "Electrical distribution and cooling; NVIDIA 800 VDC ecosystem partner"}
    ],
    "countries": [
      {"code": "US", "note": "Most new AI capacity; ERCOT and PJM carry the load growth"},
      {"code": "CH", "note": "Hitachi Energy and ABB transformer and switchgear engineering"},
      {"code": "DE", "note": "Siemens Energy grid technologies and turbines"},
      {"code": "TW", "note": "Delta Electronics power shelves, busbars and thermal modules"},
      {"code": "JP", "note": "Hitachi group transformer manufacturing"}
    ],
    "chinaStatus": "Power is not China's binding constraint. It has surplus generation, a large domestic transformer and switchgear industry, and can energise sites quickly. Its AI buildout is limited by accelerator supply, not megawatts.",
    "usStatus": "Holds the demand and the capital but not the equipment lead times. Transformers and turbines are both multi-year queues, most large power transformers are imported, and no restarted reactor is running yet.",
    "costSignal": "Transformer lead times of 36 months, against under a year before 2020; GE Vernova's gas backlog and slot reservations grew from 100 GW to 116 GW in 2026",
    "substitution": {"years": "4-6", "why": "Large power transformer lead times of 36 months are commonly quoted and can reach 60, GE Vernova is building toward 30 GW of annual turbine output only by 2030, and the one reactor restart with a data center buyer behind it is still waiting on its licence."}
  },
  "keyFacts": [
    {"fact": "A GB300 NVL72 rack draws up to 142 kW, fed by eight 33 kW power shelves", "source": "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"},
    {"fact": "NVIDIA's 800 VDC architecture is drawn for racks from 100 kW to over 1 MW, with megawatt racks from 2027, because 54 VDC distribution hits physical limits past about 200 kW", "source": "https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/"},
    {"fact": "Nvidia's Kyber rack will hold 576 Rubin Ultra GPUs in 2027 on an 800 VDC bus that carries over 150% more power through the same copper", "source": "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin"},
    {"fact": "US data centers used 176 TWh in 2023, 4.4% of US electricity, and are projected at 325 to 580 TWh by 2028, or 6.7% to 12%", "source": "https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/"},
    {"fact": "The five largest US hyperscalers spent $448.3B of capex in 2025; on that trend they reach $770B in 2026", "source": "https://epoch.ai/data-insights/hyperscaler-capex-trend"},
    {"fact": "ERCOT was tracking about 474 GW of large loads seeking interconnection in June 2026, about 90% of it data centers", "source": "https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf"},
    {"fact": "Only 9,042 MW of ERCOT large load had received Approval to Energize as of March 2026", "source": "https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf"},
    {"fact": "Large power transformer lead times of 36 months are commonly quoted and reach 60 months; before the pandemic an order took under a year, and 82% of units put into US service in 2019 were imported", "source": "https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf"},
    {"fact": "GE Vernova's gas power equipment backlog and slot reservations grew from 100 GW to 116 GW, with output rising from 20 GW a year in 2026 to 24 GW in 2028 and 30 GW in 2030", "source": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm"},
    {"fact": "EIA expects US electricity use to grow 1% in 2026 and 3% in 2027, the strongest four-year growth since 2000", "source": "https://www.eia.gov/pressroom/releases/press582.php"}
  ],
  "figures": [
    {
      "id": "hyperscaler-capex",
      "type": "bars",
      "title": "Capital expenditure by hyperscaler, 2025",
      "unit": "$B",
      "data": [["Amazon", 137.5], ["Microsoft", 88.0], ["Alphabet", 83.1], ["Meta", 72.5], ["Oracle", 40.6]],
      "source": {"label": "Epoch AI, hyperscaler capex trend, February 2026, from company filings", "url": "https://epoch.ai/data-insights/hyperscaler-capex-trend"}
    },
    {
      "id": "turbine-output",
      "type": "bars",
      "title": "GE Vernova annual gas turbine output, actual and planned",
      "unit": "GW/yr",
      "data": [["2026", 20], ["2028", 24], ["2030", 30]],
      "source": {"label": "GE Vernova second-quarter 2026 results, July 2026", "url": "https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm"}
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

For thirty years the semiconductor industry set the pace and everything downstream followed. That has inverted. A wafer clears a leading-edge fab in months; a large power transformer takes three years, and before 2020 the same order took under one ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)).

## How it works

Picture a domestic hair dryer, about two kilowatts of heat pouring out of a hand-sized nozzle. One rack of AI chips draws seventy of them in a box the size of a wardrobe, and every watt turns into heat that has to be carried away in water rather than air. Feeding and cooling that box is what a modern data center does. The hard part is not the building. It is getting the electricity to the door, because the transformers, switchgear and turbines that connect a site to the grid are ordered years in advance, which is where an AI buildout now actually waits.

The unit of AI compute is no longer the server but the rack. A GB300 NVL72 draws up to 142 kW through eight 33 kW power shelves, more than ten times a conventional enterprise rack in the same floor area ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).

Everything else follows from that number. Utility power steps down through a substation, switchgear, uninterruptible supplies and distribution units before it reaches the rack busbar, each stage with its own lead time.

Heat leaves in water. Cold plates on the GPU packages pass it to a facility loop that rejects it outdoors, and Nvidia's Vera Rubin racks run 45 °C supply water, warm enough that many sites can skip chillers ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Nvidia is also moving rack distribution to 800 VDC, which pushes more than 150% more power through the same copper and retires the 200 kg busbars feeding a single rack ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

## Variants and trade-offs

### Cooling

- **Air.** Rear-door heat exchangers work at moderate densities but stop being economic well below AI rack loads.
- **Direct-to-chip liquid.** The default for anything Blackwell-class or later; every serious AI hall is now plumbed.
- **Immersion.** Higher density still, but poor serviceability and almost no installed base at hyperscale.

Cooling is not the bottleneck, because it has no shortage of sellers. Nvidia names nine firms supplying data center power and cooling systems for its gigawatt reference designs, among them ABB, Eaton, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Where a buyer can pick from nine names, price falls.

### Rack power

A GB300 NVL72 draws up to 142 kW today ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)). Nvidia's 800 VDC architecture is drawn for racks from 100 kW to more than a megawatt, with megawatt racks from 2027, because the 54 VDC distribution in today's racks hits physical limits past about 200 kW ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)).

A megawatt rack is not a bigger version of a 142 kW one. It changes the busbar, the floor loading, the coolant flow, the leak detection and the ride-through storage: Nvidia's Rubin racks carry 20 times more stored energy, to steady the draw as tens of thousands of GPUs enter and leave a training step together ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### Where the electrons come from

- **Grid interconnection.** The slow path, and the one every announced campus is queued in.
- **Behind-the-meter gas.** The fast path, which is why campuses are sited next to gas rather than next to fibre.
- **Nuclear.** Almost entirely prospective. The 835 MW Crane Clean Energy Center, sold forward to Microsoft before a spade went in ([source](https://www.constellationenergy.com/news/2025/constellation-ahead-of-schedule-for-launch-of-crane-clean-energy-center.html)), shut in 2019 and is restarting on a $1 billion federal loan closed in November 2025, still subject to Nuclear Regulatory Commission approval ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)). No restarted reactor is serving data centers yet.

## Who makes it

The hyperscalers pay for it. Alphabet, Amazon, Meta, Microsoft and Oracle spent $448.3 billion of capital expenditure in 2025, and on that trend reach $770 billion in 2026 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)).

{{figure:hyperscaler-capex}}

Campuses are now described in gigawatts: OpenAI's Stargate portfolio targets more than 9 GW across US sites by 2029, with Abilene, Texas going from 0.3 GW to 1.2 GW by late 2026 ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)).

The equipment vendors are the constraint. GE Vernova, Siemens Energy, Hitachi Energy, ABB, Eaton and Schneider Electric supply the turbines, transformers and switchgear, and the order books show what that scarcity is worth: GE Vernova's gas equipment backlog and slot reservations went from 100 GW to 116 GW inside 2026, with data center orders past $5 billion by mid-year, more than double the whole of 2025 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).

{{figure:turbine-output}}

## Capacity and demand

US data centers used 176 TWh in 2023, 4.4% of national electricity, and Lawrence Berkeley National Laboratory projects 325 to 580 TWh by 2028, between 6.7% and 12% of the total ([source](https://newscenter.lbl.gov/2025/01/15/berkeley-lab-report-evaluates-increase-in-electricity-demand-from-data-centers/)). The EIA expects national electricity use to rise 1% in 2026 and 3% in 2027, the fourth straight annual increase and the strongest four-year run since 2000 ([source](https://www.eia.gov/pressroom/releases/press582.php)). Supply is not growing at data center speed.

{{figure:us-dc-electricity}}

Chip efficiency keeps the low case plausible: Google's Ironwood TPU delivers twice the performance per watt of its predecessor ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)). Energy per token falls; total energy still rises, because token volume rises faster.

## The chokepoint

The gap between announced and energised capacity is the whole story. ERCOT was tracking about 474 GW of large loads seeking interconnection in June 2026, roughly 90% of it data centers ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). Only 9,042 MW had been approved to energise ([source](https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf)). A queue is not a grid.

Then the equipment, where the lead times bind.

- **Large power transformers.** Thirty-six-month lead times are commonly quoted and the worst reach 60, against under a year before the pandemic; 82% of the units put into US service in 2019 were imported ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)).
- **Gas turbines.** GE Vernova will build 20 GW of turbines this year and is working toward 30 GW a year in 2030, against a book of 116 GW ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). Six years of output is already spoken for.
- **Firm new generation.** The one reactor restart with a data center buyer behind it, the 835 MW Crane plant, shut in 2019 and is still waiting on its licence ([source](https://www.energy.gov/articles/energy-department-closes-loan-restart-nuclear-power-plant-pennsylvania)).

Set that against the chip chain, where foundry and HBM capacity have repeatedly expanded within a couple of years of the order. Silicon responds to capital in quarters, the power chain in half-decades, and that decides how much of the 2026 capex becomes compute.

## Key evaluation criteria

- **Time to power** — months from signed lease to energised megawatt. This is the number developers compete on.
- **Transformer and turbine lead time** — the two queues that set the schedule, at three years ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)) and six years of booked output ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)).
- **Rack density supported** — an air-cooled hall cannot host a 142 kW NVL72 without a full mechanical retrofit ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Firmness of supply** — a signed interconnection agreement and a delivered transformer are different assets.
- **Energy per token** — the only efficiency metric that matters commercially, and it is falling faster than demand is rising per unit of output ([source](https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack)).

## Takeaways

The rack became the unit of AI compute at 142 kW and is heading for a megawatt by 2027 ([source](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)), which forces liquid cooling and an 800 VDC bus on every serious operator ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Cooling is cheap to solve because nine vendors sell it ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Power is not: transformers take three years ([source](https://www.energy.gov/sites/default/files/2024-10/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf)), six years of turbine output is already booked ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)), and Texas has fifty times more large load in the queue than it has approved to switch on ([source](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). If an AI buildout slips, look in the substation yard, not the fab.
