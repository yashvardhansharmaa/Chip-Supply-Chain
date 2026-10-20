// Release check: internal anchors resolve, data files agree with each other, ids referenced exist. node qa/scripts/check-integrity.js
const fs = require('fs');
const raw = fs.readFileSync('dist/index.html', 'utf8');
const html = raw.replace(/<script[\s\S]*?<\/script>/g, ''); // markup only; the bundle's own strings are not links
const ids = new Set((html.match(/\sid="([^"]+)"/g) || []).map((m) => m.slice(5, -1)));
const views = new Set((html.match(/data-view="([^"]+)"/g) || []).map((m) => m.slice(11, -1)));
const problems = [];
// 1. internal hrefs
const hrefs = (html.match(/href="#[^"]*"/g) || []).map((m) => m.slice(6, -1));
const routes = new Set(['/', '/stack', '/chain', '/intro', '/walk', '/briefing', '/landscape', '/suppliers', '/geopolitics', '/controls', '/thresholds', '/exposure', '/glossary', '/sources']);
const badHref = {};
hrefs.forEach((h) => { if (h === '#' || h === '') return; const b = h.slice(1); if (b.startsWith('/')) { const top = '/' + b.split('?')[0].split('/')[1]; if (!routes.has(top)) badHref[h] = (badHref[h] || 0) + 1; } else if (!ids.has(b)) badHref[h] = (badHref[h] || 0) + 1; });
Object.keys(badHref).forEach((h) => problems.push(`internal link to nothing: ${h} (${badHref[h]}x)`));
// 2. data cross-references
const J = (f) => JSON.parse(fs.readFileSync('data/' + f, 'utf8'));
const flows = J('control-flows.json').flows, events = J('export-controls-timeline.json'), glossary = J('glossary.json'), suppliers = J('suppliers.json'), landscape = J('landscape.json'), matrix = J('chokepoint-matrix.json'), exposure = J('exposure.json');
const evIds = new Set((events.events || events).map((e) => e.id));
const chapterIds = new Set((html.match(/<article class="chapter" id="([^"]+)"/g) || []).map((m) => m.match(/id="([^"]+)"/)[1]).concat(ids.has('geopolitics') ? ['geopolitics'] : []));
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
// duplicate ids in the page
const all = (html.match(/\sid="([^"]+)"/g) || []).map((m) => m.slice(5, -1)); const seen = {}; all.forEach((i) => { seen[i] = (seen[i] || 0) + 1; }); Object.keys(seen).filter((i) => seen[i] > 1).forEach((i) => problems.push(`duplicate id ${i} (${seen[i]}x)`));
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
      if (fig.type === 'bars' && /China'?s share of revenue/i.test(fig.title || '')) {
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
    if (!c || !(fm.number >= 1 && fm.number <= 15)) continue; // the fifteen stages carry the card
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
console.log(problems.length ? problems.join('\n') : 'integrity: no problems'); console.log(`views: ${[...views].join(', ')} · ids: ${ids.size} · chapters: ${chapterIds.size}`);
