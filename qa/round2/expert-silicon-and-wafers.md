# Expert review, ch 02 Silicon and Wafers (20 October 2026)

Reviewer: materials scientist, silicon wafers (Czochralski growth, slicing and polishing, epitaxy, SOI).
Scope: `content/02-silicon-and-wafers.md` (edited), flashcards, glossary terms and the `silicon` animation (proposals only).
I re-downloaded and opened every source the chapter cites today (copies in `qa/round2/scratch/expert-silicon-and-wafers/`). Working notes: `qa/round2/expert-silicon-and-wafers-notes.md`.

Counts: 7 errors fixed, 1 sentence simplified, 0 sources replaced (1 claim newly attributed, 3 citations added from sources the chapter already uses), 0 links fixed (none broken).

## 1. Changes made in `content/02-silicon-and-wafers.md`

| # | Where | Before | After | Why | Source (quote, page) |
|---|---|---|---|---|---|
| 1 | `plain` and its twin, first paragraph of How it works | Making one starts with sand, which is silicon bound to oxygen. | Making one starts with quartz rock, which is silicon bound to oxygen ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf)). | Wafer silicon is smelted from lump quartz or quartzite. Sand is too fine for the arc furnace. The chapter's next paragraph already says quartzite, so the two paragraphs disagreed. | USGS Mineral Commodity Summaries 2026, Silicon (2 pp.): "The source of the silicon is silica in various natural forms, such as quartzite." |
| 2 | How it works, para 2 | …and distill it, because the impurities boil at other temperatures and stay behind. | …and distill it, because the impurities boil at other temperatures and separate out. | Distilling trichlorosilane removes both lighter impurities (boron chloride boils off first) and heavier ones (metal chlorides stay in the still). "Stay behind" describes only the second group. | No new claim. The process description is unchanged. |
| 3 | Variants, Polished versus epitaxial | The transistors are built in that layer, so its quality sets the lowest leakage the chip can reach. It also sets the chip's risk of latch-up, an unintended short circuit between power and ground. | The transistors are built in that layer, so flaws in it can make them leak current. SUMCO says an epitaxial wafer suits customers who need a near-perfect crystal or layers that differ in electrical resistance ([source](https://www.sumcosi.com/english/products/process/)). | Overstated. Transistor design sets most of a modern chip's leakage (the site says so in ch 8), so the wafer does not set "the lowest leakage". Latch-up protection comes from a lightly doped layer grown on a heavily doped wafer, not from the layer's "quality", and it applies only to that kind of epi wafer. The replacement keeps the leakage link and adds the maker's own reason, with a source. | SUMCO production processes page: "An epitaxial wafer is a high-quality wafer for customers requiring an exceptionally perfect crystal structure or multiple layers having different resistivity." |
| 4 | Variants, Silicon on insulator | Nearly all SOI wafers are made with Soitec's Smart Cut process. | Soitec says nearly all SOI wafers sold worldwide are made with its Smart Cut process. | The market claim comes from Soitec itself, so the sentence now names it as Soitec's claim. Same source. The claim is broadly right because SEH, GlobalWafers and Simgui license Smart Cut. | soitec.com/home/group: Smart Cut "today is used to make nearly all SOI wafers sold in the world." |
| 5 | Who makes it, METI paragraph | The deck prints only Japan's 53 percent, so the other shares are read off its chart (p. 8). | The chart prints only Japan's 53 percent, so the other shares are read off it (p. 8). An earlier page of the deck prints Europe's share as 10 percent (p. 4). | The old wording was wrong about the source. Page 4 of the same deck prints the 2023 wafer split as 53 / 10 / 37 (Japan / Europe / all others) from the same Fuji Keizai survey (2024 edition). One read-off figure now has a printed source. | METI deck, 23 Dec 2025, p. 4: wafer bar "53 / 10 / 37", footnote 6 "2023年100%比 (富士経済「半導体材料市場の現状と将来展望 2024年」)". p. 8: only Japan's segment is labeled. My pixel measurement of the p. 8 bar gives Europe 10.0, South Korea 13.0, Taiwan 19.0, Other 5.0, which matches the chart data. |
| 5a | `figures[1].source.label` | …Japan's share is printed, the others are read off METI's chart | …Japan's and Europe's shares are printed, the others are read off METI's chart | Follows from row 5. | Same. |
| 6 | Who makes it, lead-in to the results list | …strong AI demand and a slump in demand for chips made on older, mature nodes. | …strong AI demand and weak demand for chips made on older, mature nodes. | The sources call 2025 mature-node demand sluggish or slow. The slump was 2023 to 2024. | SUMCO AGM notice p. 24: "demand for consumer, industrial, and automotive uses remained sluggish". SEMI 10 Feb 2026: "slow momentum in traditional semiconductor applications". |
| 7 | The chokepoint, first sentence | …in 2019 its firms had almost no share of the wafer market. | …in 2019 its firms had only a small share of the wafer market. | The next sentence gives "under 5 percent" of the market. "Almost no share" fits only the 300 mm figure (under 1 percent). | CSET Jan 2021, p. 55, Table 18: "<5% (<1% for 300 mm wafers)". |
| 8 | `keyFacts[5]` | Electronic-grade silicon is a $1.4bn market with five major suppliers… | Electronic-grade silicon was a $1.4bn market in 2025, with five major suppliers… | The figure had no year (dating rule). | Siltronic investor presentation Apr 2026, p. 5: "USD 1.4 bn … (figures for 2025)". |
| 9 | Who makes it, Shin-Etsu bullet (simplified) | **Shin-Etsu.** Its parent's electronics materials segment sold ¥1,015.7 billion… | **Shin-Etsu.** Shin-Etsu Chemical's electronics materials segment, which includes its wafer business, sold ¥1,015.7 billion… | Under the bold lead "Shin-Etsu", "Its parent's" does not say whose parent. The card's "Shin-Etsu Handotai … Its parent's" is clear and stays. | Shin-Etsu results, p. 6 (¥1,015.7bn, +9%). p. 20 lists "Semiconductor silicon" in the segment. |

Unchanged after checking: `plain` = twin (verified by script); no semicolons or em dashes in the prose; one citation per sentence; all `#page=` values right.

## 2. Every figure checked against its source (all match)
- **SEMI via PR Newswire, 10 Feb 2026:** shipments up 5.8% to 12,973 MSI; revenue down 1.2% to $11.4bn; epi for logic and polished wafers for HBM; revenue softness "mostly attributed" to traditional applications. The sub-3nm quote is from SEMI SMG chairman Ginji Yada. The release says wafers are "produced in diameters of up to 300 mm".
- **Nvidia:** Data Center revenue $193.7bn for the fiscal year to 25 January 2026.
- **SUMCO process page:** "no more than a few parts per billion (ppb)"; about 1,420 ℃ for the melt; about 1,200 ℃ for epi; lapping and colloidal-silica polishing.
- **Siltronic, April 2026 presentation:** p. 5 ($1.4bn and $11.4bn, five suppliers); p. 6 ("Around 75%", "Only western based", based on Q1 to Q3 2025); p. 12 ("Key prime customer qualifications completed in July 2025").
- **Siltronic press release:** sales €1,346.7m; result for the period −€77.9m; capital spending €369.1m; "focus remained on the new fab in Singapore".
- **CSET, January 2021:**
  - p. 55: Table 18.
  - p. 57: 99.7%, "considerable tacit know-how", five Chinese 300 mm firms.
  - p. 58: 18% and 12%.
  - p. 80: note 111 (2002; 50% against 25%).
  - Data "current as of 2019".
- **Eswin prospectus (459 pp.):**
  - p. 138: seven firms, 294 (10,000 wafers a month) at end-2024.
  - p. 145: 79.08 / 6.01 / 14.91, estimated from SEMI's Wafer Market Monitor.
  - The prose elsewhere says "约 6%", so the flashcard's "about 6 percent" is as filed.
- **Eswin 2025 summary, p. 8:** SEMI forecast 300 mm at about 78.8% of area.
- **Eswin H1 2026 report, p. 18:** "约 7.7%", "全球第六".
- **Shin-Etsu:** p. 6 and p. 20.
- **SUMCO AGM notice:** p. 24 and p. 26 (409,670; 36,924 → 1,342; loss 11,751).
- **GlobalWafers:** NT$60.6bn, −3.24% YoY. May 2025: US$3.5bn; "first production line of its kind built in the United States in over 20 years"; "intention to expand … by another $4 billion"; phases 3 and 4.
- **NIST, 17 Dec 2024:** up to $406m to GWA in Texas and MEMC in Missouri.
- **USGS MYB China 2023, p. 7:** 1.50 Mt; about 93% of world output; 98% solar-grade and 2% electronic-grade.
- **Proclamation 11052:**
  - para 7: the 2.4 percent finding.
  - (1)(a)(ii): $100/kg for ingots and wafers.
  - (2) and (4): 4 December 2026; extra 15%.
  - (6): construction by 20 January 2029; equipment and Covered Products without section 232 duties.
- **BIS stockpiling rule, 24 Sep 2026:** lists 3818.00.0040.
- **HTS (REST API):** 3818.00.00.40 sits under "Monocrystalline silicon wafers, doped:" and is "Round (circular) shaped".

## 3. Newer releases (no text change needed)
- **Siltronic investor presentation, 11 September 2026:** `https://www.siltronic.com/fileadmin/investorrelations/2026/Q2/20260911_SiltronicInvestorPresentation.pdf` (34 pp.).
  - p. 5 repeats "USD 1.4 bn", "USD 11.4 bn" and "5 major suppliers".
  - p. 6 repeats "Around 75% of the market is served by the Top 5", with the same Q1 to Q3 2025 basis.
  - The Singapore slide (p. 13) now reads "Fab operating as planned and serving Leading Edge customers" and drops the July 2025 qualification line. The April citation stays valid as a dated statement. The owner may re-point to the September deck later. Nothing in the text is wrong.
- **USGS:** no 2024 China yearbook yet (myb3-2024-china.pdf returns 404).
- **Federal Register:** a search since 1 August 2026 finds no new Section 232 polysilicon documents after the 24 September rule.

## 4. Links
All 21 `links.json` entries for this chapter are `ok`. I fetched every one of them today: each returned 200 with the expected document, and the cninfo PDFs match the copies content-fix-a used. Nothing was broken, so nothing was fixed. No CAPTCHA was met, and no personal data was sent.

## 5. Proposals for shared files (exact before and after)

### Animation `silicon`: `media/silicon.json` and the `STEPS` array in `animations/silicon.html` (same strings in both)
The Refine caption contradicts the chapter on the same page. The chapter says "no more than a few parts per billion" (SUMCO). The caption says fewer than 1 in 100 billion, which is a few hundred times purer. It is also false if carbon and oxygen are counted: semiconductor polysilicon carries those at parts-per-billion levels. "Flat to within a few atoms" is wrong too. Flatness is specified in tens of nanometers, which is about a hundred atomic layers. Siltronic's April 2026 deck, p. 18, says: "20 nm on a wafer are equivalent to the height of a leaf on the surface of Lake Chiemsee". A few atoms describes surface roughness, not flatness.
- Refine. Before: "Silicon starts as sand and rock. It is refined into rods so pure that, of every hundred billion atoms, fewer than one is anything else." After: "Silicon starts as quartz rock. It is refined into rods so pure that metal impurities are no more than a few parts per billion."
- Polish. Before: "Each disc is ground, etched and polished until it is flat to within a few atoms, right out to the edge." After: "Each disc is ground, etched and polished to a mirror finish, flat right out to the edge."
- `animations/silicon.html` line 99: `label('Sand and rock', …)` → `label('Quartz rock', …)`.
- Line 182: `'Polished flat to within a few atoms'` → `'Polished to a mirror finish'`.
- Line 186: `readout(ctx, 96, '1', 'in 100 billion', 'Atoms that are not silicon', …)` → `readout(ctx, 96, 'A few', 'ppb', 'Metal impurities, parts per billion', …)`. This fits: x 520 plus about 210 px, inside 760.
- Header comment, lines 8 to 13, to match the new wording. The comment says the facts come from ch 2's How it works.

### Glossary (`data/glossary.json`)
- `epitaxy` `why`. Before: "The quality of that layer sets how much current the chip leaks. The industry association SEMI credits…" After: "Flaws in that layer can make the transistors leak current. The industry association SEMI credits…" (the rest unchanged). Reason: same as change 3.
- `chip` `plain`, optional. Before: "…that carries a complete electronic circuit made of billions of transistors." After: "…that carries a complete electronic circuit, often made of billions of transistors." Reason: many chips have far fewer.
- `wafer` `plain`, optional. Before: "…that chips are built on, 300 millimeters across." After: "…that chips are built on, 300 millimeters across for advanced chips." Reason: 200 mm wafers are still made, and the `300 mm` entry says so.

### Flashcards
No change. All four cards and the takeaways match the sources, and "about 6 percent" is the prospectus's own prose figure.

## 6. Questions for the owner
1. **"From sand to wafer".** The figure title (`figures[0].title`) and the animation's `<title>` still say "sand". It is a well-known phrase and the owner's framing, so I left the title alone. If the animation proposal is applied, "From quartz to wafer" would match the new first caption.
2. **Latch-up.** I dropped it from change 3 because the old mechanism was wrong. If the owner wants the term kept, this uncited sentence is correct: "On some epitaxial wafers, a lightly doped layer grown on a heavily doped base also helps prevent latch-up, an unintended short circuit between power and ground."
3. **Specimen neck.** The `specimenCaption` and the drawing give a neck "about 10 mm wide". Dash necks on 300 mm crystals are usually about 3 to 6 mm, and Siltronic's site calls the seed "pencil-thin". I found no allowed source with a number, so I left it. The owner may prefer "a neck a few millimeters wide", which would mean redrawing the specimen (`specimens/boule-and-wafer.js`, r 0.0052).
4. **Relayed market research.** The METI chart relays Fuji Keizai, a market-research firm. It is already labeled "relayed" in the matrix. Siltronic's p. 5 source line also lists TechInsights next to SEMI SMG and Siltronic Marketing. I kept both under the existing practice. They are flagged here only because the brief asks.
5. **A tempting sum.** USGS's 2% electronic-grade share of China's 1.50 Mt, set beside Commerce's 2.4% world share, invites readers to work out that China makes most of the world's electronic-grade polysilicon. That conclusion is probably wrong, because China's "electronic-grade" category likely includes material below 300 mm chip grade. The chapter avoids the sum and says the figures "alone do not show" chip use. I left it as is.

## 7. New bibliography entries
None. Every URL I added is already in `data/bibliography.json`: the USGS MCS silicon PDF, the METI deck (bibliography key without the fragment) and the SUMCO process page.

## 8. Check outputs (run once, after all edits)
`node build/build.js` exited 0 with nothing on stderr. `check-speak`: no matches. `check-integrity`: only the known warning "exposure row for Veeco Instruments has no supplier entry". `check-sources`: 2,464 citations, all tier A or B. The static page `http://127.0.0.1:8765/silicon-and-wafers/` shows every change, and the source list shows METI "p. 4".
