#!/usr/bin/env node
/* Smoke tour of the built site in headless Chrome (PLAN item 11). It serves dist/ on 127.0.0.1 itself, opens each route
 * at 320, 390 and 1440 pixels wide, and fails (exit 1) on:
 *   - any console error, uncaught exception, "module ... failed" or "specimen ... failed" warning, or a request to the
 *     local server that finds nothing (404), on every route;
 *   - a page that scrolls sideways at 320 or 390 (document wider than the screen);
 *   - a route that is missing its key part (17 chapters on The Chain, a row per flow on the board, and so on);
 *   - a page that follows the device's dark setting: with prefers-color-scheme: dark and no saved choice, the main page,
 *     a chapter page and the summary must keep the light ground; with ?theme=dark they must turn dark.
 * Nothing leaves this machine: Chrome resolves every host other than 127.0.0.1 to nothing, so the fonts and the counter
 * fail quietly, and those failures are ignored. No packages: Chrome is driven over its DevTools pipe.
 *
 * usage: node qa/scripts/smoke.js [--dist dist] [--port 10361] [--only walk,chain] [--widths 320,390,1440] [--verbose]
 *        CHROME=/path/to/chrome overrides the browser (default: Google Chrome on macOS, google-chrome on Linux) */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] ? args[i + 1] : dflt; };
const root = path.resolve(__dirname, '..', '..');
const DIST = path.resolve(root, opt('dist', 'dist'));
const PORT = +opt('port', process.env.SMOKE_PORT || 10361);
const ONLY = opt('only', '').split(',').filter(Boolean);
const WIDTHS = opt('widths', '320,390,1440').split(',').map(Number);
const VERBOSE = args.includes('--verbose');
const LIGHT_GROUND = 'rgb(247, 246, 242)'; // --bg in src/styles.css, build/assets/chapter-page.css and the summary's sheet

/* ---------- the routes and the part each must show ---------- */
// ready(): a script that returns { ok, detail } once the route has drawn its key part; it is polled until ok or timeout
const view = (v) => `(document.querySelector('.view[data-view="${v}"]') && !document.querySelector('.view[data-view="${v}"]').hidden)`;
const count = (sel) => `document.querySelectorAll(${JSON.stringify(sel)}).length`;
const ROUTES = [
  { name: 'walk', url: '/#/', ready: `${view('walk')} && ${count('.view[data-view="walk"] .wk-step')} >= 15`, detail: `'walk view shown: ' + ${view('walk')} + ', steps: ' + ${count('.view[data-view="walk"] .wk-step')}` },
  { name: 'chain', url: '/#/chain', ready: `${view('stack')} && ${count('.view[data-view="stack"] article.chapter')} >= 17 && ${count('.view[data-view="stack"] article.chapter .plate')} >= 15`, detail: `'chapters: ' + ${count('.view[data-view="stack"] article.chapter')} + ', cards: ' + ${count('.view[data-view="stack"] article.chapter .plate')}` },
  { name: 'landscape', url: '/#/landscape', ready: `${view('landscape')} && ${count('#picker button[data-id]')} >= 20`, detail: `'chips in the picker: ' + ${count('#picker button[data-id]')}` },
  { name: 'suppliers', url: '/#/suppliers', ready: `${view('suppliers')} && /\\d/.test((document.getElementById('sup-count') || {}).textContent || '') && document.querySelector('#sup-ladder') && document.querySelector('#sup-ladder').children.length > 0`, detail: `'count: ' + ((document.getElementById('sup-count') || {}).textContent || 'none') + ', ladder parts: ' + (document.querySelector('#sup-ladder') ? document.querySelector('#sup-ladder').children.length : 0)` },
  { name: 'controls', url: '/#/controls', ready: `${view('controls')} && ${count('.cf-row')} >= (window.CP_DATA && CP_DATA.flows && CP_DATA.flows.flows ? CP_DATA.flows.flows.length : 1)`, detail: `'board rows: ' + ${count('.cf-row')}` },
  { name: 'exposure-asml', url: '/#/exposure/asml', ready: `${view('controls')} && !!document.getElementById('ex-asml') && document.getElementById('ex-asml').getBoundingClientRect().height > 0 && Math.abs(document.getElementById('ex-asml').getBoundingClientRect().top) < innerHeight`, detail: `'ASML chart: ' + (document.getElementById('ex-asml') ? 'top ' + Math.round(document.getElementById('ex-asml').getBoundingClientRect().top) + ', height ' + Math.round(document.getElementById('ex-asml').getBoundingClientRect().height) : 'missing')` },
  { name: 'glossary', url: '/#/glossary', ready: `${view('glossary')} && ${count('#lk-items li')} >= 300`, detail: `'entries: ' + ${count('#lk-items li')}` },
  { name: 'chapter-page', url: '/lithography/', ready: `/Lithography/.test((document.querySelector('h1.ch-title') || {}).textContent || '') && !!document.querySelector('.plate') && ${count('.sources li')} >= 10`, detail: `'title: ' + ((document.querySelector('h1.ch-title') || {}).textContent || 'none') + ', card: ' + !!document.querySelector('.plate') + ', sources: ' + ${count('.sources li')}` },
  { name: 'summary', url: '/summary/', ready: `${count('.ladder li')} === 15 && ${count('.grid .card')} >= 15`, detail: `'ladder rows: ' + ${count('.ladder li')} + ', cards: ' + ${count('.grid .card')}` },
];
// the theme default: these three page types, with the device set to dark
const THEMED = [['main page', '/#/', '/?theme=dark#/'], ['chapter page', '/lithography/', '/lithography/?theme=dark'], ['summary', '/summary/', '/summary/?theme=dark']];

/* ---------- a static server for dist/ ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };
let missing = []; // local requests that found nothing, since the last load began
function serve() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const file = path.join(DIST, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
      if (!file.startsWith(DIST) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { missing.push(p); res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
    server.on('error', reject);
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

/* ---------- Chrome over the DevTools pipe ---------- */
function chromePath() {
  if (process.env.CHROME) return process.env.CHROME;
  if (process.platform === 'darwin') return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  for (const c of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    for (const dir of (process.env.PATH || '').split(':')) if (fs.existsSync(path.join(dir, c))) return path.join(dir, c);
  }
  throw new Error('no Chrome found; set CHROME=/path/to/chrome');
}
function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cp-smoke-'));
  const flags = ['--headless=new', '--remote-debugging-pipe', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
    '--mute-audio', '--hide-scrollbars', '--enable-unsafe-swiftshader', '--disable-features=Translate,MediaRouter,OptimizationHints',
    // every host but this machine resolves to nothing, so no request leaves it (fonts and the counter fail quietly)
    '--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1'];
  // GitHub's Ubuntu runners block Chrome's sandbox (the pages are this repository's own build) and keep /dev/shm small
  if (process.env.CI) flags.push('--no-sandbox', '--disable-dev-shm-usage');
  if (process.env.SMOKE_CHROME_FLAGS) flags.push(...process.env.SMOKE_CHROME_FLAGS.split(/\s+/).filter(Boolean)); // e.g. --disable-3d-apis, a browser with no WebGL
  const proc = spawn(chromePath(), flags.concat('about:blank'), { stdio: ['ignore', 'ignore', VERBOSE ? 'inherit' : 'ignore', 'pipe', 'pipe'] });
  proc.on('error', (e) => { console.error(`smoke: could not start Chrome (${e.message}); set CHROME=/path/to/chrome`); process.exit(1); });
  const out = proc.stdio[3], inp = proc.stdio[4];
  inp.setEncoding('utf8'); // keeps a character split across two reads whole
  let id = 0, buf = '';
  const waiting = new Map(), listeners = new Set();
  inp.on('data', (chunk) => {
    buf += chunk;
    let at;
    while ((at = buf.indexOf('\0')) >= 0) {
      const msg = JSON.parse(buf.slice(0, at)); buf = buf.slice(at + 1);
      if (msg.id && waiting.has(msg.id)) { const w = waiting.get(msg.id); waiting.delete(msg.id); msg.error ? w.reject(new Error(`${w.method}: ${msg.error.message}`)) : w.resolve(msg.result); }
      else listeners.forEach((fn) => fn(msg));
    }
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const m = { id: ++id, method, params }; if (sessionId) m.sessionId = sessionId;
    waiting.set(m.id, { resolve, reject, method });
    out.write(JSON.stringify(m) + '\0');
  });
  // stop Chrome, wait for it to go, then remove its throwaway profile
  const close = () => new Promise((resolve) => {
    const done = () => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* left in the temp folder */ } resolve(); };
    if (proc.exitCode !== null) return done();
    proc.once('exit', done); try { proc.kill(); } catch (e) { done(); }
    setTimeout(done, 3000);
  });
  return { send, on: (fn) => listeners.add(fn), off: (fn) => listeners.delete(fn), close, proc };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const withTimeout = (p, ms, what) => Promise.race([p, sleep(ms).then(() => { throw new Error(`${what}: no answer after ${ms / 1000} s`); })]);

/* ---------- one page load ---------- */
const BASE = `http://127.0.0.1:${PORT}`;
const isLocal = (u) => !u || u.startsWith(BASE) || u.startsWith('about:') || u.startsWith('data:') || u.startsWith('blob:');
async function load(chrome, url, o) {
  const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (method, params) => chrome.send(method, params, sessionId);
  const errors = [];
  let loaded = false;
  const onMsg = (m) => {
    if (m.sessionId !== sessionId) return;
    const p = m.params || {};
    if (m.method === 'Page.loadEventFired') loaded = true;
    else if (m.method === 'Runtime.exceptionThrown') { const d = p.exceptionDetails || {}; errors.push(`uncaught: ${(d.exception && d.exception.description) || d.text}`.split('\n').slice(0, 3).join(' | ')); }
    else if (m.method === 'Runtime.consoleAPICalled') {
      const text = (p.args || []).map((a) => (a.value !== undefined ? String(a.value) : a.description || a.type)).join(' ');
      if (p.type === 'error' || p.type === 'assert') errors.push(`console.${p.type}: ${text}`);
      else if (p.type === 'warning' && /\b(module|specimen)\b.*\bfailed\b/i.test(text)) errors.push(`console.warn: ${text}`);
    } else if (m.method === 'Log.entryAdded') {
      const e = p.entry || {};
      if (e.level === 'error' && isLocal(e.url) && !/ERR_ABORTED/.test(e.text)) errors.push(`log: ${e.text}${e.url ? ' ' + e.url : ''}`);
    }
  };
  chrome.on(onMsg);
  try {
    await Promise.all([s('Page.enable'), s('Runtime.enable'), s('Log.enable')]);
    const phone = o.width < 768;
    await s('Emulation.setDeviceMetricsOverride', { width: o.width, height: phone ? 844 : 900, deviceScaleFactor: phone ? 2 : 1, mobile: phone });
    if (phone) await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-color-scheme', value: o.dark ? 'dark' : 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
    missing = [];
    await s('Page.navigate', { url: BASE + url });
    for (let t = 0; !loaded && t < 300; t++) await sleep(100);
    if (!loaded) errors.push('the page did not finish loading in 30 s');
    const evaluate = async (expr) => {
      const r = await withTimeout(s('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }), 15000, 'evaluate');
      if (r.exceptionDetails) throw new Error('check script failed: ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text));
      return r.result.value;
    };
    const result = { errors };
    if (o.ready) {
      let ok = false;
      for (let t = 0; t < 50 && !ok; t++) { ok = await evaluate(`!!(${o.ready})`); if (!ok) await sleep(200); }
      result.keyOk = ok; result.key = await evaluate(o.detail);
    }
    await sleep(700); // late errors: lazy modules, the first animation frame
    if (o.overflow) {
      result.overflow = await evaluate(`(() => {
        const st = document.createElement('style'); st.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(st);
        const de = document.documentElement, W = de.clientWidth, sw = Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0);
        const out = { width: W, scrollWidth: sw, wide: [] };
        if (sw > W + 1) for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect(); if (r.right <= W + 1 || !r.width) continue;
          let p = el.parentElement, clipped = false; while (p && p !== document.body) { if (getComputedStyle(p).overflowX !== 'visible') { clipped = true; break; } p = p.parentElement; }
          if (!clipped && getComputedStyle(el).position !== 'fixed') out.wide.push(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : '') + ' right ' + Math.round(r.right));
          if (out.wide.length >= 4) break;
        }
        st.remove(); return out;
      })()`);
    }
    if (o.ground) result.ground = await evaluate(`(() => { const t = (e) => getComputedStyle(e).backgroundColor; let bg = t(document.documentElement); if (/^(transparent|rgba\\(0, 0, 0, 0\\))$/.test(bg)) bg = t(document.body); return { bg, theme: document.documentElement.getAttribute('data-theme') || '' }; })()`);
    missing.forEach((p) => errors.push(`404 on the local server: ${p}`));
    return result;
  } finally {
    chrome.off(onMsg);
    await chrome.send('Target.closeTarget', { targetId }).catch(() => {});
  }
}

/* ---------- the tour ---------- */
(async () => {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error(`smoke: ${path.relative(root, DIST) || DIST}/index.html is missing; run node build/build.js first`); process.exit(1); }
  const t0 = Date.now();
  const server = await serve();
  const chrome = launch();
  const fails = [];
  let loads = 0;
  const fail = (where, what) => { fails.push(`${where}: ${what}`); console.log(`  FAIL ${what}`); };
  try {
    await withTimeout(chrome.send('Browser.getVersion'), 20000, 'Chrome did not start').then((v) => console.log(`smoke: ${v.product}, serving ${path.relative(root, DIST) || DIST} on ${BASE}`));
    for (const r of ROUTES.filter((x) => !ONLY.length || ONLY.includes(x.name))) {
      for (const width of WIDTHS) {
        const where = `${r.name} at ${width}`;
        const res = await load(chrome, r.url, { width, ready: r.ready, detail: r.detail, overflow: width <= 390 });
        loads++;
        console.log(`${where}: ${res.key}${res.overflow ? `, page ${res.overflow.scrollWidth} px wide` : ''}`);
        res.errors.forEach((e) => fail(where, e));
        if (!res.keyOk) fail(where, `the key part is missing (${res.key})`);
        if (res.overflow && res.overflow.scrollWidth > res.overflow.width + 1) fail(where, `scrolls sideways: the page is ${res.overflow.scrollWidth} px wide on a ${res.overflow.width} px screen${res.overflow.wide.length ? ' (widest: ' + res.overflow.wide.join('; ') + ')' : ''}`);
      }
    }
    if (!ONLY.length || ONLY.includes('theme')) {
      for (const [name, plain, dark] of THEMED) {
        const a = await load(chrome, plain, { width: 1440, dark: true, ground: true }); loads++;
        console.log(`theme, ${name}, device dark, nothing saved: ground ${a.ground.bg}${a.ground.theme ? ', data-theme ' + a.ground.theme : ''}`);
        a.errors.forEach((e) => fail(`theme ${name}`, e));
        if (a.ground.bg !== LIGHT_GROUND) fail(`theme ${name}`, `follows the device's dark setting: ground ${a.ground.bg}, expected the light ${LIGHT_GROUND}`);
        const b = await load(chrome, dark, { width: 1440, dark: false, ground: true }); loads++;
        console.log(`theme, ${name}, ?theme=dark: ground ${b.ground.bg}`);
        b.errors.forEach((e) => fail(`theme ${name} ?theme=dark`, e));
        if (b.ground.bg === LIGHT_GROUND) fail(`theme ${name}`, `?theme=dark keeps the light ground ${b.ground.bg}`);
      }
    }
  } catch (e) {
    fails.push('smoke: ' + e.message); console.error('smoke: ' + e.message);
  } finally {
    await chrome.close();
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
  }
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  if (fails.length) { console.error(`\nsmoke: ${fails.length} failure${fails.length === 1 ? '' : 's'} in ${loads} page loads (${secs} s)`); fails.forEach((f) => console.error('  ' + f)); process.exit(1); }
  console.log(`\nsmoke: ${loads} page loads, no failures (${secs} s)`);
  process.exit(0);
})();
