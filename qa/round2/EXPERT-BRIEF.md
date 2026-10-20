# Final expert review, one chapter each (20 October 2026)

This is the last layer of checks before the round goes to the owner and is published. Seventeen experts each review one chapter of Chip Supply Chain at the same time. Rules in `qa/round2/RULES.md` and formats in `qa/round2/SCHEMA.md` are binding; read both first, then `.claude/skills/writing-well/SKILL.md`.

## Your chapter
Everything a reader of your chapter sees: `content/<your file>.md` (front matter: `oneLiner`, `plain`, the `card` with its source fields, `keyFacts`, `figures`; and the body), the chapter's flashcards (`data/flashcards.json`, under your chapter's `id`), its animation's steps and captions if it has one (`media/<name>.json`), and the glossary terms your chapter's subject owns (`data/glossary.json`). Read the chapter on the site too: the static page `http://127.0.0.1:8765/<id>/` and the interactive `http://127.0.0.1:8765/#<id>`.

## What to look for
1. **Anything incorrect.** Read every claim as the expert you are. Check each against its cited source (open it; for a PDF, the `#page=` gives the page). A claim is wrong if the source says otherwise, if it is out of date where the source or a newer allowed source shows a change, or if it is technically wrong even though a source says it (then find a better source or fix the wording to what is true and sourced). Never write a figure the source does not state.
2. **Anything that can be simpler.** Rewrite sentences that are longer, denser or more technical than they need to be for a smart reader new to the field: plain words, one idea per sentence, jargon explained at first use. Keep every figure, date, citation and the meaning. Leave clear prose alone; do not churn.
3. **Questionable sources.** Each citation must support its own sentence, and come from an allowed source (Tier A or B in `data/source-tiers.json`). Flag and fix: a company or government document that only repeats a market-research firm, a broker or a bank; a secondary source where the primary one is available; a source that does not say what the sentence says; a source that is stale where a newer allowed one exists.
4. **Broken links.** `qa/round2/links.json` has one entry per cited URL with `kind` ok, broken, blocked or error, and `where` it is cited. For your chapter's broken and error entries, check by hand; find the same document at its new address, an archived copy (`https://web.archive.org/web/2026id_/<url>`), or another allowed source for the same fact. Blocked entries (bot checks) are usually fine; spot-check a few.

## How to edit
- **Edit only your chapter's file**, with the Edit tool. For changes to shared files (`data/flashcards.json`, `data/glossary.json`, animation captions), write the exact before and after in your notes; the main session applies them.
- Keep `plain` identical to the first paragraph under "## How it works"; keep front matter valid JSON with its formatting; keep card source fields pointing at the body citation of the same fact; keep `#page=` fragments and give any new long-PDF citation its page; one citation per sentence; the writing rules (no em dashes, no "X, not Y", no "rather than", no colon punchlines, no rhetorical questions, no "we", "you" or "this site", no semicolons, American spelling, "percent", dates day first). Changing a `oneLiner` is allowed when it fixes an error or clarity; say so (its share card is re-rendered).
- New sources go under "New bibliography entries" in your notes as JSON (title, publisher, date, type, accessed `2026-10-20`).
- Never put the owner's email or personal data in a request; generic User-Agent; no CAPTCHAs. Downloads under `qa/round2/scratch/expert-<id>/`.
- Do not start or stop servers. Run the build and checks once, at the end (`node build/build.js > /dev/null && node qa/scripts/check-speak.js && node qa/scripts/check-integrity.js && node qa/scripts/check-sources.js`); sixteen other experts may build at the same time, so a failure in another chapter is not yours.

## Report
Write `qa/round2/expert-<id>.md`: a table of every change (where, before, after, why, source with a short quote and page), proposals for shared files, broken links and what you did, and open questions for the owner. Return a summary under 600 words: counts (errors fixed, sentences simplified, sources replaced, links fixed), the most important findings first, and anything the owner must decide.
