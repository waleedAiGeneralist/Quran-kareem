/* v5.2: Tajweed Course — tap a card to view it full size, with zoom. No inline code; CSP-safe. */
(function(){
  "use strict";
  if (!document.querySelector(".tjgrid")) return;
  var MAX = parseInt(document.documentElement.getAttribute("data-pg-max") || "1", 10);
  var ZS = [1, 1.5, 2, 3, 4], zi = 0, cur = 0, box, img, cap, sc, pushed = false, lastFocus = null, base = 0;
  function T(k, v){ var I = window.QK_I18N; return I ? I.t(k, v) : k; }
  function N(n){ var I = window.QK_I18N; return I ? I.num(n) : String(n); }
  function el(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function btn(cls, key, txt, fn){
    var b = el("button", "tjb " + cls, txt); b.type = "button";
    b.setAttribute("data-k", key); b.title = T(key); b.setAttribute("aria-label", T(key));
    b.addEventListener("click", fn); return b;
  }
  function build(){
    box = el("div", "tjlb"); box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.hidden = true;
    var bar = el("div", "tjlb-bar"); bar.setAttribute("dir", "ltr");
    cap = el("span", "tjlb-cap");
    bar.appendChild(btn("tjx", "x_tj_close", "✕", close));
    bar.appendChild(btn("tjpv", "x_tj_prev", "‹", function(){ show(cur - 1); }));
    bar.appendChild(cap);
    bar.appendChild(btn("tjnx", "x_tj_next", "›", function(){ show(cur + 1); }));
    bar.appendChild(btn("tjzo", "z_out", "−", function(){ zoom(zi - 1); }));
    var z0 = btn("tjz0", "z_reset", "100%", function(){ zoom(0); }); bar.appendChild(z0);
    bar.appendChild(btn("tjzi", "z_in", "+", function(){ zoom(zi + 1); }));
    sc = el("div", "tjlb-sc");
    img = el("img", "tjlb-img"); img.alt = ""; img.draggable = false; img.decoding = "async";
    img.addEventListener("dblclick", function(){ zoom(zi ? 0 : 2); });
    sc.appendChild(img);
    sc.addEventListener("click", function(e){ if (e.target === sc) close(); });
    box.appendChild(bar); box.appendChild(sc);
    document.body.appendChild(box);
  }
  function relabel(){
    if (!box) return;
    box.querySelectorAll(".tjb").forEach(function(b){ var k = b.getAttribute("data-k"); b.title = T(k); b.setAttribute("aria-label", T(k)); });
    box.setAttribute("aria-label", T("x_tj_lb"));
    if (cur){ cap.textContent = T("x_tj_n", { n:N(cur) }) + " / " + N(MAX); img.alt = T("x_tj") + " — " + T("x_tj_n", { n:N(cur) }); }
  }
  function zoom(i){
    zi = Math.max(0, Math.min(ZS.length - 1, i));
    var z = ZS[zi];
    if (zi && !img.classList.contains("zoomed")) base = img.getBoundingClientRect().width || sc.clientWidth;
    img.classList.toggle("zoomed", zi > 0);
    img.style.width = zi ? Math.round(base * z) + "px" : "";
    if (zi){ var cx = (sc.scrollLeft + sc.clientWidth / 2) / (sc.scrollWidth || 1), cy = (sc.scrollTop + sc.clientHeight / 2) / (sc.scrollHeight || 1);
      requestAnimationFrame(function(){ sc.scrollLeft = cx * sc.scrollWidth - sc.clientWidth / 2; sc.scrollTop = cy * sc.scrollHeight - sc.clientHeight / 2; }); }
    var z0 = box.querySelector(".tjz0"); if (z0) z0.textContent = Math.round(z * 100) + "%";
  }
  function show(n){
    if (n < 1 || n > MAX) return;
    var src = document.querySelector("#p-" + n + " img"); if (!src) return;
    cur = n; img.src = src.getAttribute("src"); zoom(0); sc.scrollTop = 0; sc.scrollLeft = 0;
    box.querySelector(".tjpv").disabled = n <= 1; box.querySelector(".tjnx").disabled = n >= MAX;
    relabel();
  }
  function open(n){
    if (!box) build();
    lastFocus = document.activeElement;
    show(n); box.hidden = false; document.documentElement.classList.add("tj-open");
    if (!pushed){ try { history.pushState({ tjlb:1 }, "", location.href); pushed = true; } catch(e){} }
    var x = box.querySelector(".tjx"); if (x) x.focus();
  }
  function hide(){
    if (!box || box.hidden) return;
    box.hidden = true; document.documentElement.classList.remove("tj-open");
    if (lastFocus && lastFocus.focus){ try { lastFocus.focus({ preventScroll:true }); } catch(e){ lastFocus.focus(); } }
  }
  function close(){
    if (pushed){ pushed = false; history.back(); }  /* popstate → hide */
    hide();
  }
  window.addEventListener("popstate", function(){ pushed = false; hide(); });
  document.addEventListener("click", function(e){
    var b = e.target.closest ? e.target.closest(".tjopen") : null;
    if (!b) return;
    e.preventDefault(); open(parseInt(b.getAttribute("data-n"), 10));
  });
  document.addEventListener("keydown", function(e){
    if (!box || box.hidden) return;
    var k = e.key;
    if (k === "Escape"){ e.preventDefault(); close(); }
    else if (k === "+" || k === "="){ e.preventDefault(); zoom(zi + 1); }
    else if (k === "-" || k === "_"){ e.preventDefault(); zoom(zi - 1); }
    else if (k === "0"){ e.preventDefault(); zoom(0); }
    else if (k === "ArrowRight"){ e.preventDefault(); show(document.documentElement.dir === "rtl" ? cur - 1 : cur + 1); }
    else if (k === "ArrowLeft"){ e.preventDefault(); show(document.documentElement.dir === "rtl" ? cur + 1 : cur - 1); }
  });
  addEventListener("qk-lang", relabel);
})();
