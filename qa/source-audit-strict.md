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
