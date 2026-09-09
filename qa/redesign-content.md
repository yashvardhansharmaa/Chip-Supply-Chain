# Redesign display fields

## What I added

`data/export-controls-timeline.json` gains one key, `gist`, on all 43 events. Each is one sentence of 12 to 16 words saying what the move did to the AI chip chain, drawn only from that event's own title and summary, carrying no number the summary lacks, and avoiding the title's wording so a card can show both.

`data/control-thresholds.json` gains `kind`, `paramShort` and `unitShort` on all 40 rows. Kinds land as chips 13, tools 10, entities 4, fabs 4, models 3, memory 2, systems 2, trade 1, china 1. 4A090 sits in chips because it is the system holding the chip, so systems keeps only the supercomputer and cluster definitions.

Nothing existing changed. Both files parse, key order holds, and a diff against the originals shows no altered line.

## Two rules for rendering

Eight rows have `value: null`. On those `paramShort` is the finished headline, and the operator and value must not render. They are numbers 18 to 24 and 35 below.

Where the unit would only repeat the parameter name, `unitShort` is `""`. That covers numbers 1, 4, 8 and 13. Numbers 5 and 6 share a `paramShort`; the instrument line separates them.

## The 40 headlines

1. TPP >= 4800  (3a090a-tpp)
2. Performance density >= 5.92 TPP per mm²  (3a090a-performance-density)
3. Interconnect bandwidth >= 600 GB/s  (3a090-2022-original)
4. TPP >= and < 2400  (3a090b-tpp)
5. Memory bandwidth density > 2 GB/s per mm²  (3a090c-hbm-bandwidth-density)
6. Memory bandwidth density < 3.3 GB/s per mm²  (lic-exception-hbm-33)
7. Server or rack contains 4800 TPP chip  (4a090-computers)
8. TPP < 21000  (jan2026-review-band-tpp)
9. Total DRAM bandwidth < 6500 GB/s  (jan2026-dram-bandwidth-band)
10. China share of shipments <= 50 %  (jan2026-50pct-shipment-cap)
11. Transistor count >= 30000000000 transistors  (aicd-transistor-count)
12. Node <= 16 nm  (advanced-node-logic-16-14nm)
13. NAND layers >= 128  (advanced-node-nand-128-layers)
14. DRAM cell area < 0.0026 µm²  (advanced-node-dram)
15. Double-precision compute >= 100 petaflops  (supercomputer-end-use)
16. Dedicated chuck overlay <= 1.5 nm  (3b001-f1b-overlay)
17. US-origin content = 0 %  (3b001-litho-zero-de-minimis)
18. Designed for dry etching  (3b001-etch)
19. Designed for deposition  (3b001-deposition)
20. Designed for EUV  (3b001-euv-masks)
21. Inspects EUV masks  (3b002c-euv-mask-inspection)
22. Direct product of US technology  (fdpr-advanced-computing)
23. Direct product of US tools  (fdpr-sme)
24. Listed under Footnote 5  (fdpr-footnote-5)
25. Ownership share >= 50 %  (entity-list-affiliates-50pct)
26. Duration of the stay until 12 months  (entity-list-affiliates-suspension)
27. TWINSCAN model >= 2000  (nl-duv-nxt2000i)
28. TWINSCAN model line includes 1970  (nl-duv-nxt1970i-1980i)
29. Newly controlled equipment = 23 categories  (jp-meti-23-items)
30. Country TPP allocation <= 790000000 TPP  (ai-diffusion-country-cap)
31. Company TPP allocation <= 5064000000 TPP  (ai-diffusion-nveu-allocation)
32. Share outside Tier 1 <= 25 %  (ai-diffusion-uveu-shares)
33. Annual TPP per buyer <= 26900000 TPP  (ai-diffusion-lpp)
34. Training compute > 1e+26 operations  (ai-diffusion-model-weights)
35. Moved into Country Group A:5  (uae-a5-2026)
36. Duty rate = 25 %  (section232-25pct-tariff)
37. Training compute > 1e+25 FLOP  (eu-ai-act-gpai-compute)
38. Training compute > 1e+26 operations  (us-model-reporting-1e26)
39. Cluster compute > 100000000000000000000 operations per second  (us-compute-cluster-reporting)
40. Chinese content by value >= 0.1 %  (cn-rare-earth-de-minimis)

## Rows that need a display string

Every problem below comes from the existing `operator` and `value` fields, which I left alone. Each row needs a rendering rule instead.

| # | Show instead of the headline above |
|---|---|
| 4 | TPP 2400 to 4800 |
| 7 | Contains a chip at 4800 TPP or above |
| 11 | 30 billion transistors |
| 17 | Zero de minimis, so any US content counts |
| 26 | Stayed 12 months, to 9 November 2026 |
| 27 | TWINSCAN NXT:2000i and later |
| 28 | Includes TWINSCAN NXT:1970i and 1980i |
| 30 | 790 million TPP |
| 31 | 5.06 billion TPP |
| 33 | 26.9 million TPP |
| 34 | 10^26 operations |
| 37 | 10^25 FLOP |
| 38 | 10^26 operations |
| 39 | 10^20 operations per second |

JavaScript prints `1e20` in full digits but `1e25` and `1e26` in exponent form, so the formatter has to handle both. Number 12 also carries a second trigger with no number, any non-planar transistor at any node, which the 16 nm headline hides.
