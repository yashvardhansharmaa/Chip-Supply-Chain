# Per-chapter URLs and social cards (11 September 2026)

## What was built

The site is one HTML file with hash routes, so a pasted link used to unfurl as the home page whatever it pointed at. Now every chapter and every view has a real URL of its own that unfurls with its own title, text and card on Slack, LinkedIn, X and Substack, and then sends the reader on to the page.

| Piece | Where | What it does |
|---|---|---|
| Unfurl pages | `build/modules/social.js` (auto-loaded by `build/build.js`) writes `dist/<slug>/index.html` | One small static page per chapter (slug = chapter id, `lithography/`) and per view (`home/`, `intro/`, `c/chain/`, `c/chips/`, `c/suppliers/`, `c/export-controls/`, `c/index/`): 24 pages. Each carries `<title>`, `<meta name="description">` (the chapter's first plain sentence, or the view's dek, at most 160 characters), `<link rel="canonical">` to the hash URL on the live site, `og:site_name`, `og:type` (article for chapters, website for views), `og:title`, `og:description`, `og:url`, `og:image` (absolute, with width, height and alt), `twitter:card summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`; then, after the tags, a `<meta http-equiv="refresh" content="0;url=…">` and a `location.replace` to the hash route. The body shows the eyebrow, the title, the plain paragraph and a "Read the chapter" link, so the page is not empty for a crawler. |
| Card images | `build/cards.py` renders `build/assets/cards/<slug>.png`, with `build/cards-art.js` dumping the specimen clouds; `social.js` copies the folder to `dist/cards/` | 1200 x 630 PNG per page in the "Dark" direction chosen from `qa/cards-redesign/`: the site's dark tokens (`:root[data-theme="dark"]` in `src/styles.css`: ground `#101315`, ink `#e7e9ea`, second ink `#c0c7cc`, muted `#8b959d`, amber `#e6ad2f`), IBM Plex Sans Condensed for the title, Newsreader for the line, IBM Plex Mono for the eyebrow and for the domain at the foot, all from Google Fonts. On the right, in a 640 px box that fades into the ground under the text column, the chapter's own specimen: the point cloud the page shows, drawn in pale ink with its accent points in amber at the tilt the site opens it at. Eyebrow "CHIP SUPPLY CHAIN · CHAPTER 04 · STAGE 4 OF 15" (chapters 16 and 17 say "THE ECONOMICS" and "THE CONTEST"); the title large; the amber rule; one line, which is the concentration band for the fifteen stages ("Extreme concentration · Very hard to substitute", from `card.concentration` and `card.substitutability.band`) and the first plain sentence for chapters 16 and 17; views show their name and dek. The foot carries the domain and a short label for the specimen ("EUV SCANNER, IN SECTION"). Sizes run 41 to 128 KB, all under the 150 KB limit. |
| Main page head | `src/template.html` lines 8 to 21 | Canonical, `og:site_name`, `og:type website`, `og:title`, `og:description` (the existing meta description), `og:url`, `og:image` (`cards/home.png`), `twitter:card summary_large_image` and the Twitter title, description and image. |
| Page list | `manifest()` exported from `build/modules/social.js` | The single list of slugs, eyebrows, titles, lines, descriptions and routes. It reads `content/*.md` and `data/suppliers.json` itself, so `cards.py` calls it through `node -e` and the card and the page never disagree. |

Design notes. The art is rendered at build time, not copied from the mock folder: `cards.py` runs `build/cards-art.js` once per specimen, which loads `src/kit.js` and `specimens/<name>.js` in Node, builds the cloud with `PC.build` and writes the float32 rows (x, y, z, w; w at or above 2 marks an accent point) with the tilt the specimen declares; `render_art()` in `cards.py` then projects the cloud with Pillow the way `qa/cover/render.py` does, far to near, and saves a transparent PNG that the card's HTML places flush right under a left-to-right gradient. A chapter's specimen is the `specimen` field of its front matter, read from `content/*.md` (the essay's globe, chapter 16's cost stack); a view takes one from `VIEW_SPECIMEN` in `cards.py`: the GPU die for home, intro and The Chain, the wafer-scale package for AI Chips, the globe for Suppliers and Export Controls, the wafer for the Index. `FRAME` holds a zoom per specimen where the default (0.92 of the box) leaves a tall one small or, for the globe, lets its pins run off the top. The text column is 600 px from x = 72; a title that would run past two lines there is shrunk in steps of 2 px (down to 56 px) until it fits, so "Chemicals, Gases and Photoresist" sets at 82 px and "The Economics of AI Chips" at 98 px, and the title never reaches the art. The line is shrunk in 1 px steps (down to 22 px) until two lines hold the whole sentence, so a chapter 16 or 17 sentence is never cut mid-word. The eyebrow is 19 px so the chapter eyebrows end inside the column. Every PNG is quantised to 256 colours; the size comes from the dots, not their number, so the cloud is drawn without supersampling (crisp 1 to 2 px dots, as on the page), which halves the file against a 2x render, and the script thins the cloud and draws the card again if one is still over 150 KB (none is at the default density of 0.8). `og:url` is the static page's own address, not the hash URL: Facebook's and LinkedIn's crawlers re-fetch `og:url` as the canonical, and pointing it at the main page would replace the chapter's tags with the home page's. The `<link rel="canonical">` still points at the hash URL, as asked, for search engines.

Descriptions. Whole sentences are packed while they fit in 160 characters. Two chapters (Lithography, Deposition and Etch) open with a sentence longer than that; the description keeps the clause before the colon and closes it with a full stop ("Lithography prints the pattern of a circuit onto the wafer.").

## How to regenerate the cards

Cards are not rendered on every build (the build only copies them, and warns if one is missing). After a chapter title, band, plain paragraph, view dek or specimen changes:

```
python3 build/cards.py            # all 24 cards, about a minute
python3 build/cards.py --only lithography,home   # a subset
python3 build/cards.py --keep     # keeps the temporary HTML, clouds and art PNGs for inspection, prints the folder
node build/build.js               # copies build/assets/cards/ to dist/cards/ and rewrites dist/
```

`cards.py` needs Chrome at `/Applications/Google Chrome.app`, node (for the manifest and for `build/cards-art.js`), the `websocket-client` package (already used by `build/shoot.py`), numpy and Pillow for the art and the quantise step, and a network connection for Google Fonts. It prints one line per card with the size, the specimen, the final title size and line count, the final line size and the number of points drawn, and flags OVERFLOW or a size over the limit. If the fonts do not load it prints a warning and the cards fall back to system fonts; re-run with the network up. To change a view's specimen edit `VIEW_SPECIMEN`; to add a specimen add its foot label to `LABEL` and, if it needs one, a zoom to `FRAME`.

## Check

Run in the repo root with the local server up (`python3 -m http.server 8841 --directory dist`):

```
python3 build/cards.py
node build/build.js
for s in lithography chemicals-gases-and-photoresist export-controls; do
  curl -s "http://localhost:8841/$s/index.html" | grep -E "<title>|canonical|og:|twitter:|refresh"
done
curl -sI http://localhost:8841/cards/lithography.png | head -1
```

Expected: every page prints a title ending "· Compute Chokepoints" (the home page is "Compute Chokepoints"), a canonical of the form `https://yashvardhansharmaa.github.io/chokepoints/#<id>` or `#/<view>`, `og:type article` for chapters and `website` for views, `og:url` under `/c/<slug>/`, `og:image` and `twitter:image` under `/cards/<slug>.png`, `twitter:card summary_large_image`, and the refresh line last. The PNG answers 200.

Results on 11 September (Dark cards): all 24 pages and 24 cards built; `node build/build.js` printed no warning; no em dash in any generated page or in `cards.py`; every card between 41 and 128 KB (the four die-floorplan cards are the largest at 123 to 128 KB, the ingot the smallest at 41 KB); Google Fonts loaded on every card.

Cards viewed: `home.png` (two-line title "Chip Supply / Chain" at 104 px, the GPU die with its amber die-to-die strip), `lithography.png` (one line, the EUV scanner with its light path in amber), `component-costs.png` ("The Economics of AI Chips" at 98 px on two lines, the plain sentence at 30 px on two lines, the cost stack with the HBM block in amber) and `geopolitics.png` (the globe with its pins clear of the top edge); plus a contact sheet of all 24 at 400 px and `chemicals-gases-and-photoresist.png` at 300 px, where the eyebrow, title and line all read. Nothing clipped or overflowed; the script reports no OVERFLOW.

## Live checks after deploy

Once `dist/` is pushed, paste `https://yashvardhansharmaa.github.io/chokepoints/lithography/` into a Slack message, LinkedIn's Post Inspector (linkedin.com/post-inspector), X's card validator or a Substack draft. Each should show the Lithography card and the first plain sentence. LinkedIn and Facebook cache a URL for about a week; re-scrape from the inspector after changing a card. A reader opening the URL lands on `#lithography` inside The Chain.

## Open

- A `sitemap.xml` listing the 24 URLs, and structured data (`Article` per chapter), are the natural next step for search engines; not built here.
- The description for a chapter whose plain paragraph opens with a very short sentence (chapter 3: "Photoresist is photographic film for chips.") is that sentence alone when the next one does not fit in 160 characters. Acceptable, but an editor may prefer a hand-written description field in the front matter.
- Cards are rendered at 1x (1200 x 630). A 2x render would be crisper on retina previews but four times the size; not needed for unfurls.
