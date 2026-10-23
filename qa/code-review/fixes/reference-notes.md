# Reference pages: notes (21 October 2026)

The four reference sections now have real, crawlable pages at `/suppliers/`, `/export-controls/`, `/chips/` and `/glossary/`. Each has a self-referencing canonical, no redirect, content readable without scripts, a link near the top (and again at the end) to the interactive view, structured data, and a place in the sitemap. The SEO review's section 6 checks (`qa/code-review/seo.md`) all pass, as listed under Proof.

## What was built

- **`build/modules/reference-pages.js`** (new). Writes the four pages from `data/` through the main page's own helpers, so a weekly data edit updates them on the next build. It runs before `social.js` and lists its pages on `ctx.referencePages`; `social.js` skips those four views and `build.js` adds them to the sitemap. It warns (never throws) on a missing input, a duplicate anchor, an unknown board state, a chip with no sources or a page over 400 KB.
- **`build/assets/reference-page.css`** (new). Inlined after `chapter-page.css`, so the pages share the chapter pages' tokens, type, masthead, footer and ledger style. They open light. Dark comes only from `?theme=dark` or the saved choice, through the chapter pages' own theme script. The column is wider (1160 px) for ledgers and tables, and running text keeps the reading measure. Wide tables scroll inside their own frame with the first column pinned.

| Page | Raw size | Content | Structured data |
|---|---|---|---|
| `/suppliers/` | 319 KB (326,523 B) | Dek; stages in the ladder's order (fewest firms first); each firm with name, native name, country and city, ticker, chokepoint level in words, what it makes, customers, share note, founded, ownership, revenue as the drawer prints it, China share linked to its row on `/export-controls/`, and the row's source; the revenue method note; what each country makes | `Dataset` |
| `/export-controls/` | 221 KB (226,175 B) | Dek; the board's 11 rows as of the build date (state word, label, effective and announced dates, legal citation linked, link to the timeline entry) with the board's key; all 74 timeline entries by year (date, in-force date, actor, kind, title, one-line summary, full summary, citation linked to the source); China's share of revenue at 24 firms by fiscal year, each cell linked to that year's filing | `Dataset` |
| `/chips/` | 211 KB (215,937 B) | Dek and the specs note; one table of the 38 chips (vendor and country, year announced, foundry and node, memory type and stacks, memory GB, memory suppliers, package and assembler, bandwidth, FP16, FP8 and FP4 TFLOPS, power); each cell carries the number of its source; "not published" or "not supported" as the comparison prints them; each chip's numbered source list and its note on how the speed figures are measured | `Dataset` |
| `/glossary/` | 352 KB (360,294 B) | Dek; letter anchors; all 208 terms alphabetical, each with its own id (`/glossary/#hbm`), other names, definition, the reason it matters, "Read it in" its home chapter and "Also in" every other chapter page that uses it; then every firm, chip and country, each linked to its anchor on `/suppliers/` or `/chips/` | `DefinedTermSet` |

### Where every figure comes from

Nothing is typed, rounded or computed in the module. Figures print as the main page prints them, from the same fields:
- Revenue: `revenueShown` from `build.js` (filed amount linked to the filing, fiscal year by end month, "about $X" from `build/fx.js`). The rate basis (`revenueUSDBasis`, as the CSV export carries it) is the dollar figure's hover title. The filing's note shows as "About the revenue figure", as the Glossary's firm card shows it.
- China share: `china.label` from `build/exposure.js` on Suppliers. On Export Controls, each cell's share is formatted as `shareText` formats it and linked to that year's `source`, with the main table's basis labels and peak marks.
- Board: the state on the build date, read the way `Geo.stateAt` in `src/app.js` reads it. Citation text is `fr · cfr`, linked to `cite.url`.
- Chips: the comparison's own formatting (`nf`, `nil`). Each cell's source is picked the way `Landscape.sourceTitle` picks it: the first source whose label carries one of the row's words. When none does, the cell points to the chip's whole list ("all"), just as the main page lists every source.
- The main page's own words are read where it keeps them. `build.js` now passes `suppliersIntro`, `suppliersRevenueNote`, `controlsDek` and `exposureNote` on `ctx`. The template's static text (chips and glossary deks, specs note, ladder heading, board key) is read from each view's own `<section>` in `src/template.html`. Country names, stage order, short stage names, state words, instrument words and the comparison's row labels and hints are read from `src/app.js`.

### Choices to review
- **Memory suppliers column.** The brief names it, and the dek promises it, but the interactive comparison has no such row. Its source is picked by the suppliers' own names (`supplier`, `sk hynix`, `samsung`, `micron`, `cxmt`, `hbm`). Chips whose data lists no supplier say "not published".
- **"all" marks.** The Vendor row's hints match no source label for most chips, so most Vendor cells point to the whole list. That mirrors the main page's hover text.
- **Exposure note.** It begins "The charts cover..." on the main page. The static page has a table, so it reads "The table covers...". Nothing else changed.
- **"Also in" links** use the Glossary's own matching (`lookup.js` `regex`: the term and its other names, in each chapter's paragraphs and list items). Common terms list many chapters. HBM lists 10.
- **Stage order** on Suppliers follows the interactive ladder (fewest firms first), with a jump list at the top.
- **The board's date.** It is the build date, as the brief asks. The interactive board's "now" is currently the date of the last timeline entry; readers owns that fix.
- **Dataset licence.** None is given, since the owner has not chosen one (SEO review P2-7).

## SEO additions (owner approved, 21 October 2026)

1. **Nav by real path on every static page.** `social.js` now builds one masthead (`masthead(current)`, `NAV`) for the 17 chapter pages, `/intro/` and the reference pages: The Chain (`../#/chain`), AI Chips, Suppliers, Export Controls and Glossary, the last four by real path. The current page is marked `aria-current`. `/summary/` gets the same four links (`summary-brief.js`). From 800 px down, the links take a row under the wordmark and wrap at 320 px (`chapter-page.css`; the summary's own CSS also stops hiding all but one link on phones). Each page keeps its link to the interactive view.
2. **Sitemap: HTML only.** 23 URLs: home, 17 chapters, `/summary/` and the four reference pages, each with a content-based `lastmod`. The 19 PDFs are out (`build.js`) but stay on the site and are still dated by their bytes.
3. **Stage strip.** It already used real links to `../<chapter>/`, with the stage name in `aria-label` and `title` and the next stage's name as visible text in the strip's foot. The names do not fit 15 columns as visible text, so it is unchanged.
4. **Related chapters.** The mapping is one commented file, `build/related-chapters.js`, two or three picks a chapter, with the owner's examples used as given. The line sits between the end button and Previous and Next, names as anchor text, styled in `chapter-page.css`. It reads "Related pages" where a pick is a reference page. It goes in after the page is hashed, so it never moves a chapter's "Updated" date.
5. **`/summary/`** already links all 17 chapter pages by real path.
6. **Titles and descriptions.** These come from `qa/code-review/titles.json`, including the owner's later change to `/memory-and-hbm/`. It is copied verbatim to `build/page-titles.json`, the build's one list, read through `build/page-titles.js`. Edit the words there.
   - Chapter pages, `/summary/` and the reference pages use the title plus " · Chip Supply Chain" (`pageTitle()`). The meta, `og:description` and `twitter:description` use the file's description. `og:title` and `twitter:title` use the file's title without the suffix, since `og:site_name` carries the name.
   - Home takes the file's title exactly as written, which already ends in the site name. The template's six head tags are now `{{HOME_TITLE}}` and `{{HOME_DESCRIPTION}}`, filled by `social.js`.
   - The summary gained `twitter:title` and `twitter:description`.
   - On the reference pages, each count in the approved words (226 firms, 24 firms, 38 AI chips, 208 terms, since 2018) is set from the data at build. The build warns if the file's number no longer matches.
   - No h1 or heading changed. The share cards read the unchanged manifest, so they keep their titles.

### Final rendered `<title>` of the 23 pages (checked against the file: 0 mismatches in title, description, OG or Twitter tags)
| Path | `<title>` |
|---|---|
| `/` | How AI chips are made · Chip Supply Chain |
| `/design-and-eda/` | How chips are designed with EDA software · Chip Supply Chain |
| `/silicon-and-wafers/` | How silicon wafers are made · Chip Supply Chain |
| `/chemicals-gases-and-photoresist/` | Photoresist and the chemicals used to make chips · Chip Supply Chain |
| `/lithography/` | How ASML's EUV lithography machines work · Chip Supply Chain |
| `/photomasks-and-pellicles/` | What photomasks and pellicles are · Chip Supply Chain |
| `/deposition-and-etch/` | How deposition and etch build a chip · Chip Supply Chain |
| `/metrology-and-inspection/` | How wafer metrology and inspection work · Chip Supply Chain |
| `/transistors-and-front-end/` | How gate-all-around transistors are made · Chip Supply Chain |
| `/foundries-and-fabs/` | How chip foundries like TSMC work · Chip Supply Chain |
| `/memory-and-hbm/` | What HBM is and who makes it · Chip Supply Chain |
| `/advanced-packaging/` | How advanced packaging like TSMC's CoWoS works · Chip Supply Chain |
| `/substrates-and-pcbs/` | What chip substrates and PCBs are · Chip Supply Chain |
| `/test-and-assembly/` | How chips are tested and assembled · Chip Supply Chain |
| `/systems-and-networking/` | How AI chips are networked together · Chip Supply Chain |
| `/data-centers-and-power/` | How AI data centers get their power · Chip Supply Chain |
| `/component-costs/` | What Nvidia's B200 AI chip costs to make · Chip Supply Chain |
| `/geopolitics/` | Who controls the chip supply chain · Chip Supply Chain |
| `/summary/` | The AI chip supply chain in brief · Chip Supply Chain |
| `/chips/` | AI chips compared · Chip Supply Chain |
| `/suppliers/` | Who makes what in the AI chip supply chain · Chip Supply Chain |
| `/export-controls/` | Chip export controls since 2018 · Chip Supply Chain |
| `/glossary/` | Glossary of chip terms · Chip Supply Chain |

## Files touched
- New: `build/modules/reference-pages.js`, `build/assets/reference-page.css`, `build/related-chapters.js`, `build/page-titles.js`, `build/page-titles.json`.
- `build/modules/social.js`: one shared `MASTHEAD`/`masthead()` and `THEME_JS` in place of the two inline copies; skips the four views `reference-pages.js` writes; exports its head helpers; approved titles in `pageTitle`, `shareTags` and the chapter meta and JSON-LD description; the related line; `HOME_TITLE`/`HOME_DESCRIPTION`; header comment. The speed builder's lazy print-still edit in `staticAnimations` is untouched.
- `build/build.js`: `controlsDek`, `exposureNote` and `exposureFirms` hoisted into constants (the two `fill` calls use them, same words), five values added to `ctx`, and the sitemap list.
- `build/modules/summary-brief.js`: nav links, phone nav CSS, approved title tags.
- `build/assets/chapter-page.css`: masthead wrapping, `aria-current` style, the 370 px rule (the wordmark keeps its phone size now that it has its own row), `.related`.
- `src/template.html`: the home page's six title and description tags only.

## Proof
- Build: `node build/build.js` exits 0 with no warnings. It prints `reference pages: suppliers 319 KB · export-controls 221 KB · chips 211 KB · glossary 352 KB`.
- `node qa/scripts/check-speak.js`: no matches. `check-integrity.js`: no problems, exit 0. `check-sources.js`: 2,721 citations, all tier A or B.
- Links and JSON-LD (my script, scratchpad `check_links.py`) on the four pages, `/summary/` and the 17 chapter pages: 1,995 internal links, each resolving to a file in `dist/` or an id on its target page; 1,205 external URLs kept as cited, none fetched. Every JSON-LD block parses. Each page has one h1. The exception is `/summary/`, which has two (its screen and print layouts, existing, SEO review P3-5).
- Head: canonical is the page's own URL on all four; no meta refresh, no `location.replace`; one h1 each ("Suppliers", "Export Controls", "AI Chips", "Glossary"); Open Graph and Twitter tags with the existing card. Each page opens with its own dek. A first build gave the Glossary the AI Chips dek; the dek is now matched inside each view's own `<section>`.
- Writing: the four pages' text, run through check-speak's patterns plus semicolons and "you", shows hits only in data text (legal citations, chip notes, one quoted timeline line) and the unchanged footer, none in the words added here.
- Browser, headless Chrome on port 10383 with the analytics host blocked: 67 loads. The four pages at 1440, 1024, 390 and 320, light and dark; lithography, geopolitics, memory and summary at 1440, 390 and 320; the app at `#/`, `#/suppliers`, `#/controls`, `#/landscape`, `#/glossary` and `#lithography`. No console errors or exceptions, and no sideways scroll on any. The one overflow found on the way (the chips' source grid at 390 and 320) was fixed with `minmax(min(22em, 100%), 1fr)`.
- PDFs: chapter PDFs print from the main page (`/?theme=light#/chain`, `build/chapter_pdfs.py`), where only head tags changed. The readable pages' print rules already hide the nav and end links, so no PDF was re-rendered.
- Shots in `qa/code-review/fixes/reference/`:
  - Each reference page as `<page>-1440-{light,dark}-{top,mid}.png`, `<page>-390-{light,dark}-{top,mid}.png` and `<page>-320-light-top.png`, plus `export-controls-1440-light-board.png`, `chips-390-{light,dark}-sources.png` and `glossary-1440-light-firms.png`.
  - The new masthead: `{lithography,geopolitics,memory-and-hbm,summary}-{1440,390,320}-masthead.png`.
  - The related line: `{lithography,geopolitics}-{1440,390}-related.png`.
  - The app, unchanged: `app-1440-{home,suppliers,controls,landscape,glossary,lithography}.png` and `app-390-suppliers.png`.

## For others
- **Speed (router):** `src/app.js:436` sets `document.title` to "Chip Supply Chain" on the home view after boot. Google renders scripts, so it may read the brand alone as the title of `/`. Consider keeping the initial `<title>` for home. Not changed here, since the router is yours.
- **Anyone editing `social.js`:** the masthead is now one constant, `MASTHEAD` and `masthead()`. Change the links in `NAV`.
