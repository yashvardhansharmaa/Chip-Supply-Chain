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
flows.forEach((f) => { if (f.chapter && !chapterIds.has(f.chapter)) problems.push(`flow ${f.id}: chapter ${f.chapter} does not exist`); f.states.forEach((s) => { if (s.event && !evIds.has(s.event)) problems.push(`flow ${f.id}: state ${s.date} cites event ${s.event}, not in the timeline`); if (!['open', 'case', 'denial', 'prohibited', 'policy'].includes(s.status)) problems.push(`flow ${f.id}: status ${s.status}`); if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date)) problems.push(`flow ${f.id}: date ${s.date}`); if (s.suspendedUntil && !/^\d{4}-\d{2}-\d{2}$/.test(s.suspendedUntil)) problems.push(`flow ${f.id}: suspendedUntil ${s.suspendedUntil}`); }); });
(events.events || events).forEach((e) => { (e.flows || []).forEach((fid) => { if (!flows.some((f) => f.id === fid)) problems.push(`event ${e.id}: flow ${fid} does not exist`); }); if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) problems.push(`event ${e.id}: date ${e.date}`); });
glossary.forEach((g) => { if (g.chapter && g.chapter !== 'introduction-and-goals' && !chapterIds.has(g.chapter)) problems.push(`glossary ${g.term}: chapter ${g.chapter} does not exist`); });
// glossary terms the prose points at
const termRefs = new Set((html.match(/data-term="([^"]+)"/g) || []).map((m) => m.slice(11, -1)));
const termNames = new Set(glossary.map((g) => g.term.toLowerCase()));
termRefs.forEach((t) => { if (!termNames.has(t.toLowerCase())) problems.push(`popover points at a term with no entry: ${t}`); });
// country codes
const COUNTRY = new Set(['US', 'NL', 'JP', 'TW', 'KR', 'CN', 'DE', 'GB', 'IL', 'AT', 'MY', 'SG', 'FR', 'CH', 'IE', 'IN', 'VN', 'TH', 'PH', 'MX', 'CA', 'BE', 'IT', 'SE', 'FI', 'DK', 'AE', 'SA', 'AU', 'HK', 'NO', 'CZ', 'HU', 'ES', 'RU', 'UA', 'BR']);
suppliers.forEach((s) => { if (!COUNTRY.has(s.country)) problems.push(`supplier ${s.name}: country ${s.country}`); if (s.revenueUSDb != null && (s.revenueUSDb <= 0 || s.revenueUSDb > 1000)) problems.push(`supplier ${s.name}: revenue ${s.revenueUSDb}`); });
const supNames = new Set(suppliers.map((s) => s.name));
exposure.forEach((r) => { if (!supNames.has(r.firm)) problems.push(`exposure row for ${r.firm} has no supplier entry`); if (r.chinaShare != null && (r.chinaShare < 0 || r.chinaShare > 100)) problems.push(`exposure ${r.firm} ${r.fiscalYear}: share ${r.chinaShare}`); if (r.chinaRevenue != null && r.totalRevenue && Math.abs(r.chinaRevenue / r.totalRevenue * 100 - r.chinaShare) > 0.15) problems.push(`exposure ${r.firm} ${r.fiscalYear}: share ${r.chinaShare} vs computed ${(r.chinaRevenue / r.totalRevenue * 100).toFixed(1)}`); });
matrix.forEach((m) => { if (m.shares) { const sum = Object.values(m.shares).filter((v) => typeof v === 'number').reduce((a, b) => a + b, 0); if (Math.abs(sum - 100) > 1.5) problems.push(`matrix ${m.segment}: shares sum to ${sum}`); if (!m.basis) problems.push(`matrix ${m.segment}: no basis`); if (!m.sources || !m.sources.length) problems.push(`matrix ${m.segment}: no sources`); } });
landscape.forEach((c) => { const k = c.compute || {}; const tpp = Math.max(8 * (k.fp8TFLOPS || 0), 16 * (k.fp16TFLOPS || 0), 4 * (k.fp4TFLOPS || 0)); if (c.tpp != null && Math.abs(c.tpp - tpp) > 1) problems.push(`chip ${c.id}: tpp ${c.tpp} vs computed ${tpp}`); if (!c.sources || !c.sources.length) problems.push(`chip ${c.id}: no sources`); });
// duplicate ids in the page
const all = (html.match(/\sid="([^"]+)"/g) || []).map((m) => m.slice(5, -1)); const seen = {}; all.forEach((i) => { seen[i] = (seen[i] || 0) + 1; }); Object.keys(seen).filter((i) => seen[i] > 1).forEach((i) => problems.push(`duplicate id ${i} (${seen[i]}x)`));
// placeholders left in the build
(html.match(/\{\{[A-Z_]+\}\}/g) || []).forEach((p) => problems.push(`unfilled placeholder ${p}`));
if (/undefined|\bNaN\b|\[object Object\]/.test(html)) problems.push('the page text contains "undefined", "NaN" or "[object Object]"');
console.log(problems.length ? problems.join('\n') : 'integrity: no problems'); console.log(`views: ${[...views].join(', ')} · ids: ${ids.size} · chapters: ${chapterIds.size}`);
