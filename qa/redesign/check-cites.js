#!/usr/bin/env node
/* Stage 3: the citation marks run in reading order, and each points at its own source. For every chapter on its own page
   (dist/<chapter>/, the full chapter since 28 Oct 2026) and in the book (dist/book/, which prints them all), a mark's number must name the source in the chapter's list
   whose address the mark links to, and the first sight of each number must come in order (1, then 2, then 3): In plain terms,
   In short and the lead first, then the card, which stands in the text before section 01 (the column, 27 Oct 2026).
   usage: node qa/redesign/check-cites.js [dist] */
'use strict';
const fs = require('fs'), path = require('path');
const dist = process.argv[2] || path.join(__dirname, '..', '..', 'dist');
const dec = (s) => s.replace(/&amp;/g, '&');
let bad = 0, n = 0, out = [];
const check = (where, body, src) => {
  const marks = [...body.matchAll(/<sup class="cite"><a href="([^"]*)"[^>]*>(?:<span class="br">\[<\/span>)?(\d+)/g)].map((m) => [dec(m[1]), +m[2]]);
  let seen = 0, order = true;
  marks.forEach(([u, k]) => { n++; if (src[k - 1] !== u) { bad++; out.push(`MISMATCH ${where}: mark ${k} links ${u.slice(0, 70)}`); } if (k > seen + 1) order = false; if (k > seen) seen = k; });
  if (!order) { bad++; out.push(`ORDER ${where}: a number first appears before a lower one`); }
  out.push(`${where.padEnd(44)} ${String(marks.length).padStart(4)} marks, ${String(src.length).padStart(3)} sources, first ${marks.slice(0, 6).map((m) => m[1]).join(',')}`);
};
// each chapter, as the page holds it: its article, its marks before the source list, and the list
const chaptersOf = (html, where) => html.split(/<article class="chapter[^"]*"[^>]*id="/).slice(1).forEach((p) => {
  const id = p.slice(0, p.indexOf('"')), si = p.indexOf('class="chapter-sources"'); if (si < 0) return;
  const src = [...p.slice(si, p.indexOf('</details>', si)).matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => { const a = /href="([^"]+)"/.exec(m[1]); return a ? dec(a[1]) : ''; });
  check(where(id), p.slice(0, si), src);
});
// each chapter's page, which holds that chapter alone
let pages = 0;
fs.readdirSync(dist).filter((d) => d !== 'book').forEach((d) => {
  const f = path.join(dist, d, 'index.html'); if (!fs.existsSync(f)) return;
  const h = fs.readFileSync(f, 'utf8'); if (!/<article class="chapter[^"]*"[^>]*id="/.test(h)) return;
  pages++; chaptersOf(h, () => '/' + d + '/');
});
// the book
if (fs.existsSync(path.join(dist, 'book', 'index.html'))) chaptersOf(fs.readFileSync(path.join(dist, 'book', 'index.html'), 'utf8'), (id) => 'the book #' + id);
if (pages < 16) { bad++; out.push(`only ${pages} chapter pages in ${dist}`); }
console.log(out.join('\n'));
console.log(`\n${n} marks checked, ${bad} problems`);
process.exit(bad ? 1 : 0);
