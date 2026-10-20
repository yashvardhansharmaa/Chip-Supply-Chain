# verify-c working notes (20 Oct 2026)

Scope: fact-check expert edits in ch 7, 8, 10. Report goes to qa/round2/verify-c.md.

## Progress
- [x] ch 7 (13 expert changes + main-session "item subject to US export rules" + figure note "on a side")
- [x] ch 8
- [x] ch 10 (fixed hybrid-bond scope in body + keyFact[5])
- [x] inherited-numbers sweep (ch 7: 7 TechInsights attributions; ch 10: 2 IDC + 1 TrendForce)
- [x] checks (all pass). Report: qa/round2/verify-c.md

## Findings
### ch 7 (verified against live downloads in scratch/verify-c: parhami.pdf, fr2022.pdf, fr2024.pdf, kla-q3.pdf, asml-escan.html, onto-q4.html via Wayback id_)
- 1 cost grows superlinearly: Parhami p8 "the cost of a die will grow superlinearly with its area" CONFIRMED
- 2 e-beam sources: FR 2024-28270 p37 q.1.b.2 "An electron-beam source with a resolution less (better) than or equal to 1.65 nm", q.1.b.4 "Two or more electron-beam sources." CONFIRMED
- 3 possible defect: no figure; KLA Q3 p4 "noise suppression" present. CONFIRMED
- 4 secondary electrons: ASML page "collecting and processing the resulting secondary electrons" CONFIRMED
- 5 small areas with electrons: Skyverse p11 (16-page PDF copy) optical ">1,000x faster", e-beam "线下抽样测量部分关键区域" CONFIRMED
- 6 share of equipment spending, p12: "KLA is seeing consistent growth in process control intensity"; invday p30 "Intensity Share of wafer equipment" CONFIRMED
- 7 whose work they check: no figure CONFIRMED
- 8 reflected light: no figure CONFIRMED
- 9 wafers and masks: ETO N60 description "monitoring wafers, photomasks" CONFIRMED
- 10 overlay lines up: N114 "alignment accuracy between successive lithographic layers" CONFIRMED
- 11 how flat the wafer is: N65 "warpage, and bow" CONFIRMED
- 12 Onto Feb 2026: release dated February 19, 2026; "Closed a new volume purchase agreement estimated at over $240 million with a leading high bandwidth memory (HBM) manufacturer" CONFIRMED
- 13 on a side (plain + HIW): Parhami p8 "1 x 1 and 2 x 2 cm" CONFIRMED
- main: "item subject to US export rules": FR 2022 p5 "imposes a license requirement on any item subject to the EAR" CONFIRMED. Takeaways still say "any US-made tool" (narrower, true; not changed)
- main: figure note "on a side": animation now says "on a side" in captions; D0 = 0.8, 120/26 dies CONFIRMED
### ch 8 (live/Wayback copies in scratch/verify-c/ch8)
- 1,2 SA N+3 (14 Jun 2026): "Intel 18A supports an M0 pitch of 32 nm, although Panther Lake has only shipped with a looser 36 nm pitch"; "incomplete cherry picked metric"; 113.4/107.7 CONFIRMED
- 3 Intel 27 Jan 2007 (Wayback 20261011): "more than a 20 percent increase in drive current... Conversely it reduces source-drain leakage by more than five times"; "more than 10 times" CONFIRMED
- 4 leakage wording: no figure CONFIRMED
- 5 imec: "selectively etching away the SiGe" CONFIRMED
- 6 Samsung 30 Jun 2022: "implemented for the first time ever"; computed "three years" removed CONFIRMED
- 7 SA clash (1 Oct 2024): A16 "backside contact scheme"; "Contacts for power routing are formed beneath sources and drains" (SA does not use the name SPR; TSMC 3136 ties SPR to A16) CONFIRMED
- 8 TSMC 3228: "Planned to enter production in 2028... more than 20% increase in logic density" CONFIRMED
- 9 TSMC 3302: A13 "direct shrink of its ... A14", A12 "A14 platform enhancement", A13 2029 "one year after A14" CONFIRMED
- 10 keyFact "or": 3228 CONFIRMED
- 11 chinaStatus: SA SAQP/SADP, June 2026 CONFIRMED
- 12 CSIS 24 Sep 2025 "DUV machines stockpiled from ASML before export restrictions took effect" CONFIRMED; Reuters 401 live and all Wayback captures (401); wire text matches in several syndicated copies (wdez.com, tribune.com.pk, kathmandupost.com, thestandard.com.hk): "planned to produce about five this year and roughly 20 in 2027" attributed to The Information; "expected to require further testing and remains far from matching" CONFIRMED (safe)
- 13 SA 2024 "SRAM bit cell scaling has stagnated since the 5nm node"; TSMC research (Wayback 20251205) "0.021um2 high-density bitcell, and through DTCO improves the overall SRAM density by 1.1x" CONFIRMED; bib entry present (line 1842)
- 14 leading-edge flows CONFIRMED; 15 Entegris "up to 30% lower resistivity than tungsten in thin films" CONFIRMED; 16 CSIS "most advanced EUV systems" CONFIRMED; 17 bridge semicolon CONFIRMED
- Inherited: none (Epoch $17,000 is Epoch's own estimate)

- Inherited: ETO provision.csv source column = "CSET analysis of TechInsights data (2025)" for every N60-family row. Gartner (invday p35) named in lead, usStatus, keyFact 4. KLA "industry research reports" (Q3 p3) unnamed firm: flag only.
