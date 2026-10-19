/* SUMMARY  — dist/summary/index.html, the short version of The Chain: one table of the fifteen stages, a block per stage
   (its one-line summary, who leads, where China and the United States stand) and the two chapters that look across the chain.
   Everything is taken from the chapters' own front matter and "In short", so it never says more than a chapter does; every
   figure is cited in the chapter each block links to. build/summary_pdf.py prints this page to
   dist/chip-supply-chain-summary.pdf, the file the "Download a short summary" button on The Chain serves.
   build/build.js lists /summary/ in the sitemap. */
const SITE = require('../site.js');

module.exports = function (ctx) {
  const { fs, path, root, stages = [], chapters = [], geo, esc, pad, word, builtStr } = ctx;
  if (!stages.length) return {};
  const stageIds = new Set(stages.map((c) => c.id));
  const across = chapters.filter((c) => !stageIds.has(c.id)).concat(geo ? [geo] : []);
  const url = (id) => `${SITE.url}${id}/`;
  const short = (id) => `${SITE.host}/${id}/`;
  const noCites = (h) => String(h || '').replace(/<sup class="cite">[\s\S]*?<\/sup>/g, '').replace(/\s+([.,;:])/g, '$1');
  const COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', KR: 'South Korea', TW: 'Taiwan', CN: 'China', DE: 'Germany', GB: 'United Kingdom', FR: 'France', AT: 'Austria', IL: 'Israel', CH: 'Switzerland', MY: 'Malaysia', SG: 'Singapore', BE: 'Belgium', IT: 'Italy', IE: 'Ireland', IN: 'India', MX: 'Mexico' };
  const leaders = (c, n) => (c.leaders || []).slice(0, n);

  const rows = stages.map((ch, i) => {
    const c = ch.meta.card || {};
    const sub = (c.substitutability || {}).band || '';
    const who = leaders(c, 2).map((l) => `${esc(l.name)}${l.country ? ` <span class="cc">${esc(l.country)}</span>` : ''}`).join(', ');
    return `<tr><td class="n">${pad(i + 1)}</td><td class="t"><a href="${url(ch.id)}">${esc(ch.title)}</a></td><td>${who}</td><td class="band b-${esc(c.concentration || '')}">${esc(c.concentration || '')}</td><td class="band">${esc(sub)}</td></tr>`;
  }).join('');

  const blocks = stages.map((ch, i) => {
    const c = ch.meta.card || {};
    const sub = (c.substitutability || {}).band || '';
    const who = leaders(c, 2).map((l) => `<li><b>${esc(l.name)}</b>${l.country ? ` <span class="cc">${esc(COUNTRY[l.country] || l.country)}</span>` : ''}${l.share ? `. ${esc(l.share)}` : ''}</li>`).join('');
    return `<section class="stage">
<h3><span class="n">${pad(i + 1)}</span> ${esc(ch.title)}</h3>
<p class="tags"><span class="b-${esc(c.concentration || '')}">${esc(c.concentration || '')} concentration</span>${sub ? ` · ${esc(sub)} to substitute` : ''}</p>
${ch.meta.oneLiner ? `<p class="lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${who ? `<ul class="who">${who}</ul>` : ''}
${c.chinaStatus ? `<p><span class="k">China</span> ${esc(c.chinaStatus)}</p>` : ''}
${c.usStatus ? `<p><span class="k">United States</span> ${esc(c.usStatus)}</p>` : ''}
<p class="src">Sources: <a href="${url(ch.id)}">${short(ch.id)}</a></p>
</section>`;
  }).join('');

  const acrossHTML = across.map((ch) => `<section class="stage wide">
<h3><span class="n">${pad(ch.number)}</span> ${esc(ch.title)}</h3>
${ch.meta.oneLiner ? `<p class="lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${ch.inShort ? `<div class="short">${(noCites(ch.inShort).match(/<p>[\s\S]*?<\/p>/) || [''])[0]}</div>` : ''}
<p class="src">Sources: <a href="${url(ch.id)}">${short(ch.id)}</a></p>
</section>`).join('');

  const title = 'The AI chip supply chain in brief';
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Chip Supply Chain</title>
<meta name="description" content="The ${word(stages.length)} stages of the AI chip supply chain on a few pages: who leads each, how concentrated it is, and where China and the United States stand.">
<link rel="canonical" href="${SITE.url}summary/">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,400&family=Instrument+Sans:wght@400..600&display=swap">
<style>
:root { --ink: #14181f; --ink-2: #3b424c; --muted: #5c636d; --line: #d9d6cf; --garnet: #7a1f2b; --bg: #fff; }
* { box-sizing: border-box; }
html { background: var(--bg); color: var(--ink); }
body { margin: 0 auto; max-width: 960px; padding: 32px 20px 48px; font: 15px/1.5 "Source Serif 4", Georgia, serif; }
a { color: inherit; }
.kicker, .k, .tags, .src, .cc, th, .meta, .key { font-family: "Instrument Sans", system-ui, sans-serif; }
.kicker { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--garnet); margin: 0 0 6px; }
h1 { font: 600 34px/1.1 Fraunces, Georgia, serif; margin: 0 0 8px; text-wrap: balance; }
.dek { font-size: 17px; color: var(--ink-2); margin: 0 0 10px; max-width: 62ch; }
.meta { font-size: 12px; color: var(--muted); margin: 0 0 18px; }
.key { font-size: 12.5px; color: var(--ink-2); border-top: 1px solid var(--ink); border-bottom: 1px solid var(--line); padding: 8px 0; margin: 0 0 14px; display: grid; gap: 4px; }
.key b { color: var(--ink); font-weight: 600; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--ink); padding: 6px 8px 6px 0; }
td { border-bottom: 1px solid var(--line); padding: 6px 8px 6px 0; vertical-align: baseline; }
td.n { font-family: "Instrument Sans", sans-serif; color: var(--muted); font-size: 12px; width: 26px; }
td.t a { text-decoration: none; font-weight: 600; }
td.band { font-family: "Instrument Sans", sans-serif; font-size: 12.5px; white-space: nowrap; }
.b-Extreme { color: var(--garnet); font-weight: 600; }
.cc { font-size: 10.5px; color: var(--muted); letter-spacing: 0.05em; }
h2 { font: 600 21px/1.2 Fraunces, Georgia, serif; margin: 30px 0 4px; }
.h2-note { font-size: 13.5px; color: var(--ink-2); margin: 0 0 12px; }
.stages { columns: 2; column-gap: 30px; }
.stage { break-inside: avoid; border-top: 1px solid var(--line); padding: 10px 0 12px; }
.stage h3 { font: 600 16.5px/1.25 Fraunces, Georgia, serif; margin: 0 0 2px; }
.stage h3 .n { font: 500 12px "Instrument Sans", sans-serif; color: var(--muted); margin-right: 4px; }
.tags { font-size: 12px; color: var(--muted); margin: 0 0 5px; }
.stage p, .stage li, .short p { font-size: 13.5px; line-height: 1.45; margin: 0 0 5px; }
.lede { color: var(--ink); }
.who { margin: 0 0 5px; padding-left: 16px; }
.k { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-right: 3px; }
.src { font-size: 11.5px; color: var(--muted); margin-top: 4px !important; }
.src a { color: var(--muted); }
.across { columns: 2; column-gap: 30px; }
.foot { font-family: "Instrument Sans", sans-serif; font-size: 11.5px; color: var(--muted); border-top: 1px solid var(--ink); margin-top: 26px; padding-top: 8px; }
@media (max-width: 720px) { .stages, .across { columns: 1; } body { padding: 20px 16px 40px; } h1 { font-size: 28px; } table { font-size: 12.5px; } }
@page { size: A4; margin: 12mm 12mm 13mm; }
@media print {
  body { max-width: none; padding: 0; font-size: 9.6pt; }
  h1 { font-size: 22pt; } .dek { font-size: 11.5pt; } .meta, .key { font-size: 8.5pt; }
  table { font-size: 9pt; } th { font-size: 7.5pt; } td.band, td.n { font-size: 8.5pt; }
  h2 { font-size: 14pt; margin-top: 16pt; break-after: avoid; } .h2-note { font-size: 9pt; }
  .stage { padding: 5pt 0 6pt; } .stage h3 { font-size: 10pt; } .stage p, .stage li, .short p { font-size: 8.2pt; line-height: 1.34; margin-bottom: 2.5pt; } .tags, .k, .src, .cc { font-size: 7.4pt; }
  .stages-h { break-before: page; margin-top: 0; }
  td, th { padding-top: 3.5pt; padding-bottom: 3.5pt; } .stages, .across { column-gap: 22pt; }
  a { text-decoration: none; }
}
</style>
</head>
<body>
<header>
<p class="kicker">Chip Supply Chain · summary</p>
<h1>${title}</h1>
<p class="dek">The ${word(stages.length)} stages that turn sand and software into an AI accelerator: who leads each one, how concentrated it is, and where China and the United States stand.</p>
<p class="meta">Updated ${esc(builtStr)} · <a href="${SITE.url}">${SITE.host}</a> · Every figure is cited in the chapter each section links to.</p>
</header>
<div class="key">
<span><b>Concentration</b> counts the firms that credibly supply a stage: Extreme, High, Moderate or Low.</span>
<span><b>Substitutability</b> rates how hard it would be for a well-funded state or firm to build an alternative: Easy, Moderate, Hard or Very hard.</span>
</div>
<table>
<thead><tr><th>#</th><th>Stage</th><th>Who leads</th><th>Concentration</th><th>Substitutability</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<h2>Across the chain</h2>
<p class="h2-note">Two chapters look across all ${word(stages.length)} stages, at what a chip costs and at the contest over who controls them.</p>
<div class="across">${acrossHTML}</div>
<h2 class="stages-h">The ${word(stages.length)} stages</h2>
<p class="h2-note">In the order a chip is made.</p>
<div class="stages">${blocks}</div>
<p class="foot">Chip Supply Chain: How AI Chips Are Made, by Yashvardhan Sharma. Summary updated ${esc(builtStr)}. The full chapters, with a source for every figure, are at ${SITE.host}.</p>
</body>
</html>`;
  const dir = path.join(root, 'dist', 'summary');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  return {};
};
