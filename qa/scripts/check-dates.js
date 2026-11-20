#!/usr/bin/env node
// Release check: nothing on the site still treats a passed date as pending. node qa/scripts/check-dates.js [--today YYYY-MM-DD]
// It reads data/control-flows.json ("upcoming": every row must be in the future) and the chapters' own words: a sentence that says
// a measure runs "until <date>", "through <date>", "ends on <date>", "expires on <date>" or "due <date>" with a date now past is
// listed for a person to source what happened. It only flags; it never rewrites. Exit 1 when anything is listed (20 Nov 2026).
'use strict';
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..');
const i = process.argv.indexOf('--today');
const today = i > 0 ? process.argv[i + 1] : new Date().toISOString().slice(0, 10);
const M = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
const iso = (d, m, y) => `${y}-${String(M[m.toLowerCase()]).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const found = [];
const flows = JSON.parse(fs.readFileSync(path.join(root, 'data', 'control-flows.json'), 'utf8'));
for (const u of flows.upcoming || []) if (u.date < today) found.push(`data/control-flows.json upcoming: ${u.date} has passed: "${u.label}"`);
// Export Controls' "Next date" row (build/latest-rule.js) on both doors, as built: the date it shows as next must not have passed
// (its page hides it in the reader's browser once it has, and the next build moves on to the date after it; 21 Nov 2026)
for (const rel of ['dist/export-controls/index.html', 'dist/index.html']) {
  const p = path.join(root, rel); if (!fs.existsSync(p)) continue;
  for (const m of fs.readFileSync(p, 'utf8').matchAll(/data-due="(\d{4}-\d{2}-\d{2})"/g)) if (m[1] < today) found.push(`${rel}: the "Next date" row shows ${m[1]}, which has passed: rebuild the site`);
}
const RE = /\b(until|through|ends? on|ended on|expires? on|lapses? on|due(?: to end)?(?: on)?|suspended (?:it |them )?(?:until|through))\s+(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December)(?: (\d{4}))?/gi;
for (const f of fs.readdirSync(path.join(root, 'content')).filter((n) => n.endsWith('.md'))) {
  fs.readFileSync(path.join(root, 'content', f), 'utf8').split('\n').forEach((line, n) => {
    let m; RE.lastIndex = 0;
    while ((m = RE.exec(line))) {
      if (!m[4]) continue; // a date with no year cannot be judged
      const d = iso(m[2], m[3], m[4]);
      if (d < today && d >= '2026-01-01') { // older history is told in the past tense already
        const at = Math.max(0, m.index - 110);
        found.push(`content/${f}:${n + 1}: ${d} has passed: "…${line.slice(at, m.index + m[0].length + 40).replace(/\(\[source\]\([^)]*\)\)/g, '').trim()}…"`);
      }
    }
  });
}
if (found.length) { console.log(found.join('\n')); console.log(`check-dates: ${found.length} passed date${found.length > 1 ? 's' : ''} still read as pending (today ${today})`); process.exit(1); }
console.log(`check-dates: no passed date reads as pending (today ${today})`);
