# Bibliography pass, 10 September 2026

147 of the 702 entries carried a title a reader could not use. A script over `data/bibliography.json` flagged titles that were empty or very short, began with "Home", "PowerPoint Presentation" or "Microsoft Word -", read as a file name, sat only in Chinese, Japanese or Korean, gave only the site name, or ran all lower case. A second sweep caught bot walls the pattern list missed: three eCFR sections returned "Federal Register :: Request Access", and four pages returned site navigation.

Each replacement was read off the document: cover page, first slide, or headline and dateline. Where the harvester was refused I pulled the file with curl. Filings take the form "Company, document type, period"; notices "Body, instrument"; home pages "Company, company website"; product pages "Company, product product page"; decks "Company, deck name, date". Non-English titles are in English with the original in parentheses.

Forty-two entries gained a date the document states. Fourteen home pages lost one: the fetcher had read a page-modification timestamp as publication, putting Cohu in 2015 and TOPPAN on yesterday. Dated entries rose from 380 to 402.

Both scripts finish clean, no warnings. Rerunning the detector reports 0 bad titles across 702 entries. Two entries stay unverified, both your own hand-written titles.

## For the author

- `dongjin.com` fails its TLS handshake; the host is unreachable.
- `ansys.com/products/semiconductors` now redirects to `ansys.synopsys.com`.
- `awavesemi.com` redirects to `qualcomm.com`. The Alphawave page is gone.
- Same document, new host: toppan.com, nipponsanso-hd.co.jp, pfeiffer-vacuum.com, corp.mediatek.com.
- `bis.gov/news-updates` and `sandisk.com/company/newsroom` cite an index, not a document.
- Fourteen entries stay undated: the eCFR sections and three Broadcom releases state no date; Broadcom IR, Amkor IR, SMIC, congress.gov and english.mofcom.gov.cn refuse scripted requests.

## Entries retitled

| URL | Old title | New title |
| --- | --- | --- |
| http://exportcontrol.mofcom.gov.cn/article/zcfg/gnzcfg/zcfggzqd/202307/847.html | 中国出口管制信息网 | MOFCOM and General Administration of Customs announcement, export controls on gallium- and germanium-related items (对镓、锗相关物项实施出口管制) |
| https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm | Cowos (TSMC website) | TSMC, CoWoS technology page |
| https://ai.meta.com/blog/next-generation-meta-training-inference-accelerator-AI-MTIA/ | Next generation meta training inference accelerator AI MTIA (Meta website) | Our next generation Meta Training and Inference Accelerator |
| https://dart.fss.or.kr/report/viewer.do?rcpNo=20220322000590&dcmNo=8490476&eleId=20&offset=345759&length=564559&dtd=dart3.xsd | Viewer.do | SK hynix, notes to the consolidated financial statements (연결재무제표 주석), 74th fiscal year, 2021 |
| https://dart.fss.or.kr/report/viewer.do?rcpNo=20230321001209&dcmNo=9083795&eleId=20&offset=336980&length=497577&dtd=dart3.xsd | Viewer.do | SK hynix, notes to the consolidated financial statements (연결재무제표 주석), 75th fiscal year, 2022 |
| https://dart.fss.or.kr/report/viewer.do?rcpNo=20240319000684&dcmNo=9731387&eleId=49&offset=1689059&length=20688&dtd=dart4.xsd | Viewer.do | SK hynix, revenue note to the consolidated financial statements (매출액), fiscal year 2023 |
| https://dart.fss.or.kr/report/viewer.do?rcpNo=20250319000665&dcmNo=10428620&eleId=48&offset=1773970&length=22955&dtd=dart4.xsd | Viewer.do | SK hynix, revenue note to the consolidated financial statements (매출액), fiscal year 2024 |
| https://dart.fss.or.kr/report/viewer.do?rcpNo=20260317000635&dcmNo=11132576&eleId=48&offset=2673284&length=29807&dtd=dart4.xsd | Viewer.do | SK hynix, revenue note to the consolidated financial statements (매출액), fiscal year 2025 |
| https://disc.static.szse.cn/disc/disk03/finalpage/2026-03-31/a0209878-88e7-443c-b062-6a33047d9c98.PDF | 天水华天科技股份有限公司2025 年年度报告全文 | Tianshui Huatian Technology, 2025 annual report (2025年年度报告) |
| https://echa.europa.eu/-/echa-supports-pfas-restriction-with-targeted-derogations | Echa supports pfas restriction with targeted derogations (European Chemicals Agency website) | ECHA supports PFAS restriction with targeted derogations |
| https://exportcontrol.mofcom.gov.cn/article/zcfg/gnzcfg/flfg/202111/226.html | 中国出口管制信息网 | Export Control Law of the People's Republic of China (中华人民共和国出口管制法) |
| https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2021_con_quarter04_all.pdf | Microsoft Word - SEC_20214Q_Consolidated_Review Report_v1.docx | Samsung Electronics, consolidated financial statements, fourth quarter 2021 |
| https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2025_con_quarter04_all.pdf | Microsoft Word - SEC_20254Q_Consolidated_F | Samsung Electronics, consolidated financial statements, fourth quarter 2025 |
| https://jp.mitsuichemicals.com/ | 三井化学株式会社 | Mitsui Chemicals, company website (三井化学株式会社) |
| https://m.samsungsem.com/global/newsroom/news/view.do?id=10462 | Samsung Electro-Mechanics, Q2 2026 Business Results \| News \| Newsroom | Samsung Electro-Mechanics, Q2 2026 business results |
| https://rebellions.ai/ | Rebellions | Rebellions, company website |
| https://samsungsem.com/global/newsroom/news/view.do?id=9850 | Samsung Electro-Mechanics Signs MOU with Sumitomo Chemical Group to Establish a Joint Venture for ‘Glass Core’ Used in Package Substrates \| News \| Newsroom | Samsung Electro-Mechanics Signs MOU with Sumitomo Chemical Group to Establish a Joint Venture for Glass Core Used in Package Substrates |
| https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf | Microsoft Word - FY 25_PR_9 bis | Technoprobe, press release: the Board of Directors approves the draft statutory and consolidated annual report as at 31 December 2025 |
| https://tenstorrent.com/ | Tenstorrent | Tenstorrent, company website |
| https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf | Microsoft Word - f33-book-dep-comp-20201010.docx | Behrooz Parhami, Dependable Computing: A Multilevel Approach, part 2 |
| https://www.adeka.co.jp/ | 株式会社ＡＤＥＫＡ（アデカ） | ADEKA, company website (株式会社ADEKA) |
| https://www.advancedenergy.com/ | Home \| Advanced Energy | Advanced Energy Industries, company website |
| https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf | JE BIZ 260427 note (Advantest website) | Advantest, presentation notes for the FY2025 (year ended 31 March 2026) results briefing, 27 April 2026 |
| https://www.aehr.com/products/ | Solutions | Aehr Test Systems, products page |
| https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html | The Japanese glass behind next-generation chips ｜ AGC | The Japanese glass behind next-generation chips |
| https://www.agc.com/en/news/detail/1201109_2814.html | AGC to Make Drastic Expansion to Supply System for EUVL Mask Blanks ｜ News ｜ AGC | AGC to Make Drastic Expansion to Supply System for EUVL Mask Blanks |
| https://www.agc.com/en/news/detail/1203819_2814.html | AGC to Boost Production Capacity of EUVL Photomask Blanks ｜ News ｜ AGC | AGC to Boost Production Capacity of EUVL Photomask Blanks |
| https://www.airliquide.com/ | Air Liquide | Air Liquide, company website |
| https://www.airproducts.com/industries/electronics | Electronics (Air Products website) | Air Products, electronics industry page |
| https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/011117/teaserItems1/01/linkList/03/link/20260630_presentation_E.pdf | Microsoft PowerPoint - 20260630_presentation_E.pptx | Ajinomoto, Growth Strategy for the Electronic Materials Business, 30 June 2026 |
| https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf | Microsoft PowerPoint - 3_ICT_E | Ajinomoto, Business Briefing: ABF-Based Growth Strategy in ICT, 12 June 2023 |
| https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-3-white-paper.pdf | Amd cdna 3 white paper (AMD website) | AMD CDNA 3 Architecture: The All-New AMD GPU Architecture for the Modern Era of HPC and AI |
| https://www.amec-inc.com/news/708.html | 中微公司成功举办2025年度业绩说明会-新闻活动-中微公司 | AMEC holds its 2025 annual results briefing (中微公司成功举办2025年度业绩说明会) |
| https://www.amphenol.com/markets/it-datacom | IT Datacom | Amphenol, IT and datacom market page |
| https://www.ansys.com/products/semiconductors | Semiconductors (Ansys website) | Ansys, semiconductor products page |
| https://www.appliedmaterials.com/eu/en/product-library/kinex-integrated-die-to-wafer-hybrid-bonding-system.html | Kinex | Applied Materials, Kinex integrated die-to-wafer hybrid bonding system product page |
| https://www.asetek.com/ | Asetek home page | Asetek, company website |
| https://www.asm.com/ | Home \| ASM | ASM International, company website |
| https://www.birentech.com/ | 壁仞科技 智绘全球 \| BIRENTECH | Biren Technology, company website (壁仞科技) |
| https://www.bis.gov/news-updates | News and Updates \| Bureau of Industry and Security | U.S. Bureau of Industry and Security, news and updates |
| https://www.cac.gov.cn/2023-05/21/c_1686348043518073.htm | 美光公司在华销售的产品未通过网络安全审查_中央网络安全和信息化委员会办公室 | Cyberspace Administration of China, notice on the cybersecurity review of Micron products (美光公司在华销售的产品未通过网络安全审查), 21 May 2023 |
| https://www.cambricon.com/ | 寒武纪 | Cambricon Technologies, company website (寒武纪) |
| https://www.camtek.com/products/ | Products (Camtek website) | Camtek, products page |
| https://www.chipbond.com.tw/en/ | Home Page - Chipbond | Chipbond Technology, company website |
| https://www.cohu.com/ | Home \| Cohu | Cohu, company website |
| https://www.comet.tech/ | Home page - Comet | Comet Group, company website |
| https://www.disco.co.jp/eg/news/corp/20251215_1.html | 2025 \| News \| DISCO CORPORATION | DISCO develops the DFD6080 fully automatic dicing saw for work sizes up to 400 mm square (最大400mm角のパッケージ切断に対応したダイシングソー「DFD6080」を開発) |
| https://www.dongjin.com/en/business/semiconductor.php | Semiconductor (Dongjin Semichem website) | Dongjin Semichem, semiconductor materials page |
| https://www.dupont.com/ | DuPont | DuPont, company website |
| https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.4 | Federal Register :: Request Access | 15 CFR 734.4, De minimis U.S. content |
| https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.9 | Federal Register :: Request Access | 15 CFR 734.9, Foreign-Direct Product (FDP) Rules |
| https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6 | Federal Register :: Request Access | 15 CFR 742.6, Regional stability |
| https://www.edwardsvacuum.com/ | Edwards | Edwards Vacuum, company website |
| https://www.empyrean.com.cn/ | 华大九天 \| EDA及相关服务 | Empyrean Technology, company website (华大九天) |
| https://www.eoptolink.com/about-us/contacts | Contacts | Eoptolink Technology, contacts page |
| https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf | PowerPoint Presentation | Electric Reliability Council of Texas, Large Load Interconnection Status Update, 13 March 2026 |
| https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf | PowerPoint Presentation | Electric Reliability Council of Texas, ERCOT update to the Senate Committee on Business and Commerce, 29 July 2026 |
| https://www.etched.com/ | Etched | Etched, company website |
| https://www.evgroup.com/products/ | Products | EV Group, products page |
| https://www.fabrinet.com/ | Home - Fabrinet | Fabrinet, company website |
| https://www.foxconn.com/ | 首頁 — 鴻海科技集團 (Hon Hai Technology Group home page) | Hon Hai Precision Industry (Foxconn), company website (鴻海科技集團) |
| https://www.fujimiinc.co.jp/ | フジミインコーポレーテッド | Fujimi Incorporated, company website (フジミインコーポレーテッド) |
| https://www.gce.com.tw/en/ | GCE金像電子 | Gold Circuit Electronics, company website (金像電子) |
| https://www.guc-asic.com/en/ | guc | Global Unichip Corporation, company website |
| https://www.hisilicon.com/ | 海思 - 使能万物互联的智能终端 | HiSilicon, company website (海思) |
| https://www.hoya.com/ir/2026/en/review/it.html | Information Technology Business｜Review of Operations｜HOYA Integrated Report 2026｜HOYA GROUP | HOYA, Information Technology business, review of operations, Integrated Report 2026 |
| https://www.hscpoly.com/ | Home - Hemlock Semiconductor | Hemlock Semiconductor, company website |
| https://www.huahonggrace.com/ | 华虹宏力半导体有限公司 (Hua Hong Grace Semiconductor home page) | Hua Hong Semiconductor, company website (华虹宏力半导体有限公司) |
| https://www.hygon.cn/ | 海光--用“芯”计算未来 | Hygon Information Technology, company website (海光) |
| https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html | Notice Regarding Capital Investment Plan for High-Performance IC Package Substrates｜About IBIDEN News｜About IBIDEN｜IBIDEN CO.,LTD. | Ibiden, Notice Regarding Capital Investment Plan for High-Performance IC Package Substrates |
| https://www.ibiden.com/ir/items/en_QA_FY25Q4.pdf | enQA_FY25Q4 | Ibiden, questions and answers from the financial presentation for the year ended 31 March 2026 |
| https://www.iluvatar.com/ | 天数智芯 | Iluvatar CoreX, company website (天数智芯) |
| https://www.ims.co.at/ | Home - IMS Nanofabrication GmbH | IMS Nanofabrication, company website |
| https://www.innolight.com/about | Overview | InnoLight Technology, company overview page |
| https://www.intel.com/content/www/us/en/newsroom/news/intel-foundry/intel-foundry-asml-accelerate-industry-readiness-for-high-na-euv.html | Intel foundry asml accelerate industry readiness for high na euv (Intel website) | Intel Foundry and ASML Accelerate Industry Readiness for High-NA EUV |
| https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators.html | Ai accelerators (Intel website) | Intel, AI accelerators product page |
| https://www.inventec.com/ | 英業達 | Inventec, company website (英業達) |
| https://www.jcetglobal.com/en/ | JCET Group home page | JCET Group, company website |
| https://www.kantodenka.co.jp/ | 関東電化工業 | Kanto Denka Kogyo, company website (関東電化工業) |
| https://www.kinsus.com.tw/en/ | Kinsus Interconnect Technology home page | Kinsus Interconnect Technology, company website |
| https://www.kokusai-electric.com/ | TOP \| 株式会社 KOKUSAI ELECTRIC | Kokusai Electric, company website (株式会社KOKUSAI ELECTRIC) |
| https://www.kyec.com.tw/en/ | 京元電子 | King Yuan Electronics, company website (京元電子) |
| https://www.lginnotek.com/product/substrate.do | LG이노텍 | LG Innotek, substrate products page (LG이노텍) |
| https://www.lumentum.com/ | Homepage \| Lumentum | Lumentum, company website |
| https://www.metax-tech.com/en/ | MetaX | MetaX, company website |
| https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf | 半導体・デジタル産業戦略の今後の方向性 令和7年12月23日 | METI, Semiconductor and digital industry strategy: future direction (半導体・デジタル産業戦略の今後の方向性), 23 December 2025 |
| https://www.mgc.co.jp/ | 三菱ガス化学株式会社 | Mitsubishi Gas Chemical, company website (三菱ガス化学株式会社) |
| https://www.micron.com/products/memory/hbm/hbm3e | HBM3E | Micron, HBM3E product page |
| https://www.micron.com/products/memory/hbm/hbm4 | HBM4 | Micron, HBM4 product page |
| https://www.mjc.co.jp/en/products/ | 製品・サービス｜株式会社日本マイクロニクス | Micronics Japan, products and services page (製品・サービス) |
| https://www.mks.com/semiconductor | MKS Inc. | MKS Instruments, semiconductor page |
| https://www.mofcom.gov.cn/zwgk/zcfb/art/2025/art_b1ec77dd3f0d4762952904df7cdaadec.html | 商务部、海关总署公告2025年第70号 公布暂停实施商务部、海关总署公告2025年第55号、56号、57号、58号及商务部公告2025年第61号、62号的决定 | MOFCOM and GAC Announcement 2025 No. 70, suspending the October 2025 export-control measures, Announcements Nos. 55 to 58, 61 and 62 (商务部、海关总署公告2025年第70号) |
| https://www.mofcom.gov.cn/zwgk/zcfb/art/2026/art_01c15948864a45d186abb146fe30a42b.html | 商务部公告2026年第37号 公布对原产于日本的进口二氯二氢硅反倾销调查的初步裁定 | MOFCOM Announcement 2026 No. 37, preliminary determination in the anti-dumping investigation into dichlorosilane imported from Japan (商务部公告2026年第37号) |
| https://www.morita-kagaku.co.jp/ | 森田化学工業株式会社 | Morita Chemical Industries, company website (森田化学工業株式会社) |
| https://www.mthreads.com/ | 摩尔线程官方网站 \| 全栈AI 为美好世界加速 | Moore Threads, company website (摩尔线程) |
| https://www.nanya.com/en/Product | Nanya | Nanya Technology, products page |
| https://www.nanyapcb.com.tw/ | nanyapcb.com.tw home page | Nan Ya Printed Circuit Board, company website |
| https://www.naura.com/en/ | 首页 - 北方华创 | NAURA Technology Group, company website (北方华创) |
| https://www.nikon.com/ | Nikon | Nikon, company website |
| https://www.nipponsanso-hd.co.jp/ | 日本酸素ホールディングス株式会社 | Nippon Sanso Holdings, company website (日本酸素ホールディングス株式会社) |
| https://www.nsig.com/en/ | National Silicon Industry Group (NSIG) home page | National Silicon Industry Group, company website |
| https://www.nuflare.co.jp/ | 株式会社ニューフレアテクノロジー | NuFlare Technology, company website (株式会社ニューフレアテクノロジー) |
| https://www.oci.co.kr/ | OCI 주식회사 | OCI, company website (OCI 주식회사) |
| https://www.primarius-tech.com/en/ | PRIMARIUS | Primarius Technologies, company website |
| https://www.pti.com.tw/en/ | Home - Powertech Technology Inc. | Powertech Technology, company website |
| https://www.qct.io/solution/index/AI-Solutions | AI Solutions (Quanta Cloud Technology website) | Quanta Cloud Technology, AI solutions page |
| https://www.resonac.com/ | Resonac \| レゾナック | Resonac, company website (レゾナック) |
| https://www.rieti.go.jp/en/columns/v01_0201.html | Articles「The impact of export controls on international trade: Evidence from the Japan | The impact of export controls on international trade: evidence from the Japan–Korea trade dispute in the semiconductor industry |
| https://www.samsungsem.com/ | 삼성전기 | Samsung Electro-Mechanics, company website (삼성전기) |
| https://www.sandisk.com/company/newsroom | Newsroom \| Sandisk | Sandisk, newsroom |
| https://www.sas-globalwafers.com/ | GlobalWafers home page | GlobalWafers, company website |
| https://www.screen.co.jp/download_file/view/6d6c7bf6-ec75-4f44-82d6-b67d0052b45a/451 | 第81期有価証券報告書 | SCREEN Holdings, securities report (有価証券報告書), 81st fiscal year |
| https://www.screen.co.jp/download_file/view/7e03d9a8-88eb-4a7d-ab77-509eba1422ac/2540 | 第85期有価証券報告書 | SCREEN Holdings, securities report (有価証券報告書), 85th fiscal year |
| https://www.screen.co.jp/download_file/view/95fd5713-120c-43ce-ab1c-83791af24040/1857 | 第83期有価証券報告書 | SCREEN Holdings, securities report (有価証券報告書), 83rd fiscal year |
| https://www.screen.co.jp/spe/en/products | Products | SCREEN Semiconductor Solutions, products page |
| https://www.se.com/us/en/work/solutions/for-business/data-centers-and-networks/ | Data centers and networks (Schneider Electric website) | Schneider Electric, data centers and networks page |
| https://www.semes.com/en/ | SEMES home page | SEMES, company website |
| https://www.semiconductors.org/wp-content/uploads/2021/05/BCG-x-SIA-Strengthening-the-Global-Semiconductor-Value-Chain-April-2021_1.pdf | BCG x SIA Strengthening the Global Semiconductor Value Chain April 2021 1 (Semiconductor Industry Association website) | Strengthening the Global Semiconductor Supply Chain in an Uncertain Era |
| https://www.semitronix.com/ | Semitronix home page | Semitronix, company website |
| https://www.shinetsu.co.jp/ | Homepage_en - Shin-Etsu Chemical Co., Ltd. | Shin-Etsu Chemical, company website |
| https://www.siemens-energy.com/global/en/home/products-services/product-offerings.html | Products | Siemens Energy, product offerings page |
| https://www.siltronic.com/en/products | Products | Siltronic, products page |
| https://www.sk.com/en/ | SK Group home page | SK Group, company website |
| https://www.sksiltron.com/ | SK siltron home page | SK siltron, company website |
| https://www.skspecialty.com/ | SK스페셜티 | SK specialty, company website (SK스페셜티) |
| https://www.skyverse.com/ | Skyverse | Skyverse Technology, company website |
| https://www.smee.com.cn/ | 上海微电子装备(集团)股份有限公司 | Shanghai Micro Electronics Equipment, company website (上海微电子装备集团股份有限公司) |
| https://www.smics.com/ | SMIC home page | SMIC, company website |
| https://www.soulbrain.co.kr/en/ | Soulbrain | Soulbrain, company website |
| https://www.stella-chemifa.co.jp/ | ステラケミファ株式会社 | Stella Chemifa, company website (ステラケミファ株式会社) |
| https://www.sumcosi.com/english/products/ | Products│SUMCO CORPORATION | SUMCO, products page |
| https://www.sumcosi.com/english/products/process/ | Production Processes│Products│SUMCO CORPORATION | SUMCO, production processes page |
| https://www.sumitomo-chem.co.jp/ | 住友化学株式会社 | Sumitomo Chemical, company website (住友化学株式会社) |
| https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4presentations-e.pdf | fy26q4presentations-e | Tokyo Electron, FY2026 (April 2025 to March 2026) financial announcement, 30 April 2026 |
| https://www.teradyne.com/ | Teradyne home page | Teradyne, company website |
| https://www.tfme.com/ | 通富微电子股份有限公司 | Tongfu Microelectronics, company website (通富微电子股份有限公司) |
| https://www.tokuyama.co.jp/ | Tokuyama | Tokuyama Corporation, company website |
| https://www.toppan.com/ | ホーム｜TOPPANグループサイト | TOPPAN, company website (TOPPANグループサイト) |
| https://www.umc.com/en/Product/technologies/Overview | Overview (United Microelectronics Corporation (UMC) website) | UMC, process technologies overview page |
| https://www.unimicron.com/ | Unimicron Technology home page | Unimicron Technology, company website |
| https://www.vdlgroep.com/en/markets/semiconductor | Semiconductor (VDL Groep website) | VDL Groep, semiconductor market page |
| https://www.vdlgroep.com/en/vdl-groep/innovation-projects/vdl-etg-builds-complex-frames-for-zeiss | Vdl etg builds complex frames for zeiss (VDL Groep website) | VDL Groep, VDL ETG builds complex frames for Zeiss, innovation project page |
| https://www.wacker.com/cms/en-us/products/product-groups/polysilicon/polysilicon.html | Polysilicon | Wacker Chemie, polysilicon product page |
| https://www.winbond.com/ | Winbond Electronics home page | Winbond Electronics, company website |
| https://www.wistron.com/en/Business/Solutions | Solutions (Wistron website) | Wistron, business solutions page |
| https://www.wuspcb.com/en/ | Wus Printed Circuit home page | Wus Printed Circuit, company website |
| https://www.ymtc.com/en/ | YMTC-YMTC | Yangtze Memory Technologies, company website |
