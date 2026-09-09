#!/usr/bin/env node
/* Lists every URL in data/ whose host is not Tier A or B in data/source-tiers.json. Exit 1 if any. */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const tiers = JSON.parse(fs.readFileSync(path.join(root, 'data', 'source-tiers.json'), 'utf8'));
const allowed = new Set([...(tiers.A || []), ...(tiers.B || [])]);
const ok = (host) => { host = host.replace(/^www\./, ''); return allowed.has(host) || [...allowed].some((d) => host.endsWith('.' + d)); };
let bad = 0;
for (const f of fs.readdirSync(path.join(root, 'data'))) {
  if (!/\.(json|md)$/.test(f) || f === 'source-tiers.json') continue;
  const text = fs.readFileSync(path.join(root, 'data', f), 'utf8');
  const urls = [...new Set(text.match(/https?:\/\/[^\s"')<>\]]+/g) || [])];
  const dis = urls.filter((u) => { try { return !ok(new URL(u).host); } catch (e) { return true; } });
  console.log(`${f}: ${urls.length} urls, ${dis.length} disallowed`);
  dis.forEach((u) => console.log('   ' + u));
  bad += dis.length;
}
process.exit(bad ? 1 : 0);
