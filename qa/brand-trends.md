# Search demand for the candidate names

Checked 11 September 2026. Options only; nothing else in the repo changed. Sources: Google Trends through pytrends, Google autocomplete, the Wikimedia pageviews API, yt-dlp against YouTube search, and whois at the Verisign and PIR registries. Raw files sit in the session scratchpad, not the repo.

## 1. Google Trends, indexed to the anchor

Anchor: "semiconductor supply chain" = 100 in every batch. Each batch put the anchor beside four candidates, so batches are comparable through the anchor, though the ratio for a term that scored under 1 on Google's 0 to 100 scale is noise, not measurement. Two facts about Trends matter for reading the table. It matches search terms as word sets, so "how chips are made" and "how are chips made" are the same term and came back identical; and "chips" includes potatoes, which the autocomplete and YouTube checks below confirm.

| Term | World, 5 y | US, 5 y | World, 12 m | US, 12 m |
|---|---|---|---|---|
| semiconductor supply chain (anchor) | 100 | 100 | 100 | 100 |
| semiconductor industry | 348 | 454 | 263 | 283 |
| semiconductor manufacturing | 347 | 436 | 255 | 265 |
| ai chips | 764 | 825 | 728 | n/v |
| chip war | 130 | 212 | 113 | n/v |
| chip manufacturing | 126 | 213 | 77 | 101 |
| nvidia supply chain | 79 | 91 | 86 | 94 |
| export controls chips | 61 | 45 | 51 | n/v |
| how chips are made (= how are chips made) | 47 | 157 | 47 | n/v |
| chip supply chain | 34 | 39 | 37 | n/v |
| gpu supply chain | 32 | 33 | 35 | n/v |
| chokepoints | 25 | 34 | 29 | n/v |
| compute governance | 14 | 13 | 15 | n/v |
| chipmaking | 12 | 9 | 9 | n/v |
| ai chip supply chain | 12 | 12 | 14 | n/v |
| semiconductor 101 | 9 | 4 | 5 | n/v |
| how are semiconductors made | 1.7 | 1.3 | 0.3 | n/v |
| how are computer chips made | 0.6 | 0.9 | 0.1 | n/v |
| how ai chips are made (= how are ai chips made) | 0.4 | 0.1 | 0.1 | n/v |
| how are microchips made | 0.4 | 0.2 | 0.3 | n/v |
| how are gpus made | 0.2 | 0.6 | 0.0 | n/v |
| compute chokepoints | 0.0 | 0.2 | 0.0 | n/v |
| inside the chip supply chain | 0.0 | 0.0 | 0.0 | n/v |

n/v: not verified. For the first twenty terms the US 12-month run returned values identical, to ten decimal places, to the worldwide run, on two separate runs, while the last batch returned distinct US values through the same code. A third run to settle it met ten consecutive 429s over fifteen minutes of backoff, and a raw request to the explore endpoint without the session cookie was refused too, so the block is on this address. Read the US 5-year column for United States demand. Three earlier 429s cleared after 20 to 50 seconds; related-queries requests never got through.

## 2. Autocomplete, Wikipedia and YouTube

**Autocomplete** (Google, English). "how ai chips are made" is offered as a completion, but the list around it is about geography and firms: *what ai chips are made in usa*, *what percentage of ai chips are made in taiwan*, *who manufactures ai chips*. "how chips are made" completes to *in factory*, *intel*, *in india*, *from potatoes*, *in taiwan*, *from corn*. "semiconductor supply chain" completes to *diagram*, *companies*, *stocks*, *map*, *explained*. "chip supply chain" completes to *disruption*, *companies*, *map*, *explained*, *tracker*. "chip war" completes to *chip wars*, *book*, *chris miller*, *pdf*. "chokepoints" now completes to *book*, *edward fishman*, *american power*: Fishman's 2025 book has taken the word. "compute chokepoints" and "inside the chip supply chain" return empty lists. "ai chips" completes to *stocks*, *companies*, *etf*, *for sale*.

**Wikipedia**, average monthly views by people (not bots), January 2025 to August 2026:

| Article | Views per month |
|---|---|
| Nvidia | 224,000 |
| TSMC | 64,400 |
| ASML Holding | 43,700 |
| Semiconductor | 33,100 |
| Blackwell (microarchitecture) | 28,600 |
| Graphics processing unit | 28,500 |
| Integrated circuit | 28,100 |
| CHIPS and Science Act | 18,700 (11,400 in the last twelve months) |
| Extreme ultraviolet lithography | 17,500 |
| Semiconductor industry | 16,000 |
| High Bandwidth Memory | 14,300 |
| Photolithography | 13,700 |
| Supply chain | 11,300 |
| Semiconductor device fabrication | 10,700 |
| Wafer (electronics) | 10,000 |
| Choke point (the geographic term) | 7,700 |
| Semiconductor industry in China | 4,400 |
| AI accelerator | 4,200 |
| Semiconductor fabrication plant | 3,700 |
| Chip War (book; page moved May 2025, both titles summed) | 3,600 |
| US export controls on advanced computing to China | 1,800 |
| Chokepoints (Fishman's book, since Aug 2025) | 1,700 |
| Export control | 1,100 |
| Semiconductor supply chain | does not exist as an article (a stub redirect since March 2026, 2 views) |

**YouTube**, top results by view count. "how are chips made": Branch Education "How are Microchips Made?" 11.5 m, Interesting Engineering 7.0 m, Lay's potato chips 7.4 m, TED-Ed 1.0 m. "how are microchips made" also surfaces Veritasium 38.9 m, RobertElderSoftware "How To Make A CPU" 24.7 m, Infineon 3.2 m. "how are ai chips made": the videos that use that exact title have 500 to 32,000 views; the query is answered by WSJ "How Chips That Power AI Work" 494,000, CNBC 398,000, and the same microchip explainers. "semiconductor supply chain": Bloomberg Primer 1.66 m, Micro 428,000, freeCodeCamp's supply chain course 160,000. "chip war": TaiwanPlus documentary 759,000, Big Think with Chris Miller 649,000.

## 3. Shortlist

Domain lengths are the stem plus ".com". Domains marked "prior pass" were settled in `qa/brand-names-educational.md` or `qa/brand-names.md`.

| Name | Demand for the exact phrase | Demand for the idea behind it | Domain | Free? |
|---|---|---|---|---|
| How Chips Are Made | 47 (food included) | very high (11.5 m and 7 m YouTube; 10,700 monthly on Wikipedia's fabrication article) | howchipsaremade.com, 19 | .com and .org, prior pass |
| How AI Chips Are Made | 0.1 to 0.4 | high through "ai chips" (764) | howaichipsaremade.com, 21 | .com and .org, prior pass |
| Chip Supply Chain | 34 | 100 (anchor) | chipsupplychain.com, 19 | .com taken (HiChina, may lapse), .org free, prior pass |
| Chipmaking | 12 | high (semiconductor manufacturing 347) | chipmaking.com, 14 | .com **taken**, DropCatch, registered 22 Aug 2026; .org free |
| GPU Supply Chain | 32 | high (nvidia supply chain 79) | gpusupplychain.com, 18 | .com free, .org free |
| Semiconductor 101 | 9 | high | semiconductor101.com, 20 | .com free, .org free |
| Compute Chokepoints | 0 | 25 for "chokepoints", now Fishman's book | computechokepoints.com, 22 | free, prior pass |
| Inside the Chip Supply Chain | 0 | 100 | insidethechipsupplychain.com, 28 | free, prior pass |

Other domains checked today: howareaichipsmade, howarechipsmade, howaresemiconductorsmade, howsemiconductorsaremade, chipexportcontrols, all free in .com and .org; semiconductorsupplychain.com taken (HiChina, expires 28 Oct 2026), .org free; chipwar.com and .org taken (2025); aichips.com taken since 2001; computegovernance.com and .org taken; semiconductormanufacturing and chipmanufacturing taken in both.

**The plain answer.** The most searched name on the list is "ai chips", which is a stock-market query and unownable. Among names that describe the site, the most searched is "how chips are made", at roughly half the anchor's volume worldwide and 1.5 times it in the United States, with the shortest free descriptive domain, 19 characters. Its cost is that a share of that traffic is potato chips. "How AI Chips Are Made", the author's favourite, is not a query people type: it scored 0.1 to 0.4 against the anchor in every run. It borrows demand from "ai chips" and from the microchip explainers, not from its own phrase. "Semiconductor supply chain" and "chip supply chain" are steady and clean, and "chip war" out-pulls both, but Chris Miller owns it.

## 4. Naming after a query

A site named for a query is easy to find and hard to own. The upside is real: the title tag matches what people type, the name explains itself in a shared link, and a bookmark needs no subtitle. The downside is that the phrase belongs to everyone. "How chips are made" already returns Branch Education, Interesting Engineering, ASML's "How microchips are made" and the SIA's "How are Semiconductors Made?", and the site would compete with them for the exact string on their terms. A generic title also cannot be cited cleanly, cannot be trademarked, and looks like a content farm to the policy reader the earlier reports worried about. A coined name (Compute Chokepoints, From Sand to Rack) is the opposite trade: it has no search demand at all, so it must be carried by links, citations and word of mouth, but once it is known it is unambiguous, and every search for it lands on the site. The evidence here says the descriptive phrases have the demand and the coined names have none, so the question is whether the site expects to be found or to be recommended.
