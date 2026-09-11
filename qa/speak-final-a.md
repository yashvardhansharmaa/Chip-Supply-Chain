# Final Claude-speak pass, chapters 01 to 09

**32 changes across nine chapters** (30 prose, 2 mechanical). Every fact, number and citation is unchanged; no URL was touched; no `plain` field or "How it works" first paragraph was edited, and the build confirms all nine still match. `node build/build.js` ran clean: no warnings, 349 sources, per-chapter source counts identical to before the pass.

Line numbers are the ones before editing. Citations are written `([source])` with the URL elided. Where two categories were fixed in one edit, the row lists both.

Scope read: body prose plus `oneLiner`, `plain`, `specimenCaption`, `card.test`, `card.why`, `card.chinaStatus`, `card.usStatus`, `card.costSignal`, leader `share`, country `note` and `keyFacts`. Mechanical sweep across all nine files: em dashes (none), `US$` (one, fixed), "data center" (none), `%` in running text (one, fixed), American spellings (none; "license" at 01 line 108 is the verb and correct), second person and first person plural (none), site self-reference and control instructions (none), throat-clearing openers (none), rhetorical questions (none).

| Chapter | Line | Before | After | Category |
|---|---|---|---|---|
| 01 | 102 | Inside each step the grip is tighter still: Synopsys alone holds more than 90 percent of static timing analysis, the check that proves a chip will run at its rated speed ([source]). | Synopsys alone holds more than 90 percent of static timing analysis, the check that proves a chip will run at its rated speed ([source]), so inside each step the grip is tighter still. | Punchline colon |
| 01 | 126 | The engineers are spread wider than the firms: India alone holds nearly 20 percent of the world's chip designers ([source]). | The engineers are spread wider than the firms, and India alone holds nearly 20 percent of the world's chip designers ([source]). | Punchline colon |
| 01 | 134 | China's answer is real but partial. CSET at Georgetown University puts it flatly: ... | (cut) CSET at Georgetown University finds that ... | Stem sentence (the next paragraph, "China can design an accelerator. It cannot finish one...", already carries the real-but-partial point) |
| 01 | 134 | CSET at Georgetown University puts it flatly: Chinese designers rely on US tools for all their chip designs, US firms alone sell the full range of software a leading-edge chip needs, and Chinese vendors cannot yet support designs at those nodes ([source]). | CSET at Georgetown University finds that Chinese designers rely on US tools for all their chip designs, that US firms alone sell the full range of software a leading-edge chip needs, and that Chinese vendors cannot yet support designs at those nodes ([source]). | Punchline colon |
| 02 | 100 | The raw material is a separate map. China made 1.50 million tonnes of polysilicon in 2023, about 93 percent of world output ([source]). | China made 1.50 million tonnes of polysilicon, the raw material, in 2023, about 93 percent of world output ([source]). | Stem sentence |
| 02 | 100 | Almost none of it can go into a chip: solar-grade material was 98 percent of that output and electronic-grade 2 percent ([source]). | Solar-grade material was 98 percent of that output and electronic-grade 2 percent ([source]), so almost none of it can go into a chip. | Punchline colon |
| 02 | 110 | They cannot even feed their own fabs: Chinese producers supplied 12 percent of the wafers consumed by China's 300 mm fabs, against 18 percent at 200 mm and below ([source]). | Chinese producers supplied 12 percent of the wafers consumed by China's own 300 mm fabs, against 18 percent at 200 mm and below ([source]). | Punchline colon |
| 02 | 116 | AI accelerators make the wafer's job harder. One fatal defect ruins far more silicon ... | One fatal defect ruins far more silicon ... | Stem sentence |
| 03 | `oneLiner` (line 6) | ... and the two times this layer has been squeezed, no fab stopped: the countries hit stockpiled and built substitutes instead. | ... and the two times this layer has been squeezed, no fab stopped, because the countries hit stockpiled and built substitutes instead. | Punchline colon |
| 03 | 95 | JSR is no longer a public company. A vehicle of Japan Investment Corporation, a state-backed fund, took 84.36 percent of its shares ... | A vehicle of Japan Investment Corporation, a state-backed fund, took 84.36 percent of JSR's shares ... | Stem sentence restated by the next ("then delisted it") |
| 03 | 103 | The consumables are narrower again. As of 2021 five firms held ... | As of 2021 five firms held ... | Stem sentence |
| 03 | 119 | The slower risk is regulatory. The five member states behind the European Union's proposed restriction on PFAS, the long-lived fluorinated chemicals, published a revised text ... | The slower risk is the European Union's proposed restriction on PFAS, the long-lived fluorinated chemicals. The five member states behind it published a revised text ... | Stem sentence |
| 04 | 98 | Immersion is the contested tier. Without EUV, a fab needs NXT:2000i-class scanners ... | Immersion is the contested tier, because without EUV a fab needs NXT:2000i-class scanners ... | Stem sentence |
| 04 | 109 | Canon's bet is nanoimprint: the FPA-1200NZ2C stamps the pattern instead of projecting it, down to a 14 nm linewidth ([source]). | Canon's bet is nanoimprint, where the FPA-1200NZ2C stamps the pattern instead of projecting it, down to a 14 nm linewidth ([source]). | Punchline colon |
| 04 | 144 | ... extended entity-list controls to 50%-owned subsidiaries ... | ... extended entity-list controls to 50 percent-owned subsidiaries ... | Mechanical: "percent" in running text |
| 04 | 148 | On DUV, China's answer is real. Reuters reported in July 2026, on one unnamed source, that ... | On DUV, Reuters reported in July 2026, on one unnamed source, that ... | Stem sentence (the "On EUV the record is thinner" contrast in the next paragraph survives) |
| 04 | 156 | The failure mode is total: if ASML stops shipping, nothing at the leading edge gets printed. Even ASML could not rebuild itself quickly, since ... | If ASML stops shipping, nothing at the leading edge gets printed, and even ASML could not rebuild itself quickly, since ... | Punchline colon |
| 05 | 95 | EUV makes that hard. ASML's membrane is 13 nanometres thick ... | ASML's EUV membrane is 13 nanometres thick ... | Stem sentence |
| 05 | 117 | Pellicles are the unsolved part. A decade on, no membrane is transparent, tough and long-lived at once ... | A decade on, no pellicle membrane is transparent, tough and long-lived at once ... | Stem sentence |
| 06 | `oneLiner` (line 6) | Lithography prints the pattern; deposition and etch do the rest, over a thousand steps per wafer. This is the one tool segment where China has taken real share. | Lithography prints the pattern; deposition and etch do the rest, over a thousand steps per wafer, and it is the one tool segment where China has taken real share. | Deictic "This is" opener |
| 06 | 112 | ASM International is the specialist. Its 2025 revenue reached a record EUR 3.2 billion as customers built 2 nm gate-all-around capacity ... | ASM International, the atomic layer deposition specialist, reached a record EUR 3.2 billion of revenue in 2025 as customers built 2 nm gate-all-around capacity ... | Stem sentence |
| 06 | 134 | The rules reach the vendors too: Applied Materials took a $253 million charge to settle an export controls matter ([source]). | Applied Materials took a $253 million charge to settle an export controls matter ([source]), so the rules reach the vendors as well as their customers. | Punchline colon |
| 07 | 76 | KLA takes more than half of that tenth. At its March 2026 investor day it put its own 2024 share at 56.5 percent ... | At its March 2026 investor day KLA put its own 2024 share at 56.5 percent ... | Stem sentence |
| 07 | 132 | ... and still fail to get production going: without sensitive inspection it cannot find out why its yield is low. | ... and still fail to get production going, because without sensitive inspection it cannot find out why its yield is low. | Punchline colon |
| 08 | 124 | AI accelerators sit a node behind the leading edge: a die that large comes out working only on a process that has run for years. | AI accelerators sit a node behind the leading edge, because a die that large comes out working only on a process that has run for years. | Punchline colon |
| 08 | 130 | No single machine makes the front end a chokepoint. The scarce thing is the recipe: which steps, in which order, on which tools. | No single machine makes the front end a chokepoint. The recipe does, and a recipe is which steps run in which order on which tools. | Punchline colon; also a verbatim echo of `card.why` ("The scarce thing is the recipe: which steps, in which order, on which tools"), which the card keeps |
| 08 | 132 | China shows what that recipe costs. The money is there: the third National Integrated Circuit Fund raised 344 billion yuan, about $47 billion, in May 2024 ([source]). The tools are not. | China shows what that recipe costs. The third National Integrated Circuit Fund raised 344 billion yuan, about $47 billion, in May 2024 ([source]), so money is not the constraint; tools are. | Punchline colon plus a stem-and-reveal pair |
| 09 | `keyFacts` (line 37) | TSMC intends to invest US$165 billion in the United States ... | TSMC intends to invest $165 billion in the United States ... | Mechanical: "$" not "US$" |
| 09 | 86 | That is harder: customers dislike handing designs to a competitor, and the house products take the best capacity. | That is harder, because customers dislike handing designs to a competitor and the house products take the best capacity. | Punchline colon |
| 09 | 100 | Allocation matters as much as capacity. TSMC does not auction capacity; it books it years ahead ... | TSMC does not auction capacity; it books it years ahead ... | Stem sentence |
| 09 | 106 | The commercial position has not caught up: 14A depends on winning external customers first. | The commercial position has not caught up, since 14A depends on winning external customers first. | Punchline colon |
| 09 | 122 | Diversification is real and slow. The hard part of a fab is a workforce that has run one process for years, and TSMC has yet to build a gigafab anywhere but Taiwan ([source]). | Diversification is slow because the hard part of a fab is a workforce that has run one process for years, and TSMC has yet to build a gigafab anywhere but Taiwan ([source]). | Stem sentence |

## Counts

| Chapter | Changes |
|---|---|
| 01 Chip Design, EDA and IP | 4 |
| 02 Silicon and Wafers | 4 |
| 03 Chemicals, Gases and Photoresist | 4 |
| 04 Lithography | 5 |
| 05 Photomasks and Pellicles | 2 |
| 06 Deposition and Etch | 3 |
| 07 Metrology and Inspection | 2 |
| 08 Transistors and the Front End | 3 |
| 09 Foundries and Fabs | 5 |
| **Total** | **32** |

By category: punchline colon 15, stem sentence 14, deictic opener 1, mechanical 2. Nothing found for second person, first person plural, site self-reference, control instructions, stacked hedges, throat-clearing openers, rhythm triplets or rhetorical questions; the three earlier passes had cleared those.

## Left alone on purpose

- Colons that introduce a list, a definition or a formula ("Resolution follows one relation:", "Four carry the EUV machine:", "A wafer loses value two ways:") are structure, not punchlines, and stay.
- Topic sentences that carry a fact or a judgment and are then supported ("Node names describe nothing physical.", "Intel is now partly state-owned.", "Within deposition and etch there is no single ASML.") stay; cutting them would flatten every paragraph to the same shape.
- "X rather than Y" and "not X but Y" where both halves inform ("Neither metal goes into a silicon logic chip", "the plate is not a window but a mirror") stay.
- Triplets that list three real things ("turn on hard, turn off completely, and keep doing it for years"; "transparent, tough and long-lived") stay.
- 09 `card.why` "What it cannot buy quickly is a workforce" stays, as the earlier pass decided.
- "Center for Strategic and International Studies" is a proper name, and "license" in 01 line 108 is the verb.

## Build

`node build/build.js`: built clean, no warnings. Source tiers A 327, B 22, disallowed 0, unclassified 0. Per-chapter source counts for 01 to 09 (18, 13, 16, 25, 16, 17, 15, 16, 12) are unchanged from before the pass. All nine `plain` fields match their "How it works" first paragraph.
