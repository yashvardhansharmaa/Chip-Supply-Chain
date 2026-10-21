# Supplier revenue: notes on the revenue figures in suppliers.json

Revenue is each company's latest annual figure as filed, in the currency and unit of its own report. For a company that does not report in US dollars, the dollar figure is converted at the average of the Federal Reserve's monthly exchange rates over the company's fiscal year ([release G.5](https://www.federalreserve.gov/releases/g5/20261001/)).

## How the dollar figure is made

Each supplier's `revenue` object holds the figure exactly as the filing prints it, with its unit, currency, fiscal year and the filing it comes from. The monthly rates are in `fx-rates.json`, as the Board of Governors of the Federal Reserve System publishes them, from January 2023 to September 2026.

The build takes the plain mean of the rates for each month from `fyStart` to `fyEnd` and divides the filed amount by it. The Board quotes the euro, the pound and the Australian dollar in dollars per unit, so for those three the build multiplies instead (`build/fx.js`). The page shows the result to three significant figures, after the word "about". No converted figure is stored in a data file.

A fiscal year that includes a month the Board has not yet published gets no dollar figure, and the page shows only the filed one. The fiscal year on the page is named by the month in which it ends, such as "year to March 2026", or by the calendar year for a year that ends in December. Companies name the same April to March year FY2025 or FY2026, so the label each company uses is kept in `fiscalYear` and in the export.

The Copy table export on the Suppliers page carries the filed amount, unit, currency, fiscal year, the year's last month, the filing, the dollar figure and the rates used.
