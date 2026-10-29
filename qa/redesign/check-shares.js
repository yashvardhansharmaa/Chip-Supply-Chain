#!/usr/bin/env node
/* Every country share the Suppliers ribbons print, checked against data/chokepoint-matrix.json as the file writes it (the
   figures build of 29 Oct 2026, ported from the mockup's check, MAIN/qa/excellence/mocks/figures/check-shares.js).
   The matrix is read here as raw text, so 6.0 stays 6.0, independently of build/modules/supplier-shares.js. The page is
   opened wide and as a phone, and every place a share is printed is read back:
   - wide: the Table, each segment's aria-label, the shares printed at the left when a segment is hovered, each ribbon's
     tip, and the shares printed at the segments when each of the 11 countries is followed;
   - phone: the strip labels, the line under each strip and the screen-reader line.
   Each must be the raw text plus "%", and each place that carries every share must carry all of them (the phone's strip and
   the line under it together). The phone strip writes the United Kingdom as UK.
   usage: node qa/redesign/check-shares.js [base] (default http://127.0.0.1:8788). Exits 1 on any mismatch. */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open } = require('./cdp.js');
const root = path.resolve(__dirname, '..', '..');
const BASE = (process.argv[2] || 'http://127.0.0.1:8788').replace(/\/$/, '');
const URL = BASE + '/#/suppliers';

// the raw shares, in file order: each row's "shares" object, or null
const text = fs.readFileSync(path.join(root, 'data', 'chokepoint-matrix.json'), 'utf8');
const RAW = [...text.matchAll(/"shares":\s*(\{[^}]*\}|null)/g)].map((m) => (m[1] === 'null' ? null : Object.fromEntries([...m[1].matchAll(/"([A-Za-z-]+)":\s*(-?\d+(?:\.\d+)?)/g)].map((x) => [x[1], x[2]]))));
const NAME = { US: 'United States', JP: 'Japan', CN: 'China', TW: 'Taiwan', KR: 'South Korea', NL: 'Netherlands', DE: 'Germany', GB: 'United Kingdom', IL: 'Israel', 'EU-other': 'Other EU', Other: 'Other' };
const CODE = { US: 'US', JP: 'JP', CN: 'CN', TW: 'TW', KR: 'KR', NL: 'NL', DE: 'DE', GB: 'UK', IL: 'IL', 'EU-other': 'Other EU', Other: 'Other' };
const BYNAME = Object.fromEntries(Object.entries(NAME).map(([c, n]) => [n, c]));
const BYCODE = Object.fromEntries(Object.entries(CODE).map(([c, n]) => [n, c]));
const NUM = '(\\d+(?:\\.\\d+)?)%';

// gathered in the page: [where, row index, country or label, printed text]
const WIDE = `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let k = 0; k < 75 && !document.querySelector('#sup-pipe .ss-hit'); k++) await wait(200);
  const out = [], sec = document.getElementById('sup-pipe');
  if (!sec || !sec.querySelector('.ss-hit')) return null;
  [...sec.querySelectorAll('.ss-table tbody tr')].forEach((tr, i) => tr.querySelectorAll('.ss-tc').forEach((s) => out.push(['table', i, s.getAttribute('data-c'), s.textContent])));
  sec.querySelectorAll('.ss-hit').forEach((h) => out.push(['aria', +h.getAttribute('data-i'), '', h.getAttribute('aria-label')]));
  // a segment hovered: the shares at the left, matched to the country by height
  for (const h of sec.querySelectorAll('.ss-hit')) {
    h.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const labs = [...sec.querySelectorAll('.ss-clab')].map((t) => [t.getAttribute('data-c'), +t.getAttribute('y')]);
    sec.querySelectorAll('.ss-hotv text').forEach((t) => { const y = +t.getAttribute('y'); const c = labs.reduce((a, b) => Math.abs(b[1] - y) < Math.abs(a[1] - y) ? b : a)[0]; out.push(['left', +h.getAttribute('data-i'), c, t.textContent]); });
  }
  for (const p of sec.querySelectorAll('.sup-rib')) {
    p.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: 500, clientY: 400 }));
    out.push(['tip', +p.getAttribute('data-i'), p.getAttribute('data-c'), sec.querySelector('.ss-tip-big').textContent]);
  }
  // each country followed: its share at every segment it reaches, matched to the segment by height
  for (const b of sec.querySelectorAll('.sup-chip')) {
    b.click();
    const c = b.getAttribute('data-c'), rows = [...sec.querySelectorAll('.ss-hit')].map((h) => [+h.getAttribute('data-i'), +h.getAttribute('y'), +h.getAttribute('height')]);
    sec.querySelectorAll('.ss-endv text').forEach((t) => { const y = +t.getAttribute('y'); const r = rows.find((q) => y >= q[1] && y <= q[1] + q[2] + 4); out.push(['followed', r ? r[0] : -1, c, t.textContent]); });
    b.click();
  }
  return out;
})()`;
const PHONE = `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let k = 0; k < 75 && !document.querySelector('#sup-pipe .ss-row'); k++) await wait(200);
  if (!document.querySelector('#sup-pipe .ss-row')) return null;
  const out = [];
  document.querySelectorAll('#sup-pipe .ss-row').forEach((li, i) => {
    li.querySelectorAll('.ss-sl').forEach((s) => { const b = s.querySelector('b'); if (b) out.push(['strip', i, s.getAttribute('data-c'), b.textContent]); });
    li.querySelectorAll('.ss-rest span').forEach((s) => out.push(['under strip', i, s.getAttribute('data-c'), s.textContent]));
    const sr = li.querySelector('p.ss-sr'); if (sr) out.push(['phone reader', i, '', sr.textContent]);
  });
  return out;
})()`;

(async () => {
  const chrome = launch(), got = [];
  try {
    // a headless first load is sometimes slow to boot the page, so each view gets three tries
    for (const [width, js] of [[1440, WIDE], [390, PHONE]]) {
      let res = null;
      for (let k = 0; k < 3 && !res; k++) {
        const t = await open(chrome, URL, { width, wait: 3000 });
        res = await t.ev(js).catch(() => null);
        if (t.errors.length) { console.log('page errors at ' + width + ': ' + t.errors.join(' | ')); process.exitCode = 1; }
        await t.close();
      }
      if (!res) { console.log('the ribbons did not draw at ' + width); process.exit(1); }
      got.push(...res);
    }
  } finally { await chrome.close(); }
  const bad = [], seen = {};
  const check = (where, i, c, printed) => {
    const want = RAW[i] && RAW[i][c];
    if (want == null) bad.push(`${where}: row ${i} prints ${printed} for ${c}, which has no share`);
    else if (printed !== want + '%') bad.push(`${where}: row ${i} ${c} prints "${printed}", the matrix writes ${want}`);
    (seen[where] = seen[where] || new Set()).add(i + ' ' + c);
  };
  for (const [where, i, c, s] of got) {
    if (where === 'aria' || where === 'phone reader') { // "United States 74%, Germany 13%, ..."
      [...s.matchAll(new RegExp('(' + Object.values(NAME).join('|') + ') ' + NUM, 'g'))].forEach((m) => check(where, i, BYNAME[m[1]], m[2] + '%'));
    } else if (where === 'strip' || where === 'under strip' || where === 'table') { // "UK 48%" on the strip, "Germany 13%" elsewhere
      const m = new RegExp('^(.+?)[\\s\\u00a0]' + NUM + '$').exec(s), by = where === 'strip' ? BYCODE : BYNAME;
      if (!m || by[m[1]] !== c) bad.push(`${where}: row ${i} label "${s}" does not name ${c}`); else check(where, i, c, m[2] + '%');
    } else check(where, i, c, s);
  }
  const all = RAW.flatMap((r, i) => (r ? Object.keys(r).map((c) => i + ' ' + c) : []));
  for (const where of ['table', 'aria', 'left', 'tip', 'followed', 'phone reader']) {
    const miss = all.filter((k) => !(seen[where] && seen[where].has(k)));
    if (miss.length) bad.push(`${where}: missing ${miss.join(', ')}`);
  }
  const phoneMiss = all.filter((k) => !(seen.strip && seen.strip.has(k)) && !(seen['under strip'] && seen['under strip'].has(k)));
  if (phoneMiss.length) bad.push('phone strip: missing ' + phoneMiss.join(', '));
  console.log(`${all.length} shares in ${RAW.filter(Boolean).length} segments; ${got.length} printed values read back from ${Object.keys(seen).length} places.`);
  if (bad.length) { console.log(bad.join('\n')); process.exit(1); }
  console.log('every printed share matches the matrix as written');
  process.exit(process.exitCode || 0);
})();
