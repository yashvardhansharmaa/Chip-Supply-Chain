# How the chokepoint matrix was built

This matrix follows a format that CSET, Georgetown's Center for Security and Emerging Technology, set in 2021 ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)). That year Khan, Mann and Peterson published a single page of country shares by supply chain segment ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)). That page made it easy, for the first time, to see which countries held each part of the industry ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)). Their Table 1 covered eight segments on 2019 data. The Semiconductor Industry Association (SIA) and Boston Consulting Group (BCG) did the same for fabrication capacity, first in 2021 and again in 2024 ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). This matrix extends the format to twenty segments and updates each one to the newest figure available in September 2026.

## Where the numbers come from

Five equipment segments come from the Emerging Technology Observatory (ETO) Supply Chain Explorer, CSET's successor project. In July 2026 the explorer published a full country breakdown for calendar 2025, built from data by the market-research firm TechInsights. The explorer draws its charts in the browser, so those five rows cite the public, machine-readable data file the charts are drawn from ([source](https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv)). This is the best data in the table by a wide margin. It gives country shares for lithography, deposition, etch and clean, process control and advanced packaging tools to one decimal place. Each market's size is stated, and one method is used throughout.

Where the explorer has no 2025 data, it still carries CSET's original 2019 figures. It carries country shares for photomasks (node N33 in ETO's numbering), wafers (N26), chip-design (EDA) software (N84) and licensed circuit designs, known as core IP (N85). For photoresists (N31) and electronic gases (N91), every share field is blank. CSET's paper broke those markets out by sub-category only, so ETO had no country figures to take. Only the photomask row still uses those 2019 figures, and its note says so.

Two rows, photoresist and silicon wafers, used to cite CSET's brief for figures the brief does not contain. On 10 September 2026 both were re-sourced to Japan's Ministry of Economy, Trade and Industry (METI). Its semiconductor strategy deck of December 2025 gives country shares of twenty-four front-end materials markets for 2021 and 2023 ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)).

METI takes the shares from Fuji Keizai, a Japanese market-research firm the matrix cannot cite directly. So both rows are marked `relayed`, with `relayedVia: "Fuji Keizai"`. METI's chart prints Japan's share on each bar. The other columns are measured from the exact bar shapes stored in the PDF. Those measurements reproduce every printed label on the slide exactly, and they sum to 100 on all twenty-four rows.

The assembly, test and packaging (ATP) row comes from the ETO file, which covers the stage as a whole. ETO gives the stage's site capacity by country, on a $95bn market in 2022, and takes those figures from SIA. Site capacity counts each plant in the country where it is located. SIA and BCG print the same 2022 split in their 2024 report.

The EDA, core IP, leading-edge logic and mature logic rows are anchored on the two SIA and BCG value-chain reports. Their figures for 2019 and 2022 were the only allowed measurements of those segments until July 2025 ([2021](https://www.semiconductors.org/wp-content/uploads/2021/05/BCG-x-SIA-Strengthening-the-Global-Semiconductor-Value-Chain-April-2021_1.pdf), [2024](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). SIA's 2025 State of the U.S. Semiconductor Industry report, published that month, extends the combined EDA and core IP figure and the ATP split to 2024 on the same definitions ([source](https://www.semiconductors.org/wp-content/uploads/2025/07/SIA-State-of-the-Industry-Report-2025.pdf)). It does not split logic capacity by process node ([source](https://www.semiconductors.org/wp-content/uploads/2025/07/SIA-State-of-the-Industry-Report-2025.pdf)).

The share of China's own equipment market held by Chinese toolmakers comes from the Center for Strategic and International Studies (CSIS) ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). China's share of all capacity at 28 nm and above, every chip type counted, comes from an SIA filing of February 2025 ([source](https://www.semiconductors.org/wp-content/uploads/2025/02/USTR-2024-0024-00109674-CAT-5016-Public-Document.pdf)). ASML's system counts and revenue come from its own 2025 annual report ([source](https://ourbrand.asml.com/m/71076aaad607de4d/original/asml-2025-annual-report-based-on-us-gaap.pdf)).

Where a row rests on a company filing, it cites the filing. The two memory rows come from SK hynix's US prospectus, and the core IP row from Arm's Form 20-F and the 10-Ks of Synopsys and Cadence. The advanced packaging and server assembly rows carry no shares, but they point to Nvidia's annual report to describe which firms supply those stages.

## Basis and sources

Six fields on every row say what kind of number it is, so a reader can tell without opening the note.

`basis` says how the shares were obtained, and takes one of four values.

- `measured`: the cited source states these numbers. Four rows: photomasks, ATP, leading-edge logic and mature logic.
- `derived`: computed here from figures the sources state, with the arithmetic in `method`. One row, deep-ultraviolet (DUV) lithography, which is a revenue-weighted average of ETO's three DUV nodes.
- `relayed`: a Tier A source, such as a company filing or a government or research-institute report, publishes the number but attributes it to a firm the matrix cannot cite on its own. Eight rows. `relayedVia` names that firm: TechInsights for four equipment rows, through CSET's analysis; IDC for the two memory rows, DRAM and HBM, through SK hynix's prospectus; Fuji Keizai for photoresist and silicon wafers, through METI. The DUV row rests on the same TechInsights data but is marked `derived`, because the weighting across the three nodes is calculated here.
- `estimate`: a judgment made here, with the reasoning in `method` and `note`. Four rows: EDA software, core IP, specialty gases and AI accelerator design.

`basis` is null on the three rows that carry no shares, and so are `hhi` and `top2`.

`sources` is a list of URLs that contain the row's figures, or that the figures were computed from. It is the field to trust. `source` is the single URL the older build reads. It is kept, and it holds the first entry of `sources`. Every URL in `sources` was opened and checked against the row it supports before it was added. No URL is in the list just because it is about the segment in general.

`asOf` is the year the shares describe, stored as a string. It is not always the year the source was published. The photomask row is `"2019"` data published in 2021, the ATP row `"2022"` data republished in 2024, the two logic rows `"2022"` data published in 2024, and the two materials rows `"2023"` data published in December 2025. On `estimate` rows `asOf` is the year the estimate is *for*, and `method` names the older measurements it is anchored on. Where `asOf` and the year in the source's title differ, `method` says which is which.

`method` is one or two sentences on how the shares were obtained: the node number, the arithmetic, the anchor. It was pulled out of `note`, which holds only the judgment calls, the conversions and what the row cannot say.

## Two derived columns

`hhi` and `top2` are computed from `shares` and stored so that nobody has to recompute them.

`hhi` is the row's Herfindahl-Hirschman index (HHI), a common measure of market concentration. It is the sum of the squared percentage shares of the named countries and the Other column, rounded to a whole number. It runs from 10,000 for a monopoly (extreme-ultraviolet, or EUV, lithography, the Netherlands at 100) down to 1,756 for the least concentrated row in the table (specialty gases). `top2` is the two largest shares added together, rounded the same way.

Three cautions. Both columns use whatever the row's `metric` is, so a revenue-share HHI and a capacity-share HHI are not the same quantity and should not be averaged. Both treat the unattributed Other column as if it were one country. That overstates concentration slightly in the rows with a large Other column, most of all ATP, at 20 points. And an HHI computed on countries is not the antitrust HHI, which is computed on firms. In the EDA row, for example, the HHI of 5,690 understates a market where two American firms hold most of the American column.

## The rows with no shares

On 9 September 2026 the source rule tightened to Tier A sources plus four named exceptions (SemiAnalysis, Reuters, the Financial Times and Nikkei Asia). Five rows lost their numbers, because the only splits published for them came from market-research firms that the matrix no longer cites. A second, deeper search the same day recovered two of the five. Advanced packaging, IC substrates and server assembly still carry `shares: null`, so no country panel can show them.

The two rows that came back, DRAM and HBM, now rest on a company filing. SK hynix registered shares in the United States in July 2026 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). Its Form 424B4 prospectus prints two charts, `Global DRAM Market Shares by Revenue (includes HBM)` and `Global HBM Market Shares by Revenue`, with actuals for 2024, 2025 and the first quarter of 2026 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). Both rows use the 2025 actuals converted to country by parent-company headquarters.

The prospectus attributes the underlying figures to IDC, and an IDC report is not citable under this rule. But a registered prospectus is a company filing, which the rule allows. SK hynix has adopted these numbers as its own description of the market it competes in, and it can be held liable for them under securities law. Both row notes say so.

IC substrates stayed empty because ETO's `Substrates` node names Ibiden, Shinko, Nan Ya, Samsung, Shennan Circuits, Zhuhai Yueya and AKM under four countries but leaves every share field blank. The White House hundred-day review of June 2021 names the same firms the same way ([source](https://bidenwhitehouse.archives.gov/wp-content/uploads/2021/06/100-day-supply-chain-review-report.pdf)).

Advanced packaging stayed empty because no one measures interposer-based (2.5D) capacity by country. What does exist is a split by buyer. The research group Epoch AI estimates Nvidia at 60.3 percent of world CoWoS capacity in 2025, and Nvidia, Google, AMD and Amazon together at around 90 percent ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). The row's note records this split because it is the sharpest published measure of how concentrated the segment is. But it measures demand, so it cannot fill a row of country shares. The split also rests on a wafers-per-month series that Epoch takes from SemiWiki and TrendForce.

Server assembly stayed empty because none of CSET's brief on big tech in Taiwan, CSIS's Indo-Pacific mapping or Epoch's chip-owner work splits the stage by country. The contract manufacturers do not break out AI systems either.

The ATP row was rebuilt. It used to rank the ten largest outsourced assembly and test firms by revenue, a count made by a market-research firm. Worse, that count placed each firm's plants in its headquarters country, so Amkor's Korean, Philippine and Vietnamese plants were counted in the American column. The row now uses ETO's site capacity by country for 2022, which counts by plant location and includes the assembly that chipmakers and foundries do in-house. Because the measure changed, the numbers moved a long way. The United States falls from 15 to 3, and a 20-point unattributed remainder appears that is almost certainly Southeast Asia.

## Converting firm shares to country shares

Most published market data is by company, so nearly every row required a conversion to country. The rule here is country of parent-company headquarters, the CSET convention. ASML is NL (the Netherlands). Zeiss and Trumpf are DE (Germany). Applied Materials, Lam and KLA are US. Tokyo Electron, Lasertec, Hitachi High-Tech, Shin-Etsu and SUMCO are JP. Samsung and SK hynix are KR. TSMC, ASE and Unimicron are TW. ASM International is also NL, so the Netherlands has an eleven-point share in deposition that has nothing to do with ASML's lithography.

Two conversions are contestable, and the segment notes say so. Siemens EDA, the design-software arm, is run from Oregon but owned by Siemens AG, so it is assigned to DE. Assigning it to the US would move thirteen points and put the US near 87 percent of design software. Arm is headquartered in Cambridge but majority-owned by SoftBank. It is assigned by headquarters, so the core IP row carries a GB column at 48. Assigning Arm by ownership would move those 48 points from GB to Japan.

Israel has its own column in the metrology row because its six points come from two named firms, Nova and Camtek. The Other column in the two materials rows is the source's own unattributed remainder and is not a country. In the wafer row it includes the Chinese suppliers, and in the photoresist row the Chinese and any remaining European ones.

Headquarters is not the same as production location. Where the gap is large enough to mislead, the row's note says so. Micron is American but makes most of its memory bits in Taiwan and Japan. Much of the value in an ASML extreme-ultraviolet machine is German, in Zeiss optics and Trumpf lasers. In 2025 ASML bought €4.4bn from Zeiss alone across its whole business, more than a quarter of the €16.2bn it spent with all its suppliers ([source](https://ourbrand.asml.com/m/71076aaad607de4d/original/asml-2025-annual-report-based-on-us-gaap.pdf)).

Headquarters and site location differ most in assembly and test, so the ATP row moved to a site-location basis. Counting by headquarters leaves out Southeast Asia, which did about a fifth of the world's assembly in 2022.

## Metric

Fourteen segments use revenue share, because that is what the underlying source measures. Three manufacturing segments use capacity share, because the revenue share of a fab depends on what it happens to be making that quarter. Three carry no metric at all.

In the memory market, a price spike through 2026 lifted industry revenue far faster than bit output. So a revenue share of DRAM says as much about pricing as about who can make what. For that reason the DRAM and HBM rows use full-year 2025 actuals, and both notes carry the warning. A single-quarter figure from this period would have been a snapshot of the spike.

## Where the numbers are weakest

Four of the seventeen segments that carry numbers are estimates made for the matrix, and `basis` says so on each of them. The three with no numbers are absent because no allowed source fills them, and the notes above say why. What follows ranks the weakest rows, estimated and measured, and adds the rows whose dates are years behind the rest of the table.

Photomasks is the weakest. The only clean country split is CSET's from 2019. It counts captive mask shops, which chipmakers run for their own use, together with merchant suppliers that sell masks to others. Including the captive shops puts the US at 40 percent. CSET's split also misses the real chokepoint, Hoya's position in extreme-ultraviolet mask blanks, the coated glass plates that masks are made from.

Captive shops held 63 percent of photomask revenue in 2023 and 66 percent in 2025, according to figures from the industry association SEMI in a Photronics investor presentation filed in August 2026 ([source](https://www.sec.gov/Archives/edgar/data/810136/000081013626000006/plab8-K_3q-earn-exhibit99-2.pdf)). METI's December 2025 deck splits the 2023 market by supplier country, with Japan at 19 percent and the US at about 11, a share measured off the chart ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)). It leaves about 68 percent unattributed, close to that year's captive share ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)). No newer source assigns captive output to a country, so the row still rests on CSET's measured 2019 figure.

Specialty gases is next, and it is the only segment left in the table with no country measurement at all. No allowed source splits electronic gases by country as a category. The figures are modeled from the list of known suppliers. They understate both Japan and China, which dominate particular gases. METI, publishing Fuji Keizai's 2023 survey, puts Japan at 92 percent of fluorine gas mixtures and 61 percent of perfluorocarbon (PFC) etch gases ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)). In the same survey Korea holds 47 percent of nitrogen trifluoride, and China holds 24 percent of it ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)). The row mixes bulk industrial gases with specialty molecules and is good to an order of magnitude.

Mature logic and leading-edge logic are measured, and both are 2022 figures. SIA and BCG measured China at 33 percent of logic capacity at 28 nm and above, and Taiwan at 69 percent and South Korea at 31 percent below 10 nm.

SIA's February 2025 filing uses a broader definition that counts every type of chip, including memory and analog ([source](https://www.semiconductors.org/wp-content/uploads/2025/02/USTR-2024-0024-00109674-CAT-5016-Public-Document.pdf)). On that basis it put China at 33 percent of capacity at 28 nm and above in 2023, up from 19 percent in 2015 ([source](https://www.semiconductors.org/wp-content/uploads/2025/02/USTR-2024-0024-00109674-CAT-5016-Public-Document.pdf)). SIA's January 2025 policy paper projects China at about 37 percent of wafer capacity above 28 nm by 2027, a forecast for all mature-node chips, of which logic is one part ([source](https://www.semiconductors.org/wp-content/uploads/2025/01/SIA_WINNING-THE-CHIP-RACE_2025.pdf)). SIA's 2025 industry report puts China at 27 percent of all wafer fabrication capacity in 2024, every node and chip type together, with no logic or node split ([source](https://www.semiconductors.org/wp-content/uploads/2025/07/SIA-State-of-the-Industry-Report-2025.pdf)).

Production below 10 nm has since started in Arizona. As of October 2026, no allowed source publishes a newer node-level split of either row.

Advanced packaging carries no estimate, because its only anchor was a single market-research firm's CoWoS capacity reporting and no allowed source can take its place. The nearest allowed substitute is the year-end wafers-per-month series in Epoch AI's methodology, which would let anyone compute the figure. But Epoch quotes that series from SemiWiki and TrendForce, so it relays a market-research number.

EDA software and core IP are estimates because the two segments are measured only together. SIA and BCG report them as one figure, 74 percent American in 2019 and 68 in 2022, and SIA's 2025 report carries the same series to 66 percent in 2024 ([source](https://www.semiconductors.org/wp-content/uploads/2025/07/SIA-State-of-the-Industry-Report-2025.pdf)). The two rows split that combined share between EDA and core IP using the vendors' filed revenue. Synopsys, Cadence and Arm report that revenue in filings. Siemens does not report Siemens EDA's revenue separately, and Imagination, SiFive and the Chinese vendors file nothing comparable. So the German column in the EDA row and the total market size in the core IP row are estimated here.

AI accelerator design is an estimate of a market that no allowed source publishes as a market at all. Its Chinese column is the least certain number in the table.

Four rows are years behind the rest of the table. The two logic rows are 2022, the latest year SIA and BCG measured logic capacity by node.

The ATP row is also 2022. A search for a newer split on 10 September 2026 covered ETO, both SIA and BCG reports, the 2025 SIA Factbook and SEMI's releases. It missed one, a 2024 chart on the same site-capacity basis in SIA's 2025 State of the U.S. Semiconductor Industry report. The chart puts China at 28 percent, Taiwan at 20, South Korea at 9, Japan at 8, Europe at 7 and an unattributed Other at 26, with the US bar too small to label ([source](https://www.semiconductors.org/wp-content/uploads/2025/07/SIA-State-of-the-Industry-Report-2025.pdf)). From 2022 to 2024, Taiwan falls from 28 to 20 and Europe rises from 3 to 7. The report does not explain the shift, so the two years may not be strictly comparable.

The photomask row is 2019 because no newer source splits that market by country on CSET's definition. That definition counts the captive shops, which held about two-thirds of the market in 2025. All four rows carry the year in `asOf`.
