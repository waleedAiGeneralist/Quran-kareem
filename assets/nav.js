/* پارہ اور سورت کی فہرستیں (ہر صفحے پر) */
(function(){
  'use strict';
  var ud = function(n){ return String(n).replace(/\d/g, function(d){ return "۰۱۲۳۴۵۶۷۸۹".charAt(+d); }); };
  var pad = function(n){ return (n < 10 ? "0" : "") + n; };
  var S = window.QK_SURAHS, P = window.QK_PARAS;
  var cur = window.QK ? window.QK.para : 0;
  window.QK_paraUrl = function(n){ return "para-" + pad(n) + ".html"; };
  var ps = document.getElementById("parasel"), ss = document.getElementById("surahsel");
  if (ps){
    var o0 = document.createElement("option"); o0.value = ""; o0.textContent = "📖 پارہ چنیں"; ps.appendChild(o0);
    P.forEach(function(p){
      var o = document.createElement("option"); o.value = p[0];
      o.textContent = "پارہ " + ud(p[0]) + " — " + p[1]; if (p[0] === cur) o.selected = true; ps.appendChild(o);
    });
    ps.addEventListener("change", function(){ if (ps.value) location.href = window.QK_paraUrl(+ps.value); });
  }
  if (ss){
    var s0 = document.createElement("option"); s0.value = ""; s0.textContent = "📜 سورت چنیں"; ss.appendChild(s0);
    S.forEach(function(s, i){
      var o = document.createElement("option"); o.value = i + 1;
      o.textContent = ud(i + 1) + ". " + s[0] + " (پارہ " + ud(s[2]) + ")"; ss.appendChild(o);
    });
    ss.addEventListener("change", function(){
      var n = +ss.value; if (!n) return;
      var para = S[n - 1][2];
      if (para === cur && window.QK_goSurah){ history.replaceState(null, "", "#s" + n); window.QK_goSurah(n, true); }
      else location.href = window.QK_paraUrl(para) + "#s" + n;
      setTimeout(function(){ ss.value = ""; }, 400);
    });
  }
})();
