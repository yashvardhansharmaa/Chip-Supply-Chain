# Expert review, ch 01 Chip Design, EDA and IP (expert-design-and-eda), 20 October 2026

Reviewer stance: GPU architect and EDA flow user (synthesis, place and route, timing and physical signoff, IP licensing). Scope: `content/01-design-and-eda.md` (edited), flashcards, 12 glossary terms, `media/chip-design.json` (proposals only).

Every cited source was opened this session; copies are in `qa/round2/scratch/expert-design-and-eda/<name>/` (raw plus `text.txt` with PDF page markers). SemiAnalysis primer tables I relied on are saved as images in `.../primer-img/` (t1 market size, t2 vendor shares, t3 tool shares).

## Counts
- Errors fixed: 12 (one of them, tool shares scoped to advanced nodes, touches five places)
- Sentences simplified: 2
- Sources replaced or removed: 4; citations added to uncited factual sentences: 3; figures newly dated: 3
- Links fixed: 0 (no broken links; all 24 cited URLs resolve)

## Changes to content/01-design-and-eda.md

| # | Where | Before | After | Why | Source (quote, page) |
|---|---|---|---|---|---|
| 1 | How it works, Tape-out bullet | "Software turns the placed layout into pattern files for the mask shop. First it pre-distorts each shape ... optical proximity correction. Then it cuts the layout into the files a mask writer reads ... mask data preparation. Handing those files to the mask shop is called tape-out." | "Engineers hand the finished layout to the foundry, a step called tape-out. Software then turns the layout into pattern files for the mask shop, in steps that run after tape-out ([source](Siemens blog)). First it pre-distorts ... optical proximity correction. Then it cuts ... mask data preparation." | Technically wrong order and owner. A fabless designer tapes out the finished layout (GDSII/OASIS) to the foundry; OPC and fracturing are the foundry's post-tapeout flow. | Siemens EDA Calibre blog, 8 Jan 2025: "Running post-tapeout flow (PTOF) jobs such as Optical Proximity Correction (OPC), Mask Process Correction (MPC), and Mask Data Preparation (MDP)". New source. |
| 2 | How it works, cost paragraph; keyFacts; card costSignal | Body: "Using a different measure, CSIS put the cost of developing a leading-edge 2 nm chip at about $725 million in September 2026 (...). It put the cost of developing a 28 nm design in the late 2000s at $48 million (...)." keyFact: "In September 2026 CSIS put the cost ... about $725M, against $48M ...". Card: "... CSIS put the cost of developing a leading-edge 2 nm chip at about $725M in September 2026" | Body: both sentences cut (the startup $50-75M sentence stays). keyFact removed. Card: "SemiAnalysis put a single respin at leading-edge nodes at $50-100M in May 2026", costSources [primer, primer] | The figure is a 2022 market-research estimate (IBS) passed through Arm's 2023 prospectus and then CSIS, and the chapter dated it September 2026. Source policy bars market-research figures relayed by others. | CSIS Figure 1 (datawrapper lYtAp) source line: "Arm IPO Prospectus, and Quartr" (Quartr is an investor-data site). Arm F-1, 21 Aug 2023: "According to the International Business Strategy, Inc. ('IBS'), IC design costs were approximately $249 million for a 7nm chip and approximately $725 million for a 2nm chip", "Source: IBS July 2022." Replacement: SemiAnalysis primer, 21 May 2026: "A single respin at leading-edge nodes costs $50-100M" (already cited in body). |
| 3 | The EDA flow, para 2; card leaders (Synopsys, Cadence, Siemens EDA); figure tool-lock title and label | "Inside some steps of the flow, one vendor holds most of the market." Leaders: "90%+ of the timing-signoff market as of 2026" etc. Figure: "Each leading vendor's share of its own design-software segment. Lower end ..." | "For chips at advanced nodes, 7 nm and below, one vendor holds most of the market inside some steps of the flow." Leaders: "... at advanced nodes as of 2026" (all three). Figure title adds "at advanced nodes, 7 nm and below"; label adds "table of tool-level shares at advanced nodes" | The shares are advanced-node shares only; stated without scope they overstate the whole market (Chinese vendors win share at mature nodes, as the chapter says). | Primer, heading "Tool-Level Market Share (Advanced Nodes, 7nm and Below)"; table t3: PrimeTime "90%+", Calibre "85%+", Design Compiler "84-85%", Palladium "55-60%". |
| 4 | Same sentence | "static timing analysis, the check that proves a chip will run at its rated speed" | "static timing analysis, the check that every signal arrives in time at the chip's rated speed" | STA checks the design against timing models; it cannot prove the silicon will run. Now matches the glossary. | Primer: "Signoff analysis (Synopsys PrimeTime 90%+ share ...) validates timing ... across all PVT corners." |
| 5 | Who makes it, para 1; keyFact 1; card costSignal | "Design software and licensed blocks were an $18 billion market in 2025"; keyFact "chip design software and licensed circuit blocks"; card "design software and licensed circuit blocks" | "Design software, simulation software and licensed blocks made up an $18 billion market in 2025, on SemiAnalysis's count"; keyFact and card add "simulation software" | $3.5B of the $18B is simulation software (mostly Ansys-type), so the old wording overstated chip design software. | Primer table t1 "EDA TAM: $18B (2025)": EDA tools $11.5B, IP $3.0B, "Total EDA + IP $14.5B", "Simulation/Analysis (post-Ansys) $3.5B". |
| 6 | Figure eda-share | Title "Design software and licensed-block revenue share, 2025. Synopsys includes Ansys"; data Cadence 29; label "Shares calculated from its calendar 2025 revenue figures ... middle of its $2.2-2.5B estimate" | Title "Share of revenue from design software, simulation software and licensed blocks, 2025. Synopsys includes part of Ansys's revenue"; Cadence 30; label "SemiAnalysis, EDA Market Primer, May 2026, table of calendar 2025 vendor shares" | The source states the shares; the site's own calculation gave Cadence 29 against the stated 30 (rule: never compute). | Primer table t2 "CY25 EDA Vendor Market Share: The Big-3 Control ~87%", column "CY2025 EDA+IP+Simulation Revenue": Synopsys 44%, Cadence 30%, Siemens EDA 13%, All Others ~13%; "*Synopsys includes partial Ansys Revenue for CY25". |
| 7 | The EDA flow, para 1; card test and testSources | Citation for "Three complete EDA flows exist ..." was the primer. Card test: "Only three complete sets of chip design software exist, and a fourth would have to be written from nothing and approved by a foundry." testSources [primer] | Citation now CSIS report #page=13. Card test split: "Only three complete sets of chip design software exist. A fourth would have to be written from nothing and approved by a foundry." testSources [CSIS #page=13, primer] | The primer never says three complete flows exist; CSIS does. Split keeps one URL per card sentence. | CSIS, Oct 2025, PDF p. 13: "only a few companies make EDA software that supports the entire chip design flow ... the 'big three'—Cadence (U.S.), Synopsys (U.S.), and Siemens". |
| 8 | Card chinaStatus (2nd sentence), chinaSources[1] | "CSET found in 2021, from 2019 data, that Chinese design software largely did not support processes at 14 nm and below." CSET brief #page=50 | "CSIS found that as of 2025 Chinese design tools were still far from replacing the full range of advanced capabilities US firms offer, especially for 5 nm and 3 nm chips." CSIS #page=33 | Stale where a newer allowed source exists: Empyrean's 2025 report lists simulator certifications at 8, 5 and 4 nm. The flashcards already use the CSIS finding. | CSIS PDF p. 33: "as of 2025, Chinese EDA tools were still far from replacing the full range of advanced capabilities U.S. firms offer, especially in areas like 5 and 3 nm chip design." (cited in body twice) |
| 9 | plain and its How it works twin | "A chip factory, called a foundry, accepts only designs ..." | "A foundry, a factory that makes chips for other companies, accepts only designs ..." | Not every chip factory is a foundry (Intel's, memory makers'); ch 9 defines a foundry this way. Twin kept identical. | ch 09 plain: "A foundry is a chip factory, or fab, that makes chips for other companies." |
| 10 | Opening, sentence 1 | "Design is the only stage of the supply chain without a factory" | "... that happens entirely in software" | The data-centers-and-power stage has no factory either; "entirely in software" matches "Design runs in five stages, all in software". | none needed (framing) |
| 11 | Opening, sentence 3 | "until the government lifted the rule on 2 July" | "... lifted the requirement on 2 July" | It was a letter, not a published rule; the chapter itself contrasts the 2022 rule with the 2025 letters. | Cadence 8-K, 3 Jul 2025: "the license requirements set forth in the May 23, 2025 letter from BIS were rescinded effective immediately." |
| 12 | The chokepoint, 2025 letter | "a license to export design software classified 3D991 and 3E991" | "... design software and technology classified 3D991 and 3E991" | 3E991 is a technology class, not software. | Cadence 8-K: "electronic design automation software and technology classified under ... (ECCNs) 3D991 and 3E991". |
| 13 | Who makes it, Broadcom/Meta | "Broadcom extended its Meta partnership to multiple gigawatts of MTIA, Meta's in-house chip, and the first 2 nm AI accelerator" | "Broadcom and Meta extended their partnership to multiple gigawatts of MTIA, Meta's custom chip, including what they called the industry's first 2 nm AI accelerator" | "First" is the companies' claim, the 2 nm part is MTIA (not a separate item), and MTIA is co-designed with Broadcom. Also reads more simply. | Broadcom release, 14 Apr 2026: "Meta is partnering with Broadcom to rollout industry's first 2nm AI compute accelerator"; title "... Meta's Custom Silicon, MTIA"; "initial commitment exceeds 1GW ... multi-gigawatt rollout". |
| 14 | Who makes it, Marvell (was uncited) | "Marvell, another US firm, also builds custom accelerators." | "Marvell, another US firm, also builds custom AI chips to each customer's specifications ([source](Marvell 10-K))." | Uncited claim; wording now follows the filing (same as ch 14). | Marvell 10-K FY2026: "We develop custom semiconductor solutions tailored to individual customer specifications ... for next-generation artificial intelligence". Already in bibliography. |
| 15 | Who makes it, Cadence revenue | cited R115 (states $5,296,759 thousand) | cites Cadence's 17 Feb 2026 results release | The chapter's $5.297 billion is a rounding of R115; the release states it as written. | Cadence 8-K ex. 99.01, 17 Feb 2026: "Fiscal Year 2025 Financial Results • Revenue of $5.297 billion". New source. |
| 16 | Who makes it, India; keyFact | "India alone has nearly 20 percent of the world's chip designers"; keyFact undated | "... chip design engineers, the Indian government said in July 2025"; keyFact "In July 2025 the Indian government said ..." | Undated, unattributed government figure; source says "engineers". | PIB, 25 Jul 2025: "India is home to nearly 20% of the world's chip design engineers." |
| 17 | The chokepoint, SMIC (was uncited) | "SMIC, a Chinese foundry, makes Huawei's chips." | "SMIC, China's leading foundry, makes chips for Huawei ([source](Epoch))." | Overstated: Epoch reports the 910C used TSMC-made logic dies. | Epoch AI, 4 Sep 2026 (upd. 24 Sep): "Huawei's fabrication partner, SMIC"; "the Ascend 910C, used logic dies fabricated by TSMC". |
| 18 | Chiplets, UCIe | "adds 48 and 64 GT/s data rates" | "adds faster data rates, 48 and 64 gigatransfers per second" | Unexplained unit for newcomers. | UCIe: "support for 48 GT/s and 64 GT/s data rates". |
| 19 | Chiplets, XDSiP; keyFact | "Broadcom's 3.5D XDSiP platform packs more than ..." | "In a December 2024 presentation, Broadcom said its 3.5D XDSiP platform packs more than ..."; keyFact "In December 2024 Broadcom said its 3.5D XDSiP packages ..." | Undated figure. | Broadcom deck, "December 5th, 2024": ">6000mm2 of Si and 12 HBMs". |
| 20 | keyFact OpenAI | "OpenAI and Broadcom announced ..." | "In October 2025 OpenAI and Broadcom announced ..." | Undated figure. | Broadcom/OpenAI release, 13 Oct 2025. |

Checked and correct as written (no change): Cadence and Synopsys letter dates (23 May, 29 May, 2 July 2025); 3D006 effective 14 October 2022 and still in the CCL (eCFR version from 28 Aug 2026); China has an X under NS 2 in the Country Chart; Synopsys $7.054B and Ansys $756.6M (FY ended 31 Oct 2025); SemiAnalysis $8B, $5.30B, $2.2-2.5B, 31/22/18 percent, 16 to 12 percent China, the management quote, "no startup can replicate"; mask costs, the startup $50-75M and "a few months" (Dark Side, 24 Jul 2022); Arm $4.92B, $2.61B, about 50 percent, AGI CPU and the four server makers; Broadcom $16.7B and 221 percent; Ironwood 192 GB, 6x, 2x; RISC-V in all Nvidia GPUs; Alchip $992M; CSIS pp. 7, 13, 33; CSET p. 50 and its 2019 data basis (p. 5); Empyrean pp. 14, 15, 18; CSET Huawei (17 Jun 2024); Epoch half of H100, 6.75x, 1.5M vs 5.9M, under 4 percent, three to four years.

## Proposals for shared files (main session applies)

**data/flashcards.json, design-and-eda, card 3 `why`**
- Before: "Each foundry certifies specific versions of the existing tools for its own process."
- After: "Foundries specify which signoff tools their customers must use for tape-out."
- Why: the chapter states and cites the after (primer: foundries "specify which tools their customers must use for tape-out"); nothing in the chapter supports version certification.

**data/glossary.json, "signoff"**
- `plain` before: "Signoff is the final set of automated checks a chip design must pass before a foundry will make it. Static timing analysis ... Physical verification ..."
- `plain` after: "Signoff is the final set of automated checks a chip design must pass before tape-out. Static timing analysis checks that every signal arrives in time at the clock speed promised. Physical verification checks that every shape in the layout can be printed."
- `why` before: "A foundry accepts only designs that have passed these checks. Synopsys holds more than 90 percent of timing signoff, and Siemens more than 85 percent of physical verification."
- `why` after: "A foundry accepts only layouts that pass physical verification against its rules. At advanced nodes, Synopsys holds more than 90 percent of timing signoff, and Siemens more than 85 percent of physical verification."
- Why: foundries gate tape-out on manufacturing-rule checks (primer: "TSMC specifies 'Calibre-clean' DRC/LVS for tape-out"); timing is the designer's risk. The shares are advanced-node shares.

**data/glossary.json, "PDK" `why`**
- Before: "A foundry validates each exact version of the design software against its kit. It refuses signoff from any version it has not validated."
- After: "Foundries develop each kit with the design-software vendors about two years before production starts and specify which tools customers must use for tape-out."
- Why: "refuses signoff" overstates it (the customer signs off). Primer: foundries "co-develop PDKs with EDA vendors 24 months before production and specify which tools their customers must use for tape-out".

**media/chip-design.json, step 5 "Checked" `cap`** (re-render after)
- Before: "The software checks that every signal on the chip arrives in time, and a chip factory accepts only designs that pass. The factory then prints the blueprint onto silicon through stencils, and changing it after that costs new stencils and several months."
- After: "The software checks that every signal arrives in time and that every shape can be printed, and a chip factory accepts only designs that pass the printing checks. The factory then prints the blueprint onto silicon through stencils, and changing it after that costs new stencils and a few months."
- Why: a foundry does not reject a design for failing timing; it rejects layouts that break its rules. "A few months" matches the source ("This process takes a few months") and `plain`.

Optional, glossary "TPU": "The seventh generation is called Ironwood." is no longer the newest (see below).

## Newer releases checked (text changed only where wrong)
- Google, Cloud Next '26 (April 2026), "Our eighth generation TPUs": "TPU 8t and TPU 8i deliver up to two times better performance-per-watt over the previous generation, Ironwood"; "TPU 8i pairs 288 GB of high-bandwidth memory with 384 MB of on-chip SRAM"; "Both chips will be generally available later this year." The Ironwood sentence is still true, so unchanged. Owner may want the example updated.
- Empyrean 2026 half-year report, filed 29 Aug 2026 (static.cninfo.com.cn/finalpage/2026-08-29/1225525615.PDF): repeats 80 percent of main digital tools (PDF p. 25), ALPS 8/5/4 nm and Argus 28 nm (pp. 15-16), four full flows (p. 16). No change.
- Arm Q1 FYE27 release, 29 Jul 2026: no new hyperscaler share statement; the May 2026 "about 50%" stays the latest.
- Synopsys FY2025, Cadence 2025, Arm FY2026, Broadcom Q3 FY2026, Alchip 2025 remain the latest full periods as of today.

## Links
- All 24 cited URLs resolve. sec.gov returns 403 ("Undeclared Automated Tool") to parallel requests but 200 to sequential ones with the generic User-Agent and gzip. The Broadcom 8-K URL with CIK 0001730168 redirects (301) to the 1730168 path and works. Broadcom investor pages read through raw Wayback copies (gzip). PIB, ok. New URLs (Siemens blog, Cadence ex. 99.01, Marvell 10-K) all return 200.
- The csis.org "billion-dollar chip" URL is no longer cited in the chapter (it redirects to a renamed slug); its bibliography entry is now unused.

## New bibliography entries
```json
{
  "https://blogs.sw.siemens.com/calibre/2025/01/08/unlocking-post-tapeout-flow-scalability-and-performance-with-cloud-computing/": {
    "title": "Unlocking post-tapeout flow scalability and performance with cloud computing",
    "publisher": "Siemens Digital Industries Software",
    "date": "2025-01-08",
    "type": "page",
    "accessed": "2026-10-20"
  },
  "https://www.sec.gov/Archives/edgar/data/813672/000081367226000013/cdns02172026ex9901.htm": {
    "title": "CADENCE DESIGN SYSTEMS INC, Form 8-K current report for the period ended 2026-02-17 (8-K)",
    "publisher": "U.S. Securities and Exchange Commission (filing by CADENCE DESIGN SYSTEMS INC)",
    "date": "2026-02-17",
    "type": "filing",
    "accessed": "2026-10-20"
  }
}
```

## Open questions for the owner
1. **CSIS $725 million (change 2).** Confirm the removal. Keeping it would mean citing a 2022 IBS estimate relayed by Arm and CSIS. The archived discussion question 3 also used it (archive only, not loaded).
2. **oneLiner** still says "an $18 billion market, licensed blocks included". Adding "and simulation software" would be more exact but pushes it to about 215 characters and needs a share-card re-render. Left as is.
3. **"took effect immediately"** (The chokepoint, "Unlike the 2022 control ...") is uncited. The filings give no effective date for the May letters (Cadence: "a license was required"; Synopsys 8-K, 29 May 2025: "informing Synopsys of new export restrictions"). Keep, cut the clause, or source it.
4. **"Ansys, bought that July"** (and the keyFact's "after the July close"): true (primer: "completed July 2025") but not in the cited Synopsys release.
5. **Taiwanese design-service sentences** remain uncited, and "a finished mask set" undersells turnkey houses, which deliver finished chips. The primer would support: "They hold design-software licenses on behalf of cloud companies and run several tape-outs at once at advanced nodes."
6. The `plain` paragraph keeps uncited figures ("billions of transistors", "less than a billionth of a second") and eight sentences, as before this round.
