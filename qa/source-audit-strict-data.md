# Source audit — the four data files under the strict rule

Run: 9 September 2026. Scope: `data/chokepoint-matrix.json`, `data/export-controls-timeline.json`,
`data/control-thresholds.json`, `data/exposure.json` and their companion notes files, against the
strict rule in `brief/SOURCE_POLICY.md`: Tier A only, plus SemiAnalysis, Reuters, the Financial
Times and Nikkei Asia.

All four files validate as JSON. `node build/build.js` succeeds with no warnings: source tiers
A 315, B 20, C 0, D 0, unclassified 0; timeline 43, matrix 20, controls 40, exposure 103.

## Method

Every URL in each file was extracted with a script that walks the parsed JSON, resolves each
host and tests it against tiers A and B of `data/source-tiers.json`, matching on exact host or
suffix. The same script was run over the three notes files. It was re-run after each fix.

| File | URLs | disallowed before | disallowed after |
|---|---|---|---|
| chokepoint-matrix.json | 25 → 20 | 11 | 0 |
| export-controls-timeline.json | 45 → 43 | 7 | 0 |
| control-thresholds.json | 53 → 54 | 8 | 0 |
| exposure.json | 103 | 5 (see below) | 0 in substance |
| chokepoint-matrix-notes.md | 9 → 5 | 4 | 0 |
| control-thresholds-notes.md | 0 | 0 | 0 |
| exposure-notes.md | 0 | 0 | 0 |

Discovery used Google News RSS and the Federal Register API. WebSearch was tried once and
returned an error for reuters.com and ft.com, so it was not used again. Reuters returns HTTP 401
to automated fetching from this environment and Google News RSS article links are opaque
redirects that cannot be resolved to a publisher URL, so no Reuters or FT citation could be
verified to a specific page. Nothing was cited to Reuters or the FT on the strength of a headline
alone. Nikkei Asia and SemiAnalysis are fetchable and were read directly where used.

---

## 1. `data/chokepoint-matrix.json`

### 1.1 The five ETO rows — explorer URL removed, data source unchanged

EUV lithography, DUV lithography, deposition, etch and metrology each carried a second URL in the
note, `https://chipexplorer.eto.tech/?selectedNode=N…`, pointing at the client-rendered app. The
host is not mapped in `source-tiers.json`. The rows already cite the underlying machine-readable
file, `raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv`, which
is Tier A, so the app URL was redundant. Removed from all five notes and from the notes file; the
sentence now reads "cited here as the public machine-readable file rather than the client-rendered
app". No number changed.

ETO is CSET's own project and Tier A names "CSET and its ETO data", so `eto.tech` is Tier A in
substance. It is simply absent from the domain map. Adding it would be reasonable; it was not
needed here, and `source-tiers.json` belongs to another worker (see Residual items).

### 1.2 Rows whose shares were withdrawn

Five rows rested on TrendForce or Counterpoint alone and could not be rebuilt. Each now carries
`"shares": null`, `"metric": "No published country split"`, `"year": null`, and a note that says
what allowed sources do support. `src/app.js` reads `s.shares || {}`, so these render as dots
across the row with the note on hover; the build is unaffected.

**DRAM manufacturing** — was KR 63, US 24, CN 10, TW 3 (Counterpoint Q2 2026).
Old source: `counterpointresearch.com/en/insights/global-dram-and-hbm-market-share`.
No Tier A or B source publishes a company or country split of DRAM revenue, and it cannot be
rebuilt from filings: Micron discloses DRAM revenue, but Samsung reports memory as one line inside
Device Solutions, SK hynix does not separate DRAM from NAND in its filed statements, and CXMT
published nothing before its 2026 Shanghai listing. New source:
`newsletter.semianalysis.com/p/chinas-cxmt-is-set-to-challenge-dram` (Tier B, 23 June 2026, read
directly), which models CXMT at 9 percent of DRAM bit shipments in 2025 rising to 12 percent by
2027 — a bit share, not a revenue share, and the note says so. The note also names Nvidia's FY2026
annual report for the supplier structure (SK hynix, Micron, Samsung).

**HBM** — was KR 83, US 17 (Counterpoint Q2 2026, normalised from 101).
Same problem, same answer. New source: Nvidia's FY2026 Form 10-K,
`sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm`, which names SK hynix,
Micron and Samsung as its memory suppliers. That is the whole of HBM, so the structural claim
survives without the percentages. Note also records that HBM is itself controlled under ECCN
3A090.c.

**Advanced packaging (2.5D/3D)** — was TW 82, US 7, KR 6, CN 3, JP 1, Other 1.
Old source: a TrendForce CoWoS capacity story. The row was already labelled a CHOKEPOINTS
estimate; its only anchor was that story. Nothing allowed publishes 2.5D or 3D capacity by
country: not TSMC, not SEMI, not SIA, and not CSET, whose explorer covers advanced-packaging
tools rather than capacity. New source: the same Nvidia 10-K, which states that Nvidia uses CoWoS
and names TSMC and Samsung as its foundries. Note keeps the qualitative geography.

**IC substrates** — was TW 30, JP 29, KR 22, CN 11, AT 6, Other 2.
Old source: a TrendForce press-centre item. CSET's supply-chain work lists substrate suppliers by
country but publishes no shares for that node (ETO node N96 carries names with blank
`share_provided`), and the firms report substrates inside broader segments. New source: CSET,
`cset.georgetown.edu/publication/the-semiconductor-supply-chain/`, for the supplier set.

**Server assembly** — was TW 70, US 18, CN 10, Other 2.
Old source: a TrendForce press-centre item. The ODMs do not break out AI systems and no
government or institutional source measures the stage. New source: the Nvidia 10-K, which names
Hon Hai, Wistron and Fabrinet among its contract manufacturers and states that its supply chain is
concentrated in Asia and expanding into the United States and Latin America.

### 1.3 Row rebuilt rather than emptied

**OSAT (assembly & test) → Assembly, test and packaging (ATP)**
Was TW 54, CN 28.6, US 15.2, KR 2.2 — a share of top-ten OSAT revenue on TrendForce's count.
Now CN 30, TW 28, Other 20, KR 9, JP 6, EU-other 3, US 3, summing to 99 (rounding in the source).
Rebuilt from the stage-level rows of CSET's ETO explorer data (`provision.csv`, node S3), which
gives ATP site capacity by country on a $95bn market in 2022 and takes it from SIA. Metric changed
to "Capacity share, site location" and year to 2022, and the segment was renamed, because this is
a genuinely different measure: by location rather than headquarters, and including captive
assembly inside IDMs and foundries. That is why the US column falls from 15 to 3 — Amkor's plants
are in Korea, the Philippines, Vietnam and China. The 20-point "various countries" bucket is
unattributed in the source; the note says SIA and BCG put Malaysia, Singapore and Vietnam at about
a fifth of global assembly capacity, which is consistent with reading it as Southeast Asia.

### 1.4 Prose attributions removed

**AI accelerator design** kept its shares and its CSIS source, but the note attributed the Chinese
column to a TrendForce forecast ("domestic parts to reach about half of China's own AI chip market
in 2026") and the trend field to another ("hyperscaler ASICs about 28 percent of AI server
shipments in 2026"). Both replaced: the note now rests the Chinese column on the CSIS analysis
already cited and flags it as the softest number in the row; the trend says no allowed source
publishes the merchant-versus-ASIC split.

TechInsights is still named in the five ETO notes. That is CSET describing the data it analysed
and published, not a citation of TechInsights, and it follows the precedent set in
`qa/source-audit-data.md` for Tokyo Electron's deck citing Gartner.

### 1.5 Row sums after the pass

Fifteen rows carry shares. Fourteen sum to exactly 100, etch sums to 99.9, the rebuilt ATP row to
99. Five rows are null.

---

## 2. `data/export-controls-timeline.json`

Seven entries cited Al Jazeera, SCMP, TrendForce or PBS. Five were re-anchored on primary sources
and two were removed. The array was re-sorted by date after two entries were re-dated; it now
holds 43 entries.

**2025-08-11, the 15 percent revenue share.** Was Al Jazeera. Now Nvidia's FY2026 Form 10-K,
which is the only filed statement of the arrangement: "USG officials expressed an expectation that
the USG will receive 15% or more of the revenue generated from licensed sales of our products, but
the USG did not publish a regulation codifying such requirement." The 10-K also gives the size of
what the licences produced — about $60 million of H20 revenue. Removed: the "astonishing" quote
from a former Commerce official and the claim that trade lawyers questioned the arrangement's
legality, neither of which has an allowed source. Title changed to match what is now claimed.
AMD's parallel arrangement is mentioned as reported but explicitly not asserted; a full-text search
of AMD's filings found no comparable statement.

**2025-12-08, H200 clearance.** Was Al Jazeera. Now the BIS press release of 13 January 2026,
`bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china`,
which names President Trump's 8 December 2025 announcement and sets out the licence conditions
(no reduction of capacity available to US customers, purchaser security procedures, third-party
testing in the United States). **Correction of substance:** the entry described a "25 percent cut"
of sales paid to the US government. Nvidia's filings describe a 25 percent *tariff on importation
into the United States*, because the licences require each H200 to pass a US inspection before
shipment. The summary and the title were corrected. The Federal Register rule that implements it
(2026-00789, 91 FR 1684) is already the source of the separate 15 January 2026 entry.

**2026-01-15, US-Taiwan agreement.** Was Al Jazeera. Now Federal Register 2026-10571 (91 FR 31818),
the Commerce and USTR notice implementing the agreement. Rewritten to what the US implementing
documents actually say: an AIT-TECRO memorandum of understanding signed 15 January 2026 in which
the United States committed to modify certain Section 232 tariffs, implemented on 28 May 2026 for
automobile parts, timber, lumber and wood derivatives, with derivative steel, aluminium and copper
tariffs removed from Taiwanese aircraft components; a broader Agreement on Reciprocal Trade signed
12 February 2026 and not yet in force. **Removed for want of an allowed source:** the $250bn
investment figure, the further $250bn of credit guarantees, the cut in the reciprocal tariff from
20 to 15 percent, the 2.5x and 1.5x duty-free import allowances, and the Taiwanese minister's
85-15 projection for 2030. The entry says these do not appear in the published US documents. Note
also that the FR text dates the ART to 12 February, not 13 February as the entry had it.

**Huawei Ascend, re-dated 2026-03-20 → 2025-09-18.** Was TrendForce. Now Huawei's own keynote
transcript, `huawei.com/en/news/2025/9/hc-xu-keynote-speech`, Eric Xu at Huawei Connect 2025,
Shanghai, 18 September 2025. The entry was about the Atlas 350 launch at a March 2026 partner
conference, which no allowed source covers; it was re-dated and rewritten around the announcement
that is on the record. **Removed for want of an allowed source:** the 112 GB and 1.4 TB/s figures
for the 950PR, the 600 W figure, the 1.56 petaflops of FP4 and 2.8x-H20 comparison, the SMIC N+3
node attribution, and the 750,000-unit target. **Kept, from Huawei's own text:** the 950/960/970
roadmap, the HiBL 1.0 and HiZQ 2.0 proprietary HBM, the PR/DT split by inference stage, Q1 2026
availability, and the 950DT's 144 GB, 4 TB/s and 2 TB/s interconnect.

**2026-07-09, Beijing rations H200, re-dated to 2026-08-26.** Was SCMP. Now Nvidia's Form 10-Q for
the quarter ended 26 July 2026, which records that licences were granted from February 2026 "but
such sales were restricted by the PRC government, and we have been unable to sell all the products
for which we have licenses", a $0.4bn charge for excess H200 inventory, shipments amounting to
less than 1 percent of data-centre revenue, and China including Hong Kong at $7.9bn of $96.2bn of
revenue in the quarter. The entry was re-dated to the filing because the 9 July NDRC decision it
described is not in any allowed source. **Removed:** the NDRC application process, the named
applicants, the roughly 10,000 H200s each to ByteDance and Tencent, and the Kessler testimony of
14 July with its $10bn of approved licences.

**Removed entirely: 2026-05-31, "Chip licence requirement extended to Chinese firms' overseas
units"** (was Al Jazeera). No allowed source records a BIS guidance on that date: the Federal
Register carries no BIS document in May or June 2026 other than notices and denial orders, and the
BIS news listing has nothing on it. The underlying rule is real and already in the file — Nvidia's
10-K states that the licensing requirements apply "to a party headquartered in, or with an ultimate
parent headquartered in, Country Group D5", and 15 CFR 742.6 carries the headquarters test in both
the licence requirement and the review policy — but that dates from the October 2023 rules, which
the 17 October 2023 entry already covers. Rather than invent a date, the entry was dropped and the
eCFR section was added to `alsoSee` on the relevant threshold rows.

**Removed entirely: 2026-08-24, "Taiwan indicts nine over Blackwell server smuggling"** (was PBS).
Checked for an allowed source and found none: the DOJ covers only the separate Super Micro case,
already in the file at 19 March 2026; Super Micro's Form 10-K of 31 August 2026 discusses the SDNY
indictment and says nothing about a Taiwanese prosecution; Nikkei Asia's semiconductor and Taiwan
sections carry no article on it. Taiwan's prosecutors publish their own releases, which would be
Tier A by category, but no such page could be located from here. This is the one substantive event
the file has lost.

---

## 3. `data/control-thresholds.json`

Eight URLs across seven entries: four K&L Gates, one Holland & Knight, one Baker McKenzie, one
TrendForce, one CNBC. All replaced with the instrument itself.

| Entry | Was | Now |
|---|---|---|
| `3a090a-performance-density` | K&L Gates alert (`alsoSee`) | FR 2023-23055, the October 2023 advanced computing rule that added the parameter |
| `3a090b-tpp` | K&L Gates alert (`source`, tagged B) | FR 2023-23055 (`source`, tier A); CSET explainer and eCFR 742.6 in `alsoSee` |
| `3b001-f1b-overlay` | K&L Gates alert (`source`, tagged B) | FR 2023-23049, the October 2023 SME rule, promoted from `alsoSee` to `source` (tier A); eCFR 742.6 added |
| `3b001-litho-zero-de-minimis` | K&L Gates alert (`source`, tagged B) | eCFR 15 CFR 734.4 (tier A) |
| `3b002c-euv-mask-inspection` | Holland & Knight alert (`alsoSee`) | FR 2023-23049 and eCFR 742.6 |
| `nl-duv-nxt1970i-1980i` | TrendForce and CNBC (`alsoSee`) | ASML's Form 20-F for 2024 |
| `jp-meti-23-items` | Baker McKenzie alert (`alsoSee`) | eCFR 15 CFR 734.4, whose footnote records the Japanese listing date |

Two corrections of substance came out of reading the rule text instead of the summaries.

**The zero de minimis entry was wrong about the carve-out.** It said the exemption for countries
that control the item themselves "currently means only Japan". The current eCFR text of
734.4(a)(3) carries a footnote naming two: Japan, which added ArF-wet lithography and other
advanced semiconductor manufacturing equipment to its control list on 23 July 2023, and the
Netherlands, which did so on 9 September 2024. The `alternative` field now says so. The same entry
identified the instrument as "15 CFR 734.4 de minimis rule as applied to ECCN 3B001.f.1.b.2.b";
the current eCFR text keys the zero threshold to equipment meeting the ECCN 3B993.f.1 parameters
when destined for the development or production of advanced-node integrated circuits. The
`instrument` field now names the section rather than an ECCN, and the note records what the text
says.

**The Dutch tool models are now sourced.** The entry's own note conceded that the model numbers
came from TrendForce and CNBC because the government.nl announcement does not name them, which was
fetched and confirmed: it describes DUV lithography equipment, a case-by-case national
authorisation from 7 September 2024, and exports outside the EU, with no model number anywhere.
ASML names them itself. Its Form 20-F for 2024 states that the Dutch requirement published on
6 September 2024, in effect from 7 September, means ASML applies to the Dutch government rather
than the US government for export licences for its TWINSCAN NXT:1970i and 1980i immersion systems
and their specially designed parts, software and technology, and that the Dutch requirement was
already in place for the NXT:2000i and later. The note was rewritten around that; the model
numbers stay, on a better source than they ever had.

---

## 4. `data/exposure.json`

The five flagged URLs are all `images.samsung.com`, and all five are Samsung Electronics' own
audited consolidated financial statements. This is not a market-research or press citation: it is
the filing, on Samsung's own investor-relations asset host. Samsung is not an SEC registrant, so
there is no EDGAR copy to point at instead, and its Korean statutory filings sit with DART rather
than on a domain in the map.

They were verified rather than taken on trust. The PDFs were downloaded, their content streams
decompressed and the numbers checked against the rows:

- FY2025 total revenue KRW 333,605,938 million — found in `2025_con_quarter04_all.pdf`
- FY2024 total revenue KRW 300,870,903 million — found in the same file's comparative column
- FY2025 China revenue KRW 47,314,814 million — found
- FY2024 China revenue KRW 43,926,138 million — found

All four appear in the documents cited. The rows were kept. Two changes were made for clarity: the
FY2022 and FY2024 rows, which read the comparative column of the following year's statements, now
carry a `note` saying so and recording that Samsung is not an SEC registrant. `exposure-notes.md`
gained a paragraph stating that every row cites a filing or investor document on the company's own
domain, that Samsung is the exception to the SEC pattern, and that the figures were checked.

Under the policy's category test — "company filings and investor materials … on the company's own
domain" — these are Tier A. The only thing missing is the domain map entry. See below.

---

## Residual items for whoever owns `data/source-tiers.json`

Two hosts used in these files are Tier A in substance but absent from the map. Both were left
alone because that file belongs to another worker.

1. **`images.samsung.com`** — Samsung Electronics' investor-relations asset host, carrying the
   audited consolidated financial statements. Belongs under A. Five citations in `exposure.json`
   depend on it.
2. **`eto.tech`** — CSET's Emerging Technology Observatory, named in the Tier A definition as
   "CSET and its ETO data". Belongs under A. Nothing depends on it after this pass, because the
   explorer URLs were removed in favour of the machine-readable file, but it will come up again.

Neither absence affects the rendered site: `build/build.js` tier-tags chapter citations only, not
the `source` fields of the data files, and the build reports zero unclassified sources.

## What could not be verified, and was therefore not used

- **Reuters and the FT.** Reuters returns HTTP 401 to automated requests from this environment and
  Google News RSS gives only opaque redirect links, so no specific Reuters or FT page could be
  cited. Headlines confirming the H200 clearance and the AMD payment terms were visible in RSS but
  without a URL there is nothing to cite, and the policy's headline exception does not create one.
- **METI.** `meti.go.jp` returns 403 to every press-release path tried, so the Japanese control
  amendment still rests on the CSIS translation already in the file, with the eCFR footnote added
  as corroboration of the date.
- **TSMC.** `tsmc.com` and `3dfabric.tsmc.com` return 403, so the advanced packaging row could not
  be anchored on TSMC's own materials.
- **eCFR's HTML site** redirects every automated request to its unblock page, whatever the path.
  The four eCFR URLs added here were built from the eCFR structure API for title 15, so the paths
  are canonical, and the text of each section was read through the eCFR versioner API to confirm
  it says what the entry claims. Nothing was cited to eCFR without reading the section.
