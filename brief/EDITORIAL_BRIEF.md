# CHOKEPOINTS — Editorial brief for chapter writers

**Working title:** *Chokepoints — A deep dive on the AI chip supply chain*
**Model:** the site is a companion to *Humanity's Last Machine* (humanityslastmachine.com), which mapped humanoid-robot hardware component by component. We are doing the same for the hardware that makes AI chips: every stage from sand to a rack in a data center, with a 3D "specimen" of that stage rendered next to the text as the reader scrolls.
**Today's date:** September 2026. Search for the newest figures. Anything from 2023 or earlier needs a "(as of YEAR)" tag or a fresher source.

## The three questions every chapter answers

1. **How does this stage work?** First-principles explanation an engineer or investor can follow. Explain the physics or process just enough that the trade-offs make sense.
2. **Where do the real trade-offs and bottlenecks sit?** Which variants exist, what each one buys you, what it costs, what limits it.
3. **Who controls it, and how hard is it to replace?** Market shares, geography, the handful of firms that matter, China's position, the time and money required to build a substitute.

Write for a smart reader who has never been inside a fab. Assume they know what a GPU is and roughly what a transistor does. Do not assume they know what a photoresist or an interposer is.

## Voice and style

- Direct, engineering-first, unhurried. Short paragraphs. One idea per paragraph.
- Opinionated where the evidence supports it ("this is the single hardest bottleneck in the chain"), hedged where it does not ("estimates range from X to Y").
- Concrete over abstract: name the machine, the material, the firm, the city, the price.
- No hype words ("revolutionary", "game-changing"). No filler openers. No rhetorical questions in a row.
- Plain sentences. No em dashes. Avoid parentheticals except for units and short clarifications.
- Numbers get sources. If a number has no source, do not write the number.
- Prefer primary sources: company filings and investor decks, ASML/TSMC/SK hynix/Micron/Applied/Lam/KLA reports, BIS Federal Register rules, CSET, SIA/BCG, SEMI, Yole, TrendForce, TechInsights, SemiAnalysis, Epoch AI, CSIS, Reuters, Bloomberg, Nikkei Asia, Financial Times, DigiTimes.
- Start from the CSET canon and build outward: Khan/Mann/Peterson "The Semiconductor Supply Chain: Assessing National Competitiveness" (2021), Khan/Mann "AI Chips: What They Are and Why They Matter" (2020), Khan/Mann/Peterson "Securing Semiconductor Supply Chains" (2021), Hunt/Khan/Peterson "China's Progress in Semiconductor Manufacturing Equipment" (2021), Khan "Maintaining the AI Chip Competitive Advantage of the United States and its Allies" (2019), CSET/ETO "Supply Chain Explorer" (chipexplorer.eto.tech), CSET work on export controls by Feldgoise, Dohmen, Hunt and others (2022–2026), plus SIA/BCG "Strengthening the Global Semiconductor Supply Chain in an Uncertain Era" (2021) and its 2024 update "Emerging Resilience in the Semiconductor Supply Chain", and Chris Miller's *Chip War* (2022). Then go to 2025–2026 sources for current numbers.

## Citation format (strict)

Put the citation immediately after the sentence or table it supports, in this exact form:

`([source](https://full.url/here))`

One URL per citation. Multiple citations in a row are fine: `([source](url1)) ([source](url2))`. Never write "according to sources" without a link. Never cite Wikipedia as the only source for a number. Never cite an image search result or a gstatic thumbnail.

## Chapter file format

Each chapter is one markdown file at `content/NN-slug.md`. It starts with a JSON front matter block, then the markdown body.

````
---json
{
  "id": "lithography",
  "number": 5,
  "title": "Lithography",
  "oneLiner": "The single most concentrated stage in the chain. One firm in the Netherlands makes every EUV scanner on Earth.",
  "specimen": "euv-scanner",
  "specimenCaption": "Right: an EUV scanner in cross-section. Tin plasma source at the bottom left, collector mirror, reticle stage at the top, six-mirror projection optics, wafer stage at the bottom right.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "ASML", "country": "NL", "share": "100% of EUV, ~90% of DUV immersion"},
      {"name": "Nikon", "country": "JP", "share": "~8% of DUV"},
      {"name": "Canon", "country": "JP", "share": "i-line/KrF, nanoimprint"}
    ],
    "countries": [
      {"code": "NL", "note": "ASML final assembly, Veldhoven"},
      {"code": "DE", "note": "Zeiss optics, Oberkochen; Trumpf lasers"},
      {"code": "US", "note": "Cymer light sources, San Diego"}
    ],
    "chinaStatus": "No EUV. SMEE's best DUV tool is ~28 nm-class; SMIC reaches 7/5 nm with imported immersion DUV and multipatterning.",
    "usStatus": "No domestic scanner maker. Controls EUV access through Dutch export licensing and US-origin subsystems.",
    "costSignal": "~€200M per Low-NA EUV tool, ~€380M per High-NA tool",
    "substitution": {"years": "10+", "why": "Zeiss mirror polishing and Cymer/Trumpf source know-how took ~20 years and ~€10B of R&D to reach production."}
  },
  "keyFacts": [
    {"fact": "ASML shipped 42 EUV systems in 2024", "source": "https://..."},
    {"fact": "High-NA EXE:5200 list price ~€380M", "source": "https://..."}
  ],
  "figures": [
    {
      "id": "litho-share",
      "type": "bars",
      "title": "Lithography tool revenue share, 2025",
      "unit": "%",
      "data": [["ASML", 83], ["Nikon", 9], ["Canon", 8]],
      "source": {"label": "Company reports via TechInsights", "url": "https://..."}
    },
    {
      "id": "euv-shipments",
      "type": "bars",
      "title": "EUV systems shipped per year",
      "unit": "tools",
      "data": [["2019", 26], ["2020", 31], ["2021", 42], ["2022", 40], ["2023", 53], ["2024", 42], ["2025", 46]],
      "source": {"label": "ASML annual reports", "url": "https://..."}
    },
    {
      "id": "litho-geo",
      "type": "stack",
      "title": "Where lithography value is captured",
      "unit": "%",
      "data": [["Netherlands", 60], ["Germany", 20], ["United States", 12], ["Japan", 8]],
      "source": {"label": "...", "url": "https://..."}
    }
  ]
}
---
# Lithography

Opening paragraph that states the stakes in two or three sentences.

## How it works
...
## Variants and trade-offs
### Deep ultraviolet (DUV)
...
### Extreme ultraviolet (EUV)
...
{{figure:euv-shipments}}
## Who makes it
...
{{figure:litho-share}}
## The chokepoint
...
## Key evaluation criteria
- **Resolution** — ...
- **Throughput** — wafers per hour, ...
## Takeaways
Two to four sentences. What a reader should remember.
````

### Rules for the front matter

- `card.concentration`: one of `Extreme`, `High`, `Moderate`, `Low`.
- `card.chokepointScore`: 1 (many substitutes) to 5 (single point of failure).
- `card.leaders`: 2 to 5 firms with a short share string and ISO-2 country code.
- `card.countries`: 2 to 5 countries where this stage's value is captured or where the tools/materials are physically made.
- `card.substitution.years`: a string like `"3-5"` or `"10+"`, with a one-sentence `why`.
- `keyFacts`: 4 to 8 headline numbers with sources. These are used for cross-checking between chapters, so include the ones you rely on most.
- `figures`: 1 to 3 figures. Types: `bars` (horizontal bars, values with a unit), `stack` (a 100% share bar, values should sum to ~100), `timeline` (data is `[["2022-10-07", "Label"], ...]`). Every figure needs a source. Do not invent data to fill a chart; if the only good data is older, say so in the title ("..., 2023").

### Rules for the body

- Length: 1,300 to 1,900 words of body text per chapter (not counting front matter).
- Headings: exactly one `#` (the chapter title). Use `##` for the six standard sections in this order: How it works / Variants and trade-offs / Who makes it / The chokepoint / Key evaluation criteria / Takeaways. Use `###` for variants. You may add one or two extra `##` sections if the stage needs it (for example "Capacity and cost" for foundries).
- Tables: GitHub-style pipe tables are supported. Use them for comparisons of variants and for market-share tables. Cite the table in the line after it.
- Bold the first phrase of each bullet in "Key evaluation criteria".
- Place each `{{figure:id}}` marker on its own line where the figure belongs.
- Name products precisely and consistently: Nvidia B200 / B300 / GB300 NVL72 / Rubin (VR200); AMD MI355X / MI400; TSMC N3 / N2 / A16; Intel 18A / 14A; Samsung SF2; HBM3E / HBM4; CoWoS-S / CoWoS-L / SoIC; Low-NA EUV (NXE:3800E) / High-NA EUV (EXE:5200B).
- If a stage's importance to *AI chips specifically* differs from its importance to chips in general, say so. This site is about the chips that run AI training and inference, so weight HBM, CoWoS, N3/N2-class logic, and the systems around them.
- Cross-reference other chapters by name when useful ("see Advanced packaging"). Do not duplicate another chapter's core content; a short pointer is enough.
- End with Takeaways. No sign-off, no "in conclusion".

## What "thoroughly researched" means here

- Open and read the actual sources. Do not write from memory alone; the numbers move every quarter.
- For each stage, find: current market shares by firm and by country, current capacity or shipment numbers, current price of the key tool or material, the newest generation and the next one on the roadmap, China's best domestic alternative and where it stands, and what export controls touch this stage.
- When two good sources disagree, give the range and cite both.
- Record the year of every figure. "ASML has ~90% share" is not enough; "ASML had ~90% of DUV immersion revenue in 2025" with a link is.
- Budget your effort: 60% research, 40% writing. A shorter chapter with airtight numbers beats a long one with soft ones.

## Chapter list and specimens

| # | slug | title | specimen shown next to the text |
|---|------|-------|-------------------------------|
| 01 | introduction-and-goals | Introduction and Goals | `package` (an AI accelerator: two logic dies and eight HBM stacks on an interposer) |
| 02 | design-and-eda | Chip Design, EDA and IP | `die-floorplan` (a GPU die floorplan) |
| 03 | silicon-and-wafers | Silicon and Wafers | `boule-and-wafer` (a Czochralski ingot and a 300 mm wafer) |
| 04 | chemicals-gases-and-photoresist | Chemicals, Gases and Photoresist | `gas-cabinet` (gas cylinders and a chemical delivery cabinet) |
| 05 | lithography | Lithography | `euv-scanner` (an EUV scanner in cross-section) |
| 06 | photomasks-and-pellicles | Photomasks and Pellicles | `photomask` (a reticle with a pellicle frame) |
| 07 | deposition-and-etch | Deposition and Etch | `process-chamber` (a vacuum chamber with showerhead and chuck) |
| 08 | metrology-and-inspection | Metrology and Inspection | `sem-column` (an electron-beam column over a wafer) |
| 09 | transistors-and-front-end | Transistors and the Front End | `gaa-transistor` (a gate-all-around nanosheet transistor) |
| 10 | foundries-and-fabs | Foundries and Fabs | `foup` (a wafer carrier holding 25 wafers) |
| 11 | memory-and-hbm | Memory and HBM | `hbm-stack` (a 12-high HBM stack with TSVs, exploded) |
| 12 | advanced-packaging | Advanced Packaging | `cowos-exploded` (a CoWoS package pulled apart layer by layer) |
| 13 | substrates-and-pcbs | Substrates and PCBs | `substrate-layers` (an ABF build-up substrate, exploded) |
| 14 | test-and-assembly | Test and Assembly | `probe-card` (a probe card over a wafer) |
| 15 | systems-and-networking | Systems and Networking | `gpu-baseboard` (an eight-GPU baseboard with switch chips) |
| 16 | data-centers-and-power | Data Centers and Power | `rack` (a liquid-cooled 72-GPU rack) |
| 17 | component-costs | Component Costs | `wafer-cost` (a wafer with dies binned by yield) |
| 18 | geopolitics | Geopolitics | `globe` (the world with chokepoint sites marked) — separate page, separate brief |

## Things that will get a chapter sent back

- A number without a link.
- A link that does not support the number next to it.
- Front matter that does not parse as JSON.
- Word count outside 1,300 to 1,900 (except Introduction, which may be 900 to 1,300, and Geopolitics, which is 2,500 to 3,500).
- Copying sentences from a source. Paraphrase and cite.
- Figures with invented data.
