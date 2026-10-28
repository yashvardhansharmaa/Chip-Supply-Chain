#!/usr/bin/env node
/* Search check for the chapter pages (27 Oct 2026). Reads the built dist/ and fails (exit 1) when a chapter's page,
 * dist/<chapter>/index.html (the full chapter since 28 Oct 2026; a static readable copy before), is missing what a search
 * engine reads, or says something its page does not:
 *   - the chapter itself: its article, once, and no other chapter's;
 *   - one <h1>, which is the chapter's title, and headings that never skip a level going down. The interactive chapter's
 *     sections are h3 and h4, as they were under The Chain's h2 title (the styles and the print path go by those levels), so
 *     the h1 counts as the level above them;
 *   - one <title>, one meta description and one canonical link, the canonical being the page's own address;
 *   - the Open Graph and Twitter tags, og:url the canonical;
 *   - rel=prev and rel=next to the chapters before and after it in reading order;
 *   - JSON-LD that parses, with an Article whose headline is the h1, whose url, @id and page are the canonical, whose description
 *     is the meta description, whose image is og:image, whose dateModified is the page's "Updated" day and its sitemap lastmod,
 *     and a BreadcrumbList Home > The Chain > the chapter, numbered from 1 and ending on the canonical;
 *   - the specimen's figure and its caption (the drawing is live, so the still the readable page showed is gone);
 *   - its sitemap entry, whose lastmod is the page's date in build/page-dates.json.
 * The contents page, /supply-chain/ (28 Oct 2026): one h1, Supply Chain; its title, description and canonical; the share tags
 * with the chain's card; a CollectionPage whose ItemList is the chapter pages in reading order; its sitemap entry and date.
 * /chain/ forwards to it, with its canonical.
 * And for the site: the sitemap lists each address once, leaves out the forwarding pages (a merged chapter's old address and the
 * view pages /home/, /intro/, /chain/), the book (/book/, for print) and the PDFs; robots.txt names the sitemap, blocks no
 * chapter and blocks the book, which is also noindex; the home page's JSON-LD parses, its HTML, before any script runs, links
 * every chapter's page by href, and it holds no chapter.
 * The length of each <title> (with " · Chip Supply Chain") and description is checked against a hard range (30 to 70 and 70 to
 * 170 characters, a failure outside it) and the range search results show whole (50 to 60 and 120 to 160, a note outside it;
 * --strict makes a note a failure). The words are the owner's (build/page-titles.json), so a note is a question for the owner.
 *   node qa/scripts/check-seo.js [--strict] */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const dist = path.join(root, 'dist');
const strict = process.argv.includes('--strict');
const SITE = require(path.join(root, 'build', 'site.js'));
const STAGES = require(path.join(root, 'build', 'stages.js'));
const RETIRED = require(path.join(root, 'build', 'retired-chapters.js'));
const BASE = SITE.url;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const errors = [], notes = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const note = (page, msg) => notes.push(`${page}: ${msg}`);
const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return null; } };
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '' };
const decode = (s) => String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(/^#x/i.test(e) ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] != null ? ENT[e.toLowerCase()] : m));
const text = (html) => decode(String(html).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const attr = (tag, name) => { const m = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag); return m ? decode(m[1]) : null; };
const metas = (head, key, val) => (head.match(/<meta\b[^>]*>/gi) || []).filter((t) => attr(t, key) === val).map((t) => attr(t, 'content'));
const links = (head, rel) => (head.match(/<link\b[^>]*>/gi) || []).filter((t) => (attr(t, 'rel') || '').split(/\s+/).includes(rel)).map((t) => attr(t, 'href'));
const dayStr = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const ISO_DAY = /^\d{4}-\d\d-\d\d$/;

const chapters = STAGES.fromContent(root); // { id, number, stage }, in reading order
let dates = {};
try { dates = JSON.parse(read(path.join(root, 'build', 'page-dates.json'))); } catch (e) { fail('build/page-dates.json', 'does not parse'); }

// the sitemap and robots.txt
const sitemap = read(path.join(dist, 'sitemap.xml')) || '';
if (!sitemap) fail('sitemap.xml', 'missing; run node build/build.js');
const entries = [...sitemap.matchAll(/<url>\s*<loc>([^<]*)<\/loc>\s*(?:<lastmod>([^<]*)<\/lastmod>)?\s*<\/url>/g)].map((m) => ({ loc: decode(m[1]), lastmod: m[2] || '' }));
const byLoc = new Map();
entries.forEach((e) => { if (byLoc.has(e.loc)) fail('sitemap.xml', `lists ${e.loc} twice`); byLoc.set(e.loc, e); });
entries.forEach((e) => {
  if (!e.loc.startsWith(BASE)) fail('sitemap.xml', `${e.loc} is not on ${BASE}`);
  if (!ISO_DAY.test(e.lastmod)) fail('sitemap.xml', `${e.loc} has no lastmod day (${e.lastmod || 'none'})`);
  if (/\.pdf$/i.test(e.loc)) fail('sitemap.xml', `lists a PDF, ${e.loc}`);
});
const forwarding = Object.keys(RETIRED.chapters || {}).concat(['home', 'intro', 'chain', 'book']);
forwarding.forEach((id) => { if (byLoc.has(BASE + id + '/')) fail('sitemap.xml', `lists ${BASE + id}/, which only forwards`); });
const robots = read(path.join(dist, 'robots.txt')) || '';
if (!robots) fail('robots.txt', 'missing');
if (!new RegExp(`^Sitemap: ${BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}sitemap\\.xml$`, 'm').test(robots)) fail('robots.txt', 'does not name the sitemap');
const disallow = [...robots.matchAll(/^Disallow:\s*(\S*)\s*$/gm)].map((m) => m[1]).filter(Boolean);

// each chapter's page
const ranges = (page, kind, s, hard, soft) => {
  const n = [...s].length;
  if (n < hard[0] || n > hard[1]) fail(page, `${kind} is ${n} characters, outside ${hard[0]} to ${hard[1]}: "${s}"`);
  else if (n < soft[0] || n > soft[1]) (strict ? fail : note)(page, `${kind} is ${n} characters, outside ${soft[0]} to ${soft[1]}: "${s}"`);
};
chapters.forEach((c, i) => {
  const page = `/${c.id}/`, url = BASE + c.id + '/';
  const html = read(path.join(dist, c.id, 'index.html'));
  if (!html) { fail(page, 'no page in dist/'); return; }
  const head = (html.match(/<head>([\s\S]*?)<\/head>/i) || [])[1] || '';
  const body = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [])[1] || '';

  // the chapter, alone
  const arts = [...body.matchAll(/<article class="chapter[^"]*" id="([^"]+)"/g)].map((m) => m[1]);
  if (arts.join() !== c.id) fail(page, `holds the articles ${JSON.stringify(arts)}, not its own alone`);

  // headings (the title's words for screen readers, "Chapter 4: ", are not its headline)
  const hs = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ n: +m[1], t: text(m[2].replace(/<span class="sr-only">[\s\S]*?<\/span>/g, '')) }));
  const h1s = hs.filter((h) => h.n === 1);
  if (h1s.length !== 1) fail(page, `has ${h1s.length} h1 headings`);
  const h1 = h1s[0] ? h1s[0].t : '';
  if (hs.length && hs[0].n !== 1) fail(page, `its first heading is an h${hs[0].n}, not the h1`);
  const level = (n) => (n === 1 ? 2 : n); // the h1 stands where The Chain's h2 title stood, over the h3 sections
  for (let k = 1; k < hs.length; k++) if (level(hs[k].n) > level(hs[k - 1].n) + 1) fail(page, `heading "${hs[k].t}" is an h${hs[k].n} under an h${hs[k - 1].n}`);
  if (hs.some((h) => h.n === 2)) fail(page, 'has an h2, a level the chapter does not use');

  // title, description, canonical, sequence
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((m) => text(m[1]));
  if (titles.length !== 1) fail(page, `has ${titles.length} <title> elements`);
  const descs = metas(head, 'name', 'description');
  if (descs.length !== 1) fail(page, `has ${descs.length} meta descriptions`);
  const title = titles[0] || '', desc = descs[0] || '';
  if (title) ranges(page, 'title', title, [30, 70], [50, 60]);
  if (desc) ranges(page, 'description', desc, [70, 170], [120, 160]);
  const canon = links(head, 'canonical');
  if (canon.length !== 1) fail(page, `has ${canon.length} canonical links`);
  else if (canon[0] !== url) fail(page, `canonical is ${canon[0]}, not ${url}`);
  const prev = chapters[i - 1], next = chapters[i + 1];
  const pl = links(head, 'prev'), nl = links(head, 'next');
  if (JSON.stringify(pl) !== JSON.stringify(prev ? [BASE + prev.id + '/'] : [])) fail(page, `rel=prev is ${JSON.stringify(pl)}, expected ${prev ? BASE + prev.id + '/' : 'none'}`);
  if (JSON.stringify(nl) !== JSON.stringify(next ? [BASE + next.id + '/'] : [])) fail(page, `rel=next is ${JSON.stringify(nl)}, expected ${next ? BASE + next.id + '/' : 'none'}`);
  if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(head)) fail(page, 'is marked noindex');

  // share tags
  const og = (k) => metas(head, 'property', 'og:' + k)[0] || '';
  const tw = (k) => metas(head, 'name', 'twitter:' + k)[0] || '';
  ['title', 'description', 'url', 'image', 'image:alt', 'type', 'site_name'].forEach((k) => { if (!og(k)) fail(page, `has no og:${k}`); });
  ['card', 'title', 'description', 'image', 'image:alt'].forEach((k) => { if (!tw(k)) fail(page, `has no twitter:${k}`); });
  if (og('url') && og('url') !== url) fail(page, `og:url is ${og('url')}, not the canonical`);
  if (og('type') && og('type') !== 'article') fail(page, `og:type is ${og('type')}, not article`);

  // the page's date: the head's "Updated <day>", the page-dates file and the sitemap must agree
  const d = dates[page] || {};
  if (!ISO_DAY.test(d.modified || '') || !ISO_DAY.test(d.published || '')) fail(page, 'has no dates in build/page-dates.json');
  const shown = (body.match(/<span class="label">Updated ([^<]+)<\/span>/) || [])[1] || '';
  if (d.modified && shown !== dayStr(d.modified)) fail(page, `shows "Updated ${shown}", but its date is ${d.modified}`);
  const sm = byLoc.get(url);
  if (!sm) fail(page, 'is not in the sitemap');
  else if (d.modified && sm.lastmod !== d.modified) fail(page, `sitemap lastmod is ${sm.lastmod}, but its date is ${d.modified}`);
  if (disallow.some((p) => page.startsWith(p) && p !== '/')) fail(page, 'is blocked in robots.txt');

  // JSON-LD
  const blocks = [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  if (!blocks.length) fail(page, 'has no JSON-LD');
  const nodes = [];
  blocks.forEach((b, k) => {
    let j; try { j = JSON.parse(b); } catch (e) { fail(page, `JSON-LD block ${k + 1} does not parse: ${e.message}`); return; }
    if (j['@context'] !== 'https://schema.org') fail(page, `JSON-LD block ${k + 1} has @context ${j['@context']}`);
    (Array.isArray(j['@graph']) ? j['@graph'] : [j]).forEach((n) => nodes.push(n));
  });
  const art = nodes.find((n) => n['@type'] === 'Article');
  if (!art) fail(page, 'JSON-LD has no Article');
  else {
    const want = {
      headline: h1, description: desc, url, '@id': url + '#article', datePublished: d.published, dateModified: d.modified, inLanguage: 'en',
      'mainEntityOfPage.@id': url, 'image.url': og('image'), 'author.name': 'Yashvardhan Sharma', 'publisher.name': 'Chip Supply Chain', 'isPartOf.url': BASE,
    };
    const get = (o, k) => k.split('.').reduce((v, p) => (v == null ? v : v[p]), o);
    Object.entries(want).forEach(([k, v]) => { const got = get(art, k); if (got !== v) fail(page, `Article ${k} is ${JSON.stringify(got)}, expected ${JSON.stringify(v)}`); });
    if (art.datePublished > art.dateModified) fail(page, 'Article was modified before it was published');
    if (!art.author || !/^https:\/\//.test(art.author.url || '')) fail(page, 'Article author has no url');
    if (!(art.about && art.about.name)) fail(page, 'Article has no about');
    if (art.headline && [...art.headline].length > 110) fail(page, 'Article headline is over 110 characters');
  }
  const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
  if (!bc) fail(page, 'JSON-LD has no BreadcrumbList');
  else {
    const items = bc.itemListElement || [];
    const names = items.map((x) => x.name), pos = items.map((x) => x.position);
    if (JSON.stringify(pos) !== JSON.stringify(items.map((x, k) => k + 1))) fail(page, `breadcrumb positions are ${JSON.stringify(pos)}`);
    if (JSON.stringify(names) !== JSON.stringify(['Home', 'Supply Chain', h1])) fail(page, `breadcrumb is ${JSON.stringify(names)}`);
    if (items[1] && items[1].item !== BASE + 'supply-chain/') fail(page, `breadcrumb's Supply Chain is ${items[1].item}, not the contents page`);
    if (items.length && items[items.length - 1].item !== url) fail(page, 'breadcrumb does not end on the canonical');
    if (items[0] && items[0].item !== BASE) fail(page, 'breadcrumb does not start at the home page');
  }

  // the specimen: its figure, where the live drawing goes, and its caption in the page's text
  if (!/<figure class="ch-spec\b[^>]*>[\s\S]*?<figcaption class="ch-spec-cap[^"]*"><span class="label">Specimen \d\d/.test(body)) fail(page, 'has no specimen figure with its caption');
});

// the contents page
{
  const page = '/supply-chain/', url = BASE + 'supply-chain/';
  const html = read(path.join(dist, 'supply-chain', 'index.html')) || '';
  if (!html) fail(page, 'missing; run node build/build.js');
  else {
    const head = (html.match(/<head>([\s\S]*?)<\/head>/i) || [])[1] || '', body = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [])[1] || '';
    const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
    if (h1s.join() !== 'Supply Chain') fail(page, `its h1 headings are ${JSON.stringify(h1s)}`);
    const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((m) => text(m[1])), descs = metas(head, 'name', 'description');
    if (titles.length !== 1 || descs.length !== 1) fail(page, `has ${titles.length} titles and ${descs.length} descriptions`);
    else { ranges(page, 'title', titles[0], [30, 70], [50, 60]); ranges(page, 'description', descs[0], [70, 170], [150, 160]); }
    const canon = links(head, 'canonical');
    if (canon.join() !== url) fail(page, `canonical is ${JSON.stringify(canon)}`);
    const og = (k) => metas(head, 'property', 'og:' + k)[0] || '';
    if (og('url') !== url) fail(page, `og:url is ${og('url')}`);
    if (!/\/cards\/chain\.png(\?v=\d+)?$/.test(og('image'))) fail(page, `og:image is ${og('image')}, not the chain's card`);
    ['title', 'description', 'image:alt'].forEach((k) => { if (!og(k)) fail(page, `has no og:${k}`); });
    if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(head)) fail(page, 'is marked noindex');
    const nodes = []; [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].forEach((m) => { try { const j = JSON.parse(m[1]); (j['@graph'] || [j]).forEach((x) => nodes.push(x)); } catch (e) { fail(page, 'JSON-LD does not parse'); } });
    const cp = nodes.find((x) => x['@type'] === 'CollectionPage'), list = nodes.find((x) => x['@type'] === 'ItemList');
    if (!cp || cp.url !== url || (cp.mainEntity || {})['@id'] !== (list || {})['@id']) fail(page, 'JSON-LD has no CollectionPage of the list at its address');
    const urls = list ? (list.itemListElement || []).map((x) => x.url) : [];
    if (JSON.stringify(urls) !== JSON.stringify(chapters.map((c) => BASE + c.id + '/'))) fail(page, `the ItemList is ${urls.length} addresses, not the ${chapters.length} chapter pages in order`);
    const d = dates[page] || {}, sm = byLoc.get(url);
    if (!sm) fail(page, 'is not in the sitemap');
    else if (sm.lastmod !== d.modified) fail(page, `sitemap lastmod is ${sm.lastmod}, but its date is ${d.modified}`);
  }
  const stub = read(path.join(dist, 'chain', 'index.html')) || '';
  if (links(stub, 'canonical').join() !== url || !/location\.replace\("\.\.\/supply-chain\/"/.test(stub)) fail('/chain/', 'does not forward to /supply-chain/ with its canonical');
}

// the book: every chapter, for print only, kept from search engines
{
  const html = read(path.join(dist, 'book', 'index.html')) || '';
  if (!html) fail('/book/', 'missing; run node build/build.js');
  else {
    if (!/<meta name="robots" content="noindex">/.test(html)) fail('/book/', 'is not noindex');
    if (!disallow.includes('/book/')) fail('/book/', 'is not disallowed in robots.txt');
    const n = (html.match(/<article class="chapter[^"]*" id="/g) || []).length;
    if (n !== chapters.length) fail('/book/', `holds ${n} chapters, not ${chapters.length}`);
  }
  if (byLoc.has(BASE + 'book/')) fail('sitemap.xml', 'lists the book');
}

// the home page: its JSON-LD, and a link to every chapter's page in the HTML a crawler reads before scripts run
{
  const html = read(path.join(dist, 'index.html')) || '';
  if (!html) fail('/', 'dist/index.html is missing');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  if (!blocks.length) fail('/', 'has no JSON-LD');
  blocks.forEach((b, k) => { try { const j = JSON.parse(b); if (j['@type'] === 'WebSite' && j.url !== BASE) fail('/', `WebSite url is ${j.url}`); } catch (e) { fail('/', `JSON-LD block ${k + 1} does not parse: ${e.message}`); } });
  const sm = byLoc.get(BASE);
  if (!sm) fail('/', 'is not in the sitemap');
  else if ((dates['/'] || {}).modified && sm.lastmod !== dates['/'].modified) fail('/', `sitemap lastmod is ${sm.lastmod}, but its date is ${dates['/'].modified}`);
  const missing = chapters.filter((c) => !html.includes(`href="${c.id}/"`)).map((c) => c.id);
  if (missing.length) fail('/', `its HTML has no href to ${missing.join(', ')}`);
  const held = (html.match(/<article class="chapter[^"]*" id="[^"]+"/g) || []).length;
  if (held) fail('/', `holds ${held} chapters; each belongs on its own page`);
}

// a merged chapter's old address forwards, with a canonical to the merged chapter
Object.entries(RETIRED.chapters || {}).forEach(([old, e]) => {
  const html = read(path.join(dist, old, 'index.html'));
  if (!html) { fail(`/${old}/`, 'the forwarding page is missing'); return; }
  const canon = links(html, 'canonical');
  if (canon.length !== 1 || canon[0] !== BASE + e.to + '/') fail(`/${old}/`, `canonical is ${JSON.stringify(canon)}, expected ${BASE + e.to}/`);
});

notes.forEach((n) => console.log('note: ' + n));
if (errors.length) {
  console.error(`check-seo: ${errors.length} problem${errors.length === 1 ? '' : 's'}`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(`check-seo: ${chapters.length} chapter pages, ${entries.length} sitemap entries, no problems${notes.length ? ` (${notes.length} note${notes.length === 1 ? '' : 's'})` : ''}`);
