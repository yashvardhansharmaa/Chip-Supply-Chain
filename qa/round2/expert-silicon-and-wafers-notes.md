# expert-silicon-and-wafers: progress notes (20 Oct 2026)

Downloads in qa/round2/scratch/expert-silicon-and-wafers/ (all fetched fresh today with a generic UA).

## Figures verified against sources
- SEMI via PR Newswire (10 Feb 2026): 5.8% to 12,973 MSI, revenue -1.2% to $11.4bn; epi for logic, polished for HBM; softness "mostly attributed to ... traditional semiconductor applications"; sub-3nm quote is Ginji Yada, chairman of SEMI SMG; "produced in diameters of up to 300 mm". OK.
- Nvidia FY2026: Data Center full-year $193.7bn. OK.
- SUMCO process page: "metal impurities ... no more than a few parts per billion (ppb)", "around 1420℃", epi "around 1200℃", lapping with alumina, colloidal silica polish, epi "for customers requiring an exceptionally perfect crystal structure or multiple layers having different resistivity". OK.
- Siltronic IP April 2026 (32 pp): p5 USD 1.4 bn silicon for electronic applications, 5 major suppliers Wacker, Hemlock, OCI, Tokuyama, Mitsubishi; USD 11.4 bn wafers (figures for 2025; source line includes TechInsights). p6 "Around 75% of the market is served by the Top 5", "Only western based wafer manufacturer", source Q1-Q3 2025. p12 "Key prime customer qualifications completed in July 2025". p18 flatness "20 nm on a wafer are equivalent to the height of a leaf on the surface of Lake Chiemsee". OK.
- Siltronic IP September 2026 (20260911, 34 pp): p5 and p6 repeat the same figures and sources; Singapore slide now "Fab operating as planned and serving Leading Edge customers". No change needed.
- CSET Jan 2021: p55 Table 18 (<5%, <1% for 300 mm; 14 key firms incl. 9 Chinese-owned), data "current as of 2019" (p.?, line 153 of text); p57 99.7%, "considerable tacit know-how", five Chinese 300 mm firms as of 2018, "little revenue in comparison"; p58 18%/12%; p80 note 111 (2002, 50% vs 25%, Mack 2013). OK.
- Eswin prospectus (459 pp): p138 seven firms, 294 (10k/month) end-2024; p145 79.08 / 6.01 / 14.91, "根据 SEMI 统计的《WAFER MARKET MONITOR》…估算". Prose p.? says "约 6%" for Eswin 2024, so flashcard "about 6 percent" is as filed. OK.
- Eswin 2025 summary p8: "据 SEMI 预测，2025 年其占全球硅片出货面积的比重约为 78.8%". OK.
- Eswin H1 2026 p18: "出货量全球市占率约 7.7%，位居 12 英寸硅片领域国内第一、全球第六". OK.
- METI deck p8: silicon wafer 2023 Japan 53%; measured bar: Europe 10.0, Korea 13.0, Taiwan 19.0, Other 5.0, no US or China segment. p4 prints wafer 53 / 10 (Europe) / 37 (other), Fuji Keizai 2024 edition. So "The deck prints only Japan's 53 percent" is not quite right: p4 prints Europe's 10.
- Shin-Etsu FY to March 2026: p6 Electronics Materials ¥1,015.7bn, +9%, AI quote; p20 segment products. OK.
- SUMCO AGM notice: p24 prose, p26 table (409,670; 36,924 -> 1,342; (11,751)). OK.
- Siltronic press release: €1,346.7m sales, result -€77.9m, capex €369.1m, "focus remained on the new fab in Singapore". OK.
- GlobalWafers: NT$60.6bn, -3.24% YoY; May 2025: US$3.5bn, "first production line of its kind built in the United States in over 20 years", "intention to expand ... by another $4 billion", "expects to add phases 3 and 4". OK.
- NIST 17 Dec 2024: up to $406 million to GWA (Texas) and MEMC (Missouri). OK.
- Soitec group page: Smart Cut "today is used to make nearly all SOI wafers sold in the world" (Soitec's own claim). OK.
- USGS MYB China 2023 p7: 1.50 Mt, ~93%, 98% solar / 2% electronic. OK. No 2024 China chapter yet (404).
- USGS MCS 2026 silicon: "ultra-high-purity semiconductor- or solar-grades, commonly referred to as polysilicon"; "The source of the silicon is silica in various natural forms, such as quartzite." OK.
- Proclamation 11052: 2.4 percent finding (para 7); MIP (ii) $100/kg polysilicon ingots and wafers from 4 Dec 2026; (4) additional 15 percent on ingots and derivatives; (6) onshoring plans, construction by 20 Jan 2029; equipment and Covered Products without section 232 duties. OK.
- BIS stockpiling TFR (24 Sep 2026): lists 3818.00.0020/0040/0045/0050/0091. OK.
- HTS REST API: 3818.00.00.40 = "Monocrystalline silicon wafers, doped: Round (circular) shaped". OK.
- Federal Register search since 1 Aug 2026: no newer polysilicon 232 documents.

## Technical issues found
1. plain + twin: "starts with sand" (body says quartzite; USGS: silica "such as quartzite").
2. Epi paragraph: leakage "sets the lowest leakage the chip can reach" and latch-up "set" by the layer's quality: overstated / imprecise.
3. Animation: "of every hundred billion atoms, fewer than one is anything else" conflicts with chapter's sourced "a few parts per billion" (and is false if carbon/oxygen counted). "flat to within a few atoms" wrong: flatness is tens of nm (Siltronic: 20 nm).
4. METI sentence: deck p4 also prints Europe's 10 percent.
5. "a slump in demand" overstates (sources: sluggish, slow momentum).
6. "almost no share of the wafer market" vs CSET "<5%".
7. "stirred into the melt": dopant is added to the crucible with the charge (SUMCO).
8. Soitec claim should be attributed.
9. Shin-Etsu bullet "Its parent's" confusing under the "Shin-Etsu" lead.

## Done (20 Oct 2026)
Edits 1-9 applied to content/02-silicon-and-wafers.md (items 7 "stirred" and the GlobalWafers "$4 billion" wording left as is after review). Build and four checks run once: all pass (known Veeco warning only). Report: qa/round2/expert-silicon-and-wafers.md.
