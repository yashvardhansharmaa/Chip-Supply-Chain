# CHOKEPOINTS — Data schemas

All files are UTF-8 JSON, validated with `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" file.json` before you finish. Today's date is September 2026; use the newest figures you can source and record the year of each figure.

## 1. `data/landscape.json` — the AI accelerator landscape

An array of 16 to 20 chips. Cover, at minimum: Nvidia B200, Nvidia GB300 (B300), Nvidia Rubin (VR200), Nvidia H20 or its current China-market successor, AMD MI355X, AMD MI400 series, Google TPU v7 (Ironwood), Amazon Trainium 3, Microsoft Maia 200, Meta MTIA (latest), Intel Gaudi 3 or its successor, Cerebras WSE-3, Groq LPU, Huawei Ascend 910C and the announced Ascend 950/960, Cambricon (latest), plus any 2026 launches you find (for example the current Google, AWS or OpenAI/Broadcom parts).

```json
{
  "id": "nvidia-b200",
  "name": "B200",
  "family": "Blackwell",
  "vendor": "Nvidia",
  "vendorCountry": "US",
  "announced": "2024-03",
  "shipping": "2024-Q4",
  "status": "Shipping",
  "target": "Training and inference",
  "process": {"foundry": "TSMC", "node": "N4P (4NP)", "country": "TW"},
  "die": {"count": 2, "areaMm2Each": 800, "transistorsB": 208, "reticleLimited": true},
  "package": {"type": "CoWoS-L", "assembler": "TSMC", "sizeMm": "~110x110"},
  "memory": {"type": "HBM3E", "stacks": 8, "capacityGB": 192, "bandwidthTBs": 8, "suppliers": ["SK hynix", "Micron", "Samsung"]},
  "compute": {"fp16TFLOPS": 2250, "fp8TFLOPS": 4500, "fp4TFLOPS": 9000, "precisionNote": "dense, no sparsity"},
  "tdpW": 1000,
  "interconnect": {"chipToChip": "NVLink 5, 1.8 TB/s", "scaleUp": "NVL72 (72 GPUs)", "scaleOut": "InfiniBand / Spectrum-X Ethernet"},
  "systemIntegrators": ["Foxconn", "Quanta", "Wistron", "Supermicro", "Dell"],
  "priceEstimate": "$30,000-40,000 per GPU",
  "bomEstimate": "~$6,000-7,000 (die, HBM, CoWoS, substrate, test)",
  "exportStatus": "Controlled; not licensable to China under ECCN 3A090 as of 2026",
  "notes": "One or two sentences on what is distinctive about this part.",
  "layout": {
    "unit": "mm",
    "interposer": [85, 85],
    "dies": [{"x": -13, "y": 0, "w": 26, "h": 32}, {"x": 13, "y": 0, "w": 26, "h": 32}],
    "hbm": [{"x": -34, "y": 24, "w": 11, "h": 12}, {"x": -34, "y": 8, "w": 11, "h": 12}, {"x": -34, "y": -8, "w": 11, "h": 12}, {"x": -34, "y": -24, "w": 11, "h": 12}, {"x": 34, "y": 24, "w": 11, "h": 12}, {"x": 34, "y": 8, "w": 11, "h": 12}, {"x": 34, "y": -8, "w": 11, "h": 12}, {"x": 34, "y": -24, "w": 11, "h": 12}],
    "substrate": [110, 110]
  },
  "sources": [
    {"label": "Nvidia Blackwell architecture whitepaper", "url": "https://..."},
    {"label": "SemiAnalysis Blackwell teardown", "url": "https://..."}
  ]
}
```

Rules:
- `layout` drives a procedural 3D render of the package. Positions are centers in mm relative to the package center; `w` is along x, `h` along y. Approximate is fine; it must look right at a glance (die count, HBM count and arrangement, relative sizes). For wafer-scale parts (Cerebras) use `{"waferScale": true, "diameterMm": 300, "dieGrid": [12, 7]}` instead of `interposer/dies/hbm`. For parts with no HBM (Groq LPU, some inference ASICs) use an empty `hbm` array and note the SRAM in `memory.type`.
- Use `null` for unknown numbers. Never guess a spec. Put ranges in `priceEstimate`/`bomEstimate` strings.
- Each chip needs at least two sources, one of them the vendor's own spec page or whitepaper where one exists.

## 2. `data/suppliers.json` — the supplier database

An array of at least 130 firms across the whole chain. Aim for coverage, not just the famous names: include the Japanese materials firms, the Taiwanese substrate and OSAT firms, the German and Dutch subsystem makers, the Chinese domestic-substitution champions, and the systems and optics firms that matter for AI clusters.

```json
{
  "name": "Lasertec",
  "nativeName": "レーザーテック",
  "category": "Metrology and inspection",
  "subcategory": "EUV mask blank and pattern inspection",
  "country": "JP",
  "city": "Yokohama",
  "founded": 1960,
  "ticker": "6920.T",
  "ownership": "Public",
  "role": "Only supplier of actinic (EUV-wavelength) mask blank inspection tools; every EUV mask blank passes through a Lasertec system.",
  "chokepoint": "Critical",
  "shareNote": "~100% of actinic blank inspection (2025)",
  "customers": ["TSMC", "Samsung", "Intel", "Hoya", "AGC"],
  "aiRelevance": "Every EUV layer on an AI accelerator die depends on defect-free masks.",
  "revenueUSDb": 2.0,
  "revenueYear": 2025,
  "source": "https://..."
}
```

`category` must be one of exactly these strings:

- `Design and EDA`
- `IP and architecture`
- `Silicon and wafers`
- `Chemicals and gases`
- `Photoresist and materials`
- `Lithography`
- `Photomasks`
- `Deposition and etch`
- `Metrology and inspection`
- `Foundry`
- `Memory`
- `Advanced packaging and OSAT`
- `Substrates and PCBs`
- `Test`
- `Equipment subsystems and components`
- `Interconnect and networking`
- `Optics and photonics`
- `Systems and servers`
- `Power and cooling`
- `AI accelerator vendors`

`chokepoint` must be one of `Critical` (few or no substitutes worldwide), `Important` (2 to 4 credible suppliers), `Contested` (a challenger or domestic-substitution player), `Diversified` (many suppliers).

`country` is ISO-2 (`US`, `NL`, `JP`, `TW`, `KR`, `CN`, `DE`, `CH`, `GB`, `FR`, `IL`, `SG`, `MY`, `AT`, `IT`, `BE`).

Rules:
- `role` is one or two plain sentences that say what the firm actually makes and why it matters to AI chips.
- `shareNote` and `revenueUSDb` need a year. Use `null` if unknown.
- One `source` URL per firm that supports the role and share claim (company site, annual report, or a reputable analysis).
- Validate: no duplicate names, every category from the list, every country ISO-2.

## 3. `data/export-controls-timeline.json` — geopolitics timeline

An array of 25 to 45 events from 2018 to September 2026, in date order.

```json
{
  "date": "2022-10-07",
  "actor": "US (BIS)",
  "title": "October 7 rules",
  "summary": "BIS restricts exports to China of advanced computing chips (A100-class and above), supercomputer end uses, and semiconductor manufacturing equipment for logic below 16/14 nm, DRAM at 18 nm half-pitch and below, and NAND at 128 layers and above. Also restricts US persons from supporting advanced fabs in China.",
  "category": "US export control",
  "source": "https://www.federalregister.gov/..."
}
```

`category` one of: `US export control`, `Allied control` (Netherlands, Japan, Taiwan, Korea, Germany, UK), `China countermeasure`, `Industrial policy` (CHIPS Act, EU Chips Act, Japan Rapidus subsidies, China Big Fund), `Corporate` (TSMC Arizona, Samsung Taylor, Nvidia China SKUs, enforcement cases, smuggling prosecutions), `Other`.

## 4. `data/chokepoint-matrix.json` — country share by segment

The heart of the geopolitics view. For each segment, the share of global value (or capacity, say which) by country, with a source and year. Follow the structure CSET (Khan/Mann/Peterson 2021) and SIA/BCG used, updated to the newest data you can find (SIA/BCG 2024 "Emerging Resilience", SEMI, Yole, TrendForce, company reports).

```json
{
  "segment": "EUV lithography tools",
  "metric": "Revenue share",
  "year": 2025,
  "shares": {"NL": 100, "US": 0, "JP": 0, "TW": 0, "KR": 0, "CN": 0, "EU-other": 0, "Other": 0},
  "note": "ASML is the sole supplier. Zeiss (DE) and Trumpf (DE) supply optics and lasers; Cymer (US-owned by ASML) supplies DUV sources.",
  "source": "https://..."
}
```

Segments to cover (use these exact names): `EDA software`, `Core IP`, `Silicon wafers`, `Photoresist`, `Specialty gases`, `EUV lithography tools`, `DUV lithography tools`, `Deposition tools`, `Etch tools`, `Metrology & inspection tools`, `Photomasks`, `Leading-edge logic manufacturing (<10 nm)`, `Mature logic manufacturing (≥28 nm)`, `DRAM manufacturing`, `HBM`, `Advanced packaging (2.5D/3D)`, `OSAT (assembly & test)`, `IC substrates`, `AI accelerator design`, `Server assembly`.

Shares must sum to roughly 100 per segment. If the best available split is by firm rather than country, convert it and say so in `note`.
