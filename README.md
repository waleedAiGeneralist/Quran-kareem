# قرآنِ حکیم — Quran Kareem

Static site for **Mujtaba Online Quran Academy** (مجتبیٰ آن لائن قرآن اکیڈمی): the complete 16-line, four-colour tajweed Indo-Pak mushaf (549 pages) and the academy’s lesson sections.

**Live:** https://waleedaigeneralist.github.io/Quran-kareem/

GitHub Pages serves this repository from branch `main`, folder `/` (root).

## Sections

Home tiles in `index.html`, in order:

1. Quran (`quran.html`) — 30 paras and all 114 surahs
2. Noorani Qaida (`qaida.html`)
3. Six Kalimas (`kalimas.html`)
4. Namaz and Wudu (`namaz-wudu.html`)
5. Asma ul Husna (`asma-ul-husna.html`)
6. Asma al-Nabi ﷺ (`asma-un-nabi.html`)
7. Daily Duas (`daily-duas.html`)
8. Rabbana duas (`rabbana-duas.html`)
9. Ahadith (`ahadith.html`)
10. Tajweed Course (`tajweed.html`) — 49 lessons
11. Islamic Knowledge (`islamic-knowledge.html`) — Bahishti Zewar and Taleem ul Islam; website only, hidden in the Android app

`para-01.html` … `para-30.html` hold one para each, with a para dropdown, a surah dropdown, and previous/next links. `pages/NNN.jpg` are the mushaf scans, named by the printed page number (`001` is the cover). Choosing a surah opens the right para and scrolls to that surah, for example `para-15.html#s18`.

## Run locally

Any static file server works. From the repository root:

```bash
python3 -m http.server
```

Then open http://127.0.0.1:8000/ . Paths are relative, so the site also opens if you load `index.html` directly, but a local server is the better check for scripts and the cache-buster query strings.

## Android app

The offline app is built from a copy of this site. The published release is v1.0:

https://github.com/waleedAiGeneralist/Quran-kareem/releases/download/v1.0/QuranKareem-v1.apk

Islamic Knowledge is not part of the app. See `AGENTS.md` before making a new APK copy.

## For contributors and agents

Read [AGENTS.md](AGENTS.md) before editing. It has the file map, the rules for Quranic text, `qaida.html`, the Content-Security-Policy, and the cache-buster, plus a short version history.

## Already on the site

These earlier notes are still true:

- Hide or show the top bar (remembered on the device), and page zoom from 50% to 250%.
- Academy links (moqacademy.pk and onlinequranstudy.com) and a footer with the websites and WhatsApp.
- Language switch اردو / عربي / English, saved on the device. English uses a left-to-right layout. Only the interface text changes; the Quran pages do not.
- Light and dark theme, following the device until a choice is saved.
- Fonts, loaded only from the hosts already allowed by each page’s Content-Security-Policy (`fonts.googleapis.com` and `fonts.gstatic.com`): Noto Naskh Arabic, Amiri, Gulzar, Scheherazade New, Inter, and Poppins.
