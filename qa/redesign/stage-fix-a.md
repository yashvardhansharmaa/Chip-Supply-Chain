# Final QA, section A: AI Chips data and sourcing (fix-a, 28 October 2026)

Branch `redesign-fixa`, cut from `redesign` at fceef96. Preview http://127.0.0.1:8781/. Before shots against 8766, after shots against 8781, in `qa/redesign/shots/fix-a/` (`sh qa/redesign/shots-fix-a.sh before|after <base>`). Everything fetched is in `MAIN/qa/final-qa/fix-a/fetched/` (generic user agent, no other header, no search engine).

## Findings

**A1 (blocker), B200 and B300 on one basis. Fixed.**
- The B200 is now per GPU in the GB200 NVL72 rack, as the B300 is in the GB300 NVL72 and Rubin in the Vera Rubin NVL72.
- Figures as Nvidia publishes them per GPU, in Table 2 of its Blackwell Ultra post: FP8 5,000, FP4 10,000, 192 GB, 8 TB/s, 1,200 W (Blackwell column). FP16 2,500 is Epoch AI's GB200 row, with Nvidia's GB200 NVL72 table (360 PFLOPS FP16 with sparsity across 72 GPUs, dense half) as its second mark.
- The B300's FP8, FP4, memory, bandwidth and power now cite the same Table 2 (Blackwell Ultra column), and its FP16 the GB300 table and Epoch's GB300 row.
- The card names the basis under the figures ("Figures are per GPU in the GB200 NVL72 rack."), from a new `basis` field. Rubin's basis line also gives SemiAnalysis's 1,800 W efficiency profile (A2).
- The HGX board figures (2,250, 4,500, 9,000, 1,000 W, 180 GB) stay in the B200 notes, as the precision note and notes now say.
- The B200 export row no longer computes "TPP near 36,000". It says its 5,000 TFLOPS FP8 puts TPP far above 21,000.
- Field chart checked. FP16 B200 and B300 both 2,500 (the MI455X's 5,033 stays the top, in wine). FP4 B200 10,000. Power top stays Rubin at 2,300 W. datacheck-chips confirms every chart at 1440 and 390.

**A2 (blocker), explicit sources. Fixed.**
- `sourceFor()` and the label keyword hints are gone from `src/app.js`, `build/modules/reference-pages.js` and `qa/redesign/datacheck-chips.js`.
- Each chip in `data/landscape.json` carries `cite`: the number of the source behind each figure and part line ("4, 12" is sources 4 and 12), and `cite.suppliers` by maker. A part no listed source states is left out of `cite` and shows the list mark "all". The rule is written at the head of `data/landscape-notes.md`.
- The card puts a mark on each of the six figures (on its label), on each part line and each about row. A comparison marks each figure after its value. "all" scrolls to the chip's Sources in place, so the address keeps its chips.
- `/chips/` marks every cell and memory maker by the same `cite`, several sources in one mark, apart by commas, and [all] where none is named.
- 540 marked parts: 474 carry named sources, 66 carry "all". Of 158 figures, 156 carry named sources. The two without are the H800's 3.35 TB/s and the A800's 2.039 TB/s, where Epoch records 3.36 and 2.04 and no listed source gives the figure shown.
- Every numeric mark was checked against the fetched text of its source (a verifier over the fetched sources, kept outside the repo). Pages that would not render to text (JS pages at Cerebras, hiascend, Microsoft's deep dive, OpenAI 403) keep the source their notes' sentence already cited.
- The named cases: Rubin's 2,300 W now cites SemiAnalysis [4], with the 1,800 W profile in its basis line and notes. "3NP (per SemiAnalysis)" cites SemiAnalysis [5]. The B300's 1,400 W cites the Blackwell Ultra post [7]. The H20's "built for" carries "all" and its NVLink line cites Epoch [2] (Epoch's own words). The H20's export row now cites the 8-K, the 10-K, the 2023 rule, SemiAnalysis and Nvidia's results.

**A3 (blocker), AMD HBM suppliers. Fixed.**
- MI355X: Micron, from Micron's HBM3E product page ("Micron HBM3E designed into AMD Instinct MI350 GPU and platform", the 36 GB 12-high part; AMD files the MI355X under the MI350 series). SK hynix and Samsung removed: no Tier A or B source found.
- MI455X: none named. The card says "The memory maker is not published", and the notes say AMD names no HBM supplier.
- The same rule on the other chips: the Ascend 910C keeps Samsung (SemiAnalysis: Huawei's stockpile came through Samsung) and drops SK hynix, which no listed source names.

**A4 (blocker), export rows. Fixed.**
- H100, A100, A800, H800 and MI300X lead with their status under the BIS rule effective 15 January 2026 (91 FR 1684, checked in the govinfo PDF): TPP under 21,000 and DRAM bandwidth under 6,500 GB/s, case by case for China and Macau, then their history.
- The rule covers only chips commercially available in the United States when it was published. The A800 and H800 rows say so, and that Nvidia built them for China, without judging whether they qualify.
- The H100 row says what it was before the rule (presumption of denial under 742.6(b)(10)).
- H20: the April 2025 requirement, then the August 2025 licenses (Nvidia's FY2026 10-K), then its design history.

**A5, wording. Fixed.**
- Huawei (910B, 910C, 950PR, 950DT) and Moore Threads now say what the Entity List does: a license for any item subject to the EAR, with a presumption of denial (84 FR 22961, effective 16 May 2019). SMIC's line gives its own policy (presumption of denial for items needed at 10 nm or below, effective 18 December 2020).
- H20 charges: "Nvidia said in April 2025 that it expected charges of up to about $5.5 billion ... It recorded a $4.5 billion charge in the quarter to 27 April 2025" (Nvidia's 28 May 2025 results, which also confirm 9 April 2025).
- H200: "First shipped Q3 2026" is gone. Availability now reads "Shipping in small volume to China under US licenses granted from February 2026". Nvidia's filing reports the shipments for its quarter to 26 July 2026, mostly calendar Q2, so Q3 was not supported, and no source dates the first licensed shipment.
- Rubin's FP16 is "under a quarter" of the FP8 rate (4 against 17.5 PFLOPS), in the precision note and both notes.
- The H100 note's "which is why" sentence is cut.
- The H20 row names the 2,400 TPP line in 3A090.b (checked in 88 FR, the October 2023 rule).

**A6, consistency. Fixed.**
- Rubin bandwidth: both right. 19.2 TB/s per GPU in the Vera Rubin NVL72 table, up to 22 TB/s peak in the architecture post and in Nvidia's HGX table for a Rubin GPU. The card shows the rack figure, and the notes say what each measures. Chapter 9's "up to 22 TB/s" is correct as written.
- Rubin cost: both right. $3.28 per GPU-hour is SemiAnalysis's capital cost alone (25 February 2026). $3.57 is its full cost of ownership with electricity and data center costs (23 July 2026), the figure chapter 15 gives. Both are dated on AI Chips now.
- Rubin CoWoS variant: no Tier A or B source names CoWoS-L for Rubin. SemiAnalysis says CoWoS. AI Chips keeps "CoWoS, variant not stated". Chapter 10's table row and the glossary's CoWoS entry ("CoWoS-L, used for Nvidia's Blackwell and Rubin") are section C's and remain unconfirmed for Rubin.
- B300 "CoWoS-L" had no source. It now reads "CoWoS, variant not stated", marked to Epoch's Blackwell cost model (CoWoS packaging spread across Blackwell units, Blackwell Ultra included).
- MI455X scale-out: Ethernet across racks (AMD datasheet and Helios blog), 600 GB/s peak per GPU and up to 43 TB/s per rack. AMD's product page labels that 600 GB/s link UALink, and the row says so.

**A7, the glossary's chip lines. Fixed** (`src/modules/lookup.js`).
- "Announced April 2024".
- The node alone where it names the foundry (no "TSMC TSMC").
- Memory type and capacity set apart ("HBM2E plus 96 MB on-die SRAM · 128 GB").
- Thousands grouped without rounding ("1,000 W").
- The semicolons in the status texts are gone from the data, and so are those in every displayed spec row (c2c, scale-up, node, package, memory type).
- The Glossary sheet's "Announced / shipping" reads "March 2024 / Q4 2024".

**A8, unsure items.**
- MI455X die count: AMD's datasheet counts 8 XCDs and 2 IODs. The count stays 10. The drawing showed 12 (two "fabric-and-cache dies" no current AMD source names), so those two are dropped (`landscape-layouts.json`).
- MI455X bandwidth: 23.3 TB/s confirmed (datasheet, product page). No change.
- H20 HBM maker (Reuters, July 2024, Samsung HBM3): Reuters refused the fetch (401). Unconfirmed, no change.
- H100 dates: Nvidia's release of 20 September 2022 confirms full production with partners' first products in October, and Epoch's sales methodology says "Started shipping by October 2022". Q4 2022 stays, now marked. The notes give both dates.
- MI455X "In production" beside "first shipped": AMD's 23 July 2026 release says Helios is in production and OpenAI expects it online from Q4 2026. The card now reads "In production since July 2026. OpenAI expects to bring Helios racks online from the fourth quarter of 2026", with no first-shipped date.

**Section C's hand-over: done.** `mm2` became mm² and "N x" became "N ×" across `landscape.json`, its notes and `landscape-layouts.json`. No "%", "bn" or hyphen ranges appear in the rows I rewrote.

**Found on the way.**
- TPU v4's notes said Google measured "minimum, mean and maximum draw of 90, 170 and 192 W". The ISCA paper's Table 4 gives 90 W at idle and 121/170/192 W. Fixed and cited.
- The B300 notes' Epoch HGX figures were out of date (270 GB). Epoch now records 7.75 TB/s and 1,100 W. Fixed.

## Sources added (all in `data/bibliography.json` where new, accessed 28 October 2026)
- Nvidia GB200 NVL72 spec table (nvidia.com, tier A). New to the bibliography.
- Nvidia HGX platform table, Rubin GPU column (nvidia.com, A). Already in the bibliography.
- Nvidia, 20 September 2022, Hopper in full production (nvidianews.nvidia.com, A). New.
- Nvidia, 28 May 2025, first-quarter fiscal 2026 results (nvidianews.nvidia.com, A). New.
- Nvidia Form 10-K, fiscal 2026 (sec.gov, A). Already in the bibliography.
- Federal Register, 15 January 2026, 91 FR 1684 (govinfo.gov, A). Already in the bibliography.
- Federal Register, 21 May 2019, Huawei on the Entity List (govinfo.gov, A). Already in the bibliography.
- Federal Register, 22 December 2020, SMIC on the Entity List (govinfo.gov, A). Already in the bibliography.
- Micron HBM3E product page (micron.com, A). Already in the bibliography.
- Epoch AI, B200 cost breakdown, added to the B300 (epoch.ai, A). Already in the bibliography.
- SemiAnalysis InferenceX, 23 July 2026, Vera Rubin against GB200 (semianalysis.com, B). Already in the bibliography.
- Two B300 sources that were missing from the bibliography: Samsung's Q3 2025 results and Nvidia's 30 October 2025 Samsung release (A).

## Unconfirmed
- The H20's August 2025 licenses rest on Nvidia's FY2026 10-K as the site's own timeline quotes it. sec.gov refused the generic agent (403), so I did not re-read the filing.
- Micron's investor-site releases (B200 [11], B300 [8], H200 [7]) and OpenAI's pages are behind bot checks. They were not re-read, and their marks are as before.
- The MI355X product page gives a 144 GB/s Infinity Fabric link, and the data's 153.6 GB/s is from the datasheet. Left as is, and reported here.
- The H800's first-shipped Q1 2023 (Epoch's database dates it March 2023) sits against Epoch's methodology, "late 2022". Left as is.
- The 66 "all" marks are listed by the data: the parts with no key in `cite`. The most common are "built for" (16), the availability line (12), the announcement month on `/chips/` (11) and the export rows of the chips not sold on the open market (9).

## Checks (all on the final build)
- `node build/build.js`: no warnings.
- check-speak: no matches. check-integrity: no problems (one warning, chapter 06, not mine). check-sources: 2,835 citations, all tier A or B. check-size: none over 5 MB. check-seo: no problems.
- `check-links --local http://127.0.0.1:8781`: 28 pages, 1,224 addresses, no broken links.
- `smoke.js --port 8791`: 47 page loads, no failures.
- check-perchapter: all 336 pass. interact-chapter: all passed. stage-chapters: 10 of 10. check-cites: 3,300 marks, 0 problems. check-figs: 112 of 112. interact-chips: all 93 pass.
- datacheck-chips: 1,512 values at 1440 and 390, 0 mismatches (1,322 before; it now also checks each figure's mark, each comparison cell's mark and the basis lines).
- **Check updated:** `qa/redesign/datacheck-chips.js`. It read the expected figures source from the label hints in `Landscape.SRC`, which no longer exist. It now reads each figure's mark from the data's `cite`, the basis line from `basis`, and strips the marks from the values it compares. Outputs are in `qa/redesign/fixa-checks/`.
