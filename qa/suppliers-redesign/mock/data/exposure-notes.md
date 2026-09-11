# China revenue exposure: notes on exposure.json

## What "China revenue" means

Four bases sit behind the same word, and they are not interchangeable.

**Ship-to** attributes revenue to the customer facility that received the goods. Every equipment and materials vendor here uses it except Besi. It is closest to where a controlled tool lands.

**Bill-to** attributes revenue to the entity invoiced. AMD and Besi use it. An invoice routed through a Hong Kong or Singapore arm moves revenue away from the fab that installs the tool.

**Headquarters location** attributes revenue to the customer's corporate home. Micron has always used it. Nvidia switched to it in the FY2026 10-K and restated the two prior years: FY2025 China revenue was $17,108m, or 13.1 percent, on the old billing basis, and $25,048m, or 19.2 percent, restated. This file carries restated figures for FY2024 to FY2026 and original billing-basis figures for FY2021 to FY2023, so the series breaks between FY2023 and FY2024. Each affected row records the superseded number.

Synopsys allocates by where the licence seats sit, Cadence by where the product is used. Samsung reports the region of its own operating units rather than a customer split, and the figure covers phones, displays and Harman alongside memory.

**Selling-entity location** is a fourth basis, and SK hynix uses it. Its note is headed 지역별(법인소재지 기준) 매출액: revenue by region on the basis of where the entity that booked the sale sits, not where the customer is. The China line is what its mainland-China sales companies sold, and the group's Hong Kong subsidiary is a separate entity in the same filing, so Hong Kong is not in it. A stack made in Icheon and sold by the US arm to an American customer counts as US revenue, wherever the finished server is racked. That is why SK hynix's China share can fall while its China revenue climbs: between 2023 and 2025 China went from KRW 10.1 trillion to 19.1 trillion, but the US line went from 15.4 to 66.9 trillion as HBM shipped, and the share fell eleven points.

Every row in the file cites a filing or an investor document on the company's own domain. Two firms file with no US regulator. Samsung's rows point at the audited consolidated statements Samsung publishes on its own investor-relations site; the FY2022 and FY2024 rows read the comparative column of the following year's statements. FY2025 revenue of KRW 333,605,938 million and FY2024 of KRW 300,870,903 million, with the regional lines that give the China numbers, all appear in the statements cited.

SK hynix files with DART, the statutory disclosure system run by Korea's Financial Supervisory Service. Its five rows come from the 지역별 매출액 table in the consolidated-statement notes of the 사업보고서 for each year, in Korean, and each row's note quotes the Korean line and its figure. The receipt numbers on dart.fss.or.kr are 20220322000590 for 2021, 20230321001209 for 2022, 20240319000684 for 2023, 20250319000665 for 2024 and 20260317000635 for 2025. The 2023 to 2025 figures also appear in English, in note 24(3) of the Form 424B4 prospectus SK hynix filed with the SEC in July 2026, and they match to the won. The half-year report to 30 June 2026, receipt 20260814003509, puts China at KRW 32,478,276 million of 131,895,033 million, 24.6 percent; that is six months rather than a year, so it sits in the FY2025 row's note and not in a row of its own.

`chinaShare` is computed from the filed absolute figures, not copied from a filing's own percentage. Nova is the one exception.

## Fiscal-year calendars

`fiscalYear` uses each company's own label; `fyEnd` gives the month the year closed. The labels collide. Tokyo Electron and SCREEN call the year ended March 2026 FY2026; Advantest calls the same twelve months FY2025. Nvidia's FY2026 ended January 2026, Micron's FY2025 in August 2025, Applied's FY2025 in October 2025, Lam's and KLA's FY2026 in June 2026. Compare on `fyEnd`.

## The 2023 to 2024 surge and the decline since

Chinese fabs bought ahead of the October 2022 and October 2023 US rules and the Dutch and Japanese measures that followed. Between FY2023 and FY2024 the China share rose from 25.6% to 42.2% at Lam, 27.3% to 42.8% at KLA, 27.3% to 37.2% at Applied, 23.9% to 44.4% at Tokyo Electron and 20.5% to 39.4% at SCREEN, and from 26.3% to 36.1% at ASML. The stockpile then worked itself off while AI orders from Taiwan and Korea grew the denominator, and all six now sit below their peak: Lam 33.8%, KLA 29.8%, Applied 30.1%, ASML 29.1%, Tokyo Electron 34.1%, SCREEN 38.4%. Nvidia fell from 19.2% to 9.1% as the H20 licence freeze and Beijing's procurement restrictions took hold. Onto Innovation fell furthest, from 25.0% in FY2022 to 7.0% in FY2025.

## Firms not covered, and why

**Axcelis.** Its ion implanters sit inside the controls, but the 10-K reports only North America, Asia Pacific and Europe. No China line appears in it.

**ASM International.** Note 22 of the 2025 annual report gives United States, Europe and Asia only. The narrative says China equipment sales were "more than 30% of total ASM revenue" in 2025, which gives no absolute figure and sets equipment sales against a total-revenue denominator.

**Advantest FY2021 and FY2022.** The audited note reports Japan, Americas, Europe and one Asia line, as does the Integrated Annual Report 2023. The FY2023 to FY2025 rows come from Advantest's own reports, where those three regions reconcile to the audited note.

**Nova** discloses China only as a rounded percentage of total sales. Its rows carry `chinaRevenue: null` and a `chinaShare` taken from the filing. It is good to one significant figure.

**Applied Materials FY2026 and Micron FY2026** had not been filed when this note was last checked (10 September 2026); the series adds them when they are.

Categories match `data/suppliers.json` where the firm appears. Veeco does not appear there, so this file classes it as `Deposition & Etch`.
