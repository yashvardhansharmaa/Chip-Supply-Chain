// Builds qa/round3/review.html: every supplier's old dollar figure beside its filed revenue and the new conversion.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const root = path.join(__dirname, '..', '..');
const rates = JSON.parse(fs.readFileSync(path.join(root, 'data', 'fx-rates.json'), 'utf8'));
const fx = require(path.join(root, 'build', 'fx.js'))(rates);
const now = JSON.parse(fs.readFileSync(path.join(root, 'data', 'suppliers.json'), 'utf8'));
const old = JSON.parse(execSync('git show HEAD:data/suppliers.json', { cwd: root, maxBuffer: 1 << 26 }).toString());
const oldBy = Object.fromEntries(old.map((r) => [r.name, r]));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SYM = { USD: '$', JPY: '¥', CNY: 'CN¥', TWD: 'NT$', KRW: '₩', EUR: '€', GBP: '£', CHF: 'CHF ', HKD: 'HK$' };
const MON = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const yearOf = (v) => { const [y, m] = (v.fyEnd || '').split('-').map(Number); return m === 12 ? String(y) : `year to ${MON[m]} ${y}`; };
const filed = (v) => `${SYM[v.currency] || v.currency + ' '}${Number(v.amount).toLocaleString('en-US', { maximumFractionDigits: 6 })}${v.unit && v.unit !== 'one' ? ' ' + v.unit : ''}`;
const rows = [];
for (const r of now) {
  const v = r.revenue; if (!v) continue;
  const o = oldBy[r.name] || {};
  const c = fx.toUSD(v); const usdB = c ? c.usd / 1e9 : null;
  const was = o.revenueUSDb, pct = was && usdB ? (usdB / was - 1) * 100 : null;
  rows.push({ name: r.name, country: r.country, was, wasY: o.revenueYear, filed: filed(v), year: yearOf(v), cur: v.currency, about: c && v.currency !== 'USD' ? fx.label(c.usd) : '', usdB, pct, source: v.source, note: v.note || '', scope: v.scope });
}
rows.sort((a, b) => Math.abs(b.pct || 0) - Math.abs(a.pct || 0));
const tr = rows.map((x) => `<tr><td>${esc(x.name)}<small>${esc(x.country)}</small></td><td class="num">${x.was != null ? '$' + x.was.toFixed(3) + 'B' : '·'}<small>${esc(x.wasY || '')}</small></td><td><a href="${esc(x.source)}">${esc(x.filed)}</a><small>${esc(x.year)}${x.scope && x.scope !== 'company' ? ' · ' + esc(x.scope) : ''}</small>${x.note ? `<div class="note">${esc(x.note)}</div>` : ''}</td><td class="num">${esc(x.about || (x.cur === 'USD' ? 'dollar filer' : '·'))}</td><td class="num ${x.pct != null && Math.abs(x.pct) > 10 ? 'big' : ''}">${x.pct != null ? (x.pct > 0 ? '+' : '') + x.pct.toFixed(1) + '%' : '·'}</td></tr>`).join('\n');
const by = {}; rows.forEach((x) => { (by[x.cur] = by[x.cur] || []).push(x.pct); });
const curSum = Object.entries(by).map(([c, ps]) => { const v = ps.filter((p) => p != null).sort((a, b) => a - b); return `<li><b>${c}</b>: ${v.length} ${v.length === 1 ? "firm" : "firms"}, median change ${v.length ? (v[Math.floor(v.length / 2)] > 0 ? '+' : '') + v[Math.floor(v.length / 2)].toFixed(1) + '%' : '·'}</li>`; }).join('');
const decisions = fs.readFileSync(path.join(__dirname, 'review-decisions.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'qa', 'round2', 'make-review.py'), 'utf8').match(/CSS = '''([\s\S]*?)'''/)[1];
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Supplier Revenue Review</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap"><style>${css}
td small{display:block;color:var(--mute);font-size:12px}td a{color:var(--ink)}.note{font-size:12px;color:var(--garnet);margin-top:3px}td.big{color:var(--garnet);font-weight:600}</style></head><body>
<header><h1>Supplier revenue: as filed, with a stated dollar conversion</h1><p class="lede">Nothing here is on the live site yet. Each of the 170 suppliers with revenue now shows its latest annual figure exactly as filed, linked to the filing, and, for other currencies, "about $X" at the average of the Federal Reserve's monthly rates over the company's fiscal year. Every figure was re-read at its source by an independent checker (170 of 170 hold; Cerebras is confirmed through EDGAR's full-text search and its 10-Q, pending a direct read of its prospectus).</p></header>
<main>${decisions}<h2>Change from the old dollar figures, by filing currency</h2><ul class="opts">${curSum}</ul><p>The old figures were converted at one flat rate per currency, whatever the year (about ¥153.8, 6.73 yuan, 31.5 Taiwan dollars, 1,341 won and 1.162 dollars per euro), so most rows move a few percent. Two move by more than 10 percent: Micron, whose newer fiscal year is far larger, and Alphawave, whose revenue fell.</p>
<h2>All 170 suppliers<span class="wc">sorted by the size of the change</span></h2><div class="tablewrap"><table><thead><tr><th>Supplier</th><th class="num">Old figure</th><th>Filed revenue (links to the filing)</th><th class="num">New dollar figure</th><th class="num">Change</th></tr></thead><tbody>
${tr}
</tbody></table></div></main></body></html>`;
fs.writeFileSync(path.join(__dirname, 'review.html'), page);
console.log('wrote qa/round3/review.html', rows.length, 'rows');
