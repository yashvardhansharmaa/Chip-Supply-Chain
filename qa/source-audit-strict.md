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
