# Code review, stage two: fixes (21 October 2026)

The owner approved items 1 to 12 of the merged plan (`qa/code-review/PLAN.md` items 1 to 14 in its numbering, Tier 1 and Tier 2) and said "start fixes". Four builders work in parallel on one shared tree. Read `PLAN.md`, then the review reports your items come from (`performance.md`, `correctness.md`, `accessibility.md`, `structure.md`). Each report has the evidence, the file and line, and a proposed fix. Adapt the fix to the source as it is now: AI Chips was rebuilt today (commit 5bfeb78), so line numbers have moved.

Repo: `/Users/yashvardhansharma/Library/Application Support/Claude/scratch-workspaces/0a31970a-fa59-4805-8c4d-4478d5acd73a/47d04afc-9f92-4fb3-9c9e-e634493ca6a4/scratch-2026-09-09-7267aa/chokepoints`.

## Who owns what
Shared files (`src/app.js`, `src/styles.css`, `src/template.html`, `build/build.js`): edit only your own functions and selectors, with the Edit tool and small unique anchors. Never use Write on a shared file, never reformat or revert another builder's lines, and if an Edit fails because the file changed, read it again and retry.

| Builder | Items (PLAN.md numbering) | Owns |
|---|---|---|
| **speed** | 1, 2 | the boot path: the `<head>` pre-boot and view-hiding in `template.html`, `boot()` and `Router` start-up in `app.js`, `Stage` and specimen building in `app.js` and `src/kit.js`, `content-visibility` rules for chapters in `styles.css` (screen only), the print cover art's loading (with print's own code in `src/modules/print.js` if needed), and the static pages' unused image in `build/modules/social.js` |
| **readers** | 3, 4, 5, 6, 8, plus the accessibility items in the same components | Export Controls `now` and the board's date announcement; the Glossary (`src/modules/lookup.js`, `lookup.css`, the passage index in `build/build.js`): passage links, the popover closing, non-passages, keyboard focus to the card, Enter in search, the Company page links; Suppliers filters and table sort focus; the chart tooltips' Escape; timeline mention links; the popover link by keyboard; the stale search entry |
| **a11y** | 7 (everything not in readers' components), and the Home tab no-op | `scroll-padding` for the masthead and the phone strip; the skip link (`#main`, and the narrow-screen `scrollIntoView` in `Router.route`; coordinate with speed, who owns Router start-up, by editing only that one line); search as a real modal with a status for results (`Tools` in `app.js`); the phone Contents sheet's focus; contrast fixes (animation step numbers, atlas stop numbers, dark table peaks, the search placeholder, control edges at 3:1 or more); Back to top hidden properly; the two `outline: none` rules |
| **safety** | 10 to 14 | `build/build.js` validation (fail loudly on bad content); `qa/scripts/check-integrity.js` (non-zero exit on errors, an explicit allowlist for the known Veeco case); `.github/workflows/` (integrity and a headless smoke tour in CI); a new `qa/scripts/smoke.js` (or `.py`); `page-dates.json` dating by content only; `.gitignore`; untracking old QA images with `git rm --cached` (never delete files on disk, never rewrite history); a size guard; `brief/` and `HANDOFF.md` updates (drop the auto-commit loop instruction); a one-page `docs/RUNBOOK.md` for the weekly refresh |

## Rules
- **Build:** `node build/build.js` writes `dist/`, which everyone shares. Run `node --check` on edited JS first. If the build fails in code you do not own, wait a minute and retry. Do not fix it yourself; note it.
- **Look:** `http://127.0.0.1:8765/` serves `dist/`. Do not start or stop servers or use the in-app browser. Headless shots and DOM checks: `python3 qa/design/shots/design-chapter/proof/dc_shoot.py "<url>" <out.png> [--mobile] [--width W --height H] [--wait 7] [--eval "<js>"] --port <yours>`. Ports: speed 10300 to 10319, readers 10320 to 10339, a11y 10340 to 10359, safety 10360 to 10379. The phone measurement is `qa/code-review/perf/run_phone.sh <label>` (README there). Speed must report before and after.
- **Prove:** every fix gets a repro before and a pass after (a DOM check, a shot, or a measurement), saved to `qa/code-review/fixes/<slug>/`. Check 1440, 1024, 390 and 320, light and dark.
- **Print and PDFs must not change** unless a fix needs it. Speed and a11y: anything you hide, defer or lazy-load must still print. Check `python3 build/chapter_pdfs.py lithography --edition 2026-10-21 --logs <dir>` with your own port (pdf.py takes `--port`; use your range) and compare its page count and layout report with today's. Do not re-render all PDFs.
- **Words** you add follow `.claude/skills/writing-well/SKILL.md`: no em dashes, no semicolons, no "X, not Y", no rhetorical questions, no "we", "you" or "this site", American spelling. The footer's words do not change. Light stays the default theme.
- **Privacy:** never put an email address or other personal data in any request, header, URL or file. The smoke test and CI reach only the local server, or the built files.
- **Checks before you finish:** `node qa/scripts/check-speak.js`, `node qa/scripts/check-integrity.js`, `node qa/scripts/check-sources.js`, and no horizontal scroll at 320 on your pages.
- No subagents. No commits or pushes. No fetching web pages. Save as you go.

## Report
Write `qa/code-review/fixes/<slug>-notes.md`: each item (its ID in the source report), the files and functions touched, the proof, and anything not done and why. Final message under 300 words.
