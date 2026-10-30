// Release check: internal anchors resolve, data files agree with each other, ids referenced exist. node qa/scripts/check-integrity.js
// Exits 1 when it finds a problem that is not in ALLOWED below, so the deploy workflow stops; run it after the build.
const fs = require('fs');
process.chdir(require('path').resolve(__dirname, '..', '..')); // reads dist/, data/ and content/ from the repository root, wherever it is run from
// Known problems that are accepted on purpose, each with its reason. A problem goes here only when the data is right as it is.
const ALLOWED = {
  'exposure row for Veeco Instruments has no supplier entry': 'Veeco files a China share, so it has a China revenue panel, but it is not in the supplier list. data/exposure-notes.md classes it as Deposition & Etch.',
};
/* The pages: the home page (with the Glossary's two lists, which dist/assets/glossary.js puts into it when the Glossary opens),
   the contents page, dist/supply-chain/, and each chapter's own page, dist/<id>/index.html (since 28 Oct 2026, when the
   chapters and the contents left the home page). Each is read
   as markup only: the scripts' own strings are not links */
const markup = (f) => fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const glData = (() => { try { const w = {}; new Function('window', fs.readFileSync('dist/assets/glossary.js', 'utf8'))(w); return w.CP_GLOSSARY || {}; } catch (e) { return {}; } })();
const pages = [{ path: '/', html: markup('dist/index.html').replace(/(<ul\b[^>]*\bid="lk-items"[^>]*>)/, (m) => m + (glData.items || '')).replace(/(<dl\b[^>]*\bid="glossary"[^>]*>)/, (m) => m + (glData.terms || '')) }];
fs.readdirSync('dist').filter((d) => fs.existsSync(`dist/${d}/index.html`) && /<article class="chapter[^"]*" id="|<div class="contents" id="contents"/.test(fs.readFileSync(`dist/${d}/index.html`, 'utf8')) && d !== 'book')
  .forEach((d) => pages.push({ path: `/${d}/`, html: markup(`dist/${d}/index.html`) }));
pages.forEach((p) => { p.ids = new Set((p.html.match(/\sid="([^"]+)"/g) || []).map((m) => m.slice(5, -1))); });
const byPath = new Map(pages.map((p) => [p.path, p]));
const html = pages.map((p) => p.html).join('\n'); // every page's markup, for the checks that look across them
const ids = new Set([].concat(...pages.map((p) => [...p.ids])));
const views = new Set((html.match(/data-view="([^"]+)"/g) || []).map((m) => m.slice(11, -1)));
const problems = [];
// 1. internal hrefs: a fragment on its own page, a route on the home page, and a link to another page (a chapter's, at an
//    anchor) to a page in dist/ that holds the anchor
const routes = new Set(['/', '/home', '/stack', '/chain', '/intro', '/walk', '/briefing', '/landscape', '/ai-chips', '/suppliers', '/geopolitics', '/controls', '/export-controls', '/thresholds', '/exposure', '/glossary', '/sources']); // Router VIEWS in src/app.js
const badHref = {};
const bad = (p, h) => { const k = `${h} on ${p.path}`; badHref[k] = (badHref[k] || 0) + 1; };
const routeOk = (b) => routes.has('/' + b.split('?')[0].split('/')[1]);
pages.forEach((p) => {
  (p.html.match(/href="[^"]*"/g) || []).map((m) => m.slice(6, -1).replace(/&amp;/g, '&')).forEach((h) => {
    if (h === '#' || h === '' || /^([a-z][a-z0-9+.-]*:)/i.test(h)) return; // a web link, mail or a data: file
    const at = h.indexOf('#'), where = at < 0 ? h : h.slice(0, at), frag = at < 0 ? '' : h.slice(at + 1);
    let target = p;
    if (where) {
      const u = new URL(where, 'http://x' + p.path).pathname; // the path from the root
      if (/\/$/.test(u)) { if (!fs.existsSync('dist' + u + 'index.html')) { bad(p, h); return; } target = byPath.get(u) || null; }
      else { if (!fs.existsSync('dist' + decodeURIComponent(u))) bad(p, h); return; }
    }
    if (!frag || !target) return;
    if (frag.startsWith('/')) { if (target.path !== '/' || !routeOk(frag)) bad(p, h); return; }
    let id = frag; try { id = decodeURIComponent(frag); } catch (e) { }
    // the Glossary's A to Z index: an address on the home page with no element behind it (#a-z, #a-z/firms, #a-z/s; src/modules/lookup.js)
    if (target.path === '/' && /^a-z(\/(terms|firms|ai-chips|countries|0-9|[a-z]))?$/.test(id)) return;
    if (!target.ids.has(id)) bad(p, h);
  });
});
Object.keys(badHref).forEach((h) => problems.push(`internal link to nothing: ${h} (${badHref[h]}x)`));
// 2. data cross-references
const J = (f) => JSON.parse(fs.readFileSync('data/' + f, 'utf8'));
const flows = J('control-flows.json').flows, events = J('export-controls-timeline.json'), glossary = J('glossary.json'), suppliers = J('suppliers.json'), landscape = J('landscape.json'), matrix = J('chokepoint-matrix.json'), exposure = J('exposure.json');
const evIds = new Set((events.events || events).map((e) => e.id));
const chapterIds = new Set((html.match(/<article class="chapter" id="([^"]+)"/g) || []).map((m) => m.match(/id="([^"]+)"/)[1]));
flows.forEach((f) => { if (f.chapter && !chapterIds.has(f.chapter)) problems.push(`flow ${f.id}: chapter ${f.chapter} does not exist`); f.states.forEach((s) => { if (s.event && !evIds.has(s.event)) problems.push(`flow ${f.id}: state ${s.date} cites event ${s.event}, not in the timeline`); if (!['open', 'restricted', 'case', 'denial', 'prohibited', 'policy'].includes(s.status)) problems.push(`flow ${f.id}: status ${s.status}`); if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date)) problems.push(`flow ${f.id}: date ${s.date}`); if (s.suspendedUntil && !/^\d{4}-\d{2}-\d{2}$/.test(s.suspendedUntil)) problems.push(`flow ${f.id}: suspendedUntil ${s.suspendedUntil}`); }); });
(J('control-flows.json').upcoming || []).forEach((u) => { if (u.event && !evIds.has(u.event)) problems.push(`upcoming ${u.date}: event ${u.event}, not in the timeline`); if (!/^\d{4}-\d{2}-\d{2}$/.test(u.date)) problems.push(`upcoming: date ${u.date}`); });
(events.events || events).forEach((e) => { (e.flows || []).forEach((fid) => { if (!flows.some((f) => f.id === fid)) problems.push(`event ${e.id}: flow ${fid} does not exist`); }); if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) problems.push(`event ${e.id}: date ${e.date}`); });
glossary.forEach((g) => { if (g.chapter && g.chapter !== 'introduction-and-goals' && !chapterIds.has(g.chapter)) problems.push(`glossary ${g.term}: chapter ${g.chapter} does not exist`); });
// glossary terms the prose points at
const termRefs = new Set((html.match(/data-term="([^"]+)"/g) || []).map((m) => m.slice(11, -1)));
const termNames = new Set(glossary.map((g) => g.term.toLowerCase()));
termRefs.forEach((t) => { if (!termNames.has(t.toLowerCase())) problems.push(`popover points at a term with no entry: ${t}`); });
// country codes
const COUNTRY = new Set(['US', 'NL', 'JP', 'TW', 'KR', 'CN', 'DE', 'GB', 'IL', 'AT', 'MY', 'SG', 'FR', 'CH', 'IE', 'IN', 'VN', 'TH', 'PH', 'MX', 'CA', 'BE', 'IT', 'SE', 'FI', 'DK', 'AE', 'SA', 'AU', 'HK', 'NO', 'CZ', 'HU', 'ES', 'RU', 'UA', 'BR']);
suppliers.forEach((s) => { if (!COUNTRY.has(s.country)) problems.push(`supplier ${s.name}: country ${s.country}`); if (s.revenueUSDb != null && (s.revenueUSDb <= 0 || s.revenueUSDb > 1000)) problems.push(`supplier ${s.name}: revenue ${s.revenueUSDb}`); });
// a firm on the China revenue panel is in the supplier list under its own name, an alias or a division of it (Cadence Design
// Systems, Samsung Memory), joined by build/exposure.js as the site joins them; one line for each firm that is not
const exJoin = require('../../build/exposure.js').exposureIndex(exposure);
const supNames = new Set(suppliers.map((s) => s.name).concat(suppliers.map((s) => exJoin.firmOf(s.name)).filter(Boolean)));
[...new Set(exposure.map((r) => r.firm))].forEach((f) => { if (!supNames.has(f)) problems.push(`exposure row for ${f} has no supplier entry`); });
exposure.forEach((r) => { if (r.chinaShare != null && (r.chinaShare < 0 || r.chinaShare > 100)) problems.push(`exposure ${r.firm} ${r.fiscalYear}: share ${r.chinaShare}`); if (r.chinaRevenue != null && r.totalRevenue && Math.abs(r.chinaRevenue / r.totalRevenue * 100 - r.chinaShare) > 0.15) problems.push(`exposure ${r.firm} ${r.fiscalYear}: share ${r.chinaShare} vs computed ${(r.chinaRevenue / r.totalRevenue * 100).toFixed(1)}`); });
matrix.forEach((m) => { if (m.shares) { const sum = Object.values(m.shares).filter((v) => typeof v === 'number').reduce((a, b) => a + b, 0); if (Math.abs(sum - 100) > 1.5) problems.push(`matrix ${m.segment}: shares sum to ${sum}`); if (!m.basis) problems.push(`matrix ${m.segment}: no basis`); if (!m.sources || !m.sources.length) problems.push(`matrix ${m.segment}: no sources`); } });
landscape.forEach((c) => { const k = c.compute || {}; const tpp = Math.max(8 * (k.fp8TFLOPS || 0), 16 * (k.fp16TFLOPS || 0), 4 * (k.fp4TFLOPS || 0)); if (c.tpp != null && Math.abs(c.tpp - tpp) > 1) problems.push(`chip ${c.id}: tpp ${c.tpp} vs computed ${tpp}`); if (!c.sources || !c.sources.length) problems.push(`chip ${c.id}: no sources`); });
// duplicate ids in a page
pages.forEach((p) => { const all = (p.html.match(/\sid="([^"]+)"/g) || []).map((m) => m.slice(5, -1)); const seen = {}; all.forEach((i) => { seen[i] = (seen[i] || 0) + 1; }); Object.keys(seen).filter((i) => seen[i] > 1).forEach((i) => problems.push(`duplicate id ${i} on ${p.path} (${seen[i]}x)`)); });
// placeholders left in the build
(html.match(/\{\{[A-Z_]+\}\}/g) || []).forEach((p) => problems.push(`unfilled placeholder ${p}`));
if (/undefined|\bNaN\b|\[object Object\]/.test(html)) problems.push('the page text contains "undefined", "NaN" or "[object Object]"');
// 3. chapter figures that restate the Export Controls data must agree with it, so the two can never show different numbers.
//    A bar labelled "<Firm>, <year or FYyear>" whose firm is in data/exposure.json must show that row's China share (to its precision);
//    a timeline figure's dates must each be the date of an entry in data/export-controls-timeline.json.
{
  const exposure = J('exposure.json');
  const evDates = new Set((events.events || events).map((e) => e.date)); // the date a rule took effect, or the announcement date the board records for it
  flows.forEach((fl) => fl.states.forEach((st) => { if (st.announced && st.event) evDates.add(st.announced); }));
  for (const f of fs.readdirSync('content').filter((x) => /^\d\d-.*\.md$/.test(x))) {
    const src = fs.readFileSync('content/' + f, 'utf8'); const a = src.indexOf('---json\n'); const b = src.indexOf('\n---', a + 8);
    let fm; try { fm = JSON.parse(src.slice(a + 8, b)); } catch (e) { continue; }
    for (const fig of fm.figures || []) {
      if ((fig.type === 'bars' || fig.type === 'change') && /China'?s share of revenue/i.test(fig.title || '')) {
        for (const [label, v] of fig.data || []) {
          const m = String(label).match(/^(.+?),\s*(?:FY)?(\d{4})$/); if (!m) continue;
          const row = exposure.find((r) => r.firm === m[1] && r.fiscalYear === 'FY' + m[2]);
          if (!row) { problems.push(`${f} figure ${fig.id}: "${label}" has no row in data/exposure.json`); continue; }
          const dp = (String(v).split('.')[1] || '').length, want = Math.round(row.chinaShare * 10 ** dp) / 10 ** dp;
          if (Math.abs(v - want) > 1e-9) problems.push(`${f} figure ${fig.id}: "${label}" shows ${v}, data/exposure.json has ${row.chinaShare}`);
        }
      }
      if (fig.type === 'timeline' && /export controls/i.test(fig.title || '')) {
        for (const [d, what] of fig.data || []) if (!evDates.has(d)) problems.push(`${f} figure ${fig.id}: ${d} (${what}) is not the date of any Export Controls timeline entry or its recorded announcement`);
      }
    }
  }
}
// 4. The chokepoint cards' source fields and page numbers (qa/round2/SCHEMA.md §1 and §2).
//    Problems: a card url the chapter's body does not cite (exact string), a field whose url count differs from its sentence
//    count, a costLabel other than "Key figure", a #page that is not a positive integer (on the card, in the body, on a figure).
//    Warnings (printed, not counted): a card url that differs from a body citation only in its #fragment, and a figure in a
//    leader's share, costSignal, chinaStatus or usStatus with no year beside it.
{
  const cardWarn = [];
  // the build's sentence rule (build/build.js cardSentences): . ! or ? then a space and a capital, a digit, a currency sign or an opening quote
  const sentences = (t) => String(t || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[\p{Lu}\p{Nd}\p{Sc}"“‘'])/u).filter(Boolean);
  const CITE = /\(\s*\[(?:source|Source|src)\]\((https?:[^)\s]+)\)\s*\)|\[(?:source|Source|src)\]\((https?:[^)\s]+)\)/g; // as build.js inline() reads them
  const bare = (u) => String(u).replace(/#.*$/, '');
  const badPage = (u) => { const m = String(u).match(/#(?:[^#]*&)?page=([^&#]*)/); return m && !/^[1-9]\d*$/.test(m[1]) ? m[1] : null; };
  // a figure is a number standing alone or with its unit (a digit inside a name such as H100, N2, N+3, 18A or HBM3E is not
  // one), a percent sign, a currency sign or "bn"; its year is a four-digit year, "FY", "fiscal" or a quarter
  const FIGURE = /(?<!\p{L}[+-])(?<![\p{L}\d])\d[\d,.]*(?:(?!\.?[\p{L}\d])|\s?(?:bn|nm|mm|percent)\b)|%|[$€¥₩]|\bbn\b/u;
  const YEAR = /\b(?:19|20)\d{2}\b|\bFY|\bfiscal\b|\b[1-4]Q\d{2}\b|\bQ[1-4]\b|\b(?:first|second|third|fourth) quarter\b/i;
  const short = (s) => (s.length > 90 ? s.slice(0, 88) + '…' : s);
  for (const f of fs.readdirSync('content').filter((x) => /^\d\d-.*\.md$/.test(x)).sort()) {
    const src = fs.readFileSync('content/' + f, 'utf8'); const a = src.indexOf('---json\n'); const b = src.indexOf('\n---', a + 8);
    let fm; try { fm = JSON.parse(src.slice(a + 8, b)); } catch (e) { continue; }
    const body = src.slice(b + 4), cited = []; let m;
    while ((m = CITE.exec(body))) cited.push(m[1] || m[2]);
    const pageCheck = (u, where) => { const p = badPage(u); if (p != null) problems.push(`${f} ${where}: #page=${p} is not a positive integer: ${u}`); };
    [...new Set(cited)].forEach((u) => pageCheck(u, 'body'));
    (fm.figures || []).forEach((fig) => { if (fig.source && fig.source.url) pageCheck(fig.source.url, `figure ${fig.id}`); });
    const c = fm.card;
    if (!c || !require('../../build/stages.js').isStage(fm)) continue; // the stages carry the card (build/stages.js)
    if (c.costLabel !== undefined && c.costLabel !== 'Key figure') problems.push(`${f} card: costLabel is "${c.costLabel}"; the only label allowed is "Key figure"`);
    const sb = c.substitutability || {};
    const fields = [['substitutability.test', sb.test, sb.testSources, 'testSources'], ['costSignal', c.costSignal, c.costSources, 'costSources'],
      ...(c.leaders || []).map((l, i) => [`leaders[${i}] (${l.name}) share`, l.share, l.source === undefined ? undefined : [l.source], 'source']),
      ['substitutability.why', sb.why, sb.whySources, 'whySources'], ['chinaStatus', c.chinaStatus, c.chinaSources, 'chinaSources'], ['usStatus', c.usStatus, c.usSources, 'usSources']];
    const none = fields.every(([, , urls]) => urls === undefined);
    if (none) problems.push(`${f} card: no source fields yet (SCHEMA §1)`);
    for (const [what, text, urls, key] of none ? [] : fields) {
      if (urls !== undefined && !Array.isArray(urls)) { problems.push(`${f} card ${what}: ${key} must be a list of urls`); continue; }
      const list = (urls || []).filter((u) => typeof u === 'string' && u), n = text ? sentences(text).length : 0;
      if (list.length !== n) problems.push(`${f} card ${what}: ${n} sentence${n === 1 ? '' : 's'}, ${list.length} url${list.length === 1 ? '' : 's'} in ${key}`);
      for (const u of list) {
        pageCheck(u, `card ${what}`);
        if (cited.includes(u)) continue;
        const near = cited.find((x) => bare(x) === bare(u));
        if (near) cardWarn.push(`${f} card ${what}: ${u} differs only in its fragment from the body's citation ${near}`);
        else problems.push(`${f} card ${what}: ${u} is not cited in the chapter's body`);
      }
    }
    // a year on every figure: each sentence of a share, the cost slot and the China and US lines
    [...(c.leaders || []).map((l) => [`${l.name} share`, l.share]), ['costSignal', c.costSignal], ['chinaStatus', c.chinaStatus], ['usStatus', c.usStatus]].forEach(([what, text]) => {
      sentences(text).forEach((s) => { if (FIGURE.test(s) && !YEAR.test(s)) cardWarn.push(`${f} card ${what}: a figure with no year: "${short(s)}"`); });
    });
  }
  cardWarn.forEach((w) => console.log('warn: ' + w));
}
const allowed = problems.filter((p) => ALLOWED[p]), errors = problems.filter((p) => !ALLOWED[p]);
allowed.forEach((p) => console.log(`allowed: ${p}. Reason: ${ALLOWED[p]}`));
Object.keys(ALLOWED).filter((p) => !problems.includes(p)).forEach((p) => console.log(`note: the allowed problem "${p}" no longer occurs; remove it from ALLOWED`));
console.log(errors.length ? errors.join('\n') : 'integrity: no problems'); console.log(`pages: ${pages.length} · views: ${[...views].join(', ')} · ids: ${ids.size} · chapters: ${chapterIds.size}`);
if (errors.length) { console.error(`check-integrity: ${errors.length} problem${errors.length === 1 ? '' : 's'}`); process.exit(1); }
