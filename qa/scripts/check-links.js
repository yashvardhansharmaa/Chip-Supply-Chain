// Release check: every external URL in dist/index.html and data/*.json answers. node qa/scripts/check-links.js [--limit N]
// --local <base> (28 Oct 2026) checks the site's own links instead, against a local preview (http://127.0.0.1:8779), and
// fetches nothing else: every page the site has (the home page, each chapter's page, the reference pages, the summary, the
// book and the forwarding pages), every link, script, sheet, picture and video address on them, the two files the app
// fetches when it needs them (CP_ASSETS), and each fragment, which must name an id on the page it points to (a route,
// #/<view>, on the home page). Exits 1 on a link to nothing.
const fs = require('fs'), path = require('path');
const LOCAL = (() => { const i = process.argv.indexOf('--local'); return i > 0 ? String(process.argv[i + 1] || '').replace(/\/$/, '') : ''; })();
if (LOCAL) {
  if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(LOCAL)) { console.error('check-links --local takes a local preview, such as http://127.0.0.1:8779'); process.exit(1); }
  const dist = path.join(__dirname, '..', '..', 'dist');
  const pages = ['/'].concat(fs.readdirSync(dist).filter((d) => fs.existsSync(path.join(dist, d, 'index.html'))).map((d) => '/' + d + '/'));
  const got = new Map(); // url -> { status, html }
  const get = async (u) => {
    if (got.has(u)) return got.get(u);
    let r; try { const res = await fetch(u, { redirect: 'manual' }); r = { status: res.status, html: /text\/html/.test(res.headers.get('content-type') || '') ? await res.text() : '' }; if (!r.html) await res.arrayBuffer().catch(() => null); } catch (e) { r = { status: 0, html: '' }; }
    got.set(u, r); return r;
  };
  const ids = (h) => new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')));
  (async () => {
    const bad = [], links = new Map(); // target -> the pages linking it
    for (const pg of pages) {
      const r = await get(LOCAL + pg);
      if (r.status !== 200) { bad.push(`${pg}: the page answers ${r.status}`); continue; }
      const markup = r.html.replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2');
      const add = (v) => { if (!v || /^(#$|[a-z][a-z0-9+.-]*:)/i.test(v)) return; const t = new URL(v.replace(/&amp;/g, '&'), LOCAL + pg).href; if (!t.startsWith(LOCAL + '/')) return; if (!links.has(t)) links.set(t, new Set()); links.get(t).add(pg); };
      for (const m of markup.matchAll(/<(\w+)\b[^>]*>/g)) {
        for (const a of m[0].matchAll(/\s(href|src|data-src|poster)="([^"]*)"/g)) {
          // an animation's data-src is the stem of its files: the app plays <stem>-<theme>.mp4 with its posters (src/app.js Anim)
          if (m[1] === 'video' && a[1] === 'data-src') ['light', 'dark'].forEach((t) => ['.mp4', '-start.jpg', '-end.jpg'].forEach((x) => add(a[2] + '-' + t + x)));
          else add(a[2]);
        }
      }
      const lazy = /window\.CP_ASSETS = (\{[^<]*?\});/.exec(r.html); if (lazy) Object.values(JSON.parse(lazy[1])).forEach(add);
    }
    for (const [t, from] of links) {
      const u = new URL(t), base = u.origin + u.pathname + u.search, frag = decodeURIComponent(u.hash.slice(1));
      const r = await get(base), where = [...from].slice(0, 3).join(', ');
      if (r.status !== 200) { bad.push(`${u.pathname}${u.search} answers ${r.status} (linked from ${where})`); continue; }
      if (!frag || !r.html) continue;
      // a route belongs to the home page; the book serves The Chain's own (#/chain), its contents
      if (frag.startsWith('/')) { if (u.pathname !== '/' && !(u.pathname === '/book/' && /^\/(chain|stack)$/.test(frag))) bad.push(`#${frag} is a route on ${u.pathname}, which has none (linked from ${where})`); continue; }
      if (!ids(r.html).has(frag) && !(u.pathname === '/' && /^(gl|lk)-/.test(frag))) bad.push(`${u.pathname}#${frag}: no such id (linked from ${where})`); // the Glossary's entries come with glossary.js
    }
    console.log(`check-links --local: ${pages.length} pages, ${links.size} addresses, ${got.size} fetched from ${LOCAL}`);
    bad.forEach((b) => console.log('BROKEN ' + b));
    if (bad.length) { console.error(`check-links --local: ${bad.length} broken`); process.exit(1); }
    console.log('check-links --local: no broken links');
  })();
  return;
}
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
