# Control thresholds: how to read the map

`data/control-thresholds.json` holds 40 quantitative thresholds that govern AI chips and the machines that make them. Each object records one number and the instrument that carries it.

Read four fields first. `parameter`, `operator`, `value` and `unit` are the threshold itself. `status` says whether it binds: In force, Suspended, Superseded, Rescinded, or Proposed, never in force. `destinations` names who the number applies to, which usually matters more than the number. `licensePolicy` says what happens to an application that crosses the line, and the gap between "presumption of denial" and "case-by-case" is the gap between a ban and a queue.

`alternative` carries the second leg of a two-part test, and many entries have one. ECCN 3A090.a catches a chip at TPP 4800, but it also catches one at TPP 1600 if performance density reaches 5.92. A reader who checks only the headline number will misclassify small, efficient dies. `amendedBy` lists the dates on which the number moved. `note` says what the threshold catches and what it misses.

Every entry cites the instrument rather than a summary of it: the Federal Register notice that made the change, the current eCFR text of the section, or the issuing ministry. Law-firm client alerts, which explain these rules well and are easy to find, are not cited here at all; where one was the only support for a detail, the detail was checked against the rule text and corrected. The zero de minimis entry is the clearest case. It used to say that only Japan controls the equipment itself; the eCFR footnote records two countries, Japan from 23 July 2023 and the Netherlands from 9 September 2024, and the entry now says so. The Dutch tool models in entry `nl-duv-nxt1970i-1980i` come from ASML's own Form 20-F, which names the TWINSCAN NXT:1970i and 1980i; the Dutch government's announcement describes the measure without naming a model.

Three kinds of entry sit in the file. Some are performance lines on a product: 3A090, 3A090.c, 4A090. Some are end-use definitions that decide whether a facility may buy tools at all, such as the logic, NAND and DRAM prongs of "advanced-node integrated circuits". Some are jurisdictional tests with no performance figure of their own: the foreign direct product rules, the affiliates rule, the de minimis lines. The third group carries most of the regime's reach, and it is the group that catches people out, because it has no number to look up.

## What changed most recently

Three dates did the work.

On 2 December 2024 BIS added ECCN 3A090.c and set the HBM line at a memory bandwidth density above 2 GB/s per mm². The figure is low enough to catch every stack in production, so the entry works as a ban rather than a specification. The same rule replaced the DRAM half-pitch test of 18 nm with three measurable quantities: a cell area below 0.0026 µm², a density above 0.20 Gb/mm², or more than 3,000 through-silicon vias per die. Half-pitch is a modelled number. The replacements can be read off a die.

On 29 September 2025 the affiliates rule extended the Entity List to any company owned 50 percent or more, in aggregate, by a listed entity. Six weeks later BIS stayed the rule until 9 November 2026 under the truce with Beijing. China suspended its own 0.1 percent rare-earth de minimis rule the same day.

On 15 January 2026 two instruments took effect together. BIS moved chips below TPP 21,000 and below 6,500 GB/s of DRAM bandwidth from presumption of denial to case-by-case review for China and Macau, capping shipments at 50 percent of what the same product ships for United States end use. A Section 232 proclamation put a 25 percent tariff on covered chips entering the country. China may now buy the H200, and pays for it twice.

## The three most likely to move next

**The affiliates rule stay, 9 November 2026.** It expires in two months and reimposes automatically unless BIS extends it. Nothing else in the file carries a scheduled snap-back date, and China's rare-earth suspension is tied to the same clock.

**The EU's 10^25 FLOP threshold for general-purpose models.** Article 51(3) lets the Commission change it by delegated act, without going back to a legislature. It sits an order of magnitude below the American figure, and Commission enforcement powers over model providers began on 2 August 2026.

**The January 2026 TPP ceiling of 21,000.** It was drawn around one generation of hardware. Blackwell-class parts sit far above it, and pressure to raise it will grow with every quarter that Chinese buyers spend at the H200 line.
