/* CHIP SUPPLY CHAIN runtime: theme, router, WebGL specimen stage, section tracking, landscape / suppliers / geopolitics views. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var DATA = window.CP_DATA || {};
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = function () { return window.innerWidth < 900; };
  var safeUrl = function (u) { var v = String(u == null ? '' : u).trim(); return /^(https?:|mailto:|#|\/)/i.test(v) ? esc(v) : '#'; }; // data-fed link targets may only be web links, mail, fragments or site paths
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var dec = function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } }; // a hand-typed "#%" is not valid escaping and must not throw the router
  var COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', TW: 'Taiwan', KR: 'South Korea', CN: 'China', DE: 'Germany', CH: 'Switzerland', GB: 'United Kingdom', FR: 'France', IL: 'Israel', SG: 'Singapore', MY: 'Malaysia', AT: 'Austria', IT: 'Italy', BE: 'Belgium', IN: 'India', AE: 'United Arab Emirates', SA: 'Saudi Arabia', CA: 'Canada', SE: 'Sweden', FI: 'Finland', DK: 'Denmark', IE: 'Ireland', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', MX: 'Mexico', 'EU-other': 'Other Europe', Other: 'Other' };
  var cname = function (c) { return COUNTRY[c] || c; };

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
        $('.ic-moon', b).hidden = dark; $('.ic-sun', b).hidden = !dark;
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
    init: function () {
      this.canvas = $('#stage-canvas');
      this.fig = $('.stage');
      if (!this.canvas || !this.fig) return;
      var gl = this.canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' }) ||
               this.canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
      if (!gl || !window.PC) { this.fig.setAttribute('data-hidden', '1'); return; }
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
      catch (e) { this.fig.setAttribute('data-hidden', '1'); return; }
      gl.useProgram(prog);
      this.loc = { aP: gl.getAttribLocation(prog, 'aP'), uMVP: gl.getUniformLocation(prog, 'uMVP'), uSize: gl.getUniformLocation(prog, 'uSize'), uOp: gl.getUniformLocation(prog, 'uOp'), uInk: gl.getUniformLocation(prog, 'uInk'), uAcc: gl.getUniformLocation(prog, 'uAcc'), uAcc2: gl.getUniformLocation(prog, 'uAcc2') };
      gl.enableVertexAttribArray(this.loc.aP);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
      PC.density = narrow() ? 0.55 : (window.devicePixelRatio > 1.5 ? 0.85 : 1);
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
      var cs = getComputedStyle(document.documentElement);
      var p = function (v, d) { var m = (cs.getPropertyValue(v) || '').split(','); if (m.length < 3) return d; return [parseFloat(m[0]) / 255, parseFloat(m[1]) / 255, parseFloat(m[2]) / 255]; };
      this.ink = p('--stage-ink', this.ink); this.accent = p('--stage-accent', this.accent);
      // a specimen's own colours are picked per theme: accentDark/accent2Dark when data-theme="dark", else the light
      // colour lifted by PC.lift (HSL lightness raised to at least 0.62, hue and saturation kept); see src/kit.js
      this.dark = document.documentElement.getAttribute('data-theme') === 'dark';
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
    },
    build: function (name, params) {
      if (!this.ok || !name) return null; // no context: building the cloud would cost the work and then throw at the buffer
      var key = name + '|' + JSON.stringify(params || {});
      if (this.cache[key]) return this.cache[key];
      var spec;
      try { spec = PC.build(name, params); } catch (e) { console.warn('specimen failed:', name, e.message); return null; }
      var gl = this.gl, vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, spec.cloud, gl.STATIC_DRAW);
      var slot = { key: key, vbo: vbo, n: PC.count(spec.cloud), spin: spec.spin, tilt: spec.tilt, turntable: !!spec.turntable, caption: spec.caption, spinBase: 0,
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
    },
    // with no WebGL there is nothing to draw, so the figure stays hidden rather than framing an empty canvas under a stale tag
    setVisible: function (v) { var self = this; this.active = v; if (!this.fig) return; var show = v && this.ok; this.fig.setAttribute('data-hidden', show ? '0' : '1'); if (show) { this.resize(); requestAnimationFrame(function () { self.resize(); }); } },
    draw: function (slot, op, extraRot, sc) {
      var gl = this.gl, aspect = this.w / this.h;
      var P = perspective(34 * Math.PI / 180, aspect, 0.1, 40);
      // pull the camera back on narrow (portrait) stages so the bounding sphere fits the width too
      var V = translate(0, 0, -3.8 * Math.max(1, 0.98 / aspect)); // 3.8 keeps the unit sphere inside 89% of the canvas height, including perspective
      var t = slot.tilt;
      // turntable specimens spin about their own vertical axis before the tilt (a plan view rotating in its plane); the rest spin about the world axis
      var idle = this.spin + slot.spinBase;
      var M = slot.turntable
        ? mul(rotZ(t[2]), mul(rotY(t[1] + this.scrollAngle + extraRot), mul(rotX(t[0]), rotY(idle))))
        : mul(rotZ(t[2]), mul(rotY(t[1] + idle + this.scrollAngle + extraRot), rotX(t[0])));
      M = mul(M, scale(sc));
      if (this.userYaw || this.userPitch) M = mul(rotX(this.userPitch), mul(rotY(this.userYaw), M)); // the reader's own turn, about the world axes
      var MVP = mul(P, mul(V, M));
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
      c.setAttribute('tabindex', '0'); c.setAttribute('aria-label', '3D specimen; drag or use the arrow keys to turn it');
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
      var dt = Math.min(0.05, (t - this.lastT) / 1000 || 0); this.lastT = t;
      var gl = this.gl;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (!this.cur) return;
      if (!reduced && !this.held) this.spin += (this.cur.spin || 0.1) * dt; // the idle turn pauses while the pointer rests on the specimen
      var k = easeOut((t - this.transStart) / this.transDur);
      if (this.prev && k < 1) this.draw(this.prev, 1 - k, 0.35 * k, 1 + 0.04 * k);
      else this.prev = null;
      this.draw(this.cur, k, -0.45 * (1 - k), 0.94 + 0.06 * k);
    }
  };


  /* ---------------- phone specimen strip: a bottom bar with a live thumbnail; Show expands it; Contents opens the sheet ---------------- */
  var Band = {
    el: null, collapsed: true,
    init: function () {
      var self = this; this.el = $('.stage'); if (!this.el) return;
      var toggle = $('.stage-toggle'), menu = $('.stage-menu'), sheet = $('#sheet');
      this.set(true);
      if (toggle) toggle.addEventListener('click', function () { self.set(!self.collapsed); });
      var open = function (v) { if (!sheet) return; sheet.hidden = !v; document.documentElement.style.overflow = v ? 'hidden' : ''; if (v) { var c = $('.sheet-close'); if (c) c.focus(); } };
      if (menu) menu.addEventListener('click', function () { open(true); });
      if (sheet) {
        sheet.addEventListener('click', function (e) { if (e.target.closest('a') || e.target.closest('.sheet-close')) { open(false); self.set(true); } });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) open(false); });
        // Back and Forward leave the sheet standing over the new view with the page still locked, so close it on any route change
        window.addEventListener('hashchange', function () { if (!sheet.hidden) open(false); });
      }
      window.addEventListener('resize', function () { if (!narrow()) { open(false); self.set(true); } });
    },
    set: function (collapsed) {
      this.collapsed = collapsed;
      this.el.setAttribute('data-collapsed', collapsed ? '1' : '0');
      var t = $('.stage-toggle'); if (t) { t.textContent = collapsed ? 'Expand' : 'Collapse'; t.setAttribute('aria-expanded', collapsed ? 'false' : 'true'); }
    }
  };

  /* ---------------- router ---------------- */
  var VIEWS = ['home', 'stack', 'chain', 'intro', 'walk', 'briefing', 'landscape', 'suppliers', 'geopolitics', 'controls', 'thresholds', 'exposure', 'glossary', 'sources'];
  var ALIAS = { chain: 'stack', home: 'walk', intro: 'walk', briefing: 'walk', geopolitics: 'stack', thresholds: 'controls', sources: 'stack' }; // the Sources page was retired; its sources sit at the end of each chapter // the licence-thresholds tab was retired; its route lands on the board
  var MODULE_VIEWS = {}; // modules register { activate(), stage: bool } per view through window.CP.register
  var Router = {
    current: null,
    init: function () {
      var self = this;
      window.addEventListener('hashchange', function () { self.route(); });
      var wm = $('.wordmark'); // the wordmark always takes you back to the top of the stack
      if (wm) wm.addEventListener('click', function (e) { e.preventDefault(); if (location.hash && location.hash !== '#/') location.hash = '#/'; window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
      this.route();
    },
    route: function () {
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
      var changed = v !== this.current || sub !== this.currentSub;
      this.current = v; this.currentSub = sub;
      if (sub) {
        $$('.view[data-view="controls"] .sub').forEach(function (s) { s.hidden = s.getAttribute('data-sub') !== sub; });
        $$('#controls-subtabs a').forEach(function (a) { if (a.getAttribute('data-sub') === sub) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }
      $$('.view').forEach(function (s) { s.hidden = s.getAttribute('data-view') !== v; });
      $$('.tabs a').forEach(function (a) { var dv = a.getAttribute('data-view'); var on = dv === v; if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      if (narrow()) { var onTab = $('.tabs a[aria-current="page"]'); if (onTab && onTab.scrollIntoView) onTab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } // the phone tab strip scrolls; keep the current tab in view
      var rail = $('.rail'); if (rail && v !== 'stack') rail.setAttribute('data-show', '0');
      var mv = MODULE_VIEWS[v];
      Stage.setVisible(v === 'stack' || v === 'landscape' || v === 'walk' || !!(mv && mv.stage));
      if (mv && mv.activate) { try { mv.activate(); } catch (err) { console.warn('view module failed', v, err); } }
      if (v === 'landscape') Landscape.activate();
      else if (v === 'suppliers') Suppliers.activate();
      else if (v === 'controls') { Controls.activate(); if (!Geo.built) Geo.build(); }
      if (changed && !anchor) window.scrollTo(0, 0); // no anchor to land on, so start the new view at the top ("#/" included)
      if (v === 'stack' || v === 'walk') {
        if (anchor) {
          var el = document.getElementById(anchor);
          if (el) {
            if (!this.booted) { // first load: jump, do not animate 30,000 px
              var root = document.documentElement, prev = root.style.scrollBehavior;
              root.style.scrollBehavior = 'auto'; el.scrollIntoView({ block: 'start' }); root.style.scrollBehavior = prev;
            } else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
          }
          this.booted = true;
        }
        Sections.update();
      }
      var label = { stack: 'The Chain', landscape: 'AI Chips', suppliers: 'Suppliers', controls: sub === 'exposure' ? 'China revenue share' : 'Export Controls', glossary: 'Glossary' }[v];
      document.title = (v === 'home' || !label) ? 'Chip Supply Chain' : 'Chip Supply Chain · ' + label;
      // one page view per route change (the counter counts the first load itself)
      var gc = window.goatcounter;
      if (gc && gc.path) { var pth = gc.path(); if (this.counted === undefined) this.counted = pth; else if (pth !== this.counted && gc.count) { this.counted = pth; try { gc.count(); } catch (err) { } } }
    }
  };

  /* ---------------- section tracking (stack view) ---------------- */
  var Sections = {
    items: [], walkItems: [], currentId: null, heroBottom: 0,
    init: function () {
      var self = this;
      this.items = $$('[data-view="stack"] [data-specimen]');
      this.walkItems = $$('[data-view="walk"] [data-specimen]');
      this.railItems = $$('.rail li');
      window.addEventListener('scroll', function () { self.update(); }, { passive: true });
      window.addEventListener('resize', function () { self.update(); });
      $('.to-top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
      var stageTop = $('.stage-top'); if (stageTop) stageTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }); // on phones Top lives in the bottom strip, clear of the text
      this.update();
    },
    update: function () {
      var toTop = $('.to-top'); // Back to top (and the phone strip's Top button, which follows it) on every long page, not only the chain
      if (toTop) {
        var contentsEl = Router.current === 'stack' ? $('#contents') : null;
        toTop.setAttribute('data-show', (contentsEl ? contentsEl.getBoundingClientRect().bottom < 0 : window.scrollY > window.innerHeight * 0.8) ? '1' : '0');
      }
      if (Router.current !== 'stack' && Router.current !== 'walk') return;
      var items = Router.current === 'walk' ? this.walkItems : this.items;
      if (!items || !items.length) return; // before init, or a view with nothing to track
      var vh = window.innerHeight, probe = narrow() ? vh * 0.55 : vh * 0.42, best = null, bestTop = -Infinity;
      for (var i = 0; i < items.length; i++) {
        var r = items[i].getBoundingClientRect();
        if (r.top <= probe && r.top > bestTop) { best = items[i]; bestTop = r.top; }
      }
      if (!best) best = items[0];
      if (!best) return;
      var r2 = best.getBoundingClientRect();
      var p = r2.height > vh ? Math.max(0, Math.min(1, (probe - r2.top) / (r2.height - vh * 0.3))) : 0;
      Stage.scrollAngle = (reduced ? 0 : p * 1.15);
      var id = best.id || best.getAttribute('data-specimen');
      if (id !== this.currentId) {
        this.currentId = id;
        var num = best.getAttribute('data-number');
        Stage.show(best.getAttribute('data-specimen'), null, best.getAttribute('data-caption') ? esc(best.getAttribute('data-caption')) : null,
          num ? 'Specimen <b>' + num + '</b> · ' + esc(best.getAttribute('data-title') || '') : 'Specimen <b>00</b> · the whole chip');
        var seen = true;
        this.railItems.forEach(function (li) {
          var on = li.getAttribute('data-id') === id;
          if (on) { li.setAttribute('aria-current', 'true'); seen = false; } else li.removeAttribute('aria-current');
          li.classList.toggle('done', seen && !on);
        });
      }
      var contents = $('#contents'), rail = $('.rail');
      var past = contents ? contents.getBoundingClientRect().bottom < 0 : window.scrollY > vh;
      if (rail) rail.setAttribute('data-show', past ? '1' : '0');
    }
  };

  /* ---------------- AI chips: compare two to four ---------------- */
  var Landscape = {
    chips: DATA.landscape || [],
    notes: DATA.landscapeNotes || {},
    max: 4,
    picked: [],       // the selected chip ids, in the order the reader added them
    sel: null,        // the focused chip: its render fills the stage and its notes open
    built: false,
    hint: '',
    exportRows: [],   // the export bar in Tools holds this same array, so mutate it, never replace it

    /* ---- data ---- */
    byId: function (id) { for (var i = 0; i < this.chips.length; i++) if (this.chips[i].id === id) return this.chips[i]; return null; },
    selection: function () { var self = this, out = []; this.picked.forEach(function (id) { var c = self.byId(id); if (c) out.push(c); }); return out; },
    initSelection: function () { // the page opens with nothing chosen
      var self = this;
      this.picked = []; this.sel = null; // the page opens with nothing chosen: the reader picks the chips to compare
      this.syncExport();
    },
    syncExport: function () { // Tools' copy buttons read this array at click time
      var rows = this.selection();
      this.exportRows.length = 0;
      for (var i = 0; i < rows.length; i++) this.exportRows.push(rows[i]);
      var wrap = $('#cx-table-wrap'), bar = wrap && wrap.previousElementSibling;
      if (bar && bar.classList && bar.classList.contains('export-bar')) {
        var n = bar.querySelector('.count');
        if (n) n.textContent = rows.length + (rows.length === 1 ? ' row' : ' rows') + ' · chips compared';
      }
    },

    /* ---- lifecycle ---- */
    activate: function () {
      if (!this.built) this.buildUI();
      var c = this.byId(this.sel);
      if (c) this.showStage(c);
    },
    buildUI: function () {
      this.built = true;
      var self = this, pk = $('#picker'), html = '';
      // countries in the order they first appear, China last; within a country one row per maker, chips in data order (newest first)
      var ccs = [], byCC = {};
      this.chips.forEach(function (c) { var cc = c.vendorCountry || '??'; if (!byCC[cc]) { byCC[cc] = { vendors: [], byV: {} }; ccs.push(cc); } var g = byCC[cc]; if (!g.byV[c.vendor]) { g.byV[c.vendor] = []; g.vendors.push(c.vendor); } g.byV[c.vendor].push(c); });
      ccs.sort(function (a, b) { return (a === 'CN') - (b === 'CN'); });
      ccs.forEach(function (cc) {
        var g = byCC[cc];
        html += '<div class="group" data-cc="' + esc(cc) + '">' + esc(cname(cc)) + '</div>';
        g.vendors.forEach(function (v) {
          html += '<div class="vrow"><span class="vname">' + esc(v) + '</span><div class="vchips">' + g.byV[v].map(function (c) {
            var sub = c.family && c.family !== c.name ? c.family : (c.announced ? String(c.announced).slice(0, 4) : '');
            return '<button type="button" data-id="' + esc(c.id) + '" data-cc="' + esc(cc) + '" aria-pressed="false"><b>' + esc(c.name) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</button>';
          }).join('') + '</div></div>';
        });
      });
      pk.innerHTML = html;
      pk.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) self.toggle(b.getAttribute('data-id')); });
      pk.addEventListener('keydown', function (e) { self.arrows(e, $$('button', pk)); });
      var clear = $('#cx-clear');
      if (clear) clear.addEventListener('click', function () { self.clear(); });
      var plans = $('#cx-plans');
      if (plans) {
        plans.addEventListener('click', function (e) { var b = e.target.closest('button[data-id]'); if (b) self.focus(b.getAttribute('data-id')); });
        plans.addEventListener('keydown', function (e) { self.arrows(e, $$('button[data-id]', plans)); });
      }
      var rt = null;
      window.addEventListener('resize', function () {
        if (Router.current !== 'landscape') return;
        clearTimeout(rt); rt = setTimeout(function () { self.renderPlans(); self.scrollCue(); }, 160);
      });
      var tw = $('#cx-table-wrap');
      if (tw) tw.addEventListener('scroll', function () { self.scrollCue(); }, { passive: true });
      var tb = $('#cx-table');
      if (tb) tb.addEventListener('click', function (e) {
        var j = e.target.closest('button[data-notes]');
        if (j) { var id = j.getAttribute('data-notes'); self.focus(id); self.jumpToNotes(id); return; }
        var b = e.target.closest('button[data-id]');
        if (b) self.focus(b.getAttribute('data-id'));
      });
      this.render();
    },
    arrows: function (e, list) { // arrow keys walk the buttons; Home and End jump to the ends
      var i = list.indexOf(document.activeElement), n = null, k = e.key;
      if (i < 0 || !list.length) return;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % list.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + list.length) % list.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = list.length - 1;
      if (n == null) return;
      e.preventDefault();
      list[n].focus();
    },

    /* ---- selection ---- */
    say: function (msg) { this.hint = msg; this.renderCount(); },
    toggle: function (id) {
      var c = this.byId(id); if (!c) return;
      var at = this.picked.indexOf(id);
      if (at >= 0) {
        this.picked.splice(at, 1);
        if (this.sel === id) this.sel = this.picked[0] || null;
      } else {
        if (this.picked.length >= this.max) { this.say('Four is the limit.'); return; }
        this.picked.push(id);
        this.sel = id;
      }
      this.hint = '';
      this.render();
      if (this.sel) this.showStage(this.byId(this.sel));
    },
    focus: function (id) {
      var c = this.byId(id); if (!c) return;
      if (this.picked.indexOf(id) < 0) { this.select(id); return; }
      if (this.sel !== id) { this.sel = id; this.hint = ''; this.render(); }
      this.showStage(c);
    },
    select: function (id) { // the search box calls this: add the chip if it is not in yet, then focus it
      var c = this.byId(id); if (!c) return;
      if (this.picked.indexOf(id) < 0) {
        if (this.picked.length >= this.max) { var out = this.picked.indexOf(this.sel); this.picked.splice(out < 0 ? 0 : out, 1); }
        this.picked.push(id);
      }
      this.sel = id; this.hint = '';
      if (!this.built) this.buildUI(); else this.render();
      this.showStage(c);
    },
    clear: function () {
      this.picked = []; this.sel = null; this.hint = '';
      this.render();
      Stage.show('package', { plan: true }, 'An AI accelerator package, drawn from above.', 'AI chips · <b>package</b>');
    },

    /* ---- render ---- */
    render: function () {
      var self = this;
      $$('#picker button').forEach(function (b) {
        var id = b.getAttribute('data-id');
        b.setAttribute('aria-pressed', self.picked.indexOf(id) >= 0 ? 'true' : 'false');
        if (id === self.sel) b.setAttribute('data-focus', '1'); else b.removeAttribute('data-focus');
      });
      this.renderCount();
      this.renderPlans();
      this.renderTable();
      this.renderNotes();
      this.syncExport();
    },
    renderCount: function () {
      var el = $('#cx-count'); if (!el) return;
      el.innerHTML = this.picked.length ? '<b>' + this.picked.length + '</b> of ' + this.max + ' chips selected' + (this.hint ? ' · <i>' + esc(this.hint) + '</i>' : '') : '';
      var sec = $('section[data-view="landscape"]'); if (sec) sec.setAttribute('data-empty', this.picked.length ? '0' : '1');
    },

    /* ---- package plans, all at one millimetres-per-pixel scale ---- */
    mm: function (v) { return Math.round(v * 100) / 100; },
    planBounds: function (L) {
      if (!L) return null;
      if (L.waferScale) { var d = L.diameterMm || 300; return [d, d]; }
      if (L.substrate) return [L.substrate[0], L.substrate[1]];
      if (L.interposer) return [L.interposer[0], L.interposer[1]];
      var w = 0, h = 0;
      ['interposers', 'base', 'dies', 'hbm'].forEach(function (k) {
        (L[k] || []).forEach(function (r) { w = Math.max(w, Math.abs(r.x) * 2 + r.w); h = Math.max(h, Math.abs(r.y) * 2 + r.h); });
      });
      return (w && h) ? [w, h] : null;
    },
    scaleFor: function (sel, room) { // one scale for every plan on screen: the widest part sets it, and the row fits the column when it can
      var self = this, span = 0, total = 0;
      sel.forEach(function (c) { var b = self.planBounds(c.layout); if (b) { span = Math.max(span, b[0], b[1]); total += b[0]; } });
      if (!span) return 1;
      var k = Math.min((narrow() ? 148 : 196) / span, 2.6);
      var free = (room || 0) - sel.length * 40; // padding and gaps between the cards
      if (!narrow() && total > 0 && free > 80) k = Math.min(k, free / total); // on phones the row scrolls instead of shrinking
      return k;
    },
    rects: function (list, cls) {
      var self = this;
      return (list || []).map(function (r) {
        return '<rect class="' + cls + '" x="' + self.mm(r.x - r.w / 2) + '" y="' + self.mm(-r.y - r.h / 2) + '" width="' + self.mm(r.w) + '" height="' + self.mm(r.h) + '" vector-effect="non-scaling-stroke"/>';
      }).join('');
    },
    box: function (dims, cls, rx) {
      return '<rect class="' + cls + '" x="' + this.mm(-dims[0] / 2) + '" y="' + this.mm(-dims[1] / 2) + '" width="' + this.mm(dims[0]) + '" height="' + this.mm(dims[1]) + '"' + (rx ? ' rx="' + rx + '"' : '') + ' vector-effect="non-scaling-stroke"/>';
    },
    planSVG: function (c, k) {
      var L = c.layout, b = this.planBounds(L);
      if (!b) return '';
      var W = b[0], H = b[1], g = '';
      if (L.waferScale) { // one square cut from a 300 mm disc
        var d = L.diameterMm || 300, s = L.squareMm || Math.round(d / Math.SQRT2), gx = (L.dieGrid || [])[0] || 0, gy = (L.dieGrid || [])[1] || 0, i;
        g += '<circle class="cx-wafer" cx="0" cy="0" r="' + this.mm(d / 2) + '" vector-effect="non-scaling-stroke"/>';
        g += this.box([s, s], 'cx-die');
        for (i = 1; i < gx; i++) g += '<line class="cx-grid" x1="' + this.mm(-s / 2 + s * i / gx) + '" y1="' + this.mm(-s / 2) + '" x2="' + this.mm(-s / 2 + s * i / gx) + '" y2="' + this.mm(s / 2) + '" vector-effect="non-scaling-stroke"/>';
        for (i = 1; i < gy; i++) g += '<line class="cx-grid" x1="' + this.mm(-s / 2) + '" y1="' + this.mm(-s / 2 + s * i / gy) + '" x2="' + this.mm(s / 2) + '" y2="' + this.mm(-s / 2 + s * i / gy) + '" vector-effect="non-scaling-stroke"/>';
      } else {
        if (L.substrate) g += this.box(L.substrate, 'cx-substrate', 1.5);
        if (L.interposer) g += this.box(L.interposer, 'cx-interposer');
        g += this.rects(L.interposers, 'cx-interposer');
        g += this.rects(L.base, 'cx-base');
        g += this.rects(L.dies, 'cx-die');
        g += this.rects(L.hbm, 'cx-hbm');
      }
      return '<svg class="cx-plan-svg" width="' + Math.max(16, this.mm(W * k)) + '" height="' + Math.max(16, this.mm(H * k)) +
        '" viewBox="' + this.mm(-W / 2) + ' ' + this.mm(-H / 2) + ' ' + this.mm(W) + ' ' + this.mm(H) + '" aria-hidden="true" focusable="false">' + g + '</svg>';
    },
    planSize: function (c) {
      var L = c.layout || {}, p = c.package || {};
      if (L.waferScale) return (L.squareMm ? L.squareMm + ' × ' + L.squareMm + ' mm, ' : '') + 'cut from a ' + (L.diameterMm || 300) + ' mm wafer';
      if (L.substrate) return L.substrate[0] + ' × ' + L.substrate[1] + ' mm' + (L.estimated ? ', estimated' : '');
      if (p.sizeMm) return String(p.sizeMm);
      return 'size not published';
    },
    scaleKey: function (k) {
      var steps = [10, 20, 50, 100, 200], mm = steps[0];
      for (var i = 0; i < steps.length; i++) if (steps[i] * k <= 130) mm = steps[i];
      return '<span class="cx-scale"><i style="width:' + Math.round(mm * k) + 'px"></i>' + mm + ' mm</span>';
    },
    renderPlans: function () {
      var self = this, host = $('#cx-plans'); if (!host) return;
      var sel = this.selection(), k = this.scaleFor(sel, host.clientWidth);
      host.innerHTML = sel.map(function (c) {
        var L = c.layout || {}, tip = L.note || (c.package || {}).type || '';
        return '<button type="button" class="cx-plan" data-id="' + esc(c.id) + '" aria-pressed="' + (c.id === self.sel ? 'true' : 'false') + '"' + (tip ? ' title="' + esc(tip) + '"' : '') + '>' +
          '<span class="cx-plan-name"><b>' + esc(c.name) + '</b><em>' + esc(c.vendor) + '</em></span>' +
          '<span class="cx-plan-art">' + self.planSVG(c, k) + '</span>' +
          '<span class="cx-plan-size">' + esc(self.planSize(c)) + '</span></button>';
      }).join('') || '';
      var key = $('#cx-key');
      if (key) key.innerHTML = '<span><i class="cx-sw die"></i>logic die</span><span><i class="cx-sw hbm"></i>memory stack</span><span><i class="cx-sw int"></i>interposer</span><span><i class="cx-sw sub"></i>substrate</span>' + this.scaleKey(k);
    },

    /* ---- the side-by-side table ---- */
    nf: function (v) { return (Math.round(v * 100) / 100).toLocaleString('en-US'); },
    // An empty cell says which kind of empty it is: a format the hardware cannot run reads
    // "not supported", anything else "not published". compute.support carries yes/no/unknown.
    nil: function (c, row) {
      var f = row && row.fmt, sup = f ? ((c && c.compute || {}).support || {})[f] : null;
      return sup === 'no' ? '<span class="cx-nil cx-nil--no">not supported</span>' : '<span class="cx-nil">not published</span>';
    },
    rows: [
      { label: 'Vendor', hint: ['product page', 'press release', 'corporate'], text: function (c) { return esc(c.vendor) + '<span class="cx-2">' + esc(cname(c.vendorCountry)) + '</span>'; } },
      { label: 'Availability', hint: ['product page', 'press release', 'spec table'], text: function (c) { return c.status ? esc(c.status) + (c.shipping ? '<span class="cx-2">from ' + esc(c.shipping) + '</span>' : '') : null; } },
      { label: 'Built for', hint: ['product page', 'blog', 'documentation'], text: function (c) { return c.target ? esc(c.target) : null; } },
      { label: 'Foundry, process node', hint: ['architecture', 'deep dive', 'white paper', 'documentation'], text: function (c) { var p = c.process || {}; return p.foundry ? esc(p.foundry) + '<span class="cx-2">' + esc(p.node || '') + (p.country ? ' · ' + esc(cname(p.country)) : '') + '</span>' : null; } },
      { label: 'Logic dies', hint: ['architecture', 'deep dive', 'white paper'], num: function (c) { return (c.die || {}).count; }, sub: function (c) { var a = (c.die || {}).areaMm2Each; return a != null ? a + ' mm² each' : 'area not published'; } },
      { label: 'Transistors, billion', hint: ['architecture', 'deep dive', 'white paper'], num: function (c) { return (c.die || {}).transistorsB; }, better: 'high' },
      { label: 'Package', hint: ['cowos', 'packag', 'deep dive', 'architecture'], text: function (c) { var p = c.package || {}; return p.type ? esc(p.type) + (p.assembler ? '<span class="cx-2">assembled by ' + esc(p.assembler) + '</span>' : '') : null; } },
      { label: 'Memory type', hint: ['hbm', 'micron', 'memory', 'datasheet'], text: function (c) { var m = c.memory || {}; return m.type ? esc(m.type) + (m.stacks ? '<span class="cx-2">' + m.stacks + ' stacks</span>' : '') : null; } },
      { label: 'Memory, gigabytes', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.memory || {}).capacityGB; }, better: 'high' },
      { label: 'Bandwidth, terabytes/s', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.memory || {}).bandwidthTBs; }, better: 'high' },
      { label: 'Speed at FP16, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.compute || {}).fp16TFLOPS; }, better: 'high', fn: true, fmt: 'fp16' },
      { label: 'Speed at FP8, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.compute || {}).fp8TFLOPS; }, better: 'high', fn: true, fmt: 'fp8' },
      { label: 'Speed at FP4, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.compute || {}).fp4TFLOPS; }, better: 'high', fn: true, fmt: 'fp4' },
      { label: 'Power, watts', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return c.tdpW; } },
      { label: 'Chip-to-chip links', hint: ['architecture', 'deep dive', 'white paper'], long: true, text: function (c) { return (c.interconnect || {}).chipToChip ? esc(c.interconnect.chipToChip) : null; } },
      { label: 'Scale-up, in one rack', hint: ['nvl', 'rack', 'system', 'deep dive', 'spec table'], long: true, text: function (c) { return (c.interconnect || {}).scaleUp ? esc(c.interconnect.scaleUp) : null; } },
      { label: 'Price estimate', hint: ['price', 'semianalysis', 'rack', 'press release'], long: true, text: function (c) { return c.priceEstimate ? esc(c.priceEstimate) : null; } },
      { label: 'Cost to make, estimate', hint: ['cost', 'semianalysis'], long: true, text: function (c) { return c.bomEstimate ? esc(c.bomEstimate) : null; } },
      { label: 'Export-control status', hint: ['federal register', 'entity list', 'institute for progress', 'mofcom'], long: true, text: function (c) { return c.exportStatus ? esc(c.exportStatus) : null; } }
    ],
    sourceTitle: function (c, row) { // the chip's sources are not tagged per field, so match the row's subject against the labels
      var srcs = c.sources || []; if (!srcs.length) return '';
      var hints = row.hint || [];
      for (var h = 0; h < hints.length; h++) for (var i = 0; i < srcs.length; i++) {
        if ((srcs[i].label || '').toLowerCase().indexOf(hints[h]) >= 0) return 'Source: ' + (srcs[i].label || srcs[i].url);
      }
      // nothing in the list is about this row, so list the chip's sources rather than claim one of them
      return 'Sources for the ' + c.name + ': ' + srcs.map(function (x) { return x.label || x.url; }).join(' · ');
    },
    cellHTML: function (c, row, max, marker, multi) {
      var title = this.sourceTitle(c, row), inner;
      if (row.num) {
        var v = row.num(c);
        if (v == null) inner = this.nil(c, row);
        else {
          var best = row.better === 'high' && max > 0 && v === max;
          inner = '<span class="cx-v' + (best ? ' is-best' : '') + '">' + esc(this.nf(v)) + '</span>' + (marker || '') +
            (row.sub ? '<span class="cx-2">' + esc(row.sub(c)) + '</span>' : '') +
            (multi && max > 0 ? '<span class="cx-meter"><i style="width:' + Math.round(Math.max(0, v) / max * 100) + '%"></i></span>' : '');
        }
      } else {
        var t = row.text(c);
        inner = (t == null || t === '') ? this.nil(c, row) : t + (marker || '');
      }
      return '<td class="' + (row.long ? 'cx-long' : '') + (c.id === this.sel ? ' is-focus' : '') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + inner + '</td>';
    },
    // where the table is still wider than its box (a phone, a narrow window), the right edge fades and a line says it scrolls,
    // since Mac and phone browsers hide the scrollbar until the reader scrolls
    scrollCue: function () {
      var w = $('#cx-table-wrap'), hint = $('#cx-more'); if (!w) return;
      var over = w.scrollWidth - w.clientWidth > 4;
      w.setAttribute('data-more', over && w.scrollWidth - w.clientWidth - w.scrollLeft > 4 ? '1' : '0');
      if (hint) hint.hidden = !over;
    },
    renderTable: function () {
      var self = this, tb = $('#cx-table'); if (!tb) return;
      var sel = this.selection(), multi = sel.length > 1, fns = [];
      sel.forEach(function (c) { var n = (c.compute || {}).precisionNote; if (n) fns.push({ c: c, n: n }); });
      var marker = function (c) { for (var i = 0; i < fns.length; i++) if (fns[i].c.id === c.id) return '<sup class="cx-fn">' + (i + 1) + '</sup>'; return ''; };
      var html = '<thead><tr><th class="cx-rowhead" scope="col"><span class="sr-only">Specification</span></th>';
      sel.forEach(function (c) {
        html += '<th scope="col" class="cx-col' + (c.id === self.sel ? ' is-focus' : '') + '">' +
          '<button type="button" class="cx-colhead" data-id="' + esc(c.id) + '" aria-pressed="' + (c.id === self.sel ? 'true' : 'false') + '"><b>' + esc(c.name) + '</b><span>' + esc(c.vendor) + '</span></button>' +
          '<button type="button" class="cx-jump" data-notes="' + esc(c.id) + '">Read the notes</button></th>';
      });
      html += '</tr></thead><tbody>';
      this.rows.forEach(function (row) {
        var max = 0;
        if (row.num) sel.forEach(function (c) { var v = row.num(c); if (typeof v === 'number' && v > max) max = v; });
        html += '<tr><th scope="row" class="cx-rowhead">' + esc(row.label) + '</th>';
        sel.forEach(function (c) { html += self.cellHTML(c, row, max, row.fn ? marker(c) : '', multi); });
        html += '</tr>';
      });
      tb.innerHTML = html + '</tbody>';
      tb.setAttribute('data-n', String(sel.length)); // three or four chips squeeze their columns to fit the page where it is wide enough
      this.scrollCue();
      var foot = $('#cx-foot');
      if (foot) foot.innerHTML = fns.length ? '<p class="label">How the speed figures are measured</p><ol class="cx-fns">' +
        fns.map(function (f) { return '<li><b>' + esc(f.c.name) + '</b> ' + esc(f.n) + '</li>'; }).join('') + '</ol>' : '';
    },
    renderNotes: function () {
      var self = this, host = $('#cx-notes'); if (!host) return;
      host.innerHTML = '<h3 class="label cx-h">Notes and sources</h3>' + this.selection().map(function (c) {
        var body = self.notes[c.id] || (c.notes ? '<p>' + esc(c.notes) + '</p>' : '<p class="cx-nil">No note yet.</p>');
        body = body.replace(/^\s*<p><code>[^<]*<\/code><\/p>\s*/, ''); // the notes file opens each block with the chip id, which is keying, not copy
        var srcs = (c.sources || []).map(function (s) { return '<a href="' + safeUrl(s.url) + '" target="_blank" rel="noopener">' + esc(s.label || s.url) + '</a>'; }).join('');
        return '<details class="cx-note" id="cx-note-' + esc(c.id) + '"' + (c.id === self.sel ? ' open' : '') + '>' +
          '<summary><b>' + esc(c.name) + '</b><span>' + esc(c.vendor) + ' · ' + esc(cname(c.vendorCountry)) + '</span></summary>' +
          '<div class="cx-note-body">' + body + '</div>' + (srcs ? '<p class="cx-srcs">' + srcs + '</p>' : '') + '</details>';
      }).join('');
    },
    jumpToNotes: function (id) {
      var el = document.getElementById('cx-note-' + id);
      if (!el) return;
      el.open = true;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },

    /* ---- the stage keeps drawing the focused chip's package from above ---- */
    showStage: function (c) {
      if (!c) return;
      var lay = c.layout || null, hb = (c.memory && c.memory.stacks) || 0;
      var cap = lay && lay.waferScale ? 'Wafer-scale: one ' + esc(c.name) + ' is a whole 300 mm wafer.' : esc(c.name) + ': ' + ((c.die && c.die.count) || 1) + ' logic die' + (((c.die && c.die.count) || 1) > 1 ? 's' : '') + (hb ? ' and ' + hb + ' ' + esc((c.memory && c.memory.type) || 'high-bandwidth memory') + ' stacks' : '') + ' on ' + esc((c.package && c.package.type) || 'the package') + '.';
      Stage.show('package', lay ? { layout: lay, plan: true } : { plan: true }, cap, 'AI chips · <b>' + esc(c.name) + '</b>');
    }
  };
  Landscape.initSelection();

  /* ---------------- suppliers ----------------
     Two drawings of one list. The pipeline is the chain seen from the side: the stream's thickness at a stage
     is the number of firms there, the color bands are countries in a fixed order, and the amber squares above
     the stream count the Critical firms. The ladder is the same twenty stages ranked thinnest first, every firm
     named in the open, each name opening its own panel. */
  var Suppliers = {
    rows: DATA.suppliers || [], built: false, stage: '', country: '', chk: '', q: '', sortKey: 'name', sortDir: 1,
    mode: 'ladder', stages: [], at: 0, tipAt: -1, drawW: 0, wiped: false,
    CO: ['US', 'JP', 'CN', 'TW', 'KR', 'NL', 'DE'], // the band order down the stack; every other country stacks last
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
    activate: function () {
      this.setTab(/[?&]tab=country\b/.test(location.hash || '') ? 'country' : 'stage'); // #/suppliers?tab=country opens the ribbons
      if (!this.built) this.build(); else this.fitPipe();
    },
    /* two tabs under the atlas: the ladder by stage, the ribbons by country */
    setTab: function (tab) {
      this.tab = tab;
      $$('.sup-tab').forEach(function (d) { d.hidden = d.getAttribute('data-tab') !== tab; });
      $$('.sup-tabs a').forEach(function (a) { if (a.getAttribute('data-tab') === tab) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    },
    toStage: function () { // the ribbons index the ladder, which lives on the other tab
      if (this.tab === 'stage') return;
      this.setTab('stage');
      if (/[?&]tab=country\b/.test(location.hash || '')) history.replaceState(null, '', '#/suppliers');
    },
    light: function (cc) { // the atlas's chosen country lights its ribbons; a country set in the firm filter takes over
      this.lit = this.CO.indexOf(cc) >= 0 ? cc : '';
      if (this.built) this.sync();
    },

    build: function () {
      this.built = true;
      var self = this, countries = {};
      try { var saved = localStorage.getItem('cp-sup-mode'); if (saved === 'table' || saved === 'detailed') this.mode = 'table'; } catch (e) { }
      this.groupStages();

      var sel = $('#sup-country'), other = 0;
      this.rows.forEach(function (r) { countries[r.country] = (countries[r.country] || 0) + 1; });
      Object.keys(countries).forEach(function (c) { if (self.CO.indexOf(c) < 0) other += countries[c]; });
      Object.keys(countries).sort(function (a, b) { return countries[b] - countries[a]; }).forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = cname(c) + ' (' + countries[c] + ')'; sel.appendChild(o); });
      if (other) { var oo = document.createElement('option'); oo.value = '__other'; oo.textContent = 'Other countries (' + other + ')'; sel.appendChild(oo); }
      sel.addEventListener('change', function () { self.setCountry(sel.value, false); });

      $('#sup-chk').addEventListener('change', function (e) { self.chk = e.target.value; self.render(); });
      var supTimer; $('#sup-search').addEventListener('input', function (e) { var v = e.target.value; clearTimeout(supTimer); supTimer = setTimeout(function () { self.q = v.trim().toLowerCase(); self.render(); }, 120); });
      $('#sup-copy').addEventListener('click', function () { self.copy(); });
      var allStages = $('#sup-allstages'); if (allStages) allStages.addEventListener('click', function () { self.clearStage(); });
      $('#sup-table').addEventListener('click', function (e) { var b = e.target.closest('button[data-sort]'); if (b) self.sortBy(b.getAttribute('data-sort')); });
      $('#sup-ladder').addEventListener('click', function (e) { var b = e.target.closest('.sup-name'); if (b) self.openName(b); });
      $$('.sup-mode').forEach(function (b) { b.addEventListener('click', function () { self.setMode(b.getAttribute('data-mode')); }); });

      this.buildLadder();
      this.legend();
      this.drawPipe();
      var host = $('#sup-pipe-scroll');
      host.addEventListener('scroll', function () { self.hideTip(); });
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
        var c = self.CO.indexOf(r.country) >= 0 ? r.country : 'Other';
        s.by[c] = (s.by[c] || 0) + 1;
        if (r.chokepoint === 'Critical') s.crit.push(r.name);
      });
      var order = this.ORDER.filter(function (c) { return by[c]; }); // a category the data adds later lands at the end
      Object.keys(by).sort().forEach(function (c) { if (order.indexOf(c) < 0) order.push(c); });
      this.stages = order.map(function (c, i) { var s = by[c]; s.i = i; s.short = self.SHORT[c] || c; s.id = 'sup-rung-' + i; return s; });
    },
    coName: function (c) { return c === 'Other' ? 'Other' : cname(c); },
    otherNames: function (rows) { var seen = {}; rows.forEach(function (r) { if (this.CO.indexOf(r.country) < 0) seen[cname(r.country)] = 1; }, this); return Object.keys(seen).sort(); }, // the real countries behind an Other band or ribbon

    /* ---- the pipeline: the chain drawn as a pipe that narrows where the firms run out ---- */
    fitPipe: function () {
      var host = $('#sup-pipe-scroll'); if (!host) return;
      if (Math.max(820, Math.round(host.clientWidth) || 820) !== this.drawW) this.drawPipe();
    },
    drawPipe: function () { // the ribbons: countries on the left, the twenty stages on the right, a ribbon for every pairing, its width the firms
      var self = this, host = $('#sup-pipe-scroll'); if (!host || !host.clientWidth) return; // under the other tab it has no width; it is drawn when its tab opens
      var st = this.stages, n = st.length; if (!n) return;
      var W = Math.max(820, Math.round(host.clientWidth) || 820), tight = W < 1000;
      this.drawW = W;
      var cols = this.CO.concat(['Other']), nc = cols.length;
      var total = this.rows.length || 1;
      var H = tight ? 520 : 580, padT = 16, padB = 16, inner = H - padT - padB;
      var x0 = tight ? 128 : 172, wL = 12, x1 = W - (tight ? 168 : 214), wR = 10;
      var gL = 8, gR = 4;
      var uL = (inner - gL * (nc - 1)) / total, uR = (inner - gR * (n - 1)) / total;
      var cTot = {}; cols.forEach(function (c) { cTot[c] = 0; });
      st.forEach(function (s) { cols.forEach(function (c) { cTot[c] += s.by[c] || 0; }); });
      var ly = {}, y = padT;                                             // the left nodes, in the fixed country order
      cols.forEach(function (c) { ly[c] = [y, y + cTot[c] * uL]; y += cTot[c] * uL + gL; });
      var ry = [], y2 = padT;                                            // the right nodes, in chain order
      st.forEach(function (s) { ry.push([y2, y2 + s.n * uR]); y2 += s.n * uR + gR; });
      var curL = {}, curR = []; cols.forEach(function (c) { curL[c] = ly[c][0]; }); st.forEach(function (s, i) { curR[i] = ry[i][0]; });
      var ribs = '', mx = (x0 + wL + x1) / 2;
      cols.forEach(function (c) {                                        // each country's ribbons leave in stage order; each stage's arrive in country order
        st.forEach(function (s, i) {
          var k = s.by[c] || 0; if (!k) return;
          var a0 = curL[c], a1 = a0 + k * uL, b0 = curR[i], b1 = b0 + k * uR;
          curL[c] = a1; curR[i] = b1;
          var crit = s.rows.some(function (r) { return (self.CO.indexOf(r.country) >= 0 ? r.country : 'Other') === c && r.chokepoint === 'Critical'; });
          var xa = x0 + wL;
          ribs += '<path class="sup-band sup-rib c-' + c + (crit ? ' is-crit' : '') + '" data-c="' + c + '" data-i="' + i + '" d="M' + xa + ',' + a0.toFixed(1) +
            ' C' + mx.toFixed(1) + ',' + a0.toFixed(1) + ' ' + mx.toFixed(1) + ',' + b0.toFixed(1) + ' ' + x1 + ',' + b0.toFixed(1) +
            ' L' + x1 + ',' + b1.toFixed(1) + ' C' + mx.toFixed(1) + ',' + b1.toFixed(1) + ' ' + mx.toFixed(1) + ',' + a1.toFixed(1) + ' ' + xa + ',' + a1.toFixed(1) + 'Z"></path>';
        });
      });
      var fsL = tight ? 12 : 13, fsR = tight ? 11 : 12;
      var nodesL = '', hitsL = '';
      cols.forEach(function (c) {
        var yy = ly[c], mid = (yy[0] + yy[1]) / 2;
        nodesL += '<rect class="sup-cnode c-' + c + '" data-c="' + c + '" x="' + x0 + '" y="' + yy[0].toFixed(1) + '" width="' + wL + '" height="' + Math.max(1.5, yy[1] - yy[0]).toFixed(1) + '"></rect>' +
          '<text class="sup-clab" x="' + (x0 - 10) + '" y="' + (mid + 4.5).toFixed(1) + '" font-size="' + fsL + '">' + esc(self.coName(c)) + '<tspan class="sup-cn"> ' + cTot[c] + '</tspan></text>';
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
      host.innerHTML = '<svg class="sup-pipe-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="Countries to stages: a ribbon for every country and stage pairing, its width the number of firms, amber where one is Critical">' +
        '<defs><clipPath id="sup-wipe-clip"><rect class="sup-wipe' + (this.wiped ? '' : ' is-new') + '" x="0" y="0" width="' + W + '" height="' + H + '"></rect></clipPath></defs>' +
        '<g class="sup-flow" clip-path="url(#sup-wipe-clip)">' + ribs + nodesL + nodesR + '<g class="sup-labels">' + labs + '</g><g class="sup-clabs">' + '</g></g>' +
        '<g class="sup-chits">' + hitsL + '</g><g class="sup-hits">' + hits + '</g></svg>';
      // the country labels must sit above the hit rects to stay crisp, but the hits must catch the pointer: labels go last, pointer-events off
      var svg = $('.sup-pipe-svg', host);
      var clabs = ''; cols.forEach(function (c) { var yy = ly[c], mid = (yy[0] + yy[1]) / 2; clabs += '<text class="sup-clab" x="' + (x0 - 10) + '" y="' + (mid + 4.5).toFixed(1) + '" font-size="' + fsL + '">' + esc(self.coName(c)) + '<tspan class="sup-cn"> ' + cTot[c] + '</tspan></text>'; });
      $$('.sup-clab', svg).forEach(function (t) { t.parentNode.removeChild(t); });
      svg.insertAdjacentHTML('beforeend', '<g class="sup-clabs" pointer-events="none">' + clabs + '</g>');
      this.wiped = true;
      this.x1 = x1;
      var x = function () { return x1; };                                // the keyboard scroll-into-view below asks where a stage sits
      var hot = function (sel, on) { svg.setAttribute('data-hot', on ? '1' : '0'); $$('.sup-rib', svg).forEach(function (r) { if (on && sel(r)) r.setAttribute('data-hot', '1'); else r.removeAttribute('data-hot'); }); };
      svg.addEventListener('mouseover', function (e) {
        var rib = e.target.closest ? e.target.closest('.sup-rib') : null;
        if (rib) { hot(function (r) { return r === rib; }, true); self.showRibTip(rib.getAttribute('data-c'), +rib.getAttribute('data-i'), rib); return; }
        var ch = e.target.closest ? e.target.closest('.sup-chit') : null;
        if (ch) { var c = ch.getAttribute('data-c'); hot(function (r) { return r.getAttribute('data-c') === c; }, true); self.showCountryTip(c, ch); return; }
        var h = e.target.closest ? e.target.closest('.sup-hit') : null;
        if (h) { var i = +h.getAttribute('data-i'); hot(function (r) { return +r.getAttribute('data-i') === i; }, true); self.showTip(i); }
      });
      svg.addEventListener('mouseleave', function () { hot(null, false); self.hideTip(); });
      svg.addEventListener('click', function (e) {
        var rib = e.target.closest ? e.target.closest('.sup-rib') : null;
        if (rib) { var c0 = rib.getAttribute('data-c'); self.stage = ''; self.setCountry(c0 === 'Other' ? '__other' : c0, false); self.goStage(+rib.getAttribute('data-i')); return; }
        var ch = e.target.closest ? e.target.closest('.sup-chit') : null;
        if (ch) { var c = ch.getAttribute('data-c'); self.setCountry(c === 'Other' ? '__other' : c, true); return; }
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
    roving: function () { // one tab stop for the whole pipeline; the arrow keys walk the stages
      var self = this;
      $$('.sup-hit').forEach(function (r) { r.setAttribute('tabindex', +r.getAttribute('data-i') === self.at ? '0' : '-1'); });
    },
    legend: function () {
      var self = this, h = '';
      this.CO.concat(['Other']).forEach(function (c) { h += '<span class="sup-lg"><i class="sup-sw c-' + c + '"></i>' + esc(self.coName(c)) + '</span>'; });
      $('#sup-legend').innerHTML = h + '<span class="sup-lg"><i class="sup-crit-sw"></i>holds a Critical firm</span>' +
        '<span class="sup-lg-note">Ribbon width is the number of firms a country has at a stage.</span>';
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
    showTip: function (i, focused) { // a stage: its firms by country and its Critical names
      var s = this.stages[i], el = $('#sup-tip'), hit = $('.sup-hit[data-i="' + i + '"]');
      if (!s || !el || !hit) return;
      var self = this, co = '';
      this.CO.concat(['Other']).forEach(function (c) {
        var v = s.by[c] || 0; if (!v) return;
        co += '<span class="sup-tip-c"><i class="sup-sw c-' + c + '"></i>' + esc(c) + '<b>' + v + '</b></span>';
      });
      el.innerHTML = '<b>' + esc(s.name) + '</b><span class="sup-tip-n">' + s.n + ' firms</span><span class="sup-tip-co">' + co + '</span>' +
        (s.crit.length ? '<span class="sup-tip-crit"><i class="sup-crit-sw"></i>Critical: ' + esc(s.crit.join(', ')) + '</span>' : '');
      this.tipAt(el, hit, true);
      $$('.sup-lab').forEach(function (g) { if (+g.getAttribute('data-i') === i) g.setAttribute('data-hot', '1'); else g.removeAttribute('data-hot'); });
    },
    showCountryTip: function (c, anchor) { // a country: how many firms, at which stages, and its Critical names
      var self = this, el = $('#sup-tip'); if (!el) return;
      var rows = this.rows.filter(function (r) { return (self.CO.indexOf(r.country) >= 0 ? r.country : 'Other') === c; });
      var by = {}; rows.forEach(function (r) { by[r.category] = (by[r.category] || 0) + 1; });
      var stages = this.stages.filter(function (s) { return by[s.name]; }).map(function (s) { return esc(s.short) + ' <b>' + by[s.name] + '</b>'; });
      var crit = rows.filter(function (r) { return r.chokepoint === 'Critical'; }).map(function (r) { return r.name; });
      var others = c === 'Other' ? this.otherNames(rows) : [];
      el.innerHTML = '<b>' + esc(this.coName(c)) + '</b><span class="sup-tip-n">' + rows.length + ' firms across ' + stages.length + ' stages</span>' +
        (others.length ? '<span class="sup-tip-co">' + esc(others.join(', ')) + '</span>' : '') +
        '<span class="sup-tip-co sup-tip-stages">' + stages.join(' · ') + '</span>' +
        (crit.length ? '<span class="sup-tip-crit"><i class="sup-crit-sw"></i>Critical: ' + esc(crit.join(', ')) + '</span>' : '');
      this.tipAt(el, anchor, false);
    },
    showRibTip: function (c, i, anchor) { // a ribbon: the firms of one country at one stage
      var self = this, s = this.stages[i], el = $('#sup-tip'); if (!s || !el) return;
      var rows = s.rows.filter(function (r) { return (self.CO.indexOf(r.country) >= 0 ? r.country : 'Other') === c; });
      var isOther = c === 'Other';
      var names = rows.map(function (r) { var n = (r.chokepoint === 'Critical' ? '<b>' + esc(r.name) + '</b>' : esc(r.name)); return isOther ? n + ' <small>(' + esc(cname(r.country)) + ')</small>' : n; });
      var others = isOther ? this.otherNames(rows) : [];
      el.innerHTML = '<b>' + esc(this.coName(c)) + ' → ' + esc(s.name) + '</b><span class="sup-tip-n">' + rows.length + (rows.length === 1 ? ' firm' : ' firms') + (others.length ? ' from ' + esc(others.join(', ')) : '') + (names.some(function (x) { return x.indexOf('<b>') === 0; }) ? ' · bold is Critical' : '') + '</span>' +
        '<span class="sup-tip-co sup-tip-stages">' + names.join(', ') + '</span>';
      var host = $('#sup-pipe'), m = host.getBoundingClientRect(), r = anchor.getBoundingClientRect();
      el.hidden = false;
      var left = Math.max(0, Math.min((r.left + r.right) / 2 - m.left - el.offsetWidth / 2, m.width - el.offsetWidth));
      el.style.left = Math.round(left) + 'px'; el.style.top = Math.round(Math.max(0, (r.top + r.bottom) / 2 - m.top - el.offsetHeight - 14)) + 'px';
    },
    hideTip: function () {
      var el = $('#sup-tip'); if (el) el.hidden = true;
      $$('.sup-lab[data-hot]').forEach(function (g) { g.removeAttribute('data-hot'); });
      var svg = $('.sup-pipe-svg'); if (svg) { svg.setAttribute('data-hot', '0'); $$('.sup-rib[data-hot]', svg).forEach(function (r) { r.removeAttribute('data-hot'); }); }
    },
    goStage: function (i) { // the pipeline is the ladder's index: a stage filters the list to its firms and sends you to its rung; click it again to clear
      var s = this.stages[i]; if (!s) return;
      this.hideTip();
      var off = this.stage === s.name;
      this.stage = off ? '' : s.name;
      if (this.mode !== 'ladder') this.setMode('ladder');
      $$('.sup-rung').forEach(function (el) { if (!off && el.id === s.id) el.setAttribute('data-lit', '1'); else el.removeAttribute('data-lit'); });
      $$('.sup-lab').forEach(function (g) { if (!off && +g.getAttribute('data-i') === i) g.setAttribute('data-lit', '1'); else g.removeAttribute('data-lit'); });
      this.render();
      if (off) return;
      this.toStage();
      var el = document.getElementById(s.id);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },
    clearStage: function () {
      this.stage = '';
      $$('.sup-rung[data-lit], .sup-lab[data-lit]').forEach(function (el) { el.removeAttribute('data-lit'); });
      this.render();
    },

    /* ---- filters ---- */
    setCountry: function (c, scroll) {
      this.country = (c === this.country ? '' : c) || '';
      this.sync(); this.render();
      if (scroll) { this.toStage(); var t = $('#sup-toolbar'); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
    },
    sortBy: function (k) { if (this.sortKey === k) this.sortDir = -this.sortDir; else { this.sortKey = k; this.sortDir = 1; } this.render(); },
    setMode: function (m) {
      if (m === this.mode) return;
      this.mode = m;
      try { localStorage.setItem('cp-sup-mode', m); } catch (e) { }
      this.sync(); this.render();
    },
    sync: function () { // every control, the pipeline and the ladder show the same state
      var self = this, on = this.country === '__other' ? 'Other' : this.country, lad = this.mode === 'ladder';
      var sel = $('#sup-country'); if (sel) sel.value = this.country || '';
      $$('.sup-mode').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === self.mode ? 'true' : 'false'); });
      $('#sup-ladder').hidden = !lad;
      $('#sup-ladder-h').hidden = !lad;
      $('#sup-wrap').hidden = lad;
      $$('.sup-band').forEach(function (p) { if (on && p.getAttribute('data-c') === on) p.setAttribute('data-on', '1'); else p.removeAttribute('data-on'); });
      var lit = on ? '' : (this.lit || '');
      $$('.sup-rib').forEach(function (p) { if (lit && p.getAttribute('data-c') === lit) p.setAttribute('data-lit', '1'); else p.removeAttribute('data-lit'); });
      var pipe = $('#sup-pipe'); if (pipe) { pipe.setAttribute('data-filtered', on ? '1' : '0'); pipe.setAttribute('data-lit', lit ? '1' : '0'); }
    },
    countryLabel: function () { return this.country === '__other' ? 'Other countries' : cname(this.country); },
    filtering: function () { return !!this.stage || !!(this.country || this.chk || this.q); },
    match: function (r) {
      if (this.stage && r.category !== this.stage) return false; // a stage picked on the pipeline filters the list and the export
      if (this.country === '__other') { if (this.CO.indexOf(r.country) >= 0) return false; }
      else if (this.country && r.country !== this.country) return false;
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
        (this.stage ? ' · ' + this.stage : '') + (this.country ? ' · ' + this.countryLabel() : '') + (this.chk ? ' · ' + this.chk : '');
      var allBtn = $('#sup-allstages'); if (allBtn) allBtn.hidden = !this.stage;
      if (this.mode === 'table') this.renderTable(rows); else this.applyFilter();
    },

    /* ---- the ladder: the stages ranked thinnest first, every firm named ---- */
    ladderOrder: function () { // fewest firms first, then the stage with more Critical firms, then chain order
      return this.stages.slice().sort(function (a, b) {
        return (a.n - b.n) || (b.crit.length - a.crit.length) || (a.i - b.i);
      });
    },
    buildLadder: function () {
      var self = this, html = '';
      this.ladderOrder().forEach(function (s, r) {
        var names = s.rows.slice().sort(function (a, b) {
          return (self.RANK[a.chokepoint] - self.RANK[b.chokepoint]) || String(a.name).localeCompare(String(b.name));
        }).map(function (f) {
          return '<span class="sup-nw" data-r="' + f._ix + '"><button type="button" class="sup-name lv-' + esc(f.chokepoint || 'Important') +
            '" aria-expanded="false" aria-controls="' + s.id + '-p">' + esc(f.name) + '<i class="sup-cc">' + esc(f.country) + '</i></button></span>';
        }).join('');
        html += '<section class="sup-rung" id="' + s.id + '" data-i="' + s.i + '" data-crit="' + s.crit.length + '" aria-labelledby="' + s.id + '-h">' +
          '<span class="sup-rank" aria-hidden="true">' + (r < 9 ? '0' : '') + (r + 1) + '</span>' +
          '<div class="sup-rung-head"><h3 class="sup-rung-name" id="' + s.id + '-h">' + esc(s.name) + '</h3>' +
          '<p class="sup-rung-n">' + s.n + ' firms' + (s.crit.length ? ' · ' + s.crit.length + ' critical' : '') + '</p></div>' +
          '<p class="sup-names">' + names + '</p>' +
          '<div class="sup-panel" id="' + s.id + '-p"><div class="sup-panel-in"></div></div></section>';
      });
      $('#sup-ladder').innerHTML = html;
    },
    applyFilter: function () { // the rungs never move; the filters only hide names and change the count
      var self = this, on = this.filtering();
      $$('.sup-rung').forEach(function (rung) {
        var items = $$('.sup-nw', rung), hits = 0, last = null;
        items.forEach(function (w) {
          var ok = self.match(self.rows[+w.getAttribute('data-r')]);
          w.hidden = !ok; w.classList.remove('is-last');
          if (ok) { hits++; last = w; }
        });
        if (last) last.classList.add('is-last');
        var crit = +rung.getAttribute('data-crit');
        $('.sup-rung-n', rung).textContent = on ? hits + ' of ' + items.length + ' firms' : items.length + ' firms' + (crit ? ' · ' + crit + ' critical' : '');
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
      if (r.revenueUSDb != null) {
        var v = (r.revenueUSDb >= 10 ? r.revenueUSDb.toFixed(1) : r.revenueUSDb.toFixed(2)).replace(/0+$/, '').replace(/\.$/, '');
        facts.push(['Revenue', '$' + v + 'B' + (r.revenueYear ? ' (' + esc(r.revenueYear) + ')' : '')]);
      }
      var tag = [r.subcategory, cname(r.country) + (r.city ? ', ' + r.city : ''), /^private$/i.test(r.ticker || '') ? '' : r.ticker].filter(Boolean).join(' · ');
      return '<div class="sup-detail-body">' +
        '<p class="sup-detail-h">' + esc(r.name) + (r.chokepoint ? ' <span class="chk ' + esc(r.chokepoint) + '">' + esc(r.chokepoint) + '</span>' : '') +
        (tag ? '<em>' + esc(tag) + '</em>' : '') + '</p>' +
        (r.role ? '<p class="sup-role">' + esc(r.role) + '</p>' : '') +
        (facts.length ? '<dl class="sup-facts">' + facts.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + f[1] + '</dd>'; }).join('') + '</dl>' : '') +
        (r.source ? '<a class="sup-src" href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" aria-label="Source for ' + esc(r.name) + '">Source</a>' : '') + '</div>';
    },

    /* ---- detailed table: every field, as before ---- */
    renderTable: function (rows) {
      var self = this;
      var th = function (k, label) { return '<th><button type="button" data-sort="' + k + '"' + (self.sortKey === k ? ' aria-sort="' + (self.sortDir > 0 ? 'ascending' : 'descending') + '"' : '') + '>' + label + '</button></th>'; };
      var html = '<thead><tr>' + th('name', 'Supplier') + th('category', 'Category') + th('country', 'Country') + th('founded', 'Founded') + th('chokepoint', 'Chokepoint level') + '<th>What they make</th><th>Customers</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        html += '<tr><td class="name"><b>' + esc(r.name) + '</b><span>' + esc([r.nativeName, r.ticker].filter(Boolean).join(' · ')) + '</span></td>' +
          '<td>' + esc(r.category) + (r.subcategory ? '<br><span class="cc" style="color:var(--muted)">' + esc(r.subcategory) + '</span>' : '') + '</td>' +
          '<td><span class="cc">' + esc(r.country) + '</span> ' + esc(r.city || '') + '</td>' +
          '<td class="num">' + (r.founded || '—') + '</td>' +
          '<td><span class="chk ' + esc(r.chokepoint || '') + '">' + esc(r.chokepoint || '') + '</span>' + (r.shareNote ? '<br><span class="cc" style="color:var(--muted)">' + esc(r.shareNote) + '</span>' : '') + '</td>' +
          '<td class="role">' + esc(r.role || '') + (r.source ? ' <a href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" class="cc" aria-label="Source for ' + esc(r.name) + '">source</a>' : '') + '</td>' +
          '<td style="font-size:13px;color:var(--ink-2)">' + esc((r.customers || []).join(', ')) + '</td></tr>';
      });
      $('#sup-table').innerHTML = html + '</tbody>';
    },
    copy: function () {
      var rows = this.filtered(), cols = ['name', 'nativeName', 'category', 'subcategory', 'country', 'city', 'founded', 'ticker', 'ownership', 'chokepoint', 'shareNote', 'role', 'customers', 'revenueUSDb', 'revenueYear', 'source'];
      var q = function (v) { if (v == null) return ''; if (Array.isArray(v)) v = v.join('; '); return String(v).replace(/[\t\n\r]+/g, ' '); }; // tab-separated: a spreadsheet splits it on paste
      var csv = cols.join('\t') + '\n' + rows.map(function (r) { return cols.map(function (c) { return q(r[c]); }).join('\t'); }).join('\n');
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
      { name: 'China countermeasure', label: 'China', short: 'CN', cls: 'cn' },
      { name: 'Allied control', label: 'Allied', short: 'Ally', cls: 'ally' },
      { name: 'Industrial policy', label: 'Policy', short: 'Pol', cls: 'policy' },
      { name: 'Corporate', label: 'Firms', short: 'Firm', cls: 'corp' }
    ],
    /* the license outcome a flow stands in, and the word the pill carries. Four of them are outcomes an
       exporter can act on; Policy is the off-ramp for money and tariffs, which gate nothing. */
    STATE: { open: 'No license', 'case': 'Case by case', denial: 'Presumption of denial', prohibited: 'Prohibited', policy: 'Policy' },
    /* the board's first schema had five states that did not map to outcomes: a license and a listing are
       one fact, and "shut" covered both a presumption of denial and a ban. Old data still reads. */
    OLD_STATE: { license: 'denial', shut: 'prohibited' },
    /* the instrument behind a move, in a word */
    INSTRUMENT: {
      rule: 'Rule', 'entity-listing': 'Listing', 'denial-order': 'Denial order', 'licence-policy': 'License policy',
      'licence-exception': 'Exception', enforcement: 'Enforcement', countermeasure: 'Countermeasure',
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
      return /China/i.test(c) ? 1 : /Allied/i.test(c) ? 2 : /Industrial/i.test(c) ? 3 : /Corporate/i.test(c) ? 4 : 0;
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
      chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var c = b.getAttribute('data-cat'); self.cat = self.cat === c ? null : c; $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === self.cat ? 'true' : 'false'); }); self.renderTimeline(); });
      var all = $('#tl-all'); if (all) all.addEventListener('click', function () { self.setFull(!self.full); });
      var list = $('#timeline');
      list.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('.tl-more') : null; if (b) self.setOpen(b, b.getAttribute('aria-expanded') !== 'true'); });
      // the flows; without them the page is the chronology it has always been
      this.flows = this.loadFlows();
      tl.forEach(function (e, i) { if (!e.id) e.id = 'tl' + i; });
      this.now = tl.length ? tl[tl.length - 1].date : new Date().toISOString().slice(0, 10);
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
      if (remember) this.saveMode(this.mode);
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
        html += '<li class="tl-e" id="tl-e' + i + '" data-i="' + i + '" data-date="' + esc(e.date || '') + '">' +
          '<div class="d"><b>' + ds + '</b>' + (eff ? '<span class="tl-eff">in force ' + esc(self.fmtDate(eff)) + '</span>' : '') + esc(e.actor || '') + '</div>' +
          '<div class="tl-body"><span class="cf-ev-tags"><span class="cat ' + self.CATS[self.lane(e.category)].cls + '">' + esc(e.category || '') + '</span>' +
          (inst ? '<span class="cf-inst">' + esc(inst) + '</span>' : '') + '</span>' +
          '<h4>' + esc(e.title) + '</h4><p class="tl-gist">' + esc(self.gistOf(e)) + '</p>' +
          (cite ? self.citeHTML({ fr: e.frCitation, cfr: e.cfr, url: e.source }, 'cf-ev-cite') : '') +
          '<button type="button" class="tl-more" aria-expanded="false" aria-controls="tl-p' + i + '">More</button>' +
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
      var counts = {}, order = ['prohibited', 'denial', 'case', 'policy'], parts = [], susp = 0;
      this.flows.forEach(function (f) {
        var s = self.stateAt(f, end);
        if (s.status !== 'open') counts[s.status] = (counts[s.status] || 0) + 1;
        if (s.suspendedUntil && String(s.suspendedUntil) >= String(end)) susp++;
      });
      order.forEach(function (k) { if (counts[k]) parts.push(counts[k] + ' ' + esc(String(self.STATE[k]).toLowerCase())); });
      if (susp) parts.push(susp + ' suspended');
      if (!parts.length) return '';
      return '<p class="cf-sum">' + (parseInt(y, 10) >= last ? 'Now' : 'End of ' + esc(y)) + ' · ' + parts.join(' · ') + ' · of ' + this.flows.length + ' flows</p>';
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
      $$('#timeline .tl-more').forEach(function (btn) { self.setOpen(btn, self.full); });
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
          '<span class="cf-state">' + self.pillHTML(st) + '</span>' +
          '<span class="cf-n">' + n + (n === 1 ? ' event' : ' events') + '</span>' +
          '<span class="cf-caret" aria-hidden="true"></span></h4>' +
          '<div class="cf-hist" id="cf-h-' + id + '" role="region" aria-labelledby="cf-b-' + id + '"><div class="cf-hist-in"></div></div>' +
          '</section>';
      }).join('');
      if (!reduced) host.setAttribute('data-in', '1');
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
    paintBoard: function (span) {
      var self = this, host = $('#cf-board');
      if (!host || !this.flows) return;
      $$('.cf-row', host).forEach(function (row) {
        var f = self.byId[row.getAttribute('data-f')];
        if (!f) return;
        var st = self.stateAt(f, self.asOf), key = self.keyOf(st), box = row.querySelector('.cf-state');
        if (box && key !== self.keys[f.id]) {
          box.innerHTML = self.pillHTML(st);
          var btn = row.querySelector('.cf-btn');
          if (btn) btn.setAttribute('aria-label', self.rowLabel(f, st, self.nMoves(f)));
          if (!reduced) { box.classList.remove('is-flip'); void box.offsetWidth; box.classList.add('is-flip'); }
        }
        self.keys[f.id] = key;
        if (span && !reduced && self.movedIn(f, span)) { row.classList.remove('is-changed'); void row.offsetWidth; row.classList.add('is-changed'); }
      });
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
        var m = e.target.closest ? e.target.closest('.tl-more') : null;
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
          var n = self.yearN[y] || 0;
          return '<button type="button" class="cf-year" data-y="' + y + '" aria-pressed="false" aria-label="' + y + ', ' + n + (n === 1 ? ' event' : ' events') + '">' +
            '<span class="cf-yl">' + y + '</span><span class="cf-ys">’' + String(y).slice(2) + '</span><span class="cf-yn">' + n + '</span></button>';
        }).join('') + '</div><div class="cf-head" id="cf-head" aria-hidden="true"></div></div>';
      var years = $('#cf-years'), now = $('#cf-now');
      if (now) now.addEventListener('click', function () { self.setAsOf(self.now, [self.years[self.years.length - 1] + '-01-01', self.now]); });
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
    pickYear: function (y) {
      var last = this.years[this.years.length - 1];
      this.setAsOf(y >= last ? this.now : y + '-12-31', [y + '-01-01', y + '-12-31']);
    },
    /* the one lever on the page: move the as-of date, and the board re-reads itself from it */
    setAsOf: function (date, span) {
      if (!date || !this.flows) return;
      var prev = this.asOf;
      this.asOf = date;
      var lab = $('#cf-asof'); if (lab) lab.textContent = this.fmtDate(date);
      if (!span && prev && prev !== date) span = prev < date ? [prev, date] : [date, prev];
      this.paintBoard(prev === date ? null : span);
      this.markYears(); this.placeHead();
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
      var meta = [d.p, d.d].filter(Boolean).join(' · ');
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
    init: function () {
      var self = this, term = function (e) { return e.target.closest ? e.target.closest('.gl-term') : null; };
      document.addEventListener('mouseover', function (e) { var b = term(e); if (b) self.show(b); });
      document.addEventListener('mouseout', function (e) { if (term(e)) self.later(); });
      document.addEventListener('focusin', function (e) { var b = term(e); if (b) self.show(b); else if (self.el && !self.el.contains(e.target)) self.hide(); });
      document.addEventListener('click', function (e) {
        var b = term(e);
        if (b) { if (self.btn === b && self.el && !self.el.hidden) self.hide(); else self.show(b); return; }
        if (!self.el || !self.el.contains(e.target)) self.hide();
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && self.el && !self.el.hidden) { var b = self.btn; self.hide(); if (b) b.focus(); } });
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
    build: function () { // the China revenue share sub-tab: tooltips on the charts and the table behind the toggle
      this.built = true;
      var ex = DATA.exposure || [];
      var viz = $('#exposure-viz');
      if (viz && viz.firstElementChild) { // tooltips on the exposure charts
        var tip = document.createElement('div'); tip.className = 'ex-tip'; tip.hidden = true; document.body.appendChild(tip);
        var fmtM = function (v) { return Number(v).toLocaleString('en-US') + 'm'; };
        var showTip = function (c) {
          var d = c.dataset, cur = (d.cur || '').replace(/\s*million\s*/i, '');
          var money = d.china && d.total ? ' · ' + (cur ? cur + ' ' : '') + fmtM(d.china) + ' of ' + fmtM(d.total) : '';
          tip.innerHTML = '<b>' + esc(d.firm) + ' · ' + esc(d.fy) + '</b>China was ' + esc(d.share) + '% of revenue' + money + (d.basis ? '<br>' + esc(d.basis) : '');
          tip.hidden = false;
          var r = c.getBoundingClientRect(), x = r.left + r.width / 2 + window.scrollX, y = r.top + window.scrollY;
          tip.style.left = Math.max(8, Math.min(x - tip.offsetWidth / 2, window.scrollX + window.innerWidth - tip.offsetWidth - 8)) + 'px';
          tip.style.top = (y - tip.offsetHeight - 10) + 'px';
        };
        viz.addEventListener('mouseover', function (e) { var c = e.target.closest && e.target.closest('[data-firm]'); if (c) showTip(c); });
        viz.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest('[data-firm]')) tip.hidden = true; });
        viz.addEventListener('focusin', function (e) { var c = e.target.querySelector ? e.target.querySelector('[data-firm]') : null; if (c) showTip(c); });
        viz.addEventListener('focusout', function () { tip.hidden = true; });
      }
      var et = $('#exposure-table');
      if (et && ex.length) {
        var firms = {}, years = {};
        ex.forEach(function (r) { (firms[r.firm] = firms[r.firm] || {})[r.fiscalYear] = r; years[r.fiscalYear] = 1; });
        var ys = Object.keys(years).sort();
        var meta = {}; ex.forEach(function (r) { meta[r.firm] = r; });
        var order = Object.keys(firms).sort(function (a, b) { var la = firms[a][ys[ys.length - 1]] || {}, lb = firms[b][ys[ys.length - 1]] || {}; return (lb.chinaShare || 0) - (la.chinaShare || 0); });
        et.innerHTML = '<thead><tr><th>Firm</th>' + ys.map(function (y) { return '<th>' + esc(y) + '</th>'; }).join('') + '</tr></thead><tbody>' + order.map(function (f) {
          var m = meta[f];
          var basisShort = function (b) { b = (b || '').toLowerCase(); if (!b) return ''; if (/ship-to|ship to|destination|fab\)/.test(b)) return 'counted where it ships'; if (/bill|invoice/.test(b)) return 'counted where it is billed'; if (/headquarters/.test(b)) return 'counted by headquarters'; if (/seat|licen/.test(b)) return 'counted by license seats'; if (/used|usage/.test(b)) return 'counted where it is used'; if (/own operating|operating units|own units/.test(b)) return 'counted by own units'; return 'counted by customer location'; };
          return '<tr><td title="' + esc(m.basis || '') + '">' + esc(f) + '<small>' + esc(m.category || '') + ' · ' + esc(cname(m.country)) + (m.basis ? ' · ' + esc(basisShort(m.basis)) : '') + '</small></td>' + ys.map(function (y) { var r = firms[f][y]; if (!r || r.chinaShare == null) return '<td><span class="cell zero" title="Not filed for this year" aria-label="Not filed for this year">·</span></td>'; return '<td><a class="cell" style="--v:' + Math.round(Math.min(100, r.chinaShare) * 1.6) + '" href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" aria-label="' + esc(f) + ' ' + esc(y) + ': ' + esc(String(r.chinaShare)) + ' percent from China, opens the filing" title="' + esc((r.chinaRevenue != null ? r.chinaRevenue.toLocaleString('en-US') + ' of ' + (r.totalRevenue || 0).toLocaleString('en-US') + ' ' + (r.currency || '') : '') + (r.note ? (r.chinaRevenue != null ? ' · ' : '') + r.note : '')) + '">' + r.chinaShare.toFixed(1) + '%</a></td>'; }).join('') + '</tr>';
        }).join('') + '</tbody>';
      }
    }
  };

  /* ---------------- research tools: search, permalinks, dataset export, citation ---------------- */
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
          while (p && !/^H[1-4]$/.test(p.tagName) && t.length < 900) { if (/^(P|DIV|UL|OL|TABLE)$/.test(p.tagName)) t += ' ' + p.textContent; p = p.nextElementSibling; }
          idx.push({ kind: title.replace(/^Chapter \d+: /, ''), title: h.textContent.replace(/#$/, ''), text: t.replace(/\s+/g, ' ').trim().slice(0, 900), href: '#' + h.id });
        });
      });
      (DATA.chapters || []).filter(function (c) { return c.id === 'geopolitics'; }).forEach(function () { idx.push({ kind: 'Essay', title: 'Geopolitics', text: 'Who holds each chokepoint, the export-control campaign, China\'s response, the Gulf and smuggling.', href: '#/controls' }); });
      $$('#glossary .gl-entry').forEach(function (el) { idx.push({ kind: 'Term', title: el.querySelector('dt').firstChild.textContent, text: el.querySelector('dd p').textContent, href: '#' + el.id }); });
      (DATA.suppliers || []).forEach(function (r) { idx.push({ kind: 'Supplier', title: r.name, text: r.category + ' · ' + cname(r.country) + (r.role ? ' · ' + r.role : ''), href: '#/suppliers', q: r.name }); });
      (DATA.landscape || []).forEach(function (c) { idx.push({ kind: 'Chip', title: c.vendor + ' ' + c.name, text: ((c.process || {}).node || '') + ' · ' + ((c.memory || {}).type || '') + ' · ' + (c.status || ''), href: '#/landscape', chip: c.id }); });
      (DATA.timeline || []).forEach(function (e) { idx.push({ kind: 'Event ' + e.date, title: e.title, text: e.summary || '', href: '#/controls' }); });
      (DATA.exposure || []).forEach(function (r) { if (r.chinaShare != null) idx.push({ kind: 'China revenue', title: r.firm + ' ' + r.fiscalYear, text: 'China was ' + r.chinaShare + '% of revenue' + (r.basis ? ' · ' + r.basis : ''), href: '#/exposure' }); });
      var self = this;
      idx.forEach(function (i) {
        i.hay = (i.kind + ' ' + i.title + ' ' + i.text).toLowerCase();
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
        box = document.createElement('div'); box.id = 'cp-search'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Search');
        box.innerHTML = '<div class="cp-search-panel"><input type="search" placeholder="Search chapters, terms, suppliers, chips and events…" aria-label="Search"><ol class="cp-search-results"></ol><p class="cp-search-hint">Enter opens the first result · Esc closes</p></div>';
        document.body.appendChild(box);
        var inp = $('input', box), list = $('ol', box);
        box.addEventListener('click', function (e) { if (e.target === box) self.close(); });
        box.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); self.close(); } }); // on the panel, not the input: Esc must work from a result too
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var a = list.querySelector('a'); if (a) a.click(); } });
        inp.addEventListener('input', function () {
          var q = inp.value.trim();
          if (!q) { list.innerHTML = ''; return; }
          var res = self.search(q), hits = res.hits;
          list.innerHTML = (res.note ? '<li class="none">' + esc(res.note) + '</li>' : '') +
            (hits.map(function (h, k) { return '<li><a href="' + safeUrl(h.href) + '" data-k="' + k + '"><span class="k">' + esc(h.kind) + '</span><b>' + esc(h.title) + '</b><span class="t">' + esc(h.text.slice(0, 140)) + '</span></a></li>'; }).join('') || (res.note ? '' : '<li class="none">Nothing matches.</li>'));
          list.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { var h = hits[+a.getAttribute('data-k')]; self.close(true); if (h.chip) setTimeout(function () { Landscape.select(h.chip); }, 60); if (h.q) setTimeout(function () { var s = $('#sup-search'); if (s) { s.value = h.q; s.dispatchEvent(new Event('input')); } }, 60); if (h.el) setTimeout(function () { h.el.scrollIntoView({ block: 'center' }); }, 60); }); });
        });
      }
      if (box.hidden) this.from = document.activeElement; // where the reader was, so closing can put them back
      box.hidden = false; $('input', box).value = ''; $('ol', box).innerHTML = ''; $('input', box).focus();
    },
    close: function (following) { // following a result: the destination takes focus, so leave it alone
      var box = $('#cp-search'); if (box) box.hidden = true;
      var back = this.from; this.from = null;
      if (following || !back || !back.focus || !document.contains(back)) return;
      try { back.focus({ preventScroll: true }); } catch (e) { try { back.focus(); } catch (e2) { } }
    },
    init: function () {
      var self = this;
      // search button in the masthead
      var nav = $('.tabs'), btn = document.createElement('button'); btn.type = 'button'; btn.className = 'search-btn'; btn.setAttribute('aria-label', 'Search'); btn.title = 'Search (Ctrl+K, or press /)';
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
      btn.addEventListener('click', function () { self.open(); });
      if (nav) nav.insertBefore(btn, $('.theme-toggle'));
      document.addEventListener('keydown', function (e) { var k = e.key || '', a = document.activeElement || document.body; if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'k') { e.preventDefault(); self.open(); } if (k === '/' && !/INPUT|TEXTAREA|SELECT/.test(a.tagName || '') && !a.isContentEditable) { e.preventDefault(); self.open(); } });
      // end-of-chapter flashcards: one card at a time. "Show answer" turns a card over and "Show question" turns it back;
      // marking a card moves on; Previous and Next revisit cards (Next only to cards already marked); the end lists the takeaways
      var FC = {
        parts: function (fc) { return { deck: $('.fc-deck', fc), cards: $$('.fc-card', fc), dots: $$('.fc-dots i', fc), nav: $('.fc-nav', fc), end: $('.fc-end', fc) }; },
        cur: function (p) { for (var j = 0; j < p.cards.length; j++) if (!p.cards[j].hidden) return j; return 0; },
        flip: function (card, back) { card.classList.toggle('is-flipped', back); $('.fc-front', card).inert = back; $('.fc-back', card).inert = !back; },
        go: function (fc, i, focusShow) {
          var p = FC.parts(fc);
          p.end.hidden = true; p.deck.hidden = false; p.nav.hidden = false;
          p.cards.forEach(function (c, j) { c.hidden = j !== i; FC.flip(c, false); });
          p.dots.forEach(function (d, j) { var kn = p.cards[j].getAttribute('data-known'); d.className = j === i ? 'on' : kn === '1' ? 'k' : kn === '0' ? 'm' : ''; });
          var prev = $('.fc-prev', fc), next = $('.fc-next', fc);
          prev.disabled = i === 0; next.disabled = !p.cards[i].hasAttribute('data-known');
          var a = document.activeElement;
          if (focusShow || !a || a.disabled || !fc.contains(a) || a.closest('[hidden]')) { var f = $('.fc-show', p.cards[i]); if (f) f.focus({ preventScroll: true }); }
        },
        finish: function (fc) {
          var p = FC.parts(fc), k = p.cards.filter(function (x) { return x.getAttribute('data-known') === '1'; }).length;
          p.deck.hidden = true; p.nav.hidden = true; p.end.hidden = false;
          $('.fc-big', p.end).textContent = k + '/' + p.cards.length;
          $('.fc-score-t', p.end).textContent = k === p.cards.length ? 'known.' : 'known. Dashed lines mark the ideas to review.';
          $$('.rv-keep li', p.end).forEach(function (li, j) { li.classList.toggle('miss', !!p.cards[j] && p.cards[j].getAttribute('data-known') !== '1'); });
          var rs = $('.fc-reset', p.end); if (rs) rs.focus({ preventScroll: true });
          if (window.goatcounter && window.goatcounter.count) try { window.goatcounter.count({ path: 'flashcards/' + ((fc.closest('.chapter') || {}).id || 'geopolitics') + '/' + k, title: 'Flashcards finished', event: true }); } catch (err) {}
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
          if (i + 1 < n) FC.go(fc, i + 1, true); else FC.finish(fc);
          return;
        }
        if (t.closest('.fc-prev')) { FC.step(fc, -1); return; }
        if (t.closest('.fc-next')) { FC.step(fc, 1); return; }
        if (t.closest('.fc-back-to-cards')) { FC.go(fc, FC.parts(fc).cards.length - 1, true); return; }
        if (t.closest('.fc-reset')) {
          FC.parts(fc).cards.forEach(function (c) { c.removeAttribute('data-known'); });
          FC.go(fc, 0, true);
        }
      });
      // the arrow keys step through a deck while focus is inside it
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        var fc = e.target && e.target.closest ? e.target.closest('.fc') : null;
        if (!fc || $('.fc-deck', fc).hidden) return;
        e.preventDefault(); FC.step(fc, e.key === 'ArrowLeft' ? -1 : 1);
      });
      // copy a chapter's share link (its own page, which unfurls with a card)
      document.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('.ch-copy') : null;
        if (!b) return;
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
      var addExport = function (anchorSel, name, rows, where, quiet) { // quiet: a button label; buttons only, no row count
        var get = typeof rows === 'function' ? rows : function () { return rows; }; // a function means: whatever the table currently shows
        var host = $(anchorSel); if (!host || !get() || !get().length) return;
        var bar = document.createElement('div'); bar.className = 'export-bar' + (quiet ? ' export-bar--quiet' : '');
        bar.innerHTML = (quiet ? '' : '<span class="count">' + get().length + ' rows · ' + esc(name) + '</span>') + '<button type="button" class="btn ghost">' + esc(quiet || 'Copy table') + '</button><button type="button" class="btn ghost">Copy as JSON</button>';
        var b = bar.querySelectorAll('button'), countEl = bar.querySelector('.count');
        host.addEventListener('cp:rows', function () { if (countEl) countEl.textContent = get().length + ' rows · ' + name; });
        b[0].addEventListener('click', function () { copy(toCSV(get()), b[0], quiet || 'Copy table'); });
        b[1].addEventListener('click', function () { copy(JSON.stringify(get(), null, 1), b[1], 'Copy as JSON'); });
        if (where === 'after') host.insertAdjacentElement('afterend', bar); else host.insertAdjacentElement('beforebegin', bar);
      };
      addExport('#cx-table-wrap', 'chips compared', Landscape.exportRows, 'before'); // a live array: Landscape keeps it in step with the selection
      addExport('#matrix', 'country-share matrix', DATA.matrix, 'before');
      addExport('#cf', 'chokepoint board', function () { return Geo.boardRows ? Geo.boardRows() : []; }, 'before', 'Copy board'); // visible in both modes
      addExport('#timeline', 'export-control timeline', function () { return Geo.visible || DATA.timeline; }, 'before', 'Copy timeline');
      addExport('#exposure-table', 'China revenue share by firm and year', DATA.exposure, 'before');
      // the line above the board that takes a reader down to the chronology
      document.addEventListener('click', function (e) { var j = e.target.closest ? e.target.closest('.cf-jump-btn') : null; if (!j) return; var t = $('#timeline'); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); });
      // cite-this block in the footer
      var d0 = new Date().toISOString().slice(0, 10), canon = (document.querySelector('link[rel=canonical]') || {}).href || (location.origin + location.pathname);
      $$('.site-footer').forEach(function (foot) { var d = d0; foot.insertAdjacentHTML('beforeend', '<details class="cite"><summary>How to cite</summary><pre>Sharma, Y. with Claude. Chip Supply Chain: how AI chips are made, stage by stage. September 2026. ' + canon + ' (accessed ' + d + ').</pre><pre>@misc{chipsupplychain2026,\n  title  = {Chip Supply Chain: how AI chips are made, stage by stage},\n  author = {Sharma, Yashvardhan and Claude},\n  year   = {2026},\n  month  = {September},\n  url    = {' + canon + '},\n  note   = {Accessed ' + d + '}\n}</pre></details>'); });
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
        var poster = function () { v.poster = src() + (reduced && !v.getAttribute('src') ? '-end.jpg' : '-start.jpg'); };
        var load = function () { if (!v.getAttribute('src')) { v.preload = 'auto'; v.src = src() + '.mp4'; v.load(); } };
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
            load(); show(j);
            var go = function () { try { v.currentTime = t0s[j] + 0.05; } catch (e) { } };
            if (v.readyState >= 1) go(); else v.addEventListener('loadedmetadata', go, { once: true });
            if (!still(fig) && fig._seen) v.play().catch(function () { });
          });
        });
        poster();
        if (reduced) { stage.setAttribute('aria-label', 'Play the animation'); fig.classList.add('is-paused'); }
      });
      // theme: swap to the matching video, keeping the place
      new MutationObserver(function () {
        figs.forEach(function (fig) {
          var v = fig._v, base = v.getAttribute('data-src') + '-' + theme();
          if (!v.getAttribute('src')) { v.poster = base + (reduced ? '-end.jpg' : '-start.jpg'); return; }
          var t = v.currentTime, playing = !v.paused;
          v.poster = base + '-start.jpg'; v.preload = 'auto'; v.src = base + '.mp4';
          v.addEventListener('loadedmetadata', function () { try { v.currentTime = t; } catch (e) { } }, { once: true });
          if (playing) v.play().catch(function () { }); else v.load();
        });
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      // play only while on screen, and never on its own when the reader asked for reduced motion
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var fig = en.target, v = fig._v;
          fig._seen = en.isIntersecting;
          if (en.isIntersecting && !still(fig)) { if (!v.getAttribute('src')) v.src = v.getAttribute('data-src') + '-' + theme() + '.mp4'; v.play().catch(function () { }); }
          else if (!v.paused) v.pause();
        });
      }, { threshold: 0.45 });
      figs.forEach(function (f) { io.observe(f); });
      // a reader's own print shows the last frame, so fetch those stills before the page is laid out
      window.addEventListener('beforeprint', function () { $$('.anim-print').forEach(function (img) { img.loading = 'eager'; }); });
    }
  };

  window.CP = { Stage: Stage, Router: Router, Sections: Sections, Tools: Tools, Band: Band, DATA: DATA, $: $, $$: $$, esc: esc, narrow: narrow, safeUrl: safeUrl, cname: cname, reduced: reduced,
    Landscape: Landscape, Suppliers: Suppliers, register: function (view, def) { MODULE_VIEWS[view] = def; if (Router.current === view && def.activate) def.activate(); } };
  function boot() {
    // QA aid: ?only=<chapter-id> shows just that chapter at the top of the page (screenshots in a hidden pane only paint the first frame)
    try { var only = new URLSearchParams(location.search).get('only'); if (only && document.getElementById(only)) { document.documentElement.classList.add('dbg-only'); document.getElementById(only).classList.add('only'); } } catch (e) { }
    Theme.init();
    Tip.init(); Cite.init();
    var printBtn = $('#print-page'); if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
    (function () { // the phone tab strip fades at its right edge while there is more to scroll
      var tabs = $('.tabs'); if (!tabs) return;
      var edge = function () { tabs.setAttribute('data-end', tabs.scrollLeft + tabs.clientWidth >= tabs.scrollWidth - 2 ? '1' : '0'); };
      tabs.addEventListener('scroll', edge, { passive: true }); window.addEventListener('resize', edge); edge();
    })();
    Tools.init();
    var setMast = function () { var m = $('.masthead'), root = document.documentElement; if (!m) return; root.style.removeProperty('--masthead'); root.style.setProperty('--masthead', m.offsetHeight + 'px'); }; // the masthead wraps on phones, so the sticky offsets follow its real height
    setMast(); window.addEventListener('resize', setMast); window.addEventListener('load', setMast);
    Stage.init();
    Band.init();
    Router.init();
    Sections.init();
    Anim.init();
    // warm the cache for the next chapters while idle
    var names = $$('[data-view="stack"] [data-specimen]').map(function (el) { return el.getAttribute('data-specimen'); });
    var i = 0;
    var idle = window.requestIdleCallback ? function (f, ms) { requestIdleCallback(f, { timeout: ms * 3 }); } : function (f, ms) { setTimeout(f, ms); };
    var warm = function () { if (i >= names.length) return; try { Stage.build(names[i++], null); } catch (e) { } idle(warm, 250); };
    idle(warm, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
