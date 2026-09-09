# CHOKEPOINTS — Source policy

The client's instruction: **only very high-quality, extremely reliable sources.** Every number on the site must trace to a Tier A or Tier B source. Tier C is allowed only when A and B do not cover the fact, and the text must say so ("industry press reports", "one analyst estimates"). Tier D is never cited.

## Tier A — primary and institutional (preferred)

- Company filings and investor materials: sec.gov and data.sec.gov, annual reports, investor decks and earnings releases on the company's own domain (asml.com, ourbrand.asml.com, tsmc.com, pr.tsmc.com, nvidia.com, nvidianews.nvidia.com, news.skhynix.com, micron.com, intc.com, ir.amd.com, tel.com, lamresearch.com, appliedmaterials.com, kla.com, sumcosi.com, shinetsu.co.jp, ibiden.com, advantest.com, and the like, including IR PDFs served from a CDN such as d1io3yog0oux5.cloudfront.net or q4cdn.com).
- Governments, regulators and legislatures: federalregister.gov, bis.gov, govinfo.gov, congress.gov, whitehouse.gov, commerce.gov, justice.gov, treasury.gov, government.nl, meti.go.jp, english.mofcom.gov.cn, chinaselectcommittee.house.gov, foreign.senate.gov, phoenix.gov, azcommerce.gov, and official embassy or ministry pages.
- Standards bodies and research institutions: jedec.org, uciexpress.org, riscv.org, imec-int.com, arxiv.org (peer-reviewed or institutional preprints), university and national-lab pages (purdue.edu, newscenter.lbl.gov), cset.georgetown.edu and its ETO data on raw.githubusercontent.com, csis.org, epoch.ai, semiconductors.org (SIA), semi.org, wsts.org, bcg.com, rand.org, brookings.edu, cfr.org, ifp.org, stimson.org, rieti.go.jp.

## Tier B — established analysts and top-tier press (acceptable)

- Industry analysts with named methodologies: trendforce.com and insights.trendforce.com, counterpointresearch.com, yolegroup.com, techinsights.com, newsletter.semianalysis.com and inferencex.semianalysis.com, delloro.com, prismark.com, gartner.com, idc.com, lightcounting.com, z2data.com, futurumgroup.com, isaiahresearch.com.
- Top-tier press: reuters.com, bloomberg.com, ft.com, wsj.com, asia.nikkei.com, nytimes.com, economist.com, caixinglobal.com, scmp.com, koreajoongangdaily.com, taipeitimes.com, cnbc.com, aljazeera.com, techcrunch.com, chosun.com, en.sedaily.com, taiwannews.com.tw, chinadailyhk.com (for Chinese official positions only).
- Law-firm regulatory alerts, for the text and dates of rules only: cov.com, pillsburylaw.com, sanctionsnews.bakermckenzie.com, mayerbrown.com, klgates.com, kirkland.com, hklaw.com, clarkhill.com, globaltaxnews.ey.com, internationaltradeinsights.com.

## Tier C — specialist trade press and named expert analysts (only when A and B do not cover it, and say so in the sentence)

eetimes.com, eetasia.com, semiengineering.com, semiwiki.com, tomshardware.com, servethehome.com, nextplatform.com, digitimes.com, bits-chips.com, heise.de, theregister.com, datacenterfrontier.com, datacenterdynamics.com, semiconductor-digest.com, 3dincites.com, technode.com, evertiq.com, manufacturingdive.com, sdxcentral.com, utilitydive.com, power-eng.com, pv-magazine.com, electrek.co, techpowerup.com, storagereview.com, design-reuse.com, sfa-oxford.com, terrapincg.com, marklapedus.substack.com, drrobertcastellano.substack.com, tspasemiconductor.substack.com, glennklockwood.com, asianometry.com, patsnap.com, dri.co.jp.

Rule for Tier C: if the article is reporting a Tier A or B source (a company release, a TrendForce report, a Federal Register rule), cite that underlying source instead.

## Tier D — never cite

- Market-research SEO sites: gminsights.com, mordorintelligence.com, factmr.com, businessresearchinsights.com, maximizemarketresearch.com, congruencemarketinsights.com, intelmarketresearch.com, semiconductorinsight.com, marketsandmarkets.com, grandviewresearch.com, fortunebusinessinsights.com, precedenceresearch.com, and any site of that kind.
- Financial data aggregators and transcript mirrors: stockanalysis.com, investing.com, finance.yahoo.com, fog.misty.com, earningscall.ai, japan-earnings.com, quartr.com, 247wallst.com, nasdaq.com articles, seekingalpha.com, motleyfool.com, marketbeat.com. Use the SEC filing or the company's IR page instead.
- Personal, anonymous or promotional blogs and content farms: siliconanalysts.com, semiconductorx.com, shanethegamer.com, datagravity.dev, intelligentcio.com, creating-nanotech.com, insidedeeptech.com, mckinsey-electronics.com (not McKinsey), techspot.com, blog.aifutures.org, xenospectrum.com, introl.com, globaldatacenterhub.com, blog.barrack.ai, photoncap.net, ljdevice.com.tw, semiconhunt.com, en.tmt-blog.jp, taekim.substack.com, gr8ham.substack.com, vision2030.ai, middleeastainews.com, aichipmap.com, modal.com, newwaymask.com, strategicmetalsinvest.com, wccftech.com, fudzilla.com, guru3d.com, gpuinsights.net, tech-insider.org, techtimes.com, wikipedia.org (as the only source for a number).

## What to do with a Tier D citation

1. Find the Tier A or B source for the same fact (the underlying filing, rule, analyst release, or top-tier report). Replace the URL and, if the number differs, correct the number to the better source.
2. If only a Tier C source exists, cite it and add the hedge in the sentence.
3. If nothing above Tier D supports the number, delete the number and the sentence that depends on it. A shorter, airtight chapter beats a longer one with a soft source.
4. Log every change.

## Presentation

The Sources page tags every citation with its tier (A, B or C). `data/source-tiers.json` maps domains to tiers; add any new domain you cite to it with the right tier.
