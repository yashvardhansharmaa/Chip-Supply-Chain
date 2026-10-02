#!/usr/bin/env node
/* Writing report: lists the habits that make prose read as machine-written or hard going, file by file.
 * It never fails a build; it is a worklist for an editing pass and a before/after measure. check-speak.js holds the hard rules.
 * Scans chapter prose (front matter text fields and body), the prose fields of the data files, and the notes the build renders.
 * usage: node qa/scripts/style-report.js [--json out.json] [--file content/04-lithography.md] [--summary] */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };

// Each entry: [label, regex]. Words are matched as whole words, case-insensitive unless the pattern says otherwise.
const W = (list) => new RegExp('\\b(?:' + list.join('|') + ')\\b', 'gi');
const TELLS = [
  ['inflated word', W(['landscape', 'ecosystems?', 'robust', 'pivotal', 'crucial(?:ly)?', 'underscores?', 'underscored', 'highlights?', 'highlighted', 'leverag(?:e|es|ed|ing)', 'utili[sz](?:e|es|ed|ing|ation)', 'facilitat(?:e|es|ed|ing)', 'seamless(?:ly)?', 'foster(?:s|ed|ing)?', 'bolster(?:s|ed|ing)?', 'navigat(?:e|es|ing) (?:the|a|an)', 'unlock(?:s|ed|ing)?', 'harness(?:es|ed|ing)?', 'myriad', 'realm', 'delv(?:e|es|ing)', 'tapestry', 'intricate', 'meticulous(?:ly)?', 'comprehensive', 'multifaceted', 'holistic', 'streamlin(?:e|es|ed|ing)', 'spearhead(?:s|ed|ing)?', 'paradigm', 'synerg(?:y|ies)', 'game-changer', 'vital', 'paramount', 'profound(?:ly)?', 'remarkabl(?:e|y)', 'notabl(?:e|y)', 'striking(?:ly)?', 'dramatic(?:ally)?', 'unprecedented', 'cutting-edge', 'key role', 'plays? an? (?:\\w+ )?role', 'serves? as', 'stands? as', 'boasts?', 'testament', 'hallmark', 'cornerstone', 'linchpin', 'backbone', 'bedrock', 'lifeblood'])],
  ['vague quantity', W(['significant(?:ly)?', 'substantial(?:ly)?', 'various', 'numerous', 'a range of', 'a variety of', 'a number of', 'a host of', 'considerabl(?:e|y)', 'increasingly', 'growing number'])],
  ['filler or hedge', W(['essentially', 'effectively', 'actually', 'basically', 'simply', 'really', 'quite', 'rather', 'somewhat', 'relatively', 'fairly', 'very', 'arguably', 'in fact', 'indeed', 'of course', 'obviously', 'clearly', 'in turn', 'as such', 'in practice', 'in short', 'in effect', 'at scale', 'going forward', 'to date', 'per se', 'overall'])],
  ['stiff connective', W(['moreover', 'furthermore', 'additionally', 'in addition', 'thus', 'hence', 'thereby', 'whereby', 'wherein', 'therein', 'accordingly', 'consequently', 'nonetheless', 'notwithstanding', 'albeit', 'amid', 'amidst'])],
  ['wordy phrase', W(['in order to', 'due to the fact', 'the fact that', 'in terms of', 'with respect to', 'with regard to', 'in the event that', 'prior to', 'subsequent to', 'at this point in time', 'for the purpose of', 'is able to', 'are able to', 'has the ability to', 'the ability to', 'in the case of', 'on the basis of', 'a majority of', 'the majority of', 'in excess of', 'a total of'])],
  ['set-up phrase', /\b(?:This means|That means|which means|What this means|The result is|The upshot|The catch|The reason is|The answer is|Put simply|Put another way|The point is|The key (?:is|point|question)|What matters|Here is|Here's|It is (?:\w+ )?(?:that|which|because)|There (?:is|are|was|were) (?:\w+ ){0,3}(?:that|which|who))\b/g],
  ['colon punchline', /:\s+[a-z][^.;:\n]{0,48}\.(?=\s|$)/g],
  ['semicolon', /;/g],
  ['passive with by', /\b(?:is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en|wn|lt|ught)\s+by\b/gi],
];

const strip = (s) => String(s)
  .replace(/\(\[source\]\([^)]*\)\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\{\{[^}]+\}\}/g, '')
  .replace(/[*_`]/g, '')
  .replace(/[“"][^”"\n]{1,600}[”"]/g, (m) => ' '.repeat(m.length)); // quotations are someone else's words

// Rough sentence split that survives common abbreviations and decimals.
const ABBR = /\b(?:U\.S|U\.K|e\.g|i\.e|Inc|Corp|Ltd|Co|No|vs|approx|Fig|St|Mr|Ms|Dr|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.$/;
function sentences(text) {
  const out = []; let cur = '';
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z0-9“"(])/);
  for (const p of parts) { cur = cur ? cur + ' ' + p : p; if (!ABBR.test(cur.trim())) { out.push(cur.trim()); cur = ''; } }
  if (cur.trim()) out.push(cur.trim());
  return out.filter((s) => /[a-z]/i.test(s));
}
const words = (s) => (s.match(/[A-Za-z0-9$%][\w$%.,'’-]*/g) || []).length;

const report = {}; // file -> { words, sentences, long: [...], tells: [[label, snippet]], paras }
function add(file, where, raw, isPara) {
  const text = strip(raw).replace(/\s+/g, ' ').trim();
  if (!text || !/\s/.test(text)) return;
  const r = report[file] || (report[file] = { words: 0, sentences: 0, long: [], tells: [], longParas: [] });
  const ss = sentences(text);
  r.words += words(text); r.sentences += ss.length;
  for (const s of ss) { const n = words(s); if (n > 32) r.long.push([where, n, s.length > 240 ? s.slice(0, 237) + '...' : s]); }
  if (isPara && ss.length > 5) r.longParas.push([where, ss.length, text.slice(0, 120) + '...']);
  for (const [label, re] of TELLS) {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'); let m;
    while ((m = g.exec(text))) {
      const a = Math.max(0, m.index - 50), b = Math.min(text.length, m.index + m[0].length + 50);
      r.tells.push([label, where, '...' + text.slice(a, b) + '...']);
      if (!m[0].length) g.lastIndex++;
    }
  }
}

// ---- chapters ----
const PROSE_KEYS = /^(oneLiner|plain|fact|caption|text|note|notes|summary|why|what|detail|description|body|chinaStatus|usStatus|costSignal|substitutability|bottleneck|status|takeaway|lead|alt|question|answer|definition|explain|explanation|label)$/i;
function walkFront(v, file, where, key) {
  if (typeof v === 'string') { if ((PROSE_KEYS.test(key || '') || v.length > 60) && /\s/.test(v) && !/^https?:/.test(v)) add(file, where, v, false); return; }
  if (Array.isArray(v)) return v.forEach((x, i) => walkFront(x, file, `${where}[${i}]`, key));
  if (v && typeof v === 'object') for (const k of Object.keys(v)) if (!/^(id|url|href|source|sources|figure|type|kind|data|unit|color)$/i.test(k)) walkFront(v[k], file, `${where}.${k}`, k);
}
for (const f of fs.readdirSync(path.join(root, 'content')).filter((x) => /\.md$/.test(x))) {
  const file = `content/${f}`, s = fs.readFileSync(path.join(root, file), 'utf8');
  const a = s.indexOf('---json\n'), b = a >= 0 ? s.indexOf('\n---', a + 8) : -1;
  if (a >= 0 && b > a) { try { walkFront(JSON.parse(s.slice(a + 8, b)), file, 'front', ''); } catch (e) { /* check-integrity reports bad JSON */ } }
  const body = b > a ? s.slice(b + 4) : s;
  let heading = '(top)';
  body.split(/\n\s*\n/).forEach((block) => {
    const t = block.trim(); if (!t) return;
    if (/^#{1,6}\s/.test(t)) { heading = t.replace(/^#+\s*/, '').split('\n')[0]; return; }
    if (/^\{\{figure:[^}]+\}\}$/.test(t) || /^\|/.test(t) || /^<!--/.test(t)) return;
    if (/^[-*] /m.test(t)) t.split(/\n(?=[-*] )/).forEach((li) => add(file, `body > ${heading} (list)`, li.replace(/^[-*]\s+/, ''), false));
    else add(file, `body > ${heading}`, t, true);
  });
}

// ---- data prose (same fields check-speak reads) ----
const SKIP_KEYS = new Set(['id', 'url', 'href', 'source', 'sources', 'title', 'term', 'name', 'firm', 'vendor', 'family', 'chapter', 'country', 'countries', 'flows', 'event', 'date', 'status', 'basis', 'aka', 'slug', 'eccn', 'cite', 'citation', 'link', 'links', 'image', 'file', 'path', 'color', 'label']);
function walk(v, file, where, key) {
  if (typeof v === 'string') { if (!SKIP_KEYS.has(key) && /\s/.test(v.trim()) && !/^https?:\/\//.test(v) && v.length > 20) add(file, where, v, false); return; }
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, file, `${where}[${i}]`, key));
  if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], file, `${where}.${k}`, k);
}
const label = (r, i) => (r && typeof r === 'object' && !Array.isArray(r)) ? (r.id || r.term || r.name || r.firm || r.segment || r.q || i) : i;
for (const f of ['glossary.json', 'flashcards.json', 'control-flows.json', 'export-controls-timeline.json', 'landscape.json', 'chokepoint-matrix.json', 'control-thresholds.json', 'suppliers.json', 'exposure.json']) {
  const p = path.join(root, 'data', f); if (!fs.existsSync(p)) continue;
  const j = JSON.parse(fs.readFileSync(p, 'utf8')), file = `data/${f}`;
  if (Array.isArray(j)) j.forEach((r, i) => walk(r, file, String(label(r, i)), ''));
  else for (const k of Object.keys(j)) { const v = j[k]; if (Array.isArray(v)) v.forEach((r, i) => walk(r, file, `${k} > ${label(r, i)}`, '')); else walk(v, file, k, k); }
}
for (const f of ['chokepoint-matrix-notes.md', 'landscape-notes.md', 'exposure-notes.md', 'control-thresholds-notes.md']) {
  const p = path.join(root, 'data', f); if (!fs.existsSync(p)) continue;
  fs.readFileSync(p, 'utf8').split(/\n\s*\n/).forEach((block, i) => { const t = block.trim(); if (t && !/^#{1,6}\s/.test(t) && !/^\|/.test(t)) add(`data/${f}`, `block ${i + 1}`, t, true); });
}

// ---- output ----
const only = opt('--file');
const files = Object.keys(report).filter((f) => !only || f === only).sort();
const per = (r) => (r.tells.length + r.long.length) / Math.max(1, r.words) * 1000;
if (opt('--json')) fs.writeFileSync(opt('--json'), JSON.stringify(Object.fromEntries(files.map((f) => [f, report[f]])), null, 1));
let T = { words: 0, sentences: 0, tells: 0, long: 0, longParas: 0 };
const rows = files.map((f) => { const r = report[f]; T.words += r.words; T.sentences += r.sentences; T.tells += r.tells.length; T.long += r.long.length; T.longParas += r.longParas.length;
  return `${f.padEnd(46)} ${String(r.words).padStart(6)} words  ${(r.words / Math.max(1, r.sentences)).toFixed(1).padStart(5)} w/sent  ${String(r.long.length).padStart(4)} long  ${String(r.tells.length).padStart(4)} tells  ${per(r).toFixed(1).padStart(5)} /1k`; });
if (argv.includes('--summary') || !only) { console.log(rows.join('\n')); console.log(`\nTOTAL ${T.words} words, ${(T.words / Math.max(1, T.sentences)).toFixed(1)} words per sentence, ${T.long} sentences over 32 words, ${T.longParas} paragraphs over 5 sentences, ${T.tells} flagged phrases`); }
if (only) {
  const r = report[only]; if (!r) { console.log('no prose found for ' + only); process.exit(0); }
  const byLabel = {}; r.tells.forEach((t) => (byLabel[t[0]] = byLabel[t[0]] || []).push(t));
  for (const k of Object.keys(byLabel)) { console.log(`\n## ${k} (${byLabel[k].length})`); byLabel[k].forEach((t) => console.log(`- [${t[1]}] ${t[2]}`)); }
  if (r.long.length) { console.log(`\n## sentences over 32 words (${r.long.length})`); r.long.forEach((l) => console.log(`- [${l[0]}] (${l[1]} words) ${l[2]}`)); }
  if (r.longParas.length) { console.log(`\n## paragraphs over 5 sentences (${r.longParas.length})`); r.longParas.forEach((l) => console.log(`- [${l[0]}] (${l[1]} sentences) ${l[2]}`)); }
}
