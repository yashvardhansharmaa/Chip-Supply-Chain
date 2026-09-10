# Final line edit: board data, suppliers, notes

61 strings: `control-flows.json` 10 (8 labels, 2 what-lines),
`export-controls-timeline.json` 16 (3 titles, 3 gists, 10 summaries),
`suppliers.json` 30 across 27 firms, the three notes 5. JSON parses, build clean,
labels inside 10 words, gists inside 16, roles inside two sentences.

## The five that mattered

**Two labels named the wrong outcome.** A `denial` state read `Case by case below
21,000 TPP and 6,500 GB/s`, contradicting its own pill. Now `Denial above 21,000
TPP or 6,500 GB/s DRAM bandwidth`, which also sets against the 2022 label as one
threshold moving. SMIC had the same fault; now `SMIC listed; denial at 10
nanometres and below`.

**HBM said licence, meant denial.** `Licence for stacks above 2 GB/s per mm²` is
the house form for a `case` state. Now `Denial for stacks…`.

**Dropped word.** Entity List what-line: "when a listed party is to the
transaction" → "when a listed firm is a party to the transaction".

**Roles repeating their shareNote.** Advantest, "The leading maker of automated
test equipment…" → "Makes automated test equipment…", the 66 percent left to the
shareNote beneath. KLA lost "The dominant supplier"; sixteen more rows lost
"leading".

**A note describing a gone view.** `chokepoint-matrix-notes.md` said rows with
`shares: null` "render as dots". The table is gone and `summary-a.js` drops them,
so now "no country panel can show them".

Also: `October 7 rules` → `October 2022 rules`, "five fields" → six, six curly
apostrophes, `Screen` → `SCREEN`, `tapeout` → `tape-out`, `per cent` →
`percent`, the ZTE summary's closing sentence cut as the gist verbatim, and
`pays for it twice` cut.

## Left for you

- **`entity` `suspendedUntil` is 2026-11-10; its summary, label and the
  thresholds note end that stay on 9 November 2026.** The board prints both.
- **25 of 50 summaries exceed 90 words**, to 156. The overruns are cited facts,
  so I cut clutter only.
- Site-wide, not one file's: `exposure-notes.md` uses `%` 23 times and "percent"
  four (chapters run 327 to 188); `glossary.json` has "License Exception" against
  the board's "Licence"; the thresholds note dates the Dutch eCFR footnote 9
  September 2024, the timeline 7 September.
- `china-market` holds the dichlorosilane duty, a Japanese gas in a flow called
  "Foreign chips inside China". I named it in the what-line.
- That note expects pressure "with every quarter that Chinese buyers spend at the
  H200 line"; the 26 August filing says the licences went largely unused.
- `build/build.js:413` says "the nine things that move"; there are ten.
