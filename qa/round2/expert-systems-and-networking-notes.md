# expert-systems-and-networking: progress notes (20 Oct 2026)

Working notes; the report is qa/round2/expert-systems-and-networking.md.

## Status
- [x] Read brief, rules, schema, writing skill, chapter, flashcards, glossary (12 terms), racks animation and captions, links.json (35 entries, all ok/rechecked; Marvell FY2026 10-K URL not in links.json)
- [x] Fetch and check every source
- [x] Edits to content/14-systems-and-networking.md (20 changes)
- [x] Proposals for shared files (in the report)
- [x] Build and checks (once, at the end): all clean
- [x] Report: qa/round2/expert-systems-and-networking.md. Status: done.

## First-read expert flags (to verify)
1. "tens of times faster" (scale-up vs scale-out): Nvidia's NVLink GB/s counts both directions; NIC Gb/s counts one. Like for like, about 9x (NVLink 5 vs 800G). Glossary scale-up entry repeats it.
2. Baseboard sentence: "a baseboard that carries their power and the switch chips" is Nvidia HGX only; AMD's OAM/UBB boards link the eight GPUs directly (no switch chips). Glossary baseboard entry repeats it.
3. "the chip on a small board with its power supply and memory stacks": HBM stacks are inside the package (ch 11), not on the module board.
4. "Every AI cluster runs two networks": clusters also run a front-end (storage/management) network; two networks join the accelerators.
5. "InfiniBand, the specialized network built for supercomputers": IB was designed as a server I/O fabric (1999); long used in supercomputers.
6. Tomahawk 6 Davisson "70 percent, more than 3.5 times lower": a 70 percent cut is 3.3x; check Broadcom wording.
7. Glossary co-packaged optics: "puts the lasers ... onto the switch chip's own package" contradicts the body (Broadcom keeps lasers in field-replaceable modules; Nvidia CPO too?).
8. Flashcard 3, takeaway 3, glossary ODM: "an estimated several quarters" (cut from the chapter as unsourced) still there. Glossary ODM "Several contract manufacturers on three continents" (cut too). Glossary transceiver "which only a few firms can make" (cut too). Glossary Ethernet "sells to any buyer" (cut too).
9. Glossary scale-up: "a few dozen accelerators inside one rack" vs body "a few dozen to thousands" (Google 9,216); "sets the size of model that can be trained" is wrong (it limits efficiency).
10. Glossary InfiniBand: "AI clusters used it ... before Ethernet caught up" reads as past; IB still links large AI clusters in 2026.
11. Vera Rubin naming: Oct 2025 blog may say NVL144 (renamed NVL72 at CES Jan 2026) - check.
12. "Optical modules are assembled where labor and land are cheap" uncited (flagged by last fix agent).
13. Circuit-board bullet "concentrated in Taiwan and Japan" uncited; check ch 12.
14. InP substrates: Sumitomo Electric and JX Advanced Metals (Japan) also make them; the bullet only names AXT (China). Owner question.
15. NVLink page "still lists preliminary figures of 3,000 GB/s and 216 TB/s" - recheck the live page.
16. FCC Covered List "As of 16 October 2026" - recheck today.
17. plain "draws more than a thousand amps" uncited.
18. Specimen caption "about 510 by 400 mm" unsourced (OCP UBB is 417 x 585 mm?) - check.

## Source checks (all opened 20 Oct; copies in qa/round2/scratch/expert-systems-and-networking/)
- Confirmed as cited: Nvidia 10-Q Apr 2026 (DC $75.2B, "InfiniBand, Spectrum-X Ethernet, and NVLink"), 10-Q Jul 2026 ($89.0B, up 117%), 10-K FY26 ("networking offerings include NVLink interconnects and switches"), Broadcom 8-K ($16.7B, 221%, 54%), Broadcom 10-K, Marvell 10-K FY26 + AWS 8-K, Credo 10-K ("rack-to-rack ... up to 7-meter reach"), AXT 10-Q (all four statements verbatim), USGS (70%, Feb 2025, InP diodes), FCC order pp. 3/6/10, Covered List "(October 16, 2026)" no InnoLight/Coherent, Rubin release (3.6TB/s, 260TB/s), NVLink page (still 3,000 GB/s, 216 TB/s "Preliminary"), NVL72 components page (18/9 trays, "2 NVSwitch ASICs per tray", 142 kW), Megatron parallelism guide (redirect), Oct 2025 blog (editor's note NVL144 -> NVL72; same MGX footprint; 50+ partners), Coherent and Lumentum releases, CPO release, UALink blog, AMD Helios (23 Jul 2026, UALoE), Google Ironwood, UEC 1.0, Tomahawk 4/5/6 (Wayback raw), Davisson (Wayback raw; "Field-Replaceable ELSFP Laser Modules"), InnoLight, Eoptolink, Hon Hai (16 Mar 2026), SemiAnalysis $3.1M/$3.9M, Nikkei (27 May 2026 JST).
- Problems: (a) Coherent groundbreaking was 16 June 2026 (coherent.com release; Nvidia blog's "this month" text was already in the 1 July original) -> body "August 2026" wrong. (b) "rack-scale systems ... production delays": April 10-Q says "sophisticated system configurations"; July 10-Q says "the complexity of producing our data center systems has caused ... delays in production". (c) Davisson: Broadcom pairs "70% reduction" with "more than 3.5x lower" (70% = 3.3x). (d) Fusion: Fujitsu and Qualcomm "Each Plan to Build" CPUs. (e) Hon Hai never calls cloud/networking a driver; says they "surpassed ... smart consumer electronics ... for the first time ... largest product category in the quarter". (f) InnoLight Taiwan is "service and delivery", not production. (g) "tens of times faster": NVLink figures are bidirectional; SemiAnalysis CPO book (1 Jan 2026): "9x more bandwidth per GPU than the 100GByte/s (800Gbit/s) per GPU on the back-end scale out network (using the CX-8 NIC for the GB300 NVL72)". (h) SemiAnalysis 100k H100: "GPU deployments have multiple networks, frontend, backend, and scale up (NVLink)". (i) TTM 10-K: "For PCBs, our competitors are mostly based in China and Taiwan" vs ch 14 "concentrated in Taiwan and Japan"; Nittobo IR p. 7 "NE-glass is used in switches and routers in supercomputers and data centers". (j) AXT 10-Q: "Sumitomo and JX also compete with us in the InP market."
- Newer than chapter: Nvidia Q2 FY27 8-K "Spectrum-6 switch systems — supporting both pluggable and co-packaged optics ... — are arriving across the world's gigascale AI factories" (CPO "due in 2026" stale, not wrong). UEC site now offers spec 1.1.
