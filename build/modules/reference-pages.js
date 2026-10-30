/* REFERENCE PAGES: /suppliers/, /export-controls/, /chips/ and /glossary/ as real pages of their own, for search engines,
   for citation and for anyone who reads without scripts. Until 21 Oct 2026 these four addresses were forwarding pages
   (build/modules/social.js) whose canonical was the hash route, so a search engine read them as the home page.

   Each page is the view's content as plain HTML, generated from data/ through the same helpers the main page uses (the
   revenue as build.js prints it, the China share as build/exposure.js names it, the board's states as src/app.js reads
   them), so a weekly data edit updates it with the next build. Nothing here types a figure, rounds one or computes one:
   every number is printed as the main page prints it, with the source link and date the main page gives it. The words
   that are the main page's own (deks, labels, the board's key, the notes) are read from where the main page keeps them:
   build.js passes its strings on ctx, the template's static text is read from src/template.html, and the few client
   constants (country names, the stage order) are read from src/app.js.

   The pages share the readable chapter pages' head, masthead, footer, type and tokens (social.js exports them, and
   build/assets/chapter-page.css is inlined with build/assets/reference-page.css after it). They open light; ?theme=dark or
   the site's saved choice turns them dark, as the chapter pages do. Each has its own canonical, the view's Open Graph and
   Twitter tags and card, structured data (a Dataset, or a DefinedTermSet for the Glossary) and a link near the top to the
   interactive view. The page's "Updated" day is its content's own (build.js page dates), and build.js lists the four in
   the sitemap (ctx.referencePages). This module runs before social.js, which skips the four views it writes.

   Since 30 Oct 2026 /glossary/ is the interactive Glossary itself, with every entry's words in its HTML: build/build.js
   writes it from src/template.html, as it writes the chapter pages, and this module gives it its head (ctx.glossaryHead)
   and the chapters each term is read in (DATA.glossaryRefs). The static copy, its columns and its lists, went with it. */
'use strict';
const vm = require('vm');
const S = require('./social.js');
const SITE_CONFIG = require('../site.js');
const keepRanges = require('../keep-ranges.js');
const EXPOSURE = require('../exposure.js');
const PAGE_TITLES = require('../page-titles.js');

const BASE = S.BASE;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = '{{REF:DAY}}', ASOF = '{{REF:ASOF}}'; // filled after the page is hashed for its date, so neither moves the date
const PAGES = [['suppliers', 'Suppliers'], ['export-controls', 'Export Controls'], ['chips', 'AI Chips'], ['glossary', 'Glossary']];

const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// "15 Jan 2026": day first, as the board prints its dates
const shortDate = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : String(iso || ''); };
const hostOf = (u) => String(u || '').replace(/^https?:\/\//, '').split('/')[0];
const textOf = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

module.exports = function (ctx) {
  const { root, fs, path, warn, esc, data } = ctx;
  const safe = ctx.safeUrl || ((u) => (/^(https?:|mailto:|#|\/)/i.test(String(u || '').trim()) ? esc(String(u).trim()) : '#'));
  const ext = (u, text, attrs) => { const h = safe(u); return h && h !== '#' ? `<a href="${h}" target="_blank" rel="noopener"${attrs || ''}>${text}</a>` : text; };
  const template = ctx.read(path.join(root, 'src', 'template.html')) || '';
  const appSrc = ctx.read(path.join(root, 'src', 'app.js')) || '';

  /* ---------------- the main page's own words and constants ---------------- */
  // a literal from src/app.js (an object or array of plain strings and numbers), evaluated on its own with nothing in scope
  const literal = (name, re) => {
    const m = re.exec(appSrc);
    if (m) { try { return vm.runInNewContext('(' + m[1] + ')', Object.create(null), { timeout: 100 }); } catch (e) { /* reported below */ } }
    warn(`reference pages: could not read ${name} from src/app.js, so a fallback is used`);
    return null;
  };
  const COUNTRY = Object.assign({}, ctx.COUNTRY || {}, literal('COUNTRY', /var COUNTRY = (\{[^;]*?\});/) || {});
  const cname = (c) => COUNTRY[c] || c;
  const ORDER = literal('Suppliers.ORDER', /\bORDER: (\[[^\]]*\])/) || [];
  const RANK = literal('Suppliers.RANK', /\bRANK: (\{[^}]*\})/) || { Critical: 0, Important: 1, Contested: 2, Diversified: 3 };
  const SHORT = literal('Suppliers.SHORT', /\bSHORT: (\{[^}]*\})/) || {};
  const STATE = literal('Geo.STATE', /\bSTATE: (\{[^}]*\})/) || { open: 'No license', restricted: 'Restricted', case: 'Case by case', denial: 'Presumption of denial', prohibited: 'Prohibited', policy: 'Policy' };
  const OLD_STATE = literal('Geo.OLD_STATE', /\bOLD_STATE: (\{[^}]*\})/) || {};
  const INSTRUMENT = literal('Geo.INSTRUMENT', /\bINSTRUMENT: (\{[^}]*\})/) || {};
  // static text in src/template.html
  const tmpl = (re, name) => { const m = re.exec(template); if (!m) { warn(`reference pages: ${name} is missing from src/template.html`); return ''; } return m[1].trim(); };
  // each view's own <section> (the template names the views earlier too, in its pre-boot CSS and the nav)
  const chipsDek = tmpl(/<section class="view[^"]*" data-view="landscape"[^>]*>[\s\S]*?<p class="dek">([\s\S]*?)<\/p>/, 'the AI Chips dek');
  const specsSub = esc(literal('Landscape.TFLOPS_SENTENCE', /\bTFLOPS_SENTENCE: ('[^']*')/) || ''); // the comparison's note on TFLOPS (src/app.js)
  const ladderLabel = tmpl(/id="sup-ladder-h">([^<]*)</, 'the Suppliers ladder heading');
  const LEGEND = [];
  (tmpl(/<ul class="cf-legend"[^>]*>([\s\S]*?)<\/ul>/, 'the board key').match(/<li>[\s\S]*?<\/li>/g) || []).forEach((li) => {
    const m = /<span class="(cf-pill is-([a-z]+)|cf-susp)">([^<]*)<\/span><span>([\s\S]*?)<\/span>/.exec(li);
    if (m) LEGEND.push({ status: m[2] || 'suspended', word: m[3], text: m[4] });
  });

  /* ---------------- shared page furniture ---------------- */
  const manifest = new Map(S.manifest(root).map((p) => [p.slug, p]));
  const versions = S.cardVersions(root, fs, path);
  let css = '';
  for (const f of ['chapter-page.css', 'masthead.css', 'reference-page.css']) { // the masthead's sheet: build/masthead.js
    try { css += S.minCSS(fs.readFileSync(path.join(root, 'build', 'assets', f), 'utf8')); } catch (e) { warn(`reference pages: build/assets/${f} is missing, so they ship part-styled`); }
  }
  const builtStr = ctx.builtStr, today = ctx.builtOn ? `${ctx.builtOn.getFullYear()}-${String(ctx.builtOn.getMonth() + 1).padStart(2, '0')}-${String(ctx.builtOn.getDate()).padStart(2, '0')}` : new Date().toISOString().slice(0, 10);
  const analytics = SITE_CONFIG.analytics ? `<script async src="https://gc.zgo.at/count.js" data-goatcounter="${esc(SITE_CONFIG.analytics)}"></script>` : '';
  const person = { '@type': 'Person', name: S.AUTHOR.name, url: S.AUTHOR.url };
  const org = { '@type': 'Organization', name: S.SITE, url: BASE };

  // a page: the head as the chapter pages have it, the masthead, the view's own head and button, the content, the footer
  function page(o) {
    const p0 = manifest.get(o.slug) || { slug: o.slug, kind: 'view', title: o.h1, eyebrow: S.SITE, line: o.description, description: o.description, route: o.route };
    const p = Object.assign({}, p0, { seo: { title: o.shareTitle || o.title, description: o.description } }); // the share tags say what the search result says
    const url = BASE + o.slug + '/', app = '../' + (p.route || o.route);
    const cta = (cls) => `<div class="cta${cls}"><a class="btn" href="${esc(app)}">Open the interactive page <span aria-hidden="true">→</span></a><p class="cta-note">${esc(o.ctaNote)}</p></div>`;
    const nav = `<nav class="refnav" aria-label="Reference pages"><span class="label">Reference</span><ul>${PAGES.map(([s, t]) => `<li>${s === o.slug ? `<span aria-current="page">${esc(t)}</span>` : `<a href="../${s}/">${esc(t)}</a>`}</li>`).join('')}</ul></nav>`;
    const main = `<header class="ch-head">
<p class="eyebrow"><b>Reference</b></p>
<h1 class="ch-title">${esc(o.h1)}</h1>
<p class="ch-lede">${o.dekHTML}</p>
<p class="ch-meta">${o.facts.map((f) => `<span>${esc(f)}</span>`).join('')}<span>Updated ${DAY}</span></p>
${cta('')}
</header>
${o.body}
<nav class="endnav" aria-label="After the page">${cta(' cta--end')}${nav}</nav>`;
    // the day this page's content last changed: build.js keeps a hash of its text per page (page dates)
    const dates = ctx.pageDate ? ctx.pageDate('/' + o.slug + '/', main) : { published: today, modified: today };
    const day = ctx.dayStr ? ctx.dayStr(dates.modified) : builtStr;
    const footer = String(ctx.footerKey || '').split(`Updated ${builtStr}`).join(`Updated ${day}`);
    const ld = Object.assign({ '@context': 'https://schema.org' }, o.ld(url), { url, inLanguage: 'en', datePublished: dates.published, dateModified: dates.modified, isPartOf: { '@type': 'WebSite', name: S.SITE, url: BASE } });
    const body = main.split(DAY).join(esc(day)).split(ASOF).join(esc(ctx.dayStr ? ctx.dayStr(today) : today));
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="author" content="${esc(S.AUTHOR.name)}">
${S.shareTags(p, versions)}
${S.ICONS}
<meta name="color-scheme" content="light dark">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${S.FONTS}">
${S.THEME_JS}
<style>${css}${o.css || ''}</style>
${analytics}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${S.masthead ? S.masthead('../' + o.slug + '/') : S.MASTHEAD}
<main id="main" class="page ref">
${body}
<footer class="site-footer">${footer}</footer>
</main>
</body>
</html>
`;
  }
  const dataset = (name, description, files, measured) => (url) => ({
    '@type': 'Dataset', name, description, creator: person, author: person, publisher: org, isAccessibleForFree: true,
    distribution: files.map((f) => ({ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: BASE + 'data/' + f })),
    variableMeasured: measured, mainEntityOfPage: url,
  });
  // the approved search title and description (build/page-titles.json), with each count in them set from the data so a weekly
  // edit keeps them right; a count the file states differently is reported, so the editor's file can be brought up to date
  const seoFor = (slug, counts) => {
    const e = PAGE_TITLES('/' + slug + '/');
    if (!e) { warn(`page titles: build/page-titles.json has no entry for /${slug}/`); return null; }
    const fix = (t) => counts.reduce((acc, [re, n, what]) => acc.replace(re, (m, k) => { if (+k !== n) warn(`page titles: /${slug}/ says ${k} ${what}, the data has ${n}; the page prints ${n}`); return m.replace(k, String(n)); }), String(t || ''));
    return { title: fix(e.title), description: fix(e.description) };
  };
  // { title, shareTitle, description } for page(): the approved words with the site name after the title, or the view's name
  const titled = (slug, counts, fallback) => { const t = seoFor(slug, counts); const name = (manifest.get(slug) || {}).title || slug; return t ? { title: `${t.title} · ${S.SITE}`, shareTitle: t.title, description: t.description } : { title: `${name} · ${S.SITE}`, shareTitle: name, description: fallback }; };
  // an id used twice on one page is renamed and reported, so every anchor lands where it says
  const idsFor = () => { const seen = new Set(); return (want, what) => { let id = want || 'x', k = 2; while (seen.has(id)) id = `${want}-${k++}`; if (id !== want) warn(`reference pages: two ${what} share the anchor #${want}; the second is #${id}`); seen.add(id); return id; }; };

  /* ================= /suppliers/ ================= */
  const suppliers = (data.suppliers || []).slice();
  const firmIds = new Map(); // firm name -> its anchor on /suppliers/, for the Glossary's links
  const countryIds = new Map();
  function suppliersPage() {
    const uid = idsFor();
    // the stages as the ladder groups and ranks them (Suppliers.groupStages and ladderOrder in src/app.js): fewest firms first,
    // then the stage with more Critical firms, then chain order
    const by = {};
    suppliers.forEach((r) => { const s = by[r.category] || (by[r.category] = { name: r.category, rows: [], crit: 0 }); s.rows.push(r); if (r.chokepoint === 'Critical') s.crit++; });
    const order = ORDER.filter((c) => by[c]);
    Object.keys(by).sort().forEach((c) => { if (order.indexOf(c) < 0) order.push(c); });
    const stages = order.map((c, i) => Object.assign(by[c], { i, id: uid('stage-' + slug(c), 'stages') }));
    const ladder = stages.slice().sort((a, b) => a.i - b.i); // the list's own order, from design to power, as the app's ladder
    const rank = (r) => (RANK[r.chokepoint] != null ? RANK[r.chokepoint] : 9);
    suppliers.forEach((r) => firmIds.set(r.name, uid(slug(r.name), 'firms')));

    // a firm's revenue as the drawer prints it (Suppliers.revenueHTML): the filed figure linked to the filing, the fiscal year,
    // and about how much in dollars for a firm that does not file in dollars, with the rates behind it as the figure's title
    const revenue = (r) => {
      const s = r.revenueShown;
      if (s && s.filed) {
        return (s.href ? ext(s.href, esc(s.filed), ' class="rev-filed"') : esc(s.filed)) + (s.year ? ` (${s.group ? 'group revenue, ' : ''}${esc(s.year)})` : '')
          + (s.about ? `, <span class="rev-usd"${r.revenueUSDBasis ? ` title="${esc(r.revenueUSDBasis)}"` : ''}>${esc(s.about)}</span>` : '');
      }
      if (r.revenueUSDb != null) { const v = (r.revenueUSDb >= 10 ? r.revenueUSDb.toFixed(1) : r.revenueUSDb.toFixed(2)).replace(/0+$/, '').replace(/\.$/, ''); return '$' + v + 'B' + (r.revenueYear ? ' (' + esc(r.revenueYear) + ')' : ''); }
      return '';
    };
    const exHref = (h) => { const m = /#\/exposure\/([a-z0-9-]+)/.exec(String(h || '')); return m ? `../export-controls/#ex-${m[1]}` : '../export-controls/#china-revenue'; };
    const firm = (r) => {
      const facts = [];
      if ((r.customers || []).length) facts.push(['Customers', esc(r.customers.join(', '))]);
      if (r.shareNote) facts.push(['Share', esc(r.shareNote)]);
      if (r.founded) facts.push(['Founded', esc(r.founded)]);
      if (r.ownership) facts.push(['Ownership', esc(r.ownership)]);
      const rev = revenue(r); if (rev) facts.push(['Revenue', rev]);
      if (r.china) facts.push(['From China', `<a href="${esc(exHref(r.china.href))}">${esc(String(r.china.label).replace(/^China /, ''))}</a>`]);
      const where = [cname(r.country) + (r.city ? ', ' + r.city : ''), /^private$/i.test(r.ticker || '') ? '' : r.ticker].filter(Boolean).join(' · ');
      const note = r.revenueShown && r.revenueShown.note ? `<p class="row-fine"><b>About the revenue figure.</b> ${esc(r.revenueShown.note)}</p>` : '';
      return `<li class="row" id="${firmIds.get(r.name)}"><div><h3 class="row-h">${esc(r.name)}${r.nativeName ? `<span class="native" lang="${/[\u3040-\u30ff]/.test(r.nativeName) ? 'ja' : /[\uac00-\ud7af]/.test(r.nativeName) ? 'ko' : /[\u4e00-\u9fff]/.test(r.nativeName) ? 'zh' : 'en'}">${esc(r.nativeName)}</span>` : ''}</h3>`
        + `<p class="row-meta">${esc(where)}</p>${r.chokepoint ? `<p class="row-meta"><span class="sr-only">Chokepoint level: </span><span class="lv lv-${esc(r.chokepoint)}">${esc(r.chokepoint)}</span></p>` : ''}</div>`
        + `<div class="row-body">${r.subcategory ? `<p class="row-lead">${esc(r.subcategory)}</p>` : ''}${r.role ? `<p>${esc(r.role)}</p>` : ''}`
        + (facts.length ? `<dl class="facts">${facts.map((f) => `<dt>${f[0]}</dt><dd>${f[1]}</dd>`).join('')}</dl>` : '') + note
        + (r.source ? `<p class="row-src">${ext(r.source, 'Source', ` aria-label="Source for ${esc(r.name)}"`)}</p>` : '') + '</div></li>';
    };
    const stageHTML = (s) => {
      const rows = s.rows.slice().sort((a, b) => (rank(a) - rank(b)) || String(a.name).localeCompare(String(b.name)));
      return `<section class="ref-sec" aria-labelledby="${s.id}-h"><h2 class="ref-h2" id="${s.id}">${esc(s.name)} <small id="${s.id}-h-n">${s.rows.length} ${s.rows.length === 1 ? 'firm' : 'firms'}${s.crit ? ` · ${s.crit} critical` : ''}</small></h2><span hidden id="${s.id}-h">${esc(s.name)}</span><ol class="ledger">${rows.map(firm).join('')}</ol></section>`;
    };
    const jump = `<nav class="jump" aria-labelledby="stages-k"><span class="label" id="stages-k">${esc(ladderLabel || 'Segments from chip design to power')}</span><ol>${ladder.map((s) => `<li><a href="#${s.id}">${esc(SHORT[s.name] || s.name)}</a><span class="n">${s.rows.length}</span></li>`).join('')}<li><a href="#countries">What each country makes</a></li></ol></nav>`;

    // what each country makes: the Suppliers atlas's own lines (build/modules/summary-a.js HOME_MAP), in its order, with the
    // number of firms each has in the supplier list, as the Glossary's country card counts them
    let roles = [];
    try {
      const out = require('./summary-a.js')(Object.assign({}, ctx, { warn: () => { } })) || {};
      String(out.HOME_MAP || '').replace(/class="sa-role" data-cc="([^"]+)"[^>]*><span class="sa-role-name">([\s\S]*?)<\/span><span class="sa-role-meta">([\s\S]*?)<\/span><span class="sa-role-line">([\s\S]*?)<\/span>/g, (m, cc, name, meta, line) => { roles.push({ cc, name, meta, line }); return m; });
    } catch (e) { warn('reference pages: the Suppliers atlas did not build, so /suppliers/ has no country summary: ' + e.message); }
    if (!roles.length) warn('reference pages: no country lines found in the Suppliers atlas');
    roles.forEach((c) => countryIds.set(c.cc, uid('country-' + c.cc.toLowerCase(), 'countries')));
    const countries = roles.length ? `<section class="ref-sec" aria-labelledby="countries"><h2 class="ref-h2" id="countries">What each country makes</h2><p class="ref-sub">Each country's firms are counted under the country of the firm's own headquarters.</p><dl class="cards">${roles.map((c) => {
      const n = suppliers.filter((r) => r.country === c.cc).length;
      return `<div class="card" id="${countryIds.get(c.cc)}"><dt>${c.name}</dt><dd><p class="row-meta">${c.meta}${n ? ` · ${n} ${n === 1 ? 'firm' : 'firms'} in the supplier list` : ''}</p>${c.line}.</dd></div>`;
    }).join('')}</dl></section>` : '';

    const revNote = ctx.suppliersRevenueNote ? `<p class="ref-note">${ctx.suppliersRevenueNote}</p>` : '';
    const withRev = suppliers.filter((r) => r.revenueShown && r.revenueShown.filed).length;
    return page({
      slug: 'suppliers', route: '#/suppliers', h1: 'Suppliers',
      ...titled('suppliers', [[/(\d+) firms/, suppliers.length, 'firms']], `What each of the ${suppliers.length} firms in the AI chip supply chain makes, where it is based and how hard it would be to replace.`),
      dekHTML: esc(ctx.suppliersIntro || ''),
      facts: [`${suppliers.length} firms`, `${stages.length} segments`],
      ctaNote: 'The interactive page adds a map of the route one chip takes, a drawing of which countries supply which segments, search and filters.',
      body: jump + revNote + ladder.map(stageHTML).join('') + countries,
      ld: dataset('Suppliers to the AI chip supply chain', `The ${suppliers.length} firms in the AI chip supply chain across ${stages.length} segments: what each makes, where it is based, how hard it would be to replace, and the latest annual revenue of ${withRev} of them as filed, each with its source.`,
        ['suppliers.json', 'fx-rates.json'], ['Segment', 'Country', 'Chokepoint level', 'Revenue as filed', 'Revenue in US dollars', 'China share of revenue']),
    });
  }

  /* ================= /export-controls/ ================= */
  const timeline = (Array.isArray(data.timeline) ? data.timeline : ((data.timeline || {}).events || [])).slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  function controlsPage() {
    const uid = idsFor();
    const evIds = new Map(); timeline.forEach((e, i) => evIds.set(e, uid(e.id || 'entry-' + i, 'timeline entries')));
    const evById = new Map(timeline.filter((e) => e.id).map((e) => [e.id, e]));
    // the board (Geo in src/app.js): a flow's state on a date is the last state that took effect on or before it
    const raw = data.flows && (Array.isArray(data.flows) ? data.flows : data.flows.flows);
    const flows = (raw || []).filter((f) => f && f.id).slice().sort((a, b) => (a.order == null ? 99 : a.order) - (b.order == null ? 99 : b.order));
    const norm = (s) => { let k = String(s || 'open'); if (OLD_STATE[k]) k = OLD_STATE[k]; if (!STATE[k]) { warn(`reference pages: a board state "${k}" has no word, so it reads as open`); k = 'open'; } return k; };
    // the day the board's data was last checked (control-flows.json "checked"): past it nothing moves on its date alone, as on
    // the interactive board (Geo.stateAt in src/app.js, final QA B3)
    const lastEv = timeline.length ? String(timeline[timeline.length - 1].date) : today;
    const checked = data.flows && !Array.isArray(data.flows) && /^\d{4}-\d{2}-\d{2}$/.test(String(data.flows.checked || '')) ? String(data.flows.checked) : lastEv;
    const stateAt = (f, date) => {
      const st = (f.states || []).slice().sort((a, b) => (String(a.date) < String(b.date) ? -1 : String(a.date) > String(b.date) ? 1 : 0));
      const upTo = String(date) > checked ? checked : date;
      let out = null, due = null; st.forEach((s) => { if (!s || !s.date) return; if (s.date <= upTo) out = s; else if (s.date <= date && !due) due = s; });
      const s = out || (f.initial && typeof f.initial === 'object' ? f.initial : null);
      const pending = due ? { date: due.date } : null;
      if (!s) { const k = norm(typeof f.initial === 'string' ? f.initial : 'open'); return { status: k, label: STATE[k], date: null, announced: null, published: null, suspendedUntil: null, suspends: '', suspended: false, unconfirmed: false, also: null, scope: '', pending, cite: null, event: null }; }
      const until = s.suspendedUntil ? String(s.suspendedUntil) : null, holds = !!until && until >= String(date), unconfirmed = !!until && !holds && until >= checked;
      const k = norm(until && !holds && !unconfirmed && s.resumes ? s.resumes : s.status);
      return { status: k, label: s.label || STATE[k], date: out ? out.date : (s.date || null), announced: s.announced || null, published: s.published || null, suspendedUntil: until, suspends: s.suspends || '', suspended: holds || unconfirmed, unconfirmed, also: s.also && s.also.status ? { status: norm(s.also.status), scope: s.also.for || '' } : null, scope: s.for || '', pending, cite: s.cite || null, event: s.event || null };
    };
    const stayText = (st) => { if (!st.suspended || !st.suspendedUntil) return ''; const d = shortDate(st.suspendedUntil), w = st.suspends || ''; return st.unconfirmed ? `${w ? w + ' due' : 'Due'} to end ${d}, extension not confirmed` : `${w ? w + ' suspended' : 'Suspended'} until ${d}`; };
    const citeText = (c) => (c ? [c.fr, c.cfr].filter(Boolean).join(' · ') : '');
    const cite = (c) => { const t = citeText(c) || (c && c.url ? hostOf(c.url) : ''); return t ? (c && c.url ? ext(c.url, esc(t)) : esc(t)) : ''; };
    const first = timeline.length ? String(timeline[0].date).slice(0, 4) : '2018';
    const flowHTML = (f) => {
      const st = stateAt(f, today), word = STATE[st.status];
      let when = st.date ? 'from ' + shortDate(st.date) : `open since ${first}`;
      if (st.published && st.date && st.published !== st.date) when += ' · published ' + shortDate(st.published); // the Federal Register's day
      else if (st.announced && st.date && st.announced !== st.date) when += ' · announced ' + shortDate(st.announced);
      const stay = stayText(st);
      const ev = st.event && evById.get(st.event);
      return `<li class="row" id="${uid('flow-' + slug(f.id), 'board rows')}"><div><h3 class="row-h">${esc(f.name || f.id)}</h3>${f.route ? `<p class="row-meta">${esc(f.route)}</p>` : ''}</div>`
        + `<div class="row-body"><p><span class="pill is-${esc(st.status)}${st.suspended && !st.suspends ? ' is-suspended' : ''}">${esc(word)}</span>${st.scope ? `<span class="susp">${esc(st.scope)}</span>` : ''}`
        + (st.also ? ` <span class="pill is-${esc(st.also.status)}">${esc(STATE[st.also.status])}</span>${st.also.scope ? `<span class="susp">${esc(st.also.scope)}</span>` : ''}` : '')
        + `${stay ? `<span class="susp">${esc(stay)}</span>` : ''}${st.pending ? `<span class="susp">Change due ${esc(shortDate(st.pending.date))}, not confirmed</span>` : ''}</p>`
        + (st.label && st.label !== word ? `<p class="row-lead">${esc(st.label)}</p>` : '')
        + `<p class="row-meta">${esc(when)}${citeText(st.cite) || (st.cite && st.cite.url) ? ` · ${cite(st.cite)}` : ''}${ev ? ` · <a class="src-a" href="#${evIds.get(ev)}">Entry in the timeline</a>` : ''}</p>`
        + (f.what ? `<p class="row-fine">${esc(f.what)}</p>` : '') + '</div></li>';
    };
    const key = LEGEND.length ? `<ul class="key" aria-label="What each state means">${LEGEND.map((l) => `<li>${l.status === 'suspended' ? `<span class="susp">${esc(l.word)}</span>` : `<span class="pill is-${esc(l.status)}">${esc(l.word)}</span>`}<span>${esc(l.text)}</span></li>`).join('')}</ul>` : '';
    const board = flows.length ? `<section class="ref-sec" aria-labelledby="board"><h2 class="ref-h2" id="board">What can be sold <small>On ${ASOF}${today > checked ? ` · data checked ${esc(ctx.dayStr ? ctx.dayStr(checked) : checked)}` : ''}</small></h2><ol class="ledger">${flows.map(flowHTML).join('')}</ol>${key}</section>` : '';

    // the timeline, oldest first, by year (Geo.renderTimeline): each entry with its date, actor, kind, title, summary and source
    const instWord = (v) => { const k = String(v || ''); if (!k) return ''; if (INSTRUMENT[k]) return INSTRUMENT[k]; const w = k.replace(/-/g, ' '); return w.charAt(0).toUpperCase() + w.slice(1); };
    const years = [];
    timeline.forEach((e) => { const y = String(e.date || '').slice(0, 4); let g = years[years.length - 1]; if (!g || g.y !== y) years.push(g = { y, rows: [] }); g.rows.push(e); });
    const entry = (e) => {
      const eff = e.effectiveDate && e.effectiveDate !== e.date ? e.effectiveDate : null;
      const ct = citeText({ fr: e.frCitation, cfr: e.cfr }), host = e.source ? hostOf(e.source) : '';
      const cu = (e.cite && e.cite.url) || e.source; // the legal citation's own text when the data gives it (cite.url)
      const src = e.source ? (ct ? `${ext(cu, esc(ct))}${cu !== e.source ? ` · ${ext(e.source, esc(host))}` : `<span class="host">${esc(host)}</span>`}` : ext(e.source, esc(host))) : esc(ct);
      return `<li class="row ev" id="${evIds.get(e)}"><p class="row-meta"><b>${esc(shortDate(e.date))}</b>${eff ? `<span class="eff">in force ${esc(shortDate(eff))}</span>` : ''}${esc(e.actor || '')}</p>`
        + `<div class="row-body"><p class="ev-tags">${[e.category, instWord(e.instrument)].filter(Boolean).map(esc).join(' · ')}</p><h4>${esc(e.title)}</h4>`
        + (e.gist ? `<p class="gist">${esc(e.gist)}</p>` : '') + (e.summary ? `<p class="sum">${esc(e.summary)}</p>` : '')
        + (src ? `<p class="row-src">${src}</p>` : '') + '</div></li>';
    };
    const last = timeline.length ? String(timeline[timeline.length - 1].date).slice(0, 4) : first;
    const tl = timeline.length ? `<section class="ref-sec" aria-labelledby="timeline"><h2 class="ref-h2" id="timeline">The timeline of AI chip export controls, ${esc(first)} to ${esc(last)} <small>${timeline.length} entries</small></h2>`
      + `<nav class="jump" aria-label="Years"><ol>${years.map((g) => `<li><a href="#year-${g.y}">${esc(g.y)}</a><span class="n">${g.rows.length}</span></li>`).join('')}</ol></nav>`
      + years.map((g) => `<h3 class="ref-h3" id="${uid('year-' + g.y, 'years')}">${esc(g.y)}<small>${g.rows.length} ${g.rows.length === 1 ? 'move' : 'moves'}</small></h3><ol class="ledger">${g.rows.map(entry).join('')}</ol>`).join('') + '</section>' : '';

    // China's share of revenue by fiscal year, one cell a filing (Controls.build in src/app.js, the table behind the charts)
    const ex = (data.exposure || []).filter((r) => r && r.firm);
    const firms = {}, yrs = {}, meta = {};
    ex.forEach((r) => { (firms[r.firm] = firms[r.firm] || {})[r.fiscalYear] = r; yrs[r.fiscalYear] = 1; meta[r.firm] = r; });
    const ys = Object.keys(yrs).sort(), lastY = ys[ys.length - 1];
    const fOrder = Object.keys(firms).sort((a, b) => ((firms[b][lastY] || {}).chinaShare || 0) - ((firms[a][lastY] || {}).chinaShare || 0));
    const basisShort = (b) => { b = String(b || '').toLowerCase(); if (!b) return ''; if (/ship-to|ship to|destination|fab\)/.test(b)) return 'counted where it ships'; if (/bill|invoice/.test(b)) return 'counted where it is billed'; if (/headquarters/.test(b)) return 'counted by headquarters'; if (/seat|licen/.test(b)) return 'counted by license seats'; if (/used|usage/.test(b)) return 'counted where it is used'; if (/own operating|operating units|own units/.test(b)) return 'counted by own units'; return 'counted by customer location'; };
    const firstLine = (b) => { const t = String(b || ''), i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t; };
    const exRow = (f) => {
      const m = meta[f], segs = [];
      ys.forEach((y) => { const r = firms[f][y]; if (!r || r.chinaShare == null || !r.basis) return; const k = basisShort(r.basis), l = segs[segs.length - 1]; if (!l || l.k !== k) segs.push({ k, from: y, to: y, text: firstLine(r.basis) }); else l.to = y; });
      const starts = {}; segs.forEach((sg, i) => { if (i) starts[sg.from] = 1; });
      const label = segs.length > 1 ? segs.map((sg, i) => { const w = i ? sg.k.replace(/^counted /, '') : sg.k; return i === segs.length - 1 ? w + ' from ' + sg.from : (i ? w + ' ' + sg.from + ' to ' + sg.to : w + ' to ' + sg.to); }).join(', ') : (m.basis ? basisShort(m.basis) : '');
      const rowTitle = segs.length > 1 ? segs.map((sg) => sg.from + (sg.to !== sg.from ? ' to ' + sg.to : '') + ': ' + sg.text).join(' ') : (m.basis || '');
      let peak = 0; ys.forEach((y) => { const r = firms[f][y]; if (r && r.chinaShare != null) peak = Math.max(peak, r.chinaShare); });
      const pnote = ys.map((y) => firms[f][y]).filter((r) => r && r.panelNote).map((r) => r.panelNote).pop() || ''; // what the share measures (final QA B10)
      return `<tr id="${uid('ex-' + EXPOSURE.slug(f), 'China revenue rows')}"><th scope="row" title="${esc(rowTitle)}">${esc(f)}<span class="sub">${esc([m.category, cname(m.country), label].filter(Boolean).join(' · '))}</span>${pnote ? `<span class="sub">${esc(pnote)}</span>` : ''}</th>` + ys.map((y) => {
        const r = firms[f][y];
        if (!r || r.chinaShare == null) return '<td><span class="sh none" aria-hidden="true">·</span><span class="sr-only">Not filed for this year</span></td>';
        const brk = starts[y], basis = r.basis ? 'Counted: ' + firstLine(r.basis) : '';
        const tip = [r.chinaRevenue != null ? r.chinaRevenue.toLocaleString('en-US') + ' of ' + (r.totalRevenue || 0).toLocaleString('en-US') + ' ' + (r.currency || '') : '', r.note || '', (brk ? 'New basis from this year. ' : '') + basis].filter(Boolean).join(' · ');
        const v = (r.chinaRevenue != null ? Number(r.chinaShare).toFixed(1) : String(r.chinaShare)) + '%'; // as build/exposure.js shareText prints it
        return `<td${brk ? ' class="brk"' : ''}>${brk ? '<span class="sr-only">The firm counts China differently from this year. </span>' : ''}${ext(r.source, esc(v), ` class="sh${r.chinaShare === peak ? ' peak' : ''}" title="${esc(tip)}" aria-label="${esc(f)} ${esc(y)}: ${esc(String(r.chinaShare))} percent from China, opens the filing"`)}</td>`;
      }).join('') + '</tr>';
    };
    const exNote = String(ctx.exposureNote || '').replace(/^The charts cover/, 'The table covers');
    const exposure = fOrder.length ? `<section class="ref-sec" aria-labelledby="china-revenue"><h2 class="ref-h2" id="china-revenue">China share of revenue, from company filings <small>${fOrder.length} firms · ${esc(ys[0])} to ${esc(lastY)}</small></h2>`
      + `<p class="ex-key"><span>Each share links to the firm's filing for that year.</span><span><i class="k-peak" aria-hidden="true"></i>The year it peaked</span><span><i class="k-brk" aria-hidden="true"></i>The firm changed how it counts China</span></p>`
      + `<p class="tbl-cue" aria-hidden="true">Scroll the table sideways to see every year.</p><div class="tbl ex" role="region" aria-labelledby="china-revenue" tabindex="0"><table><thead><tr><th scope="col">Firm</th>${ys.map((y) => `<th scope="col">${esc(y)}</th>`).join('')}</tr></thead><tbody>${fOrder.map(exRow).join('')}</tbody></table></div>`
      + (exNote ? `<p class="ref-note">${esc(exNote)}</p>` : '') + '</section>' : '';

    return page({
      slug: 'export-controls', route: '#/controls', h1: 'Export Controls',
      ...titled('export-controls', [[/since (\d{4})/g, +first, 'as the first year'], [/at (\d+) firms/, fOrder.length, 'firms']], ctx.controlsDek || ''),
      dekHTML: esc(ctx.controlsDek || ''),
      facts: [`${flows.length} rows on the board`, `${timeline.length} entries`, `${fOrder.length} firms`],
      ctaNote: `The interactive page moves the board to any date since ${first} and draws each firm's China share as a chart.`,
      body: board + tl + exposure,
      ld: dataset('AI chip export controls and China revenue shares', `The main export-control moves on AI chips and chipmaking since ${first} (${timeline.length} entries, each with its legal citation and source), the state of ${flows.length} kinds of trade under them, and China's share of revenue at ${fOrder.length} firms by fiscal year, from their filings.`,
        ['export-controls-timeline.json', 'control-flows.json', 'exposure.json'], ['Date', 'Actor', 'Legal citation', 'License outcome', 'China share of revenue']),
    });
  }

  /* ================= /chips/ ================= */
  /* the FP16 chart on /chips/ (chipsPage): kept with the page that draws it, so the shared reference sheet stays as it is */
  const CHIPS_CSS = S.minCSS(`
.ctl { position: relative; margin: 18px 0 0; padding: 26px 18px 34px 56px; }
.ctl-unit { position: absolute; left: 0; top: 0; margin: 0; font-family: var(--font-code); font-size: 11px; line-height: 16px; color: var(--muted); }
.ctl-plot { position: relative; height: 400px; }
.ctl-grid { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.ctl-grid line { stroke: var(--line); stroke-width: 1; vector-effect: non-scaling-stroke; }
.ctl-grid line.base { stroke: var(--rule-ink); }
.ctl-y { position: absolute; right: 100%; margin-right: 8px; transform: translateY(-50%); font-family: var(--font-code); font-size: 11px; line-height: 1; color: var(--muted); white-space: nowrap; }
.ctl-x { position: absolute; top: 100%; margin-top: 12px; transform: translateX(-50%); font-family: var(--font-code); font-size: 11px; line-height: 1; color: var(--muted); }
.ctl-yr { position: absolute; height: 0; border-top: 1.5px solid var(--line-2); }
.ctl-dot { position: absolute; z-index: 1; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; transform: translate(-50%, -50%); }
.ctl-dot i { display: block; width: 11px; height: 11px; border-radius: 50%; background: var(--ctx); }
.ctl-dot:hover i { background: var(--rule-ink); }
.ctl-dot.top i, .ctl-dot.top:hover i { width: 14px; height: 14px; background: var(--accent); } /* the largest value in wine, as the main page sets it */
.ctl-dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 0; }
.ctl-lab { position: absolute; display: none; white-space: nowrap; pointer-events: none; font-family: var(--font-label); font-weight: 400; font-size: 11.5px; line-height: 16px; color: var(--muted); }
.ctl-lab.top { font-size: 12.5px; font-weight: 600; color: var(--ink); }
.ctl-lab b { font-weight: 700; }
.ctl-lab.a-s { transform: translate(11px, -50%); }
.ctl-lab.a-e { transform: translate(calc(-100% - 11px), -50%); }
.ctl-lab.a-u { transform: translate(-50%, calc(-100% - 11px)); }
.ctl-lab.a-d { transform: translate(-50%, 11px); }
@media (min-width: 1024px) { .ctl-lab.in-w { display: block; } }
@media (min-width: 761px) and (max-width: 1023px) { .ctl-lab.in-m { display: block; } }
@media (max-width: 760px) { .ctl { padding: 26px 10px 34px 42px; } .ctl-plot { height: 280px; } .ctl-lab.in-p { display: block; } }
.ctl-none { margin: 16px 0 0; font-family: var(--font-label); font-size: 13.5px; line-height: 1.6; color: var(--ink-2); }
.ctl-none span { margin-right: 8px; font-family: var(--font-code); font-size: 12px; color: var(--muted); }
.ctl-none a { color: var(--ink); }
.ctl-note { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); }
`);
  const chips = (data.landscape || []).slice();
  const chipIds = new Map();
  function chipsPage() {
    const uid = idsFor();
    chips.forEach((c) => chipIds.set(c.id, uid(slug(c.id), 'chips')));
    // a figure as the data gives it, every digit kept (Landscape.nf: 2.039 stays 2.039); an axis tick is not a figure, so it may be rounded
    const nf = (v) => { const t = String(v), neg = t.charAt(0) === '-', p = (neg ? t.slice(1) : t).split('.'); return (neg ? '-' : '') + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); };
    const nfAxis = (v) => (Math.round(v * 100) / 100).toLocaleString('en-US');
    const sub = (t) => (t ? `<span class="sub">${t}</span>` : '');
    // the columns: the comparison's rows (Landscape.rows) for the fields the brief names, in the comparison's words
    const COLS = [
      { label: 'Vendor', key: 'vendor', html: (c) => esc(c.vendor) + sub(esc(cname(c.vendorCountry))) },
      { label: 'Announced', key: 'announced', html: (c) => (c.announced ? esc(String(c.announced).slice(0, 4)) : null) },
      // a part that is missing is said, as the comparison says it (Landscape.rows): "node not published", "assembler not published"
      { label: 'Foundry, process node', wide: true, key: 'process', html: (c) => { const p = c.process || {}; if (!p.foundry && !p.node) return null; return (p.foundry ? esc(p.foundry) : '<span class="nil">foundry not published</span>') + sub((p.node ? esc(p.node) + (p.foundry ? '' : '\u0001') : 'node not published') + (p.country ? ' · ' + esc(cname(p.country)) : '')); } },
      { label: 'Memory type', key: 'memtype', html: (c) => { const m = c.memory || {}; return m.type ? esc(m.type) + (m.stacks ? sub(m.stacks + ' stacks') : '') : null; } },
      { label: 'Memory, gigabytes', num: true, key: 'mem', val: (c) => (c.memory || {}).capacityGB },
      // each memory supplier carries the source the data names for it (cite.suppliers), as the main page marks it
      { label: 'Memory supplier', wide: true, own: true, html: (c) => { const s = (c.memory || {}).suppliers || []; return s.length ? s.map((x) => esc(x) + marksOf(c, citeOf(c, null, x))).join(', ') : null; } },
      { label: 'Package', wide: true, key: 'package', html: (c) => { const p = c.package || {}; if (!p.type && !p.assembler) return null; return (p.type ? esc(p.type) : '<span class="nil">type not published</span>') + sub(p.assembler ? 'assembled by ' + esc(p.assembler) + (p.type ? '' : '\u0001') : 'assembler not published'); } },
      { label: 'Bandwidth, terabytes/s', num: true, key: 'bw', val: (c) => (c.memory || {}).bandwidthTBs },
      { label: 'Speed at FP16, TFLOPS', num: true, fmt: 'fp16', key: 'fp16', val: (c) => (c.compute || {}).fp16TFLOPS },
      { label: 'Speed at FP8, TFLOPS', num: true, fmt: 'fp8', key: 'fp8', val: (c) => (c.compute || {}).fp8TFLOPS },
      { label: 'Speed at FP4, TFLOPS', num: true, fmt: 'fp4', key: 'fp4', val: (c) => (c.compute || {}).fp4TFLOPS },
      { label: 'Power, watts', num: true, key: 'tdp', val: (c) => c.tdpW },
    ];
    // an empty cell says which kind of empty it is (Landscape.nil): a format the hardware cannot run, or a figure no one has published
    const nil = (c, col) => (col.fmt && ((c.compute || {}).support || {})[col.fmt] === 'no' ? '<span class="nil">not supported</span>' : '<span class="nil">not published</span>');
    // the cell's sources, as the data names them (cite, by each source's number in the chip's list: "4, 12"), the main page's
    // rule (Landscape.citeOf); a cell the data sources nowhere points to the chip's whole list, [all], and is never guessed
    const markAt = (c, i) => { const s = (c.sources || [])[i], id = chipIds.get(c.id), l = String((s && s.label) || ''); return s ? `<sup class="cite"><a href="#${id}-s${i + 1}" title="Source: ${esc(l || s.url)}" aria-label="Source ${i + 1}: ${esc(l || s.url)}"><span class="br">[</span>${i + 1}<span class="br">]</span></a></sup>` : ''; };
    const citeOf = (c, key, sup) => { const C = c.cite || {}, v = sup != null ? (C.suppliers || {})[sup] : C[key], n = (c.sources || []).length; if (v == null || v === '') return null; const out = String(v).split(/\s*,\s*/).map((x) => +x - 1).filter((i) => i >= 0 && i < n); return out.length ? out : null; };
    const allMark = (c) => { const id = chipIds.get(c.id); return `<sup class="cite"><a href="#${id}-sources" title="Sources for the ${esc(c.name)}" aria-label="Sources for the ${esc(c.name)}"><span class="br">[</span>all<span class="br">]</span></a></sup>`; };
    // several sources share one mark, their numbers apart by commas, as the main page sets them
    const marksOf = (c, idx) => (idx ? (idx.length > 1 ? '<sup class="cite">' + idx.map((i) => markAt(c, i).replace(/^<sup class="cite">|<\/sup>$/g, '')).join('<span aria-hidden="true">,</span>') + '</sup>' : markAt(c, idx[0])) : allMark(c));
    const mark = (c, col) => ((c.sources || []).length && !col.own ? marksOf(c, citeOf(c, col.key)) : '');
    const cell = (c, col) => {
      if (col.num) { const v = col.val(c); return `<td class="num">${v == null ? nil(c, col) : esc(nf(v)) + mark(c, col)}</td>`; }
      const t = col.html(c);
      if (t == null || t === '') return `<td${col.wide ? ' class="wide"' : ''}>${nil(c, col)}</td>`;
      const at = t.indexOf('<span class="sub">'), m = mark(c, col); // the mark sits on the value, before its second line (\u0001 where the first line says the value is missing)
      return `<td${col.wide ? ' class="wide"' : ''}>${t.indexOf('\u0001') >= 0 ? t.replace('\u0001', m) : at >= 0 ? t.slice(0, at) + m + t.slice(at) : t + m}</td>`;
    };
    const rowHTML = (c) => `<tr id="${chipIds.get(c.id)}"><th scope="row"><a href="#${chipIds.get(c.id)}-sources">${esc(c.name)}</a>${c.family && c.family !== c.name ? sub(esc(c.family)) : ''}</th>${COLS.map((col) => cell(c, col)).join('')}</tr>`;
    /* the chart the interactive page opens with, at FP16 (the redesign's option C): every chip with a published figure at the
       month its maker announced it, the highest the one wine dot (rule B, wine since 28 Oct 2026), the rest the light tint. The marks are HTML set by
       percent over a grid drawn to fit, so the labels keep their size at every width; each width shows the labels that were placed
       clear of every dot and label at its narrowest (wide, medium; a phone names only the highest). Each dot links to its row. */
    const timeline = (() => {
      const unit = 'TFLOPS', val = (c) => (c.compute || {}).fp16TFLOPS;
      const when = (c) => { const a = String(c.announced || ''), y = +a.slice(0, 4), mo = a.length >= 7 ? +a.slice(5, 7) : 0; return { t: mo ? y + (mo - 0.5) / 12 : y + 0.5, yearOnly: !mo, y }; };
      const short = (c) => String(c.name).replace(/\s*\(.*\)\s*$/, ''); // Landscape.short
      const pts = chips.map((c) => ({ c, v: val(c), d: when(c) })), have = pts.filter((p) => typeof p.v === 'number' && p.d.y > 0);
      if (!have.length) { warn('reference pages: no chip has an FP16 figure, so /chips/ has no chart'); return ''; }
      const none = pts.filter((p) => !have.includes(p));
      const X0 = Math.min(...have.map((p) => p.d.y)), X1 = Math.max(...have.map((p) => p.d.y)) + 1;
      const max = Math.max(...have.map((p) => p.v));
      const nice = (v) => { const e = Math.pow(10, Math.floor(Math.log10(v))), f = v / e; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e; };
      const step = nice(max / 4), yMax = Math.ceil(max / step) * step;
      const fx = (t) => (t - X0) / (X1 - X0), fy = (v) => 1 - v / yMax, pc = (f) => (Math.round(f * 10000) / 100) + '%';
      const hi = have.find((p) => p.v === max);
      // a label's width in the interface face, estimated a little wide so the placing errs toward fewer labels
      const textW = (s, px) => [...String(s)].reduce((a, ch) => a + (/[0-9]/.test(ch) ? 0.6 : /[A-Z]/.test(ch) ? 0.66 : /[a-z]/.test(ch) ? 0.54 : ch === ' ' ? 0.28 : 0.34), 0) * px + 6;
      // place the labels for a plot W px wide and H px tall: the highest first, then by value, each where it clears the rest
      const place = (W, H, all) => {
        const boxes = have.map((p) => { const x = fx(p.d.t) * W, y = fy(p.v) * H; return [x - 8, y - 8, x + 8, y + 8]; });
        have.forEach((p) => { if (p.d.yearOnly) { const y = fy(p.v) * H; boxes.push([fx(p.d.y) * W + 3, y - 2, fx(p.d.y + 1) * W - 3, y + 2]); } });
        const clash = (b) => b[0] < -2 || b[2] > W + 12 || b[1] < -30 || b[3] > H || boxes.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
        const out = new Map();
        have.slice().sort((a, b) => (b.v === max) - (a.v === max) || b.v - a.v).forEach((p) => {
          const top = p.v === max; if (!all && !top) return;
          const fs = top ? 12.5 : 11.5, h = 16, w = textW(short(p.c) + (top ? ', ' + nf(p.v) : ''), fs), x = fx(p.d.t) * W, y = fy(p.v) * H, o = 11;
          const cands = [['s', [x + o, y - h / 2, x + o + w, y + h / 2]], ['e', [x - o - w, y - h / 2, x - o, y + h / 2]], ['u', [x - w / 2, y - o - h, x + w / 2, y - o]], ['d', [x - w / 2, y + o, x + w / 2, y + o + h]]];
          let pick = cands.find((cd) => !clash(cd[1]));
          if (!pick && top) pick = cands[1];
          if (!pick) return;
          boxes.push(pick[1]); out.set(p.c.id, pick[0]);
        });
        return out;
      };
      const tiers = [['w', place(870, 400, true)], ['m', place(620, 400, true)], ['p', place(236, 280, false)]];
      let grid = '';
      for (let yr = X0; yr <= X1; yr++) { const x = fx(yr) * 1000; grid += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="0" y2="1000"/>`; }
      for (let v = 0; v <= yMax + 1e-9; v += step) { const y = fy(v) * 1000; grid += `<line class="${v === 0 ? 'base' : ''}" x1="0" x2="1000" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }
      let marks = '';
      for (let v = 0; v <= yMax + 1e-9; v += step) marks += `<span class="ctl-y" style="top:${pc(fy(v))}">${esc(nfAxis(v))}</span>`;
      for (let yr = X0; yr < X1; yr++) marks += `<span class="ctl-x" style="left:${pc(fx(yr + 0.5))}">${yr}</span>`;
      have.filter((p) => p.d.yearOnly).forEach((p) => { marks += `<span class="ctl-yr" style="left:${pc(fx(p.d.y))};width:${pc(fx(p.d.y + 1) - fx(p.d.y))};top:${pc(fy(p.v))}" aria-hidden="true"></span>`; });
      have.forEach((p) => {
        const c = p.c, top = p.v === max;
        marks += `<a class="ctl-dot${top ? ' top' : ''}" href="#${chipIds.get(c.id)}" style="left:${pc(fx(p.d.t))};top:${pc(fy(p.v))}" aria-label="${esc(`${c.name}, ${[c.vendor, cname(c.vendorCountry), String(c.announced || '').slice(0, 4)].filter(Boolean).join(', ')}, ${nf(p.v)} ${unit}`)}"><i></i></a>`;
      });
      have.forEach((p) => {
        const top = p.v === max, at = tiers.filter(([, m]) => m.has(p.c.id));
        if (!at.length) return;
        // one label element per side it stands on; each width shows the ones placed for it
        const bySide = new Map(); at.forEach(([k, m]) => { const s = m.get(p.c.id); bySide.set(s, (bySide.get(s) || []).concat(k)); });
        bySide.forEach((ks, s) => { marks += `<span class="ctl-lab a-${s}${top ? ' top' : ''} ${ks.map((k) => 'in-' + k).join(' ')}" style="left:${pc(fx(p.d.t))};top:${pc(fy(p.v))}" aria-hidden="true">${esc(short(p.c))}${top ? `<b>, ${esc(nf(p.v))}</b>` : ''}</span>`; });
      });
      const links = (list) => list.map((p) => `<a href="#${chipIds.get(p.c.id)}">${esc(short(p.c))}</a>`).join(', ');
      const no = none.filter((p) => ((p.c.compute || {}).support || {}).fp16 === 'no'), np = none.filter((p) => !no.includes(p));
      const tid = uid('fp16-timeline', 'sections');
      return `<section class="ref-sec" aria-labelledby="${tid}"><h2 class="ref-h2" id="${tid}">Speed at FP16, by the month each chip was announced <small>${have.length} of ${chips.length} chips have a published figure</small></h2>`
        + `<figure class="ctl" role="group" aria-label="Speed at FP16 of ${have.length} chips, by the month each was announced"><p class="ctl-unit" aria-hidden="true">${unit}</p><div class="ctl-plot">`
        + `<svg class="ctl-grid" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">${grid}</svg>${marks}</div></figure>`
        + (np.length ? `<p class="ctl-none"><span>Not published at FP16</span> ${links(np)}</p>` : '') + (no.length ? `<p class="ctl-none"><span>Not supported at FP16</span> ${links(no)}</p>` : '')
        + `<p class="ref-sub ctl-note">A chip dated only to a year sits in that year's middle, on a line across the year. The highest value is the one colored dot.</p></section>`;
    })();
    const table = `<section class="ref-sec" aria-labelledby="specs"><h2 class="ref-h2" id="specs">Specs side by side <small>${chips.length} chips</small></h2>${specsSub ? `<p class="ref-sub">${specsSub}</p>` : ''}`
      + `<p class="ref-sub">Each figure carries the number of its source in the chip's list below.</p>`
      + `<div class="tbl chips-t" role="region" aria-labelledby="specs" tabindex="0"><table><thead><tr><th scope="col">Chip</th>${COLS.map((col) => `<th scope="col"${col.num ? ' class="num"' : ''}>${esc(col.label)}</th>`).join('')}</tr></thead><tbody>${chips.map(rowHTML).join('')}</tbody></table></div></section>`;
    // each chip's sources, numbered as the cells cite them, after its note on how the speed figures are measured
    const srcBlock = (c) => {
      const id = chipIds.get(c.id), srcs = c.sources || [];
      if (!srcs.length) warn(`reference pages: chip ${c.id} has no sources`);
      const pn = (c.compute || {}).precisionNote;
      return `<section id="${id}-sources" aria-labelledby="${id}-sources-h"><h3 id="${id}-sources-h">${esc(c.name)}<small>${esc([c.vendor, cname(c.vendorCountry)].filter(Boolean).join(' · '))}</small></h3>`
        + (pn ? `<p><b>How the speed figures are measured.</b> ${esc(pn)}</p>` : '')
        + (srcs.length ? `<ol>${srcs.map((s, i) => `<li id="${id}-s${i + 1}">${ext(s.url, esc(s.label || s.url))}</li>`).join('')}</ol>` : '') + '</section>';
    };
    const sources = `<section class="ref-sec" aria-labelledby="chip-sources"><h2 class="ref-h2" id="chip-sources">Sources <small>${chips.reduce((a, c) => a + (c.sources || []).length, 0)} sources for ${chips.length} chips</small></h2><div class="srcs">${chips.map(srcBlock).join('')}</div></section>`;
    const makers = new Set(chips.map((c) => c.vendor)).size;
    return page({
      slug: 'chips', route: '#/landscape', h1: 'AI Chips',
      ...titled('chips', [[/(\d+) AI chips/, chips.length, 'AI chips']], textOf(chipsDek)),
      dekHTML: chipsDek,
      facts: [`${chips.length} chips`, `${makers} makers`],
      ctaNote: 'The interactive page draws each chip\'s package to scale and sets up to four chips side by side.',
      body: timeline + table + sources, css: CHIPS_CSS,
      ld: dataset('AI accelerator specifications', `${chips.length} AI accelerators from ${makers} makers: the foundry, process node, memory type, capacity and suppliers, package and assembler, memory bandwidth, dense speed at FP16, FP8 and FP4, and power of each, with the sources for every figure.`,
        ['landscape.json'], ['Foundry', 'Process node', 'Memory', 'Memory bandwidth', 'Dense TFLOPS', 'Power']),
    });
  }

  /* ================= /glossary/ =================
     Since 30 Oct 2026 /glossary/ is the interactive Glossary itself, with every entry's words in its HTML (build/build.js
     writes it from src/template.html, as it writes the chapter pages). This module gives it what the static copy had: the
     chapters each term is read in (DATA.glossaryRefs, which the Glossary prints) and its head, with the approved title and
     description, the canonical, the Glossary's share card and the DefinedTermSet of every term (ctx.glossaryHead) */
  function glossaryPage() {
    const glossary = (ctx.data.glossary || ctx.readJSON(path.join(root, 'data', 'glossary.json'), []) || []).filter((g) => g && g.term);
    const terms = glossary.slice().sort((a, b) => a.term.localeCompare(b.term));
    // the chapters each term appears in, found as the Glossary finds its passages (src/modules/lookup.js): the term and its other
    // names, matched in the paragraphs and list items of each chapter's own text, a short name with capitals only as written
    const chapters = (ctx.all || []).filter((c) => c.rendered);
    const corpus = chapters.map((c) => {
      const r = c.rendered, html = [r.plain, r.inShort, r.prose].join('\n') // the prose holds the card, after the lead (build.js withCard)
        .replace(/<figure\b[\s\S]*?<\/figure>/g, ' ').replace(/<table\b[\s\S]*?<\/table>/g, ' ')
        .replace(/<sup class="cite(?:-sep)?">[\s\S]*?<\/sup>/g, '').replace(/<span class="(?:chip|lead-cn)"[^>]*>[\s\S]*?<\/span>/g, ' ');
      const paras = []; html.replace(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g, (m, t, inner) => { const s = textOf(inner).replace(/\s+([.,;:])/g, '$1'); if (s.length > 40) paras.push(s); return m; });
      return { c, paras };
    });
    const regex = (patterns) => {
      const parts = patterns.map((p) => {
        p = String(p).trim(); if (!p) return null;
        let e = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const bounded = /^[A-Za-z0-9]/.test(p) && /[A-Za-z0-9)]$/.test(p);
        if (p.length <= 4 && /[A-Z]/.test(p)) e = e.split('').map((ch) => (/[a-z]/i.test(ch) ? (/[A-Z]/.test(ch) ? ch : '[' + ch + ch.toUpperCase() + ']') : ch)).join('');
        return bounded ? '\\b' + e + '(?![A-Za-z0-9])' : e;
      }).filter(Boolean);
      if (!parts.length) return null;
      const short = patterns.some((p) => String(p).trim().length <= 4 && /[A-Z]/.test(p));
      return new RegExp(parts.join('|'), short ? '' : 'i');
    };
    const chapterOf = new Map(chapters.map((c) => [c.id, c]));
    // the chapters each term is read in: its own chapter, then the others whose text uses it. The Glossary prints these lines
    // (src/modules/lookup.js reads them from DATA.glossaryRefs, keyed by the term's own address)
    data.glossaryRefs = {};
    terms.forEach((g) => {
      // the other names the Glossary list searches by (build.js, the Glossary's rows): three letters or more, and not a plain lower-case word
      const akas = String(g.aka || '').split(/[;,]/).map((x) => x.trim()).filter((x) => x.length >= 3 && x.toLowerCase() !== g.term.toLowerCase() && !/^[a-z]+$/.test(x));
      const re = regex([g.term].concat(akas));
      const home = g.chapter && chapterOf.get(g.chapter);
      const used = re ? corpus.filter((k) => k.c !== home && k.paras.some((x) => re.test(x))).map((k) => k.c) : [];
      if (home || used.length) data.glossaryRefs['gl-' + slug(g.term)] = [home ? home.id : '', used.map((c) => c.id)];
    });
    // the page's head: as the static copy had it, with each term's address now its entry's (#gl-<slug>)
    const firstWord = (terms.find((g) => /^[A-Za-z]/.test(g.term)) || terms[0] || { term: '' }).term, lastWord = (terms[terms.length - 1] || { term: '' }).term;
    const t = titled('glossary', [[/(\d+) terms/, terms.length, 'terms']], `Plain definitions of ${terms.length} terms from the AI chip supply chain, from ${firstWord} to ${lastWord}.`);
    const p0 = manifest.get('glossary') || { slug: 'glossary', kind: 'view', title: 'Glossary', eyebrow: S.SITE, line: t.description, description: t.description, route: '#/glossary' };
    const p = Object.assign({}, p0, { seo: { title: t.shareTitle, description: t.description } }); // the share tags say what the search result says
    const url = BASE + 'glossary/';
    ctx.glossaryHead = (dates) => {
      const ld = {
        '@context': 'https://schema.org', '@type': 'DefinedTermSet', '@id': url + '#terms', name: 'Glossary of the AI chip supply chain', description: `Plain definitions of ${terms.length} terms from the AI chip supply chain.`,
        author: person, publisher: org, mainEntityOfPage: url,
        hasDefinedTerm: terms.map((g) => {
          const akas = String(g.aka || '').split(/[;,]/).map((x) => x.trim()).filter(Boolean);
          return Object.assign({ '@type': 'DefinedTerm', name: g.term, description: g.plain, url: url + '#gl-' + slug(g.term) }, akas.length ? { alternateName: akas } : {}); // nested in the set, so each term needs no id or set of its own
        }),
        url, inLanguage: 'en', datePublished: dates.published, dateModified: dates.modified, isPartOf: { '@type': 'WebSite', name: S.SITE, url: BASE },
      };
      return `<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="author" content="${esc(S.AUTHOR.name)}">
${S.shareTags(p, versions)}
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
    };
    return null; // build/build.js writes the page
  }

  /* ---------------- write ---------------- */
  // Suppliers first: the Glossary links to its firm and country anchors, and to the chips' rows
  const built = [['suppliers', suppliersPage], ['export-controls', controlsPage], ['chips', chipsPage], ['glossary', glossaryPage]];
  ctx.referencePages = [];
  const sizes = [];
  for (const [s, make] of built) {
    const html = make();
    ctx.referencePages.push('/' + s + '/');
    if (html === null) continue; // the Glossary: build/build.js writes it (glossaryPage)
    const dir = path.join(root, 'dist', s);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), keepRanges(html));
    const kb = Buffer.byteLength(html) / 1024;
    sizes.push(`${s} ${kb.toFixed(0)} KB`);
    if (kb > 400) warn(`reference page /${s}/ weighs ${kb.toFixed(0)} KB, over the 400 KB budget`);
    if (/<button\b(?![^>]*\bclass="theme-toggle")/.test(html)) warn(`reference page /${s}/ carries a button from the app`); // the masthead's theme button is the page's own (build/masthead.js)
    if (/\{\{REF:/.test(html)) warn(`reference page /${s}/ kept a placeholder`);
  }
  console.log('reference pages: ' + sizes.join(' · '));
  return {};
};
