/* SOCIAL: one real URL per chapter and per view, so a pasted link unfurls with its own title, text and card.

   Chapters: dist/<chapter>/index.html is the chapter itself as a static, readable page, for search engines,
   citation and anyone who arrives from a shared link. It is assembled from the very HTML the main page prints
   (build.js keeps it on ch.rendered: In plain terms, In short, the chokepoint card and the prose, before the
   glossary buttons go in), so the two never drift. What needs the app is turned into what a static page can
   carry: an animation becomes its video with controls and its steps as text, the specimen becomes its caption,
   the flashcards become questions whose answers open in place, and the card's glossary buttons become plain
   tags. It has no redirect: a button opens the interactive chapter at <site>/#<chapter>. Its canonical URL is
   its own, and build.js lists it in the sitemap (ctx.readablePages). Styles: build/assets/chapter-page.css.

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
// the site's own four faces (redesign of 25 Oct 2026): Fraunces, Literata, Hanken Grotesk and Fragment Mono
const FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..600,0,0&family=Literata:ital,opsz,wght@0,7..72,300..700;1,7..72,400&family=Hanken+Grotesk:wght@400..700&family=Fragment+Mono&display=swap';
const SUBWORD = { 'Very hard': 'Very hard to substitute', Hard: 'Hard to substitute', Moderate: 'Moderately hard to substitute', Easy: 'Easy to substitute' };
const TILE = { 16: 'The economics', 17: 'The contest' }; // what the chapter tile says for the two chapters that are not stages
const PAGE_TITLES = require('../page-titles.js'); // the approved <title> and description of each static page
const RELATED = (() => { try { return require('../related-chapters.js'); } catch (e) { return {}; } })(); // the hand-picked "Related chapters" line

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
  const stages = chapters.filter((c) => c.number >= 1 && c.number <= 15);
  const pages = [];

  for (const c of chapters) {
    const si = stages.findIndex((s) => s.id === c.id);
    const eyebrow = si >= 0
      ? `${SITE} · Chapter ${pad(c.number)} · Stage ${si + 1} of ${stages.length}`
      : `${SITE} · Chapter ${pad(c.number)}${TILE[c.number] ? ' · ' + TILE[c.number] : ''}`;
    const card = c.card || {};
    const conc = card.concentration || '';
    const sub = (card.substitutability || {}).band || '';
    const band = conc ? `${conc} concentration${sub ? ' · ' + (SUBWORD[sub] || sub) : ''}` : '';
    pages.push({
      slug: c.id, kind: 'chapter', number: c.number, eyebrow, title: c.title,
      line: si >= 0 && band ? band : describe(c.plain, 140),
      // for the card: the chapter's lede and its two ratings as tags (none for the two chapters that are not stages)
      lede: c.oneLiner || c.plain, tags: si >= 0 && conc ? [`${conc} concentration`, SUBWORD[sub] || sub].filter(Boolean) : [],
      description: describe(c.plain), body: c.plain, route: '#' + c.id, linkText: 'Read the chapter',
      // the readable page's meta description (search results) and its og/twitter description (share previews), from the chapter's one-line summary
      metaDescription: searchDescription(c.oneLiner || c.plain),
      // a share preview has room for the whole one-line summary, so it is never cut mid-sentence
      shareDescription: c.oneLiner || searchDescription(c.plain),
      // the share image's alt text says what build/cards.py draws: the title, the one-line summary, the specimen and the row of stages
      alt: `${c.title}. ${c.oneLiner || describe(c.plain, 140)} A drawing of the chapter's specimen sits beside the text, and small drawings of all 15 stages run along the bottom${si >= 0 ? ', with this one marked' : ''}.`,
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
  for (const v of views) v.alt = `${CARD_TITLE[v.slug] || v.title}. ${CARD_LINE[v.slug] || v.line} Small drawings of all 15 stages run along the bottom.`;
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
  return `<meta property="og:site_name" content="${SITE}">
<meta property="og:type" content="${p.kind === 'chapter' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.alt || p.eyebrow + '. ' + p.title + '. ' + p.line)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">`;
}
const ICONS = `<link rel="icon" href="../favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">`;
// the static pages' masthead (the readable chapters, Start here's page and the reference pages in reference-pages.js): the wordmark
// home, The Chain on the main page, and the four reference pages by their real paths, so a crawler follows them (SEO review P1-1);
// current is the link of the page it heads, marked as the current page
const NAV = [['../#/chain', 'The Chain'], ['../chips/', 'AI Chips'], ['../suppliers/', 'Suppliers'], ['../export-controls/', 'Export Controls'], ['../glossary/', 'Glossary']];
const masthead = (current) => `<header class="masthead"><a class="wordmark" href="../" aria-label="Chip Supply Chain"><svg class="wm-tile" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect width="16" height="16" rx="3.2"/><path transform="translate(3.3324 11.8693) scale(0.009179 -0.009179)" d="M1011 683 Q1011 612 960 564 Q909 515 823 515 Q739 515 696 561 Q653 607 653 680 L653 720 Q653 786 623 823 Q594 861 544 861 Q502 861 468 831 Q433 801 412 741 Q391 682 391 594 Q391 474 431 393 Q470 312 540 270 Q609 229 697 229 Q769 229 825 251 Q880 273 924 326 Q946 348 959 356 Q971 363 983 363 Q1000 363 1007 347 Q1015 330 1015 307 Q1012 216 954 140 Q896 64 796 19 Q695 -26 563 -26 Q417 -26 301 33 Q185 91 118 198 Q51 305 51 450 Q51 602 118 721 Q184 840 305 909 Q425 978 588 978 Q720 978 815 938 Q909 898 960 832 Q1011 765 1011 683 Z"/></svg><span class="wm-name">Chip Supply Chain</span></a><nav aria-label="Site">${NAV.map(([href, text]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${text}</a>`).join('')}</nav></header>`;
const MASTHEAD = masthead('');
// the static pages open light; ?theme= or the site's saved choice sets the theme before the first paint
// the rail's On this page marks the section the reader is in, as the app's does (src/app.js Rail.update): the last section
// whose top has passed 30 percent of the window takes aria-current, which src/modules/chapter.css draws as a wine rule. Then the
// names beside the still's balloons are set at 14 px on screen, as the app sets them, whatever the still's scale (stage 2
// review, item 6); without scripts they keep the size the still is drawn at
const RAIL_JS = `(function(){var r=document.querySelector('.ch-rail .rail-toc');if(!r)return;var dec=function(s){try{return decodeURIComponent(s);}catch(e){return s;}};
var xs=[].slice.call(r.querySelectorAll('a[href^="#"]')).map(function(a){return [a,document.getElementById(dec(a.getAttribute('href').slice(1)))];}).filter(function(x){return x[1];}),cur=null,q=0;
function up(){q=0;var line=Math.max(innerHeight*0.3,80),on=null;xs.forEach(function(x){if(x[1].getBoundingClientRect().top<line)on=x;});if(on!==cur){if(cur)cur[0].removeAttribute('aria-current');if(on)on[0].setAttribute('aria-current','location');cur=on;}}
addEventListener('scroll',function(){if(!q)q=requestAnimationFrame(up);},{passive:true});addEventListener('resize',up);up();})();
(function(){var nm=function(){[].forEach.call(document.querySelectorAll('svg.ch-still--wide'),function(s){var m=s.getScreenCTM&&s.getScreenCTM();if(!m||!m.a)return;[].forEach.call(s.querySelectorAll('text.nm'),function(t){t.style.fontSize=(14/m.a).toFixed(1)+'px';});});};nm();addEventListener('resize',nm);addEventListener('load',nm);})();`;
const THEME_JS = `<script>(function(){try{var q=/[?&]theme=(light|dark)/.exec(location.search);var t=q?q[1]:localStorage.getItem('cp-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>`;

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
body{margin:0;background:#fff;color:#171716;font:18px/1.6 Literata,Georgia,serif}
main{max-width:34em;margin:0 auto;padding:48px 16px}
.eyebrow{font:400 12px/1.4 "Fragment Mono",ui-monospace,Menlo,monospace;color:#56554f;margin:0 0 12px}
h1{font:350 34px/1.1 Fraunces,Georgia,serif;margin:0 0 20px}
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

/* ---------------- the readable chapter page ---------------- */
const BANDS = { Extreme: 4, High: 3, Moderate: 2, Low: 1 }; // as build.js ranks them for the chain's bars
const minCSS = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};])\s*/g, '$1').replace(/;}/g, '}').trim();
const textOf = (html) => String(html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
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
.ch-cite-text { margin: 0; font-size: 15px; line-height: 1.5; overflow-wrap: anywhere; }
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


// The main page's headings start at h3 under the chapter's h2; here the chapter title is the h1, so each moves up one level.
const levelUp =(html) => String(html || '').replace(/<(\/?)h([3-6])(?=[\s>])/g, (m, s, n) => `<${s}h${n - 1}`);

// A footnote number opens its source, as on the main page; the hover card becomes the link's title (title, publisher, date).
// The space the Markdown leaves before a citation is dropped, so the number sits on its word as a footnote does in print,
// and the number carries brackets that take no room on screen (.cite .br) but stay in the text: copied, quoted or read
// by a search engine, "in 2025" plus footnote 13 comes out as "in 2025[13]", never "202513".
const plainCites = (html) => html.replace(/\s+(?=<sup class="cite">)/g, '').replace(/<sup class="cite"><a href="([^"]*)"[^>]*?aria-label="Source (\d+): ([^"]*)">\d+<\/a><\/sup>/g,
  (m, href, n, label) => `<sup class="cite"><a href="${href}" target="_blank" rel="noopener" title="${label}" aria-label="Source ${n}: ${label}"><span class="br">[</span>${n}<span class="br">]</span></a></sup>`);

// Glossary buttons need the app's popover; here they are plain text. The card's two rating values (.v-btn) keep their
// dotted rule and carry their one-line definition as a title.
const plainTerms = (html) => String(html || '').replace(/<button type="button" class="gl-term\b\s*([^"]*)"([^>]*)>([\s\S]*?)<\/button>/g, (m, cls, attrs, inner) => {
  const band = (attrs.match(/\bdata-band="([^"]*)"/) || [])[1];
  const note = (attrs.match(/\bdata-note="([^"]*)"/) || [])[1];
  return `<span${cls.trim() ? ` class="${cls.trim()}"` : ''}${band ? ` data-band="${band}"` : ''}${note ? ` title="${note}"` : ''}>${inner}</span>`;
});

// An explainer animation: the main page plays it in time with its captions; here it is the video, with controls and
// nothing fetched until it is played, the last frame as its poster, and every step written out underneath. The still is
// for paper only (hidden on screen, chapter-page.css), so it loads lazily: the browser fetches it when the page is printed.
const staticAnimations = (html) => html.replace(/(<figure class="figure figure--anim"[^>]*>[\s\S]*?)<div class="fig-body">([\s\S]*?)<\/div><div class="fig-strip">/g, (m, head, inner) => {
  const src = (inner.match(/\bdata-src="([^"]*)"/) || [])[1];
  if (!src) return m;
  const title = textOf((head.match(/<p class="fig-title[^"]*">([\s\S]*?)<\/p>/) || [])[1] || '');
  const ratio = inner.match(/aspect-ratio:(\d+)\/(\d+)/);
  const steps = (inner.match(/<ol class="anim-transcript">([\s\S]*?)<\/ol>/) || [])[1] || '';
  const base = '../' + src;
  const size = ratio ? ` width="${ratio[1]}" height="${ratio[2]}"` : '';
  return `${head}<div class="fig-body"><div class="anim-frame"><video controls preload="none" playsinline muted${size} poster="${base}-light-end.jpg" src="${base}-light.mp4" data-media="${base}" aria-label="Animation: ${esc(title)}"></video></div><img class="anim-still" src="${base}-print-end.jpg" alt="Last frame of the animation: ${esc(title)}" loading="lazy" decoding="async" fetchpriority="low">${steps ? `<ol class="anim-steps">${steps}</ol>` : ''}</div><div class="fig-strip">`;
});
// The figures' controls without the app: Cite becomes a link to its citation, which opens as the link's :target without scripts
// and as a toggle with them (CITE_JS); Table and PNG come from FIG_JS. A chapter link (href="<id>/" with the app's data-route)
// goes to that chapter's readable page.
const staticFigures = (html) => html
  .replace(/<button type="button" class="ch-cite-btn" aria-expanded="false" aria-controls="([^"]+)">Cite<\/button>/g, '<a class="ch-cite-btn" href="#$1" aria-controls="$1">Cite</a>')
  .replace(/(<div class="ch-cite-box fig-cite-box"[^>]*?) hidden>/g, '$1>');
const staticRoutes = (html) => html.replace(/href="([a-z0-9-]+)\/" data-route="#[a-z0-9-]+"/g, 'href="../$1/"');
// the annotated still a readable page shows where the app draws the live specimen (data/specimen-parts.json "still"): the
// picture, and over it a balloon per part in a column clear of the drawing on the part's side, each with its leader lines
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
  const img = `<image href="../media/${esc(still.file)}" x="0" y="0" width="${S}" height="${S}"/>`;
  return `<svg class="ch-still ch-still--wide" viewBox="-300 -14 ${S + 560} ${S + 28}" role="img" aria-label="${label}">${img}${draw({ l: -64, r: S + 74, r0: 24, fs: 24, fn: 30, sw: 2.4, dot: 6, names: true })}</svg>`
    + `<svg class="ch-still ch-still--narrow" viewBox="-96 -14 ${S + 192} ${S + 28}" aria-hidden="true">${img}${draw({ l: -46, r: S + 46, r0: 40, fs: 40, fn: 0, sw: 3.6, dot: 9, names: false })}</svg>`;
}

// Links inside the chapter: a heading on this page stays a fragment, another chapter goes to its readable page, anything
// else on the main page (a view, a glossary entry) goes to the main page.
function fixLinks(html, chapterIds) {
  const local = new Set();
  html.replace(/\sid="([^"]+)"/g, (m, id) => { local.add(id); return m; });
  return html.replace(/href="#([^"]*)"/g, (m, id) => {
    if (local.has(id)) return m;
    if (chapterIds.has(id)) return `href="../${id}/"`;
    return `href="${BASE}#${id}"`;
  });
}

// A flashcard deck without scripts: review questions whose answers open in place, each reason ending with the link more(card)
// returns. A chapter's page links back to its sections; Start here's page (introHTML) links to the chapters.
const reviewSection = (cards, more) => `<section class="review" aria-labelledby="review-questions"><h2 class="label" id="review-questions">Review questions</h2><p class="review-note">Open a question to see its answer.</p>${cards.map((c) => {
  const link = more(c);
  return `<details><summary>${esc(c.q)}</summary><div class="answer"><p><b>${esc(c.a)}</b></p>${c.why || link ? `<p class="why">${esc(c.why || '')}${link}</p>` : ''}</div></details>`;
}).join('')}</section>`;

function readableHTML(p, ch, ctx, versions, css) {
  const { stages, flashcards, SPECIMEN_NAME, tierTag, sourceLine, builtOn, builtStr } = ctx;
  const r = ch.rendered, m = ch.meta || {};
  const url = BASE + p.slug + '/', app = BASE + '#' + ch.id, image = cardURL(p.slug, versions);
  const seo = seoOf(p), metaDescription = seo && seo.description ? seo.description : (p.metaDescription || p.description); // the approved line (build/page-titles.js)
  const seq = ctx.chapters.concat(ctx.geo ? [ctx.geo] : []);
  const si = stages.findIndex((c) => c.id === ch.id);
  const fc = flashcards[ch.id];
  const cards = fc && Array.isArray(fc.cards) ? fc.cards.filter((c) => c.q && c.a) : [];

  const conc = si >= 0 ? (m.card || {}).concentration || '' : '';
  const kick = `<p class="ch-kick"><span>Chapter ${pad(ch.number)}</span><span>${si >= 0 ? `Stage ${si + 1} of ${stages.length}` : esc(TILE[ch.number] || '')}</span>${conc ? `<span class="ch-band" data-band="${BANDS[conc] || 0}"><i aria-hidden="true"></i>${esc(conc)}</span>` : ''}</p>`;
  const adds = ['a 3D model', 'glossary definitions', cards.length ? 'flashcards' : ''].filter(Boolean);
  const note = `The interactive chapter adds ${adds.length > 1 ? adds.slice(0, -1).join(', ') + ' and ' + adds[adds.length - 1] : adds[0]}.`;
  const cta = (cls) => `<div class="cta${cls}"><a class="btn" href="${esc(app)}">Open the interactive chapter <span aria-hidden="true">→</span></a><p class="cta-note">${note}</p></div>`;

  const specimen = m.specimen || (ch.id === 'geopolitics' ? 'globe' : 'wafer');
  // the specimen: Lithography shows its annotated still (data/specimen-parts.json); every chapter its caption, flush left, and
  // the way to the live drawing. With no drawing on the page, chapters 16 and 17 have no night ground to set it on
  const pe = (ctx.specimenParts || {})[ch.id], parts = pe && Array.isArray(pe.parts) ? pe.parts : [];
  let still = pe && pe.still && parts.length ? stillSVG(pe.still, parts, m.specimenCaption ? m.specimenCaption.split('. ')[0] : ch.title) : '';
  // every other chapter shows a still of its own specimen, shot from the app at the angle it opens on (qa/redesign/stills.js,
  // build/assets/specimens/<id>.webp at twice the pixels it is shown at), so no readable page opens on a lone caption
  const sz = !still && (ctx.stillSizes || {})[ch.id];
  if (sz) still = `<img class="ch-still-img" src="../media/spec-${esc(ch.id)}.webp" width="${Math.round(sz[0] / 2)}" height="${Math.round(sz[1] / 2)}" alt="${esc((SPECIMEN_NAME[specimen] || specimen.replace(/-/g, ' ')))}, the chapter's specimen" decoding="async">`;
  const specimenHTML = `<figure class="ch-spec${still ? ' has-still' : ''}"${still && ch.number >= 16 ? ' data-night="1"' : ''}>${still ? `<div class="ch-spec-draw">${still}</div>` : ''}<figcaption class="ch-spec-cap"><span class="label">Specimen ${pad(ch.number)} · ${esc(ch.title)}</span>${m.specimenCaption ? `<p>${esc(m.specimenCaption)}</p>` : ''}${r.parts || ''}<a class="ch-spec-3d" href="${esc(app)}">See it in 3D in the interactive chapter</a></figcaption></figure>`;

  // the contents rail, as the app draws it (build.js railHTML), with this page's own section anchors
  const toc = (r.plain ? [[`${ch.id}--plain`, 'In plain terms']] : []).concat((ch.headings || []).map((h) => [h.id, esc(String(h.text).replace(/\*\*/g, ''))]))
    .concat(cards.length ? [['review-questions', 'Review questions']] : []).concat(ch.cites.length ? [['sources', 'Sources']] : []);
  const rail = ctx.railHTML ? ctx.railHTML(ch, si, toc) : '';
  const review = cards.length ? reviewSection(cards, (c) => {
    const anchor = c.section ? `${ch.id}--${ctx.slug(c.section)}` : '';
    return anchor ? ` <a href="#${esc(anchor)}">Reread: ${esc(c.section)}</a>` : '';
  }) : '';

  // the door to the next chapter, as The Chain ends each chapter (build.js chapterDoor), leading to the next readable page; the
  // last chapter's leads to the contents of The Chain (fixLinks sends its #/chain to the main page)
  const prevnext = ctx.chapterDoor ? ctx.chapterDoor(ch, (c) => `href="../${esc(c.id)}/"`, 'div', '../media/') : '';

  const sources = ch.cites.length ? `<section class="sources" aria-labelledby="sources"><h2 class="label" id="sources">Sources (${ch.cites.length})</h2><ol>${ch.cites.map((c, k) => `<li id="source-${k + 1}">${tierTag(c.url)}${sourceLine(c.url)}</li>`).join('')}</ol></section>` : '';

  const article = `<article class="chapter ch-page" data-number="${pad(ch.number)}">
<header class="chapter-head">
<div class="ch-open">${kick}<h1 class="ch-title${ch.title.length > 16 ? ' is-long' : ''}">${esc(ch.title)}</h1>
${m.oneLiner ? `<p class="ch-lede">${esc(m.oneLiner)}</p>` : ''}
<div class="ch-omet"><p class="ch-meta"><span class="label">${ch.words.toLocaleString('en-US')} words / ${r.mins} min</span><span class="label">Specimen: ${esc(SPECIMEN_NAME[specimen] || specimen.replace(/-/g, ' '))}</span>${ch.cites.length ? `<span class="label">${ch.cites.length} sources</span>` : ''}</p>
${cta('')}</div></div>
${specimenHTML}
${plainTerms(r.plate)}
${levelUp(r.plain || '')}
${r.inShort ? `<section class="inshort"><h2 class="label">In short</h2>${levelUp(r.inShort)}</section>` : ''}
</header>
${rail}
<div class="prose">
${staticFigures(staticAnimations(levelUp(r.prose)))}
${review}
<nav class="endnav" aria-label="After the chapter">${cta(' cta--end')}${prevnext}</nav>
${sources}
</div>
</article>`;
  const text = fixLinks(staticRoutes(plainTerms(plainCites(article))), new Set(seq.map((c) => c.id)));
  // the day this chapter's text last changed (build.js keeps a hash of `text` per page), and the day it first appeared;
  // the footer's "Updated" day says the same, in the main page's wording
  const today = builtOn.toISOString().slice(0, 10);
  const dates = ctx.pageDate ? ctx.pageDate('/' + p.slug + '/', text, ch.file) : { published: today, modified: today };
  const day = ctx.dayStr ? ctx.dayStr(dates.modified) : builtStr;
  const footerKey = ctx.dayStr ? ctx.footerKey.split(`Updated ${builtStr}`).join(`Updated ${day}`) : ctx.footerKey;
  // after the hash, the page furniture that is not the chapter's text: the head's "Updated <day>" and the cite line under it
  // (they carry the day, so they cannot be hashed)
  // ...and, before Previous and Next, the hand-picked related chapters (build/related-chapters.js), by name
  const picks = RELATED[ch.id] || [];
  const rel = picks.map((k) => {
    if (String(k).charAt(0) === '/') { const n = NAV.find(([h]) => h === '..' + k); if (!n) ctx.warn(`related chapters: ${ch.id} names ${k}, which is not a reference page`); return n ? `<a href="${n[0]}">${n[1]}</a>` : ''; }
    const c = seq.find((x) => x.id === k); if (!c) ctx.warn(`related chapters: ${ch.id} names ${k}, which is not a chapter`);
    return c && c.id !== ch.id ? `<a href="../${esc(c.id)}/">${esc(c.title)}</a>` : '';
  }).filter(Boolean);
  const related = rel.length ? `<p class="related"><span class="label">${picks.every((k) => String(k).charAt(0) !== '/') ? 'Related chapters' : 'Related pages'}</span>${rel.join('')}</p>` : '';
  const main = text
    .replace(/(<p class="ch-meta">[\s\S]*?)(<span class="label">\d+ sources<\/span>)?(<\/p>)/, (m, meta, srcs, end) => meta + `<span class="label">Updated ${esc(day)}</span>` + (srcs || '') + end + (ctx.citeBlock ? ctx.citeBlock(ch, day, true) : ''))
    .replace(/\{\{CITE_DAY:[a-z0-9-]+\}\}/g, esc(day))
    .replace(/(<nav class="endnav"[^>]*>[\s\S]*?)(<div class="prevnext">)/, (m, head, pn) => head + related + pn);
  const ymd = String(dates.modified).replace(/-/g, '/');
  const scholar = `<meta name="citation_title" content="${esc(ch.title)}">
<meta name="citation_author" content="Sharma, Yashvardhan">
<meta name="citation_date" content="${esc(ymd)}">
<meta name="citation_publisher" content="${SITE}">
<meta name="citation_language" content="en">
<meta name="citation_public_url" content="${esc(url)}">
<meta name="citation_fulltext_html_url" content="${esc(url)}">`;

  const ld = {
    '@context': 'https://schema.org', '@type': 'Article', headline: ch.title, description: metaDescription,
    url, mainEntityOfPage: url, image, inLanguage: 'en', datePublished: dates.published, dateModified: dates.modified,
    author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    publisher: { '@type': 'Organization', name: SITE, url: BASE },
    isPartOf: { '@type': 'WebSite', name: SITE, url: BASE },
  };
  const hasVideo = /<video /.test(main);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle(p))}</title>
<meta name="description" content="${esc(metaDescription)}">
<link rel="canonical" href="${esc(url)}">
<meta name="author" content="${AUTHOR.name}">
${scholar}
${shareTags(p, versions)}
${ICONS}
<meta name="color-scheme" content="light dark">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
${THEME_JS}
<style>${css}${EXTRA_CSS}</style>
${SITE_CONFIG.analytics ? `<script async src="https://gc.zgo.at/count.js" data-goatcounter="${esc(SITE_CONFIG.analytics)}"></script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${MASTHEAD}
<main id="main" class="page page--chapter">
${main}
<footer class="site-footer">${footerKey}</footer>
</main>
${ctx.CITE_JS ? `<script>${ctx.CITE_JS}</script>` : ''}
${ctx.FIG_JS ? `<script>${ctx.FIG_JS}</script>` : ''}
<script>${RAIL_JS}</script>
${hasVideo ? `<script>(function(){var t=document.documentElement.getAttribute('data-theme');if(t!=='dark')return;[].forEach.call(document.querySelectorAll('video[data-media]'),function(v){var b=v.getAttribute('data-media');v.poster=b+'-dark-end.jpg';v.src=b+'-dark.mp4';});})();
/* the print still loads lazily; a browser that does not fetch lazy images for print is told to now */
window.addEventListener('beforeprint',function(){[].forEach.call(document.querySelectorAll('img.anim-still[loading="lazy"]'),function(i){i.loading='eager';});});</script>` : ''}
</body>
</html>
`;
}

module.exports = function (ctx) {
  const { root, fs, path, warn } = ctx;
  const pages = manifest(root);
  const dist = path.join(root, 'dist');
  const versions = cardVersions(root, fs, path);
  let css = '';
  try { css = minCSS(fs.readFileSync(path.join(root, 'build', 'assets', 'chapter-page.css'), 'utf8')); } catch (e) { warn('chapter pages: build/assets/chapter-page.css is missing, so they ship unstyled'); }
  // the chapter page's own sheet, shared with The Chain in the app (src/modules/chapter.css), after the readable pages' common one
  let chCSS = '';
  try { chCSS = minCSS(fs.readFileSync(path.join(root, 'src', 'modules', 'chapter.css'), 'utf8')); } catch (e) { warn('chapter pages: src/modules/chapter.css is missing'); }
  const byId = new Map((ctx.all || []).map((c) => [c.id, c]));
  // the deck that ends Start here (data/flashcards.json "intro"), for /intro/: each answer links to its chapter's readable page
  const introDeck = (ctx.flashcards || {}).intro;
  const introCards = introDeck && Array.isArray(introDeck.cards) ? introDeck.cards.filter((c) => c.q && c.a) : [];
  const introReview = introCards.length ? reviewSection(introCards, (c) => {
    const ch = byId.get(c.chapter);
    return ch ? ` <a href="../${esc(ch.id)}/">Read: ${esc(ch.title)}</a>` : '';
  }) : '';
  ctx.readablePages = []; // build.js lists these in the sitemap
  // the four views that have a real page of their own (build/modules/reference-pages.js, which runs first, writes and lists them)
  const written = new Set((ctx.referencePages || []).map((k) => k.replace(/\//g, '')));
  for (const p of pages) {
    if (p.kind === 'view' && written.has(p.slug)) continue;
    const dir = path.join(dist, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    const ch = p.kind === 'chapter' ? byId.get(p.slug) : null;
    let html;
    if (ch && ch.rendered) {
      html = readableHTML(p, ch, ctx, versions, css + chCSS);
      if (/<button\b/.test(html)) warn(`chapter page ${p.slug}: a button from the app survived into the static page`);
      ctx.readablePages.push(p.slug);
    } else {
      if (p.kind === 'chapter') warn(`chapter page ${p.slug}: the chapter was not rendered, so its link only forwards to the main page`);
      html = p.slug === 'intro' && introReview ? introHTML(p, versions, css, introReview) : pageHTML(p, versions);
    }
    fs.writeFileSync(path.join(dir, 'index.html'), keepRanges(html));
  }
  // the plain stills of the other chapters (qa/redesign/stills.js), copied as spec-<id>.webp
  for (const id of Object.keys(ctx.stillSizes || {})) {
    const from = path.join(root, 'build', 'assets', 'specimens', id + '.webp');
    if (fs.existsSync(from)) { fs.mkdirSync(path.join(dist, 'media'), { recursive: true }); fs.copyFileSync(from, path.join(dist, 'media', 'spec-' + id + '.webp')); }
  }
  // the annotated stills the readable pages show in place of the live specimen (data/specimen-parts.json "still")
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
// for the reference pages (build/modules/reference-pages.js): the same head, tags, card and masthead as the chapter pages
Object.assign(module.exports, { SITE, AUTHOR, FONTS, ICONS, MASTHEAD, masthead, THEME_JS, minCSS, pageTitle, shareTags, cardVersions, cardURL, describe });
