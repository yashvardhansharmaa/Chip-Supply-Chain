# China revenue exposure: notes on exposure.json

## What "China revenue" means

Four bases sit behind the same word, and they are not interchangeable.

**Ship-to** attributes revenue to the customer facility that received the goods. Every equipment and materials vendor here uses it or counts by the customer's location, except Besi. It is closest to where a controlled tool lands.

**Bill-to** attributes revenue to the entity invoiced. AMD and Besi use it. An invoice routed through a Hong Kong or Singapore arm moves revenue away from the fab that installs the tool.

**Headquarters location** attributes revenue to the customer's corporate home. Micron uses it in every year in this file. Nvidia switched to it in the third quarter of FY2026, and its FY2026 10-K recast the two prior years. FY2025 China revenue was $17,108m, or 13.1 percent, on the old billing basis, and $25,048m, or 19.2 percent, recast. This file carries the recast figures for FY2024 and FY2025, the FY2026 figure on the new basis, and original billing-basis figures for FY2021 to FY2023, so the series breaks between FY2023 and FY2024. Each affected row records the superseded number.

Synopsys allocates by where the license seats sit, Cadence by where the product is used. Synopsys's FY2022 to FY2025 rows leave out its Software Integrity business, sold in September 2024, because the FY2024 and FY2025 10-Ks recast those years. FY2022 as first filed, with that business, was China $795.405m of $5,081.542m, and the FY2022 row records it. FY2021 has no recast figure and still includes the business. Samsung reports the region of its own operating units rather than a customer split, and the figure covers phones, displays and Harman alongside memory.

**Selling-entity location** is a fourth basis, and SK hynix uses it. Its note is headed 지역별(법인소재지 기준) 매출액: revenue by region on the basis of where the entity that booked the sale sits, not where the customer is. The China line is what its mainland-China sales companies sold, and the group's Hong Kong subsidiary is a separate entity in the same filing, so Hong Kong is not in it. A stack made in Icheon and sold by the US arm to an American customer counts as US revenue, wherever the finished server is racked. That is why SK hynix's China share can fall while its China revenue climbs: between 2023 and 2025 China went from KRW 10,110,084 million to 19,136,237 million, but the US line went from 15,390,229 million to 66,885,115 million as HBM shipped, and the share fell from 30.9 percent to 19.7 percent.

Every row in the file cites a filing or an investor document on the company's own domain. Samsung does not file with the SEC. Its rows point at the English version of the audited consolidated statements Samsung publishes on its own investor-relations site, at the page of the regional note. The FY2022 and FY2024 rows read the comparative column of the following year's statements, which repeats the figures of the earlier statements unchanged. Samsung's list of subsidiaries puts its Hong Kong and Taiwan sales subsidiaries in the China region, so its China line can include sales booked there. FY2025 revenue of KRW 333,605,938 million and FY2024 of KRW 300,870,903 million, with the regional lines that give the China numbers, all appear in the statements cited.

SK hynix files with DART, the statutory disclosure system run by Korea's Financial Supervisory Service. Its five rows come from the 지역별 매출액 table in the consolidated-statement notes of the 사업보고서 for each year, in Korean, and each row's note quotes the Korean line and its figure. The receipt numbers on dart.fss.or.kr are 20220322000590 for 2021, 20230321001209 for 2022, 20240319000684 for 2023, 20250319000665 for 2024 and 20260317000635 for 2025. The 2023 to 2025 figures also appear in English, in note 24(3) of the Form 424B4 prospectus SK hynix filed with the SEC in July 2026, and they match to the won. The half-year report to 30 June 2026, receipt 20260814003509, puts China at KRW 32,478,276 million of 131,895,033 million, 24.6 percent. That is six months, so it sits in the FY2025 row's note and not in a row of its own.

`chinaShare` is computed from the filed absolute figures, not copied from a filing's own percentage. Nova is the one exception.

`chinaRevenue` and `totalRevenue` keep every digit the filing gives. Filings in thousands (Besi, Cadence, Camtek, Entegris to FY2023, KLA, Lam, Nova's totals, Onto, Synopsys, Teradyne and Veeco) are written in millions with three decimals, so 141,959 thousand dollars appears as 141.959. Until 20 October 2026 they were rounded to one decimal, which moved two shares by a tenth of a point. Camtek FY2022 is now 44.2 percent and Besi FY2022 25.9 percent.

## TSMC, Disco and Hoya

**TSMC** counts net revenue mainly by the country where the customer has its headquarters, the basis Micron uses. Its Form 20-F says that split can differ from where TSMC sells or ships the product and from where the order is placed. The filing does not say where a customer headquartered in Hong Kong is counted. The rows come from the geography table in the revenue note of the 20-F, which gives NT$ millions to one decimal place. The 2025 20-F supplies 2023 to 2025, and the 2023 20-F supplies 2021 and 2022. The 20-Fs for 2021 to 2025 give the same figures for every year they share, so nothing has been restated.

**Disco** counts sales by the customer's location (顧客の所在地), as SCREEN and Camtek do. The rows come from the regional note (地域ごとの情報) of Disco's Japanese earnings releases (決算短信), because the English translations leave that note out. The note splits sales into Japan, China, Korea, Taiwan, other Asia, the Americas and Europe, and it does not say where Hong Kong sits. Disco reports a single segment, so the regional total is its consolidated net sales, rounded down to the million yen. Each release repeats the prior year's figures unchanged.

**Hoya** counts revenue by the location of the customers. The rows come from note 5 of the English IFRS statements Hoya publishes with its auditor's report, which list Japan, the US, Singapore, China, South Korea or Taiwan, and others. The note does not say where Hong Kong sits. Revenue here is sales to external customers, the line the note splits, and the income statement also shows a larger total revenue that adds finance income, share of profit of associates and other income. The figure covers the whole group. In the year to March 2026, Information Technology, the segment that makes mask blanks, had 354,751m yen of the 947,749m yen, and Life Care, which makes eyeglass and contact lenses and medical endoscopes, had 590,680m yen. The statements for the year to March 2024 are a scanned image, so that row cites the prior-year column of the next year's statements. Every later set of statements repeats the earlier year's figures unchanged.

## Fiscal-year calendars

`fiscalYear` names each year by the calendar year in which it ends, and `fyEnd` gives the month the year closed. Company labels collide. Tokyo Electron and SCREEN call the year ended March 2026 FY2026, and Advantest, Disco and Hoya call the same twelve months FY2025. This file labels it FY2026 for all five, and the notes on the Advantest, Disco and Hoya rows give each firm's own label. Nvidia's FY2026 ended January 2026, Micron's FY2025 in August 2025 and its FY2026, a 53-week year, on 3 September 2026, Applied's FY2025 in October 2025, Lam's and KLA's FY2026 in June 2026. Synopsys's FY2024 ended on 2 November 2024, and its reports label it with the closest month end, October. Compare on `fyEnd`.

## The 2023 to 2024 surge and the decline since

Chinese fabs bought ahead of the October 2022 and October 2023 US rules and the Dutch and Japanese measures that followed. Between FY2023 and FY2024 the China share rose from 25.6% to 42.2% at Lam, 27.3% to 42.8% at KLA, 27.3% to 37.2% at Applied, 23.9% to 44.4% at Tokyo Electron and 20.5% to 39.4% at SCREEN, and from 26.3% to 36.1% at ASML. The stockpile then worked itself off while AI orders from Taiwan and Korea grew the denominator, and all six now sit below their peak: Lam 33.8%, KLA 29.8%, Applied 30.1%, ASML 29.1%, Tokyo Electron 34.1%, SCREEN 38.4%. Nvidia fell from 19.2% to 9.1% after the US required a license for its H20 chip in April 2025, and Nvidia says the Chinese government discouraged customers from buying its data center products. Onto Innovation fell furthest, from 25.0% in FY2022 to 7.0% in FY2025.

## Firms not covered, and why

**Axcelis.** Its ion implanters sit inside the controls, but the 10-K reports only North America, Asia Pacific and Europe. No China line appears in it.

**ASM International.** Note 22 of the 2025 annual report gives United States, Europe and Asia only. The narrative says China equipment sales were "more than 30% of total ASM revenue" in 2025, which gives no absolute figure and sets equipment sales against a total-revenue denominator.

**Lasertec.** Its annual securities report (有価証券報告書) splits sales by customer location into Japan, Korea, Taiwan, other Asia (その他アジア), the US and Europe, with no line for China. The report for the year to June 2026 gives that split for the years to June 2025 and June 2026 ([source](https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z32V.pdf#page=88)). The report for the year to June 2024 gives the same six lines for the years to June 2023 and June 2024 ([source](https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100UFKD.pdf#page=74)). Lasertec's own financial-highlights workbook shows the same six lines for every year from FY2019 to FY2026 ([source](https://ssl4.eir-parts.net/doc/6920/ir_material_for_fiscal_ym9/209785/00.xlsx)).

**AGC.** Its Financial Review, which carries the audited IFRS statements, splits sales into Japan, Asia, the Americas and Europe by the location of the group company that made the sale, a selling-entity basis like SK hynix's ([source](https://www.agc.com/en/ir/library/financial/pdf/financial2025e.pdf#page=51)). The 2021 edition, which covers FY2020 and FY2021, uses the same four regions, as do the editions in between, so no year from FY2020 to FY2025 has a China line ([source](https://www.agc.com/en/ir/library/financial/pdf/financial2021e.pdf#page=31)).

**Advantest before the year to March 2024.** The audited note reports Japan, Americas, Europe and one Asia line, as does the Integrated Annual Report 2023. The rows for the years to March 2024, 2025 and 2026 (FY2023 to FY2025 in Advantest's own labels) come from Advantest's own reports, where those three regions reconcile to the audited note.

**Nova** discloses China only as a rounded percentage of total sales. Its rows carry `chinaRevenue: null` and a `chinaShare` taken from the filing. It is precise only to the whole percentage point.

**Applied Materials FY2026** had not been filed when this note was last checked (20 October 2026). Applied's year ends in October 2026, and the series adds it when the 10-K is filed. Micron's FY2026 10-K, filed on 9 October 2026, is in the file.

Categories match `data/suppliers.json` where the firm appears. Veeco does not appear there, so this file classes it as `Deposition & Etch`.
