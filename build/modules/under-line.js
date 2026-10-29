/* CHIPS BUILT JUST UNDER THE LINE: the first section of Export Controls (the owner's approved mockup 5 of 29 Oct 2026,
   MAIN/qa/excellence/mocks/figures/). Each AI chip whose record states its total processing performance (TPP) is plotted
   against the US control lines for China in force on a date the reader sets, with five buttons for the five rule changes.
   The vertical scale is the second quantity the rule in force measured: chip-to-chip bandwidth under the October 2022
   rule (and after its deletion, until December 2024), memory bandwidth from the December 2024 rule on.

   This module writes the section into src/template.html ({{UNDER_LINE}}) in the site's figure grammar: the head, the
   chart's place, the Table, the CSV, the citation and the source line. src/modules/underline.js draws the chart, the date
   ruler and the chosen chip from the data under it, and adds the Table and PNG buttons.

   Nothing here types a figure of its own: every TPP and bandwidth printed is checked against the chip's own record in
   data/landscape.json (its exportStatus, its interconnect, its memory bandwidth), every line against
   data/control-thresholds.json, and every note is quoted from the record. A record that no longer says what is printed
   stops the build with the chip and the words. A chip whose record states no TPP is not drawn, and the page does not
   name it. */
'use strict';
const SITE = require('../site.js');

// id: [TPP to plot, TPP as the record prints it, chip-to-chip to plot (a number, [low, high], or null), as printed, a note quoted from the record]
const CHIPS = {
  'nvidia-a100': [4992, '4,992', 600, '600 GB/s (NVLink 3)', 'BIS drew its first export thresholds around this chip.'],
  'nvidia-h100': [15832, '15,832', 900, '900 GB/s (NVLink 4)', 'NVLink 4 at 900 GB/s also exceeded the 600 GB/s interconnect limit in the original October 2022 rule, so both halves of that rule caught the H100.'],
  'nvidia-a800': [4992, '4,992', 400, '400 GB/s (CSIS)', 'Cutting NVLink to 400 GB/s put the A800 outside the rule.'],
  'nvidia-h800': [15832, '15,832', [300, 400], '300 GB/s (CSIS) or 400 GB/s (Epoch AI)', 'The H800 cleared the October 2022 rule because that rule controlled a chip only if it crossed both the 4,800 and the 600 GB/s interconnect thresholds.'],
  'nvidia-h20': [2368, '2,368', null, 'Not published', 'Nvidia designed the H20 to sit just under the thresholds of the 2023 rule.'],
  'nvidia-h200-china': [15800, 'roughly 15,800', 900, '900 GB/s (NVLink 4)', 'Licensable to China and Macau, case by case, since the BIS final rule effective 15 January 2026.'],
  'amd-mi300x': [20919, '20,919', null, 'Not stated as one figure', 'On the published numbers it falls inside the band that the BIS rule effective 15 January 2026 moved to case-by-case review for exports to China and Macau.'],
  'amd-mi325x': [20919, '20,919', null, 'Not stated as one figure', 'The MI325X falls under both ceilings, at 20,919 TPP and 6,000 GB/s.'],
  'google-tpu-v4': [4400, '4,400', null, 'Not stated as one figure', 'Total processing performance is 4,400 (16 × 275), 400 points below the 4,800 threshold in ECCN 3A090.a.'],
  'google-tpu-v5e': [3152, '3,152', 400, '400 GB/s bidirectional', 'Total processing performance is 3,152 (16 × 197), below the 4,800 in ECCN 3A090.a, as are the H20, the TPU v4 and MTIA v2. But the second test, performance density, would catch it.'],
  'google-tpu-v5p': [7344, '7,344', 1200, '1,200 GB/s bidirectional', 'Total processing performance is 7,344, above the 4,800 threshold in ECCN 3A090.a.'],
  'google-tpu-v6e': [14688, '14,688', 800, '800 GB/s bidirectional', 'Not sold as merchant silicon. Google uses it internally and rents it out as Cloud TPU, so export control applies to the physical shipment of racks abroad.'],
  'aws-trainium2': [10672, '10,672', null, 'Not stated as one figure', 'Not sold as merchant silicon. AWS uses it in-house and rents it out as EC2 Trn2 instances.'],
  'microsoft-maia-100': [12800, '12,800', null, 'Not stated as one figure', 'Not sold as merchant silicon. Microsoft deploys it only in its own Azure cloud.'],
  'meta-mtia-v2': [2832, '2,832', null, 'None on the package', 'MTIA v2 is the clearest case of a chip that the density test catches and the 4,800 threshold misses.'],
  'intel-gaudi2': [6920, '6,920', null, 'Not stated as one figure', 'Controlled. Total processing performance is 6,920, above the 4,800 threshold in ECCN 3A090.a.'],
  'huawei-ascend-910b': [6400, '6,400', 392, '392 GB/s (Epoch AI)', 'Chinese design and Chinese fab.'],
};
const SHORT = { 'nvidia-h200-china': 'H200', 'nvidia-h20': 'H20', 'nvidia-h800': 'H800', 'nvidia-a800': 'A800', 'nvidia-h100': 'H100', 'nvidia-a100': 'A100',
  'amd-mi300x': 'MI300X', 'amd-mi325x': 'MI325X', 'google-tpu-v4': 'TPU v4', 'google-tpu-v5e': 'TPU v5e', 'google-tpu-v5p': 'TPU v5p',
  'google-tpu-v6e': 'TPU v6e', 'aws-trainium2': 'Trainium2', 'microsoft-maia-100': 'Maia 100', 'meta-mtia-v2': 'MTIA v2',
  'intel-gaudi2': 'Gaudi 2', 'huawei-ascend-910b': 'Ascend 910B' };
// sold as chips; the rest are used in-house by their makers, or made in China (an open dot)
const MERCHANT = ['nvidia-a100', 'nvidia-h100', 'nvidia-a800', 'nvidia-h800', 'nvidia-h20', 'nvidia-h200-china', 'amd-mi300x', 'amd-mi325x', 'intel-gaudi2'];
// the three chips the title names: a note for each rule, quoted from the chip's own record ('' keeps the chip's note)
const ERA_NOTES = {
  'nvidia-a800': ['Cutting NVLink to 400 GB/s put the A800 outside the rule.',
    'The A800 was controlled under the rule BIS issued on 17 October 2023.',
    'The A800 was controlled under the rule BIS issued on 17 October 2023.',
    'The A800 was controlled under the rule BIS issued on 17 October 2023.',
    'That rule covers only chips commercially available in the United States when it was published, and Nvidia built the A800 for the China market.'],
  'nvidia-h800': ['The H800 cleared the October 2022 rule because that rule controlled a chip only if it crossed both the 4,800 and the 600 GB/s interconnect thresholds.',
    'When BIS removed the interconnect threshold, the rule caught the H800 at once, along with the A800.',
    'When BIS removed the interconnect threshold, the rule caught the H800 at once, along with the A800.',
    'When BIS removed the interconnect threshold, the rule caught the H800 at once, along with the A800.',
    'That rule covers only chips commercially available in the United States when it was published, and Nvidia built the H800 for the China market.'],
  'nvidia-h20': ['', 'Nvidia designed the H20 to sit just under the thresholds of the 2023 rule.',
    'Nvidia designed the H20 to sit just under the thresholds of the 2023 rule.',
    'Since 9 April 2025 the H20 has needed a US license for China, after the US government told Nvidia that the chip, and any chip matching its memory or interconnect bandwidth, needed one indefinitely.',
    'Since 9 April 2025 the H20 has needed a US license for China, after the US government told Nvidia that the chip, and any chip matching its memory or interconnect bandwidth, needed one indefinitely.'],
};
// the five rule changes: the month each took effect (months from October 2022), the last month it held, its name on the
// date line, the scale it is drawn on, and its sentence under the chart (each from data/export-controls-timeline.json,
// control-thresholds.json or the chips' records)
const LAST = 48; // October 2026
const ERAS = [
  { at: 0, end: 11, key: 'Oct 2022', rule: 'the rule of 21 October 2022', mode: 'c2c',
    cap: 'BIS controlled chips with a TPP of 4,800 or more combined with interconnect bandwidth of 600 GB/s or more. Cutting NVLink to 400 GB/s put the A800 outside the rule, and the H800 cleared it the same way.' },
  { at: 12, end: 25, key: 'Oct 2023', rule: 'the rule of 17 October 2023', mode: 'c2c',
    cap: 'BIS replaced the interconnect-bandwidth test with a performance-density test, and the A800 and H800 fell under the rule. Nvidia designed the H20 to sit just under the thresholds of the 2023 rule, at a TPP of 2,368, below the 2,400 line in 3A090.b. The density test divides TPP by die area, so it has no line here.' },
  { at: 26, end: 29, key: 'Dec 2024', rule: 'the rule of 2 December 2024', mode: 'mem',
    cap: 'High bandwidth memory came under control for the first time, wherever it is made. The rule covers memory above 2 GB/s per square millimeter of stack, a line BIS said every stack then in production exceeded.' },
  { at: 30, end: 38, key: 'Apr 2025', rule: 'the H20 license requirement of 9 April 2025', mode: 'mem',
    cap: 'The US required a license even for the H20, and for any chip matching its memory or interconnect bandwidth.' },
  { at: 39, end: LAST, key: 'Jan 2026', rule: 'the rule of 15 January 2026', mode: 'mem',
    cap: 'Chips with TPP below 21,000 and memory bandwidth below 6,500 GB/s, the band of the H200 and MI325X, moved to case-by-case review for China. The rule covers only chips commercially available in the United States when it was published, which leaves out the A800 and H800 that Nvidia built for the China market.' },
];
// the lines drawn, and the value each has in data/control-thresholds.json
const LINES = [['3a090a-tpp', 4800], ['3a090-2022-original', 600], ['3a090b-tpp', 2400], ['jan2026-review-band-tpp', 21000], ['jan2026-dram-bandwidth-band', 6500], ['3a090c-hbm-bandwidth-density', 2]];
const SOURCES = [
  ['87 FR 62186, October 2022', 'https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor'],
  ['88 FR 73458, October 2023', 'https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items-supercomputer-and'],
  ['89 FR 96790, December 2024', 'https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing'],
  ['Nvidia 8-K, April 2025', 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000082/nvda-20250409.htm'],
  ['91 FR 1684, January 2026', 'https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities'],
];
const TITLE = 'AI chips by total processing performance (TPP) and bandwidth, against the US control lines for China, October 2022 to January 2026';
const FINDING = 'Nvidia built the A800, H800 and H20 to sit just under the line in force';
const FID = 'controls-ul-fig'; // ids open with "controls", so src/preroute.js shows Export Controls for them before boot
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = function (ctx) {
  const { root, path, readJSON, esc } = ctx;
  const landscape = readJSON(path.join(root, 'data', 'landscape.json'), []), thresholds = readJSON(path.join(root, 'data', 'control-thresholds.json'), []);
  const L = new Map(landscape.map((c) => [c.id, c])), T = new Map(thresholds.map((t) => [t.id, t]));
  const bad = [], need = (text, hay, what) => { if (!String(hay || '').includes(text)) bad.push(`${what}: "${text}" is not in its record`); };
  const chips = [];
  Object.keys(CHIPS).forEach((id) => {
    const c = L.get(id); if (!c) { bad.push(`${id}: no such chip in data/landscape.json`); return; }
    const [tpp, tppT, c2c, c2cT, note] = CHIPS[id], es = c.exportStatus || '', ic = (c.interconnect || {}).chipToChip || '';
    need(tppT, es, `${id} TPP`); need(note, es, `${id} note`);
    if (Array.isArray(c2c)) c2c.forEach((v) => need(`${v} GB/s`, ic, `${id} chip-to-chip`));
    else if (c2c != null) need(c2c.toLocaleString('en-US'), ic, `${id} chip-to-chip`);
    (ERA_NOTES[id] || []).forEach((n) => { if (n) need(n, es, `${id} rule note`); });
    const bw = (c.memory || {}).bandwidthTBs;
    if (typeof bw !== 'number') { bad.push(`${id}: its record gives no memory bandwidth`); return; }
    chips.push({ id, name: SHORT[id], full: c.name, vendor: c.vendor, announced: String(c.announced), tpp, tppT, bw: Math.round(bw * 1000 * 1000) / 1000, bwT: `${bw} TB/s`, c2c, c2cT,
      merchant: MERCHANT.includes(id), note, eraNotes: ERA_NOTES[id] || null });
  });
  LINES.forEach(([id, v]) => { const t = T.get(id); if (!t || t.value !== v) bad.push(`control line ${id}: data/control-thresholds.json gives ${t ? t.value : 'nothing'}, the chart draws ${v}`); });
  need('1600', (T.get('3a090a-tpp') || {}).alternative, 'the 1,600 density floor');
  if (bad.length) throw new Error('chips under the line: ' + bad.join('; '));

  // the Table and the CSV: one row per chip, as its record prints it
  const head = ['Chip', 'Announced', 'TPP', 'Chip-to-chip bandwidth', 'Memory bandwidth'];
  const annT = (a) => { const p = String(a).split('-'); return p[1] ? `${MONTHS[+p[1] - 1]} ${p[0]}` : p[0]; };
  const rows = chips.map((c) => [`${c.vendor} ${c.full}`, annT(c.announced), c.tppT, c.c2cT, c.bwT]);
  const page = SITE.url + '#/controls';
  const q = (v) => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const about = [['Title', TITLE], ['Source', SOURCES.map((s) => s[0]).join('; ') + '; each chip\'s record on AI Chips'], ['Figure address', page]];
  const csv = 'data:text/csv;charset=utf-8,' + encodeURIComponent('﻿' + [head].concat(rows, [[]], about).map((r) => r.map(q).join(',')).join('\r\n') + '\r\n');
  const table = `<table class="sr-only fig-table"><caption>${esc(TITLE)}</caption><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>`
    + rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
  const ext = (s) => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`;
  const steps = ERAS.map((e, i) => `<li><button type="button" data-era="${i}"${i === 0 ? ' aria-current="step"' : ''}><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(e.key)}</button></li>`).join('');
  // the ruler under the chart: a tick at each rule change (the buttons above name them) and the years
  const ticks = ERAS.map((e) => `<i class="ul-stop" style="left:${(e.at / LAST * 100).toFixed(2)}%"></i>`).join('')
    + [[3, '2023'], [15, '2024'], [27, '2025'], [39, '2026']].map((y) => `<span style="left:${(y[0] / LAST * 100).toFixed(2)}%">${y[1]}</span>`).join('');
  const cite = `<div class="ch-cite-box fig-cite-box" id="controls-ul-cite" role="region" aria-label="Citation for the figure" hidden><p class="ch-cite-text">Sharma, Yashvardhan. “${esc(TITLE)}.” <i>Chip Supply Chain: How AI Chips Are Made</i>. Updated ${esc(ctx.builtStr)}. <a href="${esc(page)}">${esc(page)}</a>. Data: each chip's record on AI Chips, and the US rules of October 2022 to January 2026.</p></div>`;
  const json = JSON.stringify({ chips, eras: ERAS, last: LAST }).replace(/</g, '\\u003c');
  const html = `<section class="ul" id="controls-under-the-line" aria-labelledby="controls-ul-h">
      <h2 class="cf-up-h" id="controls-ul-h">Chips built just under the line</h2>
      <div class="ul-grid"><figure class="figure ul-fig" id="${FID}">
        <div class="fig-head"><p class="fig-title fig-find">${esc(FINDING)}</p><p class="fig-sub">${esc(TITLE)}</p></div>
        <div class="fig-body"><ol class="anim-steps ul-steps" aria-label="Rule changes">${steps}</ol>
          <p class="ul-when" aria-live="polite"><b>${esc(annT('2023-09'))}</b> · in force: ${esc(ERAS[0].rule)}</p><div class="ul-plot"></div>
          <div class="ul-scrub"><input type="range" min="0" max="${LAST}" step="1" value="${ERAS[0].end}" aria-label="Date"><div class="ul-ticks" aria-hidden="true">${ticks}</div></div>
          <p class="ul-cap" aria-live="polite">${esc(ERAS[0].cap)}</p>${table}</div>
        <div class="fig-strip"><span class="fs-src"><span class="fs-k">Source:</span> ${SOURCES.map(ext).join(', ')}, and each chip's record on <a href="#/landscape">AI Chips</a></span><span class="fs-acts" data-kind="scatter"><button type="button" class="ch-cite-btn" aria-expanded="false" aria-controls="controls-ul-cite">Cite</button><a class="fs-csv" href="${csv}" download="chip-supply-chain-chips-under-the-line.csv">CSV</a></span>${cite}</div>
      </figure><aside class="ul-side" aria-live="polite"></aside></div>
      <script type="application/json" id="controls-ul-data">${json}</script>
      </section>`;
  return { UNDER_LINE: html };
};
