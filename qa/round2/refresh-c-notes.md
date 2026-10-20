# refresh-c notes (20 October 2026)

Task: bring newer figures and statements from the expert reports into ch 10, 11, 12, 5 and 1, each checked in its source. Downloads in `qa/round2/scratch/refresh-c/`. All edits done with the Edit tool. No data/*.json file touched. No oneLiner changed.

## Progress
- [x] Read RULES, SCHEMA, writing-well, five expert reports
- [x] Sources opened (see evidence)
- [x] Edits in ch 11, 12, 5, 1, 10
- [x] Data-file proposals
- [x] Checks

## Changes made

### Chapter 11, `content/11-advanced-packaging.md`
1. **The chokepoint, end of the CSET paragraph.**
   - Before: "In 2024 Chinese firms had 7 percent of the market for advanced packaging fabrication tools, against 65 percent for US firms and 15 percent for Japanese firms ([CSET article])."
   - After: "In 2024 Chinese firms had 7 percent of the market for advanced packaging fabrication tools ([CSET article]). In 2025 they had 5.3 percent of the $6.2 billion world market for these tools, against 65.8 percent for US firms and 15.3 percent for Japanese firms, by CSET's analysis of TechInsights data ([source](https://chipexplorer.eto.tech/?parentNode=N69&selectedNode=N109))."
   - The 2024 sentence stays because the figure `china-backend-tools` (titled 2024, CSET article) sits at the top of the section and shows 7.
2. **Takeaways.**
   - Before: "But in 2024 Chinese firms had 7 percent of the market for advanced packaging fabrication tools, against 65 percent for US firms, by CSET's analysis of TechInsights data ([CSET article])."
   - After: "But in 2025 Chinese firms had 5.3 percent of the market for advanced packaging fabrication tools, against 65.8 percent for US firms, by CSET's analysis of TechInsights data ([ETO N109])."
3. **Card `chinaStatus` and `chinaSources`.**
   - Before: "Between 2019 and 2024, Chinese firms gained 5 percentage points of share in test tools and 4 points in fabrication tools built for advanced packaging, by CSET's analysis of TechInsights data. But they lost share in bonding and other conventional assembly and packaging tools." Sources: [CSET, CSET].
   - After: "Chinese firms had 5.3 percent of the market for fabrication tools built for advanced packaging in 2025, by CSET's analysis of TechInsights data. Between 2019 and 2024 they gained 5 percentage points of share in test tools but lost share in bonding and other conventional assembly and packaging tools." Sources: [ETO N109, CSET].
   - Why: the "gained 4 points in fabrication tools" was the latest status on the card, and the 2025 share (5.3) is below CSET's 2024 figure (7). Both card URLs are cited in the body for the same facts.
- Left as is: figure `china-backend-tools` ("China-based suppliers' share of selected tool segments, 2024": linear and discrete test 69, burn-in 9, advanced packaging fabrication tools 7, SoC test 5, CSET article). It is dated 2024 and consistent with its source. ETO's 2025 data has burn-in 8.5, SoC test 7.7 and advanced packaging fabrication tools 5.3, but linear and discrete test only for 2021 (59.0), and each value sits on a different chipexplorer page, while a figure takes one URL. Main session may want a 2025 version with three bars and the ETO dataset as source.

### Chapter 12, `content/12-substrates-and-pcbs.md`
4. **The materials underneath, Nittobo paragraph (added at end).** "In May 2026 it forecast capital investment of JPY 45,000 million for the year to March 2027, up from JPY 21,702 million in the year to March 2026 ([source](https://ssl4.eir-parts.net/doc/3110/ir_material_for_fiscal_ym2/202884/00.pdf#page=5))." Figures copied as the table states them ("Millions of yen").
5. **The materials underneath, new paragraph.** The January 2026 Nikkei sentence moves to its own paragraph, followed by: "In August 2026 Ibiden, a Japanese substrate maker, said it had used only two glass cloth suppliers, in Japan and Taiwan, but now had prospects of a third and fourth for mass production ([Ibiden Q&A])." and "Because a Japanese supplier also plans to add capacity, Ibiden said it expected its material procurement risks to decrease ([Ibiden Q&A])." I did not use the expert's draft ("said its outlook for glass cloth supply had improved") because "improved" is the questioner's word, not Ibiden's.
6. **Who makes it, Ibiden bullet.**
   - Before: "It planned mass production from fiscal 2027 ([Feb 2026 notice])."
   - After: "In August 2026 it said the Gama plant was scheduled to start operating in stages from the end of fiscal 2027 and to add to its results from fiscal 2028 ([Ibiden Q&A])."
7. **The chokepoint, after the first sentence (added).** "In August 2026 Ibiden said that, with supply short across the industry, the average price of package substrates had risen more than it expected ([Ibiden Q&A])."
8. **Takeaways (added after the Nikkei sentence).** "In August 2026 Ibiden said it had prospects of a third and fourth glass cloth supplier and expected its material procurement risks to decrease ([Ibiden Q&A])."
- Left as is: keyFact on Nittobo's JPY 80 billion plan (still true as the plan), card cost slot (open decision).

### Chapter 5, `content/05-photomasks-and-pellicles.md`
9. **Pellicles, Mitsui paragraph (added after the 2024 plant sentence).** "In December 2025 Mitsui Chemicals said the plant was scheduled for completion in its fiscal 2025, in line with its initial plan ([source](https://jp.mitsuichemicals.com/content/dam/mitsuichemicals/sites/mci/documents/release/2025/event_251217e.pdf#page=31))."
- **Hoya Singapore plant: not added.** The chapter does not discuss Hoya's capacity anywhere (Hoya appears only for its share, multi-sourcing and as a Photronics competitor), so the brief's condition is not met. Ready sentence if the owner wants it, for Blanks after the Hoya share sentence: "Hoya said in its 2026 integrated report that it would build a new mask blank plant next to its existing one in Singapore, due to start operating in its fiscal 2028 with an initial investment of about ¥42 billion ([source](https://www.hoya.com/ir/2026/en/review/it.html))." Source: "HOYA has decided to construct a new plant adjacent to its existing facility in Singapore. The new plant is scheduled to commence operations in FY28, with an initial investment of approximately 42 billion yen." (The page gives the reason as expected medium-term growth above 10 percent for EUV mask blanks.)

### Chapter 1, `content/01-design-and-eda.md`
10. **Merchant GPU versus custom ASIC.**
   - Before: "Google's seventh-generation tensor processing unit, Ironwood, carries 192 GB of memory per chip, six times its predecessor's, and delivers twice the performance per watt ([Ironwood post])."
   - After: "Ironwood, the seventh-generation tensor processing unit (TPU) Google announced in April 2025, carries 192 GB of memory per chip, six times its predecessor's, and delivers twice the performance per watt ([Ironwood post]). In April 2026 Google announced its eighth generation as two chips, the TPU 8t for training and the TPU 8i for inference, with up to twice Ironwood's performance per watt ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/eighth-generation-tpu-agentic-era/))."
   - The undated present tense read as the current generation. The eighth-generation URL is already in bibliography.json.

### Chapter 10, `content/10-memory-and-hbm.md`
11. **HBM4 section (added after Micron's speed sentence).** "Micron says it began volume production of its 36 GB twelve-high HBM4 in fiscal 2026 and expects to ramp volume of HBM4E, the next generation, in calendar 2027 ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000023/mu-20260903.htm))." The 10-K says "All period references are to our fiscal periods unless otherwise indicated", so "In 2026" is fiscal 2026 (ended 3 September 2026). URL already in bibliography.json.
12. **The chokepoint, CXMT paragraph (added).** "In June 2026 SemiAnalysis judged that CXMT was still struggling to stabilize supply of eight-high HBM3, with even greater challenges at twelve-high ([source](https://newsletter.semianalysis.com/p/chinas-cxmt-is-set-to-challenge-dram))."
13. **Takeaways (added at end).** "In June 2026 SemiAnalysis judged that CXMT was still struggling to stabilize supply of eight-high HBM3 ([same URL])."
- Left as is: card `chinaStatus` (IFP's 2025 estimate and Huawei's September 2025 statement are true for their dates and do not state the old 2026 plan). Option for the owner: add the SemiAnalysis sentence there as a third sentence.

## Source evidence
- **ETO / CSET**, open data `raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv` (downloaded 20 Oct 2026): `USA,P1,Fabrication tools (for advanced packaging),N109,65.8,2025`, `JPN … 15.3,2025`, `CHN … 5.3,2025`, source "CSET analysis of TechInsights data (2025). Data used for analysis were published by TechInsights on July 3, 2026." `inputs.csv` N109: "$6.2 billion (2025)". `sequence.csv`: N109's parent is N69, so the page is `?parentNode=N69&selectedNode=N109`. Cross-check: the same file gives Disco 87.0 for N71 (2025), which matches the chapter's existing citation of the live site.
- **SemiAnalysis**, "China's CXMT Is Set to Challenge DRAM Incumbents", 23 Jun 2026 (free part of a paid post): "On technology readiness, we believe CXMT is still struggling to stabilize supply for HBM3 8-hi, with even greater challenges in 12-hi."
- **Micron 10-K for fiscal 2026** (filed 9 Oct 2026): "In 2026, we began volume production of our HBM4 36GB 12-high … and we delivered samples of HBM4 48GB 16-high to multiple key customers" and "Development of HBM4E, our next-generation HBM product leveraging our 1γ DRAM technology node, is well underway, and we expect to ramp volume in calendar 2027." sec.gov returned 403 ("Undeclared Automated Tool") to every request today (five tries, spaced up to 45 seconds) and the raw Wayback copy returned 503. I read the filing from the copy the memory expert downloaded from sec.gov this morning (`qa/round2/scratch/expert-memory-and-hbm/mu-10k-fy26.htm`, 2.06 MB, Workiva XBRL, "For the fiscal year ended September 3, 2026").
- **Ibiden Q&A**, 1st quarter of the year ending 31 March 2027, event 5 Aug 2026 (4 pp., so no page fragment). Glass cloth: "Previously, there were only two suppliers in Japan and Taiwan, but we now have prospects for using a third and fourth supplier for mass production. Furthermore, a Japanese supplier plans to increase production capacity until the next fiscal year, so we expect material procurement risks to decrease." Prices: "against the backdrop of an industry-wide supply shortage, the average price of IC package substrates themselves has risen more than expected." Gama: "The Gama plant is scheduled to start sequential operation from the end of FY2027 and contribute to performance from FY2028." (February notice: "Sequential operation and planned commencement of mass production from fiscal year 2027".)
- **Nittobo**, Consolidated Financial Results for the fiscal year ended 31 March 2026, 12 May 2026 (16 pp.), p. 5: "Capital investment (Millions of yen) 21,702 [year ended March 31, 2026] 45,000 [year ending March 31, 2027, forecast]".
- **Mitsui Chemicals**, Business Strategy Presentation (L&HC, Mobility, ICT), 17 Dec 2025 (37 pp.), p. 31: "Installing facilities for mass production of CNT pellicles at the Iwakuni-Ohtake Works ⇒ Scheduled for completion in FY25, in line with the initial plan".
- **Google**, "Our eighth generation TPUs: two chips for the agentic era", 22 Apr 2026: "two distinct, purpose-built architectures for training and inference: TPU 8t and TPU 8i" and "TPU 8t and TPU 8i deliver up to two times better performance-per-watt over the previous generation, Ironwood." Ironwood post dated 9 Apr 2025: "Ironwood offers 192 GB per chip, 6x that of Trillium"; "Ironwood perf/watt is 2x relative to Trillium".

## Proposals for data files (main session)
1. `data/glossary.json`, "TPU".
   - plain. Before: "Google's own AI chip, designed in-house for its data centers and cloud service. The seventh generation is called Ironwood." After: "Google's own AI chip, designed in-house for its data centers and cloud service. Its eighth generation, announced in April 2026, is split into two chips, the TPU 8t for training and the TPU 8i for inference."
   - why. Before: "It shows that a large buyer can design its own alternative to chips sold on the open market. Ironwood carries 192 GB of memory per chip, six times its predecessor's, with twice the performance per watt." After: "It shows that a large buyer can design its own alternative to chips sold on the open market. Ironwood, the seventh generation, carries 192 GB of memory per chip, six times its predecessor's. Google says the TPU 8t and TPU 8i deliver up to twice Ironwood's performance per watt."
2. `data/suppliers.json`, Google `role`. Before: "Designs the Tensor Processing Unit (TPU), now at the v7 Ironwood generation. It uses TPUs …" After: "Designs the Tensor Processing Unit (TPU), and announced the eighth generation, the TPU 8t and TPU 8i, in April 2026. It uses TPUs …" (rest unchanged).
3. `data/suppliers.json`, Ibiden `role` (optional; older than the February 2026 notice). Before: "… It supplies substrates for large AI packages and is expanding capacity at its Ono plant." After: "… It supplies substrates for large AI packages and is expanding capacity, first mainly at its Gama plant, which it said in August 2026 would start operating in stages from the end of fiscal 2027."
4. Flashcards: no card in the five chapters repeats an old figure or status changed here (checked memory-and-hbm, advanced-packaging, substrates-and-pcbs, photomasks-and-pellicles, design-and-eda). Glossary "glass cloth" and suppliers Nittobo, Mitsui Chemicals, Hoya, CXMT and Micron hold nothing that is now wrong.
5. Outside my files: ch 14 and ch 15 use Ironwood as an example (rack wiring; twice Trillium's performance per watt). Neither calls it the latest. Ch 15's "Chip efficiency is still improving" sentence could use the eighth-generation figure if the owner wants the newest example.

## New bibliography entries
```json
{
  "https://chipexplorer.eto.tech/?parentNode=N69&selectedNode=N109": {
    "title": "Supply Chain Explorer: Advanced Chips",
    "publisher": "Emerging Technology Observatory (ETO)",
    "type": "page",
    "accessed": "2026-10-20"
  },
  "https://newsletter.semianalysis.com/p/chinas-cxmt-is-set-to-challenge-dram": {
    "title": "China's CXMT Is Set to Challenge DRAM Incumbents",
    "publisher": "SemiAnalysis",
    "date": "2026-06-23",
    "type": "article",
    "accessed": "2026-10-20"
  },
  "https://www.ibiden.com/ir/items/en_QA_FY2026Q1.pdf": {
    "title": "Ibiden, questions and answers from the financial presentation for the first quarter of the year ending 31 March 2027",
    "publisher": "Ibiden",
    "date": "2026-08-05",
    "type": "pdf",
    "accessed": "2026-10-20"
  },
  "https://ssl4.eir-parts.net/doc/3110/ir_material_for_fiscal_ym2/202884/00.pdf": {
    "title": "Consolidated Financial Results for the Fiscal Year Ended March 31, 2026",
    "publisher": "Nitto Boseki (Nittobo)",
    "date": "2026-05-12",
    "type": "pdf",
    "accessed": "2026-10-20"
  },
  "https://jp.mitsuichemicals.com/content/dam/mitsuichemicals/sites/mci/documents/release/2025/event_251217e.pdf": {
    "title": "Business Strategy Presentation (L&HC, Mobility, ICT) in December 2025",
    "publisher": "Mitsui Chemicals",
    "date": "2025-12-17",
    "type": "pdf",
    "accessed": "2026-10-20"
  }
}
```
The ETO entry has no date, like the other 23 chipexplorer entries. Already in the bibliography: the Micron FY2026 10-K, Google's eighth-generation TPU post, HOYA IR 2026.

## Checks (20 October 2026, after the last edit)
- `node build/build.js`: exit 0. "01 design-and-eda: 2262 words, 30 sources", "05 photomasks-and-pellicles: 2011 words, 33 sources", "10 memory-and-hbm: 1891 words, 24 sources", "11 advanced-packaging: 2097 words, 32 sources", "12 substrates-and-pcbs: 1912 words, 46 sources", all "(D 0, ? 0)"; "source tiers: A 622 · B 31 · disallowed 0 · unclassified 0". No warnings for these chapters.
- `check-speak`: "no matches". `check-integrity`: only the known "exposure row for Veeco Instruments has no supplier entry". `check-sources`: "2535 citations, all tier A or B".
- Own checks: front matter of all five files parses, `plain` equals the first How it works paragraph, every card URL is cited in its body. Rebuilt static pages show the new text (for example "5.3 percent" three times on /advanced-packaging/, the Gama sentence on /substrates-and-pcbs/). The new titles show once the bibliography entries above are merged.
