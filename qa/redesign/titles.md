# Page titles and descriptions (27 Oct 2026)

Branch `redesign-titles`. Every page's `<title>`, meta description, share tags and JSON-LD come from `build/page-titles.json`. This pass applies the four titles the owner approved and reviews all 22 pages.

## What changed

- **Titles:** 7 of 22 changed, four of them the owner's.
- **Descriptions:** 9 of 22 changed.
- **Lengths:**
  - Every title is now 50 to 60 characters with " · Chip Supply Chain", except two.
    - The home page's (41) is fixed by the owner.
    - Suppliers (62) is kept on purpose.
  - Every description is 130 to 159 characters.
- **Counts the build fills:**
  - `{chapters}` and `{stages}` are unchanged.
  - Each count that `build/modules/reference-pages.js` checks against the data is still in the words it looks for: "38 AI chips", "226 firms", "since 2018", "at 24 firms" and "208 terms".
- **Facts:** every figure in a description appears, with its year, in that page's own text.

## All 22 pages

- **Title lengths** include " · Chip Supply Chain", which the build adds to every title except the home page's.
- **"Unchanged"** means the after column matches the before column.
- **"Owner"** marks the four titles the owner approved.

| Page | Title before | Title after | Description before | Description after | Reason |
|---|---|---|---|---|---|
| `/` | How AI chips are made · Chip Supply Chain (41) | Unchanged | A free, sourced introduction to how AI chips are made and who makes each part, in sixteen chapters from chip design to the data center. (135) | How AI chips are made and who controls each stage of the supply chain, from ASML's EUV machines to TSMC's fabs. A free, sourced guide in sixteen chapters. (154) | Title fixed by the owner. The description now says "supply chain" and names two firms readers search for by name, ASML and TSMC. |
| `/design-and-eda/` | How chips are designed with EDA software · Chip Supply Chain (60) | Unchanged | How chip design software lays out billions of transistors. Synopsys, Cadence and Siemens EDA took over 85 percent of an $18 billion market in 2025. (147) | How chip design software lays out billions of transistors. Synopsys, Cadence and Siemens EDA took over 85 percent of the $18 billion EDA and IP market in 2025. (159) | "An $18 billion market" did not say which market. The chapter's count covers design software and licensed blocks, the EDA and IP market. |
| `/silicon-and-wafers/` | How silicon wafers are made · Chip Supply Chain (47) | **Owner.** How silicon wafers are made from quartz · Chip Supply Chain (59) | How quartz becomes the silicon wafers chips are built on. Firms based in Japan, Taiwan, Germany and South Korea make most 300 mm wafers for advanced chips. (155) | How a silicon crystal is grown and cut into wafers. Five firms based in Japan, Taiwan, Germany and South Korea served around 75 percent of the market in 2025. (158) | The title now says "from quartz", so the description no longer repeats it. Instead it gives the chapter's share for the top five wafer makers. |
| `/chemicals-gases-and-photoresist/` | Photoresist and the chemicals used to make chips · Chip Supply Chain (68) | **Owner.** Photoresist and chemicals for chipmaking · Chip Supply Chain (60) | How photoresist and hundreds of other chemicals and gases are used to make chips. Japanese companies held 78 percent of world photoresist sales in 2023. (152) | Unchanged | Title approved by the owner. The description already names the subject and gives a dated share. |
| `/lithography/` | How ASML's EUV lithography machines work · Chip Supply Chain (60) | Unchanged | How extreme ultraviolet (EUV) lithography prints the finest layers of a chip. ASML, a Dutch firm, is the only maker of these machines and sold 48 in 2025. (154) | Unchanged | The title leads with ASML and EUV lithography, and the description gives a dated count. |
| `/photomasks-and-pellicles/` | What photomasks and pellicles are · Chip Supply Chain (53) | Unchanged | What a photomask and its pellicle are, and why an EUV mask is a mirror. Only three firms make the blank plates for EUV masks. (125) | What a photomask and its pellicle are, and why an EUV mask is a mirror. Japan's AGC and Hoya are two of only three firms that make EUV mask blanks. (147) | The description names two of the three firms, as the one-liner does, and uses "mask blanks", the chapter's term. |
| `/deposition-and-etch/` | How deposition and etch build a chip · Chip Supply Chain (56) | Unchanged | How deposition and etch tools build a chip layer by layer. Applied Materials, Lam Research, Tokyo Electron and ASM International make most of them. (147) | Unchanged | The description already names the four toolmakers people search for. |
| `/metrology-and-inspection/` | How wafer metrology and inspection work · Chip Supply Chain (59) | Unchanged | How chip factories measure wafers and find defects between steps. KLA held 56.8 percent of the market for these tools in 2025, by CSET's count. (143) | Unchanged | Clear and sourced. |
| `/foundries-and-fabs/` | How chip foundries like TSMC make transistors · Chip Supply Chain (65) | **Owner.** How foundries like TSMC make transistors · Chip Supply Chain (60) | How fabs build gate-all-around transistors, and why only TSMC, Intel and Samsung can make the newest chips. TSMC's six largest plants are all in Taiwan. (152) | Unchanged | Title approved by the owner. The description matches the chapter's one-liner and plain paragraph. |
| `/memory-and-hbm/` | What HBM is and who makes it · Chip Supply Chain (48) | What HBM memory is and who makes it · Chip Supply Chain (55) | What high bandwidth memory (HBM) is and how it is stacked. SK hynix took 63.2 percent of HBM revenue in 2025, ahead of Samsung and Micron. (138) | Unchanged | "HBM memory" is a common search phrase, though it repeats "memory", and it brings the title into range. |
| `/advanced-packaging/` | How advanced packaging like TSMC's CoWoS works · Chip Supply Chain (66) | **Owner.** How advanced packaging like CoWoS works · Chip Supply Chain (59) | How advanced packaging joins AI chips and memory. Epoch AI estimates that Nvidia, Google, AMD and Amazon used around 90 percent of CoWoS capacity in 2025. (154) | How advanced packaging joins AI chips and memory. Epoch AI estimates Nvidia, Google, AMD and Amazon used around 90 percent of TSMC's CoWoS capacity in 2025. (156) | The title no longer names TSMC, so the description now does. |
| `/substrates-and-pcbs/` | What chip substrates and PCBs are · Chip Supply Chain (53) | Unchanged | What a package substrate does. Ajinomoto said in June 2026 that it holds over 95 percent of the market for the insulating film inside high-end packages. (152) | What a package substrate does. Ajinomoto, a food company, said in June 2026 that its ABF holds over 95 percent of the market for the insulating film inside. (156) | Adds "ABF", the name readers search for, and the food-company detail from the chapter's one-liner. |
| `/test-and-assembly/` | How chips are tested and assembled · Chip Supply Chain (54) | Unchanged | How chips are tested on the wafer and after packaging. Japan's Advantest took about 65 percent of 2025 spending on chip testers, by its own estimate. (149) | Unchanged | Clear and sourced. |
| `/systems-and-networking/` | How AI chips are networked together · Chip Supply Chain (55) | Unchanged | How 72 AI chips are wired into one rack and run as one computer. In 2026 the lasers for the optical links that carry their signals were scarce. (143) | How Nvidia's and AMD's racks wire 72 AI chips together to run as one computer. In 2026 the lasers for the optical links that carry their signals were scarce. (157) | Names the two firms whose racks the chapter describes, as its one-liner does. |
| `/data-centers-and-power/` | How AI data centers get their power · Chip Supply Chain (55) | Unchanged | Why AI data centers take years to connect to the grid. One rack can draw 142 kilowatts, and large transformers commonly took three years to arrive in 2024. (155) | Unchanged | Clear, sourced and country-neutral. |
| `/component-costs/` | What Nvidia's B200 AI chip costs to make · Chip Supply Chain (60) | Unchanged | Epoch AI estimated in December 2025 that Nvidia's B200 cost about $6,400 to build, mostly for memory and packaging. Its processor silicon cost about $900. (154) | Unchanged | The title matches the question readers ask, and the description answers it with the figure. |
| `/geopolitics/` | Who controls the chip supply chain · Chip Supply Chain (54) | Unchanged | Why few governments can use export controls well. Since 2018 the United States has used them to limit China's access to advanced chips and chipmaking tools. (156) | Unchanged | Kept. The phrase "chip export controls" stays with /export-controls/, so the two pages do not compete for it. |
| `/summary/` | The AI chip supply chain in brief · Chip Supply Chain (53) | Unchanged | The fourteen stages of the AI chip supply chain in one read, with who leads each and how concentrated it is. A four-page PDF is included. (137) | Unchanged | Kept. The page's own "7 of 14" count is not filled by the build, so it would go stale in the description. |
| `/chips/` | AI chips compared · Chip Supply Chain (37) | AI chips compared by specs and suppliers · Chip Supply Chain (60) | Specs for 38 AI chips, from the A100 of 2020 to chips shipping in 2026. Each lists the foundry, memory supplier and packaging plant where published. (148) | Specs for 38 AI chips from Nvidia, AMD, Google, Huawei and others. Each lists the foundry, memory supplier and packaging plant where published. (143) | The title was too short and now says how the chips are compared. The description names the four makers with the most chips on the page. |
| `/suppliers/` | Who makes what in the AI chip supply chain · Chip Supply Chain (62) | Unchanged | What each of the 226 firms in the AI chip supply chain makes, where it is based and how hard it would be to replace. Revenue comes from company filings. (152) | Unchanged | Kept at 62. Every shorter version lost "who makes what", the plainest statement of the page. |
| `/export-controls/` | Chip export controls since 2018 · Chip Supply Chain (51) | Unchanged | A timeline of the main chip export rules since 2018 and what can still be sold to China. Company filings show China's share of revenue at 24 firms. (147) | Unchanged | Kept. "AI chip export controls since 2018" would suggest the AI chip rules began in 2018. The page's first one dates from August 2022, and its timeline also covers rules from Japan, South Korea and Europe. |
| `/glossary/` | Glossary of chip terms · Chip Supply Chain (42) | Semiconductor and AI chip glossary · Chip Supply Chain (54) | Plain definitions of 208 terms from the AI chip supply chain, each linked to the chapters that use it. (102) | Plain definitions of 208 terms from the AI chip supply chain, such as CoWoS, EUV and HBM, each linked to the chapters that use it. (130) | "Semiconductor glossary" is the common search. The description names three terms readers look up and is now in range. |

## The three changes least certain

1. **`/memory-and-hbm/` title.** "HBM memory" repeats a word, since the M in HBM is memory. It matches a common search phrase. The alternative is "What HBM is and who makes it for AI chips", which is 61 characters.
2. **`/silicon-and-wafers/` description.** It joins two facts from the chapter. Siltronic names the five largest wafer makers and their share. The chapter gives each firm's home country elsewhere. Both are true, but no single sentence in the chapter states them together.
3. **`/substrates-and-pcbs/` description.** To fit "ABF" and "a food company", it drops "Japanese" and "high-end packages". The phrase "the market for the insulating film inside" is a little compressed.

## Where each new fact comes from

| Page | Fact | Where it is on the page |
|---|---|---|
| `/` | ASML's EUV machines, TSMC's fabs | Lithography and Foundries and Fabs, both in the home page's text |
| `/design-and-eda/` | $18 billion EDA and IP market, over 85 percent, 2025 | "Design software, simulation software and licensed blocks made up an $18 billion market in 2025" (SemiAnalysis) |
| `/silicon-and-wafers/` | Five firms, around 75 percent, 2025 | Siltronic's April 2026 presentation names the five and their share. The chapter gives each firm's home country. |
| `/photomasks-and-pellicles/` | AGC and Hoya, two of three EUV mask blank makers | The one-liner and the plain paragraph |
| `/advanced-packaging/` | Around 90 percent of TSMC's CoWoS capacity, 2025 | The one-liner (Epoch AI) |
| `/substrates-and-pcbs/` | ABF, over 95 percent, June 2026 | The one-liner and "ABF build-up substrates" |
| `/systems-and-networking/` | Nvidia's and AMD's racks of 72 chips | The one-liner |
| `/chips/` | Nvidia, AMD, Google, Huawei | `data/landscape.json`: Nvidia 9 chips, Google 7, AMD 4, Huawei 4 |
| `/glossary/` | CoWoS, EUV, HBM | Entries in `data/glossary.json` |

## Checks

| Check | Result |
|---|---|
| `node build/build.js` | no warnings. No page's "Updated" date moved (`build/page-dates.json` unchanged). |
| `node qa/scripts/check-seo.js` | 16 chapter pages, 22 sitemap entries, no problems, no notes (5 notes before) |
| `node qa/scripts/check-seo.js --strict` | passes |
| `node qa/scripts/check-speak.js` | no matches |
| Style scan of all 44 strings | no em dash, semicolon, colon, question mark, "X, not Y", "rather than", "we", "you" or "this site" |

`check-speak.js` reads the built page with its tags stripped, so it never sees the meta descriptions. The style scan above applied its patterns to `build/page-titles.json` directly.
