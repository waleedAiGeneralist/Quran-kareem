/* v5.1: book reader sticky bar — shows current / total page; stays in sync with pagego. CSP-safe. */
(function(){
  "use strict";
  var h = document.documentElement;
  if (h.getAttribute("data-pg-mode") !== "book") return;
  var MIN = parseInt(h.getAttribute("data-pg-min") || "1", 10);
  var MAX = parseInt(h.getAttribute("data-pg-max") || "1", 10);
  var LBL = h.getAttribute("data-pg-label") || "x_page_n";  /* v5.2 */
  function T(k, v){ var I = window.QK_I18N; return I ? I.t(k, v) : k; }
  function N(n){ var I = window.QK_I18N; return I ? I.num(n) : String(n); }
  function cur(){
    if (window.QK_pageGo && window.QK_pageGo.cur) return window.QK_pageGo.cur() || MIN;
    return MIN;
  }
  function paint(n){
    n = n || cur();
    var el = document.querySelector(".bkcur");
    if (el){ el.setAttribute("data-n", String(n)); el.textContent = T(LBL, { n:N(n) }); }
    var tot = document.querySelector(".bktot");
    if (tot){ tot.setAttribute("data-num", String(MAX)); tot.textContent = N(MAX); }
    var inp = document.querySelector(".pgq-in");
    if (inp && document.activeElement !== inp && !inp.value) inp.value = String(n);
  }
  var ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){ ticking = false; paint(cur()); });
  }
  function init(){
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", function(){
      var m = /^#p-(\d+)$/.exec(location.hash || "");
      paint(m ? +m[1] : cur());
    });
    addEventListener("qk-lang", function(){ paint(cur()); });
    var m = /^#p-(\d+)$/.exec(location.hash || "");
    paint(m ? +m[1] : cur());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
