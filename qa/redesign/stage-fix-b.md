# Fix B: the Export Controls board and chapter 16 (28 October 2026)

Branch `redesign-fixb`, cut from `redesign` at fceef96. Preview http://127.0.0.1:8782/. Shots before (8766) and after (8782) are in `qa/redesign/shots/fix-b/`, named `before-<id>-…` and `after-<id>-…`. Fetched sources are in `MAIN/qa/final-qa/fix-b/fetched/`.

## Findings

**B1 (blocker). Done.**
- A stay now names the measure it suspends (`"suspends"` on the state), and the pill keeps the policy in force today.
  - US goods and technology: Presumption of denial, with the tag "Affiliates rule suspended until 9 Nov 2026" (90 FR 50857; checked on govinfo).
  - Critical minerals to everyone else: Case by case, with the tag "October 2025 rules suspended until 10 Nov 2026". MOFCOM 2025 No. 70 suspends Nos. 55 to 58, 61 and 62 only (checked on mofcom.gov.cn).
  - Critical minerals to America: the pill was "Prohibited", drawn back. It now reads Case by case, with the tag "Ban suspended until 27 Nov 2026". MOFCOM 2025 No. 72 suspends paragraph 2 of 2024 No. 46 only (checked), so licensing continues. `"resumes": "prohibited"` brings the ban back once the data confirms the stay is over.
  - Each label now says what stays in force, and none repeats its tag.
- CSS (`controls.css`, appended):
  - `.cf-pill.is-suspended` now wins over the denial pill's 1.5 px outline.
  - The ramp's dashed dot now wins over the closed fill.
  - Today all three stays cover one measure inside a row, so all three rows match: an ink pill and a named tag. The drawn-back pill remains for a stay that holds up a row's whole outcome.
- The board key's Suspended line now explains the named stay.

**B2 (blocker). Done.** The "AI chips to the rest of the world" row:
- Its route reads "US → D:1, D:4 and D:5, the UAE, and D:5 or Macau firms".
- Its text gives the scope BIS enforces, from 91 FR 43034 (checked on govinfo): D:1, D:4 and D:5 not in A:5 or A:6, the UAE, and entities headquartered in D:5 or Macau, or with an ultimate parent there, wherever located.
- It gives the UAE exemptions.
- The AI Diffusion Rule (AIA, LPP, the 790,000,000 TPP cap) is now in the past tense. It says Commerce said on 13 May 2025 that it would rescind the rule, as the BIS press release does (checked).
- The timeline's 13 May 2025 entry cited the July 2026 enforcement statement to the May 2025 press release. That sentence now sits in the 10 July 2026 UAE entry, whose source holds it.

**B3. Done (the brief's first option).**
- `control-flows.json` has `"checked": "2026-10-28"`, the day the board's data was last checked against its sources.
- `Geo.stateAt` reads states only up to that day:
  - A stay whose end comes after it reads "<measure> due to end <date>, extension not confirmed", never ended.
  - A state dated after it reads "Change due <date>, not confirmed" and is not applied.
  - "Board as of" adds "· data checked 28 Oct 2026" once the reader's day passes the check.
  - Coming up keeps a deadline that has passed since the check, as "Passed, outcome not confirmed".
- The static page reads the board the same way.
- `qa/redesign/fix-b/future-board.js` moves the clock to 28 Oct, 12 Nov and 28 Nov 2026 and asserts this. All three pass (`future-board.txt`; shot `after-b3-board-12nov-1440.png`).
- **Upkeep:** set `checked` to the review day at each data review. Add a state when a stay ends or is extended.

**B4. Done.** Twelve board states whose second date is the Federal Register's publication now carry `"published"` and read "· published <date>". Each publication date and effective date was checked on govinfo:
- the ZTE order and its end;
- the Huawei, SMIC, Biren and Moore Threads, and March 2025 listings;
- both 2020 FDPR rules;
- the affiliates rule and its stay;
- the Diffusion Rule;
- the UAE rule.

The two Nvidia 8-K dates stay "announced", since that is the day Nvidia disclosed each one.

**B5. Done.**
- Dutch and Japanese controls are routed "Netherlands and Japan → all destinations, China included".
- The tools row now shows both policies, each followed by whom it covers (`"for"` and `"also"`):
  - 2022 state: Presumption of denial (most fabs in China) and Case by case (fabs of US and allied firms), from 87 FR 62186, 742.6(b)(10).
  - From November 2023: Presumption of denial (advanced fabs) and Case by case (other fabs), from 15 CFR 742.6(b)(10)(i) and 744.23(d) in the 2026 CFR on govinfo.
- The row's text adds the presumption of approval for fabs of US- and allied-headquartered owners.

**B6. Done.** BIS's own words are quoted and attributed: "the second-highest penalty ever imposed by BIS" (press release of 12 February 2026, checked). The gist says BIS called it that.

**B7. Done.**
- The 2022 change of aim is now in Sullivan's words: before, "only a couple of generations ahead"; now, "as large of a lead as possible". Both were checked on the White House archive.
- The judgment that the rules tried to push China back is attributed to CSIS (source 7, checked).
- The section title is now "US export controls, 2018 to today", with its flashcard section updated. "the campaign depends on" now reads "US controls depend on".
- The Micron fact now cites the CAC notice of 21 May 2023 (checked), in two sentences.

**B8. Done.**
- Source 35 now has a title and date: "Developments concerning Nexperia", letter of 19 November 2025.
- "about 40 percent" now reads "In March 2026 CSIS put … at 40 percent". CSIS's piece of 24 March 2026 says "now" and "40 percent" (checked). The key fact and the flashcard were updated to match.
- Figure 16.1:
  - Day dates now read day first ("16 May 2019"), via `figDate` in `build/build.js`. Only 16.1 has day dates.
  - "15%" now reads "15 percent".
- Timeline dates now read day first ("15 Apr").
- Every board date uses one set of month abbreviations ("Sep", as the static page has it).
- The static page now says "Updated 28 October 2026", from the page date.
- The 1 September 2023 Dutch card cites Staatscourant 2023, 18212. The citation links to the gazette (`"cite": {"url"}`), checked: published 30 June 2023, in force 1 September 2023. The card's source stays ASML's statement.
- TPU v4: "allowed sources" now reads "no cited source shows".
- The Groq row now names the ECCN 3A090.a license rule.
- "Trump clears…" is now "White House clears H200 sales to China".

**B9. Done.** A text column after a figure column now keeps an 18 px gap (`src/styles.css`). This also fixes the same join at 1440 and in any other table with a figure column before a text column.

**B10. Done.** Each chart now has a line saying what it measures:
- Figure 04.5: "Net system sales leave out service and field option sales…"
- ASML's chart on Export Controls, and its static-table row: "Share of total net sales, which include service and field option sales…". This uses a new `panelNote` on ASML's FY2025 exposure row.

**B11.** Unchanged, as briefed.

## Sources added
- Staatscourant 2023, 18212, `zoek.officielebekendmakingen.nl` (Tier A, the Dutch official gazette). The domain was added to tier A in `source-tiers.json`.
- Bibliography entry for the government.nl Nexperia letter, already cited (Tier A).
- Already in the bibliography and now cited in chapter 16: the CAC notice of 21 May 2023 (Tier A).
- Checked, not new: 90 FR 50857, 91 FR 43034, 91 FR 1684, MOFCOM 2025 Nos. 70 and 72, the BIS press releases of 13 May 2025 and 12 February 2026, CSIS (11 October 2022 and 24 March 2026), and the 2026 CFR text of 742.6 and 744.23.

## Files outside the section's own list (small, for the merge)
- `build/build.js`: `figDate` and `exposureViz` (the panel line).
- `src/styles.css`: one table rule and `.ex-pnote`.
- `content/04-lithography.md`: the note on figure 04.5.
- `data/landscape.json`: the TPU v4 and Groq export strings.
- `data/exposure.json`, `data/flashcards.json` and `data/source-tiers.json`.

## Checks (final build)
- `node build/build.js`: ok.
- check-speak, check-integrity, check-sources (2,820 citations, all A or B), check-size and check-seo: all pass.
- check-links --local 8782: no broken links.
- smoke --port 8792: 47 loads, no failures.
- check-perchapter: 336 of 336 pass.
- interact-chapter: 90 checks, all passed.
- stage-chapters (base 8782): 10 of 10 pass.
- check-cites: 3,304 marks, 0 problems.
- check-figs 8782: 112 of 112 pass.
- future-board: 3 of 3 pass.
- Outputs are in `qa/redesign/fix-b/`. No check was changed.

## Unconfirmed, or for the owner
- **The pill on "AI chips to the rest of the world" stays Case by case.** The CFR text gives a presumption of denial for D:5 and Macau, and approval up to the country cap elsewhere. No Tier A source shows how BIS reviews these applications in practice since May 2025.
- **BIS calls the Applied Materials penalty its second-highest.** ZTE's 2018 penalty was larger. The site quotes BIS and does not assert the ranking.
- **Chapter 16's key facts and table still use "%".** Section C's house-style item (C15) cannot touch chapter 16.
- **The HBM row's 31 December 2024 is the rule's compliance date.** It took effect on 2 December 2024. Left as it was.
