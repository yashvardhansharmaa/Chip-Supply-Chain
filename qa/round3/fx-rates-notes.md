# fx-rates notes (round three, SPEC section 2)

Agent slug: `fx-rates`. Downloads: `qa/round2/scratch/fx-rates/` (git-ignored): `g5-monthly.csv` (the data), `g5-20261001.html` and `g5-20230201.html` (release pages used to cross-check).

## Action needed by the main session
- **`node qa/scripts/check-sources.js` now fails** on the 16 `url` values in `data/fx-rates.json`, because `federalreserve.gov` is not yet classified in `data/source-tiers.json`. The Federal Reserve Board is a US government body (tier A under RULES.md). Adding `"federalreserve.gov"` to the `A` list fixes it. I did not edit `source-tiers.json` because it is outside my assignment.
- The SPEC's display example ("about $16.4 billion" for ¥2,443,533 million, year to March 2026) was illustrative. The approved method gives **about $16.2 billion** for that input (case 1 below).

## What I did
1. Downloaded the Board's "G.5 Statistical Release - Monthly rates" package from the Data Download Program (DDP), January 2023 to September 2026 (45 months; September 2026 is the latest month, from the G.5 release of 1 October 2026).
   - URL: `https://www.federalreserve.gov/datadownload/Output.aspx?rel=H10&series=c5d6e0edf324b2fb28d73bcacafaaa02&lastobs=&from=01/01/2023&to=12/31/2026&filetype=csv&label=include&layout=seriescolumn&type=package`
   - The DDP returns an empty body unless the request carries the session cookie set by `https://www.federalreserve.gov/datadownload/Choose.aspx?rel=H10`. Fetch that page first with a cookie jar (`curl -c jar -b jar`), then the URL above. Generic User-Agent `Mozilla/5.0 (research; chipsupplychain.org)`; no personal data sent.
   - Cross-check: every currency's September, August and July 2026 and September 2025 values match the G.5 release table of 1 October 2026 (`https://www.federalreserve.gov/releases/g5/20261001/`), and seven January 2023 values (JPY, KRW, TWD, CNY, EUR, GBP, CHF) match the release of 1 February 2023.
2. Wrote `data/fx-rates.json` (Write tool, indent 2, UTF-8, trailing newline, valid under `python3 -m json.tool`). The text was generated from the CSV by a script in my scratchpad and the repo file is byte-identical to it. Each value is written with the Board's digits as printed (`140.9360` keeps its trailing zero) and parses back equal to the CSV value for all 16 x 45 cells. No rounding, no inversion.
3. Wrote `build/fx.js` (not wired into the build; another agent does that). `node --check` passes; `node build/fx.js --test` passes (output below).

## Coverage
| Code | Series | Unit (as the G.5 release states it) |
|---|---|---|
| JPY | RXI_N.M.JA | Currency units per U.S. dollar |
| CNY | RXI_N.M.CH | Currency units per U.S. dollar |
| TWD | RXI_N.M.TA | Currency units per U.S. dollar |
| KRW | RXI_N.M.KO | Currency units per U.S. dollar |
| EUR | RXI$US_N.M.EU | U.S. dollars per currency unit |
| GBP | RXI$US_N.M.UK | U.S. dollars per currency unit |
| CHF | RXI_N.M.SZ | Currency units per U.S. dollar |
| SGD | RXI_N.M.SI | Currency units per U.S. dollar |
| HKD | RXI_N.M.HK | Currency units per U.S. dollar |
| THB | RXI_N.M.TH | Currency units per U.S. dollar |
| CAD | RXI_N.M.CA | Currency units per U.S. dollar |
| DKK | RXI_N.M.DN | Currency units per U.S. dollar |
| INR | RXI_N.M.IN | Currency units per U.S. dollar |
| SEK | RXI_N.M.SD | Currency units per U.S. dollar |
| NOK | RXI_N.M.NO | Currency units per U.S. dollar |
| AUD | RXI$US_N.M.AL | U.S. dollars per currency unit |

Every series has all 45 months, 2023-01 to 2026-09, with no "ND" (no data) cells. The release page's wording: "(Rates in currency units per U.S. dollar except as noted)", with the starred rows (Australia, EMU members, New Zealand, United Kingdom) footnoted "U.S. dollars per currency unit."

## Gaps and quirks
- **ILS (Israeli new shekel): the Board does not publish it.** G.5 covers 23 currencies and Israel is not among them. The three Israeli firms will need to file in dollars (many do, in 20-F filings) or carry no conversion.
- The same download also holds BRL, LKR, MXN, MYR, NZD, VEB and ZAR. They are not in `fx-rates.json` because no collector has asked for them yet; adding one is a re-run of the same download.
- **GBP multiplier:** the DDP header gives series RXI$US_N.M.UK a "Multiplier" of 0.00999999978 (every other series here says 1). The values are already dollars per pound (1.3406 for September 2026, exactly as the release table prints), so the multiplier is a stale metadata field and is not applied. `fx-rates.json` records this in a `note` on GBP.
- The DDP description for Japan reads "YEA/US$" (the Board's spelling); kept verbatim.
- **The DDP is being retired.** The G.5 page says the "Build Your Package" feature goes during the week of November 9 "in preparation for the eventual retirement of the DDP" and points users to FRED. The predefined package used here may outlive that, but a future refresh may need FRED (St. Louis Fed), which republishes the Board's series, or the Board's G.5 XML (`https://www.federalreserve.gov/releases/g5/data/FRB_g5_xml.zip`).

## build/fx.js
`const fx = require('./fx')(rates)` (rates = parsed `data/fx-rates.json`, or its `currencies` map).
- `fx.toUSD({amount, unit, currency, fyStart, fyEnd})` returns `{usd, rateAvg, months, basis}`. `usd` is in dollars; `unit` scales by one/thousand/million/billion; `rateAvg` is the plain mean of the monthly values from `fyStart` to `fyEnd` inclusive; the amount is divided by it for "Currency units per U.S. dollar" series and multiplied for "U.S. dollars per currency unit". `months` is the count of months averaged. `basis` is one plain string for the CSV, for example "US Federal Reserve G.5 monthly average rates, Apr 2025 to Mar 2026 (12 months, series RXI_N.M.JA), mean 150.7397 JPY per USD" (the mean shown to the Board's four decimals; `usd` uses the unrounded mean).
- Returns null for an unknown currency (ILS included), an unknown unit, a non-number amount, a malformed month, `fyStart` after `fyEnd`, or any month missing from the data (a year ending October 2026 stays null until the Board publishes October).
- `currency: "USD"` passes through unconverted (`rateAvg: null`, `months: 0`, basis "Filed in US dollars, no conversion"), so the page can still size and sort dollar filers. The page shows only their filed figure, per the SPEC.
- `fx.label(usd)` gives three significant figures with "about": "about $16.4 billion", "about $812 million". It rounds before choosing the scale word, so $999.6 million reads "about $1.00 billion". It keeps trailing zeros to stay at three significant figures ("about $1.50 trillion", "about $2.40 billion"); if the owner prefers "about $2.4 billion", drop the zeros with `String(Number(...))` in `label`. Returns '' for zero, negatives and non-numbers.
- Also exported on the module: `SCALE`, `PER_USD`, `USD_PER`, `label`, `monthKey`, `monthNum`.

## Hand-checked cases (the self-test asserts both)
**Case 1, yen (quoted per dollar).** Input: the SPEC's example, 2,443,533 million yen, fiscal year April 2025 to March 2026.
Monthly values (RXI_N.M.JA), Apr 2025 to Mar 2026: 144.1286, 144.8762, 144.4835, 147.2014, 147.4786, 147.8629, 151.3545, 155.1411, 155.9150, 156.6505, 155.1016, 158.6827.
Running sum: 289.0048, 433.4883, 580.6897, 728.1683, 876.0312, 1027.3857, 1182.5268, 1338.4418, 1495.0923, 1650.1939, 1808.8766.
Mean: 1808.8766 / 12 = 150.739716666...
Dollars: 2,443,533,000,000 / 150.7397167 = 16,210,279,905.2 → "about $16.2 billion".

**Case 2, euro (quoted in dollars per euro).** Input: a test amount of 1,000 million euros, calendar year 2025.
Monthly values (RXI$US_N.M.EU), Jan to Dec 2025: 1.0356, 1.0413, 1.0813, 1.1232, 1.1274, 1.1534, 1.1671, 1.1647, 1.1739, 1.1641, 1.1558, 1.1710.
Running sum: 2.0769, 3.1582, 4.2814, 5.4088, 6.5622, 7.7293, 8.8940, 10.0679, 11.2320, 12.3878, 13.5588.
Mean: 13.5588 / 12 = 1.1299 exactly.
Dollars: 1,000,000,000 x 1.1299 = 1,129,900,000 → "about $1.13 billion".

Both were also computed independently with Python's exact `decimal` arithmetic: 16210279905.2185... and 1129900000.0000.

## Self-test output (`node build/fx.js --test`)
```
ok   JPY mean of 12 months = 1808.8766 / 12: 150.73971666666668
ok   JPY 2,443,533 million / mean: 16210279905.21852
ok   JPY label: about $16.2 billion
ok   JPY basis: US Federal Reserve G.5 monthly average rates, Apr 2025 to Mar 2026 (12 months, series RXI_N.M.JA), mean 150.7397 JPY per USD
ok   EUR mean of 12 months = 13.5588 / 12 = 1.1299: 1.1298999999999997
ok   EUR 1,000 million x mean: 1129899999.9999998
ok   EUR label: about $1.13 billion
ok   KRW one month, unit thousand: 1,392,905,200 / 1392.9052: 1000000
ok   unknown currency (ILS) -> null
ok   month not yet published (2026-10) -> null
ok   month before the data (2022-12) -> null
ok   start after end -> null
ok   unknown unit -> null
ok   amount null -> null
ok   USD passes through unconverted: about $130 billion
ok   label(812000000): "about $812 million"
ok   label(16400000000): "about $16.4 billion"
ok   label(999600000): "about $1.00 billion"
ok   label(1500000000000): "about $1.50 trillion"
ok   label(0): ""
ok   label(null): ""
all passed
```

## New bibliography entries
```json
{
  "https://www.federalreserve.gov/releases/g5/20261001/": {
    "title": "Foreign Exchange Rates - G.5 Monthly, release of October 1, 2026",
    "publisher": "Board of Governors of the Federal Reserve System",
    "date": "2026-10-01",
    "type": "dataset",
    "accessed": "2026-10-20"
  },
  "https://www.federalreserve.gov/datadownload/Output.aspx?rel=H10&series=c5d6e0edf324b2fb28d73bcacafaaa02&lastobs=&from=01/01/2023&to=12/31/2026&filetype=csv&label=include&layout=seriescolumn&type=package": {
    "title": "Data Download Program, Foreign Exchange Rates (G.5 / H.10): G.5 Statistical Release, Monthly rates, January 2023 to September 2026 (CSV)",
    "publisher": "Board of Governors of the Federal Reserve System",
    "date": "2026-10-01",
    "type": "dataset",
    "accessed": "2026-10-20"
  }
}
```
