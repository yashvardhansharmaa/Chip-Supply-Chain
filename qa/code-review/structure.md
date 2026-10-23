# Structure, security and upkeep review

21 October 2026. A review of how the site is built, deployed, checked and stored, written for the owner. Nothing in the repository was changed except this file.

## The short version

**What is sound.** Every piece of data that reaches the page is escaped before it becomes HTML, and every link built from data goes through `safeUrl`. All 2,390 links that open a new tab carry `rel="noopener"`. No passwords, tokens or keys are in the repository or anywhere in its history. The source gate (`check-sources.js`) does stop a disallowed source from going live. The site itself builds in about a second with no outside downloads.

**What needs work.** Most problems are about upkeep rather than attack:

1. The deploy goes ahead when a weekly edit breaks something. I broke a scratch copy five ways, and three of the five would have gone live.
2. 11 GB of untracked working files (10.7 GB of it in `qa/promo/`) sit one `git add -A` away from the repository, and the handoff still tells agents to run an auto-commit loop.
3. One link checker puts the owner's email address in its User-Agent, which breaks the rule set after the 3 October sec.gov incident.

## How this review was done

- I read `HANDOFF.md`, `package.json`, the workflow, `build/` (build.js, the modules, the Python tools), `src/` (app.js, kit.js, the modules), `qa/scripts/` and `brief/`.
- I ran `check-sources.js`, `check-integrity.js` and `check-speak.js` against the committed `dist/`. They only read files.
- I copied the repository to a scratch folder and built it there: 1.2 seconds, no warnings. Then I broke the copy on purpose to see what the build and the checks let through.
- I measured the history by repacking a scratch mirror: 701 MiB, which matches GitHub's figure of about 730 MB.
- Nothing was fetched from the internet, nothing was installed, and no server was started.

**Ranking.** P1: a real risk now. P2: will cost time or cause a mistake soon. P3: worth doing when convenient.
**Effort.** S is under an hour, M is a few hours, L is a day or more, with an agent doing the typing.
**Risk.** The risk of making the change itself.

---

## P1: real risks now

### P1-1. The deploy goes ahead with broken content

**Evidence.**
- The build never fails. A data file that does not parse is replaced with an empty one (`build/build.js:9`). A front matter error, a missing figure, a failed module and a missing specimen each print a warning and the build carries on (`build/build.js:56`, `:240`, `:932`, `:853`). A placeholder that nothing filled is deleted without a word (`:1001`). The report is written and the process exits 0 (`:1045`).
- The workflow runs only the build and `check-sources.js` (`.github/workflows/pages.yml:25-28`).
- `check-integrity.js` prints problems but always exits 0 (`qa/scripts/check-integrity.js:122`). It is not in CI, and it reports one live problem today: "exposure row for Veeco Instruments has no supplier entry".
- `check-speak.js` does fail when it finds something, and it passes today, but CI does not run it either.

What happened when I broke a scratch copy:

| Broken edit | Build | Checks in CI | Result on the live site |
|---|---|---|---|
| `bibliography.json` cut off mid-file | exit 0, warning | pass (`check-sources.js:37` skips that file) | **Deploys**. Every footnote loses its title (507 marks with empty titles). |
| Five `{{figure:…}}` markers mistyped in chapter 4 | exit 0, five warnings | pass | **Deploys** without five charts. |
| Card concentration typed `"extreme"` instead of `"Extreme"` | exit 0, **no warning** | pass | **Deploys**. The card loses its band, with no message anywhere. |
| A syntax error in `suppliers.json` | exit 0, "suppliers: 0" | fails, but only because check-sources crashes while reading the file | Blocked, by accident. |
| A syntax error in chapter 9's front matter | exit 0 | fails, by the same accident (`check-sources.js:35`) | Blocked, by accident. |

The source gate also has two holes:
- It reads only keys named `source`, `sources` or `url` (`check-sources.js:28`). That misses the 137 card URLs under `chinaSources`, `costSources`, `testSources`, `usSources` and `whySources`, and the URLs under `alsoSee` and `releaseUrl`.
- It matches only `[source](…)` (`:33`), while the build also turns `[Source](…)` and `[src](…)` into citations (`build/build.js:67-68`).

Today every one of those URLs is tier A or B, so nothing is wrong yet. The next edit could change that.

**Fix.**
1. Give `build.js` a `--strict` flag for CI that exits 1 on the serious warnings: bad JSON, a front matter error, a missing or unknown figure, an animation that was never rendered, a missing specimen, a failed build module, or a leftover placeholder (warn about it instead of deleting it). Keep the other warnings as they are.
2. In `check-sources.js`, also parse `bibliography.json`, treat every `http(s)` string in front matter and data as a citation whatever its key, and accept `[Source]` and `[src]`.
3. Make `check-integrity.js` exit 1 when it finds a problem. Fix the Veeco row: add Veeco to `suppliers.json` or give it an alias in `build/exposure.js`. Then add `check-integrity.js` and `check-speak.js` to the workflow.
4. Add a short `qa/scripts/check-schema.js` (about 100 lines, no packages) for allowed values:
   - every chapter has `id`, `title`, `oneLiner`, `plain` and a unique `number`;
   - `concentration` is Extreme, High, Moderate or Low;
   - the substitutability band is one of its four words;
   - the specimen exists;
   - a supplier's `category` is in the `brief/DATA_SCHEMAS.md` list and its country code is known;
   - glossary terms are unique.

**Effort.** M (half a day). **Risk.** Low. The first runs may fail on things that are already wrong, which is the point: fix them, or allow them by name.

### P1-2. 11 GB of untracked files sit one command away from the repository

**Evidence.**
- `git status` shows 24,432 untracked files totalling 11 GB:
  - `qa/promo/` 10.7 GB
  - `qa/chapter-pages/` 199 MB
  - `qa/release/` 89 MB
  - `qa/review/` 48 MB
  - `qa/fixes/` 39 MB
  - plus `qa/design/chips-ux/`, `qa/card-v2/`, `qa/verify/` and `qa/writing/`
- `HANDOFF.md:90` still tells the next orchestrator to "Run a background auto-commit loop while they write". That loop made 267 of the 494 commits on 9 September. One of those commits swept in `qa/bib-cache/` before it was ignored, and it still weighs 212 MB in the history (see the Repo plan).
- GitHub refuses any file over 100 MB and any push over 2 GB. One sweep would block pushing. If part of it got through, the history would grow for good.

**Fix.**
1. Replace `.gitignore` with the version in the Repo plan below. It keeps images, films and caches under `qa/` out of git by default.
2. Delete the auto-commit advice from `HANDOFF.md`, or change it to name the folders to commit: `git add content data src build specimens media docs`.
3. Add a size guard that refuses to commit a large file or any QA image. Save it as `.githooks/pre-commit` and turn it on once per clone with `git config core.hooksPath .githooks`:

```sh
#!/bin/sh
# refuse QA images and films, and any other staged file over 5 MB except the site's PDFs and videos
git diff --cached --name-only --diff-filter=AM | while IFS= read -r f; do
  case "$f" in
    qa/*.png|qa/*.jpg|qa/*.gif|qa/*.mp4|qa/*.mov|qa/*.pdf|qa/*.bin) echo "pre-commit: $f is a QA file; keep it local"; exit 1 ;;
    dist/*.pdf|dist/pdf/*|media/*|dist/media/*) continue ;;
  esac
  size=$(git cat-file -s ":$f")
  [ "$size" -gt 5000000 ] && { echo "pre-commit: $f is $size bytes; keep it out of git"; exit 1; }
done
```

**Effort.** S. **Risk.** Low. An agent that never turns on the hook is not protected by it, so put the `core.hooksPath` line in the runbook (P2-5).

### P1-3. A link checker sends the owner's email address to every site it checks

**Evidence.**
- `qa/scripts/recheck-links.js:5` sets the User-Agent to a string carrying the owner's email (now replaced with a generic one) and sends it to every cited host it rechecks, sec.gov among them. That is what happened on 3 October.
- The other fetch tools carry no personal data:
  - `qa/scripts/check-links.js:10` passes itself off as Chrome and uses the old name;
  - `build/harvest-bibliography.js:35-37` passes itself off as Chrome;
  - `qa/round2/check-links.py:14` has the right shape: a browser string plus "(link check; chipsupplychain.org)".
- A search of every text file in the history found three email addresses:
  - `contact@chipsupplychain.org` (public, 1,217 hits);
  - the owner's university address, once, in this file;
  - the Paged.js author's address inside the vendored library.

**Fix.**
- Delete `recheck-links.js`, since `qa/round2/check-links.py` does the same job, or give it the round-two User-Agent.
- Put one shared string in all three tools, for example `ChipSupplyChain-linkcheck/1.0 (+https://chipsupplychain.org)`. SEC asks scripts for a contact address. If the owner wants sec.gov to answer, the public `contact@chipsupplychain.org` can go in that string, but never the personal one.
- Optionally, add a CI step that fails when any tracked file other than the footer and README holds an email address other than the contact one.

**Effort.** S. **Risk.** None.

---

## P2: will cost time or cause a mistake soon

### P2-1. Nothing repeats this week's browser checks

**Evidence.** This week's regressions were found by a QA agent's hand-run sweep of 80 page loads (`qa/design/qa/QA-report.md`):
- the B200 cost table cut off at 320 px;
- 14 firm names cut off in the Glossary at 1024 to 1440 px;
- a ribbon tooltip with a space before each comma.

The theme decision (light unless the reader chooses dark) was checked the same way. None of these checks is saved as a script, so the next weekly refresh starts from zero.

**Fix.** Add the smoke tour described in the Testing plan below and run it in CI. **Effort.** M (half a day to a day). **Risk.** Low. Expect one or two false alarms in the first week while the thresholds are tuned.

### P2-2. PDF and video renders now drive history growth, and agents download all of it

**Evidence.**
- In the last seven days the packed history grew by 82 MB:
  - 48 MB of PDFs (the book and the 17 chapter PDFs, rendered again for the design round);
  - 20 MB of animation media;
  - 7.5 MB of README images;
  - only 0.7 MB from `qa/`, so the design round's ignore rules worked.
- At that pace the repository passes GitHub's recommended 1 GB in about four weeks.
- The book PDF alone accounts for 77 MB over 64 versions.
- Every checkout also carries 310 MB of tracked QA images (709 files), which the build never reads.
- The handoff tells each new agent to clone the repository first, so each session downloads all 730 MB.

**Fix.**
1. Render the book and the summary PDF once per edition, not after every change. Chapter PDFs already follow "only when that chapter changes".
2. Stop tracking the QA images. The files stay on this Mac; old commits keep them. The Repo plan gives the commands.
3. Have agents clone with `git clone --filter=blob:none` (old versions of files download only when asked for), or `--depth 1`, and skip `qa/` with sparse checkout. That cuts the first download from about 730 MB to under 150 MB.
4. If PDFs keep growing, attach each edition's PDFs to a GitHub Release and have the workflow download them into `dist/` before deploying. Release files do not count against the repository. This adds one moving part, so the deploy must fail if the download fails.

**Effort.** S for steps 1 to 3, M for step 4. **Risk.** Low. Old reports that embed screenshots will show broken images in a fresh clone; they still work on this Mac.

### P2-3. One design value lives in up to eight files, and the copies already differ

**Evidence.**
- Garnet `#7a1f2b` appears in eight files: `src/styles.css`, `src/modules/print.css`, `build/assets/chapter-page.css`, `build/modules/summary-brief.js`, `build/modules/social.js`, `build/cards.py`, `build/icons.py` and `animations/lib.js`. Paper `#f7f6f2` appears in seven.
- The full token block is copied three times: `src/styles.css:11` and `:66`, `build/assets/chapter-page.css:7` and `:27`, `build/modules/summary-brief.js:141` and `:146`. The copies have drifted:
  - `--accent-soft` is 0.09 on the site and 0.08 on the summary;
  - `--bar-3` is `#bfb9af` against `#8f8a81`;
  - the font fallbacks differ;
  - `chapter-page.css:5` still says the page follows the device's theme.
- The Google Fonts address is written six times: `src/template.html:28`, `social.js:33`, `summary-brief.js:333`, `src/modules/print.js:29`, `build/summary_pdf.py:79` and `build/cards.py:97`.
- The theme-start script is written three times: `src/template.html:49`, `social.js:456` and `summary-brief.js:331`.
- Rules are copied too:
  - The country names in `build/build.js:16` give "UAE" and have no Denmark. Those in `src/app.js:12` give "United Arab Emirates" and include Denmark. A third list sits in `qa/scripts/check-integrity.js:28`.
  - The card's sentence rule is in `build/build.js:332` and `check-integrity.js:77`.
  - The tier lookup is in `build/build.js:21` and `check-sources.js:18`.
  - The route list is in `src/app.js:277` and `check-integrity.js:10`, which lacks `/home`, `/ai-chips` and `/export-controls`.

The dark-setting regression this week is the kind of mistake this layout causes: one decision had to be made in three stylesheets.

**Fix.**
1. Create `src/tokens.css` (colors in light and dark, the type scale, the font stacks) and put it first in all three page types: the main page's styles, the chapter pages (social.js inlines `chapter-page.css`) and the summary (`SCREEN_CSS`). Delete the copies.
2. Create `build/shared.js` for the country names, the tier lookup, the sentence rule, the route list, the font address and the theme-start script. The build and the checks read it, and the browser receives it through `DATA`.
3. For the Python tools and the animations, either have the build write `build/tokens.json` for them to read, or add a check that fails when their hex values differ from `tokens.css`.

**Effort.** M (half a day). **Risk.** Low to medium. One copy may differ on purpose, such as the summary's print block, so compare screenshots before and after.

### P2-4. Every page view goes to Google, and loads GoatCounter's live script

**Evidence.**
- **Google Fonts** (`src/template.html:26-28`, `social.js:236-238`, `summary-brief.js:332-333`). Each visit sends the reader's IP address and the page address to Google. In January 2022 a Munich court awarded a visitor damages for exactly this. That matters for a global audience. The 9 September audit (`qa/audit-security.md`, L3) raised it, and it is still open.
- **GoatCounter** (`build/build.js:937`, `social.js:458`). The script comes from `https://gc.zgo.at/count.js`, unversioned and with no integrity hash, so whoever controls that file can run code on the site. According to GoatCounter's own documentation it records:
  - the path (the site's own function sends the route without its query string);
  - the page title and the referrer;
  - the browser and operating system;
  - the screen size;
  - country and region, worked out from the IP address, which it says it does not store.

  It sets no cookies. The site also sends one event per finished flashcard deck, `flashcards/<chapter>/<known>` (`src/app.js:2421`). Nothing on the site says visits are counted. Whether to say so is the owner's call, since the footer is fixed.

**Fix.**
- Self-host the fonts in `build/assets/fonts/`. The fonts' licence (the SIL Open Font License) allows it. Have the build copy them to `dist/fonts/`. This also makes the PDFs reproducible (P2-6) and simplifies a CSP (P3-2). The Chinese and Japanese fonts used only in print are large: keep those from Google, or cut them down to the characters used.
- Self-host `count.js` in `build/vendor/` with its sha256 recorded, as `paged.polyfill.js` already is, or use the versioned file GoatCounter publishes with an integrity hash.

**Effort.** M. **Risk.** Low. Check that the same weights and optical sizes load, then render one PDF and compare page counts.

### P2-5. The agents' instructions are scattered and partly out of date

**Evidence.**
- `HANDOFF.md:1-3` is still titled "Compute Chokepoints, handoff (updated 9 September 2026)" and links the old github.io address, which now returns 404. The current rules are buried in 74 KB of dated entries.
- `brief/EDITING_BRIEF.md` was overtaken by later rules:
  - it says "Say 'we think'", which was later banned;
  - it allows em dashes in criteria bullets, also later banned;
  - it describes a Briefing page that no longer exists.
- `brief/DATA_SCHEMAS.md` asks for 16 to 20 chips and at least 130 firms. The site has 38 and 226.
- The current card rules are in `qa/round2/SCHEMA.md` and the revenue rules in `qa/round3/SPEC.md`.
- `build/modules/README.md` lists placeholders that no longer exist.
- The README no longer has build steps, and there is no checklist for the weekly refresh.
- Six of the nine findings in the 9 September security audit are still open. Findings kept in Markdown files are not tracked.

**Fix.**
1. Put one page at the top of `HANDOFF.md`: the current rules, the data contract with allowed values, and the weekly refresh as steps:
   - edit;
   - `node build/build.js --strict`;
   - run the checks and the smoke tour;
   - render the PDFs of any changed chapter;
   - commit the named folders;
   - push.

   Also list the tools never to run, and the `core.hooksPath` line. Move the dated log below it.
2. Fold `qa/round2/SCHEMA.md` and `qa/round3/SPEC.md` into `brief/DATA_SCHEMAS.md`, and mark `EDITING_BRIEF.md` as replaced.
3. Track open findings in one place: GitHub issues or a single checklist file.

**Effort.** M. **Risk.** None.

### P2-6. PDFs, cards and animations build only on this Mac, and can fail quietly

**Evidence.**
- Chrome's macOS path is written into six scripts: `build/pdf.py:72`, `summary_pdf.py:105`, `cards.py:36`, `animate.py:47`, `shoot.py:17` and `record.py:24`. Each also repeats its own copy of the code that drives Chrome.
- The Python packages these scripts need (websocket-client, numpy, Pillow, and optionally PyMuPDF) are listed nowhere.
- `chapter_pdfs.py:81` needs `pdftotext`, and `animate.py` needs `ffmpeg`.
- The PDFs need a local server on 127.0.0.1:8765.
- The print fonts are fetched from Google at print time (`src/modules/print.js:29-62`). A failure is swallowed (`:54` `.catch(function () { return null; })`, `:62` `link.onerror = done`), so a hiccup prints fallback fonts with no error. No script runs `pdffonts` to catch Type 3 fonts or a missing family. Google can also update a font, which changes line breaks and page counts between editions.
- Node is past its support dates in both places: v18.20.5 on this Mac (end of life April 2025) and Node 20 in CI (end of life April 2026). `package.json` asks only for ">=18".

**Fix.**
- Write one `build/chrome.py` helper that reads a `CHROME` setting, with fallbacks for `google-chrome` and `chromium`, and have the six scripts use it.
- Add `build/requirements.txt`.
- Add a short `build/README.md` with one command per output (site, cards, icons, animations, chapter PDFs, book, summary).
- Use the self-hosted print fonts (P2-4).
- Add a `pdffonts` check to `chapter_pdfs.py` that refuses Type 3 fonts or a missing family.
- Use Node 22 LTS on this Mac and in CI, with an `.nvmrc` file and `"engines": {"node": ">=22"}`.

**Effort.** M. **Risk.** Low. Render the PDFs once after the font change and compare page counts.

### P2-7. A tool that erases data sits beside the build tools

**Evidence.** `HANDOFF.md:189` says never to re-run `build/harvest-bibliography.js`, because a full run would erase the dates added in round two. Yet the file's header (lines 10-13) still presents the plain run as normal use, and the access date is fixed at `'2026-09-09'` (line 32). Its cache is what ended up in the history.

**Fix.** Make a full run refuse to start without `--force`, keeping `--only`, which merges, or move the file to an archive folder. **Effort.** S. **Risk.** None.

---

## P3: worth doing when convenient

### P3-1. Split `app.js` by page, without a bundler

**Evidence.** `src/app.js` is 2,675 lines and 207 KB. It has 23 lines over 300 characters (the longest is 716). Every design round edits it, and parallel agents collide in it. The handoff's own lesson is to "give each worker its own files". The mechanism to split it already exists:
- `build.js` adds every `src/modules/*.js` after `app.js`, each in its own try/catch;
- modules reach shared code through `window.CP`;
- `CP.register(view, { activate })` (`app.js:2629`) is how a module claims a page;
- `boot()` waits for DOMContentLoaded, so every module registers before the first route runs.

**Fix.** Move one object per commit, and run the smoke tour after each.

| New file | Moves from app.js | Lines | Pairs with |
|---|---|---|---|
| `src/modules/chips.js` | `Landscape` | 440-784 | chips.css |
| `src/modules/suppliers.js` | `Suppliers` | 790-1340 | suppliers.css |
| `src/modules/controls.js` | `Geo`, `Controls` | 1346-1977, 2132-2203 | controls.css |
| `src/modules/tools.js` | `Tools` (search, permalinks, export, citation, flashcards) | 2205-2541 | |
| `app.js` keeps | helpers, `Theme`, `Stage`, `Band`, `Router`, `Sections`, `Cite`, `Tip`, `Anim`, boot | about 750 | styles.css |

Two code changes make it work:
1. The router's direct calls (`app.js:340-342`) become `CP.register` calls inside each module.
2. Cross-calls such as `Tools` → `Landscape.select` go through `CP`.

Each module starts with `var $ = CP.$, esc = CP.esc, …`. Shared helpers that are not exported yet (`COUNTRY`, `clip`, `localISO`) join `CP`. A module may use another module only inside its functions, never while it loads.

`build/build.js` (1,046 lines, 102 KB) can later be split the same way into `build/lib/` (markdown, figures, card, glossary, exposure chart, lookup list, revenue).

**Effort.** L (about a day). **Risk.** Medium. The work is mechanical but touches every page, so do it only after the smoke tour exists.

### P3-2. Add a Content-Security-Policy meta tag

**Evidence.** The site has no CSP, and GitHub Pages cannot send one as a header (9 September audit, L2). The site has no forms, logins or user content, so a CSP is a second line of defense, not a fix for a known hole.

**Fix.** The build writes this as the first tag in `<head>` on all three page types:

```
default-src 'self';
script-src 'self' 'sha256-…' https://gc.zgo.at;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https://yashvardhan.goatcounter.com;
connect-src 'self' https://yashvardhan.goatcounter.com https://fonts.googleapis.com;
media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests
```

In `script-src`, the build writes one `'sha256-…'` entry per inline script.

What would break, and how to handle it:
- **Inline scripts.** The main page has about 25 (theme start, analytics setup, kit, one per specimen, data, app, cite, cover art). The build must hash each one after the last fill (`build.js:1001`). The chapter pages and the summary need their own hashes.
- **`style="…"` attributes.** Those written by the build and by `innerHTML` keep working only because `style-src` keeps `'unsafe-inline'`.
- **Paged.js.** `pdf.py:165` injects it through DevTools, which the page's policy does not block, but Paged.js fetches stylesheets, hence the Google entry in `connect-src`. Run one PDF with the policy in place. If anything is blocked, `pdf.py` can turn the policy off for its own session with `Page.setBypassCSP`.
- **Outside sources.** Self-hosting the fonts and the counter (P2-4) removes the Google and GoatCounter entries.
- **What a meta tag cannot do.** It cannot set `frame-ancestors` (protection against framing) or reporting.

An easier first step is the same policy with `'unsafe-inline'` for scripts and no hashes. It still blocks plugins, `<base>` tricks and data sent to other hosts.

**Effort.** S for the basic policy, M with hashes. **Risk.** Medium. A missed source breaks a feature without a visible error, so the smoke tour should fail on any `securitypolicyviolation` event.

### P3-3. Four small escaping slips, one visible to readers

**Evidence and fix.**
- **The visible one.** `src/modules/lookup.js:176` escapes a link twice: `esc(CP.safeUrl(r.source))`, and `safeUrl` already escapes (`src/app.js:9`). Any `&` in the address becomes `&amp;` in the link. Today that breaks the Glossary card's "Company page" link for Lam Research (`chipexplorer.eto.tech/?parentNode=N46&selectedNode=N103`) and Wistron (`…/Product&Services/Enterprise&Networking`). Line 164 does the same, which is harmless for internal links. Fix: drop the outer `esc`.
- `src/modules/summary-a.js:138` puts the stop card's `data-*` values, which the browser has already decoded, and a `textContent` back into `innerHTML` without escaping. The data is the site's own, so there is no attack, but a name with `<` or `&` would display wrong. Fix: wrap each value in `esc()`.
- `src/app.js:2537` inserts `canon`, the canonical address, without escaping. Browsers encode `<` and `"` in URLs, so there is no practical risk. Fix: wrap it in `esc` for consistency.
- `build/build.js:997` guards the inlined data only against `</script` (audit L1). Fix: use the stronger `.replace(/</g, '\\u003c')` that `social.js:452` already uses for its JSON-LD.

Everything else checked out:
- `app.js` has 47 places that write HTML and `lookup.js` has 10. All data-fed text goes through `esc()` and all data-fed links through `safeUrl()`.
- Values taken from the address bar are used only to find elements or to match fixed patterns.
- There is no `eval`, `new Function` or `document.write`.

**Effort.** S. **Risk.** None.

### P3-4. Tighten the deploy workflow

**Evidence.** `.github/workflows/pages.yml`:
- Lines 8-11 grant `pages: write` and `id-token: write` to both jobs, including the build job, which runs code from the repository.
- Lines 21-23 pin the actions to tags (`@v4`, `@v3`) rather than commit IDs, and use Node 20.
- Line 15 sets `cancel-in-progress: true`, which can stop a deploy halfway. GitHub's own Pages template uses `false`.
- CI runs in UTC while the owner works in US Eastern time, and the build dates pages by the machine's local day (`build.js`, `builtStr`). An evening push can be dated tomorrow.
- If someone pushes without building locally, CI re-dates the changed pages, but the committed `build/page-dates.json` stays old, so dates drift on the next local build.

**Fix.**
- Move the two write permissions to the deploy job.
- Pin actions to commit IDs with the tag in a comment, and add `.github/dependabot.yml` to keep them current.
- Use Node 22.
- Set `cancel-in-progress: false` and `env: TZ: America/New_York`.
- After the build, run `git diff --exit-code build/page-dates.json`, so a push without a local build fails with a clear message.
- Use a sparse checkout that skips `qa/` images, which saves most of the checkout time.

**Effort.** S. **Risk.** Low.

### P3-5. Keep `dist/` committed for now; move the PDFs out of it later

**Evidence.**
- CI rebuilds `dist/` on every push, so the committed `dist/index.html` is never what goes live. The live site is a fresh build plus the committed PDFs.
- Committing the built HTML costs almost nothing: 374 versions of `dist/index.html` take 3.8 MB of history, and all of `dist/` except PDFs and videos takes 5.7 MB. Each version is stored as a small change against the last.

**Why change it later.**
- An agent that edits `dist/` directly has its change silently replaced on deploy.
- Every commit carries a rebuilt 4 MB page, which makes diffs noisy.

**Fix (when convenient).**
1. Move the book, summary and chapter PDFs into a source folder (for example `pdf/`).
2. Have `build.js` copy them into `dist/`, as it already does for media, cards and icons. `chapterPDF()` (`build.js:586`) then reads from the new folder.
3. Point the PDF tools at the new folder.
4. Add `dist/` to `.gitignore`.

Do not build PDFs in CI. They need Chrome, Paged.js, fonts and several minutes per chapter, and they would change on every run.

**Effort.** M. **Risk.** Low to medium. Every PDF path in the tools must move together.

### P3-6. Dead files and tools

- `build/__pycache__/cards.cpython-312.pyc` is tracked although the folder is ignored. Run `git rm --cached` on it.
- `build/audit-data-sources.js` has been replaced by `qa/scripts/check-sources.js`.
- `qa/scripts/check-links.js` and `recheck-links.js` duplicate `qa/round2/check-links.py`. Keep one in `qa/scripts/`.
- The tools still in use from `qa/round2/` (`apply-shared.py`, `merge-bib.py`, `apply-pages.py`, `make-review.py`) live among more than 100 notes. Move them to `qa/scripts/`.
- Three scripts dump specimen point clouds: `build/preview.js` (with `render_preview.py`), `cover-export.js` and `cards-art.js`.
- `npm run preview` runs the specimen previewer and needs an argument, so its name misleads. Rename it `specimen-preview`.
- `build.js` builds `briefingHTML` (line 792) and fills `BRIEFING`, `CHAIN`, `CREDITS`, `GLOSSARY_COUNT`, `SUBTITLE` and `THESIS` (lines 937, 943, 958). None of these exists in `src/template.html`. The modules still return `SUMMARY_A` and `START_HERE`, which are unused.
- `data/control-thresholds.json` and its notes are read and published but not shown since 10 September.
- `dist/build-report.txt` is published at chipsupplychain.org/build-report.txt. It is harmless, but it is an internal report.
- The `?only=` QA hook (`app.js:2633`, audit L4) ships. It is harmless, and QA uses it. Document it in the runbook.

**Effort.** S. **Risk.** Low.

### P3-7. Two cheap guards for the weekly refresh

- **A stale chapter PDF.** The build already records when each chapter page and each chapter PDF last changed (`build/page-dates.json`). Have it warn when a chapter changed after its PDF. None is stale today.
- **A citation with no bibliography entry.** Today its footnote quietly shows the bare host name. Have the build warn and list the URL.

**Effort.** S. **Risk.** None.

### A note on the commit email

All 494 commits carry the owner's university address as author (from `~/.gitconfig`). That is ordinary authorship, and the repository is private. If it is ever made public, switch `user.email` to the GitHub noreply address first. Past commits keep the old address unless the history is rewritten.

---

## Where a weekly edit can go wrong

| Edit | What can go wrong | Caught today? | What would catch it |
|---|---|---|---|
| Chapter front matter | A syntax error (a missing comma) | Yes, by accident: check-sources fails reading it | `build --strict` |
| | A misspelled field or value (`oneliner`, `extreme`, a repeated `number`) | **No**. The field is ignored. | `check-schema.js` |
| | A card sentence without its source URL | Warning only (`build.js:355`); check-integrity flags it, but not in CI | check-integrity in CI |
| Chapter body | A `{{figure:id}}` typo | **No**. Warning, then deploys without the chart. | `build --strict` |
| | A citation from a domain not on the list | Yes, check-sources stops the deploy | (works) |
| | A citation written `[Source](…)` | **No**. Built as a citation, skipped by the gate. | widen check-sources |
| | A flashcard's section heading renamed | Warning only (`build.js:546`) | keep as a warning, listed in the report |
| Data files | A syntax error in `suppliers.json` or similar | Yes, by accident | `build --strict` |
| | A syntax error in `bibliography.json` | **No**. Every footnote loses its title. | parse it in the build and the gate |
| | A supplier category or country typo | **No** for the category; the country only in check-integrity | `check-schema.js`, integrity in CI |
| | A disallowed URL in a card's `chinaSources` and similar | Only if it is also in the body and integrity runs | gate reads every URL string |
| | A China revenue firm with no supplier entry | check-integrity, not in CI (live now: Veeco) | integrity in CI |
| Bibliography | No entry for a new citation | **No**. Footnote shows the host. | build warning (P3-7) |
| PDFs | Chapter changed, PDF not rendered again | **No** | build warning (P3-7) |
| Push | Pushed without building locally | CI builds anyway; dates drift | `git diff --exit-code build/page-dates.json` |
| Layout | A table or label cut off at 320 px, a dark-mode slip | **No** (by hand only) | smoke tour |

---

## Testing plan

The smallest set that would have caught this week's regressions, in three layers.

### Layer 1: static checks (CI and local, about 15 seconds)

1. `node build/build.js --strict` (P1-1).
2. `node qa/scripts/check-sources.js`, widened (P1-1).
3. `node qa/scripts/check-integrity.js`, made to exit 1 (P1-1).
4. `node qa/scripts/check-speak.js` (already exits 1 and passes today).
5. `node qa/scripts/check-schema.js` (new, P1-1).
6. Guards: no QA images or files over 5 MB added, no personal email, design tokens in step (until P2-3 lands).

Put them behind one command, `npm test`, which runs a short `qa/scripts/run-checks.js`.

### Layer 2: a browser smoke tour (CI and local, about 2 to 4 minutes)

Write `qa/scripts/smoke.js` for Node 22 with no packages:
- Node 22 has a built-in WebSocket, which is all that is needed to drive Chrome through its DevTools protocol, the same way `build/shoot.py` does today.
- Serve `dist/` with `python3 -m http.server`, or a 20-line Node server.
- GitHub's Ubuntu runners already have Chrome.

```js
// the core of it: start Chrome, connect, and send DevTools commands
const chrome = require('child_process').spawn(process.env.CHROME || 'google-chrome',
  ['--headless=new', '--remote-debugging-port=9555', '--user-data-dir=/tmp/cp-smoke', 'about:blank']);
const [tab] = await (await fetch('http://127.0.0.1:9555/json/list')).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl); // built into Node 22, no npm
// Emulation.setDeviceMetricsOverride, Emulation.setEmulatedMedia, Page.navigate, Runtime.evaluate,
// and listen for Runtime.exceptionThrown, Runtime.consoleAPICalled, Log.entryAdded, Network.loadingFailed
```

**Pages.**
- `#/` and `#/chain`;
- one stage chapter (`#lithography`) and the costs chapter (`#component-costs`, home of the B200 table);
- `#/landscape` with two chips picked;
- `#/suppliers` and `#/suppliers?tab=country`;
- `#/controls` and `#/exposure`;
- `#/glossary` and `#lk-firm-asml`;
- the static `/lithography/`, `/component-costs/` and `/summary/`.

That is 14 pages, at 320, 390 and 1440 pixels wide, so 42 loads. Turn WebGL off for speed (Chrome flag `--disable-3d-apis`; the site already copes without it), and make one extra pass with it on for the home page.

**What fails the run.**

| This week's regression, or a common one | Test |
|---|---|
| The B200 table cut off at 320 px | At every width, the page does not scroll sideways (`scrollWidth <= innerWidth`), and every table fits its `.table-wrap` (`table.scrollWidth <= wrap.clientWidth + 1`) |
| Firm names cut off in the Glossary at 1024 to 1440 px | Any element with `text-overflow: ellipsis`, or with `overflow: hidden` and `nowrap`, whose `scrollWidth` exceeds its `clientWidth`; any SVG `text` outside its drawing's box |
| Search showing fragments | Open search and type "hbm", "asml" and "litho". Each result title must equal a name in `#lk-items` or a chapter title, and no snippet may hold a footnote digit stuck to a word. Each Try button must equal an entry name exactly. |
| Static pages following the device's dark setting | With dark emulated and nothing saved, the page background on `/`, `/lithography/` and `/summary/` must be `rgb(247, 246, 242)`. With `?theme=dark` it must be the dark background. |
| Anything that crashes | Any console error, uncaught exception, "module … failed" or "specimen … failed" warning, a same-origin request that fails, and later any CSP violation |
| A page that renders empty | Expected parts present: 17 chapters in the chain, a card on each stage chapter, one ladder row per supplier, one board row per flow, one China panel per firm, a card after the Glossary deep link |

### Layer 3: a picture comparison (this Mac only, about 5 minutes, before a release)

Use the existing `build/shoot.py` to take 8 key views at 320 and 1440 pixels. Compare them with approved pictures using Pillow, which `cards.py` already uses. Write a small HTML page that shows each changed view beside its approved version. Keep the approved pictures in a git-ignored `qa/baselines/` and refresh them when the owner approves a design change.

It stays off CI for two reasons. Linux draws fonts slightly differently from macOS, which would raise alarms on every run. And pictures committed to git would add megabytes each round.

### What runs where, and the cost

- **Before every push, on this Mac:** layers 1 and 2 (`npm test`, then `node qa/scripts/smoke.js`).
- **In CI on every push to main:** layers 1 and 2 in the build job. The deploy job already waits for the build job, so a failure blocks the deploy.
- **Before a release or after a design round:** layer 3 on this Mac.
- **Once a month on this Mac:** the link check, because bot walls make it unreliable in CI.

**CI minutes.** Today a run takes about 1 to 1.5 minutes. The build itself takes 1.2 seconds; checking out the 430 MB tree takes most of the time. The static checks add about 15 seconds and the smoke tour 2 to 4 minutes, so a run will take about 4 to 6 minutes. At 10 to 20 pushes a month that is 40 to 120 minutes. A private repository that publishes Pages needs a paid plan, and GitHub Pro includes 3,000 minutes a month. Skipping `qa/` at checkout (P3-4) wins back about a minute.

---

## Repo plan

### What the 730 MB of history holds

These figures come from a full repack of a scratch mirror (701 MiB).

| Contents | Size | Share |
|---|---|---|
| QA screenshots, mockups and GIFs under `qa/` | 327 MB | 45% |
| `qa/bib-cache/`: 71 source PDFs and 400 web pages the bibliography harvester cached, committed by an auto-checkpoint on 9 Sept and untracked the same day | 212 MB | 29% |
| PDFs the site ships (the book 77 MB over 64 versions; chapter PDFs 23 MB; the old-name book 10.5 MB) | 112 MB | 15% |
| Animation videos and stills | 48 MB | 7% |
| `build/assets` (cards, cover art) and `docs/readme` images | 22 MB | 3% |
| Everything else: HTML, JS, CSS, JSON, Markdown | 12 MB | 2% |

About two dozen of the cached pages come from, or mention, SemiAnalysis, the FT and Nikkei. That is fine in a private repository, and a reason to clean the history before ever making it public.

### What to stop committing

- **Stop:** QA screenshots, mockups, contact sheets, renders, GIFs and films; point-cloud `.bin` dumps; caches (`bib-cache`); `__pycache__`; promo films; renders of animations not yet placed in a chapter.
- **Keep:** reports (`.md`), proposals (`.json`) and small review pages in `qa/`; `media/` for placed animations; `build/assets` (cards, icons, cover art); `docs/readme` images when the README changes; the PDFs, but only when content changes, and the book once per edition.

### The `.gitignore` to use

```gitignore
# system and tool files
.DS_Store
__pycache__/
*.pyc
node_modules/

# QA: reports (.md), proposals (.json) and review pages (.html) stay in git;
# screenshots, renders, films, dumps and caches stay on this Mac
qa/**/*.png
qa/**/*.jpg
qa/**/*.jpeg
qa/**/*.gif
qa/**/*.webp
qa/**/*.mp4
qa/**/*.mov
qa/**/*.webm
qa/**/*.pdf
qa/**/*.bin
qa/**/*.zip
qa/promo/
qa/bib-cache/
qa/**/scratch/
qa/**/shots/
qa/**/site/

# later, once the PDFs live outside dist/ (P3-5):
# dist/
```

`.gitignore` does not affect files git already tracks. To stop tracking the 709 QA binaries while keeping them on disk, run:

```sh
git ls-files -z -- 'qa/*.png' 'qa/*.jpg' 'qa/*.gif' 'qa/*.mp4' 'qa/*.bin' 'qa/*.pdf' | xargs -0 git rm --cached --quiet
git rm --cached --quiet build/__pycache__/cards.cpython-312.pyc
```

Then commit. Old commits keep the files. New clones will not have them.

### Should the history be rewritten?

**Not now.** First stop the growth with the ignore rules, the size guard and a PDF render per edition, and give agents partial clones. Decide again if the repository passes 1 GB or is about to go public.

**What a rewrite would gain.** Removing `qa/bib-cache/` and the QA images from every past commit with `git filter-repo` would take the history from about 730 MB to about 190 MB, and would remove the third-party copies.

**The risks, plainly.**
- Every commit ID changes. The handoff and the QA reports cite commit IDs (for example "commit 072c754 has both" for the old thresholds ruler), and those references would point at nothing.
- Every existing copy of the repository (this Mac, any agent's clone or worktree) must be deleted and cloned again. One old copy pushed later puts everything back.
- It needs a force-push to main, which overwrites GitHub's copy. If anything goes wrong mid-way there is no undo, unless a backup bundle (`git bundle create backup.bundle --all`) was made first and kept.
- GitHub keeps the old objects reachable for a while. Removing them completely needs a request to GitHub Support.
- The removed screenshots are gone from the history for good. Keep the backup bundle if they might matter.
- The live site and GitHub Pages are not affected.

---

## The five to do first

1. **Make the deploy fail on broken content** (P1-1). Add `build.js --strict`, widen check-sources, make check-integrity exit 1 (fixing the Veeco row), and add integrity and speak to CI. Half a day.
2. **Fence off the 11 GB** (P1-2, P2-2). Add the new `.gitignore`, stop tracking the QA binaries, add the pre-commit size guard, delete the auto-commit advice from `HANDOFF.md`, and tell agents to use partial clones. An hour.
3. **Take the email out of `recheck-links.js`** (P1-3), and give all fetch tools one User-Agent. Ten minutes.
4. **Add the browser smoke tour to CI** (P2-1), with the four checks that match this week's regressions. Half a day to a day.
5. **Write the one-page rules and weekly runbook** at the top of `HANDOFF.md` (P2-5), and retire the stale briefs. Two hours.
