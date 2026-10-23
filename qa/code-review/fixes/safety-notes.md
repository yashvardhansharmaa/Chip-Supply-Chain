# Safety builder: notes (21 October 2026)

PLAN.md items 10 to 14. Source reports: `structure.md` P1-1, P1-2, P2-1, P2-2, P2-5, P3-4, P3-6 and `correctness.md` P2-1, P2-2, P2-3. Nothing was committed or pushed. Proofs are in `qa/code-review/fixes/safety/`, each made by a script there that works on a temporary copy and never writes into the repository.

## For the main session before committing

- **The index already holds 710 staged removals** (`git rm --cached`): the 709 old QA images listed below and `build/__pycache__/cards.cpython-312.pyc`. The files are still on disk. A plain `git commit` includes them. Do not undo them with `git add -A`.
- **New files to add:** `build/validate.js`, `qa/scripts/smoke.js`, `qa/scripts/check-size.js`, `.githooks/pre-commit`, `docs/RUNBOOK.md`, `qa/code-review/fixes/safety/` and this file.
- **`build/page-dates.json` changes format** (`hash` becomes `content`, and `/summary/` gains an entry). Every date stays 21 October 2026. Commit it with the build.
- **QA screenshots are now ignored**, including the PNG proofs the other builders save under `qa/code-review/fixes/<slug>/`. Their `.txt` and `.md` proofs stay committable. Use `git add -f <file>` for any image that must go in.
- **CI changes on the next push:** Node 22 (was 20), `TZ: America/New_York`, write permissions only on the deploy job, `cancel-in-progress: false`, and six checks before the upload. A failing check now stops the deploy.

## Item 10: the build fails on broken content (structure P1-1, correctness P2-1, P2-2)

**Files.** New `build/validate.js` (runs alone as `node build/validate.js`). `build/build.js`: one block after `warn` calls it and exits 1 before anything is written, a `fatal` list, the build-module `catch` adds to it, and the last line exits 1 when it is not empty.

**What fails, each with the file and the field:**
- empty, missing, cut-off or invalid JSON in any `data/*.json`, with line and column where Node gives a position;
- the wrong shape or an empty list in bibliography, suppliers, landscape, landscape-compare, exposure, control-flows, timeline, glossary, flashcards, fx-rates and source-tiers;
- a row missing its key field, a bibliography entry with no title, a glossary term listed twice;
- a chapter's front matter missing or invalid, or missing `number`, `title`, `oneLiner` or `plain`;
- a stage (chapters 1 to 15) with no `card`, a `card.concentration` outside Extreme/High/Moderate/Low, or a `card.substitutability.band` outside Very hard/Hard/Moderate/Easy;
- a repeated chapter number or id;
- any `{{...}}` in a body that is not a `{{figure:<id>}}` line naming a figure, or a marker inside a sentence;
- a figure of unknown type, a bars, stack or timeline figure with no rows, or an animation whose `media/<src>.json` is missing or has no steps;
- a build module that throws. The report is still written, then the build exits 1.

**Proof.** `bash qa/code-review/fixes/safety/break-build.sh` → `build-breakages.txt`. The reviewer's five breakages and ten more all exit 1 with a plain message, and the first fourteen leave `dist/index.html` untouched. The clean build exits 0 with no warnings.

**Timing.** Median of 7 clean builds of the same copy: 0.50 s before and 0.61 s after. `validate.js` alone takes 29 ms. The rest is the content hashing of item 12.

**Not done.** Widening `check-sources.js` (other URL keys such as `chinaSources`, and `[Source]`/`[src]` links) is structure P1-1 fix 2, which PLAN item 10 does not list. The reviewer found no bad URL there today. A missing specimen and a leftover `{{PLACEHOLDER}}` stay warnings.

## Item 10/11: check-integrity fails on real errors (structure P1-1)

**File.** `qa/scripts/check-integrity.js`.
- It now runs from the repository root wherever it is called.
- The route list gains `/home`, `/ai-chips` and `/export-controls` (the Router's VIEWS).
- An `ALLOWED` map holds the Veeco case with its reason: Veeco files a China share but is not in the supplier list, and `data/exposure-notes.md` classes it as Deposition & Etch.
- The script prints allowed items apart, notes an allowed item that no longer occurs, and exits 1 on anything else.

**Proof.** `integrity.txt`. The clean build exits 0. A copy with a new unmatched China revenue firm and a dead link exits 1. The committed version exited 0 on the same broken copy.

## Item 11: smoke tour in CI (structure P2-1)

**Files.** New `qa/scripts/smoke.js`, needing no packages and running on Node 18 to 23. It drives Chrome over `--remote-debugging-pipe`, so no WebSocket library and no port. It serves `dist/` itself on 127.0.0.1 (port 10361, or `--port`). Every other host resolves to nothing, so the fonts and the counter fail quietly and those failures are ignored. Nothing leaves the machine.

**Routes.** The walk, `#/chain`, `#/landscape`, `#/suppliers`, `#/controls`, `#/exposure/asml`, `#/glossary`, `/lithography/` and `/summary/`, each at 320, 390 and 1440. Then three theme loads with the device set to dark, and three with `?theme=dark`.

**What fails a run:**
- any uncaught exception, `console.error`, "module/specimen ... failed" warning, local console network error or local 404;
- the page wider than the screen at 320 or 390, measured with `content-visibility` forced visible so unpainted chapters count, and naming the widest elements;
- a missing key part: 15 or more walk steps, 17 chapters and 15 cards, 20 or more chips, the supplier count and ladder, one board row per flow, the ASML chart on screen, 300 or more Glossary entries, the chapter page's title, card and sources, 15 ladder rows and the summary's cards;
- a light ground other than `rgb(247, 246, 242)` with the device dark, or the light ground under `?theme=dark`.

**Workflow** (`.github/workflows/pages.yml`):
- Actions pinned to commit IDs, resolved with `git ls-remote` against github.com with no credentials and no personal data. Each ID equals the tag the old workflow floated on, so the actions behave as before: checkout v4.4.0, setup-node v4.4.0, upload-pages-artifact v3.0.1, deploy-pages v4.0.5.
- Top-level `contents: read`, with `pages: write` and `id-token: write` on the deploy job only.
- Steps: check-size, build, a warning when the build moved page dates, check-sources, check-integrity, check-speak, smoke.
- On CI, smoke adds `--no-sandbox --disable-dev-shm-usage`.

**Proof.**
- `ci-local.txt` (`ci-local.sh`): every job step on this tree passes. The smoke tour took 32 s for 33 loads.
- `smoke-breakages.txt` (`break-smoke.sh`): a thrown error, a module that fails to load, a wide element at 320 and 390, the card's class renamed, all three page types following the device's dark setting, and a missing poster image each exit 1 with the cause.
- The tour also passed with WebGL off (`SMOKE_CHROME_FLAGS=--disable-3d-apis`), and with every font forced to Verdana, wider than Linux's DejaVu. So CI's fallback fonts should not cause false sideways-scroll failures.
- At 11:50 the tour failed on the shared tree. The China revenue panel was hidden on `#/exposure/asml` because `html.booted` was never set during the speed builder's preroute work in progress. A rebuild about 20 minutes later passed.

**Not done.** CI itself could not be run from here. Newer majors run on Node 24 (checkout v7.0.1, setup-node v7.1.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1). Moving to them is a separate, tested change, and so is Dependabot.

## Item 12: "Updated" dates by content only (correctness P2-3)

**Files.** `build/build.js`, in the page-dates block, with the rule explained in its comment:
- `contentKey()` drops `<style>` and `<script>` blocks, comments, every tag and all whitespace. It decodes entities and keeps the text, outside link addresses and alt text.
- `pageDate()` hashes a page's HTML through `contentKey()` and a PDF by its bytes. It moves an entry from `hash` to `content` once, keeping its day.
- The main page is hashed as its text plus `JSON.stringify(data)`. Its "Updated <build day>" strings become `{{DAY:UPDATED}}` before hashing and the content day after, replacing `split(builtStr)`, which also removed content dates equal to the build day.

`build/modules/summary-brief.js` writes its three dates and the footer's through `{{DAY:SUMMARY}}`, dates `/summary/` with `pageDate`, and so gives the sitemap its `lastmod`. The readable chapter pages needed no change, since their hash input now passes through `contentKey()`.

**Proof.** `dates-test.sh old|new` → `dates-before.txt`, `dates-after.txt`, run on faked days:
- A build with no change on 9 Nov moves nothing. Before the fix it moved `/` and the summary to 9 Nov.
- CSS on both sheets, a JS comment, two classes renamed in `figure()` and a reindented template move nothing. Before, they moved `/`, the summary and 16 of 17 chapter pages.
- A sentence added to chapter 4 moves `/lithography/` and `/` only.
- A supplier row reworded moves `/` only.
- Chapter 4's `oneLiner` moves `/lithography/`, `/` and `/summary/`.
- The same build under Node 18 and Node 23 writes byte-identical `page-dates.json`, `index.html` and chapter pages, so CI on Node 22 should keep the Mac's dates.

**Caveats.**
- Renaming `fig-title` does count as content. `social.js` finds an animation's title by that class, so renaming it alone drops the words from the chapter pages.
- A PDF printed again gets new bytes and so a new date.

## Item 13: repo hygiene (structure P1-2, P2-2, P3-6)

**`.gitignore`.** It now ignores, under `qa/`, every image, film, sound, PDF, dump and archive type, and the `qa/promo/`, `scratch/`, `shots/`, `site/` and `frames/` folders, plus `__pycache__/` and `*.pyc`. Reports, JSON, HTML and scripts stay committable. Measured with `git ls-files -o` (`gitignore.txt`): a sweep would have taken 25,197 files and 11.85 GB, and now takes 233 files and about 7 MB.

**Untracked with `git rm --cached`.** 709 files, 310.5 MB, all images, GIFs, PDFs and dumps from the September rounds, which nothing outside `qa/` uses. Old reports that embed them show broken images in a fresh clone but work on this Mac. Also `build/__pycache__/cards.cpython-312.pyc`. The full list with sizes is in `untracked-qa-binaries.tsv`. By folder:

| Folder | Files | Size |
|---|---|---|
| `qa/brand-redesign/` | 135 | 52.2 MB |
| `qa/crit/` | 50 | 30.0 MB |
| `qa/cover-redesign/` | 13 | 30.0 MB |
| `qa/suppliers-redesign/` | 28 | 27.1 MB |
| `qa/redesign/` | 61 | 20.9 MB |
| `qa/nav/` | 47 | 19.2 MB |
| `qa/tier1/` | 54 | 17.3 MB |
| `qa/gifs/` | 18 | 14.9 MB |
| `qa/design-refs/` | 30 | 14.1 MB |
| `qa/brand/` | 47 | 12.0 MB |
| `qa/cover/` | 17 | 11.0 MB |
| `qa/speak/` | 35 | 10.7 MB |
| `qa/cards-redesign/` | 17 | 8.7 MB |
| `qa/` (top level: specimen previews, hero prototypes) | 22 | 6.8 MB |
| `qa/before/` | 22 | 6.4 MB |
| `qa/brand-build/` | 20 | 5.8 MB |
| `qa/packages/` | 19 | 5.0 MB |
| `qa/specimen-colors/` | 12 | 4.6 MB |
| `qa/quiz-design/` | 25 | 3.7 MB |
| `qa/exposure-viz/` | 9 | 3.6 MB |
| `qa/cards-redesign-2/` | 15 | 3.0 MB |
| `qa/mock/` | 7 | 1.5 MB |
| `qa/cover-wafer/` | 4 | 1.3 MB |
| `qa/dark-red/` | 2 | 0.4 MB |

History was not rewritten and nothing was deleted from disk.

**Size guard.** New `qa/scripts/check-size.js` fails on any tracked file over 5 MiB outside `dist/` and `media/`. CI runs it on every tracked file, which needs no history. With `--staged` it checks the next commit. New `.githooks/pre-commit` runs that once `git config core.hooksPath .githooks` is set, which the runbook asks for and which was not set here. One `ALLOWED` entry keeps `qa/crit/gfx-fig-litho-375.png` (5.4 MB) from failing CI if the untracking were left out of the commit. Remove it afterwards. **Proof:** `size-guard.txt`. The repository passes (615 files). In a scratch repository a 5.7 MB render is refused by the hook, and by the CI command once committed.

## Item 14: runbook and agent briefs (structure P2-5)

- New `docs/RUNBOOK.md` (68 lines). It covers what to edit, the build and the five checks, the PDFs (this Mac only, and the four things to look at), the commit by named folders, the push, and checking the live site. Then the standing rules: sources (Tier A plus the four Tier B exceptions), dated figures, no email or personal data in any request, never `git add -A`, and light as the default.
- `HANDOFF.md`: a note under the title points to the runbook and gives the current site and repository addresses. The worker lesson that said "Run a background auto-commit loop" now says not to, and never to use `git add -A`.
- `brief/`: none of the five briefs mentions committing, an auto-commit loop or `git add -A`, so they are unchanged.

## Checks run on the shared tree at the end

`node build/build.js` (exit 0, no warnings), `check-sources` (2,721 citations, all A or B), `check-integrity` (no problems, Veeco allowed), `check-speak` (no matches), `check-size` (pass) and `smoke.js` (33 loads, no failures, no sideways scroll at 320 or 390).
