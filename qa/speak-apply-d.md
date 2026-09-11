# Applying speak-hunt-d: the seven data files

All 97 rows of `qa/speak-hunt-d.md` are applied. Ninety-six went in exactly as proposed; one was
adapted, in `landscape.json`, because the replacement as written dropped the word *allowed* from a
sourcing hedge the same document rules off limits. Nothing was skipped, and every quote was still
verbatim on disk, curly apostrophes and all.

How the edits were made: each quote was matched as a fixed string against the raw file text with an
expected occurrence count, and the replacement written in place. No JSON file was re-serialised, so
indentation, key order and blank lines are untouched, and no number, name, date, URL, `basis` string
or `sources` list moved. Three quotes are word-for-word duplicates across records and were applied to
all of their instances at once, which is what the list asks for: `Those fields are empty here rather
than filled from unofficial reporting.` (three TPU rows), `Shares withdrawn on 9 September 2026 and
still withdrawn.` (three matrix rows) and `China revenue not disclosed in absolute terms.` (four Nova
rows).

Checked after writing: the four JSON files parse; no string in any of them gained a double space, a
leading or trailing space, or a space before a comma or full stop; every sentence-level cut left the
sentences on either side of it joined by a single space; no supplier `role` is empty and none exceeds
two sentences.

---

## `data/suppliers.json` — 6 rows

| Row | Applied |
|---|---|
| Soitec, `role` | Cut. The role is now the one Smart Cut sentence; the `aiRelevance` beside it still carries the AI reading, so nothing is lost on the card. |
| Vertiv, `aiRelevance` | Applied verbatim. *critical* now appears on this card only as the chokepoint band. |
| Iluvatar CoreX, `aiRelevance` | Applied verbatim. |
| MetaX, `aiRelevance` | Applied verbatim. |
| Wuhan Jingce Electronic, `aiRelevance` | Applied verbatim. |
| Hua Tian Technology, `aiRelevance` | The row offered two approved wordings; the shorter one is in: `Domestic packaging capacity that Chinese AI accelerators depend on.` It keeps the original's noun-phrase shape, where the longer alternative turns the sentence passive to reach the same fact. |

## `data/landscape.json` — 24 rows

| Row | Applied |
|---|---|
| nvidia-a800, `notes` | Applied verbatim. Paired with the same sentence in `landscape-notes.md`, which is edited to match. |
| nvidia-b200, `notes` | Tail cut as proposed; the sentence now ends at `the module Nvidia quotes.` |
| nvidia-vr200, `notes` (bandwidths) | Applied verbatim. |
| nvidia-vr200, `notes` (BF16) | Applied verbatim. |
| nvidia-h800, `notes` (interconnect) | Applied verbatim. *allowed* goes here without cost: both sources are named in the same sentence, so the shortened line makes no claim about what nobody publishes. |
| nvidia-h800, `notes` (averaged) | Applied verbatim. |
| nvidia-h100, `notes` | Applied verbatim. |
| google-tpu-v6e, v5p, v4, `notes` | `Those fields are empty.` in all three, applied together. |
| google-tpu-v5e, `notes` | Applied as proposed, with one character kept: `Epoch AI’s` retains the curly apostrophe it has on disk, since the row does not name that character. |
| google-tpu-v4, `notes` (power) | Applied verbatim. |
| google-tpu-v4, `notes` (Epoch) | Applied verbatim. |
| google-tpu-v5e, `exportStatus` | Applied verbatim; the three comparison chips stay named. |
| meta-mtia-v2, `exportStatus` | Applied verbatim. |
| meta-mtia-v2, `notes` | Applied verbatim. |
| microsoft-maia-200, `notes` | **Adapted** — see below. |
| intel-gaudi2, `precisionNote` | Applied as proposed, with `Intel’s` carrying the curly apostrophe the deleted clause used. |
| intel-gaudi2, `notes` | Applied verbatim. |
| microsoft-maia-100, `notes` | Applied verbatim. |
| meta-mtia-400, `precisionNote` | Applied verbatim. |
| cambricon-siyuan-590, `notes` | Applied verbatim. |
| huawei-ascend-910c, `notes` | Ends at the outlet, as proposed. Paired with the same clause in `landscape-notes.md`, which is edited to match; both are done. |
| amd-mi300x, `notes` | Applied verbatim. |

## `data/exposure.json` — 7 rows

| Row | Applied |
|---|---|
| Nova, FY2021 `note` | Applied verbatim; the note is now the one sentence about the total-revenue line. |
| Nova, FY2022 to FY2025 `note` | Cut. `note` is set to an empty string on all four rows. The site tolerates it: the field is read only in the cell tooltip in `src/app.js` (`r.note ? … : ''`), and the build never touches it, so an empty string prints nothing and the `basis` string still carries the disclosure fact. |
| BE Semiconductor Industries, FY2021 `note` | Applied verbatim. |
| SK hynix, FY2025 `note` | Applied verbatim. The Korean figures, the 24.6% and the 백만원 unit are untouched. |

## `data/chokepoint-matrix.json` — 33 rows

| Row | Applied |
|---|---|
| EDA software, `note` (CSET correction) | Applied; the note now opens the comparison at `CSET's own 2019 figure…`. |
| EDA software, `note` (Siemens) | Applied verbatim. |
| EDA software, `trend` | Applied verbatim. |
| Core IP, `method` | Applied verbatim. |
| Silicon wafers, `note` | Cut; the note now ends on the 2019 CSET split and what has moved since. |
| Photoresist, `note` | Applied verbatim, ending `…six years older than this one.` as the row writes it. |
| Specialty gases, `note` | Applied verbatim. |
| Etch tools, `note` | Applied verbatim. |
| Photomasks, `note` (oldest) | Applied verbatim. |
| Photomasks, `note` (columns) | Applied verbatim. |
| Mature logic, `note` | Applied verbatim. |
| Leading-edge logic, `note` (estimate) | Applied verbatim. |
| Leading-edge logic, `note` (measurement) | Applied verbatim. |
| DRAM manufacturing, `note` (IDC) | Applied verbatim. |
| DRAM manufacturing, `note` (`Three caveats.`) | Cut. The three sentences that follow are unchanged and still read as a list. |
| HBM, `note` (fourth supplier) | Applied verbatim. |
| HBM, `note` (IDC defence) | Applied verbatim; the prospectus attribution survives in one clause. |
| Advanced packaging, `method` | Applied verbatim; the list of what was checked stays, the search count and date go. |
| Advanced packaging, `note` (`Shares withdrawn…`) | Cut, with the two identical instances below. |
| Advanced packaging, `note` (searches) | Applied verbatim. |
| Advanced packaging, `note` (buyer split) | Applied verbatim. |
| Advanced packaging, `note` (what it rests on) | Applied verbatim. |
| Advanced packaging, `note` (geography) | Applied verbatim; it is now the note's last sentence. |
| ATP, `note` (`Read the row as 2022.`) | Cut. `asOf` prints 2022 and the note still opens `Four years old…`. |
| ATP, `note` (`Two things about the measure matter.`) | Cut. The note now runs `…would make a denominator. It is by site rather than by headquarters…`; *It* refers to the measure named in the sentence before, as the row anticipated. |
| IC substrates, `note` (`Shares withdrawn…`) | Cut. |
| IC substrates, `note` (Ibiden) | Applied verbatim. |
| Server assembly, `method` | Applied verbatim. |
| Server assembly, `note` (`Shares withdrawn…`) | Cut. |
| Server assembly, `note` (Nvidia anchor) | Applied verbatim; it is now the note's first sentence. |
| Server assembly, `note` (`Read that as…`) | Applied verbatim. |
| Server assembly, `note` (old number) | Cut; the note ends on the ODM geography. |
| AI accelerator design, `trend` | Applied verbatim, ending at the split. |

## `data/chokepoint-matrix-notes.md` — 15 rows

| Row | Applied |
|---|---|
| The rows with no shares (five rows) | All applied verbatim. The White House and Epoch AI links in the paragraph are untouched; only the expedition around them goes. |
| Where the numbers are weakest (two rows) | Applied verbatim. |
| Specialty gases (two rows) | Applied verbatim; the METI figures after the colon are unchanged. |
| Leading-edge logic (three rows) | Applied verbatim. |
| Two dates lag | Applied verbatim. |
| Basis and sources | Applied verbatim. |
| `relayed` | Applied verbatim. |

## `data/exposure-notes.md` — 7 rows

| Row | Applied |
|---|---|
| What "China revenue" means (Samsung, `and say so`) | Applied verbatim. |
| What "China revenue" means (`We checked the figures…`) | Applied; the paragraph now states the figures and where they appear, without the homework line. |
| What "China revenue" means (`We compute chinaShare…`) | Applied verbatim. |
| SK hynix (Korean quotations) | Applied verbatim; the Korean line quoting stays, its justification goes. |
| SK hynix (DART) | Applied verbatim. The source-rule date goes; DART is still named as statutory. |
| `Nova is the one exception below.` | Applied verbatim. |
| Nova, `Treat it as one significant figure.` | Applied verbatim. |

## `data/landscape-notes.md` — 5 rows

| Row | Applied |
|---|---|
| AWS Trainium3 | Applied verbatim. |
| Huawei Ascend 910C | Applied verbatim, and its pair in `landscape.json` with it. |
| A800 | Applied verbatim, and its pair in `landscape.json` with it. |
| Supported formats, left unknown | Applied verbatim. |
| Supported formats, twenty-seven cells | Applied verbatim. |

---

## The one adaptation

`landscape.json`, microsoft-maia-200 `notes`. The row proposes:

> `Epoch AI's roughly 820 mm2 die figure is for Maia 100 rather than for this part, and no source publishes a Maia 200 die area.`

What went in keeps one word of the original:

> `Epoch AI's roughly 820 mm2 die figure is for Maia 100 rather than for this part, and no allowed source publishes a Maia 200 die area.`

`qa/speak-hunt-d.md` itself rules the phrase off limits, under the three things it deliberately did
not flag: *No allowed source …* is "a precise hedge, and every plain-English replacement ("no source
publishes", "no published source") makes a claim the site cannot support". The row's own point — the
draft history goes, the trap survives — is unaffected by keeping the hedge. Every other row that
touches the phrase keeps it, including the two nearby (Advanced packaging `method`, AI accelerator
design `trend`).

## Rows skipped

None.

## Two things to look at, no edit made

- intel-gaudi2 `precisionNote` now reads `…those are the figures above. Epoch AI’s hardware database
  carries 450 TFLOPS BF16 and the same 865 FP8; the figure above is Intel’s.` Two *above*s in
  adjacent sentences, both from the approved text. It is correct and it reads a little doubled.
- The proposed replacement for nvidia-vr200 `notes` ends `neither is averaged away`, and so does the
  one for nvidia-h800 `notes`. Different chips, so no reader sees them together unless they read the
  AI Chips table end to end, and the phrase is the list's own.

## Build and audit

`node -e "['data/suppliers.json','data/landscape.json','data/exposure.json','data/chokepoint-matrix.json'].forEach(f=>JSON.parse(require('fs').readFileSync(f,'utf8')))"` — parses, no output.

`node build/build.js` — exit 0, no `warn:` line and no `WARN` line in the report:

```
built 2026-09-11T00:07:49.516Z
source tiers: A 322 · B 22 · disallowed 0 · unclassified 0
chapters: 16 + geopolitics
words: 22969
sources: 344
landscape: 35 chips · suppliers: 220 · timeline: 50 · matrix: 20 · glossary: 91 · controls: 40 · exposure: 108
```

`node build/audit-data-sources.js` — exit 0, all thirteen data files report `0 disallowed`, including
the four files and three notes files edited here:

```
chokepoint-matrix-notes.md: 10 urls, 0 disallowed
chokepoint-matrix.json: 15 urls, 0 disallowed
exposure-notes.md: 0 urls, 0 disallowed
exposure.json: 50 urls, 0 disallowed
landscape-notes.md: 51 urls, 0 disallowed
landscape.json: 81 urls, 0 disallowed
suppliers.json: 218 urls, 0 disallowed
```

The URL counts are identical to the ones the same command printed before this pass. The `words`
figure is not comparable with an earlier run: it counts chapter prose, which the sister passes were
editing at the same time, and nothing in this pass touches a chapter.
