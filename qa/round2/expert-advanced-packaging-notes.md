# expert-advanced-packaging: working notes (20 Oct 2026)

Downloads: qa/round2/scratch/expert-advanced-packaging/ (TSMC PDFs copied from pages-b scratch; Wayback raw copies for blocked hosts).

## Verified so far
- TSMC 2025 AR ch5 p.3: CoWoS-L "RDL-based interposer, higher density embedded local silicon interconnect (LSI)"; "entered its second year of volume production in 2025"; 3nm SoIC "successfully entered volume production in 2025"; COUPE "leveraging the TSMC-SoIC CoW stacking solution to integrate silicon photonics and electrical control chips ... volume production expected in 2026".
- TSMC 2025 AR ch5 p.4: "CoWoS-L at 3.5-reticle size has been in production since 2024 and the 5.5-reticle size CoWoS-L will finish the qualification in 2026"; "further development of the 9.5-reticle size CoWoS-L is also making good progress". (Figure cowos-reticles uses 3.5 and 9.5 from here, but its url is pr.tsmc.com 3302, which has neither.)
- pr.tsmc.com 3302 (issued 2026/04/23, Santa Clara 22 Apr): "now producing 5.5-reticle size CoWoS and planning for even larger versions"; "14-reticle size CoWoS, capable of integrating approximately 10 large compute dies and 20 HBM stacks, is slated for production in 2028"; "expansion to beyond 14 reticles in 2029"; "40-reticle size SoW-X System-on-Wafer technology also expected in 2029"; "A14-to-A14 SoIC set to be available for production in 2029 ... 1.8X higher die-to-die I/O density compared with N2-on-N2 SoIC"; "COUPE on substrate beginning production in 2026 ... 2X power efficiency and 10X latency reduction versus a pluggable version on the circuit board". No mm2 figure for 14 reticles.

## Candidate issues (to confirm)
- "14-reticle interposer of roughly 12,000 mm2": computed (14 x 858), not in source.
- specimenCaption "about 2,700 mm2": computed from drawing; no source.
- "30 to 40 microns apart" microbump pitch: uncited figure (body + glossary).
- Glossary hybrid bonding aka includes "Foveros" (Foveros uses solder microbumps); "face to face" wrong as definition (V-Cache gen 1 and HBM are face to back).
- Animation step 2 "thin slab of silicon" for a two-die, eight-stack (CoWoS-L class, ~4.25 reticle in drawing) package.
- CoWoS capacity figures are TrendForce/SemiWiki estimates relayed by Epoch.

## All 29 cited URLs opened (20 Oct). Verified OK unless noted
Epoch constraints (12 Mar 2026: "around 90%", table 60.3/56.5-64.3/13.5/8.4/7.4/10.4; capacity = "benchmarks from SemiWiki and TrendForce"); Epoch B200 (10 Dec 2025: $1,100 CoWoS-L, $900 two dies); ASML NXE:3400C ("maximum exposure field of 26 x 33 mm"); JEDEC SPHBM4 (13 Jul 2026; 2048 vs 512 signals, "4:1 serialization to achieve the same bandwidth"); Nvidia Hopper (814 mm2, "5 HBM3 stacks"); 3DFabric CoWoS (Wayback 13 Oct 2026: 3.3X ~2700mm2; "volume production in 2012"; CoWoS-R since 2023; CoWoS-L 3.5X since 2024); TSMC AR2025 ch5 p3/p4; 3302; AR2022 p97; 2Q24 p6; 3Q25 p7, p13; 2Q26 p10, p17 (p5, p8 Arizona); SA 12 Mar 2026; SA 4 Aug 2024; Intel Foveros brief (F2F; "36 µm microbump interconnects"; "EMIB 2.5D ... bridges embedded in the substrate"); SK hynix tech note 25 Aug 2026 (microbumps ~20µm, HB <1µm generic; HBM4E/HBM5 >20 layers); SA hybrid bonding (V-Cache SoIC-X, bottom die face down); Intel Fab 9 (cached copy; live 403); Intel 10-K FY2025 ("New Mexico being our key advanced packaging facility"); ASE 5 Feb 2026; Amkor ex99.1, 10-K ($407M Dec 2024; mfg 1H 2028), IR 6 Oct 2025; ASMPT 4 Mar 2026 (interim 29 Jul 2026 restates no TAM/target); Applied Kinex; ETO N71 via github provision.csv (Disco 87.0, $1.9B 2025); azcommerce (Wayback: 10 fabs, 2 AP, $265B); CSET (all tool figures; "four of the top ten" footnote 14 = marklapedus.substack.com, which says "according to TrendForce"); JCET 2048, 2052.

## Findings to act on
- 2Q24 p6: Wei also said CoWoS capacity "more than double" in 2024 and "Next year, it's more than double" -> "He said only..." misleading.
- 2Q26: "back-end ... still in shortage" is p17 not p10.
- EMIB clause not in SA; Intel brief supports it.
- 4Q25/1Q26 transcripts: no CoWoS capacity number given (chapter fine).
- ETO 2025 (TechInsights pub. 3 Jul 2026): N109 AP fab tools USA 65.8 JPN 15.3 CHN 5.3 ($6.2B); SoC test CHN 7.7; burn-in CHN 8.5; linear/discrete only 2021 (CHN 59.0). URL ?parentNode=N69&selectedNode=N109.
- Interactive glossary maps "Foveros" -> hybrid bonding (card US line, 3D section).
- Flashcards 3, 4 "Reread: The chokepoint" -> content is in Capacity / Who makes it.
