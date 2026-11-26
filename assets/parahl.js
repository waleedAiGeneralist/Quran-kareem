/* v4.9: پارہ صفحات کا لفظ ہائی لائٹر — 🖍️ دبا کر آن کریں؛ ۱ = ایک لفظ، ۲ = دو ساتھ والے الفاظ؛
   اگلا / پچھلا سے پڑھنے کی ترتیب میں (دائیں سے بائیں، سطر بہ سطر، صفحہ بہ صفحہ) ایک ایک لفظ آگے پیچھے۔
   الفاظ کے ڈبے assets/qw/para-NN.js میں ہیں (اسکین کی تصویر کے پکسلز میں)۔ ہائی لائٹر بند ہو تو آیت والا
   پرانا ہائی لائٹ (para.js) ویسے ہی چلتا ہے۔ */
(function () {
  "use strict";
  var Q = window.QK, D = window.QKW, I = window.QK_I18N;
  if (!Q || !D || !Q.pages) return;
  var NS = "http://www.w3.org/2000/svg";
  var W = [];                 // reading order: {p, x0, x1, y0, y1}
  var byPage = {};            // page index -> [word index...]
  Q.pages.forEach(function (pg, p) {
    var L = D[String(+pg.img)] || []; byPage[p] = [];
    L.forEach(function (b) { byPage[p].push(W.length); W.push({ p: p, x0: b[0], x1: b[1], y0: b[2], y1: b[3] }); });
  });
  if (!W.length) return;

  var on = false, mode = 1, start = -1;
  try { mode = localStorage.getItem("qk-hl-mode") === "2" ? 2 : 1; } catch (e) {}

  function layer(p) {
    var pgEl = document.getElementById("pg" + p); if (!pgEl) return null;
    var svg = pgEl.querySelector("svg"); if (!svg) return null;
    var g = svg.querySelector("g.qwhl");
    if (!g) { g = document.createElementNS(NS, "g"); g.setAttribute("class", "qwhl"); svg.appendChild(g); }
    return g;
  }
  function clearPaint() { Array.prototype.forEach.call(document.querySelectorAll("g.qwhl"), function (g) { g.textContent = ""; }); }
  function rect(w, second) {
    var g = layer(w.p); if (!g) return null;
    var r = document.createElementNS(NS, "rect");
    r.setAttribute("x", w.x0 - 3); r.setAttribute("y", w.y0 + 3);
    r.setAttribute("width", Math.max(6, w.x1 - w.x0 + 6)); r.setAttribute("height", Math.max(6, w.y1 - w.y0 - 6));
    r.setAttribute("rx", 7); r.setAttribute("class", second ? "qw2" : "qw1");
    g.appendChild(r); return r;
  }
  function reveal(r) {
    if (!r) return;
    var b = r.getBoundingClientRect(), hdr = document.getElementById("hdr");
    var top = (hdr && !document.documentElement.classList.contains("hdr-off") ? hdr.getBoundingClientRect().bottom : 0) + 16;
    var bot = window.innerHeight - 96;
    if (b.top < top || b.bottom > bot) {
      var mid = top + (bot - top) * 0.4;
      window.scrollTo({ top: Math.max(0, window.pageYOffset + b.top - mid), behavior: "smooth" });
    }
    var wrap = document.getElementById("wrap");
    if (wrap && wrap.scrollWidth > wrap.clientWidth + 2) {
      var wr = wrap.getBoundingClientRect();
      if (b.left < wr.left + 8 || b.right > wr.right - 8) wrap.scrollLeft += (b.left + b.right) / 2 - (wr.left + wr.right) / 2;
    }
  }
  function paint(scroll) {
    clearPaint();
    bar.classList.toggle("active", start >= 0);
    if (start < 0) return;
    var first = null;
    for (var k = 0; k < mode && start + k < W.length; k++) { var r = rect(W[start + k], k > 0); if (!k) first = r; }
    if (scroll) reveal(first);
  }
  function setOn(v, quiet) {
    on = v; document.body.classList.toggle("qwhl-on", on);
    pen.setAttribute("aria-pressed", on ? "true" : "false");
    if (!on) { start = -1; paint(false); }
    if (!quiet) toast(on ? "x_qhl_on" : "x_qhl_off");
  }
  function firstVisible() {
    var hdr = document.getElementById("hdr"), top = hdr ? hdr.getBoundingClientRect().bottom : 0;
    for (var p = 0; p < Q.pages.length; p++) {
      var el = document.getElementById("pg" + p); if (!el || !byPage[p].length) continue;
      var r = el.getBoundingClientRect(); if (r.bottom <= top + 10) continue;
      var y = (top + 10 - r.top) / r.height * Q.pages[p].H, ids = byPage[p];
      for (var i = 0; i < ids.length; i++) if (W[ids[i]].y1 > y) return ids[i];
      return ids[0];
    }
    return 0;
  }
  function go(d) {
    if (!on) setOn(true, true);
    if (start < 0) start = firstVisible();
    else start = Math.max(0, Math.min(W.length - 1, start + d));   // word by word, also in 2-word mode
    paint(true);
  }
  function setMode(m) {
    mode = m; try { localStorage.setItem("qk-hl-mode", String(m)); } catch (e) {}
    b1.setAttribute("aria-pressed", m === 1 ? "true" : "false"); b2.setAttribute("aria-pressed", m === 2 ? "true" : "false");
    paint(false);
  }
  function hitAt(p, x, y) {
    var ids = byPage[p] || [], best = -1, bd = 1e9;
    for (var i = 0; i < ids.length; i++) {
      var w = W[ids[i]];
      if (y < w.y0 || y > w.y1) continue;
      var dx = x < w.x0 ? w.x0 - x : (x > w.x1 ? x - w.x1 : 0);
      if (dx < bd) { bd = dx; best = ids[i]; }
    }
    return bd <= 24 ? best : -1;
  }
  // capture phase on #wrap: only while the highlighter is on, so para.js (ayah / word tracking) is untouched otherwise
  var wrapEl = document.getElementById("wrap");
  if (wrapEl) wrapEl.addEventListener("click", function (e) {
    if (!on) return;
    var pg = e.target.closest ? e.target.closest(".pg") : null; if (!pg) return;
    e.stopPropagation(); e.preventDefault();
    var p = +pg.id.slice(2), r = pg.getBoundingClientRect(), page = Q.pages[p];
    var x = (e.clientX - r.left) / r.width * page.W, y = (e.clientY - r.top) / r.height * page.H;
    var i = hitAt(p, x, y); if (i < 0) return;
    start = (i === start) ? -1 : i; paint(false);
  }, true);

  function toast(key) {
    var t = document.getElementById("toast"); if (!t || !I) return;
    t.textContent = I.t(key); t.classList.add("show");
    clearTimeout(toast.h); toast.h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  var bar = document.createElement("div");
  bar.className = "hlbar qwbar notranslate"; bar.setAttribute("translate", "no"); bar.setAttribute("role", "toolbar");
  bar.setAttribute("aria-label", "ہائی لائٹر"); bar.setAttribute("data-i18n-aria-label", "x_hl_group");
  function btn(cls, html, key, title, fn) {
    var b = document.createElement("button"); b.type = "button"; b.className = cls; b.innerHTML = html;
    b.title = title; b.setAttribute("aria-label", title);
    b.setAttribute("data-i18n-title", key); b.setAttribute("data-i18n-aria-label", key);
    b.addEventListener("click", fn); bar.appendChild(b); return b;
  }
  var pen = btn("hlpen", '<span aria-hidden="true">🖍️</span>', "x_qhl_pen", "ہائی لائٹر آن / بند", function () { setOn(!on); });
  var b1 = btn("hlm", "1", "x_hl_1", "ایک لفظ", function () { if (!on) setOn(true, true); setMode(1); });
  var b2 = btn("hlm", "2", "x_hl_2", "دو الفاظ", function () { if (!on) setOn(true, true); setMode(2); });
  btn("hlnav prev", "<span>›</span>", "x_hl_prev", "پچھلا", function () { go(-1); });
  btn("hlnav next", "<span>‹</span>", "x_hl_next", "اگلا", function () { go(1); });
  btn("hlclr", "✕", "x_hl_clear", "صاف کریں", function () { start = -1; paint(false); });
  document.body.appendChild(bar); document.body.classList.add("has-hlbar");
  if (I && I.apply) I.apply(bar);
  setMode(mode); setOn(false, true);

  document.addEventListener("keydown", function (e) {
    if (!on || start < 0 || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
    var rtl = document.documentElement.dir !== "ltr", k = e.key, d = 0;
    if (k === "ArrowLeft") d = rtl ? 1 : -1; else if (k === "ArrowRight") d = rtl ? -1 : 1;
    else if (k === " " || k === "ArrowDown") d = 1; else if (k === "Backspace" || k === "ArrowUp") d = -1;
    if (d) { e.preventDefault(); e.stopPropagation(); go(d); }
    else if (k === "Escape") { e.stopPropagation(); start = -1; paint(false); }
  }, true);
  window.QK_QW = { count: W.length, state: function () { return { on: on, mode: mode, start: start, w: start >= 0 ? W[start] : null }; },
                   select: function (i) { if (!on) setOn(true, true); start = i; paint(true); }, go: go,
                   find: function (img, r) { var p = Q.pages.findIndex(function (pg) { return +pg.img === +img; }); return byPage[p] || []; } };
})();
