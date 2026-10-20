# expert-transistors-and-front-end: progress notes (20 Oct 2026)

Working notes; the report is `qa/round2/expert-transistors-and-front-end.md`. Evidence below is paraphrased; the downloaded copies are in `qa/round2/scratch/expert-transistors-and-front-end/`.

## Status
- [x] Read brief, rules, schema, writing skill
- [x] Read chapter, flashcards, glossary entries, animation + captions
- [x] Fetched and checked every source (35 URLs, plus one new)
- [x] Edits to `content/08-transistors-and-front-end.md`
- [x] Build and the three checks (all pass)
- [x] Report + proposals for shared files

## Source checks (what each source says, paraphrased)
- SemiAnalysis SMIC N+3 teardown (14 Jun 2026): N+3 M0 pitch 32.5 nm; Panther Lake ships a 36 nm M0, but Intel 18A itself supports 32 nm (heavy use of high-performance libraries); 113.4 vs 107.7 MTr/mm2 (Bohr metric) for TSMC N6; CGP 57 nm; M0 consistent with SAQP, M1/M2 with SADP; calls N+3 SMIC's third-generation 7 nm process.
- SemiAnalysis Panther Lake teardown (26 Sep 2026): table note says the 18A PDK provides a 32 nm M0 pitch and the HP libraries shipped at 36 nm; four ribbons on 18A, three sheets on Samsung SF2; SF2 in Exynos 2600, N2 in Apple A20 Pro.
- Intel release 1772 (16 Jun 2026): 18A-P 9% faster at iso power; 11% routed area and 10x dynamic droop reduction against a comparable front-side design; GAA and backside power brought to market in 2025.
- Intel 18A page: in high-volume production in the United States; PowerVia billed as industry first.
- Intel release (27 Jan 2007): high-k cut gate leakage more than tenfold; with the metal gate, either 20%+ more drive current or, conversely, 5x+ lower source-drain leakage.
- TSMC HPC page (Wayback, 14 Oct 2026): N2P 18%/36%/1.2x/1.15x over N3E; A16 8-10%/15-20%/up to 1.10x over N2P; A14 on track for 2028.
- TSMC A16 page (Wayback, 1 Aug 2026): backside contact scheme; production-ready in 2H26.
- TSMC 3136 (24 Apr 2024): NanoFlex short and tall cells in one block. 3228 (23 Apr 2025): A14 production 2028, up to 15% speed or up to 30% power vs N2, more than 20% logic density. 3302 (22 Apr 2026): A13 6% area, 2029, one year after A14; A12 with Super Power Rail, 2029; N2U 3-4% or 8-10% vs N2P, 2028. 3302 has no A14 speed or density figures.
- TSMC research page (2025 paper summary): 2 nm SRAM at 38.1 Mb/mm2 with a 0.021 um2 high-density bitcell, density up 1.1x over the previous node through DTCO.
- SemiAnalysis Clash of the Foundries (1 Oct 2024): reports TSMC's 22% SRAM claim N3E to N2, mostly from periphery; bitcell scaling stalled since 5 nm; TSMC A16 uses backside contacts formed beneath sources and drains. Nothing about SRAM hurting AI chips most.
- SemiAnalysis Future of the Transistor (21 Feb 2023): Samsung 3 nm yield problems, high volume expected 2024.
- Samsung (30 Jun 2022): initial 3 nm GAA production; calls it the first GAA implementation ever; Hwaseong line.
- Reuters (28 Jul 2026): link blocked and every Wayback capture is a 401; wording verified through a syndicated copy of the same wire text (not cited). The five-in-2026 and about-20-in-2027 figures are The Information's; Reuters names the firm from one unnamed source, who says the machine needs more testing and is far from ASML's; deliveries to SMIC, Hua Hong and CXMT expected during 2026.
- CSIS (24 Sep 2025): $43 billion EUV announcement; EUV firmly out of reach; China's 7 nm chips relied on DUV tools stockpiled from ASML before restrictions.
- Nikkei (27 May 2024): 344 billion yuan ($47 billion), Big Fund Phase III.
- Federal Register 2024-19633: ECCN 3E905 GAAFET technology, worldwide license requirement, License Exception IEC, effective 6 Sep 2024.
- imec nanosheet, CFET, semi-damascene and 16 nm Ru (3 Jun 2025) pages; arXiv 2201.04725 (IBM and Nova: dummy gates; inner spacer protects S/D during SiGe removal); Applied Materials 21 Apr 2022 and 7 Oct 2025 releases; Entegris Mo blog; Rapidus x3; Epoch (10 Dec 2025); Nvidia Blackwell page; AMD MI455X page (launch 7/23/2026, TSMC 2nm and 3nm) and 2-page brochure (8 XCDs); Parhami PDF p. 8: all match the chapter.

## New bibliography entries
```json
{
  "https://research.tsmc.com/page/memory/4.html": {"title": "A 38.1Mb/mm2 SRAM in a 2nm-CMOS-Nanosheet Technology for High-Density and Energy-Efficient Compute", "publisher": "TSMC", "date": "2025", "type": "page", "accessed": "2026-10-20"}
}
```
Link status for the new URL: direct request 403 (bot check, as for other TSMC pages); raw Wayback copy 200 (captured 5 Dec 2025).
