/* Summary B — chain-first.
   The eight-minute version of the site: one interactive walk down the chain, then what binds it,
   who holds it, what changed, and where to read the rest.
   Everything here is computed from ctx.data and the chapter front matter. Nothing is typed in from memory.
   Client behaviour lives in src/modules/summary-b.js, styles in src/modules/summary-b.css. */

const COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', TW: 'Taiwan', KR: 'South Korea', CN: 'China', DE: 'Germany', CH: 'Switzerland', GB: 'United Kingdom', FR: 'France', IL: 'Israel', SG: 'Singapore', MY: 'Malaysia', AT: 'Austria', IT: 'Italy', BE: 'Belgium', IN: 'India', AE: 'United Arab Emirates', SA: 'Saudi Arabia', CA: 'Canada', SE: 'Sweden', FI: 'Finland', IE: 'Ireland', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', MX: 'Mexico', 'EU-other': 'Other Europe', Other: 'Other' };

/* Short names for the flow nodes. Same abbreviations the site's chain strip uses, so a reader who
   has seen the chain strip recognises the same fifteen labels here. Soft hyphens let them wrap. */
const SHORT = { 'design-and-eda': 'Design', 'silicon-and-wafers': 'Silicon', 'chemicals-gases-and-photoresist': 'Chem­icals', lithography: 'Litho', 'photomasks-and-pellicles': 'Masks', 'deposition-and-etch': 'Dep / etch', 'metrology-and-inspection': 'Metro­logy', 'transistors-and-front-end': 'Front end', 'foundries-and-fabs': 'Foundry', 'memory-and-hbm': 'Memory', 'advanced-packaging': 'Pack­aging', 'substrates-and-pcbs': 'Sub­strate', 'test-and-assembly': 'Test', 'systems-and-networking': 'Systems', 'data-centers-and-power': 'Power' };

/* Which chapter each matrix segment belongs to. The matrix rows carry no chapter key, so the routing
   lives here and is checked against the built chapters below; an unmapped segment raises a build warning. */
const SEGMENT_CHAPTER = {
  'EDA software': 'design-and-eda',
  'Core IP': 'design-and-eda',
  'AI accelerator design': 'design-and-eda',
  'Silicon wafers': 'silicon-and-wafers',
  Photoresist: 'chemicals-gases-and-photoresist',
  'Specialty gases': 'chemicals-gases-and-photoresist',
  'EUV lithography tools': 'lithography',
  'DUV lithography tools': 'lithography',
  Photomasks: 'photomasks-and-pellicles',
  'Deposition tools': 'deposition-and-etch',
  'Etch tools': 'deposition-and-etch',
  'Metrology & inspection tools': 'metrology-and-inspection',
  'Leading-edge logic manufacturing (≤5 nm)': 'foundries-and-fabs',
  'Mature logic manufacturing (≥28 nm)': 'foundries-and-fabs',
  'DRAM manufacturing': 'memory-and-hbm',
  HBM: 'memory-and-hbm',
  'Advanced packaging (2.5D/3D)': 'advanced-packaging',
  'IC substrates': 'substrates-and-pcbs',
  'Assembly, test and packaging (ATP)': 'test-and-assembly',
  'Server assembly': 'systems-and-networking'
};

module.exports = function (ctx) {
  const { esc, pad, word, cap, warn, stages, data } = ctx;
  const num = (v) => (typeof v !== 'number' ? esc(v) : Math.abs(v) >= 1000 ? v.toLocaleString('en-US') : Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10));
  const cname = (c) => COUNTRY[c] || c;
  const chapterHref = (id) => (id === 'geopolitics' ? '#/geopolitics' : '#' + id);
  const byId = {};
  ctx.all.forEach((c) => { byId[c.id] = c; });

  /* ---------------- 1. the flow, and one panel per stage ---------------- */

  /* A compact bar chart: label and value on one line, a thin bar beneath. Long labels keep their words
     (the chapter figures right-align labels in a fixed gutter, which truncates at this width).
     Single neutral hue for magnitude — amber is reserved on this page for the chokepoint score. */
  function miniBars(fig, chId) {
    if (!fig) return '';
    const rows = (fig.data || []).filter((d) => Array.isArray(d) && d.length >= 2);
    if (!rows.length) return '';
    const W = 320, rowH = 26, barH = 5, H = rows.length * rowH;
    const max = Math.max(...rows.map((d) => +d[1] || 0), 1e-9);
    const pc = fig.unit === '%' ? '%' : '';
    let svg = `<svg class="sb-bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(fig.title)}" preserveAspectRatio="xMinYMin meet">`;
    rows.forEach((d, i) => {
      const top = i * rowH, w = Math.max(1.5, ((+d[1] || 0) / max) * W);
      svg += `<text x="0" y="${top + 10}">${esc(String(d[0]).slice(0, 34))}</text>` +
        `<text class="v" x="${W}" y="${top + 10}" text-anchor="end">${num(d[1])}${pc}</text>` +
        `<rect class="tr" x="0" y="${top + 15}" width="${W}" height="${barH}" rx="0.5"/>` +
        `<rect class="bx" x="0" y="${top + 15}" width="${w.toFixed(1)}" height="${barH}" rx="0.5"/>`;
    });
    svg += '</svg>';
    const src = fig.source && fig.source.url
      ? `<p class="sb-fig-source">Source: <a href="${esc(fig.source.url)}" target="_blank" rel="noopener">${esc(fig.source.label || fig.source.url)}</a></p>`
      : fig.source && fig.source.label ? `<p class="sb-fig-source">Source: ${esc(fig.source.label)}</p>` : '';
    const table = `<table class="sr-only"><caption>${esc(fig.title)}</caption><tbody>${rows.map((d) => `<tr><th scope="row">${esc(d[0])}</th><td>${num(d[1])}${fig.unit ? ' ' + esc(fig.unit) : ''}</td></tr>`).join('')}</tbody></table>`;
    return `<figure class="sb-fig" id="sb-fig-${esc(chId)}"><p class="sb-fig-title">${esc(fig.title)}${fig.unit && fig.unit !== '%' ? `<span class="unit">${esc(fig.unit)}</span>` : ''}</p>${svg}${table}${src}</figure>`;
  }

  const DEFAULT_ID = stages.some((c) => c.id === 'lithography') ? 'lithography' : stages.length ? stages[0].id : '';
  if (DEFAULT_ID !== 'lithography') warn('summary-b: lithography is not among the stages; defaulting to ' + DEFAULT_ID);

  const nodes = stages.map((c, i) => {
    const sc = +((c.meta.card || {}).chokepointScore || 0);
    const on = c.id === DEFAULT_ID;
    return `<li class="sb-node" data-score="${sc}"><button type="button" class="sb-node-btn" id="sb-tab-${esc(c.id)}" role="tab" data-id="${esc(c.id)}" aria-controls="sb-panel-${esc(c.id)}" aria-selected="${on ? 'true' : 'false'}" tabindex="${on ? '0' : '-1'}">` +
      `<span class="sb-n">${pad(c.number)}</span>` +
      `<span class="sb-bar" aria-hidden="true"><i></i></span>` +
      `<span class="sb-t">${esc(SHORT[c.id] || c.title)}</span>` +
      `<span class="sr-only">, stage ${i + 1} of ${stages.length}, chokepoint score ${sc} of 5</span>` +
      '</button></li>';
  }).join('');

  const panels = stages.map((c, i) => {
    const card = c.meta.card || {};
    const sc = +(card.chokepointScore || 0);
    const sub = card.substitution || {};
    const leaders = (card.leaders || []).map((l) => `<span class="sb-lead"><span class="sb-cc" title="${esc(cname(l.country))}">${esc(l.country || '·')}</span>${esc(l.name)}<span class="sr-only"> (${esc(cname(l.country))})</span></span>`).join('');
    const fig = (c.meta.figures || []).find((f) => f.type === 'bars');
    if (!fig) warn(`summary-b: ${c.id} has no bars figure, its panel shows no chart`);
    return `<article class="sb-panel" id="sb-panel-${esc(c.id)}" role="tabpanel" aria-labelledby="sb-tab-${esc(c.id)}" tabindex="0"${c.id === DEFAULT_ID ? '' : ' hidden'}>
<div class="sb-panel-main">
<p class="label sb-eyebrow">Stage ${i + 1} of ${stages.length} · Chapter ${pad(c.number)}</p>
<h4 class="sb-panel-title"><a href="${esc(chapterHref(c.id))}">${esc(c.title)}</a></h4>
${c.meta.plain ? `<p class="sb-plain">${esc(c.meta.plain)}</p>` : ''}
${leaders ? `<p class="sb-leaders"><span class="label">Who leads</span>${leaders}</p>` : ''}
${card.chinaStatus ? `<div class="sb-china"><p class="label">Where China stands</p><p>${esc(card.chinaStatus)}</p></div>` : ''}
<a class="sb-read" href="${esc(chapterHref(c.id))}">Read chapter ${pad(c.number)}, ${esc(c.title)} <span aria-hidden="true">→</span></a>
</div>
<div class="sb-panel-side">
<dl class="sb-facts">
<div class="sb-fact${sc >= 5 ? ' is-5' : ''}"><dt>Chokepoint</dt><dd>${sc || '—'} <small>/ 5</small></dd></div>
<div class="sb-fact"><dt>Concentration</dt><dd>${esc(card.concentration || '—')}</dd></div>
<div class="sb-fact"><dt>To replace</dt><dd>${esc(sub.years || '—')} <small>${sub.years ? 'years' : ''}</small></dd></div>
</dl>
${sub.why ? `<p class="sb-why">${esc(sub.why)}</p>` : ''}
${miniBars(fig, c.id)}
</div>
</article>`;
  }).join('');

  const score5 = stages.filter((c) => +((c.meta.card || {}).chokepointScore || 0) >= 5);
  const lead = `${cap(word(stages.length))} stages turn sand into a finished rack of AI accelerators, and ${word(score5.length)} of them score five out of five: one supplier failing would stop leading-edge production worldwide.`;

  const flow = `<section class="sb-sec sb-sec--flow" aria-labelledby="sb-flow-h">
<div class="sb-sec-head">
<h3 id="sb-flow-h">Walk the chain</h3>
<p class="sb-sec-note">One bar per stage, in the order the material moves. The taller the bar, the harder that stage would be to replace. Pick any stage to open it.</p>
<p class="sb-key"><span><i style="background:var(--bar-5)"></i>5 of 5</span><span><i style="background:var(--bar-4)"></i>4</span><span><i style="background:var(--bar-3)"></i>3 or less</span></p>
</div>
<div class="sb-flow-scroll">
<ol class="sb-flow" role="tablist" aria-label="The ${word(stages.length)} stages of the chain" aria-orientation="horizontal">${nodes}</ol>
</div>
<p class="sb-flow-foot"><span>Quartz sand</span><span>A finished rack</span></p>
<div class="sb-panels">${panels}</div>
</section>`;

  /* ---------------- 2. what binds: every stage at 5 of 5 ---------------- */

  const binds = `<section class="sb-sec" aria-labelledby="sb-binds-h">
<div class="sb-sec-head">
<h3 id="sb-binds-h">What binds</h3>
<p class="sb-sec-note">${cap(word(score5.length))} of the ${word(stages.length)} stages sit at the top of the scale. Each one in a sentence.</p>
</div>
<ul class="sb-binds">${score5.map((c) => `<li class="sb-bind"><a href="${esc(chapterHref(c.id))}"><span class="label"><span class="sb-bind-n">${pad(c.number)}</span>${esc(c.title)}</span>${c.meta.oneLiner ? `<span class="sb-bind-line">${esc(c.meta.oneLiner)}</span>` : ''}</a></li>`).join('')}</ul>
</section>`;

  /* ---------------- 3. who holds it: the country matrix ---------------- */

  const matrix = (data.matrix || []);
  const totals = {};
  matrix.forEach((s) => Object.keys(s.shares || {}).forEach((k) => { const v = +(s.shares || {})[k] || 0; if (v > 0) totals[k] = (totals[k] || 0) + v; }));
  const cols = Object.keys(totals).sort((a, b) => {
    const rank = (k) => (k === 'EU-other' ? 1 : k === 'Other' ? 2 : 0); // the two buckets sit at the end
    return rank(a) - rank(b) || totals[b] - totals[a];
  });
  const nullRows = matrix.filter((s) => !s.shares).length;
  const rows = matrix.map((s) => {
    const chId = SEGMENT_CHAPTER[s.segment];
    if (!chId) warn(`summary-b: matrix segment "${s.segment}" has no chapter mapped`);
    else if (!byId[chId]) warn(`summary-b: matrix segment "${s.segment}" maps to missing chapter "${chId}"`);
    const name = chId && byId[chId] ? `<a href="${esc(chapterHref(chId))}">${esc(s.segment)}</a>` : esc(s.segment);
    if (!s.shares) return `<tr class="sb-mx-null"><th scope="row">${name}</th><td class="sb-mx-none" colspan="${cols.length}">${esc(s.metric || 'No published split')}</td></tr>`;
    const metric = [s.metric, s.year].filter(Boolean).join(' · ');
    const head = `<th scope="row">${name}<small>${esc(metric)}</small></th>`;
    const max = Math.max(...cols.map((c) => +s.shares[c] || 0));
    return `<tr>${head}${cols.map((c) => {
      const v = +s.shares[c] || 0;
      // "·" is a country the source does not list at all; "<1%" is one it lists below half a point
      const txt = !v ? '·' : v < 0.5 ? '&lt;1%' : Math.round(v) + '%';
      // data-strong flips the cell's text to the page ground in dark mode, where a heavy amber wash is light
      return `<td><span class="sb-mx-cell${v ? '' : ' is-zero'}"${v && v === max ? ' data-hi="1"' : ''}${v >= 70 ? ' data-strong="1"' : ''} style="--v:${Math.round(Math.min(100, v) * 0.85)}">${txt}</span></td>`;
    }).join('')}</tr>`;
  }).join('');

  const who = matrix.length ? `<section class="sb-sec" aria-labelledby="sb-who-h">
<div class="sb-sec-head">
<h3 id="sb-who-h">Who holds it</h3>
<p class="sb-sec-note">${cap(word(matrix.length))} segments of the chain and the share each country holds. Darker cells are larger shares; the darkest in a row is the leader.${nullRows ? ` ${cap(word(nullRows))} rows carry no figures because no source we accept publishes a country split.` : ''} Each row opens its chapter.</p>
</div>
<div class="sb-mx-wrap"><table class="sb-mx"><caption class="sr-only">Country share of each segment of the AI chip supply chain</caption>
<thead><tr><th scope="col">Segment</th>${cols.map((c) => `<th scope="col" title="${esc(cname(c))}"><abbr title="${esc(cname(c))}">${esc(c)}</abbr></th>`).join('')}</tr></thead>
<tbody>${rows}</tbody></table></div>
<p class="sb-sec-foot">Method and sources for every row are on the <a href="#/sources">Sources</a> page; the same table, with each row's note, is on <a href="#/geopolitics">Geopolitics</a>.</p>
</section>` : '';

  /* ---------------- 4. what changed: eight rules from the record ---------------- */

  /* The timeline carries no significance field, so the selection is stated rather than judged:
     the rules written by the three governments that write them, from October 2022, sampled at
     eight even points in time so the list covers the whole period instead of only the newest rules. */
  const RULE_MAKER = /^(US \(BIS\)|Japan \(METI\)|Netherlands)/;
  const pool = (data.timeline || [])
    .filter((e) => e.date >= '2022-10-01' && RULE_MAKER.test(e.actor || '') && /export control|Allied control/i.test(e.category || ''))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const day = (s) => Date.parse(s + 'T00:00:00Z') / 86400000;
  const WANT = 8;
  let picked = pool.slice();
  if (pool.length > WANT) {
    const t0 = day(pool[0].date), t1 = day(pool[pool.length - 1].date), taken = new Set();
    picked = [];
    for (let i = 0; i < WANT; i++) {
      const target = t0 + ((t1 - t0) * i) / (WANT - 1);
      let best = -1, bestD = Infinity;
      pool.forEach((e, j) => { if (taken.has(j)) return; const d = Math.abs(day(e.date) - target); if (d < bestD) { bestD = d; best = j; } });
      if (best >= 0) { taken.add(best); picked.push(pool[best]); }
    }
    picked.sort((a, b) => (a.date < b.date ? -1 : 1));
  }
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // spelled out here so the build does not depend on the host's date locale
  const fmtDate = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d); return m ? `${MON[+m[2] - 1]} ${+m[3]}, ${m[1]}` : d; };
  const changed = picked.length ? `<section class="sb-sec" aria-labelledby="sb-changed-h">
<div class="sb-sec-head">
<h3 id="sb-changed-h">What changed</h3>
<p class="sb-sec-note">The rules that decide who may buy what, written by the three governments that write them. ${cap(word(picked.length))} of the ${word(pool.length)} on file since October 2022, spaced evenly across the ${word(new Date().getUTCFullYear() - 2022)} years, so the list traces the whole arc rather than only the newest.</p>
</div>
<ol class="sb-changed">${picked.map((e) => `<li>
<span class="sb-when"><time datetime="${esc(e.date)}">${esc(fmtDate(e.date))}</time><span class="sb-actor">${esc(e.actor)}</span></span>
<span class="sb-what">${esc(e.title)}${e.source ? ` <a class="sb-src" href="${esc(e.source)}" target="_blank" rel="noopener">source</a>` : ''}</span>
</li>`).join('')}</ol>
<p class="sb-sec-foot">All ${word((data.timeline || []).length)} events, China's answers included, are on <a href="#/geopolitics">Geopolitics</a>; every licence threshold in force is on <a href="#/controls">Export Controls</a>.</p>
</section>` : '';

  /* ---------------- 5. the way on ---------------- */

  const cta = `<section class="sb-cta" aria-labelledby="sb-cta-h">
<h3 id="sb-cta-h"><a href="#chain">Read the whole chain, stage by stage <span aria-hidden="true">→</span></a></h3>
<p>${word(ctx.all.length)} chapters, ${ctx.all.reduce((a, c) => a + c.cites.length, 0).toLocaleString('en-US')} sources, one per claim.</p>
<p class="sb-cta-more"><a href="#/landscape">AI Chips</a><a href="#/controls">Export Controls</a><a href="#/sources">Sources</a></p>
</section>`;

  const html = `<div class="sb" data-default="${esc(DEFAULT_ID)}">
<div class="view-head sb-head">
<h2>The chain, in eight minutes</h2>
<p class="dek">${esc(lead)}</p>
</div>
${flow}
${binds}
${who}
${changed}
${cta}
</div>`;

  return { SUMMARY_B: html };
};
