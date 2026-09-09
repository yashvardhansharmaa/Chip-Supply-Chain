/* CHOKEPOINTS runtime: theme, router, WebGL specimen stage, section tracking, landscape / suppliers / geopolitics views. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var DATA = window.CP_DATA || {};
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = function () { return window.innerWidth < 900; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
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
      var key = name + '|' + JSON.stringify(params || {});
      if (this.cache[key]) return this.cache[key];
      var spec;
      try { spec = PC.build(name, params); } catch (e) { console.warn('specimen failed:', name, e.message); return null; }
      var gl = this.gl, vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, spec.cloud, gl.STATIC_DRAW);
      var slot = { key: key, vbo: vbo, n: PC.count(spec.cloud), spin: spec.spin, tilt: spec.tilt, caption: spec.caption, spinBase: 0 };
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
    setVisible: function (v) { this.active = v; this.fig.setAttribute('data-hidden', v ? '0' : '1'); if (v) this.resize(); },
    draw: function (slot, op, extraRot, sc) {
      var gl = this.gl, aspect = this.w / this.h;
      var P = perspective(34 * Math.PI / 180, aspect, 0.1, 40);
      // pull the camera back on narrow (portrait) stages so the bounding sphere fits the width too
      var V = translate(0, -0.05, -3.6 * Math.max(1, 0.98 / aspect));
      var t = slot.tilt;
      var M = mul(rotZ(t[2]), mul(rotY(t[1] + this.spin + slot.spinBase + this.scrollAngle + extraRot), rotX(t[0])));
      M = mul(M, scale(sc));
      var MVP = mul(P, mul(V, M));
      gl.uniformMatrix4fv(this.loc.uMVP, false, new Float32Array(MVP));
      var size = 6.3 * this.dpr * Math.min(1.05, Math.max(0.6, this.h / (900 * this.dpr))) * Math.max(1, 0.98 / aspect);
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

  /* ---------------- router ---------------- */
  var VIEWS = ['stack', 'briefing', 'landscape', 'suppliers', 'geopolitics', 'controls', 'glossary', 'sources'];
  var Router = {
    current: null,
    init: function () {
      var self = this;
      window.addEventListener('hashchange', function () { self.route(); });
      this.route();
    },
    route: function () {
      var h = location.hash || '#/', m = h.match(/^#\/([a-z]+)/), v = 'stack';
      if (m && VIEWS.indexOf(m[1]) >= 0) v = m[1];
      var changed = v !== this.current;
      this.current = v;
      $$('.view').forEach(function (s) { s.hidden = s.getAttribute('data-view') !== v; });
      $$('.tabs a').forEach(function (a) { if (a.getAttribute('data-view') === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      var rail = $('.rail'); if (rail && v !== 'stack') rail.setAttribute('data-show', '0');
      Stage.setVisible(v === 'stack' || v === 'landscape' || v === 'geopolitics');
      if (v === 'landscape') Landscape.activate();
      else if (v === 'geopolitics') Geo.activate();
      else if (v === 'suppliers') Suppliers.activate();
      else if (v === 'controls') Controls.activate();
      if (changed && m) window.scrollTo(0, 0);
      if (v === 'stack') {
        if (!m && h.length > 1) {
          var el = document.getElementById(decodeURIComponent(h.slice(1)));
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
      document.title = v === 'stack' ? 'Chokepoints' : 'Chokepoints · ' + { briefing: 'Briefing', landscape: 'Landscape', suppliers: 'Suppliers', geopolitics: 'Geopolitics', controls: 'Controls', glossary: 'Glossary', sources: 'Sources' }[v];
    }
  };

  /* ---------------- section tracking (stack view) ---------------- */
  var Sections = {
    items: [], currentId: null, heroBottom: 0,
    init: function () {
      var self = this;
      this.items = $$('[data-view="stack"] [data-specimen]');
      this.railItems = $$('.rail li');
      window.addEventListener('scroll', function () { self.update(); }, { passive: true });
      window.addEventListener('resize', function () { self.update(); });
      $('.to-top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
      this.update();
    },
    update: function () {
      if (Router.current !== 'stack') return;
      var vh = window.innerHeight, probe = narrow() ? vh * 0.55 : vh * 0.42, best = null, bestTop = -Infinity;
      for (var i = 0; i < this.items.length; i++) {
        var r = this.items[i].getBoundingClientRect();
        if (r.top <= probe && r.top > bestTop) { best = this.items[i]; bestTop = r.top; }
      }
      if (!best) best = this.items[0];
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

  /* ---------------- landscape ---------------- */
  var Landscape = {
    chips: DATA.landscape || [], notes: DATA.landscapeNotes || {}, sel: null, built: false,
    activate: function () {
      if (!this.built) this.buildUI();
      if (!this.sel && this.chips.length) this.select(this.chips[0].id);
      else if (this.sel) this.showStage(this.byId(this.sel));
    },
    byId: function (id) { for (var i = 0; i < this.chips.length; i++) if (this.chips[i].id === id) return this.chips[i]; return null; },
    buildUI: function () {
      this.built = true;
      var self = this, pk = $('#picker'), html = '', lastVendor = null;
      var order = this.chips.slice();
      order.forEach(function (c) {
        if (c.vendorCountry !== lastVendor) { html += '<div class="group">' + esc(cname(c.vendorCountry)) + '</div>'; lastVendor = c.vendorCountry; }
        html += '<button type="button" data-id="' + esc(c.id) + '" aria-pressed="false"><b>' + esc(c.name) + '</b><span>' + esc(c.vendor) + (c.family && c.family !== c.name ? ' · ' + esc(c.family) : '') + '</span></button>';
      });
      pk.innerHTML = html;
      pk.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) self.select(b.getAttribute('data-id')); });
      this.buildCompare();
    },
    fmt: function (v, unit) { if (v == null || v === '') return '—'; if (typeof v === 'number') return v.toLocaleString('en-US') + (unit ? ' ' + unit : ''); return esc(v) + (unit ? ' ' + unit : ''); },
    row: function (k, v, unit) { return '<dt>' + esc(k) + '</dt><dd>' + this.fmt(v, unit) + '</dd>'; },
    select: function (id) {
      var c = this.byId(id); if (!c) return;
      this.sel = id;
      $$('#picker button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === id ? 'true' : 'false'); });
      var f = this.fmt.bind(this), r = this.row.bind(this);
      var m = c.memory || {}, d = c.die || {}, p = c.package || {}, pr = c.process || {}, cp = c.compute || {}, ic = c.interconnect || {};
      var note = this.notes[c.id] || '';
      var html = '<div class="spec-head"><div><span class="vendor">' + esc(c.vendor) + ' · ' + esc(cname(c.vendorCountry)) + (c.family ? ' · ' + esc(c.family) : '') + '</span><h3>' + esc(c.name) + '</h3></div>' +
        '<span class="status ' + esc((c.status || '').replace(/\s.*/, '')) + '">' + esc(c.status || '') + (c.shipping ? ' · ' + esc(c.shipping) : '') + '</span></div>' +
        '<div class="spec-kpis">' +
        '<div><b>' + (m.capacityGB != null ? m.capacityGB + '<small>GB</small>' : '—') + '</b><span>' + esc(m.type || 'Memory') + '</span></div>' +
        '<div><b>' + (m.bandwidthTBs != null ? m.bandwidthTBs + '<small>TB/s</small>' : '—') + '</b><span>Bandwidth</span></div>' +
        '<div><b>' + (cp.fp8TFLOPS != null ? Math.round(cp.fp8TFLOPS).toLocaleString('en-US') : (cp.fp16TFLOPS != null ? Math.round(cp.fp16TFLOPS).toLocaleString('en-US') : '—')) + '<small>' + (cp.fp8TFLOPS != null ? 'FP8 TFLOPS' : 'FP16 TFLOPS') + '</small></b><span>Dense compute</span></div>' +
        '<div><b>' + (c.tdpW != null ? c.tdpW + '<small>W</small>' : '—') + '</b><span>TDP</span></div></div>' +
        '<div class="spec-groups">' +
        '<h4>Silicon</h4><dl>' + r('Foundry', pr.foundry ? pr.foundry + (pr.country ? ' (' + cname(pr.country) + ')' : '') : null) + r('Process node', pr.node) + r('Dies', d.count) + r('Die area', d.areaMm2Each, 'mm² each') + r('Transistors', d.transistorsB, 'billion') + r('Reticle-limited', d.reticleLimited == null ? null : (d.reticleLimited ? 'Yes' : 'No')) + '</dl>' +
        '<h4>Package</h4><dl>' + r('Type', p.type) + r('Assembled by', p.assembler) + r('Package size', p.sizeMm) + '</dl>' +
        '<h4>Memory</h4><dl>' + r('Type', m.type) + r('Stacks', m.stacks) + r('Capacity', m.capacityGB, 'GB') + r('Bandwidth', m.bandwidthTBs, 'TB/s') + r('Suppliers', (m.suppliers || []).join(', ') || null) + '</dl>' +
        '<h4>Compute</h4><dl>' + r('FP16 / BF16', cp.fp16TFLOPS, 'TFLOPS') + r('FP8', cp.fp8TFLOPS, 'TFLOPS') + r('FP4', cp.fp4TFLOPS, 'TFLOPS') + r('Note', cp.precisionNote) + r('TDP', c.tdpW, 'W') + '</dl>' +
        '<h4>System</h4><dl>' + r('Chip to chip', ic.chipToChip) + r('Scale-up', ic.scaleUp) + r('Scale-out', ic.scaleOut) + r('System builders', (c.systemIntegrators || []).join(', ') || null) + r('Target', c.target) + '</dl>' +
        '<h4>Economics and policy</h4><dl>' + r('Price estimate', c.priceEstimate) + r('BOM estimate', c.bomEstimate) + r('Export status', c.exportStatus) + r('Announced', c.announced) + r('Shipping', c.shipping) + '</dl>' +
        '</div>' +
        (note || c.notes ? '<div class="spec-notes"><span class="label">In the supply chain</span>' + (note ? note : '<p>' + esc(c.notes) + '</p>') + '</div>' : '') +
        (c.sources && c.sources.length ? '<div class="spec-sources">' + c.sources.map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label || s.url) + '</a>'; }).join('') + '</div>' : '');
      $('#spec').innerHTML = html;
      this.showStage(c);
    },
    showStage: function (c) {
      var lay = c.layout || null, hb = (c.memory && c.memory.stacks) || 0;
      var cap = lay && lay.waferScale ? 'Wafer-scale: one ' + esc(c.name) + ' is a whole 300 mm wafer.' : esc(c.name) + ': ' + ((c.die && c.die.count) || 1) + ' logic die' + (((c.die && c.die.count) || 1) > 1 ? 's' : '') + (hb ? ' and ' + hb + ' ' + esc((c.memory && c.memory.type) || 'HBM') + ' stacks' : '') + ' on ' + esc((c.package && c.package.type) || 'the package') + '.';
      Stage.show('package', lay ? { layout: lay } : null, cap, 'Landscape · <b>' + esc(c.name) + '</b>');
    },
    buildCompare: function () {
      var cols = [['Chip', function (c) { return '<b>' + esc(c.name) + '</b> <span class="cc">' + esc(c.vendor) + '</span>'; }],
        ['Node', function (c) { return esc((c.process || {}).node || '—') + ' · ' + esc((c.process || {}).foundry || ''); }],
        ['Dies', function (c) { return (c.die || {}).count != null ? c.die.count : '—'; }],
        ['Transistors', function (c) { return (c.die || {}).transistorsB != null ? c.die.transistorsB + ' B' : '—'; }],
        ['Package', function (c) { return esc((c.package || {}).type || '—'); }],
        ['Memory', function (c) { var m = c.memory || {}; return m.type ? esc(m.type) + (m.stacks ? ' ×' + m.stacks : '') : '—'; }],
        ['Capacity', function (c) { return (c.memory || {}).capacityGB != null ? c.memory.capacityGB + ' GB' : '—'; }],
        ['Bandwidth', function (c) { return (c.memory || {}).bandwidthTBs != null ? c.memory.bandwidthTBs + ' TB/s' : '—'; }],
        ['FP8 dense', function (c) { return (c.compute || {}).fp8TFLOPS != null ? Math.round(c.compute.fp8TFLOPS).toLocaleString('en-US') : '—'; }],
        ['TDP', function (c) { return c.tdpW != null ? c.tdpW + ' W' : '—'; }],
        ['Status', function (c) { return esc(c.status || '') + (c.shipping ? ' ' + esc(c.shipping) : ''); }]];
      var html = '<thead><tr>' + cols.map(function (c) { return '<th>' + c[0] + '</th>'; }).join('') + '</tr></thead><tbody>';
      this.chips.forEach(function (ch) { html += '<tr>' + cols.map(function (c) { return '<td>' + c[1](ch) + '</td>'; }).join('') + '</tr>'; });
      $('#compare').innerHTML = html + '</tbody>';
    }
  };

  /* ---------------- suppliers ---------------- */
  var Suppliers = {
    rows: DATA.suppliers || [], built: false, cat: null, country: '', chk: '', q: '', sortKey: 'name', sortDir: 1,
    activate: function () { if (!this.built) this.build(); },
    build: function () {
      this.built = true;
      var self = this, cats = {}, countries = {};
      this.rows.forEach(function (r) { cats[r.category] = (cats[r.category] || 0) + 1; countries[r.country] = (countries[r.country] || 0) + 1; });
      var chips = $('#sup-chips');
      chips.innerHTML = Object.keys(cats).sort().map(function (c) { return '<button type="button" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + '<b>' + cats[c] + '</b></button>'; }).join('');
      chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var c = b.getAttribute('data-cat'); self.cat = self.cat === c ? null : c; $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === self.cat ? 'true' : 'false'); }); self.render(); });
      var sel = $('#sup-country');
      Object.keys(countries).sort(function (a, b) { return countries[b] - countries[a]; }).forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = cname(c) + ' (' + countries[c] + ')'; sel.appendChild(o); });
      sel.addEventListener('change', function () { self.country = sel.value; self.render(); });
      $('#sup-chk').addEventListener('change', function (e) { self.chk = e.target.value; self.render(); });
      $('#sup-search').addEventListener('input', function (e) { self.q = e.target.value.trim().toLowerCase(); self.render(); });
      $('#sup-copy').addEventListener('click', function () { self.copy(); });
      $('#sup-table').addEventListener('click', function (e) { var b = e.target.closest('button[data-sort]'); if (!b) return; var k = b.getAttribute('data-sort'); if (self.sortKey === k) self.sortDir = -self.sortDir; else { self.sortKey = k; self.sortDir = 1; } self.render(); });
      this.render();
    },
    filtered: function () {
      var self = this, CHK = { Critical: 0, Important: 1, Contested: 2, Diversified: 3 };
      var out = this.rows.filter(function (r) {
        if (self.cat && r.category !== self.cat) return false;
        if (self.country && r.country !== self.country) return false;
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
      var rows = this.filtered(), self = this;
      var th = function (k, label) { return '<th><button type="button" data-sort="' + k + '"' + (self.sortKey === k ? ' aria-sort="' + (self.sortDir > 0 ? 'ascending' : 'descending') + '"' : '') + '>' + label + '</button></th>'; };
      var html = '<thead><tr>' + th('name', 'Supplier') + th('category', 'Category') + th('country', 'Country') + th('founded', 'Founded') + th('chokepoint', 'Chokepoint') + '<th>What they make and why it matters</th><th>Customers</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        html += '<tr><td class="name"><b>' + esc(r.name) + '</b><span>' + esc([r.nativeName, r.ticker].filter(Boolean).join(' · ')) + '</span></td>' +
          '<td>' + esc(r.category) + (r.subcategory ? '<br><span class="cc" style="color:var(--muted)">' + esc(r.subcategory) + '</span>' : '') + '</td>' +
          '<td><span class="cc">' + esc(r.country) + '</span> ' + esc(r.city || '') + '</td>' +
          '<td class="num">' + (r.founded || '—') + '</td>' +
          '<td><span class="chk ' + esc(r.chokepoint || '') + '">' + esc(r.chokepoint || '') + '</span>' + (r.shareNote ? '<br><span class="cc" style="color:var(--muted)">' + esc(r.shareNote) + '</span>' : '') + '</td>' +
          '<td class="role">' + esc(r.role || '') + (r.source ? ' <a href="' + esc(r.source) + '" target="_blank" rel="noopener" class="cc" aria-label="Source for ' + esc(r.name) + '">src</a>' : '') + '</td>' +
          '<td style="font-size:13px;color:var(--ink-2)">' + esc((r.customers || []).join(', ')) + '</td></tr>';
      });
      $('#sup-table').innerHTML = html + '</tbody>';
      $('#sup-count').textContent = 'Showing ' + rows.length + ' of ' + this.rows.length + ' suppliers' + (this.cat ? ' · ' + this.cat : '') + (this.country ? ' · ' + cname(this.country) : '');
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
    activate: function () {
      if (!this.built) this.build();
      Stage.show('globe', null, null, 'Geopolitics · <b>the map</b>');
      var sec = $('[data-view="geopolitics"]');
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
      $('#matrix').innerHTML = html + '</tbody>';
      $('#matrix-note').innerHTML = mx.length ? 'Metric and year are shown under each segment. ' + (DATA.matrixNotesHtml ? '' : '') + 'Sources are on the <a href="#/sources">Sources</a> page.' : 'Matrix data is not loaded.';
      // timeline
      var tl = (DATA.timeline || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      var cats = {}; tl.forEach(function (e) { cats[e.category] = (cats[e.category] || 0) + 1; });
      var self = this, chips = $('#tl-filters');
      chips.innerHTML = Object.keys(cats).map(function (c) { return '<button type="button" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + '<b>' + cats[c] + '</b></button>'; }).join('');
      chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var c = b.getAttribute('data-cat'); self.cat = self.cat === c ? null : c; $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === self.cat ? 'true' : 'false'); }); self.renderTimeline(tl); });
      this.renderTimeline(tl);
    },
    renderTimeline: function (tl) {
      var self = this, html = '', year = null;
      var cls = function (c) { c = c || ''; return /China/i.test(c) ? 'cn' : /Allied/i.test(c) ? 'ally' : /Industrial/i.test(c) ? 'policy' : /Corporate/i.test(c) ? 'corp' : ''; };
      tl.forEach(function (e) {
        if (self.cat && e.category !== self.cat) return;
        var y = (e.date || '').slice(0, 4);
        if (y !== year) { year = y; html += '<li style="border:0;display:block;padding:0"><div class="year-label">' + esc(y) + '</div></li>'; }
        var d = new Date(e.date + 'T00:00:00');
        var ds = isNaN(d) ? esc(e.date) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        html += '<li><div class="d"><b>' + ds + '</b>' + esc(e.actor || '') + '</div><div><span class="cat ' + cls(e.category) + '">' + esc(e.category || '') + '</span><h4>' + esc(e.title) + '</h4><p>' + esc(e.summary || '') + '</p>' + (e.source ? '<a class="src" href="' + esc(e.source) + '" target="_blank" rel="noopener">' + esc(e.source.replace(/^https?:\/\//, '').split('/')[0]) + '</a>' : '') + '</div></li>';
      });
      $('#timeline').innerHTML = html || '<li><p>No events in this category.</p></li>';
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
  /* ---------------- controls view: threshold map + China exposure (rendered only if the section exists) ---------------- */
  var Controls = {
    built: false,
    activate: function () { if (!this.built) this.build(); },
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
        var render = function () {
          var rows = th.filter(function (t) { return !sel || t.regime === sel; });
          tbl.innerHTML = '<thead><tr><th>Instrument</th><th>Scope</th><th>Threshold</th><th>Destinations and policy</th><th>Status</th><th>Source</th></tr></thead><tbody>' + rows.map(function (t) {
            var thr = (t.parameter ? esc(t.parameter) + ' ' : '') + (t.operator ? esc(t.operator) + ' ' : '') + (t.value != null ? '<b class="num">' + (typeof t.value === 'number' ? t.value.toLocaleString('en-US') : esc(t.value)) + '</b>' : '') + (t.unit ? ' <span class="cc">' + esc(t.unit) + '</span>' : '') + (t.alternative ? '<br><span class="cc" style="color:var(--muted)">' + esc(t.alternative) + '</span>' : '');
            var st = esc(t.status || ''), cls = /force/i.test(st) ? 'Critical' : /suspend/i.test(st) ? 'Contested' : /rescind|expired/i.test(st) ? 'Diversified' : 'Important';
            return '<tr><td class="name"><b>' + esc(t.instrument) + '</b><span>' + esc(t.regime) + (t.effectiveDate ? ' · from ' + esc(t.effectiveDate) : '') + '</span></td><td>' + esc(t.scope || '') + '</td><td>' + thr + '</td><td class="role">' + esc(t.destinations || '') + (t.licensePolicy ? '<br><span class="cc" style="color:var(--muted)">' + esc(t.licensePolicy) + '</span>' : '') + (t.note ? '<br>' + esc(t.note) : '') + '</td><td><span class="chk ' + cls + '">' + st + '</span>' + (t.amendedBy && t.amendedBy.length ? '<br><span class="cc" style="color:var(--muted)">amended ' + esc(t.amendedBy.join(', ')) + '</span>' : '') + '</td><td>' + (t.source ? '<a class="cc" href="' + esc(t.source) + '" target="_blank" rel="noopener">source</a>' : '') + '</td></tr>';
          }).join('') + '</tbody>';
          var c = $('#controls-count'); if (c) c.textContent = rows.length + ' of ' + th.length + ' thresholds';
        };
        render();
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
          return '<tr><td>' + esc(f) + '<small>' + esc(m.category || '') + ' · ' + esc(cname(m.country)) + (m.basis ? ' · ' + esc(m.basis) : '') + '</small></td>' + ys.map(function (y) { var r = firms[f][y]; if (!r || r.chinaShare == null) return '<td><span class="cell zero">·</span></td>'; return '<td><a class="cell" style="--v:' + Math.round(Math.min(100, r.chinaShare) * 1.6) + '" href="' + esc(r.source) + '" target="_blank" rel="noopener" title="' + esc((r.chinaRevenue != null ? r.chinaRevenue.toLocaleString('en-US') + ' of ' + (r.totalRevenue || 0).toLocaleString('en-US') + ' ' + (r.currency || '') : '') + (r.note ? ' · ' + r.note : '')) + '">' + r.chinaShare.toFixed(1) + '%</a></td>'; }).join('') + '</tr>';
        }).join('') + '</tbody>';
      }
    }
  };

  /* ---------------- research tools: search, permalinks, dataset export, citation ---------------- */
  var Tools = {
    index: null,
    buildIndex: function () {
      if (this.index) return this.index;
      var idx = [];
      $$('[data-view="stack"] .chapter').forEach(function (ch) {
        var title = (ch.querySelector('.chapter-title') || {}).textContent || ch.id;
        idx.push({ kind: 'Chapter', title: title.replace(/^Chapter \d+: /, ''), text: (ch.querySelector('.chapter-lede') || {}).textContent || '', href: '#' + ch.id });
        $$('.prose h3[id], .prose h4[id]', ch).forEach(function (h) {
          var t = '', p = h.nextElementSibling;
          while (p && !/^H[1-4]$/.test(p.tagName) && t.length < 900) { if (/^(P|DIV|UL|OL|TABLE)$/.test(p.tagName)) t += ' ' + p.textContent; p = p.nextElementSibling; }
          idx.push({ kind: title.replace(/^Chapter \d+: /, ''), title: h.textContent.replace(/#$/, ''), text: t.replace(/\s+/g, ' ').trim().slice(0, 900), href: '#' + h.id });
        });
      });
      (DATA.chapters || []).filter(function (c) { return c.id === 'geopolitics'; }).forEach(function () { idx.push({ kind: 'Essay', title: 'Geopolitics', text: 'Who holds each chokepoint, the export-control campaign, China\'s response, the Gulf and smuggling.', href: '#/geopolitics' }); });
      $$('#glossary .gl-entry').forEach(function (el) { idx.push({ kind: 'Glossary', title: el.querySelector('dt').firstChild.textContent, text: el.querySelector('dd p').textContent, href: '#/glossary', el: el }); });
      (DATA.suppliers || []).forEach(function (r) { idx.push({ kind: 'Supplier', title: r.name, text: r.category + ' · ' + cname(r.country) + (r.role ? ' · ' + r.role : ''), href: '#/suppliers', q: r.name }); });
      (DATA.landscape || []).forEach(function (c) { idx.push({ kind: 'Chip', title: c.vendor + ' ' + c.name, text: ((c.process || {}).node || '') + ' · ' + ((c.memory || {}).type || '') + ' · ' + (c.status || ''), href: '#/landscape', chip: c.id }); });
      (DATA.timeline || []).forEach(function (e) { idx.push({ kind: 'Event ' + e.date, title: e.title, text: e.summary || '', href: '#/geopolitics' }); });
      (DATA.controls || []).forEach(function (t) { idx.push({ kind: 'Control', title: t.instrument + (t.parameter ? ' · ' + t.parameter : ''), text: [t.scope, t.destinations, t.note].filter(Boolean).join(' · '), href: '#/controls' }); });
      (DATA.exposure || []).forEach(function (r) { if (r.chinaShare != null) idx.push({ kind: 'Exposure', title: r.firm + ' ' + r.fiscalYear, text: 'China ' + r.chinaShare + '% of revenue' + (r.basis ? ' · ' + r.basis : ''), href: '#/controls' }); });
      idx.forEach(function (i) { i.hay = (i.kind + ' ' + i.title + ' ' + i.text).toLowerCase(); });
      this.index = idx; return idx;
    },
    open: function () {
      var self = this, box = $('#cp-search');
      if (!box) {
        box = document.createElement('div'); box.id = 'cp-search'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Search the site');
        box.innerHTML = '<div class="cp-search-panel"><input type="search" placeholder="Search chapters, glossary, suppliers, chips, events…" aria-label="Search"><ol class="cp-search-results"></ol><p class="cp-search-hint">Type to search · Enter opens the first result · Esc closes</p></div>';
        document.body.appendChild(box);
        var inp = $('input', box), list = $('ol', box);
        box.addEventListener('click', function (e) { if (e.target === box) self.close(); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Escape') self.close(); if (e.key === 'Enter') { var a = list.querySelector('a'); if (a) a.click(); } });
        inp.addEventListener('input', function () {
          var q = inp.value.trim().toLowerCase(), terms = q.split(/\s+/).filter(Boolean);
          if (!terms.length) { list.innerHTML = ''; return; }
          var hits = self.buildIndex().filter(function (i) { return terms.every(function (t) { return i.hay.indexOf(t) >= 0; }); }).slice(0, 14);
          list.innerHTML = hits.map(function (h, k) { return '<li><a href="' + esc(h.href) + '" data-k="' + k + '"><span class="k">' + esc(h.kind) + '</span><b>' + esc(h.title) + '</b><span class="t">' + esc(h.text.slice(0, 140)) + '</span></a></li>'; }).join('') || '<li class="none">Nothing matches.</li>';
          list.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { var h = hits[+a.getAttribute('data-k')]; self.close(); if (h.chip) setTimeout(function () { Landscape.select(h.chip); }, 60); if (h.q) setTimeout(function () { var s = $('#sup-search'); if (s) { s.value = h.q; s.dispatchEvent(new Event('input')); } }, 60); if (h.el) setTimeout(function () { h.el.scrollIntoView({ block: 'center' }); }, 60); }); });
        });
      }
      box.hidden = false; $('input', box).value = ''; $('ol', box).innerHTML = ''; $('input', box).focus();
    },
    close: function () { var box = $('#cp-search'); if (box) box.hidden = true; },
    init: function () {
      var self = this;
      // search button in the masthead
      var nav = $('.tabs'), btn = document.createElement('button'); btn.type = 'button'; btn.className = 'search-btn'; btn.setAttribute('aria-label', 'Search'); btn.title = 'Search (Ctrl+K)';
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
      btn.addEventListener('click', function () { self.open(); });
      if (nav) nav.insertBefore(btn, $('.theme-toggle'));
      document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); self.open(); } if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); self.open(); } });
      // heading permalinks
      $$('.prose h3[id], .prose h4[id]').forEach(function (h) { var a = document.createElement('a'); a.className = 'permalink'; a.href = '#' + h.id; a.setAttribute('aria-label', 'Link to this section'); a.textContent = '#'; h.appendChild(a); });
      // dataset export buttons (copy to clipboard: JSON or CSV)
      var copy = function (text, btn, label) { var done = function (ok) { btn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { btn.textContent = label; }, 2000); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false); };
      var toCSV = function (rows) { if (!rows.length) return ''; var cols = Object.keys(rows[0]); var q = function (v) { if (v == null) return ''; if (typeof v === 'object') v = JSON.stringify(v); v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }; return cols.join(',') + '\n' + rows.map(function (r) { return cols.map(function (c) { return q(r[c]); }).join(','); }).join('\n'); };
      var addExport = function (anchorSel, name, rows, where) {
        var host = $(anchorSel); if (!host || !rows || !rows.length) return;
        var bar = document.createElement('div'); bar.className = 'export-bar';
        bar.innerHTML = '<span class="count">' + rows.length + ' rows · ' + esc(name) + '</span><button type="button" class="btn ghost">Copy as CSV</button><button type="button" class="btn ghost">Copy as JSON</button>';
        var b = bar.querySelectorAll('button');
        b[0].addEventListener('click', function () { copy(toCSV(rows), b[0], 'Copy as CSV'); });
        b[1].addEventListener('click', function () { copy(JSON.stringify(rows, null, 1), b[1], 'Copy as JSON'); });
        if (where === 'after') host.insertAdjacentElement('afterend', bar); else host.insertAdjacentElement('beforebegin', bar);
      };
      addExport('#compare', 'accelerators', DATA.landscape, 'before');
      addExport('#matrix', 'country-share matrix', DATA.matrix, 'before');
      addExport('#timeline', 'export-control timeline', DATA.timeline, 'before');
      addExport('#controls-table', 'control thresholds', DATA.controls, 'before');
      addExport('#exposure-table', 'China exposure by firm and year', DATA.exposure, 'before');
      // cite-this block in the footer
      var foot = $('.site-footer');
      if (foot) { var d = new Date().toISOString().slice(0, 10); foot.insertAdjacentHTML('beforeend', '<details class="cite"><summary>Cite this site</summary><pre>Sharma, Y. with Claude. Chokepoints: a deep dive on the AI chip supply chain. September 2026. https://yashvardhansharmaa.github.io/chokepoints/ (accessed ' + d + ').</pre><pre>@misc{chokepoints2026,\n  title  = {Chokepoints: a deep dive on the AI chip supply chain},\n  author = {Sharma, Yashvardhan and Claude},\n  year   = {2026},\n  month  = {September},\n  url    = {https://yashvardhansharmaa.github.io/chokepoints/},\n  note   = {Accessed ' + d + '}\n}</pre></details>'); }
    }
  };

  function boot() {
    Theme.init();
    Glossary.init();
    Tools.init();
    Stage.init();
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
