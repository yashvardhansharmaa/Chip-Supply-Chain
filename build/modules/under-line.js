/* CHIPS BUILT JUST UNDER THE LINE: the first section of Export Controls. Rebuilt on 29 Oct 2026 after the owner's "i don't
   love this" and a review by UI, UX and three reader agents (MAIN/qa/excellence/controls-review/): the scatter with five
   rule buttons and a month ruler became a ladder that reads without a click.

   One row for each US move that changed what these chips needed: 7 October 2022, 17 October 2023, 9 April 2025 and
   13 January 2026, each the day the US made it public (announced, or for the H20 the notice to Nvidia; the October 2023
   rule took force on 17 November, the January 2026 rule on publication, 15 January; the December 2024 rule controlled memory stacks and moved none
   of these chips, so it stays in the timeline). Every row shares one scale, total processing performance (TPP), the rules'
   own measure, so a chip sits at the same place down the ladder. Each row's lanes are its license status: needs a license
   to ship to China (tinted), reviewed case by case (January 2026 only, hatched), no license needed. A chip that changes
   lane between rows is a chip a rule caught. Row 1's arrows are Nvidia's design move, the chip-to-chip bandwidth cut from
   each parent to its China version; row 2's inset magnifies the H20 against the 2,400 line.

   This module writes the section into src/template.html ({{UNDER_LINE}}): the head, the rows' sentences, the Table, the
   CSV, the citation and the source line. src/modules/underline.js draws the rows from the data under it.

   Nothing here types a figure of its own: every TPP and bandwidth printed is checked against the chip's own record in
   data/landscape.json, every line against data/control-thresholds.json, and every number in a row's sentence against the
   record or entry it comes from. A record that no longer says what is printed stops the build with the chip and the words. */
'use strict';
const SITE = require('../site.js');

// id: [TPP to plot, TPP as the record prints it, chip-to-chip as the record prints it]
const CHIPS = {
  'nvidia-a100': [4992, '4,992', '600 GB/s (NVLink 3)'],
  'nvidia-h100': [15832, '15,832', '900 GB/s (NVLink 4)'],
  'nvidia-a800': [4992, '4,992', '400 GB/s (CSIS)'],
  'nvidia-h800': [15832, '15,832', '300 GB/s (CSIS) or 400 GB/s (Epoch AI)'],
  'nvidia-h20': [2368, '2,368', 'Not published'],
  'nvidia-h200-china': [15800, 'roughly 15,800', '900 GB/s (NVLink 4)'],
  'amd-mi325x': [20919, '20,919', 'Not stated as one figure'],
};
// the words each chip-to-chip figure must match in the record's interconnect field
const C2C_IN = { 'nvidia-a100': ['600'], 'nvidia-h100': ['900'], 'nvidia-a800': ['400 GB/s'], 'nvidia-h800': ['300 GB/s', '400 GB/s'], 'nvidia-h200-china': ['900'] };
const SHORT = { 'nvidia-h200-china': 'H200', 'nvidia-h20': 'H20', 'nvidia-h800': 'H800', 'nvidia-a800': 'A800', 'nvidia-h100': 'H100', 'nvidia-a100': 'A100', 'amd-mi325x': 'MI325X' };
const NAMED = ['nvidia-a800', 'nvidia-h800', 'nvidia-h20']; // in wine: the chips the title names

/* the rows. lanes top to bottom; at: each chip's lane in that row (a chip announced later is absent); lines: the TPP lines
   drawn, [value, label, kind]; arrows: [from, to, label], Nvidia's cut; checks: [words, where] for every number and claim
   the row's sentences print. Status, chip by chip, from its record:
   - 2022: A100 and H100 cross 4,800 and 600 GB/s; the A800 (400 GB/s) and H800 (300 or 400) fall outside.
   - 2023: the A800 and H800 are caught; the H200 (about 15,800) and MI325X (20,919) are over 4,800; the H20 sits under 2,400
     and under the 3.2 density line.
   - April 2025: the H20 needs a license, by the US government's notice to Nvidia.
   - January 2026: the A100, H100, H200 and MI325X are under both ceilings and reviewable case by case; the A800 and H800,
     built for China, are left out; the H20's license comes from the April 2025 notice, outside 3A090.a's review band. */
const RULES = [
  { id: 'oct-2022', date: '7 October 2022', kind: 'announced', short: 'Oct 2022', lanes: ['lic', 'none'],
    head: 'License needed for chips at 4,800 TPP or more that also move 600 GB/s or more to other chips',
    at: { 'nvidia-a100': 'lic', 'nvidia-h100': 'lic', 'nvidia-a800': 'none', 'nvidia-h800': 'none' },
    lines: [[4800, '4,800', 'k']],
    arrows: [['nvidia-a100', 'nvidia-a800', '600 → 400 GB/s'], ['nvidia-h100', 'nvidia-h800', '900 → 300 or 400 GB/s']],
    note: 'Nvidia kept the TPP and cut the chip-to-chip bandwidth. The A800 at 400 GB/s, and the H800 at 300 GB/s by CSIS’s count or 400 GB/s by Epoch AI’s, fell outside the rule.',
    checks: [['announced 7 October 2022', '3a090-2022-original'], ['Cutting NVLink to 400 GB/s put the A800 outside the rule', 'nvidia-a800'], ['The H800 cleared the October 2022 rule', 'nvidia-h800']] },
  { id: 'oct-2023', date: '17 October 2023', kind: 'announced', short: 'Oct 2023', lanes: ['lic', 'none'],
    head: 'The 600 GB/s test is gone. License needed from 4,800 TPP, with a lighter control from 2,400',
    at: { 'nvidia-a100': 'lic', 'nvidia-h100': 'lic', 'nvidia-a800': 'lic', 'nvidia-h800': 'lic', 'nvidia-h200-china': 'lic', 'amd-mi325x': 'lic', 'nvidia-h20': 'none' },
    lines: [[2400, '2,400', 'm'], [4800, '4,800', 'k']], inset: 'nvidia-h20',
    note: 'The rule caught the A800 and H800. Nvidia designed the H20 to sit just under it, at 2,368 TPP against the 2,400 line, and at a performance density of about 2.9 against 3.2 if it uses the 814 mm² Hopper die. The lighter control let exporters ship after notifying BIS in advance.',
    checks: [['The A800 was controlled under the rule BIS issued on 17 October 2023', 'nvidia-a800'], ['The H800 was controlled under the rule BIS issued on 17 October 2023', 'nvidia-h800'],
      ['Nvidia designed the H20 to sit just under the thresholds of the 2023 rule', 'nvidia-h20'], ['2,368', 'nvidia-h20'], ['814 mm²', 'nvidia-h20'], ['about 2.9', 'nvidia-h20'], ['under the 3.2', 'nvidia-h20'],
      ['on advance notification to BIS', '3a090b-tpp']] },
  { id: 'apr-2025', date: '9 April 2025', kind: 'notice to Nvidia', short: 'Apr 2025', lanes: ['lic', 'none'],
    head: 'The US tells Nvidia the H20 needs a license, and so does any chip matching its memory or interconnect bandwidth',
    at: { 'nvidia-a100': 'lic', 'nvidia-h100': 'lic', 'nvidia-a800': 'lic', 'nvidia-h800': 'lic', 'nvidia-h200-china': 'lic', 'amd-mi325x': 'lic', 'nvidia-h20': 'lic' },
    lines: [[2400, '2,400', 'm'], [4800, '4,800', 'k']],
    note: 'The H20 now needed a license like the rest. The US granted licenses in August 2025 for H20 sales to certain customers in China.',
    checks: [['Since 9 April 2025 the H20 has needed a US license', 'nvidia-h20'], ['any chip matching its memory or interconnect bandwidth', 'nvidia-h20'], ['granted licenses in August 2025 for H20 sales to certain China-based customers', 'nvidia-h20']] },
  { id: 'jan-2026', date: '13 January 2026', kind: 'announced', short: 'Jan 2026', lanes: ['case', 'lic', 'none'],
    head: 'Case-by-case review for chips below 21,000 TPP and 6,500 GB/s of memory bandwidth, if sold in the United States when the rule was published',
    at: { 'nvidia-a100': 'case', 'nvidia-h100': 'case', 'nvidia-h200-china': 'case', 'amd-mi325x': 'case', 'nvidia-a800': 'lic', 'nvidia-h800': 'lic', 'nvidia-h20': 'lic' },
    lines: [[4800, '4,800', 'k'], [21000, '21,000', 'k']],
    note: 'The H200 and MI325X, which the rule names, can be licensed case by case, as can the A100 and H100. The A800 and H800, built for the China market, were left out. In its filing for the quarter ended 26 July 2026, Nvidia said China’s government had restricted H200 sales.',
    checks: [['BIS announced the policy on 13 January 2026', '@2026-01-15'], ['That rule names the H200 and the AMD MI325X', 'nvidia-h200-china'], ['can be reviewed case by case', 'nvidia-a100'], ['can be reviewed case by case', 'nvidia-h100'], ['falls under both ceilings', 'amd-mi325x'],
      ['commercially available in the United States when it was published, and Nvidia built the A800 for the China market', 'nvidia-a800'],
      ['commercially available in the United States when it was published, and Nvidia built the H800 for the China market', 'nvidia-h800'],
      ['In its filing for the quarter ended 26 July 2026, Nvidia said China\'s government had restricted these sales', 'nvidia-h200-china']] },
];
const LANE = { lic: 'Needs a license', case: 'Case by case', none: 'No license' };
const LANE_LONG = { lic: 'License needed', case: 'License reviewed case by case', none: 'No license needed', '': 'Not yet announced' };
// the lines drawn, and the value each has in data/control-thresholds.json
const LINES = [['3a090a-tpp', 4800], ['3a090-2022-original', 600], ['3a090b-tpp', 2400], ['jan2026-review-band-tpp', 21000], ['jan2026-dram-bandwidth-band', 6500]];
const SOURCES = [
  ['87 FR 62186, October 2022', 'https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor'],
  ['88 FR 73458, October 2023', 'https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items-supercomputer-and'],
  ['Nvidia 8-K, April 2025', 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000082/nvda-20250409.htm'],
  ['Nvidia 10-K, fiscal 2026', 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm'],
  ['91 FR 1684, January 2026', 'https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities'],
  ['Nvidia 10-Q, July 2026', 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm'],
];
const TITLE = 'Seven AI chips by total processing performance (TPP), and whether shipping each to China needed a US license, after each of four US moves from October 2022 to January 2026';
const FINDING = 'Nvidia built the A800, H800 and H20 to stay under US limits, and the US closed each gap';
// held back (owner, 29 Oct 2026: "remove the 'Chips built just under the line' and start with the coming up section and the
// timeline below"): the checks still run on every build, the page shows nothing until a simpler picture is chosen
// (MAIN/qa/excellence/controls-alt/)
const SHOWN = false;
const FID = 'controls-ul-fig'; // ids open with "controls", so src/preroute.js shows Export Controls for them before boot
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = function (ctx) {
  const { root, path, readJSON, esc } = ctx;
  const landscape = readJSON(path.join(root, 'data', 'landscape.json'), []), thresholds = readJSON(path.join(root, 'data', 'control-thresholds.json'), []);
  const timeline = readJSON(path.join(root, 'data', 'export-controls-timeline.json'), []);
  const L = new Map(landscape.map((c) => [c.id, c])), T = new Map(thresholds.map((t) => [t.id, t]));
  const bad = [], need = (text, hay, what) => { if (!String(hay || '').replace(/’/g, '\'').includes(text.replace(/’/g, '\''))) bad.push(`${what}: "${text}" is not in its record`); };
  const chips = [];
  Object.keys(CHIPS).forEach((id) => {
    const c = L.get(id); if (!c) { bad.push(`${id}: no such chip in data/landscape.json`); return; }
    const [tpp, tppT, c2cT] = CHIPS[id], es = c.exportStatus || '', ic = (c.interconnect || {}).chipToChip || '';
    need(tppT, es, `${id} TPP`);
    (C2C_IN[id] || []).forEach((w) => need(w, ic, `${id} chip-to-chip`));
    const bw = (c.memory || {}).bandwidthTBs;
    if (typeof bw !== 'number') { bad.push(`${id}: its record gives no memory bandwidth`); return; }
    chips.push({ id, name: SHORT[id], full: c.name, vendor: c.vendor, announced: String(c.announced), tpp, tppT, c2cT,
      bwT: `${Math.round(bw * 1000).toLocaleString('en-US')} GB/s`, named: NAMED.includes(id) }); // the record's TB/s in GB/s, the unit the lines use
  });
  RULES.forEach((r) => r.checks.forEach(([w, where]) => {
    if (where[0] === '@') need(w, timeline.filter((e) => e.date === where.slice(1)).map((e) => e.summary).join(' '), `${r.id} sentence, timeline ${where.slice(1)}`); // a timeline entry, by its date
    else if (L.has(where)) need(w, L.get(where).exportStatus, `${r.id} sentence, ${where}`);
    else { const t = T.get(where); need(w, t && [t.instrument, t.licensePolicy, t.note, t.alternative].join(' '), `${r.id} sentence, ${where}`); }
  }));
  LINES.forEach(([id, v]) => { const t = T.get(id); if (!t || t.value !== v) bad.push(`control line ${id}: data/control-thresholds.json gives ${t ? t.value : 'nothing'}, the figure prints ${v}`); });
  if (bad.length) throw new Error('chips under the line: ' + bad.join('; '));

  // the Table and the CSV: one row per chip, as its record prints it, then its status after each move
  const annT = (a) => { const p = String(a).split('-'); return p[1] ? `${MONTHS[+p[1] - 1]} ${p[0]}` : p[0]; };
  const head = ['Chip', 'Announced', 'TPP', 'Chip-to-chip bandwidth', 'Memory bandwidth'].concat(RULES.map((r) => `After ${r.date}`));
  const rows = chips.map((c) => [`${c.vendor} ${c.full}`, annT(c.announced), c.tppT, c.c2cT, c.bwT].concat(RULES.map((r) => LANE_LONG[r.at[c.id] || ''])));
  const page = SITE.url + '#/controls';
  const q = (v) => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const about = [['Title', TITLE], ['Source', SOURCES.map((s) => s[0]).join(', ') + ', and each chip\'s record on AI Chips'], ['Figure address', page]];
  const csv = 'data:text/csv;charset=utf-8,' + encodeURIComponent('﻿' + [head].concat(rows, [[]], about).map((r) => r.map(q).join(',')).join('\r\n') + '\r\n');
  const table = `<table class="sr-only fig-table"><caption>${esc(TITLE)}</caption><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>`
    + rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
  const ext = (s) => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`;
  // each row: its date and rule, the drawing's place, the chips' answer
  const ladder = RULES.map((r, i) => `<li class="ul-row" data-r="${i}"><p class="ul-rh"><b>${esc(r.date)}</b><span class="ul-rk">${esc(r.kind)}</span>${esc(r.head)}</p><div class="ul-track" data-r="${i}"></div><p class="ul-rn">${esc(r.note)}</p></li>`).join('');
  const key = '<p class="ul-key" aria-hidden="true"><span><i class="n"></i>A800, H800, H20</span><span><i class="m"></i>Other chips</span><span><i class="l"></i>Needs a US license to ship to China</span><span><i class="c"></i>License reviewed case by case</span></p>';
  const cite = `<div class="ch-cite-box fig-cite-box" id="controls-ul-cite" role="region" aria-label="Citation for the figure" hidden><p class="ch-cite-text">Sharma, Yashvardhan. “${esc(FINDING)}.” <i>Chip Supply Chain: How AI Chips Are Made</i>. Updated ${esc(ctx.builtStr)}. <a href="${esc(page)}">${esc(page)}</a>. Data: each chip's record on AI Chips, and the US rules and Nvidia filings of October 2022 to July 2026.</p></div>`;
  const json = JSON.stringify({ chips, rules: RULES.map((r) => ({ id: r.id, date: r.date, kind: r.kind, short: r.short, head: r.head, note: r.note, lanes: r.lanes, at: r.at, lines: r.lines, arrows: r.arrows || [], inset: r.inset || null })), lane: LANE }).replace(/</g, '\\u003c');
  const html = `<section class="ul" id="controls-under-the-line" aria-labelledby="controls-ul-h">
      <h2 class="cf-up-h" id="controls-ul-h">Chips built just under the line</h2>
      <figure class="figure ul-fig" id="${FID}">
        <div class="fig-head"><p class="fig-title fig-find">${esc(FINDING)}</p><p class="fig-sub">${esc(TITLE)}</p></div>
        <div class="fig-body">${key}<ol class="ul-ladder">${ladder}</ol><p class="ul-axis" aria-hidden="true">Total processing performance (TPP), the rules’ measure of a chip’s computing power <span>→</span></p>
          <div class="ul-rec" aria-live="polite" hidden></div>${table}</div>
        <div class="fig-strip"><span class="fs-src"><span class="fs-k">Source:</span> ${SOURCES.map(ext).join(', ')}, and each chip's record on <a href="#/landscape">AI Chips</a></span><span class="fs-acts" data-kind="scatter"><button type="button" class="ch-cite-btn" aria-expanded="false" aria-controls="controls-ul-cite">Cite</button><a class="fs-csv" href="${csv}" download="chip-supply-chain-chips-under-the-line.csv">CSV</a></span>${cite}</div>
      </figure>
      <script type="application/json" id="controls-ul-data">${json}</script>
      </section>`;
  return { UNDER_LINE: SHOWN ? html : '' };
};
