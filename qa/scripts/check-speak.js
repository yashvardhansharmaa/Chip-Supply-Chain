// Release check: no Claude-speak in the reader-facing text. node qa/scripts/check-speak.js
// Scans the built pages (dist/index.html and each chapter's dist/<id>/index.html, with scripts, styles and tags stripped; the bibliography titles are verbatim and are excluded)
// and the prose fields of the data files. Prints every match with its location and exits 1 if any remain.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');

// Verbatim quotations (curly or straight quotes, up to 600 characters) are someone else's words; they are blanked before matching.
const blankQuotes = (s) => s.replace(/[“"][^”"\n]{1,600}[”"]/g, (m) => ' '.repeat(m.length));

const PATTERNS = [
  ['contrast "X, not Y"', /, not (?:[a-z0-9$]|"|'|“)/i],
  ['contrast "not X but Y"', /\bnot [^,.;:\n]{1,40}\bbut\b/],
  ['contrast "rather than"', /\brather than\b/],
  ['opener', /\b(?:It is worth noting|Importantly|Crucially|Notably|In other words|Simply put|At its core|In essence|Ultimately)\b/],
  ['em dash', /—/],
  ['self-reference', /\bthis site\b|\bthe site's\b|\bour |\bwe /i],
  ['not only ... but', /\bnot only\b[^.;\n]{0,80}\bbut\b/],
  ['whether ... or not', /\bwhether\b[^.;\n]{0,60}\bor not\b/],
  ['"This is why/how/what"', /(?:^|[.!?:] )(?:This|That) is (?:why|how|what)\b/],
];
const QUESTION = /[^.!?\n]{3,}\?(?=\s|$)/;

const findings = [];
function scan(text, where, allowQuestion) {
  const t = blankQuotes(text);
  for (const [name, re] of PATTERNS) {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    let m;
    while ((m = g.exec(t))) {
      const a = Math.max(0, m.index - 60), b = Math.min(t.length, m.index + m[0].length + 60);
      findings.push(`${where}\n    [${name}] ...${t.slice(a, b).replace(/\s+/g, ' ')}...`);
      if (!m[0].length) g.lastIndex++;
    }
  }
  if (!allowQuestion) {
    const g = new RegExp(QUESTION.source, 'g');
    let m;
    while ((m = g.exec(t))) findings.push(`${where}\n    [rhetorical question] ...${m[0].trim().slice(-140)}`);
  }
}

/* ---- the built page ---- */
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const distPath = path.join(root, 'dist', 'index.html');
if (!fs.existsSync(distPath)) { console.log('check-speak: dist/index.html is missing, run node build/build.js first'); process.exit(1); }
const H0 = '«H»', H1 = '«/H»'; // heading markers, so h1-h4 may carry a question and every match can say where it sits
// the home page and each chapter's own page (the chapters left the home page on 28 Oct 2026)
const chapterPages = fs.readdirSync(path.join(root, 'dist')).filter((d) => d !== 'book' && fs.existsSync(path.join(root, 'dist', d, 'index.html')))
  .map((d) => fs.readFileSync(path.join(root, 'dist', d, 'index.html'), 'utf8')).filter((h) => /<article class="chapter[^"]*" id="/.test(h));
let html = [fs.readFileSync(distPath, 'utf8')].concat(chapterPages).join('\n')
  .replace(/<script[\s\S]*?<\/script>/g, '\n').replace(/<style[\s\S]*?<\/style>/g, '\n')
  .replace(/<details class="chapter-sources"[\s\S]*?<\/details>/g, '\n') // each chapter's source list: verbatim titles
  .replace(/(<p class="fc-q"[^>]*>[\s\S]*?)\?(<\/p>)/g, '$1.$2') // flashcard questions are real questions; every other rule still reads them
  .replace(/<sup class="cite">[\s\S]*?<\/sup>/g, ' ') // citation superscripts carry the source title as a tooltip
  .replace(/<section[^>]*data-view="sources"[\s\S]*?<\/section>/g, '\n') // bibliography, if ever rendered statically
  .replace(/<(?:ol|ul|div)[^>]*class="[^"]*\b(?:sources|bib(?:liography)?)\b[^"]*"[\s\S]*?<\/(?:ol|ul|div)>/g, '\n');
html = html.replace(/<(h[1-4])\b[^>]*>([\s\S]*?)<\/\1>/g, (_, tag, inner) => `\n${H0}${tag}${H1}${inner.replace(/<[^>]+>/g, ' ')}\n`);
html = html.replace(/<\/(?:p|li|td|th|dt|dd|figcaption|summary|blockquote|caption|label|option|title)>/g, '\n').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, ' ');
const lines = decode(html).split('\n').map((s) => s.replace(/[ \t]+/g, ' ').trim()).filter(Boolean);
let heading = '(top)';
for (const line of lines) {
  if (line.startsWith(H0)) { const i = line.indexOf(H1); heading = line.slice(i + H1.length).trim(); scan(heading, `page > ${line.slice(H0.length, i)} "${heading}"`, true); continue; }
  scan(line, `page > under "${heading}"`, false);
}

/* ---- the data prose ---- */
const SKIP_KEYS = new Set(['id', 'url', 'href', 'source', 'sources', 'title', 'term', 'name', 'firm', 'vendor', 'family', 'chapter', 'country', 'countries', 'flows', 'event', 'date', 'status', 'basis', 'aka', 'slug', 'eccn', 'cite', 'citation', 'link', 'links', 'image', 'file', 'path', 'color', 'label']);
const looksLikeProse = (s) => /\s/.test(s.trim()) && !/^https?:\/\//.test(s) && s.length > 20;
function walk(v, where, keyName) {
  if (typeof v === 'string') { if (!SKIP_KEYS.has(keyName) && looksLikeProse(v)) scan(v, where, false); return; }
  if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${where}[${i}]`, keyName)); return; }
  if (v && typeof v === 'object') { for (const k of Object.keys(v)) walk(v[k], `${where}.${k}`, k); }
}
const DATA_JSON = ['glossary.json', 'control-flows.json', 'export-controls-timeline.json', 'landscape.json', 'chokepoint-matrix.json', 'control-thresholds.json', 'suppliers.json', 'exposure.json'];
const label = (r, i) => (r && typeof r === 'object' && !Array.isArray(r)) ? (r.id || r.term || r.name || r.firm || r.segment || i) : i;
for (const f of DATA_JSON) {
  const p = path.join(root, 'data', f); if (!fs.existsSync(p)) continue;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (Array.isArray(j)) j.forEach((r, i) => walk(r, `data/${f} > ${label(r, i)}`, ''));
  else if (j && typeof j === 'object') for (const k of Object.keys(j)) { const v = j[k]; if (Array.isArray(v)) v.forEach((r, i) => walk(r, `data/${f} > ${k} > ${label(r, i)}`, '')); else walk(v, `data/${f} > ${k}`, k); }
}
// the notes files the build renders into the page
for (const f of ['chokepoint-matrix-notes.md', 'landscape-notes.md']) {
  const p = path.join(root, 'data', f); if (!fs.existsSync(p)) continue;
  fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => { const s = line.trim(); if (!s || /^#{1,6}\s/.test(s)) return; scan(s, `data/${f}:${i + 1}`, false); });
}

if (findings.length) { console.log(findings.join('\n')); console.log(`\ncheck-speak: ${findings.length} matches`); process.exit(1); }
console.log('check-speak: no matches');
