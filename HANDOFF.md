# Chokepoints — handoff (updated 9 September 2026, second session)

Live site: https://yashvardhansharmaa.github.io/chokepoints/ (redeploys on every push to `main`).
Repo: https://github.com/yashvardhansharmaa/chokepoints. Build: `node build/build.js` → `dist/index.html`; report in `dist/build-report.txt`.

## Since the first pause (9 Sept, second session)

- Writing skill added (`.claude/skills/writing-well/SKILL.md`, Zinsser); a combined source-quality + prose pass ran on every chapter (below-bar citations 53 → single digits; see `dist/build-report.txt`).
- New Controls page: `data/control-thresholds.json` (40 thresholds) and `data/exposure.json` (China revenue share by firm-year from filings), rendered by `Controls` in `src/app.js`.
- Research tools: site search (Ctrl+K), section permalinks, dataset export, cite block.
- Design memo at `qa/design-memo.md` with references in `qa/design-refs/`; applied: heading ramp on the reading face, dark-mode chapter numerals, lighter figure tracks, phone masthead wrap. Pending decision: the "cold open" hero (see memo H2) once `qa/prototype-hero.html` is reviewed.
- Credits now read "Made by Yashvardhan Sharma with Claude".

## State at pause

| Area | Status |
|---|---|
| 17 component chapters + Geopolitics essay | Written, fact-checked (`qa/factcheck-report.md`), 16 of 18 through the editing pass (`brief/EDITING_BRIEF.md`). **Chapter 08 and chapter 18 were still being edited** (no `plain` field yet); chapter 11 may be partially edited (1,863 words, target 1,050–1,350). |
| Specimens | All 19 exist in `specimens/`. `sem-column` and `cowos-exploded` landed last and have not been reviewed by the design lead; check `qa/<name>.png`. |
| Data | `landscape.json` (19 chips), `suppliers.json` (220), `export-controls-timeline.json` (45), `chokepoint-matrix.json` (20 rows; two rows labelled site estimates), `glossary.json` (74). |
| Source quality | `brief/SOURCE_POLICY.md` + `data/source-tiers.json`. Build report shows **53 Tier D citations** still in chapters (26 in chapter 17). A source-quality pass on chapters 12–14 and a dataset audit (`suppliers.json`, `landscape.json`, `landscape-notes.md`) were in progress; their logs, if written, are `qa/source-audit-chapters.md` and `qa/source-audit-data.md`. |
| Design | Stack, Briefing, Landscape, Suppliers, Geopolitics, Glossary, Sources views done; light/dark; mobile layout with sticky specimen band. |

## To resume (in order)

1. `git pull`, `node build/build.js`, read `dist/build-report.txt` (words, tiers, warnings).
2. Finish the editing pass where it stopped: chapters **08** and **18** (and re-check 11) per `brief/EDITING_BRIEF.md` (target lengths, "In plain terms" `plain` field copied verbatim as the first paragraph under "How it works", bullets for enumerations, keep every citation).
3. Run the source-quality pass per `brief/SOURCE_POLICY.md` on every chapter still showing `D n > 0` in the build report (start with 17, 04, 09, 16, 02, 06, 10), plus the datasets if `qa/source-audit-data.md` is missing. Goal: D 0 everywhere. Replace with Tier A/B sources or delete the number.
4. Design-lead review of `qa/sem-column.png` and `qa/cowos-exploded.png`; fix if they do not read.
5. Final QA in the browser (desktop 1366 wide, narrow 800, dark mode): hero, one chapter with figures, Briefing, Landscape, Suppliers, Geopolitics matrix and timeline, Glossary. Check the console for errors.
6. Optional: publish `dist/index.html` as a claude.ai artifact; tighten the README; consider making the repo public.

## Known open items

- Matrix rows "Leading-edge logic manufacturing (≤5 nm)" and "Advanced packaging (2.5D/3D)" are site estimates; a published 2025–26 country split would be better.
- Fact-check report flagged: ch01 and ch17 use non-standard section titles (fine), ch12 says per-unit CoWoS cost is untraceable while ch17 builds a BOM on estimates (labelled as estimates).
- Timeline entry 2026-03-20 (Huawei Ascend 950PR) rests on trade press; upgrade if a Huawei release is found.
- The hero credits line names the client; edit `build/build.js` (`credits`) if the wording should change.

## Worker lessons (for whoever orchestrates next)

- Forbid subagents in worker prompts (the concurrency cap counts them and they stall).
- The WebSearch budget is shared and exhausts early; tell workers to use WebFetch on primary sources and Google News RSS.
- Tell workers to save drafts early; API connection drops kill agents silently.
