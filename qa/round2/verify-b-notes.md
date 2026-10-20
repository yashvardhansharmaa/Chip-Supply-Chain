# verify-b: progress notes (20 Oct 2026)

Scope: verify expert edits in ch 4, 5, 6; inherited-numbers sweep; TEL "of sales" check vs ch 17.
Downloads: qa/round2/scratch/verify-b/

## Ch 4 (lithography)
Rows 1-5, 7-13 confirmed (TSMC 3338 copy: 6-inch/12-inch, 2031, 2033 "enter advanced node production", "driven primarily by ... transistor architectures"; NXE:3400B "maximum scanned exposure field size of 26 x 33 mm"; light page excimer; imec SAQP; strat p.16, p.30 (pdftotext -f 30 confirms index); San Diego; CSIS "i-line equipment ... only four percent"). Huawei sentence: no other file repeats it.
Row 6 FIX (2nd sentence): present tense "covers ... NXT:2000i and later" outdated since 7 Sep 2024 (ASML statement 6 Sep 2024 via Wayback: licenses also for "NXT:1970i and 1980i"; data/export-controls-timeline.json agrees). Dated it: "From 1 September 2023, Dutch export licensing covered ..." (ASML 30 Jun 2023, Wayback, my copy in scratch/verify-b/asml-dutch2023: "will come into effect on September 1, 2023"). DONE.
Inherited numbers: none (Nikon market scale 570 is Nikon's own, no attribution on p.8; Canon units own; ASML own).

## Ch 5 (photomasks)
All 17 rows confirmed. Hoya 2026 page fetched live (exceptionally high, multi-sourcing, EUV mask blanks). AGC data book p.8 rendered: EUV blanks "No.2 Worldwide*", "*Based on fiscal 2026 estimates by AGC", as of Jan 2026. TSMC 20-F "We also offer design, mask making". KLA Teron 6xx "for Mask Shop Applications", "EUV and optical patterned reticles". Zeiss AIMS, ASML pellicle 2022 ("can withstand temperatures of up to 500 degrees Celsius in a high-vacuum environment"), arXiv p.2 (40 bilayers, 7nm), Photronics 10-K sets, SMIC two Shanghai addresses, Lasertec fab inspection. Shared files (flashcards, glossary, mask animation) already updated by main session; no contradiction.
Inherited: ETO N29 shares (IMS 46.6, NuFlare 39.2, JEOL 14.2, $994M) = "CSET analysis of TechInsights data" (eto-provision.csv / eto-inputs.csv). Added TechInsights to card leader IMS, body (2 sentences), Takeaways. DONE.

## Ch 6 (deposition and etch)
Rows confirmed: 1, 2 (FR 2024 p.17: ">50:1, characteristic of advanced DRAM", stated in a deposition entry; fine with next sentence), 4-12, 14-16. Row 3/17: Applied 28,368,000,000 exact; Lam 23,232,690 thousand -> "$23.233 billion" is to-the-million (same form as published suppliers.json 23.233 and ch 7 KLA $13.579B) - note for owner, left. Row 13/17 FIX: AMEC says "约36.62%" and "约224.23%" -> "up about 36.62 percent" (body), keyFact "about 36.62%", "about 224.23%". DONE.
TEL row 11: p.27 % match filed net sales by region in FY2026 consolidated statements p.53 (my download): 832,555/2,443,533 and 1,015,060/2,431,568; all 7 region shares on p.27 match total net sales -> footnote 2 "new equipment sales" does not describe the chart. p.5 transcript: "proportion of sales in China was 34.1%". Confirmed. Ch 17: "China's share of sales fell from 44.4 percent ... to 34.1 percent ... (p.27)" - agrees. No "new equipment sales" left anywhere in content/data.
Inherited: TEL p.28 = "Gartner, Market Share: Semiconductor Wafer Fab Equipment, Worldwide, 2025" -> added Gartner to 2 body sentences, keyFact[3], figure label. ETO + CSET Beijing article = TechInsights -> added "by CSET's count from TechInsights data" to 5 card leaders, costSignal s1, test, chinaStatus s2, conductor/dielectric etch bullets, dry etch (Who makes it), 2019-2024 sentence, AMEC 12.4, dry strip, Takeaways x2. Left: sentences covered by a framing/same-paragraph sentence naming both (deposition bullets under "The market sizes ... below ... TechInsights"; China paragraph follow-ons; Kokusai; Takeaways s2). SIA/Accenture border crossings: 2 adjacent sentences name both.

## Inherited numbers sweep

## TEL ch 6 vs ch 17

STATUS: done. Report qa/round2/verify-b.md. Build + 3 checks clean after last edit.
