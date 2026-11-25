/* پارہ اور سورت کی فہرستیں (ہر صفحے پر، منتخب زبان میں) */
(function(){
  'use strict';
  var I = window.QK_I18N, T = I.t, ud = I.num;
  var pad = function(n){ return (n < 10 ? "0" : "") + n; };
  var S = window.QK_SURAHS, P = window.QK_PARAS;
  var cur = window.QK ? window.QK.para : 0;
  window.QK_paraUrl = function(n){ return "para-" + pad(n) + ".html"; };
  var ps = document.getElementById("parasel"), ss = document.getElementById("surahsel");
  function opt(sel, v, txt){ var o = document.createElement("option"); o.value = v; o.textContent = txt; sel.appendChild(o); return o; }
  function build(){
    if (ps){
      ps.innerHTML = ""; opt(ps, "", T("sel_para"));
      P.forEach(function(p){ var o = opt(ps, p[0], T("opt_para", { n:ud(p[0]), name:p[1], tr:I.enPara(p[0] - 1) })); if (p[0] === cur) o.selected = true; });
    }
    if (ss){
      ss.innerHTML = ""; opt(ss, "", T("sel_surah"));
      S.forEach(function(s, i){ opt(ss, i + 1, T("opt_surah", { n:ud(i + 1), name:s[0], tr:I.enName(i), p:ud(s[2]) })); });
    }
  }
  build(); addEventListener("qk-lang", build);
  if (ps) ps.addEventListener("change", function(){ if (ps.value) location.href = window.QK_paraUrl(+ps.value); });
  if (ss) ss.addEventListener("change", function(){
    var n = +ss.value; if (!n) return;
    var para = S[n - 1][2];
    if (para === cur && window.QK_goSurah){ history.replaceState(null, "", "#s" + n); window.QK_goSurah(n, true); }
    else location.href = window.QK_paraUrl(para) + "#s" + n;
    setTimeout(function(){ ss.value = ""; }, 400);
  });
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
