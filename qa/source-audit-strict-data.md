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

---

# Source audit — suppliers, landscape and landscape notes (strict rule)

Second worker, same day. Scope: `data/suppliers.json`, `data/landscape.json`,
`data/landscape-notes.md`. Nothing else in `data/` or `content/` was touched, except the six
additions to `data/source-tiers.json` listed at the end.

## Method

A script read every `http(s)` URL out of the three files and compared each host against tiers A
and B of `data/source-tiers.json`, treating a subdomain of a listed domain as listed. That found
9 disallowed URLs in `suppliers.json` and 24 in each of `landscape.json` and
`landscape-notes.md`, the notes mirroring the JSON. Every one was replaced or removed. The same
script now reports zero. `node build/build.js` runs clean: 19 chips, 220 suppliers, zero D-tier
and zero unclassified sources.

Where a better source gave a different number, the number was corrected rather than deleted.
Where no allowed source carried the fact, the field was set to `null` and the sentence that
depended on it was cut. Every such loss is listed below.

## `data/suppliers.json` — 9 replacements

| Firm | Was | Now | Field changes |
| --- | --- | --- | --- |
| Dongjin Semichem | trendforce.com | dongjin.com semiconductor business page | none; `shareNote` and `revenueUSDb` were already null |
| TSMC | trendforce.com | investor.tsmc.com 2025 annual report | `shareNote` → null; `revenueUSDb` 120.922 → **122.42** |
| SK hynix | trendforce.com | news.skhynix.com FY25 results | `shareNote` → null |
| Samsung Memory | trendforce.com | semiconductor.samsung.com HBM4 shipment release | `shareNote` → null; `role` rewritten |
| Micron | trendforce.com | SEC Form ARS FY2025 (Micron annual report) | `shareNote` → null |
| Kioxia | trendforce.com | kioxia-holdings.com Annual Securities Report FY2025 | `shareNote` → null |
| ASE Technology Holding | trendforce.com | SEC Form 6-K, 4Q25 earnings release | `shareNote` → null |
| Hanmi Semiconductor | chosun.com | hanmisemi.com equipment line-up | `shareNote` → null; `revenueUSDb` **0.43 → null**; `aiRelevance` rewritten |
| Nittobo | insights.trendforce.com | nittobo.co.jp T-glass product page | `shareNote` → null; `revenueUSDb` **0.769 → null**; `aiRelevance` rewritten |

Notes on the two numbers that moved rather than died:

- **TSMC.** The old 120.922 was TrendForce's foundry-revenue line for TSMC. TSMC's own 2025
  annual report states consolidated revenue of US$122.42 billion on NT$3,809.05 billion, the
  latter confirmed against TSMC's own monthly revenue page (NT$3,809,054 million, +31.6%).
  Corrected to the company's figure.
- **Kioxia.** 15.197 USD-b for FY2026 was checked against Kioxia's own Annual Securities Report
  for the year ended 31 March 2026, which gives revenue of ¥2,337,628 million. The conversion
  implies ¥153.8/USD, a reasonable average for the year, so the number was kept and the filing
  cited. Micron ($37.378B FY2025), SK hynix (₩97.1467tn FY2025 ≈ $72.45B) and ASE
  (NT$645,388M FY2025 ≈ $20.49B) were checked the same way and kept.

**Nulled and why.** Hanmi's 2025 revenue (₩576.7bn) and its ~71% TC-bonder share appear only in
Korean trade press quoting TechInsights; Hanmi's own site publishes product pages and press
releases but no financials, and Google News RSS surfaced no Reuters, FT or Nikkei headline
carrying either fact. Nittobo's FY2026 revenue and its ~90% T-glass share are likewise
TrendForce-only; nittobo.co.jp serves its IR pages through a wrapper that returns navigation
without the financial tables to every automated request tried, so the figure could not be
anchored on the company's own filing. All eight DRAM/NAND/foundry/OSAT `shareNote` strings were
market-share estimates from TrendForce's own datasets, which have no Tier A or Tier B
equivalent, so they are gone rather than replaced.

## `data/landscape.json` and `data/landscape-notes.md` — 24 replacements

The two files carry the same citation set, so each row below was applied in both.

| Chip | Removed | Replaced with |
| --- | --- | --- |
| nvidia-b200 | cnbc.com | *(nothing — see losses)* |
| nvidia-b300 | theregister.com | micron.com, 12-high 36 GB HBM3E |
| nvidia-vr200 | techpowerup.com | *(nothing — see losses)* |
| nvidia-h200-china | sanctionsnews.bakermckenzie.com | federalregister.gov, 2026-00789, effective 15 Jan 2026 |
| amd-mi355x | glennklockwood.com | amd.com MI355X GPU datasheet |
| amd-mi455x | storagereview.com | amd.com MI455X product page + rocm.blogs.amd.com CDNA 5 / Helios |
| google-tpu-v7-ironwood | servethehome.com | *(nothing — see losses)* |
| google-tpu-8i | nextplatform.com | *(nothing — see losses)* |
| microsoft-maia-200 | servethehome.com, nextplatform.com | techcommunity.microsoft.com Maia 200 deep dive + Hot Chips 2026 Microsoft deck |
| meta-mtia-400 | servethehome.com, datacenterdynamics.com | Hot Chips 2026 Meta deck + engineering.fb.com MTIA 300 |
| openai-jalapeno | servethehome.com | newsletter.semianalysis.com (already cited; carries the same figures) |
| cerebras-wse3-turbo | servethehome.com ×2 | cerebras.ai/cs4 + cerebras.ai Hot Chips 2026 deep dive |
| huawei-ascend-910c | trendforce.com, scmp.com | english.mofcom.gov.cn Unreliable Entity List remarks |
| huawei-ascend-950pr | trendforce.com ×2 | huawei.com SuperPoD architecture release (Atlas 350 on 950PR) |
| cambricon-siyuan-590 | trendforce.com ×2 | federalregister.gov 2022-27151 (Entity List addition) |
| moore-threads-mtt-s5000 | trendforce.com ×2, technode.com | en.mthreads.com MTT S5000 + MTT KUAE product pages |

Moore Threads had no allowed source at all before this pass. It now has two, both the vendor's.

### Specs set to null

| Chip | Field | Old value | Why |
| --- | --- | --- | --- |
| nvidia-b200 | `priceEstimate` | "$30,000–40,000 per GPU" | Only CNBC. Reuters ran a headline saying "priced at over $30,000" on 19 Mar 2024, but Google News RSS exposes no reuters.com URL for it, so there is nothing to cite. |
| amd-mi455x | `die.count` | 12 | Only StorageReview |
| amd-mi455x | `die.transistorsB` | 320 | Only StorageReview |
| google-tpu-v7-ironwood | `memory.stacks` | 8 | Only ServeTheHome's package photo. Google's own docs give 192 GiB and two chiplets at 96 GB each, never a stack count. |
| google-tpu-8i | `process.node` | "2 nm class (reported)" | Only The Next Platform |
| microsoft-maia-200 | `memory.stacks` | 6 | Only The Next Platform |
| microsoft-maia-200 | `memory.suppliers` | ["SK hynix"] | Only The Next Platform |
| meta-mtia-400 | `die.count` | 5 | Only ServeTheHome, and it conflicts with Meta's own post, which attributes the SoC-chiplet configuration to MTIA 500 and says MTIA 400 "combines two compute chiplets" |
| cerebras-wse3-turbo | `compute.fp16TFLOPS` | 125,000 | The 250 PFLOPS headline is Cerebras's, but only ServeTheHome called it sparse FP16, and the dense reading was derived from that. Cerebras names no format. |
| huawei-ascend-950pr | `memory.capacityGB` | 112 | Only TrendForce |
| huawei-ascend-950pr | `memory.bandwidthTBs` | 1.4 | Only TrendForce |
| huawei-ascend-950pr | `tdpW` | 600 | Only TrendForce |
| huawei-ascend-950pr | `process.node` | "N+3 7 nm class (reported)" | Only TrendForce |

### Specs corrected rather than nulled

| Chip | Field | Old | New | Source |
| --- | --- | --- | --- | --- |
| microsoft-maia-200 | `compute.fp4TFLOPS` | 10,000 | 10,100 | Microsoft states 10.1 PetaOPS FP4 |
| microsoft-maia-200 | `compute.fp8TFLOPS` | 5,000 | 5,050 | Microsoft states FP4 is 2× FP8 |
| microsoft-maia-200 | `process.node` | "N3P" | "N3" | Microsoft says "the latest TSMC N3 process technology" and names no variant; N3P was The Next Platform's |
| huawei-ascend-910c | `compute.fp16TFLOPS` | 800 | 781 | 800 was TrendForce's; 781 is SemiAnalysis's CloudMatrix aggregate divided by 384 chips |
| huawei-ascend-950pr | `compute.fp4TFLOPS` | 1,560 | 2,000 | 1,560 was TrendForce's card-level figure; Huawei's own roadmap gives 2 PFLOPS MXFP4 for the die |
| huawei-ascend-950pr | `shipping` | 2026-Q2 | 2026-Q1 | Huawei's stated availability quarter; the March launch and April mass-production dates were TrendForce's |
| amd-mi455x | `process.node` | "N2 (8 XCDs) plus N3 (2 I/O dies and 2 fabric-and-cache dies)" | "N2 plus N3, split not published" | AMD's product page gives "TSMC 2nm \| 3nm" lithography; the die-by-die assignment was StorageReview's |
| cerebras-wse3-turbo | on-wafer fabric | 53 PB/s | 53.5 PB/s | Cerebras's own figure |

### Prose deleted from `landscape-notes.md`

Sentences whose only support was a disallowed source, removed rather than rewritten:

- **B200**: the $30,000–40,000 module price. Replaced with a sentence saying Nvidia has never
  published a list price.
- **Rubin**: the claim that 19.2 TB/s settled there after suppliers missed a 22 TB/s pin-speed
  target. Nvidia never confirmed it and only TechPowerUp carried it.
- **Ironwood**: ServeTheHome's visual confirmation of eight HBM3E sites.
- **TPU 8i**: that TPU 8i was co-designed with MediaTek rather than Broadcom, and that TPU 8t is
  "Sunfish". Google names no design partner. Reuters ran "Google preparing to partner with
  Taiwan's MediaTek on next AI chip, Information reports" in March 2025, which is a prospective
  partnership about an unnamed chip and does not support the claim. The paragraph now uses
  Google's published TPU 8t figures instead.
- **MI455X**: twelve dies, 320 billion transistors, 192 MB of L2 at 54 TB/s, "largest chip ever
  built on CoWoS-L", and the 225–245 kW Helios rack power. Replaced with AMD's own lithography,
  packaging and rack-bandwidth figures.
- **Maia 200**: The Next Platform's N3P, 836 mm² and six SK hynix stacks.
- **MTIA 400**: Data Center Dynamics' 9.2 TB/s variant and the four-accelerator tray count.
- **Ascend 910C**: the TechInsights teardown finding TSMC, Samsung and SK hynix parts inside
  Ascend processors. MOFCOM's own statement confirms the listing and the stated grounds but not
  the teardown's findings, so the paragraph now cites MOFCOM for the listing and SemiAnalysis for
  the TSMC-origin judgement.
- **Ascend 950PR**: the 1.56 PFLOPS / 112 GB / 1.4 TB/s / 600 W card figures, the 2.8× H20 claim,
  the competing 128 GB / 1.6 TB/s figure, and the March/April 2026 launch dates.
- **Cambricon**: "roughly 80 percent of an Nvidia A100", RMB 6.5bn 2025 revenue, RMB 6.0bn H1
  2026, 99.98 percent cloud accelerators, ~20 percent yields, and the 690's one-year slip. Also
  removed from `exportStatus`: that Cambricon is a named launch customer for CXMT's HBM3E.
- **Moore Threads**: "up to 1,000 TFLOPS of dense AI compute", the RMB 1bn loss to quarterly
  profit swing, R&D at 87 percent of revenue, the December 2025 STAR Market listing, day-zero
  DeepSeek V4 adaptation, and the Huashan successor. Replaced with the vendor's own claims.

### One judgement call worth flagging

Three chips lost numbers that came from Hot Chips 2026 talks by the vendors themselves, reported
second-hand by ServeTheHome. The conference publishes those decks at
`hc2026.hotchips.org/assets/program/conference/day2/…`, and the policy names Hot Chips slides as
an allowed replacement, so the **Microsoft Maia 200** and **Meta MTIA 400** decks are now cited
directly in place of the trade-press coverage. Two caveats the client should know:

1. The 2026 decks return **HTTP 401** to anyone not registered for the conference, so their
   contents could not be read here. What is verifiable is the public conference programme at
   `hc2026.hotchips.org/program/conference/`, which lists both talks and links exactly these two
   PDF paths. Hot Chips normally opens the archive later; until then a reader without a
   registration cannot follow these two links.
2. Where the vendor's own site carried the same fact, the vendor's page was preferred and the
   deck was not used. That is why **Cerebras** ended up on `cerebras.ai/cs4` and Cerebras's own
   Hot Chips deep-dive blog rather than the Cerebras deck, and why Maia 200's node, FLOPS, SRAM,
   HBM and networking figures now cite Microsoft's Azure Infrastructure blog rather than the
   deck. The deck backs only the two numbers Microsoft has not published elsewhere: the ~820 mm²
   die and the 1.65 PFLOPS effective attention throughput.

If the client would rather not cite a registration-gated PDF, the fallback is to null
`microsoft-maia-200.die.areaMm2Each`, `meta-mtia-400`'s `memory.capacityGB`,
`memory.bandwidthTBs`, `memory.stacks`, `compute.fp8TFLOPS`, `compute.fp4TFLOPS` and `tdpW`, and
cut the corresponding sentences. Say the word and it is a ten-minute change.

## Additions to `data/source-tiers.json`

Six hosts, all Tier A by category:

- `dongjin.com` — Dongjin Semichem's own site (vendor product page)
- `hanmisemi.com` — Hanmi Semiconductor's own site (vendor product page)
- `kioxia-holdings.com` — Kioxia Holdings' IR host, carrying its Annual Securities Report
- `hotchips.org` — Hot Chips, named in the brief as an allowed primary source
- `techcommunity.microsoft.com` — Microsoft's Azure Infrastructure engineering blog
- `nittobo.co.jp` — already added by the other worker before this pass; left as found

`micron.com`, `federalregister.gov`, `english.mofcom.gov.cn`, `semiconductor.samsung.com`,
`news.skhynix.com`, `investor.tsmc.com`, `sec.gov`, `huawei.com`, `mthreads.com`, `cerebras.ai`,
`amd.com` (covering `rocm.blogs.amd.com`) and `engineering.fb.com` were already listed.

## What could not be verified, and was therefore not used

- **Reuters.** The search tool refuses `reuters.com` outright and Google News RSS returns only
  `news.google.com` redirect links, so no Reuters URL could be produced. Two Reuters headlines
  were found that state facts this data set wanted — the B200 price and the MediaTek TPU
  partnership — and neither could be cited for want of a URL.
- **Financial Times, Nikkei Asia.** Nothing relevant surfaced in RSS for any of these chips or
  firms.
- **amd.com PDFs and product pages** time out on fetch from this environment. The MI355X
  Infinity Fabric figures and the MI455X lithography, HBM and Helios figures were confirmed
  through search snippets drawn from those same amd.com pages, and `rocm.blogs.amd.com`, which
  does fetch, carries the Helios rack numbers directly.
- **openai.com** returns HTTP 403, so the two OpenAI pages already cited for Jalapeño could not
  be re-read. They were left in place unchanged; SemiAnalysis, which does fetch, independently
  carries the networking and Celestica facts that ServeTheHome had been carrying.
- **Cambricon and Moore Threads financials.** Both are STAR Market issuers, so their results are
  company filings in substance, but the filings live on `sse.com.cn`, which is not in the domain
  map, and the specific announcements could not be located from here. The figures were deleted
  rather than left on TrendForce. If someone adds `sse.com.cn` under A and finds the annual
  reports, the revenue and profit narrative for both firms can come back.
- **Layouts.** The `layout` blocks in `landscape.json` are schematic drawings, not cited specs.
  Ironwood, Maia 200 and MTIA 400 still draw 8, 6 and 8 HBM sites respectively even though those
  stack counts are now null. Nothing in the build reads a stack count from a layout, and
  redrawing them was out of scope, but whoever owns the figures should know.
