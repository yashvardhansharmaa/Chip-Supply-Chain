/* COMPUTE CHOKEPOINTS runtime: theme, router, WebGL specimen stage, section tracking, landscape / suppliers / geopolitics views. */
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
  var COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', TW: 'Taiwan', KR: 'South Korea', CN: 'China', DE: 'Germany', CH: 'Switzerland', GB: 'United Kingdom', FR: 'France', IL: 'Israel', SG: 'Singapore', MY: 'Malaysia', AT: 'Austria', IT: 'Italy', BE: 'Belgium', IN: 'India', AE: 'United Arab Emirates', SA: 'Saudi Arabia', CA: 'Canada', SE: 'Sweden', FI: 'Finland', IE: 'Ireland', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', MX: 'Mexico', 'EU-other': 'Other Europe', Other: 'Other' };
  var cname = function (c) { return COUNTRY[c] || c; };

  /* ---------------- theme ---------------- */
  var Theme = {
    current: function () {
      var s = document.documentElement.getAttribute('data-theme');
      if (s) return s;
      return (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
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
      if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { self.sync(); });
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
    spin: 0, scrollAngle: 0, lastT: 0, ink: [0.07, 0.09, 0.1], accent: [0.79, 0.54, 0.07], dpr: 1, w: 0, h: 0, hidden: false, active: true,
    init: function () {
      this.canvas = $('#stage-canvas');
      this.fig = $('.stage');
      if (!this.canvas || !this.fig) return;
      var gl = this.canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' }) ||
               this.canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
      if (!gl || !window.PC) { this.fig.setAttribute('data-hidden', '1'); return; }
      this.gl = gl;
      var vs = 'attribute vec4 aP;uniform mat4 uMVP;uniform float uSize;uniform float uOp;uniform vec3 uInk;uniform vec3 uAcc;varying vec4 vC;' +
        'void main(){vec4 p=uMVP*vec4(aP.xyz,1.0);gl_Position=p;float w=aP.w;vec3 c;float a;' +
        'if(w>=2.0){c=uAcc;a=clamp(w-2.0,0.0,1.0);}else{c=uInk;a=clamp(w,0.0,1.0);}' +
        'float j=fract(sin(dot(aP.xyz,vec3(12.9898,78.233,37.719)))*43758.5453);' + // per-point size jitter: hand-stippled, not screen-toned
        'float depth=clamp((p.w-2.4)/3.2,0.0,1.0);' + // far points fade a little, which reads as depth
        'gl_PointSize=(uSize*(0.72+0.56*j))/max(p.w,0.5);vC=vec4(c,a*uOp*mix(1.0,0.62,depth));}';
      var fs = 'precision mediump float;varying vec4 vC;void main(){vec2 d=gl_PointCoord-0.5;float r=dot(d,d);if(r>0.25)discard;float a=vC.a*smoothstep(0.25,0.10,r);gl_FragColor=vec4(vC.rgb*a,a);}';
      var prog = gl.createProgram();
      var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      try { gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); }
      catch (e) { this.fig.setAttribute('data-hidden', '1'); return; }
      gl.useProgram(prog);
      this.loc = { aP: gl.getAttribLocation(prog, 'aP'), uMVP: gl.getUniformLocation(prog, 'uMVP'), uSize: gl.getUniformLocation(prog, 'uSize'), uOp: gl.getUniformLocation(prog, 'uOp'), uInk: gl.getUniformLocation(prog, 'uInk'), uAcc: gl.getUniformLocation(prog, 'uAcc') };
      gl.enableVertexAttribArray(this.loc.aP);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
      PC.density = narrow() ? 0.55 : (window.devicePixelRatio > 1.5 ? 0.85 : 1);
      this.ok = true;
      this.refreshColors();
      var self = this;
      window.addEventListener('resize', function () { self.resize(); });
      if (window.ResizeObserver) new ResizeObserver(function () { self.resize(); }).observe(this.canvas); // the caption below the canvas changes height per specimen
      document.addEventListener('visibilitychange', function () { self.hidden = document.hidden; });
      this.resize();
      requestAnimationFrame(function (t) { self.loop(t); });
    },
    refreshColors: function () {
      var cs = getComputedStyle(document.documentElement);
      var p = function (v, d) { var m = (cs.getPropertyValue(v) || '').split(','); if (m.length < 3) return d; return [parseFloat(m[0]) / 255, parseFloat(m[1]) / 255, parseFloat(m[2]) / 255]; };
      this.ink = p('--stage-ink', this.ink); this.accent = p('--stage-accent', this.accent);
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
      var slot = { key: key, vbo: vbo, n: PC.count(spec.cloud), spin: spec.spin, tilt: spec.tilt, turntable: !!spec.turntable, caption: spec.caption, spinBase: 0 };
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
      this.scrollAngle = 0;
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
      var MVP = mul(P, mul(V, M));
      gl.uniformMatrix4fv(this.loc.uMVP, false, new Float32Array(MVP));
      var size = 6.6 * this.dpr * Math.min(1.05, Math.max(0.6, this.h / (900 * this.dpr))) * Math.max(1, 0.98 / aspect);
      gl.uniform1f(this.loc.uSize, size);
      gl.uniform1f(this.loc.uOp, op);
      gl.uniform3fv(this.loc.uInk, this.ink); gl.uniform3fv(this.loc.uAcc, this.accent);
      gl.bindBuffer(gl.ARRAY_BUFFER, slot.vbo);
      gl.vertexAttribPointer(this.loc.aP, 4, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, slot.n);
    },
    loop: function (t) {
      var self = this;
      requestAnimationFrame(function (tt) { self.loop(tt); });
      if (!this.ok || this.hidden || !this.active) { this.lastT = t; return; }
      var dt = Math.min(0.05, (t - this.lastT) / 1000 || 0); this.lastT = t;
      var gl = this.gl;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (!this.cur) return;
      if (!reduced) this.spin += (this.cur.spin || 0.1) * dt;
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
  var VIEWS = ['home', 'stack', 'chain', 'intro', 'walk', 'briefing', 'landscape', 'suppliers', 'geopolitics', 'controls', 'thresholds', 'exposure', 'glossary', 'sources']; // retired routes (methods, summary-a, summary-b) are unknown and go home
  var ALIAS = { chain: 'stack', intro: 'walk', briefing: 'walk', geopolitics: 'stack' };
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
      var v = (bare === '' || bare === '/' || m) ? 'home' : 'stack'; // the site opens on the map; an unknown #/route goes home; a bare chapter anchor opens the chain
      if (m && VIEWS.indexOf(m[1]) >= 0) v = m[1];
      var anchor = v === 'geopolitics' ? 'geopolitics' : ((!m && bare && bare !== '/') ? dec(bare) : null);
      if (anchor && !m) { // a bare anchor belongs to whichever view holds it; one that sits outside them all (the skip link's #app) leaves the view alone
        var target = document.getElementById(anchor), host = target && target.closest ? target.closest('.view[data-view]') : null;
        if (host) v = host.getAttribute('data-view');
        else if (target) v = this.current || v;
      }
      if (ALIAS[v]) v = ALIAS[v];
      var sub = null; // the Export Controls page has three sections
      if (v === 'exposure') { v = 'controls'; sub = 'exposure'; } else if (v === 'thresholds') { v = 'controls'; sub = 'thresholds'; } else if (v === 'controls') sub = 'timeline';
      var changed = v !== this.current || sub !== this.currentSub;
      this.current = v; this.currentSub = sub;
      if (sub) {
        $$('.view[data-view="controls"] .sub').forEach(function (s) { s.hidden = s.getAttribute('data-sub') !== sub; });
        $$('#controls-subtabs a').forEach(function (a) { if (a.getAttribute('data-sub') === sub) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }
      $$('.view').forEach(function (s) { s.hidden = s.getAttribute('data-view') !== v; });
      $$('.tabs a').forEach(function (a) { var dv = a.getAttribute('data-view'); var on = dv === v; if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
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
      var label = { stack: 'The Chain', walk: 'Intro', landscape: 'AI Chips', suppliers: 'Suppliers', controls: sub === 'exposure' ? 'China revenue share' : sub === 'thresholds' ? 'Licence thresholds' : 'Export Controls', glossary: 'Glossary', sources: 'Sources' }[v];
      document.title = (v === 'home' || !label) ? 'Compute Chokepoints' : 'Compute Chokepoints · ' + label;
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
      this.update();
    },
    update: function () {
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
      var contents = $('#contents'), rail = $('.rail'), top = $('.to-top');
      var past = contents ? contents.getBoundingClientRect().bottom < 0 : window.scrollY > vh;
      if (rail) rail.setAttribute('data-show', past ? '1' : '0');
      if (top) top.setAttribute('data-show', past ? '1' : '0');
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
    initSelection: function () { // the page opens in comparison mode on the two best-documented parts
      var self = this;
      ['nvidia-b200', 'amd-mi355x'].forEach(function (id) { if (self.byId(id)) self.picked.push(id); });
      for (var i = 0; this.picked.length < 2 && i < this.chips.length; i++) if (this.picked.indexOf(this.chips[i].id) < 0) this.picked.push(this.chips[i].id);
      this.sel = this.picked[0] || null;
      this.syncExport();
    },
    syncExport: function () { // Tools' copy buttons read this array at click time
      var rows = this.selection();
      this.exportRows.length = 0;
      for (var i = 0; i < rows.length; i++) this.exportRows.push(rows[i]);
      var wrap = $('#cx-table-wrap'), bar = wrap && wrap.previousElementSibling;
      if (bar && bar.classList && bar.classList.contains('export-bar')) {
        var n = bar.querySelector('.count');
        if (n) n.textContent = rows.length + (rows.length === 1 ? ' row' : ' rows') + ' · the chips you picked';
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
      var self = this, pk = $('#picker'), html = '', last = null;
      this.chips.forEach(function (c) {
        if (c.vendorCountry !== last) { html += '<div class="group">' + esc(cname(c.vendorCountry)) + '</div>'; last = c.vendorCountry; }
        html += '<button type="button" data-id="' + esc(c.id) + '" aria-pressed="false"><b>' + esc(c.name) + '</b><span>' + esc(c.vendor) + (c.family && c.family !== c.name ? ' · ' + esc(c.family) : '') + '</span></button>';
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
        clearTimeout(rt); rt = setTimeout(function () { self.renderPlans(); }, 160);
      });
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
        if (this.picked.length >= this.max) { this.say('Four is the limit. Click a selected chip to remove it.'); return; }
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
      Stage.show('package', { plan: true }, 'An AI accelerator package, drawn from above. Pick a chip to see its own layout.', 'AI chips · <b>pick a chip</b>');
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
      el.innerHTML = this.picked.length ? '<b>' + this.picked.length + '</b> of ' + this.max + ' chips selected' + (this.hint ? ' · <i>' + esc(this.hint) + '</i>' : '') : 'No chip selected. Pick one to see its specs, or two to four to compare them.';
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
      }).join('') || '<p class="cx-nil">No chip selected.</p>';
      var key = $('#cx-key');
      if (key) key.innerHTML = '<span><i class="cx-sw die"></i>logic die</span><span><i class="cx-sw hbm"></i>memory stack</span><span><i class="cx-sw int"></i>interposer</span><span><i class="cx-sw sub"></i>substrate</span>' + this.scaleKey(k);
    },

    /* ---- the side-by-side table ---- */
    nf: function (v) { return (Math.round(v * 100) / 100).toLocaleString('en-US'); },
    nil: function () { return '<span class="cx-nil">not published</span>'; },
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
      { label: 'Speed at FP16, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.compute || {}).fp16TFLOPS; }, better: 'high', fn: true },
      { label: 'Speed at FP8, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.compute || {}).fp8TFLOPS; }, better: 'high', fn: true },
      { label: 'Speed at FP4, TFLOPS', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return (c.compute || {}).fp4TFLOPS; }, better: 'high', fn: true },
      { label: 'Power, watts', hint: ['spec table', 'datasheet', 'product page'], num: function (c) { return c.tdpW; } },
      { label: 'Chip-to-chip links', hint: ['architecture', 'deep dive', 'white paper'], long: true, text: function (c) { return (c.interconnect || {}).chipToChip ? esc(c.interconnect.chipToChip) : null; } },
      { label: 'Scale-up, in one rack', hint: ['nvl', 'rack', 'system', 'deep dive', 'spec table'], long: true, text: function (c) { return (c.interconnect || {}).scaleUp ? esc(c.interconnect.scaleUp) : null; } },
      { label: 'Price estimate', hint: ['semianalysis', 'price', 'rack', 'press release'], long: true, text: function (c) { return c.priceEstimate ? esc(c.priceEstimate) : null; } },
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
        if (v == null) inner = this.nil();
        else {
          var best = row.better === 'high' && max > 0 && v === max;
          inner = '<span class="cx-v' + (best ? ' is-best' : '') + '">' + esc(this.nf(v)) + '</span>' + (marker || '') +
            (row.sub ? '<span class="cx-2">' + esc(row.sub(c)) + '</span>' : '') +
            (multi && max > 0 ? '<span class="cx-meter"><i style="width:' + Math.round(Math.max(0, v) / max * 100) + '%"></i></span>' : '');
        }
      } else {
        var t = row.text(c);
        inner = (t == null || t === '') ? this.nil() : t + (marker || '');
      }
      return '<td class="' + (row.long ? 'cx-long' : '') + (c.id === this.sel ? ' is-focus' : '') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + inner + '</td>';
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

  /* ---------------- suppliers ---------------- */
  var Suppliers = {
    rows: DATA.suppliers || [], built: false, cat: null, country: '', chk: '', q: '', sortKey: 'name', sortDir: 1,
    mode: 'compact', shown: [], cells: {},
    MAIN: ['US', 'JP', 'CN', 'TW', 'KR', 'DE', 'NL', 'GB'], // the eight columns of the matrix; everything else falls into Other
    LEVELS: ['Critical', 'Important', 'Contested', 'Diversified'],
    RANK: { Critical: 0, Important: 1, Contested: 2, Diversified: 3 },
    ORDER: ['Design & EDA', 'IP & Architecture', 'Silicon & Wafers', 'Photomasks', 'Lithography', 'Deposition & Etch', 'Photoresist & Materials', 'Chemicals & Gases', 'Optics & Photonics', 'Equipment Subsystems & Components', 'Metrology & Inspection', 'Foundry', 'Memory', 'Advanced Packaging & OSAT', 'Test', 'Substrates & PCBs', 'Interconnect & Networking', 'Power & Cooling', 'Systems & Servers', 'AI Accelerator Vendor'], // chain order, design first
    activate: function () { if (!this.built) this.build(); },

    build: function () {
      this.built = true;
      var self = this, cats = {}, countries = {};
      try { var saved = localStorage.getItem('cp-sup-mode'); if (saved === 'compact' || saved === 'detailed') this.mode = saved; } catch (e) { }
      this.rows.forEach(function (r) { cats[r.category] = (cats[r.category] || 0) + 1; countries[r.country] = (countries[r.country] || 0) + 1; });
      var order = this.ORDER.filter(function (c) { return cats[c]; }); // a category the data adds later lands at the end
      Object.keys(cats).sort().forEach(function (c) { if (order.indexOf(c) < 0) order.push(c); });
      this.order = order;

      var chips = $('#sup-chips');
      chips.innerHTML = order.map(function (c) { return '<button type="button" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + '<b>' + cats[c] + '</b></button>'; }).join('');
      chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var c = b.getAttribute('data-cat'); self.setFilters(self.cat === c ? null : c, self.country, false); });
      var csel = $('#sup-cat'); // phones get a select instead of twenty chips
      order.forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = c + ' (' + cats[c] + ')'; csel.appendChild(o); });
      csel.addEventListener('change', function () { self.setFilters(csel.value || null, self.country, false); });

      var sel = $('#sup-country'), other = 0;
      Object.keys(countries).forEach(function (c) { if (self.MAIN.indexOf(c) < 0) other += countries[c]; });
      Object.keys(countries).sort(function (a, b) { return countries[b] - countries[a]; }).forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = cname(c) + ' (' + countries[c] + ')'; sel.appendChild(o); });
      if (other) { var oo = document.createElement('option'); oo.value = '__other'; oo.textContent = 'Every other country (' + other + ')'; sel.appendChild(oo); }
      sel.addEventListener('change', function () { self.setFilters(self.cat, sel.value, false); });

      $('#sup-chk').addEventListener('change', function (e) { self.chk = e.target.value; self.render(); });
      var supTimer; $('#sup-search').addEventListener('input', function (e) { var v = e.target.value; clearTimeout(supTimer); supTimer = setTimeout(function () { self.q = v.trim().toLowerCase(); self.render(); }, 120); });
      $('#sup-copy').addEventListener('click', function () { self.copy(); });
      $('#sup-table').addEventListener('click', function (e) { var b = e.target.closest('button[data-sort]'); if (b) self.sortBy(b.getAttribute('data-sort')); });
      $('#sup-list').addEventListener('click', function (e) {
        var s = e.target.closest('button[data-sort]'); if (s) { self.sortBy(s.getAttribute('data-sort')); return; }
        var h = e.target.closest('.sup-head'); if (h) self.toggleRow(h);
      });
      $$('.sup-mode').forEach(function (b) { b.addEventListener('click', function () { self.setMode(b.getAttribute('data-mode')); }); });

      this.buildMap();
      this.sync();
      this.render();
    },

    /* ---- the dot matrix: stages down, countries across ---- */
    buildMap: function () {
      var self = this, host = $('#sup-map-scroll'); if (!host) return;
      var cols = this.MAIN.concat(['Other']), cells = {}, rowTot = {}, colTot = {}, max = 0;
      this.rows.forEach(function (r) {
        var c = self.MAIN.indexOf(r.country) >= 0 ? r.country : 'Other', k = r.category + '|' + c;
        var e = cells[k] || (cells[k] = { n: 0, lv: 3, names: [] });
        e.n++; e.names.push(r.name);
        var rk = self.RANK[r.chokepoint]; if (rk != null && rk < e.lv) e.lv = rk;
        rowTot[r.category] = (rowTot[r.category] || 0) + 1; colTot[c] = (colTot[c] || 0) + 1;
        if (e.n > max) max = e.n;
      });
      this.cells = cells;
      var dia = function (n) { return Math.max(5, Math.round(20 * Math.sqrt(n / max) * 10) / 10); }; // area, not width, carries the count
      var label = function (c) { return c === 'Other' ? 'every other country' : cname(c); };

      var h = '<table class="sup-grid"><thead><tr><th class="sup-gcorner"><span class="sr-only">Stage</span></th>';
      cols.forEach(function (c) { h += '<th scope="col"' + (c === 'Other' ? ' class="sup-gother"' : '') + ' title="' + esc(label(c)) + '">' + esc(c) + '</th>'; });
      h += '<th scope="col" class="sup-gall" title="All countries">All</th></tr></thead><tbody>';
      this.order.forEach(function (cat, i) {
        h += '<tr style="--i:' + i + '"><th scope="row" title="' + esc(cat) + '">' + esc(cat) + '</th>';
        cols.forEach(function (c) {
          var e = cells[cat + '|' + c];
          if (!e) { h += '<td class="sup-td"><span class="sup-nil" aria-hidden="true"></span></td>'; return; }
          var lv = self.LEVELS[e.lv];
          h += '<td class="sup-td"><button type="button" class="sup-cell" data-cat="' + esc(cat) + '" data-cc="' + esc(c) + '" aria-label="' + esc(cat + ', ' + label(c) + ': ' + e.n + ' supplier' + (e.n === 1 ? '' : 's') + ', most severe ' + lv) + '"><i class="sup-dot lv-' + lv + '" style="--s:' + dia(e.n) + 'px"></i></button></td>';
        });
        h += '<td class="sup-gn">' + (rowTot[cat] || 0) + '</td></tr>';
      });
      h += '</tbody><tfoot><tr><th scope="row">All</th>';
      cols.forEach(function (c) { h += '<td class="sup-gn">' + (colTot[c] || 0) + '</td>'; });
      h += '<td class="sup-gn">' + this.rows.length + '</td></tr></tfoot></table>';
      host.innerHTML = h;

      var sw = function (lv) { return '<span class="sup-lg"><i class="sup-dot lv-' + lv + '" style="--s:9px"></i>' + lv + '</span>'; };
      $('#sup-legend').innerHTML = 'Bigger dot, more firms. Fill is the most severe level in the cell: ' +
        sw('Critical') + sw('Important') + sw('Contested') + sw('Diversified') +
        '<span class="sup-lg-note">· Click a dot to filter the list, and again to clear.</span>';

      host.addEventListener('click', function (e) { var b = e.target.closest('.sup-cell'); if (b) self.pickCell(b); });
      host.addEventListener('mouseover', function (e) { var b = e.target.closest('.sup-cell'); if (b) self.showTip(b); });
      host.addEventListener('mouseout', function (e) { var b = e.target.closest('.sup-cell'); if (b && !b.contains(e.relatedTarget)) self.hideTip(); });
      host.addEventListener('focusin', function (e) { var b = e.target.closest('.sup-cell'); if (b) self.showTip(b); });
      host.addEventListener('focusout', function () { self.hideTip(); });
      var edge = function () { host.setAttribute('data-end', host.scrollLeft + host.clientWidth >= host.scrollWidth - 2 ? '1' : '0'); }; // a faded right edge says the matrix keeps going
      host.addEventListener('scroll', function () { self.hideTip(); edge(); });
      window.addEventListener('resize', edge);
      edge();
    },
    showTip: function (btn) {
      var e = this.cells[btn.getAttribute('data-cat') + '|' + btn.getAttribute('data-cc')], el = $('#sup-tip'), map = $('#sup-map');
      if (!e || !el || !map) return;
      var cc = btn.getAttribute('data-cc');
      el.innerHTML = '<b>' + esc(btn.getAttribute('data-cat')) + ' · ' + esc(cc === 'Other' ? 'Other countries' : cname(cc)) + '</b>' +
        e.names.slice(0, 6).map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') +
        (e.names.length > 6 ? '<span class="sup-tip-more">+' + (e.names.length - 6) + ' more</span>' : '');
      el.hidden = false;
      var r = btn.getBoundingClientRect(), m = map.getBoundingClientRect(), w = el.offsetWidth, hh = el.offsetHeight;
      var left = Math.max(0, Math.min(r.left - m.left + r.width / 2 - w / 2, m.width - w));
      var top = r.top - m.top - hh - 8;
      if (top < 0) top = r.bottom - m.top + 8;
      el.style.left = left + 'px'; el.style.top = top + 'px';
    },
    hideTip: function () { var el = $('#sup-tip'); if (el) el.hidden = true; },
    pickCell: function (btn) {
      var cat = btn.getAttribute('data-cat'), cc = btn.getAttribute('data-cc');
      var want = cc === 'Other' ? '__other' : cc, same = this.cat === cat && this.country === want;
      this.setFilters(same ? null : cat, same ? '' : want, !same);
    },

    /* ---- filters ---- */
    setFilters: function (cat, country, scroll) {
      this.cat = cat || null; this.country = country || '';
      this.sync(); this.render();
      if (scroll) { var t = $('#sup-toolbar'); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
    },
    sortBy: function (k) { if (this.sortKey === k) this.sortDir = -this.sortDir; else { this.sortKey = k; this.sortDir = 1; } this.render(); },
    setMode: function (m) {
      if (m === this.mode) return;
      this.mode = m;
      try { localStorage.setItem('cp-sup-mode', m); } catch (e) { }
      this.sync(); this.render();
    },
    sync: function () { // every control and the matrix show the same state
      var self = this, on = this.country === '__other' ? 'Other' : this.country;
      $$('#sup-chips button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === self.cat ? 'true' : 'false'); });
      var csel = $('#sup-cat'); if (csel) csel.value = this.cat || '';
      var sel = $('#sup-country'); if (sel) sel.value = this.country || '';
      $$('.sup-mode').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === self.mode ? 'true' : 'false'); });
      $('#sup-list').hidden = this.mode !== 'compact';
      $('#sup-wrap').hidden = this.mode !== 'detailed';
      $$('.sup-cell').forEach(function (b) {
        if (self.cat && b.getAttribute('data-cat') === self.cat && b.getAttribute('data-cc') === on) b.setAttribute('data-on', '1');
        else b.removeAttribute('data-on');
      });
    },
    countryLabel: function () { return this.country === '__other' ? 'Other countries' : cname(this.country); },
    filtered: function () {
      var self = this, CHK = this.RANK;
      var out = this.rows.filter(function (r) {
        if (self.cat && r.category !== self.cat) return false;
        if (self.country === '__other') { if (self.MAIN.indexOf(r.country) >= 0) return false; }
        else if (self.country && r.country !== self.country) return false;
        if (self.chk && r.chokepoint !== self.chk) return false;
        if (self.q) { var hay = [r.name, r.nativeName, r.city, r.ticker, r.role, r.subcategory, (r.customers || []).join(' '), cname(r.country)].join(' ').toLowerCase(); if (hay.indexOf(self.q) < 0) return false; }
        return true;
      });
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
      this.shown = rows;
      $('#sup-count').textContent = 'Showing ' + rows.length + ' of ' + this.rows.length + ' suppliers' +
        (this.cat ? ' · ' + this.cat : '') + (this.country ? ' · ' + this.countryLabel() : '') + (this.chk ? ' · ' + this.chk : '');
      if (this.mode === 'compact') this.renderList(rows); else this.renderTable(rows);
    },

    /* ---- compact list: one line a firm, opening in place ---- */
    renderList: function (rows) {
      var self = this;
      var sortBtn = function (k, label, cls) {
        return '<button type="button" class="' + cls + '" data-sort="' + k + '"' + (self.sortKey === k ? ' aria-sort="' + (self.sortDir > 0 ? 'ascending' : 'descending') + '"' : '') + '>' + label + '</button>';
      };
      var html = '<div class="sup-hrow"><span class="sup-hlab">Sort</span>' + sortBtn('name', 'Supplier', 'c1') +
        '<span class="c2">What they make</span>' + sortBtn('country', 'Country', 'c3') + sortBtn('founded', 'Founded', 'c4') +
        sortBtn('chokepoint', 'Level', 'c5') + '<span class="c6"></span></div>';
      rows.forEach(function (r, i) {
        var tag = [r.nativeName, /^private$/i.test(r.ticker || '') ? '' : r.ticker].filter(Boolean).join(' · '), id = 'sup-d-' + i;
        html += '<div class="sup-row" data-i="' + i + '" style="--i:' + Math.min(i, 40) + '">' +
          '<button type="button" class="sup-head" aria-expanded="false" aria-controls="' + id + '">' +
          '<span class="c1"><b>' + esc(r.name) + '</b>' + (tag ? '<em>' + esc(tag) + '</em>' : '') + '</span>' +
          '<span class="c2">' + esc(r.subcategory || '') + '</span>' +
          '<span class="c3"><i>' + esc(r.country) + '</i>' + (r.city ? ' ' + esc(r.city) : '') + '</span>' +
          '<span class="c4">' + (r.founded || '—') + '</span>' +
          '<span class="c5"><span class="chk ' + esc(r.chokepoint || '') + '">' + esc(r.chokepoint || '') + '</span></span>' +
          '<span class="c6"><i class="sup-chev" aria-hidden="true"></i></span>' +
          '</button><div class="sup-detail" id="' + id + '"><div class="sup-detail-in"></div></div></div>';
      });
      $('#sup-list').innerHTML = html;
    },
    toggleRow: function (head) {
      var row = head.parentNode, open = row.getAttribute('data-open') === '1';
      if (!open) {
        var body = $('.sup-detail-in', row);
        if (body && !body.getAttribute('data-filled')) { body.innerHTML = this.detail(this.shown[+row.getAttribute('data-i')]); body.setAttribute('data-filled', '1'); }
      }
      row.setAttribute('data-open', open ? '0' : '1');
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
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
      return '<div class="sup-detail-body">' + (r.role ? '<p class="sup-role">' + esc(r.role) + '</p>' : '') +
        (facts.length ? '<dl class="sup-facts">' + facts.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + f[1] + '</dd>'; }).join('') + '</dl>' : '') +
        (r.source ? '<a class="sup-src" href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" aria-label="Source for ' + esc(r.name) + '">Source</a>' : '') + '</div>';
    },

    /* ---- detailed table: every field, as before ---- */
    renderTable: function (rows) {
      var self = this;
      var th = function (k, label) { return '<th><button type="button" data-sort="' + k + '"' + (self.sortKey === k ? ' aria-sort="' + (self.sortDir > 0 ? 'ascending' : 'descending') + '"' : '') + '>' + label + '</button></th>'; };
      var html = '<thead><tr>' + th('name', 'Supplier') + th('category', 'Category') + th('country', 'Country') + th('founded', 'Founded') + th('chokepoint', 'Chokepoint level') + '<th>What they make and why it matters</th><th>Customers</th></tr></thead><tbody>';
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
      var q = function (v) { if (v == null) return ''; if (Array.isArray(v)) v = v.join('; '); v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      var csv = cols.join(',') + '\n' + rows.map(function (r) { return cols.map(function (c) { return q(r[c]); }).join(','); }).join('\n');
      var btn = $('#sup-copy');
      var done = function (ok) { btn.textContent = ok ? 'Copied ' + rows.length + ' rows' : 'Copy failed'; setTimeout(function () { btn.textContent = 'Copy as CSV'; }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(csv).then(function () { done(true); }, function () { done(false); });
      else done(false);
    }
  };

  /* ---------------- geopolitics ---------------- */
  var Geo = {
    built: false, cat: null,
    tl: [], visible: null, items: [], full: false, /* visible stays null until the first render so the export bar falls back to the whole set */ drawn: false, tip: null, at: -1, atDot: -1, stripW: 0, tickQ: false,
    /* the five lanes of the minimap, in this order; the colours are the .timeline .cat classes */
    CATS: [
      { name: 'US export control', label: 'US rules', short: 'US', cls: '' },
      { name: 'China countermeasure', label: 'China', short: 'CN', cls: 'cn' },
      { name: 'Allied control', label: 'Allied', short: 'Ally', cls: 'ally' },
      { name: 'Industrial policy', label: 'Policy', short: 'Pol', cls: 'policy' },
      { name: 'Corporate', label: 'Firms', short: 'Firm', cls: 'corp' }
    ],
    RULES: [
      { date: '2022-10-07', label: 'Oct 2022', short: '’22' },
      { date: '2023-10-17', label: 'Oct 2023', short: '’23' },
      { date: '2024-12-02', label: 'Dec 2024', short: '’24' }
    ],
    lane: function (c) {
      c = c || '';
      return /China/i.test(c) ? 1 : /Allied/i.test(c) ? 2 : /Industrial/i.test(c) ? 3 : /Corporate/i.test(c) ? 4 : 0;
    },
    activate: function () {
      if (!this.built) this.build();
      Stage.show('globe', null, null, 'Geopolitics · <b>the map</b>');
      var sec = $('section[data-view="geopolitics"]'); // the masthead link carries the same attribute; we want the view
      if (sec && sec.getAttribute('data-caption')) $('#stage-caption').textContent = sec.getAttribute('data-caption');
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
      if ($('#matrix-note')) $('#matrix-note').innerHTML = mx.length ? 'Each segment shows what is measured and in which year. ' + (DATA.matrixNotesHtml ? '' : '') + 'Sources are on the <a href="#/sources">Sources</a> page.' : 'The matrix has no data to show.';
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
      this.wireStrip();
      window.addEventListener('scroll', function () { if (Router.current === 'controls') self.spy(); }, { passive: true });
      window.addEventListener('resize', function () { clearTimeout(self.rz); self.rz = setTimeout(function () { self.stripW = 0; self.sync(); }, 160); }, { passive: true });
      this.renderTimeline();
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
          html += '<li class="tl-year"><div class="year-label">' + esc(y) + '</div><span class="tl-n">' + counts[y] + (counts[y] === 1 ? ' move' : ' moves') + '</span></li>';
        }
        var d = new Date(e.date + 'T00:00:00');
        var ds = isNaN(d) ? esc(e.date) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        var host = e.source ? e.source.replace(/^https?:\/\//, '').split('/')[0] : '';
        html += '<li class="tl-e" id="tl-e' + i + '" data-i="' + i + '">' +
          '<div class="d"><b>' + ds + '</b>' + esc(e.actor || '') + '</div>' +
          '<div class="tl-body"><span class="cat ' + self.CATS[self.lane(e.category)].cls + '">' + esc(e.category || '') + '</span>' +
          '<h4>' + esc(e.title) + '</h4><p class="tl-gist">' + esc(self.gistOf(e)) + '</p>' +
          '<button type="button" class="tl-more" aria-expanded="false" aria-controls="tl-p' + i + '">More</button>' +
          '<div class="tl-panel" id="tl-p' + i + '" hidden><p>' + esc(e.summary || '') + '</p>' +
          (host ? '<a class="src" href="' + safeUrl(e.source) + '" target="_blank" rel="noopener">' + esc(host) + '</a>' : '') +
          '</div></div></li>';
      });
      list.innerHTML = html || '<li class="tl-empty"><p>No events in this category.</p></li>';
      this.items = $$('.tl-e', list);
      if (this.full) this.setFull(true);
      this.reveal();
      this.strip();
      this.at = -1; this.atDot = -1; this.spy();
      list.dispatchEvent(new CustomEvent('cp:rows'));
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
    /* ---- minimap strip: one dot per event, five lanes, year axis ---- */
    strip: function () {
      var self = this, host = $('#tl-strip');
      if (!host) return;
      var w = Math.round(host.getBoundingClientRect().width);
      this.stripW = w;
      if (!w) { host.innerHTML = ''; return; } // the sub-tab is hidden: draw it when it opens
      var rows = this.visible || [], all = this.tl || [];
      var small = w < 700;
      var padL = small ? 46 : 106, padR = small ? 12 : 18;
      var laneH = small ? 13 : 18, top = small ? 18 : 24;
      var axisY = top + laneH * 5 + 6, H = axisY + (small ? 18 : 20);
      var x0 = padL, x1 = Math.max(padL + 40, w - padR);
      var mi = function (d) { d = String(d || ''); return (parseInt(d.slice(0, 4), 10) - 2018) * 12 + (parseInt(d.slice(5, 7), 10) - 1); };
      var span = 12; all.forEach(function (e) { span = Math.max(span, mi(e.date)); });
      var X = function (d) { var v = mi(d); return x0 + (Math.max(0, Math.min(span, isNaN(v) ? 0 : v)) / span) * (x1 - x0); };
      var s = '<svg class="tl-svg" width="' + w + '" height="' + H + '" viewBox="0 0 ' + w + ' ' + H + '" role="img" aria-label="Every move on one strip: five lanes by kind, 2018 to now">';
      for (var i = 0; i < 5; i++) {
        var ly = top + laneH * i + laneH / 2;
        s += '<rect class="tl-base" x="' + x0 + '" y="' + (ly - 0.5) + '" width="' + (x1 - x0) + '" height="1"></rect>' +
          '<text class="tl-lane ' + this.CATS[i].cls + '" x="' + (x0 - (small ? 7 : 11)) + '" y="' + (ly + 3.4) + '" text-anchor="end">' + esc(small ? this.CATS[i].short : this.CATS[i].label) + '</text>';
      }
      this.RULES.forEach(function (r) {
        var rx = X(r.date);
        s += '<line class="tl-rule" x1="' + rx.toFixed(1) + '" y1="' + (top - 5) + '" x2="' + rx.toFixed(1) + '" y2="' + (axisY - 2) + '"></line>' +
          '<text class="tl-rlab" x="' + rx.toFixed(1) + '" y="' + (top - 10) + '" text-anchor="middle">' + esc(small ? r.short : r.label) + '</text>';
      });
      for (var yy = 2018; yy <= 2018 + Math.floor(span / 12); yy++) {
        var xt = X(yy + '-01-01');
        s += '<line class="tl-tick" x1="' + xt.toFixed(1) + '" y1="' + axisY + '" x2="' + xt.toFixed(1) + '" y2="' + (axisY + 4) + '"></line>' +
          '<text class="tl-ylab" data-y="' + yy + '" x="' + xt.toFixed(1) + '" y="' + (axisY + 15) + '" text-anchor="middle">' + (small ? '’' + String(yy).slice(2) : yy) + '</text>';
      }
      var n = Math.max(1, rows.length - 1);
      rows.forEach(function (e, k) {
        var ln = self.lane(e.category), cy = top + laneH * ln + laneH / 2, cx = X(e.date);
        var d = new Date(e.date + 'T00:00:00');
        var ds = isNaN(d) ? e.date : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        s += '<circle class="tl-dot ' + self.CATS[ln].cls + '" cx="' + cx.toFixed(1) + '" cy="' + cy + '" r="' + (small ? 3.6 : 3.4) + '" data-i="' + k + '" tabindex="' + (k ? '-1' : '0') + '" role="button" aria-label="' + esc(ds + ': ' + e.title) + '" style="--d:' + Math.round(k / n * 420) + 'ms"></circle>';
      });
      s += '<circle class="tl-ring" cx="-20" cy="-20" r="6.6" opacity="0"></circle></svg>';
      host.innerHTML = s;
      host.setAttribute('data-anim', this.drawn || reduced ? '0' : '1');
      this.drawn = true;
      // entries scroll clear of the sticky strip, so the page needs its real height
      document.documentElement.style.setProperty('--tl-h', (window.innerWidth >= 900 ? H + 12 : 0) + 'px');
    },
    wireStrip: function () {
      var self = this, strip = $('#tl-strip');
      if (!strip) return;
      var dot = function (e) { return e.target && e.target.closest ? e.target.closest('.tl-dot') : null; };
      strip.addEventListener('mouseover', function (e) { var d = dot(e); if (d) self.showTip(d); });
      strip.addEventListener('mouseout', function (e) { if (dot(e)) self.hideTip(); });
      strip.addEventListener('focusin', function (e) { var d = dot(e); if (d) self.showTip(d); });
      strip.addEventListener('focusout', function () { self.hideTip(); });
      strip.addEventListener('click', function (e) { var d = dot(e); if (d) self.jump(parseInt(d.getAttribute('data-i'), 10)); });
      strip.addEventListener('keydown', function (ev) {
        var d = dot(ev), k = ev.key;
        if (!d) return;
        var i = parseInt(d.getAttribute('data-i'), 10), last = (self.visible || []).length - 1, to = -1;
        if (k === 'Enter' || k === ' ' || k === 'Spacebar') { ev.preventDefault(); self.jump(i); return; }
        if (k === 'ArrowRight' || k === 'ArrowDown') to = Math.min(last, i + 1);
        else if (k === 'ArrowLeft' || k === 'ArrowUp') to = Math.max(0, i - 1);
        else if (k === 'Home') to = 0;
        else if (k === 'End') to = last;
        if (to < 0) return;
        ev.preventDefault();
        var nx = strip.querySelector('.tl-dot[data-i="' + to + '"]');
        if (nx) { d.setAttribute('tabindex', '-1'); nx.setAttribute('tabindex', '0'); nx.focus(); }
      });
    },
    showTip: function (d) {
      var e = (this.visible || [])[parseInt(d.getAttribute('data-i'), 10)];
      if (!e) return;
      if (!this.tip) { var t = document.createElement('div'); t.className = 'tl-tip'; t.setAttribute('role', 'tooltip'); document.body.appendChild(t); this.tip = t; }
      var dt = new Date(e.date + 'T00:00:00');
      this.tip.innerHTML = '<b>' + esc(isNaN(dt) ? e.date : dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })) + '</b>' + esc(e.title);
      this.tip.hidden = false;
      var r = d.getBoundingClientRect(), x = r.left + r.width / 2 + window.scrollX;
      this.tip.style.left = Math.max(8, Math.min(x - this.tip.offsetWidth / 2, window.scrollX + window.innerWidth - this.tip.offsetWidth - 8)) + 'px';
      this.tip.style.top = (r.top + window.scrollY - this.tip.offsetHeight - 9) + 'px';
    },
    hideTip: function () { if (this.tip) this.tip.hidden = true; },
    jump: function (i) {
      var el = document.getElementById('tl-e' + i);
      if (!el) return;
      var btn = el.querySelector('.tl-more');
      if (btn && btn.getAttribute('aria-expanded') !== 'true') this.setOpen(btn, true);
      el.classList.add('is-in');
      $$('#timeline .is-target').forEach(function (x) { x.classList.remove('is-target'); });
      el.classList.add('is-target');
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },
    /* the dot of the entry nearest the top of the reading area, kept in step with the scroll */
    spy: function () {
      var self = this;
      if (this.tickQ) return;
      this.tickQ = true;
      var run = function () { self.tickQ = false; self.spyNow(); };
      if (window.requestAnimationFrame) window.requestAnimationFrame(run); else window.setTimeout(run, 32);
    },
    spyNow: function () {
      var svg = $('#tl-strip .tl-svg'), items = this.items || [];
      if (!svg || !items.length) return;
      var mast = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead')) || 56;
      var probe = mast + (window.innerWidth >= 900 ? svg.getBoundingClientRect().height : 0) + 26;
      var at = 0; // the first entry still crossing the reading line: the one the reader is on
      for (var i = 0; i < items.length; i++) { at = i; if (items[i].getBoundingClientRect().bottom > probe) break; }
      if (at === this.at) return;
      this.at = at;
      var dots = svg.querySelectorAll('.tl-dot'), ring = svg.querySelector('.tl-ring'), d = dots[at];
      if (!d) return;
      if (dots[this.atDot]) { dots[this.atDot].classList.remove('is-at'); dots[this.atDot].setAttribute('tabindex', '-1'); }
      d.classList.add('is-at'); d.setAttribute('tabindex', '0');
      this.atDot = at;
      if (ring) { ring.setAttribute('cx', d.getAttribute('cx')); ring.setAttribute('cy', d.getAttribute('cy')); ring.setAttribute('opacity', '1'); }
      var yy = String((this.visible[at] || {}).date || '').slice(0, 4), labs = svg.querySelectorAll('.tl-ylab');
      for (var j = 0; j < labs.length; j++) labs[j].classList.toggle('is-on', labs[j].getAttribute('data-y') === yy);
    },
    /* the strip is drawn from its own width, so redraw it whenever the sub-tab opens or the window changes */
    sync: function () {
      var host = $('#tl-strip');
      if (!host) return;
      if (Math.round(host.getBoundingClientRect().width) !== this.stripW) this.strip();
      this.at = -1; this.spy();
    }
  };

  /* ---------------- boot ---------------- */
  var Glossary = {
    init: function () {
      var inp = $('#gl-search'); if (!inp) return;
      inp.addEventListener('input', function () {
        var q = inp.value.trim().toLowerCase();
        $$('#glossary .gl-entry').forEach(function (el) { el.hidden = !!q && (el.getAttribute('data-text') || '').indexOf(q) < 0; });
      });
    }
  };
  /* ---------------- glossary popover: one panel, shared by every .gl-term in the prose ----------------
     The definitions already sit in the page, in the Glossary view, so nothing is duplicated. */
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
      t.innerHTML = '<b>' + esc(d.term) + '</b><p>' + esc(d.plain) + '</p><a href="#/glossary">Open the glossary →</a>';
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
    built: false, inBoard: false,
    activate: function () { if (!this.built) this.build(); if (Geo.built) Geo.sync(); this.enter(); },
    /* the board's groups, in reading order: what is controlled, then who, then trade */
    KINDS: [['chips', 'Chips'], ['memory', 'Memory'], ['tools', 'Chipmaking tools'], ['fabs', 'Fabs and nodes'],
      ['systems', 'Systems and clouds'], ['models', 'Models'], ['entities', 'Entities and ownership'],
      ['trade', 'Tariffs'], ['china', 'China’s countermeasures'], ['other', 'Other']],
    /* until every row carries a kind, read one off the rule's own words; first match wins */
    GUESS: [['china', /mofcom|rare[ -]earth|(^| )cn-/], ['trade', /tariff|section ?232|ad valorem/],
      ['entities', /entity|affiliate|ownership|footnote/], ['models', /model|gpai|ai act|training compute/],
      ['tools', /3b00|euv|litho|etch|deposit|overlay|nxt|meti|\bsme\b|mask|scanner/],
      ['memory', /hbm|dram|nand|memory/], ['systems', /diffusion|cluster|supercomputer|4a090|computers|data ?cent/],
      ['chips', /3a090|\btpp\b|aicd|advanced computing|shipment|accelerator/],
      ['fabs', /node|transistor|\bfab|nanometre|nanometer/]],
    kindOf: function (t) {
      if (t.kind) return t.kind;
      var hay = ((t.id || '') + ' ' + (t.instrument || '') + ' ' + (t.parameter || '') + ' ' + (t.scope || '') + ' ' + (t.regime || '')).toLowerCase();
      for (var i = 0; i < this.GUESS.length; i++) if (this.GUESS[i][1].test(hay)) return this.GUESS[i][0];
      return 'other';
    },
    /* a short unit for the headline; the long one is the parameter's definition and stays in Details */
    unitOf: function (t) {
      if (t.unitShort != null) return t.unitShort;
      var u = String(t.unit || '');
      if (u.charAt(0) === '%') return '%';
      return (u && u.length <= 14 && !/[,;]/.test(u)) ? u : '';
    },
    SUP: ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'],
    sup: function (n) {
      var s = String(n), o = '', i;
      for (i = 0; i < s.length; i++) o += (s.charAt(i) === '-' ? '⁻' : this.SUP[+s.charAt(i)] || s.charAt(i));
      return o;
    },
    fmtVal: function (v, unit) {
      if (v == null || v === '') return '';
      if (typeof v !== 'number' || !isFinite(v)) return String(v);
      if (unit === '%') return String(v) + '%';
      var a = Math.abs(v);
      if (a >= 1e20) {
        var ex = Math.round(Math.log(a) / Math.LN10), base = v / Math.pow(10, ex);
        return (Math.abs(base - 1) < 1e-6 ? '' : String(Number(base.toFixed(2))) + ' × ') + '10' + this.sup(ex);
      }
      if (a >= 1e9) return String(Number((v / 1e9).toFixed(2))) + ' billion';
      if (a >= 1e6) return String(Number((v / 1e6).toFixed(2))) + ' million';
      if (v === Math.round(v)) return v.toLocaleString('en-US');
      return String(v);
    },
    OPS: { '>=': '≥', '<=': '≤', '>': '>', '<': '<', '=': '=' },
    op: function (o) {
      o = String(o == null ? '' : o).trim();
      if (this.OPS[o]) return this.OPS[o];
      var band = o.match(/^(>=|<=|>|<|=)(\s|$)/); // ">= and <" is a band: the headline carries its floor, Details the rest
      if (band) return this.OPS[band[1]];
      return o.replace(/>=/g, '≥').replace(/<=/g, '≤');
    },
    // Rows whose operator and value fields do not read as a sentence get a written headline (see qa/redesign-content.md).
    OVERRIDE: {
      '3a090b-tpp': 'TPP 2,400 to 4,800',
      '4a090-computers': 'Contains a chip at 4,800 TPP or above',
      'aicd-transistor-count': '30 billion transistors',
      '3b001-litho-zero-de-minimis': 'Zero de minimis, so any US content counts',
      'entity-list-affiliates-suspension': 'Stayed 12 months, to 9 November 2026',
      'nl-duv-nxt2000i': 'TWINSCAN NXT:2000i and later',
      'nl-duv-nxt1970i-1980i': 'Includes TWINSCAN NXT:1970i and 1980i',
      'ai-diffusion-country-cap': '790 million TPP per country',
      'ai-diffusion-nveu-allocation': '5.06 billion TPP per company',
      'ai-diffusion-lpp': '26.9 million TPP a year per buyer',
      'ai-diffusion-model-weights': 'Training compute > 10\u00b2\u2076 operations',
      'eu-ai-act-gpai-compute': 'Training compute > 10\u00b2\u2075 FLOP',
      'us-model-reporting-1e26': 'Training compute > 10\u00b2\u2076 operations',
      'us-compute-cluster-reporting': 'Cluster compute > 10\u00b2\u2070 operations per second'
    },
    headline: function (t) {
      if (t.id && this.OVERRIDE[t.id]) return this.OVERRIDE[t.id];
      var p = t.paramShort || t.parameter || '', u = this.unitOf(t);
      if (t.value == null || t.value === '') return p;
      return p + ' ' + this.op(t.operator) + ' ' + this.fmtVal(t.value, u) + (u && u !== '%' ? ' ' + u : '');
    },
    stClass: function (s) {
      s = String(s || '');
      return /propos/i.test(s) ? 'is-prop' : /suspend|stay/i.test(s) ? 'is-susp'
        : /supersed|rescind|expired/i.test(s) ? 'is-old' : /force/i.test(s) ? 'is-force' : 'is-other';
    },
    card: function (t, chapterChip, i) {
      var u = this.unitOf(t), det = [];
      if (t.regime) det.push(['Regime', t.regime]);
      if (t.destinations) det.push(['Destinations', t.destinations]);
      if (t.licensePolicy) det.push(['Licence policy', t.licensePolicy]);
      if (t.alternative) det.push(['Alternative test', t.alternative]);
      if (t.unit && t.unit !== u) det.push(['What is measured', t.unit]);
      if (t.amendedBy && t.amendedBy.length) det.push(['Amended', t.amendedBy.join(', ')]);
      if (t.note) det.push(['Note', t.note]);
      var dl = det.map(function (d) { return '<dt>' + esc(d[0]) + '</dt><dd>' + esc(d[1]) + '</dd>'; }).join('');
      var src = t.source ? '<a class="th-src" href="' + safeUrl(t.source) + '" target="_blank" rel="noopener">Read the rule</a>' : '';
      return '<article class="th-card" style="--d:' + Math.min(500, i * 20) + 'ms">' +
        '<h5 class="th-head">' + esc(this.headline(t)) + '</h5>' +
        '<div class="th-inst">' + esc(t.instrument || '') + '</div>' +
        (t.scope ? '<p class="th-scope">' + esc(t.scope) + '</p>' : '') +
        '<div class="th-meta"><span class="th-st ' + this.stClass(t.status) + '">' + esc(t.status || '') + '</span>' +
        (t.effectiveDate ? '<span class="th-from">from ' + esc(t.effectiveDate) + '</span>' : '') + '</div>' +
        chapterChip(t.chapter) +
        (dl || src ? '<details class="th-det"><summary>Details</summary><dl>' + dl + '</dl>' + src + '</details>' : '') +
        '</article>';
    },
    /* the cards animate the first time the sub-tab is actually on screen */
    enter: function () {
      var sub = $('.view[data-view="controls"] .sub[data-sub="thresholds"]'), board = $('#th-board');
      if (!sub || !board || sub.hidden || this.inBoard) return;
      this.inBoard = true;
      if (!reduced) board.setAttribute('data-in', '1');
    },
    build: function () {
      this.built = true;
      var th = DATA.controls || [], ex = DATA.exposure || [];
      var tbl = $('#controls-table');
      if (tbl) {
        var regimes = {}; th.forEach(function (t) { regimes[t.regime] = (regimes[t.regime] || 0) + 1; });
        var chips = $('#controls-chips'), self = this, sel = null;
        if (chips) {
          chips.innerHTML = Object.keys(regimes).map(function (r) { return '<button type="button" data-r="' + esc(r) + '" aria-pressed="false">' + esc(r) + '<b>' + regimes[r] + '</b></button>'; }).join('');
          chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sel = sel === b.getAttribute('data-r') ? null : b.getAttribute('data-r'); $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-r') === sel ? 'true' : 'false'); }); render(); });
        }
        // every threshold names the chapter it belongs to; show it as a chip that jumps there
        var chTitle = {}; (DATA.chapters || []).forEach(function (c) { chTitle[c.id] = c.title; });
        var chapterChip = function (id) {
          if (!id || !chTitle[id]) return '';
          return '<a class="chip chip-ch" href="' + ('#' + esc(id)) + '" title="Read the chapter: ' + esc(chTitle[id]) + '">' + esc(chTitle[id]) + '</a>';
        };
        var jump = $('#th-jump'), board = $('#th-board');
        if (jump) jump.addEventListener('click', function (e) {
          var b = e.target.closest('button'); if (!b) return;
          var g = document.getElementById('th-g-' + b.getAttribute('data-g'));
          if (g) g.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        });
        var renderBoard = function (rows) {
          if (!board) return;
          var by = {}, bh = '', jh = '', n = 0;
          rows.forEach(function (t) { var k = self.kindOf(t); (by[k] = by[k] || []).push(t); });
          self.KINDS.forEach(function (kd) {
            var group = by[kd[0]];
            if (!group || !group.length) return;
            jh += '<button type="button" data-g="' + esc(kd[0]) + '">' + esc(kd[1]) + '<b>' + group.length + '</b></button>';
            bh += '<section class="th-group" id="th-g-' + esc(kd[0]) + '"><h4 class="th-gh">' + esc(kd[1]) + '<span>' + group.length + '</span></h4><div class="th-cards">' +
              group.map(function (t) { return self.card(t, chapterChip, n++); }).join('') + '</div></section>';
          });
          board.innerHTML = bh || '<p class="th-empty">No thresholds under this regime.</p>';
          if (jump) jump.innerHTML = jh;
          board.dispatchEvent(new CustomEvent('cp:rows'));
        };
        var render = function () {
          var rows = th.filter(function (t) { return !sel || t.regime === sel; });
          self.visible = rows;
          renderBoard(rows);
          tbl.innerHTML ='<thead><tr><th>Legal instrument</th><th>Scope</th><th>Threshold</th><th>Destinations and licence policy</th><th>Status</th><th>Source</th></tr></thead><tbody>' + rows.map(function (t) {
            var thr = (t.parameter ? esc(t.parameter) + ' ' : '') + (t.operator ? esc(t.operator) + ' ' : '') + (t.value != null ? '<b class="num">' + (typeof t.value === 'number' ? t.value.toLocaleString('en-US') : esc(t.value)) + '</b>' : '') + (t.unit ? ' <span class="cc">' + esc(t.unit) + '</span>' : '') + (t.alternative ? '<br><span class="cc" style="color:var(--muted)">' + esc(t.alternative) + '</span>' : '');
            var st = esc(t.status || ''), cls = /force/i.test(st) ? 'Critical' : /suspend/i.test(st) ? 'Contested' : /rescind|expired/i.test(st) ? 'Diversified' : 'Important';
            return '<tr><td class="name"><b>' + esc(t.instrument) + '</b><span>' + esc(t.regime) + (t.effectiveDate ? ' · from ' + esc(t.effectiveDate) : '') + '</span>' + chapterChip(t.chapter) + '</td><td>' + esc(t.scope || '') + '</td><td>' + thr + '</td><td class="role">' + esc(t.destinations || '') + (t.licensePolicy ? '<br><span class="cc" style="color:var(--muted)">' + esc(t.licensePolicy) + '</span>' : '') + (t.note ? '<br>' + esc(t.note) : '') + '</td><td><span class="chk ' + cls + '">' + st + '</span>' + (t.amendedBy && t.amendedBy.length ? '<br><span class="cc" style="color:var(--muted)">amended ' + esc(t.amendedBy.join(', ')) + '</span>' : '') + '</td><td>' + (t.source ? '<a class="cc" href="' + safeUrl(t.source) + '" target="_blank" rel="noopener">source</a>' : '') + '</td></tr>';
          }).join('') + '</tbody>';
          tbl.dispatchEvent(new CustomEvent('cp:rows'));
          var c = $('#controls-count'); if (c) c.textContent = 'Showing ' + rows.length + ' of ' + th.length + ' thresholds';
        };
        render();
      }
      var viz = $('#exposure-viz');
      if (viz && viz.firstElementChild) { // tooltips on the exposure charts
        var tip = document.createElement('div'); tip.className = 'ex-tip'; tip.hidden = true; document.body.appendChild(tip);
        var fmtM = function (v) { return Number(v).toLocaleString('en-US') + 'm'; };
        var showTip = function (c) {
          var d = c.dataset, cur = (d.cur || '').replace(/\s*million\s*/i, '');
          var money = d.china && d.total ? ' · ' + (cur ? cur + ' ' : '') + fmtM(d.china) + ' of ' + fmtM(d.total) : '';
          tip.innerHTML = '<b>' + esc(d.firm) + ' · ' + esc(d.fy) + '</b>China was ' + esc(d.share) + '% of revenue' + money + (d.basis ? '<br>' + esc(d.basis) : '') + '<br>Click to open the filing';
          tip.hidden = false;
          var r = c.getBoundingClientRect(), x = r.left + r.width / 2 + window.scrollX, y = r.top + window.scrollY;
          tip.style.left = Math.max(8, Math.min(x - tip.offsetWidth / 2, window.scrollX + window.innerWidth - tip.offsetWidth - 8)) + 'px';
          tip.style.top = (y - tip.offsetHeight - 10) + 'px';
        };
        viz.addEventListener('mouseover', function (e) { var c = e.target.closest && e.target.closest('circle[data-firm]'); if (c) showTip(c); });
        viz.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest('circle[data-firm]')) tip.hidden = true; });
        viz.addEventListener('focusin', function (e) { var c = e.target.querySelector ? e.target.querySelector('circle[data-firm]') : null; if (c) showTip(c); });
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
          var basisShort = function (b) { b = (b || '').toLowerCase(); if (!b) return ''; if (/ship-to|ship to|destination|fab\)/.test(b)) return 'counted where it ships'; if (/bill|invoice/.test(b)) return 'counted where it is billed'; if (/headquarters/.test(b)) return 'counted by headquarters'; if (/seat|licen/.test(b)) return 'counted by licence seats'; if (/used|usage/.test(b)) return 'counted where it is used'; if (/own operating|operating units|own units/.test(b)) return 'counted by own units'; return 'counted by customer location'; };
          return '<tr><td title="' + esc(m.basis || '') + '">' + esc(f) + '<small>' + esc(m.category || '') + ' · ' + esc(cname(m.country)) + (m.basis ? ' · ' + esc(basisShort(m.basis)) : '') + '</small></td>' + ys.map(function (y) { var r = firms[f][y]; if (!r || r.chinaShare == null) return '<td><span class="cell zero">·</span></td>'; return '<td><a class="cell" style="--v:' + Math.round(Math.min(100, r.chinaShare) * 1.6) + '" href="' + safeUrl(r.source) + '" target="_blank" rel="noopener" title="' + esc((r.chinaRevenue != null ? r.chinaRevenue.toLocaleString('en-US') + ' of ' + (r.totalRevenue || 0).toLocaleString('en-US') + ' ' + (r.currency || '') : '') + (r.note ? ' · ' + r.note : '')) + '">' + r.chinaShare.toFixed(1) + '%</a></td>'; }).join('') + '</tr>';
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
      idx.push({ kind: 'Intro', title: 'How a GPU is made', text: 'One plain paragraph per stage, in order, with the specimens: the chain in one sitting', href: '#/intro' });
      (DATA.chapters || []).forEach(function (c) { if (c.plain && c.id !== 'introduction-and-goals') idx.push({ kind: 'Intro', title: c.title + ', in plain terms', text: c.plain, href: '#/walk/' + c.id }); });
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
      $$('#glossary .gl-entry').forEach(function (el) { idx.push({ kind: 'Glossary', title: el.querySelector('dt').firstChild.textContent, text: el.querySelector('dd p').textContent, href: '#/glossary', el: el }); });
      (DATA.suppliers || []).forEach(function (r) { idx.push({ kind: 'Supplier', title: r.name, text: r.category + ' · ' + cname(r.country) + (r.role ? ' · ' + r.role : ''), href: '#/suppliers', q: r.name }); });
      (DATA.landscape || []).forEach(function (c) { idx.push({ kind: 'Chip', title: c.vendor + ' ' + c.name, text: ((c.process || {}).node || '') + ' · ' + ((c.memory || {}).type || '') + ' · ' + (c.status || ''), href: '#/landscape', chip: c.id }); });
      (DATA.timeline || []).forEach(function (e) { idx.push({ kind: 'Event ' + e.date, title: e.title, text: e.summary || '', href: '#/controls' }); });
      (DATA.controls || []).forEach(function (t) { idx.push({ kind: 'Export rule', title: t.instrument + (t.parameter ? ' · ' + t.parameter : ''), text: [t.scope, t.destinations, t.note].filter(Boolean).join(' · '), href: '#/thresholds' }); });
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
    KIND: { Glossary: 20, Chapter: 10, Essay: 8 },
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
      var near = idx.filter(function (i) { return i.kind === 'Glossary'; }).map(function (i) {
        var n = 0; while (n < qn.length && n < i.tn.length && qn.charAt(n) === i.tn.charAt(n)) n++;
        return { i: i, n: n };
      }).sort(function (a, b) { return b.n - a.n || a.i.tn.length - b.i.tn.length; }).slice(0, 3);
      return { hits: near.map(function (x) { return x.i; }), note: 'Nothing matches. The nearest glossary entries:' };
    },
    open: function () {
      var self = this, box = $('#cp-search');
      if (!box) {
        box = document.createElement('div'); box.id = 'cp-search'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Search the site');
        box.innerHTML = '<div class="cp-search-panel"><input type="search" placeholder="Search chapters, glossary, suppliers, chips, rules and events…" aria-label="Search"><ol class="cp-search-results"></ol><p class="cp-search-hint">Type to search · Enter opens the first result · Esc closes</p></div>';
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
            (hits.map(function (h, k) { return '<li><a href="' + safeUrl(h.href) + '" data-k="' + k + '"><span class="k">' + esc(h.kind) + '</span><b>' + esc(h.title) + '</b><span class="t">' + esc(h.text.slice(0, 140)) + '</span></a></li>'; }).join('') || (res.note ? '' : '<li class="none">Nothing matches. Try fewer words.</li>'));
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
      var nav = $('.tabs'), btn = document.createElement('button'); btn.type = 'button'; btn.className = 'search-btn'; btn.setAttribute('aria-label', 'Search'); btn.title = 'Search the site (Ctrl+K, or press /)';
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
      btn.addEventListener('click', function () { self.open(); });
      if (nav) nav.insertBefore(btn, $('.theme-toggle'));
      document.addEventListener('keydown', function (e) { var k = e.key || '', a = document.activeElement || document.body; if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'k') { e.preventDefault(); self.open(); } if (k === '/' && !/INPUT|TEXTAREA|SELECT/.test(a.tagName || '') && !a.isContentEditable) { e.preventDefault(); self.open(); } });
      // heading permalinks
      $$('.prose h3[id], .prose h4[id]').forEach(function (h) { var a = document.createElement('a'); a.className = 'permalink'; a.href = '#' + h.id; a.setAttribute('aria-label', 'Link to this section'); a.textContent = '#'; h.appendChild(a); });
      // dataset export buttons (copy to clipboard: JSON or CSV)
      var copy = function (text, btn, label) { var done = function (ok) { btn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { btn.textContent = label; }, 2000); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false); };
      var toCSV = function (rows) { if (!rows.length) return ''; var cols = []; rows.forEach(function (r) { Object.keys(r).forEach(function (k) { if (cols.indexOf(k) < 0) cols.push(k); }); }); var q = function (v) { if (v == null) return ''; if (typeof v === 'object') v = JSON.stringify(v); v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }; return cols.join(',') + '\n' + rows.map(function (r) { return cols.map(function (c) { return q(r[c]); }).join(','); }).join('\n'); };
      var addExport = function (anchorSel, name, rows, where) {
        var get = typeof rows === 'function' ? rows : function () { return rows; }; // a function means: whatever the table currently shows
        var host = $(anchorSel); if (!host || !get() || !get().length) return;
        var bar = document.createElement('div'); bar.className = 'export-bar';
        bar.innerHTML = '<span class="count">' + get().length + ' rows · ' + esc(name) + '</span><button type="button" class="btn ghost">Copy as CSV</button><button type="button" class="btn ghost">Copy as JSON</button>';
        var b = bar.querySelectorAll('button'), countEl = bar.querySelector('.count');
        host.addEventListener('cp:rows', function () { countEl.textContent = get().length + ' rows · ' + name; });
        b[0].addEventListener('click', function () { copy(toCSV(get()), b[0], 'Copy as CSV'); });
        b[1].addEventListener('click', function () { copy(JSON.stringify(get(), null, 1), b[1], 'Copy as JSON'); });
        if (where === 'after') host.insertAdjacentElement('afterend', bar); else host.insertAdjacentElement('beforebegin', bar);
      };
      addExport('#cx-table-wrap', 'the chips you picked', Landscape.exportRows, 'before'); // a live array: Landscape keeps it in step with the selection
      addExport('#matrix', 'country-share matrix', DATA.matrix, 'before');
      addExport('#timeline', 'export-control timeline', function () { return Geo.visible || DATA.timeline; }, 'before');
      addExport('#th-board', 'licence thresholds', function () { return Controls.visible || DATA.controls; }, 'before'); // the board is the page now; the table sits behind a toggle
      addExport('#exposure-table', 'China revenue share by firm and year', DATA.exposure, 'before');
      // cite-this block in the footer
      var foot = $('.site-footer');
      if (foot) { var d = new Date().toISOString().slice(0, 10); foot.insertAdjacentHTML('beforeend', '<details class="cite"><summary>Cite this site</summary><pre>Sharma, Y. with Claude. Compute Chokepoints: the AI chip supply chain, stage by stage. September 2026. https://yashvardhansharmaa.github.io/chokepoints/ (accessed ' + d + ').</pre><pre>@misc{chokepoints2026,\n  title  = {Compute Chokepoints: the AI chip supply chain, stage by stage},\n  author = {Sharma, Yashvardhan and Claude},\n  year   = {2026},\n  month  = {September},\n  url    = {https://yashvardhansharmaa.github.io/chokepoints/},\n  note   = {Accessed ' + d + '}\n}</pre></details>'); }
    }
  };

  // public surface for the module files concatenated after this one (src/modules/*.js)
  window.CP = { Stage: Stage, Router: Router, Sections: Sections, Tools: Tools, Band: Band, DATA: DATA, $: $, $$: $$, esc: esc, narrow: narrow, safeUrl: safeUrl, cname: cname, reduced: reduced,
    register: function (view, def) { MODULE_VIEWS[view] = def; if (Router.current === view && def.activate) def.activate(); } };
  function boot() {
    // QA aid: ?only=<chapter-id> shows just that chapter at the top of the page (screenshots in a hidden pane only paint the first frame)
    try { var only = new URLSearchParams(location.search).get('only'); if (only && document.getElementById(only)) { document.documentElement.classList.add('dbg-only'); document.getElementById(only).classList.add('only'); } } catch (e) { }
    Theme.init();
    Glossary.init();
    Tip.init();
    Tools.init();
    var setMast = function () { var m = $('.masthead'), root = document.documentElement; if (!m) return; root.style.removeProperty('--masthead'); root.style.setProperty('--masthead', m.offsetHeight + 'px'); }; // the masthead wraps on phones, so the sticky offsets follow its real height
    setMast(); window.addEventListener('resize', setMast); window.addEventListener('load', setMast);
    Stage.init();
    Band.init();
    Router.init();
    Sections.init();
    // warm the cache for the next chapters while idle
    var names = $$('[data-view="stack"] [data-specimen]').map(function (el) { return el.getAttribute('data-specimen'); });
    var i = 0;
    var idle = window.requestIdleCallback ? function (f, ms) { requestIdleCallback(f, { timeout: ms * 3 }); } : function (f, ms) { setTimeout(f, ms); };
    var warm = function () { if (i >= names.length) return; try { Stage.build(names[i++], null); } catch (e) { } idle(warm, 250); };
    idle(warm, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
