/* Methods (#/methods): the scoring rubric, the sourcing rule, the dataset method notes,
   an as-of table built from the live content, and the changelog. */

module.exports = function (ctx) {
  const { esc, pad, path, root, read, readJSON, markdown, tierOf, warn } = ctx;
  const dataDir = path.join(root, 'data');
  const buildDate = new Date().toISOString().slice(0, 10);

  /* ---- helpers ---- */
  const md = (file, id) => {
    const src = read(path.join(dataDir, file));
    if (!src) { warn(`methods: ${file} is missing`); return null; }
    const c = { id, cites: [], figures: [] };
    return { html: markdown(src, c).html, cites: c.cites };
  };
  const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } };
  const tierTag = (url) => { const t = tierOf(url); return `<span class="tier tier-${esc(t)}">${esc(t)}</span>`; };
  const citeList = (cites) => cites.length
    ? `<ol class="mt-cites">${cites.map((c) => `<li>${tierTag(c.url)}<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.url)}</a><span class="host">${esc(hostOf(c.url))}</span></li>`).join('')}</ol>`
    : '';

  /* ---- the page text ---- */
  const body = md('methods.md', 'methods');
  const prose = body ? `<div class="prose mt-prose">${body.html}</div>` : '<div class="prose mt-prose"><p>The methods text is not written yet.</p></div>';

  /* ---- the four dataset method notes, collapsed ---- */
  const NOTES = [
    ['exposure-notes.md', 'methods-exposure-notes', 'exposure-series', 'The China share of revenue', 'data/exposure.json'],
    ['chokepoint-matrix-notes.md', 'methods-matrix-notes', 'country-share-matrix', 'The country-share matrix', 'data/chokepoint-matrix.json'],
    ['control-thresholds-notes.md', 'methods-controls-notes', 'licence-thresholds', 'The licence thresholds', 'data/control-thresholds.json'],
    ['landscape-notes.md', 'methods-landscape-notes', 'chip-notes', 'The accelerators, chip by chip', 'data/landscape.json']
  ];
  const notes = NOTES.map(([file, id, anchor, title, dataset]) => {
    const n = md(file, id);
    if (!n) return '';
    return `<details class="mt-note" id="methods--${esc(anchor)}">
<summary><span class="mt-note-title">${esc(title)}</span><span class="mt-note-file">${esc(dataset)}</span></summary>
<div class="mt-note-body"><div class="prose mt-prose">${n.html}</div>${citeList(n.cites)}</div>
</details>`;
  }).join('');

  /* ---- as-of table: every chapter, every dataset, and the build date ---- */
  const chapters = ctx.all.slice().sort((a, b) => a.number - b.number);
  const tiers = { A: 0, B: 0, other: 0 };
  chapters.forEach((ch) => ch.cites.forEach((c) => { const t = tierOf(c.url); if (t === 'A') tiers.A++; else if (t === 'B') tiers.B++; else tiers.other++; }));
  const totalWords = chapters.reduce((a, c) => a + c.words, 0);
  const totalCites = chapters.reduce((a, c) => a + c.cites.length, 0);
  const num = (n) => n.toLocaleString('en-US');

  const chapterRows = chapters.map((ch) => `<tr><td class="mt-n">${pad(ch.number)}</td><th scope="row"><a href="${ch.id === 'geopolitics' ? '#/geopolitics' : '#' + esc(ch.id)}">${esc(ch.title)}</a></th><td class="mt-num">${num(ch.words)}</td><td class="mt-num">${num(ch.cites.length)}</td></tr>`).join('');
  const chapterTable = `<section class="mt-block"><div class="mt-table-wrap"><table class="mt-table">
<caption class="mt-caption">Chapters, as of ${esc(buildDate)}</caption>
<thead><tr><th scope="col">#</th><th scope="col">Chapter</th><th scope="col" class="mt-num">Words</th><th scope="col" class="mt-num">Sources</th></tr></thead>
<tbody>${chapterRows}</tbody>
<tfoot><tr><td></td><th scope="row">${num(chapters.length)} chapters</th><td class="mt-num">${num(totalWords)}</td><td class="mt-num">${num(totalCites)}</td></tr></tfoot>
</table></div>
<p class="mt-foot">Source tiers across the chapters: <span class="tier tier-A">A</span> ${num(tiers.A)} primary or institutional, <span class="tier tier-B">B</span> ${num(tiers.B)} from the four named exceptions, ${num(tiers.other)} disallowed. The count is taken at build time, so it is this copy's own audit rather than a claim about an earlier one.</p></section>`;

  const LABEL = {
    landscape: ['AI accelerators, with specs and package layouts', 'data/landscape.json'],
    suppliers: ['Suppliers across the chain', 'data/suppliers.json'],
    timeline: ['Export-control events, 2018 onward', 'data/export-controls-timeline.json'],
    matrix: ['Country shares by segment', 'data/chokepoint-matrix.json'],
    controls: ['Licence thresholds', 'data/control-thresholds.json'],
    exposure: ['China share of revenue, one row per firm-year', 'data/exposure.json'],
    chapters: ['Chapter index, built from the chapters above', 'built at compile time']
  };
  const datasets = Object.keys(ctx.data)
    .filter((k) => Array.isArray(ctx.data[k]))
    .map((k) => ({ label: (LABEL[k] || [k, ''])[0], file: (LABEL[k] || [k, ''])[1], rows: ctx.data[k].length }));
  const glossary = readJSON(path.join(dataDir, 'glossary.json'), []);
  if (glossary.length) datasets.push({ label: 'Glossary terms', file: 'data/glossary.json', rows: glossary.length });
  const log = readJSON(path.join(dataDir, 'changelog.json'), []);
  if (log.length) datasets.push({ label: 'Changelog entries', file: 'data/changelog.json', rows: log.length });

  const datasetTable = `<section class="mt-block"><div class="mt-table-wrap"><table class="mt-table">
<caption class="mt-caption">Datasets, as of ${esc(buildDate)}</caption>
<thead><tr><th scope="col">Dataset</th><th scope="col">File</th><th scope="col" class="mt-num">Rows</th></tr></thead>
<tbody>${datasets.map((d) => `<tr><th scope="row">${esc(d.label)}</th><td class="mt-file">${esc(d.file)}</td><td class="mt-num">${num(d.rows)}</td></tr>`).join('')}</tbody>
</table></div>
<p class="mt-foot">Every file above is served next to this page, so <code>data/exposure.json</code> and the rest can be fetched directly. This copy was built on <b>${esc(buildDate)}</b>.</p></section>`;

  /* ---- changelog ---- */
  const entries = log.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const changelog = entries.length
    ? `<ol class="mt-log">${entries.map((e) => `<li><time class="mt-log-date" datetime="${esc(e.date || '')}">${esc(e.date || '')}</time><p>${esc(e.summary || '')}</p></li>`).join('')}</ol>`
    : '<p class="mt-foot">No changelog entries yet.</p>';

  const html = `<div class="view-head">
<h2>Methods</h2>
<p class="dek">How the chokepoint score is set and who owns it, which sources this site will and will not cite, how estimates and relayed figures are labelled, what the site does not cover, and what changed when.</p>
</div>
${prose}
<div class="prose mt-prose">
<h3 id="methods--dataset-notes">Method notes for the datasets</h3>
<p>Four datasets carry a note on how they were built, including where their numbers are weakest. They used to sit at the foot of the Sources page. Open one to read it.</p>
</div>
<div class="mt-notes">${notes}</div>
<div class="prose mt-prose">
<h3 id="methods--as-of">What is on the site, and when it was built</h3>
<p>Word counts and source counts are measured at build time from the chapters themselves, so this table cannot drift from the site it describes.</p>
</div>
<div class="mt-tables">${chapterTable}${datasetTable}</div>
<div class="prose mt-prose">
<h3 id="methods--changelog">Changelog</h3>
<p>What changed, newest first, from the repository's own history. The site was written in one long day, so the dates cluster.</p>
</div>
${changelog}`;

  return { METHODS: html };
};
