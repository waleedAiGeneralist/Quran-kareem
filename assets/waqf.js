/* v53: وقف کے نشانات — صرف نشان کے اپنے سیاہ پکسلز رنگین ہوتے ہیں (کوئی دائرہ نہیں، کسی حرف پر کچھ نہیں بنتا)۔ بٹن سے آن / بند (پہلے سے بند)۔
   ڈیٹا assets/waqf/para-NN.js: [x, y, قسم, path] اسکین کے پکسلز میں؛ path = نشان کی سیاہی کا خاکہ۔ تصویر یا الفاظ میں کوئی تبدیلی نہیں۔ */
(function () {
  "use strict";
  var Q = window.QK, D = window.QKWQ;
  if (!Q || !D || !Q.pages) return;
  var NS = "http://www.w3.org/2000/svg";
  /* teacher's chart colours: red م (must stop) · orange ط / قف / ∴ / سکتہ / وقفہ (stop or pause) · yellow ج (either) ·
     light green صلے / ز / ص / ق (better to continue) · strong green لا (do NOT stop — keep reading) */
  var COL = { m:"#d50000", t:"#f57c00", ql:"#f57c00", qf:"#f57c00", mu:"#f57c00", sk:"#f57c00", wq:"#f57c00",
    j:"#e6b800", sl:"#7cb342", z:"#7cb342", s:"#7cb342", q:"#7cb342", la:"#00a83a", rh:"#ad1457", sj:"#ad1457" };
  var FALLBACK = { btn:"وقف", title:"وقف کے نشانات", on:"وقف کے نشانات آن", off:"وقف کے نشانات بند" };
  function T(k) {
    var X = window.QK_I18N_EXTRA || {}, l = document.documentElement.lang, d = X[l] || X.ur || {};
    return d["x_wq_" + k] || (X.ur || {})["x_wq_" + k] || FALLBACK[k] || k;
  }
  var on = false;
  try { on = localStorage.getItem("qk-waqf") === "1"; } catch (e) {}
  function toast(s) {
    var t = document.getElementById("toast"); if (!t) return;
    t.textContent = s; t.classList.add("show"); clearTimeout(toast.h);
    toast.h = setTimeout(function () { t.classList.remove("show"); }, 3600);
  }
  function mk(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function meaning(types) { return types.map(T).join("  •  "); }
  function mark(g, w) {
    var types = w[2].split("+"), c = COL[types[0]] || "#555";
    var grp = mk("g", { class: "wq wq-" + types[0] }, g);
    /* the sign's own ink only — same shape as the printed sign, so it can never cover a letter */
    mk("path", { d: w[3], fill: c, "fill-rule": "evenodd" }, grp);
    /* invisible tap area (nothing is drawn) */
    var hit = mk("circle", { cx: w[0], cy: w[1], r: 22, fill: "transparent", class: "wqhit" }, grp);
    var t = mk("title", {}, hit); t.textContent = meaning(types);
    hit.addEventListener("click", function (ev) { ev.stopPropagation(); ev.preventDefault(); toast(meaning(types)); });
  }
  function draw() {
    Array.prototype.forEach.call(document.querySelectorAll("g.qwaqf"), function (g) { g.parentNode.removeChild(g); });
    if (!on) return;
    Q.pages.forEach(function (pg, p) {
      var svg = document.querySelector("#pg" + p + " svg"); if (!svg) return;
      var g = mk("g", { class: "qwaqf" }, svg);
      (D[String(+pg.img)] || []).forEach(function (w) { mark(g, w); });
    });
  }
  function legend() {
    var el = document.getElementById("wqleg");
    if (!el) {
      el = document.createElement("div"); el.id = "wqleg"; el.className = "wqleg";
      var main = document.querySelector("main"), wrap = document.getElementById("wrap");
      if (main && wrap) main.insertBefore(el, wrap); else return;
    }
    var items = [["m","مـ"],["t","ط"],["qf","قف"],["mu","∴"],["sk","سکتہ"],["j","ج"],["sl","صلے"],["z","ز"],["s","ص"],["q","ق"],["la","لا"]];
    el.innerHTML = "";
    items.forEach(function (it) {
      var b = document.createElement("button"); b.type = "button"; b.className = "wqk wqk-" + it[0];
      var s = document.createElement("span"); s.lang = "ar"; s.textContent = it[1]; s.style.color = COL[it[0]];
      b.appendChild(s);
      if (it[0] === "la" || it[0] === "m") { var x = document.createElement("small"); x.textContent = T(it[0] === "la" ? "g_go" : "g_stop"); b.appendChild(x); }
      b.title = T(it[0]); b.addEventListener("click", function () { toast(T(it[0])); }); el.appendChild(b);
    });
    el.hidden = !on;
  }
  var btn = document.createElement("button");
  btn.type = "button"; btn.id = "bWaqf";
  function label() { btn.innerHTML = '<span class="i">⛔</span><span class="l"></span>'; btn.querySelector(".l").textContent = T("btn"); btn.title = T("title"); btn.setAttribute("aria-label", T("title")); btn.setAttribute("aria-pressed", on ? "true" : "false"); }
  btn.addEventListener("click", function () {
    on = !on; try { localStorage.setItem("qk-waqf", on ? "1" : "0"); } catch (e) {}
    label(); draw(); legend(); document.body.classList.toggle("waqf-on", on); toast(on ? T("on") : T("off"));
  });
  var tools = document.querySelector(".toolbar .tools");
  if (tools) { tools.appendChild(btn); tools.classList.add("has-waqf"); var tb = tools.closest(".toolbar"); if (tb) tb.classList.add("has-waqf-bar"); }
  label(); legend(); document.body.classList.toggle("waqf-on", on);
  var wrap = document.getElementById("wrap");
  if (wrap) new MutationObserver(function () { if (on && !document.querySelector("g.qwaqf")) draw(); }).observe(wrap, { childList: true });
  new MutationObserver(function () { label(); legend(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  draw();
})();
