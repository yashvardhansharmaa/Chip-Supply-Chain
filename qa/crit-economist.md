# Compute Chokepoints — review by a semiconductor economist

Read-only, 10 September 2026. Figures checked against ETO's `provision.csv`, Epoch AI, Stimson and CSET's 2021 brief.

## Verdict

The notes in `chokepoint-matrix-notes.md` and `exposure-notes.md` beat most sell-side methodology sections: they name the headquarters-versus-site cut, the fiscal-year collisions, the ship-to and bill-to bases, and the rows they could not fill. That is the site's real asset. Two things stop me citing it. The chokepoint score measures nothing a reader can reconstruct. And the `source` field on several matrix rows points at documents that do not contain the number, while the reasoning that does support it sits in a `note` no data user sees.

## Score audit

**No variance.** The 17 chapters score 5 (8), 4 (8), 3 (1); nothing scores 1 or 2. `concentration` is defined as Extreme/High/Moderate/Low, and only Extreme (9) and High (8) appear. The scored chain strip, the site's signature navigation, reads 4,4,4,5,5,4,4,5,5,5,5,5,4,3,4.

**It restates `concentration`.** Extreme→5 in 8 of 9 cases, High→4 in 7 of 8: the label predicts the score in 15 of 17 chapters. Spearman between score and substitution midpoint is only 0.36, though the glossary names substitution an input — packaging scores 5 on a 3–5 year clock, metrology 4 on 10+.

**Inconsistent pairs.** Metrology beats photomasks on both measurable inputs — HHI 5,412 v 4,458, substitution 10+ v 5–10 — yet scores 4 against 5. Design/EDA is the only "Extreme" chapter scored 4, though its chokepoint is the one actually exercised (the five-week 2025 EDA cutoff). Foundries and design share a label and a band and differ by a point, unexplained.

**The clock has no consistent subject.** No `substitution.why` carries a citation, and three quantities share one scale: ch06, 07, 08 and 17 time *China*; ch01, 02, 03, 12 and 13 time *any second source's qualification*; ch04 and ch05 time *the inventor* — "ASML built its first EUV prototype in 2001 and needed nearly two decades". Inventor lead time is not replacement time, and it overstates difficulty at the two stages scored highest.

**Replacement.** Publish two numbers: concentration, measured as HHI and top-2 per *segment* with metric and year (computable today from `chokepoint-matrix.json`); and substitutability, rated 1–5 against written criteria — qualification cycle, tacit knowledge, capital lump, installed-base lock-in, demonstrated entry — with the counterfactual actor fixed. The chapter is the wrong unit: ch03 spans photoresist (HHI 5,786) and gases (1,756), ch09 leading-edge (5,474) and mature logic (2,404). Score segments, aggregate up.

## Numbers audit

| Figure | Page | Source says | Verdict |
|---|---|---|---|
| Taiwan 92% of advanced capacity, "2025" | Geopolitics | Stimson, sourcing USITC Feb 2024 | Contradicts own matrix (TW 72, ≤5nm, 2025) |
| China "about half" mature-node | Geopolitics | CSIS, broader definition | Matrix says 38; its note calls the two non-comparable |
| Photoresist JP 75/US 8/KR 8/CN 4, 2024; and Japan 90%, 2021 (ch03 figure) | Matrix, ch03 | CSET gives suppliers and "China <5%" only; ETO N31 blank | Neither number is in the cited source, and the two disagree |
| EDA US 74; Core IP GB 48; wafers JP 51, all "2025" | Matrix | CSET's 2021 brief, 2019 data | Citation predates the year by six years, lacks the figures |
| Synopsys "$8B, 2025, incl. Ansys" | ch01 card | Matrix note: $7.05bn FY2025, incl. Ansys | Internal contradiction, ~13% |
| KLA "56.5% of process control, 2024" | ch07 card | ETO 2025: 56.8; site's figure 57.2; costSignal ~57 | Three site values; card prefers KLA's own count |
| ASML "above 80% of DUV" | ch04 card | Matrix and ch17: NL 95 | Site's own sharper number is 95 |
| EUV NL 100; deposition US 60.3; etch US 52.6; process control US 71.7 | Matrix | ETO `provision.csv` | Verified exactly |
| ATP CN 30/TW 28/US 3 (2022); masks JP 53/US 40 (2019) | Matrix | ETO S3, N33 | Verified exactly, honestly dated |
| CoWoS: Nvidia 60.3, Google 13.5, AMD 8.4 | ch11 | Epoch AI | Verified — but Epoch's denominator is SemiWiki and TrendForce, refused one row away |
| B200 ~$6,400; HBM3E $2,900 | ch16 | Epoch AI, range disclosed | Best-sourced number on the site |
| HBM 2025: 63.2 / 19.3 / 17.4 | ch10, matrix | SK hynix 424B4 | Consistent (KR 82.5); underlying figures are IDC's |
| ASML China 33%, 2025 | ch04 fig | Q4-25 deck, net *system* sales | Exposure page says 29.1% on *total* sales; caveat only in the JSON |
| Advantest 65% of a ~$9.0bn tester market | ch13 fig | Advantest's own briefing | Self-reported, drawn against "Teradyne and all others" |
| Gross margin, "most recent quarter" | ch16 fig | Releases spanning May–Aug 2026 | Micron's 84.6% is a peak (39.8% FY2025); not comparable |
| Wafers $11.4bn on 12,973 MSI | ch02 | SEMI, all diameters | An all-diameter total standing in for a 300 mm chokepoint |

The tier rule sorts by *publisher*, not evidence: TechInsights passes inside ETO, IDC inside a prospectus, but TrendForce inside Epoch is barred — and the rule admits a commentary recycling a 2024 USITC figure over the site's own better 2025 estimate. And because filings are Tier A while independent measurement mostly is not, it privileges self-reported shares: four of five leader entries in ch05 and three of five in ch12 are the firms' own claims, at the stages where concentration matters most.

## Ten additions, ranked by value over effort

1. **HHI and top-2 per segment**, with metric and year. Hours; the data is already in the matrix.
2. **A `basis` field per row** (measured / derived / estimate) and a source *list*, not one URL. Hours, and the largest credibility gain per hour.
3. **Split the score** into measured concentration and rated substitutability; publish the rubric and each stage's scoring line. Days.
4. **One definition of substitution time**: named actor, named end state, a basis line per stage. Days.
5. **Lead and capacity-addition times per stage.** Days. Transformers at 36 months, InP fabs at 18–24, fab build-out and CoWoS growth already sit in the prose; tabulated, they are the input every scenario needs.
6. **Time series 2018–2026.** Weeks, and the highest analytic value. Feasible from filings (`exposure.json` already holds five years), ETO 2019 against 2025, SIA/BCG 2021 and 2024, and the SK hynix prospectus's 2024/2025/1Q26 series. Every matrix row is one snapshot, `trend` is prose, and the build has no line-chart type.
7. **EUV installed base by country.** Weeks; the most feasible missing segment, from ASML's annual reports and customer filings. CoWoS capacity by country stays blocked; wafer starts by node need SEMI or SIA.
8. **China self-sufficiency by segment.** Weeks. The matrix has the CN shares; the addition is a domestic-demand denominator from CSIS and CSET.
9. **"Remove this supplier" scenarios** — ASML, TSMC Fab 18, SK hynix Icheon, Ajinomoto — stating output loss, horizon, substitution elasticity and inventory. Weeks, and dependent on 5 and 6. Highest policy value here.
10. **Cost stacks beyond the B200.** Weeks; Epoch's method extends to TPU v7 and MI355X.

## Presentation

Charts are honest where they exist: bars are zero-based, every share stack sums to 100, each carries a screen-reader table. The failures are comparability. `gross-margins` puts a cycle peak beside structural margins; use trailing-twelve-month figures or a five-year band. `market-2025` is titled "size of each layer of the chain", but the bars are nested, not layered — Nvidia's data-centre revenue sits inside SIA's $792bn, and hyperscaler capex buys much of both plus buildings and power. By numeric claims against figures, the pages that most need a chart are geopolitics (46 numbers, 3 figures), metrology (51, 3), silicon (48, 2), foundries (47, 2) and photomasks (21, 1). The country matrix is drawn nowhere — it feeds the map panels only — so the best dataset on the site has no chart.

## What would make me cite it

A segment-level table giving, per segment: metric, year, country shares, HHI, top-2, a basis flag, and a source URL that contains the number — downloadable, notes attached. Most of that is built; the gap is the citation field and two derived columns. Add the 2018–2026 series and the lead-time table and the scenario work stops being assertion. Fix Taiwan's 92 against the site's own 72 first: it is the figure every reader will check.
