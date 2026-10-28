/* CHIP SUPPLY CHAIN runtime: theme, router, WebGL specimen stage, section tracking, landscape / suppliers / geopolitics views. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var DATA = window.CP_DATA || {};
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // under 900 px wide, read from a media query: reading window.innerWidth made the browser lay the page out first
  var wideMQ = window.matchMedia ? matchMedia('(min-width: 900px)') : null;
  var narrow = function () { return wideMQ ? !wideMQ.matches : window.innerWidth < 900; };
  var safeUrl = function (u) { var v = String(u == null ? '' : u).trim(); return /^(https?:|mailto:|#|\/)/i.test(v) ? esc(v) : '#'; }; // data-fed link targets may only be web links, mail, fragments or site paths
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var dec = function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } }; // a hand-typed "#%" is not valid escaping and must not throw the router
  var COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', TW: 'Taiwan', KR: 'South Korea', CN: 'China', DE: 'Germany', CH: 'Switzerland', GB: 'United Kingdom', FR: 'France', IL: 'Israel', SG: 'Singapore', MY: 'Malaysia', AT: 'Austria', IT: 'Italy', BE: 'Belgium', IN: 'India', AE: 'United Arab Emirates', SA: 'Saudi Arabia', CA: 'Canada', SE: 'Sweden', FI: 'Finland', DK: 'Denmark', IE: 'Ireland', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', MX: 'Mexico', 'EU-other': 'Other Europe', Other: 'Other' };
  var cname = function (c) { return COUNTRY[c] || c; };
  var cssPx = function (name) { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0; };
  /* what covers the top of the window: the fixed masthead, and in the walk the fixed rail under it (the chain's own rail was
     retired on 21 Oct 2026: the ledger column beside each chapter already shows the stages) */
  var headerH = function () {
    var h = (cssPx('--masthead') || 56) + cssPx('--band');
    var cur = window.CP && CP.Router ? CP.Router.current : null, rail = cur === 'walk' ? $('#wk-rail') : null;
    if (rail && !rail.hidden && rail.offsetHeight && getComputedStyle(rail).position === 'fixed') h += rail.offsetHeight;
    return h;
  };
  /* where a scrolled-to element's top should sit: its content (inside any top padding, as a chapter has) below the header with a
     little air, or lower if its own scroll-margin-top asks */
  var landAt = function (el) { var cs = getComputedStyle(el); return Math.max(parseFloat(cs.scrollMarginTop) || 0, headerH() + 16 - (parseFloat(cs.paddingTop) || 0)); };
  /* every scroll the script makes to an element goes through here, so a title never lands under the masthead or the rail */
  var scrollToEl = function (el, smooth) {
    if (!el || !el.getBoundingClientRect) return;
    var glide = !!smooth && !reduced;
    var y = Math.max(0, Math.round(el.getBoundingClientRect().top + window.pageYOffset - landAt(el)));
    var root = document.documentElement, prev = root.style.scrollBehavior;
    if (!glide) root.style.scrollBehavior = 'auto'; // html has scroll-behavior: smooth; a jump must not animate 30,000 px
    window.scrollTo({ top: y, behavior: glide ? 'smooth' : 'auto' });
    if (!glide) root.style.scrollBehavior = prev;
  };
  /* the reader's own date as YYYY-MM-DD (toISOString would give the UTC date, a day ahead in an American evening) */
  var localISO = function (d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  /* a snippet cut at a word boundary, with an ellipsis when anything was cut */
  var clip = function (s, n) {
    s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
    if (s.length <= n) return s;
    var t = s.slice(0, n + 1), sp = t.lastIndexOf(' ');
    t = sp > n * 0.6 ? t.slice(0, sp) : s.slice(0, n);
    return t.replace(/[\s,;:.\-–—(]+$/, '') + '…';
  };

  /* ---------------- theme ---------------- */
  var Theme = {
    current: function () {
      var s = document.documentElement.getAttribute('data-theme');
      return s || 'light'; // light unless the reader chose dark with the toggle
    },
    apply: function (t) {
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('cp-theme', t); } catch (e) { }
      this.sync();
    },
    sync: function () {
      var dark = this.current() === 'dark', b = $('.theme-toggle');
      if (b) {
        b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        // the icons are SVG elements, which have no .hidden property: set the attribute, which [hidden] hides
        $('.ic-moon', b).toggleAttribute('hidden', dark); $('.ic-sun', b).toggleAttribute('hidden', !dark);
      }
      Stage.refreshColors();
    },
    init: function () {
      var self = this;
      $('.theme-toggle').addEventListener('click', function () { self.apply(self.current() === 'dark' ? 'light' : 'dark'); });
      this.sync();
    }
  };

  /* ---------------- tiny matrix lib ---------------- */
  function perspective(fov, aspect, near, far) {
    var f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  }
  function mul(a, b) { // column-major 4x4
    var o = new Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; }
  function rotZ(a) { var c = Math.cos(a), s = Math.sin(a); return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; }
  function scale(s) { return [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]; }
  function translate(x, y, z) { return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]; }
  function easeOut(t) { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 3); }

  /* ---------------- the stage (WebGL point renderer) ---------------- */
  var Stage = {
    ok: false, gl: null, canvas: null, cache: {}, cur: null, prev: null, transStart: 0, transDur: reduced ? 1 : 1100,
    spin: 0, scrollAngle: 0, lastT: 0, userYaw: 0, userPitch: 0, held: false, dragging: false, ink: [0.07, 0.09, 0.1], accent: [0.79, 0.54, 0.07], dpr: 1, w: 0, h: 0, hidden: false, active: true,
    /* Clouds are sized to the canvas they are drawn on. The phone strip's 116 px thumbnail ("thumb", any canvas under 200 px
       on its short side) takes THUMB of the points a full-size stage gets, and a specimen is built again at full size when the
       strip expands. lvl is the size of the canvas now; null until it has been laid out. */
    lvl: null, THUMB: 0.4, queue: [], idling: false,
    level: function (r) { r = r || this.canvas.getBoundingClientRect(); return !r.width || !r.height ? null : Math.min(r.width, r.height) < 200 ? 'thumb' : 'full'; },
    density: function (lvl) { return (narrow() ? 0.55 : (window.devicePixelRatio > 1.5 ? 0.85 : 1)) * (lvl === 'thumb' ? this.THUMB : 1); },
    // specimens to build while the browser is idle, before the reader reaches them, and only while the stage is showing
    soon: function (names) { var self = this; (names || []).forEach(function (n) { if (n && self.queue.indexOf(n) < 0) self.queue.push(n); }); this.idle(); },
    idle: function () {
      var self = this;
      if (this.idling || !this.queue.length || !this.ok || !this.active) return; // setVisible(true) picks the queue up again
      this.idling = true;
      var go = function () { self.idling = false; if (!self.active) return; var n = self.queue.shift(); if (n) self.build(n, null); self.idle(); };
      if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 2000 }); else setTimeout(go, 300);
    },
    init: function () {
      this.canvas = $('#stage-canvas');
      this.fig = $('.stage');
      if (!this.canvas || !this.fig) return;
      var gl = this.canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' }) ||
               this.canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
      if (!gl || !window.PC) { this.fig.setAttribute('data-hidden', '1'); document.documentElement.classList.add('no-stage'); return; }
      this.gl = gl;
      var vs = 'attribute vec4 aP;uniform mat4 uMVP;uniform float uSize;uniform float uOp;uniform vec3 uInk;uniform vec3 uAcc;uniform vec3 uAcc2;varying vec4 vC;' +
        'void main(){vec4 p=uMVP*vec4(aP.xyz,1.0);gl_Position=p;float w=aP.w;vec3 c;float a;' +
        // three channels: ink w in [0,1], accent w in [2,3], second accent w in (3,4] (see src/kit.js)
        'if(w>3.0){c=uAcc2;a=clamp(w-3.0,0.0,1.0);}else if(w>=2.0){c=uAcc;a=clamp(w-2.0,0.0,1.0);}else{c=uInk;a=clamp(w,0.0,1.0);}' +
        'float j=fract(sin(dot(aP.xyz,vec3(12.9898,78.233,37.719)))*43758.5453);' + // per-point size jitter: hand-stippled, not screen-toned
        'float depth=clamp((p.w-2.4)/3.2,0.0,1.0);' + // far points fade a little, which reads as depth
        'gl_PointSize=(uSize*(0.72+0.56*j))/max(p.w,0.5);vC=vec4(c,a*uOp*mix(1.0,0.62,depth));}';
      var fs = 'precision mediump float;varying vec4 vC;void main(){vec2 d=gl_PointCoord-0.5;float r=dot(d,d);if(r>0.25)discard;float a=vC.a*smoothstep(0.25,0.10,r);gl_FragColor=vec4(vC.rgb*a,a);}';
      var prog = gl.createProgram();
      var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      try { gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); }
      catch (e) { this.fig.setAttribute('data-hidden', '1'); document.documentElement.classList.add('no-stage'); return; }
      gl.useProgram(prog);
      this.loc = { aP: gl.getAttribLocation(prog, 'aP'), uMVP: gl.getUniformLocation(prog, 'uMVP'), uSize: gl.getUniformLocation(prog, 'uSize'), uOp: gl.getUniformLocation(prog, 'uOp'), uInk: gl.getUniformLocation(prog, 'uInk'), uAcc: gl.getUniformLocation(prog, 'uAcc'), uAcc2: gl.getUniformLocation(prog, 'uAcc2') };
      gl.enableVertexAttribArray(this.loc.aP);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
      this.ok = true;
      this.refreshColors();
      var self = this;
      window.addEventListener('resize', function () { self.resize(); });
      if (window.ResizeObserver) new ResizeObserver(function () { self.resize(); }).observe(this.canvas); // the caption below the canvas changes height per specimen
      document.addEventListener('visibilitychange', function () { self.hidden = document.hidden; });
      this.pointer();
      this.resize();
      requestAnimationFrame(function (t) { self.loop(t); });
    },
    refreshColors: function () {
      // read where the canvas sits: a chapter's night slot (the two chapters that are not stages) sets its own ink and accent (src/modules/chapter.css)
      var cs = getComputedStyle(this.canvas && this.canvas.isConnected ? this.canvas : document.documentElement);
      var p = function (v, d) { var m = (cs.getPropertyValue(v) || '').split(','); if (m.length < 3) return d; return [parseFloat(m[0]) / 255, parseFloat(m[1]) / 255, parseFloat(m[2]) / 255]; };
      this.ink = p('--stage-ink', this.ink); this.accent = p('--stage-accent', this.accent);
      // a specimen's own colours are picked per theme: accentDark/accent2Dark when data-theme="dark", else the light
      // colour lifted by PC.lift (HSL lightness raised to at least 0.62, hue and saturation kept); see src/kit.js
      this.dark = document.documentElement.getAttribute('data-theme') === 'dark' || !!(this.canvas && this.canvas.closest && this.canvas.closest('[data-night]'));
      for (var k in this.cache) if (this.cache.hasOwnProperty(k)) this.cache[k].colors = null;
    },
    // the two accent colours a slot draws with, as 0..1 triplets: its own if it declares any, else the CSS accent for both
    slotColors: function (slot) {
      if (slot.colors) return slot.colors;
      var r = PC.resolveColors(slot.spec, this.dark), f = function (c) { return [c[0] / 255, c[1] / 255, c[2] / 255]; };
      slot.colors = r ? { accent: f(r.accent), accent2: f(r.accent2) } : { accent: this.accent, accent2: this.accent };
      return slot.colors;
    },
    resize: function () {
      if (!this.ok) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = this.canvas.getBoundingClientRect();
      this.w = Math.max(1, Math.round(r.width * this.dpr)); this.h = Math.max(1, Math.round(r.height * this.dpr));
      if (this.canvas.width !== this.w || this.canvas.height !== this.h) { this.canvas.width = this.w; this.canvas.height = this.h; }
      this.gl.viewport(0, 0, this.w, this.h);
      var l = this.level(r);
      if (l) this.lvl = l;
      // the strip expanded (or the window grew): the specimen on show is built again for the bigger canvas, in place
      if (this.cur && this.lvl && this.cur.lvl !== this.lvl) {
        var s = this.build(this.cur.name, this.cur.params);
        if (s && s !== this.cur) { s.spinBase = this.cur.spinBase; if (this.prev === this.cur) this.prev = null; this.cur = s; }
      }
      this.fit();
    },
    build: function (name, params) {
      if (!this.ok || !name) return null; // no context: building the cloud would cost the work and then throw at the buffer
      var lvl = this.lvl || (narrow() ? 'thumb' : 'full'); // before the canvas is laid out: a phone shows the strip
      var key = name + '|' + JSON.stringify(params || {}) + '|' + lvl;
      if (this.cache[key]) return this.cache[key];
      var spec;
      PC.density = this.density(lvl);
      try { spec = PC.build(name, params); } catch (e) { console.warn('specimen failed:', name, e.message); return null; }
      var gl = this.gl, vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, spec.cloud, gl.STATIC_DRAW);
      // every k-th point, about 1,500 in all: enough to find how far down the drawing reaches as it turns (fit)
      var cl = spec.cloud, np = cl.length / 4, k = Math.max(1, Math.floor(np / 1500)), smp = [];
      for (var q = 0; q < np; q += k) smp.push(cl[q * 4], cl[q * 4 + 1], cl[q * 4 + 2]);
      var slot = { key: key, name: name, params: params || null, lvl: lvl, vbo: vbo, n: PC.count(spec.cloud), spin: spec.spin, tilt: spec.tilt, turntable: !!spec.turntable, caption: spec.caption, spinBase: 0,
        sample: smp, norm: spec.norm || null, extent: {},
        spec: { accent: spec.accent, accent2: spec.accent2, accentDark: spec.accentDark, accent2Dark: spec.accent2Dark }, colors: null };
      this.cache[key] = slot;
      return slot;
    },
    show: function (name, params, caption, tag) {
      if (!this.ok || !name) return;
      var slot = this.build(name, params);
      if (!slot) return;
      var cap = $('#stage-caption'), tg = $('#stage-tag-text');
      if (cap) cap.innerHTML = caption ? caption : (slot.caption ? esc(slot.caption) : '');
      if (tg && tag) tg.innerHTML = tag;
      if (this.cur && this.cur.key === slot.key) return;
      this.prev = this.cur; this.cur = slot; this.transStart = performance.now();
      slot.spinBase = -this.spin; // each specimen starts from its own tilt
      this.scrollAngle = 0; this.userYaw = 0; this.userPitch = 0;
      this.fit();
    },
    /* The model's view matrix for a slot at the current turn (as draw() sets it), so the balloons can find a part on the screen */
    model: function (slot, extraRot, sc) {
      var t = slot.tilt, idle = this.spin + slot.spinBase;
      var M = slot.turntable
        ? mul(rotZ(t[2]), mul(rotY(t[1] + this.scrollAngle + extraRot), mul(rotX(t[0]), rotY(idle))))
        : mul(rotZ(t[2]), mul(rotY(t[1] + idle + this.scrollAngle + extraRot), rotX(t[0])));
      M = mul(M, scale(sc));
      if (this.userYaw || this.userPitch) M = mul(rotX(this.userPitch), mul(rotY(this.userYaw), M));
      return M;
    },
    proj: function (aspect) {
      return mul(perspective(34 * Math.PI / 180, aspect, 0.1, 40), translate(0, 0, -3.8 * Math.max(1, 0.98 / aspect)));
    },
    /* How far the drawing reaches across a turn, in CSS pixels of this canvas: the lowest point and the widest either side of
       the centre, over 24 steps of the idle turn. fit() puts the caption right under the drawing with it (the stage's empty
       band under a drawing, --slack), and the balloons keep clear of the drawing with it. */
    reach: function (slot) {
      var r = this.canvas.getBoundingClientRect(), w = r.width, h = r.height;
      if (!w || !h || !slot || !slot.sample) return null;
      var key = Math.round(w) + 'x' + Math.round(h);
      if (slot.extent[key]) return slot.extent[key];
      var P = this.proj(w / h), t = slot.tilt, smp = slot.sample, bottom = 0, top = h, side = 0;
      for (var a = 0; a < 24; a++) {
        var yaw = a * Math.PI / 12;
        var M = slot.turntable ? mul(rotZ(t[2]), mul(rotY(t[1]), mul(rotX(t[0]), rotY(yaw)))) : mul(rotZ(t[2]), mul(rotY(t[1] + yaw), rotX(t[0])));
        var A = mul(P, M);
        for (var i = 0; i < smp.length; i += 3) {
          var x = smp[i], y = smp[i + 1], z = smp[i + 2];
          var cw = A[3] * x + A[7] * y + A[11] * z + A[15]; if (cw <= 0) continue;
          var sx = (A[0] * x + A[4] * y + A[8] * z + A[12]) / cw, sy = (A[1] * x + A[5] * y + A[9] * z + A[13]) / cw;
          var py = (1 - sy) / 2 * h, px = Math.abs(sx) / 2 * w;
          if (py > bottom) bottom = py; if (py < top) top = py; if (px > side) side = px;
        }
      }
      return (slot.extent[key] = { bottom: bottom, top: top, side: side, w: w, h: h });
    },
    // the caption stands on the drawing's foot: the empty band under the drawing goes to the stage (or the chapter's slot) as --slack.
    // A chapter's plate (the column, src/modules/chapter.css) is fitted to its drawing, which turns inside the sphere that holds it,
    // so a flat board and a tall rack leave different bands: the canvas takes the height (--draw-h, 380 to 640 px) at which the
    // drawing stands about 340 px tall as it turns, the band over the drawing goes (--lift: the slot is that much shorter and the
    // canvas rides up under the opener) and the caption rises into the band under it (--slack). The night plate of chapters 16 and
    // 17 keeps 28 px of its ground round the drawing, and its caption stands under it
    fit: function () {
      if (!this.ok || !this.cur) return;
      var e = this.reach(this.cur), host = this.hostEl || this.fig;
      if (!e || !host) return;
      var spec = this.hostEl ? this.hostEl.closest('.ch-spec') : this.fig, art = this.hostEl ? this.hostEl.closest('article.chapter') : null;
      if (!art) { spec.style.setProperty('--slack', Math.max(0, Math.round(e.h - e.bottom - 10)) + 'px'); return; }
      if (art.getAttribute('data-specimen') !== this.cur.name) return; // the drawing has moved here, its specimen not yet (show() fits it)
      var want = Math.round(Math.max(380, Math.min(640, 340 * e.h / Math.max(1, e.bottom - e.top))));
      if (Math.abs(want - e.h) > 2 && this.fitting !== want) { this.fitting = want; spec.style.setProperty('--draw-h', want + 'px'); this.resize(); return; }
      this.fitting = 0; // (a height the slot did not take is not asked for twice in a row)
      var night = spec.hasAttribute('data-night');
      spec.style.setProperty('--lift', Math.max(0, Math.round(e.top - (night ? 28 : 12))) + 'px');
      spec.style.setProperty('--slack', Math.max(0, Math.round(e.h - e.bottom - (night ? 28 : 10))) + 'px');
    },
    /* The chapter's slot the drawing sits in on The Chain (src/modules/chapter.css .ch-spec-draw), or null for the stage beside
       the page (the home, AI Chips) and the phone's strip. The canvas and its pause button move; the canvas keeps its context. */
    /* Where the stage sits in the page's order (it is fixed, so only the Tab order sees it): on the home, right after the
       hero, so Tab reaches the chain at a glance, whose rows pick the specimen, before the specimen itself; elsewhere, its place
       in src/template.html, before the views */
    place: function (v) {
      if (!this.fig) return;
      if (!this.homeParent) { this.homeParent = this.fig.parentNode; this.homeBefore = $('#main'); }
      var ev = v === 'walk' ? $('.view[data-view="walk"] #wk-hero') : null;
      if (ev) { if (this.fig.previousElementSibling !== ev) ev.parentNode.insertBefore(this.fig, ev.nextSibling); }
      else if (this.fig.parentNode !== this.homeParent && this.homeBefore) this.homeParent.insertBefore(this.fig, this.homeBefore);
    },
    hostEl: null,
    host: function (el) {
      if (!this.canvas || el === this.hostEl) return;
      var pause = this.fig ? $('.stage-pause', this.fig) || (this.hostEl ? $('.stage-pause', this.hostEl.closest('.ch-spec')) : null) : null;
      if (this.balloonEl) { this.balloonEl.remove(); this.balloonEl = null; this.parts = null; }
      if (el) {
        el.appendChild(this.canvas);
        var lab = $('.ch-spec-cap .label', el.closest('.ch-spec'));
        if (pause && lab) lab.appendChild(pause);
        this.fig.setAttribute('data-hosted', '1');
        this.balloons(el);
      } else {
        this.fig.insertBefore(this.canvas, this.fig.firstChild);
        var tag = $('.stage-tag', this.fig);
        if (pause && tag) tag.appendChild(pause);
        this.fig.removeAttribute('data-hosted');
      }
      this.hostEl = el;
      this.refreshColors();
      this.resize();
    },
    /* The numbered balloons over the live drawing, where the chapter's slot lists parts (data/specimen-parts.json, carried on the
       slot as data-parts): each part's points are turned with the drawing every frame and projected; its balloon stands in a
       column clear of the drawing on the side the part is on, at the part's height, with a leader to each point. A part that
       crosses to the other side as the drawing turns moves its balloon across. The phone's strip and the home show none. */
    balloonEl: null, parts: null,
    balloons: function (el, from) {
      var fig = from || el.closest('.ch-spec'), raw = fig && fig.getAttribute('data-parts');
      if (!raw) return;
      var parts; try { parts = JSON.parse(raw); } catch (e) { return; }
      if (!parts || !parts.length) return;
      var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'ch-balloons'); svg.setAttribute('aria-hidden', 'true');
      parts.forEach(function (p) {
        var g = document.createElementNS(NS, 'g');
        p.lines = (p.at || []).map(function () { var l = document.createElementNS(NS, 'line'); g.appendChild(l); return l; });
        p.dots = (p.at || []).map(function () { var d = document.createElementNS(NS, 'circle'); d.setAttribute('class', 'dot'); d.setAttribute('r', '3.5'); g.appendChild(d); return d; });
        p.c = document.createElementNS(NS, 'circle'); p.c.setAttribute('class', 'bal'); p.c.setAttribute('r', '12'); g.appendChild(p.c);
        p.tn = document.createElementNS(NS, 'text'); p.tn.setAttribute('class', 'num'); p.tn.setAttribute('text-anchor', 'middle'); p.tn.textContent = p.n; g.appendChild(p.tn);
        p.tl = document.createElementNS(NS, 'text'); p.tl.setAttribute('class', 'nm'); p.tl.textContent = p.name; g.appendChild(p.tl);
        svg.appendChild(g);
        p.x = null; p.y = null; p.side = 0;
      });
      el.appendChild(svg);
      this.balloonEl = svg; this.parts = parts; this.partsFor = (fig.closest('article.chapter') || {}).getAttribute ? fig.closest('article.chapter').getAttribute('data-specimen') : '';
      return svg;
    },
    /* On a phone the drawing stays in the strip at the foot of the screen; expanded, the strip numbers the parts too, with the
       numbers only, as the readable page does on a phone, since the list under the caption names them (stage 2 review, item 2).
       Called when the strip opens or closes and when the specimen changes (loop) */
    stripBalloons: function () {
      this._balCur = this.cur;
      var want = !this.hostEl && narrow() && Band.el && !Band.collapsed && this.cur, el = this.balloonEl;
      if (el && el.classList.contains('is-strip') && (!want || this.partsFor !== this.cur.name)) { el.remove(); this.balloonEl = null; this.parts = null; }
      if (!want || this.balloonEl) return;
      var art = $('.view[data-view="stack"] article.chapter[data-specimen="' + this.cur.name + '"]'), spec = art && $('.ch-spec[data-parts]', art);
      if (!spec) return;
      var svg = this.balloons(this.fig, spec);
      if (svg) { svg.classList.add('is-strip'); this.balloonsSnap = true; }
    },
    drawBalloons: function () {
      var parts = this.parts, slot = this.cur;
      if (!parts || !slot || slot.name !== this.partsFor || !slot.norm) { if (this.balloonEl) this.balloonEl.style.display = 'none'; return; }
      var r = this.canvas.getBoundingClientRect(), w = r.width, h = r.height;
      if (!w || !h) return;
      this.balloonEl.style.display = '';
      if (this.balloonEl.classList.contains('is-strip')) { var bs = this.balloonEl.style; bs.left = this.canvas.offsetLeft + 'px'; bs.top = this.canvas.offsetTop + 'px'; bs.width = w + 'px'; bs.height = h + 'px'; } // over the strip's canvas
      var k = easeOut((performance.now() - this.transStart) / this.transDur);
      var A = mul(this.proj(w / h), this.model(slot, -0.45 * (1 - k), 0.94 + 0.06 * k));
      var nc = slot.norm.c, nk = slot.norm.k, e = this.reach(slot) || { side: w * 0.3 };
      var pr = function (q) {
        var x = (q[0] - nc[0]) * nk, y = (q[1] - nc[1]) * nk, z = ((q[2] || 0) - nc[2]) * nk;
        var cw = A[3] * x + A[7] * y + A[11] * z + A[15];
        return [((A[0] * x + A[4] * y + A[8] * z + A[12]) / cw + 1) / 2 * w, (1 - (A[1] * x + A[5] * y + A[9] * z + A[13]) / cw) / 2 * h];
      };
      var cx = w / 2, gap = Math.max(26, Math.min(56, w * 0.05)), colL = Math.max(18, cx - e.side - gap), colR = Math.min(w - 18, cx + e.side + gap);
      var sides = [[], []];
      parts.forEach(function (p) {
        p.pts = (p.at || []).map(pr);
        if (!p.pts.length) return;
        var mx = 0, my = 0; p.pts.forEach(function (q) { mx += q[0]; my += q[1]; }); mx /= p.pts.length; my /= p.pts.length;
        // the side a part's balloon stands on changes only once the part is well past the middle, so it never flickers
        var want = mx < cx ? -1 : 1; if (!p.side || (want !== p.side && Math.abs(mx - cx) > w * 0.04)) p.side = want;
        p.ty = my; sides[p.side < 0 ? 0 : 1].push(p);
      });
      // on each side, the balloons keep 34 px apart, in the order of the parts' heights
      sides.forEach(function (list) {
        list.sort(function (a, b) { return a.ty - b.ty; });
        for (var i = 1; i < list.length; i++) if (list[i].ty - list[i - 1].ty < 34) list[i].ty = list[i - 1].ty + 34;
        var over = list.length ? list[list.length - 1].ty - (h - 18) : 0;
        if (over > 0) list.forEach(function (p) { p.ty -= over; });
      });
      var snap = this.balloonsSnap; this.balloonsSnap = false;
      parts.forEach(function (p) {
        if (!p.pts || !p.pts.length) return;
        var tx = p.side < 0 ? colL : colR, ty = Math.max(16, p.ty);
        if (p.x === null || snap || reduced) { p.x = tx; p.y = ty; } else { p.x += (tx - p.x) * 0.14; p.y += (ty - p.y) * 0.14; }
        p.c.setAttribute('cx', p.x.toFixed(1)); p.c.setAttribute('cy', p.y.toFixed(1));
        p.tn.setAttribute('x', p.x.toFixed(1)); p.tn.setAttribute('y', (p.y + 4.5).toFixed(1));
        var left = p.x < cx, tw = p.tw || 0;
        if (!tw) { tw = p.tl.getComputedTextLength ? p.tl.getComputedTextLength() : 0; if (tw > 0) p.tw = tw; else tw = String(p.name).length * 8; } // measured once the faces are in
        // the name beside its balloon, or under it where beside would run past the drawing's edge (the page clips there)
        var under = left ? p.x - 18 - tw < 2 : p.x + 18 + tw > w - 2;
        p.tl.setAttribute('x', (under ? p.x : left ? p.x - 18 : p.x + 18).toFixed(1)); p.tl.setAttribute('y', (under ? p.y + 32 : p.y + 5).toFixed(1));
        p.tl.setAttribute('text-anchor', under ? 'middle' : left ? 'end' : 'start');
        p.pts.forEach(function (q, i) {
          var dx = q[0] - p.x, dy = q[1] - p.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
          var l = p.lines[i]; l.setAttribute('x1', (p.x + dx / L * 12).toFixed(1)); l.setAttribute('y1', (p.y + dy / L * 12).toFixed(1)); l.setAttribute('x2', q[0].toFixed(1)); l.setAttribute('y2', q[1].toFixed(1));
          p.dots[i].setAttribute('cx', q[0].toFixed(1)); p.dots[i].setAttribute('cy', q[1].toFixed(1));
        });
      });
    },
    // with no WebGL there is nothing to draw, so the figure stays hidden rather than framing an empty canvas under a stale tag
    setVisible: function (v) { var self = this; this.active = v; if (!this.fig) return; var show = v && this.ok; this.fig.setAttribute('data-hidden', show ? '0' : '1'); if (show) { this.resize(); requestAnimationFrame(function () { self.resize(); }); this.idle(); } },
    draw: function (slot, op, extraRot, sc) {
      var gl = this.gl, aspect = this.w / this.h;
      // proj(): the perspective, and the camera pulled back on narrow (portrait) stages so the bounding sphere fits the width too
      // (3.8 keeps the unit sphere inside 89% of the canvas height, including perspective). model(): turntable specimens spin
      // about their own vertical axis before the tilt (a plan view rotating in its plane), the rest about the world axis, and the
      // reader's own turn about the world axes
      var MVP = mul(this.proj(aspect), this.model(slot, extraRot, sc));
      gl.uniformMatrix4fv(this.loc.uMVP, false, new Float32Array(MVP));
      var size = 6.6 * this.dpr * Math.min(1.05, Math.max(0.6, this.h / (900 * this.dpr))) * Math.max(1, 0.98 / aspect);
      gl.uniform1f(this.loc.uSize, size);
      gl.uniform1f(this.loc.uOp, op);
      var col = this.slotColors(slot);
      gl.uniform3fv(this.loc.uInk, this.ink); gl.uniform3fv(this.loc.uAcc, col.accent); gl.uniform3fv(this.loc.uAcc2, col.accent2);
      gl.bindBuffer(gl.ARRAY_BUFFER, slot.vbo);
      gl.vertexAttribPointer(this.loc.aP, 4, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, slot.n);
    },
    // the specimen turns under the mouse: rest on it and the idle spin pauses, drag to turn it, arrow keys turn it from the keyboard
    pointer: function () {
      var self = this, c = this.canvas, lx = 0, ly = 0, fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!fine) return;
      c.setAttribute('tabindex', '0'); c.setAttribute('aria-label', '3D specimen. Drag it or use the arrow keys to turn it.');
      c.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') self.held = true; });
      c.addEventListener('pointerleave', function () { if (!self.dragging) self.held = false; });
      c.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch' || e.button !== 0) return;
        self.dragging = true; self.held = true; lx = e.clientX; ly = e.clientY; c.setPointerCapture(e.pointerId); c.classList.add('is-dragging'); e.preventDefault();
      });
      c.addEventListener('pointermove', function (e) {
        if (!self.dragging) return;
        self.userYaw += (e.clientX - lx) * 0.008; self.userPitch += (e.clientY - ly) * 0.008;
        self.userPitch = Math.max(-1.2, Math.min(1.2, self.userPitch));
        lx = e.clientX; ly = e.clientY;
      });
      var up = function (e) { if (!self.dragging) return; self.dragging = false; c.classList.remove('is-dragging'); if (e && e.type === 'pointercancel') self.held = false; };
      c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
      c.addEventListener('keydown', function (e) {
        var step = 0.12, k = e.key;
        if (k === 'ArrowLeft') self.userYaw -= step; else if (k === 'ArrowRight') self.userYaw += step;
        else if (k === 'ArrowUp') self.userPitch = Math.max(-1.2, self.userPitch - step); else if (k === 'ArrowDown') self.userPitch = Math.min(1.2, self.userPitch + step);
        else if (k === 'Home') { self.userYaw = 0; self.userPitch = 0; } else return;
        e.preventDefault();
      });
      c.addEventListener('focus', function () { self.held = true; }); c.addEventListener('blur', function () { if (!self.dragging) self.held = false; });
    },
    loop: function (t) {
      var self = this;
      requestAnimationFrame(function (tt) { self.loop(tt); });
      if (!this.ok || this.hidden || !this.active) { this.lastT = t; return; }
      if (this.hostEl) { var hr = this.canvas.getBoundingClientRect(); if (hr.bottom < 0 || hr.top > window.innerHeight) { this.lastT = t; return; } } // a chapter's slot scrolled out of view
      var dt = Math.min(0.05, (t - this.lastT) / 1000 || 0); this.lastT = t;
      var gl = this.gl;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (!this.cur) return;
      if (!reduced && !this.held && !this.still) this.spin += (this.cur.spin || 0.1) * dt; // the idle turn pauses while the pointer rests on the specimen, and stops while the reader has paused it (Band.init)
      var k = easeOut((t - this.transStart) / this.transDur);
      if (this.prev && k < 1) this.draw(this.prev, 1 - k, 0.35 * k, 1 + 0.04 * k);
      else this.prev = null;
      this.draw(this.cur, k, -0.45 * (1 - k), 0.94 + 0.06 * k);
      if (this.cur !== this._balCur) this.stripBalloons();
      if (this.balloonEl) this.drawBalloons();
    }
  };


  /* ---------------- phone specimen strip: a bottom bar with a live thumbnail; Show expands it; Contents opens the sheet ---------------- */
  var Band = {
    el: null, collapsed: true,
    init: function () {
      var self = this; this.el = $('.stage'); if (!this.el) return;
      var toggle = $('.stage-toggle'), menu = $('.stage-menu'), sheet = $('#sheet');
      this.set(true);
      // the collapsed strip is as tall as its whole caption (src/styles.css): the page keeps that much room at its foot (--strip-h)
      if (window.ResizeObserver) new ResizeObserver(function () { if (self.collapsed && narrow()) document.documentElement.style.setProperty('--strip-h', Math.round(self.el.getBoundingClientRect().height) + 'px'); }).observe(this.el);
      if (toggle) toggle.addEventListener('click', function () { self.set(!self.collapsed); });
      // the sheet is a modal (aria-modal in src/template.html): while it stands, the page behind and the skip link are inert, so
      // Tab stays in the sheet. Closing gives focus back to the button that opened it, or after a link to the heading the link
      // lands on (Keys.land). A call that changes nothing (the resize below, on every resize) leaves focus alone
      var opener = null;
      var open = function (v, href) {
        if (!sheet) return;
        var was = !sheet.hidden;
        sheet.hidden = !v; document.documentElement.style.overflow = v ? 'hidden' : '';
        if (v === was) return;
        [$('#app'), $('.skip')].forEach(function (el) { if (el) el.inert = v; });
        if (v) { opener = document.activeElement; var c = $('.sheet-close'); if (c) c.focus(); return; }
        var back = opener; opener = null;
        if (href) Keys.land(href);
        else if (back && back.focus && document.contains(back)) { try { back.focus({ preventScroll: true }); } catch (e) { } }
      };
      if (menu) menu.addEventListener('click', function () { open(true); });
      if (sheet) {
        sheet.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a || e.target.closest('.sheet-close')) { open(false, a ? a.getAttribute('href') : null); self.set(true); } });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) open(false); });
        // Back and Forward leave the sheet standing over the new view with the page still locked, so close it on any route change
        window.addEventListener('hashchange', function () { if (!sheet.hidden) open(false); });
      }
      window.addEventListener('resize', function () { if (!narrow()) { open(false); self.set(true); } });
      // the turn's pause (WCAG 2.2.2: the specimen turns for as long as the page is open). One button, at the end of the plate
      // tag on a laptop and over the thumbnail's corner on a phone (src/styles.css .stage-pause); Stage.loop holds the turn while
      // Stage.still is set, and the choice is kept on this device. Reduced motion never turns the specimen, so it gets no button
      var tag = $('.stage-tag', this.el);
      if (!reduced && tag) {
        var still = false; try { still = localStorage.getItem('cp-still') === '1'; } catch (e) { }
        var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'stage-pause';
        var draw = function () {
          Stage.still = still;
          var say = still ? 'Resume the turn' : 'Pause the turn';
          pb.setAttribute('aria-label', say); pb.title = say;
          pb.innerHTML = still ? '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 1.5v9l7.5-4.5z"/></svg>' : '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z"/></svg>';
        };
        pb.addEventListener('click', function () { still = !still; try { localStorage.setItem('cp-still', still ? '1' : '0'); } catch (e) { } draw(); });
        draw(); tag.appendChild(pb);
      }
    },
    set: function (collapsed) {
      this.collapsed = collapsed;
      this.el.setAttribute('data-collapsed', collapsed ? '1' : '0');
      var t = $('.stage-toggle'); if (t) { t.textContent = collapsed ? 'Expand' : 'Collapse'; t.setAttribute('aria-expanded', collapsed ? 'false' : 'true'); }
      if (Stage.stripBalloons) Stage.stripBalloons(); // expanded, the strip numbers the parts of a drawing that has them
    }
  };

  /* ---------------- router ---------------- */
  var VIEWS = ['home', 'stack', 'chain', 'intro', 'walk', 'briefing', 'landscape', 'ai-chips', 'suppliers', 'geopolitics', 'controls', 'export-controls', 'thresholds', 'exposure', 'glossary', 'sources'];
  var ALIAS = { chain: 'stack', home: 'walk', intro: 'walk', briefing: 'walk', geopolitics: 'stack', thresholds: 'controls', sources: 'stack', 'export-controls': 'controls', 'ai-chips': 'landscape' }; // the tab names typed as routes land on their pages // the Sources page was retired; its sources sit at the end of each chapter // the licence-thresholds tab was retired; its route lands on the board
  var MODULE_VIEWS = {}; // modules register { activate(), stage: bool } per view through window.CP.register
  var Router = {
    current: null, from: null, places: {}, marks: 0, chain: null,
    init: function () {
      var self = this;
      // the reader's place in the chain, kept under the mark of the history entry it belongs to (route()). As Back or Forward leaves
      // an entry, the browser moves the page to the other entry's place (in the chapter still showing), and history.state is
      // already the other entry's, so that scroll is not taken for the reader's
      window.addEventListener('scroll', function () { if (self.current === 'stack' && self.place && (history.state || {}).cpPlace === self.place) self.places[self.place] = window.pageYOffset; }, { passive: true });
      window.addEventListener('hashchange', function () { self.route(); });
      // chapter links carry their static page as the href, for search engines, and the app's route in data-route: a plain
      // click stays in the app (a click on the route already showing lands it again); a new-tab click opens the static page
      document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[data-route]') : null;
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
        var r = a.getAttribute('data-route');
        if (r === location.hash) self.route(); else location.hash = r;
      });
      var wm = $('.wordmark'); // the wordmark always takes you back to the top of the stack
      if (wm) wm.addEventListener('click', function (e) { e.preventDefault(); if (location.hash && location.hash !== '#/') location.hash = '#/'; window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
      this.route();
    },
    route: function () {
      // an address of a chapter merged away lands in the merged chapter (src/preroute.js moved(), build/retired-chapters.js)
      var mv = window.CP_PRE && window.CP_PRE.moved ? window.CP_PRE.moved(location.hash) : '';
      if (mv) { try { history.replaceState(history.state, '', location.pathname + location.search + mv); } catch (e) { } }
      var h = location.hash || '#/', m = h.match(/^#\/([a-z-]+)/), bare = h.replace(/^#/, '');
      var atHome = bare === '' || bare === '/' || bare.indexOf('/?') === 0; // '#/?country=JP' is the home page with a query
      var v = (atHome || m) ? 'walk' : 'stack'; // the site opens on the walk (trial, 11 Sept 2026); an unknown #/route goes home; a bare chapter anchor opens the chain
      if (m && VIEWS.indexOf(m[1]) >= 0) v = m[1];
      var anchor = v === 'geopolitics' ? 'geopolitics' : ((!m && bare && !atHome) ? dec(bare) : null);
      if (anchor && !m) { // a bare anchor belongs to whichever view holds it; one that sits outside them all (the skip link's #app) leaves the view alone
        var target = document.getElementById(anchor), host = target && target.closest ? target.closest('.view[data-view]') : null;
        if (host) v = host.getAttribute('data-view');
        else if (target) v = this.current || v;
      }
      if (ALIAS[v]) v = ALIAS[v];
      var sub = null; // the Export Controls page has three sections
      if (v === 'exposure') { v = 'controls'; sub = 'exposure'; } else if (v === 'controls') sub = 'timeline';
      var em = h.match(/^#\/controls\/([^?#\/]+)/), evId = em ? dec(em[1]) : null; // #/controls/<event-id> opens the chronology on that entry
      var xm = h.match(/^#\/exposure\/([^?#\/]+)/), exId = xm ? dec(xm[1]).toLowerCase() : null; // #/exposure/<slug> opens the China revenue share panel on that firm's chart
      var changed = v !== this.current || sub !== this.currentSub;
      // The Chain shows one chapter at a time, at the chapter's own address: an anchor opens the chapter that holds it (a
      // section, a figure, a source, the chapter itself), and #/chain the contents. turned: The Chain now shows another one
      var chain = v === 'stack' ? this.chainOf(anchor) : this.chain, turned = v === 'stack' && chain !== this.chain;
      // The chain's address does not follow the scroll, so Back to it from another view (a card's China line, a search result)
      // or from another chapter would land on the chapter's top. Each history entry the chain serves takes a mark of its own
      // (history.state.cpPlace) and keeps the reader's place under it. A link or a tab makes a new entry, which has no mark, so
      // an arrival at a marked entry from another view, or at another entry's mark within The Chain, is Back or Forward, and the
      // reader goes back to that place. A route to the entry already showing (a search result for the address in view) keeps
      // its mark and lands as a link would. The walk keeps its own place (owns()).
      var backY = null;
      if (v === 'stack') {
        var mark = (history.state || {}).cpPlace;
        if (mark && (changed || mark !== this.place) && this.places[mark] != null) backY = this.places[mark];
        if (!mark) { mark = 'p' + Date.now().toString(36) + (++this.marks); try { history.replaceState({ cpPlace: mark }, ''); } catch (e) { mark = null; } }
        this.place = mark;
        this.chain = chain;
        document.documentElement.setAttribute('data-chain', chain); // src/template.html shows that one alone
      }
      this.from = this.current; // the walk reads this to tell a return from a step within it
      this.current = v; this.currentSub = sub;
      if (changed || turned) Sections.currentId = null; // a new view draws its own specimen on arrival: the chain its chapter's, AI Chips its package or chip
      if (sub) {
        $$('.view[data-view="controls"] .sub').forEach(function (s) { s.hidden = s.getAttribute('data-sub') !== sub; });
        $$('#controls-subtabs a').forEach(function (a) { if (a.getAttribute('data-sub') === sub) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }
      $$('.view').forEach(function (s) { s.hidden = s.getAttribute('data-view') !== v; });
      document.documentElement.setAttribute('data-view', v); // the chapter page's styles read it (src/modules/chapter.css: the stage beside the page goes on The Chain)
      if (v !== 'stack') Stage.host(null); // the drawing leaves a chapter's slot for the stage of the view it goes to
      Stage.place(v); // on the home the stage follows the marks that pick its specimen in the Tab order
      if (v !== 'stack') document.documentElement.classList.remove('slim-on', 'mast-up'); // the phone's slim bar and the raised masthead belong to The Chain
      // Until the first route the template's CSS showed the view the address names (read in <head> by src/preroute.js), so it
      // could paint while the page arrived. From here the hidden attributes decide. A reader who scrolled or tapped in that
      // time keeps their place: the first route neither returns them to the top nor jumps to the anchor (kept).
      var pre = window.CP_PRE || {}, first = !this.routed, kept = first && !!pre.touched;
      if (first) {
        document.documentElement.classList.add('booted');
        if (pre.view && pre.view !== v) console.warn('src/preroute.js showed "' + pre.view + '" while the page loaded, but the router opens "' + v + '" for ' + location.hash);
      }
      $$('.tabs a').forEach(function (a) { var dv = a.getAttribute('data-view'); var on = dv === v; if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      if (narrow()) { var strip = $('.tabs'), onTab = $('.tabs a[aria-current="page"]'); if (strip && onTab) { var sr = strip.getBoundingClientRect(), tr = onTab.getBoundingClientRect(); if (tr.left < sr.left) strip.scrollLeft -= sr.left - tr.left; else if (tr.right > sr.right) strip.scrollLeft += tr.right - sr.right; } } // the phone tab strip scrolls; keep the current tab in view by moving the strip alone (scrollIntoView would also move the Tab starting point to the tab, so the first Tab skipped the skip link)
      // the printed cover's art is fetched only on the way to print (src/template.html), never because The Chain was read
      var mv = MODULE_VIEWS[v];
      Stage.setVisible(v === 'stack' || v === 'landscape' || v === 'walk' || !!(mv && mv.stage));
      if (mv && mv.activate) { try { mv.activate(); } catch (err) { console.warn('view module failed', v, err); } }
      if (v === 'landscape') Landscape.activate();
      else if (v === 'suppliers') Suppliers.activate();
      else if (v === 'controls') { Controls.activate(); if (!Geo.built) Geo.build(); Geo.renderUpcoming(); } // the countdown is redrawn each visit, from that day
      // an entry's address (#/controls/<event-id>) opens and marks that entry; leaving it for the board's own address (the tab, a
      // link) is a new place too, so the mark goes, a By subject choice the entry set aside comes back, and the page starts at the top
      var leftEntry = v === 'controls' && !evId && !!this.evId, focused = false;
      if (v === 'controls' && !evId) { Geo.mark(null); if (Geo.modeBack) { var mb = Geo.modeBack; Geo.modeBack = null; Geo.setMode(mb, false); } }
      if (evId && v === 'controls') { focused = Geo.focusEvent(evId, !this.routed || changed); if (!focused) Geo.mark(null); }
      this.evId = v === 'controls' ? evId : null;
      // a firm's address (#/exposure/<slug>) lands on that firm's chart; the panel's own address (#/exposure, the tab) starts at the top again
      var leftFirm = sub === 'exposure' && !exId && !!this.exId;
      if (exId && sub === 'exposure') focused = Controls.focusFirm(exId, !this.routed || changed) || focused;
      this.exId = sub === 'exposure' ? exId : null;
      // no anchor to land on (or an entry address naming no entry), so start the new view at the top ("#/" included); a view that
      // places the page itself (the walk returning the reader to the step they left) says so through owns()
      var root = document.documentElement, sb = root.style.scrollBehavior;
      var jump = function (y) { root.style.scrollBehavior = 'auto'; window.scrollTo(0, y); root.style.scrollBehavior = sb; }; // html glides (styles.css); these are jumps
      if (turned && !anchor && backY === null && !kept) jump(0); // The Chain's contents, from a chapter: its top
      else if ((changed || leftEntry || leftFirm) && !anchor && !focused && backY === null && !kept && !(mv && mv.owns && mv.owns())) window.scrollTo(0, 0);
      if (v === 'stack' || v === 'walk') {
        if (backY !== null) { // Back or Forward to an entry of the chain: the place the reader left, at once
          jump(backY);
          this.booted = true;
        } else if (anchor) {
          var el = document.getElementById(anchor);
          if (el && !kept) {
            var jumpIt = !this.booted || changed || turned;
            scrollToEl(el, !jumpIt); // first load, a new view or another chapter: jump; within the chapter: glide
            if (jumpIt) this.settle(el);
          }
          this.booted = true;
        }
        Sections.update();
        // a link to another chapter hid the one it sat in, and with it the focus: the new chapter's title takes it (Keys.land
        // leaves alone a focus that is still on the page). Back and Forward return to a place, not to a heading
        if (turned && this.routed && backY === null) Keys.land(location.hash);
      }
      this.routed = true;
      this.title();
      // one page view per route change (the counter counts the first load itself)
      var gc = window.goatcounter;
      if (gc && gc.path) { var pth = gc.path(); if (this.counted === undefined) this.counted = pth; else if (pth !== this.counted && gc.count) { this.counted = pth; try { gc.count(); } catch (err) { } } }
    },
    /* the tab's title: the approved title of the matching static page (build/page-titles.json, through the cp-titles meta),
       and on The Chain the chapter in view, so the open chapters no longer all read "The Chain" */
    title: function () {
      if (!this.titles) { try { this.titles = JSON.parse(document.querySelector('meta[name="cp-titles"]').getAttribute('content')) || {}; } catch (e) { this.titles = {}; } }
      var T = this.titles, v = this.current, ch = v === 'stack' && this.chain !== 'contents' && Sections.currentId ? '/' + Sections.currentId + '/' : '';
      var page = { walk: '/', landscape: '/chips/', suppliers: '/suppliers/', controls: '/export-controls/', glossary: '/glossary/' }[v];
      document.title = (ch && T[ch]) || (page && T[page]) || (v === 'stack' ? 'The Chain · Chip Supply Chain' : T['/'] || 'Chip Supply Chain');
    },
    /* what The Chain shows for an anchor: the chapter that holds it, or the contents (#/chain, the contents' own ids, an id
       found nowhere) */
    chainOf: function (anchor) {
      var el = anchor ? document.getElementById(anchor) : null, ch = el && el.closest ? el.closest('article.chapter') : null;
      return ch && ch.closest('.view[data-view="stack"]') ? ch.id : 'contents';
    },
    /* a jump lands before the web fonts, late images and freshly built rows settle, and anything reflowing above the target
       moves it; for the next second or two, put it back whenever it has drifted, unless the reader has started to scroll or gone elsewhere */
    settle: function (el) {
      // each settle takes a number, and a newer one retires the older: a Glossary passage link settles the passage after the
      // router has settled its chapter, and the chapter must not pull the page back to its top (correctness P1-1)
      var self = this, gen = this.settleGen = (this.settleGen || 0) + 1;
      var moved = false, h0 = location.hash, mark = function () { moved = true; };
      ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, mark, { passive: true, once: true }); });
      var again = function () {
        if (gen !== self.settleGen || moved || location.hash !== h0 || !document.contains(el) || el.closest('[hidden]')) return;
        if (Math.abs(el.getBoundingClientRect().top - landAt(el)) > 2) scrollToEl(el, false);
      };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(again, 30); });
      if (document.readyState !== 'complete') window.addEventListener('load', function () { setTimeout(again, 30); }, { once: true });
      setTimeout(again, 400); setTimeout(again, 1200);
    }
  };

  /* ---------------- section tracking (stack view) ---------------- */
  var Sections = {
    items: [], walkItems: [], currentId: null, heroBottom: 0, hold: null,
    init: function () {
      var self = this;
      // each view's own (.view: <html> carries data-view too, so a bare [data-view] would take in the whole page)
      this.items = $$('.view[data-view="stack"] [data-specimen]');
      this.walkItems = $$('.view[data-view="walk"] [data-specimen]');
      window.addEventListener('scroll', function () { self.update(); }, { passive: true });
      window.addEventListener('resize', function () { self.update(); });
      $('.to-top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
      var stageTop = $('.stage-top'); if (stageTop) stageTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }); // on phones Top lives in the bottom strip, clear of the text
      this.update();
    },
    update: function () {
      var toTop = $('.to-top'); // Back to top (and the phone strip's Top button, which follows it) on every long page, not only the chain
      if (toTop) {
        var contentsEl = Router.current === 'stack' && Router.chain === 'contents' ? $('#contents') : null;
        toTop.setAttribute('data-show', (contentsEl ? contentsEl.getBoundingClientRect().bottom < 0 : window.scrollY > window.innerHeight * 0.8) ? '1' : '0');
      }
      if (Router.current !== 'stack' && Router.current !== 'walk') return;
      var items = Router.current === 'walk' ? this.walkItems : this.items;
      if (!items || !items.length) return; // before init, or a view with nothing to track
      var vh = window.innerHeight, probe = narrow() ? vh * 0.55 : vh * 0.42, best = null, bestTop = -Infinity;
      var first = null;
      for (var i = 0; i < items.length; i++) {
        var r = items[i].getBoundingClientRect();
        if (!r.width && !r.height) continue; // not laid out (The Chain shows one chapter; ?only= hides the others): its top reads 0 and would win
        if (!first) first = items[i];
        if (r.top <= probe && r.top > bestTop) { best = items[i]; bestTop = r.top; }
      }
      if (!best) best = first || items[0];
      // a pick in the home hero's list (src/modules/walk.js sets hold) keeps the hero on the stage while any of the hero is on
      // screen, so the row marked in wine is always the specimen shown, even once the walk's first step has crossed the probe
      if (this.hold) { var hb = this.hold.getBoundingClientRect().bottom; if (Router.current === 'walk' && hb > cssPx('--masthead') + 24) best = this.hold; else this.hold = null; }
      if (!best) return;
      // The Chain's contents show no chapter: the phone's strip shows the first chapter's specimen, and no chapter is in view
      var none = !first && Router.current === 'stack';
      var r2 = best.getBoundingClientRect();
      var p = r2.height > vh ? Math.max(0, Math.min(1, (probe - r2.top) / (r2.height - vh * 0.3))) : 0;
      Stage.scrollAngle = (reduced ? 0 : p * 1.15);
      // on a wide screen The Chain's drawing stands in the chapter's own slot under its opener, whichever slot is in view
      // (src/modules/chapter.css .ch-spec-draw); on a phone it stays in the strip and follows the chapter, as before
      var inSlot = Router.current === 'stack' && !narrow();
      if (inSlot) this.hostSpec(); else if (Stage.hostEl) Stage.host(null);
      var id = none ? null : best.id || best.getAttribute('data-specimen');
      // the home hero keeps one id while the reader picks its specimen (src/modules/walk.js), so the specimen it names counts too
      var key = id + '|' + (best.getAttribute('data-specimen') || '');
      if (id !== this.currentId || key !== this.currentKey) {
        this.currentId = id; this.currentKey = key;
        if (Router.current === 'stack') Router.title();
        var num = best.getAttribute('data-number');
        if (!inSlot) Stage.show(best.getAttribute('data-specimen'), null, this.caption(best),
          num ? 'Specimen <b>' + num + '</b> · ' + esc(best.getAttribute('data-title') || '') : 'Specimen <b>00</b> · the whole chip');
        // a phone builds only the next two specimens ahead of the reader (a wide screen queues them all at boot)
        if (narrow()) {
          var ahead = [];
          for (var j = items.indexOf(best) + 1; j < items.length && ahead.length < 2; j++) { var nm = items[j].getAttribute('data-specimen'); if (nm && nm !== best.getAttribute('data-specimen') && ahead.indexOf(nm) < 0) ahead.push(nm); }
          Stage.soon(ahead);
        }
      }
      Rail.update();
    },
    // the caption the stage shows for an item: its own words, and on The Chain the parts list under them (the phone's strip
    // shows it once expanded)
    caption: function (item) {
      var c = item.getAttribute('data-caption') ? esc(item.getAttribute('data-caption')) : null;
      var parts = Router.current === 'stack' ? $('.ch-spec .ch-parts', item) : null, k = parts ? $('.ch-spec .ch-parts-k', item) : null;
      return c && parts ? c + '<span class="stage-parts">' + (k ? k.outerHTML : '') + parts.outerHTML + '</span>' : c;
    },
    // the chapter's slot that is most in view takes the drawing, and the drawing becomes that chapter's specimen
    hostSpec: function () {
      var slots = this.slots || (this.slots = $$('.view[data-view="stack"] .ch-spec-draw'));
      var vh = window.innerHeight, top = cssPx('--masthead'), best = null, most = 0;
      for (var i = 0; i < slots.length; i++) {
        var r = slots[i].getBoundingClientRect();
        if (!r.height) continue;
        var v = Math.min(r.bottom, vh) - Math.max(r.top, top);
        if (v > most) { most = v; best = slots[i]; }
      }
      if (!best || best === Stage.hostEl) return;
      var ch = best.closest('article.chapter');
      if (!ch) return;
      Stage.host(best);
      var num = ch.getAttribute('data-number');
      Stage.show(ch.getAttribute('data-specimen'), null, this.caption(ch), 'Specimen <b>' + num + '</b> · ' + esc(ch.getAttribute('data-title') || ''));
      Stage.balloonsSnap = true;
    }
  };

  /* ---------------- the chapter's contents rail and the phone's slim bar (redesign stage 2) ----------------
     The rail's On this page marks the section the reader is in (src/modules/chapter.css .rail-toc a[aria-current]). On a phone
     the masthead goes up as the reader scrolls down a chapter and comes back as they scroll up, and once the opener has gone a
     slim bar at the top names the chapter and the section (.ch-slim, a link to the chapter's top). */
  var Rail = {
    slim: null, lastY: 0,
    update: function () {
      var html = document.documentElement, y = window.pageYOffset;
      var ch = Router.current === 'stack' && Sections.currentId ? document.getElementById(Sections.currentId) : null;
      if (!ch || !ch.classList || !ch.classList.contains('chapter')) { this.set(null); html.classList.remove('mast-up'); this.lastY = y; return; }
      if (!ch._rail) ch._rail = $$('.rail-toc a', ch).map(function (a) { return [a, document.getElementById(dec(a.getAttribute('href').slice(1)))]; }).filter(function (x) { return x[1]; });
      var line = Math.max(window.innerHeight * 0.3, headerH() + 40), cur = null;
      ch._rail.forEach(function (x) { if (x[1].getBoundingClientRect().top < line) cur = x; });
      if (ch._railCur !== cur) { if (ch._railCur) ch._railCur[0].removeAttribute('aria-current'); if (cur) cur[0].setAttribute('aria-current', 'location'); ch._railCur = cur; }
      if (!narrow()) { this.set(null); html.classList.remove('mast-up'); this.lastY = y; return; }
      var open = $('.ch-open', ch), past = open && open.getBoundingClientRect().bottom < 0;
      this.set(past ? ch : null, cur);
      // the masthead: up while the reader scrolls down past the top of the page, back as soon as they scroll up
      var dy = y - this.lastY;
      // a jump (a link, a search result, the page landing on an anchor) moves hundreds of pixels at once: the masthead stays
      if (y < 200 || $('#sheet:not([hidden])') || Math.abs(dy) > 320) html.classList.remove('mast-up');
      else if (dy > 6) html.classList.add('mast-up');
      else if (dy < -6) html.classList.remove('mast-up');
      if (Math.abs(dy) > 6 || y < 200) this.lastY = y;
    },
    set: function (ch, cur) {
      var html = document.documentElement;
      if (!ch) { html.classList.remove('slim-on'); return; }
      if (!this.slim) {
        this.slim = document.createElement('a'); this.slim.className = 'ch-slim';
        this.slim.innerHTML = '<span class="n"></span><span class="t"></span><span class="s"></span>';
        document.body.appendChild(this.slim);
      }
      var a = this.slim;
      if (a.getAttribute('href') !== '#' + ch.id) {
        a.setAttribute('href', '#' + ch.id);
        a.setAttribute('aria-label', 'Back to the top of ' + (ch.getAttribute('data-title') || ''));
        $('.n', a).textContent = ch.getAttribute('data-number') || '';
        $('.t', a).textContent = ch.getAttribute('data-title') || '';
      }
      $('.s', a).textContent = cur ? cur[0].textContent : '';
      html.classList.add('slim-on');
    }
  };

  /* ---------------- AI chips: the timeline, the tick list, and two to four chips side by side ----------------
     Design round five, option B "the tick list" (qa/design5/ai-chips/a/B-tick-list.html in the main checkout, chosen 27 Oct
     2026). The timeline opens the page: every chip at the month it was announced, against one measure the reader picks, or the
     same chips ranked highest first. Rule B: the largest value is the one solid ink mark and the rest take the light tint.
     Beside it a rail holds all 38 chips by maker, each with a box to tick, and at its foot the live specimen. Choosing is
     deliberate: a click, a tap, a hover or a key on the chart only opens the chip's card, and a chip joins the comparison only
     by its box in the list or the box on its card (or a suggested pair, or Try with, which say so). Each ticked chip keeps its
     number, 1 to 4, while it stays in. The comparison sets one row per chip: the figures as one table, read down a column,
     then the makers and parts, the packages at one scale, and the rest in words. The ticks, the measure and the view live in
     the address (#/landscape?pick=a,b&measure=mem&view=rank), written in place, so a reload or a shared link opens on them and
     Back and Forward move between pages, each keeping its own ticks. On a phone the rail opens as a sheet from the bottom and
     a tray under the masthead carries the ticked chips. The ring and the number on a ticked chip's dot, its box and its
     row's badge are the reader's own selection, so they take red wine; no data value ever does. A maker's country is a plain
     label. src/modules/chips.css styles it. */
  var Landscape = {
    chips: DATA.landscape || [],
    notes: DATA.landscapeNotes || {},
    compare: DATA.landscapeCompare || { pairs: [], with: {} }, // data/landscape-compare.json: the suggested pairs, each chip's Try with partners
    max: 4,
    picked: [],       // the ticked chip ids, in the order of their numbers
    no: {},           // each ticked chip's number, 1 to 4: a chip keeps it while it stays in, and the next tick takes the lowest free one
    sel: null,        // the chip on the stage: the last ticked, or the one the reader put there; its notes open
    open: null,       // the chip whose card is open on the chart (looking is never choosing)
    crowdIds: null,   // the chips a tap where dots crowd has listed
    measure: 'fp16',  // the chart's measure (MEAS)
    view: 'year',     // the chart: 'year' (the timeline) or 'rank' (highest first)
    built: false,
    hint: '',         // a refusal, said in the list's foot until the next change
    said: '',         // the ticks last read out by the live region, so each change is announced once
    exportRows: [],   // the ticked chips, as the copy line copies them
    chartFocus: null, // the dot that holds the chart's one Tab stop (arrow keys move it)
    pts: [],          // the dots as drawn: { id, cx, cy }, for a tap where they crowd

    /* ---- data ---- */
    byId: function (id) { for (var i = 0; i < this.chips.length; i++) if (this.chips[i].id === id) return this.chips[i]; return null; },
    selection: function () { var self = this, out = []; this.picked.forEach(function (id) { var c = self.byId(id); if (c) out.push(c); }); return out; },
    initSelection: function () { this.picked = []; this.no = {}; this.sel = null; this.syncExport(); }, // the page opens with nothing ticked: the list is the first state
    syncExport: function () { var rows = this.selection(); this.exportRows.length = 0; for (var i = 0; i < rows.length; i++) this.exportRows.push(rows[i]); },
    short: function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); }, // "H100 (SXM5)" reads "H100" in the list, the pairs and the rows' second mentions
    year: function (c) { return c.announced ? String(c.announced).slice(0, 4) : ''; },
    metaLine: function (c) { return [c.vendor, cname(c.vendorCountry), this.year(c)].filter(Boolean).join(' · '); },
    names: function (ids) { var self = this, n = ids.map(function (id) { var c = self.byId(id); return c ? self.short(c) : id; }); return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1]; },
    WORD: ['no', 'one', 'two', 'three', 'four'],
    // a figure as the data gives it: every digit kept, thousands grouped (2.039 stays 2.039, 43200 reads 43,200)
    nf: function (v) { var t = String(v), neg = t.charAt(0) === '-', p = (neg ? t.slice(1) : t).split('.'); return (neg ? '-' : '') + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); },
    nfAxis: function (v) { return (Math.round(v * 100) / 100).toLocaleString('en-US'); }, // an axis tick is not a figure from the data, so it may be rounded
    // the list's order, and the order of the makers: countries as they first appear, China last; one group per maker, chips in data order
    ordered: function () {
      var ccs = [], by = {}, out = [];
      this.chips.forEach(function (c) { var cc = c.vendorCountry || '??'; if (!by[cc]) { by[cc] = { vs: [], v: {} }; ccs.push(cc); } if (!by[cc].v[c.vendor]) { by[cc].v[c.vendor] = []; by[cc].vs.push(c.vendor); } by[cc].v[c.vendor].push(c); });
      ccs.sort(function (a, b) { return (a === 'CN') - (b === 'CN'); });
      ccs.forEach(function (cc) { by[cc].vs.forEach(function (v) { out.push({ cc: cc, vendor: v, chips: by[cc].v[v] }); }); });
      return out;
    },

    /* ---- the comparison's rows. label and hint lead each row: build/modules/reference-pages.js reads them in that order for
       /chips/. A part that is missing is said ("node not published", "assembler not published"), never left blank. \u0001 marks
       where the row's source mark goes when it is not on the first line ---- */
    rows: [
      { label: 'Vendor', hint: ['product page', 'press release', 'corporate'], key: 'vendor', text: function (c) { return esc(c.vendor) + '<span class="cx-2">' + esc(cname(c.vendorCountry)) + '</span>'; } },
      { label: 'Availability', hint: ['product page', 'press release', 'spec table'], key: 'status', text: function (c) { return c.status ? esc(c.status) + (c.shipping ? '<span class="cx-2">from ' + esc(c.shipping) + '</span>' : '') : null; } },
      { label: 'Built for', hint: ['product page', 'blog', 'documentation'], key: 'target', text: function (c) { return c.target ? esc(c.target) : null; } },
      { label: 'Foundry, process node', hint: ['architecture', 'deep dive', 'white paper', 'documentation'], key: 'process', text: function (c) { var p = c.process || {}; if (!p.foundry && !p.node) return null; return (p.foundry ? esc(p.foundry) : '<span class="cx-nil">foundry not published</span>') + '<span class="cx-2">' + (p.node ? esc(p.node) + (p.foundry ? '' : '\u0001') : 'node not published') + (p.country ? ' · ' + esc(cname(p.country)) : '') + '</span>'; } },
      { label: 'Package', hint: ['cowos', 'packag', 'deep dive', 'architecture'], key: 'package', text: function (c) { var p = c.package || {}; if (!p.type && !p.assembler) return null; return (p.type ? esc(p.type) : '<span class="cx-nil">type not published</span>') + '<span class="cx-2">' + (p.assembler ? 'assembled by ' + esc(p.assembler) + (p.type ? '' : '\u0001') : 'assembler not published') + '</span>'; } },
      { label: 'Memory type', hint: ['hbm', 'micron', 'memory', 'datasheet'], key: 'memtype', text: function (c) { var m = c.memory || {}; return m.type ? esc(m.type) + (m.stacks ? '<span class="cx-2">' + m.stacks + ' stacks</span>' : '') : null; } },
      // each supplier carries the source that names it (supSources), and a supplier no source names carries no mark
      { label: 'Memory supplier', hint: [], key: 'memsup', own: true, text: function (c) { return Landscape.supHTML(c, false); } },
      { label: 'Speed at FP16, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], key: 'fp16', short: 'Speed at FP16', unit: 'TFLOPS', num: function (c) { return (c.compute || {}).fp16TFLOPS; }, fmt: 'fp16' },
      { label: 'Speed at FP8, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], key: 'fp8', short: 'Speed at FP8', unit: 'TFLOPS', num: function (c) { return (c.compute || {}).fp8TFLOPS; }, fmt: 'fp8' },
      { label: 'Speed at FP4, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], key: 'fp4', short: 'Speed at FP4', unit: 'TFLOPS', num: function (c) { return (c.compute || {}).fp4TFLOPS; }, fmt: 'fp4' },
      { label: 'Memory, gigabytes', hint: ['spec table', 'datasheet', 'product page'], key: 'mem', short: 'Memory', unit: 'gigabytes', num: function (c) { return (c.memory || {}).capacityGB; } },
      { label: 'Bandwidth, terabytes/s', hint: ['spec table', 'datasheet', 'product page'], key: 'bw', short: 'Bandwidth', unit: 'terabytes a second', num: function (c) { return (c.memory || {}).bandwidthTBs; } },
      { label: 'Power, watts', hint: ['spec table', 'datasheet', 'product page'], key: 'tdp', short: 'Power', unit: 'watts', num: function (c) { return c.tdpW; } },
      { label: 'Transistors, billion', hint: ['architecture', 'deep dive', 'white paper'], key: 'transistors', short: 'Transistors', unit: 'billion', num: function (c) { return (c.die || {}).transistorsB; } },
      { label: 'Logic dies', hint: ['architecture', 'deep dive', 'white paper'], key: 'dies', short: 'Logic dies', unit: 'count', num: function (c) { return (c.die || {}).count; } },
      { label: 'Area of each die, square millimeters', hint: ['architecture', 'deep dive', 'white paper'], key: 'area', short: 'Area of each die', unit: 'square millimeters', num: function (c) { return (c.die || {}).areaMm2Each; } },
      { label: 'Chip-to-chip links', hint: ['architecture', 'deep dive', 'white paper'], key: 'c2c', long: true, text: function (c) { return (c.interconnect || {}).chipToChip ? esc(c.interconnect.chipToChip) : null; } },
      { label: 'Scale-up, in one rack', hint: ['nvl', 'rack', 'system', 'deep dive', 'spec table'], key: 'scale', long: true, text: function (c) { return (c.interconnect || {}).scaleUp ? esc(c.interconnect.scaleUp) : null; } },
      { label: 'Price estimate', hint: ['price', 'semianalysis', 'rack', 'press release'], key: 'price', long: true, text: function (c) { return c.priceEstimate ? esc(c.priceEstimate) : null; } },
      { label: 'Cost to make, estimate', hint: ['cost', 'semianalysis'], key: 'bom', long: true, text: function (c) { return c.bomEstimate ? esc(c.bomEstimate) : null; } },
      { label: 'Export-control status', hint: ['federal register', 'entity list', 'institute for progress', 'mofcom'], key: 'export', long: true, text: function (c) { return c.exportStatus ? esc(c.exportStatus) : null; } }
    ],
    row: function (key) { if (!this._rk) { var m = {}; this.rows.forEach(function (r) { m[r.key] = r; }); this._rk = m; } return this._rk[key]; },
    FIGS: ['fp16', 'fp8', 'fp4', 'mem', 'bw', 'tdp', 'transistors', 'dies', 'area'],
    PARTS: ['process', 'package', 'memtype', 'memsup'],
    WORDS: ['status', 'target', 'c2c', 'scale', 'price', 'bom', 'export'],
    MEAS: [['fp16', 'Speed at FP16'], ['fp8', 'Speed at FP8'], ['fp4', 'Speed at FP4'], ['mem', 'Memory'], ['bw', 'Bandwidth'], ['tdp', 'Power']],
    TFLOPS_SENTENCE: 'TFLOPS counts trillions of calculations a second. FP16, FP8 and FP4 are number formats that use 16, 8 and 4 bits per number. The fewer the bits, the more calculations a chip can do.',
    DIES_SENTENCE: 'The logic dies are the pieces of silicon that do the computing, and the memory stacks feed them data. The interposer is the layer of wiring that connects the two, and the substrate is the small circuit board underneath.',

    /* ---- source marks. The chip's sources are not tagged per field, so the row's subject is matched against their labels (as
       /chips/ does): the first source whose label carries one of the row's words. A mark is the number of that source in the
       chip's list under Notes and sources, a link to it that opens the site's source card (Cite); where nothing in the list is
       about the row, "all" goes to the chip's whole list ---- */
    srcIndex: function (c, row) {
      var srcs = c.sources || [], hints = row.hint || [];
      for (var h = 0; h < hints.length; h++) for (var i = 0; i < srcs.length; i++) if ((srcs[i].label || '').toLowerCase().indexOf(hints[h]) >= 0) return i;
      return -1;
    },
    markAt: function (c, i) {
      var s = (c.sources || [])[i]; if (!s) return '';
      var l = s.label || s.url;
      return '<sup class="cite"><a href="' + safeUrl(s.url) + '" target="_blank" rel="noopener" data-t="' + esc(l) + '" aria-label="Source ' + (i + 1) + ', ' + esc(l) + '">' + (i + 1) + '</a></sup>';
    },
    // card: true on a dot's card, whose chip may not be in the comparison, so "all" opens the chip's sources on /chips/
    cite: function (c, row, card) {
      var srcs = c.sources || []; if (!srcs.length) return '';
      var i = this.srcIndex(c, row);
      if (i >= 0) return this.markAt(c, i);
      if (card) return '<sup class="cite cx-all"><a href="/chips/#' + esc(c.id) + '-sources" target="_blank" rel="noopener" data-t="All the sources for the ' + esc(c.name) + '" aria-label="All the sources for the ' + esc(c.name) + '">all</a></sup>';
      return '<sup class="cite cx-all"><button type="button" data-notes="' + esc(c.id) + '" aria-label="All sources for the ' + esc(c.name) + '">all</button></sup>';
    },
    // the sources that name a memory supplier: first the chip's notes, where a sentence that names the supplier and its memory
    // carries a citation; then a source whose label names the supplier (not the chip's own maker, whose name heads every one of
    // its own pages). Among them, one whose label also names the chip comes first. None found: no mark
    supSources: function (c, sup) {
      var srcs = c.sources || [], at = {}, low = String(sup).toLowerCase(), found = [];
      srcs.forEach(function (x, i) { at[x.url] = i; });
      String(this.notes[c.id] || '').split(/\.\s+/).forEach(function (sent) {
        var plain = sent.replace(/<[^>]+>/g, '');
        if (plain.toLowerCase().indexOf(low) < 0 || !/HBM|memory|stack/i.test(plain)) return;
        sent.replace(/<a href="([^"]+)"/g, function (m, u) { u = u.replace(/&amp;/g, '&'); if (at[u] != null && found.indexOf(at[u]) < 0) found.push(at[u]); return m; });
      });
      if (!found.length && sup !== c.vendor) srcs.forEach(function (x, i) { if ((x.label || '').toLowerCase().indexOf(low) >= 0) found.push(i); });
      var tag = this.short(c).toLowerCase(), named = found.filter(function (i) { return (srcs[i].label || '').toLowerCase().indexOf(tag) >= 0; });
      return named.concat(found.filter(function (i) { return named.indexOf(i) < 0; }));
    },
    supHTML: function (c) {
      var self = this, s = (c.memory || {}).suppliers || [];
      return s.length ? s.map(function (x) { var k = self.supSources(c, x); return esc(x) + (k.length ? self.markAt(c, k[0]) : ''); }).join(', ') : null;
    },
    // what is missing: a speed format the chip does not run is "not supported", anything else "not published"
    nilKind: function (c, row) {
      var t = row.num ? row.num(c) : row.text(c);
      if (t != null && t !== '') return '';
      var sup = row.fmt ? ((c.compute || {}).support || {})[row.fmt] : null;
      return sup === 'no' ? 'not supported' : 'not published';
    },
    nil: function (c, row) { var k = this.nilKind(c, row); return '<span class="cx-nil' + (k === 'not supported' ? ' cx-nil--no' : '') + '">' + k + '</span>'; },
    // the one thing to say for a whole row when no ticked chip has it, or '' when at least one does (or the reasons differ)
    allNil: function (row, sel) { if (!sel.length) return ''; var k = this.nilKind(sel[0], row); if (!k) return ''; for (var i = 1; i < sel.length; i++) if (this.nilKind(sel[i], row) !== k) return ''; return k; },
    allSaid: function (k, n) { var who = n === 2 ? 'either chip' : 'any of these ' + this.WORD[n] + ' chips'; return (k === 'not supported' ? 'Not supported by ' : 'Not published for ') + who; },
    // the rows left out of a table because no ticked chip has them, said once in a sentence under it
    saidOnce: function (keys, sel) {
      var self = this, n = sel.length; if (!keys.length || n < 2) return '';
      var by = { 'not published': [], 'not supported': [] };
      keys.forEach(function (k) { var r = self.row(k), s = r.short || r.label; by[self.allNil(r, sel)].push('the ' + (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s)); });
      var join = function (l) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1]; }, cap = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
      var who = n === 2 ? 'either chip' : 'any of these ' + this.WORD[n] + ' chips', out = [];
      if (by['not published'].length) out.push(cap(join(by['not published'])) + (by['not published'].length > 1 ? ' are' : ' is') + ' not published for ' + who + '.');
      if (by['not supported'].length) out.push(cap(join(by['not supported'])) + (by['not supported'].length > 1 ? ' are' : ' is') + ' not supported by ' + who + '.');
      return out.join(' ');
    },
    rowMax: function (row, sel) { var max = 0, n = 0; sel.forEach(function (c) { var v = row.num(c); if (typeof v === 'number') { n++; if (v > max) max = v; } }); return { max: max, n: n }; },
    // a figure with its marks, then (two or more figures in the row) its bar in rule B: ink for the largest, the tint for the rest.
    // As before, every figure equal to the largest is set bold, ties included
    numCell: function (c, row, sel, after) {
      var v = row.num(c); if (v == null) return this.nil(c, row);
      var m = this.rowMax(row, sel), top = m.n > 1 && v === m.max && m.max > 0;
      return '<span class="cx-vl"><span class="cx-v' + (top ? ' is-top' : '') + '">' + esc(this.nf(v)) + '</span>' + (after || '') + this.cite(c, row) + '</span>' +
        (m.n > 1 && m.max > 0 ? '<span class="cx-bar' + (top ? ' is-top' : '') + '" aria-hidden="true"><i style="width:' + Math.max(1.5, v / m.max * 100).toFixed(1) + '%"></i></span>' : '');
    },
    textCell: function (c, row) {
      var t = row.text(c); if (t == null || t === '') return this.nil(c, row);
      var mk = row.own ? '' : this.cite(c, row);
      if (t.indexOf('\u0001') >= 0) return '<span class="cx-t">' + t.replace('\u0001', mk) + '</span>';
      var at = t.indexOf('<span class="cx-2">');
      return '<span class="cx-t">' + (at >= 0 ? t.slice(0, at) + mk + t.slice(at) : t + mk) + '</span>'; // the mark sits on the value, before its second line
    },
    cell: function (c, row, sel, after) { return row.num ? this.numCell(c, row, sel, after) : this.textCell(c, row); },
    // the speed notes are lettered a to d in the order of the chips, and each speed figure carries its chip's letter
    LET: 'abcd',
    speedNotes: function (sel) { var list = []; sel.forEach(function (c) { var n = (c.compute || {}).precisionNote; if (n) list.push({ c: c, n: n }); }); return list; },
    letter: function (c, sel) {
      var l = this.speedNotes(sel);
      for (var j = 0; j < l.length; j++) if (l[j].c.id === c.id) return '<sup class="cx-fnl"><a href="#cx-sn-' + esc(c.id) + '" aria-label="Note ' + this.LET.charAt(j) + ', how the ' + esc(this.short(c)) + '’s speed figures are measured">' + this.LET.charAt(j) + '</a></sup>';
      return '';
    },

    /* ---- the ticks ---- */
    freeNo: function () { var used = {}, self = this; this.picked.forEach(function (id) { used[self.no[id]] = 1; }); for (var k = 1; k <= this.max; k++) if (!used[k]) return k; return 0; },
    renumber: function () { var self = this; this.no = {}; this.picked.forEach(function (id, i) { self.no[id] = i + 1; }); },
    noOf: function (id) { return this.no[id] || 0; },
    add: function (id) {
      if (!this.byId(id) || this.picked.indexOf(id) >= 0) return false;
      if (this.picked.length >= this.max) { this.hint = 'The comparison holds four chips. Untick one to add another.'; this.render(); this.announce(this.hint); return false; }
      var self = this;
      this.no[id] = this.freeNo(); this.picked.push(id); this.picked.sort(function (a, b) { return self.no[a] - self.no[b]; });
      this.sel = id; this.hint = ''; this.render(); return true;
    },
    remove: function (id) {
      var at = this.picked.indexOf(id); if (at < 0) return;
      this.picked.splice(at, 1); delete this.no[id];
      if (this.sel === id) this.sel = this.picked[this.picked.length - 1] || null;
      this.hint = ''; this.render();
    },
    toggle: function (id) { if (this.picked.indexOf(id) >= 0) this.remove(id); else this.add(id); },
    setPair: function (ids) { var self = this; this.picked = ids.filter(function (id) { return self.byId(id); }).slice(0, this.max); this.renumber(); this.sel = this.picked[0] || null; this.hint = ''; this.render(); },
    clear: function () { this.picked = []; this.no = {}; this.sel = null; this.hint = ''; this.render(); },
    focus: function (id) { if (this.picked.indexOf(id) < 0 || this.sel === id) { this.stageNow(); return; } this.sel = id; this.render(); }, // a ticked chip's package or notes puts it on the stage
    select: function (id) { this.openCard(id, { show: true }); }, // the old name, for any caller left: a chip found elsewhere opens its card and adds nothing
    announce: function (msg) { var el = $('#cxa-live'); if (!el) return; el.textContent = ''; setTimeout(function () { el.textContent = msg; }, 50); },
    announceChange: function () { // one message per change of the ticks, whichever control made it
      var key = this.picked.join(','); if (key === this.said) return;
      var was = this.said ? this.said.split(',') : [], now = this.picked;
      this.said = key;
      var added = now.filter(function (x) { return was.indexOf(x) < 0; }), gone = was.filter(function (x) { return now.indexOf(x) < 0; });
      var lead = !now.length ? 'No chips ticked.' : added.length && !gone.length ? this.names(added) + ' ticked.' : gone.length && !added.length ? this.names(gone) + ' unticked.' : 'Now ' + this.names(now) + '.';
      this.announce(lead + (now.length ? ' ' + now.length + ' of 4 ticked.' : ''));
    },

    /* ---- the address: #/landscape?pick=a,b&measure=mem&view=rank. A pick in the address sets the ticks, in the order of their
       numbers (a shared link, a reload, Back and Forward). An address with no pick (the tab, a search result) keeps the reader's
       ticks and writes them back in. Every change is written in place, so the history holds pages, not ticks ---- */
    readAddress: function () {
      var h = location.hash || '', at = h.indexOf('?'), got = {}, self = this;
      if (at >= 0) h.slice(at + 1).split('&').forEach(function (p) { var i = p.indexOf('='); if (i > 0) got[p.slice(0, i)] = dec(p.slice(i + 1)); });
      if (got.pick != null) {
        var ids = got.pick.split(',').filter(function (id, i, a) { return self.byId(id) && a.indexOf(id) === i; }).slice(0, this.max);
        if (ids.join() !== this.picked.join()) { this.picked = ids; this.renumber(); if (ids.indexOf(this.sel) < 0) this.sel = ids[0] || null; this.hint = ''; }
      }
      if (got.measure && this.MEAS.some(function (m) { return m[0] === got.measure; })) this.measure = got.measure;
      if (got.view === 'rank' || got.view === 'year') this.view = got.view;
    },
    route: function () {
      var q = [];
      if (this.picked.length) q.push('pick=' + this.picked.map(encodeURIComponent).join(','));
      if (this.measure !== 'fp16') q.push('measure=' + this.measure);
      if (this.view === 'rank') q.push('view=rank');
      return '#/landscape' + (q.length ? '?' + q.join('&') : '');
    },
    writeAddress: function () {
      if (Router.current !== 'landscape') return;
      var want = this.route();
      if (location.hash !== want) { try { history.replaceState(history.state, '', location.pathname + location.search + want); } catch (e) { } }
    },
    shareURL: function () { var canon = $('link[rel="canonical"]'), base = canon && /^https?:/.test(canon.href) ? canon.href.replace(/#.*$/, '') : location.href.replace(/#.*$/, ''); return base + this.route(); },

    /* ---- lifecycle ---- */
    activate: function () {
      this._staged = null; // the stage showed another view's specimen while the reader was away
      this.readAddress();
      if (!this.built) this.buildUI();
      this.closeCard(false, true);
      this.listOpen(false, true);
      this.hostStage();
      this.render();
    },
    // a wide screen draws the specimen at the foot of the list, in .aic-spec-draw; a phone keeps it in the strip at the foot of the
    // screen. The router hands the canvas back to the stage on every route (Router.route), so this runs on each arrival and resize
    hostStage: function () {
      if (Router.current !== 'landscape' || !Stage.ok) return;
      var el = $('.aic-spec-draw');
      if (el && !narrow()) { if (Stage.hostEl !== el) Stage.host(el); }
      else if (Stage.hostEl) Stage.host(null);
    },
    buildUI: function () {
      this.built = true;
      var self = this;
      this.buildList();
      var ms = $('#cx-measures');
      if (ms) {
        ms.innerHTML = this.MEAS.map(function (m) { return '<button type="button" class="aic-pill sm" data-m="' + m[0] + '" aria-pressed="false">' + esc(m[1]) + '</button>'; }).join('');
        ms.addEventListener('keydown', function (e) { self.arrows(e, $$('button', ms)); });
      }
      var vw = $('#cx-view');
      if (vw) vw.innerHTML = '<button type="button" class="aic-pill sm" data-v="year" aria-pressed="false">By year</button><button type="button" class="aic-pill sm" data-v="rank" aria-pressed="false">Highest first</button>';
      // the chart: a hover or a focus shows a tip; a click, a tap, Enter or Space opens the chip's card; arrows walk the dots by date
      var chart = $('#cx-chart'), tip = $('#cx-tip');
      chart.addEventListener('mouseover', function (e) { var g = e.target.closest('.pt'); if (g) self.showTip(g); });
      chart.addEventListener('mouseout', function (e) { var g = e.target.closest('.pt'); if (g && !g.contains(e.relatedTarget) && tip) tip.hidden = true; });
      chart.addEventListener('focusin', function (e) { var g = e.target.closest('.pt'); if (g) { self.chartFocus = g.getAttribute('data-id'); self.showTip(g); } });
      chart.addEventListener('focusout', function () { if (tip) tip.hidden = true; });
      chart.addEventListener('keydown', function (e) {
        var g = e.target.closest('.pt'); if (!g) return;
        var k = e.key;
        if (k === 'Enter' || k === ' ') { e.preventDefault(); self.openCard(g.getAttribute('data-id'), { key: true }); return; }
        var all = $$('#cx-chart .pt').sort(function (a, b) { return +a.getAttribute('data-x') - +b.getAttribute('data-x'); }), i = all.indexOf(g), n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % all.length;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + all.length) % all.length;
        else if (k === 'Home') n = 0; else if (k === 'End') n = all.length - 1;
        if (n == null) return;
        e.preventDefault(); g.setAttribute('tabindex', '-1'); all[n].setAttribute('tabindex', '0'); all[n].focus();
      });
      var find = $('#cx-find');
      if (find) {
        find.addEventListener('input', function () { self.filterList(); });
        find.addEventListener('keydown', function (e) { // Enter ticks the chip that matches best (and unticks it if it is ticked)
          if (e.key !== 'Enter') return;
          var q = find.value.trim().toLowerCase(), list = $$('#cx-list .aic-rl-o').filter(function (x) { return !x.hidden && !$('input', x).disabled; });
          var name = function (x) { return $('.aic-rl-n', x).textContent.toLowerCase(); };
          // a chip whose name is what was typed ("h20" is the H20, not the H200), then one whose name starts with it, then the first
          var o = list.filter(function (x) { return name(x) === q; })[0] || list.filter(function (x) { return q && name(x).indexOf(q) === 0; })[0] || list[0];
          if (o) { e.preventDefault(); self.toggle(o.getAttribute('data-id')); }
        });
      }
      // a box, in the list or on a card: the one way a chip joins the comparison
      document.addEventListener('change', function (e) {
        var t = e.target; if (!t.matches || !t.matches('input[data-tick]') || Router.current !== 'landscape') return;
        var id = t.getAttribute('data-tick'), inCard = !!t.closest('.aic-card');
        self.toggle(id);
        var again = inCard ? $('.aic-card input[data-tick]') : $('#cx-list input[data-tick="' + id + '"]');
        if (again) again.focus({ preventScroll: true });
      });
      document.addEventListener('click', function (e) { if (Router.current === 'landscape') self.onClick(e); });
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || Router.current !== 'landscape') return;
        var card = $('#cx-card');
        if ((self.open || self.crowdIds) && card && card.contains(document.activeElement)) { e.preventDefault(); self.closeCard(true); return; }
        if (self.isListOpen()) { e.preventDefault(); self.leaveList(); }
      });
      var bt = 0;
      window.addEventListener('scroll', function () { if (Router.current !== 'landscape' || bt) return; bt = requestAnimationFrame(function () { bt = 0; self.renderTray(); }); }, { passive: true });
      window.addEventListener('hashchange', function () { if (Router.current !== 'landscape') { self.listOpen(false, true); self.renderTray(); } }); // leaving AI Chips takes the sheet, the tray and its scroll padding away
      var rt = null, lastW = window.innerWidth;
      window.addEventListener('resize', function () {
        if (Router.current !== 'landscape') return;
        clearTimeout(rt); rt = setTimeout(function () {
          self.hostStage();
          if (window.innerWidth !== lastW) { lastW = window.innerWidth; if (!narrow()) self.listOpen(false, true); self.renderChart(); self.renderCmp(); self.renderList(); } // a phone's toolbar changes only the height
          self.renderTray();
        }, 160);
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (Router.current === 'landscape') self.renderChart(); }); // the labels are placed by their measured width
    },
    arrows: function (e, list) { // arrow keys walk the buttons; Home and End jump to the ends
      var i = list.indexOf(document.activeElement), n = null, k = e.key;
      if (i < 0 || !list.length) return;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % list.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + list.length) % list.length;
      else if (k === 'Home') n = 0; else if (k === 'End') n = list.length - 1;
      if (n == null) return;
      e.preventDefault(); list[n].focus();
    },
    onClick: function (e) {
      var t = e.target, b, self = this;
      if (!t.closest) return;
      var card = $('#cx-card');
      if ((b = t.closest('#cx-chart .pt'))) { // a click opens the card; where dots crowd, a real tap lists the chips there
        var id = b.getAttribute('data-id'), svg = b.ownerSVGElement.getBoundingClientRect();
        var ids = e.detail ? this.crowd(e.clientX - svg.left, e.clientY - svg.top, narrow() ? 11 : 7) : [];
        if (ids.length > 1) { this.openCrowd(ids); return; }
        if (this.open === id) this.closeCard(true); else this.openCard(id, { from: b });
        return;
      }
      if ((b = t.closest('[data-card-open]'))) { this.openCard(b.getAttribute('data-card-open'), { key: e.detail === 0 }); return; }
      if ((b = t.closest('#cx-gutter [data-card], #cx-chart [data-card]'))) { var gid = b.getAttribute('data-card'); if (this.open === gid) this.closeCard(true); else this.openCard(gid, { from: b, key: e.detail === 0 }); return; }
      if ((b = t.closest('#cx-measures [data-m]'))) { this.measure = b.getAttribute('data-m'); this.chartFocus = null; this.closeCard(false, true); this.renderChart(); this.stageNow(); this.writeAddress(); return; }
      if ((b = t.closest('#cx-view [data-v]'))) { this.view = b.getAttribute('data-v'); this.closeCard(false, true); this.renderChart(); this.stageNow(); this.writeAddress(); return; }
      if ((b = t.closest('[data-card-close]'))) { this.closeCard(true); return; }
      if ((b = t.closest('[data-go]'))) { this.closeCard(false); this.toCompare(); return; }
      if ((this.open || this.crowdIds) && card && !card.contains(t)) this.closeCard(false); // a click anywhere else puts the card away
      if ((b = t.closest('.cx-fnl a'))) { e.preventDefault(); var li = document.getElementById(b.getAttribute('href').slice(1)); if (li) scrollToEl(li, true); return; } // the address keeps the route
      if ((b = t.closest('[data-untick]'))) { this.remove(b.getAttribute('data-untick')); return; }
      if ((b = t.closest('[data-tickbtn]'))) { this.add(b.getAttribute('data-tickbtn')); return; }
      if ((b = t.closest('[data-pair]'))) { this.setPair(this.compare.pairs[+b.getAttribute('data-pair')].ids); return; }
      if ((b = t.closest('[data-clear]'))) { this.clear(); var f = $('#cx-find'); if (f && !narrow()) f.focus({ preventScroll: true }); return; }
      if ((b = t.closest('[data-onstage]'))) { this.focus(b.getAttribute('data-onstage')); return; }
      if ((b = t.closest('[data-notes]'))) { var nid = b.getAttribute('data-notes'); this.focus(nid); this.jumpToNotes(nid); return; }
      if ((b = t.closest('[data-copy]'))) { this.copy(b); return; }
      if ((b = t.closest('#cx-open-list, [data-openlist]'))) { this.listOpen(true); return; }
      if ((b = t.closest('#cx-rl-close, #cx-scrim, [data-done]'))) { this.leaveList(); return; }
    },
    toCompare: function () { var c = $('#cx-compare'); if (c) scrollToEl(c, true); },
    jumpToNotes: function (id) { var el = document.getElementById('cx-note-' + id); if (!el) return; el.open = true; scrollToEl(el, true); },
    copy: function (btn) {
      var kind = btn.getAttribute('data-copy'), rows = this.selection();
      var text = kind === 'json' ? JSON.stringify(rows, null, 1) : kind === 'link' ? this.shareURL() : (function () {
        if (!rows.length) return '';
        var cols = []; rows.forEach(function (r) { Object.keys(r).forEach(function (k) { if (cols.indexOf(k) < 0) cols.push(k); }); });
        var q = function (v) { if (v == null) return ''; if (typeof v === 'object') v = JSON.stringify(v); return String(v).replace(/[\t\n\r]+/g, ' '); };
        return cols.join('\t') + '\n' + rows.map(function (r) { return cols.map(function (k) { return q(r[k]); }).join('\t'); }).join('\n'); // tab-separated, so a spreadsheet splits the columns on paste
      })();
      if (btn._was == null) btn._was = btn.innerHTML;
      var done = function (ok) { btn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { btn.innerHTML = btn._was; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false);
    },

    /* ---- the list: every chip by maker, with its year and its box. It stays in view beside the chart and the comparison, and
       Find narrows it. On a phone it opens as a sheet from the bottom ---- */
    buildList: function () {
      var self = this, host = $('#cx-list'); if (!host) return;
      host.innerHTML = this.ordered().map(function (g) {
        return '<div class="aic-rl-g"><p class="aic-rl-gh"><b>' + esc(g.vendor) + '</b> · ' + esc(cname(g.cc)) + '</p>' + g.chips.map(function (c) {
          return '<label class="aic-rl-o" data-id="' + esc(c.id) + '" data-q="' + esc([c.name, c.vendor, cname(c.vendorCountry), c.family || '', self.year(c)].join(' ').toLowerCase()) + '" title="' + esc(c.name) + '">' +
            '<input type="checkbox" data-tick="' + esc(c.id) + '" aria-label="Compare the ' + esc(c.name) + '"><span class="aic-box" aria-hidden="true"></span><span class="aic-rl-n">' + esc(self.short(c)) + '</span><span class="aic-rl-y">' + esc(self.year(c)) + '</span></label>';
        }).join('') + '</div>';
      }).join('') + '<p class="aic-rl-none" hidden>No chip matches. Try a maker, such as Nvidia or Huawei.</p>';
    },
    renderList: function () {
      var self = this, n = this.picked.length;
      $$('#cx-list .aic-rl-o').forEach(function (o) {
        var id = o.getAttribute('data-id'), at = self.picked.indexOf(id), inp = $('input', o), off = n >= self.max && at < 0;
        inp.checked = at >= 0; inp.disabled = off;
        o.classList.toggle('is-on', at >= 0); o.classList.toggle('is-off', off); o.classList.toggle('is-look', self.open === id);
        $('.aic-box', o).textContent = at >= 0 ? self.noOf(id) : '';
      });
      var cnt = $('#cx-rl-n'); if (cnt) cnt.textContent = n + ' of 4 ticked';
      var sheet = narrow(), x = $('#cx-rl-close'); if (x) x.hidden = sheet && n >= 2; // on a phone, once two are ticked, Show the comparison is the way out
      var foot = $('#cx-rl-foot');
      if (foot) foot.innerHTML = (this.hint ? '<p>' + esc(this.hint) + '</p>' : n >= this.max ? '<p>Four chips are ticked, the most the comparison holds. Untick one to add another.</p>' : '') +
        (n ? '<button type="button" class="aic-tlink" data-clear>Clear the ticks</button>' : '') + (sheet ? '<button type="button" class="aic-btn" data-done>' + (n >= 2 ? 'Show the comparison' : 'Done') + '</button>' : '');
      var ol = $('#cx-open-list'); if (ol) ol.innerHTML = '<span>Tick chips to compare</span><span class="aic-k">' + n + ' of 4 ticked</span>';
    },
    filterList: function () {
      var f = $('#cx-find'), q = f ? f.value.trim().toLowerCase() : '', toks = q ? q.split(/\s+/) : [], any = false;
      $$('#cx-list .aic-rl-o').forEach(function (o) { var ok = toks.every(function (t) { return o.getAttribute('data-q').indexOf(t) >= 0; }); o.hidden = !ok; if (ok) any = true; });
      $$('#cx-list .aic-rl-g').forEach(function (g) { g.hidden = !$$('.aic-rl-o', g).some(function (o) { return !o.hidden; }); });
      var none = $('#cx-list .aic-rl-none'); if (none) none.hidden = any;
    },
    isListOpen: function () { var r = $('#cx-rail'); return !!r && r.classList.contains('is-open'); },
    listOpen: function (on, quiet) {
      var r = $('#cx-rail'); if (!r) return;
      on = !!on && narrow();
      if (on === this.isListOpen()) { if (!on) return; }
      r.classList.toggle('is-open', on);
      var s = $('#cx-scrim'); if (s) s.hidden = !on;
      var ol = $('#cx-open-list'); if (ol) ol.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.documentElement.classList.toggle('aic-sheet-on', on); // the page under the sheet holds still
      if (on) { this.renderList(); setTimeout(function () { var f = $('#cx-find'); if (f) f.focus({ preventScroll: true }); }, 30); }
      if (!quiet) this.renderTray();
    },
    leaveList: function () { // closing the sheet: with two chips ticked, to the comparison; otherwise back to the button that opened it
      this.listOpen(false);
      if (this.picked.length >= 2) { this.renderTray(true); this.toCompare(); /* the tray shows from here, so the comparison lands clear of it */ var h = $('#cx-title'); if (h) setTimeout(function () { Keys.focus(h); }, 0); }
      else { var ol = $('#cx-open-list'); if (ol) ol.focus({ preventScroll: true }); }
    },
    // the phone's tray: the ticked chips under the masthead, once the button that opens the list has scrolled away
    renderTray: function (force) {
      var t = $('#cx-tray'); if (!t) return;
      var here = Router.current === 'landscape', sel = this.selection(), root = document.documentElement;
      if (!here || !narrow() || !sel.length) { t.hidden = true; root.style.setProperty('--cx-sticky', '0px'); return; }
      var ol = $('#cx-open-list'), past = force || this.isListOpen() || (ol && ol.getBoundingClientRect().top < headerH()); // as soon as the button starts under the masthead
      var self = this, html = sel.map(function (c) { return '<span class="aic-tc"><b class="cx-no">' + self.noOf(c.id) + '</b>' + esc(self.short(c)) + '</span>'; }).join('') + (this.isListOpen() ? '' : '<button type="button" class="aic-tlink" data-openlist>Change</button>');
      if (t.innerHTML !== html) t.innerHTML = html;
      t.hidden = !past;
      root.style.setProperty('--cx-sticky', past ? t.offsetHeight + 'px' : '0px');
    },

    /* ---- the chart: every chip by the month it was announced, against the measure the reader picks, or ranked highest first ---- */
    when: function (c) { var a = String(c.announced || ''), y = +a.slice(0, 4), mo = a.length >= 7 ? +a.slice(5, 7) : 0; return { t: mo ? y + (mo - 0.5) / 12 : y + 0.5, yearOnly: !mo, y: y }; },
    nice: function (v) { var e = Math.pow(10, Math.floor(Math.log10(v))), f = v / e; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e; },
    textW: function (s, px, bold, code) { // a label's width in the interface face (or the code face, for a chip's number), so labels are placed where they fit
      var c = this._tc || (this._tc = document.createElement('canvas').getContext('2d'));
      c.font = code ? '400 ' + px + 'px "Fragment Mono", ui-monospace, Menlo, monospace' : (bold ? '600 ' : '400 ') + px + 'px "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif';
      return c.measureText(String(s)).width + (code ? 0 : 3);
    },
    // the part of the chart a dot owns: its cell among all the dots (nearer to it than to any other), cut to a circle of radius R,
    // so a tap goes to the nearest dot and no dot hides another
    cellPath: function (q, all, R) {
      var d = '', r1 = function (v) { return Math.round(v * 10) / 10; };
      for (var k = 0; k < 28; k++) {
        var a = k / 28 * Math.PI * 2, ux = Math.cos(a), uy = Math.sin(a), t = R;
        for (var j = 0; j < all.length; j++) { var o = all[j]; if (o === q) continue; var dx = o.cx - q.cx, dy = o.cy - q.cy, pr = dx * ux + dy * uy; if (pr > 0) t = Math.min(t, (dx * dx + dy * dy) / (2 * pr)); }
        d += (k ? 'L' : 'M') + r1(q.cx + ux * t) + ' ' + r1(q.cy + uy * t);
      }
      return d + 'Z';
    },
    crowd: function (px, py, near) { return this.pts.map(function (q) { return { id: q.id, d: Math.hypot(q.cx - px, q.cy - py) }; }).filter(function (o) { return o.d <= near; }).sort(function (a, b) { return a.d - b.d; }).map(function (o) { return o.id; }); },
    renderChart: function () {
      var host = $('#cx-chart'); if (!host) return;
      var self = this, row = this.row(this.measure), rank = this.view === 'rank';
      $$('#cx-measures [data-m]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-m') === self.measure ? 'true' : 'false'); });
      $$('#cx-view [data-v]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === self.view ? 'true' : 'false'); });
      var W = Math.round(host.clientWidth); if (!W) return; // hidden: activate() draws it on arrival
      var pts = this.chips.map(function (c) { return { c: c, v: row.num(c), d: self.when(c) }; }), have = pts.filter(function (p) { return typeof p.v === 'number' && p.d.y > 0; });
      var none = pts.filter(function (p) { return have.indexOf(p) < 0; });
      if (!have.length) { host.innerHTML = ''; return; }
      var vals = have.map(function (p) { return p.v; }).sort(function (a, b) { return b - a; }), max = vals[0], second = vals[1] || max;
      // one chip far above the rest (the wafer-scale WSE-3 Turbo's bandwidth): the scale follows the others
      var outlier = max > 4 * second;
      host.setAttribute('data-chart', rank ? 'rank' : 'year'); // not data-view, which names the router's views
      if (rank) this.drawRank(host, row, have, max, second, outlier); else this.drawTimeline(host, row, have, max, second, outlier, W);
      // the words over the chart, and the chips with no figure for this measure under it
      var hi = have.filter(function (p) { return p.v === max; })[0];
      var k = $('#cx-atlas-k'), t = $('#cx-atlas-t'), s = $('#cx-atlas-s'), gut = $('#cx-gutter');
      if (k) k.textContent = have.length + ' of ' + this.chips.length + ' chips have a published figure';
      if (t) t.textContent = row.short + (rank ? ', highest first' : ', by the year each chip was announced');
      if (s) s.textContent = 'The ' + this.short(hi.c) + ' is the highest, at ' + this.nf(hi.v) + ' ' + row.unit + '.' +
        (outlier ? (rank ? ' Its bar is cut, and the scale follows the other ' : ' Its dot sits above the top of the scale, which follows the other ') + (have.length - 1) + ' chips.' : '') +
        (rank ? ' Select a name to open its chip’s card, or tick chips in the list to compare them.' : ' Select a dot to open its chip’s card, or tick chips in the list to compare them.');
      var no = none.filter(function (p) { return row.fmt && ((p.c.compute || {}).support || {})[row.fmt] === 'no'; }), np = none.filter(function (p) { return no.indexOf(p) < 0; });
      var pills = function (list) { return list.map(function (p) { var n = self.noOf(p.c.id); return '<button type="button" class="aic-pill sm" data-card="' + esc(p.c.id) + '" aria-haspopup="dialog" aria-expanded="' + (self.open === p.c.id) + '">' + (n ? '<b class="cx-no">' + n + '</b>' : '') + esc(self.short(p.c)) + '</button>'; }).join(''); };
      var at = row.fmt ? ' at ' + row.fmt.toUpperCase() : ' for this measure';
      if (gut) gut.innerHTML = (np.length ? '<p class="aic-gut"><span class="aic-gut-k">Not published' + at + '</span>' + pills(np) + '</p>' : '') + (no.length ? '<p class="aic-gut"><span class="aic-gut-k">Not supported' + at + '</span>' + pills(no) + '</p>' : '');
      var tip = $('#cx-tip'); if (tip) tip.hidden = true;
      if (this.open || this.crowdIds) this.placeCard();
      this.renderList();
    },
    drawTimeline: function (host, row, have, max, second, outlier, W) {
      var self = this, nar = W < 560, H = narrow() ? 320 : 440, m = { l: nar ? 42 : 56, r: nar ? 10 : 18, t: 34, b: 30 };
      var years = have.map(function (p) { return p.d.y; }), X0 = Math.min.apply(null, years), X1 = Math.max.apply(null, years) + 1;
      var top = outlier ? second : max, step = this.nice(top / 4), yMax = Math.ceil(top / step) * step;
      var x = function (t) { return m.l + (t - X0) / (X1 - X0) * (W - m.l - m.r); }, y = function (v) { return H - m.b - Math.min(v, yMax) / yMax * (H - m.t - m.b); };
      var r1 = function (v) { return String(Math.round(v * 10) / 10); };
      var g = '';
      for (var yr = X0; yr <= X1; yr++) g += '<line class="gx" x1="' + r1(x(yr)) + '" x2="' + r1(x(yr)) + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/>' + (yr < X1 ? '<text class="ax" x="' + r1(x(yr + 0.5)) + '" y="' + (H - m.b + 19) + '" text-anchor="middle">' + (nar ? '’' + String(yr).slice(2) : yr) + '</text>' : '');
      for (var k = 0; k * step <= yMax + 1e-9; k++) { var v = k * step; g += '<line class="gy' + (v === 0 ? ' base' : '') + '" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + r1(y(v)) + '" y2="' + r1(y(v)) + '"/><text class="ax" x="' + (m.l - 8) + '" y="' + r1(y(v) + 4) + '" text-anchor="end">' + this.nfAxis(v) + '</text>'; }
      g += '<text class="ax" x="0" y="' + (m.t - 16) + '">' + esc(row.unit) + '</text>';
      // dots: the largest in ink, the rest in the tint (rule B); the reader's ticks ringed in red wine with their numbers
      var P = have.map(function (p) { return { p: p, id: p.c.id, cx: x(p.d.t), cy: p.v > yMax ? m.t - 6 : y(p.v), top: p.v === max, no: self.noOf(p.c.id), look: self.open === p.c.id }; });
      // two dots on one pixel (the same month and figure) are set 3 px apart, so each keeps a place of its own
      P.forEach(function (q, i) { for (var j = 0; j < i; j++) { var o = P[j]; if (Math.abs(o.cx - q.cx) < 1.5 && Math.abs(o.cy - q.cy) < 1.5) { q.cx += 3; j = -1; } } });
      this.pts = P;
      // what a label keeps clear of: every dot (a ringed one to the ring's edge), a year-only chip's line, the arrow over the scale,
      // the unit over the axis, and every label and leader placed so far
      var boxes = P.map(function (q) { var e = q.no || q.look ? 12 : 7; return [q.cx - e, q.cy - e, q.cx + e, q.cy + e]; });
      P.forEach(function (q) {
        if (q.p.d.yearOnly) boxes.push([x(q.p.d.y) + 3, q.cy - 2, x(q.p.d.y + 1) - 3, q.cy + 2]); // a year-only chip's line across its year
        if (q.p.v > yMax) boxes.push([q.cx - 6, q.cy - 20, q.cx + 6, q.cy - 10]);
      });
      boxes.push([0, m.t - 28, String(row.unit).length * 6.7 + 4, m.t - 12]);
      var hit = function (a, b) { return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]; };
      var area = function (a, b) { return (Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * (Math.min(a[3], b[3]) - Math.max(a[1], b[1])); };
      // a label's spot in one of eight directions at a distance r from its dot: beside it, above or below it, or on a diagonal
      var DIRS = [[1, 0], [-1, 0], [0, -1], [0, 1], [0.71, -0.71], [-0.71, -0.71], [0.71, 0.71], [-0.71, 0.71]];
      var FAR = [[0, -1], [0, 1], [1, 0], [-1, 0], [0.38, -0.92], [-0.38, -0.92], [0.92, -0.38], [-0.92, -0.38], [0.71, -0.71], [-0.71, -0.71],
        [0.38, 0.92], [-0.38, 0.92], [0.92, 0.38], [-0.92, 0.38], [0.71, 0.71], [-0.71, 0.71]]; // further out: straight up or down first, then round
      var spot = function (q, w, h, r, d) {
        var ax = q.cx + d[0] * r, ay = q.cy + d[1] * r, a = d[0] > 0.3 ? 'start' : d[0] < -0.3 ? 'end' : 'middle', up = d[1] < -0.3, down = d[1] > 0.3;
        var l = a === 'start' ? ax - 1 : a === 'end' ? ax - w : ax - w / 2, rt = a === 'start' ? ax + w : a === 'end' ? ax + 1 : ax + w / 2;
        return up ? { x: ax, y: ay - 3, a: a, b: [l, ay - h, rt, ay + 1] } : down ? { x: ax, y: ay + 11, a: a, b: [l, ay - 1, rt, ay - 1 + h] } : { x: ax, y: ay + 4, a: a, b: [l, ay - h / 2 - 1, rt, ay + h / 2] };
      };
      // a label set further out is tied to its dot by a hairline, from the dot's edge to the nearest point of the label
      var lead = function (sp, q) {
        var e = (q.no || q.look ? 11.5 : q.top ? 7 : 5.5) + 1.5, nx = Math.max(sp.b[0], Math.min(q.cx, sp.b[2])), ny = Math.max(sp.b[1], Math.min(q.cy, sp.b[3]));
        var dx = nx - q.cx, dy = ny - q.cy, dl = Math.hypot(dx, dy) || 1;
        sp.lead = [q.cx + dx / dl * e, q.cy + dy / dl * e, nx - dx / dl * 2, ny - dy / dl * 2];
        sp.dots = [];
        for (var t = 0, len = Math.hypot(sp.lead[2] - sp.lead[0], sp.lead[3] - sp.lead[1]); t <= len; t += 4) { var px = sp.lead[0] + (sp.lead[2] - sp.lead[0]) * t / (len || 1), py = sp.lead[1] + (sp.lead[3] - sp.lead[1]) * t / (len || 1); sp.dots.push([px - 2.5, py - 2.5, px + 2.5, py + 2.5]); }
      };
      // a spot's cost: what it covers of the marks, labels and leaders so far (its own dot aside), and, for a label with no leader,
      // whether it sits as near another named dot as its own, so it could be read as that one's; off the chart, never
      var named = P.filter(function (q) { return q.no || q.look || q.top; });
      var gap = function (q, b) { return Math.hypot(Math.max(b[0] - q.cx, 0, q.cx - b[2]), Math.max(b[1] - q.cy, 0, q.cy - b[3])); };
      var cost = function (sp, q, own) {
        var b = sp.b, s = 0; if (b[0] < m.l - 2 || b[2] > W - 2 || b[1] < 0 || b[3] > H - m.b) return Infinity;
        for (var i = 0; i < boxes.length; i++) {
          if (i === own) continue; var o = boxes[i];
          if (hit(b, o)) s += 1 + area(b, o);
          if (sp.dots) for (var k = 0; k < sp.dots.length; k++) if (hit(sp.dots[k], o)) s += 25;
        }
        if (!sp.lead && (q.no || q.look || q.top)) { var mine = gap(q, b); named.forEach(function (n) { if (n !== q && gap(n, b) < mine + 6) s += 80; }); }
        return s;
      };
      var labels = '', leads = '';
      // labels: the ticked chips first, then the chip whose card is open, the largest, then the rest by value, each where it clears
      // every dot and label so far. Any chip's label tries the four sides of its dot. A ticked chip, an open card or the largest
      // must keep its label, so it also tries the diagonals, then spots further out on a leader, and at worst the spot that covers
      // least. A narrow chart names only those three kinds.
      P.slice().sort(function (a, b) { return (b.no > 0) - (a.no > 0) || b.look - a.look || b.top - a.top || b.p.v - a.p.v; }).forEach(function (q) {
        var must = q.no > 0 || q.top || q.look; if (nar && !must) return;
        var name = self.short(q.p.c), fs = must ? 12.5 : 11.5, h = fs + 3, o = q.no || q.look ? 15 : 10, own = P.indexOf(q);
        var w = (q.no ? self.textW(q.no + ' ', fs, false, true) : 0) + self.textW(name + (q.top ? ', ' + self.nf(q.p.v) : ''), fs, must); // the number is set in the code face
        var radii = [o], best = null, bc = Infinity; if (must) for (var k = 1; k <= 10; k++) radii.push(o + 14 * k);
        for (var ri = 0; ri < radii.length && bc > 0; ri++) for (var di = 0, dirs = ri ? FAR : DIRS; di < (must ? dirs.length : 4); di++) {
          var sp = spot(q, w, h, radii[ri], dirs[di]); if (ri) lead(sp, q);
          var c = cost(sp, q, own); if (c && sp.lead) c += radii[ri] / 10; // when nothing is clear, a nearer spot wins
          if (c < bc) { bc = c; best = sp; if (!c) break; }
        }
        if (!best || (bc > 0 && !must)) return;
        boxes.push(must ? [best.b[0] - 2, best.b[1] - 1, best.b[2] + 2, best.b[3] + 1] : best.b); if (best.dots) best.dots.forEach(function (d) { boxes.push(d); });
        if (best.lead) leads += '<line class="lead" x1="' + r1(best.lead[0]) + '" y1="' + r1(best.lead[1]) + '" x2="' + r1(best.lead[2]) + '" y2="' + r1(best.lead[3]) + '"/>';
        labels += '<text class="lab' + (q.no ? ' mine' : '') + (q.top ? ' top' : '') + (q.look ? ' looked' : '') + '" x="' + r1(best.x) + '" y="' + r1(best.y) + '" text-anchor="' + best.a + '" aria-hidden="true">' +
          (q.no ? '<tspan class="lno">' + q.no + '</tspan> ' : '') + esc(name) + (q.top ? '<tspan class="lv">, ' + esc(self.nf(q.p.v)) + '</tspan>' : '') + '</text>';
      });
      // one dot holds the chart's Tab stop: the one whose card is open or last focused, else the largest
      var fid = [this.open, this.chartFocus].filter(function (id) { return id && P.some(function (q) { return q.id === id; }); })[0] || (P.filter(function (q) { return q.top; })[0] || P[0]).id;
      var RH = narrow() ? 16 : 13;
      var dots = P.map(function (q) {
        var c = q.p.c, d = q.p.d, cx = r1(q.cx), cy = r1(q.cy);
        return '<g class="pt' + (q.top ? ' top' : '') + (q.no ? ' mine' : '') + '" data-id="' + esc(c.id) + '" data-x="' + cx + '" tabindex="' + (c.id === fid ? '0' : '-1') + '" role="button" aria-haspopup="dialog" aria-expanded="' + q.look + '" aria-label="' +
          esc(c.name + ', ' + [c.vendor, cname(c.vendorCountry), self.year(c)].filter(Boolean).join(', ') + ', ' + self.nf(q.p.v) + ' ' + row.unit + (q.no ? '. Chip ' + q.no + ' in the comparison' : '') + '. Opens its card') + '">' +
          '<path class="hit" d="' + self.cellPath(q, P, RH) + '"/>' +
          (d.yearOnly ? '<line class="yr" x1="' + r1(x(d.y) + 3) + '" x2="' + r1(x(d.y + 1) - 3) + '" y1="' + cy + '" y2="' + cy + '"/>' : '') +
          (q.p.v > yMax ? '<path class="arr" d="M' + cx + ' ' + r1(q.cy - 19) + 'l-5 8h10z"/>' : '') +
          '<circle class="fr" cx="' + cx + '" cy="' + cy + '" r="12"/>' + (q.no ? '<circle class="ring" cx="' + cx + '" cy="' + cy + '" r="10.5"/>' : q.look ? '<circle class="look" cx="' + cx + '" cy="' + cy + '" r="10.5"/>' : '') +
          '<circle class="dot" cx="' + cx + '" cy="' + cy + '" r="' + (q.top ? 7 : 5.5) + '"/></g>';
      }).join('');
      host.innerHTML = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="' + esc(row.short + ' of ' + have.length + ' chips, by the month each was announced. Arrow keys move between the dots, and Enter opens a chip’s card.') + '">' + g + dots + (leads ? '<g class="leads" aria-hidden="true">' + leads + '</g>' : '') + labels + '</svg>';
    },
    // highest first: one line per chip, the largest bar solid ink and the rest the tint (rule B), each figure with its source mark
    drawRank: function (host, row, have, max, second, outlier) {
      var self = this, scale = outlier ? second : max;
      this.pts = [];
      var list = have.slice().sort(function (a, b) { return b.v - a.v || String(a.c.announced).localeCompare(String(b.c.announced)); });
      host.innerHTML = '<ol class="aic-rank" aria-label="' + esc(row.short + ' of ' + have.length + ' chips, highest first') + '">' + list.map(function (p) {
        var c = p.c, top = p.v === max, n = self.noOf(c.id), cut = outlier && top, w = cut ? 100 : Math.max(0.6, p.v / scale * 100);
        return '<li class="aic-rk' + (top ? ' is-top' : '') + (n ? ' is-mine' : '') + (self.open === c.id ? ' is-look' : '') + '">' +
          '<button type="button" class="aic-rk-n" data-card="' + esc(c.id) + '" aria-haspopup="dialog" aria-expanded="' + (self.open === c.id) + '">' + (n ? '<b class="cx-no">' + n + '</b>' : '') + '<span>' + esc(self.short(c)) + '</span></button>' +
          '<span class="aic-rk-m">' + esc([c.vendor, self.year(c)].filter(Boolean).join(' · ')) + '</span>' +
          '<span class="aic-rk-b" aria-hidden="true"><i class="' + (top ? 'is-top' : '') + (cut ? ' is-cut' : '') + '" style="width:' + w.toFixed(1) + '%"></i></span>' +
          '<span class="aic-rk-v"><span class="cx-v' + (top ? ' is-top' : '') + '">' + esc(self.nf(p.v)) + '</span>' + self.cite(c, row, true) + '</span></li>';
      }).join('') + '</ol>';
    },
    showTip: function (g) { // the chip, its maker, country and year, the figure, and what a press does
      var tip = $('#cx-tip'), fig = $('.aic-fig'), c = this.byId(g.getAttribute('data-id')), dot = $('.dot', g); if (!tip || !fig || !c || !dot || this.open === c.id) return;
      var row = this.row(this.measure), n = this.noOf(c.id), r = dot.getBoundingClientRect(), f = fig.getBoundingClientRect();
      tip.innerHTML = '<b>' + esc(c.name) + '</b><span>' + esc(this.metaLine(c)) + '</span><span class="tv">' + esc(this.nf(row.num(c))) + ' ' + esc(row.unit) + '</span><span class="ta">' + (n ? 'Chip ' + n + ' in the comparison. ' : '') + 'Select it for its card</span>';
      tip.hidden = false;
      var w = tip.offsetWidth, left = r.right - f.left + 12; if (left + w > f.width) left = r.left - f.left - w - 12;
      tip.style.left = Math.round(Math.max(0, left)) + 'px'; tip.style.top = Math.round(Math.max(0, r.top - f.top - 10)) + 'px';
    },

    /* ---- a chip's card: the figure, the foundry and node, the memory supplier, the package and who assembled it, each with its
       source mark or "not published", and the one control that ticks the chip. It stays until closed ---- */
    cardHTML: function (c) {
      var row = this.row(this.measure), v = row.num(c), p = c.process || {}, mem = c.memory || {}, pk = c.package || {}, n = this.noOf(c.id), full = this.picked.length >= this.max && !n;
      var NP = '<span class="cx-nil">not published</span>', line = function (dt, dd) { return '<dt>' + dt + '</dt><dd>' + dd + '</dd>'; };
      return '<div class="aic-card-h"><div><p class="aic-card-n" id="cx-card-n">' + esc(c.name) + '</p><p class="aic-card-m">' + esc(this.metaLine(c)) + '</p></div><button type="button" class="aic-x" data-card-close aria-label="Close the card">&times;</button></div>' +
        '<dl>' + line(esc(row.short), v != null ? '<span class="aic-card-v">' + esc(this.nf(v)) + ' ' + esc(row.unit) + '</span>' + this.cite(c, row, true) : this.nil(c, row)) +
        line('Foundry, node', p.foundry || p.node ? (p.foundry ? esc(p.foundry) : 'foundry not published') + ', ' + (p.node ? esc(p.node) : 'node not published') + this.cite(c, this.row('process'), true) : NP) +
        line('Memory supplier', this.supHTML(c) || NP) +
        line('Package', pk.type ? esc(pk.type) + this.cite(c, this.row('package'), true) : NP) +
        line('Assembled by', pk.assembler ? esc(pk.assembler) + this.cite(c, this.row('package'), true) : NP) + '</dl>' +
        '<div class="aic-card-act"><label class="aic-cbx' + (full ? ' is-off' : '') + '"><input type="checkbox" data-tick="' + esc(c.id) + '"' + (n ? ' checked' : '') + (full ? ' disabled' : '') + '><span class="aic-box" aria-hidden="true">' + (n || '') + '</span><span>Compare the ' + esc(this.short(c)) + '</span></label>' +
        (full ? '<p class="aic-card-note">Four chips are ticked, the most the comparison holds. Untick one to add this one.</p>' : n ? '<button type="button" class="aic-tlink" data-go>Go to the comparison</button>' : '') + '</div>';
    },
    // a tap where dots crowd together: the chips there, each opening its own card
    crowdHTML: function (ids) {
      var self = this, row = this.row(this.measure);
      return '<div class="aic-card-h"><p class="aic-card-n" id="cx-card-n">' + ['', 'One chip', 'Two chips', 'Three chips', 'Four chips', 'Five chips', 'Six chips'][Math.min(ids.length, 6)] + ' here</p><button type="button" class="aic-x" data-card-close aria-label="Close the list">&times;</button></div>' +
        '<ul class="aic-card-list">' + ids.map(function (id) { var c = self.byId(id), n = self.noOf(id); return '<li><button type="button" data-card-open="' + esc(id) + '"><span class="aic-cl-n">' + (n ? '<b class="cx-no">' + n + '</b>' : '') + esc(c.name) + '</span><span class="aic-cl-v">' + esc(self.nf(row.num(c))) + ' ' + esc(row.unit) + ' · ' + esc(self.year(c)) + '</span></button></li>'; }).join('') + '</ul>';
    },
    cardEl: function () {
      var el = $('#cx-card');
      if (!el) { el = document.createElement('div'); el.className = 'aic-card'; el.id = 'cx-card'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-labelledby', 'cx-card-n'); el.hidden = true; $('.aic-fig').appendChild(el); }
      return el;
    },
    placeCard: function () {
      var el = this.cardEl(), c = this.open ? this.byId(this.open) : null;
      if (!c && !this.crowdIds) { el.hidden = true; return; }
      var had = el.contains(document.activeElement) ? (document.activeElement.matches('input[data-tick]') ? 'input' : 'button') : '';
      el.innerHTML = c ? this.cardHTML(c) : this.crowdHTML(this.crowdIds);
      el.hidden = false;
      if (had) { var fo = $('.aic-card-act ' + had, el) || $('.aic-card-act input, .aic-card-act button, [data-card-open]', el); if (fo) fo.focus({ preventScroll: true }); }
      var fig = $('.aic-fig'), f = fig.getBoundingClientRect(), id = c ? c.id : this.crowdIds[0];
      var anchor = (this.view === 'rank' ? $('#cx-chart [data-card="' + id + '"]') : $('#cx-chart .pt[data-id="' + id + '"] .dot')) || $('#cx-gutter [data-card="' + id + '"]');
      if (!anchor) { this.closeCard(false, true); return; }
      var a = anchor.getBoundingClientRect(), w = Math.min(330, f.width), left, top;
      el.style.width = w + 'px';
      if (f.width < 560) { left = 0; top = a.bottom - f.top + 14; }
      else { left = a.right - f.left + 16; if (left + w > f.width) left = a.left - f.left - w - 16; if (left < 0) left = Math.max(0, Math.min(f.width - w, a.left - f.left - w / 2)); top = a.top - f.top - 24; }
      var h = el.offsetHeight, fh = fig.offsetHeight; if (top + h > fh) top = Math.max(0, fh - h);
      el.style.left = Math.round(left) + 'px'; el.style.top = Math.round(Math.max(0, top)) + 'px';
    },
    // o.key: opened from the keyboard, so focus goes into the card; o.from: the control that opened it; o.show: bring it into view
    openCard: function (id, o) {
      o = o || {};
      if (!this.byId(id)) return;
      if (!this.built) return; // the router builds the page on arrival; a caller that lands here first has nothing to open yet
      this.listOpen(false, true);
      this.open = id; this.crowdIds = null; this.chartFocus = this.view === 'year' ? id : this.chartFocus;
      var tip = $('#cx-tip'); if (tip) tip.hidden = true;
      this.renderChart(); this.stageNow();
      var el = this.cardEl();
      if (o.show) { // bring the card into view: its foot clear of the phone's strip, its head clear of the masthead
        scrollToEl($('.aic-atlas'), false); this.placeCard();
        var self = this, fit = function () {
          if (self.open !== id || el.hidden) return;
          var st = $('.stage'), strip = narrow() && st ? st.getBoundingClientRect().height : 0; // a phone's strip, or its bar while the stage stands down
          var r = el.getBoundingClientRect(), room = window.innerHeight - strip - 12, over = r.bottom - room;
          if (over > 0) { var root = document.documentElement, sb = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; window.scrollBy(0, Math.round(Math.min(over, r.top - headerH() - 12))); root.style.scrollBehavior = sb; }
        };
        fit(); if (narrow()) setTimeout(fit, 400); // arriving from search, the strip is still growing to its full height: look again once it rests
      }
      if (o.key || o.show) { var b = $('.aic-card-act input, .aic-card-act button', el); if (b) b.focus({ preventScroll: true }); }
    },
    openCrowd: function (ids) {
      this.open = null; this.crowdIds = ids;
      var tip = $('#cx-tip'); if (tip) tip.hidden = true;
      this.renderChart(); this.stageNow();
    },
    // back: return focus to the dot or the name that opened it. quiet: no redraw (the caller draws)
    closeCard: function (back, quiet) {
      if (!this.open && !this.crowdIds) return;
      var id = this.open || this.crowdIds[0];
      this.open = null; this.crowdIds = null;
      var el = $('#cx-card'); if (el) el.hidden = true;
      if (quiet) return;
      this.renderChart(); this.stageNow();
      if (back) { var b = $('#cx-chart .pt[data-id="' + id + '"]') || $('#cx-chart [data-card="' + id + '"]') || $('#cx-gutter [data-card="' + id + '"]'); if (b) b.focus({ preventScroll: true }); }
    },

    /* ---- render ---- */
    render: function () {
      this.syncExport();
      this.renderChart();
      this.renderList();
      this.renderCmp();
      this.renderTray();
      this.writeAddress();
      this.announceChange();
      this.stageNow();
    },
    // a chip at the head of its row: its number, name, then maker, country and year. In the parts table the maker carries its
    // source mark and the line ends with a link to the chip's notes
    who: function (c, full) {
      var on = c.id === this.sel, meta = full ? esc(c.vendor) + this.cite(c, this.row('vendor')) + ' · ' + esc(cname(c.vendorCountry)) + (this.year(c) ? ' · ' + esc(this.year(c)) : '') : esc(this.metaLine(c));
      return '<div class="cx-who' + (on ? ' is-on' : '') + '"><b class="cx-no">' + this.noOf(c.id) + '</b><span class="cx-wn">' + esc(c.name) + '</span><span class="cx-wm">' + meta + '</span>' +
        (full ? '<span class="cx-wm"><button type="button" class="aic-tlink" data-notes="' + esc(c.id) + '">Notes</button></span>' : '') + '</div>';
    },
    whoShort: function (c) { return '<div class="cx-who"><b class="cx-no">' + this.noOf(c.id) + '</b><span class="cx-wn">' + esc(this.short(c)) + '</span></div>'; },
    // one table of figures for the given columns, the speeds first under one head
    figPart: function (sel, keys, w) {
      var self = this, speed = keys.filter(function (k) { return self.row(k).fmt; }), rest = keys.filter(function (k) { return !self.row(k).fmt; });
      var h1 = '<th class="c0" rowspan="2" scope="col"><span class="sr-only">Chip</span></th>' + (speed.length ? '<th class="grp" colspan="' + speed.length + '" scope="colgroup">Speed, in TFLOPS</th>' : ''), h2 = speed.map(function (k) { return '<th scope="col">' + self.row(k).fmt.toUpperCase() + '</th>'; }).join('');
      rest.forEach(function (k) { var r = self.row(k); h1 += '<th scope="col">' + esc(r.short) + '</th>'; h2 += '<th aria-hidden="true">' + esc(r.unit) + '</th>'; });
      var body = sel.map(function (c) { return '<tr><th scope="row">' + self.who(c, false) + '</th>' + keys.map(function (k) { var r = self.row(k); return '<td>' + self.cell(c, r, sel, r.fmt ? self.letter(c, sel) : '') + '</td>'; }).join('') + '</tr>'; }).join('');
      var c0 = this.C0, cw = Math.min(118, Math.floor((w - c0) / Math.max(keys.length, 6)));
      return '<table class="cx-fig" style="width:' + (c0 + cw * keys.length) + 'px"><colgroup><col style="width:' + c0 + 'px">' + keys.map(function () { return '<col style="width:' + cw + 'px">'; }).join('') + '</colgroup><thead><tr>' + h1 + '</tr><tr class="u">' + h2 + '</tr></thead><tbody>' + body + '</tbody></table>';
    },
    C0: 180,
    // the figures: one table, or on a narrower column two (the speeds, then the rest), so no number loses its room
    figTable: function (sel, w) {
      var self = this, n = sel.length, span = {}, keep = this.FIGS.filter(function (k) { span[k] = n > 1 ? self.allNil(self.row(k), sel) : ''; return !span[k]; });
      var gone = this.FIGS.filter(function (k) { return span[k]; });
      var html = (w - this.C0) / Math.max(1, keep.length) >= 96 ? this.figPart(sel, keep, w) :
        this.figPart(sel, keep.filter(function (k) { return self.row(k).fmt; }), w) + '<div class="cx-fig-gap"></div>' + this.figPart(sel, keep.filter(function (k) { return !self.row(k).fmt; }), w);
      var said = this.saidOnce(gone, sel);
      return html + (said ? '<p class="cx-said">' + said + '</p>' : '');
    },
    // a phone, or a column too narrow for the tables: each figure a short list, the chip then its value
    figPhone: function (sel) {
      var self = this, n = sel.length;
      return this.FIGS.map(function (k) {
        var r = self.row(k), all = self.allNil(r, sel);
        return '<div class="cx-fb"><p class="cx-fb-h">' + esc(r.short) + '<span>' + esc(r.unit) + '</span></p>' + (all && n > 1 ? '<span class="cx-fb-all cx-nil">' + self.allSaid(all, n) + '</span>' :
          sel.map(function (c) { var h = self.cell(c, r, sel, r.fmt ? self.letter(c, sel) : ''), at = h.indexOf('<span class="cx-bar'); return '<div class="cx-fl">' + self.whoShort(c) + '<span class="cx-vv">' + (at >= 0 ? h.slice(0, at) : h) + '</span>' + (at >= 0 ? h.slice(at) : '') + '</div>'; }).join('')) + '</div>';
      }).join('');
    },
    listPhone: function (sel, keys, label) {
      var self = this, n = sel.length;
      return keys.map(function (k) {
        var r = self.row(k), all = self.allNil(r, sel);
        return '<div class="cx-fb"><p class="cx-fb-h">' + esc(r.label) + '</p>' + (all && n > 1 ? '<span class="cx-fb-all cx-nil">' + self.allSaid(all, n) + '</span>' :
          sel.map(function (c) { return '<div class="cx-fl cx-fl--tx">' + self.whoShort(c) + '<span class="cx-vv">' + self.cell(c, r, sel) + '</span></div>'; }).join('')) + '</div>';
      }).join('');
    },
    partsTable: function (sel) {
      var self = this;
      return '<table class="cx-parts"><thead><tr><th class="c0" scope="col"><span class="sr-only">Chip</span></th>' + this.PARTS.map(function (k) { return '<th scope="col">' + esc(self.row(k).label) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        sel.map(function (c) { return '<tr><th scope="row">' + self.who(c, true) + '</th>' + self.PARTS.map(function (k) { return '<td>' + self.cell(c, self.row(k), sel) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    },
    wordsTable: function (sel) {
      var self = this, n = sel.length;
      return '<table class="cx-words">' + this.WORDS.map(function (k) {
        var r = self.row(k), all = self.allNil(r, sel);
        if (all && n > 1) return '<tbody><tr class="first"><th class="at" scope="row">' + esc(r.label) + '</th><td class="span" colspan="2"><span class="cx-nil">' + self.allSaid(all, n) + '</span></td></tr></tbody>';
        return '<tbody>' + sel.map(function (c, i) {
          return '<tr class="' + (i === 0 ? 'first' : '') + (r.long ? ' long' : '') + '">' + (i === 0 ? '<th class="at" scope="rowgroup" rowspan="' + n + '">' + esc(r.label) + '</th>' : '') + '<td class="wc">' + self.whoShort(c) + '</td><td class="wt">' + self.cell(c, r, sel) + '</td></tr>';
        }).join('') + '</tbody>';
      }).join('') + '</table>';
    },
    pairsHTML: function () {
      var self = this, n = this.picked.length, out = '';
      var tw = n === 1 ? (this.compare.with[this.picked[0]] || []).filter(function (s) { return self.byId(s) && self.picked.indexOf(s) < 0; }).slice(0, 3) : [];
      if (tw.length) out += '<div class="aic-pairs"><span class="aic-k">Try with the ' + esc(this.short(this.byId(this.picked[0]))) + '</span>' + tw.map(function (id) { var t = self.short(self.byId(id)); return '<button type="button" class="aic-pill sm" data-tickbtn="' + esc(id) + '" aria-label="Tick the ' + esc(t) + ' as chip 2"><span aria-hidden="true">+</span> ' + esc(t) + '</button>'; }).join('') + '</div>';
      if (!n && this.compare.pairs.length) out += '<div class="aic-pairs"><span class="aic-k">Or tick a suggested pair</span>' + this.compare.pairs.map(function (p, j) { return '<button type="button" class="aic-pill sm" data-pair="' + j + '">' + esc(p.label) + '</button>'; }).join('') + '</div>';
      return out;
    },
    // the packages, all at one millimeters-per-pixel scale: the largest drawing's long side fits the span
    mm: function (v) { return Math.round(v * 100) / 100; },
    planBounds: function (L) {
      if (!L) return null;
      if (L.waferScale) { var d = L.diameterMm || 300; return [d, d]; }
      if (L.substrate) return [L.substrate[0], L.substrate[1]];
      if (L.interposer) return [L.interposer[0], L.interposer[1]];
      var w = 0, h = 0;
      ['interposers', 'base', 'dies', 'hbm'].forEach(function (k) { (L[k] || []).forEach(function (r) { w = Math.max(w, Math.abs(r.x) * 2 + r.w); h = Math.max(h, Math.abs(r.y) * 2 + r.h); }); });
      return (w && h) ? [w, h] : null;
    },
    planK: function (sel, span) { var self = this, big = 0; sel.forEach(function (c) { var b = self.planBounds(c.layout); if (b) big = Math.max(big, b[0], b[1]); }); return big ? Math.min(span / big, 2.6) : 1; },
    rects: function (list, cls) { var self = this; return (list || []).map(function (r) { return '<rect class="' + cls + '" x="' + self.mm(r.x - r.w / 2) + '" y="' + self.mm(-r.y - r.h / 2) + '" width="' + self.mm(r.w) + '" height="' + self.mm(r.h) + '" vector-effect="non-scaling-stroke"/>'; }).join(''); },
    box: function (d, cls, rx) { return '<rect class="' + cls + '" x="' + this.mm(-d[0] / 2) + '" y="' + this.mm(-d[1] / 2) + '" width="' + this.mm(d[0]) + '" height="' + this.mm(d[1]) + '"' + (rx ? ' rx="' + rx + '"' : '') + ' vector-effect="non-scaling-stroke"/>'; },
    planSVG: function (c, k) {
      var L = c.layout, b = this.planBounds(L); if (!b) return '';
      var W = b[0], H = b[1], g = '';
      if (L.waferScale) { // one square cut from a 300 mm disc
        var d = L.diameterMm || 300, s = L.squareMm || Math.round(d / Math.SQRT2), gx = (L.dieGrid || [])[0] || 0, gy = (L.dieGrid || [])[1] || 0, i;
        g += '<circle class="cx-wafer" cx="0" cy="0" r="' + this.mm(d / 2) + '" vector-effect="non-scaling-stroke"/>' + this.box([s, s], 'cx-die');
        for (i = 1; i < gx; i++) g += '<line class="cx-grid" x1="' + this.mm(-s / 2 + s * i / gx) + '" y1="' + this.mm(-s / 2) + '" x2="' + this.mm(-s / 2 + s * i / gx) + '" y2="' + this.mm(s / 2) + '" vector-effect="non-scaling-stroke"/>';
        for (i = 1; i < gy; i++) g += '<line class="cx-grid" x1="' + this.mm(-s / 2) + '" y1="' + this.mm(-s / 2 + s * i / gy) + '" x2="' + this.mm(s / 2) + '" y2="' + this.mm(-s / 2 + s * i / gy) + '" vector-effect="non-scaling-stroke"/>';
      } else {
        if (L.substrate) g += this.box(L.substrate, 'cx-substrate', 1.5);
        if (L.interposer) g += this.box(L.interposer, 'cx-interposer');
        g += this.rects(L.interposers, 'cx-interposer') + this.rects(L.base, 'cx-base') + this.rects(L.dies, 'cx-die') + this.rects(L.hbm, 'cx-hbm');
      }
      return '<svg class="cx-plan-svg" width="' + Math.max(12, this.mm(W * k)) + '" height="' + Math.max(12, this.mm(H * k)) + '" viewBox="' + this.mm(-W / 2) + ' ' + this.mm(-H / 2) + ' ' + this.mm(W) + ' ' + this.mm(H) + '" aria-hidden="true" focusable="false">' + g + '</svg>';
    },
    planSize: function (c) {
      var L = c.layout || {}, p = c.package || {};
      if (L.waferScale) return (L.squareMm ? L.squareMm + ' × ' + L.squareMm + ' mm, ' : '') + 'cut from a ' + (L.diameterMm || 300) + ' mm wafer';
      if (L.substrate) return L.substrate[0] + ' × ' + L.substrate[1] + ' mm' + (L.estimated ? ', estimated' : '');
      if (p.sizeMm) return String(p.sizeMm);
      return 'size not published';
    },
    scaleKey: function (k) { var steps = [10, 20, 50, 100, 200], s = steps[0]; for (var i = 0; i < steps.length; i++) if (steps[i] * k <= 110) s = steps[i]; return '<span class="cx-scale"><i style="width:' + Math.round(s * k) + 'px"></i>' + s + ' mm</span>'; },
    plansHTML: function (sel) {
      var self = this, k = this.planK(sel, narrow() ? 120 : 170), maxH = 0, stage = Stage.ok;
      sel.forEach(function (c) { var b = self.planBounds(c.layout); if (b) maxH = Math.max(maxH, b[1] * k); });
      return '<div class="cx-key"><span><i class="cx-sw die"></i>Logic die</span><span><i class="cx-sw hbm"></i>Memory stack</span><span><i class="cx-sw int"></i>Interposer</span><span><i class="cx-sw sub"></i>Substrate</span>' + this.scaleKey(k) + '</div>' +
        '<p class="cx-sub">' + this.DIES_SENTENCE + '</p><div class="cx-plans">' + sel.map(function (c) {
          var b = self.planBounds(c.layout), on = c.id === self.sel;
          return '<div class="cx-plan' + (on ? ' is-on' : '') + '"><button type="button" class="cx-plan-hit" data-onstage="' + esc(c.id) + '" aria-pressed="' + on + '" aria-label="Show the ' + esc(c.name) + ' on the stage"><span class="cx-plan-art" style="height:' + Math.ceil(Math.max(maxH, 40) + 10) + 'px">' + (b ? self.planSVG(c, k) : '<i class="cx-noplan">No published layout</i>') + '</span>' +
            '<span class="cx-plan-name"><b class="cx-no">' + self.noOf(c.id) + '</b>' + esc(self.short(c)) + '</span><span class="cx-plan-size">' + esc(self.planSize(c)) + '</span></button>' +
            (stage ? '<span class="cx-on">' + (on ? 'On the stage' : '') + '</span>' : '') + '</div>'; // the line is kept on every drawing, so they stay level
        }).join('') + '</div>';
    },
    noteHTML: function (c, open) {
      var body = (this.notes[c.id] || (c.notes ? '<p>' + esc(c.notes) + '</p>' : '<p class="cx-nil">No note yet.</p>')).replace(/^\s*<p><code>[^<]*<\/code><\/p>\s*/, ''); // the notes file opens each block with the chip id, which is keying, not copy
      var srcs = (c.sources || []).map(function (s) { return '<li><a href="' + safeUrl(s.url) + '" target="_blank" rel="noopener">' + esc(s.label || s.url) + '</a></li>'; }).join('');
      return '<details class="cx-note" id="cx-note-' + esc(c.id) + '"' + (open ? ' open' : '') + '><summary><b>' + esc(c.name) + '</b><span>' + esc(c.vendor) + ' · ' + esc(cname(c.vendorCountry)) + '</span></summary>' +
        '<div class="cx-note-body">' + body + '</div>' + (srcs ? '<ol class="cx-srcs" aria-label="Sources for the ' + esc(c.name) + '">' + srcs + '</ol>' : '') + '</details>';
    },
    renderCmp: function () {
      var self = this, host = $('#cx-cmp'); if (!host) return;
      var sel = this.selection(), n = sel.length, sec = $('section[data-view="landscape"]');
      if (sec) { sec.setAttribute('data-empty', n ? '0' : '1'); sec.setAttribute('data-full', n >= this.max ? '1' : '0'); }
      var notes = $('#cx-notes');
      if (!n) {
        host.innerHTML = '<div class="aic-c-head"><h2 class="aic-c-t" id="cx-title">Tick two to four chips to compare them.</h2></div>' +
          '<p class="aic-c-lede">' + (narrow() ? 'The list of all ' + this.chips.length + ' chips opens from Tick chips to compare, under the chart.' : 'The list beside the chart holds all ' + this.chips.length + ' chips by maker. Each box adds its chip to the comparison, which is set here with one row for each chip.') + '</p>' + this.pairsHTML();
        if (notes) { notes.innerHTML = ''; notes.hidden = true; }
        return;
      }
      var sn = this.speedNotes(sel), w = host.clientWidth || 900, ph = narrow() || w < 720; // a phone, or a column too narrow for the tables, takes short lists
      host.innerHTML = '<div class="aic-c-head"><h2 class="aic-c-t" id="cx-title" tabindex="-1">' + esc(this.names(this.picked)) + '</h2><p class="aic-c-acts"><button type="button" class="aic-tlink" data-clear>Clear</button></p></div>' +
        (n === 1 ? '<p class="aic-c-lede">One chip ticked, so its figures and parts stand alone. Tick up to three more to compare them.</p>' + this.pairsHTML() : '') +
        '<section class="aic-c-sec" aria-labelledby="cx-h-fig"><div class="aic-c-sec-h"><h3 class="label" id="cx-h-fig">Figures</h3>' + (n > 1 ? '<p class="aic-k">The largest of each figure is bold, with the solid bar</p>' : '') + '</div>' +
        '<p class="cx-sub">' + this.TFLOPS_SENTENCE + ' Each figure carries the number of its source in the chip’s list under Notes and sources.</p>' +
        (ph ? this.figPhone(sel) : this.figTable(sel, w)) +
        (sn.length ? '<div class="cx-fns"><p class="label">How the speed figures are measured</p><ol>' + sn.map(function (x, j) { return '<li id="cx-sn-' + esc(x.c.id) + '"><span class="cx-fns-who"><i class="cx-fn-l">' + self.LET.charAt(j) + '</i><b class="cx-no">' + self.noOf(x.c.id) + '</b>' + esc(self.short(x.c)) + '</span><span>' + esc(x.n) + '</span></li>'; }).join('') + '</ol></div>' : '') + '</section>' +
        '<section class="aic-c-sec" aria-labelledby="cx-h-parts"><div class="aic-c-sec-h"><h3 class="label" id="cx-h-parts">Makers and parts</h3></div>' + (ph ? this.listPhone(sel, this.PARTS) : this.partsTable(sel)) + '</section>' +
        '<section class="aic-c-sec" aria-labelledby="cx-h-pk"><div class="aic-c-sec-h"><h3 class="label" id="cx-h-pk">Packages at one scale</h3></div>' + this.plansHTML(sel) + '</section>' +
        '<section class="aic-c-sec" aria-labelledby="cx-h-words"><div class="aic-c-sec-h"><h3 class="label" id="cx-h-words">In words</h3></div>' + (ph ? this.listPhone(sel, this.WORDS) : this.wordsTable(sel)) + '</section>' +
        '<div class="export-bar xq"><span class="xq-k" aria-hidden="true">Copy the comparison</span><button type="button" class="btn ghost" data-copy="tsv"><span class="sr-only">Copy the comparison as a </span>Table</button><span class="xq-s" aria-hidden="true">·</span><button type="button" class="btn ghost" data-copy="json"><span class="sr-only">Copy the comparison as </span>JSON</button><span class="xq-s" aria-hidden="true">·</span><button type="button" class="btn ghost" data-copy="link"><span class="sr-only">Copy a </span>Link<span class="sr-only"> to this comparison</span></button></div>';
      if (notes) { notes.innerHTML = '<h2 class="cx-notes-h" id="cx-notes-h">Notes and sources</h2>' + sel.map(function (c) { return self.noteHTML(c, c.id === self.sel); }).join(''); notes.hidden = false; }
    },

    /* ---- the stage draws the package of the chip whose card is open, else the chip on the stage, beside the list (or in the
       phone's strip) ---- */
    // the package type sits mid-sentence, so a phrase such as "Two silicon interposers" takes a small letter (CoWoS-L keeps its own)
    lowerFirst: function (s) { s = String(s || ''); var w = s.split(/[\s,]/)[0]; return /^[A-Z][a-z]+$/.test(w) ? s.charAt(0).toLowerCase() + s.slice(1) : s; },
    stageCaption: function (c) {
      var lay = c.layout || null, hb = (c.memory && c.memory.stacks) || 0, n = (c.die && c.die.count) || 1;
      if (lay && lay.waferScale) return 'Wafer-scale: one ' + esc(c.name) + ' is a whole 300 mm wafer.';
      return esc(c.name) + ': ' + n + ' logic die' + (n > 1 ? 's' : '') + (hb ? ' and ' + hb + ' ' + esc((c.memory && c.memory.type) || 'high-bandwidth memory') + ' stacks' : '') + ' on ' + esc(this.lowerFirst((c.package && c.package.type) || 'the package')) + '.';
    },
    specText: function (tag, cap) { var t = $('#cx-spec-tag'), p = $('#cx-spec-text'); if (t) t.innerHTML = tag; if (p) p.innerHTML = cap; },
    stageNow: function () {
      if (Router.current !== 'landscape') return;
      var c = this.byId(this.open) || this.byId(this.sel), key = c ? c.id : '';
      if (key === this._staged && this._stagedOk === Stage.ok) return;
      this._staged = key; this._stagedOk = Stage.ok;
      if (c) this.showStage(c); else this.showGeneric();
    },
    showGeneric: function () {
      var cap = 'An AI accelerator package, drawn from above.', tag = 'AI chips · <b>Package</b>';
      Stage.show('package', { plan: true }, cap, tag); this.specText(tag, cap);
    },
    showStage: function (c) {
      if (!c) return;
      var lay = c.layout || null, cap = this.stageCaption(c), tag = 'AI chips · <b>' + esc(c.name) + '</b>';
      Stage.show('package', lay ? { layout: lay, plan: true } : { plan: true }, cap, tag);
      this.specText(tag, cap);
    }
  };
  Landscape.initSelection();

  /* ---------------- suppliers ----------------
     One list of firms, drawn twice and listed three ways. The ribbons run from the countries the firms are based in to the
     twenty segments of the list (its categories), a ribbon's width the number of firms; the firms rated Critical ride on top
     in red wine, the one data color on the site, and every other ribbon is gray. Under them the firms are listed by segment
     (the ladder, from design to power), by country, or in a table, every name opening its own panel. "Stages" are the
     stage chapters of the chain (build/stages.js); the list's own categories are "segments". */
  var Suppliers = {
    rows: DATA.suppliers || [], built: false, stage: '', country: '', chk: '', q: '', sortKey: 'name', sortDir: 1,
    tab: 'segment', savedTab: '', follow: '', atlasCC: '', stages: [], at: 0, tipAt: -1, drawW: 0, wiped: false,
    CO: ['US', 'JP', 'CN', 'TW', 'KR', 'NL', 'DE'], // the band order down the stack; every other country stacks last
    /* the ribbons can also count the EU's members as one column (#/suppliers?tab=country&group=eu). Every firm keeps its own
       country: the grouping only changes which column it is drawn in, and the list's "Other countries" follows the drawing */
    EU27: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'], // the members in 2026
    EU_CO: ['US', 'JP', 'CN', 'TW', 'KR', 'EU'], group: 'country',
    cols: function () { return (this.group === 'eu' ? this.EU_CO : this.CO).concat(['Other']); },
    colOf: function (cc) { // the column a firm of this country is drawn in
      if (this.group === 'eu' && this.EU27.indexOf(cc) >= 0) return 'EU';
      return (this.group === 'eu' ? this.EU_CO : this.CO).indexOf(cc) >= 0 ? cc : 'Other';
    },
    keyOf: function (c) { return c === 'Other' ? '__other' : c === 'EU' ? '__eu' : c; }, // a column, as the firm filter's value
    /* under the ribbons: they count firms by each one's own headquarters, as the supplier list does, while the country shares
       count by parent company (data/chokepoint-matrix-notes.md, "Converting firm shares to country shares"; the Glossary's
       country cards carry the same note) */
    NOTE: 'The ribbons count each firm in the supplier list under the country of its own headquarters. Country shares of a market\'s revenue count most firms under their parent company\'s home country. ' +
      'Siemens EDA is run from Oregon but owned by Siemens AG, so the ribbons count it under the US and the EDA software share under Germany. Linde plc is incorporated in Ireland, with head offices in the UK and the US. ' +
      'The ribbons count it under the UK. The specialty gases share counts it under Germany for its roots in Linde AG, as Georgetown University\'s Emerging Technology Observatory does.',
    LEVELS: ['Critical', 'Important', 'Contested', 'Diversified'],
    RANK: { Critical: 0, Important: 1, Contested: 2, Diversified: 3 },
    ORDER: ['Design & EDA', 'IP & Architecture', 'Silicon & Wafers', 'Photomasks', 'Lithography', 'Deposition & Etch', 'Photoresist & Materials', 'Chemicals & Gases', 'Optics & Photonics', 'Equipment Subsystems & Components', 'Metrology & Inspection', 'Foundry', 'Memory', 'Advanced Packaging & OSAT', 'Test', 'Substrates & PCBs', 'Interconnect & Networking', 'Power & Cooling', 'Systems & Servers', 'AI Accelerator Vendor'], // chain order, design first
    /* the long category names would collide under a 59 px column, so the drawing uses these */
    SHORT: {
      'Equipment Subsystems & Components': 'Equipment subsystems', 'Advanced Packaging & OSAT': 'Advanced packaging',
      'Interconnect & Networking': 'Interconnect', 'AI Accelerator Vendor': 'Accelerator vendors',
      'Photoresist & Materials': 'Photoresist', 'Metrology & Inspection': 'Metrology',
      'Deposition & Etch': 'Deposition & etch', 'Chemicals & Gases': 'Chemicals & gases',
      'Systems & Servers': 'Systems & servers', 'Power & Cooling': 'Power & cooling',
      'Silicon & Wafers': 'Silicon wafers', 'IP & Architecture': 'IP & architecture'
    },
    /* the address: #/suppliers opens By segment, ?tab=country By country and ?tab=table the table; &group=eu draws the EU-27
       members as one column in the ribbons and lands on them (the Glossary's EU-27 card links there) */
    activate: function () {
      var h = location.hash || '', eu = /[?&]group=eu\b/.test(h);
      var tab = /[?&]tab=country\b/.test(h) ? 'country' : /[?&]tab=table\b/.test(h) ? 'table' : '';
      if (eu) this.setGroup('eu', true); // before the first draw, so the ribbons are drawn once, grouped
      if (!this.built) this.build(); else this.fitPipe();
      this.setTab(tab || this.savedTab || 'segment', true);
      // the router has just put the page at its top; a link to the EU-27 view lands on the ribbons, under the route
      if (eu) setTimeout(function () { var t = $('#sup-pipe'); if (t && !t.closest('[hidden]')) { scrollToEl(t, false); Router.settle(t); } }, 0);
    },
    /* the ribbons by country, or with the EU-27 members as one column; quiet: set it up before the first draw */
    setGroup: function (g, quiet) {
      g = g === 'eu' ? 'eu' : 'country';
      $$('#sup-group .sup-gbtn').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-group') === g ? 'true' : 'false'); });
      if (g === this.group) return;
      this.group = g;
      this.follow = g === 'eu' ? 'EU' : this.atlasCol(); // the EU column lights as it appears; back by country, the route's choice lights again
      if (!this.built) return;
      this.groupStages(); this.legend(); this.chips(); this.otherCount();
      this.drawW = 0; this.drawPipe();
      this.sync(); this.render();
      if (!quiet) this.url();
    },
    /* the address follows the tab and the grouping, without a new history entry */
    url: function () {
      var q = [];
      if (this.tab === 'country' || this.tab === 'table') q.push('tab=' + this.tab);
      if (this.group === 'eu') q.push('group=eu');
      try { history.replaceState(history.state, '', '#/suppliers' + (q.length ? '?' + q.join('&') : '')); } catch (e) { }
    },
    otherCount: function () { // "Other countries" in the firm filter counts what the drawing's Other column holds
      var self = this, o = $('#sup-country option[value="__other"]'); if (!o) return;
      o.textContent = 'Other countries (' + this.rows.filter(function (r) { return self.colOf(r.country) === 'Other'; }).length + ')';
    },
    /* three tabs over the firms: by segment (the ladder), by country, and the table */
    setTab: function (tab, quiet) {
      tab = tab === 'country' || tab === 'table' ? tab : 'segment';
      var was = this.tab;
      this.tab = tab;
      $$('.sup-tabs a').forEach(function (a) { if (a.getAttribute('data-tab') === tab) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      if (!quiet) { this.savedTab = tab === 'table' ? 'table' : ''; try { localStorage.setItem('cp-sup-mode', tab === 'table' ? 'table' : 'ladder'); } catch (e) { } }
      if (this.built && was !== tab) { this.sync(); this.render(); }
      if (!quiet) this.url();
    },
    toStage: function () { if (this.tab !== 'segment') this.setTab('segment'); }, // the ribbons index the ladder by segment
    atlasCol: function () { var c = this.atlasCC ? this.colOf(this.atlasCC) : ''; return c === 'Other' ? '' : c; }, // a country drawn inside Other lights nothing
    light: function (cc) { // the route's chosen country lights its column's ribbons and presses its button there
      this.atlasCC = cc || '';
      this.follow = this.atlasCol();
      if (this.built) this.sync();
    },
    followCol: function (c) { // a country button over the ribbons: press it to follow its ribbons, press it again to let go
      this.follow = this.follow === c ? '' : c;
      this.sync();
    },

    build: function () {
      this.built = true;
      var self = this, countries = {};
      try { var saved = localStorage.getItem('cp-sup-mode'); if (saved === 'table' || saved === 'detailed') this.savedTab = 'table'; } catch (e) { }
      this.groupStages();

      var sel = $('#sup-country'), other = 0;
      this.rows.forEach(function (r) { countries[r.country] = (countries[r.country] || 0) + 1; });
      Object.keys(countries).forEach(function (c) { if (self.CO.indexOf(c) < 0) other += countries[c]; });
      Object.keys(countries).sort(function (a, b) { return countries[b] - countries[a]; }).forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = cname(c) + ' (' + countries[c] + ')'; sel.appendChild(o); });
      var eu = this.rows.filter(function (r) { return self.EU27.indexOf(r.country) >= 0; }).length;
      if (eu) { var eo = document.createElement('option'); eo.value = '__eu'; eo.textContent = 'EU-27 members (' + eu + ')'; sel.appendChild(eo); }
      if (other) { var oo = document.createElement('option'); oo.value = '__other'; oo.textContent = 'Other countries (' + other + ')'; sel.appendChild(oo); }
      this.otherCount();
      sel.addEventListener('change', function () { self.setCountry(sel.value, false); });
      // over the ribbons, the switch that counts the EU-27 as one column; beside them, the buttons that follow a country's
      // ribbons, and the note on how a firm is given a country
      $$('#sup-group .sup-gbtn').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-group') === self.group ? 'true' : 'false');
        b.addEventListener('click', function () { self.setGroup(b.getAttribute('data-group')); });
      });
      var note = $('#sup-note'); if (note) note.textContent = this.NOTE;
      var chipBox = $('#sup-chips'); if (chipBox) chipBox.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('.sup-chip') : null; if (b) self.followCol(b.getAttribute('data-c')); });
      this.chips();
      // the tabs change the list in place and keep the reader where they are; the address follows (url)
      $$('.sup-tabs a').forEach(function (a) { a.addEventListener('click', function (e) { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return; e.preventDefault(); self.setTab(a.getAttribute('data-tab')); }); });

      $('#sup-chk').addEventListener('change', function (e) { self.chk = e.target.value; self.render(); });
      var supTimer; $('#sup-search').addEventListener('input', function (e) { var v = e.target.value; clearTimeout(supTimer); supTimer = setTimeout(function () { self.q = v.trim().toLowerCase(); self.render(); }, 120); });
      $('#sup-copy').addEventListener('click', function () { self.copy(); });
      var allStages = $('#sup-allstages'); if (allStages) allStages.addEventListener('click', function () { self.clearStage(); });
      $('#sup-table').addEventListener('click', function (e) { var b = e.target.closest('button[data-sort]'); if (b) self.sortBy(b.getAttribute('data-sort')); });
      $$('#sup-ladder, #sup-ladder-cc').forEach(function (l) { l.addEventListener('click', function (e) { var b = e.target.closest('.sup-name'); if (b) self.openName(b); }); });

      this.buildLadder();
      this.buildCountries();
      this.legend();
      this.drawPipe();
      var host = $('#sup-pipe-scroll');
      host.addEventListener('scroll', function () { self.hideTip(); });
      // the tip stays while the pointer moves onto it, and Escape closes it (WCAG 1.4.13; accessibility #10)
      var tipEl = $('#sup-tip');
      if (tipEl) { tipEl.addEventListener('mouseenter', function () { clearTimeout(self.tipT); }); tipEl.addEventListener('mouseleave', function () { self.hideTip(); }); }
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var t = $('#sup-tip'); if (t && !t.hidden) self.hideTip(); } });
      var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { self.fitPipe(); }, 160); });
      this.sync();
      this.render();
    },

    /* every stage carries its firms, its count by country and its Critical names; the drawing reads only this */
    groupStages: function () {
      var self = this, by = {};
      this.rows.forEach(function (r, i) {
        r._ix = i; // where the row sits in the dataset, so a name button can find it again
        var s = by[r.category] || (by[r.category] = { name: r.category, rows: [], crit: [], by: {}, n: 0 });
        s.rows.push(r); s.n++;
        var c = self.colOf(r.country);
        s.by[c] = (s.by[c] || 0) + 1;
        if (r.chokepoint === 'Critical') s.crit.push(r.name);
      });
      var order = this.ORDER.filter(function (c) { return by[c]; }); // a category the data adds later lands at the end
      Object.keys(by).sort().forEach(function (c) { if (order.indexOf(c) < 0) order.push(c); });
      this.stages = order.map(function (c, i) { var s = by[c]; s.i = i; s.short = self.SHORT[c] || c; s.id = 'sup-rung-' + i; return s; });
    },
    coName: function (c) { return c === 'Other' ? 'Other' : c === 'EU' ? 'European Union' : cname(c); },
    otherNames: function (rows) { var seen = {}; rows.forEach(function (r) { if (this.colOf(r.country) !== r.country) seen[cname(r.country)] = 1; }, this); return Object.keys(seen).sort(); }, // the real countries behind an Other or EU band or ribbon

    /* ---- the ribbons: countries on the left, the segments on the right ---- */
    fitPipe: function () {
      var host = $('#sup-pipe-scroll'); if (!host) return;
      if (Math.max(280, Math.round(host.clientWidth) || 280) !== this.drawW) this.drawPipe();
    },
    drawPipe: function () { // the ribbons: countries on the left, the twenty segments on the right, a ribbon for every pairing, its width the firms
      var self = this, host = $('#sup-pipe-scroll'); if (!host || !host.clientWidth) return; // a hidden view has no width; it is drawn when it opens
      var st = this.stages, n = st.length; if (!n) return;
      // drawn to the column's width; a phone gets country codes on the left and a taller field, so every segment label stays on screen
      var W = Math.max(280, Math.round(host.clientWidth) || 280), tight = W < 1000, phone = W < 600;
      this.drawW = W;
      var cols = this.cols(), nc = cols.length;
      var total = this.rows.length || 1;
      var H = phone ? 720 : tight ? 520 : 580, padT = 16, padB = 16, inner = H - padT - padB;
      var x0 = phone ? 66 : tight ? 128 : 172, wL = phone ? 10 : 12, x1 = W - (phone ? 150 : tight ? 168 : 214), wR = phone ? 8 : 10;
      var coLab = function (c) { return phone ? c : self.coName(c); };
      var gL = 8, gR = 4;
      var uL = (inner - gL * (nc - 1)) / total, uR = (inner - gR * (n - 1)) / total;
      var cTot = {}; cols.forEach(function (c) { cTot[c] = 0; });
      st.forEach(function (s) { cols.forEach(function (c) { cTot[c] += s.by[c] || 0; }); });
      var ly = {}, y = padT;                                             // the left nodes, in the fixed country order
      cols.forEach(function (c) { ly[c] = [y, y + cTot[c] * uL]; y += cTot[c] * uL + gL; });
      var ry = [], y2 = padT;                                            // the right nodes, in the segments' chain order
      st.forEach(function (s) { ry.push([y2, y2 + s.n * uR]); y2 += s.n * uR + gR; });
      var curL = {}, curR = []; cols.forEach(function (c) { curL[c] = ly[c][0]; }); st.forEach(function (s, i) { curR[i] = ry[i][0]; });
      var ribs = '', mx = (x0 + wL + x1) / 2;
      cols.forEach(function (c) {                                        // each country's ribbons leave in segment order; each segment's arrive in country order
        st.forEach(function (s, i) {
          var k = s.by[c] || 0; if (!k) return;
          var kc = s.rows.filter(function (r) { return self.colOf(r.country) === c && r.chokepoint === 'Critical'; }).length;
          var a0 = curL[c], a1 = a0 + k * uL, b0 = curR[i], b1 = b0 + k * uR;
          curL[c] = a1; curR[i] = b1;
          // the pairing's Critical firms ride on top as a ribbon of their own, as wide as their count, so the red wine counts them
          var am = a0 + kc * uL, bm = b0 + kc * uR, xa = x0 + wL;
          var path = function (A0, A1, B0, B1, cls) {
            return '<path class="sup-band sup-rib c-' + c + cls + '" data-c="' + c + '" data-i="' + i + '" d="M' + xa + ',' + A0.toFixed(1) +
              ' C' + mx.toFixed(1) + ',' + A0.toFixed(1) + ' ' + mx.toFixed(1) + ',' + B0.toFixed(1) + ' ' + x1 + ',' + B0.toFixed(1) +
              ' L' + x1 + ',' + B1.toFixed(1) + ' C' + mx.toFixed(1) + ',' + B1.toFixed(1) + ' ' + mx.toFixed(1) + ',' + A1.toFixed(1) + ' ' + xa + ',' + A1.toFixed(1) + 'Z"></path>';
          };
          if (kc) ribs += path(a0, am, b0, bm, ' is-crit');
          if (kc < k) ribs += path(am, a1, bm, b1, '');
        });
      });
      var fsL = phone ? 11.5 : tight ? 12.5 : 13.5, fsR = phone ? 11 : tight ? 11.5 : 12.5; // no label under 11 px (redesign, 25 Oct 2026)
      var nodesL = '', hitsL = '';
      cols.forEach(function (c) {
        var yy = ly[c], mid = (yy[0] + yy[1]) / 2;
        nodesL += '<rect class="sup-cnode c-' + c + '" data-c="' + c + '" x="' + x0 + '" y="' + yy[0].toFixed(1) + '" width="' + wL + '" height="' + Math.max(1.5, yy[1] - yy[0]).toFixed(1) + '"></rect>' +
          '<text class="sup-clab" x="' + (x0 - 10) + '" y="' + (mid + 4.5).toFixed(1) + '" font-size="' + fsL + '">' + esc(coLab(c)) + '<tspan class="sup-cn"> ' + cTot[c] + '</tspan></text>';
        hitsL += '<rect class="sup-chit" data-c="' + c + '" x="0" y="' + Math.max(0, yy[0] - 4).toFixed(1) + '" width="' + (x0 + wL + 6) + '" height="' + Math.max(18, yy[1] - yy[0] + 8).toFixed(1) + '"></rect>';
      });
      var nodesR = '', labs = '', hits = '';
      st.forEach(function (s, i) {
        var yy = ry[i], mid = (yy[0] + yy[1]) / 2;
        nodesR += '<rect class="sup-snode" data-i="' + i + '" x="' + x1 + '" y="' + yy[0].toFixed(1) + '" width="' + wR + '" height="' + Math.max(1.5, yy[1] - yy[0]).toFixed(1) + '"></rect>';
        labs += '<g class="sup-lab" data-i="' + i + '"><text class="sup-lab-t" x="' + (x1 + wR + 8) + '" y="' + (mid + 4).toFixed(1) + '" font-size="' + fsR + '">' + esc(s.short) + '<tspan class="sup-lab-n"> ' + s.n + '</tspan></text></g>';
        var top = Math.min(yy[0], mid - 9), hgt = Math.max(18, yy[1] - yy[0]);
        hits += '<rect class="sup-hit" data-i="' + i + '" x="' + (x1 - 6) + '" y="' + top.toFixed(1) + '" width="' + (W - x1 + 6) + '" height="' + hgt.toFixed(1) +
          '" role="button" tabindex="' + (i === self.at ? '0' : '-1') + '" aria-label="' + esc(s.name + ': ' + s.n + ' firms, ' + s.crit.length + ' critical.') + '"></rect>';
      });
      // tabindex -1: Chrome otherwise makes the drawing itself a tab stop (its content overflows it), one before the stages
      host.innerHTML = '<svg class="sup-pipe-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" tabindex="-1" role="group" aria-label="Countries to segments: a ribbon for every country and segment pairing, its width the number of firms, red wine for the Critical firms' + (this.group === 'eu' ? '. The EU-27 members are drawn as one' : '') + '">' +
        '<defs><clipPath id="sup-wipe-clip"><rect class="sup-wipe' + (this.wiped ? '' : ' is-new') + '" x="0" y="0" width="' + W + '" height="' + H + '"></rect></clipPath></defs>' +
        '<g class="sup-flow" clip-path="url(#sup-wipe-clip)">' + ribs + nodesL + nodesR + '<g class="sup-labels">' + labs + '</g><g class="sup-clabs">' + '</g></g>' +
        '<g class="sup-chits">' + hitsL + '</g><g class="sup-hits">' + hits + '</g></svg>';
      // the country labels must sit above the hit rects to stay crisp, but the hits must catch the pointer: labels go last, pointer-events off
      var svg = $('.sup-pipe-svg', host);
      var clabs = ''; cols.forEach(function (c) { var yy = ly[c], mid = (yy[0] + yy[1]) / 2; clabs += '<text class="sup-clab" x="' + (x0 - 10) + '" y="' + (mid + 4.5).toFixed(1) + '" font-size="' + fsL + '">' + esc(coLab(c)) + '<tspan class="sup-cn"> ' + cTot[c] + '</tspan></text>'; });
      $$('.sup-clab', svg).forEach(function (t) { t.parentNode.removeChild(t); });
      svg.insertAdjacentHTML('beforeend', '<g class="sup-clabs" pointer-events="none">' + clabs + '</g>');
      this.wiped = true;
      this.x1 = x1;
      var x = function () { return x1; };                                // the keyboard scroll-into-view below asks where a segment sits
      var hot = function (sel, on) { svg.setAttribute('data-hot', on ? '1' : '0'); $$('.sup-rib', svg).forEach(function (r) { if (on && sel(r)) r.setAttribute('data-hot', '1'); else r.removeAttribute('data-hot'); }); };
      svg.addEventListener('mouseover', function (e) {
        var rib = e.target.closest ? e.target.closest('.sup-rib') : null;
        clearTimeout(self.tipT); // back on the drawing before the tip went: it stays, or the new one takes its place
        if (rib) { var rc = rib.getAttribute('data-c'), ri = rib.getAttribute('data-i'); hot(function (r) { return r.getAttribute('data-c') === rc && r.getAttribute('data-i') === ri; }, true); self.showRibTip(rib.getAttribute('data-c'), +rib.getAttribute('data-i'), rib, e); return; }
        var ch = e.target.closest ? e.target.closest('.sup-chit') : null;
        if (ch) { var c = ch.getAttribute('data-c'); hot(function (r) { return r.getAttribute('data-c') === c; }, true); self.showCountryTip(c, ch); return; }
        var h = e.target.closest ? e.target.closest('.sup-hit') : null;
        if (h) { var i = +h.getAttribute('data-i'); hot(function (r) { return +r.getAttribute('data-i') === i; }, true); self.showTip(i); }
      });
      svg.addEventListener('mouseleave', function () { clearTimeout(self.tipT); self.tipT = setTimeout(function () { self.hideTip(); }, 260); }); // a moment to reach the tip; hideTip clears the lit ribbons too
      svg.addEventListener('click', function (e) {
        var rib = e.target.closest ? e.target.closest('.sup-rib') : null;
        if (rib) { var c0 = rib.getAttribute('data-c'); self.stage = ''; self.setCountry(self.keyOf(c0), false, true); self.goStage(+rib.getAttribute('data-i')); return; } // a ribbon sets its country, never clears it
        var ch = e.target.closest ? e.target.closest('.sup-chit') : null;
        if (ch) { var c = ch.getAttribute('data-c'); self.setCountry(self.keyOf(c), true); return; }
        var h = e.target.closest ? e.target.closest('.sup-hit') : null;
        if (h) self.goStage(+h.getAttribute('data-i'));
      });
      svg.addEventListener('focusin', function (e) {
        var h = e.target.closest ? e.target.closest('.sup-hit') : null; if (!h) return;
        self.at = +h.getAttribute('data-i'); self.roving(); hot(function (r) { return +r.getAttribute('data-i') === self.at; }, true); self.showTip(self.at, true);
      });
      svg.addEventListener('focusout', function () { hot(null, false); self.hideTip(); });
      svg.addEventListener('keydown', function (e) {
        var h = e.target.closest ? e.target.closest('.sup-hit') : null; if (!h) return;
        var i = +h.getAttribute('data-i'), key = e.key, j = -1;
        if (key === 'ArrowRight' || key === 'ArrowDown') j = Math.min(n - 1, i + 1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') j = Math.max(0, i - 1);
        else if (key === 'Home') j = 0;
        else if (key === 'End') j = n - 1;
        else if (key === 'Enter' || key === ' ') { e.preventDefault(); self.goStage(i); return; }
        if (j < 0) return;
        e.preventDefault(); self.at = j; self.roving();
        var t = $('.sup-hit[data-i="' + j + '"]', svg); if (!t) return;
        var xl = x(j);                                                   // keep the focused stage inside the scroller
        if (xl - host.scrollLeft < 70) host.scrollLeft = Math.max(0, xl - 70);
        else if (xl - host.scrollLeft > host.clientWidth - 70) host.scrollLeft = xl - host.clientWidth + 70;
        t.focus();
      });
      var edge = function () { host.setAttribute('data-end', host.scrollLeft + host.clientWidth >= host.scrollWidth - 2 ? '1' : '0'); }; // a faded right edge says the drawing keeps going
      if (!host.getAttribute('data-wired')) { host.setAttribute('data-wired', '1'); host.addEventListener('scroll', edge); }
      edge();
      this.sync();
    },
    wrapLabel: function (text, maxChars) {                               // two lines is the budget; the rest is squeezed
      var words = String(text).split(' '), lines = [''], i, t;
      for (i = 0; i < words.length; i++) {
        t = lines[lines.length - 1] ? lines[lines.length - 1] + ' ' + words[i] : words[i];
        if (t.length <= maxChars || !lines[lines.length - 1]) lines[lines.length - 1] = t;
        else if (lines.length < 2) lines.push(words[i]);
        else lines[1] += ' ' + words[i];
      }
      return lines;
    },
    roving: function () { // one tab stop for the whole drawing; the arrow keys walk the segments
      var self = this;
      $$('.sup-hit').forEach(function (r) { r.setAttribute('tabindex', +r.getAttribute('data-i') === self.at ? '0' : '-1'); });
    },
    legend: function () { // the key: gray for the firms on the list, red wine for those rated Critical
      $('#sup-legend').innerHTML = '<span class="sup-lg"><i class="sup-all-sw" aria-hidden="true"></i>Firms on the list, by headquarters</span>' +
        '<span class="sup-lg"><i class="sup-crit-sw" aria-hidden="true"></i>Of them, firms rated Critical</span>';
    },
    chips: function () { // one button a column of the drawing, so the EU-27 view has one for the EU
      var self = this, box = $('#sup-chips'); if (!box) return;
      box.innerHTML = this.cols().map(function (c) { return '<button type="button" class="sup-chip" data-c="' + c + '" aria-pressed="' + (self.follow === c) + '">' + esc(self.coName(c)) + '</button>'; }).join('');
    },
    tipAt: function (el, anchor, alignRight) { // place #sup-tip beside an element of the drawing, inside #sup-pipe
      var host = $('#sup-pipe'); if (!host || !anchor) return;
      el.hidden = false;
      var r = anchor.getBoundingClientRect(), m = host.getBoundingClientRect(), w = el.offsetWidth, hh = el.offsetHeight;
      var left = alignRight ? r.left - m.left - w - 10 : r.right - m.left + 10;
      left = Math.max(0, Math.min(left, m.width - w));
      var top = r.top - m.top + r.height / 2 - hh / 2;
      top = Math.max(0, Math.min(top, m.height - hh));
      el.style.left = Math.round(left) + 'px'; el.style.top = Math.round(top) + 'px';
    },
    showTip: function (i, focused) { // a segment: its firms by country and its Critical names
      var s = this.stages[i], el = $('#sup-tip'), hit = $('.sup-hit[data-i="' + i + '"]');
      if (!s || !el || !hit) return;
      var self = this, co = '';
      this.cols().forEach(function (c) {
        var v = s.by[c] || 0; if (!v) return;
        co += '<span class="sup-tip-c"><i class="sup-sw c-' + c + '"></i>' + esc(c) + '<b>' + v + '</b></span>';
      });
      el.innerHTML = '<b>' + esc(s.name) + '</b><span class="sup-tip-n">' + s.n + ' firms</span><span class="sup-tip-co">' + co + '</span>' +
        (s.crit.length ? '<span class="sup-tip-crit"><i class="sup-crit-sw"></i>Critical: ' + esc(s.crit.join(', ')) + '</span>' : '');
      this.tipAt(el, hit, true);
      $$('.sup-lab').forEach(function (g) { if (+g.getAttribute('data-i') === i) g.setAttribute('data-hot', '1'); else g.removeAttribute('data-hot'); });
    },
    showCountryTip: function (c, anchor) { // a country: how many firms, in which segments, and its Critical names
      var self = this, el = $('#sup-tip'); if (!el) return;
      var rows = this.rows.filter(function (r) { return self.colOf(r.country) === c; });
      var by = {}; rows.forEach(function (r) { by[r.category] = (by[r.category] || 0) + 1; });
      var stages = this.stages.filter(function (s) { return by[s.name]; }).map(function (s) { return esc(s.short) + ' <b>' + by[s.name] + '</b>'; });
      var crit = rows.filter(function (r) { return r.chokepoint === 'Critical'; }).map(function (r) { return r.name; });
      var others = c === 'Other' || c === 'EU' ? this.otherNames(rows) : [];
      el.innerHTML = '<b>' + esc(this.coName(c)) + '</b><span class="sup-tip-n">' + rows.length + ' firms across ' + stages.length + ' segments</span>' +
        (others.length ? '<span class="sup-tip-co">' + esc(others.join(', ')) + '</span>' : '') +
        '<span class="sup-tip-co sup-tip-stages">' + stages.join(' · ') + '</span>' +
        (crit.length ? '<span class="sup-tip-crit"><i class="sup-crit-sw"></i>Critical: ' + esc(crit.join(', ')) + '</span>' : '');
      this.tipAt(el, anchor, false);
    },
    showRibTip: function (c, i, anchor, ev) { // a ribbon: the firms of one country in one segment; ev, the pointer that found it
      var self = this, s = this.stages[i], el = $('#sup-tip'); if (!s || !el) return;
      var rows = s.rows.filter(function (r) { return self.colOf(r.country) === c; });
      var isOther = c === 'Other' || c === 'EU'; // a column of several countries names each firm's own
      var names = rows.map(function (r) { var n = (r.chokepoint === 'Critical' ? '<b>' + esc(r.name) + '</b>' : esc(r.name)); return isOther ? n + ' <small>(' + esc(cname(r.country)) + ')</small>' : n; });
      var others = isOther ? this.otherNames(rows) : [];
      el.innerHTML = '<b>' + esc(this.coName(c)) + ' → ' + esc(s.name) + '</b><span class="sup-tip-n">' + rows.length + (rows.length === 1 ? ' firm' : ' firms') + (others.length ? ' from ' + esc(others.join(', ')) : '') + (names.some(function (x) { return x.indexOf('<b>') === 0; }) ? ' · bold is Critical' : '') + '</span>' +
        '<span class="sup-tip-co sup-tip-stages">' + names.join(', ') + '</span>';
      var host = $('#sup-pipe'), m = host.getBoundingClientRect(), r = anchor.getBoundingClientRect();
      el.hidden = false;
      // the tip takes the pointer now (so it can be hovered), so it sits just over the pointer, never under it, or a click on the
      // ribbon would land on the tip; below the pointer when there is no room above
      var cx = ev && ev.clientX != null ? ev.clientX : (r.left + r.right) / 2, cy = ev && ev.clientY != null ? ev.clientY : (r.top + r.bottom) / 2;
      var left = Math.max(0, Math.min(cx - m.left - el.offsetWidth / 2, m.width - el.offsetWidth)), top = cy - m.top - el.offsetHeight - 14;
      if (top < 0) top = cy - m.top + 18;
      el.style.left = Math.round(left) + 'px'; el.style.top = Math.round(top) + 'px';
    },
    hideTip: function () {
      clearTimeout(this.tipT);
      var el = $('#sup-tip'); if (el) el.hidden = true;
      $$('.sup-lab[data-hot]').forEach(function (g) { g.removeAttribute('data-hot'); });
      var svg = $('.sup-pipe-svg'); if (svg) { svg.setAttribute('data-hot', '0'); $$('.sup-rib[data-hot]', svg).forEach(function (r) { r.removeAttribute('data-hot'); }); }
    },
    goStage: function (i) { // the ribbons are the ladder's index: a segment filters the list to its firms and goes to its rung; click it again to clear
      var s = this.stages[i]; if (!s) return;
      this.hideTip();
      var off = this.stage === s.name;
      this.stage = off ? '' : s.name;
      if (!off) this.toStage();
      $$('.sup-rung').forEach(function (el) { if (!off && el.id === s.id) el.setAttribute('data-lit', '1'); else el.removeAttribute('data-lit'); });
      $$('.sup-lab').forEach(function (g) { if (!off && +g.getAttribute('data-i') === i) g.setAttribute('data-lit', '1'); else g.removeAttribute('data-lit'); });
      this.render();
      if (off) return;
      var el = document.getElementById(s.id);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },
    clearStage: function () {
      this.stage = '';
      $$('.sup-rung[data-lit], .sup-lab[data-lit]').forEach(function (el) { el.removeAttribute('data-lit'); });
      this.render();
    },

    /* ---- filters ---- */
    setCountry: function (c, scroll, force) { // a country label toggles its country; force (a ribbon) sets it, as the ribbon's stage is set
      this.country = (force ? c : (c === this.country ? '' : c)) || '';
      this.sync(); this.render();
      if (scroll) { var t = $('#sup-reg'); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
    },
    /* a link from elsewhere (the Glossary's firm and country cards) sets the whole filter, so a search or stage left from an
       earlier visit cannot narrow it: Japan's card shows all of Japan's firms (correctness P1-2) */
    show: function (f) {
      f = f || {};
      if (!this.built) this.build();
      var q = String(f.q || ''), s = $('#sup-search'), k = $('#sup-chk');
      if (s) s.value = q;
      this.q = q.trim().toLowerCase();
      this.chk = f.chk || ''; if (k) k.value = this.chk;
      this.stage = f.stage || '';
      $$('.sup-rung[data-lit], .sup-lab[data-lit]').forEach(function (el) { el.removeAttribute('data-lit'); });
      this.country = f.country || '';
      this.sync(); this.render();
    },
    sortBy: function (k) {
      if (this.sortKey === k) this.sortDir = -this.sortDir; else { this.sortKey = k; this.sortDir = 1; }
      var a = document.activeElement, inTable = !!(a && a.closest && a.closest('#sup-table'));
      this.render();
      // the table is drawn afresh, so the pressed header would take focus with it: give it to the new one (accessibility #12)
      var b = inTable ? $('#sup-table button[data-sort="' + k + '"]') : null; if (b) b.focus();
    },
    sync: function () { // every control, the ribbons and the lists show the same state
      var self = this, on = this.country, tab = this.tab;
      var sel = $('#sup-country'); if (sel) sel.value = this.country || '';
      $('#sup-ladder').hidden = tab !== 'segment';
      $('#sup-ladder-cc').hidden = tab !== 'country';
      $('#sup-wrap').hidden = tab !== 'table';
      var lh = $('#sup-ladder-h'); if (lh) { lh.hidden = tab === 'table'; lh.textContent = tab === 'country' ? 'Countries by number of firms, most first' : 'Segments from chip design to power'; }
      var key = $('#sup-key'); if (key) key.hidden = tab === 'table'; // the key names the colors of the names, so it goes with the lists
      // a pressed country button (or the route's chosen country) follows its column; else the firm filter lights each ribbon
      // that holds a firm it keeps, so a country drawn inside the Other or EU column lights those ribbons
      var lit = this.follow && this.cols().indexOf(this.follow) >= 0 ? this.follow : '';
      $$('.sup-chip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-c') === lit ? 'true' : 'false'); });
      $$('.sup-band').forEach(function (p) {
        var i = p.getAttribute('data-i'), st = on && !lit && i != null ? self.stages[+i] : null, c = p.getAttribute('data-c');
        if (st && st.rows.some(function (r) { return self.colOf(r.country) === c && self.inCountry(r); })) p.setAttribute('data-on', '1'); else p.removeAttribute('data-on');
      });
      $$('.sup-rib').forEach(function (p) { if (lit && p.getAttribute('data-c') === lit) p.setAttribute('data-lit', '1'); else p.removeAttribute('data-lit'); });
      var pipe = $('#sup-pipe'); if (pipe) { pipe.setAttribute('data-filtered', on && !lit ? '1' : '0'); pipe.setAttribute('data-lit', lit ? '1' : '0'); }
    },
    countryLabel: function () { return this.country === '__other' ? 'Other countries' : this.country === '__eu' ? 'EU-27 members' : cname(this.country); },
    filtering: function () { return !!this.stage || !!(this.country || this.chk || this.q); },
    inCountry: function (r) { // the firm filter's country test: one country, the EU-27 members, or the drawing's Other column
      if (this.country === '__other') return this.colOf(r.country) === 'Other';
      if (this.country === '__eu') return this.EU27.indexOf(r.country) >= 0;
      return !this.country || r.country === this.country;
    },
    match: function (r) {
      if (this.stage && r.category !== this.stage) return false; // a stage picked on the pipeline filters the list and the export
      if (!this.inCountry(r)) return false;
      if (this.chk && r.chokepoint !== this.chk) return false;
      if (this.q) { var hay = [r.name, r.nativeName, r.city, r.ticker, r.role, r.subcategory, (r.customers || []).join(' '), cname(r.country)].join(' ').toLowerCase(); if (hay.indexOf(this.q) < 0) return false; }
      return true;
    },
    filtered: function () {
      var self = this, CHK = this.RANK;
      var out = this.rows.filter(function (r) { return self.match(r); });
      var k = this.sortKey, d = this.sortDir;
      out.sort(function (a, b) {
        var va = k === 'chokepoint' ? CHK[a.chokepoint] : (k === 'country' ? cname(a.country) : a[k]);
        var vb = k === 'chokepoint' ? CHK[b.chokepoint] : (k === 'country' ? cname(b.country) : b[k]);
        if (va == null) return 1; if (vb == null) return -1;
        if (typeof va === 'number') return (va - vb) * d;
        return String(va).localeCompare(String(vb)) * d;
      });
      return out;
    },
    render: function () {
      var rows = this.filtered();
      $('#sup-count').textContent = (rows.length === this.rows.length ? rows.length + ' suppliers' : rows.length + ' of ' + this.rows.length + ' suppliers') +
        (this.stage ? ' · ' + this.stage : '') + (this.country ? ' · ' + this.countryLabel() : '') + (this.chk ? ' · ' + this.chk : '') +
        (this.q ? ' · matching “' + this.q + '”' : ''); // the search narrows the list too, so the line names it
      // a polite status, so the new count is read out; set after the first count, so arriving on the page says nothing (accessibility #5)
      var cnt = $('#sup-count'); if (cnt && !cnt.hasAttribute('role')) setTimeout(function () { cnt.setAttribute('role', 'status'); }, 0);
      var allBtn = $('#sup-allstages'); if (allBtn) allBtn.hidden = !this.stage;
      if (this.tab === 'table') this.renderTable(rows); else this.applyFilter();
    },

    /* ---- the ladder: the segments in the list's own order, from design to power (owner, 25 Oct), every firm named ---- */
    ladderOrder: function () {
      return this.stages.slice().sort(function (a, b) { return a.i - b.i; });
    },
    buildLadder: function () {
      var self = this, html = '';
      this.ladderOrder().forEach(function (s, r) {
        var names = s.rows.slice().sort(function (a, b) {
          return (self.RANK[a.chokepoint] - self.RANK[b.chokepoint]) || String(a.name).localeCompare(String(b.name));
        }).map(function (f) {
          return '<span class="sup-nw" data-r="' + f._ix + '"><button type="button" class="sup-name lv-' + esc(f.chokepoint || 'Important') +
            '" aria-expanded="false" aria-controls="' + s.id + '-p">' + esc(f.name) + '<i class="sup-cc">' + esc(f.country) + '</i>' +
            (f.chokepoint === 'Critical' || f.chokepoint === 'Diversified' ? '<span class="sr-only">, ' + esc(f.chokepoint) + '</span>' : '') + // the name's color, said aloud
            '</button></span>'; // the list stays names only: a firm's revenue and its China share open with the firm (detail, below)
        }).join(' '); // the lines break at these spaces, so a name never leaves its comma at the start of the next line
        // the numeral is the segment's number of firms
        html += '<section class="sup-rung" id="' + s.id + '" data-i="' + s.i + '" data-crit="' + s.crit.length + '" aria-labelledby="' + s.id + '-h">' +
          '<span class="sup-rank" aria-hidden="true">' + s.n + '</span>' +
          '<div class="sup-rung-head"><h3 class="sup-rung-name" id="' + s.id + '-h">' + esc(s.name) + '</h3>' +
          '<p class="sup-rung-n">' + self.rungCount(s.n, s.crit.length) + '</p></div>' +
          '<p class="sup-names">' + names + '</p>' +
          '<div class="sup-panel" id="' + s.id + '-p"><div class="sup-panel-in"></div></div></section>';
      });
      $('#sup-ladder').innerHTML = html;
    },
    /* ---- by country: every country on the list, the most firms first, each firm with its segment ---- */
    buildCountries: function () {
      var self = this, by = {}, html = '', seg = {};
      this.stages.forEach(function (s) { seg[s.name] = s.i; });
      this.rows.forEach(function (r) { (by[r.country] = by[r.country] || []).push(r); });
      Object.keys(by).map(function (cc) { return { cc: cc, rows: by[cc], crit: by[cc].filter(function (r) { return r.chokepoint === 'Critical'; }).length }; })
        .sort(function (a, b) { return (b.rows.length - a.rows.length) || (b.crit - a.crit) || cname(a.cc).localeCompare(cname(b.cc)); })
        .forEach(function (c) {
          var id = 'sup-cc-' + c.cc.toLowerCase();
          var names = c.rows.slice().sort(function (a, b) {
            return (self.RANK[a.chokepoint] - self.RANK[b.chokepoint]) || ((seg[a.category] || 0) - (seg[b.category] || 0)) || String(a.name).localeCompare(String(b.name));
          }).map(function (f) {
            return '<span class="sup-nw" data-r="' + f._ix + '"><button type="button" class="sup-name lv-' + esc(f.chokepoint || 'Important') +
              '" aria-expanded="false" aria-controls="' + id + '-p">' + esc(f.name) + '<i class="sup-cc">' + esc(self.SHORT[f.category] || f.category) + '</i>' +
              (f.chokepoint === 'Critical' || f.chokepoint === 'Diversified' ? '<span class="sr-only">, ' + esc(f.chokepoint) + '</span>' : '') + '</button></span>';
          }).join(' ');
          html += '<section class="sup-rung" id="' + id + '" data-crit="' + c.crit + '" aria-labelledby="' + id + '-h">' +
            '<span class="sup-rank" aria-hidden="true">' + c.rows.length + '</span>' +
            '<div class="sup-rung-head"><h3 class="sup-rung-name" id="' + id + '-h">' + esc(cname(c.cc)) + '</h3>' +
            '<p class="sup-rung-n">' + self.rungCount(c.rows.length, c.crit) + '</p></div>' +
            '<p class="sup-names">' + names + '</p>' +
            '<div class="sup-panel" id="' + id + '-p"><div class="sup-panel-in"></div></div></section>';
        });
      $('#sup-ladder-cc').innerHTML = html;
    },
    // beside a segment's or a country's name: its Critical firms, one red wine mark each (the numeral already shows the number of firms; a screen reader hears it here)
    rungCount: function (n, crit) {
      return '<span class="sr-only">' + n + ' firms. </span>' + (crit ? '<span class="sup-crit-n"><span class="sup-crit-sq" aria-hidden="true">' + new Array(crit + 1).join('<i></i>') + '</span>' + crit + ' critical</span>' : '');
    },
    applyFilter: function () { // the rungs never move; the filters only hide names and change the count
      var self = this, on = this.filtering();
      $$(this.tab === 'country' ? '#sup-ladder-cc .sup-rung' : '#sup-ladder .sup-rung').forEach(function (rung) {
        var items = $$('.sup-nw', rung), hits = 0, last = null;
        items.forEach(function (w) {
          var ok = self.match(self.rows[+w.getAttribute('data-r')]);
          w.hidden = !ok; w.classList.remove('is-last');
          if (ok) { hits++; last = w; }
        });
        if (last) last.classList.add('is-last');
        var crit = +rung.getAttribute('data-crit');
        var cn = $('.sup-rung-n', rung); if (on) cn.textContent = hits + ' of ' + items.length + ' firms'; else cn.innerHTML = self.rungCount(items.length, crit);
        rung.setAttribute('data-empty', hits ? '0' : '1');
        var open = $('.sup-name[aria-expanded="true"]', rung);
        if (open && (!hits || open.parentNode.hidden)) self.closePanel(rung);
      });
    },
    openName: function (btn) {
      var rung = btn.closest('.sup-rung'), panel = $('.sup-panel', rung);
      var was = btn.getAttribute('aria-expanded') === 'true';
      this.closePanel(rung);
      if (was) return;                                                   // one panel a rung: clicking the open name shuts it
      $('.sup-panel-in', panel).innerHTML = this.detail(this.rows[+btn.parentNode.getAttribute('data-r')]);
      btn.setAttribute('aria-expanded', 'true');
      panel.setAttribute('data-open', '1');
    },
    closePanel: function (rung) {
      var p = $('.sup-panel', rung); if (p) p.removeAttribute('data-open');
      $$('.sup-name[aria-expanded="true"]', rung).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    },
    detail: function (r) {
      if (!r) return '';
      var facts = [];
      if ((r.customers || []).length) facts.push(['Customers', esc(r.customers.join(', '))]);
      if (r.shareNote) facts.push(['Share', esc(r.shareNote)]);
      if (r.founded) facts.push(['Founded', esc(r.founded)]);
      if (r.ownership) facts.push(['Ownership', esc(r.ownership)]);
      if (r.revenueShown) facts.push(['Revenue', this.revenueHTML(r.revenueShown)]);
      else if (r.revenueUSDb != null) { // a firm with no filed revenue yet keeps its earlier dollar figure (build/build.js names them)
        var v = (r.revenueUSDb >= 10 ? r.revenueUSDb.toFixed(1) : r.revenueUSDb.toFixed(2)).replace(/0+$/, '').replace(/\.$/, '');
        facts.push(['Revenue', '$' + v + 'B' + (r.revenueYear ? ' (' + esc(r.revenueYear) + ')' : '')]);
      }
      // right under the revenue, the share of it that came from China, from the China revenue panel (for a division, its
      // parent's share, and the label says so), linked to the firm's chart of every year
      if (r.china) facts.push(['From China', '<a href="' + safeUrl(r.china.href) + '">' + esc(String(r.china.label).replace(/^China /, '')) +
        '<span class="sr-only">. Opens the chart of every year</span> <span aria-hidden="true">→</span></a>' + this.exMini(r.china.href)]);
      var tag = [r.subcategory, cname(r.country) + (r.city ? ', ' + r.city : ''), /^private$/i.test(r.ticker || '') ? '' : r.ticker].filter(Boolean).join(' · ');
      return '<div class="sup-detail-body">' +
        '<p class="sup-detail-h">' + esc(r.name) + (r.chokepoint ? ' <span class="chk ' + esc(r.chokepoint) + '">' + esc(r.chokepoint) + '</span>' : '') +
        (tag ? '<em>' + esc(tag) + '</em>' : '') + '</p>' +
        (r.role ? '<p class="sup-role">' + esc(r.role) + '</p>' : '') +
        (facts.length ? '<dl class="sup-facts">' + facts.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + f[1] + '</dd>'; }).join('') + '</dl>' : '') +
        (r.source ? '<a class="sup-src" href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" aria-label="Source for ' + esc(r.name) + '">Source</a>' : '') + '</div>';
    },
    // the firm's China revenue chart, small, under its From China line: a copy of its panel on Export Controls (#ex-<slug>, written by
    // build/build.js and already in the page), its links unwrapped and hidden from screen readers, since the line beside it says the
    // figure. A firm with no panel gets nothing. The Index firm card (src/modules/lookup.js) uses it too
    exMini: function (href) {
      var m = /\/exposure\/([a-z0-9-]+)/.exec(String(href || '')), fig = m && document.getElementById('ex-' + m[1]), svg = fig && fig.querySelector('svg');
      if (!svg) return '';
      var c = svg.cloneNode(true);
      $$('a', c).forEach(function (a) { while (a.firstChild) a.parentNode.insertBefore(a.firstChild, a); a.parentNode.removeChild(a); });
      c.removeAttribute('role'); c.removeAttribute('aria-label'); c.setAttribute('focusable', 'false');
      return '<span class="sup-ex-mini ex-panel" aria-hidden="true">' + c.outerHTML + '</span>';
    },
    // a firm's revenue as its filing prints it, linked to the filing, then the fiscal year by the month it ends, then, for a firm
    // that does not file in dollars, about how much in dollars: "¥2,443,533 million (year to March 2026), about $16.2 billion".
    // build/build.js writes every piece (revenueShown); the Index card (src/modules/lookup.js) prints it with this too
    revenueHTML: function (s) {
      if (!s || !s.filed) return '';
      return (s.href ? '<a class="rev-filed" href="' + safeUrl(s.href) + '" target="_blank" rel="noopener">' + esc(s.filed) + '<span class="sr-only">, opens the filing</span></a>' : '<span class="rev-filed">' + esc(s.filed) + '</span>') +
        (s.year ? ' (' + (s.group ? 'group revenue, ' : '') + esc(s.year) + ')' : '') + (s.about ? ', <span class="rev-usd">' + esc(s.about) + '</span>' : '');
    },

    /* ---- detailed table: every field, as before ---- */
    renderTable: function (rows) {
      var self = this;
      // aria-sort belongs on the column header, not on the button inside it (accessibility #12)
      var th = function (k, label) { return '<th' + (self.sortKey === k ? ' aria-sort="' + (self.sortDir > 0 ? 'ascending' : 'descending') + '"' : '') + '><button type="button" data-sort="' + k + '">' + label + '</button></th>'; };
      var html = '<thead><tr>' + th('name', 'Supplier') + th('category', 'Segment') + th('country', 'Country') + th('founded', 'Founded') + th('chokepoint', 'Chokepoint level') + '<th>What they make</th><th>Customers</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        html += '<tr><td class="name"><b>' + esc(r.name) + '</b><span>' + esc([r.nativeName, r.ticker].filter(Boolean).join(' · ')) + '</span>' +
          (r.china ? '<a class="sup-ex-a" href="' + safeUrl(r.china.href) + '">' + esc(r.china.label) + '</a>' : '') + '</td>' +
          '<td>' + esc(r.category) + (r.subcategory ? '<br><span class="cc" style="color:var(--muted)">' + esc(r.subcategory) + '</span>' : '') + '</td>' +
          '<td><span class="cc">' + esc(r.country) + '</span> ' + esc(r.city || '') + '</td>' +
          '<td class="num">' + (r.founded || '—') + '</td>' +
          '<td><span class="chk ' + esc(r.chokepoint || '') + '">' + esc(r.chokepoint || '') + '</span>' + (r.shareNote ? '<br><span class="cc" style="color:var(--muted)">' + esc(r.shareNote) + '</span>' : '') + '</td>' +
          '<td class="role">' + esc(r.role || '') + (r.source ? ' <a href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" class="cc" aria-label="Source for ' + esc(r.name) + '">Source</a>' : '') + '</td>' +
          '<td style="font-size:13px;color:var(--ink-2)">' + esc((r.customers || []).join(', ')) + '</td></tr>';
      });
      $('#sup-table').innerHTML = html + '</tbody>';
    },
    copy: function () {
      var rows = this.filtered(), cols = ['name', 'nativeName', 'category', 'subcategory', 'country', 'city', 'founded', 'ticker', 'ownership', 'chokepoint', 'shareNote', 'role', 'customers', 'revenueUSDb', 'revenueYear', 'source',
        'revenueAmount', 'revenueUnit', 'revenueCurrency', 'revenueFiscalYear', 'revenueFyEnd', 'revenueSource', 'revenueUSD', 'revenueUSDBasis'];
      // the filed revenue after the earlier columns: the amount as filed (without commas, so a spreadsheet reads it as a number) and the
      // revenue object's own fields, then the dollar figure build/build.js converted and the rates it used
      var REV = { revenueUnit: 'unit', revenueCurrency: 'currency', revenueFiscalYear: 'fiscalYear', revenueFyEnd: 'fyEnd', revenueSource: 'source' };
      var val = function (r, c) { return c === 'revenueAmount' ? (r.revenueShown || {}).amount : REV[c] ? (r.revenue || {})[REV[c]] : r[c]; };
      var q = function (v) { if (v == null) return ''; if (Array.isArray(v)) v = v.join('; '); return String(v).replace(/[\t\n\r]+/g, ' '); }; // tab-separated: a spreadsheet splits it on paste
      var csv = cols.join('\t') + '\n' + rows.map(function (r) { return cols.map(function (c) { return q(val(r, c)); }).join('\t'); }).join('\n');
      var btn = $('#sup-copy');
      var done = function (ok) { btn.textContent = ok ? 'Copied ' + rows.length + ' rows' : 'Copy failed'; setTimeout(function () { btn.textContent = 'Copy table'; }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(csv).then(function () { done(true); }, function () { done(false); });
      else done(false);
    }
  };

  /* ---------------- export controls: the board of flows, the scrubber and the chronology ----------------
     Each flow is a thing that moves across the chokepoint, and its state on any date is the last state
     that took effect on or before that date. Every date the board sorts or compares on is the effective
     date; the announcement date is printed beside it and never orders anything. The scrubber (By subject)
     and the scroll (By date) both do one thing — move the as-of date — and the board re-reads itself. */
  var Geo = {
    built: false, cat: null,
    tl: [], visible: null, items: [], full: false, /* visible stays null until the first render so the export bar falls back to the whole set */ at: -1, tickQ: false,
    mode: 'date', flows: null, byId: {}, evs: {}, asOf: null, now: null, years: [], yearN: {}, keys: {}, headW: 0,
    /* the five kinds of move; the colors are the .timeline .cat classes */
    CATS: [
      { name: 'US export control', label: 'US rules', short: 'US', cls: '' },
      { name: 'China', label: 'China', short: 'CN', cls: 'cn' },
      { name: 'Other governments', label: 'Other governments', short: 'Other', cls: 'ally' }, // every government but the US and China: Japan and Korea's measures on each other as well as controls on China
      { name: 'Industrial policy', label: 'Policy', short: 'Pol', cls: 'policy' },
      { name: 'Corporate', label: 'Firms', short: 'Firm', cls: 'corp' }
    ],
    /* the license outcome a flow stands in, and the word the pill carries, from open to closed. Restricted is a
       government limiting sales to some buyers or uses without banning them outright. Policy is the off-ramp for
       money and tariffs, which gate nothing. */
    STATE: { open: 'No license', restricted: 'Restricted', 'case': 'Case by case', denial: 'Presumption of denial', prohibited: 'Prohibited', policy: 'Policy' },
    /* the outcomes from the most closed down, the order a year's tally reads in */
    SEVERITY: ['prohibited', 'denial', 'case', 'restricted', 'policy'],
    /* the board's first schema had five states that did not map to outcomes: a license and a listing are
       one fact, and "shut" covered both a presumption of denial and a ban. Old data still reads. */
    OLD_STATE: { license: 'denial', shut: 'prohibited' },
    /* the instrument behind a move, in a word */
    INSTRUMENT: {
      rule: 'Rule', 'entity-listing': 'Listing', 'denial-order': 'Denial order', 'licence-policy': 'License policy',
      'licence-exception': 'Exception', enforcement: 'Enforcement', countermeasure: 'Countermeasure',
      'trade-remedy': 'Trade remedy', order: 'Order',
      'investment-screening': 'Screening', 'industrial-policy': 'Policy', corporate: 'Corporate', pending: 'Pending'
    },
    MODE_KEY: 'cp-cf-mode',
    NUMWORD: ['no', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'],
    numWord: function (n) { return this.NUMWORD[n] || String(n); },
    /* an unknown status reads as open rather than breaking the row */
    norm: function (s) { var k = String(s || 'open'); if (this.OLD_STATE[k]) k = this.OLD_STATE[k]; return this.STATE[k] ? k : 'open'; },
    word: function (s) { return this.STATE[this.norm(s)]; },
    instWord: function (v) {
      var k = String(v || '');
      if (!k) return '';
      if (this.INSTRUMENT[k]) return this.INSTRUMENT[k];
      k = k.replace(/-/g, ' '); // an instrument the data invents still reads
      return k.charAt(0).toUpperCase() + k.slice(1);
    },
    /* "89 FR 96790 · 15 CFR 742.6(b)(10)" from whatever half of it the data holds */
    citeText: function (c) {
      if (!c) return '';
      return [c.fr, c.cfr].filter(function (x) { return x; }).join(' · ');
    },
    /* what the citation line reads. A URL with no citation text falls back to the document's host, so
       the link is not lost; a cite the data has not written at all reads as nothing. */
    citeLabel: function (c) {
      var t = this.citeText(c);
      if (t) return t;
      var u = c && c.url ? safeUrl(c.url) : '';
      return u && u !== '#' ? String(c.url).replace(/^https?:\/\//, '').split('/')[0] : '';
    },
    citeHTML: function (c, cls) {
      var t = this.citeLabel(c);
      if (!t) return '';
      var u = c && c.url ? safeUrl(c.url) : '';
      return u && u !== '#'
        ? '<a class="' + cls + '" href="' + u + '" target="_blank" rel="noopener">' + esc(t) + '</a>'
        : '<span class="' + cls + '">' + esc(t) + '</span>';
    },
    lane: function (c) {
      c = c || '';
      return /China/i.test(c) ? 1 : /Other governments|Allied/i.test(c) ? 2 : /Industrial/i.test(c) ? 3 : /Corporate/i.test(c) ? 4 : 0;
    },
    build: function () {
      this.built = true;
      var mx = DATA.matrix || [], pref = ['US', 'TW', 'KR', 'JP', 'NL', 'CN', 'DE', 'GB', 'IL', 'CH', 'AT', 'SG', 'MY', 'EU-other', 'Other'];
      var present = {}; mx.forEach(function (s) { Object.keys(s.shares || {}).forEach(function (k) { if ((s.shares || {})[k] > 0) present[k] = 1; }); });
      var cols = pref.filter(function (c) { return present[c]; }).concat(Object.keys(present).filter(function (c) { return pref.indexOf(c) < 0; }));
      var used = cols;
      var html = '<thead><tr><th>Segment</th>' + used.map(function (c) { return '<th title="' + esc(cname(c)) + '">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
      mx.forEach(function (s) {
        var max = 0; used.forEach(function (c) { max = Math.max(max, (s.shares || {})[c] || 0); });
        html += '<tr title="' + esc((s.note || '') + (s.source ? ' Source: ' + s.source : '')) + '"><td>' + esc(s.segment) + '<small>' + esc((s.metric || '') + (s.year ? ' · ' + s.year : '')) + (s.aiCritical ? ' · AI-critical' : '') + '</small></td>' +
          used.map(function (c) { var v = (s.shares || {})[c] || 0; return '<td><span class="cell' + (v ? '' : ' zero') + '" style="--v:' + Math.round(Math.min(100, v) * 0.85) + '"' + (v === max && v > 0 ? ' data-hi="1"' : '') + '>' + (v ? Math.round(v) + '%' : '·') + '</span></td>'; }).join('') + '</tr>';
      });
      if ($('#matrix')) $('#matrix').innerHTML = html + '</tbody>';
      if ($('#matrix-note')) $('#matrix-note').innerHTML = mx.length ? 'Each segment shows what is measured and in which year. ' + (DATA.matrixNotesHtml ? '' : '') + 'Every figure links to its filing or report; hover a footnote for the document.' : 'The matrix has no data to show.';
      // timeline
      var tl = (DATA.timeline || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      var cats = {}; tl.forEach(function (e) { cats[e.category] = (cats[e.category] || 0) + 1; });
      var self = this, chips = $('#tl-filters'), order = this.CATS.map(function (c) { return c.name; });
      this.tl = tl;
      var names = Object.keys(cats).sort(function (a, b) { var ia = order.indexOf(a), ib = order.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
      chips.innerHTML = names.map(function (c) { return '<button type="button" class="tl-chip ' + self.CATS[self.lane(c)].cls + '" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + '<b>' + cats[c] + '</b></button>'; }).join('');
      chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var c = b.getAttribute('data-cat'); self.cat = self.cat === c ? null : c; $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === self.cat ? 'true' : 'false'); }); self.renderTimeline();
        var shown = (self.visible || []).length; self.say(self.cat ? shown + ' of ' + tl.length + ' events shown: ' + self.cat + '.' : 'All ' + tl.length + ' events shown.'); });
      // one polite status for the page: the board's date when a reader moves it, and the events a filter leaves (accessibility #5)
      var cfHost = $('#cf'); if (cfHost && !$('#cf-status')) cfHost.insertAdjacentHTML('beforeend', '<p class="sr-only" id="cf-status" role="status"></p>');
      var all = $('#tl-all'); if (all) all.addEventListener('click', function () { self.setFull(!self.full); });
      var list = $('#timeline');
      list.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('.tl-link') : null;
        if (a) { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return; e.preventDefault(); self.copyLink(a); return; } // a modified click opens the entry in a new tab
        var b = e.target.closest ? e.target.closest('button.tl-more') : null; if (b) self.setOpen(b, b.getAttribute('aria-expanded') !== 'true');
      });
      // the flows; without them the page is the chronology it has always been
      this.flows = this.loadFlows();
      tl.forEach(function (e, i) { if (!e.id) e.id = 'tl' + i; });
      // Now is the reader's own today, or the last entry's date if the chronology runs past it, so a stay reads as lapsed from
      // the day after it ends (9 and 10 Nov 2026), not from the next entry the data adds (correctness P1-3)
      var today = localISO(), lastDay = tl.length ? String(tl[tl.length - 1].date || '') : '';
      this.now = lastDay > today ? lastDay : today;
      this.asOf = this.now;
      var y0 = 2018, y1 = parseInt(this.now.slice(0, 4), 10);
      for (var y = y0; y <= y1; y++) { this.years.push(y); this.yearN[y] = 0; }
      tl.forEach(function (e) { var yy = parseInt(String(e.date).slice(0, 4), 10); if (self.yearN[yy] != null) self.yearN[yy]++; });
      if (this.flows) {
        this.flows.forEach(function (f) { self.byId[f.id] = f; self.evs[f.id] = self.eventsFor(f); });
        this.wireBoard();
        this.renderScrub();
        this.renderBoard();
        var side = $('#cf-side'); if (side) side.hidden = false;
        var sw = $('#cf-modes');
        if (sw) {
          sw.hidden = false;
          sw.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('.cf-mode') : null; if (b) self.setMode(b.getAttribute('data-mode'), true); });
        }
      } else {
      }
      window.addEventListener('scroll', function () { if (Router.current === 'controls') self.spy(); }, { passive: true });
      window.addEventListener('resize', function () { clearTimeout(self.rz); self.rz = setTimeout(function () { self.headW = 0; self.sync(); }, 160); }, { passive: true });
      this.renderTimeline();
      this.setMode(this.flows ? (this.readMode() || 'date') : 'date');
    },
    /* ---- the flows and their states ---- */
    rawFlows: function () { // the file may be a bare array or { flows: [...] }; either reads
      var raw = DATA.flows;
      if (raw && Object.prototype.toString.call(raw) === '[object Array]') return raw;
      if (raw && raw.flows && raw.flows.length) return raw.flows;
      return null;
    },
    loadFlows: function () {
      var list = this.rawFlows();
      if (!list || !list.length) return null;
      list = list.slice().filter(function (f) { return f && f.id; }).sort(function (a, b) { return (a.order == null ? 99 : a.order) - (b.order == null ? 99 : b.order); });
      list.forEach(function (f) { f.states = Geo.sortStates(f.states); });
      return list.length ? list : null;
    },
    /* states run on their effective date, never on the day the rule was announced */
    sortStates: function (st) {
      return (st || []).slice().sort(function (a, b) { return String(a.date) < String(b.date) ? -1 : String(a.date) > String(b.date) ? 1 : 0; });
    },
    /* the state of a flow as of a date: the last state that took effect on or before it, else the flow's
       initial state. A stay that has not yet lapsed marks the state suspended; once it lapses the
       outcome underneath returns on its own. */
    stateAt: function (f, date) {
      var st = f.states || [], out = null, s, k;
      for (var i = 0; i < st.length; i++) if (st[i] && st[i].date && st[i].date <= date) out = st[i];
      s = out || (f.initial && typeof f.initial === 'object' ? f.initial : null);
      if (!s) {
        k = this.norm(typeof f.initial === 'string' ? f.initial : 'open');
        return { status: k, label: this.STATE[k], date: null, announced: null, suspendedUntil: null, suspended: false, cite: null, event: null };
      }
      k = this.norm(s.status);
      return {
        status: k,
        label: s.label || this.STATE[k],
        date: out ? out.date : (s.date || null),
        announced: s.announced || null, // missing: the effective date stands for both
        suspendedUntil: s.suspendedUntil || null,
        suspended: !!(s.suspendedUntil && String(s.suspendedUntil) >= String(date)),
        cite: s.cite || null, // missing: nothing is printed
        event: s.event || null
      };
    },
    keyOf: function (s) {
      return s.status + '|' + s.label + '|' + (s.date || '') + '|' + (s.announced || '') +
        '|' + (s.suspended ? s.suspendedUntil : '') + '|' + this.citeText(s.cite) + '|' + ((s.cite && s.cite.url) || '');
    },
    /* the moves that touched a flow: the events that name it, or the events its own states name */
    eventsFor: function (f) {
      var out = [], want = {};
      (this.tl || []).forEach(function (e) { if ((e.flows || []).indexOf(f.id) >= 0) out.push(e); });
      if (out.length) return out;
      (f.states || []).forEach(function (s) { if (s.event) want[s.event] = 1; });
      (this.tl || []).forEach(function (e) { if (e.id && want[e.id]) out.push(e); });
      return out;
    },
    nMoves: function (f) { var n = (this.evs[f.id] || []).length; return n || (f.states || []).length; },
    fmtDate: function (iso) {
      var d = new Date(String(iso) + 'T00:00:00');
      return isNaN(d) ? String(iso || '') : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    readMode: function () { try { var v = localStorage.getItem(this.MODE_KEY); return v === 'date' || v === 'subject' ? v : null; } catch (e) { return null; } },
    saveMode: function (m) { try { localStorage.setItem(this.MODE_KEY, m); } catch (e) { } },
    setMode: function (m, remember) {
      var self = this, host = $('#cf');
      if (!this.flows) m = 'date';
      this.mode = m === 'date' ? 'date' : 'subject';
      if (host) host.setAttribute('data-mode', this.mode);
      $$('#cf-modes .cf-mode').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === self.mode ? 'true' : 'false'); });
      // the compact board in By date is a read-out, not a set of drawers
      $$('#cf-board .cf-btn').forEach(function (b) {
        var row = b.closest ? b.closest('.cf-row') : b.parentNode.parentNode;
        if (!row) return;
        if (self.mode === 'subject') { b.setAttribute('aria-controls', 'cf-h-' + row.getAttribute('data-f')); b.setAttribute('aria-expanded', row.getAttribute('data-open') === '1' ? 'true' : 'false'); }
        else { b.removeAttribute('aria-controls'); b.removeAttribute('aria-expanded'); }
      });
      if (remember) { this.saveMode(this.mode); this.modeBack = null; } // the reader's own choice stands
      if (this.mode === 'subject') this.setAsOf(this.now, [this.now, this.now]); // back to now, without flashing the whole board
      this.at = -1;
      this.sync();
    },
    /* one sentence per entry: the data's own gist, or the first sentence of the summary */
    gistOf: function (e) {
      if (e.gist) return e.gist;
      var s = String(e.summary || '').trim(), m = s.match(/^[\s\S]*?[.!?](?=\s|$)/), t = (m ? m[0] : s).trim();
      if (t.length > 140) t = t.slice(0, 139).replace(/\s+\S*$/, '') + '…';
      return t;
    },
    renderTimeline: function () {
      var self = this, tl = this.tl || [], html = '', year = null, list = $('#timeline');
      var rows = tl.filter(function (e) { return !self.cat || e.category === self.cat; });
      this.visible = rows;
      var counts = {};
      rows.forEach(function (e) { var y = (e.date || '').slice(0, 4); counts[y] = (counts[y] || 0) + 1; });
      rows.forEach(function (e, i) {
        var y = (e.date || '').slice(0, 4);
        if (y !== year) {
          year = y;
          html += '<li class="tl-year"><div class="year-label">' + esc(y) + '</div><span class="tl-n">' + counts[y] + (counts[y] === 1 ? ' move' : ' moves') + '</span>' + self.yearSum(y) + '</li>';
        }
        var d = new Date(e.date + 'T00:00:00');
        var ds = isNaN(d) ? esc(e.date) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        var host = e.source ? e.source.replace(/^https?:\/\//, '').split('/')[0] : '';
        var eff = e.effectiveDate && e.effectiveDate !== e.date ? e.effectiveDate : null; // a rule takes force after it is announced
        var inst = self.instWord(e.instrument), cite = self.citeText({ fr: e.frCitation, cfr: e.cfr });
        html += '<li class="tl-e" id="tl-e' + i + '" data-i="' + i + '" data-ev="' + esc(e.id || '') + '" data-date="' + esc(e.date || '') + '">' +
          '<div class="d"><b>' + ds + '</b>' + (eff ? '<span class="tl-eff">in force ' + esc(self.fmtDate(eff)) + '</span>' : '') + esc(e.actor || '') + '</div>' +
          '<div class="tl-body"><span class="cf-ev-tags"><span class="cat ' + self.CATS[self.lane(e.category)].cls + '">' + esc(e.category || '') + '</span>' +
          (inst ? '<span class="cf-inst">' + esc(inst) + '</span>' : '') + '</span>' +
          '<h4>' + esc(e.title) + '</h4><p class="tl-gist">' + esc(self.gistOf(e)) + '</p>' +
          (cite ? self.citeHTML({ fr: e.frCitation, cfr: e.cfr, url: e.source }, 'cf-ev-cite') : '') +
          '<button type="button" class="tl-more" aria-expanded="false" aria-controls="tl-p' + i + '">More</button>' +
          // the entry's own address (#/controls/<event-id>, stable as entries are added); a click copies it
          (e.id ? '<a class="tl-more tl-link" href="' + esc('#/controls/' + encodeURIComponent(e.id)) + '" style="margin-left:14px;text-decoration:none" aria-label="Copy a link to this entry" title="Copy a link to this entry">Link</a>' : '') +
          '<div class="tl-panel" id="tl-p' + i + '" hidden><p>' + esc(e.summary || '') + '</p>' +
          (host ? '<a class="src" href="' + safeUrl(e.source) + '" target="_blank" rel="noopener">' + esc(host) + '</a>' : '') +
          '</div></div></li>';
      });
      list.innerHTML = html || '<li class="tl-empty"><p>No events in this category.</p></li>';
      this.items = $$('.tl-e', list);
      if (this.full) this.setFull(true);
      this.reveal();
      this.at = -1; this.spy();
      list.dispatchEvent(new CustomEvent('cp:rows'));
    },
    /* under each year on a phone: where the flows stood when the year ended, counted by outcome. A stay
       counts under the outcome it holds up, and is named again on its own. */
    yearSum: function (y) {
      var self = this, last = this.years[this.years.length - 1];
      if (!this.flows) return '';
      var end = parseInt(y, 10) >= last ? this.now : y + '-12-31';
      var counts = {}, order = this.SEVERITY, parts = [], susp = 0;
      this.flows.forEach(function (f) {
        var s = self.stateAt(f, end);
        if (s.status !== 'open') counts[s.status] = (counts[s.status] || 0) + 1;
        if (s.suspendedUntil && String(s.suspendedUntil) >= String(end)) susp++;
      });
      order.forEach(function (k) { if (counts[k]) parts.push(counts[k] + ' ' + esc(String(self.STATE[k]).toLowerCase())); });
      if (susp) parts.push(susp + ' suspended');
      if (!parts.length) return '';
      var n = this.flows.length; // counted, never assumed: the board's row count changes with the data
      return '<p class="cf-sum">' + (parseInt(y, 10) >= last ? 'Now' : 'End of ' + esc(y)) + ' · ' + parts.join(' · ') + ' · of the ' + n + (n === 1 ? ' row' : ' rows') + ' on the board</p>';
    },
    setOpen: function (btn, open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Less' : 'More';
      var p = document.getElementById(btn.getAttribute('aria-controls'));
      if (p) p.hidden = !open;
    },
    setFull: function (on) {
      var self = this;
      this.full = !!on;
      var b = $('#tl-all'); if (b) b.setAttribute('aria-pressed', this.full ? 'true' : 'false');
      $$('#timeline button.tl-more').forEach(function (btn) { self.setOpen(btn, self.full); });
    },
    /* #/controls/<event-id>: the chronology, that entry opened and marked, scrolled to just under the masthead */
    focusEvent: function (id, jumpIt) { // jumpIt: a first load or an arrival from another view, so no glide
      var self = this, ev = null, li = null;
      (this.tl || []).forEach(function (e) { if (e.id === id) ev = e; });
      if (!ev) return false;
      if (this.flows && this.mode !== 'date') { var back = this.mode; this.setMode('date', false); this.modeBack = back; } // By subject hides the chronology; the router gives it back when the reader leaves the entry
      if (this.cat && ev.category !== this.cat) { // a category filter that hides the entry gives way
        this.cat = null;
        $$('#tl-filters button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        this.renderTimeline();
      }
      (this.items || []).forEach(function (el) { if (el.getAttribute('data-ev') === id) li = el; });
      if (!li) return false;
      this.mark(li);
      var more = li.querySelector('button.tl-more'); if (more) this.setOpen(more, true);
      li.classList.add('is-in'); // already risen: the entrance animation would slide it under the reader's eye
      scrollToEl(li, !jumpIt);
      if (jumpIt) Router.settle(li);
      return true;
    },
    mark: function (li) { (this.items || []).forEach(function (el) { el.classList.toggle('is-target', el === li); }); },
    /* the link control on each entry: the address bar takes the entry's address, and the full URL goes to the clipboard */
    copyLink: function (a) {
      var canon = $('link[rel="canonical"]'), base = canon && canon.href ? canon.href.replace(/#.*$/, '') : location.href.replace(/#.*$/, '');
      var href = a.getAttribute('href'), url = base + href, li = a.closest ? a.closest('.tl-e') : null;
      try { history.replaceState(null, '', href); } catch (e) { }
      if (li) this.mark(li);
      var done = function () { a.textContent = 'Copied'; a.setAttribute('data-done', '1'); setTimeout(function () { a.textContent = 'Link'; a.removeAttribute('data-done'); }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
      else window.prompt('Copy this link', url);
    },
    /* "Coming up": the dated deadlines ahead (DATA.flows.upcoming), counted down from the reader's own today;
       gone when there are none or every date has passed */
    renderUpcoming: function () {
      var raw = DATA.flows && DATA.flows.upcoming, host = $('#cf-upcoming');
      var today = new Date(); today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var day = function (iso) { var p = String(iso || '').split('-').map(Number); return p.length === 3 && p[0] ? new Date(p[0], p[1] - 1, p[2]) : null; };
      var list = (Object.prototype.toString.call(raw) === '[object Array]' ? raw : []).map(function (u) {
        var d = u && day(u.date); return d ? { u: u, n: Math.round((d - today) / 86400000) } : null;
      }).filter(function (x) { return x && x.n >= 0; }).sort(function (a, b) { return a.n - b.n; });
      if (!list.length) { if (host) host.hidden = true; return; }
      if (!host) {
        var sub = $('.view[data-view="controls"] .sub[data-sub="timeline"]'); if (!sub) return;
        host = document.createElement('section'); host.className = 'cf-up'; host.id = 'cf-upcoming'; host.setAttribute('aria-labelledby', 'cf-up-h');
        sub.insertBefore(host, sub.firstChild);
      }
      var self = this;
      if (!host._wired) { // the address may already be that entry's, so no hashchange would come: go there anyway
        host._wired = true;
        host.addEventListener('click', function (e) {
          var a = e.target.closest ? e.target.closest('a.cf-up-link') : null;
          if (a && a.getAttribute('href') === location.hash && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)) { e.preventDefault(); Router.route(); }
        });
      }
      host.hidden = false;
      // the deadlines first (the page's own order): the date, how far off it is, what happens, and the entry or source behind it.
      // A deadline within a month is ink, the others muted; the accent never marks a data value (src/modules/controls.css .cf-up)
      host.innerHTML = '<h2 class="cf-up-h" id="cf-up-h">Coming up</h2><ol class="cf-up-list">' + list.map(function (x) {
        var u = x.u, when = x.n === 0 ? 'Today' : x.n === 1 ? 'Tomorrow' : 'In ' + x.n + ' days'; // sentence case as written: CSS sets no capitals
        var link = u.event ? '<a class="cf-up-link" href="' + esc('#/controls/' + encodeURIComponent(u.event)) + '" aria-label="Entry in the timeline">Entry <span aria-hidden="true">→</span></a>'
          : (u.source && safeUrl(u.source) !== '#' ? '<a class="cf-up-link" href="' + safeUrl(u.source) + '" target="_blank" rel="noopener">Source</a>' : '');
        return '<li class="cf-up-i' + (x.n <= 30 ? ' is-soon' : '') + '"><span class="cf-up-d">' + esc(self.fmtDate(u.date)) + '</span>' +
          '<span class="cf-up-n">' + esc(when) + '</span>' +
          '<span class="cf-up-t">' + esc(u.label || '') + link + '</span></li>';
      }).join('') + '</ol>';
    },
    /* entries rise into view once; with no observer they simply stay readable */
    reveal: function () {
      if (reduced || !window.IntersectionObserver || !this.items.length) return;
      if (this.io) this.io.disconnect();
      var io = new IntersectionObserver(function (ents) {
        for (var i = 0; i < ents.length; i++) if (ents[i].isIntersecting) { ents[i].target.classList.add('is-in'); io.unobserve(ents[i].target); }
      }, { rootMargin: '0px 0px -24px 0px' });
      this.items.forEach(function (el) { io.observe(el); });
      this.io = io;
    },
    /* ---- the board: one row per flow, its state as of the scrubber date ----
       The whole header opens the row, so the button is laid over it rather than wrapped around it: the
       citation is a link, and a link may not sit inside a button. */
    renderBoard: function () {
      var self = this, host = $('#cf-board');
      if (!host || !this.flows) return;
      host.innerHTML = this.flows.map(function (f, i) {
        var st = self.stateAt(f, self.asOf), n = self.nMoves(f), id = esc(f.id);
        self.keys[f.id] = self.keyOf(st);
        return '<section class="cf-row" data-f="' + id + '" data-open="0" style="--d:' + Math.min(320, i * 34) + 'ms">' +
          '<h4 class="cf-rowh">' +
          '<button type="button" class="cf-btn" id="cf-b-' + id + '" aria-expanded="false" aria-controls="cf-h-' + id + '" aria-label="' + esc(self.rowLabel(f, st, n)) + '"></button>' +
          '<span class="cf-id"><span class="cf-name">' + esc(f.name || f.id) + '</span>' +
          (f.route ? '<span class="cf-route">' + esc(f.route) + '</span>' : '') +
          (f.what ? '<span class="cf-what">' + esc(f.what) + '</span>' : '') + '</span>' +
          '<span class="' + self.rampClass(st) + '" style="--i:' + self.rampAt(st) + '" aria-hidden="true"><i class="cf-ramp-t"></i>' +
          '<i class="cf-ramp-k" style="left:0"></i><i class="cf-ramp-k" style="left:25%"></i><i class="cf-ramp-k" style="left:50%"></i><i class="cf-ramp-k" style="left:75%"></i><i class="cf-ramp-k" style="left:100%"></i>' +
          '<i class="cf-ramp-f"></i><i class="cf-ramp-d"></i></span>' +
          '<span class="cf-state">' + self.pillHTML(st) + '</span>' +
          '<span class="cf-n">' + n + (n === 1 ? ' event' : ' events') + '</span>' +
          '<span class="cf-caret" aria-hidden="true"></span></h4>' +
          '<div class="cf-hist" id="cf-h-' + id + '" role="region" aria-labelledby="cf-b-' + id + '"><div class="cf-hist-in"></div></div>' +
          '</section>';
      }).join('');
      if (!reduced) host.setAttribute('data-in', '1');
    },
    /* the row's scale: five steps from No license to Prohibited, a dot at the state, ink up to Case by case and garnet from a
       presumption of denial. Policy rows get the bare track (money and tariffs gate nothing). The row's button already says the
       state, so the scale is hidden from screen readers */
    RAMP: ['open', 'restricted', 'case', 'denial', 'prohibited'],
    rampAt: function (st) { return Math.max(0, this.RAMP.indexOf(st.status)); },
    rampClass: function (st) {
      return 'cf-ramp' + (st.status === 'policy' ? ' is-policy' : '') + (this.rampAt(st) >= 3 ? ' is-closed' : '') + (st.suspended ? ' is-susp' : '');
    },
    /* the row read aloud: the button carries no text of its own, so it says what the row says */
    rowLabel: function (f, st, n) {
      return [f.name || f.id, f.route, this.STATE[st.status] + (st.suspended ? ', suspended until ' + this.fmtDate(st.suspendedUntil) : ''),
      st.date ? 'from ' + this.fmtDate(st.date) : 'open since 2018', n + (n === 1 ? ' event' : ' events')].filter(function (x) { return x; }).join(', ');
    },
    /* the glossary's own terms inside a state label become popover buttons, so TPP and the Entity List are defined in place */
    GLOSS: [[/\bTPP\b/g, 'tpp', 'TPP'], [/\bEntity List\b/g, 'entity list', 'Entity List'], [/\bFDPR\b/g, 'foreign direct product rule', 'FDPR'], [/\bforeign direct product rule\b/gi, 'foreign direct product rule', 'foreign direct product rule'], [/\blicen[cs]e exception\b/gi, 'license exception', 'license exception']],
    gloss: function (text) {
      var out = esc(text);
      // a span, not a button: the label sits inside the row's own button, and a button cannot nest inside a button
      this.GLOSS.forEach(function (g) { out = out.replace(g[0], '<span class="gl-term gl-term--inline" data-term="' + g[1] + '">' + g[2] + '</span>'); });
      return out;
    },
    /* the pill, the stay beside it, the label, the two dates and the citation */
    pillHTML: function (st) {
      var word = this.STATE[st.status];
      var dates = st.date ? 'from ' + this.fmtDate(st.date) : 'open since 2018';
      if (st.announced && st.date && st.announced !== st.date) dates += ' · announced ' + this.fmtDate(st.announced);
      return '<span class="cf-pills">' +
        '<span class="cf-pill is-' + esc(st.status) + (st.suspended ? ' is-suspended' : '') + '">' + esc(word) + '</span>' +
        (st.suspended ? '<span class="cf-susp">Suspended until ' + esc(this.fmtDate(st.suspendedUntil)) + '</span>' : '') +
        '</span>' +
        (st.label && st.label !== word ? '<span class="cf-lab">' + this.gloss(st.label) + '</span>' : '') +
        '<span class="cf-when">' + esc(dates) + '</span>' +
        this.citeHTML(st.cite, 'cf-cite');
    },
    /* re-read every row from the as-of date; rows that moved inside the span glow */
    paintBoard: function (span) { // returns the number of rows whose state changed, for the status line
      var self = this, host = $('#cf-board'), changed = 0;
      if (!host || !this.flows) return 0;
      $$('.cf-row', host).forEach(function (row) {
        var f = self.byId[row.getAttribute('data-f')];
        if (!f) return;
        var st = self.stateAt(f, self.asOf), key = self.keyOf(st), box = row.querySelector('.cf-state');
        // the scale is changed in place, never rebuilt, so its dot slides to the new state (controls.css; none under reduced motion)
        var ramp = row.querySelector('.cf-ramp');
        if (ramp) { ramp.className = self.rampClass(st); ramp.style.setProperty('--i', self.rampAt(st)); }
        if (box && key !== self.keys[f.id]) {
          changed++;
          box.innerHTML = self.pillHTML(st);
          var btn = row.querySelector('.cf-btn');
          if (btn) btn.setAttribute('aria-label', self.rowLabel(f, st, self.nMoves(f)));
          if (!reduced) { box.classList.remove('is-flip'); void box.offsetWidth; box.classList.add('is-flip'); }
        }
        self.keys[f.id] = key;
        if (span && !reduced && self.movedIn(f, span)) { row.classList.remove('is-changed'); void row.offsetWidth; row.classList.add('is-changed'); }
      });
      return changed;
    },
    movedIn: function (f, span) {
      var st = f.states || [];
      for (var i = 0; i < st.length; i++) if (st[i].date && st[i].date >= span[0] && st[i].date <= span[1]) return true;
      return false;
    },
    wireBoard: function () {
      var self = this, host = $('#cf-board');
      if (!host) return;
      host.addEventListener('click', function (e) {
        var m = e.target.closest ? e.target.closest('button.tl-more') : null;
        if (m) { self.setOpen(m, m.getAttribute('aria-expanded') !== 'true'); return; }
        var b = e.target.closest ? e.target.closest('.cf-btn') : null, row = b ? b.closest('.cf-row') : null;
        if (!row) return;
        if (self.mode === 'date') { // the compact board is a read-out: a click takes you to the row's own history, at the date you were reading
          var keep = self.asOf;
          self.setMode('subject', false);
          if (keep && keep !== self.now) self.setAsOf(keep, [keep, keep]);
          self.toggleRow(row, true);
          row.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
          return;
        }
        self.toggleRow(row, row.getAttribute('data-open') !== '1');
      });
      host.addEventListener('animationend', function (e) { if (e.animationName === 'cf-glow' && e.target.classList) e.target.classList.remove('is-changed'); });
    },
    toggleRow: function (row, open) {
      var f = this.byId[row.getAttribute('data-f')], btn = row.querySelector('.cf-btn'), box = row.querySelector('.cf-hist-in');
      if (!f || !box) return;
      if (open && !box.firstChild) box.innerHTML = this.histHTML(f); // built the first time the row opens
      var hist = row.querySelector('.cf-hist'), from = hist ? hist.getBoundingClientRect().height : 0;
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!hist) return;
      if (hist.cpA) { try { hist.cpA.cancel(); } catch (e) { } hist.cpA = null; }
      if (reduced || !hist.animate) { row.setAttribute('data-open', open ? '1' : '0'); return; }
      /* the drawer rests on grid-template-rows 0fr and 1fr, which sizes it from its own content; the run
         between the two rests is played on the height, because an unresolved fr track will not interpolate */
      if (open) row.setAttribute('data-open', '1');
      var to = open ? hist.getBoundingClientRect().height : 0;
      var a = hist.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: 230, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      hist.cpA = a;
      a.onfinish = function () { hist.cpA = null; if (!open) row.setAttribute('data-open', '0'); };
      a.oncancel = function () { if (!open) row.setAttribute('data-open', '0'); };
    },
    /* one flow's own history: its moves in date order, the ones that changed its state marked with the pill */
    boardRows: function () { // every flow as of the board's date, one row each, for the export; works before the board is built, so the export bar can exist at boot
      var self = this, flows = this.flows || this.rawFlows() || [];
      var tl = DATA.timeline || [], byEv = {}; tl.forEach(function (e) { if (e.id) byEv[e.id] = e; });
      var last = tl.reduce(function (m, e) { return e.date > m ? e.date : m; }, ''), asOf = this.asOf || last;
      return flows.map(function (f) {
        var st = self.stateAt({ id: f.id, initial: f.initial, states: self.sortStates(f.states) }, asOf);
        var ev = st.event ? byEv[st.event] : null, c = st.cite || {};
        var moves = tl.filter(function (e) { return (e.flows || []).indexOf(f.id) >= 0; }).length;
        return {
          flow: f.name, route: f.route, asOf: asOf, state: self.STATE[st.status], label: st.label || '',
          since: st.date || '', announced: st.announced || '', suspendedUntil: st.suspendedUntil || '',
          setBy: ev ? ev.title : '', fr: c.fr || '', cfr: c.cfr || '', url: c.url || '', source: ev ? ev.source : '', moves: moves
        };
      });
    },
    histHTML: function (f) {
      var self = this, evs = this.evs[f.id] || [], byEv = {};
      (f.states || []).forEach(function (s) { if (s.event) byEv[s.event] = s; });
      var body = evs.length ? '<ol class="cf-evs">' + evs.map(function (e, k) {
        var s = byEv[e.id], id = 'cf-p-' + f.id + '-' + k;
        var eff = e.effectiveDate && e.effectiveDate !== e.date ? e.effectiveDate : null;
        var host = e.source ? e.source.replace(/^https?:\/\//, '').split('/')[0] : '';
        var word = s ? self.word(s.status) : '';
        var sCite = s ? self.citeLabel(s.cite) : '', eCite = self.citeText({ fr: e.frCitation, cfr: e.cfr });
        var inst = self.instWord(e.instrument);
        return '<li class="cf-ev' + (s ? ' is-move' : '') + '">' +
          '<div class="cf-ev-p">' + (s
            ? '<span class="cf-pill is-' + esc(self.norm(s.status)) + '">' + esc(word) + '</span>' +
            (s.label ? '<span class="cf-ev-lab">' + self.gloss(s.label) + '</span>' : '') +
            (s.suspendedUntil ? '<span class="cf-susp">Suspended until ' + esc(self.fmtDate(s.suspendedUntil)) + '</span>' : '') +
            (s.date && s.date !== (eff || e.date) ? '<span class="cf-ev-from">from ' + esc(self.fmtDate(s.date)) + '</span>' : '') +
            (sCite && sCite !== eCite ? self.citeHTML(s.cite, 'cf-ev-cite') : '')
            : '<span class="cf-ev-none">no change</span>') + '</div>' +
          '<div class="cf-ev-d">' +
          (eff ? '<span class="cf-ev-k">announced</span>' : '') + '<b>' + esc(self.fmtDate(e.date)) + '</b>' +
          (eff ? '<span class="cf-ev-k">in force</span><b>' + esc(self.fmtDate(eff)) + '</b>' : '') +
          '<span>' + esc(e.actor || '') + '</span></div>' +
          '<div class="cf-ev-b"><span class="cf-ev-tags"><span class="cat ' + self.CATS[self.lane(e.category)].cls + '">' + esc(e.category || '') + '</span>' +
          (inst ? '<span class="cf-inst">' + esc(inst) + '</span>' : '') + '</span>' +
          '<h5 class="cf-ev-t">' + esc(e.title) + '</h5><p class="cf-ev-g">' + esc(self.gistOf(e)) + '</p>' +
          (eCite ? self.citeHTML({ fr: e.frCitation, cfr: e.cfr, url: e.source }, 'cf-ev-cite') : '') +
          '<button type="button" class="tl-more" aria-expanded="false" aria-controls="' + id + '">More</button>' +
          '<div class="tl-panel" id="' + id + '" hidden><p>' + esc(e.summary || '') + '</p>' +
          (host ? '<a class="src" href="' + safeUrl(e.source) + '" target="_blank" rel="noopener">' + esc(host) + '</a>' : '') +
          '</div></div></li>';
      }).join('') + '</ol>' : '<p class="cf-none">No event has changed this flow yet.</p>';
      return body + this.chapterHTML(f);
    },
    /* the chapter that tells this flow's story, when the data names one */
    chapterHTML: function (f) {
      if (!f.chapter) return ''; // no chapter, no link
      var t = (DATA.chapters || []).filter(function (c) { return c.id === f.chapter; })[0];
      return '<p class="cf-chapter"><a href="' + safeUrl('#' + f.chapter) + '">Read the chapter</a>' +
        (t ? '<span class="cf-chapter-n">' + esc(t.title) + '</span>' : '') + '</p>';
    },
    /* ---- the scrubber: the years as equal segments, a playhead, and Now ---- */
    renderScrub: function () {
      var self = this, host = $('#cf-scrub');
      if (!host || !this.flows) return;
      host.innerHTML = '<div class="cf-scrub-h"><p class="cf-asof">Board as of <b id="cf-asof">' + esc(this.fmtDate(this.asOf)) + '</b></p>' +
        '<button type="button" class="cf-now" id="cf-now">Now</button></div>' +
        '<div class="cf-track"><div class="cf-years" id="cf-years" role="group" aria-label="Set the date by year">' +
        this.years.map(function (y) {
          var n = self.yearN[y] || 0, most = Math.max.apply(null, self.years.map(function (yy) { return self.yearN[yy] || 0; }).concat([1]));
          // each year carries its number of moves as a small bar, so the busy years stand out on the scrubber
          return '<button type="button" class="cf-year" data-y="' + y + '" aria-pressed="false" aria-label="' + y + ', ' + n + (n === 1 ? ' event' : ' events') + '">' +
            '<i class="cf-yb" style="height:' + Math.max(1, Math.round(n / most * 20)) + 'px"></i>' +
            '<span class="cf-yl">' + y + '</span><span class="cf-ys">’' + String(y).slice(2) + '</span><span class="cf-yn">' + n + '</span></button>';
        }).join('') + '</div><div class="cf-head" id="cf-head" aria-hidden="true"></div></div>';
      var years = $('#cf-years'), now = $('#cf-now');
      if (now) now.addEventListener('click', function () { self.sayAsOf(self.setAsOf(self.now, [self.years[self.years.length - 1] + '-01-01', self.now])); });
      if (years) {
        years.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('.cf-year') : null; if (b) self.pickYear(parseInt(b.getAttribute('data-y'), 10)); });
        years.addEventListener('keydown', function (e) {
          var b = e.target.closest ? e.target.closest('.cf-year') : null;
          if (!b || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
          e.preventDefault();
          var i = self.years.indexOf(parseInt(b.getAttribute('data-y'), 10));
          var to = Math.max(0, Math.min(self.years.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)));
          var nx = years.querySelector('.cf-year[data-y="' + self.years[to] + '"]');
          if (nx) { nx.focus(); self.pickYear(self.years[to]); }
        });
      }
      this.markYears(); this.placeHead();
    },
    pickYear: function (y) { // a year pressed, or reached with the arrow keys: the board moves, and the status says to when
      var last = this.years[this.years.length - 1];
      this.sayAsOf(this.setAsOf(y >= last ? this.now : y + '-12-31', [y + '-01-01', y + '-12-31']));
    },
    /* the one lever on the page: move the as-of date, and the board re-reads itself from it; returns the rows that changed.
       The scroll moves it too, in By date, and that is not announced: the reader is already reading the entry that moved it */
    setAsOf: function (date, span) {
      if (!date || !this.flows) return 0;
      var prev = this.asOf;
      this.asOf = date;
      var lab = $('#cf-asof'); if (lab) lab.textContent = this.fmtDate(date);
      if (!span && prev && prev !== date) span = prev < date ? [prev, date] : [date, prev];
      var changed = this.paintBoard(prev === date ? null : span);
      this.markYears(); this.placeHead();
      return changed;
    },
    sayAsOf: function (changed) { this.say('Board as of ' + this.fmtDate(this.asOf) + '. ' + (changed ? changed + (changed === 1 ? ' row' : ' rows') + ' changed.' : 'No row changed.')); },
    say: function (text) { // emptied first, so the same words twice are read twice
      var s = $('#cf-status'); if (!s) return;
      s.textContent = ''; clearTimeout(this.sayT); this.sayT = setTimeout(function () { s.textContent = text; }, 60);
    },
    markYears: function () {
      var y = parseInt(String(this.asOf).slice(0, 4), 10);
      $$('#cf-years .cf-year').forEach(function (b) { b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-y'), 10) === y ? 'true' : 'false'); });
    },
    /* the as-of date as a fraction of the whole scale: the year's segment plus how far through it */
    frac: function (date) {
      var ys = this.years, n = ys.length, s = String(date || '');
      if (!n) return 0;
      var y = parseInt(s.slice(0, 4), 10), m = parseInt(s.slice(5, 7), 10) - 1, d = parseInt(s.slice(8, 10), 10);
      var i = ys.indexOf(y);
      if (i < 0) i = y < ys[0] ? 0 : n - 1;
      var within = ((isNaN(m) ? 0 : m) + (isNaN(d) ? 0 : (d - 1) / 31)) / 12;
      return (i + Math.max(0, Math.min(1, within))) / n;
    },
    placeHead: function () {
      var head = $('#cf-head'), track = $('#cf-years');
      if (!head || !track) return;
      var w = track.getBoundingClientRect().width;
      if (w) this.headW = w;
      head.style.transform = 'translate3d(' + (this.frac(this.asOf) * (this.headW || w)).toFixed(1) + 'px,0,0)';
    },
    /* By date: the entry at the reading line sets the as-of date, so the compact board keeps pace with the scroll */
    spy: function () {
      var self = this;
      if (this.tickQ) return;
      this.tickQ = true;
      var run = function () { self.tickQ = false; self.spyNow(); };
      if (window.requestAnimationFrame) window.requestAnimationFrame(run); else window.setTimeout(run, 32);
    },
    spyNow: function () {
      var items = this.items || [], side = $('#cf-side');
      if (!this.flows || this.mode !== 'date' || !items.length || !side || !side.offsetParent) return;
      var mast = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead')) || 56;
      var probe = mast + Math.round((window.innerHeight - mast) * 0.3); // the reading line sits a third of the way down, not at the masthead
      if (items[0].getBoundingClientRect().top > probe) { // the reader has not reached the chronology yet: the board shows today
        if (this.at !== -1 || this.asOf !== this.now) { this.at = -1; this.setAsOf(this.now, [this.now, this.now]); }
        return;
      }
      var at = 0; // the first entry still crossing the reading line: the one the reader is on
      for (var i = 0; i < items.length; i++) { at = i; if (items[i].getBoundingClientRect().bottom > probe) break; }
      if (at === this.at) return;
      var step = this.at >= 0 && Math.abs(at - this.at) <= 2; // reading, not jumping: a jump would flash the whole board
      this.at = at;
      var d = items[at].getAttribute('data-date');
      if (d) this.setAsOf(d, step ? null : [d, d]);
    },
    /* the scrubber is placed from its own width, so settle it whenever the sub-tab opens or the window changes */
    sync: function () {
      var self = this;
      if (!this.flows) return;
      this.headW = 0;
      var run = function () { self.placeHead(); self.spy(); };
      if (window.requestAnimationFrame) window.requestAnimationFrame(run); else window.setTimeout(run, 32);
    }
  };

  /* ---------------- boot ---------------- */
  /* the Look up page lives in src/modules/lookup.js and registers itself for the glossary view */

  /* ---------------- glossary popover: one panel, shared by every .gl-term in the prose ----------------
     The definitions already sit in the page, in the Glossary view, so nothing is duplicated. */
  /* ---------------- footnote popovers: hover or focus a citation number for the full source; click opens it ---------------- */
  var Cite = {
    el: null, a: null, timer: null, at: 0,
    panel: function () {
      if (this.el) return this.el;
      var t = document.createElement('div');
      t.className = 'ct-tip'; t.id = 'ct-tip'; t.hidden = true; t.setAttribute('role', 'tooltip');
      document.body.appendChild(t);
      var self = this;
      t.addEventListener('mouseenter', function () { clearTimeout(self.timer); });
      t.addEventListener('mouseleave', function () { self.later(); });
      this.el = t; return t;
    },
    show: function (a) {
      var self = this, d = a.dataset || {}, t = this.panel(), hostName = '';
      clearTimeout(this.timer);
      try { hostName = new URL(a.href).hostname.replace(/^www\./, ''); } catch (e) { hostName = ''; }
      // publisher · date (or the day the source was read, when it shows no date) · the page, for a citation into a long PDF
      var meta = [d.p, d.d, d.pg ? 'p. ' + d.pg : ''].filter(Boolean).join(' · ');
      t.innerHTML = (d.tier ? '<span class="tier tier-' + esc(d.tier) + '" title="Source tier ' + esc(d.tier) + '">' + esc(d.tier) + '</span>' : '') +
        '<b>' + esc(d.t || hostName || a.href) + '</b>' + (meta ? '<p>' + esc(meta) + '</p>' : '') +
        '<a href="' + safeUrl(a.href) + '" target="_blank" rel="noopener">' + (hostName ? esc(hostName) : 'Source') + ' ↗</a>';
      t.hidden = false;
      this.a = a; this.at = Date.now(); a.setAttribute('aria-describedby', 'ct-tip');
      this.place(a);
      if (window.requestAnimationFrame) requestAnimationFrame(function () { if (self.a === a) self.place(a); });
    },
    place: function (a) {
      var t = this.panel();
      if (narrow()) { // a sheet at the foot of the screen, clear of the specimen strip
        t.classList.add('is-sheet');
        var st = $('.stage'), h = st ? st.getBoundingClientRect().height : 0;
        t.style.left = ''; t.style.top = ''; t.style.bottom = Math.round(h + 10) + 'px';
        return;
      }
      t.classList.remove('is-sheet'); t.style.bottom = '';
      var r = a.getBoundingClientRect(), w = t.offsetWidth, hh = t.offsetHeight;
      var left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8));
      var top = r.top - hh - 10;
      if (top < 8) top = r.bottom + 10;
      top = Math.max(8, Math.min(top, window.innerHeight - hh - 8));
      t.style.left = Math.round(left) + 'px'; t.style.top = Math.round(top) + 'px';
    },
    hide: function () {
      clearTimeout(this.timer);
      if (this.a) { this.a.removeAttribute('aria-describedby'); this.a = null; }
      if (this.el) this.el.hidden = true;
    },
    later: function () { var self = this; clearTimeout(this.timer); this.timer = setTimeout(function () { self.hide(); }, 260); },
    init: function () {
      var self = this, mark = function (e) { return e.target && e.target.closest ? e.target.closest('sup.cite a') : null; };
      document.addEventListener('mouseover', function (e) { var a = mark(e); if (a) self.show(a); });
      document.addEventListener('mouseout', function (e) { if (mark(e)) self.later(); });
      document.addEventListener('focusin', function (e) { var a = mark(e); if (a) self.show(a); else if (self.el && !self.el.contains(e.target)) self.hide(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && self.el && !self.el.hidden) { var a = self.a; self.hide(); if (a) a.focus(); } });
      window.addEventListener('hashchange', function () { self.hide(); }); // a new place in the site leaves no source card behind (correctness P1-5)
      // on a touch screen a tap opens the source card (a sheet on a phone) and its link goes to the source; the tap used to
      // follow the mark's own link to the publisher in a new tab before the card could be read. A tap elsewhere closes it.
      // A mouse click on a laptop still follows the mark's link.
      var touch = window.matchMedia ? window.matchMedia('(hover: none)') : null;
      document.addEventListener('click', function (e) {
        if (!touch || !touch.matches) return;
        var a = mark(e);
        if (a) { e.preventDefault(); self.show(a); return; }
        if (self.el && !self.el.hidden && !self.el.contains(e.target)) self.hide();
      });
      window.addEventListener('scroll', function () {
        if (!self.a || !self.el || self.el.hidden || self.el.classList.contains('is-sheet')) return;
        var r = self.a.getBoundingClientRect(), gone = r.bottom < 0 || r.top > window.innerHeight;
        if (gone && Date.now() - self.at > 600) self.hide(); else self.place(self.a);
      }, { passive: true });
      window.addEventListener('resize', function () { if (self.a && self.el && !self.el.hidden) self.place(self.a); });
    }
  };

  var Tip = {
    el: null, btn: null, defs: null, timer: null, at: 0,
    def: function (term) {
      if (!this.defs) {
        this.defs = {};
        $$('#glossary .gl-entry[data-term]').forEach(function (e) {
          var p = e.querySelector('dd p'), dt = e.querySelector('dt');
          if (p && dt) this.defs[e.getAttribute('data-term')] = { term: dt.firstChild.textContent.trim(), plain: p.textContent };
        }, this);
      }
      return this.defs[term];
    },
    panel: function () {
      if (this.el) return this.el;
      var t = document.createElement('div');
      t.className = 'gl-tip'; t.id = 'gl-tip'; t.hidden = true; t.setAttribute('role', 'tooltip');
      document.body.appendChild(t);
      var self = this;
      t.addEventListener('mouseenter', function () { clearTimeout(self.timer); });
      t.addEventListener('mouseleave', function () { self.hide(); });
      this.el = t; return t;
    },
    show: function (btn) {
      var self = this, d = this.def(btn.getAttribute('data-term'));
      if (!d) return;
      clearTimeout(this.timer);
      var t = this.panel();
      var ds = btn.dataset || {}, slug = String(d.term).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (ds.note) { // a rating tag: the band's own sentence, then this stage's test, then the full entry
        t.innerHTML = '<b>' + esc(ds.head || btn.textContent.trim()) + '</b><p>' + esc(ds.note) + '</p>' + (ds.test ? '<p class="gl-tip-test"><span class="label">This stage</span>' + esc(ds.test) + '.</p>' : '') + '<a href="#gl-' + slug + '">How ' + esc(String(d.term).toLowerCase()) + ' is rated →</a>';
      } else {
        t.innerHTML = '<b>' + esc(d.term) + '</b><p>' + esc(d.plain) + '</p><a href="#gl-' + slug + '">Look it up →</a>';
      }
      t.hidden = false;
      this.btn = btn; this.at = Date.now(); btn.setAttribute('aria-describedby', 'gl-tip');
      this.place(btn);
      // focus may scroll the term into view after this frame, so settle the position once more
      if (window.requestAnimationFrame) requestAnimationFrame(function () { if (self.btn === btn) self.place(btn); });
    },
    place: function (btn) {
      var t = this.panel();
      if (narrow()) { // a sheet at the foot of the screen, clear of the specimen strip
        t.classList.add('is-sheet');
        var st = $('.stage'), h = st ? st.getBoundingClientRect().height : 0;
        t.style.left = ''; t.style.top = ''; t.style.bottom = Math.round(h + 10) + 'px';
        return;
      }
      t.classList.remove('is-sheet'); t.style.bottom = '';
      var r = btn.getBoundingClientRect(), w = t.offsetWidth, hh = t.offsetHeight;
      var left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8));
      var top = r.top - hh - 10;
      if (top < 8) top = r.bottom + 10; // no room above: sit below
      top = Math.max(8, Math.min(top, window.innerHeight - hh - 8)); // and never off the screen
      t.style.left = Math.round(left) + 'px'; t.style.top = Math.round(top) + 'px';
    },
    hide: function () {
      clearTimeout(this.timer);
      if (this.btn) { this.btn.removeAttribute('aria-describedby'); this.btn = null; }
      if (this.el) this.el.hidden = true;
    },
    later: function () { var self = this; clearTimeout(this.timer); this.timer = setTimeout(function () { self.hide(); }, 220); },
    /* the panel sits at the end of the page, so Tab from a term would never reach its link. While it is open, Tab from the term
       goes into the panel; from its link, Tab goes on to whatever follows the term and Shift+Tab goes back to the term
       (correctness P1-7a; accessibility #18) */
    tab: function (e) {
      var b = this.btn, link = this.el.querySelector('a'), at = document.activeElement;
      if (at === b && !e.shiftKey && link) { e.preventDefault(); link.focus(); return; }
      if (!this.el.contains(at)) return;
      e.preventDefault();
      if (e.shiftKey) { b.focus(); return; }
      var next = this.after(b); this.hide(); (next || b).focus();
    },
    after: function (b) { // the next stop in the page's own order after the term, outside the panel
      var scope = (b.closest && b.closest('.view')) || document.body;
      var all = $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]', scope), i = all.indexOf(b);
      for (var k = i + 1; k < all.length; k++) { var x = all[k]; if (x.tabIndex < 0 || x.closest('[hidden], [inert]') || !x.getClientRects().length) continue; return x; }
      return null;
    },
    init: function () {
      var self = this, term = function (e) { return e.target.closest ? e.target.closest('.gl-term') : null; };
      document.addEventListener('mouseover', function (e) { var b = term(e); if (b) self.show(b); });
      document.addEventListener('mouseout', function (e) { if (term(e)) self.later(); });
      // quiet: Escape hands focus back to the term with the panel shut, so that focus must not open it again
      document.addEventListener('focusin', function (e) { var b = term(e); if (b) { if (self.quiet === b) { self.quiet = null; return; } self.show(b); } else if (self.el && !self.el.contains(e.target)) self.hide(); });
      document.addEventListener('click', function (e) {
        var b = term(e);
        // a tap on a phone sends mouseover (which opens the panel) a moment before its click, so that click must not close it again
        if (b) { if (self.btn === b && self.el && !self.el.hidden) { if (Date.now() - self.at > 500) self.hide(); } else self.show(b); return; }
        if (!self.el || !self.el.contains(e.target)) self.hide();
        else if (e.target.closest && e.target.closest('a')) self.hide(); // its own link (Look it up) leaves the panel behind (correctness P1-5)
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && self.el && !self.el.hidden) { var b = self.btn; self.hide(); if (b && document.activeElement !== b) { self.quiet = b; b.focus(); } }
        else if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey && self.el && !self.el.hidden && self.btn) self.tab(e);
      });
      window.addEventListener('hashchange', function () { self.hide(); }); // and so does any move to a new place in the site
      // follow the term while the page scrolls; let go once it has left the screen
      window.addEventListener('scroll', function () {
        if (!self.btn || !self.el || self.el.hidden || self.el.classList.contains('is-sheet')) return;
        var r = self.btn.getBoundingClientRect(), gone = r.bottom < 0 || r.top > window.innerHeight;
        // a term reached by keyboard is scrolled into view after it opens, so give that scroll a moment
        if (gone && Date.now() - self.at > 600) self.hide(); else self.place(self.btn);
      }, { passive: true });
      window.addEventListener('resize', function () { if (self.btn && self.el && !self.el.hidden) self.place(self.btn); });
    }
  };

  /* ---------------- controls view: threshold map + China exposure (rendered only if the section exists) ---------------- */
  var Controls = {
    built: false,
    activate: function () { if (!this.built) this.build(); if (Geo.built) Geo.sync(); },
    /* #/exposure/<slug>: that firm's chart (id ex-<slug>, written by build/build.js) just under the masthead. A reader who came by a
       link on the page gets focus there, so the next Tab reaches its bars; a short wash of the accent shows which chart it is,
       once the page has settled, and never under reduced motion */
    focusFirm: function (id, jumpIt) { // jumpIt: a first load or an arrival from another view, so no glide
      var el = document.getElementById('ex-' + id), self = this;
      if (!el || !el.closest('#exposure-viz')) return false;
      scrollToEl(el, !jumpIt);
      if (jumpIt) Router.settle(el);
      if (Router.routed && el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { } }
      if (reduced) return true;
      clearTimeout(this.flashT);
      $$('#exposure-viz .ex-flash').forEach(function (x) { x.classList.remove('ex-flash'); });
      var go = function () { self.flashT = setTimeout(function () { el.classList.add('ex-flash'); self.flashT = setTimeout(function () { el.classList.remove('ex-flash'); }, 2000); }, jumpIt ? 250 : 500); };
      if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
      return true;
    },
    build: function () { // the China revenue share sub-tab: tooltips on the charts and the table behind the toggle
      this.built = true;
      var ex = DATA.exposure || [];
      var viz = $('#exposure-viz');
      if (viz && viz.firstElementChild) { // tooltips on the exposure charts
        var tip = document.createElement('div'); tip.className = 'ex-tip'; tip.hidden = true; document.body.appendChild(tip);
        var fmtU = function (v, u) { return Number(v).toLocaleString('en-US') + u; };
        var showTip = function (c) {
          // the row's currency names its unit ("USD million", "JPY billion"): the code goes in front, the unit after each amount
          var d = c.dataset, cu = d.cur || '', u = /billion/i.test(cu) ? 'bn' : /thousand/i.test(cu) ? 'k' : 'm', cur = cu.replace(/\s*(million|billion|thousand)\s*/i, '');
          var money = d.china && d.total ? ' · ' + (cur ? cur + ' ' : '') + fmtU(d.china, u) + ' of ' + fmtU(d.total, u) : '';
          tip.innerHTML = '<b>' + esc(d.firm) + ' · ' + esc(d.fy) + '</b>China was ' + esc(d.share) + '% of revenue' + money + (d.basis ? '<br>' + esc(d.basis) : '');
          tip.hidden = false;
          var r = c.getBoundingClientRect(), x = r.left + r.width / 2 + window.scrollX, y = r.top + window.scrollY;
          tip.style.left = Math.max(8, Math.min(x - tip.offsetWidth / 2, window.scrollX + window.innerWidth - tip.offsetWidth - 8)) + 'px';
          tip.style.top = (y - tip.offsetHeight - 10) + 'px';
        };
        // the tip stays while the pointer crosses onto it, and Escape closes it (WCAG 1.4.13; accessibility #10)
        var tipT = null, hideSoon = function () { clearTimeout(tipT); tipT = setTimeout(function () { tip.hidden = true; }, 260); };
        tip.addEventListener('mouseenter', function () { clearTimeout(tipT); });
        tip.addEventListener('mouseleave', function () { clearTimeout(tipT); tip.hidden = true; });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !tip.hidden) { clearTimeout(tipT); tip.hidden = true; } });
        viz.addEventListener('mouseover', function (e) { var c = e.target.closest && e.target.closest('[data-firm]'); if (c) { clearTimeout(tipT); showTip(c); } });
        viz.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest('[data-firm]')) hideSoon(); });
        viz.addEventListener('focusin', function (e) { var a = e.target.closest ? e.target.closest('a') : null, c = a ? a.querySelector('[data-firm]') : null; if (c) showTip(c); }); // a bar's link; the chart itself, focused by its address, shows none
        viz.addEventListener('focusout', function () { tip.hidden = true; });
      }
      var et = $('#exposure-table');
      if (et && ex.length) {
        var firms = {}, years = {};
        ex.forEach(function (r) { (firms[r.firm] = firms[r.firm] || {})[r.fiscalYear] = r; years[r.fiscalYear] = 1; });
        var ys = Object.keys(years).sort();
        var meta = {}; ex.forEach(function (r) { meta[r.firm] = r; });
        var order = Object.keys(firms).sort(function (a, b) { var la = firms[a][ys[ys.length - 1]] || {}, lb = firms[b][ys[ys.length - 1]] || {}; return (lb.chinaShare || 0) - (la.chinaShare || 0); });
        // how a firm counts China, in a few words (build/build.js reads the basis the same way for the charts)
        var basisShort = function (b) { b = (b || '').toLowerCase(); if (!b) return ''; if (/ship-to|ship to|destination|fab\)/.test(b)) return 'counted where it ships'; if (/bill|invoice/.test(b)) return 'counted where it is billed'; if (/headquarters/.test(b)) return 'counted by headquarters'; if (/seat|licen/.test(b)) return 'counted by license seats'; if (/used|usage/.test(b)) return 'counted where it is used'; if (/own operating|operating units|own units/.test(b)) return 'counted by own units'; return 'counted by customer location'; };
        var firstLine = function (b) { var t = String(b || ''), i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t; }; // the basis itself, without "Share computed from..."
        et.innerHTML = '<thead><tr><th>Firm</th>' + ys.map(function (y) { return '<th>' + esc(y) + '</th>'; }).join('') + '</tr></thead><tbody>' + order.map(function (f) {
          var m = meta[f];
          // a firm can change how it counts China between years (Nvidia: billing location to FY2023, customer headquarters from FY2024):
          // the row names every basis with its years, each cell names its own, and a dashed rule marks the first year of a new one
          var segs = [];
          ys.forEach(function (y) { var r = firms[f][y]; if (!r || r.chinaShare == null || !r.basis) return; var k = basisShort(r.basis), last = segs[segs.length - 1]; if (!last || last.k !== k) segs.push({ k: k, from: y, to: y, text: firstLine(r.basis) }); else last.to = y; });
          var starts = {}; segs.forEach(function (sg, i) { if (i) starts[sg.from] = 1; });
          var label = segs.length > 1 ? segs.map(function (sg, i) { var w = i ? sg.k.replace(/^counted /, '') : sg.k; return i === segs.length - 1 ? w + ' from ' + sg.from : (i ? w + ' ' + sg.from + ' to ' + sg.to : w + ' to ' + sg.to); }).join(', ') : (m.basis ? basisShort(m.basis) : '');
          var rowTitle = segs.length > 1 ? segs.map(function (sg) { return sg.from + (sg.to !== sg.from ? ' to ' + sg.to : '') + ': ' + sg.text; }).join(' ') : (m.basis || '');
          var peak = 0; ys.forEach(function (y) { var r = firms[f][y]; if (r && r.chinaShare != null) peak = Math.max(peak, r.chinaShare); }); // the firm's highest year, garnet as in its panel
          return '<tr><td title="' + esc(rowTitle) + '">' + esc(f) + '<small>' + esc(m.category || '') + ' · ' + esc(cname(m.country)) + (label ? ' · ' + esc(label) : '') + '</small></td>' + ys.map(function (y) {
            var r = firms[f][y]; if (!r || r.chinaShare == null) return '<td><span class="cell zero" title="Not filed for this year" aria-label="Not filed for this year">·</span></td>';
            var brk = starts[y], basis = r.basis ? 'Counted: ' + firstLine(r.basis) : '';
            var tip = [r.chinaRevenue != null ? r.chinaRevenue.toLocaleString('en-US') + ' of ' + (r.totalRevenue || 0).toLocaleString('en-US') + ' ' + (r.currency || '') : '', r.note || '', (brk ? 'New basis from this year. ' : '') + basis].filter(Boolean).join(' · ');
            return '<td' + (brk ? ' style="border-left:2px dashed var(--ink-2)"' : '') + '>' + (brk ? '<span class="sr-only">The firm counts China differently from this year. </span>' : '') + '<a class="cell' + (r.chinaShare === peak ? ' is-peak' : '') + '" style="--v:' + Math.round(Math.min(100, r.chinaShare) * 1.6) + '" href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" aria-label="' + esc(f) + ' ' + esc(y) + ': ' + esc(String(r.chinaShare)) + ' percent from China, opens the filing" title="' + esc(tip) + '">' + (r.chinaRevenue != null ? r.chinaShare.toFixed(1) : String(r.chinaShare)) + '%</a></td>'; // a share the filing gives only as a percentage prints as filed (build/exposure.js shareText)
          }).join('') + '</tr>';
        }).join('') + '</tbody>';
      }
    }
  };

  /* ---------------- research tools: search, permalinks, dataset export, citation ---------------- */
  /* ---------------- keyboard aids: the skip link, Tab clear of the fixed bars, Home on the home page, and the heading a search
     result or a Contents link lands on (started from Tools.init) ---------------- */
  var Keys = {
    init: function () {
      var root = document.documentElement, self = this;
      // while the reader moves by Tab, html.kb turns on the scroll padding that keeps a focused control clear of the masthead and
      // the phone strip (src/styles.css); a pointer or a touch turns it off, so their jumps land where they always have
      document.addEventListener('keydown', function (e) { if (e.key === 'Tab') root.classList.add('kb'); }, true);
      document.addEventListener('pointerdown', function () { root.classList.remove('kb'); }, true);
      // the skip link moves focus to the main column and leaves the address alone, so the route stays as it was
      var skip = $('.skip'), main = $('#main');
      if (skip && main) skip.addEventListener('click', function (e) { e.preventDefault(); self.focus(main); });
      // Home while on the home page: back to the top, as the wordmark goes, with focus on the title there
      var home = $('.tabs a[data-view="walk"]');
      if (home) home.addEventListener('click', function (e) {
        if (Router.current !== 'walk' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
        if (location.hash && location.hash !== '#/') location.hash = '#/';
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        self.focus(self.title($('.view[data-view="walk"]')));
      });
    },
    shown: function (el) { return !!el && !el.closest('[hidden]') && el.getClientRects().length > 0; },
    title: function (view) { return view ? $$('h1', view).filter(this.shown)[0] || null : null; }, // the view's own h1 (the chain also holds the printed cover's)
    focus: function (el) {
      if (!el) return;
      if (!el.matches('a[href], button, input, select, textarea, [tabindex]')) el.setAttribute('tabindex', '-1');
      try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) { } }
    },
    /* after a search result or a Contents link is followed, focus goes to the heading of the place it lands on: a chapter's
       title, a section's heading, a Glossary term, an event, or the view's own title. A place that takes focus itself (a
       flashcard, a firm's chart) keeps it */
    land: function (href) {
      var self = this;
      setTimeout(function () {
        var a = document.activeElement; if (a && a !== document.body && a !== document.documentElement) return;
        var h = href || '', el = null, m;
        if (/^#\/walk\/[^?#\/]+$/.test(h)) el = document.getElementById(dec(h.slice(1)));
        else if (/^#\/controls\/./.test(h)) el = $('.timeline .is-target');
        else if ((m = /^#\/exposure\/([^?#\/]+)/.exec(h))) el = document.getElementById('ex-' + dec(m[1]).toLowerCase());
        else if (/^#[^\/]/.test(h)) el = document.getElementById(dec(h.slice(1)));
        var view = $$('.view').filter(function (v) { return !v.hidden; })[0];
        if (!self.shown(el) || !view || !view.contains(el)) el = self.title(view);
        else if (!/^H[1-6]$/.test(el.tagName)) el = $$('h1, h2, h3, h4, h5, h6, dt', el).filter(self.shown)[0] || el;
        self.focus(el);
      }, 150);
    }
  };

  var Tools = {
    index: null, from: null,
    buildIndex: function () {
      if (this.index) return this.index;
      var idx = [];
      idx.push({ kind: 'Start here', title: 'How AI chips are made', text: 'One plain paragraph per stage, in order, with the specimens', href: '#/intro' });
      (DATA.chapters || []).forEach(function (c) { if (c.plain && c.id !== 'introduction-and-goals') idx.push({ kind: 'Start here', title: c.title + ', in plain terms', text: c.plain, href: '#/walk/' + c.id }); });
      $$('[data-view="stack"] .chapter').forEach(function (ch) {
        var title = (ch.querySelector('.ch-title') || {}).textContent || ch.id;
        idx.push({ kind: 'Chapter', title: title.replace(/^Chapter \d+: /, ''), text: (ch.querySelector('.ch-lede') || {}).textContent || '', href: '#' + ch.id });
        $$('.prose h3[id], .prose h4[id]', ch).forEach(function (h) {
          var t = '', p = h.nextElementSibling;
          // the snippet is the reading text: a copy of each block without its footnote marks, so "8 Gb/s per pin 9." reads "8 Gb/s per pin."
          while (p && !/^H[1-4]$/.test(p.tagName) && t.length < 900) { if (/^(P|DIV|UL|OL|TABLE)$/.test(p.tagName)) { var c = p.cloneNode(true); $$('sup.cite', c).forEach(function (s) { s.remove(); }); t += ' ' + c.textContent; } p = p.nextElementSibling; }
          idx.push({ kind: title.replace(/^Chapter \d+: /, ''), title: h.textContent.replace(/#$/, ''), text: t.replace(/\s+/g, ' ').replace(/\s+([.,;:)])/g, '$1').trim().slice(0, 900), href: '#' + h.id });
        });
      });
      $$('#glossary .gl-entry').forEach(function (el) { idx.push({ kind: 'Term', title: el.querySelector('dt').firstChild.textContent, text: el.querySelector('dd p').textContent, href: '#' + el.id }); });
      (DATA.suppliers || []).forEach(function (r) { idx.push({ kind: 'Supplier', title: r.name, text: r.category + ' · ' + cname(r.country) + (r.role ? ' · ' + r.role : ''), href: '#/suppliers', q: r.name }); });
      (DATA.landscape || []).forEach(function (c) { idx.push({ kind: 'Chip', title: c.vendor + ' ' + c.name, text: ((c.process || {}).node || '') + ' · ' + ((c.memory || {}).type || '') + ' · ' + (c.status || ''), href: '#/landscape', chip: c.id }); });
      (DATA.timeline || []).forEach(function (e) { idx.push({ kind: 'Event ' + e.date, title: e.title, text: e.summary || '', href: e.id ? '#/controls/' + encodeURIComponent(e.id) : '#/controls' }); }); // straight to the entry, opened
      (DATA.exposure || []).forEach(function (r) { if (r.chinaShare != null) idx.push({ kind: 'China revenue', title: r.firm + ' ' + r.fiscalYear, text: 'China was ' + r.chinaShare + '% of revenue' + (r.basis ? ' · ' + r.basis : ''), href: (DATA.exposureLinks || {})[r.firm] || '#/exposure' }); }); // straight to the firm's chart
      // each flashcard, found by its question or its answer (more: matched, never shown). The result opens the chapter's deck at
      // that card, question side up (Tools.openCard), so the line under it names the deck and leaves the answer to recall.
      // Start here's deck sits in the walk, in no chapter, and carries its own name (data-name)
      $$('[data-view="stack"] .fc[id], [data-view="walk"] .fc[id]').forEach(function (fc) {
        var ch = fc.closest('.chapter'), name = ch ? ((ch.querySelector('.ch-title') || {}).textContent || '').replace(/^Chapter \d+: /, '') : (fc.getAttribute('data-name') || ''), cards = $$('.fc-card', fc);
        cards.forEach(function (c, k) { idx.push({ kind: 'Flashcard', title: ($('.fc-q', c) || {}).textContent || '', text: name + ' · card ' + (k + 1) + ' of ' + cards.length, more: 'flashcards ' + (($('.fc-a', c) || {}).textContent || ''), href: '#' + fc.id, card: { id: fc.id, i: k } }); });
      });
      var self = this;
      idx.forEach(function (i) {
        i.hay = (i.kind + ' ' + i.title + ' ' + i.text + (i.more ? ' ' + i.more : '')).toLowerCase();
        i.hayn = self.norm(i.hay); // hyphens flattened, so "export-control" and "export control" are the same string
        i.tn = self.norm(i.title);
        i.tw = i.tn.split(' ').filter(Boolean);
      });
      this.index = idx; return idx;
    },
    norm: function (s) { return String(s == null ? '' : s).toLowerCase().replace(/[‐-―]/g, '-').replace(/[-_/,;:()]+/g, ' ').replace(/\s+/g, ' ').trim(); },
    STOP: { a: 1, an: 1, and: 1, are: 1, as: 1, at: 1, be: 1, by: 1, do: 1, does: 1, for: 1, from: 1, how: 1, in: 1, is: 1, it: 1, its: 1, of: 1, on: 1, or: 1, that: 1, the: 1, this: 1, to: 1, was: 1, what: 1, when: 1, where: 1, which: 1, who: 1, why: 1, with: 1 },
    KIND: { Term: 20, Chapter: 10, Essay: 8 },
    // Rank rather than filter: an exact title first, then a title word, then the glossary, then body text.
    search: function (raw) {
      var self = this, idx = this.buildIndex(), qn = this.norm(raw);
      var words = qn.split(' ').filter(Boolean);
      var terms = words.filter(function (t) { return !self.STOP[t]; });
      if (!terms.length) terms = words;
      if (!terms.length) return { hits: [], note: '' };
      var out = [];
      idx.forEach(function (i, order) {
        var score = 0, matched = 0;
        terms.forEach(function (t) {
          var w = 0;
          for (var k = 0; k < i.tw.length; k++) {
            if (i.tw[k] === t) { w = 40; break; }
            if (i.tw[k].indexOf(t) === 0) w = 30;
          }
          if (!w && i.tn.indexOf(t) >= 0) w = 22;
          if (!w && i.hayn.indexOf(t) >= 0) w = 6;
          if (w) { matched++; score += w; }
        });
        if (!matched) return;
        if (i.tn === qn) score += 300;
        else if (i.tn.indexOf(qn) === 0) score += 90;
        else if (i.tn.indexOf(qn) >= 0) score += 55;
        if (matched === terms.length) score += 45;
        score += self.KIND[i.kind] || 0;
        score += Math.max(0, 30 - i.tn.length) * 0.5; // a short, exact title beats a long one
        out.push({ i: i, s: score, o: order });
      });
      out.sort(function (a, b) { return b.s - a.s || a.i.tn.length - b.i.tn.length || a.o - b.o; });
      if (out.length) return { hits: out.slice(0, 14).map(function (x) { return x.i; }), note: '' };
      // nothing matched: offer the glossary entries that share the longest opening run of letters
      var near = idx.filter(function (i) { return i.kind === 'Term'; }).map(function (i) {
        var n = 0; while (n < qn.length && n < i.tn.length && qn.charAt(n) === i.tn.charAt(n)) n++;
        return { i: i, n: n };
      }).sort(function (a, b) { return b.n - a.n || a.i.tn.length - b.i.tn.length; }).slice(0, 3);
      return { hits: near.map(function (x) { return x.i; }), note: 'Nothing matches. Nearest terms:' };
    },
    open: function () {
      var self = this, box = $('#cp-search');
      if (!box) {
        box = document.createElement('div'); box.id = 'cp-search'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Search');
        box.innerHTML = '<div class="cp-search-panel"><input type="search" placeholder="Search chapters, terms, suppliers, chips and events…" aria-label="Search"><p class="cp-search-try"></p><ol class="cp-search-results"></ol><p class="cp-search-hint">Enter opens the first result · Esc closes</p></div>';
        // the number of results goes to a polite status, so a screen reader hears it once the typing pauses
        var said = document.createElement('p'); said.className = 'sr-only cp-search-said'; said.setAttribute('role', 'status'); $('.cp-search-panel', box).appendChild(said);
        document.body.appendChild(box);
        var inp = $('input', box), list = $('ol', box), tryRow = $('.cp-search-try', box);
        var say = function (text) { clearTimeout(self.sayT); self.sayT = setTimeout(function () { said.textContent = text; }, text ? 400 : 0); };
        // an empty search suggests what to type, from the Glossary's own Try row; a tap fills the box and searches
        var names = self.tryNames();
        if (names.length) tryRow.innerHTML = '<span class="label">Try</span>' + names.map(function (n) { return '<button type="button">' + esc(n) + '</button>'; }).join('');
        else tryRow.remove();
        tryRow.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('button') : null; if (!b) return; inp.value = b.textContent; inp.dispatchEvent(new Event('input')); inp.focus(); });
        // the keyboard hint means nothing on a touch screen with no keyboard
        if (window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches) { var hint = $('.cp-search-hint', box); if (hint) hint.hidden = true; }
        box.addEventListener('click', function (e) { if (e.target === box) self.close(); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var a = list.querySelector('a'); if (a) a.click(); } });
        inp.addEventListener('input', function () {
          var q = inp.value.trim();
          if (tryRow) tryRow.hidden = !!q; // the suggestions give way to the results
          if (!q) { list.innerHTML = ''; say(''); return; }
          var res = self.search(q), hits = res.hits;
          say(res.note ? 'Nothing matches. ' + (hits.length === 1 ? '1 nearest term.' : hits.length + ' nearest terms.') : !hits.length ? 'Nothing matches.' : hits.length === 1 ? '1 result.' : hits.length + ' results.');
          list.innerHTML = (res.note ? '<li class="none">' + esc(res.note) + '</li>' : '') +
            (hits.map(function (h, k) { return '<li><a href="' + safeUrl(h.href) + '" data-k="' + k + '"><span class="k">' + esc(h.kind) + '</span><b>' + esc(h.title) + '</b><span class="t">' + esc(clip(h.text, 140)) + '</span></a></li>'; }).join('') || (res.note ? '' : '<li class="none">Nothing matches.</li>'));
          list.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { var h = hits[+a.getAttribute('data-k')]; self.close(true); Keys.land(h.href); if (h.href === location.hash) setTimeout(function () { Router.route(); }, 0); /* the address is already this one, so no hashchange will come: go there anyway */ if (h.chip) setTimeout(function () { Landscape.openCard(h.chip, { show: true }); }, 60); /* a chip opens its card on the chart and adds nothing */ if (h.q) setTimeout(function () { Suppliers.show({ q: h.q }); }, 60); /* the whole filter, so a country or stage left from an earlier visit cannot hide the firm */ if (h.el) setTimeout(function () { h.el.scrollIntoView({ block: 'center' }); }, 60); if (h.card && self.openCard) setTimeout(function () { self.openCard(h.card.id, h.card.i); }, 60); }); });
        });
      }
      if (box.hidden) this.from = document.activeElement; // where the reader was, so closing can put them back
      box.hidden = false; $('input', box).value = ''; $('ol', box).innerHTML = ''; var tr = $('.cp-search-try', box); if (tr) tr.hidden = false;
      var sd = $('.cp-search-said', box); if (sd) { clearTimeout(this.sayT); sd.textContent = ''; }
      this.hold(true); $('input', box).focus();
    },
    /* the dialog is modal: while it is open everything else on the page is inert, so Tab, a click or a screen reader's cursor
       stays in the dialog. Only what this call made inert is released (the phone Contents sheet keeps its own) */
    hold: function (on) {
      var box = $('#cp-search'), self = this;
      if (on) {
        if (this.held) return;
        this.held = [];
        [].forEach.call(document.body.children, function (el) { if (el !== box && el.tagName !== 'SCRIPT' && !el.inert) { el.inert = true; self.held.push(el); } });
      } else {
        (this.held || []).forEach(function (el) { el.inert = false; });
        this.held = null;
      }
    },
    /* the suggestions under an empty search box, drawn once per visit the way the Glossary draws its own Try row
       (src/modules/lookup.js suggest: two short terms, two firms that matter, one chip, one country) from the same list of
       entries, #lk-items, which every page carries. A chip goes by its model ("Ascend 950PR", "Instinct MI300X"): the maker,
       a design house in brackets and a bracketed tail are dropped */
    tryNames: function () {
      var items = $$('#lk-items li[data-kind]'), name = function (li) { return ((li.querySelector('.lk-name') || {}).textContent || '').trim(); };
      var kind = function (k) { return items.filter(function (li) { return li.getAttribute('data-kind') === k; }); };
      var pick = function (arr, n) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a.slice(0, n); };
      var big = {}; (DATA.suppliers || []).forEach(function (r) { if (r.chokepoint === 'Critical' || r.chokepoint === 'Important') big[r.name] = 1; });
      var chosen = pick(kind('term').filter(function (li) { return name(li).length <= 22; }), 2)
        .concat(pick(kind('firm').filter(function (li) { return big[li.getAttribute('data-key')]; }), 2), pick(kind('chip'), 1), pick(kind('country'), 1));
      // a chip's list name is its maker and its name, so a chip takes its own name from the data (its data-key is the chip id), as the Glossary's Try row does
      var chipName = {}; (DATA.landscape || []).forEach(function (c) { chipName[c.id] = c.name; });
      return pick(chosen, chosen.length).map(function (li) {
        var own = li.getAttribute('data-kind') === 'chip' ? chipName[li.getAttribute('data-key')] : '';
        return String(own || name(li)).replace(/\s*\([^)]*\)$/, '');
      }).filter(Boolean);
    },
    close: function (following) { // following a result: the destination takes focus (Keys.land), so leave it alone
      var box = $('#cp-search'); if (!box || box.hidden) return;
      box.hidden = true; this.hold(false);
      var back = this.from; this.from = null;
      if (following) return;
      // back where the reader was; opened from nowhere in particular (Ctrl+K on the page), back to the search button
      if (!back || back === document.body || !back.focus || !document.contains(back) || (back.closest && back.closest('[inert]'))) back = $('.search-btn');
      if (back) { try { back.focus({ preventScroll: true }); } catch (e) { try { back.focus(); } catch (e2) { } } }
    },
    init: function () {
      var self = this;
      // search button in the masthead
      var nav = $('.tabs'), btn = document.createElement('button'); btn.type = 'button'; btn.className = 'search-btn'; btn.setAttribute('aria-label', 'Search'); btn.title = 'Search (Ctrl+K, or press /)';
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
      btn.addEventListener('click', function () { self.open(); });
      if (nav) nav.insertBefore(btn, $('.theme-toggle'));
      Keys.init();
      // Escape closes the dialog wherever focus is (the panel, a result, or nowhere after a click on its text). It is heard first
      // and goes no further, so the Contents sheet under it stays open
      document.addEventListener('keydown', function (e) { if (e.key !== 'Escape') return; var b = $('#cp-search'); if (!b || b.hidden) return; e.preventDefault(); e.stopImmediatePropagation(); self.close(); }, true);
      document.addEventListener('keydown', function (e) { var k = e.key || '', a = document.activeElement || document.body; if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'k') { e.preventDefault(); self.open(); } if (k === '/' && !/INPUT|TEXTAREA|SELECT/.test(a.tagName || '') && !a.isContentEditable) { e.preventDefault(); self.open(); } });
      // end-of-chapter flashcards: one card at a time. "Show answer" turns a card over and "Show question" turns it back;
      // marking a card moves on; Previous and Next revisit cards (Next only to cards already marked); the end lists the takeaways.
      // Each deck keeps its marks and its last score on this device (localStorage "cp-fc-<chapter id>", and "cp-fc-intro" for the
      // deck that ends Start here): a reader who comes back finds the cards marked as they left them and "Last time: 3 of 4
      // known." in place of the instruction, and Start over forgets both. Every storage call is guarded, so without storage
      // the deck works the same and simply forgets.
      var FC = {
        parts: function (fc) { return { deck: $('.fc-deck', fc), cards: $$('.fc-card', fc), dots: $$('.fc-dots i', fc), nav: $('.fc-nav', fc), end: $('.fc-end', fc) }; },
        cur: function (p) { for (var j = 0; j < p.cards.length; j++) if (!p.cards[j].hidden) return j; return 0; },
        flip: function (card, back) { card.classList.toggle('is-flipped', back); $('.fc-front', card).inert = back; $('.fc-back', card).inert = !back; },
        go: function (fc, i, focusShow, quiet) { // quiet: set the deck up without touching focus (a deck restored as the page loads)
          var p = FC.parts(fc);
          p.end.hidden = true; p.deck.hidden = false; p.nav.hidden = false;
          p.cards.forEach(function (c, j) { c.hidden = j !== i; FC.flip(c, false); });
          p.dots.forEach(function (d, j) { var kn = p.cards[j].getAttribute('data-known'); d.className = j === i ? 'on' : kn === '1' ? 'k' : kn === '0' ? 'm' : ''; });
          var prev = $('.fc-prev', fc), next = $('.fc-next', fc);
          prev.disabled = i === 0; next.disabled = !p.cards[i].hasAttribute('data-known');
          if (quiet) return;
          var a = document.activeElement;
          if (focusShow || !a || a.disabled || !fc.contains(a) || a.closest('[hidden]')) { var f = $('.fc-show', p.cards[i]); if (f) f.focus({ preventScroll: true }); }
        },
        // the deck's name: its own data-deck where it has one (Start here's, which sits in no chapter), else its chapter's id
        id: function (fc) { return fc.getAttribute('data-deck') || (fc.closest('.chapter') || {}).id || 'geopolitics'; },
        key: function (fc) { return 'cp-fc-' + FC.id(fc); },
        // a short fingerprint of the deck's questions, so marks kept for an earlier version of the cards are not put on new ones
        sig: function (fc) { var s = FC.parts(fc).cards.map(function (c) { return ($('.fc-q', c) || {}).textContent || ''; }).join('|'), h = 5381; for (var j = 0; j < s.length; j++) h = ((h * 33) ^ s.charCodeAt(j)) >>> 0; return h.toString(36); },
        // what this device kept for the deck, or null: nothing kept, storage blocked, or a deck whose cards have changed since
        read: function (fc) {
          var s = null;
          try { s = JSON.parse(localStorage.getItem(FC.key(fc)) || 'null'); } catch (e) { return null; }
          return s && Array.isArray(s.marks) && s.marks.length === FC.parts(fc).cards.length && s.sig === FC.sig(fc) ? s : null;
        },
        save: function (fc, done) { // done: the round is over, and its score becomes the last one
          var marks = FC.parts(fc).cards.map(function (c) { var k = c.getAttribute('data-known'); return k === '1' || k === '0' ? k : ''; });
          var last = done ? { known: marks.filter(function (k) { return k === '1'; }).length, total: marks.length, day: localISO() } : (FC.read(fc) || {}).last;
          var keep = { sig: FC.sig(fc), marks: marks }; if (last) keep.last = last;
          try { localStorage.setItem(FC.key(fc), JSON.stringify(keep)); } catch (e) { }
        },
        forget: function (fc) { try { localStorage.removeItem(FC.key(fc)); } catch (e) { } FC.lastLine(fc, null); },
        // the quiet line beside the deck's title: the instruction, or for a reader who has finished the deck before, that score
        lastLine: function (fc, last) {
          var sub = $('.rv-sub', fc); if (!sub) return;
          if (sub._intro == null) sub._intro = sub.textContent;
          var n = FC.parts(fc).cards.length, ok = !!last && last.total === n && last.known >= 0 && last.known <= n && Math.floor(last.known) === last.known;
          sub.textContent = ok ? 'Last time: ' + last.known + ' of ' + n + ' known.' : sub._intro;
          sub.classList.toggle('fc-last', ok);
        },
        // a reader coming back: the marks go back on the cards and the deck opens at the first card not yet marked, or at the
        // first card when the round was finished, so the deck starts again with the dots showing last time's marks
        restore: function (fc) {
          var s = FC.read(fc); if (!s) return;
          var p = FC.parts(fc), at = -1;
          p.cards.forEach(function (c, j) { var k = s.marks[j]; if (k === '1' || k === '0') c.setAttribute('data-known', k); else if (at < 0) at = j; });
          FC.go(fc, at < 0 ? 0 : at, false, true);
          FC.lastLine(fc, s.last);
        },
        finish: function (fc) {
          var p = FC.parts(fc), k = p.cards.filter(function (x) { return x.getAttribute('data-known') === '1'; }).length;
          p.deck.hidden = true; p.nav.hidden = true; p.end.hidden = false;
          $('.fc-big', p.end).textContent = k + '/' + p.cards.length;
          // an idea marked "Didn't know" stays at full strength and gains the link back to its section; the label says so
          var missed = 0;
          $$('.rv-keep li', p.end).forEach(function (li, j) {
            $$('.fc-more', li).forEach(function (a) { a.remove(); }); // a deck taken again starts clean
            li.classList.remove('miss');
            var c = p.cards[j];
            if (!c || c.getAttribute('data-known') === '1') return;
            var re = $('.fc-more', c);
            if (re) { missed++; li.appendChild(document.createTextNode(' ')); li.appendChild(re.cloneNode(true)); }
          });
          // a chapter's deck links back to a section, Start here's to a chapter (data-reread)
          $('.fc-score-t', p.end).textContent = k === p.cards.length ? 'known.' : missed ? 'known. Each idea marked “Didn’t know” ends with a link to ' + (fc.getAttribute('data-reread') || 'reread its section') + '.' : 'known.';
          var rs = $('.fc-reset', p.end); if (rs) rs.focus({ preventScroll: true });
          FC.save(fc, true);
          if (window.goatcounter && window.goatcounter.count) try { window.goatcounter.count({ path: 'flashcards/' + FC.id(fc) + '/' + k, title: 'Flashcards finished', event: true }); } catch (err) {}
        },
        step: function (fc, d) {
          var p = FC.parts(fc), i = FC.cur(p);
          if (d < 0 && i > 0) FC.go(fc, i - 1);
          if (d > 0 && p.cards[i].hasAttribute('data-known')) { if (i + 1 < p.cards.length) FC.go(fc, i + 1); else FC.finish(fc); }
        }
      };
      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target : null; if (!t) return;
        var fc = t.closest('.fc'); if (!fc) return;
        var card = t.closest('.fc-card');
        if (t.closest('.fc-show')) {
          FC.flip(card, true);
          setTimeout(function () { var k = $('.fc-mark[data-known="1"]', card); if (k) k.focus({ preventScroll: true }); }, reduced ? 0 : 260);
          return;
        }
        if (t.closest('.fc-flipback')) {
          FC.flip(card, false);
          setTimeout(function () { var f = $('.fc-show', card); if (f) f.focus({ preventScroll: true }); }, reduced ? 0 : 260);
          return;
        }
        var m = t.closest('.fc-mark');
        if (m) {
          var i = +card.getAttribute('data-i'), n = FC.parts(fc).cards.length;
          card.setAttribute('data-known', m.getAttribute('data-known') === '1' ? '1' : '0');
          if (i + 1 < n) { FC.save(fc); FC.go(fc, i + 1, true); } else FC.finish(fc);
          return;
        }
        if (t.closest('.fc-prev')) { FC.step(fc, -1); return; }
        if (t.closest('.fc-next')) { FC.step(fc, 1); return; }
        if (t.closest('.fc-back-to-cards')) { FC.go(fc, FC.parts(fc).cards.length - 1, true); return; }
        if (t.closest('.fc-reset')) {
          FC.parts(fc).cards.forEach(function (c) { c.removeAttribute('data-known'); });
          FC.forget(fc);
          FC.go(fc, 0, true);
        }
      });
      $$('.fc').forEach(function (fc) { FC.restore(fc); });
      // a search result for one card: the deck opens at that card, question side up, with focus on "Show answer"
      self.openCard = function (id, i) { var fc = document.getElementById(id); if (fc && fc.classList.contains('fc') && FC.parts(fc).cards[i]) FC.go(fc, i, true); };
      // the arrow keys step through a deck while focus is inside it
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        var fc = e.target && e.target.closest ? e.target.closest('.fc') : null;
        if (!fc || $('.fc-deck', fc).hidden) return;
        e.preventDefault(); FC.step(fc, e.key === 'ArrowLeft' ? -1 : 1);
      });
      // copy a chapter's share link (its own page, which unfurls with a card); the link's href is that page, so a
      // modified click (new tab, new window) opens it instead
      document.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('.ch-copy') : null;
        if (!b) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
        var url = b.getAttribute('data-copy'), done = function () { b.textContent = 'Copied'; b.setAttribute('data-done', '1'); setTimeout(function () { b.textContent = 'Link to chapter'; b.removeAttribute('data-done'); }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
        else window.prompt('Copy this link', url);
      });
      // heading permalinks
      // heading permalinks: the "#" that appears on hover copies the section's full address and sets the hash
      var canon = $('link[rel="canonical"]'), base = canon && canon.href ? canon.href.replace(/#.*$/, '') : location.href.replace(/#.*$/, '');
      $$('.prose h3[id], .prose h4[id]').forEach(function (h) { var a = document.createElement('a'); a.className = 'permalink'; a.href = '#' + h.id; a.setAttribute('aria-label', 'Copy a link to this section'); a.title = 'Copy link'; a.textContent = '#'; h.appendChild(a); });
      document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('.permalink') : null;
        if (!a) return;
        var url = base + a.getAttribute('href'), done = function () { a.textContent = 'Copied'; a.setAttribute('data-done', '1'); setTimeout(function () { a.textContent = '#'; a.removeAttribute('data-done'); }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () {});
      });
      // dataset export buttons (copy to clipboard: JSON or CSV)
      var copy = function (text, btn, label) { var done = function (ok) { btn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { btn.textContent = label; }, 2000); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false); };
      var toCSV = function (rows) { if (!rows.length) return ''; var cols = []; rows.forEach(function (r) { Object.keys(r).forEach(function (k) { if (cols.indexOf(k) < 0) cols.push(k); }); }); var q = function (v) { if (v == null) return ''; if (typeof v === 'object') v = JSON.stringify(v); return String(v).replace(/[\t\n\r]+/g, ' '); }; return cols.join('\t') + '\n' + rows.map(function (r) { return cols.map(function (c) { return q(r[c]); }).join('\t'); }).join('\n'); }; // tab-separated, so a spreadsheet splits the columns on paste
      // quiet: what the bar copies, in a word ("board"). The bar is then one quiet line at the foot of what it copies, "Copy the
      // board · Table · JSON", after the anchor (where 'after') or inside it, last ('append'). It may start empty: the AI Chips
      // selection fills its live array, and that page hides the line while nothing is picked (src/modules/chips.css)
      var addExport = function (anchorSel, name, rows, where, quiet) {
        var get = typeof rows === 'function' ? rows : function () { return rows; }; // a function means: whatever the table currently shows
        var host = $(anchorSel); if (!host || !get() || (!quiet && !get().length)) return;
        var place = function (bar) { if (where === 'after') host.insertAdjacentElement('afterend', bar); else if (where === 'append') host.appendChild(bar); else host.insertAdjacentElement('beforebegin', bar); };
        if (quiet) {
          var q = document.createElement('div'); q.className = 'export-bar xq';
          q.innerHTML = '<span class="xq-k" aria-hidden="true">Copy the ' + esc(quiet) + '</span>' +
            '<button type="button" class="btn ghost"><span class="sr-only">Copy the ' + esc(quiet) + ' as a </span>Table</button><span class="xq-s" aria-hidden="true">·</span>' +
            '<button type="button" class="btn ghost"><span class="sr-only">Copy the ' + esc(quiet) + ' as </span>JSON</button>';
          var put = function (text, btn) { // the button says Copied for a moment, then reads as before
            if (btn._was == null) btn._was = btn.innerHTML;
            var done = function (ok) { btn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { btn.innerHTML = btn._was; }, 2000); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false);
          };
          var qb = q.querySelectorAll('button');
          qb[0].addEventListener('click', function () { put(toCSV(get()), qb[0]); });
          qb[1].addEventListener('click', function () { put(JSON.stringify(get(), null, 1), qb[1]); });
          place(q);
          return;
        }
        var bar = document.createElement('div'); bar.className = 'export-bar';
        bar.innerHTML = '<span class="count">' + get().length + ' rows · ' + esc(name) + '</span><button type="button" class="btn ghost">Copy table</button><button type="button" class="btn ghost">Copy as JSON</button>';
        var b = bar.querySelectorAll('button'), countEl = bar.querySelector('.count');
        host.addEventListener('cp:rows', function () { if (countEl) countEl.textContent = get().length + ' rows · ' + name; });
        b[0].addEventListener('click', function () { copy(toCSV(get()), b[0], 'Copy table'); });
        b[1].addEventListener('click', function () { copy(JSON.stringify(get(), null, 1), b[1], 'Copy as JSON'); });
        place(bar);
      };
      addExport('#matrix', 'country-share matrix', DATA.matrix, 'before');
      addExport('#cf-side .cf-legend', 'chokepoint board', function () { return Geo.boardRows ? Geo.boardRows() : []; }, 'after', 'board'); // under the board's key, in both modes
      addExport('.tl-bar', 'export-control timeline', function () { return Geo.visible || DATA.timeline; }, 'append', 'timeline'); // on the filter row
      addExport('[data-sub="exposure"] .matrix-wrap', 'China revenue share by firm and year', DATA.exposure, 'after', 'figures'); // under the table it copies
      // the line above the board that takes a reader down to the chronology
      document.addEventListener('click', function (e) { var j = e.target.closest ? e.target.closest('.cf-jump-btn') : null; if (!j) return; var t = $('#timeline'); if (t) scrollToEl(t, true); });
      // cite-this block in the footer
      // the edition is the site's last update, read from the footer's "Updated 3 October 2026"; the access date is the reader's own day
      var d0 = localISO(), canon = (document.querySelector('link[rel=canonical]') || {}).href || (location.origin + location.pathname);
      var upd = ($('.site-footer .updated') || {}).textContent || '', um = upd.match(/(\d{1,2})\s+([A-Z][a-z]+)\s+(\d{4})/);
      var year = um ? um[3] : String(new Date().getFullYear()), edition = um ? um[2] + ' ' + year : year; // no stamp: the year alone, never a guessed month
      $$('.site-footer').forEach(function (foot) { var d = d0; foot.insertAdjacentHTML('beforeend', '<details class="cite"><summary>How to cite</summary><pre>Sharma, Y. Chip Supply Chain: How AI Chips Are Made. ' + esc(edition) + '. ' + canon + ' (accessed ' + d + ').</pre><pre>@misc{chipsupplychain' + esc(year) + ',\n  title  = {Chip Supply Chain: How AI Chips Are Made},\n  author = {Sharma, Yashvardhan},\n  year   = {' + esc(year) + '},\n' + (um ? '  month  = {' + esc(um[2]) + '},\n' : '') + '  url    = {' + canon + '},\n  note   = {Accessed ' + d + '}\n}</pre></details>'); });
    }
  };

  // public surface for the module files concatenated after this one (src/modules/*.js)
  /* ---------- explainer animations (figure--anim): play while on screen, captions follow the video ---------- */
  var Anim = {
    init: function () {
      var figs = $$('.figure--anim'); if (!figs.length) return;
      var theme = function () { return Theme.current() === 'dark' ? 'dark' : 'light'; };
      var still = function (fig) { return reduced || fig._user; };
      figs.forEach(function (fig) {
        var v = $('video', fig), stage = $('.anim-stage', fig), btns = $$('.anim-steps button', fig), cap = $('.anim-cap', fig);
        var caps = $$('.anim-transcript li', fig).map(function (li) { return li.textContent.replace(/^[^.]*\.\s*/, ''); });
        var t0s = btns.map(function (b) { return +b.getAttribute('data-t'); }), cur = 0, raf = 0;
        fig._v = v;
        var src = function () { return v.getAttribute('data-src') + '-' + theme(); };
        // the poster is a still the size of the frame: it is fetched only once its figure nears the screen (see near, below)
        var poster = function () { fig._poster = true; v.poster = src() + (reduced && !fig._src ? '-end.jpg' : '-start.jpg'); };
        fig._setPoster = poster;
        // the whole video (under 1 MB) is fetched once and played from memory, so a click on a step seeks there at once, whether
        // or not the server answers byte ranges; a failed fetch falls back to the file itself
        var setSrc = function (url, then) {
          var my = fig._req = (fig._req || 0) + 1; fig._src = url; v.preload = 'auto';
          var done = function (u) { if (my !== fig._req) return; v.src = u; v.load(); if (then) then(); };
          if (!window.fetch || !window.URL || !URL.createObjectURL) { done(url); return; }
          fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
            .then(function (b) { if (my !== fig._req) return; if (fig._blob) URL.revokeObjectURL(fig._blob); fig._blob = URL.createObjectURL(b); done(fig._blob); })
            .catch(function () { done(url); });
        };
        fig._setSrc = setSrc;
        var load = function () { if (!fig._poster) poster(); if (!fig._src) setSrc(src() + '.mp4'); };
        var show = function (i) {
          if (i === cur) return; cur = i;
          btns.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
          cap.textContent = caps[i] || '';
        };
        var sync = function () { var t = v.currentTime, i = 0; for (var j = 0; j < t0s.length; j++) if (t >= t0s[j] - 0.05) i = j; show(i); };
        var tick = function () { sync(); if (!v.paused) raf = requestAnimationFrame(tick); };
        v.addEventListener('play', function () { cancelAnimationFrame(raf); tick(); fig.classList.remove('is-paused'); stage.setAttribute('aria-label', 'Pause the animation'); });
        v.addEventListener('pause', function () { cancelAnimationFrame(raf); sync(); stage.setAttribute('aria-label', 'Play the animation'); });
        v.addEventListener('seeked', sync);
        var toggle = function () {
          load();
          if (v.paused) { fig._user = false; fig.classList.remove('is-paused'); v.play().catch(function () { }); }
          else { fig._user = true; fig.classList.add('is-paused'); v.pause(); }
        };
        stage.addEventListener('click', toggle);
        stage.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
        btns.forEach(function (b, j) {
          b.addEventListener('click', function () {
            // a step is a request to watch from there: it plays at once, even after a pause (the reader asked for it)
            load(); show(j); fig._user = false; fig.classList.remove('is-paused');
            var go = function () { try { v.currentTime = t0s[j] + 0.05; } catch (e) { } v.play().catch(function () { }); };
            if (v.readyState >= 1) go(); else v.addEventListener('loadedmetadata', go, { once: true });
          });
        });
        if (reduced) { stage.setAttribute('aria-label', 'Play the animation'); fig.classList.add('is-paused'); }
      });
      var allPosters = function () { figs.forEach(function (fig) { if (!fig._poster && fig._setPoster) fig._setPoster(); }); };
      // theme: swap to the matching video, keeping the place (a poster not yet fetched stays unfetched)
      new MutationObserver(function () {
        figs.forEach(function (fig) {
          var v = fig._v, base = v.getAttribute('data-src') + '-' + theme();
          if (!fig._src) { if (fig._poster) v.poster = base + (reduced ? '-end.jpg' : '-start.jpg'); return; }
          var t = v.currentTime, playing = !v.paused;
          v.poster = base + '-start.jpg';
          fig._setSrc(base + '.mp4', function () {
            v.addEventListener('loadedmetadata', function () { try { v.currentTime = t; } catch (e) { } if (playing) v.play().catch(function () { }); }, { once: true });
          });
        });
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      // nothing to fetch for print: the animations are left out of paper and the PDF (styles.css), so neither their posters nor
      // their stills are fetched as the page is laid out, and the line stays free for the cover art
      // play only while on screen, and never on its own when the reader asked for reduced motion
      if (!('IntersectionObserver' in window)) { allPosters(); return; }
      // a figure within a screen and a half of the window takes its poster; one in a hidden view (the chain, on the home page) never comes near
      var near = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { if (!en.target._poster && en.target._setPoster) en.target._setPoster(); near.unobserve(en.target); } });
      }, { rootMargin: '150% 0px 150% 0px' });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var fig = en.target, v = fig._v;
          fig._seen = en.isIntersecting;
          if (en.isIntersecting && !still(fig)) { if (!fig._poster) fig._setPoster(); if (!fig._src) fig._setSrc(v.getAttribute('data-src') + '-' + theme() + '.mp4', function () { if (fig._seen && !still(fig)) v.play().catch(function () { }); }); else v.play().catch(function () { }); }
          else if (!v.paused) v.pause();
        });
      }, { threshold: 0.45 });
      figs.forEach(function (f) { near.observe(f); io.observe(f); });
    }
  };

  /* ---------- the browser's own print: nothing folded ----------
     Paper cannot open a folded source list. Chrome opens a closed <details> from print.css (::details-content); other
     browsers do not, so each closed one is opened just before the browser prints and folded again after. build/pdf.py
     opens them itself (CP_PRINT.prepare). */
  (function () {
    var opened = [];
    window.addEventListener('beforeprint', function () { $$('details:not([open])').forEach(function (d) { d.open = true; opened.push(d); }); });
    window.addEventListener('afterprint', function () { opened.forEach(function (d) { d.open = false; }); opened = []; });
  })();

  window.CP = { Stage: Stage, Router: Router, Sections: Sections, Tools: Tools, Band: Band, DATA: DATA, $: $, $$: $$, esc: esc, narrow: narrow, safeUrl: safeUrl, cname: cname, reduced: reduced,
    scrollToEl: scrollToEl, landAt: landAt, headerH: headerH,
    Landscape: Landscape, Suppliers: Suppliers, register: function (view, def) { MODULE_VIEWS[view] = def; if (Router.current === view && def.activate) def.activate(); } };
  function boot() {
    // QA aid: ?only=<chapter-id> shows just that chapter at the top of the page (screenshots in a hidden pane only paint the first frame)
    try {
      var only = new URLSearchParams(location.search).get('only'), onlyEl = only && document.getElementById(only);
      if (onlyEl) {
        document.documentElement.classList.add('dbg-only'); onlyEl.classList.add('only');
        // with no route of its own it opens that chapter, not the home page
        if ((!location.hash || location.hash === '#' || location.hash === '#/') && onlyEl.closest && onlyEl.closest('.view[data-view="stack"]')) history.replaceState(null, '', location.pathname + location.search + '#' + only);
      }
    } catch (e) { }
    Theme.init();
    Tip.init(); Cite.init();
    var printBtn = $('#print-page'); // the dialog lays the page out at once and never waits for an image still loading, so the
    // cover art (src/template.html) is fetched and decoded first, for at most ten seconds
    if (printBtn) printBtn.addEventListener('click', function () {
      if (printBtn._wait) return;
      var art = window.CP_ART ? window.CP_ART() : null;
      if (!art || (art.complete && art.naturalWidth > 0)) { window.print(); return; }
      var label = printBtn.textContent, done = false;
      var go = function () { if (done) return; done = true; printBtn._wait = false; printBtn.textContent = label; printBtn.removeAttribute('aria-busy'); window.print(); };
      printBtn._wait = true; printBtn.textContent = 'Preparing…'; printBtn.setAttribute('aria-busy', 'true');
      (art.decode ? art.decode() : new Promise(function (res) { art.addEventListener('load', res, { once: true }); art.addEventListener('error', res, { once: true }); })).then(go, go);
      setTimeout(go, 10000);
    });
    (function () { // the phone tab strip fades at its right edge while there is more to scroll
      var tabs = $('.tabs'); if (!tabs) return;
      var edge = function () { tabs.setAttribute('data-end', tabs.scrollLeft + tabs.clientWidth >= tabs.scrollWidth - 2 ? '1' : '0'); };
      tabs.addEventListener('scroll', edge, { passive: true }); window.addEventListener('resize', edge); edge();
    })();
    (function () { // The Chain's contents (build/build.js CONTENTS): the chapter pointed at or focused, in the picture or the list, is marked in both
      var box = $('#contents'), hot = null; if (!box) return;
      var mark = function (id) {
        if (id === hot) return;
        if (hot) $$('[data-ch="' + hot + '"]', box).forEach(function (x) { x.classList.remove('is-hot'); });
        hot = id;
        if (id) $$('[data-ch="' + id + '"]', box).forEach(function (x) { x.classList.add('is-hot'); });
      };
      var at = function (e) { var el = e.target.closest ? e.target.closest('[data-ch]') : null; mark(el ? el.getAttribute('data-ch') : null); };
      box.addEventListener('mouseover', at); box.addEventListener('focusin', at);
      box.addEventListener('mouseleave', function () { mark(null); }); box.addEventListener('focusout', function () { mark(null); });
    })();
    Tools.init();
    // The masthead wraps on phones, so the sticky offsets make room for its real height when it is taller than the
    // stylesheet's --masthead (large text, a narrow screen). A shorter one keeps the stylesheet's value: the page has been
    // painted against it since before boot, so a write would move everything on screen, and each write lays the whole page
    // out again. It is checked at boot, at load (the fonts may have come in) and when the width changes; a phone's address
    // bar coming and going changes only the height. A wide masthead's height is var(--masthead) itself.
    var mastW = -1, mastCSS = 0;
    var setMast = function (e) {
      var m = $('.masthead'), root = document.documentElement; if (!m) return;
      var w = window.innerWidth, was = root.style.getPropertyValue('--masthead');
      if (e && e.type === 'resize') { if (w === mastW) return; if (was) { root.style.removeProperty('--masthead'); was = ''; } }
      if (!was) mastCSS = cssPx('--masthead'); // the stylesheet's own value at this width
      mastW = w;
      var h = m.offsetHeight, want = h > mastCSS + 0.5 ? h + 'px' : '';
      if (want !== was) { if (want) root.style.setProperty('--masthead', want); else root.style.removeProperty('--masthead'); }
    };
    setMast(); window.addEventListener('resize', setMast); window.addEventListener('load', setMast);
    Stage.init();
    Band.init();
    Router.init();
    Sections.init();
    Anim.init();
    // specimens are built ahead of the reader while the browser is idle, and only while the stage shows: a wide screen queues
    // every one the chain names, a phone only the next two (Sections.update), and a view without a stage builds none
    if (!narrow()) Stage.soon($$('[data-view="stack"] [data-specimen]').map(function (el) { return el.getAttribute('data-specimen'); }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
