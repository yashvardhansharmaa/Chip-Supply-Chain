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
   Drag-to-turn, the labels fading while it turns, the arrow keys and reduced motion are the Stage's own, unchanged. */
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
     caption, so a tall plate is not shrunk to make room for its rows of labels */
  var fit0 = S.fit;
  S.fit = function () {
    fit0.call(this);
    if (this.hostEl || !this.ok || !this.cur || !this.fig || CP.narrow()) return;
    var pl = this.cur.pl, cv = this.canvas, w = cv.getBoundingClientRect().width;
    if (!w) return;
    var fig = this.fig, tag = fig.querySelector('.stage-tag'), cap = fig.querySelector('figcaption');
    var avail = fig.clientHeight - parseFloat(getComputedStyle(fig).paddingTop) - (tag ? tag.offsetHeight : 0) - (cap ? cap.offsetHeight + parseFloat(getComputedStyle(cap).marginBottom) : 0) - 8;
    if (pl._growW !== Math.round(w)) { pl._growW = Math.round(w); pl._introGrow = 0; } // (a new width is read afresh)
    var hi = Math.max(240, Math.min(560, avail)), grow = pl._introGrow || 0;
    pl.mode(this.mode());
    // (grown by edgeRoom, below, the canvas keeps within hi: a plate the height limits gives up that much of its drawing's height)
    var hh = pl.heightFor(w, 220, hi - grow) + grow;
    this.dry(pl, w, hh);
    var h = pl.heightFor(w, 220, hi - grow) + grow + 'px';
    if (cv.style.height !== h) cv.style.height = h;
  };
  /* Captions and loupes (23 Nov 2026): a plate trimmed to its drawing at the panel's width keeps 8 px under it (src/plate.js
     PAD_Y), and a dimension too short for its arrows sets them outside, pointing in, past that pad: at 1920 the photomask's
     6.35 mm arrow ran off the canvas's foot (on v3 too; the chapter's taller slot leaves it room). Once a plate rests with its
     labels in, its canvas's outer rows are read, and while any is drawn on, the canvas grows 8 px (centred, so 4 a side; at most
     48), so every dimension, label and loupe stays inside the panel's drawing area */
  function edgeRoom(S) {
    var pl = S.cur && S.cur.pl;
    if (!pl || S.hostEl || CP.narrow() || !S.w || !S.h || S.inK() < 1 || S.labA < 1 || S.userYaw || S.userPitch || S.back || S.snap || S.dragging) return;
    var key = pl._fitKey + '|' + Math.round(S.h);
    if (pl._edgeKey === key) return;
    pl._edgeKey = key;
    try {
      var c = S.canvas, W = c.width, H = c.height, n = Math.max(1, Math.round(S.dpr)), ink = function (y) { var d = S.ctx.getImageData(0, y, W, n).data; for (var i = 3; i < d.length; i += 4) if (d[i] > 24) return true; return false; };
      if ((ink(H - n) || ink(0)) && (pl._introGrow || 0) < 48) { pl._introGrow = (pl._introGrow || 0) + 8; S.fit(); S.wake(); }
    } catch (e) { }
  }
  var frame0 = S.frame;
  S.frame = function (t) { frame0.call(this, t); edgeRoom(this); };
  var read0 = S.readParts;
  S.readParts = function () {
    read0.call(this);
    var name = this.cur && this.cur.name;
    if (this.hostEl || !this.cur) return;
    var ps = this.parts ? null : partsOf(name);
    if (ps) this.cur.pl.names(ps);
    footWithLabels(this.cur.pl);
  };
})();
