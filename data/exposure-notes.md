# China revenue exposure: notes on exposure.json

## What "China revenue" means

Three bases sit behind the same word, and they are not interchangeable.

**Ship-to** attributes revenue to the customer facility that received the goods. ASML, Applied Materials, Lam Research, KLA, Teradyne, Entegris, Onto, Camtek, Veeco, Tokyo Electron, SCREEN and Advantest use it. It is the basis closest to where a controlled tool physically lands.

**Bill-to** attributes revenue to the entity invoiced. AMD and Besi use it. An invoice routed through a Hong Kong or Singapore arm moves revenue away from the fab that installs the equipment.

**Headquarters location** attributes revenue to the customer's corporate home. Micron has always used it. Nvidia switched to it in the FY2026 10-K and restated the two prior years. On the old billing basis Nvidia's FY2025 China revenue was $17,108m, 13.1% of revenue; restated on headquarters it is $25,048m, 19.2%. This file carries restated figures for FY2024 to FY2026 and original billing-basis figures for FY2021 to FY2023, so the Nvidia series breaks between FY2023 and FY2024. Each affected row records the superseded number.

Synopsys allocates by where the licence seats sit, Cadence by where the product is used. Samsung reports the region of its own operating units rather than a customer split, and the figure covers phones, displays and Harman alongside memory.

`chinaShare` is computed here from the filed absolute figures, never copied from a filing's own percentage. Nova is the one exception, explained below.

## Fiscal-year calendars

`fiscalYear` uses each company's own label; `fyEnd` gives the month the year closed. The labels collide. Tokyo Electron and SCREEN call the year ended March 2026 FY2026; Advantest calls the same twelve months FY2025. Nvidia's FY2026 ended January 2026, Micron's FY2025 ended August 2025, Applied's FY2025 ended October 2025, and Lam's and KLA's FY2026 ended June 2026. Compare on `fyEnd`.

## The 2023 to 2024 surge and the decline since

Chinese fabs bought ahead of the October 2022 and October 2023 US rules and the Dutch and Japanese measures that followed. Between FY2023 and FY2024, Lam's China share rose from 25.6% to 42.2%, KLA's from 27.3% to 42.8%, Applied's from 27.3% to 37.2%, Tokyo Electron's from 23.9% to 44.4% and SCREEN's from 20.5% to 39.4%. ASML's rose from 26.3% in 2023 to 36.1% in 2024. The stockpile then worked itself off while AI orders from Taiwan and Korea grew the denominator, so every one of those firms now sits below its peak: Lam 33.8%, KLA 29.8%, Applied 30.1%, ASML 29.1%, Tokyo Electron 34.1%, SCREEN 38.4%. Nvidia is the sharp case, falling from 19.2% to 9.1% as the H20 licence freeze and Beijing's procurement restrictions took hold. Onto Innovation fell furthest in relative terms, from 25.0% in FY2022 to 7.0% in FY2025.

## Firms not covered, and why

**Axcelis.** Its ion implanters sit inside the controls, but the 10-K reports only North America, Asia Pacific and Europe. No China line appears anywhere in the filing.

**ASM International.** Note 22 of the 2025 annual report gives United States, Europe and Asia only. The narrative says China equipment sales were "more than 30% of total ASM revenue" in 2025, which is neither an absolute figure nor a total-revenue basis.

**SK hynix.** The English earnings releases give revenue and the DRAM and NAND segments but no geographic split. The audited statements are filed in Korean with DART and were not reachable from the company's own site.

**Advantest FY2021 and FY2022.** The audited note reports Japan, Americas, Europe and one Asia line, and Integrated Annual Report 2023 shows the same four regions. The FY2023 to FY2025 rows come from Advantest's own annual and results materials, where Japan, Americas and Europe reconcile to the audited note.

**Nova** discloses China only as a rounded percentage of total sales. Its rows carry `chinaRevenue: null` and a `chinaShare` taken from the filing. Treat it as one significant figure.

**Applied Materials FY2026 and Micron FY2026** are not yet filed.

Categories match `data/suppliers.json` where the firm appears there. Veeco is absent from that file and is classed as `Deposition & Etch` for its ion beam and MOCVD lines.
