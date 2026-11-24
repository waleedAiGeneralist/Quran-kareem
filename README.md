# قرآنِ حکیم — مکمل ۳۰ پارے (Quran Kareem, all 30 paras)

A static website of the complete Quran (16-line, four-colour tajweed Indo-Pak mushaf, 549 pages)
built in the same style as the teacher's Para 1 and Para 3 sample pages (مجتبٰی آن لائن قرآن اکیڈمی).

- `index.html` is the home page. It has a card for each of the 30 paras and a searchable table of all 114 surahs.
- `para-01.html` … `para-30.html` hold one para each, with ayah-by-ayah and word-by-word highlighting and mistake marking (the same engine as the Para 3 sample).
- Every page has a **para dropdown** and a **surah dropdown**, plus links to the previous/next para and back to the home page.
- Choosing a surah opens the right para and scrolls to the surah's heading. Direct links look like `para-15.html#s18`.
- `pages/NNN.jpg` are the mushaf page images, named by the printed page number (001 = cover).
- `assets/` holds the shared CSS/JS (`style.css`, `para.js`, `nav.js`, `data.js`, `i18n.js`, `index.js`) and the logo.

## v2 (client feedback)
- **پٹی چھپائیں / پٹی دکھائیں**: hide the whole top bar for a full-screen mushaf; a small floating button brings it back (remembered on the device).
- **Page zoom** (− ۱۰۰٪ +, 50%–250% in 25% steps, keyboard `+` `-` `0`); highlights stay aligned at every zoom; browser pinch-zoom still works.
- Compact header (2 rows on desktop, 4 slim rows on phones), Google Fonts (Noto Nastaliq Urdu, Noto Naskh Arabic, Poppins).
- Academy links on every mushaf page (moqacademy.pk / onlinequranstudy.com) and a footer with Facebook, websites and WhatsApp.

## v3
- Roomier layout (centred header with consistent padding and gaps; padded content, index and footer).
- Fonts: Noto Naskh Arabic for Urdu/Arabic UI, Amiri for Quranic para/surah names, Gulzar for the large academy name, Inter + Poppins for English.
- Language switch اردو / عربي / English (saved on the device; English switches the layout to left-to-right). Only the website text changes; the Quran pages and data never change.
- Light / dark theme button (follows the device setting until you choose; saved on the device).

## Host on GitHub Pages
1. Create a new repository on GitHub (e.g. `quran-kareem`).
2. Upload the **contents** of this folder to the repository root. `index.html` must be at the top level.
   - With git:
     ```
     git init
     git add .
     git commit -m "Quran Kareem site"
     git branch -M main
     git remote add origin https://github.com/<your-user>/quran-kareem.git
     git push -u origin main
     ```
   - Or use GitHub's web "Add file → Upload files". There are about 590 files and roughly 155 MB in total. The largest file is about 330 KB, so it is well under GitHub's limits. You can upload in a few batches if needed.
3. In the repository go to **Settings → Pages**. Under "Build and deployment" pick **Deploy from a branch**, then branch `main` and folder `/ (root)`. Save.
4. After a minute the site is live at `https://<your-user>.github.io/quran-kareem/`.

All paths are relative, so the site also works when you open `index.html` straight from your computer.
