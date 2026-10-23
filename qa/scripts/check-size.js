#!/usr/bin/env node
/* Size guard (PLAN item 13): fails (exit 1) when a file over 5 MB is in git outside dist/ and media/, the only folders
 * whose large files the site serves (the PDFs, the animation videos). Screenshots, renders, films and caches stay on this
 * Mac; .gitignore keeps most of them out, and this catches the rest. Git never forgets a committed file, so the check runs
 * before a push can carry one.
 *   node qa/scripts/check-size.js            every file git tracks (the deploy workflow runs this)
 *   node qa/scripts/check-size.js --staged   only the files staged for the next commit (.githooks/pre-commit runs this) */
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');

const LIMIT = 5 * 1024 * 1024;
const SERVED = /^(dist|media)\//;
// large files that were committed before this guard and are accepted, each with its reason
const ALLOWED = {
  'qa/crit/gfx-fig-litho-375.png': 'a QA screenshot from 10 Sept 2026, untracked on 21 Oct 2026 (git rm --cached); listed only until that commit lands',
};
const root = path.resolve(__dirname, '..', '..');
const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const staged = process.argv.includes('--staged');

const files = (staged ? git(['diff', '--cached', '--name-only', '--diff-filter=AM', '-z']) : git(['ls-files', '-z'])).split('\0').filter(Boolean);
// each file's blob in the index, which is the staged copy when one is staged (what a commit would store)
const blobs = {};
git(['ls-files', '-s', '-z']).split('\0').filter(Boolean).forEach((line) => { const m = /^\d+ ([0-9a-f]+) \d\t(.+)$/s.exec(line); if (m) blobs[m[2]] = m[1]; });
const big = [];
const want = files.filter((f) => !SERVED.test(f) && blobs[f]);
// the sizes, in one git call
const out = want.length ? execFileSync('git', ['cat-file', '--batch-check=%(objectsize)'], { cwd: root, encoding: 'utf8', input: want.map((f) => blobs[f]).join('\n') + '\n', maxBuffer: 64 * 1024 * 1024 }).trim().split('\n') : [];
want.forEach((f, i) => { const n = +out[i]; if (n > LIMIT) big.push([f, n]); });
const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';
const allowed = big.filter(([f]) => ALLOWED[f]), bad = big.filter(([f]) => !ALLOWED[f]);
allowed.forEach(([f, n]) => console.log(`allowed: ${f} (${mb(n)}). Reason: ${ALLOWED[f]}`));
if (bad.length) {
  console.error(`check-size: ${bad.length} file${bad.length === 1 ? '' : 's'} over ${mb(LIMIT)} outside dist/ and media/:`);
  bad.forEach(([f, n]) => console.error(`  ${f}  ${mb(n)}`));
  console.error(staged ? 'Unstage it (git restore --staged <file>) and keep it on this Mac.' : 'Remove it from git with git rm --cached <file> (the file stays on disk), add its folder to .gitignore, and commit.');
  process.exit(1);
}
console.log(`check-size: ${want.length} ${staged ? 'staged ' : ''}files outside dist/ and media/, none over ${mb(LIMIT)}`);
