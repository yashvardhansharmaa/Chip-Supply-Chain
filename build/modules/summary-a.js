/* Build module: SUMMARY_A — the map-first summary at #/summary-a.
 *
 * A world map drawn from the same coastline rings the 3D globe specimen uses
 * (specimens/globe.js is parsed at build time, so the two never drift), the
 * chain's chokepoint towns pinned on it, and one panel per country built from
 * the chapter cards, the country-share matrix, the supplier list and the
 * China revenue series. Nothing here is typed from memory: every figure is
 * computed from ctx.data or the chapter front matter.
 *
 * The projection is a plain equirectangular one, cropped to the window that
 * holds every town in the chain (Hillsboro in the west, Tokyo in the east).
 * The land is filled and the coast drawn on top, as on the globe specimen.
 */
'use strict';
const path = require('path');

/* ---------- the map window, in degrees ---------- */
const W0 = -130, W1 = 156, N0 = 72, S0 = -46;
const LON = W1 - W0, LAT = N0 - S0;
const VW = 1000, U = VW / LON, VH = +(LAT * U).toFixed(1);
const px = (lon) => +(((lon - W0) * U).toFixed(1));
const py = (lat) => +(((N0 - lat) * U).toFixed(1));
const pctX = (lon) => +((px(lon) / VW) * 100).toFixed(2);
const pctY = (lat) => +((py(lat) / VH) * 100).toFixed(2);

/* Where each marker sits when it cannot sit on its own country: East Asia and
 * north-west Europe are too crowded at this scale, so those nine markers are
 * fanned out over open water and joined to the country by a leader line. */
const NUDGE = { CN: [41, 101], KR: [52, 131], JP: [33, 146], TW: [14, 134], SG: [-12, 120], MY: [-7, 92], NL: [60, -12], DE: [41, 25] };

/* Which country each pinned town stands in. The towns and their coordinates
 * come from specimens/globe.js; only this mapping is editorial. */
const TOWN_CC = {
  Veldhoven: 'NL', Oberkochen: 'DE', Dresden: 'DE', Hsinchu: 'TW', Tainan: 'TW', Kaohsiung: 'TW',
  Icheon: 'KR', Pyeongtaek: 'KR', Kumamoto: 'JP', Yokkaichi: 'JP', Tokyo: 'JP',
  Shanghai: 'CN', Beijing: 'CN', Wuhan: 'CN', Shenzhen: 'CN', Hefei: 'CN',
  Penang: 'MY', Singapore: 'SG', Bengaluru: 'IN', 'Abu Dhabi': 'AE',
  Hillsboro: 'US', Phoenix: 'US', Austin: 'US', Boise: 'US'
};

const COUNTRY = {
  US: 'United States', NL: 'Netherlands', DE: 'Germany', JP: 'Japan', TW: 'Taiwan', KR: 'South Korea',
  CN: 'China', MY: 'Malaysia', SG: 'Singapore', GB: 'United Kingdom', IL: 'Israel', IN: 'India',
  FR: 'France', AT: 'Austria', CH: 'Switzerland', TH: 'Thailand', CA: 'Canada', IE: 'Ireland',
  IT: 'Italy', DK: 'Denmark', AE: 'UAE'
};
/* The nine the map pins, then the rest the data supports. */
const PRIMARY = ['US', 'NL', 'DE', 'JP', 'TW', 'KR', 'CN', 'MY', 'SG'];
const SECONDARY = ['GB', 'IL', 'IN', 'FR', 'AT', 'CH', 'TH'];

/* Which chapter each matrix segment belongs to. */
const SEG_CH = {
  'EDA software': 'design-and-eda', 'Core IP': 'design-and-eda', 'AI accelerator design': 'design-and-eda',
  'Silicon wafers': 'silicon-and-wafers', Photoresist: 'chemicals-gases-and-photoresist',
  'Specialty gases': 'chemicals-gases-and-photoresist', 'EUV lithography tools': 'lithography',
  'DUV lithography tools': 'lithography', 'Deposition tools': 'deposition-and-etch', 'Etch tools': 'deposition-and-etch',
  'Metrology & inspection tools': 'metrology-and-inspection', Photomasks: 'photomasks-and-pellicles',
  'Leading-edge logic manufacturing (≤5 nm)': 'foundries-and-fabs',
  'Mature logic manufacturing (≥28 nm)': 'foundries-and-fabs',
  'DRAM manufacturing': 'memory-and-hbm', HBM: 'memory-and-hbm',
  'Advanced packaging (2.5D/3D)': 'advanced-packaging', 'Assembly, test and packaging (ATP)': 'test-and-assembly',
  'IC substrates': 'substrates-and-pcbs', 'Server assembly': 'systems-and-networking'
};

/* Short names for the strip, one word where possible. */
const SHORT = {
  'design-and-eda': 'Design', 'silicon-and-wafers': 'Silicon', 'chemicals-gases-and-photoresist': 'Chemicals',
  lithography: 'Litho', 'photomasks-and-pellicles': 'Masks', 'deposition-and-etch': 'Dep / etch',
  'metrology-and-inspection': 'Metrology', 'transistors-and-front-end': 'Front end', 'foundries-and-fabs': 'Foundry',
  'memory-and-hbm': 'Memory', 'advanced-packaging': 'Packaging', 'substrates-and-pcbs': 'Substrate',
  'test-and-assembly': 'Test', 'systems-and-networking': 'Systems', 'data-centers-and-power': 'Power'
};

const EQUIPMENT = ['Lithography', 'Deposition & Etch', 'Metrology & Inspection', 'Test', 'Advanced Packaging & OSAT', 'Equipment Subsystems & Components'];

module.exports = function (ctx) {
  const esc = ctx.esc, word = ctx.word, warn = ctx.warn, data = ctx.data;
  const chapters = data.chapters || [];
  const stages = chapters.filter((c) => c.number >= 2 && c.number <= 16);
  const matrix = (data.matrix || []).filter((r) => r.shares);
  const suppliers = data.suppliers || [];
  const exposure = data.exposure || [];
  const href = (ch) => (ch.id === 'geopolitics' ? '#/geopolitics' : '#' + ch.id);
  const byId = (id) => chapters.find((c) => c.id === id);
  const num = (v) => (Math.round(v) === v ? String(v) : String(Math.round(v * 10) / 10));
  // lower-case a label for use inside a sentence, leaving acronyms alone
  const lc = (s) => (/^[A-Z]{2,}\b/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));
  const lcCat = (s) => String(s).replace(/&/g, 'and').split(/\s+/)
    .map((w) => (/^[A-Z0-9]{2,}s?$/.test(w) ? w : w.toLowerCase())).join(' ');
  // the country names that take a definite article in a sentence
  const THE = { US: 1, NL: 1, GB: 1, AE: 1 };
  const theName = (cc, cap) => (THE[cc] ? (cap ? 'The ' : 'the ') : '') + (COUNTRY[cc] || cc);

  /* ---------------- the coastline, the towns: parsed from the globe specimen ---------------- */
  const src = ctx.read(path.join(ctx.root, 'specimens', 'globe.js')) || '';
  function block(name) {
    const i = src.indexOf('var ' + name + ' = [');
    if (i < 0) return null;
    const start = src.indexOf('[', i);
    let d = 0, j = start;
    for (; j < src.length; j++) { if (src[j] === '[') d++; else if (src[j] === ']') { d--; if (!d) { j++; break; } } }
    return src.slice(start, j);
  }
  function parseArray(name) {
    const b = block(name);
    if (!b) return null;
    try { return JSON.parse(b.replace(/\/\/[^\n]*/g, '').replace(/'/g, '"')); } catch (e) { return null; }
  }
  const LAND = parseArray('LAND');
  if (!LAND || LAND.length < 20) { warn('summary-a: could not read the land polygons from specimens/globe.js'); return { SUMMARY_A: '' }; }

  // SITES carry the chapter they belong to in a trailing comment; SUBS carry the firms.
  const sitesRe = /\['([^']+)',\s*(-?[\d.]+),\s*(-?[\d.]+),\s*(\d+)\][^\n]*\/\/\s*(\d+)\s+([^\n]*)/g;
  const subsRe = /\['([^']+)',\s*(-?[\d.]+),\s*(-?[\d.]+)\][^\n]*\/\/\s*([^\n]*)/g;
  const towns = [];
  let m, sb = block('SITES') || '';
  while ((m = sitesRe.exec(sb))) {
    const ch = chapters.find((c) => c.number === +m[5]);
    towns.push({ name: m[1], lat: +m[2], lon: +m[3], score: +m[4], sub: false, ch: ch || null, cc: TOWN_CC[m[1]] || '' });
  }
  sb = block('SUBS') || '';
  while ((m = subsRe.exec(sb))) towns.push({ name: m[1], lat: +m[2], lon: +m[3], score: 2, sub: true, note: m[4].trim(), ch: null, cc: TOWN_CC[m[1]] || '' });
  const sites = towns.filter((t) => !t.sub);
  if (sites.length !== 19) warn('summary-a: expected 19 chokepoint towns in globe.js, found ' + sites.length);
  towns.forEach((t) => { if (!t.cc) warn('summary-a: no country for the town ' + t.name); });

  /* ---------------- projection ---------------- */
  function unwrap(list) {
    const out = [[list[0][0], list[0][1]]];
    let prev = list[0][1];
    for (let i = 1; i < list.length; i++) {
      let lon = list[i][1];
      while (lon - prev > 180) lon -= 360;
      while (lon - prev < -180) lon += 360;
      out.push([list[i][0], lon]); prev = lon;
    }
    return out;
  }
  const paths = [];
  LAND.forEach((ring, i) => {
    let pts = unwrap(ring);
    const lons = pts.map((p) => p[1]);
    let lo = Math.min.apply(null, lons), hi = Math.max.apply(null, lons);
    if (lo > W1) { pts = pts.map((p) => [p[0], p[1] - 360]); lo -= 360; hi -= 360; }
    else if (hi < W0) { pts = pts.map((p) => [p[0], p[1] + 360]); lo += 360; hi += 360; }
    if (hi < W0 || lo > W1) return; // outside the window: the empty Pacific
    const lats = pts.map((p) => p[0]);
    if (Math.max.apply(null, lats) < S0 || Math.min.apply(null, lats) > N0) return;
    const d = pts.map((p, k) => (k ? 'L' : 'M') + px(p[1]) + ' ' + py(p[0])).join(' ') + 'Z';
    paths.push({ d: d, hole: i === 1 || i === 2 }); // rings 1 and 2 are the Black Sea and the Caspian
  });

  /* ---------------- the drawing ---------------- */
  let g = '';
  for (let lon = -120; lon <= 150; lon += 30) g += `<line x1="${px(lon)}" y1="0" x2="${px(lon)}" y2="${VH}" class="sa-grat"/>`;
  for (let lat = -40; lat <= 60; lat += 20) g += `<line x1="0" y1="${py(lat)}" x2="${VW}" y2="${py(lat)}" class="sa-grat${lat === 0 ? ' sa-eq' : ''}"/>`;
  const land = paths.filter((p) => !p.hole).map((p) => `<path d="${p.d}" class="sa-land"/>`).join('') +
    paths.filter((p) => p.hole).map((p) => `<path d="${p.d}" class="sa-sea"/>`).join('');

  // one anchor per country: the mean of the towns pinned there
  const anchors = {};
  PRIMARY.forEach((cc) => {
    const own = towns.filter((t) => t.cc === cc);
    if (!own.length) return;
    anchors[cc] = [own.reduce((a, t) => a + t.lat, 0) / own.length, own.reduce((a, t) => a + t.lon, 0) / own.length];
  });
  let leaders = '';
  PRIMARY.forEach((cc) => {
    const a = anchors[cc], n = NUDGE[cc];
    if (!a || !n) return;
    leaders += `<line x1="${px(a[1])}" y1="${py(a[0])}" x2="${px(n[1])}" y2="${py(n[0])}" class="sa-leader" data-cc="${cc}"/>`;
  });

  const svg = `<svg class="sa-svg" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="World map: the countries that hold the AI chip supply chain, with the chain's ${sites.length} chokepoint towns pinned.">` +
    `<rect x="0" y="0" width="${VW}" height="${VH}" class="sa-ocean"/>${g}${land}${leaders}</svg>`;

  const townDots = towns.map((t) => {
    const label = t.sub ? `${t.name} — building substitutes: ${t.note}` : `${t.name} — ${t.ch ? t.ch.title + ' (' + t.ch.score + '/5)' : ''}`;
    const d = t.sub ? 7 : 4 + t.score; // pin size follows the chokepoint score, as the globe's pin height does
    return `<span class="sa-town${t.sub ? ' sa-town--sub' : ''}" data-cc="${esc(t.cc)}" style="left:${pctX(t.lon)}%;top:${pctY(t.lat)}%;--d0:${d}px" title="${esc(label)}" aria-hidden="true"></span>`;
  }).join('');

  /* ---------------- per-country figures ---------------- */
  const totalFirms = suppliers.length;
  function country(cc) {
    const name = COUNTRY[cc] || cc;
    const named = chapters.filter((c) => (c.countries || []).some((x) => x.code === cc));
    const segs = matrix.filter((r) => r.shares[cc] != null).map((r) => {
      const rank = Object.keys(r.shares).sort((a, b) => r.shares[b] - r.shares[a]).indexOf(cc) + 1;
      return { seg: r.segment, v: r.shares[cc], year: r.year, rank: rank, ch: SEG_CH[r.segment] || null };
    }).sort((a, b) => b.v - a.v);
    const firms = suppliers.filter((s) => s.country === cc);
    const cats = {};
    firms.forEach((f) => { cats[f.category] = (cats[f.category] || 0) + 1; });
    const topCats = Object.keys(cats).sort((a, b) => cats[b] - cats[a]).slice(0, 3);
    const own = towns.filter((t) => t.cc === cc);
    const lead = [];
    chapters.forEach((c) => (c.leaders || []).forEach((l) => { if (l.country === cc && lead.indexOf(l.name) < 0) lead.push(l.name); }));
    const top5 = named.filter((c) => c.score === 5).length;
    return { cc, name, named, segs, firms, topCats, towns: own, leaders: lead, top5 };
  }
  const info = {};
  PRIMARY.concat(SECONDARY).forEach((cc) => { info[cc] = country(cc); });
  matrix.forEach((r) => { if (!SEG_CH[r.segment]) warn('summary-a: no chapter mapped for the matrix segment "' + r.segment + '"'); });

  function panel(cc, open) {
    const d = info[cc];
    const top = d.segs[0];
    const subject = theName(cc, true);
    const lede = top
      ? `${subject} holds ${num(top.v)}% of ${lc(top.seg)}${top.rank === 1 ? ', the largest share of any country' : ''}, and is named in ${word(d.named.length)} of the ${chapters.length} chapter cards.`
      : `${subject} is named in ${word(d.named.length)} of the ${chapters.length} chapter cards${d.firms.length ? `, and ${word(d.firms.length)} of the ${totalFirms} firms in the supplier list ${d.firms.length > 1 ? 'are' : 'is'} based there` : ''}.`;

    // up to three segment shares: anything it leads, or holds a tenth of
    const shares = d.segs.filter((s) => s.rank === 1 || s.v >= 10).slice(0, 3).map((s) => {
      const ch = s.ch ? byId(s.ch) : null;
      const inner = `<span class="sa-fact-k">${esc(s.seg)}</span><span class="sa-fact-v">${num(s.v)}%<small>${s.year}</small></span>`;
      return `<li class="sa-fact sa-fact--share"><span class="sa-fact-bar" style="--w:${Math.min(100, s.v)}%"></span>${ch ? `<a href="${href(ch)}">${inner}</a>` : `<span class="sa-fact-in">${inner}</span>`}</li>`;
    });

    // up to three chapter cards that name it, hardest stage first
    const cards = d.named.slice().sort((a, b) => b.score - a.score || a.number - b.number).slice(0, 3).map((c) => {
      const note = (c.countries.find((x) => x.code === cc) || {}).note || '';
      return `<li class="sa-fact sa-fact--card"><a href="${href(c)}"><span class="sa-fact-k">${esc(c.title)}<b class="sa-sc" data-score="${c.score}">${c.score}/5</b></span>${note ? `<span class="sa-fact-note">${esc(note)}</span>` : ''}</a></li>`;
    });

    let china = '';
    if (cc === 'CN') {
      const geo = byId('geopolitics'), lit = byId('lithography');
      const first5 = stages.filter((c) => c.score === 5 && (c.countries || []).some((x) => x.code === 'CN') && c.chinaStatus)[0];
      const rows = [geo, lit, first5].filter((c, i, a) => c && c.chinaStatus && a.indexOf(c) === i);
      // the first sentence of each card's China line; the chapter link carries the rest
      const first = (s) => { const m2 = String(s).match(/^[\s\S]*?[.!?](?=\s+[A-Z"'(]|$)/); return (m2 ? m2[0] : String(s)).trim(); };
      china = `<div class="sa-china"><span class="label">Where China stands, from the chapter cards</span>${rows.map((c) => `<p><a href="${href(c)}">${esc(c.title)}</a> ${esc(first(c.chinaStatus))}</p>`).join('')}</div>`;
    }

    const townLine = d.towns.length
      ? `<a href="#/geopolitics">${word(d.towns.length)} chokepoint town${d.towns.length > 1 ? 's' : ''}: ${d.towns.map((t) => esc(t.name)).join(', ')}</a>`
      : '';
    const firmLine = d.firms.length
      ? `<a href="#/suppliers">${d.firms.length} firm${d.firms.length > 1 ? 's' : ''} in the supplier list${d.topCats.length ? ', mostly ' + d.topCats.map((c) => esc(lcCat(c))).join(', ') : ''}</a>`
      : '<span>No firm in the supplier list is based here</span>';

    return `<article class="sa-panel" data-cc="${cc}"${open ? '' : ' hidden'}>
<header class="sa-panel-head"><span class="sa-panel-cc">${cc}</span><h4>${esc(d.name)}</h4></header>
<p class="sa-panel-lede">${esc(lede)}</p>
<ul class="sa-facts">${shares.join('')}${cards.join('')}</ul>
${china}
<p class="sa-panel-foot">${firmLine}${townLine ? ' <span class="sa-dot-sep">·</span> ' + townLine : ''}</p>
</article>`;
  }

  const DEFAULT_CC = 'TW';
  // marker area is proportional to the number of chapter cards that name the country, with a floor big enough to tap
  const markers = PRIMARY.map((cc) => {
    const a = anchors[cc], n = NUDGE[cc] || a;
    if (!a) return '';
    const d = info[cc];
    const dia = Math.max(22, Math.round(8.25 * Math.sqrt(d.named.length)));
    return `<button type="button" class="sa-marker" data-cc="${cc}" data-hard="${d.top5 ? 1 : 0}" style="left:${pctX(n[1])}%;top:${pctY(n[0])}%;--d0:${dia}px" aria-pressed="${cc === DEFAULT_CC}" aria-label="${esc(d.name)}: named in ${d.named.length} of the ${chapters.length} chapters"><span class="sa-marker-dot"><span class="sa-marker-cc" aria-hidden="true">${cc}</span></span></button>`;
  }).join('');

  const chip = (cc) => `<button type="button" class="sa-chip${PRIMARY.indexOf(cc) < 0 ? ' sa-chip--minor' : ''}" data-cc="${cc}" aria-pressed="${cc === DEFAULT_CC}" title="${esc(info[cc].name)} is named in ${info[cc].named.length} of the ${chapters.length} chapter cards">${esc(info[cc].name)}<small>${info[cc].named.length}</small></button>`;
  const chips = `<div class="sa-chiprow"><span class="label">Pinned on the map</span><div class="sa-chipset" role="group" aria-label="Countries pinned on the map">${PRIMARY.map(chip).join('')}</div></div>`
    + `<div class="sa-chiprow"><span class="label">Also in the chain</span><div class="sa-chipset" role="group" aria-label="Other countries in the chain">${SECONDARY.map(chip).join('')}</div></div>`;

  const panels = PRIMARY.concat(SECONDARY).map((cc) => panel(cc, cc === DEFAULT_CC)).join('');

  /* ---------------- the chain in one strip ---------------- */
  const DEFAULT_STAGE = stages.filter((c) => c.score === 5)[0] || stages[0];
  const tiles = stages.map((c) => `<li><button type="button" class="sa-tile" data-id="${esc(c.id)}" data-score="${c.score}" aria-pressed="${c.id === DEFAULT_STAGE.id}"><span class="sa-tile-n">${String(c.number).padStart(2, '0')}</span><span class="sa-tile-bar"><i></i></span><span class="sa-tile-t">${esc(SHORT[c.id] || c.title)}</span><span class="sr-only">${esc(c.title)}, chokepoint score ${c.score} of 5</span></button></li>`).join('');
  const details = stages.map((c) => {
    const led = (c.leaders || []).slice(0, 4).map((l) => `<li><span class="sa-cc">${esc(l.country || '')}</span>${esc(l.name)}</li>`).join('');
    return `<div class="sa-stage-detail" data-id="${esc(c.id)}"${c.id === DEFAULT_STAGE.id ? '' : ' hidden'}>
<h4><span class="sa-tile-n">${String(c.number).padStart(2, '0')}</span>${esc(c.title)}<b class="sa-sc" data-score="${c.score}">${c.score}/5</b></h4>
<p>${esc(c.plain)}</p>
${led ? `<div class="sa-stage-leaders"><span class="label">Who leads</span><ul>${led}</ul></div>` : ''}
<p class="sa-stage-link"><a href="${href(c)}">Read ${esc(c.title)} →</a></p>
</div>`;
  }).join('');

  /* ---------------- four numbers ---------------- */
  const hardest = stages.filter((c) => c.score === 5);
  const euvRow = matrix.find((r) => /^EUV lithography/i.test(r.segment));
  const euvNL = euvRow ? euvRow.shares.NL : null;
  const euvMakers = suppliers.filter((s) => s.category === 'Lithography' && /EUV/.test(s.subcategory || '') && /scanner/i.test(s.subcategory || ''));
  const tkTW = sites.filter((t) => t.cc === 'TW' || t.cc === 'KR');
  const tkPct = Math.round((tkTW.length / sites.length) * 100);
  // the largest equipment vendor in the supplier list that also files a China share
  const expFirms = {};
  exposure.forEach((r) => { if (r.chinaShare != null && r.fyEnd) (expFirms[r.firm] = expFirms[r.firm] || []).push(r); });
  let bigTool = null;
  Object.keys(expFirms).forEach((f) => {
    const s = suppliers.find((x) => x.name === f);
    if (!s || EQUIPMENT.indexOf(s.category) < 0 || s.revenueUSDb == null) return;
    if (!bigTool || s.revenueUSDb > bigTool.rev) {
      const rows = expFirms[f].slice().sort((a, b) => (a.fyEnd < b.fyEnd ? -1 : 1));
      bigTool = { firm: f, rev: s.revenueUSDb, country: s.country, row: rows[rows.length - 1] };
    }
  });
  const litho = byId('lithography'), geoCh = byId('geopolitics');
  const numbers = [
    { n: word(hardest.length), s: `of the ${stages.length} stages score 5 out of 5 for concentration: the tallest bars in the strip above, from ${esc(hardest[0].title)} to ${esc(hardest[hardest.length - 1].title)}.`, href: '#chain', link: 'The chain, scored' },
    euvMakers.length ? { n: word(euvMakers.length), s: `firm in the supplier list builds extreme ultraviolet scanners: ${euvMakers.map((s) => esc(s.name) + (s.city ? ' of ' + esc(s.city) : '')).join(' and ')}${euvNL != null ? `. The Netherlands holds ${num(euvNL)}% of that segment` : ''}.`, href: href(litho), link: 'Lithography' } : null,
    { n: tkPct + '%', s: `of the chain's ${sites.length} chokepoint towns are on Taiwan or in South Korea: ${tkTW.map((t) => esc(t.name)).join(', ')}.`, href: '#/geopolitics', link: 'Geopolitics' },
    bigTool ? { n: num(bigTool.row.chinaShare) + '%', s: `of ${esc(bigTool.firm)}'s revenue came from China in ${esc(bigTool.row.fiscalYear)}. It is the largest equipment vendor in the supplier list, at $${num(bigTool.rev)}bn a year.`, href: '#/exposure', link: 'China revenue share' } : null
  ].filter(Boolean).map((k) => `<li class="sa-num"><b>${k.n}</b><p>${k.s}</p><a href="${k.href}">${k.link} →</a></li>`).join('');

  /* ---------------- the lead ---------------- */
  const codes = {};
  stages.forEach((c) => (c.countries || []).forEach((x) => { codes[x.code] = 1; }));
  const nCodes = Object.keys(codes).length;
  const lead = `An AI accelerator is made in ${word(stages.length)} stages spread across ${word(nCodes)} countries, and ${word(hardest.length)} of those stages score 5 out of 5 for concentration: a handful of firms, in one or two countries, hold them.`;

  const html = `<div class="sa">
<div class="view-head">
<h2>Where AI chips are made</h2>
<p class="dek">${esc(lead)}</p>
</div>

<section class="sa-mapwrap" aria-label="The chain, country by country">
<div class="sa-map-head">
<h3 class="sa-h">Pick a country</h3>
<p class="sa-sub">Copper pins are the chain's ${word(sites.length)} chokepoint towns, taller pins for the harder stages; dark pins are the ${word(towns.length - sites.length)} towns building substitutes. Markers sit beside crowded coasts, joined to the country by a line.</p>
</div>
<div class="sa-grid">
<div class="sa-map" data-cc="${DEFAULT_CC}">
${svg}
<div class="sa-overlay">${townDots}${markers}</div>
</div>
<div class="sa-panels" aria-live="polite">${panels}</div>
<div class="sa-chips">${chips}</div>
<p class="sa-legend"><span class="sa-lg sa-lg--big"></span>Marker area: how many of the ${chapters.length} chapter cards name the country<span class="sa-lg sa-lg--hard"></span>Heavier ring: named by a stage scored 5 of 5<span class="sa-lg sa-lg--pin"></span>Chokepoint town<span class="sa-lg sa-lg--sub"></span>Town building a substitute</p>
</div>
</section>

<section class="sa-strip">
<div class="sa-map-head">
<h3 class="sa-h">The chain in one strip</h3>
<p class="sa-sub">One tile per stage, in order. Bar height is the chokepoint score, 1 to 5. Hover or tap a stage for what it is and who leads it.</p>
</div>
<ol class="sa-tiles">${tiles}</ol>
<div class="sa-details">${details}</div>
</section>

<section class="sa-numbers">
<div class="sa-map-head"><h3 class="sa-h">Four numbers that matter</h3></div>
<ul class="sa-nums">${numbers}</ul>
</section>

<section class="sa-cta">
<a class="sa-cta-main" href="#chain">Read the whole chain, stage by stage <span>${stages.length} stages · ${chapters.length} chapters</span></a>
<p class="sa-cta-links"><a href="#/landscape">AI Chips</a> <a href="#/controls">Export Controls</a> <a href="#/sources">Sources</a></p>
</section>
</div>`;

  // the home page: the map alone, with two ways onward
  const mapStart = html.indexOf('<section class="sa-mapwrap"'), mapEnd = html.indexOf('</section>', mapStart) + '</section>'.length;
  const homeMap = `<div class="sa sa--home">${html.slice(mapStart, mapEnd)}
<nav class="sa-exits" aria-label="Where to go next"><a class="sa-exit" href="#/intro"><b>Intro</b><span>${ctx.cap(word(Math.max(1, Math.round(ctx.all.reduce((a, c) => a + (c.meta.plain || '').split(/\s+/).length, 0) / 230))))} minutes, one plain paragraph per stage, with the 3D specimens.</span></a><a class="sa-exit" href="#/chain"><b>The Chain</b><span>Every stage in full: ${chapters.length} chapters, every number linked to its source.</span></a></nav>
</div>`;
  return { SUMMARY_A: html, HOME_MAP: homeMap };
};
