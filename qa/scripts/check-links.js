// Release check: every external URL in dist/index.html and data/*.json answers. node qa/scripts/check-links.js [--limit N]
const fs = require('fs'), path = require('path');
const html = fs.readFileSync('dist/index.html', 'utf8');
const urls = new Set();
(html.match(/https?:\/\/[^\s"'<>)\]]+/g) || []).forEach((u) => urls.add(u.replace(/[.,;:]+$/, '').replace(/&amp;/g, '&')));
fs.readdirSync('data').filter((f) => f.endsWith('.json')).forEach((f) => { const s = fs.readFileSync(path.join('data', f), 'utf8'); (s.match(/https?:\/\/[^\s"'<>)\]\\]+/g) || []).forEach((u) => urls.add(u.replace(/[.,;:]+$/, ''))); });
const list = [...urls].filter((u) => !/localhost|127\.0\.0\.1|fonts\.gstatic|fonts\.googleapis|yashvardhansharmaa\.github\.io/.test(u));
const limit = +((process.argv.find((a) => a.startsWith('--limit=')) || '').split('=')[1] || 0);
const todo = limit ? list.slice(0, limit) : list;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 compute-chokepoints-linkcheck';
const results = []; let i = 0;
async function probe(u) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
  try {
    let r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA, accept: '*/*' } });
    if (r.status === 405 || r.status === 403 || r.status === 404 || r.status >= 500) r = await fetch(u, { method: 'GET', redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA, accept: 'text/html,application/pdf,*/*' } });
    return { url: u, status: r.status, final: r.url !== u ? r.url : undefined };
  } catch (e) { return { url: u, status: 0, error: String(e.cause && e.cause.code || e.name || e.message).slice(0, 60) }; }
  finally { clearTimeout(t); }
}
async function worker() { while (i < todo.length) { const u = todo[i++]; results.push(await probe(u)); if (results.length % 50 === 0) process.stderr.write(results.length + '/' + todo.length + '\n'); } }
(async () => {
  await Promise.all(Array.from({ length: 8 }, worker));
  const dead = results.filter((r) => r.status === 0 || r.status === 404 || r.status === 410);
  const blocked = results.filter((r) => [401, 403, 429, 503, 999].includes(r.status));
  const ok = results.filter((r) => r.status >= 200 && r.status < 400);
  fs.writeFileSync('qa/link-check.json', JSON.stringify({ checked: results.length, ok: ok.length, blocked: blocked.length, dead: dead.length, deadList: dead, blockedList: blocked, when: new Date().toISOString() }, null, 2));
  console.log(`checked ${results.length}: ok ${ok.length}, blocked/bot-walled ${blocked.length}, dead ${dead.length}`);
  dead.forEach((r) => console.log('DEAD', r.status || r.error, r.url));
  blocked.forEach((r) => console.log('BLOCKED', r.status, r.url));
})();
