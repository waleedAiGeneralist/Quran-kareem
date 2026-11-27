# AGENTS.md

This file is for AI coding agents working on [waleedAiGeneralist/Quran-kareem](https://github.com/waleedAiGeneralist/Quran-kareem). Read it before editing. The live site is the source of truth for behaviour; this file records how the repo is put together and what must not change.

## What this project is

A static website of the Quran Kareem for **Mujtaba Online Quran Academy** (مجتبیٰ آن لائن قرآن اکیڈمی). It is a 16-line, four-colour tajweed Indo-Pak mushaf (549 page images) plus lesson sections: Qaida, Kalimas, Namaz and Wudu, the divine names, duas, ahadith, a Tajweed course, and a website-only Islamic Knowledge reader.

- Live site: https://waleedaigeneralist.github.io/Quran-kareem/
- Hosting: GitHub Pages, deploy from branch `main`, folder `/` (root). An empty `.nojekyll` file is at the repo root so Pages serves the files as-is.
- Android: the same site is wrapped as an offline APK. The published build is [Quran Kareem Android App v1.0](https://github.com/waleedAiGeneralist/Quran-kareem/releases/tag/v1.0): https://github.com/waleedAiGeneralist/Quran-kareem/releases/download/v1.0/QuranKareem-v1.apk. The APK is built from a **copy** of the site, not from this git tree directly. Inside the app, `assets/v4.js` detects `appassets.androidplatform.net`, adds `html.qk-app`, hides `.web-only`, and sends Islamic Knowledge pages back to `index.html`.

There is no build step and no package manager. Pages are hand-written HTML, CSS, and JS.

## Structure

Home tiles in `index.html`, in this order:

| Tile | Page | Notes |
| --- | --- | --- |
| قرآن کریم | `quran.html` | 30 paras, 114 surahs, page-number search. Surah links look like `para-15.html#s18`. |
| نورانی قاعدہ | `qaida.html` | Mujtaba Qaida. Do not edit. |
| چھ کلمے | `kalimas.html` | Six kalimas. Images in `img/kalima/`. |
| نماز و وضو | `namaz-wudu.html` | Hub. Subpages `nm-azan.html`, `nm-book.html`, `nm-duas.html`, `nm-eid.html`, `nm-iman.html`, `nm-janaza.html`, `nm-roza.html`, `nm-tareeqa.html`, `nm-text.html`, `nm-wudu.html`. Images in `img/namaz/` and `img/wudu/`. |
| اسماء الحسنیٰ | `asma-ul-husna.html` | Images in `img/asma/`. |
| اسماء النبی ﷺ | `asma-un-nabi.html` | Text, not the old `img/nabi/` scans (those were removed). |
| روزمرہ دعائیں | `daily-duas.html` | 41 dua cards, still images in `img/duas/`. |
| رَبَّنَا دعائیں | `rabbana-duas.html` | Images in `img/rabbana/`. |
| احادیث | `ahadith.html` | Hub. `hadith.html` is 60 ahadith as text. `chalis-hadith.html` is 40 ahadith as text plus English. |
| تجوید کورس | `tajweed.html` | 49 lessons, `img/tajweed/01.webp`–`49.webp`. A normal section: it shows on the website and in the app. |
| اسلامی معلومات | `islamic-knowledge.html` | **Website only** (tile class `web-only`). |

Other important files:

- `para-01.html` … `para-30.html` — one para each. Mushaf scans are `pages/001.jpg` … `pages/549.jpg` (001 is the cover).
- `assets/qw/para-01.js` … `para-30.js` — word-box data for the para highlighter.
- `assets/hl.js` — word highlighter on text pages (1–4 words). `assets/parahl.js` plus `assets/parahl.css` — the same idea on para pages, including Bismillah and headers.
- `assets/i18n.js` and `assets/i18n-x.js` — Urdu, Arabic, and English. Only interface strings change; Quran text does not.
- `assets/pagego.js` and `assets/pagego.css` — page or lesson search (Quran pages, book mode, Tajweed lessons 1–49).
- `assets/totop.js` and `assets/totop.css` — back-to-top button.
- `assets/book.js` — page reader used by Bahishti Zewar (475 pages) and Taleem ul Islam (231 pages).
- `assets/tj.js` — Tajweed card viewer (zoom, next/previous, close).
- `assets/waqf.js`, `assets/waqf.css`, `assets/waqf/para-01.js`–`para-30.js` — waqf (stop-sign) colouring on para pages. A toggle, off by default. Each data file lists every printed stop sign as `[x, y, type, path]` in scan pixels; `path` traces only the sign's own black ink pixels.
- `assets/v4.js` and `assets/v4.css` — shared shell: theme, app detection, layout. `assets/style.css`, `assets/boot.js`, `assets/nav.js`, `assets/para.js`, `assets/data.js`, `assets/index.js`, and `assets/qnames.css` are the older shared pieces still loaded by the shell.
- `img/ik/bz/` — Bahishti Zewar pages `001.webp`–`475.webp` plus `thumb.webp`. `img/ik/ti/` — Taleem ul Islam `001.webp`–`231.webp` plus `thumb.webp`.
- `assets/logo.jpg` — academy logo.

## Hard rules

1. **Do not change Quranic or religious wording.** Arabic, Urdu translations, and lesson text must match the academy source exactly. If something looks wrong, flag it for the teacher. Do not silently “fix” it.
2. **Do not modify `qaida.html`.** The Mujtaba Qaida design stays as it is, including its lack of a `?v=` cache-buster.
3. **Keep the Content-Security-Policy.** The policy on each page is `default-src 'self'`, with `script-src 'self'` and the two Google Fonts hosts already listed (`https://fonts.googleapis.com` for styles, `https://fonts.gstatic.com` for font files). Do not add inline scripts, other CDNs, analytics, or trackers. New behaviour goes in an external file under `assets/`.
4. **Every page keeps `translate="no"` and `class="notranslate"`** so the browser does not auto-translate the Quran.
5. **Bump `?v=NN` on each release** on every page and asset reference, except `qaida.html`. The current value is **53**. A docs-only commit does not need a bump.
6. **Islamic Knowledge is website only.** That is `islamic-knowledge.html`, `ik-bahishti-zewar.html`, `ik-taleem-ul-islam.html`, `img/ik/`, and the `assets/book.js` usage on those pages. Elements with class `web-only` are hidden in the app. Exclude these files from any APK copy. Tajweed is not in this group.
7. **Do not add source PDFs or download links** for the books, slides, or mushaf.
8. **Waqf colouring tints only the stop sign's own ink pixels** (teacher's rule). Never draw circles, boxes, or highlights on Quran words or letters, and never edit the page images. Do not change sign positions or types in `assets/waqf/` without the teacher's approval.
9. **Check layout before pushing a visual change:** 360px, 390px, and desktop; Urdu RTL; no horizontal scroll; no console errors. Also glance at Arabic and English if the change touches `i18n-x.js`.

## Workflow

- Commit style: `vX.Y: summary` for a site release, or `docs: …` when only documentation changes.
- Push straight to `main`.
- After Pages finishes (often about a minute, longer when many images change), live-check the URLs you touched. Confirm status 200 and the strings or assets the change was supposed to add.
- If the Pages deploy fails with HTTP 500, or the build never updates, push an empty commit: `git commit --allow-empty -m "Retrigger Pages build"` and push `main` again. GitHub Pages has returned that 500 from its own deploy API before; the site files were fine.

## Contact

Owner **Waleed Ahmed** (GitHub [waleedAiGeneralist](https://github.com/waleedAiGeneralist)) approves changes. Content questions go to the academy teacher through Waleed. Do not invent wording while you wait.

When you finish a change, add a short note under Handoff notes: date, version, what changed, and anything still open.

## Handoff notes

Open items:

- APK v2 is on hold until the teacher approves the wording. v1.0 is the only published release. Any future APK copy must omit the Islamic Knowledge files.
- Para word-box accuracy is about 93%. Report para pages that look off; do not silently rewrite `assets/qw/`.
- Most `nm-*.html` pages and `daily-duas.html` are still slide images, so the word highlighter does not run there. `nm-eid.html` is the exception: it loads `hl.js` and also shows `img/namaz/eid-chart.webp`.

Version history on `main` (newest first):

- 2026-11-27, v5.3: Waqf stop-sign colouring on para pages (`assets/waqf.js`, `assets/waqf.css`, `assets/waqf/para-01.js`–`30.js`, `x_wq_*` keys in `i18n-x.js`). Toggle, off by default. It tints only the sign's own ink pixels and never draws on Quran words (teacher's rule). Cache `?v=53`. `qaida.html` and page images untouched.
- 2026-11-26, v5.2 (`4ff53e5`): Tajweed Course section, 49 lesson cards, `assets/tj.js`, cache `?v=52`. `qaida.html` untouched.
- 2026-11-26, v5.1 (`a94b35f`): Islamic Knowledge (Bahishti Zewar 475 pages, Taleem ul Islam 231 pages). Website only. `?v=51`.
- 2026-11-26, v5.0 (`961e79d`): Highlighter buttons for 1/2/3/4 words. Cache `?v=50`.
- 2026-11-26, v4.9 (`2d3798b`): Para-page word highlighter, including Bismillah and headers. `?v=49`.
- 2026-11-25, v4.8 (`a88d6d2`): Namaz, Eidain ka tareeqa (`nm-eid.html` and the Eid chart).
- 2026-11-25, v4.7 (`4d65782`): 60 Ahadith as text, back-to-top button. Removed unused `img/hadith/`.
- 2026-11-25, v4.6 (`43e7d12`): Home tile order Quran, Qaida, Kalimas, Namaz, Asma, Nabi, Duas, Rabbana, Hadith.
- 2026-11-25, v4.5 (`4ad765f`): Quran page-number search.
- 2026-11-25, v4.4 (`674f6d5`): Namaz-e-Janaza slides, Chalis Ahadith as text plus English.
- 2026-11-25, v4.3 (`0c0c898`): Word highlighter, i18n key fixes, RTL dropdown fix. Removed unused `img/nabi/`.
- 2026-11-25, v4.2 (`f2e5586`): Asma al-Nabi as text, Namaz and Hadith subsections, Arabic font, para 8 name.
- 2026-11-25, v4.1 (`3f02d45`): Block browser auto-translate, Quran Kareem tile label.
- 2026-11-25, v4 (`be75d12`): Home screen, Islamic sections, CSP.
- 2026-11-24, v3 (`7ef300b`): Spacing, fonts, Urdu/Arabic/English switch, dark/light theme.
- 2026-11-24, v2 (`a2f00db`): Hide/show header, page zoom, compact header, academy links, Google Fonts.
- 2026-11-24: Initial site on `main` (shell, then `pages/001.jpg`–`549.jpg`). APK v1.0 published as a GitHub Release asset, not as a git file.
