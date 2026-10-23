# SEO review: chipsupplychain.org

Reviewed 21 October 2026. Review only: no repository file changed except this report. Evidence comes from `dist/` (served at `http://127.0.0.1:8765/`, built 11:46 local), the build sources, and the live site fetched with `curl` and a generic user agent (`Mozilla/5.0 (research; chipsupplychain.org)`, no personal data). The live chapter pages are byte-identical to `dist/`. No search engine was queried. Rendered checks used the in-app browser against the local build at 375 px.

**Reference pages: pending.** `qa/code-review/fixes/reference-notes.md` did not exist when this report was finished, and `dist/suppliers/`, `dist/export-controls/`, `dist/chips/` and `dist/glossary/` were still the 2.6 to 2.9 KB forwarding stubs. Section 6 lists what those pages must pass once they land.

## 1. The short version

The technical base is sound. The 17 chapter pages and `/summary/` are real HTML with self-canonicals, one h1, valid Article markup, full Open Graph cards, a correct sitemap entry and a 26 KB (gzipped) payload. Redirects are single 301 hops. Nothing in `robots.txt` blocks anything. Google can index the pages that matter today.

Three things hold search traffic back, in this order:

1. **Authority.** A six-week-old domain with few links will not rank on head terms ("semiconductor supply chain", "CoWoS", "HBM") against Wikipedia, ASML, TSMC, SIA, CSET and SemiAnalysis, whatever the code does. The 52 impressions at position 6.4 are most likely the site's own name and a few long-tail facts. Links are the main lever, and section 9 ranks where to get them.
2. **The four reference pages are invisible to search.** AI Chips, Suppliers, Export Controls and the Glossary exist only as hash routes. Their static stubs canonicalize to a fragment (which Google reads as the home page) and redirect at once. These pages hold the site's most distinctive, most linkable material. The builder's work fixes most of this.
3. **Titles do not match how people search.** The home page is titled "Chip Supply Chain" and each chapter is titled with a bare noun ("Lithography · Chip Supply Chain"). Pages titled for the questions people type ("how EUV lithography works", "who makes HBM") will win long-tail rankings and clicks sooner than anything else on-page.

What will not move traffic much: more structured data, the 404 page, `lastmod` accuracy, hreflang, and page speed as a ranking signal. Each is worth doing for other reasons, and each is ranked low below.

## 2. Findings at a glance

| ID | Priority | Finding | Effort | Effect on search |
|---|---|---|---|---|
| P1-1 | P1 | Reference pages are hash routes; stubs canonicalize to home and redirect | Medium (in progress) | High: four new indexable pages on the most linkable data |
| P1-2 | P1 | Too few referring domains | Ongoing | Highest of all, slowest |
| P2-1 | P2 | Home `<title>` is the bare brand name | Minutes | Medium |
| P2-2 | P2 | Chapter titles are bare nouns; descriptions skip the query words | Small | Medium: long-tail rank and CTR |
| P2-3 | P2 | Thin internal linking: hash-only nav, numeric anchor text, few in-prose links, no links to `/summary/` | Small to medium | Medium |
| P2-4 | P2 | The 19 PDFs are in the sitemap and duplicate the HTML | One line | Small, clean |
| P2-5 | P2 | The home page carries the full text of all 17 chapters | Falls out of the speed fix | Small to medium |
| P2-6 | P2 | Generic, repeated h2s ("How it works", "Who makes it") on all 17 chapters | Small | Small to medium (snippets, passages) |
| P2-7 | P2 | No Dataset markup or license for the published data files | Small once pages exist | Medium for Dataset Search, a niche channel |
| P2-8 | P2 | `/summary/` has no share image, Twitter tags or favicon set | Minutes | Social CTR, not rankings |
| P2-9 | P2 | Bing Webmaster Tools not set up | Minutes | Small to medium (Bing, DuckDuckGo, Ecosia, AI answer engines) |
| P2-10 | P2 | Home loads in about 6 s on a phone over Slow 4G (fix underway) | In progress | Small for rank, large for launch traffic |
| P3-1 | P3 | GitHub's default 404 page | Small | Negligible |
| P3-2 | P3 | `howaichipsaremade.com` is not registered; the handoff says it forwards | Minutes | None today |
| P3-3 | P3 | Stub canonicals point at fragments instead of the page they mean | Minutes | Negligible (clarity) |
| P3-4 | P3 | WebSite and Article markup lacks `alternateName`, publisher logo, `sameAs` | Minutes | Negligible |
| P3-5 | P3 | `/summary/` prints its content twice (screen and print copies, two h1s) | Small | Negligible |
| P3-6 | P3 | `build-report.txt` is public | Minutes | Negligible |
| P3-7 | P3 | BreadcrumbList, DefinedTermSet: optional, little to gain | Small | Negligible |
| P3-8 | P3 | PDF `lastmod` moves on every re-render | Moot if P2-4 is done | Negligible |

---

## 3. P1: blocks indexing or ranking

### P1-1. The reference pages cannot be indexed (in progress)

**Evidence.**
- `dist/suppliers/index.html` (and `chips/`, `export-controls/`, `glossary/`): `<link rel="canonical" href="https://chipsupplychain.org/#/suppliers">`, then `<meta http-equiv="refresh" content="0;url=https://chipsupplychain.org/#/suppliers">` and `location.replace(...)`. Source: `build/modules/social.js:181-215` (`pageHTML`), canonical at `:190`, refresh at `:193`, redirect at `:194`.
- Google drops everything after `#`. To Google the canonical is `https://chipsupplychain.org/`, and a zero-second meta refresh is a permanent redirect to it. Each stub folds into the home page.
- The stubs hold 21 to 55 words. They are not in the sitemap (`build/build.js:1071` lists only `/`, chapters, `/summary/` and PDFs).
- Nothing links to their real paths. The static masthead links `../#/chain` and `../#/glossary` (`social.js:243`, `:462`). The app's nav links `#/landscape`, `#/suppliers`, `#/controls`, `#/glossary` (`src/template.html:76-81`). Both resolve to the home page for a crawler.
- On the rendered home page all four views sit `hidden` (checked at 375 px: `stack`, `landscape`, `suppliers`, `controls`, `glossary` hidden, `walk` shown).

**Fix.** The builder's static pages, plus four things that may fall outside their brief:
1. Self-canonical (`https://chipsupplychain.org/suppliers/`), no meta refresh, no `location.replace`.
2. Add the four paths to the sitemap list at `build/build.js:1071`, dated by `pageDate` like the chapters.
3. Link the real paths from every static page: the chapter masthead (`social.js:462`), the intro stub (`:243`) and the summary masthead (`summary-brief.js`). The masthead could carry the app's six items: Home, The Chain, AI Chips, Suppliers, Export Controls, Glossary.
4. Titles and descriptions from section 5.

**Effort.** Medium, mostly underway. **Effect.** High. These pages answer query families no chapter answers ("AI chip comparison", "semiconductor companies by stage", "chip export controls timeline", "China revenue share semiconductor companies"). They are also what journalists and researchers link to.

### P1-2. Too few links (off-page)

**Evidence.** The brief reports few backlinks. Search Console shows 52 impressions and 1 click since 19 October. Every chapter page is indexable and well formed, so the gap between "indexable" and "ranking" is authority, not code.

**Fix.** Section 9. **Effort.** Ongoing, a few hours a week. **Effect.** The largest of anything here, over months rather than weeks. Head terms need dozens of good referring domains. Long-tail queries move with the first ten.

---

## 4. P2: clear gains

### P2-1. The home page title is the brand name alone

**Evidence.** `src/template.html:6` `<title>Chip Supply Chain</title>` (17 characters). `og:title` the same (`:14`). The visible h1 on the rendered home page is "How AI chips are made", and `qa/brand-trends.md` shows "chip supply chain" scores 34 against "semiconductor supply chain" at 100, with "how chips are made" at 47. The description (`:7`, 170 characters) spends its last sentence on "3D specimen".

**Fix.** `Chip Supply Chain: how AI chips are made, stage by stage` (56). Description: `A free, sourced introduction to how AI chips are made: seventeen chapters, from design software to the data center, on who makes each part.` (139). Keep the h1. **Effort.** Minutes. **Effect.** Medium. The home page holds most of the site's authority, and its title is the strongest on-page signal it has.

### P2-2. Chapter titles and descriptions miss the queries

**Evidence.** `social.js:154` builds every chapter title as `${title} · Chip Supply Chain`, giving "Lithography · Chip Supply Chain", "Memory and HBM · Chip Supply Chain". A one-word title competes for the head term ("lithography"), which the site cannot win, and misses the questions it answers well. The descriptions (from `oneLiner`, `social.js:106`) are strong facts but often omit the topic words: the packaging description never says "advanced packaging explained", the data-centers one leads with the Texas grid, and the substrates one is cut with an ellipsis at 153 characters.

**Fix.** Section 5 gives a title and description per page. Put the query words first. Drop the " · Chip Supply Chain" suffix on chapter and reference titles: the proposed titles run 47 to 60 characters, the suffix would push them past what Google shows, and Google prints the site name above every result from the WebSite markup. Keep `og:site_name`. Keep every h1. Implementation: a `seoTitle` and `seoDescription` field in each chapter's frontmatter, read by `pageTitle` and `metaDescription`, falling back to today's values. **Effort.** Small. **Effect.** Medium: better long-tail rankings and higher CTR at the same position. Google rewrites titles less often when the title expands the h1 rather than contradicting it.

### P2-3. Internal links are thin and partly invisible to crawlers

**Evidence.**
- The visible home view has 80 links and every one is a fragment: the map tiles and "Read the chapter" use `#lithography` (`build/modules/walk.js:17` `chapterHref`, used at `:71` and `:98`). The only crawlable links from `/` to chapter pages sit inside the hidden Chain view (the cite lines, `dist/index.html` from byte 277,985).
- On chapter pages the stage strip's visible anchor text is "01" to "15" (`social.js:370-373`); the names sit only in `aria-label` and `title`, which carry little weight as anchor text.
- Few in-prose links between chapters. Counted in each chapter's prose: none in Design, Deposition, Metrology, Memory, Photomasks, Substrates, Data Centers and Who Controls the Chain; one each in Chemicals, Lithography, Silicon, Systems, Test. Memory and HBM has no link to Advanced Packaging, though HBM sits on the CoWoS interposer.
- No chapter page links to `/summary/`, the one static hub that links to every chapter (4 links each).

**Fix.**
1. In `walk.js`, give the map tiles and "Read the chapter" a real `href` (`lithography/`) and let the router intercept the click, so readers stay in the app and crawlers see a followable link from the strongest page.
2. Add two to four in-prose links per chapter on first mention of another stage (HBM in Packaging, interposer in Memory, EUV in Photomasks, transformers in Systems).
3. At the chapter's end (in `endnav`, above the fixed footer), add "The whole chain in brief" to `/summary/` and a short "Related chapters" line with names as anchor text.
4. Once P1-1 lands, link the reference pages from chapter text where a chapter mentions a firm list, a rule or a chip.

**Effort.** Small to medium. **Effect.** Medium. Internal links tell Google which pages matter and what they are about, and the site now spends most of its link signal on the home page.

### P2-4. The PDFs belong out of the sitemap

**Evidence.** The sitemap lists 19 PDFs (`dist/sitemap.xml`, built at `build/build.js:1071`). Each chapter PDF carries the same title and text as its HTML page (`pdfinfo`: "Lithography · Chip Supply Chain", 11 pages). The chain PDF is the whole site in 174 pages (9.6 MB). A PDF cannot declare a canonical without a `Link` HTTP header, and GitHub Pages cannot send one. Google's guidance is to list only canonical URLs in a sitemap.

**Fix.** Remove the PDFs from the array at `build/build.js:1071`. Keep them linked and crawlable; they will still be indexed when Google judges them useful, but the sitemap stops asking Google to treat them as primary pages. **Effort.** One line. **Effect.** Small. It lowers the chance that a PDF, with no navigation and no analytics, outranks its own chapter page, and it makes the Pages report easier to read.

### P2-5. The home page holds every chapter's full text

**Evidence.** `dist/index.html` is 4.1 MB (910 KB gzipped live). Its hidden Chain view holds all 17 chapters (1.6 MB of markup per `qa/code-review/performance.md`), so every sentence on `/lithography/` also exists on `/`. Google indexes hidden text with less weight but still indexes it. The two URLs can compete for the same query, and Google may send a searcher to a 6-second home page instead of the 26 KB chapter.

**Fix.** Coordinate with the speed fix. If The Chain's markup moves out of the initial HTML and loads on demand, serve it as JSON or from a path disallowed in `robots.txt` (for example `/views/`), so the full text has one indexable home: the chapter page. Do not ship the fragments as standalone `.html` files, which Google could index as thin pages. **Effort.** Comes with the speed work. **Effect.** Small to medium: a clearer topic for `/` (the intro and the map) and less cannibalization.

### P2-6. The same h2s on every chapter

**Evidence.** Every chapter page uses "In short", "How it works", "Variants and trade-offs", "Who makes it", "The chokepoint", "Review questions". Google uses headings to pick passages and featured snippets, and "How it works" names nothing.

**Fix.** Name the subject in the two headings that match queries: "How EUV lithography works", "Who makes lithography machines"; "How HBM works", "Who makes HBM"; "How CoWoS packaging works". The section anchors (`#lithography--how-it-works`) can stay as they are so links do not break. **Effort.** Small (a template rule plus a per-chapter subject word). **Effect.** Small to medium: snippet and passage eligibility for exactly the "how X works" and "who makes X" queries.

### P2-7. The data has no Dataset markup and no license

**Evidence.** `dist/data/` publishes 20 files, among them `suppliers.json` (226 firms), `exposure.json`, `export-controls-timeline.json`, `landscape.json` and `bibliography.json`. No page carries `Dataset` markup, and the repo has no license file or license statement.

**Fix.** On the new `/suppliers/`, `/export-controls/` and `/chips/` pages, add one `Dataset` object each: `name`, `description` (50 to 5,000 characters), `url`, `creator` (the author), `dateModified`, `isAccessibleForFree: true`, `distribution` as a `DataDownload` with `contentUrl` and `encodingFormat: application/json`, and `license` once the owner picks one. A clear license (CC BY 4.0 is the common choice for text and data) also makes reuse with attribution easy for teachers and reporters, and attribution is the most natural link there is. **Effort.** Small once the pages exist. **Effect.** Medium for Google Dataset Search, where competition is thin and the audience is researchers and journalists. It will not move web rankings by itself.

### P2-8. The summary page shares without a card

**Evidence.** `build/modules/summary-brief.js:327-333`: `og:title`, `og:description`, `og:url`, `og:type` only. No `og:image`, no `twitter:card`, no `og:site_name`, only the SVG favicon. `dist/cards/` has no `summary.png`. `/summary/` is the page most likely to be shared on LinkedIn and pasted into reading lists.

**Fix.** Render a summary card with `build/cards.py`, then add `og:image` (1200 × 630), `og:image:alt`, `twitter:card` `summary_large_image`, `og:site_name`, the ICO and apple-touch icons, and Article JSON-LD as the chapters have. **Effort.** Minutes. **Effect.** Share-preview CTR, not rankings.

### P2-9. Bing is not set up

**Evidence.** Nothing in the repo or the brief mentions Bing Webmaster Tools. For a global audience Bing also feeds DuckDuckGo, Ecosia and Yahoo, and its index supplies several AI answer engines.

**Fix.** Import the property from Search Console into Bing Webmaster Tools and submit the sitemap. Keep `robots.txt` open to AI crawlers, as it is now, so the site can be cited in AI answers. **Effort.** Minutes. **Effect.** Small to medium, and cheap.

### P2-10. Page speed (fix underway)

**Evidence.** `qa/code-review/performance.md`: first useful text at 5.8 s on an emulated mid-range phone over Slow 4G for `/`, 6.8 s for Suppliers. Chapter pages: 26 KB gzipped, but first paint waits on the Google Fonts stylesheet, and they fetch a 130 KB image they never show.

**Honest effect.** Core Web Vitals are a minor ranking signal, and a site with this little traffic will show "not enough data" in the field report, so Google has little to judge it on. The fix matters for people: a Show HN or newsletter mention sends phone readers straight to `/`, and a 6-second blank page loses them. Launch the off-page burst (section 9) after the fix ships. Self-hosting fonts (`structure.md` P2-4) helps the chapter pages most.

---

## 5. Proposed titles and descriptions

Plain style, query words first, every fact taken from the chapter's own text. Titles are shown without the suffix (see P2-2). Lengths are characters. Keep each h1 as it is.

| Page | Proposed `<title>` | Len | Proposed meta description | Len | Queries it targets |
|---|---|---|---|---|---|
| `/` | Chip Supply Chain: how AI chips are made, stage by stage | 56 | A free, sourced introduction to how AI chips are made: seventeen chapters, from design software to the data center, on who makes each part. | 139 | chip supply chain, how AI chips are made, semiconductor supply chain |
| 01 `/design-and-eda/` | Chip design and EDA software: how it works, who sells it | 56 | How a chip design becomes a blueprint of billions of transistors. Synopsys, Cadence and Siemens EDA sell the software, with over 85 percent of the market. | 154 | EDA software, chip design software companies, Synopsys Cadence market share |
| 02 `/silicon-and-wafers/` | How silicon wafers are made, and who makes them | 47 | How quartz becomes the polished 300 mm silicon wafers that chips are built on. Firms in Japan, Taiwan, Germany and South Korea make most of them. | 145 | how silicon wafers are made, 300mm wafer manufacturers |
| 03 `/chemicals-gases-and-photoresist/` | Photoresist, gases and chip chemicals: who supplies them | 56 | What photoresist and the specialty gases and chemicals of chipmaking do, and who makes them. Japanese firms held 78 percent of photoresist sales in 2023. | 153 | what is photoresist, photoresist manufacturers, semiconductor gases |
| 04 `/lithography/` | How EUV lithography works, and who makes the machines | 53 | How EUV lithography prints the finest layers of a chip. ASML, a Dutch firm, is the only maker of the scanners and sold 48 of them in 2025. | 138 | how EUV lithography works, EUV machine, ASML EUV |
| 05 `/photomasks-and-pellicles/` | Photomasks and pellicles: what they are, who makes them | 55 | What a photomask and its pellicle are, and why an EUV mask is a mirror. Only three firms make the blank plates for leading-edge masks. | 134 | what is a photomask, EUV pellicle, mask blank suppliers |
| 06 `/deposition-and-etch/` | Deposition and etch: how chips are built layer by layer | 55 | How deposition and etch tools build a chip one layer at a time, and who makes them: Applied Materials, Lam Research, Tokyo Electron and Chinese rivals. | 151 | deposition and etch semiconductor, atomic layer deposition, etch equipment companies |
| 07 `/metrology-and-inspection/` | Wafer metrology and inspection: how fabs find defects | 53 | How fabs measure wafers and find defects between steps. KLA, an American firm, held 56.8 percent of the market for these tools in 2025, by CSET's count. | 152 | semiconductor metrology, wafer inspection, KLA market share |
| 08 `/transistors-and-front-end/` | Gate-all-around transistors and 2 nm chips, explained | 53 | How gate-all-around transistors, the successor to FinFETs, are built. Only TSMC, Intel and Samsung make 2 nm-class transistors in volume. | 138 | gate-all-around transistor, GAA vs FinFET, 2nm chips |
| 09 `/foundries-and-fabs/` | Chip foundries and fabs: TSMC, Samsung, Intel and SMIC | 54 | What a foundry is and where advanced chips are made. TSMC's six largest plants, all in Taiwan, could make over 13 million wafers a year in 2025. | 144 | what is a foundry, largest chip foundries, TSMC fabs |
| 10 `/memory-and-hbm/` | What HBM is and who makes it: SK hynix, Samsung, Micron | 55 | What high bandwidth memory (HBM) is and how it is stacked. SK hynix, Samsung and Micron make nearly all of it. SK hynix took 63.2 percent of 2025 revenue. | 154 | who makes HBM, what is HBM, HBM market share |
| 11 `/advanced-packaging/` | CoWoS and advanced packaging for AI chips, explained | 52 | How CoWoS and other advanced packaging put AI chips and HBM side by side on an interposer, and why TSMC's packaging capacity ran tight in 2026. | 145 | CoWoS packaging explained, what is CoWoS, advanced packaging AI chips |
| 12 `/substrates-and-pcbs/` | ABF substrates and PCBs: what sits under an AI chip | 51 | What a package substrate does and why its insulating film matters. Ajinomoto says it holds over 95 percent of the market for that film in high-end packages. | 156 | ABF substrate, Ajinomoto build-up film, IC substrate makers |
| 13 `/test-and-assembly/` | Chip testing and assembly: testers, probe cards, OSATs | 54 | How chips are tested on the wafer and after packaging, and who makes the testers. Advantest took about 65 percent of 2025 tester spending, by its own estimate. | 159 | semiconductor test equipment, probe card, OSAT companies |
| 14 `/systems-and-networking/` | AI racks and networking: NVLink, InfiniBand and optics | 54 | How 72 AI chips are wired into one rack and run as one computer, and why lasers for the optical links between racks were scarce in 2026. | 136 | NVLink, NVL72 rack, AI networking |
| 15 `/data-centers-and-power/` | AI data centers and power: what limits new sites | 48 | How much power AI data centers draw and why they take years to connect. One rack can draw 142 kW, and a big transformer took about three years to arrive in 2024. | 158 | AI data center power demand, data center transformers |
| 16 `/component-costs/` | What an AI chip costs to make: the B200 cost breakdown | 54 | What it costs to build an AI chip. Epoch AI put Nvidia's B200 at about $6,400, mostly memory and packaging, against a reported price of $30,000 to $40,000. | 155 | how much does it cost to make a GPU, B200 cost breakdown, AI chip bill of materials |
| 17 `/geopolitics/` | Who controls the chip supply chain: geopolitics explained | 56 | Who controls the AI chip supply chain: export controls since 2018, the rules of allied governments, China's response, industrial policy and Taiwan's fabs. | 154 | semiconductor geopolitics, who controls the chip supply chain |
| `/summary/` | The AI chip supply chain in brief: 15 stages in one read | 56 | (today's text, 173, cut to) The fifteen stages of the AI chip supply chain in one read: who leads each, how concentrated it is, and where China and the United States stand. | 144 | semiconductor supply chain explained, chip supply chain stages |
| `/chips/` (pending) | AI chips compared: specs, foundry, memory and packaging | 55 | (from today's line, plus) the foundry, process node, memory supplier and packaging plant behind each chip. | | AI chip comparison, B200 vs MI355X specs |
| `/suppliers/` (pending) | Chip supply chain companies: 226 suppliers by stage | 51 | (today's line works) | | semiconductor supply chain companies, chip suppliers by country |
| `/export-controls/` (pending) | Chip export controls since 2018: the rules and a timeline | 57 | (today's line works) | | chip export controls timeline, semiconductor export rules |
| `/glossary/` (pending) | Chip glossary: semiconductor terms, firms and chips | 51 | (today's line works) | | semiconductor glossary, chipmaking terms |

Two notes on the table. First, the data-centers description now leads with the mechanism (power per rack, transformer lead times) rather than the Texas grid, which reads better to a global searcher; the chapter's In short is still largely about US equipment and ERCOT, and that limits how well it can rank for "AI data center power" outside the United States. Second, "chiplet" never appears in the packaging chapter and "GAA" never appears in the transistor chapter. Both are common search words. One natural use of each, where the text already describes the idea, would help.

**Thin or duplicated text.** The chapter pages are long (3,474 to 5,733 words) and original. Thin pages are the stubs only: 21 to 55 words on the reference stubs, 30 on `/chain/`, 44 on `/home/`. All of them redirect, so none is indexed as thin. Duplication is structural, not textual: the home page (P2-5), the PDFs (P2-4) and the summary's two layouts (P3-5).

## 6. Pending: checks for the new reference pages

When `qa/code-review/fixes/reference-notes.md` and the new pages land, each of `/chips/`, `/suppliers/`, `/export-controls/` and `/glossary/` should pass:

1. HTTP 200, `rel="canonical"` equal to its own URL, no meta refresh, no `location.replace`.
2. Real content in the initial HTML, readable without scripts: rows of suppliers, the rule timeline, the chip table, the glossary definitions. Not a picture of the app.
3. One h1, a title and description from section 5, Open Graph and Twitter tags with the existing card.
4. Listed in `sitemap.xml` with a content-based `lastmod`.
5. Linked by real path from every chapter page's masthead and from `/summary/`.
6. `Dataset` JSON-LD on Suppliers, Export Controls and AI Chips (P2-7). The Glossary may carry a `DefinedTermSet`, which is valid schema.org but earns no Google feature (P3-7).
7. A link to the interactive view, as the chapter pages have.
8. No horizontal scroll at 320 px. Within the owner's decision, the glossary stays one page with anchors, never a page per term.

After launch: URL Inspection on each of the four, then "Request indexing".

## 7. P3: polish

- **P3-1. 404.** `https://chipsupplychain.org/no-such-page/` returns a correct 404, but it is GitHub's default page ("Page not found · GitHub Pages") with no way back. Add `dist/404.html` in the site's style with links to the home page, `/summary/` and the 17 chapters. GitHub Pages serves it with a 404 status. Effect: readers, not rankings.
- **P3-2. The forwarding domain.** `howaichipsaremade.com` has no DNS records, and `whois` returns "No match". `HANDOFF.md` says it forwards. Register it and 301 it to the apex, or drop the claim. No search effect unless someone links to it.
- **P3-3. Stub canonicals.** `/home/`, `/intro/` and `/chain/` canonicalize to `/#/intro`-style fragments (`social.js:190`, `:230`). Point them at `https://chipsupplychain.org/` explicitly: same result for Google, clearer intent. `/intro/` is fine as a forward, because the intro's text is the home page's visible content (rendered: one visible h1, "How AI chips are made", 4,392 visible words).
- **P3-4. Markup extras.** The WebSite JSON-LD (`src/template.html:25`) is valid. Add `alternateName: "chipsupplychain.org"` to help Google's site-name choice, and a `publisher` Organization with a `logo` (a 512 px PNG of the favicon tile) and `sameAs` (the GitHub repository). Article markup (`social.js:431-437`) is valid; `datePublished` is the day each Markdown file was first committed (9 September), three weeks before the public launch on 1 October. Harmless.
- **P3-5. Summary duplicates itself.** `summary-brief.js:343-344` writes the screen and print layouts into one page, so the HTML holds two h1s and every card twice (6,109 words). Google handles this, but a crawler sees the page as twice its length. Low priority.
- **P3-6. `build-report.txt` is public** (HTTP 200, `text/plain`). Leave it out of `dist/` or add `Disallow: /build-report.txt`.
- **P3-7. BreadcrumbList and DefinedTermSet.** Breadcrumbs would read "Home › Lithography", because The Chain has no static URL; Google already shows the domain and path, and has stopped showing breadcrumbs on mobile results. DefinedTermSet earns no Google feature. FAQ markup for the review questions would earn nothing either: Google limits FAQ rich results to government and health sites. Skip all three unless they are free.
- **P3-8. PDF `lastmod`.** PDFs are dated by their bytes (`build.js:1062-1066`), and Chrome writes a new `CreationDate` into each render, so a re-render with no change moves the date. Moot if P2-4 is done.

## 8. What is already right

- **Redirects.** `http://` → `https://` (301, one hop). `www` on http and https → apex (301, one hop each). `yashvardhansharmaa.github.io/Chip-Supply-Chain/` and its subpaths → the same path on the apex (301). `/lithography` → `/lithography/` (301).
- **robots.txt.** `Allow: /` and the sitemap line. Nothing blocked, AI crawlers included.
- **Sitemap.** Processed, 38 URLs, all 200, all canonical HTML except the PDFs. The content-hash dating (`build/build.js:836-875`, uncommitted today) is the right rule. Every `lastmod` reads 2026-10-21 today because of the switch; they will spread out as pages change.
- **Canonicals.** Home and every chapter page are self-canonical. `/index.html` duplicates `/` and is covered by the home canonical.
- **h1.** One per chapter page, matching the chapter title. Seven h1s sit in the home HTML, but only one is visible after render.
- **Structured data.** All JSON-LD parses. Article on all 17 chapters with headline, image, dates, author and publisher. WebSite on the home page. Google Scholar `citation_*` tags on chapter pages.
- **Open Graph and Twitter.** Complete on the home page, chapters and stubs, with 1200 × 630 cards and versioned URLs.
- **Language.** `lang="en"` everywhere and `inLanguage: "en"` in markup. One language means no hreflang. Translations would be the only reason to add it, and they are a large project for later.
- **Mobile.** Viewport tag on every page. At 375 px: no horizontal scroll on `/` or `/lithography/`, 18 px body text. Google retired its Mobile Usability report in December 2023; mobile-first indexing sees the same HTML here.

---

## 9. Off-page plan, ranked by likely impact

The angle for every pitch is the mechanism: how a chip is made and who makes each part, with a source behind every number. It travels across countries, and it keeps the site out of any one government's framing. Each pitch should offer one specific page, not the whole site.

| Rank | Where | Why it suits this site | How | Effort | Expected effect |
|---|---|---|---|---|---|
| 1 | **University course reading lists and library subject guides** | Durable links from university domains in every region. The site is free, sourced and has a cite line and a 4-page PDF, which is what instructors put on a syllabus. Spring syllabi are written from November to January, so the timing is now. | Email 30 to 50 instructors of semiconductor devices and fabrication, computer architecture, technology policy, international political economy, supply-chain management and AI governance courses, in Asia, Europe and the Americas. Name the one chapter that fits their course and attach the summary PDF. Separately, ask university librarians who keep subject guides on semiconductors, electronics or supply chains to list the site; such guides add free resources readily. | Medium, personal emails | High and durable, slow to show (8 to 16 weeks) |
| 2 | **Think-tank and research-lab resource pages and reading lists** | The site cites these groups' work heavily (CSET, Epoch AI, IEA, SIA and others), so the request is natural. AI-governance and compute-governance curricula keep reading lists that link out. | Write to the people behind the reports a chapter relies on: "Chapter 11 builds on your CoWoS estimates; here is how we used them." Ask to be listed in further reading or resources. Include research centers in Japan, Korea, Taiwan, India, Singapore and Europe, not only the usual Washington list. | Medium | High: few links, each strong |
| 3 | **Semiconductor and AI newsletters, Substacks and podcasts** | The readers are engineers, analysts and investors, who then link from their own posts. | Pitch one asset per newsletter: the summary to a generalist letter, the packaging or HBM chapter to an industry analyst, the supplier dataset to a data-minded writer. Publish the drafted launch post (`qa/launch-post.md`) after changing its link from the old github.io address to `https://chipsupplychain.org/`. | Medium | Medium to high: referral bursts, then secondary links |
| 4 | **Hacker News (Show HN)** | The audience likes sourced, well-made explainers with 3D models. One good day brings large traffic and gets the site read by bloggers and reporters. | One post, after the speed fix ships. Link the home page or `/summary/`. Title it plainly ("Show HN: How AI chips are made, a sourced guide to the supply chain"). Answer comments for the first hours. Do not repost. | Low | High variance: a large spike or nothing |
| 5 | **Data journalists and explainer desks** | The supplier list and China revenue shares from filings are citable data, and a news citation is a strong link. | Once P1-1 ships, pitch international business and technology desks with a current hook: an earnings season, a new rule's effective date. Offer the JSON file and the method note. | Medium | High if it lands, low odds per pitch |
| 6 | **LinkedIn** | The industry and policy audience lives there. Links are nofollow, but the people who see them run sites that link. | Post one chapter a week with its card and the single fact it leads with. Tag the organizations whose data the chapter uses; they often reshare. | Low, steady | Medium: reach and discovery, few direct links |
| 7 | **Reddit** | r/semiconductors, r/hardware, r/chipdesign, r/ECE and r/AskEngineers ask the questions the chapters answer. | Answer real questions and link the relevant chapter when it is the best answer. Read each community's self-promotion rule first. One showcase post at most per community. | Low | Low to medium: traffic, nofollow links |
| 8 | **Wikipedia** | Only where the site is a genuine source for a fact not better sourced elsewhere, which is rare: editors prefer the filings and reports the site itself cites. | Do not add links yourself; Wikipedia's conflict-of-interest rules apply to the owner. Suggest on an article's Talk page with a disclosure, for example as an external link on an article about semiconductor fabrication. Links are nofollow. | Low | Low for search, some traffic if accepted |

Two enablers multiply all of the above. A stated license (P2-7) lets teachers and reporters reuse a figure with a credit link. A DOI for the datasets through Zenodo gives researchers a citable record that links back and is picked up by scholarly indexes.

**Honest expectation.** Ranks 1 and 2 build the authority that moves rankings; expect results over months. Ranks 3 to 5 bring visitors and the chance of secondary links within days. Ranks 6 to 8 build awareness more than search position.

## 10. The explainer blog

A blog would help search if each post answers one question the chapters cover only in passing ("Why can't China buy an EUV scanner", "How long does it take to build a fab", "What HBM4 changes"), is built around one sourced figure others can cite, and links into the chapters. It would also give newsletters and journalists a fresh reason to link. It would hurt if posts repeat chapter sections, which splits rankings between two pages on the site, or if the cadence stops, which leaves dated pages behind. Do it after P1-1 and P2-2, as static pages under one folder (for example `/explainers/<slug>/`) with Article markup and sitemap entries, and keep to a cadence the owner can hold, such as two posts a month.

## 11. Measurement in Search Console, weeks 1 to 8

Note the date of each change (titles, reference pages, outreach) so before-and-after windows line up. Compare 28-day periods.

**Indexing (Pages report).**
- Working: 23 HTML URLs indexed by week 4 (home, 17 chapters, summary, 4 reference pages). Stubs listed under "Page with redirect" or "Alternate page with proper canonical tag" is expected.
- Watch "Discovered, currently not indexed" and "Crawled, currently not indexed". Chapters stuck there past week 4 point to low authority, not a technical fault; links and internal links are the remedy.
- PDFs under "Duplicate, Google chose different canonical" is fine.

**Performance report.**
- Split brand from non-brand with a query filter (exclude "chip supply chain" and "chipsupplychain").
- Working by week 4: non-brand impressions on at least 10 of the 17 chapter pages, for their own topics (filter by page, then read the queries).
- Working by week 8: non-brand impressions in the low thousands per week, and long-tail queries ("who makes HBM", "CoWoS packaging explained", "ABF substrate market share", "how many EUV machines ASML sold") reaching the top 20. Head terms will stay out of reach without links; that is expected, not failure.
- CTR: for non-brand queries at positions 1 to 10, below 2 percent means the title or description needs another try. Change one page at a time.
- Cannibalization check: for chapter-topic queries, the ranking URL should be the chapter page, not `/` or a PDF. If `/` keeps winning, P2-5 matters more.

**Links report.** It lags by weeks. Working: 10 or more referring domains by week 8, at least a few from universities or research groups. Cross-check with GoatCounter's referrer list, which shows outreach results within days.

**Enhancements.** A Dataset report appears once P2-7 ships; it should show valid items with no errors. Core Web Vitals will likely say "not enough data"; use lab measurements for the speed fix instead.

**Crawl stats (Settings).** Googlebot should fetch the chapter pages regularly after the sitemap changes. Watch the average response time on `/` before and after the speed fix.

**Bing Webmaster Tools.** The same indexing check for the 23 pages, a week or two behind Google.

## 12. The five actions that matter most

1. **Ship the four reference pages as real, indexable pages** (P1-1, section 6): self-canonical, no redirect, in the sitemap, linked by real path from every static page, then URL Inspection and "Request indexing".
2. **Retitle the home page and the 17 chapters for the questions people ask** (P2-1, P2-2, table in section 5). Keep the h1s. Minutes of work for the largest on-page gain.
3. **Write to course instructors and university librarians now**, while spring syllabi are being set, then to the research groups the chapters cite (section 9, ranks 1 and 2). This is what builds authority.
4. **Make internal links real** (P2-3): real `href`s from the home map to chapter pages, in-prose links between chapters, and links from every chapter to `/summary/` and the reference pages. Drop the PDFs from the sitemap in the same pass (P2-4).
5. **One launch burst after the speed fix:** Show HN, three to five targeted newsletter pitches, the launch post with the corrected URL, and a weekly LinkedIn chapter. Set up Bing Webmaster Tools the same day (P2-9).
