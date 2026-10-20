# exposure-join: progress notes

Slug `exposure-join`, screenshot port 9804, shots in `qa/round2/shots/exposure-join/`.

## Plan
1. Deep links `#/exposure/<slug>`: ids on each `.ex-panel` (`ex-<slug>`), router entry, scroll + short flash (none under reduced motion), search entries point at the firm.
2. Suppliers: build.js attaches `china: {label, href, short}` to each covered supplier in DATA (build/exposure.js); ladder shows the quiet form, detail shows the label as a link to the chart.
3. EU-27 grouping in the ribbons (toggle), EU-27 option in the country filter, EU line on member countries' Glossary cards.
4. Note on how firms are assigned to countries: ribbons (Suppliers, By country) and Glossary country cards.
5. check-integrity.js: exposure-to-supplier check through build/exposure.js aliases.
6. exposureViz: category order (Foundry, Photomasks, Packaging, Chemicals), group firms by category, short caption name for Besi.

## Findings
- Glossary country cards are drawn by `countryCard` in src/modules/lookup.js (not app.js). Edited there, surgically.
- The Suppliers atlas (HOME_MAP, build/modules/summary-a.js) also shows country shares; not my file, left alone.
- Matrix: revenue rows count firms by parent-company HQ; Arm is the exception (own HQ, GB) per chokepoint-matrix-notes.md; logic manufacturing and ATP rows count capacity by site location.

## Log
- 01:40 build.js: exposureViz ids (ex-<slug>, tabindex -1), CAT_ORDER + grouped sort, Besi short caption, adaptive time axis and scale; DATA suppliers carry china {label, short, href}; DATA.exposureLinks.
- app.js: router #/exposure/<slug> + Controls.focusFirm (scroll, focus on in-page nav, flash unless reduced); search entries -> firm chart; Suppliers: EU-27 grouping (toggle, filter option, colOf/keyOf), China tag in ladder, China line in detail, label in table, note under ribbons.
- lookup.js countryCard: EU-27 line for members, assignment note (tailored examples: DE siemens+linde, US siemens, GB arm+linde).
- check-integrity: alias-aware, one line per firm; only Veeco warns.
- Verified ETO providers.csv (saved in qa/round2/scratch/exposure-join/providers.csv): "Linde,,P250,organization,DEU"; "Mentor Graphics,,P187,organization,USA"; "ARM,,P198,organization,GBR".
- Other agent has added TSMC (Foundry), Disco (Advanced Packaging & OSAT), Hoya (Photomasks) so far.
- 02:10 verified in headless Chrome: cold #/exposure/asml lands at 108px with the wash, no focus; in-page link focuses the figure (ring only for keyboard), no tooltip on figure focus; reduced motion: no wash; #/exposure and unknown slugs go to the top; search hits point at #/exposure/<slug>.
- EU-27: toggle, filter option "EU-27 members (23)", Other count follows the drawing (27 / 18), tooltips name member countries, #/suppliers?tab=country&group=eu lands on the ribbons with the EU lit.
- Fixes on the way: orphan commas in the ladder (names joined by spaces, .sup-nw nowrap); clipped focus rings on the Ladder/Table and new switch buttons.
- 26-firm layout checked with Lasertec and AGC simulated in qa/round2/scratch/exposure-join/sim26.html (not real data): one row per category at desktop width, no overflow at 390px.
- Checks: node --check ok; build ok; check-speak no matches; check-integrity only "exposure row for Veeco Instruments has no supplier entry" from my section; check-sources all A/B.
