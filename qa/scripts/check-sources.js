#!/usr/bin/env node
/* Fails (exit 1) when anything the site cites comes from a disallowed (tier C or D) or unclassified source.
 * Scans every [source](url) in content/*.md, every "source"/"url" value in each chapter's front matter, and every
 * "source"/"url"/"sources" value in data/*.json. A domain is classified in data/source-tiers.json; an archived page
 * (web.archive.org/web/<stamp>/<original>) is rated by its original publisher, as in build/build.js.
 * Run by the deploy workflow after the build, so a citation to a stock-analysis site, aggregator or other
 * non-qualifying source can never go live by accident. usage: node qa/scripts/check-sources.js */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const tiers = JSON.parse(fs.readFileSync(path.join(root, 'data', 'source-tiers.json'), 'utf8'));
const host = (url) => {
  const m = String(url).match(/^https?:\/\/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/);
  try { return new URL(m ? m[1] : url).hostname.replace(/^www\./, ''); } catch (e) { return String(url); }
};
const tierOf = (url) => {
  const h = host(url);
  for (const t of ['A', 'B', 'C', 'D']) if ((tiers[t] || []).some((d) => h === d || h.endsWith('.' + d))) return t;
  return '?';
};

const found = []; // [file, url]
const walk = (v, file, key) => {
  if (Array.isArray(v)) v.forEach((x) => walk(x, file, key));
  else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k], file, k));
  else if (typeof v === 'string' && /^(source|sources|url)$/i.test(key || '') && /^https?:\/\//.test(v)) found.push([file, v]);
};

for (const f of fs.readdirSync(path.join(root, 'content')).filter((x) => x.endsWith('.md'))) {
  const s = fs.readFileSync(path.join(root, 'content', f), 'utf8');
  for (const m of s.matchAll(/\[source\]\((https?:\/\/[^)\s]+)\)/g)) found.push([`content/${f}`, m[1]]);
  const a = s.indexOf('---json\n'), b = a >= 0 ? s.indexOf('\n---', a + 8) : -1;
  if (a >= 0 && b > a) { try { walk(JSON.parse(s.slice(a + 8, b)), `content/${f}`); } catch (e) { console.error(`front matter of ${f} is not valid JSON`); process.exitCode = 1; } }
}
const SKIP = new Set(['source-tiers.json', 'bibliography.json']); // the tier list itself, and the harvested title cache
for (const f of fs.readdirSync(path.join(root, 'data')).filter((x) => x.endsWith('.json') && !SKIP.has(x))) {
  walk(JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8')), `data/${f}`);
}

const bad = found.map(([file, url]) => ({ file, url, tier: tierOf(url) })).filter((x) => x.tier !== 'A' && x.tier !== 'B');
if (bad.length) {
  console.error(`check-sources: ${bad.length} citation(s) from disallowed or unclassified sources:`);
  bad.forEach((x) => console.error(`  [${x.tier === '?' ? 'unclassified' : 'tier ' + x.tier}] ${x.file}  ${x.url}`));
  console.error('Classify a new official source in data/source-tiers.json (tier A or B), or replace the citation.');
  process.exit(1);
}
console.log(`check-sources: ${found.length} citations, all tier A or B`);
