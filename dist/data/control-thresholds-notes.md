# Control thresholds: how to read the file

`data/control-thresholds.json` holds the 40 thresholds that govern AI chips and the machines that make them. Each entry records one threshold and the instrument that carries it. The site no longer draws this file as a page (the license-thresholds view was removed on 10 September 2026 to keep Export Controls short); it ships as data, with `frCitation` and `cfr` on every row, for readers who want the numbers behind the board.

Start with four things. `parameter`, `operator`, `value` and `unit` are the threshold itself. `status` says whether it binds: In force, Suspended, Superseded, Rescinded, or Proposed, never in force. `destinations` names who the threshold applies to, which usually matters more than the number itself. `licensePolicy` says what happens to an application that crosses the line, and the gap between "presumption of denial" and "case-by-case" is the gap between a ban and a queue.

`alternative` carries the second leg of a two-part test, and many entries have one. Export classification 3A090.a catches a chip at 4,800 points of total processing performance (TPP), and catches one at 1,600 points if performance density reaches 5.92. A reader who checks only the headline number will misclassify small, efficient dies. `amendedBy` lists the dates the number moved. `note` says what the threshold catches and what it misses.

Every entry cites the instrument rather than a summary of it: the Federal Register notice that made the change, the current text in the electronic Code of Federal Regulations (eCFR), or the issuing ministry. Law-firm client alerts, which explain these rules well and are easy to find, are not cited here at all; where one was the only support for a detail, we checked the detail against the rule text and corrected it. The zero de minimis entry, where no amount of American content is too small to trigger control, is the clearest case. It used to say that only Japan controls the equipment itself; the eCFR footnote records two countries, Japan from 23 July 2023 and the Netherlands from 9 September 2024, and the entry now says so. The Dutch tool models in entry `nl-duv-nxt1970i-1980i` come from ASML's own Form 20-F, which names the TWINSCAN NXT:1970i and 1980i; the Dutch government's announcement describes the measure without naming a model.

Three kinds of entry sit in the file. Some are performance lines on a product: 3A090, 3A090.c, 4A090. Some are end-use definitions that decide whether a facility may buy tools at all, such as the logic, NAND and DRAM prongs of "advanced-node integrated circuits". Some are jurisdictional tests with no performance figure of their own: the foreign direct product rules, the affiliates rule, the de minimis lines. The third group carries most of the regime's reach and catches people out, because it has no number to look up.

## What changed most recently

Three dates did the work.

On 2 December 2024 the Bureau of Industry and Security (BIS) added export classification 3A090.c and set the line for high-bandwidth memory at a bandwidth density above 2 GB/s per mm² of package or stack area. BIS said every HBM stack in production exceeded it. License Exception HBM, at 15 CFR 740.25(c), admits only stacks below 3.3 GB/s per mm². The same rule replaced the DRAM half-pitch test of 18 nm with a cell area below 0.0019 µm² or a density above 0.288 Gb/mm². On 16 January 2025 BIS revised those to a cell area below 0.0026 µm² or a density above 0.20 Gb/mm², and added a third test of more than 3,000 through-silicon vias per die.

On 29 September 2025 the affiliates rule extended the Entity List to any company owned 50 percent or more, in aggregate, by a listed entity. Six weeks later BIS stayed the rule until 9 November 2026 under the truce with Beijing. China had suspended its own 0.1 percent rare-earth de minimis rule three days earlier, on 7 November.

On 15 January 2026 two instruments took effect together. BIS moved chips below 21,000 points of total processing performance and below 6,500 GB/s of memory bandwidth from presumption of denial to case-by-case review for China and Macau, capping shipments at 50 percent of what the same product ships for American use. A national-security proclamation under Section 232 put a 25 percent tariff on covered chips entering the country.

## The three most likely to move next

**The affiliates rule stay, 9 November 2026.** The stay ends on 9 November 2026, and the rule returns on 10 November unless BIS extends the stay. China's suspension of its rare-earth rules runs to 10 November 2026.

**The EU's 10^25 FLOP threshold for general-purpose models.** Article 51(3) of the AI Act lets the Commission change it by delegated act, without going back to a legislature. It sits an order of magnitude below the American figure, and Commission enforcement powers over model providers began on 2 August 2026.

**The January 2026 ceiling of 21,000 performance points.** It was drawn around one generation of hardware. Blackwell-class parts sit far above it, and Nvidia reported in August 2026 that the PRC government had restricted the H200 sales its licenses allowed.
