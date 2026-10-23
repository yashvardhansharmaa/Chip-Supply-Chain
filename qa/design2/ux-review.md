# Design round two: user experience and wayfinding (ux)

23 October 2026. Lens: how five readers find, keep and leave their place across the whole site, on desktop and phone. Every shot and script is in `qa/design2/shots/ux/`. `ux.py` is a headless-Chrome harness that keeps one browser open across steps, so a reader's sequence (load, click, scroll, reload, Back, a new sitting) can be replayed and measured. Analytics hosts are blocked in it. The measured sequences are saved as `pA-sequence.json`, `pD-sequence.json`, `pG-sequence.json` and `pL-chain-length.json`. Nothing in the repo was edited except this file and that folder.

## 1. Verdict

The site answers the first question well. "How AI chips are made" over "The chain at a glance" says in one screen what this is and why it matters. The six tabs are honest, the walk's address follows its step, figures deep-link cleanly, search finds terms, chapters, events and chips, and the static pages hand off to the app with a clear button. Where it falls short is everything after the first visit. The site treats each visit as the first one. The Chain is one page 166,306 px tall at 1440 (185 screens) and 241,668 px on a phone (286 screens), so the scrollbar thumb is 4.9 px and 2.9 px. Its address does not follow the reader, so a reload or a new sitting loses the place, while the walk on Home keeps it. The data pages hold answers the reader cannot carry away: an AI Chips comparison has no address, and the Export Controls board loses the date the reader picked on the first scroll. On a phone the board does not appear at all unless the reader guesses that "By subject" means "the board". The reference pages also do not point at each other: a chip's foundry, package and memory rows lead nowhere, and the Suppliers ladder uses its own stage names with no bridge to the chapter's Extreme or High. On the system question: the ledger is the right identity for a reference work, and its left column is the best wayfinding device on the site (chapter numeral, stage of 15, the fifteen-bar key). It is overloaded on Suppliers, where the same big numeral in the same column means a count of firms. The structural question worth the owner's time is the chain as one page. The norm for a book-length reference read in sittings is one chapter per address with a contents page, and the static pages already prove that layout works here (S-1).

## Reader log (what each reader did, measured)

| Reader | Device | Sequence | Doubt, dead end or waste |
|---|---|---|---|
| 1. First visit from a shared link | 1440, 390 | Lands on `#/`. Title, dek, then "17 paragraphs, 2,456 words, about 11 min", then the glance. The walk's first step starts at y 951 at 1440, below the fold. | Nothing names the two ways in: the 11-minute walk below, or the 17 chapters. The glance rows link out to the full chapters on The Chain (`#lithography`), so the first click leaves the short read for a 10,293 px chapter on another tab. Back returns correctly (y 59). `s1-home-first-1440.png`, `s1-home-first-390.png`. |
| 2. Student, front to back, several sittings | 1440, 390 | Home, then The Chain tab (lands at the top, Contents at y 833), then Contents 05, then reads 9,000 px. The address stays `#photomasks-and-pellicles`. Reload: back at the top of chapter 5, 9,000 px lost (both widths). A new sitting at `#/chain`: the top, no trace of chapter 5. The phone Contents sheet lists 17 chapters with no mark on the one being read and no sections. The chapter end shows Previous above Next on a phone. | Finding the place again costs a scroll through Contents and a guess. `pD-sequence.json`, `t8-sheet-in-ch10-390.png`, `t2-chapter-end-390.png`. |
| 3. Journalist from a search engine on `/lithography/` | 1440, 390 | First screen: title, a lede with "48 in 2025", the garnet "Open the interactive chapter" button, the 15-bar track. The chokepoint card with sourced price and market size is at y 1598 (desktop) and 2011 (phone). The first chart is at y 6862 and 8957 (7.6 and 10.6 screens down). In the app, site search for "hbm revenue" returns no figure: the 59 figures are not in the index. | A figure and its source are there, well labelled, but only by scrolling. Figure deep links work (`#fig-memory-and-hbm-hbm-suppliers`, `t3-app-figure-deeplink-1440.png`). On a phone the static masthead wraps to three rows (127 px) with "Glossary" alone on the last. |
| 4. Analyst: two chips, then one stage's suppliers | 1440, 390 | AI Chips, a suggested pair (B200 and Ascend 910C). The address stays `#/landscape`. A reload empties the comparison. "Foundry, process node", "Package" and "Memory type" are plain text. Suppliers tab, scroll 1,260 px past the atlas to the ladder: "Foundry, 9 firms, 1 critical". | Dead end from chip to stage. On Suppliers the big numerals in the ledger column (5, 6, 7, 9) are firm counts set like chapter numbers. The ladder's 20 categories differ from the 15 chapter stages, and the row does not show or link the chapter's Extreme or High. `pG-sequence.json`, `t4-suppliers-ladder-1440.png`. |
| 5. Policy reader: what could be sold to China on a date, and why | 1440, 390 | Export Controls, press 2023 on the scrub. The board reads "31 Dec 2023". The chronology beside it still shows April 2018. The first 300 px scroll resets the board to "15 Apr 2018". On a phone (below 900 px) the default By date mode hides the board completely. It shows only under "By subject". | The site's main policy question has no stable answer on desktop and no visible one on a phone. The static page promises the board "moves to any date since 2018". `pA-sequence.json`, `t5-controls-modes-390.png`. |

Unknown and guessed addresses (`t6.py`, one cold load each): `#/chips`, `#/summary`, `#/home` and `#/lithography` all open the home page silently. `#/chain/lithography` and the typo `#lithograpy` open the top of The Chain. `dist/` has no `404.html`, so a mistyped or retired static path shows GitHub Pages' own unbranded 404, with no link back to the site.

Footer: unchanged words, consistent on every view, and it ends the walk and The Chain cleanly. No change proposed.

## 2. Proposals

### P1-1. The board forgets the year the reader picked
- **Type:** Fix.
- **Where:** `#/controls`, By date, 900 px and up (1024, 1440), both themes.
- **Wrong:** `Geo.pickYear` moves the board and nothing else. The chronology beside it stays where it was, and the scroll spy (`Geo.spyNow`) takes the board back on the next scroll. Measured: press 2023, and the board reads "31 Dec 2023" beside the April 2018 entries. Scroll 300 px and it reads "15 Apr 2018". The reader who wants the state on a date, and the moves behind it, cannot have both on screen.
- **Change** (`src/app.js`, `Geo.pickYear`): in By date mode the pick also brings that year's last entry to the reading line the spy already uses, so the board and the moves that set it sit side by side and the spy agrees.
  ```js
  pickYear: function (y) {
    var last = this.years[this.years.length - 1];
    var changed = this.setAsOf(y >= last ? this.now : y + '-12-31', [y + '-01-01', y + '-12-31']);
    if (this.mode === 'date' && y < last) { // the chronology follows the pick, so the entries on screen are the ones that set the board
      var its = (this.items || []).filter(function (e) { return String(e.getAttribute('data-date')).slice(0, 4) === String(y) && e.getClientRects().length; });
      var el = its[its.length - 1];
      if (el) {
        var mast = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead')) || 56;
        var probe = mast + Math.round((window.innerHeight - mast) * 0.3); // the spy's reading line
        var root = document.documentElement, sb = root.style.scrollBehavior; root.style.scrollBehavior = 'auto';
        window.scrollTo(0, window.pageYOffset + el.getBoundingClientRect().bottom - probe - 12);
        root.style.scrollBehavior = sb;
      }
    }
    this.sayAsOf(changed);
  },
  ```
  The board's label then reads the year's last move (for 2023, "20 Oct 2023"). No row changes between that day and 31 December, so the state shown is the same.
- **Shots:** before `pA-before-1-pick-1440.png` (board 31 Dec 2023, list in 2018) and `pA-before-2-scroll-1440.png` (board back to 15 Apr 2018). After `pA-after-1-pick-1440.png` (board 20 Oct 2023 beside the 17 and 20 October 2023 entries) and `pA-after-2-scroll-1440.png` (reading on moves the board forward, never back to 2018). Sequence in `pA-sequence.json`.
- **Risk:** low. The jump is instant, so reduced motion is respected. The arrow keys call the same function, so a keyboard reader's list follows too.
- **Touches:** the `cf-status` announcement (unchanged), the accessibility builder's board status work (same function, so merge carefully).
- **Size:** S.

### P1-2. On a phone the board is hidden behind a label that does not name it
- **Type:** Fix.
- **Where:** `#/controls` below 900 px (390, 320, and tablets), both themes.
- **Wrong:** `controls.css` hides `.cf-side` in By date mode below 900 px ("nothing new pinned to the top of a phone screen"). That is sound, but the only way to the board is the "By subject" button, and "By subject" and "By date" read as two sort orders of one list. The year headings already summarize the board ("End of 2018 · 1 presumption of denial · of the 11 rows on the board") and stop there.
- **Change:**
  - `src/template.html`, `#cf-modes`: the labels become **The board** (`data-mode="subject"`) and **Timeline** (`data-mode="date"`), at every width. The `aria-label` "Order the events" becomes "Show the board or the timeline".
  - `src/app.js`, `Geo.yearSum`: append a link to each phone summary, and wire it to switch mode and pick the year.
    ```js
    // after the parts are joined
    + ' <a href="#/controls" class="cf-sum-go" data-y="' + esc(y) + '">' + (parseInt(y, 10) >= last ? 'The board today' : 'The board at the end of ' + esc(y)) + ' &rarr;</a>'
    // in Geo.build, once: a click sets the mode, then the year, then brings the board into view
    $('#timeline').addEventListener('click', function (e) { var a = e.target.closest('.cf-sum-go'); if (!a) return; e.preventDefault(); self.setMode('subject'); self.pickYear(parseInt(a.getAttribute('data-y'), 10)); scrollToEl($('#cf-side'), false); });
    ```
  - `src/modules/controls.css`, inside `@media (max-width: 899px)`:
    ```css
    .cf-sum a { display: inline-block; padding: 5px 0; font: inherit; color: var(--accent); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
    .cf-sum a:hover { text-decoration-color: var(--accent); }
    ```
- **Shots:** before `pB-before-controls-phone-390.png`, `pB-before-controls-phone-320.png`. After `pB-after-controls-phone-390.png`, `pB-after-controls-phone-320.png`. Dark `pDark-after-controls-390.png` (link 5.05:1). The link's target is 26 px tall. No sideways scroll at 320.
- **Risk:** low. The saved mode (`cp-cf-mode`) keeps working.
- **Touches:** the static Export Controls page, whose note "moves the board to any date since 2018" should then say "to the end of any year since 2018, or to any entry" (`build/modules/social.js`, the controls `cta-note`).
- **Size:** S.

### P1-3. No 404 page, and guessed addresses fall silently to Home
- **Type:** Fix.
- **Where:** any missing static path (production), and hash routes `#/chips`, `#/summary`, `#/<chapter-id>`, `#/chain/<chapter-id>`. Every width.
- **Wrong:** `dist/` has no `404.html`, so GitHub Pages serves its generic page with no link to the site. In the app, `Router.route` sends every unknown `#/name` home with no word said (`t6.py`). The brief itself calls the routes `#/chips` and `#/summary`, so readers and colleagues will too.
- **Change:**
  - `build/build.js` (with `build/modules/social.js`'s page frame and `build/assets/chapter-page.css`): write `dist/404.html` with `<meta name="robots" content="noindex">`. The masthead, the 15-bar track and the footer stay as on every static page, and the body is:
    ```html
    <header class="ch-head"><p class="eyebrow"><b>Not found</b></p><h1 class="ch-title">No page at this address</h1>
    <p class="ch-lede">The address may be mistyped, or the page may have moved. Every chapter is one click away below.</p></header>
    <p class="nf-k">The fifteen stages</p>{{TRACK}}
    <ul class="nf-links"><li><a href="/#/chain">The Chain</a><span>All seventeen chapters, in the order a chip is made</span></li>
    <li><a href="/">Home</a><span>The chain in eleven minutes</span></li><li><a href="/glossary/">Glossary</a><span>Every term, firm, chip and country</span></li></ul>
    ```
    GitHub serves this file at any depth, so every link and asset must be root-relative (`/lithography/`, not `../lithography/`). CSS for the new pieces (`chapter-page.css`):
    ```css
    .nf-k { font-family: var(--font-label); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin: 34px 0 10px; }
    .nf-links { list-style: none; margin: 30px 0 0; padding: 0; border-top: 1px solid var(--ink); }
    .nf-links li { display: grid; grid-template-columns: 9em 1fr; gap: 4px 16px; align-items: baseline; padding: 12px 0; border-bottom: 1px solid var(--line); }
    .nf-links a { font-family: var(--font-display); font-size: 19px; color: var(--ink); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 4px; }
    .nf-links span { font-family: var(--font-body); font-size: 15px; color: var(--ink-2); }
    @media (max-width: 640px) { .nf-links li { grid-template-columns: 1fr; } }
    ```
  - `src/app.js` `ALIAS` and `src/preroute.js` `NAMED` (the build checks they agree): `chips` and `ai-chips` to `landscape`. `#/summary` replaces the address with `summary/` (`location.replace`). A `#/<id>` or `#/chain/<id>` naming a chapter or section on The Chain lands on it as a bare anchor does. Any other unknown name shows Home with one quiet line above the title, `<p class="route-miss" role="status">Nothing at this address. This is the home page.</p>`, set in `--fs-ui-s`, `--muted`.
- **Shots:** before `pC-before-404-1440.png`, `pC-before-404-390.png` (the local server's 404, the stand-in for GitHub's page) and `t6-unknown-route-chips-1440.png` (`#/chips` showing Home). After `pC-after-404-1440.png`, `pC-after-404-390.png`, `pC-after-404-320.png`, built on the real static frame. No sideways scroll at 320.
- **Risk:** none for the 404 page. The aliases must be added to both router tables in one change.
- **Touches:** the sitemap (leave `404.html` out), the smoke test in `qa/code-review/PLAN.md` item 11 (add `#/chips` and a missing path).
- **Size:** S (the page) plus S (the aliases).

### P2-1. The Chain keeps the reader's place
- **Type:** Fix (the address follows, as the walk's already does) and Decision (the Continue reading line).
- **Where:** `#/chain` and every chapter anchor, all widths, both themes.
- **Wrong:** measured in `pD-sequence.json`. After reading 9,000 px from chapter 5's start, a reload lands at chapter 5's top, 9,000 px back (1440 and 390). A new sitting at `#/chain` starts at the very top and nothing remembers chapter 5. The walk on Home already writes `#/walk/<step>` with `replaceState` (`build/modules/walk.js`, `remember`), so the two reading surfaces behave differently.
- **Change:**
  - `src/app.js`, `Sections.update`: while `Router.current === 'stack'` and the Contents box is above the reading line, take the last chapter, section heading (`.prose h3[id]`) or flashcard deck whose top has passed 30 percent of the window. Write its id with `history.replaceState(history.state, '', '#' + id)`, keeping `history.state` so the router's `cpPlace` Back logic is unchanged. Save `{ id, chapter number, chapter title, section title }` to `localStorage` as `cp-place`, inside a try block. Throttle it to the existing scroll tick.
  - `src/template.html`, `.howto`, after the `h1.howto-title`: `<p class="howto-resume" hidden><span class="label">Continue reading</span><a href="#…"><span class="n">05</span>Photomasks and Pellicles</a><span class="s">at Variants and trade-offs →</span></p>`. Fill it and unhide it in the existing pre-paint script when `cp-place` exists, so nothing moves after paint. CSS (`src/styles.css`, beside `.howto`):
    ```css
    .howto-resume { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; margin: 6px 0 22px; padding: 11px 0 12px; border-top: 1px solid var(--ink); border-bottom: 1px solid var(--line); }
    .howto-resume .label { color: var(--accent-ink); }
    .howto-resume a { font-family: var(--font-display); font-size: var(--fs-d6); color: var(--ink); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 4px; padding: 3px 0; }
    .howto-resume a:hover { text-decoration-color: var(--accent); }
    .howto-resume .n { font-family: var(--font-mono); font-size: var(--fs-ui-s); color: var(--muted); margin-right: 7px; }
    .howto-resume .s { font-family: var(--font-body); font-size: 15px; color: var(--ink-2); }
    @media print { .howto-resume { display: none !important; } }
    ```
  This is a place marker, not a reading path. It names only what this reader last read.
- **Shots:** measured before and after in `pD-sequence.json`: the lost distance on reload falls from 9,000 px to 0 at 1440 (the reader was at a chapter top) and to 2,951 px on a phone (the return is to the section heading). The Continue line: before `pD-before-chain-landing-1440.png`, `pD-before-chain-landing-390.png`. After `pD-after-chain-landing-1440.png`, `pD-after-chain-landing-390.png`. Dark `pDark-after-chain-1440.png` (6.56:1 and up).
- **Risk:** low. The address bar now names the section, which is the better link to share. `Router.settle` stops on a changed hash, which only happens once the reader scrolls, as it should.
- **Touches:** the speed builder's `content-visibility` work (`Sizes`), since a restored anchor deep in the chain must open the chapters above it, as `preroute.js` already does with `.cv-open`. The "Link to chapter" button is unchanged.
- **Size:** M.

### P2-2. The home page names its two ways in
- **Type:** Decision.
- **Where:** `#/` first screen, all widths, both themes.
- **Wrong:** the first screen says what the site is, but not where to start. The meta line counts paragraphs and words. Nothing says the walk below is the short version and The Chain is the full one, and the glance rows send a first click to the full chapters.
- **Change** (`build/modules/walk.js`, the `wk-meta` line, and `src/modules/walk.css`): replace the meta line with a start row. The glance rows keep their links.
  ```html
  <p class="wk-start"><a class="go" href="#/walk/design-and-eda">Start reading <span class="m">· about 11 min</span> ↓</a><span class="or">or</span><a href="#/chain">The full chain, in 17 chapters →</a></p>
  ```
  ```css
  .wk-start { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 0; margin: 0; }
  .wk-start a { font-family: var(--font-mono); font-weight: 500; font-size: 15px; color: var(--ink); text-decoration: none; padding: 6px 0; border-bottom: 1px solid var(--ink); }
  .wk-start a:hover { border-bottom-color: var(--accent); color: var(--accent-ink); }
  .wk-start a.go { color: var(--bg); background: var(--ink); border: 0; padding: 9px 16px 10px; }
  .wk-start a.go:hover { background: var(--accent-fill); color: #fff; }
  .wk-start .or { font-family: var(--font-mono); font-size: 14px; color: var(--muted); margin: 0 14px; }
  .wk-start .m { opacity: .72; font-weight: 400; }
  @media (max-width: 480px) { .wk-start { flex-direction: column; align-items: flex-start; gap: 12px; } .wk-start .or { display: none; } }
  ```
  The minutes stay computed (`mins`). The word and paragraph counts go.
- **Shots:** before and after at 1440, 1024, 390 and 320: `pE-before-home-first-1440.png` and `pE-after-home-first-1440.png`, and the same names for `-1024`, `-390` and `-320`. Dark `pDark-after-home-1440.png`. The glance moves down 25 px at 1440 and 74 px at 390. Targets are 37 and 43 px tall. No sideways scroll at 320.
- **Risk:** the ink box is the one filled control on the page. It is square, has no shadow and matches "Show answer".
- **Touches:** the share card text is unchanged. Print hides the walk's head already.
- **Size:** S.

### P2-3. The phone Contents sheet shows where the reader is
- **Type:** Fix.
- **Where:** the Contents sheet (`#sheet`), phones, The Chain and the walk.
- **Wrong:** opened in the middle of chapter 10, the sheet lists all 17 chapters with nothing marked and no sections. A reader 8,000 px into a 12,756 px chapter cannot jump to "The chokepoint" in the same chapter.
- **Change** (`src/app.js`, `Stage.init`, the sheet's `open(true)`; `src/styles.css`, the `.sheet-chapters` block): on open, set `aria-current="location"` on the current chapter's link (`Sections.currentId`) and insert that chapter's sections (`.prose h3[id]`) beneath it, with the one on the reading line marked.
  ```css
  .sheet-chapters a[aria-current] .n { color: var(--accent-ink); font-weight: 600; }
  .sheet-secs { list-style: none; margin: 0; padding: 2px 0 10px 44px; border-bottom: 1px solid var(--line); }
  .sheet-secs a { display: block; border: 0; padding: 8px 0; font-family: var(--font-body); font-size: 16px; color: var(--ink-2); }
  .sheet-secs a.here { position: relative; color: var(--ink); }
  .sheet-secs a.here::before { content: ""; position: absolute; left: -16px; top: 50%; width: 6px; height: 6px; margin-top: -3px; background: var(--accent); }
  ```
  The sheet opens scrolled so the current chapter is in view.
- **Shots:** `pF-before-sheet-ch10-390.png`, `pF-after-sheet-ch10-390.png`, side by side in `pF-sheet-ch10-390-pair.png`. Section links are 41 px tall.
- **Risk:** low. Do it after the accessibility builder's focus work on the same function lands.
- **Touches:** desktop has the ledger key and no sheet, so it is unchanged.
- **Size:** S.

### P2-4. A chip comparison can be kept, and its rows lead to the stage
- **Type:** Fix.
- **Where:** `#/landscape`, all widths.
- **Wrong:** measured in `pG-sequence.json`: after a pair is picked the address is still `#/landscape`, and a reload empties the slots, so the analyst cannot send or bookmark a comparison. The rows that name a stage ("Foundry, process node", "Package", "Memory type", "Export-control status") are text, so the next question, who supplies this stage and how concentrated it is, starts over from the tabs.
- **Change:**
  - `src/app.js`, `Landscape`: after every pick, change or remove, `history.replaceState(null, '', '#/landscape' + (ids.length ? '?chips=' + ids.join(',') : ''))`. `Landscape.activate` reads `chips=` and selects them. `preroute.js` already maps `#/landscape?…` to the view.
  - `src/app.js`, the spec row list (the `label: 'Foundry, process node'` entries near line 1127): an optional `stage` field per row draws a line under the row label: `<span class="cx-rowlink"><a href="#foundries-and-fabs">Chapter 09</a> · <a href="#/suppliers?stage=Foundry">Firms</a></span>`. Package goes to chapter 11 and `Advanced Packaging & OSAT`, Memory type to chapter 10 and `Memory`, and Export-control status to `#/controls`. `Suppliers.activate` reads `stage=` and calls `Suppliers.show({ stage })`.
  ```css
  .cx-rowlink { display: block; margin-top: 6px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .06em; font-weight: 500; }
  .cx-rowlink a { color: var(--accent); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; display: inline-block; padding: 4px 0; }
  ```
- **Shots:** `pG-before-chips-rows-1440.png`, `pG-after-chips-rows-1440.png`, `pG-before-chips-rows-390.png`, `pG-after-chips-rows-390.png`. Links are 25 px tall. No sideways scroll.
- **Risk:** low. The slots UI the owner approved is untouched.
- **Touches:** Suppliers (the new `stage=` parameter), and site search's chip results, which can then link `#/landscape?chips=<id>`.
- **Size:** M.

### P2-5. Search finds the figures
- **Type:** Fix.
- **Where:** site search, all widths.
- **Wrong:** `Tools.buildIndex` indexes chapters, sections, terms, suppliers, chips, events, China revenue and flashcards, but none of the 59 figures. A journalist who types "hbm revenue" gets the chapter and terms, never the chart "Global HBM revenue by supplier, 2025" with its source.
- **Change** (`src/app.js`, `Tools.buildIndex`, after the section loop): one entry per `figure.figure[id]` in The Chain, of kind `Figure`, titled from `.fig-title` (cut at the first full stop), with the chapter title and `.fig-source` as its text, linking `#<figure id>`. In `Tools.KIND`, give Figure one point less than Chapter.
- **Shots:** `pH-before-search-hbm-revenue-1440.png`, `pH-after-search-hbm-revenue-1440.png`, `pH-before-search-hbm-revenue-390.png`, `pH-after-search-hbm-revenue-390.png`. After, the figure is the first result, with its source in the snippet.
- **Risk:** none. `Keys.land` already focuses a landed figure's heading.
- **Touches:** none.
- **Size:** S.

### P2-6. The Suppliers ladder joins the chapters
- **Type:** Decision.
- **Where:** `#/suppliers`, By stage, ladder. All widths, both themes.
- **Wrong:** the ladder's 20 supplier categories differ from the 15 chapter stages, and a row says "6 firms, 2 critical" while its chapter says "Extreme". A reader has no way from the row to the chapter, or to its band. The big Fraunces numeral in the ledger column is a count of firms, set exactly like the chapter numerals in the same column on The Chain.
- **Change** (`src/app.js`, the ladder rung template near line 1711; `src/modules/suppliers.css`): a category-to-chapter map (17 of the 20 categories map; Optics & Photonics, Equipment Subsystems and AI Accelerator Vendor stay unlinked) adds a line to `.sup-rung-head`, and the numeral gets a small "firms" under it.
  ```html
  <p class="sup-ch"><a href="#lithography">Chapter 04</a> · <b class="x">Extreme</b> concentration</p>
  ```
  ```css
  .sup-rung-head { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 14px; }
  .sup-ch { margin-left: auto; font-family: var(--font-mono); font-size: 12px; letter-spacing: .02em; color: var(--muted); white-space: nowrap; }
  .sup-ch a { color: var(--ink-2); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; display: inline-block; padding: 4px 0; }
  .sup-ch b { font-weight: 600; } .sup-ch b.x { color: var(--accent-ink); }
  .sup-rank::after { content: "firms"; display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
  @media (max-width: 640px) { .sup-ch { margin-left: 0; flex-basis: 100%; } }
  ```
  The band words are the plain bands the owner chose, read from the chapter data. No new metric is added.
- **Shots:** `pK-before-suppliers-ladder-1440.png`, `pK-after-suppliers-ladder-1440.png`, `pK-before-suppliers-ladder-390.png`, `pK-after-suppliers-ladder-390.png`. Dark `pDark-after-ladder-1440.png` (6.32:1 and up).
- **Risk:** a row now carries two scales, the firm squares and the stage band. That is why this is the owner's call. The alternative is the link alone, without the band.
- **Touches:** the static Suppliers page could take the same line.
- **Size:** S.

### P3-1. The static masthead fits one row on a phone
- **Type:** Fix.
- **Where:** every static page, 480 px and below.
- **Wrong:** the five links wrap, leaving "Glossary" alone on a third row, and the masthead is 127 px tall at 390, against 69 px in the app.
- **Change** (`build/assets/chapter-page.css`, new block after the 640 px block):
  ```css
  @media (max-width: 480px) {
    .masthead nav { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; gap: 0; margin-left: -6px; width: calc(100% + 6px); }
    .masthead nav::-webkit-scrollbar { display: none; }
    .masthead nav a { font-size: 11.5px; padding: 7px 6px 9px; }
  }
  ```
  This matches the app's phone strip. Below 360 px the strip scrolls, as the app's does.
- **Shots:** `pI-before-static-masthead-390.png` and `pI-after-static-masthead-390.png` (127 to 98 px), with the same names for `-360` and `-320`. All four together in `pI-static-masthead-pairs.png`. Links are 35 px tall. No page sideways scroll.
- **Risk:** at 320 "Glossary" sits past the edge until the strip is swiped. Copy the app strip's edge fade if round one's builder added one.
- **Size:** S.

### P3-2. On a phone, a chapter ends with Next first
- **Type:** Decision.
- **Where:** the end of every chapter in the app, 640 px and below.
- **Wrong:** Previous sits above Next at the same size. A student reading front to back wants Next, which comes second.
- **Change** (`src/styles.css`, after `.prevnext`):
  ```css
  @media (max-width: 640px) {
    .prevnext { display: flex; flex-direction: column; }
    .prevnext .next { order: -1; text-align: left; }
    .prevnext .next .t { font-size: 22px; }
    .prevnext .prev { padding: 10px 0 12px; }
    .prevnext .prev .label { display: inline; margin: 0 8px 0 0; }
    .prevnext .prev .t { display: inline; font-size: 15px; font-family: var(--font-body); }
  }
  ```
  The DOM order stays Previous then Next, so assistive tech reads it as before.
- **Shots:** `pJ-before-chapter-end-390.png`, `pJ-after-chapter-end-390.png`, plus the `-320` pair. The block shrinks from 156 to 140 px.
- **Risk:** a visual order that differs from the DOM order. Tab order stays Previous first, which is acceptable because both are links in one nav.
- **Size:** S.

### S-1. The system question: one chapter per address
- **Type:** Decision (structure).
- **Where:** The Chain, all widths.
- **Wrong:** measured in `pL-chain-length.json`. The Chain is 166,306 px at 1440 and 241,668 px on a phone, and its scrollbar thumb is 4.9 px and 2.9 px tall. A single chapter is 8,490 to 12,134 px at 1440 and 12,196 to 18,022 px on a phone. The end of a chapter is not an end, because the next one starts about 100 px below, so "Next" is a jump of a few hundred pixels and the reader's progress through a chapter is invisible. P2-1 and P2-3 patch this inside the current structure. Every comparable reference work (online textbooks, documentation, encyclopedias) uses one chapter per address with a contents page. The static pages already do exactly that here, and they read well.
- **Two structures, different at a glance:**
  - **A. Keep one page, add wayfinding.** P2-1 (the address follows, Continue reading) plus P2-3 (the sheet marks the place). Continuous reading, the long specimen strip and one-page print stay as they are. Size M.
  - **B. One chapter per view.** The Chain tab opens the contents page (`.howto` and `.contents`). Each chapter shows alone at its own address (keep `#lithography`, which every link already uses), under a one-line crumb "The Chain / Chapter 04 of 17", and ends on Next, Sources and the footer. Prototype by CSS on the live page: `[data-view=stack] > .howto, [data-view=stack] > .contents, [data-view=stack] article.chapter:not(#lithography) { display: none }`. That makes the page 10,677 px at 1440 and 15,340 px on a phone, and the thumb grows to 76 px and 47 px. Print keeps every chapter with `@media print { [data-view=stack] article.chapter { display: block !important } }`, and search still indexes the hidden chapters, because the DOM is unchanged. Cmd-F then finds text only in the open chapter. Size L (router, `Sections`, `preroute.js`, the specimen strip's chapter changes, print check, the walk's "Read the chapter" links unchanged).
- **Shots:** before `pM-before-top-1440.png`, `pM-before-end-1440.png`, `pM-before-top-390.png`, `pM-before-end-390.png` (chapter 4's end runs into chapter 5). After (B) `pM-after-top-1440.png`, `pM-after-end-1440.png`, `pM-after-top-390.png`, `pM-after-end-390.png` (the chapter ends on Next and the footer).
- **Recommendation:** B is the better structure for a reference read in sittings, and it removes most of what P2-1 works around. It is a large change to a site that is live and weekly-maintained, so ship A's address-follow and Continue line now (they carry over into B unchanged) and decide on B with the owner after reading the prototype shots.

### Observed, not proposed
- The static chapter button "Open the interactive chapter" links to the absolute production address (`build/modules/social.js`, `app = BASE + '#' + ch.id`), while the five reference pages link relatively (`../#/landscape`). Local previews and mirrors therefore leave for production. Making it `../#<id>` is a one-word change if the absolute form was not deliberate.
- Figures deep-link well but offer no visible link or copy control. A "Link" beside each figure's source line would serve journalists. Not proved here.
- The static page lede states a figure ("48 of them in 2025") with no source mark. The same figure is cited about 2,600 px further down. A cite mark on the lede would be a content change, so it is outside this review.

## 3. Top five
1. **P1-1. The board keeps the picked year.** `pA-before-1-pick-1440.png`, `pA-before-2-scroll-1440.png` / `pA-after-1-pick-1440.png`, `pA-after-2-scroll-1440.png`; `pA-sequence.json`. Fix, S.
2. **P1-2. Phones can reach the board.** `pB-before-controls-phone-390.png` / `pB-after-controls-phone-390.png`. Fix, S.
3. **P2-1. The Chain keeps the reader's place** (the address follows, Continue reading). `pD-sequence.json` (9,000 px lost becomes 0 px at 1440, or 2,951 px to the section start on a phone), `pD-before-chain-landing-1440.png` / `pD-after-chain-landing-1440.png`. Fix plus Decision, M. It leads into S-1.
4. **P1-3. A 404 page and the missing route aliases.** `pC-before-404-1440.png` / `pC-after-404-1440.png`, `t6-unknown-route-chips-1440.png`. Fix, S.
5. **P2-2. Home names its two ways in.** `pE-before-home-first-1440.png` / `pE-after-home-first-1440.png`, `pE-before-home-first-390.png` / `pE-after-home-first-390.png`. Decision, S.

All paths are under `qa/design2/shots/ux/`.
