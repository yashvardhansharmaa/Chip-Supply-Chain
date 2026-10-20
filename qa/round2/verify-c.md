# verify-c: fact-check of the expert edits in chapters 7, 8 and 10 (20 October 2026)

Method: I read every expert change against the source. Where I could, I opened the live source myself with the generic research User-Agent. For blocked hosts (TSMC, Intel, Micron IR, Onto IR) I used raw Wayback copies, and for long PDFs I extracted the cited page with `pdftotext -f N -l N`. My downloads are in `qa/round2/scratch/verify-c/` and my working notes are in `qa/round2/verify-c-notes.md`. Edits were made with the Edit tool in the three chapter files only.

## Counts

| Chapter | Checked | Confirmed | Fixed | Unverifiable | Inherited-number attributions added |
|---|---|---|---|---|---|
| 7 Metrology and Inspection | 15 (13 expert, 2 main session) | 15 | 0 | 0 | 7 sentences (the `plain`/How it works pair counts as one) |
| 8 Transistors and the Front End | 17 | 17 | 0 | 0 | 0 (none found) |
| 10 Memory and HBM | 14 | 12 | 2 (#3 body, #4 keyFact, one issue) | 0 | 3 sentences |

## Chapter 7

All confirmed. Key evidence:
- #1: Parhami p. 8, "the cost of a die will grow superlinearly with its area".
- #2: FR 2024-28270 p. 37, q.1.b.2 "An electron-beam source with a resolution less (better) than or equal to 1.65 nm" and q.1.b.4 "Two or more electron-beam sources".
- #4: ASML eScan 1100 page, "collecting and processing the resulting secondary electrons".
- #5: Skyverse 2025 summary p. 11. Optical inspection is more than 1,000 times faster than e-beam, and e-beam is used for offline sampling of key areas.
- #6: KLA Q3 FY26 p. 12, "consistent growth in process control intensity". Investor day p. 30 defines intensity as "Share of wafer equipment".
- #9 to #11: ETO descriptions for N60 ("wafers, photomasks"), N114 ("alignment accuracy between successive lithographic layers") and N65 ("warpage, and bow").
- #12: Onto release dated 19 February 2026, via Wayback: "Closed a new volume purchase agreement estimated at over $240 million with a leading high bandwidth memory (HBM) manufacturer".
- #13: Parhami p. 8, dies "1 × 1 and 2 × 2 cm".
- #3, #7 and #8 add no figures and are correct.
- Main session, "item subject to US export rules": FR 2022-21658 p. 5, "imposes a license requirement on any item subject to the EAR". Confirmed.
- Main session, figure note "on a side": the animation captions now say "on a side". The animation code uses D0 = 0.8 and 120 and 26 dies, matching Parhami Fig. 5.5. Confirmed.

## Chapter 8

All confirmed:
- #1 and #2: SemiAnalysis N+3 teardown, 14 June 2026, "Intel 18A supports an M0 pitch of 32 nm, although Panther Lake has only shipped with a looser 36 nm pitch" and "an incomplete cherry picked metric".
- #3: Intel release of 27 January 2007, "more than a 20 percent increase in drive current… Conversely it reduces source-drain leakage by more than five times".
- #5: imec, "selectively etching away the SiGe".
- #6: Samsung release of 30 June 2022, "implemented for the first time ever". The computed "three years" is gone.
- #7: SemiAnalysis, 1 October 2024. TSMC's A16 uses "a backside contact scheme", and such contacts "are formed beneath sources and drains". SemiAnalysis does not use the name Super Power Rail. TSMC 3136 ties that name to A16.
- #8 to #10: TSMC 3228, "Planned to enter production in 2028… more than 20% increase in logic density", with speed and power given as alternatives ("or"). TSMC 3302: A13 is a "direct shrink of its… A14" and arrives "one year after A14", and A12 is an "A14 platform enhancement".
- #13: TSMC research page, "0.021um2 high-density bitcell… improves the overall SRAM density by 1.1×". SemiAnalysis 2024, "SRAM bit cell scaling has stagnated since the 5nm node".
- #15: Entegris, "up to 30% lower resistivity than tungsten in thin films".
- #12, CSIS part: "DUV machines stockpiled from ASML before export restrictions took effect".
- #12, Reuters part. The Reuters page returns 401, its content API returns 401, and every Wayback capture stored a 401. The same Reuters wire text (Fanny Potkin, 28 July 2026) is carried on wdez.com, tribune.com.pk, kathmandupost.com and thestandard.com.hk, none of which is cited. It says The Information reported the firm "planned to produce about five this year and roughly 20 in 2027", and Reuters's source said the machine "is expected to require further testing and remains far from matching" ASML's models. My verdict is that the three sentences are safe as written.

## Chapter 10

Fix, #3 body and #4 keyFact. The SK hynix tech note (25 August 2026) gives these spacings for packaging in general: "solder bumps have a pitch of about 100µm, while microbumps are approximately 20µm. In contrast, Cu–Cu hybrid bonding shrinks the pitch to below 1µm". For HBM it says "the D2W approach is being adopted" and that thermocompression bonding is "unsuitable for pitches of approximately 7µm or below". I agree with the chapter 11 expert.
- Body. Before: "Microbumps sit about 20 micrometers apart, and hybrid bonds can sit less than 1 micrometer apart". After: "In chip packaging generally, microbumps sit about 20 micrometers apart, and hybrid bonds can sit less than 1 micrometer apart".
- keyFact[5]: the same insertion.

Confirmed:
- #1: IFP methodology, "(30 - 0.42) / 0.42 = 70x", where 30 is TrendForce's figure for global HBM shipments in gigabits.
- #2: 424B4, "As the first company to mass-produce multiple generations of HBM products, including HBM3 and HBM3E". Micron announced on 26 February 2024 (Wayback) that it "has begun volume production of its HBM3E". SK hynix's own HBM3E release is dated 19 March 2024. Attributing "first" to SK hynix's claim is therefore correct, and nothing else in the chapter or the data files makes an HBM3E "first" claim.
- #5: Micron HBM3E brief, "11mm x 11mm x 0.72mm". The specimen code is already 11 × 11.
- #7 and #8: Micron FY2026 10-K, "HBM requires a higher number of wafers and more cleanroom space to produce the same number of bits", "Taiwan: We are modernizing and expanding…", and "Singapore: We broke ground in January 2025… beginning in early calendar 2027".
- #9: Siemens, "Over 1.2 TB/s per stack (up to 1.33 TB/s)".
- #11 and #12: CSIS, "HBM2, which was first introduced in 2016, will be allowed (with end-use and end-user restrictions)" and the "technical performance thresholds for TPP and performance density".
- #13: tech note, "720µm to 775µm".
- #6, #10 and #14 add no figures and are correct.

## Inherited numbers

The ETO data's own source field reads "CSET analysis of TechInsights data (2025)" for every ch 7 node. Each attribution below adds a phrase and changes nothing else. A run of sentences from the same source in one paragraph is covered at its first sentence.

Ch 7 additions ("by CSET's count from TechInsights data", or the nearest equivalent):
- the lead's $15.7 billion
- the `plain`/How it works 56.8 percent
- the Variants intro ("…for 2025, from TechInsights data")
- "none holds more than 11.2 percent"
- "By CSET's 2025 count from TechInsights data, Chinese firms held 0.6 percent"
- "Every kind… had a second maker"
- Takeaways ("…research center working from TechInsights data")

Ch 7 sentences that already named both: the lead's 56.8/11.2 sentence, the China 0.7 percent sentence, and the Gartner sentences (investor day p. 35, "Source: Gartner April 2025"), meaning the lead, `usStatus` and keyFact 4.

Ch 10 additions:
- "…in the first quarter of 2026, according to IDC figures in SK hynix's US prospectus" (DRAM above 90 percent; 424B4: "according to IDC")
- the same phrase on the Takeaways sentence about Micron's 5.8 to 23.1 percent
- "working from TrendForce's estimate of world HBM shipments" on IFP's 70x

The HBM-share paragraph in "Who makes it" already names IDC and the prospectus.

Left for the main session (no edit, because of share-card re-renders and convention across chapters):
- oneLiners. Ch 7: append "from TechInsights data" (146 characters). Ch 10: "…SK hynix's US prospectus, citing IDC, gives it 63.2 percent of 2025 HBM revenue."
- Card fields with no firm named: ch 7 `leaders[0]`, `chinaStatus`, the CN note, `costSignal` and `substitutability`; ch 10 the three `leaders` and `test`.
- keyFacts: ch 7 [4] (CSET without TechInsights) and ch 10 [10] (IDC not named). Neither is rendered.
- ch 7 figure labels "ETO Supply Chain Explorer, CSET".
- KLA's 3.6 points, about 7 times and +14 points come from unnamed "industry research reports" (Q3 FY26 p. 3). They are attributed to KLA, but the firm cannot be named.

Other notes:
- ch 7 Takeaways still say "any US-made tool", which is true but narrower than the body.
- The ch 7 chokepoint sentence "One firm, KLA, held more than half…" has no citation.
- `data/suppliers.json` states Samsung's "first to ship commercial HBM4" as fact, where the chapter attributes it to Samsung.

## Checks
- `node build/build.js`: exit 0
- `check-speak`: no matches
- `check-integrity`: exit 0, with only the known "exposure row for Veeco Instruments has no supplier entry" warning
- `check-sources`: 2,516 citations, all tier A or B
- Front matter parses in all three chapters, and `plain` matches the first How it works paragraph in each.
