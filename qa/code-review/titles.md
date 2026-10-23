# Search titles and descriptions

21 October 2026. Final `<title>` and meta description for the 23 indexable pages, rewritten from `qa/code-review/seo.md` section 5 to the owner's instruction: "the titles should be very simple and straightforward." Machine-readable copy: `qa/code-review/titles.json`.

## How to read the table

- **Titles are shown without the suffix.** `pageTitle()` in `build/modules/social.js` adds " · Chip Supply Chain" (20 characters) to every page but the home page. The home title already carries the site name and must not get it twice. With the suffix the longest title here (48) comes to 68 characters. Section P2-2 of `seo.md` recommends dropping the suffix on chapter and reference pages; that is still the owner's call, and every title here reads complete either way.
- **Lengths are characters.** Titles: 55 at most before the suffix. Descriptions: about 155.
- **Counts on the reference pages are live.** 226 firms, 208 terms, 38 chips, 24 firms and the year 2018 are computed in `build/modules/reference-pages.js`. Keep them as template values when wiring these in, as the current descriptions do.
- **Every chapter fact comes from that chapter's own text** (its `oneLiner`, `plain` or body), with its year. Reference-page facts come from each page's own intro.

## Rules applied

- Titles: plain words, "How X works", "What X is", "Who makes X" where they fit; no colons, at most one comma, no "explained", no lists. The searched term stays where the page is about it: EUV, HBM, CoWoS, EDA, photoresist, wafers, gate-all-around, metrology, PCBs.
- Descriptions: one or two sentences, no em dashes, semicolons or colons, no "X, not Y", no questions, no "we", "you" or "this site", American spelling, "percent". Checked with the same patterns as `qa/scripts/check-speak.js`.

## Company names in titles

Added only where people search the name together with the topic, one name per title:

- **ASML** on Lithography ("ASML EUV" is the common search for the machines).
- **TSMC** on Foundries and Fabs ("TSMC foundry") and on Advanced Packaging ("TSMC CoWoS").
- **SK hynix** on Memory and HBM ("SK hynix HBM"), as the leader by 2025 revenue the chapter reports.
- **Nvidia** (with B200) on the costs chapter ("B200 cost", "how much does it cost to make a GPU").

No name on Systems and Networking: the chapter covers NVLink, UALink and Google's torus, so one firm's name would narrow it. None on Design (two or three EDA firms would make a list) or on the reference pages.

## The 23 pages

| Path | Title | Len | Description | Len | Change from seo.md |
|---|---|---|---|---|---|
| `/` | How AI chips are made · Chip Supply Chain | 41 | A free, sourced introduction to how AI chips are made and who makes each part, in seventeen chapters from chip design to the data center. | 137 | Title: colon and "stage by stage" cut; the h1 leads and the site name follows the site's own separator. Description: colon removed. |
| `/design-and-eda/` | How chips are designed with EDA software | 40 | How chip design software lays out billions of transistors. Synopsys, Cadence and Siemens EDA took over 85 percent of an $18 billion market in 2025. | 147 | Title: colon and "how it works, who sells it" cut. Description: the proposal's 85 percent had lost its year and the $18 billion market; both restored from the oneLiner. |
| `/silicon-and-wafers/` | How silicon wafers are made | 27 | How quartz becomes the silicon wafers chips are built on. Firms based in Japan, Taiwan, Germany and South Korea make most 300 mm wafers for advanced chips. | 155 | Title: ", and who makes them" cut. Description: "make most of them" claimed most of all wafers; the chapter says most 300 mm wafers for advanced chips. |
| `/chemicals-gases-and-photoresist/` | Photoresist and the chemicals used to make chips | 48 | How photoresist and hundreds of other chemicals and gases are used to make chips. Japanese companies held 78 percent of world photoresist sales in 2023. | 152 | Title: colon and three-item list cut. Description: "specialty" is not the chapter's word; "hundreds of other chemicals and gases" is from its plain text. |
| `/lithography/` | How ASML's EUV lithography machines work | 40 | How extreme ultraviolet (EUV) lithography prints the finest layers of a chip. ASML, a Dutch firm, is the only maker of these machines and sold 48 in 2025. | 154 | Name added: ASML, searched with EUV more than any other firm with any topic here. "and who makes the machines" cut. EUV spelled out once. |
| `/photomasks-and-pellicles/` | What photomasks and pellicles are | 33 | What a photomask and its pellicle are, and why an EUV mask is a mirror. Only three firms make the blank plates for EUV masks. | 125 | Title: colon cut. Description: "blank plates for leading-edge masks" made precise as EUV masks, as AGC states it in the chapter. |
| `/deposition-and-etch/` | How deposition and etch build a chip | 36 | How deposition and etch tools build a chip layer by layer. Applied Materials, Lam Research, Tokyo Electron and ASM International make most of them. | 147 | Title: colon and "layer by layer" cut. Description: colon list and "Chinese rivals" removed; the four makers are named as the chapter names them. |
| `/metrology-and-inspection/` | How wafer metrology and inspection work | 39 | How chip factories measure wafers and find defects between steps. KLA held 56.8 percent of the market for these tools in 2025, by CSET's count. | 143 | Title: colon cut; "metrology" kept as the page's searched term. Description: "fabs" became "chip factories"; "an American firm" cut for length and the global audience. |
| `/transistors-and-front-end/` | How gate-all-around transistors are made | 40 | How transistors switch current and why gate-all-around designs leak less. Only TSMC, Intel and Samsung make 2 nm-class transistors in volume. | 141 | Title: "explained" and "2 nm chips" cut. Description: "the successor to FinFETs" stacked commas; replaced with the chapter's own leak explanation. |
| `/foundries-and-fabs/` | How chip foundries like TSMC work | 33 | What a chip foundry is. TSMC's six largest plants are all in Taiwan, and in 2025 they could make more than 13 million wafers a year. | 132 | Name kept: TSMC only, searched with "foundry". The four-firm list and colon cut. Description unchanged in fact, shorter. |
| `/memory-and-hbm/` | What HBM is and who makes it | 45 | What high bandwidth memory (HBM) is and how it is stacked. SK hynix took 63.2 percent of HBM revenue in 2025, ahead of Samsung and Micron. | 138 | Name kept: SK hynix only (searched with HBM); the three-name list and colon cut. Description: three sentences became two. |
| `/advanced-packaging/` | How advanced packaging like TSMC's CoWoS works | 46 | How advanced packaging joins AI chips and memory. Epoch AI estimates that Nvidia, Google, AMD and Amazon used around 90 percent of CoWoS capacity in 2025. | 154 | Name added: TSMC, searched with CoWoS. "explained" cut. Description: "capacity ran tight in 2026" was a paraphrase; replaced with the oneLiner's Epoch AI 2025 estimate. |
| `/substrates-and-pcbs/` | What chip substrates and PCBs are | 33 | What a package substrate does. Ajinomoto said in June 2026 that it holds over 95 percent of the market for the insulating film inside high-end packages. | 152 | Title: "ABF" (beginner jargon) and colon cut. Description: restored "June 2026", which the proposal dropped. |
| `/test-and-assembly/` | How chips are tested and assembled | 34 | How chips are tested on the wafer and after packaging. Japan's Advantest took about 65 percent of 2025 spending on chip testers, by its own estimate. | 149 | Title: colon and the list "testers, probe cards, OSATs" cut (OSAT is jargon). Description lightly trimmed. |
| `/systems-and-networking/` | How AI chips are networked together | 35 | How 72 AI chips are wired into one rack and run as one computer. In 2026 the lasers for the optical links that carry their signals were scarce. | 143 | Title: colon and the list "NVLink, InfiniBand and optics" cut; no firm name, since the chapter covers NVLink, UALink and Google. Description: "between racks" dropped, which the chapter does not pin down. |
| `/data-centers-and-power/` | How AI data centers get their power | 35 | Why AI data centers take years to connect to the grid. One rack can draw 142 kilowatts, and large transformers commonly took three years to arrive in 2024. | 155 | Title: colon and vague "what limits new sites" cut. Description: "a big transformer took about three years" corrected to the oneLiner's "large transformers commonly took three years". |
| `/component-costs/` | What Nvidia's B200 AI chip costs to make | 40 | Epoch AI estimated in December 2025 that Nvidia's B200 cost about $6,400 to build, mostly for memory and packaging. Its processor silicon cost about $900. | 154 | Name kept: Nvidia's B200, searched as "B200 cost". Colon cut. Description: the $30,000 to $40,000 price had lost its year (March 2024); replaced with the oneLiner's $900 for the silicon. |
| `/geopolitics/` | Who controls the chip supply chain | 34 | Why few governments can use export controls well. Since 2018 the United States has used them to limit China's access to advanced chips and chipmaking tools. | 156 | Title: colon and "geopolitics explained" cut. Description: the five-item list after a colon replaced with the chapter's plain text and oneLiner. |
| `/summary/` | The AI chip supply chain in brief | 33 | The fifteen stages of the AI chip supply chain in one read, with who leads each and how concentrated it is. A four-page PDF is included. | 136 | Title: colon and "15 stages in one read" cut. Description: colon removed; "where China and the United States stand" cut for length and the global audience. |
| `/chips/` | AI chips compared | 17 | Specs for 38 AI chips, from the A100 of 2020 to chips shipping in 2026. Each lists the foundry, memory supplier and packaging plant where published. | 148 | Title: colon and four-item list cut. Description: one long sentence split in two; facts from the page's own intro. |
| `/suppliers/` | Who makes what in the AI chip supply chain | 42 | What each of the 226 firms in the AI chip supply chain makes, where it is based and how hard it would be to replace. Revenue comes from company filings. | 152 | Title: colon cut and rewritten as "Who makes what". Description: the page's line, split into two sentences. |
| `/export-controls/` | Chip export controls since 2018 | 31 | A timeline of the main chip export rules since 2018 and what can still be sold to China. Company filings show China's share of revenue at 24 firms. | 147 | Title: ": the rules and a timeline" cut. Description: stacked clauses split in two. |
| `/glossary/` | Glossary of chip terms | 22 | Plain definitions of 208 terms from the AI chip supply chain, each linked to the chapters that use it. | 102 | Title: colon and list cut. Description: "from ABF to yield" cut (jargon in the first words a beginner reads). |

## Found in passing

- **The Glossary page shows the AI Chips intro.** `dist/glossary/index.html` opens with "The chips that train and run AI models, from the A100 of 2020..." under the Glossary h1. `glossaryDek` in `build/modules/reference-pages.js:67` matches the first `data-view="glossary"` in `src/template.html`, a nav button at line 60, then the next `<p class="dek">` after it, which is the AI Chips dek at line 113. The Glossary's own dek is at line 266. Anchoring the regex on the view's section would fix it. Not changed here.
- **Chapter 15's oneLiner is now three sentences and 337 characters**, led by the Texas grid. The new description above replaces it in search results, but the share preview still uses the full oneLiner.
