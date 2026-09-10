# SK hynix added to exposure.json

Five firm-years from SK hynix's 사업보고서 on DART. Ticker 000660.KS, KR, Memory. KRW million, as filed (백만원).

| FY | China | Total | Share | DART receipt |
|---|---|---|---|---|
| 2021 | 15,730,223 | 42,997,792 | 36.6% | 20220322000590 |
| 2022 | 12,210,470 | 44,621,568 | 27.4% | 20230321001209 |
| 2023 | 10,110,084 | 32,765,719 | 30.9% | 20240319000684 |
| 2024 | 15,533,563 | 66,192,960 | 23.5% | 20250319000665 |
| 2025 | 19,136,237 | 97,146,675 | 19.7% | 20260317000635 |

Each row's `source` is the full `dart.fss.or.kr/report/viewer.do` URL with dcmNo, eleId and offset. FY2024 total is KRW 66.2tn, matching chapter 10.

## Basis: a correction

The note is 지역별(법인소재지 기준) 매출액, revenue by the location of the **selling entity**, not the customer. SK hynix publishes no customer-location split. Its Form 424B4 note 24(3) renders the same table in English as "based on the location of selling entities" and matches the Korean to the won. Hong Kong is a separate group entity, so it sits outside the China line.

The chart should say so: SK hynix's dot is not comparable with the ship-to and headquarters bases beside it. Its share falls from 30.9% to 19.7% over 2023–2025 because HBM books through the US arm, not because China shrank — China revenue nearly doubled. `basis` is worded so app.js labels it "counted by own units".

## Documents

Opened: the five business reports, the 반기보고서 to 30 June 2026 (receipt 20260814003509; China 32,478,276 of 131,895,033, 24.6%), and the prospectus. Nothing was unavailable. The half-year is six months, so it sits in the FY2025 row's note, not a row.

## Deviation

`currency` is "KRW million", not billion: the filings state 백만원, Samsung's rows match, and app.js's tooltip strips "million" and appends "m".
