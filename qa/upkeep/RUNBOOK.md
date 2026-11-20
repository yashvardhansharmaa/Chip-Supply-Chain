# Bi-weekly upkeep runbook

The site states sourced facts with dates, so it goes stale unless someone checks it. This is the routine, run on the 1st and
15th of each month. Each run produces one report for the owner and a branch of proposed changes. Nothing is published until
the owner approves it.

## Rules that never bend
- Sources: tier A (company filings, governments, standards bodies, universities and research institutions) or tier B
  (SemiAnalysis, Reuters, the Financial Times, Nikkei Asia) only. `data/source-tiers.json` is the list.
- Never invent, round or compute a figure. Every figure carries its source and its date. A model's estimate is named as an
  estimate, with whose model and for which chip or firm.
- If an outcome cannot be confirmed from a source actually read, write "not confirmed" in the report and change nothing.
- Plain American English: no em dashes, semicolons, "X, not Y", "rather than", rhetorical questions, we/you, hypotheticals,
  or lines that narrate what the reader can see. Country-neutral.
- Web: public pages only. No CAPTCHAs, logins, sign-ups, forms or downloads; skip pages with a bot check or paywall. Use the
  User-Agent "Mozilla/5.0 (research; chipsupplychain.org)". Never put anyone's email or personal data in a header, URL or form.
- Never push, never deploy, never commit to `main`. Work on a branch named `upkeep-YYYY-MM-DD`.
- The footer's words and the owner's design decisions are not upkeep. Leave them alone.

## Each run, in order
1. **Passed dates.** `node qa/scripts/check-dates.js`. For every line it prints, find what happened (extended, lapsed,
   replaced) from the primary source and update the sentence, `data/control-flows.json` (`upcoming`, and the flow's `states`)
   and `data/export-controls-timeline.json`.
2. **Export controls.** New rules, licences, entity listings, suspensions and court or enforcement actions that touch AI chips
   or chipmaking tools since the last entry in `data/export-controls-timeline.json`. Look at: the Federal Register (BIS, 15 CFR
   parts 734 to 774), bis.gov press releases, commerce.gov, MOFCOM announcements (mofcom.gov.cn), the Dutch government
   (government.nl, export of advanced semiconductor equipment), Japan's METI, Korea's MOTIE, Taiwan's MOEA, the EU's dual-use
   pages, then Reuters, the FT and Nikkei Asia for anything the primary sources point to. Add what will come due in the next
   three months to `upcoming`.
   Export Controls opens, on both of its pages, with the newest timeline entry and the next `upcoming` date not yet passed
   (`build/latest-rule.js`). When a new entry's `gist` needs codes such as "D:5" or a TPP figure, give that entry a `plain` field:
   one sentence in plain words, using only facts already in the entry and its source.
3. **AI chips.** New data center AI chips that are announced with specifications or have started shipping, from Nvidia, AMD,
   Google, Amazon, Microsoft, Meta, Broadcom, Intel, Huawei, Cambricon and Hygon (their newsrooms, filings and product
   pages). `data/landscape.json` lists widely used chips only: add a chip when its maker publishes specifications and at least
   one named deployment or customer. Update export status when a rule changes it.
4. **Suppliers and stages.** For each of the 14 stages, the leading firms' newest quarterly results and material events
   (capacity, new fabs, acquisitions, shortages, price moves): ASML, Applied Materials, Lam Research, Tokyo Electron, KLA,
   TSMC, Samsung, SK hynix, Micron, Intel, SMIC, ASE, Amkor, Ibiden, Unimicron, Ajinomoto, Shin-Etsu, SUMCO, Hoya, Synopsys,
   Cadence, Arm, Nvidia, Broadcom, Vertiv, Schneider Electric. Refresh a figure only when the same source publishes its next
   edition, and keep the old date out of the sentence. `data/exposure.json` holds China revenue shares by fiscal year.
5. **Readers' reports.** Anything sent to contact@chipsupplychain.org or noted by the owner in `qa/upkeep/inbox.md` (a firm
   missing from Suppliers, a figure questioned). A missing firm is added only with a filing or company source for what it
   makes and which stage it supplies.
6. **Citations of the site.** If the owner has noted a new citation in `qa/upkeep/inbox.md`, check that the cited page still
   says what the citing article quotes, and that the figure's scope is stated beside it.
7. **Build and checks.** `node build/build.js`, then the suite in `qa/suite/run.sh a` and `b` against a running local preview
   (or, with no preview, the checks in `qa/scripts/` that need none: check-speak, check-sources, check-integrity, check-seo,
   check-size, check-dates, and `node qa/redesign/check-cites.js dist`). If a chapter's text changed, its PDF is reprinted with
   `/opt/anaconda3/bin/python3 build/chapter_pdfs.py <id> --base <preview>` and the site rebuilt.
8. **Report.** Write `qa/upkeep/YYYY-MM-DD/report.md`: what changed and why, each with its source URL, publisher and date;
   what was checked and found unchanged; what could not be confirmed; and what needs the owner's decision. Commit the branch.
   Tell the owner the branch name and the report's path. Stop there.

## What a good report looks like
Short. Changes first, each one line with its source. Then "not confirmed". Then "for the owner to decide". No change is
described that is not in the branch, and no change is in the branch that is not described.
