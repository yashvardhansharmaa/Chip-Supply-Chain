# Final QA, section C: chapter content (fix-c, 28 October 2026)

Worktree `chokepoints-rd-fixc`, branch `redesign-fixc`, cut from `redesign` at fceef96. Preview http://127.0.0.1:8783/. Chapter 16 was not edited (section B owns it). Shots before (8766) and after (8783) are in `qa/redesign/shots/fix-c/`, named `<finding>-before.png` and `<finding>-after.png`. Pages fetched to check facts are in `MAIN/qa/final-qa/fix-c/fetched/`.

## Findings

| ID | What was done |
|---|---|
| C1 | Figure 09.2: the 2,000 GB/s bar is labeled "HBM4, JEDEC standard", the wine moves to "HBM4, advanced configurations" (3,300), and the headline reads "As of April 2026, HBM4 reaches up to 3,300 GB/s per stack, against 2,000 in the JEDEC standard" (Siemens EDA, April 2026, the figure's source). The text adds Samsung's own figure for the HBM4 it began shipping in February 2026, a maximum of 3.3 TB/s per stack (Samsung newsroom, checked). |
| C2 | "How a stack is built" no longer calls MR-MUF a kind of thermocompression. It says makers join the chips by methods such as TC-NCF and MR-MUF, and describes MR-MUF as SK hynix's tech note does: chips connected through microbumps and stacked, then a liquid underfill injected into every gap at once and cured. TC-NCF stays described as thermocompression with a non-conductive film (Samsung). Note: the SK hynix tech note itself files MR-MUF under thermocompression bonding, so the text now avoids classifying it either way. |
| C3 | The Memory card's "Where China stands" leads with SemiAnalysis, June 2026 (CXMT still struggling to stabilize eight-high HBM3), then IFP, October 2025, then Huawei, September 2025. |
| C4 | Figure 10.4 retitled "China-based suppliers' share of advanced packaging fabrication tools and three test tool segments, 2024", with `"mark"` on the advanced packaging bar and the headline "China-based suppliers held 7 percent of the market for advanced packaging fabrication tools in 2024". |
| C5 | Report only, no band changed. Options below. |
| C6 | Microbumps: chapter 9 now says SK hynix gives about 20 micrometers as the typical spacing; chapter 10 keeps Intel Foveros 2.5D at 36 micrometers and adds that spacing differs by design, with SK hynix's typical 20. Packaging cost: chapter 10's text and card add Epoch AI's $1,000 packaging yield loss beside the $1,100 and $900 (Epoch B200 page, checked). Wei: "would probably give the actual figure in 2026" replaced by "he gave no figure" (3Q25 transcript: "The real number, we probably update you next year"). COUPE: "In April 2026 TSMC planned to begin producing COUPE on substrate later that year". 10.3's 3.5 reticles is right: TSMC's 2025 annual report and 3DFabric page give CoWoS-L at 3.5 reticles in production since 2024, and 3.3 is CoWoS-S; the figure now has a note saying so. The TSV power sentence is joined to the 3D paragraph. Typography: see C15. |
| C7 | Lithography's In short now gives ASML's DUV share (Reuters), its 2026 EUV capacity of about 65 scanners (ASML, July 2026) and the Zeiss limit (ASML 20-F), with the controls paragraph unchanged. The paragraph after it no longer says "Nobody else makes EUV systems": it gives ASML's 327 systems in 2025 and China's 33 percent of its 2025 system sales. Chip Design's In short now covers the tool lock-in (Synopsys over 90 percent of timing signoff, SemiAnalysis on rebuilding a flow) and then the 2022 control, CSIS on China's tools and SemiAnalysis on local share, so the 2025 license line is no longer repeated. Every sentence keeps a source already in the chapter. |
| C8 | "cabinets" reworded to "large machines full of reprogrammable chips". 3D991 and 3E991 removed from 3B001's aka, so they no longer open 3B001. |
| C9 | Chapter 1: "48 and 64 billion transfers per second, written GT/s for gigatransfers per second"; 3.5D XDSiP explained as stacking dies face to face and setting the stacks side by side on an interposer (Broadcom's deck, checked). Lithography's In plain terms (and its twin paragraph): "one of its immersion scanners, the NXT:2150i" and "argon fluoride laser light at 193 nanometers", so the ArF pop-up sits on "argon fluoride". i-line and KrF no longer appear on the card (see C10). The mm² glossary entry is renamed mm² and its last sentence no longer uses CoWoS or interposers. |
| C10 | China line: Reuters, July 2026, added as its own first sentence (one source per sentence), then the CTS finding. US line: "CSET found in 2021 that no American firm made lithography scanners", followed by CTS, September 2026: ASML about 99 percent of immersion DUV, Nikon the rest. Who leads: one measure, systems sold (ASML 327 in 2025 with all 48 EUV, Canon 234 in 2025, Nikon 22 in the year to March 2026). Footnote 4 (Reuters): **not confirmed**. Reuters returns 401 to the research user agent and the archived copy was refused by the permission system, so the date and figures were not rechecked. `qa/source-audit-strict.md` records an earlier reading in a browser: first published 28 January 2026, updated 28 July 2026, title "$400 million", with $60 million DUV, $200 million EUV and $350 to $400 million High-NA. The address's 2026-07-28 slug sits oddly with a January first date. Text left as it was. |
| C11 | 109 SEC entries in `data/bibliography.json` retitled from raw EDGAR names to "Company, report on Form X for the fiscal year ended D Month YYYY" (for example "ASML Holding, 2025 annual report, filed on Form 6-K", "Photronics, annual report on Form 10-K for the fiscal year ended 31 October 2025"). XBRL entries read "KLA, revenue reported to the SEC (XBRL company data)". Publishers name the firm the same way. No other field changed, and the file keeps indent 2 and `ensure_ascii=False`. |
| C12 | Key facts reordered so home leads each stage with a sourced concentration fact: Lithography gains "ASML is the only company that makes EUV scanners" (ASML annual report), Metrology leads with CSET's 56.8 percent of a $15.7 billion market, Substrates with Ajinomoto's over 95 percent (June 2026). Wafers and photoresist no longer repeat the paragraph above: wafers lead with China's 93 percent of polysilicon and the five electronic-grade silicon makers, chemicals with gallium (USGS) and sputtering targets (JX). Three new key facts reuse sentences and sources already in their chapters (Lithography, Deposition and Etch, Foundries). Trade-off: Metrology's first fact restates the paragraph's 56.8 percent, because it is the only place on home that gives that figure a source, and it adds the market size and the next two firms. |
| C13 | Summary stage cards link each leader's share to its source, and the lede's percentage to the key fact that carries it (SK hynix's 63.2 percent, photoresist's 78 percent, Synopsys's over 90 percent among them). Money and percent follow C15 (E6 too: "$7 billion", "$2.52 billion", "NT$60.6 billion", "¥409,670 million", "¥1,015.7 billion", "55 to 60 percent"). Ajinomoto's claim now has one wording everywhere: "told investors in June 2026 that its build-up film has held over 95 percent of its market since its launch" (lede, card, key fact, body, glossary, supplier entry, meta description). **Not changed:** "2,053,298,171.74 yuan" for Skyverse. The filing gives only that and "205,329.82 万元", so any shorter form would round. |
| C14 | 02.2's title drops "Japan held 53 percent". Silicon: "The shares come from a survey…", "the other shares are measured from its bars", "The ministry's figures give no separate share…". Deposition: "Among deposition and etch tool segments, China-based suppliers have their largest share in dry stripping". Component costs: "In the table" and "The table below sorts" and "in the table above" are gone. `/chips/` drops "The X is the highest, at N". **Not changed:** the AI Chips lead in `src/app.js` (`chartFinding`). It is the chart's headline, as every chapter figure has one, and it sits in section A's code. Chapter 16's two lines belong to section B. |
| C15 | House style, applied to chapters 1 to 15 (card rows, cost lines, China and US lines, key facts, figure titles, headlines and notes), the glossary, the suppliers' role and share notes, and so to home and the summary: "percent" in words, "$6.71 billion" and "$532.1 million" for money in text, ranges as "55 to 60 percent" and "$50 million to $100 million", "3.3×", "8 × FP8", "mm²". Figures keep "$B" and "%" units on their axes and values. 07.2's headline reads "$6,700 million", to match its bars in $M. 01.2 and 05.2 now share one title and headline. Semicolons removed from the source lines of 02.2, 04.3, 13.2, 15.2 and 15.3. Every figure headline holds a number and its unit together with a non-breaking space. Suppliers' categories read "Design and EDA", "Power and cooling" and so on, in one case. The map strip no longer turns "and" into "&". **Not changed:** the footer's source key (a do-not-change item, and D19). 16.3 is chapter 16 (section B). AI Chips' "mm2" and "8 x FP8" are in `data/landscape.json`, section A's file, on the very rows A4 rewrites, so they are left for section A or for after the merge. They are at lines 756, 1191, 1332, 2951, 2952, 3453, 3576, 3932, 3933 and 4316, plus four in `landscape-layouts.json`. Supplier revenue "as filed" ("$5,296,759 thousand") is printed by design from the filing's own unit, and a shorter form would round. |

## C5, report only: sourced options for the two test lines

**Advanced Packaging, rated Moderate.** Its current test line ("Rated on CoWoS capacity, which TSMC said in July 2026 was so tight that it limited its customers' growth") argues for Hard. Options that test substitutability, all already cited in the chapter:
1. "CoWoS packaging can be, and has been, outsourced to assembly firms such as ASE and Amkor, SemiAnalysis noted in March 2026." Source: SemiAnalysis, "The Great AI Silicon Shortage" (Tier B). Supports Moderate.
2. "Amazon's Trainium and Google's TPU were both adopting Intel's EMIB as of March 2026, SemiAnalysis reported." Same source. Supports Moderate.
3. "JCET says its XDFOI platform has entered high-volume manufacturing with redistribution-layer interposer, silicon interposer and silicon bridge options." Source: JCET news 2052 (Tier A). Supports Moderate.
4. If the owner reads the capacity line as the test, the band would be Hard, and the current line could stay.

**Memory and HBM, rated Hard.** The current test is concentration ("Three firms took nearly all HBM revenue in 2025"). Options that test how hard it is to substitute:
1. "In June 2026 SemiAnalysis judged that CXMT, China's strongest DRAM maker, was still struggling to stabilize supply of eight-high HBM3." Source: SemiAnalysis on CXMT (Tier B). It shows a funded newcomer failing to substitute, which supports Hard.
2. "SK hynix says HBM needs advanced processes such as TSV packaging and must pass customers' rigorous testing and approval." Source: SK hynix 424B4, July 2026 (Tier A). Supports Hard, and is close to the card's current reason.
3. Counterpoint: "Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent in the first quarter of 2026." Source: IDC in SK hynix's 424B4. An incumbent DRAM maker gained ground in about two years, which could argue for Moderate.

## Sources added

None. Every new sentence cites a source already in its chapter and already in `data/bibliography.json`. The pages checked (all Tier A or B) were the SK hynix tech note, Samsung's HBM4 release, Micron's HBM4 page, the Siemens EDA guide, Epoch AI's B200 breakdown, the CTS DUV report, Broadcom's 3.5D XDSiP deck, the UCIe 3.0 page and Skyverse's 2025 annual report. The TSMC 3Q25 and 2Q26 transcripts, the 2025 annual report chapter 5 and the 3DFabric page were read from round two's copies, because TSMC's sites now return a bot check.

## Unconfirmed

- C10, Reuters footnote 4: the date and figures could not be rechecked (above).
- C6, COUPE: whether production began in 2026 is not confirmed, because TSMC's pages return a bot check. The text now states it as April 2026's plan.

## Checks

All run on the final build. Outputs are in `qa/redesign/fixc/`.

| Check | Result |
|---|---|
| `node build/build.js` | builds, with no warnings in the build report |
| `check-speak` | no matches |
| `check-integrity` | no problems (one card warning, the same one as at fceef96: the Deposition card's "that year" sentence) |
| `check-sources` | 2,826 citations, all tier A or B |
| `check-size` | none over 5 MB |
| `check-seo` | no problems. A note about the substrates description being 165 characters was fixed by shortening it. |
| `check-links --local http://127.0.0.1:8783` | 28 pages, 1,166 addresses, no broken links |
| `smoke.js --port 8793` | 47 page loads, no failures |
| `check-perchapter.js` | all 336 checks pass |
| `interact-chapter.js` | all passed |
| `stage-chapters.js --base http://127.0.0.1:8783` | 10 of 10 pass |
| `check-cites.js` | 3,318 marks, 0 problems |
| `check-figs.js` | 112 of 112 pass |
| shots | 21 before-and-after pairs, 42 files in `qa/redesign/shots/fix-c/` (git-ignored, as all shots are) |

No check was changed.

## Shared files touched (for the merge)

- `src/app.js`: only the Suppliers `ORDER` and `SHORT` lines (about 1693 to 1702).
- `build/build.js`: only `LK_SHORT` (about 1455 to 1461).
- `build/modules/summary-a.js`: the `EQUIPMENT` list (line 110) and the map strip's title (line 517, also where D5 puts meters on the strip).
- `build/modules/summary-brief.js`: the stage cards' share and lede lines, plus one style rule. D6 also edits the stage cards.
- `build/modules/reference-pages.js`: one deleted line in the FP16 timeline.
- `data/bibliography.json`: titles and publishers of SEC entries only.
- `data/exposure.json` and `data/suppliers.json`: `category` values, plus suppliers' `role` and `shareNote` text.
- `build/page-titles.json`: the substrates description.
