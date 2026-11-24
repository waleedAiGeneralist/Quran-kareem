
(function(){
'use strict';
const Q = window.QK, PAGES = Q.pages;
const IMGS = PAGES.map(pg => "pages/" + pg.img + ".jpg");
const SURAH = window.QK_SURAHS.map(s => s[0]);
const KEY = "quran-cfg";
const I = window.QK_I18N, T = I.t;
const ud = n => I.num(n);
const $ = id => document.getElementById(id);
const pgLabel = p => PAGES[p].cover ? T("cover") : T("page_n", { n:ud(PAGES[p].page) });

/* ---------- رنگوں کی فہرستیں: [نام, اندرونی رنگ, نمونہ/کنارہ] ---------- */
const AYAH_C = [
  ["ہر آیت کا اپنا رنگ", null, null],
  ["پیلا",   "rgba(255,214,0,.70)",  "#ffd600"], ["سبز",    "rgba(76,175,80,.62)",  "#4caf50"],
  ["سرخ",    "rgba(244,67,54,.50)",  "#f44336"], ["نیلا",   "rgba(66,133,244,.55)", "#4285f4"],
  ["نارنجی", "rgba(255,152,0,.62)",  "#ff9800"], ["جامنی",  "rgba(156,39,176,.45)", "#9c27b0"],
  ["بغیر رنگ (صرف کنارہ)", "rgba(0,0,0,0)", ""]
];
const RING_C = [
  ["خودکار", null], ["سرخ", "#c62828"], ["سیاہ", "#111111"], ["نیلا", "#1565c0"], ["سبز", "#2e7d32"], ["سفید", "#ffffff"]
];
const CUR_C = [
  ["پیلا",   "rgba(250,204,21,.85)", "#a16207", "#facc15"], ["سبز", "rgba(76,175,80,.75)", "#1b5e20", "#4caf50"],
  ["نیلا",   "rgba(66,133,244,.65)", "#0d47a1", "#4285f4"], ["نارنجی", "rgba(255,152,0,.78)", "#a85b00", "#ff9800"],
  ["گلابی",  "rgba(236,64,122,.65)", "#880e4f", "#ec407a"]
];
const BAD_C = [
  ["سرخ",    "rgba(239,68,68,.80)",  "#991b1b", "#ef4444"], ["جامنی", "rgba(147,51,234,.70)", "#4c1d95", "#9333ea"],
  ["نارنجی", "rgba(249,115,22,.80)", "#9a3412", "#f97316"], ["سیاہ",  "rgba(30,30,30,.65)",   "#000000", "#222222"]
];
const CFG = { ayah:0, ring:0, cur:0, bad:0, alpha:42 };
try { const c = JSON.parse(localStorage.getItem(KEY) || "null");
  if (c) { ["ayah","ring","cur","bad","alpha"].forEach(k => { if (typeof c[k] === "number") CFG[k] = c[k]; });
           if (!AYAH_C[CFG.ayah]) CFG.ayah = 0; if (!RING_C[CFG.ring]) CFG.ring = 0; if (!CUR_C[CFG.cur]) CFG.cur = 0; if (!BAD_C[CFG.bad]) CFG.bad = 0; } } catch(e) {}
const saveCfg = () => { try { localStorage.setItem(KEY, JSON.stringify(CFG)); } catch(e) {} };

/* ---------- حالت ---------- */
let G = 4;
let tokens = [], words = [], ayahs = [];
const S = { mode:"idle", ayah:null, pos:null, lock:null, from:null, flash:null, auto:null };

/* ---------- ٹوکن بنانا ---------- */
function tokenize(){
  tokens = []; words = []; ayahs = [];
  // surah / num = the ayah that the first token on these pages belongs to (0-based surah index)
  let surah = Q.init[0] - 1, num = Q.init[1];
  const mk = () => ({ id:ayahs.length, surah, num, hue:0, toks:[], words:[] });
  let cur = mk(); ayahs.push(cur);
  const newSurah = (s) => {           // a surah header (or the page break before al-Baqarah)
    surah = s; num = 1;
    if (!cur.toks.length) { cur.surah = surah; cur.num = num; }
    else { cur = mk(); ayahs.push(cur); }
  };
  PAGES.forEach((pg, p) => {
    if (pg.force) newSurah(pg.force[0] - 1);
    let prevH = false;
    pg.rows.forEach((row, r) => {
      if (row.header) { if (!row.tail && !prevH) newSurah(surah + 1); prevH = true; return; }
      prevH = false;
      const items = [];
      const m = [];
      row.runs.forEach(ru => {
        if (m.length && ru[0] - m[m.length-1][1] - 1 < G) m[m.length-1][1] = ru[1];
        else m.push([ru[0], ru[1]]);
      });
      m.forEach(([a,b]) => items.push({ x0:a, x1:b, type:"w" }));
      row.markers.forEach(([cx,w]) => items.push({ x0:cx - w/2 - 2, x1:cx + w/2 + 2, type:"e" }));
      items.sort((a,b) => b.x1 - a.x1);
      items.forEach(it => {
        const t = { id:tokens.length, p, r, x0:it.x0, x1:it.x1, y0:row.y0, y1:row.y1, type:it.type, a:cur.id, wi:-1 };
        tokens.push(t); cur.toks.push(t.id);
        if (t.type === "w") { t.wi = cur.words.length; t.gi = words.length; cur.words.push(t.id); words.push(t.id); }
        else { num++; cur = mk(); ayahs.push(cur); }
      });
    });
  });
  if (!cur.toks.length) ayahs.pop();
  ayahs.forEach((a,i) => { a.hue = (i * 137.508) % 360; a.sat = 78; a.light = (i % 2) ? 62 : 70; });
}

/* ---------- ڈرائنگ ---------- */
const NS = "http://www.w3.org/2000/svg";
function el(name, attrs, parent){
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const col = (a, l, al) => `hsla(${a.hue.toFixed(0)},${a.sat}%,${l ?? a.light}%,${al ?? 1})`;

function segments(ayah){
  const map = new Map();
  ayah.toks.forEach(id => {
    const t = tokens[id], k = t.p + ":" + t.r;
    const s = map.get(k) || { p:t.p, r:t.r, x0:1e9, x1:-1e9, y0:t.y0, y1:t.y1 };
    s.x0 = Math.min(s.x0, t.x0); s.x1 = Math.max(s.x1, t.x1);
    map.set(k, s);
  });
  return [...map.values()];
}

function buildPages(){
  const wrap = $("wrap"); wrap.innerHTML = "";
  PAGES.forEach((pg, p) => {
    const blk = document.createElement("section"); blk.className = "pgb"; blk.id = "pgb" + p;
    const bar = document.createElement("div"); bar.className = "plinks";
    bar.innerHTML = '<a href="https://moqacademy.pk/" target="_blank" rel="noopener">https://moqacademy.pk</a>' +
      '<span class="pno" data-p="' + p + '">' + pgLabel(p) + '</span>' +
      '<a href="https://onlinequranstudy.com/" target="_blank" rel="noopener">https://onlinequranstudy.com/</a>';
    blk.appendChild(bar);
    const d = document.createElement("div"); d.className = "pg"; d.id = "pg" + p;
    d.style.aspectRatio = pg.W + "/" + pg.H;
    const img = document.createElement("img"); img.src = IMGS[p]; img.alt = pgLabel(p);
    img.loading = p < 2 ? "eager" : "lazy"; img.decoding = "async"; img.width = pg.W; img.height = pg.H; d.appendChild(img);
    const svg = el("svg", { viewBox:`0 0 ${pg.W} ${pg.H}`, preserveAspectRatio:"none" }, d);
    el("g", { class:"blend base" }, svg);
    el("g", { class:"blend hl" }, svg);
    el("g", { class:"hits" }, svg);
    blk.appendChild(d); wrap.appendChild(blk);
  });
  drawBase(); drawHits();
}

function drawBase(){
  const on = $("tint").checked, al = CFG.alpha / 100;
  PAGES.forEach((pg, p) => {
    const g = document.querySelector(`#pg${p} .base`); g.innerHTML = "";
    if (!on) return;
    ayahs.forEach(a => segments(a).filter(s => s.p === p).forEach(s => {
      el("rect", { x:s.x0-3, y:s.y0+3, width:s.x1-s.x0+6, height:s.y1-s.y0-6, rx:7, fill:col(a, a.light, al) }, g);
    }));
    pg.rows.forEach((row, r) => {
      if (row.header) return;
      const ts = tokens.filter(t => t.p === p && t.r === r);
      if (!ts.length) return;
      const first = ts[0], last = ts[ts.length-1], h = row.y1 - row.y0;
      el("rect", { x:pg.W-13, y:row.y0+2, width:11, height:h-4, rx:4, fill:col(ayahs[first.a], 52, .95) }, g);
      el("rect", { x:2,       y:row.y0+2, width:11, height:h-4, rx:4, fill:col(ayahs[last.a], 52, .95) }, g);
    });
  });
}

function drawHits(){
  PAGES.forEach((pg, p) => {
    const g = document.querySelector(`#pg${p} .hits`); g.innerHTML = "";
    tokens.filter(t => t.p === p).forEach(t => {
      el("rect", { class:"hit", x:t.x0-1, y:t.y0, width:t.x1-t.x0+2, height:t.y1-t.y0, "data-t":t.id }, g);
    });
  });
}

function drawHighlight(){
  document.querySelectorAll(".hl").forEach(g => g.innerHTML = "");
  const gOf = p => document.querySelector(`#pg${p} .hl`);
  const word = (t, fill, stroke, cls) =>
    el("rect", { x:t.x0-2, y:t.y0+2, width:t.x1-t.x0+4, height:t.y1-t.y0-4, rx:7, fill, stroke, "stroke-width":2.5, class:cls||"" }, gOf(t.p));
  const cur = CUR_C[CFG.cur], bad = BAD_C[CFG.bad];
  if (S.mode === "ayah" && S.ayah !== null) {
    const a = ayahs[S.ayah], F = AYAH_C[CFG.ayah], R = RING_C[CFG.ring];
    const fill = F[1] === null ? col(a, 52, .85) : F[1];
    const stroke = R[1] === null ? col(a, 30, 1) : R[1];
    segments(a).forEach(s => el("rect", { x:s.x0-4, y:s.y0+2, width:s.x1-s.x0+8, height:s.y1-s.y0-4, rx:8, fill, stroke, "stroke-width":2.8 }, gOf(s.p)));
  }
  if (S.mode === "mistake" && S.lock !== null) word(tokens[S.lock], bad[1], bad[2], "pulse");
  if (S.mode === "track" && S.pos !== null) {
    const a = ayahs[tokens[words[S.pos]].a];
    a.words.forEach(id => { const t = tokens[id]; if (t.gi < S.pos)
      el("rect", { x:t.x0, y:t.y1-9, width:t.x1-t.x0, height:4, rx:2, fill:"rgba(34,197,94,.95)" }, gOf(t.p)); });
    const t = tokens[words[S.pos]];
    if (S.lock !== null) word(t, bad[1], bad[2], "pulse"); else word(t, cur[1], cur[2]);
  }
  if (S.flash !== null) word(tokens[S.flash], "rgba(34,197,94,.85)", "#166534");
}

/* ---------- حالت کی پٹی ---------- */
function toast(msg){ const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2200); }
const name = a => T("st_name", { s:I.surahName(a.surah), n:ud(a.num) });
function updateUI(){
  let main = T("st_idle"), sub = T("st_idle_sub");
  if (S.ayah !== null) {
    const a = ayahs[S.ayah]; main = name(a);
    if (S.mode === "ayah") sub = T("st_ayah");
    if (S.mode === "mistake") { const t = tokens[S.lock]; sub = T("st_mist", { i:ud(t.wi+1), t:ud(a.words.length) }); }
    if (S.mode === "track") { const t = tokens[words[S.pos]]; sub = T(S.lock !== null ? "st_lock" : "st_track", { i:ud(t.wi+1), t:ud(a.words.length) }); }
  }
  $("status").innerHTML = main + "<small>" + sub + "</small>";
  const tr = S.mode === "track";
  $("bPrev").disabled = !tr; $("bNext").disabled = !tr;
  $("bBad").disabled = !(tr && S.lock === null);
  $("bOk").disabled = S.lock === null;
  $("bAuto").disabled = !tr; $("bAuto").classList.toggle("on", !!S.auto);
  $("bAuto").querySelector(".i").textContent = S.auto ? "⏸" : "▶";
  $("bAuto").querySelector(".l").textContent = T(S.auto ? "stop" : "auto");
  $("bClear").disabled = S.mode === "idle";
}
function render(){ drawHighlight(); updateUI(); setHdr(); }

function reveal(t, force){
  const rect = document.querySelector(`#pg${t.p} .hit[data-t="${t.id}"]`);
  if (!rect) return;
  const r = rect.getBoundingClientRect(), top = $("hdr").offsetHeight + 24, bot = innerHeight - 50;
  if (force || r.top < top || r.bottom > bot) window.scrollTo({ top: window.scrollY + r.top - innerHeight*0.38, behavior:"smooth" });
}

/* ---------- عمل ---------- */
function stopAuto(){ if (S.auto) { clearInterval(S.auto); S.auto = null; } }
function clearAll(){ stopAuto(); Object.assign(S, { mode:"idle", ayah:null, pos:null, lock:null, from:null, flash:null }); render(); }
function selectAyah(id){
  if (S.lock !== null && !(S.mode === "mistake" && tokens[S.lock].a === id)) { blocked(); return; }
  stopAuto();
  Object.assign(S, { mode:"ayah", ayah:id, pos:null, lock:null, from:null, flash:null });
  render(); reveal(tokens[ayahs[id].toks[0]]);
}
function flagMistake(t){
  if (S.lock !== null && S.lock !== t.id) { blocked(); return; }
  stopAuto();
  if (S.mode === "track") { S.from = "track"; S.pos = t.gi; } else { S.from = "ayah"; S.mode = "mistake"; }
  S.ayah = t.a; S.lock = t.id; S.flash = null; render();
}
function startTrack(t){
  stopAuto();
  Object.assign(S, { mode:"track", ayah:t.a, pos:t.gi, lock:null, from:null, flash:null });
  render(); reveal(t);
}
function corrected(){
  if (S.lock === null) return;
  const t = tokens[S.lock]; S.flash = t.id; S.lock = null;
  if (S.from === "track") { S.mode = "track"; S.pos = t.gi; } else { S.mode = "ayah"; }
  S.from = null; render();
  setTimeout(() => { S.flash = null; drawHighlight(); }, 900);
}
function blocked(){
  toast(T("blocked"));
  const g = S.lock !== null ? document.querySelector(`#pg${tokens[S.lock].p} .hl`) : null;
  if (g) { g.classList.remove("shake"); void g.getBoundingClientRect(); g.classList.add("shake"); }
}
function step(d){
  if (S.mode !== "track") return false;
  if (S.lock !== null) { blocked(); return false; }
  const n = S.pos + d;
  if (n < 0 || n >= words.length) { stopAuto(); render(); return false; }
  const crossing = tokens[words[n]].a !== S.ayah;
  S.pos = n; S.ayah = tokens[words[n]].a; render(); reveal(tokens[words[n]]);
  return !crossing;
}
function toggleAuto(){
  if (S.mode !== "track") return;
  if (S.auto) { stopAuto(); updateUI(); return; }
  S.auto = setInterval(() => { if (!step(1)) { stopAuto(); updateUI(); } }, +$("spd").value);
  updateUI();
}

/* ---------- ایونٹس ---------- */
$("wrap").addEventListener("click", e => {
  const h = e.target.closest(".hit"); if (!h) return;
  const t = tokens[+h.dataset.t], d = e.detail || 1;
  if (d >= 3) { startTrack(t); return; }
  if (d === 2) { flagMistake(t); return; }
  if (S.lock !== null) { if (t.id === S.lock) corrected(); else blocked(); return; }
  if (S.mode === "track" && t.a === S.ayah && t.type === "w") { S.pos = t.gi; render(); return; }
  selectAyah(t.a);
});
$("bPrev").onclick = () => step(-1);
$("bNext").onclick = () => step(1);
$("bBad").onclick  = () => { if (S.mode === "track" && S.lock === null) flagMistake(tokens[words[S.pos]]); };
$("bOk").onclick   = corrected;
$("bAuto").onclick = toggleAuto;
$("bClear").onclick = clearAll;
$("tint").onchange = drawBase;
$("alpha").oninput = () => { CFG.alpha = +$("alpha").value; saveCfg(); drawBase(); };
$("spd").oninput = () => { if (S.auto) { stopAuto(); toggleAuto(); } };
$("gap").oninput = () => { G = +$("gap").value; $("gapv").textContent = ud(G); clearAll(); tokenize(); drawBase(); drawHits(); render(); };
addEventListener("keydown", e => {
  const tg = e.target.tagName; if (tg === "INPUT" || tg === "SELECT") return;
  const k = e.key;
  if (e.ctrlKey || e.metaKey || e.altKey) return;   // براؤزر کا اپنا زوم (Ctrl +) نہ روکیں
  if (k === "+" || k === "=") { e.preventDefault(); zoomStep(1); return; }
  if (k === "-" || k === "_") { e.preventDefault(); zoomStep(-1); return; }
  if (k === "0") { e.preventDefault(); setZoom(1); return; }
  if (k === " " || (k === "Enter" && S.lock === null)) { if (S.mode === "track") { e.preventDefault(); step(1); } }
  else if (k === "Enter" && S.lock !== null) corrected();
  else if (k === "ArrowLeft" || k === "ArrowDown") { if (S.mode === "track") { e.preventDefault(); step(1); } }
  else if (k === "ArrowRight" || k === "ArrowUp" || k === "Backspace") { if (S.mode === "track") { e.preventDefault(); step(-1); } }
  else if (k === "x" || k === "X") $("bBad").click();
  else if (k === "c" || k === "C") corrected();
  else if (k === "a" || k === "A") toggleAuto();
  else if (k === "Escape") clearAll();
});

/* ---------- صفحہ چننے والی فہرست ---------- */
const sel = $("pgsel");
PAGES.forEach((pg, i) => { const o = document.createElement("option"); o.value = i; o.textContent = pgLabel(i); sel.appendChild(o); });
sel.addEventListener("change", () => { const e = $("pgb" + sel.value); if (e) e.scrollIntoView({ behavior:"smooth", block:"start" }); });
let ticking = false, curPage = 0;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const mid = innerHeight * 0.45; let best = curPage;
    for (let i = 0; i < PAGES.length; i++) { const r = $("pg" + i).getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { best = i; break; } }
    if (best !== curPage) { curPage = best; sel.value = best; }
  });
}, { passive:true });

/* ---------- رنگ کا پینل ---------- */
function mkSw(box, nm, color, cls, fn){
  const b = document.createElement("button"); b.type = "button"; b.className = "sw" + (cls ? " " + cls : "");
  if (color) b.style.background = color; b.dataset.cn = nm; b.title = I.cname(nm); b.setAttribute("aria-label", I.cname(nm));
  b.addEventListener("click", fn); box.appendChild(b);
}
function markSel(){
  [["ayahseg","ayah"],["ringseg","ring"],["curseg","cur"],["badseg","bad"]].forEach(([id,k]) =>
    document.querySelectorAll("#" + id + " .sw").forEach((b,i) => b.classList.toggle("sel", i === CFG[k])));
}
AYAH_C.forEach((f,i) => mkSw($("ayahseg"), f[0], f[2], f[1] === null ? "auto" : (f[2] ? "" : "none"), () => { CFG.ayah = i; saveCfg(); markSel(); drawHighlight(); }));
RING_C.forEach((r,i) => mkSw($("ringseg"), r[0], r[1], r[1] === null ? "auto" : "", () => { CFG.ring = i; saveCfg(); markSel(); drawHighlight(); }));
CUR_C.forEach((c,i) => mkSw($("curseg"), c[0], c[3], "", () => { CFG.cur = i; saveCfg(); markSel(); drawHighlight(); }));
BAD_C.forEach((c,i) => mkSw($("badseg"), c[0], c[3], "", () => { CFG.bad = i; saveCfg(); markSel(); drawHighlight(); }));
$("creset").onclick = () => { Object.assign(CFG, { ayah:0, ring:0, cur:0, bad:0, alpha:42 }); $("alpha").value = 42; saveCfg(); markSel(); drawBase(); drawHighlight(); };
const cb = $("colbtn"), cp = $("cpanel");
cb.addEventListener("click", () => { cp.hidden = !cp.hidden; cb.classList.toggle("sel", !cp.hidden); cb.setAttribute("aria-expanded", String(!cp.hidden)); });
$("alpha").value = CFG.alpha;

function setHdr(){ document.documentElement.style.setProperty("--hdr", $("hdr").offsetHeight + "px"); }
addEventListener("resize", setHdr);
if (window.ResizeObserver) new ResizeObserver(setHdr).observe($("hdr"));

/* ---------- صفحہ زوم (۵۰٪ تا ۲۵۰٪) ---------- */
// تصویر اور SVG ایک ہی ڈبے (.pg) میں ہیں اور SVG کا viewBox تصویر کے پکسلز میں ہے،
// اس لیے ڈبے کی چوڑائی بدلنے سے ہائی لائٹ ہر زوم پر تصویر کے ساتھ بالکل جڑی رہتی ہے۔
const ZKEY = "qk-zoom", ZMIN = 0.5, ZMAX = 2.5, ZSTEP = 0.25;
let Z = 1;
try { const z = parseFloat(localStorage.getItem(ZKEY)); if (z >= ZMIN && z <= ZMAX) Z = Math.round(z / ZSTEP) * ZSTEP; } catch(e) {}
function baseW(){ const m = document.querySelector("main"), cs = getComputedStyle(m);
  return Math.min(904, document.documentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)); }
function applyZoom(){
  const w = $("wrap");
  w.style.setProperty("--pw", Math.round(baseW() * Z) + "px");
  document.body.classList.toggle("zoomed", Z > 1);
  w.style.setProperty("--ww", w.clientWidth + "px");
  $("zReset").textContent = ud(Math.round(Z * 100)) + T("pct");
  $("zOut").disabled = Z <= ZMIN + 1e-9; $("zIn").disabled = Z >= ZMAX - 1e-9;
}
function setZoom(z){
  z = Math.min(ZMAX, Math.max(ZMIN, Math.round(z / ZSTEP) * ZSTEP));
  if (z === Z) { applyZoom(); return; }
  // جو صفحہ اسکرین کے بیچ میں ہے، زوم کے بعد بھی وہی جگہ بیچ میں رہے
  const mid = innerHeight * 0.45, i = curPage, e0 = $("pg" + i), r0 = e0 ? e0.getBoundingClientRect() : null;
  const f = r0 && r0.height ? (mid - r0.top) / r0.height : 0;
  Z = z; try { localStorage.setItem(ZKEY, String(Z)); } catch(e) {}
  applyZoom();
  if (r0) { const r1 = e0.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r1.top + f * r1.height - mid }); }
  const w = $("wrap"); w.scrollLeft = (w.scrollWidth - w.clientWidth) / 2 * (getComputedStyle(w).direction === "rtl" ? -1 : 1);
  toast(T("z_toast", { n:ud(Math.round(Z * 100)) + T("pct") }));
}
function zoomStep(d){ setZoom(Z + d * ZSTEP); }
$("zIn").onclick = () => zoomStep(1);
$("zOut").onclick = () => zoomStep(-1);
$("zReset").onclick = () => setZoom(1);
addEventListener("resize", applyZoom);

/* ---------- زبان بدلنے پر ---------- */
addEventListener("qk-lang", () => {
  Array.prototype.forEach.call(sel.options, o => { o.textContent = pgLabel(+o.value); });
  document.querySelectorAll(".plinks .pno").forEach(e => { e.textContent = pgLabel(+e.dataset.p); });
  document.querySelectorAll(".sw").forEach(b => { b.title = I.cname(b.dataset.cn); b.setAttribute("aria-label", b.title); });
  $("gapv").textContent = ud(G); applyZoom(); updateUI(); setHdr();
});

$("gapv").textContent = ud(G);
tokenize(); buildPages(); applyZoom(); markSel(); render();

/* ---------- سورت پر جانا (#s18 وغیرہ) ---------- */
function goSurah(n, smooth){
  const st = (Q.starts || []).find(x => x[0] === n); if (!st) return false;
  const sec = $("pg" + st[1]); if (!sec) return false;
  const pg = PAGES[st[1]];
  const y = sec.getBoundingClientRect().top + window.scrollY + sec.offsetHeight * (st[2] / pg.H) - $("hdr").offsetHeight - 10;
  window.scrollTo({ top: Math.max(0, y), behavior: smooth ? "smooth" : "auto" });
  return true;
}
window.QK_goSurah = goSurah;
window.QK_ayahs = () => ayahs.map(a => [a.surah + 1, a.num, a.words.length]);  // جانچ کے لیے
function fromHash(smooth){
  const m = /^#s(\d+)$/.exec(location.hash || "");
  if (m) goSurah(+m[1], smooth);
}
addEventListener("hashchange", () => fromHash(true));
if (location.hash) { setHdr(); fromHash(false); setTimeout(() => fromHash(false), 350); }
})();
