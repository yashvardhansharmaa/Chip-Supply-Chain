/* A small headless-Chrome driver for the redesign's QA scripts (census.js, sweep.js, shots.js), on the DevTools pipe as
   qa/scripts/smoke.js drives it, so it opens no port. WebGL runs on SwiftShader, so the specimens draw. Every host but this
   machine and Google Fonts resolves to nothing: the pages get their faces and nothing else leaves the machine.
   No personal data is ever sent: the pages are the local previews (127.0.0.1:8765 for main, 8766 for the redesign). */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cp-redesign-'));
  const flags = ['--headless=new', '--remote-debugging-pipe', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
    '--mute-audio', '--hide-scrollbars', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-features=Translate,MediaRouter,OptimizationHints',
    '--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1 , EXCLUDE fonts.googleapis.com , EXCLUDE fonts.gstatic.com'];
  const proc = spawn(CHROME, flags.concat('about:blank'), { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
  const out = proc.stdio[3], inp = proc.stdio[4];
  inp.setEncoding('utf8');
  let id = 0, buf = '';
  const waiting = new Map(), listeners = new Set();
  inp.on('data', (chunk) => {
    buf += chunk; let at;
    while ((at = buf.indexOf('\0')) >= 0) {
      const msg = JSON.parse(buf.slice(0, at)); buf = buf.slice(at + 1);
      if (msg.id && waiting.has(msg.id)) { const w = waiting.get(msg.id); waiting.delete(msg.id); msg.error ? w.reject(new Error(`${w.method}: ${msg.error.message}`)) : w.resolve(msg.result); }
      else listeners.forEach((fn) => fn(msg));
    }
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const m = { id: ++id, method, params }; if (sessionId) m.sessionId = sessionId;
    waiting.set(m.id, { resolve, reject, method }); out.write(JSON.stringify(m) + '\0');
  });
  const close = () => new Promise((resolve) => {
    const done = () => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { } resolve(); };
    if (proc.exitCode !== null) return done();
    proc.once('exit', done); try { proc.kill(); } catch (e) { done(); }
    setTimeout(done, 3000);
  });
  return { send, on: (fn) => listeners.add(fn), off: (fn) => listeners.delete(fn), close };
}

/* one tab at a given size and theme; returns { ev, shot, close, errors } */
async function open(chrome, url, o = {}) {
  const width = o.width || 1440, phone = width < 768, height = o.height || (phone ? 844 : 900);
  const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => chrome.send(m, p, sessionId);
  const errors = []; let loaded = false;
  const onMsg = (m) => {
    if (m.sessionId !== sessionId) return;
    const p = m.params || {};
    if (m.method === 'Page.loadEventFired') loaded = true;
    else if (m.method === 'Runtime.exceptionThrown') { const d = p.exceptionDetails || {}; errors.push(`uncaught: ${(d.exception && d.exception.description) || d.text}`.split('\n')[0]); }
    else if (m.method === 'Runtime.consoleAPICalled' && (p.type === 'error')) errors.push('console.error: ' + (p.args || []).map((a) => a.value || a.description || '').join(' '));
  };
  chrome.on(onMsg);
  await Promise.all([s('Page.enable'), s('Runtime.enable')]);
  await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: o.scale || (phone ? 2 : 1), mobile: phone });
  if (phone) await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: o.motion ? 'no-preference' : 'reduce' }] });
  let u = url;
  if (o.theme) { const [base, hash] = u.split('#'); u = base + (base.includes('?') ? '&' : '?') + 'theme=' + o.theme + (hash !== undefined ? '#' + hash : ''); }
  await s('Page.navigate', { url: u });
  for (let t = 0; !loaded && t < 300; t++) await sleep(100);
  const ev = async (expr) => {
    const r = await s('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('eval failed: ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text));
    return r.result.value;
  };
  // the faces in, then a moment for the views that build after boot
  await ev('document.fonts ? document.fonts.ready.then(() => 1) : 1');
  await sleep(o.wait || 1500);
  const shot = async (file, full) => {
    let clip;
    if (full) {
      const h = await ev('Math.min(document.documentElement.scrollHeight, 16000)');
      await s('Emulation.setDeviceMetricsOverride', { width, height: h, deviceScaleFactor: o.scale || (phone ? 2 : 1), mobile: phone });
      await sleep(800);
    }
    const r = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!full, clip });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
    if (full) await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: o.scale || (phone ? 2 : 1), mobile: phone });
  };
  // scroll, then wait for the faces again (a scroll can swap in a late face) and 1.5 s
  const scrollTo = async (y) => { await ev(`(document.documentElement.style.scrollBehavior='auto', window.scrollTo(0, ${y}), 1)`); await ev('document.fonts ? document.fonts.ready.then(() => 1) : 1'); await sleep(1500); };
  const close = async () => { chrome.off(onMsg); await chrome.send('Target.closeTarget', { targetId }).catch(() => {}); };
  return { ev, shot, scrollTo, close, errors, s };
}

module.exports = { launch, open, sleep };
