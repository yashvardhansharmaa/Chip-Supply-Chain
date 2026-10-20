# pages-b notes (20 October 2026)

Scope: every body citation into a `.pdf` URL in content/09 to content/17 (front matter skipped). Output: `qa/round2/pages/<stem>.json` per chapter (SCHEMA section 2), plus an empty `[]` for ch 10, which has no PDF citations. No chapter, data or code file was edited.

## Summary

| Chapter | PDF citations | Page found | Skipped (PDF under 10 pages) | Figure not in PDF |
|---|---|---|---|---|
| 09 Foundries and fabs | 9 | 9 | 0 | 0 |
| 10 Memory and HBM | 0 | 0 | 0 | 0 |
| 11 Advanced packaging | 16 | 13 | 3 (Intel Foveros brief, 4 pp.) | 0 |
| 12 Substrates and PCBs | 43 | 34 | 9 (Intel glass release 7 pp.; Ibiden Q&A 4 pp. x3; Unimicron Q2 2026 9 pp.; Fujitsu 2 pp.; Shinko 3 pp. x3) | 0 |
| 13 Test and assembly | 12 | 12 | 0 | 0 |
| 14 Systems and networking | 8 | 4 | 4 (USGS indium, 2 pp.) | 0 |
| 15 Data centers and power | 15 | 15 | 0 | 0 |
| 16 Component costs | 4 | 3 | 1 (WSTS release, 2 pp.) | 0 |
| 17 Geopolitics | 13 | 12 | 1 (MITI statement, 1 p.) | 0 |
| **Total** | **120** | **102** | **18** | **0** |

38 distinct PDFs; 29 have 10 or more pages. Every figure was found on the page given; each evidence quote was checked against that page's extracted text, and charts whose labels are images or scrambled in extraction were read from a rendered image of the page (the JSON evidence then ends with a bracketed `[chart: ...]` reading).

Dry run of `qa/round2/apply-pages.py` (no `--write`): no "sentence not found" or "citation not found" reports; it places 8 of 9 for ch 09 and 33 of 34 for ch 12 because of the two duplicate sentences below.

## Must do by hand: duplicate sentences
apply-pages.py finds the first occurrence of an excerpt, so a second identical sentence citing the same URL is silently skipped (the first citation already carries the page, so `old == target`). Both pairs take the same page, so add it by hand to the second citation:
- ch 09: "Little of China's capacity is advanced" at line 128 (The chokepoint) and line 144 (Takeaways), SIA/BCG 2024 report: **#page=30** on both.
- ch 12: "Ajinomoto counts 22 layers of its film in a 2026 AI package substrate about 100 mm square..." at line 79 (How it works) and line 142 (Takeaways), Ajinomoto June 2026 deck: **#page=11** on both.

## Problems and caveats for review (no citation lacks its figure)
1. **ch 12, Ajinomoto layer counts (two sentences on line 79, one on line 142, the abf-layers figure data and keyFact line 38).** Slide 11 of the June 2026 deck labels build-up layers on each side of the core: "11 layers" above and "11 layers" below for the 2026 AI package (approx. 100 mm square), "9 layers" + "9 layers" for the HPC package about 2023 (approx. 70 mm square), "3 layers" + "3 layers" for PC use at the 1999 launch. The chapter's 22, 18 and six are sums; no total is printed. The reading is sound, but under the "copy, never compute" rule the owner may want "11 layers on each side of the core" wording or a note.
2. **ch 15, ERCOT March 13, 2026 update (p. 6).** The slide's bullet says the 3,883 MW peak was "in March 2025 which is a slight decrease since February 2025", but the chart on the same slide puts 3,883 MW at snapshot 2026-03 (3,883 + 5,159 = 9,042). The chapter's dating (March 13, 2026) follows the chart and the deck date; the slip is ERCOT's. Slide 7 repeats it ("3801 MW in March 2025").
3. **One sentence, two pages** (the JSON gives the page with the lead figure):
   - ch 11 "On the July 2026 earnings call, Wei said TSMC's packaging capacity was so tight...": p. 10; "back-end capacity was still in shortage" is on p. 17.
   - ch 12 "It planned about JPY 80 billion of capital spending...": p. 5 (JPY 80 billion); "two to three times" is on p. 4.
   - ch 12 "In May 2026 it announced the acquisition of land in Gifu..." and "Its third site for making the film, in Gifu...": p. 20 (May 2026, Gifu, 2032); "third production site" and "demand after 2030" are on p. 21.
   - ch 12 "The offer covered the shares Fujitsu did not own, and Fujitsu agreed to sell its 50.02 percent stake back to Shinko": p. 3 (offer excluding Fujitsu's 50.02%); the agreement to sell in the Share Repurchase is on p. 9.
   - ch 15 "In 2024, lead times of 36 months were commonly quoted...": p. 8; "less than a year" before the pandemic is on p. 18.
4. **Wording the PDF does not use** (page still right): ch 12 "the chip is mounted face down" (MGC says flip-chip, FC-BGA; p. 18 shows the laminate core between build-up layers); ch 12 "build-up substrate" (the 100-day review says "ABF substrate", p. 45); ch 12 "major package substrate vendors" (SIA Exhibit 11 says "Substrates", a back-end materials segment, p. 19); ch 13 "largest global share in probers" (Accretech: "Top share of the global market (based on our research)", p. 6); ch 11 CoWoS-L "fine copper wiring" (TSMC: "RDL-based interposer, higher density embedded local silicon interconnect (LSI)").
5. **ch 14, FCC order p. 40.** The statement that Coherent and InnoLight are key transceiver players not on the Covered List is footnote 245, which itself cites a MarketsandMarkets page (a market-research reseller the source rules exclude). The FCC order is Tier A and does say it; flagging only.
6. **ch 16, Ibiden 36.4% gross margin.** Computed from p. 7 (gross profit 44,873 / net sales 123,219, million yen, April-June 2026); the chapter says so openly.
7. **ch 13, Technoprobe p. 1.** "approximately 38% of our revenues are now attributable to AI-related applications" is on p. 1; the "38%-40%" on pp. 1 and 4 is the 2027 EBITDA margin target, an easy mix-up.
8. **ch 17, Tokyo Electron p. 27.** The yearly shares are of new equipment sales, Field Solutions excluded (note on the slide). ASML p. 9: the China 33% / 41% labels are images in the pie charts.
9. **ch 09, "US share ... 28 percent by 2032".** Exhibit 6 (p. 14) shows 28%; the text on p. 13 says "nearly 30%".

## Downloads
Each PDF was fetched once with `curl -sSL --max-time 180 -A 'Mozilla/5.0 (research; chipsupplychain.org)'` into `qa/round2/scratch/pages-b/<n>/file.pdf`. Seven failed twice: investor.tsmc.com (Cloudflare "Just a moment" challenge, 403) for PDFs 3, 5, 6, 7; intel.com (Akamai 403) for PDF 4; usitc.gov (Akamai 403) for PDF 31; unimicron.com (TLS: unable to get local issuer certificate) for PDF 16. No block was bypassed. The TSMC files and Unimicron came from raw Wayback Machine copies of the same URLs (`web.archive.org/web/<timestamp>id_/<url>`, the project's existing practice for blocked hosts); Intel and USITC came from the project's own fetch cache `qa/bib-cache/<sha1(url)>.pdf`. Page indexes assume those copies match the live files.

## Printed folios that differ from the PDF index
- TSMC 2025 annual report ch 5 (two-page spreads): p. 2 = folios 100-101, p. 3 = 102-103.
- Nitto Boseki Integrated Report 2025 (spreads): p. 3 = 02-03, p. 4 = 04-05, p. 5 = 06-07, p. 7 = 10-11, p. 12 = 20-21, p. 17 = 30-31.
- DOE Large Power Transformer Resilience report: p. 8 = "Page 2", p. 10 = "Page 4", p. 18 = "Page 12", p. 20 = "Page 14".
- EIA STEO September 2026: p. 4 = folio 3, p. 10 = folio 9.
- USITC pub 5531: p. 90 = I-38 (alternatives p. 31 = 21, p. 58 = I-6).
- Advantest FY2025 results note: p. 13 is headed "[p.18]" (the slide it annotates); its folio is 13.
- All other pages used: folio equals index (or no folio printed).

## For card source fields: PDFs cited at more than one page in a chapter
No card object in ch 09 to 17 carried any of these PDF URLs when checked (20 October, after the JSONs were written), so apply-pages.py raised no card decisions. If card agents add them, apply-pages.py will list these for a decision; the page per fact is in the per-citation detail below.
- ch 09, SIA/BCG 2024 report: p. 4 ($2.3 trillion), p. 13 (Korea and Taiwan almost 100%, US none), p. 14 (Exhibit 6: Taiwan 69%, US 28% by 2032), p. 30 (China mostly 28 nm and above).
- ch 11, TSMC 3Q25 transcript: p. 7 (capacity remarks), p. 13 (OSAT partner in Arizona).
- ch 12, Ajinomoto June 2026 deck: p. 3 (over 95% share; no supply-chain concerns), p. 9 (what ABF is), p. 11 (layer counts), p. 18 (build-up process), p. 20 (Gifu land, 2032), p. 21 (JPY 25 billion budget).
- ch 12, Nitto Boseki IR 2025: p. 3 (T-glass essential), p. 4 (overwhelming advantage; catching up; two to three times), p. 5 (JPY 80 billion), p. 7 (NE-glass), p. 12 (Fukushima expansion), p. 17 (T-glass fix for warping).
- ch 12, MGC October 2024 deck: p. 11 (about 40%), p. 12 (approval of materials), p. 16 (uses), p. 18 (laminate core), p. 28 (laminate process).
- ch 12, 100-day review: p. 43 (substrate makers), p. 45 (ABF substrate vulnerable). JIC release: p. 1 (tender offer), p. 3 (50.02%).
- ch 13, SIA/BCG 2024 report: p. 21 (Malaysia 7%), p. 35 (floor-space measure).
- ch 14, FCC-26-50: p. 3 (Covered List), p. 6 (order), p. 10 (transceivers named), p. 40 (key players not listed).
- ch 15, DOE LPT report: p. 8 (36 and 60 months), p. 18 (under a year before the pandemic), p. 20 (82% imported). EIA STEO: p. 4 (4,135 and 4,211; minus 4.7%), p. 10 (almost 2%; Texas pause). ERCOT Senate deck: p. 6 (474 GW), p. 10 (205 GW).
- ch 17, TSMC 3Q25 transcript: p. 5 (N2 in Arizona), p. 7 (narrow the gap; very tight), p. 13 (two packaging fabs). TEL: p. 5 (26.8%), p. 27 (44.4% and 34.1%).

## PDF list
| n | PDF | pages | cited in (ch: count) | copy |
|---|---|---|---|---|
| 1 | www.epw.senate.gov/…/1F7BCD91016CBE352434701BE58395874BEA6A892A23ABEE1D7214EC924EC0EB.03-04-2026-isaacs-testimony.pdf | 12 | 09: 1 | direct download |
| 2 | www.semiconductors.org/…/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf | 38 | 09: 8, 12: 2, 13: 2, 17: 3 | direct download |
| 3 | investor.tsmc.com/…/2025_tsmc_ar_e_ch5.pdf | 14 | 11: 3 | Wayback raw copy, snapshot 2026-09-11 |
| 4 | www.intel.com/…/foveros-direct-3d-tech-brief.pdf | 4 (short, skipped) | 11: 3 | qa/bib-cache copy fetched 2026-10-18 |
| 5 | investor.tsmc.com/…/TSMC%202Q24%20Transcript.pdf | 19 | 11: 3 | Wayback raw copy, snapshot 2025-06-18 |
| 6 | investor.tsmc.com/…/TSMC%203Q25%20Transcript.pdf | 18 | 11: 3, 17: 4 | Wayback raw copy, snapshot 2026-05-25 |
| 7 | investor.tsmc.com/…/TSMC%202Q26%20Transcript.pdf | 22 | 11: 4, 12: 1, 13: 1 | Wayback raw copy, snapshot 2026-10-08 |
| 8 | www.ajinomoto.co.jp/…/20260630_presentation_E.pdf | 35 | 12: 10, 16: 1 | direct download |
| 9 | www.nittobo.co.jp/…/Nittobo_Integrated-Report_2025.pdf | 35 | 12: 8 | direct download |
| 10 | www.mgc.co.jp/…/2410022e.pdf | 28 | 12: 6 | direct download |
| 11 | www.ajinomoto.co.jp/…/3_ICT_E.pdf | 17 | 12: 1 | direct download |
| 12 | download.intel.com/…/en-us-2023-09-18-intel-unveils-industryleading-glass-substrates-to-meet-demand-for-more-powerful-compute.pdf | 7 (short, skipped) | 12: 1 | direct download |
| 13 | www.ajinomoto.co.jp/…/FY25Q4_Tanshin_E.pdf | 27 | 12: 2 | direct download |
| 14 | bidenwhitehouse.archives.gov/…/100-day-supply-chain-review-report.pdf | 250 | 12: 2 | direct download |
| 15 | www.ibiden.com/…/en_QA_FY25Q4.pdf | 4 (short, skipped) | 12: 3 | direct download |
| 16 | www.unimicron.com/…/2026-Q2-consolidated-en.pdf | 9 (short, skipped) | 12: 1 | Wayback raw copy, snapshot 2026-10-02 |
| 17 | www.jiccapital.co.jp/…/E_20250217_JIC_JICC_PressRelease.pdf | 76 | 12: 2 | direct download |
| 18 | pr.fujitsu.com/…/19-1.pdf | 2 (short, skipped) | 12: 1 | direct download |
| 19 | www.shinko.co.jp/…/20260930-01_en.pdf | 3 (short, skipped) | 12: 3 | direct download |
| 20 | www.advantest.com/…/Investors_Guide_2607E.pdf | 15 | 13: 1 | direct download |
| 21 | www.advantest.com/…/JE_BIZ_260427_note.pdf | 17 | 13: 3 | direct download |
| 22 | technoprobe.com/…/PR-FY-2025_.pdf | 11 | 13: 1 | direct download |
| 23 | www.accretech.com/…/IntegratedReport2025_E.pdf | 84 | 13: 2 | direct download |
| 24 | www.advantest.com/…/Investors_Guide_2504E.pdf | 16 | 13: 2 | direct download |
| 25 | docs.fcc.gov/…/FCC-26-50A1.pdf | 108 | 14: 4 | direct download |
| 26 | pubs.usgs.gov/…/mcs2026-indium.pdf | 2 (short, skipped) | 14: 4 | direct download |
| 27 | www.energy.gov/…/EXEC-2022-001242%20-%20Large%20Power%20Transformer%20Resilience%20Report%20signed%20by%20Secretary%20Granholm%20on%207-10-24.pdf | 53 | 15: 4 | direct download |
| 28 | www.eia.gov/…/sep26.pdf | 56 | 15: 4 | direct download |
| 29 | www.ercot.com/…/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf | 10 | 15: 2 | direct download |
| 30 | www.ercot.com/…/March-TAC-Report.pdf | 15 | 15: 3 | direct download |
| 31 | www.usitc.gov/…/pub5531.pdf | 282 | 15: 2 | qa/bib-cache copy fetched 2026-10-02 |
| 32 | www.ibiden.com/…/tannshinn2026Q1.pdf | 13 | 16: 2 | direct download |
| 33 | www.wsts.org/…/WSTS_FC-Release-2026-May.pdf | 2 (short, skipped) | 16: 1 | direct download |
| 34 | www.meti.go.jp/…/handeji14-4.pdf | 111 | 17: 1 | direct download |
| 35 | www.miti.gov.my/…/%5BFINAL%5D_MITI_Press_Stmt_Malaysia_Regulates_Trade_of_US_AI_Chips_2025-07-14.pdf | 1 (short, skipped) | 17: 1 | direct download |
| 36 | ourbrand.asml.com/…/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf | 24 | 17: 1 | direct download |
| 37 | www.tel.com/…/fy26q4transcript-e.pdf | 29 | 17: 2 | direct download |
| 38 | www.semiconductors.org/…/SIA_2026_State-of-the-Semiconductor-Industry.pdf | 23 | 17: 1 | direct download |

## Per-citation detail
Excerpt (first 80 characters), PDF number, page chosen (of total), printed folio where it differs, other pages holding the figure, and notes.

### 09-foundries-and-fabs

- "In March 2026 the Semiconductor Industry Association (SIA) told the US Senate th" (PDF 1): **p. 3** of 12. testimony dated March 4, 2026 (p. 1); folio 3
- "In 2022 South Korea and Taiwan held almost all of the world's logic capacity bel" (PDF 2): **p. 13** of 38; also p. 14. Exhibit 6 on p. 14 gives Korea 31%, Taiwan 69% for logic <10 nm in 2022
- "The United States had almost no capacity below 10 nm that year" (PDF 2): **p. 13** of 38; also p. 14. Exhibit 6 on p. 14 shows US 0% for logic <10 nm in 2022
- "In May 2024 SIA and BCG projected that the US share of that capacity would reach" (PDF 2): **p. 14** of 38; also p. 13. Exhibit 6 (chart labels as extracted): Logic <10 nm, 2032F, US bar 28%. Text on p. 13 says 'nearly 30%'
- "They also projected that new fab investment worldwide would reach around $2.3 tr" (PDF 2): **p. 4** of 38; also p. 11, 13. same sentence on p. 11; Exhibit 5 on p. 13 shows $2.3T Total CapEx
- "Little of China's capacity is advanced" (PDF 2): **p. 30** of 38; also p. 14, 36. p. 30 continues: invested $63 billion in 73 fabs, primarily in fabs for chips over 28 nanometers. Exhibit 6 p. 14: China 0% of logic <10 nm in 2022; endnote 57 p. 36
- "Taiwan held 69 percent of the world's logic capacity below 10 nm in 2022" (PDF 2): **p. 14** of 38. Exhibit 6 (chart labels as extracted): Logic <10 nm, 2022: US 0%, Korea 31%, Taiwan 69%
- "In 2022 Taiwan held 69 percent of the world's capacity for advanced logic chips," (PDF 2): **p. 14** of 38. Exhibit 6: Logic <10 nm, 2022: Taiwan 69%, US 0%
- "Little of China's capacity is advanced" (PDF 2): **p. 30** of 38; also p. 14, 36. duplicate sentence (line 144); apply by hand

### 11-advanced-packaging

- "CoWoS-L replaces that piece of silicon with redistribution layers (RDL) of fine " (PDF 3): **p. 3** of 14 (printed 102-103 (two-page spread)). PDF page 3 is the spread printed 102-103
- "Intel's Foveros stacks dies face to face and joins them with solder microbumps" (PDF 4, 4 pp.): skipped, short PDF (4 pages)
- "Its newer Foveros Direct drops the solder and bonds the copper pads directly, a " (PDF 4, 4 pp.): skipped, short PDF (4 pages)
- "That lets the connections sit far closer together than microbumps allow" (PDF 4, 4 pp.): skipped, short PDF (4 pages)
- "Its 3 nm SoIC entered volume production in 2025" (PDF 3): **p. 3** of 14 (printed 102-103 (two-page spread))
- "TSMC's COUPE uses SoIC to join a silicon photonics chip, which sends data as lig" (PDF 3): **p. 3** of 14 (printed 102-103 (two-page spread)); also p. 2. p. 2 (folios 100-101) describes COUPE integrating a silicon photonics chip and an electrical control chip
- "At its 2024 symposium TSMC said CoWoS capacity would grow at a 60 percent compou" (PDF 5): **p. 6** of 19; also p. 5. p. 5 has the analyst's version of the same question
- "But when asked about that rate on the July 2024 earnings call, TSMC's chief exec" (PDF 5): **p. 6** of 19. C.C. Wei's answer
- "He said only that he would keep adding capacity wherever he could, and that he c" (PDF 5): **p. 6** of 19. same answer: 'We continue to increase whatever, wherever, whenever I can, okay.'
- "In October 2025 Wei would still say only that TSMC was working to increase capac" (PDF 6): **p. 7** of 18. call of October 16, 2025
- "He said front-end capacity (making the chips) and back-end capacity (packaging t" (PDF 6): **p. 7** of 18
- "On the July 2026 earnings call, Wei said TSMC's packaging capacity was so tight " (PDF 7): **p. 10** of 22; also p. 17. the second half of the sentence (back-end capacity still in shortage) is on p. 17: 'since our capacity in the backend is still in shortage mode, the gap is bigger'
- "Asked about Intel's EMIB-T, he said he welcomed the extra flexibility and hoped " (PDF 7): **p. 10** of 22; also p. 17. same answer: 'we hope they will be successful and so that share some of the loading from TSMC'
- "In October 2025 Wei said a large outsourced packaging partner, already breaking " (PDF 6): **p. 13** of 18
- "On the July 2026 earnings call, TSMC's chief executive, C.C. Wei, said its packa" (PDF 7): **p. 10** of 22
- "Asked about Intel's EMIB-T packaging, he said he hoped it would take some of the" (PDF 7): **p. 10** of 22. answer to the EMIB-T question

### 12-substrates-and-pcbs

- "In each cycle the maker then presses on a film of epoxy, burns holes through it " (PDF 8): **p. 18** of 35. slide 'Customers' manufacturing and evaluation process': 1 Embed, 2 Via formation process, 3 Copper wiring process; equipment labels quoted
- "Ajinomoto counts 22 layers of its film in a 2026 AI package substrate about 100 " (PDF 8): **p. 11** of 35. CAVEAT: the chart labels layers on each side of the core: AI 2.5D 2026, approx. 100 mm square, 11 + 11 layers; HPC about 2023, approx. 70 mm square, 9 + 9; PC 1999, 3 + 3. The chapter's 22, 18 and 6 are the sums; the slide never prints a total
- "PC substrates had six layers of the film when PCs first adopted it in 1999" (PDF 8): **p. 11** of 35. CAVEAT: chart shows PC use (initial adoption of ABF) at the 1999 launch with '3 layers' above and '3 layers' below the core; 'six' is the sum
- "Nitto Boseki says its low-expansion T-glass cloth is highly rated as an effectiv" (PDF 9): **p. 17** of 35 (printed 30-31 (two-page spread)); also p. 12. p. 12 (folios 20-21) has 'highly evaluated as an effective solution, and demand continues to grow'
- "Mitsubishi Gas Chemical, which makes BT materials, says they go mostly into thin" (PDF 10): **p. 16** of 28. same slide: WB/FC-CSP key applications 'Smartphone AP and RF modules, memory applications, etc.'; WB/FC-CSP is the largest slice of the package-composition chart
- "The company says BT also goes into flip-chip substrates for computer CPUs and GP" (PDF 10): **p. 16** of 28. same slide: FC-BGA key applications 'CPUs for computers etc., GPUs'; FC = Flip-Chip
- "In these the chip is mounted face down, and BT laminate forms the core between l" (PDF 10): **p. 18** of 28; also p. 16. diagram of a 2.xD IC plastic package: copper-clad laminate between two layers labelled 'Build-up material'. Flip-chip defined on p. 16. The PDF does not say 'face down'
- "In an October 2024 investor presentation, the company estimated that its BT resi" (PDF 10): **p. 11** of 28. deck dated October 2, 2024 (p. 1)
- "Ajinomoto Build-up Film, or ABF, is the insulating film between the layers of pa" (PDF 8): **p. 9** of 35
- "Ajinomoto first developed it in 1999 and says major chipmakers have used it as t" (PDF 11): **p. 4** of 17. continues: 'continuously used as the de facto standard by major semiconductor manufacturers'
- "In June 2026 Ajinomoto told investors that the film has held a share of over 95 " (PDF 8): **p. 3** of 35
- "**Intel** announced glass substrates in September 2023 for the latter part of th" (PDF 12, 7 pp.): skipped, short PDF (7 pages)
- "Ajinomoto's Healthcare and Others segment, which includes electronic materials s" (PDF 13): **p. 8** of 27; also p. 6. p. 6 has the segment table; p. 24 lists electronic materials (ABF) in the segment
- "Ajinomoto attributes the rise mainly to higher electronic materials revenue and " (PDF 13): **p. 8** of 27
- "It has set an investment budget of JPY 25 billion between 2023 and 2030 to expan" (PDF 8): **p. 21** of 35
- "It says there are no concerns about its current supply chain overall" (PDF 8): **p. 3** of 35
- "In May 2026 it announced the acquisition of land in Gifu Prefecture for a third " (PDF 8): **p. 20** of 35; also p. 21. same slide: 'Gifu Plant (operation scheduled for 2032)'. 'Third production site' and 'increases in demand after 2030' are on p. 21
- "Nitto Boseki's T-glass is stiff and expands little when heated, and the company " (PDF 9): **p. 3** of 35 (printed 02-03 (two-page spread)); also p. 17
- "Laminate makers such as Mitsubishi Gas Chemical coat the glass cloth with resin " (PDF 10): **p. 28** of 28. process diagram 'BT materials: Product structure and manufacturing process overview': glass cloth, resin coating, prepreg, layup with copper foil, laminating press, copper-clad laminate
- "Nitto Boseki claims an overwhelming advantage in quality and capacity for low-ex" (PDF 9): **p. 4** of 35 (printed 04-05 (two-page spread))
- "It planned about JPY 80 billion of capital spending for fiscal 2024 to 2027, and" (PDF 9): **p. 5** of 35 (printed 06-07 (two-page spread)); also p. 4, 12. the second clause (demand up about two to three times) is on p. 4 (folios 04-05); p. 12 (folios 20-21) also gives JPY 80 billion over four years for FY2024-2027
- "In August 2025 it decided to expand glass fiber cloth production at its Fukushim" (PDF 9): **p. 12** of 35 (printed 20-21 (two-page spread)). NEWS box, preceded by 'In August 2025, Nittobo'
- "Nitto Boseki says Chinese and Taiwanese companies are aggressively catching up w" (PDF 9): **p. 4** of 35 (printed 04-05 (two-page spread))
- "The White House's 2021 hundred-day supply chain review listed build-up substrate" (PDF 14): **p. 45** of 250. the review says 'ABF substrate'
- "It named key substrate makers including Ibiden, Nanya, Shinko, Samsung, Unimicro" (PDF 14): **p. 43** of 250
- "A May 2024 report by the Semiconductor Industry Association and Boston Consultin" (PDF 2): **p. 19** of 38. Exhibit 11, 'Number of major vendors by HQ region', Substrates column: JP 2, TW 2, CN 1, none for US, EU, KR
- "It found two in Japan, two in Taiwan, one in mainland China and none in the Unit" (PDF 2): **p. 19** of 38. Exhibit 11, Substrates column: JP 2, TW 2, CN 1, no US entry
- "In May 2026 management said Ibiden typically takes close to 100 percent of a new" (PDF 15, 4 pp.): skipped, short PDF (4 pages)
- "It added that this share may decline by 20 to 30 percent after about three to si" (PDF 15, 4 pp.): skipped, short PDF (4 pages)
- "On silicon-bridge substrates, it said wiring the underside is hard enough that I" (PDF 15, 4 pp.): skipped, short PDF (4 pages)
- "**Unimicron** reported NT$42.9 billion of sales in the second quarter of 2026, 5" (PDF 16, 9 pp.): skipped, short PDF (9 pages)
- "In February 2025 a company owned mainly by funds of JIC Capital, a subsidiary of" (PDF 17): **p. 1** of 76; also p. 3. dated February 17, 2025; 'take private' wording on p. 3
- "The offer covered the shares Fujitsu did not own, and Fujitsu agreed to sell its" (PDF 17): **p. 3** of 76; also p. 9, 10. Fujitsu's agreement 'to sell all of the Fujitsu Holding Shares that it holds in response to the Share Repurchase' is on p. 9
- "The tender offer succeeded in March 2025" (PDF 18, 2 pp.): skipped, short PDF (2 pages)
- "In September 2026 Shinko agreed to buy a plant in Mobara, Chiba Prefecture, from" (PDF 19, 3 pp.): skipped, short PDF (3 pages)
- "Shinko said it would make the site a new core plant for advanced chip packages a" (PDF 19, 3 pp.): skipped, short PDF (3 pages)
- "Production at the Mobara plant is scheduled to start in fiscal 2028" (PDF 19, 3 pp.): skipped, short PDF (3 pages)
- "Nitto Boseki also makes NE-glass, a low-dielectric glass cloth that absorbs less" (PDF 9): **p. 7** of 35 (printed 10-11 (two-page spread)); also p. 17, 3. 'de facto standard for low-dielectric glass' is on p. 17 (folios 30-31)
- "Mitsubishi Gas Chemical, a laminate maker, says chipmakers and electronic device" (PDF 10): **p. 12** of 28. supply-chain diagram on the same slide labelled 'Approval of materials'
- "TSMC told investors in July 2026 that its CoWoS packaging roadmap goes beyond 14" (PDF 7): **p. 16** of 22. Jeff Su restating TSMC's roadmap
- "Ajinomoto counts 22 layers of its film in a 2026 AI package substrate about 100 " (PDF 8): **p. 11** of 35. duplicate sentence (line 142); apply by hand. CAVEAT as for the first occurrence: 11 + 11 and 9 + 9 per side
- "Its third site for making the film, in Gifu Prefecture, is scheduled to start op" (PDF 8): **p. 20** of 35; also p. 21. 'Third production site after Kawasaki and Gunma' and 'increases in demand after 2030' are on p. 21
- "Nitto Boseki says market demand seems to have risen about two to three times sin" (PDF 9): **p. 4** of 35 (printed 04-05 (two-page spread))

### 13-test-and-assembly

- "Advantest's investor guide of July 2026 says test is the only step that puts ele" (PDF 20): **p. 10** of 15
- "TSMC has told investors that its CoWoS packaging roadmap runs beyond 14 times th" (PDF 7): **p. 16** of 22. Jeff Su restating TSMC's roadmap
- "Advantest puts its own share at about 65 percent of an estimated $9.0 billion te" (PDF 21): **p. 13** of 17. same page: tester market in CY2025 'totaling around 9.0 billion USD'; the note is headed [p.18] (slide 18) but this is PDF page 13
- "Its share of system-on-chip (SoC) testers, the machines that test processors and" (PDF 21): **p. 13** of 17; also p. 9
- "It held about 60 percent of memory test" (PDF 21): **p. 13** of 17. memory tester market
- "Technoprobe's revenue grew 15.7 percent to EUR 628.4 million in 2025, about 38 p" (PDF 22): **p. 1** of 11; also p. 2, 4. same page: 'approximately 38% of our revenues are now attributable to AI-related applications' and the aim to double capacity 'by the end of the two-year period' (2026-2027). Beware: the 38%-40% on p. 1 and p. 4 is the 2027 EBITDA margin target, a different figure
- "Tokyo Seimitsu, which sells under the Accretech name, says it has the largest gl" (PDF 23): **p. 6** of 84. the report says 'Top share of the global market'
- "It also makes dicing machines and grinders" (PDF 23): **p. 6** of 84; also p. 21. p. 21: 'we offer probing machines ..., dicing machines to separate individual chips from wafers, and grinders to make wafers thinner and flatter'
- "A 2024 study by the Semiconductor Industry Association and Boston Consulting Gro" (PDF 2): **p. 21** of 38; also p. 20. Exhibit 13 'ATP capacity distribution by region': Malaysia 7% in 2022, the largest Rest-of-world segment; p. 20: 'with Malaysia capturing the greatest share within the region'
- "The study measured capacity by factory floor space at contractors and chipmakers" (PDF 2): **p. 35** of 38; also p. 21. endnote 27 to Exhibit 13; Exhibit 13 note on p. 21: 'Includes both OSAT and IDM facilities'
- "Advantest argues that switching to another tester maker means rebuilding the who" (PDF 24): **p. 14** of 16. continues: 'our market share is unlikely to fluctuate significantly in the short term'
- "Advantest argues that switching to another tester maker means rebuilding a custo" (PDF 24): **p. 14** of 16

### 14-systems-and-networking

- "The Federal Communications Commission publishes a Covered List of equipment and " (PDF 25): **p. 3** of 108. continues: 'to the national security of the United States or the security and safety of United States persons'
- "Its July 2026 order bars new authorizations for devices that contain logic-beari" (PDF 25): **p. 6** of 108; also p. 2. order adopted July 22, 2026, released July 23, 2026 (p. 1)
- "Commenters in the record named optical transceivers as one such component" (PDF 25): **p. 10** of 108
- "The same order notes that the key players in the optical transceiver market, Coh" (PDF 25): **p. 40** of 108. footnote 245: '(listing the key players in the optical transceiver market, none of which appear on the Covered List)'. The footnote cites a MarketsandMarkets page
- "Indium phosphide is used in the high-speed laser diodes and photodetectors for o" (PDF 26, 2 pp.): skipped, short PDF (2 pages)
- "China accounted for 70 percent of world indium production in 2025" (PDF 26, 2 pp.): skipped, short PDF (2 pages)
- "In February 2025 China's Ministry of Commerce placed indium under new export res" (PDF 26, 2 pp.): skipped, short PDF (2 pages)
- "Indium phosphide is used in high-speed lasers for optical communications, and Ch" (PDF 26, 2 pp.): skipped, short PDF (2 pages)

### 15-data-centers-and-power

- "A wafer passes through a leading-edge fab in months, but in 2024 a large power t" (PDF 27): **p. 8** of 53 (printed Page 2). continues: 'and maximum lead times reaching as much as 60 months'; report signed July 2024
- "Before the pandemic, the same order took under a year" (PDF 27): **p. 18** of 53 (printed Page 12). preceded by 'Prior to the Coronavirus Disease of 2019'
- "In its September 2026 Short-Term Energy Outlook, the Energy Information Administ" (PDF 28): **p. 4** of 56 (printed 3); also p. 10. same paragraph: 'The United States uses record amounts of electricity in our forecast.' BkWh = TWh
- "Sales would grow by almost 2 percent in each year, driven by data centers and ma" (PDF 28): **p. 10** of 56 (printed 9). same paragraph: 'driven by data center development and increased manufacturing activity'
- "The same outlook lowers its 2027 electricity sales forecast for the region that " (PDF 28): **p. 4** of 56 (printed 3). table of forecast changes; West South Central is the region that includes Texas
- "It notes that Texas has paused connecting new data centers to the grid while it " (PDF 28): **p. 10** of 56 (printed 9); also p. 4
- "ERCOT, the grid operator for most of Texas, was tracking about 474 GW of large l" (PDF 29): **p. 6** of 10. slide 'Large Load Interconnection Requests (as of June 2026)'
- "ERCOT's large load update of March 13, 2026, counted 9,042 MW approved to energi" (PDF 30): **p. 6** of 15. deck dated March 13, 2026 (p. 1). The bullet says the 3883 MW is 'in March 2025', but the chart on the same slide puts 3,883 MW at snapshot 2026-03 (3,883 + 5,159 = 9,042), so 'March 2025' is a slip in ERCOT's text
- "In a preliminary review in July 2026, ERCOT found about 205 GW of the queue elig" (PDF 29): **p. 10** of 10. slide 'Preliminary Overview of Batch Zero Eligibility'
- "In 2024, lead times of 36 months were commonly quoted and the longest reached 60" (PDF 27): **p. 8** of 53 (printed Page 2); also p. 18. 'less than a year' before the pandemic is on p. 18 (Page 12)
- "By a Commerce Department estimate, 82 percent of the units put into US service i" (PDF 27): **p. 20** of 53 (printed Page 14); also p. 10. preceded by 'The U.S. Department of Commerce'; same estimate on p. 10 (Page 4), worded 'estimated in 2019 that'
- "Measured by capacity, US factories supplied 29.2 percent of the transformers of " (PDF 31): **p. 90** of 282 (printed I-38); also p. 31, 58. same page: 'Apparent U.S. consumption by MVA top rated'; Table I-13: All import sources share 70.8 in 2023. Scope (above 60 MVA) on p. 15
- "Measured by capacity, US factories supplied 29.2 percent of the large power tran" (PDF 31): **p. 90** of 282 (printed I-38); also p. 31, 58
- "ERCOT, the grid operator for most of Texas, counted 9,042 MW of big power users " (PDF 30): **p. 6** of 15. deck dated March 13, 2026; see the note on the 'March 2025' slip
- "Judging by peak monthly use, it believed 3,883 MW of that was operating" (PDF 30): **p. 6** of 15. the value is 3883 MW (same slide)

### 16-component-costs

- "Each figure comes from the firm's own earnings release ([source](https://investo" (PDF 32): **p. 7** of 13. Consolidated statements of income, FY2026 1st quarter (April-June 2026), million yen; 44,873 / 123,219 gives the table's 36.4%
- "The KLA and Ibiden releases give no percentage, so their figures are gross profi" (PDF 32): **p. 7** of 13. the release gives no gross margin percentage; gross profit and net sales are on this page
- "In its June 2026 forecast, World Semiconductor Trade Statistics put 2025 at $795" (PDF 33, 2 pp.): skipped, short PDF (2 pages)
- "Investment can add substrate lines, but Ajinomoto said in June 2026 that the ins" (PDF 8): **p. 3** of 35. table cell in 'Where the money goes'

### 17-geopolitics

- "Fuji Keizai's survey by parent-company headquarters, as Japan's Ministry of Econ" (PDF 34): **p. 8** of 111. slide 8, chart 素材市場 売上高シェア (2023): フォトレジスト (photoresist) Japan 78%, シリコンウエハ (silicon wafers) Japan 53%. Source line: Fuji Keizai survey, compiled by METI. Deck dated 令和7年12月23日 (23 December 2025)
- "The Semiconductor Industry Association and Boston Consulting Group's 2022 measur" (PDF 2): **p. 14** of 38. Exhibit 6: Logic <10 nm 2022 Taiwan 69%; Logic 28 nm+ 2022 China 33%
- "Since 14 July 2025 Malaysia has required a permit to export, transship or transi" (PDF 35, 1 pp.): skipped, short PDF (1 page)
- "Taiwan held 69 percent of the world's logic capacity below 10 nm in 2022" (PDF 2): **p. 14** of 38. Exhibit 6: Logic <10 nm, 2022: Taiwan 69%
- "Asked in October 2025 how much CoWoS packaging capacity he would add, TSMC's cha" (PDF 6): **p. 7** of 18. C.C. Wei answering on CoWoS capacity; call of October 16, 2025
- "He called wafer and packaging capacity both "very tight"" (PDF 6): **p. 7** of 18
- "TSMC said in October 2025 that it was "preparing to upgrade our technologies fas" (PDF 6): **p. 5** of 18
- "The Arizona fabs narrow the gap in wafer production, and TSMC has two advanced p" (PDF 6): **p. 13** of 18. the first clause of the sentence (Arizona fabs narrow the gap in wafer production) is the chapter's own framing
- "At ASML, China's share of net system sales, which leave out service and field op" (PDF 36): **p. 9** of 24. slide 9: the 'Region (ship to location)' pie charts show China 33% of 2025 net system sales (EUR 24,474 million) and 41% of 2024 (EUR 21,769 million); the pie labels are images, not text
- "At Tokyo Electron, China's share fell from 44.4 percent in the year to March 202" (PDF 37): **p. 27** of 29; also p. 5. yearly chart FY2022-FY2026, China series: FY2024 44.4%, FY2026 34.1%; note on the slide: shares are of new equipment sales, Field Solutions excluded. p. 5 states 34.1% for FY ended March 2026
- "The company said the share dropped to 26.8 percent in the quarter to March 2026 " (PDF 37): **p. 5** of 29
- "Counting every type of chip, they took 53.4 percent of global sales in 2025, the" (PDF 38): **p. 7** of 23
- "It held 69 percent of the world's capacity for logic chips below 10 nanometers i" (PDF 2): **p. 14** of 38. Exhibit 6: Logic <10 nm, 2022: Taiwan 69%
