/* فہرست کا صفحہ: پارے اور سورتیں منتخب زبان میں */
(function(){
  'use strict';
  var I = window.QK_I18N, T = I.t, ud = I.num, S = window.QK_SURAHS, P = window.QK_PARAS;
  var pad = function(n){ return (n < 10 ? "0" : "") + n; };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); };
  var grid = document.getElementById("pgrid"), tb = document.getElementById("stbody"), f = document.getElementById("sfilter");
  function render(){
    grid.innerHTML = P.map(function(p){
      return '<a class="card" href="para-' + pad(p[0]) + '.html"><span class="no">' + ud(p[0]) + '</span><div class="nm">' + esc(p[1]) + '</div>' + (I.lang() === "en" ? '<div class="ptr">' + esc(I.enPara(p[0] - 1)) + '</div>' : '') + '<div class="rg">' +
        esc(I.surahName(p[2] - 1)) + ' ' + ud(p[3]) + ' — ' + esc(I.surahName(p[4] - 1)) + ' ' + ud(p[5]) + '<br>' + T("card_pages", { a:ud(p[6]), b:ud(p[7]) }) + '</div></a>';
    }).join("");
    tb.innerHTML = S.map(function(s, i){
      var href = 'para-' + pad(s[2]) + '.html#s' + (i + 1);
      var nm = I.lang() === "en" ? '<span class="tr">' + esc(I.enName(i)) + '</span> <span class="arn">' + esc(s[0]) + '</span>' : esc(s[0]);
      return '<tr data-q="' + esc(s[0] + ' ' + I.enName(i) + ' ' + (i + 1)) + '"><td>' + ud(i + 1) + '</td><td class="sn"><a href="' + href + '">' + nm + '</a></td><td>' + ud(s[1]) +
        '</td><td><a href="' + href + '">' + T("para_n", { n:ud(s[2]) }) + '</a></td><td>' + ud(s[3]) + '</td></tr>';
    }).join("");
    filter();
  }
  var norm = function(s){ return s.toLowerCase().replace(/[\u064B-\u0652\u0670\u0640'\-\s]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/[۰-۹]/g, function(d){ return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }).replace(/[٠-٩]/g, function(d){ return "٠١٢٣٤٥٦٧٨٩".indexOf(d); }); };
  function filter(){
    var q = norm(f.value.trim());
    Array.prototype.forEach.call(tb.rows, function(r){ r.style.display = (!q || norm(r.getAttribute("data-q")).indexOf(q) >= 0) ? "" : "none"; });
  }
  f.addEventListener("input", filter);
  render(); addEventListener("qk-lang", render);
  function setHdr(){ document.documentElement.style.setProperty("--hdr", document.getElementById("hdr").offsetHeight + "px"); }
  setHdr(); addEventListener("resize", setHdr); addEventListener("qk-lang", setHdr);
})();
