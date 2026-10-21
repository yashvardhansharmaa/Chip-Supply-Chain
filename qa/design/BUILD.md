# Design round, stage two: build (21 October 2026)

The owner approved the design review (`qa/design/review.html`, decisions in `qa/design/PLAN.md`) and said "build and push everything". Four builders now implement it, each on one part of the site. Read `PLAN.md` first, then your designer's report (it holds the exact CSS and JS each item needs, already proved on screenshots), then this file. The reports' code is a starting point: adapt it to the real source, and keep each change as small as the proof.

Repo: `/Users/yashvardhansharma/Library/Application Support/Claude/scratch-workspaces/0a31970a-fa59-4805-8c4d-4478d5acd73a/47d04afc-9f92-4fb3-9c9e-e634493ca6a4/scratch-2026-09-09-7267aa/chokepoints`.

## The owner's decisions that change the reports
- **Light stays the default for everyone.** Do not follow `prefers-color-scheme` on a first visit (design-front P3-2 is dropped).
- **The specimen caption stays as it is:** centered, and its plate keeps its current wording (design-chapter P3.2 is dropped, and so is the part of P2.5 that renames the plate to the object; the rest of P2.5, facts on one line and actions on the next, goes ahead).
- **Chart colors, the owner's middle way** (replaces design-chapter P1.3 and design-print P1-2; proof in `qa/design/shots/decide/middle.css` and `middle.js`, picture `decision-4-final.png`):
  - bar charts are one series: every bar `--bar-4` ink, the largest garnet (`--accent-fill`), its value in `--accent-ink`;
  - stacked bars: the largest segment garnet; the rest take, in data order, light `#2b63c4, #1f9a6d, #c9a10c, #5a48b8, #e06a1f` and dark `#4f86dc, #2a9670, #ad8f14, #7f6fd4, #c96a2a` (validated with the dataviz checks); segments past those five take a light tail (`#c9c6bf` light, `#4b5159` dark); a remainder ("Other", "Others", "All others", "Everyone else", "Rest of world", "… and all others", "…other companies") is hatched with a hairline edge; the lead's legend figure is `--accent-ink`;
  - the three country stacks (`wafer-concentration`, `resist-country`, `asml-region`) keep each country's own color from `COUNTRY_COLOR` with no repeats inside a chart: regions and remainders turn neutral (`#8a9099`, then `#b4b9be`), and "Europe" takes the EU color `--c2`.
  - Build this in `figure()` in `build/build.js` as classes or `data-` attributes, not inline colors, so print and dark mode follow; the static pages (`build/assets/chapter-page.css`) get the same rules.
- **Decision 13:** the chapter cards drop the leader's China line (`.lead-cn`, `build/build.js` around line 337, its CSS in `src/styles.css` and `build/modules/social.js`). The share stays in the Suppliers drawer, the Glossary firm card and the Export Controls chart.
- **Decision 10:** the PDFs print the chapter's existing flashcard questions above "Four things to remember".
- **Decision 11:** units on values for units of eight characters or fewer, figure columns right-aligned on tabular digits, number ranges in figure cells joined with an en dash (–, U+2013; the house rule bans the em dash only), and the two chart titles that spell "($M)" drop it.
- Dark `--bar-4` is `#636a73` everywhere (design-front's value; design-chapter's `#5f666f` is not used).

## Who owns what
Edit only what you own. Where a file is shared, edit only your own selectors or functions, with the Edit tool and small unique anchors. Never use Write on a shared file, never reformat or revert someone else's lines, and if an Edit fails because the file changed, read it again and retry.

| Builder | Owns | Shared files: your part only |
|---|---|---|
| **frame** (design-front) | `build/modules/walk.js`, `src/modules/walk.css`, `src/modules/summary-a.css` | `src/styles.css`: tokens in `:root` and the dark blocks, masthead and tabs, search, footer, `.gl-term`. `src/app.js`: `Theme`, `Tools` (search index, open). `src/template.html`: masthead, search, the pre-paint script, h1 changes. The footer partial in `build/build.js` (add the tile only: the footer's words, `credits` and `footerKey` must not change) |
| **chapter** (design-chapter) | `build/assets/chapter-page.css`, `build/modules/social.js` | `build/build.js`: `inline()`, `figure()` (bars, stacks, units), the table renderer, `nameplate()`, the chapter head, `contentsItem()`, the ledger foot, the order of sources and Previous/Next. `src/styles.css`: figures, `sup.cite`, `.fc-*`, `.prose .tl`, `.plate*`, `.ch-*`, `.chapter-sources`, `.howto`, `.contents-grid`, `.rail`, `.prose` tables. `src/app.js`: `Sections` (the rail). `src/template.html`: `{{RAIL}}` |
| **data** (design-data) | `src/modules/suppliers.css`, `controls.css`, `chips.css`, `lookup.css`, `lookup.js` | `src/app.js`: `Suppliers`, the board (`renderBoard`, `paintBoard`, `renderScrub`), `addExport`, `renderUpcoming`, `Landscape.buildUI`, the exposure table. `build/build.js`: `exposureViz`, the Glossary list labels. `src/styles.css`: `.timeline .cat`, `.ex-panel`, `.ex-legend`, `#exposure-table`, `.export-bar`, `.filters`. `src/template.html`: the ladder heading and key, the board scale |
| **print** (design-print) | `src/modules/print.css`, `src/modules/print.js`, `build/pdf.py`, `build/cards.py`, `build/modules/summary-brief.js`, `build/animate.py`, `build/summary_pdf.py` | `build/build.js`: the print still path (`img.anim-print`, near line 132) only. `src/template.html`: the print cover (`.print-title`) only |

Two items move between owners: the footnote-space fix is **chapter**'s (the regex in `inline()`), so frame skips its P2-5; the dark `--bar-4` token is **frame**'s, and chapter copies the value into `chapter-page.css`. The type and spacing scale (design-front P2-7) is a second pass, run by frame after the others finish: in this pass frame only adds the named tokens to `:root`.

Print depends on the others' HTML (HTML bars, the card without tags, the contents one-liners, the ledger key). Write the print rules now against the reports, then check them once the others are done: the main session will tell you. The contents one-liners and the ledger key must not print (the PDF contents page is full to within a line). Do not re-render the 17 chapter PDFs, the book or the cards until the main session says so; render single chapters (`python3 build/chapter_pdfs.py <id> --edition 2026-10-20`) or `pdf.py --only N` with your own port to test.

## How to work
- **Build:** `node build/build.js` writes `dist/`, which everyone shares. Run `node --check` on any JS you edited first. If the build fails in code you do not own, wait a minute and retry; do not fix it, and say so in your notes.
- **Look:** the server `http://127.0.0.1:8765/` serves `dist/`. Do not start or stop servers or use the in-app browser. If the server stops answering, stop and say so. Screenshots with WebGL: `python3 qa/design/shots/design-chapter/proof/dc_shoot.py "<url>" <out.png> [--mobile] [--width W --height H] [--wait 7] [--eval "<js>"] --port <yours>`. Ports: frame 9941, chapter 9942, data 9943, print 9944 (and for `pdf.py`, `chapter_pdfs.py` and `cards.py`, pass print's own ports: 9945 to 9949). `?only=<chapter-id>` loads one chapter, `?theme=dark` forces dark.
- **Prove:** for each item, a before and after at the same viewport, saved to `qa/design/build/<your slug>/`. Check 1440, 1024 and 390 (and 320 for overflow), light and dark.
- **Rules:** WCAG AA in both themes, visible focus, 24 px targets, `prefers-reduced-motion`, no horizontal scroll at 320, no layout shift, no new libraries, no fonts beyond static instances of the families already loaded. Do not edit `content/*.md` or `data/*.json`. Any visible words follow the site's writing rules (`.claude/skills/writing-well/SKILL.md`): no em dashes, no semicolons, no "X, not Y", no "rather than", no colon punchlines, no rhetorical questions, no "we", "you" or "this site", American spelling, "percent" in prose, dates day first. The footer's words stay exactly as they are.
- **Checks before you finish:** `node qa/scripts/check-speak.js`, `node qa/scripts/check-integrity.js` (one known warning: Veeco), `node qa/scripts/check-sources.js`, and `document.documentElement.scrollWidth` at 320 on your pages.
- No subagents. No commits or pushes. Save as you go.

## Report
Write `qa/design/build/<slug>-notes.md`: each item done (report ID), the files and functions touched, the shot pair, and anything not done or changed from the report and why. Final message under 300 words.
