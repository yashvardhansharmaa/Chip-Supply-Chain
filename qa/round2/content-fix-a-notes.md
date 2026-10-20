# content-fix-a notes (20 October 2026)

Scope: sourcing fixes in chapters 01 to 10, 16 and 17 (fix list items 1 to 10 in the brief). Edit tool only. Downloads under `qa/round2/scratch/content-fix-a/`. Screenshots under `qa/round2/shots/content-fix-a/` (port 9821).

## Progress log
- Read RULES.md, SCHEMA.md, writing-well SKILL.md, pages-a, pages-b, cards-a, cards-b notes, INTEGRATION.md.
- ch 07 edited (oneLiner, plain + twin, lead, yield paragraph, Camtek, Skyverse, chokepoint, countries). Sources checked: Parhami PDF p7-8, KLA investor day p35, KLA Q3 FY26 letter p3, Skyverse summary p12/p16, ETO open data (N60 tree), Camtek 6-K (sec.gov, fetched with --compressed and Accept-Encoding).
- ch 16: Ibiden states no gross margin anywhere in its Q1 FY2026 materials (tanshin, outline, presentation, Q&A checked). Outline states operating profit ratio 21.8%.
- ch 10 edited: cost slot, keyFact, hbm-revenue figure and body now use Micron's FQ1 2026 prepared remarks (17 Dec 2025, 9 pp., q4cdn.com = Tier A): "We forecast an HBM TAM CAGR of approximately 40% through calendar 2028, from approximately $35 billion in 2025 to around $100 billion in 2028." (p. 1). Gartner $33B sentence and BofA $54.6B sentence removed. Also removed (same rule, same SK hynix outlook page): UBS 70% HBM4 share sentence and "major research and brokerage analysts" HBM3E two-thirds sentence. IFP wording fixed ("the United States", "projected").
- ch 09 edited: "bought" -> "agreed to buy", "It paid with" -> "It would pay with" (Intel 22 Aug 2025: "agrees to purchase", "will be funded by"); Takeaways duplicate of "Little of China's capacity is advanced" removed (kept in The chokepoint); TW countries note. US 28 percent by 2032 checked: cited p. 14 (Exhibit 6) shows 28%, so no change.
- ch 06 edited: chamber sentence cut to its sourced clause; TEL "new equipment sales"; CN countries note.
- ch 17 edited (same issues as items 3 and 4): Intel "converted" -> "agreed to convert"; TEL "share of new equipment sales" (p. 27) and p. 5's 26.8% re-worded as China's share of its sales (p. 5 chart is net sales by region).
- ch 04: "about four percent" -> "only four percent" (CSIS). Reuters prices: Wayback copy of the July 2026 explainer is itself a DataDome 401 page, so still unverified.
- ch 03: plain + twin approval sentences rewritten, cited to SIA PAG case study p. 22.
- ch 02: Eswin figures verified on cninfo copies (prospectus 1224723727.PDF, 459 pp.; 2025 summary 1225128957.PDF, 15 pp.); citations re-pointed with #page; 79/6/15 rounded figures restated as filed (79.08, 6.01, 14.91). SUMCO bullet and keyFact as filed. Five dates day-first.
- ch 16: Ibiden dropped from gross-margin table and figure; operating margin 21.8% (outline2026Q1.pdf) added beside SK hynix's. KLA "about five times" table row replaced with CSET's 56.8 percent. One date day-first.
- ch 01: four CSIS citations re-pointed to the CSIS full report PDF (csis-website-prod.s3.amazonaws.com, 55 pp.) at p. 7, 13, 33, 33. By the final check run (02:49) someone had added that host to tier A in data/source-tiers.json (line 358), so check-sources passes.
- Final: build, check-speak, check-integrity, check-sources all clean for my chapters; screenshots taken. Status: done.

## Item by item (before → after, source, quote, page)

### 1. ch 07 Metrology and inspection
Sources opened: Parhami, *Dependable Computing* pt 2 (65 pp., `scratch/pages-a/39`), KLA 2026 Investor Day deck (173 pp.), KLA Q3 FY26 letter (17 pp.), Skyverse 2025 summary (cninfo, 16 pp.), CSET/ETO open data (`scratch/cards-a/eto-gh`, TechInsights data published 3 July 2026), Camtek 6-K (sec.gov; downloads with `--compressed` and an Accept-Encoding header).

- **Worked yield example.** Confirmed computed: Parhami p. 7 gives only the formula ("The parameter a is ... in the range 3-4"), p. 8 only Example 5.2 at 0.8/cm² ("a yield of 0.492w and 0.113w for the 1 × 1 and 2 × 2 dies"). The paragraph before already states that example (p. 8), so the computed paragraph now uses the source's other worked example (Example 5.1, p. 7: "the expected annual revenue gain for a 1% yield improvement is $30 gain/wafer × 5000 wafers/week × 52 weeks/year = $7.8M").
  - Before: "By the same formula, an 8 square centimeter die, about as much as one exposure can print, yields about 49 percent at 0.10 defects per square centimeter, with a set to 3. Halving the defect density to 0.05 lifts that yield to about 69 percent. Engineers move a fab from the first figure to the second by finding the process step that is losing dies and fixing it, work called yield learning."
  - After: "In another textbook example, a fab makes 5,000 wafers a week, each holding 200 dies, and earns $15 from each good die ([source](…#page=7)). Each percentage point of yield is then worth $7.8 million a year ([source](…#page=7)). Engineers raise yield by finding the process step that is losing dies and fixing it, work called yield learning." The next paragraph's "Those percentages" became "The formula's percentages" so the reference still holds. The yield-learning sentence was uncited before and still is.
- **`plain` and twin** (identical). Before: "On a chip that size, halving the stray specks lifts the share of flawless chips from about half to about seven in ten. In 2025 one American firm, KLA, held about five times the market share of its nearest rival." After: "In a textbook example with the same density of specks, 49.2 percent of chips 1 centimeter square come out flawless, but only 11.3 percent of chips 2 centimeters square ([source](Parhami#page=8)). In 2025 one American firm, KLA, held 56.8 percent of the market for these tools, by CSET's count ([source](ETO N60))." I used CSET's 56.8 percent in place of KLA's 6.5x: the sentence is about 2025, and the 6.5x is Gartner's 2024 figure.
- **Lead.** Before: "…puts KLA at 56.8 percent, about five times Applied Materials' 11.2 percent … The figures use different data and years, so KLA's lead over the next firm ranges from about 5 to about 7 times." After: "…puts KLA at 56.8 percent and Applied Materials, the next largest, at 11.2 percent ([source](N60))." The two KLA ratio sentences that were already there stay (investor day p. 35: "56.5% KLA Share in 2024 … 6.5x nearest competitor", Source: Gartner April 2025; Q3 FY26 letter p. 3: "approximately 7x greater than the nearest competitor"). The uncited closing sentence with the computed "about 5" was cut.
- **`oneLiner` changed** (share card must be re-rendered). Before: "…in 2025 by CSET's count, about five times its nearest rival." After: "KLA, an American firm, held 56.8 percent of the market for tools that measure and inspect wafers in 2025, by CSET's count."
- **Skyverse.** Filing p. 12 table (单位：元): 营业收入 2,053,298,171.74 (2025), 1,380,378,763.53 (2024), 48.75 %; p. 16 prose: "营业收入为 205,329.82 万元，同比增长 48.75%". Before: "reported 2.05 billion yuan of revenue in 2025, about $285 million … That was up 48.75 percent on 2024 and more than double its 2023 revenue … Skyverse's revenue alone is about 1.8 percent of CSET's market, more than twice CSET's figure for all Chinese firms, so the CSET count may miss some domestic sales." After: "reported 2,053,298,171.74 yuan of revenue in 2025 (p. 12). That was up 48.75 percent on 2024 (p. 12)." "More than double its 2023 revenue" was also a computed comparison (2,053.3 ÷ 890.9), so it went too. Card `chinaStatus`: "2.05 billion yuan" → "2,053,298,171.74 yuan" (same body URL, #page=12).
- **"KLA leads most kinds."** ETO tree: N60 → N61 (wafer inspection, a group) + N62 mask + N64 process monitoring; N61 → N65 film, N66 CD, N67 defect inspection, N114 overlay, N115 e-beam metrology, N116 defect review. Leaf leaders 2025: N62 KLA 45.9, N64 Keysight 68.6, N65 KLA 45.6, N66 Hitachi 71.9, N67 KLA 85.9, N114 KLA 51.5, N115 Applied 45.1, N116 Applied 72.5. KLA leads 4 of 8. Before: "Several firms can build a good film metrology tool, but KLA leads most kinds of process control tool, and it says its share grew from 2021 to 2025." After: "Several firms can build a good film metrology tool, but KLA led four of the eight kinds of process control tool in 2025, by CSET's count ([source](N60)). KLA says its share of the whole market grew from 2021 to 2025 ([source](Q3 FY26 letter#page=3))."
- **Camtek.** 6-K of 18 Feb 2026: "Revenues for 2025 were $496.1 million, a 16% increase compared to $429.2 million in 2024"; ETO N60: CAMTEK 1.6. Before (inside the Onto bullet): "**Camtek** holds 1.6 percent on $496.1 million of 2025 revenue ([6-K])." After (own bullet, like Nova and Onto): "**Camtek** holds 1.6 percent ([N60]). It took $496.1 million of revenue in 2025 ([6-K])."
- **Countries notes.** JP "Hitachi High-Tech CD-SEM; Lasertec mask inspection; Rigaku X-ray" → "Hitachi High-Tech (CD-SEM), Lasertec (mask inspection), Rigaku (X-ray)". CN "…domestic makers; 0.7% of the market…" → "…domestic makers, with 0.7% of the market in 2025 by CSET's count".
- **Defects animation: numbers not in any source (not re-rendered, for the owner).** `animations/defects.html` sets D0 = 0.10/cm², a = 3, and computes `TARGET = [model(1, D0), model(8, D0), model(8, D0/2)]` (≈91, 49 and 69 percent), shown as "percent work" beside "Small chips, 1 square cm", "AI-size chips, 8 square cm" and "AI-size chips, half the specks". Captions in `media/defects.json` and the HTML: "An AI chip covers eight times the area, so about half of them catch a speck and fail." and "Halve the specks and about seven in ten AI chips work." The figure note in the front matter: "68 specks, 0.10 per square centimeter" (68 = round(0.10 × π × 14.7²)). None of 0.10/cm², 8 cm², 68, 91, 49 or 69 percent, "eight times the area" or "about half"/"seven in ten" is in Parhami or any cited source; all follow from the formula. The text no longer mentions them, so the animation now also diverges from the chapter. A re-render on the source's own example (1 cm² and 2 × 2 cm dies at 0.8/cm², 49.2 and 11.3 percent, p. 8) would fix both.

### 2. ch 10 Memory and HBM
- **Cost slot.** Found an allowed market size: Micron's fiscal Q1 2026 prepared remarks (17 Dec 2025, 9 pp., on Micron's IR file host s25.q4cdn.com, tier A), p. 1: "We forecast an HBM TAM CAGR of approximately 40% through calendar 2028, from approximately $35 billion in 2025 to around $100 billion in 2028." (Micron's later remarks, Q2 to Q4 FY26, give no newer HBM market size.) Before: `"$33B of HBM revenue in 2025, a Gartner figure cited in SK hynix's July 2026 prospectus"`, costSources the 424B4. After: `"About $35B HBM market in 2025, Micron's December 2025 estimate"`, costSources the Micron PDF. No `costLabel` needed.
- **Body.** Before: "SK hynix's US prospectus, citing the research firm Gartner, puts HBM revenue at $33 billion in 2025 (424B4). Bank of America, in an estimate SK hynix quoted in January 2026, put the 2026 HBM market at $54.6 billion, up 58 percent on 2025 (SK hynix outlook)." After: "In December 2025 Micron put the HBM market at about $35 billion in 2025 and forecast that it would reach around $100 billion in 2028 ([source](Micron PDF))."
- **Figure `hbm-revenue`.** Before: "HBM market forecast for 2026, Bank of America", [["2026", 54.6]]. After: "HBM market, Micron's estimate for 2025 and forecast for 2028", [["2025", 35], ["2028", 100]], source label "Micron prepared remarks, fiscal first quarter 2026, 17 December 2025".
- **keyFact** (BofA + "major analysts") → "Micron forecast in December 2025 that the HBM market would grow about 40% a year through 2028, from about $35 billion in 2025 to around $100 billion in 2028".
- **Same rule, same SK hynix outlook page (beyond the list, removed):** "UBS, as quoted in SK hynix's January 2026 market outlook, expected SK hynix to take about 70 percent of the HBM4 market for Nvidia's Rubin platform in 2026" (bank research) and "SK hynix's January 2026 market outlook says major research and brokerage analysts expect HBM3E to be about two thirds of all HBM shipments in 2026" (outlook: "Major research and brokerage analysts expect HBM3E to account for approximately two-thirds…"). The outlook URL is no longer cited in ch 10.
- **IFP.** Page: "the United States is projected to make 70 times as much HBM as China". Before: "the institute estimated that the United States and its partners would make 70 times…". After: "the institute projected that the United States would make 70 times…".

### 3. ch 09 Foundries and fabs
- **Duplicate.** "Little of China's capacity is advanced (SIA/BCG #page=30)" kept in The chokepoint, removed from Takeaways (Takeaways should summarise the body, not carry the only copy).
- **Intel.** Intel, 22 Aug 2025: "the government agrees to purchase 433.3 million primary shares of Intel common stock at a price of $20.47 per share, equivalent to a 9.9 percent stake"; "The government's equity stake will be funded by the remaining $5.7 billion in grants…". Before: "the government bought 433.3 million newly issued Intel shares … It paid with $5.7 billion…". After: "the government agreed to buy 433.3 million newly issued Intel shares … It would pay with $5.7 billion…".
- **28 percent by 2032: fine, unchanged.** The sentence cites p. 14, whose Exhibit 6 shows 28% for the US in logic <10 nm, 2032F. (p. 13's text says "nearly 30%".)
- **Countries.** TW "TSMC's six gigafabs and UMC; TSMC's N2 and N3 lines" → "TSMC (six gigafabs, N2 and N3 lines) and UMC".

### 4. ch 06 Deposition and etch
- **Chamber sentence.** No source found for "built from similar vacuum, gas and radio-frequency parts" (FR 2023-23049 p. 28 has only the control text; Lam's etch page covers etch only). Cut. Before: "Deposition and etch chambers are separate products built from similar vacuum, gas and radio-frequency parts, and the export controls describe each tool by the process it is designed to run (#page=28)." After: "The US export controls describe each deposition or etch tool by the process it is designed to run (#page=28)." The paragraph before already explains the shared vacuum, gas and plasma steps, cited to Lam.
- **TEL China.** TEL deck p. 27 note 2: "Percentages on the graph show the composition ratio of new equipment sales. Field Solutions sales are not included." (FY2025 41.7%, FY2026 34.1%). Before: "34.1 percent of sales in the year to March 2026, down from 41.7 percent". After: "34.1 percent of new equipment sales in the year to March 2026, down from 41.7 percent".
- **Countries.** CN "Naura, AMEC, Piotech; largest equipment market at $49.3B in 2025" → "Naura, AMEC and Piotech, in the largest equipment market ($49.3B in 2025)".
- **TEL p. 28 Gartner shares: unchanged, as instructed.** CSET (ETO, 2025, TechInsights data published 3 July 2026) could replace them:

| TEL deck (Gartner CY2025) | CSET segment (node) | TEL share 2025 | Market 2025 | URL |
|---|---|---|---|---|
| Coater/developer 91% | Resist processing tools (N32) | 92.6% (1st) | $3.2B | chipexplorer.eto.tech/?parentNode=N25&selectedNode=N32 |
| Dry etch 23% | Dry etch tools (N103) | 23.4% (2nd; Lam 41.1) | $21.9B | ?parentNode=N46&selectedNode=N103 (already cited) |
| — | Insulator (dielectric) etch (N51) | 55.9% (1st) | $8.7B | ?parentNode=N46&selectedNode=N51 (already cited) |
| ALD 15% | Atomic layer deposition (N41) | 15.5% (2nd; ASM 54.5) | $4.1B | ?parentNode=N35&selectedNode=N41 (already cited) |
| CVD (tube + nontube LPCVD) 38% | Low-pressure CVD tools (N39) | 34.0% (1st) | $2.2B | ?parentNode=N35&selectedNode=N39 |
| Oxidation/diffusion 31% | Tube-based diffusion and deposition tools (N44) | 50.8% (1st) | $2.1B | ?parentNode=N35&selectedNode=N44 |
| Deposition (furnace, ALD, LPCVD) 27% | no matching bundle; all deposition tools (N36) | 9.7% (4th) | $26.2B | ?parentNode=N35&selectedNode=N36 (already cited) |
| Cleaning 20% | Wet etching and cleaning tools (N49) | 19.1% (3rd; Screen 32.0) | $7.1B | parent probably N46 |
| Wafer bonder 27% | Wafer bonding and aligning tools (N10) | 25.6% (2nd; EV Group 47.9) | $665.7M | parent probably N69 |
| Wafer prober 38% (TechInsights) | Handlers and probers (N83) | 19.9% (1st) | $2.9B | ?parentNode=N78&selectedNode=N83 |

Affected: the "Who makes it" sentences citing p. 28 (23, 27, 15 and 91 percent), the `tel-tool-share` figure and the TEL keyFact.

### 5. ch 04 Lithography
- CSIS (24 Sept 2025): "even there its presence amounts to only four percent of the global market." Before: "holds about four percent". After: "holds only four percent".
- Card prices (Reuters, July 2026) unchanged and **unverified**: reuters.com returns 401 to scripts and the Wayback capture of the same URL (28 Sept 2026) is the DataDome block page.

### 6. ch 03 Chemicals, gases and photoresist
- SIA PAG case study (June 2023, 28 pp.) p. 22: "These 26 photoresists would need to receive full factory qualification"; "For materials that pass yield qualification on the first attempt, the overall timeline for qualification would be seven to 17 months." (p. 21: photoresist qualification requires "the most intensive and rigorous qualification standards".)
- `plain` and twin, before: "A chipmaker approves each formula for one factory and one product at a time. A new supplier has to earn that approval from scratch, so adding a second supplier takes years." After: "A chipmaker has to test and approve each new resist in its own factory before using it ([source](…#page=22)). Even a resist that passes the first time takes seven to 17 months to approve, the Semiconductor Industry Association wrote in 2023 ([source](…#page=22))."
- Left for the owner: the sentence before ("All of them have to be pure to about one stray metal atom in every trillion.") is an uncited figure; no source in the chapter states it.

### 7. ch 02 Silicon and wafers
- static.sse.com.cn still serves only the Alibaba WAF challenge, and both Wayback captures of each URL (2 and 7/8 Oct 2026) are the same challenge page. The same filings are on cninfo (found through cninfo's announcement query for 688783): prospectus `finalpage/2025-10-22/1224723727.PDF` (459 pp.) and 2025 annual report summary `finalpage/2026-04-21/1225128957.PDF` (15 pp.). All five figures verified; citations re-pointed to the cninfo copies with pages:
  - p. 138: "目前成规模国内厂商有 7 家" with a capacity table (万片/月, end of 2024) totalling "合计 294" (7 firms incl. 公司 71) → "seven Chinese firms, itself included" and "2.94 million wafers a month" verified.
  - p. 145: table "2024年月均出货量占比": 信越化学/SUMCO/环球晶圆/德国世创/SK Siltron 684, **79.08%**; 公司 超过 52, **6.01%**; 其他厂商 约 129, **14.91%**; source "根据 SEMI 统计的《WAFER MARKET MONITOR》…估算". The chapter had rounded these to "about 79", "about 6" and "about 15"; now "79.08 percent", "6.01 percent" and "14.91 percent". (The prospectus prose elsewhere says "约 80%", p. 24 and p. 42.)
  - Summary p. 8: "据 SEMI 预测，2025 年其占全球硅片出货面积的比重约为 78.8%" → "about 78.8 percent" verified. The keyFact's source URL moved to the cninfo copy too.
- **SUMCO** (AGM notice p. 24 prose, p. 26 table, million yen: net sales 409,670; operating profit 36,924 → 1,342; loss attributable to owners of parent (11,751)). Bullet before: "Sold ¥409.7 billion and still lost ¥11.8 billion, as operating profit fell from ¥36.9 billion to ¥1.3 billion". After: "Sold ¥409,670 million and still lost ¥11,751 million, as operating profit fell from ¥36,924 million to ¥1,342 million". keyFact: "¥409.7bn … ¥1.3bn from ¥36.9bn … ¥11.8bn" → "¥409,670m … ¥1,342m from ¥36,924m … ¥11,751m".

### 8. ch 01 Design and EDA
- The csis.org page is an abstract; the claims are in the full report it links ("Download the Full Report"): https://csis-website-prod.s3.amazonaws.com/s3fs-public/2025-10/251006_Reinsch_Semiconductor_Export_0.pdf (55 pp., same object as the linked `?VersionId=` URL).
  - p. 7: "Siemens EDA (a U.S.-based subsidiary of the German firm Siemens)".
  - p. 13 (sentence starts at the foot of p. 12): "only a few companies make EDA software that supports the entire chip design flow, which includes more than 40 steps in the design process. These companies, known as the 'big three'—Cadence (U.S.), Synopsys (U.S.), and Siemens (U.S./Germany)".
  - p. 33: "as of 2025, Chinese EDA tools were still far from replacing the full range of advanced capabilities U.S. firms offer, especially in areas like 5 and 3 nm chip design."
- The Siemens sentence was split because CSIS supports only its first clause. Before: "Siemens EDA is a US-based subsidiary of the German firm Siemens, so country shares that count each firm by its parent company's headquarters put its sales under Germany." After: "Siemens EDA is a US-based subsidiary of the German firm Siemens ([source](…#page=7)). So country shares that count each firm by its parent company's headquarters put its sales under Germany." The second sentence is an uncited explanation. The owner can keep it or cut it.
- The 40-step sentence → #page=13; both "far from replacing" sentences (body and Takeaways) → #page=33.

### 9. ch 16 Component costs
- Ibiden states no gross margin in any Q1 FY2026 document (tanshin 13 pp., outline 1 p., presentation 6 pp., Q&A 4 pp. checked). The outline (4 Aug 2026) gives operating profit 26,880 million yen "(21.8)" with "Note: ( ) shows net sales ratio"; the presentation shows "OPM 21.8%".
- Dropped from the gross-margin table (`| Ibiden | Substrates | June 2026 | 36.4% |`) and from the `gross-margins` figure; removed Ibiden's citation from the "Each figure comes from…" list; "The KLA and Ibiden releases give no percentage, so their figures are…" → "The KLA release gives no percentage, so its figure is…"; "…50.3 to 75.0 percent, substrates 36.4 percent, and assembly…" → "…50.3 to 75.0 percent, and assembly…". Added after the SK hynix sentence: "The substrate maker Ibiden gives no gross margin either, but its operating profit was 21.8 percent of net sales in the quarter to June 2026 ([source](https://www.ibiden.com/ir/items/outline2026Q1.pdf))."
- Same computed ratio as item 1, in the classes table: "KLA held about five times its nearest rival's share of these tools in 2025, by CSET's count." → "KLA held 56.8 percent of the market for these tools in 2025, by CSET's count ([source](ETO N60))."

### 10. Dates
- ch 02: "January 25, 2026" → "25 January 2026"; "signed August 6, 2026" → "signed 6 August 2026"; "from December 4, 2026" → "from 4 December 2026" (two places); "by January 20, 2029" → "by 20 January 2029". None was inside a quotation.
- ch 16 keyFact: "September 3, 2026" → "3 September 2026".

### ch 17 (same issues as items 3 and 4)
- "On 22 August 2025 the government converted $5.7 billion…" → "…the government agreed to convert $5.7 billion…" (Intel release: "agrees to purchase", "will be funded by").
- "At Tokyo Electron, China's share fell from 44.4 percent … to 34.1 percent" (p. 27, new equipment sales) → "China's share of new equipment sales fell…". The next sentence's 26.8 percent is from p. 5, a chart of net sales by region (Q4 FY2026: China 190.7 of 711.8 billion yen) and the transcript ("proportion of sales in China dropped to 26.8%"), so "the share dropped to" → "China's share of its sales dropped to".

## For the owner (not changed)
1. **ch 07 defects animation**: computed numbers, listed under item 1.
2. **ch 04 Reuters prices**: unverified (401, Wayback copy blocked too).
3. **ch 06 TEL Gartner shares**: CSET replacements in the table under item 4.
4. **ch 10 HBM shares**: 63.2/19.3/17.4 (card leaders, figure, oneLiner, Takeaways) and the 2024 and 1Q26 shares are IDC data via SK hynix's prospectus. IDC is on the same never-cite list as Gartner. This is the same "reseller figure quoted by a company" question as TEL's and KLA's Gartner figures.
5. **ch 16 KLA 61.4 percent** is computed the same way as Ibiden's (the chapter says so). KLA's Q4 FY26 shareholder letter states only a non-GAAP gross margin, 62.4 percent (PDF p. 2: "Non-GAAP gross margin was 62.4%"). Options: keep it, switch to the stated non-GAAP figure with a label, or drop it.
6. **ch 17 computed China shares**: "Against total net sales … it fell from 36.1 percent to 29.1 percent" is computed from ASML's 20-F R71 (China €10,195.1m of €28,262.9m in 2024, €9,519.7m of €32,667.3m in 2025). The china-share figure's label says "each China share computed from the filing's sales by region" (ASML, Applied Materials, Lam Research, Tokyo Electron).
7. **Data files I may not edit** that still carry the removed figures: `data/flashcards.json` (around lines 224, 230 and 243: "halving the defects raises the share of flawless chips from about half to about seven in ten"; "about five times the share of Applied Materials"; "about five times the share of its nearest rival"); `data/glossary.json` (around line 139: the 8 cm² halving example; around line 307: "The substrate maker Ibiden's was 36.4 percent" and KLA's 61.4); `data/suppliers.json` (around line 2475: KLA "about 5 times Applied Materials' share").
8. **ch 03 `plain`**: "pure to about one stray metal atom in every trillion" has no source.
9. **ch 09**: "The US government owns part of Intel." is uncited, and the deal source says only "agrees to purchase".
10. **Share card**: re-render ch 07 (oneLiner changed). No other oneLiner changed.

## New bibliography entries
```json
{
  "https://s25.q4cdn.com/621799436/files/doc_financials/2026/q1/Micron_Q1-2026-Prepared-Remarks.pdf": {
    "title": "Fiscal Q1 2026 Earnings Call Prepared Remarks",
    "publisher": "Micron Technology",
    "date": "2025-12-17",
    "type": "pdf",
    "accessed": "2026-10-20"
  },
  "https://www.ibiden.com/ir/items/outline2026Q1.pdf": {
    "title": "Outline of Consolidated Financial Results For the First Quarter Ended June 30, 2026",
    "publisher": "Ibiden",
    "date": "2026-08-04",
    "type": "pdf",
    "accessed": "2026-10-20"
  },
  "https://static.cninfo.com.cn/finalpage/2025-10-22/1224723727.PDF": {
    "title": "西安奕材首次公开发行股票并在科创板上市招股说明书",
    "publisher": "CNINFO",
    "date": "2025-10-22",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://static.cninfo.com.cn/finalpage/2026-04-21/1225128957.PDF": {
    "title": "西安奕斯伟材料科技股份有限公司2025年年度报告摘要",
    "publisher": "CNINFO",
    "date": "2026-04-21",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://csis-website-prod.s3.amazonaws.com/s3fs-public/2025-10/251006_Reinsch_Semiconductor_Export_0.pdf": {
    "title": "The Double-Edged Sword of Semiconductor Export Controls: Electronic Design Automation",
    "publisher": "Center for Strategic and International Studies",
    "date": "2025-10-06",
    "type": "report",
    "accessed": "2026-10-20"
  }
}
```
The two static.sse.com.cn entries, the SK hynix outlook entry and the Ibiden tanshin entry are no longer cited by these chapters (the tanshin may still be cited elsewhere). Hosts: q4cdn.com, ibiden.com, cninfo.com.cn tier A; csis-website-prod.s3.amazonaws.com was added to tier A by someone else during this run.

## Checks (final run)
- My validator: front matter parses in all 12 chapters; `plain` equals its twin in 01 to 10 and 16 (ch 17's `plain` unchanged and still present in the body); no semicolons left in card text; every card URL cited in its body; URL counts match sentence counts.
- `node build/build.js`: exit 0, "source tiers: … unclassified 0" once the CSIS host was classified.
- `check-speak`: no matches. `check-integrity`: exit 0, only the known "exposure row for Veeco Instruments has no supplier entry". `check-sources`: "2442 citations, all tier A or B".
- style-report: the new sentences are under 33 words except ch 17's Intel sentence (33 words, two words longer than before).

## Screenshots (`qa/round2/shots/content-fix-a/`, static chapter pages, dark default unless named -light, desktop 1366 or --mobile)
ch01-csis-desktop, ch01-csis-light, ch01-siemens-desktop, ch01-takeaways-desktop, ch02-eswin-desktop, ch02-eswin-capacity-desktop, ch02-wafer-share-desktop, ch02-sumco-desktop, ch02-dates-desktop, ch03-plain-desktop, ch03-plain-light, ch04-smee-desktop, ch06-chamber-desktop, ch06-tel-desktop, ch06-card-desktop, ch07-plain-desktop, ch07-plain-mobile-light, ch07-lead-desktop, ch07-lead-light, ch07-yield-desktop, ch07-camtek-desktop, ch07-skyverse-desktop, ch07-chokepoint-desktop, ch07-chokepoint-mobile, ch07-card-desktop, ch07-card-mobile, ch09-intel-desktop, ch09-takeaways-desktop, ch09-card-desktop, ch10-card-desktop, ch10-figure-desktop, ch10-hbm3e-desktop, ch10-takeaways-desktop, ch16-table-desktop, ch16-ibiden-desktop, ch16-figure-desktop, ch16-classes-desktop, ch16-classes-mobile, ch17-tel-desktop, ch17-intel-desktop.
