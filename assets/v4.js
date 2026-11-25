/* v4: زوم، فہرست، ہندسے، اسپلش — کوئی بیرونی اسکرپٹ نہیں */
(function(){
  'use strict';
  var I = window.QK_I18N, root = document.documentElement;
  /* زوم (ہر ڈیوائس پر محفوظ) */
  var Z = [0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2, 2.5], zi = 2;
  try { var sv = parseFloat(localStorage.getItem("qk-v4z")); if (Z.indexOf(sv) >= 0) zi = Z.indexOf(sv); } catch(e) {}
  function setZ(i){
    zi = Math.max(0, Math.min(Z.length - 1, i));
    root.style.setProperty("--z", String(Z[zi]));
    try { localStorage.setItem("qk-v4z", String(Z[zi])); } catch(e) {}
    var r = document.querySelector(".v4zoom .vz0"); if (r) r.textContent = (I ? I.num(Math.round(Z[zi] * 100)) : Math.round(Z[zi] * 100)) + "%";
  }
  if (document.querySelector(".v4zoom")) setZ(zi);
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest(".v4zoom button"); if (!b) return;
    var d = +b.getAttribute("data-z"); setZ(d === 0 ? 2 : zi + d);
  });
  /* فہرست (سیکشن کے اندر) */
  var js = document.getElementById("jumpsel");
  if (js) js.addEventListener("change", function(){
    var v = js.value; if (!v) return;
    var t = document.querySelector(v);
    if (t){ var d = t.closest("details"); if (d) d.open = true; t.scrollIntoView({ behavior:"smooth", block:"start" }); history.replaceState(null, "", v); }
    setTimeout(function(){ js.value = ""; }, 300);
  });
  /* ہیڈر کی اونچائی */
  function setHdr(){ var h = document.getElementById("hdr"); if (h) root.style.setProperty("--hdr", h.offsetHeight + "px"); }
  /* نمبر منتخب زبان کے ہندسوں میں */
  function nums(){
    if (!I) return;
    Array.prototype.forEach.call(document.querySelectorAll("[data-num]"), function(e){ e.textContent = I.num(e.getAttribute("data-num")); });
    setZ(zi); setHdr();
  }
  if (I){ nums(); addEventListener("qk-lang", nums); }
  setHdr(); addEventListener("resize", setHdr);
  /* تصویروں کی ہلکی حفاظت: دائیں کلک / گھسیٹنا بند */
  document.addEventListener("contextmenu", function(e){ if (e.target.closest && e.target.closest(".pimg, .nm99, .kar, .rar")) e.preventDefault(); });
  document.addEventListener("dragstart", function(e){ if (e.target.tagName === "IMG") e.preventDefault(); });
  /* اسپلش */
  if (root.classList.contains("splash-on")) setTimeout(function(){ root.classList.remove("splash-on"); }, 1800);
})();
