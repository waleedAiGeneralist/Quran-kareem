/* ابتدائی زبان / انداز — ہر صفحے کی پہلی جھلک سے پہلے */
(function(){var h=document.documentElement;try{var l=localStorage.getItem("qk-lang");if(l==="ar"||l==="en"){h.lang=l;h.dir=l==="en"?"ltr":"rtl";if(l!=="ur"){h.classList.add("i18n-pending");setTimeout(function(){h.classList.remove("i18n-pending");},1500);}}
var t=localStorage.getItem("qk-theme");if(t!=="dark"&&t!=="light")t=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";h.setAttribute("data-theme",t);
if(localStorage.getItem("qk-hdr")==="0")h.classList.add("hdr-off");}catch(e){h.setAttribute("data-theme","light");}})();
(function(){var h=document.documentElement;if(h.getAttribute("data-page")==="home"){try{if(!sessionStorage.getItem("qk-splash")){h.classList.add("splash-on");sessionStorage.setItem("qk-splash","1");}}catch(e){}}})();
