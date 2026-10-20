# verify-a: fact-check of expert edits to chapters 1, 2 and 3 (20 October 2026)

Final. Sources opened live are saved in `qa/round2/scratch/verify-a/`.

## Chapter 1 (expert-design-and-eda)

- 3, 5, 6 (advanced-node scope, $18B with simulation, eda-share 44/30/13/13): confirmed against the live primer (fetched 20 Oct) and its three table images (t1 "Total TAM $18B" including "Simulation/Analysis (post-Ansys) $3.5B"; t2 "Global Share" 44%, 30%, 13%, ~13%; t3 "Tool-Level Market Share (Advanced Nodes)"). Note: the primer's prose also calls $18B "EDA+IP"; the tables include simulation, so the new wording follows the tables.
- 1 (tape-out order): confirmed. Live Siemens blog, "January 8, 2025": "Running post-tapeout flow (PTOF) jobs such as Optical Proximity Correction (OPC), Mask Process Correction (MPC), and Mask Data Preparation (MDP)". blogs.sw.siemens.com is in source-tiers. Glossary "tape-out" agrees.
- 2 (CSIS $725M cut): confirmed. CSIS Datawrapper lYtAp source line "Arm IPO Prospectus, and Quartr"; Arm F-1 "According to the International Business Strategy, Inc. ('IBS') ... approximately $725 million for a 2nm chip", "Source: IBS July 2022". No other chapter or data file uses 725 for this. Card respin sentence matches primer "A single respin at leading-edge nodes costs $50-100M" (21 May 2026), cited in body.
- 4, 9, 10 (STA wording, foundry definition, opening framing): confirmed (wording; ch 9 plain now reads "A foundry is a company that makes chips for other companies in its chip factories, or fabs", consistent).
- 7 (CSIS for three flows): confirmed. Live CSIS PDF: sentence starts at the foot of PDF p. 12 ("only a few companies make EDA software") and continues on p. 13 ("that supports the entire chip design flow ... known as the 'big three'"); #page=13 holds the substance. Primer: "no startup can replicate an EDA platform by rewriting from zero".
- 8 (CSIS p. 33): confirmed on live PDF p. 33.
- 11, 12 (requirement lifted; software and technology): confirmed, Cadence 8-K text.
- 13 (Broadcom-Meta, 14 Apr 2026): confirmed ("Multi-Gigawatts of Meta's Custom Silicon, MTIA"; "industry's first 2nm AI compute accelerator").
- 14 (Marvell 10-K): confirmed ("custom semiconductor solutions tailored to individual customer specifications ... for next-generation artificial intelligence"); ch 14 uses the same wording.
- 15 (Cadence ex. 99.01): confirmed ("Revenue of $5.297 billion").
- 16 (PIB, 25 Jul 2025): confirmed.
- 17 (SMIC): confirmed (Epoch: "SMIC, China's leading semiconductor foundry"; "Huawei's fabrication partner, SMIC").
- 18 (UCIe): confirmed ("support for 48 GT/s and 64 GT/s data rates").
- 19 (XDSiP, 5 Dec 2024 deck): confirmed (">6000mm2 of Si and 12 HBMs").
- 20 (OpenAI, Oct. 13, 2025): confirmed.
- Inherited numbers in ch 1: none found. RISC-V blog (SHD Group interview) relays Nvidia's own keynote statement, not an SHD figure; Arm's 50 percent is Arm's own claim.

## Chapter 2 (expert-silicon-and-wafers)

- 1 (quartz rock, USGS MCS 2026): confirmed on the live PDF: "The source of the silicon is silica in various natural forms, such as quartzite." plain = twin.
- 2 (separate out): confirmed (wording, no new claim).
- 3 (epitaxial layer): confirmed on the live SUMCO page: "An epitaxial wafer is a high-quality wafer for customers requiring an exceptionally perfect crystal structure or multiple layers having different resistivity." Glossary `epitaxy` already reads "Flaws in that layer can make the transistors leak".
- 4 (Soitec says): confirmed on the live page: "which today is used to make nearly all SOI wafers sold in the world."
- 5, 5a (METI p. 4 Europe 10 percent): confirmed on the live deck (same file as the expert copy). p. 4 wafer bar 53 / 10 / 37, the 10 in the navy colour the legend gives 欧州 (Europe); footnote 6 "2023年100%比 (富士経済「半導体材料市場の現状と将来展望 2024年」)". p. 8 2023 bar measures 53 / 10 / 13 / 19 / 5; p. 8 source "富士経済「半導体材料市場の現状と将来展望」を元に経済産業省が作成".
- 6 (weak demand): confirmed. SUMCO notice p. 24 "remained sluggish", "demand remains weak"; SEMI 10 Feb 2026 "slow momentum in traditional semiconductor applications".
- 7 (only a small share): confirmed on the live CSET PDF p. 55, Table 18 "<5% (<1% for 300 mm wafers)".
- 8 (keyFact dated 2025): confirmed, Siltronic April 2026 deck p. 5 "(figures for 2025)", "USD 1.4 bn".
- 9 (Shin-Etsu bullet): confirmed, results p. 6 "1,015.7", p. 20 "Semiconductor silicon" in the Electronics segment.
- Inherited numbers:
  - METI relays Fuji Keizai (53 percent, 10 percent, chart shares). Takeaways sentence and figure label name both. Two figure sentences in Who makes it did not, so added the attribution: "The chart prints only Japan's 53 percent" → "The ministry's chart of the Fuji Keizai survey prints only Japan's 53 percent"; "An earlier page of the deck prints Europe's share as 10 percent" → "An earlier page of the ministry's deck prints Europe's share in the same Fuji Keizai survey as 10 percent".
  - Siltronic p. 5 ($1.4bn electronic-grade silicon): the slide's single source line reads "Source: TechInsights & other companies, WSTS (Silicon based), SEMI SMG, Siltronic Marketing" for all four columns, so it does not attribute the $1.4bn to TechInsights. Left as Siltronic's figure; flagged for the owner.
  - USGS China 2023 polysilicon (1.50 Mt, 93, 98/2 percent): USGS compiles from several sources cited together (Aleina; Asian Metal Ltd.; Fang and others; Sun), no figure-level attribution. Left.
  - CSET 12/18 percent ("Source: SEMI, CSET calculations"), 99.7 percent (SEMI), Eswin 79.08/6.01/14.91 (SEMI Wafer Market Monitor plus filings), Eswin 7.7 percent (own), 78.8 percent (SEMI): Tier A origins, no change.

## Chapter 3 (expert-chemicals-gases-and-photoresist)

Live copies: SIA EPW testimony (12 pp.), SIA PAG study (28 pp.), USGS OFR 2024-1057 (76 pp.), MCS 2026 gallium and germanium, CSIS neon blog, Air Liquide electronics page, White House fact sheet, SEMI MMDS (Wayback 12 May 2026), CSET brief.

- 1, 2 (hundreds of inputs): confirmed, EPW PDF p. 6 "hundreds of chemical, gas, and material inputs".
- 3, 4, 5 (sensitivity; "little more happens"; hundreds of reactions): confirmed, PAG p. 6 "high photospeeds suitable for use with low-power sources", "typically during a postexposure bake (PEB)", "The number of cycles can range from hundreds to several thousands".
- 6 (KrF/ArF split, immersion): confirmed, PAG p. 4 "193-nm dry and immersion lithography".
- 7, 9, 14 (contact holes; NF3 fluorine; SK hynix): confirmed (terminology; glossary agrees).
- 8 (bulk gases by pipeline, specialty in cylinders): confirmed, Air Liquide "supply these gases in bulk, via pipelines or via production with on-site dedicated plants"; "~ 50,000 cylinders of specialty materials delivered each year".
- 10 (EMD as counted by CSET): confirmed, CSET p. 56 Table 18 "EMD Performance Materials (U.S.)"; four Chinese firms listed.
- 11, 12 (SEMI scope; card cost): confirmed. MMDS Wayback "Fab Materials Covered: Silicon, SOI, Photomasks, Photoresists, Photoresist Ancillaries, Gases, Process Chemicals, CMP"; the 12 May 2026 release says the $45.8bn comes from the MMDS.
- 13 (neon lasers): FIX. CSIS says only "Gas mixtures that include neon, krypton, and xenon power lasers are used in photolithography"; nothing about 248 or 193 nm. The EUV exclusion is in CSET endnote 260 (PDF p. 97): "Photolithography involves the use of various noble gases (e.g. neon, argon, and krypton) to create lasers ... The most advanced photolithography equipment, EUV, uses a tin light source rather than a gas-based light source." Before: "Gas mixtures containing neon fill the lasers in 248 nm and 193 nm scanners ([CSIS])." After: "Gas mixtures containing neon fill the lasers used in lithography, but EUV scanners use a tin light source instead ([CSET #page=97])."
- 15 (White House account): confirmed, "China will issue general licenses valid for exports of rare earths, gallium, germanium, antimony, and graphite".
- 16 (gallium 73 percent, 2025): confirmed, MCS 2026 "ICs accounted for 73% of domestic gallium consumption" in the 2025 Domestic Production and Use section.
- 17 (byproduct economics): confirmed, OFR PDF p. 11 "only economical as a byproduct"; "Germanium is also recovered during the leaching of certain zinc smelter residues and from coal ash".
- 18, 22 (germanium price, estimated): FIX for scope. The 2025e column is right, but MCS footnote 4 reads "Average European price for minimum 99.999% purity. Source: Argus Media group, Argus Non-Ferrous Markets." Before: "Germanium metal averaged an estimated $4,100 a kilogram in 2025, against $1,392 in 2023" (chokepoint and takeaways). After: "In Europe, germanium metal averaged an estimated $4,100 a kilogram in 2025, against $1,392 in 2023, on Argus Media prices reported by the US Geological Survey". keyFact: added "In Europe," and ", on Argus Media prices reported by USGS", and split it into two sentences. Figure title: "annual average price in Europe ($/kg)"; label: "Argus Media European prices, 2025 estimated".
- 19 (imports fell an estimated 67 percent): confirmed, "estimated to have decreased by 67% in 2025 ... owing to China's ban".
- 20 (USGS $3.4bn, October 2024): confirmed, OFR p. 9 "a complete restriction of China's net exports of gallium and germanium could cause the U.S. GDP to decrease by ... $3.4 billion ($1.7 billion to $9.0 billion) if disrupted simultaneously"; PDF created 7 Oct 2024.
- 21 (PFAS uses; PAGs): confirmed, PAG p. 4 "CARs depend on PAGs, most of which contain PFAS". The first sentence of the pair (etch gases, seals, filters, tank linings) stays uncited, as it was before.
- Inherited numbers:
  - Fuji Keizai via METI, 78 percent in `plain` and its twin: named neither. Added ", by a Fuji Keizai survey that Japan's trade ministry reproduced" to both (still identical).
  - Fuji Keizai via METI, slurry 51 and cleaning liquid 59 percent: sentence named Fuji Keizai only. Added ", as published by METI,".
  - 77/78 percent in Who makes it: the sentence before names both; left. keyFact and figure label name both.
  - CSET wet chemicals "more than 60 percent": CSET endnote 263 is "Mordor Intelligence" (full title in note 264, 2019). Before: "drawing on 2019 market reports"; after: "drawing on a 2019 report by the market research firm Mordor Intelligence".
  - CSET slurries $790 million and 56 percent: endnote 253 "Market Reports World, February 1, 2019". Added "Citing a 2019 report by the market research firm Market Reports World, it put ...".
  - Germanium prices: Argus Media via USGS, handled under item 18.
  - Not market research: CSET's 90 percent resist share is a July 2019 Reuters factbox (note 244, Tier B). CSIS's 70 percent neon figure links to Quartz (press) and the 90 percent has no link. USGS gallium 99 percent, RIETI 87.9 percent, JX 65 percent ("As of FY2026", no outside source), SIA 7 to 17 months: own figures.
  - oneLiner "Japanese companies held 78 percent of world photoresist sales in 2023." also lacks the attribution. Not edited: the oneLiner feeds the share-card PNG (build/cards.py), which would need a re-render. Proposed: "Japanese companies held 78 percent of world photoresist sales in 2023, by a Fuji Keizai survey that Japan's trade ministry reproduced. Supply of chip chemicals, gases and metals has been disrupted three times since 2019."
  - Card usStatus ("American companies ranked a distant second ... in 2023") rests on the same Fuji Keizai chart but states no figure; left.

## Counts
- Ch 1: 20 expert changes. 20 confirmed, 0 fixed, 0 unverifiable. No inherited numbers.
- Ch 2: 10 (1 to 9 plus 5a). 10 confirmed, 0 fixed, 0 unverifiable. Inherited-number attribution added to 2 sentences.
- Ch 3: 22. 19 confirmed, 3 fixed (13; 18 and its label 22), 0 unverifiable. Inherited-number attribution added to 4 places (plain plus twin, slurry/cleaning sentence, Mordor, Market Reports World), plus Argus under 18.

## For the owner
- Siltronic p. 5 source line lists TechInsights for the whole slide; the $1.4bn is not attributed figure by figure.
- Ch 3 oneLiner lacks the Fuji Keizai/METI attribution (proposal above; share-card re-render needed).
- Ch 2 figure title "From sand to wafer" still says sand (the expert's question 1).

## Checks (after the last edit)
`node build/build.js` exit 0 (01: 29 sources, 02: 30, 03: 49; D 0, ? 0). check-speak: no matches. check-integrity: only the known "exposure row for Veeco Instruments has no supplier entry". check-sources: 2516 citations, all tier A or B. Static pages show the new text and "p. 97".
