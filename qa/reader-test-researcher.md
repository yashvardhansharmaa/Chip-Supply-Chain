# Reader test: research analyst, compute governance

Tested 9 September 2026 against the local build at `http://localhost:8765/`, desktop only, 1440x900.
Persona: analyst at a think tank writing a report on compute governance. Wants citable numbers,
reusable datasets, definitions to point colleagues at, and a way to verify a figure in under a minute.

Note on method: the test harness renders the page at full document height, so scroll and anchor
behaviour could not be exercised. Nothing below is a claim about scrolling or in-page navigation.

## 1. Verdict

I would cite this site, with a workaround, and I would not yet send it to a colleague as the one
place to understand the chain. The evidentiary machinery is better than almost anything else in this
space. Footnote 4 in "Foundries and Fabs" goes straight to TSMC's 2Q26 results release on EDGAR, not
to a summary of it. Every cell in the China exposure table is a link to the filing, and the tooltip
behind "35.1%" reads "5,137.9 of 14,626.2 USD million", which is the whole verification in one hover.
The method note tells me that Nvidia moved from billing location to headquarters location in the
FY2026 10-K, that FY2025 was "$17,108m, 13.1%, on the old billing basis and is $25,048m, 19.2%,
restated", and that "the series breaks between FY2023 and FY2024". I have read CSET briefs that were
less careful about that. The line explaining why an SK hynix prospectus quoting IDC is citable and an
IDC report is not is the single most honest sentence I have read on a site of this kind. So the
numbers I checked, I could stand behind.

What stops me sending it on is that none of that survives contact with how a report actually gets
written. The bibliography is 359 bare URLs with no titles, no publishers and no dates, so building a
reference list means opening every link by hand. There is no methods page: the four excellent
"Method:" notes are buried at the bottom of the Sources page, past 28,000 characters of URLs, and the
Exposure page's own pointer, "Method notes are on the Sources page", drops me at the top of that
wall. There is no change log and no as-of date on anything, so the only date on the site is the
footer's "2026-09-09" and I cannot tell whether a figure was refreshed last week or last year. The
chokepoint nameplate, the block a colleague will screenshot, carries "~70% of the AI chip market,
2026 estimate" and "Hyperscaler capex reached $448.2B in 2025 across five firms" with no citation at
all, which contradicts the site's own promise that "Every number on this site links to its source".
The site tells me "the source rule tightened to Tier A plus four named exceptions" and never names
the four. And printing a chapter to PDF, which is how half our team reads long documents, produces
560 superscript numbers, eighteen collapsed lines reading "Sources for this chapter (16)", and no
bibliography whatsoever. The scholarship is there. The apparatus a citing reader needs is half built.

## 2. Task log

| # | Task | Start | Clicks / steps | Result | Friction that would stop me citing |
|---|---|---|---|---|---|
| 1 | Provenance, date, sourcing rule, cite block | Home | 3: scan masthead, reach footer, open "Cite this site" | Partial | Nine nav tabs, none named About or Methods. Footer gives "2026-09-09" with no label saying whether that is publication or last update. BibTeX title ("Chokepoints: a deep dive...") differs from the prose citation ("Compute Chokepoints: a deep dive..."). `author = {Sharma, Yashvardhan and Claude}` and `note = {Accessed 2026-09-09}` hardcoded. No version, no per-chapter citation. Authorship disclosure ("Claude did the research, writing, design and code") sits at the very end of the Sources page, not where a first-time reader meets it. |
| 2 | HBM export threshold and the rule that set it | Home | 2: Controls tab, then the "source" link on the `ECCN 3A090.c` row | Success, under a minute | The row is complete and correct: "Memory bandwidth density > 2 GB per second per square millimetre of package or stack area", status "IN FORCE", link to the 5 December 2024 Federal Register notice. But no Federal Register volume and page citation (89 FR 96790), which is what goes in a footnote. "amended 2024-12-31" is unexplained. Forty link labels all read "source". The regime filter has no free-text search. |
| 3a | TSMC foundry share, traced | Home | 3: search "foundry share", open the result, click footnote 4 | Success | Body text is clean: "Chips at 7 nm and below were 77 percent of TSMC's wafer revenue in the second quarter of 2026 ... on revenue of $40.20 billion at a 67.7 percent gross margin", citing TSMC's own release. The nameplate line "TW TSMC 77% of wafer revenue from 7 nm and below, 2Q26" carries no citation. Separately, "Its foundries hold 78 percent of the world's foundry market and 92 percent of the capacity for the most advanced chips" cites a 2025 Stimson commentary tagged Tier A, and Stimson is relaying a market-research figure. The site refuses to cite market research directly and then accepts it second hand. |
| 3b | An estimate or third-party relay, honestly labelled | Memory chapter | 1 | Success, best on the site | "Source: SK hynix Form 424B4 prospectus, 10 July 2026, on IDC data" and "Source: BofA estimate cited in SK hynix 2026 market outlook" are exactly right. The Sources page explains why: "an IDC report is not citable under this rule, but a registered prospectus is a company filing ... with securities-law liability attached". No complaint. |
| 4 | Timeline and country matrix as data | Home | 4: Geopolitics tab, past twelve headings to "THE CONTROL REGIME, EVENT BY EVENT" and "WHO HOLDS EACH STAGE", two Copy buttons | Success with caveats | Both exports carry sources. Timeline columns: `date,actor,title,summary,category,source`, 43 events from 2018, no tier column and no date filter, so "since October 2022" is a manual cut. Matrix columns: `segment,metric,year,shares,note,source,aiCritical,trend`, so years are present. But `shares` is a JSON object inside one CSV cell (`"{""US"":74,""DE"":13,...}"`), which opens in Excel as one unusable column. Clipboard only: no file, no filename, no licence, no date stamp inside the export. |
| 5 | Lam and ASML China revenue by FY, to the filings | Home | 3: Exposure tab, open "Table view", read the rows | Success | Lam FY2021-26: 35.1, 31.4, 25.6, 42.2, 33.7, 33.8. ASML FY2021-25: 14.7, 13.8, 26.3, 36.1, 29.1, with FY2026 shown as "·". Every cell links to the EDGAR R-file. Basis is stated inline in the row: "Revenue by geographic region, customer ship-to location; share computed from the filed absolute figures". Two gaps. The deeper basis discussion is on the Sources page behind a link that lands at the top of it. And the CSV export drops the `note` column entirely: 30 of 103 rows carry a note in the JSON, including Nvidia FY2025's restatement note, and none of them appear in the CSV, so anyone plotting Nvidia FY2021-26 from the CSV draws the basis change as if it were real movement. |
| 6 | CoWoS capacity and Nvidia's share | Home | 2: search "CoWoS", open "ADVANCED PACKAGING, Capacity" | Success, no friction | "TSMC does not publish a CoWoS wafer number, and the omission is deliberate." "The split is public; the total is not." Epoch AI at "60.3 percent of the world's CoWoS in 2025, with a 90 percent confidence interval of 56.5 to 64.3". TSMC's own quotes are attributed to the July 2024 call and the October 2025 call. Nothing is missing except a word: the chart is titled "Who consumed the world's CoWoS capacity, 2025", which reads as a measurement when it is a model. |
| 7 | Every citation from a chapter; the tier tags | Home | 1: Sources tab | Partial | Grouping by chapter works, with counts ("02 · Chip Design, EDA and IP 16 SOURCES · A 14 · B 2 · C 0"). 359 entries, 322 unique, no over-reliance on any one document (the most-cited is CSET's supply chain brief at four). But entries are bare URLs, chapter headings carry no ids so I cannot link a colleague to one chapter's sources, and there is no reverse index from a source to the chapters using it. Tier C appears once on the entire site. Tier A covers a Lam 10-K, USGS Mineral Commodity Summaries, a CSET issue brief, `https://www.nvidia.com/en-us/data-center/gb300-nvl72/` and, on the supplier table, bare homepages such as `https://www.chromaate.com/`. As a discriminator it is not doing work. |
| 8 | What is missing | Whole site | n/a | See section 3 | Biggest three: no bibliography metadata, no methods page or written sourcing rule, no change log or as-of dates. Close behind: no downloadable data (the method note names `data/control-thresholds.json`, which returns 404), no licence, no corrections address, no repo link, unusable print output. |

## 3. The ten problems, ranked by how much fixing them raises the site's value as a reference

**1. The bibliography is 359 bare URLs. (a week, or a day if titles are harvested and reviewed)**
Every entry on the Sources page is the URL and nothing else: `Ahttps://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf`. No title, no publisher, no publication date, no accessed date. Building a reference list means opening 359 links by hand, and when a company moves a press release the citation dies with no fallback. The site already knows how to do this properly: the 46 chart captions read "Source: SemiAnalysis, EDA Market Primer, May 2026" and "Source: SK hynix Form 424B4 prospectus, 10 July 2026, on IDC data". Give every source those four fields plus an accessed date and a Wayback fallback, render it as a formatted reference with the URL as a link, and add "Copy as BibTeX" per chapter.

**2. There is no methods page, and the sourcing rule is never written down. (a day, mostly moving text)**
The four "Method:" notes are the strongest writing on the site and they sit at the bottom of the Sources page, after 28,000 characters of URLs. The rule itself is only ever referred to: "On 9 September 2026 the source rule tightened to Tier A plus four named exceptions." The four are never named. Add a Methods tab carrying the sourcing rule in full with its exceptions named, the tier definitions, the chokepoint score rubric, the substitution-time basis, and the four existing method notes, each with a section anchor. Then point the Exposure caption at `#/methods--exposure-series` instead of at the top of `#/sources`.

**3. The chokepoint nameplate carries uncited numbers. (a day)**
The site promises "Every number on this site links to its source." The nameplate contains zero citations across all eighteen chapters, while the body text contains 560. The uncited figures include "~70% of the AI chip market, 2026 estimate", "Hyperscaler capex reached $448.2B in 2025 across five firms", "TSMC 77% of wafer revenue from 7 nm and below, 2Q26" and "78% of the global foundry market and 92% of capacity for the most advanced chips". This is the block that gets screenshotted into slide decks. Either cite each field or mark the card "figures sourced in the chapter below" and link each line to the paragraph that sources it. Also fix "Eighteen stages, and the handful of firms that own each one" in the chapter 1 dek against the hero's "Fifteen stages. Seven chokepoints."

**4. No change log, no as-of dates, no version. (a day)**
The only date on the site is the footer's "2026-09-09", and it is unlabelled. I cannot tell whether the ASML FY2025 row was checked this month or in March, and if I cite the site in a report published in June I have no way to say which version I read. Add `lastUpdated` per chapter and per dataset, shown in the chapter header and in the export header row, a version string in the citation block, and a dated change log listing what moved. The change log has content waiting for it already: the 9 September source-rule tightening, the five emptied matrix rows, the two recovered from the SK hynix prospectus, and the OSAT row rebuilt from headquarters to site capacity.

**5. Printing a chapter to PDF loses the sources and the charts. (a day)**
The print block is six declarations. Three consequences. All eighteen `details.chapter-sources` are closed, so a printed chapter shows 560 superscript numbers and eighteen lines reading "Sources for this chapter (16)" with no bibliography behind them. There is no `print-color-adjust: exact`, so every `span.bar` prints as an empty box, including the chokepoint score chart whose caption reads "Bar height is the chokepoint score, 1 to 5". There is no `@page` rule, so the PDF has no margins, no page numbers and no running header carrying the site name, URL and date, which means a printed page cannot be traced back at all. Fix: force `details` open in print, emit footnote URLs as an endnote list per chapter, set `print-color-adjust: exact`, add `thead { display: table-header-group }` and `tr { break-inside: avoid }`, and add an `@page` with a running header.

**6. Nothing can be downloaded, and nothing says how it may be reused. (a day)**
Every export is "Copy as CSV" or "Copy as JSON" to the clipboard. There is no file, no filename, no "download every dataset". The method note tells me the data lives in `data/control-thresholds.json` and `data/suppliers.json`, and both paths return 404. There is no repository link anywhere on the site, no licence, no copyright line, and no contact address, although the footer says "Corrections and additions are welcome". Serve the JSON at stable paths, add Download buttons beside the Copy buttons and one "Download all datasets" archive, state a licence, and give a correspondence address.

**7. The controls are not connected to the chapters, though the data already connects them. (a day)**
Every one of the 40 threshold records carries a `chapter` field, spread across eleven chapters: five on `memory-and-hbm`, four on `lithography`, four on `deposition-and-etch`, three on `data-centers-and-power`, seventeen on `geopolitics`. The interface never uses it. There is no chapter column, no filter by chapter, and no "controls that bind this stage" block inside a chapter. This is the map from controls to affected chapters a governance reader comes for, and it is one afternoon of wiring on data that already exists. Best value per hour on the list.

**8. The CSV writer drops fields and inlines JSON. (an hour)**
Two mechanical faults with outsized consequences. The header is built from the first record's keys, so in the exposure export the `note` field is lost for all 30 rows that have one, including Nvidia FY2025's "As originally filed on the billing-location basis, FY2025 China (incl. Hong Kong) revenue was $17,108m, 13.1% of revenue." A reader plotting that CSV draws an accounting change as a collapse in exposure. And the matrix's `shares` field is written as an escaped JSON object inside one cell. Build the header from the union of keys, and flatten `shares` into one column per country plus `Other`.

**9. The A/B/C tiers do not discriminate. (a day)**
Counts across the site are A 592, B 44, C 1. Tier A is defined as "primary or institutional" and holds, without distinction, a Lam Research 10-K, a USGS Mineral Commodity Summary, a CSET issue brief, an Nvidia product page and a company's bare homepage. Those are not the same evidentiary class, and the difference is exactly what I check before citing. Split A into filings and regulations, institutional research, and company self-description, and add a relay flag for figures a source is repeating from someone else, so the 78 percent Taiwan foundry share carries the same honesty the SK hynix and BofA numbers already do.

**10. Only chapter sections have permalinks. (an hour)**
Chapter headings do this well: `<a class="permalink" href="#foundries-and-fabs--who-makes-it">#</a>`. Nothing else does. The glossary's 74 terms have no ids, so I cannot send a colleague the definition of CoWoS or ECCN; I can only say "open the Glossary tab and look under C". The same is true of the 40 control rows, the 20 exposure firms, the 220 supplier entries and the 18 chapter blocks on the Sources page. Add ids and `#` permalinks to all of them, and a "cite this chapter" line beside each chapter title.

Also worth doing, below the top ten: the Summary page carries zero footnote markers, which makes the most shareable page on the site the least traceable; site search matches words but not figures, so "78%" returns "Nothing matches"; the threshold table has no free-text filter; the exposure series covers no Chinese firms and the "Firms not covered, and why" note does not say why, although Naura and AMEC both publish revenue splits; SiCarrier is absent from the 220 suppliers; and there are no Open Graph or author meta tags, so a link pasted into Slack shows a bare URL.

## 4. Five things that worked and must not be changed

**1. Footnote numbers link to the document, not to a list.** `<sup class="cite"><a href="https://www.intc.com/...">10</a></sup>` with the host in the tooltip. One click from a claim to the primary text, no intermediate page. Most think-tank sites make you go to endnotes and then out. Keep this exactly as it is.

**2. The exposure table cell is a citation.** "35.1%" links to the EDGAR filing and the tooltip carries "5,137.9 of 14,626.2 USD million". The basis rides in the row header: "Deposition & Etch · United States · Revenue by geographic region, customer ship-to location; share computed from the filed absolute figures". Numerator, denominator, basis and source in one row. This is the best data object on the site.

**3. Relays and estimates are labelled where the number appears.** "Source: SK hynix Form 424B4 prospectus, 10 July 2026, on IDC data". "Source: BofA estimate cited in SK hynix 2026 market outlook". The Ascend 910C row reading "SMIC N+2 7 nm class as intended; SemiAnalysis judges most 910B and 910C dies were actually made on TSMC N7". And "chinaShare is computed here from the filed absolute figures, never copied from a filing's own percentage." Do not smooth any of this into cleaner-sounding sentences.

**4. Empty cells stay empty, and the weak numbers are named.** "Advanced packaging, IC substrates and server assembly still carry shares: null and render as dots." Then a section headed "Where the numbers are weakest" that says photomasks "completely misses the real chokepoint, which is Hoya's position in EUV mask blanks", that specialty gases are "modelled from the known supplier set", and that mature logic's 38 "is a judgment, not a measurement". A site that tells me which of its own numbers not to trust is a site I can use. The CoWoS section is the same virtue applied to a live question: "The split is public; the total is not."

**5. The search palette.** One index across chapters, glossary, suppliers, chips, timeline events, control thresholds and exposure rows, with results labelled by type and section ("CONTROL | ECCN 3A090.c · Memory bandwidth density", "EXPOSURE | Lam Research FY2024 | China 42.2% of revenue"). Typing "3A090" returns fourteen results spanning a chapter, a glossary entry, three timeline events and eight control rows. On a document of this length it is the difference between a reference and an essay.
