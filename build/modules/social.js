/* SOCIAL: one real URL per chapter and per view, so a pasted link unfurls with its own title, text and card.

   Chapters: dist/<chapter>/index.html is the full interactive chapter since 28 Oct 2026, written by build.js from the same
   template as the home page with that chapter alone in The Chain, so search engines index each chapter at its own address
   and the home page no longer carries every chapter's text. This module gives each chapter page its head (chapterHead: the
   approved title and description, the canonical, prev and next, the citation and article tags, the share tags and card,
   and the JSON-LD), as the static readable page it used to write here had it. build.js lists the pages in the sitemap
   (ctx.chapterPages).

   Views (/home/, /intro/, /chain/): a small static page with the title, description, canonical, Open Graph and
   Twitter tags and one paragraph, then a meta refresh and a location.replace to the hash route on the main page.
   Unfurlers read the tags; people are redirected. /chips/, /suppliers/, /export-controls/ and /glossary/ are real
   pages with their own content, written by build/modules/reference-pages.js with these same tags and card.

   The card images come from build/assets/cards/<slug>.png (rendered by `python3 build/cards.py`, not on
   every build) and are copied to dist/cards/ here.

   manifest() is the single list of pages, shared with build/cards.py (which calls it through node), so the
   card and the page never disagree about a title or a line. It reads content/*.md itself so it needs no
   build context. The one placeholder it fills is HOME_CARD, the home card's URL for the main page's tags.

   A card that changes after people have shared it needs a new URL, or LinkedIn and the rest keep showing the old
   picture from their cache. build/assets/cards/versions.json keeps each card's version and a hash of its bytes; when
   a card's bytes change (re-rendered by cards.py or home_card.py), the build bumps its version, writes the file back,
   and the card's URL gains ?v=<version>. A card still on version 1 keeps its plain URL. */

const SITE_CONFIG = require('../site.js');
const keepRanges = require('../keep-ranges.js');
const BASE = SITE_CONFIG.url;
const SITE = 'Chip Supply Chain';
const AUTHOR = { name: 'Yashvardhan Sharma', url: 'https://www.linkedin.com/in/yashvardhan07/' };
// the site's own four faces (the hybrid, 28 Oct 2026): Fraunces for display, Source Serif 4 for text, Hanken Grotesk and Fragment Mono
const FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..600,0,0&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,400&family=Hanken+Grotesk:wght@400..700&family=Fragment+Mono&display=swap';
const SUBWORD = { 'Very hard': 'Very hard to substitute', Hard: 'Hard to substitute', Moderate: 'Moderately hard to substitute', Easy: 'Easy to substitute' };
const TILE = { 'component-costs': 'The economics', geopolitics: 'The contest' }; // what the chapter tile says for the two chapters that are not stages
const STAGES = require('../stages.js'); // which chapters are stages (all but the two that look across the chain)
const RETIRED = require('../retired-chapters.js'); // a chapter merged away: its page forwards to the merged chapter's (retiredHTML)
const PAGE_TITLES = require('../page-titles.js'); // the approved <title> and description of each static page

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const wordCount = (s) => String(s || '').split(/\s+/).filter((w) => /\w/.test(w)).length;
const sentences = (t) => String(t || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=["A-Z0-9])/);

// A description of at most `max` characters: whole sentences while they fit; a first sentence that is too long
// keeps the clause before its colon (a complete thought), or, failing that, is cut at a word
function describe(text, max = 160) {
  const ss = sentences(text);
  let out = '';
  for (const s of ss) { const next = out ? out + ' ' + s : s; if (next.length > max) break; out = next; }
  if (out) return out;
  const first = ss[0] || '';
  if (first.length <= max) return first;
  const colon = first.indexOf(': ');
  if (colon > 40 && colon < max) return first.slice(0, colon) + '.';
  return first.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…';
}

// For search results, which show about 160 characters: whole sentences up to 160, so the snippet ends where a sentence
// does. When that leaves a thin line (one short sentence), the next sentence joins it if the pair stays within 180.
function searchDescription(text) {
  const d = describe(text, 160);
  if (d.length >= 100 || d.endsWith('…')) return d;
  const two = describe(text, 180);
  return two.length > d.length && !two.endsWith('…') ? two : d;
}

function readChapters(root, fs, path) {
  const dir = path.join(root, 'content');
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir).filter((x) => /^\d\d-.*\.md$/.test(x)).sort()) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = src.match(/^---json\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!m) continue;
    let meta = {};
    try { meta = JSON.parse(m[1]); } catch (e) { continue; }
    const id = meta.id || f.replace(/^\d\d-/, '').replace(/\.md$/, '');
    out.push({ id, number: meta.number || out.length + 1, title: meta.title || id, plain: meta.plain || '', oneLiner: meta.oneLiner || '', card: meta.card || {} });
  }
  return out.sort((a, b) => a.number - b.number);
}

/* Every page: slug (the folder under dist/), kind, eyebrow, title, line (the one line under the title on the card),
   description (the meta text), body (visible text on the static page), route (the hash URL on the main page). */
function manifest(root) {
  const fs = require('fs'), path = require('path');
  root = root || path.resolve(__dirname, '..', '..');
  const chapters = readChapters(root, fs, path);
  const stages = chapters.filter(STAGES.isStage);
  const pages = [];

  for (const c of chapters) {
    const si = stages.findIndex((s) => s.id === c.id);
    const eyebrow = si >= 0
      ? `${SITE} · Chapter ${pad(c.number)} · Stage ${si + 1} of ${stages.length}`
      : `${SITE} · Chapter ${pad(c.number)}${TILE[c.id] ? ' · ' + TILE[c.id] : ''}`;
    const card = c.card || {};
    const conc = card.concentration || '';
    const sub = (card.substitutability || {}).band || '';
    const band = conc ? `${conc} concentration${sub ? ' · ' + (SUBWORD[sub] || sub) : ''}` : '';
    pages.push({
      // stage: the stage's place in the chain, 1 on, or null for the two chapters that are not stages (build/cards.py marks it)
      slug: c.id, kind: 'chapter', number: c.number, stage: si >= 0 ? si + 1 : null, eyebrow, title: c.title,
      line: si >= 0 && band ? band : describe(c.plain, 140),
      // for the card: the chapter's lede and its two ratings as tags (none for the two chapters that are not stages)
      lede: c.oneLiner || c.plain, tags: si >= 0 && conc ? [`${conc} concentration`, SUBWORD[sub] || sub].filter(Boolean) : [],
      description: describe(c.plain), body: c.plain, route: '#' + c.id, linkText: 'Read the chapter',
      // the readable page's meta description (search results) and its og/twitter description (share previews), from the chapter's one-line summary
      metaDescription: searchDescription(c.oneLiner || c.plain),
      // a share preview has room for the whole one-line summary, so it is never cut mid-sentence
      shareDescription: c.oneLiner || searchDescription(c.plain),
      // the share image's alt text says what build/cards.py draws: the title, the one-line summary, the specimen and the row of stages
      alt: `${c.title}. ${c.oneLiner || describe(c.plain, 140)} A drawing of the chapter's specimen sits beside the text, and small drawings of all ${stages.length} stages run along the bottom${si >= 0 ? ', with this one marked' : ''}.`,
    });
  }

  let suppliers = [];
  try { suppliers = JSON.parse(fs.readFileSync(path.join(root, 'data', 'suppliers.json'), 'utf8')); } catch (e) { /* the count is decorative */ }
  let exposureFirms = 24;
  try { exposureFirms = new Set(JSON.parse(fs.readFileSync(path.join(root, 'data', 'exposure.json'), 'utf8')).map((r) => r.firm)).size; } catch (e) { /* keep the last known count */ }
  const walkWords = chapters.reduce((a, c) => a + wordCount(c.plain), 0);
  const mins = Math.max(1, Math.round(walkWords / 230));

  const views = [
    // the home title is the site's own hero ("How AI chips are made"); the unfurl <title> and og:title still carry the site name (pageHTML)
    { slug: 'home', route: '', eyebrow: 'The AI chip supply chain', title: 'How AI chips are made', line: 'The AI chip supply chain, stage by stage: who makes each part, how concentrated each stage is, and what a substitute would cost.', description: 'How AI chips are made, and who controls each stage. The supply chain stage by stage: who makes each part, how concentrated each stage is, and what a substitute would cost.' },
    { slug: 'intro', route: '#/intro', eyebrow: `${SITE} · Start here`, title: 'How AI chips are made', line: `An introduction to the entire supply chain in ${mins} minutes.` },
    { slug: 'chain', route: '#/chain', eyebrow: `${SITE} · The Chain`, title: 'The Chain', line: 'Every stage of the supply chain, and who controls it.', description: `Every stage of the supply chain, and who controls it. ${chapters.length} chapters, from chip design to the data center.` },
    { slug: 'chips', route: '#/landscape', eyebrow: `${SITE} · AI Chips`, title: 'AI Chips', line: 'The chips that train and run AI models, from the A100 of 2020 to the parts shipping in 2026.', description: 'The chips that train and run AI models, from the A100 of 2020 to the parts shipping in 2026. Each entry names the foundry, process node, memory supplier and packaging plant behind the chip wherever the maker or a cited source has published them.' },
    { slug: 'suppliers', route: '#/suppliers', eyebrow: `${SITE} · Suppliers`, title: 'Suppliers', line: `What each of the ${suppliers.length || 220} firms makes, where it sits, and how hard it would be to replace.` },
    { slug: 'export-controls', route: '#/controls', eyebrow: `${SITE} · Export Controls`, title: 'Export Controls', line: `The main rules since 2018, what can still be sold to China, and China's share of revenue at ${exposureFirms} firms, from their filings.` },
    { slug: 'glossary', route: '#/glossary', eyebrow: `${SITE} · Glossary`, title: 'Glossary', line: 'Every term, firm, chip and country, with the passages that use them.' },
  ];
  // the share image's alt text, from the words build/cards.py and build/home_card.py put on each card
  const CARD_TITLE = { intro: 'Start here' };
  const CARD_LINE = {
    home: 'An introduction to the entire semiconductor supply chain.',
    suppliers: `What each of the ${suppliers.length || 226} firms makes, where it is based and how hard it would be to replace.`,
    'export-controls': 'A timeline of the main chip export rules since 2018 and what can still be sold to China.',
  };
  for (const v of views) v.alt = `${CARD_TITLE[v.slug] || v.title}. ${CARD_LINE[v.slug] || v.line} Small drawings of all ${stages.length} stages run along the bottom.`;
  for (const v of views) pages.push({ kind: 'view', body: v.description || v.line, linkText: 'Open the page', ...v, description: describe(v.description || v.line) });
  return pages;
}

// each card's version, bumped here when its bytes no longer match the hash on file (see the note at the top)
function cardVersions(root, fs, path) {
  const dir = path.join(root, 'build', 'assets', 'cards'), file = path.join(dir, 'versions.json');
  let known = {};
  try { known = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { known = {}; }
  const out = {}, next = {};
  let changed = false;
  const pngs = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort() : [];
  for (const f of pngs) {
    const slug = f.replace(/\.png$/, '');
    const sha = require('crypto').createHash('sha256').update(fs.readFileSync(path.join(dir, f))).digest('hex').slice(0, 16);
    const was = known[slug] || null;
    const v = !was ? 1 : was.sha === sha ? was.v : was.v + 1;
    if (!was || was.sha !== sha) changed = true;
    next[slug] = { v, sha }; out[slug] = v;
  }
  if (changed) fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n');
  return out;
}
const cardURL = (slug, versions) => BASE + 'cards/' + slug + '.png' + ((versions && versions[slug] > 1) ? '?v=' + versions[slug] : '');

// a page's search title and description: the approved list (build/page-titles.js) where it names the page, or p.seo, which a
// writer passes with its counts filled in (reference-pages.js); the share card's own title and line stay the manifest's
const seoOf = (p) => p.seo || PAGE_TITLES('/' + p.slug + '/');
const pageTitle = (p) => { const t = seoOf(p); if (t) return `${t.title} · ${SITE}`; return p.kind === 'chapter' ? `${p.title} · ${SITE}` : (p.slug === 'home' ? SITE : `${p.title} · ${SITE}`); };
// what an unfurler reads: the same tags on a chapter's readable page and on a view's forwarding page
function shareTags(p, versions) {
  const url = BASE + p.slug + '/';
  const image = cardURL(p.slug, versions);
  const seo = seoOf(p), title = seo ? seo.title : p.kind === 'chapter' ? p.title : pageTitle(p);
  // a chapter's preview leads with its one-line summary (the fact a reader would share), whole; the meta description cuts it to search length
  const description = seo && seo.description ? seo.description : p.kind === 'chapter' && (p.shareDescription || p.metaDescription) ? (p.shareDescription || p.metaDescription) : p.description;
  const alt = p.alt || p.eyebrow + '. ' + p.title + '. ' + p.line;
  return `<meta property="og:site_name" content="${SITE}">
<meta property="og:type" content="${p.kind === 'chapter' ? 'article' : 'website'}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<meta name="twitter:image:alt" content="${esc(alt)}">`;
}
const ICONS = `<link rel="icon" href="../favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">`;
// the static pages' masthead (the readable chapters, Start here's page and the reference pages in reference-pages.js): the app's
// own bar (build/masthead.js, design round nine, revision 6): Home, The Chain on the main page and the four reference pages by
// their real paths, so a crawler follows them (SEO review P1-1), then search and the theme; current is the link of the section
// the page belongs to, marked as the current page
const { masthead, mastheadCSS, NAV } = require('../masthead.js');
const MASTHEAD = masthead('');
// the static pages open light; ?theme= or the site's saved choice sets the theme before the first paint, and a contents rail the
// reader hid stays hidden (build/build.js RAIL_TOGGLE_JS)
const THEME_JS = `<script>(function(){try{var q=/[?&]theme=(light|dark)/.exec(location.search);var t=q?q[1]:localStorage.getItem('cp-theme');if(t)document.documentElement.setAttribute('data-theme',t);if(localStorage.getItem('cp-rail')==='off')document.documentElement.classList.add('rail-off');}catch(e){}})();</script>`;

// a view's page: the tags, one paragraph, and straight on to the view on the main page
function pageHTML(p, versions) {
  const target = BASE + p.route;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle(p))}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${esc(target)}">
${shareTags(p, versions)}
<!-- the tags above are what an unfurler reads; a person is sent on to the page itself -->
<meta http-equiv="refresh" content="0;url=${esc(target)}">
<script>location.replace(${JSON.stringify(target)});</script>
${ICONS}
<style>
body{margin:0;background:#fff;color:#171716;font:19.5px/1.55 "Source Serif 4",Georgia,serif}
main{max-width:34em;margin:0 auto;padding:48px 16px}
.eyebrow{font:400 12px/1.4 "Fragment Mono",ui-monospace,Menlo,monospace;color:#56554f;margin:0 0 12px}
h1{font:400 34px/1.1 "Source Serif 4",Georgia,serif;margin:0 0 20px}
a{color:#7a1f2b}
[data-theme="dark"] body{background:#121211;color:#e8e7e3}[data-theme="dark"] .eyebrow{color:#a9a7a1}[data-theme="dark"] a{color:#d98a95}
</style>
</head>
<body>
<main>
<p class="eyebrow">${esc(p.eyebrow)}</p>
<h1>${esc(p.title)}</h1>
<p>${esc(p.body)}</p>
<p><a href="${esc(target)}">${esc(p.linkText)}</a></p>
</main>
</body>
</html>
`;
}

// A chapter merged away (build/retired-chapters.js): its old address forwards to the merged chapter's readable page, with a
// canonical link, a meta refresh and a plain link, as a view's page forwards. A script goes first and carries a section's
// anchor along, mapped to the merged chapter's nearest (the readable page names its sources "sources" and its questions
// "review-questions"). No share tags and no card: the page is never listed (the sitemap leaves it out) and only forwards.
function retiredHTML(old, e, title, to) {
  const url = BASE + e.to + '/', rel = '../' + e.to + '/';
  const ON_PAGE = { [e.to + '--sources']: 'sources', [e.to + '--flashcards']: 'review-questions', [e.to]: '' };
  const map = {};
  Object.entries(RETIRED.ANCHORS || {}).forEach(([from, a]) => { map[from] = Object.prototype.hasOwnProperty.call(ON_PAGE, a) ? ON_PAGE[a] : a; });
  const js = `(function(){var M=${JSON.stringify(map)},h=location.hash.slice(1);try{h=decodeURIComponent(h);}catch(e){}var a=Object.prototype.hasOwnProperty.call(M,h)?M[h]:'';location.replace(${JSON.stringify(rel)}+location.search+(a?'#'+a:''));})();`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(to.title)} · ${SITE}</title>
<meta name="description" content="${esc(title)} is now part of the chapter ${esc(to.title)}.">
<link rel="canonical" href="${esc(url)}">
<!-- this chapter merged into ${esc(e.to)} on 27 Oct 2026: a person is sent on to it, with the section they asked for -->
<script>${js}</script>
<meta http-equiv="refresh" content="0;url=${esc(rel)}">
${ICONS}
<style>
body{margin:0;background:#fff;color:#171716;font:19.5px/1.55 "Source Serif 4",Georgia,serif}
main{max-width:34em;margin:0 auto;padding:48px 16px}
.eyebrow{font:400 12px/1.4 "Fragment Mono",ui-monospace,Menlo,monospace;color:#56554f;margin:0 0 12px}
h1{font:400 34px/1.1 "Source Serif 4",Georgia,serif;margin:0 0 20px}
a{color:#7a1f2b}
[data-theme="dark"] body{background:#121211;color:#e8e7e3}[data-theme="dark"] .eyebrow{color:#a9a7a1}[data-theme="dark"] a{color:#d98a95}
</style>
</head>
<body>
<main>
<p class="eyebrow">${SITE} · Chapter ${pad(to.number)}</p>
<h1>${esc(to.title)}</h1>
<p>${esc(title)} is now part of the chapter ${esc(to.title)}.</p>
<p><a href="${esc(rel)}">Read ${esc(to.title)}</a></p>
</main>
</body>
</html>
`;
}

// Start here's page (/intro/): the same tags, and a reader with scripts is sent on to Start here as from every view's page.
// A reader without scripts stays, since this page has no meta refresh (it would send them to a main page that shows nothing
// without scripts), and finds the deck that ends Start here as review questions, each answer linking to its chapter's
// readable page. It takes the readable chapter pages' styles.
function introHTML(p, versions, css, review) {
  const target = BASE + p.route;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle(p))}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${esc(target)}">
${shareTags(p, versions)}
<!-- the tags above are what an unfurler reads; a person with scripts is sent on to the page itself -->
<script>location.replace(${JSON.stringify(target)});</script>
${ICONS}
<meta name="color-scheme" content="light dark">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>${css}${EXTRA_CSS}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${MASTHEAD}
<main id="main" class="page">
<header class="ch-head">
<p class="eyebrow"><b>Start here</b></p>
<h1 class="ch-title">${esc(p.title)}</h1>
<p class="ch-lede">${esc(p.body)}</p>
<p><a href="${esc(target)}">${esc(p.linkText)}</a></p>
</header>
${review}
</main>
</body>
</html>
`;
}

/* ---------------- the chapter page's head ----------------
   Each chapter's own page, <site>/<id>/, is the full chapter since 28 Oct 2026: build.js writes it from src/template.html with
   that chapter alone in The Chain. Until then this module wrote a static, readable copy there and the chapter itself lived at
   <site>/#<id>. What search engines and unfurlers read stays this module's, as it was on the readable page: the approved
   title and description (build/page-titles.js), the canonical, the place in the reading order, the citation tags Google
   Scholar reads, the share tags and card, the article tags and one JSON-LD graph. dates is the page's { published, modified }
   (build.js page dates), r its words and minutes. */
function chapterHead(p, ch, ctx, versions, dates) {
  const r = ch.rendered || {}, m = ch.meta || {};
  const url = BASE + p.slug + '/', image = cardURL(p.slug, versions);
  const seo = seoOf(p), metaDescription = seo && seo.description ? seo.description : (p.metaDescription || p.description); // the approved line (build/page-titles.js)
  const seq = ctx.chapters.concat(ctx.geo ? [ctx.geo] : []);
  const si = ctx.stages.findIndex((c) => c.id === ch.id);
  const ymd = String(dates.modified).replace(/-/g, '/');
  const scholar = `<meta name="citation_title" content="${esc(ch.title)}">
<meta name="citation_author" content="Sharma, Yashvardhan">
<meta name="citation_date" content="${esc(ymd)}">
<meta name="citation_publisher" content="${SITE}">
<meta name="citation_language" content="en">
<meta name="citation_public_url" content="${esc(url)}">
<meta name="citation_fulltext_html_url" content="${esc(url)}">`;

  // the structured data (schema.org JSON-LD, one graph): the chapter as an Article, and the trail Home › The Chain › chapter.
  // Every value is one the page shows: the headline is the h1, the description the meta description, the dates the "Updated"
  // day and the day the chapter first appeared, the image the share card, the firms the card's leaders
  const at = seq.findIndex((c) => c.id === ch.id), prevCh = seq[at - 1], nextCh = seq[at + 1];
  const seoTitle = seo ? seo.title : ch.title;
  const leaders = si >= 0 ? ((m.card || {}).leaders || []).map((l) => (l && typeof l === 'object' ? l.name : l)).filter(Boolean) : [];
  const ld = { '@context': 'https://schema.org', '@graph': [
    Object.assign({
      '@type': 'Article', '@id': url + '#article', headline: ch.title }, seoTitle !== ch.title ? { alternativeHeadline: seoTitle } : {}, {
      description: metaDescription, url, mainEntityOfPage: { '@type': 'WebPage', '@id': url, url, name: pageTitle(p), breadcrumb: { '@id': url + '#breadcrumb' } },
      image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
      inLanguage: 'en', datePublished: dates.published, dateModified: dates.modified,
      author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
      publisher: { '@type': 'Organization', '@id': BASE + '#publisher', name: SITE, url: BASE, logo: { '@type': 'ImageObject', url: BASE + 'apple-touch-icon.png', width: 180, height: 180 } },
      isPartOf: { '@type': 'WebSite', '@id': BASE + '#website', name: SITE, url: BASE },
      articleSection: 'The Chain', about: { '@type': 'Thing', name: ch.title },
    }, leaders.length ? { mentions: leaders.map((n) => ({ '@type': 'Organization', name: n })) } : {}, {
      wordCount: ch.words, timeRequired: `PT${r.mins}M`, isAccessibleForFree: true,
    }),
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [['Home', BASE], ['The Chain', BASE + 'chain/'], [ch.title, url]]
      .map(([name, item], k) => ({ '@type': 'ListItem', position: k + 1, name, item })) },
  ] };
  // the chapter's place in the reading order, for the engines that still read it (Google stopped in 2019; Bing has not said so)
  const seqLinks = [prevCh ? `<link rel="prev" href="${esc(BASE + prevCh.id + '/')}">` : '', nextCh ? `<link rel="next" href="${esc(BASE + nextCh.id + '/')}">` : ''].filter(Boolean).join('\n');
  const articleTags = `<meta property="article:published_time" content="${esc(dates.published)}">
<meta property="article:modified_time" content="${esc(dates.modified)}">
<meta property="article:author" content="${esc(AUTHOR.url)}">
<meta property="article:section" content="The Chain">`;
  return `<title>${esc(pageTitle(p))}</title>
<meta name="description" content="${esc(metaDescription)}">
<link rel="canonical" href="${esc(url)}">
${seqLinks}
<meta name="robots" content="max-image-preview:large">
<meta name="author" content="${AUTHOR.name}">
${scholar}
${shareTags(p, versions)}
${articleTags}
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
}

const minCSS = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};])\s*/g, '$1').replace(/;}/g, '}').trim();
// the readable page's own additions to build/assets/chapter-page.css: the head's facts (words / minutes · Updated <day>) and,
// under them, the cite line's actions (build.js citeBlock; the citation opens as the link's :target without scripts, and as
// a toggle with them), and the key under the stage strip. On a phone a line that wraps drops its dots, so none ends on one.
// Printed (the browser's own print, with no script), the citation shows in full and the cite line's links drop out; each
// source prints its full address under its title, while the marks in the text stay numbers; the review answers open
// (where the browser can open a closed <details> from CSS) and the note telling the reader to open them goes; the
// specimen's caption, which describes the 3D model, is left out with the model.
const EXTRA_CSS = minCSS(`
.ch-head .ch-meta { margin-bottom: 4px; }
.ch-meta > span { white-space: nowrap; }
.ch-cite { margin: 0 0 26px; }
.ch-cite-line { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 8px; margin: 0; font-family: var(--font-label); font-size: 13px; font-weight: 500; letter-spacing: 0; color: var(--muted); }
.ch-cite-line > * { padding: 4px 0; }
.ch-cite-btn, .ch-cite-pdf, .ch-cite-copy { font: inherit; letter-spacing: inherit; text-transform: inherit; background: none; border: 0; margin: 0; cursor: pointer; color: var(--accent); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--line-2); }
.ch-cite-btn:hover, .ch-cite-pdf:hover, .ch-cite-copy:hover { text-decoration-color: var(--accent); }
@media (max-width: 640px) { .ch-cite-line { gap: 0 20px; } .ch-cite-line .ch-cite-sep { display: none; } }
.ch-cite-box { display: none; margin: 6px 0 2px; padding: 12px 14px 10px; border-left: 2px solid var(--accent); background: var(--bg-2); }
.ch-cite-box:target:not([hidden]), .ch-cite-box.is-open { display: block; }
.ch-cite-text { margin: 0; font-size: calc(15px * var(--text-scale)); line-height: 1.5; overflow-wrap: anywhere; }
.ch-cite-text a { color: inherit; }
.ch-cite-copy { display: inline-block; margin-top: 6px; padding: 4px 0; font-family: var(--font-label); font-size: 13px; font-weight: 500; letter-spacing: 0; }
@media print {
  .ch-cite-btn, .ch-cite-pdf, .ch-cite-sep, .ch-cite-copy { display: none !important; }
  .ch-cite-box { display: block !important; background: none; padding: 4px 0 0 10px; }
  .sources li > a[href] { text-decoration: none; }
  .sources li > a[href]::after { content: attr(href); display: block; font-family: var(--font-code); font-size: 8pt; line-height: 1.4; color: var(--muted); overflow-wrap: anywhere; }
  .specimen, .review-note { display: none !important; }
  .review details { break-inside: avoid; }
  .review summary { padding-left: 0; }
  .review summary::before { content: none; }
  .review .answer { display: block; padding-left: 0; }
}
@media print { .review details::details-content { content-visibility: visible; display: block; block-size: auto; } }
/* the card (build.js nameplate): its footnote marks, as on the main page (src/styles.css) */
.plate-kpis .v:not(.long) sup.cite { font-size: max(11px, 0.4em); vertical-align: 1.1em; margin-left: 0; }
.plate sup.cite-sep { font-family: var(--font-label); font-size: max(11px, 0.62em); line-height: 0; vertical-align: 0.55em; color: var(--accent); }
`);

// the annotated still of a chapter whose drawing carries numbered parts (data/specimen-parts.json "still"), which the chapter
// prints in place of the live drawing (src/modules/print.js stills): the picture, and over it a balloon per part in a column clear
// of the drawing on the part's side, each with its leader lines. Its picture's path is from the site's root (build.js relink adds
// the way there). The readable pages drew it until 28 Oct 2026, so the print still keeps their wide and narrow forms
function stillSVG(still, parts, title) {
  const S = +still.size || 772, cx = S / 2;
  const items = parts.map((p, i) => {
    const pts = (still.points || [])[i] || [];
    const mx = pts.reduce((a, q) => a + q[0], 0) / (pts.length || 1), my = pts.reduce((a, q) => a + q[1], 0) / (pts.length || 1);
    return { p, pts, side: mx < cx ? -1 : 1, y: my };
  }).filter((x) => x.pts.length);
  [-1, 1].forEach((side) => { const l = items.filter((x) => x.side === side).sort((a, b) => a.y - b.y); for (let i = 1; i < l.length; i++) if (l[i].y - l[i - 1].y < 96) l[i].y = l[i - 1].y + 96; });
  const f = (n) => n.toFixed(1);
  const label = `${esc(title)}, with ${parts.length} numbered parts: ${parts.map((p) => `${+p.n} ${esc(String(p.name).toLowerCase())}`).join(', ')}.`;
  // wide: each balloon named beside it; narrow (a phone), the numbers alone, larger, and the list under the caption names them
  const draw = (o) => items.map((x) => {
    const bx = x.side < 0 ? o.l : o.r, by = x.y;
    const lines = x.pts.map((q) => { const dx = q[0] - bx, dy = q[1] - by, L = Math.hypot(dx, dy) || 1; return `<line x1="${f(bx + dx / L * o.r0)}" y1="${f(by + dy / L * o.r0)}" x2="${f(q[0])}" y2="${f(q[1])}" style="stroke-width:${o.sw}"/><circle class="dot" cx="${f(q[0])}" cy="${f(q[1])}" r="${o.dot}"/>`; }).join('');
    return `<g>${lines}<circle class="bal" cx="${f(bx)}" cy="${f(by)}" r="${o.r0}" style="stroke-width:${o.sw}"/><text class="num" x="${f(bx)}" y="${f(by + o.fs * 0.36)}" text-anchor="middle" style="font-size:${o.fs}px">${+x.p.n}</text>${o.names ? `<text class="nm" x="${f(x.side < 0 ? bx - o.r0 - 12 : bx + o.r0 + 12)}" y="${f(by)}" dominant-baseline="central" text-anchor="${x.side < 0 ? 'end' : 'start'}" style="font-size:${o.fn}px">${esc(x.p.name)}</text>` : ''}</g>`;
  }).join('');
  const img = `<image href="media/${esc(still.file)}" x="0" y="0" width="${S}" height="${S}"/>`;
  return `<svg class="ch-still ch-still--wide" viewBox="-300 -14 ${S + 560} ${S + 28}" role="img" aria-label="${label}">${img}${draw({ l: -64, r: S + 74, r0: 24, fs: 24, fn: 30, sw: 2.4, dot: 6, names: true })}</svg>`
    + `<svg class="ch-still ch-still--narrow" viewBox="-96 -14 ${S + 192} ${S + 28}" aria-hidden="true">${img}${draw({ l: -46, r: S + 46, r0: 40, fs: 40, fn: 0, sw: 3.6, dot: 9, names: false })}</svg>`;
}

// A flashcard deck without scripts: review questions whose answers open in place, each reason ending with the link more(card)
// returns. A chapter's page links back to its sections; Start here's page (introHTML) links to the chapters.
const reviewSection = (cards, more) => `<section class="review" aria-labelledby="review-questions"><h2 class="label" id="review-questions">Review questions</h2><p class="review-note">Open a question to see its answer.</p>${cards.map((c) => {
  const link = more(c);
  return `<details><summary>${esc(c.q)}</summary><div class="answer"><p><b>${esc(c.a)}</b></p>${c.why || link ? `<p class="why">${esc(c.why || '')}${link}</p>` : ''}</div></details>`;
}).join('')}</section>`;


module.exports = function (ctx) {
  const { root, fs, path, warn } = ctx;
  const pages = manifest(root);
  const dist = path.join(root, 'dist');
  const versions = cardVersions(root, fs, path);
  let css = '';
  try { css = minCSS(fs.readFileSync(path.join(root, 'build', 'assets', 'chapter-page.css'), 'utf8') + mastheadCSS(root)); } catch (e) { warn('static pages: build/assets/chapter-page.css is missing, so /intro/ ships unstyled'); }
  const byId = new Map((ctx.all || []).map((c) => [c.id, c]));
  // the deck that ends Start here (data/flashcards.json "intro"), for /intro/: each answer links to its chapter's page
  const introDeck = (ctx.flashcards || {}).intro;
  const introCards = introDeck && Array.isArray(introDeck.cards) ? introDeck.cards.filter((c) => c.q && c.a) : [];
  const introReview = introCards.length ? reviewSection(introCards, (c) => {
    const ch = byId.get(c.chapter);
    return ch ? ` <a href="../${esc(ch.id)}/">Read: ${esc(ch.title)}</a>` : '';
  }) : '';
  // each chapter's own page is written by build.js (the full chapter, 28 Oct 2026); this module gives it its head, and build.js
  // lists the pages in the sitemap
  ctx.chapterPages = [];
  const chapterPage = new Map(pages.filter((p) => p.kind === 'chapter').map((p) => [p.slug, p]));
  ctx.chapterHead = (ch, dates) => chapterHead(chapterPage.get(ch.id), ch, ctx, versions, dates);
  // the four views that have a real page of their own (build/modules/reference-pages.js, which runs first, writes and lists them)
  const written = new Set((ctx.referencePages || []).map((k) => k.replace(/\//g, '')));
  for (const p of pages) {
    if (p.kind === 'chapter') {
      if (byId.has(p.slug) && byId.get(p.slug).rendered) ctx.chapterPages.push(p.slug);
      else warn(`chapter page ${p.slug}: the chapter was not rendered, so it has no page`);
      continue;
    }
    if (written.has(p.slug)) continue;
    const dir = path.join(dist, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = p.slug === 'intro' && introReview ? introHTML(p, versions, css, introReview) : pageHTML(p, versions);
    fs.writeFileSync(path.join(dir, 'index.html'), keepRanges(html));
  }
  // a chapter merged away keeps its address as a page that forwards to the merged chapter's (never listed in the sitemap)
  for (const [old, e] of Object.entries(RETIRED.chapters || {})) {
    const to = byId.get(e.to);
    if (!to) { warn(`retired chapter ${old}: no chapter ${e.to} to forward to`); continue; }
    if (pages.some((p) => p.slug === old)) { warn(`retired chapter ${old} still has a page of its own`); continue; }
    fs.mkdirSync(path.join(dist, old), { recursive: true });
    fs.writeFileSync(path.join(dist, old, 'index.html'), retiredHTML(old, e, e.title || old, to));
  }
  // the plain stills of the other chapters (qa/redesign/stills.js), copied as spec-<id>.webp
  for (const id of Object.keys(ctx.stillSizes || {})) {
    const from = path.join(root, 'build', 'assets', 'specimens', id + '.webp');
    if (fs.existsSync(from)) { fs.mkdirSync(path.join(dist, 'media'), { recursive: true }); fs.copyFileSync(from, path.join(dist, 'media', 'spec-' + id + '.webp')); }
  }
  // the annotated stills a chapter prints in place of its live specimen (data/specimen-parts.json "still"; the readable pages showed them)
  for (const e of Object.values(ctx.specimenParts || {})) {
    const f = e && e.still && e.still.file;
    if (!f) continue;
    const from = path.join(root, 'build', 'assets', 'specimens', f);
    if (fs.existsSync(from)) { fs.mkdirSync(path.join(dist, 'media'), { recursive: true }); fs.copyFileSync(from, path.join(dist, 'media', f)); }
    else warn(`specimen still ${f} is missing from build/assets/specimens/`);
  }
  // the cards, rendered by build/cards.py into build/assets/cards/; the build only copies them
  const src = path.join(root, 'build', 'assets', 'cards');
  const out = path.join(dist, 'cards');
  fs.mkdirSync(out, { recursive: true });
  const have = fs.existsSync(src) ? fs.readdirSync(src).filter((f) => f.endsWith('.png')) : [];
  for (const f of have) fs.copyFileSync(path.join(src, f), path.join(out, f));
  const missing = pages.filter((p) => !have.includes(p.slug + '.png')).map((p) => p.slug);
  if (missing.length) warn(`social cards missing (run python3 build/cards.py): ${missing.join(', ')}`);
  // the main page's own <title> and description (src/template.html), from the same approved list; its title already ends in the site name
  const home = PAGE_TITLES('/');
  if (!home) warn('page titles: build/page-titles.json has no entry for the main page, so it keeps the site name as its title');
  // the same titles for the app's own tab, by page path, so a chapter read in The Chain carries its static page's title (src/app.js Router.title)
  const viewTitles = {};
  for (const p of PAGE_TITLES.paths()) { const e = PAGE_TITLES(p); viewTitles[p] = p === '/' ? e.title : `${e.title} · ${SITE}`; }
  return { HOME_CARD: cardURL('home', versions), HOME_TITLE: esc(home ? home.title : SITE), HOME_DESCRIPTION: esc(home && home.description ? home.description : 'How AI chips are made, and who controls each stage of the supply chain.'), VIEW_TITLES: esc(JSON.stringify(viewTitles)) };
};
module.exports.manifest = manifest;
module.exports.pageHTML = pageHTML;
module.exports.BASE = BASE;
module.exports.stillSVG = stillSVG; // for the print still in each chapter with numbered parts (build.js)
// for the reference pages (build/modules/reference-pages.js): the same head, tags, card and masthead as the chapter pages
Object.assign(module.exports, { SITE, AUTHOR, FONTS, ICONS, MASTHEAD, masthead, THEME_JS, minCSS, pageTitle, shareTags, cardVersions, cardURL, describe });
