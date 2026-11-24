# قرآنِ حکیم — مکمل ۳۰ پارے (Quran Kareem, all 30 paras)

A static website of the complete Quran (16-line, four-colour tajweed Indo-Pak mushaf, 549 pages)
built in the same style as the teacher's Para 1 and Para 3 sample pages (مجتبٰی آن لائن قرآن اکیڈمی).

- `index.html` is the home page. It has a card for each of the 30 paras and a searchable table of all 114 surahs.
- `para-01.html` … `para-30.html` hold one para each, with ayah-by-ayah and word-by-word highlighting and mistake marking (the same engine as the Para 3 sample).
- Every page has a **para dropdown** and a **surah dropdown**, plus links to the previous/next para and back to the home page.
- Choosing a surah opens the right para and scrolls to the surah's heading. Direct links look like `para-15.html#s18`.
- `pages/NNN.jpg` are the mushaf page images, named by the printed page number (001 = cover).
- `assets/` holds the shared CSS/JS (`style.css`, `para.js`, `nav.js`, `data.js`) and the logo.

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
