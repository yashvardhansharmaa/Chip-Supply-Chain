# Critique — compute-governance researcher

Read 10 September 2026 against a local build, scoping two papers: HBM controls, and the durability of
Taiwan's position. Earlier reports read first. Screenshots: `qa/crit/res-*.png`.

## Verdict

The scholarship is better than the plumbing, and the plumbing is better than the shelving. The
chapters do things I do not see elsewhere: chapter 10 walks the 5 December 2024 rule from ECCN
3A090.c to the JEDEC bandwidth numbers and says which stacks it catches; `landscape.json` carries
dense FP16/FP8/FP4 for thirty of thirty-five chips and an `exportStatus` that does the TPP and
performance-density arithmetic chip by chip; the exposure series computes every share from filed
figures and never copies a filing's own percentage. What is missing is not rigour. It is that the
site's best research apparatus is unreachable. Four methodology notes — `chokepoint-matrix-notes.md`,
`exposure-notes.md`, `landscape-notes.md`, `control-thresholds-notes.md` — are built, shipped to
`dist/data/` and return 200, and are referenced **zero times** in `index.html`. They hold the CSET
lineage, the headquarters-versus-site conversion rule, the two conversions the author knows are
contestable, a "where the numbers are weakest" section, and a firm-by-firm "Firms not covered, and
why". That is the difference between a dataset I cite and one I read. The Methods page took the
rubric's band tests and the "what this site does not cover" list with it when it went, so there is
now no scope statement at all. A very good reference wearing a magazine's clothes.

## What I would reuse today

The China revenue series (103 rows, 20 firms, `basis` on every row, an EDGAR R-file per cell) — I
would cite it as is. `landscape.json` for chip specs and export-status reasoning. `control-flows.json`:
"what could legally flow on date X", nine flows whose every state cites an event id, is a research
object I have not seen built before. The 43-event timeline. And `chokepoint-matrix.json`, the most
citable file here, which is no longer rendered anywhere on the site.

## Ten changes, ranked

1. **Link the four notes files.** They exist and are served. An hour, no new sourcing.
2. **Restore a scope-and-rubric page.** Files are in `qa/prototypes/`. The How-to box defines 1 and 5
   and nothing between. Half a day.
3. **Make the score defensible or demote it.** Across 17 chapters: eight 5s, eight 4s, one 3;
   concentration is only ever Extreme or High though the box offers four levels; the two are collinear
   but for chapters 1 and 14. The score carries about one bit beyond concentration. And chapter 17,
   Geopolitics, is scored 5/5 with a 10+ year substitution time, which is a category error — it is not
   a stage. Publish band tests against a supplier count and a CR1 threshold, score only process stages,
   and give substitution times a confidence letter. One to two days.
4. **Concentration over time.** Every matrix row is one year with a prose `trend`. A paper needs
   CR1/CR3/HHI per segment per year. Feeds: ETO `provision.csv` (already cited, git-versioned), CSET
   2021 Table 1, SIA/BCG 2021 and 2024, segment revenue from ASML, AMAT, Lam, KLA and TEL filings.
   A week for the five equipment segments.
5. **Structured control fields.** No numeric `tpp`, no `eccn`, no `controlled` flag on any chip; die
   area is null for 25 of 35 and package size for 33 of 35, so 3A090.c's memory bandwidth density
   cannot be computed for a single chip — the exact number an HBM paper needs. Flag the bandwidth basis
   too: Cerebras at 43,200 TB/s and Groq at 156 TB/s are on-die SRAM in the same column as HBM. On
   events add FR volume and page, docket, rule type, effective date. Two to three days.
6. **Licensing and enforcement counts.** Nothing here says whether a control bites. BIS's annual report
   to Congress and its §1758 reporting give applications, approvals, denials and values by country;
   DOJ and BIS releases give cases; GAO has audited the process, and is already in the bibliography.
   A week, and the gap a paper hits most often.
7. **Compute stocks and clusters.** "FLOP" appears zero times across 17 chapters. No installed base, no
   cluster inventory, no cloud or remote access as a control question. Epoch AI is allowed and already
   cited. One chapter plus a dataset.
8. **Bulk download, data dictionary, licence, version.** Nine Copy buttons, no Download, no archive, no
   link to `/data/`, no provenance line inside an export, nested objects JSON-stringified into CSV
   cells. Add per-file download, a zip, a fields table, CC BY 4.0 plus MIT, and a version in the cite
   block. Half a day.
9. **Mark relayed numbers, and admit DART.** The policy is domain-based, not provenance-based, so IDC
   (via SK hynix's 424B4), TechInsights (via ETO), Gartner (via KLA) and Bank of America (via the SK
   hynix newsroom) all enter as Tier A; the prose names some and not others. Add a `relayedFrom` field.
   And Korea's DART is the statutory analogue of EDGAR: the current reading is why the largest HBM
   maker is absent from a China-exposure series. A day.
10. **Join keys.** `suppliers.json` has no id, `exposure.json` no CIK or accession field, nothing an
    ETO node id, LEI or coordinates. Two days, and the 220 firms become joinable.

## Factual issues

- **Geopolitics table, HBM row**: "South Korea | 56% | SK hynix alone, revenue, 1Q26". The country
  column takes one firm's share. The site's own source, SK hynix's Form 424B4, gives Korea 82.5% for
  2025 and 76.9% for 1Q26 — chapter 10 prints both. Twenty points off the Korean chokepoint, in the
  one table a reader screenshots.
- **`chokepoint-matrix.json`, Core IP note**: "would move roughly 48 points from Other to JP". Arm's 48
  points sit in the GB column; Other is 5. The notes file states it correctly, so the row note is wrong.
- **ATP row** is 2022 data from the White House 100-day review, and is what the Taiwan panel shows as
  "28%, 2022" — four years stale in a table otherwise on 2025–26 figures, in the segment that moved most.
- **The HBM threshold** is "package area" in chapter 10 and "package or stack area" elsewhere. Quote the
  rule text once, with the volume and page. And **Synopsys** is $7.05bn FY2025 in the matrix note
  against $8.0B CY2025 in chapter 1: both defensible, neither reconciled.

## What would bring me back monthly

Not more chapters. A dated, versioned, licensed data release with the notes attached and a changelog
saying what moved, so citing the September cut and the October cut are different acts. Then two
running series I cannot build in an afternoon: concentration by segment by year, and BIS licence
counts set against the flows on the board. Those two plus the board would make this the first place I
look when a rule drops, rather than the second place I check after the Federal Register.
