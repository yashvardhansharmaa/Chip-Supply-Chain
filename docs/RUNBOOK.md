# Weekly refresh: the runbook

One page for the weekly update of chipsupplychain.org. Every command runs from the repository's top folder on this Mac. Agents follow the same steps.

## 1. Edit

| To change | Edit |
|---|---|
| A chapter's text, card or charts | `content/NN-<chapter>.md` (the JSON block at the top holds the card and the figures) |
| Suppliers, chips, the China revenue panels | `data/suppliers.json`, `data/landscape.json`, `data/exposure.json` |
| Export Controls | `data/export-controls-timeline.json`, `data/control-flows.json` |
| The Glossary and the flashcards | `data/glossary.json`, `data/flashcards.json` |
| A source's title | `data/bibliography.json` (by hand, never by `build/harvest-bibliography.js`, which erases the dates added in round two) |

Never edit `dist/`. The build rewrites it. What the build refuses is listed at the top of `build/validate.js`. The card's rules are in `qa/round2/SCHEMA.md`, the other fields in `brief/DATA_SCHEMAS.md`, and the writing rules in `.claude/skills/writing-well/SKILL.md`.

## 2. Build and check

```sh
node build/build.js                   # stops with the file and field when content is broken, and writes nothing
node qa/scripts/check-sources.js      # every citation is tier A or B
node qa/scripts/check-integrity.js    # links, ids and the data files agree
node qa/scripts/check-speak.js        # no Claude-speak in the reader's text
node qa/scripts/check-size.js         # no file over 5 MB in git outside dist/ and media/
node qa/scripts/smoke.js              # every route in headless Chrome, about a minute
```

Each check prints what is wrong and exits with an error. Fix the content and run it again. The deploy runs the same six, so a failure here would also stop the push from going live. To look at the site: `npm run serve`, then open http://127.0.0.1:8765/.

## 3. PDFs (this Mac only)

The PDF tools need Google Chrome in `/Applications`, Python 3 with `websocket-client`, `pdftotext` and the local server from step 2 on port 8765. CI cannot make them.

```sh
python3 build/chapter_pdfs.py <id> ... --logs /tmp/pdf-logs           # the chapters whose words, card or figures changed (ids such as lithography)
python3 build/summary_pdf.py                                           # when a stage's card or one-line summary changed
python3 build/pdf.py "http://127.0.0.1:8765/book/?theme=light#/chain" dist/chip-supply-chain-the-chain.pdf --wait 8   # the book, once per edition
node build/build.js                                                    # again, so the cite lines link the new PDFs
```

Look for four things:
- **The run's last line.** `chapter_pdfs.py` refuses a file with text off the page, a missing title or edition line, or under 100 KB, and keeps the old one.
- **The page count** (`pdfinfo dist/pdf/<id>.pdf`). A jump of more than a page from the last edition needs a look.
- **The layout report** in the log: short pages, stranded headings, notes pushed off the page.
- **The fonts** (`pdffonts dist/pdf/<id>.pdf`): Fraunces, Source Serif 4, Instrument Sans and IBM Plex Mono, all embedded. A Type 3 font or Times means the web fonts failed to load. Print it again.

## 4. Push and check the live site

```sh
git status
git add content data src build specimens media docs dist .github qa/scripts   # name the folders, plus any other file that changed
git diff --cached --stat                                                 # read the list before committing
git commit -m "Weekly refresh: <what changed>"
git push
gh run watch                                                             # or the Actions tab on GitHub
```

The workflow builds, runs the six checks and deploys in about five minutes. A red run deploys nothing, and the live site keeps the last good version. Once it is green, open https://chipsupplychain.org/ and check a changed chapter, its "Updated" date and `/summary/`. A page whose words did not change keeps its old date.

Once per clone, turn on the size guard for commits: `git config core.hooksPath .githooks`.

## Standing rules

- **Sources.** Tier A (filings, governments and regulators, standards bodies, universities and research institutions) plus the four Tier B exceptions: SemiAnalysis, Reuters, the Financial Times and Nikkei Asia. Nothing else. The policy is `brief/SOURCE_POLICY.md`, the list `data/source-tiers.json`.
- **Date every figure.** A number carries its year or fiscal year beside it, on the card and in the text.
- **No email or personal data in any request.** No address, name or account in a header, User-Agent, URL or form sent to another site. A tool that needs a contact gives `contact@chipsupplychain.org` and nothing personal.
- **Never use `git add -A`** (or `git add .`). This folder holds 11 GB of QA screenshots and films. `.gitignore` keeps most of them out, but name the folders anyway. No auto-commit loops.
- **Light is the default theme.** Dark shows only when a reader picks it.
