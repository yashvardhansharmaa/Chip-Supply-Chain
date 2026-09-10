# China coverage: a specialist's review

Read 10 September 2026 against `dist/index.html`, the 17 chapters, and the datasets.

## Verdict

The descriptive layer is strong, the strategic layer thin. Every chapter card carries a rendered **Where
China stands** field — a structural commitment almost no comparable site makes — and the five Chinese chip
entries are the most honest I have read anywhere: nulls where Huawei publishes nothing, and an explicit
note that most 910B and 910C dies were probably TSMC N7. Indigenisation is measured, not asserted.

What is missing is China as an author of policy. **MIIT is never mentioned on this site.** Neither is
SAMR, Document 79, Made in China 2025, or the 15th Five-Year Plan. Seven of the board's nine flows are
Washington's instruments or its allies'; the timeline runs 28 US-actor events against 10 Chinese, six of
them minerals retaliation. The bibliography cites **69 SEC EDGAR filings and exactly one Chinese exchange
filing** (Hua Tian's 2025 SZSE annual report). SMIC's results come from its own press page, not its HKEX
annual report; Naura, CXMT and YMTC are cited by homepage. The site's own policy says Chinese government
and company documents count as primary sources. It has barely used them.

China is well described and rarely explained. A reader finishes knowing what China cannot do, and little
about what Beijing is trying, through which ministry, with whose money.

## Stage by stage

| Stage | Site says | Missing or wrong | Source |
|---|---|---|---|
| 01 EDA | No complete domestic flow; the 5-week 2025 cut-off | Empyrean and Primarius sit in `suppliers.json`, unnamed in the chapter | 688269.SZ, 688206.SS annual reports |
| 04 Litho | SMEE ~4% of i-line; "a Shanghai firm, Aishengna" | **"Aishengna" matches no registrant I can find.** Needs characters and a registration, as the supplier data has | Reuters + SAMR registration |
| 06 Depo/etch | Best China chapter. ~11% dry etch, 7% depo, <1% ALD | Piotech unquantified; **SiCarrier absent entirely** | 688072.SS; SiCarrier's BIS listing |
| 07 Metrology | Weakest segment, 0.8%; honest "no published gain ≠ none" | CSET's "polishing" gain is **Hwatsing**, never named | Hwatsing 688120.SS |
| 09 Foundry | SMIC $9.327bn, 93.5% utilisation, no EUV | No node roadmap or advanced-node capacity; the 45k wpm figure sits only in ch17 | SMIC HKEX annual report |
| 10 Memory | **Five China mentions total**, one CXMT sentence | Ch17 calls memory *the binding constraint*; this chapter barely covers it. YMTC unmentioned | CXMT 688825.SS; SemiAnalysis |
| 11 Packaging | JCET RMB 35.96bn; no 2.5D at volume | No domestic interposer or packaging-tool effort | JCET 600584.SS |
| 13 Test | Four of top ten firms Chinese; tools loosely controlled | Correct, and under-exploited — China's real strength | CSET |
| 14 Systems | Optical modules; 70% of indium | **CloudMatrix 384 appears only in `landscape.json`, never in the chapter on scale-up interconnect.** UnifiedBus unmentioned | Huawei's own CloudMatrix384 paper |
| 17 Geopolitics | 348 words on China's response vs 712 on the US regime | Big Fund I and II missing; only Phase III on the timeline | State Council, MOFCOM |
| Suppliers | 30 CN firms, all with Chinese names and tickers | SiCarrier, Kingsemi, Hwatsing, Baidu Kunlun, T-Head, Enflame, Sugon, Inspur | STAR Market filings; BIS |
| Chips | 5 CN chips, superbly caveated | Ascend 950DT (in a note, not a row), Cambricon 690, Kunlun P800, Biren, MetaX, Hygon DCU | Vendor pages; Huawei Connect |

## Ten additions, ranked by how much a policymaker's judgement moves

1. **Chinese filings as sources.** Replace homepage citations with SSE, SZSE and HKEX annual reports for
   SMIC, Naura, AMEC, Piotech, Cambricon, Hwatsing. Kills the 69-to-1 asymmetry. **M**
2. **Two Beijing flows on the board**: China's own export-control regime (dual-use list, Unreliable Entity
   List) and domestic-substitution procurement. The procurement mandate already sits in `landscape.json`
   as a sentence, and is Beijing's most consequential instrument for AI compute — it guarantees Ascend a
   market regardless of price. MOFCOM and procurement notices. **M**
3. **A memory section in chapter 10.** CXMT capacity and HBM timeline; YMTC's listing and recovery. The
   site's thesis says memory binds; the chapter does not carry it. **M**
4. **CloudMatrix 384 in chapter 14.** The clearest illustration of the site's own argument: system scale
   substituting for per-chip performance at four times the power. Huawei's paper is Tier A. **S**
5. **SiCarrier** as a supplier row with its Entity List citation — the most conspicuous absence in a
   30-firm list, and the state's answer to the metrology gap chapter 07 identifies. **S**
6. **Name the ministries.** MIIT, NDRC, MOFCOM, SAMR, CAC: who does what, once, in chapter 17. A
   policymaker cannot brief on a system whose institutions are unnamed. **S**
7. **Big Fund I, II and III** with dates and capitalisation, plus local-government funds. One number
   today, no trajectory. **S**
8. **The rare-earth machinery**: the 0.1% de minimis, the general-licence scheme, approval times. The
   announcements are here; how the regime works is not. **M**
9. **Chinese trade remedies**: the analog-chip anti-dumping probe, the anti-discrimination investigation,
   the SAMR/Nvidia case. Beijing's mature-node counterattack is invisible. **M**
10. **Reverse exposure.** `exposure.json` holds 20 foreign firms' China revenue and no Chinese firm's
    dependence on foreign tools, which Chinese filings disclose. **L**

## Framing notes

**Agency.** China acts here mainly by retaliating. Minerals controls get four timeline entries;
demand-side industrial policy gets none. Beijing's countermeasures are framed as reactions to Washington
rather than instruments with their own logic — import substitution was Chinese policy long before 2022.

**Two denominators.** "35% domestic tool share" (China's own market) and "~10%" (global revenue) are both
correct and sit in different chapters. Both are labelled; neither is reconciled. The 35% is the number
that circulates, and it means much less than it sounds.

**What indigenisation is measured by.** Tool market share is the available metric, not the decisive one.
Yield and cost per good die are what bind. The site calls SMIC yield "the open question" and stops —
correct under the source policy, and worth saying plainly on the card.

**A strength worth protecting.** Refusing to fill Chinese spec fields with market-research numbers is the
most credible thing here. Do not trade it for completeness.

## What a Beijing-watcher would need to trust this

Three things. First, that the site reads Chinese sources: it cites one Chinese exchange filing against 69
American ones, and any specialist checks that ratio first. Second, that Chinese institutions are named and
their instruments tracked — a supply-chain site that never says MIIT reads as written from Washington
outward. Third, that romanised names carry characters and a registration, so "Aishengna" can be checked
against SAMR rather than taken on faith; the supplier data does this, the prose does not. Fix those and
the China half becomes as citable as the American half already is. The scaffolding — a China field on
every card, honest nulls, dated shares with named denominators — is already better than most of what is
published on this subject.
