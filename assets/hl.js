/* v4.3 / v5.0: لفظ ہائی لائٹر — عربی متن کے الفاظ پر ٹیپ کریں؛ ۱ سے ۴ الفاظ؛ اگلا / پچھلا / صاف۔
   متن کے حروف نہیں بدلتے: صرف ٹیکسٹ نوڈز کو <span> میں لپیٹا جاتا ہے۔ */
(function () {
  "use strict";
  var SEL = ".kalbox, .nar, .nm-allah, .qv, .nb-open, .rar, .chm, .hdut, .hdent, .eidtx";
  var LETTER = /[\u0621-\u064A\u066E-\u06D3\u06D5\u06FA-\u06FC\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFA-Za-z]/;
  var roots = document.querySelectorAll("main " + SEL.split(", ").join(", main "));
  if (!roots.length) return;
  var words = [];           // words[i] = [span, span, ...]
  function wrapRoot(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    var cur = null;          // spans of the word being built (a word may cross tajweed <span>s)
    function close() { if (cur && cur.ok) words.push(cur.spans); cur = null; }
    nodes.forEach(function (t) {
      var parts = t.data.split(/(\s+)/), frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { close(); frag.appendChild(document.createTextNode(p)); return; }
        if (!cur) cur = { spans: [], ok: false };
        var s = document.createElement("span"); s.className = "hlw"; s.textContent = p;
        s.setAttribute("data-w", words.length);
        cur.spans.push(s); if (LETTER.test(p)) cur.ok = true;
        frag.appendChild(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    close();
  }
  Array.prototype.forEach.call(roots, function (r) { wrapRoot(r); });
  // spans that ended up in a non-word token (e.g. ۝١٢٧, ۖ) are unwrapped back to plain text
  var idx = 0;
  words.forEach(function (sp) { sp.forEach(function (s) { s.setAttribute("data-w", idx); s.classList.add("w"); }); idx++; });
  Array.prototype.forEach.call(document.querySelectorAll("span.hlw:not(.w)"), function (s) {
    s.parentNode.replaceChild(document.createTextNode(s.textContent), s);
  });
  Array.prototype.forEach.call(roots, function (r) { r.normalize(); r.classList.add("hl-root"); });

  var mode = 1, start = -1;
  try { mode = Math.min(4, Math.max(1, parseInt(localStorage.getItem("qk-hl-mode"), 10) || 1)); } catch (e) {}
  function paint() {
    Array.prototype.forEach.call(document.querySelectorAll(".hlw.on"), function (s) { s.classList.remove("on", "on2"); });
    if (start < 0) { bar.classList.remove("active"); return; }
    for (var k = 0; k < mode && start + k < words.length; k++)
      words[start + k].forEach(function (s) { s.classList.add("on"); if (k) s.classList.add("on2"); });
    bar.classList.add("active");
    var el = words[start][0], r = el.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight - 90) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  function go(d) { if (start < 0) { start = 0; } else { start = Math.max(0, Math.min(words.length - 1, start + d * mode)); } paint(); }
  document.addEventListener("click", function (e) {
    var s = e.target.closest ? e.target.closest(".hlw.w") : null;
    if (!s) return;
    var i = +s.getAttribute("data-w");
    start = (i === start) ? -1 : i; paint();
  });

  var bar = document.createElement("div");
  bar.className = "hlbar notranslate"; bar.setAttribute("translate", "no"); bar.setAttribute("role", "toolbar");
  bar.setAttribute("aria-label", "ہائی لائٹر"); bar.setAttribute("data-i18n-aria-label", "x_hl_group");
  function btn(cls, txt, key, title, fn) {
    var b = document.createElement("button"); b.type = "button"; b.className = cls;
    b.innerHTML = txt; b.title = title; b.setAttribute("aria-label", title);
    b.setAttribute("data-i18n-title", key); b.setAttribute("data-i18n-aria-label", key);
    b.addEventListener("click", fn); bar.appendChild(b); return b;
  }
  var icon = document.createElement("span"); icon.className = "hlic"; icon.textContent = "🖍️"; icon.setAttribute("aria-hidden", "true"); bar.appendChild(icon);
  var b1 = btn("hlm", "1", "x_hl_1", "ایک لفظ", function () { setMode(1); });
  var b2 = btn("hlm", "2", "x_hl_2", "دو الفاظ", function () { setMode(2); });
  var b3 = btn("hlm", "3", "x_hl_3", "تین الفاظ", function () { setMode(3); });
  var b4 = btn("hlm", "4", "x_hl_4", "چار الفاظ", function () { setMode(4); });
  btn("hlnav prev", "<span>›</span>", "x_hl_prev", "پچھلا", function () { go(-1); });
  btn("hlnav next", "<span>‹</span>", "x_hl_next", "اگلا", function () { go(1); });
  btn("hlclr", "✕", "x_hl_clear", "صاف کریں", function () { start = -1; paint(); });
  function setMode(m) {
    mode = m; try { localStorage.setItem("qk-hl-mode", String(m)); } catch (e) {}
    [b1, b2, b3, b4].forEach(function (b, n) { b.setAttribute("aria-pressed", m === n + 1 ? "true" : "false"); }); paint();
  }
  document.body.appendChild(bar); document.body.classList.add("has-hlbar");
  setMode(mode);
  document.addEventListener("keydown", function (e) {
    if (start < 0 || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    var rtl = document.documentElement.dir !== "ltr";
    if (e.key === "ArrowLeft") { go(rtl ? 1 : -1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { go(rtl ? -1 : 1); e.preventDefault(); }
    else if (e.key === "Escape") { start = -1; paint(); }
  });
  window.QK_HL = { count: words.length };
})();
