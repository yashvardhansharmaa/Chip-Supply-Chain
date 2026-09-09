# Security audit: Compute Chokepoints

Date: 9 September 2026. Read-only review of the static site, the build, the data pipeline and the deploy workflow.
Live target: https://yashvardhansharmaa.github.io/chokepoints/ . Reproductions below ran against that deployed copy in Chrome unless a file path says otherwise.

Nothing in this audit is exploitable by an outside attacker today, with one exception (M2, a crafted link that half-breaks the page for whoever clicks it). The two Medium findings are latent: they describe what a future contributor's mistake, or a poisoned upstream document title, would turn into. That is the threat model the brief asked for, and it is the right one for a site whose data files are edited by hand and harvested from the open web.

**Counts: 2 Medium, 6 Low, 1 Informational.**

---

## M1. `esc()` is used as a URL sanitiser. It is not one.

**Severity: Medium** (latent cross-site scripting; today blocked by an incidental attribute)

Both escapers, `build/build.js:11` and `src/app.js:9`, replace `& < > "` and nothing else. They make a value safe as *text* and safe *inside a double-quoted attribute*. They do not make it safe as a *URL*, because `javascript:` contains none of those four characters. Every link built from a data file passes its URL through `esc()` and then straight into an `href`.

Reproduced in the browser, using the live page's own `window.CP.esc` and the exact expression from `src/app.js:663`:

```
input   : { name:'Acme Tools', role:'makes things', source:'javascript:alert(document.domain)' }
rendered: <td class="role">makes things <a href="javascript:alert(document.domain)"
          target="_blank" rel="noopener" class="cc" aria-label="Source for Acme Tools">source</a></td>
a.protocol === "javascript:"   -> true
```

The browser parses it as a live `javascript:` URL. A second test settled whether it fires:

| rendered link | clicked | script ran |
| --- | --- | --- |
| `<a href="javascript:…" target="_blank" rel="noopener">` | yes | **no** |
| `<a href="javascript:…">` (same sink, no target) | yes | **yes** |

Chrome refuses to run a `javascript:` URL that targets a new browsing context. So the site is safe right now for one reason only: every data-fed link happens to carry `target="_blank"`. That is an accident of the citation style, not a control. Drop the attribute from any one of these sinks, or add a tenth sink without it, and the site has stored XSS on a `github.io` origin.

`data:text/html` is a lesser worry: it renders in the `href` the same way, but browsers have blocked top-level `data:` navigation since 2017.

Affected sinks, all fed by editable JSON:

| File and line | Field |
| --- | --- |
| `src/app.js:591` | `landscape.json` -> `sources[].url` |
| `src/app.js:663` | `suppliers.json` -> `source` |
| `src/app.js:720` | `export-controls-timeline.json` -> `source` |
| `src/app.js:842` | `control-thresholds.json` -> `source` |
| `src/app.js:876` | `exposure.json` -> `source` |
| `build/build.js:85` | chapter front matter -> `figures[].source.url` |
| `build/build.js:439`, `:440`, `:458` | `exposure.json` -> `source` (SVG anchors) |

All seven data files are clean today. I grepped `data/` and `content/` for `javascript:`, `vbscript:` and `data:text/html` and found nothing, and every `source` value is `https://`.

**Fix.** Add one helper to each side and route every data-fed URL through it. In `build/build.js`, beside `esc` on line 11:

```js
const safeUrl = (u) => { const s = String(u == null ? '' : u).trim();
  return /^(https?:|mailto:|#|\/)/i.test(s) ? esc(s) : '#'; };
```

and the same in `src/app.js` beside line 9. Then replace `esc(r.source)` with `safeUrl(r.source)` at the nine sites above. Have the build warn when a URL is rejected, so a typo surfaces in `dist/build-report.txt` instead of silently becoming `#`. This costs one function and makes the `target="_blank"` coincidence stop mattering.

---

## M2. A malformed URL fragment aborts the boot sequence

**Severity: Medium** (denial of function, triggerable by anyone with a link)

`src/app.js:212` calls `decodeURIComponent` on the raw fragment with no guard:

```js
var anchor = v === 'geopolitics' ? 'geopolitics' : (!m && h.length > 1 ? decodeURIComponent(h.slice(1)) : null);
```

A truncated percent-escape throws `URIError`. `route()` is called from `Router.init()` at line 206, which `boot()` calls at line 1022 with nothing around it, so the throw takes out the rest of `boot()`.

Reproduced on a cold load of the live site at `?fresh=1#%E0%A4%A`:

```
console: Uncaught URIError: URI malformed  (chokepoints/:8225)

                    clean load    after #%E0%A4%A
Router.current      "stack"       null
Sections.items      17            0
Sections.walkItems  17            0
Sections.railItems  15            undefined   <- init() never ran
```

`Sections.init()` on line 1023 never runs, and neither does the idle specimen warm-up below it. For that page load the reader loses scroll-driven specimen switching, the progress rail, the back-to-top button and section tracking. Clicking a tab afterwards repairs the router (`Router.current` becomes `suppliers`), because the next `hashchange` decodes cleanly, but `Sections` stays dead until reload. A single-character fragment such as `#%` does the same thing.

`src/modules/walk.js:70` has the identical call. The router's `try/catch` at `src/app.js:227` does not cover it, because `jump()` runs inside a `setTimeout` (line 85) and throws asynchronously.

**Fix.** Decode defensively in both places:

```js
var decode = function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } };
```

Use it at `src/app.js:212` and `src/modules/walk.js:70`. Wrap the body of `boot()` so no single init can strand the ones after it, or at minimum move `Router.init()` after `Sections.init()`.

The rest of the router is sound. Lookups use `document.getElementById`, which accepts arbitrary strings without parsing them, so no crafted anchor can throw the way a `querySelector` would. The view name is matched against the `VIEWS` allowlist at line 211. `scrollIntoView` runs only on an element that was found. There is no open redirect: the only assignment anywhere in the runtime is `location.hash = '#/'` at line 205, and `grep` found no `location.href =`, `location.assign`, `location.replace` or `window.open`.

---

## L1. The `window.CP_DATA` script guard covers only the closing tag

**Severity: Low** (content integrity, not injection)

`build/build.js:543` inlines the whole dataset into a `<script>` block:

```js
fill('DATA', JSON.stringify(data).replace(/<\/script/gi, '<\\/script'));
```

That stops the obvious breakout. It does not stop `<!--`. If a data value ever contains `<!--` and, later, `<script`, the HTML tokenizer enters the script-data-double-escaped state, where `</script>` no longer closes the element. The page's own closing tag on template line 172 would be swallowed, taking `{{APP}}` and the rest of the document with it. The result is a blank page, not code execution, because `</script` stays neutralised.

The current build is clean. Scanning the emitted blob in `dist/index.html`:

```
CP_DATA blob bytes   : 471661
contains <!--        : false
contains <script     : false
contains </script    : false
contains U+2028/2029 : false
```

**Fix.** Escape the angle bracket itself, which covers every case at once:

```js
fill('DATA', JSON.stringify(data).replace(/</g, '\\u003c'));
```

`<` is valid inside a JSON string literal and parses back to `<`, so nothing downstream changes.

---

## L2. No Content-Security-Policy, referrer policy or frame protection

**Severity: Low**

`curl -sI` against the live URL returns:

```
strict-transport-security: max-age=31556952
access-control-allow-origin: *
cache-control: max-age=600
```

and no `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` or `Permissions-Policy`. GitHub Pages does not let you set response headers, so a `<meta http-equiv>` tag is the only lever.

What the page looks like to a CSP, measured live:

| | count |
| --- | --- |
| inline `<script>` blocks | 24 |
| external scripts | 0 |
| inline `<style>` blocks | 1 |
| elements with a `style=` attribute | 202 |
| inline event-handler attributes (`onclick=`, …) | 0 |
| external origins | 2 (fonts.googleapis.com, fonts.gstatic.com) |
| forms, images, iframes, objects, `<base>` | 0 |

**The trade-off.** A meta CSP buys less here than a header would, and the reasons are worth stating before anyone spends an afternoon on it:

- `frame-ancestors` is **ignored** in a meta CSP. Clickjacking cannot be fixed on GitHub Pages at all. For a document site with no forms, no auth and no state-changing controls, the risk is someone framing the site to lend credibility to their own page. Accept it.
- `report-uri` and `report-to` are also ignored in meta, so you get no violation telemetry.
- `script-src` must cover 24 inline blocks. `'unsafe-inline'` gives away most of the value. Twenty-four `'sha256-…'` hashes work and cost nothing at runtime, and the build already assembles the file, so it can compute them. They must be regenerated on every build or the site goes blank, which is a real maintenance hazard for a one-person project.
- `style-src` needs `'unsafe-inline'` regardless, because 202 `style=` attributes cannot be covered by hashes.

What a meta CSP does buy, cheaply and without the hash treadmill: `object-src 'none'`, `base-uri 'none'` (stops an injected `<base>` from re-pointing every relative URL), `form-action 'none'`, and a `connect-src` that would stop injected script from exfiltrating anything. Given that there are zero inline event handlers, a hashed policy is achievable if you want it later.

**Fix.** Add to `src/template.html`, after the `<meta name="viewport">` line. Start with the version that needs no maintenance:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'none';
  script-src 'unsafe-inline';
  style-src 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src data:;
  connect-src 'none';
  base-uri 'none';
  form-action 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

`img-src data:` covers the SVG noise texture in `src/styles.css`. Swapping `'unsafe-inline'` in `script-src` for build-generated hashes is the upgrade path; do it only if the build emits them automatically.

**Referrer.** Chrome already defaults to `strict-origin-when-cross-origin`, so a click through to an SEC filing sends `https://yashvardhansharmaa.github.io/` and no path. The leak is small but not zero: it tells the regulator's analytics that the visit came from this site. Setting the meta tag makes the behaviour explicit across browsers. If you would rather filings learn nothing, use `content="no-referrer"`; the cost is that you lose referral credit from sites you link to.

---

## L3. Google Fonts sees every visitor

**Severity: Low** (privacy)

`src/template.html:8-10` preconnects to Google and pulls one stylesheet. Measured on the live page: 7 resources total, 1 from `fonts.googleapis.com` and 6 woff/woff2 files from `fonts.gstatic.com`.

Every visitor's IP address, User-Agent and `Referer` reach Google on first load, before any consent, for three font families. There is no analytics, no cookie and no other third party, so this is the site's only outbound leak. A German court found this arrangement a GDPR violation in 2022 (LG München I, 3 O 17493/20), and the site has no cookie banner or privacy notice to disclose it.

Self-hosting is warranted and unusually easy here. The site already inlines every script, style and dataset into one file; the fonts are the last thing it does not own. Six woff2 files subset to Latin run roughly 150 to 250 KB against a 2 MB page, and self-hosting also removes a render-blocking third-party round trip and a cross-origin dependency the site cannot control.

**Fix.** Download the six woff2 files into `src/fonts/`, add `@font-face` rules with `font-display: swap` to `src/styles.css`, and delete the three `<link>` tags from `src/template.html`. Either base64 the files into the CSS to keep the single-file property, or have `build/build.js` copy them to `dist/fonts/` alongside the datasets it already copies on line 553. Then tighten the CSP above to `style-src 'unsafe-inline'; font-src 'self' data:` and drop both Google origins.

---

## L4. Two debug hooks ship in production

**Severity: Low**

Both are live on the deployed site.

**`?only=`** (`src/app.js:1013`, with `src/styles.css:590`) adds `dbg-only` to the root element and hides the hero, the contents, the chain and every chapter but one. Reproduced:

- `?only=lithography` -> `html.dbg-only`, hero `display:none`, 1 of 17 chapters visible.
- `?only=stage-canvas` -> hero `display:none`, **0 of 17** chapters visible.

The second case is the problem. The hook takes any element id, not a chapter id, so `?only=` pointed at any of the page's structural ids produces a link that renders the site with no content at all. Anyone can hand that link to anyone. It is not an injection (`getElementById` with an arbitrary string is safe, and the class only ever lands on a real element), but it is a defacement-by-link affordance left in for screenshot tooling.

**`?theme=light|dark`** (`src/template.html:16`) is sound in itself. The regex `/[?&]theme=(light|dark)/` constrains the value to two literals before `setAttribute`, so nothing hostile reaches the DOM. It is worth listing only because it is undocumented and, unlike the stored preference, is not what a reader chose.

**Fix.** Scope `?only=` to chapters and to non-production hosts:

```js
var only = new URLSearchParams(location.search).get('only');
var el = only && document.getElementById(only);
if (el && el.classList.contains('chapter') && location.hostname === 'localhost') { … }
```

Keep `?theme=` and document it in `README.md` as a supported share parameter, since it is genuinely useful for linking someone to the dark view.

---

## L5. `dist/data` publishes by file pattern, not by list

**Severity: Low**

`build/build.js:553` copies everything matching `/\.(json|md)$/` out of `data/`:

```js
fs.readdirSync(path.join(root, 'data')).filter((f) => /\.(json|md)$/.test(f))
  .forEach((f) => fs.copyFileSync(…));
```

Today that ships 16 files and all 16 belong there: the seven datasets, the four method notes, `methods.md`, `changelog.json`, `source-tiers.json`, `landscape-layouts.json` and `bibliography.json`. Nothing unintended is published, and `qa/bib-cache/` is gitignored and outside `data/` so the 705 cached upstream fetches never reach `dist`.

The pattern is the risk, not the current contents. Any future working note, scratch export or draft dropped into `data/` publishes itself on the next push, silently. The Methods page invites researchers to fetch these files directly, so this is a habit worth protecting.

**Fix.** Replace the pattern with the explicit list the Methods page already maintains, or add a prefix convention the copy step skips (`_draft-*.md`), and print the copied filenames into `dist/build-report.txt` so an unintended file is visible in the workflow log.

---

## L6. Workflow actions pinned to mutable tags; permissions broader than the build needs

**Severity: Low**

`.github/workflows/pages.yml` is in good shape overall: it triggers only on push to `main` and `workflow_dispatch`, never `pull_request_target`; it references no secrets; it uses the official Pages deployment path with OIDC rather than pushing to a branch.

Two hardening notes:

1. All four actions are pinned to major-version tags (`actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`). Tags are mutable. All four are first-party `actions/*`, which makes this low risk, but commit-SHA pinning removes the class of problem entirely. Dependabot can keep SHAs current.
2. `permissions` sits at workflow level (lines 8 to 11), so the `build` job holds `pages: write` and `id-token: write` while it runs `node build/build.js`. The build needs only `contents: read`.

**Fix.** Pin to SHAs with the version in a trailing comment, and move the write scopes down:

```yaml
permissions:
  contents: read

jobs:
  build:
    # inherits contents: read only
  deploy:
    permissions:
      pages: write
      id-token: write
```

There are no runtime dependencies to audit: `package.json` declares no `dependencies` or `devDependencies`, the build uses only Node built-ins, and the page loads zero external scripts.

---

## I1. `access-control-allow-origin: *` on the live site

**Severity: Informational**

GitHub Pages sets this on every response, so any origin can `fetch()` the page and the published datasets. The content is public by design and the response carries no credentials, so there is nothing to protect. Noted because it appears in the header dump and is not something you can change.

---

## What is already sound

**The markdown pipeline escapes first, then linkifies.** This is the correct order and it holds. `inline()` at `build/build.js:52` calls `esc()` on line 53 before any pattern runs, so every later regex matches text in which `< > " &` are already entities. I replayed the exact function against hostile input:

| input | output |
| --- | --- |
| `<script>alert(1)</script>` | `&lt;script&gt;alert(1)&lt;/script&gt;` |
| `<img src=x onerror=alert(1)>` | `&lt;img src=x onerror=alert(1)&gt;` |
| `text" onmouseover="alert(1)` | `text&quot; onmouseover=&quot;alert(1)` |
| `[click](javascript:alert(1))` | left as literal text, never linkified |
| `[click](data:text/html,<script>…)` | left as literal text, escaped |
| `[x](#a" onmouseover="alert(1))` | left as literal text, escaped |
| `` `<script>alert(1)</script>` `` | `<code>&lt;script&gt;…&lt;/code>` |
| `[click](https://example.com/a?b=1&c=2)` | correct anchor, `&amp;` preserved, `rel="noopener"` |

The link regexes on lines 57, 58 and 60 require a literal `https?:`, which is why the `javascript:` and `data:` cases fall through as prose. A compromised chapter file cannot inject markup. This is the strongest part of the codebase and the URL fix in M1 should match its style.

**A poisoned bibliography title cannot inject.** This was the specific worry in the brief. `build/harvest-bibliography.js` fetches 705 upstream documents and extracts `title`, `publisher` and `date` into `data/bibliography.json`. Every consumer escapes: `sourceLine()` at `build/build.js:39` wraps the title in `esc()`, and `cite()` at line 76 escapes it again inside the `title` attribute. A hostile `<og:title>` arrives as visible text, not markup. The harvest script itself is clean too: it parses with regexes rather than a DOM, writes only three scalar fields, and its single `spawnSync` (line 393) invokes `python3 -c` with a fixed program and a file path argument, never fetched content.

**`rel="noopener"` is universal.** 1,524 `target="_blank"` attributes in `dist/index.html` and 1,525 `rel="noopener"`. Grepping the sources for a `target="_blank"` without an accompanying `rel` returns nothing.

**Escaping is applied consistently everywhere else I looked**, including all the places the brief named: the exposure dumbbell and small multiples (`build/build.js:426-461`), the chips comparison table and its notes (`src/app.js:502-594`), the suppliers table (`:658-664`), the country-share matrix (`:695-699`), the timeline (`:717-720`), the licence-thresholds table (`:840-842`), the exposure grid (`:873-876`), the glossary popover (`:765`, which reads `textContent` from the DOM and re-escapes it), the search index and results (`:885-968`), and the Methods changelog (`build/modules/methods.js:86`, escaping both `date` and `summary`).

**Numeric interpolation is genuinely numeric.** Every `style="--v:…"` and SVG geometry value passes through `Math.round`, `toFixed` or `Math.min` before reaching the attribute. The `summary-a` world map builds its path data from coordinates in `specimens/globe.js` via `JSON.parse`, not `eval` (`build/modules/summary-a.js:107`).

**No dangerous sinks anywhere.** `grep` found no `eval`, no `new Function`, no `document.write`, no `srcdoc`, no `setAttribute('on…')`, and no attribute built from data using single quotes, which matters because neither `esc()` escapes the apostrophe.

**The privacy surface is otherwise empty.** No cookies (`document.cookie` is empty), no analytics, no forms, no images, no iframes. `localStorage` holds one key, `cp-theme`, written only when the reader clicks the toggle, and every read and write is inside a `try/catch`.

**No secrets in the repository.** Scanned tracked files for private keys, `ghp_`/`github_pat_` tokens, AWS access-key IDs and `api_key=` patterns. Nothing.

---

## Priority

1. **M1**, the `safeUrl()` helper. One function, nine call sites, and it converts the site's most dangerous latent bug into an impossibility. Do this first.
2. **M2**, the `decodeURIComponent` guard. Three lines, and it fixes the only defect an outsider can trigger today.
3. **L3**, self-host the fonts. This is the largest real-world change: it removes the site's only third-party dependency and its only privacy leak, and it completes the single-file design the project already commits to.
4. **L1** (one-line `<` change), **L4** (scope `?only=`), **L5** (explicit copy list) are each a few minutes.
5. **L2** and **L6** are hardening. Add the meta CSP and referrer tag when you self-host the fonts, since that is when the policy gets simple enough to be worth maintaining.
