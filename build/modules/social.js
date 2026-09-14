/* SOCIAL: one real URL per chapter and per view, so a pasted link unfurls with its own title, text and card.

   dist/<slug>/index.html is a small static page: title, description, canonical, Open Graph and Twitter
   tags, the chapter's plain paragraph as visible text, then a meta refresh and a location.replace to the
   hash route on the main page. Unfurlers read the tags; people are redirected. The card images come from
   build/assets/cards/<slug>.png (rendered by `python3 build/cards.py`, not on every build) and are copied
   to dist/cards/ here.

   manifest() is the single list of pages, shared with build/cards.py (which calls it through node), so the
   card and the page never disagree about a title or a line. It reads content/*.md itself so it needs no
   build context. Nothing here fills a template placeholder; the module returns {}. */

const BASE = require('../site.js').url;
const SITE = 'Chip Supply Chain';
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
      description: describe(c.plain), body: c.plain, route: '#' + c.id, linkText: 'Read the chapter',
    });
  }

  let suppliers = [];
  try { suppliers = JSON.parse(fs.readFileSync(path.join(root, 'data', 'suppliers.json'), 'utf8')); } catch (e) { /* the count is decorative */ }
  const walkWords = chapters.reduce((a, c) => a + wordCount(c.plain), 0);
  const mins = Math.max(1, Math.round(walkWords / 230));

  const views = [
    { slug: 'home', route: '', eyebrow: 'The AI chip supply chain', title: SITE, line: 'How AI chips are made, and who controls each stage.', description: 'How AI chips are made, and who controls each stage. The supply chain stage by stage: who makes each part, how concentrated each stage is, and what a substitute would cost.' },
    { slug: 'intro', route: '#/intro', eyebrow: `${SITE} · Start here`, title: 'How AI chips are made', line: `An introduction to the entire supply chain in ${mins} minutes.` },
    { slug: 'chain', route: '#/chain', eyebrow: `${SITE} · The Chain`, title: 'The Chain', line: 'Every stage of the supply chain, and who controls it.', description: `Every stage of the supply chain, and who controls it. ${chapters.length} chapters, from chip design to the data center.` },
    { slug: 'chips', route: '#/landscape', eyebrow: `${SITE} · AI Chips`, title: 'AI Chips', line: 'The chips that train and run AI models, from the A100 of 2020 to the parts shipping in 2026.', description: 'The chips that train and run AI models, from the A100 of 2020 to the parts shipping in 2026, with the foundry, process node, memory supplier and packaging plant behind each one.' },
    { slug: 'suppliers', route: '#/suppliers', eyebrow: `${SITE} · Suppliers`, title: 'Suppliers', line: `What each of the ${suppliers.length || 220} firms makes, where it sits, and how hard it would be to replace.` },
    { slug: 'export-controls', route: '#/controls', eyebrow: `${SITE} · Export Controls`, title: 'Export Controls', line: "Every move since 2018, what can still flow to China, and each firm's China sales." },
    { slug: 'glossary', route: '#/glossary', eyebrow: `${SITE} · Glossary`, title: 'Glossary', line: 'Every term, firm, chip and country, with the passages that use them.' },
  ];
  for (const v of views) pages.push({ kind: 'view', body: v.description || v.line, linkText: 'Open the page', ...v, description: describe(v.description || v.line) });
  return pages;
}

function pageHTML(p) {
  const url = BASE + p.slug + '/';
  const target = BASE + p.route;
  const image = BASE + 'cards/' + p.slug + '.png';
  const title = p.kind === 'chapter' ? `${p.title} · ${SITE}` : (p.slug === 'home' ? SITE : `${p.title} · ${SITE}`);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${esc(target)}">
<meta property="og:site_name" content="${SITE}">
<meta property="og:type" content="${p.kind === 'chapter' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(p.kind === 'chapter' ? p.title : title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.eyebrow + '. ' + p.title + '. ' + p.line)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.kind === 'chapter' ? p.title : title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${esc(image)}">
<!-- the tags above are what an unfurler reads; a person is sent on to the page itself -->
<meta http-equiv="refresh" content="0;url=${esc(target)}">
<script>location.replace(${JSON.stringify(target)});</script>
<style>
body{margin:0;background:#edeff0;color:#12161a;font:18px/1.5 "Newsreader","Source Serif 4",Georgia,"Times New Roman",serif}
main{max-width:34em;margin:0 auto;padding:48px 24px}
.eyebrow{font:500 12px/1.4 "IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#5b646d;margin:0 0 12px}
h1{font:600 32px/1.1 "IBM Plex Sans Condensed","Helvetica Neue",Arial,sans-serif;margin:0 0 20px}
a{color:#7a5406}
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

module.exports = function (ctx) {
  const { root, fs, path, warn } = ctx;
  const pages = manifest(root);
  const dist = path.join(root, 'dist');
  for (const p of pages) {
    const dir = path.join(dist, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), pageHTML(p));
  }
  // the cards, rendered by build/cards.py into build/assets/cards/; the build only copies them
  const src = path.join(root, 'build', 'assets', 'cards');
  const out = path.join(dist, 'cards');
  fs.mkdirSync(out, { recursive: true });
  const have = fs.existsSync(src) ? fs.readdirSync(src).filter((f) => f.endsWith('.png')) : [];
  for (const f of have) fs.copyFileSync(path.join(src, f), path.join(out, f));
  const missing = pages.filter((p) => !have.includes(p.slug + '.png')).map((p) => p.slug);
  if (missing.length) warn(`social cards missing (run python3 build/cards.py): ${missing.join(', ')}`);
  return {};
};
module.exports.manifest = manifest;
module.exports.pageHTML = pageHTML;
module.exports.BASE = BASE;
