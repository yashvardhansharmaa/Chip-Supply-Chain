# expert-test-and-assembly: progress notes (20 Oct 2026)

Chapter 13, Test and Assembly. Report goes to qa/round2/expert-test-and-assembly.md.

## Status
- [x] Read brief, rules, schema, writing skill
- [x] Read chapter, flashcards, glossary entries, animation and captions, page notes
- [x] Sources downloaded and checked (list below)
- [x] Edits made (20 rows, see report)
- [x] Build and checks (build 0; speak clean; integrity only known Veeco line; sources 2484 all A/B)
- [x] Report written: qa/round2/expert-test-and-assembly.md

## Source checks (running)
All downloads in qa/round2/scratch/expert-test-and-assembly/ (raw/ plus .txt copies). sec.gov needs gzip (--compressed) with the research UA.
- Advantest FY2025 note p.13: ~65% overall, SoC 66% (+~10 pts), memory ~60% (-2 pts), market 6.9+2.1=~9.0bn. p.9: SoC market +68% YoY. OK.
- Advantest guide 2504E p.13 "about 80%"; p.3/4 58% in 2024; p.14 switching + "market share is unlikely to fluctuate significantly in the short term".
- Advantest guide 2607E p.10 only electrical step (OK); p.12 switching cost kept, share-stability claim and 80% line DROPPED; p.9 fabless picks the tester platform.
- Teradyne 10-K: Semi Test $2,523.7m; SoC $1,889,685k; Memory $504,903k (chapter rounds: owner question). PR: $3.19bn, +13%, Q4 +44%. OK.
- ASE 2Q26 6-K: testers 8,348/7,585/6,797; ATM GM 27.3%. 2Q26 deck: machinery capex $2.7bn, bldg $1.4bn 1H26; LEAP tracking ahead of $3.5bn. OK.
- ASE 20-F: $20,573.4m; packaging $9,829.2m, testing $2,292.0m; p.43-44 "purchase testers ... primarily Teradyne, Inc., Tokyo Electron Limited, and Advantest"; test programs written for a specific platform.
- ASE 6-K Feb 2026: 48/11/40/1. OK.
- Amkor: $6.71bn 2025; Q2 2026 $1.90bn +26%, GM 16.8%. Ground-breaking 6 Oct 2025, $7bn planned, production early 2028. TSMC 10-year agreement 16 Jun 2026. OK.
- TSMC 3174 (Wayback 20241004155550): MOU, Peoria, Phoenix fabs. OK. TSMC 2Q26 p.16 "roadmap to even larger than 14x reticle size with CoWoS". OK.
- FormFactor 10-K: HBM "stack of eight, twelve, or even sixteen"; "record annual revenue of $785.0 million"; Probe Cards $637,898k, Systems $147,095k.
- Cohu 10-K: "$453.0 million in fiscal 2025" verbatim. K&S 8-K ex99.1 (19 Nov 2025): "Net revenue of $654.1 million" verbatim. XBRL JSONs give 452956000 / 654081000 / 784993000.
- Aehr Aug 2026: $22m order, FOX-XP nine 300 mm wafers; "reducing the risk of committing high-value HBM, substrates, interposers ... to devices that may subsequently fail". Does not say "every added die".
- Aehr Jul 2026: FY26 $50.0m; record bookings $60.7m; FY27 $130-150m; lead AI customer "shifting their burn-in from system-level to all wafer-level". Q1 FY27 results due 2 Nov 2026.
- Aehr 10-K: burn-in minutes to hours or days, elevated V and T; wafer probe "one or many die at a time, including the entire wafer".
- ETO (GitHub data, TechInsights published 3 Jul 2026): N120 test tools $9.1bn, Advantest 62.7, Teradyne 21.8, JPN 63.0, USA 23.5, CHN 6.2. N71 dicing $1.9bn Disco 87.0 Accretech 8.1. N83 handlers and probers $2.9bn: Tokyo Electron 19.9, Accretech 17.1.
- CSET article (14 Jul 2025): +5 pp test tools, +4 pp adv. pkg tools, lost share in conventional A&P; four of top ten OSATs, footnote 14 = marklapedus.substack.com (trade press).
- Technoprobe p.1: EUR 628.4m +15.7%; "approximately 38% of our revenues are now attributable to AI"; double capacity by end of 2026-27.
- Accretech IR 2025 p.6: "Top share of the global market (based on our research) Probing machine".
- TEL Precio: wafer prober, XY and Z-axis control by the prober.
- Disco 15 Dec 2025: DFD6080, "can process workpieces up to 400 x 400 mm" (panels, substrates).
- Besi Q2-26: EUR 249.9m +68.7%, hybrid bonding, photonics, datacenter. OK.
- ASMPT 2025 results: TCB leader 2025, TAM $1.6bn by 2028, target 35-40%. OK. Dec 2025: fifteen C2S tools. NEWER: 29 Jul 2026, more than 50 C2S TCB tools.
- Hanmi: product page lists DUAL TC BONDER (HBM). 403 to research UA, 200 to browser UA.
- MIDA 1 Jul 2026: "We ship 13% of the world's packaged chips"; 7% by 2035 is the mission goal of a five-firm consortium (MAPC).
- SIA/BCG p.21 Malaysia 7% 2022, OSAT and IDM; p.35 footprint. OK.
- Nikkei 27 Aug 2026 Powertech panel-level line as soon as early 2027. OK.
- SIA $791.7bn 2025. OK. Senate testimony p.2 (11 pp): 1,000-1,500 steps; chapter citation has no #page.
