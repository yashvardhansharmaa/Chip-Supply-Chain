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
  var safeUrl = function (u) { var v = String(u == null ? '' : u).trim(); return /^(https?:|mailto:|#|\/|(\.\.\/)+|[a-z0-9-]+\/)/i.test(v) ? esc(v) : '#'; }; // data-fed link targets may only be web links, mail, fragments or site paths (a page's own, as ../#/suppliers or lithography/#…, since 28 Oct 2026)
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
      // the phone's collapsed strip shows the specimen's line drawing (the still /supply-chain/ shows), where the live drawing
      // at 52 px was a dark blob; a specimen with no still keeps the live one (src/styles.css .stage-thumb)
      var th = $('.stage-thumb', this.fig), cid = ((window.CP_TERMS || {}).specimenChapter || {})[name];
      if (th) { if (cid) { var u = (PAGE.root || '') + 'media/line-' + cid + '.webp'; if (th.getAttribute('src') !== u) th.setAttribute('src', u); th.hidden = false; this.fig.setAttribute('data-thumb', '1'); } else { th.hidden = true; this.fig.removeAttribute('data-thumb'); } }
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
      // a turntable specimen makes every turn about its own axis, so it never leans (the HBM stack, 29 Oct 2026); t[1] is where it starts
      var M = slot.turntable
        ? mul(rotZ(t[2]), mul(rotX(t[0]), rotY(t[1] + idle + this.scrollAngle + extraRot)))
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
        var M = slot.turntable ? mul(rotZ(t[2]), mul(rotX(t[0]), rotY(t[1] + yaw))) : mul(rotZ(t[2]), mul(rotY(t[1] + yaw), rotX(t[0])));
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
      var strip = this.balloonEl.classList.contains('is-strip');
      if (strip) { var bs = this.balloonEl.style; bs.left = this.canvas.offsetLeft + 'px'; bs.top = this.canvas.offsetTop + 'px'; bs.width = w + 'px'; bs.height = h + 'px'; } // over the strip's canvas
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
      // a name's width, measured once the faces are in
      var nameW = function (p) { var t = p.tw || 0; if (!t) { t = p.tl.getComputedTextLength ? p.tl.getComputedTextLength() : 0; if (t > 0) p.tw = t; else t = String(p.name).length * 8; } return t; };
      // on each side, the balloons keep 34 px apart, in the order of the parts' heights. Where a name has no room beside its
      // balloon it stands under it (below), and the balloons on that side then keep 58 px apart, so a name never runs into the
      // next balloon (a drawing as wide as its slot, CoWoS; labels mockup of 29 Oct 2026). The strip shows no names
      sides.forEach(function (list, si) {
        var x = si ? colR : colL, under = !strip && list.some(function (p) { return si ? x + 18 + nameW(p) > w - 2 : x - 18 - nameW(p) < 2; });
        var step = under ? 58 : 34;
        list.sort(function (a, b) { return a.ty - b.ty; });
        for (var i = 1; i < list.length; i++) if (list[i].ty - list[i - 1].ty < step) list[i].ty = list[i - 1].ty + step;
        var over = list.length ? list[list.length - 1].ty - (h - (under ? 40 : 18)) : 0;
        if (over > 0) list.forEach(function (p) { p.ty -= over; });
      });
      var snap = this.balloonsSnap; this.balloonsSnap = false;
      parts.forEach(function (p) {
        if (!p.pts || !p.pts.length) return;
        var tx = p.side < 0 ? colL : colR, ty = Math.max(16, p.ty);
        if (p.x === null || snap || reduced) { p.x = tx; p.y = ty; } else { p.x += (tx - p.x) * 0.14; p.y += (ty - p.y) * 0.14; }
        p.c.setAttribute('cx', p.x.toFixed(1)); p.c.setAttribute('cy', p.y.toFixed(1));
        p.tn.setAttribute('x', p.x.toFixed(1)); p.tn.setAttribute('y', (p.y + 4.5).toFixed(1));
        var left = p.x < cx, tw = nameW(p);
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
    setVisible: function (v) { var self = this; this.active = v; if (!this.fig) return; var show = v && this.ok; this.fig.setAttribute('data-hidden', show ? '0' : '1'); this.fig.setAttribute('data-route', v ? 'spec' : 'none'); /* a page with no specimen has no strip on a phone (page revision 2, src/styles.css) */ if (show) { this.resize(); requestAnimationFrame(function () { self.resize(); }); this.idle(); } },
    draw: function (slot, op, extraRot, sc) {
      var gl = this.gl, aspect = this.w / this.h;
      // proj(): the perspective, and the camera pulled back on narrow (portrait) stages so the bounding sphere fits the width too
      // (3.8 keeps the unit sphere inside 89% of the canvas height, including perspective). model(): turntable specimens turn
      // about their own vertical axis before the tilt (a stack that never leans), the rest about the world axis, and the
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


  /* ---------------- phone specimen strip: a 64 px bar with a live thumbnail; a tap on it opens it; Contents opens the sheet ---------------- */
  var Band = {
    el: null, collapsed: true,
    init: function () {
      var self = this; this.el = $('.stage'); if (!this.el) return;
      var toggle = $('.stage-toggle'), menu = $('.stage-menu'), sheet = $('#sheet');
      this.set(true);
      // the collapsed strip's height (64 px, src/styles.css): the page keeps that much room at its foot (--strip-h)
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
      // the sheet marks the chapter being read and lists its sections under it, as the rail does on a wide screen (28 Oct 2026)
      var markSheet = function () {
        if (!sheet) return;
        var id = PAGE.chapter || (Router.current === 'stack' && Router.chain && Router.chain !== 'contents' ? Router.chain : '');
        $$('.sheet-chapters a[aria-current]', sheet).forEach(function (a) { a.removeAttribute('aria-current'); });
        $$('.sheet-secs', sheet).forEach(function (o) { o.remove(); });
        if (!id) return;
        var cur = $$('.sheet-chapters > li > a', sheet).filter(function (a) { var h = a.getAttribute('href') || ''; return h === '#' + id || new RegExp('(^|/)' + id + '/$').test(h); })[0];
        if (!cur) return;
        cur.setAttribute('aria-current', 'page');
        var toc = $$('.ch-rail .rail-toc', document).filter(function (o) { var r = o.closest('.ch-rail'), art = o.closest('article.chapter'); return !art || art.id === id; })[0];
        if (!toc) return;
        var ol = document.createElement('ol'); ol.className = 'sheet-secs'; ol.setAttribute('aria-label', 'In this chapter');
        $$('a', toc).forEach(function (a) { var li = document.createElement('li'), b = document.createElement('a'); b.href = a.getAttribute('href'); b.textContent = a.textContent; li.appendChild(b); ol.appendChild(li); });
        cur.parentNode.appendChild(ol);
      };
      if (menu) menu.addEventListener('click', function () {
        markSheet(); open(true);
        var cur = $('.sheet-chapters a[aria-current]', sheet); // the chapter being read in view, under the head
        if (cur) sheet.scrollTop = Math.max(0, cur.getBoundingClientRect().top - sheet.getBoundingClientRect().top + sheet.scrollTop - 160);
      });
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
      // collapsed on a phone, Expand is the strip itself (a clear button over all of it but Contents, src/styles.css), so its
      // name says what a tap opens; opened, it is the Collapse pill
      var t = $('.stage-toggle'); if (t) { t.textContent = collapsed ? 'Expand' : 'Collapse'; t.setAttribute('aria-expanded', collapsed ? 'false' : 'true'); if (collapsed) t.setAttribute('aria-label', 'Open the drawing'); else t.removeAttribute('aria-label'); }
      if (Stage.stripBalloons) Stage.stripBalloons(); // expanded, the strip numbers the parts of a drawing that has them
    }
  };

  /* ---------------- router ---------------- */
  var VIEWS = ['home', 'stack', 'chain', 'intro', 'walk', 'briefing', 'landscape', 'ai-chips', 'suppliers', 'geopolitics', 'controls', 'export-controls', 'thresholds', 'exposure', 'glossary', 'sources'];
  var ALIAS = { chain: 'stack', home: 'walk', intro: 'walk', briefing: 'walk', geopolitics: 'stack', thresholds: 'controls', sources: 'stack', 'export-controls': 'controls', 'ai-chips': 'landscape' }; // the tab names typed as routes land on their pages // the Sources page was retired; its sources sit at the end of each chapter // the licence-thresholds tab was retired; its route lands on the board
  var MODULE_VIEWS = {}; // modules register { activate(), stage: bool } per view through window.CP.register
  /* Each chapter has a page of its own since 28 Oct 2026 (build/build.js), and so do The Chain's contents: PAGE says which page
     this is, the home page (the views), the contents page (/supply-chain/), a chapter's page (that chapter alone) or the
     book (the contents and every chapter, for print), and where the site's root is from here. away(hash) is the address a hash belongs at when this page does not serve it, and ''
     when it does (src/preroute.js away()); addr(hash) is the address a link the app writes should carry: the hash itself
     where this page serves it, else that page's address, so a link to a chapter is a real link */
  var PAGE = (window.CP_PRE && window.CP_PRE.page) || { kind: 'book', chapter: '', root: '' };
  var away = function (h) { return window.CP_PRE && window.CP_PRE.away ? window.CP_PRE.away(h) : ''; };
  var addr = function (h) { return away(h) || h; };
  /* An action that used to follow a route on the same page (a search result's chip card, supplier filter or flashcard, a
     glossary passage's paragraph) and now crosses to another page is kept for that page in sessionStorage; the page it
     lands on carries it out once it has booted (Router.init). go(href, act) follows a link the app built: on this page it
     returns false and the caller acts as before; elsewhere it keeps act and leaves, and returns true */
  var AFTER = 'cp-after';
  /* need(name, fn): the shared files the app fetches only when it needs them (build/build.js writes their addresses into
     CP_ASSETS): search.js, the search index, when the search opens; glossary.js, the Glossary's lists and the chapters'
     passages, when the Glossary opens. fn runs once the file is in, or at once if it already is (or failed to come) */
  var NEEDS = { 'search.js': 'CP_SEARCH', 'glossary.js': 'CP_GLOSSARY' }, waits = {};
  var need = function (name, fn) {
    if (window[NEEDS[name]] || !(window.CP_ASSETS || {})[name]) { if (fn) fn(); return; }
    if (waits[name]) { if (fn) waits[name].push(fn); return; }
    waits[name] = fn ? [fn] : [];
    var sc = document.createElement('script'); sc.src = window.CP_ASSETS[name];
    sc.onload = sc.onerror = function () { var l = waits[name]; waits[name] = null; l.forEach(function (f) { try { f(); } catch (e) { console.warn(e); } }); };
    document.head.appendChild(sc);
  };
  var go = function (href, act) {
    var to = away(href); if (!to) return false;
    try { if (act) sessionStorage.setItem(AFTER, JSON.stringify(act)); } catch (e) { }
    location.href = to; return true;
  };
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
      // (only the book still carries data-route: on the home page and the chapter pages a chapter link is a plain link to its page)
      document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[data-route]') : null;
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        var r = a.getAttribute('data-route');
        if (away(r)) return; // not on this page: the link's own address
        e.preventDefault();
        if (r === location.hash) self.route(); else location.hash = r;
      });
      // a fragment link whose place is on another page (a glossary entry from a chapter, another chapter's section) goes to that
      // page's address; a click with a modifier opens this address in a new tab, whose page forwards it the same way
      document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        var to = away(a.getAttribute('href'));
        if (to) { e.preventDefault(); location.href = to; }
      });
      var wm = $('.wordmark'); // the wordmark always takes you back to the top of the stack (from another page, its link goes home)
      if (wm && PAGE.kind === 'home') wm.addEventListener('click', function (e) { e.preventDefault(); if (location.hash && location.hash !== '#/') location.hash = '#/'; window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
      this.route();
      // an action kept by the page the reader came from (go(), above), once this page has drawn its view
      var act = null; try { act = JSON.parse(sessionStorage.getItem(AFTER) || 'null'); sessionStorage.removeItem(AFTER); } catch (e) { act = null; }
      if (act) setTimeout(function () { self.after(act); }, 60);
    },
    /* the kept action (go()): a chip's card on AI Chips, a filter on Suppliers, a deck at one card, a passage flashed */
    after: function (act) {
      if (act.chip) Landscape.openCard(act.chip, { show: true });
      if (act.q) Suppliers.show({ q: act.q });
      if (act.card && Tools.openCard) Tools.openCard(act.card.id, act.card.i);
      if (act.para && window.CP.Lookup && window.CP.Lookup.flash) window.CP.Lookup.flash(act.para);
      if (act.land) Keys.land(act.land); // a search result's place takes focus, as it did on one page
    },
    route: function () {
      // an address of a chapter merged away lands in the merged chapter (src/preroute.js moved(), build/retired-chapters.js)
      var mv = window.CP_PRE && window.CP_PRE.moved ? window.CP_PRE.moved(location.hash) : '';
      if (mv) { try { history.replaceState(history.state, '', location.pathname + location.search + mv); } catch (e) { } }
      // a hash this page does not serve (a chapter's on the home page, a view's on a chapter's page) goes to its page, in
      // place of this entry, so Back returns to where the reader was
      var to = away(location.hash);
      if (to) { location.replace(to); return; }
      var h = location.hash || '#/', m = h.match(/^#\/([a-z-]+)/), bare = h.replace(/^#/, '');
      var atHome = bare === '' || bare === '/' || bare.indexOf('/?') === 0; // '#/?country=JP' is the home page with a query
      var v = (atHome || m) ? 'walk' : 'stack'; // the site opens on the walk (trial, 11 Sept 2026); an unknown #/route goes home; a bare chapter anchor opens the chain
      if (PAGE.kind !== 'home' && v === 'walk') { v = 'stack'; m = null; bare = ''; } // a chapter's page and the book hold The Chain alone (their own top)
      if (m && VIEWS.indexOf(m[1]) >= 0) v = m[1];
      var anchor = v === 'geopolitics' ? 'geopolitics' : ((!m && bare && !atHome) ? dec(bare) : null);
      if (anchor && !m) { // a bare anchor belongs to whichever view holds it; one that sits outside them all (the skip link's #app) leaves the view alone
        var target = document.getElementById(anchor), host = target && target.closest ? target.closest('.view[data-view]') : null;
        if (host) v = host.getAttribute('data-view');
        else if (target) v = this.current || v;
        else if (window.CP_PRE && window.CP_PRE.route) v = window.CP_PRE.route(h).view || v; // not on the page yet (the Glossary's entries come with glossary.js): the view its prefix names
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
      // A page reached by Back or Forward from another page (each chapter has its own since 28 Oct 2026) is the browser's to
      // put back where the reader left it, so the first route leaves its scroll alone too
      var pre = window.CP_PRE || {}, first = !this.routed;
      var nav = first && window.performance && performance.getEntriesByType ? (performance.getEntriesByType('navigation')[0] || {}).type : '';
      var kept = first && (!!pre.touched || nav === 'back_forward');
      if (first) {
        document.documentElement.classList.add('booted');
        if (pre.view && pre.view !== v) console.warn('src/preroute.js showed "' + pre.view + '" while the page loaded, but the router opens "' + v + '" for ' + location.hash);
      }
      $$('.tabs a').forEach(function (a) { var dv = a.getAttribute('data-view'); var on = dv === v; if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      if (narrow()) { var strip = $('.tabs'), onTab = $('.tabs a[aria-current="page"]'); if (strip && onTab) { var sr = strip.getBoundingClientRect(), tr = onTab.getBoundingClientRect(); if (tr.left < sr.left) strip.scrollLeft -= sr.left - tr.left; else if (tr.right > sr.right) strip.scrollLeft += tr.right - sr.right; } } // the phone tab strip scrolls; keep the current tab in view by moving the strip alone (scrollIntoView would also move the Tab starting point to the tab, so the first Tab skipped the skip link)
      // the printed cover's art is fetched only on the way to print (src/template.html), never because The Chain was read
      var mv = MODULE_VIEWS[v];
      Stage.setVisible(v === 'stack' || v === 'walk' || !!(mv && mv.stage)); // AI Chips draws its own packages, so the stage does not show there
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
          // an address that names a folded list (a chapter's Sources) or a place inside one opens it (28 Oct 2026)
          var fold = el ? (el.tagName === 'DETAILS' ? el : el.closest && el.closest('details')) : null;
          if (fold && !fold.open) fold.open = true;
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
      var page = { walk: '/', landscape: '/chips/', suppliers: '/suppliers/', controls: '/export-controls/', glossary: '/glossary/', stack: '/supply-chain/' }[v];
      document.title = (ch && T[ch]) || (page && T[page]) || (v === 'stack' ? 'Supply Chain · Chip Supply Chain' : T['/'] || 'Chip Supply Chain');
    },
    /* what The Chain shows for an anchor: the chapter that holds it, or the contents (#/chain, the contents' own ids, an id
       found nowhere) */
    chainOf: function (anchor) {
      if (PAGE.kind === 'chapter') return PAGE.chapter; // a chapter's page shows its chapter, whichever of its anchors is named
      if (PAGE.kind === 'contents') return 'contents'; // and the contents page its contents
      var el = anchor ? document.getElementById(anchor) : null, ch = el && el.closest ? el.closest('article.chapter') : null;
      return ch && ch.closest('.view[data-view="stack"]') ? ch.id : 'contents';
    },
    /* a jump lands before the web fonts, late images and freshly built rows settle, and anything reflowing above the target
       moves it; for the next second or two, put it back whenever it has drifted, unless the reader has started to scroll or gone elsewhere */
    settle: function (el) {
      // each settle takes a number, and a newer one retires the older: a Glossary passage link settles the passage after the
      // router has settled its chapter, and the chapter must not pull the page back to its top (correctness P1-1)
      var self = this, gen = this.settleGen = (this.settleGen || 0) + 1;
      var moved = false, h0 = location.hash, mark = function () { moved = true; self.settling = 0; };
      ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, mark, { passive: true, once: true }); });
      // until the page has settled, or the reader moves it, a shift of the page is not the reader's scroll (Rail.update):
      // the browser keeps the anchor in place as late faces and pictures reflow the text above it
      this.settling = Date.now() + 2000;
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
      this.update();
    },
    update: function () {
      var toTop = $('.to-top'); // Back to top on every long page, not only the chain (on a phone too: Top left the strip, page revision 2)
      if (toTop) {
        var contentsEl = Router.current === 'stack' && Router.chain === 'contents' ? $('#contents') : null;
        var far = contentsEl ? contentsEl.getBoundingClientRect().bottom < 0 : window.scrollY > window.innerHeight * 0.8;
        // on a phone the pill sat over the text: there it shows only while the reader heads back up, and goes after 3 s at rest
        // or on the next move down (28 Oct 2026); a wide screen keeps it in its empty corner
        if (narrow()) {
          var y = window.scrollY, dy = y - (this.lastY == null ? y : this.lastY), self2 = this; this.lastY = y;
          if (!far || dy > 6) this.upShow = false;
          else if (dy < -6) { this.upShow = true; clearTimeout(this.upT); this.upT = setTimeout(function () { self2.upShow = false; var b = $('.to-top'); if (b && document.activeElement !== b) b.setAttribute('data-show', '0'); }, 3000); }
          far = far && !!this.upShow;
        }
        toTop.setAttribute('data-show', far ? '1' : '0');
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
        if (!inSlot) Stage.show(best.getAttribute('data-specimen'), null, this.caption(best), this.specTag(best));
        // a phone builds only the next two specimens ahead of the reader (a wide screen queues them all at boot)
        if (narrow()) {
          var ahead = [];
          for (var j = items.indexOf(best) + 1; j < items.length && ahead.length < 2; j++) { var nm = items[j].getAttribute('data-specimen'); if (nm && nm !== best.getAttribute('data-specimen') && ahead.indexOf(nm) < 0) ahead.push(nm); }
          Stage.soon(ahead);
        }
      }
      // the strip's wine rule (page revision 2): the share of the chapter read on The Chain, of the page on home
      if (narrow() && Band.el) {
        var cur = Router.current === 'stack' && this.currentId ? document.getElementById(this.currentId) : null, read = 0;
        if (cur) { var cr = cur.getBoundingClientRect(); read = cr.height ? (vh - cr.top) / cr.height : 0; }
        else { var de = document.documentElement; read = de.scrollHeight ? (window.pageYOffset + vh) / de.scrollHeight : 0; }
        Band.el.style.setProperty('--read', Math.max(0, Math.min(1, read)).toFixed(3));
      }
      Rail.update();
    },
    // the stage's tag for an item: "Specimen 04 · Lithography" beside the page on a laptop; on the phone's strip (page revision 2,
    // src/styles.css) "Specimen 04 · EUV scanner", the specimen's own name, over "Tap for the drawing and its parts" ("Tap for
    // the full drawing" for a drawing with no numbered parts)
    specTag: function (item) {
      var num = item.getAttribute('data-number'), sp = item.getAttribute('data-specimen') || '';
      // the names come with the data on the home page and with terms.js on every page (a chapter's page loads no data)
      var ch = num ? esc(item.getAttribute('data-title') || '') : 'the whole chip', name = (DATA.specimenNames || (window.CP_TERMS || {}).specimenNames || {})[sp];
      var parts = Router.current === 'stack' && $('.ch-spec .ch-parts', item);
      return 'Specimen <b>' + (num || '00') + '</b> · <span class="tag-ch">' + ch + '</span><span class="tag-sp">' + (name ? esc(name.charAt(0).toUpperCase() + name.slice(1)) : ch) + '</span>'
        + '<span class="tag-tap">' + (parts ? 'Tap for the drawing and its parts' : 'Tap for the full drawing') + '</span>';
    },
    // the caption the stage shows for an item: its own words, and on The Chain the parts list under them (the phone's strip
    // shows it once expanded)
    caption: function (item) {
      var c = item.getAttribute('data-caption') ? esc(item.getAttribute('data-caption')) : null;
      var parts = Router.current === 'stack' ? $('.ch-spec .ch-parts', item) : null, k = parts ? $('.ch-spec .ch-parts-k', item) : null;
      // the parts first, so the opened strip names the drawing's numbers before its scroll (28 Oct 2026; they sat under the caption)
      return c && parts ? '<span class="stage-parts">' + (k ? k.outerHTML : '') + parts.outerHTML + '</span><span class="stage-cap-t">' + c + '</span>' : c;
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
      Stage.show(ch.getAttribute('data-specimen'), null, this.caption(ch), this.specTag(ch));
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
      // a jump (a link, a search result, the page landing on an anchor) moves hundreds of pixels at once: the masthead stays; so
      // does the page settling after a landing, before the reader has moved it (Router.settle)
      if (Router.settling && Date.now() < Router.settling) { this.lastY = y; return; }
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

  /* ---------------- AI Chips: the shelves ----------------
     Design round seven, option B "the shelves" (qa/design7/b/ in the main checkout, chosen 28 Oct 2026; the build brief is
     qa/design7/BUILD-SHELVES.md). The head sets the title and the standfirst beside the field chart: every chip by the month
     it was announced, against the figure its one select names, the largest in wine, and one line naming the chips with no
     figure. Under it one ruled shelf per maker (countries as they first appear, China last), each maker's packages drawn from
     above at one scale, oldest first. The WSE-3 Turbo is a whole wafer, so it is drawn at a smaller scale with its own scale
     bar, inside its own row. A chip opens in place, under its maker's shelf, as a chip card set like the chokepoint card: the
     name and the plan with its numbered parts, the six figures in large type, then ruled rows (who makes it, where it stands
     on the chart, the attributes in words, how the speed is counted, the notes and the sources). "Compare with another chip"
     opens the picker (a bottom sheet on a phone) and widens the card into two to four columns, each headed by its package at
     one shared scale, the largest figure of each row in wine. Nothing on a shelf or on the chart adds to a comparison: a name
     opens that one chip, and the chart's tip offers "Open the …". The choice and the chart's figure live in the address
     (#/landscape?pick=a,b&measure=mem), each choice a history entry, so a shared link opens on it and Back returns. Every
     figure prints the data's own digits, thousands grouped, and carries the source the data names for it (the chip's "cite",
     since 28 Oct 2026: no source is guessed from its label, and a part no listed source states carries the list mark "all").
     The specimen stage does not show on this page.
     src/modules/chips.css styles it. */
  var Landscape = (function () {
    var chips = DATA.landscape || [], NOTES = DATA.landscapeNotes || {}, CMP = DATA.landscapeCompare || { pairs: [], with: {} };
    var L = {
      chips: chips,
      // the rows that carry a source, each with the key of its entry in a chip's "cite" (data/landscape.json): "4, 12" is the
      // chip's sources 4 and 12, and a row the data leaves out of cite carries the list mark "all". The memory makers have theirs
      // in cite.suppliers, by name. build/modules/reference-pages.js marks /chips/ by the same keys, and
      // qa/redesign/datacheck-chips.js reads its expected marks from the data
      SRC: [
        { label: 'Vendor', key: 'vendor' }, { label: 'Announced', key: 'announced' }, { label: 'Availability', key: 'status' },
        { label: 'Built for', key: 'target' }, { label: 'Foundry, process node', key: 'process' }, { label: 'Package', key: 'package' },
        { label: 'Memory type', key: 'memtype' }, { label: 'Speed at FP16, TFLOPS', key: 'fp16' }, { label: 'Speed at FP8, TFLOPS', key: 'fp8' },
        { label: 'Speed at FP4, TFLOPS', key: 'fp4' }, { label: 'Memory, gigabytes', key: 'mem' }, { label: 'Bandwidth, terabytes/s', key: 'bw' },
        { label: 'Power, watts', key: 'tdp' }, { label: 'Chip-to-chip links', key: 'c2c' }, { label: 'Scale-up, in one rack', key: 'scale' },
        { label: 'Price estimate', key: 'price' }, { label: 'Cost to make, estimate', key: 'bom' }, { label: 'Export-control status', key: 'export' }
      ],
      TFLOPS_SENTENCE: 'TFLOPS counts trillions of calculations a second. FP16, FP8 and FP4 are number formats that use 16, 8 and 4 bits per number. The fewer the bits, the more calculations a chip can do.'
    };
    var byId = function (id) { for (var i = 0; i < chips.length; i++) if (chips[i].id === id) return chips[i]; return null; };
    var short = function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); }; // "H100 (SXM5)" reads "H100"
    var maker = function (c) { return String(c.vendor).replace(/\s*\(.*\)\s*$/, ''); }; // "Huawei (HiSilicon)" reads "Huawei"
    var WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    var cap1 = function (t) { t = String(t); return t.charAt(0).toUpperCase() + t.slice(1); };
    var low1 = function (t) { return /^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t; };
    var join = function (l, w) { w = w || 'and'; return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' ' + w + ' ' + l[l.length - 1]; };
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // a figure as the data gives it: every digit kept, thousands grouped (2.039 stays 2.039, 1307.4 reads 1,307.4)
    var nf = function (v) { var t = String(v), neg = t.charAt(0) === '-', p = (neg ? t.slice(1) : t).split('.'); return (neg ? '-' : '') + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); };
    var nfAxis = function (v) { return (Math.round(v * 100) / 100).toLocaleString('en-US'); }; // an axis tick is not a figure from the data, so it may be rounded
    var when = function (s) { // "2024-03" reads March 2024, "2023" stays 2023, "2024-Q4" reads Q4 2024
      s = String(s || ''); var m = /^(\d{4})-(\d{2})$/.exec(s); if (m) return MONTHS[+m[2] - 1] + ' ' + m[1];
      m = /^(\d{4})-Q(\d)$/.exec(s); if (m) return 'Q' + m[2] + ' ' + m[1]; return s;
    };
    var year = function (c) { return String(c.announced || '').slice(0, 4); };
    var tOf = function (c) { var m = /^(\d{4})(?:-(\d{2}))?/.exec(String(c.announced || '')); if (!m) return null; return +m[1] * 12 + (m[2] ? +m[2] - 1 + 0.5 : 6); };
    var nar = function () { return window.innerWidth <= 760; }; // the phone layout (the site's narrow() is under 900 px)
    var r2 = function (v) { return Math.round(v * 10) / 10; };
    var slugV = function (v) { return String(v).replace(/\W+/g, '-').toLowerCase(); };

    /* ---- the six figures ---- */
    var MEAS = [
      { key: 'fp16', label: 'Speed at FP16', unit: 'TFLOPS', fmt: 'fp16', get: function (c) { return (c.compute || {}).fp16TFLOPS; } },
      { key: 'fp8', label: 'Speed at FP8', unit: 'TFLOPS', fmt: 'fp8', get: function (c) { return (c.compute || {}).fp8TFLOPS; } },
      { key: 'fp4', label: 'Speed at FP4', unit: 'TFLOPS', fmt: 'fp4', get: function (c) { return (c.compute || {}).fp4TFLOPS; } },
      { key: 'mem', label: 'Memory', unit: 'GB', words: 'the memory', get: function (c) { return (c.memory || {}).capacityGB; } },
      { key: 'bw', label: 'Bandwidth', unit: 'TB/s', words: 'the bandwidth', get: function (c) { return (c.memory || {}).bandwidthTBs; } },
      { key: 'tdp', label: 'Power', unit: 'W', words: 'the power', get: function (c) { return c.tdpW; } }
    ];
    var meas = {}; MEAS.forEach(function (m) { meas[m.key] = m; });
    var unitWords = { TFLOPS: 'TFLOPS', GB: 'gigabytes', 'TB/s': 'terabytes a second', W: 'watts' };
    var STAT = { fp16: 'TFLOPS at FP16', fp8: 'TFLOPS at FP8', fp4: 'TFLOPS at FP4', mem: 'GB of memory', bw: 'TB/s of bandwidth', tdp: 'Watts of power' };
    // what is missing, in the data's own words: a format the chip does not run is "not supported", anything else "not published"
    var nilKind = function (c, m) { if (m.get(c) != null) return ''; var s = m.fmt ? ((c.compute || {}).support || {})[m.fmt] : null; return s === 'no' ? 'no' : 'np'; };

    /* ---- sources: each figure and part line carries the source the data names for it (cite: "4, 12" is the chip's sources 4
       and 12, by their place in its list). A part the data leaves out of cite carries "all", which leads to the chip's list ---- */
    var citeOf = function (c, key, sup) { // the indexes into c.sources, or null where the data names none
      var C = c.cite || {}, v = sup != null ? (C.suppliers || {})[sup] : C[key], n = (c.sources || []).length;
      if (v == null || v === '') return null;
      var out = String(v).split(/\s*,\s*/).map(function (x) { return +x - 1; }).filter(function (i) { return i >= 0 && i < n; });
      return out.length ? out : null;
    };
    // the notes' citations, renumbered to the chip's own list by URL, so one numbered list serves the figures, the parts and the
    // notes; a cited URL the list lacks is added at its end
    var srcCache = {};
    var srcList = function (c) {
      if (srcCache[c.id]) return srcCache[c.id];
      var list = (c.sources || []).map(function (s) { return { label: s.label || s.url, url: s.url }; }), at = {};
      list.forEach(function (s, i) { at[s.url] = i; });
      var raw = String(NOTES[c.id] || '').replace(/^\s*<p><code>[^<]*<\/code><\/p>\s*/, '');
      var html = raw.replace(/<sup class="cite"><a href="([^"]+)"([^>]*)>[^<]*<\/a><\/sup>/g, function (all, href, attrs) {
        var u = href.replace(/&amp;/g, '&'), i = at[u];
        if (i == null) { var t = /data-t="([^"]*)"/.exec(attrs), p = /data-p="([^"]*)"/.exec(attrs); list.push({ label: (t ? t[1] : esc(u)) + (p ? ', ' + p[1] : ''), url: u, raw: true }); i = at[u] = list.length - 1; }
        return marks(c, [i], list);
      });
      srcCache[c.id] = { list: list, notes: html };
      return srcCache[c.id];
    };
    // the numbered marks; all adds the list mark after them, for a line whose parts the data sources only in part
    var marks = function (c, idxs, list, all) {
      list = list || srcList(c).list; var seen = [];
      idxs.forEach(function (i) { if (i != null && i >= 0 && list[i] && seen.indexOf(i) < 0) seen.push(i); });
      var a = seen.sort(function (x, y) { return x - y; }).map(function (i) {
        var s = list[i], lab = s.raw ? s.label : esc(s.label);
        return '<a href="' + safeUrl(s.url) + '" target="_blank" rel="noopener" title="Source ' + (i + 1) + ': ' + lab + '" aria-label="Source ' + (i + 1) + ': ' + lab + '">' + (i + 1) + '</a>';
      });
      if (all) a.push('<a href="#aic-srcs-' + esc(c.id) + '" data-srcs="' + esc(c.id) + '" title="No one source states this: the sources for the ' + esc(short(c)) + ' are listed under Sources" aria-label="The sources for the ' + esc(short(c)) + ', listed under Sources">all</a>');
      return a.length ? '<sup class="cm">' + a.join('<span aria-hidden="true">,</span>') + '</sup>' : '';
    };
    var markOf = function (c, key) { var i = citeOf(c, key); return i ? marks(c, i) : marks(c, [], null, true); };
    // the line under the figures that names what they describe, where a chip ships in more than one setting (the Nvidia racks)
    var basisLine = function (c, who) {
      if (!c.basis) return '';
      var t = esc(c.basis); if (who) t = t.replace(/^Figures are/, esc(who) + ' figures are');
      var i = citeOf(c, 'basis');
      return '<p class="srcline">' + (i ? t.replace(/\.$/, '') + marks(c, i) + '.' : t) + '</p>';
    };

    /* ---- the package plan, drawn from above at one scale (millimeters times k pixels) ---- */
    var planBounds = function (Lt) {
      if (!Lt) return null;
      if (Lt.waferScale) { var d = Lt.diameterMm || 300; return [d, d]; }
      if (Lt.substrate) return [Lt.substrate[0], Lt.substrate[1]];
      if (Lt.interposer) return [Lt.interposer[0], Lt.interposer[1]];
      var w = 0, h = 0;
      ['interposers', 'base', 'dies', 'hbm'].forEach(function (k) { (Lt[k] || []).forEach(function (r) { w = Math.max(w, Math.abs(r.x) * 2 + r.w); h = Math.max(h, Math.abs(r.y) * 2 + r.h); }); });
      return (w && h) ? [w, h] : null;
    };
    var REF = 'nvidia-b200';
    // o: big (hatched, for a card), mid (a shelf), callouts (numbered parts, with words unless words is false), pad, ref (the
    // outline of the B200 at the same scale, beside the wafer), sel (the reader's chip, in wine)
    var planSVG = function (c, k, o) {
      o = o || {}; var Lt = c.layout, b = planBounds(Lt); if (!b) return '';
      var W = b[0] * k, Hh = b[1] * k, pad = o.pad == null ? 2 : o.pad, cw = o.callouts ? (o.words === false ? 46 : 150) : 0;
      var refW = 0, refB = null;
      if (o.ref && Lt.waferScale) { refB = planBounds((byId(REF) || {}).layout); if (refB) refW = refB[0] * k + 26; }
      var cx = pad + refW + W / 2, cy = pad + Hh / 2, TW = refW + W + pad * 2 + cw, TH = Hh + pad * 2;
      var X = function (x) { return cx + x * k; }, Y = function (y) { return cy - y * k; };
      var rect = function (r, cls) { return '<rect class="' + cls + '" x="' + r2(X(r.x - r.w / 2)) + '" y="' + r2(Y(r.y + r.h / 2)) + '" width="' + r2(r.w * k) + '" height="' + r2(r.h * k) + '"/>'; };
      var box = function (d, cls, rx) { return '<rect class="' + cls + '" x="' + r2(cx - d[0] * k / 2) + '" y="' + r2(cy - d[1] * k / 2) + '" width="' + r2(d[0] * k) + '" height="' + r2(d[1] * k) + '"' + (rx ? ' rx="' + rx + '"' : '') + '/>'; };
      var g = '', targets = [], i;
      if (Lt.waferScale) {
        var d = Lt.diameterMm || 300, s = Lt.squareMm || 215, gx = (Lt.dieGrid || [])[0] || 0, gy = (Lt.dieGrid || [])[1] || 0;
        g += '<circle class="p-wafer" cx="' + r2(cx) + '" cy="' + r2(cy) + '" r="' + r2(d / 2 * k) + '"/>' + box([s, s], 'p-die');
        for (i = 1; i < gx; i++) g += '<line class="p-grid" x1="' + r2(X(-s / 2 + s * i / gx)) + '" y1="' + r2(Y(s / 2)) + '" x2="' + r2(X(-s / 2 + s * i / gx)) + '" y2="' + r2(Y(-s / 2)) + '"/>';
        for (i = 1; i < gy; i++) g += '<line class="p-grid" x1="' + r2(X(-s / 2)) + '" y1="' + r2(Y(-s / 2 + s * i / gy)) + '" x2="' + r2(X(s / 2)) + '" y2="' + r2(Y(-s / 2 + s * i / gy)) + '"/>';
        targets.push({ n: 1, w: 'Wafer-scale die', x: X(s * 0.36), y: Y(s * 0.16) });
        if (refB) {
          var rw = refB[0] * k, rh = refB[1] * k, rx = pad, ry = cy + Hh / 2 - rh;
          g += '<rect class="p-ref" x="' + r2(rx) + '" y="' + r2(ry) + '" width="' + r2(rw) + '" height="' + r2(rh) + '" rx="1.5"/><text class="p-ref-t" x="' + r2(rx) + '" y="' + r2(ry - 9) + '">B200, for scale</text>';
        }
      } else {
        if (Lt.substrate) g += box(Lt.substrate, 'p-sub', Math.max(1.5, 1.4 * k));
        if (Lt.interposer) g += box(Lt.interposer, 'p-int');
        (Lt.interposers || []).forEach(function (r) { g += rect(r, 'p-int'); });
        (Lt.base || []).forEach(function (r) { g += rect(r, 'p-base'); });
        (Lt.dies || []).forEach(function (r) { g += rect(r, 'p-die'); });
        (Lt.hbm || []).forEach(function (r) { g += rect(r, 'p-hbm'); });
        if (o.callouts) {
          var dies = (Lt.dies || []).slice().sort(function (a, b2) { return (b2.x + b2.w / 2) - (a.x + a.w / 2) || (b2.y - a.y); });
          if (dies[0]) targets.push({ n: 1, w: (c.die || {}).count > 1 || (Lt.dies || []).length > 1 ? 'Logic dies' : 'Logic die', x: X(dies[0].x + dies[0].w * 0.12), y: Y(dies[0].y + dies[0].h * 0.28) });
          var hb = (Lt.hbm || []).slice(), hx = -1e9; hb.forEach(function (r) { hx = Math.max(hx, r.x + r.w / 2); });
          hb = hb.filter(function (r) { return r.x + r.w / 2 > hx - 0.5; }).sort(function (a, b2) { return a.y - b2.y; });
          var hpick = hb[Math.floor((hb.length - 1) / 3)] || hb[0];
          if (hpick) targets.push({ n: 2, w: 'Memory stacks', x: X(hpick.x + hpick.w * 0.2), y: Y(hpick.y) });
          if (Lt.substrate) {
            var inner = 0; if (Lt.interposer) inner = Lt.interposer[0] / 2; (Lt.interposers || []).concat(Lt.hbm || [], Lt.dies || []).forEach(function (r) { inner = Math.max(inner, r.x + r.w / 2); });
            targets.push({ n: 3, w: 'Package', x: X((inner + Lt.substrate[0] / 2) / 2), y: Y(-(Lt.substrate[1] / 2) * 0.82) });
          }
        }
      }
      var co = '';
      if (o.callouts && targets.length) {
        var lx = refW + W + pad * 2 + 22, minGap = 30, j;
        targets.sort(function (a, b2) { return a.y - b2.y; });
        var ys = targets.map(function (t) { return Math.max(12, Math.min(TH - 12, t.y)); });
        for (j = 1; j < ys.length; j++) if (ys[j] - ys[j - 1] < minGap) ys[j] = ys[j - 1] + minGap;
        var over = ys.length ? ys[ys.length - 1] - (TH - 12) : 0; if (over > 0) for (j = 0; j < ys.length; j++) ys[j] -= over;
        targets.forEach(function (t, q) {
          var ly = r2(ys[q]), ex = lx - 11, path = 'M' + r2(t.x) + ' ' + r2(t.y) + ' L' + r2(ex - 12) + ' ' + ly + ' L' + r2(ex) + ' ' + ly;
          co += '<path class="lead-halo" d="' + path + '"/><path class="lead" d="' + path + '"/><circle class="lead-dot" cx="' + r2(t.x) + '" cy="' + r2(t.y) + '" r="2.6"/>' +
            '<circle class="co-c" cx="' + r2(lx) + '" cy="' + ly + '" r="10.5"/><text class="co-n" x="' + r2(lx) + '" y="' + ly + '">' + t.n + '</text>' +
            (o.words === false ? '' : '<text class="co-t" x="' + r2(lx + 18) + '" y="' + ly + '">' + esc(t.w) + '</text>');
        });
      }
      return '<svg class="plan' + (o.big ? ' big' : o.mid ? ' mid' : '') + (o.sel ? ' sel' : '') + '" width="' + r2(TW) + '" height="' + r2(TH) + '" viewBox="0 0 ' + r2(TW) + ' ' + r2(TH) + '" role="img" aria-label="The ' + esc(c.name) + ' package, drawn from above">' + g + co + '</svg>';
    };
    var planSize = function (c) {
      var Lt = c.layout || {}, p = c.package || {};
      if (Lt.waferScale) return (Lt.squareMm ? Lt.squareMm + ' × ' + Lt.squareMm + ' mm, ' : '') + 'cut from a ' + (Lt.diameterMm || 300) + ' mm wafer';
      if (Lt.substrate) return Lt.substrate[0] + ' × ' + Lt.substrate[1] + ' mm' + (Lt.estimated ? ', estimated' : '');
      if (p.sizeMm) return String(p.sizeMm) + ' mm';
      return '';
    };
    var drawnParts = function (c) { var Lt = c.layout || {}, o = {}; if (Lt.waferScale) { o.die = 1; return o; } if ((Lt.dies || []).length) o.die = 1; if ((Lt.hbm || []).length) o.hbm = 1; if (Lt.substrate) o.pkg = 1; return o; };
    var scaleBar = function (k, max) { var steps = [5, 10, 20, 50, 100], s = steps[0]; for (var i = 0; i < steps.length; i++) if (steps[i] * k <= (max || 120)) s = steps[i]; return '<span class="scalebar"><i style="width:' + Math.round(s * k) + 'px"></i>' + s + ' mm</span>'; };
    // one scale for every card: the largest package (the Ascend 910C, 116 mm) fills the drawing's span
    var FIELD_MM = (function () { var big = 0; chips.forEach(function (c) { var Lt = c.layout; if (Lt && !Lt.waferScale) { var b = planBounds(Lt); if (b) big = Math.max(big, b[0], b[1]); } }); return big || 120; })();
    var defs = function () {
      if (document.getElementById('aic-defs')) return;
      var d = document.createElement('div');
      d.innerHTML = '<svg id="aic-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
        '<pattern id="aic-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="aic-hd" width="5" height="5"/><line class="aic-hl" x1="0" y1="0" x2="0" y2="5"/></pattern>' +
        '<pattern id="aic-hatch-s" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="aic-hd" width="3.2" height="3.2"/><line class="aic-hl aic-s" x1="0" y1="0" x2="0" y2="3.2"/></pattern>' +
        '<pattern id="aic-hatch-w" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="aic-hd" width="3.2" height="3.2"/><line class="aic-hl aic-w" x1="0" y1="0" x2="0" y2="3.2"/></pattern>' +
        '<pattern id="aic-stack" width="6" height="3.2" patternUnits="userSpaceOnUse"><rect class="aic-hbk" width="6" height="3.2"/><line class="aic-hs" x1="0" y1="0.5" x2="6" y2="0.5"/></pattern></defs></svg>';
      document.body.appendChild(d.firstChild);
    };

    /* ---- the card's pieces ---- */
    // the standfirst: when the chip was announced and first shipped, and what it is built for
    var standfirst = function (c) {
      var t = 'The ' + esc(c.name) + ' was announced in ' + esc(when(c.announced)) + (c.shipping ? ', with shipping from ' + esc(when(c.shipping)) : '') + '.';
      var tg = c.target ? String(c.target).replace(/\.$/, '') : '';
      if (tg) t += ' It is ' + (/^built for /i.test(tg) ? esc(low1(tg)) : /^mainly /i.test(tg) ? 'built mainly for ' + esc(tg.replace(/^mainly /i, '')) : 'built for ' + esc(low1(tg))) + '.'; // "Mainly inference, …" reads "built mainly for inference, …"
      return t;
    };
    // speeds are named together ("the FP8 and FP4 speeds"); the verb follows the number of things named
    var nameMeasures = function (ms) {
      var sp = ms.filter(function (m) { return m.fmt; }).map(function (m) { return m.fmt.toUpperCase(); }), other = ms.filter(function (m) { return !m.fmt; }).map(function (m) { return m.words; });
      var items = (sp.length ? ['the ' + join(sp) + ' speed' + (sp.length > 1 ? 's' : '')] : []).concat(other);
      return { text: join(items), plural: sp.length > 1 || items.length > 1 };
    };
    var who = function (cs, n) { return cs.length === n && n > 1 ? (n === 2 ? 'either chip' : 'any of these ' + WORD[n] + ' chips') : join(cs.map(function (c) { return 'the ' + esc(short(c)); })); };
    // one sentence for each group of "not supported", one for each group of "not published", so they never contradict
    var gapSentences = function (sel, ms, one) {
      var out = [], n = sel.length, noFmt = {}, noOrder = [], npBy = {}, npOrder = [];
      ms.forEach(function (m) {
        var no = sel.filter(function (c) { return nilKind(c, m) === 'no'; }), np = sel.filter(function (c) { return nilKind(c, m) === 'np'; });
        if (no.length) { var k1 = no.map(function (c) { return c.id; }).join(','); if (!noFmt[k1]) { noFmt[k1] = { cs: no, f: [] }; noOrder.push(k1); } noFmt[k1].f.push(m.fmt.toUpperCase()); }
        if (np.length) { var k2 = np.map(function (c) { return c.id; }).join(','); if (!npBy[k2]) { npBy[k2] = { cs: np, ms: [] }; npOrder.push(k2); } npBy[k2].ms.push(m); }
      });
      noOrder.forEach(function (k) { var g = noFmt[k]; out.push(join(g.f) + (g.f.length > 1 ? ' are' : ' is') + ' not supported' + (one ? '' : ' by ' + who(g.cs, n)) + '.'); });
      npOrder.forEach(function (k) { var g = npBy[k], nm = nameMeasures(g.ms); out.push(cap1(nm.text) + (nm.plural ? ' are' : ' is') + ' not published' + (one ? '' : ' for ' + who(g.cs, n)) + '.'); });
      return out;
    };
    // the published figures, in order; what is missing is said once, under them
    var figuresHTML = function (c) {
      var items = [], miss = [];
      MEAS.forEach(function (m) { var v = m.get(c); if (v == null) miss.push(m); else items.push({ m: m, v: v }); });
      var said = items.length ? gapSentences([c], miss, true) : ['No figure is published for the ' + esc(short(c)) + '.'].concat(gapSentences([c], miss.filter(function (m) { return nilKind(c, m) === 'no'; }), true));
      return { items: items, said: said.join(' '), any: items.length > 0 };
    };
    // who makes each part: a first line (the maker in bold, then what it makes) and a quieter second line
    var partsData = function (c) {
      var p = c.process || {}, m = c.memory || {}, k = c.package || {}, d = c.die || {}, Lt = c.layout || {}, out = [], np = [];
      var n = d.count, dies = n ? (n > 1 ? cap1(WORD[n] || String(n)) + ' dies' : 'One die') : '';
      var area = d.areaMm2Each != null ? nf(d.areaMm2Each) + ' mm²' + (n > 1 ? ' each' : '') : '';
      var l2 = [dies ? dies + (area ? ' of ' + area : '') : (area ? 'A die of ' + area : ''), d.transistorsB ? nf(d.transistorsB) + ' billion transistors' : ''].filter(Boolean);
      l2 = l2.length === 2 ? l2[0] + ', with ' + l2[1] : l2.length ? cap1(l2[0]) : '';
      if (!p.foundry) np.push({ t: 'the foundry' }); if (!p.node) np.push({ t: 'the process node' });
      out.push({ key: 'die', k: Lt.waferScale ? 'Logic die' : (n > 1 || (!n && (Lt.dies || []).length > 1) ? 'Logic dies' : 'Logic die'), who: p.foundry ? esc(p.foundry) : '', det: [p.node, p.country ? cname(p.country) : ''].filter(Boolean).map(esc).join(', '), l2: l2, mk: p.foundry || p.node ? markOf(c, 'process') : '' });
      // the memory line's marks: each maker's source and the memory type's, and "all" for any of them the data sources nowhere
      var sups = m.suppliers || [], st = m.stacks, smk = [], open = false;
      sups.forEach(function (x) { var f = citeOf(c, null, x); if (f) smk = smk.concat(f); else open = true; });
      if (m.type) { var tf = citeOf(c, 'memtype'); if (tf) smk = smk.concat(tf); else open = true; }
      if (!sups.length && st !== 0 && !/no HBM/i.test(m.type || '')) np.push({ t: 'the memory maker' });
      out.push({ key: 'hbm', k: 'Memory', who: sups.length ? join(sups.map(esc)) : '', det: m.type ? esc(m.type) : '', l2: st ? cap1(WORD[st] || String(st)) + ' stacks' : '', mk: smk.length || open ? marks(c, smk, null, open) : '' });
      if (!k.assembler) { if (k.type) np.push({ t: 'who assembles the package' }); else np.push({ t: 'the package type' }, { t: 'its assembler' }); } // three things named read "the memory maker, the package type and its assembler"
      out.push({ key: 'pkg', k: 'Package', who: k.assembler ? esc(k.assembler) : '', det: k.type ? esc(k.type) : '', l2: planSize(c) ? esc(cap1(planSize(c))) : '', mk: k.type || k.assembler ? markOf(c, 'package') : '' });
      return { rows: out, np: np };
    };
    var npSentence = function (np, lead) { if (!np.length) return ''; var t = join(np.map(function (x) { return x.t; })); return (lead ? lead + t : cap1(t)) + (np.length > 1 ? ' are' : ' is') + ' not published.'; };
    var partLine = function (c, r) {
      var det = r.det, l1;
      if (r.who && det && det.indexOf(r.who + ' ') === 0) l1 = '<b>' + r.who + '</b>' + det.slice(r.who.length); // "TSMC 3 nm (8 XCDs)": the node already names the foundry
      else l1 = r.who ? '<b>' + r.who + '</b>' + (det ? ', ' + (/^[A-Z][a-z]+[\s,-]/.test(det) ? det.charAt(0).toLowerCase() + det.slice(1) : det) : '') : (det ? cap1(det) : '');
      return '<span class="l1">' + (l1 ? l1 + r.mk : '<span class="nil">–</span>') + '</span>' + (r.l2 ? '<span class="l2">' + r.l2 + '</span>' : '');
    };
    var partsHTML = function (c) {
      var P = partsData(c), dp = drawnParts(c), num = { die: 1, hbm: 2, pkg: 3 };
      var li = P.rows.map(function (r) {
        var has = dp[r.key];
        return '<li><span class="no' + (has ? '' : ' none') + '" aria-hidden="true">' + (has ? num[r.key] : '') + '</span><span class="k">' + esc(r.k) + '</span><span class="v">' + partLine(c, r) + '</span></li>';
      }).join('');
      return { list: '<ol class="parts">' + li + '</ol>', said: npSentence(P.np) };
    };
    // the rows a card ends on, as the chokepoint card sets its rows
    var ABOUT = [
      { key: 'status', label: 'Availability', text: function (c) { return c.status ? esc(c.status) + (c.shipping ? '. First shipped ' + esc(when(c.shipping)) : '') + (c.shippingNote ? '. ' + esc(c.shippingNote) : '') : null; } },
      { key: 'target', label: 'Built for', text: function (c) { return c.target ? esc(c.target) : null; } },
      { key: 'c2c', label: 'Links between chips', text: function (c) { return (c.interconnect || {}).chipToChip ? esc(c.interconnect.chipToChip) : null; } },
      { key: 'scale', label: 'In one rack', text: function (c) { return (c.interconnect || {}).scaleUp ? esc(c.interconnect.scaleUp) : null; } },
      { key: 'price', label: 'Price estimate', text: function (c) { return c.priceEstimate ? esc(c.priceEstimate) : null; } },
      { key: 'bom', label: 'Cost to make', text: function (c) { return c.bomEstimate ? esc(c.bomEstimate) : null; } },
      { key: 'export', label: 'Export controls', text: function (c) { return c.exportStatus ? esc(c.exportStatus) : null; } }
    ];
    var aboutWords = { status: 'the availability', target: 'what it is built for', c2c: 'the links between chips', scale: 'the rack it fits', price: 'a price estimate', bom: 'an estimate of the cost to make it', export: 'its export-control status' };
    var endStop = function (t, mk) { t = String(t); return /[.!?]$/.test(t) ? t + mk : t + mk + '.'; };
    var aboutHTML = function (c) {
      var np = [], items = [];
      ABOUT.forEach(function (r) { var t = r.text(c); if (t == null) { np.push(aboutWords[r.key]); return; } items.push({ label: r.label, html: endStop(t, markOf(c, r.key)) }); });
      return { items: items, said: np.length ? 'No source gives ' + join(np) + '.' : '' };
    };
    var notesHTML = function (c) {
      var Sx = srcList(c), body = Sx.notes || (c.notes ? '<p>' + esc(c.notes) + '</p>' : '');
      var srcs = Sx.list.map(function (s, i) { return '<li id="aic-src-' + esc(c.id) + '-' + (i + 1) + '"><a href="' + safeUrl(s.url) + '" target="_blank" rel="noopener">' + (s.raw ? s.label : esc(s.label)) + '</a></li>'; }).join('');
      return { notes: '<div class="notes">' + body + '</div>', sources: '<ol class="srcs" id="aic-srcs-' + esc(c.id) + '" tabindex="-1" aria-label="Sources for the ' + esc(c.name) + '">' + srcs + '</ol>' };
    };
    var speedNote = function (c) { var n = (c.compute || {}).precisionNote; return n ? esc(n) : ''; };

    /* ---- the comparison: one column per chip, each headed by its name and its package at one shared scale. o.side puts each
       row's label in a column at the left, as the chokepoint card sets its rows ---- */
    var cmpHTML = function (sel, o) {
      o = o || {}; var n = sel.length, width = o.width || 900, gap = o.gap == null ? 32 : o.gap, stack = !!o.stack, side = !!o.side && !stack, lw = side ? (o.labelW || 170) + gap : 0;
      var colW = stack ? Math.min(width, 520) : (width - lw - gap * (n - 1)) / n;
      var big = 0, bigH = 0; sel.forEach(function (c) { var b = planBounds(c.layout); if (b) { big = Math.max(big, b[0], b[1]); bigH = Math.max(bigH, b[1]); } });
      var k = big ? Math.min((stack ? (Math.min(width, 520) - gap) / 2 - 8 : colW - 8) / big, o.kmax || (n === 2 ? 3 : 2.2)) : 1;
      var cols = function (fn, cls) { return '<div class="cmp-grid' + (cls ? ' ' + cls : '') + '">' + sel.map(fn).join('') + '</div>'; };
      var line = function (label, inner, cls) { return '<div class="cmp-row' + (cls ? ' ' + cls : '') + '">' + (label != null ? '<p class="cap">' + label + '</p>' : (side ? '<span></span>' : '')) + inner + '</div>'; };
      var sn = function (c) { return stack ? '<span class="sn">' + esc(short(c)) + '</span>' : ''; };
      var h = '', picH = Math.ceil(bigH * k) + 4;
      // each column opens like a shelf: the package at the shared scale, its size, the name, the maker and year, and Remove
      h += line(null, cols(function (c) {
        var svg = planSVG(c, k, { pad: 1, big: k >= 1.4, mid: k < 1.4 });
        return '<div class="cmp-head"><div class="cmp-pic" style="height:' + picH + 'px">' + (svg || '<p class="none">No drawing. The package layout is not published.</p>') + '</div>' +
          '<p class="sz">' + esc(cap1(planSize(c) || '')) + '</p><h3>' + esc(short(c)) + '</h3><p class="meta">' + esc(maker(c)) + ', ' + esc(year(c)) +
          '<button type="button" class="tbtn" data-remove="' + esc(c.id) + '">Remove<span class="sr-only"> the ' + esc(short(c)) + '</span></button></p></div>';
      }, 'cmp-heads'), 'bare');
      if (big) h += line(null, '<p class="cmp-scale">' + scaleBar(k, 100) + '</p>', 'bare');
      // figures
      var rowsF = '', dashNp = false, dashNo = false;
      MEAS.forEach(function (m) {
        var vals = sel.map(function (c) { return m.get(c); }), have = vals.filter(function (v) { return v != null; });
        if (!have.length) return;
        var max = Math.max.apply(null, have);
        rowsF += line(esc(m.label) + ', ' + esc(unitWords[m.unit]), cols(function (c, i) {
          var v = vals[i];
          if (v == null) { var kd = nilKind(c, m); if (kd === 'np') dashNp = true; else dashNo = true; return '<p class="cmp-v nil">' + sn(c) + '<span aria-label="' + (kd === 'no' ? 'Not supported' : 'Not published') + '">–</span></p>'; }
          return '<p class="cmp-v' + (have.length > 1 && v === max ? ' top' : '') + '">' + sn(c) + esc(nf(v)) + markOf(c, m.key) + '</p>';
        }));
      });
      var said = [];
      if (dashNp || dashNo) said.push('A dash marks a figure that is ' + (dashNp && dashNo ? 'not published or not supported.' : dashNp ? 'not published.' : 'not supported.'));
      said = said.concat(gapSentences(sel, MEAS, false));
      var both = n === 2 ? 'either chip' : 'any of these ' + WORD[n] + ' chips';
      // under the figures, what each chip's figures describe where its data says (the Nvidia racks); each figure carries its own source
      var bases = sel.some(function (c) { return c.basis; });
      h += '<section class="cmp-sec"><h3>Figures</h3>' + rowsF + (said.length ? line(null, '<p class="said">' + said.join(' ') + '</p>', 'bare') : '') +
        (bases ? line(null, cols(function (c) { return '<div class="cmp-src">' + basisLine(c, short(c)) + '</div>'; }), 'bare src') : '') + '</section>';
      // who makes it
      var P = sel.map(partsData), rowsP = '';
      [['die', 'Logic dies'], ['hbm', 'Memory'], ['pkg', 'Package']].forEach(function (pair, ri) {
        rowsP += line(pair[1], cols(function (c, i) { return '<p class="cmp-t">' + sn(c) + partLine(c, P[i].rows[ri]) + '</p>'; }));
      });
      // the parts no source names, one sentence for each set of chips that lacks the same parts
      var npP = [], npAt = {}; P.forEach(function (p, i) { if (!p.np.length) return; var key = npSentence(p.np, ''); if (!npAt[key]) { npAt[key] = { np: p.np, cs: [] }; npP.push(key); } npAt[key].cs.push(sel[i]); });
      npP = npP.map(function (key) { var g = npAt[key]; return npSentence(g.np, 'For ' + join(g.cs.map(function (c) { return 'the ' + esc(short(c)); })) + ', '); });
      h += '<section class="cmp-sec"><h3>Who makes it</h3>' + rowsP + (npP.length ? line(null, '<p class="said">' + npP.join(' ') + '</p>', 'bare') : '') + '</section>';
      // about
      var rowsA = '', npA = [];
      ABOUT.forEach(function (r) {
        var ts = sel.map(function (c) { return r.text(c); });
        if (ts.every(function (t) { return t == null; })) { npA.push(aboutWords[r.key]); return; }
        rowsA += line(esc(r.label), cols(function (c, i) { var t = ts[i]; return '<p class="cmp-t' + (t == null ? ' nil' : '') + '">' + sn(c) + (t == null ? '–' : endStop(t, markOf(c, r.key))) + '</p>'; }));
      });
      h += '<section class="cmp-sec"><h3>About ' + (n === 2 ? 'both' : 'all ' + WORD[n]) + '</h3>' + rowsA + (npA.length ? line(null, '<p class="said">No source gives ' + join(npA) + ' for ' + both + '.</p>', 'bare') : '') + '</section>';
      return '<div class="cmp' + (stack ? ' stack' : '') + (side ? ' side' : '') + '" style="--n:' + (stack ? 1 : n) + ';--lw:' + (side ? (o.labelW || 170) + 'px' : '0px') + ';--gap:' + gap + 'px">' + h + '</div>';
    };

    /* ---- the field chart: every chip by the month it was announced, against one figure ---- */
    var T0 = 2020 * 12, T1 = 2027 * 12;
    var niceStep = function (max, n) { var raw = max / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };
    var measureCtx = null, LAB = 12.5; // the labels' size, as chips.css sets them
    var textW = function (t, bold) { if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d'); measureCtx.font = (bold ? '600 ' : '400 ') + LAB + 'px "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif'; return measureCtx.measureText(t).width; };
    var fieldOf = function (mkey) {
      var m = meas[mkey], pts = [], none = [];
      chips.forEach(function (c) { var v = m.get(c), t = tOf(c); if (v == null || t == null) none.push(c); else pts.push({ c: c, v: v, t: t }); });
      var vs = pts.map(function (p) { return p.v; }).sort(function (a, b) { return b - a; }), off = [];
      while (vs.length > 2 && vs[0] > 4 * vs[1]) { off.push(vs.shift()); } // a value four times the next sits above the scale, on an arrow
      var max = pts.length ? Math.max.apply(null, pts.map(function (p) { return p.v; })) : 0;
      var top = pts.filter(function (p) { return p.v === max; });
      return { m: m, pts: pts, none: none, off: off, max: max, top: top, inMax: vs.length ? vs[0] : max };
    };
    // o: measure, w, h, sel (ids), small. Labeled: the reader's chips and the largest
    var chartSVG = function (o) {
      var F = fieldOf(o.measure), m = F.m, w = o.w, h = o.h, small = !!o.small;
      var step = niceStep(F.inMax || 1, small ? 3 : 5), ymax = Math.ceil((F.inMax || 1) / step) * step;
      // the left margin fits the widest figure on the axis, so "30,000" keeps its first digit
      var Lp = Math.max(small ? 38 : 50, Math.ceil(textW(nfAxis(ymax))) + 12), Rp = small ? 10 : 16, Tp = F.off.length ? 40 : 26, Bp = 30;
      var pw = w - Lp - Rp, ph = h - Tp - Bp;
      var X = function (t) { return Lp + (t - T0) / (T1 - T0) * pw; }, Y = function (v) { return Tp + ph - v / ymax * ph; };
      var sel = o.sel || [], g = '';
      for (var v = 0; v <= ymax + 1e-9; v += step) g += '<line class="' + (v === 0 ? 'base' : 'grid') + '" x1="' + Lp + '" x2="' + (Lp + pw) + '" y1="' + r2(Y(v)) + '" y2="' + r2(Y(v)) + '"/><text class="tick" x="' + (Lp - 8) + '" y="' + r2(Y(v) + 4) + '" text-anchor="end">' + nfAxis(v) + '</text>';
      for (var yr = 2020; yr <= 2026; yr++) { var xt = X(yr * 12); g += '<line class="grid" x1="' + r2(xt) + '" x2="' + r2(xt) + '" y1="' + r2(Tp + ph) + '" y2="' + r2(Tp + ph + 5) + '"/><text class="tick" x="' + r2(xt + 4) + '" y="' + r2(Tp + ph + 20) + '">' + (small && yr % 2 ? '' : yr) + '</text>'; }
      g += '<text class="unit" x="0" y="' + (Tp - 12) + '">' + esc(m.unit) + '</text>';
      var pts = F.pts.map(function (p) {
        var isOff = F.off.indexOf(p.v) >= 0, x = X(p.t), y = isOff ? Tp - 16 : Y(p.v);
        return { c: p.c, v: p.v, x: x, y: y, off: isOff, top: p.v === F.max, mine: sel.indexOf(p.c.id) >= 0 };
      });
      var r = small ? 3.4 : 4.3, dots = '', rings = '';
      pts.forEach(function (p) {
        if (p.off) dots += '<path class="off' + (p.top ? ' top' : '') + '" d="M' + r2(p.x - 5) + ' ' + r2(p.y + 4) + ' L' + r2(p.x) + ' ' + r2(p.y - 5) + ' L' + r2(p.x + 5) + ' ' + r2(p.y + 4) + 'Z"/>';
        else dots += '<circle class="dot' + (p.top ? ' top' : '') + (p.mine ? ' mine' : '') + '" cx="' + r2(p.x) + '" cy="' + r2(p.y) + '" r="' + (p.top || p.mine ? r + 0.6 : r) + '"/>';
        if (p.mine) rings += '<circle class="ring" cx="' + r2(p.x) + '" cy="' + r2(p.y) + '" r="' + (r + 5) + '"/>';
      });
      // labels: the reader's chips first, then the largest; a label sits nearer its own dot than any other, clear of every box.
      // Where dots crowd and no place is clear, it takes the place inside the plot, clear of the axes and the other labels, that
      // covers the fewest dots (its halo keeps it legible), so it never falls on the years or the figures of the axis
      var boxes = [], labs = '', base = Tp + ph - 3, nDots = pts.length;
      pts.forEach(function (p) { boxes.push([p.x - r - 2, p.y - r - 2, p.x + r + 2, p.y + r + 2]); });
      var over = function (b, q) { return b[0] < q[2] && b[2] > q[0] && b[1] < q[3] && b[3] > q[1]; };
      var outside = function (b) { return b[0] < Lp || b[2] > w - 2 || b[1] < 2 || b[3] > base; };
      boxes.push([0, Tp - 12 - LAB, textW(m.unit) + 4, Tp - 12 + 3]); nDots++; // the unit over the axis
      var hit = function (b) { if (outside(b)) return true; for (var j = 0; j < boxes.length; j++) if (over(b, boxes[j])) return true; return false; };
      var covers = function (b) { for (var j = nDots; j < boxes.length; j++) if (over(b, boxes[j])) return -1; var k = 0; for (j = 0; j < nDots; j++) if (over(b, boxes[j])) k++; return k; };
      var dist = function (b, x, y) { var dx = Math.max(b[0] - x, 0, x - b[2]), dy = Math.max(b[1] - y, 0, y - b[3]); return Math.sqrt(dx * dx + dy * dy); };
      var clear = function (b, p) { var d0 = dist(b, p.x, p.y); for (var j = 0; j < pts.length; j++) { var q = pts[j]; if (q !== p && dist(b, q.x, q.y) < d0 + 5) return false; } return true; };
      pts.slice().sort(function (a, b) { return (b.mine - a.mine) || (b.top - a.top) || (b.v - a.v); }).forEach(function (p) {
        if (!p.mine && !p.top) return;
        var txt = short(p.c) + ', ' + nf(p.v), tw = textW(txt, true), rr = r + (p.mine ? 6 : 4), th = LAB;
        var cand = p.off ? [[p.x + 9, p.y + 4, 'start'], [p.x - 9, p.y + 4, 'end']] :
          [[p.x + rr, p.y + 4, 'start'], [p.x - rr, p.y + 4, 'end'], [p.x, p.y - rr - 2, 'middle'], [p.x, p.y + rr + th, 'middle'], [p.x + rr - 2, p.y - rr, 'start'], [p.x - rr + 2, p.y - rr, 'end'], [p.x + rr - 2, p.y + rr + th - 2, 'start'], [p.x - rr + 2, p.y + rr + th - 2, 'end']];
        var place = function (q) { var cx = cand[q][0], cy = cand[q][1], an = cand[q][2], x0 = an === 'start' ? cx : an === 'end' ? cx - tw : cx - tw / 2; return { cx: cx, cy: cy, an: an, bb: [x0 - 2, cy - th + 2, x0 + tw + 2, cy + 3] }; };
        var got = null, q, best = 1e9;
        for (q = 0; q < cand.length && !got; q++) { var c1 = place(q); if (!hit(c1.bb) && clear(c1.bb, p)) got = c1; }
        // farther off, a line at a time: each line away costs as much as a dot covered, so a label stays as near its dot as it can
        if (!got && !p.off) for (var s = 1; s <= 3; s++) { var dy = (th + 3) * s; cand.push([p.x, p.y - rr - 2 - dy, 'middle', s], [p.x + rr - 2, p.y - rr - dy, 'start', s], [p.x - rr + 2, p.y - rr - dy, 'end', s], [p.x, p.y + rr + th + dy, 'middle', s]); }
        if (!got) for (q = 0; q < cand.length; q++) { var c2 = place(q), k = outside(c2.bb) ? -1 : covers(c2.bb); if (k >= 0 && k + (cand[q][3] || 0) < best) { best = k + (cand[q][3] || 0); got = c2; } }
        if (!got) got = place(cand.length > 2 ? 2 : 0); // above its dot (an arrow above the scale: beside it)
        boxes.push(got.bb);
        labs += '<text class="lab lab-h' + (p.mine ? ' mine' : ' top') + '" x="' + r2(got.cx) + '" y="' + r2(got.cy) + '" text-anchor="' + got.an + '">' + esc(txt) + '</text>';
      });
      var aria = esc(m.label) + ' of each chip by the month it was announced. ' + F.pts.length + ' chips have a figure. The arrow keys move from chip to chip.';
      return { svg: '<svg class="chart" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" tabindex="0" role="group" aria-roledescription="chart" aria-label="' + aria + '">' + g + dots + rings + labs + '<g class="lit"></g><g class="hov"></g><g class="foc"></g><rect class="hit" x="0" y="0" width="' + w + '" height="' + h + '" fill="transparent"/></svg>', pts: pts, F: F };
    };
    // hover shows a chip's name; a click, a tap or the arrow keys pin a tip with its figure, its month and "Open the B300", which
    // opens that chip on its own. Nothing on the chart adds a chip to a comparison. On the head's chart (o.link) a click or a tap
    // on a dot goes to that chip's package on its shelf instead (quick win B, 29 Oct 2026, below); the keys still pin the tip
    var tipClose = null; // the open tip's closer: a press anywhere else puts it away (one listener for every chart, set in init)
    var interactChart = function (host, res, o) {
      o = o || {};
      var svg = $('svg.chart', host); if (!svg) return; var hov = $('.hov', svg), foc = $('.foc', svg), m = res.F.m, W = +svg.getAttribute('width'), Hh = +svg.getAttribute('height');
      var pts = res.pts.slice().sort(function (a, b) { return a.x - b.x || a.y - b.y; }), cur = -1;
      host.style.position = 'relative';
      var tip = document.createElement('div'); tip.className = 'ctip'; tip.hidden = true; tip.setAttribute('role', 'status'); host.appendChild(tip);
      var label = function (p, gEl) {
        if (!p) { gEl.innerHTML = ''; return; }
        var txt = short(p.c), tw = textW(txt, true), right = p.x + 12 + tw < W - 4, x = right ? p.x + 12 : p.x - 12;
        gEl.innerHTML = (p.off ? '' : '<circle cx="' + r2(p.x) + '" cy="' + r2(p.y) + '" r="5"/>') + '<text class="lab lab-h" x="' + r2(x) + '" y="' + r2(Math.max(14, p.y - 9)) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + esc(txt) + '</text>';
      };
      var pin = function (i) {
        cur = i; var p = pts[i];
        if (!p) { tip.hidden = true; foc.innerHTML = ''; if (tipClose === close) tipClose = null; return; }
        hov.innerHTML = '';
        foc.innerHTML = '<circle class="kf" cx="' + r2(p.x) + '" cy="' + r2(p.y) + '" r="9"/>';
        var here = o.here && o.here.length === 1 && o.here[0] === p.c.id;
        tip.innerHTML = '<p class="ct-n">' + esc(short(p.c)) + '<span>' + esc(maker(p.c)) + '</span></p><p class="ct-v">' + esc(nf(p.v)) + ' ' + esc(m.unit) + ', announced ' + esc(when(p.c.announced)) + '</p>' +
          (here ? '' : '<a class="tbtn" href="#/landscape?pick=' + esc(p.c.id) + '" data-open="' + esc(p.c.id) + '">Open the ' + esc(short(p.c)) + '</a>');
        tip.hidden = false;
        var tw = tip.offsetWidth, th = tip.offsetHeight, left = p.x + 16, top = p.y - th / 2;
        if (left + tw > W) left = p.x - 16 - tw;
        tip.style.left = Math.round(Math.max(0, left)) + 'px'; tip.style.top = Math.round(Math.max(0, Math.min(top, Hh - th))) + 'px';
        tipClose = close;
      };
      var close = function (e) { if (e && host.contains(e.target)) return; pin(-1); };
      var nearest = function (e, rad) { var b = svg.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, best = -1, bd = rad * rad; pts.forEach(function (p, i) { var d = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y); if (d < bd) { bd = d; best = i; } }); return best; };
      svg.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var i = nearest(e, 18); label(i >= 0 && i !== cur ? pts[i] : null, hov); });
      svg.addEventListener('pointerleave', function () { label(null, hov); });
      svg.addEventListener('click', function (e) { var i = nearest(e, e.pointerType === 'mouse' ? 18 : 30); if (i < 0) i = nearest(e, 30); if (o.link && i >= 0) { pin(-1); o.link(pts[i].c.id); return; } pin(i); });
      if (o.link) svg.addEventListener('mousedown', function (e) { e.preventDefault(); }); // a press goes to the package, so it must not focus the chart, whose focus opens the tip
      svg.addEventListener('keydown', function (e) {
        var k = e.key, n = pts.length; if (!n) return;
        if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); pin(cur < 0 ? 0 : Math.min(n - 1, cur + 1)); }
        else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); pin(cur < 0 ? n - 1 : Math.max(0, cur - 1)); }
        else if (k === 'Home') { e.preventDefault(); pin(0); } else if (k === 'End') { e.preventDefault(); pin(n - 1); }
        else if (k === 'Enter') { var a = $('a', tip); if (a && !tip.hidden) { e.preventDefault(); a.click(); } }
        else if (k === 'Escape') { pin(-1); }
      });
      svg.addEventListener('focus', function () { if (cur >= 0) return; var start = -1; pts.forEach(function (p, i) { if (start < 0 && p.mine) start = i; }); if (start < 0) pts.forEach(function (p, i) { if (start < 0 && p.top) start = i; }); pin(Math.max(0, start)); });
      host.addEventListener('focusout', function () { setTimeout(function () { if (!host.contains(document.activeElement)) pin(-1); }, 0); });
    };
    var chartFinding = function (mkey) {
      var F = fieldOf(mkey), m = F.m; if (!F.top.length) return '';
      var t = F.top[0].c, tops = F.top.map(function (p) { return 'the ' + esc(short(p.c)); });
      return cap1(join(tops)) + (F.top.length > 1 ? ' share' : ' has') + ' the highest published ' + esc(low1(m.label)) + ', ' + esc(nf(F.max)) + ' ' + esc(unitWords[m.unit]) + (F.top.length > 1 ? '.' : '. It was announced in ' + esc(when(t.announced)) + '.');
    };
    // any value set above the scale. The chips with no figure are left off without a word (owner, 28 Oct 2026: the list of
    // them ran to six lines); each chip's own record says whether its figure is unpublished or its format unsupported
    var chartSaid = function (mkey) {
      var F = fieldOf(mkey), s = [];
      var offs = F.pts.filter(function (p) { return F.off.indexOf(p.v) >= 0; });
      if (offs.length) s.push(cap1(join(offs.map(function (p) { return 'the ' + esc(short(p.c)) + ', at ' + nf(p.v); }))) + ', ' + (offs.length > 1 ? 'sit' : 'sits') + ' above the top of the scale, marked by ' + (offs.length > 1 ? 'arrows' : 'an arrow') + '.');
      return s;
    };
    // for the chips in a card that the chart cannot show
    var chartMissing = function (sel, mkey) {
      var m = meas[mkey], no = sel.filter(function (c) { return nilKind(c, m) === 'no'; }), np = sel.filter(function (c) { return nilKind(c, m) === 'np'; }), s = [];
      var list = function (cs) { return join(cs.map(function (c) { return 'the ' + esc(short(c)); })); };
      if (np.length) s.push(esc(m.label) + ' is not published for ' + list(np) + '.');
      if (no.length) s.push(m.fmt.toUpperCase() + ' is not supported by ' + list(no) + '.');
      return s.join(' ');
    };
    var measureSelect = function (cur, id) {
      return '<select class="mselect" id="' + id + '" aria-label="The figure the chart shows">' + MEAS.map(function (m) { return '<option value="' + m.key + '"' + (m.key === cur ? ' selected' : '') + '>' + esc(m.label) + '</option>'; }).join('') + '</select>';
    };
    var firstMeasure = function (sel) { for (var i = 0; i < MEAS.length; i++) { var m = MEAS[i]; if (!sel.length || sel.some(function (c) { return m.get(c) != null; })) return m.key; } return 'fp16'; };

    /* ---- makers, in the site's order (countries as they first appear, China last), each maker's chips oldest first ---- */
    var ordered = function () {
      var ccs = [], by = {}, out = [];
      chips.forEach(function (c) { var cc = c.vendorCountry || '??'; if (!by[cc]) { by[cc] = { vs: [], v: {} }; ccs.push(cc); } if (!by[cc].v[c.vendor]) { by[cc].v[c.vendor] = []; by[cc].vs.push(c.vendor); } by[cc].v[c.vendor].push(c); });
      ccs.sort(function (a, b) { return (a === 'CN') - (b === 'CN'); });
      ccs.forEach(function (cc) { by[cc].vs.forEach(function (v) { out.push({ cc: cc, vendor: v, chips: by[cc].v[v].slice().sort(function (a, b) { return (tOf(a) || 0) - (tOf(b) || 0); }) }); }); });
      return out;
    };

    /* ---- the selection and the address: #/landscape?pick=a,b&measure=mem ---- */
    var S = { picked: [], measure: '' };
    var selection = function () { return S.picked.map(byId).filter(Boolean); };
    // keep: Back or Forward within AI Chips. The chart's figure is the reader's setting, not part of a step back, so an earlier
    // entry that names none keeps the figure chosen since, and its address is written with it (28 Oct 2026: Back from four
    // chips on Memory went back to FP16)
    var readAddress = function (keep) {
      var q = /[?&]pick=([^&#]+)/.exec(location.hash), ids = q ? dec(q[1]).split(',').filter(byId) : [];
      S.picked = ids.filter(function (id, i) { return ids.indexOf(id) === i; }).slice(0, 4);
      var m = /[?&]measure=(fp16|fp8|fp4|mem|bw|tdp)\b/.exec(location.hash), was = S.measure; S.measure = m ? m[1] : keep ? was : '';
      if (!m && keep && was) writeAddress(false);
    };
    var route = function () { var q = []; if (S.picked.length) q.push('pick=' + S.picked.join(',')); if (S.measure) q.push('measure=' + S.measure); return '#/landscape' + (q.length ? '?' + q.join('&') : ''); };
    // a choice of chips is a history entry, so Back returns to the one before; a change of the chart's figure is written in place
    var writeAddress = function (push) {
      if (Router.current !== 'landscape') return;
      var url = location.pathname + location.search + route();
      if (url === location.pathname + location.search + location.hash) return;
      try { history[push ? 'pushState' : 'replaceState'](push ? null : history.state, '', url); } catch (e) { }
    };
    var said = function (msg) { var el = $('#aic-live'); if (el) { el.textContent = ''; setTimeout(function () { el.textContent = msg; }, 40); } };
    var setPicked = function (ids, how) { how = how || {}; S.picked = ids.filter(byId).filter(function (id, i, a) { return a.indexOf(id) === i; }).slice(0, 4); writeAddress(how.push !== false); render(how); };
    var add = function (id) {
      if (S.picked.indexOf(id) >= 0 || !byId(id)) return;
      if (S.picked.length >= 4) { said('The comparison holds four chips, so the ' + short(byId(id)) + ' was not added.'); return; }
      setPicked(S.picked.concat(id), { added: id }); said(short(byId(id)) + ' added.');
    };
    var remove = function (id) { setPicked(S.picked.filter(function (x) { return x !== id; }), { removed: id }); var c = byId(id); if (c) said(short(c) + ' removed.'); };
    var setMeasure = function (k) { S.measure = k; writeAddress(false); render({ measure: true }); };

    /* ---- the chip picker: a list by maker with a filter, opened only by a control that says what it does. A bottom sheet on a
       phone ---- */
    var P = { el: null, scrim: null, opts: [], active: null, cur: null };
    var buildPicker = function () {
      var root = $('#aic'), el = document.createElement('div'), scrim = document.createElement('div');
      el.className = 'cxp'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-labelledby', 'aic-cxp-t'); el.hidden = true;
      el.innerHTML = '<div class="cxp-head"><p class="cxp-t" id="aic-cxp-t">Compare with</p><button type="button" class="cxp-x">Close</button></div>' +
        '<input class="cxp-in" type="text" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="aic-cxp-list" aria-labelledby="aic-cxp-t" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Find a chip or maker">' +
        '<p class="cxp-sug" hidden></p>' +
        '<div class="cxp-list" id="aic-cxp-list" role="listbox" aria-labelledby="aic-cxp-t">' + ordered().map(function (g) {
          return '<div class="cxp-g" role="group" aria-label="' + esc(maker({ vendor: g.vendor })) + '"><div class="cxp-gh" role="presentation">' + esc(maker({ vendor: g.vendor })) + '</div>' + g.chips.map(function (c) {
            return '<div class="cxp-o" role="option" id="aic-cxp-o-' + esc(c.id) + '" data-id="' + esc(c.id) + '" aria-selected="false"><span class="n">' + esc(short(c)) + '</span><span class="y">' + esc(year(c)) + '</span><span class="s"></span></div>';
          }).join('') + '</div>';
        }).join('') + '</div><p class="cxp-none" hidden>No chip matches.</p>';
      scrim.className = 'cxp-scrim'; scrim.hidden = true;
      root.appendChild(scrim); root.appendChild(el);
      P.el = el; P.scrim = scrim; P.input = $('.cxp-in', el); P.list = $('.cxp-list', el);
      P.opts = $$('.cxp-o', el).map(function (o) { var c = byId(o.getAttribute('data-id')); return { el: o, id: c.id, text: [c.name, c.vendor, c.family || '', year(c)].join(' ').toLowerCase() }; });
      P.input.addEventListener('input', filter);
      P.input.addEventListener('keydown', function (e) {
        var list = navOpts(), i = list.indexOf(P.active), k = e.key;
        if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); if (!list.length) return; setActive(list[k === 'ArrowDown' ? (i < 0 ? 0 : (i + 1) % list.length) : (i < 0 ? list.length - 1 : (i - 1 + list.length) % list.length)]); }
        else if (k === 'Enter' && P.active) { e.preventDefault(); choose(P.active.getAttribute('data-id')); }
      });
      el.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); closePicker(true); } });
      P.list.addEventListener('click', function (e) { var o = e.target.closest('.cxp-o'); if (o && o.getAttribute('aria-disabled') !== 'true') choose(o.getAttribute('data-id')); });
      $('.cxp-sug', el).addEventListener('click', function (e) { var b = e.target.closest('button[data-id]'); if (b) choose(b.getAttribute('data-id')); });
      $('.cxp-x', el).addEventListener('click', function () { closePicker(true); });
      scrim.addEventListener('click', function () { closePicker(true); });
      document.addEventListener('pointerdown', function (e) { if (P.cur && !el.contains(e.target) && !P.cur.trigger.contains(e.target)) closePicker(false); }, true);
    };
    var navOpts = function () { return P.opts.filter(function (o) { return !o.el.hidden && o.el.getAttribute('aria-disabled') !== 'true'; }).map(function (o) { return o.el; }); };
    var setActive = function (o) {
      if (P.active) { P.active.classList.remove('is-active'); P.active.setAttribute('aria-selected', 'false'); }
      P.active = o || null; if (!o) { P.input.removeAttribute('aria-activedescendant'); return; }
      o.classList.add('is-active'); o.setAttribute('aria-selected', 'true'); P.input.setAttribute('aria-activedescendant', o.id);
      var l = P.list, t = o.offsetTop, b = t + o.offsetHeight; if (t - 30 < l.scrollTop) l.scrollTop = Math.max(0, t - 30); else if (b > l.scrollTop + l.clientHeight) l.scrollTop = b - l.clientHeight;
    };
    var filter = function () {
      var q = P.input.value.trim().toLowerCase(), toks = q ? q.split(/\s+/) : [], any = false;
      P.opts.forEach(function (o) { var ok = toks.every(function (t) { return o.text.indexOf(t) >= 0; }); o.el.hidden = !ok; if (ok) any = true; });
      $$('.cxp-g', P.el).forEach(function (g) { g.hidden = !$$('.cxp-o', g).some(function (o) { return !o.hidden; }); });
      $('.cxp-none', P.el).hidden = any; $('.cxp-sug', P.el).hidden = !!q || !P.sug;
      setActive(q ? navOpts()[0] || null : null);
    };
    var openPicker = function (trigger, title) {
      if (!P.el) buildPicker(); if (P.cur) closePicker(false);
      P.cur = { trigger: trigger };
      $('#aic-cxp-t', P.el).textContent = title || 'Compare with';
      P.opts.forEach(function (o) { var at = S.picked.indexOf(o.id) >= 0; if (at) o.el.setAttribute('aria-disabled', 'true'); else o.el.removeAttribute('aria-disabled'); $('.s', o.el).textContent = at ? 'Chosen' : ''; });
      var first = S.picked[0], sug = (CMP.with[first] || []).filter(function (id) { return byId(id) && S.picked.indexOf(id) < 0; }).slice(0, 3);
      P.sug = sug.length > 0;
      $('.cxp-sug', P.el).innerHTML = sug.length ? '<span class="sug-k">Often set beside the ' + esc(short(byId(first))) + '</span>' + sug.map(function (id) { return '<button type="button" data-id="' + esc(id) + '">' + esc(short(byId(id))) + '</button>'; }).join('') : '';
      P.input.value = ''; filter(); P.list.scrollTop = 0;
      P.el.hidden = false; P.scrim.hidden = !nar();
      if (!nar()) { // under its control, or above it when the screen has no room below; placed within #aic
        var r = trigger.getBoundingClientRect(), base = $('#aic').getBoundingClientRect(), w = Math.min(380, window.innerWidth - 32);
        var left = r.left + w > window.innerWidth - 16 ? Math.max(16, r.right - w) : r.left;
        P.el.style.width = w + 'px'; P.el.style.left = Math.round(left - base.left) + 'px'; P.el.style.top = Math.round(r.bottom - base.top + 8) + 'px'; P.el.style.maxHeight = '';
        var hgt = P.el.offsetHeight, below = window.innerHeight - r.bottom - 24;
        if (r.bottom + hgt + 16 > window.innerHeight && r.top - hgt - 8 > headerH() + 6) P.el.style.top = Math.round(r.top - base.top - hgt - 8) + 'px';
        else if (hgt > below && below >= 320) P.el.style.maxHeight = Math.round(below) + 'px'; // the list scrolls inside the room under its control
      }
      trigger.setAttribute('aria-expanded', 'true');
      P.input.focus({ preventScroll: true });
    };
    var closePicker = function (back) { var c = P.cur; if (!c) return; P.cur = null; P.el.hidden = true; P.scrim.hidden = true; setActive(null); c.trigger.setAttribute('aria-expanded', 'false'); if (back && document.contains(c.trigger)) c.trigger.focus({ preventScroll: true }); };
    var choose = function (id) { if (!P.cur) return; closePicker(false); add(id); };

    /* ---- the page: the head with the field chart, the shelves, and the card under the chosen chip's shelf ---- */
    var DEK = '';
    var mPx = function () { var v = $('.view[data-view="landscape"]'); return v ? parseFloat(getComputedStyle(v).paddingLeft) || 16 : 16; };
    var innerW = function () { return document.documentElement.clientWidth - 2 * mPx(); };
    // the shelf scale: about 1.4 times round six's, so the packages read as drawings. The wafer, three times the size of any
    // package, is drawn on its own smaller scale with its own scale bar, so it never rises out of its row
    var shelfK = function () { var w = window.innerWidth; return w <= 760 ? 0.62 : w <= 1180 ? 0.95 : 1.15; };
    var WAFER = 0.4;
    var chartW = function () { var f = $('#aic .hfig'); return Math.round(Math.min(f && f.clientWidth ? f.clientWidth : innerW(), nar() ? 9999 : 600)); }; // the head's column, 600 px at most beside the title
    var keyHTML = function (k) {
      return '<p class="key"><span class="ki"><span class="sw die" aria-hidden="true"></span>Logic die</span><span class="ki"><span class="sw hbm" aria-hidden="true"></span>Memory stack</span><span class="ki"><span class="sw int" aria-hidden="true"></span>Package</span><span class="ki key-b">' + scaleBar(k, 90) + '</span></p>';
    };
    var headHTML = function () {
      var mk = S.measure || 'fp16', cap = chartSaid(mk);
      return '<header class="head"><div class="head-grid"><div class="head-l"><p class="vt" role="heading" aria-level="1">AI Chips</p><p class="dek">' + DEK + '</p><p class="finding">' + chartFinding(mk) + '</p>' + keyHTML(shelfK()) + '</div>' +
        '<figure class="hfig"><p class="fig-h">' + measureSelect(mk, 'aic-m-head') + ' <span>of each chip, by the month it was announced</span></p><div class="chart-host" id="aic-c-head"></div>' +
        (cap.length ? '<figcaption class="fcap">' + cap.join(' ') + '</figcaption>' : '') + '</figure></div></header>';
    };
    var itemK = function (c, k) { return (c.layout || {}).waferScale ? k * WAFER : k; };
    var itemHTML = function (c, k, h) {
      var on = S.picked.indexOf(c.id) >= 0, kk = itemK(c, k), wafer = (c.layout || {}).waferScale, svg = planSVG(c, kk, { pad: 1, mid: true, sel: on });
      var open = S.picked.length === 1 && on;
      return '<li class="it' + (on ? ' on' : '') + '"><button type="button" class="it-b" id="aic-it-' + esc(c.id) + '" data-open="' + esc(c.id) + '" aria-expanded="' + (open ? 'true' : 'false') + '"' + (on ? ' aria-current="true"' : '') + '>' +
        '<span class="pic" style="height:' + h + 'px">' + (svg || '<span class="nodraw"></span>') + '</span><span class="nm">' + esc(short(c)) + '</span><span class="yr">' + esc(year(c)) + '</span></button>' +
        (wafer ? '<p class="own-scale">A whole wafer, drawn smaller than the rest. ' + scaleBar(kk, 60) + '</p>' : '') + '</li>';
    };
    var shelvesHTML = function () {
      var k = shelfK(), sel = selection(), cardMaker = sel.length ? sel[0].vendor : null;
      return '<section class="shelves" aria-label="The chips, by maker"><ol class="shelf-list">' + ordered().map(function (g) {
        var h = 0; g.chips.forEach(function (c) { var b = planBounds(c.layout); if (b) h = Math.max(h, b[1] * itemK(c, k)); });
        h = Math.ceil(Math.max(h, 28)) + 2;
        var li = '<li class="shelf" id="aic-sh-' + esc(slugV(g.vendor)) + '"><div class="sh-mk"><h2>' + esc(maker({ vendor: g.vendor })) + '</h2></div><ul class="sh-row">' +
          g.chips.map(function (c) { return itemHTML(c, k, h); }).join('') + '</ul></li>';
        if (g.vendor === cardMaker) li += '<li class="card-li">' + cardHTML(sel) + '</li>';
        return li;
      }).join('') + '</ol><p class="sh-foot note-s">The TPU 8t and the Ascend 950DT have no drawing, because their package layouts are not published.</p></section>';
    };
    var cardK = function (c) {
      var w = Math.min(innerW() - (nar() ? 32 : 64), 1312), na = nar();
      var span = na ? w - 52 : Math.min(w * 0.55, 700) - 160, k = Math.max(1.5, span / FIELD_MM), Lt = c.layout || {};
      if (Lt.waferScale) { var b = planBounds(Lt); k = Math.min(k, (na ? w - 52 : 520) / (b[0] + 95 + 26)); }
      return k;
    };
    var cardHTML = function (sel) {
      if (!sel.length) return '';
      var n = sel.length, c = sel[0], sh = esc(short(c)), mk = S.measure || firstMeasure(sel);
      var standInner = function () {
        var miss = chartMissing(sel, mk);
        return '<p class="fig-h">' + measureSelect(mk, 'aic-m-card') + ' <span>of each chip, by the month it was announced</span></p><div class="chart-host" id="aic-c-card"></div>' +
          (miss ? '<p class="note-s">' + miss + '</p>' : '') + '<p class="note-s">' + chartFinding(mk) + '</p>';
      };
      var close = '<button type="button" class="tbtn" data-home>Close</button>';
      if (n === 1) {
        var k = cardK(c), Lt = c.layout, F = figuresHTML(c), Pp = partsHTML(c), AB = aboutHTML(c), N = notesHTML(c), sn = speedNote(c);
        var svg = planSVG(c, k, { big: true, callouts: true, ref: true, words: !nar() });
        var size = planSize(c), cap = svg ? (Lt.waferScale ? 'The WSE-3 Turbo is a whole wafer, so it is drawn at a smaller scale than the other chips, beside a B200 package at the same scale. ' : '') + (size ? esc(cap1(size)) + '.' : '') : '';
        var stats = F.items.map(function (it) { return '<div class="st"><dt>' + STAT[it.m.key] + markOf(c, it.m.key) + '</dt><dd>' + esc(nf(it.v)) + '</dd></div>'; }).join('');
        var row = function (label, html, cls) { return '<div class="cr' + (cls ? ' ' + cls : '') + '"><dt>' + label + '</dt><dd>' + html + '</dd></div>'; };
        var rows = row('Who makes it', Pp.list + (Pp.said ? '<p class="said">' + Pp.said + '</p>' : ''), 'parts-r') +
          row('Where it stands', standInner(), 'stand-r') +
          AB.items.map(function (it) { return row(esc(it.label), it.html); }).join('') +
          (sn ? row('How the speed is counted', '<p class="note-s">' + sn + '</p>' + (F.any ? '<p class="note-s">' + esc(L.TFLOPS_SENTENCE) + '</p>' : '')) : '') +
          row('Notes', N.notes) + row('Sources', N.sources + (AB.said ? '<p class="said">' + AB.said + '</p>' : ''));
        return '<section class="card" aria-labelledby="aic-card-h" id="aic-card"><div class="card-top"><p class="card-m">' + esc(maker(c)) + (c.family ? ', ' + esc(c.family) : '') + '</p>' + close + '</div>' +
          '<div class="card-intro"><div class="ci-text"><h2 id="aic-card-h" tabindex="-1">' + sh + '</h2><p class="dek">' + standfirst(c) + '</p><button type="button" class="tact" data-compare data-title="Compare the ' + sh + ' with" aria-haspopup="dialog" aria-expanded="false">Compare with another chip</button></div>' +
          '<figure class="ci-pic">' + (svg ? svg + '<figcaption>' + scaleBar(k, 120) + (cap ? '<span class="cap-t">' + cap + '</span>' : '') + '</figcaption>' : '<p class="nopic">No drawing. ' + esc(maker(c)) + ' has not published the layout of the ' + sh + ' package.</p>') + '</figure></div>' +
          '<div class="card-stats">' + (stats ? '<dl class="stats">' + stats + '</dl>' : '') + (F.said ? '<p class="said">' + F.said + '</p>' : '') + (F.any ? basisLine(c) : '') + '</div>' +
          '<dl class="card-rows">' + rows + '</dl></section>';
      }
      var w = Math.min(innerW() - (nar() ? 32 : 64), 1312), stack = nar() && n > 2;
      var notes = sel.map(function (x) { var N = notesHTML(x), s2 = speedNote(x); return '<section class="cnote"><h4 class="cnote-h">' + esc(short(x)) + '<span>' + esc(maker(x)) + '</span></h4>' + (s2 ? '<p class="note-s speed"><span class="cap">How the speed is counted</span>' + s2 + '</p>' : '') + N.notes + '<h5 class="src-h">Sources</h5>' + N.sources + '</section>'; }).join('');
      return '<section class="card cmpcard" aria-labelledby="aic-card-h" id="aic-card"><h2 id="aic-card-h" class="sr-only" tabindex="-1">' + cap1(join(sel.map(function (x) { return 'the ' + esc(short(x)); }))) + '</h2>' +
        '<div class="card-top">' + (n < 4 ? '<button type="button" class="tact" data-compare data-title="Add a chip" aria-haspopup="dialog" aria-expanded="false">Add a chip</button>' : '<p class="note-s four">A comparison holds up to four chips.</p>') + close + '</div>' +
        cmpHTML(sel, { width: w, stack: stack, gap: nar() ? 16 : 32, side: !nar(), labelW: 160 }) +
        '<div class="card-more"><section class="card-stand"><h3 class="card-h3">Where they stand</h3>' + standInner() + '</section></div>' +
        '<section class="card-notes"><h3 class="card-h3">Notes and sources</h3>' + notes + '</section></section>';
    };
    /* ---- the head's chart and the shelves, linked (quick win B, owner, 29 Oct 2026) ----
       Hovering or focusing a package lights its dot in ink, with its name and figure; a chip with no figure on the chart says so
       in the chart's own words. A click or a tap on a dot lights its package and brings it into view, where the tip used to
       open; a click on the package then opens its card, as before. The keys on the chart keep the tip. Lk holds the head
       chart's points (chartSVG's, each with its chip), the chip whose dot is lit, which a new drawing of the chart lights again,
       and the package a dot led to, which keeps its mark until another dot is pressed or the shelves are drawn again. */
    var Lk = { host: null, res: null, id: null, pkg: null };
    var litDot = function () {
      var svg = Lk.host && $('svg.chart', Lk.host), g = svg && $('.lit', svg); if (!g) return;
      var id = Lk.id, res = Lk.res, m = res.F.m, W = +svg.getAttribute('width'), p = null;
      if (!id) { g.innerHTML = ''; return; }
      res.pts.forEach(function (q) { if (q.c.id === id) p = q; });
      if (!p) { // no figure on this chart: the words the chart's notes use for it
        var c = byId(id);
        g.innerHTML = c ? '<text class="lab lab-h lit-none" x="' + (W - 2) + '" y="14" text-anchor="end">' + esc(nilKind(c, m) === 'no' ? m.fmt.toUpperCase() + ' is not supported by the ' + short(c) : m.label + ' is not published for the ' + short(c)) + '</text>' : '';
        return;
      }
      var t = short(p.c) + ', ' + nf(p.v), tw = textW(t, true), right = p.x + 14 + tw < W - 4;
      g.innerHTML = (p.off ? '' : '<circle class="lit-ring" cx="' + r2(p.x) + '" cy="' + r2(p.y) + '" r="9"/><circle class="lit-dot" cx="' + r2(p.x) + '" cy="' + r2(p.y) + '" r="4.6"/>') +
        '<text class="lab lab-h lit-lab" x="' + r2(right ? p.x + 14 : p.x - 14) + '" y="' + r2(Math.max(14, p.y - 10)) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + esc(t) + '</text>';
    };
    var litPkg = function (id) {
      $$('#aic li.it.is-lit').forEach(function (li) { li.classList.remove('is-lit'); });
      var b = id ? document.getElementById('aic-it-' + id) : null;
      if (b) b.parentNode.classList.add('is-lit');
      return b;
    };
    var light = function (id) { Lk.id = id || Lk.pkg || null; litDot(); }; // none: back to the package a dot led to, if any
    var toPackage = function (id) { // a dot pressed: its package marked, brought to the middle of the window, and flashed once
      Lk.id = Lk.pkg = id; litDot();
      var b = litPkg(id); if (!b) return;
      var br = b.getBoundingClientRect(), top = br.top + window.pageYOffset - Math.max(headerH() + 24, (window.innerHeight - br.height) / 2 - 40);
      window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: reduced ? 'auto' : 'smooth' });
      b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
    };
    var drawChart = function () {
      var sel = selection(), mk = S.measure;
      var head = document.getElementById('aic-c-head');
      if (head) { var r0 = chartSVG({ measure: mk || 'fp16', w: chartW(), h: nar() ? 260 : 250, sel: S.picked, small: true }); head.innerHTML = r0.svg; interactChart(head, r0, { here: S.picked, link: toPackage }); Lk.host = head; Lk.res = r0; litDot(); }
      var host = document.getElementById('aic-c-card'); if (!host) return;
      var w = Math.round(host.clientWidth || 520);
      var res = chartSVG({ measure: mk || firstMeasure(sel), w: Math.max(280, Math.min(w, 666)), h: nar() ? 250 : 300, sel: S.picked, small: nar() });
      host.innerHTML = res.svg; interactChart(host, res, { here: S.picked });
    };
    // the chosen chip's shelf under the masthead, its card beneath
    var scrollToCard = function () {
      var li = $('#aic .card-li'); if (!li) return; var shelf = li.previousElementSibling;
      var y = shelf.getBoundingClientRect().top + window.pageYOffset - headerH() - 12;
      window.scrollTo(0, Math.max(0, Math.round(y)));
    };
    var lastKey = null;
    var render = function (how) {
      how = how || {};
      var view = $('#aic-view'); if (!view) return;
      tipClose = null; Lk.id = Lk.pkg = null; // the shelves are drawn afresh; a package that keeps the focus lights its dot again (focusin)
      var key = S.picked.join(','), focusId = document.activeElement && view.contains(document.activeElement) ? document.activeElement.id : null, y = window.pageYOffset;
      view.innerHTML = headHTML() + shelvesHTML();
      if (Router.current === 'landscape') { Router.title(); var sel = selection(); if (sel.length) document.title = sel.map(short).join(', ') + ' · ' + document.title; }
      drawChart();
      if (focusId) { var f = document.getElementById(focusId); if (f) f.focus({ preventScroll: true }); }
      var changed = key !== lastKey;
      lastKey = key;
      if (how.measure || how.resize || how.fonts) window.scrollTo(0, y);
      else if (how.boot) { if (key) setTimeout(scrollToCard, 0); } // the router puts a newly shown view at the top after this, so the card waits a turn
      else if (changed) {
        if (key) scrollToCard();
        else if (how.closedFrom) { var s = document.getElementById(how.closedFrom); if (s) window.scrollTo(0, Math.max(0, Math.round(s.getBoundingClientRect().top + window.pageYOffset - headerH() - 26))); }
      }
    };
    var closeCard = function () { var li = $('#aic .card-li'), sh = li && li.previousElementSibling; setPicked([], { closedFrom: sh ? sh.id : null }); };

    var wired = false;
    var wire = function () {
      if (wired) return; wired = true;
      defs();
      var d = $('#aic-view .dek'); DEK = d ? d.innerHTML : '';
      document.addEventListener('click', function (e) {
        if (Router.current !== 'landscape' || !e.target.closest) return;
        var t = e.target, b;
        if ((b = t.closest('#aic [data-open]'))) { e.preventDefault(); var id = b.getAttribute('data-open'); if (S.picked.length === 1 && S.picked[0] === id) { closeCard(); return; } setPicked([id]); return; }
        if ((b = t.closest('#aic [data-home]'))) { e.preventDefault(); closeCard(); return; }
        if ((b = t.closest('#aic [data-compare]'))) { e.preventDefault(); openPicker(b, b.getAttribute('data-title') || 'Compare with'); return; }
        if ((b = t.closest('#aic [data-remove]'))) { e.preventDefault(); remove(b.getAttribute('data-remove')); return; }
        // the list mark "all": the chip's sources, in place, so the address keeps the chips it names
        if ((b = t.closest('#aic [data-srcs]'))) {
          var to = document.getElementById('aic-srcs-' + b.getAttribute('data-srcs')); if (!to) return; e.preventDefault();
          window.scrollTo(0, Math.max(0, Math.round(to.getBoundingClientRect().top + window.pageYOffset - headerH() - 16))); to.focus({ preventScroll: true }); return;
        }
      });
      document.addEventListener('change', function (e) { var t = e.target; if (t.classList && t.classList.contains('mselect') && t.closest('#aic')) setMeasure(t.value); });
      // a package under the pointer, or with the focus, lights its dot on the head's chart (a touch goes straight to the click)
      var pkgOf = function (t) { return Router.current === 'landscape' && t && t.closest ? t.closest('#aic .shelves .it-b') : null; };
      document.addEventListener('pointerover', function (e) { var b = pkgOf(e.target); if (b && e.pointerType !== 'touch') light(b.getAttribute('data-open')); });
      document.addEventListener('pointerout', function (e) { var b = pkgOf(e.target); if (!b || (e.relatedTarget && b.contains(e.relatedTarget))) return; var f = pkgOf(document.activeElement); light(f ? f.getAttribute('data-open') : null); });
      document.addEventListener('focusin', function (e) { var b = pkgOf(e.target); if (b) light(b.getAttribute('data-open')); });
      document.addEventListener('focusout', function (e) { var b = pkgOf(e.target); if (b && !pkgOf(e.relatedTarget)) light(null); });
      document.addEventListener('pointerdown', function (e) { if (tipClose) tipClose(e); }, true);
      var rt = null, lastW = window.innerWidth;
      window.addEventListener('resize', function () {
        if (window.innerWidth === lastW) return; lastW = window.innerWidth; // a phone's toolbar changes only the height
        clearTimeout(rt); rt = setTimeout(function () { if (Router.current === 'landscape') { closePicker(false); render({ resize: true }); } }, 150);
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (Router.current === 'landscape') render({ fonts: true }); }); // the chart's labels are placed by their measured width
      window.addEventListener('hashchange', function () { if (Router.current !== 'landscape') closePicker(false); });
    };

    L.activate = function () { // each route to AI Chips: the address decides what is open
      var arriving = !wired || Router.from !== 'landscape';
      wire(); closePicker(false); readAddress(!arriving);
      render(arriving ? { boot: true } : { pop: true });
    };
    // a chip found elsewhere (search, the Glossary) opens on its own, in place of the address it landed on
    L.openCard = function (id) { if (Router.current !== 'landscape' || !byId(id) || (S.picked.length === 1 && S.picked[0] === id)) return; setPicked([id], { push: false }); };
    L.S = S; L.byId = byId; L.short = short; L.MEAS = MEAS; L.nf = nf; L.selection = selection; L.setPicked = setPicked; L.add = add; L.remove = remove; L.setMeasure = setMeasure;
    L.fieldOf = fieldOf; L.ordered = ordered; L.planSize = planSize; L.nilKind = nilKind; L.render = render;
    return L;
  })();

  /* ---------------- suppliers ----------------
     One list of firms, listed three ways: by segment (the ladder, from design to power), by country, or in a table, every
     name opening its own panel. Over it, the ribbons by share (src/modules/supshares.js, since 29 Oct 2026): which countries
     hold each of the chokepoint matrix's twenty segments. Until then the ribbons counted the firms on this list. "Stages" are the
     stage chapters of the chain (build/stages.js); the list's own categories are "segments". */
  var Suppliers = {
    rows: DATA.suppliers || [], built: false, stage: '', country: '', chk: '', q: '', sortKey: 'name', sortDir: 1,
    tab: 'segment', savedTab: '', atlasCC: '', stages: [],
    CO: ['US', 'JP', 'CN', 'TW', 'KR', 'NL', 'DE'], // the firm filter's "Other countries" holds every country but these
    /* the EU-27 members, for the firm filter's "EU-27 members", which #/suppliers?group=eu sets (the Glossary's EU-27 card) */
    EU27: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'], // the members in 2026
    colOf: function (cc) { return this.CO.indexOf(cc) >= 0 ? cc : 'Other'; }, // the firm filter's "Other countries" are those outside CO
    LEVELS: ['Critical', 'Important', 'Contested', 'Diversified'],
    RANK: { Critical: 0, Important: 1, Contested: 2, Diversified: 3 },
    ORDER: ['Design and EDA', 'IP and architecture', 'Silicon and wafers', 'Photomasks', 'Lithography', 'Deposition and etch', 'Photoresist and materials', 'Chemicals and gases', 'Optics and photonics', 'Equipment subsystems and components', 'Metrology and inspection', 'Foundry', 'Memory', 'Advanced packaging and OSAT', 'Test', 'Substrates and PCBs', 'Interconnect and networking', 'Power and cooling', 'Systems and servers', 'AI accelerator vendors'], // chain order, design first
    /* the shorter names the ladder's jump list and /suppliers/ use for the long categories (build/modules/reference-pages.js reads them) */
    SHORT: {
      'Equipment subsystems and components': 'Equipment subsystems', 'Advanced packaging and OSAT': 'Advanced packaging',
      'Interconnect and networking': 'Interconnect', 'AI accelerator vendors': 'Accelerator vendors',
      'Photoresist and materials': 'Photoresist', 'Metrology and inspection': 'Metrology',
      'Deposition and etch': 'Deposition and etch', 'Chemicals and gases': 'Chemicals and gases',
      'Systems and servers': 'Systems and servers', 'Power and cooling': 'Power and cooling',
      'Silicon and wafers': 'Silicon wafers', 'IP and architecture': 'IP and architecture'
    },
    /* the address: #/suppliers opens By segment, ?tab=country By country and ?tab=table the table; &group=eu filters the firms
       to the EU-27 members and lands on them (the Glossary's EU-27 card links there). Until 29 Oct 2026 it drew the members as
       one column of the ribbons; the ribbons by share have no EU-27 column, since it would draw sums of shares. */
    activate: function () {
      var h = location.hash || '', eu = /[?&]group=eu\b/.test(h);
      var tab = /[?&]tab=country\b/.test(h) ? 'country' : /[?&]tab=table\b/.test(h) ? 'table' : '';
      if (!this.built) this.build();
      this.setTab(tab || this.savedTab || 'segment', true);
      // the router has just put the page at its top; the EU-27 address lands on the firms, under the ribbons
      if (eu) { this.show({ country: '__eu' }); setTimeout(function () { var t = $('#sup-reg'); if (t && !t.closest('[hidden]')) { scrollToEl(t, false); Router.settle(t); } }, 0); }
    },
    /* the address follows the tab, without a new history entry */
    url: function () {
      var q = [];
      if (this.tab === 'country' || this.tab === 'table') q.push('tab=' + this.tab);
      try { history.replaceState(history.state, '', '#/suppliers' + (q.length ? '?' + q.join('&') : '')); } catch (e) { }
    },
    otherCount: function () { // "Other countries" in the firm filter counts the firms of every country outside CO
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
    light: function (cc) { // the route's chosen country follows its column in the ribbons, where it has one (src/modules/supshares.js)
      this.atlasCC = cc || '';
      var S = window.CP_SUPSHARES; if (S) S.follow(S.column(this.atlasCC));
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
      if (q) this.reveal(q);
    },
    /* a filter that names one firm (a search result, a Glossary firm card) opens that firm on the list and brings it to the
       middle of the screen, with focus on its name: the filtered list alone left it 2,000 px down and shut (28 Oct 2026) */
    reveal: function (name) {
      var n = String(name).trim().toLowerCase(), r = this.rows.filter(function (x) { return String(x.name).toLowerCase() === n; })[0];
      if (!r) return;
      if (this.tab === 'table') return; // the table, filtered to the firm, has it at its head
      var w = $((this.tab === 'country' ? '#sup-ladder-cc' : '#sup-ladder') + ' .sup-nw[data-r="' + r._ix + '"]');
      if (!w || w.hidden) return;
      var btn = $('.sup-name', w);
      if (btn.getAttribute('aria-expanded') !== 'true') this.openName(btn);
      try { btn.focus({ preventScroll: true }); } catch (e) { }
      // the firm's segment (or country) at the top, under the masthead: its heading, the names and the opened firm below them
      var rung = w.closest('.sup-rung');
      var go = function () { var top = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead')) || 64) + 12; document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, Math.max(0, rung.getBoundingClientRect().top + window.pageYOffset - top)); document.documentElement.style.scrollBehavior = ''; };
      go(); setTimeout(go, 200); // again once the route has settled the page (Keys.land, the masthead)
    },
    sortBy: function (k) {
      if (this.sortKey === k) this.sortDir = -this.sortDir; else { this.sortKey = k; this.sortDir = 1; }
      var a = document.activeElement, inTable = !!(a && a.closest && a.closest('#sup-table'));
      this.render();
      // the table is drawn afresh, so the pressed header would take focus with it: give it to the new one (accessibility #12)
      var b = inTable ? $('#sup-table button[data-sort="' + k + '"]') : null; if (b) b.focus();
    },
    sync: function () { // every control and the lists show the same state
      var tab = this.tab;
      var sel = $('#sup-country'); if (sel) sel.value = this.country || '';
      $('#sup-ladder').hidden = tab !== 'segment';
      $('#sup-ladder-cc').hidden = tab !== 'country';
      $('#sup-wrap').hidden = tab !== 'table';
      var lh = $('#sup-ladder-h'); if (lh) { lh.hidden = tab === 'table'; lh.textContent = tab === 'country' ? 'Countries by number of firms, most first' : 'Segments from chip design to power'; }
      var key = $('#sup-key'); if (key) key.hidden = tab === 'table'; // the key names the colors of the names, so it goes with the lists
    },
    countryLabel: function () { return this.country === '__other' ? 'Other countries' : this.country === '__eu' ? 'EU-27 members' : cname(this.country); },
    filtering: function () { return !!this.stage || !!(this.country || this.chk || this.q); },
    inCountry: function (r) { // the firm filter's country test: one country, the EU-27 members, or every country outside CO
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
          '<span class="sup-rank" aria-hidden="true" data-unit="' + (s.n === 1 ? 'firm' : 'firms') + '">' + s.n + '</span>' +
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
            '<span class="sup-rank" aria-hidden="true" data-unit="' + (c.rows.length === 1 ? 'firm' : 'firms') + '">' + c.rows.length + '</span>' +
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
      // the day the board's data was last checked against its sources (control-flows.json "checked"; else the newest entry).
      // Past it the board takes nothing on its date alone: a stay whose end has come reads "extension not confirmed", and a
      // state dated after it reads as due, until the data confirms either (final QA B3, 28 Oct 2026)
      var ck = DATA.flows && DATA.flows.checked;
      this.checked = /^\d{4}-\d{2}-\d{2}$/.test(String(ck || '')) ? String(ck) : (lastDay || today);
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
       initial state. Only what the data has confirmed counts: past the day the data was checked (this.checked), a
       state dated later is shown as due and not applied, and a stay whose end date has come is shown as due to end,
       "extension not confirmed", never as ended. A stay names what it suspends ("suspends"); the pill keeps the policy
       in force meanwhile, and "resumes" is the outcome that returns once the data confirms the stay is over. A stay
       with no "suspends" holds up the state's own outcome, and its pill is drawn back. */
    stateAt: function (f, date) {
      var st = f.states || [], out = null, due = null, s, k, ck = this.checkedOn() || date;
      var upTo = String(date) > String(ck) ? ck : date; // the data speaks for each day up to its check, and no further
      for (var i = 0; i < st.length; i++) {
        if (!st[i] || !st[i].date) continue;
        if (st[i].date <= upTo) out = st[i];
        else if (st[i].date <= date && !due) due = st[i];
      }
      s = out || (f.initial && typeof f.initial === 'object' ? f.initial : null);
      var pending = due ? { date: due.date, label: due.label || '' } : null;
      if (!s) {
        k = this.norm(typeof f.initial === 'string' ? f.initial : 'open');
        return { status: k, label: this.STATE[k], date: null, announced: null, published: null, suspendedUntil: null, suspends: '', suspended: false, unconfirmed: false, also: null, scope: '', pending: pending, cite: null, event: null };
      }
      var until = s.suspendedUntil ? String(s.suspendedUntil) : null;
      var holds = !!until && until >= String(date); // the stay runs to the end of its last day
      var unconfirmed = !!until && !holds && until >= String(ck); // ended after the data was checked: not taken as ended
      var lapsed = !!until && !holds && !unconfirmed;
      k = this.norm(lapsed && s.resumes ? s.resumes : s.status);
      return {
        status: k,
        label: s.label || this.STATE[k],
        date: out ? out.date : (s.date || null),
        announced: s.announced || null, // missing: the effective date stands for both
        published: s.published || null, // the Federal Register's publication day, when that is the second date
        suspendedUntil: until,
        suspends: s.suspends || '',
        suspended: holds || unconfirmed,
        unconfirmed: unconfirmed,
        also: s.also && s.also.status ? { status: this.norm(s.also.status), scope: s.also.for || '' } : null, // a second review policy, with whom it covers
        scope: s.for || '',
        pending: pending,
        cite: s.cite || null, // missing: nothing is printed
        event: s.event || null
      };
    },
    keyOf: function (s) {
      return s.status + '|' + s.label + '|' + (s.date || '') + '|' + (s.announced || '') + '|' + (s.published || '') +
        '|' + (s.suspended ? s.suspendedUntil + (s.unconfirmed ? '?' : '') : '') + '|' + (s.also ? s.also.status + s.also.scope : '') +
        '|' + (s.pending ? s.pending.date : '') + '|' + this.citeText(s.cite) + '|' + ((s.cite && s.cite.url) || '');
    },
    checkedOn: function () { // works before the board is built, for the export bar at boot
      if (this.checked) return this.checked;
      var ck = DATA.flows && DATA.flows.checked;
      return /^\d{4}-\d{2}-\d{2}$/.test(String(ck || '')) ? String(ck) : '';
    },
    /* the tag beside a stayed state: the measure on hold and until when, or, once that day has passed without the data
       confirming the end, that it was due to end and no extension is confirmed */
    stayText: function (s) {
      if (!s || !s.suspended || !s.suspendedUntil) return '';
      var d = this.fmtDate(s.suspendedUntil), what = s.suspends || '';
      if (s.unconfirmed) return (what ? what + ' due' : 'Due') + ' to end ' + d + ', extension not confirmed';
      return (what ? what + ' suspended' : 'Suspended') + ' until ' + d;
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
    /* "29 Sep 2025": day first, with one set of month abbreviations (the browser's en-GB "Sept" and en-US "Sep" disagreed),
       as the static /export-controls/ page prints them (build/modules/reference-pages.js shortDate) */
    MON: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    fmtDate: function (iso, noYear) {
      var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
      return m && +m[2] >= 1 && +m[2] <= 12 ? +m[3] + ' ' + this.MON[+m[2] - 1] + (noYear ? '' : ' ' + m[1]) : String(iso || '');
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
        var ds = esc(self.fmtDate(e.date, true)); // "15 Apr": day first, as the board and the static page print dates
        var host = e.source ? e.source.replace(/^https?:\/\//, '').split('/')[0] : '';
        var eff = e.effectiveDate && e.effectiveDate !== e.date ? e.effectiveDate : null; // a rule takes force after it is announced
        var inst = self.instWord(e.instrument), cite = self.citeText({ fr: e.frCitation, cfr: e.cfr });
        html += '<li class="tl-e" id="tl-e' + i + '" data-i="' + i + '" data-ev="' + esc(e.id || '') + '" data-date="' + esc(e.date || '') + '">' +
          '<div class="d"><b>' + ds + '</b>' + (eff ? '<span class="tl-eff">in force ' + esc(self.fmtDate(eff)) + '</span>' : '') + esc(e.actor || '') + '</div>' +
          '<div class="tl-body"><span class="cf-ev-tags"><span class="cat ' + self.CATS[self.lane(e.category)].cls + '">' + esc(e.category || '') + '</span>' +
          (inst ? '<span class="cf-inst">' + esc(inst) + '</span>' : '') + '</span>' +
          '<h4>' + esc(e.title) + '</h4><p class="tl-gist">' + esc(self.gistOf(e)) + '</p>' +
          (cite ? self.citeHTML({ fr: e.frCitation, cfr: e.cfr, url: (e.cite && e.cite.url) || e.source }, 'cf-ev-cite') : '') +
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
        if (s.suspended) susp++;
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
      var ck = this.checkedOn();
      var list = (Object.prototype.toString.call(raw) === '[object Array]' ? raw : []).map(function (u) {
        var d = u && day(u.date); return d ? { u: u, n: Math.round((d - today) / 86400000) } : null;
      }).filter(function (x) { return x && (x.n >= 0 || (ck && String(x.u.date) >= ck)); }).sort(function (a, b) { return a.n - b.n; }); // passed, but after the data was checked: kept, not confirmed
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
        var u = x.u, when = x.n < 0 ? 'Passed, outcome not confirmed' : x.n === 0 ? 'Today' : x.n === 1 ? 'Tomorrow' : 'In ' + x.n + ' days'; // sentence case as written: CSS sets no capitals
        var link = u.event ? '<a class="cf-up-link" href="' + esc('#/controls/' + encodeURIComponent(u.event)) + '" aria-label="Entry in the timeline">Entry <span aria-hidden="true">→</span></a>'
          : (u.source && safeUrl(u.source) !== '#' ? '<a class="cf-up-link" href="' + safeUrl(u.source) + '" target="_blank" rel="noopener">Source</a>' : '');
        return '<li class="cf-up-i' + (x.n < 0 ? ' is-passed' : x.n <= 30 ? ' is-soon' : '') + '"><span class="cf-up-d">' + esc(self.fmtDate(u.date)) + '</span>' +
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
      return 'cf-ramp' + (st.status === 'policy' ? ' is-policy' : '') + (this.rampAt(st) >= 3 ? ' is-closed' : '') + (st.suspended && !st.suspends ? ' is-susp' : '');
    },
    /* the row read aloud: the button carries no text of its own, so it says what the row says */
    rowLabel: function (f, st, n) {
      return [f.name || f.id, f.route, this.STATE[st.status] + (st.scope ? ' for ' + st.scope : ''),
      st.also ? this.STATE[st.also.status] + (st.also.scope ? ' for ' + st.also.scope : '') : '', this.stayText(st),
      st.pending ? 'change due ' + this.fmtDate(st.pending.date) + ', not confirmed' : '',
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
      if (st.published && st.date && st.published !== st.date) dates += ' · published ' + this.fmtDate(st.published); // the Federal Register's day
      else if (st.announced && st.date && st.announced !== st.date) dates += ' · announced ' + this.fmtDate(st.announced);
      var stay = this.stayText(st);
      return '<span class="cf-pills">' +
        '<span class="cf-pill is-' + esc(st.status) + (st.suspended && !st.suspends ? ' is-suspended' : '') + '">' + esc(word) + '</span>' +
        (st.scope ? '<span class="cf-for">' + esc(st.scope) + '</span>' : '') +
        (st.also ? '<span class="cf-pill is-' + esc(st.also.status) + '">' + esc(this.STATE[st.also.status]) + '</span>' + (st.also.scope ? '<span class="cf-for">' + esc(st.also.scope) + '</span>' : '') : '') +
        (stay ? '<span class="cf-susp' + (st.unconfirmed ? ' is-unconfirmed' : '') + '">' + esc(stay) + '</span>' : '') +
        (st.pending ? '<span class="cf-susp is-unconfirmed">Change due ' + esc(this.fmtDate(st.pending.date)) + ', not confirmed</span>' : '') +
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
          since: st.date || '', announced: st.announced || '', published: st.published || '', suspendedUntil: st.suspended ? st.suspendedUntil || '' : '', suspends: st.suspended ? st.suspends : '',
          stay: self.stayText(st), alsoState: st.also ? self.STATE[st.also.status] : '', dataChecked: self.checkedOn(),
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
            (s.for ? '<span class="cf-for">' + esc(s.for) + '</span>' : '') +
            (s.also && s.also.status ? '<span class="cf-pill is-' + esc(self.norm(s.also.status)) + '">' + esc(self.word(s.also.status)) + '</span>' + (s.also.for ? '<span class="cf-for">' + esc(s.also.for) + '</span>' : '') : '') +
            (s.label ? '<span class="cf-ev-lab">' + self.gloss(s.label) + '</span>' : '') +
            (s.suspendedUntil ? '<span class="cf-susp">' + esc((s.suspends ? s.suspends + ' suspended' : 'Suspended') + ' until ' + self.fmtDate(s.suspendedUntil)) + '</span>' : '') +
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
          (eCite ? self.citeHTML({ fr: e.frCitation, cfr: e.cfr, url: (e.cite && e.cite.url) || e.source }, 'cf-ev-cite') : '') +
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
      return '<p class="cf-chapter"><a href="' + safeUrl(addr('#' + f.chapter)) + '">Read the chapter</a>' +
        (t ? '<span class="cf-chapter-n">' + esc(t.title) + '</span>' : '') + '</p>';
    },
    /* ---- the scrubber: the years as equal segments, a playhead, and Now ---- */
    renderScrub: function () {
      var self = this, host = $('#cf-scrub');
      if (!host || !this.flows) return;
      host.innerHTML = '<div class="cf-scrub-h"><p class="cf-asof">Board as of <b id="cf-asof">' + esc(this.fmtDate(this.asOf)) + '</b>' +
        '<span class="cf-checked" id="cf-checked"' + (this.asOf > this.checked ? '' : ' hidden') + '>· data checked ' + esc(this.fmtDate(this.checked)) + '</span></p>' +
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
      var chk = $('#cf-checked'); if (chk) chk.hidden = !(String(date) > String(this.checked)); // the board is the data's as of its check
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
     The definitions come from terms.js, which every page shares (build/build.js). */
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
      var self = this, mark = function (e) { return e.target && e.target.closest ? e.target.closest('sup.cite a, a.wk-src[data-d]') : null; }; // home's Source links take the same card (build/modules/walk.js)
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
        // every term's definition, from terms.js, which every page loads (build/build.js reads them from the Glossary's list)
        this.defs = {};
        var T = (window.CP_TERMS || {}).defs || {};
        Object.keys(T).forEach(function (k) { this.defs[k] = { term: T[k][0], plain: T[k][1] }; }, this);
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
        t.innerHTML = '<b>' + esc(ds.head || btn.textContent.trim()) + '</b><p>' + esc(ds.note) + '</p>' + (ds.test ? '<p class="gl-tip-test"><span class="label">This stage</span>' + esc(ds.test) + (/[.!?]$/.test(ds.test) ? '' : '.') + '</p>' : '') + '<a href="' + esc(addr('#gl-' + slug)) + '">How ' + esc(String(d.term).toLowerCase()) + ' is rated →</a>';
      } else {
        t.innerHTML = '<b>' + esc(d.term) + '</b><p>' + esc(d.plain) + '</p><a href="' + esc(addr('#gl-' + slug)) + '">Look it up →</a>';
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
    // the view's own title: an h1, or for the views that share the home page a level-one heading in a paragraph (.vt), so the page
    // carries one h1 (28 Oct 2026; the chain also holds the printed cover's)
    title: function (view) { return view ? $$('h1, .vt[aria-level="1"]', view).filter(this.shown)[0] || null : null; },
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
    /* the index: every chapter and its sections, Start here's paragraphs, each glossary term, supplier, chip, export-control
       event and China revenue row, and each flashcard (found by its question or its answer: more, matched, never shown; the
       result opens the deck at that card, question side up, Tools.openCard). The build makes it from the pages, in the order
       and words this function once read from the page (build/build.js, dist/assets/search.js), since each chapter has its own
       page (28 Oct 2026); it comes when the search first opens (need), and until then this gives null */
    buildIndex: function () {
      if (this.index) return this.index;
      if (!window.CP_SEARCH) return null;
      var idx = window.CP_SEARCH.map(function (e) { var i = {}; for (var k in e) i[k] = e[k]; return i; });
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
      if (!idx) return { hits: [], note: '', wait: true }; // the index is on its way (need)
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
        if (window.matchMedia && matchMedia('(max-width: 640px)').matches) $('input', box).placeholder = 'Search chapters, terms, firms, chips…'; // the long one was cut mid-word on a phone
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
          if (res.wait) { need('search.js', function () { if (!box.hidden && inp.value.trim()) inp.dispatchEvent(new Event('input')); }); return; }
          say(res.note ? 'Nothing matches. ' + (hits.length === 1 ? '1 nearest term.' : hits.length + ' nearest terms.') : !hits.length ? 'Nothing matches.' : hits.length === 1 ? '1 result.' : hits.length + ' results.');
          list.innerHTML = (res.note ? '<li class="none">' + esc(res.note) + '</li>' : '') +
            (hits.map(function (h, k) { return '<li><a href="' + safeUrl(addr(h.href)) + '" data-k="' + k + '"><span class="k">' + esc(h.kind) + '</span><b>' + esc(h.title) + '</b><span class="t">' + esc(clip(h.text, 140)) + '</span></a></li>'; }).join('') || (res.note ? '' : '<li class="none">Nothing matches.</li>'));
          // a result on another page is a link to its address (addr), and what it did after the route there goes with it (go)
          list.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function (e) { var h = hits[+a.getAttribute('data-k')];
            if (away(h.href)) { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return; e.preventDefault(); self.close(true); go(h.href, { chip: h.chip, q: h.q, card: h.card, land: h.href }); return; }
            self.close(true); Keys.land(h.href); if (h.href === location.hash) setTimeout(function () { Router.route(); }, 0); /* the address is already this one, so no hashchange will come: go there anyway */ if (h.chip) setTimeout(function () { Landscape.openCard(h.chip, { show: true }); }, 60); /* a chip opens its card on the chart and adds nothing */ if (h.q) setTimeout(function () { Suppliers.show({ q: h.q }); }, 60); /* the whole filter, so a country or stage left from an earlier visit cannot hide the firm */ if (h.el) setTimeout(function () { h.el.scrollIntoView({ block: 'center' }); }, 60); if (h.card && self.openCard) setTimeout(function () { self.openCard(h.card.id, h.card.i); }, 60); }); });
        });
      }
      if (box.hidden) this.from = document.activeElement; // where the reader was, so closing can put them back
      box.hidden = false; $('input', box).value = ''; $('ol', box).innerHTML = ''; var tr = $('.cp-search-try', box); if (tr) tr.hidden = false;
      var sd = $('.cp-search-said', box); if (sd) { clearTimeout(this.sayT); sd.textContent = ''; }
      this.hold(true); $('input', box).focus();
      need('search.js');
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
       entries (the Glossary's #lk-items, as terms.js carries it to every page). A chip goes by its model ("Ascend 950PR", "Instinct MI300X"): the maker,
       a design house in brackets and a bracketed tail are dropped */
    tryNames: function () {
      // the names come with terms.js on every page (build/build.js): terms of 22 letters or fewer, the firms rated Critical or
      // Important, each chip by its own name and the countries, as the Glossary's list holds them
      var P = (window.CP_TERMS || {}).try || {};
      var pick = function (arr, n) { var a = (arr || []).slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a.slice(0, n); };
      var chosen = pick(P.term, 2).concat(pick(P.firm, 2), pick(P.chip, 1), pick(P.country, 1));
      return pick(chosen, chosen.length).map(function (n) { return String(n).replace(/\s*\([^)]*\)$/, ''); }).filter(Boolean);
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
      ['pointerenter', 'focus', 'touchstart'].forEach(function (t) { btn.addEventListener(t, function () { need('search.js'); }, { passive: true }); }); // the index is fetched as the reader heads for it
      if (nav) nav.insertBefore(btn, $('.theme-toggle'));
      Keys.init();
      // the readable pages' masthead has a search button too, a link here with ?search=1 (build/masthead.js): the
      // dialog opens as the page comes up, and the address drops the flag, so a reload or Back does not open it again
      if (/[?&]search=1(&|$)/.test(location.search)) {
        try { history.replaceState(history.state, '', location.pathname + location.search.replace(/([?&])search=1(&|$)/, '$1').replace(/[?&]$/, '') + location.hash); } catch (e) { }
        setTimeout(function () { self.open(); }, 0);
      }
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
        var url = b.getAttribute('data-copy'), done = function () { b.style.minWidth = b.offsetWidth + 'px'; b.textContent = 'Copied'; b.setAttribute('data-done', '1'); setTimeout(function () { b.textContent = 'Link to chapter'; b.style.minWidth = ''; b.removeAttribute('data-done'); }, 1600); }; // the width holds, so Cite does not slide under a second click
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
        else window.prompt('Copy this link', url);
      });
      // heading permalinks
      // heading permalinks: the "#" that appears on hover copies the section's full address and sets the hash. A chapter's
      // sections are h2 and its subsections h3 since 29 Oct 2026 (build/build.js markdown(); h3 and h4 before)
      var canon = $('link[rel="canonical"]'), base = canon && canon.href ? canon.href.replace(/#.*$/, '') : location.href.replace(/#.*$/, '');
      $$('.chapter .prose h2[id], .chapter .prose h3[id]').forEach(function (h) { var a = document.createElement('a'); a.className = 'permalink'; a.href = '#' + h.id; a.setAttribute('aria-label', 'Copy a link to this section'); a.title = 'Copy link'; a.textContent = '#'; h.appendChild(a); });
      document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('.permalink') : null;
        if (!a) return;
        var url = base + a.getAttribute('href'), done = function () { a.textContent = 'Copied'; a.setAttribute('data-done', '1'); setTimeout(function () { a.textContent = '#'; a.removeAttribute('data-done'); }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () {});
      });
      // a sticky rail taller than the window scrolls, and macOS hides its scrollbar: while rows wait below, its foot fades
      // (data-more; src/modules/chapter.css). A rail that fits draws no fade (design10 chapter P2.3, 29 Oct 2026)
      var rails = $$('.chapter .ch-rail'), railT = 0, railMore = function () { railT = 0; rails.forEach(function (r) { if (r.scrollHeight - r.scrollTop - r.clientHeight > 1) r.setAttribute('data-more', ''); else r.removeAttribute('data-more'); }); };
      if (rails.length) {
        var railSoon = function () { if (!railT) railT = requestAnimationFrame(railMore); };
        rails.forEach(function (r) { r.addEventListener('scroll', railSoon, { passive: true }); });
        addEventListener('resize', railSoon); addEventListener('scroll', railSoon, { passive: true });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(railMore);
        railMore();
      }
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
      // cite-this block in the footer, in the form "Cite this chapter" and the PDFs use (build/build.js citeBlock, src/modules/print.js):
      // on a chapter's page the chapter, its title and its own "Updated" day; elsewhere the site, with the footer's "Updated" day.
      // The access date is the reader's own day, written day first as every date on the site is (28 Oct 2026; it was ISO)
      var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var now = new Date(), d0 = now.getDate() + ' ' + MON[now.getMonth()] + ' ' + now.getFullYear();
      var canon = (document.querySelector('link[rel=canonical]') || {}).href || (location.origin + location.pathname);
      var chText = PAGE.kind === 'chapter' && PAGE.chapter ? $('#cite-' + PAGE.chapter + ' .ch-cite-text') : null, ct = chText ? chText.textContent : '';
      var chTitle = (/“(.+?)\.”/.exec(ct) || [])[1] || '', chDay = (/Updated (\d{1,2} [A-Z][a-z]+ \d{4})/.exec(ct) || [])[1] || '';
      var upd = ($('.site-footer .updated') || {}).textContent || '', um = (chTitle && chDay ? chDay : upd).match(/(\d{1,2})\s+([A-Z][a-z]+)\s+(\d{4})/);
      var year = um ? um[3] : String(now.getFullYear()), dayUp = um ? um[1] + ' ' + um[2] + ' ' + um[3] : ''; // no stamp: the year alone, never a guessed day
      var WORK = 'Chip Supply Chain: How AI Chips Are Made';
      var plain = 'Sharma, Yashvardhan. ' + (chTitle ? '“' + chTitle + '.” ' : '') + WORK + '. ' + (dayUp ? 'Updated ' + dayUp : year) + '. ' + canon + ' (accessed ' + d0 + ').';
      var rows = [['title', chTitle || WORK], ['author', 'Sharma, Yashvardhan']].concat(chTitle ? [['howpublished', WORK]] : [], [['year', year]], um ? [['month', um[2]]] : [],
        [['url', canon], ['note', (dayUp ? 'Updated ' + dayUp + '. ' : '') + 'Accessed ' + d0]]);
      var bib = '@misc{chipsupplychain' + (chTitle ? '-' + PAGE.chapter + '-' : '') + year + ',\n' + rows.map(function (r) { return '  ' + (r[0] + '            ').slice(0, 12) + ' = {' + r[1] + '}'; }).join(',\n') + '\n}';
      $$('.site-footer').forEach(function (foot) { foot.insertAdjacentHTML('beforeend', '<details class="cite"><summary>' + (chTitle ? 'How to cite this chapter' : 'How to cite') + '</summary><pre>' + esc(plain) + '</pre><pre>' + esc(bib) + '</pre></details>'); });
    }
  };

  // public surface for the module files concatenated after this one (src/modules/*.js)
  /* ---------- explainer animations (figure--anim): play while on screen, captions follow the video ---------- */
  var Anim = {
    init: function () {
      var figs = $$('.figure--anim').filter(function (f) { return !!$('video', f); }); if (!figs.length) return; // a live explainer draws itself (src/modules/live-*.js)
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
        // under reduced motion the poster is the last frame (the whole picture), so the last step is the one marked and captioned
        if (reduced) { stage.setAttribute('aria-label', 'Play the animation'); fig.classList.add('is-paused'); show(btns.length - 1); }
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
    scrollToEl: scrollToEl, landAt: landAt, headerH: headerH, page: PAGE, addr: addr, go: go, need: need,
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

/* module: figsteps.js */
try {
/* Figures that step (figure() and build/figsteps.js draw them; the owner's approved mockups 2 and 7 of 29 Oct 2026): 16.2,
   China's memory in Ascend packages, and 13.2, one GPU's scale-up and scale-out links. Each step brings in its bars on the
   figure's one scale, and the chapter's own sentence for it under the chart. The figure plays its steps once, the first
   time most of it is on screen; a step button stops that and goes to its step. At rest, under reduced motion and on paper
   the figure shows its last step, as the page arrives.

   A figure that names a drawing ("draw", build/figsteps.js) gets it from DRAW below, drawn at the column's own width so its
   text stays 11.5 px or more on a phone, and redrawn when that width changes. */
(function () {
  'use strict';
  var D = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var figs = [];

  /* 13.2: the racks follow the NVL72 layout the chapter gives (18 compute trays of GPUs, nine switch trays between them, 72
     GPUs) as explainer 13.1 draws them. One GPU's two links are drawn to scale: its scale-up link nine units wide and its
     scale-out link one unit wide, the chapter's 7,200 and 800 Gb/s. Dots run along both at one speed, nine times as close
     together on the scale-up link. Step 4 sets a block of the model's layers over each rack. The count of racks in a
     cluster is not given, so two or three are drawn, with no count. */
  var KIND = []; for (var q = 0; q < 27; q++) KIND.push(q < 10 || q > 18 ? 'c' : 's');
  var DRAW = {
    'scale-up-out': function (host, uid) {
      var W = Math.round(host.clientWidth); if (!W) return false;
      var wide = W >= 520, p = wide ? 8 : 7, rw = wide ? 96 : 74, nr = wide ? 3 : 2, u = wide ? 2 : 1.6;
      var L = 30, R = 34, gap = (W - L - R - nr * rw) / (nr - 1);
      var yNet = 70, yR = 108, rh = 27 * p + 8, H = yR + rh + 30;
      var X = function (k) { return L + k * (rw + gap); };
      var tY = function (i) { return yR + 4 + i * p; };
      var th = p - 1.6, gw = (rw - 8 - 15) / 4;
      var hiT = 2, gpuY = tY(hiT) + th / 2;
      var swTop = tY(10), swBot = tY(18) + th, swMid = (swTop + swBot) / 2;
      var ar = 'sy-ar-' + uid, o = [], k;
      o.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="presentation" focusable="false">');
      o.push('<defs><marker id="' + ar + '" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="sy-hold"></path></marker></defs>');
      // the model's blocks of layers (step 4), one over each rack: four layers drawn as rules, the block's name over them
      var names = nr === 3 ? ['First layers', 'Next layers', 'Last layers'] : ['First layers', 'Next layers'];
      o.push('<g class="sy-fade" data-from="4">');
      for (k = 0; k < nr; k++) {
        var bx = X(k) - 4, bw = rw + 8;
        o.push('<text class="sy-blk-t" x="' + (bx + bw / 2) + '" y="12">' + names[k] + '</text>');
        for (var ly = 0; ly < 4; ly++) o.push('<rect class="sy-layer" x="' + (bx + 6) + '" y="' + (19 + ly * 5) + '" width="' + (bw - 12) + '" height="2.6"></rect>');
        o.push('<path class="sy-drop" d="M' + (X(k) + rw / 2) + ' 40 V' + (yR - 4) + '" marker-end="url(#' + ar + ')"></path>');
      }
      o.push('<text class="sy-lab m" x="' + (X(nr - 1) + rw + 10) + '" y="30">…</text>');
      o.push('</g>');
      // the scale-out network along the top, and each rack's GPU link to it (step 3)
      o.push('<g class="sy-fade" data-from="3">');
      o.push('<path class="sy-net" stroke-width="' + u + '" d="M' + (X(0) - 12) + ' ' + yNet + ' H' + (W - 14) + '"></path>');
      o.push('<text class="sy-lab k" x="' + (X(0) + rw / 2 + 8) + '" y="' + (yNet - 9) + '">Scale-out, between racks</text>');
      for (k = 0; k < nr; k++) o.push('<path class="sy-out' + (k ? ' ctx' : '') + '" stroke-width="' + u + '" d="M' + X(k) + ' ' + gpuY + ' H' + (X(k) - 12) + ' V' + yNet + '"></path>');
      o.push('<text class="sy-lab m" x="' + (W - 12) + '" y="' + (yNet + 4) + '">…</text>');
      // dots one unit apart in time on the scale-out path: from the lit GPU up, across and down into the next rack
      var outPath = 'M' + X(0) + ' ' + gpuY + ' H' + (X(0) - 12) + ' V' + yNet + ' H' + (X(1) - 12) + ' V' + gpuY + ' H' + X(1);
      o.push('<path class="sy-flow out" stroke-width="4.6" stroke-dasharray="0.01 108" d="' + outPath + '"></path>');
      o.push('</g>');
      // the racks: the first from step 1, the others from step 3
      for (k = 0; k < nr; k++) {
        var x = X(k);
        o.push('<g class="sy-fade" data-from="' + (k ? 3 : 1) + '">');
        o.push('<rect class="sy-frame" x="' + x + '" y="' + yR + '" width="' + rw + '" height="' + rh + '"></rect>');
        for (var i = 0; i < KIND.length; i++) {
          var y = tY(i);
          if (KIND[i] === 'c') {
            o.push('<rect class="sy-ctray" x="' + (x + 4) + '" y="' + y + '" width="' + (rw - 8) + '" height="' + th + '"></rect>');
            for (var j = 0; j < 4; j++) {
              var lit = k === 0 && i === hiT && j === 3;
              o.push('<rect class="sy-gpu' + (lit ? ' lit' : '') + '" x="' + (x + 7 + j * (gw + 3)).toFixed(1) + '" y="' + (y + 1.2) + '" width="' + gw.toFixed(1) + '" height="' + (th - 2.4) + '"></rect>');
            }
          } else {
            o.push('<rect class="sy-stray" x="' + (x + 4) + '" y="' + y + '" width="' + (rw - 8) + '" height="' + th + '"></rect>');
            for (var px = x + 9; px < x + rw - 9; px += 6) o.push('<rect class="sy-port" x="' + px + '" y="' + (y + 1.6) + '" width="2.6" height="' + (th - 3.2) + '"></rect>');
          }
        }
        o.push('<text class="sy-lab' + (k ? ' m' : ' k') + '" x="' + (x + rw / 2) + '" y="' + (yR + rh + 18) + '" text-anchor="middle">' + (k ? 'Rack' : 'One rack, 72 GPUs') + '</text>');
        o.push('</g>');
      }
      // the tray names beside the first rack (step 1 only)
      var lx = X(0) + rw + 12;
      o.push('<g class="sy-fade" data-only="1">');
      o.push('<path class="sy-drop" d="M' + (X(0) + rw + 2) + ' ' + tY(0) + ' h6 V' + (tY(9) + th) + ' h-6"></path>');
      o.push('<text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(4) + 4) + '">Compute</text><text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(4) + 19) + '">trays</text>');
      o.push('<path class="sy-drop" d="M' + (X(0) + rw + 2) + ' ' + swTop + ' h6 V' + swBot + ' h-6"></path>');
      o.push('<text class="sy-lab" x="' + (lx + 2) + '" y="' + (swMid - 3) + '">Switch</text><text class="sy-lab" x="' + (lx + 2) + '" y="' + (swMid + 12) + '">trays</text>');
      o.push('<path class="sy-drop" d="M' + (X(0) + rw + 2) + ' ' + tY(19) + ' h6 V' + (tY(26) + th) + ' h-6"></path>');
      o.push('<text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(22) + 4) + '">Compute</text><text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(22) + 19) + '">trays</text>');
      o.push('</g>');
      // each rack's GPU link to its switch trays, nine units wide (step 2 for the first rack, step 3 for the rest)
      var ox = 9 * u / 2 + 6;
      for (k = 0; k < nr; k++) {
        var xr = X(k) + rw, upD = 'M' + (xr - 4) + ' ' + gpuY + ' H' + (xr + ox) + ' V' + swMid + ' H' + (xr - 4);
        o.push('<g class="sy-fade" data-from="' + (k ? 3 : 2) + '">');
        o.push('<path class="sy-up' + (k ? ' ctx' : '') + '" stroke-width="' + (9 * u) + '" d="' + upD + '"></path>');
        if (!k) o.push('<path class="sy-flow up" stroke-width="3.2" stroke-dasharray="0.01 12" d="' + upD + '"></path>');
        o.push('</g>');
      }
      // the scale-up label in the gap after the first rack
      var sx = X(0) + rw + ox + 9 * u / 2 + 8;
      o.push('<g class="sy-fade" data-from="2">');
      o.push('<text class="sy-lab w" x="' + sx + '" y="' + (swMid - 4) + '">Scale-up</text>');
      o.push('<text class="sy-lab" x="' + sx + '" y="' + (swMid + 11) + '">inside the</text><text class="sy-lab" x="' + sx + '" y="' + (swMid + 26) + '">rack</text>');
      o.push('</g>');
      o.push('</svg>');
      host.innerHTML = o.join('');
      return true;
    }
  };
  // what each step shows of a drawing: a part from its step on (data-from), or at that step only (data-only); the lit GPU
  // while its links are named (steps 2 and 3), the racks held at step 4, and the dots moving unless motion is reduced
  function paint(host, step, last) {
    [].forEach.call(host.querySelectorAll('.sy-fade'), function (g) {
      var from = +g.getAttribute('data-from') || 0, only = +g.getAttribute('data-only') || 0;
      g.classList.toggle('off', only ? step !== only : step < from);
    });
    [].forEach.call(host.querySelectorAll('.sy-gpu.lit'), function (r) { r.classList.toggle('on', step >= 2 && step < last); });
    [].forEach.call(host.querySelectorAll('.sy-frame'), function (r) { r.classList.toggle('held', step === last); });
    [].forEach.call(host.querySelectorAll('.sy-flow'), function (f) { f.classList.toggle('go', !reduce && !host.hasAttribute('data-still')); });
  }

  function setup(fig, n) {
    if (fig._sf) return; fig._sf = true;
    var btns = [].slice.call(fig.querySelectorAll('.sf-steps button'));
    var last = btns.length; if (!last) return;
    var rows = [].slice.call(fig.querySelectorAll('.hbars .hb[data-step]'));
    var cap = fig.querySelector('.sf-cap'), host = fig.querySelector('.sf-draw');
    var draw = host ? DRAW[host.getAttribute('data-draw')] : null, uid = (fig.id || 'f') + '-' + n;
    var step = last, timer = null, played = false, lastW = 0;
    var caps = btns.map(function (b) { return b.getAttribute('data-cap') || ''; });
    function render() { if (!draw) return; var w = Math.round(host.clientWidth); if (w && draw(host, uid)) { lastW = w; paint(host, step, last); } }
    function go(s) {
      step = s; fig.setAttribute('data-step', s);
      btns.forEach(function (b) { if (+b.getAttribute('data-step') === s) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      rows.forEach(function (r) { var k = +r.getAttribute('data-step'); r.classList.toggle('is-off', k > s); r.classList.toggle('is-new', k === s && s < last); });
      if (cap) cap.textContent = caps[s - 1];
      if (draw && host.firstChild) paint(host, s, last);
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function play() {
      var s = 1; go(1);
      (function next() { timer = setTimeout(function () { s += 1; if (s <= last) { go(s); next(); } else timer = null; }, draw ? 3600 : 3200); })();
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { stop(); played = true; go(+b.getAttribute('data-step')); }); });
    render(); go(last);
    // redrawn when the column's width changes on screen; on paper the screen's drawing is scaled to the page, as it stands
    var paper = window.matchMedia ? matchMedia('print') : { matches: false };
    if (draw && 'ResizeObserver' in window) new ResizeObserver(function () { if (Math.round(host.clientWidth) !== lastW && !paper.matches && !D.documentElement.classList.contains('cp-print')) render(); }).observe(host);
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.45 && !played && !D.documentElement.classList.contains('cp-print')) { played = true; play(); io.disconnect(); } });
      }, { threshold: [0, 0.45, 1] });
      io.observe(fig);
    }
    figs.push({ rest: function () { stop(); played = true; if (host) host.setAttribute('data-still', ''); go(last); } });
  }
  // at rest for paper: the browser's own print, and build/pdf.py, whose CP_PRINT.prepare() marks the page cp-print before
  // Paged.js copies it
  function rest() { figs.forEach(function (f) { f.rest(); }); }
  window.addEventListener('beforeprint', rest);
  if (window.matchMedia) { var mq = matchMedia('print'); if (mq.addEventListener) mq.addEventListener('change', function (e) { if (e.matches) rest(); }); }
  if ('MutationObserver' in window) new MutationObserver(function () { if (D.documentElement.classList.contains('cp-print')) rest(); }).observe(D.documentElement, { attributes: true, attributeFilter: ['class'] });

  function all() { [].forEach.call(D.querySelectorAll('.figure--steps'), setup); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', all); else all();
})();

} catch (e) { console.warn('module figsteps.js failed', e); }

/* module: live-saqp.js */
try {
/* Figure 04.2, "How several passes turn one line into four" (owner approved the mockup on 29 Oct 2026, its latest version).
   A live explainer in the grammar of animations/litho.html (film, light, mask and wafer colors; stepped scenes; one drawing
   that changes in place), with every label in HTML text. build/build.js draws the figure's shell from content/04 (the step
   names and captions, the print still and the note); this module draws into its stage, .anim-stage[data-live="saqp"].
   - The goal first: the line pattern the chip needs is a dashed ghost from the first frame, in both lanes.
   - The limit: a bracket over two printed lines ("the closest spacing one deep ultraviolet exposure prints") and, at Four
     lines, one over two final lines ("a quarter of that spacing"). No pitch is printed, as the chapter gives none.
   - Every change morphs in place: the mask comes down and light falls through it, the film develops into cores, a film coats
     everything, etches back to the side walls, the cores fade, and the spacers serve as the next cores.
   - One color per generation: printed cores amber, first spacers slate (still slate as cores), final lines teal, and wine only
     on the four final lines that came from the middle printed line.
   - A slim EUV lane under it: one exposure prints the same final pattern at once, in step with the main lane. Its mask is a
     mirror (chapter 4), so no mask is drawn there, and the light arrives patterned, labeled as reflected off a mirror mask.
   - Step tiles pile up under the DUV lane, one tile under the EUV lane, and no total line, as no source gives one.
   - The cut: its own mask comes down over the lines, and the line it removes (a teal one, so the middle four stay four) lights
     up, then goes.
   Facts, all from chapter 4 and the glossary's "multipatterning". Geometry: final lines and gaps are 1 unit wide, so the
   printed core is 3 wide on an 8-unit spacing, as SAQP needs.
   Motion: it plays while on screen and loops; a click on the drawing pauses it, a step plays from there. Under reduced motion
   it opens paused on the whole picture (the last step), as the videos do. Paper takes media/saqp-print-end.jpg. */
(function () {
  'use strict';
  var T0 = [0.4, 5.0, 7.6, 10.2, 12.8, 20.4];   // when each step starts, in seconds
  var END = 26.0, LOOP = 28.6;
  // the step tiles: kind (x exposure, d deposition, e etch), the film a deposition lays down, and when it lands
  var DUV = [['x', 0, 2.0], ['d', 1, 5.3], ['e', 0, 7.9], ['e', 0, 10.5], ['d', 2, 14.0], ['e', 0, 15.7], ['e', 0, 17.3], ['x', 0, 22.0], ['e', 0, 23.6]];
  var EUV = [['x', 0, 2.0]];

  var clamp = function (v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.max(a, Math.min(b, v)); };
  var ease = function (p) { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var mix = function (a, b, p) { return a + (b - a) * p; };
  var seg = function (t, a, b) { return ease((t - a) / (b - a)); };
  var hex = function (h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  var mixc = function (a, b, p) { var x = hex(a), y = hex(b); return 'rgb(' + x.map(function (v, i) { return Math.round(mix(v, y[i], clamp(p))); }).join(',') + ')'; };
  var dark = function () { return document.documentElement.getAttribute('data-theme') === 'dark'; };
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

  // ---- geometry, in units (a final line is 1 wide); x runs from -10 to 10 in both lanes
  var X0 = -10, X1 = 10;
  var LANE = {
    duv: { top: 3.2, base: 5.8, slab: 6.8, h: 6.8, m0: 0.85, m1: 1.25 },   // headroom for the mask, light and brackets
    euv: { top: 1.9, base: 4.5, slab: 5.1, h: 5.1, m0: 0.35, m1: 0.65 },   // slim: the same lines, less headroom, and no mask drawn
  };
  var CORES = [-8, 0, 8];
  var coreR = CORES.map(function (c) { return [c - 1.5, c + 1.5]; });
  var sp1R = []; CORES.forEach(function (c) { sp1R.push([c - 2.5, c - 1.5], [c + 1.5, c + 2.5]); });
  var sp2R = []; sp1R.forEach(function (m) { sp2R.push([m[0] - 1, m[0]], [m[1], m[1] + 1]); });
  var CUT = 9;                 // the line the later exposure breaks: a teal one, [6.5, 7.5], so the middle four stay four
  var MINE = [4, 5, 6, 7];     // the middle core's four lines: the only wine
  var TARGET = sp2R.filter(function (r, i) { return i !== CUT; });   // the pattern the chip needs, gap included
  var GAPS = [[X0 - 1, -9.5], [-6.5, -1.5], [1.5, 6.5], [9.5, X1 + 1]];
  var CUTOPEN = [6.15, 7.85];
  // the open parts of a mask whose dark parts are the given intervals
  function opens(dark) { var o = [], x = X0 - 1; dark.slice().sort(function (a, b) { return a[0] - b[0]; }).forEach(function (r) { if (r[0] > x) o.push([x, r[0]]); x = Math.max(x, r[1]); }); if (x < X1 + 1) o.push([x, X1 + 1]); return o; }
  var EUVOPEN = opens(TARGET);

  // a film laid evenly over standing lines d thick, then etched straight down by e: columns of [x0, x1, top, bottom]
  function film(mandrels, d, e, L) {
    var xs = [X0 - 1, X1 + 1];
    mandrels.forEach(function (m) { xs.push(m[0], m[1], m[0] - d, m[1] + d); });
    xs.sort(function (a, b) { return a - b; });
    var cols = [];
    for (var i = 0; i + 1 < xs.length; i++) {
      var a = xs[i], b = xs[i + 1]; if (b - a < 1e-6) continue;
      var m = (a + b) / 2;
      var inM = mandrels.some(function (r) { return m > r[0] && m < r[1]; }), inD = mandrels.some(function (r) { return m > r[0] - d && m < r[1] + d; });
      var bot = inM ? L.top : L.base, top = (inD ? L.top - d : L.base - d) + e;
      if (top < bot - 1e-4) cols.push([a, b, top, bot]);
    }
    return cols;
  }
  // the film, light and wafer colors of animations/litho.html, per theme
  function palette() {
    return dark()
      ? { si: '#343b45', film: '#c98f2e', lit: '#efdcae', sp1: '#7d8ea3', sp2: '#5fa3a4', wine: '#a8414b', mask: '#59626e', violet: '150,132,255', violetInk: '#a99cff', ghost: 'rgba(232,231,227,0.55)', dim: 'rgba(232,231,227,0.75)' }
      : { si: '#2c323b', film: '#c98f2e', lit: '#efdcae', sp1: '#8a9bb0', sp2: '#4f8a8b', wine: '#7a1f2b', mask: '#2b323c', violet: '112,92,220', violetInk: '#5a4bb0', ghost: 'rgba(23,23,22,0.5)', dim: 'rgba(69,68,63,0.9)' };
  }
  // step 1 in either lane: the film rises, the mask comes down, light falls through it, the wash clears what it lit
  function printPhase(t) {
    var coat = seg(t, 0.5, 1.1), drop = seg(t, 1.0, 1.8), lift = seg(t, 3.6, 4.2);
    var on = seg(t, 1.9, 2.1) * (1 - seg(t, 2.8, 3.0)), lit = seg(t, 2.1, 2.7), wash = seg(t, 3.0, 3.7);
    return { coat: coat, on: on, lit: lit, wash: wash, drop: drop * (1 - lift), maskA: clamp(drop * 1.4) * (1 - lift) };
  }

  var GLYPH = {
    x: '<path d="M6 3.5v6.5M10 3.5v6.5M14 3.5v6.5M4.5 13.5h11"/><path d="M4.5 16h11"/>',
    d: '<path d="M3.5 16h13M5 16v-4h3V7.5h4V12h3v4"/>',
    e: '<path d="M3.5 16h13M10 13V4.5M7 7.5l3-3 3 3"/>',
  };
  var KIND = { x: 'var(--sq-violet)', e: 'var(--sq-etch)', d1: 'var(--sq-dep)', d2: 'var(--sq-gen2)' };
  function tileHtml(d, row, i) {
    var k = d[0] === 'd' ? KIND['d' + d[1]] : KIND[d[0]];
    return '<li class="sq-tile off" data-row="' + row + '" data-i="' + i + '" style="--k:' + k + '"><svg viewBox="0 0 20 20" aria-hidden="true">' + GLYPH[d[0]] + '</svg></li>';
  }
  function legendTile(kind, k) { return '<span class="sq-tile sq-tile-s" style="--k:' + k + '"><svg viewBox="0 0 20 20" aria-hidden="true">' + GLYPH[kind] + '</svg></span>'; }

  var ALL = {};
  function mount(stage) {
    var fig = stage.closest('.figure'); if (!fig || stage._live) return;
    stage._live = true;
    fig.classList.add('figure--live', 'lv-saqp');
    var btns = Array.prototype.slice.call(fig.querySelectorAll('.anim-steps button'));
    var caps = Array.prototype.map.call(fig.querySelectorAll('.anim-transcript li'), function (li) { return li.textContent.replace(/^[^.]*\.\s*/, ''); });
    var n = Math.min(btns.length, T0.length), capEl = fig.querySelector('.anim-cap');
    var C = palette(), lanes = {}, labs = {}, tiles = [], t = 0, playing = false, user = false, cur = -1, last = 0, inView = false, timer = 0;

    var ghostKey = '<span class="sq-ghostkey"><svg viewBox="0 0 12 16" aria-hidden="true"><rect x="1" y="1" width="10" height="14"/></svg>The lines the chip needs</span>';
    var screen = document.createElement('div');
    screen.className = 'lv-screen';
    screen.innerHTML =
      '<p class="sq-lane-k"><span>Deep ultraviolet immersion scanner, 193 nm light</span>' + ghostKey + '</p>' +
      '<div class="lv-draw sq-draw" data-lane="duv"><canvas aria-hidden="true"></canvas>' +
        '<span class="lv-lab" data-l="mask">Mask</span><span class="lv-lab sq-onfilm" data-l="core">Core</span>' +
        '<span class="lv-lab lead" data-l="spacer">Spacer</span><span class="lv-lab sq-onwafer" data-l="wafer">Wafer</span><span class="lv-lab lead" data-l="cut">Cut</span>' +
        '<span class="lv-lab sq-dim" data-l="b1">The closest spacing one deep ultraviolet exposure prints</span><span class="lv-lab sq-dim" data-l="b2">A quarter of that spacing</span></div>' +
      '<ol class="sq-tiles" aria-hidden="true">' + DUV.map(function (d, i) { return tileHtml(d, 0, i); }).join('') + '</ol>' +
      '<p class="sq-lane-k sq-lane-euv"><span>Extreme ultraviolet scanner, 13.5 nm light</span></p>' +
      '<div class="lv-draw sq-draw sq-draw-euv" data-lane="euv"><canvas aria-hidden="true"></canvas><span class="lv-lab sq-dim sq-reflect" data-l="reflect">Light reflected off a mirror mask</span></div>' +
      '<ol class="sq-tiles" aria-hidden="true">' + EUV.map(function (d, i) { return tileHtml(d, 1, i); }).join('') + '</ol>' +
      '<p class="sq-legend" aria-hidden="true"><span>' + legendTile('x', KIND.x) + 'Exposure</span><span>' + legendTile('d', KIND.d1) + 'Deposition</span><span>' + legendTile('e', KIND.e) + 'Etch</span></p>';
    stage.insertBefore(screen, stage.firstChild);
    screen.querySelectorAll('.sq-draw').forEach(function (d) { var cv = d.querySelector('canvas'); lanes[d.getAttribute('data-lane')] = { cv: cv, ctx: cv.getContext('2d'), w: 0, K: 1 }; });
    screen.querySelectorAll('.lv-lab').forEach(function (el) { labs[el.getAttribute('data-l')] = el; });
    tiles = Array.prototype.map.call(screen.querySelectorAll('.sq-tiles .sq-tile'), function (el) { var row = +el.getAttribute('data-row'), i = +el.getAttribute('data-i'); return { el: el, at: (row ? EUV : DUV)[i][2] }; });

    function painter(lane) {
      var o = lanes[lane], L = LANE[lane], ctx = o.ctx, K = o.K;
      var px = function (x) { return (x - X0) * K; }, py = function (y) { return y * K; };
      return {
        L: L, ctx: ctx, K: K, px: px, py: py,
        rect: function (x0, x1, y0, y1, col, a) {
          if (y1 - y0 <= 0 || x1 - x0 <= 0 || a === 0) return;
          ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col; ctx.fillRect(px(x0), py(y0), (x1 - x0) * K, (y1 - y0) * K); ctx.globalAlpha = 1;
        },
        beam: function (x0, x1, y0, y1, a) {
          if (a <= 0 || y1 <= y0) return;
          var g = ctx.createLinearGradient(0, py(y0), 0, py(y1));
          g.addColorStop(0, 'rgba(' + C.violet + ',' + (0.22 * a) + ')'); g.addColorStop(1, 'rgba(' + C.violet + ',' + (0.45 * a) + ')');
          ctx.fillStyle = g; ctx.fillRect(px(x0), py(y0), (x1 - x0) * K, (y1 - y0) * K);
        },
        // a mask: a dark bar with the given openings, lowered into place by drop (0 = up and out of sight, 1 = in place)
        mask: function (open, drop, a) {
          if (a <= 0) return;
          var y0 = mix(-L.m1 - 0.2, L.m0, drop), y1 = y0 + (L.m1 - L.m0);
          ctx.globalAlpha = a; ctx.fillStyle = C.mask;
          var x = X0 - 1; open.forEach(function (r) { if (r[0] > x) ctx.fillRect(px(x), py(y0), (r[0] - x) * K, (y1 - y0) * K); x = r[1]; });
          if (x < X1 + 1) ctx.fillRect(px(x), py(y0), (X1 + 1 - x) * K, (y1 - y0) * K);
          ctx.globalAlpha = 1;
        },
        ghost: function (list) {
          ctx.save(); ctx.strokeStyle = C.ghost; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
          list.forEach(function (r) { ctx.strokeRect(Math.round(px(r[0])) + 0.5, Math.round(py(L.top)) + 0.5, Math.round((r[1] - r[0]) * K) - 1, Math.round((L.base - L.top) * K) - 1); });
          ctx.restore();
        },
        bracket: function (xa, xb, a) {
          if (a <= 0) return;
          var y = py(L.top - 0.42), yt = py(L.top - 0.08);
          ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.dim; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(px(xa), yt); ctx.lineTo(px(xa), y); ctx.lineTo(px(xb), y); ctx.lineTo(px(xb), yt); ctx.stroke(); ctx.restore();
        },
      };
    }
    function clear(lane) { var o = lanes[lane]; o.ctx.setTransform(1, 0, 0, 1, 0, 0); o.ctx.clearRect(0, 0, o.cv.width, o.cv.height); var dpr = o.cv.width / o.w; o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }

    function render(t) {
      if (!lanes.duv.w) return;
      // ======== the deep ultraviolet lane ========
      clear('duv'); var P = painter('duv'), L = P.L;
      P.rect(X0 - 1, X1 + 1, L.base, L.slab, C.si);
      var p1 = printPhase(t), top1 = mix(L.base, L.top, p1.coat), coreGone = seg(t, 10.5, 11.7);
      if (p1.coat > 0) {
        if (p1.wash <= 0) P.rect(X0 - 1, X1 + 1, top1, L.base, C.film);
        coreR.forEach(function (r) { P.rect(r[0], r[1], top1, L.base, C.film, 1 - coreGone); });
        if (p1.lit > 0 && p1.wash < 1) GAPS.forEach(function (g) { P.rect(g[0], g[1], mix(top1, L.base, p1.wash), L.base, mixc(C.film, C.lit, p1.lit)); });
      }
      // 2 and 3: a film over everything, then etched straight down to the side walls
      var d1 = seg(t, 5.3, 6.9), e1 = seg(t, 7.9, 9.4), s1Gone = seg(t, 17.3, 18.4);
      if (d1 > 0 && e1 < 1) film(coreR, d1, e1 * d1, L).forEach(function (c) { P.rect(c[0], c[1], c[2], c[3], C.sp1); });
      else if (e1 >= 1) sp1R.forEach(function (r) { P.rect(r[0], r[1], L.top, L.base, C.sp1, 1 - s1Gone); });
      // 6, under the lines: the cut's film
      var rcoat = seg(t, 20.6, 21.3), rlit = seg(t, 22.2, 22.8), rwash = seg(t, 23.0, 23.4), strip = seg(t, 24.6, 25.2), RT = mix(L.base, L.top - 0.5, rcoat);
      if (rcoat > 0 && strip < 1) {
        P.rect(X0 - 1, CUTOPEN[0], RT, L.base, C.film, 1 - strip); P.rect(CUTOPEN[1], X1 + 1, RT, L.base, C.film, 1 - strip);
        P.rect(CUTOPEN[0], CUTOPEN[1], mix(RT, L.base, rwash), L.base, mixc(C.film, C.lit, rlit), 1 - strip);
      }
      // 5: the same again on the spacers, now the cores; the final lines, and wine on the middle four
      var d2 = seg(t, 14.0, 15.4), e2 = seg(t, 15.7, 17.0), wine = seg(t, 18.5, 19.2), cutGone = seg(t, 23.6, 24.4), hl = seg(t, 22.3, 22.8) * (1 - cutGone);
      if (d2 > 0 && e2 < 1) film(sp1R, d2, e2 * d2, L).forEach(function (c) { P.rect(c[0], c[1], c[2], c[3], C.sp2); });
      else if (e2 >= 1) sp2R.forEach(function (r, i) { P.rect(r[0], r[1], L.top, L.base, MINE.indexOf(i) >= 0 ? mixc(C.sp2, C.wine, wine) : C.sp2, i === CUT ? 1 - cutGone : 1); });
      // the line the cut removes, lit up before it goes
      if (hl > 0) { var r = sp2R[CUT]; P.rect(r[0], r[1], L.top, L.base, 'rgb(' + C.violet + ')', 0.35 * hl); P.ctx.save(); P.ctx.globalAlpha = hl; P.ctx.strokeStyle = C.violetInk; P.ctx.lineWidth = 2; P.ctx.strokeRect(P.px(r[0]) - 1, P.py(L.top) - 1, (r[1] - r[0]) * P.K + 2, (L.base - L.top) * P.K + 1); P.ctx.restore(); }
      // masks and light: step 1, then the cut's own mask
      var cdrop = seg(t, 21.2, 21.9) * (1 - seg(t, 23.2, 23.8)), con = seg(t, 22.0, 22.2) * (1 - seg(t, 22.8, 23.0));
      P.mask(GAPS, p1.drop, p1.maskA);
      if (p1.on > 0) { P.beam(X0 - 1, X1 + 1, 0, L.m0, p1.on * 0.6); GAPS.forEach(function (g) { P.beam(g[0], g[1], L.m1, top1, p1.on); }); }
      P.mask([CUTOPEN], cdrop, clamp(cdrop * 1.4));
      if (con > 0) { P.beam(X0 - 1, X1 + 1, 0, L.m0, con * 0.6); P.beam(CUTOPEN[0], CUTOPEN[1], L.m1, RT, con); }
      // the goal, from the first frame; the two brackets
      P.ghost(TARGET);
      var b1 = seg(t, 4.2, 4.6) * (1 - seg(t, 5.4, 5.8)), b2 = seg(t, 19.2, 19.6) * (1 - seg(t, 20.4, 20.8));
      P.bracket(0, 8, b1); P.bracket(-3, -1, b2);

      // ======== the extreme ultraviolet lane: one exposure prints the final pattern ========
      clear('euv'); var E = painter('euv'), LE = E.L, q = printPhase(t), topE = mix(LE.base, LE.top, q.coat);
      E.rect(X0 - 1, X1 + 1, LE.base, LE.slab, C.si);
      if (q.coat > 0) {
        if (q.wash <= 0) E.rect(X0 - 1, X1 + 1, topE, LE.base, C.film);
        TARGET.forEach(function (r) { E.rect(r[0], r[1], topE, LE.base, C.film); });
        if (q.lit > 0 && q.wash < 1) EUVOPEN.forEach(function (g) { E.rect(g[0], g[1], mix(topE, LE.base, q.wash), LE.base, mixc(C.film, C.lit, q.lit)); });
      }
      // an EUV mask is a mirror: the light arrives already patterned, from above, with no mask in its path
      if (q.on > 0) EUVOPEN.forEach(function (g) { E.beam(g[0], g[1], 0, topE, q.on); });
      E.ghost(TARGET);

      // ======== labels, tiles, step marker ========
      var vis = {
        mask: Math.max(p1.maskA, clamp(cdrop * 1.4)) > 0.6 ? 1 : 0,
        core: clamp((t - 3.8) / 0.4) * (1 - clamp((t - 10.5) / 0.4)),
        spacer: clamp((t - 9.2) / 0.4) * (1 - clamp((t - 14.0) / 0.4)),
        wafer: 1, cut: clamp((t - 25.0) / 0.4), b1: b1, b2: b2, reflect: clamp((t - 1.7) / 0.3) * (1 - clamp((t - 3.2) / 0.3)),
      };
      Object.keys(vis).forEach(function (k) { labs[k].style.opacity = vis[k].toFixed(2); });
      var sp = t >= 12.9 ? 'Spacer, now a core' : 'Spacer';
      if (labs.spacer.textContent !== sp) labs.spacer.textContent = sp;
      tiles.forEach(function (tk) { tk.el.classList.toggle('off', t < tk.at); });
      var i = 0; for (var j = 0; j < n; j++) if (t >= T0[j] - 0.05) i = j;
      show(i);
    }
    function place(el, lane, x, y, how) {
      var L = LANE[lane];
      el.style.left = ((x - X0) / (X1 - X0) * 100) + '%'; el.style.top = (y / L.h * 100) + '%';
      el.style.transform = how === 'l' ? 'translate(0, -50%)' : how === 'r' ? 'translate(-100%, -50%)' : how === 'rb' ? 'translate(-100%, -100%)' : how === 'b' ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)';
    }
    function show(i) {
      if (i === cur) return; cur = i;
      btns.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      if (capEl && caps[i]) capEl.textContent = caps[i];
    }
    function size() {
      var w = lanes.duv.cv.parentNode.clientWidth; if (!w) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      ['duv', 'euv'].forEach(function (k) {
        var o = lanes[k], L = LANE[k]; o.w = w; o.K = w / (X1 - X0);
        o.cv.width = Math.round(w * dpr); o.cv.height = Math.round(w * L.h / (X1 - X0) * dpr); o.cv.style.height = (w * L.h / (X1 - X0)) + 'px';
      });
      var K = lanes.duv.K, L = LANE.duv;
      labs.spacer.style.setProperty('--lead', Math.max(5, 0.45 * K) + 'px');
      labs.cut.style.setProperty('--lead', Math.max(8, (L.base - 0.4 - (L.top - 0.5)) * K) + 'px');
      render(Math.min(t, END));
    }
    function frame(now) {
      if (!playing) return;
      t += Math.min(0.1, (now - last) / 1000); last = now;
      if (t >= LOOP) t = 0;
      render(Math.min(t, END));
      timer = requestAnimationFrame(frame);
    }
    function play() { if (playing) return; playing = true; fig.classList.remove('is-paused'); last = performance.now(); timer = requestAnimationFrame(frame); stage.setAttribute('aria-label', 'Pause the animation'); }
    function pause() { playing = false; cancelAnimationFrame(timer); fig.classList.add('is-paused'); stage.setAttribute('aria-label', 'Play the animation'); }

    var L = LANE.duv;
    place(labs.mask, 'duv', 9.8, L.m0 - 0.08, 'rb'); place(labs.core, 'duv', 0, (L.top + L.base) / 2, 'c');
    place(labs.spacer, 'duv', -2, L.top - 0.55, 'b'); place(labs.wafer, 'duv', 9.75, (L.base + L.slab) / 2, 'r'); place(labs.cut, 'duv', 7, L.top - 0.5, 'b'); place(labs.reflect, 'euv', -9.8, 0.5, 'l');
    place(labs.b1, 'duv', 4, L.top - 0.55, 'b'); place(labs.b2, 'duv', -2, L.top - 0.55, 'b');
    var toggle = function () { user = playing; if (playing) pause(); else play(); };
    stage.addEventListener('click', toggle);
    stage.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    // a step is a request to watch from there: it plays at once, even after a pause (as the videos' steps do)
    btns.forEach(function (b, i) { b.addEventListener('click', function () { if (i >= n) return; t = T0[i] + 0.05; user = false; render(t); play(); }); });
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(lanes.duv.cv.parentNode); else window.addEventListener('resize', size);
    new MutationObserver(function () { C = palette(); render(Math.min(t, END)); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // under reduced motion it opens on the whole picture, paused, and plays only when asked; otherwise it plays while on screen
    if (reduced()) { t = END; render(t); pause(); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en.forEach(function (x) { inView = x.isIntersecting; if (inView && !user) play(); else if (!inView && playing) { pause(); fig.classList.remove('is-paused'); } }); }, { threshold: 0.3 }).observe(stage);
    } else play();
    // for the checks (qa/redesign/check-explain.js) and the print still (qa/redesign/live-stills.js)
    ALL[fig.id] = { seek: function (s) { t = s; pause(); render(Math.min(t, END)); }, play: play, pause: pause, end: END, t0: T0.slice(0, n), time: function () { return t; } };
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('.anim-stage[data-live="saqp"]'), mount); }
  window.CP_LIVE = window.CP_LIVE || {};
  window.CP_LIVE.saqp = ALL;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

} catch (e) { console.warn('module live-saqp.js failed', e); }

/* module: live-yield.js */
try {
/* Figure 07.1, "Why big chips lose more to defects", driven live by its own model (owner approved the mockup on 29 Oct 2026).
   build/build.js draws the figure's shell from content/07 (today's four steps and their captions, the print still and the
   note); this module draws the wafer and the model's output into its stage, .anim-stage[data-live="yield"], and puts two
   sliders under it.
   The model is the one animations/defects.html rendered for today's video, run in the page: die yield = (1 + D0 x A / a)^-a
   with a = 3 (Parhami, Dependable Computing, ch. 5, Example 5.2, the source chapter 7 cites), on the textbook's wafer: 70 mm in
   radius, holding 120 dies of 1 x 1 cm or 26 of 2 x 2 cm. The four steps are today's four, with today's captions, and they set
   the sliders. The sliders then drive the model: chip size from 1 cm up to the 26 by 33 mm patch one exposure prints
   (chapter 4), and defects from 0.1 to 1.0 per square cm.
   What it prints is only what the model computes for the setting, under "The model's output" (the owner approved these as
   the one place a number is computed on screen): the share of flawless 1 cm chips, of the chosen chips, and the cost of a
   good chosen chip against a good 1 cm chip, (dies of 1 cm x their share) / (chosen dies x their share), with the shares as
   shown, to a tenth of a percent. At 0.8 and 2 cm that gives back the chapter's 49.2, 11.3 and 20.1.
   The wafer: the specks are today's (the same random draw, seed 131, the first 123 of them at 0.8), cleared off the lines
   between chips; where the draw would leave more or fewer flawless chips than the formula's share allows, the fewest specks
   move to a neighboring chip until the count matches. Other sizes fill the wafer with whole chips on a grid laid from the
   1 cm grid's lines, the layout that fits the most (which gives the textbook's 120 and 26). qa/redesign/sweep-yield.js checks
   every setting. Paper takes media/yield-print-end.jpg, the site's inputs. */
(function () {
  'use strict';
  // ---------------- the model ----------------
  var rng = function (seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  var RAD = 70, CL = 3, SEED = 131, EDGE = 1.25, KEEP = 2.2;
  var AREA_CM2 = Math.PI * Math.pow(RAD / 10, 2), MAXSPECK = Math.round(1.0 * AREA_CM2);
  function clustered(r, N) {
    var sp = [];
    while (sp.length < N) {
      var cx, cy; do { cx = (r() * 2 - 1) * RAD; cy = (r() * 2 - 1) * RAD; } while (Math.hypot(cx, cy) > RAD);
      var k = 1 + Math.floor(r() * 8);
      for (var j = 0; j < k && sp.length < N; j++) {
        var ang = r() * 6.283, rad = 9 * Math.sqrt(-2 * Math.log(1 - r() * 0.999));
        var x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
        if (Math.hypot(x, y) < RAD) sp.push({ x: x, y: y, t: r() });
      }
    }
    return sp;
  }
  var POOL = null;
  var pool = function () { return POOL || (POOL = clustered(rng(SEED), MAXSPECK)); };
  var sizeOf = function (v) { return v <= 26 ? [v, v] : [26, v]; };
  function gridAt(w, h, ox, oy) {
    var out = [], n = Math.ceil(RAD / Math.min(w, h)) + 2;
    for (var j = -n; j <= n; j++) for (var i = -n; i <= n; i++) {
      var x = ox + i * w, y = oy + j * h;
      if (Math.max(Math.hypot(x, y), Math.hypot(x + w, y), Math.hypot(x, y + h), Math.hypot(x + w, y + h)) <= RAD) out.push({ x: x, y: y, w: w, h: h });
    }
    return out;
  }
  var offs = function (w) { var s = []; for (var k = 0; k < 40; k++) { var v = (k * 10) % w; if (s.indexOf(v) < 0) s.push(v); } return s.map(function (v) { return -v; }); };
  var GRIDS = {};
  function layout(v) {
    if (GRIDS[v]) return GRIDS[v];
    var wh = sizeOf(v), w = wh[0], h = wh[1], best = null;
    offs(h).forEach(function (oy) { offs(w).forEach(function (ox) { var g = gridAt(w, h, ox, oy); if (!best || g.length > best.dies.length) best = { w: w, h: h, ox: ox, oy: oy, dies: g }; }); });
    return (GRIDS[v] = best);
  }
  var yieldOf = function (areaCm2, d0) { return Math.pow(1 + d0 * areaCm2 / CL, -CL); };
  var r3 = function (y) { return Math.round(y * 1000) / 1000; };
  function readouts(v, d0) {
    var L = layout(v), ref = layout(10);
    var y1 = r3(yieldOf(1, d0)), y = r3(yieldOf(L.w * L.h / 100, d0));
    return { y1: y1, y: y, cost: (ref.dies.length * y1) / (L.dies.length * y), n: L.dies.length, good: Math.round(y * L.dies.length) };
  }
  var inDie = function (s, d) { return s.x >= d.x && s.x < d.x + d.w && s.y >= d.y && s.y < d.y + d.h; };
  var dieOf = function (s, dies) { for (var i = 0; i < dies.length; i++) if (inDie(s, dies[i])) return i; return -1; };
  var clampIn = function (s, d, m) { return { x: Math.min(Math.max(s.x, d.x + m), d.x + d.w - m), y: Math.min(Math.max(s.y, d.y + m), d.y + d.h - m) }; };
  var distTo = function (s, d) { return Math.hypot(Math.max(d.x - s.x, 0, s.x - (d.x + d.w)), Math.max(d.y - s.y, 0, s.y - (d.y + d.h))); };
  var cdist = function (a, b) { return Math.hypot(a.x + a.w / 2 - b.x - b.w / 2, a.y + a.h / 2 - b.y - b.h / 2); };
  var CACHE = {};
  function wafer(v, d0) {
    var key = v + '|' + d0; if (CACHE[key]) return CACHE[key];
    var L = layout(v), dies = L.dies, n = Math.round(d0 * AREA_CM2);
    var sp = pool().slice(0, n).map(function (s) { return { x: s.x, y: s.y, t: s.t }; });
    var off = function (val, o, step) { var g = o + Math.round((val - o) / step) * step, e = val - g; return Math.abs(e) >= EDGE ? val : g + (e < 0 ? -EDGE : EDGE); };
    sp.forEach(function (s) { var x = off(s.x, L.ox, L.w), y = off(s.y, L.oy, L.h); if (Math.hypot(x, y) < RAD - 0.5) { s.x = x; s.y = y; } });
    var target = dies.length - readouts(v, d0).good;
    for (var it = 0; it < 400; it++) {
      var where = sp.map(function (s) { return dieOf(s, dies); }), count = dies.map(function () { return 0; });
      where.forEach(function (i) { if (i >= 0) count[i]++; });
      var dead = count.filter(function (c) { return c > 0; }).length;
      if (dead === target) break;
      if (dead > target) {   // a chip too many is hit: its specks join the nearest hit chip
        var pick = -1, pd = 1e9;
        dies.forEach(function (d, i) { if (!count[i]) return; var near = 1e9; dies.forEach(function (e, j) { if (j !== i && count[j]) near = Math.min(near, cdist(d, e)); }); var sc = count[i] * 1000 + near; if (sc < pd) { pd = sc; pick = i; } });
        var to = -1, td = 1e9; dies.forEach(function (e, j) { if (j !== pick && count[j]) { var c = cdist(dies[pick], e); if (c < td) { td = c; to = j; } } });
        if (to < 0) break;
        sp.forEach(function (s, k) { if (where[k] === pick) { var q = clampIn(s, dies[to], EDGE); s.x = q.x; s.y = q.y; } });
      } else {                // a chip too few is hit: the nearest spare speck moves onto the nearest clean chip
        var best = null;
        sp.forEach(function (s, k) { var i = where[k]; if (i >= 0 && count[i] < 2) return; dies.forEach(function (d, j) { if (count[j]) return; var dd = distTo(s, d); if (!best || dd < best.dd) best = { k: k, j: j, dd: dd }; }); });
        if (!best) break;
        var q2 = clampIn(sp[best.k], dies[best.j], EDGE); sp[best.k].x = q2.x; sp[best.k].y = q2.y;
      }
    }
    var wh = sp.map(function (s) { return dieOf(s, dies); }), hit = dies.map(function () { return false; });
    wh.forEach(function (i) { if (i >= 0) hit[i] = true; });
    sp.forEach(function (s, k) {
      var i = wh[k];
      if (i >= 0) { var q = clampIn(s, dies[i], EDGE); s.x = q.x; s.y = q.y; return; }
      dies.forEach(function (d, j) {   // a stray speck keeps clear of a clean chip, so none seems to sit on one
        if (hit[j] || distTo(s, d) >= KEEP) return;
        var ox = s.x < d.x ? d.x - s.x : s.x - (d.x + d.w), oy = s.y < d.y ? d.y - s.y : s.y - (d.y + d.h);
        var x = ox >= oy ? (s.x < d.x ? d.x - KEEP : d.x + d.w + KEEP) : s.x, y = ox >= oy ? s.y : (s.y < d.y ? d.y - KEEP : d.y + d.h + KEEP);
        if (Math.hypot(x, y) < RAD - 0.8 && dieOf({ x: x, y: y }, dies) < 0) { s.x = x; s.y = y; }
      });
    });
    return (CACHE[key] = { L: L, sp: sp, hit: dies.map(function (d) { return sp.some(function (s) { return inDie(s, d); }); }) });
  }

  // ---------------- the figure ----------------
  var SIZE = [10, 10, 20, 20];   // the chip size each of today's four steps sets, in mm (the density is the textbook's 0.8)
  var FREE = 'The formula’s output for the chip size and density of specks set below, on the textbook example’s wafer.';
  var clamp = function (v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.max(a, Math.min(b, v)); };
  var ease = function (p) { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var easeOut = function (p) { return 1 - Math.pow(1 - clamp(p), 3); };
  var mix = function (a, b, p) { return a + (b - a) * p; };
  var dark = function () { return document.documentElement.getAttribute('data-theme') === 'dark'; };
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var dims = function (v) { var wh = sizeOf(v); return wh[0] + ' × ' + wh[1] + ' mm'; };
  var pct = function (y) { return (y * 100).toFixed(1); };
  var times = function (c) { return c < 100 ? c.toFixed(1) : String(Math.round(c)); };
  var dstr = function (d) { var s = String(Math.round(d * 100) / 100); return s === '1' ? '1.0' : s; };

  var ALL = {};
  function mount(stage) {
    var fig = stage.closest('.figure'); if (!fig || stage._live) return;
    stage._live = true;
    fig.classList.add('figure--live', 'lv-yield');
    var btns = Array.prototype.slice.call(fig.querySelectorAll('.anim-steps button'));
    var caps = Array.prototype.map.call(fig.querySelectorAll('.anim-transcript li'), function (li) { return li.textContent.replace(/^[^.]*\.\s*/, ''); });
    var nSteps = Math.min(btns.length, SIZE.length), capEl = fig.querySelector('.anim-cap'), uid = fig.id || 'yd';
    var cv, ctx, rows, outs = {}, inputs = {}, cssW = 0;
    var state = { v: 20, d0: 0.8, step: nSteps - 1 };
    // what the drawing shows: a view, tweened between steps
    var view = { speck: 1, draw: 1, fill: 1, keep: 1, prev: null, prevA: 0, move: 1, rows: [1, 1, 1], on: 1 };
    var anim = null, chain = [], touched = false;

    var row = function (unit) { return '<div class="yd-row"><span class="yd-num"></span><span class="yd-unit">' + unit + '</span><span class="yd-name"></span></div>'; };
    var tick = function (p, html, cls) { return '<span class="yd-tick' + (cls ? ' ' + cls : '') + '" style="left:' + (p * 100).toFixed(2) + '%">' + html + '</span>'; };
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="yd-wafer lv-screen"><canvas role="img" aria-label="A simulated wafer of chips, with the specks that land on it and the chips they spoil"></canvas></div>' +
      '<div class="yd-read lv-screen" aria-live="polite"><p class="yd-k">The model’s output</p>' + row('percent flawless') + row('percent flawless') + row('times the cost') + '</div>';
    while (wrap.firstChild) stage.insertBefore(wrap.firstChild, stage.querySelector('.anim-print'));
    var ctls = document.createElement('div');
    ctls.className = 'yd-ctls lv-screen';
    ctls.innerHTML =
      '<div class="yd-ctl"><label class="yd-ctl-h" for="' + uid + '-v"><span class="yd-ctl-k">Chip size</span><output id="' + uid + '-vo" for="' + uid + '-v"></output></label>' +
        '<div class="yd-track"><input id="' + uid + '-v" type="range" min="10" max="33" step="1" value="20"></div>' +
        '<div class="yd-ticks" aria-hidden="true">' + tick(0, '1 cm', 'start') + tick(10 / 23, '2 cm') + tick(1, '26 × 33 mm<small>the most one exposure prints</small>', 'end') + '</div></div>' +
      '<div class="yd-ctl"><label class="yd-ctl-h" for="' + uid + '-d"><span class="yd-ctl-k">Defects per square centimeter</span><output id="' + uid + '-do" for="' + uid + '-d"></output></label>' +
        '<div class="yd-track"><input id="' + uid + '-d" type="range" min="0.1" max="1" step="0.05" value="0.8"></div>' +
        '<div class="yd-ticks" aria-hidden="true">' + tick(0, '0.1', 'start') + tick(0.7 / 0.9, '0.8<small>textbook example</small>') + tick(1, '1.0', 'end') + '</div></div>';
    stage.parentNode.insertBefore(ctls, stage.nextSibling);
    cv = stage.querySelector('.yd-wafer canvas'); ctx = cv.getContext('2d');
    rows = Array.prototype.slice.call(stage.querySelectorAll('.yd-row'));
    inputs.v = ctls.querySelector('input[min="10"]'); inputs.d = ctls.querySelector('input[min="0.1"]'); outs.v = ctls.querySelectorAll('output')[0]; outs.d = ctls.querySelectorAll('output')[1];

    function readout() {
      var R = readouts(state.v, state.d0);
      var vals = [[pct(R.y1), 'Small chips, 1 × 1 cm'], [pct(R.y), 'Chips, ' + dims(state.v)], [times(R.cost), 'Per good chip, against 1 × 1 cm']];
      rows.forEach(function (r, i) {
        r.querySelector('.yd-num').textContent = vals[i][0];
        r.querySelector('.yd-name').textContent = vals[i][1];
        r.classList.toggle('off', view.rows[i] < 0.5);
        r.classList.toggle('on', view.on === i);
      });
      outs.v.textContent = dims(state.v); outs.d.textContent = dstr(state.d0);
      inputs.v.value = state.v; inputs.d.value = state.d0;
      inputs.v.setAttribute('aria-valuetext', sizeOf(state.v).join(' by ') + ' millimeters');
      inputs.d.setAttribute('aria-valuetext', dstr(state.d0) + ' defects per square centimeter');
    }
    function marks(i) {
      btns.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      if (capEl) capEl.textContent = i >= 0 ? (caps[i] || '') : FREE;
    }

    // ---- drawing, ported from animations/defects.html
    function draw() {
      if (!ctx || !cssW) return;
      var dk = dark(), dpr = cv.width / cssW;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var C = cssW / 2, K = (cssW / 2 - 2) / RAD, px = function (x) { return C + x * K; };
      var g = ctx.createLinearGradient(px(-RAD), px(-RAD), px(RAD), px(RAD));
      var st = dk ? ['#8d959f', '#737c87', '#a2a9b2', '#666f7a'] : ['#d9dde2', '#c2c8cf', '#e4e7eb', '#b3bac2'];
      g.addColorStop(0, st[0]); g.addColorStop(0.45, st[1]); g.addColorStop(0.55, st[2]); g.addColorStop(1, st[3]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C, C, RAD * K, 0, 7); ctx.fill();
      ctx.strokeStyle = dk ? 'rgba(236,233,226,0.35)' : 'rgba(20,24,31,0.5)'; ctx.lineWidth = 1; ctx.stroke();
      var cur = wafer(state.v, state.d0);
      function dies(W, drawP, fillP, alpha, keep) {
        if (alpha <= 0) return;
        ctx.save(); ctx.globalAlpha = alpha;
        W.L.dies.forEach(function (d, i) {
          var order = (d.y + RAD) / (2 * RAD), a = clamp((drawP - order * 0.7) / 0.3); if (a <= 0) return;
          var f = clamp((fillP - order * 0.6) / 0.4), dead = W.hit[i];
          if (f > 0) { ctx.fillStyle = dead ? 'rgba(122,31,43,' + ((dk ? 0.8 : 0.62) * f * a) + ')' : 'rgba(255,255,255,' + ((dk ? 0.2 : 0.32) * f * a) + ')'; ctx.fillRect(px(d.x), px(d.y), d.w * K, d.h * K); }
          ctx.strokeStyle = dk ? 'rgba(20,23,28,' + (0.55 * a) + ')' : 'rgba(20,24,31,' + (0.4 * a) + ')'; ctx.lineWidth = 0.8;
          ctx.strokeRect(px(d.x) + 0.4, px(d.y) + 0.4, d.w * K - 0.8, d.h * K - 0.8);
        });
        // the chips that came out flawless are the ones that pay for the wafer
        if (keep > 0) {
          var n = 0;
          W.L.dies.forEach(function (d, i) {
            if (W.hit[i]) return;
            var a = ease((keep * 2 - n++ * 0.12) / 0.35); if (a <= 0) return;
            ctx.save(); ctx.globalAlpha = alpha * Math.min(1, a);
            ctx.fillStyle = dk ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.6)'; ctx.fillRect(px(d.x), px(d.y), d.w * K, d.h * K);
            ctx.strokeStyle = dk ? '#ece9e2' : '#14181f'; ctx.lineWidth = 2; ctx.strokeRect(px(d.x) + 1, px(d.y) + 1, d.w * K - 2, d.h * K - 2);
            ctx.restore();
          });
        }
        ctx.restore();
      }
      if (view.prev) dies(view.prev, 1, 1, view.prevA, 0);
      dies(cur, view.draw, view.fill, 1, view.keep);
      var from = view.prev ? view.prev.sp : null;
      cur.sp.forEach(function (s, i) {
        var a = clamp((view.speck - s.t * 0.8) / 0.2); if (a <= 0) return;
        var x = s.x, y = s.y;
        if (from && from[i] && view.move < 1) { x = mix(from[i].x, s.x, ease(view.move)); y = mix(from[i].y, s.y, ease(view.move)); }
        var r = mix(2.9, 1.0, easeOut(a)) * K;
        ctx.fillStyle = dk ? 'rgba(20,23,28,' + a + ')' : 'rgba(20,24,31,' + (0.92 * a) + ')';
        ctx.beginPath(); ctx.arc(px(x), px(y), r, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(247,246,242,' + (0.9 * a) + ')'; ctx.lineWidth = 1; ctx.stroke();
      });
    }

    // ---- steps: each sets the sliders to the chapter's inputs and plays its own change
    function tween(dur, fn, done) {
      if (anim) cancelAnimationFrame(anim.raf);
      if (reduced()) { anim = null; fn(1); draw(); readout(); if (done) done(); return; }
      var t0 = performance.now();
      anim = { raf: 0 };
      var step = function (now) { var p = clamp((now - t0) / (dur * 1000)); fn(p); draw(); readout(); if (p < 1) anim.raf = requestAnimationFrame(step); else { anim = null; if (done) done(); } };
      anim.raf = requestAnimationFrame(step);
    }
    function settle(i) {   // the state a step ends in, with no motion
      state.v = SIZE[i]; state.d0 = 0.8; state.step = i;
      view = { speck: 1, draw: i >= 1 ? 1 : 0, fill: i >= 1 ? 1 : 0, keep: i >= 3 ? 1 : 0, prev: null, prevA: 0, move: 1, rows: [i >= 1 ? 1 : 0, i >= 2 ? 1 : 0, i >= 3 ? 1 : 0], on: i - 1 };
    }
    function go(i, done) {
      if (i > 0) settle(i - 1);
      state.v = SIZE[i]; state.d0 = 0.8; state.step = i; marks(i);
      if (i === 0) { view = { speck: 0, draw: 0, fill: 0, keep: 0, prev: null, prevA: 0, move: 1, rows: [0, 0, 0], on: -1 }; tween(2.6, function (p) { view.speck = p * 1.05; }, done); }
      else if (i === 1) tween(2.0, function (p) { view.draw = ease(p * 1.6); view.fill = ease((p - 0.35) / 0.55); view.rows[0] = p > 0.75 ? 1 : 0; view.on = 0; }, done);
      else if (i === 2) {
        view.prev = wafer(10, 0.8); view.draw = 0; view.fill = 0; view.move = 0;
        tween(2.4, function (p) { view.prevA = 1 - ease(p / 0.3); view.move = clamp(p / 0.3); view.draw = ease((p - 0.15) * 1.6); view.fill = ease((p - 0.45) / 0.45); view.rows[1] = p > 0.8 ? 1 : 0; view.on = 1; if (p >= 1) view.prev = null; }, done);
      } else tween(1.8, function (p) { view.keep = p; view.rows[2] = p > 0.25 ? 1 : 0; view.on = 2; }, done);
    }
    var stop = function () { chain.forEach(clearTimeout); chain = []; touched = true; };
    function free() {   // a slider moved: the model's output for the reader's setting, drawn at once
      if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
      stop();
      state.step = -1; marks(-1);
      view = { speck: 1.05, draw: 1, fill: 1, keep: 1, prev: null, prevA: 0, move: 1, rows: [1, 1, 1], on: 1 };
      draw(); readout();
    }
    function autoplay() {   // the first time it comes on screen it plays the four steps once, then waits for the reader
      if (touched || reduced()) return;
      touched = true;
      var at = 0;[0, 1, 2, 3].forEach(function (i) { chain.push(setTimeout(function () { go(i); }, at)); at += [3200, 3600, 3800][i] || 0; });
    }

    inputs.v.addEventListener('input', function () { state.v = +inputs.v.value; free(); });
    inputs.d.addEventListener('input', function () { state.d0 = Math.round(+inputs.d.value * 100) / 100; free(); });
    btns.forEach(function (b, i) { b.addEventListener('click', function () { if (i >= nSteps) return; stop(); go(i); }); });
    var size = function () {
      var w = cv.parentNode.clientWidth; if (!w) return; cssW = w;
      var dpr = Math.min(window.devicePixelRatio || 1, 3); cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr); draw();
    };
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv.parentNode); else window.addEventListener('resize', size);
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // before it plays, and under reduced motion, it shows the last step: the whole picture, at the chapter's inputs
    settle(nSteps - 1); marks(nSteps - 1); readout(); size();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) autoplay(); }); }, { threshold: 0.45 }).observe(stage);
    // for the checks (qa/redesign/check-explain.js, sweep-yield.js) and the print still (qa/redesign/live-stills.js)
    ALL[fig.id] = {
      set: function (v, d0) { stop(); state.v = v; state.d0 = d0; free(); return readouts(v, d0); },
      step: function (i) { stop(); settle(i); marks(i); draw(); readout(); },
    };
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('.anim-stage[data-live="yield"]'), mount); }
  window.CP_LIVE = window.CP_LIVE || {};
  window.CP_LIVE.yield = { figs: ALL, readouts: readouts, wafer: wafer, layout: layout };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

} catch (e) { console.warn('module live-yield.js failed', e); }

/* module: lookup.js */
try {
/* The Glossary (#/glossary), search first, with what it holds under the field: "Kinds and letters", the owner's choice of
   30 Oct 2026 (the mockup and its notes are qa/excellence/glossary-alt/sf-kinds/ and searchfirst/ in the main checkout; the
   entry and its passages are the code Index and entry had, unchanged).
   Three states share one field (#gl-view[data-state]). At rest: the name, the field, Random entry, then the kinds with their
   counts and the letters, which build/build.js writes from the data, each opening Browse A to Z. Typing drops suggestions
   inside the field's edge: the names that match first, then "In the text", as many as the window holds and then "Show all N
   matches"; with no match, "Did you mean" and every place the site uses the words. An entry: the field moves into a slim bar
   under the masthead and the entry reads in one centered column, its kind, name and other names, what it is, the reason, the
   chapters it is read in, a firm's, chip's or country's facts, every place the site uses it, and Previous and Next. Browse A
   to Z: every name under its letter, with the kinds and a strip of letters.
   The address names what is shown: #gl-<slug> for a term (what the chapters' pop-ups and the site search link to),
   #lk-firm-, #lk-chip- and #lk-country- for the rest, and #lk-term-<slug> also opens a term; #a-z the index, #a-z/terms
   (firms, ai-chips, countries) the index of one kind and #a-z/b the index at a letter; #/glossary the first screen. A move
   within the Glossary makes a history entry, so Back returns to the index at its place, or to the first screen. The rows come
   with glossary.js (build/build.js) when the Glossary first opens (load): each row's li carries the entry's lk- id and its
   search data, and a term's link its gl- id. The firms, chips and countries are read from DATA; the passages from the
   chapters' paragraphs (glossary.js), the Export Controls entries, the board, AI Chips and the supplier list. */
(function () {
  var CP = window.CP; if (!CP) return;
  var $ = CP.$, $$ = CP.$$, esc = CP.esc, DATA = CP.DATA || {}, cname = CP.cname;
  var root = document.documentElement;
  var MQ = window.matchMedia ? matchMedia('(max-width: 879px)') : null;
  var narrow = function () { return MQ ? MQ.matches : window.innerWidth < 880; };
  var reduce = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var here = function () { return !!CP.Router && CP.Router.current === 'glossary'; };
  var KIND = { term: 'Term', firm: 'Firm', chip: 'AI chip', country: 'Country' };
  // each kind: its key, its button in the index, its plural and its singular for the count line
  var KINDS = [['all', 'All', 'entries', 'entry'], ['term', 'Terms', 'terms', 'term'], ['firm', 'Firms', 'firms', 'firm'], ['chip', 'AI chips', 'AI chips', 'AI chip'], ['country', 'Countries', 'countries', 'country']];
  var LETTERS = ['0-9'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  var showL = function (l) { return l === '0-9' ? '0–9' : l; };
  var DEFAULT = 'lk-term-chip'; // "chip": the word every chapter uses, defined from nothing, and never linked from another entry
  // an AI chip's facts in words, as AI Chips sets them: "2024-04" reads April 2024, "2024-Q4" Q4 2024; the node alone where it
  // already names the foundry ("TSMC 5 nm", not "TSMC TSMC 5 nm")
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var when = function (s) { s = String(s || ''); var m = /^(\d{4})-(\d{2})$/.exec(s); if (m) return MONTHS[+m[2] - 1] + ' ' + m[1]; m = /^(\d{4})-Q(\d)$/.exec(s); return m ? 'Q' + m[2] + ' ' + m[1] : s; };
  var nf = function (v) { var p = String(v).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); };
  var madeBy = function (p) { return p.foundry && p.node && p.node.indexOf(p.foundry + ' ') === 0 ? [p.node] : [p.foundry, p.node]; };
  var chHref = function (id) { return CP.addr(id === 'geopolitics' ? '#/geopolitics' : '#' + id); }; // each chapter's own page
  var focusEl = function (el) { if (!el) return; try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } };
  var jump = function (y) { var prev = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; window.scrollTo(0, Math.max(0, Math.round(y))); root.style.scrollBehavior = prev; }; // html glides; these are jumps

  var L = { built: false, items: [], byId: {}, byKey: {}, cur: null, paras: null, state: 'home', kind: 'all' };
  var TERMS = {}, sup = {}, chip = {}, co = {}, chs = {}, azRow = {}, groupEl = {}, counts = {}, XL = null, az = [];
  var view, main, head, field, box, inp, sugg, paneEl, browseEl, lettersEl, countEl;

  /* ---------- the entries ---------- */
  function init() {
    if (L.built) return;
    var list = $('#lk-items'); if (!list) return;
    var G = window.CP_GLOSSARY || {};
    if (!list.children.length) list.innerHTML = G.items || '';
    if (!list.children.length) return;
    L.built = true;
    TERMS = G.terms || {};
    (DATA.suppliers || []).forEach(function (r) { sup[r.name] = r; });
    (DATA.landscape || []).forEach(function (c) { chip[c.id] = c; });
    (DATA.countries || []).forEach(function (c) { co[c.code] = c; });
    (DATA.chapters || []).forEach(function (c) { chs[c.id] = c; });
    view = $('.view[data-view="glossary"]'); main = $('#gl-view'); head = $('#gl-head'); field = $('#gl-field'); box = $('#gl-box'); inp = $('#gl-search'); sugg = $('#gl-sugg');
    paneEl = $('#gl-pane'); browseEl = $('#gl-browse'); lettersEl = $('#gl-jump'); countEl = $('#gl-count');
    L.state = main.getAttribute('data-state') || 'home';
    L.items = $$('#lk-items .gl-r').map(function (li, i) {
      var a = li.firstElementChild;
      var it = { id: li.id, kind: li.getAttribute('data-kind'), key: li.getAttribute('data-key') || '', name: a.textContent, label: li.getAttribute('data-label') || '',
        alias: li.getAttribute('data-alias') || '', text: li.getAttribute('data-text') || '', order: i, row: a, L: li.parentNode.parentNode.getAttribute('data-l') };
      a.setAttribute('data-id', it.id);
      it.lname = it.name.toLowerCase(); it.al = it.alias.toLowerCase().split('|').filter(Boolean);
      if (it.kind === 'term') { var t = TERMS[it.key] || [it.name, '', '', '', '', '']; it.t = { term: t[0], aka: t[1], plain: t[2], why: t[3], ch: t[4], chTitle: t[5] }; it.title = t[0]; }
      else it.title = it.name;
      it.data = it.kind === 'firm' ? sup[it.key] : it.kind === 'chip' ? chip[it.key] : it.kind === 'country' ? co[it.key] : null;
      azRow[it.id] = a; L.byId[it.id] = it; L.byKey[it.key] = it;
      return it;
    });
    az = L.items; // the rows come A to Z, 0–9 first (build/build.js)
    counts = { all: L.items.length, term: 0, firm: 0, chip: 0, country: 0 };
    L.items.forEach(function (it) { counts[it.kind]++; });
    $$('#lk-items > .gl-g').forEach(function (g) { groupEl[g.getAttribute('data-l')] = g; });
    wire();
    setKind('all');
    view.setAttribute('data-gl', 'ready');
  }
  var fromHash = function () {
    var h = (location.hash || '').replace(/^#/, ''); try { h = decodeURIComponent(h); } catch (e) { }
    if (/^gl-/.test(h)) return L.byKey[h] || null;
    if (/^lk-/.test(h)) return L.byId[h] || null;
    return null;
  };
  var anchorOf = function (it) { return it.kind === 'term' ? it.key : it.id; };
  var say = function (s) { var e = $('#gl-say'); if (!e) return; e.textContent = ''; setTimeout(function () { e.textContent = s; }, 30); };

  /* ---------- an entry ---------- */
  /* the other entries named in an entry's own text link to them, the first time each is named and three to a paragraph at
     most: terms by their names and other names, firms by theirs, countries by name. "chip" is left alone, since nearly every
     entry uses the word. The words are unchanged */
  function xlinks() {
    if (XL) return XL;
    var map = {}, rank = { term: 0, firm: 1, country: 2 };
    var add = function (p, it) { p = String(p || '').trim(); if (p.length < 2) return; var k = p.toLowerCase(), o = map[k]; if (o && rank[o.it.kind] <= rank[it.kind]) return; map[k] = { it: it, p: p }; };
    L.items.forEach(function (it) {
      if (it.kind === 'chip' || it.id === DEFAULT) return;
      add(it.title, it);
      if (it.kind !== 'country') it.alias.split('|').forEach(function (a) { if (a && !/^for example/i.test(a)) add(a, it); });
    });
    var frag = Object.keys(map).map(function (k) { return map[k].p; }).sort(function (a, b) { return b.length - a.length; }).map(function (p) {
      var e = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (p.length > 4 && /^[A-Za-z]/.test(p)) e = '[' + p.charAt(0).toLowerCase() + p.charAt(0).toUpperCase() + ']' + e.slice(1);
      return e;
    });
    // a name stands alone: no letter or digit on either side (the one before is matched and kept, since not every browser looks behind)
    return (XL = { map: map, re: new RegExp('(^|[^A-Za-z0-9])(' + frag.join('|') + ')(?![A-Za-z0-9])', 'g') });
  }
  function xl(text, used) {
    var X = xlinks(), s = String(text || ''), out = '', last = 0, m, n = 0; X.re.lastIndex = 0;
    while (n < 3 && (m = X.re.exec(s))) {
      var at = m.index + m[1].length, word = m[2], hit = X.map[word.toLowerCase()];
      if (!hit || used[hit.it.id]) { X.re.lastIndex = at + word.length; continue; }
      used[hit.it.id] = 1; n++;
      out += esc(s.slice(last, at)) + '<a class="gl-x" href="#' + esc(anchorOf(hit.it)) + '" data-id="' + esc(hit.it.id) + '">' + esc(word) + '</a>';
      last = at + word.length;
    }
    return out + esc(s.slice(last));
  }

  /* the chapters a term is read in, as the static page lists them (build/modules/reference-pages.js writes DATA.glossaryRefs):
     its own chapter first, then the others that use it; a term most chapters use names four of them, and the rest wait */
  function readsHTML(it) {
    var R = (DATA.glossaryRefs || {})[it.key], home = null, also = [];
    if (R) { home = R[0] ? chs[R[0]] || null : null; also = (R[1] || []).map(function (id) { return chs[id]; }).filter(Boolean); }
    if (!home && it.t.ch) home = chs[it.t.ch] || { id: it.t.ch, title: it.t.chTitle };
    if (!home && !also.length) return '';
    var a = function (c) { return '<a href="' + esc(chHref(c.id)) + '">' + esc(c.title) + '</a>'; };
    return '<p class="gl-reads">' + (home ? '<span class="gl-rr"><span class="k">Read it in</span>' + a(home) + '</span>' : '') +
      (also.length ? '<span class="gl-rr gl-also"><span class="k">' + (home ? 'Also in' : 'In') + '</span>' + also.slice(0, also.length > 5 ? 4 : 5).map(a).join(', ') +
        (also.length > 5 ? '<span class="gl-rest" hidden>, ' + also.slice(4).map(a).join(', ') + '</span> <button type="button" class="gl-tbtn" data-rest>and ' + (also.length - 4) + ' more</button>' : '') + '</span>' : '') + '</p>';
  }

  function termHTML(it, used) {
    var t = it.t;
    return '<p class="label gl-kind">' + esc(it.label) + '</p><h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(t.term) + '</h2>' +
      (t.aka ? '<p class="gl-names">' + esc(t.aka) + '</p>' : '') + '<p class="gl-def">' + xl(t.plain, used) + '</p>' +
      (t.why ? '<p class="gl-p">' + xl(t.why, used) + '</p>' : '') + readsHTML(it);
  }

  var facts = function (rows) { return rows.length ? '<dl class="gl-facts">' + rows.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + (f[2] ? f[1] : esc(f[1])) + '</dd>'; }).join('') + '</dl>' : ''; };

  /* a firm: the Suppliers row's facts, its revenue as filed and linked to the filing, and the share of it from China with the
     firm's small China chart, as the Suppliers panel draws it (Suppliers.revenueHTML and exMini in src/app.js) */
  function firmHTML(it, used) {
    var r = it.data || {}, rows = [], S = CP.Suppliers || {};
    var where = [r.city, cname(r.country)].filter(Boolean).join(', ');
    if (r.chokepoint) rows.push(['Chokepoint level', '<span class="gl-chk gl-chk--' + esc(String(r.chokepoint).toLowerCase()) + '">' + esc(r.chokepoint) + '</span>', true]);
    if (where) rows.push(['Based in', where]);
    if (r.founded) rows.push(['Founded', String(r.founded)]);
    if (r.ownership || r.ticker) rows.push(['Ownership', [r.ownership, r.ticker ? 'ticker ' + r.ticker : ''].filter(Boolean).join(', ')]);
    if (r.customers && r.customers.length) rows.push(['Named customers', r.customers.join(', ')]);
    var rs = r.revenueShown, rev = rs && S.revenueHTML ? S.revenueHTML(rs) : '';
    if (rev) rows.push(['Revenue', rev, true]);
    else if (r.revenueUSDb != null) rows.push(['Revenue', '$' + (Math.round(r.revenueUSDb * 10) / 10).toLocaleString('en-US') + 'bn' + (r.revenueYear ? ', ' + r.revenueYear : '')]);
    // safeUrl escapes what it returns, so it is not escaped again
    if (r.china && r.china.href) rows.push(['From China', '<a href="' + CP.safeUrl(r.china.href) + '">' + esc(String(r.china.label).replace(/^China /, '')) + ' <span aria-hidden="true">→</span></a>' + (S.exMini ? S.exMini(r.china.href) : ''), true]);
    var meta = [r.category, r.subcategory].filter(Boolean).join(' · ');
    return '<p class="label gl-kind">Firm' + (r.country ? ' · ' + esc(cname(r.country)) : '') + '</p>' +
      '<h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(r.name || it.name) + (r.nativeName ? '<span class="gl-native">' + esc(r.nativeName) + '</span>' : '') + '</h2>' +
      (meta ? '<p class="gl-meta">' + esc(meta) + '</p>' : '') +
      (r.role ? '<p class="gl-def">' + xl(r.role, used) + '</p>' : '') +
      (r.shareNote ? '<p class="gl-p">' + xl(r.shareNote, used) + '</p>' : '') +
      (r.aiRelevance ? '<p class="gl-p">' + xl(r.aiRelevance, used) + '</p>' : '') +
      facts(rows) +
      // the filing's note (build/build.js leaves out the lines meant for the editors)
      (rev && rs.note ? '<p class="gl-note"><b>About the revenue figure.</b> ' + esc(rs.note) + '</p>' : '') +
      '<p class="gl-links"><a href="#/suppliers" data-sup="' + esc(r.name || it.name) + '">In the supplier list →</a>' + (r.source && CP.safeUrl(r.source) !== '#' ? '<a href="' + CP.safeUrl(r.source) + '" target="_blank" rel="noopener">Company page ↗</a>' : '') + '</p>';
  }

  function chipHTML(it, used) {
    var c = it.data || {}, p = c.process || {}, m = c.memory || {}, comp = c.compute || {}, rows = [];
    if (c.announced || c.shipping) rows.push(['Announced / shipping', [c.announced, c.shipping].filter(Boolean).map(when).join(' / ')]);
    if (p.node || p.foundry) rows.push(['Made by', madeBy(p).concat(p.country ? cname(p.country) : '').filter(Boolean).join(', ')]);
    if (m.type) rows.push(['Memory', [m.type, m.stacks ? m.stacks + ' stacks' : '', m.capacityGB ? m.capacityGB + ' GB' : '', m.bandwidthTBs ? m.bandwidthTBs + ' TB/s' : ''].filter(Boolean).join(', ')]);
    var fp = []; if (comp.fp16TFLOPS) fp.push('FP16 ' + comp.fp16TFLOPS.toLocaleString('en-US')); if (comp.fp8TFLOPS) fp.push('FP8 ' + comp.fp8TFLOPS.toLocaleString('en-US')); if (comp.fp4TFLOPS) fp.push('FP4 ' + comp.fp4TFLOPS.toLocaleString('en-US'));
    if (fp.length) rows.push(['Dense TFLOPS', fp.join(' · ')]);
    if (c.tdpW) rows.push(['Power', nf(c.tdpW) + ' W']);
    if (c.target) rows.push(['Built for', c.target]);
    return '<p class="label gl-kind">AI chip · ' + esc(c.vendor) + (c.vendorCountry ? ', ' + esc(cname(c.vendorCountry)) : '') + '</p>' +
      '<h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc((c.vendor || '') + ' ' + (c.name || it.name)) + '</h2>' +
      (c.status ? '<p class="gl-meta">' + esc(c.status) + '</p>' : '') +
      (c.notes ? '<p class="gl-def">' + xl(c.notes, used) + '</p>' : '') +
      (c.exportStatus ? '<p class="gl-p"><b>Export status.</b> ' + xl(c.exportStatus, used) + '</p>' : '') +
      facts(rows) + '<p class="gl-links"><a href="#/landscape?pick=' + esc(encodeURIComponent(c.id)) + '" data-chip="' + esc(c.id) + '">On AI Chips →</a></p>';
  }

  /* a country: the stages it leads, the chokepoint cards that name it, its shares, its firms. The firms whose country differs
     between the shares and the supplier list, as data/chokepoint-matrix-notes.md gives them, are named on the cards they touch */
  var SPLITS = {
    siemens: 'Siemens EDA is run from Oregon but owned by Siemens AG, so the EDA software share counts it under Germany and the supplier list under the US.',
    linde: 'Linde plc is incorporated in Ireland, with head offices in the UK and the US. The specialty gases share counts it under Germany for its roots in Linde AG, as Georgetown University\'s Emerging Technology Observatory does. The supplier list counts it under the UK.',
    arm: 'The core IP share counts Arm under the UK, where it has its headquarters, although SoftBank of Japan owns most of it.'
  };
  var SPLIT_BY = { DE: ['siemens', 'linde'], US: ['siemens'], GB: ['arm', 'linde'] };
  function countryFacts(cc) {
    var chapters = DATA.chapters || [];
    var stages = chapters.filter(function (ch) { return ch.stage; });
    var cardCount = chapters.filter(function (ch) { return ch.concentration; }).length; // only the stage chapters carry a chokepoint card
    var named = chapters.filter(function (ch) { return (ch.countries || []).some(function (x) { return x.code === cc; }); }).sort(function (a, b) { return (b.bandRank || 0) - (a.bandRank || 0) || a.number - b.number; });
    var led = stages.filter(function (ch) { var f = (ch.countries || [])[0]; return f && f.code === cc; });
    var extreme = led.filter(function (ch) { return ch.band === 'Extreme'; }).length;
    var firms = (DATA.suppliers || []).filter(function (r) { return r.country === cc; });
    var critical = firms.filter(function (r) { return r.chokepoint === 'Critical'; }).length, meta = [];
    if (led.length === 1) meta.push('leads 1 stage' + (extreme ? ', of extreme concentration' : ''));
    else if (led.length) meta.push('leads ' + led.length + ' stages' + (extreme ? ', ' + (extreme === led.length ? 'all' : extreme) + ' of them extreme' : ''));
    meta.push('named on ' + named.length + ' of ' + cardCount + ' chokepoint cards');
    if (firms.length) meta.push(firms.length + (firms.length === 1 ? ' firm' : ' firms') + ' in the supplier list' + (critical ? ', ' + critical + ' Critical' : ''));
    return { named: named, firms: firms, meta: meta.join(' · ') };
  }
  function countryHTML(it, used) {
    var c = it.data || {}, cc = c.code, F = countryFacts(cc), named = F.named, firms = F.firms;
    var num = function (v) { return Math.round(v) === v ? String(v) : String(Math.round(v * 10) / 10); };
    var segs = (DATA.matrix || []).filter(function (r) { return r.shares && r.shares[cc] != null; }).map(function (r) {
      var rank = Object.keys(r.shares).sort(function (a, b) { return r.shares[b] - r.shares[a]; }).indexOf(cc) + 1;
      var basis = r.basis === 'relayed' ? 'reported by ' + (r.relayedVia || 'a third party') : r.basis === 'derived' ? 'computed' : (r.basis || '');
      return { seg: r.segment, v: r.shares[cc], rank: rank, basis: basis, year: String(r.asOf || r.year || ''), method: r.method || '', capacity: /^capacity/i.test(r.metric || '') };
    }).sort(function (a, b) { return b.v - a.v; });
    var big = segs.filter(function (s) { return s.rank === 1 || s.v >= 1; }), small = segs.filter(function (s) { return s.rank !== 1 && s.v < 1; });
    var firmItem = {}; L.items.forEach(function (x) { if (x.kind === 'firm') firmItem[x.key] = x; });
    var cats = {}; firms.forEach(function (r) { (cats[r.category || 'Other'] = cats[r.category || 'Other'] || []).push(r); });
    var catNames = Object.keys(cats).sort(function (a, b) { return cats[b].length - cats[a].length || a.localeCompare(b); });
    var h = '<p class="label gl-kind">Country · ' + esc(cc) + '</p><h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(c.name) + '</h2>' +
      '<p class="gl-meta">' + esc(F.meta) + '</p>' + (c.role ? '<p class="gl-def">' + xl(c.role, used) + '.</p>' : '');
    if (segs.length) {
      var topV = Math.max.apply(null, big.map(function (s) { return s.v; }));
      h += '<section class="gl-part" aria-labelledby="gl-sh"><h3 class="gl-h" id="gl-sh">Share of each segment</h3><ul class="gl-shares">' + big.map(function (s) {
        var m = [s.rank === 1 ? 'largest share' : 'rank ' + s.rank, s.basis, s.year].filter(Boolean).join(' · ');
        return '<li class="gl-share' + (s.v === topV ? ' is-top' : '') + '"' + (s.method ? ' title="' + esc(s.method) + '"' : '') + '><span class="gl-share-k">' + esc(s.seg) + '</span><span class="gl-share-bar" style="--w:' + Math.min(100, s.v) + '%" aria-hidden="true"></span><span class="gl-share-v">' + num(s.v) + '%</span><span class="gl-share-m">' + esc(m) + '</span></li>';
      }).join('') + '</ul>' + (small.length ? '<p class="gl-small">Under 1%: ' + esc(small.map(function (s) { return s.seg; }).join(', ')) + '.</p>' : '') + '</section>';
    }
    if (named.length) {
      h += '<section class="gl-part" aria-labelledby="gl-cd"><h3 class="gl-h" id="gl-cd">On the chokepoint cards</h3><ul class="gl-cards">' + named.map(function (ch) {
        var note = ((ch.countries || []).filter(function (x) { return x.code === cc; })[0] || {}).note || '';
        return '<li><a href="' + esc(chHref(ch.id)) + '"><span class="gl-card-t">' + esc(ch.title) + '</span>' + (ch.band ? '<span class="gl-card-b gl-card-b--' + esc(String(ch.band).toLowerCase()) + '">' + esc(ch.band) + '</span>' : '') + (note ? '<span class="gl-card-n">' + esc(note) + '</span>' : '') + '</a></li>';
      }).join('') + '</ul></section>';
    }
    if (firms.length) {
      h += '<section class="gl-part" aria-labelledby="gl-fl"><h3 class="gl-h" id="gl-fl"><span>In the supplier list</span><span class="gl-n">' + firms.length + ' across ' + catNames.length + (catNames.length === 1 ? ' category' : ' categories') + '</span></h3><ul class="gl-cats">' + catNames.map(function (cat) {
        var rows = cats[cat], crit = rows.filter(function (r) { return r.chokepoint === 'Critical'; });
        return '<li><span>' + esc(cat) + '</span><span class="gl-cat-c">' + rows.length + '</span>' + (crit.length ? '<span class="gl-cat-f">' + crit.map(function (r) { var x = firmItem[r.name]; return x ? '<a href="#' + esc(x.id) + '" data-id="' + esc(x.id) + '">' + esc(r.name) + '</a>' : esc(r.name); }).join(' ') + '</span>' : '') + '</li>';
      }).join('') + '</ul>';
      // a member of the EU-27: the bloc's firms counted together, as the Suppliers firm list can filter them (the member list is app.js's)
      var EU27 = (CP.Suppliers && CP.Suppliers.EU27) || [];
      if (EU27.indexOf(cc) >= 0) {
        var eu = (DATA.suppliers || []).filter(function (r) { return EU27.indexOf(r.country) >= 0; }), euCrit = eu.filter(function (r) { return r.chokepoint === 'Critical'; }).length;
        h += '<p class="gl-small">Across the EU-27, the supplier list has ' + eu.length + ' firms' + (euCrit ? ', ' + euCrit + ' of them Critical' : '') + '. <a href="#/suppliers?group=eu">See them together on the Suppliers page →</a></p>';
      }
      h += '</section>';
    }
    // how the numbers give a firm its country: shares of a market's revenue go by parent company, capacity by plant, the
    // supplier list by each firm's own headquarters (data/chokepoint-matrix-notes.md, "Converting firm shares to country shares")
    if (segs.length) {
      var rev = segs.some(function (s) { return !s.capacity; }), cap = segs.some(function (s) { return s.capacity; }), note = [];
      if (rev) note.push('Country shares of a market\'s revenue count most firms under their parent company\'s home country' + (firms.length ? ', and the supplier list counts each firm under the country of its own headquarters.' : '.'));
      if (cap) note.push('Shares of manufacturing capacity count each plant under the country where it stands.');
      if (!rev && firms.length) note.push('The supplier list counts each firm under the country of its own headquarters.');
      (SPLIT_BY[cc] || []).forEach(function (k) { note.push(SPLITS[k]); });
      h += '<p class="gl-note">' + esc(note.join(' ')) + '</p>';
    }
    h += '<p class="gl-links">' + (c.panel ? '<a href="#/suppliers?country=' + esc(cc) + '">See what it makes on the Suppliers page →</a>' : '') + (firms.length ? '<a href="#/suppliers" data-supcc="' + esc(cc) + '">Its firms in the supplier list →</a>' : '') + '</p>';
    return h;
  }

  /* ---------- where the site uses it ---------- */
  /* every chapter's paragraphs and list items, as glossary.js carries them (build/build.js reads them from the chapters by
     the rules of domCorpus): each chapter has its own page since 28 Oct 2026, so the home page holds none of them. k is a
     passage's place among its chapter's, for the chapter's page to find it (flash) */
  function corpus() {
    if (L.paras) return L.paras;
    var G = window.CP_GLOSSARY && window.CP_GLOSSARY.passages; if (!G) return (L.paras = domCorpus());
    var out = [], at = {};
    G.paras.forEach(function (p) { var c = G.chapters[p[0]] || [p[0], '']; at[p[0]] = at[p[0]] || 0; out.push({ chapter: p[0], title: c[0], num: c[1], text: p[1], k: at[p[0]]++ }); });
    return (L.paras = out);
  }
  var textOf = function (node) { // like textContent, but an element boundary counts as a space
    var s = ''; for (var i = 0; i < node.childNodes.length; i++) { var n = node.childNodes[i]; if (n.nodeType === 3) s += n.nodeValue; else if (n.nodeType === 1) s += ' ' + textOf(n) + ' '; } return s;
  };
  // the passages of the chapters on this page, read from the page itself
  function domCorpus() {
    var out = [];
    $$('.view[data-view="stack"] article.chapter').forEach(function (ch) {
      var id = ch.id, title = ch.getAttribute('data-title') || id, num = ch.getAttribute('data-number') || '', k = 0;
      $$('p, li', ch).forEach(function (el) {
        // the chapter head's facts line (.ch-meta) and its citation line (.ch-cite) are not passages (correctness P1-4)
        if (el.closest('.chapter-sources, .plate-head, .ch-meta, .ch-cite, .chain, figure, .chapter-nav, nav')) return;
        // a card's marks (and the comma between two of them) are not the passage's words
        var clone = el.cloneNode(true); $$('sup.cite, sup.cite-sep, .gl-tip, .chip', clone).forEach(function (s) { s.parentNode.removeChild(s); });
        var text = textOf(clone).replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
        if (text.length > 40) out.push({ chapter: id, title: title, num: num, el: el, text: text, k: k++ });
      });
    });
    return out;
  }
  /* a passage followed from the Glossary to its chapter's page (src/app.js go, Router.after): found by its words, or else by its
     place, it lands under the masthead and flashes */
  function flash(para) {
    var mine = domCorpus().filter(function (p) { return p.chapter === para.chapter; });
    var p = mine.filter(function (x) { return x.text === para.text; })[0] || mine[para.k]; if (!p) return;
    CP.scrollToEl(p.el, false); if (CP.Router && CP.Router.settle) CP.Router.settle(p.el);
    p.el.classList.add('lk-flash'); setTimeout(function () { p.el.classList.remove('lk-flash'); }, 2600);
  }
  function regex(patterns, loose) { // loose: a typed query matches as a prefix, so "NXT:1980" finds "NXT:1980i"
    var parts = patterns.map(function (p) {
      p = String(p).trim(); if (!p) return null;
      var e = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), bounded = /^[A-Za-z0-9]/.test(p) && /[A-Za-z0-9)]$/.test(p);
      // a short name like "Arm" or "ASE" keeps its capitals, or it matches "arm" and "ease"; longer names may be written either way
      if (p.length <= 4 && /[A-Z]/.test(p) && !loose) e = e.split('').map(function (ch) { return /[a-z]/i.test(ch) ? (/[A-Z]/.test(ch) ? ch : '[' + ch + ch.toUpperCase() + ']') : ch; }).join('');
      return bounded ? '\\b' + e + (loose ? '' : '(?![A-Za-z0-9])') : e;
    }).filter(Boolean);
    if (!parts.length) return null;
    var short = patterns.some(function (p) { return String(p).trim().length <= 4 && /[A-Z]/.test(p); });
    return new RegExp(parts.join('|'), short && !loose ? 'g' : 'gi');
  }
  function sentence(text, re) {
    re.lastIndex = 0; var m = re.exec(text); if (!m) return null;
    var start = text.lastIndexOf('. ', m.index); start = start < 0 ? 0 : start + 2;
    var end = text.indexOf('. ', m.index + m[0].length); end = end < 0 ? text.length : end + 1;
    var s = text.slice(start, end).trim();
    if (s.length > 320) { var a = Math.max(0, m.index - start - 140); s = (a ? '… ' : '') + s.slice(a, a + 300).trim() + ' …'; }
    return s;
  }
  var patternsOf = function (it) { var p = it.kind === 'chip' ? [] : [it.name]; it.alias.split('|').forEach(function (a) { if (a) p.push(a); }); if (it.kind === 'chip' && !p.length) p = [it.name]; return p; };
  /* every place the site uses it, in the site's order: the chapters, the Export Controls entries, the board, AI Chips, Suppliers */
  function mentions(patterns, kind, key) {
    var re = regex(patterns, kind === 'raw'); if (!re) return [];
    var hits = [], test = function (t) { re.lastIndex = 0; return re.test(t); };
    var mark = function (s) { return esc(s).replace(re, function (x) { return '<mark>' + x + '</mark>'; }); };
    corpus().forEach(function (p, i) { var s = sentence(p.text, re); if (s) hits.push({ src: 'Chapter ' + p.num, sub: p.title, html: mark(s), href: CP.addr('#' + p.chapter), para: i }); });
    (Array.isArray(DATA.timeline) ? DATA.timeline : ((DATA.timeline || {}).events || [])).forEach(function (e) { var t = [e.gist || '', e.title || '', e.summary || ''].join(' '); if (!test(t)) return; var s = sentence(e.gist && test(e.gist) ? e.gist : (e.summary || e.title), re) || e.title; hits.push({ src: 'Export Controls', sub: e.date, html: mark(s), href: e.id ? '#/controls/' + encodeURIComponent(e.id) : '#/controls' }); }); // the entry's own address opens it
    (Array.isArray(DATA.flows) ? DATA.flows : ((DATA.flows || {}).flows || [])).forEach(function (f) { (f.states || []).forEach(function (st) { if (st.label && test(st.label)) hits.push({ src: 'Export Controls', sub: f.name, html: mark(st.label), href: st.event ? '#/controls/' + encodeURIComponent(st.event) : '#/controls' }); }); }); // a board state links to the entry that set it
    (DATA.landscape || []).forEach(function (c) { if (kind === 'chip' && c.id === key) return; var s = sentence([c.notes || '', c.exportStatus || ''].join(' '), re); if (s) hits.push({ src: 'AI Chips', sub: c.vendor + ' ' + c.name, html: mark(s), href: '#/landscape?pick=' + encodeURIComponent(c.id), chip: c.id }); });
    (DATA.suppliers || []).forEach(function (r) { if (kind === 'firm' && r.name === key) return; var s = sentence([r.role || '', r.shareNote || '', r.aiRelevance || ''].join(' '), re); if (s) hits.push({ src: 'Suppliers', sub: r.name, html: mark(s), href: '#/suppliers', sup: r.name }); });
    return hits;
  }
  var LIMIT = 6, lastHits = [];
  var rowHTML = function (h) {
    var attrs = h.para != null ? ' data-para="' + h.para + '"' : h.chip ? ' data-chip="' + esc(h.chip) + '"' : h.sup ? ' data-sup="' + esc(h.sup) + '"' : '';
    return '<li><a href="' + esc(h.href) + '"' + attrs + '><span class="gl-src"><b>' + esc(h.src) + '</b> ' + esc(h.sub) + '</span><span class="gl-txt">' + h.html + '</span></a></li>';
  };
  function passagesHTML(hits, kind) {
    lastHits = hits;
    var n = hits.length;
    var head = '<h3 class="gl-h" id="gl-wh"><span>Where it appears</span>' + (n ? '<span class="gl-n">' + n + (n === 1 ? ' place' : ' places') + '</span>' : '') + '</h3>';
    if (!n) return '<section class="gl-part" aria-labelledby="gl-wh">' + head + '<p class="gl-nil">' + (kind === 'firm' ? 'Only in the supplier list.' : kind === 'chip' ? 'Only on the AI Chips page.' : kind === 'term' ? 'Only in this entry.' : 'Nowhere else.') + '</p></section>';
    return '<section class="gl-part" aria-labelledby="gl-wh">' + head + '<ul class="gl-men">' + hits.slice(0, LIMIT).map(rowHTML).join('') + '</ul>' +
      (n > LIMIT ? '<p class="gl-more"><button type="button" data-all>Show all ' + n + '</button></p>' : '') + '</section>';
  }
  function nearest(q) { // names a typo away: an edit distance of one or two against each word of each name
    q = q.toLowerCase(); if (q.length < 4) return [];
    var dist = function (a, b) { var m = a.length, n = b.length, prev = [], cur = [], i, j; for (j = 0; j <= n; j++) prev[j] = j; for (i = 1; i <= m; i++) { cur = [i]; for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; };
    var scored = [];
    L.items.forEach(function (it) {
      var best = dist(q, it.lname);
      it.lname.split(/[\s()\-]+/).forEach(function (w) { if (w.length >= 3) best = Math.min(best, dist(q, w)); });
      if (best <= (q.length >= 8 ? 3 : 2)) scored.push({ it: it, d: best });
    });
    return scored.sort(function (a, b) { return a.d - b.d; }).slice(0, 5).map(function (x) { return x.it; });
  }

  /* ---------- the first sentence of each definition, for the suggestions ---------- */
  var defOf = function (it) { if (it.kind === 'term') return it.t.plain; var d = it.data || {}; return it.kind === 'firm' ? d.role : it.kind === 'chip' ? d.notes : d.role ? d.role + '.' : ''; };
  var ABBR = /(?:\b(?:e\.g|i\.e|Inc|Co|Corp|Ltd|No|Nos|St|vs|approx|Mr|Dr|Jr|Sr|cf|ca)|\b[A-Z])$/;
  function firstSentence(s) {
    s = String(s || '').trim(); var re = /[.!?](?=["”’)]?(?:\s+[A-Z0-9“"(]|\s*$))/g, m;
    while ((m = re.exec(s))) { if (ABBR.test(s.slice(0, m.index))) continue; return s.slice(0, m.index + 1); }
    return s;
  }
  var firstOf = function (it) { if (it.first == null) it.first = firstSentence(defOf(it)); return it.first; };

  /* ---------- the three states; the field slides from the middle to the bar ---------- */
  var mh = function () { return CP.headerH(); };
  function measure() {
    if (!L.built) return;
    root.style.setProperty('--gl-bar-h', (L.state === 'home' ? 0 : Math.round(head.getBoundingClientRect().height)) + 'px');
    root.style.setProperty('--gl-strip-h', (L.state === 'browse' && !narrow() ? Math.round(lettersEl.getBoundingClientRect().height) : 0) + 'px');
  }
  var browseY = 0;
  function setState(s, animate) {
    if (s === L.state) { measure(); return; }
    var title = $('#gl-title');
    var from = animate && L.state === 'home' && !reduce() ? [title.getBoundingClientRect(), box.getBoundingClientRect()] : null;
    L.state = s; main.setAttribute('data-state', s);
    $('.gl-az-link', head)[s === 'browse' ? 'setAttribute' : 'removeAttribute']('aria-current', 'page');
    $('#gl-btns').inert = s !== 'home'; $('#gl-hold').inert = s !== 'home';
    measure();
    if (from) { // the name and the field glide from the middle of the first screen to their places in the bar
      jump(0);
      var to = [title.getBoundingClientRect(), box.getBoundingClientRect()], k = from[0].height / (to[0].height || 1);
      title.style.transition = 'none'; box.style.transition = 'none';
      if (!narrow()) title.style.transform = 'translate(' + (from[0].left - to[0].left) + 'px,' + (from[0].top - to[0].top) + 'px) scale(' + k + ')';
      box.style.transform = 'translate(' + (from[1].left - to[1].left) + 'px,' + (from[1].top - to[1].top) + 'px)';
      box.getBoundingClientRect();
      requestAnimationFrame(function () {
        title.style.transition = 'transform 0.28s cubic-bezier(.2,.7,.2,1)'; box.style.transition = 'transform 0.28s cubic-bezier(.2,.7,.2,1), border-color 0.15s';
        title.style.transform = ''; box.style.transform = '';
        setTimeout(function () { title.style.transition = ''; box.style.transition = ''; }, 320);
      });
    }
  }
  // a move within the Glossary makes a history entry (or replaces this one), so Back walks back through them
  var setHash = function (h, how, st) { if (how === 'push') history.pushState(st || { gl: 1 }, '', h); else if (how === 'replace') history.replaceState(st || history.state, '', h); };
  var homeHash = function () { return location.pathname + location.search + '#/glossary'; };

  function openEntry(it, o) {
    o = o || {}; if (!it) return;
    L.cur = it; closeSugg();
    paneEl.innerHTML = entryHTML(it);
    if (o.hash) { var h = '#' + anchorOf(it); if (location.hash !== h) setHash(h, o.hash); }
    setState('entry', o.animate);
    jump(0);
    markRow();
    if (o.focus) focusEl($('#gl-hw'));
  }
  // no entry, but the site may still use the words: its own address, with the words kept in the history entry
  function openRaw(q, o) {
    o = o || {}; L.cur = null; closeSugg();
    paneEl.innerHTML = rawHTML(q);
    if (o.hash) setHash('#gl-find', location.hash === '#gl-find' ? 'replace' : o.hash, { gl: 1, q: q });
    setState('entry', o.animate);
    jump(0); markRow();
    if (o.focus) focusEl($('#gl-hw'));
  }
  /* the index's addresses: #a-z, #a-z/terms (one kind), #a-z/b (all kinds, at a letter) */
  var KSLUG = { term: 'terms', firm: 'firms', chip: 'ai-chips', country: 'countries' }, SLUGK = {};
  Object.keys(KSLUG).forEach(function (k) { SLUGK[KSLUG[k]] = k; });
  var azHash = function (k, l) { return '#a-z' + (l ? '/' + l.toLowerCase() : k && k !== 'all' ? '/' + KSLUG[k] : ''); };
  function parseAz(h) {
    var m = /^a-z(?:\/(.*))?$/i.exec(h); if (!m) return null;
    var s = String(m[1] || '').toLowerCase(), l = s === '0-9' ? s : s.toUpperCase();
    if (SLUGK[s]) return { kind: SLUGK[s] };
    return { kind: 'all', letter: s && LETTERS.indexOf(l) >= 0 ? l : null };
  }
  function openBrowse(o) {
    o = o || {}; closeSugg();
    if (o.kind && o.kind !== L.kind) setKind(o.kind);
    var h = azHash(L.kind, o.letter);
    if (o.hash && location.hash !== h) setHash(h, o.hash);
    setState('browse', o.animate);
    markRow(); thumbs();
    if (o.letter && groupEl[o.letter] && !groupEl[o.letter].hidden) toLetter(o.letter); else jump(o.restore ? browseY : 0);
    var f = o.letter && groupEl[o.letter] && !groupEl[o.letter].hidden ? $('#gl-lh-' + o.letter) : $('#gl-bh');
    if (o.focus) focusEl(f);
    spy(true);
  }
  function goHome(o) {
    o = o || {}; L.cur = null;
    inp.value = ''; lastQ = null; closeSugg(); $('#gl-clear').hidden = true;
    if (o.hash) setHash(homeHash(), o.hash, null);
    setState('home');
    jump(0);
    if (o.focus) focusEl(inp);
  }

  /* ---------- an entry, with its neighbors A to Z (within the kind shown, when it came from the index of one kind) ---------- */
  function entryHTML(it) {
    var used = {}; used[it.id] = 1;
    var body = it.kind === 'term' ? termHTML(it, used) : it.kind === 'firm' ? firmHTML(it, used) : it.kind === 'chip' ? chipHTML(it, used) : countryHTML(it, used);
    var list = L.state === 'browse' && L.kind !== 'all' ? az.filter(function (x) { return x.kind === L.kind; }) : az, i = list.indexOf(it);
    if (i < 0) { list = az; i = az.indexOf(it); }
    var prev = list[i - 1], next = list[i + 1];
    var pn = '<nav class="gl-pn" aria-label="Neighboring entries">' +
      (prev ? '<a class="gl-prev" href="#' + esc(anchorOf(prev)) + '" data-id="' + esc(prev.id) + '" rel="prev"><span class="label">Previous</span><span class="gl-pn-n">' + esc(prev.title) + '</span></a>' : '') +
      (next ? '<a class="gl-next" href="#' + esc(anchorOf(next)) + '" data-id="' + esc(next.id) + '" rel="next"><span class="label">Next</span><span class="gl-pn-n">' + esc(next.title) + '</span></a>' : '') + '</nav>';
    return '<div class="gl-e">' + body + passagesHTML(mentions(patternsOf(it), it.kind, it.key), it.kind) + pn + '</div>';
  }
  function rawHTML(q) {
    var near = nearest(q);
    return '<div class="gl-e"><p class="label gl-kind">No entry</p><h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(q) + '</h2>' +
      (near.length ? '<p class="gl-meta">Did you mean ' + near.map(function (it) { return '<a class="gl-x" href="#' + esc(anchorOf(it)) + '" data-id="' + esc(it.id) + '">' + esc(it.title) + '</a>'; }).join(', ') + '</p>' : '') +
      passagesHTML(mentions([q], 'raw', q), 'raw') + '</div>';
  }

  /* ---------- the suggestions: names first, then the entries whose words hold every word typed. A name that contains the
     query, or another name that starts with it, is a name match ("dutch", "prc", "foxconn"), and one that is exactly the query
     ("us", "tsmc") tops them ---------- */
  var opts = [], act = -1, expanded = false, lastQ = null;
  // as many suggestions as the window holds under the field, four to eight (six on a phone, whose keyboard takes the rest)
  var rows = function () { var top = L.state === 'home' && narrow() ? mh() + 72 : box.getBoundingClientRect().top + 54; return Math.max(4, Math.min(narrow() ? 6 : 8, Math.floor((window.innerHeight - top - 100) / 61))); };
  function matches(q) {
    var lq = q.trim().toLowerCase(), words = lq.split(/\s+/).filter(Boolean);
    var res = L.items.filter(function (it) { return words.every(function (w) { return it.text.indexOf(w) >= 0 || it.lname.indexOf(w) >= 0; }); });
    res.forEach(function (it) {
      it.isName = it.lname.indexOf(lq) >= 0 || it.al.some(function (a) { return a.indexOf(lq) === 0; });
      it.isExact = it.lname === lq || it.al.indexOf(lq) >= 0;
      it.starts = it.lname.indexOf(lq) === 0;
      // a name match through another name shows that name, so "pellicle" under "euv" says why it is there
      it.via = it.isName && it.lname.indexOf(lq) < 0 ? (it.alias.split('|').filter(function (a) { return a.toLowerCase().indexOf(lq) === 0; })[0] || '') : '';
    });
    var names = res.filter(function (it) { return it.isName; }).sort(function (a, b) { return (b.isExact - a.isExact) || (b.starts - a.starts) || (a.order - b.order); });
    return { names: names, rest: res.filter(function (it) { return !it.isName; }) };
  }
  var optHTML = function (it, i) {
    return '<li class="gl-opt" role="option" id="gl-o' + i + '" data-opt="' + i + '" aria-selected="false"><span class="gl-opt-h"><span class="gl-opt-n">' + esc(it.title) + '</span><span class="gl-opt-k">' + KIND[it.kind] + (it.via ? ' · ' + esc(it.via) : '') + '</span></span>' +
      (firstOf(it) ? '<span class="gl-opt-d">' + esc(firstOf(it)) + '</span>' : '') + '</li>';
  };
  function renderSugg() {
    var q = inp.value.trim();
    $('#gl-clear').hidden = !inp.value;
    if (!q) { closeSugg(); return; }
    if (q !== lastQ) { expanded = false; act = -1; }
    lastQ = q;
    var m = matches(q), all = m.names.concat(m.rest), cap = expanded ? all.length : rows();
    var n = m.names.slice(0, cap), r = m.rest.slice(0, Math.max(0, cap - n.length)), h = '';
    opts = n.concat(r);
    if (all.length) {
      if (n.length) h += '<ul role="group" aria-label="Name matches">' + n.map(function (it, i) { return optHTML(it, i); }).join('') + '</ul>';
      if (r.length) h += '<ul role="group" aria-labelledby="gl-g2"><li class="gl-grp" id="gl-g2" role="presentation">In the text</li>' + r.map(function (it, i) { return optHTML(it, n.length + i); }).join('') + '</ul>';
      h = '<div role="listbox" id="gl-opts" aria-label="Suggestions">' + h + '</div>';
      if (all.length > cap) h += '<button type="button" class="gl-all" data-more>Show all ' + all.length + ' matches</button>';
      say(all.length + (all.length === 1 ? ' match' : ' matches'));
    } else {
      var near = nearest(q);
      opts = near.concat([{ raw: q }]);
      h = '<p class="gl-none">No entry matches <b>' + esc(q) + '</b>.' + (near.length ? ' Did you mean' : '') + '</p><div role="listbox" id="gl-opts" aria-label="Suggestions"><ul role="group">' +
        near.map(function (it, i) { return optHTML(it, i); }).join('') +
        '<li class="gl-opt gl-opt-raw" role="option" id="gl-o' + near.length + '" data-opt="' + near.length + '" aria-selected="false"><span class="gl-opt-h"><span class="gl-opt-n">Every place the site uses “' + esc(q) + '”</span></span></li></ul></div>';
      say('No entry matches. ' + (near.length ? near.length + ' near names.' : ''));
    }
    sugg.innerHTML = h; sugg.hidden = false; field.classList.add('is-open'); inp.setAttribute('aria-expanded', 'true');
    markOpt();
  }
  function closeSugg() { if (!sugg) return; sugg.hidden = true; sugg.innerHTML = ''; field.classList.remove('is-open'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); opts = []; act = -1; }
  function markOpt() {
    $$('.gl-opt', sugg).forEach(function (li) { li.setAttribute('aria-selected', +li.getAttribute('data-opt') === act ? 'true' : 'false'); });
    if (act >= 0) { inp.setAttribute('aria-activedescendant', 'gl-o' + act); var li = $('#gl-o' + act); if (li) li.scrollIntoView({ block: 'nearest' }); }
    else inp.removeAttribute('aria-activedescendant');
  }
  function choose(o) {
    if (!o) return;
    var animate = L.state === 'home';
    if (o.raw) openRaw(o.raw, { hash: 'push', focus: true, animate: animate });
    else openEntry(o, { hash: 'push', focus: true, animate: animate });
  }
  // Enter opens the suggestion marked by the arrows, or else the top one
  function lookUp() {
    var q = inp.value.trim();
    if (!q) return;
    if (!opts.length || lastQ !== q) renderSugg();
    choose(act >= 0 ? opts[act] : opts[0]);
  }
  // on a phone the field rises to the top of the window as the reader types, so the suggestions clear the keyboard
  function lift() { if (L.state !== 'home' || !narrow()) return; var y = field.getBoundingClientRect().top + window.pageYOffset - mh() - 10; if (window.pageYOffset < y) jump(y); }

  /* ---------- Browse A to Z: every name under its letter, one kind at a time ---------- */
  function setKind(k) {
    L.kind = k;
    $$('#gl-kinds button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === k ? 'true' : 'false'); });
    L.items.forEach(function (it) { it.row.parentNode.hidden = !(k === 'all' || it.kind === k); });
    LETTERS.forEach(function (l) { var g = groupEl[l]; if (g) g.hidden = !$$('.gl-r:not([hidden])', g).length; });
    var kk = KINDS.filter(function (x) { return x[0] === k; })[0];
    countEl.textContent = counts[k] + ' ' + (counts[k] === 1 ? kk[3] : kk[2]);
    thumbs();
  }
  function thumbs() {
    lettersEl.innerHTML = LETTERS.map(function (l) {
      var g = groupEl[l], on = g && !g.hidden;
      return on ? '<button type="button" data-l="' + l + '" aria-label="' + (l === '0-9' ? 'Numbers' : l) + '">' + showL(l) + '</button>' : '<span aria-hidden="true">' + showL(l) + '</span>';
    }).join('');
    spy(true);
  }
  function markRow() {
    $$('.gl-r a[aria-current]', browseEl).forEach(function (a) { a.removeAttribute('aria-current'); });
    var a = L.cur && azRow[L.cur.id]; if (a) a.setAttribute('aria-current', 'true');
  }
  // the strip of letters marks the letter at the top of the index
  var spyQ = false;
  function spy(now) {
    if (!L.built || L.state !== 'browse' || !here() || (spyQ && !now)) return; spyQ = true;
    requestAnimationFrame(function () {
      spyQ = false;
      var line = mh() + head.getBoundingClientRect().height + (narrow() ? 0 : lettersEl.getBoundingClientRect().height) + 40, curL = null;
      LETTERS.forEach(function (l) { var g = groupEl[l]; if (g && !g.hidden && g.getBoundingClientRect().top <= line) curL = l; });
      if (!curL) curL = LETTERS.filter(function (l) { return groupEl[l] && !groupEl[l].hidden; })[0];
      $$('button', lettersEl).forEach(function (b) { if (b.getAttribute('data-l') === curL) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    });
  }
  function toLetter(l) {
    var g = groupEl[l]; if (!g || g.hidden) return;
    var off = mh() + head.getBoundingClientRect().height + (narrow() ? 0 : lettersEl.getBoundingClientRect().height);
    jump(g.getBoundingClientRect().top + window.pageYOffset - off + 1);
    spy(true);
  }

  /* ---------- the reader's moves ---------- */
  function wire() {
    inp.addEventListener('input', function () { renderSugg(); if (inp.value.trim()) lift(); });
    inp.addEventListener('focus', function () { if (inp.value.trim()) renderSugg(); });
    inp.addEventListener('blur', function () { setTimeout(function () { if (!field.contains(document.activeElement)) closeSugg(); }, 120); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (sugg.hidden) { renderSugg(); if (sugg.hidden) return; }
        if (e.key === 'ArrowDown') act = act + 1 >= opts.length ? opts.length - 1 : act + 1; else act = act - 1 < -1 ? -1 : act - 1;
        markOpt();
      } else if (e.key === 'Enter') { e.preventDefault(); lookUp(); }
      else if (e.key === 'Escape') {
        if (inp.value) { e.preventDefault(); e.stopPropagation(); inp.value = ''; lastQ = null; closeSugg(); $('#gl-clear').hidden = true; say('Search cleared'); }
        else if (!sugg.hidden) { e.preventDefault(); closeSugg(); }
      }
    });
    $('#gl-clear').addEventListener('click', function () { inp.value = ''; lastQ = null; closeSugg(); this.hidden = true; inp.focus(); });
    sugg.addEventListener('mousedown', function (e) { if (e.target.closest('.gl-opt, [data-more]')) e.preventDefault(); }); // the field keeps the focus
    sugg.addEventListener('click', function (e) {
      var li = e.target.closest('.gl-opt'); if (li) { choose(opts[+li.getAttribute('data-opt')]); return; }
      if (e.target.closest('[data-more]')) { expanded = true; renderSugg(); inp.focus(); }
    });
    sugg.addEventListener('mousemove', function (e) { var li = e.target.closest('.gl-opt'); if (li && +li.getAttribute('data-opt') !== act) { act = +li.getAttribute('data-opt'); markOpt(); } });
    $('#gl-rand').addEventListener('click', function () { var it; do { it = L.items[Math.floor(Math.random() * L.items.length)]; } while (it === L.cur && L.items.length > 1); openEntry(it, { hash: 'push', focus: true, animate: true }); });
    $('#gl-kinds').addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (!b) return; setKind(b.getAttribute('data-k')); if (L.state === 'browse') { setHash(azHash(L.kind), 'replace'); jump(0); } });
    lettersEl.addEventListener('click', function (e) { var b = e.target.closest('button[data-l]'); if (b) toLetter(b.getAttribute('data-l')); });
    lettersEl.addEventListener('pointerdown', function (e) { // on a phone a finger can run down the letters
      if (!narrow() || e.pointerType === 'mouse') return;
      var go = function (ev) { var el = document.elementFromPoint(ev.clientX, ev.clientY), b = el && el.closest && el.closest('.gl-jump button[data-l]'); if (b) toLetter(b.getAttribute('data-l')); };
      go(e);
      var move = function (ev) { ev.preventDefault(); go(ev); }, up = function () { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
      document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up);
    });

    /* a name opens its entry, the name of the Glossary goes back to the first screen, a kind, a letter or A to Z opens the index;
       the passages and the links out carry what the page they open should do (the supplier list's filter, a chip's card, a
       passage to flash) */
    view.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a[data-id]');
      if (a && L.byId[a.getAttribute('data-id')]) { e.preventDefault(); openEntry(L.byId[a.getAttribute('data-id')], { hash: 'push', focus: true }); return; }
      if (e.target.closest('[data-home]')) { e.preventDefault(); if (L.state !== 'home') goHome({ hash: 'push', focus: e.detail === 0 }); else inp.focus(); return; }
      var ak = e.target.closest('[data-azk]'), al = e.target.closest('[data-azl]');
      if (ak || al) { e.preventDefault(); openBrowse({ hash: 'push', focus: true, animate: L.state === 'home', kind: ak ? ak.getAttribute('data-azk') : 'all', letter: al ? al.getAttribute('data-azl') : null }); return; }
      if (e.target.closest('[data-az]')) { e.preventDefault(); openBrowse({ hash: 'push', focus: true, animate: L.state === 'home' }); return; }
      var p = e.target.closest('a[data-para]');
      if (p) {
        e.preventDefault(); var para = corpus()[+p.getAttribute('data-para')]; if (!para) return;
        // on another page (the chapter's own): the passage goes with the reader, and that page lands on it (flash)
        if (!para.el) { CP.go('#' + para.chapter, { para: { chapter: para.chapter, k: para.k, text: para.text } }); return; }
        location.hash = '#' + para.chapter;
        setTimeout(function () { CP.scrollToEl(para.el, false); if (CP.Router && CP.Router.settle) CP.Router.settle(para.el); para.el.classList.add('lk-flash'); setTimeout(function () { para.el.classList.remove('lk-flash'); }, 2600); }, 140);
        return;
      }
      // the supplier list takes the whole filter from the link (a firm's name, or a country), so an older search cannot narrow it
      var s = e.target.closest('a[data-sup]'); if (s) { var q = s.getAttribute('data-sup'); setTimeout(function () { if (CP.Suppliers && CP.Suppliers.show) CP.Suppliers.show({ q: q }); }, 60); return; }
      var sc = e.target.closest('a[data-supcc]'); if (sc) { var cc = sc.getAttribute('data-supcc'); setTimeout(function () { if (CP.Suppliers && CP.Suppliers.show) CP.Suppliers.show({ country: cc }); }, 60); return; }
      // a chip opens its card on the chart, adding nothing
      var ch = e.target.closest('a[data-chip]'); if (ch) { var id = ch.getAttribute('data-chip'); setTimeout(function () { if (CP.Landscape && CP.Landscape.openCard) CP.Landscape.openCard(id, { show: true }); }, 60); return; }
      var more = e.target.closest('[data-rest]');
      if (more) { var rest = more.parentNode.querySelector('.gl-rest'); rest.hidden = false; more.parentNode.removeChild(more); focusEl(rest.querySelector('a')); return; }
      var all = e.target.closest('[data-all]');
      if (all) { var ul = all.closest('.gl-part').querySelector('.gl-men'), n = ul.children.length; ul.innerHTML = lastHits.map(rowHTML).join(''); all.parentNode.parentNode.removeChild(all.parentNode); var nx = ul.children[n] && ul.children[n].querySelector('a'); if (nx) focusEl(nx); }
    });
    // "/" goes to this search while the Glossary shows (the site search keeps Ctrl+K); it is heard before the site's own "/"
    window.addEventListener('keydown', function (e) {
      if (e.key !== '/' || !here() || e.ctrlKey || e.metaKey || e.altKey) return;
      var a = document.activeElement || document.body, cps = $('#cp-search');
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName || '') || a.isContentEditable || (cps && !cps.hidden)) return;
      e.preventDefault(); e.stopPropagation(); inp.focus(); inp.select();
    }, true);
    // the index keeps the reader's place, so Back from an entry returns to it
    window.addEventListener('scroll', function () { if (L.state === 'browse' && here()) { browseY = window.pageYOffset; spy(); } }, { passive: true });
    var rs = null;
    window.addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { measure(); spy(true); }, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); if (pendL && L.state === 'browse' && here()) toLetter(pendL); pendL = null; spy(true); });
  }

  /* ---------- the address leads: Back and Forward, and a link from a chapter, a pop-up or the site search ---------- */
  var pendL = null; // a letter in the address on arrival, gone to again once the faces have set the rows' heights
  function route(o) {
    var h = (location.hash || '').replace(/^#/, ''); try { h = decodeURIComponent(h); } catch (e) { }
    var it = fromHash();
    if (it) { openEntry(it, { hash: false, focus: o.focus }); return; }
    var A = parseAz(h); // a letter is gone to on arrival; Back to the index keeps the place left
    if (A) { var back = !o.first && !o.away && L.state !== 'home'; if (o.first) pendL = A.letter; openBrowse({ hash: false, kind: A.kind, letter: back ? null : A.letter, restore: back, focus: o.focus }); return; }
    if (h === 'gl-find' && history.state && history.state.q) { openRaw(history.state.q, { hash: false, focus: o.focus }); return; }
    goHome({ hash: false });
  }
  /* each route to the Glossary: the address decides what shows. From another view or page (a pop-up's Look it up, a search
     result) the entry's name or the index's head takes focus */
  function activate() {
    init(); if (!L.built) return;
    var R = CP.Router || {}, first = !L.arrived;
    // came: the page's first route is a move from another page of the site; away: a move from another view of this page
    var came = first && /^https?:/.test(document.referrer) && document.referrer.indexOf(location.origin + '/') === 0 && document.referrer !== location.href;
    var away = !first && R.from && R.from !== 'glossary';
    L.arrived = true;
    route({ first: first, away: away, focus: came || !!away || (!first && !!fromHash()) });
    measure(); spy(true);
  }
  // a load lands an entry at its top: the browser may keep an earlier place a moment past load, so the top is set again
  window.addEventListener('load', function () { if (here() && L.state === 'entry' && window.pageYOffset) jump(0); });

  CP.Lookup = L;
  L.show = function (id) { var it = L.byId[id] || L.byKey[id]; if (it) openEntry(it, { hash: 'replace' }); };
  L.search = function (s) { inp.focus(); inp.value = s; renderSugg(); lift(); };
  L.browse = function (k, l) { openBrowse({ hash: 'replace', kind: k || 'all', letter: l || null }); };
  L.first = firstOf;
  L.flash = flash; L.domCorpus = domCorpus; L.corpus = corpus;
  /* The rows and the passages come with glossary.js (build/build.js), fetched when the Glossary first opens (CP.need); the head
     paints at once, and the parts the rows fill wait hidden until they are in (lookup.css, .gl-wait) */
  L.load = function (fn) {
    var list = $('#lk-items');
    if (!list || list.children.length || !CP.need) { fn(); return; }
    CP.need('glossary.js', function () { fn(); var v = $('.view[data-view="glossary"]'); if (v && !v.hasAttribute('data-gl')) v.setAttribute('data-gl', 'empty'); });
  };
  CP.register('glossary', { activate: function () { L.load(activate); }, stage: false });
})();

} catch (e) { console.warn('module lookup.js failed', e); }

/* module: print.js */
try {
/* Print runtime. Nothing in this file runs on screen: it defines window.CP_PRINT and stops.
   build/pdf.py calls CP_PRINT.prepare() before it injects Paged.js, and CP_PRINT.finish() once
   the pages are laid out. Every note is written here, at print time, from the data-t / data-p /
   data-d / data-tier fields already carried by each citation, so the built page never changes.
   prepare({chapter: id}) lays one chapter out alone, under a compact title block (build/chapter_pdfs.py), and
   prepare({edition: '20 October 2026'}) dates the PDF: on its title block, in the foot of every page, in its citation.
   prepare({moves, tight, split}) carries what pdf.py learned from finish() about an earlier layout of the same page
   (figures to move down the text, cards to set closer); noteFlow fits the notes to each page as Paged.js lays it out. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.document) return;

  /* screen furniture, and the machinery that would fight the paginator for the CPU */
  var GONE = ['.masthead', '.rail', '.to-top', '.stage', '.sheet', '#cp-search', '.ex-tip', '.ct-tip',
    '.gl-tip', '.export-bar', '.permalink', '.howto-dl', '.prevnext', '.ch-meta', '.chain--compact',
    '.chain-foot', '.skip', '.stage-actions', '.stage-tag', 'canvas', 'iframe',
    '#contents .ln']; /* The Chain's contents drawn as a picture (design round six): the book's contents are the list under it */

  function each(sel, root, fn) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }

  /* Paper gets static fonts. Chrome cannot put a variable font into a PDF as a font: it draws each instance as Type 3
     shapes, which copy and search as broken words ("ED / A"). So for print the page's variable families give way to
     fixed instances of the same families, all under the SIL Open Font License, served by Google Fonts as the site's own
     fonts are: the site's four (the hybrid, 28 Oct 2026). Fraunces for headings, at the screen's optical size, 48, with SOFT
     and WONK at 0, and Source Serif 4 for text, its optical size fixed at 11, near the printed text (10 pt), each in the
     three weights print.css sets (400 for titles, section heads and text, 500 for small heads, 600 for bold: the screen's
     360 and 540 are between named weights, and such an instance prints as Type 3 again), and the text face's italic at 400;
     Hanken Grotesk for labels; Fragment Mono
     for kickers, codes and dates; and Noto Serif and Sans for the Chinese and Japanese titles of some sources (the
     system's own CJK fonts print as Type 3 too).
     Chrome embeds each as TrueType, subset to the letters used. */
  /* one request per instance: asked for a single point, Google Fonts serves a fixed instance; asked for several weights
     at once, it serves one variable file that covers them, and that prints as Type 3 again */
  var PRINT_FONTS = ['Fraunces:opsz,wght,SOFT,WONK@48,400,0,0', 'Fraunces:opsz,wght,SOFT,WONK@48,500,0,0', 'Fraunces:opsz,wght,SOFT,WONK@48,600,0,0',
    'Source+Serif+4:ital,opsz,wght@0,11,400', 'Source+Serif+4:ital,opsz,wght@0,11,500', 'Source+Serif+4:ital,opsz,wght@0,11,600',
    'Source+Serif+4:ital,opsz,wght@1,11,400',
    'Hanken+Grotesk:wght@400', 'Hanken+Grotesk:wght@500', 'Hanken+Grotesk:wght@600', 'Hanken+Grotesk:wght@700',
    'Fragment+Mono', 'Noto+Serif+SC:wght@400', 'Noto+Serif+SC:wght@600', 'Noto+Serif+JP:wght@400',
    'Noto+Serif+JP:wght@600', 'Noto+Sans+SC:wght@400', 'Noto+Sans+JP:wght@400'];
  /* A face under a name of its own, for an instance that would otherwise take the place of one above (one face to a
     weight): [name, Google Fonts family]. It comes from the same request a link would make, added through the FontFace
     API under its new name: the wordmark, Fraunces 500 at the masthead's optical size, 28 (the screen's 540 is between named
     weights). Under the family's own name it would take the place of the 500 above (one face to a weight). */
  var PRINT_FACES = [['Fraunces Mark', 'Fraunces:opsz,wght,SOFT,WONK@28,500,0,0']];
  var fontsLoaded = null;
  function fontURL(family) { return 'https://fonts.googleapis.com/css2?family=' + family + '&display=block'; }
  function namedFace(name, family) {
    return fetch(fontURL(family)).then(function (r) { return r.text(); }).then(function (css) {
      var loads = [], re = /@font-face\s*{([^}]*)}/g, m;
      while ((m = re.exec(css))) {
        var src = /src:\s*([^;]+);/.exec(m[1]), w = /font-weight:\s*([^;]+);/.exec(m[1]), u = /unicode-range:\s*([^;]+);/.exec(m[1]);
        if (!src) continue;
        var face = new FontFace(name, src[1].trim(), { weight: w ? w[1].trim() : '400', unicodeRange: u ? u[1].trim() : 'U+0-10FFFF', display: 'block' });
        document.fonts.add(face);
        loads.push(face.load().catch(function () { return null; }));
      }
      return Promise.all(loads);
    }).catch(function () { return null; }); // without it the cover and the wordmark fall back to the 400 and 500 above
  }
  function printFonts() {
    each('link[rel="stylesheet"][href*="fonts.googleapis.com"]', document, function (l) { l.remove(); });
    fontsLoaded = Promise.all(PRINT_FONTS.map(function (family) {
      var link = node('link');
      link.rel = 'stylesheet'; link.href = fontURL(family);
      link.setAttribute('data-pagedjs-ignore', ''); // Paged.js leaves it in place, so the faces stay loaded through the layout
      var loaded = new Promise(function (done) { link.onload = done; link.onerror = done; });
      document.head.appendChild(link);
      return loaded;
    }).concat(PRINT_FACES.map(function (f) { return namedFace(f[0], f[1]); })));
  }
  /* pdf.py waits on this after prepare(): the stylesheet, then each face the print uses, then any other pending load */
  function fontsReady() {
    var faces = ['400 24pt Fraunces', '500 11pt Fraunces', '600 11pt Fraunces', '500 11pt "Fraunces Mark"',
      '400 24pt "Source Serif 4"', '500 11pt "Source Serif 4"', '600 11pt "Source Serif 4"',
      '400 10pt "Source Serif 4"', 'italic 400 10pt "Source Serif 4"',
      '400 7pt "Hanken Grotesk"', '500 7pt "Hanken Grotesk"', '600 7pt "Hanken Grotesk"', '700 7pt "Hanken Grotesk"',
      '400 7pt "Fragment Mono"'];
    /* and Lithography's annotated drawing, fetched from its readable page (stills, below) */
    return Promise.all([fontsLoaded, stillsLoaded]).then(function () {
      return Promise.all(faces.map(function (f) { return document.fonts.load(f).catch(function () { return []; }); }));
    }).then(function () { return document.fonts.ready; }).then(function () {
      var got = []; document.fonts.forEach(function (f) { if (f.status === 'loaded') got.push(f.family + ' ' + f.weight + (f.style !== 'normal' ? ' ' + f.style : '')); });
      return got.filter(function (v, i) { return got.indexOf(v) === i; }).length;
    });
  }

  /* the full address without its scheme, as a reader would type it: query and fragment kept, never shortened
     (a long one wraps onto the next line of the note, print.css) */
  function readable(url) {
    return String(url || '').replace(/^https?:\/\//i, '');
  }

  /* a footnote's address, short: the site it is on ("asml.com"; an archived page names the archive). With the title,
     publisher, date and page that finds the document; the note links the full address, and the chapter's source list
     prints it. A path in the note ran most notes to a second line. */
  function shortUrl(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return readable(url).split('/')[0]; }
  }
  /* the notes are a reader's short form: a long title is cut at a word near 80 characters and a publisher's long
     parenthesis is dropped; the source list at the end of the chapter carries each in full */
  function clip(s, n) {
    s = String(s || '').replace(/\s+/g, ' ').trim();
    if (s.length <= n) return s;
    var cut = s.slice(0, n), sp = cut.lastIndexOf(' ');
    return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.(–-]+$/, '') + '…';
  }
  function shortPublisher(p) {
    p = String(p || '').replace(/\s+/g, ' ').trim();
    return p.length > 48 && / \(/.test(p) ? p.slice(0, p.indexOf(' (')) : clip(p, 60);
  }

  function part(cls, text) {
    var el = document.createElement('span');
    el.className = cls; el.textContent = text;
    return el;
  }

  /* one footnote, built from the citation beside it: "12 Title. Publisher, date, p. 4. site.org". The date is the
     source's own, or "accessed <day>" for a source that shows none; "p. N" is a citation into a long PDF (the same document
     at two pages is two numbers, so two notes; one page cited twice is one). */
  function noteFor(a, key) {
    var fn = document.createElement('span');
    fn.className = 'fn';
    fn.setAttribute('data-k', key);
    var pg = a.getAttribute('data-pg') || '';
    var when = (a.getAttribute('data-d') || '').replace(/^Accessed /, 'accessed ');
    var meta = [shortPublisher(a.getAttribute('data-p')), when, pg ? 'p. ' + pg : ''].filter(Boolean).join(', ');
    fn.appendChild(part('fn-n', a.textContent.trim()));
    var t = clip(a.getAttribute('data-t'), 80);
    if (t) fn.appendChild(part('fn-t', t + (/[.?!…]$/.test(t) ? ' ' : '. ')));
    if (meta) fn.appendChild(part('fn-m', meta.charAt(0).toUpperCase() + meta.slice(1) + '. '));
    var href = a.getAttribute('href');
    if (href) {
      var link = document.createElement('a');
      link.className = 'fn-u'; link.href = href; link.textContent = shortUrl(href);
      fn.appendChild(link);
    }
    return fn;
  }

  /* The chapter's source list, for paper: every source in the order of its number, with its title, publisher and date and
     its full address (the notes carry a short one). Built from the list the chapter ends with on screen. */
  function sourceList(d) {
    var list = d.querySelector('ol');
    if (!list) return null;
    var box = node('section', 'cp-sources');
    var head = d.querySelector('summary');
    box.appendChild(node('h2', 'cp-sources-h', head ? head.textContent.trim() : 'Sources')); // a section of the chapter, as its others are h2 (29 Oct 2026)
    var ol = node('ol');
    each('li', list, function (li) {
      var item = li.cloneNode(true), a = item.querySelector('a[href]');
      if (a) item.appendChild(node('span', 'src-url', readable(a.getAttribute('href'))));
      ol.appendChild(item);
    });
    box.appendChild(ol);
    return box;
  }

  /* ---------- editions and the chapter printed alone ---------- */
  var WORK = 'Chip Supply Chain: How AI Chips Are Made'; // the work the site cites itself as (CITE_WORK in build/build.js)
  var BOOK_PDF = 'pdf/how-ai-chips-are-made.pdf';

  function node(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  /* The citation for this edition: the cite line's form (citeBlock in build/build.js) with the edition in place of the
     day the page was updated, and no access date, since a PDF does not change after it is made. */
  function citation(title, url, edition, italic) {
    var f = document.createDocumentFragment();
    f.appendChild(document.createTextNode('Sharma, Yashvardhan. ' + (title ? '“' + title + '.” ' : '')));
    f.appendChild(italic ? node('i', '', WORK) : document.createTextNode(WORK));
    f.appendChild(document.createTextNode('. ' + edition + '. '));
    if (italic) { var a = node('a', '', url); a.href = url; f.appendChild(a); } // set as type, the address is a link
    else f.appendChild(document.createTextNode(url));
    return f;
  }
  function bibtex(key, title, url, edition) {
    var d = /(\d{1,2}) ([A-Z][a-z]+) (\d{4})/.exec(edition) || [];
    var rows = [['title', title || WORK], ['author', 'Sharma, Yashvardhan']];
    if (title) rows.push(['howpublished', WORK]);
    if (d[3]) rows.push(['year', d[3]], ['month', d[2]]);
    rows.push(['note', edition], ['url', url]);
    return '@misc{' + key + ',\n' + rows.map(function (r) { return '  ' + (r[0] + '            ').slice(0, 12) + ' = {' + r[1] + '}'; }).join(',\n') + '\n}';
  }

  /* the colophon's "How to cite" names this edition: the screen's block carries the reader's own access date. On paper the
     citation is set as type, with the work in italic, as a citation is printed; the BibTeX stays in the code face. */
  function citeBox(title, url, edition, key) {
    var box = node('details', 'cite cite--edition');
    box.open = true;
    box.appendChild(node('summary', '', title ? 'How to cite this chapter' : 'How to cite this edition'));
    var plain = node('p', 'cp-cite-text');
    plain.appendChild(citation(title, url, edition, true));
    box.appendChild(plain);
    box.appendChild(node('pre', '', bibtex(key, title, url, edition)));
    return box;
  }

  /* A chapter printed alone opens on a compact title block in place of the book's cover and contents: the wordmark (the
     masthead's tile and the name, as on every page of the site), the edition and the chapter's own address. The chapter's
     title follows at once, set large, and its number stands in the ledger beside it, so the block repeats neither. */
  function titleBlock(ch, url, edition, tile) {
    var head = node('header', 'pt-chapter');
    var top = node('p', 'ptc-k');
    var mark = node('span', 'ptc-wm');
    if (tile) mark.appendChild(tile);
    mark.appendChild(node('span', 'wm-name', 'Chip Supply Chain'));
    top.appendChild(mark);
    if (edition) top.appendChild(node('span', 'ptc-ed', edition));
    head.appendChild(top);
    /* the chapter opens on its title: the citation sits once, at the end, in "How to cite this chapter" */
    var where = node('p', 'ptc-url'), link = node('a', '', readable(url));
    link.href = url; where.appendChild(link); head.appendChild(where);
    return head;
  }

  /* The edition goes in the foot of every page, after the site's address. Paged.js reads this rule with print.css; a
     chapter printed alone also keeps the foot and the folio on its first page, which holds the start of the text. */
  function editionStyle(host, edition, alone) {
    var foot = JSON.stringify(host + ' · ' + edition);
    var css = '@page { @bottom-left { content: ' + foot + '; } }';
    if (alone) css += '\n@page :first { @bottom-left { content: ' + foot + '; } @bottom-right { content: counter(page) " / " counter(pages); } }';
    var s = node('style', '', css);
    s.id = 'cp-print-edition';
    document.head.appendChild(s);
  }

  /* ---------- the chapter opener, the questions and the contents page, for paper ---------- */

  /* The chain in the margin column beside the chapter (print.css .cp-index), as the screen's rail shows it: each of the
     stages with its number, its whole name and its band's meter (four bars, as the screen's rail draws them), then the
     two chapters that look across them; the chapter's own line in bold. Built from the rail before its screen parts go,
     and the rail moves to the head of the chapter, where it floats beside the opener. */
  function stageIndex() {
    each('article.chapter', document, function (ch) {
      var led = ch.querySelector('.ch-ledger'), track = led && led.querySelector('.chain-track');
      if (!track) return;
      var list = function (src, cls) {
        var ol = node('ol', cls);
        ol.setAttribute('aria-hidden', 'true');
        each(':scope > li', src, function (li) {
          var n = li.querySelector('.n'), t = li.querySelector('.t');
          var item = node('li', li.getAttribute('aria-current') === 'true' ? 'is-here' : '');
          item.setAttribute('data-band', li.getAttribute('data-band') || '0');
          item.appendChild(node('span', 'n', n ? n.textContent : ''));
          item.appendChild(node('span', 't', t ? t.textContent.replace(/\u00ad/g, '') : ''));
          var m = li.querySelector('.meter');
          if (m) item.appendChild(m.cloneNode(true));
          ol.appendChild(item);
        });
        return ol;
      };
      led.appendChild(node('p', 'cp-index-k', 'The chain'));
      led.appendChild(list(track, 'cp-index'));
      var across = led.querySelector('.rail-across');
      if (across) led.appendChild(list(across, 'cp-index cp-across'));
      ch.insertBefore(led, ch.firstChild);
    });
  }

  /* Each section's number, written on its heading for print.css (h2::before; the sections were h3 until 29 Oct 2026): the
     screen counts them with a CSS counter, which starts again on every page Paged.js lays out. */
  function sectionNumbers() {
    each('article.chapter > .prose', document, function (prose) {
      var i = 0;
      each(':scope > h2', prose, function (h) { i++; h.setAttribute('data-cp-n', (i < 10 ? '0' : '') + i); });
    });
  }

  /* The words of the right running head (print.css string-set, which reads data-cp-run), on each of its sources, the same
     list as print.css's: a section's heading gives its data-k, the short heading content/*.md writes and the rail lists, so
     a chapter's own words for it (data/section-headings.json, 29 Oct 2026) stay out of the head; every other source gives
     its own text, as the head read it until then. Once the source list and the questions are in place. */
  function runningHeads() {
    each('.prose > h2', document, function (h) { h.setAttribute('data-cp-run', h.getAttribute('data-k') || h.textContent); });
    each('.plate-head .label, .cp-sources .cp-sources-h, .review .cp-quiz h3.label, .review .rv-keep h3.label', document, function (el) { el.setAttribute('data-cp-run', el.textContent); });
  }

  /* A chapter whose drawing carries numbered parts (data/specimen-parts.json: Lithography) prints its annotated still,
     balloons and all, above its caption: the live drawing does not print. The build draws it (build/modules/social.js
     stillSVG, as the readable page showed it until 28 Oct 2026) into a <template> in the specimen's figure, which the screen
     never shows; its picture's path is already this page's. fontsReady() waits for it and its picture. */
  var stillsLoaded = null;
  function stills() {
    var jobs = [];
    each('article.chapter .ch-spec[data-parts]', document, function (fig) {
      var tpl = fig.querySelector('template.cp-still-src'), svg = tpl && tpl.content ? tpl.content.querySelector('svg.ch-still--wide') : null;
      if (!svg || fig.querySelector('.cp-still')) return;
      svg = document.importNode(svg, true);
      var src = '';
      each('image', svg, function (im) { src = im.getAttribute('href') || ''; });
      var box = node('div', 'cp-still');
      box.appendChild(svg);
      fig.insertBefore(box, fig.querySelector('.ch-spec-cap'));
      if (src) jobs.push(new Promise(function (done) { var im = new Image(); im.onload = done; im.onerror = done; im.src = src; }));
    });
    stillsLoaded = Promise.all(jobs);
  }

  /* The card stands in the text after the lead and before section 01, on paper as on screen (build/build.js withCard), so
     its notes follow the lead's in reading order. It takes an id of its own for paper, which pdf.py's report and the layout
     passes know it by; a card still in the chapter's head (an older page) goes to the head of the text. floats() (below)
     moves a card only past paragraphs, never past a heading, so after the lead it keeps its place. */
  function cardsToText() {
    each('article.chapter', document, function (ch) {
      var plate = ch.querySelector('.plate'), prose = ch.querySelector(':scope > .prose');
      if (!plate || !prose || !ch.id) return;
      plate.id = 'card-' + ch.id;
      if (!prose.contains(plate)) prose.insertBefore(plate, prose.firstChild);
    });
  }

  /* The deck's questions for paper. The cards are screen-only, so the questions print as a list above the takeaways, each
     with the section that answers it (the card's "Reread" link): a reader answers from memory, then checks the list. */
  var COUNT = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  function questions() {
    each('section.review', document, function (rv) {
      var keep = rv.querySelector('.rv-keep'), cards = rv.querySelectorAll('.fc-card .fc-q');
      if (!keep || !cards.length) return;
      var box = node('div', 'cp-quiz'), lab = keep.querySelector('.label');
      // its heading at the level of the things to remember beside it: h3 under a chapter's deck (h2), since 29 Oct 2026
      box.appendChild(node(lab ? lab.tagName.toLowerCase() : 'h4', 'label', (COUNT[cards.length] || cards.length) + (cards.length === 1 ? ' question' : ' questions') + ' to answer from memory'));
      var ol = node('ol');
      each('.fc-card', rv, function (card) {
        var q = card.querySelector('.fc-q'), more = card.querySelector('.fc-more');
        if (!q) return;
        var li = node('li', '', q.textContent.trim());
        var where = more ? more.textContent.replace(/^\s*Reread:\s*/, '').trim() : '';
        if (where) { li.appendChild(document.createTextNode(' ')); li.appendChild(node('span', 'cp-quiz-re', 'see ' + where)); }
        ol.appendChild(li);
      });
      box.appendChild(ol);
      keep.parentNode.insertBefore(box, keep);
      keep.classList.add('cp-quizzed');
    });
  }

  /* The Chain's opening sentence speaks of the page and its 3D models: the printed edition says what it holds. Its
     length matches the screen's, since it shares its page with the contents (How to read a chapter, which stood between
     them, went on 28 Oct 2026). */
  var LEDE_END = 'Each chapter ends with questions to answer from memory. Online, every chapter also has a 3D model, and most have an animation.';
  function printLede() {
    each('.howto .howto-lede', document, function (p) {
      var t = p.textContent.replace(/^The Chain covers/, 'This edition covers');
      p.textContent = /To help readers learn[^.]*\./.test(t) ? t.replace(/To help readers learn[^.]*\./, LEDE_END) : t;
    });
  }

  /* Called once, on the loaded page, before Paged.js is injected.
     opts.mode      'footnotes' (default) or 'endnotes' for the fallback
     opts.only      keep only the first N chapters (used while iterating on the design)
     opts.chapter   keep only this chapter (its id), under a compact title block in place of the cover and contents
     opts.edition   the day the PDF is made, "20 October 2026": printed as "Edition of 20 October 2026" on the title
                    block, in the foot of every page and in the citation
     opts.site      the site's address, "https://chipsupplychain.org/" (default: the page's canonical link)
     opts.moves, opts.tight, opts.split, opts.sources, opts.nudge, opts.breaks   what an earlier layout learned (build/pdf.py, from finish()) */
  function prepare(opts) {
    opts = opts || {};
    var out = { mode: opts.mode || 'footnotes', cites: 0, notes: 0, chapters: 0, dropped: 0 };

    /* the screen shows The Chain one chapter at a time (html[data-chain], src/template.html), and Paged.js lays the page out on
       screen: every chapter shows again, so the book holds all of them, and opts.chapter keeps its own chapter whatever the
       address opened */
    document.documentElement.removeAttribute('data-chain');
    /* paper is white whatever the reader was using, and set in static fonts (printFonts, above) */
    document.documentElement.setAttribute('data-theme', 'light');
    printFonts();
    /* the PDFs credit the author alone (owner, 28 Oct 2026): " with Claude" leaves the printed footer, while the screen's
       footer keeps build.js's credits as written */
    Array.prototype.forEach.call(document.querySelectorAll('.credits'), function (p) {
      var w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) n.nodeValue = n.nodeValue.replace(' with Claude.', '.');
    });

    /* explainer animations print as their last frame and the list of steps: drop the videos, load the stills now */
    Array.prototype.forEach.call(document.querySelectorAll('.figure--anim video'), function (v) { v.pause(); v.removeAttribute('src'); v.remove(); });
    Array.prototype.forEach.call(document.querySelectorAll('img[loading="lazy"]'), function (img) { img.loading = 'eager'; });

    /* the masthead's tile, for the wordmark on a chapter's title block, and the ledger's strip of stages, before both go */
    var tile = document.querySelector('.masthead .wm-tile');
    tile = tile ? tile.cloneNode(true) : null;
    stageIndex();
    sectionNumbers();
    /* Paged.js gathers every counter in the page's sheets into one counter-reset on its pages. The screen's section
       counter (chapter.css: "counter-reset: sec", and "counter-increment: none" on the readable page) put a counter
       named "none" there, which voided the rule, and every folio printed as "n / 0". On paper the numbers are written on
       the headings (sectionNumbers), so those declarations leave the sheets before Paged.js reads them. */
    /* The site's styles are a shared sheet since 28 Oct 2026 (dist/assets/site.css): each of the site's own linked sheets becomes a
       <style> with its text, in its place, so the rule below can reach it, as it did when the styles were inlined. The sheet
       is in the browser's cache, and prepare() answers pdf.py at once, so it is read synchronously */
    each('link[rel="stylesheet"]', document, function (l) {
      var u = l.href; if (!u || u.indexOf(location.origin + '/') !== 0) return;
      try {
        var x = new XMLHttpRequest(); x.open('GET', u, false); x.send();
        if (x.status !== 200) return;
        var st = document.createElement('style'); st.textContent = x.responseText; l.parentNode.replaceChild(st, l);
      } catch (e) { }
    });
    each('style', document, function (st) {
      var t = st.textContent, u = t.replace(/counter-(?:reset|increment):\s*(?:sec|none)\s*;?/g, '');
      if (u !== t) st.textContent = u;
    });

    /* Kill the specimen's animation loops: they re-arm through requestAnimationFrame, so a
       quarter second of dead frames ends them. Paged.js drives its own render queue through
       requestAnimationFrame, so the stand-in passes calls on once that window has closed —
       whoever holds a reference to it keeps working. */
    var raf = window.requestAnimationFrame;
    var deaf = Date.now() + 250;
    window.requestAnimationFrame = function (cb) { return Date.now() < deaf ? 0 : raf.call(window, cb); };
    window.setTimeout(function () { window.requestAnimationFrame = raf; }, 400);

    /* The scripts have run. Paged.js clones the body into its pages, and a cloned script tag
       runs again as it is inserted: the whole site would boot once a page. */
    each('script', document, function (s) { s.remove(); });

    GONE.forEach(function (sel) { each(sel, document, function (el) { el.remove(); }); });
    each('.view', document, function (v) { if (v.hasAttribute('hidden')) { v.remove(); out.dropped++; } });
    cardsToText();
    questions();

    /* figures moved down the text after an earlier layout (pdf.py, from floats() below): each goes after the next n
       blocks, so the text fills the page the figure could not */
    Object.keys(opts.moves || {}).forEach(function (id) {
      var el = document.getElementById(id), at = el;
      for (var i = 0; at && i < (+opts.moves[id] || 0); i++) at = at.nextElementSibling;
      if (el && at && at !== el) { at.parentNode.insertBefore(el, at.nextSibling); el.setAttribute('data-cp-moved', '1'); out.moved = (out.moved || 0) + 1; }
    });
    /* the block after a figure or a table stands a little further off (print.css .cp-after; Paged.js turns an "a + b"
       selector into a rule too weak to set it) */
    each('.prose > .figure, .prose > .table-wrap, .prose > .plate', document, function (el) {
      if (el.nextElementSibling) el.nextElementSibling.classList.add('cp-after');
    });
    each('details', document, function (d) { d.open = true; });
    /* A glossary term is a button on screen, and a button never breaks across a line: on paper it is a word in the
       text, so it becomes a span ("deep ultraviolet (DUV) lithography" then wraps like the words round it), as do the
       card's two ratings, which are glossary buttons too. */
    each('button.gl-term', document, function (b) {
      var s = document.createElement('span');
      s.className = b.className;
      while (b.firstChild) s.appendChild(b.firstChild);
      b.parentNode.replaceChild(s, b);
    });

    var chapters = document.querySelectorAll('article.chapter');
    out.chapters = chapters.length;
    if (opts.only) {
      Array.prototype.slice.call(chapters, opts.only).forEach(function (c) { c.remove(); });
      out.chapters = opts.only;
    }

    var site = String(opts.site || (document.querySelector('link[rel="canonical"]') || {}).href || location.origin + '/');
    if (site.slice(-1) !== '/') site += '/';
    var host = readable(site).replace(/\/$/, '');
    var edition = opts.edition ? 'Edition of ' + opts.edition : '';

    /* one chapter alone: the cover, The Chain's title and standfirst (.howto) and the contents give way to the chapter's own title block, and the
       chapter starts beneath it on the first page (print.css, .pt-chapter) */
    var alone = null;
    if (opts.chapter) {
      alone = document.getElementById(opts.chapter);
      if (!alone || !alone.matches('article.chapter')) throw new Error('no chapter "' + opts.chapter + '" on this page');
      Array.prototype.forEach.call(chapters, function (c) { if (c !== alone) c.remove(); });
      each('.print-title, .howto, .contents', document, function (el) { el.remove(); });
      alone.parentNode.insertBefore(titleBlock(alone, site + alone.id + '/', edition, tile), alone);
      document.documentElement.classList.add('cp-alone'); // no sink over the chapter's title: the title block is above it
      var T = {}; try { T = JSON.parse(document.querySelector('meta[name="cp-titles"]').getAttribute('content')) || {}; } catch (e) { }
      document.title = T['/' + alone.id + '/'] || ((alone.getAttribute('data-title') || alone.id) + ' · Chip Supply Chain'); // the PDF's own title: the chapter page's approved title (build/page-titles.json), which search results show
      out.chapters = 1; out.chapter = alone.id;
    } else { printLede(); document.title = 'How AI chips are made · Chip Supply Chain'; } // the book's own title, which search results show, and never the chapter in view

    stills(); // after the other chapters go, so a chapter printed alone fetches only its own drawing

    /* chapters whose card opened a page after a short one in an earlier layout (from pdf.py): the head and the card
       are set closer (print.css .cp-tight), so that the end of In short and the card share a page */
    Object.keys(opts.tight || {}).forEach(function (id) {
      var ch = document.getElementById(id);
      if (ch && opts.tight[id]) ch.classList.add('cp-tight');
    });
    /* and chapters whose card, set closer, still ran into the notes: the card may break between its parts (.cp-split) */
    Object.keys(opts.split || {}).forEach(function (id) {
      var ch = document.getElementById(id);
      if (ch && opts.split[id]) ch.classList.add('cp-split');
    });
    /* headings an earlier layout left at the foot of a page open the next page instead (.cp-break) */
    Object.keys(opts.breaks || {}).forEach(function (id) {
      var h = document.getElementById(id);
      if (h && opts.breaks[id]) h.classList.add('cp-break');
    });
    /* and chapters that lost lines at a page's foot to Paged.js: their lines are set a little closer (.cp-nudge), so the
       page ends fall elsewhere */
    Object.keys(opts.nudge || {}).forEach(function (id) {
      var ch = document.getElementById(id);
      if (ch && opts.nudge[id]) ch.classList.add(opts.nudge[id] === 2 ? 'cp-loose' : 'cp-nudge'); // 2: a little looser (build/pdf.py)
    });
    /* and chapters whose last few sources ran onto a page of their own: the list is set closer (.cp-sources-tight) */
    Object.keys(opts.sources || {}).forEach(function (id) {
      var ch = document.getElementById(id);
      if (ch && opts.sources[id]) ch.classList.add('cp-sources-tight');
    });

    /* the edition: on the cover's last line, in the foot of every page, and in the citation at the end */
    if (edition) {
      out.edition = edition;
      each('.print-title .pt-meta', document, function (p) { p.textContent = edition + ' · ' + host; });
      editionStyle(host, edition, !!alone);
      var cTitle = alone ? alone.getAttribute('data-title') || '' : '';
      var cURL = alone ? site + alone.id + '/' : site + BOOK_PDF;
      var cKey = 'chipsupplychain' + ((/\d{4}/.exec(edition) || [''])[0]) + (alone ? alone.id.replace(/-/g, '') : '');
      each('.site-footer .cite:not(sup)', document, function (c) { c.remove(); });
      each('.site-footer', document, function (f) { f.appendChild(citeBox(cTitle, cURL, edition, cKey)); });
    }

    if (out.mode === 'endnotes') {
      /* the fallback: each chapter keeps its own numbered list, under the heading Notes */
      each('.chapter-sources > summary', document, function (s) { s.textContent = 'Notes'; });
      out.cites = document.querySelectorAll('sup.cite > a[data-t]').length;
      return out;
    }

    /* the class tells print.css the notes have moved to the foot of the page. The notes are short, so each chapter
       still ends with its source list, set for paper with every full address (sourceList). */
    document.documentElement.classList.add('cp-print');
    each('.chapter-sources', document, function (d) {
      var box = sourceList(d);
      if (box) d.parentNode.replaceChild(box, d); else d.remove();
    });
    runningHeads();

    /* the colophon's sentence about hovering and end-of-chapter lists is a screen sentence */
    each('.site-footer .sources-key', document, function (p) {
      p.innerHTML = p.innerHTML.replace(
        /Hover any footnote for the document; each chapter ends with its own source list\./,
        'Every source is a note at the foot of the page it is cited on, and each chapter ends with its own source list.');
    });

    each('sup.cite > a', document, function (a) {
      var sup = a.parentNode;
      if (!sup || !sup.parentNode) return;
      out.cites++;
      /* the number sits on its word, as a footnote does in print (the readable pages drop the same space) */
      var prev = sup.previousSibling;
      if (prev && prev.nodeType === 3 && /\s$/.test(prev.nodeValue)) prev.nodeValue = prev.nodeValue.replace(/\s+$/, '');
      var chapter = sup.closest ? sup.closest('article.chapter') : null;
      var key = (chapter && chapter.id ? chapter.id : 'x') + '/' + a.textContent.trim();
      sup.parentNode.insertBefore(noteFor(a, key), sup.nextSibling);
      out.notes++;
    });

    /* Paged.js must not start on its own: pdf.py drives it. Once it has loaded, and before it lays anything out, the note
       handler below goes first in its list (noteFlow). */
    window.PagedConfig = window.PagedConfig || {};
    window.PagedConfig.auto = false;
    window.PagedConfig.before = function () {
      var P = window.Paged;
      if (!P || !P.Handler || !P.registeredHandlers || window.__cpNoteFlow) return;
      window.__cpNoteFlow = true;
      P.registeredHandlers.unshift(noteFlow(P.Handler));
    };
    return out;
  }

  /* The notes at the foot of each page, kept to what the page holds. Paged.js 0.4.3 has two habits that leave pages part
     empty: it moves every note in a run of text to the foot before it looks for the end of the page, and when it cuts the
     page short it drops the notes of the calls it cut but keeps their room; and it gives a source cited twice on one page
     two notes. This handler, first in Paged.js's list, mends both while the page is laid out:
     - renderNode: a note whose source already has a note on this page leaves the flow before Paged.js moves it (the call
       in the text keeps its number, and the next page gets its own note from the source, as before);
     - onOverflow: before the page is cut, the notes are made to match the calls that stay on it, the room at the foot is
       set to fit them, and the end of the page is looked for again, one call at a time, until the two agree; when the
       page then has room for more, Paged.js is told so and goes on filling it. */
  function noteFlow(Handler) {
    function noteBox(el) {
      var area = el && el.closest ? el.closest('.pagedjs_area') : null;
      if (!area) return null;
      var content = area.querySelector('.pagedjs_footnote_content');
      var inner = content && content.querySelector('.pagedjs_footnote_inner_content');
      return inner ? { area: area, content: content, inner: inner } : null;
    }
    function px(style, a, b) { return (parseFloat(style[a]) || 0) + (parseFloat(style[b]) || 0); }
    /* the room the notes take, as Paged.js counts it: the notes, and the box's margins, borders and padding */
    function fit(box, any) {
      var h = 0;
      if (any) {
        var s = window.getComputedStyle(box.content);
        h = box.inner.getBoundingClientRect().height + px(s, 'marginTop', 'marginBottom') +
          px(s, 'borderTopWidth', 'borderBottomWidth') + px(s, 'paddingTop', 'paddingBottom');
      }
      box.area.style.setProperty('--pagedjs-footnotes-height', Math.ceil(h) + 'px');
      box.content.classList.toggle('pagedjs_footnote_empty', !any);
    }

    return class CPNoteFlow extends Handler {
      renderNode(node) {
        if (!node || node.nodeType !== 1 || !node.dataset) return;
        var notes = node.dataset.note === 'footnote' ? [node] : node.querySelectorAll('[data-note="footnote"]');
        if (!notes.length) return;
        var box = noteBox(node), page = node.closest('.pagedjs_page_content');
        if (!box || !page) return;
        var right = page.getBoundingClientRect().right, seen = {};
        each('[data-note="footnote"]', box.inner, function (n) { seen[n.getAttribute('data-k')] = 1; });
        /* a repeat stops being a note (Paged.js then passes it by) and stays in the text unseen (print.css, .fn-dup) */
        Array.prototype.forEach.call(notes, function (n) {
          var k = n.getAttribute('data-k');
          if (!k || n.getBoundingClientRect().left >= right) return; // past the page: Paged.js leaves it for the next one
          if (seen[k]) { n.removeAttribute('data-note'); n.classList.add('fn-dup'); } else seen[k] = 1;
        });
      }

      onOverflow(overflow, rendered, bounds, layout) {
        if (!overflow || !rendered || !layout || typeof layout.findOverflow !== 'function') return;
        var box = noteBox(rendered);
        if (!box) return;
        var notes = Array.prototype.filter.call(box.inner.children, function (n) { return n.dataset && n.dataset.note === 'footnote'; });
        if (!notes.length) return;
        /* the calls in the text, in order, each with its note; a note carried from the page before has no call here and stays */
        var calls = [], carried = [];
        notes.forEach(function (n) {
          var c = rendered.querySelector('[data-footnote-call="' + n.dataset.ref + '"]');
          if (c) calls.push({ call: c, note: n }); else carried.push(n);
        });
        if (!calls.length) return;
        var was = { h: box.area.style.getPropertyValue('--pagedjs-footnotes-height'), clip: box.inner.style.height };
        var set = function (k) { // the carried notes and the notes of the first k calls, the room fitted to them
          notes.forEach(function (n) { if (n.parentNode) n.remove(); });
          carried.forEach(function (n) { box.inner.appendChild(n); });
          calls.slice(0, k).forEach(function (c) { box.inner.appendChild(c.note); });
          box.inner.style.height = '';
          fit(box, carried.length + k > 0);
        };
        var before = function (c, end) { return !end || end.comparePoint(c.call, 0) < 0; }; // the call stays on the page
        /* Every call before the end Paged.js found needs its note; so take those, then one more call at a time: with the
           notes of the first k calls, the page ends somewhere. If call k+1 still falls on the page, its note is needed too.
           If call k falls off, the page ends there, with the notes of the calls still on it (fewer notes, so the text
           before that end fits). Otherwise the notes and the end agree. */
        var count = function (end) { return calls.filter(function (c) { return before(c, end); }).length; };
        var k = count(overflow), end, answer = null;
        for (; k <= calls.length; k++) {
          set(k);
          end = layout.findOverflow(rendered, bounds);
          if (k < calls.length && before(calls[k], end)) continue;
          answer = { k: k === 0 || before(calls[k - 1], end) ? k : count(end), end: end };
          break;
        }
        /* an answer that would leave the page with no text falls back to Paged.js's own */
        var lead = answer && answer.end ? document.createRange() : null;
        if (lead) { lead.setStart(rendered, 0); lead.setEnd(answer.end.startContainer, answer.end.startOffset); }
        if (!answer || (lead && !lead.toString().trim() && !lead.cloneContents().querySelector('img, svg, table'))) {
          set(calls.length);
          box.area.style.setProperty('--pagedjs-footnotes-height', was.h);
          box.inner.style.height = was.clip;
          return;
        }
        set(answer.k);
        return answer.end || null; // null: with its notes right, the page has room for more, and Paged.js carries on
      }
    };
  }

  /* how full a laid-out page is, from 0 to 1: from the top of the page's area to the last line of text, image or rule
     on it, and the notes */
  function fill(page) {
    var area = page.querySelector('.pagedjs_area'), content = page.querySelector('.pagedjs_page_content');
    if (!area || !content) return 1;
    var a = area.getBoundingClientRect(), bottom = inkBottom(content, a.bottom);
    var notes = page.querySelector('.pagedjs_footnote_area'), nh = notes ? notes.getBoundingClientRect().height : 0;
    return a.height ? Math.min(1, (Math.max(bottom, a.top) - a.top + nh) / a.height) : 1;
  }
  /* the lowest line of text, image, rule or box on the page (no lower than limit); the page's own column is to the left
     of what Paged.js holds over for the next page */
  function inkBottom(content, limit) {
    var c = content.getBoundingClientRect(), bottom = -Infinity, r = document.createRange();
    var low = function (q) { if (q.height > 0 && q.left < c.right && q.bottom > bottom) bottom = Math.min(q.bottom, limit); };
    var hidden = function (n) { return n.closest('.sr-only, .fn'); }; // text kept for screen readers, and notes still in the text
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.nodeValue.trim() || hidden(walker.currentNode.parentNode)) continue;
      r.selectNodeContents(walker.currentNode);
      Array.prototype.forEach.call(r.getClientRects(), low);
    }
    each('img, svg, hr, table, .stack-bar, .plate, .figure, .plain, .inshort, .cite', content, function (el) { if (!hidden(el)) low(el.getBoundingClientRect()); });
    return bottom;
  }

  /* Figures that left a gap: a figure (kept whole, with its title and source line) that opens a page, alone or under its
     heading, when the page before falls short. The text after it can fill that page, as text runs past a figure in a
     book: the answer is how many blocks to move the figure past, the paragraphs and lists that fit the gap with their
     notes and one more that can run on across the page's end, never past a heading, a table or another figure. pdf.py
     then lays the chapter out again with the figures moved (prepare({moves})). Figures carry no footnote marks, so the
     notes keep their order. The chokepoint card moves the same way (cardsToText gives it an id at the head of the text),
     but only past paragraphs that fit the gap whole: it then heads the next page as a plate. Its own marks come after the
     paragraph's in reading order either way. */
  var NOTE_LINE = 15; // px: one more note at the foot, as print.css sets them
  function floats(pages, fills) {
    var out = [];
    var area = pages[0] && pages[0].querySelector('.pagedjs_area'), H = area ? area.getBoundingClientRect().height : 0;
    for (var i = 1; i < pages.length; i++) {
      if (!(fills[i - 1] < 0.97)) continue;
      var content = pages[i].querySelector('.pagedjs_page_content');
      var first = content && content.querySelector('.figure, p, li, h2, h3, h4, h5, table, .plate, .plain, .inshort, .rv-keep, .cp-sources');
      if (first && /^H[2-5]$/.test(first.tagName)) first = first.nextElementSibling;
      if (!first || !first.matches('.figure[id], .plate[id]') || first.hasAttribute('data-split-from')) continue; // a figure's first part keeps its id
      /* a figure moves when the page before falls short; the card moves whenever the opening paragraph fits above it */
      var whole = first.matches('.plate');
      if (!whole && !(fills[i - 1] < 0.8)) continue;
      var gap = (1 - fills[i - 1]) * H, used = 0, k = 0, seen = {};
      /* the card's paragraph moves whole, to the head of the text, where the text block's top margin stands above it in
         place of its own (a move that still does not fit comes back in finish() as failed) */
      if (whole && first.nextElementSibling) {
        used = Math.max(0, (parseFloat(window.getComputedStyle(first.parentNode).marginTop) || 0) -
          (parseFloat(window.getComputedStyle(first.nextElementSibling).marginTop) || 0));
      }
      each('.pagedjs_footnote_inner_content .fn', pages[i - 1], function (n) { seen[n.getAttribute('data-k')] = 1; });
      for (var s = first.nextElementSibling; s; s = s.nextElementSibling) {
        if (!/^(P|UL|OL|BLOCKQUOTE)$/.test(s.tagName)) break;
        var h = 0, keys = {}, st = window.getComputedStyle(s);
        each('[data-ref="' + s.getAttribute('data-ref') + '"]', document, function (part) {
          h += part.getBoundingClientRect().height;
          each('.fn', part, function (n) { var key = n.getAttribute('data-k'); if (key && !seen[key]) keys[key] = 1; });
        });
        h += (parseFloat(st.marginTop) || 0) + (parseFloat(st.marginBottom) || 0) + Object.keys(keys).length * NOTE_LINE;
        if (used + h <= gap) { used += h; k++; Object.keys(keys).forEach(function (key) { seen[key] = 1; }); continue; }
        if (!whole && gap - used > 4 * NOTE_LINE) k++; // room for a few lines: it starts here and runs on above the figure's page
        break;
      }
      if (k) out.push({ id: first.id, k: k, page: i + 1 });
    }
    return out;
  }

  /* Called once Paged.js has laid the pages out. noteFlow has already given each source one note a page; any repeat
     left is taken out here. The report names the pages that fall short (under two-thirds full, the last page aside), a
     heading left at the foot of a page, a figure or card split across two, and a chapter whose last sources stand on a
     page of their own (sources). It also marks each chapter's opening page and the book's colophon, which carry no
     running head (print.css .cp-opener, .cp-colophon); that changes no layout. */
  function finish() {
    var out = { pages: 0, notes: 0, repeats: 0, stray: 0, overflow: 0, short: [], stranded: [], split: [], overlap: [], crowded: [], lost: [], lostIn: [], sources: [], strandedIds: [] };
    var pages = document.querySelectorAll('.pagedjs_page'), fills = [], alone = !!document.querySelector('.pagedjs_page .pt-chapter');
    Array.prototype.forEach.call(pages, function (page, i) {
      out.pages++;
      /* the first block of text on the page: a page that opens on the colophon carries no running head either */
      var box = page.querySelector('.pagedjs_page_content');
      var lead = box && box.querySelector('p, li, h2, h3, h4, h5, table, .figure, .plate, summary, pre');
      if (box && box.querySelector('article.chapter:not([data-split-from])')) page.classList.add('cp-opener');
      if (lead && lead.closest('.site-footer')) page.classList.add('cp-colophon');
      var seen = {};
      each('.pagedjs_footnote_inner_content .fn', page, function (fn) {
        var k = fn.getAttribute('data-k') || '';
        if (seen[k]) { fn.remove(); out.repeats++; return; }
        seen[k] = 1; out.notes++;
      });
      var inner = page.querySelector('.pagedjs_footnote_inner_content');
      var content = page.querySelector('.pagedjs_footnote_content');
      /* a source cited again keeps its first number, so a page's notes can come out of order (4, 3, 8): they are put in
         order of their numbers, which a reader looks them up by. The same notes in another order take the same room. */
      if (inner) {
        var fns = Array.prototype.slice.call(inner.querySelectorAll(':scope > .fn'));
        var num = function (fn) { var n = fn.querySelector('.fn-n'); return n ? parseInt(n.textContent, 10) || 0 : 0; };
        if (!fns.some(function (fn) { return fn.hasAttribute('data-split-from'); })) {
          fns.sort(function (x, y) { return num(x) - num(y); }).forEach(function (fn) { inner.appendChild(fn); });
        }
      }
      if (inner && content && inner.scrollHeight - content.clientHeight > 2) out.overflow++;
      /* Paged.js copies the note's classes onto the call it inserts; a .fn left in the text
         that is not a call is a note it could not move, and print.css hides it */
      out.stray += page.querySelectorAll('.pagedjs_page_content .fn:not([data-footnote-call]):not(.fn-dup)').length;
      var f = fills[i] = fill(page);
      /* text or a figure that runs down into the notes (a block kept whole that is taller than its page's room) */
      if (box && inkBottom(box, Infinity) > box.getBoundingClientRect().bottom + 2) {
        out.overlap.push(i + 1);
        var art = page.querySelector('.plate') ? page.querySelector('.plate').closest('article.chapter') : null;
        var aid = art ? art.id || art.getAttribute('data-id') : '';
        if (aid && out.crowded.indexOf(aid) < 0) out.crowded.push(aid);
      }
      /* a chapter's last page may fall short: in the book, the page after it opens the next chapter or the colophon */
      var ends = i < pages.length - 1 && !alone && pages[i + 1].querySelector('article.chapter:not([data-split-from]), .site-footer:not([data-split-from])');
      if (i < pages.length - 1 && !ends && f < 0.67 && !page.querySelector('.print-title, .contents')) out.short.push((i + 1) + ':' + Math.round(f * 100) + '%');
      each('.plate[data-split-to], .figure[data-split-to], .cp-sources li[data-split-to]', page, function (el) {
        out.split.push((i + 1) + ':' + (el.className.split(' ')[0] || el.tagName));
      });
      /* text that Paged.js left beyond the page's column would never print: a block kept whole that Chrome broke anyway */
      /* and a heading that is the last thing seen on a page that is not the last */
      if (box) {
        var right = box.getBoundingClientRect().right, rr = document.createRange(), tw = document.createTreeWalker(box, NodeFilter.SHOW_TEXT), gone = 0, seenLast = null;
        while (tw.nextNode()) {
          var tn = tw.currentNode;
          if (!tn.nodeValue.trim() || tn.parentNode.closest('.sr-only, .fn')) continue;
          rr.selectNodeContents(tn);
          var qs = Array.prototype.filter.call(rr.getClientRects(), function (q) { return q.width > 0; });
          if (qs.some(function (q) { return q.left >= right - 1; })) gone++;
          if (qs.some(function (q) { return q.left < right - 1; })) seenLast = tn;
        }
        if (gone) {
          out.lost.push((i + 1) + ':' + gone);
          /* and its chapter, which pdf.py lays out again set closer: the lines then fall elsewhere on the page */
          var lc = box.querySelector('article.chapter'), lid = lc ? lc.id || lc.getAttribute('data-id') : '';
          if (lid && out.lostIn.indexOf(lid) < 0) out.lostIn.push(lid);
        }
        var head = seenLast && seenLast.parentNode.closest('h2, h3, h4, h5, .fig-title, .cp-sources-h');
        if (head && i < pages.length - 1) {
          out.stranded.push((i + 1) + ':' + head.textContent.trim().slice(0, 40));
          /* its id, so pdf.py can lay the chapter out again with that heading opening the next page (.cp-break) */
          var hid = head.id || head.getAttribute('data-id') || '';
          if (hid && out.strandedIds.indexOf(hid) < 0) out.strandedIds.push(hid);
        }
      }
      /* the last few entries of a chapter's source list alone on a page, under a fifth of it, or (a chapter printed alone)
         its citation alone on the last page: that chapter's list is set closer next time (prepare({sources})) */
      var list = lead && lead.closest('.cp-sources'), sid = '';
      if (list) {
        var area = page.querySelector('.pagedjs_area'), a = area.getBoundingClientRect(), low = -Infinity;
        each('.cp-sources li', box, function (li) { low = Math.max(low, li.getBoundingClientRect().bottom); });
        var art = list.closest('article.chapter');
        if (art && a.height && (low - a.top) / a.height < 0.2) sid = art.id || art.getAttribute('data-id') || '';
      } else if (alone && i === pages.length - 1 && i > 0 && lead && lead.closest('.site-footer') && pages[i - 1].querySelector('.cp-sources')) {
        var only = document.querySelector('.pagedjs_page article.chapter[id]');
        sid = only ? only.id : '';
      }
      if (sid && out.sources.indexOf(sid) < 0) out.sources.push(sid);
    });
    out.floats = floats(pages, fills);
    /* a card moved down past a paragraph when the paragraph did not fit the page before after all: the paragraph then opens
       the card's page above it. pdf.py lays the chapter out again with the card back where it was. A card in its own place,
       after the lead, has the lead before it by design */
    out.failed = [];
    each('.pagedjs_page_content .plate[id^="card-"][data-cp-moved]', document, function (pl) {
      var prev = pl.previousElementSibling, pg = pl.closest('.pagedjs_page');
      if (!prev || pl.hasAttribute('data-split-from') || !pg || pg.classList.contains('cp-opener')) return;
      if (!prev.hasAttribute('data-split-from') && out.failed.indexOf(pl.id) < 0) out.failed.push(pl.id);
    });
    /* a card (kept whole) that opens a page when the page before falls short: its chapter, for a closer setting, unless the
       opening paragraph can move up to fill that page (floats, above) */
    out.tight = [];
    var moving = {};
    out.floats.forEach(function (f) { moving[f.id] = 1; });
    for (var i = 1; i < pages.length; i++) {
      var first = pages[i].querySelector('.pagedjs_page_content .plate, .pagedjs_page_content p, .pagedjs_page_content li, .pagedjs_page_content h2'); // a section's heading (h3 until 29 Oct 2026)
      var ch = first && first.matches('.plate') && !first.hasAttribute('data-split-from') && !moving[first.id] && fills[i - 1] < 0.8 ? first.closest('article.chapter') : null;
      var cid = ch ? ch.id || ch.getAttribute('data-id') : ''; // Paged.js moves the id of a split element's later parts to data-id
      if (cid && out.tight.indexOf(cid) < 0) out.tight.push(cid);
    }
    /* the room left short on every page but the last, in pages: pdf.py keeps the layout with the least */
    out.gap = Math.round(fills.slice(0, -1).reduce(function (a, f) { return a + (1 - f); }, 0) * 100) / 100;
    return out;
  }

  window.CP_PRINT = { prepare: prepare, fontsReady: fontsReady, finish: finish };
})();

} catch (e) { console.warn('module print.js failed', e); }

/* module: summary-a.js */
try {
/* summary-a: the atlas on the Suppliers page (and the map-first summary at #/summary-a).
 * The plate is rendered whole by build/modules/summary-a.js; this file only
 * switches which country is chosen: its buttons, its stops and strip cards,
 * and its panel beside the map (which carries the country's role line). Everything is a real button, so keyboard and screen
 * readers get the same page. */
(function () {
  var CP = window.CP;
  if (!CP) return;
  var $ = CP.$, $$ = CP.$$;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverable = !window.matchMedia || matchMedia('(hover: hover)').matches;
  var root = null, map = null, bound = false;

  // a panel taller than the plate scrolls inside it; the fade at its foot stays until the reader reaches the end
  function more(panel) {
    if (!panel || !panel.parentNode) return;
    panel.parentNode.setAttribute('data-more', panel.scrollHeight - panel.clientHeight - panel.scrollTop > 6 ? '1' : '0');
  }

  // no country chosen: every chip, marker and stop is off, and the neutral panel says how to pick one
  function clearCountry() {
    if (map) map.removeAttribute('data-cc');
    var at = $('.atlas', root); if (at) at.removeAttribute('data-cc'); // the strip under the map reads the choice from the plate
    $$('.sa-marker, .sa-chip, .sa-role', root).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    $$('.sa-town, .sa-stop, .sa-stopcard', root).forEach(function (el) { el.classList.remove('is-on'); });
    $$('.sa-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-cc') !== 'none'; });
    more($('.sa-panel[data-cc="none"]', root));
    if (CP.Suppliers && CP.Suppliers.light) CP.Suppliers.light('');
  }
  // a chip or marker that was already chosen when it was pressed clears the choice; any other selects its country
  var wasOn = null;
  function toggleCountry(b, fromMap) {
    var on = wasOn === null ? b.getAttribute('aria-pressed') === 'true' : wasOn;
    wasOn = null;
    if (on) clearCountry(); else selectCountry(b.getAttribute('data-cc'), fromMap);
  }

  function selectCountry(cc, fromMap) {
    if (!cc || !$('.sa-panel[data-cc="' + cc + '"]', root)) return;
    if (map) map.setAttribute('data-cc', cc);
    var at = $('.atlas', root); if (at) at.setAttribute('data-cc', cc);
    $$('.sa-marker, .sa-chip, .sa-role', root).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-cc') === cc ? 'true' : 'false');
    });
    $$('.sa-town', root).forEach(function (t) {
      t.classList.toggle('is-on', t.getAttribute('data-cc') === cc);
    });
    // the route answers: the chosen country's stops stay dark and carry their towns, the others turn gray, and so do the strip's cards
    $$('.sa-stop, .sa-stopcard', root).forEach(function (el) {
      el.classList.toggle('is-on', el.getAttribute('data-cc') === cc);
    });
    $$('.sa-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-cc') !== cc; });
    var panel = $('.sa-panel[data-cc="' + cc + '"]', root);
    if (panel) { panel.scrollTop = 0; more(panel); }
    // the ribbons under the map follow the same country
    if (CP.Suppliers && CP.Suppliers.light) CP.Suppliers.light(cc);
    if (window.innerWidth < 900) {
      var chip = $('.sa-role[data-cc="' + cc + '"]', root); // the chip row scrolls sideways on a phone: keep the chosen chip in view
      if (chip && chip.scrollIntoView) chip.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      // on phones the panel is under the map, so bring it into view after a tap
      if (fromMap && panel) {
        var top = panel.getBoundingClientRect().top;
        if (top > window.innerHeight - 120) panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }
    }
  }

  function selectStage(id) {
    if (!id || !$('.sa-stage-detail[data-id="' + id + '"]', root)) return;
    $$('.sa-tile', root).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-id') === id ? 'true' : 'false');
    });
    $$('.sa-stage-detail', root).forEach(function (d) { d.hidden = d.getAttribute('data-id') !== id; });
  }

  function bind() {
    if (bound) return;
    root = $('.view:not([hidden]) .sa') || $('.sa');
    if (!root) return;
    map = $('.sa-map', root);
    bound = true;

    // read a chip's or marker's state as the press begins, before the focus handler below can select it
    root.addEventListener('pointerdown', function (e) {
      var b = e.target.closest ? e.target.closest('.sa-marker, .sa-chip, .sa-role') : null;
      wasOn = b ? b.getAttribute('aria-pressed') === 'true' : null;
    });
    root.addEventListener('click', function (e) {
      var marker = e.target.closest ? e.target.closest('.sa-marker, .sa-town') : null;
      if (marker) {
        if (marker.getAttribute('data-dead')) return;
        if (marker.classList.contains('sa-marker')) toggleCountry(marker, true); else selectCountry(marker.getAttribute('data-cc'), true);
        return;
      }
      var chip = e.target.closest ? e.target.closest('.sa-chip, .sa-role') : null;
      if (chip) { toggleCountry(chip, false); return; }
      // a stop on the map or in the strip opens its country's panel here; the panel's rows lead to the chapters
      var stop = e.target.closest ? e.target.closest('.sa-stop, .sa-stopcard') : null;
      if (stop && stop.getAttribute('data-cc')) { e.preventDefault(); selectCountry(stop.getAttribute('data-cc'), true); return; }
      var tile = e.target.closest ? e.target.closest('.sa-tile') : null;
      if (tile) selectStage(tile.getAttribute('data-id'));
    });

    // stage tiles read on hover and on keyboard focus as well as on tap
    $$('.sa-tile', root).forEach(function (b) {
      b.addEventListener('focus', function () { selectStage(b.getAttribute('data-id')); });
      if (hoverable) b.addEventListener('mouseenter', function () { selectStage(b.getAttribute('data-id')); });
    });
    if (hoverable) {
      $$('.sa-marker', root).forEach(function (b) {
        b.addEventListener('focus', function () { selectCountry(b.getAttribute('data-cc'), false); });
      });
    }

    // the panel's inner scroll: the fade at its foot goes once the end is in view
    root.addEventListener('scroll', function (e) { if (e.target.classList && e.target.classList.contains('sa-panel')) more(e.target); }, true);
    window.addEventListener('resize', function () { more($('.sa-panel:not([hidden])', root)); });

    // the route's stops: a card on hover or focus with the stage, its town, who leads it and its concentration band
    // it stays while the pointer crosses onto it, and Escape closes it (WCAG 1.4.13; accessibility #10)
    var tip = null, tipT = null;
    var showStop = function (a) {
      clearTimeout(tipT);
      if (!tip) {
        tip = document.createElement('div'); tip.className = 'sa-stop-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true; document.body.appendChild(tip);
        tip.addEventListener('mouseenter', function () { clearTimeout(tipT); });
        tip.addEventListener('mouseleave', function () { hideStop(); });
      }
      var d = a.dataset;
      tip.innerHTML = '<b>' + a.querySelector('span').textContent + ' · ' + d.title + '</b><span>' + d.town + (d.lead ? ' · ' + d.lead : '') + '</span>' + (d.band ? '<span class="sa-stop-tip-s">' + d.band + ' concentration</span>' : '');
      tip.hidden = false;
      var r = a.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
      var left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8)), top = r.top - h - 10;
      if (top < 8) top = r.bottom + 10;
      tip.style.left = Math.round(left) + 'px'; tip.style.top = Math.round(top + window.scrollY) + 'px';
      $$('.sa-stopcard', root).forEach(function (c) { c.classList.toggle('is-hot', c.getAttribute('href') === a.getAttribute('href')); });
    };
    var hideStop = function () { clearTimeout(tipT); if (tip) tip.hidden = true; $$('.sa-stopcard.is-hot', root).forEach(function (c) { c.classList.remove('is-hot'); }); };
    root.addEventListener('mouseover', function (e) { var a = e.target.closest ? e.target.closest('.sa-stop') : null; if (a) showStop(a); });
    root.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest('.sa-stop')) { clearTimeout(tipT); tipT = setTimeout(hideStop, 260); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && tip && !tip.hidden) hideStop(); });
    root.addEventListener('focusin', function (e) { var a = e.target.closest ? e.target.closest('.sa-stop') : null; if (a) showStop(a); else hideStop(); });
    window.addEventListener('scroll', function () { hideStop(); }, { passive: true });

    // the panel opens on the country the build marked, if any; make the chips, the stops, the strip and the ribbons agree
    var open = $('.sa-panel:not([hidden])', root), cc0 = open && open.getAttribute('data-cc');
    if (cc0 && cc0 !== 'none') selectCountry(cc0, false); else clearCountry();
  }

  // #/suppliers?country=JP opens the Suppliers page with that country chosen on the plate (the Index's country cards link here)
  function fromHash() {
    var m = (location.hash || '').match(/[?&]country=([A-Za-z]{2})\b/);
    if (!m) return;
    bind(); if (!root) return;
    var cc = m[1].toUpperCase();
    if (!$('.sa-panel[data-cc="' + cc + '"]', root)) return;
    selectCountry(cc, false);
    // the router resets the scroll after activation; after that, bring the plate in if it is off screen, or the panel on a phone, where it sits under the map
    setTimeout(function () {
      var narrow = window.innerWidth < 900, target = narrow ? $('.sa-panel[data-cc="' + cc + '"]', root) : $('.atlas', root);
      if (!target) return;
      var top = target.getBoundingClientRect().top;
      if (narrow || top < 0 || top > window.innerHeight * 0.6) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }, 80);
  }

  CP.SummaryA = { selectCountry: selectCountry, clearCountry: clearCountry, fromHash: fromHash };
  CP.register('summary-a', { stage: false, activate: bind });
  CP.register('suppliers', { stage: false, activate: function () { bind(); fromHash(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

} catch (e) { console.warn('module summary-a.js failed', e); }

/* module: supshares.js */
try {
/* The Suppliers ribbons, by share (build/modules/supplier-shares.js writes the section and its data; the owner's approved
   mockup 6 of 29 Oct 2026, third round). Which countries hold each of the matrix's twenty segments, from
   data/chokepoint-matrix.json.

   600 px and wider: a ribbon drawing. Countries on the left, the segments on the right in chain order. Each segment is one
   whole, drawn at one height, and where a ribbon meets a segment its width is that country's share. At the country end every
   ribbon narrows to a point, so no country is drawn with a size and no sum of shares is ever drawn. The countries are evenly
   spaced and ordered to cross as little as possible (ORDER). Each segment's slices are stacked largest first, with the two
   catch-all columns last (row.order). The firms show in the box that hovering or focusing a segment opens, so the column
   of names stays clean (owner, 29 Oct 2026). Narrower than 600 px, where nothing hovers: one row per segment, the name, a
   full-width strip of its shares and its firms.

   Gray throughout until the reader follows a country: its ribbons or slices turn wine, its share is printed at every segment
   it reaches, its firms (on a phone) go to ink and the Table sets its shares in bold. Hovering or focusing a segment prints
   each country's share at the left. Segments with no country split show only their name (and, on a phone, their firms). Every share is printed as the
   matrix writes it (row.sharesT). Year and measure appear only where a row is not 2025 revenue. The route's chosen country
   (src/modules/summary-a.js, through Suppliers.light) follows its column, where it has one. */
(function () {
  'use strict';
  var D = document, sec = D.getElementById('sup-pipe'), data = D.getElementById('sup-shares-data');
  if (!sec || !data || !sec.classList.contains('ss')) return;
  var ROWS; try { ROWS = JSON.parse(data.textContent); } catch (e) { return; }
  var COLS = ['US', 'JP', 'CN', 'TW', 'KR', 'NL', 'DE', 'GB', 'IL', 'EU-other', 'Other'];
  var NAME = { US: 'United States', JP: 'Japan', CN: 'China', TW: 'Taiwan', KR: 'South Korea', NL: 'Netherlands', DE: 'Germany', GB: 'United Kingdom', IL: 'Israel', 'EU-other': 'Other EU', Other: 'Other' };
  var OWN = { US: 'The United States’', JP: 'Japan’s', CN: 'China’s', TW: 'Taiwan’s', KR: 'South Korea’s', NL: 'The Netherlands’', DE: 'Germany’s', GB: 'The United Kingdom’s', IL: 'Israel’s', 'EU-other': 'Other EU countries’', Other: 'Other countries’' };
  // the phone strip's labels: a country's code, and UK for the United Kingdom, as readers know it (owner, 29 Oct 2026)
  var CODE = { US: 'US', JP: 'JP', CN: 'CN', TW: 'TW', KR: 'KR', NL: 'NL', DE: 'DE', GB: 'UK', IL: 'IL', 'EU-other': 'Other EU', Other: 'Other' };
  var cname = function (cc) { return window.CP && CP.cname ? CP.cname(cc) : cc; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var share = function (r, c) { return r.sharesT[c] + '%'; }; // as the matrix writes it: 6.0 stays 6.0
  var lower = function (s) { return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; };
  var capacity = function (r) { return /site location/.test(r.metric || ''); };
  // the mark after a segment's name, only where the row is not 2025 revenue (the key says so once)
  var mark = function (r) { return r.shares ? [capacity(r) ? 'capacity' : '', r.year !== 2025 ? String(r.year) : ''].filter(Boolean).join(', ') : ''; };
  var whenT = function (r) { return (capacity(r) ? 'Share of plant capacity, by plant location' : r.metric) + ', ' + r.year + (/estimate|derived/.test(r.basis || '') ? ', ' + r.basisT : ''); };
  var srcT = function (r) { return r.srcShort + (r.via ? ' (' + r.via + ')' : ''); };
  var sharesT = function (r) { return r.order.map(function (c) { return NAME[c] + ' ' + share(r, c); }).join(', '); };
  var state = { lit: '', W: 0, phone: false, room: 0, font: '', hotSeg: -1, rib: null, geo: null };
  var host = sec.querySelector('.ss-draw'), tip = sec.querySelector('.ss-tip'), chipsEl = sec.querySelector('.ss-chips'), tableBox = sec.querySelector('.ss-tablebox'), plot = sec.querySelector('.ss-plot'), ctx;
  var paper = window.matchMedia ? matchMedia('print') : { matches: false };

  /* ---- the countries' order down the left: the one with the least crossing, each crossing weighted by the two ribbons'
     shares. Where a ribbon meets its segment does not depend on the order, so the cost of putting a above b is fixed and an
     exact search over the 2^11 subsets is quick. */
  var ORDER = (function () {
    var at = {}; // a ribbon's middle where it meets its segment, in share points down the right-hand column
    ROWS.forEach(function (r, i) { var y = i * 113; (r.order || []).forEach(function (c) { var v = r.shares[c]; at[c + i] = y + v / 2; y += v; }); });
    var rib = {}; COLS.forEach(function (c) { rib[c] = []; });
    ROWS.forEach(function (r, i) { (r.order || []).forEach(function (c) { rib[c].push([at[c + i], r.shares[c]]); }); });
    var n = COLS.length, cost = [];
    for (var a = 0; a < n; a++) {
      cost.push([]);
      for (var b = 0; b < n; b++) { var s = 0; rib[COLS[a]].forEach(function (p) { rib[COLS[b]].forEach(function (q) { if (p[0] > q[0]) s += p[1] * q[1]; }); }); cost[a].push(s); }
    }
    var full = (1 << n) - 1, best = [], from = [];
    for (var z = 0; z <= full; z++) { best.push(Infinity); from.push(-1); }
    best[0] = 0;
    for (var m = 0; m < full; m++) {
      if (best[m] === Infinity) continue;
      for (var k = 0; k < n; k++) {
        if (m & (1 << k)) continue;
        var add = 0;
        for (var j = 0; j < n; j++) if (m & (1 << j)) add += cost[j][k]; // j above k
        var m2 = m | (1 << k); if (best[m] + add < best[m2]) { best[m2] = best[m] + add; from[m2] = k; }
      }
    }
    var out = [], mm = full; while (mm) { var k2 = from[mm]; out.unshift(COLS[k2]); mm &= ~(1 << k2); }
    return out;
  })();

  /* ---- the firms under a segment on a phone: the followed country's first, then the segment's own order, at most three */
  function width(s, font) { if (!ctx) ctx = D.createElement('canvas').getContext('2d'); ctx.font = font || state.font; return ctx.measureText(s).width; }
  function lineFirms(r) {
    var lit = state.lit, list = r.firms;
    if (lit) list = list.filter(function (f) { return f.col === lit; }).concat(list.filter(function (f) { return f.col !== lit; }));
    var out = [], w = 0, sep = width(' · ');
    for (var k = 0; k < list.length && out.length < 3; k++) {
      var fw = width(list[k].s) + (out.length ? sep : 0);
      if (out.length && w + fw > state.room) break;
      out.push(list[k]); w += fw;
    }
    return out;
  }
  function namesHTML(r, tag) {
    return lineFirms(r).map(function (f, k) {
      return (k ? '<' + tag + ' class="ss-fsep"> · </' + tag + '>' : '') + '<' + tag + ' class="ss-fn' + (state.lit ? (f.col === state.lit ? ' on' : ' off') : '') + '">' + esc(f.s) + '</' + tag + '>';
    }).join('');
  }
  function aria(r) {
    var f = r.firms.slice(0, 3).map(function (x) { return x.s; }).join(', ');
    return r.name + '. ' + (r.shares ? sharesT(r) + '. ' : '') + (f ? 'Firms: ' + f + '. ' : '') + (r.shares ? whenT(r) + ', ' + srcT(r) + '.' : '');
  }

  function draw() {
    var W = Math.round(host.clientWidth); if (!W) return;
    state.W = W; state.phone = W < 600;
    clearHot();
    if (state.phone) drawRows(); else drawRibbons(W);
    paintLit();
  }

  /* ---- 600 px and wider: the ribbons ---- */
  function drawRibbons(W) {
    var ui = getComputedStyle(D.documentElement).getPropertyValue('--font-ui').trim() || 'sans-serif';
    var n = ROWS.length, segH = 30, gR = 4, padT = 10, inner = n * segH + (n - 1) * gR, H = inner + padT * 2, u = segH / 100;
    var fsL = W < 1000 ? 12.5 : 13.5, fsR = 12.5;
    var labW = Math.max.apply(null, COLS.map(function (c) { return width(NAME[c], '500 ' + fsL + 'px ' + ui); }));
    var x0 = Math.ceil(labW) + 18, x1 = W - 300, wR = 10, xl = x1 + wR + 8;
    state.font = '400 12px ' + ui; state.room = W - xl - 4;
    // the country ends: a point each, evenly spaced
    var step = inner / ORDER.length, left = {};
    ORDER.forEach(function (c, k) { left[c] = { x: x0 + 4, mid: padT + (k + 0.5) * step }; });
    // the right ends: each segment's slices stacked in its own order, largest first
    var ends = [];
    ROWS.forEach(function (r, i) {
      var y = padT + i * (segH + gR); ends.push({});
      (r.order || []).forEach(function (c) { var v = r.shares[c] * u; ends[i][c] = [y, y + v]; y += v; });
    });
    // a ribbon: from its country's point to its slice of the segment
    var ribs = '', xa = x0 + 4, mx = (xa + x1) / 2;
    ORDER.forEach(function (c) {
      var a = left[c].mid.toFixed(2);
      ROWS.forEach(function (r, i) {
        var b = ends[i][c]; if (!b) return;
        ribs += '<path class="sup-band sup-rib" data-c="' + c + '" data-i="' + i + '" d="M' + xa + ',' + a +
          ' C' + mx.toFixed(1) + ',' + a + ' ' + mx.toFixed(1) + ',' + b[0].toFixed(2) + ' ' + x1 + ',' + b[0].toFixed(2) +
          ' L' + x1 + ',' + b[1].toFixed(2) + ' C' + mx.toFixed(1) + ',' + b[1].toFixed(2) + ' ' + mx.toFixed(1) + ',' + a + ' ' + xa + ',' + a + 'Z"></path>';
      });
    });
    var nodesL = '', labL = '';
    ORDER.forEach(function (c) {
      var L = left[c];
      nodesL += '<circle class="sup-cnode" cx="' + L.x + '" cy="' + L.mid.toFixed(1) + '" r="3.5"></circle>';
      labL += '<text class="sup-clab ss-clab" data-c="' + c + '" x="' + (x0 - 8) + '" y="' + (L.mid + 4.5).toFixed(1) + '" font-size="' + fsL + '">' + esc(NAME[c]) + '</text>';
    });
    var nodesR = '', labR = '', hits = '';
    ROWS.forEach(function (r, i) {
      var y = padT + i * (segH + gR), m = mark(r);
      if (r.shares) nodesR += '<rect class="sup-snode" x="' + x1 + '" y="' + y.toFixed(1) + '" width="' + wR + '" height="' + segH + '"></rect>';
      labR += '<g class="sup-lab" data-i="' + i + '"><text class="sup-lab-t" x="' + xl + '" y="' + (y + segH / 2 + 4.5).toFixed(1) + '" font-size="' + fsR + '">' + esc(r.name) +
        (m ? '<tspan class="ss-mk"> · ' + esc(m) + '</tspan>' : '') + '</text></g>';
      hits += '<rect class="sup-hit ss-hit" data-i="' + i + '" x="' + (x1 - 4) + '" y="' + y.toFixed(1) + '" width="' + (W - x1 + 4) + '" height="' + segH + '" tabindex="0" role="button" aria-describedby="sup-ss-hint" aria-label="' + esc(aria(r)) + '"></rect>';
    });
    state.geo = { left: left, ends: ends, x1: x1 };
    host.innerHTML = '<svg class="sup-pipe-svg ss-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="Countries to segments. Where a ribbon meets a segment, its width is that country’s share.">' +
      '<g class="sup-flow">' + ribs + nodesL + nodesR + '<g class="sup-labels">' + labR + '</g></g><g pointer-events="none">' + labL + '<g class="ss-endv"></g><g class="ss-hotv"></g></g><g class="ss-hits">' + hits + '</g></svg>';
    wire(host.querySelector('svg'));
  }
  // the followed country's share at every segment it reaches
  function paintEnds() {
    var g = host.querySelector('.ss-endv'); if (!g) return;
    var c = state.lit, G = state.geo;
    g.innerHTML = c ? ROWS.map(function (r, i) { var e = G.ends[i][c]; return e ? '<text class="ss-v ss-v-lit" x="' + (G.x1 - 6) + '" y="' + ((e[0] + e[1]) / 2 + 4).toFixed(1) + '" text-anchor="end">' + share(r, c) + '</text>' : ''; }).join('') : '';
  }
  // a segment hovered or focused: each country's share beside it at the left
  function paintHot() {
    var g = host.querySelector('.ss-hotv'); if (!g) return;
    var i = state.hotSeg, G = state.geo, r = ROWS[i];
    g.innerHTML = i >= 0 && r.shares ? r.order.map(function (c) { var L = G.left[c]; return '<text class="ss-v" x="' + (L.x + 9) + '" y="' + (L.mid + 4).toFixed(1) + '">' + share(r, c) + '</text>'; }).join('') : '';
  }

  /* ---- the drawing's tips, by pointer, touch and keyboard ---- */
  function wire(svg) {
    svg.addEventListener('mouseover', function (e) { pick(e, false); });
    svg.addEventListener('click', function (e) { if (!pick(e, true)) clearHot(); });
    svg.addEventListener('mouseleave', function () { setTimeout(function () { if (!tip.matches(':hover') && !svg.contains(D.activeElement)) clearHot(); }, 240); });
    svg.addEventListener('focusin', function (e) { var h = e.target.closest('.ss-hit'); if (h) showSeg(+h.getAttribute('data-i'), h); });
    svg.addEventListener('focusout', function (e) { if (!svg.contains(e.relatedTarget)) clearHot(); });
    svg.addEventListener('keydown', function (e) {
      var h = e.target.closest('.ss-hit'); if (!h) return;
      var i = +h.getAttribute('data-i'), r = ROWS[i], k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowLeft') {
        if (!r.shares) return;
        e.preventDefault();
        var at = state.rib && state.rib.i === i ? r.order.indexOf(state.rib.c) : -1, len = r.order.length;
        at = k === 'ArrowRight' ? (at + 1) % len : (at <= 0 ? len - 1 : at - 1);
        showRib(r.order[at], i, null);
      } else if (k === 'ArrowDown' || k === 'ArrowUp') {
        var t = svg.querySelector('.ss-hit[data-i="' + (i + (k === 'ArrowDown' ? 1 : -1)) + '"]');
        if (t) { e.preventDefault(); t.focus(); }
      } else if (k === 'Enter' || k === ' ') { e.preventDefault(); showSeg(i, h); }
    });
  }
  function pick(e, tap) {
    var rib = e.target.closest('.sup-rib'), h = e.target.closest('.ss-hit');
    if (rib) { showRib(rib.getAttribute('data-c'), +rib.getAttribute('data-i'), e); return true; }
    if (h) { if (tap || state.hotSeg !== +h.getAttribute('data-i') || state.rib) showSeg(+h.getAttribute('data-i'), h); return true; }
    return false;
  }
  function hot(fn) {
    var svg = host.querySelector('svg'); if (!svg) return;
    svg.setAttribute('data-hot', fn ? '1' : '0');
    [].forEach.call(svg.querySelectorAll('.sup-rib'), function (p) { if (fn && fn(p)) p.setAttribute('data-hot', '1'); else p.removeAttribute('data-hot'); });
  }
  function showSeg(i, anchor) {
    var r = ROWS[i]; state.hotSeg = i; state.rib = null;
    hot(function (p) { return +p.getAttribute('data-i') === i; }); paintHot();
    // the segment's firms, now only here on a wide screen (owner, 29 Oct 2026): the followed country's first, at most five
    var lit = state.lit, list = lit ? r.firms.filter(function (x) { return x.col === lit; }).concat(r.firms.filter(function (x) { return x.col !== lit; })) : r.firms;
    var f = list.slice(0, 5).map(function (x) { return esc(x.s); }).join(', ') + (list.length > 5 ? ', and ' + (list.length - 5) + ' more' : '');
    var fl = f ? '<span class="ss-tip-firms"><span class="k">Firms on the list</span>' + f + '</span>' : '';
    tip.innerHTML = '<b>' + esc(r.name) + '</b>' + (r.shares ? '<span class="sup-tip-n">' + esc(whenT(r)) + '</span>' + fl + srcHTML(r) : fl);
    // in the label column, under the segment (over it near the foot), so it hides neither the segment's ribbons nor the
    // shares printed at the left
    var m = plot.getBoundingClientRect(), b = anchor.getBoundingClientRect();
    tip.style.maxWidth = Math.round(b.width) + 'px'; tip.hidden = false;
    var top = b.bottom - m.top + 6;
    if (top + tip.offsetHeight > m.height) top = b.top - m.top - tip.offsetHeight - 6;
    tip.style.left = Math.round(Math.min(b.left - m.left, m.width - tip.offsetWidth)) + 'px'; tip.style.top = Math.round(top) + 'px';
  }
  function showRib(c, i, ev) {
    var r = ROWS[i]; state.hotSeg = -1; state.rib = { c: c, i: i };
    var svg = host.querySelector('svg'), el = svg.querySelector('.sup-rib[data-c="' + c + '"][data-i="' + i + '"]');
    hot(function (p) { return p === el; }); paintHot();
    var firms = r.firms.filter(function (f) { return f.col === c; }).map(function (f) { return esc(f.s) + (c === 'Other' || c === 'EU-other' ? ' (' + esc(cname(f.cc)) + ')' : ''); });
    tip.innerHTML = '<b>' + esc(OWN[c]) + ' share of ' + esc(lower(r.name)) + '</b><span class="sup-tip-n">' + esc(whenT(r)) + '</span>' +
      '<span class="ss-tip-big">' + share(r, c) + '</span>' +
      (firms.length ? '<span class="ss-tip-firms"><span class="k">' + (capacity(r) ? 'Firms on the list based here' : 'Firms on the list') + '</span>' + firms.join(', ') + '</span>' : '') + srcHTML(r);
    if (ev) place(ev, el);
    else { var G = state.geo, e = G.ends[i][c], b = svg.getBoundingClientRect(); place({ clientX: b.left + G.x1 - 70, clientY: b.top + (e[0] + e[1]) / 2 }, el); }
  }
  function clearHot() {
    state.hotSeg = -1; state.rib = null;
    if (tip) tip.hidden = true;
    if (host) { hot(null); paintHot(); }
  }
  function place(ev, anchor) {
    var m = plot.getBoundingClientRect(), r = anchor.getBoundingClientRect();
    tip.style.maxWidth = ''; tip.hidden = false;
    var cx = ev && ev.clientX != null ? ev.clientX : (r.left + r.right) / 2, cy = ev && ev.clientY != null ? ev.clientY : r.top;
    var left = Math.max(0, Math.min(cx - m.left - tip.offsetWidth / 2, m.width - tip.offsetWidth)), top = cy - m.top - tip.offsetHeight - 14;
    if (top < 0) top = cy - m.top + 18;
    tip.style.left = Math.round(left) + 'px'; tip.style.top = Math.round(top) + 'px';
  }
  function srcHTML(r) {
    return '<span class="ss-tip-src">Source: <a href="' + esc(r.src) + '" target="_blank" rel="noopener">' + esc(r.srcTitle) + '</a>' + (r.via ? ', with ' + esc(r.via) + ' data' : '') + '.</span>';
  }

  /* ---- narrower than 600 px: one row per segment, its shares as a full-width strip ---- */
  function drawRows() {
    var ui = getComputedStyle(D.documentElement).getPropertyValue('--font-ui').trim() || 'sans-serif';
    var sw = Math.round(host.clientWidth), f = '600 11.5px ' + ui;
    state.font = '400 11.5px ' + ui; state.room = Infinity; state.geo = null;
    host.innerHTML = '<ol class="ss-rows">' + ROWS.map(function (r, i) {
      var m = mark(r), strip = '', rest = [];
      if (r.shares) {
        strip = '<div class="ss-strip" aria-hidden="true">' + r.order.map(function (c) {
          var v = r.shares[c], t = CODE[c] + ' ' + share(r, c), fits = width(t, f) + 10 <= sw * v / 100;
          if (!fits) rest.push(c);
          return '<span class="ss-sl" data-c="' + c + '" style="width:' + v + '%">' + (fits ? '<b>' + esc(t) + '</b>' : '') + '</span>';
        }).join('') + '</div>';
      }
      return '<li class="ss-row"><p class="ss-row-h">' + esc(r.name) + (m ? ' <span class="ss-mk">· ' + esc(m) + '</span>' : '') + '</p>' + strip +
        (r.shares ? '<p class="ss-sr sr-only">' + esc(sharesT(r)) + '</p>' : '') +
        (rest.length ? '<p class="ss-rest" aria-hidden="true">' + rest.map(function (c) { return '<span data-c="' + c + '">' + esc(NAME[c]) + ' ' + share(r, c) + '</span>'; }).join(' · ') + '</p>' : '') +
        '<p class="ss-row-f" data-i="' + i + '"></p></li>';
    }).join('') + '</ol>';
  }

  /* ---- the country followed: its ribbons or slices in wine, its shares printed, its firms in ink, its Table shares bold ---- */
  function paintLit() {
    var c = state.lit;
    sec.setAttribute('data-lit', c ? '1' : '0');
    [].forEach.call(sec.querySelectorAll('.sup-rib, .ss-sl, .ss-rest span, .ss-tc'), function (p) { if (c && p.getAttribute('data-c') === c) p.setAttribute('data-lit', '1'); else p.removeAttribute('data-lit'); });
    [].forEach.call(sec.querySelectorAll('.ss-clab'), function (t) { t.classList.toggle('on', t.getAttribute('data-c') === c); });
    [].forEach.call(sec.querySelectorAll('.ss-row-f'), function (t) { t.innerHTML = namesHTML(ROWS[+t.getAttribute('data-i')], 'span'); });
    [].forEach.call(chipsEl.querySelectorAll('.sup-chip'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-c') === c ? 'true' : 'false'); });
    if (state.geo) paintEnds();
  }
  function follow(c) { state.lit = c && COLS.indexOf(c) >= 0 ? c : ''; paintLit(); }

  chipsEl.addEventListener('click', function (e) { var b = e.target.closest('.sup-chip'); if (!b) return; var c = b.getAttribute('data-c'); follow(state.lit === c ? '' : c); });
  var tb = sec.querySelector('.ss-tab');
  tb.addEventListener('click', function () { var on = tableBox.hidden; tableBox.hidden = !on; host.hidden = on; clearHot(); tb.setAttribute('aria-pressed', on ? 'true' : 'false'); if (!on) draw(); });
  tip.addEventListener('mouseleave', function () { if (!host.querySelector('svg:hover')) clearHot(); });
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !tip.hidden) clearHot(); });
  D.addEventListener('click', function (e) { if (!tip.hidden && !e.target.closest('.ss-plot')) clearHot(); });
  window.addEventListener('beforeprint', clearHot);
  // the route's chosen country (Suppliers.light) follows its column; a country with no column of its own follows nothing
  window.CP_SUPSHARES = { follow: follow, column: function (cc) { return COLS.indexOf(cc) >= 0 && cc !== 'EU-other' && cc !== 'Other' ? cc : ''; } };
  draw();
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { draw(); }); // the names are measured in the page's own face
  // drawn when the view opens (a hidden view has no width) and again when the column's width changes, never for paper
  if ('ResizeObserver' in window) new ResizeObserver(function () { var w = Math.round(host.clientWidth); if (w && w !== state.W && !paper.matches) draw(); }).observe(host);
})();

} catch (e) { console.warn('module supshares.js failed', e); }

/* module: underline.js */
try {
/* Chips built just under the line, first on Export Controls (build/modules/under-line.js writes the section and its data;
   rebuilt on 29 Oct 2026 as a ladder). Each row is one US move, drawn on one shared TPP scale: its lanes are the license
   status (needs a license, case by case, no license), its lines the TPP lines that move drew, row 1's arrows Nvidia's
   chip-to-chip cut and row 2's inset the H20 against the 2,400 line. Nothing needs a click. Pointing at, focusing or tapping
   a chip lights it in every row and opens its record beside it; ?chip=<id> opens on one. Table, CSV, PNG and Cite act as on
   any figure. Every number printed is the chip record's or the rule's own. */
(function () {
  'use strict';
  var D = document, sec = D.getElementById('controls-under-the-line'), src = D.getElementById('controls-ul-data');
  if (!sec || !src) return;
  var DATA; try { DATA = JSON.parse(src.textContent); } catch (e) { return; }
  var RULES = DATA.rules, LANE = DATA.lane, MAXT = 24000;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var byId = {}; DATA.chips.forEach(function (c) { byId[c.id] = c; });
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fig = sec.querySelector('.figure'), body = fig.querySelector('.fig-body'), rec = sec.querySelector('.ul-rec');
  var tracks = [].slice.call(sec.querySelectorAll('.ul-track'));
  var state = { hot: null, pin: null, W: 0 }, ctx2d = null;
  function textW(s, font) { if (!ctx2d) ctx2d = D.createElement('canvas').getContext('2d'); ctx2d.font = font; return ctx2d.measureText(s).width; }

  function geom(W) {
    var wide = W >= 520, G = wide ? 104 : 60, LH = 44;
    var x0 = G + 6, x1 = W - 8;
    return { W: W, wide: wide, G: G, LH: LH, x0: x0, x1: x1, X: function (t) { return x0 + t / MAXT * (x1 - x0); } };
  }
  // one row's drawing: lanes, lines and their values, arrows, the chips and their labels, and the H20 inset
  function drawRow(track, r) {
    var W = Math.round(track.clientWidth); if (!W) return;
    var g = geom(W); if (!g.wide && (r.arrows || []).length) g.LH = 54; // room for a cut label on two lines between the lanes
    var ui = getComputedStyle(D.documentElement).getPropertyValue('--font-ui').trim() || 'sans-serif';
    var n = r.lanes.length, top = 2, base = top + n * g.LH, H = base + 22 + (r.inset ? 58 : 0), o = [];
    var laneY = function (k) { return top + k * g.LH; }, laneOf = function (id) { return r.lanes.indexOf(r.at[id]); };
    var dotY = function (k) { return laneY(k) + g.LH / 2 + 2; };
    o.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(r.date + ': ' + r.lanes.map(function (l) {
      var ids = Object.keys(r.at).filter(function (id) { return r.at[id] === l; }); return LANE[l] + ', ' + (ids.length ? ids.map(function (id) { return byId[id].name; }).join(', ') : 'none');
    }).join('. ')) + '">');
    o.push('<defs><pattern id="ul-hatch-' + r.id + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="ul-hatch" x1="0" y1="0" x2="0" y2="6"></line></pattern></defs>');
    // the lanes and their names in the gutter
    r.lanes.forEach(function (l, k) {
      var y = laneY(k);
      if (l === 'lic') o.push('<rect class="ul-lane lic" x="' + g.x0 + '" y="' + y + '" width="' + (g.x1 - g.x0) + '" height="' + g.LH + '"></rect>');
      if (l === 'case') o.push('<rect class="ul-lane lic" x="' + g.x0 + '" y="' + y + '" width="' + (g.x1 - g.x0) + '" height="' + g.LH + '"></rect><rect class="ul-lane case" fill="url(#ul-hatch-' + r.id + ')" x="' + g.x0 + '" y="' + y + '" width="' + (g.x1 - g.x0) + '" height="' + g.LH + '"></rect>');
      if (k) o.push('<line class="ul-sep" x1="' + g.x0 + '" x2="' + g.x1 + '" y1="' + y + '" y2="' + y + '"></line>');
      var words = LANE[l], lines = g.wide ? [words] : (words.indexOf(' ') > 0 ? [words.slice(0, words.lastIndexOf(' ')), words.slice(words.lastIndexOf(' ') + 1)] : [words]);
      o.push('<text class="ul-ln ' + l + '" x="' + (g.G - 4) + '" y="' + (y + g.LH / 2 + 4 - (lines.length - 1) * 6.5) + '" text-anchor="end">' + lines.map(function (s, i) { return '<tspan x="' + (g.G - 4) + '"' + (i ? ' dy="13"' : '') + '>' + esc(s) + '</tspan>'; }).join('') + '</text>');
    });
    o.push('<line class="ul-base" x1="' + g.x0 + '" x2="' + g.x1 + '" y1="' + base + '" y2="' + base + '"></line>');
    // the TPP lines, ending at the baseline, their values under it
    var tf = '600 12px ' + ui;
    r.lines.forEach(function (ln, i) {
      var x = g.X(ln[0]), w = textW(ln[1], tf), nb = r.lines[i + 1], pb = r.lines[i - 1], anchor = 'middle', tx = x;
      if (nb && g.X(nb[0]) - x < (w + textW(nb[1], tf)) / 2 + 6) { anchor = 'end'; tx = x + 3; }
      else if (pb && x - g.X(pb[0]) < (w + textW(pb[1], tf)) / 2 + 6) { anchor = 'start'; tx = x - 3; }
      o.push('<line class="ul-tl ' + ln[2] + '" x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + top + '" y2="' + (base + 4) + '"></line>');
      o.push('<text class="ul-tv ' + ln[2] + '" x="' + tx.toFixed(1) + '" y="' + (base + 17) + '" text-anchor="' + anchor + '">' + esc(ln[1]) + '</text>');
    });
    // the chips: one dot each in its lane; dots at one point share one label, the named first
    var ids = Object.keys(r.at), spots = [];
    ids.forEach(function (id) {
      var k = laneOf(id), x = g.X(byId[id].tpp), y = dotY(k), s = spots.filter(function (p) { return p.k === k && Math.abs(p.x - x) < 3; })[0];
      if (s) s.ids.push(id); else spots.push({ k: k, x: x, y: y, ids: [id] });
    });
    spots.forEach(function (s) { s.ids.sort(function (a, b) { return (byId[b].named ? 1 : 0) - (byId[a].named ? 1 : 0); }); });
    // arrows first, so the dots sit on them: from the parent's dot to its China version's, with the cut beside
    var placed = [];
    (r.arrows || []).forEach(function (a) {
      var p = byId[a[0]], c = byId[a[1]], x = g.X(p.tpp), y0 = dotY(laneOf(a[0])) + 8, y1 = dotY(laneOf(a[1])) - 9;
      o.push('<g class="ul-arrow" data-ids="' + a[0] + ' ' + a[1] + '"><line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + y0 + '" y2="' + y1 + '"></line>' +
        '<path d="M' + (x - 4).toFixed(1) + ',' + (y1 - 5) + ' L' + x.toFixed(1) + ',' + (y1 + 1) + ' L' + (x + 4).toFixed(1) + ',' + (y1 - 5) + '"></path></g>');
      var f = '500 11.5px ' + ui, w = textW(a[2], f), ty = (y0 + y1) / 2 + 4, clear = function (b) { return !placed.some(function (q) { return !(b[2] < q[0] || b[0] > q[2] || b[3] < q[1] || b[1] > q[3]); }); };
      if (x + 8 + w <= g.W + 6 && clear([x + 8, ty - 10, x + 8 + w, ty + 3])) { o.push('<text class="ul-cut" x="' + (x + 8).toFixed(1) + '" y="' + ty.toFixed(1) + '">' + esc(a[2]) + '</text>'); placed.push([x + 8, ty - 10, x + 8 + w, ty + 3]); }
      else if (x - 8 - w >= g.x0 && clear([x - 8 - w, ty - 10, x - 8, ty + 3])) { o.push('<text class="ul-cut" x="' + (x - 8 - w).toFixed(1) + '" y="' + ty.toFixed(1) + '">' + esc(a[2]) + '</text>'); placed.push([x - 8 - w, ty - 10, x - 8, ty + 3]); }
      else {
        var cut = a[2].indexOf(' or ') > 0 ? [a[2].slice(0, a[2].indexOf(' or ')), a[2].slice(a[2].indexOf(' or ') + 1)] : [a[2]], w2 = Math.max.apply(null, cut.map(function (s) { return textW(s, f); }));
        o.push('<text class="ul-cut" x="' + (x + 8).toFixed(1) + '" y="' + (ty - 6).toFixed(1) + '">' + cut.map(function (s, i) { return '<tspan x="' + (x + 8).toFixed(1) + '"' + (i ? ' dy="13"' : '') + '>' + esc(s) + '</tspan>'; }).join('') + '</text>');
        placed.push([x + 8, ty - 16, x + 8 + w2, ty + 10]);
      }
    });
    // labels: beside right, beside left, then above; each clear of the other dots and labels; a near line's chip gets its TPP
    var nearLine = function (id) { return r.lines.some(function (ln) { return ln[0] > byId[id].tpp && ln[0] - byId[id].tpp < 1000 && ln[0] >= 4800; }); };
    var dots = spots.map(function (s) { return [s.x - 6, s.y - 6, s.x + 6, s.y + 6]; }).concat(r.lines.map(function (ln) { var x = g.X(ln[0]); return [x - 1, top, x + 1, base]; }));
    var hit = function (b) { return placed.concat(dots).some(function (q) { return !(b[2] < q[0] || b[0] > q[2] || b[3] < q[1] || b[1] > q[3]); }); };
    var out = [];
    spots.slice().sort(function (a, b) { return b.x - a.x; }).forEach(function (s) {
      var names = s.ids.map(function (id) { return byId[id]; }), withTPP = names.length === 1 && nearLine(names[0].id) ? ' ' + names[0].tppT : '';
      var variants = withTPP ? [withTPP, ''] : [''];
      var done = null;
      variants.some(function (extra) {
        var parts = names.map(function (c, i) { return { t: (i ? ' · ' : '') + c.name, named: c.named }; });
        if (extra) parts.push({ t: extra, num: true });
        var w = parts.reduce(function (sum, p) { return sum + textW(p.t, (p.named ? '700 13px ' : '400 12px ') + ui); }, 0);
        var ay = s.y + 4, by = s.y - 13;
        var tries = [[s.x + 10, ay], [s.x - 10 - w, ay], [s.x - w - 3, by], [s.x - w / 2, by], [s.x + 3, by]];
        for (var k = 0; k < tries.length; k++) {
          var tx = tries[k][0], ty = tries[k][1], b = [tx - 1, ty - 11, tx + w + 1, ty + 3];
          if (tx < g.x0 - 2 || tx + w > g.W + 6 || hit(b)) continue;
          placed.push(b); done = { x: tx, y: ty, parts: parts }; return true;
        }
        return false;
      });
      if (!done) { var parts0 = names.map(function (c, i) { return { t: (i ? ' · ' : '') + c.name, named: c.named }; }); done = { x: s.x + 10, y: s.y + 4, parts: parts0 }; }
      out.push('<text class="ul-lab" x="' + done.x.toFixed(1) + '" y="' + done.y.toFixed(1) + '" data-ids="' + s.ids.join(' ') + '">' + done.parts.map(function (p) {
        return '<tspan class="' + (p.num ? 'num' : p.named ? 'nm' : 'ot') + '">' + esc(p.t) + '</tspan>'; }).join('') + '</text>');
    });
    spots.forEach(function (s) {
      s.ids.slice().reverse().forEach(function (id) {
        var c = byId[id];
        o.push('<g class="ul-dot' + (c.named ? ' named' : '') + '" data-id="' + id + '" transform="translate(' + s.x.toFixed(1) + ' ' + s.y.toFixed(1) + ')"><circle class="hit" r="12"></circle><circle class="ring" r="9.5"></circle><circle class="d" r="' + (c.named ? 5.5 : 4.5) + '"></circle></g>');
      });
    });
    o.push(out.join(''));
    // the inset: the H20 against the 2,400 line, on a scale from 2,300 to 2,500
    if (r.inset) {
      // set under the H20, so its leader runs straight down from the dot, broken where the line values sit
      var c = byId[r.inset], iw = Math.min(220, g.x1 - g.x0 - 10), hx = g.X(c.tpp), iy = base + 44;
      var ix0 = Math.max(4, Math.min(g.W - iw - 4, hx - (c.tpp - 2300) / 200 * iw)), ix = function (t) { return ix0 + (t - 2300) / 200 * iw; };
      o.push('<g class="ul-inset"><path class="lead" d="M' + ix(c.tpp).toFixed(1) + ',' + (base + 22) + ' L' + ix(c.tpp).toFixed(1) + ',' + (iy - 8) + '"></path>' +
        '<line class="axis" x1="' + ix0 + '" x2="' + (ix0 + iw) + '" y1="' + iy + '" y2="' + iy + '"></line>' +
        '<line class="ul-tl m" x1="' + ix(2400).toFixed(1) + '" x2="' + ix(2400).toFixed(1) + '" y1="' + (iy - 14) + '" y2="' + (iy + 4) + '"></line>' +
        '<text class="ul-tv" x="' + ix0 + '" y="' + (iy + 15) + '">2,300</text><text class="ul-tv" x="' + (ix0 + iw) + '" y="' + (iy + 15) + '" text-anchor="end">2,500</text>' +
        '<text class="ul-tv m" x="' + ix(2400).toFixed(1) + '" y="' + (iy + 15) + '" text-anchor="middle">2,400</text>' +
        '<g class="ul-dot named" data-id="' + c.id + '" transform="translate(' + ix(c.tpp).toFixed(1) + ' ' + iy + ')"><circle class="hit" r="12"></circle><circle class="ring" r="9.5"></circle><circle class="d" r="5.5"></circle></g>' +
        '<text class="ul-lab" data-ids="' + c.id + '" x="' + (ix(c.tpp) - 10).toFixed(1) + '" y="' + (iy - 9) + '" text-anchor="end"><tspan class="nm">' + esc(c.name) + '</tspan><tspan class="num"> ' + esc(c.tppT) + '</tspan></text></g>');
    }
    o.push('</svg>');
    track.innerHTML = o.join('');
  }
  function draw() {
    tracks.forEach(function (t, i) { drawRow(t, RULES[i]); });
    state.W = tracks[0] ? Math.round(tracks[0].clientWidth) : 0;
    // keyboard: one stop per chip, on the last row's dots, where every chip appears
    var last = tracks[tracks.length - 1];
    [].forEach.call(sec.querySelectorAll('.ul-dot'), function (el) {
      var mine = last && last.contains(el) && !el.closest('.ul-inset');
      el.setAttribute('tabindex', mine ? '0' : '-1');
      if (mine) { var c = byId[el.getAttribute('data-id')]; el.setAttribute('role', 'button'); el.setAttribute('aria-label', c.vendor + ' ' + c.full + ', TPP ' + c.tppT + '. Show its record'); }
      el.addEventListener('mouseenter', function () { if (!state.pin) show(el.getAttribute('data-id'), el); });
      el.addEventListener('mouseleave', function () { if (!state.pin) show(null); });
      el.addEventListener('focus', function () { show(el.getAttribute('data-id'), el); });
      el.addEventListener('blur', function () { if (!state.pin) show(null); });
      el.addEventListener('click', function (e) { e.stopPropagation(); var id = el.getAttribute('data-id'); state.pin = state.pin === id ? null : id; show(state.pin, el); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); var id = el.getAttribute('data-id'); state.pin = state.pin === id ? null : id; show(state.pin || id, el); } });
    });
    if (state.pin) { var el0 = sec.querySelector('.ul-dot[data-id="' + state.pin + '"]'); if (el0) show(state.pin, el0); }
  }
  // a chip lit in every row, and its record beside the dot
  function show(id, el) {
    state.hot = id;
    sec.classList.toggle('is-hot', !!id);
    [].forEach.call(sec.querySelectorAll('.ul-dot, .ul-lab, .ul-arrow'), function (n) {
      var on = id && ((n.getAttribute('data-id') === id) || (' ' + (n.getAttribute('data-ids') || '') + ' ').indexOf(' ' + id + ' ') >= 0);
      n.classList.toggle('on', !!on);
    });
    if (!id) { rec.hidden = true; rec.innerHTML = ''; return; }
    var c = byId[id], a = String(c.announced).split('-'), ann = a[1] ? MONTHS[+a[1] - 1] + ' ' + a[0] : a[0];
    rec.innerHTML = '<p class="h">' + esc(c.vendor + ' ' + c.full) + '</p><dl><dt>TPP</dt><dd>' + esc(c.tppT) + '</dd><dt>Chip-to-chip</dt><dd>' + esc(c.c2cT) + '</dd><dt>Memory bandwidth</dt><dd>' + esc(c.bwT) + '</dd><dt>Announced</dt><dd>' + esc(ann) + '</dd></dl>' +
      '<a href="#/landscape?pick=' + encodeURIComponent(c.id) + '">Its record on AI Chips <span aria-hidden="true">→</span></a>';
    rec.hidden = false;
    // beside the dot, inside the figure; under it where the side has no room
    var m = body.getBoundingClientRect(), b = (el || sec.querySelector('.ul-dot[data-id="' + id + '"]')).getBoundingClientRect();
    var w = rec.offsetWidth, h = rec.offsetHeight, x = b.right - m.left + 10, y = b.top - m.top - 8;
    if (x + w > m.width) x = b.left - m.left - 10 - w;
    if (x < 0) { x = Math.max(0, Math.min(m.width - w, b.left - m.left - w / 2)); y = b.bottom - m.top + 8; }
    rec.style.left = Math.round(x) + 'px'; rec.style.top = Math.round(Math.max(0, y)) + 'px';
  }

  /* Table and PNG, as figure() figures have them (build.js FIG_JS): Table shows the chips' rows in place of the ladder, and
     PNG draws the ladder as it stands, always on the light ground, 800 px wide at 2x: title, subtitle, key, each row's date,
     rule, drawing and sentence, the axis, the sources and the address */
  function txt(n) { return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function wrap(g, s, w) { var out = [], line = ''; String(s).split(/\s+/).forEach(function (word) { var t = line ? line + ' ' + word : word; if (g.measureText(t).width > w && line) { out.push(line); line = word; } else line = t; }); if (line) out.push(line); return out; }
  function lightTokens() {
    var out = {};
    [].forEach.call(D.styleSheets, function (sh) { var rules; try { rules = sh.cssRules; } catch (e) { return; } [].forEach.call(rules || [], function (r) { if (r.selectorText === ':root' && r.style) for (var i = 0; i < r.style.length; i++) { var p = r.style[i]; if (p.indexOf('--') === 0 && !(p in out)) out[p] = r.style.getPropertyValue(p).trim(); } }); });
    return out;
  }
  function svgImage(svg, tok) {
    return new Promise(function (done) {
      var host = D.createElement('div'); host.style.cssText = 'position:absolute;left:-9999px;top:0;width:' + svg.getAttribute('width') + 'px';
      Object.keys(tok).forEach(function (k) { host.style.setProperty(k, tok[k]); });
      host.className = 'ul'; var clone = svg.cloneNode(true); host.appendChild(clone); sec.appendChild(host);
      var PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-family', 'font-size', 'font-weight', 'paint-order', 'visibility', 'display'];
      [clone].concat([].slice.call(clone.querySelectorAll('*'))).forEach(function (el) { var cs = getComputedStyle(el), s = ''; PROPS.forEach(function (p) { var v = cs.getPropertyValue(p); if (v) s += p + ':' + v.replace(/url\("?[^#")]*#([^")]+)"?\)/, 'url(#$1)') + ';'; }); el.setAttribute('style', s); });
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      var data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
      host.remove();
      var img = new Image(); img.onload = function () { done(img); }; img.onerror = function () { done(null); }; img.src = data;
    });
  }
  function png() {
    var was = state.pin; state.pin = null; show(null);
    var tok = lightTokens(), svgs = tracks.map(function (t) { return t.querySelector('svg'); });
    Promise.all(svgs.map(function (s) { return s ? svgImage(s, tok) : Promise.resolve(null); })).then(function (imgs) {
      var W = 800, P = 40, S = 2, cv = D.createElement('canvas'), g = cv.getContext('2d'), iw = W - 2 * P;
      var FD = '"Fraunces",Georgia,serif', FB = '"Source Serif 4",Georgia,serif', FU = '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif', FM = '"Fragment Mono",Menlo,monospace';
      var t1 = txt(fig.querySelector('.fig-title')), t2 = txt(fig.querySelector('.fig-sub'));
      var srcT = 'Source: ' + [].map.call(fig.querySelectorAll('.fs-src a'), function (a) { return txt(a); }).filter(function (s) { return s !== 'AI Chips'; }).join(', ') + ', and each chip\'s record on AI Chips';
      var keyT = 'Wine: A800, H800, H20. Tinted lane: needs a US license to ship to China. Hatched: license reviewed case by case.';
      g.font = '500 24px ' + FD; var L1 = wrap(g, t1, iw); g.font = '400 16px ' + FB; var L2 = wrap(g, t2, iw);
      g.font = '400 13px ' + FU; var LK = wrap(g, keyT, iw), LS = wrap(g, srcT, iw);
      var rowsT = RULES.map(function (r, i) {
        g.font = '600 14px ' + FU; var hd = wrap(g, r.date + ' (' + r.kind + '). ' + r.head, iw); g.font = '400 14px ' + FB; var nt = wrap(g, r.note, iw);
        var im = imgs[i], ih = im ? iw * im.height / im.width : 0; return { hd: hd, nt: nt, im: im, ih: ih };
      });
      var H = P + 22 + L1.length * 31 + 6 + L2.length * 21 + 14 + LK.length * 18 + 10;
      rowsT.forEach(function (r) { H += 14 + r.hd.length * 19 + 6 + r.ih + 6 + r.nt.length * 20 + 6; });
      H += 24 + 18 + LS.length * 17 + 30 + P / 2;
      cv.width = W * S; cv.height = H * S; g.scale(S, S); g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      var y = P; g.textBaseline = 'alphabetic'; g.fillStyle = '#56554f'; g.font = '400 13px ' + FM; g.fillText('Export Controls', P, y + 12); y += 22;
      g.fillStyle = '#171716'; g.font = '500 24px ' + FD; L1.forEach(function (s) { y += 28; g.fillText(s, P, y); y += 3; });
      y += 6; g.fillStyle = '#45443f'; g.font = '400 16px ' + FB; L2.forEach(function (s) { y += 19; g.fillText(s, P, y); y += 2; });
      y += 14; g.font = '400 13px ' + FU; LK.forEach(function (s) { y += 15; g.fillText(s, P, y); y += 3; }); y += 10;
      rowsT.forEach(function (r) {
        y += 14; g.fillStyle = '#171716'; g.font = '600 14px ' + FU; r.hd.forEach(function (s) { y += 16; g.fillText(s, P, y); y += 3; });
        y += 6; if (r.im) g.drawImage(r.im, P, y, iw, r.ih); y += r.ih + 6;
        g.fillStyle = '#171716'; g.font = '400 14px ' + FB; r.nt.forEach(function (s) { y += 17; g.fillText(s, P, y); y += 3; }); y += 6;
      });
      y += 6; g.fillStyle = '#45443f'; g.font = '400 12.5px ' + FU; g.textAlign = 'right'; g.fillText('Total processing performance (TPP) →', W - P, y + 12); g.textAlign = 'left'; y += 24;
      g.fillStyle = '#e1e0db'; g.fillRect(P, y, iw, 1); y += 18;
      g.fillStyle = '#45443f'; g.font = '400 12.5px ' + FU; LS.forEach(function (s) { y += 14; g.fillText(s, P, y); y += 3; });
      g.fillStyle = '#56554f'; g.font = '400 12px ' + FM; g.fillText('chipsupplychain.org/#/controls', P, y + 20);
      cv.toBlob(function (bl) { if (!bl) return; var l = D.createElement('a'); l.href = URL.createObjectURL(bl); l.download = 'chip-supply-chain-chips-under-the-line.png'; D.body.appendChild(l); l.click(); setTimeout(function () { URL.revokeObjectURL(l.href); l.remove(); }, 2000); }, 'image/png');
      if (was) { state.pin = was; show(was); }
    });
  }
  function actions() {
    var acts = fig.querySelector('.fs-acts'); if (!acts || acts.getAttribute('data-ul')) return; acts.setAttribute('data-ul', '1'); // its own mark: FIG_JS marks every strip data-ready, and passes this kind by
    var table = fig.querySelector('table.fig-table'), cite = acts.querySelector('.ch-cite-btn');
    var tb = D.createElement('button'); tb.type = 'button'; tb.className = 'fs-tab'; tb.textContent = 'Table'; tb.setAttribute('aria-pressed', 'false');
    tb.addEventListener('click', function () { var on = !fig.classList.contains('is-table'); fig.classList.toggle('is-table', on); if (table) table.classList.toggle('sr-only', !on); tb.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    var pb = D.createElement('button'); pb.type = 'button'; pb.className = 'fs-png'; pb.textContent = 'PNG'; pb.setAttribute('aria-label', 'Save the figure as a PNG picture');
    pb.addEventListener('click', function () { if (D.fonts && D.fonts.ready) D.fonts.ready.then(png); else png(); });
    acts.insertBefore(tb, cite ? cite.nextSibling : acts.firstChild); acts.appendChild(pb);
  }
  // ?chip=<id>, in the query or after the hash's route
  function askedChip() {
    var m = /[?&]chip=([a-z0-9-]+)/.exec(location.search + '&' + (location.hash.split('?')[1] || ''));
    return m && byId[m[1]] ? m[1] : null;
  }

  function mount() {
    actions();
    state.pin = askedChip();
    draw();
    D.addEventListener('click', function (e) { if (state.pin && !rec.contains(e.target)) { state.pin = null; show(null); } });
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.hot) { state.pin = null; show(null); } });
    // redrawn when the column's width changes on screen; on paper the screen's drawing is scaled to the page, as it stands
    var paper = window.matchMedia ? matchMedia('print') : { matches: false };
    if ('ResizeObserver' in window && tracks[0]) new ResizeObserver(function () { var w = Math.round(tracks[0].clientWidth); if (w && w !== state.W && !paper.matches) draw(); }).observe(tracks[0]);
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', mount); else mount();
})();

} catch (e) { console.warn('module underline.js failed', e); }

/* module: walk.js */
try {
/* The walk (#/walk): a thin progress rail over the numbered spine.
   Progressive enhancement only — the spine, the counts and the previous/next links all work without this. */
(function () {
  var CP = window.CP;
  if (!CP) return;

  var rail, fill, num, label, list, steps = [], total = 0, deck = null, deckHash = '';
  var setUp = false, queued = false, at = -1, first = true;
  /* Back from a chapter returns the reader to the same place: while the walk is read, the address follows the step on
     screen (#/walk/<chapter>, replaced, never pushed), or past the last step the flashcards (#/walk/flashcards), and the
     scroll position is kept, so coming back to that address puts the page where it was left, and a reload in the deck
     opens on the deck. */
  var lastY = 0, lastHash = null, base = '#/', pending = null, hold = 0;
  var HOMEISH = /^(#|#\/|#\/(walk|home|intro|briefing))?$/, STEP = /^#\/walk\/[^?#\/]+$/;

  function head() { // the masthead is measured at runtime, so read it rather than assume 56
    var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'));
    return (v || 56) + 62;
  }

  /* the reading line sits just below where a step lands when it is jumped to, so the step on screen is the one the rail names */
  function line() { return Math.max(head(), (CP.landAt && steps[0] ? CP.landAt(steps[0]) : 0) + 8); }

  function jumpTo(y) { // html scrolls smoothly; a return to the reader's place must not animate
    var root = document.documentElement, prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto'; window.scrollTo(0, y); root.style.scrollBehavior = prev;
  }

  function remember(i) { // i: the step on screen; -1 above the first step, -2 in the flashcards after the last
    lastY = window.pageYOffset;
    var h = location.hash || '';
    if (HOMEISH.test(h) || STEP.test(h)) { // an address this view does not own (a query, an anchor) is left alone
      var want = i === -2 ? deckHash : i >= 0 ? '#' + steps[i].id : base;
      if (want !== h) { try { history.replaceState(history.state, '', want || location.pathname + location.search); } catch (e) { } }
    }
    lastHash = location.hash || '';
  }

  function setup() {
    if (setUp) return !!rail;
    setUp = true;
    rail = document.getElementById('wk-rail');
    list = CP.$('.wk-list');
    steps = CP.$$('.wk-step');
    total = steps.length;
    deck = document.getElementById('/walk/flashcards'); // the flashcards after the last step, an address of this view like a step's
    deckHash = deck ? '#/walk/flashcards' : '';
    if (!rail || !list || !total) { rail = null; return false; }
    fill = rail.querySelector('.wk-rail-bar i');
    num = rail.querySelector('.wk-rail-n');
    label = rail.querySelector('.wk-rail-t');
    rail.hidden = false;
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    return true;
  }

  function soon(fn) { // requestAnimationFrame must be called on window, never detached
    if (window.requestAnimationFrame) window.requestAnimationFrame(fn); else window.setTimeout(fn, 16);
  }

  function tick() {
    if (queued) return;
    queued = true;
    soon(update);
  }

  function update() {
    queued = false;
    if (!rail || CP.Router.current !== 'walk') return;
    var ln = line();
    var box = list.getBoundingClientRect();
    var inDeck = !!deck && deck.getBoundingClientRect().top <= ln; // the flashcards have reached the reading line: the rail, which names a step, goes

    rail.setAttribute('data-show', !inDeck && box.top < ln && box.bottom > ln - 60 ? '1' : '0');
    var p = Math.max(0, Math.min(1, (ln - box.top) / Math.max(1, box.height)));
    fill.style.width = (p * 100).toFixed(1) + '%';

    var cur = 0;
    for (var i = 0; i < total; i++) if (steps[i].getBoundingClientRect().top <= ln) cur = i;
    // the spine fills to the reading line: past steps in full, the current step to the fraction read
    var r = steps[cur].getBoundingClientRect(), f = Math.max(0, Math.min(1, (ln - r.top) / Math.max(1, r.height)));
    steps[cur].style.setProperty('--wk-fill', (f * 100).toFixed(1) + '%');
    // above the first step the address is the page's own; just after a landing the page may still reflow under it, so wait
    if (!pending && Date.now() > hold) remember(inDeck ? -2 : steps[0].getBoundingClientRect().top <= ln ? cur : -1);
    if (cur === at) return;
    at = cur;
    for (var j = 0; j < total; j++) {
      steps[j].classList.toggle('is-past', j < cur);
      steps[j].classList.toggle('is-here', j === cur);
    }
    num.textContent = (cur + 1) + ' / ' + total;
    label.textContent = steps[cur].getAttribute('data-title') || '';
  }

  /* #/walk/<chapter> is a step anchor: the router reads the hash as the walk view, and the step's own
     id is that same string, so the browser scrolls to it on its own. A cold load or an arrival from
     another view cannot rely on that, and the browser ignores the masthead, so land it here. */
  function stepFor(h) {
    if (!STEP.test(h || '')) return null;
    var id = h.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { } // "#/walk/%" is not valid escaping; take it as typed rather than throw
    return document.getElementById(id);
  }

  function jump(glide) { // the step lands below the masthead and the rail, at the reading line
    var el = stepFor(location.hash);
    if (el) CP.scrollToEl(el, glide);
    return el;
  }

  /* web fonts and late images can still reflow the page after a landing; the router puts the step back for a second or
     so, and the address keeps the step until then, unless the reader starts to scroll first */
  function settle(el) {
    hold = Date.now() + 1400;
    var go = function () { hold = 0; };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, go, { passive: true, once: true }); });
    if (el && CP.Router.settle) CP.Router.settle(el);
  }

  /* The hero (27 Oct 2026: the home's structure before the redesign). Each row of the chain at a glance ends in a button, its
     band's meter and word, that picks the stage's specimen: the button copies its stage's specimen, number, title and caption
     onto the hero (#wk-hero, a [data-specimen] item that Sections in src/app.js tracks like a step), and a scroll event asks
     Sections to draw it; Sections.hold keeps the hero on the stage while any of it is on screen, so the row in wine is always
     the specimen shown. Hovering a button picks it once the pointer rests on it a moment, so a pointer crossing the list on
     its way to the specimen does not flick through the stages, and a scroll under a still pointer picks nothing; a click or
     focus picks it at once. The picked row is marked
     (.is-shown, the one row in wine). One button is in the Tab order, the picked one; the arrow keys, Home and End move along
     them and pick as they go, as they do on the Suppliers pipeline. The stage's name is a plain link to its chapter. */
  (function hero() {
    var box = document.getElementById('wk-hero');
    var picks = box ? CP.$$('.wk-gl-c', box) : [];
    var wait = 0;
    function pick(i, focus) {
      var b = picks[i]; if (!b) return;
      window.clearTimeout(wait);
      if (b.getAttribute('aria-pressed') !== 'true') {
        picks.forEach(function (m, k) {
          m.setAttribute('aria-pressed', k === i ? 'true' : 'false'); m.tabIndex = k === i ? 0 : -1;
          var row = m.closest('li'); if (row) row.classList.toggle('is-shown', k === i);
        });
        box.setAttribute('data-specimen', b.getAttribute('data-spec') || '');
        box.setAttribute('data-number', b.getAttribute('data-n') || '');
        box.setAttribute('data-title', b.getAttribute('data-t') || '');
        box.setAttribute('data-caption', b.getAttribute('data-cap') || '');
      }
      if (CP.Sections) CP.Sections.hold = box; // the hero keeps the stage while it is on screen, though the walk has begun under it
      window.dispatchEvent(new Event('scroll'));
      if (focus) b.focus(); // after the pick, so the focus handler finds it made
    }
    picks.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(i, false); });
      b.addEventListener('focus', function () { pick(i, false); });
      // the pointer's own movement arms the pick (a scroll under a still pointer moves no mouse, though it changes what is under it)
      b.addEventListener('mousemove', function (e) {
        if (!e.movementX && !e.movementY) return;
        window.clearTimeout(wait); wait = window.setTimeout(function () { pick(i, false); }, 110);
      });
      b.addEventListener('mouseleave', function () { window.clearTimeout(wait); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, n = picks.length, to = -1;
        if (k === 'ArrowDown' || k === 'ArrowRight') to = Math.min(n - 1, i + 1);
        else if (k === 'ArrowUp' || k === 'ArrowLeft') to = Math.max(0, i - 1);
        else if (k === 'Home') to = 0; else if (k === 'End') to = n - 1;
        if (to < 0) return;
        e.preventDefault(); pick(to, true);
      });
    });
  })();

  CP.register('walk', {
    /* the router leaves the page where this view puts it: a step to land on, or the place the reader left */
    owns: function () { return !!pending; },
    activate: function () {
      if (!setup()) return;
      var cold = first, h = location.hash || '';
      first = false;
      base = HOMEISH.test(h) ? h : '#/';
      // coming back (Back from a chapter, or any return) to the address the walk had when the reader left it
      var back = !cold && CP.Router.from !== 'walk' && lastHash !== null && h === lastHash, y = lastY;
      var glide = !cold && CP.Router.from === 'walk'; // a step link inside the walk glides; arriving from elsewhere jumps
      // a reader who scrolled while the page was still arriving (the walk shows before boot) is not jumped back to the step
      var kept = cold && !!(window.CP_PRE && window.CP_PRE.touched);
      pending = back ? 'restore' : (stepFor(h) && !kept ? 'jump' : null);
      var place = function () { if (pending === 'restore') jumpTo(y); else if (pending === 'jump') return jump(glide); return null; };
      place();
      // once more on the next task (a cold load can still be settling), not the next frame — a background tab gets no frames
      window.setTimeout(function () { var el = glide ? null : place(); if (el) settle(el); pending = null; at = -1; soon(update); }, 0);
      at = -1;
      soon(update);
    }
  });
})();

} catch (e) { console.warn('module walk.js failed', e); }
/* cite line */
try {
(function(){
function copyBtn(b){if(b.querySelector('.ch-cite-copy')||!(navigator.clipboard&&navigator.clipboard.writeText))return;var c=document.createElement('button');c.type='button';c.className='ch-cite-copy';c.textContent='Copy citation';b.appendChild(c);}
function set(t,open){var b=document.getElementById(t.getAttribute('aria-controls'));if(!b)return;t.setAttribute('aria-expanded',open?'true':'false');b.hidden=!open;b.classList.toggle('is-open',open);if(open)copyBtn(b);}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('.ch-cite-btn, .ch-cite-copy'):null;if(!t)return;
if(t.classList.contains('ch-cite-btn')){e.preventDefault();set(t,t.getAttribute('aria-expanded')!=='true');return;}
var p=t.parentNode.querySelector('.ch-cite-text'),text=p?p.textContent.replace(/\s+/g,' ').trim():'';
navigator.clipboard.writeText(text).then(function(){t.textContent='Copied';setTimeout(function(){t.textContent='Copy citation';},1600);},function(){t.textContent='Copy failed';});});
document.addEventListener('keydown',function(e){if(e.key!==' ')return;var t=e.target.closest?e.target.closest('a.ch-cite-btn'):null;if(!t)return;e.preventDefault();set(t,t.getAttribute('aria-expanded')!=='true');});
Array.prototype.forEach.call(document.querySelectorAll('a.ch-cite-btn'),function(a){a.setAttribute('role','button');a.setAttribute('aria-expanded','false');});
try{var o=location.hash.length>1?document.getElementById(location.hash.slice(1)):null;if(o&&o.classList.contains('ch-cite-box')){var t=document.querySelector('.ch-cite-btn[aria-controls="'+o.id+'"]');if(t)set(t,true);}}catch(e){}
})();
} catch (e) { console.warn('cite line failed', e); }
/* figure actions */
try {
(function(){
var D=document;
function el(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e;}
function wrap(g,s,w){var out=[],line='';String(s).split(/\s+/).forEach(function(word){var t=line?line+' '+word:word;if(g.measureText(t).width>w&&line){out.push(line);line=word;}else line=t;});if(line)out.push(line);return out;}
function txt(n){return n?n.textContent.replace(/\s+/g,' ').trim():'';}
function save(cv,fig,k){cv.toBlob(function(b){if(!b)return;var a=el('a');a.href=URL.createObjectURL(b);a.download='chip-supply-chain-'+(k.replace(/^Figure\s*/,'figure-').replace(/[^0-9a-z]+/gi,'-').toLowerCase())+'-'+(fig.id.replace(/^fig-/,'').replace(((fig.closest('article.chapter')||{}).id||'x')+'-','')||'chart')+'.png';D.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},2000);},'image/png');}
/* a timeline (08.2, 16.1; 28 Oct 2026): its dates in the code face down the left, each event beside its date, on hairlines */
function pngTl(fig){
var items=[].slice.call(fig.querySelectorAll('.fig-body .tl li'));if(!items.length)return;
var k=txt(fig.querySelector('.fig-k')),t1=txt(fig.querySelector('.fig-title')),t2=txt(fig.querySelector('.fig-sub'));
var dl=(/Data: (.+)\.$/.exec(txt(fig.querySelector('.fig-cite-box .ch-cite-text')))||[])[1],src=fig.querySelector('.fs-src'),sc=src?src.cloneNode(true):null;if(sc)[].forEach.call(sc.querySelectorAll('.fs-k'),function(x){x.remove();});
var srcT=dl||(sc?txt(sc).replace(/\s*\d+$/,''):''),addr=txt(fig.querySelector('.fig-cite-box a')).replace(/^https?:\/\//,'');
var W=800,P=40,S=2,DW=150,cv=el('canvas'),g=cv.getContext('2d');
var FD='"Fraunces",Georgia,serif',FB='"Source Serif 4",Georgia,serif',FU='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',FM='"Fragment Mono",Menlo,monospace',INK='#171716',INK2='#45443f',LINE='#e1e0db';
g.font='500 24px '+FD;var L1=wrap(g,t1,W-2*P);g.font='400 16px '+FB;var L2=t2?wrap(g,t2,W-2*P):[];
var rows=items.map(function(li){var d=txt(li.querySelector('.d')),c=li.cloneNode(true),x=c.querySelector('.d');if(x)x.remove();g.font='400 15px '+FB;return{d:d,L:wrap(g,txt(c),W-2*P-DW)};});
var chartH=rows.reduce(function(a,r){return a+r.L.length*21+16;},0);
var H=P+18+L1.length*31+(L2.length?6+L2.length*21:0)+24+chartH+20+56;
cv.width=W*S;cv.height=H*S;g.scale(S,S);g.fillStyle='#ffffff';g.fillRect(0,0,W,H);
var y=P;g.textBaseline='alphabetic';g.fillStyle='#56554f';g.font='400 13px '+FM;g.fillText(k,P,y+12);y+=22;
g.fillStyle=INK;g.font='500 24px '+FD;L1.forEach(function(s){y+=28;g.fillText(s,P,y);y+=3;});
if(L2.length){y+=6;g.fillStyle=INK2;g.font='400 16px '+FB;L2.forEach(function(s){y+=19;g.fillText(s,P,y);y+=2;});}
y+=24;g.fillStyle=INK;g.fillRect(P,y,W-2*P,1);
rows.forEach(function(r){y+=8;g.fillStyle='#56554f';g.font='400 13px '+FM;g.fillText(r.d,P,y+15);g.fillStyle=INK;g.font='400 15px '+FB;r.L.forEach(function(s,j){g.fillText(s,P+DW,y+15+j*21);});y+=r.L.length*21+8;g.fillStyle=LINE;g.fillRect(P,y,W-2*P,1);});
y+=20;g.fillStyle='#45443f';g.font='400 12.5px '+FU;var sl=wrap(g,(srcT?'Source: '+srcT:''),W-2*P);sl.slice(0,1).forEach(function(s){g.fillText(s,P,y);});
g.fillStyle='#56554f';g.font='400 12px '+FM;g.fillText(addr,P,y+20);
save(cv,fig,k);
}
/* parts inside a whole (15.3, 29 Oct 2026): the whole's bracket and words, the total's, the bar (an outline to the whole's low
   end, hatched to its high end) with the parts carved inside it, and each part named under it on a leader, as the page draws them */
function pngWithin(fig){
var pw=fig.querySelector('.fig-body .pw');if(!pw)return;
var k=txt(fig.querySelector('.fig-k')),t1=txt(fig.querySelector('.fig-title')),t2=txt(fig.querySelector('.fig-sub'));
var dl=(/Data: (.+)\.$/.exec(txt(fig.querySelector('.fig-cite-box .ch-cite-text')))||[])[1],src=fig.querySelector('.fs-src'),sc=src?src.cloneNode(true):null;if(sc)[].forEach.call(sc.querySelectorAll('.fs-k'),function(x){x.remove();});
var srcT=dl||(sc?txt(sc).replace(/\s*\d+$/,''):''),addr=txt(fig.querySelector('.fig-cite-box a')).replace(/^https?:\/\//,'');
var wh=pw.querySelector('.pw-whole'),to=pw.querySelector('.pw-total');if(!wh||!to)return;
var hi=+wh.getAttribute('data-hi'),lo=+wh.getAttribute('data-v'),tv=+to.getAttribute('data-v');
var words=function(e){var c=e.querySelector('.pw-lab').cloneNode(true),b=c.querySelector('b'),bt=txt(b);if(b)b.remove();return{b:bt,r:txt(c)};},LW=words(wh),LT=words(to);
var parts=[].map.call(pw.querySelectorAll('.pw-part'),function(p){var r=pw.querySelector('.pw-row[data-k="'+p.getAttribute('data-k')+'"]');return{v:+p.getAttribute('data-v'),top:p.classList.contains('top'),nm:txt(r&&r.querySelector('.pw-nm')),vt:txt(r&&r.querySelector('.pw-v'))};});
var W=800,P=40,S=2,cv=el('canvas'),g=cv.getContext('2d');
var FD='"Fraunces",Georgia,serif',FB='"Source Serif 4",Georgia,serif',FU='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',FM='"Fragment Mono",Menlo,monospace';
var WINE='#7a1f2b',TINT='#d2d1cc',INK='#171716',INK2='#45443f',RULE='#8c8a84',LINE='#e1e0db';
var CW=W-2*P,X=function(v){return P+v/hi*CW;},BH=36,RH=26,G=14;
g.font='500 24px '+FD;var L1=wrap(g,t1,W-2*P);g.font='400 16px '+FB;var L2=t2?wrap(g,t2,W-2*P):[];
var chartH=22+10+22+10+BH+G+parts.length*RH;
var H=P+18+L1.length*31+(L2.length?6+L2.length*21:0)+24+chartH+20+56;
cv.width=W*S;cv.height=H*S;g.scale(S,S);g.fillStyle='#ffffff';g.fillRect(0,0,W,H);
var y=P;g.textBaseline='alphabetic';g.fillStyle='#56554f';g.font='400 13px '+FM;g.fillText(k,P,y+12);y+=22;
g.fillStyle=INK;g.font='500 24px '+FD;L1.forEach(function(s){y+=28;g.fillText(s,P,y);y+=3;});
if(L2.length){y+=6;g.fillStyle=INK2;g.font='400 16px '+FB;L2.forEach(function(s){y+=19;g.fillText(s,P,y);y+=2;});}
y+=24;
var brk=function(x0,x1,yy){g.strokeStyle=INK2;g.lineWidth=1;g.beginPath();g.moveTo(x0+0.5,yy+5);g.lineTo(x0+0.5,yy+0.5);g.lineTo(x1-0.5,yy+0.5);g.lineTo(x1-0.5,yy+5);g.stroke();};
var say=function(L,x,yy,right){g.font='600 14px '+FU;var bw=g.measureText(L.b+' ').width;g.font='400 14px '+FU;var rw=g.measureText(L.r).width,x0=right?x-bw-rw:x;g.fillStyle=INK;g.font='600 14px '+FU;g.fillText(L.b,x0,yy);g.fillStyle=INK2;g.font='400 14px '+FU;g.fillText(L.r,x0+bw,yy);};
say(LW,P+CW,y+15,true);y+=22;brk(P,P+CW,y);y+=10;
say(LT,P,y+15,false);y+=22;brk(P,X(tv),y);y+=10;
var yb=y;
g.save();g.beginPath();g.rect(X(lo),yb,X(hi)-X(lo),BH);g.clip();g.strokeStyle=RULE;g.lineWidth=1.5;for(var i=-BH;i<X(hi)-X(lo)+BH;i+=6){g.beginPath();g.moveTo(X(lo)+i,yb+BH);g.lineTo(X(lo)+i+BH,yb);g.stroke();}g.restore();
var at=0;parts.forEach(function(p,i){p.x0=X(at);at+=p.v;p.x1=X(at);g.fillStyle=p.top?WINE:TINT;g.fillRect(p.x0+(i?0.6:1.5),yb+1.5,Math.max(1,p.x1-p.x0-(i?1.2:2.1)),BH-3);});
g.strokeStyle=RULE;g.lineWidth=1.5;g.strokeRect(P+0.75,yb+0.75,CW-1.5,BH-1.5);g.beginPath();g.moveTo(X(lo),yb);g.lineTo(X(lo),yb+BH);g.stroke();
var lx=X(at)+18;
parts.slice().reverse().forEach(function(p,i){var ry=yb+BH+G+i*RH+RH/2,cx=(p.x0+p.x1)/2;
g.strokeStyle=p.top?WINE:RULE;g.lineWidth=1;g.beginPath();g.moveTo(cx,yb+BH+2);g.lineTo(cx,ry);g.lineTo(lx-6,ry);g.stroke();
g.font=(p.top?'600':'400')+' 14px '+FU;g.fillStyle=p.top?INK:INK2;g.fillText(p.nm,lx,ry+5);var nw=g.measureText(p.nm).width;
g.font=(p.top?'700 15px ':'400 14px ')+FU;g.fillStyle=p.top?WINE:INK;g.fillText(p.vt,lx+nw+10,ry+5);});
y=yb+BH+G+parts.length*RH;
y+=14;g.fillStyle=LINE;g.fillRect(P,y,W-2*P,1);y+=22;
g.fillStyle='#45443f';g.font='400 12.5px '+FU;var sl=wrap(g,(srcT?'Source: '+srcT:''),W-2*P);sl.slice(0,1).forEach(function(s){g.fillText(s,P,y);});
g.fillStyle='#56554f';g.font='400 12px '+FM;g.fillText(addr,P,y+20);
save(cv,fig,k);
}
/* hovering a part, or its name, lights both and dims the rest (15.3) */
function pwLit(pw,key){[].forEach.call(pw.querySelectorAll('[data-k]'),function(x){x.classList.toggle('lit',x.getAttribute('data-k')===key);});pw.classList.toggle('has-lit',key!=null);}
D.addEventListener('pointerover',function(e){var pw=e.target.closest?e.target.closest('.figure .pw'):null;if(!pw)return;var t=e.target.closest('[data-k]');pwLit(pw,t&&pw.contains(t)?t.getAttribute('data-k'):null);});
D.addEventListener('pointerout',function(e){var pw=e.target.closest?e.target.closest('.figure .pw'):null;if(pw&&!(e.relatedTarget&&pw.contains(e.relatedTarget)))pwLit(pw,null);});
function png(fig){
if(fig.querySelector('.fig-body .tl'))return pngTl(fig);
if(fig.querySelector('.fig-body .pw'))return pngWithin(fig);
var hb=[].slice.call(fig.querySelectorAll('.hbars .hb')),cl=[].slice.call(fig.querySelectorAll('.cols-plot .col')),cg=[].slice.call(fig.querySelectorAll('.cg-row:not(.cg-axis)'));
var kind=hb.length?'hb':cl.length?'cols':'cg',labs=fig.querySelectorAll('.cols-lab span');
var num=function(r,a){var v=r.getAttribute(a);return v==null||v===''?null:+v;};
var rows=(hb.length?hb:cl.length?cl:cg).map(function(r,i){return{l:kind==='hb'?txt(r.querySelector('.hb-l')):kind==='cols'?txt(labs[i]):txt(r.querySelector('.cg-l b')),s:kind==='cg'?txt(r.querySelector('.cg-l small')):'',v:txt(r.querySelector(kind==='hb'?'.hb-r > b':kind==='cols'?'b':'.cg-v')),n:num(r,'data-v')||0,hi:num(r,'data-hi'),ref:num(r,'data-ref'),rl:txt(r.querySelector('.hb-ref span,.col-ref span')),a:num(r,'data-a'),b:num(r,'data-b'),lo:num(r,'data-lo'),top:r.classList.contains('top'),rest:r.classList.contains('rest'),span:r.classList.contains('span')};});
if(!rows.length)return;
var k=txt(fig.querySelector('.fig-k')),t1=txt(fig.querySelector('.fig-title')),t2=txt(fig.querySelector('.fig-sub'));
var src=fig.querySelector('.fs-src'),sc=src?src.cloneNode(true):null;if(sc)[].forEach.call(sc.querySelectorAll('.fs-k'),function(x){x.remove();});
var dl=(/Data: (.+)\.$/.exec(txt(fig.querySelector('.fig-cite-box .ch-cite-text')))||[])[1];
var srcT=dl||(sc?txt(sc).replace(/\s*\d+$/,''):''),addr=txt(fig.querySelector('.fig-cite-box a')).replace(/^https?:\/\//,'');
var W=800,P=40,S=2,cv=el('canvas'),g=cv.getContext('2d');
var FD='"Fraunces",Georgia,serif',FB='"Source Serif 4",Georgia,serif',FU='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',FM='"Fragment Mono",Menlo,monospace';
var WINE='#7a1f2b',TINT='#d2d1cc',INK='#171716',INK2='#45443f',RULE='#8c8a84',LINE='#e1e0db';
var hi=function(r){return r.hi!=null?r.hi:r.n;},max=Math.max.apply(null,rows.map(hi))||1;
var vwid=function(){return Math.max.apply(null,rows.map(function(r){g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;return g.measureText(r.v).width;}));};
function hatch(x,y,w,h,c){if(w<=0||h<=0)return;g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.strokeStyle=c;g.lineWidth=1.5;for(var i=-h;i<w+h;i+=6){g.beginPath();g.moveTo(x+i,y+h);g.lineTo(x+i+h,y);g.stroke();}g.restore();}
function range(r,x,y,w,h,lo,vert){var c=r.top?WINE:RULE;g.fillStyle=r.top&&!r.span?WINE:TINT;if(vert){g.fillRect(x,y+h-lo,w,lo);hatch(x,y,w,h-lo,c);}else{g.fillRect(x,y,lo,h);hatch(x+lo,y,w-lo,h,c);}g.strokeStyle=c;g.lineWidth=1.5;g.strokeRect(x+0.75,y+0.75,w-1.5,h-1.5);}
g.font='500 24px '+FD;var L1=wrap(g,t1,W-2*P);g.font='400 16px '+FB;var L2=t2?wrap(g,t2,W-2*P):[];
var lw=0,cw=0,sp=0,LL=[],hasRef=rows.some(function(r){return r.ref!=null;}),chartH;
if(kind==='hb'){g.font='400 14px '+FU;lw=Math.min(W*0.42,Math.max.apply(null,rows.map(function(r){return g.measureText(r.l).width;}))+8);chartH=rows.length*34+(hasRef?20:0);}
else if(kind==='cols'){var n=rows.length;cw=Math.min(140,(W-2*P-(n-1)*18)/n);sp=(W-2*P-n*cw)/(n+1);g.font='600 13.5px '+FU;LL=rows.map(function(r){return wrap(g,r.l,cw+sp-6);});chartH=26+190+10+Math.max.apply(null,LL.map(function(l){return l.length;}))*18;}
else{g.font='600 14.5px '+FU;lw=Math.max.apply(null,rows.map(function(r){g.font='600 14.5px '+FU;var a=g.measureText(r.l).width;g.font='400 12.5px '+FU;return Math.max(a,g.measureText(r.s).width);}))+20;chartH=30+rows.length*50;}
var H=P+18+L1.length*31+(L2.length?6+L2.length*21:0)+24+chartH+20+56;
cv.width=W*S;cv.height=H*S;g.scale(S,S);g.fillStyle='#ffffff';g.fillRect(0,0,W,H);
var y=P;g.textBaseline='alphabetic';g.fillStyle='#56554f';g.font='400 13px '+FM;g.fillText(k,P,y+12);y+=22;
g.fillStyle=INK;g.font='500 24px '+FD;L1.forEach(function(s){y+=28;g.fillText(s,P,y);y+=3;});
if(L2.length){y+=6;g.fillStyle=INK2;g.font='400 16px '+FB;L2.forEach(function(s){y+=19;g.fillText(s,P,y);y+=2;});}
y+=24;
if(kind==='hb'){var x0=P+lw+12,bw=W-P-x0-Math.max(90,vwid()+14);
rows.forEach(function(r){var w=Math.max(1,hi(r)/max*bw);
g.textAlign='right';g.fillStyle=r.top?INK:INK2;g.font=(r.top?'600':'400')+' 14px '+FU;g.fillText(r.l,P+lw,y+16);g.textAlign='left';
if(r.rest){g.save();g.beginPath();g.rect(x0,y,w,22);g.clip();g.strokeStyle=RULE;g.lineWidth=1;for(var i=-22;i<w+22;i+=5){g.beginPath();g.moveTo(x0+i,y+22);g.lineTo(x0+i+22,y);g.stroke();}g.restore();g.strokeRect(x0+0.5,y+0.5,w-1,21);}
else if(r.hi!=null){range(r,x0,y,w,22,r.n/r.hi*w,false);if(r.ref!=null){var rx=x0+r.ref/r.hi*w;g.fillStyle=INK;g.fillRect(rx-1,y-5,2,32);g.fillStyle=INK2;g.font='400 12.5px '+FU;g.textAlign='center';g.fillText(r.rl,rx,y+44);g.textAlign='left';}}
else{g.fillStyle=r.top?WINE:TINT;g.fillRect(x0,y,w,22);}
g.fillStyle=r.top?WINE:INK2;g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;g.fillText(r.v,x0+w+10,y+16);y+=34+(r.ref!=null?20:0);});}
else if(kind==='cols'){var yb=y+26+190;
rows.forEach(function(r,i){var x=P+sp*(i+1)+cw*i,cx=x+cw/2,h=Math.max(1,hi(r)/max*190);
if(r.rest){g.save();g.beginPath();g.rect(x,yb-h,cw,h);g.clip();g.strokeStyle=RULE;g.lineWidth=1;for(var j=-h;j<cw+h;j+=5){g.beginPath();g.moveTo(x+j,yb);g.lineTo(x+j+h,yb-h);g.stroke();}g.restore();g.strokeRect(x+0.5,yb-h+0.5,cw-1,h-1);}
else if(r.hi!=null){range(r,x,yb-h,cw,h,r.n/r.hi*h,true);if(r.ref!=null){var ry=yb-r.ref/r.hi*h;g.fillStyle=INK;g.fillRect(x-5,ry-1,cw+10,2);g.fillStyle=INK2;g.font='400 12.5px '+FU;g.fillText(r.rl,x+cw+10,ry+4);}}
else{g.fillStyle=r.top?WINE:TINT;g.fillRect(x,yb-h,cw,h);}
g.textAlign='center';g.fillStyle=r.top?WINE:INK2;g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;g.fillText(r.v,cx,yb-h-8);
g.fillStyle=r.top?INK:INK2;g.font=(r.top?'600':'400')+' 13.5px '+FU;LL[i].forEach(function(s,j){g.fillText(s,cx,yb+20+j*18);});g.textAlign='left';});
g.fillStyle=INK;g.fillRect(P,yb,W-2*P,1);y+=chartH;}
else{var vw=vwid()+16,x0=P+lw,x1=W-P-vw,lo=rows[0].lo,top=num(cg[0],'data-hi'),X=function(v){return x0+(x1-x0)*(v-lo)/((top-lo)||1);};
g.textAlign='center';g.fillStyle='#56554f';g.font='400 12px '+FU;[].forEach.call(fig.querySelectorAll('.cg-axis .cg-t span'),function(s){var p=parseFloat(s.style.left)/100;g.fillText(txt(s),x0+(x1-x0)*p,y+12);g.fillStyle=LINE;g.fillRect(Math.round(x0+(x1-x0)*p),y+22,1,rows.length*50);g.fillStyle='#56554f';});g.textAlign='left';y+=30;
var ends=[].map.call(fig.querySelectorAll('.cg-end'),txt);
rows.forEach(function(r,i){var cy=y+20,c=r.top?WINE:INK,xa=X(r.a),xb=X(r.b),d=xb<xa?-1:1,hl=r.top?11:8,hw=r.top?6:4.5;
g.fillStyle=INK;g.font=(r.top?'600':'500')+' 14.5px '+FU;g.fillText(r.l,P,cy-2);g.fillStyle='#56554f';g.font='400 12.5px '+FU;g.fillText(r.s,P,cy+15);
if(i===0&&ends.length===2){g.textAlign='center';g.fillStyle=INK2;g.font='400 12px '+FU;g.fillText(ends[0],xa,cy-12);g.fillText(ends[1],xb,cy-12);g.textAlign='left';}
g.strokeStyle=c;g.lineWidth=r.top?2.6:1.6;g.beginPath();g.moveTo(xa+d*5,cy);g.lineTo(xb-d*hl,cy);g.stroke();
g.fillStyle=c;g.beginPath();g.moveTo(xb,cy);g.lineTo(xb-d*hl,cy-hw);g.lineTo(xb-d*hl,cy+hw);g.closePath();g.fill();
g.fillStyle='#ffffff';g.strokeStyle=c;g.lineWidth=1.6;g.beginPath();g.arc(xa,cy,5,0,Math.PI*2);g.fill();g.stroke();
g.fillStyle=c;g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;g.fillText(r.v,x1+16,cy+5);y+=50;});}
y+=14;g.fillStyle=LINE;g.fillRect(P,y,W-2*P,1);y+=22;
g.fillStyle='#45443f';g.font='400 12.5px '+FU;var sl=wrap(g,(srcT?'Source: '+srcT:''),W-2*P);sl.slice(0,1).forEach(function(s){g.fillText(s,P,y);});
g.fillStyle='#56554f';g.font='400 12px '+FM;g.fillText(addr,P,y+20);
save(cv,fig,k);
}
function add(acts){
if(acts.getAttribute('data-ready'))return;acts.setAttribute('data-ready','1');
var kind=acts.getAttribute('data-kind'),fig=acts.closest('.figure');if(!fig||['bars','stack','columns','change','timeline','within'].indexOf(kind)<0)return;
var tl=kind==='timeline'; /* a timeline takes a PNG but no Table: it is already its rows, each date beside its event (28 Oct 2026) */
var tb=tl?null:el('button','fs-tab','Table');if(tb){tb.type='button';tb.setAttribute('aria-pressed','false');
tb.addEventListener('click',function(){var on=!fig.classList.contains('is-table'),t=fig.querySelector('table.fig-table');fig.classList.toggle('is-table',on);if(t)t.classList.toggle('sr-only',!on);tb.setAttribute('aria-pressed',on?'true':'false');});}
var pb=el('button','fs-png','PNG');pb.type='button';pb.setAttribute('aria-label','Save the figure as a PNG picture');
pb.addEventListener('click',function(){var go=function(){png(fig);};if(D.fonts&&D.fonts.ready)D.fonts.ready.then(go);else go();});
var cite=acts.querySelector('.ch-cite-btn');if(tb)acts.insertBefore(tb,cite?cite.nextSibling:acts.firstChild);acts.appendChild(pb);
}
[].forEach.call(D.querySelectorAll('.figure .fs-acts'),add);
})();
} catch (e) { console.warn('figure actions failed', e); }
/* rail toggle */
try {
(function(){
var D=document,H=D.documentElement,K='cp-rail';
var IC='<svg class="rt-ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M6 2.5v11"/></svg>';
function mk(cls,id,words,open){var b=D.createElement('button');b.type='button';b.className='rail-tog '+cls;b.setAttribute('aria-controls',id);b.setAttribute('aria-expanded',open?'true':'false');b.innerHTML=IC+'<span class="rt-t">'+words+'</span>';return b;}
[].forEach.call(D.querySelectorAll('nav.ch-rail'),function(n){var body=n.querySelector('.rail-body');if(!body||!body.id||n.querySelector('.rail-tog'))return;
var k=body.querySelector('.rail-on .rail-k')||body;k.appendChild(mk('rail-hide',body.id,'Hide contents',true));n.insertBefore(mk('rail-show',body.id,'Show contents',false),body);});
D.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.ch-rail .rail-tog'):null;if(!b)return;
var off=b.classList.contains('rail-hide');H.classList.toggle('rail-off',off);try{if(off)localStorage.setItem(K,'off');else localStorage.removeItem(K);}catch(x){}
var n=b.closest('.ch-rail'),to=n&&n.querySelector(off?'.rail-show':'.rail-hide');if(to)try{to.focus({preventScroll:true});}catch(x){to.focus();}
try{window.dispatchEvent(new Event('resize'));}catch(x){}});
})();
} catch (e) { console.warn('rail toggle failed', e); }
