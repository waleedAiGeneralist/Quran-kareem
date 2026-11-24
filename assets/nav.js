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
/* اوپر کی پٹی چھپائیں / دکھائیں (حالت اسی ڈیوائس میں محفوظ) */
(function(){
  'use strict';
  var hide = document.getElementById("hdrHide"), show = document.getElementById("hdrShow"), hdr = document.getElementById("hdr");
  if (!hide || !show || !hdr) return;
  var root = document.documentElement;
  function setHdr(){ root.style.setProperty("--hdr", hdr.offsetHeight + "px"); }
  function set(off, keepPlace){
    // اسکرین پر جو حصہ نظر آ رہا ہے وہی رہے
    var y0 = hdr.offsetHeight;
    root.classList.toggle("hdr-off", off);
    try { localStorage.setItem("qk-hdr", off ? "0" : "1"); } catch(e) {}
    var cp = document.getElementById("cpanel"), cb = document.getElementById("colbtn");
    if (off && cp && !cp.hidden && cb) cb.click();
    setHdr();
    if (keepPlace && window.scrollY > 0) window.scrollBy(0, off ? -y0 : hdr.offsetHeight);
    (off ? show : hide).focus({ preventScroll:true });
  }
  hide.addEventListener("click", function(){ set(true, true); });
  show.addEventListener("click", function(){ set(false, true); });
  setHdr();
})();
