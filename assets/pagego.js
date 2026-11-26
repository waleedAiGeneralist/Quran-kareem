/* v4.5 / v5.1: صفحہ نمبر تلاش — Quran mushaf (1–549) and book readers (data-pg-mode="book"). No inline code; CSP-safe. */
(function(){
  "use strict";
  var MIN = 1, MAX = 549, P = window.QK_PARAS || [];
  function bounds(){
    var h = document.documentElement, mode = h.getAttribute("data-pg-mode");
    if (mode === "book"){
      var min = parseInt(h.getAttribute("data-pg-min") || "1", 10);
      var max = parseInt(h.getAttribute("data-pg-max") || "1", 10);
      if (!isFinite(min) || min < 1) min = 1;
      if (!isFinite(max) || max < min) max = min;
      return { min:min, max:max, book:true };
    }
    return { min:MIN, max:MAX, book:false };
  }
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
  function anchors(){
    if (!Q || !Q.pages) return;
    Q.pages.forEach(function(pg, i){
      var b = document.getElementById("pgb" + i);
      if (b && !document.getElementById("p-" + pg.page)){ var a = document.createElement("span"); a.className = "pganc"; a.id = "p-" + pg.page; b.insertBefore(a, b.firstChild); }
    });
  }
  function headerOff(){
    var h = document.getElementById("hdr"), off = h ? h.offsetHeight : 0;
    var bar = document.querySelector(".bkbar");
    if (bar) off += bar.offsetHeight;
    return off;
  }
  function scrollToPage(n, smooth){
    var a = document.getElementById("p-" + n); if (!a) return false;
    var y = a.getBoundingClientRect().top + window.scrollY - headerOff() - 6;
    window.scrollTo({ top: Math.max(0, y), behavior: smooth ? "smooth" : "auto" });
    return true;
  }
  function go(box){
    var b = bounds();
    var inp = box.querySelector(".pgq-in"), msg = box.querySelector(".pgq-msg"), n = toInt(inp.value);
    if (isNaN(n) || n < b.min || n > b.max){
      msg.textContent = T(document.documentElement.getAttribute("data-pg-bad") || "x_pgq_bad", { a:N(b.min), b:N(b.max) }); msg.classList.add("err"); inp.focus(); if (inp.select) inp.select(); return;
    }
    msg.classList.remove("err");
    if (b.book){
      msg.textContent = "";  /* current page is already shown in .bkstat */
      if (location.hash !== "#p-" + n) history.replaceState(null, "", "#p-" + n);
      scrollToPage(n, true);
      setTimeout(function(){ scrollToPage(n, false); }, 200);
      setTimeout(function(){ scrollToPage(n, false); }, 600);
      setTimeout(function(){ scrollToPage(n, false); }, 1200);
      var img = document.querySelector("#p-" + n + " img");
      if (img && !img.complete) img.addEventListener("load", function(){ scrollToPage(n, false); }, { once:true });
      return;
    }
    var para = paraOf(n);
    msg.textContent = T("x_pgq_ok", { n:N(n), p:N(para) });
    if (Q && Q.para === para){
      if (location.hash !== "#p-" + n) history.replaceState(null, "", "#p-" + n);
      scrollToPage(n, true);
    } else location.href = "para-" + pad(para) + ".html#p-" + n;
  }
  function cur(){
    var b = bounds();
    var line = headerOff() + 40, c;
    if (b.book){
      c = b.min;
      var bt = -Infinity;  /* v5.2: in a multi-column grid, cards sharing a row count as the first of that row */
      for (var n = b.min; n <= b.max; n++){
        var a = document.getElementById("p-" + n);
        if (!a) continue;
        var t = a.getBoundingClientRect().top;
        if (t <= line && t > bt + 1){ bt = t; c = n; }
      }
      return c;
    }
    if (!Q || !Q.pages) return 0;
    c = Q.pages[0].page;
    Q.pages.forEach(function(pg){ var a = document.getElementById("p-" + pg.page); if (a && a.getBoundingClientRect().top <= line) c = pg.page; });
    return c;
  }
  function wire(box){
    var inp = box.querySelector(".pgq-in");
    box.querySelector(".pgq-go").addEventListener("click", function(){ go(box); });
    inp.addEventListener("keydown", function(e){ if (e.key === "Enter"){ e.preventDefault(); e.stopPropagation(); go(box); } });
    Array.prototype.forEach.call(box.querySelectorAll(".pgq-step"), function(btn){
      btn.addEventListener("click", function(){
        var b = bounds(), d = +btn.getAttribute("data-d"), n = toInt(inp.value);
        if (isNaN(n)) n = cur() || (d > 0 ? b.min - 1 : b.max + 1);
        n = Math.min(b.max, Math.max(b.min, n + d)); inp.value = String(n);
        if (Q || b.book) go(box); else box.querySelector(".pgq-msg").textContent = "";
      });
    });
  }
  function init(){
    anchors();
    Array.prototype.forEach.call(document.querySelectorAll(".pgq"), wire);
    var b = bounds();
    var m = /^#p-(\d+)$/.exec(location.hash || "");
    if (m && (Q || b.book)){
      var n = +m[1]; var inp = document.querySelector(".pgq-in"); if (inp) inp.value = String(n);
      scrollToPage(n, false); setTimeout(function(){ scrollToPage(n, false); }, 350); setTimeout(function(){ scrollToPage(n, false); }, 900);
    }
  }
  window.addEventListener("hashchange", function(){ var m = /^#p-(\d+)$/.exec(location.hash || ""); if (m) scrollToPage(+m[1], true); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.QK_pageGo = { paraOf:paraOf, scrollToPage:scrollToPage, bounds:bounds, cur:cur };
})();
