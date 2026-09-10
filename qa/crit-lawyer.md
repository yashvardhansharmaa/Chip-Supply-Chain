# Export-control review: an EAR practitioner's read

Read at `localhost:8823/#/controls` (8765 was down) against `control-flows.json`, the 43 moves, the
withdrawn `control-thresholds.json`, the glossary, `landscape.json` and chapters 04, 09, 10 and 17.
Adds to `qa/nav-export-controls.md`.

## Verdict

The history is sound and the sourcing beats most law-firm trackers: 16 of 43 moves cite a Federal
Register permalink, the rest BIS, DOJ, MOFCOM, METI, government.nl or an SEC filing. The TPP
arithmetic is right everywhere I checked, the H20's 2,368 and its 2.9 density included. The
withdrawn threshold table was the most lawyerly thing on the site.

The board fails in one place: **the five states are not five legal outcomes.** The legend makes
*Licence* mean "a licence is required, often with a presumption of denial" and *Shut* mean "banned,
denied or listed". But a listing **is** a licence with a presumption of denial, so the two pills
describe one fact. Nothing separates *no licence needed* from *case by case* from *presumption of
denial* from *prohibited* — the four distinctions on which the decision to file turns. Two rows read
backwards: Advanced AI chips says CASE BY CASE for a flow whose text names Blackwell, while its own
history says "Blackwell still shut out"; AI chips to the rest of the world says CASE BY CASE when
Germany, Japan and Korea need no licence at all. Every date is an announcement date, and four rules
had a wind-down.

## Corrections

| Row | Says | Should say | Cite |
|---|---|---|---|
| Legend | "Shut: banned, denied or listed" | Four states: no licence · case by case · presumption of denial · prohibited. Listing is the third | — |
| AI chips, now | CASE BY CASE | Case by case only below TPP 21,000 **and** 6,500 GB/s; presumption of denial above, and on reexports and in-country transfers | FR 2026-00789; §742.6(b)(10) |
| AI chips, 17 Oct 2023 | SHUT | Presumption of denial; no prohibition. Effective 17 Nov 2023 | FR 2023-23055 |
| AI chips, 9 Apr 2025 | SHUT over "put under indefinite licence requirement" | Licence by is-informed letter, presumption of denial | 8-K; §744.23 |
| AI chips, 31 Aug and 7 Oct 2022 | Announcement dates | Imposed 26 Aug 2022, as the site's own H100 note says; the October rule published 13 Oct, effective 21 Oct, 12 Oct for §744.6 | 8-K; 87 FR 62186 |
| AI chips, 8 Dec 2025 | Flips on an announcement | Flips on the rule; summaries disagree, 13 vs 15 Jan 2026 | FR 2026-00789 |
| Rest of world, since 13 May 2025 | CASE BY CASE | No licence to A:5/A:6 and most destinations; licence for D:1/D:4/D:5 not also A:5/A:6 | §742.6(a)(6) |
| Tools, 29 Aug 2025 | Flips 29 Aug | VEU revoked with a 120-day wind-down; licences from 31 Dec 2025 | §748.15 |
| HBM, 2 Dec 2024 | "HBM2E and above, anywhere" | 3A090.c, > 2 GB/s/mm²; licence to D:5 and Macau, foreign stacks by FDPR; published 5 Dec; exception at §740.25 | FR 2024-28270 |
| US goods, all nine | SHUT since 2018 | Presumption of denial — but case by case for SMIC items not uniquely capable of ≤10 nm, and ZTE was a denial order, a different instrument | FR 2020-28031; 15 CFR 764 |
| Minerals, Dec 2024 | SHUT on "China → world" | Licence worldwide; prohibited **to the US** only. As drawn it misleads a European gallium buyer | Notice 46 |
| China's market, 21 May 2023 | SHUT | Micron barred from CII procurement: a cybersecurity review, not an export control | CAC |
| China's market, 26 Aug 2026 | SHUT | Mark reported-only; the summary concedes the PRC instruments are unpublished | 10-Q |
| Nexperia, 10 Oct 2025 | "Allied control" | Investment screening. The BIS penalty and DOJ indictment are Enforcement, not "Corporate" | — |
| AI Chips page | MTT S5000 "no Entity List placement verified"; H100 "never licensable" | Moore Threads was listed 17 Oct 2023, as the site's own timeline says; the H100 carries a presumption of denial, and applications may be filed | FR 2023-23055; §742.6(b)(10) |
| Ch. 17, UAE | "licence-free, no quantity cap" | Licences retained for 3A090.a/4A090.a except Supplement No. 8 consignees; Emirati authorisation sunsets 6 Apr 2027 | FR 2026-14132 |

**Missing moves:** the 6 September 2024 GAAFET and quantum rule (three threshold rows cite it, no
move exists); the Dutch tightening of 1 April 2025; the March 2025 listings; the MEU rule (§744.21);
NDAA §5949, whose 2027 procurement ban is being budgeted for now; China's Export Control Law. No
move carries a Federal Register volume-and-page citation.

**Bring the thresholds back** as a table, a CSV and a PDF appendix; nothing else answers "what is my
licence policy". Fix on the way: 3A090.b's parameter is garbled ("performance density >= and <
2400") and its note that the January 2026 band "sits above 3A090.a" is backwards, the band sits
inside .a; NAC split into NAC and ACA in December 2024 and the row still shows the 2023 position;
the supercomputer row gives 100 petaflops for both precisions (it is 100 double, 200 single) and
drops the 41,600 ft³ envelope; the October 2022 rule is dated 2022-10-07 in four rows and 2022-10-21
in four others; the Dutch extension is 7 September in one row, 9 September in another. Absent: ACA,
ECCN 4E091, Footnote 4 FDPR, §744.6, the 25/10 per cent de minimis baseline. Check §734.4(a)(3)
and §734.9(k).

## Ten additions, ranked

1. **Effective date, FR citation and CFR section on every move and state.** Largest gain. **S**
2. **The rule table back**, with a download. **M**
3. **Four states, each with its review policy in words.** **S**
4. **"What applies to this chip."** Half-built: `landscape.json` already holds computed TPP, density
   and an `exportStatus` line per chip. **M**
5. **Licence-exception matrix** — NAC, ACA, HBM, STA, RPL: ECCN, destinations, conditions. **M**
6. **Rule-change feed** (JSON/RSS) off the moves, with FR links. **S**
7. **eCFR deep links** per ECCN; two threshold rows already do this. **S**
8. **Pending rules and comment periods.** The never-finalised 89 FR 73612 rule is handled correctly
   already, so the pattern exists. **M**
9. **Country Group table**, Supplement No. 1 to Part 740. **S**
10. **Per-ECCN pages** — 3A090, 4A090, 3A090.c, 3B001, 4E091. **L**

All ten build from the Federal Register, BIS and eCFR alone, so the source rule costs nothing.

## Terminology

**TPP** is 2 × MacTOPS × bit length (the glossary drops the two), and it replaced nothing:
*performance density* replaced the interconnect test in 2023. **Performance density** is TPP over
*logic-die* area, HBM excluded, and only with TPP ≥ 1,600. **FDPR** needs a product scope *and* a
destination or end-user scope; "goods made anywhere by anyone" is far broader than the rule.
**Entity List** binds any exporter of items subject to the EAR, not "American suppliers", and review
policy varies by listing. **License exception** names none of the exceptions.

Missing outright: **EAR** and "subject to the EAR", **de minimis** (nowhere outside the withdrawn
dataset), **presumption of denial**, **Country Groups**, **VEU** (used in a move title, never
defined), **denial order**, **is-informed letter**, **reexport**, **in-country transfer**, **EAR99**.

## Would I send a client here

For orientation, gladly: the clearest account of the 2018–2026 sequence I have seen outside a
paywall. For an answer, no, and I would say so in the covering note: the states do not map to
licence outcomes, the dates are announcement dates, and no entry carries the citation a memo needs.
Fix the four states, print the effective date and the citation on every row, restore the rule table,
and it becomes the page I check on a Monday before I open the eCFR.
