/* SOCIAL: one real URL per chapter and per view, so a pasted link unfurls with its own title, text and card.

   Chapters: dist/<chapter>/index.html is the chapter itself as a static, readable page, for search engines,
   citation and anyone who arrives from a shared link. It is assembled from the very HTML the main page prints
   (build.js keeps it on ch.rendered: In plain terms, In short, the chokepoint card and the prose, before the
   glossary buttons go in), so the two never drift. What needs the app is turned into what a static page can
   carry: an animation becomes its video with controls and its steps as text, the specimen becomes its caption,
   the flashcards become questions whose answers open in place, and the card's glossary buttons become plain
   tags. It has no redirect: a button opens the interactive chapter at <site>/#<chapter>. Its canonical URL is
   its own, and build.js lists it in the sitemap (ctx.readablePages). Styles: build/assets/chapter-page.css.

   Views (/chips/, /suppliers/, /export-controls/, /glossary/, /home/, /intro/, /chain/): a small static page
   with the title, description, canonical, Open Graph and Twitter tags and one paragraph, then a meta refresh
   and a location.replace to the hash route on the main page. Unfurlers read the tags; people are redirected.

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
const BASE = SITE_CONFIG.url;
const SITE = 'Chip Supply Chain';
const AUTHOR = { name: 'Yashvardhan Sharma', url: 'https://www.linkedin.com/in/yashvardhan07/' };
// the site's own faces, without the two the chapter page does not use (Jost for the specimen caption, Plex Mono for code)
const FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0,0&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,400&family=Instrument+Sans:wght@400..700&display=swap';
const SUBWORD = { 'Very hard': 'Very hard to substitute', Hard: 'Hard to substitute', Moderate: 'Moderately hard to substitute', Easy: 'Easy to substitute' };
const TILE = { 16: 'The economics', 17: 'The contest' }; // what the chapter tile says for the two chapters that are not stages

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
      // the readable page's own meta description (search results), from the chapter's one-line summary; og/twitter keep `description`
      metaDescription: searchDescription(c.oneLiner || c.plain),
    });
  }

  let suppliers = [];
  try { suppliers = JSON.parse(fs.readFileSync(path.join(root, 'data', 'suppliers.json'), 'utf8')); } catch (e) { /* the count is decorative */ }
  const walkWords = chapters.reduce((a, c) => a + wordCount(c.plain), 0);
  const mins = Math.max(1, Math.round(walkWords / 230));

  const views = [
    // the home title is the site's own hero ("How AI chips are made"); the unfurl <title> and og:title still carry the site name (pageHTML)
    { slug: 'home', route: '', eyebrow: 'The AI chip supply chain', title: 'How AI chips are made', line: 'The AI chip supply chain, stage by stage: who makes each part, how concentrated each stage is, and what a substitute would cost.', description: 'How AI chips are made, and who controls each stage. The supply chain stage by stage: who makes each part, how concentrated each stage is, and what a substitute would cost.' },
    { slug: 'intro', route: '#/intro', eyebrow: `${SITE} · Start here`, title: 'How AI chips are made', line: `An introduction to the entire supply chain in ${mins} minutes.` },
    { slug: 'chain', route: '#/chain', eyebrow: `${SITE} · The Chain`, title: 'The Chain', line: 'Every stage of the supply chain, and who controls it.', description: `Every stage of the supply chain, and who controls it. ${chapters.length} chapters, from chip design to the data center.` },
    { slug: 'chips', route: '#/landscape', eyebrow: `${SITE} · AI Chips`, title: 'AI Chips', line: 'The chips that train and run AI models, from the A100 of 2020 to the parts shipping in 2026.', description: 'The chips that train and run AI models, from the A100 of 2020 to the parts shipping in 2026. Each entry names the foundry, process node, memory supplier and packaging plant behind the chip.' },
    { slug: 'suppliers', route: '#/suppliers', eyebrow: `${SITE} · Suppliers`, title: 'Suppliers', line: `What each of the ${suppliers.length || 220} firms makes, where it sits, and how hard it would be to replace.` },
    { slug: 'export-controls', route: '#/controls', eyebrow: `${SITE} · Export Controls`, title: 'Export Controls', line: "Every rule since 2018, what can still be sold to China, and each firm's China sales." },
    { slug: 'glossary', route: '#/glossary', eyebrow: `${SITE} · Glossary`, title: 'Glossary', line: 'Every term, firm, chip and country, with the passages that use them.' },
  ];
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

const pageTitle = (p) => (p.kind === 'chapter' ? `${p.title} · ${SITE}` : (p.slug === 'home' ? SITE : `${p.title} · ${SITE}`));
// what an unfurler reads: the same tags on a chapter's readable page and on a view's forwarding page
function shareTags(p, versions) {
  const url = BASE + p.slug + '/';
  const image = cardURL(p.slug, versions);
  const title = p.kind === 'chapter' ? p.title : pageTitle(p);
  return `<meta property="og:site_name" content="${SITE}">
<meta property="og:type" content="${p.kind === 'chapter' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.eyebrow + '. ' + p.title + '. ' + p.line)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${esc(image)}">`;
}
const ICONS = `<link rel="icon" href="../favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">`;

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
body{margin:0;background:#f7f6f2;color:#14181f;font:18.5px/1.58 "Source Serif 4",Georgia,serif}
main{max-width:34em;margin:0 auto;padding:48px 16px}
.eyebrow{font:500 11px/1.4 "Instrument Sans","Helvetica Neue",Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#5c636d;margin:0 0 12px}
h1{font:400 34px/1.1 Fraunces,Georgia,serif;margin:0 0 20px}
a{color:#7a1f2b}
@media (prefers-color-scheme:dark){body{background:#14171c;color:#ece9e2}.eyebrow{color:#939aa3}a{color:#e25c57}}
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

/* ---------------- the readable chapter page ---------------- */
const BANDS = { Extreme: 4, High: 3, Moderate: 2, Low: 1 }; // as build.js ranks them for the chain's bars
const minCSS = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};])\s*/g, '$1').replace(/;}/g, '}').trim();
const textOf = (html) => String(html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// The main page's headings start at h3 under the chapter's h2; here the chapter title is the h1, so each moves up one level.
const levelUp = (html) => String(html || '').replace(/<(\/?)h([3-6])(?=[\s>])/g, (m, s, n) => `<${s}h${n - 1}`);

// A footnote number opens its source, as on the main page; the hover card becomes the link's title (title, publisher, date).
// The space the Markdown leaves before a citation is dropped, so the number sits on its word as a footnote does in print,
// and the number carries brackets that take no room on screen (.cite .br) but stay in the text: copied, quoted or read
// by a search engine, "in 2025" plus footnote 13 comes out as "in 2025[13]", never "202513".
const plainCites = (html) => html.replace(/\s+(?=<sup class="cite">)/g, '').replace(/<sup class="cite"><a href="([^"]*)"[^>]*?aria-label="Source (\d+): ([^"]*)">\d+<\/a><\/sup>/g,
  (m, href, n, label) => `<sup class="cite"><a href="${href}" target="_blank" rel="noopener" title="${label}" aria-label="Source ${n}: ${label}"><span class="br">[</span>${n}<span class="br">]</span></a></sup>`);

// Glossary buttons need the app's popover; here they are plain text. The card's two rating tags keep their look and
// carry their one-line definition as a title.
const plainTerms = (html) => String(html || '').replace(/<button type="button" class="gl-term\b\s*([^"]*)"([^>]*)>([\s\S]*?)<\/button>/g, (m, cls, attrs, inner) => {
  const band = (attrs.match(/\bdata-band="([^"]*)"/) || [])[1];
  const note = (attrs.match(/\bdata-note="([^"]*)"/) || [])[1];
  return `<span${cls.trim() ? ` class="${cls.trim()}"` : ''}${band ? ` data-band="${band}"` : ''}${note ? ` title="${note}"` : ''}>${inner}</span>`;
});

// An explainer animation: the main page plays it in time with its captions; here it is the video, with controls and
// nothing fetched until it is played, the last frame as its poster, and every step written out underneath.
const staticAnimations = (html) => html.replace(/<figure class="figure figure--anim"( id="[^"]*")?>([\s\S]*?)<\/figure>/g, (m, id, inner) => {
  const src = (inner.match(/\bdata-src="([^"]*)"/) || [])[1];
  if (!src) return m;
  const title = (inner.match(/<p class="fig-title">[\s\S]*?<\/p>/) || [''])[0];
  const ratio = inner.match(/aspect-ratio:(\d+)\/(\d+)/);
  const steps = (inner.match(/<ol class="anim-transcript">([\s\S]*?)<\/ol>/) || [])[1] || '';
  const notes = (inner.match(/<p class="fig-source">[\s\S]*?<\/p>/g) || []).join('');
  const base = '../' + src;
  const size = ratio ? ` width="${ratio[1]}" height="${ratio[2]}"` : '';
  return `<figure class="figure figure--anim"${id || ''}>${title}<div class="anim-frame"><video controls preload="none" playsinline muted${size} poster="${base}-light-end.jpg" src="${base}-light.mp4" data-media="${base}" aria-label="Animation: ${textOf(title)}"></video></div>${steps ? `<ol class="anim-steps">${steps}</ol>` : ''}${notes}</figure>`;
});

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

function readableHTML(p, ch, ctx, versions, css) {
  const { stages, flashcards, SPECIMEN_NAME, tierTag, sourceLine, builtOn, builtStr } = ctx;
  const r = ch.rendered, m = ch.meta || {};
  const url = BASE + p.slug + '/', app = BASE + '#' + ch.id, image = cardURL(p.slug, versions);
  const seq = ctx.chapters.concat(ctx.geo ? [ctx.geo] : []);
  const at = seq.findIndex((c) => c.id === ch.id), prev = seq[at - 1], next = seq[at + 1];
  const si = stages.findIndex((c) => c.id === ch.id);
  const fc = flashcards[ch.id];
  const cards = fc && Array.isArray(fc.cards) ? fc.cards.filter((c) => c.q && c.a) : [];

  const eyebrow = `<b>Chapter ${pad(ch.number)}</b> · ${si >= 0 ? `Stage ${si + 1} of ${stages.length}` : (TILE[ch.number] || '')}`.replace(/ · $/, '');
  const adds = ['a 3D model', 'glossary definitions', cards.length ? 'flashcards' : ''].filter(Boolean);
  const note = `The interactive chapter adds ${adds.length > 1 ? adds.slice(0, -1).join(', ') + ' and ' + adds[adds.length - 1] : adds[0]}.`;
  const cta = (cls) => `<div class="cta${cls}"><a class="btn" href="${esc(app)}">Open the interactive chapter <span aria-hidden="true">→</span></a><p class="cta-note">${note}</p></div>`;

  // where the stage sits: the fifteen stages, each bar as tall as its concentration, each a link to its own page
  const track = si < 0 ? '' : `<nav class="track" aria-label="The ${stages.length} stages of the chain"><ol>${stages.map((c) => {
    const band = (c.meta.card || {}).concentration || '';
    return `<li data-band="${BANDS[band] || 0}"${c.id === ch.id ? ' aria-current="page"' : ''}><a href="../${esc(c.id)}/" aria-label="Chapter ${pad(c.number)}: ${esc(c.title)}${band ? ', ' + esc(band) + ' concentration' : ''}" title="${pad(c.number)} ${esc(c.title)}${band ? ' · ' + esc(band) + ' concentration' : ''}"><span class="bar"><i></i></span><span class="n">${pad(c.number)}</span></a></li>`;
  }).join('')}</ol><p class="track-foot"><span><b>${esc(ch.title)}</b>, stage ${si + 1} of ${stages.length}</span><span>${stages[si + 1] ? `Next stage: <a href="../${esc(stages[si + 1].id)}/">${pad(stages[si + 1].number)} ${esc(stages[si + 1].title)}</a>` : 'Last stage in the chain'}</span></p></nav>`;

  const specimen = m.specimen || 'wafer';
  const specimenHTML = m.specimenCaption ? `<aside class="specimen" aria-label="Specimen"><span class="label">Specimen · ${esc(SPECIMEN_NAME[specimen] || specimen.replace(/-/g, ' '))}</span><p>${esc(m.specimenCaption)}</p><a href="${esc(app)}">See it in 3D in the interactive chapter</a></aside>` : '';

  const review = cards.length ? `<section class="review" aria-labelledby="review-questions"><h2 class="label" id="review-questions">Review questions</h2><p class="review-note">Open a question to see its answer.</p>${cards.map((c) => {
    const anchor = c.section ? `${ch.id}--${ctx.slug(c.section)}` : '';
    const more = anchor ? ` <a href="#${esc(anchor)}">Reread: ${esc(c.section)}</a>` : '';
    return `<details><summary>${esc(c.q)}</summary><div class="answer"><p><b>${esc(c.a)}</b></p>${c.why || more ? `<p class="why">${esc(c.why || '')}${more}</p>` : ''}</div></details>`;
  }).join('')}</section>` : '';

  const pn = (c, dir, label) => (c ? `<a class="pn ${dir}" href="../${esc(c.id)}/"><span class="label">${label}</span><span class="t"><span class="n">${pad(c.number)}</span>${esc(c.title)}</span></a>` : '');
  const prevnext = prev || next ? `<div class="prevnext">${pn(prev, 'prev', 'Previous chapter')}${pn(next, 'next', 'Next chapter')}</div>` : '';

  const sources = ch.cites.length ? `<section class="sources" aria-labelledby="sources"><h2 class="label" id="sources">Sources (${ch.cites.length})</h2><ol>${ch.cites.map((c, k) => `<li id="source-${k + 1}">${tierTag(c.url)}${sourceLine(c.url)}</li>`).join('')}</ol></section>` : '';

  const article = `<article>
<header class="ch-head">
<p class="eyebrow">${eyebrow}</p>
<h1 class="ch-title">${esc(ch.title)}</h1>
${m.oneLiner ? `<p class="ch-lede">${esc(m.oneLiner)}</p>` : ''}
<p class="ch-meta">${ch.words.toLocaleString('en-US')} words / ${r.mins} min</p>
${cta('')}
</header>
${track}
${r.plain || ''}
${r.inShort ? `<section class="inshort"><h2>In short</h2>${levelUp(r.inShort)}</section>` : ''}
${plainTerms(r.plate)}
${specimenHTML}
<div class="prose">
${staticAnimations(levelUp(r.prose))}
</div>
${review}
<nav class="endnav" aria-label="After the chapter">${cta(' cta--end')}${prevnext}</nav>
${sources}
</article>`;
  const main = fixLinks(plainTerms(plainCites(article)), new Set(seq.map((c) => c.id)));
  // the day this chapter's text last changed (build.js keeps a hash of `main` per page), and the day it first appeared;
  // the footer's "Updated" day says the same, in the main page's wording
  const today = builtOn.toISOString().slice(0, 10);
  const dates = ctx.pageDate ? ctx.pageDate('/' + p.slug + '/', main, ch.file) : { published: today, modified: today };
  const footerKey = ctx.dayStr ? ctx.footerKey.split(`Updated ${builtStr}`).join(`Updated ${ctx.dayStr(dates.modified)}`) : ctx.footerKey;

  const ld = {
    '@context': 'https://schema.org', '@type': 'Article', headline: ch.title, description: p.metaDescription || p.description,
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
<meta name="description" content="${esc(p.metaDescription || p.description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="author" content="${AUTHOR.name}">
${shareTags(p, versions)}
${ICONS}
<meta name="color-scheme" content="light dark">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<script>(function(){try{var q=/[?&]theme=(light|dark)/.exec(location.search);var t=q?q[1]:localStorage.getItem('cp-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<style>${css}</style>
${SITE_CONFIG.analytics ? `<script async src="https://gc.zgo.at/count.js" data-goatcounter="${esc(SITE_CONFIG.analytics)}"></script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="masthead"><a class="wordmark" href="../">Chip Supply Chain</a><nav aria-label="Site"><a href="../#/chain">The Chain</a><a href="../#/glossary">Glossary</a></nav></header>
<main id="main" class="page">
${main}
<footer class="site-footer">${footerKey}</footer>
</main>
${hasVideo ? `<script>(function(){var t=document.documentElement.getAttribute('data-theme');if(t!=='dark'&&(t||!(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)))return;[].forEach.call(document.querySelectorAll('video[data-media]'),function(v){var b=v.getAttribute('data-media');v.poster=b+'-dark-end.jpg';v.src=b+'-dark.mp4';});})();</script>` : ''}
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
  const byId = new Map((ctx.all || []).map((c) => [c.id, c]));
  ctx.readablePages = []; // build.js lists these in the sitemap
  for (const p of pages) {
    const dir = path.join(dist, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    const ch = p.kind === 'chapter' ? byId.get(p.slug) : null;
    let html;
    if (ch && ch.rendered) {
      html = readableHTML(p, ch, ctx, versions, css);
      if (/<button\b/.test(html)) warn(`chapter page ${p.slug}: a button from the app survived into the static page`);
      ctx.readablePages.push(p.slug);
    } else {
      if (p.kind === 'chapter') warn(`chapter page ${p.slug}: the chapter was not rendered, so its link only forwards to the main page`);
      html = pageHTML(p, versions);
    }
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  // the cards, rendered by build/cards.py into build/assets/cards/; the build only copies them
  const src = path.join(root, 'build', 'assets', 'cards');
  const out = path.join(dist, 'cards');
  fs.mkdirSync(out, { recursive: true });
  const have = fs.existsSync(src) ? fs.readdirSync(src).filter((f) => f.endsWith('.png')) : [];
  for (const f of have) fs.copyFileSync(path.join(src, f), path.join(out, f));
  const missing = pages.filter((p) => !have.includes(p.slug + '.png')).map((p) => p.slug);
  if (missing.length) warn(`social cards missing (run python3 build/cards.py): ${missing.join(', ')}`);
  return { HOME_CARD: cardURL('home', versions) };
};
module.exports.manifest = manifest;
module.exports.pageHTML = pageHTML;
module.exports.BASE = BASE;
