/* v4.5: صفحہ نمبر تلاش — page-number search (quran.html big box, compact box in para headers). No inline code; CSP-safe. */
(function(){
  "use strict";
  var MIN = 1, MAX = 549, P = window.QK_PARAS || [];
  function T(k, v){ var I = window.QK_I18N; return I ? I.t(k, v) : k; }
  function N(n){ var I = window.QK_I18N; return I ? I.num(n) : String(n); }
  function toInt(s){
    s = String(s || "").replace(/[\u06F0-\u06F9]/g, function(c){ return c.charCodeAt(0) - 0x06F0; })
                       .replace(/[\u0660-\u0669]/g, function(c){ return c.charCodeAt(0) - 0x0660; }).replace(/\s+/g, "");
    return /^\d{1,4}$/.test(s) ? parseInt(s, 10) : NaN;
  }
  function paraOf(pg){ for (var i = 0; i < P.length; i++) if (pg >= P[i][6] && pg <= P[i][7]) return P[i][0]; return 0; }
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  var Q = window.QK;   /* present on para pages */
  /* page anchors #p-123 on para pages (added beside the existing page blocks; images/content untouched) */
  function anchors(){
    if (!Q || !Q.pages) return;
    Q.pages.forEach(function(pg, i){
      var b = document.getElementById("pgb" + i);
      if (b && !document.getElementById("p-" + pg.page)){ var a = document.createElement("span"); a.className = "pganc"; a.id = "p-" + pg.page; b.insertBefore(a, b.firstChild); }
    });
  }
  function scrollToPage(n, smooth){
    var a = document.getElementById("p-" + n); if (!a) return false;
    var h = document.getElementById("hdr"), off = h ? h.offsetHeight : 0;
    var y = a.getBoundingClientRect().top + window.scrollY - off - 6;
    window.scrollTo({ top: Math.max(0, y), behavior: smooth ? "smooth" : "auto" });
    return true;
  }
  function go(box){
    var inp = box.querySelector(".pgq-in"), msg = box.querySelector(".pgq-msg"), n = toInt(inp.value);
    if (isNaN(n) || n < MIN || n > MAX){
      msg.textContent = T("x_pgq_bad", { a:N(MIN), b:N(MAX) }); msg.classList.add("err"); inp.focus(); if (inp.select) inp.select(); return;
    }
    var para = paraOf(n); msg.classList.remove("err");
    msg.textContent = T("x_pgq_ok", { n:N(n), p:N(para) });
    if (Q && Q.para === para){
      if (location.hash !== "#p-" + n) history.replaceState(null, "", "#p-" + n);
      scrollToPage(n, true);
    } else location.href = "para-" + pad(para) + ".html#p-" + n;
  }
  function cur(){
    /* current page on a para page: the last anchor above the header line */
    if (!Q || !Q.pages) return 0;
    var h = document.getElementById("hdr"), line = (h ? h.offsetHeight : 0) + 40, c = Q.pages[0].page;
    Q.pages.forEach(function(pg){ var a = document.getElementById("p-" + pg.page); if (a && a.getBoundingClientRect().top <= line) c = pg.page; });
    return c;
  }
  function wire(box){
    var inp = box.querySelector(".pgq-in");
    box.querySelector(".pgq-go").addEventListener("click", function(){ go(box); });
    inp.addEventListener("keydown", function(e){ if (e.key === "Enter"){ e.preventDefault(); e.stopPropagation(); go(box); } });
    Array.prototype.forEach.call(box.querySelectorAll(".pgq-step"), function(b){
      b.addEventListener("click", function(){
        var d = +b.getAttribute("data-d"), n = toInt(inp.value);
        if (isNaN(n)) n = cur() || (d > 0 ? 0 : MAX + 1);
        n = Math.min(MAX, Math.max(MIN, n + d)); inp.value = String(n);
        if (Q) go(box); else box.querySelector(".pgq-msg").textContent = "";
      });
    });
  }
  function init(){
    anchors();
    Array.prototype.forEach.call(document.querySelectorAll(".pgq"), wire);
    var m = /^#p-(\d+)$/.exec(location.hash || "");
    if (m && Q){
      var n = +m[1]; var inp = document.querySelector(".pgq-in"); if (inp) inp.value = String(n);
      scrollToPage(n, false); setTimeout(function(){ scrollToPage(n, false); }, 350); setTimeout(function(){ scrollToPage(n, false); }, 900);
    }
  }
  window.addEventListener("hashchange", function(){ var m = /^#p-(\d+)$/.exec(location.hash || ""); if (m) scrollToPage(+m[1], true); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.QK_pageGo = { paraOf:paraOf, scrollToPage:scrollToPage };
})();
