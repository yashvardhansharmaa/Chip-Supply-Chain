/* Shared helpers for the explainer animations in animations/*.html.
   Each page calls A.start({...}) with a render(ctx, t) function drawn in logical pixels (the canvas is 2x).
   build/animate.py opens the page with ?theme=light or ?theme=dark, waits for window.READY, then calls
   window.draw(t) for every frame. Open a page with #play to watch it loop in a browser. */
const A = (() => {
  const theme = new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light';
  const PAL = {
    light: { bg: '#f7f6f2', ink: '#14181f', ink2: '#3b424c', muted: '#5c636d', faint: '#a4a9b0', line: '#d8d4cc', garnet: '#7a1f2b', violet: '112,92,220', violetInk: '#5a4bb0', panel: '#ffffff' },
    dark: { bg: '#14171c', ink: '#ece9e2', ink2: '#c3c7cd', muted: '#939aa3', faint: '#5d646d', line: '#2c3138', garnet: '#d4667b', violet: '150,132,255', violetInk: '#a99cff', panel: '#1b1f25' },
  }[theme];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (p) => (p = clamp(p), p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const easeOut = (p) => 1 - Math.pow(1 - clamp(p), 3);
  const mix = (a, b, p) => a + (b - a) * p;
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mixc = (a, b, p) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, i) => Math.round(mix(v, y[i], clamp(p)))).join(',')})`; };
  const rng = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let ctx;
  function text(s, x, y, font, color, o = {}) {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic';
    ctx.letterSpacing = o.ls || '0px'; const g = ctx.globalAlpha; ctx.globalAlpha = g * (o.alpha == null ? 1 : o.alpha);
    ctx.fillText(s, x, y); ctx.globalAlpha = g; ctx.letterSpacing = '0px';
  }
  const LABEL = '600 10.5px "Instrument Sans"';
  function label(s, x, y, color, o = {}) { text(s.toUpperCase(), x, y, LABEL, color, Object.assign({ ls: '1.4px' }, o)); }
  function start({ W, H, duration, fade = 0.8, steps = [], render, fonts = [] }) {
    const cv = document.createElement('canvas'); cv.width = W * 2; cv.height = H * 2; cv.style.cssText = `display:block;width:${W * 2}px;height:${H * 2}px`;
    document.body.style.cssText = `margin:0;background:${PAL.bg}`; document.body.appendChild(cv);
    ctx = cv.getContext('2d');
    const off = document.createElement('canvas'); off.width = W * 2; off.height = H * 2;
    const frame = (c, t) => { const keep = ctx; ctx = c.getContext('2d'); ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.globalAlpha = 1; render(ctx, t); ctx = keep; };
    window.SIZE = [W * 2, H * 2]; window.DURATION = duration; window.STEPS = steps; window.FADE = fade;
    window.draw = (t) => {
      const hold = duration - fade;
      frame(cv, Math.min(t, hold));
      if (t > hold) { const p = ease((t - hold) / fade); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = p; ctx.drawImage(off, 0, 0); ctx.globalAlpha = 1; }
    };
    const need = ['500 20px Fraunces', '300 40px Fraunces', '400 16px "Source Serif 4"', '600 10.5px "Instrument Sans"', '500 12px "Instrument Sans"'].concat(fonts);
    Promise.all(need.map((f) => document.fonts.load(f))).then(() => {
      frame(off, 0); window.draw(0); window.READY = true;
      if (location.hash === '#play') { const t0 = performance.now(); const loop = () => { window.draw(((performance.now() - t0) / 1000) % duration); requestAnimationFrame(loop); }; loop(); }
    });
  }
  return { theme, PAL, clamp, ease, easeOut, mix, mixc, rng, text, label, start, get ctx() { return ctx; } };
})();
