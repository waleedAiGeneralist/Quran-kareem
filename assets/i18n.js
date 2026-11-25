/* زبان (اردو / عربی / English) اور روشن / تاریک انداز — صرف ویب سائٹ کی عبارتیں؛ قرآن کے صفحات اور ڈیٹا نہیں بدلتے */
(function(){
  'use strict';
  var EN_NAMES = ["Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha", "Al-Anbya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shuraa", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", "As-Saf", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"];
  var EN_PARAS = ["Alif Lam Meem", "Sayaqool", "Tilkar Rusul", "Lan Tanaloo", "Wal Mohsanat", "La Yuhibbullah", "Wa Iza Samiu", "Wa Lau Annana", "Qalal Malao", "Wa A'lamu", "Yatazeroon", "Wa Mamin Da'abat", "Wa Ma Ubrioo", "Rubama", "Subhanallazi", "Qal Alam", "Iqtaraba", "Qad Aflaha", "Wa Qalallazina", "Amman Khalaq", "Utlu Ma Oohi", "Wa Manyaqnut", "Wa Mali", "Faman Azlam", "Elahe Yuruddo", "Ha'a Meem", "Qala Fama Khatbukum", "Qad Sami Allah", "Tabarakallazi", "Amma Yatasa'aloon"];
  var D = {
    ur: {
      quran:"قرآنِ حکیم", para_n:"پارہ {n}", all30:"مکمل {n} پارے",
      brand:"مجتبیٰ آن لائن قرآن اکیڈمی", brand2:"Mujtaba Online Quran Academy",
      home:"فہرست", prev_para:"پچھلا پارہ", next_para:"اگلا پارہ", prev:"پچھلا", next:"اگلا",
      sel_para:"📖 پارہ چنیں", sel_surah:"📜 سورت چنیں", opt_para:"پارہ {n} — {name}", opt_surah:"{n}. {name} (پارہ {p})",
      a_para:"پارہ", a_surah:"سورت", a_page:"صفحہ", a_lang:"زبان",
      w_prev_t:"پچھلا لفظ (Backspace)", w_next_t:"اگلا لفظ (Space)", bad:"غلطی", bad_t:"غلطی (X)", ok:"درست", ok_t:"درست (C)",
      auto:"آٹو", auto_t:"آٹو چلائیں (A)", stop:"رکیں", color:"رنگ", color_t:"رنگ اور ترتیب", clear:"ہٹائیں", clear_t:"ہٹائیں (Esc)",
      z_group:"صفحہ زوم", z_out:"چھوٹا کریں (−)", z_in:"بڑا کریں (+)", z_reset:"اصل سائز (0)", z_toast:"زوم: {n}", pct:"٪",
      hide:"پٹی چھپائیں", show:"پٹی دکھائیں", theme:"روشن / تاریک انداز",
      page_n:"صفحہ {n}", cover:"سرورق",
      st_idle:"کسی آیت پر کلک کریں", st_idle_sub:"1 کلک = پوری آیت · 2 کلک = غلط لفظ · 3 کلک = لفظ بہ لفظ",
      st_name:"سورۃ {s} — آیت {n}", st_ayah:"پوری آیت منتخب ہے — غلط لفظ پر ڈبل کلک کریں",
      st_mist:"لفظ {i}/{t} پر غلطی — درست ہونے تک ہائی لائٹر رکا ہے (✓ دبائیں یا لفظ پر کلک کریں)",
      st_lock:"لفظ {i}/{t} پر غلطی — پہلے درست کریں (✓)", st_track:"لفظ بہ لفظ: {i}/{t}",
      blocked:"⚠ پہلے غلطی درست کریں (✓) — تب تک ہائی لائٹر آگے نہیں بڑھے گا",
      c_ayah:"پوری آیت کا رنگ:", c_ring:"آیت کے ڈبے کا کنارہ:", c_cur:"موجودہ لفظ کا رنگ:", c_bad:"غلطی کا رنگ:",
      c_tint:"ہر آیت کے ہلکے رنگ اور کنارے کی پٹی", c_alpha:"رنگ کی شدت", c_spd:"آٹو کی رفتار", c_gap:"لفظ کی تقسیم", c_reset:"پہلے جیسا",
      c_note:"آپ کے چنے ہوئے رنگ اسی ڈیوائس میں محفوظ رہتے ہیں۔ «لفظ کی تقسیم»: کم کریں تو ٹکڑے زیادہ، بڑھائیں تو کم۔",
      hint:"کسی آیت پر <b>ایک کلک</b> کریں — پوری آیت (چاہے کئی سطروں میں ہو) روشن ہو جائے گی۔ کسی لفظ پر <b>دو کلک</b> کریں — صرف وہی لفظ لال ہو کر رک جائے گا، اور جب تک غلطی درست نہ ہو (✓) ہائی لائٹر آگے نہیں بڑھے گا۔ <b>تین کلک</b> سے لفظ بہ لفظ ہائی لائٹ شروع ہو جاتا ہے۔",
      hint_idx:"پارہ یا سورت چنیں۔ ہر پارے میں کسی آیت پر <b>ایک کلک</b> سے پوری آیت روشن ہوتی ہے، <b>دو کلک</b> سے غلط لفظ نشان زد ہوتا ہے، اور <b>تین کلک</b> سے لفظ بہ لفظ ہائی لائٹ شروع ہو جاتا ہے۔ صفحہ بڑا کرنے کے لیے اوپر <b>+ / −</b> زوم، اور پوری اسکرین کے لیے <b>«پٹی چھپائیں»</b> استعمال کریں۔",
      teacher:"استاد: محمد راشد — لائیو آن لائن کلاسز — بچے اور بڑے، دنیا بھر سے", trial:"۳ دن مفت ٹرائل",
      hero_s:"لائیو آن لائن کلاسز — ناظرہ، حفظ، تجوید", website:"ویب سائٹ",
      sec_paras:"📖 پارے ({n})", sec_surahs:"📜 سورتیں ({n})", filter:"سورت کا نام یا نمبر لکھیں…", a_filter:"سورت تلاش کریں",
      th_no:"نمبر", th_surah:"سورت", th_ayahs:"آیات", th_para:"پارہ", th_page:"صفحہ", card_pages:"صفحہ {a} تا {b}",
      t_para:"قرآنِ حکیم — پارہ {n} | مجتبیٰ آن لائن قرآن اکیڈمی", t_index:"قرآنِ حکیم — مکمل ۳۰ پارے | مجتبیٰ آن لائن قرآن اکیڈمی",
      logo_alt:"مجتبیٰ آن لائن قرآن اکیڈمی کا لوگو"
    },
    ar: {
      quran:"القرآن الكريم", para_n:"الجزء {n}", all30:"الأجزاء الثلاثون كاملة",
      brand:"أكاديمية مجتبى للقرآن عبر الإنترنت", brand2:"Mujtaba Online Quran Academy",
      home:"الفهرس", prev_para:"الجزء السابق", next_para:"الجزء التالي", prev:"السابق", next:"التالي",
      sel_para:"📖 اختر الجزء", sel_surah:"📜 اختر السورة", opt_para:"الجزء {n} — {name}", opt_surah:"{n}. {name} (الجزء {p})",
      a_para:"الجزء", a_surah:"السورة", a_page:"الصفحة", a_lang:"اللغة",
      w_prev_t:"الكلمة السابقة (Backspace)", w_next_t:"الكلمة التالية (Space)", bad:"خطأ", bad_t:"خطأ (X)", ok:"صحيح", ok_t:"صحيح (C)",
      auto:"تلقائي", auto_t:"تشغيل تلقائي (A)", stop:"إيقاف", color:"الألوان", color_t:"الألوان والإعدادات", clear:"مسح", clear_t:"مسح التحديد (Esc)",
      z_group:"تكبير الصفحة", z_out:"تصغير (−)", z_in:"تكبير (+)", z_reset:"الحجم الأصلي (0)", z_toast:"التكبير: {n}", pct:"٪",
      hide:"إخفاء الشريط", show:"إظهار الشريط", theme:"الوضع الفاتح / الداكن",
      page_n:"صفحة {n}", cover:"الغلاف",
      st_idle:"انقر على أي آية", st_idle_sub:"نقرة = الآية كاملة · نقرتان = كلمة خاطئة · ثلاث نقرات = كلمة كلمة",
      st_name:"سورة {s} — الآية {n}", st_ayah:"الآية كاملة محددة — انقر مرتين على الكلمة الخاطئة",
      st_mist:"خطأ في الكلمة {i}/{t} — يتوقف التظليل حتى يُصحَّح (اضغط ✓ أو انقر على الكلمة)",
      st_lock:"خطأ في الكلمة {i}/{t} — صحِّحه أولاً (✓)", st_track:"كلمة كلمة: {i}/{t}",
      blocked:"⚠ صحِّح الخطأ أولاً (✓) — لن يتقدم التظليل قبل ذلك",
      c_ayah:"لون الآية كاملة:", c_ring:"إطار الآية:", c_cur:"لون الكلمة الحالية:", c_bad:"لون الخطأ:",
      c_tint:"تلوين خفيف لكل آية مع شريط جانبي", c_alpha:"شدة اللون", c_spd:"سرعة التشغيل التلقائي", c_gap:"تقسيم الكلمات", c_reset:"الإعدادات الافتراضية",
      c_note:"تُحفظ الألوان التي تختارها على هذا الجهاز. «تقسيم الكلمات»: القيمة الأقل تعني أجزاءً أكثر، والأعلى أجزاءً أقل.",
      hint:"انقر <b>مرة واحدة</b> على أي آية لتظليلها كاملة (ولو امتدت على عدة أسطر). انقر <b>مرتين</b> على كلمة لتظليلها بالأحمر وتثبيتها، ولن يتقدم التظليل حتى يُصحَّح الخطأ (✓). <b>ثلاث نقرات</b> تبدأ التظليل كلمةً كلمة.",
      hint_idx:"اختر جزءاً أو سورة. في كل جزء: <b>نقرة واحدة</b> على آية تظلّلها كاملة، و<b>نقرتان</b> تحدّدان الكلمة الخاطئة، و<b>ثلاث نقرات</b> تبدأ التظليل كلمةً كلمة. استخدم <b>+ / −</b> في الأعلى لتكبير الصفحة، و<b>«إخفاء الشريط»</b> لملء الشاشة.",
      teacher:"المعلم: محمد راشد — دروس مباشرة عبر الإنترنت — للصغار والكبار من جميع أنحاء العالم", trial:"تجربة مجانية لمدة ٣ أيام",
      hero_s:"دروس مباشرة عبر الإنترنت — القراءة نظراً، الحفظ، التجويد", website:"الموقع",
      sec_paras:"📖 الأجزاء ({n})", sec_surahs:"📜 السور ({n})", filter:"اكتب اسم السورة أو رقمها…", a_filter:"ابحث عن سورة",
      th_no:"الرقم", th_surah:"السورة", th_ayahs:"الآيات", th_para:"الجزء", th_page:"الصفحة", card_pages:"الصفحات {a} – {b}",
      t_para:"القرآن الكريم — الجزء {n} | أكاديمية مجتبى للقرآن", t_index:"القرآن الكريم — الأجزاء الثلاثون | أكاديمية مجتبى للقرآن",
      logo_alt:"شعار أكاديمية مجتبى للقرآن"
    },
    en: {
      quran:"The Holy Quran", para_n:"Para {n}", all30:"All {n} Paras",
      brand:"Mujtaba Online Quran Academy", brand2:"مجتبیٰ آن لائن قرآن اکیڈمی",
      home:"Home", prev_para:"Previous para", next_para:"Next para", prev:"Prev", next:"Next",
      sel_para:"📖 Choose para", sel_surah:"📜 Choose surah", opt_para:"Para {n} — {tr}", opt_surah:"{n}. {tr} — {name} (Para {p})",
      a_para:"Para", a_surah:"Surah", a_page:"Page", a_lang:"Language",
      w_prev_t:"Previous word (Backspace)", w_next_t:"Next word (Space)", bad:"Mistake", bad_t:"Mark mistake (X)", ok:"Correct", ok_t:"Corrected (C)",
      auto:"Auto", auto_t:"Auto play (A)", stop:"Stop", color:"Colours", color_t:"Colours & settings", clear:"Clear", clear_t:"Clear (Esc)",
      z_group:"Page zoom", z_out:"Zoom out (−)", z_in:"Zoom in (+)", z_reset:"Actual size (0)", z_toast:"Zoom: {n}", pct:"%",
      hide:"Hide bar", show:"Show bar", theme:"Light / dark theme",
      page_n:"Page {n}", cover:"Cover",
      st_idle:"Click any ayah", st_idle_sub:"1 click = whole ayah · 2 clicks = wrong word · 3 clicks = word by word",
      st_name:"Surah {s} — Ayah {n}", st_ayah:"Whole ayah selected — double-click a wrong word",
      st_mist:"Mistake on word {i}/{t} — highlighter paused until corrected (press ✓ or click the word)",
      st_lock:"Mistake on word {i}/{t} — correct it first (✓)", st_track:"Word by word: {i}/{t}",
      blocked:"⚠ Correct the mistake first (✓) — the highlighter won't move on until then",
      c_ayah:"Whole-ayah colour:", c_ring:"Ayah outline:", c_cur:"Current word colour:", c_bad:"Mistake colour:",
      c_tint:"Light tint for every ayah, with edge strips", c_alpha:"Colour strength", c_spd:"Auto speed", c_gap:"Word splitting", c_reset:"Reset",
      c_note:"Your colour choices are saved on this device. “Word splitting”: lower = more pieces, higher = fewer.",
      hint:"<b>Click once</b> on any ayah to highlight the whole ayah (even across several lines). <b>Double-click</b> a word to mark it red and hold it; the highlighter won't move on until the mistake is corrected (✓). A <b>triple-click</b> starts word-by-word highlighting.",
      hint_idx:"Choose a para or surah. In every para, <b>one click</b> on an ayah highlights the whole ayah, a <b>double-click</b> marks a wrong word, and a <b>triple-click</b> starts word-by-word highlighting. Use <b>+ / −</b> at the top to zoom the page, and <b>“Hide bar”</b> for a full-screen view.",
      teacher:"Teacher: Muhammad Rashid — live online classes — children and adults, worldwide", trial:"3-day free trial",
      hero_s:"Live online classes — Nazra, Hifz, Tajweed", website:"Website",
      sec_paras:"📖 Paras ({n})", sec_surahs:"📜 Surahs ({n})", filter:"Type a surah name or number…", a_filter:"Search surahs",
      th_no:"No.", th_surah:"Surah", th_ayahs:"Ayahs", th_para:"Para", th_page:"Page", card_pages:"Pages {a}–{b}",
      t_para:"The Holy Quran — Para {n} | Mujtaba Online Quran Academy", t_index:"The Holy Quran — All 30 Paras | Mujtaba Online Quran Academy",
      logo_alt:"Mujtaba Online Quran Academy logo"
    }
  };
  /* رنگوں کے نام (para.js کی فہرستوں میں اردو نام) */
  var CN = {
    "ہر آیت کا اپنا رنگ":["لون خاص لكل آية","Each ayah its own colour"], "پیلا":["أصفر","Yellow"], "سبز":["أخضر","Green"],
    "سرخ":["أحمر","Red"], "نیلا":["أزرق","Blue"], "نارنجی":["برتقالي","Orange"], "جامنی":["بنفسجي","Purple"],
    "بغیر رنگ (صرف کنارہ)":["بلا تعبئة (إطار فقط)","No fill (outline only)"], "خودکار":["تلقائي","Automatic"],
    "سیاہ":["أسود","Black"], "سفید":["أبيض","White"], "گلابی":["وردي","Pink"]
  };
  /* v4: نئے صفحات کی اضافی عبارتیں (assets/i18n-x.js) */
  var XT = window.QK_I18N_EXTRA;
  if (XT) Object.keys(XT).forEach(function(l){ if (D[l]) Object.keys(XT[l]).forEach(function(k){ D[l][k] = XT[l][k]; }); });
  var LANGS = ["ur","ar","en"];
  var L = "ur";
  try { var s = localStorage.getItem("qk-lang"); if (LANGS.indexOf(s) >= 0) L = s; } catch(e) {}
  var DIG = { ur:"۰۱۲۳۴۵۶۷۸۹", ar:"٠١٢٣٤٥٦٧٨٩" };
  function num(n){ var d = DIG[L]; n = String(n); return d ? n.replace(/\d/g, function(c){ return d.charAt(+c); }) : n; }
  function t(k, v){
    var s = (D[L] && D[L][k] != null) ? D[L][k] : (D.ur[k] != null ? D.ur[k] : k);
    if (v) s = s.replace(/\{(\w+)\}/g, function(m, x){ return v[x] != null ? v[x] : m; });
    return s;
  }
  function cname(u){ var c = CN[u]; return L === "ur" || !c ? u : c[L === "ar" ? 0 : 1]; }
  function surahName(i){ return L === "en" ? EN_NAMES[i] : window.QK_SURAHS[i][0]; }   // i = 0-based
  function apply(root){
    root = root || document;
    var h = document.documentElement;
    h.lang = L; h.dir = L === "en" ? "ltr" : "rtl"; h.classList.remove("i18n-pending");
    Array.prototype.forEach.call(root.querySelectorAll("[data-i18n]"), function(e){
      var v = e.hasAttribute("data-n") ? { n:num(e.getAttribute("data-n")) } : null;
      var k = e.getAttribute("data-i18n"), s = t(k, v);
      if (s === k) return;   /* v4.3: missing key -> keep built-in text, never show the raw key */
      if (e.hasAttribute("data-html")) e.innerHTML = s; else e.textContent = s;
    });
    ["title","aria-label","placeholder","alt"].forEach(function(a){
      Array.prototype.forEach.call(root.querySelectorAll("[data-i18n-" + a + "]"), function(e){
        var k = e.getAttribute("data-i18n-" + a), s = t(k, e.hasAttribute("data-n") ? { n:num(e.getAttribute("data-n")) } : null);
        if (s !== k) e.setAttribute(a, s);
      });
    });
    var tk = h.getAttribute("data-title");
    if (tk) document.title = t(tk, { n:num(h.getAttribute("data-n") || "") });
    Array.prototype.forEach.call(document.querySelectorAll(".langsw button"), function(b){
      var on = b.getAttribute("data-lang") === L; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
    });
  }
  function setLang(l){
    if (LANGS.indexOf(l) < 0 || l === L) return;
    L = l; try { localStorage.setItem("qk-lang", l); } catch(e) {}
    apply(); window.dispatchEvent(new Event("qk-lang"));
  }
  /* روشن / تاریک */
  function theme(){ return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function setTheme(m){
    document.documentElement.setAttribute("data-theme", m);
    try { localStorage.setItem("qk-theme", m); } catch(e) {}
    var mc = document.querySelector('meta[name="theme-color"]'); if (mc) mc.setAttribute("content", m === "dark" ? "#0a1022" : "#16264e");
  }
  window.QK_I18N = { t:t, num:num, lang:function(){ return L; }, cname:cname, surahName:surahName, enName:function(i){ return EN_NAMES[i]; }, enPara:function(i){ return EN_PARAS[i]; }, apply:apply, setLang:setLang };
  apply();
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest(".langsw button"); if (b) { setLang(b.getAttribute("data-lang")); return; }
    if (e.target.closest && e.target.closest("#themeBtn")) setTheme(theme() === "dark" ? "light" : "dark");
  });
  if (window.matchMedia) {
    var mq = matchMedia("(prefers-color-scheme: dark)");
    var f = function(ev){ var saved = null; try { saved = localStorage.getItem("qk-theme"); } catch(e) {} if (!saved) document.documentElement.setAttribute("data-theme", ev.matches ? "dark" : "light"); };
    if (mq.addEventListener) mq.addEventListener("change", f);
  }
})();
