# Reader re-test: research analyst, compute governance

Second read, 9 September 2026, against the local build at `http://localhost:8765/`, desktop at 1440x900,
plus a print check made by extracting the shipped `@media print` rules and applying them to the live page.
Persona unchanged: analyst at a think tank writing a report on compute governance. Wants citable numbers,
reusable datasets, definitions to point colleagues at, and a way to verify a figure in under a minute.
First report: `qa/reader-test-researcher.md`.

## 1. Verdict

The apparatus I said was half built is now mostly built, and the site has crossed the line from an essay
with good footnotes to a reference I would work from. The Methods page is the difference. It names the four
Tier B exceptions the site kept referring to and never listing (SemiAnalysis, Reuters, the Financial Times,
Nikkei Asia), prints the 1-to-5 chokepoint rubric with the test for each band and the chapters that land
there, says who owns the three judged numbers, and states plainly that the score is not the substitution
clock in disguise. It carries a section headed "What this site does not cover" that lists five real
absences, including the software stack and China as a subject in its own right. The Sources page now gives
every one of 336 citations a title, a publisher and, for 231 of them, a date, grouped by chapter with tier
counts. Inline footnote superscripts carry the document title in the tooltip, so hovering footnote 4 in
Foundries reads "TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD, Form 6-K ... for the period ended 2026-06-30".
The CSV faults are fixed: the exposure export now carries `basis`, `source` and `note` across all 103 rows,
so Nvidia's FY2025 restatement note travels with the number. The thresholds export carries `source`,
`sourceTier`, `chapter`, `effectiveDate` and `amendedBy` across 40 rows. Every data file is served and
returns 200. Every threshold row links to its chapter, and the link works. Chapter anchors work as
shareable URLs. The print stylesheet forces the collapsed source lists open, sets `print-color-adjust:
exact`, repeats table headers and neutralises dark mode, so a printed chapter now ends with a numbered list
of sixteen full references instead of eighteen empty accordions. Five of my ten problems are closed and two
more are half closed.

I would cite it, and I would send it to a colleague with two sentences of warning rather than none. What
holds me back is no longer the scholarship; it is three things a reference cannot be without. There is no
licence. The Methods page says "Licence: to be confirmed by the author. Nothing on this page grants a
licence to the text, the datasets or the code until that line is replaced", which means the reusable
datasets are, as published, not reusable, and the same page ships a literal square-bracket placeholder
where the corrections address goes. There is no as-of date that can ever go stale: the only date in the
footer is an accessed date computed from the reader's clock at page load, so in March 2027 the footer will
read March 2027 over September 2026 content, and the changelog's 21 entries all carry the same date with no
version string behind them. And the bibliography, though it now has fields, has not been checked. I sampled
five entries against the linked documents. The Federal Register entry and the Epoch AI entry match exactly.
The CSET issue brief is filed under the title embedded in the PDF's XMP metadata, "The Semiconductor Supply
Chain - Issue Brief", rather than CSET's own title, with a date taken from the file's creation timestamp
and no authors; put that in a reference list and the citation is wrong. Four different USGS commodity
chapters share one indistinguishable title. Elsewhere in `bibliography.json`, gf.com is dated 2026-09-09
and the USGS China minerals chapter is dated 2026-02-17, which is the file's HTTP Last-Modified header, not
a publication date. The data even carries an `unverified` flag on 27 entries, and the page does not show
it. Fix the licence, the date semantics and the bibliography's accuracy, and this is the one reference I
would point the team at. Until then I would say: use it to find the primary documents, and cite those.

## 2. Task log

| # | Task | Steps | Result | Friction that would stop me citing |
|---|---|---|---|---|
| 1 | Provenance, date, sourcing rule, cite block, in one minute | Home, footer, open "Cite this site", then Sources to find the Methods link | **Partial, about 90 seconds** | Author and cite block are right there, and the BibTeX title now matches the prose citation. But Methods is missing from the desktop masthead: `nav.tabs` carries seven items and no Methods, while the phone sheet carries eight and does. I found Methods only through a sentence in the Sources dek. The footer's only date is `accessed`, computed from `new Date()` at load, so it can never signal staleness; Methods claims "the same date prints in the site footer", and what prints is today's date. No version string. Corrections address is an unfilled placeholder; licence is "to be confirmed". |
| 2 | HBM export threshold, to the Federal Register text | Export Controls, Licence thresholds tab, read the `ECCN 3A090.c` row, click source | **Success, under a minute** | Row is complete: "Memory bandwidth density > 2 GB per second per square millimetre of package or stack area", the calculation restated, worldwide licence with FDPR reach, status IN FORCE, and a chapter chip that opens Memory and HBM at the right scroll position. The link lands on the 5 December 2024 notice. Still missing the citation a footnote needs: the Federal Register API gives `89 FR 96790` for that document and the site prints neither volume nor page. All 40 link labels still read "source". "amended 2024-12-31" is still unexplained. |
| 3a | TSMC's share, traced | Search, chapter, footnote 4 | **Success** | Body text is exact and the tooltip now names the filing type and period. The problem is unchanged one level up: "Its foundries hold 78 percent of the world's contract chipmaking and 92 percent of capacity for the most advanced chips" cites a 2025 Stimson commentary that is itself relaying market research, and the same two numbers appear again on the geopolitics chokepoint card with no citation and no relay label. |
| 3b | A relay from a filing, judged | Metrology chapter; Memory chapter | **Success, still the best thing on the site** | "At its March 2026 investor day it put its own 2024 share at 56.5%, six and a half times its nearest competitor; CSET, counting the same year independently, gets 57.2%." Attribution and an independent check in one sentence. The Memory chart still reads "SK hynix Form 424B4 prospectus, 10 July 2026, on IDC data". One gap: the word Gartner appears only on the Methods page. A reader of the metrology chapter never learns KLA footnoted that slide to Gartner, which is the opposite of the SK hynix treatment, where the relay is named at the point of use. |
| 4 | Timeline and thresholds as data, with sources and years | Export Controls, two Copy buttons | **Success** | Timeline: 43 rows, `date,actor,title,summary,category,source`. Thresholds: 40 rows, 19 columns including `source`, `sourceTier`, `chapter`, `effectiveDate`, `amendedBy`, `note`. Header is now built from the union of keys, so nothing is dropped. Two remaining faults: `amendedBy` is a JSON array escaped into one cell, and neither export carries a provenance line (no site URL, no as-of date, no licence). There is still no Download button anywhere on the site, only nine Copy buttons, and no bulk archive. |
| 5 | Lam and ASML China share by year, to the filings, basis explained | Export Controls, China revenue share, open the table | **Success** | Lam FY2021-26: 35.1, 31.4, 25.6, 42.2, 33.7, 33.8. ASML FY2021-25: 14.7, 13.8, 26.3, 36.1, 29.1, FY2026 a dot. Every cell links to the EDGAR R-file and every tooltip carries the arithmetic, e.g. "5,137.9 of 14,626.2 USD million". The CSV now carries `basis` and `note`. One regression in the visible layer: the row header used to read "Revenue by geographic region, customer ship-to location; share computed from the filed absolute figures" and now reads "counted where it ships", with the precise basis demoted to a `title` attribute. Tooltips do not print and do not survive a screenshot. The page's own pointer still goes to `#/methods` rather than to `#methods-exposure-notes--what-china-revenue-means`, which exists. |
| 6 | CoWoS capacity and Nvidia's share, and which numbers are whose | Search, Advanced Packaging | **Success, no friction** | "TSMC does not publish a CoWoS wafer number, and will not." "The split is public; the total is not." Epoch AI at 60.3 percent for 2025 with a 90 percent interval of 56.5 to 64.3, the other three named, TSMC's own words attributed to the July 2024 and October 2025 calls. The one word I asked for last time is still missing: the chart is titled "Who consumed the world's CoWoS capacity, 2025", which reads as a measurement of a quantity the chapter has just said nobody publishes, and the chart shows point estimates without the interval. |
| 7 | Cite a source without opening it; five entries checked | Sources page, then five documents fetched | **Partial** | 336 entries, all with tier, title and publisher; 105 have no date. No authors on anything, so a CSET or RAND brief cannot be cited from the page. `accessed` exists for all 645 records in `bibliography.json` and is rendered for none. The `unverified` flag on 27 records is not rendered either, so "Cowos (TSMC website)" looks like a checked title. Chapter blocks still have no ids, so I cannot link a colleague to one chapter's sources, and there is no export or BibTeX button on the page. Sample of five: Federal Register 2024-28270 **exact** (title and 2024-12-05 both match; FR citation absent); Epoch AI **exact**; CSET issue brief **wrong for a reference list** (PDF metadata title, file-creation date, no authors; CSET's own page gives "The Semiconductor Supply Chain", 22 January 2021); USGS silicon **incomplete** (titled "Mineral Commodity Summaries 2026" like three sibling chapters, commodity lost though it is in the URL); SEMI wafer shipments **mis-attributed** (publisher rendered "PR Newswire", a wire service the site's own rule disallows, when the issuing body is SEMI, which it allows). |
| 8 | What is still missing | Whole site | See section 3 | Biggest three: no licence and a placeholder contact; a bibliography with fields but no verification pass; no as-of date that can go stale and no version. Close behind: no downloads and no data dictionary; the chokepoint card still carries no citations; 23 links point at `#/geopolitics`, a route that does not exist; the exposure series still covers no Chinese firm; SiCarrier is still absent from the 220 suppliers. |

## 3. The ten problems, ranked by how much fixing them raises the site's value as a reference

**1. The bibliography has fields now, but the fields have not been checked. (a day of code, two days of review)**
Sampling five entries against their documents found two exact, one incomplete and two wrong enough to
produce a bad citation. The failures share one cause: metadata was harvested and trusted. The CSET brief
carries the PDF's XMP `dc:title` and its creation timestamp; four USGS chapters collapse into one title
because the harvester read the volume, not the chapter; `gf.com` is dated 2026-09-09, the build date, and
the USGS China chapter is dated 2026-02-17, which is its Last-Modified header. 284 of 645 records carry no
date and 105 of the 336 rendered entries show none. No record carries an author, which is what a
think-tank reference list needs most. Revision: render the `accessed` date that is already in the data and
the `unverified` flag that is already in the data, add an `author` field and fill it for the 60 or so
institutional reports where it matters, take the commodity or chapter name from the URL where the title is
a volume title, distinguish a publication date from a file timestamp and leave the field empty rather than
print a crawl date, and put "Copy as BibTeX" and "Copy as CSV" on the Sources page and on each chapter
block. Then read the 27 unverified entries by hand.

**2. There is no licence, and the corrections address is a placeholder. (an hour of work, one decision)**
The Methods page ships this: "Licence: to be confirmed by the author. Nothing on this page grants a licence
to the text, the datasets or the code until that line is replaced." And this: "[Placeholder for the author:
put the address for corrections here, an email or a form. No address is published yet.]" A think tank
cannot redistribute a figure or a dataset from a site with no licence, and our editors ask. The square
brackets also tell a first-time reader the page is unfinished, which colours everything above them.
Revision: pick a licence (CC BY 4.0 for text and data, MIT for the code is the ordinary choice), state it
in Methods and in the footer, add a line inside every export, and publish an address or a repository issues
link. Add the repository link while you are there; the site still does not carry one.

**3. Nothing on the front door is cited, and its headline number is a site estimate presented as fact. (a day)**
The home page is now the country map, and it carries zero citations and two external links, both in the
credits. The Taiwan panel reads "Taiwan holds 72% of leading-edge logic manufacturing (≤5 nm), more than
any other country", and the matrix row behind it says: "CHOKEPOINTS estimate, not a published measurement.
... Anchored on SIA/BCG's 2022 baseline for sub-10 nm logic ... then rolled forward for three changes." The
metric field says "Capacity share, site estimate". None of that reaches the panel, which shows the year and
nothing else. This is the number that gets screenshotted. Revision: put the metric label under each figure,
mark the estimated rows, and link each stat to the matrix row rather than to the chapter, so one click
reaches the note. The site's own Methods page says our estimates are labelled; here the label exists in the
data and is dropped in the render.

**4. The chokepoint card still carries no citations. (a day)**
Seventeen cards, zero citations, against 600 in the body text. The card holds "77% of wafer revenue from
7 nm and below, 2Q26", "$5.8bn revenue and a $2.089bn operating loss, 2Q26", "BCG puts the ten-year cost of
owning a fab completed in 2026 at $35-43 billion", and the relayed "78% of the world's contract chipmaking
and 92% of capacity for the most advanced chips". Every one of those is sourced somewhere in the chapter
below it. Revision: either carry the footnote number into each card field, or add one line to the card
footer reading "Figures sourced in the chapter below" with the fields anchored to the paragraphs that
source them. Unchanged from the first visit and still the largest gap between what the site promises and
what it does.

**5. Nothing can be downloaded and nothing defines the columns. (half a day)**
The 404s are fixed: all eleven files under `data/` return 200, which is the single most useful change for
reuse. But the site has nine Copy buttons and no Download button, no bulk archive, and the Methods dataset
table lists `data/exposure.json` and the rest as plain text rather than links, so a reader retypes the
path. There is no data dictionary anywhere. The exposure CSV has 13 columns and the thresholds CSV 19,
including `operator`, `alternative`, `alsoSee`, `sourceTier` and `fyEnd`, none of them defined. Revision:
make the file names in the Methods table links, add a Download button beside each Copy button and one
"Download every dataset" zip, and add a fields table to each of the four dataset notes giving column name,
type, units and an example. Half a day, and it turns nine datasets into something a colleague can pick up
without asking me what `fyEnd` means.

**6. No as-of date that can go stale, no version, and a changelog with 21 entries on one date. (half a day)**
The footer's date is `new Date().toISOString().slice(0,10)`, so it always reads today. Methods says the
build date prints in the footer; it does not. The changelog is honest about why every entry says
2026-09-09 ("The site was written in one long day"), but that honesty leaves me with no way to say which
version I read, and a reader six months from now with no way to tell that nothing has moved since. Methods
also states "No chapter carries a date of its own yet". Revision: stamp the build date into the page at
compile time, print it in the footer as "Last updated 2026-09-09" next to the accessed date, add a version
string (`v1.0`, September 2026) to the citation block and the BibTeX `note`, put it in every export header,
and add a `lastUpdated` per chapter and per dataset. Then the changelog becomes a version history rather
than a build log.

**7. Twenty-three links point at a route that does not exist. (ten minutes)**
`#/geopolitics` is not a route. Every one of the 23 links using it, including one on every country panel
on the home page ("three chokepoint towns: Hsinchu, Tainan, Kaohsiung"), silently opens The Chain at
scroll position 0, at the top of chapter 1, roughly 125,000 pixels above the geopolitics essay. The
correct target, `#geopolitics`, works and lands cleanly. This is the only broken internal link on the site:
I resolved all 236 distinct internal hrefs and every other one resolves. One character each.

**8. Methods is missing from the desktop masthead. (ten minutes)**
`nav.sheet-pages`, the phone sheet, lists eight pages and includes Methods. `nav.tabs`, the visible desktop
masthead, lists seven and does not. The best new page on the site is reachable on desktop only through a
sentence in the Sources dek, a sentence in the Chain how-to block, and the exposure note. A reader doing the
one-minute provenance check scans the masthead, sees no About and no Methods, and concludes there is none.
Add the eighth tab.

**9. The print footer names a domain that is not the site, and carries no date. (twenty minutes)**
`print.css` sets `body::after { content: "Compute Chokepoints · computechokepoints.com" }`. That domain
appears nowhere else in the project; the site's own citation block gives
`https://yashvardhansharmaa.github.io/chokepoints/`. So the one line that lets a printed page be traced back
points somewhere that does not resolve. The dated variant, `body[data-printed]::after`, never fires, because
nothing sets `data-printed`: there is no `beforeprint` handler in the build. So a printed chapter carries a
wrong URL and no date. Revision: correct the domain, add a two-line `beforeprint` listener that sets
`data-printed` to the build date, and repeat the line as a running footer rather than once at the end of the
document. Everything else about the print work is right and should be left alone.

**10. Permalinks stop at chapter sections. (three hours)**
Chapter headings and the Methods sections have `#` permalinks, and chapter anchors survive a reload, so
`http://localhost:8765/#memory-and-hbm` is a working per-chapter URL. Nothing else has an id. The 74
glossary terms have none, so "definitions to point colleagues to" still means "open the Glossary tab and
look under C". Neither do the 17 chapter blocks on the Sources page, the 40 threshold rows, the 20 exposure
firms or the 220 supplier entries. Revision: slug ids and `#` permalinks on all five, plus a "Cite this
chapter" line beside each chapter title carrying the chapter's own anchor.

Below the top ten, in rough order. The exposure series still covers no Chinese firm and no Taiwanese one:
20 firms across US, JP, NL, IL and KR, while `suppliers.json` carries 30 Chinese firms including Naura,
AMEC, SMIC, Hua Hong, CXMT and YMTC, several of which publish revenue splits. The "Firms not covered, and
why" note is excellent and firm-by-firm, and its silence on China is now conspicuous rather than invisible.
SiCarrier is still absent from the 220 suppliers. Federal Register rows carry no volume and page citation.
Forty threshold links still read "source". The Intro page carries zero footnote markers across 1,713 words,
which is defensible for an on-ramp but should say so and link each paragraph to its chapter. "Stage 9 of
15" inside a site that says "17 chapters" still needs one sentence of reconciliation. And the exposure
table's precise basis now lives only in a `title` attribute, so it is absent from print, from screenshots
and from anyone who does not hover.

## 4. What improved, and must not regress

**1. The Methods page, and above all its "Where the numbers come from" section.** It names the four Tier B
exceptions, lists what is disallowed by name (TrendForce, Gartner, IDC, Yole, TechInsights, Dell'Oro,
Omdia, Bloomberg, the WSJ), and then describes what happens when no allowed source exists: replace, cut, or
delete the figure and its chart. It closes with a worked example, five matrix rows emptied on 9 September
and two recovered from a filing the same day. I have not seen another site of this kind write that down.
Do not shorten it, and do not move it back onto the Sources page.

**2. The "What this site does not cover" section.** Five named absences, including "China's chain as a
subject in its own right" and "The software stack. CUDA, compilers and kernels are the most-cited moat in
AI compute, and no chapter mentions them." A reference that tells me its own boundaries saves me the hour I
would otherwise spend looking for a chapter that is not there.

**3. The Sources page as a bibliography.** Tier tag, title, publisher, date, grouped by chapter with counts
and tier splits, 336 entries, 314 A and 22 B and zero disallowed. The fix from bare URLs to formatted
references is the single largest improvement since the first visit. Section 3.1 asks for accuracy on top of
it; the structure itself is right.

**4. The export fixes.** The exposure CSV carries `basis`, `source` and `note` for all 103 rows, so the
Nvidia FY2025 restatement travels with the number and nobody plots an accounting change as a collapse. The
thresholds CSV carries `sourceTier` and `chapter`. Headers are built from the union of keys. All eleven data
files are served and return 200. These were mechanical faults with outsized consequences and they are gone.

**5. The chapter-to-control wiring, and the print stylesheet.** Every threshold row now carries a chapter
chip that opens the chapter at the right scroll position, which was my best-value-per-hour item last time
and took the afternoon I estimated. And printing a chapter now produces a numbered reference list with
titles, publishers and dates instead of eighteen collapsed accordions: `details` forced open, dark tokens
neutralised for paper, `print-color-adjust: exact`, `thead` repeated, `@page` margins. Fix the domain string
and the missing date and this is finished work.

Two things from the first list I would flag as having slipped. The exposure row header lost its precise
basis line to a tooltip; put the full sentence back in the visible row, or in a caption above the table.
And the search palette, which I praised, is unchanged and still good: "78%" now returns a result instead of
"Nothing matches", and a miss on "SiCarrier" offers the nearest glossary entries instead of a dead end.
