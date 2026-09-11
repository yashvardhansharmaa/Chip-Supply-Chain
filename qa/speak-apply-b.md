# Applying speak-hunt-b: chapters 10 to 17 and three data files

All 55 rows of `qa/speak-hunt-b.md` are applied. None were adapted and none were skipped: every
quote was still verbatim in its file, every replacement went in as proposed, and no cut dropped a
citation or left a dangling connective. The checks behind those three claims are recorded under
each file.

Body word counts are the build's own per-chapter figures, so they cover prose only; edits to
`plain`, `card.why` and the data files do not move them.

---

## `content/10-memory-and-hbm.md` — 1,224 → 1,215 words

| Row | Applied |
|---|---|
| line 116, `Its July 2026 prospectus prints it:` | Merged as proposed. The SEC prospectus citation was already on the tail of the merged sentence and stays there, so the source survives the merge. |
| line 130, `We think the gap is closing…` | Applied verbatim. |

## `content/11-advanced-packaging.md` — 1,344 → 1,323 words

| Row | Applied |
|---|---|
| line 117, `The split is public; the total is not.` | Cut. The paragraph now opens `Epoch AI weighs each designer's component use…`; no connective to repair, and the Epoch AI citation is untouched. |
| line 121, `The ordering has since flipped.` | Cut. The paragraph now opens `SemiAnalysis reported in March 2026…`, which carries the date and the citation. |
| line 121, `The queue has eased; the concentration has not.` | Cut. It was the last sentence of its paragraph, which now ends on the SemiAnalysis citation. |

Neither cut sentence carried a citation of its own, so exception (a) never applied here.

## `content/12-substrates-and-pcbs.md` — 1,328 → 1,331 words

| Row | Applied |
|---|---|
| line 103, `One layer down, the core tells the same story.` | Applied verbatim. |
| line 109, `Not one is American ([source]).` | Applied verbatim, citation kept on the new sentence. The White House list above it names Ibiden, Shinko, Nanya, Samsung, Unimicron, Shennan Circuits, Zhuhai Yueya and AKM — eight, so the new count is right. |

The file gains three words: both replacements are longer than what they replace.

## `content/13-test-and-assembly.md` — 1,227 → 1,208 words

| Row | Applied |
|---|---|
| card `plain`, `The stakes rise each year for a simple reason:` | Applied. |
| line 78, `This matters more each year because of arithmetic:` | Same replacement applied to the second copy. |
| card `why`, `What holds a customer is Advantest's own argument…` | Applied verbatim. |
| line 87, `What changed is the value of proving a die good…` | Applied verbatim. |
| line 128, `What holds a customer is the cost of leaving.` | Cut. The paragraph now reads `Unlike lithography, no tool here has a single supplier. Advantest argues that switching tester vendor…`, which keeps the Advantest citation. |
| line 130, `This is also the part of the chain China is closest to owning…` | Applied verbatim. |
| line 134, `**Test coverage** is what you buy:` | Applied verbatim. |

**Exception (c), checked.** After the two paired edits the front-matter `plain` field and the first
paragraph under "How it works" are byte for byte identical — both 491 characters, compared as exact
strings, not normalised. The build emits no `plain` warning.

One note, not a change: the paragraph still runs on to `So the industry tests earlier, hotter and
longer than it used to`. That `So` was there before and still follows from the surviving clause
(`one bad piece throws away all of them`), so rule (d) did not call for a repair.

## `content/14-systems-and-networking.md` — 1,230 → 1,234 words

| Row | Applied |
|---|---|
| line 75, `…the size of model you can train.` | Applied verbatim. |
| line 115, `What cannot be replaced that fast sits underneath the assembly.` | Applied verbatim. |
| line 128, `**Serviceability** … a switch you return whole…` | Applied verbatim. |

All three de-second-person rewrites are a word or two longer, hence the small gain.

## `content/15-data-centers-and-power.md` — 1,235 → 1,210 words

| Row | Applied |
|---|---|
| card `why`, `What a well-funded actor cannot shorten is the queue:` | Applied verbatim. |
| line 204, `That has flipped.` | Cut. The lede now runs `For thirty years the semiconductor industry set the pace and everything downstream followed. A wafer clears a leading-edge fab in months; a large power transformer takes three years…`, with the Department of Energy citation still attached. |
| line 212, `Everything else follows from that number.` | Cut. The paragraph opens on `Utility power steps down through a substation`. |
| line 226, `With nine suppliers, a buyer can get the kit and haggle over the price.` | Cut. It was paragraph-final; the paragraph now ends on the Nvidia citation that names the nine firms. |
| line 270, `Set that against the chip chain…` | Applied verbatim. |

Observation, not a change: the same haggling clause survives inside the card `why`
(`Nine firms sell the power and cooling equipment for Nvidia's gigawatt designs, so a buyer can get
the kit and haggle over the price`). That copy is not on the list, so it stands.

## `content/16-component-costs.md` — 1,280 → 1,234 words

| Row | Applied |
|---|---|
| card `why`, `What it cannot substitute is what sits underneath:` | Applied verbatim. |
| line 72, `Follow that $6,400 and you learn…` | Applied verbatim. |
| line 78, `Three numbers set the cost of a die…: the price of the wafer, how many dies fit on it, and how many of those work.` | Applied. The three bold bullets that follow are still wafer price, dies per wafer and yield, in that order, so nothing is lost. |
| line 84, `Run those three numbers and…` | Applied verbatim, Epoch AI citation kept. |
| line 108, `…so the table carries one generation only.` | Applied verbatim. |
| line 114, `Buy a whole rack and…` | Applied verbatim. |
| line 141, `…which sets the error bar here.` | Applied verbatim; the two competing totals follow in the next sentence. |
| line 166, `The classification is ours; its yield and margin figures are cited above.` | Applied verbatim; the ownership disclosure stays. |

## `content/17-geopolitics.md` — 2,808 → 2,780 words

| Row | Applied |
|---|---|
| card `why`, `This card rates the chain at its hardest stage…` | Cut. The field now opens `A well-funded state can copy mature tools in a few years…`; the `test` field beside it still says `Rated at the chain's hardest link`. |
| line 84, `What follows is a status report on each.` | Cut. The chapter lede is now the single sentence `Washington's control regime and Beijing's answer to it are both unfinished.` |
| line 112, `The underlying figures are IDC's, and the prospectus relays them, which is what makes them usable here.` | Applied verbatim. |
| line 116, `No country in the table is self-sufficient…` | Applied verbatim. |
| line 128, `The H20 sequence shows the drift.` | Cut. The paragraph opens on `On 9 April 2025 the government told Nvidia…` and runs to the 15 percent expectation, both citations intact. |
| line 191, `We think the shield is real and weakening…` | Applied verbatim. |

## `data/glossary.json` — 6 rows

| Entry, field | Applied |
|---|---|
| `Concentration`, `why` | Replaced the whole field with the proposed sentence about accidents and licence decisions. |
| `EAR`, `why` | First sentence replaced; the Federal Register sentence after it is kept. |
| `License Exception LPP`, `why` | Applied verbatim. |
| `known-good die`, `plain` | Applied verbatim. |
| `hyperscaler`, `why` | Shortened to one clause. The `capex` entry keeps the `and that is the number every firm in this chain plans against` clause, so the duplication the audit flagged is gone. |
| `performance density`, `plain` | Applied verbatim. The next sentence, `It is the test that replaced the 2022 interconnect-bandwidth criterion`, no longer contradicts a `not a replacement` in front of it. |

## `data/control-flows.json` — 2 rows

| Flow, field | Applied |
|---|---|
| `ai-chips`, `what` | Folded into the first sentence as proposed: `…and the Blackwell parts, all of them above the January 2026 band.` |
| `minerals`, `what` | Second sentence cut; the field ends `…sold to American buyers.` |

No `label` was touched. All flow-state labels re-checked after the edit: none exceeds 10 words.

## `data/export-controls-timeline.json` — 11 rows

| Event, field | Applied |
|---|---|
| `2018-07-13-zte-order-terminated`, `gist` | Applied verbatim (15 words). |
| `2018-07-13-zte-order-terminated`, `summary` | Applied verbatim. |
| `2020-12-01-china-export-control-law`, `gist` | Applied verbatim (14 words). |
| `2020-12-01-china-export-control-law`, `summary` | Applied verbatim. |
| `2022-12-23-ndaa-5949`, `summary` | Final sentence cut; the summary ends on the 23 December 2027 date and the February 2026 proposed rule. |
| `2024-09-06-gaafet-quantum`, `summary` | Final sentence cut. |
| `2025-08-11-fifteen-percent`, `summary` | Applied verbatim. |
| `2026-01-15-us-taiwan-mou`, `summary` | Applied verbatim. |
| `2026-08-26-h200-unused`, `summary` | First two sentences merged as proposed; the quoted passage from the filing is unchanged, including its escaping. |
| `2026-08-26-h200-unused`, `summary` | Final sentence shortened to `Beijing's own instruments are not published.` |
| `2025-09-18-huawei-hbm`, `summary` | Applied verbatim. |

Every `gist` in the file re-checked after the edits: none exceeds 16 words. Both cuts removed the
leading space along with the sentence, so no field carries a double space or trailing whitespace —
checked across all three data files.

---

## Checks

- Each of the 55 replacements was matched exactly once before being written; a miss or a duplicate
  would have failed rather than guessed. No row hit exception (b).
- No cut sentence carried a citation, so no citation needed reattaching under exception (a). Total
  sources across the site is unchanged at 344, and every chapter from 10 to 17 holds the source
  count it had before (15, 19, 19, 28, 22, 14, 21, 58).
- Every paragraph that lost a sentence was re-read for a dangling `But`, `So` or `And` at its new
  opening. None appeared, so exception (d) never fired.
- `node -e "['data/glossary.json','data/control-flows.json','data/export-controls-timeline.json'].forEach(f=>JSON.parse(require('fs').readFileSync(f,'utf8')))"` — all three parse.
- A sweep for all 55 original quotes across the eight chapters and three data files returns nothing:
  no row was half-applied.

## Final build

`node build/build.js` ends with no errors and no warnings.

```
built 2026-09-11T00:04:49.369Z
source tiers: A 322 · B 22 · disallowed 0 · unclassified 0
chapters: 16 + geopolitics
words: 22969
sources: 344
landscape: 35 chips · suppliers: 220 · timeline: 50 · matrix: 20 · glossary: 91 · controls: 40 · exposure: 108
size: 2398 KB
```

Site body prose went from 23,110 to 22,969 words, 141 of them removed in this half.
