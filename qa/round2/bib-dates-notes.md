# bib-dates notes (round two, 20 October 2026)

Task: give a `date` to every undated entry in `data/bibliography.json` whose source shows its own date.
Start: 870 entries, 532 dated, 338 undated (page 280, press release 26, dataset 9, regulation 8, article 7, report 5, pdf 3).
Fetches: curl with User-Agent `Mozilla/5.0 (research; chipsupplychain.org)`; downloads under `qa/round2/scratch/bib-dates/`.

## Result

All three steps done; 62 entries dated (edited in place with the Edit tool, `date` inserted between `publisher` and `type`).
End state: 870 entries, 594 dated, 276 undated. No title, publisher or URL changed.

| Type | Undated before | Dated now | Still undated |
|---|---|---|---|
| press release | 26 | 26 | 0 |
| regulation | 8 | 8 | 0 |
| article | 7 | 4 | 3 |
| report | 5 | 2 | 3 |
| pdf | 3 | 3 | 0 |
| dataset | 9 | 0 | 9 |
| page | 280 | 19 | 261 |
| **total** | **338** | **62** | **276** |

Rules applied: a press release, post or article takes the date printed on it (dateline or date line). A report takes its stated publication date. A PDF takes a printed date, otherwise its metadata CreationDate. A regulation section takes the date of its latest change shown on the page (the section's source note, or the eCFR Timeline panel when the source note only gives the 1996 original). "Last updated" stamps on living pages, "current as of" lines, report names ("Integrated Report 2026") and archive capture dates do not count.

Sources the generic User-Agent could not open (bot challenge, not a dead link), and where the date was read instead:
- semi.org, 6 press releases: Cloudflare challenge. Read on the PR Newswire copy of each release (prnewswire.com, Tier A in data/source-tiers.json), same text and dateline.
- echa.europa.eu: Azure WAF 403. Read on the European Commission's EU Chemicals Platform copy (transition-pathways.europa.eu), which reproduces the release with its dateline "Helsinki, 20 August 2025".
- congress.gov: Cloudflare challenge. The only text version, confirmed on govinfo.gov (BILLSTATUS-119s1705.xml lists one version, "Introduced in Senate", 2025-05-08; the bill text reads "IN THE SENATE OF THE UNITED STATES May 8, 2025").
- iea.org: Cloudflare challenge to curl and WebFetch. Read in the copy an earlier agent saved on 2 October 2026 (qa/bib-cache/2442058f99211334249244cfa7e4b93a6335b280.html).
- investor.tsmc.com: Cloudflare challenge to curl; read through WebFetch.

## Changes (URL, date, where found)

| Type | URL | Date | Where on the page |
|---|---|---|---|
| press release | https://echa.europa.eu/-/echa-publishes-updated-pfas-restriction-proposal | 2025-08-20 | Release dateline "Helsinki, 20 August 2025"; echa.europa.eu returns 403 (Azure WAF), so read on the European Commission EU Chemicals Platform copy of the release |
| press release | https://english.mofcom.gov.cn/News/SpokesmansRemarks/art/2025/art_ae8ca3f16ddb475cb3a9b51a025887c9.html | 2025-10-15 | Date line under the title (page timestamp 1760496732465 = 15 October 2025, 10:52 BJT); meta PubDate says 2025-10-16 |
| press release | https://global.canon/en/news/2023/20231013.html | 2023-10-13 | "News Release October 13, 2023" above the headline |
| press release | https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit | 2026-08-03 | Byline "August 3, 2026 / Austin, Texas / Press Release" |
| press release | https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-tomahawkr-6-davisson-industrys-first-1024 | 2025-10-08 | Dateline "PALO ALTO, Calif., Oct. 08, 2025 (GLOBE NEWSWIRE)" |
| press release | https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-4-industrys-highest-bandwidth-ethernet | 2019-12-09 | Dateline "SAN JOSE, Calif., Dec. 09, 2019 (GLOBE NEWSWIRE)" |
| press release | https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-5-industrys-highest-bandwidth-switch | 2022-08-16 | Dateline "SAN JOSE, Calif., Aug. 16, 2022 (GLOBE NEWSWIRE)" |
| press release | https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-6-worlds-first-1024-tbps-switch | 2025-06-03 | Dateline "PALO ALTO, Calif., June 03, 2025 (GLOBE NEWSWIRE)" |
| press release | https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10 | 2025-10-13 | Dateline "SAN FRANCISCO and PALO ALTO, Calif., Oct. 13, 2025 (GLOBE NEWSWIRE)" |
| press release | https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced | 2025-10-06 | Dateline "TEMPE, Ariz.--(BUSINESS WIRE)--Oct. 6, 2025" |
| press release | https://ir.amkor.com/news-releases/news-release-details/tsmc-and-amkor-technology-announce-long-term-partnership | 2026-06-16 | Dateline "HSINCHU, Taiwan & TEMPE, Ariz.--(BUSINESS WIRE)--Jun. 16, 2026" |
| press release | https://newsroom.lamresearch.com/etch-essentials-semiconductor-manufacturing | 2024-06-12 | Byline "Lam Blog Staff Jun 12, 2024" |
| press release | https://nvidianews.nvidia.com/news/nvidia-nvlink-fusion-semi-custom-ai-infrastructure-partner-ecosystem | 2025-05-18 | Date line "May 18, 2025" before "COMPUTEX" |
| press release | https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer | 2026-01-05 | Date line "January 5, 2026" under the subhead |
| press release | https://www.intel.com/content/www/us/en/newsroom/news/artificial-intelligence/intel-to-expand-ai-accelerator-portfolio-with-new-gpu.html | 2025-10-14 | Date under the subhead "October 14,2025" (meta newsroom_date 2025-10-14) |
| press release | https://www.intel.com/content/www/us/en/newsroom/news/intel-opens-fab-9-new-mexico.html | 2024-01-24 | "News January 24, 2024" under the headline |
| press release | https://www.lasertec.co.jp/en/news/2025/20251031_3912.html | 2025-10-31 | Date "2025.10.31" under the headline |
| press release | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393 | 2025-07-25 | "Posted On: 25 JUL 2025 4:34PM by PIB Delhi" |
| press release | https://www.semi.org/en/semi-press-release/eighteen-new-semiconductor-fabs-to-start-construction-in-2025-semi-reports | 2025-01-07 | Dateline "MILPITAS, Calif., Jan. 7, 2025"; semi.org returns a Cloudflare challenge, so read on the PR Newswire copy (prnewswire.com ...-302343486) |
| press release | https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.1-billion-dollars-in-revenue-in-q1-2025 | 2025-07-15 | Dateline "MILPITAS, Calif., July 15, 2025"; read on the PR Newswire copy (...-302502842), semi.org blocked |
| press release | https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.1-billion-dollars-in-revenue-in-q2-2025 | 2025-10-06 | Dateline "MILPITAS, Calif., Oct. 6, 2025"; read on the PR Newswire copy (...-302575024), semi.org blocked |
| press release | https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.5-billion-dollars-in-revenue-in-q4-2025 | 2026-04-13 | Dateline "MILPITAS, Calif., April 13, 2026"; read on the PR Newswire copy (...-302737536), semi.org blocked |
| press release | https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.6-billion-dollars-in-revenue-in-q3-2025 | 2026-01-12 | Dateline "MILPITAS, Calif., Jan. 12, 2026"; read on the PR Newswire copy (...-302655485), semi.org blocked |
| press release | https://www.semi.org/en/semi-press-release/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results | 2026-02-10 | Dateline "MILPITAS, Calif., Feb. 10, 2026"; read on the PR Newswire copy (...-302683028), semi.org blocked |
| press release | https://www.smics.com/en/site/news_read/7951 | 2026-03-26 | Date "2026-03-26" under the headline; signed "Shanghai, China March 26, 2026" |
| press release | https://www.usgs.gov/news/national-news-release/usgs-critical-minerals-study-bans-gallium-and-germanium-exports-could | 2024-11-19 | Byline "By Office of Communications November 19, 2024" |
| regulation | https://www.bis.gov/ear/title-15/subtitle-b/chapter-vii/subchapter-c/part-744/ss-74423-supercomputer-advanced-node | 2026-01-15 | Latest amendment in the section's source note "... 90 FR 4562, Jan. 15, 2025; 91 FR 1687, Jan. 15, 2026]" (eCFR text embedded in the BIS page) |
| regulation | https://www.congress.gov/bill/119th-congress/senate-bill/1705/text | 2025-05-08 | Only text version "Introduced in Senate", dated May 8, 2025; congress.gov returns a Cloudflare challenge, so confirmed on govinfo (BILLSTATUS-119s1705.xml and the bill text "IN THE SENATE OF THE UNITED STATES May 8, 2025") |
| regulation | https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.13 | 2016-06-03 | Section source note "[81 FR 35603, June 3, 2016]"; Timeline panel: no changes since the record starts (1/03/2017) |
| regulation | https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.4 | 2025-01-16 | Timeline panel, latest change 1/16/2025 (the source note gives only the 1996 original and points to the LSA) |
| regulation | https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.9 | 2025-11-12 | Timeline panel, latest change 11/12/2025; Effective Date Note "At 90 FR 50857, Nov. 12, 2025 ... stayed" (last text amendment in the source note: 90 FR 47211, Sept. 30, 2025) |
| regulation | https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-738/appendix-Supplement%20No.%201%20to%20Part%20738 | 2025-09-30 | Source note "[90 FR 47189, Sept. 30, 2025]"; Timeline panel latest change 9/30/2025 |
| regulation | https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25 | 2024-12-05 | Source note "[89 FR 96814, Dec. 5, 2024]"; Timeline panel 12/05/2024 (only entry) |
| regulation | https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6 | 2026-07-23 | Timeline panel, latest change 7/23/2026 (the source note gives only the 1996 original and points to the LSA) |
| article | https://ualinkconsortium.org/blog/ualink-200g-1-0-specification-overview-802/ | 2025-05-15 | Post date "May 15, 2025" under the title |
| article | https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html | 2024-12-13 | Date "Dec.13 2024" above the headline |
| article | https://www.cerebras.ai/blog/introducing-cerebras-cs-4 | 2026-08-18 | Post date "Aug 18 2026" above the headline |
| article | https://www.cerebras.ai/blog/ultrafast-frontier-inference-cerebras-deep-dive-at-hot-chips-2026 | 2026-08-25 | Post date "Aug 25 2026" above the headline |
| report | https://files.gao.gov/reports/GAO-26-107882/index.html | 2025-12-11 | "Published: Dec 11, 2025. Publicly Released: Dec 11, 2025."; letter dated December 11, 2025 |
| report | https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary | 2025 | "Cite report" box: "IEA (2025), Building the Future Transmission Grid"; iea.org returns a Cloudflare challenge, so read in the 2 October 2026 copy in qa/bib-cache |
| pdf | https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf | 2026-04-16 | PDF metadata CreationDate 2026-04-16 17:20 +08:00 (no printed date); curl blocked, read through WebFetch |
| pdf | https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-3-white-paper.pdf | 2025-04-07 | PDF metadata CreationDate 2025-04-07; last page "©2025 Advanced Micro Devices" (this is the 2025 revision with MI325X notes) |
| pdf | https://www.intel.com/content/dam/www/central-libraries/us/en/documents/2025-11/foveros-direct-3d-tech-brief.pdf | 2026-02-06 | PDF metadata CreationDate 2026-02-06 (ModDate 2026-03-06; URL folder 2025-11; no printed date) |
| page | https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/ | 2025-12-02 | "Posted on: Dec 2, 2025" under the headline |
| page | https://digital-strategy.ec.europa.eu/en/library/proposal-chips-act-20 | 2026-06-03 | "Publication 03 June 2026" under the title |
| page | https://english.mofcom.gov.cn/Policies/AnnouncementsOrders/art/2025/art_0dd87cbee7b045bf93fabe6ab2faceee.html | 2025-04-04 | "[Date of Issuance] April 4, 2025" at the top; signed April 4, 2025 (English page posted 2025-06-17 per meta PubDate) |
| page | https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm | 2024-05-28 | Date "2024.05.28" under the headline |
| page | https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/ | 2026-01-05 | Post date "January 5, 2026" under the title |
| page | https://news.skhynix.com/en/q2-2026-business-results/ | 2026-07-29 | Post date "July 29, 2026"; dateline "Seoul, July 29, 2026" |
| page | https://news.skhynix.com/en/sk-hynix-announces-fy25-financial-results/ | 2026-01-28 | Post date "January 28, 2026"; dateline "Seoul, January 28, 2026" |
| page | https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/ | 2025-09-12 | Post date "September 12, 2025"; dateline "Seoul, September 12, 2025" |
| page | https://news.skhynix.com/en/tech-note-series-ep2/ | 2026-08-25 | Post date "August 25, 2026" under the title |
| page | https://news.skhynix.com/sk-hynix-partners-with-tsmc-to-strengthen-hbm-technological-leadership/ | 2024-04-19 | Post date "April 19, 2024"; dateline "Seoul, April 19, 2024" |
| page | https://news.skhynix.com/sk-hynix-to-supply-industrys-first-hbm3-dram-to-nvidia/ | 2022-06-08 | Post date "June 8, 2022" under the title |
| page | https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production | 2022-03-14 | "Blog Post by Gabrielle Athanasia and Gregory Arcuri Published March 14, 2022" |
| page | https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography | 2025-09-24 | "Blog Post by Jacob Wentz and Anita Lin Published September 24, 2025" |
| page | https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap | 2022-06-16 | "Published on : 16 June 2022" at the end of the article |
| page | https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing | 2024-10-31 | "Published on : 31 October 2024" at the end of the article |
| page | https://www.lasertec.co.jp/en/ir/plan/message.html | 2026-09 | "September 2026" right under the "Business Report" heading (the site cites its FY to June 2026 figures, so this is the version cited) |
| page | https://www.mofcom.gov.cn/zcfb/dwmygl/art/2023/art_52b9a321087f402bb3d310d18b07967e.html | 2023-07-03 | "【发文日期】2023年07月03日" (date line "2023-07-03 18:00") |
| page | https://www.mofcom.gov.cn/zwgk/zcfb/art/2024/art_3d5e990b43424e60828030f58a547b60.html | 2024-12-03 | "【发文日期】2024年12月03日"; signed "商务部 2024年12月3日" |
| page | https://www.mofcom.gov.cn/zwgk/zcfb/art/2025/art_5c68985a6b1a46778e2e8dbff1bb1601.html | 2025-11-09 | "【发文日期】2025年11月09日" (date line "2025-11-09 11:00"; meta PubDate 2025-11-10) |

## Left undated (and why)

Non-page entries (15):
- 9 datasets: the 7 data.sec.gov XBRL company-concept JSON files carry only per-fact `filed` dates, and the 2 ETO Chip Explorer CSVs (raw.githubusercontent.com) carry none. No release date stated.
- 3 InferenceX chip pages (b200, mi300x, mi355x): live benchmark and pricing pages ("continuously refreshed"), no date shown.
- TSMC 2022 Annual Report, page 97 (ebook page): shows only the report name. "2022" is the fiscal year.
- TSMC 2025 Annual Report site (index.html): "Copyright © 2025" and tables "As of 02/28/2026", no publication date.
- HOYA Integrated Report 2026, IT review page: the report name only, no publication date. (The 2025 page, typed "page", is the same case.)

Page entries (261): company home pages, product, technology and solution pages, documentation, IR landing pages, data tools (19 chipexplorer.eto.tech views, hts.usitc.gov) and two web.archive.org captures. None shows its own publication date. Borderline cases left undated on purpose:
- digital-strategy.ec.europa.eu GPAI Q&A: only "Last update 9 September 2025", no publication date.
- epoch.ai Colossus 1 ("Updated Jun. 16, 2026") and Machine Learning Hardware ("Updated Oct. 19, 2026"): living data pages.
- Google Cloud TPU docs ("Last updated 2026-10-13/19 UTC"), NVIDIA NVL72 docs ("Last updated on Sep 15, 2026"), AWS Neuron Trainium3 doc (meta date-modified 12/02/2025): living documentation.
- web.archive.org captures of nsig.com (20250809) and dongjin.com (20260911): the capture date is not the page's own date.

## Broken URLs

No URL returned 404 or 410. Every non-200 response was a bot block:

| URL | curl (generic UA) | WebFetch | Verdict |
|---|---|---|---|
| 6 semi.org press releases + https://www.semi.org/en/products-services/market-data/world-fab-forecast | 403 Cloudflare | 403 | blocked; releases confirmed on PR Newswire |
| https://echa.europa.eu/-/echa-publishes-updated-pfas-restriction-proposal | 403 Azure WAF | 403 | blocked; release text confirmed on EU Chemicals Platform |
| https://www.congress.gov/bill/119th-congress/senate-bill/1705/text | 403 Cloudflare | 403 | blocked; bill confirmed on govinfo |
| https://www.iea.org/reports/building-the-future-transmission-grid/executive-summary | 403 Cloudflare | 403 | blocked; 2 Oct copy in qa/bib-cache |
| 3 investor.tsmc.com URLs, 5 www.tsmc.com pages | 403 Cloudflare | loads | live |
| https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm | 403 Cloudflare | 403 | not verified |
| https://www.umc.com/en/Product/technologies/Overview | 403 Cloudflare | 403 | not verified |
| https://www.asetek.com/ | 403 Cloudflare | 403 | not verified |
| https://www.skyverse.cn/ | 418 ("访问被拦截") | 418 | not verified |
| https://www.monolithicpower.com/en/applications/enterprise-computing.html | 200 "Client Challenge" | challenge | not verified |
| https://www.semitronix.com/ | TLS error (incomplete certificate chain) | "unable to verify the first certificate" | not verified; may fail in some clients |
| https://www.unimicron.com/ | TLS error | loads | live |
| https://ayarlabs.com/ | 403 | loads | live |
| https://www.arista.com/en/solutions/ai-networking | 406 | loads | live |
| https://www.hanmisemi.com/en/product/index.html | 403 | loads | live |

Moved but still working (redirects; the URL could be updated later): awsdocs-neuron .../general/arch/neuron-hardware/{trainium2,trainium3,trn2-arch}.html → .../about-neuron/arch/...; docs.nvidia.com NeMo parallelisms → Megatron Bridge docs; groq.com/inference → /platform; sambanova.ai/technology/sn40l-rdu-ai-chip → /products/rdu-ai-chips; cerebras.ai/product-chip → /chip; two news.skhynix.com links → /en/ paths; trumpf.com EUV drive laser product → solutions page; awavesemi.com → qualcomm.com/data-center (the entry already says so); plus locale redirects on many home pages.

Content drift worth a look:
- https://www.qct.io/solution/index/AI-Solutions now serves a generic solutions list titled "Hyper-Converged Solutions"; no AI-solutions content. The entry is titled "Quanta Cloud Technology, AI solutions page", and data/suppliers.json uses it as Quanta's source.
- https://www.acmrcsh.com/ is now a gateway page (title ends "| Redirect") linking to acmr.com and acmrcsh.com.cn.

## Title or publisher fixes

None made; none was clearly wrong. Checked: page `<title>`, `og:title` and `<h1>` against every entry opened. Notes:
- hiascend.com `?tag=` pages (Atlas 800T A2, Atlas 900 A3 SuperPoD, Ascend 950DT) render the default product's title server-side, but the site's own navigation labels those exact URLs with the entry titles, so the titles stand.
- TSMC 2025 Annual Report chapter 5 PDF carries `"unverified": true`. Opened it: pp. 99 to 125, "5.1 Business Activities" onward, "During 2025 and as of the date of this Annual Report". The title is right; the owner may drop the flag (outside this task's fields).

## Check outputs

- `python3 -m json.tool data/bibliography.json > /dev/null`: OK. Re-serializing with indent 2 reproduces the file byte for byte (trailing newline kept). Key order `title, publisher, date, type, accessed` on all 594 dated entries.
- `node build/build.js > /dev/null`: exit 0. Warnings only from other agents' card work ("the card has no source fields", 14 chapter PDFs not built yet).
- `node qa/scripts/check-speak.js`: "check-speak: no matches".
- `node qa/scripts/check-integrity.js`: exit 0. Known "exposure row ... has no supplier entry" warnings, plus card warnings from other agents ("no source fields yet", "a figure with no year"). Nothing about the bibliography.
- `node qa/scripts/check-sources.js`: "2290 citations, all tier A or B".
- Built pages show the new dates, for example "SEMI · 7 January 2025", "Lasertec · September 2026", "International Energy Agency · 2025".

## Follow-up for the owner

`build/harvest-bibliography.js` rebuilds bibliography.json from its cache plus its MANUAL table. 28 of the 62 newly dated URLs are in MANUAL without a date, and the others are not in it at all. A re-run would drop these dates unless they are added to MANUAL. That file is outside this task, so it was not edited.
