# How the chokepoint matrix was built

This table follows a format CSET established in 2021, when Khan, Mann and Peterson published a single page of country shares by supply chain segment and made the geography of the industry legible for the first time ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)). Their Table 1 covered eight segments using 2019 data. SIA and BCG did something similar for fabrication capacity, first in 2021 and again in 2024 ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). This version extends the idea to twenty segments and pulls each one forward to the newest figure available in September 2026.

## Where the numbers come from

Five equipment segments come from CSET's successor project, the ETO Supply Chain Explorer, which now carries a full country breakdown built from TechInsights data for calendar 2025 and published in July 2026. The explorer is a client-rendered app, so those five rows cite the underlying provision table directly, which is public and machine-readable ([source](https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv)). This is the best data in the table by a wide margin. It gives lithography, deposition, etch and clean, process control and advanced packaging tools at one decimal place, on named market sizes, with a consistent methodology. Where the explorer still carries CSET's original 2019 figures, as it does for photoresist, gases and photomasks, that is flagged in the segment note.

Assembly, test and packaging comes from the same file, at the stage level rather than the node level: ETO gives ATP site capacity by country on a $95bn market in 2022, taken from SIA. China's position in mature nodes and in domestic equipment comes from CSIS ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). ASML's system counts and revenue come from its own 2025 annual report ([source](https://www.asml.com/en/investors/annual-report/2025)). Where a row rests on a company filing, it cites the filing: the memory, packaging and server rows now point at Nvidia's annual report for the supplier structure they can still describe.

## The five rows with no shares

On 9 September 2026 the source rule tightened to Tier A plus four named exceptions, and five rows lost their numbers because the only splits published for them come from market-research firms this project no longer cites. DRAM, HBM, advanced packaging, IC substrates and server assembly now carry `shares: null` and render as dots.

This is not a gap that better searching closes. Nobody in Tier A or Tier B publishes a company or country split for any of the five. Memory shares exist only as quarterly market-research products; Samsung does not separate DRAM from NAND in its filed statements and CXMT filed nothing before its 2026 Shanghai listing, so the split cannot be rebuilt from filings either. No one measures 2.5D capacity by country. Substrate revenue is reported inside broader electronics segments. The ODMs do not break out AI systems. Each of the five notes says what allowed sources do support, which is usually the supplier set and the direction of travel rather than a percentage. SemiAnalysis, one of the four Tier B exceptions, models CXMT at 9 percent of DRAM bit shipments in 2025 rising to 12 percent in 2027; that is the only quantitative memory claim left in the table, and it is a bit share, not a revenue share.

The OSAT row was rebuilt rather than emptied. It used to rank the top ten OSATs by revenue, which was a market-research count and, worse, a headquarters cut that put Amkor's Korean, Philippine and Vietnamese plants in the American column. It now uses ETO's ATP site capacity by country for 2022, which is by location and includes captive assembly inside IDMs and foundries. The measure changed, so the numbers moved a long way: the United States falls from 15 to 3, and a 20-point unattributed bucket appears that is almost certainly Southeast Asia.

## Converting firm shares to country shares

Most published market data is by company, not by country, so nearly every row required a conversion. The rule used here is country of parent-company headquarters, which is the CSET convention. ASML is NL. Zeiss and Trumpf are DE. Applied Materials, Lam and KLA are US. Tokyo Electron, Lasertec, Hitachi High-Tech, Shin-Etsu and SUMCO are JP. Samsung and SK hynix are KR. TSMC, ASE and Unimicron are TW. ASM International is NL, which is why the Netherlands appears in deposition with an eleven point share that has nothing to do with lithography.

Two conversions are contestable and are called out in the segment notes. Siemens EDA is run from Oregon but owned by Siemens AG, and is assigned to DE; assigning it to the US would move thirteen points and put the US near 87 percent of EDA. Arm is headquartered in Cambridge but majority-owned by SoftBank, and is assigned by headquarters, which is why the Core IP row carries a GB column at 48; assigning it by ownership would move those 48 points to Japan. Read Other in the metrology row as Israel, meaning Nova and Camtek.

Headquarters is not the same as production location, and where the gap is large enough to mislead the note says so. Micron is US but fabs most of its bits in Taiwan and Japan. ASML's EUV value is roughly a third German once Zeiss optics and Trumpf lasers are counted. Assembly and test is the segment where the two cuts diverge most, which is why that row was moved onto a site-location basis: on a headquarters cut Amkor's Korean, Philippine and Vietnamese plants land in the American column, and Southeast Asia, which does about a fifth of the world's assembly, disappears entirely.

## Metric

Ten segments use revenue share, because that is what the underlying source measures. Three manufacturing segments use capacity share, because the revenue share of a fab is a function of what it happens to be making that quarter. Five carry no metric at all. Memory is the clearest illustration of why the revenue-versus-capacity distinction matters, and of why the memory rows are now empty: through 2026 a price spike lifted industry revenue far faster than bit output, so a revenue share of DRAM in one quarter says more about pricing than about who can make what. Any figure the table carried would have been a snapshot of a spike.

## Where the numbers are weakest

Four of the fifteen segments that still carry numbers deserve scepticism. The five with no numbers are not weak, they are absent, and the notes above say why.

Photomasks is the worst. The only clean country split is CSET's from 2019, and it mixes captive mask shops in with merchants, which is why the US shows 40 percent. It also completely misses the real chokepoint, which is Hoya's position in EUV mask blanks.

Specialty gases is next. No public source splits electronic gases by country. The figures are modelled from the known supplier set, and they understate China, which dominates specific molecules rather than the category as a whole.

Mature logic carries the widest error bar. SIA and BCG measured China at 33 percent of sub-28 nm logic capacity in 2022. CSIS says China now holds about half of global mature-node capacity, but on a broader definition that includes discretes and analog. The 38 used here sits between them and is a judgment, not a measurement.

Leading-edge logic is the last CHOKEPOINTS estimate left in the table. The sub-5 nm figure had to be rolled forward from SIA and BCG's 2022 baseline to account for TSMC Arizona, Intel Ireland and Samsung Taylor, and no one publishes a current measurement. Advanced packaging used to sit beside it as a second estimate; it has been emptied instead, because its anchor was a single market-research firm's CoWoS capacity reporting and there is nothing allowed to put in its place.
