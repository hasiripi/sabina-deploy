# sabina-deploy

sabinamalikova.com icin deploy asset deposu.

## Icerik

- `geo/` — **2026-07-06 GEO optimizasyon paketi.** `SABINA_GEO_OPTIMIZASYON_AUDIT_20260706.md`
  audit'inin bu depodan uygulanabilir cikti dosyalari: `sources.json` claims
  manifesti, `.htaccess` / `robots.txt` / `llms.txt` ek bloklari, sitemap
  `lastmod` guncelleme scripti ve OpenPR post-launch duzeltme taslagi.
  Uygulama adimlari icin `geo/README.md` dosyasina bakin.

- `seo.zip` — ⚠️ **ESKI build (2026-05-21). Deploy ETMEYIN.** Bu build,
  sonradan eklenen GEO altyapisini (ssr.php, llms.txt, ai.txt, methodology /
  news / longevity sayfalari) icermiyor ve deprecated "University of Chester"
  referansini hala tasiyor (index.html JSON-LD + About sayfasi bundle'i).
  Canli site cok daha yeni bir build calistiriyor; guncel deploy kaynak
  repodan (`sabinamalikova-archive/website`) alinmalidir. Zip yalnizca
  tarihsel kayit olarak duruyor.
