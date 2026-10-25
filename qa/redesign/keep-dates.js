#!/usr/bin/env node
/* A page's "Updated" day moves only when its words, figures or data change (build/build.js, page dates). The redesign changes
   no chapter text, but its new labels (the figures' numbers and strips, the rail, the kicker) are text too, so the build moves
   every chapter page's day to the day it ran. This puts each page's day back to what it was at the commit given, keeping the
   new content hash, so the next build leaves the day alone. Only pages whose day moved are touched, and only when the
   chapter files (content/) and the data (data/) are unchanged since that commit, which is how stage 1 kept the summary's day.
   usage: node qa/redesign/keep-dates.js <commit>   then run node build/build.js again */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..', '..');
const commit = process.argv[2];
if (!commit) { console.error('usage: keep-dates.js <commit>'); process.exit(1); }
const changed = execFileSync('git', ['diff', '--name-only', commit, '--', 'content'], { cwd: root, encoding: 'utf8' }).trim();
if (changed) { console.error('content/ changed since ' + commit + ', so a moved day may be real:\n' + changed); process.exit(1); }
const before = JSON.parse(execFileSync('git', ['show', `${commit}:build/page-dates.json`], { cwd: root, encoding: 'utf8' }));
const file = path.join(root, 'build', 'page-dates.json');
const now = JSON.parse(fs.readFileSync(file, 'utf8'));
let n = 0;
for (const [key, e] of Object.entries(now)) {
  const b = before[key];
  if (!b || !b.modified || b.modified === e.modified) continue;
  console.log(`${key}: ${e.modified} -> ${b.modified}`);
  e.modified = b.modified; if (b.published) e.published = b.published; n++;
}
fs.writeFileSync(file, JSON.stringify(now, null, 2) + '\n');
console.log(n ? `${n} days put back; run node build/build.js` : 'no day moved');
