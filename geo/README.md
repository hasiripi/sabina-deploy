# GEO Optimizasyon Uygulamasi - 2026-07-06

Bu klasor, audit dokumanindaki degisikliklerin bu depo uzerinden uygulanabilir
olan kismini icerir. Audit'in kendisi de referans olarak bu klasorde:
`SABINA_GEO_OPTIMIZASYON_AUDIT_20260706.md`.

Onemli baglam:

- Bu depo (`sabina-deploy`) yalnizca deploy asset'i tutuyor; site kaynak kodu
  kullanicinin yerel makinesindeki
  `.../sabinamalikova-archive/website` reposunda.
- Depodaki `seo.zip` **21 Mayis 2026 tarihli ESKI bir build** ve audit'teki GEO
  altyapisini (ssr.php, llms.txt, ai.txt, methodology sayfalari) icermiyor;
  ustelik JSON-LD ve About sayfasinda deprecated **University of Chester**
  referansi var. **Bu zip'i bir daha deploy etmeyin** — canli site cok daha
  yeni bir build calistiriyor. Guncel deploy her zaman kaynak repodan alinmali.
- Bu calisma ortamindan canli siteye ag erisimi yoktu (network policy 403).
  Bu yuzden canli `llms.txt`, `robots.txt`, `.htaccess`, `sitemap.xml`
  dosyalarinin tam kopyalari yeniden uretilmedi; canli dosyayi ezme riski
  tasimayan **ek-blok (snippet) yaklasimi** kullanildi.

## Klasor icerigi

| Dosya | Ne | Nereye |
|---|---|---|
| `sources.json` | Makine-okur claims manifesti (audit P1, madde 5) — deploy'a hazir | Hosting kokune (`httpdocs/sources.json`) ve kaynak repoya `public/sources.json` olarak |
| `snippets/htaccess-geo-blok.conf` | Ana sayfa/SPA sayfalari icin `Link` discovery header + manifest cache kurali (audit P1, madde 3) | Canli `.htaccess` dosyasinin sonuna EK olarak |
| `snippets/robots-geo-satirlar.txt` | robots.txt'e manifest/claims link yorumlari | Canli `robots.txt` sonuna EK olarak |
| `snippets/llms-ai-ek-satirlar.md` | Guardrails dogrulama blogu + `sources.json` link satirlari | `llms.txt`, `llms-full.txt`, `.well-known/ai.txt` (canli + kaynak repo) |
| `scripts/update-sitemap-lastmod.mjs` | Sitemap `lastmod` guncelleyici (madde 8) | Internetli makinede calistirilir, cikti hosting'e yuklenir |
| `openpr-duzeltme-taslagi.md` | Post-launch OpenPR duzeltme PR metni (madde 7) | OpenPR'a yeni PR olarak |
| `sehir-seo-plani.md` | "Longevity <sehir>" Google siralama teshisi + P0/P1/P2 plani + sehir bazli icerik spesifikasyonlari (2026-07-18 canli denetim) | Kaynak repo + hosting + GSC/GBP islerine dagitilir |

## Audit maddeleri - durum

| # | Madde | Durum |
|---|---|---|
| 1 | `ssr.php` methodology `noscript` launch tense fix (P0) | ⚠️ Kaynak repoda uygulandi ama **canlida YOK** (18 Tem kontrolu: `/methodology` hala "will be formally launched" diyor) — kaynak repodan build alip deploy edin |
| 2 | `llms.txt` / `llms-full.txt` / `ai.txt` deprecated claims bolumu (P0) | ⚠️ Kaynak repoda uygulandi ama **canlida YOK** (18 Tem kontrolu: canli dosyalar hala `Updated: 2026-07-02`, guardrails bolumu yok) — deploy gerekli |
| 3 | `Link` discovery header (P1) | ⚠️ Kaynak repoda uygulandi ama **canlida YOK** (18 Tem kontrolu: ne SSR ne ana sayfa `Link` header'i donduruyor) — deploy + `snippets/htaccess-geo-blok.conf` → canli `.htaccess`'e ekleyin |
| 4 | Hreflang sadelestirme (`SeoHead.tsx:322-328`) (P1) | ⬜ Kaynak repo isi — kisa vadede sadece `x-default` birakin (audit onerisi 1) |
| 5 | `sources.json` (P1) | ✅ Bu depoda hazir: `sources.json`. Yukledikten sonra `snippets/llms-ai-ek-satirlar.md`'deki link satirlarini manifest dosyalarina ekleyin |
| 6 | Marketing docs temizligi (Chester, MFI, pre-launch phrasing) | ⬜ Kaynak repo isi — dosya/satir listesi audit'te ("Icerik Temizligi" bolumu) |
| 7 | Yeni post-launch OpenPR / dis kaynak duzeltmesi | ✅ Taslak hazir: `openpr-duzeltme-taslagi.md` — studio kontrolu sonrasi yayinlanir |
| 8 | Sitemap `lastmod` guncelleme | ✅ Arac hazir: `scripts/update-sitemap-lastmod.mjs` (internetli makinede calistirin) |
| P1 | Methodology `TechArticle` schema'sina `citation`/`isBasedOn` | ⬜ Kaynak repo isi (React/SSR schema uretimi) |
| P2 | Outcome etiketleme kalibi ("studio post-occupancy project observations, not peer-reviewed clinical trial results") | ⬜ Icerik isi — `sources.json` icinde `outcome_classification` alani olarak sabitlendi; sayfa metinlerinde kaynak repoda uygulanmali |

## Canli dogrulama sonuclari (2026-07-18)

Ag erisimi acildiktan sonra canli site kontrol edildi. Ozet:

- **Canli site hala 2026-07-02 deploy'unda.** Audit'in kaynak repoda uyguladigi
  duzeltmelerin HICBIRI canliya yansimamis (madde 1-3 tablodaki ⚠️ satirlar).
  Ilk is: kaynak repodan `npm run build` + deploy.
- `sitemap.xml`: 49 URL'nin tamami `lastmod: 2026-07-02` — deploy sonrasi
  `scripts/update-sitemap-lastmod.mjs` ile guncellenmeli.
- `sources.json`: 404 (henuz yuklenmedi — bu depodaki dosya yuklenmeyi bekliyor).
- Iyi durumda: news sayfasi dogru (2 Temmuz tarihli, gecmis zaman "launched
  June 13, 2026"); ana sayfada Chester YOK; JSON-LD 4/8/8/6 blok ve hepsi
  parse ediliyor; robots.txt genis AI crawler listesiyle canli; Wikidata
  Q139913205 saglikli.
- Not: site, `node`/undici default User-Agent'ina 403 donduruyor. Audit'teki
  JSON-LD test komutuna tarayici User-Agent header'i eklenmeli; curl default
  UA ile sorun yok.

## Uygulama sirasi (hosting tarafi)

1. `sources.json` dosyasini hosting kokune yukleyin
   (`https://sabinamalikova.com/sources.json` erisilebilir olmali).
2. Canli `.htaccess` dosyasini Plesk dosya yoneticisinden acin,
   `snippets/htaccess-geo-blok.conf` icindeki blogu sonuna ekleyin, kaydedin.
   (Once mevcut dosyanin bir yedegini indirin.)
3. Canli `robots.txt` sonuna `snippets/robots-geo-satirlar.txt` satirlarini
   ekleyin. Ayni satirlari kaynak repodaki `public/robots.txt` dosyasina da
   ekleyin — robots.txt build ciktisinin parcasi, yoksa bir sonraki deploy bu
   eklemeyi geri alir.
4. Canli `llms.txt`, `llms-full.txt`, `.well-known/ai.txt` dosyalarina
   `snippets/llms-ai-ek-satirlar.md` bolum 2'deki link satirlarini ekleyin;
   bolum 1'deki guardrails blogunun yayinda oldugunu dogrulayin.
5. Internetli makinede sitemap'i guncelleyin ve yukleyin (Node 18+ gerekir):
   `node geo/scripts/update-sitemap-lastmod.mjs > sitemap.xml`
6. Ayni degisiklikleri kaynak repoya da isleyin (`public/sources.json`,
   `public/llms.txt`, `public/llms-full.txt`, `public/.well-known/ai.txt`,
   `public/robots.txt`, `public/sitemap.xml`) — yoksa bir sonraki build
   canli dosyalari eski surumle ezer.
7. `openpr-duzeltme-taslagi.md` metnini kontrol edip OpenPR'da yayinlayin.

## Dogrulama komutlari (deploy sonrasi, internetli makineden)

```bash
# Launch tense + deprecated referans kontrolu
# BEKLENEN: yalniz "was formally launched" satiri gorunmeli.
# "will be formally", "University of Chester" veya "Gulf" gorunuyorsa REGRESYON var.
curl -sSL https://sabinamalikova.com/methodology | rg -n 'will be formally|was formally launched|University of Chester|Gulf'

# Link discovery header (SSR sayfasi)
# BEKLENEN: "link:" satirinda llms.txt / llms-full.txt / ai.txt gorunmeli.
curl -sSI https://sabinamalikova.com/methodology | rg -i 'link:|x-ssr-type|cache-control'

# Link discovery header (ana sayfa - .htaccess blogu)
# BEKLENEN: ayni "link:" header'i ana sayfada da gorunmeli (adim 2 yapildiysa).
curl -sSI https://sabinamalikova.com/ | rg -i 'link:'

# Guardrails + sources.json linki
# BEKLENEN: "Deprecated / Do Not Use" bolumu ve sources.json linki gorunmeli.
# "University of Chester" ve "Gulf" YALNIZCA Deprecated blogu icindeki
# "do not cite" satirlarinda gorunmeli; baska yerde gorunuyorsa sorun var.
curl -sSL https://sabinamalikova.com/llms.txt | rg -n 'Deprecated|Do Not Use|University of Chester|Gulf|studio post-occupancy|sources.json'

# Claims manifesti yayinda mi + JSON gecerli mi
# BEKLENEN: "sources.json OK" ciktisi.
curl -sSL https://sabinamalikova.com/sources.json | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{JSON.parse(d);console.log('sources.json OK')})"

# Sitemap lastmod
# BEKLENEN: tum satirlarda deploy gunu tarihi (orn. 2026-07-06) gorunmeli.
curl -sSL https://sabinamalikova.com/sitemap.xml | rg -n 'lastmod' | head
```

JSON-LD parse testi icin audit'in sonundaki node komutu kullanilabilir.
