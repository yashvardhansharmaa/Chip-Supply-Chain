# expert-exposure: progress notes (20 October 2026)

Slug `expert-exposure`, screenshot port 9879. Downloads in `qa/round2/scratch/expert-exposure/`, shots in `qa/round2/shots/expert-exposure/`. Report in `qa/round2/expert-exposure.md`.

## Scope
- git diff: 17 rows added this round (TSMC x5, Disco x6, Hoya x6); no existing row changed. exposure-notes.md: ship-to sentence, new TSMC/Disco/Hoya section, fiscal-year paragraph, Lasertec and AGC paragraphs.
- Arithmetic: every row's chinaShare equals round(china / total x 100, 1) (checked all 125, Nova excepted).

## Log
- 20 Oct: all 32 SEC R pages fetched (200 with the research UA). TSMC (R120, R123, both 20-F texts), Disco (3 JP releases, pages 12/13/14/12), Hoya (4 IFRS reports, pp. 33/34) verified: all 17 new rows match to the digit; Hoya total = "Sales"; Disco 単一セグメント, 百万円未満切捨て; no Hong Kong mention in any of the three.
- TSMC basis says "by the country of the customer's headquarters"; filing says "mainly based on". Add "mainly".
- Rounding found: rows from filings in thousands (Besi EUR thousands; Cadence, Camtek, Entegris FY2021-23, KLA, Lam, Nova totals, Onto, Synopsys, Teradyne, Veeco USD thousands) hold amounts rounded to 0.1m. Two shares are wrong because of it: Camtek FY2022 141,959/320,909 = 44.24% -> 44.2 (file 44.3); Besi FY2022 187,572/722,870 = 25.95% (25.948) -> 25.9 (file 26.0). Plan: exact amounts in millions (e.g. 141.959), shares fixed.
- Samsung FY2022 note "That column restates the 2022 figures" is false: 2022 statements p88 give 35,625,769 / 302,231,360, same as 2023 statements p81. Samsung's subsidiary list puts SEHK (Hong Kong) and SET (Taiwan) in the China region (2021 p22, 2023 p22, 2025 p23).
- SCREEN FY2021 note "SPE is about four fifths": FY2021 SPE 235,497 of 320,322 (73.5%); FY2026 485,344 of 605,748. Replace with filed figures.
- Synopsys FY2024 ended 2 Nov 2024 (53 weeks); FY2025 ended 31 Oct 2025 (new calendar year end). fyEnd 2024-10 matches Synopsys's own presentation; add note.
- Nvidia: FY2026 10-K says prior periods "recast" (not restated); change wording.
- Nova basis lacks "customer location" (filing: "Revenues are attributed to countries based on the geographic location of the customer").
- Display: Nova label "China 33.0%" (false precision, filing gives 33%); Advantest tooltip "JPY billion 157.1m" bug. Code proposals only.
