/* The Introduction's page, introduction/ (23 Nov 2026; built into the site from the approved mock,
   dist/mock/home2/introduction/_src/intro.js on the plates-polish worktree).
   Its specimens carry their chapters' labels (owner, 23 Nov 2026: "the labeling of 1, 2, 3, 4 really helps make it more
   visual and clearer what's going on, so add that to the introduction page specimen as well"). The walk's specimen is the
   page's live plate (src/app.js Stage): beside
   the walk on a wide screen, in the phone's strip once opened. The home drew it bare (Stage.mode: no labels, no dimensions);
   here it carries its chapter's labels, laid out by the plate kit for the stage's own width as the chapter's slot does (in two
   columns, or under 560 px in a row above the drawing and a row under it), and its numbered parts take the names the
   chapter's parts list gives them (the step's data-parts, which build/modules/walk.js writes from data/specimen-parts.json,
   label else name, as build/build.js writes a chapter's), with the chapter's dimensions. On the
   phone's opened strip the numbers come with their names, in rows, and the one main size, as the chapter's strip shows it
   (the chapter's strip names its numbers in the parts list under the drawing; the walk has no parts list).
   Drag-to-turn, the labels fading while it turns, the arrow keys and reduced motion are the Stage's own, unchanged.
   On a wide screen the specimen stands as the live home's did (24 Nov 2026, owner: "why can't we have it the same way we have
   specimen on the live home page now? similarly aligned and rotating on the center right?"): in the fixed panel right of the
   text, centred in it across and up and down (src/modules/intro.css), at about the live home's size, and each plate turns in
   slowly as its stage comes on, then settles and shows its labels (turnIn, below). */
(function () {
  'use strict';
  var CP = window.CP, S = CP && CP.Stage;
  if (!S || S._introLabels || !CP.page || CP.page.kind !== 'introduction') return; // the Introduction's page alone
  S._introLabels = true;
  // the names of a specimen's numbered parts, from the walk's step that shows it
  var partsOf = function (name) {
    var el = name ? document.querySelector('.view[data-view="walk"] .wk-step[data-parts][data-specimen="' + name + '"]') : null, v = null;
    try { v = el ? JSON.parse(el.getAttribute('data-parts')) : null; } catch (e) { v = null; }
    return v;
  };
  var mode0 = S.mode;
  S.mode = function () {
    if (this.hostEl) return mode0.call(this); // (a chapter's own slot: as before)
    return CP.narrow() ? { oneDim: true } : {}; // (the phone's opened strip: its one main size, as the chapter's strip shows)
  };
  /* the specimen's tag stands on the drawing's foot (Stage.frame sets --slack from pl.foot()); with a row of labels under the
     drawing the foot is the lower of the drawing and that row, so the tag never rides up over the labels. The row's foot is
     kept from the last frame that drew the labels, so the tag stays put while the plate is turned and the labels fade.
     Captions and loupes (23 Nov 2026): the foot takes the loupe too. Up to about 1500 px wide the panel is narrower than 560 px,
     so the plate kit sets a loupe's disc in the canvas's foot corner, under the row of labels, with its caption beside it (as
     the chapter's own strip does on a phone); the foot was the drawing's and its labels', so the tag and the caption rose over
     the disc (owner, plates 05 and 09). Wider, the disc takes the top of its label column, as on the chapter's page, and the
     foot is the drawing's. The loupe's box comes from the kit's own geometry (PL.loupeGeom), so it holds while the plate turns
     and the disc fades with the labels */
  function loupeFoot(pl) {
    if (!pl.loupeOn || !pl.loupeOn() || !pl.w || !pl.h) return null;
    var G = pl.loupeGeom(pl.w, pl.h);
    if (!G) return null;
    var b = G.y + G.r + 2, n = (G.cap || []).length;
    // its caption: beside the disc (on its middle, or capDy px off it), over it, or under it, in 16 px lines (src/plate.js drawLoupe)
    if (n && G.capSide !== 't') {
      if (G.capSide) b = Math.max(b, G.y + (G.capDy || 0) + (n - 1) * 8 + 8);
      else b = Math.max(b, G.y + G.r + 16 + (n - 1) * 16 + 6);
    }
    return b;
  }
  function footWithLabels(pl) {
    if (pl._introFoot) return;
    pl._introFoot = true;
    var foot0 = pl.foot;
    pl.foot = function () {
      var f = foot0.call(this);
      if (f == null) return f;
      var h = this._hit;
      if (h && h.length) { var m = -Infinity; h.forEach(function (b) { m = Math.max(m, b.y1 - 4); }); this._labFoot = m; this._labKey = this._fitKey; }
      if (this._labFoot != null && this._labKey === this._fitKey) f = Math.max(f, this._labFoot);
      var lf = loupeFoot(this);
      return lf == null ? f : Math.max(f, lf);
    };
  }
  /* the canvas beside the walk was a square; with labels it takes the height the plate asks for at the stage's width, as a
     chapter's slot does (Stage.fit: pl.heightFor, trimmed to the drawing), up to what the window leaves above the tag and the
     caption, so a tall plate is not shrunk to make room for its rows of labels. At most it is as tall as it is wide, the live
     home's square canvas (24 Nov 2026; it was held to 560 px, from a panel narrower than the live home's) */
  var fit0 = S.fit;
  S.fit = function () {
    fit0.call(this);
    if (this.hostEl || !this.ok || !this.cur || !this.fig || CP.narrow()) return;
    var pl = this.cur.pl, cv = this.canvas, w = cv.getBoundingClientRect().width;
    if (!w) return;
    var fig = this.fig, tag = fig.querySelector('.stage-tag'), cap = fig.querySelector('figcaption');
    var fcs = getComputedStyle(fig);
    var avail = fig.clientHeight - parseFloat(fcs.paddingTop) - parseFloat(fcs.paddingBottom) - (tag ? tag.offsetHeight : 0) - (cap ? cap.offsetHeight + parseFloat(getComputedStyle(cap).marginBottom) : 0) - 8;
    if (pl._growW !== Math.round(w)) { pl._growW = Math.round(w); pl._introGrow = 0; pl._introGrowX = 0; } // (a new width is read afresh)
    var hi = Math.max(240, Math.min(Math.round(w), avail)), grow = pl._introGrow || 0;
    pl.mode(this.mode());
    // (grown by edgeRoom, below, the canvas keeps within hi: a plate the height limits gives up that much of its drawing's height)
    var hh = pl.heightFor(w, 220, hi - grow) + grow;
    this.dry(pl, w, hh);
    var h = pl.heightFor(w, 220, hi - grow) + grow + 'px';
    if (cv.style.height !== h) cv.style.height = h;
  };
  /* The specimen changes as a step's top crosses the walk's reading line, the line the rail and the ledger's wine number follow
     (src/modules/walk.js line: the masthead and 62 px, or 8 px under the place a step lands), so the specimen, the rail and the
     stage number change together (24 Nov 2026; it changed at 42 percent of the window) */
  var Sec = CP.Sections;
  var onWalk = function () { return !!(CP.Router && CP.Router.current === 'walk') && !CP.narrow(); };
  var firstStep = function () { return document.querySelector('.view[data-view="walk"] .wk-step'); };
  if (Sec) Sec.probeAt = function () {
    if (!onWalk()) return null;
    var st = firstStep(), mh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead')) || 56;
    return Math.max(mh + 62, (st ? CP.landAt(st) : 0) + 8);
  };
  /* The turn (24 Nov 2026, owner: "rotating on the center right", as the live home's specimen turned slowly on its own). A
     plate's numbered labels are laid out for its drawn view, and the Stage fades them while the plate stands more than about
     4 degrees off it, so a plate that never stopped turning would never show them. The calmest way to keep both: each plate
     turns in slowly as its stage comes on, from TURN_IN.yaw off its drawn view, with no labels, and eases to rest; once it is
     at rest its labels are laid out for its drawn view and draw on (Stage.holdLabels keeps them back until then, so none is
     drawn in a place it then leaves), and it holds still while the stage is read, so a settled plate costs nothing to keep on
     screen. The turn lasts TURN_IN.ms, under the five seconds after which moving content needs a pause control (WCAG 2.2.2).
     The globe (chapter 16) keeps its own slow spin, its labels following its pins. A drag or the arrow keys take the plate from
     the turn at once; reduced motion never turns it, and the phone's strip is as it was. */
  var TURN_IN = { yaw: -28 * Math.PI / 180, ms: 3200 };
  var calm = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  function turnIn(st) {
    st._turnIn = null; st.holdLabels = false;
    if (st.hostEl || CP.narrow() || calm() || !st.cur || st.cur.spin || !onWalk()) return;
    var lim = st.limits().yaw;
    st._turnIn = { t0: 0, yaw: TURN_IN.yaw < 0 ? -Math.min(-TURN_IN.yaw, lim * 0.9) : Math.min(TURN_IN.yaw, lim * 0.9), ms: TURN_IN.ms };
    st.userYaw = st.rawYaw = st._turnIn.yaw; st.labA = 0; st.holdLabels = true; // (from its first frame: no labels flash at the drawn view first)
    st.wake();
  }
  var show0 = S.show;
  S.show = function () {
    var was = this.cur;
    show0.apply(this, arguments);
    if (this.cur && this.cur !== was) turnIn(this);
  };
  function turning(st) {
    var ti = st._turnIn;
    if (!ti) return;
    // (the reader's hand takes the plate from the turn: on release it eases back as a drag does)
    if (st.dragging || st.keyTurn || st.hostEl || CP.narrow()) { st._turnIn = null; st.holdLabels = false; return; }
    if (!st.showing()) return; // (the clock starts on the turn's first frame on screen)
    var now = performance.now();
    if (!ti.t0) ti.t0 = now;
    var u = (now - ti.t0) / ti.ms;
    if (u >= 1) { st._turnIn = null; st.holdLabels = false; st.userYaw = st.rawYaw = 0; st.back = null; return; }
    st.back = null; st.userYaw = st.rawYaw = ti.yaw * (1 + Math.cos(Math.PI * u)) / 2; // (a sine ease: it starts and ends at rest)
  }
  /* Captions and loupes (23 Nov 2026): a plate trimmed to its drawing at the panel's width keeps 8 px under it (src/plate.js
     PAD_Y), and a dimension too short for its arrows sets them outside, pointing in, past that pad: at 1920 the photomask's
     6.35 mm arrow ran off the canvas's foot (on v3 too; the chapter's taller slot leaves it room). Once a plate rests with its
     labels in, its canvas's outer rows are read, and while any is drawn on, the canvas grows 8 px (centred, so 4 a side; at most
     48), so every dimension, label and loupe stays inside the panel's drawing area.
     A plate the height limits (its canvas already the tallest the panel allows) keeps its canvas, and its drawing is fitted that
     much shorter and centred in it (fitInside, 24 Nov 2026: at 2560 px the photomask, drawn at 560 px, touched the canvas's foot
     however far the canvas was meant to grow).
     Ink at a side (the canvas cannot grow sideways) draws the plate 8 px narrower about the canvas's centre, at most 48, with its
     labels following it (_introGrowX, 24 Nov 2026: at 1680 px, on the 574 px canvas the centred panel gives, the cost column's
     "about $6,400" reached the canvas's left edge). Ink counts within 2 px of an edge, since the copy read (restDrawn) is drawn
     by the processor and its anti-aliasing can differ from the screen's by a pixel. */
  function fitInside(pl) {
    if (pl._introFit) return;
    pl._introFit = true;
    var fitK = pl.fit;
    pl.fit = function (w, h, g) {
      var off = S.hostEl || CP.narrow(), gr = off ? 0 : this._introGrow || 0, gx = off ? 0 : this._introGrowX || 0, o;
      if (!gr || h - gr < 120) o = fitK.call(this, w, h, g);
      else { o = fitK.call(this, w, h - gr, g); if (o) o.cy += gr / 2; }
      if (o && gx) { var k = Math.max(0.8, (w - gx) / w); o.s *= k; o.cx = w / 2 + (o.cx - w / 2) * k; o.cy = h / 2 + (o.cy - h / 2) * k; }
      return o;
    };
  }
  /* (the rows are read from the plate at rest drawn once into an unseen canvas kept for reading, never from the canvas on
     screen: after the turn-in's frames, reading the screen's canvas waits for the graphics card to finish drawing every one of
     them, 5 s in headless Chrome, 24 Nov 2026) */
  var probe = null;
  function restDrawn(S, pl) {
    var W = S.canvas.width, H = S.canvas.height;
    if (!probe) probe = document.createElement('canvas');
    if (probe.width !== W) probe.width = W;
    if (probe.height !== H) probe.height = H;
    var pc = probe.getContext('2d', { willReadFrequently: true }), wf = pl.wantsFrame;
    pl.render(pc, S.w, S.h, S.dpr, { k: 1, mode: S.mode(), dark: S.dark, el: S.canvas, dyaw: S.spinYaw || 0, labA: 1 });
    pl.wantsFrame = wf;
    return pc;
  }
  function edgeRoom(S) {
    var pl = S.cur && S.cur.pl;
    if (!pl || S.hostEl || CP.narrow() || !S.w || !S.h || S.inK() < 1 || S.labA < 1 || S.userYaw || S.userPitch || S.back || S.snap || S.dragging) return;
    var key = pl._fitKey + '|' + Math.round(S.h) + '|' + (pl._introGrow || 0) + '|' + (pl._introGrowX || 0);
    if (pl._edgeKey === key) return;
    pl._edgeKey = key;
    try {
      var pc = restDrawn(S, pl), W = probe.width, H = probe.height, n = 2 * Math.max(1, Math.round(S.dpr));
      var ink = function (x, y, w, h) { var d = pc.getImageData(x, y, w, h).data; for (var i = 3; i < d.length; i += 4) if (d[i] > 24) return true; return false; };
      if ((ink(0, H - n, W, n) || ink(0, 0, W, n)) && (pl._introGrow || 0) < 48) { pl._introGrow = (pl._introGrow || 0) + 8; pl._fitKey = null; S.fit(); S.wake(); }
      else if ((ink(0, 0, n, H) || ink(W - n, 0, n, H)) && (pl._introGrowX || 0) < 48) { pl._introGrowX = (pl._introGrowX || 0) + 8; pl._fitKey = null; S.fit(); S.wake(); }
    } catch (e) { }
  }
  var frame0 = S.frame;
  S.frame = function (t) { turning(this); frame0.call(this, t); if (this._turnIn) this.wake(); edgeRoom(this); };
  var read0 = S.readParts;
  S.readParts = function () {
    read0.call(this);
    var name = this.cur && this.cur.name;
    if (this.hostEl || !this.cur) return;
    var ps = this.parts ? null : partsOf(name);
    if (ps) this.cur.pl.names(ps);
    footWithLabels(this.cur.pl);
    fitInside(this.cur.pl);
  };
})();
