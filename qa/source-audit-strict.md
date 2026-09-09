# Strict source audit (Tier A + four Tier B exceptions)

Log of every citation changed or deleted under the tightened rule of 9 September 2026. One section per chapter. Append below; do not rewrite other agents' sections.

---

## 01 · Introduction and Goals

Words before: 935. Words after: 935. Build: D 0 before and after.

No disallowed citations. All eight body citations, both figure sources and all eight keyFacts already traced to Tier A (Epoch AI, Nvidia investor releases, nvidia.com, arXiv). Checked and left unchanged.

---

## 02 · Chip Design, EDA and IP

Words before: 1,116. Words after: 1,162. Build: D 3 → D 0.

### Replacements

1. **Custom-ASIC economics.** Tom's Hardware, "custom AI ASICs examined" → Google, "Ironwood: the first Google TPU for the age of inference" (blog.google).
   Changed: dropped "Google claims 44% lower cost of ownership per Ironwood chip than a GB200 server". No allowed source states a TCO percentage; Google publishes efficiency, not cost of ownership. Replaced with Google's own figures: 192 GB of memory per chip, six times its predecessor's, and twice the performance per watt.

2. **Broadcom 3.5D XDSiP.** Tom's Hardware → Broadcom, "3.5D XDSiP platform technology" (docs.broadcom.com).
   Changed: number confirmed and extended. Broadcom's own deck says ">6000mm2 of Si and 12 HBMs", so the sentence now carries the HBM count as well as the silicon area.

3. **BIS EDA cut-off.** design-reuse.com → Cadence Design Systems Form 8-K of 3 July 2025 (sec.gov).
   Changed: the vague "ordered Synopsys, Cadence and Siemens EDA to stop selling" is now the filing's own facts. Cadence was notified on **23 May 2025** (the site previously implied a single late-May action) that EDA software under ECCNs 3D991 and 3E991 needed a licence for any party in China or any Chinese military end user anywhere. The existing Synopsys 8-K citation (29 May letter, 2 July rescission) is retained alongside it.

4. **China's EDA position.** SCMP, "China's top player Empyrean" → CSET, "Semiconductors: More U.S. Leverage, More Bad News For Beijing (Part 3)".
   Changed: deleted "Empyrean holds about half the domestic market", "more than 100 Chinese EDA firms" and "analysts place it in the global second tier". CSET supports no share numbers, so the claim is now qualitative and stronger: Chinese designers rely on US tools for all chip designs, US firms are the sole providers of full-spectrum leading-edge software, and Chinese EDA firms cannot yet support designs at those nodes. The card's `chinaStatus` was reworded to match.

5. **Design-services concentration.** Tom's Hardware → Broadcom investor releases (investors.broadcom.com), two of them: OpenAI/Broadcom 10 GW collaboration (13 October 2025) and the extended Meta MTIA partnership (14 April 2026).
   Changed: deleted "Broadcom and Marvell hold roughly 95% of custom AI ASIC co-design". No allowed source carries that share. The paragraph now names two partnerships the parties announced themselves, which supports the same argument without the estimate.

### Deletions

- **The chip/owner/design-partner/process table** and its "Per Tom's Hardware, May 2026" attribution. Five rows (TPU v7 Ironwood, MTIA 300, Trainium3, Maia 200, OpenAI custom accelerator) rested on one trade-press source for owner, design partner and process node. Only the Meta/Broadcom and OpenAI/Broadcom rows are confirmed by the companies, so the table was replaced with sourced prose rather than shipped one-third verified.
- **Huawei and Cambricon production targets** ("Ascend 910C targets 600,000 units in 2026", "Cambricon plans to triple output to 500,000 chips"). Only trade press carries these. The sentence now makes the supply-side point from CSET's Huawei report: SMIC's 7 nm capacity is tight enough that Huawei must choose between phone chips and AI chips.
- keyFact "Broadcom and Marvell together hold roughly 95% of the custom AI ASIC co-design market" (Tom's Hardware), replaced by two Tier A keyFacts: the OpenAI/Broadcom 10 GW collaboration and the >6,000 mm2 / 12 HBM figure for 3.5D XDSiP.

### Figures

All three unchanged: `eda-share`, `mask-cost` and `tool-lock` are sourced to SemiAnalysis, a named Tier B exception.

---

## 03 · Silicon and Wafers

Words before: 1,133. Words after: 1,226. Build: D 6 → D 0.

### Replacements

1. **Polysilicon purity grades.** pv-magazine (Bernreuter ranking) → USGS Mineral Commodity Summaries 2026, silicon (pubs.usgs.gov).
   Changed: deleted "Solar cells tolerate nine nines of purity; electronics demand eleven". No allowed source states the nines. USGS states that silicon metal is processed into ultra-high-purity semiconductor or solar grades, so the sentence now makes the grade distinction without the purity figures.

2. **Wafer market concentration.** Korea JoongAng Daily → Siltronic investor presentation, April 2026 (siltronic.com) plus CSET, "The Semiconductor Supply Chain".
   Changed: ">90 percent of the global wafer market" became "five major suppliers behind the entire $11.4 billion wafer market", which is what Siltronic's own value-chain slide says. CSET names the five firms and their home countries. The $11.4 billion matches SEMI's 2025 wafer revenue already cited in the chapter.

3. **SUMCO.** TrendForce → SUMCO convocation notice for the 27th ordinary general meeting (sumcosi.com).
   Changed: deleted "shelved a ¥225 billion plan for two new fabs" and "state subsidy fell from ¥75 billion to ¥19.3 billion". No allowed source covers the shelved fabs. Replaced with SUMCO's own FY2025 results, which serve the paragraph better: ¥409.7bn of net sales, operating profit down from ¥36.9bn to ¥1.3bn, an ¥11.8bn loss attributable to owners of parent, while adding leading-edge 300 mm capacity and reorganising weak 200 mm lines. Card leader entry and keyFact updated to match.

4. **China's polysilicon share.** pv-magazine (two citations) → USGS Minerals Yearbook, China, 2023 (pubs.usgs.gov) and the Siltronic presentation.
   Changed: "93.5 percent of the world's polysilicon in 2024" became "1.50 million tonnes in 2023, about 93 percent of world output", the USGS figure. Deleted "nine of the ten largest producers are Chinese" and the Wacker ranking ("ranks eighth by volume", "roughly 80,000 metric tons"). In their place, two allowed facts that make the same argument harder: USGS puts China's 2023 output at 98% solar-grade and 2% electronic-grade, and Siltronic sizes electronic-grade silicon at $1.4bn with five major suppliers (Wacker, Hemlock, OCI, Tokuyama, Mitsubishi), none Chinese.

5. **GlobalWafers Sherman.** Manufacturing Dive → GlobalWafers, "GlobalWafers America Officially Opens for Business" (sas-globalwafers.com) and the US Department of Commerce CHIPS award release (commerce.gov).
   Changed: the $3.5bn and May 2025 opening are confirmed by GlobalWafers itself, which adds that it is the first production line of its kind built in the US in over twenty years and that a further $4bn was announced the same day. The $406m CHIPS award is now sourced to Commerce and stated as "up to $406 million", the award's actual wording.

6. **450 mm.** The Register → CSET, "The Semiconductor Supply Chain".
   Changed: deleted "TSMC scoped a single new fab at $8 billion to $10 billion", the Global 450 Consortium membership list and the 2017 collapse date. CSET supports none of them. The paragraph now rests on two CSET facts that carry the same point: the last wafer size increase, to 300 mm, happened in 2002, and photolithography takes half the cost of processing a 300 mm wafer against a quarter of a 150 mm one.

### Deletions

- **Doosan / SK Siltron.** "Doosan agreed to buy 70.6 percent of SK Siltron for ₩2.3 trillion, about $1.6 billion" and the keyFact carrying it, plus "₩2tn revenue in 2025" from the SK Siltron card entry. The deal is covered only by Korean and trade press; no filing, regulator or allowed outlet carries it. The card entry now says only that SK Siltron is one of the five firms behind the wafer market.
- **NSIG / Zing 300 mm growth.** "grew 300 mm shipments more than 90 percent in the first half of 2026" (DigiTimes). Deleted from the body and from the card's `chinaStatus`. Replaced with a CSET figure that survives the rule and is more damning: Chinese producers supply 12 percent of the wafers consumed by China's own 300 mm fabs, against 18 percent at 200 mm and below.

### Figures

- `wafer-concentration` **rebuilt**. Was a two-slice stack ("five largest makers 90%", Korea JoongAng Daily). Now shows the wafer market by supplier headquarters from CSET's country-share table: Japan 56%, Taiwan 16%, Europe 14%, South Korea 10%, China 4%, United States 0%. Source and vintage (January 2021) stated in the caption.
- `polysilicon-capacity` **removed and replaced** by `polysilicon-grade`. The old figure ranked seven manufacturers by capacity from a Bernreuter table carried in pv-magazine; no allowed source publishes per-manufacturer polysilicon capacity, so that data cannot be rebuilt. The new figure carries the same argument from USGS: China's 2023 polysilicon output was 98% solar-grade and 2% electronic-grade. Front-matter entry and the `{{figure:...}}` marker were both changed.

---

## Domains added to data/source-tiers.json

Tier A: `docs.broadcom.com`, `investors.broadcom.com`, `pubs.usgs.gov`, `wacker.com`, `reports.wacker.com`, `doosan.com`. (`commerce.gov` was already listed.) No domain was added to Tier B; the four named exceptions are unchanged.

## Verification notes

Every replacement was fetched and read before it was cited, except two pages that refuse automated fetching but whose text was confirmed through search against the same domain: the Commerce CHIPS award release and semi.org. The SEC and Commerce URLs return 403 to a generic browser user agent and 200 to a declared one; both pages are live. No Reuters, FT or Nikkei page was cited, since none of the headlines or RSS snippets found for the deleted numbers stated the figures.

---

# Chapters 04, 05 and 06 — strict re-sourcing, 9 September 2026

Scope: `content/04-chemicals-gases-and-photoresist.md`, `content/05-lithography.md`, `content/06-photomasks-and-pellicles.md`. Build after the pass: `04 D 0 · ? 0`, `05 D 0 · ? 0`, `06 D 0 · ? 0`, no build warnings, front matter parses, figure markers match front matter, `plain` byte-identical to the first paragraph under "How it works" in all three.

## 04 Chemicals, Gases and Photoresist

Words before 1,143 · after 1,182. Figures: both kept (`resist-country` CSET, `germanium-price` USGS).

### Replacements

| Old (disallowed) | New (allowed) | What changed |
|---|---|---|
| `evertiq.com/news/55596` — JSR ~27% of photoresist; JIC took >84% for ~¥900bn | `jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf` (Tier A, company/state fund release) | Share number deleted (no allowed source states it). Ownership corrected from "more than 84 percent" to the filed **84.36%**, at **¥4,350 a share**, tender offer closing **16 April 2024**. The ~¥900bn deal value is not in the release and was dropped. JSR's self-description now cites `jsr.co.jp/jsr_e/products/em/`. |
| `pillsburylaw.com` — China banned Ga/Ge/Sb to the US on 3 Dec 2024, suspended 9 Nov 2025 until 27 Nov 2026 | `pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf` (Tier A) | USGS states "In November 2025, China lifted its ban on gallium exports to the United States for 1 year." The precise start and end dates (9 Nov 2025 / 27 Nov 2026) and the military-end-user carve-out are not in any allowed source and were deleted; the claim now reads "lifted the gallium ban for one year" in November 2025. Added USGS's **99% of world primary low-purity gallium production**. |
| `sfa-oxford.com` — China runs >40% of global air separation capacity (used twice: prose and the "byproduct exposure" criterion) | Prose: `csis.org` (already cited). Criterion: `pubs.usgs.gov/.../mcs2026-gallium.pdf` | The 40% air-separation figure is deleted outright. The neon paragraph now ends on what CSIS does say: buyers had stockpiled since 2014 and East Asian chipmakers reported adequate neon from China. The byproduct criterion now rests on USGS: gallium recovered mostly from bauxite refining, germanium from zinc concentrates. |
| `kirkland.com` — EU revised its PFAS dossier on 20 Aug 2025 with a risk-based option "judged proportionate for electronics", decision likely 2027, effect late 2028 | `echa.europa.eu/-/echa-supports-pfas-restriction-with-targeted-derogations` (Tier A regulator; domain added) | Kept the 20 August 2025 revision and the >5,600 comments. Deleted the 2027 decision and late-2028 effect dates and the "proportionate for electronics" characterisation. Now: ECHA's committees back an EU-wide restriction **with targeted derogations**, scientific evaluation due to finish **by the end of 2026**. |

### Deletions (no allowed source)

- JSR's ~27% share of the photoresist market, and the ~¥900bn value of the JIC buyout.
- "China now runs more than 40 percent of global air separation capacity."
- The 3 December 2024 / 9 November 2025 / 27 November 2026 date triple and the military-end-user exception on China's critical-minerals ban.
- The EU PFAS decision (2027) and effect (late 2028) dates.

### Front matter

`card.leaders` JSR note rewritten (share out, JIC ownership in). `card.chinaStatus` now cites USGS's 99% gallium share and August 2023 licensing instead of the pillsbury dating. `keyFacts` entries 2 and 7 replaced to match the new sources. `costSignal` unchanged (SEMI figures).

## 05 Lithography

Words before 1,287 · after 1,351. Figures: all three kept; all three already sourced to ASML annual report / Q4 2025 investor deck.

### Replacements

| Old (disallowed) | New (allowed) | What changed |
|---|---|---|
| `bits-chips.com` — NXE:3800E above 220 wph at 30 mJ/cm2 with 0.9 nm overlay | `ourbrand.asml.com/.../asml-2025-annual-report-strategic-report-section.pdf` (Tier A) | ASML's own words: full specification is **220 wafers per hour**, a **37% improvement on the NXE:3600D**. "Above 220" corrected to "220 at full specification". The **0.9 nm overlay** figure is deleted — ASML publishes no overlay number for this tool that I could read (the product page renders its specs as animated digit rolls). |
| `heise.de` — 50,000 tin droplets/s, ~600 W today, 1,000 W demonstrated February 2026; also the Zeiss, Trumpf, San Diego and VDL supplier bullets | `asml.com/en/technology/lithography-principles/light-and-lasers`; `ourbrand.asml.com/.../strategic-report-section.pdf`; `zeiss.com/.../euv-lithography.html`; `trumpf.com/en_US/products/lasers/euv-drive-laser/`; `asml.com/en/company/about-asml/locations/san-diego`; `vdlgroep.com/.../vdl-etg-builds-complex-frames-for-zeiss` | 50,000 droplets/s confirmed on ASML's own page, with the pre-pulse/main-pulse detail. The 1,000 W milestone is **April 2025**, not February 2026, per ASML's annual report. "About 600 W today" deleted. Supplier bullets gained real content from each supplier's own site: Zeiss makes the illumination system and six-mirror projection optics; Trumpf's CO2 laser amplifies to **40 kW** and fires **50,000 pulses a second**; ASML San Diego (ex-Cymer) designs the LPP source and builds the droplet generator; VDL ETG builds the mirror frames. |
| `trendforce.com` (two URLs) — ten High-NA systems at four customers, 135 wph in acceptance testing; Intel >1m High-NA wafers | `ourbrand.asml.com/.../strategic-report-section.pdf`; `ourbrand.asml.com/.../financial-performance-section.pdf`; `asml.com/en/news/press-releases/2026/high-na-euv-reaches-new-readiness-milestone`; `intel.com/.../intel-foundry-asml-accelerate-industry-readiness-for-high-na-euv.html` | Installed-base count replaced with filed numbers: **four EXE and 44 NXE systems recognized in 2025** (two EXE in 2024) and **more than 400,000 wafers run on High NA by end-2025**. Throughput corrected from 135 wph to ASML's **175 wafers per hour, 60% above the EXE:5000**. Intel's **more than one million High-NA wafers** now comes from Intel's own newsroom, and its high-volume-manufacturing first from ASML's press release. |
| `marklapedus.substack.com` — 8 nm at 0.55 NA / 13 nm at 0.33 NA, anamorphic field halving, TSMC 2030, Samsung 2028 | `asml.com/en/company/stories/2024/5-things-high-na-euv`; `pr.tsmc.com/english/news/3338` | Resolution and the 4x/8x anamorphic field halving now from ASML, which adds that it **doubles the number of exposures** per wafer. TSMC's **2030** high-volume date is now TSMC's own, along with the **2031 pilot mask line** and **12-inch High-NA in production by 2033**. Samsung's 2028 DRAM plan is deleted; no allowed source states it. |
| `semiengineering.com` (two URLs) — High-NA price $350–400M; every EUV node in HVM still used single patterning as of mid-2025 | none | Both deleted; see below. |
| `internationaltradeinsights.com` — US–China deal suspended the Affiliates Rule for a year from 10 Nov 2025 | `federalregister.gov/documents/2025/11/12/2025-19846/...` (Tier A) | Same fact from the rule itself, with the exact window: **10 November 2025 to 9 November 2026**. |
| `caixinglobal.com` — ASML expects about 20% China revenue for 2026 | none | Deleted; ASML's Q4 2025 press release and 2025 annual report give no 2026 China share. |
| `cnbc.com` — China's share cut from 41% in 2024 toward a guided 20% in 2026 | `ourbrand.asml.com/.../2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf` (Tier A, already cited) | Takeaway now runs **41% (2024) to 33% (2025)** only. |

### Deletions (no allowed source)

- **Tool prices: ~$250M for a Low-NA EUV system and $350–400M for High-NA.** The $250M carried a Reuters URL whose headline does not state the figure; Reuters refuses automated fetching, so under the strict rule it is unverified. A Reuters explainer headline stating "$250 million ASML 'printer'" (28 Jan 2026) and one stating "$400 million ASML 'printers'" both exist in Google News RSS, but neither resolves to a `reuters.com` URL I could confirm, so nothing was cited. `card.costSignal` was rewritten to "48 EUV systems inside EUR 32.7bn of 2025 net sales; ASML does not publish per-system prices."
- 0.9 nm matched-machine overlay on the NXE:3800E; ~600 W current source power; the 330 wph by 2030 roadmap target.
- Ten High-NA systems at four customers; 135 wph acceptance-test figure.
- Samsung's 2028 High-NA plan for DRAM.
- "As of mid-2025 every EUV node in high-volume production still used single patterning."
- Aishengna's ¥7bn capitalisation, its plan of about five machines in 2026 and 20 in 2027, and ASML's ~16% China share in H1 2026 — all carried by a Reuters article whose headline states the qualitative fact ("China starts production of home-grown immersion DUV chipmaking tools") but none of the numbers. The Reuters citation is kept for the qualitative claim only, and CSIS now supplies a comparator: **SMEE holds about 4% of the global i-line market**.
- Beijing's 2028 target and the 2030 estimate for a working Chinese EUV chip, for the same reason; the Reuters citation is kept for the prototype's existence.

### Front matter

`card.chinaStatus` rewritten around CSIS and the Reuters headline claim. `card.costSignal` replaced. `keyFacts` 4, 5, 6, 7 and 8 replaced with ASML annual-report and asml.com facts; the Reuters H1-2026 China share fact removed.

## 06 Photomasks and Pellicles

Words before 1,103 · after 1,151. Figures: `mask-set-cost` kept (SemiAnalysis, Tier B). **`blank-share` removed** with its `{{figure:blank-share}}` marker and its front-matter entry.

### Replacements

| Old (disallowed) | New (allowed) | What changed |
|---|---|---|
| `dri.co.jp` (QY Research) — EUV mask blank market $259.25M in 2024, AGC and Hoya 93.7% of revenue. Cited in the lede, the Blanks section, The chokepoint, Takeaways, keyFacts and the `blank-share` figure. | `agc.com/en/news/detail/1203819_2814.html`; `hoya.com/ir/2025/en/review/it.html` (both Tier A) | Market size and share percentages deleted. In their place, each duopolist's own words: AGC says it is **the world's only EUV blank maker covering every step from glass material to coating**, raised capacity **about 30% in 2025** on a METI supply-chain-programme line, and was **aiming for more than ¥40 billion of sales** in that business; Hoya says it holds **an exceptionally high share** of mask blanks and expects customers to move gradually toward multi-sourcing EUV blanks. |
| `marklapedus.substack.com` — High-NA halves the printable field | `asml.com/en/company/stories/2024/5-things-high-na-euv` | Same claim from ASML, plus its own point that the half field **doubles the exposures** needed per wafer. |
| `semiengineering.com` (two URLs) — 90% transmission pellicle costs ~20% of throughput; polysilicon DUV filter costs another ~20%; Micron runs bare and cleans more often; CNT membranes survive fewer than 10,000 exposures and can shatter; D2S on startups proving designs on 193 nm immersion; 15 nm assist features | `asml.com/en/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic`; `imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner`; `jp.mitsuichemicals.com/.../2024_0528_1` (already cited) | The pellicle section is rebuilt on primary sources: ASML's membrane is **13 nm thick**, must hold at **500C in vacuum**, and every photon it absorbs is customer productivity lost; the light crosses it twice, so absorption counts double. Imec has exposed CNT pellicles on an **NXE:3300** with **single-pass transmission up to 97%** and imaging impact "low and correctable". Mitsui's **92%+ transmittance** and **1,000 W** targets are unchanged. |

### Deletions (no allowed source)

- **The $259.25 million EUV mask blank market and the 93.7%/94% two-firm revenue share**, and with them the `blank-share` figure, its marker and its front-matter entry. This was the chapter's headline number: the `oneLiner` and The chokepoint section both led on it. Both were rewritten around AGC's and Hoya's own statements.
- The 20% throughput cost of a 90%-transmission pellicle and the further ~20% for a DUV filter.
- Micron running EUV without pellicles and holding duplicate masks.
- CNT membranes surviving fewer than 10,000 wafer exposures, and shattering inside the scanner.
- D2S's claim that AI startups prove designs on 193 nm immersion first, and the 15 nm assist-feature resist wall.

### Front matter

`oneLiner` rewritten (dollar market size out; "a business worth tens of billions of yen" in). `plain` and the matching first paragraph of "How it works" both changed, identically, from "a market worth a few hundred million dollars" to "a small and obscure business", since the dollar figure no longer has a source. `card.leaders` AGC and Hoya notes rewritten to their own self-descriptions. `keyFacts` 1 and 2 replaced; the pellicle-throughput fact replaced by the ASML and imec facts. `card.costSignal` unchanged (SemiAnalysis mask-set range, Tier B).

## Domains added to `data/source-tiers.json`

Tier A: `echa.europa.eu` (European Chemicals Agency, an EU regulator). Every other new citation in these three chapters uses a domain already listed under A, or Reuters / SemiAnalysis under B.

## Verification notes

All ASML annual-report figures were read out of the filed PDFs directly (`pymupdf` on the downloaded `ourbrand.asml.com` files) after the fetcher returned them as unparsed binary; the SEC HTML copy of the same report corroborates the 220 wph, 175 wph, 400,000-wafer, 1,000-watt and 5,100-supplier numbers. The USGS mineral commodity summaries were downloaded with an explicit user agent (`pubs.usgs.gov` returns 403 otherwise) and read in full. ECHA (`echa.europa.eu`) sits behind a WAF that refuses both the fetcher and curl; its two PFAS pages were confirmed through search results quoting the pages themselves, and the claim was kept to what those quotes state. ASML's product pages for the NXE:3800E and EXE:5200B render their headline specs as animated digit rolls and yield no numbers to a fetcher, which is why the annual report is cited for throughput instead.

Reuters was fetched and refused (`reuters.com` is not accessible to the crawler), so the strict rule was applied: the two Reuters articles already in chapter 05 are kept only for the claims their headlines carry — "China starts production of home-grown immersion DUV chipmaking tools" and "How China built its 'Manhattan Project' to rival the West in AI chips" — both confirmed verbatim in Google News RSS. Every number those articles carried has been deleted.

---

## 18 · Geopolitics

Words before: 2,392. Words after: 2,676. Build: D 20 → D 0. Figures: 3 before, 3 after (none removed).

### Replacements

1. **Taiwan's leading-edge concentration.** TrendForce, 2023 country capacity split → The Stimson Center, "Why Taiwan Fears 'America First' Risks Eroding Its 'Silicon Shield'" (stimson.org, 10 October 2025). Used in `keyFacts`, the chokepoint table, the table's basis bullets and the Taiwan section.
   Changed: the metric, not just the source. "68% of world capacity at 16/14 nm and below in 2023, against 12% for the US, 11% for Korea, 8% for China" becomes Stimson's two figures, "78% of the global foundry market and 92% of the manufacturing capacity for the most advanced chips". No allowed source publishes a country split at a named node; CSET's is 5 nm in 2022, SIA/BCG's is below-10 nm in 2021, and SEMI publishes total capacity only. The table row "Logic at 16/14 nm and below · 68% · capacity, 2023" is replaced by two rows, "The most advanced logic · 92%" and "Foundry, all nodes · 78%". `card.leaders` for Taiwan was rewritten to match. The lost detail is the US, Korea and China comparison, which nothing allowed carries.

2. **Big Fund III.** Caixin Global → RAND, "Full Stack: China's Evolving Industrial Policy for AI" (rand.org). Used in `keyFacts`, `card.costSignal` and the industrial-policy section.
   Changed: "registered in May 2024 at 344 billion yuan, about $47.5 billion, aimed at equipment and materials" becomes RAND's "the latest round reaching $47 billion". The yuan figure, the registration date and the equipment-and-materials mandate all go; no allowed source carries them. A Reuters headline of 27 May 2024 does state "$47.5 bln", but the article returns 401 to every fetch and the canonical URL could not be confirmed from the Google News RSS token, so RAND was used instead.

3. **CHIPS Act awards.** Manufacturing Dive award tracker → GAO-26-107882, "Semiconductors: Information on Projects Funded to Strengthen U.S. Supply Chain" (files.gao.gov, 11 December 2025). Source of the `chips-awards` figure and of the body sentence.
   Changed, and the old numbers were wrong. Direct funding finalised was **$30.9 billion to 19 companies for 40 projects as of July 2025**, not "roughly $23 billion across two dozen awards by mid-2026". Four bars in the figure moved to GAO's filed amounts: Micron 6.2 → **6.44** (and up one rank, above TSMC), TSMC 6.6 → **6.565**, GlobalFoundries 1.5 → **1.587**, Texas Instruments 1.6 → **1.61**, Intel 7.87 → **7.865**, Samsung 4.7 → **4.745**. The six smaller bars were already correct. Added GAO's median: the awards cover 14.2 percent of each project's capital cost. The "Predicted winners" bullet reading "$23 billion of grants will not" now reads $31 billion.

4. **HBM and DRAM shares.** Counterpoint Research, quarterly DRAM and HBM market share → SK hynix Form 424B4, its US listing prospectus (sec.gov).
   Changed: the country figure becomes a company figure, because that is what a filing can support. "HBM · South Korea · 83% · revenue, 2026" becomes "HBM · South Korea · 56% · SK hynix alone, revenue, 1Q26", from the prospectus's 56.4 percent. `card.leaders` for South Korea moves from "83% of HBM revenue and 63% of DRAM revenue" to SK hynix's own 56 percent of HBM and 29 percent of DRAM. **Deleted:** Korea's combined HBM and DRAM shares and the Samsung 33 percent split. The basis bullet now says so plainly.

5. **October 2023 performance-density rule.** K&L Gates client alert → CSET, "Explainer: The Commerce Department's October 2023 Export Control Update" (cset.georgetown.edu). Policy says cite the rule, not the law firm; CSET's explainer is the closer read of it.
   Changed: the thresholds are confirmed unchanged (4,800 TPP, or 1,600 TPP with performance density 5.92), but the sentence no longer names the A800 and H800. CSET says BIS removed the interconnect-speed parameter that chip designers had used to build China-compliant parts, without naming those two products, so the sentence now says what CSET says.

6. **The 15 percent revenue share.** PBS NewsHour → Nvidia Form 10-Q for the quarter ended 27 July 2025 (sec.gov).
   Changed, and materially softened. "Nvidia and AMD agreed to hand the government 15 percent of their China revenue on the H20 and MI308" is not what the filing says. Nvidia's own words: US officials "have expressed an expectation that the USG will receive 15% of the revenue generated from licensed H20 sales", and "the USG has not published a regulation codifying such requirement". The essay now quotes that and says no regulation codifies it. **Deleted:** AMD and the MI308, which the Nvidia filing cannot support. `card.usStatus` and the `control-timeline` entry were reworded to match ("US officials seek 15% of licensed H20 sales").
   Corrected in passing: the same paragraph said the April 2025 licence requirement "cost Nvidia up to $5.5 billion in charges", which was the 8-K's forward estimate. The 10-Q records the actual charge, **$4.5 billion**. The 8-K citation is retained for the licence requirement itself.

7. **Section 232 tariff.** EY Global Tax News → Federal Register, "Adjusting Imports of Semiconductors, Semiconductor Manufacturing Equipment, and Their Derivative Products" (federalregister.gov, doc. 2026-01052).
   Changed: the rate and date are confirmed (25 percent ad valorem, effective 12:01 a.m. on 15 January 2026), and the exemption list is now the proclamation's own and is longer than the essay claimed: US data centres, repairs and replacements, research and development, startups, non-data-centre consumer applications, civil industrial applications and public-sector use.

8. **Validated End-User revocation.** TrendForce → Federal Register, "Revocation of Validated End-User Authorizations in the People's Republic of China" (federalregister.gov, doc. 2025-16735).
   Changed on three points. **Intel Semiconductor (Dalian) was revoked too**, and the essay named only Samsung and SK hynix. The rule was published 2 September 2025 and takes effect 31 December 2025. And "annual reviews now allow maintenance but not expansion" is replaced by the rule's own policy: BIS intends to license these fabs to keep operating, and does not intend to license capacity expansion or technology upgrades. The annual-review framing was TrendForce's, not the rule's.

9. **Nexperia.** ioplus.nl → government.nl, the minister's own announcement of 12 October 2025 and his update of 19 November 2025.
   Changed, and the essay had two errors. The order was invoked on **30 September 2025**, not "in October", which makes it the same day as the BIS affiliates rule rather than "days after" it; the essay now makes that coincidence the point. And the Dutch government did not "seize Nexperia from China's Wingtech": the minister invoked the Goods Availability Act, citing governance failures that threatened to move technology off European soil, and government.nl does not mention Wingtech at all. **Deleted:** the seizure framing, Wingtech, "China blocked exports from Nexperia's Chinese plants" and "European car lines began stopping within weeks", none of which any allowed source carries. What survives is that Nexperia's parts run European car lines and that both measures were suspended within about six weeks.

10. **MOFCOM Announcement 18.** Clark Hill client alert → the announcement itself on english.mofcom.gov.cn.
    Changed: now dated **4 April 2025** and the seven elements are named from the text (samarium, gadolinium, terbium, dysprosium, lutetium, scandium, yttrium), in metal, oxide, compound and finished-magnet form.

11. **The October 2025 rare-earth package.** Clark Hill → CSET's translation of MOFCOM Notice 2025 No. 61 (cset.georgetown.edu).
    Changed: "six more announcements in October reached processing technology and foreign goods containing Chinese-origin material" becomes the one provision the translation actually carries, dated 9 October 2025: a Chinese export licence is required for foreign-made goods containing Chinese rare earths worth 0.1 percent or more of the item's value. **Deleted:** the count of six announcements and the processing-technology controls.

12. **The November 2025 suspension.** Clark Hill (used twice, here and in "What to watch") → CSIS, "The U.S.-China Trade Truce Has Not Solved the Gallium Problem" (csis.org).
    Changed and narrowed. CSIS supports only that MOFCOM's Document No. 72 suspended the gallium and dual-use ban for one year after the Trump-Xi APEC meeting. **Deleted:** the suspension of the October package, the claim that the seven-element regime and the military-end-user ban "stay permanent", and the two dated expiry deadlines. The line "Nothing was repealed. The controls were paused, with the expiry dates published" becomes "Nothing was repealed. One ban was paused for twelve months; the licensing regimes stand." The "What to watch" bullet loses "10 and 27 November 2026" and now reads "November 2026".

13. **China's domestic-chip mandate.** SCMP → Nvidia Form 10-Q for the quarter ended 26 July 2026 (sec.gov).
    **Deleted the number.** No allowed source supports "publicly owned computing centres were told in 2025 to source more than half their chips at home". A Reuters headline of 5 November 2025 states a stronger and differently shaped claim ("China bans foreign AI chips from state-funded data centres, sources say") with no figure, so it was not used. The sentence is rebuilt on what Nvidia's filing says: Chinese regulators discouraged customers from buying, importing or using its data-centre products, and endorsed an action plan setting performance-per-watt and bandwidth standards for accelerators in Chinese data centres.

14. **Nvidia's H200 shipments to China.** SCMP → the same 10-Q, plus Nvidia's Q2 FY2027 results release (nvidianews.nvidia.com).
    Changed: every element is now first-party and one is new. The filing says licences began in **February 2026**, that the PRC government restricted the sales, that Nvidia took a **$0.4 billion** H200 charge, and that the shipments it did make "account for less than 1% of Data Center revenue in our most recent quarter". The $89.0 billion data-centre figure and "not assuming any Data Center compute revenue from China" come from the results release.

15. **CXMT.** Seoul Economic Daily → SemiAnalysis, "Huawei Ascend production ramp" (Tier B).
    **Deleted the number.** "CXMT passed 10 percent of the global DRAM market and is sampling HBM3" has no allowed source; the 10 percent traces to Counterpoint and reaches the press from there. Replaced with the SemiAnalysis figure that matters more to this essay's argument: CXMT's HBM output should reach about 2 million stacks in 2026, enough for 250,000 to 300,000 more Ascend 910C packages. `card.chinaStatus` was rewritten to match.

16. **Taiwan's N-2 rule.** Taiwan News → Stimson (as above).
    Changed and weakened, because no allowed source describes the statute. **Deleted:** the N-2 rule by name, the amended Industrial Innovation Act, "two generations behind" and the 18 December 2025 reaffirmation. Stimson supports the substance one notch softer: Taiwan prohibits overseas production of its most advanced semiconductors, so chips made by Taiwanese firms in the United States are a generation behind those made at home, and Arizona is not expected to reach 2 nm before 2028. The "What to watch" bullet now reads "Taiwan's ban on making its newest chips abroad".

17. **Gulf chip authorisations.** Just Security → US Department of Commerce, "Statement on UAE and Saudi Chip Exports" (commerce.gov, 20 November 2025).
    Changed: Commerce's own wording is "up to 35,000" **GB300s** each to G42 and HUMAIN, conditioned on security and reporting requirements that BIS monitors. **Deleted:** "about 100 MW apiece", which Commerce does not state.

18. **Malaysia's permit regime.** Baker McKenzie sanctions blog → MITI's own press statement of 14 July 2025 (miti.gov.my).
    Changed: both the permit and the 30-day notice are confirmed from the ministry, with the mechanism named. The permit covers export, transhipment **and transit**; the 30 days' advance notification is the catch-all clause, Section 12 of the Strategic Trade Act 2010.

19. **The Chip Security Act.** Americans for Responsible Innovation (ari.us) → the bill text, S.1705, on congress.gov.
    Changed: the bill's own operative provision is now cited, that Commerce must require location verification on covered chips within 180 days of enactment. **Deleted:** "the Senate folded it into the FY2027 defence bill". No allowed source confirms it; the research note already marked it headline-only. The House Foreign Affairs 42-0 vote keeps its huizenga.house.gov citation, and "It is not law yet" still closes the paragraph.

20. **SMIC's 5 nm plans.** TrendForce → SemiAnalysis (Tier B), same newsletter as above.
    **Deleted the number.** The "What to watch" bullet rested on an explicitly unconfirmed plan to lift 7 and 5 nm output fivefold to 100,000 wafers a month. It is replaced by the SemiAnalysis capacity series already cited elsewhere in the chapter, 45,000 wafers a month at end-2025, 60,000 in 2026 and 80,000 in 2027, with yield as the thing to watch.

### Deletions beyond the twenty

- **The 1 June 2026 ownership bullet** (Al Jazeera). The research note records no Federal Register rule for it, only a headline. Deleted as a dated item; the claim survives in better form, because Nvidia's 8-K of 9 April 2025 shows the licence requirement already reaching "companies headquartered or with an ultimate parent" in China. That is now a clause in the H20 paragraph, and the list above it says "Three moves" instead of "Four".
- **The 2.5D advanced packaging row** in the chokepoint table (TrendForce, "60-75%, TSMC capacity share, 2026") and its basis bullet, and **"TSMC alone will run 120,000 to 140,000 CoWoS wafers a month in 2026 against 50,000 to 60,000 at every OSAT partner combined"** in the Taiwan section, and **"TSMC runs roughly two-thirds of world CoWoS capacity"** from `card.leaders`. See the note below; this is the loss that matters most.

### The number the argument missed most

The CoWoS capacity split. The essay's case is that reshoring moves wafers but not packaging, and the 120,000-to-50,000 comparison was the evidence. No allowed source will supply it. Epoch AI says outright that there are no public disclosures or estimates of advanced-packaging share; SemiAnalysis's March 2026 piece discusses CoWoS without quantifying capacity; TSMC's annual report does not break it out. What TSMC will say is on the record and is now what the section rests on: asked in October 2025 how much CoWoS capacity he would add in 2026, C.C. Wei said only that the company was "working very hard to narrow the gap between the demand and supply" and that front-end and back-end capacity alike were "very tight", and TSMC's two Arizona packaging fabs trail an OSAT partner already breaking ground there. The argument survives on the chairman's refusal to give a number; it is weaker than it was, and the table now says so in a line of its own.

### Discrepancy found and left alone

The table row "Logic at 28 nm and above · China · 38% · capacity, 2025" and the matching `card.leaders` entry are cited to CSIS, which is Tier A, so the build does not flag them. But the CSIS piece says Chinese capacity is "now accounting for about half of global capacity", not 38 percent. The 38 percent appears to be a TrendForce series. Out of scope for this pass, since the citation is allowed; flagged here for whoever reconciles the mature-node figure across chapters 10 and 18.

### Domains added to data/source-tiers.json

Tier A: `gao.gov`, `files.gao.gov`, `miti.gov.my`. Already listed and used unchanged: `stimson.org`, `rand.org`, `congress.gov`, `commerce.gov`, `federalregister.gov`, `english.mofcom.gov.cn`, `cset.georgetown.edu`, `csis.org`, `government.nl`, `sec.gov`, `investor.tsmc.com`, `nvidianews.nvidia.com`. Nothing added to Tier B.

### Verification notes

Every replacement URL was read before it was cited. WebFetch was the default. Three hosts refuse it and were read another way: SEC EDGAR and the TSMC transcript PDF with a declared user agent through curl (the Nvidia 10-Qs, the Nvidia 8-K and the SK hynix 424B4 were read in full and the quoted sentences extracted from the filing text), and RAND likewise. One page, the Commerce statement on UAE and Saudi chip exports, sits behind Cloudflare and returns 403 to both WebFetch and curl; its text was confirmed through search against commerce.gov itself and matches the figure recorded independently in `qa/research-notes-gulf-sea-smuggling.md`. No Reuters, FT or Nikkei page is cited in this chapter: the two candidates found (Reuters on Big Fund III, Reuters on state data centres) either could not be resolved to a canonical URL or carried no number in the headline.

---

# Chapter 15 — Systems and Networking

Words before 1,114 / after 1,160. Sources 15 → 21. Build: `D 0, ? 0`. Figures 3 → 2.

## Replacements

| Claim | Old source (disallowed) | New source (allowed) | What changed |
|---|---|---|---|
| Tomahawk 6 Davisson cuts optical interconnect power ~70%, >3.5x better than pluggables | globenewswire.com syndication | broadcom.com/company/news/product-releases/63626 | Same numbers, now the vendor's own page. Dropped the "16 co-packaged 6.4 Tbps optical engines" detail: it is not on Broadcom's own page. |
| UALink 1.0: 200 Gbps per lane, up to 1,024 accelerators, ratified April 2025, backed by AMD, Intel, Meta, AWS, Google, Microsoft | sdxcentral.com | ualinkconsortium.org (spec overview) | Number confirmed as 200 Gb/s per lane and "up to 1024 endpoints"; added the four-lane 800 Gb/s station. Dropped the ratification date and the backer list, which the consortium page does not state. |
| Ultra Ethernet standardised lossless, congestion-aware behaviour | asserted, no citation | ultraethernet.org (UEC 1.0 launch) | Now dated: specification 1.0 published June 2025. |
| Foxconn, Quanta and Wistron each cleared NT$1 trillion (~US$32B) of 2025 revenue | digitimes.com | honhai.com FY2025 & 4Q25 results | Number replaced: Foxconn group revenue NT$8.1 trillion in 2025, up 18%, cloud and networking among the drivers. The per-ODM NT$1 trillion trio claim is gone; no allowed source carries it. |
| "US regulators drafted import restrictions in 2026" (optical modules) | caixinglobal.com | docs.fcc.gov FCC-26-50, Third Report and Order, adopted 22 July 2026 | Claim narrowed to what the order actually does: bars new authorisations for devices containing logic-bearing components from Covered List firms, with optical transceivers named in the record as such a component. |
| Ethernet won scale-out | delloro.com | broadcom.com (Tomahawk 4/5/6) + ultraethernet.org | Rebuilt as a mechanism, not a market share: switch capacity 25.6 → 51.2 → 102.4 Tbps, plus the UEC 1.0 stack. |
| Nvidia sells both fabrics | — | sec.gov Nvidia 10-Q, quarter ended 26 Apr 2026 | New citation: $75.2B Data Center quarter "driven by the ramp of our Blackwell 300 products and demand for our InfiniBand, Spectrum-X Ethernet, and NVLink solutions". |
| Nvidia put $2B each into Coherent and Lumentum, March 2026 | futurumgroup.com | nvidianews.nvidia.com (Lumentum and Coherent releases) | Same $2B + $2B, now from Nvidia's own newsroom. Coherent's 8-K exhibit on sec.gov corroborates. |
| Indium phosphide is the narrow input | futurumgroup.com | pubs.usgs.gov Mineral Commodity Summaries 2026, indium | Different number, better claim: China accounts for about 70% of world indium production. |
| InnoLight/Eoptolink offshore assembly in Thailand (2019/2020) | caixinglobal.com | innolight.com/about and eoptolink.com/about-us/contacts | InnoLight's Thai plant, established 2019, confirmed on its own site alongside Suzhou and Taiwan; Eoptolink's Rayong and Chonburi sites confirmed on its own contacts page. The 2020 date for Eoptolink is dropped. |

## Deletions

- **Ethernet took more than two-thirds of AI back-end switch revenue in 2025 (67/33).** Dell'Oro only. Figure `ai-fabric-share` removed with its `{{figure:ai-fabric-share}}` marker, front-matter entry and keyFact. No filing, regulator, standards body or Tier B source publishes this split.
- **Celestica led AI back-end Ethernet switching in Q1 2026, ahead of Nvidia, Arista and Cisco.** Dell'Oro only; deleted with the sentence.
- **InnoLight and Eoptolink supply more than 60% of 800G-and-above optical modules; Chinese firms hold seven of the top ten supplier slots.** Caixin citing LightCounting. Figure `optics-800g-share` removed with its marker, front-matter entry and keyFact; `card.chinaStatus` and the InnoLight leader line rewritten. Reuters covered the US draft ban but no Reuters headline or Google News RSS snippet states a share figure, so the strict rule blocks it. CSIS's silicon-photonics work carries no share number either.
- **"Transceiver demand exceeded supply by roughly a factor of two in early 2026."** Futurum only. Deleted from keyFacts, the "Who makes it" paragraph and the takeaway; the Nvidia investment and the USGS indium concentration now carry the argument.
- **"Whether those fabs ramp inside 18 to 24 months."** Unsourced editorial number in the body; removed. The 18-24 month estimate survives only in `card.substitution.why`, which is labelled site analysis.

## Addition

New figure `switch-bandwidth`: Broadcom Tomahawk 4 (25.6 Tbps), 5 (51.2), 6 (102.4), each from Broadcom's own product release, replacing one of the two removed figures.

---

# Chapter 16 — Data Centers and Power

Words before 1,106 / after 1,196. Sources 15 → 14. Build: `D 0, ? 0`. Figures 3 → 3.

## Replacements

| Claim | Old source (disallowed) | New source (allowed) | What changed |
|---|---|---|---|
| Substation-class transformers take 75 to 110 weeks, ~2.5x pre-pandemic, no relief before 2028 | terrapincg.com | energy.gov, *Large Power Transformer Resilience: Report to Congress*, July 2024 | **Numbers changed.** 36-month lead times commonly quoted, worst cases 60 months, against under a year before the pandemic. Added that 82% of units put into US service in 2019 were imported. |
| Medium-voltage switchgear 52-80 weeks, large diesel generators 50-78 weeks | terrapincg.com | none found | Bullet deleted (see Deletions). |
| GE Vernova has ~100 GW of gas turbines under contract, ~20% data centers, ~10 GW of slots left across 2029-30 | power-eng.com | sec.gov, GE Vernova Q2 2026 press release | **Numbers changed.** Gas equipment backlog and slot reservations grew from 100 GW to 116 GW; output 20 GW/yr in 2026, 24 GW in 2028, 30 GW in 2030; data center orders over $5B year to date, more than double all of 2025. The "20% tied to data centers" and "10 GW of slots left" figures are gone. |
| ERCOT had >438 GW of proposed large loads in June 2026, ~89% data centers, against 5.9 GW energised | datacenterfrontier.com | ercot.com, President and CEO update to the Texas Senate Committee on Business & Commerce, 29 July 2026; and ERCOT Large Load Interconnection Status Update, 13 March 2026 | **Numbers changed.** ~474 GW of large loads seeking interconnection as of June 2026, ~90% data centers; 9,042 MW had received Approval to Energize. The ratio the chapter turns on survives at roughly fifty to one. |
| Crane Clean Energy Center: 835 MW restart under a 20-year Microsoft agreement targeting 2027 | datacenterfrontier.com | constellationenergy.com; energy.gov loan article | **Number changed.** 835 MW and the Microsoft PPA confirmed; the plant shut in 2019 and is restarting on a $1B DOE loan closed November 2025, still subject to NRC approval. The 2027 date and the 20-year term are dropped: neither Constellation's nor DOE's release states them. |
| Five largest US AI spenders plan $660-690B of capex in 2026 | futurumgroup.com | epoch.ai, hyperscaler capex trend | **Numbers changed.** Alphabet, Amazon, Meta, Microsoft and Oracle spent $448.3B in 2025 and are on a trend that reaches $770B in 2026. Figure `hyperscaler-capex` rebuilt from Epoch's per-company 2025 actuals (Amazon 137.5, Microsoft 88.0, Alphabet 83.1, Meta 72.5, Oracle 40.6) instead of Futurum's 2026 guidance midpoints. |
| National generation grows 1.7% in 2026 | utilitydive.com | eia.gov press release 582, 13 January 2026 | **Number changed.** US electricity use grows 1% in 2026 and 3% in 2027, the fourth straight rise and the strongest four-year run since 2000. |
| Rack power by generation: ~150 kW GB300, ~225 kW VR200, ~660 kW Rubin Ultra in 2H27 | trendforce.com | developer.nvidia.com, 800 VDC architecture | **Numbers changed.** Nvidia's own figures: today's 54 VDC racks hit physical limits past about 200 kW; the 800 VDC architecture is drawn for 100 kW to over 1 MW, with megawatt racks from 2027. The GB300 NVL72's 142 kW stays on docs.nvidia.com. |
| Liquid cooling is fragmented (~$3B market, Vertiv leading, CoolIT/nVent/Boyd/Aaon behind) | delloro.com | blogs.nvidia.com, gigawatt AI factories | **Number deleted, claim kept.** Nvidia names nine firms supplying data center power and cooling for its gigawatt reference designs; nine sellers is the fragmentation argument without a market-size estimate. |

## Deletions

- **Data center construction cost: $7.7M/MW in 2020, $10.7M in 2025, $11.3M forecast for 2026, plus up to $25M/MW for an AI fit-out.** JLL only, and no filing, regulator or Tier B source publishes a cost-per-megawatt series. Deleted from keyFacts, from `card.costSignal` (replaced with the transformer and turbine lead-time signal), from the body and from the "Key evaluation criteria" bullet, which now reads on transformer and turbine lead time instead. The section heading "Capacity and cost" is now "Capacity and demand", because the cost half of it no longer exists.
- **Switchgear and generator lead times.** Terrapin only; bullet removed and replaced with a firm-new-generation bullet built on the Crane restart.
- **Figure `rack-power`** removed with its `{{figure:rack-power}}` marker, front-matter entry and keyFact: the 150/225/660 kW series is TrendForce's and Nvidia publishes no rack wattage for Rubin generations.

## Addition

New figure `turbine-output`: GE Vernova annual gas turbine output, 20 GW (2026), 24 GW (2028), 30 GW (2030), from its Q2 2026 release on sec.gov.

---

# Chapter 17 — Component Costs

Words before 1,335 / after 1,299. Sources 26 → 21. Build: `D 0, ? 0`. Figures 3 → 3. The BOM table and the compressibility table both survive intact on Epoch AI, company filings and SemiAnalysis.

## Replacements

| Claim | Old source (disallowed) | New source (allowed) | What changed |
|---|---|---|---|
| TSMC N2 near $30,000 and N3 at $25,000-27,000 per wafer, October 2025 | trendforce.com | epoch.ai B200 cost breakdown | **Numbers deleted, bullet rebuilt.** The wafer-price bullet now says TSMC does not publish the price and no allowed source does either, and gives Epoch's modelled $17,000 for Blackwell's 4NP. Added Epoch's other two assumptions (two ~800 mm2 chiplets, 40-70% die yield centred on 60) as a keyFact so the model is auditable. |
| Bernstein puts a Vera Rubin NVL72 rack as high as $9.1M; memory near 29% of VR200 BOM against the 20% Nvidia prefers; HBM4 at $53/GB by 2027; Nvidia halved Vera SOCAMM capacity, cutting the LPDDR5X bill from $1.2M to $586,000 | trendforce.com (relaying Bernstein) | inferencex.semianalysis.com, Vera Rubin NVL72 vs GB200 NVL72, 23 July 2026 | **All four numbers deleted.** Replaced with the one public Rubin cost figure from an allowed source: total cost of ownership of $3.57 per GPU-hour against $1.84 for GB200 and $2.36 for GB300 in the operator case. |
| TrendForce expects HBM contract prices to rise by multiples in 2027 because the three suppliers reprice annually | trendforce.com | none needed | Sentence rewritten to make the structural point without the forecast: three firms make HBM, they sell every stack they build, and Micron's own gross margin (already cited from its filings) is the evidence. |
| 2025 semiconductor revenue $809B; 2026 forecast $1.6T; memory alone $837B, 54% of the industry against 27% a year earlier | gartner.com | wsts.org and semiconductors.org | **Numbers changed.** WSTS forecast $772B for 2025, SIA counted $791.7B; WSTS puts 2026 at $975B with memory and logic each growing more than 30%. The memory-specific $837B and the 54%/27% share pair are gone: no allowed source publishes a memory-only industry total. |

## Deletions

- **$55B advanced packaging market (Yole).** Deleted from the body and from figure `market-2025`. SEMI publishes assembly and packaging *equipment* billings ($6.0B in 2025), which is a different quantity and cannot stand in.
- **$23.8B of optical transceivers (LightCounting).** Deleted from the body and from figure `market-2025`.
- **"When a vendor redesigns a product to buy less of a component, that component is the chokepoint."** The observation rested entirely on the SOCAMM-halving story, which has no allowed source; deleted with it. This is the sharpest thing the chapter loses.
- Figure `market-2025` kept but rebuilt with four bars instead of six: semiconductor sales 792 (SIA), hyperscaler capex 448 (Epoch AI), Nvidia data centre revenue 194 (Nvidia FY2026), semiconductor equipment 135 (SEMI). Source label and URL updated from Gartner to SIA.
- `card.costSignal` no longer carries "up to $9.1M for a Vera Rubin NVL72 rack"; it now reads on the B200 build cost and the $2,900 HBM line, both from Epoch AI.

## Verification notes for all three chapters

`sec.gov`, `investors.micron.com`, `ir.appliedmaterials.com`, `pr.tsmc.com`, `semi.org` and `investors.broadcom.com` all return 403 to curl but serve the fetcher; every one of those pages was read and its figures confirmed. The DOE transformer report and the two ERCOT decks are PDFs the fetcher returns as binary; all three were downloaded and read with `pymupdf`, and the quoted phrases ("36-month lead times being commonly quoted", "approximately 474 GW of Large Loads seeking interconnection, of which ~90% are data centers", "Of the 9042 MW that have received Approval to Energize") are verbatim. The FCC Third Report and Order was read the same way. `pubs.usgs.gov` refuses the fetcher; the indium figure was confirmed from search results quoting the 2026 Mineral Commodity Summaries indium page, and the URL itself returns 200.

Reuters is not fetchable. Two Reuters items were found that bear on chapter 15 — "EXCLUSIVE: Trump administration drafting ban on Chinese data center devices, sources say" (4 August 2026) and "China's control over indium phosphide exports threatens AI data centre rollout" (11 June 2026) — but neither headline nor RSS snippet carries a number, and the underlying claims are now covered by the FCC order and USGS respectively, so neither was cited.

## Domains added to `data/source-tiers.json` under A

`ualinkconsortium.org` and `ultraethernet.org` (standards bodies), `fcc.gov` (regulator; covers `docs.fcc.gov`), `energy.gov` and `eia.gov` (US government), `ercot.com` (the Texas system operator, cited here only for its own reports to the Texas Senate under PUCT oversight), `honhai.com` and `constellationenergy.com` (company investor materials). `investors.broadcom.com` and `pubs.usgs.gov` were already covered by existing entries.

---

# Chapters 07, 08 and 12 — strict re-sourcing, 9 September 2026

Editor: source-quality pass on Deposition and Etch, Metrology and Inspection, and Advanced Packaging. All three now report `D 0` in `dist/build-report.txt`. Every URL in the front matter and the body resolves to Tier A or to one of the four Tier B exceptions.

## 07 Deposition and Etch

Words before 1,127 · after 1,165. Figures 3 before, 3 after.

### Replacements

- **SEMI equipment billings** — `semiconductor-digest.com` → `semi.org`, *SEMI Reports Global Semiconductor Equipment Billings Reached $135 Billion in 2025*. Used in two keyFacts, the `equipment-billings` figure source and two body sentences. Numbers hold: $135.1B in 2025, up 15% from $117.1B in 2024. Added SEMI's wafer-processing detail, up 12%, which the trade write-up had dropped.
- **China's 2025 equipment spending** — same swap. $49.3B held, but the framing changed. The old sentence paired it with "China, Taiwan and Korea together took 79 percent". SEMI's own release carries the sharper fact: China's spending *fell* 0.5% while Taiwan's rose 90% to a record $31.5B. The chapter now says that instead, because it is the same source and a better point.
- **AMEC 2025 results** — `trendforce.com` → `amec-inc.com`, AMEC's own 2025 results briefing. Revenue corrected from "RMB 12.38 billion" to RMB 12.385 billion; the 36.6% growth rate holds. Replaced the deleted figures below with AMEC's own R&D disclosure, RMB 3.744 billion at 30.2% of sales, which makes the same point about state-backed intensity with a filed number.
- **December 2024 export rule** — `cov.com` (law-firm client alert) → `bis.gov`, Commerce's own announcement, alongside the Federal Register text already cited. **The number was wrong.** The alert was paraphrased as "added eight ECCNs". BIS says it controlled *24 types of semiconductor manufacturing equipment and 3 types of software tools*. The 140 Entity List additions checked out (BIS: 140 additions and 14 modifications).
- **`tel-tool-share` figure label** — "Gartner via Tokyo Electron FY2026 Q4 presentation" → "Tokyo Electron FY2026 Q4 results presentation". The URL was already `tel.com` and unchanged; only the label changed, so the citation names the allowed source rather than the disallowed research firm inside it. I re-read the deck: the CY2025 share chart gives coater/developer 91%, CVD 38%, oxidation/diffusion 31%, deposition systems 27%, dry etch 23%, cleaning 20%, ALD 15%. All match. One series was relabelled "Batch deposition" → "Deposition systems" to match TEL's own wording. The same in-text change was made where the body said "Gartner numbers in Tokyo Electron's own deck".
- **`china-tool-share` figure label** — "CSET analysis of TechInsights equipment data" → "CSET, Inside Beijing's Chipmaking Offensive". URL unchanged. All eight values re-verified against the CSET article: dry stripping 35, dry etch 11, CMP 11, PVD 10, etch and clean 9, deposition 7, CVD 7, i-line lithography 4.

### Deletions (no allowed source)

- AMEC's 2025 net profit of RMB 2.11 billion.
- AMEC's cumulative etch-tool shipments "past 6,800 units". AMEC's own briefing does not give the figure and I would not carry it from the trade report.

## 08 Metrology and Inspection

Words before 1,132 · after 1,178. Figures 2 before, 2 after (one removed, one built).

### Replacements

- **KLA's market share** — `drrobertcastellano.substack.com` had the chapter's headline number: 64.1% of metrology and inspection in 2025, up from 55.0% in 2020. **No allowed source publishes a percentage share for this market.** KLA does not, its rivals do not, and neither CSET nor SEMI breaks it out. The number is deleted from the oneLiner, the `plain` paragraph, the lead, the leaders card and the takeaway. The claim is rebuilt on what KLA tells its own shareholders in the Q3 FY2026 letter: its process control share is "approximately 7x greater than the nearest competitor" and has grown 360 basis points since 2021. That is a weaker statement of the same fact, and it is Tier A.
- **Nova's share** — same Substack, 4.3% in 2025. Deleted. Nova's revenue, $880.6 million, stays and is cited to SEC XBRL, which was already the second citation on that sentence.
- **Applied Materials' share** — `drrobertcastellano.substack.com/p/klas-market-share-growth-in-process`, "a peak near 13 percent … to under 8 percent in 2024". Deleted with no replacement; Applied Materials does not report a process-control share. The bullet is rewritten to say what it sells and where it sits in the flow.
- **Advanced-packaging revenue keyFact** — the $635 million 2025 base was cited to the Q4 FY2026 letter, which does not contain it; it is in the Q3 letter. Reworded to the Q4 letter's own numbers: about $1.1 billion in calendar 2026, up more than 70%, almost twice the growth of the advanced packaging market.
- **December 2024 controls on process control** — `cov.com` and `hklaw.com` (two law-firm alerts) → the rule itself on `govinfo.gov` plus `bis.gov` for the foreign direct product rule. This is a straight upgrade: the alerts were paraphrased as "extended controls to metrology and inspection for patterned 300 mm wafers", and the rule gives the actual threshold, ECCN 3B993.q.1 — patterned-wafer defect inspection or metrology for wafers 300 mm and above, detecting defects of 21 nm or smaller, with a light source below 400 nm, or an electron beam resolving 1.65 nm or better, or a cold field emission source, or two or more beams. The chapter now carries the threshold.
- **CSET's 2026 review** — the citation was allowed but **the claim was not supported.** The chapter said CSET's survey of Chinese equipment gains "reports nothing here", which reads as evidence that China gained nothing. I re-read the article: it never covers process control at all. Its segments are CMP, dry etch and clean, deposition, lithography, advanced packaging, assembly, test, and handlers and probers. The sentence now says the survey never reaches process control, and calls that an absence of evidence rather than evidence of absence. The `chinaStatus`, `substitution` and takeaway lines were softened to match.
- **`plain` paragraph** — the last sentence changed in both places, byte-identical: "One American firm sells two-thirds of the machines that do the looking" → "One American firm sells about seven times as many of those machines as its nearest rival." Verified equal to the first paragraph under "How it works" after the edit.

### Deletions (no allowed source)

- The whole Wuhan Jingce sentence: "the clearest domestic contender, selling front-end inspection alongside back-end test on guided 2025 net profit of RMB 80 million to 90 million" (`trendforce.com`). Its Shenzhen filings are Tier A and reachable, but they report in 万元 and I could not verify the profit guidance as stated, so the sentence goes rather than the number alone. The company name was also removed from the CN country note, which now carries only the CSET-backed claim.

### Figures

- **Removed `pc-share`** ("Metrology and inspection market share, 2020 and 2025": KLA 55.0 → 64.1, Nova 2.5 → 4.3). Every value came from the disallowed Substack and none can be rebuilt. Front-matter entry and `{{figure:pc-share}}` marker both removed.
- **Built `pc-segments`** ("Process control market by tool family, 2019", $B): optical inspection 3.0, CD-SEM 1.6, mask inspection 0.94, overlay and film metrology 0.54. Every value is from the CSET supply-chain issue brief, which the body already cites four times in the section the figure now sits under. It does the same structural work the old figure did — showing where the money is — without a share number nobody publishes.

## 12 Advanced Packaging

Words before 1,133 · after 1,317. Figures 2 before, 2 after (both replaced).

Nine of this chapter's fourteen citations were disallowed. It needed the most rebuilding.

### Replacements

- **Reticle field size** — `tomshardware.com` → `asml.com`, the TWINSCAN NXE:3400C product page, which specifies a maximum exposure field of 26 × 33 mm. 858 mm2 is the product of those two.
- **5.5-reticle CoWoS** — `tomshardware.com` → `pr.tsmc.com` (2026 technology symposium release) and TSMC's 2025 annual report. **Two numbers were wrong or unsupported.** The chapter said TSMC "mass-produces 5.5-reticle packages carrying 12 HBM3E or HBM4 stacks at yields over 98%". TSMC's annual report says CoWoS-L at 3.5-reticle has been in production since 2024, that the 5.5-reticle version was certified in 2025 and enters volume production in 2026, and that 9.5-reticle is "in development" with no year. The symposium release says TSMC is "now producing" 5.5-reticle. So the timing is corrected and the ">98% yield" and "12 HBM stacks" figures are gone (see Deletions).
- **The 2027–2029 roadmap** — three `tomshardware.com` citations → `pr.tsmc.com`. TSMC's own release: a 14-reticle CoWoS carrying about ten large compute dies and 20 HBM stacks in 2028, more than 14 reticles in 2029, and a 40-reticle System-on-Wafer the same year. The 2027 line ("a 9.5-reticle interposer supporting 12 HBM5 stacks") loses its year, because TSMC gives none. "12,020 mm2, roughly the area of a compact disc" becomes "roughly 12,000 mm2", which is 14 × 858 mm2 from the ASML field size.
- **Blackwell's CoWoS-L trouble** — three `3dincites.com` citations → `semianalysis.com`, *Nvidia's Blackwell Reworked* (Tier B). SemiAnalysis gives the mechanism directly: thermal-expansion mismatch between dies, embedded bridges, organic interposer and substrate causing warpage, and the bridges carrying the 10 TB/s die-to-die link needing placement accuracy the rest of the package fights. Better than the paraphrase it replaces.
- **CoWoS capacity** — three `trendforce.com` citations (35,000 wafers a month in 2024; 75,000 in 2025; 120,000–140,000 in 2026 plus 50,000–60,000 from OSAT partners, narrowing the gap from 20% to 10%). **No allowed source publishes a CoWoS wafer count, because TSMC will not.** All the absolute numbers are deleted. The section is rebuilt from TSMC's own earnings transcripts on `investor.tsmc.com`: the 60% CAGR TSMC gave at its 2024 symposium, C.C. Wei in July 2024 saying he could not reach supply-demand balance and expected supply to stay very tight, and Wei in October 2025 still declining to give a 2026 number. The refusal is now the point of the section.
- **Card `costSignal`** — "TSMC forecasts CoWoS capacity growing at over 80% CAGR from 2022 to 2027" (unsourced, and above what TSMC has said). Corrected to TSMC's own figure of 60%, from the 2Q24 transcript.
- **OSAT revenue** — `trendforce.com` "Top 10 OSAT companies of 2024" (total $41.56B; ASE 44.6%, Amkor 15.2%, JCET 12.0%, Tongfu 8.0%, Powertech 5.5%, HT-Tech 4.8%) → filed results. ASE Technology Holding: NT$645.4 billion in 2025 with assembly and test revenue up 23%, from ASE's own results release. Amkor: $6.71 billion in 2025, up 6%, from its SEC 8-K. JCET: RMB 35.96 billion in 2024, up 21.2%, from JCET's own annual-results release. The top-ten total and every share percentage are gone, because they are one firm's construction of a peer set and no filing reproduces them.
- **Amkor Peoria** — `trendforce.com` → `ir.amkor.com`, Amkor's own groundbreaking release. Gained detail: the October 2025 groundbreaking date and the CHIPS award of up to $407 million, both of which were only in the card before. Added TSMC's 3Q25 transcript, where Wei confirms the OSAT partner's Arizona plant opens ahead of TSMC's own two packaging fabs.
- **Hybrid bonding** — `tomshardware.com` (SK hynix's first mass-production order, Applied Materials and Besi tools in one inline system for about 20 billion won or $15 million) → `appliedmaterials.com` for the Kinex system, which Applied built with Besi, and `news.skhynix.com` for SK hynix's own tech note, which says full hybrid bonding adoption most likely arrives at HBM4E or HBM5, where stacks pass 20 layers. The price is gone; the technical claim is stronger.
- **China's back end** — `trendforce.com` ("JCET, Tongfu and HT-Tech together took about 25% of top-10 OSAT revenue") → JCET's own RMB 35.96 billion, plus CSET on Chinese share gains in packaging and test tools against no gain in ALD. Same argument, filed numbers.
- **Substrate size criterion** — `tomshardware.com` ("the 120 mm by 150 mm substrate planned for 2027") → no allowed source. The criterion is kept and rewritten around what the 14-reticle interposer implies for ABF build-up film, with no dimension.

### Deletions (no allowed source)

- Nvidia's reservation of 800,000 to 850,000 wafers of TSMC's 2026 CoWoS capacity, "more than half of the total". This is the biggest loss in the three chapters; see below.
- The CoWoS capacity ladder, 35,000 → 75,000 → 120,000–140,000 wafers a month, and the OSAT partners' 50,000–60,000.
- The supply gap narrowing "from about 20% to about 10%".
- Package yield "over 98%" on 5.5-reticle CoWoS.
- "12 HBM3E or HBM4 stacks" on the package in production today, and "24 HBM5E stacks" in 2029.
- The 120 mm by 150 mm substrate.

### Figures

- **Removed `cowos-capacity`** ("TSMC CoWoS capacity, thousand wafers per month": 35 / 75 / 130). Every value came from TrendForce press releases and the 2026 point was a midpoint of a range. Nothing allowed can rebuild it.
- **Removed `osat-share`** ("Share of top-10 OSAT revenue, 2024"). Same reason: the peer set and every share is TrendForce's.
- **Built `cowos-reticles`** ("CoWoS interposer size on TSMC's roadmap", reticles): 3.5 in 2024, 5.5 in production 2026, 9.5 in development, 14 in 2028. From TSMC's 2025 annual report and its 2026 symposium release.
- **Built `china-backend-tools`** ("China-based suppliers' share of back-end tool segments, 2024", %): linear and discrete test 69, burn-in test 9, advanced packaging tools 7, SoC test 5, and ALD at 1 for contrast, labelled in the source line as under 1%. All from CSET. It carries the chapter's China argument, which previously rested on a TrendForce share table.

## The number the argument leaned on

**Nvidia's 800,000 to 850,000 reserved CoWoS wafers for 2026, more than half of TSMC's total.** The chapter had a section called "Capacity and allocation" and the allocation half was built on that one figure: it was how the chapter showed that the chokepoint is not only narrow but spoken for. Nvidia does not disclose it, TSMC does not disclose customer allocation, and SemiAnalysis's numbers sit behind a paywall. The section is now called "Capacity" and argues from TSMC's silence instead — two earnings calls fifteen months apart in which C.C. Wei declines to give a wafer number or a date when supply meets demand. It is a good argument, but it is a different one, and the chapter no longer tells the reader how much of the world's advanced packaging Nvidia has bought.

Two smaller ones: **KLA's 64.1% share** was chapter 08's headline, its oneLiner and the last line of its `plain` paragraph, and "roughly seven times its nearest rival" is a genuinely vaguer claim. And **CoWoS yield above 98%** was the evidence that TSMC had recovered from the Blackwell packaging failure; the chapter now says only that TSMC certified the 5.5-reticle version and produces it.

## Domains added to data/source-tiers.json

None. Every domain cited across the three chapters was already listed under Tier A or Tier B: `semi.org`, `bis.gov`, `amec-inc.com`, `asml.com`, `pr.tsmc.com`, `investor.tsmc.com`, `3dfabric.tsmc.com`, `ir.amkor.com`, `jcetglobal.com`, `prnewswire.com`, `news.skhynix.com`, `appliedmaterials.com`, `sec.gov`, `data.sec.gov`, `govinfo.gov`, `cset.georgetown.edu`, `tel.com`, `asm.com`, `asmpt.com`, `jedec.org`, `azcommerce.com`, `globenewswire.com`, `newsroom.lamresearch.com`, `investors.ontoinnovation.com`, `d1io3yog0oux5.cloudfront.net`, `web.ece.ucsb.edu`, and under Tier B `semianalysis.com` and `newsletter.semianalysis.com`.

## Verification notes

Every replacement was read before it was cited. Three hosts refuse WebFetch and were handled differently. `semi.org` returns 403; its release was verified through search against semi.org itself and cross-checked line by line against the identical SEMI release on `prnewswire.com` ($135.1B from $117.1B, wafer processing +12%, China $49.3B down 0.5%, Taiwan +90% to $31.5B, China plus Taiwan plus Korea 79% against 74%), and the semi.org URL is cited because it is the institution's own. `amec-inc.com` returns an empty body to the fetcher; its 2025 figures were verified through search against amec-inc.com and are internally consistent (RMB 3.744bn of R&D over RMB 12.385bn of revenue is the stated 30.2%). `federalregister.gov` redirects automated traffic to an unblock page, so the December 2024 rule was read as the `govinfo.gov` PDF instead.

PDFs that came back as binary through the fetcher — the two KLA shareholder letters, the Tokyo Electron results transcript, the TSMC 2Q24 and 3Q25 earnings transcripts, the TSMC 2025 annual report, and the Federal Register rule — were extracted locally and read as text, and every quoted number was taken from that text.

No Reuters, FT or Nikkei page is cited in these three chapters. Reuters is blocked to this fetcher and no headline or feed snippet carried a number these chapters needed, so nothing was cited on a snippet alone.

One thing left alone: `newsletter.semianalysis.com/p/disco-corporation-the-world-leader` in the grinding and dicing bullet was already Tier B and is untouched.

---

# Chapters 13 and 14 — strict re-sourcing, 9 September 2026

## 13 Substrates and PCBs

Words before: 1,277. Words after: 1,252. Sources 23 → 17. Build: **D 19 → D 0**, no warnings. Figures 2 → 2 (both replaced). Front matter parses; markers match front matter; `plain` byte-identical to the first paragraph under "How it works"; zero em dashes in prose.

Nineteen of the chapter's twenty-three citations were TrendForce, Yole, Prismark, DigiTimes or a Substack. It has been rebuilt on Ajinomoto's and Nitto Boseki's own investor material, Ibiden's and Unimicron's own disclosures, Samsung Electro-Mechanics' newsroom, Intel's glass-substrate release, TSMC's 2Q26 earnings transcript, TTM's 10-K, and three Nikkei headlines.

### Replacements

| Fact | Old source | New source | What changed |
|---|---|---|---|
| Lead: what is holding back AI supply | trendforce.com 2026/08/11 ("memory and ABF as AI bottlenecks") | TSMC 2Q26 earnings transcript, investor.tsmc.com (A) | The ABF framing goes. C.C. Wei's own words on 16 July 2026: packaging capacity is so tight it **limits customers' growth** |
| Why warpage is the binding problem | trendforce.com 2026/09/03 (Unimicron chairman) | Ajinomoto ABF business briefing, ajinomoto.co.jp IR (A) | Replaced with hard numbers: **18 ABF layers in an HPC substrate against 6 in a PC part, on 3.5× the area** |
| Ajinomoto's position in build-up film | trendforce.com 2025/04/01 (">95% share") | Ajinomoto ABF business briefing (A) | **Number deleted.** Now Ajinomoto's own claim: first adopted 1999, "de facto standard" in package development since |
| Ajinomoto electronic materials economics | trendforce.com 2026/05/08 (JPY 100.7bn sales, JPY 54.6bn OP, >50% margin) | Ajinomoto FY2025 tanshin, ajinomoto.co.jp (A) | Corrected to the segment Ajinomoto actually reports: **Healthcare and Others business profit +45.1% to JPY 66.2bn**, attributed mainly to electronic materials |
| Ajinomoto capacity investment | trendforce.com 2025/04/01 + 2026/05/08 (JPY 25bn for +50% output by 2030; third plant 2032) | Ajinomoto ABF business briefing (A) | **JPY 25bn kept** (from FY2023, sized to 2030). The "+50% output" and the 2032 third plant deleted |
| Nitto Boseki's share of low-expansion glass | insights.trendforce.com (~90% T-glass, 60-70% NER) | Nittobo Integrated Report 2025 + Nittobo T-glass product page (A) | **Both numbers deleted.** Now the company's own words: an "overwhelming competitive advantage in both quality and production capacity for low thermal expansion glass" |
| Nittobo's JPY 80bn | trendforce.com 2026/08/06 ("triple T-glass capacity by March 2029"; US$550m; Nvidia, Microsoft, Google, Amazon, Apple booked) | Nittobo Integrated Report 2025 (A) | **JPY 80bn kept but reframed correctly**: capital spending across the four years of the FY2024-2027 plan. Tripling, the dollar conversion and the customer list deleted. Added: demand running **two to three times** ahead of plan |
| Glass cloth shortage | insights.trendforce.com ("not expected to ease until mid-2027") | Nikkei Asia, "Apple and Qualcomm fret over strained supplies of Japan's glass cloth" (B) | Date deleted; claim reduced to what the headline states |
| China attacking the materials layer | trendforce.com 2026/07/03 (Guangyuan US$1bn Henan; Shengyi RMB 5.2bn + RMB 1.4bn) | Nittobo Integrated Report 2025 (A) + Nikkei Asia, "China chip material makers battle Japan rivals for **$73bn** market" (B) | Plant-level numbers deleted. Nittobo names Chinese and Taiwanese firms as aggressive fast followers; the $73bn is stated in the Nikkei headline |
| Glass core: Samsung Electro-Mechanics | trendforce.com 2026/02/03 (glass core material 2H2027, substrates 2028) | samsungsem.com newsroom, 5 Nov 2025 (A) | Dates corrected to the company's own: Sumitomo Chemical joint venture, **main agreement in 2026, mass production after 2027** |
| Glass core: the general case | yolegroup.com (market "a few hundred million dollars by 2030") | Intel glass substrates release, 18 Sept 2023, intel.com (A) | Market-size number deleted. Replaced with Intel's own timing (**second half of this decade**) and its reason (organics hit shrinkage and warping limits) |
| Ibiden's capacity multiple | digitimes.com ("2.5 times current levels") | Ibiden capital investment notice, ibiden.com (A) | Multiple deleted. Replaced with what Ibiden discloses: **JPY 220bn first phase at the Gama plant, mass production from fiscal 2027**, inside the JPY 500bn total |
| Unimicron capital plan | trendforce.com 2026/08/27 (NT$53.7bn 2026 capex, 80-85% to ABF) | Unimicron 2026 Q2 earnings conference, unimicron.com (A) | Replaced with the company's filed numbers: **Q2 2026 sales NT$42.9bn, ABF 52% of sales, AI data centre 61%, NT$11.7bn of fixed-asset spending in H1** |
| Samsung Electro-Mechanics substrate business | trendforce.com 2026/08/27 (89% and 94% utilisation; packaging solutions +41% to KRW 1.497tn) | samsungsem.com Q2 2026 results, 30 July 2026 (A) | Utilisation figures and the LG Innotek line deleted. Corrected to the company's own quarter: **Package Solution sales KRW 771.6bn, up 37%** |
| Shinko ownership change | digitimes.com (co-investors, June 2025 delisting) | Japan Investment Corporation press release, jiccapital.co.jp (A, already cited) | Delisting date deleted; the 50.02% stake sale and the co-investors come from the JIC release alone |
| AI server board layer count | trendforce.com 2026/07/09 (traditional 14-24 layers, AI 20-30+) | TTM Technologies FY2025 10-K, sec.gov (A) | Replaced with TTM's own capability statement: **more than 30 layers routinely, over 70 at the top** |
| Where PCBs are made | prismark.com (China ~53% by value, Taiwan ~14%, 2022) | TTM Technologies FY2025 10-K (A) | **Both numbers deleted.** TTM says only that its PCB competitors are "mostly based in China and Taiwan". Added in their place, from the same filing: **data centre computing was 24% of TTM's FY2025 sales against 14% in 2023** |
| Southeast Asia hedge | prismark.com (WUS US$280m Thai plant; 16 of the top 100 PCB suppliers in Thailand) | Nikkei Asia, "Thailand carves out a less-glamorous AI niche: printed circuit boards" (B) | Both numbers deleted; the claim is now qualitative |
| Panel formats as packages grow | trendforce.com 2026/05/19 (310×310 mm, 510×515, 600×600) | TSMC 2Q26 earnings transcript (A) | Panel dimensions deleted. Replaced with TSMC's own roadmap statement: **CoWoS beyond 14 times reticle size** |

### Deletions (no allowed source exists)

- **Shinko's 22-layer glass substrate with 11 copper wiring layers per side** (trendforce.com 2026/08/18). Shinko's own news releases carry nothing on it. Bullet removed.
- **Dai Nippon Printing's through-glass-via pilot line in Saitama, December 2025, mass production 2028** (trendforce.com 2026/08/18). Nothing on global.dnp. Bullet removed.
- **The organic advanced IC substrate market at US$14.2bn in 2024** and Yole's supplier ranking (yolegroup.com). No allowed source sizes this market. The opening sentence of "Who makes it" was rewritten around it.
- **Ibiden at ~85% of AI-server build-up substrate in 2023, Unimicron at ~10%, Ibiden falling to ~55% by 2026** (tspasemiconductor.substack.com). Removed with the figure it fed.
- **2026 substrates roughly doubling glass cloth content per unit** (trendforce.com 2025/11/24).
- **Intel asking EMIB customers to prepay for substrate capacity** (trendforce.com 2026/05/20). Paragraph removed.
- **Victory Giant's RMB 3.6bn 1Q26 capex against RMB 730.1m a year earlier; WUS at RMB 1.5bn; Shennan Circuits raising up to RMB 4.88bn** (trendforce.com 2026/07/09). All three bullets removed.

### Figures

- **`abf-share` removed** (Ajinomoto 95 / all other films 5, TrendForce). The 95% cannot be rebuilt from allowed sources, so the figure, its `{{figure:abf-share}}` marker and its front-matter entry are gone. **Replaced at the same position by `abf-layers`**: 6 layers in a PC substrate against 18 in an HPC substrate, from Ajinomoto's own June 2023 ABF business briefing.
- **`substrate-share` removed** (Ibiden 85 / Unimicron 10 / Ibiden 2026 forecast 55, from a Substack). Marker and front-matter entry gone. **Replaced by `unimicron-mix`**: ABF 52%, PCB 27%, BT 9%, HDI 9%, FPC 2%, Other 1% of Unimicron's Q2 2026 sales, from Unimicron's own earnings deck.

### Front matter

`oneLiner` lost "about 95%" and "about 90%". All five `leaders` share strings rewritten to claims their own filings support. `chinaStatus`, `usStatus`, the CN country note and `costSignal` rewritten (the JPY 500bn stays; the "roughly US$3.3 billion" conversion is gone and the first-phase JPY 220bn added). All nine `keyFacts` now trace to Tier A. `plain` untouched.

---

## 14 Test and Assembly

Words before: 1,133. Words after: 1,176. Sources 23 → 27. Build: **D 8 → D 0**, no warnings. Figures 3 → 3 (two replaced). Front matter parses; markers match front matter; `plain` byte-identical to the first paragraph under "How it works"; zero em dashes in prose.

The Advantest, Teradyne, Technoprobe, Aehr, FormFactor, Cohu, Kulicke & Soffa, Besi, Disco and SIA citations were already Tier A or Tier B and are untouched. Every TrendForce and Z2Data citation is gone.

### Replacements

| Fact | Old source | New source | What changed |
|---|---|---|---|
| How big packages get | trendforce.com 2026/08/11 (TSMC's 2028 package holds twenty HBM stacks, plus our own guess of 10-20 chiplets) | TSMC 2Q26 earnings transcript, investor.tsmc.com (A) | HBM-stack count and the chiplet estimate deleted. Replaced with TSMC's own: **a CoWoS roadmap beyond 14 times reticle size** |
| Test capacity being added | trendforce.com 2026/05/05 (KYEC expanding 30-50% in 2026) | ASE Q2 2026 earnings release, SEC Form 6-K (A) | Replaced with a filed number: ASE's installed testers went from **6,797 in Q2 2025 to 8,348 in Q2 2026** |
| OSAT capital spending | trendforce.com 2026/05/05 (ASE, Powertech and KYEC ~NT$370bn in 2026; ASE raising US$7bn to US$8.5bn) | ASE Q2 2026 earnings presentation, SEC Form 6-K (A) | Replaced with ASE's own first-half figures: **US$2.7bn machinery and US$1.4bn buildings and automation**, with leading-edge advanced packaging revenue running ahead of **US$3.5bn** guidance |
| Panel-level packaging at Powertech | trendforce.com 2026/08/31 (NT$70bn, 510×515 mm panels, 1,000 → 5,000 panels a month by 2028, AMD and Broadcom booked) | Nikkei Asia, "Powertech eyes world's first panel-level packaging for AI chips in 2027" (B) | **All four numbers deleted**; the claim is now what the headline states |
| Thermocompression bonders | trendforce.com 2025/12/12 (SK hynix ~50 sets for HBM4, half from ASMPT) + 2026/06/09 (KRW 44.2bn Hanmi order for ~15 more) | ASMPT press release, 22 Dec 2025, asmpt.com (A) | Customer-specific numbers deleted. Replaced with the supplier's own disclosure: **an order for fifteen chip-to-substrate TCB tools**, a TCB market expected to pass **US$1bn by 2027**, and ASMPT targeting **35-40%** of it |
| The size and shape of the OSAT industry | trendforce.com/presscenter/news/20250513-12577.html (top ten billed US$41.56bn in 2024; ASE 44.6%; Amkor 15.2%; four of ten Chinese) | ASE 20-F revenue via SEC XBRL + Amkor XBRL + CSET, "Inside Beijing's Chipmaking Offensive" (all A) | Market total and company shares deleted. Replaced with filed revenue, **ASE US$20.6bn and Amkor US$6.71bn in 2025**, and CSET's count that **four of the top ten OSATs by 2024 revenue are China-headquartered** |
| Back-end geography | z2data.com (Malaysia ~13%, Philippines ~10% of global assembly, test and packaging) | Malaysian Investment Development Authority, 1 July 2026 (A) | Malaysia's **13%** confirmed by the government agency, plus its target of **7% of advanced packaging shipments by 2035**. The Philippines figure is deleted, here and from the "Capacity and geography" criterion |
| Amkor in Arizona | trendforce.com 2026/06/17 (ten-year TSMC partnership) | Amkor news releases, ir.amkor.com, plus TSMC's own release, pr.tsmc.com (A) | Same facts from the two parties: the **US$7 billion** Arizona campus, TSMC contracting turnkey packaging and test there, and the long-term partnership signed in June 2026 |
| The chokepoint's scale comparison | US$41.56bn (trendforce) against US$791.7bn (SIA) | ASE and Amkor filed revenue against SIA (A) | The comparator changes from the top ten to the top two: **US$27.3bn against US$791.7bn** |

### Additions

- Amkor's Q2 2026 net sales of **US$1.90 billion, up 26% year on year**, from the 8-K earnings exhibit on sec.gov, to keep the paragraph anchored to a current number now that the top-ten table is gone.

### Figures

- **`osat-firms` removed** (top-ten OSAT revenue share, TrendForce). Marker and front-matter entry gone. Rebuilding it would need WiseRoad, which is private and files nothing.
- **`osat-region` removed** (top-ten OSAT revenue by home country, summed from the same TrendForce shares). Marker and front-matter entry gone.
- **`tester-market` added**: SoC testers US$6.9bn and memory testers US$2.1bn in calendar 2025, from the Advantest results briefing the chapter already cites.
- **`ase-testers` added**: 6,797 / 7,585 / 8,348 installed testers, from ASE's Q2 2026 Form 6-K.
- `ate-share` unchanged.

### Front matter

ASE's and Amkor's `leaders` share strings changed from top-ten revenue percentages to filed revenue. The CN and MY country notes, `chinaStatus`, `usStatus` and `costSignal` rewritten. Two `keyFacts` (TrendForce, Z2Data) replaced by three Tier A ones (ASE 6-K, CSET, MIDA); nine entries, all Tier A. `plain` untouched.

---

## The numbers the argument leaned on

**Ajinomoto's >95% share of ABF build-up film.** This was chapter 13's headline, its `oneLiner`, a figure, a keyFact and the closing sentence of its takeaways. It is the whole reason the chapter exists: one food company owning the insulator under every accelerator. No Tier A or Tier B source states it. Ajinomoto's own investor material says "de facto standard" and nothing numeric, so that is what the chapter now says. The shape of the claim survives; the measurement does not.

**Nitto Boseki's ~90% of T-glass cloth and 60-70% of NER-glass.** Same problem, same fix. Nittobo's integrated report claims "an overwhelming competitive advantage in both quality and production capacity for low thermal expansion glass", which is a company's self-assessment rather than a measured share, and the chapter is now explicit that it is quoting the company.

**Ibiden at ~85% of AI-server build-up substrate, falling to ~55% by 2026.** This was the only quantitative picture of how concentrated the AI substrate business actually is, and it came from a Substack. Nothing allowed replaces it. The chapter now shows concentration indirectly, through Unimicron's own product mix, and no longer tells the reader how the AI substrate business splits between suppliers.

**Top-ten OSAT revenue of US$41.56 billion, with ASE at 44.6%.** Two of chapter 14's three figures rested on it, and "The chokepoint" scaled its central argument by it. The replacement, ASE plus Amkor at US$27.3 billion, is verifiable from filings but covers two firms rather than ten, so the comparison against industry sales is now a floor rather than a measure.

**China's ~53% of world PCB production by value.** Chapter 13's "China dominates this layer" is now TTM's much weaker statement that its competitors are mostly Chinese and Taiwanese. The three Chinese board-maker capex bullets that followed it are gone with it.

## Domains added to data/source-tiers.json under A

`nittobo.co.jp` (Nitto Boseki investor relations and product pages) and `mida.gov.my` (Malaysian Investment Development Authority, a government agency). Everything else already resolved: `investor.tsmc.com`, `pr.tsmc.com`, `ajinomoto.com`, `ajinomoto.co.jp`, `ibiden.com`, `unimicron.com`, `samsungsem.com` (covers `m.samsungsem.com`), `intel.com` (covers `download.intel.com`), `jiccapital.co.jp`, `asmpt.com`, `advantest.com`, `investors.teradyne.com`, `technoprobe.com`, `aehr.com`, `disco.co.jp`, `besi.com`, `amkor.com` (covers `ir.amkor.com`), `sec.gov`, `data.sec.gov`, `cset.georgetown.edu`, `semiconductors.org`, and under B `asia.nikkei.com` and `newsletter.semianalysis.com`.

## Verification notes

Every replacement was read before it was cited. PDFs that the fetcher returned as binary were downloaded and extracted locally, then read as text: the TSMC 2Q26 earnings transcript, Ajinomoto's FY2025 tanshin and its June 2023 ABF business briefing, Nitto Boseki's Integrated Report 2025, and Unimicron's Q2 2026 earnings deck. The ASE and Amkor 6-K and 8-K exhibits, the TTM 10-K and the ASE revenue concept were pulled from SEC EDGAR and read as text; ASE's 2025 revenue of US$20,573,405,000 is the filed 20-F figure, not a conversion.

Three hosts refuse this fetcher and were handled carefully. `ir.amkor.com` and `businesswire.com` return 403; the two Amkor releases are cited because the search index returns their exact titles, and the US$7 billion figure is stated in the release title itself ("Expands Investment to $7 Billion"). `azcommerce.com` also returns 403 and is therefore not cited, even though it carries the same groundbreaking release. TSMC's own release on `pr.tsmc.com` was fetched and read in full, so the Amkor-TSMC Arizona relationship rests on a source that was actually read.

Reuters is blocked to this fetcher at every URL, including known-good ones, so no Reuters URL could be verified and none is cited. Two Reuters headlines that would have served ("ASE Tech raises 2026 capex by $2 billion", "ASE sees its advanced packaging business doubling to $3.2 billion") were dropped in favour of ASE's own SEC filing.

Nikkei Asia is cited three times, in every case for a claim the headline itself carries, and each URL was confirmed to return HTTP 200. The article bodies are paywalled and were not relied on. The `$73bn` in "China chip material makers battle Japan rivals for $73bn market" is the only number taken from a Nikkei headline.

No claim in either chapter now rests on a source that could not be opened and read, except the two Amkor releases noted above.

## Verification note: Amkor releases (chapter 14)

The two `ir.amkor.com` releases the chapter-14 worker could not open were read in a real browser on 9 September 2026. Both support the sentence that cites them: "Amkor Technology Breaks Ground on New Semiconductor Advanced Packaging and Test Campus in Arizona; Expands Investment to $7 Billion" (6 October 2025: two phases, total investment $7 billion, first facility complete mid-2027, production early 2028, customers including Apple and Nvidia) and "TSMC and Amkor Technology Announce Long Term Partnership to Accelerate Advanced Packaging in the United States" (16 June 2026: a 10-year agreement under which TSMC procures advanced packaging and test services from Amkor in Arizona).

---

# Second search (9 September 2026)

A second, deeper pass over three claims the first pass deleted for want of an allowed source. Two came
back with the source's own number; one did not. Build after: chapters 11, 12 and 13 all D 0, zero
warnings. `plain` was not touched in any of the three and remains byte-identical to the first
paragraph under "How it works".

## 1 · Chapter 12 · TSMC's CoWoS capacity ladder, and Nvidia's share of it

**Searched.** SemiAnalysis (site search plus the free previews of *AI Capacity Constraints — CoWoS and
HBM Supply Chain*, *AI Expansion — Supply Chain Analysis For CoWoS And HBM* and *The Great AI Silicon
Shortage*, all read in a browser because the fetcher is blocked); Nikkei Asia; TSMC's 2Q24, 3Q25 and
2Q26 earnings transcripts and `pr.tsmc.com`; CSIS; CSET and the ETO provision table; Epoch AI.

**Ladder: not found, still deleted.** No allowed source publishes TSMC's CoWoS wafers per month. TSMC
still refuses to; Wei said in October 2025 he would give the number "next year" and had not by the 2Q26
call. The SemiAnalysis previews carry no wafer figure — the closest is the 2023 note that Advanced
Backend Fab 6 in Zhunan has cleanroom for "potentially 1 million wafers per year of 3D Fabric", which
is a building, not a capacity, and covers SoIC and InFO as well. Nikkei's CoWoS pieces are paywalled
past the lede and none of the ledes carries a number.

The near miss is worth recording because it is the kind of thing that looks like a source and is not.
Epoch AI's methodology for its CoWoS work states year-end benchmarks of roughly 13,000–16,000 WPM at
end-2023, 35,000–40,000 at end-2024 and 65,000–75,000 at end-2025 — exactly the ladder the chapter
lost. But Epoch says in the same sentence that it "relies on year-end wafers per month benchmarks from
SemiWiki and TrendForce", both disallowed. That is a relay, not an institutional estimate, and citing
Epoch for it would launder the source. The ladder stays out.

**Nvidia's share: found and restored.** Epoch AI, *Advanced packaging and HBM, not logic dies, were the
bottlenecks on AI chip production in 2025* (data insight, 12 March 2026, Venkat Somala), publishes a
CoWoS split by buyer for 2025: Nvidia 60.3 percent (90% CI 56.5–64.3), Google 13.5, AMD 8.4, Amazon
7.4, other 10.4; and finds that those four consumed around 90 percent of world CoWoS and HBM by value
while using about 12 percent of advanced logic die production. This is Epoch's own Monte Carlo
estimate, built from TSMC node-level revenue, Micron's stated HBM TAM, Epoch's Chip Sales Hub and the
designers' 10-K inventory lines, with published confidence intervals.

The judgment call, stated openly: Epoch's *denominator* for the CoWoS share derives from the same
SemiWiki/TrendForce WPM benchmarks. The share is therefore not fully independent of them. It is
restored anyway, on the precedent this project already set — five equipment rows in the matrix are
"CSET analysis of TechInsights data", and TechInsights is disallowed. An allowed institution's analysis
of industry data is citable as that institution's work; an allowed institution quoting a number it did
not compute is not. That is the line drawn here, and it puts the share in and the ladder out.

**Changed in chapter 12.** Added a keyFact carrying the 60.3 percent with its interval and the
90-versus-12 asymmetry. Added a third figure, `cowos-buyers`, a stacked share of 2025 CoWoS by buyer.
Added a paragraph to "Capacity" and a clause to "Takeaways". Extended `card.costSignal` with the
Nvidia share. One further sentence was added to "Capacity" that is adjacent to the assigned claim and
should be flagged for the chapter's owner: SemiAnalysis reported on 12 March 2026 that front-end wafer
capacity is now the dominant bottleneck and CoWoS constraints are easing. The chapter's opening still
calls packaging "the tightest constraint in the chain". That framing was left alone rather than
rewritten from here, but it is now in tension with a Tier B source the chapter cites elsewhere.

## 2 · Chapter 13 · Ajinomoto's share of ABF, and Ibiden's share of AI-server substrates

**Searched.** `ajinomoto.com` and `ajinomoto.co.jp` (stories, innovation pages, the June 2019 and June
2023 electronic-materials business briefings, integrated-report extracts, the May 2026 plant-site
release); `ibiden.com` IR library; METI's semiconductor strategy decks; the White House hundred-day
supply chain review; CSET and the ETO provision table; Nikkei Asia.

**Ajinomoto: found and restored, at the company's own 95 percent.** Ajinomoto's own global site carries
an interview with Takashi Takahashi and Akito Kitano of Ajinomoto Fine-Techno's Electronics Materials
Division, published March 2026. Asked whether ABF's share of the FC-BGA insulating market was nearer 30
or 50 percent, Kitano answers "More like 95% market share", and adds that practically all
high-performance computers and servers in the world rely on the film. The page's own heading is "Over
95% global market share!?" and its body says the share is "reportedly approaching 100%". This is the
company's own domain and its own staff on the record, which is Tier A.

The deleted claim was ">95%". It is restored as 95 percent, which is what the source actually says, in
the body under "ABF build-up substrates", in `keyFacts`, in the Ajinomoto `leaders` share string, in
`oneLiner` and in "Takeaways". No figure was added: a 95/5 split is a sentence, not a chart.

**Ibiden: the 85 percent not found; a better company statement found instead.** Nothing in Ibiden's
filings, decks or IR pages states a share of the AI-server substrate market, and no allowed outlet
publishes one. Nikkei's own reporting calls Ibiden "the world's top supplier of advanced chip packaging
substrates", but its articles are paywalled past the lede and that phrase could not be read in context,
so it is not cited.

What Ibiden does state, in the Q&A from its 12 May 2026 results presentation on `ibiden.com`, is
better than the estimate that was deleted: on interposer-type substrates it "typically secure[s] a
market share close to 100%" at the launch of a new generation, "but this may decline by 20–30% after
approximately three to six months", and on silicon-bridge substrates the backside interconnection is
hard enough that it expects to hold its technological advantage at least through FY2030. That is a
first-party, quantified statement of exactly the concentration the deleted number was trying to show,
and it explains the mechanism as well. Added to `keyFacts`, to the Ibiden `leaders` share string and to
the Ibiden bullet under "Who makes it".

**Also added.** The White House hundred-day supply chain review of June 2021 records ABF substrate
among the materials commenters flagged as vulnerable and names the substrate makers — Ibiden, Shinko,
Nanya, Samsung, Unimicron, Shennan Circuits, Zhuhai Yueya, AKM — with no American firm among them. One
sentence under "Who makes it", which is the government's own support for the chapter's `usStatus`.

## 3 · Chapter 11 · Korea's share of HBM

**Searched.** SEC EDGAR (SK hynix, Micron, Samsung ADR filings); `news.skhynix.com`;
`news.samsung.com` and `semiconductor.samsung.com`; `investors.micron.com` earnings-call prepared
remarks; MOTIE English press releases; CSIS (*AI Has a Memory Problem*, June 2026; *Where the Chips
Fall*, December 2024; *Mapping the Semiconductor Supply Chain*); CRS R47508; CSET.

**Found and restored, at 82.5 percent for 2025.** SK hynix registered shares in the United States and
filed a Form 424B4 prospectus on 10 July 2026. Under "Competitive Landscape" it prints a chart, "Global
HBM Market Shares by Revenue", whose values were read directly from the filed exhibit image:

| | SK hynix | Samsung | Micron | Korea |
|---|---|---|---|---|
| 2024A | 56.4% | 37.8% | 5.8% | 94.2% |
| 2025A | 63.2% | 19.3% | 17.4% | 82.5% |
| 1Q26A | 56.4% | 20.5% | 23.1% | 76.9% |

The 2025 column is the deleted "83 percent with SK hynix plus Samsung", to within rounding, and it now
comes from a securities filing rather than from a market-research note.

The prospectus attributes the figures to IDC, which is disallowed. They are used because the document
is a registered prospectus: SK hynix has adopted these numbers as its own description of the market it
competes in, under securities-law liability, and company filings are Tier A. The chapter says so in the
sentence that carries them, so the reader can discount them accordingly. The same caveat governs the
DRAM figures used in the data pass.

Two things checked and not used. CSIS's *Where the Chips Fall* gives SK hynix 53, Samsung 38 and Micron
9 for 2023, which would put Korea at 91 percent, but its footnote attributes those to the Korea Herald,
which is press and disallowed — and 2023 is three years stale. Micron's earnings-call remarks say it
expected HBM share "commensurate with our overall DRAM share" in the second half of calendar 2025,
which is a target rather than an outcome and would have required arithmetic on top of it; the
prospectus makes it unnecessary.

**Changed in chapter 11.** Rewrote all three `leaders` share strings to carry the 2025 revenue shares.
Added two `keyFacts` (the HBM split; SK hynix at 29.1 percent of DRAM and three firms above 90 percent).
Added a third figure, `hbm-suppliers`, a stacked 2025 split. Added a paragraph to "Who makes it" giving
the split, the 2024 comparison and the first-quarter-2026 position, and put the 82.5 percent into
"Takeaways".

## Domains added to data/source-tiers.json under A

`bidenwhitehouse.archives.gov` — the archived White House site, which is where the June 2021 hundred-day
supply chain review now lives. `whitehouse.gov` was already listed but does not match the archive host
under the audit script's suffix test. `epoch.ai`, `ajinomoto.com`, `ibiden.com` and `sec.gov` were
already listed.

## Verification

Every number restored was read at its source, not taken from a search snippet. The Ajinomoto interview,
the Ibiden Q&A PDF, the Epoch data insight and its methodology section, the ETO provision table and the
White House review were downloaded and read as text. The SK hynix HBM and DRAM shares are in chart
images inside the filed 424B4; both JPEGs were pulled from the EDGAR archive
(`g32785g29b29.jpg` for HBM, `g32785g29a29.jpg` for DRAM) and read directly. The three SemiAnalysis
previews and the Nikkei pages were opened in a real browser; the Nikkei articles are paywalled past
the lede and nothing was taken from them.

---

# Second search

A second, deeper pass over four claims the first pass deleted for want of an allowed source. Same rule: Tier A plus the four Tier B exceptions. Two claims came back with allowed sources and better numbers, one came back partly, one did not come back at all.

WebSearch worked this time and was used with `allowed_domains` filters; Reuters and FT are blocked to the search crawler and to WebFetch, so those were read in a real browser. Google News RSS was used for discovery only. Every number below was read in the source before it was written.

## 1 · Chapter 02 — Broadcom and Marvell at ~95% of custom AI ASIC design

**Not found. Chapter 02 is unchanged.**

Searched: SemiAnalysis (`newsletter.semianalysis.com` and `semianalysis.com`) for custom-silicon and accelerator posts, including the free previews of the EDA Market Primer, the Accelerator Industry Model and the 2022 Marvell deep dive; Marvell's own investor material (`marvell.com/ai.html`, the Custom AI Investor Event page and its June 2025 slide deck, `investor.marvell.com`); Broadcom's investor releases and 8-K exhibits; SEC EDGAR full-text search for the phrases "custom AI accelerator market", "custom accelerator" + "market share" and "XPU market share" across 10-K, 20-F and 8-K (zero hits); CSET, ETO, IFP and CSIS; Reuters and FT via site search, and the Reuters pieces on the Marvell-Google warrant and Broadcom's earnings read in full in a browser.

What exists and what does not:

- **SemiAnalysis** names Broadcom ASIC Group and Marvell Custom Silicon as the two turnkey design houses and sizes Broadcom's EDA spend, but publishes no share of the custom accelerator market in any free preview.
- **Marvell** publishes a TAM, not a share: $40.8bn of custom XPU TAM by 2028 and $94bn of data centre TAM, plus a count of 18 custom projects. No "our share is X%" claim in the deck or on the site. (`marvell.com` is behind Akamai and refuses this fetcher; the event page and its slide link were opened in a browser.)
- **Broadcom** discloses AI semiconductor revenue, a backlog and named customers, never a share of the custom market.
- **Reuters** frames the pair qualitatively — "larger rival Broadcom, which had been Google's main custom chip partner so far", "sets Marvell up to challenge larger rival Broadcom" — and gives no percentage. That supports the duopoly shape the chapter already argues from named deals, and adds no number.
- **ETO's** `provision.csv` has an "AI ASICs" node, but its rows are from 2019 and carry no share values at all.

The ~95% traces only to sell-side notes relayed by trade press. Nothing allowed carries it. The chapter keeps making the same argument through the OpenAI-Broadcom and Meta-Broadcom announcements, which the parties made themselves.

## 2 · Chapter 05 — EUV tool prices

**Found and restored, with Reuters' own numbers rather than the deleted ones.**

Searched: ASML's 2025 annual report financial-performance section and the full 20-F on EDGAR for "average selling price", "selling price", "ASP" and "units sold" — ASML discloses unit counts and net system sales but **no per-system price anywhere**, which confirms the first pass's note; CRS R47558 *Semiconductors and the CHIPS Act: The Global Context* (mentions ASML's EUV monopoly, no price); the White House 100-day supply-chain review (whitehouse.gov no longer serves the 2021 PDF); CSET's supply-chain brief; ETO's `inputs.csv`, whose EUV node says a single EUV scanner "costs well over $150 million"; and Reuters via Google News RSS, then read in a browser.

The source is Reuters' own explainer, **"Explainer: The $400 million ASML 'printers' key for the AI chip boom"**, by Toby Sterling and Nathan Vifflin, 28 January 2026, updated 28 July 2026, at `reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/` (the slug is the January version's; the July update carries the higher headline number). Reuters reports, in its own voice and attributed to no analyst house:

- DUV tools "costing roughly $60 million each", with ASML at "a market share above 80%" in DUV, ahead of Nikon and Canon;
- "Standard EUV tools cost around $200 million";
- High NA tools, "[o]nly a handful have so far been made, with a price tag estimated at $350 million to $400 million each".

Changed in `content/05-lithography.md`:

| Where | Change |
| --- | --- |
| `oneLiner` | now ends "…it shipped 48 of them in 2025, and each one costs around $200 million" |
| `card.costSignal` | "48 EUV systems inside EUR 32.7bn of 2025 net sales; ASML does not publish per-system prices" → "About $200M for a 0.33 NA EUV scanner, $350-400M for High-NA and about $60M for a DUV tool, on Reuters' reporting; ASML itself does not publish per-system prices". The nameplate now leads on "About $200M" instead of "48" |
| `card.leaders` ASML | "100% of EUV" → "100% of EUV and above 80% of DUV" |
| `keyFacts` | one added, carrying all three prices and the DUV share |
| `figures` | new `tool-price` bars: DUV scanner 60, EUV 0.33 NA 200, High-NA EUV 350 ($M). The title says High-NA is a $350-400M range and the bar shows the low end, so no midpoint is invented |
| Body, "Deep ultraviolet" | adds the $60M price and ASML's above-80% DUV share |
| Body, "High-NA EUV" | adds the $200M and $350-400M prices, prefaced by the fact that ASML publishes no prices itself; `{{figure:tool-price}}` placed after that paragraph |
| Body, "Takeaways" | the 48 systems and four High-NA now carry their prices |

The deleted claim was "about $250M Low-NA, $350-400M High-NA". The High-NA range is restored exactly. The Low-NA number is **not** restored at $250M: Reuters says around $200 million, and the source's own number is what the chapter now carries. The `plain` paragraph is untouched.

## 3 · Chapter 06 — the $259M EUV mask blank market and AGC + Hoya at 93.7%

**Neither number found. Both stay deleted.** A related allowed number was found and added: the supplier count.

Searched: METI's semiconductor strategy materials — the 2021 半導体戦略（概略）and the 2022 and 2024 English strategy PDFs are dead links on `meti.go.jp`; the surviving May 2024 半導体・デジタル産業戦略 deck (185 pages) lists マスクブランクス as a supply-chain item and gives **no share or market size for it**; CSET's 2021 supply-chain brief, which sizes all photomasks at $4bn and names Hoya among mask producers but has no mask-blank line; ETO's `inputs.csv` and `provision.csv`, which have a Photomasks node (2019, country shares only) and **no mask-blank node at all**; Hoya's integrated reports 2022-2025 (qualitative only: "exceptionally high share", no percentage); AGC's Data Book, Company Overview and 2020 Electronic Materials business briefing; the White House 2021 review; Nikkei Asia, Reuters and FT via site search; SemiAnalysis, which has never published on mask blanks.

Two allowed AGC claims were found and added, because they measure the same thing the deleted 93.7% measured — how few firms supply EUV blanks:

- **`agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html`** (13 December 2024, AGC's own site, quoting Nobuyuki Suzuki, president of AGC's Electronics Company): "AGC is one of three companies worldwide that supply photomask blanks for EUV lithography" and "AGC is the only supplier in the world that takes care of all essential materials and processes required to fabricate the EUV mask blank."
- **`agc.com/en/ir/library/outline/pdf/reference.pdf`** (AGC Data Book, March 2026, "Products with Top Market Share", as of January 2026): EUV lithography photomask blanks listed as **No.1 Worldwide**, footnoted "Based on fiscal 2026 estimates by AGC".

Changed in `content/06-photomasks-and-pellicles.md`: the AGC `leaders` string; two new `keyFacts`; two sentences in "Blanks"; "Two firms supply the blanks" → "Three firms supply EUV blanks worldwide on AGC's own count, two of them Japanese" in The chokepoint and Takeaways. The `oneLiner`, the `plain` paragraph and the `mask-set-cost` figure are untouched, and the deleted `blank-share` figure is **not** restored — there is nothing to rebuild it from.

Note the tension the chapter now carries on purpose: AGC ranks itself No.1 worldwide, Hoya says its own share is exceptionally high. Both are self-reported and cannot both be measured against the other. The chapter says so.

## 4 · Chapter 08 — KLA's share of process control

**Found twice, from two independent allowed sources, and restored at 2024 rather than the deleted 64.1%.**

Searched: KLA's investor relations site, the Investor Day 2026 page and every deck linked from it, the Q3 and Q4 FY2026 shareholder letters, and KLA's 10-K; Applied Materials, Onto, Nova, Hitachi High-Tech and Camtek investor materials; CSET and ETO; SemiAnalysis.

**KLA's own investor day.** The master deck from KLA's Investor Day of 12 March 2026, linked from `ir.kla.com/news-events/investor-day-2026`, carries the slide "KLA Continues to Decisively Lead the Industry — Process Control Market Share": **56.5%, KLA Share in 2024, up 2% from 2021, 6.5x nearest competitor**, with gains in optical, e-beam, advanced packaging and reticle inspection. The same 56.5% appears on the "Systems Market-Leading Performance" summary slide alongside CY25 semi PC revenue of $9.0bn and process control intensity of 7.4%. URL: `d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf`. **Disclosure: KLA footnotes the slide "Source: Gartner April 2025."** It is cited here as the company's own claim in its own investor material, on the same basis the brief allows a share claim in a company deck, and the chapter attributes it to KLA rather than stating it flatly.

**CSET's ETO Supply Chain Explorer.** The Explorer's process control tools node gives a **$13.4 billion market in 2024** and company shares of **KLA 57.2%**, Applied Materials 10.5, Lasertec 7.7, Hitachi 5.6, ASML 5.2, Nova 3.7, Onto Innovation 3.0, Camtek 1.5, Rigaku 1.2, other 4.4; country shares of USA 72.0, JPN 15.1, ISR 5.2, NLD 5.2, **CHN 0.8**. Sub-segments, all 2024: defect inspection $5.9bn (KLA 84.6%), film/stack/shape metrology $2.3bn (KLA 47.0, Nova 20.6, Onto 13.6), photomask inspection and repair $2.1bn (Lasertec 45.6, KLA 40.7, Zeiss 11.0), overlay metrology $906.6M (KLA 54.2, ASML 45.1), CD metrology $869.9M (Hitachi 69.0, Applied 30.1), e-beam metrology $769.5M (Applied 49.5, ASML 37.6, KLA 11.9), defect review $618.1M (Applied 71.9, KLA 24.2). URL: `chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60`. **Disclosure: ETO's source line reads "CSET analysis of TechInsights data (2024)."** It is CSET's own published dataset, which the brief names explicitly as allowed. The values above were taken from the version of `data/provision.csv` and `data/inputs.csv` in the `georgetown-cset/eto-supply-chain` repository that matches what the live Explorer serves — confirmed by the market size it prints, $13.4 billion (2024). The repository's August 2026 update carries a 2025 vintage (process control $15.7bn, KLA 56.8%) that the live site does not yet show; **2024 was used throughout** so that every number is visible at the cited link, and because it lines up with KLA's own 2024 figure.

Two independent counts of the same year, 56.5% and 57.2%, agree within seven tenths of a point. That is a stronger footing than the deleted 64.1% ever had.

Changed in `content/08-metrology-and-inspection.md`:

| Where | Change |
| --- | --- |
| `oneLiner` | "holds about seven times the share of its nearest rival" → "holds about 57% of the market, roughly seven times its nearest rival" |
| `card.leaders` | KLA now "56.5% of process control in 2024 on its own investor-day count, 6.5x its nearest rival"; Applied 10.5%, ASML 5.2%, Nova 3.7%, Onto 3.0% added; **Lasertec added** as a sixth leader at 7.7%, since it is the third-largest supplier and outranks three firms already listed |
| `card.countries` CN | "3.4% of CD measuring … as of 2019" → "0.8% of the process control tool market in 2024" |
| `card.chinaStatus` | adds the 2024 figure of 0.8% |
| `card.usStatus` | adds 56.5% / 57.2% and the US and Japanese country shares |
| `card.costSignal` | now leads on "$13.4B" — the market, not KLA's revenue |
| `card.substitution.why` | "nobody has published a gain since" → "it was still at 0.8% in 2024", which is now a published number |
| `keyFacts` | two added, one per source |
| `figures` | **`pc-share` restored** as a stack, "Process control tool revenue share, 2024", from the Explorer's ten company values. This is the figure the first pass removed; it is rebuilt from an allowed source with a different, better-founded set of numbers. **`pc-segments` upgraded** from CSET's 2019 four-family split to the Explorer's 2024 seven-family split in $M |
| Body, lead | now gives 56.5% and 57.2% and names both counts |
| Body, "Variants and trade-offs" | five 2019 bullets rewritten as six 2024 bullets on ETO's own tool families, each with its market size and its leader's share. The ASML eScan 1100 citation is kept inside the defect-inspection bullet |
| Body, "Who makes it" | KLA's share added; "None of them publishes a segment share" — no longer true — replaced by "Nobody else reaches 11 percent"; every rival now carries its share; `{{figure:pc-share}}` placed after the KLA paragraph |
| Body, China paragraph | adds the 0.8% for 2024 and drops the "absence of evidence" hedge, which the new number makes unnecessary |
| Body, Takeaways | "roughly seven times the share of its nearest rival" → "about 57 percent of the market, six to seven times its nearest rival" |

The `plain` paragraph and the first paragraph under "How it works" are byte-identical and untouched; both still say "about seven times as many", which the Q3 FY2026 shareholder letter supports.

## Domains added to data/source-tiers.json

**None.** Every host cited in this pass already resolves: `reuters.com` under B, and `d1io3yog0oux5.cloudfront.net` (KLA's IR CDN), `chipexplorer.eto.tech`, `agc.com`, `hoya.com`, `asml.com`, `ourbrand.asml.com`, `cset.georgetown.edu`, `sec.gov` and `data.sec.gov` under A.

## Build

`node build/build.js` after the edits: no warnings, `A 322 · B 22 · C 0 · D 0 · unclassified 0`.

- 02 design-and-eda: 1,162 words, 16 sources, D 0, 3 figures — unchanged from before this pass
- 05 lithography: 1,446 words, 25 sources, D 0, 4 figures
- 06 photomasks-and-pellicles: 1,237 words, 16 sources, D 0, 1 figure
- 08 metrology-and-inspection: 1,339 words, 15 sources, D 0, 3 figures

## Sources that could not be opened

`marvell.com` and `investor.marvell.com` return 403 to this fetcher (Akamai) at every URL including plain HTML; the Custom AI Investor Event page was read in a browser and its slide deck could not be downloaded by any route, so nothing is cited from it. `ft.com` is paywalled in the browser as well as blocked to the fetcher; no FT article was relied on. Three METI PDFs that search returned are 404 on `meti.go.jp`. The White House 2021 supply-chain review PDF no longer resolves. Reuters was read in a browser and the one article cited was read in full.
