# Claude-speak final pass, the data files

**42 changes** across seven of the eight files in scope. `data/exposure.json` needed nothing.

Read every prose string in `glossary.json` (term, aka, plain, why), `control-flows.json` (what, labels), `export-controls-timeline.json` (summary, gist), `landscape.json` (status, exportStatus, notes, price and BOM estimates, precisionNote, interconnect text), `chokepoint-matrix.json` (method, note, trend), `control-thresholds.json` (note), `exposure.json` (note) and `suppliers.json` (role, shareNote), then grepped all eight for em dashes, `US$`, "data center", American -ize/-or/-er spellings, `%` in running prose, second person, first person plural, site self-reference and question marks. Three passes had already run, so most of what remained was mechanical: 22 of the 42 rows are spelling or unit conventions. The prose residue was six self-references or deictic openers, two second-person "you", two imperatives to the reader in the thresholds notes, four stem sentences announcing the next one, three restatements of a neighbouring sentence or field, and two weak qualifiers.

Nothing was changed in a number, date, id, key, URL, Federal Register or CFR citation, or quoted source text. The ECCN quotation "trained utilizing 10^26" in the compute threshold entry keeps its American spelling because it is quoted; "Center for Security and Emerging Technology" and the `data-centers-and-power` chapter key stay as proper names and keys. Three occurrences of "Licence Exception HBM/IEC" were normalised to the EAR's own form "License Exception", which the glossary and every other row already used. One out-of-scope spelling is left for the author: `control-thresholds.json` id `3a090a-tpp` has "datacentre" in its `scope` field, which is a label rather than a note.

## Categories

- **self** self-reference to the site, "here", or a deictic "This is" opener
- **stem** a sentence that exists to announce the next one, or a pre-judging opener ("the interesting part")
- **restate** restates the previous sentence or a neighbouring field the page prints alongside
- **you** second person or an instruction to the reader
- **qualifier** weak qualifier
- **spelling** British spelling, "data centre", "License Exception" as a term of art
- **percent** "percent" in running prose

## Changes

| File | Key or id | Before | After | Category |
|---|---|---|---|---|
| glossary.json | Concentration, plain | The site's four-band judgment of how many firms could credibly supply a stage today | A four-band judgement of how many firms could credibly supply a stage today | self, spelling |
| glossary.json | Substitutability, plain | The site's rating of how hard it would be for a well-funded state or firm | A four-band rating of how hard it would be for a well-funded state or firm | self |
| glossary.json | compute threshold, why | Every other threshold here measures a chip. | Every other control threshold measures a chip. | self |
| glossary.json | foreign direct product rule, why | This is what makes US controls extraterritorial. | The rule is what makes US controls extraterritorial. | self |
| glossary.json | pellicle, plain | It is a lens cap you can shoot through. | It is a lens cap a photographer can shoot through. | you |
| glossary.json | License Exception ACA, plain | it does not reach the datacentre parts that meet the 3A090.a parameters | it does not reach the data centre parts that meet the 3A090.a parameters | spelling |
| control-flows.json | ai-chips, what | Datacentre accelerators: the A100 | Data centre accelerators: the A100 | spelling |
| control-flows.json | hbm, what | Licence Exception HBM still carries stacks to a Chinese packaging house | License Exception HBM still carries stacks to a Chinese packaging house | spelling |
| export-controls-timeline.json | 2023-10-17-entity-additions, summary | meant to replace Nvidia parts in Chinese datacentres. | meant to replace Nvidia parts in Chinese data centres. | spelling |
| export-controls-timeline.json | 2024-09-06-gaafet-quantum, summary | Licence Exception IEC at §740.24 authorises | License Exception IEC at §740.24 authorises | spelling |
| export-controls-timeline.json | 2024-12-02-hbm-package, summary | and Licence Exception HBM at §740.25 still carries stacks | and License Exception HBM at §740.25 still carries stacks | spelling |
| landscape.json | nvidia-b200, notes | The first reticle-crossing Nvidia data center GPU | The first reticle-crossing Nvidia data centre GPU | spelling |
| landscape.json | amd-mi300x, notes | the first to break a data center GPU into a dozen chiplets | the first to break a data centre GPU into a dozen chiplets | spelling |
| landscape.json | google-tpu-v7-ironwood, interconnect.scaleOut | Jupiter optical-circuit-switched datacenter network | Jupiter optical-circuit-switched data centre network | spelling |
| landscape.json | google-tpu-v7-ironwood, exportStatus | Consumed inside Google datacenters and rented as Cloud TPU, so the control surface is physical shipment of racks abroad under the EAR advanced-computing rules rather than a per-chip license. | Consumed inside Google data centres and rented as Cloud TPU, so the control surface is physical shipment of racks abroad under the EAR advanced-computing rules rather than a per-chip licence. | spelling |
| landscape.json | google-tpu-v6e, interconnect.scaleOut | Data center network, 25.6 Tbps per pod | Data centre network, 25.6 Tbps per pod | spelling |
| landscape.json | google-tpu-v5p, interconnect.scaleOut | Data center network, 50 Gbps per chip | Data centre network, 50 Gbps per chip | spelling |
| landscape.json | google-tpu-v5e, interconnect.scaleOut | Data center network, 6.4 Tbps per pod | Data centre network, 6.4 Tbps per pod | spelling |
| landscape.json | meta-mtia-400, exportStatus | Not sold at all; consumed entirely inside Meta datacenters. | Not sold at all; consumed entirely inside Meta data centres. | spelling |
| landscape.json | meta-mtia-v2, status | Deployed inside Meta datacenters; superseded by MTIA 300 and MTIA 400 | Deployed inside Meta data centres; superseded by MTIA 300 and MTIA 400 | spelling |
| landscape.json | meta-mtia-v2, exportStatus | Not sold; consumed entirely inside Meta datacenters. | Not sold; consumed entirely inside Meta data centres. | spelling |
| landscape.json | openai-jalapeno, exportStatus | Not merchant silicon; deployed in OpenAI and partner datacenters. | Not merchant silicon; deployed in OpenAI and partner data centres. | spelling |
| landscape.json | nvidia-h20, exportStatus | It did not last: on 9 April 2025 the US government told Nvidia | On 9 April 2025 the US government told Nvidia | stem |
| landscape.json | nvidia-h800, notes | Two sources contradict each other on its interconnect: CSIS says 300 GB/s and Epoch AI says 400 GB/s. Both figures stand; neither is averaged away. | Two sources contradict each other on its interconnect, CSIS at 300 GB/s and Epoch AI at 400 GB/s, and both figures are carried rather than averaged. | restate |
| landscape.json | amd-mi325x, notes | AMD publishes no list price, no die areas and no assembler. AMD publishes no per-die area; Epoch AI's 1,017 mm2 for this silicon | AMD publishes no list price, no die areas and no assembler; Epoch AI's 1,017 mm2 for this silicon | restate |
| landscape.json | google-tpu-v5e, notes | It is also the clearest illustration of why BIS added a density test in October 2023. A chip can sit under the 4,800 line | It is also why BIS added a density test in October 2023: a chip can sit under the 4,800 line | stem |
| landscape.json | aws-trainium2, notes | It is also a good demonstration of how the export-control arithmetic behaves: FP8 doubles | It also shows how the export-control arithmetic behaves: FP8 doubles | stem |
| landscape.json | moore-threads-mtt-s5000, notes | which is how Chinese accelerators substitute for CUDA in practice. The company has been on the US Entity List since 17 October 2023, so it cannot lawfully buy US-origin technology without a licence that would be reviewed with a presumption of denial. | which is how Chinese accelerators substitute for CUDA in practice. | restate (the row's `exportStatus` already says it, with the citation) |
| chokepoint-matrix.json | EDA software, note | The single largest judgment call is Siemens EDA | The single largest judgement call is Siemens EDA | spelling |
| chokepoint-matrix.json | Leading-edge logic manufacturing (≤5 nm), note | A CHOKEPOINTS estimate, and the only one in the matrix's manufacturing rows. | The only estimate in the matrix's manufacturing rows. | restate (the `method` field opens with the same words) |
| control-thresholds.json | 3a090a-tpp, note | This is the master line for AI chips. | The master line for AI chips. | self |
| control-thresholds.json | supercomputer-end-use, note | even uncontrolled components need a licence if you know they are going into a Chinese machine of this size. | even uncontrolled components need a licence if the exporter knows they are going into a Chinese machine of this size. | you |
| control-thresholds.json | 3b001-litho-zero-de-minimis, note | Read the rule rather than a summary of it: the current eCFR text of 734.4(a)(3) keys | The current eCFR text of 734.4(a)(3) keys | you |
| control-thresholds.json | entity-list-affiliates-50pct, note | unless extended. Watch this date. It is the most consequential scheduled event in the map. | unless extended. It is the most consequential scheduled date in the map. | you |
| control-thresholds.json | fdpr-advanced-computing, note | This is what makes the American control map extraterritorial. | The rule that makes the American control map extraterritorial. | self |
| control-thresholds.json | us-model-reporting-1e26, note | only for the chips that train them. This is the gap in the map: the chip side is governed to five significant figures and the model side is not governed at all. | only for the chips that train them: the chip side is governed to five significant figures and the model side not at all. | restate |
| control-thresholds.json | ai-diffusion-nveu-allocation, note | The schedule is the interesting part: allocations rose eightfold | Allocations rose eightfold | stem |
| control-thresholds.json | ai-diffusion-country-cap, note | Kept here because the numbers define what a compute quota would look like | Kept in the map because the numbers define what a compute quota would look like | self |
| control-thresholds.json | ai-diffusion-uveu-shares, note | The 50% domestic-retention condition for US firms | The 50 percent domestic-retention condition for US firms | percent |
| control-thresholds.json | cn-rare-earth-de-minimis, note | and because 0.1% is stricter than any American de minimis figure | and because 0.1 percent is stricter than any American de minimis figure | percent |
| suppliers.json | Intel, role | which is listed here as its own entry. | which has its own entry. | self |
| suppliers.json | MediaTek, role | MediaTek has become a serious custom AI ASIC vendor | MediaTek has become a custom AI ASIC vendor | qualifier |
| suppliers.json | Victory Giant Technology, role | and has become a significant supplier of AI accelerator baseboards and switch boards to the server ODMs. | and supplies AI accelerator baseboards and switch boards to the server ODMs. | qualifier |

## Counts

| File | Rows |
|---|---|
| glossary.json | 6 |
| control-flows.json | 2 |
| export-controls-timeline.json | 3 |
| landscape.json | 17 |
| chokepoint-matrix.json | 2 |
| control-thresholds.json | 10 |
| exposure.json | 0 |
| suppliers.json | 3 |
| **Total** | **42** |

By category: spelling 22, self 8, stem 4, restate 4, you 4, percent 2, qualifier 2 (one row counts under two categories).

## Left alone on purpose

- "X, not Y" framings that carry a legal distinction: "A licence review policy, not a ban" (presumption of denial), "An enforcement order, not a licence policy" (denial order), "a residual category, not a free pass" (EAR99), "Chinese measures on Chinese buyers, not export controls" (control-flows china-market). Each is the point of the entry.
- The `%` in `shareNote` strings, exposure notes ("18.2% of revenue") and threshold `scope` labels: compact labels and table notes keep the sign.
- "carried here as Other", "treated as DE here" and similar in the matrix `method` and `note` fields: "here" means this row of the matrix, which the reader is looking at, and the three earlier passes kept it.
- The "CHOKEPOINTS estimate" label in the matrix: the author's own convention for a derived row, tied to the notes files.
- Quoted text: Nvidia's "we have been unable to sell all the products for which we have licenses" (timeline 2026-08-26) and the ECCN 4E091 "utilizing" quotation stay verbatim.

## Checks

- `python3 -c "import json,glob; [json.load(open(f)) for f in glob.glob('data/*.json')]"`: clean after every file.
- `node build/build.js`: exit 0, no warnings or errors, 17 chapters built.
- `node qa/scripts/check-integrity.js`: exit 0. Output is the 25 pre-existing "has no supplier entry" lines plus the summary line (`views: suppliers, controls, glossary, geopolitics, home, landscape, summary-a, walk, stack · ids: 737 · chapters: 17`); nothing new.
