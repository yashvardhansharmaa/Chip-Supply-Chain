// Second pass over the links the first pass could not settle: a polite user agent (the SEC requires a contact), a longer wait, GET straight away.
const fs = require('fs');
const prev = JSON.parse(fs.readFileSync('qa/link-check.json', 'utf8'));
const todo = [...new Set(prev.deadList.concat(prev.blockedList).map((r) => r.url.replace(/\\+$/, '')))];
const UA = 'Compute Chokepoints link check (yashvardhan@uni.minerva.edu)';
const results = []; let i = 0;
async function probe(u) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 45000);
  try { const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA, accept: 'text/html,application/pdf,*/*', 'accept-language': 'en' } }); return { url: u, status: r.status, final: r.url !== u ? r.url : undefined }; }
  catch (e) { return { url: u, status: 0, error: String((e.cause && e.cause.code) || e.name || e.message).slice(0, 60) }; }
  finally { clearTimeout(t); }
}
async function worker() { while (i < todo.length) { const u = todo[i++]; results.push(await probe(u)); } }
(async () => {
  await Promise.all(Array.from({ length: 6 }, worker));
  const dead = results.filter((r) => r.status === 404 || r.status === 410), unreachable = results.filter((r) => r.status === 0), blocked = results.filter((r) => [401, 403, 429, 503].includes(r.status)), ok = results.filter((r) => r.status >= 200 && r.status < 400);
  fs.writeFileSync('qa/link-recheck.json', JSON.stringify({ rechecked: results.length, ok: ok.length, blocked: blocked.length, dead: dead.length, unreachable: unreachable.length, deadList: dead, unreachableList: unreachable, blockedList: blocked }, null, 2));
  console.log(`rechecked ${results.length}: ok ${ok.length}, still blocked ${blocked.length}, dead (404/410) ${dead.length}, unreachable from Node ${unreachable.length}`);
  dead.forEach((r) => console.log('DEAD', r.status, r.url)); unreachable.forEach((r) => console.log('UNREACHABLE', r.error, r.url)); blocked.forEach((r) => console.log('BLOCKED', r.status, r.url));
})();
