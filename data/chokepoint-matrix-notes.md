# How the chokepoint matrix was built

This table follows a format CSET established in 2021, when Khan, Mann and Peterson published a single page of country shares by supply chain segment and made the geography of the industry legible for the first time ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)). Their Table 1 covered eight segments using 2019 data. SIA and BCG did something similar for fabrication capacity, first in 2021 and again in 2024 ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). This version extends the idea to twenty segments and pulls each one forward to the newest figure available in September 2026.

## Where the numbers come from

Five equipment segments come from CSET's successor project, the ETO Supply Chain Explorer, which now carries a full country breakdown built from TechInsights data for calendar 2025 and published in July 2026 ([source](https://chipexplorer.eto.tech/?selectedNode=N36)). This is the best data in the table by a wide margin. It gives lithography, deposition, etch and clean, process control and advanced packaging tools at one decimal place, on named market sizes, with a consistent methodology. Where the explorer still carries CSET's original 2019 figures, as it does for photoresist, gases and photomasks, that is flagged in the segment note.

Memory comes from Counterpoint, which publishes DRAM and HBM revenue shares quarterly and had Q2 2026 posted by early September ([source](https://counterpointresearch.com/en/insights/global-dram-and-hbm-market-share)). TrendForce's independent count for the same quarter corroborates it closely, at Samsung 39.4, SK hynix 24.9 and Micron 23.3 against Counterpoint's 38, 25 and 24 ([source](https://www.trendforce.com/presscenter/news/20260907-13219.html)). Foundry and OSAT also come from TrendForce, whose top-ten OSAT ranking gives firm revenues in dollars rather than percentages, which makes the country conversion arithmetic rather than judgment ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)). China's position in mature nodes and in domestic equipment comes from CSIS ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). ASML's system counts and revenue come from its own 2025 annual report ([source](https://www.asml.com/en/investors/annual-report/2025)).

## Converting firm shares to country shares

Most published market data is by company, not by country, so nearly every row required a conversion. The rule used here is country of parent-company headquarters, which is the CSET convention. ASML is NL. Zeiss and Trumpf are DE. Applied Materials, Lam and KLA are US. Tokyo Electron, Lasertec, Hitachi High-Tech, Shin-Etsu and SUMCO are JP. Samsung and SK hynix are KR. TSMC, ASE and Unimicron are TW. ASM International is NL, which is why the Netherlands appears in deposition with an eleven point share that has nothing to do with lithography.

Two conversions are contestable and are called out in the segment notes. Siemens EDA is run from Oregon but owned by Siemens AG, and is assigned to DE; assigning it to the US would move thirteen points and put the US near 87 percent of EDA. Arm is headquartered in Cambridge but majority-owned by SoftBank, and is assigned by headquarters, which lands it in Other because the schema has no GB key. Read Other in the Core IP row as the United Kingdom, and read Other in the metrology row as Israel, meaning Nova and Camtek.

Headquarters is not the same as production location, and for four segments the gap is large enough to mislead. Micron is US but fabs most of its bits in Taiwan and Japan. Amkor is US but assembles in Korea, the Philippines and Vietnam. The Taiwanese server ODMs build a growing share of their racks in Mexico and Texas. ASML's EUV value is roughly a third German once Zeiss optics and Trumpf lasers are counted. Where a location-based cut would tell a different story, the note says so.

## Metric

Nine segments use revenue share, because that is what the underlying source measures. Four manufacturing segments use capacity share, because revenue share of a fab is a function of what it happens to be making that quarter. The DRAM row is a good illustration of why the distinction matters: Q2 2026 sat in the middle of a price spike that lifted industry revenue 59.5 percent in a single quarter, so revenue shares moved much faster than wafer starts did.

## Where the numbers are weakest

Four segments deserve scepticism.

Photomasks is the worst. The only clean country split is CSET's from 2019, and it mixes captive mask shops in with merchants, which is why the US shows 40 percent. It also completely misses the real chokepoint, which is Hoya's position in EUV mask blanks.

Specialty gases is next. No public source splits electronic gases by country. The figures are modelled from the known supplier set, and they understate China, which dominates specific molecules rather than the category as a whole.

Mature logic carries the widest error bar. SIA and BCG measured China at 33 percent of sub-28 nm logic capacity in 2022. CSIS says China now holds about half of global mature-node capacity, but on a broader definition that includes discretes and analog. The 38 used here sits between them and is a judgment, not a measurement.

Leading-edge logic and advanced packaging are both CHOKEPOINTS estimates. Nobody publishes 2.5D interposer capacity by country, and the sub-5 nm figure had to be rolled forward from a 2022 baseline to account for TSMC Arizona, Intel Ireland and Samsung Taylor.
