# rev-japan notes (round three, 20 October 2026)

Task: filed consolidated revenue for the 35 Japanese suppliers in `qa/round3/firms-japan.json`. Output `qa/round3/revenue-japan.json`. Downloads in `qa/round2/scratch/rev-japan/`.

## Progress log
- EDINET API v2 needs a subscription key (401), so no API. EDINET PDFs open directly at `https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/<docID>.pdf`.
- Many firms' IR pages are rendered by Pronexus E-IR (eir-parts.net). The full document list is a JSONP file at `https://ssl4.eir-parts.net/V4Public/eir/<code>/<lang>/announcement/announcement_<n>.js` (n from the site's `common_conf.js`); it lists the yuho PDF (with its EDINET doc ID), English securities reports, tanshin and annual reports.
- Preference: the annual securities report (Japanese original on EDINET, or the company's English translation of it), else audited English financial statements in the annual report, else the TSE results release (tanshin).
- Done: Tokyo Electron, Shin-Etsu Chemical (company label FY2025 = year to March 2026), SUMCO.
- Fiscal-year label rule: the company's own English label where it uses one (TEL "FY2026", Shin-Etsu and Fujifilm "FY2025" for the year to March 2026); where the filing says 2025年度 → "FY2025"; where it says 2026年3月期 → "FY2026". fyStart/fyEnd always carry the months.
- Done: Tokuyama, Tokyo Ohka Kogyo, Fujifilm (US GAAP), Sumitomo Chemical (IFRS), Adeka, Fujimi.
- Other IR vendors: XJ Storage (`https://www.xj-storage.jp/public-list/GetList2.aspx?company=AS<id>&len=40&doctype=1120,3&output=json&callback=cb`), ircms.jp / irstreet.com export scripts, azcms.ir-service.net (`_irvassetctgry.aspx?private=<cat><id>`). Each gives the yuho PDF and usually its EDINET doc ID.
- Every figure so far gives ¥153.8 per dollar against revenueUSDb_now, so all earlier dollar values were whole-company totals at one rate.
- Done: JX Advanced Metals, Nippon Sanso, Kanto Denka, Stella Chemifa, Resonac (IFRS, Dec), Nikon, Canon (US GAAP, Dec), Horiba (Dec), Ferrotec, Hoya, AGC (IFRS, Dec), Toppan, DNP.
- Done: Mitsui Chemicals, Lasertec (June year end), Kokusai Electric, SCREEN, Kioxia, Disco, Ajinomoto (IFRS), Ibiden, Shinko.
- Shinko Electric (private): used the FY to March 2025 consolidated tanshin (215,022). Its only later figure is the 第3期 決算公告 (non-consolidated, acquisition vehicle that absorbed old Shinko on 2025-12-01; 売上高 83,575 for Apr 2025–Mar 2026). Flag for the owner.
- Done: Mitsubishi Gas Chemical, Advantest (English ASR), Micronics Japan (Dec), Nidec.
- Nidec: FY to March 2026 yuho filed late (2026-09-30) with an auditor disclaimer of opinion (意見不表明, PwC Japan); prior year restated 2,607,813 → 2,606,347. Recorded the filed continuing-operations 売上高 2,708,705 with a caution note. No later correction found in October 2026 releases.

## Result (all 35 firms)
- 35 of 35 have a filed figure in `qa/round3/revenue-japan.json`, all in JPY millions, all whole-company (`scope: "company"`). No row needed segment scope: every filed figure divided by `revenueUSDb_now` gives about ¥153.8 per dollar, so earlier agents used consolidated totals at one rate.
- 33 come from the annual securities report (有価証券報告書): the Japanese original on EDINET or the company IR site, or the company's English translation (Tokyo Electron, SUMCO, Advantest). Shin-Etsu comes from the audited Financial Section of its Annual Report 2026. Shinko comes from its last consolidated 決算短信 (unaudited).
- Every amount and quote was checked against the PDF page named in `source` (script check: amount present, quote contiguous on that page).
- Standards: J-GAAP for most; IFRS for Sumitomo Chemical, JX Advanced Metals, Nippon Sanso, Resonac, Nikon, Hoya, AGC, Mitsui Chemicals, Kokusai Electric, Kioxia, Ajinomoto, Advantest, Nidec; US GAAP for Fujifilm and Canon.
- Year ends: December for SUMCO, Tokyo Ohka Kogyo, Resonac, Canon, Horiba, AGC, Micronics Japan (FY2025, Jan–Dec 2025); June for Lasertec (FY2026, Jul 2025–Jun 2026); March for the rest (Apr 2025–Mar 2026), except Shinko (Apr 2024–Mar 2025).

## Doubts and questions for the owner
1. **Nidec**: the FY to March 2026 report (filed late, 2026-09-30) carries an auditor disclaimer of opinion (意見不表明, PwC Japan, p. 244). The figure is as filed. The prior year was restated (売上高 2,607,813 → 2,606,347; the site's current dollar value matches the unrestated 2,607,813). The owner may want a footnote.
2. **Shinko Electric**: private since June 2025. Its last consolidated figure is FY to March 2025 (215,022, from the unaudited 決算短信; no securities report followed). Its only later figure is the 第3期 決算公告: non-consolidated, from the acquisition vehicle that absorbed the old Shinko on 2025-12-01 (売上高 83,575 for Apr 2025–Mar 2026). That figure is not comparable, so it was not used.
3. **Fiscal-year labels**: companies label the same April 2025–March 2026 year differently. Tokyo Electron, Kokusai Electric, Fujimi, Nippon Sanso, Stella Chemifa, Ferrotec and SCREEN say FY2026 / 2026年3月期. Shin-Etsu, Fujifilm, Kioxia, Disco, Advantest, Hoya and most others say FY2025 / 2025年度. `fiscalYear` follows each company's own usage, so the display should lean on `fyEnd` ("year to March 2026").
4. Horiba, Sumitomo Chemical, Canon, Ajinomoto, Toppan, DNP and Mitsui Chemicals are large groups where the chip business is a small part. They are kept as whole company because the current site figure is the whole company.
5. Minor: the existing bibliography entry for the SCREEN securities report gives date 2026-06-23, but the report's 提出日 is 2026-06-25.

## New bibliography entries
URL keys without the `#page=` fragment. Lasertec (S100Z32V) and SCREEN (download_file .../2540) are already in `data/bibliography.json`.
```json
{
  "https://www.shinetsu.co.jp/wp-content/uploads/2026/08/Financial-Section.pdf": {
    "title": "Shin-Etsu Chemical, Annual Report 2026, Financial Section (fiscal year ended March 2026)",
    "publisher": "Shin-Etsu Chemical",
    "date": "2026-08",
    "type": "report",
    "accessed": "2026-10-20"
  },
  "https://ssl4.eir-parts.net/doc/3436/ir_material_for_fiscal_ym10/200931/00.pdf": {
    "title": "SUMCO, Annual Securities Report for the fiscal year ended December 31, 2025 (English translation)",
    "publisher": "SUMCO",
    "date": "2026-03-31",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.tokuyama.co.jp/ir/pdf/SR162_full.pdf": {
    "title": "Tokuyama, securities report (有価証券報告書), 162nd fiscal year (year ended March 2026)",
    "publisher": "Tokuyama",
    "date": "2026-06-19",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.tok.co.jp/application/files/9717/7432/8945/securities_2512.pdf": {
    "title": "Tokyo Ohka Kogyo, securities report (有価証券報告書), 96th fiscal year (year ended December 2025)",
    "publisher": "Tokyo Ohka Kogyo",
    "date": "2026-03-24",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIBH.pdf": {
    "title": "FUJIFILM Holdings, securities report (有価証券報告書), 130th fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-24",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.sumitomo-chem.co.jp/ir/library/security_report/files/docs/25_4q.pdf": {
    "title": "Sumitomo Chemical, securities report (有価証券報告書), 145th fiscal year (year ended March 2026)",
    "publisher": "Sumitomo Chemical",
    "date": "2026-06-22",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.adeka.co.jp/ir/library/pdf/yuhou_164-4.pdf": {
    "title": "ADEKA, securities report (有価証券報告書), 164th fiscal year (year ended March 2026)",
    "publisher": "ADEKA",
    "date": "2026-06-15",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.ircms.jp/irexport/fujimiinc/file/a83519987178237.pdf": {
    "title": "Fujimi Incorporated, securities report (有価証券報告書), 74th fiscal year (year ended March 2026)",
    "publisher": "Fujimi Incorporated",
    "date": "2026-06-19",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YINW.pdf": {
    "title": "JX Advanced Metals, securities report (有価証券報告書), 24th fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-24",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://jp.nipponsanso.com/LinkClick.aspx?fileticket=aagGVd5LE%2bM%3d": {
    "title": "Nippon Sanso Holdings, securities report (有価証券報告書), 22nd fiscal year (year ended March 2026)",
    "publisher": "Nippon Sanso Holdings",
    "date": "2026-06-15",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJCK.pdf": {
    "title": "Kanto Denka Kogyo, securities report (有価証券報告書), 119th fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-25",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.stella-chemifa.co.jp/ir/securities/files/yhq4_2026.pdf": {
    "title": "Stella Chemifa, securities report (有価証券報告書), 83rd fiscal year (year ended March 2026)",
    "publisher": "Stella Chemifa",
    "date": "2026-06-18",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.resonac.com/sites/default/files/2026-03/%E6%9C%89%E4%BE%A1%E8%A8%BC%E5%88%B8%E5%A0%B1%E5%91%8A%E6%9B%B8_20260325.pdf": {
    "title": "Resonac Holdings, securities report (有価証券報告書), 117th fiscal year (year ended December 2025)",
    "publisher": "Resonac Holdings",
    "date": "2026-03-25",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.jp.nikon.com/content/dam/web-assets/nikoncom/company/local/jp/ja/ir/ir_library/sr/pdf/26fr_j.pdf": {
    "title": "Nikon, securities report (有価証券報告書), 162nd fiscal year (year ended March 2026)",
    "publisher": "Nikon",
    "date": "2026-06-25",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://global.canon/ja/ir/yuuhou/canon2025.pdf": {
    "title": "Canon, securities report (有価証券報告書), 125th fiscal year (year ended December 2025)",
    "publisher": "Canon",
    "date": "2026-03-25",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://static.horiba.com/fileadmin/Horiba/Company/Investor_Relations/IR_Library/Asset_Securities_Reports/20260323_SY_jp_01_Xw7.pdf": {
    "title": "HORIBA, securities report (有価証券報告書), 88th fiscal year (year ended December 2025)",
    "publisher": "HORIBA",
    "date": "2026-03-23",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://ircms.irstreet.com/contents/data_file.php?template=2158&brand=85&data=491586&filename=pdf_file.pdf": {
    "title": "Ferrotec, securities report (有価証券報告書), 46th fiscal year (year ended March 2026)",
    "publisher": "Ferrotec",
    "date": "2026-06-25",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y90T.pdf": {
    "title": "HOYA, securities report (有価証券報告書), 88th fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-05",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSTU.pdf": {
    "title": "AGC, securities report (有価証券報告書), 101st fiscal year (year ended December 2025)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-03-24",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIAY.pdf": {
    "title": "TOPPAN Holdings, securities report (有価証券報告書), 180th fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-24",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF74.pdf": {
    "title": "Dai Nippon Printing, securities report (有価証券報告書), 132nd fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-23",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://jp.mitsuichemicals.com/content/dam/mitsuichemicals/sites/mci/documents/release/2026/ms_260622.pdf": {
    "title": "Mitsui Chemicals, securities report (有価証券報告書), 29th fiscal year (year ended March 2026)",
    "publisher": "Mitsui Chemicals",
    "date": "2026-06-22",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJUA.pdf": {
    "title": "KOKUSAI ELECTRIC, securities report (有価証券報告書), 11th fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-25",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ18.pdf": {
    "title": "KIOXIA Holdings, securities report (有価証券報告書), 8th fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-24",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.disco.co.jp/jp/ir/library/doc/fs/fs87.pdf": {
    "title": "DISCO, securities report (有価証券報告書), 87th fiscal year (year ended March 2026)",
    "publisher": "DISCO",
    "date": "2026-06-16",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.ajinomoto.co.jp/company/jp/ir/library/securities/main/06/teaserItems1/0/linkList/03/link/FY25Q4_annual%20Securities%20Report_J.pdf": {
    "title": "Ajinomoto, securities report (有価証券報告書), 148th fiscal year (year ended March 2026)",
    "publisher": "Ajinomoto",
    "date": "2026-06-12",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC4B.pdf": {
    "title": "Ibiden, securities report (有価証券報告書), 173rd fiscal year (year ended March 2026)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-06-18",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.shinko.co.jp/ir/docs/bn2025.pdf": {
    "title": "Shinko Electric Industries, consolidated financial results for the fiscal year ended March 2025 (2025年3月期 決算短信)",
    "publisher": "Shinko Electric Industries",
    "date": "2025-04-24",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.mgc.co.jp/ir/files/2026_4.pdf": {
    "title": "Mitsubishi Gas Chemical, securities report (有価証券報告書), 99th fiscal year (year ended March 2026)",
    "publisher": "Mitsubishi Gas Chemical",
    "date": "2026-06-22",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.advantest.com/document/en/investors/ir-library/report/IR_SecuritiesandBusinessReport_84th_en.pdf": {
    "title": "Advantest, Annual Securities Report and Business Report, 84th term (FY2025, year ended March 2026), English translation",
    "publisher": "Advantest",
    "date": "2026-06-26",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTD8.pdf": {
    "title": "Micronics Japan, securities report (有価証券報告書), 55th fiscal year (year ended December 2025)",
    "publisher": "Financial Services Agency (EDINET)",
    "date": "2026-03-25",
    "type": "filing",
    "accessed": "2026-10-20"
  },
  "https://www.nidec.com/files/user/www-nidec-com/ir/library/reports/FY25Q4_jp.pdf": {
    "title": "Nidec, securities report (有価証券報告書), 53rd fiscal year (year ended March 2026)",
    "publisher": "Nidec",
    "date": "2026-09-30",
    "type": "filing",
    "accessed": "2026-10-20"
  }
}
```
