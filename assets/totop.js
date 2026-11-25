/* v4.7: اوپر جائیں — floating back-to-top button (icon only). Shown after scrolling down; smooth-scrolls to the top. */
(function () {
  "use strict";
  if (document.querySelector(".totop")) return;
  var b = document.createElement("button");
  b.type = "button"; b.className = "totop notranslate"; b.setAttribute("translate", "no");
  b.setAttribute("aria-label", "اوپر جائیں"); b.title = "اوپر جائیں";
  b.setAttribute("data-i18n-aria-label", "x_totop"); b.setAttribute("data-i18n-title", "x_totop");
  b.setAttribute("tabindex", "-1"); b.setAttribute("aria-hidden", "true");
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4.6 4.2 12.4l1.9 1.9 4.55-4.55V19.4h2.7V9.75l4.55 4.55 1.9-1.9z"/></svg>';
  var sp = document.createElement("div"); sp.className = "totop-sp"; sp.setAttribute("aria-hidden", "true");
  function mount() {
    document.body.appendChild(sp); document.body.appendChild(b); document.body.classList.add("has-totop");
    upd();
  }
  var shown = false, ticking = false;
  function upd() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var on = y > Math.max(320, window.innerHeight * 0.6);
    if (on === shown) return;
    shown = on; b.classList.toggle("show", on);
    b.setAttribute("aria-hidden", on ? "false" : "true"); b.setAttribute("tabindex", on ? "0" : "-1");
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  window.addEventListener("resize", upd, { passive: true });
  b.addEventListener("click", function () {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try { window.scrollTo({ top: 0, left: window.pageXOffset, behavior: reduce ? "auto" : "smooth" }); } catch (e) { window.scrollTo(0, 0); }
    b.blur();
  });
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
