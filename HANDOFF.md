# Chokepoints — handoff (updated 9 September 2026, third session)

Live site: https://yashvardhansharmaa.github.io/chokepoints/ (redeploys on every push to `main`).
Repo: https://github.com/yashvardhansharmaa/chokepoints. Build: `node build/build.js` → `dist/index.html`; report in `dist/build-report.txt`. Data-source audit: `node build/audit-data-sources.js`.

## State

| Area | Status |
|---|---|
| Sources | **Strict policy in force** (`brief/SOURCE_POLICY.md`): Tier A (filings, regulators, standards bodies, universities and labs, CSET, CSIS, SIA, SEMI, WSTS, Epoch AI and the like) plus four Tier B exceptions (SemiAnalysis, Reuters, FT, Nikkei Asia). Everything else, including TrendForce, Counterpoint, Bloomberg and WSJ, is disallowed. Build report: **A 315 · B 20 · D 0**, and the data audit reports 0 disallowed URLs. Logs: `qa/source-audit-strict.md` (chapters), `qa/source-audit-strict-data.md` (datasets). |
| Chapters | All 18 written, fact-checked, edited (Zinsser skill) and re-sourced under the strict policy. Every chapter has a `plain` paragraph identical to the first paragraph under "How it works". Figures that could not be rebuilt from allowed sources were removed and replaced where possible. |
| Data | `landscape.json` (19 chips) + `landscape-layouts.json` (researched package layouts, merged by chip id at build time and overriding the inline `layout`), `suppliers.json` (220), `export-controls-timeline.json` (43), `chokepoint-matrix.json` (20 rows; five rows carry null shares because no allowed source publishes a split), `control-thresholds.json` (40), `exposure.json` (103), `glossary.json` (74). |
| Specimens | 19 in `specimens/`. A redesign pass (five agents, notes in `qa/specimen-review-*.md`) checks each against the real object; previous renders are in `qa/before/`. |
| Design | Tabs: The Stack, Summary (`#/briefing`), AI Chips (`#/landscape`), Suppliers, Geopolitics, Controls, Glossary, Sources. Wafer-grey ground, IBM Plex Sans Condensed + Newsreader + IBM Plex Mono, thesis hero, scored chain strip, nameplate cards. Controls and Glossary are full width; Geopolitics reads at a 29.5em measure. The stage canvas is a flex child above its caption, so specimens never overlap the text. |

## Known open items

- Naming: chokepoints.com is taken. Checked available on 9 Sept: computechokepoints.com, howgpusaremade.com, chokepoints.io, chokepointatlas.com, fifteenstages.com. The client leans to computechokepoints.com with howgpusaremade.com as a redirect. When decided: rename the wordmark, `<title>`, credits and README; add `dist/CNAME` via the build; give the client the A/AAAA or CNAME records for GitHub Pages.
- SEO: the site is one HTML file with hash routes, so search engines see one URL. Planned: prerender one real URL per chapter and view with its own title, description and canonical; Open Graph and Twitter cards with a specimen image; sitemap and structured data.
- Two Hot Chips 2026 vendor decks cited for Maia 200 and MTIA 400 return 401 to everyone; replace with public vendor pages or null the fields (see `qa/source-audit-strict-data.md`).
- Advanced packaging and HBM country splits in the matrix are null by policy; revisit if CSET/ETO or SIA publish a split.
- Bloomberg, WSJ and NYT are excluded by the literal reading of the client's list; one line in `data/source-tiers.json` restores them.

## Worker lessons (for whoever orchestrates next)

- Forbid subagents in worker prompts (the concurrency cap counts them and they stall).
- The WebSearch budget is shared and exhausts early; tell workers to use WebFetch on primary sources and Google News RSS.
- Tell workers to save drafts early; API connection drops kill agents silently. Run a background auto-commit loop while they write.
- Give each worker its own files; when two need the same JSON, split it (as with `landscape-layouts.json`).
- The hidden browser pane paints only the first frame and refuses screenshots when not displayed; verify layout with DOM measurements through `javascript_tool`, and use `?only=<chapter-id>` to load a single chapter.
